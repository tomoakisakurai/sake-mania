import 'server-only';
import { asc } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import {
  brands as mockBrands,
  others as mockOthers,
  members as mockMembers,
  meetups as mockMeetups,
  bars as mockBars,
  kuraMeta as mockKuraMeta,
  prefGrid as mockPrefGrid,
} from '@/data';
import type { Brand, OtherRec, Member, Meetup, Bar, KuraMetaEntry } from '@/types';

export interface ReferenceData {
  brands: Brand[];
  others: OtherRec[];
  members: Member[];
  meetups: Meetup[];
  bars: Bar[];
  kuraMeta: Record<string, KuraMetaEntry>;
  prefGrid: [string, number, number][];
}

// 初回ペイントに必要な土台（SSRでサーバー取得）。
export type CoreReferenceData = Pick<ReferenceData, 'brands' | 'members'>;
// 初回ペイントに不要で、描画後にクライアントから後追い取得する分。
export type DeferredReferenceData = Pick<ReferenceData, 'others' | 'meetups' | 'bars' | 'kuraMeta' | 'prefGrid'>;

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
  members: mockMembers,
  meetups: mockMeetups,
  bars: mockBars,
  kuraMeta: mockKuraMeta,
  prefGrid: mockPrefGrid,
};
const mockCore: CoreReferenceData = { brands: mock.brands, members: mock.members };
const mockDeferred: DeferredReferenceData = {
  others: mock.others, meetups: mock.meetups, bars: mock.bars, kuraMeta: mock.kuraMeta, prefGrid: mock.prefGrid,
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
    rating: num(r.rating), count: num(r.count), tags: arr(r.tags), desc: r.description,
  }));
}
function mapMembers(rows: (typeof schema.members.$inferSelect)[]): Member[] {
  return rows.map((r) => ({
    name: r.name, display: r.display, avatar: r.avatar, avatarBg: r.avatarBg,
    dept: r.dept ?? undefined, taste: r.taste ?? undefined,
  }));
}

/**
 * 初回ペイントに必要な土台データ（銘柄カタログ・メンバー）。
 * layout の SSR から呼ぶ。DB未設定・未シード・失敗時は mock にフォールバック。
 */
export async function getCoreReferenceData(): Promise<CoreReferenceData> {
  if (isBuildPhase()) return mockCore;
  if (coreCache && Date.now() - coreCache.at < TTL_MS) return coreCache.data;

  const db = getDb();
  if (!db) return mockCore;

  try {
    // 2テーブルだけなので並列でもプール(max:5)に十分収まる。
    const [bRows, mRows] = await Promise.all([
      db.select().from(schema.brands).orderBy(asc(schema.brands.sortOrder)),
      db.select().from(schema.members).orderBy(asc(schema.members.sortOrder)),
    ]);
    if (!bRows.length || !mRows.length) {
      console.warn('[getCoreReferenceData] DB not seeded — falling back to mock.');
      return mockCore;
    }
    const data: CoreReferenceData = { brands: mapBrands(bRows), members: mapMembers(mRows) };
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
    // 5テーブルを2バッチ(3本/2本)に分割し、同時接続をプール(max:5)内に抑える。
    const [oRows, mtRows, barRows] = await Promise.all([
      db.select().from(schema.others).orderBy(asc(schema.others.sortOrder)),
      db.select().from(schema.meetups).orderBy(asc(schema.meetups.sortOrder)),
      db.select().from(schema.bars).orderBy(asc(schema.bars.sortOrder)),
    ]);
    const [kRows, pRows] = await Promise.all([
      db.select().from(schema.kuraMeta),
      db.select().from(schema.prefGrid).orderBy(asc(schema.prefGrid.sortOrder)),
    ]);
    if (!oRows.length || !mtRows.length || !barRows.length || !kRows.length || !pRows.length) {
      console.warn('[getDeferredReferenceData] DB not seeded — falling back to mock.');
      return mockDeferred;
    }

    const others: OtherRec[] = oRows.map((r) => ({
      recordId: r.recordId, nomi: num(r.nomi), comments: arr(r.comments), user: r.user, avatar: r.avatar,
      avatarBg: r.avatarBg, time: r.time, place: r.place, brandId: r.brandId, rating: num(r.rating),
      x: num(r.x), y: num(r.y), sweet: num(r.sweet), temps: arr(r.temps), pairing: r.pairing, memo: r.memo, date: r.date,
    }));
    const meetups: Meetup[] = mtRows.map((r) => ({
      id: r.id, status: r.status as Meetup['status'], phase: r.phase as Meetup['phase'],
      name: r.name, dateShort: r.dateShort, dateLabel: r.dateLabel, place: r.place, theme: r.theme,
      host: r.host, capacity: r.capacity == null ? undefined : num(r.capacity), attendees: r.attendees == null ? undefined : num(r.attendees),
      voteDeadline: r.voteDeadline ?? undefined,
      going: r.going == null ? undefined : arr(r.going),
      bring: r.bring == null ? undefined : arr(r.bring),
      lineup: r.lineup == null ? undefined : arr(r.lineup),
    }));
    const bars: Bar[] = barRows.map((r) => ({
      id: r.id, name: r.name, area: r.area, type: r.type, venueQ: r.venueQ, brands: arr(r.brands), note: r.note,
    }));
    const kuraMeta: Record<string, KuraMetaEntry> = {};
    for (const r of kRows) kuraMeta[r.brewery] = { city: r.city, founded: num(r.founded), desc: r.description };
    const prefGrid = pRows.map((r) => [r.name, num(r.col), num(r.row)] as [string, number, number]);

    const data: DeferredReferenceData = { others, meetups, bars, kuraMeta, prefGrid };
    deferredCache = { at: Date.now(), data };
    return data;
  } catch (err) {
    console.error('[getDeferredReferenceData] DB read failed, falling back to mock:', err);
    return deferredCache?.data ?? mockDeferred;
  }
}
