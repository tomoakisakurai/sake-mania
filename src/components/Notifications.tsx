'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NOTIFS } from '@/lib/notifs';
import type { Notif } from '@/lib/notifs';

export function Notifications() {
  const [open, setOpen] = useState(false);
  // 未読状態はクライアントメモリのみ(リロードでリセット)
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const unreadCount = NOTIFS.filter((n) => !readIds.has(n.id)).length;
  const hasUnread = unreadCount > 0;

  const handleClick = (notif: Notif) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(notif.id);
      return next;
    });
    setOpen(false);
    router.push(notif.path);
  };

  const markAllRead = () => {
    setReadIds(new Set(NOTIFS.map((n) => n.id)));
  };

  return (
    <div className="relative shrink-0">
      <div
        onClick={() => setOpen((prev) => !prev)}
        title="お知らせ"
        className="w-9 h-9 rounded-full bg-card border border-line flex items-center justify-center cursor-pointer text-ink hover:border-primary transition-colors"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      {hasUnread && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-lg bg-accent text-surface text-[10px] font-bold flex items-center justify-center border-2 border-surface pointer-events-none">
          {unreadCount}
        </span>
      )}
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-[80]" />
          <section className="fixed right-4 top-[64px] z-[81] bg-card border border-line rounded-xl shadow-[0_8px_28px_rgba(46,42,36,0.16)] w-[360px] max-w-[calc(100vw_-_32px)] animate-[fadeUp_0.15s_ease_both] overflow-hidden">
            <header className="flex items-center justify-between px-[18px] py-3.5 border-b border-line">
              <h2 className="font-serif text-[15px] font-bold m-0">お知らせ</h2>
              {hasUnread && (
                <span onClick={markAllRead} className="text-[11.5px] text-primary cursor-pointer font-bold hover:underline">
                  すべて既読
                </span>
              )}
            </header>
            <ul className="max-h-[420px] overflow-y-auto m-0 p-0 list-none">
              {NOTIFS.map((notif) => {
                const isUnread = !readIds.has(notif.id);
                return (
                  <li
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className={`flex gap-3 px-[18px] py-3 border-b border-line-soft cursor-pointer hover:bg-bg ${isUnread ? '' : 'opacity-70'}`}
                  >
                    <div
                      style={{ background: notif.bg }}
                      className="w-8 h-8 flex-shrink-0 rounded-full text-surface flex items-center justify-center font-serif text-[13px] font-bold"
                    >
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] text-ink leading-relaxed m-0">{notif.text}</p>
                      <p className="text-[10.5px] text-faint mt-1 m-0">{notif.time}</p>
                    </div>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
