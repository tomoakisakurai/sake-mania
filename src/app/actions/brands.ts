'use server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

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

  const [profile] = await db
    .select({ isAdmin: schema.profiles.isAdmin })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, data.user.id));
  if (!profile?.isAdmin) return null;

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
  return id;
}
