import { useStore } from '@/store';
import { deleteMeetup } from '@/app/actions/meetups';
import type { Vals } from '@/useVals';
import { Loading } from '@/components/shared/Loading';
import { KebabMenu } from '@/components/shared/KebabMenu';
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
  const m = vals.meetup;
  const store = useStore();
  const meetupDetail = store.meetupDetail;
  const gcalUrl = meetupDetail?.eventDate
    ? buildGcalUrl(meetupDetail.eventDate, meetupDetail.dateLabel, meetupDetail.name, meetupDetail.place, meetupDetail.theme)
    : null;

  if (!meetupDetail) {
    return <div style={{ maxWidth: 920, margin: '0 auto', padding: vals.pagePadTight }}><Loading /></div>;
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
    <main style={{ maxWidth: 920, margin: '0 auto', padding: vals.pagePadTight }}>
      <a onClick={m.backHome} className="block text-[13px] text-muted cursor-pointer mb-6 hover:text-primary transition-colors">← ホームにもどる</a>
      <div className="flex items-center gap-3 mb-1 flex-wrap">
        <span className="font-mono text-[11px] tracking-[0.18em] text-accent">SAKE MEETUP</span>
        <span style={{ background: m.phaseBg }} className="rounded-full px-3 py-0.5 text-[11px] font-bold text-surface">{m.phaseLabel}</span>
      </div>
      <div className="flex items-start gap-3 mb-2">
        <h1 className="font-serif text-[32px] font-bold leading-tight flex-1 min-w-0 m-0">{m.name}</h1>
        {m.isHost && (
          <KebabMenu
            items={[
              { label: 'この会を削除', icon: DELETE_ICON, onClick: handleDelete, danger: true },
            ]}
          />
        )}
      </div>
      <p className="text-[13.5px] text-muted mb-1 m-0">{m.dateLabel} ・ {m.place}</p>
      <p className="text-[13px] text-body mb-6 m-0">テーマ:{m.theme} ・ 幹事 {m.hostName}</p>

      {gcalUrl && (
        <div className="mb-6">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 border border-line hover:border-primary rounded-full px-4 py-2 text-[12.5px] font-bold text-ink no-underline bg-surface shrink-0 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Googleカレンダーに追加
          </a>
        </div>
      )}

      {m.isBefore && <BeforePhase vals={vals} />}
      {m.showLineup && <ReviewPhase vals={vals} />}
    </main>
  );
}
