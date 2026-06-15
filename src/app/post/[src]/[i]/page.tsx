import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { PostClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('利き酒の記録', 'みんなの利き酒帳の一杯。味わいの座標とメモ。');
export default function Page() { return <PostClient />; }
