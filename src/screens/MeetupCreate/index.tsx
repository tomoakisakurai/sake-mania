import { useState, useMemo } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
import { createMeetup } from '@/app/actions/meetups';
import { Done } from './Done';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
const HOURS = ['18:00', '18:30', '19:00', '19:30', '20:00'];

export function MeetupCreate({ vals }: { vals: Vals }) {
  const st = useStore();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);

  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [ecDateVal, setEcDateVal] = useState('');
  const [calHour, setCalHour] = useState('19:00');

  const calTitle = calYear + '年 ' + (calMonth + 1) + '月';
  const prevMonth = () => {
    let m = calMonth - 1, y = calYear;
    if (m < 0) { m = 11; y--; }
    setCalMonth(m); setCalYear(y);
  };
  const nextMonth = () => {
    let m = calMonth + 1, y = calYear;
    if (m > 11) { m = 0; y++; }
    setCalMonth(m); setCalYear(y);
  };

  const calDays = useMemo(() => {
    const y = calYear, m = calMonth;
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const cells: Array<{ label: string; iso: string; past: boolean; selected: boolean; isSun: boolean; isSat: boolean }> = [];
    for (let i = 0; i < first; i++) cells.push({ label: '', iso: '', past: false, selected: false, isSun: false, isSat: false });
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const iso = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      cells.push({ label: String(d), iso, past: dt < today, selected: ecDateVal === iso, isSun: dt.getDay() === 0, isSat: dt.getDay() === 6 });
    }
    return cells;
  }, [calYear, calMonth, ecDateVal]);

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
          <div style={{ background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFFFF", border: "1px solid #E3DBCB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#5C5547", cursor: "pointer" }}>←</div>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700 }}>{calTitle}</div>
              <div onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: "50%", background: "#FFFFFF", border: "1px solid #E3DBCB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#5C5547", cursor: "pointer" }}>→</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 6 }}>
              {DOW.map((d, i) => (
                <div key={d} style={{ textAlign: "center", fontSize: 10.5, color: i === 0 ? "#BC6A2D" : i === 6 ? "#32507C" : "#8B8273", fontWeight: 700, padding: "4px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {calDays.map((cd, i) => (
                <div
                  key={i}
                  onClick={cd.past || !cd.label ? undefined : () => setEcDateVal(cd.iso)}
                  style={{
                    textAlign: "center", padding: "8px 0", borderRadius: 8, fontSize: 13,
                    cursor: !cd.label || cd.past ? "default" : "pointer",
                    background: cd.selected ? "#32507C" : "transparent",
                    color: !cd.label ? "transparent" : cd.selected ? "#FDFBF5" : cd.past ? "#D0C9BA" : cd.isSun ? "#BC6A2D" : cd.isSat ? "#32507C" : "#2E2A24",
                    fontWeight: cd.selected ? 700 : 500,
                  }}
                >{cd.label}</div>
              ))}
            </div>
            {ecDateVal && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E3DBCB", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ fontSize: 13, color: "#5C5547" }}>選択中: <span style={{ fontWeight: 700, color: "#2E2A24" }}>{selectedDateLabel}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
                  <div style={{ fontSize: 12, color: "#8B8273" }}>開始</div>
                  {HOURS.map((h) => (
                    <div key={h} onClick={() => setCalHour(h)} style={{ minWidth: 44, textAlign: "center", padding: "7px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", background: calHour === h ? "#32507C" : "#FFFFFF", color: calHour === h ? "#FDFBF5" : "#2E2A24", border: `1px solid ${calHour === h ? "#32507C" : "#E3DBCB"}` }}>{h}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

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
