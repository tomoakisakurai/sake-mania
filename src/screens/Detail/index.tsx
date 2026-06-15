import type { Vals } from '@/useVals';
import { Sidebar } from './Sidebar';
import { Specs } from './Specs';
import { TasteCoord } from './TasteCoord';
import { Reviews } from './Reviews';

export function Detail({ v }: { v: Vals }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: v.pagePadTight }}>
      <div onClick={v.goZukan} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← 図鑑にもどる</div>
      <div style={{ display: "grid", gridTemplateColumns: v.detailCols, gap: 40 }}>
        <Sidebar v={v} />
        <div>
          <div style={{ fontSize: 12, color: "#8B8273", marginBottom: 6 }}><span onClick={v.dBreweryClick} style={{ cursor: "pointer", fontWeight: 700, color: "#32507C" }}>{v.d.brewery}</span> / {v.d.pref}</div>
          <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 34, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{v.d.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ color: "#BC6A2D", fontSize: 16, letterSpacing: 2 }}>{v.dStars}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#5C5547" }}>{v.d.rating} ・ {v.d.count}記録</span>
            <span style={{ background: "#F0EADC", borderRadius: 999, padding: "4px 14px", fontSize: 12, color: "#5C5547" }}>{v.d.class}</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 2.1, color: "#5C5547", maxWidth: 560, marginBottom: 26 }}>{v.d.desc}</div>
          <Specs v={v} />
          <TasteCoord v={v} />
          <Reviews v={v} />
        </div>
      </div>
    </div>
  );
}
