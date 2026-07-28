'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from '@/store';
import { transferMeetupHost } from '@/app/actions/meetups';
import { listMembers } from '@/app/actions/members';
import type { MemberRow } from '@/app/actions/members';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/shared/Button';
import { Spinner } from '@/components/shared/Spinner';

type Props = {
  open: boolean;
  onClose: () => void;
  meetupId: string;
  currentHostId: string;
};

// 幹事交代モーダル。メンバーを選んで現幹事から引き継ぐ。
// 除外するのは「現幹事」のみ。管理者が他人の会を自分に引き継ぐケースがあるため、
// 自分自身は候補から外さない。
export function HostTransferModal({ open, onClose, meetupId, currentHostId }: Props) {
  const store = useStore();
  const [members, setMembers] = useState<MemberRow[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedId(null);
    listMembers().then(setMembers);
  }, [open]);

  const candidates = (members ?? []).filter((member) => member.id !== currentHostId);
  const selected = candidates.find((member) => member.id === selectedId);

  const handleTransfer = async () => {
    if (!selectedId || busy) return;
    setBusy(true);
    const ok = await transferMeetupHost(meetupId, selectedId);
    if (!ok) {
      setBusy(false);
      store.flash('幹事の交代に失敗しました');
      return;
    }
    store.flash(`幹事を${selected?.nickname ?? ''}さんに交代しました`);
    setBusy(false);
    onClose();
    await Promise.all([store.loadMeetupDetail(meetupId), store.loadMeetups()]);
  };

  return (
    <Modal open={open} onClose={onClose} title="幹事を交代する" width="sm">
      <p className="m-0 mb-4 text-[13px] leading-relaxed text-body">
        新しい幹事を選んでください。交代すると、この会の編集・削除・MVP投票の開始/確定は新しい幹事のみが行えるようになります。
      </p>
      {members === null ? (
        <div className="flex justify-center py-6"><Spinner /></div>
      ) : candidates.length === 0 ? (
        <p className="m-0 mb-4 text-[12.5px] text-faint">交代できるメンバーがいません。</p>
      ) : (
        <ul className="m-0 mb-5 flex max-h-70 flex-col gap-1.5 overflow-y-auto p-0 list-none">
          {candidates.map((member) => (
            <li key={member.id}>
              <button
                type="button"
                onClick={() => setSelectedId(member.id)}
                className={clsx(
                  'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors',
                  selectedId === member.id ? 'border-primary bg-primary-tint' : 'border-line bg-card hover:border-primary',
                )}
              >
                <span style={{ background: member.avatarBg }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold">{member.avatar}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold">{member.nickname}</span>
                  {member.dept && <span className="block truncate text-[11px] text-muted">{member.dept}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={busy}>キャンセル</Button>
        <Button onClick={handleTransfer} disabled={busy || !selectedId}>
          {busy ? '交代中…' : selected ? `${selected.nickname}さんに交代する` : '交代する'}
        </Button>
      </div>
    </Modal>
  );
}
