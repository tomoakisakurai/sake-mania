import type { SlackBlock } from '@/lib/slack';
import { INVITE_QR_ALT } from '@/lib/signupGate';

// 招待リンクの Slack 投稿(文と QR 画像)を組み立てる。

export interface InviteSlackPostInput {
  /** 空なら「なし」 */
  label: string;
  /** 'YYYY/M/Dまで' か '無期限' */
  expiresLabel: string;
  /** 招待リンク(絶対 URL) */
  url: string;
  /** QR 画像の絶対 URL */
  qrUrl: string;
}

export function inviteSlackPost(input: InviteSlackPostInput): { text: string; blocks: SlackBlock[] } {
  const text = `🍶 酒マニアの招待リンクです(ラベル: ${input.label || 'なし'}、期限: ${input.expiresLabel})\n${input.url}`;
  return {
    text,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text } },
      { type: 'image', image_url: input.qrUrl, alt_text: INVITE_QR_ALT },
    ],
  };
}
