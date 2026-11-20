// The modules framework's engine on the server: who may do what with a kind of record, checking fields against the
// definitions, numbering, titles and search text, and the record as each person may see it (sensitive fields only for
// their roles and the person themselves). Routes: routes.ts; domain rules: hooks.ts and actions.ts.

import { HttpError, notFound, parseJson } from '../../lib/util';
import type { ErpAccess } from '../access';
import { OBJECT_BY_KEY, titleFields, type FieldDef, type ObjectDef, type TransitionDef } from '../../../shared/erp-objects';

// ------------------------------------------------------------------ access

export interface ObjAccess {
  def: ObjectDef;
  /** Reads every record of this kind. */
  view: boolean;
  /** Creates and changes every record of this kind (in its editable statuses). */
  edit: boolean;
  /** Takes approval steps on every record of this kind. */
  approve: boolean;
  /** Creates records for themselves and works on their own (self service). */
  self: boolean;
  admin: boolean;
}

const hasRole = (a: Pick<ErpAccess, 'roles'>, roles: readonly string[] | undefined) => !!roles && roles.some((r) => r === '*' || a.roles.includes(r as never));

export function objAccess(a: Pick<ErpAccess, 'roles'>, def: ObjectDef): ObjAccess {
  const admin = a.roles.includes('erp_admin');
  const edit = admin || hasRole(a, def.access.edit);
  const approve = admin || hasRole(a, def.access.approve ?? def.access.edit);
  const view = admin || edit || approve || hasRole(a, def.access.view);
  return { def, view, edit, approve, self: !!def.access.selfService, admin };
}

/** Whether the person can reach this kind of record at all (to read every one, or their own). */
export const reachable = (x: ObjAccess) => x.view || x.self || !!x.def.ownField || !!x.def.assigneeField || !!x.def.approveField;

/** The SQL limiting a list to what the person may see (alias e = erp_objects). */
export function visibleSql(x: ObjAccess, userId: string): { all: boolean; sql: string; args: unknown[] } {
  if (x.view) return { all: true, sql: '1', args: [] };
  return { all: false, sql: '(e.owner_user_id = ? OR e.assignee_id = ? OR e.approver_id = ?)', args: [userId, userId, userId] };
}

export interface RecordRow {
  id: string;
  company_id: string;
  object: string;
  number: string;
  title: string;
  status: string;
  data_json: string;
  amount_cents: number | null;
  currency: string | null;
  date: string | null;
  due_date: string | null;
  owner_user_id: string | null;
  assignee_id: string | null;
  approver_id: string | null;
  created_by: string | null;
  approved_by: string | null;
  approved_at: number | null;
  sod_exception: number;
  status_at: number;
  version: number;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
}

/** The person's relation to one record. */
export function relation(x: ObjAccess, r: Pick<RecordRow, 'owner_user_id' | 'assignee_id' | 'approver_id'>, userId: string) {
  const own = !!r.owner_user_id && r.owner_user_id === userId;
  const assigned = !!r.assignee_id && r.assignee_id === userId;
  const approver = !!r.approver_id && r.approver_id === userId;
  return { own, assigned, approver, sees: x.view || own || assigned || approver };
}

export const isEditable = (def: ObjectDef, status: string) => (def.editable ? def.editable.includes(status) : !(def.closed ?? []).includes(status));

/** May the person change this record's fields? */
export function mayEdit(x: ObjAccess, r: RecordRow, userId: string): boolean {
  if (r.archived_at || !isEditable(x.def, r.status)) return false;
  if (x.edit) return true;
  const rel = relation(x, r, userId);
  // self service: their own record while it is still theirs to change
  if (x.self && rel.own) return true;
  // a performance review: the person rates themselves during their self assessment, the reviewer records their ratings
  return x.def.key === 'pf_review' && (rel.approver || (rel.own && r.status === 'self_assessment'));
}

/** May the person take this step on this record? (Segregation of duties is checked when it is taken.) */
export function mayStep(x: ObjAccess, t: TransitionDef, r: RecordRow, userId: string): boolean {
  if (r.archived_at || !t.from.includes(r.status)) return false;
  const rel = relation(x, r, userId);
  if (t.cap === 'edit') return x.edit;
  if (t.cap === 'own') return x.edit || rel.own || (rel.assigned && x.def.ownField === x.def.assigneeField);
  return x.approve || rel.approver;
}

export function sensitiveVisible(x: ObjAccess, a: Pick<ErpAccess, 'roles'>, f: FieldDef, own: boolean): boolean {
  if (!f.sensitive) return true;
  return x.admin || own || hasRole(a, f.sensitive);
}

export function sensitiveEditable(x: ObjAccess, a: Pick<ErpAccess, 'roles'>, f: FieldDef): boolean {
  if (!f.sensitive) return true;
  return x.admin || hasRole(a, f.sensitive);
}

// ------------------------------------------------------------------ fields

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function fail(f: FieldDef, msg: string): never {
  throw new HttpError(400, `${f.label}: ${msg}`, { field: f.key });
}

/** One value checked against its field (null when empty). Numbers may arrive as text (CSV import). */
export function parseValue(f: FieldDef, v: unknown): unknown {
  if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) return null;
  switch (f.type) {
    case 'text':
    case 'textarea':
    case 'phone': {
      if (typeof v !== 'string' && typeof v !== 'number') fail(f, 'give text');
      const s = String(v).trim();
      const max = f.max ?? (f.type === 'textarea' ? 5000 : 200);
      if (s.length > max) fail(f, `at most ${max} characters`);
      if (f.type === 'phone' && !/^[0-9+()\s.\-x]{3,40}$/i.test(s)) fail(f, 'give a phone number');
      return s;
    }
    case 'email': {
      const s = String(v).trim().toLowerCase();
      if (s.length > 320 || !EMAIL_RE.test(s)) fail(f, 'give a valid email address');
      return s;
    }
    case 'url': {
      const s = String(v).trim();
      if (s.length > 300 || !/^https?:\/\/[^\s]+$/i.test(s)) fail(f, 'a web address starts with https://');
      return s;
    }
    case 'number':
    case 'percent':
    case 'integer':
    case 'money': {
      const n = typeof v === 'number' ? v : Number(String(v).replace(/[, ]/g, ''));
      if (!Number.isFinite(n)) fail(f, 'give a number');
      const min = f.min ?? 0;
      const max = f.max ?? (f.type === 'money' ? 1e13 : f.type === 'percent' ? 100 : 1e9);
      if (n < min) fail(f, `at least ${f.type === 'money' ? (min / 100).toFixed(2) : min}`);
      if (n > max) fail(f, `at most ${f.type === 'money' ? (max / 100).toFixed(2) : max}`);
      if ((f.type === 'integer' || f.type === 'money') && !Number.isInteger(n)) fail(f, f.type === 'money' ? 'give whole cents' : 'give a whole number');
      return f.type === 'integer' || f.type === 'money' ? n : Math.round(n * 1e6) / 1e6;
    }
    case 'date': {
      const s = String(v).trim();
      if (!validDate(s)) fail(f, 'use a date like 2026-11-20');
      return s;
    }
    case 'time': {
      const s = String(v).trim();
      if (!TIME_RE.test(s)) fail(f, 'use a time like 09:30');
      return s;
    }
    case 'select': {
      const s = String(v).trim();
      if (!f.options || !Object.hasOwn(f.options, s)) fail(f, 'choose one of the options');
      return s;
    }
    case 'bool': {
      if (typeof v === 'boolean') return v;
      const s = String(v).trim().toLowerCase();
      if (['yes', 'true', '1', 'y'].includes(s)) return true;
      if (['no', 'false', '0', 'n'].includes(s)) return false;
      return fail(f, 'yes or no');
    }
    case 'currency': {
      const s = String(v).trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(s)) fail(f, 'a three-letter currency code such as AUD');
      return s;
    }
    case 'country': {
      const s = String(v).trim().toUpperCase();
      if (!/^[A-Z]{2}$/.test(s)) fail(f, 'a two-letter country code such as AU');
      return s;
    }
    case 'ref': {
      const s = String(v).trim();
      if (s.length > 140 || !/^[A-Za-z0-9:_-]+$/.test(s)) fail(f, 'choose one from the list');
      return s;
    }
  }
}

export type Data = Record<string, unknown>;

/**
 * The record's fields after a change: given values are checked (computed fields and sensitive fields the person may not
 * change are ignored), the rest kept. Defaults fill a new record.
 */
export function mergeData(def: ObjectDef, input: Data, before: Data | null, canSet: (f: FieldDef) => boolean): Data {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new HttpError(400, 'Give the record’s fields');
  const out: Data = { ...(before ?? {}) };
  for (const f of def.fields) {
    if (f.computed) continue;
    if (Object.hasOwn(input, f.key)) {
      if (!canSet(f)) continue;
      out[f.key] = parseValue(f, input[f.key]);
    } else if (!before && f.default !== undefined) out[f.key] = f.default;
  }
  for (const k of Object.keys(input)) if (!def.fields.some((f) => f.key === k)) throw new HttpError(400, `Unknown field ${k.slice(0, 40)}`);
  // a field that applies only to some choices is cleared when it does not apply
  for (const f of def.fields) if (f.showIf && !f.showIf.is.includes(String(out[f.showIf.field] ?? ''))) out[f.key] = null;
  return out;
}

export function requireFields(def: ObjectDef, data: Data) {
  for (const f of def.fields) if (f.required && !f.computed && (data[f.key] === null || data[f.key] === undefined)) throw new HttpError(400, `${f.label} is required`, { field: f.key });
}

export type Line = Data;

export function parseLines(def: ObjectDef, lines: unknown): Line[] {
  const ld = def.lines;
  if (!ld) throw new HttpError(400, `${def.plural} have no lines`);
  if (!Array.isArray(lines)) throw new HttpError(400, `Give the ${ld.label.toLowerCase()} as a list`);
  const max = ld.max ?? 500;
  if (lines.length > max) throw new HttpError(400, `At most ${max} ${ld.label.toLowerCase()}`);
  return lines.map((raw, i) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new HttpError(400, `${ld.label} ${i + 1}: give its fields`);
    const out: Line = {};
    for (const f of ld.fields) {
      try {
        out[f.key] = Object.hasOwn(raw, f.key) && !f.computed ? parseValue(f, (raw as Data)[f.key]) : f.computed ? ((raw as Data)[f.key] ?? null) : (f.default ?? null);
      } catch (e) {
        if (e instanceof HttpError) throw new HttpError(400, `${ld.label} ${i + 1}: ${e.message}`);
        throw e;
      }
      if (f.required && !f.computed && (out[f.key] === null || out[f.key] === undefined)) throw new HttpError(400, `${ld.label} ${i + 1}: ${f.label} is required`);
    }
    return out;
  });
}

export function lineAmount(def: ObjectDef, l: Line): number | null {
  const am = def.lines?.amount;
  if (!am) return null;
  const price = Number(l[am.price] ?? 0);
  const qty = am.qty ? Number(l[am.qty] ?? 0) : 1;
  if (!Number.isFinite(price) || !Number.isFinite(qty)) return null;
  return Math.round(price * qty);
}

// ------------------------------------------------------------------ titles, search, numbering

export function titleOf(def: ObjectDef, data: Data, labels: Record<string, string>): string {
  const v = (k: string) => {
    const f = def.fields.find((x) => x.key === k);
    const raw = data[k];
    if (raw === null || raw === undefined) return '';
    if (f?.type === 'ref') return labels[k] ?? '';
    if (f?.type === 'select') return f.options?.[String(raw)] ?? String(raw);
    return String(raw);
  };
  const t = def.title.includes('{') ? def.title.replace(/\{(\w+)\}/g, (_, k) => v(k)) : v(def.title);
  return t.replace(/\s+/g, ' ').trim().slice(0, 300);
}

export function searchOf(def: ObjectDef, number: string, title: string, data: Data, labels: Record<string, string>): string {
  const parts = [number, title];
  for (const f of def.fields) {
    if (f.sensitive) continue;
    const raw = data[f.key];
    if (raw === null || raw === undefined) continue;
    if (f.type === 'ref') parts.push(labels[f.key] ?? '');
    else if (f.type === 'select') parts.push(f.options?.[String(raw)] ?? '');
    else if (['text', 'email', 'phone', 'textarea'].includes(f.type)) parts.push(String(raw).slice(0, 300));
  }
  return parts.join(' ').toLowerCase().slice(0, 3000);
}

/** The next number of a kind in the company (EMP-00001...), never one already used. One statement, so never twice. */
export async function nextObjNumber(db: D1Database, companyId: string, def: ObjectDef): Promise<string> {
  const prefix = def.prefix;
  const start = prefix.length + 1;
  const max = await db
    .prepare(`SELECT MAX(CAST(substr(number, ${start}) AS INTEGER)) AS m FROM erp_objects WHERE company_id = ? AND object = ? AND number LIKE ? AND length(number) > ${prefix.length} AND substr(number, ${start}) NOT GLOB '*[^0-9]*'`)
    .bind(companyId, def.key, `${prefix}%`)
    .first<{ m: number | null }>();
  const highest = Math.max(0, Math.min(Number(max?.m ?? 0), 1e12));
  const row = await db
    .prepare('INSERT INTO erp_sequences (company_id, kind, value) VALUES (?1, ?2, ?3 + 1) ON CONFLICT(company_id, kind) DO UPDATE SET value = MAX(erp_sequences.value, ?3) + 1 RETURNING value')
    .bind(companyId, `obj:${def.key}`, highest)
    .first<{ value: number }>();
  return `${prefix}${String(Number(row!.value)).padStart(5, '0')}`;
}

// ------------------------------------------------------------------ loading and showing

export function defOf(key: string): ObjectDef {
  const d = Object.hasOwn(OBJECT_BY_KEY, key) ? OBJECT_BY_KEY[key] : undefined;
  if (!d) throw notFound('Module');
  return d;
}

export async function loadRow(db: D1Database, companyId: string, def: ObjectDef, id: string): Promise<RecordRow> {
  if (typeof id !== 'string' || !id || id.length > 64) throw notFound(def.label);
  const r = await db.prepare('SELECT * FROM erp_objects WHERE company_id = ? AND object = ? AND id = ?').bind(companyId, def.key, id).first<RecordRow>();
  if (!r) throw notFound(def.label);
  return r;
}

export interface ShownRecord {
  id: string;
  object: string;
  number: string;
  title: string;
  status: string;
  data: Data;
  labels: Record<string, string>;
  amountCents: number | null;
  currency: string | null;
  date: string | null;
  dueDate: string | null;
  ownerId: string | null;
  assigneeId: string | null;
  approverId: string | null;
  createdBy: string | null;
  createdByName?: string | null;
  approvedBy: string | null;
  approvedAt: number | null;
  sodException: boolean;
  statusAt: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
  hidden: string[];
}

/** The record as this person may see it: sensitive fields they may not read are left out (and named in `hidden`). */
export function shown(x: ObjAccess, a: Pick<ErpAccess, 'roles' | 'userId'>, r: RecordRow & { created_by_name?: string | null }, labels: Record<string, string>): ShownRecord {
  const raw = parseJson<Data>(r.data_json, {});
  const own = !!r.owner_user_id && r.owner_user_id === a.userId;
  const data: Data = {};
  const hidden: string[] = [];
  for (const f of x.def.fields) {
    if (!sensitiveVisible(x, a, f, own)) {
      hidden.push(f.key);
      continue;
    }
    data[f.key] = raw[f.key] ?? null;
  }
  const amountHidden = x.def.amountField ? hidden.includes(x.def.amountField) : false;
  return {
    id: r.id,
    object: r.object,
    number: r.number,
    title: r.title,
    status: r.status,
    data,
    labels: Object.fromEntries(Object.entries(labels).filter(([k]) => !hidden.includes(k))),
    amountCents: amountHidden ? null : r.amount_cents,
    currency: r.currency,
    date: r.date,
    dueDate: r.due_date,
    ownerId: r.owner_user_id,
    assigneeId: r.assignee_id,
    approverId: r.approver_id,
    createdBy: r.created_by,
    createdByName: r.created_by_name ?? null,
    approvedBy: r.approved_by,
    approvedAt: r.approved_at,
    sodException: !!r.sod_exception,
    statusAt: r.status_at,
    version: r.version,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    archivedAt: r.archived_at,
    hidden,
  };
}

/** The labels a record keeps for its references (field -> label; lines as line:<n>:<field>). */
export async function labelsOf(db: D1Database, companyId: string, ids: string[]): Promise<Map<string, Record<string, string>>> {
  const out = new Map<string, Record<string, string>>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    if (!chunk.length) continue;
    const rows = await db.prepare(`SELECT record_id, field, label FROM erp_object_refs WHERE company_id = ? AND record_id IN (${chunk.map(() => '?').join(',')})`).bind(companyId, ...chunk).all<{ record_id: string; field: string; label: string }>();
    for (const r of rows.results) {
      const m = out.get(r.record_id) ?? {};
      m[r.field] = r.label;
      out.set(r.record_id, m);
    }
  }
  return out;
}

export { titleFields };
