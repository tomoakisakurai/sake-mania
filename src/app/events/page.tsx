import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { EventsClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('酒イベント情報', '社内外の日本酒イベントをチェックして、一緒に行く部員と語ろう。');
export default function Page() { return <EventsClient />; }
