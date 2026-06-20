import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { EventRegClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('イベントを登録する', '日本酒イベントを部のメンバーに共有する。');
export default function Page() { return <EventRegClient />; }
