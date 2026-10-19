import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { hashInviteToken, isInviteTokenFormat } from '@/lib/inviteToken';
import { isInviteActive } from '@/lib/signupGate';

/**
 * 招待トークンがまだ使えるか。形式チェック、DB、isInviteActive の順で、
 * 形式が違えば DB を引かない。DB 未設定なら false。
 * api/invite-status、api/invite-qr、/login の generateMetadata で共有する。
 */
export async function isInviteTokenActive(token: string, now: Date = new Date()): Promise<boolean> {
  if (!isInviteTokenFormat(token)) return false;
  const db = getDb();
  if (!db) return false;
  const [invite] = await db.select({
    revokedAt: schema.signupInvites.revokedAt,
    expiresAt: schema.signupInvites.expiresAt,
    maxUses: schema.signupInvites.maxUses,
    usedCount: schema.signupInvites.usedCount,
  })
    .from(schema.signupInvites)
    .where(eq(schema.signupInvites.tokenHash, hashInviteToken(token)));
  return !!invite && isInviteActive(invite, now);
}
