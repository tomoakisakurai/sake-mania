'use client';
import { useStore } from '@/store';
import { useReferenceData } from '@/components/Providers';
import type { PostRef, PostVM, MyRec, PublicRec, OtherRec } from '@/types';
import { addComment as addCommentAction, deleteComment as deleteCommentAction } from '@/app/actions/social';
import { setRecordPublic as setRecordPublicAction, deleteRecord as deleteRecordAction } from '@/app/actions/records';
import { socialOf } from '@/lib/feedModel';
import { starStr } from '@/lib/format';

const noop = () => {};
// 該当記録が見つからない場合のフォールバック(読み込み中/URL不正)。
export const EMPTY_POST: PostVM = {
  user: '', mine: '', avatar: '', avatarBg: '', timePlace: '',
  canPublish: false, isPublic: false, publishLabel: '', publishToggle: noop, canDelete: false, deleteClick: noop,
  brandName: '', brewery: '', brandSubRest: '',
  kuraClick: noop, stars: '', ratingNum: '',
  x: null, y: null, bx: 0, by: 0,
  sweet: 50, sweetLabel: '', tasteLabel: '',
  temps: '', pairing: '', memo: '',
  photo: '', hasPhoto: false, noPhoto: true,
  brandClick: noop, recordClick: noop,
  canNomi: false, cantNomi: true,
  nomiCount: 0, nomiLiked: false, nomiClick: noop,
  comments: [], commentCount: 0, hasComments: false,
  commentSend: (_draft: string) => {},
};

// 投稿詳細のビューモデル。useVals から移設(useVals解体 #25)。
export function usePostVals(postRef: PostRef | null): PostVM {
  const store = useStore();
  const { brands, others } = useReferenceData();
  // 未ログイン時は空の表示名にフォールバック(モックユーザー名を漏らさない)
  const currentUser = store.user || { name: '', avatar: '' };
  const me = { user: currentUser.name, avatar: currentUser.avatar, avatarBg: '#DDD3BE' };

  if (!postRef) return EMPTY_POST;
  const px: MyRec | PublicRec | OtherRec | undefined =
    postRef.src === 'mine' ? store.myRecords[postRef.i]
    : postRef.src === 'public' ? store.publicRecords[postRef.i]
    : others[postRef.i];
  if (!px) return EMPTY_POST;

  const pb = brands.find((b) => b.id === px.brandId);
  const pxMine = postRef.src === 'public' && (px as PublicRec).mine;
  const isMine = postRef.src === 'mine' || pxMine;
  // 公開トグル可能なのは本人のDBレコードのみ(シードのothersは不可)
  const isOwnDbRecord = isMine;
  const recPublicNow = postRef.src === 'public' ? true : (postRef.src === 'mine' ? !!(px as MyRec).isPublic : false);
  const pxX = px.x;
  const pxY = px.y;
  const pxPhoto = 'photo' in px ? (px.photo ?? '') : '';
  const pxUser = postRef.src !== 'mine' ? (px as PublicRec | OtherRec).user : '';
  const pxAvatar = postRef.src !== 'mine' ? (px as PublicRec | OtherRec).avatar : '';
  const pxAvatarBg = postRef.src !== 'mine' ? (px as PublicRec | OtherRec).avatarBg : '';
  const pxTimePlace = postRef.src === 'mine'
    ? px.date + ' ・ 自分の記録'
    : postRef.src === 'public'
      ? px.date + ' ・ ' + pxUser + ' さんの記録'
      : (px as OtherRec).time + ' ・ ' + (px as OtherRec).place;
  const pso = socialOf(store, px);

  return {
    user: isMine ? me.user : pxUser, mine: isMine ? '(あなた)' : '',
    avatar: isMine ? me.avatar : pxAvatar, avatarBg: isMine ? me.avatarBg : pxAvatarBg,
    timePlace: pxTimePlace,
    canPublish: isOwnDbRecord, isPublic: recPublicNow,
    publishLabel: recPublicNow ? '公開中 — 非公開にする' : 'みんなの利き酒帳に公開する',
    publishToggle: async () => {
      const ok = await setRecordPublicAction(px.recordId, !recPublicNow);
      if (!ok) { store.flash('変更に失敗しました'); return; }
      await Promise.all([store.loadMyRecords(), store.loadPublicRecords()]);
      await store.loadSocial();
      store.flash(!recPublicNow ? 'みんなの利き酒帳に公開しました' : '公開を取り消しました');
    },
    canDelete: isOwnDbRecord,
    deleteClick: async () => {
      if (!window.confirm('この記録を削除しますか?')) return;
      const ok = await deleteRecordAction(px.recordId);
      if (!ok) { store.flash('削除に失敗しました'); return; }
      store.patch({
        myRecords: store.myRecords.filter((r) => r.recordId !== px.recordId),
        publicRecords: store.publicRecords.filter((r) => r.recordId !== px.recordId),
      });
      store.flash('記録を削除しました');
      store.nav('mypage');
    },
    brandName: pb?.name ?? '', brewery: pb?.brewery ?? '', brandSubRest: (pb?.pref ?? '') + ' — ' + (pb?.cls ?? ''),
    kuraClick: () => { if (pb) store.openKura(pb.brewery); }, stars: starStr(px.rating), ratingNum: px.rating.toFixed(1),
    x: pxX, y: pxY, bx: pb?.x ?? 0, by: pb?.y ?? 0,
    sweet: px.sweet, sweetLabel: px.sweet < 35 ? '甘口寄り' : px.sweet > 65 ? '辛口寄り' : '中口',
    tasteLabel: ((pxX ?? 50) > 58 ? '濃醇' : (pxX ?? 50) < 42 ? '淡麗' : '中庸') + '・' + ((pxY ?? 50) < 42 ? '香り高い' : (pxY ?? 50) > 58 ? '穏やか' : 'バランス型'),
    temps: (px.temps && px.temps.length) ? px.temps.join('・') : '未記入',
    pairing: px.pairing || '未記入', memo: px.memo || '(メモなし)',
    photo: pxPhoto, hasPhoto: !!pxPhoto, noPhoto: !pxPhoto,
    brandClick: () => { if (pb) store.openDetail(pb.id); },
    recordClick: () => { store.patch({ fromDetail: false }); store.startRecord(pb?.id ?? null); },
    canNomi: !isMine, cantNomi: isMine,
    nomiCount: pso.nomi,
    nomiLiked: pso.liked,
    nomiClick: () => store.toggleNomi(px.recordId),
    comments: (store.commentsByRecordId[px.recordId] || []).map((c) => ({
      id: c.id,
      user: c.user, avatar: c.avatar, avatarBg: c.avatarBg,
      time: c.time + (c.edited ? ' ・ 編集済' : ''), text: c.text,
      canEdit: c.mine,
      initEditDraft: c.text,
      deleteClick: async () => { const ok = await deleteCommentAction(c.id); if (ok) await store.loadSocial(); },
    })),
    commentCount: pso.commentCount, hasComments: pso.commentCount > 0,
    commentSend: async (draft: string) => {
      const t = draft.trim();
      if (!t) return;
      if (!store.requireLogin()) return;
      const ok = await addCommentAction(px.recordId, t);
      if (!ok) { store.flash('コメントの送信に失敗しました'); return; }
      await store.loadSocial();
    },
  };
}
