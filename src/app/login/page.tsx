import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { LoginClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('ログイン', '酒マニアにログイン。一杯ごとに、記憶を醸す。');
export default function Page() { return <LoginClient />; }
