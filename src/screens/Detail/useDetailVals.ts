'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import { starStr } from '@/lib/format';
import type { Brand } from '@/types';

const EMPTY_BRAND: Brand = { id: '', name: '', brewery: '', pref: '', cls: '', polish: '', rice: '', yeast: '', smv: '', abv: '', temp: '', x: 0, y: 0, rating: 0, count: 0, tags: [], desc: '' };

// 銘柄詳細のビューモデル。useVals から移設(useVals解体 #27)。
export function useDetailVals(detailId: string) {
  const store = useStore();
  const myRecords = useStore((s) => s.myRecords);
  const wantIds = useStore((s) => s.wantIds);
  const { brands, others } = useReferenceData();

  const brand = brands.find((b) => b.id === detailId) || brands[0] || EMPTY_BRAND;
  const myRecord = myRecords.find((x) => x.brandId === brand.id);
  // 自分の記録 + シードレビュー(others)を「この銘柄の利き酒帳」として並べる
  const reviews = myRecords.filter((x) => x.brandId === brand.id).map((x) => ({ user: 'あなた', date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)' }))
    .concat(others.filter((o) => o.brandId === brand.id).map((o) => ({ user: o.user, date: o.date, stars: starStr(o.rating), memo: o.memo })));
  const wanted = wantIds.indexOf(brand.id) !== -1;
  const shopQuery = encodeURIComponent(brand.name);
  const shops = [
    { label: '楽天市場', mark: 'R', markColor: '#BF0000', url: 'https://search.rakuten.co.jp/search/mall/' + shopQuery + '/' },
    { label: 'Amazon', mark: 'a', markColor: '#FF9900', url: 'https://www.amazon.co.jp/s?k=' + shopQuery },
    { label: 'Yahoo!ショッピング', mark: 'Y', markColor: '#FF0033', url: 'https://shopping.yahoo.co.jp/search?p=' + shopQuery },
    { label: '正規特約店をさがす', mark: '蔵', markColor: '#32507C', url: 'https://www.google.com/search?q=' + encodeURIComponent(brand.name + ' 特約店') },
  ];

  return {
    brand: { name: brand.name, brewery: brand.brewery, pref: brand.pref, class: brand.cls, polish: brand.polish, rice: brand.rice, yeast: brand.yeast, smv: brand.smv, abv: brand.abv, temp: brand.temp, desc: brand.desc, x: brand.x, y: brand.y, rating: brand.rating.toFixed(1), count: brand.count },
    stars: starStr(Math.round(brand.rating)),
    photo: brand.photo || null,
    breweryClick: () => store.openKura(brand.brewery),
    recordClick: () => { store.patch({ fromDetail: true }); store.startRecord(brand.id); },
    wanted,
    wantLabel: wanted ? '飲みたいリスト追加済 ✓' : '飲みたいリストへ',
    wantClick: () => { if (!store.requireLogin()) return; store.patch({ wantIds: wanted ? wantIds.filter((x) => x !== brand.id) : wantIds.concat([brand.id]) }); },
    hasMyPoint: !!myRecord, myX: myRecord ? myRecord.x : 0, myY: myRecord ? myRecord.y : 0,
    reviews, shops,
  };
}

export type DetailVals = ReturnType<typeof useDetailVals>;
