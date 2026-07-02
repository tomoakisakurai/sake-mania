import type { DetailVals } from './useDetailVals';
// 銘柄詳細の味わい座標(ミニマップ): みんなの平均 + あなたの打点
export function TasteCoord({ detail }: { detail: DetailVals }) {
  return (
    <section className="mb-7 max-w-140 rounded-xl border border-line bg-surface px-6 py-5">
      <h2 className="m-0 mb-3 font-serif text-[15px] font-bold">味わいの座標</h2>
      <figure className="relative m-0 h-55 w-full rounded-lg border border-line bg-card">
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line-soft" />
        <span className="absolute top-1/2 right-0 left-0 h-px bg-line-soft" />
        <figcaption className="absolute top-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10px] font-bold text-muted">香り高い</figcaption>
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10px] font-bold text-muted">穏やか</figcaption>
        <figcaption className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">淡麗</figcaption>
        <figcaption className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px] font-bold text-muted">濃醇</figcaption>
        <span className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${detail.brand.x}%`, top: `${detail.brand.y}%` }} />
        <span className="absolute text-[11px] font-bold text-primary" style={{ left: `${detail.brand.x}%`, top: `${detail.brand.y}%`, transform: 'translate(11px, -7px)' }}>みんなの平均</span>
        {detail.hasMyPoint && (
          <>
            <span className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${detail.myX}%`, top: `${detail.myY}%` }} />
            <span className="absolute text-[11px] font-bold text-accent" style={{ left: `${detail.myX}%`, top: `${detail.myY}%`, transform: 'translate(11px, -7px)' }}>あなたの打点</span>
          </>
        )}
      </figure>
    </section>
  );
}
