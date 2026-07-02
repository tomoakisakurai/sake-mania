'use client';
import { useState, useMemo } from 'react';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { useDeclareVals } from './useDeclareVals';
import { Picked } from './Picked';
import { Search } from './Search';

export function Declare({ meetupId }: { meetupId: string }) {
  const store = useStore();
  const { brands } = useReferenceData();
  const declare = useDeclareVals(meetupId);
  const [query, setQuery] = useState('');
  const [note, setNote] = useState(() => declare.brings.find((b) => b.mine)?.note || '');

  const results = useMemo(() => {
    const q = query.trim();
    return brands
      .filter((b) => !q || (b.name + b.brewery + b.pref).indexOf(q) !== -1)
      .slice(0, 6)
      .map((b) => {
        const taken = declare.brings.find((x) => x.brandId === b.id && !x.mine);
        return {
          name: b.name,
          sub: b.brewery + ' / ' + b.pref,
          taken: !!taken,
          takenLabel: taken ? (taken.memberName + 'さんと かぶり') : '',
          click: () => store.patch({ declareBrandId: b.id }),
        };
      });
  }, [query, brands, declare.brings, store]);

  return (
    <div className="mx-auto max-w-140 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
      <div onClick={declare.cancel} style={{ fontSize: 13, color: "#8B8273", cursor: "pointer", marginBottom: 24 }}>← SAKE MEETUPにもどる</div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.18em", color: "#BC6A2D", marginBottom: 10 }}>持ち寄り宣言</div>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 26, fontWeight: 700, lineHeight: 1.45, marginBottom: 6 }}>何を持っていく?</div>
      <div style={{ fontSize: 13, color: "#8B8273", marginBottom: 24 }}>{declare.meetName} に持ち寄る一本を宣言します。</div>

      {declare.picked && <Picked declare={declare} note={note} setNote={setNote} />}
      {declare.notPicked && <Search query={query} setQuery={setQuery} results={results} />}
    </div>
  );
}
