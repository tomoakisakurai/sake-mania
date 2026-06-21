import type { Vals } from '@/useVals';
import { FeedCard } from '@/components/shared/FeedCard';
import { Hero } from './Hero';
import { TasteMap } from './TasteMap';
import { SpMeetupCards } from './SpMeetupCards';
import { MeetupSidebar } from './MeetupSidebar';

export function Home({ vals }: { vals: Vals }) {
  return (
    <main className="max-w-300 mx-auto" style={{ padding: vals.pagePad }}>
      <SpMeetupCards vals={vals} />
      <Hero vals={vals} />
      <TasteMap vals={vals} />

      <div className="grid gap-8" style={{ gridTemplateColumns: vals.homeSplitCols }}>
        <section className="flex flex-col gap-4">
          <header className="flex items-baseline justify-between border-b border-line pb-2.5">
            <h2 className="font-serif text-[18px] font-bold m-0">みんなの利き酒帳</h2>
            <a
              onClick={vals.goFeed}
              className="text-[13px] text-primary font-bold cursor-pointer"
            >
              すべて見る →
            </a>
          </header>
          {vals.feedItems.map((feed, i) => (
            <FeedCard key={i} f={feed} pad="20px 24px" />
          ))}
        </section>
        <MeetupSidebar vals={vals} />
      </div>
    </main>
  );
}
