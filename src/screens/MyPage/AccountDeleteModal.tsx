'use client';
import { useState } from 'react';
import { useStore } from '@/store';
import { deleteMyAccount } from '@/app/actions/profile';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AccountDeleteModal({ open, onClose }: Props) {
  const store = useStore();
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (busy) return;
    setBusy(true);
    const ok = await deleteMyAccount();
    if (!ok) {
      setBusy(false);
      store.flash('退会に失敗しました。時間をおいて再度お試しください');
      return;
    }
    store.flash('退会しました。ご利用ありがとうございました');
    store.logout();
  };

  return (
    <Modal open={open} onClose={onClose} title="退会の確認" width="sm">
      <p className="m-0 mb-4 text-[13.5px] leading-relaxed text-body">
        退会すると以下のデータがすべて削除されます。この操作は取り消せません。
      </p>
      <ul className="m-0 mb-4 list-disc pl-5 text-[13px] leading-relaxed text-body">
        <li>テイスティング記録（付いたコメント・のみたいねを含む）</li>
        <li>あなたが書いたコメント・のみたいね</li>
        <li>MEETUP・イベントへの出欠、持ち寄り宣言、投票</li>
        <li>プロフィールとログインアカウント</li>
      </ul>
      <p className="m-0 mb-6 text-[12.5px] leading-relaxed text-muted">
        あなたが主催したMEETUPと共有した酒イベントの情報は、部の記録として残ります。
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={busy}>キャンセル</Button>
        <Button variant="danger" onClick={handleDelete} disabled={busy}>
          {busy ? '退会処理中…' : '退会する'}
        </Button>
      </div>
    </Modal>
  );
}
