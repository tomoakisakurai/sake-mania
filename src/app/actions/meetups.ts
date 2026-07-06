'use server';
import { eq, and, inArray, desc, asc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import { createNotification, createNotificationForAll } from './notifications';

export interface MeetupView {
  id: string;
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  theme: string;
  hostName: string;
  phase: string;
  voteDeadline: string;
  goingCount: number;
  bringCount: number;
  iGoing: boolean;
  mvpBrandId: string | null;
}

export interface MeetupDetail {
  id: string;
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  theme: string;
  hostName: string;
  phase: string;
  voteDeadline: string;
  isHost: boolean;
  iGoing: boolean;
  attendees: { name: string; avatar: string; avatarBg: string }[];
  goingCount: number;
  brings: { brandId: string; note: string; memberName: string; avatar: string; avatarBg: string; mine: boolean }[];
  myBringBrandId: string | null;
  voteCounts: Record<string, number>;
  myVoteBrandId: string | null;
}

async function currentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// profiles行が無い場合のみ作成する。表示名の source of truth は profiles
// なので、user_metadata の値で既存行を上書きしない。
async function ensureProfile(userId: string, meta: { nickname?: string }, email?: string | null) {
  const db = getDb();
  if (!db) return;
  const nickname = (meta.nickname && meta.nickname.trim()) || (email ? email.split('@')[0] : 'sake_user');
  await db.insert(schema.profiles)
    .values({ id: userId, nickname, avatar: nickname.charAt(0) || '酒', avatarBg: '#DDD3BE' })
    .onConflictDoNothing({ target: schema.profiles.id });
}

export async function createMeetup(input: { name: string; dateLabel: string; place: string; theme: string; eventDate?: string }): Promise<string | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return null;
  await ensureProfile(user.id, (user.user_metadata || {}) as { nickname?: string }, user.email);
  const [row] = await db.insert(schema.meetupEvents).values({
    name: input.name, dateLabel: input.dateLabel, place: input.place, theme: input.theme,
    eventDate: input.eventDate || null, hostId: user.id, phase: 'before',
  }).returning({ id: schema.meetupEvents.id });
  // host auto-attends
  await db.insert(schema.meetupAttendees).values({ meetupId: row.id, userId: user.id }).onConflictDoNothing();
  // 全メンバー(自分以外)に通知
  await createNotificationForAll({
    kind: 'meetup_created',
    text: `新しいSAKE MEETUP「${input.name}」が立ちました`,
    targetPath: `/meetup/${row.id}`,
    excludeUserId: user.id,
  });
  return row.id;
}

export async function updateMeetup(meetupId: string, input: { name: string; dateLabel: string; place: string; theme: string; eventDate?: string }): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const updated = await db.update(schema.meetupEvents)
    .set({
      name: input.name,
      dateLabel: input.dateLabel,
      place: input.place,
      theme: input.theme,
      eventDate: input.eventDate || null,
    })
    .where(and(eq(schema.meetupEvents.id, meetupId), eq(schema.meetupEvents.hostId, user.id)))
    .returning({ id: schema.meetupEvents.id });
  return updated.length > 0;
}

export async function getMeetups(): Promise<MeetupView[]> {
  const db = getDb();
  if (!db) return [];
  // currentUser()はSupabase Authへの往復を伴うため、events取得と並行させる。
  const eventsPromise = db.select().from(schema.meetupEvents).orderBy(asc(schema.meetupEvents.eventDate));
  const userPromise = currentUser();
  const events = await eventsPromise;
  if (!events.length) return [];
  const user = await userPromise;
  const ids = events.map((e) => e.id);
  const [attendees, brings, votes] = await Promise.all([
    db.select().from(schema.meetupAttendees).where(inArray(schema.meetupAttendees.meetupId, ids)),
    db.select().from(schema.meetupBrings).where(inArray(schema.meetupBrings.meetupId, ids)),
    db.select().from(schema.meetupVotes).where(inArray(schema.meetupVotes.meetupId, ids)),
  ]);
  // profilesは全件ではなく、一覧に出る幹事(host)のぶんだけに絞る
  const hostIds = Array.from(new Set(events.map((e) => e.hostId)));
  const profiles = hostIds.length
    ? await db.select().from(schema.profiles).where(inArray(schema.profiles.id, hostIds))
    : [];
  const nameOf = (uid: string) => profiles.find((p) => p.id === uid)?.nickname || 'sake_user';
  // 各MEETUPの最多得票の銘柄（結果確定カードのMVP表示用）
  const mvpOf = (meetupId: string): string | null => {
    const counts: Record<string, number> = {};
    for (const v of votes) if (v.meetupId === meetupId) counts[v.brandId] = (counts[v.brandId] || 0) + 1;
    let best: string | null = null;
    let bestN = 0;
    for (const [bid, n] of Object.entries(counts)) if (n > bestN) { best = bid; bestN = n; }
    return best;
  };
  return events.map((e) => ({
    id: e.id, name: e.name, dateLabel: e.dateLabel, eventDate: e.eventDate ?? null, place: e.place, theme: e.theme,
    hostName: nameOf(e.hostId), phase: e.phase, voteDeadline: e.voteDeadline || '',
    goingCount: attendees.filter((a) => a.meetupId === e.id).length,
    bringCount: brings.filter((b) => b.meetupId === e.id).length,
    iGoing: !!user && attendees.some((a) => a.meetupId === e.id && a.userId === user.id),
    mvpBrandId: mvpOf(e.id),
  }));
}

export async function getMeetupDetail(meetupId: string): Promise<MeetupDetail | null> {
  const db = getDb();
  if (!db) return null;
  // currentUser()はSupabase Authへの往復を伴うため、event取得と並行させる。
  const eventPromise = db.select().from(schema.meetupEvents).where(eq(schema.meetupEvents.id, meetupId));
  const userPromise = currentUser();
  const [event] = await eventPromise;
  if (!event) return null;
  const user = await userPromise;
  // 出欠・持ち寄り・投票はmeetupIdで絞って取得
  const [attendees, brings, votes] = await Promise.all([
    db.select().from(schema.meetupAttendees).where(eq(schema.meetupAttendees.meetupId, meetupId)),
    db.select().from(schema.meetupBrings).where(eq(schema.meetupBrings.meetupId, meetupId)),
    db.select().from(schema.meetupVotes).where(eq(schema.meetupVotes.meetupId, meetupId)),
  ]);
  // profilesは全件ではなく、この会に関係するuser(幹事+出欠+持ち寄り)だけに絞る
  const uids = Array.from(new Set<string>([event.hostId, ...attendees.map((a) => a.userId), ...brings.map((b) => b.userId)]));
  const profiles = uids.length
    ? await db.select().from(schema.profiles).where(inArray(schema.profiles.id, uids))
    : [];
  const prof = (uid: string) => profiles.find((p) => p.id === uid);
  const nameOf = (uid: string) => prof(uid)?.nickname || 'sake_user';

  const voteCounts: Record<string, number> = {};
  for (const v of votes) voteCounts[v.brandId] = (voteCounts[v.brandId] || 0) + 1;
  const myVote = user ? votes.find((v) => v.userId === user.id) : undefined;
  const myBring = user ? brings.find((b) => b.userId === user.id) : undefined;

  return {
    id: event.id, name: event.name, dateLabel: event.dateLabel, eventDate: event.eventDate ?? null, place: event.place, theme: event.theme,
    hostName: nameOf(event.hostId), phase: event.phase, voteDeadline: event.voteDeadline || '',
    isHost: !!user && event.hostId === user.id,
    iGoing: !!user && attendees.some((a) => a.userId === user.id),
    attendees: attendees.map((a) => { const p = prof(a.userId); const n = p?.nickname || 'sake_user'; return { name: n, avatar: p?.avatar || n.charAt(0), avatarBg: p?.avatarBg || '#DDD3BE' }; }),
    goingCount: attendees.length,
    brings: brings.map((b) => { const p = prof(b.userId); const n = p?.nickname || 'sake_user'; return { brandId: b.brandId, note: b.note, memberName: n, avatar: p?.avatar || n.charAt(0), avatarBg: p?.avatarBg || '#DDD3BE', mine: !!user && b.userId === user.id }; }),
    myBringBrandId: myBring?.brandId ?? null,
    voteCounts,
    myVoteBrandId: myVote?.brandId ?? null,
  };
}

export async function toggleGoing(meetupId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const existing = await db.select().from(schema.meetupAttendees)
    .where(and(eq(schema.meetupAttendees.meetupId, meetupId), eq(schema.meetupAttendees.userId, user.id)));
  if (existing.length) {
    await db.delete(schema.meetupAttendees).where(and(eq(schema.meetupAttendees.meetupId, meetupId), eq(schema.meetupAttendees.userId, user.id)));
  } else {
    await db.insert(schema.meetupAttendees).values({ meetupId, userId: user.id }).onConflictDoNothing();
  }
  return true;
}

export async function declareBring(meetupId: string, brandId: string, note: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !brandId) return false;
  await ensureProfile(user.id, (user.user_metadata || {}) as { nickname?: string }, user.email);
  await db.insert(schema.meetupBrings)
    .values({ meetupId, userId: user.id, brandId, note })
    .onConflictDoUpdate({ target: [schema.meetupBrings.meetupId, schema.meetupBrings.userId], set: { brandId, note } });
  await db.insert(schema.meetupAttendees).values({ meetupId, userId: user.id }).onConflictDoNothing();
  // 幹事に通知
  const [meetup] = await db.select().from(schema.meetupEvents).where(eq(schema.meetupEvents.id, meetupId));
  const [actor] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  if (meetup) {
    await createNotification({
      userId: meetup.hostId,
      kind: 'bring_declared',
      text: `${actor?.nickname || 'メンバー'}さんが「${meetup.name}」に持ち寄りを宣言しました`,
      targetPath: `/meetup/${meetupId}`,
      excludeUserId: user.id,
    });
  }
  return true;
}

export async function cancelBring(meetupId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  await db.delete(schema.meetupBrings).where(and(eq(schema.meetupBrings.meetupId, meetupId), eq(schema.meetupBrings.userId, user.id)));
  return true;
}

export async function voteMvp(meetupId: string, brandId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const existing = await db.select().from(schema.meetupVotes)
    .where(and(eq(schema.meetupVotes.meetupId, meetupId), eq(schema.meetupVotes.userId, user.id)));
  if (existing.length && existing[0].brandId === brandId) {
    await db.delete(schema.meetupVotes).where(and(eq(schema.meetupVotes.meetupId, meetupId), eq(schema.meetupVotes.userId, user.id)));
  } else {
    await db.insert(schema.meetupVotes)
      .values({ meetupId, userId: user.id, brandId })
      .onConflictDoUpdate({ target: [schema.meetupVotes.meetupId, schema.meetupVotes.userId], set: { brandId } });
  }
  return true;
}

export async function setMeetupPhase(meetupId: string, phase: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const updated = await db.update(schema.meetupEvents)
    .set({ phase })
    .where(and(eq(schema.meetupEvents.id, meetupId), eq(schema.meetupEvents.hostId, user.id)))
    .returning({ id: schema.meetupEvents.id });
  if (!updated.length) return false;
  // 出席者に通知
  const [meetup] = await db.select().from(schema.meetupEvents).where(eq(schema.meetupEvents.id, meetupId));
  if (meetup && (phase === 'voting' || phase === 'closed')) {
    const attendees = await db.select().from(schema.meetupAttendees).where(eq(schema.meetupAttendees.meetupId, meetupId));
    const text = phase === 'voting'
      ? `「${meetup.name}」のMVP投票が始まりました`
      : `「${meetup.name}」のMVPが確定しました`;
    for (const attendee of attendees) {
      await createNotification({
        userId: attendee.userId,
        kind: phase === 'voting' ? 'vote_open' : 'vote_closed',
        text,
        targetPath: `/meetup/${meetupId}`,
        excludeUserId: user.id,
      });
    }
  }
  return true;
}

export async function deleteMeetup(meetupId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const deleted = await db.delete(schema.meetupEvents)
    .where(and(eq(schema.meetupEvents.id, meetupId), eq(schema.meetupEvents.hostId, user.id)))
    .returning({ id: schema.meetupEvents.id });
  return deleted.length > 0;
}
