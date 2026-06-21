'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore } from '@/store';
import { Spinner } from '@/components/shared/Spinner';

type Props = {
  meetupId: string;
  iGoing: boolean;
};

// MEETUP一覧カード内の参加トグルボタン。
// 通信中は spinner を出すだけで文言・背景は据え置き。
// サーバー応答後 props.iGoing が更新されたタイミングで spinner と表示が
// 同じ render で同時に切り替わる(target state パターン)。連打防止に disabled。
export function MeetupGoButton({ meetupId, iGoing }: Props) {
  const store = useStore();
  const [target, setTarget] = useState<boolean | null>(null);
  const isUpdating = target !== null && target !== iGoing;

  useEffect(() => {
    if (target !== null && target === iGoing) setTarget(null);
  }, [iGoing, target]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!store.requireLogin()) return;
    if (target !== null) return;
    setTarget(!iGoing);
    await store.toggleGoing(meetupId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating}
      className={clsx(
        'ml-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-primary px-5 py-[7px] text-[12.5px] font-bold',
        isUpdating ? 'cursor-wait' : 'cursor-pointer',
        iGoing ? 'bg-primary text-surface' : 'bg-surface text-primary',
      )}
    >
      {isUpdating && <Spinner className="h-3.5 w-3.5" />}
      {iGoing ? '参加予定 ✓' : '参加する'}
    </button>
  );
}
