import clsx from 'clsx';
import { Spinner } from './Spinner';

type Props = {
  label?: string;
  className?: string;
};

export function Loading({ label = '読み込み中...', className }: Props) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-16 text-primary', className)}>
      <Spinner className="h-8 w-8" />
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  );
}
