// Faithful port of the Claude Design prototype's renderVals(): builds the full
// view-model object consumed by every screen. Mirrors the prototype 1:1.
import type { ChangeEvent, MouseEvent } from 'react';
import { useStore } from './store';
import type { RouteState } from '@/lib/routes';
import type { ReferenceData } from '@/lib/getReferenceData';
import type { Brand, Bar, PostRef, MyRec, PublicRec, OtherRec, PostVM } from '@/types';
import { buildNavModel } from '@/lib/nav';
import { addComment as addCommentAction, deleteComment as deleteCommentAction } from '@/app/actions/social';
import { declareBring, cancelBring } from '@/app/actions/meetups';
import { setRecordPublic as setRecordPublicAction, deleteRecord as deleteRecordAction } from '@/app/actions/records';

// 入力系(input/textarea)のonChangeで使う共通イベント型
type ChangeEv = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

// byId/bars.find が見つからない場合のフォールバック（プロトタイプ移植時のnull回避を型安全に）
const EMPTY_BRAND: Brand = { id: '', name: '', brewery: '', pref: '', cls: '', polish: '', rice: '', yeast: '', smv: '', abv: '', temp: '', x: 0, y: 0, rating: 0, count: 0, tags: [], desc: '' };
const EMPTY_BAR: Bar = { id: '', name: '', area: '', type: '', venueQ: '', brands: [], note: '' };
const noop = () => {};
const EMPTY_POST: PostVM = {
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
  nomiCount: 0, nomiBg: '', nomiColor: '', nomiClick: noop,
  comments: [], commentCount: 0, hasComments: false,
  commentSend: (_draft: string) => {},
};

// socialOf/mkFeed が読む記録のフィールド（PublicRec/MyRec/OtherRec が満たす最小構造）
type SocialRec = { recordId: string; nomi?: number; liked?: boolean; commentCount?: number };
type FeedSourceRec = SocialRec & { brandId: string; rating: number; memo: string; temps: string[]; pairing: string; photo?: string | null };
type FeedWho = { user: string; mine: string; avatar: string; avatarBg: string };

const starStr = (n: number) => {
  const k = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return '★'.repeat(k) + '☆'.repeat(5 - k);
};

export function useVals(route: RouteState, ref: ReferenceData) {
  const store = useStore();
  const rec = store.rec;
  const isMobile = store.vw < 760;
  const { brands, others, members, meetups, bars, prefGrid, kuraMeta } = ref;
  const byId = (id: string | null | undefined) => brands.find((b) => b.id === id);
  const memberOf = (name: string) =>
    members.find((m) => m.name === name) || { name, display: name, avatar: (name || '?').charAt(0), avatarBg: '#DDD3BE' };

  const subOf = (b: Brand) => b.brewery + ' / ' + b.pref + ' — ' + b.cls;

  // nav / tab のビューモデル（lib/nav.ts に集約。Nav と TabBar が共有）
  const { navItems, tabLeft, tabRight } = buildNavModel(route, store);

  // stats
  const uniqBrands = new Set(store.myRecords.map((x) => x.brandId));
  const uniqKura = new Set(store.myRecords.map((x) => (byId(x.brandId) || EMPTY_BRAND).brewery));

  // map dots
  const myDots = store.myRecords.map((x) => {
    const b = byId(x.brandId) || EMPTY_BRAND;
    return { left: x.x, top: x.y, size: x.rating >= 5 ? 15 : 10, bg: x.rating >= 5 ? '#BC6A2D' : '#32507C', label: (b.name || '').split(' ')[0] };
  });

  // feed
  const currentUser = store.user || { name: 'yuu_sake_log', avatar: '悠' };
  const yuuWho = { user: currentUser.name, mine: '(あなた)', avatar: currentUser.avatar, avatarBg: '#DDD3BE' };

  const socialOf = (x: SocialRec) => {
    // 押下後はストアのマップを優先、未取得時はレコード同梱の値（=フィードの数字が遅れない）
    const liked = (x.recordId in store.myNomi) ? store.myNomi[x.recordId] : !!x.liked;
    const nomi = (x.recordId in store.nomiCounts) ? store.nomiCounts[x.recordId] : (x.nomi || 0);
    const loaded = store.commentsByRecordId[x.recordId];
    const commentCount = loaded ? loaded.length : (x.commentCount || 0);
    return { liked, nomi, comments: loaded || [], commentCount };
  };
  const mkFeed = (x: FeedSourceRec, who: FeedWho, time: string, ref: PostRef) => {
    const b = byId(x.brandId) || EMPTY_BRAND;
    const so = socialOf(x);
    const isOther = who.user !== yuuWho.user;
    return { user: who.user, mine: who.mine || '', avatar: who.avatar, avatarBg: who.avatarBg, time, stars: starStr(x.rating), name: b.name, sub: subOf(b), memo: x.memo || '(メモなし)', tags: (x.temps || []).concat(x.pairing ? ['肴: ' + x.pairing] : []), photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo, canNomi: isOther, cantNomi: !isOther, nomiCount: so.nomi, commentCount: so.commentCount, nomiBg: so.liked ? '#BC6A2D' : '#FDFBF5', nomiColor: so.liked ? '#FDFBF5' : '#BC6A2D', nomiClick: (e: MouseEvent) => { e.stopPropagation(); store.toggleNomi(x.recordId); }, click: () => store.openPost(ref), brandClick: (e: MouseEvent) => { e.stopPropagation(); store.openDetail(b.id); } };
  };
  // みんなの利き酒帳 = 公開記録（全ユーザー）のみ。サンプル投稿(others)は出さない。
  const allFeed = store.publicRecords.map((pr, i) =>
    mkFeed(pr, { user: pr.user, mine: pr.mine ? '(あなた)' : '', avatar: pr.avatar, avatarBg: pr.avatarBg }, pr.date, { src: 'public', i }));

  // post detail
  let post: PostVM | null = null;
  const prf = route.postRef;
  if (prf) {
    const px: MyRec | PublicRec | OtherRec =
      prf.src === 'mine' ? store.myRecords[prf.i]
      : prf.src === 'public' ? store.publicRecords[prf.i]
      : others[prf.i];
    if (px) {
      const pb = byId(px.brandId) || EMPTY_BRAND;
      const pxMine = prf.src === 'public' && (px as PublicRec).mine;
      const isMine = prf.src === 'mine' || pxMine;
      // 公開トグル可能なのは本人のDBレコードのみ（シードのothersは不可）
      const isOwnDbRecord = isMine;
      const recPublicNow = prf.src === 'public' ? true : (prf.src === 'mine' ? !!(px as MyRec).isPublic : false);
      const pxX = px.x;
      const pxY = px.y;
      const pxPhoto = 'photo' in px ? (px.photo ?? '') : '';
      const pxUser = prf.src !== 'mine' ? (px as PublicRec | OtherRec).user : '';
      const pxAvatar = prf.src !== 'mine' ? (px as PublicRec | OtherRec).avatar : '';
      const pxAvatarBg = prf.src !== 'mine' ? (px as PublicRec | OtherRec).avatarBg : '';
      const pxTimePlace = prf.src === 'mine'
        ? px.date + ' ・ 自分の記録'
        : prf.src === 'public'
          ? px.date + ' ・ ' + pxUser + ' さんの記録'
          : (px as OtherRec).time + ' ・ ' + (px as OtherRec).place;
      const pso = socialOf(px);
      post = {
        user: isMine ? yuuWho.user : pxUser, mine: isMine ? '(あなた)' : '',
        avatar: isMine ? yuuWho.avatar : pxAvatar, avatarBg: isMine ? yuuWho.avatarBg : pxAvatarBg,
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
        brandName: pb.name, brewery: pb.brewery, brandSubRest: pb.pref + ' — ' + pb.cls,
        kuraClick: () => store.openKura(pb.brewery), stars: starStr(px.rating), ratingNum: px.rating.toFixed(1),
        x: pxX, y: pxY, bx: pb.x, by: pb.y,
        sweet: px.sweet, sweetLabel: px.sweet < 35 ? '甘口寄り' : px.sweet > 65 ? '辛口寄り' : '中口',
        tasteLabel: ((pxX ?? 50) > 58 ? '濃醇' : (pxX ?? 50) < 42 ? '淡麗' : '中庸') + '・' + ((pxY ?? 50) < 42 ? '香り高い' : (pxY ?? 50) > 58 ? '穏やか' : 'バランス型'),
        temps: (px.temps && px.temps.length) ? px.temps.join('・') : '未記入',
        pairing: px.pairing || '未記入', memo: px.memo || '(メモなし)',
        photo: pxPhoto, hasPhoto: !!pxPhoto, noPhoto: !pxPhoto,
        brandClick: () => store.openDetail(pb.id),
        recordClick: () => { store.patch({ fromDetail: false }); store.startRecord(pb.id); },
        canNomi: !isMine, cantNomi: isMine,
        nomiCount: pso.nomi,
        nomiBg: pso.liked ? '#BC6A2D' : '#FDFBF5',
        nomiColor: pso.liked ? '#FDFBF5' : '#BC6A2D',
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
  }

  // ranking
  const ranking = brands.slice().sort((a, b) => b.count - a.count).slice(0, 4).map((b, i) => ({ rank: ['壱', '弐', '参', '四'][i], color: i === 0 ? '#BC6A2D' : '#8B8273', name: b.name, brewery: b.brewery + ' / ' + b.pref, count: b.count + '記録', click: () => store.openDetail(b.id) }));

  const today = byId('kuheiji') || brands[0] || EMPTY_BRAND;

  // detail
  const d = byId(route.detailId) || brands[0];
  const myRecForD = store.myRecords.find((x) => x.brandId === d.id);
  const dReviews = store.myRecords.filter((x) => x.brandId === d.id).map((x) => ({ user: 'あなた', date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)' }))
    .concat(others.filter((o) => o.brandId === d.id).map((o) => ({ user: o.user, date: o.date, stars: starStr(o.rating), memo: o.memo })));
  const wanted = store.wantIds.indexOf(d.id) !== -1;
  const shopQ = encodeURIComponent(d.name);
  const dShop = [
    { label: '楽天市場', mark: 'R', markColor: '#BF0000', url: 'https://search.rakuten.co.jp/search/mall/' + shopQ + '/' },
    { label: 'Amazon', mark: 'a', markColor: '#FF9900', url: 'https://www.amazon.co.jp/s?k=' + shopQ },
    { label: 'Yahoo!ショッピング', mark: 'Y', markColor: '#FF0033', url: 'https://shopping.yahoo.co.jp/search?p=' + shopQ },
    { label: '正規特約店をさがす', mark: '蔵', markColor: '#32507C', url: 'https://www.google.com/search?q=' + encodeURIComponent(d.name + ' 特約店') },
  ];

  // record flow
  const rq = (rec.query || '').trim();
  const recResults = brands.filter((b) => !rq || (b.name + b.brewery + b.pref).indexOf(rq) !== -1).slice(0, 6)
    .map((b) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref + ' — ' + b.cls, click: () => store.setRec({ brandId: b.id, step: 2 }) }));
  const recBrand = byId(rec.brandId);
  const stepLabels = ['銘柄', '味わい', '合わせ', 'メモ'];
  const recSteps = stepLabels.map((lb, i) => {
    const n = i + 1;
    const done = rec.step > n, cur = rec.step === n;
    return { n, label: lb, bg: cur ? '#32507C' : done ? '#DDD3BE' : '#FDFBF5', color: cur ? '#FDFBF5' : done ? '#5C5547' : '#A89D8A', border: cur || done ? '1px solid transparent' : '1px solid #E3DBCB', labelColor: cur ? '#2E2A24' : '#A89D8A', weight: cur ? 700 : 400 };
  });
  const titles = [
    ['どの銘柄を飲みましたか?', '図鑑から検索。見つからなければ自由入力も(プロトタイプでは検索のみ)'],
    ['味わいはどうでしたか?', 'マップをタップして打点。直感でOK、あとから直せます'],
    ['どう楽しみましたか?', '飲み方・肴・写真 — すべて任意です'],
    ['ひとことメモ', 'あとから読み返す、自分への手紙'],
  ];
  const tasteX = rec.x == null ? '' : rec.x > 58 ? '濃醇' : rec.x < 42 ? '淡麗' : '中庸';
  const tasteY = rec.y == null ? '' : rec.y < 42 ? '香り高い' : rec.y > 58 ? '穏やか' : 'バランス型';
  const recTasteLabel = rec.x == null ? 'まだ打点がありません' : tasteX + '・' + tasteY;
  const recSweetLabel = rec.sweet < 35 ? '甘口寄り' : rec.sweet > 65 ? '辛口寄り' : '中口';
  const recStars = [1, 2, 3, 4, 5].map((n) => ({ color: n <= rec.rating ? '#BC6A2D' : '#DDD3BE', click: () => store.setRec({ rating: n }) }));
  const tempChips = ['冷酒', '常温', 'ぬる燗', '熱燗'].map((t) => {
    const a = rec.temps.indexOf(t) !== -1;
    return { label: t, bg: a ? '#32507C' : '#FDFBF5', color: a ? '#FDFBF5' : '#5C5547', border: a ? '1px solid #32507C' : '1px solid #E3DBCB', click: () => store.setRec({ temps: a ? rec.temps.filter((x) => x !== t) : rec.temps.concat([t]) }) };
  });
  const step2Valid = rec.x != null && rec.rating > 0;
  const nextOk = rec.step === 2 ? step2Valid : true;
  const recNext = () => { if (!nextOk) return; if (rec.step === 4) store.saveRecord(); else store.setRec({ step: rec.step + 1 }); };
  const recBack = () => { if (rec.step <= 1 || (rec.step === 2 && store.fromDetail)) store.nav('home'); else store.setRec({ step: rec.step - 1 }); };
  const recGhostDots = store.myRecords.map((x) => ({ left: x.x, top: x.y }));
  const enjoyParts = (rec.temps.length ? rec.temps.join('・') : '未記入') + (rec.pairing ? ' / 肴: ' + rec.pairing : '');

  // kura map
  const kuraByPref: Record<string, Record<string, Brand[]>> = {};
  brands.forEach((b) => {
    if (!kuraByPref[b.pref]) kuraByPref[b.pref] = {};
    if (!kuraByPref[b.pref][b.brewery]) kuraByPref[b.pref][b.brewery] = [];
    kuraByPref[b.pref][b.brewery].push(b);
  });
  const drunkPrefs = new Set(store.myRecords.map((x) => (byId(x.brandId) || EMPTY_BRAND).pref).filter(Boolean));
  const mapStats = '蔵のある県 ' + Object.keys(kuraByPref).length + ' ・ 呑んだ県 ' + drunkPrefs.size + ' / 47';

  // ===== SAKE MEETUP（DB由来） =====
  const list = store.meetupList;
  const md = store.meetupDetail;
  const shortOf = (dl: string) => (dl || '').split('(')[0].split(' ')[0];
  const nextMeet = list
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
  const homePast = list.filter((m) => m.phase === 'voting' || m.phase === 'closed').map((m) => ({
    name: m.name, dateShort: shortOf(m.dateLabel), theme: m.theme,
    isVoting: m.phase === 'voting', notVoting: m.phase !== 'voting',
    click: () => store.openMeetup(m.id),
  }));
  const votingMeet = list.find((m) => m.phase === 'voting');
  const homeVoting = votingMeet ? { name: votingMeet.name, deadline: votingMeet.voteDeadline || '', click: () => store.openMeetup(votingMeet.id) } : null;

  // SAKE MEETUP 一覧（hub画面）。フェーズ別にバッジ・統計・CTAを出し分ける。
  const meetupsList = list.map((m) => {
    const mvp = m.mvpBrandId ? byId(m.mvpBrandId) : undefined;
    return {
      phaseLabel: m.phase === 'voting' ? '投票受付中' : m.phase === 'closed' ? '結果確定' : '開催前',
      phaseBg: m.phase === 'voting' ? '#BC6A2D' : m.phase === 'closed' ? '#5C5547' : '#32507C',
      name: m.name, dateLabel: m.dateLabel, place: m.place, theme: m.theme,
      isUpcoming: m.phase === 'before', isVoting: m.phase === 'voting', isClosed: m.phase === 'closed',
      goCount: m.goingCount, bringCount: m.bringCount,
      goToggle: (e: MouseEvent) => { e.stopPropagation(); store.toggleGoing(m.id); },
      goLabel: m.iGoing ? '参加予定 ✓' : '参加する',
      goLabelBg: m.iGoing ? '#32507C' : '#FDFBF5',
      goLabelColor: m.iGoing ? '#FDFBF5' : '#32507C',
      voteDeadline: m.voteDeadline || '',
      hasMvp: !!mvp, mvpName: mvp ? mvp.name : '',
      click: () => store.openMeetup(m.id),
    };
  });

  // 開いているMEETUPの詳細（route.meetupId に対応）
  const meId = md?.id || route.meetupId || '';
  const mePhase = md?.phase || 'before';
  const isBefore = mePhase === 'before';
  const isVoting = mePhase === 'voting';
  const isClosed = mePhase === 'closed';
  const showLineup = !isBefore;
  const isHost = !!md?.isHost;
  const iGo = !!md?.iGoing;
  const goingAvatars = (md?.attendees || []).slice(0, 10).map((a) => ({ avatar: a.avatar, bg: a.avatarBg, name: a.name }));
  const allBring = md?.brings || [];
  const brandCounts: Record<string, number> = {};
  allBring.forEach((b) => { brandCounts[b.brandId] = (brandCounts[b.brandId] || 0) + 1; });
  const bringList = allBring.map((b) => {
    const br = byId(b.brandId) || EMPTY_BRAND;
    return { brandId: b.brandId, memberName: b.memberName, avatar: b.avatar, avatarBg: b.avatarBg, mine: !!b.mine, brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, note: b.note || '', dup: brandCounts[b.brandId] > 1, brandClick: () => store.openDetail(b.brandId) };
  });
  const voteCounts: Record<string, number> = md?.voteCounts || {};
  const myVote = md?.myVoteBrandId || null;
  const totalVotes = Object.values(voteCounts).reduce((a: number, n: number) => a + n, 0);
  // ラインナップ = 持ち寄られた酒、得票数順
  const sortedLineup = showLineup ? allBring.slice().sort((a, b) => (voteCounts[b.brandId] || 0) - (voteCounts[a.brandId] || 0)) : [];
  const mvpBrandId = sortedLineup.length ? sortedLineup[0].brandId : null;
  const meetup = {
    id: meId, name: md?.name || '', dateLabel: md?.dateLabel || '', place: md?.place || '', theme: md?.theme || '',
    hostName: md?.hostName || '',
    isBefore, isVoting, isClosed, showLineup,
    isHost, hostCanStart: isBefore && isHost, hostCanClose: isVoting && isHost,
    startVoting: () => store.setPhase(meId, 'voting'),
    closeVoting: () => store.setPhase(meId, 'closed'),
    voteDeadline: md?.voteDeadline || '',
    phaseLabel: isVoting ? '投票受付中' : isClosed ? '結果確定' : '開催前',
    phaseBg: isVoting ? '#BC6A2D' : isClosed ? '#5C5547' : '#32507C',
    mvpLabel: isVoting ? '★ 暫定トップ（投票受付中）' : '★ その日のMVP酒 — 最多得票',
    iGo, goCount: md?.goingCount || 0, attendees: md?.goingCount || 0,
    goingAvatars,
    goToggle: () => store.toggleGoing(meId),
    goLabel: iGo ? '参加予定です ✓' : '参加する',
    goBg: iGo ? '#32507C' : '#FDFBF5', goColor: iGo ? '#FDFBF5' : '#32507C',
    bringList, bringCount: allBring.length,
    hasBring: allBring.length > 0,
    hasDup: Object.keys(brandCounts).some((k) => brandCounts[k] > 1),
    myDeclared: !!md?.myBringBrandId, notMyDeclared: !md?.myBringBrandId,
    declareClick: () => store.openDeclare(meId),
    declareLabel: md?.myBringBrandId ? '持ち寄りを変更する' : '自分の一本を宣言する',
    cancelDeclare: async () => {
      await cancelBring(meId);
      await Promise.all([store.loadMeetupDetail(meId), store.loadMeetups()]);
    },
    backHome: () => store.nav('home'),
    totalVotesLabel: totalVotes + '票',
    myVoted: !!myVote,
    canVote: isVoting,
    lineup: sortedLineup.map((l, i) => {
      const br = byId(l.brandId) || EMPTY_BRAND;
      const vc = voteCounts[l.brandId] || 0;
      const voted = myVote === l.brandId;
      return { rank: i + 1, rankLabel: ['壱', '弐', '参', '四', '五'][i] || (i + 1), isMvp: mvpBrandId === l.brandId, brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, broughtBy: l.memberName, avatar: l.avatar, avatarBg: l.avatarBg, score: '', stars: '', votes: vc + '票', comment: l.note || '', brandClick: () => store.openDetail(l.brandId), canVote: isVoting, voted, voteLabel: voted ? '投票済み ✓' : 'MVPに投票', voteBg: voted ? '#BC6A2D' : '#FDFBF5', voteColor: voted ? '#FDFBF5' : '#BC6A2D', voteClick: () => store.voteMvp(meId, l.brandId) };
    }),
    mvp: showLineup && mvpBrandId ? (() => { const br = byId(mvpBrandId) || EMPTY_BRAND; const lp = allBring.find((x) => x.brandId === mvpBrandId); return { brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, broughtBy: lp?.memberName || '', votesLabel: (voteCounts[mvpBrandId] || 0) + '票', comment: lp?.note || '', brandClick: () => store.openDetail(mvpBrandId) }; })() : { brandName: '', brandSub: '', broughtBy: '', votesLabel: '', comment: '', brandClick: () => {} },
  };

  // declare flow（かぶり判定は現在の宣言一覧から）
  const dBrand = byId(store.declareBrandId);
  const dTaken = dBrand ? allBring.find((x) => x.brandId === dBrand.id && !x.mine) : null;
  const declare = {
    meetName: md?.name || '',
    picked: !!dBrand, pickedName: dBrand ? dBrand.name : '', pickedSub: dBrand ? (dBrand.brewery + ' / ' + dBrand.pref) : '',
    changeBrand: () => store.patch({ declareBrandId: null }),
    dupWarn: !!dTaken, dupWarnLabel: dTaken ? (dTaken.memberName + 'さんが既に持ち寄り予定です。かぶってもOKですが、変えると喜ばれるかも。') : '',
    canSubmit: !!dBrand,
    submit: async (note: string) => {
      const brandId = store.declareBrandId;
      if (!brandId) { store.flash('持ち寄る一本を選んでください'); return; }
      const ok = await declareBring(meId, brandId, note);
      if (!ok) { store.flash('宣言に失敗しました（ログインが必要です）'); return; }
      await Promise.all([store.loadMeetupDetail(meId), store.loadMeetups()]);
      store.openMeetup(meId);
      store.flash('持ち寄りを宣言しました');
    },
    notPicked: !dBrand,
    cancel: () => store.openMeetup(meId),
  };

  // kura detail
  const kn0 = route.kuraName;
  const kmeta = kn0 ? kuraMeta[kn0] : undefined;
  const kBrands = brands.filter((b) => b.brewery === kn0);
  const kPref = kBrands.length ? kBrands[0].pref : '';
  const kRecs = store.myRecords.map((x, i) => ({ rec: x, idx: i })).filter((o) => kBrands.some((b) => b.id === o.rec.brandId));
  const kQuery = encodeURIComponent((kn0 || '') + ' ' + (kmeta?.city || '') + ' ' + kPref);
  const ku = {
    name: kn0 || '',
    mapSrc: 'https://www.google.com/maps?q=' + kQuery + '&output=embed&hl=ja&z=13',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=' + kQuery,
    meta: kPref + (kmeta?.city ? ' ' + kmeta.city : '') + (kmeta?.founded ? ' — 創業 ' + kmeta.founded + '年' : ''),
    desc: kmeta?.desc || '',
    brandCount: kBrands.length,
    totalRecs: kBrands.reduce((a, b) => a + b.count, 0),
    myCupCount: kRecs.length,
    hasCups: kRecs.length > 0,
    dots: kBrands.map((b) => ({ left: b.x, top: b.y, label: b.name })),
    brands: kBrands.map((b) => ({ name: b.name, cls: b.cls, polish: b.polish, rice: b.rice, rating: b.rating.toFixed(1), pct: Math.round(b.rating / 5 * 100), click: () => store.openDetail(b.id) })),
    cups: kRecs.map((o) => {
      const b = byId(o.rec.brandId) || EMPTY_BRAND;
      return { name: b.name, date: o.rec.date, stars: starStr(o.rec.rating), memo: o.rec.memo || '(メモなし)', click: () => store.openPost({ src: 'mine', i: o.idx }) };
    }),
  };

  // mypage
  const myList = store.myRecords.map((x, i) => {
    const b = byId(x.brandId) || EMPTY_BRAND;
    return { recordId: x.recordId, name: b.name, sub: b.brewery + ' / ' + b.pref, date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)', tags: x.temps.concat(x.pairing ? ['肴: ' + x.pairing] : []), photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo, click: () => store.openPost({ src: 'mine', i }) };
  });
  const wantList = store.wantIds.map((id) => byId(id)).filter((b): b is Brand => Boolean(b)).map((b) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref, click: () => store.openDetail(b.id), buyUrl: 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(b.name) + '/' }));

  // 利き酒師ランク
  const cupsN = store.myRecords.length;
  const rankTiers = [{ min: 0, name: '見習い' }, { min: 1, name: '利き酒入門' }, { min: 5, name: '利き酒人' }, { min: 15, name: '利き酒師' }, { min: 30, name: '利き酒名人' }, { min: 60, name: '酒仙' }];
  let ti = 0; rankTiers.forEach((t, i) => { if (cupsN >= t.min) ti = i; });
  const nextTier = rankTiers[ti + 1];
  const rankPct = nextTier ? Math.min(100, Math.round((cupsN - rankTiers[ti].min) / (nextTier.min - rankTiers[ti].min) * 100)) : 100;
  // 制覇度バッジ
  const prefSet2 = new Set(store.myRecords.map((x) => (byId(x.brandId) || EMPTY_BRAND).pref).filter(Boolean));
  const kuraSet2 = new Set(store.myRecords.map((x) => (byId(x.brandId) || EMPTY_BRAND).brewery).filter(Boolean));
  const badgeDefs = [
    { icon: '初', label: 'はじめの一杯', on: cupsN >= 1 },
    { icon: '拾', label: '10盃達成', on: cupsN >= 10 },
    { icon: '丗', label: '30盃達成', on: cupsN >= 30 },
    { icon: '蔵', label: '5蔵めぐり', on: kuraSet2.size >= 5 },
    { icon: '県', label: '5県制覇', on: prefSet2.size >= 5 },
    { icon: '燗', label: '燗酒を嗜む', on: store.myRecords.some((x) => (x.temps || []).some((t) => t.indexOf('燗') !== -1)) },
    { icon: '写', label: 'ラベル写真家', on: store.myRecords.some((x) => x.photo) },
    { icon: '全', label: '全国制覇', on: prefSet2.size >= 47 },
  ];
  const badges = badgeDefs.map((b) => ({ icon: b.icon, label: b.label, bg: b.on ? '#32507C' : '#EFEAE0', color: b.on ? '#FDFBF5' : '#BCB29D', labelColor: b.on ? '#2E2A24' : '#A89D8A' }));
  const achievedCount = badgeDefs.filter((b) => b.on).length;

  return {
    // nav
    navItems,
    goHome: () => store.nav('home'),
    goZukan: () => store.nav('zukan'),
    goMy: () => { if (store.requireLogin()) store.nav('mypage'); },
    // SP ハンバーガーメニュー項目（タブバーから外れた導線をここで補う）
    menuItems: [
      { label: '酒蔵マップ', click: () => store.nav('map') },
      { label: '飲める店', click: () => store.nav('map') },
      { label: 'みんなの利き酒帳', click: () => store.nav('feed') },
      { label: 'イベントを立てる', click: () => store.openEventCreate() },
      ...(store.user?.isAdmin ? [{ label: '酒蔵を登録する', click: () => store.openKuraReg() }] : []),
    ],
    // login
    isLogin: route.screen === 'login',
    showChrome: route.screen !== 'login',
    loggedIn: !!store.user, loggedOut: !store.user,
    userAvatar: currentUser.avatar, userName: currentUser.name,
    goLogin: () => store.nav('login'),
    doLogout: () => store.logout(),
    startRecordClick: () => store.startRecord(null),
    // responsive
    isMobile: isMobile && route.screen !== 'login', isDesktopNav: !isMobile,
    tabLeft, tabRight,
    pagePad: isMobile ? '28px 18px 130px' : '40px 40px 80px',
    pagePadTight: isMobile ? '20px 18px 130px' : '32px 40px 80px',
    heroCols: isMobile ? '1fr' : '1.5fr 1fr',
    homeSplitCols: isMobile ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1fr)',
    heroTitleSize: isMobile ? '30px' : '38px',
    mapH: isMobile ? '300px' : '380px',
    zukanCols: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    detailCols: isMobile ? '1fr' : '360px 1fr',
    bottleH: isMobile ? '320px' : '420px',
    specCols: isMobile ? '1fr 1fr' : '1fr 1fr 1fr',
    postCols: isMobile ? '1fr' : '260px 1fr',
    postCardPad: isMobile ? '20px 18px' : '32px 36px',
    myCols: isMobile ? '1fr' : '1fr 380px',
    isHome: route.screen === 'home', isZukan: route.screen === 'zukan', isDetail: route.screen === 'detail', isRecord: route.screen === 'record', isMy: route.screen === 'mypage', isFeed: route.screen === 'feed', isPost: route.screen === 'post' && !!post, isMap: route.screen === 'map', isKura: route.screen === 'kura' && !!route.kuraName,
    // home
    statCups: store.myRecords.length, statBrands: uniqBrands.size, statKura: uniqKura.size,
    today: { name: today.name, sub: subOf(today) },
    todayClick: () => store.openDetail(today.id),
    myDots, feedItems: allFeed.slice(0, 3), feedAll: allFeed, feedCount: allFeed.length, goFeed: () => store.nav('feed'), post: post ?? EMPTY_POST, ranking,
    // detail
    d: { name: d.name, brewery: d.brewery, pref: d.pref, cls: d.cls, class: d.cls, polish: d.polish, rice: d.rice, yeast: d.yeast, smv: d.smv, abv: d.abv, temp: d.temp, desc: d.desc, x: d.x, y: d.y, rating: d.rating.toFixed(1), count: d.count },
    dStars: starStr(Math.round(d.rating)),
    dRecordClick: () => { store.patch({ fromDetail: true }); store.startRecord(d.id); },
    dWantClick: () => { if (!store.requireLogin()) return; store.patch({ wantIds: wanted ? store.wantIds.filter((x) => x !== d.id) : store.wantIds.concat([d.id]) }); },
    dWantLabel: wanted ? '飲みたいリスト追加済 ✓' : '飲みたいリストへ',
    dWantBg: wanted ? '#32507C' : '#FDFBF5',
    dWantColor: wanted ? '#FDFBF5' : '#32507C',
    dPhoto: d.photo || null,
    dHasMyPoint: !!myRecForD, dMyX: myRecForD ? myRecForD.x : 0, dMyY: myRecForD ? myRecForD.y : 0,
    dReviews, dShop,
    // record
    recSteps, recProgress: rec.step / 4 * 100,
    recTitle: titles[rec.step - 1][0], recSub: titles[rec.step - 1][1],
    isRecStep1: rec.step === 1, isRecStep2: rec.step === 2, isRecStep3: rec.step === 3, isRecStep4: rec.step === 4,
    recQuery: rec.query, onRecSearch: (e: ChangeEv) => store.setRec({ query: e.target.value }), recResults,
    recBrandName: recBrand ? recBrand.name : '', recBrandSub: recBrand ? recBrand.brewery + ' / ' + recBrand.pref + ' — ' + recBrand.cls : '',
    recChangeBrand: () => { store.patch({ fromDetail: false }); store.setRec({ step: 1 }); },
    onMapTap: (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(95, Math.max(5, Math.round((e.clientX - rect.left) / rect.width * 100)));
      const y = Math.min(95, Math.max(5, Math.round((e.clientY - rect.top) / rect.height * 100)));
      store.setRec({ x, y });
    },
    recHasPoint: rec.x != null, recX: rec.x, recY: rec.y, recGhostDots,
    recTasteLabel, recSweet: rec.sweet, recSweetLabel,
    onSweet: (e: ChangeEv) => store.setRec({ sweet: Number(e.target.value) }),
    recStars, recRatingLabel: rec.rating > 0 ? rec.rating.toFixed(1) : '未評価',
    tempChips, recPairing: rec.pairing,
    onPairing: (e: ChangeEv) => store.setRec({ pairing: e.target.value }),
    recMemo: rec.memo, onMemo: (e: ChangeEv) => store.setRec({ memo: e.target.value }),
    onPhoto: (e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files && e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => store.setRec({ photo: rd.result as string }); rd.readAsDataURL(f); e.target.value = ''; },
    onPhotoRemove: (e: MouseEvent) => { e.stopPropagation(); store.setRec({ photo: null }); },
    recPhoto: rec.photo || '', recHasPhoto: !!rec.photo, recNoPhoto: !rec.photo,
    recStarsStr: starStr(rec.rating), recEnjoyLabel: enjoyParts,
    recPublic: rec.isPublic,
    toggleRecPublic: () => store.setRec({ isPublic: !rec.isPublic }),
    recShowFooter: rec.step >= 2, recBack, recNext,
    recNextLabel: rec.step === 2 ? (step2Valid ? 'つぎへ — 合わせ' : 'マップに打点と評価をどうぞ') : rec.step === 3 ? 'つぎへ — メモ' : '記す — 保存する',
    recNextBg: nextOk ? '#32507C' : '#C9C2B2',
    recNextCursor: nextOk ? 'pointer' : 'default',
    // mypage
    myList, wantList,
    rankName: rankTiers[ti].name, rankPct, hasNextRank: !!nextTier,
    rankNextLabel: nextTier ? ('次「' + nextTier.name + '」まで あと' + (nextTier.min - cupsN) + '盃') : '最高位に到達!',
    cupsCount: cupsN,
    badges, achievedCount, badgeTotal: badgeDefs.length,
    badgePref: prefSet2.size, badgeKura: kuraSet2.size,
    // kura map（Map画面のuseMapStateで使う生データ）
    allBrands: brands,
    allBars: bars,
    kuraByPref,
    drunkPrefSet: drunkPrefs,
    prefGrid,
    kuraMeta,
    openDetail: (id: string) => store.openDetail(id),
    openKura: (name: string) => store.openKura(name),
    mapStats,
    goMap: () => store.nav('map'),
    ku,
    // SAKE MEETUP
    homeNext, homePast, homeVoting, hasVoting: !!homeVoting, meetup, declare,
    meetupsList, isMeetups: route.screen === 'meetups', goMeetups: () => store.nav('meetups'),
    isMeetup: route.screen === 'meetup', isDeclare: route.screen === 'declare',
    isMeetupCreate: route.screen === 'eventCreate',
    openMeetupCreate: () => store.openEventCreate(),
    isKuraReg: route.screen === 'kuraReg',
    openKuraReg: () => store.openKuraReg(),
    meetCols: isMobile ? '1fr' : 'minmax(0, 1.5fr) minmax(0, 1fr)',
    kuraCols: isMobile ? '1fr' : 'minmax(0, 1.4fr) minmax(0, 1fr)',
    kuraBrandCols: isMobile ? '1fr' : 'repeat(2, 1fr)',
    dBreweryClick: () => store.openKura(d.brewery),
    mapCols: isMobile ? '1fr' : 'minmax(0, 1.55fr) minmax(0, 1fr)',
    mapPanelPad: isMobile ? '14px 12px' : '24px',
    mapGap: isMobile ? '4px' : '6px',
    // toast
    toastVisible: !!store.toast, toastMsg: store.toast,
    stopProp: (e: MouseEvent) => e.stopPropagation(),
  };
}

// 画面コンポーネントが受け取るビューモデルの型。useVals の戻り値から推論する
// （明示的な巨大interfaceを保守しなくて済む）。各画面は { vals }: { vals: Vals } で受ける。
export type Vals = ReturnType<typeof useVals>;
