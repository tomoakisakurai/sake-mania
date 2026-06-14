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

const base = resolveDbUrl(true);
if (!base) { console.error('No DB connection string'); process.exit(1); }
// セッションプーラ(5432)の同時接続上限を避けるため、トランザクションプーラ(6543)を使う
const url = base.includes(':5432/') ? base.replace(':5432/', ':6543/') : base;

const sql = postgres(url, { prepare: false, max: 1 });

const statements = [
  // 念のため列を保証（db:pushがプーラ上限で未適用のことがあるため・冪等）
  `alter table public.records add column if not exists is_public boolean not null default false`,
  `alter table public.records enable row level security`,
  `alter table public.profiles enable row level security`,
  `drop policy if exists "records_select_own" on public.records`,
  `create policy "records_select_own" on public.records for select using (auth.uid() = user_id)`,
  `drop policy if exists "records_select_public" on public.records`,
  `create policy "records_select_public" on public.records for select using (is_public = true)`,
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

  // のみたいね: 数は公開、押下/取消は本人
  `alter table public.nomi enable row level security`,
  `drop policy if exists "nomi_select_all" on public.nomi`,
  `create policy "nomi_select_all" on public.nomi for select using (true)`,
  `drop policy if exists "nomi_insert_own" on public.nomi`,
  `create policy "nomi_insert_own" on public.nomi for insert with check (auth.uid() = user_id)`,
  `drop policy if exists "nomi_delete_own" on public.nomi`,
  `create policy "nomi_delete_own" on public.nomi for delete using (auth.uid() = user_id)`,

  // コメント: 閲覧公開、追加/編集/削除は本人
  `alter table public.comments enable row level security`,
  `drop policy if exists "comments_select_all" on public.comments`,
  `create policy "comments_select_all" on public.comments for select using (true)`,
  `drop policy if exists "comments_insert_own" on public.comments`,
  `create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id)`,
  `drop policy if exists "comments_update_own" on public.comments`,
  `create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id) with check (auth.uid() = user_id)`,
  `drop policy if exists "comments_delete_own" on public.comments`,
  `create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id)`,
];

for (const s of statements) {
  await sql.unsafe(s);
  console.log('ok:', s.slice(0, 60));
}
await sql.end();
console.log('RLS適用完了');
process.exit(0);
