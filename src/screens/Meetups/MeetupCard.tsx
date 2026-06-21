import clsx from 'clsx';
import type { Vals } from '@/useVals';
import { MeetupGoButton } from './MeetupGoButton';
// SAKE MEETUP一覧のカード。フェーズ別(開催前/投票受付中/結果確定)に統計・CTAを出し分ける。
export function MeetupCard({ ml }: { ml: Vals['meetupsList'][number] }) {
  const phaseBg = ml.isVoting ? 'bg-accent' : ml.isClosed ? 'bg-body' : 'bg-primary';
  return (
    <article onClick={ml.click} className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-line bg-card py-5.5 px-6.5">
      <header className="flex flex-wrap items-center gap-3">
        <span className={clsx('shrink-0 rounded-full px-3 py-[3px] text-[11px] font-bold text-surface', phaseBg)}>{ml.phaseLabel}</span>
        <h2 className="m-0 font-serif text-[19px] font-bold leading-[1.4]">{ml.name}</h2>
      </header>

      <p className="m-0 flex flex-wrap gap-6 text-[12.5px] text-body">
        <span>{ml.dateLabel}</span>
        <span>{ml.place}</span>
        <span className="text-muted">テーマ: {ml.theme}</span>
      </p>

      <div className="flex flex-wrap items-center gap-4.5">
        {ml.isUpcoming && (
          <>
            <div className="flex items-center gap-3.5">
              <span className="font-mono text-[12px] text-muted">参加 <strong className="text-ink">{ml.goingCount}</strong>人</span>
              <span className="font-mono text-[12px] text-muted">持ち寄り宣言 <strong className="text-ink">{ml.bringCount}</strong>本</span>
            </div>
            <MeetupGoButton meetupId={ml.meetupId} iGoing={ml.iGoing} />
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
              <p className="m-0 flex items-center gap-2.5">
                <span className="rounded-full bg-bg px-3 py-[3px] text-[11px] font-bold text-body">★ MVP</span>
                <span className="font-serif text-[15px] font-bold">{ml.mvpName}</span>
              </p>
            )}
            <span className="ml-auto text-[12.5px] text-muted">ふりかえりを見る →</span>
          </>
        )}
      </div>
    </article>
  );
}
