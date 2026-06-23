'use server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

/** 現在のユーザーが管理者かどうかを返す。未ログイン時は false。 */
export async function getIsAdmin(): Promise<boolean> {
  const supabase = await getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const db = getDb();
  if (!db) return false;
  const [profile] = await db
    .select({ isAdmin: schema.profiles.isAdmin })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, data.user.id));
  return profile?.isAdmin ?? false;
}

/**
 * ログイン中のユーザーのprofilesレコードを作成(なければ)。
 * 新規登録時とOAuthコールバック時に呼ぶ。既にあれば nickname/avatar は触らない。
 */
export async function ensureProfile(nickname: string): Promise<boolean> {
  const supabase = await getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const db = getDb();
  if (!db) return false;
  const name = nickname.trim() || (data.user.email ? data.user.email.split('@')[0] : 'sake_user');
  await db.insert(schema.profiles)
    .values({ id: data.user.id, nickname: name, avatar: name.charAt(0) || '酒', avatarBg: '#DDD3BE' })
    .onConflictDoNothing({ target: schema.profiles.id });
  return true;
}
