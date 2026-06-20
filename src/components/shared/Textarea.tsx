import type { TextareaHTMLAttributes } from 'react';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string;
};

export function Textarea({ className = '', rows = 4, ...rest }: Props) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={`w-full bg-surface border border-line rounded-[10px] px-4 py-3 text-[14px] leading-relaxed text-ink resize-y ${className}`}
    />
  );
}
