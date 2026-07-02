// Faithful port of the Claude Design prototype's renderVals(): builds the full
// view-model object consumed by every screen. Mirrors the prototype 1:1.
import type { ChangeEvent, MouseEvent } from 'react';
import { useStore } from './store';
import type { RouteState } from '@/lib/routes';
import type { ReferenceData } from '@/lib/getReferenceData';
import type { Brand, Bar, PostRef, MyRec, PublicRec, OtherRec, PostVM } from '@/types';
import { buildNavModel } from '@/lib/nav';
import { addComment as addCommentAction, deleteComment as deleteCommentAction } from '@/app/actions/social';
import { setRecordPublic as setRecordPublicAction, deleteRecord as deleteRecordAction } from '@/app/actions/records';
import { socialOf, buildFeedItems } from '@/lib/feedModel';
import { starStr, subOf } from '@/lib/format';

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
  nomiCount: 0, nomiLiked: false, nomiClick: noop,
  comments: [], commentCount: 0, hasComments: false,
  commentSend: (_draft: string) => {},
};


export function useVals(route: RouteState, ref: ReferenceData) {
  const store = useStore();
  const rec = store.rec;
  const isMobile = store.vw < 760;
  const { brands, others, bars, prefGrid, kuraMeta } = ref;
  const byId = (id: string | null | undefined) => brands.find((b) => b.id === id);

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
  // 未ログイン時は空の表示名にフォールバックする(モックユーザー名を漏らさない)。
  // yuuWho が実際に表示されるのは自分の記録がある=ログイン済みの場合のみ。
  const currentUser = store.user || { name: '', avatar: '' };
  const yuuWho = { user: currentUser.name, mine: '(あなた)', avatar: currentUser.avatar, avatarBg: '#DDD3BE' };

  // みんなの利き酒帳 = 公開記録（全ユーザー）のみ。構築ロジックは lib/feedModel に共有。
  const allFeed = buildFeedItems(store, brands, currentUser.name);

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
      const pso = socialOf(store, px);
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
      { label: 'イベント情報', click: () => store.nav('events') },
      { label: '銘柄図鑑', click: () => store.nav('zukan') },
      { label: '酒蔵マップ', click: () => store.nav('map') },
      { label: 'メンバー', click: () => store.nav('members') },
      { label: 'みんなの利き酒帳', click: () => store.nav('feed') },
      { label: 'SAKE MEETUPを立てる', click: () => store.openMeetupCreate() },
      ...(store.user?.isAdmin ? [
        { label: '酒蔵を登録する', click: () => store.openKuraReg() },
        { label: '銘柄を登録する', click: () => store.nav('brandReg') },
      ] : []),
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
    myDots, feedItems: allFeed.slice(0, 3), goFeed: () => store.nav('feed'), post: post ?? EMPTY_POST, ranking,
    // detail
    d: { name: d.name, brewery: d.brewery, pref: d.pref, cls: d.cls, class: d.cls, polish: d.polish, rice: d.rice, yeast: d.yeast, smv: d.smv, abv: d.abv, temp: d.temp, desc: d.desc, x: d.x, y: d.y, rating: d.rating.toFixed(1), count: d.count },
    dStars: starStr(Math.round(d.rating)),
    dRecordClick: () => { store.patch({ fromDetail: true }); store.startRecord(d.id); },
    dWantClick: () => { if (!store.requireLogin()) return; store.patch({ wantIds: wanted ? store.wantIds.filter((x) => x !== d.id) : store.wantIds.concat([d.id]) }); },
    dWanted: wanted,
    dWantLabel: wanted ? '飲みたいリスト追加済 ✓' : '飲みたいリストへ',
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
    recNextDisabled: !nextOk,
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
    openKura: (name: string) => store.openKura(name),
    mapStats,
    // SAKE MEETUP
    homeNext, homePast, homeVoting, hasVoting: !!homeVoting,
    isMeetups: route.screen === 'meetups', goMeetups: () => store.nav('meetups'),
    isMeetup: route.screen === 'meetup', isDeclare: route.screen === 'declare',
    isMeetupCreate: route.screen === 'meetupCreate',
    openMeetupCreate: () => store.openMeetupCreate(),
    isKuraReg: route.screen === 'kuraReg',
    openKuraReg: () => store.openKuraReg(),
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
