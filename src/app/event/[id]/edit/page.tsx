import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { EventEditClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('イベントを編集する', 'イベント情報を更新する。');
export default function Page() { return <EventEditClient />; }
