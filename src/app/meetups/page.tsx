import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MeetupsClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('SAKE MEETUP', '日本酒部の持ち寄り会。出欠・持ち寄り宣言・MVP投票。');
export default function Page() { return <MeetupsClient />; }
