import 'server-only';
import { eq } from 'drizzle-orm';
import type { DB } from '@/db/client';
import * as schema from '@/db/schema';

/**
 * 管理者判定(profiles.isAdmin)。
 * 運営系action(会・イベントの編集/削除、幹事交代、フェーズ操作、コメント削除)は
 * 本人条件に加えて管理者にも許可する。判定結果でWHERE句の本人条件を外す形で使う。
 */
export async function isAdminUser(db: DB, userId: string): Promise<boolean> {
  const [profile] = await db
    .select({ isAdmin: schema.profiles.isAdmin })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, userId));
  return profile?.isAdmin ?? false;
}
