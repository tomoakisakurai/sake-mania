import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Refresh the Supabase auth session on each request so Server Actions /
// server components can read the user. No-op when env is not configured.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return response;

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // api/brand-photo は認証不要の画像配信なので、画像1枚ごとに auth.getUser() の往復を走らせないよう除外する
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/brand-photo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
