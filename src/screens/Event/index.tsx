'use client';
import { useEffect, useState, useCallback, useOptimistic, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import {
  getEventDetail,
  toggleEventStatus,
  addEventComment,
  deleteEvent,
} from '@/app/actions/events';
import type { EventDetail, EventStatus } from '@/app/actions/events';
import { paths } from '@/lib/routes';
import { Button } from '@/components/shared/Button';
import { Loading } from '@/components/shared/Loading';
import { KebabMenu } from '@/components/shared/KebabMenu';
import { CommentList } from './CommentList';

const EDIT_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DELETE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

function buildGcalUrl(eventDate: string, hour: string, name: string, place: string, description: string) {
  const date = eventDate.replace(/-/g, '');
  const [hourStr, minuteStr] = hour.split(':');
  const start = `${date}T${hourStr}${minuteStr}00`;
  const endHour = String((parseInt(hourStr) + 3) % 24).padStart(2, '0');
  const end = `${date}T${endHour}${minuteStr}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${start}/${end}&location=${encodeURIComponent(place)}&details=${encodeURIComponent(description + '\n酒マニア SAKE MANIA')}`;
}

function parseHourFromLabel(dateLabel: string): string {
  const match = dateLabel.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '13:00';
}

// 保留中アクションは基底state更新時に再適用されるため、相対トグルだと
// ちらつく。アクションには目標state(冪等)を渡す。
type OptimisticAction = { status: EventStatus; nextValue: boolean };

function optimisticReducer(state: EventDetail | null, action: OptimisticAction): EventDetail | null {
  if (!state) return state;
  if (action.status === 'going') {
    const delta = (action.nextValue ? 1 : 0) - (state.iGoing ? 1 : 0);
    return { ...state, iGoing: action.nextValue, goingCount: state.goingCount + delta };
  }
  const delta = (action.nextValue ? 1 : 0) - (state.iInterested ? 1 : 0);
  return { ...state, iInterested: action.nextValue, interestedCount: state.interestedCount + delta };
}

export function Event({ eventId }: { eventId: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [optimisticEvent, applyOptimistic] = useOptimistic(event, optimisticReducer);
  const [loaded, setLoaded] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');

  const refresh = useCallback(async () => {
    const data = await getEventDetail(eventId);
    setEvent(data);
    setLoaded(true);
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!loaded) return <main style={{ padding: pagePadding }}><Loading /></main>;
  if (!optimisticEvent) {
    return (
      <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
        <a onClick={() => store.nav('events')} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← イベント一覧にもどる</a>
        <h1 className="font-serif text-[22px] font-bold mb-3 m-0">イベントが見つかりません</h1>
        <p className="text-[14px] text-body leading-relaxed m-0">削除されたか、URLが間違っている可能性があります。</p>
      </main>
    );
  }

  const handleToggle = (status: EventStatus) => {
    if (!store.requireLogin()) return;
    const currentValue = status === 'going' ? optimisticEvent.iGoing : optimisticEvent.iInterested;
    const nextValue = !currentValue;
    startTransition(async () => {
      applyOptimistic({ status, nextValue });
      const ok = await toggleEventStatus(optimisticEvent.id, status);
      if (!ok) { store.flash('更新に失敗しました'); return; }
      await refresh();
    });
  };

  const handleEdit = () => router.push(paths.eventEdit(optimisticEvent.id));
  const handleDelete = async () => {
    if (!window.confirm(`「${optimisticEvent.name}」を削除しますか? この操作は取り消せません。`)) return;
    const ok = await deleteEvent(optimisticEvent.id);
    if (ok) {
      store.flash('イベントを削除しました');
      store.nav('events');
    } else {
      store.flash('削除できませんでした');
    }
  };

  const handleSendComment = async () => {
    if (!commentDraft.trim()) return;
    if (!store.requireLogin()) return;
    const added = await addEventComment(optimisticEvent.id, commentDraft);
    if (!added) { store.flash('送信に失敗しました'); return; }
    setCommentDraft('');
    refresh();
  };

  const hour = parseHourFromLabel(optimisticEvent.dateLabel);
  const gcalUrl = optimisticEvent.eventDate
    ? buildGcalUrl(optimisticEvent.eventDate, hour, optimisticEvent.name, optimisticEvent.place, optimisticEvent.description)
    : null;
  const mapQuery = encodeURIComponent(optimisticEvent.venueQ || optimisticEvent.place);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ja&z=15`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <a onClick={() => store.nav('events')} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← イベント一覧にもどる</a>
      <p className="font-mono text-[11px] tracking-[0.18em] text-accent mb-2.5 m-0">EVENT</p>
      <header className="flex items-start gap-3 mb-2">
        <h1 className="font-serif text-[30px] font-bold leading-tight flex-1 min-w-0 m-0">{optimisticEvent.name}</h1>
        {optimisticEvent.isCreator && (
          <KebabMenu
            items={[
              { label: 'このイベントを編集', icon: EDIT_ICON, onClick: handleEdit },
              { label: 'このイベントを削除', icon: DELETE_ICON, onClick: handleDelete, danger: true },
            ]}
          />
        )}
      </header>
      <p className="text-[13.5px] text-muted mb-1 m-0">{optimisticEvent.dateLabel}</p>
      <p className="text-[13.5px] text-muted mb-6 m-0">
        {optimisticEvent.place}
        {optimisticEvent.fee && ` ・ ${optimisticEvent.fee}`}
      </p>

      <div className="flex gap-3 flex-wrap mb-7">
        <span
          onClick={() => handleToggle('going')}
          className={`rounded-full border-[1.5px] border-accent px-6 py-2.5 text-[13.5px] font-bold cursor-pointer transition-colors ${optimisticEvent.iGoing ? 'bg-accent text-surface' : 'bg-card text-accent'}`}
        >
          {optimisticEvent.iGoing ? '参加予定 ✓' : '参加する'}
        </span>
        <span
          onClick={() => handleToggle('interested')}
          className={`rounded-full border-[1.5px] border-primary px-6 py-2.5 text-[13.5px] font-bold cursor-pointer transition-colors ${optimisticEvent.iInterested ? 'bg-primary text-surface' : 'bg-card text-primary'}`}
        >
          {optimisticEvent.iInterested ? '興味あり ✓' : '興味あり'}
        </span>
        {optimisticEvent.officialUrl && (
          <a
            href={optimisticEvent.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-line hover:border-primary rounded-full px-5 py-2.5 text-[13px] font-bold text-ink no-underline bg-surface transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            オフィシャルサイト
          </a>
        )}
        {gcalUrl && (
          <a
            href={gcalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-line hover:border-primary rounded-full px-5 py-2.5 text-[13px] font-bold text-ink no-underline bg-surface transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Googleカレンダーに追加
          </a>
        )}
      </div>

      {optimisticEvent.description && (
        <p className="text-[14px] leading-loose text-body mb-7 whitespace-pre-wrap m-0">{optimisticEvent.description}</p>
      )}

      {optimisticEvent.goingMembers.length > 0 && (
        <section className="mb-7">
          <h2 className="font-serif text-[16px] font-bold border-b border-line pb-2 mb-3.5 m-0">参加メンバー</h2>
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {optimisticEvent.goingMembers.map((member, i) => (
              <li key={i} className="inline-flex items-center gap-2 bg-surface border border-line rounded-full pl-1 pr-3 py-1">
                <span style={{ background: member.avatarBg }} className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-bold">{member.avatar}</span>
                <span className="text-[12px] font-bold">{member.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-9">
        <h2 className="font-serif text-[16px] font-bold border-b border-line pb-2 mb-3.5 m-0">会場</h2>
        <iframe
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-70 border-0 rounded-lg block bg-line-soft mb-2.5"
        />
        <a href={mapLink} target="_blank" rel="noreferrer" className="text-[12.5px] text-primary font-bold no-underline hover:underline">Googleマップで開く →</a>
      </section>

      <section>
        <h2 className="font-serif text-[16px] font-bold border-b border-line pb-2 mb-4 m-0">
          コメント <span className="font-mono text-[12px] font-normal text-muted">{optimisticEvent.comments.length}件</span>
        </h2>
        <CommentList comments={optimisticEvent.comments} onChanged={refresh} />

        <form
          onSubmit={(e) => { e.preventDefault(); handleSendComment(); }}
          className="flex gap-2.5 mt-4 items-start"
        >
          <textarea
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            rows={2}
            placeholder="このイベントについて語ろう — 一緒に行く部員に呼びかけ"
            className="flex-1 min-w-0 bg-card border border-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed text-ink resize-y"
          />
          <Button type="submit" className="shrink-0 self-end">送る</Button>
        </form>
      </section>
    </main>
  );
}
