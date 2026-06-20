'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { paths } from '@/lib/routes';
import { getEvents, setEventStatus } from '@/app/actions/events';
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
    const next: EventStatus | null = event.myStatus === status ? null : status;
    const optimistic: EventView[] = events.map((e) => {
      if (e.id !== event.id) return e;
      const goingDelta = (next === 'going' ? 1 : 0) - (e.myStatus === 'going' ? 1 : 0);
      const interestedDelta = (next === 'interested' ? 1 : 0) - (e.myStatus === 'interested' ? 1 : 0);
      return {
        ...e,
        myStatus: next,
        goingCount: e.goingCount + goingDelta,
        interestedCount: e.interestedCount + interestedDelta,
      };
    });
    setEvents(optimistic);
    const ok = await setEventStatus(event.id, next);
    if (!ok) {
      store.flash('更新に失敗しました');
      setEvents(events);
    }
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('home')} className="text-[13px] text-[#8B8273] cursor-pointer mb-6 hover:text-[#32507C] transition-colors">← ホームにもどる</div>
      <div className="flex flex-wrap items-center gap-3.5 mb-2.5">
        <div className="font-mono text-[11px] tracking-[0.18em] text-[#BC6A2D]">EVENTS</div>
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
      <div className="text-[13px] text-[#8B8273] mb-7">社内外の日本酒イベントをチェック。「参加する」「興味あり」を表明すると、一緒に行く部員が見えます。</div>

      {loaded && events.length === 0 && (
        <div className="border border-dashed border-[#D9D0BC] rounded-xl py-12 text-center bg-[#FDFBF5] text-[13px] text-[#8B8273]">
          まだイベントが登録されていません。最初のイベントを登録しましょう。
        </div>
      )}

      <div className="flex flex-col gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => router.push(paths.event(event.id))}
            className="bg-white border border-[#E3DBCB] hover:border-[#32507C] rounded-2xl p-5 sm:p-6 cursor-pointer transition-colors"
          >
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="font-mono text-[11.5px] text-[#BC6A2D] font-bold">{shortDate(event.eventDate)}</span>
              <div className="font-serif text-[19px] font-bold leading-snug">{event.name}</div>
            </div>
            <div className="text-[12.5px] text-[#8B8273] mb-1.5">{event.dateLabel}</div>
            <div className="text-[12.5px] text-[#8B8273] mb-4">
              {event.place}
              {event.kuras > 0 && ` ・ 参加蔵 ${event.kuras}`}
            </div>
            <div className="flex flex-wrap items-center gap-3.5 mb-3.5">
              <span className="font-mono text-[11.5px] text-[#5C5547]">{event.goingCount}人参加</span>
              <span className="font-mono text-[11.5px] text-[#8B8273]">・ {event.interestedCount}人興味あり</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'going'); }}
                className={`border border-[1.5px] border-[#BC6A2D] rounded-full px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.myStatus === 'going' ? 'bg-[#BC6A2D] text-[#FDFBF5]' : 'bg-white text-[#BC6A2D]'}`}
              >
                {event.myStatus === 'going' ? '参加予定 ✓' : '参加する'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(event, 'interested'); }}
                className={`border border-[1.5px] border-[#32507C] rounded-full px-4 py-2 text-[12.5px] font-bold cursor-pointer transition-colors ${event.myStatus === 'interested' ? 'bg-[#32507C] text-[#FDFBF5]' : 'bg-white text-[#32507C]'}`}
              >
                {event.myStatus === 'interested' ? '興味あり ✓' : '興味あり'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
