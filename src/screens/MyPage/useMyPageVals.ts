'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { buildMyStats, buildMyDots, buildRank, buildBadges } from '@/lib/myRecordsModel';
import { starStr } from '@/lib/format';
import type { Brand } from '@/types';

// マイページのビューモデル。useVals から移設(useVals解体 #29)。
export function useMyPageVals() {
  const store = useStore();
  const myRecords = useStore((s) => s.myRecords);
  const wantIds = useStore((s) => s.wantIds);
  const user = useStore((s) => s.user);
  const { brands } = useReferenceData();
  const brandOf = (id: string) => brands.find((b) => b.id === id);

  const myList = myRecords.map((x, i) => {
    const b = brandOf(x.brandId);
    return { recordId: x.recordId, name: b?.name ?? '', sub: b ? b.brewery + ' / ' + b.pref : '', date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)', tags: x.temps.concat(x.pairing ? ['肴: ' + x.pairing] : []), photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo, click: () => store.openPost({ src: 'mine', i }) };
  });
  const wantList = wantIds.map((id) => brandOf(id)).filter((b): b is Brand => Boolean(b)).map((b) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref, click: () => store.openDetail(b.id), buyUrl: 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(b.name) + '/' }));

  return {
    userName: user?.name ?? '',
    userAvatar: user?.avatar ?? '',
    ...buildMyStats(myRecords, brands),
    ...buildRank(myRecords),
    ...buildBadges(myRecords, brands),
    myDots: buildMyDots(myRecords, brands),
    myList,
    wantList,
  };
}

export type MyPageVals = ReturnType<typeof useMyPageVals>;
