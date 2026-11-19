// BIZOMAT WHS, Release 1: the fixed lists with their plain-language labels, numbering, the WHS history (whs_events),
// the risk matrix, links, alerts and small helpers shared by the WHS routes (src/worker/whs). Kinds and categories are
// checked here, not in the database, so later releases can add to them (migrations/0026_whs_core.sql).

import { z } from 'zod';
import { HttpError, newId, now, parseJson } from '../lib/util';
import { appBase } from '../services/app-url';
import { enqueueEmail, processOutbox } from '../services/email/outbox';
import { emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';
import type { Env } from '../env';
import { hazardScope, incidentScope, raScope, type WhsAccess } from './access';

export { zDate, zText, zId, validDate, likeOf, searchText, todayFrom } from '../maintenance/util';

// ------------------------------------------------------------------ fixed lists

export const HAZARD_CATEGORIES = {
  machinery: 'Machinery',
  electrical: 'Electrical',
  mechanical: 'Mechanical',
  chemical: 'Chemical',
  biological: 'Biological',
  noise: 'Noise',
  vibration: 'Vibration',
  manual_handling: 'Manual handling',
  slips_trips: 'Slips and trips',
  heights: 'Working at heights',
  confined_spaces: 'Confined spaces',
  vehicles: 'Vehicle and mobile plant',
  fire: 'Fire',
  ergonomics: 'Ergonomics',
  psychosocial: 'Psychosocial hazards',
  fatigue: 'Fatigue',
  violence: 'Workplace violence',
  environment: 'Environmental conditions',
  contractor: 'Contractor activities',
  other: 'Other',
} as const;

export const HAZARD_STATUS = {
  reported: 'Reported',
  assessment: 'Assessment',
  controls_assigned: 'Controls assigned',
  implementation: 'Control implementation',
  verification: 'Verification',
  closed: 'Closed',
  cancelled: 'Cancelled',
} as const;

export const RA_KINDS = {
  jsa: 'Job safety analysis (JSA)',
  jha: 'Job hazard analysis (JHA)',
  swms: 'Safe work method statement (SWMS)',
  task: 'Task risk assessment',
  workplace: 'Workplace risk assessment',
  plant: 'Plant and machinery assessment',
  chemical: 'Chemical risk assessment',
  manual_handling: 'Manual handling assessment',
  construction: 'Construction risk assessment',
  environmental: 'Environmental conditions assessment',
  psychosocial: 'Psychosocial hazard assessment',
  contractor: 'Contractor risk assessment',
} as const;

export const RA_STATUS = { draft: 'Draft', submitted: 'Submitted for approval', approved: 'Approved', superseded: 'Superseded', cancelled: 'Cancelled' } as const;

/** Why a new revision of an assessment is made (brief section 6: a change in the work, equipment, controls or circumstances). */
export const REVIEW_TRIGGERS = {
  work: 'The work changed',
  equipment: 'The equipment changed',
  controls: 'The controls changed',
  circumstances: 'The circumstances changed',
  incident: 'After an incident',
  scheduled: 'Scheduled review',
  other: 'Other',
} as const;

/** The hierarchy of controls, most effective first. */
export const HIERARCHY = {
  elimination: 'Elimination',
  substitution: 'Substitution',
  isolation: 'Isolation',
  engineering: 'Engineering controls',
  administrative: 'Administrative controls',
  ppe: 'Personal protective equipment',
} as const;
export type Hierarchy = keyof typeof HIERARCHY;
export const LOWER_ORDER: readonly string[] = ['administrative', 'ppe'];

export const EFFECTIVENESS = { not_assessed: 'Not assessed', effective: 'Effective', partly: 'Partly effective', ineffective: 'Not effective' } as const;

export const INCIDENT_KINDS = {
  injury: 'Workplace injury',
  illness: 'Occupational illness',
  near_miss: 'Near miss',
  dangerous_occurrence: 'Dangerous occurrence',
  property_damage: 'Property damage',
  environmental: 'Environmental incident',
  vehicle: 'Vehicle incident',
  contractor: 'Contractor incident',
  visitor: 'Visitor incident',
  psychosocial: 'Psychosocial incident',
} as const;

/** What happened to the person, the classification only (medical details are confidential, in whs_health). */
export const OUTCOMES = {
  none: 'No injury or illness',
  first_aid: 'First aid only',
  medical_treatment: 'Medical treatment',
  restricted_duties: 'Restricted or alternative duties',
  lost_time: 'Lost time (unable to work a shift or more)',
  hospital_inpatient: 'Admitted to hospital as an in-patient',
  fatality: 'Death',
} as const;

export const SEVERITIES = { minor: 'Minor', moderate: 'Moderate', serious: 'Serious', critical: 'Critical' } as const;

export const INCIDENT_STATUS = {
  reported: 'Reported',
  immediate_response: 'Immediate response',
  classified: 'Classified',
  investigation: 'Under investigation',
  corrective_action: 'Corrective action',
  verification: 'Verification',
  closed: 'Closed',
} as const;
export const INCIDENT_FLOW = Object.keys(INCIDENT_STATUS) as (keyof typeof INCIDENT_STATUS)[];
export const HAZARD_FLOW = ['reported', 'assessment', 'controls_assigned', 'implementation', 'verification', 'closed'] as const;

export const NOTIFICATION_STATUS = {
  not_assessed: 'Not assessed',
  assessing: 'Being assessed',
  not_notifiable: 'Decided: not notifiable',
  notifiable: 'Decided: notifiable, not yet submitted',
  submitted: 'Submission recorded',
} as const;

export const NOTICE_STATUS = { assessing: 'Being assessed', not_notifiable: 'Not notifiable', to_submit: 'To submit', submitted: 'Submission recorded' } as const;
export const SUBMISSION_METHODS = { online: 'Online form', phone: 'Phone', email: 'Email', in_person: 'In person', other: 'Other' } as const;

export const INV_STATUS = { open: 'Open', submitted: 'Submitted for approval', approved: 'Approved' } as const;
export const INV_METHODS = { five_whys: 'Five whys', fishbone: 'Fishbone (cause and effect)', both: 'Five whys and fishbone', other: 'Other' } as const;
/** Fishbone categories (cause and effect), as structured data. */
export const FISHBONE = { people: 'People', methods: 'Methods and procedures', plant: 'Plant and equipment', materials: 'Materials', environment: 'Environment', management: 'Management and supervision' } as const;

export const ACTION_STATUS = { open: 'Open', in_progress: 'In progress', completed: 'Completed, to verify', verified: 'Verified', closed: 'Closed', cancelled: 'Cancelled' } as const;
export const ACTION_KINDS = { corrective: 'Corrective', preventive: 'Preventive', improvement: 'Improvement' } as const;
export const PRIORITIES = { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' } as const;
/**
 * Where an action comes from. Release 1 makes them from hazards, incidents, investigations and risk assessments (and by
 * hand); later releases add inspections, audits, meetings, contractors and regulatory findings without a migration.
 */
export const ACTION_SOURCES = {
  hazard: 'Hazard',
  incident: 'Incident',
  investigation: 'Investigation',
  risk_assessment: 'Risk assessment',
  inspection: 'Inspection',
  audit: 'Audit',
  meeting: 'Safety meeting',
  contractor: 'Contractor issue',
  regulatory: 'Regulatory finding',
  other: 'Other',
} as const;
export const LIVE_ACTION_SOURCES = ['hazard', 'incident', 'investigation', 'risk_assessment', 'other'] as const;
export const OPEN_ACTION = ['open', 'in_progress'] as const;

export const INSTRUMENT_KINDS = {
  legislation: 'Legislation',
  regulation: 'Regulation',
  code_of_practice: 'Approved code of practice',
  standard: 'Standard',
  guidance: 'Government guidance',
  model_law: 'Model law (in force only where a jurisdiction enacts or approves it)',
  company_policy: 'Internal company policy',
} as const;
/** What each kind is, said plainly next to it: a standard or guidance is not law unless a law makes it so. */
export const INSTRUMENT_NOTES: Record<string, string> = {
  legislation: 'An Act of parliament: law.',
  regulation: 'Made under an Act: law.',
  code_of_practice: 'Approved under the law. It shows how to meet a duty; check its legal status in this jurisdiction.',
  standard: 'Not a legal requirement unless a law or a code makes it one.',
  guidance: 'Explains the law. It is not law.',
  model_law: 'A model for jurisdictions to adopt. It is not in force until a jurisdiction enacts or approves it.',
  company_policy: 'The company’s own rule. It is not law.',
};

export const RULE_KINDS = {
  notification: 'Incident notification',
  site_preservation: 'Site preservation',
  retention: 'Record retention',
  exposure_limits: 'Exposure limits',
  other: 'Other obligation',
} as const;
export const RULE_STATUS = { draft: 'Draft', in_review: 'In review', reviewed: 'Reviewed, to activate', active: 'Active', withdrawn: 'Withdrawn' } as const;
export const VERIFICATION = { not_verified: 'Not verified', verified: 'Verified' } as const;

export const WHS_KIND_LABEL = (map: Record<string, string>, v: string | null | undefined) => (v ? (map[v] ?? v) : '');

/** One of `keys`, or 400 with a plain message. */
export function oneOf<T extends Record<string, string>>(map: T, v: unknown, what: string): keyof T & string {
  if (typeof v !== 'string' || !Object.hasOwn(map, v)) throw new HttpError(400, `Choose a valid ${what}`);
  return v as keyof T & string;
}
export const zKind = <T extends Record<string, string>>(map: T, what: string) => z.string().refine((v) => Object.hasOwn(map, v), `Choose a valid ${what}`);

export const zKey = z.string().trim().min(8).max(80);
export const zLong = (max = 5000) => z.string().trim().max(max);
export const zUrl = z.string().trim().max(500).refine((v) => /^https:\/\/[^\s/$.?#].[^\s]*$/i.test(v), 'Use a full https:// address');
export const zMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use a month like 2026-11');
export const zList = (max: number, each = 500) => z.array(z.string().trim().min(1).max(each)).max(max);

export function badState(msg: string): never {
  throw new HttpError(409, msg);
}

export const DAY = 86_400_000;

// ------------------------------------------------------------------ numbering

const NUMBERING = {
  hazard: { table: 'whs_hazards', prefix: 'HZ-', width: 5 },
  risk_assessment: { table: 'whs_risk_assessments', prefix: 'RA-', width: 5 },
  incident: { table: 'whs_incidents', prefix: 'INC-', width: 5 },
  investigation: { table: 'whs_investigations', prefix: 'INV-', width: 5 },
  action: { table: 'whs_actions', prefix: 'ACT-', width: 5 },
  policy: { table: 'whs_policies', prefix: 'POL-', width: 4 },
} as const;
export type WhsNumberKind = keyof typeof NUMBERING;

/** The next number of a kind in the company (HZ-00001...): one statement, so two people at once get different numbers. */
export async function nextNumber(db: D1Database, companyId: string, kind: WhsNumberKind): Promise<string> {
  const n = NUMBERING[kind];
  const start = n.prefix.length + 1;
  const max = await db
    .prepare(`SELECT MAX(CAST(substr(number, ${start}) AS INTEGER)) AS m FROM ${n.table} WHERE company_id = ? AND number LIKE '${n.prefix}%' AND length(number) > ${n.prefix.length} AND substr(number, ${start}) NOT GLOB '*[^0-9]*'`)
    .bind(companyId)
    .first<{ m: number | null }>();
  const highest = Math.max(0, Math.min(Number(max?.m ?? 0), 1e12));
  const row = await db
    .prepare('INSERT INTO whs_counters (company_id, kind, value) VALUES (?1, ?2, ?3 + 1) ON CONFLICT(company_id, kind) DO UPDATE SET value = MAX(whs_counters.value, ?3) + 1 RETURNING value')
    .bind(companyId, kind, highest)
    .first<{ value: number }>();
  return `${n.prefix}${String(Number(row!.value)).padStart(n.width, '0')}`;
}

// ------------------------------------------------------------------ history

export type WhsEntity = 'hazard' | 'risk_assessment' | 'incident' | 'health' | 'investigation' | 'notice' | 'action' | 'settings' | 'site' | 'policy' | 'file' | 'comment' | 'link';

export interface WhsEvent {
  companyId: string;
  actorId: string | null;
  action: string;
  entityType: WhsEntity;
  entityId?: string | null;
  summary: string;
  before?: unknown;
  after?: unknown;
  at?: number;
}

/** One line of history (append-only). Never file contents, and never health details: only which fields changed. */
export function eventStmt(db: D1Database, e: WhsEvent) {
  return db
    .prepare('INSERT INTO whs_events (id, company_id, actor_id, action, entity_type, entity_id, summary, before_json, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(
      newId(),
      e.companyId,
      e.actorId,
      e.action,
      e.entityType,
      e.entityId ?? null,
      e.summary.slice(0, 500),
      e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000),
      e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000),
      e.at ?? now(),
    );
}

export function eventDTO(e: any) {
  return {
    id: e.id,
    action: e.action,
    entityType: e.entity_type,
    entityId: e.entity_id,
    summary: e.summary,
    actorId: e.actor_id,
    actorName: e.actor_name ?? null,
    before: parseJson<Record<string, unknown> | null>(e.before_json, null),
    after: parseJson<Record<string, unknown> | null>(e.after_json, null),
    at: e.created_at,
  };
}

export async function historyOf(db: D1Database, companyId: string, entityType: WhsEntity, entityId: string, limit = 200) {
  const rows = await db
    .prepare('SELECT e.*, u.name AS actor_name FROM whs_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.company_id = ? AND e.entity_type = ? AND e.entity_id = ? ORDER BY e.created_at DESC, e.rowid DESC LIMIT ?')
    .bind(companyId, entityType, entityId, limit)
    .all<any>();
  return rows.results.map(eventDTO);
}

/** Only the fields that changed, for the history. */
export function changed(before: Record<string, unknown>, after: Record<string, unknown>) {
  const b: Record<string, unknown> = {};
  const a: Record<string, unknown> = {};
  for (const k of Object.keys(after)) {
    if (after[k] === undefined) continue;
    if (JSON.stringify(before[k] ?? null) !== JSON.stringify(after[k] ?? null)) {
      b[k] = before[k] ?? null;
      a[k] = after[k] ?? null;
    }
  }
  return { before: b, after: a, any: Object.keys(a).length > 0 };
}

// ------------------------------------------------------------------ risk matrix

export interface MatrixLevel {
  key: string;
  label: string;
  rank: number;
  action: string;
}
export interface Matrix {
  likelihood: { value: number; label: string }[];
  consequence: { value: number; label: string }[];
  levels: MatrixLevel[];
  /** grid[likelihood - 1][consequence - 1] = level key */
  grid: string[][];
  /** Levels of this rank or above are high risks (the hierarchy-of-controls warning). */
  highFrom: number;
}

/** The default 5 x 5 matrix (likelihood x consequence, levels by score). Every company can change it. */
export function defaultMatrix(): Matrix {
  const score = (l: number, c: number) => {
    const s = l * c;
    return s <= 3 ? 'low' : s <= 7 ? 'medium' : s <= 12 ? 'high' : 'critical';
  };
  return {
    likelihood: ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost certain'].map((label, i) => ({ value: i + 1, label })),
    consequence: ['Insignificant', 'Minor', 'Moderate', 'Major', 'Catastrophic'].map((label, i) => ({ value: i + 1, label })),
    levels: [
      { key: 'low', label: 'Low', rank: 1, action: 'Manage by routine procedures.' },
      { key: 'medium', label: 'Medium', rank: 2, action: 'Control and monitor; a supervisor is responsible.' },
      { key: 'high', label: 'High', rank: 3, action: 'Act soon: higher-order controls and a manager’s attention.' },
      { key: 'critical', label: 'Critical', rank: 4, action: 'Stop or do not start the work until the risk is reduced.' },
    ],
    grid: [1, 2, 3, 4, 5].map((l) => [1, 2, 3, 4, 5].map((c) => score(l, c))),
    highFrom: 3,
  };
}

const zMatrix = z.object({
  likelihood: z.array(z.object({ value: z.number().int().min(1).max(9), label: z.string().trim().min(1).max(60) })).min(2).max(7),
  consequence: z.array(z.object({ value: z.number().int().min(1).max(9), label: z.string().trim().min(1).max(60) })).min(2).max(7),
  levels: z.array(z.object({ key: z.string().trim().regex(/^[a-z][a-z0-9_]{0,29}$/), label: z.string().trim().min(1).max(40), rank: z.number().int().min(1).max(9), action: z.string().trim().max(300) })).min(2).max(6),
  grid: z.array(z.array(z.string())).min(2).max(7),
  highFrom: z.number().int().min(1).max(9),
});

/** Checks a matrix: values 1..n in order, a level for every cell, distinct keys and ranks. Returns it cleaned. */
export function validMatrix(input: unknown): Matrix {
  const r = zMatrix.safeParse(input);
  if (!r.success) throw new HttpError(400, 'The risk matrix is not complete: check its rows, columns and levels');
  const m = r.data;
  const seq = (xs: { value: number }[]) => xs.every((x, i) => x.value === i + 1);
  if (!seq(m.likelihood) || !seq(m.consequence)) throw new HttpError(400, 'Number likelihood and consequence from 1 upwards');
  if (new Set(m.levels.map((l) => l.key)).size !== m.levels.length || new Set(m.levels.map((l) => l.rank)).size !== m.levels.length) throw new HttpError(400, 'Each risk level needs its own name and rank');
  const keys = new Set(m.levels.map((l) => l.key));
  if (m.grid.length !== m.likelihood.length || m.grid.some((row) => row.length !== m.consequence.length || row.some((k) => !keys.has(k)))) throw new HttpError(400, 'Give every cell of the matrix a risk level');
  if (!m.levels.some((l) => l.rank >= m.highFrom)) throw new HttpError(400, 'At least one level must count as a high risk');
  return { ...m, levels: [...m.levels].sort((a, b) => a.rank - b.rank) };
}

/** The level of a likelihood and consequence on a matrix, or 400 when they are off it. */
export function rate(m: Matrix, likelihood: number, consequence: number): MatrixLevel {
  const key = m.grid[likelihood - 1]?.[consequence - 1];
  const level = key ? m.levels.find((l) => l.key === key) : undefined;
  if (!level) throw new HttpError(400, `Choose a likelihood from 1 to ${m.likelihood.length} and a consequence from 1 to ${m.consequence.length}`);
  return level;
}

export const levelLabel = (m: Matrix | null, key: string | null | undefined) => (key ? (m?.levels.find((l) => l.key === key)?.label ?? key) : '');

/** The company's current matrix (made from the default the first time it is needed). */
export async function currentMatrix(db: D1Database, companyId: string, actorId: string | null): Promise<{ id: string; version: number; matrix: Matrix }> {
  const row = await db
    .prepare('SELECT m.id, m.version, m.matrix_json FROM whs_settings s JOIN whs_matrices m ON m.company_id = s.company_id AND m.id = s.matrix_id WHERE s.company_id = ?')
    .bind(companyId)
    .first<{ id: string; version: number; matrix_json: string }>();
  if (row) return { id: row.id, version: row.version, matrix: JSON.parse(row.matrix_json) as Matrix };
  const id = newId();
  const t = now();
  // two first uses at once: the version is unique, so one matrix is made and both read it
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO whs_matrices (id, company_id, version, matrix_json, created_by, created_at) VALUES (?, ?, 1, ?, ?, ?)').bind(id, companyId, JSON.stringify(defaultMatrix()), actorId, t),
    db.prepare('INSERT OR IGNORE INTO whs_settings (company_id, matrix_id, updated_by, updated_at) SELECT ?1, id, ?2, ?3 FROM whs_matrices WHERE company_id = ?1 AND version = 1').bind(companyId, actorId, t),
  ]);
  return currentMatrix(db, companyId, actorId);
}

const matrixCache = new Map<string, Matrix>();
/** A matrix version by id (old assessments keep theirs). */
export async function matrixById(db: D1Database, companyId: string, id: string | null | undefined): Promise<Matrix | null> {
  if (!id) return null;
  const k = `${companyId}:${id}`;
  if (matrixCache.has(k)) return matrixCache.get(k)!;
  const row = await db.prepare('SELECT matrix_json FROM whs_matrices WHERE company_id = ? AND id = ?').bind(companyId, id).first<{ matrix_json: string }>();
  if (!row) return null;
  const m = JSON.parse(row.matrix_json) as Matrix;
  if (matrixCache.size > 500) matrixCache.clear();
  matrixCache.set(k, m);
  return m;
}

// ------------------------------------------------------------------ links

export const LINK_TYPES = { hazard: 'Hazard', incident: 'Incident', risk_assessment: 'Risk assessment', work_order: 'Maintenance work order', action: 'Action', investigation: 'Investigation' } as const;

export function linkStmt(db: D1Database, companyId: string, a: [string, string], b: [string, string], actorId: string | null, t = now()) {
  return db.prepare('INSERT OR IGNORE INTO whs_links (company_id, a_type, a_id, b_type, b_id, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(companyId, a[0], a[1], b[0], b[1], actorId, t);
}

/**
 * The records linked to one record, both ways, with their numbers and titles (only records of the same company). A
 * linked hazard, incident or risk assessment the person may not open (a confidential one, for someone who does not read
 * confidential records) is left out altogether: its number, title and status, and that it exists (audit L2).
 */
export async function linksOf(db: D1Database, a: WhsAccess, type: string, id: string) {
  const companyId = a.companyId;
  const rows = await db
    .prepare(
      `SELECT b_type AS type, b_id AS id FROM whs_links WHERE company_id = ?1 AND a_type = ?2 AND a_id = ?3
       UNION SELECT a_type, a_id FROM whs_links WHERE company_id = ?1 AND b_type = ?2 AND b_id = ?3`,
    )
    .bind(companyId, type, id)
    .all<{ type: string; id: string }>();
  const out: { type: string; typeLabel: string; id: string; number: string; title: string; status: string }[] = [];
  for (const r of rows.results) {
    const scoped = (sql: string, scope: { sql: string; args: unknown[] }) => ({ sql: `${sql} AND ${scope.sql}`, args: scope.args });
    const q =
      r.type === 'hazard'
        ? scoped('SELECT number, title, status FROM whs_hazards x WHERE x.company_id = ? AND x.id = ?', hazardScope(a, 'x'))
        : r.type === 'incident'
          ? scoped('SELECT number, title, status FROM whs_incidents x WHERE x.company_id = ? AND x.id = ?', incidentScope(a, 'x'))
          : r.type === 'risk_assessment'
            ? scoped("SELECT number || ' rev ' || revision AS number, title, status FROM whs_risk_assessments x WHERE x.company_id = ? AND x.id = ?", raScope(a, 'x'))
            : r.type === 'work_order'
              ? { sql: 'SELECT number, description AS title, status FROM mt_work_orders WHERE company_id = ? AND id = ?', args: [] as unknown[] }
              : null;
    if (!q) continue;
    const x = await db.prepare(q.sql).bind(companyId, r.id, ...q.args).first<{ number: string; title: string; status: string }>();
    if (x) out.push({ type: r.type, typeLabel: WHS_KIND_LABEL(LINK_TYPES, r.type), id: r.id, number: x.number, title: String(x.title).slice(0, 200), status: x.status });
  }
  return out;
}

// ------------------------------------------------------------------ alerts (in the app, and email where it is set up)

export interface AlertInput {
  companyId: string;
  companyName: string;
  demo: boolean;
  userIds: string[];
  kind: 'serious_incident' | 'potentially_notifiable' | 'overdue_action' | 'assigned' | 'notification_due';
  title: string;
  body?: string;
  /** An ERP page, such as /c/<company>/whs/incidents/<id>. */
  link: string;
  entityType: string;
  entityId: string;
  /** The same key never alerts the same person twice. */
  dedupe: string;
  email?: boolean;
}

/**
 * Alerts people in the app and, when `email` is set and email is set up on this service, by email through the outbox.
 * Never for the example company. Titles and bodies carry numbers and short titles, never health details.
 */
export async function alert(env: Env, n: AlertInput, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  const ids = [...new Set(n.userIds.filter(Boolean))];
  if (!ids.length) return 0;
  const db = env.DB;
  const t = now();
  const res = await db.batch(
    ids.map((uid) =>
      db
        .prepare('INSERT OR IGNORE INTO whs_alerts (id, company_id, user_id, kind, title, body, link, entity_type, entity_id, dedupe_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), n.companyId, uid, n.kind, n.title.slice(0, 300), (n.body ?? '').slice(0, 1000), n.link, n.entityType, n.entityId, `${n.dedupe}:${uid}`.slice(0, 300), t),
    ),
  );
  const made = res.reduce((s, r) => s + (r.meta.changes ?? 0), 0);
  if (!made || !n.email || n.demo) return made;
  const cfg = emailConfig(await emailEnv(env));
  if (cfg.provider === 'none') return made;
  let url: string | null = null;
  try {
    url = `${appBase(env).origin}/erp${n.link}`;
  } catch {
    url = null;
  }
  const people = await db.prepare(`SELECT id, email, name FROM users WHERE disabled_at IS NULL AND id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all<{ id: string; email: string; name: string }>();
  const work = (async () => {
    for (const p of people.results) {
      const r = await enqueueEmail(env, {
        userId: p.id,
        to: p.email,
        toName: p.name,
        data: { template: 'whs_alert', organisation: n.companyName, title: n.title, body: n.body ?? null, url },
        idempotencyKey: `whs:${n.dedupe}:${p.id}`,
        sensitive: true,
      }).catch(() => null);
      if (r?.queued) await db.prepare('UPDATE whs_alerts SET emailed = 1 WHERE dedupe_key = ?').bind(`${n.dedupe}:${p.id}`.slice(0, 300)).run();
    }
    await processOutbox(env, { max: 10 }).catch(() => null);
  })();
  if (waitUntil) waitUntil(work);
  else await work;
  return made;
}

// ------------------------------------------------------------------ files

export function fileDTO(f: any) {
  return { id: f.id, name: f.name, mime: f.mime, size: f.size, isImage: String(f.mime).startsWith('image/'), uploadedBy: f.uploaded_by, uploadedByName: f.uploader ?? null, createdAt: f.created_at, url: `/api/whs/c/${f.company_id}/files/${f.id}` };
}

export async function filesOf(db: D1Database, companyId: string, entityType: string, entityId: string) {
  const rows = await db
    .prepare('SELECT f.*, u.name AS uploader FROM whs_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.entity_type = ? AND f.entity_id = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 200')
    .bind(companyId, entityType, entityId)
    .all<any>();
  return rows.results.map(fileDTO);
}

export async function commentsOf(db: D1Database, companyId: string, entityType: string, entityId: string) {
  const rows = await db
    .prepare('SELECT c.*, u.name AS author FROM whs_comments c LEFT JOIN users u ON u.id = c.author_id WHERE c.company_id = ? AND c.entity_type = ? AND c.entity_id = ? ORDER BY c.created_at LIMIT 500')
    .bind(companyId, entityType, entityId)
    .all<any>();
  return rows.results.map((c) => ({ id: c.id, kind: c.kind, body: c.body, authorId: c.author_id, authorName: c.author ?? null, at: c.created_at }));
}

/** An ISO date of a ms time, in UTC. */
export const isoDate = (t: number) => new Date(t).toISOString().slice(0, 10);

/** The months from `from` to `to` (YYYY-MM), at most 36. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let y = Number(from.slice(0, 4));
  let m = Number(from.slice(5, 7));
  const end = to.slice(0, 7);
  for (let i = 0; i < 36; i++) {
    const k = `${y}-${String(m).padStart(2, '0')}`;
    out.push(k);
    if (k >= end) break;
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
}

// ------------------------------------------------------------------ records elsewhere in the company (read only)

/** A site of the company (Maintenance's sites): its name, or 400. */
export async function siteName(db: D1Database, companyId: string, id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const r = await db.prepare('SELECT name FROM mt_sites WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(companyId, id).first<{ name: string }>();
  if (!r) throw new HttpError(400, 'Choose a site of this company');
  return r.name;
}

/** A department of a registered company, or 400. */
export async function departmentName(db: D1Database, companyId: string, id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const r = await db.prepare('SELECT name FROM co_departments WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(companyId, id).first<{ name: string }>();
  if (!r) throw new HttpError(400, 'Choose a department of this company');
  return r.name;
}

/** An asset of the company's Maintenance register (read only, never written), or 400. */
export async function assetName(db: D1Database, companyId: string, id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const r = await db.prepare('SELECT number, name FROM mt_assets WHERE company_id = ? AND id = ?').bind(companyId, id).first<{ number: string; name: string }>();
  if (!r) throw new HttpError(400, 'Choose an asset of this company');
  return `${r.number} ${r.name}`;
}

/** The kind of a company (for the ERP's people of it): registered, own or the example company. */
export async function companyKindOf(db: D1Database, companyId: string): Promise<'registered' | 'own' | 'demo'> {
  if (await db.prepare('SELECT 1 FROM co_companies WHERE id = ?').bind(companyId).first()) return 'registered';
  if (await db.prepare('SELECT 1 FROM sys_demo WHERE company_id = ?').bind(companyId).first()) return 'demo';
  return 'own';
}

export const REF_JOINS = (alias: string) => `
  LEFT JOIN mt_sites ws ON ws.company_id = ${alias}.company_id AND ws.id = ${alias}.site_id
  LEFT JOIN co_departments wd ON wd.company_id = ${alias}.company_id AND wd.id = ${alias}.department_id
  LEFT JOIN mt_assets wa ON wa.company_id = ${alias}.company_id AND wa.id = ${alias}.asset_id`;
export const REF_COLUMNS = 'ws.name AS site_name, wd.name AS department_name, wa.number AS asset_number, wa.name AS asset_name';
