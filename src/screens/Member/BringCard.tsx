import type { Brand } from '@/types';

export type BringItem = {
  meetName: string;
  dateShort: string;
  brandId: string;
  note: string;
  isMvp: boolean;
};

type Props = {
  bring: BringItem;
  brand?: Brand;
  onClick: () => void;
};

export function BringCard({ bring, brand, onClick }: Props) {
  return (
    <article
      onClick={onClick}
      className="bg-card border border-line rounded-xl px-5 py-4 cursor-pointer hover:border-primary transition-colors flex gap-3.5 items-baseline"
    >
      <span className="font-mono text-[11px] text-accent font-bold shrink-0 w-9">{bring.dateShort}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-serif text-[15px] font-bold m-0">{brand?.name ?? bring.brandId}</h3>
          {bring.isMvp && (
            <span className="bg-accent text-surface rounded-full px-2.5 py-0.5 text-[10px] font-bold">MVP</span>
          )}
        </div>
        <p className="text-[11px] text-muted mt-0.5 m-0">{brand?.brewery} / {brand?.pref} ・ {bring.meetName}</p>
        {bring.note && <p className="text-[12.5px] text-body mt-1.5 leading-relaxed m-0">「{bring.note}」</p>}
      </div>
    </article>
  );
}
