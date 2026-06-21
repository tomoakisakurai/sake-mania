import type { Vals } from '@/useVals';
// マイページ右カラム: 舌の地図(打点マップ)
export function TasteMap({ vals }: { vals: Vals }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5.5 px-6">
      <h2 className="m-0 mb-3.5 font-serif text-[15px] font-bold">舌の地図</h2>
      <figure className="relative m-0 h-65 w-full rounded-lg border border-line bg-card">
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line-soft" />
        <span className="absolute top-1/2 right-0 left-0 h-px bg-line-soft" />
        <figcaption className="absolute top-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[9.5px] font-bold text-muted">香り高い</figcaption>
        <figcaption className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[9.5px] font-bold text-muted">穏やか</figcaption>
        <figcaption className="absolute top-1/2 left-2 -translate-y-1/2 text-[9.5px] font-bold text-muted">淡麗</figcaption>
        <figcaption className="absolute top-1/2 right-2 -translate-y-1/2 text-[9.5px] font-bold text-muted">濃醇</figcaption>
        {vals.myDots.map((dot, i) => (
          <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size, background: dot.bg }} />
        ))}
      </figure>
      <p className="m-0 mt-3 text-[11.5px] leading-[1.8] text-muted">あなたの打点は「香り高い×濃醇」に集中。淡麗系の名酒を試すと地図が広がります。</p>
    </section>
  );
}
