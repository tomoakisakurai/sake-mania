import type { Brand } from '@/types';

/** 評価値(1〜5)を「★★★☆☆」形式にする */
export const starStr = (n: number) => {
  const k = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return '★'.repeat(k) + '☆'.repeat(5 - k);
};

/** 銘柄のサブラベル(蔵 / 県 — 分類) */
export const subOf = (b: Brand) => b.brewery + ' / ' + b.pref + ' — ' + b.cls;
