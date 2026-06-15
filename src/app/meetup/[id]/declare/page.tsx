import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { DeclareClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('持ち寄り宣言', 'SAKE MEETUPに持ち寄る一本を宣言する。');
export default function Page() { return <DeclareClient />; }
