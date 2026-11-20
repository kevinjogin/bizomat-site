// Saving and moving the modules framework's records: one place that checks access, fields, references and domain rules,
// numbers new records, writes the row, its lines, its references and its history in one transaction (guarded by a write
// token, so two saves at once never mix), and takes workflow steps with segregation of duties.

import type { Env } from '../../env';
import { HttpError, newId, now, parseJson } from '../../lib/util';
import { segregationOf, type ErpAccess } from '../access';
import { changed, eventStmt } from '../util';
import { checkRef } from './refs';
import { afterStep, beforeStep, compute, getObj, vehicleOdometerStmt, type HookCtx } from './hooks';
import { afterStepAlerts, alert, recordLink, type AlertTarget } from './alerts';
import {
  defOf,
  isEditable,
  lineAmount,
  loadRow,
  mayEdit,
  mayStep,
  mergeData,
  nextObjNumber,
  objAccess,
  parseLines,
  relation,
  requireFields,
  searchOf,
  sensitiveEditable,
  titleOf,
  type Data,
  type Line,
  type ObjAccess,
  type RecordRow,
} from './engine';
import type { FieldDef, ObjectDef } from '../../../shared/erp-objects';

export type User = { id: string; name: string };

export const todayUtc = () => new Date().toISOString().slice(0, 10);

export async function linesOf(db: D1Database, companyId: string, recordId: string): Promise<Line[]> {
  const rows = await db.prepare('SELECT data_json FROM erp_object_lines WHERE company_id = ? AND record_id = ? ORDER BY position').bind(companyId, recordId).all<{ data_json: string }>();
  return rows.results.map((r) => parseJson<Line>(r.data_json, {}));
}

async function refLabels(db: D1Database, companyId: string, recordId: string): Promise<Record<string, string>> {
  const rows = await db.prepare('SELECT field, label FROM erp_object_refs WHERE company_id = ? AND record_id = ?').bind(companyId, recordId).all<{ field: string; label: string }>();
  return Object.fromEntries(rows.results.map((r) => [r.field, r.label]));
}

/** The person a record belongs to: a user field, or the own person of the record it names (an employee's account). */
async function ownerOf(db: D1Database, companyId: string, def: ObjectDef, data: Data): Promise<string | null> {
  if (!def.ownField) return null;
  const f = def.fields.find((x) => x.key === def.ownField)!;
  const v = data[def.ownField];
  if (typeof v !== 'string' || !v) return null;
  if (f.ref === 'user') return v;
  const target = await getObj(db, companyId, f.ref!.slice(4), v);
  return target ? (target.row.owner_user_id ?? target.row.assignee_id ?? null) : null;
}

/** What the history keeps of a change: sensitive fields are named, never their values. */
function redact(def: ObjectDef, d: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(d)) out[k] = def.fields.find((f) => f.key === k)?.sensitive ? '(changed)' : v;
  return out;
}

export interface SaveOptions {
  id?: string;
  input: Data;
  lines?: unknown;
  version?: number;
  /** A step of the system (an action of another record): access was checked by the caller. */
  system?: boolean;
  /** Status for a new record made by an action (default: the definition's initial status). */
  status?: string;
  extra?: D1PreparedStatement[];
}

export async function saveRecord(env: Env, a: ErpAccess, user: User, def: ObjectDef, o: SaveOptions): Promise<RecordRow> {
  const db = env.DB;
  const x = objAccess(a, def);
  const before = o.id ? await loadRow(db, a.companyId, def, o.id) : null;
  if (before && !o.system) {
    if (!relation(x, before, a.userId).sees) throw new HttpError(404, `${def.label} not found`);
    if (!mayEdit(x, before, a.userId)) throw new HttpError(before.archived_at || !isEditable(def, before.status) ? 409 : 403, before.archived_at ? 'This record is archived' : !isEditable(def, before.status) ? `A ${def.label.toLowerCase()} that is ${def.statuses.find((s) => s.key === before.status)?.label.toLowerCase() ?? before.status} can no longer be changed` : 'You may not change this record');
    if (o.version !== undefined && o.version !== before.version) throw new HttpError(409, 'Someone changed this record since you opened it: reload it and try again');
  }
  if (!before && !o.system && !x.edit && !x.self) throw new HttpError(403, `Your ERP roles do not let you add ${def.plural.toLowerCase()}`);
  if (!before && def.noCreate && !o.system) throw new HttpError(400, `${def.plural} are made from another record`);
  const beforeData = before ? parseJson<Data>(before.data_json, {}) : null;
  const canSet = (f: FieldDef) => o.system || sensitiveEditable(x, a, f);
  const data = mergeData(def, o.input ?? {}, beforeData, canSet);
  const beforeLines = before && def.lines ? await linesOf(db, a.companyId, before.id) : null;
  let lines: Line[] | null = def.lines ? (beforeLines ?? []) : null;
  // lines worked out by the server (revenue schedules, commission statements): never typed
  const computedLines = !!def.lines?.editableIn && def.lines.editableIn.length === 0;
  if (o.lines !== undefined && !(computedLines && !o.system)) {
    if (!def.lines) throw new HttpError(400, `${def.plural} have no lines`);
    const status = before?.status ?? o.status ?? def.initial;
    const editableIn = def.lines.editableIn ?? def.editable ?? def.statuses.map((s) => s.key).filter((s) => !(def.closed ?? []).includes(s));
    if (!o.system && !editableIn.includes(status)) throw new HttpError(409, `The ${def.lines.label.toLowerCase()} can no longer be changed`);
    lines = parseLines(def, o.lines);
  }
  // references: new or changed ones are checked; unchanged ones keep their label
  const oldLabels = before ? await refLabels(db, a.companyId, before.id) : {};
  const labels: Record<string, string> = {};
  for (const f of def.fields) {
    if (f.type !== 'ref') continue;
    const v = data[f.key];
    if (typeof v !== 'string' || !v) continue;
    labels[f.key] = beforeData && beforeData[f.key] === v && oldLabels[f.key] !== undefined ? oldLabels[f.key] : f.computed ? (oldLabels[f.key] ?? (await checkRef(db, a, user, f.ref!, v, f.label).catch(() => ''))) : await checkRef(db, a, user, f.ref!, v, f.label);
  }
  const lineLabels: Record<string, string> = {};
  if (lines && def.lines) {
    const cache = new Map<string, string>();
    for (let i = 0; i < lines.length; i++) {
      for (const f of def.lines.fields) {
        if (f.type !== 'ref') continue;
        const v = lines[i][f.key];
        if (typeof v !== 'string' || !v) continue;
        const ck = `${f.ref}:${v}`;
        if (!cache.has(ck)) {
          const prev = beforeLines?.findIndex((b) => b[f.key] === v) ?? -1;
          cache.set(ck, prev >= 0 && oldLabels[`line:${prev}:${f.key}`] !== undefined ? oldLabels[`line:${prev}:${f.key}`] : await checkRef(db, a, user, f.ref!, v, `${def.lines.label} ${i + 1}: ${f.label}`));
        }
        lineLabels[`line:${i}:${f.key}`] = cache.get(ck)!;
      }
    }
  }
  const id = before?.id ?? newId();
  const ctx: HookCtx = { env, db, a, user, def, x, data, lines, beforeLines, before, labels, today: todayUtc(), recordId: id };
  await compute(ctx);
  lines = ctx.lines;
  // computed references (an approver from the employee's manager, a salesperson from the plan) get their labels
  for (const f of def.fields) {
    if (f.type !== 'ref' || !f.computed) continue;
    const v = ctx.data[f.key];
    if (typeof v === 'string' && v && labels[f.key] === undefined) labels[f.key] = await checkRef(db, a, user, f.ref!, v, f.label).catch(() => '');
  }
  requireFields(def, ctx.data);
  const owner = await ownerOf(db, a.companyId, def, ctx.data);
  const reviewer = !!before && def.key === 'pf_review' && before.approver_id === a.userId;
  if (!o.system && !x.edit && !reviewer) {
    // self service: only for themselves
    const mineNow = owner === a.userId;
    if (!mineNow) throw new HttpError(403, def.ownField ? `You can only add or change your own ${def.plural.toLowerCase()}` : 'You may not change this record');
  }
  const assignee = def.assigneeField ? ((ctx.data[def.assigneeField] as string | null) ?? null) : null;
  const approver = def.approveField ? ((ctx.data[def.approveField] as string | null) ?? null) : null;
  const number = before?.number ?? (await nextObjNumber(db, a.companyId, def));
  const title = titleOf(def, ctx.data, labels) || number;
  const search = searchOf(def, number, title, ctx.data, labels);
  const pick = (k: string | undefined) => (k ? (ctx.data[k] ?? null) : null);
  const amount = pick(def.amountField) as number | null;
  const currency = (pick(def.currencyField) as string | null) ?? null;
  const t = now();
  const token = newId();
  const guard = 'EXISTS (SELECT 1 FROM erp_objects g WHERE g.company_id = ? AND g.id = ? AND g.write_token = ?)';
  const stmts: D1PreparedStatement[] = [];
  const dataJson = JSON.stringify(ctx.data);
  if (before) {
    stmts.push(
      db
        .prepare('UPDATE erp_objects SET title = ?, data_json = ?, amount_cents = ?, currency = ?, date = ?, due_date = ?, owner_user_id = ?, assignee_id = ?, approver_id = ?, search = ?, version = version + 1, write_token = ?, updated_at = ? WHERE company_id = ? AND id = ? AND version = ?')
        .bind(title, dataJson, amount, currency, pick(def.dateField), pick(def.dueField), owner, assignee, approver, search, token, t, a.companyId, id, before.version),
    );
  } else {
    stmts.push(
      db
        .prepare('INSERT INTO erp_objects (id, company_id, object, number, title, status, data_json, amount_cents, currency, date, due_date, owner_user_id, assignee_id, approver_id, search, created_by, status_at, version, write_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)')
        .bind(id, a.companyId, def.key, number, title, o.status ?? def.initial, dataJson, amount, currency, pick(def.dateField), pick(def.dueField), owner, assignee, approver, search, a.userId, t, token, t, t),
    );
  }
  if (lines && def.lines) {
    stmts.push(db.prepare(`DELETE FROM erp_object_lines WHERE company_id = ? AND record_id = ? AND ${guard}`).bind(a.companyId, id, a.companyId, id, token));
    lines.forEach((l, i) => stmts.push(db.prepare(`INSERT INTO erp_object_lines (id, company_id, record_id, position, data_json, amount_cents) SELECT ?, ?, ?, ?, ?, ? WHERE ${guard}`).bind(newId(), a.companyId, id, i, JSON.stringify(l), lineAmount(def, l), a.companyId, id, token)));
  }
  stmts.push(db.prepare(`DELETE FROM erp_object_refs WHERE company_id = ? AND record_id = ? AND ${guard}`).bind(a.companyId, id, a.companyId, id, token));
  const refRows: [string, string, string, string][] = [];
  for (const f of def.fields) if (f.type === 'ref' && typeof ctx.data[f.key] === 'string' && ctx.data[f.key]) refRows.push([f.key, f.ref!, ctx.data[f.key] as string, labels[f.key] ?? '']);
  if (lines && def.lines) lines.forEach((l, i) => def.lines!.fields.forEach((f) => f.type === 'ref' && typeof l[f.key] === 'string' && l[f.key] && refRows.push([`line:${i}:${f.key}`, f.ref!, l[f.key] as string, lineLabels[`line:${i}:${f.key}`] ?? ''])));
  for (const [field, kind, target, label] of refRows.slice(0, 2000)) stmts.push(db.prepare(`INSERT OR IGNORE INTO erp_object_refs (company_id, record_id, field, kind, target_id, label) SELECT ?, ?, ?, ?, ?, ? WHERE ${guard}`).bind(a.companyId, id, field, kind, target, label.slice(0, 300), a.companyId, id, token));
  const diff = before ? changed(beforeData ?? {}, ctx.data) : null;
  const linesChanged = o.lines !== undefined && JSON.stringify(beforeLines ?? []) !== JSON.stringify(lines ?? []);
  if (!before || diff?.any || linesChanged) {
    stmts.push(
      eventStmt(db, {
        companyId: a.companyId,
        actorId: a.userId,
        action: before ? 'record.updated' : 'record.created',
        entityType: 'record',
        entityId: id,
        summary: before ? `${def.label} ${number} changed${linesChanged ? ` (${def.lines?.label.toLowerCase()})` : ''}` : `${def.label} ${number} added: ${title}`,
        before: diff ? redact(def, diff.before) : undefined,
        after: diff ? redact(def, diff.after) : redact(def, Object.fromEntries(Object.entries(ctx.data).filter(([, v]) => v !== null))),
        at: t,
      }),
    );
  }
  const odo = vehicleOdometerStmt(db, a.companyId, def, ctx.data);
  if (odo) stmts.push(odo);
  for (const s of o.extra ?? []) stmts.push(s);
  const res = await db.batch(stmts);
  if (before && !res[0].meta.changes) throw new HttpError(409, 'Someone changed this record at the same moment: reload it and try again');
  const row = await loadRow(db, a.companyId, def, id);
  // a newly assigned person is told
  if (assignee && assignee !== a.userId && assignee !== before?.assignee_id) {
    await alert(env, coOf(a), { userIds: [assignee], kind: 'assigned', title: `${def.label} ${row.number} was given to you`, body: row.title, link: recordLink(a.companyId, def, id), recordId: id, dedupe: `assigned:${id}:${assignee}:${row.version}` }).catch(() => 0);
  }
  return row;
}

export const coOf = (a: ErpAccess): AlertTarget => ({ companyId: a.companyId, kind: a.kind, companyName: a.companyName });

/** Takes a workflow step: who may, what it needs, segregation of duties, the domain rule, the history and the alerts. */
export async function takeStep(env: Env, a: ErpAccess, user: User, def: ObjectDef, id: string, stepKey: string, note: string | null, waitUntil?: (p: Promise<unknown>) => void): Promise<RecordRow> {
  const db = env.DB;
  const x = objAccess(a, def);
  const row = await loadRow(db, a.companyId, def, id);
  if (!relation(x, row, a.userId).sees) throw new HttpError(404, `${def.label} not found`);
  const t = def.transitions.find((s) => s.key === stepKey);
  if (!t) throw new HttpError(404, 'Step not found');
  if (row.archived_at) throw new HttpError(409, 'This record is archived');
  if (!t.from.includes(row.status)) throw new HttpError(409, `${t.label} is not possible while it is ${def.statuses.find((s) => s.key === row.status)?.label.toLowerCase() ?? row.status}`);
  if (!mayStep(x, t, row, a.userId)) throw new HttpError(403, t.cap === 'approve' ? `Only the ${def.plural.toLowerCase()}’ approvers can ${t.label.toLowerCase()}` : t.cap === 'own' ? 'Only the person it belongs to, or someone who manages these records, can take this step' : `Your ERP roles do not let you ${t.label.toLowerCase()}`);
  const data = parseJson<Data>(row.data_json, {});
  for (const k of t.requires ?? []) if (data[k] === null || data[k] === undefined || data[k] === '') throw new HttpError(400, `Give ${def.fields.find((f) => f.key === k)?.label.toLowerCase() ?? k} first`);
  const clean = (note ?? '').trim().slice(0, 2000) || null;
  if (t.note === 'required' && !clean) throw new HttpError(400, 'Give the reason');
  let sod = false;
  if (t.segregation) sod = segregationOf(a, [[row.created_by, `made this ${def.label.toLowerCase()}`], [row.owner_user_id, `are the person this ${def.label.toLowerCase()} is for`]], t.label.toLowerCase());
  const lines = def.lines ? await linesOf(db, a.companyId, id) : null;
  const ctx = { env, db, a, user, def, x, data, lines, beforeLines: lines, before: row, labels: await refLabels(db, a.companyId, id), today: todayUtc(), recordId: id, t, row, note: clean };
  await beforeStep(ctx);
  const extra = await afterStep(ctx);
  const at = now();
  const approving = t.cap === 'approve';
  const from = def.statuses.find((s) => s.key === row.status)?.label ?? row.status;
  const to = def.statuses.find((s) => s.key === t.to)?.label ?? t.to;
  const res = await db.batch([
    db
      .prepare(`UPDATE erp_objects SET status = ?, status_at = ?, data_json = ?, version = version + 1, updated_at = ?${approving ? ', approved_by = ?, approved_at = ?, sod_exception = ?' : ''} WHERE company_id = ? AND id = ? AND status = ? AND version = ?`)
      .bind(t.to, at, JSON.stringify(ctx.data), at, ...(approving ? [a.userId, at, sod ? 1 : 0] : []), a.companyId, id, row.status, row.version),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: `record.${t.key}`,
      entityType: 'record',
      entityId: id,
      summary: `${def.label} ${row.number}: ${t.label} (${from} to ${to})${sod ? ', alone in the company: the segregation exception is recorded' : ''}${clean ? `. ${clean}` : ''}`.slice(0, 500),
      before: { status: row.status },
      after: { status: t.to, ...(clean ? { note: clean } : {}), ...(sod ? { sodException: true } : {}) },
      at,
    }),
    ...extra,
  ]);
  if (!res[0].meta.changes) throw new HttpError(409, 'Someone changed this record at the same moment: reload it and try again');
  const next = await loadRow(db, a.companyId, def, id);
  await afterStepAlerts(env, coOf(a), def, next, t, a.userId, waitUntil).catch(() => undefined);
  return next;
}

/** Sets a record's status directly (an action's result, such as hired or invoiced), with its history line. */
export function statusStmts(db: D1Database, a: ErpAccess, def: ObjectDef, row: RecordRow, to: string, summary: string, data?: Data) {
  const at = now();
  return [
    db.prepare('UPDATE erp_objects SET status = ?, status_at = ?, data_json = COALESCE(?, data_json), version = version + 1, updated_at = ? WHERE company_id = ? AND id = ? AND status = ?').bind(to, at, data ? JSON.stringify(data) : null, at, a.companyId, row.id, row.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'record.status', entityType: 'record', entityId: row.id, summary: summary.slice(0, 500), before: { status: row.status }, after: { status: to }, at }),
  ];
}

/** Removes a record: a draft nobody refers to is deleted; anything else is archived (kept for the history). */
export async function removeRecord(db: D1Database, a: ErpAccess, def: ObjectDef, id: string, archive: boolean) {
  const x = objAccess(a, def);
  const row = await loadRow(db, a.companyId, def, id);
  const rel = relation(x, row, a.userId);
  if (!rel.sees) throw new HttpError(404, `${def.label} not found`);
  if (!x.edit && !(x.self && rel.own && row.status === def.initial)) throw new HttpError(403, `Your ERP roles do not let you remove ${def.plural.toLowerCase()}`);
  const at = now();
  if (!archive) {
    if (row.status !== def.initial) throw new HttpError(409, `Only a ${def.label.toLowerCase()} still ${def.statuses.find((s) => s.key === def.initial)?.label.toLowerCase()} can be deleted: archive it instead`);
    const used = await db.prepare("SELECT COUNT(*) AS n FROM erp_object_refs WHERE company_id = ? AND kind = ? AND target_id = ?").bind(a.companyId, `obj:${def.key}`, id).first<{ n: number }>();
    if (Number(used?.n) > 0) throw new HttpError(409, `Other records refer to this ${def.label.toLowerCase()}: archive it instead`);
    await db.batch([
      db.prepare('DELETE FROM erp_objects WHERE company_id = ? AND id = ?').bind(a.companyId, id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'record.deleted', entityType: 'record', entityId: id, summary: `${def.label} ${row.number} deleted: ${row.title}`, at }),
    ]);
    return null;
  }
  await db.batch([
    db.prepare('UPDATE erp_objects SET archived_at = CASE WHEN ? THEN ? ELSE NULL END, version = version + 1, updated_at = ? WHERE company_id = ? AND id = ?').bind(archive ? 1 : 0, at, at, a.companyId, id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'record.archived', entityType: 'record', entityId: id, summary: `${def.label} ${row.number} archived`, at }),
  ]);
  return loadRow(db, a.companyId, def, id);
}

export async function unarchiveRecord(db: D1Database, a: ErpAccess, def: ObjectDef, id: string) {
  const x = objAccess(a, def);
  if (!x.edit) throw new HttpError(403, `Your ERP roles do not let you restore ${def.plural.toLowerCase()}`);
  const row = await loadRow(db, a.companyId, def, id);
  const at = now();
  await db.batch([
    db.prepare('UPDATE erp_objects SET archived_at = NULL, version = version + 1, updated_at = ? WHERE company_id = ? AND id = ?').bind(at, a.companyId, id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'record.restored', entityType: 'record', entityId: id, summary: `${def.label} ${row.number} restored`, at }),
  ]);
  return loadRow(db, a.companyId, def, id);
}

export { defOf, objAccess, type ObjAccess };
