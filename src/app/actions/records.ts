'use server';
import { eq, desc, and, inArray, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { MyRec, PublicRec } from '@/types';

interface RecordInput {
  brandId: string;
  rating: number;
  x: number;
  y: number;
  sweet: number;
  temps: string[];
  pairing: string;
  memo: string;
  photo: string | null;
  isPublic: boolean;
}

const fmtDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;

function toMyRec(r: typeof schema.records.$inferSelect, isNew = false): MyRec {
  return {
    recordId: r.id, nomi: 0, comments: [], brandId: r.brandId,
    date: isNew ? '今日' : fmtDate(new Date(r.createdAt)),
    rating: r.rating, x: r.x, y: r.y, sweet: r.sweet,
    temps: (r.temps as string[]) ?? [], pairing: r.pairing, memo: r.memo,
    photo: r.photo ?? undefined, isNew, isPublic: r.isPublic,
  };
}

/** Current authenticated user from the session cookie, or null. */
async function currentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Logged-in user's tasting records, newest first. */
export async function getMyRecords(): Promise<MyRec[]> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return [];
  const rows = await db.select().from(schema.records)
    .where(eq(schema.records.userId, user.id))
    .orderBy(desc(schema.records.createdAt));
  return rows.map((r) => toMyRec(r, false));
}

/** Insert a tasting record for the logged-in user; returns the saved record. */
export async function saveRecord(input: RecordInput): Promise<MyRec | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return null;

  // keep the profile in sync (used by author display / future features)
  const meta = (user.user_metadata || {}) as { nickname?: string };
  const nickname = (meta.nickname && meta.nickname.trim()) || (user.email ? user.email.split('@')[0] : 'sake_user');
  await db.insert(schema.profiles)
    .values({ id: user.id, nickname, avatar: nickname.charAt(0) || '酒', avatarBg: '#DDD3BE' })
    .onConflictDoUpdate({ target: schema.profiles.id, set: { nickname, avatar: nickname.charAt(0) || '酒' } });

  const [row] = await db.insert(schema.records).values({
    userId: user.id,
    brandId: input.brandId,
    rating: input.rating,
    x: input.x,
    y: input.y,
    sweet: input.sweet,
    temps: input.temps,
    pairing: input.pairing,
    memo: input.memo,
    photo: input.photo,
    isPublic: input.isPublic,
  }).returning();

  return toMyRec(row, true);
}

/** Delete one of the current user's records. Returns success. */
export async function deleteRecord(recordId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  await db.delete(schema.records)
    .where(and(eq(schema.records.id, recordId), eq(schema.records.userId, user.id)));
  return true;
}

/** Publish / unpublish one of the current user's records. Returns success. */
export async function setRecordPublic(recordId: string, isPublic: boolean): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const updated = await db.update(schema.records)
    .set({ isPublic })
    .where(and(eq(schema.records.id, recordId), eq(schema.records.userId, user.id)))
    .returning({ id: schema.records.id });
  return updated.length > 0;
}

/** All users' published records (newest first) with author profile, for the feed. */
export async function getPublicRecords(): Promise<PublicRec[]> {
  const db = getDb();
  if (!db) return [];
  const user = await currentUser();
  const rows = await db
    .select({ r: schema.records, p: schema.profiles })
    .from(schema.records)
    .leftJoin(schema.profiles, eq(schema.profiles.id, schema.records.userId))
    .where(eq(schema.records.isPublic, true))
    .orderBy(desc(schema.records.createdAt))
    .limit(50);

  // のみたいね数・コメント数・自分が押したか を同梱（フィードの数字が遅れて出ないように）
  const ids = rows.map(({ r }) => r.id);
  const nomiCount: Record<string, number> = {};
  const commentCount: Record<string, number> = {};
  const liked: Record<string, boolean> = {};
  if (ids.length) {
    const [nRows, cRows, myRows] = await Promise.all([
      db.select({ id: schema.nomi.recordId, n: sql<number>`count(*)::int` }).from(schema.nomi).where(inArray(schema.nomi.recordId, ids)).groupBy(schema.nomi.recordId),
      db.select({ id: schema.comments.recordId, n: sql<number>`count(*)::int` }).from(schema.comments).where(inArray(schema.comments.recordId, ids)).groupBy(schema.comments.recordId),
      user ? db.select({ id: schema.nomi.recordId }).from(schema.nomi).where(and(inArray(schema.nomi.recordId, ids), eq(schema.nomi.userId, user.id))) : Promise.resolve([] as { id: string }[]),
    ]);
    for (const r of nRows) nomiCount[r.id] = r.n;
    for (const r of cRows) commentCount[r.id] = r.n;
    for (const r of myRows) liked[r.id] = true;
  }

  return rows.map(({ r, p }) => {
    const name = p?.nickname || 'sake_user';
    return {
      recordId: r.id, brandId: r.brandId, rating: r.rating, x: r.x, y: r.y, sweet: r.sweet,
      temps: (r.temps as string[]) ?? [], pairing: r.pairing, memo: r.memo, photo: r.photo ?? undefined,
      nomi: nomiCount[r.id] || 0, commentCount: commentCount[r.id] || 0, liked: !!liked[r.id], comments: [],
      user: name, avatar: p?.avatar || name.charAt(0) || '酒', avatarBg: p?.avatarBg || '#DDD3BE',
      mine: !!user && r.userId === user.id,
      date: fmtDate(new Date(r.createdAt)),
    };
  });
}
