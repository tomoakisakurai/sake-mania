'use client';
import { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
};

// 画像の拡大表示オーバーレイ。背景タップ / 画像タップ / Esc / ×ボタンで閉じる。
// 開いている間は body のスクロールをロック。
export function ImageLightbox({ open, onClose, src, alt = '' }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[95] flex cursor-zoom-out items-center justify-center bg-ink/85 p-4 animate-[fadeInOverlay_0.15s_ease_both] md:p-10"
    >
      <img src={src} alt={alt} className="max-h-full max-w-full rounded-lg object-contain animate-[fadeUp_0.2s_ease_both]" />
      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-ink/60 text-surface"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
