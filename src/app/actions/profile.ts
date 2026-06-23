'use server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

// プロフィール画面・編集モーダルが扱う拡張フィールド
export interface ProfileView {
  nickname: string;
  avatar: string;
  avatarBg: string;
  photoUrl: string | null;
  dept: string | null;
  hometown: string | null;
  bio: string | null;
}

export interface ProfileEditInput {
  nickname?: string;
  photoUrl?: string | null;
  dept?: string | null;
  hometown?: string | null;
  bio?: string | null;
}

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

/** 現在ログイン中ユーザーのプロフィールを返す。未ログイン or 未作成なら null。 */
export async function getMyProfile(): Promise<ProfileView | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.id, data.user.id));
  if (!row) return null;
  return {
    nickname: row.nickname,
    avatar: row.avatar,
    avatarBg: row.avatarBg,
    photoUrl: row.photoUrl,
    dept: row.dept,
    hometown: row.hometown,
    bio: row.bio,
  };
}

/**
 * 任意のメンバーのプロフィールを nickname で取得(他人のプロフィール表示用)。
 */
export async function getProfileByNickname(nickname: string): Promise<ProfileView | null> {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.nickname, nickname));
  if (!row) return null;
  return {
    nickname: row.nickname,
    avatar: row.avatar,
    avatarBg: row.avatarBg,
    photoUrl: row.photoUrl,
    dept: row.dept,
    hometown: row.hometown,
    bio: row.bio,
  };
}

/** 自分のプロフィールを更新。空文字は null として保存する。 */
export async function updateMyProfile(input: ProfileEditInput): Promise<boolean> {
  const supabase = await getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const db = getDb();
  if (!db) return false;

  const norm = (v: string | null | undefined) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    const t = v.trim();
    return t ? t : null;
  };
  const nickname = input.nickname?.trim();
  const set: Record<string, string | null> = {};
  if (nickname) {
    set.nickname = nickname;
    set.avatar = nickname.charAt(0) || '酒';
  }
  const photoUrl = norm(input.photoUrl);
  if (photoUrl !== undefined) set.photoUrl = photoUrl;
  const dept = norm(input.dept);
  if (dept !== undefined) set.dept = dept;
  const hometown = norm(input.hometown);
  if (hometown !== undefined) set.hometown = hometown;
  const bio = norm(input.bio);
  if (bio !== undefined) set.bio = bio;

  if (Object.keys(set).length === 0) return true;
  await db.update(schema.profiles).set(set).where(eq(schema.profiles.id, data.user.id));
  return true;
}
