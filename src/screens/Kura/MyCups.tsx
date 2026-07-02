import type { KuraVals } from './useKuraVals';

export function MyCups({ ku }: { ku: KuraVals }) {
  return (
    <section className="rounded-xl border border-line bg-card px-5.5 py-5">
      <h2 className="m-0 mb-1.5 font-serif text-[15px] font-bold">この蔵でのわたしの盃</h2>
      <ul className="m-0 p-0 list-none">
        {ku.cups.map((cup, i) => (
          <li key={i} onClick={cup.click} className="cursor-pointer border-b border-line-soft py-3 last:border-b-0">
            <header className="mb-1 flex flex-wrap items-baseline gap-2.5">
              <span className="text-[13px] font-bold">{cup.name}</span>
              <span className="text-[12px] tracking-[2px] text-accent">{cup.stars}</span>
              <span className="font-mono text-[10.5px] text-faint">{cup.date}</span>
            </header>
            <p className="m-0 text-[12.5px] leading-[1.8] text-body">{cup.memo}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
