import type { MyPageVals } from './useMyPageVals';
// マイページ右カラム: 飲みたいリスト
export function WantList({ my }: { my: MyPageVals }) {
  return (
    <section className="rounded-xl border border-line bg-card p-5.5 px-6">
      <h2 className="m-0 mb-1.5 font-serif text-[15px] font-bold">飲みたいリスト</h2>
      <ul className="m-0 p-0 list-none">
        {my.wantList.map((want, i) => (
          <li key={i} onClick={want.click} className="flex cursor-pointer items-center gap-3 border-b border-line-soft py-3 last:border-b-0">
            <span className="h-11.5 w-8.5 shrink-0 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #EFE8D8, #EFE8D8 8px, #E7DFCC 8px, #E7DFCC 16px)' }} />
            <hgroup>
              <h3 className="m-0 text-[13.5px] font-bold">{want.name}</h3>
              <p className="m-0 text-[11px] text-muted">{want.sub}</p>
            </hgroup>
            <a href={want.buyUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="ml-auto whitespace-nowrap text-[11.5px] font-bold text-accent">買う ↗</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
