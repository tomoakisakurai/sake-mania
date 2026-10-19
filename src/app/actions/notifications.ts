'use server';
import { and, desc, eq, isNull } from 'drizzle-orm';
import type { NotificationKind } from '@/lib/notifications';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';
import { getSupabaseServer } from '@/lib/supabase/server';

export type { NotificationKind } from '@/lib/notifications';

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
