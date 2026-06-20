import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MembersClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('メンバー出身地マップ', '日本酒会のメンバーの出身地を地図で。');
export default function Page() { return <MembersClient />; }
