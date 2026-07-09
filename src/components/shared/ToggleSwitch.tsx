'use client';
import clsx from 'clsx';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
};

// 42x24 のトグルスイッチ(ON=朱 / OFF=グレー)。
// クリックは自身で完結させ、親要素へバブルさせない(カード全体クリックで
// トグルする親と組み合わせたとき二重トグルになるのを防ぐ)。
export function ToggleSwitch({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      className={clsx(
        'relative h-6 w-10.5 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        checked ? 'bg-accent' : 'bg-line-strong',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-[0_1px_3px_rgba(46,42,36,0.25)] transition-[left] duration-200',
          checked ? 'left-5' : 'left-0.5',
        )}
      />
    </button>
  );
}
