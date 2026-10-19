'use server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import { invalidateCoreReferenceCache } from '@/lib/getReferenceData';
import { isAdminUser } from '@/lib/authz';
import { isImageDataUrl } from '@/lib/brandPhoto';

export interface BrandInput {
  name: string;
  brewery: string;
  pref: string;
  cls: string;
  polish: string;
  rice: string;
  description: string;
  /** データURL=新しい写真を保存 / null=写真を削除 / undefined=変更なし */
  photo?: string | null;
}

/**
 * BrandInput.photo を DB に書く値に解決する。undefined は「変更なし」。
 * データURL以外の文字列(画像ルートのURLなど)も「変更なし」として扱い、URL を DB に書き戻さない。
 */
function resolvePhotoChange(photo: string | null | undefined): string | null | undefined {
  if (typeof photo === 'string' && !isImageDataUrl(photo)) return undefined;
  return photo;
}

export async function createBrand(input: BrandInput): Promise<string | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const db = getDb();
  if (!db) return null;

  const id = crypto.randomUUID();
  await db.insert(schema.brands).values({
    id,
    name: input.name,
    brewery: input.brewery,
    pref: input.pref || '',
    cls: input.cls || '',
    polish: input.polish || '',
    rice: input.rice || '',
    yeast: '',
    smv: '',
    abv: '',
    temp: '',
    x: 50,
    y: 50,
    rating: 0,
    count: 0,
    tags: [],
    description: input.description || '',
    photo: resolvePhotoChange(input.photo) ?? null,
    sortOrder: 999,
  });
  invalidateCoreReferenceCache();
  return id;
}

/**
 * 銘柄情報を更新する。図鑑はwiki方式: ログインしていれば誰でも編集できる
 * (brands には登録者カラムが無く、所有権チェックは設計上行わない)。
 */
export async function updateBrand(brandId: string, input: BrandInput): Promise<boolean> {
  const supabase = await getSupabaseServer();
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;

  const db = getDb();
  if (!db) return false;

  const photo = resolvePhotoChange(input.photo);
  const updated = await db.update(schema.brands)
    .set({
      name: input.name,
      brewery: input.brewery,
      pref: input.pref || '',
      cls: input.cls || '',
      polish: input.polish || '',
      rice: input.rice || '',
      description: input.description || '',
      ...(photo !== undefined ? { photo } : {}),
    })
    .where(eq(schema.brands.id, brandId))
    .returning({ id: schema.brands.id });
  if (!updated.length) return false;
  invalidateCoreReferenceCache();
  return true;
}

/**
 * 銘柄を図鑑から削除する。管理者のみ。
 * 記録・MEETUPの持ち寄り・投票から参照されている銘柄は削除できない
 * (他メンバーのデータが壊れるため。主用途は誤登録の掃除)。
 */
export async function deleteBrand(brandId: string): Promise<'ok' | 'inUse' | 'error'> {
  const supabase = await getSupabaseServer();
  if (!supabase) return 'error';
  const { data } = await supabase.auth.getUser();
  if (!data.user) return 'error';
  const db = getDb();
  if (!db) return 'error';
  if (!(await isAdminUser(db, data.user.id))) return 'error';

  const [records, brings, votes] = await Promise.all([
    db.select({ id: schema.records.id }).from(schema.records).where(eq(schema.records.brandId, brandId)).limit(1),
    db.select({ meetupId: schema.meetupBrings.meetupId }).from(schema.meetupBrings).where(eq(schema.meetupBrings.brandId, brandId)).limit(1),
    db.select({ meetupId: schema.meetupVotes.meetupId }).from(schema.meetupVotes).where(eq(schema.meetupVotes.brandId, brandId)).limit(1),
  ]);
  if (records.length || brings.length || votes.length) return 'inUse';

  const deleted = await db.delete(schema.brands)
    .where(eq(schema.brands.id, brandId))
    .returning({ id: schema.brands.id });
  if (!deleted.length) return 'error';
  invalidateCoreReferenceCache();
  return 'ok';
}
