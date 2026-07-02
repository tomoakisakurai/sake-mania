'use client';
import { useStore } from '@/store';
import { useDetailVals } from './useDetailVals';
import { Sidebar } from './Sidebar';
import { Specs } from './Specs';
import { TasteCoord } from './TasteCoord';
import { Reviews } from './Reviews';

export function Detail({ detailId }: { detailId: string }) {
  const store = useStore();
  const detail = useDetailVals(detailId);
  return (
    <main className="mx-auto max-w-300 px-4.5 pt-5 pb-32.5 md:px-10 md:pt-8 md:pb-20">
      <a onClick={() => store.nav('zukan')} className="mb-6 block cursor-pointer text-[13px] text-muted">← 図鑑にもどる</a>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[360px_1fr]">
        <Sidebar detail={detail} />
        <article>
          <p className="m-0 mb-1.5 text-[12px] text-muted">
            <a onClick={detail.breweryClick} className="cursor-pointer font-bold text-primary">{detail.brand.brewery}</a> / {detail.brand.pref}
          </p>
          <h1 className="m-0 mb-2.5 font-serif text-[34px] font-bold leading-[1.4]">{detail.brand.name}</h1>
          <p className="m-0 mb-5.5 flex items-center gap-3.5">
            <span className="text-[16px] tracking-[2px] text-accent">{detail.stars}</span>
            <span className="font-mono text-[13px] text-body">{detail.brand.rating} ・ {detail.brand.count}記録</span>
            <span className="rounded-full bg-line-soft px-3.5 py-1 text-[12px] text-body">{detail.brand.class}</span>
          </p>
          <p className="m-0 mb-6.5 max-w-140 text-[14px] leading-[2.1] text-body">{detail.brand.desc}</p>
          <Specs brand={detail.brand} />
          <TasteCoord detail={detail} />
          <Reviews reviews={detail.reviews} />
        </article>
      </div>
    </main>
  );
}
