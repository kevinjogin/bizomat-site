// Verification and "Request to join", for companies and for platform admins (Stage 1, R6; docs/platform/verification.md).
//
// Company side (/api/company/c/:company/verification, owner and administrators): the status and its history, the checks
// made, documents uploaded for manual review, "check again" and "ask for a manual review". A company never sets its own
// status.
// Join requests (/api/company/join-requests): someone registering a company that already exists asks its owner to
// join (flag join_requests); the owner and administrators approve or decline (/api/company/c/:company/join-requests).
// Platform side (/api/admin/platform/verification, two-factor sign-in): the dashboard, the review queue, decisions and
// overrides with a reason, evidence downloads, and a check on request.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, notFound, now } from '../lib/util';
import { enqueueEmail } from '../services/email/outbox';
import { auditStmt } from '../services/audit';
import { flagOn } from '../platform/flags';
import { requireMfa, requireReauth } from '../platform/security';
import { ROLE_PRESETS, coAuditStmt, companyTools, requireCompany } from './access';
import { checkIdentifier, isCountryCode, countryOptions } from './countries';
import { REGISTRATION_STATUSES, type RegistrationStatus } from './identity';
import { STATUS_LABELS, setStatus, verifyCompany } from './verification';
import { memberToolStmts } from './sync';

const bytesHex = async (b: Uint8Array) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', b)), (x) => x.toString(16).padStart(2, '0')).join('');

export const MAX_EVIDENCE_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, (b: Uint8Array) => boolean> = {
  'application/pdf': (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46, // %PDF
  'image/png': (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
};

// ------------------------------------------------------------------ company side

export const companyVerificationRoutes = new Hono<AppEnv>();

companyVerificationRoutes.get('/c/:company/verification', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const [reg, history, checks, evidence] = await Promise.all([
    db.prepare('SELECT country, registration_type, registration_number, registration_status, status_source, status_changed_at, verified_at, next_check_at FROM companies WHERE id = ?').bind(a.companyId).first<any>(),
    db.prepare('SELECT old_status, new_status, source, reason, created_at FROM company_verification_history WHERE company_id = ? ORDER BY created_at DESC LIMIT 50').bind(a.companyId).all<any>(),
    db.prepare('SELECT provider, outcome, name_match, status_after, trigger, checked_at FROM company_verifications WHERE company_id = ? ORDER BY checked_at DESC LIMIT 20').bind(a.companyId).all<any>(),
    db.prepare('SELECT id, file_name, content_type, size, note, status, review_note, uploaded_at FROM company_evidence WHERE company_id = ? ORDER BY uploaded_at DESC LIMIT 50').bind(a.companyId).all<any>(),
  ]);
  const checksOn = await flagOn(db, 'registry_verification_enabled', { companyId: a.companyId, country: reg?.country ?? null });
  const enforced = await flagOn(db, 'verification_enforcement', { companyId: a.companyId });
  return c.json({
    status: reg?.registration_status ?? 'not_registered',
    statusLabel: STATUS_LABELS[(reg?.registration_status ?? 'not_registered') as RegistrationStatus],
    registration: reg ? { country: reg.country, type: reg.registration_type, number: reg.registration_number } : null,
    verifiedAt: reg?.verified_at ?? null,
    nextCheckAt: reg?.next_check_at ?? null,
    checksOn,
    enforced,
    history: history.results,
    checks: checks.results,
    evidence: evidence.results,
  });
});

companyVerificationRoutes.post('/c/:company/verification/check', async (c) => {
  const a = await requireCompany(c, 'admin');
  const r = await verifyCompany(c.env, a.companyId, 'on_demand', a.userId);
  if (r.result === 'flag_off') throw new HttpError(409, 'Automatic registry checks are not switched on yet.', { code: 'CHECKS_OFF' });
  return c.json(r);
});

companyVerificationRoutes.post('/c/:company/verification/review', async (c) => {
  const a = await requireCompany(c, 'admin');
  const input = await body(c, z.object({ note: z.string().trim().min(3).max(1000) }));
  const cur = await c.env.DB.prepare('SELECT registration_status FROM companies WHERE id = ?').bind(a.companyId).first<{ registration_status: RegistrationStatus }>();
  if (cur?.registration_status === 'verified') throw new HttpError(409, 'The company is already verified.');
  await setStatus(c.env, a.companyId, 'manual_review', { source: 'system', reason: `Manual review asked for by the company: ${input.note}`, actorId: a.userId });
  await coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'verification.review_requested', ip: clientIp(c) }).run();
  return c.json({ ok: true });
});

/** A document for manual review: PDF, PNG or JPEG up to 10 MB, checked by its first bytes, kept privately. */
companyVerificationRoutes.post('/c/:company/verification/evidence', async (c) => {
  const a = await requireCompany(c, 'admin');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string') throw new HttpError(400, 'Choose a file');
  const f = file as File;
  if (f.size <= 0 || f.size > MAX_EVIDENCE_BYTES) throw new HttpError(400, 'The file must be 10 MB or smaller');
  const type = f.type;
  const bytes = new Uint8Array(await f.arrayBuffer());
  if (!TYPES[type] || !TYPES[type](bytes)) throw new HttpError(400, 'Upload a PDF, PNG or JPEG file');
  const name = (f.name || 'document').replace(/[^\w .()-]+/g, '_').slice(0, 200) || 'document';
  const id = newId();
  const key = `evidence/${a.companyId}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO company_evidence (id, company_id, file_key, file_name, content_type, size, sha256, note, uploaded_by, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, key, name, type, bytes.length, await bytesHex(bytes), String(form?.get('note') ?? '').slice(0, 500), a.userId, t),
    coAuditStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'verification.evidence_uploaded', targetType: 'evidence', targetId: id, ip: clientIp(c) }),
  ]);
  return c.json({ id }, 201);
});

// ------------------------------------------------------------------ request to join

companyVerificationRoutes.get('/registration-options', async (c) => {
  const db = c.env.DB;
  // International registration may be on for everyone or for some countries only (a country scope in the Control
  // Centre): the page offers the countries where it is on. The server checks the country again on registration.
  const everyone = await flagOn(db, 'international_registration');
  const scoped = await db.prepare("SELECT scope_id, value FROM feature_flags WHERE key = 'international_registration' AND scope = 'country'").all<{ scope_id: string; value: string }>();
  const on = scoped.results.filter((r) => r.value === 'on').map((r) => r.scope_id);
  const off = scoped.results.filter((r) => r.value !== 'on').map((r) => r.scope_id);
  return c.json({
    countries: countryOptions(),
    international: everyone || on.length > 0,
    // null: every country apart from those switched off
    internationalCountries: everyone ? null : on,
    internationalOff: off,
    joinRequests: await flagOn(db, 'join_requests'),
  });
});

companyVerificationRoutes.post('/join-requests', async (c) => {
  const user = c.get('user');
  const input = await body(c, z.object({ country: z.string().length(2), type: z.string().min(2).max(20), number: z.string().min(2).max(60), message: z.string().trim().max(500).default('') }));
  const country = input.country.toUpperCase();
  if (!isCountryCode(country)) throw new HttpError(400, 'Choose a country');
  if (!(await flagOn(c.env.DB, 'join_requests', { country }))) throw new HttpError(403, 'Requests to join are not switched on yet.', { code: 'JOIN_REQUESTS_OFF' });
  const id = checkIdentifier(country, input.type, input.number);
  if (!id.ok) throw new HttpError(400, id.message);
  const co = await c.env.DB
    .prepare("SELECT c.id, co.name FROM companies c JOIN co_companies co ON co.id = c.id AND co.deleted_at IS NULL WHERE c.country = ? AND c.registration_type = ? AND c.registration_number = ? AND c.deleted_at IS NULL AND c.type = 'registered'")
    .bind(country, id.type, id.value)
    .first<{ id: string; name: string }>();
  // The same answer whether or not the company exists: nobody learns which numbers are registered.
  const done = { ok: true, message: 'If a company with this number is registered, its owner has been asked.' };
  if (!co) return c.json(done);
  if (await c.env.DB.prepare('SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ?').bind(co.id, user.id).first()) return c.json(done);
  const t = now();
  const rid = newId();
  const ins = await c.env.DB.prepare("INSERT OR IGNORE INTO company_join_requests (id, company_id, user_id, message, status, created_at) VALUES (?, ?, ?, ?, 'pending', ?)").bind(rid, co.id, user.id, input.message, t).run();
  if (ins.meta.changes) {
    await coAuditStmt(c.env.DB, { companyId: co.id, actorId: user.id, action: 'join.requested', targetType: 'join_request', targetId: rid }).run();
    const admins = await c.env.DB.prepare("SELECT u.id, u.email, u.name FROM co_members m JOIN users u ON u.id = m.user_id AND u.disabled_at IS NULL WHERE m.company_id = ? AND m.role IN ('owner', 'admin')").bind(co.id).all<{ id: string; email: string; name: string }>();
    for (const p of admins.results) {
      await enqueueEmail(c.env, {
        userId: p.id,
        to: p.email,
        toName: p.name,
        data: { template: 'notification', organisation: co.name, title: `${user.name} asked to join ${co.name}`, body: `${user.name} (${user.email}) tried to register ${co.name} and asked to join it instead${input.message ? `: "${input.message}"` : ''}. Approve or decline it under People, Requests to join.`, url: null },
        idempotencyKey: `join:${rid}:${p.id}`,
      }).catch(() => null);
    }
  }
  return c.json(done);
});

companyVerificationRoutes.get('/c/:company/join-requests', async (c) => {
  const a = await requireCompany(c, 'admin');
  const rows = await c.env.DB
    .prepare("SELECT r.id, r.message, r.created_at, u.name, u.email FROM company_join_requests r JOIN users u ON u.id = r.user_id WHERE r.company_id = ? AND r.status = 'pending' ORDER BY r.created_at")
    .bind(a.companyId)
    .all();
  return c.json(rows.results);
});

companyVerificationRoutes.post('/c/:company/join-requests/:id/:decision{approve|decline}', async (c) => {
  const a = await requireCompany(c, 'admin');
  const db = c.env.DB;
  const input = await body(c, z.object({ role: z.enum(['manager', 'employee', 'read_only']).default('employee') }));
  const r = await db.prepare("SELECT * FROM company_join_requests WHERE id = ? AND company_id = ? AND status = 'pending'").bind(c.req.param('id'), a.companyId).first<{ id: string; user_id: string }>();
  if (!r) throw notFound('Request');
  const t = now();
  const approve = c.req.param('decision') === 'approve';
  const stmts: D1PreparedStatement[] = [
    db.prepare('UPDATE company_join_requests SET status = ?, decided_by = ?, decided_at = ? WHERE id = ? AND company_id = ?').bind(approve ? 'approved' : 'declined', a.userId, t, r.id, a.companyId),
    coAuditStmt(db, { companyId: a.companyId, actorId: a.userId, action: approve ? 'join.approved' : 'join.declined', targetType: 'user', targetId: r.user_id, metadata: { role: input.role }, ip: clientIp(c) }),
  ];
  if (approve) {
    // Joins with the role's preset in each tool (src/worker/company/access.ts), through the same path as an invitation.
    const tools = await companyTools(db, a.companyId);
    const p = ROLE_PRESETS[input.role];
    const roles = { tasks: tools.tasks ? p.tasks : null, crm: tools.crm ? p.crm : null, finance: tools.finance ? p.finance : null };
    stmts.push(
      db.prepare('INSERT OR IGNORE INTO co_members (company_id, user_id, role, title, tasks_role, crm_role, fin_role, invited_by, joined_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(a.companyId, r.user_id, input.role, '', roles.tasks, roles.crm, roles.finance, a.userId, t),
      ...memberToolStmts(db, Object.fromEntries(Object.entries(tools).filter(([k]) => roles[k as keyof typeof roles])) as any, r.user_id, roles as any, a.userId),
    );
  }
  await db.batch(stmts);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ platform side

export const platformVerificationRoutes = new Hono<AppEnv>();
platformVerificationRoutes.use('*', requireMfa);

platformVerificationRoutes.get('/', async (c) => {
  const db = c.env.DB;
  const t = now();
  const [totals, queue, changes, providers, checks] = await Promise.all([
    db.prepare("SELECT registration_status AS status, COUNT(*) AS n FROM companies WHERE type = 'registered' AND deleted_at IS NULL GROUP BY registration_status").all<{ status: string; n: number }>(),
    db
      .prepare(
        `SELECT c.id, co.name, c.country, c.registration_type, c.registration_number, c.registration_status, c.status_changed_at, c.next_check_at,
                (SELECT COUNT(*) FROM company_evidence e WHERE e.company_id = c.id AND e.status = 'pending') AS evidence
           FROM companies c JOIN co_companies co ON co.id = c.id
          WHERE c.type = 'registered' AND c.deleted_at IS NULL AND c.registration_status IN ('manual_review', 'verification_failed', 'status_changed', 'registration_pending')
          ORDER BY CASE c.registration_status WHEN 'manual_review' THEN 0 WHEN 'status_changed' THEN 1 WHEN 'verification_failed' THEN 2 ELSE 3 END, c.status_changed_at LIMIT 200`,
      )
      .all(),
    db.prepare('SELECT h.company_id, co.name, h.old_status, h.new_status, h.source, h.reason, h.created_at FROM company_verification_history h LEFT JOIN co_companies co ON co.id = h.company_id WHERE h.created_at > ? ORDER BY h.created_at DESC LIMIT 100').bind(t - 30 * 86_400_000).all(),
    db.prepare('SELECT * FROM company_registry_providers ORDER BY id').all(),
    db.prepare("SELECT MAX(checked_at) AS last, SUM(CASE WHEN outcome = 'unavailable' AND checked_at > ? THEN 1 ELSE 0 END) AS errors FROM company_verifications").bind(t - 86_400_000).first<{ last: number | null; errors: number | null }>(),
  ]);
  const next = await db.prepare("SELECT MIN(next_check_at) AS next FROM companies WHERE type = 'registered' AND deleted_at IS NULL AND next_check_at IS NOT NULL").first<{ next: number | null }>();
  return c.json({
    totals: Object.fromEntries(REGISTRATION_STATUSES.map((s) => [s, totals.results.find((r) => r.status === s)?.n ?? 0])),
    queue: queue.results,
    changes: changes.results,
    providers: providers.results,
    lastCheckAt: checks?.last ?? null,
    errorsToday: Number(checks?.errors ?? 0),
    nextCheckAt: next?.next ?? null,
    configured: { abr: !!c.env.ABR_GUID?.trim(), companies_house: !!c.env.COMPANIES_HOUSE_API_KEY?.trim() },
    flags: {
      checks: await flagOn(db, 'registry_verification_enabled'),
      scheduled: await flagOn(db, 'scheduled_reverification'),
      enforcement: await flagOn(db, 'verification_enforcement'),
    },
  });
});

platformVerificationRoutes.get('/:company', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('company');
  const co = await db.prepare("SELECT c.*, co.name AS co_name, co.legal_name FROM companies c JOIN co_companies co ON co.id = c.id WHERE c.id = ? AND c.type = 'registered'").bind(id).first<any>();
  if (!co) throw notFound('Registered company');
  const [history, checks, evidence] = await Promise.all([
    db.prepare('SELECT h.*, u.name AS actor FROM company_verification_history h LEFT JOIN users u ON u.id = h.actor_id WHERE h.company_id = ? ORDER BY h.created_at DESC LIMIT 100').bind(id).all(),
    db.prepare('SELECT * FROM company_verifications WHERE company_id = ? ORDER BY checked_at DESC LIMIT 50').bind(id).all(),
    db.prepare('SELECT id, file_name, content_type, size, note, status, review_note, uploaded_at FROM company_evidence WHERE company_id = ? ORDER BY uploaded_at DESC').bind(id).all(),
  ]);
  return c.json({ company: co, history: history.results, checks: checks.results, evidence: evidence.results });
});

platformVerificationRoutes.post('/:company/check', async (c) => {
  return c.json(await verifyCompany(c.env, c.req.param('company'), 'admin', c.get('user').id));
});

/**
 * A decision by hand: approve (verified), reject (verification failed), ask for more information (manual review), or
 * any other status as an override. Always with a reason; recorded with the old and new status and the time; a fresh
 * password and code first.
 */
platformVerificationRoutes.post('/:company/decision', async (c) => {
  const input = await body(c, z.object({ status: z.enum(REGISTRATION_STATUSES), reason: z.string().trim().min(3).max(500), evidence: z.array(z.object({ id: z.string().max(64), status: z.enum(['accepted', 'rejected']) })).max(50).optional() }));
  await requireReauth(c);
  const db = c.env.DB;
  const id = c.req.param('company');
  const co = await db.prepare("SELECT id FROM companies WHERE id = ? AND type = 'registered' AND deleted_at IS NULL").bind(id).first();
  if (!co) throw notFound('Registered company');
  const me = c.get('user');
  const t = now();
  const r = await setStatus(c.env, id, input.status, { source: 'manual', reason: input.reason, actorId: me.id, at: t });
  const stmts: D1PreparedStatement[] = [
    auditStmt(db, { actorId: me.id, action: 'platform.verification_decision', targetType: 'company', targetId: id, metadata: { from: r.before, to: input.status, reason: input.reason }, ip: clientIp(c) }),
    coAuditStmt(db, { companyId: id, actorId: me.id, action: 'verification.decided', metadata: { from: r.before, to: input.status }, ip: clientIp(c) }),
  ];
  for (const e of input.evidence ?? []) stmts.push(db.prepare('UPDATE company_evidence SET status = ?, reviewed_by = ?, reviewed_at = ?, review_note = ? WHERE id = ? AND company_id = ?').bind(e.status, me.id, t, input.reason, e.id, id));
  await db.batch(stmts);
  return c.json({ ok: true, changed: r.changed, from: r.before, to: input.status });
});

platformVerificationRoutes.get('/:company/evidence/:id', async (c) => {
  const db = c.env.DB;
  const e = await db.prepare('SELECT * FROM company_evidence WHERE id = ? AND company_id = ?').bind(c.req.param('id'), c.req.param('company')).first<{ file_key: string; file_name: string; content_type: string }>();
  if (!e) throw notFound('Document');
  const obj = await c.env.FILES.get(e.file_key);
  if (!obj) throw notFound('Document');
  await auditStmt(db, { actorId: c.get('user').id, action: 'platform.evidence_viewed', targetType: 'company', targetId: c.req.param('company'), ip: clientIp(c) }).run();
  return new Response(obj.body, {
    headers: { 'Content-Type': e.content_type, 'Content-Disposition': `attachment; filename="${e.file_name.replace(/"/g, '')}"`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' },
  });
});

// ------------------------------------------------------------------ registration outside Australia

const internationalSchema = z.object({
  country: z.string().length(2),
  name: z.string().trim().min(2).max(100),
  legalName: z.string().trim().min(2).max(200),
  tradingName: z.string().trim().max(100).default(''),
  structure: z.string().min(2).max(40),
  registrationType: z.string().max(20).default(''),
  registrationNumber: z.string().trim().max(60).default(''),
  email: z.string().trim().toLowerCase().email().max(320),
  phone: z.string().trim().min(6).max(30),
  addressLine1: z.string().trim().min(2).max(200),
  addressLine2: z.string().trim().max(200).default(''),
  city: z.string().trim().min(1).max(100),
  region: z.string().trim().max(60).default(''),
  postcode: z.string().trim().max(12).default(''),
  website: z.string().trim().max(200).default(''),
});

/**
 * A company registered outside Australia (flag international_registration, off). The company account and its owner are
 * made; its tools are added afterwards in the company area. Its registration number is checked for format and is
 * unique per country and type; it is verified by its register where one can be asked, else by hand. Australian
 * companies keep their own form (POST /api/company/companies).
 */
companyVerificationRoutes.post('/companies/international', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const input = await body(c, internationalSchema);
  const country = input.country.toUpperCase();
  if (!isCountryCode(country) || country === 'AU') throw new HttpError(400, 'Australian companies register with the Australian form');
  if (!(await flagOn(db, 'international_registration', { country }))) throw new HttpError(403, 'Registration outside Australia is not switched on yet.', { code: 'INTERNATIONAL_OFF' });
  const { countryRule } = await import('./countries');
  const rule = countryRule(country);
  if (!rule.structures.some((s) => s.id === input.structure)) throw new HttpError(400, 'Choose the legal structure');
  let reg: { type: string; value: string } | null = null;
  if (!rule.noNumber.includes(input.structure) || input.registrationNumber) {
    const id = checkIdentifier(country, input.registrationType, input.registrationNumber);
    if (!id.ok) throw new HttpError(400, id.message);
    reg = { type: id.type, value: id.value };
    const taken = await db.prepare('SELECT 1 FROM companies WHERE country = ? AND registration_type = ? AND registration_number = ? AND deleted_at IS NULL').bind(country, reg.type, reg.value).first();
    if (taken) {
      const join = await flagOn(db, 'join_requests', { country });
      throw new HttpError(409, join ? 'A BIZOMAT company account already uses this registration number. You can ask its owner to let you join.' : 'A BIZOMAT company account already uses this registration number. Ask its owner to invite you.', { code: 'COMPANY_EXISTS', requestToJoin: join });
    }
  }
  const t = now();
  const id = newId();
  const kind = /sole|proprietor/.test(input.structure) ? 'individual' : 'business';
  const { syncCompanyStatements } = await import('./identity');
  await db.batch([
    db
      .prepare(
        `INSERT INTO co_companies (id, name, kind, legal_name, country, abn_status, email, phone, phone_kind, address_line1, address_line2, suburb, state, postcode, website, settings_json, created_by, created_at, updated_at, trading_name)
         VALUES (?, ?, ?, ?, ?, 'none', ?, ?, 'international', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, input.name, kind, input.legalName, country, input.email, input.phone, input.addressLine1, input.addressLine2, input.city, input.region, input.postcode, input.website, JSON.stringify({ structure: input.structure }), user.id, t, t, input.tradingName),
    db.prepare("INSERT INTO co_members (company_id, user_id, role, joined_at) VALUES (?, ?, 'owner', ?)").bind(id, user.id, t),
    ...syncCompanyStatements(db, id, t),
    db
      .prepare("UPDATE companies SET legal_structure = ?, registration_type = ?, registration_number = ?, registration_status = ?, status_source = 'system', status_changed_at = ? WHERE id = ?")
      .bind(input.structure, reg?.type ?? null, reg?.value ?? null, reg ? 'registration_pending' : 'not_registered', t, id),
    coAuditStmt(db, { companyId: id, actorId: user.id, action: 'company.created', targetType: 'company', targetId: id, metadata: { country, structure: input.structure }, ip: clientIp(c) }),
  ]);
  c.executionCtx?.waitUntil?.(verifyCompany(c.env, id, 'initial', user.id).catch(() => null));
  return c.json({ company: { id, name: input.name, country } }, 201);
});
