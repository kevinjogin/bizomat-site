// Support access (Stage 1, R5; brief Part 4: "time-limited, logged and visible to the company Owner, no silent
// impersonation"). A platform admin opens access to one registered company, with a reason, for at most 72 hours. While
// it lasts they can read the company's people, tools and registration in the console, never sign in as anyone and never
// read records. Every grant, view and end is written to the company's own audit log, which its owner and
// administrators read, and they can end a grant at any time (company/routes.ts, /c/:company/support).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now } from '../lib/util';
import { auditStmt } from '../services/audit';
import { coAuditStmt, companyTools } from '../company/access';
import { requireMfa, requireReauth } from './security';

export const SUPPORT_MAX_HOURS = 72;

export const supportRoutes = new Hono<AppEnv>();
supportRoutes.use('*', requireMfa);

/** The grant that lets this admin look at this company now, or null. */
export async function activeGrant(db: D1Database, companyId: string, userId: string, at = now()) {
  return db
    .prepare('SELECT * FROM support_access_grants WHERE company_id = ? AND user_id = ? AND revoked_at IS NULL AND starts_at <= ? AND ends_at > ? ORDER BY ends_at DESC LIMIT 1')
    .bind(companyId, userId, at, at)
    .first<{ id: string; company_id: string; user_id: string; reason: string; starts_at: number; ends_at: number }>();
}

supportRoutes.get('/', async (c) => {
  const t = now();
  const rows = await c.env.DB
    .prepare(
      `SELECT g.id, g.company_id, co.name AS company, g.reason, g.starts_at, g.ends_at, g.revoked_at, u.name AS admin
         FROM support_access_grants g LEFT JOIN co_companies co ON co.id = g.company_id LEFT JOIN users u ON u.id = g.user_id
        WHERE g.ends_at > ? OR g.created_at > ? ORDER BY g.created_at DESC LIMIT 100`,
    )
    .bind(t, t - 30 * 86_400_000)
    .all();
  return c.json({ grants: rows.results, maxHours: SUPPORT_MAX_HOURS });
});

supportRoutes.post('/:company', async (c) => {
  const input = await body(c, z.object({ reason: z.string().trim().min(3).max(500), hours: z.number().int().min(1).max(SUPPORT_MAX_HOURS).default(4) }));
  // Looking into a customer's company is sensitive: a fresh password and code.
  await requireReauth(c);
  const db = c.env.DB;
  const companyId = c.req.param('company');
  const co = await db.prepare('SELECT id FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(companyId).first();
  if (!co) throw notFound('Registered company');
  const me = c.get('user');
  const t = now();
  const id = newId();
  await db.batch([
    db.prepare('INSERT INTO support_access_grants (id, company_id, user_id, reason, granted_by, starts_at, ends_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, companyId, me.id, input.reason, me.id, t, t + input.hours * 3_600_000, t),
    coAuditStmt(db, { companyId, actorId: me.id, action: 'support.access_opened', targetType: 'support_access', targetId: id, metadata: { reason: input.reason, hours: input.hours }, ip: clientIp(c) }),
    auditStmt(db, { actorId: me.id, action: 'platform.support_access_opened', targetType: 'company', targetId: companyId, metadata: { grant: id, hours: input.hours }, ip: clientIp(c) }),
  ]);
  return c.json({ id, endsAt: t + input.hours * 3_600_000 }, 201);
});

supportRoutes.post('/:company/grants/:id/end', async (c) => {
  const db = c.env.DB;
  const me = c.get('user');
  const g = await db.prepare('SELECT * FROM support_access_grants WHERE company_id = ? AND id = ? AND revoked_at IS NULL').bind(c.req.param('company'), c.req.param('id')).first<{ id: string; company_id: string }>();
  if (!g) throw notFound('Support access');
  const t = now();
  await db.batch([
    db.prepare('UPDATE support_access_grants SET revoked_at = ?, revoked_by = ? WHERE company_id = ? AND id = ? AND revoked_at IS NULL').bind(t, me.id, g.company_id, g.id),
    coAuditStmt(db, { companyId: g.company_id, actorId: me.id, action: 'support.access_ended', targetType: 'support_access', targetId: g.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

/** What support may read during a grant: people and their roles, the tools, the registration. Never record content. */
supportRoutes.get('/:company/view', async (c) => {
  const db = c.env.DB;
  const me = c.get('user');
  const companyId = c.req.param('company');
  const grant = await activeGrant(db, companyId, me.id);
  if (!grant) throw new HttpError(403, 'Open support access to this company first. It is time-limited and its owner sees it.', { code: 'SUPPORT_ACCESS_REQUIRED' });
  const [company, people, tools] = await Promise.all([
    db.prepare('SELECT c.id, c.name, c.country, c.registration_type, c.registration_number, c.registration_status, c.suspended_at, co.created_at FROM companies c JOIN co_companies co ON co.id = c.id WHERE c.id = ?').bind(companyId).first(),
    db
      .prepare('SELECT u.name, u.email, m.role, m.joined_at, u.disabled_at IS NOT NULL AS disabled FROM co_members m JOIN users u ON u.id = m.user_id WHERE m.company_id = ? ORDER BY m.joined_at')
      .bind(companyId)
      .all(),
    companyTools(db, companyId),
  ]);
  await coAuditStmt(db, { companyId, actorId: me.id, action: 'support.viewed', targetType: 'support_access', targetId: grant.id, ip: clientIp(c) }).run();
  return c.json({ grant: { id: grant.id, reason: grant.reason, endsAt: grant.ends_at }, company, people: people.results, tools });
});
