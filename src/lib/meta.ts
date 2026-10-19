import type { Metadata } from 'next';

const SUFFIX = '酒マニア';

export interface MetaImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

// 各ページの title / description / OGP(og:title,og:description) をまとめて生成。
// <title> は layout の title テンプレート(`%s — 酒マニア`)で suffix が付くため title は素のまま、
// og:title は Slack 等の展開用に suffix 込みのフル文字列を入れる。
// image の URL は相対パスのままでよい(layout の metadataBase が絶対 URL にする)。
export function pageMeta(title: string, description: string, options?: { image?: MetaImage }): Metadata {
  const full = `${title} — ${SUFFIX}`;
  const image = options?.image;
  if (!image) {
    return {
      title,
      description,
      openGraph: { title: full, description },
      twitter: { title: full, description },
    };
  }
  return {
    title,
    description,
    openGraph: { title: full, description, images: [image] },
    // 展開で画像を大きく出させる(小さいサムネイルだと QR を読み取れない)
    twitter: { card: 'summary_large_image', title: full, description, images: [image] },
  };
}
