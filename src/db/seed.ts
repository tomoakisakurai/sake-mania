// Seeds Supabase with the bundled mock data. Run: `npm run db:seed`
// (requires DATABASE_URL in .env or the environment).
import { readFileSync } from 'node:fs';

// Minimal .env loader so the script works without extra deps.
try {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env file — rely on the ambient environment */ }

import { getDb } from './client';
import * as schema from './schema';
import { brands, others, members, meetups, bars, kuraMeta, prefGrid } from '../data';

async function main() {
  const db = getDb({ direct: true });
  if (!db) {
    console.error('No DB connection string found. Set DATABASE_URL (or POSTGRES_URL / POSTGRES_URL_NON_POOLING) in .env and retry.');
    process.exit(1);
  }

  console.log('Seeding…');

  await db.delete(schema.brands);
  await db.insert(schema.brands).values(
    brands.map((b, i) => ({
      id: b.id, name: b.name, brewery: b.brewery, pref: b.pref, cls: b.cls, polish: b.polish,
      rice: b.rice, yeast: b.yeast, smv: b.smv, abv: b.abv, temp: b.temp, x: b.x, y: b.y,
      rating: b.rating, count: b.count, tags: b.tags, description: b.desc, sortOrder: i,
    })),
  );

  await db.delete(schema.members);
  await db.insert(schema.members).values(
    members.map((m, i) => ({
      name: m.name, display: m.display, avatar: m.avatar, avatarBg: m.avatarBg,
      dept: m.dept ?? null, taste: m.taste ?? null, sortOrder: i,
    })),
  );

  await db.delete(schema.others);
  await db.insert(schema.others).values(
    others.map((o, i) => ({
      recordId: o.recordId, nomi: o.nomi, comments: o.comments, user: o.user, avatar: o.avatar,
      avatarBg: o.avatarBg, time: o.time, place: o.place, brandId: o.brandId, rating: o.rating,
      x: o.x, y: o.y, sweet: o.sweet, temps: o.temps, pairing: o.pairing, memo: o.memo,
      date: o.date, sortOrder: i,
    })),
  );

  await db.delete(schema.meetups);
  await db.insert(schema.meetups).values(
    meetups.map((m, i) => ({
      id: m.id, status: m.status, phase: m.phase, name: m.name, dateShort: m.dateShort,
      dateLabel: m.dateLabel, place: m.place, theme: m.theme, host: m.host,
      capacity: m.capacity ?? null, attendees: m.attendees ?? null, voteDeadline: m.voteDeadline ?? null,
      going: m.going ?? null, bring: m.bring ?? null, lineup: m.lineup ?? null, sortOrder: i,
    })),
  );

  await db.delete(schema.kuraMeta);
  await db.insert(schema.kuraMeta).values(
    Object.entries(kuraMeta).map(([brewery, k]) => ({
      brewery, city: k.city, founded: k.founded, description: k.desc,
    })),
  );

  await db.delete(schema.prefGrid);
  await db.insert(schema.prefGrid).values(
    prefGrid.map((p, i) => ({ name: p[0], col: p[1], row: p[2], sortOrder: i })),
  );

  await db.delete(schema.bars);
  await db.insert(schema.bars).values(
    bars.map((b, i) => ({
      id: b.id, name: b.name, area: b.area, type: b.type, venueQ: b.venueQ,
      brands: b.brands, note: b.note, sortOrder: i,
    })),
  );

  console.log('Seed complete.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
