import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { KuraRegClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('酒蔵を登録する', '図鑑にまだ載っていない酒蔵を申請する。');
export default function Page() { return <KuraRegClient />; }
