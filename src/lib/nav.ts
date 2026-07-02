// ナビ(PC)とタブバー(SP)のビューモデル。Nav/TabBar 両方で使う route→active 判定と
// 項目生成を集約する。コンポーネントは useNavModel() で生成済みの
// navItems/tabLeft/tabRight を受け取って描画するだけ＝presentationalのまま。
import type { RouteState } from '@/lib/routes';
import type { Screen } from '@/types';

// このモジュールが使う store アクションの最小インターフェース
interface NavStore {
  nav: (screen: Screen) => void;
  requireLogin: () => boolean;
}

// ナビ項目(PC) の定義
const NAV_DEF: [Screen, string][] = [
  ['home', 'ホーム'],
  ['meetups', 'MEETUP'],
  ['events', 'イベント'],
  ['members', 'メンバー'],
  ['mypage', 'マイページ'],
];

// 現在のルートで、そのナビ/タブ項目をアクティブ表示するか
function screenActive(route: RouteState, key: Screen): boolean {
  return route.screen === key
    || (key === 'meetups' && (route.screen === 'meetup' || route.screen === 'declare' || route.screen === 'meetupCreate'))
    || (key === 'events' && (route.screen === 'event' || route.screen === 'eventCreate'));
}

// 遷移（マイページのみ要ログイン）
function go(st: NavStore, key: Screen) {
  if (key === 'mypage') { if (st.requireLogin()) st.nav('mypage'); } else st.nav(key);
}

export function buildNavModel(route: RouteState, st: NavStore) {
  const navItems = NAV_DEF.map(([key, label]) => {
    const active = screenActive(route, key);
    return {
      label,
      color: active ? '#2E2A24' : '#5C5547',
      weight: active ? 700 : 400,
      border: active ? '2px solid #32507C' : '2px solid transparent',
      click: () => go(st, key),
    };
  });

  const mkTab = (key: Screen, label: string) => {
    const active = screenActive(route, key);
    return {
      label,
      color: active ? '#32507C' : '#8B8273',
      weight: active ? 700 : 500,
      click: () => go(st, key),
    };
  };

  return {
    navItems,
    tabLeft: [mkTab('home', 'ホーム'), mkTab('meetups', 'MEETUP')],
    tabRight: [mkTab('events', 'イベント'), mkTab('members', 'メンバー')],
  };
}

// SP ハンバーガーメニュー項目(タブバーから外れた導線をここで補う)
export function buildMenuItems(st: NavStore & { openMeetupCreate: () => void; openKuraReg: () => void }, isAdmin: boolean) {
  return [
    { label: 'イベント情報', click: () => st.nav('events') },
    { label: '銘柄図鑑', click: () => st.nav('zukan') },
    { label: '酒蔵マップ', click: () => st.nav('map') },
    { label: 'メンバー', click: () => st.nav('members') },
    { label: 'みんなの利き酒帳', click: () => st.nav('feed') },
    { label: 'SAKE MEETUPを立てる', click: () => st.openMeetupCreate() },
    ...(isAdmin ? [
      { label: '酒蔵を登録する', click: () => st.openKuraReg() },
      { label: '銘柄を登録する', click: () => st.nav('brandReg') },
    ] : []),
  ];
}
