import type { ChangeEvent } from 'react';
import type { DeclareVals } from './useDeclareVals';

// 持ち寄り宣言: 銘柄を選んだ状態(確認 + かぶり警告 + ひとこと + 宣言ボタン)
export function Picked({ declare, note, setNote }: { declare: DeclareVals; note: string; setNote: (n: string) => void }) {
  const d = declare;
  return (
    <>
      <div style={{ background: "#FFFFFF", border: "1px solid #32507C", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
        <div style={{ width: 44, height: 60, flexShrink: 0, borderRadius: 4, background: "repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)" }}></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{d.pickedName}</div>
          <div style={{ fontSize: 11.5, color: "#8B8273" }}>{d.pickedSub}</div>
        </div>
        <div onClick={d.changeBrand} style={{ fontSize: 12, color: "#32507C", fontWeight: 700, cursor: "pointer" }}>変更</div>
      </div>
      {d.dupWarn && (
        <div style={{ background: "#FBF0E6", border: "1px solid #E8C9A8", borderRadius: 10, padding: "12px 16px", fontSize: 12.5, color: "#9A5A20", lineHeight: 1.7, marginBottom: 16, display: "flex", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path></svg>
          <span>{d.dupWarnLabel}</span>
        </div>
      )}
      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>ひとこと <span style={{ color: "#A89D8A", fontWeight: 400 }}>(任意)</span></div>
      <textarea value={note} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)} rows={2} placeholder="例: 夏はやっぱり微発泡から!" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 22 }}></textarea>
      <div onClick={() => d.submit(note)} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>この一本を宣言する</div>
    </>
  );
}
