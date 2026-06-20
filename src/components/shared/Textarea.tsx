import type { TextareaHTMLAttributes } from 'react';

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
  className?: string;
};

export function Textarea({ className = '', rows = 4, ...rest }: Props) {
  return (
    <textarea
      rows={rows}
      {...rest}
      className={`w-full bg-[#FDFBF5] border border-[#E3DBCB] rounded-[10px] px-4 py-3 text-[14px] leading-relaxed text-[#2E2A24] resize-y ${className}`}
    />
  );
}
