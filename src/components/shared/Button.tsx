import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'accent-outline' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  // 紺ベタ塗り(主要アクション)
  primary: 'bg-primary hover:bg-primary-dark text-surface border border-primary',
  // 紺アウトライン(任意アクション)
  secondary: 'bg-card hover:bg-primary-tint text-primary hover:text-primary-dark border border-primary',
  // 朱ベタ塗り(参加など強調アクション)
  accent: 'bg-accent hover:bg-accent-hover text-surface border border-accent',
  // 朱アウトライン(幹事メニュー等)
  'accent-outline': 'bg-card hover:bg-accent-tint text-accent border border-accent',
  // グレー枠(セカンダリ/キャンセル)
  outline: 'bg-surface hover:border-primary text-body border border-line',
  // 削除など破壊的アクション
  danger: 'bg-surface hover:border-danger hover:text-danger text-faint border border-line',
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
