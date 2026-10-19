import type { Metadata } from 'next';
import { pageMeta } from '@/lib/meta';
import { isInviteTokenActive } from '@/lib/inviteStatus';
import { INVITE_QR_ALT, INVITE_QR_SIZE, INVITE_QUERY_PARAM, inviteQrPath } from '@/lib/signupGate';
import { LoginClient } from '@/app/_screens';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const LOGIN_META = pageMeta('ログイン', '酒マニアにログイン。一杯ごとに、記憶を醸す。');

// 使える招待リンクのときだけ、Slack 等の展開に QR を出す。使えない、無い、形式不正のいずれでも通常のログイン画面のメタデータ。
// Slack の展開は未ログインのサーバーが開くので、cookie やログイン状態には依存しない
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const token = (await searchParams)[INVITE_QUERY_PARAM];
  if (typeof token !== 'string' || !(await isInviteTokenActive(token))) return LOGIN_META;
  return pageMeta('新規登録の招待', '招待リンクから新規登録できます。スマホでは QR コードを読み取って開いてください。', {
    image: { url: inviteQrPath(token), width: INVITE_QR_SIZE, height: INVITE_QR_SIZE, alt: INVITE_QR_ALT },
  });
}

export default function Page() { return <LoginClient />; }
