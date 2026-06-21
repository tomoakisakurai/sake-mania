import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  className?: string;
};

export function Input({ className, type = 'text', ...rest }: Props) {
  return (
    <input
      type={type}
      {...rest}
      className={clsx('w-full rounded-[10px] border border-line bg-surface px-4 py-3 text-[14px] text-ink', className)}
    />
  );
}
