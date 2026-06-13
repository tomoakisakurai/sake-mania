import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { getReferenceData } from '@/lib/getReferenceData';

export const metadata: Metadata = {
  title: '酒マニア — SAKE MANIA',
  description: '社内日本酒部のための利き酒記録アプリ',
};

// DB-backed app: render on demand (per request) instead of prerendering at
// build time. Keeps the build independent of the database and always serves
// fresh data.
export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = await getReferenceData();
  return (
    <html lang="ja">
      <body>
        <Providers initialData={initialData}>{children}</Providers>
      </body>
    </html>
  );
}
