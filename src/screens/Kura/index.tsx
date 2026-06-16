import type { Vals } from '@/useVals';
import { BrandGrid } from './BrandGrid';
import { Sidebar } from './Sidebar';

export function Kura({ vals }: { vals: Vals }) {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: vals.pagePadTight }}>
      <div onClick={vals.goMap} style={{ fontSize: 13, color: '#8B8273', cursor: 'pointer', marginBottom: 24 }}>← 酒蔵マップにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.18em', color: '#8B8273', marginBottom: 10 }}>SAKE BREWERY</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 34, fontWeight: 700 }}>{vals.ku.name}</div>
        {vals.ku.hasCups && (<span style={{ background: '#BC6A2D', color: '#FDFBF5', borderRadius: 999, padding: '4px 14px', fontSize: 11.5, fontWeight: 700 }}>呑んだことのある蔵</span>)}
      </div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 18 }}>{vals.ku.meta}</div>
      <div style={{ fontSize: 14, lineHeight: 2.1, color: '#5C5547', maxWidth: 620, marginBottom: 28 }}>{vals.ku.desc}</div>
      <div style={{ display: 'flex', gap: 32, marginBottom: 36 }}>
        <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>{vals.ku.brandCount}</div><div style={{ fontSize: 12, color: '#8B8273' }}>図鑑の銘柄</div></div>
        <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>{vals.ku.totalRecs}</div><div style={{ fontSize: 12, color: '#8B8273' }}>みんなの記録</div></div>
        <div style={{ borderLeft: '1px solid #E3DBCB', paddingLeft: 32 }}><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700, color: '#BC6A2D' }}>{vals.ku.myCupCount}</div><div style={{ fontSize: 12, color: '#8B8273' }}>わたしの盃</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: vals.kuraCols, gap: 28, alignItems: 'start' }}>
        <BrandGrid vals={vals} />
        <Sidebar vals={vals} />
      </div>
    </div>
  );
}
