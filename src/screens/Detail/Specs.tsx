import type { DetailVals } from './useDetailVals';
// 銘柄スペック表(精米歩合・酒米・酵母・日本酒度・アルコール・温度)
function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-4.5 py-3.5">
      <dt className="m-0 text-[10.5px] text-muted">{label}</dt>
      <dd className="m-0 mt-0.5 font-serif text-[17px] font-bold">{value}</dd>
    </div>
  );
}

export function Specs({ brand }: { brand: DetailVals['brand'] }) {
  return (
    <dl className="m-0 mb-7 grid max-w-140 grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line md:grid-cols-3">
      <Cell label="精米歩合" value={brand.polish} />
      <Cell label="酒米" value={brand.rice} />
      <Cell label="酵母" value={brand.yeast} />
      <Cell label="日本酒度" value={brand.smv} />
      <Cell label="アルコール" value={brand.abv} />
      <Cell label="おすすめ温度" value={brand.temp} />
    </dl>
  );
}
