import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MyPageClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('マイページ', '自分の利き酒帳と利き酒師ランク、都道府県・蔵の制覇状況。');
export default function Page() { return <MyPageClient />; }
