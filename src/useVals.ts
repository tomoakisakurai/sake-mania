/* eslint-disable @typescript-eslint/no-explicit-any */
// Faithful port of the Claude Design prototype's renderVals(): builds the full
// view-model object consumed by every screen. Mirrors the prototype 1:1.
import { useStore } from './store';
import type { RouteState } from '@/lib/routes';
import type { ReferenceData } from '@/lib/getReferenceData';

const starStr = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export function useVals(route: RouteState, ref: ReferenceData): any {
  const st = useStore();
  const s = st;
  const r = s.rec;
  const mob = s.vw < 760;
  const { brands, others, members, meetups, bars, prefGrid, kuraMeta } = ref;
  const byId = (id: string | null | undefined) => brands.find((b) => b.id === id);
  const memberOf = (name: string) =>
    members.find((m) => m.name === name) || { name, display: name, avatar: (name || '?').charAt(0), avatarBg: '#DDD3BE' };

  const screenActive = (key: string) =>
    route.screen === key
    || (key === 'zukan' && route.screen === 'detail')
    || (key === 'feed' && route.screen === 'post')
    || (key === 'map' && (route.screen === 'kura' || route.screen === 'kuraReg'))
    || (key === 'home' && (route.screen === 'meetup' || route.screen === 'declare' || route.screen === 'eventCreate'));

  const mkTab = (key: string, label: string) => {
    const active = screenActive(key);
    return { label, color: active ? '#32507C' : '#8B8273', weight: active ? 700 : 500, click: () => { if (key === 'mypage') { if (st.requireLogin()) st.nav('mypage'); } else st.nav(key as any); } };
  };
  const subOf = (b: any) => b.brewery + ' / ' + b.pref + ' — ' + b.cls;

  // nav
  const navDef: [string, string][] = [['home', 'ホーム'], ['zukan', '図鑑'], ['map', '酒蔵マップ'], ['feed', 'みんなの利き酒帳'], ['mypage', 'マイページ']];
  const navItems = navDef.map((d) => {
    const active = screenActive(d[0]);
    return { label: d[1], color: active ? '#2E2A24' : '#5C5547', weight: active ? 700 : 400, border: active ? '2px solid #32507C' : '2px solid transparent', click: () => { if (d[0] === 'mypage') { if (st.requireLogin()) st.nav('mypage'); } else st.nav(d[0] as any); } };
  });

  // stats
  const uniqBrands = new Set(s.myRecords.map((x) => x.brandId));
  const uniqKura = new Set(s.myRecords.map((x) => (byId(x.brandId) || ({} as any)).brewery));

  // map dots
  const myDots = s.myRecords.map((x) => {
    const b = byId(x.brandId) || ({} as any);
    return { left: x.x, top: x.y, size: x.rating >= 5 ? 15 : 10, bg: x.rating >= 5 ? '#BC6A2D' : '#32507C', label: (b.name || '').split(' ')[0] };
  });

  // feed
  const u = s.user || { name: 'yuu_sake_log', avatar: '悠' };
  const yuuWho = { user: u.name, mine: '(あなた)', avatar: u.avatar, avatarBg: '#DDD3BE' };
  const loginTabs = ([['login', 'ログイン'], ['signup', '新規登録']] as [string, string][]).map((t) => ({
    label: t[1], click: () => st.patch({ loginMode: t[0] as any }),
    color: s.loginMode === t[0] ? '#2E2A24' : '#A89D8A',
    weight: s.loginMode === t[0] ? 700 : 400,
    border: s.loginMode === t[0] ? '2px solid #32507C' : '2px solid transparent',
  }));
  const socialBtns = [
    { mark: 'G', markColor: '#4285F4', label: 'Googleでつづける' },
    { mark: '●', markColor: '#06C755', label: 'LINEでつづける' },
  ].map((o) => ({ ...o, click: () => st.doLogin() }));

  const socialOf = (x: any) => {
    const mine = s.myComments[x.rid] || [];
    const liked = !!s.myNomi[x.rid];
    return { liked, nomi: (x.nomi || 0) + (liked ? 1 : 0), comments: (x.comments || []).concat(mine) };
  };
  const mkFeed = (x: any, who: any, time: string, ref: any) => {
    const b = byId(x.brandId) || ({} as any);
    const so = socialOf(x);
    const isOther = who.user !== yuuWho.user;
    return { user: who.user, mine: who.mine || '', avatar: who.avatar, avatarBg: who.avatarBg, time, stars: starStr(x.rating), name: b.name, sub: subOf(b), memo: x.memo || '(メモなし)', tags: (x.temps || []).concat(x.pairing ? ['肴: ' + x.pairing] : []), photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo, canNomi: isOther, cantNomi: !isOther, nomiCount: so.nomi, commentCount: so.comments.length, nomiBg: so.liked ? '#BC6A2D' : '#FDFBF5', nomiColor: so.liked ? '#FDFBF5' : '#BC6A2D', nomiClick: (e: any) => { e.stopPropagation(); st.toggleNomi(x.rid); }, click: () => st.openPost(ref), brandClick: (e: any) => { e.stopPropagation(); st.openDetail(b.id); } };
  };
  const mineFeed: any[] = [];
  s.myRecords.forEach((x, i) => { if (x.isNew) mineFeed.push(mkFeed(x, yuuWho, 'たった今', { src: 'mine', i })); });
  const otherFeed = others.map((o, i) => mkFeed(o, o, o.time + ' ・ ' + o.place, { src: 'other', i }));
  const allFeed = mineFeed.concat(otherFeed);

  // post detail
  let post: any = null;
  const prf = route.postRef;
  if (prf) {
    const isMine = prf.src === 'mine';
    const px: any = isMine ? s.myRecords[prf.i] : others[prf.i];
    if (px) {
      const pb = byId(px.brandId) || ({} as any);
      post = {
        user: isMine ? yuuWho.user : px.user, mine: isMine ? '(あなた)' : '',
        avatar: isMine ? yuuWho.avatar : px.avatar, avatarBg: isMine ? yuuWho.avatarBg : px.avatarBg,
        timePlace: isMine ? px.date + ' ・ 自分の記録' : px.time + ' ・ ' + px.place,
        brandName: pb.name, brewery: pb.brewery, brandSubRest: pb.pref + ' — ' + pb.cls,
        kuraClick: () => st.openKura(pb.brewery), stars: starStr(px.rating), ratingNum: px.rating.toFixed(1),
        x: px.x, y: px.y, bx: pb.x, by: pb.y,
        sweet: px.sweet, sweetLabel: px.sweet < 35 ? '甘口寄り' : px.sweet > 65 ? '辛口寄り' : '中口',
        tasteLabel: (px.x > 58 ? '濃醇' : px.x < 42 ? '淡麗' : '中庸') + '・' + (px.y < 42 ? '香り高い' : px.y > 58 ? '穏やか' : 'バランス型'),
        temps: (px.temps && px.temps.length) ? px.temps.join('・') : '未記入',
        pairing: px.pairing || '未記入',
        memo: px.memo || '(メモなし)',
        photo: px.photo || '', hasPhoto: !!px.photo, noPhoto: !px.photo,
        brandClick: () => st.openDetail(pb.id),
        recordClick: () => { st.patch({ fromDetail: false }); st.startRecord(pb.id); },
      };
      const pso = socialOf(px);
      post.canNomi = !isMine;
      post.cantNomi = isMine;
      post.nomiCount = pso.nomi;
      post.nomiBg = pso.liked ? '#BC6A2D' : '#FDFBF5';
      post.nomiColor = pso.liked ? '#FDFBF5' : '#BC6A2D';
      post.nomiClick = () => st.toggleNomi(px.rid);
      const baseC = px.comments || [];
      const mineC = s.myComments[px.rid] || [];
      const ed = s.editingComment;
      post.comments = baseC.map((c: any) => ({ user: c.user, avatar: c.avatar, avatarBg: c.avatarBg, time: c.time, text: c.text, canEdit: false, notEditing: true, isEditing: false }))
        .concat(mineC.map((c: any, ci: number) => {
          const editing = !!ed && ed.rid === px.rid && ed.i === ci;
          return {
            user: c.user, avatar: c.avatar, avatarBg: c.avatarBg,
            time: c.time + (c.edited ? ' ・ 編集済' : ''), text: c.text,
            canEdit: !editing, isEditing: editing, notEditing: !editing,
            editClick: () => st.patch({ editingComment: { rid: px.rid, i: ci }, editDraft: c.text }),
            deleteClick: () => st.deleteComment(px.rid, ci),
          };
        }));
      post.commentCount = pso.comments.length;
      post.hasComments = pso.comments.length > 0;
      post.commentSend = () => st.addComment(px.rid);
      post.onCommentKey = (e: any) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !(e.nativeEvent && e.nativeEvent.isComposing) && e.keyCode !== 229) { e.preventDefault(); st.addComment(px.rid); } };
    }
  }

  // ranking
  const ranking = brands.slice().sort((a, b) => b.count - a.count).slice(0, 4).map((b, i) => ({ rank: ['壱', '弐', '参', '四'][i], color: i === 0 ? '#BC6A2D' : '#8B8273', name: b.name, brewery: b.brewery + ' / ' + b.pref, count: b.count + '記録', click: () => st.openDetail(b.id) }));

  const today = byId('kuheiji') || brands[0] || ({} as any);

  // zukan
  const q = s.searchQuery.trim();
  let fb = brands.filter((b) => !q || (b.name + b.brewery + b.rice + b.pref).indexOf(q) !== -1);
  if (s.activeTag) fb = fb.filter((b) => b.tags.indexOf(s.activeTag!) !== -1);
  const filteredBrands = fb.map((b) => ({ name: b.name, brewery: b.brewery, pref: b.pref, polish: b.polish, rice: b.rice, rating: b.rating.toFixed(1), pct: Math.round(b.rating / 5 * 100), click: () => st.openDetail(b.id) }));
  const tagChips = ['フルーティ', '辛口', '生酒', 'ガス感', '燗映え', 'ジューシー'].map((t) => {
    const a = s.activeTag === t;
    return { label: t, bg: a ? '#32507C' : '#FDFBF5', color: a ? '#FDFBF5' : '#5C5547', border: a ? '1px solid #32507C' : '1px solid #E3DBCB', click: () => st.patch({ activeTag: a ? null : t }) };
  });

  // detail
  const d = byId(route.detailId) || brands[0];
  const myRecForD = s.myRecords.find((x) => x.brandId === d.id);
  const dReviews = s.myRecords.filter((x) => x.brandId === d.id).map((x) => ({ user: 'あなた', date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)' }))
    .concat(others.filter((o) => o.brandId === d.id).map((o) => ({ user: o.user, date: o.date, stars: starStr(o.rating), memo: o.memo })));
  const wanted = s.wantIds.indexOf(d.id) !== -1;
  const shopQ = encodeURIComponent(d.name);
  const dShop = [
    { label: '楽天市場', mark: 'R', markColor: '#BF0000', url: 'https://search.rakuten.co.jp/search/mall/' + shopQ + '/' },
    { label: 'Amazon', mark: 'a', markColor: '#FF9900', url: 'https://www.amazon.co.jp/s?k=' + shopQ },
    { label: 'Yahoo!ショッピング', mark: 'Y', markColor: '#FF0033', url: 'https://shopping.yahoo.co.jp/search?p=' + shopQ },
    { label: '正規特約店をさがす', mark: '蔵', markColor: '#32507C', url: 'https://www.google.com/search?q=' + encodeURIComponent(d.name + ' 特約店') },
  ];

  // record flow
  const rq = (r.query || '').trim();
  const recResults = brands.filter((b) => !rq || (b.name + b.brewery + b.pref).indexOf(rq) !== -1).slice(0, 6)
    .map((b) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref + ' — ' + b.cls, click: () => st.setRec({ brandId: b.id, step: 2 }) }));
  const recBrand = byId(r.brandId);
  const stepLabels = ['銘柄', '味わい', '合わせ', 'メモ'];
  const recSteps = stepLabels.map((lb, i) => {
    const n = i + 1;
    const done = r.step > n, cur = r.step === n;
    return { n, label: lb, bg: cur ? '#32507C' : done ? '#DDD3BE' : '#FDFBF5', color: cur ? '#FDFBF5' : done ? '#5C5547' : '#A89D8A', border: cur || done ? '1px solid transparent' : '1px solid #E3DBCB', labelColor: cur ? '#2E2A24' : '#A89D8A', weight: cur ? 700 : 400 };
  });
  const titles = [
    ['どの銘柄を飲みましたか?', '図鑑から検索。見つからなければ自由入力も(プロトタイプでは検索のみ)'],
    ['味わいはどうでしたか?', 'マップをタップして打点。直感でOK、あとから直せます'],
    ['どう楽しみましたか?', '飲み方・肴・写真 — すべて任意です'],
    ['ひとことメモ', 'あとから読み返す、自分への手紙'],
  ];
  const tasteX = r.x == null ? '' : r.x > 58 ? '濃醇' : r.x < 42 ? '淡麗' : '中庸';
  const tasteY = r.y == null ? '' : r.y < 42 ? '香り高い' : r.y > 58 ? '穏やか' : 'バランス型';
  const recTasteLabel = r.x == null ? 'まだ打点がありません' : tasteX + '・' + tasteY;
  const recSweetLabel = r.sweet < 35 ? '甘口寄り' : r.sweet > 65 ? '辛口寄り' : '中口';
  const recStars = [1, 2, 3, 4, 5].map((n) => ({ color: n <= r.rating ? '#BC6A2D' : '#DDD3BE', click: () => st.setRec({ rating: n }) }));
  const tempChips = ['冷酒', '常温', 'ぬる燗', '熱燗'].map((t) => {
    const a = r.temps.indexOf(t) !== -1;
    return { label: t, bg: a ? '#32507C' : '#FDFBF5', color: a ? '#FDFBF5' : '#5C5547', border: a ? '1px solid #32507C' : '1px solid #E3DBCB', click: () => st.setRec({ temps: a ? r.temps.filter((x) => x !== t) : r.temps.concat([t]) }) };
  });
  const step2Valid = r.x != null && r.rating > 0;
  const nextOk = r.step === 2 ? step2Valid : true;
  const recNext = () => { if (!nextOk) return; if (r.step === 4) st.saveRecord(); else st.setRec({ step: r.step + 1 }); };
  const recBack = () => { if (r.step <= 1 || (r.step === 2 && s.fromDetail)) st.nav('home'); else st.setRec({ step: r.step - 1 }); };
  const recGhostDots = s.myRecords.map((x) => ({ left: x.x, top: x.y }));
  const enjoyParts = (r.temps.length ? r.temps.join('・') : '未記入') + (r.pairing ? ' / 肴: ' + r.pairing : '');

  // kura map
  const kuraByPref: Record<string, Record<string, any[]>> = {};
  brands.forEach((b) => {
    if (!kuraByPref[b.pref]) kuraByPref[b.pref] = {};
    if (!kuraByPref[b.pref][b.brewery]) kuraByPref[b.pref][b.brewery] = [];
    kuraByPref[b.pref][b.brewery].push(b);
  });
  const drunkPrefs = new Set(s.myRecords.map((x) => (byId(x.brandId) || ({} as any)).pref).filter(Boolean));
  const prefTiles = prefGrid.map((p) => {
    const name = p[0];
    const hasK = !!kuraByPref[name];
    const drunk = drunkPrefs.has(name);
    const sel = s.mapPref === name;
    const kuraCount = hasK ? Object.keys(kuraByPref[name]).length : 0;
    return {
      name, col: p[1], row: p[2],
      bg: drunk ? '#BC6A2D' : hasK ? '#32507C' : '#F3EDDF',
      color: hasK ? '#FDFBF5' : '#B9AE99',
      border: sel ? '2px solid #2E2A24' : hasK ? '1px solid transparent' : '1px solid #EAE2D0',
      fs: name.length >= 4 ? (mob ? '6.5px' : '8.5px') : (mob ? '8.5px' : '11px'),
      fsSub: mob ? '7px' : '9px',
      cursor: hasK ? 'pointer' : 'default',
      hasCount: kuraCount > 0, countLabel: kuraCount + '蔵',
      click: hasK ? (() => st.patch({ mapPref: sel ? null : name })) : (() => { /* noop */ }),
    };
  });
  const mapKuras: any[] = [];
  if (s.mapPref && kuraByPref[s.mapPref]) {
    Object.keys(kuraByPref[s.mapPref]).forEach((kn) => {
      const meta: any = kuraMeta[kn] || {};
      const bs = kuraByPref[s.mapPref!][kn];
      const cups = s.myRecords.filter((x) => bs.some((b) => b.id === x.brandId)).length;
      mapKuras.push({
        name: kn,
        nameClick: () => st.openKura(kn),
        gmapLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(kn + ' ' + (meta.city || '') + ' ' + s.mapPref),
        meta: s.mapPref + ' ' + (meta.city || '') + (meta.founded ? ' — 創業 ' + meta.founded + '年' : ''),
        hasCups: cups > 0, cupsLabel: '呑んだ盃 ' + cups,
        brands: bs.map((b) => ({ label: b.name, click: () => st.openDetail(b.id) })),
      });
    });
  }
  const prefChipList = Object.keys(kuraByPref).map((pn) => ({
    label: pn + ' ' + Object.keys(kuraByPref[pn]).length + '蔵',
    bg: drunkPrefs.has(pn) ? '#BC6A2D' : '#32507C',
    click: () => st.patch({ mapPref: pn }),
  }));
  const mapStats = '蔵のある県 ' + Object.keys(kuraByPref).length + ' ・ 呑んだ県 ' + drunkPrefs.size + ' / 47';

  // ===== SAKE MEETUP =====
  const meName = u.name;
  const me0 = meetups.find((m) => m.id === route.meetupId) || meetups[0] || ({} as any);
  const upcoming = meetups.filter((m) => m.status === 'upcoming');
  const pastMeets = meetups.filter((m) => m.status === 'past');
  const nextMeet = upcoming[0];
  const homeNext = nextMeet ? {
    name: nextMeet.name, dateLabel: nextMeet.dateLabel, place: nextMeet.place, theme: nextMeet.theme,
    goingLabel: ((nextMeet.going || []).length + (s.myGoing[nextMeet.id] ? 1 : 0)) + '人が参加予定',
    bringLabel: ((nextMeet.bring || []).length + (s.myBring[nextMeet.id] ? 1 : 0)) + '本が宣言済み',
    click: () => st.openMeetup(nextMeet.id),
  } : null;
  const homePast = pastMeets.map((m) => {
    const ph = s.meetPhase[m.id] || m.phase || 'closed';
    return { name: m.name, dateShort: m.dateShort, theme: m.theme, isVoting: ph === 'voting', notVoting: ph !== 'voting', click: () => st.openMeetup(m.id) };
  });
  const votingMeet = pastMeets.find((m) => (s.meetPhase[m.id] || m.phase) === 'voting');
  const homeVoting = votingMeet ? { name: votingMeet.name, deadline: votingMeet.voteDeadline || '', click: () => st.openMeetup(votingMeet.id) } : null;

  const mePhase = s.meetPhase[me0.id] || me0.phase || (me0.status === 'past' ? 'closed' : 'before');
  const isBefore = mePhase === 'before';
  const isVoting = mePhase === 'voting';
  const isClosed = mePhase === 'closed';
  const showLineup = !isBefore;
  const isHost = me0.host === meName;
  const iGo = !!s.myGoing[me0.id];
  const goNames = (me0.going || []).filter((n) => n !== meName).concat(iGo ? [meName] : []);
  const goingAvatars = goNames.slice(0, 10).map((n) => { const mm = memberOf(n); return { avatar: mm.avatar, bg: mm.avatarBg, name: mm.display || mm.name }; });
  const seedBring = (me0.bring || []).filter((b) => b.member !== meName);
  const myB = s.myBring[me0.id];
  const allBring: any[] = (seedBring as any[]).concat(myB ? [{ member: meName, brandId: myB.brandId, note: myB.note, mine: true }] : []);
  const brandCounts: Record<string, number> = {};
  allBring.forEach((b) => { brandCounts[b.brandId] = (brandCounts[b.brandId] || 0) + 1; });
  const bringList = allBring.map((b) => {
    const br = byId(b.brandId) || ({} as any);
    const mm = memberOf(b.member);
    const dup = brandCounts[b.brandId] > 1;
    return { memberName: mm.display || mm.name, avatar: mm.avatar, avatarBg: mm.avatarBg, mine: !!b.mine, brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, note: b.note || '', dup, brandClick: () => st.openDetail(b.brandId) };
  });
  const lineupData = me0.lineup || [];
  const myVote = s.myMvpVotes[me0.id];
  const voteCountOf = (bid: string) => (showLineup ? (lineupData.find((x) => x.brandId === bid) || ({} as any)).votes || 0 : 0) + (myVote === bid ? 1 : 0);
  const totalVotes = showLineup ? lineupData.reduce((a, l) => a + l.votes, 0) + (myVote ? 1 : 0) : 0;
  const sortedLineup = showLineup ? lineupData.slice().sort((a, b) => (voteCountOf(b.brandId) - voteCountOf(a.brandId)) || (b.score - a.score)) : [];
  const mvpBrandId = sortedLineup.length ? sortedLineup[0].brandId : null;
  const meetup = {
    id: me0.id, name: me0.name, dateLabel: me0.dateLabel, place: me0.place, theme: me0.theme,
    hostName: memberOf(me0.host).display || '',
    isBefore, isVoting, isClosed, showLineup,
    isHost, hostCanStart: isBefore && isHost, hostCanClose: isVoting && isHost,
    startVoting: () => st.setPhase(me0.id, 'voting'),
    closeVoting: () => st.setPhase(me0.id, 'closed'),
    voteDeadline: me0.voteDeadline || '',
    phaseLabel: isVoting ? '投票受付中' : isClosed ? '結果確定' : '開催前',
    phaseBg: isVoting ? '#BC6A2D' : isClosed ? '#5C5547' : '#32507C',
    mvpLabel: isVoting ? '★ 暫定トップ（投票受付中）' : '★ その日のMVP酒 — 最多得票',
    iGo, goCount: goNames.length, attendees: me0.attendees || goNames.length,
    goingAvatars,
    goToggle: () => st.toggleGoing(me0.id),
    goLabel: iGo ? '参加予定です ✓' : '参加する',
    goBg: iGo ? '#32507C' : '#FDFBF5', goColor: iGo ? '#FDFBF5' : '#32507C',
    bringList, bringCount: allBring.length,
    hasBring: allBring.length > 0,
    hasDup: Object.keys(brandCounts).some((k) => brandCounts[k] > 1),
    myDeclared: !!myB, notMyDeclared: !myB,
    declareClick: () => st.openDeclare(me0.id),
    declareLabel: myB ? '持ち寄りを変更する' : '自分の一本を宣言する',
    cancelDeclare: () => st.cancelDeclare(me0.id),
    backHome: () => st.nav('home'),
    totalVotesLabel: totalVotes + '票',
    myVoted: !!myVote,
    canVote: isVoting,
    lineup: sortedLineup.map((l, i) => {
      const br = byId(l.brandId) || ({} as any); const mm = memberOf(l.broughtBy);
      const vc = voteCountOf(l.brandId);
      const voted = myVote === l.brandId;
      return { rank: i + 1, rankLabel: ['壱', '弐', '参', '四', '五'][i] || (i + 1), isMvp: mvpBrandId === l.brandId, brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, broughtBy: mm.display || mm.name, avatar: mm.avatar, avatarBg: mm.avatarBg, score: l.score.toFixed(1), stars: starStr(Math.round(l.score)), votes: vc + '票', comment: l.comment || '', brandClick: () => st.openDetail(l.brandId), canVote: isVoting, voted, voteLabel: voted ? '投票済み ✓' : 'MVPに投票', voteBg: voted ? '#BC6A2D' : '#FDFBF5', voteColor: voted ? '#FDFBF5' : '#BC6A2D', voteClick: () => st.voteMvp(me0.id, l.brandId) };
    }),
    mvp: showLineup && mvpBrandId ? (() => { const br = byId(mvpBrandId) || ({} as any); const lp = lineupData.find((x) => x.brandId === mvpBrandId) || ({} as any); const mm = memberOf(lp.broughtBy); return { brandName: br.name, brandSub: br.brewery + ' / ' + br.pref, broughtBy: mm.display || mm.name, votesLabel: voteCountOf(mvpBrandId) + '票', comment: lp.comment || '', brandClick: () => st.openDetail(mvpBrandId) }; })() : {},
  };

  // declare flow
  const dq = (s.declareQuery || '').trim();
  const declareResults = brands.filter((b) => !dq || (b.name + b.brewery + b.pref).indexOf(dq) !== -1).slice(0, 6).map((b) => {
    const taken = allBring.find((x) => x.brandId === b.id && x.member !== meName);
    return { name: b.name, sub: b.brewery + ' / ' + b.pref, taken: !!taken, takenLabel: taken ? (memberOf(taken.member).display + 'さんと かぶり') : '', click: () => st.patch({ declareBrandId: b.id }) };
  });
  const dBrand = byId(s.declareBrandId);
  const dTaken = dBrand ? allBring.find((x) => x.brandId === dBrand.id && x.member !== meName) : null;
  const declare = {
    meetName: me0.name,
    query: s.declareQuery, onQuery: (e: any) => st.patch({ declareQuery: e.target.value }), results: declareResults,
    picked: !!dBrand, pickedName: dBrand ? dBrand.name : '', pickedSub: dBrand ? (dBrand.brewery + ' / ' + dBrand.pref) : '',
    changeBrand: () => st.patch({ declareBrandId: null }),
    dupWarn: !!dTaken, dupWarnLabel: dTaken ? (memberOf(dTaken.member).display + 'さんが既に持ち寄り予定です。かぶってもOKですが、変えると喜ばれるかも。') : '',
    note: s.declareNote, onNote: (e: any) => st.patch({ declareNote: e.target.value }),
    canSubmit: !!dBrand, submit: () => st.submitDeclare(me0.id),
    notPicked: !dBrand,
    cancel: () => st.openMeetup(me0.id),
  };
  const kuraReg = {
    krName: s.krName, onName: (e: any) => st.patch({ krName: e.target.value }),
    krPref: s.krPref, onPref: (e: any) => st.patch({ krPref: e.target.value }),
    krCity: s.krCity, onCity: (e: any) => st.patch({ krCity: e.target.value }),
    krFounded: s.krFounded, onFounded: (e: any) => st.patch({ krFounded: e.target.value }),
    krBrands: s.krBrands, onBrands: (e: any) => st.patch({ krBrands: e.target.value }),
    krDesc: s.krDesc, onDesc: (e: any) => st.patch({ krDesc: e.target.value }),
    submit: () => st.submitKuraReg(),
    done: s.krDone, notDone: !s.krDone,
    registeredName: s.krName,
    another: () => st.resetKuraReg(),
    backToMap: () => st.nav('map'),
  };
  const meetupCreate = {
    ecName: s.ecName, onName: (e: any) => st.patch({ ecName: e.target.value }),
    ecDate: s.ecDate, onDate: (e: any) => st.patch({ ecDate: e.target.value }),
    ecPlace: s.ecPlace, onPlace: (e: any) => st.patch({ ecPlace: e.target.value }),
    ecDesc: s.ecDesc, onDesc: (e: any) => st.patch({ ecDesc: e.target.value }),
    submit: () => st.submitEventCreate(),
    done: s.ecDone, notDone: !s.ecDone,
    registeredName: s.ecName,
    another: () => st.resetEventCreate(),
    goHome: () => st.nav('home'),
    backHome: () => st.nav('home'),
  };

  // kura detail
  const kn0 = route.kuraName;
  const kmeta: any = (kn0 && kuraMeta[kn0]) || {};
  const kBrands = brands.filter((b) => b.brewery === kn0);
  const kPref = kBrands.length ? kBrands[0].pref : '';
  const kRecs: any[] = [];
  s.myRecords.forEach((x, i) => { if (kBrands.some((b) => b.id === x.brandId)) kRecs.push({ rec: x, idx: i }); });
  const kQuery = encodeURIComponent((kn0 || '') + ' ' + (kmeta.city || '') + ' ' + kPref);
  const ku = {
    name: kn0 || '',
    mapSrc: 'https://www.google.com/maps?q=' + kQuery + '&output=embed&hl=ja&z=13',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=' + kQuery,
    meta: kPref + (kmeta.city ? ' ' + kmeta.city : '') + (kmeta.founded ? ' — 創業 ' + kmeta.founded + '年' : ''),
    desc: kmeta.desc || '',
    brandCount: kBrands.length,
    totalRecs: kBrands.reduce((a, b) => a + b.count, 0),
    myCupCount: kRecs.length,
    hasCups: kRecs.length > 0,
    dots: kBrands.map((b) => ({ left: b.x, top: b.y, label: b.name })),
    brands: kBrands.map((b) => ({ name: b.name, cls: b.cls, polish: b.polish, rice: b.rice, rating: b.rating.toFixed(1), pct: Math.round(b.rating / 5 * 100), click: () => st.openDetail(b.id) })),
    cups: kRecs.map((o) => {
      const b = byId(o.rec.brandId) || ({} as any);
      return { name: b.name, date: o.rec.date, stars: starStr(o.rec.rating), memo: o.rec.memo || '(メモなし)', click: () => st.openPost({ src: 'mine', i: o.idx }) };
    }),
  };

  // mypage
  const myList = s.myRecords.map((x, i) => {
    const b = byId(x.brandId) || ({} as any);
    return { name: b.name, sub: b.brewery + ' / ' + b.pref, date: x.date, stars: starStr(x.rating), memo: x.memo || '(メモなし)', tags: x.temps.concat(x.pairing ? ['肴: ' + x.pairing] : []), photo: x.photo || '', hasPhoto: !!x.photo, noPhoto: !x.photo, click: () => st.openPost({ src: 'mine', i }) };
  });
  const wantList = s.wantIds.map((id) => byId(id)).filter(Boolean).map((b: any) => ({ name: b.name, sub: b.brewery + ' / ' + b.pref, click: () => st.openDetail(b.id), buyUrl: 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(b.name) + '/' }));

  // 利き酒師ランク
  const cupsN = s.myRecords.length;
  const rankTiers = [{ min: 0, name: '見習い' }, { min: 1, name: '利き酒入門' }, { min: 5, name: '利き酒人' }, { min: 15, name: '利き酒師' }, { min: 30, name: '利き酒名人' }, { min: 60, name: '酒仙' }];
  let ti = 0; rankTiers.forEach((t, i) => { if (cupsN >= t.min) ti = i; });
  const nextTier = rankTiers[ti + 1];
  const rankPct = nextTier ? Math.min(100, Math.round((cupsN - rankTiers[ti].min) / (nextTier.min - rankTiers[ti].min) * 100)) : 100;
  // 制覇度バッジ
  const prefSet2 = new Set(s.myRecords.map((x) => (byId(x.brandId) || ({} as any)).pref).filter(Boolean));
  const kuraSet2 = new Set(s.myRecords.map((x) => (byId(x.brandId) || ({} as any)).brewery).filter(Boolean));
  const badgeDefs = [
    { icon: '初', label: 'はじめの一杯', on: cupsN >= 1 },
    { icon: '拾', label: '10盃達成', on: cupsN >= 10 },
    { icon: '丗', label: '30盃達成', on: cupsN >= 30 },
    { icon: '蔵', label: '5蔵めぐり', on: kuraSet2.size >= 5 },
    { icon: '県', label: '5県制覇', on: prefSet2.size >= 5 },
    { icon: '燗', label: '燗酒を嗜む', on: s.myRecords.some((x) => (x.temps || []).some((t) => t.indexOf('燗') !== -1)) },
    { icon: '写', label: 'ラベル写真家', on: s.myRecords.some((x) => x.photo) },
    { icon: '全', label: '全国制覇', on: prefSet2.size >= 47 },
  ];
  const badges = badgeDefs.map((b) => ({ icon: b.icon, label: b.label, bg: b.on ? '#32507C' : '#EFEAE0', color: b.on ? '#FDFBF5' : '#BCB29D', labelColor: b.on ? '#2E2A24' : '#A89D8A' }));
  const achievedCount = badgeDefs.filter((b) => b.on).length;

  // 飲める店マップ
  const isBars = s.mapMode === 'bars';
  const barSel = bars.find((b) => b.id === s.barId) || bars[0] || ({} as any);
  const barList = bars.map((b) => ({ name: b.name, area: b.area, type: b.type, sel: b.id === barSel.id, bg: b.id === barSel.id ? '#32507C' : '#FFFFFF', color: b.id === barSel.id ? '#FDFBF5' : '#2E2A24', subColor: b.id === barSel.id ? 'rgba(253,251,245,0.7)' : '#8B8273', click: () => st.patch({ barId: b.id }) }));
  const barView = {
    name: barSel.name, area: barSel.area, type: barSel.type, note: barSel.note,
    mapSrc: 'https://www.google.com/maps?q=' + encodeURIComponent(barSel.venueQ) + '&output=embed&hl=ja&z=15',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(barSel.venueQ),
    brands: (barSel.brands || []).map((id: string) => { const br = byId(id) || ({} as any); return { label: br.name, click: () => st.openDetail(id) }; }),
  };

  return {
    // nav
    navItems,
    goHome: () => st.nav('home'),
    goZukan: () => st.nav('zukan'),
    goMy: () => { if (st.requireLogin()) st.nav('mypage'); },
    // login
    isLogin: route.screen === 'login',
    showChrome: route.screen !== 'login',
    loggedIn: !!s.user, loggedOut: !s.user,
    userAvatar: u.avatar, userName: u.name,
    goLogin: () => st.nav('login'),
    doLogout: () => st.logout(),
    loginTabs, isSignup: s.loginMode === 'signup',
    loginName: s.loginName, onLoginName: (e: any) => st.patch({ loginName: e.target.value }),
    loginEmail: s.loginEmail, onLoginEmail: (e: any) => st.patch({ loginEmail: e.target.value }),
    loginPw: s.loginPw, onLoginPw: (e: any) => st.patch({ loginPw: e.target.value }),
    loginCta: s.loginMode === 'signup' ? '登録してはじめる' : 'ログイン',
    doLoginClick: () => st.doLogin(),
    socialBtns,
    guestClick: () => st.nav('home'),
    startRecordClick: () => st.startRecord(null),
    // responsive
    isMobile: mob && route.screen !== 'login', isDesktopNav: !mob,
    tabLeft: [mkTab('home', 'ホーム'), mkTab('zukan', '図鑑')],
    tabRight: [mkTab('map', 'マップ'), mkTab('mypage', 'マイ')],
    pagePad: mob ? '28px 18px 130px' : '40px 40px 80px',
    pagePadTight: mob ? '20px 18px 130px' : '32px 40px 80px',
    heroCols: mob ? '1fr' : '1.5fr 1fr',
    homeSplitCols: mob ? '1fr' : '1.5fr 1fr',
    heroTitleSize: mob ? '30px' : '38px',
    mapH: mob ? '300px' : '380px',
    zukanCols: mob ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    detailCols: mob ? '1fr' : '360px 1fr',
    bottleH: mob ? '320px' : '420px',
    specCols: mob ? '1fr 1fr' : '1fr 1fr 1fr',
    postCols: mob ? '1fr' : '260px 1fr',
    postCardPad: mob ? '20px 18px' : '32px 36px',
    myCols: mob ? '1fr' : '1fr 380px',
    isHome: route.screen === 'home', isZukan: route.screen === 'zukan', isDetail: route.screen === 'detail', isRecord: route.screen === 'record', isMy: route.screen === 'mypage', isFeed: route.screen === 'feed', isPost: route.screen === 'post' && !!post, isMap: route.screen === 'map', isKura: route.screen === 'kura' && !!route.kuraName,
    // home
    statCups: s.myRecords.length, statBrands: uniqBrands.size, statKura: uniqKura.size,
    today: { name: today.name, sub: subOf(today) },
    todayClick: () => st.openDetail(today.id),
    myDots, feedItems: allFeed.slice(0, 3), feedAll: allFeed, feedCount: allFeed.length, goFeed: () => st.nav('feed'), post: post || {}, ranking,
    // zukan
    searchQuery: s.searchQuery,
    onSearch: (e: any) => st.patch({ searchQuery: e.target.value }),
    tagChips, filteredBrands, resultCount: filteredBrands.length,
    // detail
    d: { name: d.name, brewery: d.brewery, pref: d.pref, cls: d.cls, class: d.cls, polish: d.polish, rice: d.rice, yeast: d.yeast, smv: d.smv, abv: d.abv, temp: d.temp, desc: d.desc, x: d.x, y: d.y, rating: d.rating.toFixed(1), count: d.count },
    dStars: starStr(Math.round(d.rating)),
    dRecordClick: () => { st.patch({ fromDetail: true }); st.startRecord(d.id); },
    dWantClick: () => { if (!st.requireLogin()) return; st.patch({ wantIds: wanted ? s.wantIds.filter((x) => x !== d.id) : s.wantIds.concat([d.id]) }); },
    dWantLabel: wanted ? '飲みたいリスト追加済 ✓' : '飲みたいリストへ',
    dWantBg: wanted ? '#32507C' : '#FDFBF5',
    dWantColor: wanted ? '#FDFBF5' : '#32507C',
    dHasMyPoint: !!myRecForD, dMyX: myRecForD ? myRecForD.x : 0, dMyY: myRecForD ? myRecForD.y : 0,
    dReviews, dShop,
    // record
    recSteps, recProgress: r.step / 4 * 100,
    recTitle: titles[r.step - 1][0], recSub: titles[r.step - 1][1],
    isRecStep1: r.step === 1, isRecStep2: r.step === 2, isRecStep3: r.step === 3, isRecStep4: r.step === 4,
    recQuery: r.query, onRecSearch: (e: any) => st.setRec({ query: e.target.value }), recResults,
    recBrandName: recBrand ? recBrand.name : '', recBrandSub: recBrand ? recBrand.brewery + ' / ' + recBrand.pref + ' — ' + recBrand.cls : '',
    recChangeBrand: () => { st.patch({ fromDetail: false }); st.setRec({ step: 1 }); },
    onMapTap: (e: any) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.min(95, Math.max(5, Math.round((e.clientX - rect.left) / rect.width * 100)));
      const y = Math.min(95, Math.max(5, Math.round((e.clientY - rect.top) / rect.height * 100)));
      st.setRec({ x, y });
    },
    recHasPoint: r.x != null, recX: r.x, recY: r.y, recGhostDots,
    recTasteLabel, recSweet: r.sweet, recSweetLabel,
    onSweet: (e: any) => st.setRec({ sweet: Number(e.target.value) }),
    recStars, recRatingLabel: r.rating > 0 ? r.rating.toFixed(1) : '未評価',
    tempChips, recPairing: r.pairing,
    onPairing: (e: any) => st.setRec({ pairing: e.target.value }),
    recMemo: r.memo, onMemo: (e: any) => st.setRec({ memo: e.target.value }),
    onPhoto: (e: any) => { const f = e.target.files && e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => st.setRec({ photo: rd.result as string }); rd.readAsDataURL(f); e.target.value = ''; },
    onPhotoRemove: (e: any) => { e.stopPropagation(); st.setRec({ photo: null }); },
    recPhoto: r.photo || '', recHasPhoto: !!r.photo, recNoPhoto: !r.photo,
    recStarsStr: starStr(r.rating), recEnjoyLabel: enjoyParts,
    recShowFooter: r.step >= 2, recBack, recNext,
    recNextLabel: r.step === 2 ? (step2Valid ? 'つぎへ — 合わせ' : 'マップに打点と評価をどうぞ') : r.step === 3 ? 'つぎへ — メモ' : '記す — 保存する',
    recNextBg: nextOk ? '#32507C' : '#C9C2B2',
    recNextCursor: nextOk ? 'pointer' : 'default',
    // mypage
    myList, wantList,
    rankName: rankTiers[ti].name, rankPct, hasNextRank: !!nextTier,
    rankNextLabel: nextTier ? ('次「' + nextTier.name + '」まで あと' + (nextTier.min - cupsN) + '盃') : '最高位に到達!',
    cupsCount: cupsN,
    badges, achievedCount, badgeTotal: badgeDefs.length,
    badgePref: prefSet2.size, badgeKura: kuraSet2.size,
    // 飲める店
    isBars, mapModeKura: !isBars, mapModeBars: isBars,
    kuraTabBg: isBars ? 'transparent' : '#32507C', kuraTabColor: isBars ? '#8B8273' : '#FDFBF5',
    barsTabBg: isBars ? '#BC6A2D' : 'transparent', barsTabColor: isBars ? '#FDFBF5' : '#8B8273',
    setMapKura: () => st.patch({ mapMode: 'kura' }), setMapBars: () => st.patch({ mapMode: 'bars' }),
    barList, barView,
    // kura map
    prefTiles, mapKuras, prefChipList, mapStats,
    goMap: () => st.nav('map'),
    ku,
    // SAKE MEETUP
    homeNext, homePast, homeVoting, hasVoting: !!homeVoting, meetup, declare, meetupCreate,
    isMeetup: route.screen === 'meetup', isDeclare: route.screen === 'declare',
    isMeetupCreate: route.screen === 'eventCreate',
    openMeetupCreate: () => st.openEventCreate(),
    isKuraReg: route.screen === 'kuraReg',
    kuraReg, openKuraReg: () => st.openKuraReg(),
    meetCols: mob ? '1fr' : '1.5fr 1fr',
    kuraCols: mob ? '1fr' : '1.4fr 1fr',
    kuraBrandCols: mob ? '1fr' : 'repeat(2, 1fr)',
    dBreweryClick: () => st.openKura(d.brewery),
    mapHasSel: !!s.mapPref, mapNoSel: !s.mapPref, mapSelPref: s.mapPref || '',
    mapCols: mob ? '1fr' : '1.55fr 1fr',
    mapPanelPad: mob ? '14px 12px' : '24px',
    mapGap: mob ? '4px' : '6px',
    // comments
    commentDraft: s.commentDraft,
    onCommentDraft: (e: any) => st.patch({ commentDraft: e.target.value }),
    editDraft: s.editDraft,
    onEditDraft: (e: any) => st.patch({ editDraft: e.target.value }),
    editSave: () => st.saveEditComment(),
    editCancel: () => st.patch({ editingComment: null, editDraft: '' }),
    onEditKey: (e: any) => { const composing = (e.nativeEvent && e.nativeEvent.isComposing) || e.keyCode === 229; if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !composing) { e.preventDefault(); st.saveEditComment(); } else if (e.key === 'Escape') st.patch({ editingComment: null, editDraft: '' }); },
    // toast
    toastVisible: !!s.toast, toastMsg: s.toast,
    stopProp: (e: any) => e.stopPropagation(),
  };
}
