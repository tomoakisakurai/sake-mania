import type { HomeVals } from './useHomeVals';
import { NextMeetupCard } from './NextMeetupCard';
import { VotingCard } from './VotingCard';
import { PastMeetups } from './PastMeetups';
import { PopularBrands } from './PopularBrands';

// ホーム右カラム(PCのみ): 次回MEETUP/投票カード + 過去のふりかえり + 今週の人気銘柄
// SPでは「次回」「投票」はSpMeetupCardsで上部に表示しているのでここからは省く
export function MeetupSidebar({ home }: { home: HomeVals }) {
  return (
    <aside className="flex flex-col gap-4">
      {/* SPでは「次回」「投票」はSpMeetupCardsで上部表示するためPCのみ */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <NextMeetupCard home={home} />
        <VotingCard home={home} />
      </div>
      <PastMeetups home={home} />
      <PopularBrands home={home} />
    </aside>
  );
}
