// BIZOMAT ERP, Release 4 part A: quality management (/api/erp/c/:company/...). Who may do what: access.ts
// (quality.view, quality.plan, quality.plan_release, quality.inspect, quality.raise, quality.disposition, capa.propose,
// capa.approve). Nonconformances and corrective actions: ncr.ts. Reports: quality-reports.ts.
//
// Inspection plans (QP-00001, versions 1, 2, ...): a kind (incoming, first article, in-process, final, supplier,
// product), what they apply to (a product and optionally one of its revisions, a supplier, or an operation of a
// routing), and characteristics: a dimension or measured value with its unit, nominal, tolerance, minimum and maximum,
// an attribute (pass or fail) or a visual check, how many samples to read and whether a photo is needed. Drafted by
// quality managers and engineers, released by a quality manager: releasing a draft supersedes the released version in
// the same transaction; only released versions are used, and a new version starts as a copy.
//
// Inspections (QI-00001), made from a goods receipt line (incoming), an operation of a manufacturing order (in-process),
// a finished-goods receipt (final), a supplier (supplier) or by hand, at most one per receipt line, operation or
// finished-goods receipt (a unique index; starting it twice returns the first). The quality hub offers what waits:
// receipt lines of products marked "inspection required", inspection points of operations in progress, and
// finished-goods receipts of products with a released final plan. The best released plan is found for the source
// (its kind, product, revision, supplier, routing and operation) and its characteristics are copied onto the
// inspection, so a later version never changes a past inspection; without a plan the inspector adds characteristics.
// Readings are recorded per characteristic and sample; the server compares each with the limits (never trusting a
// result from the client), and the inspection's result is worked out when it is completed: passed, or failed when any
// reading is outside its limits or not conforming. A quality manager may accept a failed lot on condition, with a
// reason. On a fail the lot can be put into a quarantine location through the stock service in the same transaction,
// and released after a disposition (ncr.ts) or the conditional acceptance. Completing a full inspection linked to a
// Release 3 inspection point also records the operation's pass or fail, so the operation can complete; Release 3's
// own simple pass or fail keeps working.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { can, companyPeople, requireErp, type ErpAccess } from './access';
import { badState, csvResponse, eventStmt, eventStmtIf, historyOf, likeOf, nextNumber, paging, wantsCsv, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, onceStmt, q6, stockError } from './stock';
import { loadLocation, stockKey } from './inventory';
import { recordFileDTO, recordFiles } from './record-files';
import { isKey, label, todayIso } from './manufacturing';

export const qualityRoutes = new Hono<AppEnv>();

// ------------------------------------------------------------------ fixed lists and their labels

export const PLAN_KINDS = { incoming: 'Incoming', first_article: 'First article', in_process: 'In-process', final: 'Final', supplier: 'Supplier', product: 'Product' } as const;
export const CHAR_KINDS = { dimension: 'Dimension', measured: 'Measured value', attribute: 'Attribute (pass or fail)', visual: 'Visual' } as const;
export const PLAN_STATUS = { draft: 'Draft', released: 'Released', superseded: 'Superseded' } as const;
export const INSPECTION_STATUS = { open: 'Open', completed: 'Completed', cancelled: 'Cancelled' } as const;
export const RESULTS = { passed: 'Passed', failed: 'Failed', conditional: 'Accepted on condition' } as const;
export const INSPECTION_SOURCES = { receipt_line: 'Goods receipt', mo_operation: 'Manufacturing operation', fg_receipt: 'Finished goods', supplier: 'Supplier', manual: 'Made by hand' } as const;

const MEASURED = new Set(['dimension', 'measured']);
const EPS = 1e-9;
const zKey = z.string().trim().min(8).max(80);
const zNum = z.number().finite().min(-1e12).max(1e12);

/** The plan kinds tried for an inspection kind, best first. */
const PLAN_ORDER: Record<string, string[]> = {
  incoming: ['incoming', 'product', 'supplier'],
  in_process: ['in_process', 'product'],
  final: ['final', 'product'],
  first_article: ['first_article', 'product'],
  product: ['product'],
  supplier: ['supplier'],
};

// ------------------------------------------------------------------ characteristics and limits

export interface CharRow {
  kind: string;
  nominal: number | null;
  tolerance: number | null;
  min_value: number | null;
  max_value: number | null;
}

const r9 = (n: number) => Math.round(n * 1e9) / 1e9;

/** The limits a reading is compared with: the minimum and maximum, else the nominal less and plus the tolerance. */
export function limitsOf(c: CharRow): { lower: number | null; upper: number | null } {
  if (!MEASURED.has(c.kind)) return { lower: null, upper: null };
  const n = c.nominal;
  const t = c.tolerance;
  const lower = c.min_value ?? (n !== null && n !== undefined && t !== null && t !== undefined ? r9(n - t) : null);
  const upper = c.max_value ?? (n !== null && n !== undefined && t !== null && t !== undefined ? r9(n + t) : null);
  return { lower, upper };
}

/** Whether a reading conforms: a value inside the limits (measured kinds), or conforming (attributes and visual checks). */
export function readingOk(c: CharRow & { lower_limit?: number | null; upper_limit?: number | null }, value: number | null | undefined, conforming: boolean | null | undefined): boolean {
  if (MEASURED.has(c.kind)) {
    if (value === null || value === undefined || !Number.isFinite(value)) throw new HttpError(400, 'Give the measured value');
    const lo = c.lower_limit !== undefined ? c.lower_limit : limitsOf(c).lower;
    const hi = c.upper_limit !== undefined ? c.upper_limit : limitsOf(c).upper;
    return (lo === null || value >= lo - EPS) && (hi === null || value <= hi + EPS);
  }
  if (conforming === null || conforming === undefined) throw new HttpError(400, 'Say whether it conforms');
  return conforming;
}

const zChar = z.object({
  name: zText(200).min(1, 'Name the characteristic'),
  kind: z.string().max(20),
  unit: zText(20).optional(),
  nominal: zNum.nullable().optional(),
  tolerance: z.number().finite().min(0).max(1e12).nullable().optional(),
  min: zNum.nullable().optional(),
  max: zNum.nullable().optional(),
  sampleSize: z.number().int().min(1).max(200).optional(),
  photoRequired: z.boolean().optional(),
  instructions: zText(1000).optional(),
  position: z.number().int().min(0).max(10000).optional(),
});
type CharIn = z.infer<typeof zChar>;

/** A characteristic checked and normalised: measured kinds need at least one limit; others keep none. */
export function checkChar(x: CharIn) {
  if (!isKey(CHAR_KINDS, x.kind)) throw new HttpError(400, 'Choose a dimension, a measured value, an attribute or a visual check');
  const measured = MEASURED.has(x.kind);
  const row = {
    name: x.name,
    kind: x.kind,
    unit: measured ? (x.unit ?? '') : '',
    nominal: measured ? (x.nominal ?? null) : null,
    tolerance: measured ? (x.tolerance ?? null) : null,
    min_value: measured ? (x.min ?? null) : null,
    max_value: measured ? (x.max ?? null) : null,
    sample_size: x.sampleSize ?? 1,
    photo_required: x.photoRequired ? 1 : 0,
    instructions: x.instructions ?? '',
  };
  if (measured) {
    if (row.tolerance !== null && row.nominal === null) throw new HttpError(400, `${x.name}: a tolerance needs a nominal value`);
    const { lower, upper } = limitsOf(row);
    if (lower === null && upper === null) throw new HttpError(400, `${x.name}: give a minimum, a maximum, or a nominal value with a tolerance`);
    if (lower !== null && upper !== null && lower > upper) throw new HttpError(400, `${x.name}: the minimum is above the maximum`);
  }
  return row;
}

export function charDTO(ch: any) {
  const { lower, upper } = ch.lower_limit !== undefined ? { lower: ch.lower_limit, upper: ch.upper_limit } : limitsOf(ch);
  return {
    id: ch.id,
    position: ch.position,
    name: ch.name,
    kind: ch.kind,
    kindLabel: label(CHAR_KINDS, ch.kind),
    measured: MEASURED.has(ch.kind),
    unit: ch.unit,
    nominal: ch.nominal,
    tolerance: ch.tolerance,
    min: ch.min_value,
    max: ch.max_value,
    lowerLimit: lower,
    upperLimit: upper,
    sampleSize: ch.sample_size,
    photoRequired: !!ch.photo_required,
    instructions: ch.instructions,
  };
}

/** "3 ± 0.15 mm", "2.85 to 3.15 mm", "at least 10 N", "pass or fail". */
export function limitText(ch: ReturnType<typeof charDTO>) {
  if (!ch.measured) return ch.kind === 'visual' ? 'Visual check' : 'Pass or fail';
  const u = ch.unit ? ` ${ch.unit}` : '';
  if (ch.nominal !== null && ch.tolerance !== null && ch.min === null && ch.max === null) return `${ch.nominal} ± ${ch.tolerance}${u}`;
  if (ch.lowerLimit !== null && ch.upperLimit !== null) return `${ch.lowerLimit} to ${ch.upperLimit}${u}`;
  if (ch.lowerLimit !== null) return `at least ${ch.lowerLimit}${u}`;
  return `at most ${ch.upperLimit}${u}`;
}

// ------------------------------------------------------------------ inspection plans

const PLAN_SELECT = `SELECT pl.*, p.number AS product_number, p.name AS product_name, r.label AS revision_label, s.number AS supplier_number, s.legal_name AS supplier_name,
  rt.revision AS routing_revision, rb.name AS released_by_name, cb.name AS created_by_name,
  (SELECT COUNT(*) FROM erp_qc_plan_chars c WHERE c.company_id = pl.company_id AND c.plan_id = pl.id) AS char_count
  FROM erp_qc_plans pl LEFT JOIN erp_products p ON p.company_id = pl.company_id AND p.id = pl.product_id
  LEFT JOIN erp_revisions r ON r.company_id = pl.company_id AND r.id = pl.revision_id
  LEFT JOIN erp_suppliers s ON s.company_id = pl.company_id AND s.id = pl.supplier_id
  LEFT JOIN erp_routings rt ON rt.company_id = pl.company_id AND rt.id = pl.routing_id
  LEFT JOIN users rb ON rb.id = pl.released_by LEFT JOIN users cb ON cb.id = pl.created_by`;

export function planDTO(pl: any) {
  const applies = [
    pl.product_number ? `${pl.product_number} ${pl.product_name}${pl.revision_label ? ` (revision ${pl.revision_label})` : ''}` : '',
    pl.supplier_number ? `supplier ${pl.supplier_number} ${pl.supplier_name}` : '',
    pl.routing_id || pl.op_no ? `operation ${pl.op_no ?? 'any'}${pl.routing_revision ? ` of routing revision ${pl.routing_revision}` : ''}` : '',
  ].filter(Boolean);
  return {
    id: pl.id,
    number: pl.number,
    version: pl.version,
    label: `${pl.number} v${pl.version}`,
    name: pl.name,
    kind: pl.kind,
    kindLabel: label(PLAN_KINDS, pl.kind),
    status: pl.status,
    statusLabel: label(PLAN_STATUS, pl.status),
    description: pl.description,
    productId: pl.product_id,
    productNumber: pl.product_number ?? null,
    productName: pl.product_name ?? null,
    revisionId: pl.revision_id,
    revisionLabel: pl.revision_label ?? null,
    supplierId: pl.supplier_id,
    supplierNumber: pl.supplier_number ?? null,
    supplierName: pl.supplier_name ?? null,
    routingId: pl.routing_id,
    routingRevision: pl.routing_revision ?? null,
    opNo: pl.op_no,
    appliesTo: applies.join('; '),
    characteristics: Number(pl.char_count ?? 0),
    releasedByName: pl.released_by_name ?? null,
    releasedAt: pl.released_at,
    releaseNote: pl.release_note,
    supersededAt: pl.superseded_at,
    createdByName: pl.created_by_name ?? null,
    createdAt: pl.created_at,
    updatedAt: pl.updated_at,
  };
}

async function loadPlan(db: D1Database, companyId: string, id: string) {
  const pl = await db.prepare(`${PLAN_SELECT} WHERE pl.company_id = ? AND pl.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!pl) throw notFound('Inspection plan');
  return pl;
}

async function planChars(db: D1Database, companyId: string, planId: string) {
  const rows = await db.prepare('SELECT * FROM erp_qc_plan_chars WHERE company_id = ? AND plan_id = ? ORDER BY position, rowid').bind(companyId, planId).all<any>();
  return rows.results;
}

const zPlanFields = {
  name: zText(200).min(1, 'Name the plan'),
  kind: z.string().max(30),
  description: zText(4000).optional(),
  productId: zId.nullable().optional(),
  revisionId: zId.nullable().optional(),
  supplierId: zId.nullable().optional(),
  routingId: zId.nullable().optional(),
  opNo: z.number().int().min(1).max(9999).nullable().optional(),
};

/** What a plan applies to, checked: every record is the company's, and the kind has what it needs. */
async function checkApplies(db: D1Database, companyId: string, x: { kind: string; productId?: string | null; revisionId?: string | null; supplierId?: string | null; routingId?: string | null; opNo?: number | null }) {
  if (!isKey(PLAN_KINDS, x.kind)) throw new HttpError(400, 'Choose the kind of inspection: incoming, first article, in-process, final, supplier or product');
  const productId = x.productId || null;
  const supplierId = x.supplierId || null;
  if (x.kind === 'supplier' ? !supplierId : !productId) throw new HttpError(400, x.kind === 'supplier' ? 'A supplier plan names the supplier' : 'Choose the product the plan applies to');
  if (productId) {
    const p = await db.prepare('SELECT id FROM erp_products WHERE company_id = ? AND id = ?').bind(companyId, productId).first();
    if (!p) throw new HttpError(400, 'That product is not in this company');
  }
  if (supplierId) {
    const s = await db.prepare('SELECT id FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(companyId, supplierId).first();
    if (!s) throw new HttpError(400, 'That supplier is not in this company');
  }
  const revisionId = x.revisionId || null;
  if (revisionId) {
    const r = await db.prepare('SELECT id FROM erp_revisions WHERE company_id = ? AND id = ? AND product_id = ?').bind(companyId, revisionId, productId).first();
    if (!r) throw new HttpError(400, 'That revision is not one of the product’s');
  }
  const routingId = x.routingId || null;
  const opNo = x.opNo ?? null;
  if ((routingId || opNo) && x.kind !== 'in_process' && x.kind !== 'first_article') throw new HttpError(400, 'Only in-process and first article plans apply to a routing operation');
  if (routingId) {
    const rt = await db.prepare('SELECT id FROM erp_routings WHERE company_id = ? AND id = ? AND product_id = ?').bind(companyId, routingId, productId).first();
    if (!rt) throw new HttpError(400, 'That routing is not one of the product’s');
    if (opNo) {
      const op = await db.prepare('SELECT id FROM erp_routing_operations WHERE company_id = ? AND routing_id = ? AND op_no = ?').bind(companyId, routingId, opNo).first();
      if (!op) throw new HttpError(400, `The routing has no operation ${opNo}`);
    }
  }
  return { productId, supplierId, revisionId, routingId, opNo };
}

function charInsert(db: D1Database, companyId: string, planId: string, row: ReturnType<typeof checkChar>, position: number) {
  return db
    .prepare('INSERT INTO erp_qc_plan_chars (id, company_id, plan_id, position, name, kind, unit, nominal, tolerance, min_value, max_value, sample_size, photo_required, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(newId(), companyId, planId, position, row.name, row.kind, row.unit, row.nominal, row.tolerance, row.min_value, row.max_value, row.sample_size, row.photo_required, row.instructions);
}

qualityRoutes.get('/c/:company/qc-plans', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['pl.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const status = c.req.query('status');
  if (status === 'current') where.push("pl.status IN ('draft','released')");
  else if (status && isKey(PLAN_STATUS, status)) {
    where.push('pl.status = ?');
    args.push(status);
  }
  for (const [k, col] of [
    ['kind', 'pl.kind'],
    ['productId', 'pl.product_id'],
    ['supplierId', 'pl.supplier_id'],
  ] as const) {
    const v = c.req.query(k);
    if (v) {
      where.push(`${col} = ?`);
      args.push(v);
    }
  }
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('(pl.number LIKE ? OR pl.name LIKE ? OR p.number LIKE ? OR p.name LIKE ? OR s.legal_name LIKE ?)');
    const l = likeOf(q);
    args.push(l, l, l, l, l);
  }
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${PLAN_SELECT} WHERE ${where.join(' AND ')} ORDER BY pl.number COLLATE NOCASE, pl.version DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(planDTO);
  if (csv) return csvResponse('inspection-plans', [['Plan', 'Version', 'Name', 'Kind', 'Status', 'Applies to', 'Characteristics', 'Released'], ...list.map((p) => [p.number, p.version, p.name, p.kindLabel, p.statusLabel, p.appliesTo, p.characteristics, p.releasedAt ? new Date(p.releasedAt).toISOString().slice(0, 10) : ''])]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_qc_plans pl LEFT JOIN erp_products p ON p.company_id = pl.company_id AND p.id = pl.product_id LEFT JOIN erp_suppliers s ON s.company_id = pl.company_id AND s.id = pl.supplier_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ plans: list, total: total?.n ?? 0, limit, offset, kinds: Object.entries(PLAN_KINDS).map(([value, l]) => ({ value, label: l })), can: { edit: can(a, 'quality.plan'), release: can(a, 'quality.plan_release') } });
});

qualityRoutes.post('/c/:company/qc-plans', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const input = await body(c, z.object({ ...zPlanFields, characteristics: z.array(zChar).max(100).optional() }));
  const ap = await checkApplies(db, a.companyId, input);
  const chars = (input.characteristics ?? []).map(checkChar);
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'qc_plan');
  await db.batch([
    db
      .prepare('INSERT INTO erp_qc_plans (id, company_id, number, version, name, kind, status, description, product_id, revision_id, supplier_id, routing_id, op_no, created_by, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, number, input.name, input.kind, 'draft', input.description ?? '', ap.productId, ap.revisionId, ap.supplierId, ap.routingId, ap.opNo, a.userId, t, t),
    ...chars.map((ch, i) => charInsert(db, a.companyId, id, ch, i + 1)),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.created', entityType: 'qc_plan', entityId: id, productId: ap.productId, summary: `Inspection plan ${number} version 1 drafted: ${input.name}`, after: { kind: input.kind, characteristics: chars.length }, at: t }),
  ]);
  return c.json(planDTO(await loadPlan(db, a.companyId, id)), 201);
});

qualityRoutes.get('/c/:company/qc-plans/:id', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const pl = await loadPlan(db, a.companyId, c.req.param('id'));
  const chars = await planChars(db, a.companyId, pl.id);
  const versions = await db.prepare(`${PLAN_SELECT} WHERE pl.company_id = ? AND pl.number = ? ORDER BY pl.version DESC`).bind(a.companyId, pl.number).all<any>();
  const used = await db.prepare("SELECT COUNT(*) AS n FROM erp_qc_inspections WHERE company_id = ? AND plan_id = ? AND status <> 'cancelled'").bind(a.companyId, pl.id).first<{ n: number }>();
  const draftOpen = versions.results.some((v) => v.status === 'draft');
  return c.json({
    plan: planDTO(pl),
    characteristics: chars.map((ch) => {
      const d = charDTO(ch);
      return { ...d, limits: limitText(d) };
    }),
    versions: versions.results.map(planDTO),
    inspections: used?.n ?? 0,
    files: await recordFiles(db, a.companyId, 'qc_plan', pl.id),
    history: await historyOf(db, a.companyId, { entityType: 'qc_plan', entityId: pl.id }),
    can: {
      edit: can(a, 'quality.plan') && pl.status === 'draft',
      release: can(a, 'quality.plan_release') && pl.status === 'draft' && chars.length > 0,
      copy: can(a, 'quality.plan') && pl.status !== 'draft' && !draftOpen,
      remove: can(a, 'quality.plan') && pl.status === 'draft',
    },
  });
});

qualityRoutes.patch('/c/:company/qc-plans/:id', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await loadPlan(db, a.companyId, c.req.param('id'));
  if (pl.status !== 'draft') badState(`${pl.number} version ${pl.version} is ${label(PLAN_STATUS, pl.status).toLowerCase()}: copy it to a new version to change it`);
  const input = await body(c, z.object({ ...zPlanFields, name: zPlanFields.name.optional(), kind: zPlanFields.kind.optional() }));
  const merged = {
    name: input.name ?? pl.name,
    kind: input.kind ?? pl.kind,
    description: input.description ?? pl.description,
    productId: input.productId !== undefined ? input.productId : pl.product_id,
    revisionId: input.revisionId !== undefined ? input.revisionId : pl.revision_id,
    supplierId: input.supplierId !== undefined ? input.supplierId : pl.supplier_id,
    routingId: input.routingId !== undefined ? input.routingId : pl.routing_id,
    opNo: input.opNo !== undefined ? input.opNo : pl.op_no,
  };
  const ap = await checkApplies(db, a.companyId, merged);
  const t = now();
  const res = await db.batch([
    db
      .prepare("UPDATE erp_qc_plans SET name = ?, kind = ?, description = ?, product_id = ?, revision_id = ?, supplier_id = ?, routing_id = ?, op_no = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'")
      .bind(merged.name, merged.kind, merged.description, ap.productId, ap.revisionId, ap.supplierId, ap.routingId, ap.opNo, t, a.companyId, pl.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.updated', entityType: 'qc_plan', entityId: pl.id, productId: ap.productId, summary: `${pl.number} version ${pl.version} changed`, before: { name: pl.name, kind: pl.kind }, after: { name: merged.name, kind: merged.kind }, at: t }, "EXISTS (SELECT 1 FROM erp_qc_plans WHERE company_id = ? AND id = ? AND updated_at = ?)", [a.companyId, pl.id, t]),
  ]);
  if (!res[0].meta.changes) badState('This plan was released or changed at the same moment: reload it');
  return c.json(planDTO(await loadPlan(db, a.companyId, pl.id)));
});

qualityRoutes.delete('/c/:company/qc-plans/:id', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await loadPlan(db, a.companyId, c.req.param('id'));
  if (pl.status !== 'draft') badState('Only a draft can be removed; released and superseded versions are kept');
  const t = now();
  const res = await db.batch([
    db.prepare("DELETE FROM erp_qc_plans WHERE company_id = ? AND id = ? AND status = 'draft' AND NOT EXISTS (SELECT 1 FROM erp_qc_inspections i WHERE i.company_id = erp_qc_plans.company_id AND i.plan_id = erp_qc_plans.id)").bind(a.companyId, pl.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.removed', entityType: 'qc_plan', entityId: pl.id, productId: pl.product_id, summary: `Draft ${pl.number} version ${pl.version} removed`, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This draft changed at the same moment: reload it');
  return c.json({ ok: true });
});

async function draftPlan(db: D1Database, a: ErpAccess, id: string) {
  const pl = await loadPlan(db, a.companyId, id);
  if (pl.status !== 'draft') badState(`${pl.number} version ${pl.version} is ${label(PLAN_STATUS, pl.status).toLowerCase()}: copy it to a new version to change it`);
  return pl;
}

qualityRoutes.post('/c/:company/qc-plans/:id/characteristics', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await draftPlan(db, a, c.req.param('id'));
  const input = await body(c, zChar);
  const row = checkChar(input);
  const max = await db.prepare('SELECT COALESCE(MAX(position), 0) AS m FROM erp_qc_plan_chars WHERE company_id = ? AND plan_id = ?').bind(a.companyId, pl.id).first<{ m: number }>();
  const t = now();
  await db.batch([
    charInsert(db, a.companyId, pl.id, row, input.position ?? Number(max?.m ?? 0) + 1),
    db.prepare('UPDATE erp_qc_plans SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, pl.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.characteristic_added', entityType: 'qc_plan', entityId: pl.id, productId: pl.product_id, summary: `${pl.number} version ${pl.version}: characteristic ${row.name} added`, after: row, at: t }),
  ]);
  return c.json({ ok: true }, 201);
});

qualityRoutes.patch('/c/:company/qc-plans/:id/characteristics/:charId', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await draftPlan(db, a, c.req.param('id'));
  const ch = await db.prepare('SELECT * FROM erp_qc_plan_chars WHERE company_id = ? AND plan_id = ? AND id = ?').bind(a.companyId, pl.id, c.req.param('charId')).first<any>();
  if (!ch) throw notFound('Characteristic');
  const input = await body(c, zChar.partial());
  const merged: CharIn = {
    name: input.name ?? ch.name,
    kind: input.kind ?? ch.kind,
    unit: input.unit ?? ch.unit,
    nominal: input.nominal !== undefined ? input.nominal : ch.nominal,
    tolerance: input.tolerance !== undefined ? input.tolerance : ch.tolerance,
    min: input.min !== undefined ? input.min : ch.min_value,
    max: input.max !== undefined ? input.max : ch.max_value,
    sampleSize: input.sampleSize ?? ch.sample_size,
    photoRequired: input.photoRequired ?? !!ch.photo_required,
    instructions: input.instructions ?? ch.instructions,
  };
  const row = checkChar(merged);
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE erp_qc_plan_chars SET name = ?, kind = ?, unit = ?, nominal = ?, tolerance = ?, min_value = ?, max_value = ?, sample_size = ?, photo_required = ?, instructions = ?, position = ? WHERE company_id = ? AND id = ?')
      .bind(row.name, row.kind, row.unit, row.nominal, row.tolerance, row.min_value, row.max_value, row.sample_size, row.photo_required, row.instructions, input.position ?? ch.position, a.companyId, ch.id),
    db.prepare('UPDATE erp_qc_plans SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, pl.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.characteristic_changed', entityType: 'qc_plan', entityId: pl.id, productId: pl.product_id, summary: `${pl.number} version ${pl.version}: characteristic ${row.name} changed`, before: charDTO(ch), after: row, at: t }),
  ]);
  return c.json({ ok: true });
});

qualityRoutes.delete('/c/:company/qc-plans/:id/characteristics/:charId', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await draftPlan(db, a, c.req.param('id'));
  const ch = await db.prepare('SELECT * FROM erp_qc_plan_chars WHERE company_id = ? AND plan_id = ? AND id = ?').bind(a.companyId, pl.id, c.req.param('charId')).first<any>();
  if (!ch) throw notFound('Characteristic');
  const t = now();
  await db.batch([
    db.prepare('DELETE FROM erp_qc_plan_chars WHERE company_id = ? AND id = ?').bind(a.companyId, ch.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.characteristic_removed', entityType: 'qc_plan', entityId: pl.id, productId: pl.product_id, summary: `${pl.number} version ${pl.version}: characteristic ${ch.name} removed`, at: t }),
  ]);
  return c.json({ ok: true });
});

qualityRoutes.post('/c/:company/qc-plans/:id/release', async (c) => {
  const a = await requireErp(c, 'quality.plan_release');
  const db = c.env.DB;
  const pl = await draftPlan(db, a, c.req.param('id'));
  const input = await body(c, z.object({ note: zText(1000).optional() }));
  const chars = await planChars(db, a.companyId, pl.id);
  if (!chars.length) badState('Add at least one characteristic before releasing the plan');
  const t = now();
  try {
    await db.batch([
      onceStmt(db, a.companyId, `qc-plan-release:${pl.id}`, t),
      db.prepare("UPDATE erp_qc_plans SET status = 'superseded', superseded_at = ?, updated_at = ? WHERE company_id = ? AND number = ? AND status = 'released'").bind(t, t, a.companyId, pl.number),
      db.prepare("UPDATE erp_qc_plans SET status = 'released', released_by = ?, released_at = ?, release_note = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'draft'").bind(a.userId, t, input.note ?? '', t, a.companyId, pl.id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.released', entityType: 'qc_plan', entityId: pl.id, productId: pl.product_id, summary: `${pl.number} version ${pl.version} released${input.note ? `: ${input.note}` : ''}`, after: { status: 'released' }, at: t }),
    ]);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) badState('This plan was released at the same moment by someone else');
    throw e;
  }
  return c.json(planDTO(await loadPlan(db, a.companyId, pl.id)));
});

/** A new draft version of a plan, copied from this version with its characteristics. */
qualityRoutes.post('/c/:company/qc-plans/:id/copy', async (c) => {
  const a = await requireErp(c, 'quality.plan');
  const db = c.env.DB;
  const pl = await loadPlan(db, a.companyId, c.req.param('id'));
  const draft = await db.prepare("SELECT id, version FROM erp_qc_plans WHERE company_id = ? AND number = ? AND status = 'draft'").bind(a.companyId, pl.number).first<{ id: string; version: number }>();
  if (draft) badState(`${pl.number} already has a draft, version ${draft.version}: change that one`);
  const max = await db.prepare('SELECT MAX(version) AS v FROM erp_qc_plans WHERE company_id = ? AND number = ?').bind(a.companyId, pl.number).first<{ v: number }>();
  const version = Number(max?.v ?? pl.version) + 1;
  const chars = await planChars(db, a.companyId, pl.id);
  const id = newId();
  const t = now();
  try {
    await db.batch([
      db
        .prepare('INSERT INTO erp_qc_plans (id, company_id, number, version, name, kind, status, description, product_id, revision_id, supplier_id, routing_id, op_no, copied_from, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(id, a.companyId, pl.number, version, pl.name, pl.kind, 'draft', pl.description, pl.product_id, pl.revision_id, pl.supplier_id, pl.routing_id, pl.op_no, pl.id, a.userId, t, t),
      ...chars.map((ch) =>
        db
          .prepare('INSERT INTO erp_qc_plan_chars (id, company_id, plan_id, position, name, kind, unit, nominal, tolerance, min_value, max_value, sample_size, photo_required, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), a.companyId, id, ch.position, ch.name, ch.kind, ch.unit, ch.nominal, ch.tolerance, ch.min_value, ch.max_value, ch.sample_size, ch.photo_required, ch.instructions),
      ),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'qc_plan.copied', entityType: 'qc_plan', entityId: id, productId: pl.product_id, summary: `${pl.number} version ${version} drafted from version ${pl.version}`, at: t }),
    ]);
  } catch (e) {
    if (/UNIQUE constraint failed/i.test(String((e as Error)?.message ?? e))) badState('Someone started a new version at the same moment: reload');
    throw e;
  }
  return c.json(planDTO(await loadPlan(db, a.companyId, id)), 201);
});

// ------------------------------------------------------------------ choosing a plan for an inspection

interface PlanContext {
  kind: string;
  productId: string | null;
  supplierId: string | null;
  revisionId: string | null;
  routingId: string | null;
  opNo: number | null;
}

/** The best released plan for an inspection: by kind (PLAN_ORDER), then the most specific that applies. */
export async function findPlan(db: D1Database, companyId: string, x: PlanContext): Promise<any | null> {
  if (!x.productId && !x.supplierId) return null;
  const rows = await db
    .prepare("SELECT * FROM erp_qc_plans WHERE company_id = ? AND status = 'released' AND ((product_id IS NOT NULL AND product_id = ?) OR (product_id IS NULL AND supplier_id IS NOT NULL AND supplier_id = ?)) LIMIT 200")
    .bind(companyId, x.productId ?? '', x.supplierId ?? '')
    .all<any>();
  const order = PLAN_ORDER[x.kind] ?? [x.kind];
  let best: any = null;
  let bestScore = -Infinity;
  for (const pl of rows.results) {
    const rank = order.indexOf(pl.kind);
    if (rank < 0) continue;
    const fits = (col: string | number | null, v: string | number | null) => col === null || col === undefined || col === v;
    if (!fits(pl.product_id, x.productId) || !fits(pl.supplier_id, x.supplierId) || !fits(pl.revision_id, x.revisionId) || !fits(pl.routing_id, x.routingId) || !fits(pl.op_no, x.opNo)) continue;
    const specific = [pl.supplier_id, pl.revision_id, pl.routing_id, pl.op_no].filter((v) => v !== null && v !== undefined).length;
    const score = -rank * 10 + specific;
    if (score > bestScore) {
      best = pl;
      bestScore = score;
    }
  }
  return best;
}

async function releasedRevision(db: D1Database, companyId: string, productId: string | null) {
  if (!productId) return null;
  const r = await db.prepare("SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released'").bind(companyId, productId).first<{ id: string }>();
  return r?.id ?? null;
}

// ------------------------------------------------------------------ inspections

export const INSP_SELECT = `SELECT i.*, p.number AS product_number, p.name AS product_name, p.uom AS product_uom, s.number AS supplier_number, s.legal_name AS supplier_name,
  r.number AS receipt_number, mo.number AS mo_number, o.op_no AS op_no, o.name AS op_name, fr.number AS fg_number, l.code AS location_code, l.kind AS location_kind, w.code AS warehouse_code,
  u.name AS inspector_name, cb.name AS created_by_name, qb.name AS concession_by_name
  FROM erp_qc_inspections i
  LEFT JOIN erp_products p ON p.company_id = i.company_id AND p.id = i.product_id
  LEFT JOIN erp_suppliers s ON s.company_id = i.company_id AND s.id = i.supplier_id
  LEFT JOIN erp_receipts r ON r.company_id = i.company_id AND r.id = i.receipt_id
  LEFT JOIN erp_mfg_orders mo ON mo.company_id = i.company_id AND mo.id = i.mo_id
  LEFT JOIN erp_mo_operations o ON o.company_id = i.company_id AND o.id = i.mo_operation_id
  LEFT JOIN erp_mo_receipts fr ON fr.company_id = i.company_id AND fr.id = i.fg_receipt_id
  LEFT JOIN erp_locations l ON l.company_id = i.company_id AND l.id = i.location_id
  LEFT JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
  LEFT JOIN users u ON u.id = i.inspector_id LEFT JOIN users cb ON cb.id = i.created_by LEFT JOIN users qb ON qb.id = i.concession_by`;

export function inspectionDTO(i: any) {
  return {
    id: i.id,
    number: i.number,
    kind: i.kind,
    kindLabel: label(PLAN_KINDS, i.kind),
    status: i.status,
    statusLabel: label(INSPECTION_STATUS, i.status),
    result: i.result as 'passed' | 'failed' | 'conditional' | null,
    resultLabel: i.result ? label(RESULTS, i.result) : null,
    planId: i.plan_id,
    planLabel: i.plan_label,
    sourceType: i.source_type,
    sourceLabel: label(INSPECTION_SOURCES, i.source_type),
    productId: i.product_id,
    productNumber: i.product_number ?? null,
    productName: i.product_name ?? null,
    uom: i.product_uom ?? '',
    supplierId: i.supplier_id,
    supplierNumber: i.supplier_number ?? null,
    supplierName: i.supplier_name ?? null,
    receiptId: i.receipt_id,
    receiptNumber: i.receipt_number ?? null,
    receiptLineId: i.receipt_line_id,
    moId: i.mo_id,
    moNumber: i.mo_number ?? null,
    moOperationId: i.mo_operation_id,
    opNo: i.op_no ?? null,
    opName: i.op_name ?? null,
    fgReceiptId: i.fg_receipt_id,
    fgNumber: i.fg_number ?? null,
    locationId: i.location_id,
    locationCode: i.location_code ? `${i.warehouse_code}/${i.location_code}` : null,
    lot: i.lot,
    serial: i.serial,
    quantity: i.quantity === null ? null : q6(i.quantity),
    quarantinedQty: q6(i.quarantined_qty),
    releasedQty: q6(i.released_qty),
    notes: i.notes,
    concessionNote: i.concession_note,
    concessionByName: i.concession_by_name ?? null,
    concessionAt: i.concession_at,
    inspectorName: i.inspector_name ?? null,
    completedAt: i.completed_at,
    cancelReason: i.cancel_reason,
    createdByName: i.created_by_name ?? null,
    createdAt: i.created_at,
  };
}

export async function loadInspection(db: D1Database, companyId: string, id: string) {
  const i = await db.prepare(`${INSP_SELECT} WHERE i.company_id = ? AND i.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!i) throw notFound('Inspection');
  return i;
}

async function inspectionChars(db: D1Database, companyId: string, inspectionId: string) {
  const [chars, readings] = await db.batch([
    db.prepare('SELECT * FROM erp_qc_insp_chars WHERE company_id = ? AND inspection_id = ? ORDER BY position, rowid').bind(companyId, inspectionId),
    db.prepare('SELECT r.*, u.name AS by_name FROM erp_qc_readings r LEFT JOIN users u ON u.id = r.recorded_by WHERE r.company_id = ? AND r.inspection_id = ? ORDER BY r.sample_no').bind(companyId, inspectionId),
  ]);
  return { chars: chars.results as any[], readings: readings.results as any[] };
}

/** Each characteristic's readings and photos, its status so far, and the inspection's result so far. */
async function evaluate(db: D1Database, companyId: string, inspectionId: string) {
  const { chars, readings } = await inspectionChars(db, companyId, inspectionId);
  const ids = chars.map((ch) => ch.id);
  const photos = new Map<string, any[]>();
  for (let i = 0; i < ids.length; i += 90) {
    const chunk = ids.slice(i, i + 90);
    const rows = await db
      .prepare(`SELECT f.*, u.name AS uploader FROM erp_record_files f LEFT JOIN users u ON u.id = f.uploaded_by WHERE f.company_id = ? AND f.entity_type = 'inspection_char' AND f.entity_id IN (${chunk.map(() => '?').join(',')}) AND f.deleted_at IS NULL ORDER BY f.created_at`)
      .bind(companyId, ...chunk)
      .all<any>();
    for (const f of rows.results) photos.set(f.entity_id, [...(photos.get(f.entity_id) ?? []), recordFileDTO(f)]);
  }
  let needed = 0;
  let recorded = 0;
  let failing = 0;
  const missing: string[] = [];
  const list = chars.map((ch) => {
    const d = charDTO(ch);
    const rs = readings.filter((r) => r.char_id === ch.id && r.sample_no <= ch.sample_size);
    const ok = rs.every((r) => !!r.ok);
    const complete = rs.length >= ch.sample_size;
    const pics = photos.get(ch.id) ?? [];
    needed += ch.sample_size;
    recorded += Math.min(rs.length, ch.sample_size);
    if (!ok) failing++;
    if (!complete) missing.push(`${ch.name}: ${rs.length} of ${ch.sample_size} sample${ch.sample_size === 1 ? '' : 's'} recorded`);
    if (ch.photo_required && !pics.length) missing.push(`${ch.name}: a photo is needed`);
    return {
      ...d,
      limits: limitText(d),
      result: ch.result as 'pass' | 'fail' | null,
      status: !ok ? 'fail' : complete ? 'pass' : 'incomplete',
      readings: rs.map((r) => ({ id: r.id, sampleNo: r.sample_no, value: r.value, conforming: r.conforming === null ? null : !!r.conforming, ok: !!r.ok, note: r.note, byName: r.by_name ?? null, at: r.recorded_at })),
      photos: pics,
    };
  });
  const soFar: 'pass' | 'fail' | 'incomplete' = failing ? 'fail' : missing.length || !chars.length ? 'incomplete' : 'pass';
  return { chars: list, summary: { needed, recorded, failing, missing, soFar } };
}

/** Stock rows of the inspected product (its lot or serial, when it has one), where it is now: to quarantine or release. */
async function stockOf(db: D1Database, companyId: string, productId: string | null, lot: string, serial: string) {
  if (!productId) return [];
  const rows = await db
    .prepare(
      `SELECT s.location_id, s.lot, s.serial, s.on_hand, s.reserved, l.code AS location_code, l.kind, w.code AS warehouse_code FROM erp_stock s
         JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE s.company_id = ? AND s.product_id = ? AND s.on_hand > 1e-9 ${lot ? 'AND s.lot = ?' : ''} ${serial ? 'AND s.serial = ?' : ''} ORDER BY l.kind = 'quarantine' DESC, w.code, l.code LIMIT 200`,
    )
    .bind(companyId, productId, ...(lot ? [lot] : []), ...(serial ? [serial] : []))
    .all<any>();
  return rows.results.map((s) => ({ locationId: s.location_id, locationCode: `${s.warehouse_code}/${s.location_code}`, quarantine: s.kind === 'quarantine', lot: s.lot, serial: s.serial, onHand: q6(s.on_hand), reserved: q6(s.reserved), available: q6(s.on_hand - s.reserved) }));
}

const zSourceType = z.string().max(40);

qualityRoutes.post('/c/:company/inspections', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({
      sourceType: zSourceType,
      sourceId: zId.optional(),
      planId: zId.nullable().optional(),
      kind: z.string().max(30).optional(),
      productId: zId.nullable().optional(),
      supplierId: zId.nullable().optional(),
      quantity: z.number().min(0).max(1e9).nullable().optional(),
      lot: zText(80).optional(),
      serial: zText(80).optional(),
      locationId: zId.nullable().optional(),
      notes: zText(2000).optional(),
      requestKey: zKey.optional(),
    }),
  );
  if (!isKey(INSPECTION_SOURCES, input.sourceType)) throw new HttpError(400, 'Say where the inspection comes from: a goods receipt line, a manufacturing operation, a finished-goods receipt, a supplier or by hand');
  if (input.requestKey) {
    const done = await db.prepare('SELECT id, number FROM erp_qc_inspections WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string; number: string }>();
    if (done) return c.json({ id: done.id, number: done.number, existing: true });
  }
  const x = {
    kind: input.kind ?? '',
    sourceId: null as string | null,
    productId: (input.productId || null) as string | null,
    supplierId: (input.supplierId || null) as string | null,
    receiptId: null as string | null,
    receiptLineId: null as string | null,
    moId: null as string | null,
    moOperationId: null as string | null,
    fgReceiptId: null as string | null,
    locationId: (input.locationId || null) as string | null,
    lot: input.lot ?? '',
    serial: input.serial ?? '',
    quantity: input.quantity ?? null,
    revisionId: null as string | null,
    routingId: null as string | null,
    opNo: null as number | null,
    what: '',
  };
  if (input.sourceType === 'receipt_line') {
    const l = await db
      .prepare('SELECT x.*, r.number AS receipt_number, r.supplier_id FROM erp_receipt_lines x JOIN erp_receipts r ON r.company_id = x.company_id AND r.id = x.receipt_id WHERE x.company_id = ? AND x.id = ?')
      .bind(a.companyId, input.sourceId ?? '')
      .first<any>();
    if (!l) throw notFound('Goods receipt line');
    if (!l.product_id) throw new HttpError(400, 'This line is not a product: there is nothing in stock to inspect');
    if (!(l.accepted_qty > 0)) throw new HttpError(400, 'Nothing was accepted on this line: there is nothing in stock to inspect');
    const serials: string[] = JSON.parse(l.serials_json || '[]');
    Object.assign(x, { kind: 'incoming', sourceId: l.id, productId: l.product_id, supplierId: l.supplier_id, receiptId: l.receipt_id, receiptLineId: l.id, locationId: l.location_id, lot: l.lot, serial: serials.length === 1 ? serials[0] : '', quantity: Math.min(input.quantity ?? l.accepted_qty, l.accepted_qty), what: `goods receipt ${l.receipt_number}` });
  } else if (input.sourceType === 'mo_operation') {
    const o = await db
      .prepare('SELECT o.*, mo.number AS mo_number, mo.product_id, mo.routing_id, mo.bom_revision_id, mo.quantity AS mo_qty, mo.status AS mo_status FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id WHERE o.company_id = ? AND o.id = ?')
      .bind(a.companyId, input.sourceId ?? '')
      .first<any>();
    if (!o) throw notFound('Operation');
    if (!['released', 'in_progress', 'completed'].includes(o.mo_status)) badState(`${o.mo_number} is not released: inspect its operations once it is`);
    Object.assign(x, { kind: input.kind === 'first_article' ? 'first_article' : 'in_process', sourceId: o.id, productId: o.product_id, moId: o.mo_id, moOperationId: o.id, quantity: input.quantity ?? o.mo_qty, revisionId: o.bom_revision_id, routingId: o.routing_id, opNo: o.op_no, what: `${o.mo_number} operation ${o.op_no}` });
  } else if (input.sourceType === 'fg_receipt') {
    const r = await db.prepare('SELECT x.*, mo.number AS mo_number, mo.bom_revision_id FROM erp_mo_receipts x JOIN erp_mfg_orders mo ON mo.company_id = x.company_id AND mo.id = x.mo_id WHERE x.company_id = ? AND x.id = ?').bind(a.companyId, input.sourceId ?? '').first<any>();
    if (!r) throw notFound('Finished-goods receipt');
    const serials: string[] = JSON.parse(r.serials_json || '[]');
    Object.assign(x, { kind: 'final', sourceId: r.id, productId: r.product_id, moId: r.mo_id, fgReceiptId: r.id, locationId: r.location_id, lot: r.lot, serial: serials.length === 1 ? serials[0] : '', quantity: Math.min(input.quantity ?? r.quantity, r.quantity), revisionId: r.bom_revision_id, what: `finished goods ${r.number} of ${r.mo_number}` });
  } else if (input.sourceType === 'supplier') {
    if (!x.supplierId) throw new HttpError(400, 'Choose the supplier to inspect');
    x.kind = 'supplier';
  } else {
    if (!isKey(PLAN_KINDS, x.kind)) throw new HttpError(400, 'Choose the kind of inspection');
    if (x.kind !== 'supplier' && !x.productId) throw new HttpError(400, 'Choose the product to inspect');
  }
  if (input.sourceType === 'supplier' || input.sourceType === 'manual') {
    if (x.productId) {
      const p = await db.prepare('SELECT id FROM erp_products WHERE company_id = ? AND id = ?').bind(a.companyId, x.productId).first();
      if (!p) throw new HttpError(400, 'That product is not in this company');
      x.revisionId = await releasedRevision(db, a.companyId, x.productId);
    }
    if (x.supplierId) {
      const s = await db.prepare('SELECT id FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, x.supplierId).first();
      if (!s) throw new HttpError(400, 'That supplier is not in this company');
    }
    if (x.locationId) await loadLocation(db, a.companyId, x.locationId).catch(() => {
      throw new HttpError(400, 'That location is not in this company');
    });
    x.what = input.sourceType === 'supplier' ? 'a supplier' : 'by hand';
  } else if (input.sourceType === 'receipt_line') {
    x.revisionId = await releasedRevision(db, a.companyId, x.productId);
  }
  // Starting the inspection of a source twice returns the first one.
  if (x.sourceId) {
    const existing = await db.prepare("SELECT id, number FROM erp_qc_inspections WHERE company_id = ? AND source_type = ? AND source_id = ? AND status <> 'cancelled'").bind(a.companyId, input.sourceType, x.sourceId).first<{ id: string; number: string }>();
    if (existing) return c.json({ id: existing.id, number: existing.number, existing: true });
  }
  let plan: any = null;
  if (input.planId) {
    plan = await db.prepare("SELECT * FROM erp_qc_plans WHERE company_id = ? AND id = ? AND status = 'released'").bind(a.companyId, input.planId).first<any>();
    if (!plan) throw new HttpError(400, 'Choose a released plan of this company');
    if (plan.product_id && x.productId && plan.product_id !== x.productId) throw new HttpError(400, 'That plan is for another product');
    if (plan.supplier_id && x.supplierId && plan.supplier_id !== x.supplierId) throw new HttpError(400, 'That plan is for another supplier');
  } else if (input.planId !== null) {
    plan = await findPlan(db, a.companyId, { kind: x.kind, productId: x.productId, supplierId: x.supplierId, revisionId: x.revisionId, routingId: x.routingId, opNo: x.opNo });
  }
  const chars = plan ? await planChars(db, a.companyId, plan.id) : [];
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'inspection');
  const planLabel = plan ? `${plan.number} v${plan.version} ${plan.name}` : '';
  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO erp_qc_inspections (id, company_id, number, kind, status, plan_id, plan_label, source_type, source_id, product_id, supplier_id, receipt_id, receipt_line_id, mo_id, mo_operation_id, fg_receipt_id, location_id, lot, serial, quantity, notes, request_key, created_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, a.companyId, number, x.kind, plan?.id ?? null, planLabel, input.sourceType, x.sourceId, x.productId, x.supplierId, x.receiptId, x.receiptLineId, x.moId, x.moOperationId, x.fgReceiptId, x.locationId, x.lot, x.serial, x.quantity, input.notes ?? '', input.requestKey ?? null, a.userId, t, t),
      ...chars.map((ch) => {
        const { lower, upper } = limitsOf(ch);
        return db
          .prepare('INSERT INTO erp_qc_insp_chars (id, company_id, inspection_id, plan_char_id, position, name, kind, unit, nominal, tolerance, min_value, max_value, lower_limit, upper_limit, sample_size, photo_required, instructions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(newId(), a.companyId, id, ch.id, ch.position, ch.name, ch.kind, ch.unit, ch.nominal, ch.tolerance, ch.min_value, ch.max_value, lower, upper, ch.sample_size, ch.photo_required, ch.instructions);
      }),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.created', entityType: 'inspection', entityId: id, productId: x.productId, summary: `${number}: ${label(PLAN_KINDS, x.kind).toLowerCase()} inspection of ${x.what}${plan ? ` to plan ${planLabel}` : ' (no plan: add characteristics)'}`, after: { source: input.sourceType, quantity: x.quantity, lot: x.lot }, at: t }),
    ]);
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (/UNIQUE constraint failed/i.test(msg) && (x.sourceId || input.requestKey)) {
      const existing = await db
        .prepare("SELECT id, number FROM erp_qc_inspections WHERE company_id = ? AND ((source_type = ? AND source_id = ? AND status <> 'cancelled') OR (request_key IS NOT NULL AND request_key = ?))")
        .bind(a.companyId, input.sourceType, x.sourceId ?? '', input.requestKey ?? '')
        .first<{ id: string; number: string }>();
      if (existing) return c.json({ id: existing.id, number: existing.number, existing: true });
    }
    throw e;
  }
  return c.json({ id, number, planLabel: planLabel || null, characteristics: chars.length }, 201);
});

qualityRoutes.get('/c/:company/inspections', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['i.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const add = (sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  const status = c.req.query('status');
  if (status && isKey(INSPECTION_STATUS, status)) add('i.status = ?', status);
  const result = c.req.query('result');
  if (result && isKey(RESULTS, result)) add('i.result = ?', result);
  const kind = c.req.query('kind');
  if (kind) add('i.kind = ?', kind);
  for (const [k, col] of [
    ['productId', 'i.product_id'],
    ['supplierId', 'i.supplier_id'],
    ['moId', 'i.mo_id'],
    ['receiptId', 'i.receipt_id'],
    ['lot', 'i.lot'],
  ] as const) {
    const v = c.req.query(k);
    if (v) add(`${col} = ?`, v);
  }
  if (c.req.query('from')) add('COALESCE(i.completed_at, i.created_at) >= ?', Date.parse(`${c.req.query('from')}T00:00:00Z`) || 0);
  if (c.req.query('to')) add('COALESCE(i.completed_at, i.created_at) < ?', (Date.parse(`${c.req.query('to')}T00:00:00Z`) || 0) + 86_400_000);
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('(i.number LIKE ? OR p.number LIKE ? OR p.name LIKE ? OR s.legal_name LIKE ? OR i.lot LIKE ? OR i.serial LIKE ? OR r.number LIKE ? OR mo.number LIKE ?)');
    const l = likeOf(q);
    args.push(l, l, l, l, l, l, l, l);
  }
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${INSP_SELECT} WHERE ${where.join(' AND ')} ORDER BY i.status = 'open' DESC, COALESCE(i.completed_at, i.created_at) DESC, i.rowid DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(inspectionDTO);
  if (csv)
    return csvResponse('inspections', [
      ['Inspection', 'Kind', 'Status', 'Result', 'Product', 'Supplier', 'Source', 'Lot', 'Serial', 'Quantity', 'Plan', 'Inspector', 'Completed'],
      ...list.map((i) => [i.number, i.kindLabel, i.statusLabel, i.resultLabel ?? '', i.productNumber ?? '', i.supplierName ?? '', i.receiptNumber ?? i.moNumber ?? i.sourceLabel, i.lot, i.serial, i.quantity ?? '', i.planLabel, i.inspectorName ?? '', i.completedAt ? new Date(i.completedAt).toISOString() : '']),
    ]);
  const total = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM erp_qc_inspections i LEFT JOIN erp_products p ON p.company_id = i.company_id AND p.id = i.product_id LEFT JOIN erp_suppliers s ON s.company_id = i.company_id AND s.id = i.supplier_id
         LEFT JOIN erp_receipts r ON r.company_id = i.company_id AND r.id = i.receipt_id LEFT JOIN erp_mfg_orders mo ON mo.company_id = i.company_id AND mo.id = i.mo_id WHERE ${where.join(' AND ')}`,
    )
    .bind(...args)
    .first<{ n: number }>();
  return c.json({ inspections: list, total: total?.n ?? 0, limit, offset, can: { inspect: can(a, 'quality.inspect') } });
});

qualityRoutes.get('/c/:company/inspections/:id', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  const ev = await evaluate(db, a.companyId, i.id);
  const ncrs = await db
    .prepare('SELECT n.id, n.number, n.title, n.status, n.severity FROM erp_qc_ncr_inspections x JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id WHERE x.company_id = ? AND x.inspection_id = ? ORDER BY n.created_at')
    .bind(a.companyId, i.id)
    .all<any>();
  const stock = await stockOf(db, a.companyId, i.product_id, i.lot, i.serial);
  const open = i.status === 'open';
  return c.json({
    inspection: inspectionDTO(i),
    characteristics: ev.chars,
    summary: ev.summary,
    ncrs: ncrs.results.map((n) => ({ id: n.id, number: n.number, title: n.title, status: n.status })),
    stock,
    files: await recordFiles(db, a.companyId, 'inspection', i.id),
    history: await historyOf(db, a.companyId, { entityType: 'inspection', entityId: i.id }),
    can: {
      record: can(a, 'quality.inspect') && open,
      addCharacteristic: can(a, 'quality.inspect') && open,
      complete: can(a, 'quality.inspect') && open,
      cancel: can(a, 'quality.inspect') && open,
      quarantine: can(a, 'quality.inspect') && !!i.product_id && (open || i.result === 'failed'),
      concession: can(a, 'quality.disposition') && i.status === 'completed' && i.result === 'failed',
      release: can(a, 'quality.disposition') && i.status === 'completed' && (i.result === 'passed' || i.result === 'conditional') && i.quarantined_qty - i.released_qty > EPS,
      raiseNcr: can(a, 'quality.raise') && i.status === 'completed' && i.result === 'failed',
    },
  });
});

qualityRoutes.post('/c/:company/inspections/:id/characteristics', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'open') badState(`${i.number} is ${label(INSPECTION_STATUS, i.status).toLowerCase()}`);
  const input = await body(c, zChar);
  const row = checkChar(input);
  const { lower, upper } = limitsOf(row);
  const max = await db.prepare('SELECT COALESCE(MAX(position), 0) AS m FROM erp_qc_insp_chars WHERE company_id = ? AND inspection_id = ?').bind(a.companyId, i.id).first<{ m: number }>();
  const t = now();
  const res = await db.batch([
    db
      .prepare(
        `INSERT INTO erp_qc_insp_chars (id, company_id, inspection_id, position, name, kind, unit, nominal, tolerance, min_value, max_value, lower_limit, upper_limit, sample_size, photo_required, instructions)
         SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM erp_qc_inspections WHERE company_id = ? AND id = ? AND status = 'open')`,
      )
      .bind(newId(), a.companyId, i.id, Number(max?.m ?? 0) + 1, row.name, row.kind, row.unit, row.nominal, row.tolerance, row.min_value, row.max_value, lower, upper, row.sample_size, row.photo_required, row.instructions, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.characteristic_added', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number}: characteristic ${row.name} added by hand`, after: row, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This inspection was completed at the same moment');
  return c.json({ ok: true }, 201);
});

qualityRoutes.put('/c/:company/inspections/:id/readings', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'open') badState(`${i.number} is ${label(INSPECTION_STATUS, i.status).toLowerCase()}: readings cannot change`);
  const input = await body(
    c,
    z.object({
      readings: z
        .array(z.object({ charId: zId, sampleNo: z.number().int().min(1).max(200), value: zNum.nullable().optional(), conforming: z.boolean().nullable().optional(), note: zText(500).optional(), clear: z.boolean().optional() }))
        .min(1)
        .max(500),
    }),
  );
  const { chars } = await inspectionChars(db, a.companyId, i.id);
  const byId = new Map(chars.map((ch) => [ch.id, ch]));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  let out = 0;
  let saved = 0;
  for (const r of input.readings) {
    const ch = byId.get(r.charId);
    if (!ch) throw new HttpError(400, 'That characteristic is not one of this inspection’s');
    if (r.sampleNo > ch.sample_size) throw new HttpError(400, `${ch.name} has ${ch.sample_size} sample${ch.sample_size === 1 ? '' : 's'}`);
    if (r.clear) {
      stmts.push(db.prepare("DELETE FROM erp_qc_readings WHERE company_id = ? AND char_id = ? AND sample_no = ? AND EXISTS (SELECT 1 FROM erp_qc_inspections WHERE company_id = ? AND id = ? AND status = 'open')").bind(a.companyId, ch.id, r.sampleNo, a.companyId, i.id));
      continue;
    }
    const measured = MEASURED.has(ch.kind);
    const value = measured ? (r.value ?? null) : null;
    const conforming = measured ? null : (r.conforming ?? null);
    if (measured && value === null) throw new HttpError(400, `${ch.name}, sample ${r.sampleNo}: give the measured value`);
    if (!measured && conforming === null) throw new HttpError(400, `${ch.name}, sample ${r.sampleNo}: say whether it conforms`);
    // worked out here, from the limits copied onto the inspection: never taken from the client
    const ok = readingOk(ch, value, conforming);
    if (!ok) out++;
    saved++;
    stmts.push(
      db
        .prepare(
          `INSERT INTO erp_qc_readings (id, company_id, inspection_id, char_id, sample_no, value, conforming, ok, note, recorded_by, recorded_at)
           SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM erp_qc_inspections WHERE company_id = ? AND id = ? AND status = 'open')
           ON CONFLICT(company_id, char_id, sample_no) DO UPDATE SET value = excluded.value, conforming = excluded.conforming, ok = excluded.ok, note = excluded.note, recorded_by = excluded.recorded_by, recorded_at = excluded.recorded_at`,
        )
        .bind(newId(), a.companyId, i.id, ch.id, r.sampleNo, value, conforming === null ? null : conforming ? 1 : 0, ok ? 1 : 0, r.note ?? '', a.userId, t, a.companyId, i.id),
    );
  }
  stmts.push(
    db.prepare('UPDATE erp_qc_inspections SET inspector_id = COALESCE(inspector_id, ?), updated_at = ? WHERE company_id = ? AND id = ? AND status = ?').bind(a.userId, t, a.companyId, i.id, 'open'),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.readings', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number}: ${saved} reading${saved === 1 ? '' : 's'} recorded${out ? `, ${out} outside the limits or not conforming` : ''}`, at: t }, "EXISTS (SELECT 1 FROM erp_qc_inspections WHERE company_id = ? AND id = ? AND status = 'open')", [a.companyId, i.id]),
  );
  const res = await db.batch(stmts);
  if (!res[res.length - 2].meta.changes) badState('This inspection was completed at the same moment: the readings were not saved');
  const ev = await evaluate(db, a.companyId, i.id);
  return c.json({ characteristics: ev.chars, summary: ev.summary });
});

/** The statements that move a product's stock into quarantine (checked: a quarantine location, enough stock there). */
export async function quarantineStock(db: D1Database, a: ErpAccess, ops: StockOps, x: { productId: string; fromLocationId: string; toLocationId: string; quantity: number; lot: string; serial: string }, m: { sourceId: string; reference: string; reason: string }) {
  const { p, l, key } = await stockKey(db, a.companyId, { productId: x.productId, locationId: x.fromLocationId, lot: x.lot, serial: x.serial }, { incoming: false, quantity: x.quantity });
  if (l.kind === 'quarantine') throw new HttpError(400, `${l.code} is already a quarantine location`);
  const to = await loadLocation(db, a.companyId, x.toLocationId);
  if (to.kind !== 'quarantine') throw new HttpError(400, `${to.code} is not a quarantine location`);
  if (to.archived_at || to.warehouse_archived) throw new HttpError(400, `Location ${to.code} is archived`);
  const row = await db.prepare('SELECT on_hand, reserved, expiry FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?').bind(a.companyId, key.productId, key.locationId, key.lot ?? '', key.serial ?? '').first<any>();
  const free = q6(Number(row?.on_hand ?? 0) - Number(row?.reserved ?? 0));
  if (x.quantity > free + EPS) throw new HttpError(409, `${l.warehouse_code}/${l.code} holds ${free} ${p.uom} of ${p.number}${key.lot ? ` lot ${key.lot}` : ''} that is not reserved: ${x.quantity} cannot go into quarantine`);
  ops.relocate('quarantine', key, to.id, x.quantity, row?.expiry ?? null, { source: 'quarantine', sourceId: m.sourceId, reference: m.reference, reason: m.reason });
  return { p, l, to, summary: `${x.quantity} ${p.uom} of ${p.number}${key.lot ? ` lot ${key.lot}` : ''}${key.serial ? ` serial ${key.serial}` : ''} from ${l.warehouse_code}/${l.code} into quarantine at ${to.warehouse_code}/${to.code}` };
}

/** The statements that release a product's stock from quarantine to a location outside it. */
export async function releaseStock(db: D1Database, a: ErpAccess, ops: StockOps, x: { productId: string; fromLocationId: string; toLocationId: string; quantity: number; lot: string; serial: string }, m: { sourceId: string; reference: string; reason: string }) {
  const { p, l, key } = await stockKey(db, a.companyId, { productId: x.productId, locationId: x.fromLocationId, lot: x.lot, serial: x.serial }, { incoming: false, quantity: x.quantity });
  if (l.kind !== 'quarantine') throw new HttpError(400, `${l.code} is not a quarantine location`);
  const to = await loadLocation(db, a.companyId, x.toLocationId);
  if (to.kind === 'quarantine') throw new HttpError(400, 'Release it to a location outside quarantine');
  if (to.archived_at || to.warehouse_archived) throw new HttpError(400, `Location ${to.code} is archived`);
  const row = await db.prepare('SELECT expiry FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?').bind(a.companyId, key.productId, key.locationId, key.lot ?? '', key.serial ?? '').first<any>();
  ops.relocate('release', key, to.id, x.quantity, row?.expiry ?? null, { source: 'quarantine', sourceId: m.sourceId, reference: m.reference, reason: m.reason });
  return { p, l, to, summary: `${x.quantity} ${p.uom} of ${p.number}${key.lot ? ` lot ${key.lot}` : ''}${key.serial ? ` serial ${key.serial}` : ''} released from ${l.warehouse_code}/${l.code} to ${to.warehouse_code}/${to.code}` };
}

/** Plain answers for the quality checks the database makes. */
export function qualityError(e: unknown): never {
  const msg = String((e as Error)?.message ?? e);
  if (/done_qty/i.test(msg)) throw new HttpError(409, 'Someone carried out this disposition at the same moment: only what is left can be done. Refresh.');
  if (/released_qty/i.test(msg)) throw new HttpError(409, 'That is more than this inspection put into quarantine and has not released yet');
  stockError(e);
}

const zQuarantine = z.object({ fromLocationId: zId.optional(), toLocationId: zId, quantity: z.number().positive().max(1e9).optional() });

qualityRoutes.post('/c/:company/inspections/:id/complete', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'open') badState(`${i.number} is already ${label(INSPECTION_STATUS, i.status).toLowerCase()}`);
  const input = await body(c, z.object({ notes: zText(2000).optional(), quarantine: zQuarantine.optional() }));
  const ev = await evaluate(db, a.companyId, i.id);
  if (!ev.chars.length) badState('Add at least one characteristic and record it before completing');
  if (ev.summary.missing.length) badState(`Not finished: ${ev.summary.missing.join('; ')}`);
  const failed = ev.summary.failing > 0;
  const result = failed ? 'failed' : 'passed';
  if (input.quarantine && !failed) badState('Only a failed lot is put into quarantine');
  const t = now();
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings, t);
  let qty = 0;
  let qSummary = '';
  if (input.quarantine) {
    if (!i.product_id) throw new HttpError(400, 'This inspection has no product in stock to quarantine');
    const from = input.quarantine.fromLocationId ?? i.location_id;
    if (!from) throw new HttpError(400, 'Say where the stock is now');
    qty = input.quarantine.quantity ?? Number(i.quantity ?? 0);
    if (!(qty > 0)) throw new HttpError(400, 'Give the quantity to put into quarantine');
    const q = await quarantineStock(db, a, ops, { productId: i.product_id, fromLocationId: from, toLocationId: input.quarantine.toLocationId, quantity: qty, lot: i.lot, serial: i.serial }, { sourceId: i.id, reference: i.number, reason: `Failed inspection ${i.number}` });
    qSummary = `; ${q.summary}`;
  }
  const failedNames = ev.chars.filter((ch) => ch.status === 'fail').map((ch) => ch.name);
  const before: D1PreparedStatement[] = [
    onceStmt(db, a.companyId, `qc-complete:${i.id}`, t),
    db
      .prepare("UPDATE erp_qc_inspections SET status = 'completed', result = ?, inspector_id = ?, completed_at = ?, notes = CASE WHEN ? <> '' THEN ? ELSE notes END, quarantined_qty = round(quarantined_qty + ?, 6), updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'")
      .bind(result, a.userId, t, input.notes ?? '', input.notes ?? '', qty, t, a.companyId, i.id),
    ...ev.chars.map((ch) => db.prepare('UPDATE erp_qc_insp_chars SET result = ? WHERE company_id = ? AND id = ?').bind(ch.status === 'fail' ? 'fail' : 'pass', a.companyId, ch.id)),
  ];
  // A full inspection linked to a Release 3 inspection point also records the operation's pass or fail.
  if (i.mo_operation_id) {
    before.push(
      db
        .prepare("UPDATE erp_mo_operations SET inspection_result = ?, inspection_comment = ?, inspection_by = ?, inspection_at = ? WHERE company_id = ? AND id = ? AND inspection = 1 AND status <> 'completed'")
        .bind(failed ? 'fail' : 'pass', `${i.number}: ${failed ? `failed (${failedNames.join(', ')})` : 'passed'}`.slice(0, 1000), a.userId, t, a.companyId, i.mo_operation_id),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'mo.inspection', entityType: 'manufacturing_order', entityId: i.mo_id, productId: i.product_id, summary: `${i.mo_number} operation ${i.op_no} inspection: ${failed ? 'fail' : 'pass'} (full inspection ${i.number})`, after: { result: failed ? 'fail' : 'pass', inspection: i.number }, at: t }),
    );
  }
  const event = eventStmt(db, {
    companyId: a.companyId,
    actorId: a.userId,
    action: 'inspection.completed',
    entityType: 'inspection',
    entityId: i.id,
    productId: i.product_id,
    summary: `${i.number} ${failed ? `failed: ${failedNames.join(', ')} outside the limits or not conforming` : 'passed'}${qSummary}`,
    after: { result, quarantined: qty || undefined },
    at: t,
  });
  try {
    await db.batch(input.quarantine ? ops.all(before, [event], { type: 'quarantine', id: i.id }) : [...before, event]);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) badState(`${i.number} was completed at the same moment`);
    qualityError(e);
  }
  return c.json({ id: i.id, number: i.number, result, quarantined: qty, failing: failedNames });
});

qualityRoutes.post('/c/:company/inspections/:id/quarantine', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (!(i.status === 'open' || i.result === 'failed')) badState('Stock is put into quarantine while an inspection is open or after it failed');
  if (!i.product_id) throw new HttpError(400, 'This inspection has no product in stock to quarantine');
  const input = await body(c, zQuarantine.extend({ requestKey: zKey }));
  const key = `qc-quarantine:${input.requestKey}`;
  if (await db.prepare('SELECT 1 AS x FROM erp_done WHERE company_id = ? AND key = ?').bind(a.companyId, key).first()) return c.json({ ok: true, replayed: true });
  const from = input.fromLocationId ?? i.location_id;
  if (!from) throw new HttpError(400, 'Say where the stock is now');
  const qty = input.quantity ?? Number(i.quantity ?? 0);
  if (!(qty > 0)) throw new HttpError(400, 'Give the quantity to put into quarantine');
  const t = now();
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId), t);
  const q = await quarantineStock(db, a, ops, { productId: i.product_id, fromLocationId: from, toLocationId: input.toLocationId, quantity: qty, lot: i.lot, serial: i.serial }, { sourceId: i.id, reference: i.number, reason: `Held by inspection ${i.number}` });
  try {
    await db.batch(
      ops.all(
        [onceStmt(db, a.companyId, key, t), db.prepare('UPDATE erp_qc_inspections SET quarantined_qty = round(quarantined_qty + ?, 6), updated_at = ? WHERE company_id = ? AND id = ?').bind(qty, t, a.companyId, i.id)],
        [eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.quarantined', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number}: ${q.summary}`, after: { quantity: qty }, at: t })],
        { type: 'quarantine', id: i.id },
      ),
    );
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) return c.json({ ok: true, replayed: true });
    qualityError(e);
  }
  return c.json({ ok: true, groupId: ops.groupId, summary: q.summary }, 201);
});

/** A quality manager accepts a failed lot on condition (a concession), with the reason. */
qualityRoutes.post('/c/:company/inspections/:id/concession', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'completed' || i.result !== 'failed') badState('Only a failed inspection can be accepted on condition');
  const input = await body(c, z.object({ note: zText(2000).min(1, 'Say why the lot is accepted and on what condition') }));
  const t = now();
  const stmts = [
    db.prepare("UPDATE erp_qc_inspections SET result = 'conditional', concession_note = ?, concession_by = ?, concession_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND result = 'failed'").bind(input.note, a.userId, t, t, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.concession', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number} accepted on condition: ${input.note}`, before: { result: 'failed' }, after: { result: 'conditional' }, at: t }),
  ];
  if (i.mo_operation_id) {
    stmts.push(
      db.prepare("UPDATE erp_mo_operations SET inspection_result = 'pass', inspection_comment = ?, inspection_by = ?, inspection_at = ? WHERE company_id = ? AND id = ? AND inspection = 1 AND status <> 'completed'").bind(`${i.number}: accepted on condition (${input.note})`.slice(0, 1000), a.userId, t, a.companyId, i.mo_operation_id),
    );
  }
  const res = await db.batch(stmts);
  if (!res[0].meta.changes) badState('This inspection changed at the same moment: reload it');
  return c.json({ ok: true, result: 'conditional' });
});

/** Stock this inspection put into quarantine, released after it passed or was accepted on condition. */
qualityRoutes.post('/c/:company/inspections/:id/release', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'completed' || !(i.result === 'passed' || i.result === 'conditional')) badState('A failed lot is released through its nonconformance’s disposition');
  if (!i.product_id) throw new HttpError(400, 'This inspection has no product in stock');
  const input = await body(c, z.object({ fromLocationId: zId, toLocationId: zId, quantity: z.number().positive().max(1e9), requestKey: zKey }));
  const key = `qc-release:${input.requestKey}`;
  if (await db.prepare('SELECT 1 AS x FROM erp_done WHERE company_id = ? AND key = ?').bind(a.companyId, key).first()) return c.json({ ok: true, replayed: true });
  if (input.quantity > q6(i.quarantined_qty - i.released_qty) + EPS) badState(`${i.number} has ${q6(i.quarantined_qty - i.released_qty)} in quarantine to release`);
  const t = now();
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId), t);
  const r = await releaseStock(db, a, ops, { productId: i.product_id, fromLocationId: input.fromLocationId, toLocationId: input.toLocationId, quantity: input.quantity, lot: i.lot, serial: i.serial }, { sourceId: i.id, reference: i.number, reason: i.result === 'conditional' ? `Accepted on condition: ${i.concession_note}` : `Passed inspection ${i.number}` });
  try {
    await db.batch(
      ops.all(
        [onceStmt(db, a.companyId, key, t), db.prepare('UPDATE erp_qc_inspections SET released_qty = round(released_qty + ?, 6), updated_at = ? WHERE company_id = ? AND id = ?').bind(input.quantity, t, a.companyId, i.id)],
        [eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.released', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number}: ${r.summary}`, after: { quantity: input.quantity }, at: t })],
        { type: 'quarantine', id: i.id },
      ),
    );
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) return c.json({ ok: true, replayed: true });
    qualityError(e);
  }
  return c.json({ ok: true, groupId: ops.groupId, summary: r.summary }, 201);
});

qualityRoutes.post('/c/:company/inspections/:id/cancel', async (c) => {
  const a = await requireErp(c, 'quality.inspect');
  const db = c.env.DB;
  const i = await loadInspection(db, a.companyId, c.req.param('id'));
  if (i.status !== 'open') badState(`${i.number} is ${label(INSPECTION_STATUS, i.status).toLowerCase()}`);
  const input = await body(c, z.object({ reason: zText(1000).min(1, 'Say why it is cancelled') }));
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_qc_inspections SET status = 'cancelled', cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'").bind(input.reason, t, a.companyId, i.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.cancelled', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${i.number} cancelled: ${input.reason}`, at: t }),
  ]);
  if (!res[0].meta.changes) badState('This inspection changed at the same moment: reload it');
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ what waits for inspection, and the hub

/** Receipt lines, inspection points and finished-goods receipts that wait for an inspection (none started yet). */
export async function inspectionQueue(db: D1Database, companyId: string, limit = 200) {
  const [lines, ops, fgs, plans] = await db.batch([
    db
      .prepare(
        `SELECT x.id, x.accepted_qty, x.lot, r.id AS receipt_id, r.number AS receipt_number, r.received_date, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom, s.id AS supplier_id, s.legal_name AS supplier_name
           FROM erp_receipt_lines x JOIN erp_receipts r ON r.company_id = x.company_id AND r.id = x.receipt_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
           JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id
          WHERE x.company_id = ?1 AND x.inspection_required = 1 AND x.accepted_qty > 0
            AND NOT EXISTS (SELECT 1 FROM erp_qc_inspections i WHERE i.company_id = x.company_id AND i.source_type = 'receipt_line' AND i.source_id = x.id AND i.status <> 'cancelled')
          ORDER BY r.received_date DESC, r.created_at DESC LIMIT ?2`,
      )
      .bind(companyId, limit),
    db
      .prepare(
        `SELECT o.id, o.op_no, o.name, o.inspection_note, mo.id AS mo_id, mo.number AS mo_number, mo.quantity, mo.routing_id, mo.bom_revision_id, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom
           FROM erp_mo_operations o JOIN erp_mfg_orders mo ON mo.company_id = o.company_id AND mo.id = o.mo_id JOIN erp_products p ON p.company_id = mo.company_id AND p.id = mo.product_id
          WHERE o.company_id = ?1 AND o.inspection = 1 AND o.inspection_result IS NULL AND o.status IN ('in_progress','paused') AND mo.status IN ('released','in_progress')
            AND NOT EXISTS (SELECT 1 FROM erp_qc_inspections i WHERE i.company_id = o.company_id AND i.source_type = 'mo_operation' AND i.source_id = o.id AND i.status <> 'cancelled')
          ORDER BY mo.number, o.op_no LIMIT ?2`,
      )
      .bind(companyId, limit),
    db
      .prepare(
        `SELECT x.id, x.number, x.quantity, x.lot, x.created_at, mo.id AS mo_id, mo.number AS mo_number, p.id AS product_id, p.number AS product_number, p.name AS product_name, p.uom
           FROM erp_mo_receipts x JOIN erp_mfg_orders mo ON mo.company_id = x.company_id AND mo.id = x.mo_id JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id
          WHERE x.company_id = ?1 AND EXISTS (SELECT 1 FROM erp_qc_plans pl WHERE pl.company_id = x.company_id AND pl.product_id = x.product_id AND pl.kind = 'final' AND pl.status = 'released')
            AND x.created_at >= (SELECT MIN(pl.released_at) FROM erp_qc_plans pl WHERE pl.company_id = x.company_id AND pl.product_id = x.product_id AND pl.kind = 'final' AND pl.released_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM erp_qc_inspections i WHERE i.company_id = x.company_id AND i.source_type = 'fg_receipt' AND i.source_id = x.id AND i.status <> 'cancelled')
          ORDER BY x.created_at DESC LIMIT ?2`,
      )
      .bind(companyId, limit),
    db.prepare("SELECT * FROM erp_qc_plans WHERE company_id = ? AND status = 'released' LIMIT 1000").bind(companyId),
  ]);
  const released = plans.results as any[];
  const planFor = (x: PlanContext) => {
    const order = PLAN_ORDER[x.kind] ?? [x.kind];
    return released.some((pl) => order.includes(pl.kind) && (pl.product_id ?? x.productId) === x.productId && (pl.supplier_id === null || pl.supplier_id === x.supplierId) && (pl.routing_id === null || pl.routing_id === x.routingId) && (pl.op_no === null || pl.op_no === x.opNo) && !!(pl.product_id || pl.supplier_id === x.supplierId));
  };
  return [
    ...(lines.results as any[]).map((l) => ({
      sourceType: 'receipt_line' as const,
      sourceId: l.id,
      kind: 'incoming',
      title: `${l.product_number} ${l.product_name}`,
      reference: `Goods receipt ${l.receipt_number}`,
      link: { kind: 'receipt', id: l.receipt_id },
      supplierName: l.supplier_name,
      quantity: q6(l.accepted_qty),
      uom: l.uom,
      lot: l.lot,
      date: l.received_date,
      planAvailable: planFor({ kind: 'incoming', productId: l.product_id, supplierId: l.supplier_id, revisionId: null, routingId: null, opNo: null }),
    })),
    ...(ops.results as any[]).map((o) => ({
      sourceType: 'mo_operation' as const,
      sourceId: o.id,
      kind: 'in_process',
      title: `${o.product_number} ${o.product_name}`,
      reference: `${o.mo_number} operation ${o.op_no} ${o.name}`,
      link: { kind: 'mo', id: o.mo_id },
      supplierName: null,
      quantity: q6(o.quantity),
      uom: o.uom,
      lot: '',
      date: null,
      note: o.inspection_note,
      planAvailable: planFor({ kind: 'in_process', productId: o.product_id, supplierId: null, revisionId: null, routingId: o.routing_id, opNo: o.op_no }),
    })),
    ...(fgs.results as any[]).map((x) => ({
      sourceType: 'fg_receipt' as const,
      sourceId: x.id,
      kind: 'final',
      title: `${x.product_number} ${x.product_name}`,
      reference: `Finished goods ${x.number} of ${x.mo_number}`,
      link: { kind: 'mo', id: x.mo_id },
      supplierName: null,
      quantity: q6(x.quantity),
      uom: x.uom,
      lot: x.lot,
      date: new Date(x.created_at).toISOString().slice(0, 10),
      planAvailable: true,
    })),
  ];
}

/** Counts for the Operations hub and the quality hub. */
export async function qualityCounts(db: D1Database, companyId: string) {
  const today = todayIso();
  const since = now() - 30 * 86_400_000;
  const [insp, ncr, capa, plans] = await db.batch([
    db.prepare("SELECT SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status = 'completed' AND result = 'failed' AND completed_at >= ?2 THEN 1 ELSE 0 END) AS failed, SUM(CASE WHEN status = 'completed' AND completed_at >= ?2 THEN 1 ELSE 0 END) AS completed FROM erp_qc_inspections WHERE company_id = ?1").bind(companyId, since),
    db.prepare("SELECT SUM(CASE WHEN status NOT IN ('closed','cancelled') THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status IN ('open','contained','investigating') THEN 1 ELSE 0 END) AS to_disposition, SUM(CASE WHEN status = 'verification' THEN 1 ELSE 0 END) AS to_close FROM erp_qc_ncrs WHERE company_id = ?").bind(companyId),
    db.prepare("SELECT SUM(CASE WHEN status IN ('proposed','approved','in_progress','done','verified') THEN 1 ELSE 0 END) AS open, SUM(CASE WHEN status = 'proposed' THEN 1 ELSE 0 END) AS to_approve, SUM(CASE WHEN status IN ('proposed','approved','in_progress') AND due_date IS NOT NULL AND due_date < ?2 THEN 1 ELSE 0 END) AS overdue FROM erp_qc_capas WHERE company_id = ?1").bind(companyId, today),
    db.prepare("SELECT SUM(CASE WHEN status = 'released' THEN 1 ELSE 0 END) AS released, SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft FROM erp_qc_plans WHERE company_id = ?").bind(companyId),
  ]);
  const one = (r: D1Result) => (r.results[0] ?? {}) as Record<string, number | null>;
  const queue = await inspectionQueue(db, companyId, 500);
  return {
    toInspect: queue.length,
    openInspections: one(insp).open ?? 0,
    failedLast30Days: one(insp).failed ?? 0,
    completedLast30Days: one(insp).completed ?? 0,
    openNcrs: one(ncr).open ?? 0,
    ncrsToDisposition: one(ncr).to_disposition ?? 0,
    ncrsToClose: one(ncr).to_close ?? 0,
    openCapas: one(capa).open ?? 0,
    capasToApprove: one(capa).to_approve ?? 0,
    overdueCapas: one(capa).overdue ?? 0,
    plansReleased: one(plans).released ?? 0,
    plansDraft: one(plans).draft ?? 0,
  };
}

export function capaBrief(x: any, today = todayIso()) {
  return { id: x.id, number: x.number, title: x.title, status: x.status, dueDate: x.due_date, responsibleName: x.responsible_name ?? null, overdue: !!x.due_date && x.due_date < today && ['proposed', 'approved', 'in_progress'].includes(x.status), ncrNumber: x.ncr_number ?? null };
}

/**
 * The quality hub: counts, what waits for inspection, overdue corrective actions and the person's own. My Work is
 * Projects and Tasks' list of board items and has no place for ERP records, so overdue actions are shown here.
 */
qualityRoutes.get('/c/:company/quality/overview', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const today = todayIso();
  const counts = await qualityCounts(db, a.companyId);
  const queue = await inspectionQueue(db, a.companyId, 50);
  const CAPA_SELECT = `SELECT x.*, u.name AS responsible_name, n.number AS ncr_number FROM erp_qc_capas x LEFT JOIN users u ON u.id = x.responsible_id LEFT JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id`;
  const [overdue, mine, failed, ncrs] = await db.batch([
    db.prepare(`${CAPA_SELECT} WHERE x.company_id = ? AND x.status IN ('proposed','approved','in_progress') AND x.due_date IS NOT NULL AND x.due_date < ? ORDER BY x.due_date LIMIT 50`).bind(a.companyId, today),
    db.prepare(`${CAPA_SELECT} WHERE x.company_id = ? AND x.responsible_id = ? AND x.status IN ('proposed','approved','in_progress','done') ORDER BY COALESCE(x.due_date, '9999') LIMIT 50`).bind(a.companyId, a.userId),
    db.prepare(`${INSP_SELECT} WHERE i.company_id = ? AND i.status = 'completed' AND i.result = 'failed' ORDER BY i.completed_at DESC LIMIT 5`).bind(a.companyId),
    db.prepare("SELECT id, number, title, status, severity, created_at FROM erp_qc_ncrs WHERE company_id = ? AND status NOT IN ('closed','cancelled') ORDER BY created_at DESC LIMIT 10").bind(a.companyId),
  ]);
  return c.json({
    counts,
    queue,
    overdueCapas: (overdue.results as any[]).map((x) => capaBrief(x, today)),
    myCapas: (mine.results as any[]).map((x) => capaBrief(x, today)),
    recentFailures: (failed.results as any[]).map(inspectionDTO),
    openNcrs: (ncrs.results as any[]).map((n) => ({ id: n.id, number: n.number, title: n.title, status: n.status, severity: n.severity, createdAt: n.created_at })),
    myWorkNote: 'My Work lists Projects and Tasks items only, so corrective actions due and overdue are shown here.',
    can: { inspect: can(a, 'quality.inspect'), raise: can(a, 'quality.raise'), plan: can(a, 'quality.plan'), propose: can(a, 'capa.propose'), disposition: can(a, 'quality.disposition') },
  });
});

/** What the quality forms choose from: products, suppliers, locations, people, released plans, routings, assets. */
qualityRoutes.get('/c/:company/quality-options', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const [products, suppliers, locations, plans, routings, assets] = await db.batch([
    db.prepare('SELECT id, number, name, uom FROM erp_products WHERE company_id = ? AND archived_at IS NULL ORDER BY number COLLATE NOCASE LIMIT 2000').bind(a.companyId),
    db.prepare('SELECT id, number, legal_name, status FROM erp_suppliers WHERE company_id = ? AND archived_at IS NULL ORDER BY legal_name COLLATE NOCASE LIMIT 2000').bind(a.companyId),
    db.prepare('SELECT l.id, l.code, l.name, l.kind, w.code AS warehouse_code FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.archived_at IS NULL AND w.archived_at IS NULL ORDER BY w.code, l.code LIMIT 2000').bind(a.companyId),
    db.prepare(`${PLAN_SELECT} WHERE pl.company_id = ? AND pl.status = 'released' ORDER BY pl.number LIMIT 1000`).bind(a.companyId),
    db
      .prepare("SELECT r.id, r.product_id, r.revision, r.status, (SELECT group_concat(o.op_no || ' ' || o.name, '|') FROM erp_routing_operations o WHERE o.company_id = r.company_id AND o.routing_id = r.id) AS ops FROM erp_routings r WHERE r.company_id = ? AND r.status IN ('draft','released') LIMIT 1000")
      .bind(a.companyId),
    // Maintenance's assets of this company, read only (an NCR may name the asset or process involved)
    db.prepare('SELECT id, number, name FROM mt_assets WHERE company_id = ? AND archived_at IS NULL ORDER BY number COLLATE NOCASE LIMIT 2000').bind(a.companyId),
  ]);
  return c.json({
    products: (products.results as any[]).map((p) => ({ id: p.id, number: p.number, name: p.name, uom: p.uom })),
    suppliers: (suppliers.results as any[]).map((s) => ({ id: s.id, number: s.number, name: s.legal_name, status: s.status })),
    locations: (locations.results as any[]).map((l) => ({ id: l.id, code: `${l.warehouse_code}/${l.code}`, name: l.name, kind: l.kind, quarantine: l.kind === 'quarantine' })),
    plans: (plans.results as any[]).map(planDTO),
    routings: (routings.results as any[]).map((r) => ({ id: r.id, productId: r.product_id, revision: r.revision, status: r.status, operations: String(r.ops ?? '').split('|').filter(Boolean).map((o) => ({ opNo: Number(o.split(' ')[0]), name: o.split(' ').slice(1).join(' ') })) })),
    assets: (assets.results as any[]).map((x) => ({ id: x.id, number: x.number, name: x.name })),
    people: (await companyPeople(db, a)).map((p) => ({ id: p.id, name: p.name })),
    planKinds: Object.entries(PLAN_KINDS).map(([value, l]) => ({ value, label: l })),
    charKinds: Object.entries(CHAR_KINDS).map(([value, l]) => ({ value, label: l })),
  });
});
