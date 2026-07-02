// 自分の記録(myRecords)から導出する統計・利き酒師ランク・実績バッジ・打点。
// Home と MyPage で共有する純関数群。
import type { Brand, MyRec } from '@/types';

export function buildMyStats(myRecords: MyRec[], brands: Brand[]) {
  const brandOf = (id: string) => brands.find((b) => b.id === id);
  const uniqBrands = new Set(myRecords.map((x) => x.brandId));
  const uniqKura = new Set(myRecords.map((x) => brandOf(x.brandId)?.brewery).filter(Boolean));
  return { statCups: myRecords.length, statBrands: uniqBrands.size, statKura: uniqKura.size };
}

export function buildMyDots(myRecords: MyRec[], brands: Brand[]) {
  return myRecords.map((x) => {
    const b = brands.find((bb) => bb.id === x.brandId);
    return { left: x.x, top: x.y, size: x.rating >= 5 ? 15 : 10, bg: x.rating >= 5 ? '#BC6A2D' : '#32507C', label: (b?.name || '').split(' ')[0] };
  });
}

const RANK_TIERS = [{ min: 0, name: '見習い' }, { min: 1, name: '利き酒入門' }, { min: 5, name: '利き酒人' }, { min: 15, name: '利き酒師' }, { min: 30, name: '利き酒名人' }, { min: 60, name: '酒仙' }];

export function buildRank(myRecords: MyRec[]) {
  const cups = myRecords.length;
  let tierIndex = 0;
  RANK_TIERS.forEach((t, i) => { if (cups >= t.min) tierIndex = i; });
  const nextTier = RANK_TIERS[tierIndex + 1];
  const rankPct = nextTier ? Math.min(100, Math.round((cups - RANK_TIERS[tierIndex].min) / (nextTier.min - RANK_TIERS[tierIndex].min) * 100)) : 100;
  return {
    rankName: RANK_TIERS[tierIndex].name,
    rankPct,
    hasNextRank: !!nextTier,
    rankNextLabel: nextTier ? ('次「' + nextTier.name + '」まで あと' + (nextTier.min - cups) + '盃') : '最高位に到達!',
    cupsCount: cups,
  };
}

export function buildBadges(myRecords: MyRec[], brands: Brand[]) {
  const brandOf = (id: string) => brands.find((b) => b.id === id);
  const cups = myRecords.length;
  const prefSet = new Set(myRecords.map((x) => brandOf(x.brandId)?.pref).filter(Boolean));
  const kuraSet = new Set(myRecords.map((x) => brandOf(x.brandId)?.brewery).filter(Boolean));
  const badgeDefs = [
    { icon: '初', label: 'はじめの一杯', on: cups >= 1 },
    { icon: '拾', label: '10盃達成', on: cups >= 10 },
    { icon: '丗', label: '30盃達成', on: cups >= 30 },
    { icon: '蔵', label: '5蔵めぐり', on: kuraSet.size >= 5 },
    { icon: '県', label: '5県制覇', on: prefSet.size >= 5 },
    { icon: '燗', label: '燗酒を嗜む', on: myRecords.some((x) => (x.temps || []).some((t) => t.indexOf('燗') !== -1)) },
    { icon: '写', label: 'ラベル写真家', on: myRecords.some((x) => x.photo) },
    { icon: '全', label: '全国制覇', on: prefSet.size >= 47 },
  ];
  return {
    badges: badgeDefs.map((b) => ({ icon: b.icon, label: b.label, bg: b.on ? '#32507C' : '#EFEAE0', color: b.on ? '#FDFBF5' : '#BCB29D', labelColor: b.on ? '#2E2A24' : '#A89D8A' })),
    achievedCount: badgeDefs.filter((b) => b.on).length,
    badgeTotal: badgeDefs.length,
    badgePref: prefSet.size,
    badgeKura: kuraSet.size,
  };
}
