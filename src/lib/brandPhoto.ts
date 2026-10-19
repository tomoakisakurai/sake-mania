// 銘柄写真の配信まわりの純関数。brands.photo には base64 のデータURLが入っており、
// SSR ペイロードに載せず画像ルート(/api/brand-photo/[id])から配信する。

const IMAGE_DATA_URL_PATTERN = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/;

/** 画像ルートのURL。version は写真内容のハッシュで、変わればURLも変わる(長期キャッシュ用) */
export function brandPhotoPath(brandId: string, version: string): string {
  return `/api/brand-photo/${encodeURIComponent(brandId)}?v=${encodeURIComponent(version)}`;
}

/** base64 の画像データURLを MIME タイプとバイト列に分解する。形式が違えば null */
export function parseImageDataUrl(dataUrl: string): { mimeType: string; bytes: Buffer } | null {
  const match = IMAGE_DATA_URL_PATTERN.exec(dataUrl);
  if (!match) return null;
  return { mimeType: match[1], bytes: Buffer.from(match[2], 'base64') };
}

/** 画像のデータURL(新しく選んだ写真)かどうか。画像ルートのURLとの判別に使う */
export function isImageDataUrl(value: string): boolean {
  return /^data:image\//.test(value);
}
