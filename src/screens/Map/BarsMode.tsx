import clsx from 'clsx';
import type { MapVM } from './useMapState';

// 飲める店モード: 店リスト + 選択店の詳細(地図埋め込み + 提供銘柄)
export function BarsMode({ map }: { map: MapVM }) {
  return (
    <>
      <p className="m-0 mb-6 text-[13px] text-muted">銘酒を飲める居酒屋・角打ちを集めました。店をタップすると地図と提供銘柄が見られます。</p>
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <ul className="m-0 flex flex-col gap-3 p-0 list-none">
          {map.barList.map((bar, i) => (
            <li
              key={i}
              onClick={bar.click}
              className={clsx(
                'cursor-pointer rounded-xl border border-line px-4.5 py-4',
                bar.selected ? 'bg-primary text-surface' : 'bg-card text-ink',
              )}
            >
              <header className="flex flex-wrap items-center gap-2.5">
                <h3 className="m-0 font-serif text-[16px] font-bold">{bar.name}</h3>
                <span className="rounded-full border border-current px-2.25 py-px text-[10.5px] opacity-75">{bar.type}</span>
              </header>
              <p className={clsx('m-0 mt-1 text-[11.5px]', bar.selected ? 'opacity-70' : 'text-muted')}>{bar.area}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3.5">
          <article className="rounded-xl border border-line bg-surface px-5.5 py-5">
            <header className="mb-1 flex flex-wrap items-baseline gap-2.5">
              <h2 className="m-0 font-serif text-[18px] font-bold">{map.barView.name}</h2>
              <span className="text-[11px] text-muted">{map.barView.type} ・ {map.barView.area}</span>
            </header>
            <p className="m-0 mb-3.5 text-[13px] leading-[1.9] text-body">{map.barView.note}</p>
            <iframe src={map.barView.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mb-3 block h-60 w-full rounded-lg border-0 bg-[#EFE8D8]" />
            <a href={map.barView.mapLink} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-primary no-underline">Googleマップで開く →</a>
            <h3 className="m-0 mt-4 mb-2 border-t border-line pt-3.5 text-[12px] font-bold">飲める銘柄</h3>
            <ul className="m-0 flex flex-wrap gap-2 p-0 list-none">
              {map.barView.brands.map((brand, i) => (
                <li key={i} onClick={brand.click} className="cursor-pointer rounded-full border border-line bg-bg px-3.5 py-1.5 text-[12px]">{brand.label} →</li>
              ))}
            </ul>
          </article>
          <p className="m-0 text-[11px] leading-[1.7] text-faint">※ 提供銘柄は時期により変わります。お出かけ前にお店へご確認ください。</p>
        </div>
      </div>
    </>
  );
}
