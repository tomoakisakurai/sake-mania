'use client';
import { useOptimistic, startTransition } from 'react';
import clsx from 'clsx';
import { useStore } from '@/store';

type Props = {
  meetupId: string;
  iGoing: boolean;
};

type OptimisticTarget = { iGoing: boolean };

// MEETUP一覧カード内の参加トグルボタン。
// 押下直後に見た目を先行反映するため useOptimistic を使う。
// リデューサーは冪等にするため絶対値(target)を渡す。
export function MeetupGoButton({ meetupId, iGoing }: Props) {
  const store = useStore();
  const [optimistic, applyOptimistic] = useOptimistic<OptimisticTarget, OptimisticTarget>(
    { iGoing },
    (_state, target) => target,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!store.requireLogin()) return;
    const nextIGoing = !iGoing;
    startTransition(async () => {
      applyOptimistic({ iGoing: nextIGoing });
      await store.toggleGoing(meetupId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'ml-auto cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-primary px-5 py-[7px] text-[12.5px] font-bold',
        optimistic.iGoing ? 'bg-primary text-surface' : 'bg-surface text-primary',
      )}
    >
      {optimistic.iGoing ? '参加予定 ✓' : '参加する'}
    </button>
  );
}
