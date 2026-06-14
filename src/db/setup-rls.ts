// RLSポリシーを適用（再実行可能）。実行: npx tsx src/db/setup-rls.ts
import { readFileSync } from 'node:fs';
try {
  for (const l of readFileSync('.env', 'utf8').split('\n')) {
    const m = l.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* rely on ambient env */ }

import postgres from 'postgres';
import { resolveDbUrl } from './client';

const url = resolveDbUrl(true);
if (!url) { console.error('No DB connection string'); process.exit(1); }

const sql = postgres(url, { prepare: false });

const statements = [
  `alter table public.records enable row level security`,
  `alter table public.profiles enable row level security`,
  `drop policy if exists "records_select_own" on public.records`,
  `create policy "records_select_own" on public.records for select using (auth.uid() = user_id)`,
  `drop policy if exists "records_insert_own" on public.records`,
  `create policy "records_insert_own" on public.records for insert with check (auth.uid() = user_id)`,
  `drop policy if exists "records_update_own" on public.records`,
  `create policy "records_update_own" on public.records for update using (auth.uid() = user_id) with check (auth.uid() = user_id)`,
  `drop policy if exists "records_delete_own" on public.records`,
  `create policy "records_delete_own" on public.records for delete using (auth.uid() = user_id)`,
  `drop policy if exists "profiles_select_all" on public.profiles`,
  `create policy "profiles_select_all" on public.profiles for select using (true)`,
  `drop policy if exists "profiles_insert_own" on public.profiles`,
  `create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id)`,
  `drop policy if exists "profiles_update_own" on public.profiles`,
  `create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id)`,
];

for (const s of statements) {
  await sql.unsafe(s);
  console.log('ok:', s.slice(0, 60));
}
await sql.end();
console.log('RLS適用完了');
process.exit(0);
