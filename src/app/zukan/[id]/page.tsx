import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { getCoreReferenceData } from '@/lib/getReferenceData';
import { DetailClient } from '@/app/_screens';

// 共有時に実際の銘柄名を出す（例:「新政 No.6 X-type — 酒マニア」）
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { brands } = await getCoreReferenceData();
  const b = brands.find((x) => x.id === decodeURIComponent(id));
  return b
    ? pageMeta(b.name, `${b.brewery} / ${b.pref} — ${b.cls}`)
    : pageMeta('銘柄詳細', '日本酒の銘柄詳細。');
}

export default function Page() { return <DetailClient />; }
