import type { HomeVals } from './useHomeVals';

export function PastMeetups({ home }: { home: HomeVals }) {
  return (
    <section className="bg-card border border-line rounded-xl px-5 pt-4 pb-1.5">
      <h3 className="text-[12px] font-bold text-muted mb-1 m-0">過去のふりかえり</h3>
      <ul className="m-0 p-0 list-none">
        {home.homePast.map((past, i) => (
          <li
            key={i}
            onClick={past.click}
            className="flex items-center gap-3 py-3 border-b border-line-soft cursor-pointer"
          >
            <span className="font-mono text-[10.5px] text-accent w-10 flex-shrink-0 font-medium">{past.dateShort}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{past.name}</span>
              <span className="block text-[10.5px] text-muted leading-tight whitespace-nowrap overflow-hidden text-ellipsis">テーマ:{past.theme}</span>
            </span>
            {past.isVoting && (
              <span className="bg-accent text-surface rounded-full px-2 py-0.5 text-[9.5px] font-bold flex-shrink-0">投票中</span>
            )}
            {past.notVoting && (
              <span className="text-primary font-bold text-[12px] flex-shrink-0">→</span>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={home.openMeetupCreate}
        className="flex items-center gap-2 py-3 cursor-pointer text-primary text-[12.5px] font-bold w-full border-0 bg-transparent p-0"
      >
        <span className="text-[15px]">＋</span> SAKE MEETUPを立てる
      </button>
    </section>
  );
}
