import { useState, useMemo } from 'react';
import type { Vals } from '@/useVals';
import { useStore } from '@/store';
import { Picked } from './Picked';
import { Search } from './Search';

export function Declare({ v }: { v: Vals }) {
  const st = useStore();
  const [query, setQuery] = useState('');
  const [note, setNote] = useState(() => v.meetup.bringList.find((b) => b.mine)?.note || '');

  const allBring = v.meetup.bringList;
  const results = useMemo(() => {
    const q = query.trim();
    return v.allBrands
      .filter((b) => !q || (b.name + b.brewery + b.pref).indexOf(q) !== -1)
      .slice(0, 6)
      .map((b) => {
        const taken = allBring.find((x) => x.brandId === b.id && !x.mine);
        return {
          name: b.name,
          sub: b.brewery + ' / ' + b.pref,
          taken: !!taken,
          takenLabel: taken ? (taken.memberName + 'さんと かぶり') : '',
          click: () => st.patch({ declareBrandId: b.id }),
        };
      });
  }, [query, v.allBrands, allBring]);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: v.pagePadTight }}>
      <div onClick={v.declare.cancel} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← SAKE MEETUPにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>持ち寄り宣言</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.45, marginBottom: 6 }}>何を持っていく?</div>
      <div style={{ fontSize: 13, color: "#8B8273", marginBottom: 24 }}>{v.declare.meetName} に持ち寄る一本を宣言します。</div>

      {v.declare.picked && <Picked v={v} note={note} setNote={setNote} />}
      {v.declare.notPicked && <Search query={query} setQuery={setQuery} results={results} />}
    </div>
  );
}
