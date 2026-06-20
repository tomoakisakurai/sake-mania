'use client';
import { useEffect, useState, useCallback } from 'react';
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
import { CommentList } from './CommentList';
import { Menu } from './Menu';

function buildGcalUrl(eventDate: string, hour: string, name: string, place: string, description: string) {
  const date = eventDate.replace(/-/g, '');
  const [h, m] = hour.split(':');
  const start = `${date}T${h}${m}00`;
  const endHour = String((parseInt(h) + 3) % 24).padStart(2, '0');
  const end = `${date}T${endHour}${m}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${start}/${end}&location=${encodeURIComponent(place)}&details=${encodeURIComponent(description + '\n酒マニア SAKE MANIA')}`;
}

function parseHourFromLabel(dateLabel: string): string {
  const match = dateLabel.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '13:00';
}

export function Event({ eventId }: { eventId: string }) {
  const store = useStore();
  const router = useRouter();
  const isMobile = useStore((s) => s.vw < 768);
  const pagePadding = isMobile ? '20px 18px 130px' : '32px 40px 80px';
  const [event, setEvent] = useState<EventDetail | null>(null);
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

  if (!loaded) return <div style={{ padding: pagePadding }}><Loading /></div>;
  if (!event) {
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
        <div onClick={() => store.nav('events')} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← イベント一覧にもどる</div>
        <div className="font-serif text-[22px] font-bold mb-3">イベントが見つかりません</div>
        <div className="text-[14px] text-body leading-relaxed">削除されたか、URLが間違っている可能性があります。</div>
      </div>
    );
  }

  const handleToggle = async (status: EventStatus) => {
    if (!store.requireLogin()) return;
    const ok = await toggleEventStatus(event.id, status);
    if (!ok) { store.flash('更新に失敗しました'); return; }
    refresh();
  };

  const handleEdit = () => router.push(paths.eventEdit(event.id));
  const handleDelete = async () => {
    if (!window.confirm(`「${event.name}」を削除しますか? この操作は取り消せません。`)) return;
    const ok = await deleteEvent(event.id);
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
    const added = await addEventComment(event.id, commentDraft);
    if (!added) { store.flash('送信に失敗しました'); return; }
    setCommentDraft('');
    refresh();
  };

  const hour = parseHourFromLabel(event.dateLabel);
  const gcalUrl = event.eventDate
    ? buildGcalUrl(event.eventDate, hour, event.name, event.place, event.description)
    : null;
  const mapQuery = encodeURIComponent(event.venueQ || event.place);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed&hl=ja&z=15`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: pagePadding }}>
      <div onClick={() => store.nav('events')} className="text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← イベント一覧にもどる</div>
      <div className="font-mono text-[11px] tracking-[0.18em] text-accent mb-2.5">EVENT</div>
      <div className="flex items-start gap-3 mb-2">
        <div className="font-serif text-[30px] font-bold leading-tight flex-1 min-w-0">{event.name}</div>
        {event.isCreator && <Menu onEdit={handleEdit} onDelete={handleDelete} />}
      </div>
      <div className="text-[13.5px] text-muted mb-1">{event.dateLabel}</div>
      <div className="text-[13.5px] text-muted mb-6">
        {event.place}
        {event.fee && ` ・ ${event.fee}`}
      </div>

      <div className="flex gap-3 flex-wrap mb-7">
        <button
          onClick={() => handleToggle('going')}
          className={`rounded-full border-[1.5px] border-accent px-6 py-2.5 text-[13.5px] font-bold cursor-pointer transition-colors ${event.iGoing ? 'bg-accent text-surface' : 'bg-card text-accent'}`}
        >
          {event.iGoing ? '参加予定 ✓' : '参加する'}
        </button>
        <button
          onClick={() => handleToggle('interested')}
          className={`rounded-full border-[1.5px] border-primary px-6 py-2.5 text-[13.5px] font-bold cursor-pointer transition-colors ${event.iInterested ? 'bg-primary text-surface' : 'bg-card text-primary'}`}
        >
          {event.iInterested ? '興味あり ✓' : '興味あり'}
        </button>
        {event.officialUrl && (
          <a
            href={event.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-line hover:border-primary rounded-full px-5 py-2.5 text-[13px] font-bold text-ink no-underline bg-surface transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Googleカレンダーに追加
          </a>
        )}
      </div>

      {event.description && (
        <div className="text-[14px] leading-loose text-body mb-7 whitespace-pre-wrap">{event.description}</div>
      )}

      {event.goingMembers.length > 0 && (
        <>
          <div className="font-serif text-[16px] font-bold border-b border-line pb-2 mb-3.5">参加メンバー</div>
          <div className="flex flex-wrap gap-2 mb-7">
            {event.goingMembers.map((member, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-surface border border-line rounded-full pl-1 pr-3 py-1">
                <span style={{ background: member.avatarBg }} className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-bold">{member.avatar}</span>
                <span className="text-[12px] font-bold">{member.name}</span>
              </span>
            ))}
          </div>
        </>
      )}

      <div className="font-serif text-[16px] font-bold border-b border-line pb-2 mb-3.5">会場</div>
      <iframe
        src={mapSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-[280px] border-0 rounded-lg block bg-line-soft mb-2.5"
      />
      <a href={mapLink} target="_blank" rel="noreferrer" className="text-[12.5px] text-primary font-bold no-underline hover:underline">Googleマップで開く →</a>

      <div className="font-serif text-[16px] font-bold border-b border-line pb-2 mt-9 mb-4">
        コメント <span className="font-mono text-[12px] font-normal text-muted">{event.comments.length}件</span>
      </div>
      <CommentList comments={event.comments} onChanged={refresh} />

      <div className="flex gap-2.5 mt-4 items-start">
        <textarea
          value={commentDraft}
          onChange={(e) => setCommentDraft(e.target.value)}
          rows={2}
          placeholder="このイベントについて語ろう — 一緒に行く部員に呼びかけ"
          className="flex-1 min-w-0 bg-white border border-line rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed text-ink resize-y"
        />
        <Button onClick={handleSendComment} className="flex-shrink-0 self-end">送る</Button>
      </div>
    </div>
  );
}
