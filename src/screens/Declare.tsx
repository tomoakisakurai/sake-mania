/* eslint-disable @typescript-eslint/no-explicit-any */
export function Declare({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: v.pagePadTight }}>
      <div onClick={v.declare.cancel} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← SAKE MEETUPにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>持ち寄り宣言</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.45, marginBottom: 6 }}>何を持っていく?</div>
      <div style={{ fontSize: 13, color: "#8B8273", marginBottom: 24 }}>{v.declare.meetName} に持ち寄る一本を宣言します。</div>

      {v.declare.picked && (
        <>
          <div style={{ background: "#FFFFFF", border: "1px solid #32507C", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
            <div style={{ width: 44, height: 60, flexShrink: 0, borderRadius: 4, background: "repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)" }}></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{v.declare.pickedName}</div>
              <div style={{ fontSize: 11.5, color: "#8B8273" }}>{v.declare.pickedSub}</div>
            </div>
            <div onClick={v.declare.changeBrand} style={{ fontSize: 12, color: "#32507C", fontWeight: 700, cursor: "pointer" }}>変更</div>
          </div>
          {v.declare.dupWarn && (
            <div style={{ background: "#FBF0E6", border: "1px solid #E8C9A8", borderRadius: 10, padding: "12px 16px", fontSize: 12.5, color: "#9A5A20", lineHeight: 1.7, marginBottom: 16, display: "flex", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path></svg>
              <span>{v.declare.dupWarnLabel}</span>
            </div>
          )}
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>ひとこと <span style={{ color: "#A89D8A", fontWeight: 400 }}>(任意)</span></div>
          <textarea value={v.declare.note} onChange={v.declare.onNote} rows={2} placeholder="例: 夏はやっぱり微発泡から!" style={{ width: "100%", background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 10, padding: "12px 16px", fontSize: 14, lineHeight: 1.8, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", resize: "vertical", marginBottom: 22 }}></textarea>
          <div onClick={v.declare.submit} style={{ background: "#BC6A2D", color: "#FDFBF5", borderRadius: 999, padding: 15, textAlign: "center", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>この一本を宣言する</div>
        </>
      )}
      {v.declare.notPicked && (
        <>
          <div style={{ background: "#FFFFFF", border: "1.5px solid #E3DBCB", borderRadius: 12, padding: "13px 18px", fontSize: 14, color: "#B4B6AC", marginBottom: 16 }}>
            <input type="text" value={v.declare.query} onChange={v.declare.onQuery} placeholder="銘柄・酒蔵で検索…" style={{ width: "100%", border: 0, background: "transparent", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {v.declare.results.map((dr: any, i: number) => (
              <div key={i} onClick={dr.click} style={{ background: "#FFFFFF", border: "1px solid #E3DBCB", borderRadius: 10, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700 }}>{dr.name}</div>
                  <div style={{ fontSize: 11, color: "#8B8273" }}>{dr.sub}</div>
                </div>
                {dr.taken && (<span style={{ background: "#F3D9C0", color: "#9A5A20", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{dr.takenLabel}</span>)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
