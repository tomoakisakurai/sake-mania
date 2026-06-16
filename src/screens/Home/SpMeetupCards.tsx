import type { Vals } from '@/useVals';
// SP専用: ホーム最上部に表示する次回MEETUP / MVP投票カード。
// PCでは右カラム(MeetupSidebar)に出すため、ここは isMobile のときだけ描画する。
export function SpMeetupCards({ vals }: { vals: Vals }) {
  if (!vals.isMobile) return null;
  return (
    <>
      {vals.homeNext && (
        <div onClick={vals.homeNext.click} className="mb-[22px] cursor-pointer rounded-[14px] bg-primary p-[18px_20px] text-surface">
          <div className="mb-[6px] font-mono text-[9px] tracking-[0.18em] opacity-70">次回のSAKE MEETUP</div>
          <div className="font-serif text-[18px] font-bold leading-[1.45]">{vals.homeNext.name}</div>
          <div className="mt-1 text-[12px] opacity-85">{vals.homeNext.dateLabel} ・ {vals.homeNext.place}</div>
          <div className="mt-[2px] text-[11px] opacity-70">テーマ: {vals.homeNext.theme}</div>
          <div className="mt-[10px] flex gap-[14px] font-mono text-[10px] opacity-85"><span>{vals.homeNext.goingLabel}</span><span>{vals.homeNext.bringLabel}</span></div>
          <div className="mt-[10px] text-[11.5px] font-bold opacity-95">詳細・持ち寄りを宣言する →</div>
        </div>
      )}
      {vals.homeVoting && (
        <div onClick={vals.homeVoting.click} className="mb-[22px] cursor-pointer rounded-xl border border-[#E8C9A8] bg-[#FBF0E6] p-[14px_16px]">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-accent px-[10px] py-[2px] text-[10px] font-bold text-surface">MVP投票受付中</span>
            <span className="text-[10.5px] text-accent-dark">締切 {vals.homeVoting.deadline}</span>
          </div>
          <div className="font-serif text-[14px] font-bold text-ink">{vals.homeVoting.name}</div>
          <div className="mt-[3px] text-[11.5px] font-bold text-accent-dark">あなたの一本に投票する →</div>
        </div>
      )}
    </>
  );
}
