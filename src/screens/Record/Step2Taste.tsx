import type { Vals } from '@/useVals';
// 記録ステップ2: 味わいの座標(打点) + 甘辛 + 総合評価
export function Step2Taste({ v }: { v: Vals }) {
  return (
    <>
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <div style={{ width: 40, height: 54, flexShrink: 0, borderRadius: 4, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
        <div><div style={{ fontSize: 14.5, fontWeight: 700 }}>{v.recBrandName}</div><div style={{ fontSize: 11.5, color: '#8B8273' }}>{v.recBrandSub}</div></div>
        <div onClick={v.recChangeBrand} style={{ marginLeft: 'auto', fontSize: 12, color: '#32507C', fontWeight: 700, cursor: 'pointer' }}>変更</div>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>この一杯はどの座標? <span style={{ fontWeight: 400, color: '#8B8273', fontSize: 12 }}>マップをタップして打点</span></div>
      <div onClick={v.onMapTap} style={{ position: 'relative', width: '100%', height: 320, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8, cursor: 'crosshair', marginBottom: 8 }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }} />
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>香り高い</div>
        <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>穏やか</div>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 10.5, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
        {v.recGhostDots.map((g, i: number) => (
          <div key={i} style={{ position: 'absolute', left: `${g.left}%`, top: `${g.top}%`, transform: 'translate(-50%, -50%)', width: 8, height: 8, borderRadius: '50%', background: '#D9D0BC' }} />
        ))}
        {v.recHasPoint && (
          <>
            <div style={{ position: 'absolute', left: `${v.recX}%`, top: `${v.recY}%`, transform: 'translate(-50%, -50%)', width: 38, height: 38, borderRadius: '50%', background: 'rgba(50,80,124,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#32507C', boxShadow: '0 1px 6px rgba(50,80,124,0.5)' }} />
            </div>
            <div style={{ position: 'absolute', left: `${v.recX}%`, top: `${v.recY}%`, transform: 'translate(24px, -10px)', fontSize: 11.5, fontWeight: 700, color: '#32507C', pointerEvents: 'none' }}>この一杯</div>
          </>
        )}
      </div>
      <div style={{ fontSize: 11, color: '#A89D8A', marginBottom: 24 }}>薄い点はあなたの過去の盃。打点すると味わいの言葉に自動変換されます — <b style={{ color: '#5C5547' }}>{v.recTasteLabel}</b></div>
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}><span>甘口</span><span style={{ color: '#8B8273', fontWeight: 400, fontSize: 11 }}>甘辛 — {v.recSweetLabel}</span><span>辛口</span></div>
        <input type="range" min={0} max={100} value={v.recSweet} onChange={v.onSweet} style={{ width: '100%', accentColor: '#32507C', cursor: 'pointer' }} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>総合評価</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {v.recStars.map((sr, i: number) => (
            <span key={i} onClick={sr.click} style={{ fontSize: 30, cursor: 'pointer', color: sr.color, lineHeight: 1 }}>★</span>
          ))}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#8B8273', marginLeft: 8 }}>{v.recRatingLabel}</span>
        </div>
      </div>
    </>
  );
}
