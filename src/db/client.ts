import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type DB = ReturnType<typeof drizzle<typeof schema>>;

let cached: DB | null = null;

/**
 * Returns a Drizzle client, or null when DATABASE_URL is not configured
 * (so the app keeps running on bundled mock data until Supabase is set up).
 */
export function getDb(): DB | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (cached) return cached;
  const client = postgres(url, { prepare: false });
  cached = drizzle(client, { schema });
  return cached;
}
