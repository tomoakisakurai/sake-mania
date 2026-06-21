// MEETUP の「開催中」判定。phase は before/voting/closed の3値だが、
// before かつ eventDate が当日(端末ローカル時刻)であれば表示上「開催中」と扱う。
// phase が voting/closed に進めば自動で「開催中」ではなくなる(幹事が
// MVP投票開始 / 締切を実行した時点で終了したと見なす)。

function isSameLocalDay(eventDate: string, now: Date): boolean {
  const [y, m, d] = eventDate.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) return false;
  return now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d;
}

export function isMeetupOngoing(eventDate: string | null | undefined, now: Date): boolean {
  if (!eventDate) return false;
  return isSameLocalDay(eventDate, now);
}
