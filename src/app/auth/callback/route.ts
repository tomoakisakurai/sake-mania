import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';

// OAuth redirect lands here: exchange the code for a session cookie, then go home.
// profiles 行の作成は Providers の onAuthStateChange 経由で ensureProfile が
// SIGNED_IN/INITIAL_SESSION のタイミングで行う(cookie が確実に確立された後)。
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = await getSupabaseServer();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login`);
}
