'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { paths } from '@/lib/routes';
import { getEvents, toggleEventStatus } from '@/app/actions/events';
import type { EventView, EventStatus } from '@/app/actions/events';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { EventStatusButton } from './EventStatusButton';

function shortDate(eventDate: string | null): string {
  if (!eventDate) return '';
  const [, monthStr, dayStr] = eventDate.split('-');
  return `${parseInt(monthStr)}/${parseInt(dayStr)}`;
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
    const ok = await toggleEventStatus(event.id, status);
    if (!ok) {
      store.flash('更新に失敗しました');
      return;
    }
    const fresh = await getEvents();
    setEvents(fresh);
  };

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('home')} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← ホームにもどる</a>
      <header className="mb-2.5 flex flex-wrap items-center gap-3.5">
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
      <h1 className="m-0 mb-1.5 font-serif text-[28px] font-bold">酒イベント情報</h1>
      <p className="m-0 mb-7 text-[13px] text-muted">社内外の日本酒イベントをチェック。「参加する」「興味あり」を表明すると、一緒に行く部員が見えます。</p>

      {!loaded && <Loading />}
      {loaded && events.length === 0 && (
        <p className="m-0 rounded-xl border border-dashed border-line-strong bg-surface py-12 text-center text-[13px] text-muted">
          まだイベントが登録されていません。最初のイベントを登録しましょう。
        </p>
      )}

      <ul className="m-0 flex flex-col gap-4 p-0 list-none">
        {events.map((event) => (
          <li
            key={event.id}
            onClick={() => router.push(paths.event(event.id))}
            className="cursor-pointer rounded-2xl border border-line bg-card p-5 transition-colors hover:border-primary sm:p-6"
          >
            <header className="mb-2 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-[11.5px] font-bold text-accent">{shortDate(event.eventDate)}</span>
              <h2 className="m-0 font-serif text-[19px] font-bold leading-snug">{event.name}</h2>
            </header>
            <p className="m-0 mb-1.5 text-[12.5px] text-muted">{event.dateLabel}</p>
            <p className="m-0 mb-4 text-[12.5px] text-muted">
              {event.place}
              {event.kuras > 0 && ` ・ 参加蔵 ${event.kuras}`}
            </p>
            <div className="mb-3.5 flex flex-wrap items-center gap-3.5">
              {event.goingAvatars.length > 0 && (
                <span className="flex">
                  {event.goingAvatars.map((member, i) => (
                    <span
                      key={i}
                      style={{ background: member.avatarBg }}
                      className="-ml-1.5 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold first:ml-0"
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
              <EventStatusButton
                status="going"
                active={event.iGoing}
                labelOn="参加予定 ✓"
                labelOff="参加する"
                onToggle={() => toggleStatus(event, 'going')}
              />
              <EventStatusButton
                status="interested"
                active={event.iInterested}
                labelOn="興味あり ✓"
                labelOff="興味あり"
                onToggle={() => toggleStatus(event, 'interested')}
              />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
