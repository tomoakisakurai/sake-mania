import { useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import { BrandCard } from './BrandCard';

const TAGS = ['フルーティ', '辛口', '生酒', 'ガス感', '燗映え', 'ジューシー'];

export function Zukan({ vals }: { vals: Vals }) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const store = useStore();
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);

  const filteredBrands = useMemo(() => {
    const q = query.trim();
    let fb = vals.allBrands.filter((b) => !q || (b.name + b.brewery + b.rice + b.pref).indexOf(q) !== -1);
    if (activeTag) fb = fb.filter((b) => b.tags.indexOf(activeTag) !== -1);
    return fb.map((b) => ({
      name: b.name, brewery: b.brewery, pref: b.pref, polish: b.polish, rice: b.rice,
      rating: b.rating.toFixed(1), pct: Math.round(b.rating / 5 * 100),
      photo: b.photo || null,
      click: () => vals.openDetail(b.id),
    }));
  }, [query, activeTag, vals.allBrands, vals.openDetail]);

  const tagChips = TAGS.map((t) => {
    const a = activeTag === t;
    return { label: t, bg: a ? '#32507C' : '#FDFBF5', color: a ? '#FDFBF5' : '#5C5547', border: a ? '1px solid #32507C' : '1px solid #E3DBCB', click: () => setActiveTag(a ? null : t) };
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: vals.pagePad }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
        <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 28, fontWeight: 700 }}>銘柄図鑑</div>
        {isAdmin && (
          <div onClick={() => store.nav('brandReg')} style={{ marginLeft: 'auto', border: '1px solid #32507C', color: '#32507C', borderRadius: 999, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>＋ 銘柄を登録する</div>
        )}
      </div>
      <input type="text" value={query} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)} placeholder="銘柄名・酒蔵・酒米・産地でさがす" style={{ width: '100%', maxWidth: 640, background: '#FFFFFF', border: '1px solid #E3DBCB', borderRadius: 999, padding: '14px 24px', fontSize: 14.5, fontFamily: "'Zen Kaku Gothic New', sans-serif", color: '#2E2A24', display: 'block', marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {tagChips.map((c, i: number) => (
          <span key={i} onClick={c.click} style={{ cursor: 'pointer', borderRadius: 999, padding: '6px 16px', fontSize: 12.5, background: c.bg, color: c.color, border: c.border }}>{c.label}</span>
        ))}
      </div>
      <div style={{ fontSize: 13, color: '#8B8273', marginBottom: 14 }}>{filteredBrands.length}件の銘柄</div>
      <div style={{ display: 'grid', gridTemplateColumns: vals.zukanCols, gap: 16 }}>
        {filteredBrands.map((b, i: number) => (
          <BrandCard key={i} brand={b} />
        ))}
      </div>
    </div>
  );
}
