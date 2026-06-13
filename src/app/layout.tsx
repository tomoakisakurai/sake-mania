import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { getReferenceData } from '@/lib/getReferenceData';

export const metadata: Metadata = {
  title: '酒マニア — SAKE MANIA',
  description: '社内日本酒部のための利き酒記録アプリ',
};

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
