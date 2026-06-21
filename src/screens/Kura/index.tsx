import type { Vals } from '@/useVals';
import { BrandGrid } from './BrandGrid';
import { Sidebar } from './Sidebar';

export function Kura({ vals }: { vals: Vals }) {
  return (
    <main className="mx-auto max-w-250" style={{ padding: vals.pagePadTight }}>
      <a onClick={vals.goMap} className="mb-6 block cursor-pointer text-[13px] text-muted">← 酒蔵マップにもどる</a>
      <header>
        <p className="m-0 mb-2.5 font-mono text-[11px] tracking-[0.18em] text-muted">SAKE BREWERY</p>
        <div className="mb-1.5 flex flex-wrap items-center gap-3.5">
          <h1 className="m-0 font-serif text-[34px] font-bold">{vals.ku.name}</h1>
          {vals.ku.hasCups && (<span className="rounded-full bg-accent px-3.5 py-1 text-[11.5px] font-bold text-surface">呑んだことのある蔵</span>)}
        </div>
        <p className="m-0 mb-4.5 text-[13px] text-muted">{vals.ku.meta}</p>
        <p className="m-0 mb-7 max-w-155 text-[14px] leading-[2.1] text-body">{vals.ku.desc}</p>
        <dl className="m-0 mb-9 flex gap-8">
          <div>
            <dd className="m-0 font-serif text-[28px] font-bold">{vals.ku.brandCount}</dd>
            <dt className="text-[12px] text-muted">図鑑の銘柄</dt>
          </div>
          <div className="border-l border-line pl-8">
            <dd className="m-0 font-serif text-[28px] font-bold">{vals.ku.totalRecs}</dd>
            <dt className="text-[12px] text-muted">みんなの記録</dt>
          </div>
          <div className="border-l border-line pl-8">
            <dd className="m-0 font-serif text-[28px] font-bold text-accent">{vals.ku.myCupCount}</dd>
            <dt className="text-[12px] text-muted">わたしの盃</dt>
          </div>
        </dl>
      </header>
      <div className="grid items-start gap-7" style={{ gridTemplateColumns: vals.kuraCols }}>
        <BrandGrid vals={vals} />
        <Sidebar vals={vals} />
      </div>
    </main>
  );
}
