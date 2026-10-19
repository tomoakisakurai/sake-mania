import QRCode from 'qrcode';
import { absoluteUrl } from '@/lib/slack';
import { INVITE_QR_SIZES, type InviteQrSize } from '@/lib/signupGate';

// 招待リンクの QR 画像(管理画面のデータURL、Slack の image ブロック、og:image で共有)。
// vitest で PNG を検査するため server-only は付けない(qrcode は node 専用なので、クライアントに混ざればビルドで落ちる)。

// 本番 URL が無い環境(ローカル開発)で招待URLを組み立てるときの origin
const LOCAL_ORIGIN = 'http://localhost:5174';

/** 招待 URL の origin。absoluteUrl と同じ仕組みで本番 URL を求め、無い環境(ローカル開発)では localhost */
export function inviteSiteOrigin(): string {
  return absoluteUrl('') ?? LOCAL_ORIGIN;
}

/** 招待 URL の QR を PNG で描画する(一辺 INVITE_QR_SIZES[size]、margin 2) */
export async function renderInviteQrPng(url: string, size: InviteQrSize = 'large'): Promise<Buffer> {
  return QRCode.toBuffer(url, { type: 'png', width: INVITE_QR_SIZES[size], margin: 2 });
}
