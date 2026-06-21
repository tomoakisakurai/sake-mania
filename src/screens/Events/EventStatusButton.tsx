'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import type { EventStatus } from '@/app/actions/events';
import { Spinner } from '@/components/shared/Spinner';

type Props = {
  status: EventStatus;
  active: boolean;
  labelOn: string;
  labelOff: string;
  size?: 'sm' | 'md';
  onToggle: () => Promise<void>;
};

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-[12.5px]',
  md: 'px-6 py-2.5 text-[13.5px]',
} as const;

// イベントの「参加する/興味あり」トグル。通信中は spinner を出すだけで
// 文言・背景は据え置き。サーバー応答後 props.active が更新されたタイミングで
// spinner と表示が同じ render で同時に切り替わる(target state パターン)。
// 連打防止に disabled。
export function EventStatusButton({ status, active, labelOn, labelOff, size = 'sm', onToggle }: Props) {
  const [target, setTarget] = useState<boolean | null>(null);
  const isUpdating = target !== null && target !== active;

  useEffect(() => {
    if (target !== null && target === active) setTarget(null);
  }, [active, target]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (target !== null) return;
    setTarget(!active);
    await onToggle();
  };

  const border = status === 'going' ? 'border-accent' : 'border-primary';
  const onBg = status === 'going' ? 'bg-accent text-surface' : 'bg-primary text-surface';
  const offBg = status === 'going' ? 'bg-card text-accent' : 'bg-card text-primary';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isUpdating}
      className={clsx(
        'inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] font-bold transition-colors',
        border,
        SIZE_CLASSES[size],
        isUpdating ? 'cursor-wait' : 'cursor-pointer',
        active ? onBg : offBg,
      )}
    >
      {isUpdating && <Spinner className={size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />}
      {active ? labelOn : labelOff}
    </button>
  );
}
