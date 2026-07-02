'use client';
import clsx from 'clsx';
import { useStore } from '@/store';
import { Button } from '@/components/shared/Button';
import { useMapState } from './useMapState';
import { KuraMode } from './KuraMode';
import { BarsMode } from './BarsMode';

export function Map() {
  const store = useStore();
  const map = useMapState();
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  return (
    <main className="mx-auto max-w-285 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <header className="mb-1 flex flex-wrap items-center gap-4">
        <h1 className="m-0 font-serif text-[28px] font-bold">酒蔵マップ</h1>
        <p className="m-0 font-mono text-[11px] text-muted">{map.mapStats}</p>
        {isAdmin && (
          <Button variant="secondary" size="md" onClick={() => store.openKuraReg()} className="ml-auto whitespace-nowrap">＋ 蔵を登録する</Button>
        )}
      </header>
      <nav className="mb-5 inline-flex rounded-full bg-line-soft p-1">
        <button
          type="button"
          onClick={() => map.setMapMode('kura')}
          className={clsx(
            'cursor-pointer rounded-full px-5.5 py-2 text-[13px] font-bold',
            !map.isBars ? 'bg-primary text-surface' : 'bg-transparent text-muted',
          )}
        >酒蔵マップ</button>
        <button
          type="button"
          onClick={() => map.setMapMode('bars')}
          className={clsx(
            'cursor-pointer rounded-full px-5.5 py-2 text-[13px] font-bold',
            map.isBars ? 'bg-accent text-surface' : 'bg-transparent text-muted',
          )}
        >飲める店</button>
      </nav>
      {!map.isBars && <KuraMode map={map} />}
      {map.isBars && <BarsMode map={map} />}
    </main>
  );
}
