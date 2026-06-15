/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Vals } from '@/useVals';
// SAKE MEETUP一覧のカード。フェーズ別(開催前/投票受付中/結果確定)に統計・CTAを出し分ける。
export function MeetupCard({ ml }: { ml: Vals['meetupsList'][number] }) {
  return (
    <div onClick={ml.click} className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-line bg-card p-[22px_26px]">
      {/* header row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="shrink-0 rounded-full px-3 py-[3px] text-[11px] font-bold text-surface" style={{ background: ml.phaseBg }}>{ml.phaseLabel}</span>
        <div className="font-serif text-[19px] font-bold leading-[1.4]">{ml.name}</div>
      </div>

      {/* meta row */}
      <div className="flex flex-wrap gap-6 text-[12.5px] text-body">
        <span>{ml.dateLabel}</span>
        <span>{ml.place}</span>
        <span className="text-muted">テーマ: {ml.theme}</span>
      </div>

      {/* stats row */}
      <div className="flex flex-wrap items-center gap-[18px]">
        {ml.isUpcoming && (
          <>
            <div className="flex items-center gap-[14px]">
              <span className="font-mono text-[12px] text-muted">参加 <strong className="text-ink">{ml.goCount}</strong>人</span>
              <span className="font-mono text-[12px] text-muted">持ち寄り宣言 <strong className="text-ink">{ml.bringCount}</strong>本</span>
            </div>
            <div onClick={ml.goToggle} className="ml-auto cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-primary px-5 py-[7px] text-[12.5px] font-bold" style={{ background: ml.goLabelBg, color: ml.goLabelColor }}>{ml.goLabel}</div>
          </>
        )}
        {ml.isVoting && (
          <>
            <span className="text-[12.5px] font-bold text-accent-dark">投票締切: {ml.voteDeadline}</span>
            <span className="ml-auto text-[12.5px] font-bold text-accent">あなたの一本に投票する →</span>
          </>
        )}
        {ml.isClosed && (
          <>
            {ml.hasMvp && (
              <div className="flex items-center gap-[10px]">
                <span className="rounded-full bg-bg px-3 py-[3px] text-[11px] font-bold text-body">★ MVP</span>
                <span className="font-serif text-[15px] font-bold">{ml.mvpName}</span>
              </div>
            )}
            <span className="ml-auto text-[12.5px] text-muted">ふりかえりを見る →</span>
          </>
        )}
      </div>
    </div>
  );
}
