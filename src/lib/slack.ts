// Slack Incoming Webhook への通知投稿。
// Slack App作成は不要で、SLACK_WEBHOOK_URL(環境変数)1本のみで動く最小構成。
// 投稿の成否はMEETUP/イベント作成自体の成否に影響してはいけないため、
// 例外は投げずconsole.errorに残すだけにする。

/** NEXT_PUBLIC_SITE_URL が設定されていれば絶対URLに、未設定なら相対パスのまま返す。 */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  return base ? `${base}${path}` : path;
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
