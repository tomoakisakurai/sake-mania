'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { declareBring } from '@/app/actions/meetups';

// 持ち寄り宣言のビューモデル。かぶり判定は現在の宣言一覧から。
// useVals から移設(useVals解体 #23)。
export function useDeclareVals(meetupId: string) {
  const store = useStore();
  const meetupDetail = useStore((s) => s.meetupDetail);
  const declareBrandId = useStore((s) => s.declareBrandId);
  const { brands } = useReferenceData();

  const meId = meetupDetail?.id || meetupId;
  const brings = meetupDetail?.brings || [];
  const pickedBrand = brands.find((b) => b.id === declareBrandId);
  const taken = pickedBrand ? brings.find((x) => x.brandId === pickedBrand.id && !x.mine) : null;

  return {
    meetName: meetupDetail?.name || '',
    // 検索のかぶり判定・ひとこと初期値に使う宣言一覧(生データ)
    brings,
    picked: !!pickedBrand, pickedName: pickedBrand ? pickedBrand.name : '', pickedSub: pickedBrand ? (pickedBrand.brewery + ' / ' + pickedBrand.pref) : '',
    changeBrand: () => store.patch({ declareBrandId: null }),
    dupWarn: !!taken, dupWarnLabel: taken ? (taken.memberName + 'さんが既に持ち寄り予定です。かぶってもOKですが、変えると喜ばれるかも。') : '',
    canSubmit: !!pickedBrand,
    submit: async (note: string) => {
      const brandId = store.declareBrandId;
      if (!brandId) { store.flash('持ち寄る一本を選んでください'); return; }
      const ok = await declareBring(meId, brandId, note);
      if (!ok) { store.flash('宣言に失敗しました（ログインが必要です）'); return; }
      await Promise.all([store.loadMeetupDetail(meId), store.loadMeetups()]);
      store.openMeetup(meId);
      store.flash('持ち寄りを宣言しました');
    },
    notPicked: !pickedBrand,
    cancel: () => store.openMeetup(meId),
  };
}

export type DeclareVals = ReturnType<typeof useDeclareVals>;
