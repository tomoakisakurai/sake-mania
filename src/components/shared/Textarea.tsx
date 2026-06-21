import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string;
};

export function Textarea({ className, rows = 4, ...rest }: Props) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={clsx('w-full resize-y rounded-[10px] border border-line bg-surface px-4 py-3 text-[14px] leading-relaxed text-ink', className)}
    />
  );
}
