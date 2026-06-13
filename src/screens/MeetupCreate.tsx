/* eslint-disable @typescript-eslint/no-explicit-any */
export function MeetupCreate({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: v.pagePadTight }}>
      {v.meetupCreate.notDone && (
        <>
          <div onClick={v.meetupCreate.backHome} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← ホームにもどる</div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>HOST A MEETUP</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>SAKE MEETUPを立てる</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.9, color: "#5C5547", marginBottom: 28 }}>日本酒部の次のSAKE MEETUPを企画しましょう。立てた会はメンバーに共有され、みんなが出欠と持ち寄りを宣言できます。</div>

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会の名前 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={v.meetupCreate.ecName} onChange={v.meetupCreate.onName} placeholder="例: 7月のSAKE MEETUP" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>日時 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={v.meetupCreate.ecDate} onChange={v.meetupCreate.onDate} placeholder="例: 7月18日(金) 19:00〜" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>会場 <span style={{ color: "#BC6A2D" }}>必須</span></div>
          <input type="text" value={v.meetupCreate.ecPlace} onChange={v.meetupCreate.onPlace} placeholder="例: 本社 8F ラウンジ / 居酒屋〇〇" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", marginBottom: 18 }} />

          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>テーマ・ひとこと</div>
          <textarea value={v.meetupCreate.ecDesc} onChange={v.meetupCreate.onDesc} rows={3} placeholder="例: 夏酒 — 生酒・夏限定をひとつ持ち寄り" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 24 }}></textarea>

          <div onClick={v.meetupCreate.submit} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>この内容で会を立てる</div>
          <div style={{ textAlign: "center", fontSize: 11, color: "#A89D8A", marginTop: 12 }}>プロトタイプのため、内容は保存されません</div>
        </>
      )}
      {v.meetupCreate.done && (
        <div style={{ textAlign: "center", padding: "40px 0 20px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#BC6A2D", color: "#FDFBF5", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, marginBottom: 12 }}>SAKE MEETUPを立てました</div>
          <div style={{ fontSize: 14, lineHeight: 2, color: "#5C5547", maxWidth: 400, margin: "0 auto 8px" }}>「{v.meetupCreate.registeredName}」を作成しました。日本酒部のメンバーに共有され、出欠と持ち寄りの宣言を受け付けます。</div>
          <div style={{ fontSize: 12.5, color: "#8B8273", marginBottom: 32 }}>幹事として、当日の進行もお願いします。</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <div onClick={v.meetupCreate.another} style={{ border: "1px solid #E3DBCB", borderRadius: 999, padding: "12px 26px", fontSize: 13.5, fontWeight: 700, color: "#5C5547", cursor: "pointer", background: "#FDFBF5" }}>続けて立てる</div>
            <div onClick={v.meetupCreate.goHome} style={{ background: "#32507C", color: "#FDFBF5", borderRadius: 999, padding: "12px 26px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>ホームへ</div>
          </div>
        </div>
      )}
    </div>
  );
}
