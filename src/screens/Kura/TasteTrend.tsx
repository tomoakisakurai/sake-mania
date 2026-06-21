import { Fragment } from 'react';
import type { Vals } from '@/useVals';

export function TasteTrend({ vals }: { vals: Vals }) {
  return (
    <section className="rounded-xl border border-line bg-surface px-5.5 py-5">
      <h2 className="m-0 mb-3 font-serif text-[15px] font-bold">蔵の味わい傾向</h2>
      <figure className="relative m-0 h-57.5 w-full rounded-lg border border-line bg-card">
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line-soft" />
        <span className="absolute top-1/2 right-0 left-0 h-px bg-line-soft" />
        <figcaption className="absolute top-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10px] font-bold text-muted">香り高い</figcaption>
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10px] font-bold text-muted">穏やか</figcaption>
        <figcaption className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">淡麗</figcaption>
        <figcaption className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">濃醇</figcaption>
        {vals.ku.dots.map((dot, i) => (
          <Fragment key={i}>
            <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${dot.left}%`, top: `${dot.top}%` }} />
            <span className="absolute max-w-32.5 text-[10px] text-body" style={{ left: `${dot.left}%`, top: `${dot.top}%`, transform: 'translate(10px, -6px)' }}>{dot.label}</span>
          </Fragment>
        ))}
      </figure>
    </section>
  );
}
