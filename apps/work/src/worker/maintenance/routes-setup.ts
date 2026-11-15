// Maintenance set-up for stages M2 and M3 (/api/maintenance/c/:company/...): sites and the site of each asset, trades and
// technicians with their labour rates (and how each labour line is priced), maintenance stores (ERP warehouses) with the
// stock in them, QR labels for assets and the scan lookup. Supervisors and administrators change these; everyone with
// access to the company may read sites, stores and the scan lookup.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, newId, notFound, now } from '../lib/util';
import { qrSvg } from '../erp/qr';
import { companyPeople, isManager, requireMt, workOrderScope } from './access';
import { SUBTREE_SQL, loadAsset } from './routes-assets';
import { OUTSTANDING, eventStmt, likeOf, sqlList, zId, zText } from './util';
import { assertSite } from './m2util';

export const setupRoutes = new Hono<AppEnv>();

const CODE_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,39}$/;
const zCode = zText(40).regex(CODE_RE, 'Use letters, digits and . _ / - (up to 40)');
const zRate = z.number().int().min(0).max(100_000_000).nullable();

// ------------------------------------------------------------------ labour pricing

/**
 * Prices labour lines once, when their time is recorded: the person's own rate, else the rate of the work order's trade,
 * else the highest rate of the person's trades, else none (the line is kept with no cost and counted as "no rate").
 * Cost = minutes x hourly rate / 60, rounded to whole cents. Lines already priced are left alone.
 */
export function priceLabourStmt(db: D1Database, companyId: string, workOrderId: string, by: { labourId?: string; endedAt?: number }, o: { entry: 'timer' | 'manual'; note?: string; t: number }) {
  return db
    .prepare(
      `INSERT INTO mt_labour_costs (labour_id, company_id, work_order_id, entry, work_date, minutes, rate_cents, rate_source, cost_cents, note, entered_by, created_at)
       SELECT x.id, x.company_id, x.work_order_id, ?1, date(x.started_at / 1000, 'unixepoch'), x.minutes, COALESCE(x.r1, x.r2, x.r3),
              CASE WHEN x.r1 IS NOT NULL THEN 'person' WHEN x.r2 IS NOT NULL THEN 'work_order_trade' WHEN x.r3 IS NOT NULL THEN 'person_trade' ELSE '' END,
              CASE WHEN COALESCE(x.r1, x.r2, x.r3) IS NULL THEN NULL ELSE CAST(round(x.minutes * COALESCE(x.r1, x.r2, x.r3) / 60.0) AS INTEGER) END,
              ?2, x.user_id, ?3
         FROM (SELECT l.id, l.company_id, l.work_order_id, l.started_at, l.minutes, l.user_id,
                      (SELECT t.rate_cents FROM mt_technicians t WHERE t.company_id = l.company_id AND t.user_id = l.user_id) AS r1,
                      (SELECT tr.rate_cents FROM mt_trades tr WHERE tr.company_id = w.company_id AND w.trade <> '' AND tr.name = w.trade AND tr.archived_at IS NULL) AS r2,
                      (SELECT MAX(tr.rate_cents) FROM mt_technician_trades tt JOIN mt_trades tr ON tr.company_id = tt.company_id AND tr.id = tt.trade_id AND tr.archived_at IS NULL
                        WHERE tt.company_id = l.company_id AND tt.user_id = l.user_id) AS r3
                 FROM mt_labour l JOIN mt_work_orders w ON w.company_id = l.company_id AND w.id = l.work_order_id
                WHERE l.company_id = ?4 AND l.work_order_id = ?5 AND l.ended_at IS NOT NULL AND l.minutes IS NOT NULL
                  AND (?6 IS NULL OR l.id = ?6) AND (?7 IS NULL OR l.ended_at = ?7)
                  AND NOT EXISTS (SELECT 1 FROM mt_labour_costs c WHERE c.labour_id = l.id)) x`,
    )
    .bind(o.entry, (o.note ?? '').slice(0, 500), o.t, companyId, workOrderId, by.labourId ?? null, by.endedAt ?? null);
}

// ------------------------------------------------------------------ sites

const siteDTO = (s: any) => ({ id: s.id, code: s.code, name: s.name, address: s.address, notes: s.notes, archived: !!s.archived_at, assets: s.assets ?? 0, createdAt: s.created_at });

setupRoutes.get('/c/:company/sites', async (c) => {
  const a = await requireMt(c);
  const rows = await c.env.DB.prepare(
    `SELECT s.*, (SELECT COUNT(*) FROM mt_asset_sites x JOIN mt_assets aa ON aa.company_id = x.company_id AND aa.id = x.asset_id AND aa.archived_at IS NULL WHERE x.company_id = s.company_id AND x.site_id = s.id) AS assets
       FROM mt_sites s WHERE s.company_id = ? ORDER BY s.archived_at IS NOT NULL, s.code COLLATE NOCASE LIMIT 500`,
  )
    .bind(a.companyId)
    .all<any>();
  const unplaced = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM mt_assets aa WHERE aa.company_id = ? AND aa.archived_at IS NULL AND NOT EXISTS (SELECT 1 FROM mt_asset_sites x WHERE x.company_id = aa.company_id AND x.asset_id = aa.id)').bind(a.companyId).first<{ n: number }>();
  return c.json({ sites: rows.results.map(siteDTO), unplaced: unplaced?.n ?? 0, can: { manage: isManager(a) } });
});

const siteSchema = z.object({ code: zCode, name: zText(200).min(1), address: zText(500).optional(), notes: zText(2000).optional() });

setupRoutes.post('/c/:company/sites', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const input = await body(c, siteSchema);
  const db = c.env.DB;
  if (await db.prepare('SELECT 1 FROM mt_sites WHERE company_id = ? AND code = ?').bind(a.companyId, input.code).first()) throw new HttpError(409, `Site code ${input.code} is already used`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO mt_sites (id, company_id, code, name, address, notes, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.code, input.name, input.address ?? '', input.notes ?? '', a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'site.created', summary: `Site ${input.code} ${input.name} created`, after: input, at: t }),
  ]);
  return c.json(siteDTO(await db.prepare('SELECT * FROM mt_sites WHERE company_id = ? AND id = ?').bind(a.companyId, id).first<any>()), 201);
});

setupRoutes.patch('/c/:company/sites/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const s = await db.prepare('SELECT * FROM mt_sites WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!s) throw notFound('Site');
  const input = await body(c, siteSchema.partial().extend({ archived: z.boolean().optional() }));
  if (input.code && input.code.toLowerCase() !== String(s.code).toLowerCase() && (await db.prepare('SELECT 1 FROM mt_sites WHERE company_id = ? AND code = ? AND id <> ?').bind(a.companyId, input.code, s.id).first())) {
    throw new HttpError(409, `Site code ${input.code} is already used`);
  }
  const next = { code: input.code ?? s.code, name: input.name ?? s.name, address: input.address ?? s.address, notes: input.notes ?? s.notes, archived_at: input.archived === undefined ? s.archived_at : input.archived ? (s.archived_at ?? now()) : null };
  const t = now();
  await db.batch([
    db.prepare('UPDATE mt_sites SET code = ?, name = ?, address = ?, notes = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.code, next.name, next.address, next.notes, next.archived_at, t, a.companyId, s.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'site.updated', summary: `Site ${next.code} changed${input.archived === true ? ' (archived)' : input.archived === false ? ' (restored)' : ''}`, before: { code: s.code, name: s.name, archived: !!s.archived_at }, after: { code: next.code, name: next.name, archived: !!next.archived_at }, at: t }),
  ]);
  return c.json(siteDTO({ ...s, ...next }));
});

/** Places an asset (and, if asked, every asset under it) in a site, or takes it out of its site. */
setupRoutes.put('/c/:company/assets/:id/site', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const asset = await loadAsset(db, a.companyId, c.req.param('id'));
  const input = await body(c, z.object({ siteId: zId.nullable(), includeChildren: z.boolean().optional() }));
  const site = await assertSite(db, a.companyId, input.siteId);
  const ids = input.includeChildren ? (await db.prepare(SUBTREE_SQL).bind(a.companyId, asset.id, a.companyId).all<{ id: string }>()).results.map((r) => r.id) : [asset.id];
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  for (const id of ids) {
    stmts.push(
      site
        ? db.prepare('INSERT INTO mt_asset_sites (company_id, asset_id, site_id, set_by, set_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, asset_id) DO UPDATE SET site_id = excluded.site_id, set_by = excluded.set_by, set_at = excluded.set_at').bind(a.companyId, id, site.id, a.userId, t)
        : db.prepare('DELETE FROM mt_asset_sites WHERE company_id = ? AND asset_id = ?').bind(a.companyId, id),
    );
  }
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'asset.site', assetId: asset.id, summary: site ? `Placed in site ${site.code} ${site.name}${ids.length > 1 ? ` with ${ids.length - 1} assets under it` : ''}` : `Taken out of its site${ids.length > 1 ? ` with ${ids.length - 1} assets under it` : ''}`, after: { siteId: site?.id ?? null, assets: ids.length }, at: t }));
  for (let i = 0; i < stmts.length; i += 100) await db.batch(stmts.slice(i, i + 100));
  return c.json({ siteId: site?.id ?? null, assets: ids.length });
});

// ------------------------------------------------------------------ trades and technicians

const tradeDTO = (t: any) => ({ id: t.id, name: t.name, rateCents: t.rate_cents, archived: !!t.archived_at, people: t.people ?? 0 });

setupRoutes.get('/c/:company/trades', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const manager = isManager(a);
  const trades = await db.prepare('SELECT t.*, (SELECT COUNT(*) FROM mt_technician_trades x WHERE x.company_id = t.company_id AND x.trade_id = t.id) AS people FROM mt_trades t WHERE t.company_id = ? ORDER BY t.archived_at IS NOT NULL, t.name COLLATE NOCASE LIMIT 500').bind(a.companyId).all<any>();
  const people = await companyPeople(db, a);
  const [rates, links] = await db.batch([
    db.prepare('SELECT user_id, rate_cents FROM mt_technicians WHERE company_id = ?').bind(a.companyId),
    db.prepare('SELECT user_id, trade_id FROM mt_technician_trades WHERE company_id = ?').bind(a.companyId),
  ]);
  const rate = new Map((rates.results as any[]).map((r) => [r.user_id, r.rate_cents]));
  const tradesOf = new Map<string, string[]>();
  for (const l of links.results as any[]) tradesOf.set(l.user_id, [...(tradesOf.get(l.user_id) ?? []), l.trade_id]);
  return c.json({
    // Rates are shown to supervisors and administrators only.
    trades: trades.results.map((t) => ({ ...tradeDTO(t), rateCents: manager ? t.rate_cents : undefined })),
    technicians: people.map((p) => ({ id: p.id, name: p.name, role: manager ? p.role : undefined, rateCents: manager ? (rate.get(p.id) ?? null) : undefined, tradeIds: tradesOf.get(p.id) ?? [] })),
    can: { manage: manager },
  });
});

const tradeSchema = z.object({ name: zText(80).min(1), rateCents: zRate.optional() });

setupRoutes.post('/c/:company/trades', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const input = await body(c, tradeSchema);
  const db = c.env.DB;
  if (await db.prepare('SELECT 1 FROM mt_trades WHERE company_id = ? AND name = ?').bind(a.companyId, input.name).first()) throw new HttpError(409, `The trade ${input.name} already exists`);
  const id = newId();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO mt_trades (id, company_id, name, rate_cents, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(id, a.companyId, input.name, input.rateCents ?? null, a.userId, t, t),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'trade.created', summary: `Trade ${input.name} created`, after: input, at: t }),
  ]);
  return c.json(tradeDTO({ id, name: input.name, rate_cents: input.rateCents ?? null }), 201);
});

setupRoutes.patch('/c/:company/trades/:id', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const tr = await db.prepare('SELECT * FROM mt_trades WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('id')).first<any>();
  if (!tr) throw notFound('Trade');
  const input = await body(c, tradeSchema.partial().extend({ archived: z.boolean().optional() }));
  if (input.name && input.name.toLowerCase() !== String(tr.name).toLowerCase() && (await db.prepare('SELECT 1 FROM mt_trades WHERE company_id = ? AND name = ? AND id <> ?').bind(a.companyId, input.name, tr.id).first())) {
    throw new HttpError(409, `The trade ${input.name} already exists`);
  }
  const next = { name: input.name ?? tr.name, rate_cents: input.rateCents !== undefined ? input.rateCents : tr.rate_cents, archived_at: input.archived === undefined ? tr.archived_at : input.archived ? (tr.archived_at ?? now()) : null };
  const t = now();
  await db.batch([
    db.prepare('UPDATE mt_trades SET name = ?, rate_cents = ?, archived_at = ?, updated_at = ? WHERE company_id = ? AND id = ?').bind(next.name, next.rate_cents, next.archived_at, t, a.companyId, tr.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'trade.updated', summary: `Trade ${next.name} changed`, before: { name: tr.name, rateCents: tr.rate_cents, archived: !!tr.archived_at }, after: { name: next.name, rateCents: next.rate_cents, archived: !!next.archived_at }, at: t }),
  ]);
  return c.json(tradeDTO({ ...tr, ...next }));
});

/** A person's labour rate and trades. Past labour keeps the cost it was given when it was recorded. */
setupRoutes.put('/c/:company/technicians/:userId', async (c) => {
  const a = await requireMt(c, 'supervisor');
  const db = c.env.DB;
  const person = (await companyPeople(db, a)).find((p) => p.id === c.req.param('userId'));
  if (!person) throw notFound('Person');
  const input = await body(c, z.object({ rateCents: zRate.optional(), tradeIds: z.array(zId).max(50).optional() }));
  const t = now();
  const stmts: D1PreparedStatement[] = [];
  if (input.rateCents !== undefined) {
    stmts.push(db.prepare('INSERT INTO mt_technicians (company_id, user_id, rate_cents, updated_by, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(company_id, user_id) DO UPDATE SET rate_cents = excluded.rate_cents, updated_by = excluded.updated_by, updated_at = excluded.updated_at').bind(a.companyId, person.id, input.rateCents, a.userId, t));
  }
  if (input.tradeIds) {
    const ids = [...new Set(input.tradeIds)];
    if (ids.length) {
      const found = await db.prepare(`SELECT COUNT(*) AS n FROM mt_trades WHERE company_id = ? AND archived_at IS NULL AND id IN (${ids.map(() => '?').join(',')})`).bind(a.companyId, ...ids).first<{ n: number }>();
      if ((found?.n ?? 0) !== ids.length) throw new HttpError(400, 'Choose trades of this company');
    }
    stmts.push(db.prepare('DELETE FROM mt_technician_trades WHERE company_id = ? AND user_id = ?').bind(a.companyId, person.id));
    for (const id of ids) stmts.push(db.prepare('INSERT INTO mt_technician_trades (company_id, user_id, trade_id) VALUES (?, ?, ?)').bind(a.companyId, person.id, id));
  }
  if (!stmts.length) return c.json({ ok: true });
  stmts.push(eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'technician.updated', summary: `${person.name}: labour rate or trades changed`, after: { userId: person.id, ...input }, at: t }));
  await db.batch(stmts);
  return c.json({ ok: true });
});

// ------------------------------------------------------------------ maintenance stores (ERP warehouses)

setupRoutes.get('/c/:company/stores', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const [whs, counts] = await db.batch([
    db.prepare('SELECT w.id, w.code, w.name, w.archived_at, (s.warehouse_id IS NOT NULL) AS is_store FROM erp_warehouses w LEFT JOIN mt_stores s ON s.company_id = w.company_id AND s.warehouse_id = w.id WHERE w.company_id = ? ORDER BY w.code COLLATE NOCASE LIMIT 200').bind(a.companyId),
    // Release 2's stocktakes and cycle counts of each store, the latest first (counted in Inventory, not here).
    db.prepare("SELECT c.id, c.number, c.kind, c.status, c.warehouse_id, c.created_at FROM erp_counts c JOIN mt_stores s ON s.company_id = c.company_id AND s.warehouse_id = c.warehouse_id WHERE c.company_id = ? ORDER BY c.created_at DESC LIMIT 50").bind(a.companyId),
  ]);
  const byWh = new Map<string, any[]>();
  for (const k of counts.results as any[]) byWh.set(k.warehouse_id, [...(byWh.get(k.warehouse_id) ?? []), { id: k.id, number: k.number, kind: k.kind, status: k.status, createdAt: k.created_at }]);
  return c.json({
    warehouses: (whs.results as any[]).map((w) => ({ id: w.id, code: w.code, name: w.name, archived: !!w.archived_at, isStore: !!w.is_store, counts: (byWh.get(w.id) ?? []).slice(0, 5) })),
    can: { manage: a.role === 'admin' },
  });
});

setupRoutes.put('/c/:company/stores/:warehouseId', async (c) => {
  const a = await requireMt(c, 'admin');
  const db = c.env.DB;
  const wh = await db.prepare('SELECT id, code, name FROM erp_warehouses WHERE company_id = ? AND id = ?').bind(a.companyId, c.req.param('warehouseId')).first<{ id: string; code: string; name: string }>();
  if (!wh) throw notFound('Warehouse');
  const input = await body(c, z.object({ store: z.boolean() }));
  const t = now();
  await db.batch([
    input.store
      ? db.prepare('INSERT INTO mt_stores (company_id, warehouse_id, set_by, set_at) VALUES (?, ?, ?, ?) ON CONFLICT(company_id, warehouse_id) DO NOTHING').bind(a.companyId, wh.id, a.userId, t)
      : db.prepare('DELETE FROM mt_stores WHERE company_id = ? AND warehouse_id = ?').bind(a.companyId, wh.id),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'store.changed', summary: input.store ? `Warehouse ${wh.code} is a maintenance store` : `Warehouse ${wh.code} is no longer a maintenance store`, after: { warehouseId: wh.id, store: input.store }, at: t }),
  ]);
  return c.json({ warehouseId: wh.id, store: input.store });
});

/** Stock in the maintenance stores (outside quarantine), for issuing parts to work orders (technicians and above; costs for supervisors and administrators). */
setupRoutes.get('/c/:company/stores/stock', async (c) => {
  const a = await requireMt(c, 'technician');
  const q = (c.req.query('q') ?? '').trim();
  const productId = c.req.query('productId') ?? '';
  const rows = await c.env.DB.prepare(
    `SELECT s.product_id, p.number, p.name, p.uom, s.location_id, l.code AS location_code, w.code AS warehouse_code, w.name AS warehouse_name, s.lot, s.serial, s.on_hand, s.reserved,
            (SELECT CASE WHEN v.qty > 1e-9 THEN v.value_cents * 1.0 / v.qty END FROM erp_valuation v WHERE v.company_id = s.company_id AND v.product_id = s.product_id) AS avg_cost
       FROM erp_stock s
       JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id AND l.kind <> 'quarantine'
       JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id
       JOIN mt_stores ms ON ms.company_id = w.company_id AND ms.warehouse_id = w.id
       JOIN erp_products p ON p.company_id = s.company_id AND p.id = s.product_id
      WHERE s.company_id = ? AND s.on_hand > 1e-9 ${q ? 'AND (lower(p.number) LIKE ? OR lower(p.name) LIKE ?)' : ''} ${productId ? 'AND s.product_id = ?' : ''}
      ORDER BY p.number COLLATE NOCASE, w.code, l.code LIMIT 300`,
  )
    .bind(a.companyId, ...(q ? [likeOf(q), likeOf(q)] : []), ...(productId ? [productId.slice(0, 64)] : []))
    .all<any>();
  return c.json({
    stock: rows.results.map((r) => ({
      productId: r.product_id,
      productNumber: r.number,
      productName: r.name,
      uom: r.uom,
      locationId: r.location_id,
      location: `${r.warehouse_code}/${r.location_code}`,
      warehouseName: r.warehouse_name,
      lot: r.lot,
      serial: r.serial,
      onHand: r.on_hand,
      available: Math.max(0, Math.round((r.on_hand - r.reserved) * 1e6) / 1e6),
      unitCostCents: !isManager(a) || r.avg_cost === null ? null : Math.round(r.avg_cost * 100) / 100,
    })),
  });
});

// ------------------------------------------------------------------ QR labels and the scan lookup

/** The code a label carries: ASSET:<number>. */
export const assetCode = (number: string) => `ASSET:${number}`;

setupRoutes.get('/c/:company/assets/:id/qr', async (c) => {
  const a = await requireMt(c);
  const asset = await loadAsset(c.env.DB, a.companyId, c.req.param('id'));
  return new Response(qrSvg(assetCode(asset.number), `${asset.number} ${asset.name}`.slice(0, 60)), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'private, max-age=300', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'" },
  });
});

/** A typed or scanned code to its asset: a label (ASSET:<number>), an asset number, a serial or a registration number. */
setupRoutes.get('/c/:company/scan', async (c) => {
  const a = await requireMt(c);
  const db = c.env.DB;
  const raw = (c.req.query('code') ?? '').trim().slice(0, 200);
  if (!raw) throw new HttpError(400, 'Type or scan a code');
  const code = raw.replace(/^ASSET:/i, '').trim();
  const asset =
    (await db.prepare('SELECT id FROM mt_assets WHERE company_id = ? AND number = ?').bind(a.companyId, code).first<{ id: string }>()) ??
    (await db.prepare("SELECT id FROM mt_assets WHERE company_id = ? AND serial_number <> '' AND serial_number = ? COLLATE NOCASE ORDER BY archived_at IS NOT NULL LIMIT 1").bind(a.companyId, code).first<{ id: string }>()) ??
    (await db.prepare("SELECT id FROM mt_assets WHERE company_id = ? AND registration_number <> '' AND registration_number = ? COLLATE NOCASE ORDER BY archived_at IS NOT NULL LIMIT 1").bind(a.companyId, code).first<{ id: string }>());
  if (!asset) throw new HttpError(404, `No asset has the code ${raw}`);
  const r = await loadAsset(db, a.companyId, asset.id);
  const wo = workOrderScope(a, 'w');
  const [prestart, open] = await db.batch([
    db.prepare('SELECT t.id, t.name FROM mt_asset_prestart p JOIN mt_insp_templates t ON t.company_id = p.company_id AND t.id = p.template_id AND t.archived_at IS NULL WHERE p.company_id = ? AND p.asset_id = ?').bind(a.companyId, r.id),
    db.prepare(`SELECT COUNT(*) AS n FROM mt_work_orders w WHERE w.company_id = ? AND w.asset_id = ? AND w.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql}`).bind(a.companyId, r.id, ...wo.args),
  ]);
  const p = prestart.results[0] as any;
  return c.json({
    asset: { id: r.id, number: r.number, name: r.name, status: r.status, criticality: r.criticality, archived: !!r.archived_at, location: r.location },
    prestart: p ? { templateId: p.id, name: p.name } : null,
    openWorkOrders: (open.results[0] as any)?.n ?? 0,
  });
});
