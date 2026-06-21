import { useState } from 'react';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';

export function useMapState(vals: Vals) {
  const [mapMode, setMapMode] = useState<'kura' | 'bars'>('kura');
  const [mapPref, setMapPref] = useState<string | null>(null);
  const [barId, setBarId] = useState<string | null>(null);

  const myRecords = useStore((s) => s.myRecords);
  const store = useStore();
  const isMobile = vals.isMobile;
  const kuraByPref = vals.kuraByPref;
  const drunkPrefs = vals.drunkPrefSet;

  const prefTiles = vals.prefGrid.map((p) => {
    const name = p[0];
    const hasKura = !!kuraByPref[name];
    const drunk = drunkPrefs.has(name);
    const selected = mapPref === name;
    const kuraCount = hasKura ? Object.keys(kuraByPref[name]).length : 0;
    return {
      name, col: p[1], row: p[2],
      hasKura, drunk, selected,
      fontSize: name.length >= 4 ? (isMobile ? '6.5px' : '8.5px') : (isMobile ? '8.5px' : '11px'),
      fontSubSize: isMobile ? '7px' : '9px',
      hasCount: kuraCount > 0, countLabel: kuraCount + '蔵',
      click: hasKura ? (() => setMapPref(selected ? null : name)) : (() => {}),
    };
  });

  const mapKuras = (mapPref && kuraByPref[mapPref])
    ? Object.keys(kuraByPref[mapPref]).map((kn) => {
        const meta = vals.kuraMeta[kn];
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

  const bars = vals.allBars;
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
      const br = vals.allBrands.find((b) => b.id === id);
      return { label: br?.name || id, click: () => store.openDetail(id) };
    }),
  } : { name: '', area: '', type: '', note: '', mapSrc: '', mapLink: '', brands: [] as { label: string; click: () => void }[] };

  return {
    mapMode, setMapMode,
    isBars: mapMode === 'bars',
    prefTiles, mapKuras, prefChipList,
    mapHasSel: !!mapPref, mapNoSel: !mapPref, mapSelPref: mapPref || '',
    barList, barView,
  };
}

export type MapVM = ReturnType<typeof useMapState>;
