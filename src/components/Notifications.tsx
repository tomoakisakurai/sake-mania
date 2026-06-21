'use client';
import { useEffect, useState, useCallback, useOptimistic, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useStore } from '@/store';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/app/actions/notifications';
import type { NotificationKind, NotificationView } from '@/app/actions/notifications';

const KIND_ICON: Record<NotificationKind, string> = {
  comment: '言',
  nomi: '杯',
  event_comment: '言',
  meetup_created: '盃',
  event_created: '酒',
  vote_open: '★',
  vote_closed: '★',
  bring_declared: '盃',
};

const KIND_BG: Record<NotificationKind, string> = {
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

type OptimisticAction = { kind: 'read'; id: string } | { kind: 'readAll' };

function optimisticReducer(state: NotificationView[], action: OptimisticAction): NotificationView[] {
  if (action.kind === 'readAll') return state.map((notification) => ({ ...notification, isUnread: false }));
  return state.map((notification) => (notification.id === action.id ? { ...notification, isUnread: false } : notification));
}

export function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  // useOptimisticでサーバー応答前に未読→既読の見え方を先行反映する
  const [optimisticNotifications, applyOptimistic] = useOptimistic(notifications, optimisticReducer);
  const router = useRouter();
  const authReady = useStore((s) => s.authReady);
  const loggedIn = useStore((s) => !!s.user);

  const refresh = useCallback(async () => {
    if (!loggedIn) {
      setNotifications([]);
      return;
    }
    const data = await getNotifications();
    setNotifications(data);
  }, [loggedIn]);

  useEffect(() => {
    if (!authReady) return;
    refresh();
    // パネルを開かなくてもベルの未読バッジが更新されるように、30秒おきに再取得
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [authReady, refresh]);

  const unreadCount = optimisticNotifications.filter((notification) => notification.isUnread).length;
  const hasUnread = unreadCount > 0;

  const handleClick = (notification: NotificationView) => {
    setOpen(false);
    if (notification.isUnread) {
      startTransition(async () => {
        applyOptimistic({ kind: 'read', id: notification.id });
        await markNotificationRead(notification.id);
        await refresh();
      });
    }
    if (notification.targetPath) router.push(notification.targetPath);
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      applyOptimistic({ kind: 'readAll' });
      await markAllNotificationsRead();
      await refresh();
    });
  };

  return (
    <aside className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        title="お知らせ"
        className="w-9 h-9 rounded-full bg-card border border-line flex items-center justify-center cursor-pointer text-ink hover:border-primary transition-colors p-0"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
      {hasUnread && (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-lg bg-accent text-surface text-[10px] font-bold flex items-center justify-center border-2 border-surface pointer-events-none">
          {unreadCount}
        </span>
      )}
      {open && (
        <>
          <span onClick={() => setOpen(false)} className="fixed inset-0 z-[80]" />
          <section className="fixed right-4 top-16 z-81 bg-card border border-line rounded-xl shadow-[0_8px_28px_rgba(46,42,36,0.16)] w-90 max-w-[calc(100vw-32px)] animate-[fadeUp_0.15s_ease_both] overflow-hidden">
            <header className="flex items-center justify-between px-4.5 py-3.5 border-b border-line">
              <h2 className="font-serif text-[15px] font-bold m-0">お知らせ</h2>
              {hasUnread && (
                <span onClick={handleMarkAllRead} className="text-[11.5px] text-primary cursor-pointer font-bold hover:underline">
                  すべて既読
                </span>
              )}
            </header>
            <ul className="max-h-105 overflow-y-auto m-0 p-0 list-none">
              {optimisticNotifications.length === 0 && (
                <li className="px-4.5 py-10 text-center text-[12.5px] text-faint">
                  まだお知らせはありません
                </li>
              )}
              {optimisticNotifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={clsx(
                    'flex cursor-pointer gap-3 border-b border-line-soft px-4.5 py-3 hover:bg-bg',
                    !notification.isUnread && 'opacity-70',
                  )}
                >
                  <span
                    style={{ background: KIND_BG[notification.kind] }}
                    className="w-8 h-8 shrink-0 rounded-full text-surface flex items-center justify-center font-serif text-[13px] font-bold"
                  >
                    {KIND_ICON[notification.kind]}
                  </span>
                  <article className="flex-1 min-w-0">
                    <p className="text-[12.5px] text-ink leading-relaxed m-0">{notification.text}</p>
                    <p className="text-[10.5px] text-faint mt-1 m-0">{relativeTime(notification.createdAt)}</p>
                  </article>
                  {notification.isUnread && (
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </aside>
  );
}
