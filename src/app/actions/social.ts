'use server';
import { eq, and, inArray, asc, sql } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

export interface CommentItem {
  id: string;
  user: string;
  avatar: string;
  avatarBg: string;
  time: string;
  text: string;
  edited: boolean;
  mine: boolean;
}

export interface SocialState {
  counts: Record<string, number>;     // record_id -> のみたいね数
  mine: Record<string, boolean>;       // record_id -> 自分が押したか
  comments: Record<string, CommentItem[]>;
}

const fmtDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

async function currentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** のみたいね数・自分の状態・コメントを、指定レコード群についてまとめて取得。 */
export async function getSocial(recordIds: string[]): Promise<SocialState> {
  const empty: SocialState = { counts: {}, mine: {}, comments: {} };
  const db = getDb();
  const ids = recordIds.filter(isUuid);
  if (!db || ids.length === 0) return empty;
  const user = await currentUser();

  const counts: Record<string, number> = {};
  const mine: Record<string, boolean> = {};
  const comments: Record<string, CommentItem[]> = {};

  const nomiRows = await db
    .select({ recordId: schema.nomi.recordId, n: sql<number>`count(*)::int` })
    .from(schema.nomi)
    .where(inArray(schema.nomi.recordId, ids))
    .groupBy(schema.nomi.recordId);
  for (const r of nomiRows) counts[r.recordId] = r.n;

  if (user) {
    const mineRows = await db.select({ recordId: schema.nomi.recordId })
      .from(schema.nomi)
      .where(and(inArray(schema.nomi.recordId, ids), eq(schema.nomi.userId, user.id)));
    for (const r of mineRows) mine[r.recordId] = true;
  }

  const cRows = await db
    .select({ c: schema.comments, p: schema.profiles })
    .from(schema.comments)
    .leftJoin(schema.profiles, eq(schema.profiles.id, schema.comments.userId))
    .where(inArray(schema.comments.recordId, ids))
    .orderBy(asc(schema.comments.createdAt));
  for (const { c, p } of cRows) {
    const name = p?.nickname || 'sake_user';
    (comments[c.recordId] ||= []).push({
      id: c.id, user: name, avatar: p?.avatar || name.charAt(0) || '酒', avatarBg: p?.avatarBg || '#DDD3BE',
      time: fmtDate(new Date(c.createdAt)), text: c.text, edited: c.edited,
      mine: !!user && c.userId === user.id,
    });
  }

  return { counts, mine, comments };
}

/** のみたいねをトグル。戻り値 = 反映後の {liked, count}。 */
export async function toggleNomi(recordId: string): Promise<{ liked: boolean; count: number } | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !isUuid(recordId)) return null;
  const existing = await db.select().from(schema.nomi)
    .where(and(eq(schema.nomi.recordId, recordId), eq(schema.nomi.userId, user.id)));
  let liked: boolean;
  if (existing.length) {
    await db.delete(schema.nomi).where(and(eq(schema.nomi.recordId, recordId), eq(schema.nomi.userId, user.id)));
    liked = false;
  } else {
    await db.insert(schema.nomi).values({ recordId, userId: user.id });
    liked = true;
    // 記録の所有者に通知(自分の記録には飛ばさない)
    const [record] = await db.select().from(schema.records).where(eq(schema.records.id, recordId));
    if (record && record.userId !== user.id) {
      const [actor] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
      await db.insert(schema.notifications).values({
        userId: record.userId,
        kind: 'nomi',
        text: `${actor?.nickname || 'メンバー'}さんがあなたの記録にのみたいねしました`,
        targetPath: '/mypage',
      });
    }
  }
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.nomi).where(eq(schema.nomi.recordId, recordId));
  return { liked, count: n };
}

export async function addComment(recordId: string, text: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  const t = text.trim();
  if (!db || !user || !isUuid(recordId) || !t) return false;
  await db.insert(schema.comments).values({ recordId, userId: user.id, text: t });
  // 記録の所有者に通知(自分の記録には飛ばさない)
  const [record] = await db.select().from(schema.records).where(eq(schema.records.id, recordId));
  if (record && record.userId !== user.id) {
    const [actor] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
    await db.insert(schema.notifications).values({
      userId: record.userId,
      kind: 'comment',
      text: `${actor?.nickname || 'メンバー'}さんがあなたの記録にコメントしました`,
      targetPath: '/mypage',
    });
  }
  return true;
}

export async function editComment(commentId: string, text: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  const t = text.trim();
  if (!db || !user || !t) return false;
  const updated = await db.update(schema.comments)
    .set({ text: t, edited: true, updatedAt: new Date() })
    .where(and(eq(schema.comments.id, commentId), eq(schema.comments.userId, user.id)))
    .returning({ id: schema.comments.id });
  return updated.length > 0;
}

export async function deleteComment(commentId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const deleted = await db.delete(schema.comments)
    .where(and(eq(schema.comments.id, commentId), eq(schema.comments.userId, user.id)))
    .returning({ id: schema.comments.id });
  return deleted.length > 0;
}
