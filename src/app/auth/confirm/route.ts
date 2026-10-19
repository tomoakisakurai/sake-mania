import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getSupabaseServer } from '@/lib/supabase/server';

// 確認メールのリンクの着地点。token_hash を検証してセッション cookie を確立し、next(既定はホーム)へ。
// メールテンプレートのリンクは `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup`。
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  // origin 直後に連結するため、`/` 始まり(かつ `//` でない)の相対パスだけを受け付ける
  const requestedNext = searchParams.get('next') ?? '';
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/';

  if (tokenHash && type) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login`);
}
