'use server';
import { asc } from 'drizzle-orm';
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
