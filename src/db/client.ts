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

// Cache clients by URL so a single connection pool is reused. The cache lives on
// globalThis so it survives Next.js HMR/module re-evaluation in dev — otherwise
// every hot reload would spin up a fresh pool and leak idle connections until the
// Postgres/pooler connection limit is hit ("Failed query" / connection timeouts).
const globalForDb = globalThis as unknown as { __sakeDbCache?: Map<string, DB> };
const cache = (globalForDb.__sakeDbCache ??= new Map<string, DB>());

/** Drizzle client, or null when no connection string is configured. */
export function getDb(opts?: { direct?: boolean }): DB | null {
  const url = resolveDbUrl(opts?.direct);
  if (!url) return null;
  const existing = cache.get(url);
  if (existing) return existing;
  const client = postgres(url, {
    prepare: false,
    // Keep the footprint small: a dev/serverless instance rarely needs a deep pool,
    // and a tight idle_timeout returns connections to the Supabase pooler promptly.
    max: 5,
    idle_timeout: 20,
  });
  const db = drizzle(client, { schema });
  cache.set(url, db);
  return db;
}
