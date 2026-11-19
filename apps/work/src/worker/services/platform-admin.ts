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

/**
 * The first founder from a server setting (Stage 1, R7): when PLATFORM_ADMIN_BOOTSTRAP names an active account with a
 * confirmed email and no founder exists, that account becomes the founder (audited). Never while a founder exists, so
 * the setting cannot take over a running platform. Run by the maintenance run; remove the setting once it has acted.
 */
export async function bootstrapFounder(env: { DB: D1Database; PLATFORM_ADMIN_BOOTSTRAP?: string }): Promise<'none' | 'exists' | 'not_found' | 'granted'> {
  const email = env.PLATFORM_ADMIN_BOOTSTRAP?.trim().toLowerCase();
  if (!email) return 'none';
  const db = env.DB;
  if (await db.prepare("SELECT 1 FROM platform_admins WHERE role = 'founder' LIMIT 1").first()) return 'exists';
  const u = await db.prepare('SELECT id FROM users WHERE email = ? AND disabled_at IS NULL AND email_verified_at IS NOT NULL').bind(email).first<{ id: string }>();
  if (!u) return 'not_found';
  const t = Date.now();
  await db.batch([
    db.prepare("INSERT INTO platform_admins (user_id, role, granted_by, granted_at) VALUES (?1, 'founder', 'bootstrap', ?2) ON CONFLICT(user_id) DO UPDATE SET role = 'founder', granted_by = 'bootstrap', granted_at = ?2").bind(u.id, t),
    db.prepare("INSERT INTO audit_log (id, actor_id, action, target_type, target_id, metadata_json, created_at) VALUES (?, NULL, 'platform.founder_bootstrapped', 'user', ?, '{}', ?)").bind(crypto.randomUUID(), u.id, t),
  ]);
  return 'granted';
}
