import type { InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  className?: string;
};

export function Input({ className = '', type = 'text', ...rest }: Props) {
  return (
    <input
      type={type}
      {...rest}
      className={`w-full bg-surface border border-line rounded-[10px] px-4 py-3 text-[14px] text-ink ${className}`}
    />
  );
}
