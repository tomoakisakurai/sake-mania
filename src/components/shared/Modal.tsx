'use client';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg';
};

const WIDTH = {
  sm: 'max-w-100',
  md: 'max-w-140',
  lg: 'max-w-180',
} as const;

// 中央寄せモーダル。背景クリック / Esc で閉じる。
// body のスクロールは開いている間ロック。
export function Modal({ open, onClose, title, children, width = 'md' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-ink/55 px-4 py-12 animate-[fadeInOverlay_0.15s_ease_both]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          'relative w-full rounded-2xl border border-line bg-card shadow-[0_12px_48px_rgba(46,42,36,0.22)] animate-[fadeUp_0.2s_ease_both]',
          WIDTH[width],
        )}
      >
        {title && (
          <header className="flex items-center gap-3 border-b border-line-soft px-6 py-4">
            <h2 className="m-0 flex-1 font-serif text-[17px] font-bold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="閉じる"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-line-soft hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
