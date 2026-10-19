import type { NextRequest } from 'next/server';
import { isInviteTokenActive } from '@/lib/inviteStatus';

// 招待リンクを開いたときに、そのリンクでまだ登録できるかを返す(ログイン画面が登録フォームを出すかの判断用)。
// 招待リンクを開く人は未ログインなので認証はしない。返すのは有効かどうかだけで、ラベルや使用回数は返さない。
// トークンは 192 bit の乱数なので、この API で総当たりしても有効なトークンは見つからない。
// 本当の判定は登録時の auth.users のトリガーが行う(ここで有効でも、送信までに失効すれば登録は拒否される)。
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const headers = { 'Cache-Control': 'no-store' };
  return Response.json({ active: await isInviteTokenActive(token) }, { headers });
}
