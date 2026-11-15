// BIZOMAT ERP, Release 2: inventory and warehouses (/api/erp/c/:company/...). Who may do what: access.ts
// (inventory.view, inventory.operate, inventory.approve, inventory.setup). Every stock change goes through stock.ts in
// one transaction with its movement in the ledger.
//
//   warehouses, locations (a tree: store, zone, rack, shelf, bin; kinds normal, quarantine, work in progress, finished
//   goods, receiving, dispatch), QR labels for products and locations (qr.ts, SVG made here)
//   products/:id/stock, products/:id/stock-settings   tracking, inspection, reorder point, minimum, maximum
//   stock (per product, or per location, lot and serial), movements, scan (a typed or scanned code to its record)
//   stock/:op   issue, transfer, quarantine, release, customer-return, supplier-return, scrap
//   reservations, adjustments (approval above the company's threshold), counts (stocktakes and cycle counts)
//   valuation, trace (a lot or serial from its supplier and order to every later move)

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { assertCan, can, requireErp, segregation, type ErpAccess } from './access';
import { loadSettings, COSTING_LABELS, type ErpSettings } from './settings';
import { MOVE_LABELS, StockOps, availableByProduct, onOrderByProduct, onceStmt, q6, runStock, type StockKey } from './stock';
import { qrSvg } from './qr';
import { NUMBER_RE, badState, csvResponse, dollars, eventStmt, historyOf, likeOf, nextNumber, paging, wantsCsv, zDate, zId, zText } from './util';

export const inventoryRoutes = new Hono<AppEnv>();

export const LOCATION_LEVELS = ['store', 'zone', 'rack', 'shelf', 'bin'] as const;
export const LOCATION_KINDS = ['normal', 'quarantine', 'work_in_progress', 'finished_goods', 'receiving', 'dispatch'] as const;
export const KIND_LABELS: Record<(typeof LOCATION_KINDS)[number], string> = {
  normal: 'Normal',
  quarantine: 'Quarantine',
  work_in_progress: 'Work in progress',
  finished_goods: 'Finished goods',
  receiving: 'Receiving',
  dispatch: 'Dispatch',
};
export const LEVEL_LABELS: Record<(typeof LOCATION_LEVELS)[number], string> = { store: 'Store', zone: 'Zone', rack: 'Rack', shelf: 'Shelf', bin: 'Bin' };

const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;
const zCode = zText(40).regex(CODE_RE, 'Use letters, digits and . _ / - (up to 40)');
const zLot = zText(80).optional();
const zSerial = zText(80).optional();
const zQ = z.number().positive().max(1e9);
const zRequestKey = z.string().trim().min(8).max(80).optional();

// ------------------------------------------------------------------ loading

export interface LocationRow {
  id: string;
  warehouse_id: string;
  parent_id: string | null;
  code: string;
  name: string;
  level: string;
  kind: string;
  archived_at: number | null;
  warehouse_code: string;
  warehouse_name: string;
  warehouse_archived: number | null;
}

export async function loadLocation(db: D1Database, companyId: string, id: string): Promise<LocationRow> {
  const l = await db
    .prepare('SELECT l.*, w.code AS warehouse_code, w.name AS warehouse_name, w.archived_at AS warehouse_archived FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.id = ?')
    .bind(companyId, String(id).slice(0, 64))
    .first<LocationRow>();
  if (!l) throw notFound('Location');
  return l;
}

export interface StockProduct {
  id: string;
  number: string;
  name: string;
  type: string;
  uom: string;
  standard_cost_cents: number | null;
  currency: string;
  archived_at: number | null;
  track_lots: number;
  track_serials: number;
  track_expiry: number;
  inspection_required: number;
  reorder_point: number | null;
  min_qty: number | null;
  max_qty: number | null;
  default_location_id: string | null;
}

export async function loadStockProduct(db: D1Database, companyId: string, id: string): Promise<StockProduct> {
  const p = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.type, p.uom, p.standard_cost_cents, p.currency, p.archived_at,
              COALESCE(s.track_lots, 0) AS track_lots, COALESCE(s.track_serials, 0) AS track_serials, COALESCE(s.track_expiry, 0) AS track_expiry,
              COALESCE(s.inspection_required, 0) AS inspection_required, s.reorder_point, s.min_qty, s.max_qty, s.default_location_id
         FROM erp_products p LEFT JOIN erp_product_stock s ON s.company_id = p.company_id AND s.product_id = p.id
        WHERE p.company_id = ? AND p.id = ?`,
    )
    .bind(companyId, String(id).slice(0, 64))
    .first<StockProduct>();
  if (!p) throw notFound('Product');
  return p;
}

/**
 * The stock key for an operation, checked: a stocked product (not a service), a location of this company (open, for
 * stock coming in), the lot and serial its tracking asks for (and none when it does not track them).
 */
export async function stockKey(db: D1Database, companyId: string, input: { productId: string; locationId: string; lot?: string; serial?: string }, o: { incoming: boolean; quantity?: number; expiry?: string | null }) {
  const p = await loadStockProduct(db, companyId, input.productId);
  if (p.type === 'service') throw new HttpError(400, `${p.number} is a service: services are not kept in stock`);
  const l = await loadLocation(db, companyId, input.locationId);
  if (o.incoming && (l.archived_at || l.warehouse_archived)) throw new HttpError(400, `Location ${l.code} is archived`);
  const lot = p.track_lots ? (input.lot ?? '').trim() : '';
  const serial = p.track_serials ? (input.serial ?? '').trim() : '';
  if (p.track_lots && !lot) throw new HttpError(400, `${p.number} is tracked by lot: give the lot number`);
  if (p.track_serials && !serial) throw new HttpError(400, `${p.number} is tracked by serial number: give the serial number`);
  if (p.track_serials && o.quantity !== undefined && o.quantity !== 1) throw new HttpError(400, 'A serial number is one unit: use a quantity of 1');
  if (o.incoming && p.track_expiry && !o.expiry) throw new HttpError(400, `${p.number} has an expiry date: give it`);
  if (o.quantity !== undefined && p.track_serials && !Number.isInteger(o.quantity)) throw new HttpError(400, 'Use whole units');
  const key: StockKey = { productId: p.id, locationId: l.id, lot, serial };
  return { p, l, key };
}

async function stockRow(db: D1Database, companyId: string, k: StockKey) {
  return db
    .prepare('SELECT * FROM erp_stock WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?')
    .bind(companyId, k.productId, k.locationId, k.lot ?? '', k.serial ?? '')
    .first<{ id: string; on_hand: number; reserved: number; expiry: string | null }>();
}

const locationDTO = (l: any) => ({
  id: l.id,
  warehouseId: l.warehouse_id,
  warehouseCode: l.warehouse_code ?? null,
  parentId: l.parent_id,
  code: l.code,
  fullCode: l.warehouse_code ? `${l.warehouse_code}/${l.code}` : l.code,
  name: l.name,
  level: l.level,
  levelLabel: LEVEL_LABELS[l.level as keyof typeof LEVEL_LABELS] ?? l.level,
  kind: l.kind,
  kindLabel: KIND_LABELS[l.kind as keyof typeof KIND_LABELS] ?? l.kind,
  archived: !!l.archived_at,
  onHand: l.on_hand === undefined ? undefined : q6(Number(l.on_hand ?? 0)),
});

// ------------------------------------------------------------------ warehouses and locations

inventoryRoutes.get('/c/:company/warehouses', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const rows = await db
    .prepare(
      `SELECT w.*, (SELECT COUNT(*) FROM erp_locations l WHERE l.company_id = w.company_id AND l.warehouse_id = w.id AND l.archived_at IS NULL) AS locations,
              (SELECT COALESCE(SUM(s.on_hand), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = w.company_id AND l.warehouse_id = w.id) AS on_hand
         FROM erp_warehouses w WHERE w.company_id = ? ${c.req.query('archived') === '1' ? '' : 'AND w.archived_at IS NULL'} ORDER BY w.code COLLATE NOCASE`,
    )
    .bind(a.companyId)
    .all<any>();
  return c.json({
    warehouses: rows.results.map((w) => ({ id: w.id, code: w.code, name: w.name, address: w.address, archived: !!w.archived_at, locations: w.locations, onHand: q6(Number(w.on_hand)) })),
    can: { setup: can(a, 'inventory.setup') },
  });
});

inventoryRoutes.post('/c/:company/warehouses', async (c) => {
  const a = await requireErp(c, 'inventory.setup');
  const db = c.env.DB;
  const input = await body(c, z.object({ code: zCode, name: zText(120).min(1), address: zText(500).optional() }));
  const dup = await db.prepare('SELECT 1 FROM erp_warehouses WHERE company_id = ? AND code = ?').bind(a.companyId, input.code).first();
  if (dup) throw new HttpError(409, `A warehouse ${input.code} already exists`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO erp_warehouses (id, company_id, code, name, address, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.code, input.name, input.address ?? '', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'warehouse.created', entityType: 'warehouse', entityId: id, summary: `Warehouse ${input.code} ${input.name} created`, after: input, at: t }),
  ]);
  return c.json({ id, code: input.code, name: input.name, address: input.address ?? '', archived: false, locations: 0, onHand: 0 }, 201);
});

inventoryRoutes.patch('/c/:company/warehouses/:id', async (c) => {
  const a = await requireErp(c, 'inventory.setup');
  const db = c.env.DB;
  const w = await db.prepare('SELECT * FROM erp_warehouses WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!w) throw notFound('Warehouse');
  const input = await body(c, z.object({ name: zText(120).min(1).optional(), address: zText(500).optional(), archived: z.boolean().optional() }));
  if (input.archived === true && !w.archived_at) {
    const stock = await db.prepare('SELECT 1 FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = ? AND l.warehouse_id = ? AND (s.on_hand <> 0 OR s.reserved <> 0) LIMIT 1').bind(a.companyId, w.id).first();
    if (stock) badState(`Warehouse ${w.code} still holds stock: move it out first`);
  }
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE erp_warehouses SET name = ?, address = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(input.name ?? w.name, input.address ?? w.address, input.archived === undefined ? w.archived_at : input.archived ? (w.archived_at ?? t) : null, t, a.companyId, w.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: input.archived === true ? 'warehouse.archived' : input.archived === false ? 'warehouse.restored' : 'warehouse.updated', entityType: 'warehouse', entityId: w.id, summary: `Warehouse ${w.code} ${input.archived === true ? 'archived' : input.archived === false ? 'restored' : 'changed'}`, after: input, at: t }),
  ]);
  return c.json({ ok: true });
});

inventoryRoutes.get('/c/:company/locations', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const wh = c.req.query('warehouseId');
  const kind = c.req.query('kind');
  const rows = await db
    .prepare(
      `SELECT l.*, w.code AS warehouse_code,
              (SELECT COALESCE(SUM(s.on_hand), 0) FROM erp_stock s WHERE s.company_id = l.company_id AND s.location_id = l.id) AS on_hand
         FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE l.company_id = ? ${wh ? 'AND l.warehouse_id = ?' : ''} ${kind ? 'AND l.kind = ?' : ''} ${c.req.query('archived') === '1' ? '' : 'AND l.archived_at IS NULL AND w.archived_at IS NULL'}
        ORDER BY w.code COLLATE NOCASE, l.code COLLATE NOCASE LIMIT 2000`,
    )
    .bind(a.companyId, ...(wh ? [wh] : []), ...(kind ? [kind] : []))
    .all<any>();
  return c.json({ locations: rows.results.map(locationDTO), levels: LOCATION_LEVELS.map((v) => ({ value: v, label: LEVEL_LABELS[v] })), kinds: LOCATION_KINDS.map((v) => ({ value: v, label: KIND_LABELS[v] })) });
});

inventoryRoutes.post('/c/:company/locations', async (c) => {
  const a = await requireErp(c, 'inventory.setup');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({ warehouseId: zId, parentId: zId.nullable().optional(), code: zCode, name: zText(120).optional(), level: z.enum(LOCATION_LEVELS).optional(), kind: z.enum(LOCATION_KINDS).optional() }),
  );
  const w = await db.prepare('SELECT * FROM erp_warehouses WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, input.warehouseId).first<any>();
  if (!w) throw notFound('Warehouse');
  if (input.parentId) {
    const parent = await loadLocation(db, a.companyId, input.parentId);
    if (parent.warehouse_id !== w.id) throw new HttpError(400, 'The parent location is in another warehouse');
    if (input.level && LOCATION_LEVELS.indexOf(input.level) <= LOCATION_LEVELS.indexOf(parent.level as any)) throw new HttpError(400, `A ${LEVEL_LABELS[input.level].toLowerCase()} cannot sit inside a ${parent.level}`);
  }
  const dup = await db.prepare('SELECT 1 FROM erp_locations WHERE company_id = ? AND warehouse_id = ? AND code = ?').bind(a.companyId, w.id, input.code).first();
  if (dup) throw new HttpError(409, `Location ${input.code} already exists in ${w.code}`);
  const id = newId();
  const t = now();
  await db.batch([
    db
      .prepare('INSERT INTO erp_locations (id, company_id, warehouse_id, parent_id, code, name, level, kind, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, a.companyId, w.id, input.parentId ?? null, input.code, input.name ?? '', input.level ?? 'bin', input.kind ?? 'normal', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'location.created', entityType: 'location', entityId: id, summary: `Location ${w.code}/${input.code} created`, after: input, at: t }),
  ]);
  return c.json(locationDTO({ id, warehouse_id: w.id, warehouse_code: w.code, parent_id: input.parentId ?? null, code: input.code, name: input.name ?? '', level: input.level ?? 'bin', kind: input.kind ?? 'normal', archived_at: null, on_hand: 0 }), 201);
});

inventoryRoutes.patch('/c/:company/locations/:id', async (c) => {
  const a = await requireErp(c, 'inventory.setup');
  const db = c.env.DB;
  const l = await loadLocation(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ name: zText(120).optional(), kind: z.enum(LOCATION_KINDS).optional(), archived: z.boolean().optional() }));
  if (input.archived === true || (input.kind && input.kind !== l.kind)) {
    const stock = await db.prepare('SELECT 1 FROM erp_stock WHERE company_id = ? AND location_id = ? AND (on_hand <> 0 OR reserved <> 0) LIMIT 1').bind(a.companyId, l.id).first();
    if (stock) badState(`Location ${l.code} holds stock: move it out before ${input.archived ? 'archiving it' : 'changing its kind'}`);
  }
  const t = now();
  await db.batch([
    db
      .prepare('UPDATE erp_locations SET name = ?, kind = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?')
      .bind(input.name ?? l.name, input.kind ?? l.kind, input.archived === undefined ? l.archived_at : input.archived ? (l.archived_at ?? t) : null, t, a.companyId, l.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'location.updated', entityType: 'location', entityId: l.id, summary: `Location ${l.warehouse_code}/${l.code} changed`, after: input, at: t }),
  ]);
  return c.json({ ok: true });
});

/** The text a location's QR label carries (and that the warehouse screen accepts typed). */
export const locationCode = (warehouseCode: string, code: string) => `LOC:${warehouseCode}/${code}`;

function svgResponse(svg: string, name: string, download: boolean) {
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${name.replace(/[^A-Za-z0-9._-]/g, '_')}.svg"`,
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}

inventoryRoutes.get('/c/:company/locations/:id/qr.svg', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const l = await loadLocation(c.env.DB, a.companyId, c.req.param('id'));
  const code = locationCode(l.warehouse_code, l.code);
  return svgResponse(qrSvg(code, `${l.warehouse_code}/${l.code}`), `location-${l.warehouse_code}-${l.code}`, c.req.query('download') === '1');
});

inventoryRoutes.get('/c/:company/products/:id/qr.svg', async (c) => {
  const a = await requireErp(c, 'products.view');
  const p = await loadStockProduct(c.env.DB, a.companyId, c.req.param('id'));
  return svgResponse(qrSvg(p.number, `${p.number} ${p.name}`.slice(0, 40)), `product-${p.number}`, c.req.query('download') === '1');
});

/** A typed or scanned code: a location (LOC:WH/CODE or WH/CODE), else a product (number or SKU). */
inventoryRoutes.get('/c/:company/scan', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const raw = (c.req.query('code') ?? '').trim().slice(0, 200);
  if (!raw) throw new HttpError(400, 'Type or scan a code');
  const loc = raw.replace(/^LOC:/i, '');
  if (loc.includes('/') || /^LOC:/i.test(raw)) {
    const [wh, ...rest] = loc.split('/');
    const l = await db
      .prepare('SELECT l.*, w.code AS warehouse_code FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND w.code = ? AND l.code = ?')
      .bind(a.companyId, wh, rest.join('/'))
      .first<any>();
    if (l) return c.json({ type: 'location', location: locationDTO(l) });
  }
  const p = await db.prepare('SELECT id, number, name, uom FROM erp_products WHERE company_id = ? AND (number = ? OR (sku <> \'\' AND sku = ?)) LIMIT 1').bind(a.companyId, raw, raw).first<any>();
  if (p) return c.json({ type: 'product', product: { id: p.id, number: p.number, name: p.name, uom: p.uom } });
  const l = await db
    .prepare('SELECT l.*, w.code AS warehouse_code FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.code = ? LIMIT 2')
    .bind(a.companyId, raw)
    .all<any>();
  if (l.results.length === 1) return c.json({ type: 'location', location: locationDTO(l.results[0]) });
  throw new HttpError(404, l.results.length > 1 ? 'That location code is in more than one warehouse: scan the label, or type WAREHOUSE/LOCATION' : 'Nothing has that code in this company');
});

// ------------------------------------------------------------------ product stock settings

inventoryRoutes.get('/c/:company/products/:id/stock', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const p = await loadStockProduct(db, a.companyId, c.req.param('id'));
  const rows = await db
    .prepare(
      `SELECT s.*, l.code AS location_code, l.kind, w.code AS warehouse_code, w.name AS warehouse_name FROM erp_stock s
         JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE s.company_id = ? AND s.product_id = ? AND (s.on_hand <> 0 OR s.reserved <> 0) ORDER BY w.code, l.code, s.expiry, s.lot, s.serial LIMIT 1000`,
    )
    .bind(a.companyId, p.id)
    .all<any>();
  const val = await db.prepare('SELECT qty, value_cents FROM erp_valuation WHERE company_id = ? AND product_id = ?').bind(a.companyId, p.id).first<{ qty: number; value_cents: number }>();
  const onOrder = (await onOrderByProduct(db, a.companyId)).get(p.id) ?? 0;
  const avail = (await availableByProduct(db, a.companyId, [p.id])).get(p.id) ?? { onHand: 0, reserved: 0, available: 0, quarantine: 0 };
  const settings = await loadSettings(db, a.companyId);
  return c.json({
    product: { id: p.id, number: p.number, name: p.name, uom: p.uom, type: p.type },
    settings: stockSettingsDTO(p),
    totals: { ...avail, onOrder, valueCents: val?.value_cents ?? 0, currency: settings.currency, unitCostCents: val && val.qty > 1e-9 ? val.value_cents / val.qty : null, method: settings.costingMethod ?? 'weighted_average' },
    rows: rows.results.map(stockRowDTO),
    can: { setup: can(a, 'inventory.setup'), operate: can(a, 'inventory.operate') },
  });
});

const stockSettingsDTO = (p: StockProduct) => ({
  trackLots: !!p.track_lots,
  trackSerials: !!p.track_serials,
  trackExpiry: !!p.track_expiry,
  inspectionRequired: !!p.inspection_required,
  reorderPoint: p.reorder_point,
  minQty: p.min_qty,
  maxQty: p.max_qty,
  defaultLocationId: p.default_location_id,
});

const stockRowDTO = (s: any) => ({
  id: s.id,
  productId: s.product_id,
  productNumber: s.product_number ?? undefined,
  productName: s.product_name ?? undefined,
  uom: s.uom ?? undefined,
  locationId: s.location_id,
  locationCode: s.location_code,
  locationKind: s.kind,
  locationKindLabel: KIND_LABELS[s.kind as keyof typeof KIND_LABELS] ?? s.kind,
  warehouseCode: s.warehouse_code,
  lot: s.lot,
  serial: s.serial,
  expiry: s.expiry,
  onHand: q6(Number(s.on_hand)),
  reserved: q6(Number(s.reserved)),
  available: q6(Number(s.on_hand) - Number(s.reserved)),
});

inventoryRoutes.put('/c/:company/products/:id/stock-settings', async (c) => {
  const a = await requireErp(c, 'inventory.setup');
  const db = c.env.DB;
  const p = await loadStockProduct(db, a.companyId, c.req.param('id'));
  const zLevel = z.number().min(0).max(1e9).nullable().optional();
  const input = await body(
    c,
    z.object({ trackLots: z.boolean().optional(), trackSerials: z.boolean().optional(), trackExpiry: z.boolean().optional(), inspectionRequired: z.boolean().optional(), reorderPoint: zLevel, minQty: zLevel, maxQty: zLevel, defaultLocationId: zId.nullable().optional() }),
  );
  const next = { ...stockSettingsDTO(p), ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)) } as ReturnType<typeof stockSettingsDTO>;
  const trackingChanged = next.trackLots !== !!p.track_lots || next.trackSerials !== !!p.track_serials;
  if (trackingChanged) {
    const any = await db.prepare('SELECT 1 FROM erp_stock WHERE company_id = ? AND product_id = ? AND (on_hand <> 0 OR reserved <> 0) LIMIT 1').bind(a.companyId, p.id).first();
    if (any) badState('Lot and serial tracking can change only while the product has no stock');
  }
  if (next.trackSerials && next.trackLots) {
    // both allowed: a serial number within a lot
  }
  if (next.minQty !== null && next.maxQty !== null && next.minQty > next.maxQty) throw new HttpError(400, 'The minimum is above the maximum');
  if (next.defaultLocationId) await loadLocation(db, a.companyId, next.defaultLocationId);
  const t = now();
  await db.batch([
    db
      .prepare(
        `INSERT INTO erp_product_stock (company_id, product_id, track_lots, track_serials, track_expiry, inspection_required, reorder_point, min_qty, max_qty, default_location_id, updated_by, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
         ON CONFLICT(company_id, product_id) DO UPDATE SET track_lots = ?3, track_serials = ?4, track_expiry = ?5, inspection_required = ?6, reorder_point = ?7, min_qty = ?8, max_qty = ?9, default_location_id = ?10, updated_by = ?11, updated_at = ?12`,
      )
      .bind(a.companyId, p.id, next.trackLots ? 1 : 0, next.trackSerials ? 1 : 0, next.trackExpiry ? 1 : 0, next.inspectionRequired ? 1 : 0, next.reorderPoint, next.minQty, next.maxQty, next.defaultLocationId, a.userId, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'stock.settings_changed', entityType: 'stock', entityId: p.id, productId: p.id, summary: `${p.number}: stock settings changed`, before: stockSettingsDTO(p), after: next, at: t }),
  ]);
  return c.json({ settings: next });
});

// ------------------------------------------------------------------ stock and movements

inventoryRoutes.get('/c/:company/stock', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const q = c.req.query('q')?.trim();
  const wh = c.req.query('warehouseId');
  const loc = c.req.query('locationId');
  const detail = c.req.query('view') === 'detail';
  const settings = await loadSettings(db, a.companyId);
  if (detail) {
    const where = ['s.company_id = ?', '(s.on_hand <> 0 OR s.reserved <> 0)'];
    const args: unknown[] = [a.companyId];
    if (q) {
      where.push('(p.number LIKE ? OR p.name LIKE ? OR s.lot LIKE ? OR s.serial LIKE ?)');
      args.push(likeOf(q), likeOf(q), likeOf(q), likeOf(q));
    }
    if (wh) {
      where.push('l.warehouse_id = ?');
      args.push(wh);
    }
    if (loc) {
      where.push('s.location_id = ?');
      args.push(loc);
    }
    const kind = c.req.query('kind');
    if (kind) {
      where.push('l.kind = ?');
      args.push(kind);
    }
    const sorts: Record<string, string> = { product: 'p.number COLLATE NOCASE', location: 'w.code, l.code', expiry: "COALESCE(s.expiry, '9999')", qty: 's.on_hand DESC' };
    const order = sorts[c.req.query('sort') ?? ''] ?? sorts.product;
    const sql = `FROM erp_stock s JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id
                 JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
                 WHERE ${where.join(' AND ')}`;
    const csv = wantsCsv(c);
    const rows = await db
      .prepare(`SELECT s.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, l.kind, w.code AS warehouse_code ${sql} ORDER BY ${order}, s.lot, s.serial LIMIT ? OFFSET ?`)
      .bind(...args, csv ? 20000 : limit, csv ? 0 : offset)
      .all<any>();
    const list = rows.results.map(stockRowDTO);
    if (csv) return csvResponse('stock-by-location', [['Product', 'Name', 'Warehouse', 'Location', 'Location kind', 'Lot', 'Serial', 'Expiry', 'On hand', 'Reserved', 'Available', 'Unit'], ...list.map((r, i) => [r.productNumber, r.productName, r.warehouseCode, r.locationCode, r.locationKindLabel, r.lot, r.serial, r.expiry ?? '', r.onHand, r.reserved, r.available, rows.results[i].uom])]);
    const total = await db.prepare(`SELECT COUNT(*) AS n ${sql}`).bind(...args).first<{ n: number }>();
    return c.json({ rows: list, total: total?.n ?? 0, limit, offset });
  }
  // Per product: every stocked product (not services), with on hand, reserved, available, on order, levels and value.
  const where = ['p.company_id = ?', "p.type <> 'service'"];
  const args: unknown[] = [a.companyId];
  if (q) {
    where.push('(p.number LIKE ? OR p.name LIKE ? OR p.sku LIKE ?)');
    args.push(likeOf(q), likeOf(q), likeOf(q));
  }
  if (c.req.query('archived') !== '1') where.push('p.archived_at IS NULL');
  const stockFilter = wh || loc ? `AND ${wh ? 'l.warehouse_id = ?' : 'l.id = ?'}` : '';
  const stockArgs = wh ? [wh] : loc ? [loc] : [];
  const sums = `(SELECT COALESCE(SUM(CASE WHEN l.kind <> 'quarantine' THEN s.on_hand END), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id ${stockFilter})`;
  const res = `(SELECT COALESCE(SUM(CASE WHEN l.kind <> 'quarantine' THEN s.reserved END), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id ${stockFilter})`;
  const qua = `(SELECT COALESCE(SUM(CASE WHEN l.kind = 'quarantine' THEN s.on_hand END), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id ${stockFilter})`;
  const any = `EXISTS (SELECT 1 FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id AND (s.on_hand <> 0 OR s.reserved <> 0) ${stockFilter})`;
  const onOrderSql = `(SELECT COALESCE(SUM(pl.quantity - pl.received_qty), 0) FROM erp_po_lines pl JOIN erp_purchase_orders o ON o.company_id = pl.company_id AND o.id = pl.po_id WHERE pl.company_id = p.company_id AND pl.product_id = p.id AND o.status IN ('approved','sent','partially_received'))`;
  const filter = c.req.query('filter');
  if (filter === 'in_stock' || wh || loc) {
    where.push(any);
    args.push(...stockArgs);
  }
  if (filter === 'below_reorder') where.push(`ps.reorder_point IS NOT NULL AND (${sums} - ${res}) + ${onOrderSql} <= ps.reorder_point`);
  if (filter === 'below_min') where.push(`ps.min_qty IS NOT NULL AND ${sums} < ps.min_qty`);
  // The arguments of the filters above that use the stock sums.
  const filterArgs = filter === 'below_reorder' ? [...stockArgs, ...stockArgs] : filter === 'below_min' ? stockArgs : [];
  const sorts: Record<string, string> = { number: 'p.number COLLATE NOCASE', name: 'p.name COLLATE NOCASE', on_hand: 'on_hand DESC', available: 'available', value: 'value_cents DESC' };
  const order = sorts[c.req.query('sort') ?? ''] ?? sorts.number;
  const select = `SELECT p.id, p.number, p.name, p.uom, p.type, ps.reorder_point, ps.min_qty, ps.max_qty,
                         ${sums} AS on_hand, ${res} AS reserved, ${sums} - ${res} AS available, ${qua} AS quarantine, ${onOrderSql} AS on_order,
                         COALESCE(v.value_cents, 0) AS all_value, COALESCE(v.qty, 0) AS all_qty,
                         CASE WHEN COALESCE(v.qty, 0) > 1e-9 THEN CAST(round(v.value_cents * (${sums} + ${qua}) / v.qty) AS INTEGER) ELSE 0 END AS value_cents`;
  const from = `FROM erp_products p LEFT JOIN erp_product_stock ps ON ps.company_id = p.company_id AND ps.product_id = p.id LEFT JOIN erp_valuation v ON v.company_id = p.company_id AND v.product_id = p.id WHERE ${where.join(' AND ')}`;
  const selectArgs = [...stockArgs, ...stockArgs, ...stockArgs, ...stockArgs, ...stockArgs, ...stockArgs, ...stockArgs];
  const csv = wantsCsv(c);
  const rows = await db
    .prepare(`${select} ${from} ORDER BY ${order} LIMIT ? OFFSET ?`)
    .bind(...selectArgs, ...args, ...filterArgs, csv ? 20000 : limit, csv ? 0 : offset)
    .all<any>();
  const list = rows.results.map((r) => ({
    productId: r.id,
    number: r.number,
    name: r.name,
    uom: r.uom,
    onHand: q6(Number(r.on_hand)),
    reserved: q6(Number(r.reserved)),
    available: q6(Number(r.available)),
    quarantine: q6(Number(r.quarantine)),
    onOrder: Math.max(0, q6(Number(r.on_order))),
    reorderPoint: r.reorder_point,
    minQty: r.min_qty,
    maxQty: r.max_qty,
    valueCents: Number(r.value_cents ?? 0),
    belowReorder: r.reorder_point !== null && Number(r.available) + Math.max(0, Number(r.on_order)) <= r.reorder_point,
    belowMin: r.min_qty !== null && Number(r.on_hand) < r.min_qty,
  }));
  if (csv) {
    return csvResponse('stock-on-hand', [
      ['Product', 'Name', 'Unit', 'On hand', 'Reserved', 'Available', 'In quarantine', 'On order', 'Reorder point', 'Minimum', 'Maximum', `Value (${settings.currency})`, 'Below reorder point'],
      ...list.map((r) => [r.number, r.name, r.uom, r.onHand, r.reserved, r.available, r.quarantine, r.onOrder, r.reorderPoint ?? '', r.minQty ?? '', r.maxQty ?? '', dollars(r.valueCents), r.belowReorder ? 'yes' : '']),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n ${from}`).bind(...args, ...filterArgs).first<{ n: number }>();
  return c.json({ rows: list, total: total?.n ?? 0, limit, offset, currency: settings.currency, method: settings.costingMethod ?? 'weighted_average', can: { operate: can(a, 'inventory.operate'), approve: can(a, 'inventory.approve'), setup: can(a, 'inventory.setup') } });
});

export function moveDTO(m: any) {
  return {
    id: m.id,
    groupId: m.group_id,
    type: m.move_type,
    typeLabel: MOVE_LABELS[m.move_type] ?? m.move_type,
    productId: m.product_id,
    productNumber: m.product_number,
    productName: m.product_name,
    locationId: m.location_id,
    locationCode: m.location_code,
    warehouseCode: m.warehouse_code,
    lot: m.lot,
    serial: m.serial,
    expiry: m.expiry,
    quantity: q6(Number(m.on_hand_delta)),
    reserved: q6(Number(m.reserved_delta)),
    unitCostCents: m.unit_cost_cents === null ? null : Number(m.unit_cost_cents),
    valueCents: m.value_delta_cents,
    sourceType: m.source_type,
    sourceId: m.source_id,
    reference: m.reference,
    reason: m.reason,
    byName: m.by_name ?? null,
    at: m.created_at,
  };
}

export const MOVE_SELECT = `SELECT m.*, p.number AS product_number, p.name AS product_name, l.code AS location_code, w.code AS warehouse_code, u.name AS by_name
  FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id
  JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
  LEFT JOIN users u ON u.id = m.created_by`;

inventoryRoutes.get('/c/:company/movements', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const { limit, offset } = paging(c);
  const where = ['m.company_id = ?'];
  const args: unknown[] = [a.companyId];
  const add = (sql: string, v: unknown) => {
    where.push(sql);
    args.push(v);
  };
  const qp = (k: string) => c.req.query(k)?.trim();
  if (qp('productId')) add('m.product_id = ?', qp('productId'));
  if (qp('locationId')) add('m.location_id = ?', qp('locationId'));
  if (qp('warehouseId')) add('l.warehouse_id = ?', qp('warehouseId'));
  if (qp('type')) add('m.move_type = ?', qp('type'));
  if (qp('source')) add('m.source_type = ?', qp('source'));
  if (qp('sourceId')) add('m.source_id = ?', qp('sourceId'));
  if (qp('groupId')) add('m.group_id = ?', qp('groupId'));
  if (qp('lot')) add('m.lot = ?', qp('lot'));
  if (qp('serial')) add('m.serial = ?', qp('serial'));
  const from = qp('from');
  const to = qp('to');
  if (from) add('m.created_at >= ?', Date.parse(`${from}T00:00:00Z`) || 0);
  if (to) add('m.created_at < ?', (Date.parse(`${to}T00:00:00Z`) || 0) + 86_400_000);
  if (qp('q')) {
    where.push('(p.number LIKE ? OR p.name LIKE ? OR m.reference LIKE ? OR m.lot LIKE ? OR m.serial LIKE ?)');
    const l = likeOf(qp('q')!);
    args.push(l, l, l, l, l);
  }
  const csv = wantsCsv(c);
  const order = c.req.query('sort') === 'oldest' ? 'm.created_at, m.rowid' : 'm.created_at DESC, m.rowid DESC';
  const rows = await db.prepare(`${MOVE_SELECT} WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`).bind(...args, csv ? 50000 : limit, csv ? 0 : offset).all<any>();
  const list = rows.results.map(moveDTO);
  if (csv) {
    return csvResponse('stock-movements', [
      ['Date', 'Type', 'Product', 'Name', 'Warehouse', 'Location', 'Lot', 'Serial', 'Quantity', 'Reserved', 'Unit cost', 'Value', 'Source', 'Reference', 'Reason', 'By'],
      ...list.map((m) => [new Date(m.at).toISOString(), m.typeLabel, m.productNumber, m.productName, m.warehouseCode, m.locationCode, m.lot, m.serial, m.quantity, m.reserved, m.unitCostCents === null ? '' : (m.unitCostCents / 100).toFixed(4), dollars(m.valueCents), m.sourceType, m.reference, m.reason, m.byName ?? '']),
    ]);
  }
  const total = await db.prepare(`SELECT COUNT(*) AS n FROM erp_stock_moves m JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id JOIN erp_locations l ON l.company_id = m.company_id AND l.id = m.location_id WHERE ${where.join(' AND ')}`).bind(...args).first<{ n: number }>();
  return c.json({ moves: list, total: total?.n ?? 0, limit, offset, types: Object.entries(MOVE_LABELS).map(([value, label]) => ({ value, label })) });
});

// ------------------------------------------------------------------ operations

const keyFields = { productId: zId, locationId: zId, lot: zLot, serial: zSerial, quantity: zQ, reference: zText(200).optional(), requestKey: zRequestKey };
const OPS = {
  issue: z.object({ ...keyFields, reason: zText(500).optional() }),
  transfer: z.object({ ...keyFields, toLocationId: zId, reason: zText(500).optional() }),
  quarantine: z.object({ ...keyFields, toLocationId: zId, reason: zText(500).min(1, 'Say why it goes into quarantine') }),
  release: z.object({ ...keyFields, toLocationId: zId, reason: zText(500).optional() }),
  'customer-return': z.object({ ...keyFields, expiry: zDate.optional(), unitCostCents: z.number().min(0).max(1e11).nullable().optional(), reason: zText(500).min(1, 'Say why it came back') }),
  'supplier-return': z.object({ ...keyFields, supplierId: zId.optional(), reason: zText(500).min(1, 'Say why it goes back') }),
  scrap: z.object({ ...keyFields, reason: zText(500).min(1, 'Say why it is scrapped') }),
} as const;
type Op = keyof typeof OPS;

/** Adjustments and scrap above the company's threshold need a warehouse manager. */
function overThreshold(s: ErpSettings, valueCents: number) {
  return s.adjustmentApprovalCents === null || Math.abs(valueCents) > s.adjustmentApprovalCents;
}

inventoryRoutes.post('/c/:company/stock/:op', async (c) => {
  const op = c.req.param('op') as Op;
  if (!Object.hasOwn(OPS, op)) throw notFound('Operation');
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const input: any = await body(c, OPS[op]);
  const settings = await loadSettings(db, a.companyId);
  const incoming = op === 'customer-return';
  const { p, l, key } = await stockKey(db, a.companyId, input, { incoming, quantity: input.quantity, expiry: input.expiry ?? null });
  const ops = new StockOps(db, a, settings);
  const before: D1PreparedStatement[] = [];
  if (input.requestKey) before.push(onceStmt(db, a.companyId, `stock-op:${input.requestKey}`, ops.t));
  const ref = input.reference ?? '';
  let summary: string;
  if (op === 'issue') {
    await ops.takeOut('issue', key, input.quantity, { source: 'issue', reference: ref, reason: input.reason ?? '' });
    summary = `Issued ${input.quantity} ${p.uom} of ${p.number} from ${l.warehouse_code}/${l.code}`;
  } else if (op === 'transfer' || op === 'quarantine' || op === 'release') {
    const to = await loadLocation(db, a.companyId, input.toLocationId);
    if (to.archived_at || to.warehouse_archived) throw new HttpError(400, `Location ${to.code} is archived`);
    if (op === 'quarantine' && to.kind !== 'quarantine') throw new HttpError(400, `${to.code} is not a quarantine location`);
    if (op === 'release' && l.kind !== 'quarantine') throw new HttpError(400, `${l.code} is not a quarantine location`);
    if (op === 'release' && to.kind === 'quarantine') throw new HttpError(400, 'Release it to a location outside quarantine');
    const row = await stockRow(db, a.companyId, key);
    ops.relocate(op, key, to.id, input.quantity, row?.expiry ?? null, { source: op === 'transfer' ? 'transfer' : 'quarantine', reference: ref, reason: input.reason ?? '' });
    summary = `${op === 'transfer' ? 'Moved' : op === 'quarantine' ? 'Quarantined' : 'Released'} ${input.quantity} ${p.uom} of ${p.number} from ${l.warehouse_code}/${l.code} to ${to.warehouse_code}/${to.code}`;
  } else if (op === 'customer-return') {
    await ops.addIn('customer_return', key, input.quantity, { source: 'customer_return', reference: ref, reason: input.reason, unitCost: input.unitCostCents ?? null, expiry: input.expiry ?? null });
    summary = `Customer return: ${input.quantity} ${p.uom} of ${p.number} into ${l.warehouse_code}/${l.code}`;
  } else if (op === 'supplier-return') {
    let supplierRef = '';
    if (input.supplierId) {
      const s = await db.prepare('SELECT number, legal_name FROM erp_suppliers WHERE company_id = ? AND id = ?').bind(a.companyId, input.supplierId).first<any>();
      if (!s) throw notFound('Supplier');
      supplierRef = `${s.number} ${s.legal_name}`;
    }
    await ops.takeOut('supplier_return', key, input.quantity, { source: 'supplier_return', sourceId: input.supplierId ?? null, reference: ref || supplierRef, reason: input.reason });
    summary = `Returned ${input.quantity} ${p.uom} of ${p.number} to ${supplierRef || 'the supplier'}`;
  } else {
    const estimate = Math.round(input.quantity * (await ops.currentCost(p.id)));
    if (overThreshold(settings, estimate) && !can(a, 'inventory.approve')) throw new HttpError(403, 'Scrap worth more than the approval threshold needs a warehouse manager: raise an adjustment instead');
    await ops.takeOut('scrap', key, input.quantity, { source: 'scrap', reference: ref, reason: input.reason });
    summary = `Scrapped ${input.quantity} ${p.uom} of ${p.number} at ${l.warehouse_code}/${l.code}`;
  }
  const event = eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: `stock.${op}`, entityType: 'stock', entityId: ops.groupId, productId: p.id, summary, after: { quantity: input.quantity, lot: key.lot, serial: key.serial, reason: input.reason ?? '' }, at: ops.t });
  await runStock(db, ops.all(before, [event], { type: op.replace('-', '_'), id: ops.groupId }));
  return c.json({ ok: true, groupId: ops.groupId, summary }, 201);
});

// ------------------------------------------------------------------ reservations

const reservationDTO = (r: any) => ({
  id: r.id,
  productId: r.product_id,
  productNumber: r.product_number,
  productName: r.product_name,
  locationCode: r.location_code,
  warehouseCode: r.warehouse_code,
  lot: r.lot,
  serial: r.serial,
  quantity: q6(r.quantity),
  issued: q6(r.issued_qty),
  released: q6(r.released_qty),
  open: q6(r.quantity - r.issued_qty - r.released_qty),
  status: r.status,
  reference: r.reference,
  byName: r.by_name ?? null,
  createdAt: r.created_at,
});

const RES_SELECT = `SELECT r.*, s.lot, s.serial, s.location_id, p.number AS product_number, p.name AS product_name, l.code AS location_code, w.code AS warehouse_code, u.name AS by_name
  FROM erp_reservations r JOIN erp_stock s ON s.company_id = r.company_id AND s.id = r.stock_id JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id
  JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id LEFT JOIN users u ON u.id = r.created_by`;

inventoryRoutes.get('/c/:company/reservations', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const status = c.req.query('status') ?? 'open';
  const rows = await c.env.DB.prepare(`${RES_SELECT} WHERE r.company_id = ? ${status === 'all' ? '' : 'AND r.status = ?'} ORDER BY r.created_at DESC LIMIT 500`)
    .bind(a.companyId, ...(status === 'all' ? [] : [status]))
    .all<any>();
  return c.json({ reservations: rows.results.map(reservationDTO) });
});

inventoryRoutes.post('/c/:company/reservations', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const input = await body(c, z.object({ productId: zId, locationId: zId, lot: zLot, serial: zSerial, quantity: zQ, reference: zText(200).min(1, 'Say what it is reserved for') }));
  const { p, l, key } = await stockKey(db, a.companyId, input, { incoming: false, quantity: input.quantity });
  const row = await stockRow(db, a.companyId, key);
  if (!row) throw new HttpError(409, `There is no ${p.number} at ${l.code}${key.lot ? ` in lot ${key.lot}` : ''}`);
  if (l.kind === 'quarantine') throw new HttpError(400, 'Stock in quarantine cannot be reserved');
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings);
  const id = newId();
  ops.reserve(key, input.quantity, { source: 'reservation', sourceId: id, reference: input.reference });
  await runStock(
    db,
    ops.all(
      [],
      [
        db.prepare('INSERT INTO erp_reservations (id, company_id, stock_id, product_id, quantity, reference, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, row.id, p.id, input.quantity, input.reference, a.userId, ops.t, ops.t),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'stock.reserved', entityType: 'stock', entityId: id, productId: p.id, summary: `Reserved ${input.quantity} ${p.uom} of ${p.number} at ${l.warehouse_code}/${l.code} for ${input.reference}`, at: ops.t }),
      ],
      { type: 'reservation', id },
    ),
  );
  return c.json({ id }, 201);
});

inventoryRoutes.post('/c/:company/reservations/:id/:action{release|issue}', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const r = await db.prepare(`${RES_SELECT} WHERE r.company_id = ? AND r.id = ?`).bind(a.companyId, c.req.param('id')).first<any>();
  if (!r) throw notFound('Reservation');
  if (r.status !== 'open') badState('This reservation is closed');
  const open = q6(r.quantity - r.issued_qty - r.released_qty);
  const input = await body(c, z.object({ quantity: zQ.optional(), reason: zText(500).optional() }));
  const qn = input.quantity ?? open;
  if (qn > open + 1e-9) throw new HttpError(400, `At most ${open} is open on this reservation`);
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings);
  const key: StockKey = { productId: r.product_id, locationId: r.location_id, lot: r.lot, serial: r.serial };
  const issue = c.req.param('action') === 'issue';
  if (issue) await ops.takeOut('issue', key, qn, { source: 'reservation', sourceId: r.id, reference: r.reference, reason: input.reason ?? '', fromReserved: true });
  else ops.reserve(key, -qn, { source: 'reservation', sourceId: r.id, reference: r.reference, reason: input.reason ?? '' });
  const col = issue ? 'issued_qty' : 'released_qty';
  await runStock(
    db,
    ops.all(
      [],
      [
        // guarded by the reservation's own CHECK (issued + released never above the quantity)
        db
          .prepare(`UPDATE erp_reservations SET ${col} = round(${col} + ?, 6), status = CASE WHEN round(quantity - issued_qty - released_qty - ?, 6) <= 1e-9 THEN '${issue ? 'issued' : 'released'}' ELSE status END, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'open'`)
          .bind(qn, qn, ops.t, a.companyId, r.id),
        eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: issue ? 'stock.reservation_issued' : 'stock.reservation_released', entityType: 'stock', entityId: r.id, productId: r.product_id, summary: `${issue ? 'Issued' : 'Released'} ${qn} of ${r.product_number} reserved for ${r.reference}`, at: ops.t }),
      ],
      { type: 'reservation', id: r.id },
    ),
  );
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ adjustments

const ADJ_SELECT = `SELECT j.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, w.code AS warehouse_code, rq.name AS requested_name, dc.name AS decided_name
  FROM erp_adjustments j JOIN erp_products p ON p.company_id = j.company_id AND p.id = j.product_id JOIN erp_locations l ON l.company_id = j.company_id AND l.id = j.location_id
  JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id LEFT JOIN users rq ON rq.id = j.requested_by LEFT JOIN users dc ON dc.id = j.decided_by`;

const adjustmentDTO = (j: any, a?: ErpAccess) => ({
  id: j.id,
  number: j.number,
  productId: j.product_id,
  productNumber: j.product_number,
  productName: j.product_name,
  uom: j.uom,
  locationCode: j.location_code,
  warehouseCode: j.warehouse_code,
  lot: j.lot,
  serial: j.serial,
  quantity: q6(j.quantity),
  unitCostCents: j.unit_cost_cents,
  valueCents: j.value_cents,
  reason: j.reason,
  status: j.status,
  requestedBy: j.requested_by,
  requestedByName: j.requested_name ?? null,
  decidedByName: j.decided_name ?? null,
  decidedAt: j.decided_at,
  decisionNote: j.decision_note,
  sodException: !!j.sod_exception,
  createdAt: j.created_at,
  canDecide: a ? j.status === 'pending' && can(a, 'inventory.approve') && (j.requested_by !== a.userId || a.solo) : undefined,
});

inventoryRoutes.get('/c/:company/adjustments', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const status = c.req.query('status');
  const rows = await c.env.DB.prepare(`${ADJ_SELECT} WHERE j.company_id = ? ${status ? 'AND j.status = ?' : ''} ORDER BY j.created_at DESC LIMIT 500`)
    .bind(a.companyId, ...(status ? [status] : []))
    .all<any>();
  return c.json({ adjustments: rows.results.map((j) => adjustmentDTO(j, a)) });
});

/** The statements that post an adjustment's movement. */
async function postAdjustment(ops: StockOps, j: { id: string; number: string; product_id: string; location_id: string; lot: string; serial: string; expiry: string | null; quantity: number; unit_cost_cents: number | null; reason: string }) {
  const key: StockKey = { productId: j.product_id, locationId: j.location_id, lot: j.lot, serial: j.serial };
  if (j.quantity > 0) await ops.addIn('adjust_in', key, j.quantity, { source: 'adjustment', sourceId: j.id, reference: j.number, reason: j.reason, unitCost: j.unit_cost_cents, expiry: j.expiry });
  else await ops.takeOut('adjust_out', key, -j.quantity, { source: 'adjustment', sourceId: j.id, reference: j.number, reason: j.reason });
}

inventoryRoutes.post('/c/:company/adjustments', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({
      productId: zId,
      locationId: zId,
      lot: zLot,
      serial: zSerial,
      expiry: zDate.optional(),
      quantity: z.number().min(-1e9).max(1e9).refine((n) => n !== 0, 'Use a quantity other than zero'),
      unitCostCents: z.number().min(0).max(1e11).nullable().optional(),
      reason: zText(500).min(1, 'Give the reason for the adjustment'),
    }),
  );
  const { p, l, key } = await stockKey(db, a.companyId, input, { incoming: input.quantity > 0, quantity: Math.abs(input.quantity), expiry: input.expiry ?? null });
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings);
  const cost = input.quantity > 0 && input.unitCostCents !== undefined && input.unitCostCents !== null ? input.unitCostCents : await ops.currentCost(p.id);
  const value = Math.round(input.quantity * cost);
  const pending = overThreshold(settings, value);
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'adjustment');
  const row = { id, number, product_id: p.id, location_id: l.id, lot: key.lot!, serial: key.serial!, expiry: input.expiry ?? null, quantity: input.quantity, unit_cost_cents: input.quantity > 0 ? cost : null, reason: input.reason };
  if (!pending) await postAdjustment(ops, row);
  const insert = db
    .prepare('INSERT INTO erp_adjustments (id, company_id, number, product_id, location_id, lot, serial, expiry, quantity, unit_cost_cents, value_cents, reason, status, requested_by, decided_at, group_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, a.companyId, number, p.id, l.id, row.lot, row.serial, row.expiry, input.quantity, row.unit_cost_cents, value, input.reason, pending ? 'pending' : 'posted', a.userId, pending ? null : ops.t, pending ? null : ops.groupId, ops.t, ops.t);
  const event = eventStmt(db, {
    companyId: a.companyId,
    actorId: a.userId,
    action: pending ? 'adjustment.requested' : 'adjustment.posted',
    entityType: 'adjustment',
    entityId: id,
    productId: p.id,
    summary: `${number}: ${input.quantity > 0 ? '+' : ''}${input.quantity} ${p.uom} of ${p.number} at ${l.warehouse_code}/${l.code} (${input.reason})${pending ? `, waiting for a warehouse manager (worth ${dollars(Math.abs(value))}, over the threshold)` : ', within the approval threshold'}`,
    after: { quantity: input.quantity, valueCents: value, rule: pending ? 'over_threshold' : 'within_threshold' },
    at: ops.t,
  });
  if (pending) await db.batch([insert, event]);
  else await runStock(db, ops.all([insert], [event], { type: 'adjustment', id }));
  return c.json({ id, number, status: pending ? 'pending' : 'posted', valueCents: value }, 201);
});

inventoryRoutes.post('/c/:company/adjustments/:id/:decision{approve|reject}', async (c) => {
  const a = await requireErp(c, 'inventory.approve');
  const db = c.env.DB;
  const j = await db.prepare(`${ADJ_SELECT} WHERE j.company_id = ? AND j.id = ?`).bind(a.companyId, c.req.param('id')).first<any>();
  if (!j) throw notFound('Adjustment');
  if (j.status !== 'pending') badState(`${j.number} is already ${j.status}`);
  const input = await body(c, z.object({ note: zText(500).optional() }));
  const sod = segregation(a, j.requested_by, 'asked for this adjustment');
  const approve = c.req.param('decision') === 'approve';
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings);
  if (approve) await postAdjustment(ops, j);
  const stmts = [
    onceStmt(db, a.companyId, `adjustment:${j.id}`, ops.t),
    db
      .prepare("UPDATE erp_adjustments SET status = ?, decided_by = ?, decided_at = ?, decision_note = ?, sod_exception = ?, group_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'pending'")
      .bind(approve ? 'posted' : 'rejected', a.userId, ops.t, input.note ?? '', sod ? 1 : 0, approve ? ops.groupId : null, ops.t, a.companyId, j.id),
    eventStmt(db, {
      companyId: a.companyId,
      actorId: a.userId,
      action: approve ? 'adjustment.approved' : 'adjustment.rejected',
      entityType: 'adjustment',
      entityId: j.id,
      productId: j.product_id,
      summary: `${j.number} ${approve ? 'approved and posted' : 'rejected'}${sod ? ' by the person who asked for it (company of one: recorded exception)' : ''}`,
      after: { note: input.note ?? '', sodException: sod },
      at: ops.t,
    }),
  ];
  if (approve) await runStock(db, ops.all(stmts, [], { type: 'adjustment', id: j.id }));
  else await runStock(db, stmts);
  return c.json({ ok: true, status: approve ? 'posted' : 'rejected' });
});

// ------------------------------------------------------------------ counts

const COUNT_SELECT = `SELECT n.*, w.code AS warehouse_code, w.name AS warehouse_name, l.code AS location_code, cb.name AS created_name, sb.name AS submitted_name, ab.name AS approved_name,
  (SELECT COUNT(*) FROM erp_count_lines x WHERE x.company_id = n.company_id AND x.count_id = n.id) AS lines,
  (SELECT COUNT(*) FROM erp_count_lines x WHERE x.company_id = n.company_id AND x.count_id = n.id AND x.counted_qty IS NOT NULL) AS counted,
  (SELECT COUNT(*) FROM erp_count_lines x WHERE x.company_id = n.company_id AND x.count_id = n.id AND x.counted_qty IS NOT NULL AND abs(x.counted_qty - x.expected_qty) > 1e-9) AS variances
  FROM erp_counts n JOIN erp_warehouses w ON w.company_id = n.company_id AND w.id = n.warehouse_id LEFT JOIN erp_locations l ON l.company_id = n.company_id AND l.id = n.location_id
  LEFT JOIN users cb ON cb.id = n.created_by LEFT JOIN users sb ON sb.id = n.submitted_by LEFT JOIN users ab ON ab.id = n.approved_by`;

const countDTO = (n: any) => ({
  id: n.id,
  number: n.number,
  kind: n.kind,
  kindLabel: n.kind === 'cycle' ? 'Cycle count' : 'Stocktake',
  warehouseId: n.warehouse_id,
  warehouseCode: n.warehouse_code,
  locationId: n.location_id,
  locationCode: n.location_code,
  status: n.status,
  notes: n.notes,
  lines: n.lines,
  counted: n.counted,
  variances: n.variances,
  createdBy: n.created_by,
  createdByName: n.created_name ?? null,
  submittedBy: n.submitted_by,
  submittedByName: n.submitted_name ?? null,
  submittedAt: n.submitted_at,
  approvedByName: n.approved_name ?? null,
  approvedAt: n.approved_at,
  sodException: !!n.sod_exception,
  groupId: n.group_id,
  createdAt: n.created_at,
});

async function loadCount(db: D1Database, companyId: string, id: string) {
  const n = await db.prepare(`${COUNT_SELECT} WHERE n.company_id = ? AND n.id = ?`).bind(companyId, String(id).slice(0, 64)).first<any>();
  if (!n) throw notFound('Count');
  return n;
}

inventoryRoutes.get('/c/:company/counts', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const status = c.req.query('status');
  const rows = await c.env.DB.prepare(`${COUNT_SELECT} WHERE n.company_id = ? ${status ? 'AND n.status = ?' : ''} ORDER BY n.created_at DESC LIMIT 300`)
    .bind(a.companyId, ...(status ? [status] : []))
    .all<any>();
  return c.json({ counts: rows.results.map(countDTO), can: { operate: can(a, 'inventory.operate'), approve: can(a, 'inventory.approve') } });
});

/** Opens a count: one line per stock row in the warehouse (or under one location), expected = on hand now. */
inventoryRoutes.post('/c/:company/counts', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const input = await body(c, z.object({ kind: z.enum(['stocktake', 'cycle']).default('stocktake'), warehouseId: zId, locationId: zId.nullable().optional(), productIds: z.array(zId).max(500).optional(), notes: zText(1000).optional() }));
  const w = await db.prepare('SELECT * FROM erp_warehouses WHERE company_id = ? AND id = ? AND archived_at IS NULL').bind(a.companyId, input.warehouseId).first<any>();
  if (!w) throw notFound('Warehouse');
  let locIds: string[] | null = null;
  if (input.locationId) {
    const l = await loadLocation(db, a.companyId, input.locationId);
    if (l.warehouse_id !== w.id) throw new HttpError(400, 'That location is in another warehouse');
    // the location and everything under it
    const all = await db.prepare('SELECT id, parent_id FROM erp_locations WHERE company_id = ? AND warehouse_id = ?').bind(a.companyId, w.id).all<{ id: string; parent_id: string | null }>();
    locIds = [l.id];
    for (let i = 0; i < locIds.length; i++) for (const x of all.results) if (x.parent_id === locIds[i]) locIds.push(x.id);
  }
  const open = await db.prepare("SELECT number FROM erp_counts WHERE company_id = ? AND warehouse_id = ? AND status IN ('open','submitted') AND (location_id IS NULL OR ? IS NULL OR location_id = ?) LIMIT 1").bind(a.companyId, w.id, input.locationId ?? null, input.locationId ?? null).first<any>();
  if (open) badState(`Count ${open.number} is still open in ${w.code}: finish or cancel it first`);
  const rows = await db
    .prepare(
      `SELECT s.* FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
        WHERE s.company_id = ? AND l.warehouse_id = ? AND s.on_hand <> 0 ${locIds ? `AND s.location_id IN (${locIds.map(() => '?').join(',')})` : ''}
          ${input.productIds?.length ? `AND s.product_id IN (${input.productIds.map(() => '?').join(',')})` : ''} ORDER BY l.code, s.product_id, s.lot, s.serial LIMIT 5000`,
    )
    .bind(a.companyId, w.id, ...(locIds ?? []), ...(input.productIds ?? []))
    .all<any>();
  const id = newId();
  const number = await nextNumber(db, a.companyId, 'count');
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db.prepare('INSERT INTO erp_counts (id, company_id, number, kind, warehouse_id, location_id, notes, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, number, input.kind, w.id, input.locationId ?? null, input.notes ?? '', a.userId, t, t),
    ...rows.results.map((s) =>
      db
        .prepare('INSERT INTO erp_count_lines (id, company_id, count_id, product_id, location_id, lot, serial, expected_qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, id, s.product_id, s.location_id, s.lot, s.serial, s.on_hand),
    ),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'count.opened', entityType: 'count', entityId: id, summary: `${number}: ${input.kind === 'cycle' ? 'cycle count' : 'stocktake'} opened in ${w.code} with ${rows.results.length} lines`, at: t }),
  ];
  await db.batch(stmts);
  return c.json({ id, number }, 201);
});

inventoryRoutes.get('/c/:company/counts/:id', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const n = await loadCount(db, a.companyId, c.req.param('id'));
  const lines = await db
    .prepare(
      `SELECT x.*, p.number AS product_number, p.name AS product_name, p.uom, l.code AS location_code, u.name AS counted_name,
              (SELECT s.on_hand FROM erp_stock s WHERE s.company_id = x.company_id AND s.product_id = x.product_id AND s.location_id = x.location_id AND s.lot = x.lot AND s.serial = x.serial) AS now_on_hand
         FROM erp_count_lines x JOIN erp_products p ON p.company_id = x.company_id AND p.id = x.product_id JOIN erp_locations l ON l.company_id = x.company_id AND l.id = x.location_id
         LEFT JOIN users u ON u.id = x.counted_by WHERE x.company_id = ? AND x.count_id = ? ORDER BY l.code COLLATE NOCASE, p.number COLLATE NOCASE, x.lot, x.serial`,
    )
    .bind(a.companyId, n.id)
    .all<any>();
  const list = lines.results.map((x) => ({
    id: x.id,
    productId: x.product_id,
    productNumber: x.product_number,
    productName: x.product_name,
    uom: x.uom,
    locationId: x.location_id,
    locationCode: x.location_code,
    lot: x.lot,
    serial: x.serial,
    expected: q6(x.expected_qty),
    counted: x.counted_qty === null ? null : q6(x.counted_qty),
    variance: x.counted_qty === null ? null : q6(x.counted_qty - x.expected_qty),
    countedByName: x.counted_name ?? null,
    // stock moved here since the count was opened: the variance is against the quantity when it was opened
    movedSince: n.status !== 'posted' && Math.abs(Number(x.now_on_hand ?? 0) - x.expected_qty) > 1e-9,
  }));
  if (wantsCsv(c)) {
    return csvResponse(`count-${n.number}`, [['Location', 'Product', 'Name', 'Lot', 'Serial', 'Expected', 'Counted', 'Variance', 'Unit', 'Counted by'], ...list.map((x) => [x.locationCode, x.productNumber, x.productName, x.lot, x.serial, x.expected, x.counted ?? '', x.variance ?? '', x.uom, x.countedByName ?? ''])]);
  }
  const counter = n.submitted_by ?? n.created_by;
  return c.json({
    count: countDTO(n),
    lines: list,
    history: await historyOf(db, a.companyId, { entityType: 'count', entityId: n.id }),
    can: {
      count: n.status === 'open' && can(a, 'inventory.operate'),
      submit: n.status === 'open' && can(a, 'inventory.operate'),
      approve: n.status === 'submitted' && can(a, 'inventory.approve') && (counter !== a.userId || a.solo),
      cancel: (n.status === 'open' || n.status === 'submitted') && can(a, 'inventory.operate'),
      segregation: n.status === 'submitted' && counter === a.userId && !a.solo ? 'You counted this, so another warehouse manager must approve it.' : null,
    },
  });
});

inventoryRoutes.post('/c/:company/counts/:id/lines', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const n = await loadCount(db, a.companyId, c.req.param('id'));
  if (n.status !== 'open') badState(`${n.number} is ${n.status}`);
  const input = await body(c, z.object({ productId: zId, locationId: zId, lot: zLot, serial: zSerial, counted: z.number().min(0).max(1e9).optional() }));
  const { p, l, key } = await stockKey(db, a.companyId, input, { incoming: false });
  if (l.warehouse_id !== n.warehouse_id) throw new HttpError(400, 'That location is in another warehouse');
  const row = await stockRow(db, a.companyId, key);
  const t = now();
  try {
    await db.batch([
      db
        .prepare('INSERT INTO erp_count_lines (id, company_id, count_id, product_id, location_id, lot, serial, expected_qty, counted_qty, counted_by, counted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(newId(), a.companyId, n.id, p.id, l.id, key.lot, key.serial, row?.on_hand ?? 0, input.counted ?? null, input.counted === undefined ? null : a.userId, input.counted === undefined ? null : t),
      eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'count.line_added', entityType: 'count', entityId: n.id, productId: p.id, summary: `${n.number}: ${p.number} at ${l.code} added to the count`, at: t }),
    ]);
  } catch (e) {
    if (/UNIQUE/i.test(String((e as Error).message))) throw new HttpError(409, 'That product, location and lot is already on the count');
    throw e;
  }
  return c.json({ ok: true }, 201);
});

inventoryRoutes.put('/c/:company/counts/:id/counted', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const n = await loadCount(db, a.companyId, c.req.param('id'));
  if (n.status !== 'open') badState(`${n.number} is ${n.status}: counts can be entered only while it is open`);
  const input = await body(c, z.object({ lines: z.array(z.object({ id: zId, counted: z.number().min(0).max(1e9).nullable() })).min(1).max(2000) }));
  const t = now();
  await db.batch([
    ...input.lines.map((x) =>
      db
        .prepare("UPDATE erp_count_lines SET counted_qty = ?, counted_by = ?, counted_at = ? WHERE company_id = ? AND count_id = ? AND id = ? AND (serial = '' OR ? IS NULL OR ? <= 1)")
        .bind(x.counted, x.counted === null ? null : a.userId, x.counted === null ? null : t, a.companyId, n.id, x.id, x.counted, x.counted),
    ),
    db.prepare('UPDATE erp_counts SET updated_at = ? WHERE company_id = ? AND id = ?').bind(t, a.companyId, n.id),
  ]);
  return c.json({ ok: true });
});

inventoryRoutes.post('/c/:company/counts/:id/:action{submit|cancel}', async (c) => {
  const a = await requireErp(c, 'inventory.operate');
  const db = c.env.DB;
  const n = await loadCount(db, a.companyId, c.req.param('id'));
  const submit = c.req.param('action') === 'submit';
  if (submit && n.status !== 'open') badState(`${n.number} is ${n.status}`);
  if (!submit && n.status !== 'open' && n.status !== 'submitted') badState(`${n.number} is ${n.status}`);
  if (submit && n.counted < n.lines) badState(`Count every line first: ${n.lines - n.counted} of ${n.lines} have no count`);
  if (submit && !n.lines) badState('The count has no lines');
  const t = now();
  await db.batch([
    db
      .prepare(`UPDATE erp_counts SET status = ?, ${submit ? 'submitted_by = ?, submitted_at = ?,' : ''} updated_at = ? WHERE company_id = ? AND id = ? AND status = ?`)
      .bind(submit ? 'submitted' : 'cancelled', ...(submit ? [a.userId, t] : []), t, a.companyId, n.id, n.status),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: submit ? 'count.submitted' : 'count.cancelled', entityType: 'count', entityId: n.id, summary: `${n.number} ${submit ? `submitted for approval with ${n.variances} variance${n.variances === 1 ? '' : 's'}` : 'cancelled'}`, at: t }),
  ]);
  return c.json({ ok: true });
});

/** Approves a submitted count: each variance (counted less expected) posts as a movement, in one transaction. */
inventoryRoutes.post('/c/:company/counts/:id/approve', async (c) => {
  const a = await requireErp(c, 'inventory.approve');
  const db = c.env.DB;
  const n = await loadCount(db, a.companyId, c.req.param('id'));
  if (n.status !== 'submitted') badState(`${n.number} is ${n.status}: submit it first`);
  const sod = segregation(a, n.submitted_by ?? n.created_by, 'counted this');
  const settings = await loadSettings(db, a.companyId);
  const ops = new StockOps(db, a, settings);
  const lines = await db.prepare('SELECT * FROM erp_count_lines WHERE company_id = ? AND count_id = ? AND counted_qty IS NOT NULL AND abs(counted_qty - expected_qty) > 1e-9').bind(a.companyId, n.id).all<any>();
  for (const x of lines.results) {
    const v = q6(x.counted_qty - x.expected_qty);
    const key: StockKey = { productId: x.product_id, locationId: x.location_id, lot: x.lot, serial: x.serial };
    if (v > 0) await ops.addIn('count_in', key, v, { source: 'count', sourceId: n.id, reference: n.number, reason: 'Count variance' });
    else await ops.takeOut('count_out', key, -v, { source: 'count', sourceId: n.id, reference: n.number, reason: 'Count variance' });
  }
  await runStock(
    db,
    ops.all(
      [onceStmt(db, a.companyId, `count:${n.id}`, ops.t)],
      [
        db
          .prepare("UPDATE erp_counts SET status = 'posted', approved_by = ?, approved_at = ?, sod_exception = ?, group_id = ?, updated_at = ? WHERE company_id = ? AND id = ? AND status = 'submitted'")
          .bind(a.userId, ops.t, sod ? 1 : 0, ops.groupId, ops.t, a.companyId, n.id),
        eventStmt(db, {
          companyId: a.companyId,
          actorId: a.userId,
          action: 'count.approved',
          entityType: 'count',
          entityId: n.id,
          summary: `${n.number} approved: ${lines.results.length} variance${lines.results.length === 1 ? '' : 's'} posted${sod ? ' by the person who counted it (company of one: recorded exception)' : ''}`,
          after: { variances: lines.results.length, sodException: sod },
          at: ops.t,
        }),
      ],
      { type: 'count', id: n.id },
    ),
  );
  return c.json({ ok: true, variances: lines.results.length, groupId: ops.groupId });
});

// ------------------------------------------------------------------ valuation and traceability

inventoryRoutes.get('/c/:company/valuation', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const settings = await loadSettings(db, a.companyId);
  const wh = c.req.query('warehouseId');
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, p.standard_cost_cents, v.qty, v.value_cents,
              (SELECT COALESCE(SUM(s.on_hand), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id ${wh ? 'AND l.warehouse_id = ?' : ''}) AS here,
              (SELECT COUNT(*) FROM erp_cost_layers x WHERE x.company_id = p.company_id AND x.product_id = p.id AND x.qty_remaining > 1e-9) AS layers
         FROM erp_valuation v JOIN erp_products p ON p.company_id = v.company_id AND p.id = v.product_id
        WHERE v.company_id = ? AND (abs(v.qty) > 1e-9 OR v.value_cents <> 0) ORDER BY p.number COLLATE NOCASE`,
    )
    .bind(...(wh ? [wh] : []), a.companyId)
    .all<any>();
  const list = rows.results
    .map((r) => {
      const unit = r.qty > 1e-9 ? r.value_cents / r.qty : null;
      const qtyHere = wh ? q6(Number(r.here)) : q6(r.qty);
      const value = wh ? (unit === null ? 0 : Math.round(unit * qtyHere)) : r.value_cents;
      return { productId: r.id, number: r.number, name: r.name, uom: r.uom, quantity: qtyHere, unitCostCents: unit, valueCents: value, standardCostCents: r.standard_cost_cents, openLayers: r.layers };
    })
    .filter((r) => !wh || Math.abs(r.quantity) > 1e-9);
  const total = list.reduce((s, r) => s + r.valueCents, 0);
  if (wantsCsv(c)) {
    return csvResponse('stock-valuation', [['Product', 'Name', 'Quantity', 'Unit', 'Unit cost', `Value (${settings.currency})`, 'Standard cost'], ...list.map((r) => [r.number, r.name, r.quantity, r.uom, r.unitCostCents === null ? '' : (r.unitCostCents / 100).toFixed(4), dollars(r.valueCents), dollars(r.standardCostCents)]), ['Total', '', '', '', '', dollars(total), '']]);
  }
  return c.json({
    method: settings.costingMethod ?? 'weighted_average',
    methodLabel: COSTING_LABELS[settings.costingMethod ?? 'weighted_average'],
    locked: !!settings.costingLockedAt,
    currency: settings.currency,
    rows: list,
    totalCents: total,
    note: wh ? 'A warehouse’s value is its quantity at the product’s average unit cost.' : null,
    financePosting: 'Planned: Finance posting (Release 3). Stock value is kept in the ERP and is not posted to Finance’s ledger yet.',
  });
});

/** A lot or serial number from the supplier, order and receipt it came in on to every later move and where it is now. */
inventoryRoutes.get('/c/:company/trace', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const db = c.env.DB;
  const productId = c.req.query('productId') ?? '';
  const lot = (c.req.query('lot') ?? '').trim();
  const serial = (c.req.query('serial') ?? '').trim();
  if (!lot && !serial) throw new HttpError(400, 'Give a lot or a serial number');
  const where = ['m.company_id = ?'];
  const args: unknown[] = [a.companyId];
  if (productId) {
    where.push('m.product_id = ?');
    args.push(productId);
  }
  if (lot) {
    where.push('m.lot = ?');
    args.push(lot);
  }
  if (serial) {
    where.push('m.serial = ?');
    args.push(serial);
  }
  const moves = await db.prepare(`${MOVE_SELECT} WHERE ${where.join(' AND ')} ORDER BY m.created_at, m.rowid LIMIT 2000`).bind(...args).all<any>();
  const receiptIds = [...new Set(moves.results.filter((m) => m.source_type === 'receipt' && m.source_id).map((m) => m.source_id as string))];
  const receipts = receiptIds.length
    ? (
        await db
          .prepare(
            `SELECT r.id, r.number, r.received_date, r.delivery_ref, o.id AS po_id, o.number AS po_number, s.id AS supplier_id, s.number AS supplier_number, s.legal_name AS supplier_name
               FROM erp_receipts r JOIN erp_purchase_orders o ON o.company_id = r.company_id AND o.id = r.po_id JOIN erp_suppliers s ON s.company_id = r.company_id AND s.id = r.supplier_id
              WHERE r.company_id = ? AND r.id IN (${receiptIds.map(() => '?').join(',')})`,
          )
          .bind(a.companyId, ...receiptIds)
          .all<any>()
      ).results
    : [];
  const now_ = await db
    .prepare(
      `SELECT s.*, p.number AS product_number, p.name AS product_name, l.code AS location_code, l.kind, w.code AS warehouse_code FROM erp_stock s
         JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
        WHERE s.company_id = ? ${productId ? 'AND s.product_id = ?' : ''} ${lot ? 'AND s.lot = ?' : ''} ${serial ? 'AND s.serial = ?' : ''} AND s.on_hand <> 0`,
    )
    .bind(a.companyId, ...(productId ? [productId] : []), ...(lot ? [lot] : []), ...(serial ? [serial] : []))
    .all<any>();
  return c.json({
    lot,
    serial,
    origins: receipts.map((r) => ({ receiptId: r.id, receiptNumber: r.number, receivedDate: r.received_date, deliveryRef: r.delivery_ref, poId: r.po_id, poNumber: r.po_number, supplierId: r.supplier_id, supplierNumber: r.supplier_number, supplierName: r.supplier_name })),
    moves: moves.results.map(moveDTO),
    current: now_.results.map(stockRowDTO),
  });
});

/** Stock QR label sheet data: the products or locations, for printing several labels at once. */
inventoryRoutes.get('/c/:company/labels', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  assertCan(a, 'products.view');
  const db = c.env.DB;
  const wh = c.req.query('warehouseId');
  if (wh) {
    const rows = await db
      .prepare('SELECT l.*, w.code AS warehouse_code FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.warehouse_id = ? AND l.archived_at IS NULL ORDER BY l.code COLLATE NOCASE LIMIT 500')
      .bind(a.companyId, wh)
      .all<any>();
    return c.json({ labels: rows.results.map((l) => ({ kind: 'location', id: l.id, title: `${l.warehouse_code}/${l.code}`, subtitle: l.name, code: locationCode(l.warehouse_code, l.code), svg: `/api/erp/c/${a.companyId}/locations/${l.id}/qr.svg` })) });
  }
  const ids = (c.req.query('productIds') ?? '').split(',').filter((x) => NUMBER_RE.test(x) || x.length <= 64).slice(0, 200);
  const rows = ids.length
    ? await db.prepare(`SELECT id, number, name FROM erp_products WHERE company_id = ? AND id IN (${ids.map(() => '?').join(',')}) ORDER BY number COLLATE NOCASE`).bind(a.companyId, ...ids).all<any>()
    : { results: [] as any[] };
  return c.json({ labels: rows.results.map((p) => ({ kind: 'product', id: p.id, title: p.number, subtitle: p.name, code: p.number, svg: `/api/erp/c/${a.companyId}/products/${p.id}/qr.svg` })) });
});
