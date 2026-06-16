interface BrandCardItem {
  name: string; brewery: string; pref: string; polish: string; rice: string;
  rating: string; pct: number; click: () => void;
}
// 図鑑の銘柄カード(ボトル + 名前 + 蔵/産地 + 評価バー)
export function BrandCard({ brand }: { brand: BrandCardItem }) {
  return (
    <div onClick={brand.click} style={{ background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }}>
      <div style={{ height: 120, borderRadius: 8, background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#8B8273' }}>ボトル写真</span></div>
      <div><div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 16, fontWeight: 700, lineHeight: 1.4 }}>{brand.name}</div><div style={{ fontSize: 11.5, color: '#8B8273', marginTop: 3 }}>{brand.brewery} / {brand.pref}</div></div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, color: '#5C5547' }}>精米{brand.polish} ・ {brand.rice}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
        <div style={{ flex: 1, height: 4, background: '#EFE8D8', borderRadius: 2, position: 'relative' }}><div style={{ position: 'absolute', left: 0, width: `${brand.pct}%`, height: 4, background: '#32507C', borderRadius: 2 }}></div></div>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#32507C' }}>{brand.rating}</span>
      </div>
    </div>
  );
}
