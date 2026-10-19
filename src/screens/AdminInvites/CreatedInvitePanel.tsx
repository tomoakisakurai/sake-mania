'use client';
import type { CreatedInvite } from '@/app/actions/invites';
import { useStore } from '@/store';
import { Button } from '@/components/shared/Button';

type Props = {
  invite: CreatedInvite;
};

// 発行直後の招待リンク。トークンの平文は DB に無いため、この画面を離れると二度と表示できない。
export function CreatedInvitePanel({ invite }: Props) {
  const store = useStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invite.url);
      store.flash('招待リンクをコピーしました');
    } catch {
      store.flash('コピーできませんでした。リンクを選択してコピーしてください');
    }
  };

  return (
    <section className="mb-8 rounded-2xl border border-accent bg-accent-tint p-6">
      <h2 className="m-0 mb-2 font-serif text-[18px] font-bold">発行した招待リンク</h2>
      <p className="m-0 mb-4 text-[12.5px] font-bold text-accent-dark">このトークンは今だけ表示されます。画面を離れる前にコピーするか、QR コードを共有してください。</p>
      <p className="m-0 mb-3 break-all rounded-[10px] border border-line bg-surface px-4 py-3 font-mono text-[12.5px] text-ink">{invite.url}</p>
      <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>コピーする</Button>
      <img src={invite.qrDataUrl} alt="招待リンクの QR コード" width={240} height={240} className="mt-4 block rounded-lg border border-line bg-card" />
    </section>
  );
}
