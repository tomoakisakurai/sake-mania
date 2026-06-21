import type { Vals } from '@/useVals';

type Lineup = Vals['meetup']['lineup'][number];

// MVP投票/結果フェーズのラインナップ1件。順位・銘柄・持参者・コメント・投票ボタン。
export function LineupCard({ lineup }: { lineup: Lineup }) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-line bg-card px-5 py-4.5">
      <span className="w-6.5 shrink-0 text-center font-serif text-[22px] font-bold text-accent">{lineup.rankLabel}</span>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center gap-2.5">
          <h3 onClick={lineup.brandClick} className="m-0 cursor-pointer font-serif text-[17px] font-bold">{lineup.brandName}</h3>
          {lineup.isMvp && <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-surface">MVP</span>}
        </header>
        <p className="m-0 mb-1.5 text-[11.5px] text-muted">{lineup.brandSub}</p>
        <p className="m-0 mb-2 font-mono text-[12px] font-bold text-accent">得票 {lineup.votes}</p>
        <p className="m-0 mb-2.5 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: lineup.avatarBg }}>{lineup.avatar}</span>
          <span className="text-[11.5px] text-muted">{lineup.broughtBy}さんが持参</span>
        </p>
        <p className="m-0 mb-3 text-[12.5px] leading-[1.8] text-body">「{lineup.comment}」</p>
        {lineup.canVote && (
          <button
            type="button"
            onClick={lineup.voteClick}
            className={`inline-flex cursor-pointer items-center gap-[7px] rounded-full border-[1.5px] border-accent px-4.5 py-1.75 text-[12.5px] font-bold ${lineup.voted ? 'bg-accent text-surface' : 'bg-surface text-accent'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" /></svg>
            {lineup.voteLabel}
          </button>
        )}
      </div>
    </article>
  );
}
