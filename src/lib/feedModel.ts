// みんなの利き酒帳(フィード)のビューモデル構築。
// Feed画面(useFeedItems)・Home(useHomeVals)・Post詳細(usePostVals)から
// 使う共有ロジック。Reactに依存しない純関数として実装する。
import type { MouseEvent } from 'react';
import type { useStore } from '@/store';
import type { Brand, PostRef } from '@/types';
import { starStr, subOf } from './format';

// socialOf/mkFeed が読む記録のフィールド(PublicRec/MyRec/OtherRec が満たす最小構造)
export type SocialRec = { recordId: string; nomi?: number; liked?: boolean; commentCount?: number };
export type FeedSourceRec = SocialRec & { brandId: string; rating: number; memo: string; temps: string[]; pairing: string; photo?: string | null };
export type FeedWho = { user: string; mine: string; avatar: string; avatarBg: string };

type Store = ReturnType<typeof useStore.getState>;

const EMPTY_BRAND = { id: '', name: '', brewery: '', pref: '', cls: '' } as Brand;

/** のみたいね/コメントの数。押下後はストアのマップを優先、未取得時はレコード同梱の値(=フィードの数字が遅れない) */
export function socialOf(store: Store, x: SocialRec) {
  const liked = (x.recordId in store.myNomi) ? store.myNomi[x.recordId] : !!x.liked;
  const nomi = (x.recordId in store.nomiCounts) ? store.nomiCounts[x.recordId] : (x.nomi || 0);
  const loaded = store.commentsByRecordId[x.recordId];
  const commentCount = loaded ? loaded.length : (x.commentCount || 0);
  return { liked, nomi, comments: loaded || [], commentCount };
}

/** フィード1件分のビューモデル */
export function mkFeedItem(store: Store, brands: Brand[], currentUserName: string, x: FeedSourceRec, who: FeedWho, time: string, ref: PostRef) {
  const b = brands.find((bb) => bb.id === x.brandId) || EMPTY_BRAND;
  const so = socialOf(store, x);
  const isOther = who.user !== currentUserName;
  return {
    user: who.user, mine: who.mine || '', avatar: who.avatar, avatarBg: who.avatarBg, time,
    stars: starStr(x.rating), name: b.name, sub: subOf(b), memo: x.memo || '(メモなし)',
    tags: (x.temps || []).concat(x.pairing ? ['肴: ' + x.pairing] : []),
    photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo,
    canNomi: isOther, cantNomi: !isOther,
    nomiCount: so.nomi, commentCount: so.commentCount, nomiLiked: so.liked,
    nomiClick: (e: MouseEvent) => { e.stopPropagation(); store.toggleNomi(x.recordId); },
    click: () => store.openPost(ref),
    brandClick: (e: MouseEvent) => { e.stopPropagation(); store.openDetail(b.id); },
  };
}

/** みんなの利き酒帳 = 公開記録(全ユーザー)のみ。サンプル投稿(others)は出さない。 */
export function buildFeedItems(store: Store, brands: Brand[], currentUserName: string) {
  return store.publicRecords.map((pr, i) =>
    mkFeedItem(store, brands, currentUserName, pr, { user: pr.user, mine: pr.mine ? '(あなた)' : '', avatar: pr.avatar, avatarBg: pr.avatarBg }, pr.date, { src: 'public', i }));
}

export type FeedItem = ReturnType<typeof buildFeedItems>[number];
