import type { Metadata } from 'next';

const SUFFIX = '酒マニア';

// 各ページの title / description / OGP(og:title,og:description) をまとめて生成。
// <title> は layout の title テンプレート(`%s — 酒マニア`)で suffix が付くため title は素のまま、
// og:title は Slack 等の展開用に suffix 込みのフル文字列を入れる。
export function pageMeta(title: string, description: string): Metadata {
  const full = `${title} — ${SUFFIX}`;
  return {
    title,
    description,
    openGraph: { title: full, description },
    twitter: { title: full, description },
  };
}
