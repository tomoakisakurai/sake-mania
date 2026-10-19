import type { NextRequest } from 'next/server';
import { isInviteTokenActive } from '@/lib/inviteStatus';
import { inviteSiteOrigin, renderInviteQrPng } from '@/lib/inviteQr';
import { inviteUrl, parseInviteQrSize } from '@/lib/signupGate';

// 招待リンクの QR を PNG で返す(Slack の image ブロックと、招待リンクの展開の og:image 用)。
// 招待を開く人は未ログインで、Slack のサーバーも cookie なしで取りに来るので認証はしない。
// トークンは 192 bit の乱数なので、総当たりしても有効なトークンは見つからない。
// 使えない招待は理由を区別せず 404 にする。失効したら次の取得から 404 にしたいので no-store。
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  if (!(await isInviteTokenActive(token))) {
    return new Response(null, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }

  // ?size=small は Slack 投稿用の小さい QR。それ以外は og:image 用の large
  const size = parseInviteQrSize(request.nextUrl.searchParams.get('size'));
  const png = await renderInviteQrPng(inviteUrl(inviteSiteOrigin(), token), size);
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(png.length),
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
