import type { Vals } from '@/useVals';
// マイページ右カラム: 舌の地図(打点マップ) + 飲みたいリスト
export function Sidebar({ vals }: { vals: Vals }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FDFBF5', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>舌の地図</div>
        <div style={{ position: 'relative', width: '100%', height: 260, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 8 }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#EAE2D0' }}></div>
          <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>香り高い</div>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273', background: '#FFFFFF', padding: '0 6px' }}>穏やか</div>
          <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273' }}>淡麗</div>
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 9.5, fontWeight: 700, color: '#8B8273' }}>濃醇</div>
          {vals.myDots.map((d, i: number) => (
            <div key={i} style={{ position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, transform: 'translate(-50%, -50%)', width: d.size, height: d.size, borderRadius: '50%', background: d.bg }}></div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 12, lineHeight: 1.8 }}>あなたの打点は「香り高い×濃醇」に集中。淡麗系の名酒を試すと地図が広がります。</div>
      </div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: '22px 24px' }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>飲みたいリスト</div>
        {vals.wantList.map((w, i: number) => (
          <div key={i} onClick={w.click} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0EADC', cursor: 'pointer' }}>
            <div style={{ width: 34, height: 46, flexShrink: 0, borderRadius: 3, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}></div>
            <div><div style={{ fontSize: 13.5, fontWeight: 700 }}>{w.name}</div><div style={{ fontSize: 11, color: '#8B8273' }}>{w.sub}</div></div>
            <a href={w.buyUrl} target="_blank" rel="noreferrer" onClick={vals.stopProp} style={{ marginLeft: 'auto', fontSize: 11.5, color: '#BC6A2D', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>買う ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}
