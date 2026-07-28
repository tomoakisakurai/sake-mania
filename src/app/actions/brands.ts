'use server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import { invalidateCoreReferenceCache } from '@/lib/getReferenceData';

export interface BrandInput {
  name: string;
  brewery: string;
  pref: string;
  cls: string;
  polish: string;
  rice: string;
  description: string;
  photo: string | null;
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
    photo: input.photo,
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

  const updated = await db.update(schema.brands)
    .set({
      name: input.name,
      brewery: input.brewery,
      pref: input.pref || '',
      cls: input.cls || '',
      polish: input.polish || '',
      rice: input.rice || '',
      description: input.description || '',
      photo: input.photo,
    })
    .where(eq(schema.brands.id, brandId))
    .returning({ id: schema.brands.id });
  if (!updated.length) return false;
  invalidateCoreReferenceCache();
  return true;
}
