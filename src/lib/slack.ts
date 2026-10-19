// Slack Incoming Webhook への通知投稿。
// Slack App作成は不要で、SLACK_WEBHOOK_URL(環境変数)1本のみで動く最小構成。
// 投稿の成否はMEETUP/イベント作成自体の成否に影響してはいけないため、
// 例外は投げずconsole.errorに残すだけにする。

/**
 * 絶対URLの元になるベースURL。NEXT_PUBLIC_SITE_URL か Vercel本番URLが
 * 確定している場合だけ返す。ローカル開発(localhost)へは絶対に
 * フォールバックしない — Slackに http://localhost:xxxx のような
 * 誰も開けないリンクを送ってしまうのを防ぐため。
 */
function siteUrlForSlack(): string | null {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return null;
}

/** 絶対URLが組み立てられる場合のみ返す。組み立てられない(ローカル開発等)なら null。 */
export function absoluteUrl(path: string): string | null {
  const base = siteUrlForSlack();
  return base ? `${base}${path}` : null;
}

/** Block Kit のブロック。使うのは section と image だけなので、その2種だけ型にする */
export type SlackBlock =
  | { type: 'section'; text: { type: 'mrkdwn'; text: string } }
  | { type: 'image'; image_url: string; alt_text: string };

async function sendToWebhook(webhookUrl: string, payload: Record<string, unknown>): Promise<Response> {
  return fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/**
 * Slack Incoming Webhook に投稿する。SLACK_WEBHOOK_URL未設定なら何もしない(機能OFF)。
 * blocks を渡すと Block Kit で投稿し、text は通知のプレビューと blocks 非対応クライアントの本文になる。
 * blocks ありの投稿を Slack が 400 で拒否したら(image_url を取得できないと invalid_blocks で投稿ごと拒否される)、text だけで1回再送する。
 * 403 と 429 では再送しない(社内ルール)。5xx でも再送しない(元の投稿が届いている可能性があり、二重になる)。
 */
export async function postToSlack(text: string, blocks?: SlackBlock[]): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    if (!blocks) {
      const response = await sendToWebhook(webhookUrl, { text });
      if (!response.ok) {
        console.error('Slackへの投稿に失敗しました', response.status, await response.text());
      }
      return;
    }
    // image ブロックで QR を出すので、本文中のリンクの展開(og:image の QR)で二重に出さない
    const response = await sendToWebhook(webhookUrl, { text, blocks, unfurl_links: false, unfurl_media: false });
    if (response.ok) return;
    console.error('Slackへの投稿に失敗しました(blocks)', response.status, await response.text());
    if (response.status !== 400) return;
    const retryResponse = await sendToWebhook(webhookUrl, { text });
    if (!retryResponse.ok) {
      console.error('Slackへの投稿に失敗しました', retryResponse.status, await retryResponse.text());
    }
  } catch (error) {
    console.error('Slackへの投稿に失敗しました', error);
  }
}
