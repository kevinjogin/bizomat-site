// Shared pieces of Asset Management and Maintenance: the fixed lists, numbering, the history (mt_events), dates and the
// shapes the API returns.

import { z } from 'zod';
import { HttpError, newId, now } from '../lib/util';

export const CRITICALITY = ['low', 'medium', 'high', 'critical'] as const;
export const ASSET_STATUS = ['operating', 'standby', 'under_maintenance', 'out_of_service', 'disposed'] as const;
export const STRATEGY = ['run_to_failure', 'preventive', 'condition_based', 'predictive'] as const;
export const PRIORITY = ['low', 'medium', 'high', 'urgent'] as const;
export const JOB_TYPES = ['corrective', 'preventive', 'breakdown', 'inspection', 'emergency_repair', 'electrical', 'mechanical', 'calibration', 'planned_shutdown', 'general'] as const;
export const WO_STATUS = ['open', 'assigned', 'in_progress', 'on_hold', 'completed', 'closed', 'cancelled'] as const;
export const REQUEST_STATUS = ['submitted', 'awaiting_approval', 'approved', 'declined', 'info_requested', 'converted', 'completed', 'closed'] as const;
export type WoStatus = (typeof WO_STATUS)[number];
export type RequestStatus = (typeof REQUEST_STATUS)[number];

/** Work orders still to be done. */
export const OUTSTANDING: WoStatus[] = ['open', 'assigned', 'in_progress', 'on_hold'];
/** A work order in one of these is locked: no changes until it is reopened. */
export const LOCKED: WoStatus[] = ['completed', 'closed', 'cancelled'];
/** Requests still waiting for a decision or for more information. */
export const OPEN_REQUESTS: RequestStatus[] = ['submitted', 'awaiting_approval', 'approved', 'info_requested'];

export const sqlList = (xs: readonly string[]) => xs.map((x) => `'${x}'`).join(',');
export const PRIORITY_RANK = "CASE {col} WHEN 'urgent' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 ELSE 1 END";

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function validDate(s: string): boolean {
  if (!DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
/** A YYYY-MM-DD date, or null to clear it. */
export const zDate = z.string().trim().refine(validDate, 'Use a date like 2026-11-14').nullable();
export const zText = (max: number) => z.string().trim().max(max);
export const zId = z.string().min(1).max(64);

/** Today as YYYY-MM-DD: the client's own date when it sends a valid one (its time zone), else UTC. */
export function todayFrom(q: string | undefined): string {
  return q && validDate(q) ? q : new Date(now()).toISOString().slice(0, 10);
}

export function searchText(...parts: (string | null | undefined)[]): string {
  return parts
    .filter((p): p is string => !!p)
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

/** LIKE pattern for a search box: lower-cased, without the wildcard characters. */
export const likeOf = (q: string) => `%${q.trim().toLowerCase().replace(/[%_\\]/g, '').slice(0, 100)}%`;

// ------------------------------------------------------------------ numbering

const NUMBERING = {
  asset: { table: 'mt_assets', prefix: 'A-', width: 4 },
  request: { table: 'mt_requests', prefix: 'MR-', width: 4 },
  work_order: { table: 'mt_work_orders', prefix: 'WO-', width: 5 },
} as const;
export type NumberKind = keyof typeof NUMBERING;

/**
 * The next `count` numbers of a kind in the company (A-0001, MR-0001, WO-00001), never one already used: the counter
 * moves past the highest number of that form already in the company (an asset numbered by hand or imported) first.
 */
export async function nextNumbers(db: D1Database, companyId: string, kind: NumberKind, count = 1): Promise<string[]> {
  const n = NUMBERING[kind];
  const start = n.prefix.length + 1;
  const max = await db
    .prepare(`SELECT MAX(CAST(substr(number, ${start}) AS INTEGER)) AS m FROM ${n.table} WHERE company_id = ? AND number LIKE '${n.prefix}%' AND length(number) > ${n.prefix.length} AND substr(number, ${start}) NOT GLOB '*[^0-9]*'`)
    .bind(companyId)
    .first<{ m: number | null }>();
  const highest = Math.max(0, Math.min(Number(max?.m ?? 0), 1e12));
  const row = await db
    .prepare('INSERT INTO mt_counters (company_id, kind, value) VALUES (?1, ?2, ?3 + ?4) ON CONFLICT(company_id, kind) DO UPDATE SET value = MAX(mt_counters.value, ?3) + ?4 RETURNING value')
    .bind(companyId, kind, highest, count)
    .first<{ value: number }>();
  const end = Number(row!.value);
  const out: string[] = [];
  for (let i = end - count + 1; i <= end; i++) out.push(`${n.prefix}${String(i).padStart(n.width, '0')}`);
  return out;
}

export const nextNumber = async (db: D1Database, companyId: string, kind: NumberKind) => (await nextNumbers(db, companyId, kind, 1))[0];

/** An asset number given by hand: letters, digits and . _ / - (up to 40). */
export const ASSET_NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;

// ------------------------------------------------------------------ history

export interface EventInput {
  companyId: string;
  actorId: string | null;
  action: string;
  assetId?: string | null;
  requestId?: string | null;
  workOrderId?: string | null;
  summary: string;
  before?: unknown;
  after?: unknown;
  at?: number;
}

/** One line of history. Never file contents, passwords or tokens. */
export function eventStmt(db: D1Database, e: EventInput) {
  return db
    .prepare('INSERT INTO mt_events (id, company_id, actor_id, action, asset_id, request_id, work_order_id, summary, before_json, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(
      newId(),
      e.companyId,
      e.actorId,
      e.action,
      e.assetId ?? null,
      e.requestId ?? null,
      e.workOrderId ?? null,
      e.summary.slice(0, 500),
      e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000),
      e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000),
      e.at ?? now(),
    );
}

/** The fields that changed, as { before, after } of just those fields. */
export function changes(before: Record<string, unknown>, after: Record<string, unknown>): { before: Record<string, unknown>; after: Record<string, unknown> } | null {
  const b: Record<string, unknown> = {};
  const a: Record<string, unknown> = {};
  for (const k of Object.keys(after)) {
    if (after[k] === undefined) continue;
    if (JSON.stringify(before[k] ?? null) !== JSON.stringify(after[k] ?? null)) {
      b[k] = before[k] ?? null;
      a[k] = after[k] ?? null;
    }
  }
  return Object.keys(a).length ? { before: b, after: a } : null;
}

export function eventDTO(e: any) {
  return {
    id: e.id,
    action: e.action,
    summary: e.summary,
    actorId: e.actor_id,
    actorName: e.actor_name ?? null,
    assetId: e.asset_id,
    requestId: e.request_id,
    workOrderId: e.work_order_id,
    before: e.before_json ? JSON.parse(e.before_json) : null,
    after: e.after_json ? JSON.parse(e.after_json) : null,
    at: e.created_at,
  };
}

// ------------------------------------------------------------------ departments

/** A department given by id must be a live department of this registered company. Returns its name. */
export async function departmentName(db: D1Database, companyId: string, id: string | null | undefined): Promise<string | null> {
  if (!id) return null;
  const r = await db.prepare('SELECT name FROM co_departments WHERE id = ? AND company_id = ? AND archived_at IS NULL').bind(id, companyId).first<{ name: string }>();
  if (!r) throw new HttpError(400, 'Choose a department of this company');
  return r.name;
}

// ------------------------------------------------------------------ files

export function fileDTO(f: any) {
  return {
    id: f.id,
    name: f.name,
    mime: f.mime,
    size: f.size,
    isImage: String(f.mime).startsWith('image/'),
    uploadedBy: f.uploaded_by,
    uploadedByName: f.uploader ?? null,
    createdAt: f.created_at,
    url: `/api/maintenance/c/${f.company_id}/files/${f.id}`,
  };
}

export async function filesOf(db: D1Database, companyId: string, column: 'asset_id' | 'request_id' | 'work_order_id', id: string) {
  const rows = await db
    .prepare(`SELECT f.*, u.name AS uploader FROM mt_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.${column} = ? AND f.deleted_at IS NULL ORDER BY f.created_at DESC LIMIT 200`)
    .bind(companyId, id)
    .all<any>();
  return rows.results.map(fileDTO);
}

export async function commentsOf(db: D1Database, companyId: string, column: 'request_id' | 'work_order_id', id: string) {
  const rows = await db
    .prepare(`SELECT c.*, u.name AS author FROM mt_comments c LEFT JOIN users u ON u.id = c.author_id WHERE c.company_id = ? AND c.${column} = ? ORDER BY c.created_at LIMIT 500`)
    .bind(companyId, id)
    .all<any>();
  return rows.results.map((c) => ({ id: c.id, body: c.body, authorId: c.author_id, authorName: c.author ?? null, at: c.created_at }));
}

export function commentStmt(db: D1Database, e: { companyId: string; requestId?: string; workOrderId?: string; authorId: string; body: string; at?: number }) {
  return db
    .prepare('INSERT INTO mt_comments (id, company_id, request_id, work_order_id, author_id, body, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), e.companyId, e.requestId ?? null, e.workOrderId ?? null, e.authorId, e.body.slice(0, 5000), e.at ?? now());
}
