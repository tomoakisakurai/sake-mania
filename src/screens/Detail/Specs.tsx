import type { Vals } from '@/useVals';
// 銘柄スペック表(精米歩合・酒米・酵母・日本酒度・アルコール・温度)
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4.5 py-3.5">
      <dt className="m-0 text-[10.5px] text-muted">{label}</dt>
      <dd className="m-0 mt-0.5 font-serif text-[17px] font-bold">{value}</dd>
    </div>
  );
}

export function Specs({ vals }: { vals: Vals }) {
  return (
    <dl className="m-0 mb-7 grid max-w-140 gap-px overflow-hidden rounded-[10px] border border-line bg-line" style={{ gridTemplateColumns: vals.specCols }}>
      <Cell label="精米歩合" value={vals.d.polish} />
      <Cell label="酒米" value={vals.d.rice} />
      <Cell label="酵母" value={vals.d.yeast} />
      <Cell label="日本酒度" value={vals.d.smv} />
      <Cell label="アルコール" value={vals.d.abv} />
      <Cell label="おすすめ温度" value={vals.d.temp} />
    </dl>
  );
}
