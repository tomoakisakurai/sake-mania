'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';

export type KebabMenuItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
};

type Props = {
  items: KebabMenuItem[];
};

export function KebabMenu({ items }: Props) {
  const [open, setOpen] = useState(false);

  const handleItemClick = (item: KebabMenuItem) => {
    setOpen(false);
    item.onClick();
  };

  return (
    <div className="relative shrink-0">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:bg-line-soft hover:text-ink mt-1 cursor-pointer transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-[80]" />
          <div className="absolute right-0 top-9.5 z-[81] bg-card border border-line rounded-[10px] shadow-[0_4px_20px_rgba(46,42,36,0.12)] min-w-50 p-1 animate-[fadeUp_0.15s_ease_both]">
            {items.map((item, i) => (
              <div
                key={i}
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[7px] text-[13px] cursor-pointer ${item.danger ? 'text-danger hover:bg-[#F6EEEA]' : 'text-ink hover:bg-line-soft'}`}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
