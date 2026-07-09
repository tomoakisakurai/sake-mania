import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { createMeetup, updateMeetup, getMeetupDetail } from '@/app/actions/meetups';
import { Loading } from '@/components/shared/Loading';
import { paths } from '@/lib/routes';
import { Done } from './Done';
import { DateTimePicker } from './DateTimePicker';

const DOW = ['日', '月', '火', '水', '木', '金', '土'];

function parseHourFromLabel(dateLabel: string): string {
  const match = dateLabel.match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : '19:00';
}

export function MeetupCreate({ editingId }: { editingId?: string }) {
  const st = useStore();
  const router = useRouter();
  const isEdit = !!editingId;
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);
  const [ecDateVal, setEcDateVal] = useState('');
  const [calHour, setCalHour] = useState('19:00');
  const [loaded, setLoaded] = useState(!isEdit);
  const [notifySlack, setNotifySlack] = useState(true);

  useEffect(() => {
    if (!editingId) return;
    let active = true;
    getMeetupDetail(editingId).then((meetup) => {
      if (!active || !meetup) return;
      setName(meetup.name);
      setEcDateVal(meetup.eventDate ?? '');
      setCalHour(parseHourFromLabel(meetup.dateLabel));
      setPlace(meetup.place);
      setDesc(meetup.theme);
      setLoaded(true);
    });
    return () => { active = false; };
  }, [editingId]);

  const selectedDateLabel = (() => {
    if (!ecDateVal) return '';
    const p = ecDateVal.split('-');
    const dt = new Date(+p[0], +p[1] - 1, +p[2]);
    return +p[1] + '月' + +p[2] + '日(' + DOW[dt.getDay()] + ') ' + calHour + '〜';
  })();

  const handleSubmit = async () => {
    if (!name.trim() || !ecDateVal || !place.trim()) { st.flash('会の名前・日時・会場は必須です'); return; }
    const payload = { name: name.trim(), dateLabel: selectedDateLabel, place: place.trim(), theme: desc.trim(), eventDate: ecDateVal };
    if (isEdit && editingId) {
      const ok = await updateMeetup(editingId, payload);
      if (!ok) { st.flash('更新に失敗しました'); return; }
      st.flash('SAKE MEETUPを更新しました');
      await st.loadMeetups();
      router.push(paths.meetup(editingId));
      return;
    }
    const id = await createMeetup({ ...payload, notifySlack });
    if (!id) { st.flash('作成に失敗しました（ログインが必要です）'); return; }
    await st.loadMeetups();
    setDone(true);
  };
  const handleAnother = () => { setName(''); setEcDateVal(''); setCalHour('19:00'); setPlace(''); setDesc(''); setNotifySlack(true); setDone(false); };

  const handleBack = () => {
    if (isEdit && editingId) router.push(paths.meetup(editingId));
    else st.nav('home');
  };

  if (isEdit && !loaded) {
    return (
      <div className="mx-auto max-w-155 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
        <Loading />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-155 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
      {!done && (
        <>
          <div onClick={handleBack} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>{isEdit ? '← SAKE MEETUP詳細にもどる' : '← ホームにもどる'}</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>{isEdit ? 'EDIT A MEETUP' : 'HOST A MEETUP'}</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{isEdit ? 'SAKE MEETUPを編集する' : 'SAKE MEETUPを立てる'}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#5C5547", marginBottom: 28 }}>{isEdit ? '会の名前・日時・会場・テーマを更新します。変更内容はすぐにメンバーに反映されます。' : '日本酒部の次のSAKE MEETUPを企画しましょう。立てた会はメンバーに共有され、みんなが出欠と持ち寄りを宣言できます。'}</div>

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会の名前 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 7月のSAKE MEETUP" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>日時 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <DateTimePicker value={ecDateVal} hour={calHour} onChange={setEcDateVal} onHourChange={setCalHour} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会場 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="例: 本社 8F ラウンジ / 居酒屋〇〇" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>テーマ・ひとこと</div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="例: 夏酒 — 生酒・夏限定をひとつ持ち寄り" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 24 }}></textarea>

          {!isEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FBF8F1", border: "1px solid #E3DBCB", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C5547" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Slackに通知する</div>
                <div style={{ fontSize: 11.5, color: "#8B8273", lineHeight: 1.6 }}>作成すると #日本酒部 チャンネルにお知らせが投稿されます</div>
              </div>
              <div
                onClick={() => setNotifySlack((prev) => !prev)}
                role="switch"
                aria-checked={notifySlack}
                aria-label="Slackに通知する"
                style={{ width: 42, height: 24, borderRadius: 999, background: notifySlack ? "#BC6A2D" : "#D9D0BC", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}
              >
                <div style={{ position: "absolute", top: 2, left: notifySlack ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(46,42,36,0.25)", transition: "left 0.2s" }} />
              </div>
            </div>
          )}

          <div onClick={handleSubmit} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{isEdit ? 'この内容で保存する' : 'この内容で会を立てる'}</div>
        </>
      )}
      {done && <Done registeredName={name} notifySlack={notifySlack} onAnother={handleAnother} onGoHome={() => st.nav('home')} />}
    </div>
  );
}
