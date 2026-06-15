/* eslint-disable @typescript-eslint/no-explicit-any */
// 酒蔵詳細: この蔵の銘柄グリッド
export function BrandGrid({ v }: { v: any }) {
  return (
    <div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: '1px solid #E3DBCB', paddingBottom: 10, marginBottom: 16 }}>この蔵の銘柄</div>
      <div style={{ display: 'grid', gridTemplateColumns: v.kuraBrandCols, gap: 14 }}>
        {v.ku.brands.map((kb: any, i: number) => (
          <div key={i} onClick={kb.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 9, cursor: 'pointer' }}>
            <div style={{ height: 100, borderRadius: 8, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8B8273' }}>ボトル写真</span></div>
            <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 15.5, fontWeight: 700, lineHeight: 1.4 }}>{kb.name}</div><div style={{ fontSize: 11, color: '#8B8273', marginTop: 3 }}>{kb.cls}</div></div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#5C5547' }}>精米{kb.polish} ・ {kb.rice}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
              <div style={{ flex: 1, height: 4, background: '#EFE8D8', borderRadius: 2, position: 'relative' }}><div style={{ position: 'absolute', left: 0, width: `${kb.pct}%`, height: 4, background: '#32507C', borderRadius: 2 }}></div></div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#32507C' }}>{kb.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
