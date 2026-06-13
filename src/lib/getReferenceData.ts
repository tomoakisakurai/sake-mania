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

const mock: ReferenceData = {
  brands: mockBrands,
  others: mockOthers,
  members: mockMembers,
  meetups: mockMeetups,
  bars: mockBars,
  kuraMeta: mockKuraMeta,
  prefGrid: mockPrefGrid,
};

/**
 * Reads the reference/content collections from Supabase via Drizzle.
 * Falls back to bundled mock data when DATABASE_URL is unset or the DB is empty,
 * so the app runs before/without a configured database.
 */
export async function getReferenceData(): Promise<ReferenceData> {
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

    if (!bRows.length) return mock;

    const brands: Brand[] = bRows.map((r) => ({
      id: r.id, name: r.name, brewery: r.brewery, pref: r.pref, cls: r.cls, polish: r.polish,
      rice: r.rice, yeast: r.yeast, smv: r.smv, abv: r.abv, temp: r.temp, x: r.x, y: r.y,
      rating: r.rating, count: r.count, tags: r.tags, desc: r.description,
    }));
    const members: Member[] = mRows.map((r) => ({
      name: r.name, display: r.display, avatar: r.avatar, avatarBg: r.avatarBg,
      dept: r.dept ?? undefined, taste: r.taste ?? undefined,
    }));
    const others: OtherRec[] = oRows.map((r) => ({
      rid: r.rid, nomi: r.nomi, comments: r.comments, user: r.user, avatar: r.avatar,
      avatarBg: r.avatarBg, time: r.time, place: r.place, brandId: r.brandId, rating: r.rating,
      x: r.x, y: r.y, sweet: r.sweet, temps: r.temps, pairing: r.pairing, memo: r.memo, date: r.date,
    }));
    const meetups: Meetup[] = mtRows.map((r) => ({
      id: r.id, status: r.status as Meetup['status'], phase: r.phase as Meetup['phase'],
      name: r.name, dateShort: r.dateShort, dateLabel: r.dateLabel, place: r.place, theme: r.theme,
      host: r.host, capacity: r.capacity ?? undefined, attendees: r.attendees ?? undefined,
      voteDeadline: r.voteDeadline ?? undefined, going: r.going ?? undefined,
      bring: r.bring ?? undefined, lineup: r.lineup ?? undefined,
    }));
    const bars: Bar[] = barRows.map((r) => ({
      id: r.id, name: r.name, area: r.area, type: r.type, venueQ: r.venueQ, brands: r.brands, note: r.note,
    }));
    const kuraMeta: Record<string, KuraMetaEntry> = {};
    for (const r of kRows) kuraMeta[r.brewery] = { city: r.city, founded: r.founded, desc: r.description };
    const prefGrid = pRows.map((r) => [r.name, r.col, r.row] as [string, number, number]);

    return { brands, others, members, meetups, bars, kuraMeta, prefGrid };
  } catch (err) {
    console.error('[getReferenceData] DB read failed, falling back to mock:', err);
    return mock;
  }
}
