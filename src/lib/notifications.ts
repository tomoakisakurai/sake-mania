import 'server-only';
import { ne } from 'drizzle-orm';
import { getDb } from '@/db/client';
import * as schema from '@/db/schema';

export type NotificationKind =
  | 'comment'
  | 'comment_like'
  | 'nomi'
  | 'event_comment'
  | 'meetup_comment'
  | 'meetup_host'
  | 'meetup_created'
  | 'event_created'
  | 'vote_open'
  | 'vote_closed'
  | 'bring_declared';

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
