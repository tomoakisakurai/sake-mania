'use client';
import { useStore } from '@/store';
import { useKuraVals } from './useKuraVals';
import { BrandGrid } from './BrandGrid';
import { Sidebar } from './Sidebar';

export function Kura({ kuraName }: { kuraName: string }) {
  const store = useStore();
  const ku = useKuraVals(kuraName);
  return (
    <main className="mx-auto max-w-250 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
      <a onClick={() => store.nav('map')} className="mb-6 block cursor-pointer text-[13px] text-muted">← 酒蔵マップにもどる</a>
      <header>
        <p className="m-0 mb-2.5 font-mono text-[11px] tracking-[0.18em] text-muted">SAKE BREWERY</p>
        <div className="mb-1.5 flex flex-wrap items-center gap-3.5">
          <h1 className="m-0 font-serif text-[34px] font-bold">{ku.name}</h1>
          {ku.hasCups && (<span className="rounded-full bg-accent px-3.5 py-1 text-[11.5px] font-bold text-surface">呑んだことのある蔵</span>)}
        </div>
        <p className="m-0 mb-4.5 text-[13px] text-muted">{ku.meta}</p>
        <p className="m-0 mb-7 max-w-155 text-[14px] leading-[2.1] text-body">{ku.desc}</p>
        <dl className="m-0 mb-9 flex gap-8">
          <div>
            <dd className="m-0 font-serif text-[28px] font-bold">{ku.brandCount}</dd>
            <dt className="text-[12px] text-muted">図鑑の銘柄</dt>
          </div>
          <div className="border-l border-line pl-8">
            <dd className="m-0 font-serif text-[28px] font-bold">{ku.totalRecs}</dd>
            <dt className="text-[12px] text-muted">みんなの記録</dt>
          </div>
          <div className="border-l border-line pl-8">
            <dd className="m-0 font-serif text-[28px] font-bold text-accent">{ku.myCupCount}</dd>
            <dt className="text-[12px] text-muted">わたしの盃</dt>
          </div>
        </dl>
      </header>
      <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <BrandGrid ku={ku} />
        <Sidebar ku={ku} />
      </div>
    </main>
  );
}
