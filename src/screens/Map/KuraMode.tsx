'use client';
import clsx from 'clsx';
import { useStore } from '@/store';
import type { MapVM } from './useMapState';

function tileClasses(tile: MapVM['prefTiles'][number]) {
  return clsx(
    tile.drunk ? 'bg-accent' : tile.hasKura ? 'bg-primary' : 'bg-line-soft',
    tile.hasKura ? 'text-surface' : 'text-faint',
    tile.selected
      ? 'border-2 border-ink'
      : tile.hasKura
        ? 'border border-transparent'
        : 'border border-line-soft',
    tile.hasKura ? 'cursor-pointer' : 'cursor-default',
  );
}

// 酒蔵マップモード: 47都道府県タイル + 凡例 と、選択県の蔵リスト(未選択時は県チップ)
export function KuraMode({ map }: { map: MapVM }) {
  const isAdmin = useStore((s) => s.user?.isAdmin ?? false);
  return (
    <>
      <p className="m-0 mb-6 text-[13px] text-muted">色のついた県をタップすると、その県の蔵が見られます。呑んだ蔵のある県は朱に染まります。</p>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-line bg-surface px-3 py-3.5 md:p-6">
          <ul className="m-0 grid grid-cols-12 gap-1 p-0 list-none md:gap-1.5">
            {map.prefTiles.map((tile, i) => (
              <li
                key={i}
                onClick={tile.click}
                className={clsx('flex aspect-square flex-col items-center justify-center gap-0.25 rounded-md', tileClasses(tile))}
                style={{ gridColumn: tile.col, gridRow: tile.row }}
              >
                <span className={clsx('whitespace-nowrap font-bold leading-tight', tile.name.length >= 3 ? 'text-[6.5px] md:text-[8.5px]' : 'text-[8.5px] md:text-[11px]')}>{tile.name}</span>
                {tile.hasCount && (<span className="text-[7px] opacity-85 md:text-[9px]">{tile.countLabel}</span>)}
              </li>
            ))}
          </ul>
          <ul className="m-0 mt-4.5 flex flex-wrap gap-4.5 p-0 list-none text-[11.5px] text-body">
            <li className="flex items-center gap-1.5"><span className="inline-block h-2.75 w-2.75 rounded-[3px] bg-accent" />呑んだ蔵がある県</li>
            <li className="flex items-center gap-1.5"><span className="inline-block h-2.75 w-2.75 rounded-[3px] bg-primary" />図鑑に蔵がある県</li>
            <li className="flex items-center gap-1.5"><span className="inline-block h-2.75 w-2.75 rounded-[3px] border border-line bg-line-soft" />これからの県</li>
          </ul>
        </section>
        <section>
          {map.mapHasSel && (
            <div className="flex flex-col gap-3.5">
              <h2 className="m-0 border-b border-line pb-2.5 font-serif text-[19px] font-bold">{map.mapSelPref}の蔵</h2>
              {map.mapKuras.map((kura, i) => (
                <article key={i} className="rounded-xl border border-line bg-card px-5.5 py-5">
                  <header className="mb-1 flex flex-wrap items-center gap-2.5">
                    <h3 onClick={kura.nameClick} className="m-0 cursor-pointer font-serif text-[17px] font-bold">{kura.name} →</h3>
                    {kura.hasCups && (<span className="rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold text-surface">{kura.cupsLabel}</span>)}
                  </header>
                  <p className="m-0 mb-3 flex flex-wrap items-baseline gap-3">
                    <span className="text-[11.5px] text-muted">{kura.meta}</span>
                    <a href={kura.gmapLink} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-primary no-underline">Googleマップ →</a>
                  </p>
                  <ul className="m-0 flex flex-wrap gap-2 p-0 list-none">
                    {kura.brands.map((brand, j) => (
                      <li key={j} onClick={brand.click} className="cursor-pointer rounded-full border border-line bg-bg px-3.5 py-1.5 text-[12px] text-ink">{brand.label} →</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
          {map.mapNoSel && (
            <>
              <section className="rounded-xl border border-line bg-surface px-6 py-5.5">
                <h2 className="m-0 mb-2 font-serif text-[16px] font-bold">蔵のある県</h2>
                <p className="m-0 mb-3.5 text-[12.5px] leading-[1.8] text-muted">マップの色つきの県、または下の県名をタップ。</p>
                <ul className="m-0 flex flex-wrap gap-2 p-0 list-none">
                  {map.prefChipList.map((chip, i) => (
                    <li
                      key={i}
                      onClick={chip.click}
                      className={clsx(
                        'cursor-pointer rounded-full px-4 py-1.75 text-[12.5px] font-bold text-surface',
                        chip.drunk ? 'bg-accent' : 'bg-primary',
                      )}
                    >{chip.label}</li>
                  ))}
                </ul>
              </section>
              {isAdmin && (
                <article onClick={() => useStore.getState().openKuraReg()} className="mt-3.5 cursor-pointer rounded-xl border border-line bg-card px-5.5 py-4.5">
                  <h3 className="m-0 mb-1 font-serif text-[14.5px] font-bold">載っていない蔵がありますか?</h3>
                  <p className="m-0 text-[12px] leading-[1.7] text-muted">あなたの好きな酒蔵を図鑑に追加申請できます <span className="font-bold text-primary">→ 蔵を登録する</span></p>
                </article>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
