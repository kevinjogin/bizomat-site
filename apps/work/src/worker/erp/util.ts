// Shared pieces of the ERP's modules (Releases 1 to 5): fixed lists with their labels, numbering, the history (erp_events),
// list paging, CSV answers and small DTO helpers.

import { z } from 'zod';
import type { Context } from 'hono';
import { HttpError, newId, now, parseJson } from '../lib/util';
import { csvOf } from '../fin/util';

export { zDate, zText, zId, validDate, likeOf, searchText } from '../maintenance/util';

export const PRODUCT_TYPES = ['raw_material', 'component', 'manufactured_part', 'assembly', 'subassembly', 'finished_product', 'purchased_item', 'consumable', 'service'] as const;
export const LIFECYCLE = ['draft', 'active', 'phased_out', 'obsolete'] as const;
export const REVISION_STATUS = ['draft', 'in_change', 'released', 'superseded'] as const;
export const ECR_STATUS = ['submitted', 'under_review', 'approved', 'rejected'] as const;
export const ECO_STATUS = ['draft', 'submitted', 'approved', 'released', 'cancelled'] as const;
export const DOC_KINDS = ['drawing', 'model', 'pdf', 'dxf', 'step', 'specification', 'image', 'other'] as const;
export const DOC_STATUS = ['draft', 'approved', 'obsolete'] as const;
export const SUPPLIER_STATUS = ['pending', 'approved', 'on_hold', 'blocked'] as const;
export const CURRENCY_RE = /^[A-Z]{3}$/;

export const TYPE_LABELS: Record<(typeof PRODUCT_TYPES)[number], string> = {
  raw_material: 'Raw material',
  component: 'Component',
  manufactured_part: 'Manufactured part',
  assembly: 'Assembly',
  subassembly: 'Subassembly',
  finished_product: 'Finished product',
  purchased_item: 'Purchased item',
  consumable: 'Consumable',
  service: 'Service',
};

/** A record number given by hand: letters, digits and . _ / - (up to 40). */
export const NUMBER_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;

// ------------------------------------------------------------------ numbering

const NUMBERING = {
  product: { table: 'erp_products', prefix: 'PRD-', width: 5, counters: 'erp_counters' },
  change_request: { table: 'erp_change_requests', prefix: 'ECR-', width: 4, counters: 'erp_counters' },
  change_order: { table: 'erp_change_orders', prefix: 'ECO-', width: 4, counters: 'erp_counters' },
  supplier: { table: 'erp_suppliers', prefix: 'SUP-', width: 4, counters: 'erp_counters' },
  document: { table: 'erp_documents', prefix: 'DOC-', width: 4, counters: 'erp_counters' },
  // Release 2 (counted in erp_sequences: erp_counters lists Release 1's kinds in a CHECK)
  requisition: { table: 'erp_requisitions', prefix: 'REQ-', width: 5, counters: 'erp_sequences' },
  rfq: { table: 'erp_rfqs', prefix: 'RFQ-', width: 5, counters: 'erp_sequences' },
  purchase_order: { table: 'erp_purchase_orders', prefix: 'PO-', width: 5, counters: 'erp_sequences' },
  receipt: { table: 'erp_receipts', prefix: 'GR-', width: 5, counters: 'erp_sequences' },
  count: { table: 'erp_counts', prefix: 'CNT-', width: 5, counters: 'erp_sequences' },
  adjustment: { table: 'erp_adjustments', prefix: 'ADJ-', width: 5, counters: 'erp_sequences' },
  // Release 3
  manufacturing_order: { table: 'erp_mfg_orders', prefix: 'MO-', width: 5, counters: 'erp_sequences' },
  fg_receipt: { table: 'erp_mo_receipts', prefix: 'FGR-', width: 5, counters: 'erp_sequences' },
  mrp_run: { table: 'erp_mrp_runs', prefix: 'MRP-', width: 5, counters: 'erp_sequences' },
  // Release 4: quality (a plan's versions share its number)
  qc_plan: { table: 'erp_qc_plans', prefix: 'QP-', width: 5, counters: 'erp_sequences' },
  inspection: { table: 'erp_qc_inspections', prefix: 'QI-', width: 5, counters: 'erp_sequences' },
  ncr: { table: 'erp_qc_ncrs', prefix: 'NCR-', width: 5, counters: 'erp_sequences' },
  capa: { table: 'erp_qc_capas', prefix: 'CA-', width: 5, counters: 'erp_sequences' },
  // Release 5: supply chain
  sales_order: { table: 'erp_sales_orders', prefix: 'SO-', width: 5, counters: 'erp_sequences' },
  shipment: { table: 'erp_shipments', prefix: 'SHP-', width: 5, counters: 'erp_sequences' },
  rma: { table: 'erp_rmas', prefix: 'RMA-', width: 5, counters: 'erp_sequences' },
} as const;
export type NumberKind = keyof typeof NUMBERING;

/**
 * The next number of a kind in the company (PRD-00001...), never one already used: the counter first moves past the
 * highest number of that form already in the company (one typed by hand). One statement, so two people creating at the
 * same moment get different numbers.
 */
export async function nextNumber(db: D1Database, companyId: string, kind: NumberKind): Promise<string> {
  const n = NUMBERING[kind];
  const start = n.prefix.length + 1;
  const max = await db
    .prepare(`SELECT MAX(CAST(substr(number, ${start}) AS INTEGER)) AS m FROM ${n.table} WHERE company_id = ? AND number LIKE '${n.prefix}%' AND length(number) > ${n.prefix.length} AND substr(number, ${start}) NOT GLOB '*[^0-9]*'`)
    .bind(companyId)
    .first<{ m: number | null }>();
  const highest = Math.max(0, Math.min(Number(max?.m ?? 0), 1e12));
  const row = await db
    .prepare(`INSERT INTO ${n.counters} (company_id, kind, value) VALUES (?1, ?2, ?3 + 1) ON CONFLICT(company_id, kind) DO UPDATE SET value = MAX(${n.counters}.value, ?3) + 1 RETURNING value`)
    .bind(companyId, kind, highest)
    .first<{ value: number }>();
  return `${n.prefix}${String(Number(row!.value)).padStart(n.width, '0')}`;
}

// ------------------------------------------------------------------ history

export interface ErpEvent {
  companyId: string;
  actorId: string | null;
  action: string;
  entityType:
    | 'product'
    | 'revision'
    | 'bom'
    | 'change_request'
    | 'change_order'
    | 'document'
    | 'supplier'
    | 'role'
    | 'file'
    | 'requisition'
    | 'rfq'
    | 'quotation'
    | 'purchase_order'
    | 'receipt'
    | 'warehouse'
    | 'location'
    | 'stock'
    | 'adjustment'
    | 'count'
    | 'settings'
    | 'integration'
    | 'work_centre'
    | 'machine'
    | 'routing'
    | 'manufacturing_order'
    | 'mps'
    | 'mrp_run'
    | 'qc_plan'
    | 'inspection'
    | 'ncr'
    | 'capa'
    | 'sales_order'
    | 'shipment'
    | 'rma'
    | 'carrier';
  entityId?: string | null;
  productId?: string | null;
  summary: string;
  before?: unknown;
  after?: unknown;
  at?: number;
}

/** One line of history. Never file contents, passwords or tokens. */
export function eventStmt(db: D1Database, e: ErpEvent) {
  return db
    .prepare('INSERT INTO erp_events (id, company_id, actor_id, action, entity_type, entity_id, product_id, summary, before_json, after_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(
      newId(),
      e.companyId,
      e.actorId,
      e.action,
      e.entityType,
      e.entityId ?? null,
      e.productId ?? null,
      e.summary.slice(0, 500),
      e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000),
      e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000),
      e.at ?? now(),
    );
}

/** The same line of history, written only while `guard` (an SQL condition with its own arguments) holds. */
export function eventStmtIf(db: D1Database, e: ErpEvent, guard: string, guardArgs: unknown[]) {
  return db
    .prepare(`INSERT INTO erp_events (id, company_id, actor_id, action, entity_type, entity_id, product_id, summary, before_json, after_json, created_at) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE ${guard}`)
    .bind(
      newId(),
      e.companyId,
      e.actorId,
      e.action,
      e.entityType,
      e.entityId ?? null,
      e.productId ?? null,
      e.summary.slice(0, 500),
      e.before === undefined ? null : JSON.stringify(e.before).slice(0, 8000),
      e.after === undefined ? null : JSON.stringify(e.after).slice(0, 8000),
      e.at ?? now(),
      ...guardArgs,
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

export async function historyOf(db: D1Database, companyId: string, where: { entityType?: string; entityId?: string; productId?: string }, limit = 100) {
  const clauses = ['e.company_id = ?'];
  const args: unknown[] = [companyId];
  if (where.productId) {
    clauses.push('e.product_id = ?');
    args.push(where.productId);
  } else {
    if (where.entityType) {
      clauses.push('e.entity_type = ?');
      args.push(where.entityType);
    }
    if (where.entityId) {
      clauses.push('e.entity_id = ?');
      args.push(where.entityId);
    }
  }
  const rows = await db
    .prepare(`SELECT e.*, u.name AS actor_name FROM erp_events e LEFT JOIN users u ON u.id = e.actor_id WHERE ${clauses.join(' AND ')} ORDER BY e.created_at DESC, e.rowid DESC LIMIT ?`)
    .bind(...args, limit)
    .all<any>();
  return rows.results.map(eventDTO);
}

/** Only the fields that changed, for the history. */
export function changed(before: Record<string, unknown>, after: Record<string, unknown>) {
  const b: Record<string, unknown> = {};
  const a: Record<string, unknown> = {};
  for (const k of Object.keys(after)) {
    if (JSON.stringify(before[k] ?? null) !== JSON.stringify(after[k] ?? null)) {
      b[k] = before[k] ?? null;
      a[k] = after[k] ?? null;
    }
  }
  return { before: b, after: a, any: Object.keys(a).length > 0 };
}

// ------------------------------------------------------------------ lists and CSV

export function paging(c: Context) {
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 50, 1), 500);
  const offset = Math.max(Number(c.req.query('offset')) || 0, 0);
  return { limit, offset };
}

export function wantsCsv(c: Context) {
  return c.req.query('format') === 'csv';
}

export function csvResponse(name: string, rows: unknown[][]) {
  const safe = name.replace(/[^a-z0-9._-]/gi, '-').slice(0, 80);
  return new Response(csvOf(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${safe}.csv"`, 'Cache-Control': 'no-store' } });
}

export const zMoney = z.number().int().min(0).max(1e13).nullable();
export const zCurrency = z.string().trim().toUpperCase().regex(CURRENCY_RE, 'Use a three-letter currency code such as AUD');
export const zQty = z.number().positive().max(1e9);

/** A text field that may be cleared. */
export const zOpt = (max: number) => z.string().trim().max(max).optional();

export function badState(msg: string): never {
  throw new HttpError(409, msg);
}

/** Money in cents shown as dollars for CSV. */
export const dollars = (cents: number | null | undefined) => (cents === null || cents === undefined ? '' : (cents / 100).toFixed(2));
