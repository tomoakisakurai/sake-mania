import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { KuraClient } from '@/app/_screens';

// 共有時に蔵名を出す（例:「新政酒造 — 酒マニア」）
export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const n = decodeURIComponent(name);
  return pageMeta(n, `${n}の銘柄・所在地・味わい傾向。`);
}

export default function Page() { return <KuraClient />; }
