import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { EventClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('イベント詳細', '日本酒イベントの詳細と参加状況。');
export default function Page() { return <EventClient />; }
