import type { Brand } from '@/types';

export type RecordItem = {
  brandId: string;
  rating: number;
  memo: string;
  date: string;
};

const starStr = (n: number) => {
  const k = Math.max(0, Math.min(5, Math.round(n) || 0));
  return '★'.repeat(k) + '☆'.repeat(5 - k);
};

type Props = {
  record: RecordItem;
  brand?: Brand;
  onClick: () => void;
};

export function RecordCard({ record, brand, onClick }: Props) {
  return (
    <article
      onClick={onClick}
      className="bg-card border border-line rounded-xl px-5 py-4 cursor-pointer hover:border-primary transition-colors"
    >
      <div className="flex items-baseline gap-2.5 flex-wrap mb-1">
        <h3 className="font-serif text-[15px] font-bold m-0">{brand?.name ?? record.brandId}</h3>
        <span className="text-accent text-[12px] tracking-widest">{starStr(record.rating)}</span>
      </div>
      <p className="text-[11px] text-muted mb-1.5 m-0">{brand?.brewery} / {brand?.pref} ・ {record.date}</p>
      <p className="text-[12.5px] leading-relaxed text-body m-0">「{record.memo || '(メモなし)'}」</p>
    </article>
  );
}
