import type { Vals } from '@/useVals';
// 銘柄スペック表(精米歩合・酒米・酵母・日本酒度・アルコール・温度)
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#FDFBF5", padding: "14px 18px" }}>
      <div style={{ fontSize: 10.5, color: "#8B8273", marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 17, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

export function Specs({ vals }: { vals: Vals }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: vals.specCols, gap: 1, background: "#E3DBCB", border: "1px solid #E3DBCB", borderRadius: 10, overflow: "hidden", maxWidth: 560, marginBottom: 28 }}>
      <Cell label="精米歩合" value={vals.d.polish} />
      <Cell label="酒米" value={vals.d.rice} />
      <Cell label="酵母" value={vals.d.yeast} />
      <Cell label="日本酒度" value={vals.d.smv} />
      <Cell label="アルコール" value={vals.d.abv} />
      <Cell label="おすすめ温度" value={vals.d.temp} />
    </div>
  );
}
