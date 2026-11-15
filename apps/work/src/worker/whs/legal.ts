// BIZOMAT WHS, Release 1: the jurisdiction engine (brief sections 3, 8 and 21 to 23).
//
// Packs (whs_packs) are platform data: a country, a state or province, the regulator, and its instruments (legislation,
// regulations, approved codes of practice, standards, government guidance, model laws) and versioned rules (notifiable
// incidents, site preservation, record retention, exposure limits). Platform administrators keep them
// (/api/admin/whs/*): a new rule version is drafted, submitted, reviewed by someone else (a lone administrator's own
// review is the recorded exception), activated, and verified against the official source, with who, when, the source
// checked and notes. Every change is in whs_legal_events (append-only). Company WHS managers read the packs and their
// verification status (/api/whs/packs), assign them to their sites, and add company policies (index.ts).
//
// The effective-date engine: the version of a rule in effect on a date is the active version whose range covers the
// date, the latest effective_from first, then the highest version. It APPLIES only when it is verified. An unverified
// rule is shown with its draft text and "deadline not verified: check with the regulator", and never gives a deadline
// or a flag. Each evaluation of an incident is stored as a snapshot (whs_rule_checks), so a later version, or a rule
// verified later, never changes what an old incident recorded. A site's incidents are evaluated only against the packs
// of that site: one jurisdiction's rules are never applied to another.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { SEED_PACKS, SEED_VERSION } from './seed';
import { INSTRUMENT_KINDS, INSTRUMENT_NOTES, INCIDENT_KINDS, OUTCOMES, RULE_KINDS, RULE_STATUS, SEVERITIES, VERIFICATION, WHS_KIND_LABEL, badState, validDate, zDate, zKind, zList, zLong, zText, zUrl } from './util';

// ------------------------------------------------------------------ seeding

/**
 * Seeds the packs once per database (INSERT OR IGNORE: never overwrites what an administrator changed). One read of a
 * primary key per request; the seed itself runs once.
 */
export async function ensureSeed(db: D1Database): Promise<void> {
  const have = await db.prepare("SELECT value FROM whs_meta WHERE key = 'seed_version'").first<{ value: string }>();
  if (Number(have?.value ?? 0) >= SEED_VERSION) return;
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const p of SEED_PACKS) {
    stmts.push(
      db
        .prepare('INSERT OR IGNORE INTO whs_packs (id, code, country, region, name, framework, regulator, regulator_url, assignable, coverage, notes, version, sort, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)')
        .bind(p.id, p.code, p.country, p.region, p.name, p.framework, p.regulator, p.regulatorUrl, p.assignable ? 1 : 0, p.coverage, p.notes, p.sort, t, t),
    );
    p.instruments.forEach((i, n) =>
      stmts.push(
        db
          .prepare("INSERT OR IGNORE INTO whs_instruments (id, pack_id, kind, title, citation, industry, source_url, effective_from, amended_at, summary, status, source_check, sort, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, 'not_verified', ?, ?, ?, ?)")
          .bind(i.id, p.id, i.kind, i.title, i.citation ?? '', i.industry ?? '', i.url, i.amendedAt ?? null, i.summary ?? '', i.check, n, t, t),
      ),
    );
    for (const r of p.rules) {
      stmts.push(
        db
          .prepare(
            `INSERT OR IGNORE INTO whs_rules (id, rule_key, version, pack_id, kind, title, instrument_id, provision, source_url, effective_from, effective_to, body, criteria_json, deadline_text, required_info_json,
               site_preservation, responsible_party, procedure_text, retention, regulator, notify_url, change_note, source_check, status, verification, activated_at, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'not_verified', ?, ?, ?)`,
          )
          .bind(
            `${r.key}@v${r.version}`,
            r.key,
            r.version,
            p.id,
            r.kind,
            r.title,
            r.instrument ?? null,
            r.provision ?? '',
            r.url,
            r.from ?? null,
            r.to ?? null,
            r.body,
            JSON.stringify(r.criteria ?? {}),
            r.deadlineText ?? '',
            JSON.stringify(r.requiredInfo ?? []),
            r.sitePreservation ?? '',
            r.responsibleParty ?? '',
            r.procedure ?? '',
            r.retention ?? '',
            r.regulator ?? p.regulator,
            r.notifyUrl ?? '',
            r.changeNote ?? '',
            r.check,
            r.status,
            r.status === 'active' ? t : null,
            t,
            t,
          ),
      );
    }
  }
  stmts.push(
    db.prepare("INSERT INTO whs_legal_events (id, actor_id, action, pack_id, entity_type, entity_id, summary, after_json, created_at) SELECT ?, NULL, 'seed', NULL, 'seed', NULL, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM whs_meta WHERE key = 'seed_version' AND CAST(value AS INTEGER) >= ?)").bind(newId(), `Jurisdiction packs seeded (version ${SEED_VERSION}): every instrument and rule not verified`, JSON.stringify({ packs: SEED_PACKS.length }), t, SEED_VERSION),
    db.prepare("INSERT INTO whs_meta (key, value, updated_at) VALUES ('seed_version', ?1, ?2) ON CONFLICT(key) DO UPDATE SET value = MAX(CAST(whs_meta.value AS INTEGER), CAST(?1 AS INTEGER)), updated_at = ?2").bind(String(SEED_VERSION), t),
  );
  await db.batch(stmts);
}

// ------------------------------------------------------------------ DTOs

export function packDTO(p: any) {
  return {
    id: p.id,
    code: p.code,
    country: p.country,
    region: p.region,
    name: p.name,
    framework: p.framework,
    regulator: p.regulator,
    regulatorUrl: p.regulator_url,
    assignable: !!p.assignable,
    coverage: p.coverage,
    notes: p.notes,
    version: p.version,
    counts: p.instruments !== undefined ? { instruments: Number(p.instruments ?? 0), rules: Number(p.rules ?? 0), verifiedRules: Number(p.verified_rules ?? 0), verifiedInstruments: Number(p.verified_instruments ?? 0) } : undefined,
  };
}

export function instrumentDTO(i: any, admin = false) {
  return {
    id: i.id,
    packId: i.pack_id,
    kind: i.kind,
    kindLabel: WHS_KIND_LABEL(INSTRUMENT_KINDS, i.kind),
    kindNote: INSTRUMENT_NOTES[i.kind] ?? '',
    title: i.title,
    citation: i.citation,
    industry: i.industry,
    sourceUrl: i.source_url,
    effectiveFrom: i.effective_from,
    amendedAt: i.amended_at,
    summary: i.summary,
    status: i.status,
    statusLabel: i.status === 'verified' ? 'Verified' : i.status === 'retired' ? 'Retired' : 'Not verified',
    verifiedAt: i.verified_at,
    verifiedSource: i.verified_source,
    verifiedNotes: i.verified_notes,
    verifiedByName: admin ? (i.verified_by_name ?? null) : null,
    sourceCheck: i.source_check,
  };
}

export interface Criteria {
  kinds?: string[];
  outcomes?: string[];
  severities?: string[];
}

export function ruleDTO(r: any, admin = false) {
  return {
    id: r.id,
    key: r.rule_key,
    version: r.version,
    packId: r.pack_id,
    kind: r.kind,
    kindLabel: WHS_KIND_LABEL(RULE_KINDS, r.kind),
    title: r.title,
    instrumentId: r.instrument_id,
    provision: r.provision,
    sourceUrl: r.source_url,
    effectiveFrom: r.effective_from,
    effectiveTo: r.effective_to,
    body: r.body,
    criteria: parseJson<Criteria>(r.criteria_json, {}),
    deadlineMinutes: r.deadline_minutes,
    deadlineFrom: r.deadline_from,
    deadlineText: r.deadline_text,
    requiredInfo: parseJson<string[]>(r.required_info_json, []),
    sitePreservation: r.site_preservation,
    responsibleParty: r.responsible_party,
    procedure: r.procedure_text,
    retention: r.retention,
    regulator: r.regulator,
    notifyUrl: r.notify_url,
    changeNote: r.change_note,
    sourceCheck: r.source_check,
    status: r.status,
    statusLabel: WHS_KIND_LABEL(RULE_STATUS, r.status),
    verification: r.verification,
    verificationLabel: WHS_KIND_LABEL(VERIFICATION, r.verification),
    verifiedAt: r.verified_at,
    verifiedSource: r.verified_source,
    verifiedNotes: r.verified_notes,
    verifySod: !!r.verify_sod,
    reviewedAt: r.reviewed_at,
    reviewNotes: admin ? r.review_notes : undefined,
    reviewSod: !!r.review_sod,
    activatedAt: r.activated_at,
    submittedAt: r.submitted_at,
    // platform administrators' names only to platform administrators
    draftedByName: admin ? (r.drafted_by_name ?? null) : undefined,
    reviewedByName: admin ? (r.reviewed_by_name ?? null) : undefined,
    verifiedByName: admin ? (r.verified_by_name ?? null) : undefined,
    applies: r.status === 'active' && r.verification === 'verified',
  };
}

const RULE_SELECT = `SELECT r.*, d.name AS drafted_by_name, v.name AS reviewed_by_name, f.name AS verified_by_name FROM whs_rules r
  LEFT JOIN users d ON d.id = r.drafted_by LEFT JOIN users v ON v.id = r.reviewed_by LEFT JOIN users f ON f.id = r.verified_by`;

// ------------------------------------------------------------------ the effective-date engine

/** The active rule versions in effect on `date` (YYYY-MM-DD) for each rule key of one pack, optionally of one kind. */
export async function rulesInEffect(db: D1Database, packId: string, date: string, kind?: string): Promise<any[]> {
  const rows = await db
    .prepare(
      `SELECT * FROM whs_rules WHERE pack_id = ? AND status = 'active' ${kind ? 'AND kind = ?' : ''}
         AND (effective_from IS NULL OR effective_from <= ?) AND (effective_to IS NULL OR effective_to >= ?)
       ORDER BY rule_key, COALESCE(effective_from, '') DESC, version DESC`,
    )
    .bind(...(kind ? [packId, kind, date, date] : [packId, date, date]))
    .all<any>();
  const seen = new Set<string>();
  return rows.results.filter((r) => (seen.has(r.rule_key) ? false : (seen.add(r.rule_key), true)));
}

/** Whether an incident is within a verified rule's criteria (never called for an unverified rule). */
export function matchesCriteria(criteria: Criteria, incident: { kind: string; outcome: string; severity: string }): boolean {
  return !!(criteria.kinds?.includes(incident.kind) || criteria.outcomes?.includes(incident.outcome) || criteria.severities?.includes(incident.severity));
}

export interface RuleCheckResult {
  id: string;
  packId: string;
  ruleId: string;
  verified: boolean;
  matches: boolean | null;
  dueAt: number | null;
}

/**
 * Evaluates an incident against the notification rules in effect on its date in the packs of its site, and stores the
 * snapshot (append-only). Returns the checks and whether any verified rule covers it ("potentially notifiable": a
 * prompt for a WHS manager, never a decision).
 */
export async function evaluateIncident(db: D1Database, companyId: string, incident: any, actorId: string | null): Promise<{ checks: RuleCheckResult[]; flagged: boolean; noSite: boolean; noPacks: boolean }> {
  if (!incident.site_id) return { checks: [], flagged: false, noSite: true, noPacks: false };
  const packs = await db
    .prepare('SELECT p.* FROM whs_site_packs sp JOIN whs_packs p ON p.id = sp.pack_id WHERE sp.company_id = ? AND sp.site_id = ? ORDER BY p.sort')
    .bind(companyId, incident.site_id)
    .all<any>();
  if (!packs.results.length) return { checks: [], flagged: false, noSite: false, noPacks: true };
  const t = now();
  const evaluation = newId();
  const checks: RuleCheckResult[] = [];
  const stmts: D1PreparedStatement[] = [];
  for (const p of packs.results) {
    for (const r of await rulesInEffect(db, p.id, incident.occurred_date, 'notification')) {
      const verified = r.verification === 'verified' && !!r.effective_from;
      const criteria = parseJson<Criteria>(r.criteria_json, {});
      const matches = verified ? matchesCriteria(criteria, incident) : null;
      const base = r.deadline_from === 'occurrence' ? Number(incident.occurred_at) : Number(incident.aware_at);
      const dueAt = verified && matches && r.deadline_minutes ? base + Number(r.deadline_minutes) * 60_000 : null;
      const id = newId();
      checks.push({ id, packId: p.id, ruleId: r.id, verified, matches, dueAt });
      const snapshot = {
        pack: { id: p.id, code: p.code, name: p.name, regulator: p.regulator },
        rule: { id: r.id, key: r.rule_key, version: r.version, title: r.title, provision: r.provision, sourceUrl: r.source_url, effectiveFrom: r.effective_from, effectiveTo: r.effective_to, body: r.body, deadlineMinutes: r.deadline_minutes, deadlineFrom: r.deadline_from, deadlineText: r.deadline_text, requiredInfo: parseJson<string[]>(r.required_info_json, []), sitePreservation: r.site_preservation, responsibleParty: r.responsible_party, procedure: r.procedure_text, regulator: r.regulator, notifyUrl: r.notify_url, criteria, verification: r.verification, verifiedAt: r.verified_at, verifiedSource: r.verified_source },
        incident: { kind: incident.kind, outcome: incident.outcome, severity: incident.severity, occurredDate: incident.occurred_date },
      };
      stmts.push(
        db
          .prepare('INSERT INTO whs_rule_checks (id, company_id, incident_id, evaluation_id, pack_id, site_id, rule_id, rule_key, rule_version, verified, matches, due_at, snapshot_json, evaluated_by, evaluated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(id, companyId, incident.id, evaluation, p.id, incident.site_id, r.id, r.rule_key, r.version, verified ? 1 : 0, matches === null ? null : matches ? 1 : 0, dueAt, JSON.stringify(snapshot).slice(0, 20000), actorId, t),
      );
    }
  }
  const flagged = checks.some((c) => c.verified && c.matches);
  stmts.push(db.prepare('UPDATE whs_incidents SET potentially_notifiable = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(flagged ? 1 : 0, t, companyId, incident.id));
  await db.batch(stmts);
  return { checks, flagged, noSite: false, noPacks: false };
}

/** The latest evaluation of an incident (each check with its snapshot). */
export async function latestChecks(db: D1Database, companyId: string, incidentId: string) {
  const last = await db.prepare('SELECT evaluation_id FROM whs_rule_checks WHERE company_id = ? AND incident_id = ? ORDER BY evaluated_at DESC, rowid DESC LIMIT 1').bind(companyId, incidentId).first<{ evaluation_id: string }>();
  if (!last) return [];
  const rows = await db.prepare('SELECT * FROM whs_rule_checks WHERE company_id = ? AND evaluation_id = ? ORDER BY rowid').bind(companyId, last.evaluation_id).all<any>();
  return rows.results.map(checkDTO);
}

export function checkDTO(c: any) {
  const s = parseJson<any>(c.snapshot_json, {});
  return {
    id: c.id,
    packId: c.pack_id,
    pack: s.pack ?? null,
    ruleId: c.rule_id,
    ruleKey: c.rule_key,
    ruleVersion: c.rule_version,
    rule: s.rule ?? null,
    verified: !!c.verified,
    matches: c.matches === null ? null : !!c.matches,
    dueAt: c.due_at,
    // the plain words the screen shows, so it never computes a deadline itself
    dueNote: !c.verified ? 'Deadline not verified: check with the regulator.' : c.matches ? (c.due_at ? '' : 'The verified rule gives no deadline in hours: check the rule’s text.') : 'Not covered by this rule’s criteria.',
    evaluatedAt: c.evaluated_at,
  };
}

// ------------------------------------------------------------------ company-facing reads (signed in)

export const legalRoutes = new Hono<AppEnv>();

legalRoutes.use('*', async (_c, next) => {
  await ensureSeed(_c.env.DB);
  await next();
});

legalRoutes.get('/packs', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT p.*, (SELECT COUNT(*) FROM whs_instruments i WHERE i.pack_id = p.id AND i.status <> 'retired') AS instruments,
            (SELECT COUNT(*) FROM whs_instruments i WHERE i.pack_id = p.id AND i.status = 'verified') AS verified_instruments,
            (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active') AS rules,
            (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active' AND r.verification = 'verified') AS verified_rules
       FROM whs_packs p ORDER BY p.sort, p.name`,
  ).all<any>();
  return c.json({ packs: rows.results.map(packDTO), notice: VERIFY_NOTICE });
});

legalRoutes.get('/packs/:pack', async (c) => {
  const db = c.env.DB;
  const p = await db.prepare('SELECT * FROM whs_packs WHERE id = ?').bind(c.req.param('pack')).first<any>();
  if (!p) throw notFound('Jurisdiction');
  const [ins, rules] = await db.batch([
    db.prepare("SELECT * FROM whs_instruments WHERE pack_id = ? AND status <> 'retired' ORDER BY sort, title").bind(p.id),
    db.prepare("SELECT * FROM whs_rules WHERE pack_id = ? AND status = 'active' ORDER BY rule_key, COALESCE(effective_from, ''), version").bind(p.id),
  ]);
  return c.json({ pack: packDTO(p), instruments: (ins.results as any[]).map((i) => instrumentDTO(i)), rules: (rules.results as any[]).map((r) => ruleDTO(r)), notice: VERIFY_NOTICE });
});

export const VERIFY_NOTICE =
  'Legal content in BIZOMAT WHS is a starting point, not legal advice. Each instrument and rule shows whether it is verified. A competent person must verify it against the official source before it is relied on. Until a rule is verified, BIZOMAT never computes a deadline from it or flags an incident with it. BIZOMAT does not submit notifications to regulators.';

// ------------------------------------------------------------------ platform administration (/api/admin/whs)

export const legalAdminRoutes = new Hono<AppEnv>();

legalAdminRoutes.use('*', async (c, next) => {
  await ensureSeed(c.env.DB);
  await next();
});

function legalEvent(db: D1Database, e: { actorId: string | null; action: string; packId: string | null; entityType: 'pack' | 'instrument' | 'rule'; entityId: string; summary: string; before?: unknown; after?: unknown; at?: number }) {
  return db
    .prepare('INSERT INTO whs_legal_events (id, actor_id, action, pack_id, entity_type, entity_id, summary, before_json, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.actorId, e.action, e.packId, e.entityType, e.entityId, e.summary.slice(0, 500), e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000), e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000), e.at ?? now());
}

const bumpPack = (db: D1Database, packId: string, t: number) => db.prepare('UPDATE whs_packs SET version = version + 1, updated_at = ? WHERE id = ?').bind(t, packId);

/** Segregation for platform administrators: a lone administrator's own review is allowed and recorded. */
async function platformSod(db: D1Database, userId: string, authorId: string | null, what: string): Promise<boolean> {
  if (!authorId || authorId !== userId) return false;
  const n = await db.prepare('SELECT COUNT(*) AS n FROM platform_admins').first<{ n: number }>();
  if (Number(n?.n ?? 0) <= 1) return true;
  throw new HttpError(403, `You ${what}, so another platform administrator must review it (segregation of duties)`);
}

async function loadRule(db: D1Database, id: string) {
  const r = await db.prepare(`${RULE_SELECT} WHERE r.id = ?`).bind(id).first<any>();
  if (!r) throw notFound('Rule');
  return r;
}

legalAdminRoutes.get('/packs/:pack', async (c) => {
  const db = c.env.DB;
  const p = await db.prepare('SELECT * FROM whs_packs WHERE id = ?').bind(c.req.param('pack')).first<any>();
  if (!p) throw notFound('Jurisdiction');
  const [ins, rules, events, sites] = await db.batch([
    db.prepare('SELECT i.*, u.name AS verified_by_name FROM whs_instruments i LEFT JOIN users u ON u.id = i.verified_by WHERE i.pack_id = ? ORDER BY i.sort, i.title').bind(p.id),
    db.prepare(`${RULE_SELECT} WHERE r.pack_id = ? ORDER BY r.rule_key, r.version`).bind(p.id),
    db.prepare('SELECT e.*, u.name AS actor_name FROM whs_legal_events e LEFT JOIN users u ON u.id = e.actor_id WHERE e.pack_id = ? ORDER BY e.created_at DESC, e.rowid DESC LIMIT 200').bind(p.id),
    db.prepare('SELECT COUNT(*) AS n FROM whs_site_packs WHERE pack_id = ?').bind(p.id),
  ]);
  return c.json({
    pack: packDTO(p),
    instruments: (ins.results as any[]).map((i) => instrumentDTO(i, true)),
    rules: (rules.results as any[]).map((r) => ruleDTO(r, true)),
    events: (events.results as any[]).map((e) => ({ id: e.id, action: e.action, entityType: e.entity_type, entityId: e.entity_id, summary: e.summary, actorName: e.actor_name ?? (e.actor_id ? null : 'BIZOMAT (seed)'), before: parseJson(e.before_json, null), after: parseJson(e.after_json, null), at: e.created_at })),
    // how many sites use it, across all companies (a count only, never which companies)
    sites: Number((sites.results[0] as any)?.n ?? 0),
    notice: VERIFY_NOTICE,
  });
});

const zPackEdit = z.object({ regulator: zText(200).optional(), regulatorUrl: zUrl.optional(), framework: zText(300).optional(), notes: zLong(2000).optional() });

legalAdminRoutes.patch('/packs/:pack', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const p = await db.prepare('SELECT * FROM whs_packs WHERE id = ?').bind(c.req.param('pack')).first<any>();
  if (!p) throw notFound('Jurisdiction');
  const input = await body(c, zPackEdit);
  const next = { regulator: input.regulator ?? p.regulator, regulator_url: input.regulatorUrl ?? p.regulator_url, framework: input.framework ?? p.framework, notes: input.notes ?? p.notes };
  const t = now();
  await db.batch([
    db.prepare('UPDATE whs_packs SET regulator = ?, regulator_url = ?, framework = ?, notes = ?, version = version + 1, updated_at = ? WHERE id = ?').bind(next.regulator, next.regulator_url, next.framework, next.notes, t, p.id),
    legalEvent(db, { actorId: user.id, action: 'pack.changed', packId: p.id, entityType: 'pack', entityId: p.id, summary: `${p.name}: details changed`, before: { regulator: p.regulator, regulator_url: p.regulator_url, framework: p.framework, notes: p.notes }, after: next, at: t }),
  ]);
  return c.json({ ok: true });
});

const zInstrument = z.object({
  kind: zKind(INSTRUMENT_KINDS, 'kind of instrument').refine((k) => k !== 'company_policy', 'Company policies are added by each company'),
  title: zText(300).min(1),
  citation: zText(120).optional(),
  industry: zText(300).optional(),
  sourceUrl: zUrl,
  effectiveFrom: zDate.optional(),
  amendedAt: zDate.optional(),
  summary: zLong(2000).optional(),
});

legalAdminRoutes.post('/packs/:pack/instruments', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const p = await db.prepare('SELECT * FROM whs_packs WHERE id = ?').bind(c.req.param('pack')).first<any>();
  if (!p) throw notFound('Jurisdiction');
  const input = await body(c, zInstrument);
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare("INSERT INTO whs_instruments (id, pack_id, kind, title, citation, industry, source_url, effective_from, amended_at, summary, status, sort, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'not_verified', 100, ?, ?, ?)")
      .bind(id, p.id, input.kind, input.title, input.citation ?? '', input.industry ?? '', input.sourceUrl, input.effectiveFrom ?? null, input.amendedAt ?? null, input.summary ?? '', user.id, t, t),
    legalEvent(db, { actorId: user.id, action: 'instrument.added', packId: p.id, entityType: 'instrument', entityId: id, summary: `${p.name}: ${input.title} added (not verified)`, after: input, at: t }),
    bumpPack(db, p.id, t),
  ]);
  return c.json({ id }, 201);
});

legalAdminRoutes.patch('/instruments/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const i = await db.prepare('SELECT * FROM whs_instruments WHERE id = ?').bind(c.req.param('id')).first<any>();
  if (!i) throw notFound('Instrument');
  const input = await body(c, zInstrument.partial().extend({ retire: z.boolean().optional() }));
  const next = {
    kind: input.kind ?? i.kind,
    title: input.title ?? i.title,
    citation: input.citation ?? i.citation,
    industry: input.industry ?? i.industry,
    source_url: input.sourceUrl ?? i.source_url,
    effective_from: input.effectiveFrom === undefined ? i.effective_from : input.effectiveFrom,
    amended_at: input.amendedAt === undefined ? i.amended_at : input.amendedAt,
    summary: input.summary ?? i.summary,
  };
  const before = { kind: i.kind, title: i.title, citation: i.citation, industry: i.industry, source_url: i.source_url, effective_from: i.effective_from, amended_at: i.amended_at, summary: i.summary, status: i.status };
  const contentChanged = JSON.stringify(Object.values(next)) !== JSON.stringify(Object.values(before).slice(0, 8));
  // a verification holds for what was checked: changing the record makes it not verified again
  const status = input.retire ? 'retired' : contentChanged && i.status === 'verified' ? 'not_verified' : i.status === 'retired' && input.retire === false ? 'not_verified' : i.status;
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE whs_instruments SET kind = ?, title = ?, citation = ?, industry = ?, source_url = ?, effective_from = ?, amended_at = ?, summary = ?, status = ?, updated_at = ? WHERE id = ?')
      .bind(next.kind, next.title, next.citation, next.industry, next.source_url, next.effective_from, next.amended_at, next.summary, status, t, i.id),
    legalEvent(db, { actorId: user.id, action: input.retire ? 'instrument.retired' : 'instrument.changed', packId: i.pack_id, entityType: 'instrument', entityId: i.id, summary: `${i.title}: ${input.retire ? 'retired' : status !== i.status ? 'changed, so it is not verified any more' : 'changed'}`, before, after: { ...next, status }, at: t }),
    bumpPack(db, i.pack_id, t),
  ]);
  return c.json({ ok: true, status });
});

const zVerify = z.object({ sourceChecked: zUrl, notes: zLong(2000).min(3, 'Say what you checked'), effectiveFrom: zDate.optional() });

legalAdminRoutes.post('/instruments/:id/verify', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const i = await db.prepare('SELECT * FROM whs_instruments WHERE id = ?').bind(c.req.param('id')).first<any>();
  if (!i) throw notFound('Instrument');
  if (i.status === 'retired') badState('A retired instrument cannot be verified');
  const input = await body(c, zVerify);
  const t = now();
  await db.batch([
    db
      .prepare("UPDATE whs_instruments SET status = 'verified', verified_by = ?, verified_at = ?, verified_source = ?, verified_notes = ?, effective_from = COALESCE(?, effective_from), updated_at = ? WHERE id = ?")
      .bind(user.id, t, input.sourceChecked, input.notes, input.effectiveFrom ?? null, t, i.id),
    legalEvent(db, { actorId: user.id, action: 'instrument.verified', packId: i.pack_id, entityType: 'instrument', entityId: i.id, summary: `${i.title}: verified against ${input.sourceChecked}`, before: { status: i.status }, after: { status: 'verified', source: input.sourceChecked, notes: input.notes }, at: t }),
    bumpPack(db, i.pack_id, t),
  ]);
  return c.json({ ok: true });
});

const zCriteria = z.object({
  kinds: z.array(zKind(INCIDENT_KINDS, 'incident kind')).max(20).optional(),
  outcomes: z.array(zKind(OUTCOMES, 'outcome')).max(20).optional(),
  severities: z.array(zKind(SEVERITIES, 'severity')).max(10).optional(),
});

const zRule = z.object({
  kind: zKind(RULE_KINDS, 'kind of rule'),
  title: zText(300).min(1),
  instrumentId: z.string().max(80).nullable().optional(),
  provision: zText(300).optional(),
  sourceUrl: zUrl,
  effectiveFrom: zDate.optional(),
  effectiveTo: zDate.optional(),
  body: zLong(5000).optional(),
  criteria: zCriteria.optional(),
  deadlineMinutes: z.number().int().min(1).max(525_600).nullable().optional(),
  deadlineFrom: z.enum(['awareness', 'occurrence']).optional(),
  deadlineText: zLong(1000).optional(),
  requiredInfo: zList(30).optional(),
  sitePreservation: zLong(2000).optional(),
  responsibleParty: zLong(500).optional(),
  procedure: zLong(2000).optional(),
  retention: zLong(1000).optional(),
  regulator: zText(200).optional(),
  notifyUrl: z.union([zUrl, z.literal('')]).optional(),
  changeNote: zLong(1000).optional(),
});

function ruleColumns(input: Partial<z.infer<typeof zRule>>, base: any) {
  return {
    kind: input.kind ?? base.kind,
    title: input.title ?? base.title,
    instrument_id: input.instrumentId === undefined ? (base.instrument_id ?? null) : input.instrumentId,
    provision: input.provision ?? base.provision ?? '',
    source_url: input.sourceUrl ?? base.source_url,
    effective_from: input.effectiveFrom === undefined ? (base.effective_from ?? null) : input.effectiveFrom,
    effective_to: input.effectiveTo === undefined ? (base.effective_to ?? null) : input.effectiveTo,
    body: input.body ?? base.body ?? '',
    criteria_json: input.criteria ? JSON.stringify(input.criteria) : (base.criteria_json ?? '{}'),
    deadline_minutes: input.deadlineMinutes === undefined ? (base.deadline_minutes ?? null) : input.deadlineMinutes,
    deadline_from: input.deadlineFrom ?? base.deadline_from ?? 'awareness',
    deadline_text: input.deadlineText ?? base.deadline_text ?? '',
    required_info_json: input.requiredInfo ? JSON.stringify(input.requiredInfo) : (base.required_info_json ?? '[]'),
    site_preservation: input.sitePreservation ?? base.site_preservation ?? '',
    responsible_party: input.responsibleParty ?? base.responsible_party ?? '',
    procedure_text: input.procedure ?? base.procedure_text ?? '',
    retention: input.retention ?? base.retention ?? '',
    regulator: input.regulator ?? base.regulator ?? '',
    notify_url: input.notifyUrl ?? base.notify_url ?? '',
    change_note: input.changeNote ?? base.change_note ?? '',
  };
}

function checkDates(r: { effective_from: string | null; effective_to: string | null }) {
  if (r.effective_from && r.effective_to && r.effective_from > r.effective_to) throw new HttpError(400, 'The rule must take effect before it ends');
}

/** A new rule (its first version, a draft). */
legalAdminRoutes.post('/packs/:pack/rules', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const p = await db.prepare('SELECT * FROM whs_packs WHERE id = ?').bind(c.req.param('pack')).first<any>();
  if (!p) throw notFound('Jurisdiction');
  const input = await body(c, zRule.extend({ key: z.string().trim().regex(/^[a-z0-9][a-z0-9._-]{1,60}$/, 'Use lower-case letters, digits, dots and dashes').optional() }));
  const key = input.key ? (input.key.startsWith(`${p.id}.`) ? input.key : `${p.id}.${input.key}`) : `${p.id}.${input.kind}-${newId().slice(0, 6).toLowerCase()}`;
  if (await db.prepare('SELECT 1 FROM whs_rules WHERE rule_key = ?').bind(key).first()) badState('A rule with this key exists: add a new version of it instead');
  if (input.instrumentId && !(await db.prepare('SELECT 1 FROM whs_instruments WHERE id = ? AND pack_id = ?').bind(input.instrumentId, p.id).first())) throw new HttpError(400, 'Choose an instrument of this jurisdiction');
  const cols = ruleColumns(input, {});
  checkDates(cols);
  const id = `${key}@v1`;
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO whs_rules (id, rule_key, version, pack_id, kind, title, instrument_id, provision, source_url, effective_from, effective_to, body, criteria_json, deadline_minutes, deadline_from, deadline_text, required_info_json,
           site_preservation, responsible_party, procedure_text, retention, regulator, notify_url, change_note, status, verification, drafted_by, created_at, updated_at)
         VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'not_verified', ?, ?, ?)`,
      )
      .bind(id, key, p.id, cols.kind, cols.title, cols.instrument_id, cols.provision, cols.source_url, cols.effective_from, cols.effective_to, cols.body, cols.criteria_json, cols.deadline_minutes, cols.deadline_from, cols.deadline_text, cols.required_info_json, cols.site_preservation, cols.responsible_party, cols.procedure_text, cols.retention, cols.regulator || p.regulator, cols.notify_url, cols.change_note, user.id, t, t),
    legalEvent(db, { actorId: user.id, action: 'rule.drafted', packId: p.id, entityType: 'rule', entityId: id, summary: `${p.name}: rule "${cols.title}" drafted (version 1)`, after: cols, at: t }),
  ]);
  return c.json(ruleDTO(await loadRule(db, id), true), 201);
});

/** A new version of a rule: a draft copied from the latest version. Older versions stay as they are. */
legalAdminRoutes.post('/rules/:id/versions', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const base = await loadRule(db, c.req.param('id'));
  const input = await body(c, zRule.partial());
  if (await db.prepare("SELECT 1 FROM whs_rules WHERE rule_key = ? AND status IN ('draft', 'in_review', 'reviewed')").bind(base.rule_key).first()) badState('A version of this rule is already being drafted or reviewed: finish or withdraw it first');
  const top = await db.prepare('SELECT MAX(version) AS v FROM whs_rules WHERE rule_key = ?').bind(base.rule_key).first<{ v: number }>();
  const version = Number(top?.v ?? 0) + 1;
  const cols = ruleColumns(input, base);
  checkDates(cols);
  const id = `${base.rule_key}@v${version}`;
  const t = now();
  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO whs_rules (id, rule_key, version, pack_id, kind, title, instrument_id, provision, source_url, effective_from, effective_to, body, criteria_json, deadline_minutes, deadline_from, deadline_text, required_info_json,
             site_preservation, responsible_party, procedure_text, retention, regulator, notify_url, change_note, status, verification, drafted_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'not_verified', ?, ?, ?)`,
        )
        .bind(id, base.rule_key, version, base.pack_id, cols.kind, cols.title, cols.instrument_id, cols.provision, cols.source_url, cols.effective_from, cols.effective_to, cols.body, cols.criteria_json, cols.deadline_minutes, cols.deadline_from, cols.deadline_text, cols.required_info_json, cols.site_preservation, cols.responsible_party, cols.procedure_text, cols.retention, cols.regulator, cols.notify_url, cols.change_note, user.id, t, t),
      legalEvent(db, { actorId: user.id, action: 'rule.version_drafted', packId: base.pack_id, entityType: 'rule', entityId: id, summary: `"${cols.title}": version ${version} drafted from version ${base.version}`, after: cols, at: t }),
    ]);
  } catch (e) {
    if (String((e as Error)?.message ?? e).includes('UNIQUE')) badState('A version of this rule is already being drafted or reviewed');
    throw e;
  }
  return c.json(ruleDTO(await loadRule(db, id), true), 201);
});

/** Edit a draft (or a version returned for changes). Active, reviewed and withdrawn versions are never edited. */
legalAdminRoutes.patch('/rules/:id', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const r = await loadRule(db, c.req.param('id'));
  if (r.status !== 'draft') badState(r.status === 'active' ? 'An active rule is never changed: draft a new version instead' : 'Only a draft can be changed');
  const input = await body(c, zRule.partial());
  const cols = ruleColumns(input, r);
  checkDates(cols);
  const before = ruleColumns({}, r);
  const t = now();
  await db.batch([
    db
      .prepare(
        `UPDATE whs_rules SET kind = ?, title = ?, instrument_id = ?, provision = ?, source_url = ?, effective_from = ?, effective_to = ?, body = ?, criteria_json = ?, deadline_minutes = ?, deadline_from = ?, deadline_text = ?,
           required_info_json = ?, site_preservation = ?, responsible_party = ?, procedure_text = ?, retention = ?, regulator = ?, notify_url = ?, change_note = ?, updated_at = ? WHERE id = ? AND status = 'draft'`,
      )
      .bind(cols.kind, cols.title, cols.instrument_id, cols.provision, cols.source_url, cols.effective_from, cols.effective_to, cols.body, cols.criteria_json, cols.deadline_minutes, cols.deadline_from, cols.deadline_text, cols.required_info_json, cols.site_preservation, cols.responsible_party, cols.procedure_text, cols.retention, cols.regulator, cols.notify_url, cols.change_note, t, r.id),
    legalEvent(db, { actorId: user.id, action: 'rule.edited', packId: r.pack_id, entityType: 'rule', entityId: r.id, summary: `"${cols.title}" version ${r.version}: draft changed`, before, after: cols, at: t }),
  ]);
  return c.json(ruleDTO(await loadRule(db, r.id), true));
});

async function step(c: any, from: string[], to: string, extra: { sql: string; args: unknown[] }, summary: (r: any) => string, action: string) {
  const db = c.env.DB as D1Database;
  const user = c.get('user');
  const r = await loadRule(db, c.req.param('id'));
  if (!from.includes(r.status)) badState(`This version is ${WHS_KIND_LABEL(RULE_STATUS, r.status).toLowerCase()}`);
  const t = now();
  const res = await db.batch([
    db.prepare(`UPDATE whs_rules SET status = ?, ${extra.sql}updated_at = ? WHERE id = ? AND status = ?`).bind(to, ...extra.args, t, r.id, r.status),
    legalEvent(db, { actorId: user.id, action, packId: r.pack_id, entityType: 'rule', entityId: r.id, summary: summary(r), before: { status: r.status }, after: { status: to }, at: t }),
    ...(to === 'active' ? [bumpPack(db, r.pack_id, t)] : []),
  ]);
  if (!res[0].meta.changes) badState('This version changed at the same moment: refresh and try again');
  return c.json(ruleDTO(await loadRule(db, r.id), true));
}

legalAdminRoutes.post('/rules/:id/submit', async (c) => {
  const user = c.get('user');
  return step(c, ['draft'], 'in_review', { sql: 'submitted_by = ?, submitted_at = ?, ', args: [user.id, now()] }, (r) => `"${r.title}" version ${r.version} submitted for review`, 'rule.submitted');
});

legalAdminRoutes.post('/rules/:id/review', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const input = await body(c, z.object({ decision: z.enum(['approve', 'return']), notes: zLong(2000).min(3, 'Say what you reviewed') }));
  const r = await loadRule(db, c.req.param('id'));
  const sod = await platformSod(db, user.id, r.drafted_by, 'drafted this version');
  if (input.decision === 'return') return step(c, ['in_review'], 'draft', { sql: 'review_notes = ?, ', args: [input.notes] }, (x) => `"${x.title}" version ${x.version} returned for changes: ${input.notes}`, 'rule.returned');
  return step(c, ['in_review'], 'reviewed', { sql: 'reviewed_by = ?, reviewed_at = ?, review_notes = ?, review_sod = ?, ', args: [user.id, now(), input.notes, sod ? 1 : 0] }, (x) => `"${x.title}" version ${x.version} reviewed${sod ? ' by its own drafter, the only platform administrator (recorded exception)' : ''}`, 'rule.reviewed');
});

/** Activate a reviewed version: it is published to companies. It applies to incidents only once verified. */
legalAdminRoutes.post('/rules/:id/activate', async (c) => {
  const user = c.get('user');
  return step(c, ['reviewed'], 'active', { sql: 'activated_by = ?, activated_at = ?, ', args: [user.id, now()] }, (r) => `"${r.title}" version ${r.version} activated${r.effective_from ? ` from ${r.effective_from}` : ''}${r.verification === 'verified' ? '' : ' (not verified: it applies to no incident yet)'}`, 'rule.activated');
});

legalAdminRoutes.post('/rules/:id/withdraw', async (c) => {
  const user = c.get('user');
  return step(c, ['draft', 'in_review', 'reviewed'], 'withdrawn', { sql: 'withdrawn_by = ?, withdrawn_at = ?, ', args: [user.id, now()] }, (r) => `"${r.title}" version ${r.version} withdrawn`, 'rule.withdrawn');
});

/**
 * Verify a version against the official source: who (the platform administrator), when, the source checked and notes.
 * It needs an effective date. A lone platform administrator verifying what they drafted is the recorded exception.
 */
legalAdminRoutes.post('/rules/:id/verify', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const input = await body(c, zVerify);
  const r = await loadRule(db, c.req.param('id'));
  if (!['reviewed', 'active'].includes(r.status)) badState('Verify a version once it is reviewed or active');
  const from = input.effectiveFrom ?? r.effective_from;
  if (!from || !validDate(from)) throw new HttpError(400, 'Give the date the rule takes effect, from the official source');
  if (r.effective_to && from > r.effective_to) throw new HttpError(400, 'The rule must take effect before it ends');
  // the effective date of an active version is part of its published record: verifying may set it, never move it
  if (r.status === 'active' && r.effective_from && input.effectiveFrom && input.effectiveFrom !== r.effective_from) badState('An active rule’s effective date is not changed: draft a new version with the right date');
  const sod = await platformSod(db, user.id, r.drafted_by, 'drafted this version');
  const t = now();
  await db.batch([
    db
      .prepare("UPDATE whs_rules SET verification = 'verified', verified_by = ?, verified_at = ?, verified_source = ?, verified_notes = ?, verify_sod = ?, effective_from = ?, updated_at = ? WHERE id = ?")
      .bind(user.id, t, input.sourceChecked, input.notes, sod ? 1 : 0, from, t, r.id),
    legalEvent(db, { actorId: user.id, action: 'rule.verified', packId: r.pack_id, entityType: 'rule', entityId: r.id, summary: `"${r.title}" version ${r.version} verified against ${input.sourceChecked}, in effect from ${from}`, before: { verification: r.verification, effective_from: r.effective_from }, after: { verification: 'verified', effective_from: from, source: input.sourceChecked, notes: input.notes, exception: sod }, at: t }),
    bumpPack(db, r.pack_id, t),
  ]);
  return c.json(ruleDTO(await loadRule(db, r.id), true));
});

/** Take back a verification (found wrong or out of date): the rule applies to no new evaluation; old ones keep theirs. */
legalAdminRoutes.post('/rules/:id/unverify', async (c) => {
  const db = c.env.DB;
  const user = c.get('user');
  const input = await body(c, z.object({ reason: zLong(1000).min(3, 'Say why') }));
  const r = await loadRule(db, c.req.param('id'));
  if (r.verification !== 'verified') badState('This version is not verified');
  const t = now();
  await db.batch([
    db.prepare("UPDATE whs_rules SET verification = 'not_verified', verified_by = NULL, verified_at = NULL, verify_sod = 0, verified_notes = ?, updated_at = ? WHERE id = ?").bind(`Verification taken back: ${input.reason}`, t, r.id),
    legalEvent(db, { actorId: user.id, action: 'rule.unverified', packId: r.pack_id, entityType: 'rule', entityId: r.id, summary: `"${r.title}" version ${r.version}: verification taken back (${input.reason})`, before: { verification: 'verified', verified_source: r.verified_source }, after: { verification: 'not_verified' }, at: t }),
    bumpPack(db, r.pack_id, t),
  ]);
  return c.json(ruleDTO(await loadRule(db, r.id), true));
});

legalAdminRoutes.get('/overview', async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT p.*, (SELECT COUNT(*) FROM whs_instruments i WHERE i.pack_id = p.id AND i.status <> 'retired') AS instruments,
            (SELECT COUNT(*) FROM whs_instruments i WHERE i.pack_id = p.id AND i.status = 'verified') AS verified_instruments,
            (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active') AS rules,
            (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status = 'active' AND r.verification = 'verified') AS verified_rules,
            (SELECT COUNT(*) FROM whs_rules r WHERE r.pack_id = p.id AND r.status IN ('draft', 'in_review', 'reviewed')) AS open_versions
       FROM whs_packs p ORDER BY p.sort, p.name`,
  ).all<any>();
  return c.json({ packs: rows.results.map((p) => ({ ...packDTO(p), openVersions: Number(p.open_versions ?? 0) })), notice: VERIFY_NOTICE });
});
