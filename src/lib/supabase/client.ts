'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import type { User } from '@/types';

let client: SupabaseClient | null = null;

/**
 * Lazily-created browser Supabase client. Returns null when the public env
 * vars are missing, so the app still runs (guest browsing + DB reads) before
 * auth is configured.
 */
export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  if (!client) client = createBrowserClient(url, anon);
  return client;
}

/** Map a Supabase auth user to the app's lightweight user shape. */
export function mapUser(u: SupabaseUser | null | undefined): User | null {
  if (!u) return null;
  const meta = (u.user_metadata || {}) as { nickname?: string };
  const name = (meta.nickname && meta.nickname.trim())
    || (u.email ? u.email.split('@')[0] : '')
    || 'sake_user';
  return { name, avatar: name.charAt(0) || '酒', isAdmin: false };
}
