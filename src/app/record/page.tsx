import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { RecordClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('利き酒を記録する', '飲んだ一杯を、味わいの座標と言葉で記録する。');
export default function Page() { return <RecordClient />; }
