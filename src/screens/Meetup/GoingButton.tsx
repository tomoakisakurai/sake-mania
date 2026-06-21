'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from '@/store';
import { Spinner } from '@/components/shared/Spinner';

type Props = {
  meetupId: string;
  iGoing: boolean;
  goingCount: number;
};

// MEETUP詳細の参加トグル。通信中は spinner を出すだけで文言・背景は据え置き。
// サーバー応答後 props.iGoing が更新されたタイミングで spinner と表示が
// 同じ render で同時に切り替わる(target state パターン)。連打防止に disabled。
export function GoingButton({ meetupId, iGoing, goingCount }: Props) {
  const store = useStore();
  const [target, setTarget] = useState<boolean | null>(null);
  const isUpdating = target !== null && target !== iGoing;

  useEffect(() => {
    if (target !== null && target === iGoing) setTarget(null);
  }, [iGoing, target]);

  const handleClick = async () => {
    if (!store.requireLogin()) return;
    if (target !== null) return;
    setTarget(!iGoing);
    await store.toggleGoing(meetupId);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={isUpdating}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-primary px-7 py-3 text-[14.5px] font-bold',
          isUpdating ? 'cursor-wait' : 'cursor-pointer',
          iGoing ? 'bg-primary text-surface' : 'bg-surface text-primary',
        )}
      >
        {isUpdating && <Spinner className="h-4 w-4" />}
        {iGoing ? '参加予定です ✓' : '参加する'}
      </button>
      <span className="font-mono text-[12px] text-muted">{goingCount}人が参加予定</span>
    </div>
  );
}
