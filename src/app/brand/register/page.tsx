import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { BrandRegClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('銘柄を登録する', '図鑑にまだ載っていない銘柄を登録する。');
export default function Page() { return <BrandRegClient />; }
