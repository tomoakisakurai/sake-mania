/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
// SAKE MEETUP作成: 作成完了画面
export function Done({ v }: { v: Vals }) {
  return (
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
  );
}
