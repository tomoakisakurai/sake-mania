'use server';
import { and, desc, eq, isNull, ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

export type NotificationKind =
  | 'comment'
  | 'nomi'
  | 'event_comment'
  | 'meetup_created'
  | 'event_created'
  | 'vote_open'
  | 'vote_closed'
  | 'bring_declared';

export interface NotificationView {
  id: string;
  kind: NotificationKind;
  text: string;
  targetPath: string;
  createdAt: string;
  isUnread: boolean;
}

async function currentUserId(): Promise<string | null> {
  const supabase = await getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** Insert helper used by other actions. Skips if recipient == actor. */
export async function createNotification(input: {
  userId: string;
  kind: NotificationKind;
  text: string;
  targetPath: string;
  excludeUserId?: string | null;
}): Promise<void> {
  if (input.excludeUserId && input.userId === input.excludeUserId) return;
  const db = getDb();
  if (!db) return;
  await db.insert(schema.notifications).values({
    userId: input.userId,
    kind: input.kind,
    text: input.text,
    targetPath: input.targetPath,
  });
}

/** Bulk-fanout helper: 全メンバー(自分以外)に通知。kuraReg/meetupCreate/eventCreate用。 */
export async function createNotificationForAll(input: {
  kind: NotificationKind;
  text: string;
  targetPath: string;
  excludeUserId: string;
}): Promise<void> {
  const db = getDb();
  if (!db) return;
  const recipients = await db
    .select({ id: schema.profiles.id })
    .from(schema.profiles)
    .where(ne(schema.profiles.id, input.excludeUserId));
  if (!recipients.length) return;
  await db.insert(schema.notifications).values(
    recipients.map((profile) => ({
      userId: profile.id,
      kind: input.kind,
      text: input.text,
      targetPath: input.targetPath,
    })),
  );
}

export async function getNotifications(): Promise<NotificationView[]> {
  const db = getDb();
  const userId = await currentUserId();
  if (!db || !userId) return [];
  const rows = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, userId))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(50);
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind as NotificationKind,
    text: row.text,
    targetPath: row.targetPath,
    createdAt: row.createdAt.toISOString(),
    isUnread: row.readAt === null,
  }));
}

export async function markNotificationRead(notificationId: string): Promise<boolean> {
  const db = getDb();
  const userId = await currentUserId();
  if (!db || !userId) return false;
  await db
    .update(schema.notifications)
    .set({ readAt: new Date() })
    .where(and(eq(schema.notifications.id, notificationId), eq(schema.notifications.userId, userId)));
  return true;
}

export async function markAllNotificationsRead(): Promise<boolean> {
  const db = getDb();
  const userId = await currentUserId();
  if (!db || !userId) return false;
  await db
    .update(schema.notifications)
    .set({ readAt: new Date() })
    .where(and(eq(schema.notifications.userId, userId), isNull(schema.notifications.readAt)));
  return true;
}
