import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { BrandEditClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('銘柄を編集する', '図鑑の銘柄情報を更新する。');
export default function Page() { return <BrandEditClient />; }
