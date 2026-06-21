'use client';
import { useOptimistic, startTransition } from 'react';
import clsx from 'clsx';
import { useStore } from '@/store';

type Props = {
  meetupId: string;
  iGoing: boolean;
  goingCount: number;
};

type OptimisticTarget = { iGoing: boolean; goingCount: number };

export function GoingButton({ meetupId, iGoing, goingCount }: Props) {
  const store = useStore();
  // 押下直後にボタンの見た目と人数を先行反映する。
  // useOptimistic のリデューサーは保留中アクションを基底state更新時に再適用するため、
  // 相対トグル `!state` だと再適用時に逆方向に振れて視覚的にちらつく。
  // アクションには目標state(絶対値)を渡し、リデューサーは冪等にする。
  const [optimisticState, applyOptimistic] = useOptimistic<OptimisticTarget, OptimisticTarget>(
    { iGoing, goingCount },
    (_state, target) => target,
  );

  const handleClick = () => {
    if (!store.requireLogin()) return;
    const nextIGoing = !iGoing;
    const nextGoingCount = goingCount + (nextIGoing ? 1 : -1);
    startTransition(async () => {
      applyOptimistic({ iGoing: nextIGoing, goingCount: nextGoingCount });
      await store.toggleGoing(meetupId);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        className={clsx(
          'cursor-pointer rounded-full border-[1.5px] border-primary px-7 py-3 text-[14.5px] font-bold',
          optimisticState.iGoing ? 'bg-primary text-surface' : 'bg-surface text-primary',
        )}
      >
        {optimisticState.iGoing ? '参加予定です ✓' : '参加する'}
      </button>
      <span className="font-mono text-[12px] text-muted">{optimisticState.goingCount}人が参加予定</span>
    </div>
  );
}
