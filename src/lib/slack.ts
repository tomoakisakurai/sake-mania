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

/** Slack Incoming Webhook にテキストを投稿する。SLACK_WEBHOOK_URL未設定なら何もしない(機能OFF)。 */
export async function postToSlack(text: string): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error('Slackへの投稿に失敗しました', response.status, await response.text());
    }
  } catch (error) {
    console.error('Slackへの投稿に失敗しました', error);
  }
}
