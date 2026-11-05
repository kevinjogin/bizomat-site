// Platform (founder) administration authorisation. Completely separate from
// workspace roles: being a workspace owner grants nothing here.

import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../env';
import { HttpError } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';

export type PlatformRole = 'founder' | 'admin';

export async function getPlatformRole(db: D1Database, userId: string): Promise<PlatformRole | null> {
  const row = await db
    .prepare('SELECT p.role FROM platform_admins p JOIN users u ON u.id = p.user_id WHERE p.user_id = ? AND u.disabled_at IS NULL')
    .bind(userId)
    .first<{ role: PlatformRole }>();
  return row?.role ?? null;
}

/**
 * Must run after requireAuth. Only interactive sessions (not API tokens) of
 * users present in platform_admins pass. Everyone else receives 404 so the
 * admin surface is indistinguishable from a non-existent route.
 */
export const requirePlatformAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  if (c.get('authKind') !== 'session') throw new HttpError(404, 'Not found');
  const role = await getPlatformRole(c.env.DB, c.get('user').id);
  if (!role) throw new HttpError(404, 'Not found');
  await rateLimit(c.env.DB, `admin:${c.get('user').id}`, 600, 60_000);
  c.set('platformRole', role);
  await next();
};
