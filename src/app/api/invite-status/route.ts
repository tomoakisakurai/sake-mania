import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { hashInviteToken, isInviteTokenFormat } from '@/lib/inviteToken';
import { isInviteActive } from '@/lib/signupGate';

// 招待リンクを開いたときに、そのリンクでまだ登録できるかを返す(ログイン画面が登録フォームを出すかの判断用)。
// 招待リンクを開く人は未ログインなので認証はしない。返すのは有効かどうかだけで、ラベルや使用回数は返さない。
// トークンは 192 bit の乱数なので、この API で総当たりしても有効なトークンは見つからない。
// 本当の判定は登録時の auth.users のトリガーが行う(ここで有効でも、送信までに失効すれば登録は拒否される)。
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? '';
  const headers = { 'Cache-Control': 'no-store' };
  if (!isInviteTokenFormat(token)) return Response.json({ active: false }, { headers });

  const db = getDb();
  if (!db) return Response.json({ active: false }, { headers });
  const [invite] = await db.select({
    revokedAt: schema.signupInvites.revokedAt,
    expiresAt: schema.signupInvites.expiresAt,
    maxUses: schema.signupInvites.maxUses,
    usedCount: schema.signupInvites.usedCount,
  })
    .from(schema.signupInvites)
    .where(eq(schema.signupInvites.tokenHash, hashInviteToken(token)));
  return Response.json({ active: !!invite && isInviteActive(invite, new Date()) }, { headers });
}
