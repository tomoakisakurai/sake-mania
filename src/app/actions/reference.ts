'use server';
import { getDeferredReferenceData } from '@/lib/getReferenceData';
import type { DeferredReferenceData } from '@/lib/getReferenceData';

/** 描画後にクライアントから後追い取得する参照データ（マップ系・サンプル投稿・MEETUPシード）。 */
export async function getDeferredReference(): Promise<DeferredReferenceData> {
  return getDeferredReferenceData();
}
