// BIZOMAT WHS, Release 1: incidents, investigations and regulatory notification (brief sections 7 and 8).
//
// Incidents: every person in the company may report one (a short form first, made for a phone, with photos) and
// follows their own report. The workflow: Reported, Immediate response, Classified (kind, severity, outcome, body part,
// nature of injury, whether to investigate), Under investigation, Corrective action, Verification, Closed. A serious
// incident (serious or critical, a hospital admission or a death, or a dangerous occurrence) is escalated at once to the
// WHS managers in the app and by email where email is set up (never for the example company). After classification
// every change is tracked by the database itself (whs_incident_revisions) as well as in the history, and an incident is
// never deleted (a trigger refuses it). Medical treatment details are confidential, in whs_health, read only by health
// officers (access.ts); the reporter may give them when reporting and does not read them back.
//
// Investigations (INV-00001), one per incident: the lead and team, a timeline, witness statements, evidence (files),
// five whys and fishbone as structured data, contributing factors, failed controls, findings; submitted, then approved
// by a WHS manager who did not lead or submit it (the recorded exception when alone in the company).
//
// Regulatory notification: the incident is evaluated against the rules of its site's jurisdictions (legal.ts). Only a
// verified rule in effect on the incident's date flags it as potentially notifiable and gives a due time. A WHS
// manager records the decision with reasons (the system never decides), the person responsible, the checklist, and
// the submission as it was made: method, date and time, who submitted it, the regulator's reference and a confirmation
// file. An incident is never shown as notified without that record; BIZOMAT does not submit to regulators.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { assertPerson, assertWhs, incidentScope, peopleWith, requireWhs, segregation, type WhsAccess } from './access';
import { actionsOf } from './actions';
import { checkDTO, evaluateIncident, latestChecks, VERIFY_NOTICE } from './legal';
import {
  FISHBONE,
  HIERARCHY,
  INCIDENT_KINDS,
  INCIDENT_STATUS,
  INV_METHODS,
  INV_STATUS,
  NOTICE_STATUS,
  NOTIFICATION_STATUS,
  OUTCOMES,
  REF_COLUMNS,
  REF_JOINS,
  SEVERITIES,
  SUBMISSION_METHODS,
  WHS_KIND_LABEL,
  alert,
  assetName,
  badState,
  changed,
  commentsOf,
  departmentName,
  eventStmt,
  filesOf,
  historyOf,
  likeOf,
  linksOf,
  nextNumber,
  searchText,
  siteName,
  todayFrom,
  validDate,
  zDate,
  zKind,
  zList,
  zLong,
  zText,
} from './util';

export const incidentRoutes = new Hono<AppEnv>();

const OPEN = ['reported', 'immediate_response', 'classified', 'investigation', 'corrective_action', 'verification'];
export const SERIOUS_OUTCOMES: readonly string[] = ['hospital_inpatient', 'fatality'];
/** Kinds a report may be marked confidential in (psychosocial incidents: bullying, harassment, violence). */
const CONFIDENTIAL_KINDS: readonly string[] = ['psychosocial'];

export const isSerious = (i: { kind: string; severity: string; outcome: string }) => i.severity === 'serious' || i.severity === 'critical' || SERIOUS_OUTCOMES.includes(i.outcome) || i.kind === 'dangerous_occurrence';

const INCIDENT_SELECT = `SELECT i.*, ${REF_COLUMNS}, rb.name AS reported_by_name, cb.name AS classified_by_name, xb.name AS closed_by_name, vb.name AS verified_by_name, sb.name AS responded_by_name
  FROM whs_incidents i ${REF_JOINS('i')}
  LEFT JOIN users rb ON rb.id = i.reported_by LEFT JOIN users cb ON cb.id = i.classified_by LEFT JOIN users xb ON xb.id = i.closed_by LEFT JOIN users vb ON vb.id = i.verified_by LEFT JOIN users sb ON sb.id = i.responded_by`;

/** `full`: WHS readers and the people assigned to it. Otherwise the reporter's own view: what they reported and where it stands. */
export function incidentDTO(i: any, full: boolean) {
  const base = {
    id: i.id,
    number: i.number,
    kind: i.kind,
    kindLabel: WHS_KIND_LABEL(INCIDENT_KINDS, i.kind),
    title: i.title,
    description: i.description,
    occurredDate: i.occurred_date,
    occurredTime: i.occurred_time,
    occurredAt: i.occurred_at,
    siteId: i.site_id,
    siteName: i.site_name ?? null,
    location: i.location,
    status: i.status,
    statusLabel: WHS_KIND_LABEL(INCIDENT_STATUS, i.status),
    confidential: !!i.confidential,
    reportedById: i.reported_by,
    reportedByName: i.reported_by_name ?? null,
    reportedAt: i.created_at,
    serious: !!i.serious,
    full,
  };
  if (!full) return base;
  return {
    ...base,
    awareAt: i.aware_at,
    departmentId: i.department_id,
    departmentName: i.department_name ?? null,
    activity: i.activity,
    peopleInvolved: i.people_involved,
    witnesses: i.witnesses,
    assetId: i.asset_id,
    assetLabel: i.asset_number ? `${i.asset_number} ${i.asset_name}` : null,
    assetsText: i.assets_text,
    immediateResponse: i.immediate_response,
    firstAid: !!i.first_aid,
    initialNotification: i.initial_notification,
    outcome: i.outcome,
    outcomeLabel: WHS_KIND_LABEL(OUTCOMES, i.outcome),
    bodyPart: i.body_part,
    injuryNature: i.injury_nature,
    severity: i.severity,
    severityLabel: WHS_KIND_LABEL(SEVERITIES, i.severity),
    investigationRequired: !!i.investigation_required,
    potentiallyNotifiable: !!i.potentially_notifiable,
    notificationStatus: i.notification_status,
    notificationLabel: WHS_KIND_LABEL(NOTIFICATION_STATUS, i.notification_status),
    respondedAt: i.responded_at,
    respondedByName: i.responded_by_name ?? null,
    classifiedAt: i.classified_at,
    classifiedByName: i.classified_by_name ?? null,
    verifiedAt: i.verified_at,
    verifiedByName: i.verified_by_name ?? null,
    verificationNote: i.verification_note,
    closedAt: i.closed_at,
    closedByName: i.closed_by_name ?? null,
    closureNote: i.closure_note,
  };
}

async function loadIncident(db: D1Database, a: WhsAccess, id: string) {
  const scope = incidentScope(a, 'i');
  const i = await db.prepare(`${INCIDENT_SELECT} WHERE i.company_id = ? AND i.id = ? AND ${scope.sql}`).bind(a.companyId, id, ...scope.args).first<any>();
  if (!i) throw notFound('Incident');
  return i;
}

/** Whether the person sees the whole incident (a WHS reader, or on its investigation, or responsible for a notification). */
async function seesAll(db: D1Database, a: WhsAccess, i: any): Promise<boolean> {
  if (a.can.view) return true;
  const r = await db
    .prepare(
      `SELECT 1 FROM whs_investigations v LEFT JOIN whs_inv_team t ON t.company_id = v.company_id AND t.investigation_id = v.id AND t.user_id = ?1
        WHERE v.company_id = ?2 AND v.incident_id = ?3 AND (v.lead_id = ?1 OR t.user_id IS NOT NULL)
       UNION SELECT 1 FROM whs_reg_notices n WHERE n.company_id = ?2 AND n.incident_id = ?3 AND n.responsible_id = ?1`,
    )
    .bind(a.userId, a.companyId, i.id)
    .first();
  return !!r;
}

// ------------------------------------------------------------------ escalation

/** Who is told about an incident: the WHS managers (for a confidential one, whoever reads confidential reports). */
async function escalationList(db: D1Database, a: WhsAccess, confidential: boolean): Promise<string[]> {
  return confidential ? peopleWith(db, a, ['whs_manager', 'health_officer']) : peopleWith(db, a, ['whs_manager']);
}

async function escalateSerious(c: any, a: WhsAccess, i: any) {
  const to = (await escalationList(c.env.DB, a, !!i.confidential)).filter((u) => u !== a.userId);
  const site = i.site_name ? ` at ${i.site_name}` : '';
  await alert(
    c.env,
    {
      companyId: a.companyId,
      companyName: a.companyName,
      demo: a.kind === 'demo',
      userIds: to,
      kind: 'serious_incident',
      title: i.confidential ? `Serious confidential incident reported: ${i.number}` : `Serious incident reported: ${i.number}, ${i.title}`,
      body: `${WHS_KIND_LABEL(INCIDENT_KINDS, i.kind)}${site}, ${i.occurred_date}. Open it in BIZOMAT WHS to respond and decide whether it is notifiable.`,
      link: `/c/${a.companyId}/whs/incidents/${i.id}`,
      entityType: 'incident',
      entityId: i.id,
      dedupe: `serious:${i.id}`,
      email: true,
    },
    (p) => c.executionCtx.waitUntil(p),
  );
}

async function alertNotifiable(c: any, a: WhsAccess, i: any, checks: { verified: boolean; matches: boolean | null; dueAt: number | null; ruleId: string }[]) {
  const hit = checks.filter((x) => x.verified && x.matches);
  if (!hit.length) return;
  const due = hit.map((x) => x.dueAt).filter((x): x is number => !!x).sort((p, q) => p - q)[0];
  await alert(
    c.env,
    {
      companyId: a.companyId,
      companyName: a.companyName,
      demo: a.kind === 'demo',
      userIds: (await escalationList(c.env.DB, a, !!i.confidential)).filter((u) => u !== a.userId),
      kind: 'potentially_notifiable',
      title: `${i.number} may be notifiable: a WHS manager must decide`,
      body: `A verified rule of the site's jurisdiction covers this incident.${due ? ` Its deadline: ${new Date(due).toISOString().replace('T', ' ').slice(0, 16)} UTC.` : ''} BIZOMAT does not decide or submit: record the decision and the submission in the incident.`,
      link: `/c/${a.companyId}/whs/incidents/${i.id}/notification`,
      entityType: 'incident',
      entityId: i.id,
      dedupe: `notifiable:${i.id}:${hit.map((x) => x.ruleId).join(',')}`,
      email: true,
    },
    (p) => c.executionCtx.waitUntil(p),
  );
}

// ------------------------------------------------------------------ list and report

const zHealth = z.object({
  personName: zText(200).optional(),
  personUserId: z.string().max(64).nullable().optional(),
  treatment: zLong(5000).optional(),
  provider: zText(300).optional(),
  restrictions: zLong(2000).optional(),
  daysLost: z.number().int().min(0).max(3650).nullable().optional(),
  notes: zLong(5000).optional(),
});

const zIncident = z.object({
  kind: zKind(INCIDENT_KINDS, 'kind of incident'),
  title: zText(200).min(1, 'Say in a few words what happened'),
  description: zLong(10000).optional(),
  occurredDate: z.string().refine(validDate, 'Use a date like 2026-11-14'),
  occurredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a time like 14:30').or(z.literal('')).optional(),
  occurredAt: z.number().int().positive().optional(),
  awareAt: z.number().int().positive().optional(),
  siteId: z.string().max(64).nullable().optional(),
  location: zText(300).optional(),
  departmentId: z.string().max(64).nullable().optional(),
  activity: zText(500).optional(),
  peopleInvolved: zLong(2000).optional(),
  witnesses: zLong(2000).optional(),
  assetId: z.string().max(64).nullable().optional(),
  assetsText: zText(500).optional(),
  immediateResponse: zLong(3000).optional(),
  firstAid: z.boolean().optional(),
  initialNotification: zText(500).optional(),
  outcome: zKind(OUTCOMES, 'outcome').optional(),
  bodyPart: zText(200).optional(),
  injuryNature: zText(200).optional(),
  severity: zKind(SEVERITIES, 'severity').optional(),
  confidential: z.boolean().optional(),
});

incidentRoutes.get('/c/:company/incidents', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const scope = incidentScope(a, 'i');
  const where = ['i.company_id = ?', scope.sql];
  const args: unknown[] = [a.companyId, ...scope.args];
  const add = (sql: string, ...xs: unknown[]) => {
    where.push(sql);
    args.push(...xs);
  };
  const status = c.req.query('status');
  if (status === 'open') add(`i.status IN (${OPEN.map(() => '?').join(',')})`, ...OPEN);
  else if (status && Object.hasOwn(INCIDENT_STATUS, status)) add('i.status = ?', status);
  const kind = c.req.query('kind');
  if (kind && Object.hasOwn(INCIDENT_KINDS, kind)) add('i.kind = ?', kind);
  if (c.req.query('site')) add('i.site_id = ?', c.req.query('site'));
  if (c.req.query('department')) add('i.department_id = ?', c.req.query('department'));
  const from = c.req.query('from');
  if (from && validDate(from)) add('i.occurred_date >= ?', from);
  const to = c.req.query('to');
  if (to && validDate(to)) add('i.occurred_date <= ?', to);
  if (c.req.query('notifiable') === '1') add("(i.potentially_notifiable = 1 OR i.notification_status IN ('assessing', 'notifiable', 'submitted'))");
  if (c.req.query('investigate') === '1') add("i.investigation_required = 1 AND NOT EXISTS (SELECT 1 FROM whs_investigations v WHERE v.company_id = i.company_id AND v.incident_id = i.id AND v.status = 'approved')");
  if (c.req.query('mine') === '1') add('i.reported_by = ?', a.userId);
  const q = c.req.query('q');
  if (q?.trim()) add('i.search LIKE ?', likeOf(q));
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 100, 1), 500);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  const [rows, total] = await db.batch([
    db.prepare(`${INCIDENT_SELECT} WHERE ${where.join(' AND ')} ORDER BY i.occurred_date DESC, i.created_at DESC LIMIT ? OFFSET ?`).bind(...args, limit, offset),
    db.prepare(`SELECT COUNT(*) AS n FROM whs_incidents i WHERE ${where.join(' AND ')}`).bind(...args),
  ]);
  const list = (rows.results as any[]).map((i) => incidentDTO(i, a.can.view));
  if (c.req.query('format') === 'csv') {
    const { csvResponse } = await import('../erp/util');
    return csvResponse(`whs-incident-register-${todayFrom(c.req.query('today'))}`, [
      ['Number', 'Date', 'Time', 'Kind', 'Title', 'Site', 'Location', 'Severity', 'Outcome', 'Status', 'Notification', 'Reported by', 'Confidential'],
      ...list.map((i: any) => [i.number, i.occurredDate, i.occurredTime, i.kindLabel, i.confidential && !a.can.confidential ? '(confidential)' : i.title, i.siteName ?? '', i.location, i.severityLabel ?? '', i.outcomeLabel ?? '', i.statusLabel, i.notificationLabel ?? '', i.reportedByName ?? '', i.confidential ? 'yes' : 'no']),
    ]);
  }
  return c.json({ incidents: list, total: Number((total.results[0] as any)?.n ?? 0), limit, offset });
});

/** Report an incident: every person in the company. Medical details, when given, go to the confidential health record. */
incidentRoutes.post('/c/:company/incidents', async (c) => {
  const a = await requireWhs(c, 'report');
  const db = c.env.DB;
  const input = await body(c, zIncident.extend({ health: zHealth.optional() }));
  if (input.confidential && !CONFIDENTIAL_KINDS.includes(input.kind)) throw new HttpError(400, 'Only psychosocial incidents (such as bullying, harassment or violence) can be marked confidential');
  const t = now();
  if (input.occurredDate > new Date(t + 86_400_000).toISOString().slice(0, 10)) throw new HttpError(400, 'The incident cannot be in the future');
  await siteName(db, a.companyId, input.siteId);
  await departmentName(db, a.companyId, input.departmentId);
  await assetName(db, a.companyId, input.assetId);
  await assertPerson(db, a, input.health?.personUserId, 'The injured person');
  const occurredAt = input.occurredAt ?? Date.parse(`${input.occurredDate}T${input.occurredTime || '00:00'}:00Z`);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'incident');
  const kind = input.kind;
  const severity = input.severity ?? 'minor';
  const outcome = input.outcome ?? 'none';
  const serious = isSerious({ kind, severity, outcome });
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO whs_incidents (id, company_id, number, kind, title, description, occurred_date, occurred_time, occurred_at, aware_at, site_id, location, department_id, activity, people_involved, witnesses, asset_id, assets_text,
           immediate_response, first_aid, initial_notification, outcome, body_part, injury_nature, severity, serious, confidential, status, reported_by, search, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'reported', ?, ?, ?, ?)`,
      )
      .bind(id, a.companyId, number, kind, input.title, input.description ?? '', input.occurredDate, input.occurredTime ?? '', occurredAt, input.awareAt ?? t, input.siteId ?? null, input.location ?? '', input.departmentId ?? null, input.activity ?? '', input.peopleInvolved ?? '', input.witnesses ?? '', input.assetId ?? null, input.assetsText ?? '', input.immediateResponse ?? '', input.firstAid ? 1 : 0, input.initialNotification ?? '', outcome, input.bodyPart ?? '', input.injuryNature ?? '', severity, serious ? 1 : 0, input.confidential ? 1 : 0, a.userId, searchText(number, input.title, input.description, input.location), t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'incident.reported', entityType: 'incident', entityId: id, summary: `${number} reported${input.confidential ? ' (confidential)' : `: ${input.title}`}${serious ? '. Serious: the WHS managers were alerted' : ''}`, at: t }),
  ];
  const h = input.health;
  if (h && Object.values(h).some((v) => v !== undefined && v !== null && v !== '')) {
    stmts.push(
      db
        .prepare('INSERT INTO whs_health (id, company_id, incident_id, person_name, person_user_id, treatment, provider, restrictions, days_lost, notes, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, id, h.personName ?? '', h.personUserId ?? null, h.treatment ?? '', h.provider ?? '', h.restrictions ?? '', h.daysLost ?? null, h.notes ?? '', a.userId, a.userId, t, t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'health.recorded', entityType: 'health', entityId: id, summary: `${number}: confidential health details recorded with the report (seen only by health officers)`, after: { fields: Object.keys(h).filter((k) => (h as any)[k] !== undefined && (h as any)[k] !== '') }, at: t }),
    );
  }
  await db.batch(stmts);
  const i = await db.prepare(`${INCIDENT_SELECT} WHERE i.company_id = ? AND i.id = ?`).bind(a.companyId, id).first<any>();
  if (serious) await escalateSerious(c, a, i);
  // the rules of the site's jurisdictions, as a prompt for the WHS managers (never a decision)
  const ev = await evaluateIncident(db, a.companyId, i, a.userId);
  if (ev.flagged) await alertNotifiable(c, a, i, ev.checks);
  const fresh = await loadIncident(db, a, id);
  return c.json(incidentDTO(fresh, await seesAll(db, a, fresh)), 201);
});

// ------------------------------------------------------------------ detail and changes

async function detail(db: D1Database, a: WhsAccess, id: string, today: string) {
  const i = await loadIncident(db, a, id);
  const full = await seesAll(db, a, i);
  const inv = full ? await db.prepare('SELECT v.*, u.name AS lead_name FROM whs_investigations v LEFT JOIN users u ON u.id = v.lead_id WHERE v.company_id = ? AND v.incident_id = ?').bind(a.companyId, i.id).first<any>() : null;
  const health = await db.prepare('SELECT 1 FROM whs_health WHERE company_id = ? AND incident_id = ?').bind(a.companyId, i.id).first();
  const revisions = full ? await db.prepare('SELECT * FROM whs_incident_revisions WHERE company_id = ? AND incident_id = ? ORDER BY changed_at DESC, rowid DESC LIMIT 100').bind(a.companyId, i.id).all<any>() : null;
  const onTeam = !!inv && (inv.lead_id === a.userId || !!(await db.prepare('SELECT 1 FROM whs_inv_team WHERE company_id = ? AND investigation_id = ? AND user_id = ?').bind(a.companyId, inv.id, a.userId).first()));
  return {
    incident: incidentDTO(i, full),
    investigation: inv ? await investigationDTO(db, a, inv, onTeam) : null,
    actions: full ? [...(await actionsOf(db, a, 'incident', i.id, today)), ...(inv ? await actionsOf(db, a, 'investigation', inv.id, today) : [])] : [],
    links: full ? await linksOf(db, a, 'incident', i.id) : [],
    files: await filesOf(db, a.companyId, 'incident', i.id),
    comments: full ? await commentsOf(db, a.companyId, 'incident', i.id) : [],
    history: full ? await historyOf(db, a.companyId, 'incident', i.id) : [],
    // what the database itself recorded after classification: only the fields that changed
    revisions: (revisions?.results ?? []).map((r) => {
      const b = parseJson<Record<string, unknown>>(r.before_json, {});
      const n = parseJson<Record<string, unknown>>(r.after_json, {});
      const keys = Object.keys(n).filter((k) => JSON.stringify(b[k]) !== JSON.stringify(n[k]));
      return { id: r.id, at: r.changed_at, changes: keys.map((k) => ({ field: k, before: b[k] ?? null, after: n[k] ?? null })) };
    }).filter((r) => r.changes.length),
    // the existence of a health record is shown; its content only to health officers (GET /health)
    healthRecorded: !!health,
    can: {
      edit: (a.can.assess && i.status !== 'closed') || (i.reported_by === a.userId && i.status === 'reported'),
      respond: a.can.assess && i.status === 'reported',
      classify: a.can.assess && ['reported', 'immediate_response', 'classified'].includes(i.status),
      investigate: a.can.investigate && !inv && ['classified', 'corrective_action'].includes(i.status),
      toCorrective: a.can.assess && i.status === 'classified',
      toVerification: a.can.assess && i.status === 'corrective_action',
      close: a.can.approve && i.status === 'verification',
      reopen: a.can.approve && i.status === 'closed',
      health: a.can.health,
      notify: a.can.notify,
      actions: a.can.assess && i.status !== 'closed',
      comment: full,
      consult: a.can.consult,
      addFiles: i.status !== 'closed',
    },
    statuses: INCIDENT_STATUS,
  };
}

incidentRoutes.get('/c/:company/incidents/:id', async (c) => {
  const a = await requireWhs(c);
  return c.json(await detail(c.env.DB, a, c.req.param('id'), todayFrom(c.req.query('today'))));
});

const CLASSIFICATION = ['kind', 'severity', 'outcome', 'occurred_date', 'site_id'];

incidentRoutes.patch('/c/:company/incidents/:id', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  if (!a.can.assess && !(i.reported_by === a.userId && i.status === 'reported')) throw new HttpError(403, 'Only a WHS officer or manager can change this incident now');
  if (i.status === 'closed') badState(`${i.number} is closed: a WHS manager reopens it before it is changed`);
  const input = await body(c, zIncident.partial().extend({ investigationRequired: z.boolean().optional() }));
  if (input.investigationRequired !== undefined) assertWhs(a, 'assess');
  if (input.siteId !== undefined) await siteName(db, a.companyId, input.siteId);
  if (input.departmentId !== undefined) await departmentName(db, a.companyId, input.departmentId);
  if (input.assetId !== undefined) await assetName(db, a.companyId, input.assetId);
  const kind = input.kind ?? i.kind;
  const confidential = input.confidential === undefined ? !!i.confidential : input.confidential;
  if (confidential && !CONFIDENTIAL_KINDS.includes(kind)) throw new HttpError(400, 'Only psychosocial incidents can be marked confidential');
  const next: Record<string, unknown> = {
    kind,
    title: input.title ?? i.title,
    description: input.description ?? i.description,
    occurred_date: input.occurredDate ?? i.occurred_date,
    occurred_time: input.occurredTime ?? i.occurred_time,
    occurred_at: input.occurredAt ?? (input.occurredDate || input.occurredTime ? Date.parse(`${input.occurredDate ?? i.occurred_date}T${(input.occurredTime ?? i.occurred_time) || '00:00'}:00Z`) : i.occurred_at),
    site_id: input.siteId === undefined ? i.site_id : input.siteId,
    location: input.location ?? i.location,
    department_id: input.departmentId === undefined ? i.department_id : input.departmentId,
    activity: input.activity ?? i.activity,
    people_involved: input.peopleInvolved ?? i.people_involved,
    witnesses: input.witnesses ?? i.witnesses,
    asset_id: input.assetId === undefined ? i.asset_id : input.assetId,
    assets_text: input.assetsText ?? i.assets_text,
    immediate_response: input.immediateResponse ?? i.immediate_response,
    first_aid: input.firstAid === undefined ? i.first_aid : input.firstAid ? 1 : 0,
    initial_notification: input.initialNotification ?? i.initial_notification,
    outcome: input.outcome ?? i.outcome,
    body_part: input.bodyPart ?? i.body_part,
    injury_nature: input.injuryNature ?? i.injury_nature,
    severity: input.severity ?? i.severity,
    investigation_required: input.investigationRequired === undefined ? i.investigation_required : input.investigationRequired ? 1 : 0,
    confidential: confidential ? 1 : 0,
  };
  const serious = isSerious({ kind: next.kind as string, severity: next.severity as string, outcome: next.outcome as string });
  const diff = changed(i, next);
  if (!diff.any) return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
  const t = now();
  await db.batch([
    db
      .prepare(
        `UPDATE whs_incidents SET kind = ?, title = ?, description = ?, occurred_date = ?, occurred_time = ?, occurred_at = ?, site_id = ?, location = ?, department_id = ?, activity = ?, people_involved = ?, witnesses = ?, asset_id = ?, assets_text = ?,
           immediate_response = ?, first_aid = ?, initial_notification = ?, outcome = ?, body_part = ?, injury_nature = ?, severity = ?, investigation_required = ?, confidential = ?, serious = ?, search = ?, updated_at = ? WHERE company_id = ? AND id = ?`,
      )
      .bind(next.kind, next.title, next.description, next.occurred_date, next.occurred_time, next.occurred_at, next.site_id, next.location, next.department_id, next.activity, next.people_involved, next.witnesses, next.asset_id, next.assets_text, next.immediate_response, next.first_aid, next.initial_notification, next.outcome, next.body_part, next.injury_nature, next.severity, next.investigation_required, next.confidential, serious ? 1 : 0, searchText(i.number, next.title as string, next.description as string, next.location as string), t, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'incident.changed', entityType: 'incident', entityId: i.id, summary: `${i.number} changed${i.classified_at ? ' after classification (tracked)' : ''}`, before: diff.before, after: diff.after, at: t }),
  ]);
  const fresh = await db.prepare(`${INCIDENT_SELECT} WHERE i.company_id = ? AND i.id = ?`).bind(a.companyId, i.id).first<any>();
  if (serious && !i.serious) await escalateSerious(c, a, fresh);
  if (CLASSIFICATION.some((k) => k in diff.after)) {
    const ev = await evaluateIncident(db, a.companyId, fresh, a.userId);
    if (ev.flagged) await alertNotifiable(c, a, fresh, ev.checks);
  }
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

async function setStatus(c: any, a: WhsAccess, i: any, from: string[], to: string, set: { sql: string; args: unknown[] }, summary: string, extra: D1PreparedStatement[] = []) {
  const db = c.env.DB as D1Database;
  if (!from.includes(i.status)) badState(`${i.number} is ${WHS_KIND_LABEL(INCIDENT_STATUS, i.status).toLowerCase()}`);
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE whs_incidents SET status = ?, ${set.sql}updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`).bind(to, ...set.args, t, a.companyId, i.id, i.status),
    ...extra,
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `incident.${to}`, entityType: 'incident', entityId: i.id, summary, before: { status: i.status }, after: { status: to }, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This incident changed at the same moment: refresh and try again');
}

incidentRoutes.post('/c/:company/incidents/:id/respond', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const input = await body(c, z.object({ immediateResponse: zLong(3000).min(1, 'Say what was done straight away'), firstAid: z.boolean().optional(), initialNotification: zText(500).optional() }));
  await setStatus(c, a, i, ['reported'], 'immediate_response', { sql: 'immediate_response = ?, first_aid = ?, initial_notification = COALESCE(?, initial_notification), responded_by = ?, responded_at = ?, ', args: [input.immediateResponse, input.firstAid ? 1 : i.first_aid, input.initialNotification ?? null, a.userId, now()] }, `${i.number}: immediate response recorded`);
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

/** Classify: kind, severity, outcome and injury classification, whether to investigate. Then the rules are checked. */
incidentRoutes.post('/c/:company/incidents/:id/classify', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const input = await body(c, z.object({ kind: zKind(INCIDENT_KINDS, 'kind of incident'), severity: zKind(SEVERITIES, 'severity'), outcome: zKind(OUTCOMES, 'outcome'), bodyPart: zText(200).optional(), injuryNature: zText(200).optional(), investigationRequired: z.boolean(), note: zLong(2000).optional() }));
  if (i.confidential && !CONFIDENTIAL_KINDS.includes(input.kind)) throw new HttpError(400, 'A confidential report stays a psychosocial incident');
  const serious = isSerious(input);
  const reclassify = i.status === 'classified';
  await setStatus(
    c,
    a,
    i,
    ['reported', 'immediate_response', 'classified'],
    'classified',
    { sql: 'kind = ?, severity = ?, outcome = ?, body_part = COALESCE(?, body_part), injury_nature = COALESCE(?, injury_nature), investigation_required = ?, serious = ?, classified_by = ?, classified_at = COALESCE(classified_at, ?), ', args: [input.kind, input.severity, input.outcome, input.bodyPart ?? null, input.injuryNature ?? null, input.investigationRequired ? 1 : 0, serious ? 1 : 0, a.userId, now()] },
    `${i.number} ${reclassify ? 're' : ''}classified: ${WHS_KIND_LABEL(INCIDENT_KINDS, input.kind)}, ${WHS_KIND_LABEL(SEVERITIES, input.severity).toLowerCase()}, ${WHS_KIND_LABEL(OUTCOMES, input.outcome).toLowerCase()}${input.investigationRequired ? '; to be investigated' : ''}${input.note ? ` (${input.note})` : ''}`,
  );
  const fresh = await db.prepare(`${INCIDENT_SELECT} WHERE i.company_id = ? AND i.id = ?`).bind(a.companyId, i.id).first<any>();
  if (serious && !i.serious) await escalateSerious(c, a, fresh);
  const ev = await evaluateIncident(db, a.companyId, fresh, a.userId);
  if (ev.flagged) await alertNotifiable(c, a, fresh, ev.checks);
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

incidentRoutes.post('/c/:company/incidents/:id/advance', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const input = await body(c, z.object({ to: z.enum(['corrective_action', 'verification', 'closed', 'reopen']), note: zLong(2000).optional() }));
  const t = now();
  if (input.to === 'corrective_action') {
    assertWhs(a, 'assess');
    if (i.investigation_required && !(await db.prepare("SELECT 1 FROM whs_investigations WHERE company_id = ? AND incident_id = ? AND status = 'approved'").bind(a.companyId, i.id).first())) badState(`${i.number} is to be investigated: approve its investigation first`);
    await setStatus(c, a, i, ['classified'], 'corrective_action', { sql: '', args: [] }, `${i.number}: corrective action`);
  } else if (input.to === 'verification') {
    assertWhs(a, 'assess');
    const inv = await db.prepare('SELECT id FROM whs_investigations WHERE company_id = ? AND incident_id = ?').bind(a.companyId, i.id).first<{ id: string }>();
    const open = await db
      .prepare("SELECT number FROM whs_actions WHERE company_id = ? AND ((source_type = 'incident' AND source_id = ?) OR (source_type = 'investigation' AND source_id = ?)) AND status IN ('open', 'in_progress')")
      .bind(a.companyId, i.id, inv?.id ?? '')
      .all<{ number: string }>();
    if (open.results.length) badState(`Finish the corrective actions first: ${open.results.map((x) => x.number).join(', ')}`);
    await setStatus(c, a, i, ['corrective_action'], 'verification', { sql: '', args: [] }, `${i.number}: verification`);
  } else if (input.to === 'closed') {
    assertWhs(a, 'approve');
    if (!input.note?.trim()) throw new HttpError(400, 'Say how the corrective actions were verified');
    const pending = await db.prepare("SELECT status FROM whs_reg_notices WHERE company_id = ? AND incident_id = ? AND status IN ('assessing', 'to_submit')").bind(a.companyId, i.id).first();
    if (pending || (i.potentially_notifiable && i.notification_status === 'not_assessed')) badState(`Record the notification decision${pending ? ' and the submission' : ''} of ${i.number} before closing it`);
    const inv = await db.prepare('SELECT id FROM whs_investigations WHERE company_id = ? AND incident_id = ?').bind(a.companyId, i.id).first<{ id: string }>();
    const waiting = await db
      .prepare("SELECT number FROM whs_actions WHERE company_id = ? AND ((source_type = 'incident' AND source_id = ?) OR (source_type = 'investigation' AND source_id = ?)) AND status IN ('open', 'in_progress', 'completed')")
      .bind(a.companyId, i.id, inv?.id ?? '')
      .all<{ number: string }>();
    if (waiting.results.length) badState(`Verify the corrective actions first: ${waiting.results.map((x) => x.number).join(', ')}`);
    await setStatus(c, a, i, ['verification'], 'closed', { sql: 'verified_by = ?, verified_at = ?, verification_note = ?, closed_by = ?, closed_at = ?, closure_note = ?, ', args: [a.userId, t, input.note, a.userId, t, input.note] }, `${i.number} closed: ${input.note}`);
  } else {
    assertWhs(a, 'approve');
    if (!input.note?.trim()) throw new HttpError(400, 'Say why it is reopened');
    await setStatus(c, a, i, ['closed'], 'verification', { sql: 'closed_at = NULL, closed_by = NULL, ', args: [] }, `${i.number} reopened: ${input.note}`);
  }
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

// ------------------------------------------------------------------ confidential health information

incidentRoutes.get('/c/:company/incidents/:id/health', async (c) => {
  const a = await requireWhs(c, 'health');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const h = await db.prepare('SELECT h.*, u.name AS updated_by_name, p.name AS person_user_name FROM whs_health h LEFT JOIN users u ON u.id = h.updated_by LEFT JOIN users p ON p.id = h.person_user_id WHERE h.company_id = ? AND h.incident_id = ?').bind(a.companyId, i.id).first<any>();
  return c.json({
    health: h
      ? { personName: h.person_name, personUserId: h.person_user_id, personUserName: h.person_user_name ?? null, treatment: h.treatment, provider: h.provider, restrictions: h.restrictions, daysLost: h.days_lost, notes: h.notes, updatedAt: h.updated_at, updatedByName: h.updated_by_name ?? null }
      : null,
    files: await filesOf(db, a.companyId, 'health', i.id),
    history: await historyOf(db, a.companyId, 'health', i.id),
  });
});

incidentRoutes.put('/c/:company/incidents/:id/health', async (c) => {
  const a = await requireWhs(c, 'health');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const input = await body(c, zHealth);
  await assertPerson(db, a, input.personUserId, 'The injured person');
  const old = await db.prepare('SELECT * FROM whs_health WHERE company_id = ? AND incident_id = ?').bind(a.companyId, i.id).first<any>();
  const next = {
    person_name: input.personName ?? old?.person_name ?? '',
    person_user_id: input.personUserId === undefined ? (old?.person_user_id ?? null) : input.personUserId,
    treatment: input.treatment ?? old?.treatment ?? '',
    provider: input.provider ?? old?.provider ?? '',
    restrictions: input.restrictions ?? old?.restrictions ?? '',
    days_lost: input.daysLost === undefined ? (old?.days_lost ?? null) : input.daysLost,
    notes: input.notes ?? old?.notes ?? '',
  };
  const fields = old ? Object.keys(changed(old, next).after) : Object.keys(next).filter((k) => (next as any)[k] !== '' && (next as any)[k] !== null);
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO whs_health (id, company_id, incident_id, person_name, person_user_id, treatment, provider, restrictions, days_lost, notes, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(company_id, incident_id) DO UPDATE SET person_name = excluded.person_name, person_user_id = excluded.person_user_id, treatment = excluded.treatment, provider = excluded.provider, restrictions = excluded.restrictions, days_lost = excluded.days_lost, notes = excluded.notes, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      )
      .bind(newId(), a.companyId, i.id, next.person_name, next.person_user_id, next.treatment, next.provider, next.restrictions, next.days_lost, next.notes, a.userId, a.userId, t, t),
    // the history names the fields that changed, never their values
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: old ? 'health.changed' : 'health.recorded', entityType: 'health', entityId: i.id, summary: `${i.number}: confidential health details ${old ? 'changed' : 'recorded'}`, after: { fields }, at: t }),
  ]);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ investigations

async function investigationDTO(db: D1Database, a: WhsAccess, v: any, onTeam: boolean) {
  const [team, timeline, statements] = await db.batch([
    db.prepare('SELECT t.user_id, u.name FROM whs_inv_team t JOIN users u ON u.id = t.user_id WHERE t.company_id = ? AND t.investigation_id = ? ORDER BY u.name').bind(a.companyId, v.id),
    db.prepare('SELECT t.*, u.name AS by_name FROM whs_inv_timeline t LEFT JOIN users u ON u.id = t.created_by WHERE t.company_id = ? AND t.investigation_id = ? ORDER BY t.at_text, t.created_at').bind(a.companyId, v.id),
    db.prepare('SELECT s.*, u.name AS taken_by_name FROM whs_inv_statements s LEFT JOIN users u ON u.id = s.taken_by WHERE s.company_id = ? AND s.investigation_id = ? ORDER BY s.created_at').bind(a.companyId, v.id),
  ]);
  // witness statements: the investigators, the approvers and the team only
  const statementsVisible = a.can.investigate || a.can.approve || onTeam;
  const approver = v.approved_by ? await db.prepare('SELECT name FROM users WHERE id = ?').bind(v.approved_by).first<{ name: string }>() : null;
  return {
    id: v.id,
    number: v.number,
    incidentId: v.incident_id,
    leadId: v.lead_id,
    leadName: v.lead_name ?? null,
    status: v.status,
    statusLabel: WHS_KIND_LABEL(INV_STATUS, v.status),
    method: v.method,
    methodLabel: WHS_KIND_LABEL(INV_METHODS, v.method),
    scope: v.scope,
    whys: parseJson<string[]>(v.whys_json, []),
    fishbone: parseJson<Record<string, string[]>>(v.fishbone_json, {}),
    rootCause: v.root_cause,
    factors: parseJson<string[]>(v.factors_json, []),
    failedControls: parseJson<{ control: string; hierarchy?: string | null; why: string }[]>(v.failed_controls_json, []),
    findings: v.findings,
    team: (team.results as any[]).map((t) => ({ id: t.user_id, name: t.name })),
    timeline: (timeline.results as any[]).map((t) => ({ id: t.id, at: t.at_text, description: t.description, byName: t.by_name ?? null })),
    statements: statementsVisible ? (statements.results as any[]).map((s) => ({ id: s.id, witness: s.witness, takenOn: s.taken_on, statement: s.statement, takenByName: s.taken_by_name ?? null, createdAt: s.created_at })) : null,
    statementCount: statements.results.length,
    files: await filesOf(db, a.companyId, 'investigation', v.id),
    submittedAt: v.submitted_at,
    approvedAt: v.approved_at,
    approvedByName: approver?.name ?? null,
    approvalNote: v.approval_note,
    approvalSod: !!v.approval_sod,
    can: {
      edit: (a.can.investigate || onTeam) && v.status === 'open',
      submit: (a.can.investigate || onTeam) && v.status === 'open',
      approve: a.can.approve && v.status === 'submitted',
    },
  };
}

async function loadInvestigation(db: D1Database, a: WhsAccess, id: string) {
  const v = await db.prepare('SELECT v.*, u.name AS lead_name FROM whs_investigations v LEFT JOIN users u ON u.id = v.lead_id WHERE v.company_id = ? AND v.id = ?').bind(a.companyId, id).first<any>();
  if (!v) throw notFound('Investigation');
  const i = await loadIncident(db, a, v.incident_id); // the incident's own visibility rules
  const onTeam = v.lead_id === a.userId || !!(await db.prepare('SELECT 1 FROM whs_inv_team WHERE company_id = ? AND investigation_id = ? AND user_id = ?').bind(a.companyId, v.id, a.userId).first());
  return { v, i, onTeam };
}

const zTeam = z.array(z.string().max(64)).max(20);

incidentRoutes.post('/c/:company/incidents/:id/investigation', async (c) => {
  const a = await requireWhs(c, 'investigate');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  if (!['classified', 'corrective_action'].includes(i.status)) badState(i.status === 'reported' || i.status === 'immediate_response' ? `Classify ${i.number} first` : `${i.number} is ${i.status}`);
  const input = await body(c, z.object({ leadId: z.string().max(64).nullable().optional(), team: zTeam.optional(), method: zKind(INV_METHODS, 'method').optional(), scope: zLong(3000).optional() }));
  const lead = input.leadId ?? a.userId;
  await assertPerson(db, a, lead, 'The lead investigator');
  for (const u of input.team ?? []) await assertPerson(db, a, u, 'A team member');
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'investigation');
  const t = now();
  const team = [...new Set([lead, ...(input.team ?? [])])];
  try {
    await db.batch([
      db.prepare("INSERT INTO whs_investigations (id, company_id, number, incident_id, lead_id, status, method, scope, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?)").bind(id, a.companyId, number, i.id, lead, input.method ?? 'five_whys', input.scope ?? '', a.userId, t, t),
      ...team.map((u) => db.prepare('INSERT INTO whs_inv_team (company_id, investigation_id, user_id, added_by, added_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, id, u, a.userId, t)),
      db.prepare("UPDATE whs_incidents SET status = CASE WHEN status = 'classified' THEN 'investigation' ELSE status END, investigation_required = 1, updated_at = ? WHERE company_id = ? AND id = ?").bind(t, a.companyId, i.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.started', entityType: 'incident', entityId: i.id, summary: `${number} started for ${i.number}`, after: { lead, team }, at: t }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.started', entityType: 'investigation', entityId: id, summary: `${number} started`, after: { lead, team }, at: t }),
    ]);
  } catch (e) {
    if (String((e as Error)?.message ?? e).includes('UNIQUE')) badState(`${i.number} already has an investigation`);
    throw e;
  }
  for (const u of team) if (u !== a.userId) await alert(c.env, { companyId: a.companyId, companyName: a.companyName, demo: a.kind === 'demo', userIds: [u], kind: 'assigned', title: `You are on the investigation ${number} of ${i.number}`, link: `/c/${a.companyId}/whs/incidents/${i.id}/investigation`, entityType: 'investigation', entityId: id, dedupe: `team:${id}:${u}` });
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))), 201);
});

const zFishbone = z.object(Object.fromEntries(Object.keys(FISHBONE).map((k) => [k, zList(10, 300).optional()])) as Record<keyof typeof FISHBONE, z.ZodOptional<ReturnType<typeof zList>>>);

incidentRoutes.patch('/c/:company/investigations/:id', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const { v, i, onTeam } = await loadInvestigation(db, a, c.req.param('id'));
  if (!a.can.investigate && !onTeam) throw new HttpError(403, 'Only the investigation team, investigators and WHS staff can change it');
  if (v.status !== 'open') badState(`${v.number} is ${v.status}: it is not changed any more`);
  const input = await body(
    c,
    z.object({
      method: zKind(INV_METHODS, 'method').optional(),
      scope: zLong(3000).optional(),
      whys: zList(5, 500).optional(),
      fishbone: zFishbone.optional(),
      rootCause: zLong(3000).optional(),
      factors: zList(30, 500).optional(),
      failedControls: z.array(z.object({ control: zText(300).min(1), hierarchy: zKind(HIERARCHY, 'place in the hierarchy of controls').nullable().optional(), why: zText(500).optional() })).max(30).optional(),
      findings: zLong(10000).optional(),
      leadId: z.string().max(64).optional(),
      team: zTeam.optional(),
    }),
  );
  if (input.leadId !== undefined || input.team !== undefined) assertWhs(a, 'investigate');
  if (input.leadId) await assertPerson(db, a, input.leadId, 'The lead investigator');
  for (const u of input.team ?? []) await assertPerson(db, a, u, 'A team member');
  const next = {
    method: input.method ?? v.method,
    scope: input.scope ?? v.scope,
    whys_json: input.whys ? JSON.stringify(input.whys) : v.whys_json,
    fishbone_json: input.fishbone ? JSON.stringify(Object.fromEntries(Object.entries(input.fishbone).filter(([, x]) => x?.length))) : v.fishbone_json,
    root_cause: input.rootCause ?? v.root_cause,
    factors_json: input.factors ? JSON.stringify(input.factors) : v.factors_json,
    failed_controls_json: input.failedControls ? JSON.stringify(input.failedControls) : v.failed_controls_json,
    findings: input.findings ?? v.findings,
    lead_id: input.leadId ?? v.lead_id,
  };
  const diff = changed(v, next);
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db.prepare('UPDATE whs_investigations SET method = ?, scope = ?, whys_json = ?, fishbone_json = ?, root_cause = ?, factors_json = ?, failed_controls_json = ?, findings = ?, lead_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?').bind(next.method, next.scope, next.whys_json, next.fishbone_json, next.root_cause, next.factors_json, next.failed_controls_json, next.findings, next.lead_id, t, a.companyId, v.id, 'open'),
  ];
  if (input.team) {
    const team = [...new Set([next.lead_id, ...input.team].filter(Boolean))] as string[];
    stmts.push(db.prepare('DELETE FROM whs_inv_team WHERE company_id = ? AND investigation_id = ?').bind(a.companyId, v.id), ...team.map((u) => db.prepare('INSERT INTO whs_inv_team (company_id, investigation_id, user_id, added_by, added_at) VALUES (?, ?, ?, ?, ?)').bind(a.companyId, v.id, u, a.userId, t)));
    diff.after.team = team;
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.changed', entityType: 'investigation', entityId: v.id, summary: `${v.number} updated`, before: diff.before, after: diff.after, at: t }));
  await db.batch(stmts);
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

incidentRoutes.post('/c/:company/investigations/:id/timeline', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const { v, i, onTeam } = await loadInvestigation(db, a, c.req.param('id'));
  if (!a.can.investigate && !onTeam) throw new HttpError(403, 'Only the investigation team, investigators and WHS staff can add to the timeline');
  if (v.status !== 'open') badState(`${v.number} is ${v.status}`);
  const input = await body(c, z.object({ at: zText(40).min(1, 'Say when'), description: zText(1000).min(1) }));
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO whs_inv_timeline (id, company_id, investigation_id, at_text, description, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, v.id, input.at, input.description, a.userId, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.timeline', entityType: 'investigation', entityId: v.id, summary: `${v.number}: timeline entry at ${input.at}`, at: t }),
  ]);
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))), 201);
});

incidentRoutes.post('/c/:company/investigations/:id/statements', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const { v, i, onTeam } = await loadInvestigation(db, a, c.req.param('id'));
  if (!a.can.investigate && !onTeam) throw new HttpError(403, 'Only the investigation team, investigators and WHS staff can record statements');
  if (v.status !== 'open') badState(`${v.number} is ${v.status}`);
  const input = await body(c, z.object({ witness: zText(200).min(1), takenOn: zDate.optional(), statement: zLong(10000).min(1) }));
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO whs_inv_statements (id, company_id, investigation_id, witness, taken_on, statement, taken_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(newId(), a.companyId, v.id, input.witness, input.takenOn ?? null, input.statement, a.userId, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.statement', entityType: 'investigation', entityId: v.id, summary: `${v.number}: a witness statement recorded`, at: t }),
  ]);
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))), 201);
});

incidentRoutes.post('/c/:company/investigations/:id/submit', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const { v, i, onTeam } = await loadInvestigation(db, a, c.req.param('id'));
  if (!a.can.investigate && !onTeam) throw new HttpError(403, 'Only the investigation team, investigators and WHS staff can submit it');
  if (v.status !== 'open') badState(`${v.number} is ${v.status}`);
  if (!v.root_cause.trim()) badState('Record the root cause before submitting');
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE whs_investigations SET status = 'submitted', submitted_by = ?, submitted_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(a.userId, t, t, a.companyId, v.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.submitted', entityType: 'investigation', entityId: v.id, summary: `${v.number} submitted for approval`, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This investigation changed at the same moment: refresh and try again');
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

incidentRoutes.post('/c/:company/investigations/:id/approve', async (c) => {
  const a = await requireWhs(c, 'approve');
  const db = c.env.DB;
  const { v, i } = await loadInvestigation(db, a, c.req.param('id'));
  const input = await body(c, z.object({ decision: z.enum(['approve', 'return']), note: zLong(2000).optional() }));
  if (v.status !== 'submitted') badState(`${v.number} must be submitted first`);
  const t = now();
  if (input.decision === 'return') {
    if (!input.note?.trim()) throw new HttpError(400, 'Say what to change');
    await db.batch([
      db.prepare("UPDATE whs_investigations SET status = 'open', approval_note = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'submitted'").bind(input.note, t, a.companyId, v.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.returned', entityType: 'investigation', entityId: v.id, summary: `${v.number} returned: ${input.note}`, at: t }),
    ]);
    return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
  }
  const sod = segregation(a, [[v.lead_id, 'led this investigation'], [v.submitted_by, 'submitted this investigation']], 'approve it');
  const res = await db.batch([
    db.prepare("UPDATE whs_investigations SET status = 'approved', approved_by = ?, approved_at = ?, approval_note = ?, approval_sod = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'submitted'").bind(a.userId, t, input.note ?? '', sod ? 1 : 0, t, a.companyId, v.id),
    db.prepare("UPDATE whs_incidents SET status = 'corrective_action', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'investigation'").bind(t, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'investigation.approved', entityType: 'investigation', entityId: v.id, summary: `${v.number} approved${sod ? ' (recorded one-person exception)' : ''}`, after: { exception: sod }, at: t }),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'incident.corrective_action', entityType: 'incident', entityId: i.id, summary: `${i.number}: investigation ${v.number} approved, corrective action`, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This investigation changed at the same moment: refresh and try again');
  return c.json(await detail(db, a, i.id, todayFrom(c.req.query('today'))));
});

// ------------------------------------------------------------------ regulatory notification

function noticeDTO(n: any) {
  return {
    id: n.id,
    packId: n.pack_id,
    packName: n.pack_name ?? null,
    regulator: n.regulator,
    status: n.status,
    statusLabel: WHS_KIND_LABEL(NOTICE_STATUS, n.status),
    decision: n.decision,
    decisionReasons: n.decision_reasons,
    decidedAt: n.decided_at,
    decidedByName: n.decided_by_name ?? null,
    responsibleId: n.responsible_id,
    responsibleName: n.responsible_name ?? null,
    dueAt: n.due_at,
    dueNote: n.due_note,
    checklist: parseJson<{ text: string; done: boolean }[]>(n.checklist_json, []),
    method: n.method,
    methodLabel: WHS_KIND_LABEL(SUBMISSION_METHODS, n.method),
    submittedAt: n.submitted_at,
    submittedById: n.submitted_by,
    submittedByName: n.submitted_by_name ?? null,
    reference: n.reference,
    submissionNotes: n.submission_notes,
    recordedAt: n.recorded_at,
    recordedByName: n.recorded_by_name ?? null,
    example: !!n.example,
  };
}

const NOTICE_SELECT = `SELECT n.*, p.name AS pack_name, d.name AS decided_by_name, r.name AS responsible_name, s.name AS submitted_by_name, rc.name AS recorded_by_name
  FROM whs_reg_notices n LEFT JOIN whs_packs p ON p.id = n.pack_id LEFT JOIN users d ON d.id = n.decided_by LEFT JOIN users r ON r.id = n.responsible_id
  LEFT JOIN users s ON s.id = n.submitted_by LEFT JOIN users rc ON rc.id = n.recorded_by`;

/** The incident's notification status, worked out from its notice records (never set by hand). */
function notificationStatusStmt(db: D1Database, companyId: string, incidentId: string, t: number) {
  return db
    .prepare(
      `UPDATE whs_incidents SET notification_status = CASE
         WHEN NOT EXISTS (SELECT 1 FROM whs_reg_notices n WHERE n.company_id = ?1 AND n.incident_id = ?2) THEN 'not_assessed'
         WHEN EXISTS (SELECT 1 FROM whs_reg_notices n WHERE n.company_id = ?1 AND n.incident_id = ?2 AND n.status = 'assessing') THEN 'assessing'
         WHEN EXISTS (SELECT 1 FROM whs_reg_notices n WHERE n.company_id = ?1 AND n.incident_id = ?2 AND n.status = 'to_submit') THEN 'notifiable'
         WHEN EXISTS (SELECT 1 FROM whs_reg_notices n WHERE n.company_id = ?1 AND n.incident_id = ?2 AND n.status = 'submitted') THEN 'submitted'
         ELSE 'not_notifiable' END, updated_at = ?3
       WHERE company_id = ?1 AND id = ?2`,
    )
    .bind(companyId, incidentId, t);
}

async function notification(db: D1Database, a: WhsAccess, i: any) {
  const packs = i.site_id ? await db.prepare('SELECT p.id, p.code, p.name, p.regulator, p.regulator_url FROM whs_site_packs sp JOIN whs_packs p ON p.id = sp.pack_id WHERE sp.company_id = ? AND sp.site_id = ? ORDER BY p.sort').bind(a.companyId, i.site_id).all<any>() : null;
  const notices = await db.prepare(`${NOTICE_SELECT} WHERE n.company_id = ? AND n.incident_id = ? ORDER BY n.created_at`).bind(a.companyId, i.id).all<any>();
  const evaluations = await db.prepare('SELECT COUNT(DISTINCT evaluation_id) AS n FROM whs_rule_checks WHERE company_id = ? AND incident_id = ?').bind(a.companyId, i.id).first<{ n: number }>();
  const files: Record<string, unknown[]> = {};
  for (const n of notices.results) files[n.id] = await filesOf(db, a.companyId, 'notice', n.id);
  return {
    incident: { id: i.id, number: i.number, siteId: i.site_id, siteName: i.site_name ?? null, occurredDate: i.occurred_date, potentiallyNotifiable: !!i.potentially_notifiable, notificationStatus: i.notification_status, notificationLabel: WHS_KIND_LABEL(NOTIFICATION_STATUS, i.notification_status) },
    packs: (packs?.results ?? []).map((p) => ({ id: p.id, code: p.code, name: p.name, regulator: p.regulator, regulatorUrl: p.regulator_url })),
    checks: await latestChecks(db, a.companyId, i.id),
    evaluations: Number(evaluations?.n ?? 0),
    notices: notices.results.map((n) => ({ ...noticeDTO(n), files: files[n.id] })),
    notice: VERIFY_NOTICE,
    noSubmission: 'BIZOMAT does not submit notifications to regulators. Notify the regulator yourself, then record here how and when it was done and the regulator’s reference.',
    can: { decide: a.can.notify, evaluate: a.can.assess },
  };
}

incidentRoutes.get('/c/:company/incidents/:id/notification', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  if (!(await seesAll(db, a, i))) throw new HttpError(403, 'Only WHS staff and the person responsible for the notification can read it');
  return c.json(await notification(db, a, i));
});

/** Check the incident against the rules again (for example once a rule has been verified). Old checks are kept. */
incidentRoutes.post('/c/:company/incidents/:id/notification/evaluate', async (c) => {
  const a = await requireWhs(c, 'assess');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const ev = await evaluateIncident(db, a.companyId, i, a.userId);
  if (ev.flagged) await alertNotifiable(c, a, i, ev.checks);
  await db.batch([eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'incident.rules_checked', entityType: 'incident', entityId: i.id, summary: `${i.number}: checked against the rules of its site's jurisdictions${ev.noSite ? ' (no site chosen)' : ev.noPacks ? ' (the site has no jurisdiction)' : ev.flagged ? ': potentially notifiable' : ''}`, after: { checks: ev.checks.length, flagged: ev.flagged }, at: now() })]);
  return c.json(await notification(db, a, await loadIncident(db, a, i.id)));
});

const STANDARD_CHECKLIST = ['The regulator was told by the means the rule requires', 'The incident site was preserved as the rule requires', 'The required information was given', 'Written notice was sent if the regulator asked for it', 'A copy of what was sent, or the confirmation, is attached'];

/** The decision, by an authorised person, with reasons. The system never decides. */
incidentRoutes.post('/c/:company/incidents/:id/notification/decision', async (c) => {
  const a = await requireWhs(c, 'notify');
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const input = await body(c, z.object({ packId: z.string().max(40), decision: z.enum(['notifiable', 'not_notifiable', 'assessing']), reasons: zLong(3000).min(3, 'Give the reasons for the decision'), responsibleId: z.string().max(64).nullable().optional() }));
  // one jurisdiction's rules are never used for another: only the packs of the incident's own site
  const pack = i.site_id ? await db.prepare('SELECT p.* FROM whs_site_packs sp JOIN whs_packs p ON p.id = sp.pack_id WHERE sp.company_id = ? AND sp.site_id = ? AND sp.pack_id = ?').bind(a.companyId, i.site_id, input.packId).first<any>() : null;
  if (!pack) throw new HttpError(400, i.site_id ? 'Choose a jurisdiction of this incident’s site' : 'Choose the incident’s site, and its jurisdiction in WHS settings, first');
  await assertPerson(db, a, input.responsibleId, 'The person responsible for notifying');
  const old = await db.prepare('SELECT * FROM whs_reg_notices WHERE company_id = ? AND incident_id = ? AND pack_id = ?').bind(a.companyId, i.id, pack.id).first<any>();
  if (old?.status === 'submitted') badState('The submission is recorded: the decision is not changed any more');
  // the due time comes only from a verified rule of this pack that covers the incident, in its latest evaluation
  const checks = (await latestChecks(db, a.companyId, i.id)).filter((x) => x.packId === pack.id);
  const verified = checks.find((x) => x.verified && x.matches);
  const dueAt = input.decision === 'notifiable' ? (verified?.dueAt ?? null) : null;
  const dueNote = input.decision !== 'notifiable' ? '' : verified ? (verified.dueAt ? '' : 'The verified rule gives no deadline in hours: check its text.') : 'Deadline not verified: check with the regulator.';
  const ruleInfo: string[] = (verified ?? checks[0])?.rule?.requiredInfo ?? [];
  const checklist = old ? parseJson<{ text: string; done: boolean }[]>(old.checklist_json, []) : [...STANDARD_CHECKLIST, ...ruleInfo.filter((x) => !x.startsWith('Draft'))].map((text) => ({ text, done: false }));
  const status = input.decision === 'notifiable' ? 'to_submit' : input.decision === 'not_notifiable' ? 'not_notifiable' : 'assessing';
  const t = now();
  const id = old?.id ?? newId();
  await db.batch([
    old
      ? db.prepare('UPDATE whs_reg_notices SET status = ?, decision = ?, decision_reasons = ?, decided_by = ?, decided_at = ?, responsible_id = ?, due_at = ?, due_note = ?, rule_check_id = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(status, input.decision === 'assessing' ? null : input.decision, input.reasons, a.userId, t, input.responsibleId ?? old.responsible_id, dueAt, dueNote, verified?.id ?? checks[0]?.id ?? null, t, a.companyId, id)
      : db
          .prepare('INSERT INTO whs_reg_notices (id, company_id, incident_id, pack_id, rule_check_id, regulator, status, decision, decision_reasons, decided_by, decided_at, responsible_id, due_at, due_note, checklist_json, example, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, a.companyId, i.id, pack.id, verified?.id ?? checks[0]?.id ?? null, pack.regulator, status, input.decision === 'assessing' ? null : input.decision, input.reasons, a.userId, t, input.responsibleId ?? null, dueAt, dueNote, JSON.stringify(checklist), a.kind === 'demo' ? 1 : 0, a.userId, t, t),
    notificationStatusStmt(db, a.companyId, i.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'notification.decided', entityType: 'incident', entityId: i.id, summary: `${i.number}, ${pack.name}: ${input.decision === 'notifiable' ? 'decided notifiable' : input.decision === 'not_notifiable' ? 'decided not notifiable' : 'being assessed'} by an authorised person: ${input.reasons}`, before: old ? { status: old.status, decision: old.decision } : undefined, after: { status, decision: input.decision, dueAt, verifiedRule: verified ? verified.ruleId : null }, at: t }),
  ]);
  if (input.responsibleId && input.decision === 'notifiable') {
    await alert(c.env, { companyId: a.companyId, companyName: a.companyName, demo: a.kind === 'demo', userIds: [input.responsibleId].filter((u) => u !== a.userId), kind: 'notification_due', title: `Notify ${pack.regulator} about ${i.number}`, body: dueAt ? `Due by ${new Date(dueAt).toISOString().replace('T', ' ').slice(0, 16)} UTC, from a verified rule.` : 'Deadline not verified: check with the regulator.', link: `/c/${a.companyId}/whs/incidents/${i.id}/notification`, entityType: 'incident', entityId: i.id, dedupe: `notify:${id}:${input.responsibleId}`, email: true }, (p) => c.executionCtx.waitUntil(p));
  }
  return c.json(await notification(db, a, await loadIncident(db, a, i.id)));
});

async function loadNotice(db: D1Database, a: WhsAccess, incidentId: string, noticeId: string) {
  const n = await db.prepare(`${NOTICE_SELECT} WHERE n.company_id = ? AND n.incident_id = ? AND n.id = ?`).bind(a.companyId, incidentId, noticeId).first<any>();
  if (!n) throw notFound('Notification record');
  if (!a.can.notify && n.responsible_id !== a.userId) throw new HttpError(403, 'Only a WHS manager or the person responsible for this notification can do that');
  return n;
}

incidentRoutes.put('/c/:company/incidents/:id/notification/:notice/checklist', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const n = await loadNotice(db, a, i.id, c.req.param('notice'));
  if (n.status === 'submitted') badState('The submission is recorded: the checklist is kept as it was');
  const input = await body(c, z.object({ items: z.array(z.object({ text: zText(500).min(1), done: z.boolean() })).max(40) }));
  const t = now();
  await db.batch([
    db.prepare('UPDATE whs_reg_notices SET checklist_json = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(JSON.stringify(input.items), t, a.companyId, n.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'notification.checklist', entityType: 'incident', entityId: i.id, summary: `${i.number}: notification checklist, ${input.items.filter((x) => x.done).length} of ${input.items.length} done`, at: t }),
  ]);
  return c.json(await notification(db, a, i));
});

/**
 * The submission as a person made it: method, date and time, who submitted it, the regulator's reference. Only this
 * record marks an incident's notification as submitted (a CHECK and a trigger in the database guard it).
 */
incidentRoutes.post('/c/:company/incidents/:id/notification/:notice/submission', async (c) => {
  const a = await requireWhs(c);
  const db = c.env.DB;
  const i = await loadIncident(db, a, c.req.param('id'));
  const n = await loadNotice(db, a, i.id, c.req.param('notice'));
  if (n.status === 'submitted') badState('The submission is already recorded');
  if (n.decision !== 'notifiable') badState('Record the decision that it is notifiable first');
  const input = await body(c, z.object({ method: zKind(SUBMISSION_METHODS, 'method'), submittedAt: z.number().int().positive(), submittedById: z.string().max(64), reference: zText(200).min(1, 'Give the regulator’s reference'), notes: zLong(3000).optional() }));
  await assertPerson(db, a, input.submittedById, 'The person who submitted it');
  const t = now();
  if (input.submittedAt > t + 5 * 60_000) throw new HttpError(400, 'The submission cannot be in the future');
  const res = await db.batch([
    db
      .prepare("UPDATE whs_reg_notices SET status = 'submitted', method = ?, submitted_at = ?, submitted_by = ?, reference = ?, submission_notes = ?, recorded_by = ?, recorded_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'to_submit'")
      .bind(input.method, input.submittedAt, input.submittedById, input.reference, input.notes ?? '', a.userId, t, t, a.companyId, n.id),
    notificationStatusStmt(db, a.companyId, i.id, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'notification.submitted', entityType: 'incident', entityId: i.id, summary: `${i.number}: submission to ${n.regulator} recorded (${WHS_KIND_LABEL(SUBMISSION_METHODS, input.method).toLowerCase()}, reference ${input.reference})`, after: { method: input.method, submittedAt: input.submittedAt, reference: input.reference }, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This record changed at the same moment: refresh and try again');
  return c.json(await notification(db, a, await loadIncident(db, a, i.id)));
});

export { checkDTO };
