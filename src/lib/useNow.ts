'use client';
import { useEffect, useState } from 'react';

// 一定間隔で現在時刻stateを更新するhook。
// 時刻ベースの派生表示(「開催中」バッジ等)で、ページ開いたままでも
// 表示が自動更新されるように使う。デフォルト60秒。
export function useNow(intervalMs: number = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
