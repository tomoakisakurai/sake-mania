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

// 参照データ（図鑑・酒蔵・MEETUPシード等）は滅多に変わらないので、毎リクエストで
// 7テーブルを再クエリしないよう短期キャッシュする。force-dynamic下での
// コネクション枯渇（"Failed query"）を防ぐ。成功したDB読み取りのみキャッシュし、
// 一時的な失敗時は直近の良好なキャッシュ→なければモックにフォールバック。
const TTL_MS = 60_000;
let cache: { at: number; data: ReferenceData } | null = null;

/**
 * Reads the reference/content collections from Supabase via Drizzle.
 * Falls back to bundled mock data when DATABASE_URL is unset or the DB is empty,
 * so the app runs before/without a configured database.
 */
export async function getReferenceData(): Promise<ReferenceData> {
  // 本番ビルドのページデータ収集ではDBに触れない（ビルドをDB非依存にして
  // 接続詰まりによるビルド失敗を防ぐ。実行時=動的レンダリングではDBを読む）。
  if (process.env.NEXT_PHASE === 'phase-production-build') return mock;

  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const db = getDb();
  if (!db) return mock;

  try {
    const [bRows, mRows, oRows, mtRows, kRows, pRows, barRows] = await Promise.all([
      db.select().from(schema.brands).orderBy(asc(schema.brands.sortOrder)),
      db.select().from(schema.members).orderBy(asc(schema.members.sortOrder)),
      db.select().from(schema.others).orderBy(asc(schema.others.sortOrder)),
      db.select().from(schema.meetups).orderBy(asc(schema.meetups.sortOrder)),
      db.select().from(schema.kuraMeta),
      db.select().from(schema.prefGrid).orderBy(asc(schema.prefGrid.sortOrder)),
      db.select().from(schema.bars).orderBy(asc(schema.bars.sortOrder)),
    ]);

    // Require a fully-seeded DB; otherwise fall back to mock so screens that
    // assume non-empty collections (meetups[0], bars[0], byId('kuheiji'), …) don't break.
    if (!bRows.length || !mRows.length || !oRows.length || !mtRows.length || !kRows.length || !pRows.length || !barRows.length) {
      console.warn('[getReferenceData] DB is not fully seeded — falling back to mock.');
      return mock;
    }

    const brands: Brand[] = bRows.map((r) => ({
      id: r.id, name: r.name, brewery: r.brewery, pref: r.pref, cls: r.cls, polish: r.polish,
      rice: r.rice, yeast: r.yeast, smv: r.smv, abv: r.abv, temp: r.temp, x: num(r.x), y: num(r.y),
      rating: num(r.rating), count: num(r.count), tags: arr(r.tags), desc: r.description,
    }));
    const members: Member[] = mRows.map((r) => ({
      name: r.name, display: r.display, avatar: r.avatar, avatarBg: r.avatarBg,
      dept: r.dept ?? undefined, taste: r.taste ?? undefined,
    }));
    const others: OtherRec[] = oRows.map((r) => ({
      rid: r.rid, nomi: num(r.nomi), comments: arr(r.comments), user: r.user, avatar: r.avatar,
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

    const data: ReferenceData = { brands, others, members, meetups, bars, kuraMeta, prefGrid };
    cache = { at: Date.now(), data };
    return data;
  } catch (err) {
    console.error('[getReferenceData] DB read failed, falling back to mock:', err);
    // 一時的な接続失敗時は直近の良好なキャッシュを返し、無ければモック
    return cache?.data ?? mock;
  }
}
