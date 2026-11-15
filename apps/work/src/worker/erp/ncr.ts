// BIZOMAT ERP, Release 4 part A: nonconformance reports and corrective and preventive actions
// (/api/erp/c/:company/...). Who may do what: access.ts. Inspections: quality.ts.
//
// Nonconformance (NCR-00001), raised by anyone who operates or inspects, from failed inspections or by hand: the
// product, lot or serial and quantity affected, the receipt, manufacturing order and supplier, a Maintenance asset of the
// same company (read only) or a process, the defect and its severity. Statuses: open, contained (containment recorded,
// with stock put into quarantine through the stock service if wanted), investigating (root cause by five whys or free
// text), dispositioned (a quality manager decides, once, how much is used as is, reworked, repaired, scrapped,
// returned to the supplier or regraded), capa (a corrective action raised from it is open), verification (every
// disposition carried out and every corrective action verified or closed), closed (a quality manager records the
// verification), or cancelled before a disposition.
//
// Carrying out a disposition goes through the existing code: scrap and returns to the supplier through StockOps'
// takeOut (movements scrap and supplier_return), release from quarantine through its relocate; rework and repair are
// recorded as a note (a manufacturing order would issue new materials, which rework does not), then released or marked
// done where the stock stands. Each action carries the client's key (a unique index: a double submission or a retry
// does it once) and adds to its disposition line's done quantity, whose CHECK refuses more than was decided: two
// people carrying out the same disposition at the same moment cannot both take the last units.
//
// Corrective and preventive actions (CA-00001), from an NCR or on their own: a responsible person, a due date and
// evidence (files). Statuses: proposed, approved (by a quality manager who neither proposed it nor is to carry it out),
// in progress, done (by the responsible person, or a quality manager), verified (the effectiveness check; not
// effective sends it back to in progress), closed (by a quality manager who did not carry it out), or cancelled. In a
// company of one person the approval and the closure are the recorded exception.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now, parseJson } from '../lib/util';
import { assertCan, can, companyPeople, requireErp, segregationOf, type ErpAccess } from './access';
import { badState, csvResponse, eventStmt, eventStmtIf, historyOf, likeOf, nextNumber, paging, wantsCsv, zDate, zId, zText } from './util';
import { loadSettings } from './settings';
import { StockOps, onceStmt, q6 } from './stock';
import { stockKey } from './inventory';
import { recordFiles } from './record-files';
import { isKey, label, todayIso } from './manufacturing';
import { inspectionDTO, INSP_SELECT, qualityError, quarantineStock, releaseStock } from './quality';

export const ncrRoutes = new Hono<AppEnv>();

export const NCR_STATUS = {
  open: 'Open',
  contained: 'Contained',
  investigating: 'Under investigation',
  dispositioned: 'Dispositioned',
  capa: 'Corrective action',
  verification: 'Verification',
  closed: 'Closed',
  cancelled: 'Cancelled',
} as const;
export const SEVERITIES = { minor: 'Minor', major: 'Major', critical: 'Critical' } as const;
export const DISPOSITIONS = { use_as_is: 'Use as is', rework: 'Rework', repair: 'Repair', scrap: 'Scrap', return_to_supplier: 'Return to supplier', regrade: 'Regrade' } as const;
export const ACTIONS = { scrap: 'Scrapped', supplier_return: 'Returned to supplier', release: 'Released from quarantine', rework_note: 'Rework or repair note', done: 'Done where it stands' } as const;
export const CAPA_STATUS = { proposed: 'Proposed', approved: 'Approved', in_progress: 'In progress', done: 'Done', verified: 'Verified effective', closed: 'Closed', cancelled: 'Cancelled' } as const;
export const CAPA_KINDS = { corrective: 'Corrective', preventive: 'Preventive' } as const;
export const ROOT_CAUSE_METHODS = { five_whys: 'Five whys', free_text: 'Free text' } as const;

/** The actions that carry out each disposition. */
const ALLOWED: Record<keyof typeof DISPOSITIONS, (keyof typeof ACTIONS)[]> = {
  use_as_is: ['release', 'done'],
  regrade: ['release', 'done'],
  rework: ['rework_note', 'release', 'done'],
  repair: ['rework_note', 'release', 'done'],
  scrap: ['scrap'],
  return_to_supplier: ['supplier_return'],
};
/** Actions that count against the disposition's quantity (a note does not). */
const COUNTED = new Set(['scrap', 'supplier_return', 'release', 'done']);
const STOCK_ACTIONS = new Set(['scrap', 'supplier_return', 'release']);
const EDITABLE = ['open', 'contained', 'investigating'];
const ACTIVE = ['dispositioned', 'capa'];
const OPEN_CAPA = ['proposed', 'approved', 'in_progress', 'done'];
const EPS = 1e-9;
const zKey = z.string().trim().min(8).max(80);
const DAY = 86_400_000;

// ------------------------------------------------------------------ loading and DTOs

const NCR_SELECT = `SELECT n.*, p.number AS product_number, p.name AS product_name, p.uom AS product_uom, s.number AS supplier_number, s.legal_name AS supplier_name,
  r.number AS receipt_number, mo.number AS mo_number, l.code AS location_code, l.kind AS location_kind, w.code AS warehouse_code,
  rb.name AS raised_by_name, xb.name AS dispositioned_by_name, vb.name AS verified_by_name, cb.name AS closed_by_name, kb.name AS contained_by_name, ib.name AS investigated_by_name,
  ma.number AS asset_number, ma.name AS asset_name
  FROM erp_qc_ncrs n
  LEFT JOIN erp_products p ON p.company_id = n.company_id AND p.id = n.product_id
  LEFT JOIN erp_suppliers s ON s.company_id = n.company_id AND s.id = n.supplier_id
  LEFT JOIN erp_receipts r ON r.company_id = n.company_id AND r.id = n.receipt_id
  LEFT JOIN erp_mfg_orders mo ON mo.company_id = n.company_id AND mo.id = n.mo_id
  LEFT JOIN erp_locations l ON l.company_id = n.company_id AND l.id = n.location_id
  LEFT JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
  LEFT JOIN mt_assets ma ON ma.company_id = n.company_id AND ma.id = n.asset_id
  LEFT JOIN users rb ON rb.id = n.raised_by LEFT JOIN users xb ON xb.id = n.dispositioned_by LEFT JOIN users vb ON vb.id = n.verified_by
  LEFT JOIN users cb ON cb.id = n.closed_by LEFT JOIN users kb ON kb.id = n.contained_by LEFT JOIN users ib ON ib.id = n.investigated_by`;

const ageDays = (n: any, t = now()) => Math.max(0, Math.floor(((n.closed_at ?? (n.status === 'cancelled' ? n.updated_at : t)) - n.created_at) / DAY));

export function ncrDTO(n: any) {
  return {
    id: n.id,
    number: n.number,
    title: n.title,
    description: n.description,
    severity: n.severity,
    severityLabel: label(SEVERITIES, n.severity),
    status: n.status,
    statusLabel: label(NCR_STATUS, n.status),
    productId: n.product_id,
    productNumber: n.product_number ?? null,
    productName: n.product_name ?? null,
    uom: n.product_uom ?? '',
    lot: n.lot,
    serial: n.serial,
    quantity: n.quantity === null ? null : q6(n.quantity),
    receiptId: n.receipt_id,
    receiptNumber: n.receipt_number ?? null,
    moId: n.mo_id,
    moNumber: n.mo_number ?? null,
    supplierId: n.supplier_id,
    supplierNumber: n.supplier_number ?? null,
    supplierName: n.supplier_name ?? null,
    assetId: n.asset_id,
    assetNumber: n.asset_number ?? null,
    assetName: n.asset_name ?? null,
    process: n.process,
    locationId: n.location_id,
    locationCode: n.location_code ? `${n.warehouse_code}/${n.location_code}` : null,
    locationIsQuarantine: n.location_kind === 'quarantine',
    containment: n.containment,
    containedByName: n.contained_by_name ?? null,
    containedAt: n.contained_at,
    rootCauseMethod: n.root_cause_method,
    whys: parseJson<string[]>(n.whys_json, []),
    rootCause: n.root_cause,
    investigatedByName: n.investigated_by_name ?? null,
    investigatedAt: n.investigated_at,
    dispositionNote: n.disposition_note,
    dispositionedByName: n.dispositioned_by_name ?? null,
    dispositionedAt: n.dispositioned_at,
    verificationNote: n.verification_note,
    verifiedByName: n.verified_by_name ?? null,
    verifiedAt: n.verified_at,
    closedByName: n.closed_by_name ?? null,
    closedAt: n.closed_at,
    cancelReason: n.cancel_reason,
    raisedByName: n.raised_by_name ?? null,
    createdAt: n.created_at,
    ageDays: ageDays(n),
  };
}

async function loadNcr(db: D1Database, companyId: string, id: string) {
  const n = await db.prepare(`${NCR_SELECT} WHERE n.company_id = ? AND n.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!n) throw notFound('Nonconformance');
  return n;
}

const CAPA_SELECT = `SELECT x.*, u.name AS responsible_name, n.number AS ncr_number, pb.name AS created_by_name, ab.name AS approved_by_name, db_.name AS done_by_name, vb.name AS verified_by_name, cb.name AS closed_by_name
  FROM erp_qc_capas x LEFT JOIN users u ON u.id = x.responsible_id LEFT JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id
  LEFT JOIN users pb ON pb.id = x.created_by LEFT JOIN users ab ON ab.id = x.approved_by LEFT JOIN users db_ ON db_.id = x.done_by LEFT JOIN users vb ON vb.id = x.verified_by LEFT JOIN users cb ON cb.id = x.closed_by`;

export function capaDTO(x: any, today = todayIso()) {
  const open = ['proposed', 'approved', 'in_progress'].includes(x.status);
  return {
    id: x.id,
    number: x.number,
    kind: x.kind,
    kindLabel: label(CAPA_KINDS, x.kind),
    title: x.title,
    description: x.description,
    ncrId: x.ncr_id,
    ncrNumber: x.ncr_number ?? null,
    responsibleId: x.responsible_id,
    responsibleName: x.responsible_name ?? null,
    dueDate: x.due_date,
    overdue: open && !!x.due_date && x.due_date < today,
    daysOverdue: open && x.due_date && x.due_date < today ? Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${x.due_date}T00:00:00Z`)) / DAY) : 0,
    status: x.status,
    statusLabel: label(CAPA_STATUS, x.status),
    createdById: x.created_by,
    createdByName: x.created_by_name ?? null,
    approvedByName: x.approved_by_name ?? null,
    approvedAt: x.approved_at,
    approvalNote: x.approval_note,
    approvalSodException: !!x.approval_sod,
    startedAt: x.started_at,
    doneByName: x.done_by_name ?? null,
    doneAt: x.done_at,
    doneNote: x.done_note,
    verifiedByName: x.verified_by_name ?? null,
    verifiedAt: x.verified_at,
    verificationNote: x.verification_note,
    effective: x.effective === null ? null : !!x.effective,
    closedByName: x.closed_by_name ?? null,
    closedAt: x.closed_at,
    closureNote: x.closure_note,
    closureSodException: !!x.closure_sod,
    cancelReason: x.cancel_reason,
    createdAt: x.created_at,
  };
}

async function loadCapa(db: D1Database, companyId: string, id: string) {
  const x = await db.prepare(`${CAPA_SELECT} WHERE x.company_id = ? AND x.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!x) throw notFound('Corrective action');
  return x;
}

/** Where a product (its lot or serial) is in stock now: to choose where to scrap, return or release it from. */
async function stockWhere(db: D1Database, companyId: string, productId: string | null, lot: string, serial: string) {
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

// ------------------------------------------------------------------ nonconformance reports

const zNcrFields = {
  title: zText(200).min(1, 'Give the nonconformance a short title'),
  description: zText(4000).min(1, 'Describe the defect'),
  severity: z.string().max(20),
  productId: zId.nullable().optional(),
  lot: zText(80).optional(),
  serial: zText(80).optional(),
  quantity: z.number().min(0).max(1e9).nullable().optional(),
  receiptId: zId.nullable().optional(),
  moId: zId.nullable().optional(),
  supplierId: zId.nullable().optional(),
  assetId: zId.nullable().optional(),
  process: zText(200).optional(),
  locationId: zId.nullable().optional(),
};

/** Every record an NCR names is the company's (a Maintenance asset is only read). */
async function checkRefs(db: D1Database, companyId: string, x: { productId?: string | null; receiptId?: string | null; moId?: string | null; supplierId?: string | null; assetId?: string | null; locationId?: string | null }) {
  const checks: [string | null | undefined, string, string][] = [
    [x.productId, 'erp_products', 'That product is not in this company'],
    [x.receiptId, 'erp_receipts', 'That goods receipt is not in this company'],
    [x.moId, 'erp_mfg_orders', 'That manufacturing order is not in this company'],
    [x.supplierId, 'erp_suppliers', 'That supplier is not in this company'],
    [x.assetId, 'mt_assets', 'That asset is not in this company'],
    [x.locationId, 'erp_locations', 'That location is not in this company'],
  ];
  for (const [id, table, msg] of checks) {
    if (!id) continue;
    const r = await db.prepare(`SELECT 1 AS ok FROM ${table} WHERE company_id = ? AND id = ?`).bind(companyId, id).first();
    if (!r) throw new HttpError(400, msg);
  }
}

ncrRoutes.post('/c/:company/ncrs', async (c) => {
  const a = await requireErp(c, 'quality.raise');
  const db = c.env.DB;
  const input = await body(c, z.object({ ...zNcrFields, inspectionIds: z.array(zId).max(20).optional(), requestKey: zKey.optional() }));
  if (!isKey(SEVERITIES, input.severity)) throw new HttpError(400, 'Choose the severity: minor, major or critical');
  if (input.requestKey) {
    const done = await db.prepare('SELECT id, number FROM erp_qc_ncrs WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string; number: string }>();
    if (done) return c.json({ id: done.id, number: done.number, replayed: true });
  }
  const ids = [...new Set(input.inspectionIds ?? [])];
  const insps: any[] = [];
  for (const id of ids) {
    const i = await db.prepare('SELECT * FROM erp_qc_inspections WHERE company_id = ? AND id = ?').bind(a.companyId, id).first<any>();
    if (!i) throw new HttpError(400, 'That inspection is not in this company');
    insps.push(i);
  }
  const f = insps[0];
  // Where the affected stock is now: the quarantine location a failed inspection moved it to, else where it was inspected.
  let fromInspection: string | null = f?.location_id ?? null;
  if (f && f.quarantined_qty > 0) {
    const m = await db.prepare("SELECT location_id FROM erp_stock_moves WHERE company_id = ? AND source_type = 'quarantine' AND source_id = ? AND move_type = 'quarantine_in' ORDER BY created_at DESC LIMIT 1").bind(a.companyId, f.id).first<{ location_id: string }>();
    fromInspection = m?.location_id ?? fromInspection;
  }
  const x = {
    productId: input.productId !== undefined ? input.productId : (f?.product_id ?? null),
    lot: input.lot ?? f?.lot ?? '',
    serial: input.serial ?? f?.serial ?? '',
    quantity: input.quantity !== undefined ? input.quantity : (f?.quantity ?? null),
    receiptId: input.receiptId !== undefined ? input.receiptId : (f?.receipt_id ?? null),
    moId: input.moId !== undefined ? input.moId : (f?.mo_id ?? null),
    supplierId: input.supplierId !== undefined ? input.supplierId : (f?.supplier_id ?? null),
    assetId: input.assetId ?? null,
    locationId: input.locationId !== undefined ? input.locationId : fromInspection,
  };
  await checkRefs(db, a.companyId, x);
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'ncr');
  try {
    await db.batch([
      db
        .prepare(
          `INSERT INTO erp_qc_ncrs (id, company_id, number, title, description, severity, status, product_id, lot, serial, quantity, receipt_id, mo_id, supplier_id, asset_id, process, location_id, request_key, raised_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, a.companyId, number, input.title, input.description, input.severity, x.productId, x.lot, x.serial, x.quantity, x.receiptId, x.moId, x.supplierId, x.assetId, input.process ?? '', x.locationId, input.requestKey ?? null, a.userId, t, t),
      ...insps.map((i) => db.prepare('INSERT INTO erp_qc_ncr_inspections (company_id, ncr_id, inspection_id) VALUES (?, ?, ?)').bind(a.companyId, id, i.id)),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.raised', entityType: 'ncr', entityId: id, productId: x.productId, summary: `${number} raised (${label(SEVERITIES, input.severity).toLowerCase()}): ${input.title}${insps.length ? ` from ${insps.map((i) => i.number).join(', ')}` : ''}`, after: { quantity: x.quantity, lot: x.lot }, at: t }),
      ...insps.map((i) => eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'inspection.ncr', entityType: 'inspection', entityId: i.id, productId: i.product_id, summary: `${number} raised from ${i.number}`, at: t })),
    ]);
  } catch (e) {
    if (input.requestKey && /UNIQUE constraint failed/i.test(String((e as Error)?.message ?? e))) {
      const done = await db.prepare('SELECT id, number FROM erp_qc_ncrs WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string; number: string }>();
      if (done) return c.json({ id: done.id, number: done.number, replayed: true });
    }
    throw e;
  }
  return c.json({ id, number }, 201);
});

ncrRoutes.get('/c/:company/ncrs', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['n.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const add = (sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  const status = c.req.query('status');
  if (status === 'open') where.push("n.status NOT IN ('closed','cancelled')");
  else if (status && isKey(NCR_STATUS, status)) add('n.status = ?', status);
  const severity = c.req.query('severity');
  if (severity) add('n.severity = ?', severity);
  for (const [k, col] of [
    ['productId', 'n.product_id'],
    ['supplierId', 'n.supplier_id'],
    ['moId', 'n.mo_id'],
    ['receiptId', 'n.receipt_id'],
    ['assetId', 'n.asset_id'],
  ] as const) {
    const v = c.req.query(k);
    if (v) add(`${col} = ?`, v);
  }
  if (c.req.query('from')) add('n.created_at >= ?', Date.parse(`${c.req.query('from')}T00:00:00Z`) || 0);
  if (c.req.query('to')) add('n.created_at < ?', (Date.parse(`${c.req.query('to')}T00:00:00Z`) || 0) + DAY);
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('(n.number LIKE ? OR n.title LIKE ? OR n.description LIKE ? OR p.number LIKE ? OR p.name LIKE ? OR s.legal_name LIKE ? OR n.lot LIKE ? OR n.serial LIKE ?)');
    const l = likeOf(q);
    args.push(l, l, l, l, l, l, l, l);
  }
  const csv = wantsCsv(c);
  const sort = c.req.query('sort') === 'age' ? 'n.created_at ASC' : c.req.query('sort') === 'severity' ? "CASE n.severity WHEN 'critical' THEN 0 WHEN 'major' THEN 1 ELSE 2 END, n.created_at DESC" : 'n.created_at DESC';
  const rows = await db.prepare(`${NCR_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${sort}, n.rowid DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(ncrDTO);
  if (csv)
    return csvResponse('nonconformances', [
      ['NCR', 'Title', 'Severity', 'Status', 'Product', 'Lot', 'Serial', 'Quantity', 'Supplier', 'Receipt', 'Manufacturing order', 'Asset', 'Raised', 'Age (days)', 'Closed'],
      ...list.map((n) => [n.number, n.title, n.severityLabel, n.statusLabel, n.productNumber ?? '', n.lot, n.serial, n.quantity ?? '', n.supplierName ?? '', n.receiptNumber ?? '', n.moNumber ?? '', n.assetNumber ?? '', new Date(n.createdAt).toISOString().slice(0, 10), n.ageDays, n.closedAt ? new Date(n.closedAt).toISOString().slice(0, 10) : '']),
    ]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_qc_ncrs n LEFT JOIN erp_products p ON p.company_id = n.company_id AND p.id = n.product_id LEFT JOIN erp_suppliers s ON s.company_id = n.company_id AND s.id = n.supplier_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ ncrs: list, total: total?.n ?? 0, limit, offset, can: { raise: can(a, 'quality.raise') } });
});

ncrRoutes.get('/c/:company/ncrs/:id', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  const [insps, disps, actions, capas] = await db.batch([
    db.prepare(`${INSP_SELECT} WHERE i.company_id = ? AND i.id IN (SELECT inspection_id FROM erp_qc_ncr_inspections WHERE company_id = ? AND ncr_id = ?) ORDER BY i.created_at`).bind(a.companyId, a.companyId, n.id),
    db.prepare('SELECT * FROM erp_qc_dispositions WHERE company_id = ? AND ncr_id = ? ORDER BY rowid').bind(a.companyId, n.id),
    db
      .prepare(
        `SELECT x.*, u.name AS by_name, fl.code AS from_code, fw.code AS from_wh, tl.code AS to_code, tw.code AS to_wh, d.kind AS disposition_kind,
                (SELECT COALESCE(SUM(m.value_delta_cents), 0) FROM erp_stock_moves m WHERE m.company_id = x.company_id AND m.group_id = x.group_id) AS value_cents
           FROM erp_qc_ncr_actions x LEFT JOIN users u ON u.id = x.created_by LEFT JOIN erp_qc_dispositions d ON d.company_id = x.company_id AND d.id = x.disposition_id
           LEFT JOIN erp_locations fl ON fl.company_id = x.company_id AND fl.id = x.location_id LEFT JOIN erp_warehouses fw ON fw.company_id = fl.company_id AND fw.id = fl.warehouse_id
           LEFT JOIN erp_locations tl ON tl.company_id = x.company_id AND tl.id = x.to_location_id LEFT JOIN erp_warehouses tw ON tw.company_id = tl.company_id AND tw.id = tl.warehouse_id
          WHERE x.company_id = ? AND x.ncr_id = ? ORDER BY x.created_at, x.rowid`,
      )
      .bind(a.companyId, n.id),
    db.prepare(`${CAPA_SELECT} WHERE x.company_id = ? AND x.ncr_id = ? ORDER BY x.created_at`).bind(a.companyId, n.id),
  ]);
  const dispositions = (disps.results as any[]).map((d) => ({ id: d.id, kind: d.kind, kindLabel: label(DISPOSITIONS, d.kind), quantity: q6(d.quantity), doneQty: q6(d.done_qty), remaining: q6(Math.max(0, d.quantity - d.done_qty)), note: d.note, actions: ALLOWED[d.kind as keyof typeof ALLOWED] ?? [] }));
  const capaList = (capas.results as any[]).map((x) => capaDTO(x));
  const allDone = dispositions.every((d) => d.remaining <= EPS);
  const capasSettled = capaList.every((x) => !OPEN_CAPA.includes(x.status));
  const st = n.status;
  return c.json({
    ncr: ncrDTO(n),
    inspections: (insps.results as any[]).map(inspectionDTO),
    dispositions,
    actions: (actions.results as any[]).map((x) => ({
      id: x.id,
      action: x.action,
      actionLabel: label(ACTIONS, x.action),
      dispositionKind: x.disposition_kind,
      quantity: q6(x.quantity),
      from: x.from_code ? `${x.from_wh}/${x.from_code}` : null,
      to: x.to_code ? `${x.to_wh}/${x.to_code}` : null,
      lot: x.lot,
      serial: x.serial,
      valueCents: Number(x.value_cents ?? 0),
      note: x.note,
      byName: x.by_name ?? null,
      createdAt: x.created_at,
    })),
    capas: capaList,
    stock: await stockWhere(db, a.companyId, n.product_id, n.lot, n.serial),
    files: await recordFiles(db, a.companyId, 'ncr', n.id),
    history: await historyOf(db, a.companyId, { entityType: 'ncr', entityId: n.id }),
    labels: { dispositions: DISPOSITIONS, actions: ACTIONS, methods: ROOT_CAUSE_METHODS },
    ready: { dispositionsDone: allDone, capasSettled },
    can: {
      edit: can(a, 'quality.raise') && EDITABLE.includes(st),
      contain: can(a, 'quality.raise') && EDITABLE.includes(st),
      investigate: can(a, 'quality.raise') && ![...['verification', 'closed', 'cancelled']].includes(st),
      disposition: can(a, 'quality.disposition') && EDITABLE.includes(st),
      act: can(a, 'quality.disposition') && ACTIVE.includes(st),
      raiseCapa: can(a, 'capa.propose') && !['closed', 'cancelled'].includes(st),
      toVerification: can(a, 'quality.disposition') && ACTIVE.includes(st) && allDone && capasSettled,
      close: can(a, 'quality.disposition') && st === 'verification',
      cancel: can(a, 'quality.disposition') && EDITABLE.includes(st),
      attach: can(a, 'quality.raise') && !['closed', 'cancelled'].includes(st),
    },
  });
});

ncrRoutes.patch('/c/:company/ncrs/:id', async (c) => {
  const a = await requireErp(c, 'quality.raise');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!EDITABLE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: its details are fixed`);
  const input = await body(c, z.object({ ...zNcrFields, title: zNcrFields.title.optional(), description: zNcrFields.description.optional(), severity: zNcrFields.severity.optional() }));
  if (input.severity !== undefined && !isKey(SEVERITIES, input.severity)) throw new HttpError(400, 'Choose the severity: minor, major or critical');
  const m = {
    title: input.title ?? n.title,
    description: input.description ?? n.description,
    severity: input.severity ?? n.severity,
    productId: input.productId !== undefined ? input.productId : n.product_id,
    lot: input.lot ?? n.lot,
    serial: input.serial ?? n.serial,
    quantity: input.quantity !== undefined ? input.quantity : n.quantity,
    receiptId: input.receiptId !== undefined ? input.receiptId : n.receipt_id,
    moId: input.moId !== undefined ? input.moId : n.mo_id,
    supplierId: input.supplierId !== undefined ? input.supplierId : n.supplier_id,
    assetId: input.assetId !== undefined ? input.assetId : n.asset_id,
    process: input.process ?? n.process,
    locationId: input.locationId !== undefined ? input.locationId : n.location_id,
  };
  await checkRefs(db, a.companyId, m);
  const t = now();
  const res = await db.batch([
    db
      .prepare(`UPDATE erp_qc_ncrs SET title = ?, description = ?, severity = ?, product_id = ?, lot = ?, serial = ?, quantity = ?, receipt_id = ?, mo_id = ?, supplier_id = ?, asset_id = ?, process = ?, location_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('open','contained','investigating')`)
      .bind(m.title, m.description, m.severity, m.productId, m.lot, m.serial, m.quantity, m.receiptId, m.moId, m.supplierId, m.assetId, m.process, m.locationId, t, a.companyId, n.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.updated', entityType: 'ncr', entityId: n.id, productId: m.productId, summary: `${n.number} details changed`, before: { title: n.title, severity: n.severity, quantity: n.quantity }, after: { title: m.title, severity: m.severity, quantity: m.quantity }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND updated_at = ?)', [a.companyId, n.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  return c.json(ncrDTO(await loadNcr(db, a.companyId, n.id)));
});

const zMove = z.object({ fromLocationId: zId.optional(), toLocationId: zId, quantity: z.number().positive().max(1e9) });

ncrRoutes.post('/c/:company/ncrs/:id/contain', async (c) => {
  const a = await requireErp(c, 'quality.raise');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!EDITABLE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: containment is recorded before the disposition`);
  const input = await body(c, z.object({ containment: zText(4000).min(1, 'Say what was done to contain it'), quarantine: zMove.optional(), requestKey: zKey.optional() }));
  if (input.quarantine && !input.requestKey) throw new HttpError(400, 'Send a request key with a stock movement');
  const key = input.requestKey ? `ncr-contain:${input.requestKey}` : null;
  if (key && (await db.prepare('SELECT 1 AS x FROM erp_done WHERE company_id = ? AND key = ?').bind(a.companyId, key).first())) return c.json({ ok: true, replayed: true });
  const t = now();
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId), t);
  let summary = '';
  let to: string | null = null;
  if (input.quarantine) {
    if (!n.product_id) throw new HttpError(400, 'Name the product first: there is no stock to quarantine');
    const from = input.quarantine.fromLocationId ?? n.location_id;
    if (!from) throw new HttpError(400, 'Say where the stock is now');
    const q = await quarantineStock(db, a, ops, { productId: n.product_id, fromLocationId: from, toLocationId: input.quarantine.toLocationId, quantity: input.quarantine.quantity, lot: n.lot, serial: n.serial }, { sourceId: n.id, reference: n.number, reason: `Containment of ${n.number}` });
    summary = `; ${q.summary}`;
    to = q.to.id;
  }
  const before: D1PreparedStatement[] = [
    ...(key ? [onceStmt(db, a.companyId, key, t)] : []),
    db
      .prepare("UPDATE erp_qc_ncrs SET containment = ?, contained_by = ?, contained_at = ?, status = CASE WHEN status = 'open' THEN 'contained' ELSE status END, location_id = COALESCE(?, location_id), updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('open','contained','investigating')")
      .bind(input.containment, a.userId, t, to, t, a.companyId, n.id),
  ];
  const event = eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.contained', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} contained: ${input.containment}${summary}`, after: { status: n.status === 'open' ? 'contained' : n.status }, at: t });
  try {
    const res = await db.batch(input.quarantine ? ops.all(before, [event], { type: 'quarantine', id: n.id }) : [...before, event]);
    if (!res[key ? 1 : 0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) return c.json({ ok: true, replayed: true });
    qualityError(e);
  }
  return c.json({ ok: true, status: n.status === 'open' ? 'contained' : n.status });
});

ncrRoutes.post('/c/:company/ncrs/:id/investigate', async (c) => {
  const a = await requireErp(c, 'quality.raise');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (['verification', 'closed', 'cancelled'].includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}`);
  const input = await body(c, z.object({ method: z.string().max(20), whys: z.array(zText(1000)).max(5).optional(), rootCause: zText(4000).optional() }));
  if (!isKey(ROOT_CAUSE_METHODS, input.method)) throw new HttpError(400, 'Choose five whys or free text');
  const whys = input.method === 'five_whys' ? (input.whys ?? []).filter(Boolean) : [];
  if (input.method === 'five_whys' && !whys.length) throw new HttpError(400, 'Answer at least the first why');
  const rootCause = input.rootCause || (whys.length ? whys[whys.length - 1] : '');
  if (!rootCause) throw new HttpError(400, 'Give the root cause');
  const t = now();
  const res = await db.batch([
    db
      .prepare("UPDATE erp_qc_ncrs SET root_cause_method = ?, whys_json = ?, root_cause = ?, investigated_by = ?, investigated_at = ?, status = CASE WHEN status IN ('open','contained') THEN 'investigating' ELSE status END, updated_at = ? WHERE company_id = ? AND id = ? AND status NOT IN ('verification','closed','cancelled')")
      .bind(input.method, JSON.stringify(whys), rootCause, a.userId, t, t, a.companyId, n.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.investigated', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} root cause (${label(ROOT_CAUSE_METHODS, input.method).toLowerCase()}): ${rootCause}`, after: { whys }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND investigated_at = ?)', [a.companyId, n.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  return c.json({ ok: true, status: ['open', 'contained'].includes(n.status) ? 'investigating' : n.status });
});

ncrRoutes.post('/c/:company/ncrs/:id/disposition', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!EDITABLE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: its disposition is already decided`);
  const input = await body(c, z.object({ lines: z.array(z.object({ kind: z.string().max(30), quantity: z.number().min(0).max(1e9), note: zText(1000).optional() })).min(1).max(6), note: zText(2000).optional() }));
  const kinds = new Set<string>();
  for (const l of input.lines) {
    if (!isKey(DISPOSITIONS, l.kind)) throw new HttpError(400, 'Choose use as is, rework, repair, scrap, return to supplier or regrade');
    if (kinds.has(l.kind)) throw new HttpError(400, `${label(DISPOSITIONS, l.kind)}: once per disposition`);
    kinds.add(l.kind);
    if (l.kind === 'return_to_supplier' && !n.supplier_id) throw new HttpError(400, 'Name the supplier on the nonconformance before returning to it');
    if ((STOCK_ACTIONS.has(ALLOWED[l.kind][0]) || l.kind !== 'use_as_is') && l.quantity > 0 && !n.product_id && l.kind !== 'rework' && l.kind !== 'repair' && l.kind !== 'regrade') throw new HttpError(400, 'Name the product first: scrap and returns move stock');
  }
  const total = q6(input.lines.reduce((s, l) => s + l.quantity, 0));
  if (n.quantity !== null && total > n.quantity + EPS) throw new HttpError(400, `The disposition covers ${total}, more than the ${q6(n.quantity)} affected`);
  if (!(total > 0)) throw new HttpError(400, 'Give the quantity of each disposition');
  const t = now();
  const what = input.lines.map((l) => `${label(DISPOSITIONS, l.kind).toLowerCase()} ${l.quantity}`).join(', ');
  try {
    await db.batch([
      onceStmt(db, a.companyId, `ncr-disposition:${n.id}`, t),
      db.prepare("UPDATE erp_qc_ncrs SET status = 'dispositioned', disposition_note = ?, dispositioned_by = ?, dispositioned_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('open','contained','investigating')").bind(input.note ?? '', a.userId, t, t, a.companyId, n.id),
      ...input.lines.map((l) => db.prepare('INSERT INTO erp_qc_dispositions (id, company_id, ncr_id, kind, quantity, note) SELECT ?, ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND dispositioned_at = ?)').bind(newId(), a.companyId, n.id, l.kind, l.quantity, l.note ?? '', a.companyId, n.id, t)),
      eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.dispositioned', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} disposition: ${what}${input.note ? `. ${input.note}` : ''}`, after: { lines: input.lines }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND dispositioned_at = ?)', [a.companyId, n.id, t]),
    ]);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_done/i.test(String((e as Error)?.message ?? e))) badState(`${n.number} was dispositioned at the same moment by someone else: reload it`);
    throw e;
  }
  const fresh = await loadNcr(db, a.companyId, n.id);
  if (fresh.status !== 'dispositioned' || fresh.dispositioned_at !== t) badState(`${n.number} changed at the same moment: reload it`);
  return c.json({ ok: true, status: 'dispositioned' });
});

ncrRoutes.post('/c/:company/ncrs/:id/actions', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const input = await body(c, z.object({ dispositionId: zId, action: z.string().max(30), quantity: z.number().min(0).max(1e9).optional(), fromLocationId: zId.optional(), toLocationId: zId.optional(), note: zText(2000).optional(), requestKey: zKey }));
  const replay = async () => {
    const done = await db.prepare('SELECT id FROM erp_qc_ncr_actions WHERE company_id = ? AND request_key = ?').bind(a.companyId, input.requestKey).first<{ id: string }>();
    return done ? c.json({ ok: true, id: done.id, replayed: true }) : null;
  };
  const first = await replay();
  if (first) return first;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!ACTIVE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: dispositions are carried out once decided and before verification`);
  const d = await db.prepare('SELECT * FROM erp_qc_dispositions WHERE company_id = ? AND ncr_id = ? AND id = ?').bind(a.companyId, n.id, input.dispositionId).first<any>();
  if (!d) throw notFound('Disposition');
  if (!isKey(ACTIONS, input.action) || !(ALLOWED[d.kind as keyof typeof ALLOWED] ?? []).includes(input.action as keyof typeof ACTIONS)) {
    throw new HttpError(400, `${label(DISPOSITIONS, d.kind)} is carried out by: ${(ALLOWED[d.kind as keyof typeof ALLOWED] ?? []).map((x) => label(ACTIONS, x).toLowerCase()).join(', ')}`);
  }
  const counted = COUNTED.has(input.action);
  const qty = input.quantity ?? 0;
  if (counted && !(qty > 0)) throw new HttpError(400, 'Give the quantity');
  if (counted && qty > q6(d.quantity - d.done_qty) + EPS) badState(`${label(DISPOSITIONS, d.kind)}: ${q6(d.quantity - d.done_qty)} left to carry out`);
  if (input.action === 'rework_note' && !input.note) throw new HttpError(400, 'Write what is to be reworked or repaired, and how');
  const t = now();
  const id = newId();
  const ops = new StockOps(db, a, await loadSettings(db, a.companyId), t);
  let summary = '';
  let from: string | null = null;
  let to: string | null = null;
  if (STOCK_ACTIONS.has(input.action)) {
    if (!n.product_id) throw new HttpError(400, 'This nonconformance names no product: no stock to move');
    from = input.fromLocationId ?? n.location_id;
    if (!from) throw new HttpError(400, 'Say where the stock is');
    const ref = `${n.number}`;
    if (input.action === 'release') {
      if (!input.toLocationId) throw new HttpError(400, 'Choose where it goes');
      const r = await releaseStock(db, a, ops, { productId: n.product_id, fromLocationId: from, toLocationId: input.toLocationId, quantity: qty, lot: n.lot, serial: n.serial }, { sourceId: n.id, reference: ref, reason: input.note || `${label(DISPOSITIONS, d.kind)} under ${n.number}` });
      to = r.to.id;
      summary = r.summary;
    } else {
      const { p, l, key } = await stockKey(db, a.companyId, { productId: n.product_id, locationId: from, lot: n.lot, serial: n.serial }, { incoming: false, quantity: qty });
      if (input.action === 'scrap') {
        await ops.takeOut('scrap', key, qty, { source: 'scrap', sourceId: n.id, reference: ref, reason: input.note || `Scrapped under ${n.number}` });
        summary = `Scrapped ${qty} ${p.uom} of ${p.number}${key.lot ? ` lot ${key.lot}` : ''} at ${l.warehouse_code}/${l.code}`;
      } else {
        const supplier = n.supplier_number ? `${n.supplier_number} ${n.supplier_name}` : 'the supplier';
        await ops.takeOut('supplier_return', key, qty, { source: 'supplier_return', sourceId: n.id, reference: `${ref} to ${supplier}`.slice(0, 200), reason: input.note || `Returned under ${n.number}` });
        summary = `Returned ${qty} ${p.uom} of ${p.number}${key.lot ? ` lot ${key.lot}` : ''} from ${l.warehouse_code}/${l.code} to ${supplier}`;
      }
    }
  } else if (input.action === 'done') {
    summary = `${label(DISPOSITIONS, d.kind)} of ${qty} done where it stands${input.note ? `: ${input.note}` : ''}`;
  } else {
    summary = `${label(DISPOSITIONS, d.kind)} note${qty ? ` for ${qty}` : ''}: ${input.note}`;
  }
  const before: D1PreparedStatement[] = [
    // first, so a second submission with the same key fails before anything else happens
    db
      .prepare('INSERT INTO erp_qc_ncr_actions (id, company_id, ncr_id, disposition_id, action, quantity, product_id, location_id, to_location_id, lot, serial, group_id, note, request_key, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, n.id, d.id, input.action, qty, n.product_id, from, to, n.lot, n.serial, STOCK_ACTIONS.has(input.action) ? ops.groupId : null, input.note ?? '', input.requestKey, a.userId, t),
    ...(counted ? [db.prepare('UPDATE erp_qc_dispositions SET done_qty = round(done_qty + ?, 6) WHERE company_id = ? AND id = ?').bind(qty, a.companyId, d.id)] : []),
    db.prepare('UPDATE erp_qc_ncrs SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, n.id),
  ];
  const event = eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `ncr.${input.action}`, entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number}: ${summary}`, after: { action: input.action, quantity: qty }, at: t });
  try {
    await db.batch(STOCK_ACTIONS.has(input.action) ? ops.all(before, [event], { type: input.action === 'release' ? 'quarantine' : input.action, id: n.id }) : [...before, event]);
  } catch (e) {
    if (/UNIQUE constraint failed: erp_qc_ncr_actions|erp_qc_ncr_actions_request/i.test(String((e as Error)?.message ?? e))) {
      const again = await replay();
      if (again) return again;
    }
    qualityError(e);
  }
  return c.json({ ok: true, id, summary, groupId: STOCK_ACTIONS.has(input.action) ? ops.groupId : null }, 201);
});

ncrRoutes.post('/c/:company/ncrs/:id/to-verification', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!ACTIVE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}`);
  const left = await db.prepare('SELECT kind, quantity - done_qty AS left FROM erp_qc_dispositions WHERE company_id = ? AND ncr_id = ? AND done_qty < quantity - 1e-9').bind(a.companyId, n.id).all<any>();
  if (left.results.length) badState(`Carry out the disposition first: ${left.results.map((x) => `${label(DISPOSITIONS, x.kind).toLowerCase()} ${q6(x.left)} left`).join(', ')}`);
  const open = await db.prepare(`SELECT number, status FROM erp_qc_capas WHERE company_id = ? AND ncr_id = ? AND status IN ('proposed','approved','in_progress','done')`).bind(a.companyId, n.id).all<any>();
  if (open.results.length) badState(`Corrective actions not yet verified: ${open.results.map((x) => `${x.number} (${label(CAPA_STATUS, x.status).toLowerCase()})`).join(', ')}`);
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_qc_ncrs SET status = 'verification', updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('dispositioned','capa')").bind(t, a.companyId, n.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.verification', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} ready for verification: the disposition is carried out and its corrective actions are verified`, after: { status: 'verification' }, at: t }, "EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND status = 'verification' AND updated_at = ?)", [a.companyId, n.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  return c.json({ ok: true, status: 'verification' });
});

ncrRoutes.post('/c/:company/ncrs/:id/close', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (n.status !== 'verification') badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: it is closed after verification`);
  const input = await body(c, z.object({ verificationNote: zText(4000).min(1, 'Record how the fix was verified') }));
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_qc_ncrs SET status = 'closed', verification_note = ?, verified_by = ?, verified_at = ?, closed_by = ?, closed_at = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'verification'").bind(input.verificationNote, a.userId, t, a.userId, t, t, a.companyId, n.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.closed', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} verified and closed: ${input.verificationNote}`, after: { status: 'closed' }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND closed_at = ?)', [a.companyId, n.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  return c.json({ ok: true, status: 'closed' });
});

ncrRoutes.post('/c/:company/ncrs/:id/cancel', async (c) => {
  const a = await requireErp(c, 'quality.disposition');
  const db = c.env.DB;
  const n = await loadNcr(db, a.companyId, c.req.param('id'));
  if (!EDITABLE.includes(n.status)) badState(`${n.number} is ${label(NCR_STATUS, n.status).toLowerCase()}: only one without a disposition can be cancelled`);
  const input = await body(c, z.object({ reason: zText(1000).min(1, 'Say why it is cancelled') }));
  const t = now();
  const res = await db.batch([
    db.prepare("UPDATE erp_qc_ncrs SET status = 'cancelled', cancel_reason = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status IN ('open','contained','investigating')").bind(input.reason, t, a.companyId, n.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.cancelled', entityType: 'ncr', entityId: n.id, productId: n.product_id, summary: `${n.number} cancelled: ${input.reason}`, at: t }, "EXISTS (SELECT 1 FROM erp_qc_ncrs WHERE company_id = ? AND id = ? AND status = 'cancelled' AND updated_at = ?)", [a.companyId, n.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${n.number} changed at the same moment: reload it`);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ corrective and preventive actions

async function person(db: D1Database, a: ErpAccess, userId: string) {
  const p = (await companyPeople(db, a)).find((x) => x.id === userId);
  if (!p) throw new HttpError(400, 'Choose a person of this company');
  return p;
}

ncrRoutes.get('/c/:company/capas', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const today = todayIso();
  const where = ['x.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const add = (sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  const status = c.req.query('status');
  if (status === 'open') where.push("x.status IN ('proposed','approved','in_progress','done','verified')");
  else if (status && isKey(CAPA_STATUS, status)) add('x.status = ?', status);
  if (c.req.query('kind')) add('x.kind = ?', c.req.query('kind'));
  if (c.req.query('ncrId')) add('x.ncr_id = ?', c.req.query('ncrId'));
  if (c.req.query('overdue') === '1') add("x.status IN ('proposed','approved','in_progress') AND x.due_date IS NOT NULL AND x.due_date < ?", today);
  if (c.req.query('mine') === '1') add('x.responsible_id = ?', a.userId);
  const q = c.req.query('q')?.trim();
  if (q) {
    where.push('(x.number LIKE ? OR x.title LIKE ? OR x.description LIKE ? OR n.number LIKE ?)');
    const l = likeOf(q);
    args.push(l, l, l, l);
  }
  const csv = wantsCsv(c);
  const rows = await db.prepare(`${CAPA_SELECT} WHERE ${where.join(' AND ')} ORDER BY x.status IN ('closed','cancelled'), COALESCE(x.due_date, '9999'), x.created_at DESC LIMIT ? OFFSET ?`).bind(...args, csv ? 10000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map((x) => capaDTO(x, today));
  if (csv)
    return csvResponse('corrective-actions', [
      ['Action', 'Kind', 'Title', 'Status', 'NCR', 'Responsible', 'Due', 'Overdue (days)', 'Approved by', 'Done', 'Verified', 'Closed'],
      ...list.map((x) => [x.number, x.kindLabel, x.title, x.statusLabel, x.ncrNumber ?? '', x.responsibleName ?? '', x.dueDate ?? '', x.daysOverdue || '', x.approvedByName ?? '', x.doneAt ? new Date(x.doneAt).toISOString().slice(0, 10) : '', x.verifiedAt ? new Date(x.verifiedAt).toISOString().slice(0, 10) : '', x.closedAt ? new Date(x.closedAt).toISOString().slice(0, 10) : '']),
    ]);
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_qc_capas x LEFT JOIN erp_qc_ncrs n ON n.company_id = x.company_id AND n.id = x.ncr_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ capas: list, total: total?.n ?? 0, limit, offset, can: { propose: can(a, 'capa.propose') } });
});

ncrRoutes.post('/c/:company/capas', async (c) => {
  const a = await requireErp(c, 'capa.propose');
  const db = c.env.DB;
  const input = await body(c, z.object({ kind: z.string().max(20), title: zText(200).min(1, 'Name the action'), description: zText(4000).optional(), ncrId: zId.nullable().optional(), responsibleId: zId, dueDate: zDate.optional() }));
  if (!isKey(CAPA_KINDS, input.kind)) throw new HttpError(400, 'Choose corrective or preventive');
  const resp = await person(db, a, input.responsibleId);
  let ncr: any = null;
  if (input.ncrId) {
    ncr = await loadNcr(db, a.companyId, input.ncrId).catch(() => null);
    if (!ncr) throw new HttpError(400, 'That nonconformance is not in this company');
    if (['closed', 'cancelled', 'verification'].includes(ncr.status)) badState(`${ncr.number} is ${label(NCR_STATUS, ncr.status).toLowerCase()}`);
  }
  const id = newId();
  const t = now();
  const number = await nextNumber(db, a.companyId, 'capa');
  await db.batch([
    db
      .prepare("INSERT INTO erp_qc_capas (id, company_id, number, kind, title, description, ncr_id, responsible_id, due_date, status, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'proposed', ?, ?, ?)")
      .bind(id, a.companyId, number, input.kind, input.title, input.description ?? '', ncr?.id ?? null, resp.id, input.dueDate ?? null, a.userId, t, t),
    ...(ncr
      ? [
          db.prepare("UPDATE erp_qc_ncrs SET status = 'capa', updated_at = ? WHERE company_id = ? AND id = ? AND status = 'dispositioned'").bind(t, a.companyId, ncr.id),
          eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'ncr.capa', entityType: 'ncr', entityId: ncr.id, productId: ncr.product_id, summary: `${number} (${label(CAPA_KINDS, input.kind).toLowerCase()} action) raised: ${input.title}`, at: t }),
        ]
      : []),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'capa.proposed', entityType: 'capa', entityId: id, summary: `${number} proposed: ${input.title}, ${resp.name} responsible${input.dueDate ? `, due ${input.dueDate}` : ''}${ncr ? ` (from ${ncr.number})` : ''}`, at: t }),
  ]);
  return c.json(capaDTO(await loadCapa(db, a.companyId, id)), 201);
});

ncrRoutes.get('/c/:company/capas/:id', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  const mine = x.responsible_id === a.userId;
  const manager = can(a, 'capa.approve');
  const st = x.status;
  return c.json({
    capa: capaDTO(x),
    files: await recordFiles(db, a.companyId, 'capa', x.id),
    history: await historyOf(db, a.companyId, { entityType: 'capa', entityId: x.id }),
    can: {
      edit: can(a, 'capa.propose') && st === 'proposed',
      approve: manager && st === 'proposed',
      start: (mine || manager) && st === 'approved',
      done: (mine || manager) && (st === 'approved' || st === 'in_progress'),
      verify: manager && st === 'done',
      close: manager && st === 'verified',
      cancel: manager && ['proposed', 'approved', 'in_progress'].includes(st),
      attach: (mine || can(a, 'capa.propose')) && !['closed', 'cancelled'].includes(st),
    },
  });
});

ncrRoutes.patch('/c/:company/capas/:id', async (c) => {
  const a = await requireErp(c, 'capa.propose');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  if (x.status !== 'proposed') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}: it is changed only while proposed`);
  const input = await body(c, z.object({ title: zText(200).min(1).optional(), description: zText(4000).optional(), responsibleId: zId.optional(), dueDate: zDate.optional(), kind: z.string().max(20).optional() }));
  if (input.kind !== undefined && !isKey(CAPA_KINDS, input.kind)) throw new HttpError(400, 'Choose corrective or preventive');
  if (input.responsibleId) await person(db, a, input.responsibleId);
  const t = now();
  const res = await db.batch([
    db
      .prepare("UPDATE erp_qc_capas SET title = ?, description = ?, responsible_id = ?, due_date = ?, kind = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'proposed'")
      .bind(input.title ?? x.title, input.description ?? x.description, input.responsibleId ?? x.responsible_id, input.dueDate !== undefined ? input.dueDate : x.due_date, input.kind ?? x.kind, t, a.companyId, x.id),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action: 'capa.updated', entityType: 'capa', entityId: x.id, summary: `${x.number} changed`, before: { title: x.title, dueDate: x.due_date, responsible: x.responsible_id }, after: { title: input.title ?? x.title, dueDate: input.dueDate ?? x.due_date, responsible: input.responsibleId ?? x.responsible_id }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_capas WHERE company_id = ? AND id = ? AND updated_at = ?)', [a.companyId, x.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${x.number} changed at the same moment: reload it`);
  return c.json(capaDTO(await loadCapa(db, a.companyId, x.id)));
});

/** One status step of a corrective action, made only while it is still in `from` (one UPDATE with its guard). */
async function capaStep(db: D1Database, a: ErpAccess, x: any, from: string[], set: Record<string, unknown>, summary: string, action: string) {
  const t = now();
  const cols = Object.keys(set);
  const res = await db.batch([
    db.prepare(`UPDATE erp_qc_capas SET ${cols.map((k) => `${k} = ?`).join(', ')}, updated_at = ? WHERE company_id = ? AND id = ? AND status IN (${from.map(() => '?').join(',')})`).bind(...cols.map((k) => set[k]), t, a.companyId, x.id, ...from),
    eventStmtIf(db, { companyId: a.companyId, actorId: a.userId, action, entityType: 'capa', entityId: x.id, summary: `${x.number} ${summary}`, before: { status: x.status }, after: { status: set.status }, at: t }, 'EXISTS (SELECT 1 FROM erp_qc_capas WHERE company_id = ? AND id = ? AND updated_at = ?)', [a.companyId, x.id, t]),
  ]);
  if (!res[0].meta.changes) badState(`${x.number} changed at the same moment: reload it`);
  return t;
}

ncrRoutes.post('/c/:company/capas/:id/approve', async (c) => {
  const a = await requireErp(c, 'capa.approve');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  if (x.status !== 'proposed') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}`);
  const input = await body(c, z.object({ note: zText(2000).optional() }));
  const sod = segregationOf(a, [
    [x.created_by, 'proposed this action'],
    [x.responsible_id, 'are responsible for carrying out this action'],
  ]);
  const t = now();
  await capaStep(db, a, x, ['proposed'], { status: 'approved', approved_by: a.userId, approved_at: t, approval_note: input.note ?? '', approval_sod: sod ? 1 : 0 }, `approved${input.note ? `: ${input.note}` : ''}${sod ? ' (one-person company: the segregation-of-duties exception is recorded)' : ''}`, 'capa.approved');
  return c.json({ ok: true, status: 'approved', sodException: sod });
});

async function responsibleOrManager(db: D1Database, a: ErpAccess, id: string) {
  const x = await loadCapa(db, a.companyId, id);
  if (x.responsible_id !== a.userId) assertCan(a, 'capa.approve');
  return x;
}

ncrRoutes.post('/c/:company/capas/:id/start', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const x = await responsibleOrManager(db, a, c.req.param('id'));
  if (x.status !== 'approved') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}: it starts once approved`);
  await capaStep(db, a, x, ['approved'], { status: 'in_progress', started_at: now() }, 'started', 'capa.started');
  return c.json({ ok: true, status: 'in_progress' });
});

ncrRoutes.post('/c/:company/capas/:id/done', async (c) => {
  const a = await requireErp(c, 'quality.view');
  const db = c.env.DB;
  const x = await responsibleOrManager(db, a, c.req.param('id'));
  if (x.status !== 'approved' && x.status !== 'in_progress') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}: it is done once approved`);
  const input = await body(c, z.object({ note: zText(4000).min(1, 'Say what was done') }));
  const t = now();
  await capaStep(db, a, x, ['approved', 'in_progress'], { status: 'done', started_at: x.started_at ?? t, done_by: a.userId, done_at: t, done_note: input.note }, `done: ${input.note}`, 'capa.done');
  return c.json({ ok: true, status: 'done' });
});

ncrRoutes.post('/c/:company/capas/:id/verify', async (c) => {
  const a = await requireErp(c, 'capa.approve');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  if (x.status !== 'done') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}: its effectiveness is checked once it is done`);
  const input = await body(c, z.object({ effective: z.boolean(), note: zText(4000).min(1, 'Record how the effectiveness was checked') }));
  const t = now();
  if (input.effective) await capaStep(db, a, x, ['done'], { status: 'verified', verified_by: a.userId, verified_at: t, verification_note: input.note, effective: 1 }, `verified effective: ${input.note}`, 'capa.verified');
  else await capaStep(db, a, x, ['done'], { status: 'in_progress', verified_by: a.userId, verified_at: t, verification_note: input.note, effective: 0 }, `not effective, back in progress: ${input.note}`, 'capa.not_effective');
  return c.json({ ok: true, status: input.effective ? 'verified' : 'in_progress' });
});

ncrRoutes.post('/c/:company/capas/:id/close', async (c) => {
  const a = await requireErp(c, 'capa.approve');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  if (x.status !== 'verified') badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}: it is closed once verified effective`);
  const input = await body(c, z.object({ note: zText(2000).optional() }));
  const sod = segregationOf(
    a,
    [
      [x.done_by, 'carried out this action'],
      [x.responsible_id, 'are responsible for this action'],
    ],
    'close it',
  );
  await capaStep(db, a, x, ['verified'], { status: 'closed', closed_by: a.userId, closed_at: now(), closure_note: input.note ?? '', closure_sod: sod ? 1 : 0 }, `closed${input.note ? `: ${input.note}` : ''}${sod ? ' (one-person company: the segregation-of-duties exception is recorded)' : ''}`, 'capa.closed');
  return c.json({ ok: true, status: 'closed', sodException: sod });
});

ncrRoutes.post('/c/:company/capas/:id/cancel', async (c) => {
  const a = await requireErp(c, 'capa.approve');
  const db = c.env.DB;
  const x = await loadCapa(db, a.companyId, c.req.param('id'));
  if (!['proposed', 'approved', 'in_progress'].includes(x.status)) badState(`${x.number} is ${label(CAPA_STATUS, x.status).toLowerCase()}`);
  const input = await body(c, z.object({ reason: zText(1000).min(1, 'Say why it is cancelled') }));
  await capaStep(db, a, x, ['proposed', 'approved', 'in_progress'], { status: 'cancelled', cancel_reason: input.reason }, `cancelled: ${input.reason}`, 'capa.cancelled');
  return c.json({ ok: true, status: 'cancelled' });
});

