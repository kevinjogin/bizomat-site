// Routes for existing users and the company rule (Stage 1, R7; docs/platform/compliance.md).
//
// People (signed in): their notice (/api/compliance/me, which also records that it was displayed), their exports.
// Company owners and administrators: the company export.
// Platform admins (/api/admin/platform/compliance, two-factor sign-in): the classification report, settings, recipient
// lists (dry run, approval, sending), exemptions, deadline extensions, legal hold, recovery, the legal review record
// and deletion batches (dry run, approval). Dangerous steps need the founder and a fresh password and code.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now, parseJson } from '../lib/util';
import { auditStmt } from '../services/audit';
import { flagOn } from '../platform/flags';
import { requireMfa, requireReauth } from '../platform/security';
import { requireCompany } from '../company/access';
import { DEFAULT_SETTINGS, buildRecipientList, classify, getSettings, noticeText, saveSettings, sendRecipientList, situation } from './core';
import { approveBatch, dryRun, recordLegalReview, recover } from './deletion';
import { requestExport } from './export';

const founderOnly = (c: { get: (k: 'platformRole') => string | undefined }) => {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can do that');
};

// ------------------------------------------------------------------ people

export const userComplianceRoutes = new Hono<AppEnv>();

/** The person's notice, if the company rule concerns them. Showing it records the display (brief 7.2). */
userComplianceRoutes.get('/compliance/me', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const s = await situation(db, user.id);
  if (!s) return c.json({ required: false });
  const settings = await getSettings(db);
  const audience = s.policy === 'ALLOW_PERSONAL_WORKSPACE' ? 'no_company' : s.policy === 'INVITATION_ONLY' ? 'invitation_only' : 'require_company';
  const notified = await db.prepare("SELECT 1 FROM compliance_notifications WHERE user_id = ? AND kind = 'migration'").bind(user.id).first();
  if (notified) {
    await db.prepare("UPDATE compliance_notifications SET status = 'displayed', delivered_at = COALESCE(delivered_at, ?) WHERE user_id = ? AND kind = 'migration' AND channel = 'in_app' AND status = 'queued'").bind(now(), user.id).run();
  }
  return c.json({ required: !!notified || s.policy === 'INVITATION_ONLY', policy: s.policy, deadlineAt: s.deadlineAt, suspended: s.suspended, ...noticeText(audience, settings.deadlineDays) });
});

userComplianceRoutes.post('/me/export', async (c) => {
  if (c.get('authKind') !== 'session') throw new HttpError(403, 'Exports are asked for from a signed-in session');
  return c.json(await requestExport(c.env, c.get('user').id, 'personal', null, clientIp(c)), 201);
});

userComplianceRoutes.post('/company/c/:company/export', async (c) => {
  if (c.get('authKind') !== 'session') throw new HttpError(403, 'Exports are asked for from a signed-in session');
  const a = await requireCompany(c, 'admin');
  return c.json(await requestExport(c.env, a.userId, 'company', a.companyId, clientIp(c)), 201);
});

userComplianceRoutes.get('/exports', async (c) => {
  const rows = await c.env.DB
    .prepare('SELECT id, scope, company_id, status, size, expires_at, created_at, completed_at FROM data_exports WHERE user_id = ? ORDER BY created_at DESC LIMIT 20')
    .bind(c.get('user').id)
    .all();
  return c.json(rows.results);
});

/** The download: only the person who asked, only while the link lasts (7 days); each download is audited. */
userComplianceRoutes.get('/exports/:id/download', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const x = await db.prepare('SELECT * FROM data_exports WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first<{ id: string; status: string; file_key: string | null; expires_at: number | null; scope: string }>();
  if (!x) throw notFound('Export');
  if (x.status !== 'ready' || !x.file_key || !x.expires_at || x.expires_at <= now()) throw new HttpError(410, 'This export has expired or is not ready. Ask for a new one.');
  const obj = await c.env.FILES.get(x.file_key);
  if (!obj) throw new HttpError(410, 'This export is no longer available. Ask for a new one.');
  await auditStmt(db, { actorId: user.id, action: 'export.downloaded', targetType: 'export', targetId: x.id, ip: clientIp(c) }).run();
  return new Response(obj.body, {
    headers: { 'Content-Type': 'application/zip', 'Content-Disposition': `attachment; filename="bizomat-${x.scope}-export.zip"`, 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
});

// ------------------------------------------------------------------ platform admins

export const platformComplianceRoutes = new Hono<AppEnv>();
platformComplianceRoutes.use('*', requireMfa);

platformComplianceRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const [report, settings, lists, exemptions, batches, reviews, extensions] = await Promise.all([
    classify(db),
    getSettings(db),
    db.prepare('SELECT id, kind, audience, count, status, created_at, approved_at, sent_at FROM compliance_recipient_lists ORDER BY created_at DESC LIMIT 20').all(),
    db.prepare('SELECT e.user_id, u.name, u.email, e.reason, e.expires_at, e.created_at FROM compliance_exemptions e JOIN users u ON u.id = e.user_id ORDER BY e.created_at DESC LIMIT 200').all(),
    db.prepare('SELECT id, status, max_accounts, report_json, created_at, approved_at, done_at, backups_expire_at FROM deletion_batches ORDER BY created_at DESC LIMIT 20').all<any>(),
    db.prepare('SELECT id, reviewer, reviewed_on, jurisdictions_json, retention_json, notes, recorded_at FROM legal_reviews ORDER BY recorded_at DESC LIMIT 10').all<any>(),
    db.prepare('SELECT * FROM compliance_extensions ORDER BY created_at DESC LIMIT 50').all(),
  ]);
  return c.json({
    report,
    settings,
    defaults: DEFAULT_SETTINGS,
    lists: lists.results,
    exemptions: exemptions.results,
    extensions: extensions.results,
    batches: batches.results.map((b) => ({ ...b, report: parseJson(b.report_json, {}), report_json: undefined })),
    legalReviews: reviews.results.map((r) => ({ ...r, jurisdictions: parseJson(r.jurisdictions_json, []), retention: parseJson(r.retention_json, {}) })),
    flags: {
      required: await flagOn(db, 'company_registration_required'),
      notifications: await flagOn(db, 'migration_notifications'),
      countdown: await flagOn(db, 'compliance_countdown'),
      suspension: await flagOn(db, 'auto_suspension'),
      legalReview: await flagOn(db, 'legal_review_completed'),
      deletion: await flagOn(db, 'auto_deletion'),
    },
  });
});

const settingsSchema = z.object({
  deadlineDays: z.number().int().min(1).max(365),
  reminderDays: z.array(z.number().int().min(1).max(364)).max(10),
  graceDays: z.number().int().min(7).max(365),
  finalWarningDays: z.number().int().min(7).max(60),
  batchMax: z.number().int().min(1).max(500),
  deletionMode: z.enum(['review', 'automatic']),
  backupRetentionDays: z.number().int().min(1).max(3650),
});

platformComplianceRoutes.put('/settings', async (c) => {
  founderOnly(c);
  const input = await body(c, settingsSchema);
  if (input.finalWarningDays > input.graceDays) throw new HttpError(400, 'The final warning comes within the grace period');
  await requireReauth(c);
  await saveSettings(c.env.DB, input);
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'compliance.settings_changed', metadata: input, ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

/** A dry run: who would be told now. Nothing is sent. */
platformComplianceRoutes.post('/recipient-lists', async (c) => c.json(await buildRecipientList(c.env.DB, c.get('user').id), 201));

/** The list itself, for review before approval. */
platformComplianceRoutes.get('/recipient-lists/:id', async (c) => {
  const db = c.env.DB;
  const l = await db.prepare('SELECT * FROM compliance_recipient_lists WHERE id = ?').bind(c.req.param('id')).first<{ user_ids_json: string; audience: string; status: string; count: number }>();
  if (!l) throw notFound('List');
  const ids = parseJson<string[]>(l.user_ids_json, []).slice(0, 1000);
  const people: { id: string; name: string; email: string }[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    people.push(...(await db.prepare(`SELECT id, name, email FROM users WHERE id IN (${chunk.map(() => '?').join(',')})`).bind(...chunk).all<{ id: string; name: string; email: string }>()).results);
  }
  return c.json({ audience: l.audience, status: l.status, count: l.count, people, text: noticeText(l.audience as any, (await getSettings(db)).deadlineDays) });
});

platformComplianceRoutes.post('/recipient-lists/:id/approve', async (c) => {
  founderOnly(c);
  await requireReauth(c);
  const r = await c.env.DB.prepare("UPDATE compliance_recipient_lists SET status = 'approved', approved_by = ?, approved_at = ? WHERE id = ? AND status = 'draft'").bind(c.get('user').id, now(), c.req.param('id')).run();
  if (!r.meta.changes) throw new HttpError(409, 'Only a draft list can be approved');
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'compliance.recipients_approved', targetType: 'recipient_list', targetId: c.req.param('id'), ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

platformComplianceRoutes.post('/recipient-lists/:id/send', async (c) => {
  founderOnly(c);
  const r = await sendRecipientList(c.env, c.req.param('id'));
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'compliance.notices_sent', targetType: 'recipient_list', targetId: c.req.param('id'), metadata: r, ip: clientIp(c) }).run();
  return c.json(r);
});

platformComplianceRoutes.post('/exemptions', async (c) => {
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email(), reason: z.string().trim().min(3).max(500), expiresAt: z.number().int().positive().nullable().optional() }));
  const db = c.env.DB;
  const u = await db.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first<{ id: string }>();
  if (!u) throw notFound('Account');
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO compliance_exemptions (user_id, reason, expires_at, created_by, created_at) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(user_id) DO UPDATE SET reason = ?2, expires_at = ?3, created_by = ?4, created_at = ?5').bind(u.id, input.reason, input.expiresAt ?? null, c.get('user').id, t),
    auditStmt(db, { actorId: c.get('user').id, action: 'compliance.exempted', targetType: 'user', targetId: u.id, metadata: { reason: input.reason, expiresAt: input.expiresAt ?? null }, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, userId: u.id });
});

platformComplianceRoutes.delete('/exemptions/:userId', async (c) => {
  const db = c.env.DB;
  const r = await db.prepare('DELETE FROM compliance_exemptions WHERE user_id = ?').bind(c.req.param('userId')).run();
  if (!r.meta.changes) throw notFound('Exemption');
  await auditStmt(db, { actorId: c.get('user').id, action: 'compliance.exemption_ended', targetType: 'user', targetId: c.req.param('userId'), ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

platformComplianceRoutes.post('/extensions', async (c) => {
  const input = await body(c, z.object({ scope: z.enum(['user', 'company', 'global']), scopeId: z.string().max(64).default(''), days: z.number().int().min(1).max(365), reason: z.string().trim().min(3).max(500) }));
  if (input.scope !== 'global' && !input.scopeId) throw new HttpError(400, 'Name the person or the company');
  const db = c.env.DB;
  const id = newId();
  await db.batch([
    db.prepare('INSERT INTO compliance_extensions (id, scope, scope_id, days, reason, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, input.scope, input.scope === 'global' ? '' : input.scopeId, input.days, input.reason, c.get('user').id, now()),
    auditStmt(db, { actorId: c.get('user').id, action: 'compliance.deadline_extended', metadata: input, ip: clientIp(c) }),
  ]);
  return c.json({ id }, 201);
});

platformComplianceRoutes.post('/accounts/:userId/legal-hold', async (c) => {
  const input = await body(c, z.object({ hold: z.boolean(), reason: z.string().trim().min(3).max(500) }));
  const db = c.env.DB;
  const userId = c.req.param('userId');
  await db.prepare('INSERT INTO compliance_accounts (user_id, legal_hold, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(user_id) DO UPDATE SET legal_hold = ?2, updated_at = ?3').bind(userId, input.hold ? 1 : 0, now()).run();
  await auditStmt(db, { actorId: c.get('user').id, action: input.hold ? 'compliance.legal_hold_on' : 'compliance.legal_hold_off', targetType: 'user', targetId: userId, metadata: { reason: input.reason }, ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

platformComplianceRoutes.post('/accounts/:userId/recover', async (c) => {
  const input = await body(c, z.object({ days: z.number().int().min(1).max(365).default(14), reason: z.string().trim().min(3).max(500) }));
  await recover(c.env.DB, c.req.param('userId'), input.days, c.get('user').id, input.reason);
  return c.json({ ok: true });
});

/** The privacy and legal review (brief 7.6): reviewer, date, jurisdictions and retention. Sets legal_review_completed. */
platformComplianceRoutes.post('/legal-review', async (c) => {
  founderOnly(c);
  const input = await body(
    c,
    z.object({
      reviewer: z.string().trim().min(2).max(200),
      reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      jurisdictions: z.array(z.string().trim().min(2).max(60)).min(1).max(20),
      retention: z.record(z.string().max(60), z.string().max(200)),
      notes: z.string().trim().max(2000).default(''),
    }),
  );
  if (!Object.keys(input.retention).length) throw new HttpError(400, 'Record the approved retention periods');
  await requireReauth(c);
  return c.json(await recordLegalReview(c.env.DB, input, c.get('user').id, clientIp(c)), 201);
});

/** A deletion dry run: who would be deleted in the next batch, and why the others would not. Nothing is deleted. */
platformComplianceRoutes.post('/deletion/dry-run', async (c) => {
  const input = await body(c, z.object({ max: z.number().int().min(1).max(500).optional() }));
  const r = await dryRun(c.env.DB, c.get('user').id, input.max);
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'compliance.deletion_dry_run', targetType: 'deletion_batch', targetId: r.id, metadata: { toDelete: r.toDelete, held: r.held }, ip: clientIp(c) }).run();
  return c.json(r, 201);
});

/** Approves a reviewed dry run. The maintenance run deletes it, checking each account again (flag auto_deletion). */
platformComplianceRoutes.post('/deletion/:id/approve', async (c) => {
  founderOnly(c);
  await requireReauth(c);
  await approveBatch(c.env.DB, c.req.param('id'), c.get('user').id);
  await auditStmt(c.env.DB, { actorId: c.get('user').id, action: 'compliance.deletion_approved', targetType: 'deletion_batch', targetId: c.req.param('id'), ip: clientIp(c) }).run();
  return c.json({ ok: true });
});
