import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

// OAuth redirect lands here: exchange the code for a session cookie, then go home.
// profiles 行の作成は Providers の onAuthStateChange 経由で getMySession が
// SIGNED_IN/INITIAL_SESSION のタイミングで行う(cookie が確実に確立された後)。
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  // 招待リンクゲート(auth.users のトリガー)が GitHub ログインの新規ユーザーを拒否すると、
  // Supabase は code ではなく `?error=server_error&error_description=Database error saving new user`
  // を付けて戻してくる。社用ドメイン以外のメールが原因なので、ログイン画面で理由を案内する。
  const errorDescription = searchParams.get('error_description') ?? '';
  if (/database error/i.test(errorDescription)) {
    return NextResponse.redirect(`${origin}/login?error=signup_gate`);
  }

  if (code) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login`);
}
