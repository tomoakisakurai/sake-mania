import { pgTable, text, integer, real, jsonb, uuid, timestamp, boolean, primaryKey, date } from 'drizzle-orm/pg-core';
import type { Comment, MeetupBring, MeetupLineup } from '../types';

// Reference / content tables. Nested arrays are stored as jsonb to keep the
// read model identical to the prototype's data shapes (faithful 1:1 migration).

export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brewery: text('brewery').notNull(),
  pref: text('pref').notNull(),
  cls: text('cls').notNull(),
  polish: text('polish').notNull(),
  rice: text('rice').notNull(),
  yeast: text('yeast').notNull(),
  smv: text('smv').notNull(),
  abv: text('abv').notNull(),
  temp: text('temp').notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  rating: real('rating').notNull(),
  count: integer('count').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  description: text('description').notNull(),
  photo: text('photo'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const members = pgTable('members', {
  name: text('name').primaryKey(),
  display: text('display').notNull(),
  avatar: text('avatar').notNull(),
  avatarBg: text('avatar_bg').notNull(),
  dept: text('dept'),
  taste: text('taste'),
  hometown: text('hometown'),
  hometownNote: text('hometown_note'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const others = pgTable('others', {
  recordId: text('rid').primaryKey(),
  nomi: integer('nomi').notNull(),
  comments: jsonb('comments').$type<Comment[]>().notNull(),
  user: text('user').notNull(),
  avatar: text('avatar').notNull(),
  avatarBg: text('avatar_bg').notNull(),
  time: text('time').notNull(),
  place: text('place').notNull(),
  brandId: text('brand_id').notNull(),
  rating: integer('rating').notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  sweet: integer('sweet').notNull(),
  temps: jsonb('temps').$type<string[]>().notNull(),
  pairing: text('pairing').notNull(),
  memo: text('memo').notNull(),
  date: text('date').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const meetups = pgTable('meetups', {
  id: text('id').primaryKey(),
  status: text('status').notNull(),
  phase: text('phase').notNull(),
  name: text('name').notNull(),
  dateShort: text('date_short').notNull(),
  dateLabel: text('date_label').notNull(),
  place: text('place').notNull(),
  theme: text('theme').notNull(),
  host: text('host').notNull(),
  capacity: integer('capacity'),
  attendees: integer('attendees'),
  voteDeadline: text('vote_deadline'),
  going: jsonb('going').$type<string[]>(),
  bring: jsonb('bring').$type<MeetupBring[]>(),
  lineup: jsonb('lineup').$type<MeetupLineup[]>(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const kuraMeta = pgTable('kura_meta', {
  brewery: text('brewery').primaryKey(),
  city: text('city').notNull(),
  founded: integer('founded').notNull(),
  description: text('description').notNull(),
});

export const prefGrid = pgTable('pref_grid', {
  name: text('name').primaryKey(),
  col: integer('col').notNull(),
  row: integer('row').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const bars = pgTable('bars', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  area: text('area').notNull(),
  type: text('type').notNull(),
  venueQ: text('venue_q').notNull(),
  brands: jsonb('brands').$type<string[]>().notNull(),
  note: text('note').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ===== ユーザーデータ（書き込み系）=====

// auth.users と1:1のプロフィール（表示名・アバター）。ログイン時にupsert。
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // = auth.users.id
  nickname: text('nickname').notNull(),
  avatar: text('avatar').notNull(),
  avatarBg: text('avatar_bg').notNull().default('#DDD3BE'),
  isAdmin: boolean('is_admin').notNull().default(false),
  // プロフィール拡張(任意項目)
  photoUrl: text('photo_url'),       // 顔写真URL(設定があればイニシャル代わりに表示)
  dept: text('dept'),                // 所属部署(例: プロダクト部)
  hometown: text('hometown'),        // 出身地(都道府県名)
  bio: text('bio'),                  // ひとこと自己紹介
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// テイスティング記録（ログインユーザーに紐づく）
export const records = pgTable('records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  brandId: text('brand_id').notNull(),
  rating: integer('rating').notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  sweet: integer('sweet').notNull(),
  temps: jsonb('temps').$type<string[]>().notNull(),
  pairing: text('pairing').notNull().default(''),
  memo: text('memo').notNull().default(''),
  photo: text('photo'),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// のみたいね（1ユーザー1レコード1回）
export const nomi = pgTable('nomi', {
  recordId: uuid('record_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.recordId, t.userId] })]);

// コメント
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  recordId: uuid('record_id').notNull(),
  userId: uuid('user_id').notNull(),
  text: text('text').notNull(),
  edited: boolean('edited').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ===== MEETUP（ユーザー作成）=====
export const meetupEvents = pgTable('meetup_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  dateLabel: text('date_label').notNull(),
  place: text('place').notNull(),
  theme: text('theme').notNull().default(''),
  hostId: uuid('host_id').notNull(),
  phase: text('phase').notNull().default('before'), // before | voting | closed
  voteDeadline: text('vote_deadline'),
  eventDate: date('event_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 出欠
export const meetupAttendees = pgTable('meetup_attendees', {
  meetupId: uuid('meetup_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.meetupId, t.userId] })]);

// 持ち寄り宣言（1人1本）
export const meetupBrings = pgTable('meetup_brings', {
  meetupId: uuid('meetup_id').notNull(),
  userId: uuid('user_id').notNull(),
  brandId: text('brand_id').notNull(),
  note: text('note').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.meetupId, t.userId] })]);

// MVP投票（1人1票）
export const meetupVotes = pgTable('meetup_votes', {
  meetupId: uuid('meetup_id').notNull(),
  userId: uuid('user_id').notNull(),
  brandId: text('brand_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.meetupId, t.userId] })]);

// ===== 酒イベント（外部・社内イベント情報共有）=====
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  dateLabel: text('date_label').notNull(),
  eventDate: date('event_date'),
  place: text('place').notNull(),
  venueQ: text('venue_q').notNull().default(''),
  kuras: integer('kuras').notNull().default(0),
  fee: text('fee').notNull().default(''),
  officialUrl: text('official_url').notNull().default(''),
  description: text('description').notNull().default(''),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 参加表明（going と interested は独立トグル: 同時ONも可）
export const eventAttendees = pgTable('event_attendees', {
  eventId: uuid('event_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status').notNull(), // 'going' | 'interested'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [primaryKey({ columns: [t.eventId, t.userId, t.status] })]);

// イベントコメント
export const eventComments = pgTable('event_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull(),
  userId: uuid('user_id').notNull(),
  text: text('text').notNull(),
  edited: boolean('edited').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ===== 通知 =====
// kind: 'comment' | 'nomi' | 'event_comment' | 'meetup_created' | 'event_created'
//      | 'vote_open' | 'vote_closed' | 'bring_declared'
// targetPath: クリック遷移先(例 /meetup/<id>, /post/public/<i>, /event/<id>)
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  kind: text('kind').notNull(),
  text: text('text').notNull(),
  targetPath: text('target_path').notNull().default(''),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
