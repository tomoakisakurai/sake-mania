'use server';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

export type EventStatus = 'going' | 'interested';

export interface EventView {
  id: string;
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  venueQ: string;
  kuras: number;
  fee: string;
  officialUrl: string;
  description: string;
  createdBy: string;
  goingCount: number;
  interestedCount: number;
  myStatus: EventStatus | null;
}

export interface EventCommentView {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  avatarBg: string;
  text: string;
  edited: boolean;
  createdAt: string;
  mine: boolean;
}

export interface EventDetail extends EventView {
  isCreator: boolean;
  comments: EventCommentView[];
  goingMembers: { name: string; avatar: string; avatarBg: string }[];
}

export interface EventInput {
  name: string;
  dateLabel: string;
  eventDate: string | null;
  place: string;
  fee: string;
  officialUrl: string;
  description: string;
}

async function currentUser() {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getEvents(): Promise<EventView[]> {
  const db = getDb();
  if (!db) return [];
  const eventsPromise = db.select().from(schema.events).orderBy(asc(schema.events.eventDate));
  const userPromise = currentUser();
  const rows = await eventsPromise;
  if (!rows.length) return [];
  const user = await userPromise;
  const ids = rows.map((row) => row.id);
  const attendees = await db.select().from(schema.eventAttendees).where(inArray(schema.eventAttendees.eventId, ids));
  return rows.map((row) => {
    const eventAttendees = attendees.filter((attendee) => attendee.eventId === row.id);
    const goingCount = eventAttendees.filter((attendee) => attendee.status === 'going').length;
    const interestedCount = eventAttendees.filter((attendee) => attendee.status === 'interested').length;
    const mine = user ? eventAttendees.find((attendee) => attendee.userId === user.id) : null;
    return {
      id: row.id,
      name: row.name,
      dateLabel: row.dateLabel,
      eventDate: row.eventDate ?? null,
      place: row.place,
      venueQ: row.venueQ,
      kuras: row.kuras,
      fee: row.fee,
      officialUrl: row.officialUrl,
      description: row.description,
      createdBy: row.createdBy,
      goingCount,
      interestedCount,
      myStatus: (mine?.status ?? null) as EventStatus | null,
    };
  });
}

export async function getEventDetail(eventId: string): Promise<EventDetail | null> {
  const db = getDb();
  if (!db) return null;
  const eventPromise = db.select().from(schema.events).where(eq(schema.events.id, eventId));
  const userPromise = currentUser();
  const [eventRow] = await eventPromise;
  if (!eventRow) return null;
  const user = await userPromise;
  const [attendees, comments] = await Promise.all([
    db.select().from(schema.eventAttendees).where(eq(schema.eventAttendees.eventId, eventId)),
    db.select().from(schema.eventComments).where(eq(schema.eventComments.eventId, eventId)).orderBy(desc(schema.eventComments.createdAt)),
  ]);
  const userIds = Array.from(new Set<string>([eventRow.createdBy, ...attendees.map((a) => a.userId), ...comments.map((c) => c.userId)]));
  const profiles = userIds.length
    ? await db.select().from(schema.profiles).where(inArray(schema.profiles.id, userIds))
    : [];
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const goingCount = attendees.filter((attendee) => attendee.status === 'going').length;
  const interestedCount = attendees.filter((attendee) => attendee.status === 'interested').length;
  const mine = user ? attendees.find((a) => a.userId === user.id) : null;
  const goingMembers = attendees.filter((a) => a.status === 'going').map((a) => {
    const profile = profileMap.get(a.userId);
    return {
      name: profile?.nickname || 'sake_user',
      avatar: profile?.avatar || '酒',
      avatarBg: profile?.avatarBg || '#DDD3BE',
    };
  });
  return {
    id: eventRow.id,
    name: eventRow.name,
    dateLabel: eventRow.dateLabel,
    eventDate: eventRow.eventDate ?? null,
    place: eventRow.place,
    venueQ: eventRow.venueQ,
    kuras: eventRow.kuras,
    fee: eventRow.fee,
    officialUrl: eventRow.officialUrl,
    description: eventRow.description,
    createdBy: eventRow.createdBy,
    goingCount,
    interestedCount,
    myStatus: (mine?.status ?? null) as EventStatus | null,
    isCreator: !!user && eventRow.createdBy === user.id,
    goingMembers,
    comments: comments.map((c) => {
      const profile = profileMap.get(c.userId);
      return {
        id: c.id,
        userId: c.userId,
        userName: profile?.nickname || 'sake_user',
        avatar: profile?.avatar || '酒',
        avatarBg: profile?.avatarBg || '#DDD3BE',
        text: c.text,
        edited: c.edited,
        createdAt: c.createdAt.toISOString(),
        mine: !!user && c.userId === user.id,
      };
    }),
  };
}

export async function createEvent(input: EventInput): Promise<string | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return null;
  const [row] = await db.insert(schema.events).values({
    name: input.name,
    dateLabel: input.dateLabel,
    eventDate: input.eventDate,
    place: input.place,
    venueQ: input.place,
    fee: input.fee,
    officialUrl: input.officialUrl,
    description: input.description,
    createdBy: user.id,
  }).returning({ id: schema.events.id });
  return row.id;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const deleted = await db.delete(schema.events)
    .where(and(eq(schema.events.id, eventId), eq(schema.events.createdBy, user.id)))
    .returning({ id: schema.events.id });
  return deleted.length > 0;
}

export async function setEventStatus(eventId: string, status: EventStatus | null): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  if (!status) {
    await db.delete(schema.eventAttendees)
      .where(and(eq(schema.eventAttendees.eventId, eventId), eq(schema.eventAttendees.userId, user.id)));
    return true;
  }
  await db.insert(schema.eventAttendees)
    .values({ eventId, userId: user.id, status })
    .onConflictDoUpdate({ target: [schema.eventAttendees.eventId, schema.eventAttendees.userId], set: { status } });
  return true;
}

export async function addEventComment(eventId: string, text: string): Promise<EventCommentView | null> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !text.trim()) return null;
  const [row] = await db.insert(schema.eventComments).values({
    eventId, userId: user.id, text: text.trim(),
  }).returning();
  const [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, user.id));
  return {
    id: row.id,
    userId: row.userId,
    userName: profile?.nickname || 'sake_user',
    avatar: profile?.avatar || '酒',
    avatarBg: profile?.avatarBg || '#DDD3BE',
    text: row.text,
    edited: row.edited,
    createdAt: row.createdAt.toISOString(),
    mine: true,
  };
}

export async function editEventComment(commentId: string, text: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user || !text.trim()) return false;
  const updated = await db.update(schema.eventComments)
    .set({ text: text.trim(), edited: true, updatedAt: new Date() })
    .where(and(eq(schema.eventComments.id, commentId), eq(schema.eventComments.userId, user.id)))
    .returning({ id: schema.eventComments.id });
  return updated.length > 0;
}

export async function deleteEventComment(commentId: string): Promise<boolean> {
  const db = getDb();
  const user = await currentUser();
  if (!db || !user) return false;
  const deleted = await db.delete(schema.eventComments)
    .where(and(eq(schema.eventComments.id, commentId), eq(schema.eventComments.userId, user.id)))
    .returning({ id: schema.eventComments.id });
  return deleted.length > 0;
}
