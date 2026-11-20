// Putaway suggestions and replenishment (batch 2, item 6; catalogue 49 and 53).
//
//   Putaway    where a received product goes when nobody chooses: the product's default location, else the open
//              location where it is already stored the most (never quarantine, scrap or dispatch), else the
//              warehouse's receiving area. A goods receipt uses it (purchasing.ts) and the receipt screen shows it.
//   Replenish  every stocked product whose available stock and what is on order is at or below its reorder point,
//              ordered up to its maximum level, on one draft requisition through the requisition code
//              (procurement.ts), so it is approved as any other. A product already on an open requisition is not
//              asked for twice; one without a maximum level is listed, not ordered.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { body } from '../lib/util';
import { requireErp } from './access';
import { badState, zId } from './util';
import { q6 } from './stock';
import { createRequisition } from './procurement';

export const replenishRoutes = new Hono<AppEnv>();

export interface Putaway {
  locationId: string;
  label: string;
  reason: string;
}

/** The suggested location for a product (in one warehouse when given). */
export async function putawayFor(db: D1Database, companyId: string, productId: string, warehouseId?: string | null): Promise<Putaway | null> {
  const wh = warehouseId ? ' AND l.warehouse_id = ?' : '';
  const whArgs = warehouseId ? [warehouseId] : [];
  const def = await db
    .prepare(`SELECT l.id, l.code, l.name FROM erp_product_stock ps JOIN erp_locations l ON l.company_id = ps.company_id AND l.id = ps.default_location_id WHERE ps.company_id = ? AND ps.product_id = ? AND l.archived_at IS NULL${wh}`)
    .bind(companyId, productId, ...whArgs)
    .first<{ id: string; code: string; name: string }>();
  if (def) return { locationId: def.id, label: `${def.code}${def.name ? ` ${def.name}` : ''}`, reason: 'The product’s default location' };
  const most = await db
    .prepare(`SELECT l.id, l.code, l.name, SUM(s.on_hand) AS q FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = ? AND s.product_id = ? AND s.on_hand > 0 AND l.archived_at IS NULL AND l.kind IN ('normal','finished_goods')${wh} GROUP BY l.id ORDER BY q DESC, l.code LIMIT 1`)
    .bind(companyId, productId, ...whArgs)
    .first<{ id: string; code: string; name: string; q: number }>();
  if (most) return { locationId: most.id, label: `${most.code}${most.name ? ` ${most.name}` : ''}`, reason: `Where it is stored the most (${q6(most.q)} on hand)` };
  const recv = await db
    .prepare(`SELECT l.id, l.code, l.name FROM erp_locations l JOIN erp_warehouses w ON w.company_id = l.company_id AND w.id = l.warehouse_id WHERE l.company_id = ? AND l.kind = 'receiving' AND l.archived_at IS NULL AND w.archived_at IS NULL${wh} ORDER BY l.code LIMIT 1`)
    .bind(companyId, ...whArgs)
    .first<{ id: string; code: string; name: string }>();
  if (recv) return { locationId: recv.id, label: `${recv.code}${recv.name ? ` ${recv.name}` : ''}`, reason: 'The receiving area: the product is not stored anywhere yet' };
  return null;
}

replenishRoutes.get('/c/:company/inventory/putaway', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  const ids = (c.req.query('productIds') ?? '').split(',').map((x) => x.trim()).filter((x) => /^[A-Za-z0-9_-]{1,64}$/.test(x)).slice(0, 100);
  const warehouseId = c.req.query('warehouseId') || null;
  const out: Record<string, Putaway | null> = {};
  for (const id of ids) out[id] = await putawayFor(c.env.DB, a.companyId, id, warehouseId);
  return c.json({ suggestions: out });
});

// ------------------------------------------------------------------ replenishment

interface Need {
  productId: string;
  number: string;
  name: string;
  uom: string;
  available: number;
  onOrder: number;
  reorderPoint: number;
  maxQty: number | null;
  suggestQty: number | null;
  onRequisition: string | null;
  unitCostCents: number | null;
  note: string;
}

const MADE = ['manufactured_part', 'assembly', 'subassembly', 'finished_product'];
const MAX_LINES = 200;

async function needs(db: D1Database, companyId: string): Promise<Need[]> {
  const rows = await db
    .prepare(
      `SELECT p.id, p.number, p.name, p.uom, p.type, p.standard_cost_cents, ps.reorder_point, ps.max_qty,
              (SELECT COALESCE(SUM(s.on_hand - s.reserved), 0) FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id WHERE s.company_id = p.company_id AND s.product_id = p.id AND l.kind <> 'quarantine') AS available,
              -- orders still being drafted or approved count as on order too, so nothing is asked for twice
              (SELECT COALESCE(SUM(pl.quantity - pl.received_qty), 0) FROM erp_po_lines pl JOIN erp_purchase_orders o ON o.company_id = pl.company_id AND o.id = pl.po_id WHERE pl.company_id = p.company_id AND pl.product_id = p.id AND o.status IN ('draft','awaiting_approval','approved','sent','partially_received')) AS on_order,
              (SELECT r.number FROM erp_requisition_lines rl JOIN erp_requisitions r ON r.company_id = rl.company_id AND r.id = rl.requisition_id WHERE rl.company_id = p.company_id AND rl.product_id = p.id AND r.status IN ('draft','submitted','approved') ORDER BY r.created_at DESC LIMIT 1) AS on_req,
              (SELECT x.price_cents FROM erp_product_suppliers x WHERE x.company_id = p.company_id AND x.product_id = p.id AND x.preferred = 1 LIMIT 1) AS supplier_price
         FROM erp_products p JOIN erp_product_stock ps ON ps.company_id = p.company_id AND ps.product_id = p.id
        WHERE p.company_id = ? AND p.archived_at IS NULL AND p.type <> 'service' AND ps.reorder_point IS NOT NULL
        ORDER BY p.number COLLATE NOCASE LIMIT 2000`,
    )
    .bind(companyId)
    .all<any>();
  const out: Need[] = [];
  for (const r of rows.results) {
    const projected = q6(Number(r.available) + Number(r.on_order));
    if (projected > Number(r.reorder_point) + 1e-9) continue;
    const max = r.max_qty === null || r.max_qty === undefined ? null : Number(r.max_qty);
    const qty = max === null ? null : q6(max - projected);
    // what the company makes is planned in Manufacturing (MRP), not bought
    const made = MADE.includes(r.type);
    out.push({
      productId: r.id,
      number: r.number,
      name: r.name,
      uom: r.uom || 'each',
      available: q6(Number(r.available)),
      onOrder: q6(Number(r.on_order)),
      reorderPoint: Number(r.reorder_point),
      maxQty: max,
      suggestQty: r.on_req || made ? null : qty !== null && qty > 0 ? qty : null,
      onRequisition: r.on_req ?? null,
      unitCostCents: r.supplier_price ?? r.standard_cost_cents ?? null,
      note: made ? 'Made by the company: plan it in Manufacturing (MRP or a manufacturing order)' : r.on_req ? `Already on requisition ${r.on_req}` : max === null ? 'Set a maximum level to order up to' : qty !== null && qty > 0 ? `Order up to the maximum level of ${max}` : 'The maximum level is reached by what is on order',
    });
  }
  return out;
}

replenishRoutes.get('/c/:company/inventory/replenishment', async (c) => {
  const a = await requireErp(c, 'inventory.view');
  return c.json({ products: await needs(c.env.DB, a.companyId), note: 'Products whose available stock and what is on order is at or below the reorder point. Reorder points and maximum levels are set on each product’s stock settings.' });
});

replenishRoutes.post('/c/:company/inventory/replenishment', async (c) => {
  const a = await requireErp(c, 'requisitions.raise');
  const input = await body(c, z.object({ productIds: z.array(zId).max(500).optional(), submit: z.boolean().optional() }));
  const list = (await needs(c.env.DB, a.companyId)).filter((n) => n.suggestQty !== null && (!input.productIds || input.productIds.includes(n.productId)));
  if (!list.length) badState('Nothing needs replenishing: every product is above its reorder point, already ordered or requested, made by the company, or has no maximum level');
  // a requisition holds at most 200 lines: the rest are left for the next one
  list.splice(MAX_LINES);
  const made = await createRequisition(
    c.env.DB,
    a,
    {
      title: `Replenishment to maximum levels, ${new Date().toISOString().slice(0, 10)}`,
      reason: 'Stock at or below the reorder point (Inventory, Replenishment).',
      submit: input.submit ?? false,
      lines: list.map((n) => ({ productId: n.productId, quantity: n.suggestQty!, ...(n.unitCostCents !== null ? { estUnitCostCents: n.unitCostCents } : {}) })),
    } as any,
    'replenishment',
  );
  return c.json({ ...(made as object), lines: list.length }, 201);
});
