import './globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Providers } from '@/components/Providers';
import { getCoreReferenceData } from '@/lib/getReferenceData';

// OG画像の相対URL解決やSlack展開のためのベースURL（Vercel本番URL→ローカルの順）
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:5174');

const SITE_NAME = '酒マニア — SAKE MANIA';
const SITE_DESC = '社内日本酒部のための利き酒記録アプリ';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // 各ページは title だけ指定すれば「<title> — 酒マニア」になる
  title: { default: SITE_NAME, template: '%s — 酒マニア' },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  // 社内向けアプリのため検索エンジンにインデックスさせない（全ページに適用）。
  // noindexはSlack等のリンク展開(OGP)には影響しない。
  robots: { index: false, follow: false },
  // Slack/SNSのリンク展開用デフォルト（各ページが openGraph.title/description で上書き）
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'ja_JP', title: SITE_NAME, description: SITE_DESC },
  twitter: { card: 'summary', title: SITE_NAME, description: SITE_DESC },
};

// DB-backed app: render on demand (per request) instead of prerendering at
// build time. Keeps the build independent of the database and always serves
// fresh data.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 初回ペイントに必要な土台(銘柄・メンバー)のみSSRで取得。
  // 残り(マップ系・サンプル投稿・MEETUPシード)は描画後にクライアントから後追い取得。
  const initialData = await getCoreReferenceData();
  return (
    <html lang="ja">
      <body>
        <Providers initialData={initialData}>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
