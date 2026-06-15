/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandCard } from './BrandCard';

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
          <BrandCard key={i} b={b} />
        ))}
      </div>
    </div>
  );
}
