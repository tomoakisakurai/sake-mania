import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { ZukanClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('銘柄図鑑', '日本酒の銘柄カタログ。味わいの座標で次の一本を探す利き酒の図鑑。');
export default function Page() { return <ZukanClient />; }
