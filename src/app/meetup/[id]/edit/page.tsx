import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MeetupEditClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('SAKE MEETUPを編集する', 'SAKE MEETUP情報を更新する。');
export default function Page() { return <MeetupEditClient />; }
