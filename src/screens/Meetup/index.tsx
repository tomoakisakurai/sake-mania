import { useStore } from '@/store';
import { deleteMeetup } from '@/app/actions/meetups';
import type { Vals } from '@/useVals';
import { Loading } from '@/components/shared/Loading';
import { BeforePhase } from './BeforePhase';
import { ReviewPhase } from './ReviewPhase';
import { MeetupActions } from './MeetupActions';

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
    if (!meetupDetail) return;
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
    <div style={{ maxWidth: 920, margin: '0 auto', padding: vals.pagePadTight }}>
      <div onClick={m.backHome} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← ホームにもどる</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#BC6A2D' }}>SAKE MEETUP</div>
        <span style={{ background: m.phaseBg, color: '#FDFBF5', borderRadius: 999, padding: '2px 12px', fontSize: 11, fontWeight: 700 }}>{m.phaseLabel}</span>
      </div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 32, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, marginTop: 6 }}>{m.name}</div>
      <div style={{ fontSize: 13.5, color: '#8B8273', marginBottom: 4 }}>{m.dateLabel} ・ {m.place}</div>
      <div style={{ fontSize: 13, color: '#5C5547', marginBottom: 16 }}>テーマ:{m.theme} ・ 幹事 {m.hostName}</div>

      <MeetupActions gcalUrl={gcalUrl} isHost={m.isHost} onDelete={handleDelete} />

      {m.isBefore && <BeforePhase vals={vals} />}
      {m.showLineup && <ReviewPhase vals={vals} />}
    </div>
  );
}
