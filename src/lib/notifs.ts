// モック通知データ。バックエンド連携前のデモ用。
// path はクリック時の遷移先、icon は漢字一文字+背景色で表現する。
export type Notif = {
  id: string;
  kind: 'meetup' | 'vote' | 'reaction' | 'comment' | 'event' | 'welcome';
  icon: string;
  bg: string;
  text: string;
  time: string;
  path: string;
};

export const NOTIFS: Notif[] = [
  { id: 'n1', kind: 'meetup', icon: '盃', bg: 'var(--color-accent)', text: '次回SAKE MEETUPに新しい持ち寄り宣言:燗 かおりさんが「鳳凰美田 剱」を持参予定', time: '20分前', path: '/meetups' },
  { id: 'n2', kind: 'vote', icon: '★', bg: 'var(--color-primary)', text: '初夏の特別SAKE MEETUPのMVP投票が始まりました。締切は6月14日(日) 23:59', time: '2時間前', path: '/meetups' },
  { id: 'n3', kind: 'reaction', icon: '杯', bg: 'var(--color-success)', text: '蔵本 太郎さんがあなたの「新政 No.6」の記録にのみたいねしました', time: '昨日', path: '/mypage' },
  { id: 'n4', kind: 'comment', icon: '言', bg: '#8B6B43', text: '銘柄 探さんがイベントにコメントしました', time: '昨日', path: '/events' },
  { id: 'n5', kind: 'event', icon: '酒', bg: 'var(--color-accent-dark)', text: 'にいがた酒の陣 2026 — 開催まであと7日。チケットを忘れずに', time: '2日前', path: '/events' },
  { id: 'n6', kind: 'welcome', icon: '祝', bg: '#A0825F', text: '新メンバー「江戸前 はる」さんが日本酒部に加わりました', time: '3日前', path: '/member/edomae_haru' },
];
