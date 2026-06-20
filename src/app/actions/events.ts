'use server';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import { createNotification, createNotificationForAll } from './notifications';

export type EventStatus = 'going' | 'interested';

export interface EventView {
  id: string;
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  venueQ: string;
  kuras: number;
  fee: string;
  officialUrl: string;
  description: string;
  createdBy: string;
  goingCount: number;
  interestedCount: number;
  iGoing: boolean;
  iInterested: boolean;
  goingAvatars: { name: string; avatar: string; avatarBg: string }[];
}

export interface EventCommentView {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  avatarBg: string;
  text: string;
  edited: boolean;
  createdAt: string;
  mine: boolean;
}

export interface EventDetail extends EventView {
  isCreator: boolean;
  comments: EventCommentView[];
  goingMembers: { name: string; avatar: string; avatarBg: string }[];
}



export interface EventInput {
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  fee: string;
  officialUrl: string;
  description: string;
}

async function currentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getEvents(): Promise<EventView[]> {
  const db = getDb();
  if (!db) return [];
  const eventsPromise = db.select().from(schema.events).orderBy(asc(schema.events.eventDate));
  const userPromise = currentUser();
  const rows = await eventsPromise;
  if (!rows.length) return [];
  const user = await userPromise;
  const ids = rows.map((row) => row.id);
  const attendees = await db.select().from(schema.eventAttendees).where(inArray(schema.eventAttendees.eventId, ids));
  // 参加表明者のプロフィール(アイコン表示用)を一括取得
  const goingUserIds = Array.from(new Set(attendees.filter((a) => a.status === 'going').map((a) => a.userId)));
  const profiles = goingUserIds.length
    ? await db.select().from(schema.profiles).where(inArray(schema.profiles.id, goingUserIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  return rows.map((row) => {
    const eventAttendees = attendees.filter((attendee) => attendee.eventId === row.id);
    const goingCount = eventAttendees.filter((attendee) => attendee.status === 'going').length;
    const interestedCount = eventAttendees.filter((attendee) => attendee.status === 'interested').length;
    const iGoing = !!user && eventAttendees.some((a) => a.userId === user.id && a.status === 'going');
    const iInterested = !!user && eventAttendees.some((a) => a.userId === user.id && a.status === 'interested');
    const goingAvatars = eventAttendees
      .filter((a) => a.status === 'going')
      .slice(0, 5)
      .map((a) => {
        const profile = profileMap.get(a.userId);
        return {
          name: profile?.nickname || 'sake_user',
          avatar: profile?.avatar || '酒',
          avatarBg: profile?.avatarBg || '#DDD3BE',
        };
      });
    return {
      id: row.id,
      name: row.name,
      dateLabel: row.dateLabel,
      eventDate: row.eventDate ?? null,
      place: row.place,
      venueQ: row.venueQ,
      kuras: row.kuras,
      fee: row.fee,
      officialUrl: row.officialUrl,
      description: row.description,
      createdBy: row.createdBy,
      goingCount,
      interestedCount,
      iGoing,
      iInterested,
      goingAvatars,
    };
  });
}

export async function getEventDetail(eventId: string): Promise<EventDetail | null> {
  const db = getDb();
  if (!db) return null;
  const eventPromise = db.select().from(schema.events).where(eq(schema.events.id, eventId));
  const userPromise = currentUser();
  const [eventRow] = await eventPromise;
  if (!eventRow) return null;
  const user = await userPromise;
  const [attendees, comments] = await Promise.all([
    db.select().from(schema.eventAttendees).where(eq(schema.eventAttendees.eventId, eventId)),
    db.select().from(schema.eventComments).where(eq(schema.eventComments.eventId, eventId)).orderBy(desc(schema.eventComments.createdAt)),
  ]);
  const userIds = Array.from(new Set<string>([eventRow.createdBy, ...attendees.map((a) => a.userId), ...comments.map((c) => c.userId)]));
  const profiles = userIds.length
    ? await db.select().from(schema.profiles).where(inArray(schema.profiles.id, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const goingCount = attendees.filter((attendee) => attendee.status === 'going').length;
  const interestedCount = attendees.filter((attendee) => attendee.status === 'interested').length;
  const iGoing = !!user && attendees.some((a) => a.userId === user.id && a.status === 'going');
  const iInterested = !!user && attendees.some((a) => a.userId === user.id && a.status === 'interested');
  const goingMembers = attendees.filter((a) => a.status === 'going').map((a) => {
    const profile = profileMap.get(a.userId);
    return {
      name: profile?.nickname || 'sake_user',
      avatar: profile?.avatar || '酒',
      avatarBg: profile?.avatarBg || '#DDD3BE',
    };
  });
  return {
    id: eventRow.id,
    name: eventRow.name,
    dateLabel: eventRow.dateLabel,
    eventDate: eventRow.eventDate ?? null,
    place: eventRow.place,
    venueQ: eventRow.venueQ,
    kuras: eventRow.kuras,
    fee: eventRow.fee,
    officialUrl: eventRow.officialUrl,
    description: eventRow.description,
    createdBy: eventRow.createdBy,
    goingCount,
    interestedCount,
    iGoing,
    iInterested,
    goingAvatars: goingMembers.slice(0, 5),
    isCreator: !!user && eventRow.createdBy === user.id,
    goingMembers,
    comments: comments.map((c) => {
      const profile = profileMap.get(c.userId);
      return {
        id: c.id,
        userId: c.userId,
        userName: profile?.nickname || 'sake_user',
        avatar: profile?.avatar || '酒',
        avatarBg: profile?.avatarBg || '#DDD3BE',
        text: c.text,
        edited: c.edited,
        createdAt: c.createdAt.toISOString(),
        mine: !!user && c.userId === user.id,
      };
    }),
  };
}

export async function updateEvent(eventId: string, input: EventInput): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const updated = await db.update(schema.events)
    .set({
      name: input.name,
      dateLabel: input.dateLabel,
      eventDate: input.eventDate,
      place: input.place,
      venueQ: input.place,
      fee: input.fee,
      officialUrl: input.officialUrl,
      description: input.description,
    })
    .where(and(eq(schema.events.id, eventId), eq(schema.events.createdBy, user.id)))
    .returning({ id: schema.events.id });
  return updated.length > 0;
}

export async function createEvent(input: EventInput): Promise<string | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return null;
  const [row] = await db.insert(schema.events).values({
    name: input.name,
    dateLabel: input.dateLabel,
    eventDate: input.eventDate,
    place: input.place,
    venueQ: input.place,
    fee: input.fee,
    officialUrl: input.officialUrl,
    description: input.description,
    createdBy: user.id,
  }).returning({ id: schema.events.id });
  // 全メンバー(自分以外)に通知
  await createNotificationForAll({
    kind: 'event_created',
    text: `新しいイベント「${input.name}」が登録されました`,
    targetPath: `/event/${row.id}`,
    excludeUserId: user.id,
  });
  return row.id;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  // 作成者本人のみ削除可。先に本体行を作成者条件付きで削除して権限を確認し、
  // 削除できた場合のみ関連テーブル(参加表明・コメント)を掃除する。
  const deleted = await db.delete(schema.events)
    .where(and(eq(schema.events.id, eventId), eq(schema.events.createdBy, user.id)))
    .returning({ id: schema.events.id });
  if (!deleted.length) return false;
  await Promise.all([
    db.delete(schema.eventAttendees).where(eq(schema.eventAttendees.eventId, eventId)),
    db.delete(schema.eventComments).where(eq(schema.eventComments.eventId, eventId)),
  ]);
  return true;
}

export async function toggleEventStatus(eventId: string, status: EventStatus): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const existing = await db.select().from(schema.eventAttendees)
    .where(and(
      eq(schema.eventAttendees.eventId, eventId),
      eq(schema.eventAttendees.userId, user.id),
      eq(schema.eventAttendees.status, status),
    ));
  if (existing.length) {
    await db.delete(schema.eventAttendees)
      .where(and(
        eq(schema.eventAttendees.eventId, eventId),
        eq(schema.eventAttendees.userId, user.id),
        eq(schema.eventAttendees.status, status),
      ));
  } else {
    await db.insert(schema.eventAttendees)
      .values({ eventId, userId: user.id, status });
  }
  return true;
}

export async function addEventComment(eventId: string, text: string): Promise<EventCommentView | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !text.trim()) return null;
  const [row] = await db.insert(schema.eventComments).values({
    eventId, userId: user.id, text: text.trim(),
  }).returning();
  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  // イベント作成者に通知(自分のイベントには飛ばさない)
  const [eventRow] = await db.select().from(schema.events).where(eq(schema.events.id, eventId));
  if (eventRow) {
    await createNotification({
      userId: eventRow.createdBy,
      kind: 'event_comment',
      text: `${profile?.nickname || 'メンバー'}さんが「${eventRow.name}」にコメントしました`,
      targetPath: `/event/${eventId}`,
      excludeUserId: user.id,
    });
  }
  return {
    id: row.id,
    userId: row.userId,
    userName: profile?.nickname || 'sake_user',
    avatar: profile?.avatar || '酒',
    avatarBg: profile?.avatarBg || '#DDD3BE',
    text: row.text,
    edited: row.edited,
    createdAt: row.createdAt.toISOString(),
    mine: true,
  };
}

export async function editEventComment(commentId: string, text: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !text.trim()) return false;
  const updated = await db.update(schema.eventComments)
    .set({ text: text.trim(), edited: true, updatedAt: new Date() })
    .where(and(eq(schema.eventComments.id, commentId), eq(schema.eventComments.userId, user.id)))
    .returning({ id: schema.eventComments.id });
  return updated.length > 0;
}

export async function deleteEventComment(commentId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const deleted = await db.delete(schema.eventComments)
    .where(and(eq(schema.eventComments.id, commentId), eq(schema.eventComments.userId, user.id)))
    .returning({ id: schema.eventComments.id });
  return deleted.length > 0;
}
