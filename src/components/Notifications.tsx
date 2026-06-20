'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import {
  getNotifications,
  markNotifRead,
  markAllNotifsRead,
} from '@/app/actions/notifications';
import type { NotifKind, NotifView } from '@/app/actions/notifications';

const KIND_ICON: Record<NotifKind, string> = {
  comment: '言',
  nomi: '杯',
  event_comment: '言',
  meetup_created: '盃',
  event_created: '酒',
  vote_open: '★',
  vote_closed: '★',
  bring_declared: '盃',
};

const KIND_BG: Record<NotifKind, string> = {
  comment: '#8B6B43',
  nomi: 'var(--color-success)',
  event_comment: '#8B6B43',
  meetup_created: 'var(--color-accent)',
  event_created: 'var(--color-accent-dark)',
  vote_open: 'var(--color-primary)',
  vote_closed: 'var(--color-primary)',
  bring_declared: 'var(--color-accent)',
};

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'たった今';
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}日前`;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotifView[]>([]);
  const router = useRouter();
  const authReady = useStore((s) => s.authReady);
  const loggedIn = useStore((s) => !!s.user);

  const refresh = useCallback(async () => {
    if (!loggedIn) {
      setNotifs([]);
      return;
    }
    const data = await getNotifications();
    setNotifs(data);
  }, [loggedIn]);

  useEffect(() => {
    if (!authReady) return;
    refresh();
    // パネルを開かなくてもベルの未読バッジが更新されるように、30秒おきに再取得
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [authReady, refresh]);

  const unreadCount = notifs.filter((notif) => notif.isUnread).length;
  const hasUnread = unreadCount > 0;

  const handleClick = async (notif: NotifView) => {
    setOpen(false);
    if (notif.isUnread) {
      // 楽観更新
      setNotifs((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isUnread: false } : n)));
      await markNotifRead(notif.id);
    }
    if (notif.targetPath) router.push(notif.targetPath);
  };

  const handleMarkAllRead = async () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    await markAllNotifsRead();
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
                <span onClick={handleMarkAllRead} className="text-[11.5px] text-primary cursor-pointer font-bold hover:underline">
                  すべて既読
                </span>
              )}
            </header>
            <ul className="max-h-[420px] overflow-y-auto m-0 p-0 list-none">
              {notifs.length === 0 && (
                <li className="px-[18px] py-10 text-center text-[12.5px] text-faint">
                  まだお知らせはありません
                </li>
              )}
              {notifs.map((notif) => (
                <li
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`flex gap-3 px-[18px] py-3 border-b border-line-soft cursor-pointer hover:bg-bg ${notif.isUnread ? '' : 'opacity-70'}`}
                >
                  <div
                    style={{ background: KIND_BG[notif.kind] }}
                    className="w-8 h-8 flex-shrink-0 rounded-full text-surface flex items-center justify-center font-serif text-[13px] font-bold"
                  >
                    {KIND_ICON[notif.kind]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-ink leading-relaxed m-0">{notif.text}</p>
                    <p className="text-[10.5px] text-faint mt-1 m-0">{relativeTime(notif.createdAt)}</p>
                  </div>
                  {notif.isUnread && (
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
