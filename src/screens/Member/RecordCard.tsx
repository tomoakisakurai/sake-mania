import type { Brand } from '@/types';

export type RecordItem = {
  brandId: string;
  rating: number;
  memo: string;
  date: string;
  photo: string | null;
  tags: string[];
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

// ホームの FeedCard(みんなの利き酒帳)と体裁を揃えた記録カード
export function RecordCard({ record, brand, onClick }: Props) {
  return (
    <article
      onClick={onClick}
      className="flex cursor-pointer gap-4.5 rounded-xl border border-line bg-card p-5 px-6 transition-colors hover:border-primary"
    >
      {record.photo ? (
        <img src={record.photo} alt="" className="h-24 w-18 shrink-0 rounded-sm object-cover" />
      ) : (
        <span className="flex h-24 w-18 shrink-0 items-center justify-center rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }}>
          <span className="font-mono text-[9px] text-muted">ラベル</span>
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <header className="flex items-baseline gap-2.5">
          <h3 className="m-0 min-w-0 flex-1 font-serif text-[18px] font-bold">{brand?.name ?? record.brandId}</h3>
          <span className="shrink-0 text-[14px] tracking-[2px] text-accent">{starStr(record.rating)}</span>
        </header>
        <p className="m-0 text-[12px] text-muted">{brand?.brewery} / {brand?.pref} ・ {record.date}</p>
        <p className="m-0 text-[13px] leading-[1.8] text-body">{record.memo || '(メモなし)'}</p>
        {record.tags.length > 0 && (
          <ul className="m-0 mt-0.5 flex flex-wrap gap-2 p-0 list-none">
            {record.tags.map((tag, i) => (
              <li key={i} className="rounded-full bg-bg px-3 py-0.5 text-[11px] text-body">{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
