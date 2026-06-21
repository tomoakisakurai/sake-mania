import clsx from 'clsx';

type Props = {
  className?: string;
};

// インラインで使える小さなクルクル。border-current で親要素のtext色に追従。
// 大きさはclassNameでh-?/w-?指定する(デフォルトはh-4 w-4)。
export function Spinner({ className }: Props) {
  return (
    <span
      role="status"
      aria-label="読み込み中"
      className={clsx(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        className ?? 'h-4 w-4',
      )}
    />
  );
}
