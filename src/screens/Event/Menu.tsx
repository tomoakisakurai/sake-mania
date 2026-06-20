'use client';
import { useState } from 'react';

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export function Menu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    setOpen(false);
    onEdit();
  };
  const handleDelete = () => {
    setOpen(false);
    onDelete();
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
          <div className="absolute right-0 top-[38px] z-[81] bg-card border border-line rounded-[10px] shadow-[0_4px_20px_rgba(46,42,36,0.12)] min-w-[200px] p-1 animate-[fadeUp_0.15s_ease_both]">
            <div
              onClick={handleEdit}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[7px] text-[13px] text-ink hover:bg-line-soft cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              このイベントを編集
            </div>
            <div
              onClick={handleDelete}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[7px] text-[13px] text-danger hover:bg-[#F6EEEA] cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              このイベントを削除
            </div>
          </div>
        </>
      )}
    </div>
  );
}
