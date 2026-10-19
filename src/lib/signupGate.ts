// 新規登録の招待リンクゲート(クライアント・サーバー共通の補助)。
// 本当の判定は auth.users の BEFORE INSERT トリガー(src/db/setup-signup-gate.ts)で行う。
// ここはフォームで送信前に案内を出すため、招待URLを組み立てるため、Supabase のエラー文言を日本語にするために使う。

/** signUp の user metadata に招待トークンを載せるキー。トリガー側の `raw_user_meta_data ->> 'invite_token'` と一致させる */
export const INVITE_TOKEN_METADATA_KEY = 'invite_token';

/** 招待リンクで招待トークンを渡すクエリパラメータ名(/login?invite=...) */
export const INVITE_QUERY_PARAM = 'invite';

/** 招待リンクの URL */
export function inviteUrl(origin: string, token: string): string {
  return `${origin}/login?${INVITE_QUERY_PARAM}=${encodeURIComponent(token)}`;
}

/**
 * 招待リンクゲート(トリガー)による拒否か。Supabase Auth は経路によってトリガーの例外文
 * (`signup_gate: invite required` など)をそのまま返すことも、「Database error saving new user」に
 * 包んで返すこともあるため、両方を拾う(2026-10-20 に signup API で前者を確認)。
 */
export function isSignupGateError(message: string): boolean {
  return /signup_gate|database error/i.test(message);
}

/** Supabase の signUp が返した error.message を、画面に出す日本語に変換する */
export function signupErrorMessage(message: string): string {
  if (isSignupGateError(message)) {
    return '登録できませんでした。新規登録には幹事からの招待リンクが必要です(リンクが失効している場合もあります)';
  }
  if (/already registered|already exists/i.test(message)) {
    return 'このメールアドレスは登録済みです。ログインしてください';
  }
  return '登録に失敗しました: ' + message;
}

/** 招待がまだ使えるか(失効していない・期限内・上限未満)。トリガー側の判定と同じ条件 */
export function isInviteActive(
  invite: { revokedAt: Date | null; expiresAt: Date | null; maxUses: number | null; usedCount: number },
  now: Date,
): boolean {
  if (invite.revokedAt) return false;
  if (invite.expiresAt && invite.expiresAt.getTime() <= now.getTime()) return false;
  if (invite.maxUses != null && invite.usedCount >= invite.maxUses) return false;
  return true;
}
