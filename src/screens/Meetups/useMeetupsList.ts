'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';

// SAKE MEETUP 一覧(hub画面)のビューモデル。フェーズ別にバッジ・統計・CTAを
// 出し分ける。useVals から移設(useVals解体 #20)。
export function useMeetupsList() {
  const store = useStore();
  const meetupList = useStore((s) => s.meetupList);
  const { brands } = useReferenceData();
  return meetupList.map((m) => {
    const mvp = m.mvpBrandId ? brands.find((b) => b.id === m.mvpBrandId) : undefined;
    return {
      meetupId: m.id,
      phaseLabel: m.phase === 'voting' ? '投票受付中' : m.phase === 'closed' ? '結果確定' : '開催前',
      name: m.name, eventDate: m.eventDate, dateLabel: m.dateLabel, place: m.place, theme: m.theme,
      isUpcoming: m.phase === 'before', isVoting: m.phase === 'voting', isClosed: m.phase === 'closed',
      iGoing: m.iGoing, goingCount: m.goingCount, bringCount: m.bringCount,
      voteDeadline: m.voteDeadline || '',
      hasMvp: !!mvp, mvpName: mvp ? mvp.name : '',
      click: () => store.openMeetup(m.id),
    };
  });
}

export type MeetupListItem = ReturnType<typeof useMeetupsList>[number];
