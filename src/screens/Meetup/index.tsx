'use client';
import clsx from 'clsx';
import { useStore } from '@/store';
import { deleteMeetup } from '@/app/actions/meetups';
import type { Vals } from '@/useVals';
import { Loading } from '@/components/shared/Loading';
import { KebabMenu } from '@/components/shared/KebabMenu';
import { isMeetupOngoing } from '@/lib/meetupStatus';
import { useNow } from '@/lib/useNow';
import { BeforePhase } from './BeforePhase';
import { ReviewPhase } from './ReviewPhase';

function buildGcalUrl(eventDate: string, dateLabel: string, name: string, place: string, theme: string) {
  const timeMatch = dateLabel.match(/(\d{1,2}):(\d{2})/);
  const hour = timeMatch ? timeMatch[1].padStart(2, '0') : '18';
  const minute = timeMatch ? timeMatch[2] : '00';
  const date = eventDate.replace(/-/g, '');
  const start = `${date}T${hour}${minute}00`;
  const endHour = String((parseInt(hour) + 2) % 24).padStart(2, '0');
  const end = `${date}T${endHour}${minute}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&dates=${start}/${end}&location=${encodeURIComponent(place)}&details=${encodeURIComponent('テーマ: ' + theme + '\n酒マニア SAKE MANIA')}`;
}

const DELETE_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export function Meetup({ vals }: { vals: Vals }) {
  const meetup = vals.meetup;
  const store = useStore();
  const meetupDetail = store.meetupDetail;
  const now = useNow();
  const ongoing = meetup.isBefore && isMeetupOngoing(meetupDetail?.eventDate, now);
  const gcalUrl = meetupDetail?.eventDate
    ? buildGcalUrl(meetupDetail.eventDate, meetupDetail.dateLabel, meetupDetail.name, meetupDetail.place, meetupDetail.theme)
    : null;
  const phaseLabel = ongoing ? '開催中' : meetup.phaseLabel;
  const phaseBg = ongoing
    ? 'bg-success'
    : meetup.isVoting ? 'bg-accent' : meetup.isClosed ? 'bg-body' : 'bg-primary';

  if (!meetupDetail) {
    return <main className="mx-auto max-w-230" style={{ padding: vals.pagePadTight }}><Loading /></main>;
  }

  const handleDelete = async () => {
    if (!window.confirm(`「${meetupDetail.name}」を削除しますか? この操作は取り消せません。`)) return;
    const ok = await deleteMeetup(meetupDetail.id);
    if (ok) {
      store.patch({ meetupDetail: null, meetupList: store.meetupList.filter((x) => x.id !== meetupDetail.id) });
      store.nav('meetups');
    } else {
      store.flash('削除できませんでした');
    }
  };

  return (
    <main className="mx-auto max-w-230" style={{ padding: vals.pagePadTight }}>
      <a onClick={meetup.backHome} className="mb-6 block cursor-pointer text-[13px] text-muted transition-colors hover:text-primary">← ホームにもどる</a>
      <header>
        <p className="m-0 mb-1 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.18em] text-accent">SAKE MEETUP</span>
          <span className={clsx('rounded-full px-3 py-0.5 text-[11px] font-bold text-surface', phaseBg)}>{phaseLabel}</span>
        </p>
        <div className="mb-2 flex items-start gap-3">
          <h1 className="m-0 min-w-0 flex-1 font-serif text-[32px] font-bold leading-tight">{meetup.name}</h1>
          {meetup.isHost && (
            <KebabMenu
              items={[
                { label: 'この会を削除', icon: DELETE_ICON, onClick: handleDelete, danger: true },
              ]}
            />
          )}
        </div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="m-0 mb-1 text-[13.5px] text-muted">{meetup.dateLabel} ・ {meetup.place}</p>
            <p className="m-0 text-[13px] text-body">テーマ:{meetup.theme} ・ 幹事 {meetup.hostName}</p>
          </div>
          {gcalUrl && (
            <a
              href={gcalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-bold text-ink no-underline transition-colors hover:border-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Googleカレンダーに追加
            </a>
          )}
        </div>
      </header>

      {meetup.isBefore && <BeforePhase vals={vals} />}
      {meetup.showLineup && <ReviewPhase vals={vals} />}
    </main>
  );
}
