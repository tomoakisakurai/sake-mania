/* eslint-disable @typescript-eslint/no-explicit-any */
// 持ち寄り宣言: 銘柄未選択(検索 + 候補一覧、かぶりはタグ表示)
export function Search({ v }: { v: any }) {
  const d = v.declare;
  return (
    <>
      <div style={{ background: "#FFFFFF", border: "1.5px solid #E3DBCB", borderRadius: 12, padding: "13px 18px", fontSize: 14, color: "#B4B6AC", marginBottom: 16 }}>
        <input type="text" value={d.query} onChange={d.onQuery} placeholder="銘柄・酒蔵で検索…" style={{ width: "100%", border: 0, background: "transparent", fontSize: 14, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: "#2E2A24", outline: "none" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {d.results.map((dr: any, i: number) => (
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
  );
}
