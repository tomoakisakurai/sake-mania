import type { Vals } from '@/useVals';
import { Sidebar } from './Sidebar';
import { Specs } from './Specs';
import { TasteCoord } from './TasteCoord';
import { Reviews } from './Reviews';

export function Detail({ vals }: { vals: Vals }) {
  return (
    <main className="mx-auto max-w-300" style={{ padding: vals.pagePadTight }}>
      <a onClick={vals.goZukan} className="mb-6 block cursor-pointer text-[13px] text-muted">← 図鑑にもどる</a>
      <div className="grid gap-10" style={{ gridTemplateColumns: vals.detailCols }}>
        <Sidebar vals={vals} />
        <article>
          <p className="m-0 mb-1.5 text-[12px] text-muted">
            <a onClick={vals.dBreweryClick} className="cursor-pointer font-bold text-primary">{vals.d.brewery}</a> / {vals.d.pref}
          </p>
          <h1 className="m-0 mb-2.5 font-serif text-[34px] font-bold leading-[1.4]">{vals.d.name}</h1>
          <p className="m-0 mb-5.5 flex items-center gap-3.5">
            <span className="text-[16px] tracking-[2px] text-accent">{vals.dStars}</span>
            <span className="font-mono text-[13px] text-body">{vals.d.rating} ・ {vals.d.count}記録</span>
            <span className="rounded-full bg-line-soft px-3.5 py-1 text-[12px] text-body">{vals.d.class}</span>
          </p>
          <p className="m-0 mb-6.5 max-w-140 text-[14px] leading-[2.1] text-body">{vals.d.desc}</p>
          <Specs vals={vals} />
          <TasteCoord vals={vals} />
          <Reviews vals={vals} />
        </article>
      </div>
    </main>
  );
}
