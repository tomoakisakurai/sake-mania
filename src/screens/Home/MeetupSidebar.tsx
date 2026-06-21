import type { Vals } from '@/useVals';
import { NextMeetupCard } from './NextMeetupCard';
import { VotingCard } from './VotingCard';
import { PastMeetups } from './PastMeetups';
import { PopularBrands } from './PopularBrands';

// ホーム右カラム(PCのみ): 次回MEETUP/投票カード + 過去のふりかえり + 今週の人気銘柄
// SPでは「次回」「投票」はSpMeetupCardsで上部に表示しているのでここからは省く
export function MeetupSidebar({ vals }: { vals: Vals }) {
  return (
    <aside className="flex flex-col gap-4">
      {vals.isDesktopNav && (
        <>
          <NextMeetupCard vals={vals} />
          <VotingCard vals={vals} />
        </>
      )}
      <PastMeetups vals={vals} />
      <PopularBrands vals={vals} />
    </aside>
  );
}
