import { useState } from 'react';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import type { Brand } from '@/types';

export function useMapState() {
  const [mapMode, setMapMode] = useState<'kura' | 'bars'>('kura');
  const [mapPref, setMapPref] = useState<string | null>(null);
  const [barId, setBarId] = useState<string | null>(null);

  const myRecords = useStore((s) => s.myRecords);
  const store = useStore();
  const { brands, bars: allBars, kuraMeta, prefGrid } = useReferenceData();

  // 県ごと×蔵ごとの銘柄一覧と、呑んだことのある県(useVals から移設 #27)
  const kuraByPref: Record<string, Record<string, Brand[]>> = {};
  brands.forEach((b) => {
    if (!kuraByPref[b.pref]) kuraByPref[b.pref] = {};
    if (!kuraByPref[b.pref][b.brewery]) kuraByPref[b.pref][b.brewery] = [];
    kuraByPref[b.pref][b.brewery].push(b);
  });
  const drunkPrefs = new Set(myRecords.map((x) => brands.find((b) => b.id === x.brandId)?.pref).filter(Boolean));
  const mapStats = '蔵のある県 ' + Object.keys(kuraByPref).length + ' ・ 呑んだ県 ' + drunkPrefs.size + ' / 47';

  const prefTiles = prefGrid.map((p) => {
    const name = p[0];
    const hasKura = !!kuraByPref[name];
    const drunk = drunkPrefs.has(name);
    const selected = mapPref === name;
    const kuraCount = hasKura ? Object.keys(kuraByPref[name]).length : 0;
    return {
      name, col: p[1], row: p[2],
      hasKura, drunk, selected,
      hasCount: kuraCount > 0, countLabel: kuraCount + '蔵',
      click: hasKura ? (() => setMapPref(selected ? null : name)) : (() => {}),
    };
  });

  const mapKuras = (mapPref && kuraByPref[mapPref])
    ? Object.keys(kuraByPref[mapPref]).map((kn) => {
        const meta = kuraMeta[kn];
        const bs = kuraByPref[mapPref][kn];
        const cups = myRecords.filter((x) => bs.some((b) => b.id === x.brandId)).length;
        return {
          name: kn,
          nameClick: () => store.openKura(kn),
          gmapLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(kn + ' ' + (meta?.city || '') + ' ' + mapPref),
          meta: mapPref + ' ' + (meta?.city || '') + (meta?.founded ? ' — 創業 ' + meta.founded + '年' : ''),
          hasCups: cups > 0, cupsLabel: '呑んだ盃 ' + cups,
          brands: bs.map((b) => ({ label: b.name, click: () => store.openDetail(b.id) })),
        };
      })
    : [];

  const prefChipList = Object.keys(kuraByPref).map((pn) => ({
    label: pn + ' ' + Object.keys(kuraByPref[pn]).length + '蔵',
    drunk: drunkPrefs.has(pn),
    click: () => setMapPref(pn),
  }));

  const bars = allBars;
  const barSel = bars.find((b) => b.id === barId) || bars[0];
  const barList = bars.map((b) => ({
    name: b.name, area: b.area, type: b.type,
    selected: b.id === (barSel?.id || ''),
    click: () => setBarId(b.id),
  }));
  const barView = barSel ? {
    name: barSel.name, area: barSel.area, type: barSel.type, note: barSel.note,
    mapSrc: 'https://www.google.com/maps?q=' + encodeURIComponent(barSel.venueQ) + '&output=embed&hl=ja&z=15',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(barSel.venueQ),
    brands: (barSel.brands || []).map((id: string) => {
      const br = brands.find((b) => b.id === id);
      return { label: br?.name || id, click: () => store.openDetail(id) };
    }),
  } : { name: '', area: '', type: '', note: '', mapSrc: '', mapLink: '', brands: [] as { label: string; click: () => void }[] };

  return {
    mapMode, setMapMode,
    isBars: mapMode === 'bars',
    prefTiles, mapKuras, prefChipList,
    mapHasSel: !!mapPref, mapNoSel: !mapPref, mapSelPref: mapPref || '',
    barList, barView,
    mapStats,
  };
}

export type MapVM = ReturnType<typeof useMapState>;
