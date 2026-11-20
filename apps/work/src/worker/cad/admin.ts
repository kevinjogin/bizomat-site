// The Admin Control Centre's CAD Automation panel (owner's brief, Part 8; docs/cad/README.md, "Platform admin guide"):
// CAD job health and usage by company (from CAD Automation's last sync), the fair-use limits (the platform's defaults
// and a company's own), and the migration report with its review list. The flags themselves (cad_in_erp and its
// sub-flags, per company for a pilot; cad_redirect for the old pages) are set in the Control Centre's flag list.
// Platform admins only, with two-factor sign-in (requireMfa); every change is in the audit log.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, notFound, now } from '../lib/util';
import { audit } from '../services/audit';
import { requireMfa } from '../platform/security';
import { LIMIT_BOUNDS, LIMIT_DEFAULTS, clampLimits, limitsFor } from './access';
import { cadUnavailable } from './client';
import { cadOverview } from './sync';

export const cadAdminRoutes = new Hono<AppEnv>();
cadAdminRoutes.use('*', requireMfa);

const limitsSchema = z.object({
  concurrent: z.number().int().min(LIMIT_BOUNDS.concurrent[0]).max(LIMIT_BOUNDS.concurrent[1]),
  commandSeconds: z.number().int().min(LIMIT_BOUNDS.commandSeconds[0]).max(LIMIT_BOUNDS.commandSeconds[1]),
  uploadMb: z.number().int().min(LIMIT_BOUNDS.uploadMb[0]).max(LIMIT_BOUNDS.uploadMb[1]),
  storageMb: z.number().int().min(LIMIT_BOUNDS.storageMb[0]).max(LIMIT_BOUNDS.storageMb[1]),
});

cadAdminRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const overview = await cadOverview(db);
  const own = await db.prepare("SELECT s.company_id, s.value_json, c.name FROM company_settings s JOIN companies c ON c.id = s.company_id WHERE s.key = 'cad.limits' ORDER BY c.name LIMIT 500").all<{ company_id: string; value_json: string; name: string }>();
  const enabled = await db.prepare("SELECT f.scope, f.scope_id, c.name FROM feature_flags f LEFT JOIN companies c ON c.id = f.scope_id WHERE f.key = 'cad_in_erp' AND f.value = 'on' ORDER BY f.scope, c.name").all<{ scope: string; scope_id: string; name: string | null }>();
  return c.json({
    ...overview,
    connected: !cadUnavailable(c.env),
    connectedReason: cadUnavailable(c.env),
    limits: { defaults: await limitsFor(db, null), builtIn: LIMIT_DEFAULTS, bounds: LIMIT_BOUNDS, companies: await Promise.all(own.results.map(async (r) => ({ companyId: r.company_id, name: r.name, limits: await limitsFor(db, r.company_id) }))) },
    enabled: enabled.results.map((r) => ({ scope: r.scope, scopeId: r.scope_id, name: r.name })),
  });
});

cadAdminRoutes.put('/limits', async (c) => {
  const input = await body(c, limitsSchema);
  const t = now();
  await c.env.DB.prepare("INSERT INTO system_kv (key, value, updated_at) VALUES ('cad_limits', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at").bind(JSON.stringify(input), t).run();
  await audit(c.env.DB, { actorId: c.get('user').id, action: 'cad.limits_default', metadata: input, ip: clientIp(c) });
  return c.json({ limits: clampLimits(input) });
});

cadAdminRoutes.put('/limits/:companyId', async (c) => {
  const db = c.env.DB;
  const companyId = c.req.param('companyId');
  if (!(await db.prepare('SELECT 1 FROM companies WHERE id = ?').bind(companyId).first())) throw notFound('Company');
  const input = await body(c, limitsSchema);
  const t = now();
  await db
    .prepare("INSERT INTO company_settings (company_id, key, value_json, updated_by, updated_at) VALUES (?, 'cad.limits', ?, ?, ?) ON CONFLICT(company_id, key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = excluded.updated_at")
    .bind(companyId, JSON.stringify(input), c.get('user').id, t)
    .run();
  await audit(db, { actorId: c.get('user').id, action: 'cad.limits_company', targetType: 'company', targetId: companyId, metadata: input, ip: clientIp(c) });
  return c.json({ limits: await limitsFor(db, companyId) });
});

cadAdminRoutes.delete('/limits/:companyId', async (c) => {
  const db = c.env.DB;
  const companyId = c.req.param('companyId');
  await db.prepare("DELETE FROM company_settings WHERE company_id = ? AND key = 'cad.limits'").bind(companyId).run();
  await audit(db, { actorId: c.get('user').id, action: 'cad.limits_company_cleared', targetType: 'company', targetId: companyId, ip: clientIp(c) });
  return c.json({ limits: await limitsFor(db, companyId) });
});

// The review list: an account that could not be mapped or placed is given a BIZOMAT account (by email) and a company.
// The decision is kept over later syncs; CAD Automation moves the account's computers, commands and AI connections
// into that company at its next sync, once the company has CAD Automation in the ERP. Nothing is deleted.
cadAdminRoutes.post('/accounts/:id/assign', async (c) => {
  const db = c.env.DB;
  const input = await body(c, z.object({ email: z.string().trim().email().max(254), companyId: z.string().trim().min(1).max(64), reason: z.string().trim().min(3).max(500) }));
  const acc = await db.prepare('SELECT cad_account_id, email FROM cad_accounts WHERE cad_account_id = ?').bind(c.req.param('id')).first<{ cad_account_id: string; email: string }>();
  if (!acc) throw notFound('CAD account');
  const user = await db.prepare('SELECT id FROM users WHERE lower(email) = ? AND disabled_at IS NULL').bind(input.email.toLowerCase()).first<{ id: string }>();
  if (!user) throw new HttpError(404, 'No active BIZOMAT account has that email.');
  const member =
    (await db.prepare("SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ? AND COALESCE(status, 'active') = 'active'").bind(input.companyId, user.id).first()) ??
    (await db.prepare('SELECT 1 FROM sys_companies WHERE id = ? AND owner_id = ?').bind(input.companyId, user.id).first());
  if (!member) throw new HttpError(409, 'That person is not an active member of that company.', { code: 'CAD_NOT_MEMBER' });
  const t = now();
  await db
    .prepare("UPDATE cad_accounts SET user_id = ?, company_id = ?, method = NULL, status = 'mapped', reason = ?, assigned_by = ?, assigned_at = ? WHERE cad_account_id = ?")
    .bind(user.id, input.companyId, `Assigned by a platform admin: ${input.reason}`.slice(0, 500), c.get('user').id, t, acc.cad_account_id)
    .run();
  await audit(db, { actorId: c.get('user').id, action: 'cad.account_assigned', targetType: 'cad_account', targetId: acc.cad_account_id, metadata: { userId: user.id, companyId: input.companyId, reason: input.reason }, ip: clientIp(c) });
  return c.json({ ok: true });
});
