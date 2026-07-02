import 'server-only';
import { asc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import {
  brands as mockBrands,
  others as mockOthers,
  bars as mockBars,
  kuraMeta as mockKuraMeta,
  prefGrid as mockPrefGrid,
} from '@/data';
import type { Brand, OtherRec, Bar, KuraMetaEntry } from '@/types';

// 図鑑コンテンツ等の「参照データ」(シード済みでほぼ不変)。
// メンバーは profiles、MEETUPは meetup_events に移行済みのため含まない。
// others はサンプル投稿だが、銘柄詳細のシードレビューとして現役なので残している。
export interface ReferenceData {
  brands: Brand[];
  others: OtherRec[];
  bars: Bar[];
  kuraMeta: Record<string, KuraMetaEntry>;
  prefGrid: [string, number, number][];
}

// 初回ペイントに必要な土台（SSRでサーバー取得）。
export type CoreReferenceData = Pick<ReferenceData, 'brands'>;
// 初回ペイントに不要で、描画後にクライアントから後追い取得する分。
export type DeferredReferenceData = Pick<ReferenceData, 'others' | 'bars' | 'kuraMeta' | 'prefGrid'>;

// jsonb columns can come back as a parsed array OR as a raw JSON string
// depending on the driver/runtime; normalize to an array either way.
function arr(v: unknown): any[] { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
  }
  return [];
}

// numeric columns can come back as strings depending on the driver; coerce.
function num(v: unknown): number {
  if (typeof v === 'number') return v;
  if (v == null) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

const mock: ReferenceData = {
  brands: mockBrands,
  others: mockOthers,
  bars: mockBars,
  kuraMeta: mockKuraMeta,
  prefGrid: mockPrefGrid,
};
const mockCore: CoreReferenceData = { brands: mock.brands };
const mockDeferred: DeferredReferenceData = {
  others: mock.others, bars: mock.bars, kuraMeta: mock.kuraMeta, prefGrid: mock.prefGrid,
};

const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

// 参照データ（滅多に変わらない）は毎リクエストで再クエリせず短期キャッシュする。
// core/deferred を別々にキャッシュし、それぞれ独立にフォールバックできるようにする。
const TTL_MS = 60_000;
let coreCache: { at: number; data: CoreReferenceData } | null = null;
let deferredCache: { at: number; data: DeferredReferenceData } | null = null;

function mapBrands(rows: (typeof schema.brands.$inferSelect)[]): Brand[] {
  return rows.map((r) => ({
    id: r.id, name: r.name, brewery: r.brewery, pref: r.pref, cls: r.cls, polish: r.polish,
    rice: r.rice, yeast: r.yeast, smv: r.smv, abv: r.abv, temp: r.temp, x: num(r.x), y: num(r.y),
    rating: num(r.rating), count: num(r.count), tags: arr(r.tags), desc: r.description, photo: r.photo,
  }));
}

/**
 * 初回ペイントに必要な土台データ（銘柄カタログ）。
 * layout の SSR から呼ぶ。DB未設定・未シード・失敗時は mock にフォールバック。
 */
export async function getCoreReferenceData(): Promise<CoreReferenceData> {
  if (isBuildPhase()) return mockCore;
  if (coreCache && Date.now() - coreCache.at < TTL_MS) return coreCache.data;

  const db = getDb();
  if (!db) return mockCore;

  try {
    const bRows = await db.select().from(schema.brands).orderBy(asc(schema.brands.sortOrder));
    if (!bRows.length) {
      console.warn('[getCoreReferenceData] DB not seeded — falling back to mock.');
      return mockCore;
    }
    const data: CoreReferenceData = { brands: mapBrands(bRows) };
    coreCache = { at: Date.now(), data };
    return data;
  } catch (err) {
    console.error('[getCoreReferenceData] DB read failed, falling back to mock:', err);
    return coreCache?.data ?? mockCore;
  }
}

/**
 * 初回ペイントに不要な参照データ（サンプル投稿・MEETUPシード・酒蔵マップ）。
 * クライアントから描画後に後追い取得する（サーバーアクション経由）。
 */
export async function getDeferredReferenceData(): Promise<DeferredReferenceData> {
  if (isBuildPhase()) return mockDeferred;
  if (deferredCache && Date.now() - deferredCache.at < TTL_MS) return deferredCache.data;

  const db = getDb();
  if (!db) return mockDeferred;

  try {
    // 4テーブルを2バッチ(2本/2本)に分割し、同時接続をプール(max:5)内に抑える。
    const [oRows, barRows] = await Promise.all([
      db.select().from(schema.others).orderBy(asc(schema.others.sortOrder)),
      db.select().from(schema.bars).orderBy(asc(schema.bars.sortOrder)),
    ]);
    const [kRows, pRows] = await Promise.all([
      db.select().from(schema.kuraMeta),
      db.select().from(schema.prefGrid).orderBy(asc(schema.prefGrid.sortOrder)),
    ]);
    if (!oRows.length || !barRows.length || !kRows.length || !pRows.length) {
      console.warn('[getDeferredReferenceData] DB not seeded — falling back to mock.');
      return mockDeferred;
    }

    const others: OtherRec[] = oRows.map((r) => ({
      recordId: r.recordId, nomi: num(r.nomi), comments: arr(r.comments), user: r.user, avatar: r.avatar,
      avatarBg: r.avatarBg, time: r.time, place: r.place, brandId: r.brandId, rating: num(r.rating),
      x: num(r.x), y: num(r.y), sweet: num(r.sweet), temps: arr(r.temps), pairing: r.pairing, memo: r.memo, date: r.date,
    }));
    const bars: Bar[] = barRows.map((r) => ({
      id: r.id, name: r.name, area: r.area, type: r.type, venueQ: r.venueQ, brands: arr(r.brands), note: r.note,
    }));
    const kuraMeta: Record<string, KuraMetaEntry> = {};
    for (const r of kRows) kuraMeta[r.brewery] = { city: r.city, founded: num(r.founded), desc: r.description };
    const prefGrid = pRows.map((r) => [r.name, num(r.col), num(r.row)] as [string, number, number]);

    const data: DeferredReferenceData = { others, bars, kuraMeta, prefGrid };
    deferredCache = { at: Date.now(), data };
    return data;
  } catch (err) {
    console.error('[getDeferredReferenceData] DB read failed, falling back to mock:', err);
    return deferredCache?.data ?? mockDeferred;
  }
}
