'use client';
import { useEffect, useState, useOptimistic, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { paths } from '@/lib/routes';
import { getEvents, toggleEventStatus } from '@/app/actions/events';
import type { EventView, EventStatus } from '@/app/actions/events';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';

function shortDate(eventDate: string | null): string {
  if (!eventDate) return '';
  const [, monthStr, dayStr] = eventDate.split('-');
  return `${parseInt(monthStr)}/${parseInt(dayStr)}`;
}

type OptimisticAction = { eventId: string; status: EventStatus };

function optimisticReducer(state: EventView[], action: OptimisticAction): EventView[] {
  return state.map((event) => {
    if (event.id !== action.eventId) return event;
    if (action.status === 'going') {
      const next = !event.iGoing;
      return { ...event, iGoing: next, goingCount: event.goingCount + (next ? 1 : -1) };
    }
    const next = !event.iInterested;
    return { ...event, iInterested: next, interestedCount: event.interestedCount + (next ? 1 : -1) };
  });
}

export function Events() {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const [events, setEvents] = useState<EventView[]>([]);
  const [optimisticEvents, applyOptimistic] = useOptimistic(events, optimisticReducer);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getEvents().then((data) => {
      if (!active) return;
      setEvents(data);
      setLoaded(true);
    });
    return () => { active = false; };
  }, []);

  const toggleStatus = (event: EventView, status: EventStatus) => {
    if (!store.requireLogin()) return;
    startTransition(async () => {
      applyOptimistic({ eventId: event.id, status });
      const ok = await toggleEventStatus(event.id, status);
      if (!ok) {
        store.flash('更新に失敗しました');
        return;
      }
      // サーバー側で算出される参加アバター一覧などを同期するため再取得
      const fresh = await getEvents();
      setEvents(fresh);
    });
  };

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('home')} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← ホームにもどる</a>
      <header className="flex flex-wrap items-center gap-3.5 mb-2.5">
        <span className="font-mono text-[11px] tracking-[0.18em] text-accent">EVENTS</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { if (store.requireLogin()) store.nav('eventCreate'); }}
          className="ml-auto whitespace-nowrap"
        >
          ＋ イベントを登録する
        </Button>
      </header>
      <h1 className="font-serif text-[28px] font-bold mb-1.5 m-0">酒イベント情報</h1>
      <p className="text-[13px] text-muted mb-7 m-0">社内外の日本酒イベントをチェック。「参加する」「興味あり」を表明すると、一緒に行く部員が見えます。</p>

      {!loaded && <Loading />}
      {loaded && optimisticEvents.length === 0 && (
        <p className="border border-dashed border-line-strong rounded-xl py-12 text-center bg-surface text-[13px] text-muted m-0">
          まだイベントが登録されていません。最初のイベントを登録しましょう。
        </p>
      )}

      <ul className="flex flex-col gap-4 m-0 p-0 list-none">
        {optimisticEvents.map((event) => (
          <li
            key={event.id}
            onClick={() => router.push(paths.event(event.id))}
            className="bg-card border border-line hover:border-primary rounded-2xl p-5 sm:p-6 cursor-pointer transition-colors"
          >
            <header className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="font-mono text-[11.5px] text-accent font-bold">{shortDate(event.eventDate)}</span>
              <h2 className="font-serif text-[19px] font-bold leading-snug m-0">{event.name}</h2>
            </header>
            <p className="text-[12.5px] text-muted mb-1.5 m-0">{event.dateLabel}</p>
            <p className="text-[12.5px] text-muted mb-4 m-0">
              {event.place}
              {event.kuras > 0 && ` ・ 参加蔵 ${event.kuras}`}
            </p>
            <div className="flex flex-wrap items-center gap-3.5 mb-3.5">
              {event.goingAvatars.length > 0 && (
                <span className="flex">
                  {event.goingAvatars.map((member, i) => (
                    <span
                      key={i}
                      style={{ background: member.avatarBg }}
                      className="w-6.5 h-6.5 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold -ml-1.5 first:ml-0"
                    >
                      {member.avatar}
                    </span>
                  ))}
                </span>
              )}
              <span className="font-mono text-[11.5px] text-body">{event.goingCount}人が参加予定</span>
              <span className="font-mono text-[11.5px] text-muted">・ {event.interestedCount}人が興味あり</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'going'); }}
                className={`rounded-full border-[1.5px] border-accent px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.iGoing ? 'bg-accent text-surface' : 'bg-card text-accent'}`}
              >
                {event.iGoing ? '参加予定 ✓' : '参加する'}
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'interested'); }}
                className={`rounded-full border-[1.5px] border-primary px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.iInterested ? 'bg-primary text-surface' : 'bg-card text-primary'}`}
              >
                {event.iInterested ? '興味あり ✓' : '興味あり'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
