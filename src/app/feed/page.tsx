import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { FeedClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('みんなの利き酒帳', '部員みんなの利き酒記録。気になる一杯を見つけて、のみたいねやコメントを。');
export default function Page() { return <FeedClient />; }
