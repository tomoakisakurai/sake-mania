'use server';
import { asc, eq, inArray, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';

// メンバー出身地マップ・メンバー詳細で扱うprofile行のサマリ。
export interface MemberRow {
  nickname: string;
  avatar: string;
  avatarBg: string;
  photoUrl: string | null;
  dept: string | null;
  hometown: string | null;
  bio: string | null;
}

/**
 * 登録済みプロフィール一覧。新しいユーザーから順に並べる。
 * profilesテーブル(=実際のアプリ利用者)を返す。モックデータは使わない。
 */
export async function listMembers(): Promise<MemberRow[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(schema.profiles)
    .orderBy(asc(schema.profiles.createdAt));
  return rows.map((row) => ({
    nickname: row.nickname,
    avatar: row.avatar,
    avatarBg: row.avatarBg,
    photoUrl: row.photoUrl,
    dept: row.dept,
    hometown: row.hometown,
    bio: row.bio,
  }));
}

// メンバー詳細の participation 集計結果
export interface MemberAttended {
  meetupId: string;
  name: string;
  dateShort: string;
  eventDate: string | null;
}
export interface MemberBring {
  meetupId: string;
  meetName: string;
  dateShort: string;
  brandId: string;
  note: string;
  isMvp: boolean;
}
export interface MemberHistory {
  attended: MemberAttended[];
  brings: MemberBring[];
  mvpCount: number;
}

function shortOf(dateLabel: string, eventDate: string | null): string {
  if (eventDate) {
    const [, m, d] = eventDate.split('-');
    if (m && d) return `${parseInt(m)}/${parseInt(d)}`;
  }
  const match = dateLabel.match(/(\d{1,2})月(\d{1,2})日/);
  if (match) return `${match[1]}/${match[2]}`;
  return dateLabel;
}

/**
 * nickname から meetup_attendees / meetup_brings を集計して参加履歴と
 * 持ち寄り(+MVP判定)を返す。実DB側でユーザーが見つからなければ全部空配列。
 */
export async function getMemberHistoryByNickname(nickname: string): Promise<MemberHistory> {
  const empty: MemberHistory = { attended: [], brings: [], mvpCount: 0 };
  const db = getDb();
  if (!db) return empty;
  const [profile] = await db
    .select({ id: schema.profiles.id })
    .from(schema.profiles)
    .where(eq(schema.profiles.nickname, nickname));
  if (!profile) return empty;
  const userId = profile.id;

  // 参加 / 持ち寄り(同テーブルを別々に取得 — JOINするほどでもない)
  const [attendRows, bringRows] = await Promise.all([
    db.select({
      meetupId: schema.meetupAttendees.meetupId,
      name: schema.meetupEvents.name,
      dateLabel: schema.meetupEvents.dateLabel,
      eventDate: schema.meetupEvents.eventDate,
    }).from(schema.meetupAttendees)
      .innerJoin(schema.meetupEvents, eq(schema.meetupAttendees.meetupId, schema.meetupEvents.id))
      .where(eq(schema.meetupAttendees.userId, userId)),
    db.select({
      meetupId: schema.meetupBrings.meetupId,
      brandId: schema.meetupBrings.brandId,
      note: schema.meetupBrings.note,
      meetName: schema.meetupEvents.name,
      dateLabel: schema.meetupEvents.dateLabel,
      eventDate: schema.meetupEvents.eventDate,
    }).from(schema.meetupBrings)
      .innerJoin(schema.meetupEvents, eq(schema.meetupBrings.meetupId, schema.meetupEvents.id))
      .where(eq(schema.meetupBrings.userId, userId)),
  ]);

  // MVP判定: 各meetupで最多得票の銘柄を求め、それが自分のbringと一致するか
  const meetIds = Array.from(new Set(bringRows.map((b) => b.meetupId)));
  const mvpByMeetup = new Map<string, string>();
  if (meetIds.length > 0) {
    const voteCounts = await db
      .select({
        meetupId: schema.meetupVotes.meetupId,
        brandId: schema.meetupVotes.brandId,
        count: sql<number>`count(*)::int`.as('count'),
      })
      .from(schema.meetupVotes)
      .where(inArray(schema.meetupVotes.meetupId, meetIds))
      .groupBy(schema.meetupVotes.meetupId, schema.meetupVotes.brandId);
    const topByMeetup = new Map<string, { brandId: string; count: number }>();
    for (const v of voteCounts) {
      const cur = topByMeetup.get(v.meetupId);
      if (!cur || v.count > cur.count) topByMeetup.set(v.meetupId, { brandId: v.brandId, count: v.count });
    }
    for (const [mid, top] of topByMeetup) mvpByMeetup.set(mid, top.brandId);
  }

  const brings: MemberBring[] = bringRows.map((b) => ({
    meetupId: b.meetupId,
    meetName: b.meetName,
    dateShort: shortOf(b.dateLabel, b.eventDate),
    brandId: b.brandId,
    note: b.note,
    isMvp: mvpByMeetup.get(b.meetupId) === b.brandId,
  }));
  brings.sort((a, b) => (a.dateShort < b.dateShort ? 1 : -1));

  const attended: MemberAttended[] = attendRows.map((a) => ({
    meetupId: a.meetupId,
    name: a.name,
    dateShort: shortOf(a.dateLabel, a.eventDate),
    eventDate: a.eventDate ?? null,
  }));
  attended.sort((a, b) => (a.dateShort < b.dateShort ? 1 : -1));

  return { attended, brings, mvpCount: brings.filter((b) => b.isMvp).length };
}
