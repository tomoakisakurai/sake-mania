import type { Vals } from '@/useVals';
// 酒蔵詳細: この蔵の銘柄グリッド
export function BrandGrid({ vals }: { vals: Vals }) {
  return (
    <section>
      <h2 className="m-0 mb-4 border-b border-line pb-2.5 font-serif text-[18px] font-bold">この蔵の銘柄</h2>
      <ul className="m-0 grid gap-3.5 p-0 list-none" style={{ gridTemplateColumns: vals.kuraBrandCols }}>
        {vals.ku.brands.map((brand, i) => (
          <li key={i}>
            <article onClick={brand.click} className="flex cursor-pointer flex-col gap-2.25 rounded-xl border border-line bg-card p-4">
              <figure className="m-0 flex h-25 items-center justify-center rounded-lg" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}>
                <figcaption className="font-mono text-[9px] text-muted">ボトル写真</figcaption>
              </figure>
              <hgroup>
                <h3 className="m-0 font-serif text-[15.5px] font-bold leading-[1.4]">{brand.name}</h3>
                <p className="m-0 mt-0.75 text-[11px] text-muted">{brand.cls}</p>
              </hgroup>
              <p className="m-0 font-mono text-[10px] text-body">精米{brand.polish} ・ {brand.rice}</p>
              <p className="m-0 mt-auto flex items-center gap-2">
                <span className="relative h-1 flex-1 rounded-sm bg-line-soft">
                  <span className="absolute left-0 h-1 rounded-sm bg-primary" style={{ width: `${brand.pct}%` }} />
                </span>
                <span className="text-[12px] font-bold text-primary">{brand.rating}</span>
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
