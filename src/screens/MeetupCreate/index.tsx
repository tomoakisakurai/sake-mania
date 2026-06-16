import { useState } from 'react';
import type { ChangeEvent } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
import { Done } from './Done';

export function MeetupCreate({ v }: { v: Vals }) {
  const st = useStore();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [desc, setDesc] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    const ok = await st.submitEventCreate({ name, date, place, desc });
    if (ok) setDone(true);
  };
  const handleAnother = () => { setName(''); setDate(''); setPlace(''); setDesc(''); setDone(false); };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: v.pagePadTight }}>
      {!done && (
        <>
          <div onClick={() => st.nav('home')} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← ホームにもどる</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>HOST A MEETUP</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>SAKE MEETUPを立てる</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#5C5547", marginBottom: 28 }}>日本酒部の次のSAKE MEETUPを企画しましょう。立てた会はメンバーに共有され、みんなが出欠と持ち寄りを宣言できます。</div>

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会の名前 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="例: 7月のSAKE MEETUP" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>日時 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={date} onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} placeholder="例: 7月18日(金) 19:00〜" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会場 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={place} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlace(e.target.value)} placeholder="例: 本社 8F ラウンジ / 居酒屋〇〇" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>テーマ・ひとこと</div>
          <textarea value={desc} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDesc(e.target.value)} rows={3} placeholder="例: 夏酒 — 生酒・夏限定をひとつ持ち寄り" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 24 }}></textarea>

          <div onClick={handleSubmit} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>この内容で会を立てる</div>
          <div style={{ textAlign: "center", fontSize: 11, color: "#A89D8A", marginTop: 12 }}>プロトタイプのため、内容は保存されません</div>
        </>
      )}
      {done && <Done registeredName={name} onAnother={handleAnother} onGoHome={() => st.nav('home')} />}
    </div>
  );
}
