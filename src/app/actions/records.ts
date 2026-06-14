'use server';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { MyRec } from '@/types';

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
}

const fmtDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;

function toMyRec(r: typeof schema.records.$inferSelect, isNew = false): MyRec {
  return {
    rid: r.id, nomi: 0, comments: [], brandId: r.brandId,
    date: isNew ? '今日' : fmtDate(new Date(r.createdAt)),
    rating: r.rating, x: r.x, y: r.y, sweet: r.sweet,
    temps: (r.temps as string[]) ?? [], pairing: r.pairing, memo: r.memo,
    photo: r.photo ?? undefined, isNew,
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
  }).returning();

  return toMyRec(row, true);
}
