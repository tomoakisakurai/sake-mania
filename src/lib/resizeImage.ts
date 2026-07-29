// ブラウザ専用。写真ファイルを長辺 maxEdge px 以下の JPEG データURLに縮小する。
// 写真は server action にデータURLのまま送る設計のため、ボディ上限
// (next.config.ts の serverActions.bodySizeLimit)を超えないよう、
// 写真の取り込み口では必ずこれを通すこと。

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

export async function fileToResizedDataUrl(file: File, maxEdge = 1200, quality = 0.8): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);
  try {
    const image = await loadImage(originalDataUrl);
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) return originalDataUrl;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    // デコードできない形式はそのまま返す(送信側の try/catch とサイズ上限に委ねる)
    return originalDataUrl;
  }
}
