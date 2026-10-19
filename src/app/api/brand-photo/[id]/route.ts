import type { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { parseImageDataUrl } from '@/lib/brandPhoto';

// 銘柄写真(brands.photo の base64 データURL)を画像として配信する。
// 図鑑は未ログインでも閲覧できる公開コンテンツなので認証はしない。
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  if (!db) return new Response(null, { status: 404 });

  const rows = await db.select({ photo: schema.brands.photo }).from(schema.brands).where(eq(schema.brands.id, id));
  const photo = rows[0]?.photo;
  if (!photo) return new Response(null, { status: 404 });

  const image = parseImageDataUrl(photo);
  if (!image) return new Response(null, { status: 404 });

  // ?v= (写真内容のハッシュ) 付きなら内容が変わるとURLも変わるので長期キャッシュできる
  const cacheControl = request.nextUrl.searchParams.get('v')
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';
  return new Response(new Uint8Array(image.bytes), {
    headers: {
      'Content-Type': image.mimeType,
      'Content-Length': String(image.bytes.length),
      'Cache-Control': cacheControl,
    },
  });
}
