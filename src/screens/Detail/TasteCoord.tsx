import type { Vals } from '@/useVals';
// 銘柄詳細の味わい座標(ミニマップ): みんなの平均 + あなたの打点
export function TasteCoord({ vals }: { vals: Vals }) {
  return (
    <div style={{ maxWidth: 560, background: "#FDFBF5", border: "1px solid #E3DBCB", borderRadius: 12, padding: "20px 24px", marginBottom: 28 }}>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>味わいの座標</div>
      <div style={{ position: "relative", width: "100%", height: 220, background: "#FFFFFF", border: "1px solid #E3DBCB", borderRadius: 8 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#EAE2D0" }}></div>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#EAE2D0" }}></div>
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273", background: "#FFFFFF", padding: "0 6px" }}>香り高い</div>
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273", background: "#FFFFFF", padding: "0 6px" }}>穏やか</div>
        <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273" }}>淡麗</div>
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: "#8B8273" }}>濃醇</div>
        <div style={{ position: "absolute", left: `${vals.d.x}%`, top: `${vals.d.y}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "#32507C" }}></div>
        <div style={{ position: "absolute", left: `${vals.d.x}%`, top: `${vals.d.y}%`, transform: "translate(11px, -7px)", fontSize: 11, fontWeight: 700, color: "#32507C" }}>みんなの平均</div>
        {vals.dHasMyPoint && (
          <>
            <div style={{ position: "absolute", left: `${vals.dMyX}%`, top: `${vals.dMyY}%`, transform: "translate(-50%, -50%)", width: 14, height: 14, borderRadius: "50%", background: "#BC6A2D" }}></div>
            <div style={{ position: "absolute", left: `${vals.dMyX}%`, top: `${vals.dMyY}%`, transform: "translate(11px, -7px)", fontSize: 11, fontWeight: 700, color: "#BC6A2D" }}>あなたの打点</div>
          </>
        )}
      </div>
    </div>
  );
}
