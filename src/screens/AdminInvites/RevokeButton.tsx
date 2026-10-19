'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Spinner } from '@/components/shared/Spinner';

type Props = {
  revoked: boolean;
  onRevoke: () => Promise<boolean>;
};

// 招待リンクの失効ボタン。target state パターン(src/screens/Events/EventStatusButton.tsx と同じ)で、
// 通信中は spinner を出して連打を防ぎ、サーバー応答後に props.revoked が変わった render で表示を切り替える。
export function RevokeButton({ revoked, onRevoke }: Props) {
  const [target, setTarget] = useState<boolean | null>(null);
  const isUpdating = target !== null && target !== revoked;

  useEffect(() => {
    if (target !== null && target === revoked) setTarget(null);
  }, [revoked, target]);

  const handleClick = async () => {
    if (target !== null || revoked) return;
    if (!window.confirm('この招待リンクを失効しますか? 失効したリンクでは登録できなくなります。')) return;
    setTarget(true);
    const ok = await onRevoke();
    if (!ok) setTarget(null);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating || revoked}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-bold text-faint transition-colors hover:border-danger hover:text-danger',
        isUpdating ? 'cursor-wait' : 'cursor-pointer',
      )}
    >
      {isUpdating && <Spinner className="h-3.5 w-3.5" />}
      失効する
    </button>
  );
}
