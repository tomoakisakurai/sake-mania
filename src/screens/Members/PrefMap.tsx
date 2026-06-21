import type { Vals } from '@/useVals';
import { HometownTile } from './HometownTile';

type Props = {
  vals: Vals;
  membersByPref: Map<string, unknown[]>;
  selectedPref: string | null;
  onSelect: (pref: string | null) => void;
};

// 47都道府県タイル地図(出身地版)
export function PrefMap({ vals, membersByPref, selectedPref, onSelect }: Props) {
  return (
    <section className="rounded-xl border border-line bg-surface" style={{ padding: vals.mapPanelPad }}>
      <ul className="m-0 grid grid-cols-12 p-0 list-none" style={{ gap: vals.mapGap }}>
        {vals.prefGrid.map((pref, i) => {
          const name = pref[0] as string;
          const count = membersByPref.get(name)?.length ?? 0;
          const selected = selectedPref === name;
          return (
            <HometownTile
              key={i}
              name={name}
              col={pref[1] as number}
              row={pref[2] as number}
              count={count}
              selected={selected}
              isMobile={vals.isMobile}
              onClick={() => onSelect(selected ? null : name)}
            />
          );
        })}
      </ul>
    </section>
  );
}
