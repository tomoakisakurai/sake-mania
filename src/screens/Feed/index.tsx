import type { Vals } from '@/useVals';
import { FeedCard } from '@/components/shared/FeedCard';

export function Feed({ vals }: { vals: Vals }) {
  return (
    <main className="mx-auto max-w-200" style={{ padding: vals.pagePad }}>
      <h1 className="m-0 mb-1 font-serif text-[28px] font-bold">みんなの利き酒帳</h1>
      <p className="m-0 mb-6.5 text-[13px] text-muted">{vals.feedCount}件の記録 — 気になる一杯をタップ</p>
      <ul className="m-0 flex flex-col gap-4 p-0 list-none">
        {vals.feedAll.map((feed, i) => (
          <li key={i}>
            <FeedCard feed={feed} />
          </li>
        ))}
      </ul>
    </main>
  );
}
