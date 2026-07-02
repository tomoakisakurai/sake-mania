import type { RecordVals } from './useRecordVals';
// 記録ステップ1: 銘柄を検索して選ぶ
export function Step1Brand({ recVals }: { recVals: RecordVals }) {
  return (
    <>
      <input
        type="text"
        value={recVals.recQuery}
        onChange={recVals.onRecSearch}
        placeholder="銘柄名・酒蔵でさがす"
        className="mb-4 block w-full rounded-full border border-line bg-card px-6 py-3.5 text-[14.5px] text-ink"
      />
      <ul className="m-0 overflow-hidden rounded-xl border border-line bg-card p-0 list-none">
        {recVals.recResults.map((brand, i) => (
          <li key={i} onClick={brand.click} className="flex cursor-pointer items-center gap-4 border-b border-line-soft px-5 py-3.5 last:border-b-0">
            <span className="h-13.5 w-10 shrink-0 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
            <hgroup>
              <h3 className="m-0 text-[14.5px] font-bold">{brand.name}</h3>
              <p className="m-0 text-[11.5px] text-muted">{brand.sub}</p>
            </hgroup>
            <span className="ml-auto text-[13px] font-bold text-primary">選ぶ →</span>
          </li>
        ))}
      </ul>
    </>
  );
}
