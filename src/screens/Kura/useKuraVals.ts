'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { starStr } from '@/lib/format';

// 酒蔵詳細のビューモデル。useVals から移設(useVals解体 #20)。
export function useKuraVals(kuraName: string) {
  const store = useStore();
  const myRecords = useStore((s) => s.myRecords);
  const { brands, kuraMeta } = useReferenceData();

  const meta = kuraMeta[kuraName];
  const kuraBrands = brands.filter((b) => b.brewery === kuraName);
  const pref = kuraBrands.length ? kuraBrands[0].pref : '';
  const myKuraRecords = myRecords
    .map((record, index) => ({ record, index }))
    .filter((o) => kuraBrands.some((b) => b.id === o.record.brandId));
  const mapQuery = encodeURIComponent(kuraName + ' ' + (meta?.city || '') + ' ' + pref);

  return {
    name: kuraName,
    mapSrc: 'https://www.google.com/maps?q=' + mapQuery + '&output=embed&hl=ja&z=13',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=' + mapQuery,
    meta: pref + (meta?.city ? ' ' + meta.city : '') + (meta?.founded ? ' — 創業 ' + meta.founded + '年' : ''),
    desc: meta?.desc || '',
    brandCount: kuraBrands.length,
    totalRecs: kuraBrands.reduce((a, b) => a + b.count, 0),
    myCupCount: myKuraRecords.length,
    hasCups: myKuraRecords.length > 0,
    dots: kuraBrands.map((b) => ({ left: b.x, top: b.y, label: b.name })),
    brands: kuraBrands.map((b) => ({ name: b.name, cls: b.cls, polish: b.polish, rice: b.rice, rating: b.rating.toFixed(1), pct: Math.round(b.rating / 5 * 100), click: () => store.openDetail(b.id) })),
    cups: myKuraRecords.map((o) => {
      const b = brands.find((bb) => bb.id === o.record.brandId);
      return { name: b?.name ?? '', date: o.record.date, stars: starStr(o.record.rating), memo: o.record.memo || '(メモなし)', click: () => store.openPost({ src: 'mine', i: o.index }) };
    }),
  };
}

export type KuraVals = ReturnType<typeof useKuraVals>;
