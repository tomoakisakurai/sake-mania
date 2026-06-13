import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Prefer a direct (non-pooling) connection for DDL/migrations.
    url: (process.env.DATABASE_URL
      || process.env.POSTGRES_URL_NON_POOLING
      || process.env.POSTGRES_URL)!,
  },
});
