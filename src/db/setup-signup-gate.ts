// 新規登録の招待リンクゲートを DB に設定する(再実行可能)。実行: yarn db:signup-gate
//
// 目的: 誰でも新規登録できる状態を閉じる。@asoview.co.jp のメールはそのまま登録でき、
// それ以外のメールは有効な招待トークン(管理者が /admin/invites で発行する招待リンクに含まれる)を
// 持っているときだけ登録できる。判定はフォームではなく auth.users の BEFORE INSERT トリガーで行う
// (フォームの判定は anon key で Supabase の API を直接叩けば迂回できるため)。
// トリガーが拒否すると、Supabase は「Database error saving new user」を返す。
import { readFileSync } from 'node:fs';
try {
  for (const l of readFileSync('.env', 'utf8').split('\n')) {
    const m = l.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* rely on ambient env */ }

import postgres from 'postgres';
import { resolveDbUrl } from './client';

if (process.argv[2] !== 'setup') {
  console.error('usage: tsx src/db/setup-signup-gate.ts setup');
  process.exit(1);
}

const base = resolveDbUrl(true);
if (!base) { console.error('No DB connection string'); process.exit(1); }
// セッションプーラ(5432)の同時接続上限を避けるため、トランザクションプーラ(6543)を使う
const url = base.includes(':5432/') ? base.replace(':5432/', ':6543/') : base;

const sql = postgres(url, { prepare: false, max: 1 });

const statements = [
  // schema.ts の signupInvites と同じ列(db:push が未適用でも動くよう、ここでも保証する・冪等)
  `create table if not exists public.signup_invites (
    id uuid primary key default gen_random_uuid(),
    token_hash text not null unique,
    label text not null default '',
    expires_at timestamptz null,
    max_uses integer null,
    used_count integer not null default 0,
    revoked_at timestamptz null,
    created_by uuid not null,
    created_at timestamptz not null default now()
  )`,
  // ポリシーは作らない = anon / authenticated からは全拒否(読み書きは server action から Drizzle で行う)
  `alter table public.signup_invites enable row level security`,
  `revoke all on public.signup_invites from anon, authenticated`,

  `create or replace function public.enforce_signup_gate()
  returns trigger
  language plpgsql
  security definer
  set search_path = public, extensions
  as $$
  declare
    given text;
    invite_id uuid;
  begin
    if new.email is not null and lower(new.email) like '%@asoview.co.jp' then
      return new;
    end if;

    given := new.raw_user_meta_data ->> 'invite_token';
    if given is null or given = '' then
      raise exception 'signup_gate: invite required';
    end if;

    select id into invite_id
      from public.signup_invites
      where token_hash = encode(extensions.digest(given, 'sha256'), 'hex')
        and revoked_at is null
        and (expires_at is null or expires_at > now())
        and (max_uses is null or used_count < max_uses)
      for update;
    if invite_id is null then
      raise exception 'signup_gate: invite invalid';
    end if;

    update public.signup_invites set used_count = used_count + 1 where id = invite_id;

    -- 招待トークンを auth.users に残さない
    new.raw_user_meta_data := new.raw_user_meta_data - 'invite_token';
    return new;
  end;
  $$`,
  // トリガーを発火させるのは Auth サーバーのロール
  `revoke all on function public.enforce_signup_gate() from public`,
  `grant execute on function public.enforce_signup_gate() to supabase_auth_admin`,

  `drop trigger if exists signup_gate on auth.users`,
  `create trigger signup_gate before insert on auth.users for each row execute function public.enforce_signup_gate()`,
];

for (const s of statements) {
  await sql.unsafe(s);
  console.log('ok:', s.replace(/\s+/g, ' ').slice(0, 60));
}
await sql.end();
console.log('招待リンクゲートの設定完了');
process.exit(0);
