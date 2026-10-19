'use server';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/authz';
import { absoluteUrl, postToSlack } from '@/lib/slack';
import { inviteQrPath, inviteUrl, isInviteActive } from '@/lib/signupGate';
import { inviteSiteOrigin, renderInviteQrPng } from '@/lib/inviteQr';
import { inviteSlackPost } from '@/lib/inviteSlackPost';
import { generateInviteToken, hashInviteToken } from '@/lib/inviteToken';

// 新規登録の招待リンク(管理者のみ)。登録時の判定は auth.users のトリガーが行う(src/db/setup-signup-gate.ts)。
// トークンの平文は DB に保存せず、発行時の戻り値で1回だけ返す。

export interface InviteInput {
  label: string;
  /** null = 無期限 */
  expiresInDays: number | null;
  /** null = 無制限 */
  maxUses: number | null;
  notifySlack: boolean;
}

export interface CreatedInvite {
  id: string;
  url: string;
  /** QR コードの PNG データURL */
  qrDataUrl: string;
}

export interface InviteView {
  id: string;
  label: string;
  createdAt: string;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  revokedAt: string | null;
  isActive: boolean;
}

const LABEL_MAX_LENGTH = 100;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function currentAdminUserId(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const db = getDb();
  if (!db) return null;
  return (await isAdminUser(db, data.user.id)) ? data.user.id : null;
}

/** null(=指定なし)か正の整数か */
function isNullOrPositiveInteger(value: number | null): boolean {
  return value === null || (Number.isInteger(value) && value > 0);
}

export async function createInvite(input: InviteInput): Promise<CreatedInvite | null> {
  const userId = await currentAdminUserId();
  const db = getDb();
  if (!userId || !db) return null;
  const label = input.label.trim();
  if (label.length > LABEL_MAX_LENGTH) return null;
  if (!isNullOrPositiveInteger(input.expiresInDays) || !isNullOrPositiveInteger(input.maxUses)) return null;

  const token = generateInviteToken();
  const expiresAt = input.expiresInDays === null ? null : new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000);
  const [row] = await db.insert(schema.signupInvites)
    .values({
      tokenHash: hashInviteToken(token),
      label,
      expiresAt,
      maxUses: input.maxUses,
      createdBy: userId,
    })
    .returning({ id: schema.signupInvites.id });
  if (!row) return null;

  // 本番 URL(無い環境では null)。Slack に流すかの判断に使う
  const siteOrigin = absoluteUrl('');
  const url = inviteUrl(inviteSiteOrigin(), token);
  const qrDataUrl = `data:image/png;base64,${(await renderInviteQrPng(url)).toString('base64')}`;

  // 本番 URL が無い環境では、誰も開けない localhost のリンクを Slack に流さない
  if (input.notifySlack && siteOrigin) {
    const expiresLabel = expiresAt ? expiresAt.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' }) + 'まで' : '無期限';
    const post = inviteSlackPost({ label, expiresLabel, url, qrUrl: siteOrigin + inviteQrPath(token, 'small') });
    // postToSlack は失敗しても例外を投げない(作成は成功扱い)
    await postToSlack(post.text, post.blocks);
  }
  return { id: row.id, url, qrDataUrl };
}

export async function listInvites(): Promise<InviteView[]> {
  const userId = await currentAdminUserId();
  const db = getDb();
  if (!userId || !db) return [];
  const rows = await db.select({
    id: schema.signupInvites.id,
    label: schema.signupInvites.label,
    createdAt: schema.signupInvites.createdAt,
    expiresAt: schema.signupInvites.expiresAt,
    maxUses: schema.signupInvites.maxUses,
    usedCount: schema.signupInvites.usedCount,
    revokedAt: schema.signupInvites.revokedAt,
  })
    .from(schema.signupInvites)
    .orderBy(desc(schema.signupInvites.createdAt));
  const now = new Date();
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    createdAt: row.createdAt.toISOString(),
    expiresAt: row.expiresAt?.toISOString() ?? null,
    maxUses: row.maxUses,
    usedCount: row.usedCount,
    revokedAt: row.revokedAt?.toISOString() ?? null,
    isActive: isInviteActive(row, now),
  }));
}

export async function revokeInvite(id: string): Promise<boolean> {
  const userId = await currentAdminUserId();
  const db = getDb();
  if (!userId || !db) return false;
  if (!UUID_PATTERN.test(id)) return false;
  // 管理者判定済みなので本人条件は不要。失効済みの revoked_at は上書きしない
  const revoked = await db.update(schema.signupInvites)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.signupInvites.id, id), isNull(schema.signupInvites.revokedAt)))
    .returning({ id: schema.signupInvites.id });
  return revoked.length > 0;
}
