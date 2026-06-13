import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export type DB = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Resolve a Postgres connection string. Supports both a plain DATABASE_URL and
 * the variables the Vercel ↔ Supabase integration injects automatically.
 * - runtime (serverless): prefer the pooled URL
 * - direct (migrations/seed): prefer the non-pooling URL (port 5432)
 */
export function resolveDbUrl(direct = false): string | undefined {
  const e = process.env;
  if (e.DATABASE_URL) return e.DATABASE_URL;
  if (direct) return e.POSTGRES_URL_NON_POOLING || e.POSTGRES_URL || e.POSTGRES_PRISMA_URL;
  return e.POSTGRES_URL || e.POSTGRES_PRISMA_URL || e.POSTGRES_URL_NON_POOLING;
}

const cache = new Map<string, DB>();

/** Drizzle client, or null when no connection string is configured. */
export function getDb(opts?: { direct?: boolean }): DB | null {
  const url = resolveDbUrl(opts?.direct);
  if (!url) return null;
  const existing = cache.get(url);
  if (existing) return existing;
  const client = postgres(url, { prepare: false });
  const db = drizzle(client, { schema });
  cache.set(url, db);
  return db;
}
