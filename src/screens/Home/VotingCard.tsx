import type { HomeVals } from './useHomeVals';

export function VotingCard({ home }: { home: HomeVals }) {
  if (!home.homeVoting) return null;
  const voting = home.homeVoting;
  return (
    <article
      onClick={voting.click}
      className="bg-[#FBF0E6] border border-[#E8C9A8] rounded-xl px-5 py-4 cursor-pointer"
    >
      <header className="flex items-center gap-2 mb-1.5">
        <span className="bg-accent text-surface rounded-full px-2.5 py-0.5 text-[10px] font-bold">MVP投票受付中</span>
        <span className="text-[11px] text-accent-dark">締切 {voting.deadline}</span>
      </header>
      <h3 className="font-serif text-[15px] font-bold text-ink m-0">{voting.name}</h3>
      <p className="text-[12px] text-accent-dark font-bold mt-1 m-0">あなたの一本に投票する →</p>
    </article>
  );
}
