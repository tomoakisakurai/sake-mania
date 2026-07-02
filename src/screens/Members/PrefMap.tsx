'use client';
import { useReferenceData } from '@/components/Providers';
import { HometownTile } from './HometownTile';

type Props = {
  membersByPref: Map<string, unknown[]>;
  selectedPref: string | null;
  onSelect: (pref: string | null) => void;
};

// 47都道府県タイル地図(出身地版)
export function PrefMap({ membersByPref, selectedPref, onSelect }: Props) {
  const { prefGrid } = useReferenceData();
  return (
    <section className="rounded-xl border border-line bg-surface px-3 py-3.5 md:p-6">
      <ul className="m-0 grid grid-cols-12 gap-1 p-0 list-none md:gap-1.5">
        {prefGrid.map((pref, i) => {
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
              onClick={() => onSelect(selected ? null : name)}
            />
          );
        })}
      </ul>
    </section>
  );
}
