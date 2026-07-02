'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { buildFeedItems } from '@/lib/feedModel';
import { buildMyStats, buildMyDots } from '@/lib/myRecordsModel';
import { subOf } from '@/lib/format';

// ホーム画面のビューモデル。useVals から移設(useVals解体 #29)。
export function useHomeVals() {
  const store = useStore();
  const myRecords = useStore((s) => s.myRecords);
  const meetupList = useStore((s) => s.meetupList);
  const { brands } = useReferenceData();

  const stats = buildMyStats(myRecords, brands);
  const myDots = buildMyDots(myRecords, brands);
  const currentUserName = store.user?.name ?? '';
  const feedItems = buildFeedItems(store, brands, currentUserName).slice(0, 3);

  // 人気銘柄ランキング(記録数上位4)
  const ranking = brands.slice().sort((a, b) => b.count - a.count).slice(0, 4).map((b, i) => ({ rank: ['壱', '弐', '参', '四'][i], color: i === 0 ? '#BC6A2D' : '#8B8273', name: b.name, brewery: b.brewery + ' / ' + b.pref, count: b.count + '記録', click: () => store.openDetail(b.id) }));

  const today = brands.find((b) => b.id === 'kuheiji') || brands[0];

  // ===== SAKE MEETUP(DB由来) =====
  const shortOf = (dl: string) => (dl || '').split('(')[0].split(' ')[0];
  const nextMeet = meetupList
    .filter((m) => m.phase === 'before')
    .sort((a, b) => {
      if (!a.eventDate && !b.eventDate) return 0;
      if (!a.eventDate) return 1;
      if (!b.eventDate) return -1;
      return a.eventDate < b.eventDate ? -1 : a.eventDate > b.eventDate ? 1 : 0;
    })[0] ?? null;
  const homeNext = nextMeet ? {
    name: nextMeet.name, dateLabel: nextMeet.dateLabel, place: nextMeet.place, theme: nextMeet.theme,
    goingLabel: nextMeet.goingCount + '人が参加予定',
    bringLabel: nextMeet.bringCount + '本が宣言済み',
    click: () => store.openMeetup(nextMeet.id),
  } : null;
  const homePast = meetupList.filter((m) => m.phase === 'voting' || m.phase === 'closed').map((m) => ({
    name: m.name, dateShort: shortOf(m.dateLabel), theme: m.theme,
    isVoting: m.phase === 'voting', notVoting: m.phase !== 'voting',
    click: () => store.openMeetup(m.id),
  }));
  const votingMeet = meetupList.find((m) => m.phase === 'voting');
  const homeVoting = votingMeet ? { name: votingMeet.name, deadline: votingMeet.voteDeadline || '', click: () => store.openMeetup(votingMeet.id) } : null;

  return {
    ...stats,
    myDots,
    feedItems,
    ranking,
    today: today ? { name: today.name, sub: subOf(today) } : { name: '', sub: '' },
    todayClick: () => { if (today) store.openDetail(today.id); },
    goFeed: () => store.nav('feed'),
    openMeetupCreate: () => store.openMeetupCreate(),
    homeNext, homePast, homeVoting, hasVoting: !!homeVoting,
  };
}

export type HomeVals = ReturnType<typeof useHomeVals>;
