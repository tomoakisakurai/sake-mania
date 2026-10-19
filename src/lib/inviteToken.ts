import 'server-only';
import { createHash, randomBytes } from 'node:crypto';

// 招待トークンの生成とハッシュ(サーバー専用)。発行(actions/invites.ts)と有効性の確認(api/invite-status)で共有する。

/** randomBytes(24) の base64url = 32文字。形式が違うものは DB を引かずに無効と判定する */
const INVITE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32}$/;

export function generateInviteToken(): string {
  return randomBytes(24).toString('base64url');
}

export function isInviteTokenFormat(token: string): boolean {
  return INVITE_TOKEN_PATTERN.test(token);
}

/** トリガー側の encode(digest(token, 'sha256'), 'hex') と同じ値 */
export function hashInviteToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
