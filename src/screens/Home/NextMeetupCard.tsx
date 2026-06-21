import type { Vals } from '@/useVals';

export function NextMeetupCard({ vals }: { vals: Vals }) {
  if (vals.homeNext) {
    const next = vals.homeNext;
    return (
      <article
        onClick={next.click}
        className="bg-primary rounded-xl px-6 py-5 text-surface cursor-pointer"
      >
        <p className="font-mono text-[10px] tracking-[0.16em] opacity-70 mb-2 m-0">次回のSAKE MEETUP</p>
        <h3 className="font-serif text-[19px] font-bold leading-[1.5] m-0">{next.name}</h3>
        <p className="text-[12.5px] opacity-85 mt-1.5 m-0">{next.dateLabel} ・ {next.place}</p>
        <p className="text-[12px] opacity-70 mt-1 m-0">テーマ:{next.theme}</p>
        <p className="flex gap-4 mt-3 font-mono text-[11px] opacity-85 m-0">
          <span>{next.goingLabel}</span>
          <span>{next.bringLabel}</span>
        </p>
        <p className="text-[12px] font-bold mt-3 m-0">詳細・持ち寄りを宣言する →</p>
      </article>
    );
  }
  return (
    <article className="bg-surface border border-dashed border-line-strong rounded-xl px-6 py-5 text-muted">
      <p className="font-mono text-[10px] tracking-[0.16em] mb-2 m-0">次回のSAKE MEETUP</p>
      <p className="text-[13px] leading-relaxed m-0">
        予定されている会はまだありません。<br />
        下の「＋ SAKE MEETUPを立てる」から作成できます。
      </p>
    </article>
  );
}
