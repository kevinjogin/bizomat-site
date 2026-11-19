// The Admin Control Centre API (Stage 1, R2): /api/admin/platform. Platform admins only (requirePlatformAdmin runs
// first); every route but /security needs a session that proved the second factor (requireMfa).
//
// - GET    /flags                         every flag: definition, global value, overrides, and the billing lock
// - GET    /flags/:key/history            its changes, newest first
// - PUT    /flags/:key                    set a value for one scope (reason required)
// - POST   /flags/:key/reset              remove one scope's value, so it inherits again (reason required)
// - POST   /kill-switch                   every enforcement flag back to its default, everywhere, at once
// - GET    /rollout, PUT /rollout/:id     the internal and pilot companies
//
// High and highest risk changes, the kill switch and rollout changes need a re-authentication within 10 minutes and the
// flag's key (or "KILL SWITCH") typed to confirm; high and highest risk changes are the founder's. Every change is in
// feature_flag_changes (append only) and audit_log.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { body, clientIp, HttpError, newId, now } from '../lib/util';
import { auditStmt } from '../services/audit';
import { billingLocked } from '../billing/config';
import { FLAGS, isFlag, needsConfirmation, resolve, STAGES, type FlagScope } from './flags';
import { requireMfa, requireReauth, securityRoutes } from './security';
import { integrityReport } from './integrity';
import { supportRoutes } from './support';

export const platformRoutes = new Hono<AppEnv>();

platformRoutes.route('/security', securityRoutes);
// Support access to a company (R5): time-limited, logged in the company's audit, visible to its owner.
platformRoutes.route('/support', supportRoutes);
platformRoutes.use('/flags', requireMfa);
platformRoutes.use('/flags/*', requireMfa);
platformRoutes.use('/kill-switch', requireMfa);
platformRoutes.use('/rollout', requireMfa);
platformRoutes.use('/rollout/*', requireMfa);
platformRoutes.use('/integrity', requireMfa);

interface FlagRow {
  key: string;
  scope: FlagScope;
  scope_id: string;
  value: string;
  reason: string;
  updated_by: string;
  updated_by_name: string | null;
  updated_at: number;
}

const KILL_CONFIRM = 'KILL SWITCH';
const scopeSchema = z.object({
  scope: z.enum(['global', 'stage', 'country', 'company']),
  scopeId: z.string().trim().max(64).default(''),
  reason: z.string().trim().min(3).max(500),
  confirm: z.string().trim().max(80).optional(),
});

const founderOnly = (c: Context<AppEnv>, what: string) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, `Only the founder can ${what}.`);
};

/** A scope id that names something real: '' for global, a stage, an ISO country code, or an existing company. */
async function checkScopeId(db: D1Database, scope: FlagScope, scopeId: string): Promise<string> {
  if (scope === 'global') {
    if (scopeId) throw new HttpError(400, 'A global value has no scope id.');
    return '';
  }
  if (scope === 'stage') {
    if (!(STAGES as readonly string[]).includes(scopeId)) throw new HttpError(400, `The stage must be ${STAGES.join(' or ')}.`);
    return scopeId;
  }
  if (scope === 'country') {
    const code = scopeId.toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) throw new HttpError(400, 'The country must be a two-letter ISO code, for example AU or GB.');
    return code;
  }
  const exists = await db
    .prepare(
      `SELECT 1 FROM co_companies WHERE id = ?1 AND deleted_at IS NULL
       UNION ALL SELECT 1 FROM sys_companies WHERE id = ?1
       UNION ALL SELECT 1 FROM sys_demo WHERE company_id = ?1 LIMIT 1`,
    )
    .bind(scopeId)
    .first();
  if (!exists) throw new HttpError(404, 'No company with that id.');
  return scopeId;
}

async function rowsOf(db: D1Database, key?: string): Promise<FlagRow[]> {
  const sql = `SELECT f.key, f.scope, f.scope_id, f.value, f.reason, f.updated_by, u.name AS updated_by_name, f.updated_at
                 FROM feature_flags f LEFT JOIN users u ON u.id = f.updated_by ${key ? 'WHERE f.key = ?' : ''} ORDER BY f.key, f.scope, f.scope_id`;
  const q = db.prepare(sql);
  return (await (key ? q.bind(key) : q).all<FlagRow>()).results;
}

platformRoutes.get('/flags', async (c) => {
  const rows = await rowsOf(c.env.DB);
  const flags = Object.entries(FLAGS).map(([key, def]) => {
    const mine = rows.filter((r) => r.key === key);
    return {
      key,
      ...def,
      default: def.values[0],
      global: resolve(key, mine, {}).value,
      overrides: mine.map((r) => ({ scope: r.scope, scopeId: r.scope_id, value: r.value, reason: r.reason, by: r.updated_by_name, at: r.updated_at })),
      needsConfirmation: needsConfirmation(key),
    };
  });
  return c.json({ flags, billingLocked: billingLocked(c.env), role: c.get('platformRole') });
});

platformRoutes.get('/flags/:key/history', async (c) => {
  const key = c.req.param('key');
  if (!isFlag(key)) throw new HttpError(404, 'No such flag.');
  const rows = await c.env.DB
    .prepare('SELECT h.id, h.scope, h.scope_id, h.old_value, h.new_value, h.reason, h.kind, h.created_at, u.name AS actor FROM feature_flag_changes h LEFT JOIN users u ON u.id = h.actor_id WHERE h.key = ? ORDER BY h.created_at DESC, h.id DESC LIMIT 200')
    .bind(key)
    .all();
  return c.json({ key, history: rows.results });
});

/** Checks a change of `key` to `value` (or a reset, value null) against the registry and the server's locks. */
async function guard(c: Context<AppEnv>, key: string, value: string | null, confirm: string | undefined) {
  const def = FLAGS[key];
  if (def.managedBy) throw new HttpError(409, `${def.label} is set by ${def.managedBy}, not here.`, { code: 'FLAG_MANAGED' });
  if (value !== null && !def.values.includes(value)) throw new HttpError(400, `${def.label} takes ${def.values.join(', ')}.`);
  if (key === 'billing_mode' && value === 'paid' && billingLocked(c.env)) {
    throw new HttpError(403, 'Billing is locked on the server (BIZOMAT_BILLING_LOCK), so the billing mode stays free.', { code: 'BILLING_LOCKED' });
  }
  if (def.requires && value !== null && value !== def.values[0]) {
    const rows = await rowsOf(c.env.DB, def.requires.key);
    if (resolve(def.requires.key, rows, {}).value !== def.requires.value) throw new HttpError(409, def.requires.message, { code: 'FLAG_REQUIREMENT' });
  }
  if (needsConfirmation(key)) {
    founderOnly(c, `change ${def.label}`);
    if (confirm !== key) throw new HttpError(400, `Type ${key} to confirm.`, { code: 'CONFIRMATION_REQUIRED' });
    await requireReauth(c);
  }
}

platformRoutes.put('/flags/:key', async (c) => {
  const key = c.req.param('key');
  if (!isFlag(key)) throw new HttpError(404, 'No such flag.');
  const db = c.env.DB;
  const input = await body(c, scopeSchema.extend({ value: z.string().trim().min(1).max(64) }));
  const def = FLAGS[key];
  if (!def.scopes.includes(input.scope)) throw new HttpError(400, `${def.label} can be set for: ${def.scopes.join(', ')}.`);
  const scopeId = await checkScopeId(db, input.scope, input.scopeId);
  await guard(c, key, input.value, input.confirm);
  const me = c.get('user').id;
  const before = await db.prepare('SELECT value FROM feature_flags WHERE key = ? AND scope = ? AND scope_id = ?').bind(key, input.scope, scopeId).first<{ value: string }>();
  if (before?.value === input.value) return c.json({ ok: true, unchanged: true });
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(key, scope, scope_id) DO UPDATE SET value = excluded.value, reason = excluded.reason, updated_by = excluded.updated_by, updated_at = excluded.updated_at')
      .bind(key, input.scope, scopeId, input.value, input.reason, me, t),
    db.prepare("INSERT INTO feature_flag_changes (id, key, scope, scope_id, old_value, new_value, reason, actor_id, kind, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'change', ?, ?)").bind(newId(), key, input.scope, scopeId, before?.value ?? null, input.value, input.reason, me, clientIp(c), t),
    auditStmt(db, { actorId: me, action: 'platform.flag_changed', targetType: 'flag', targetId: key, metadata: { scope: input.scope, scopeId, from: before?.value ?? null, to: input.value, reason: input.reason }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, key, scope: input.scope, scopeId, value: input.value });
});

platformRoutes.post('/flags/:key/reset', async (c) => {
  const key = c.req.param('key');
  if (!isFlag(key)) throw new HttpError(404, 'No such flag.');
  const db = c.env.DB;
  const input = await body(c, scopeSchema);
  const scopeId = input.scope === 'global' ? '' : input.scope === 'country' ? input.scopeId.toUpperCase() : input.scopeId;
  await guard(c, key, null, input.confirm);
  const before = await db.prepare('SELECT value FROM feature_flags WHERE key = ? AND scope = ? AND scope_id = ?').bind(key, input.scope, scopeId).first<{ value: string }>();
  if (!before) return c.json({ ok: true, unchanged: true });
  const me = c.get('user').id;
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM feature_flags WHERE key = ? AND scope = ? AND scope_id = ?').bind(key, input.scope, scopeId),
    db.prepare("INSERT INTO feature_flag_changes (id, key, scope, scope_id, old_value, new_value, reason, actor_id, kind, ip, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 'reset', ?, ?)").bind(newId(), key, input.scope, scopeId, before.value, input.reason, me, clientIp(c), t),
    auditStmt(db, { actorId: me, action: 'platform.flag_reset', targetType: 'flag', targetId: key, metadata: { scope: input.scope, scopeId, from: before.value, reason: input.reason }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});

/** Every enforcement flag back to its default (off, free, personal workspaces allowed), everywhere, in one step. Any
 * platform admin may pull it, with a re-authentication and the words typed. */
platformRoutes.post('/kill-switch', async (c) => {
  const db = c.env.DB;
  const input = await body(c, z.object({ reason: z.string().trim().min(3).max(500), confirm: z.string().trim().max(40) }));
  if (input.confirm !== KILL_CONFIRM) throw new HttpError(400, `Type ${KILL_CONFIRM} to confirm.`, { code: 'CONFIRMATION_REQUIRED' });
  await requireReauth(c);
  const keys = Object.entries(FLAGS).filter(([, d]) => d.enforcement).map(([k]) => k);
  const rows = (await rowsOf(db)).filter((r) => keys.includes(r.key));
  const me = c.get('user').id;
  const t = now();
  const stmts = rows.flatMap((r) => [
    db.prepare('DELETE FROM feature_flags WHERE key = ? AND scope = ? AND scope_id = ?').bind(r.key, r.scope, r.scope_id),
    db.prepare("INSERT INTO feature_flag_changes (id, key, scope, scope_id, old_value, new_value, reason, actor_id, kind, ip, created_at) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, 'kill_switch', ?, ?)").bind(newId(), r.key, r.scope, r.scope_id, r.value, input.reason, me, clientIp(c), t),
  ]);
  stmts.push(auditStmt(db, { actorId: me, action: 'platform.kill_switch', targetType: 'flags', targetId: 'enforcement', metadata: { reason: input.reason, cleared: rows.length, flags: keys }, ip: clientIp(c) }));
  await db.batch(stmts);
  return c.json({ ok: true, cleared: rows.length, flags: keys });
});

// Integrity check (R4): counts only. Read only, for any platform admin with a verified session.
platformRoutes.get('/integrity', async (c) => c.json(await integrityReport(c.env.DB)));

platformRoutes.get('/rollout', async (c) => {
  const rows = await c.env.DB
    .prepare(
      `SELECT r.company_id, r.stage, r.reason, r.updated_at, u.name AS updated_by,
              COALESCE(co.name, s.name, d.name) AS company
         FROM company_rollout r
         LEFT JOIN users u ON u.id = r.updated_by
         LEFT JOIN co_companies co ON co.id = r.company_id
         LEFT JOIN sys_companies s ON s.id = r.company_id
         LEFT JOIN sys_demo d ON d.company_id = r.company_id
        ORDER BY r.stage, company`,
    )
    .all();
  return c.json({ companies: rows.results });
});

platformRoutes.put('/rollout/:company', async (c) => {
  const db = c.env.DB;
  founderOnly(c, 'change rollout stages');
  const companyId = await checkScopeId(db, 'company', c.req.param('company'));
  const input = await body(c, z.object({ stage: z.enum(['internal', 'pilot']).nullable(), reason: z.string().trim().min(3).max(500) }));
  await requireReauth(c);
  const me = c.get('user').id;
  const t = now();
  const before = await db.prepare('SELECT stage FROM company_rollout WHERE company_id = ?').bind(companyId).first<{ stage: string }>();
  await db.batch([
    input.stage
      ? db.prepare('INSERT INTO company_rollout (company_id, stage, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id) DO UPDATE SET stage = excluded.stage, reason = excluded.reason, updated_by = excluded.updated_by, updated_at = excluded.updated_at').bind(companyId, input.stage, input.reason, me, t)
      : db.prepare('DELETE FROM company_rollout WHERE company_id = ?').bind(companyId),
    auditStmt(db, { actorId: me, action: 'platform.rollout_changed', targetType: 'company', targetId: companyId, metadata: { from: before?.stage ?? 'all', to: input.stage ?? 'all', reason: input.reason }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, companyId, stage: input.stage ?? 'all' });
});
