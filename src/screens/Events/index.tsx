'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { paths } from '@/lib/routes';
import { getEvents, toggleEventStatus } from '@/app/actions/events';
import type { EventView, EventStatus } from '@/app/actions/events';
import { Button } from '@/components/shared/Button';

function shortDate(eventDate: string | null): string {
  if (!eventDate) return '';
  const [, m, d] = eventDate.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

export function Events() {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const [events, setEvents] = useState<EventView[]>([]);
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

  const toggleStatus = async (event: EventView, status: EventStatus) => {
    if (!store.requireLogin()) return;
    const before = events;
    const optimistic: EventView[] = events.map((e) => {
      if (e.id !== event.id) return e;
      if (status === 'going') {
        const next = !e.iGoing;
        return { ...e, iGoing: next, goingCount: e.goingCount + (next ? 1 : -1) };
      }
      const next = !e.iInterested;
      return { ...e, iInterested: next, interestedCount: e.interestedCount + (next ? 1 : -1) };
    });
    setEvents(optimistic);
    const ok = await toggleEventStatus(event.id, status);
    if (!ok) {
      store.flash('更新に失敗しました');
      setEvents(before);
      return;
    }
    // 参加アバター一覧などはサーバ側で算出するので再取得して同期する
    const fresh = await getEvents();
    setEvents(fresh);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('home')} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← ホームにもどる</div>
      <div className="flex flex-wrap items-center gap-3.5 mb-2.5">
        <div className="font-mono text-[11px] tracking-[0.18em] text-accent">EVENTS</div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { if (store.requireLogin()) store.nav('eventCreate'); }}
          className="ml-auto whitespace-nowrap"
        >
          ＋ イベントを登録する
        </Button>
      </div>
      <div className="font-serif text-[28px] font-bold mb-1.5">酒イベント情報</div>
      <div className="text-[13px] text-muted mb-7">社内外の日本酒イベントをチェック。「参加する」「興味あり」を表明すると、一緒に行く部員が見えます。</div>

      {loaded && events.length === 0 && (
        <div className="border border-dashed border-line-strong rounded-xl py-12 text-center bg-surface text-[13px] text-muted">
          まだイベントが登録されていません。最初のイベントを登録しましょう。
        </div>
      )}

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => router.push(paths.event(event.id))}
            className="bg-white border border-line hover:border-primary rounded-2xl p-5 sm:p-6 cursor-pointer transition-colors"
          >
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="font-mono text-[11.5px] text-accent font-bold">{shortDate(event.eventDate)}</span>
              <div className="font-serif text-[19px] font-bold leading-snug">{event.name}</div>
            </div>
            <div className="text-[12.5px] text-muted mb-1.5">{event.dateLabel}</div>
            <div className="text-[12.5px] text-muted mb-4">
              {event.place}
              {event.kuras > 0 && ` ・ 参加蔵 ${event.kuras}`}
            </div>
            <div className="flex flex-wrap items-center gap-3.5 mb-3.5">
              {event.goingAvatars.length > 0 && (
                <div className="flex">
                  {event.goingAvatars.map((member, i) => (
                    <div
                      key={i}
                      style={{ background: member.avatarBg }}
                      className="w-[26px] h-[26px] rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold -ml-1.5 first:ml-0"
                    >
                      {member.avatar}
                    </div>
                  ))}
                </div>
              )}
              <span className="font-mono text-[11.5px] text-body">{event.goingCount}人が参加予定</span>
              <span className="font-mono text-[11.5px] text-muted">・ {event.interestedCount}人が興味あり</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'going'); }}
                className={`rounded-full border-[1.5px] border-accent px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.iGoing ? 'bg-accent text-surface' : 'bg-card text-accent'}`}
              >
                {event.iGoing ? '参加予定 ✓' : '参加する'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'interested'); }}
                className={`rounded-full border-[1.5px] border-primary px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.iInterested ? 'bg-primary text-surface' : 'bg-card text-primary'}`}
              >
                {event.iInterested ? '興味あり ✓' : '興味あり'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
