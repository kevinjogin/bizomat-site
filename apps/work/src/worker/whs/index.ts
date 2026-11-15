// BIZOMAT WHS, Release 1 (the core): a Work Health & Safety Management System inside BIZOMAT ERP (owner's WHS brief,
// sections 1 to 9, 13 in part, 20's privacy rules and 27). The API under /api/whs (signed in), mounted by
// src/worker/app.ts: the same Worker, database, file store, accounts and session as the rest of the ERP. Platform
// administration of the jurisdiction packs is under /api/admin/whs (platform administrators only). Tables:
// migrations/0026_whs_core.sql. Who may do what: access.ts. Docs: docs/whs/README.md.
//
//   GET  /packs, /packs/:pack                      jurisdiction packs, read only, with their verification status (legal.ts)
//   GET  /my-work                                  what is assigned to the caller in every company (My Work)
//   GET  /c/:company/me                            the caller's WHS roles and capabilities, people, sites, the risk matrix
//   GET  /c/:company/summary                       counts for the ERP dashboard's card
//   GET  /c/:company/dashboard                     the WHS dashboard (dashboard.ts)
//   GET  /c/:company/settings                      risk matrix, sites and jurisdictions, hours worked, company policies
//   PUT  /c/:company/settings/matrix               a new version of the risk matrix (WHS managers)
//   PUT  /c/:company/sites/:site/jurisdictions     the packs of a site (WHS managers)
//   PUT  /c/:company/hours                         hours worked per site and month, with a reason to change one (hours.ts)
//   POST /c/:company/policies, PATCH /policies/:id company policies (WHS managers)
//   POST /c/:company/files, GET/DELETE /files/:id  photos and documents (each served only to who may see its record)
//   POST /c/:company/comments                      notes and consultation comments
//   GET  /c/:company/alerts, POST /alerts/read     in-app alerts
//   hazards.ts, risk.ts, incidents.ts, actions.ts: the registers

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { MAX_FILE_BYTES, validateUpload } from '../routes/files';
import { companyPeople } from '../erp/access';
import { ROLE_LABELS } from '../erp/access';
import { WHS_ROLES, actionScope, assertWhs, confidentialReaders, hazardScope, incidentScope, loadWhsAccess, raScope, requireWhs, type WhsAccess } from './access';
import { actionRoutes, escalateOverdue } from './actions';
import { hazardRoutes, CONFIDENTIAL_CATEGORIES } from './hazards';
import { riskRoutes } from './risk';
import { incidentRoutes } from './incidents';
import { ensureSeed, legalRoutes, packDTO, VERIFY_NOTICE } from './legal';
import { dashboard, filtersFrom } from './dashboard';
import { hoursRoutes, hoursView } from './hours';
import {
  ACTION_KINDS,
  ACTION_SOURCES,
  ACTION_STATUS,
  EFFECTIVENESS,
  FISHBONE,
  HAZARD_CATEGORIES,
  HAZARD_STATUS,
  HIERARCHY,
  INCIDENT_KINDS,
  INCIDENT_STATUS,
  INSTRUMENT_KINDS,
  INSTRUMENT_NOTES,
  INV_METHODS,
  LIVE_ACTION_SOURCES,
  NOTIFICATION_STATUS,
  OUTCOMES,
  PRIORITIES,
  RA_KINDS,
  RA_STATUS,
  REVIEW_TRIGGERS,
  SEVERITIES,
  SUBMISSION_METHODS,
  badState,
  currentMatrix,
  eventStmt,
  fileDTO,
  todayFrom,
  validMatrix,
  zDate,
  zLong,
  zText,
  zUrl,
  nextNumber,
} from './util';
import { ensureOwnCompany } from '../system/system';

export const whsRoutes = new Hono<AppEnv>();

whsRoutes.route('/', legalRoutes);
whsRoutes.route('/', hoursRoutes);

/** The fixed lists with their labels, so the screens never keep their own copies. */
export const LISTS = {
  hazardCategories: HAZARD_CATEGORIES,
  hazardStatus: HAZARD_STATUS,
  confidentialCategories: CONFIDENTIAL_CATEGORIES,
  raKinds: RA_KINDS,
  raStatus: RA_STATUS,
  reviewTriggers: REVIEW_TRIGGERS,
  hierarchy: HIERARCHY,
  effectiveness: EFFECTIVENESS,
  incidentKinds: INCIDENT_KINDS,
  incidentStatus: INCIDENT_STATUS,
  outcomes: OUTCOMES,
  severities: SEVERITIES,
  notificationStatus: NOTIFICATION_STATUS,
  submissionMethods: SUBMISSION_METHODS,
  invMethods: INV_METHODS,
  fishbone: FISHBONE,
  actionStatus: ACTION_STATUS,
  actionKinds: ACTION_KINDS,
  actionSources: ACTION_SOURCES,
  liveActionSources: LIVE_ACTION_SOURCES,
  priorities: PRIORITIES,
  instrumentKinds: INSTRUMENT_KINDS,
  instrumentNotes: INSTRUMENT_NOTES,
};

whsRoutes.get('/c/:company/me', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const people = await companyPeople(db, a);
  const departments = a.kind === 'registered' ? (await db.prepare('SELECT id, name FROM co_departments WHERE company_id = ? AND archived_at IS NULL ORDER BY name COLLATE NOCASE').bind(a.companyId).all<{ id: string; name: string }>()).results : [];
  const sites = await sitesWithPacks(db, a.companyId);
  const { matrix, version } = await currentMatrix(db, a.companyId, a.userId);
  const readers = await confidentialReaders(db, a);
  const whsRoles = a.roles.filter((r) => (WHS_ROLES as readonly string[]).includes(r));
  return c.json({
    company: { id: a.companyId, name: a.companyName, kind: a.kind },
    user: { id: a.userId, name: a.userName },
    roles: a.roles,
    roleLabels: a.roles.map((r) => ROLE_LABELS[r]),
    whsRoleLabels: whsRoles.map((r) => ROLE_LABELS[r]),
    solo: a.solo,
    can: a.can,
    // names only: the people a record can be assigned to
    people: people.map((p) => ({ id: p.id, name: p.name })),
    departments,
    sites: sites.map((s) => ({ id: s.id, code: s.code, name: s.name, packs: s.packs })),
    matrix,
    matrixVersion: version,
    confidentialReaders: readers,
    healthOfficers: a.solo ? 1 : people.filter((p) => (p.roles as readonly string[]).includes('health_officer')).length,
    lists: LISTS,
    notice: VERIFY_NOTICE,
  });
});

async function sitesWithPacks(db: D1Database, companyId: string) {
  const [sites, packs] = await db.batch([
    db.prepare('SELECT id, code, name, address FROM mt_sites WHERE company_id = ? AND archived_at IS NULL ORDER BY name COLLATE NOCASE').bind(companyId),
    db.prepare('SELECT sp.site_id, p.id, p.code, p.name, p.regulator, (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = \'active\' AND r.verification = \'verified\') AS verified_rules, (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = \'active\') AS rules FROM whs_site_packs sp JOIN whs_packs p ON p.id = sp.pack_id WHERE sp.company_id = ? ORDER BY p.sort').bind(companyId),
  ]);
  return (sites.results as any[]).map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    address: s.address,
    packs: (packs.results as any[]).filter((p) => p.site_id === s.id).map((p) => ({ id: p.id, code: p.code, name: p.name, regulator: p.regulator, rules: Number(p.rules), verifiedRules: Number(p.verified_rules) })),
  }));
}

// ------------------------------------------------------------------ dashboard, summary, alerts

whsRoutes.get('/c/:company/dashboard', async (c) => {
  const a = await requireWhs(c, 'view');
  const today = todayFrom(c.req.query('today'));
  // overdue actions are escalated as the dashboard opens, not only on the 15-minute run
  await escalateOverdue(c.env, today, a.companyId, 50);
  return c.json(await dashboard(c.env.DB, a, filtersFrom((k) => c.req.query(k), today)));
});

/** The ERP dashboard's WHS card: what this person may see (the registers' counts, or their own reports). */
whsRoutes.get('/c/:company/summary', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const hs = hazardScope(a, 'h');
  const is = incidentScope(a, 'i');
  const xs = actionScope(a, 'x');
  const { matrix } = await currentMatrix(db, a.companyId, a.userId);
  const [h, i, x, al] = await db.batch([
    db.prepare(`SELECT SUM(CASE WHEN h.status NOT IN ('closed','cancelled') THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN h.status NOT IN ('closed','cancelled') AND h.risk_rank >= ? THEN 1 ELSE 0 END) AS high FROM whs_hazards h WHERE h.company_id = ? AND ${hs.sql}`).bind(matrix.highFrom, a.companyId, ...hs.args),
    db.prepare(`SELECT SUM(CASE WHEN i.status <> 'closed' THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN i.notification_status IN ('assessing','notifiable') OR (i.potentially_notifiable = 1 AND i.notification_status = 'not_assessed') THEN 1 ELSE 0 END) AS notify FROM whs_incidents i WHERE i.company_id = ? AND ${is.sql}`).bind(a.companyId, ...is.args),
    db.prepare(`SELECT SUM(CASE WHEN x.status IN ('open','in_progress') THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN x.status IN ('open','in_progress') AND x.due_date < ? THEN 1 ELSE 0 END) AS overdue, SUM(CASE WHEN x.status IN ('open','in_progress') AND x.responsible_id = ? THEN 1 ELSE 0 END) AS mine FROM whs_actions x WHERE x.company_id = ? AND ${xs.sql}`).bind(today, a.userId, a.companyId, ...xs.args),
    db.prepare('SELECT COUNT(*) AS n FROM whs_alerts WHERE company_id = ? AND user_id = ? AND read_at IS NULL').bind(a.companyId, a.userId),
  ]);
  const v = (r: D1Result, k: string) => Number((r.results[0] as any)?.[k] ?? 0);
  return c.json({ scope: a.can.view ? 'register' : 'own', activeHazards: v(h, 'active'), highRisks: v(h, 'high'), openIncidents: v(i, 'open'), notifications: v(i, 'notify'), openActions: v(x, 'open'), overdueActions: v(x, 'overdue'), myActions: v(x, 'mine'), unreadAlerts: v(al, 'n') });
});

whsRoutes.get('/c/:company/alerts', async (c) => {
  const a = await requireWhs(c);
  const rows = await c.env.DB.prepare('SELECT * FROM whs_alerts WHERE company_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 50').bind(a.companyId, a.userId).all<any>();
  return c.json({ alerts: rows.results.map((x) => ({ id: x.id, kind: x.kind, title: x.title, body: x.body, link: x.link, read: !!x.read_at, emailed: !!x.emailed, at: x.created_at })), unread: rows.results.filter((x) => !x.read_at).length });
});

whsRoutes.post('/c/:company/alerts/read', async (c) => {
  const a = await requireWhs(c);
  const input = await body(c, z.object({ ids: z.array(z.string().max(64)).max(100).optional(), all: z.boolean().optional() }));
  const t = now();
  if (input.all) await c.env.DB.prepare('UPDATE whs_alerts SET read_at = ? WHERE company_id = ? AND user_id = ? AND read_at IS NULL').bind(t, a.companyId, a.userId).run();
  else if (input.ids?.length) await c.env.DB.batch(input.ids.map((id) => c.env.DB.prepare('UPDATE whs_alerts SET read_at = ? WHERE company_id = ? AND user_id = ? AND id = ? AND read_at IS NULL').bind(t, a.companyId, a.userId, id)));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ My Work: what is assigned to the caller, in every company

/** The companies the person works in (registered companies, their own, their example company). */
async function myCompanies(db: D1Database, user: { id: string; name: string; email: string }) {
  await ensureOwnCompany(db, user);
  const [reg, own, demo] = await db.batch([
    db.prepare('SELECT co.id, co.name FROM co_members m JOIN co_companies co ON co.id = m.company_id AND co.deleted_at IS NULL AND co.suspended_at IS NULL WHERE m.user_id = ? ORDER BY co.name COLLATE NOCASE').bind(user.id),
    db.prepare('SELECT id, name FROM sys_companies WHERE owner_id = ?').bind(user.id),
    db.prepare("SELECT company_id AS id, name FROM sys_demo WHERE user_id = ? AND status = 'ready'").bind(user.id),
  ]);
  return [...(reg.results as any[]), ...(own.results as any[]), ...(demo.results as any[])] as { id: string; name: string }[];
}

whsRoutes.get('/my-work', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const today = todayFrom(c.req.query('today'));
  const out: unknown[] = [];
  for (const co of await myCompanies(db, user)) {
    const [actions, hazards, invs, notices, approvals, alerts] = await db.batch([
      db.prepare("SELECT id, number, title, due_date, status, priority FROM whs_actions WHERE company_id = ? AND responsible_id = ? AND status IN ('open', 'in_progress') ORDER BY COALESCE(due_date, '9999') LIMIT 50").bind(co.id, user.id),
      db.prepare("SELECT id, number, title, due_date, status FROM whs_hazards WHERE company_id = ? AND responsible_id = ? AND status NOT IN ('closed', 'cancelled') ORDER BY COALESCE(due_date, '9999') LIMIT 50").bind(co.id, user.id),
      db
        .prepare(
          `SELECT DISTINCT v.id, v.number, v.status, i.id AS incident_id, i.number AS incident_number, i.title, i.confidential FROM whs_investigations v JOIN whs_incidents i ON i.company_id = v.company_id AND i.id = v.incident_id
             LEFT JOIN whs_inv_team t ON t.company_id = v.company_id AND t.investigation_id = v.id AND t.user_id = ?1
            WHERE v.company_id = ?2 AND v.status = 'open' AND (v.lead_id = ?1 OR t.user_id IS NOT NULL) LIMIT 50`,
        )
        .bind(user.id, co.id),
      db.prepare("SELECT n.id, n.due_at, n.due_note, n.regulator, i.id AS incident_id, i.number, i.title, i.confidential FROM whs_reg_notices n JOIN whs_incidents i ON i.company_id = n.company_id AND i.id = n.incident_id WHERE n.company_id = ? AND n.responsible_id = ? AND n.status = 'to_submit' LIMIT 50").bind(co.id, user.id),
      db.prepare("SELECT COUNT(*) AS n FROM whs_risk_assessments WHERE company_id = ? AND status = 'submitted'").bind(co.id),
      db.prepare('SELECT COUNT(*) AS n FROM whs_alerts WHERE company_id = ? AND user_id = ? AND read_at IS NULL').bind(co.id, user.id),
    ]);
    const items = [
      ...(actions.results as any[]).map((x) => ({ type: 'action', id: x.id, number: x.number, title: x.title, due: x.due_date, overdue: !!x.due_date && x.due_date < today, status: x.status, link: `/c/${co.id}/whs/actions/${x.id}` })),
      ...(hazards.results as any[]).map((x) => ({ type: 'hazard', id: x.id, number: x.number, title: x.title, due: x.due_date, overdue: !!x.due_date && x.due_date < today, status: x.status, link: `/c/${co.id}/whs/hazards/${x.id}` })),
      ...(invs.results as any[]).map((x) => ({ type: 'investigation', id: x.id, number: `${x.number} (${x.incident_number})`, title: x.confidential ? 'Confidential incident' : x.title, due: null, overdue: false, status: x.status, link: `/c/${co.id}/whs/incidents/${x.incident_id}/investigation` })),
      ...(notices.results as any[]).map((x) => ({ type: 'notification', id: x.id, number: x.number, title: `Notify ${x.regulator}${x.confidential ? '' : `: ${x.title}`}`, due: x.due_at ? new Date(x.due_at).toISOString() : null, dueNote: x.due_note, overdue: !!x.due_at && x.due_at < Date.now(), status: 'to_submit', link: `/c/${co.id}/whs/incidents/${x.incident_id}/notification` })),
    ];
    // approvals: only for people who may approve in that company
    let toApprove = 0;
    const waiting = Number((approvals.results[0] as any)?.n ?? 0);
    if (waiting) {
      const acc = await loadWhsAccess(db, co.id, user).catch(() => null);
      if (acc?.can.approve) toApprove = waiting;
    }
    const unread = Number((alerts.results[0] as any)?.n ?? 0);
    if (items.length || toApprove || unread) out.push({ company: co, items, toApprove, unreadAlerts: unread });
  }
  return c.json({ companies: out, today });
});

// ------------------------------------------------------------------ settings: matrix, sites and jurisdictions, hours, policies

whsRoutes.get('/c/:company/settings', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  await ensureSeed(db);
  const { matrix, version } = await currentMatrix(db, a.companyId, a.userId);
  const [packs, policies, versions] = await db.batch([
    db.prepare("SELECT p.*, (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active') AS rules, (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active' AND r.verification = 'verified') AS verified_rules, 0 AS instruments, 0 AS verified_instruments FROM whs_packs p WHERE p.assignable = 1 ORDER BY p.sort, p.name"),
    db.prepare('SELECT p.*, k.name AS pack_name, u.name AS approved_by_name FROM whs_policies p LEFT JOIN whs_packs k ON k.id = p.pack_id LEFT JOIN users u ON u.id = p.approved_by WHERE p.company_id = ? ORDER BY p.status, p.number').bind(a.companyId),
    db.prepare('SELECT m.version, m.created_at, u.name AS by_name FROM whs_matrices m LEFT JOIN users u ON u.id = m.created_by WHERE m.company_id = ? ORDER BY m.version DESC LIMIT 20').bind(a.companyId),
  ]);
  return c.json({
    matrix,
    matrixVersion: version,
    matrixVersions: (versions.results as any[]).map((v) => ({ version: v.version, at: v.created_at, byName: v.by_name ?? null })),
    sites: await sitesWithPacks(db, a.companyId),
    packs: (packs.results as any[]).map(packDTO),
    // hours worked and their history only for people who read the WHS registers (hours.ts)
    ...(await hoursView(db, a)),
    policies: (policies.results as any[]).map(policyDTO),
    can: { manage: a.can.manage },
    notice: VERIFY_NOTICE,
  });
});

function policyDTO(p: any) {
  return { id: p.id, number: p.number, title: p.title, kind: 'company_policy', kindLabel: INSTRUMENT_KINDS.company_policy, kindNote: INSTRUMENT_NOTES.company_policy, packId: p.pack_id, packName: p.pack_name ?? null, summary: p.summary, sourceUrl: p.source_url, effectiveFrom: p.effective_from, reviewDate: p.review_date, status: p.status, approvedAt: p.approved_at, approvedByName: p.approved_by_name ?? null };
}

whsRoutes.put('/c/:company/settings/matrix', async (c) => {
  const a = await requireWhs(c, 'manage');
  const db = c.env.DB;
  const input = await body(c, z.object({ matrix: z.unknown() }));
  const m = validMatrix(input.matrix);
  const cur = await currentMatrix(db, a.companyId, a.userId);
  if (JSON.stringify(cur.matrix) === JSON.stringify(m)) return c.json({ matrix: cur.matrix, matrixVersion: cur.version });
  const id = newId();
  const t = now();
  const version = cur.version + 1;
  try {
    await db.batch([
      db.prepare('INSERT INTO whs_matrices (id, company_id, version, matrix_json, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id, a.companyId, version, JSON.stringify(m), a.userId, t),
      db.prepare('UPDATE whs_settings SET matrix_id = ?, updated_by = ?, updated_at = ? WHERE company_id = ?').bind(id, a.userId, t, a.companyId),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'settings.matrix', entityType: 'settings', entityId: a.companyId, summary: `Risk matrix version ${version}: ${m.likelihood.length} x ${m.consequence.length}, levels ${m.levels.map((l) => l.label).join(', ')}. Earlier ratings keep the version they were made on.`, before: { version: cur.version }, after: { version, size: `${m.likelihood.length}x${m.consequence.length}` }, at: t }),
    ]);
  } catch (e) {
    if (String((e as Error)?.message ?? e).includes('UNIQUE')) badState('The matrix changed at the same moment: refresh and try again');
    throw e;
  }
  return c.json({ matrix: m, matrixVersion: version });
});

whsRoutes.put('/c/:company/sites/:site/jurisdictions', async (c) => {
  const a = await requireWhs(c, 'manage');
  const db = c.env.DB;
  await ensureSeed(db);
  const site = await db.prepare('SELECT id, name FROM mt_sites WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, c.req.param('site')).first<{ id: string; name: string }>();
  if (!site) throw notFound('Site');
  const input = await body(c, z.object({ packIds: z.array(z.string().max(40)).max(10) }));
  const ids = [...new Set(input.packIds)];
  const packs = ids.length ? (await db.prepare(`SELECT id, name, assignable FROM whs_packs WHERE id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all<{ id: string; name: string; assignable: number }>()).results : [];
  if (packs.length !== ids.length) throw new HttpError(400, 'Choose jurisdictions from the list');
  const ref = packs.find((p) => !p.assignable);
  if (ref) throw new HttpError(400, `${ref.name} is a reference, not a jurisdiction: it applies to no site`);
  const before = (await db.prepare('SELECT pack_id FROM whs_site_packs WHERE company_id = ? AND site_id = ?').bind(a.companyId, site.id).all<{ pack_id: string }>()).results.map((r) => r.pack_id);
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM whs_site_packs WHERE company_id = ? AND site_id = ?').bind(a.companyId, site.id),
    ...ids.map((p) => db.prepare('INSERT INTO whs_site_packs (company_id, site_id, pack_id, assigned_by, assigned_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, site.id, p, a.userId, t)),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'site.jurisdictions', entityType: 'site', entityId: site.id, summary: `${site.name}: jurisdictions ${packs.length ? packs.map((p) => p.name).join(', ') : 'none'}`, before: { packs: before }, after: { packs: ids }, at: t }),
  ]);
  return c.json({ sites: await sitesWithPacks(db, a.companyId) });
});

const zPolicy = z.object({ title: zText(300).min(1), packId: z.string().max(40).nullable().optional(), summary: zLong(3000).optional(), sourceUrl: z.union([zUrl, z.literal('')]).optional(), effectiveFrom: zDate.optional(), reviewDate: zDate.optional() });

whsRoutes.post('/c/:company/policies', async (c) => {
  const a = await requireWhs(c, 'manage');
  const db = c.env.DB;
  const input = await body(c, zPolicy);
  if (input.packId && !(await db.prepare('SELECT 1 FROM whs_packs WHERE id = ?').bind(input.packId).first())) throw new HttpError(400, 'Choose a jurisdiction from the list');
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'policy');
  const t = now();
  await db.batch([
    db.prepare("INSERT INTO whs_policies (id, company_id, number, title, pack_id, summary, source_url, effective_from, review_date, status, approved_by, approved_at, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)").bind(id, a.companyId, number, input.title, input.packId ?? null, input.summary ?? '', input.sourceUrl ?? '', input.effectiveFrom ?? null, input.reviewDate ?? null, a.userId, t, a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'policy.added', entityType: 'policy', entityId: id, summary: `${number} company policy added: ${input.title}`, after: input, at: t }),
  ]);
  return c.json({ id, number }, 201);
});

whsRoutes.patch('/c/:company/policies/:id', async (c) => {
  const a = await requireWhs(c, 'manage');
  const db = c.env.DB;
  const p = await db.prepare('SELECT * FROM whs_policies WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!p) throw notFound('Policy');
  const input = await body(c, zPolicy.partial().extend({ retire: z.boolean().optional() }));
  const next = { title: input.title ?? p.title, pack_id: input.packId === undefined ? p.pack_id : input.packId, summary: input.summary ?? p.summary, source_url: input.sourceUrl ?? p.source_url, effective_from: input.effectiveFrom === undefined ? p.effective_from : input.effectiveFrom, review_date: input.reviewDate === undefined ? p.review_date : input.reviewDate, status: input.retire === undefined ? p.status : input.retire ? 'retired' : 'active' };
  const t = now();
  await db.batch([
    db.prepare('UPDATE whs_policies SET title = ?, pack_id = ?, summary = ?, source_url = ?, effective_from = ?, review_date = ?, status = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.title, next.pack_id, next.summary, next.source_url, next.effective_from, next.review_date, next.status, t, a.companyId, p.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'policy.changed', entityType: 'policy', entityId: p.id, summary: `${p.number} ${next.status === 'retired' && p.status !== 'retired' ? 'retired' : 'changed'}`, before: { title: p.title, status: p.status, review_date: p.review_date }, after: next, at: t }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ files

type FileKind = 'hazard' | 'incident' | 'risk_assessment' | 'investigation' | 'action' | 'notice' | 'health';
const FILE_KINDS: readonly FileKind[] = ['hazard', 'incident', 'risk_assessment', 'investigation', 'action', 'notice', 'health'];

/**
 * Whether the person may see (and, with `write`, add to) the record a file belongs to. Every check is the record's own
 * visibility rule: a confidential report's files only for confidential readers, health files only for health officers.
 */
async function fileAccess(db: D1Database, a: WhsAccess, kind: FileKind, id: string, write: boolean): Promise<{ label: string; entity: string; locked: boolean }> {
  if (kind === 'hazard') {
    const s = hazardScope(a, 'h');
    const h = await db.prepare(`SELECT h.number, h.status, h.reported_by, h.responsible_id FROM whs_hazards h WHERE h.company_id = ? AND h.id = ? AND ${s.sql}`).bind(a.companyId, id, ...s.args).first<any>();
    if (!h) throw notFound('Hazard');
    if (write && !a.can.assess && h.reported_by !== a.userId && h.responsible_id !== a.userId) throw new HttpError(403, 'Only the reporter, the responsible person and WHS staff can add files to this hazard');
    return { label: `hazard ${h.number}`, entity: 'hazard', locked: h.status === 'closed' || h.status === 'cancelled' };
  }
  if (kind === 'incident' || kind === 'health') {
    const s = incidentScope(a, 'i');
    const i = await db.prepare(`SELECT i.number, i.status, i.reported_by FROM whs_incidents i WHERE i.company_id = ? AND i.id = ? AND ${s.sql}`).bind(a.companyId, id, ...s.args).first<any>();
    if (!i) throw notFound('Incident');
    if (kind === 'health') {
      assertWhs(a, 'health');
      return { label: `the confidential health record of ${i.number}`, entity: 'health', locked: false };
    }
    if (write && !a.can.assess && i.reported_by !== a.userId) throw new HttpError(403, 'Only the reporter and WHS staff can add files to this incident');
    return { label: `incident ${i.number}`, entity: 'incident', locked: i.status === 'closed' };
  }
  if (kind === 'risk_assessment') {
    const s = raScope(a, 'r');
    const r = await db.prepare(`SELECT r.number, r.revision, r.status FROM whs_risk_assessments r WHERE r.company_id = ? AND r.id = ? AND ${s.sql}`).bind(a.companyId, id, ...s.args).first<any>();
    if (!r) throw notFound('Risk assessment');
    if (write) assertWhs(a, 'assess');
    return { label: `risk assessment ${r.number} revision ${r.revision}`, entity: 'risk_assessment', locked: r.status === 'superseded' || r.status === 'cancelled' };
  }
  if (kind === 'investigation') {
    const v = await db.prepare('SELECT v.number, v.status, v.incident_id, v.lead_id, (SELECT 1 FROM whs_inv_team t WHERE t.company_id = v.company_id AND t.investigation_id = v.id AND t.user_id = ?) AS on_team FROM whs_investigations v WHERE v.company_id = ? AND v.id = ?').bind(a.userId, a.companyId, id).first<any>();
    if (!v) throw notFound('Investigation');
    const s = incidentScope(a, 'i');
    if (!(await db.prepare(`SELECT 1 FROM whs_incidents i WHERE i.company_id = ? AND i.id = ? AND ${s.sql}`).bind(a.companyId, v.incident_id, ...s.args).first())) throw notFound('Investigation');
    if (write && !a.can.investigate && v.lead_id !== a.userId && !v.on_team) throw new HttpError(403, 'Only the investigation team and investigators can add evidence');
    return { label: `investigation ${v.number}`, entity: 'investigation', locked: v.status === 'approved' };
  }
  if (kind === 'action') {
    const s = actionScope(a, 'x');
    const x = await db.prepare(`SELECT x.number, x.status, x.responsible_id FROM whs_actions x WHERE x.company_id = ? AND x.id = ? AND ${s.sql}`).bind(a.companyId, id, ...s.args).first<any>();
    if (!x) throw notFound('Action');
    if (write && !a.can.assess && x.responsible_id !== a.userId) throw new HttpError(403, 'Only the responsible person and WHS staff can add evidence');
    return { label: `action ${x.number}`, entity: 'action', locked: x.status === 'closed' || x.status === 'cancelled' };
  }
  const n = await db.prepare('SELECT n.status, n.responsible_id, n.incident_id, i.number FROM whs_reg_notices n JOIN whs_incidents i ON i.company_id = n.company_id AND i.id = n.incident_id WHERE n.company_id = ? AND n.id = ?').bind(a.companyId, id).first<any>();
  if (!n) throw notFound('Notification record');
  const s = incidentScope(a, 'i');
  if (!(await db.prepare(`SELECT 1 FROM whs_incidents i WHERE i.company_id = ? AND i.id = ? AND ${s.sql}`).bind(a.companyId, n.incident_id, ...s.args).first())) throw notFound('Notification record');
  if (!a.can.notify && n.responsible_id !== a.userId && !a.can.view) throw notFound('Notification record');
  if (write && !a.can.notify && n.responsible_id !== a.userId) throw new HttpError(403, 'Only a WHS manager or the person responsible can attach the confirmation');
  return { label: `the notification of ${n.number}`, entity: 'incident', locked: false };
}

whsRoutes.post('/c/:company/files', async (c) => {
  const a = await requireWhs(c);
  await rateLimit(c.env.DB, `whs-upload:${a.userId}`, 60, 60_000);
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_FILE_BYTES + 64 * 1024) throw new HttpError(413, 'File is too large');
  const form = await c.req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
  const kind = String(form!.get('kind') ?? '') as FileKind;
  if (!FILE_KINDS.includes(kind)) throw new HttpError(400, 'Say what the file belongs to');
  const entityId = String(form!.get('id') ?? '').slice(0, 64);
  const db = c.env.DB;
  const target = await fileAccess(db, a, kind, entityId, true);
  if (target.locked) badState(`${target.label[0].toUpperCase()}${target.label.slice(1)} is closed: no more files can be added`);
  const { name, type, bytes } = await validateUpload(file);
  const id = newId();
  const key = `whs/${a.companyId}/${kind}/${entityId}/${id}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type }, customMetadata: { uploader: a.userId } });
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO whs_files (id, company_id, entity_type, entity_id, name, mime, size, r2_key, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, kind, entityId, name, type, bytes.byteLength, key, a.userId, t),
    // the history never names a health file
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'file.added', entityType: target.entity as any, entityId: kind === 'notice' ? (await db.prepare('SELECT incident_id FROM whs_reg_notices WHERE company_id = ? AND id = ?').bind(a.companyId, entityId).first<{ incident_id: string }>())!.incident_id : entityId, summary: kind === 'health' ? 'A confidential health document was added' : `File added to ${target.label}: ${name}`, after: kind === 'health' ? undefined : { file: id, name, size: bytes.byteLength }, at: t }),
  ]);
  return c.json(fileDTO({ id, company_id: a.companyId, name, mime: type, size: bytes.byteLength, uploaded_by: a.userId, uploader: a.userName, created_at: t }), 201);
});

async function loadFile(c: any) {
  const a = await requireWhs(c);
  const f = await c.env.DB.prepare('SELECT * FROM whs_files WHERE company_id = ? AND id = ? AND deleted_at IS NULL').bind(a.companyId, String(c.req.param('id')).slice(0, 64)).first();
  if (!f || !FILE_KINDS.includes(f.entity_type)) throw notFound('File');
  const target = await fileAccess(c.env.DB, a, f.entity_type, f.entity_id, false).catch((e) => {
    // a file of a record the person may not see answers as not found
    if (e instanceof HttpError && e.status === 403 && f.entity_type !== 'health') throw notFound('File');
    throw e;
  });
  return { a, f, target };
}

whsRoutes.get('/c/:company/files/:id', async (c) => {
  const { f } = await loadFile(c);
  const obj = await c.env.FILES.get(f.r2_key);
  if (!obj) throw notFound('File');
  const inline = c.req.query('download') !== '1' && (String(f.mime).startsWith('image/') || f.mime === 'application/pdf');
  return new Response(obj.body, {
    headers: {
      'Content-Type': f.mime,
      'Content-Length': String(f.size),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(f.name)}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
    },
  });
});

whsRoutes.delete('/c/:company/files/:id', async (c) => {
  const { a, f, target } = await loadFile(c);
  if (target.locked) badState('The record is closed: its files are kept');
  if (f.entity_type === 'notice') {
    const n = await c.env.DB.prepare('SELECT status FROM whs_reg_notices WHERE company_id = ? AND id = ?').bind(a.companyId, f.entity_id).first<{ status: string }>();
    if (n?.status === 'submitted') badState('The submission is recorded: its confirmation is kept');
  }
  if (f.entity_type === 'action') {
    const x = await c.env.DB.prepare('SELECT status FROM whs_actions WHERE company_id = ? AND id = ?').bind(a.companyId, f.entity_id).first<{ status: string }>();
    if (x && !['open', 'in_progress'].includes(x.status)) badState('The action is completed: its evidence is kept');
  }
  if (f.uploaded_by !== a.userId && !a.can.approve) throw new HttpError(403, 'Only the person who added it or a WHS manager can remove it');
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE whs_files SET deleted_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, f.id),
    eventStmt(c.env.DB, { companyId: a.companyId, actorId: a.userId, action: 'file.removed', entityType: target.entity as any, entityId: f.entity_type === 'notice' ? null : f.entity_id, summary: f.entity_type === 'health' ? 'A confidential health document was removed' : `File removed from ${target.label}: ${f.name}`, at: t }),
  ]);
  c.executionCtx.waitUntil(c.env.FILES.delete(f.r2_key));
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ notes and consultation

whsRoutes.post('/c/:company/comments', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const input = await body(c, z.object({ entityType: z.enum(['hazard', 'incident', 'risk_assessment', 'action']), entityId: z.string().max(64), kind: z.enum(['note', 'consultation']).default('note'), body: zLong(5000).min(1) }));
  if (input.kind === 'consultation') assertWhs(a, 'consult');
  const kind: FileKind = input.entityType;
  await fileAccess(db, a, kind, input.entityId, false);
  if (input.kind === 'note' && !a.can.view && input.entityType !== 'action') throw new HttpError(403, 'Only WHS staff can add notes here');
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO whs_comments (id, company_id, entity_type, entity_id, kind, author_id, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, input.entityType, input.entityId, input.kind, a.userId, input.body, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `comment.${input.kind}`, entityType: input.entityType, entityId: input.entityId, summary: input.kind === 'consultation' ? 'Consultation comment added' : 'Note added', at: t }),
  ]);
  return c.json({ ok: true }, 201);
});

whsRoutes.route('/', hazardRoutes);
whsRoutes.route('/', riskRoutes);
whsRoutes.route('/', incidentRoutes);
whsRoutes.route('/', actionRoutes);

export { loadWhsAccess };
