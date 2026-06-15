import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MapClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('酒蔵マップ', '全国の酒蔵を地図で。あなたが呑んだ県が朱に染まる、制覇の記録。');
export default function Page() { return <MapClient />; }
