import type { Vals } from '@/useVals';
// 記録ステップ2: 味わいの座標(打点) + 甘辛 + 総合評価
export function Step2Taste({ vals }: { vals: Vals }) {
  return (
    <>
      <section className="mb-5.5 flex items-center gap-3.5 rounded-xl border border-line bg-surface px-5 py-4">
        <span className="h-13.5 w-10 shrink-0 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
        <hgroup>
          <h2 className="m-0 text-[14.5px] font-bold">{vals.recBrandName}</h2>
          <p className="m-0 text-[11.5px] text-muted">{vals.recBrandSub}</p>
        </hgroup>
        <a onClick={vals.recChangeBrand} className="ml-auto cursor-pointer text-[12px] font-bold text-primary">変更</a>
      </section>
      <p className="m-0 mb-2.5 text-[13.5px] font-bold">この一杯はどの座標? <span className="text-[12px] font-normal text-muted">マップをタップして打点</span></p>
      <figure onClick={vals.onMapTap} className="relative m-0 mb-2 h-80 w-full cursor-crosshair rounded-lg border border-line bg-card">
        <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line-soft" />
        <span className="absolute top-1/2 right-0 left-0 h-px bg-line-soft" />
        <figcaption className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10.5px] font-bold text-muted">香り高い</figcaption>
        <figcaption className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-card px-1.5 text-[10.5px] font-bold text-muted">穏やか</figcaption>
        <figcaption className="absolute top-1/2 left-3 -translate-y-1/2 text-[10.5px] font-bold text-muted">淡麗</figcaption>
        <figcaption className="absolute top-1/2 right-3 -translate-y-1/2 text-[10.5px] font-bold text-muted">濃醇</figcaption>
        {vals.recGhostDots.map((ghost, i) => (
          <span key={i} className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-line-strong" style={{ left: `${ghost.left}%`, top: `${ghost.top}%` }} />
        ))}
        {vals.recHasPoint && (
          <>
            <span className="pointer-events-none absolute flex h-9.5 w-9.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/15" style={{ left: `${vals.recX}%`, top: `${vals.recY}%` }}>
              <span className="h-4.25 w-4.25 rounded-full bg-primary" style={{ boxShadow: '0 1px 6px rgba(50,80,124,0.5)' }} />
            </span>
            <span className="pointer-events-none absolute text-[11.5px] font-bold text-primary" style={{ left: `${vals.recX}%`, top: `${vals.recY}%`, transform: 'translate(24px, -10px)' }}>この一杯</span>
          </>
        )}
      </figure>
      <p className="m-0 mb-6 text-[11px] text-faint">薄い点はあなたの過去の盃。打点すると味わいの言葉に自動変換されます — <b className="text-body">{vals.recTasteLabel}</b></p>
      <section className="mb-6.5">
        <header className="mb-1.5 flex justify-between text-[12.5px] font-bold">
          <span>甘口</span>
          <span className="text-[11px] font-normal text-muted">甘辛 — {vals.recSweetLabel}</span>
          <span>辛口</span>
        </header>
        <input type="range" min={0} max={100} value={vals.recSweet} onChange={vals.onSweet} className="w-full cursor-pointer accent-primary" />
      </section>
      <section className="mb-2">
        <h2 className="m-0 mb-2 text-[12.5px] font-bold">総合評価</h2>
        <div className="flex items-center gap-1.5">
          {vals.recStars.map((star, i) => (
            <span key={i} onClick={star.click} className="cursor-pointer text-[30px] leading-none" style={{ color: star.color }}>★</span>
          ))}
          <span className="ml-2 font-mono text-[14px] text-muted">{vals.recRatingLabel}</span>
        </div>
      </section>
    </>
  );
}
