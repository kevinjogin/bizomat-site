// The ERP's alerts for the modules framework: a person is told in the app (and by email where email is set up on this
// service, never for the example company) when a record waits for their approval, is given to them, is decided, comes
// due, or matches a workflow rule; the 15-minute run sends due-date reminders and escalations once each (erp_object_marks).

import type { Env } from '../../env';
import { newId, now, parseJson } from '../../lib/util';
import { appBase } from '../../services/app-url';
import { emailConfig } from '../../services/email/provider';
import { emailEnv } from '../../services/email/settings';
import { enqueueEmail, processOutbox } from '../../services/email/outbox';
import { companyPeople, type CompanyKind } from '../access';
import { MODULE_BY_KEY, OBJECT_BY_KEY, type ObjectDef, type TransitionDef } from '../../../shared/erp-objects';
import type { RecordRow } from './engine';
import { objAccess } from './engine';

export interface AlertTarget {
  companyId: string;
  kind: CompanyKind;
  companyName: string;
}

export interface AlertInput {
  userIds: (string | null | undefined)[];
  kind: string;
  title: string;
  body?: string;
  link: string;
  recordId?: string | null;
  dedupe: string;
  email?: boolean;
}

export const recordLink = (companyId: string, def: ObjectDef, id: string) => `/c/${companyId}/m/${def.module}/${def.key}/${id}`;

/** Alerts people in the app and, where email is set up and the company is not the example, by email. */
export async function alert(env: Env, co: AlertTarget, n: AlertInput, waitUntil?: (p: Promise<unknown>) => void): Promise<number> {
  const ids = [...new Set(n.userIds.filter((x): x is string => !!x))];
  if (!ids.length) return 0;
  const db = env.DB;
  const t = now();
  const res = await db.batch(
    ids.map((uid) =>
      db
        .prepare('INSERT OR IGNORE INTO erp_alerts (id, company_id, user_id, kind, title, body, link, record_id, dedupe_key, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), co.companyId, uid, n.kind.slice(0, 40), n.title.slice(0, 300), (n.body ?? '').slice(0, 1000), n.link, n.recordId ?? null, `${n.dedupe}:${uid}`.slice(0, 300), t),
    ),
  );
  const made = res.reduce((s, r) => s + (r.meta.changes ?? 0), 0);
  if (!made || n.email === false || co.kind === 'demo') return made;
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
      const r = await enqueueEmail(env, { userId: p.id, to: p.email, toName: p.name, data: { template: 'erp_alert', organisation: co.companyName, title: n.title, body: n.body ?? null, url }, idempotencyKey: `erp:${n.dedupe}:${p.id}`.slice(0, 300), sensitive: true }).catch(() => null);
      if (r?.queued) await db.prepare('UPDATE erp_alerts SET emailed = 1 WHERE company_id = ? AND dedupe_key = ?').bind(co.companyId, `${n.dedupe}:${p.id}`.slice(0, 300)).run();
    }
    await processOutbox(env, { max: 10 }).catch(() => null);
  })();
  if (waitUntil) waitUntil(work);
  else await work;
  return made;
}

/** The people who may approve records of this kind (their ERP roles), for "waiting for approval" alerts. */
export async function approversOf(db: D1Database, co: Pick<AlertTarget, 'companyId' | 'kind'>, def: ObjectDef): Promise<string[]> {
  const people = await companyPeople(db, co);
  return people.filter((p) => objAccess({ roles: p.roles }, def).approve).map((p) => p.id);
}

async function peopleWithRole(db: D1Database, co: Pick<AlertTarget, 'companyId' | 'kind'>, role: string): Promise<string[]> {
  const people = await companyPeople(db, co);
  return people.filter((p) => p.roles.includes(role as never) || (role !== 'erp_admin' && p.roles.includes('erp_admin') && p.companyRole === 'owner')).map((p) => p.id);
}

/** After a step: the people the step names, and the company's workflow rules for the new status. */
export async function afterStepAlerts(env: Env, co: AlertTarget, def: ObjectDef, row: RecordRow, t: TransitionDef, actorId: string, waitUntil?: (p: Promise<unknown>) => void) {
  const status = def.statuses.find((s) => s.key === t.to)?.label ?? t.to;
  const link = recordLink(co.companyId, def, row.id);
  const who: string[] = [];
  for (const n of t.notify ?? []) {
    if (n === 'own' && row.owner_user_id) who.push(row.owner_user_id);
    if (n === 'assignee' && row.assignee_id) who.push(row.assignee_id);
    if (n === 'creator' && row.created_by) who.push(row.created_by);
    if (n === 'approvers') {
      if (row.approver_id) who.push(row.approver_id);
      else who.push(...(await approversOf(env.DB, co, def)));
    }
  }
  const others = who.filter((u) => u !== actorId);
  if (others.length) {
    await alert(env, co, { userIds: others, kind: t.notify?.includes('approvers') ? 'approval' : 'status', title: `${def.label} ${row.number}: ${status}`, body: row.title, link, recordId: row.id, dedupe: `step:${row.id}:${t.key}:${row.status_at}` }, waitUntil);
  }
  await workflowAlerts(env, co, def, row, t.to, actorId, waitUntil);
}

/** The company's active workflow rules for this kind of record and status. */
export async function workflowAlerts(env: Env, co: AlertTarget, def: ObjectDef, row: Pick<RecordRow, 'id' | 'number' | 'title' | 'status_at'>, status: string, actorId: string | null, waitUntil?: (p: Promise<unknown>) => void) {
  const rules = await env.DB.prepare("SELECT id, data_json FROM erp_objects WHERE company_id = ? AND object = 'wf_rule' AND status = 'active' AND archived_at IS NULL AND json_extract(data_json, '$.object') = ? AND json_extract(data_json, '$.status') = ?").bind(co.companyId, def.key, status).all<{ id: string; data_json: string }>();
  for (const r of rules.results) {
    const d = parseJson<Record<string, unknown>>(r.data_json, {});
    const ids: string[] = [];
    if (typeof d.notifyUser === 'string') ids.push(d.notifyUser);
    if (typeof d.notifyRole === 'string') ids.push(...(await peopleWithRole(env.DB, co, d.notifyRole)));
    const to = ids.filter((u) => u !== actorId);
    if (!to.length) continue;
    const label = def.statuses.find((s) => s.key === status)?.label ?? status;
    await alert(env, co, { userIds: to, kind: 'workflow', title: `${def.label} ${row.number}: ${label}`, body: `${row.title}. Workflow rule: ${String(d.name ?? '')}`, link: recordLink(co.companyId, def, row.id), recordId: row.id, dedupe: `wf:${r.id}:${row.id}:${row.status_at}` }, waitUntil);
  }
}

// ------------------------------------------------------------------ the 15-minute run

async function targetOf(db: D1Database, companyId: string): Promise<AlertTarget | null> {
  const reg = await db.prepare('SELECT name FROM co_companies WHERE id = ? AND deleted_at IS NULL').bind(companyId).first<{ name: string }>();
  if (reg) return { companyId, kind: 'registered', companyName: reg.name };
  const demo = await db.prepare("SELECT name FROM sys_demo WHERE company_id = ? AND status IN ('building','ready')").bind(companyId).first<{ name: string }>();
  if (demo) return { companyId, kind: 'demo', companyName: demo.name };
  const own = await db.prepare('SELECT name FROM sys_companies WHERE id = ?').bind(companyId).first<{ name: string }>();
  return own ? { companyId, kind: 'own', companyName: own.name } : null;
}

const sqlList = (xs: readonly string[]) => (xs.length ? xs.map((x) => `'${x.replace(/'/g, '')}'`).join(',') : "''");

/**
 * Due-date reminders (each record once per due date, to its assignee, else its own person, else whoever made it) and
 * workflow escalations (each rule, record and time in the status once). Idempotent: run twice, alert once.
 */
export async function runObjectReminders(env: Env, today: string, at = now()): Promise<{ reminded: number; escalated: number }> {
  const db = env.DB;
  let reminded = 0;
  let escalated = 0;
  const targets = new Map<string, AlertTarget | null>();
  const target = async (id: string) => {
    if (!targets.has(id)) targets.set(id, await targetOf(db, id));
    return targets.get(id)!;
  };
  for (const def of Object.values(OBJECT_BY_KEY)) {
    if (!def.dueField) continue;
    const horizon = new Date(Date.parse(`${today}T00:00:00Z`) + (def.remindDays ?? 0) * 86_400_000).toISOString().slice(0, 10);
    const rows = await db
      .prepare(
        `SELECT e.* FROM erp_objects e WHERE e.object = ? AND e.archived_at IS NULL AND e.due_date IS NOT NULL AND e.due_date <= ? AND e.status NOT IN (${sqlList(def.closed ?? [])})
           AND NOT EXISTS (SELECT 1 FROM erp_object_marks m WHERE m.company_id = e.company_id AND m.record_id = e.id AND m.mark = 'due:' || e.due_date) LIMIT 200`,
      )
      .bind(def.key, horizon)
      .all<RecordRow>();
    for (const r of rows.results) {
      const mark = await db.prepare('INSERT OR IGNORE INTO erp_object_marks (company_id, record_id, mark, created_at) VALUES (?, ?, ?, ?)').bind(r.company_id, r.id, `due:${r.due_date}`, at).run();
      if (!mark.meta.changes) continue;
      const co = await target(r.company_id);
      if (!co) continue;
      const overdue = r.due_date! < today;
      const field = def.fields.find((f) => f.key === def.dueField)?.label ?? 'Due';
      reminded += await alert(env, co, {
        userIds: [r.assignee_id ?? r.owner_user_id ?? r.created_by],
        kind: overdue ? 'overdue' : 'due',
        title: `${def.label} ${r.number}: ${field.toLowerCase()} ${overdue ? 'has passed' : r.due_date === today ? 'is today' : `is ${r.due_date}`}`,
        body: r.title,
        link: recordLink(r.company_id, def, r.id),
        recordId: r.id,
        dedupe: `due:${r.id}:${r.due_date}`,
      });
    }
  }
  // escalations of the workflow rules
  const rules = await db.prepare("SELECT e.id, e.company_id, e.data_json FROM erp_objects e WHERE e.object = 'wf_rule' AND e.status = 'active' AND e.archived_at IS NULL AND e.company_id IS NOT NULL LIMIT 500").all<{ id: string; company_id: string; data_json: string }>();
  for (const rule of rules.results) {
    const d = parseJson<Record<string, unknown>>(rule.data_json, {});
    const def = OBJECT_BY_KEY[String(d.object ?? '')];
    const days = Number(d.escalateDays);
    if (!def || !d.escalateRole || !(days > 0)) continue;
    const stale = await db
      .prepare(
        `SELECT e.* FROM erp_objects e WHERE e.company_id = ? AND e.object = ? AND e.status = ? AND e.archived_at IS NULL AND e.status_at < ?
           AND NOT EXISTS (SELECT 1 FROM erp_object_marks m WHERE m.company_id = e.company_id AND m.record_id = e.id AND m.mark = ? || e.status_at) LIMIT 100`,
      )
      .bind(rule.company_id, def.key, String(d.status ?? ''), at - days * 86_400_000, `esc:${rule.id}:`)
      .all<RecordRow>();
    const co = stale.results.length ? await target(rule.company_id) : null;
    if (!co) continue;
    const to = await peopleWithRole(db, co, String(d.escalateRole));
    for (const r of stale.results) {
      const mark = await db.prepare('INSERT OR IGNORE INTO erp_object_marks (company_id, record_id, mark, created_at) VALUES (?, ?, ?, ?)').bind(r.company_id, r.id, `esc:${rule.id}:${r.status_at}`, at).run();
      if (!mark.meta.changes) continue;
      const label = def.statuses.find((s) => s.key === r.status)?.label ?? r.status;
      escalated += await alert(env, co, { userIds: to, kind: 'escalation', title: `Escalated: ${def.label} ${r.number} is still ${label.toLowerCase()} after ${days} days`, body: `${r.title}. Workflow rule: ${String(d.name ?? '')}`, link: recordLink(r.company_id, def, r.id), recordId: r.id, dedupe: `esc:${rule.id}:${r.id}:${r.status_at}` });
    }
  }
  return { reminded, escalated };
}

export const moduleLabel = (key: string) => MODULE_BY_KEY[key]?.label ?? key;
