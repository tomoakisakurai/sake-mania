import type { Vals } from '@/useVals';

type Record = Vals['myList'][number];

// わたしの利き酒帳の1件分カード
export function RecordItem({ record, onDelete }: { record: Record; onDelete: (recordId: string, name: string) => void }) {
  return (
    <article className="flex gap-4 rounded-xl border border-line bg-card p-4.5 px-5.5">
      {record.hasPhoto && (<img src={record.photo} alt="" className="h-19 w-14 shrink-0 rounded-sm object-cover" />)}
      {record.noPhoto && (<span className="h-19 w-14 shrink-0 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />)}
      <div className="min-w-0 flex-1">
        <header className="mb-2 flex flex-wrap items-start gap-1">
          <hgroup className="min-w-0 flex-1">
            <h3 onClick={record.click} className="m-0 cursor-pointer font-serif text-[16.5px] font-bold">{record.name}</h3>
            <p className="m-0 mt-0.5 text-[11.5px] text-muted">{record.sub}</p>
          </hgroup>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="text-[13px] tracking-[2px] text-accent">{record.stars}</span>
            <span className="font-mono text-[11px] text-faint">{record.date}</span>
          </div>
        </header>
        <p className="m-0 mb-2 text-[13px] leading-[1.9] text-body">{record.memo}</p>
        <ul className="m-0 flex flex-wrap items-center gap-2 p-0 list-none">
          {record.tags.map((tag, j) => (
            <li key={j} className="rounded-full bg-bg px-3 py-0.5 text-[11px] text-body">{tag}</li>
          ))}
          <li className="ml-auto list-none">
            <button type="button" onClick={() => onDelete(record.recordId, record.name)} className="cursor-pointer rounded-sm border border-line bg-transparent px-2 py-0.5 text-[11px] text-faint">削除</button>
          </li>
        </ul>
      </div>
    </article>
  );
}
