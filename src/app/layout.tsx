import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { getCoreReferenceData } from '@/lib/getReferenceData';

export const metadata: Metadata = {
  title: '酒マニア — SAKE MANIA',
  description: '社内日本酒部のための利き酒記録アプリ',
  // 社内向けアプリのため検索エンジンにインデックスさせない（全ページに適用）
  robots: { index: false, follow: false },
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
      </body>
    </html>
  );
}
