import type { HomeVals } from './useHomeVals';

export function PopularBrands({ home }: { home: HomeVals }) {
  return (
    <section>
      <h2 className="font-serif text-[18px] font-bold border-b border-line pb-2.5 mb-4 m-0">今週の人気銘柄</h2>
      <ol className="bg-card border border-line rounded-xl px-6 py-2 m-0 list-none">
        {home.ranking.map((rank, i) => (
          <li
            key={i}
            onClick={rank.click}
            className="flex items-center gap-4 py-3.5 border-b border-line-soft cursor-pointer last:border-b-0"
          >
            <span
              className="font-serif text-[20px] font-bold w-6 flex-shrink-0"
              style={{ color: rank.color }}
            >
              {rank.rank}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[14.5px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{rank.name}</span>
              <span className="block text-[11px] text-muted leading-tight">{rank.brewery}</span>
            </span>
            <span className="ml-auto font-mono text-[11px] text-muted">{rank.count}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
