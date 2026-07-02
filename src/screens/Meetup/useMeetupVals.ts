'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { cancelBring } from '@/app/actions/meetups';

// MEETUP詳細のビューモデル。フェーズ判定 / 出欠 / 持ち寄りラインナップ /
// MVP / 投票 / 幹事操作。useVals から移設(useVals解体 #23)。
export function useMeetupVals(meetupId: string) {
  const store = useStore();
  const meetupDetail = useStore((s) => s.meetupDetail);
  const { brands } = useReferenceData();
  const byId = (id: string | null | undefined) => brands.find((b) => b.id === id);

  const meId = meetupDetail?.id || meetupId;
  const phase = meetupDetail?.phase || 'before';
  const isBefore = phase === 'before';
  const isVoting = phase === 'voting';
  const isClosed = phase === 'closed';
  const showLineup = !isBefore;
  const isHost = !!meetupDetail?.isHost;
  const goingAvatars = (meetupDetail?.attendees || []).slice(0, 10).map((a) => ({ avatar: a.avatar, bg: a.avatarBg, name: a.name }));
  const allBring = meetupDetail?.brings || [];
  const brandCounts: Record<string, number> = {};
  allBring.forEach((b) => { brandCounts[b.brandId] = (brandCounts[b.brandId] || 0) + 1; });
  const bringList = allBring.map((b) => {
    const br = byId(b.brandId);
    return { brandId: b.brandId, memberName: b.memberName, avatar: b.avatar, avatarBg: b.avatarBg, mine: !!b.mine, brandName: br?.name ?? '', brandSub: br ? br.brewery + ' / ' + br.pref : '', note: b.note || '', dup: brandCounts[b.brandId] > 1, brandClick: () => store.openDetail(b.brandId) };
  });
  const voteCounts: Record<string, number> = meetupDetail?.voteCounts || {};
  const myVote = meetupDetail?.myVoteBrandId || null;
  const totalVotes = Object.values(voteCounts).reduce((a: number, n: number) => a + n, 0);
  // ラインナップ = 持ち寄られた酒、得票数順
  const sortedLineup = showLineup ? allBring.slice().sort((a, b) => (voteCounts[b.brandId] || 0) - (voteCounts[a.brandId] || 0)) : [];
  const mvpBrandId = sortedLineup.length ? sortedLineup[0].brandId : null;

  return {
    id: meId, name: meetupDetail?.name || '', dateLabel: meetupDetail?.dateLabel || '', place: meetupDetail?.place || '', theme: meetupDetail?.theme || '',
    hostName: meetupDetail?.hostName || '',
    isBefore, isVoting, isClosed, showLineup,
    isHost, hostCanStart: isBefore && isHost, hostCanClose: isVoting && isHost,
    startVoting: () => store.setPhase(meId, 'voting'),
    closeVoting: () => store.setPhase(meId, 'closed'),
    voteDeadline: meetupDetail?.voteDeadline || '',
    phaseLabel: isVoting ? '投票受付中' : isClosed ? '結果確定' : '開催前',
    mvpLabel: isVoting ? '★ 暫定トップ（投票受付中）' : '★ その日のMVP酒 — 最多得票',
    iGo: !!meetupDetail?.iGoing, goCount: meetupDetail?.goingCount || 0, attendees: meetupDetail?.goingCount || 0,
    goingAvatars,
    bringList, bringCount: allBring.length,
    hasBring: allBring.length > 0,
    hasDup: Object.keys(brandCounts).some((k) => brandCounts[k] > 1),
    myDeclared: !!meetupDetail?.myBringBrandId, notMyDeclared: !meetupDetail?.myBringBrandId,
    declareClick: () => store.openDeclare(meId),
    declareLabel: meetupDetail?.myBringBrandId ? '持ち寄りを変更する' : '自分の一本を宣言する',
    cancelDeclare: async () => {
      await cancelBring(meId);
      await Promise.all([store.loadMeetupDetail(meId), store.loadMeetups()]);
    },
    backHome: () => store.nav('home'),
    totalVotesLabel: totalVotes + '票',
    myVoted: !!myVote,
    canVote: isVoting,
    lineup: sortedLineup.map((l, i) => {
      const br = byId(l.brandId);
      const vc = voteCounts[l.brandId] || 0;
      const voted = myVote === l.brandId;
      return { rank: i + 1, rankLabel: ['壱', '弐', '参', '四', '五'][i] || (i + 1), isMvp: mvpBrandId === l.brandId, brandName: br?.name ?? '', brandSub: br ? br.brewery + ' / ' + br.pref : '', broughtBy: l.memberName, avatar: l.avatar, avatarBg: l.avatarBg, votes: vc + '票', comment: l.note || '', brandClick: () => store.openDetail(l.brandId), canVote: isVoting, voted, voteLabel: voted ? '投票済み ✓' : 'MVPに投票', voteClick: () => store.voteMvp(meId, l.brandId) };
    }),
    mvp: showLineup && mvpBrandId ? (() => { const br = byId(mvpBrandId); const lp = allBring.find((x) => x.brandId === mvpBrandId); return { brandName: br?.name ?? '', brandSub: br ? br.brewery + ' / ' + br.pref : '', broughtBy: lp?.memberName || '', votesLabel: (voteCounts[mvpBrandId] || 0) + '票', comment: lp?.note || '', brandClick: () => store.openDetail(mvpBrandId) }; })() : { brandName: '', brandSub: '', broughtBy: '', votesLabel: '', comment: '', brandClick: () => {} },
  };
}

export type MeetupVals = ReturnType<typeof useMeetupVals>;
