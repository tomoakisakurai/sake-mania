'use client';
import { useStore } from '@/store';
import type { Vals } from '@/useVals';
import { Button } from '@/components/shared/Button';
import { useMapState } from './useMapState';
import { KuraMode } from './KuraMode';
import { BarsMode } from './BarsMode';

export function Map({ vals }: { vals: Vals }) {
  const map = useMapState(vals);
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  return (
    <main className="mx-auto max-w-285" style={{ padding: vals.pagePad }}>
      <header className="mb-1 flex flex-wrap items-center gap-4">
        <h1 className="m-0 font-serif text-[28px] font-bold">酒蔵マップ</h1>
        <p className="m-0 font-mono text-[11px] text-muted">{vals.mapStats}</p>
        {isAdmin && (
          <Button variant="secondary" size="md" onClick={vals.openKuraReg} className="ml-auto whitespace-nowrap">＋ 蔵を登録する</Button>
        )}
      </header>
      <nav className="mb-5 inline-flex rounded-full bg-line-soft p-1">
        <button
          type="button"
          onClick={() => map.setMapMode('kura')}
          className={`cursor-pointer rounded-full px-5.5 py-2 text-[13px] font-bold ${!map.isBars ? 'bg-primary text-surface' : 'bg-transparent text-muted'}`}
        >酒蔵マップ</button>
        <button
          type="button"
          onClick={() => map.setMapMode('bars')}
          className={`cursor-pointer rounded-full px-5.5 py-2 text-[13px] font-bold ${map.isBars ? 'bg-accent text-surface' : 'bg-transparent text-muted'}`}
        >飲める店</button>
      </nav>
      {!map.isBars && <KuraMode vals={vals} map={map} />}
      {map.isBars && <BarsMode vals={vals} map={map} />}
    </main>
  );
}
