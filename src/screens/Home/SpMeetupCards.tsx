import type { Vals } from '@/useVals';

// SP専用: ホーム最上部に表示する次回MEETUP / MVP投票カード
// PCではMeetupSidebarで右カラムに出すので重複させない
export function SpMeetupCards({ vals }: { vals: Vals }) {
  if (!vals.isMobile) return null;
  return (
    <>
      {vals.homeNext && (
        <article
          onClick={vals.homeNext.click}
          className="mb-5.5 cursor-pointer rounded-2xl bg-primary px-5 py-4.5 text-surface"
        >
          <p className="mb-1.5 font-mono text-[9px] tracking-[0.18em] opacity-70 m-0">次回のSAKE MEETUP</p>
          <h3 className="font-serif text-[18px] font-bold leading-[1.45] m-0">{vals.homeNext.name}</h3>
          <p className="mt-1 text-[12px] opacity-85 m-0">{vals.homeNext.dateLabel} ・ {vals.homeNext.place}</p>
          <p className="mt-0.5 text-[11px] opacity-70 m-0">テーマ: {vals.homeNext.theme}</p>
          <p className="mt-2.5 flex gap-3.5 font-mono text-[10px] opacity-85 m-0">
            <span>{vals.homeNext.goingLabel}</span>
            <span>{vals.homeNext.bringLabel}</span>
          </p>
          <p className="mt-2.5 text-[11.5px] font-bold opacity-95 m-0">詳細・持ち寄りを宣言する →</p>
        </article>
      )}
      {vals.homeVoting && (
        <article
          onClick={vals.homeVoting.click}
          className="mb-5.5 cursor-pointer rounded-xl border border-[#E8C9A8] bg-[#FBF0E6] px-4 py-3.5"
        >
          <header className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-surface">MVP投票受付中</span>
            <span className="text-[10.5px] text-accent-dark">締切 {vals.homeVoting.deadline}</span>
          </header>
          <h3 className="font-serif text-[14px] font-bold text-ink m-0">{vals.homeVoting.name}</h3>
          <p className="mt-1 text-[11.5px] font-bold text-accent-dark m-0">あなたの一本に投票する →</p>
        </article>
      )}
    </>
  );
}
