import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { MeetupCreateClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('SAKE MEETUPを立てる', '日本酒部の次の持ち寄り会を企画する。');
export default function Page() { return <MeetupCreateClient />; }
