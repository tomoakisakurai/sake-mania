import type { InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  className?: string;
};

export function Input({ className = '', type = 'text', ...rest }: Props) {
  return (
    <input
      type={type}
      {...rest}
      className={`w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] text-[#2E2A24] ${className}`}
    />
  );
}
