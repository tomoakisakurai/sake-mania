import clsx from 'clsx';

type Props = {
  label?: string;
  className?: string;
};

export function Loading({ label = '読み込み中...', className }: Props) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <span className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-primary" />
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  );
}
