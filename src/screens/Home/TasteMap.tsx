import { Fragment } from 'react';
import type { HomeVals } from './useHomeVals';

// ホームの「あなたの味わいマップ」: 記録した盃を香り×淡麗濃醇の座標に打点表示
export function TasteMap({ home }: { home: HomeVals }) {
  return (
    <section className="bg-surface border border-line rounded-xl px-8 py-7 mb-9">
      <header className="flex justify-between items-baseline mb-4.5">
        <h2 className="font-serif text-[19px] font-bold m-0">あなたの味わいマップ</h2>
        <p className="font-mono text-[11px] text-muted m-0">{home.statCups}盃 / {home.statBrands}銘柄</p>
      </header>
      <figure className="relative m-0 h-75 w-full rounded-lg border border-line bg-card md:h-95">
        {/* 軸 */}
        <span className="absolute left-1/2 top-0 bottom-0 w-px bg-line-strong" />
        <span className="absolute top-1/2 left-0 right-0 h-px bg-line-strong" />
        {/* 軸ラベル */}
        <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-muted bg-card px-2">香り高い</span>
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-muted bg-card px-2">穏やか</span>
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted bg-card py-1">淡麗</span>
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted bg-card py-1">濃醇</span>
        {/* 打点 */}
        {home.myDots.map((dot, i) => (
          <Fragment key={i}>
            <span
              className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${dot.left}%`, top: `${dot.top}%`, width: dot.size, height: dot.size, background: dot.bg }}
            />
            <span
              className="absolute text-[11px] text-body translate-x-[11px] -translate-y-[7px]"
              style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
            >
              {dot.label}
            </span>
          </Fragment>
        ))}
        {/* 未踏領域 */}
        <span
          className="absolute left-[44%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-dashed border-accent bg-[rgba(188,106,45,0.07)]"
        />
        <span
          className="absolute left-[44%] top-1/2 translate-x-3.5 -translate-y-2 text-[11px] text-accent font-bold"
        >
          未踏の領域
        </span>
      </figure>
      <ul className="flex gap-5 mt-3.5 text-[11.5px] text-body items-center m-0 p-0 list-none">
        <li className="flex items-center gap-1.5">
          <span className="w-[11px] h-[11px] rounded-full bg-accent inline-block" />
          五つ星の盃
        </li>
        <li className="flex items-center gap-1.5">
          <span className="w-[9px] h-[9px] rounded-full bg-primary inline-block" />
          記録済み
        </li>
        <li className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-dashed border-accent inline-block" />
          まだ飲んでいない座標 — ここを開拓しよう
        </li>
      </ul>
    </section>
  );
}
