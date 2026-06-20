import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  // 紺ベタ塗り(主要アクション)
  primary: 'bg-[#32507C] hover:bg-[#263d5f] text-[#FDFBF5] border border-[#32507C]',
  // 紺アウトライン(任意アクション)
  secondary: 'bg-white hover:bg-[#EEF1F7] text-[#32507C] hover:text-[#263d5f] border border-[#32507C]',
  // 朱ベタ塗り(参加など強調アクション)
  accent: 'bg-[#BC6A2D] hover:bg-[#A4581F] text-[#FDFBF5] border border-[#BC6A2D]',
  // グレー枠(セカンダリ/キャンセル)
  outline: 'bg-[#FDFBF5] hover:border-[#32507C] text-[#5C5547] border border-[#E3DBCB]',
  // 削除など破壊的アクション
  danger: 'bg-[#FDFBF5] hover:border-[#B0402A] hover:text-[#B0402A] text-[#A89D8A] border border-[#E3DBCB]',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-4 py-2 text-[12.5px]',
  md: 'px-6 py-2.5 text-[13.5px]',
  lg: 'px-7 py-4 text-[15px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  const base = 'rounded-full font-bold cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2';
  const width = fullWidth ? 'w-full' : '';
  return (
    <button
      type={type}
      {...rest}
      className={`${base} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${width} ${className}`}
    />
  );
}
