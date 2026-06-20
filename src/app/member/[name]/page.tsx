import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MemberClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('メンバー', '日本酒会メンバーのプロフィール。');
export default function Page() { return <MemberClient />; }
