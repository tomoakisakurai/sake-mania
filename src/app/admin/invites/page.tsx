import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { AdminInvitesClient } from '@/app/_screens';
export const metadata: Metadata = pageMeta('招待リンク', '社用メールアドレス以外の新規登録に使う招待リンクを発行する。');
export default function Page() { return <AdminInvitesClient />; }
