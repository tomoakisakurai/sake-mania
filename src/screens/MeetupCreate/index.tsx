import { useState } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
import { createMeetup } from '@/app/actions/meetups';
import { Done } from './Done';
import { DateTimePicker } from './DateTimePicker';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];

export function MeetupCreate({ vals }: { vals: Vals }) {
  const st = useStore();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);
  const [ecDateVal, setEcDateVal] = useState('');
  const [calHour, setCalHour] = useState('19:00');

  const selectedDateLabel = (() => {
    if (!ecDateVal) return '';
    const p = ecDateVal.split('-');
    const dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return +p[1] + '月' + +p[2] + '日(' + DOW[dt.getDay()] + ') ' + calHour + '〜';
  })();

  const handleSubmit = async () => {
    if (!name.trim() || !ecDateVal || !place.trim()) { st.flash('会の名前・日時・会場は必須です'); return; }
    const id = await createMeetup({ name: name.trim(), dateLabel: selectedDateLabel, place: place.trim(), theme: desc.trim(), eventDate: ecDateVal });
    if (!id) { st.flash('作成に失敗しました（ログインが必要です）'); return; }
    await st.loadMeetups();
    setDone(true);
  };
  const handleAnother = () => { setName(''); setEcDateVal(''); setCalHour('19:00'); setPlace(''); setDesc(''); setDone(false); };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: vals.pagePadTight }}>
      {!done && (
        <>
          <div onClick={() => st.nav('home')} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← ホームにもどる</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>HOST A MEETUP</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>SAKE MEETUPを立てる</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#5C5547", marginBottom: 28 }}>日本酒部の次のSAKE MEETUPを企画しましょう。立てた会はメンバーに共有され、みんなが出欠と持ち寄りを宣言できます。</div>

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会の名前 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 7月のSAKE MEETUP" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>日時 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <DateTimePicker value={ecDateVal} hour={calHour} onChange={setEcDateVal} onHourChange={setCalHour} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会場 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="例: 本社 8F ラウンジ / 居酒屋〇〇" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>テーマ・ひとこと</div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="例: 夏酒 — 生酒・夏限定をひとつ持ち寄り" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 24 }}></textarea>

          <div onClick={handleSubmit} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>この内容で会を立てる</div>
          <div style={{ textAlign: "center", fontSize: 11, color: "#A89D8A", marginTop: 12 }}>プロトタイプのため、内容は保存されません</div>
        </>
      )}
      {done && <Done registeredName={name} onAnother={handleAnother} onGoHome={() => st.nav('home')} />}
    </div>
  );
}
