/* eslint-disable @typescript-eslint/no-explicit-any */
export function Zukan({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: v.pagePad }}>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>銘柄図鑑</div>
      <input type="text" value={v.searchQuery} onChange={v.onSearch} placeholder="銘柄名・酒蔵・酒米・産地でさがす" style={{ width: '100%', maxWidth: 640, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 999, padding: '14px 24px', fontSize: 14.5, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', display: 'block', marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {v.tagChips.map((c: any, i: number) => (
          <span key={i} onClick={c.click} style={{ cursor: 'pointer', borderRadius: 999, padding: '6px 16px', fontSize: 12.5, background: c.bg, color: c.color, border: c.border }}>{c.label}</span>
        ))}
      </div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 14 }}>{v.resultCount}件の銘柄</div>
      <div style={{ display: 'grid', gridTemplateColumns: v.zukanCols, gap: 16 }}>
        {v.filteredBrands.map((b: any, i: number) => (
          <div key={i} onClick={b.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }}>
            <div style={{ height: 120, borderRadius: 8, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8B8273' }}>ボトル写真</span></div>
            <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{b.name}</div><div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 3 }}>{b.brewery} / {b.pref}</div></div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#5C5547' }}>精米{b.polish} ・ {b.rice}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
              <div style={{ flex: 1, height: 4, background: '#EFE8D8', borderRadius: 2, position: 'relative' }}><div style={{ position: 'absolute', left: 0, width: `${b.pct}%`, height: 4, background: '#32507C', borderRadius: 2 }}></div></div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#32507C' }}>{b.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
