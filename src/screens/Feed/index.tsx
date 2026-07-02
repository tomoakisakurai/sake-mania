'use client';
import { FeedCard } from '@/components/shared/FeedCard';
import { useFeedItems } from './useFeedItems';

export function Feed() {
  const feedItems = useFeedItems();
  return (
    <main className="mx-auto max-w-200 px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <h1 className="m-0 mb-1 font-serif text-[28px] font-bold">みんなの利き酒帳</h1>
      <p className="m-0 mb-6.5 text-[13px] text-muted">{feedItems.length}件の記録 — 気になる一杯をタップ</p>
      <ul className="m-0 flex flex-col gap-4 p-0 list-none">
        {feedItems.map((feed, i) => (
          <li key={i}>
            <FeedCard feed={feed} />
          </li>
        ))}
      </ul>
    </main>
  );
}
