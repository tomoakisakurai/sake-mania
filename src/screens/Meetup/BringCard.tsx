import type { MeetupVals } from './useMeetupVals';

type Bring = MeetupVals['bringList'][number];

// 持ち寄りラインナップの1枚分。誰が何を持ち寄るか、かぶり判定込みで表示。
export function BringCard({ bring }: { bring: Bring }) {
  return (
    <article className="flex items-center gap-3.5 rounded-xl border border-line bg-card px-4.5 py-4">
      <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-full text-[13px] font-bold" style={{ background: bring.avatarBg }}>{bring.avatar}</span>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center gap-2">
          <span className="text-[11.5px] text-muted">{bring.memberName}</span>
          {bring.mine && <span className="rounded-full bg-mark px-2 py-0.5 text-[10px] font-bold">あなた</span>}
          {bring.dup && <span className="rounded-full bg-accent-tint-strong px-2.25 py-0.5 text-[10px] font-bold text-accent-dark">かぶり</span>}
        </header>
        <h3 onClick={bring.brandClick} className="m-0 mt-0.5 cursor-pointer font-serif text-[16px] font-bold">{bring.brandName}</h3>
        <p className="m-0 text-[11px] text-muted">{bring.brandSub}</p>
        {bring.note && <p className="m-0 mt-1 text-[12px] text-body">「{bring.note}」</p>}
      </div>
    </article>
  );
}
