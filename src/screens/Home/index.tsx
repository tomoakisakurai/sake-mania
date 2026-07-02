'use client';
import { useHomeVals } from './useHomeVals';
import { FeedCard } from '@/components/shared/FeedCard';
import { Hero } from './Hero';
import { TasteMap } from './TasteMap';
import { SpMeetupCards } from './SpMeetupCards';
import { MeetupSidebar } from './MeetupSidebar';

export function Home() {
  const home = useHomeVals();
  return (
    <main className="max-w-300 mx-auto px-4.5 pt-7 pb-32.5 md:px-10 md:pt-10 md:pb-20">
      <SpMeetupCards home={home} />
      <Hero home={home} />
      <TasteMap home={home} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section className="flex flex-col gap-4">
          <header className="flex items-baseline justify-between border-b border-line pb-2.5">
            <h2 className="font-serif text-[18px] font-bold m-0">みんなの利き酒帳</h2>
            <a
              onClick={home.goFeed}
              className="text-[13px] text-primary font-bold cursor-pointer"
            >
              すべて見る →
            </a>
          </header>
          {home.feedItems.map((feed, i) => (
            <FeedCard key={i} feed={feed} padClass="p-5 px-6" />
          ))}
        </section>
        <MeetupSidebar home={home} />
      </div>
    </main>
  );
}
