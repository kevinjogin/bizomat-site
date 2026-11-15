// BIZOMAT ERP, Release 2: the inventory service. Every change to stock goes through StockOps, which builds the
// statements of one transaction (D1's batch: all or nothing):
//
//   erp_stock         on hand and reserved per product, location, lot and serial (upserted). Its CHECK refuses stock
//                     below zero and reservations above stock unless the company allows negative stock (neg_ok), so
//                     two people taking the last unit at the same moment cannot both succeed: one transaction fails whole.
//   erp_stock_moves   the movement ledger, one row per change, with its source document (append-only: triggers refuse
//                     changes and deletions).
//   erp_valuation     quantity and value per product. Weighted average: an issue is valued in the same transaction at
//                     the value and quantity held at that moment (SQL, so it cannot use a stale average).
//   erp_cost_layers   FIFO: each receipt adds a layer; an issue takes the oldest layers first. The layers read before
//                     the transaction are updated with guards (qty_remaining never below zero), so a concurrent issue
//                     that took the same layer makes this transaction fail whole instead of valuing it twice.
//
// The costing method is locked by the first movement (weighted average if none was chosen). Each operation that
// changes stock value also records a Finance posting event as "planned": inventory postings to Finance's ledger are
// Release 3 (docs/erp/release-2.md); nothing is posted.

import { HttpError, newId, now } from '../lib/util';
import type { ErpAccess } from './access';
import type { ErpSettings } from './settings';

export type InType = 'receipt' | 'customer_return' | 'adjust_in' | 'count_in';
export type OutType = 'issue' | 'supplier_return' | 'adjust_out' | 'count_out' | 'scrap';
export type SourceType = 'receipt' | 'issue' | 'transfer' | 'reservation' | 'adjustment' | 'customer_return' | 'supplier_return' | 'count' | 'quarantine' | 'scrap';

export const MOVE_LABELS: Record<string, string> = {
  receipt: 'Goods receipt',
  issue: 'Issue',
  transfer_out: 'Transfer out',
  transfer_in: 'Transfer in',
  reserve: 'Reserved',
  unreserve: 'Reservation released',
  adjust_in: 'Adjustment in',
  adjust_out: 'Adjustment out',
  customer_return: 'Customer return',
  supplier_return: 'Return to supplier',
  count_in: 'Count variance in',
  count_out: 'Count variance out',
  quarantine_out: 'To quarantine (out)',
  quarantine_in: 'To quarantine (in)',
  release_out: 'Released from quarantine (out)',
  release_in: 'Released from quarantine (in)',
  scrap: 'Scrap',
};

export interface StockKey {
  productId: string;
  locationId: string;
  lot?: string;
  serial?: string;
}

interface MoveInfo {
  source: SourceType;
  sourceId?: string | null;
  reference?: string;
  reason?: string;
}

const EPS = 1e-9;

/** Rounds a quantity to six decimals, so sums of decimals never leave dust. */
export const q6 = (n: number) => Math.round(n * 1e6) / 1e6;

/** Turns a database refusal from a stock transaction into a plain answer. */
export function stockError(e: unknown): never {
  const msg = String((e as Error)?.message ?? e);
  if (/erp_stock_one_serial|UNIQUE constraint failed: erp_stock\.company_id, erp_stock\.product_id, erp_stock\.serial/i.test(msg)) throw new HttpError(409, 'That serial number is already in stock');
  if (/UNIQUE constraint failed: erp_done/i.test(msg)) throw new HttpError(409, 'This was already done: refresh to see it');
  if (/CHECK constraint failed/i.test(msg)) throw new HttpError(409, 'Not enough stock, or someone changed it at the same moment. Refresh and try again.');
  if (/ERP_LEDGER/.test(msg)) throw new HttpError(409, 'The stock movement ledger cannot be changed');
  throw e;
}

export async function runStock(db: D1Database, stmts: D1PreparedStatement[]) {
  try {
    return await db.batch(stmts);
  } catch (e) {
    stockError(e);
  }
}

export class StockOps {
  readonly groupId = newId();
  readonly stmts: D1PreparedStatement[] = [];
  readonly t: number;
  private layers = new Map<string, { id: string; qty: number; cost: number }[]>();
  private seq = 0;
  private valueChanged = false;
  private kinds = new Set<string>();

  constructor(
    readonly db: D1Database,
    readonly a: ErpAccess,
    readonly settings: ErpSettings,
    t?: number,
  ) {
    this.t = t ?? now();
  }

  get method() {
    return this.settings.costingMethod ?? 'weighted_average';
  }

  /**
   * The stock row made if missing (all zero, which the CHECK always allows), then changed by the deltas: the UPDATE is
   * where the CHECK refuses stock below zero. (One INSERT ... ON CONFLICT would not do: SQLite checks a CHECK constraint
   * on the row to be inserted before it finds the conflict.)
   */
  private stockStmts(k: StockKey, onHand: number, reserved: number, expiry: string | null) {
    const neg = '(SELECT COALESCE(MAX(allow_negative_stock), 0) FROM erp_settings WHERE company_id = ?)';
    return [
      this.db
        .prepare(`INSERT INTO erp_stock (id, company_id, product_id, location_id, lot, serial, expiry, on_hand, reserved, neg_ok, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ${neg}, ?) ON CONFLICT(company_id, product_id, location_id, lot, serial) DO NOTHING`)
        .bind(newId(), this.a.companyId, k.productId, k.locationId, k.lot ?? '', k.serial ?? '', expiry, this.a.companyId, this.t),
      this.db
        .prepare(
          `UPDATE erp_stock SET on_hand = round(on_hand + ?, 6), reserved = round(reserved + ?, 6), expiry = COALESCE(expiry, ?), neg_ok = ${neg}, updated_at = ?
            WHERE company_id = ? AND product_id = ? AND location_id = ? AND lot = ? AND serial = ?`,
        )
        .bind(onHand, reserved, expiry, this.a.companyId, this.t, this.a.companyId, k.productId, k.locationId, k.lot ?? '', k.serial ?? ''),
    ];
  }

  private moveStmt(id: string, type: string, k: StockKey, m: MoveInfo, o: { onHand: number; reserved: number; expiry?: string | null; unitCost: number | null; value: number }) {
    return this.db
      .prepare(
        `INSERT INTO erp_stock_moves (id, company_id, group_id, move_type, product_id, location_id, lot, serial, expiry, on_hand_delta, reserved_delta, unit_cost_cents, value_delta_cents, source_type, source_id, reference, reason, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, this.a.companyId, this.groupId, type, k.productId, k.locationId, k.lot ?? '', k.serial ?? '', o.expiry ?? null, o.onHand, o.reserved, o.unitCost, o.value, m.source, m.sourceId ?? null, (m.reference ?? '').slice(0, 200), (m.reason ?? '').slice(0, 500), this.a.userId, this.t);
  }

  private valuationStmt(productId: string, qty: number, moveId: string) {
    return this.db
      .prepare(
        `INSERT INTO erp_valuation (company_id, product_id, qty, value_cents, updated_at)
         VALUES (?1, ?2, ?3, (SELECT value_delta_cents FROM erp_stock_moves WHERE company_id = ?1 AND id = ?4), ?5)
         ON CONFLICT(company_id, product_id) DO UPDATE SET qty = round(erp_valuation.qty + excluded.qty, 6), value_cents = erp_valuation.value_cents + excluded.value_cents, updated_at = excluded.updated_at`,
      )
      .bind(this.a.companyId, productId, qty, moveId, this.t);
  }

  /** The cost of a unit coming in without a price: the average held, else the last price paid, else the standard cost. */
  async currentCost(productId: string): Promise<number> {
    const r = await this.db
      .prepare(
        `SELECT (SELECT CASE WHEN v.qty > 1e-9 THEN v.value_cents * 1.0 / v.qty END FROM erp_valuation v WHERE v.company_id = p.company_id AND v.product_id = p.id) AS avg,
                (SELECT m.unit_cost_cents FROM erp_stock_moves m WHERE m.company_id = p.company_id AND m.product_id = p.id AND m.on_hand_delta > 0 AND m.unit_cost_cents IS NOT NULL ORDER BY m.created_at DESC, m.rowid DESC LIMIT 1) AS last,
                p.standard_cost_cents AS standard
           FROM erp_products p WHERE p.company_id = ? AND p.id = ?`,
      )
      .bind(this.a.companyId, productId)
      .first<{ avg: number | null; last: number | null; standard: number | null }>();
    return Number(r?.avg ?? r?.last ?? r?.standard ?? 0);
  }

  private async openLayers(productId: string) {
    let l = this.layers.get(productId);
    if (!l) {
      const rows = await this.db
        .prepare('SELECT id, qty_remaining, unit_cost_cents FROM erp_cost_layers WHERE company_id = ? AND product_id = ? AND qty_remaining > 1e-9 ORDER BY received_at, seq, rowid')
        .bind(this.a.companyId, productId)
        .all<{ id: string; qty_remaining: number; unit_cost_cents: number }>();
      l = rows.results.map((r) => ({ id: r.id, qty: r.qty_remaining, cost: r.unit_cost_cents }));
      this.layers.set(productId, l);
    }
    return l;
  }

  /** Stock coming in (a receipt, a return from a customer, an adjustment or count variance up). */
  async addIn(type: InType, k: StockKey, qty: number, m: MoveInfo & { unitCost?: number | null; expiry?: string | null }) {
    if (!(qty > 0)) throw new HttpError(400, 'Use a quantity above zero');
    const cost = m.unitCost ?? (await this.currentCost(k.productId));
    const value = Math.round(qty * cost);
    const moveId = newId();
    this.stmts.push(...this.stockStmts(k, qty, 0, m.expiry ?? null));
    this.stmts.push(this.moveStmt(moveId, type, k, m, { onHand: qty, reserved: 0, expiry: m.expiry ?? null, unitCost: cost, value }));
    this.stmts.push(this.valuationStmt(k.productId, qty, moveId));
    if (this.method === 'fifo') {
      const layerId = newId();
      this.stmts.push(
        this.db
          .prepare('INSERT INTO erp_cost_layers (id, company_id, product_id, received_at, seq, qty_in, qty_remaining, unit_cost_cents, source_move_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
          .bind(layerId, this.a.companyId, k.productId, this.t, this.seq++, qty, qty, cost, moveId),
      );
      (await this.openLayers(k.productId)).push({ id: layerId, qty, cost });
    }
    if (value) this.valueChanged = true;
    this.kinds.add(type);
    return { moveId, value, unitCost: cost };
  }

  /** Stock going out (an issue, a return to a supplier, an adjustment or count variance down, scrap). */
  async takeOut(type: OutType, k: StockKey, qty: number, m: MoveInfo & { fromReserved?: boolean }) {
    if (!(qty > 0)) throw new HttpError(400, 'Use a quantity above zero');
    const moveId = newId();
    const reserved = m.fromReserved ? -qty : 0;
    this.stmts.push(...this.stockStmts(k, -qty, reserved, null));
    if (this.method === 'fifo') {
      const layers = await this.openLayers(k.productId);
      let left = qty;
      let value = 0;
      let lastCost: number | null = null;
      for (const layer of layers) {
        if (left <= EPS) break;
        if (layer.qty <= EPS) continue;
        const take = Math.min(layer.qty, left);
        layer.qty = q6(layer.qty - take);
        left = q6(left - take);
        value += take * layer.cost;
        lastCost = layer.cost;
        // guarded: a concurrent issue that took this layer first makes qty_remaining fall below zero, and the CHECK
        // fails this whole transaction
        this.stmts.push(this.db.prepare('UPDATE erp_cost_layers SET qty_remaining = round(qty_remaining - ?, 6) WHERE company_id = ? AND id = ?').bind(take, this.a.companyId, layer.id));
      }
      if (left > EPS) {
        // Only when negative stock is allowed (the stock CHECK refuses it otherwise): valued at the last known cost.
        const cost = lastCost ?? (await this.currentCost(k.productId));
        value += left * cost;
      }
      const cents = -Math.round(value);
      this.stmts.push(this.moveStmt(moveId, type, k, m, { onHand: -qty, reserved, unitCost: qty ? Math.abs(cents) / qty : null, value: cents }));
      if (cents) this.valueChanged = true;
    } else {
      // Weighted average, valued inside the transaction at the value and quantity held at that moment.
      const fallback = await this.currentCost(k.productId);
      const avg = `(SELECT CASE WHEN v.qty > 1e-9 THEN v.value_cents * 1.0 / v.qty END FROM erp_valuation v WHERE v.company_id = ?2 AND v.product_id = ?3)`;
      const val = `(SELECT CASE WHEN v.qty > 1e-9 AND abs(v.qty - ?4) < 1e-9 THEN v.value_cents WHEN v.qty > 1e-9 THEN CAST(round(?4 * v.value_cents * 1.0 / v.qty) AS INTEGER) END FROM erp_valuation v WHERE v.company_id = ?2 AND v.product_id = ?3)`;
      this.stmts.push(
        this.db
          .prepare(
            `INSERT INTO erp_stock_moves (id, company_id, group_id, move_type, product_id, location_id, lot, serial, expiry, on_hand_delta, reserved_delta, unit_cost_cents, value_delta_cents, source_type, source_id, reference, reason, created_by, created_at)
             VALUES (?1, ?2, ?5, ?6, ?3, ?7, ?8, ?9, NULL, -?4, ?10, COALESCE(${avg}, ?11), -COALESCE(${val}, CAST(round(?4 * ?11) AS INTEGER)), ?12, ?13, ?14, ?15, ?16, ?17)`,
          )
          .bind(moveId, this.a.companyId, k.productId, qty, this.groupId, type, k.locationId, k.lot ?? '', k.serial ?? '', reserved, fallback, m.source, m.sourceId ?? null, (m.reference ?? '').slice(0, 200), (m.reason ?? '').slice(0, 500), this.a.userId, this.t),
      );
      this.valueChanged = true;
    }
    this.stmts.push(this.valuationStmt(k.productId, -qty, moveId));
    this.kinds.add(type);
    return { moveId };
  }

  /** Moves stock between locations: a transfer, into quarantine or out of it. No change in value. */
  relocate(kind: 'transfer' | 'quarantine' | 'release', from: StockKey, toLocationId: string, qty: number, expiry: string | null, m: MoveInfo) {
    if (!(qty > 0)) throw new HttpError(400, 'Use a quantity above zero');
    if (from.locationId === toLocationId) throw new HttpError(400, 'Choose a different location to move it to');
    const to = { ...from, locationId: toLocationId };
    // out first, so a serial number is never in two places at once
    this.stmts.push(...this.stockStmts(from, -qty, 0, null));
    this.stmts.push(this.moveStmt(newId(), `${kind}_out`, from, m, { onHand: -qty, reserved: 0, expiry, unitCost: null, value: 0 }));
    this.stmts.push(...this.stockStmts(to, qty, 0, expiry));
    this.stmts.push(this.moveStmt(newId(), `${kind}_in`, to, m, { onHand: qty, reserved: 0, expiry, unitCost: null, value: 0 }));
    this.kinds.add(kind);
  }

  /** Reserves stock (positive) or releases a reservation (negative): available goes down or up, on hand does not. */
  reserve(k: StockKey, qty: number, m: MoveInfo) {
    if (!qty) throw new HttpError(400, 'Use a quantity above zero');
    this.stmts.push(...this.stockStmts(k, 0, qty, null));
    this.stmts.push(this.moveStmt(newId(), qty > 0 ? 'reserve' : 'unreserve', k, m, { onHand: 0, reserved: qty, unitCost: null, value: 0 }));
    this.kinds.add('reserve');
  }

  /** The closing statements: the costing method locked, and the Finance posting recorded as planned (Release 3). */
  finish(source: { type: string; id: string }): D1PreparedStatement[] {
    const out = [
      this.db
        .prepare(
          `INSERT INTO erp_settings (company_id, costing_method, costing_locked_at, updated_at) VALUES (?1, 'weighted_average', ?2, ?2)
           ON CONFLICT(company_id) DO UPDATE SET costing_method = COALESCE(erp_settings.costing_method, 'weighted_average'), costing_locked_at = COALESCE(erp_settings.costing_locked_at, ?2)`,
        )
        .bind(this.a.companyId, this.t),
    ];
    if (this.valueChanged) {
      out.push(
        this.db
          .prepare(
            `INSERT INTO erp_integration_events (id, company_id, kind, source_type, source_id, target, idempotency_key, status, attempts, last_error, amount_cents, created_by, created_at, updated_at)
             SELECT ?1, ?2, 'finance.inventory_posting', ?3, ?4, 'finance', ?5, 'planned', 0, 'Planned: Finance posting (Release 3)',
                    (SELECT COALESCE(SUM(value_delta_cents), 0) FROM erp_stock_moves WHERE company_id = ?2 AND group_id = ?6), ?7, ?8, ?8
              WHERE EXISTS (SELECT 1 FROM erp_stock_moves WHERE company_id = ?2 AND group_id = ?6 AND value_delta_cents <> 0)`,
          )
          .bind(newId(), this.a.companyId, source.type, source.id, `inv:${this.a.companyId}:${this.groupId}`, this.groupId, this.a.userId, this.t),
      );
    }
    return out;
  }

  /** Everything, in order: the operation's own statements first, then the stock statements, then the closing ones. */
  all(before: D1PreparedStatement[], after: D1PreparedStatement[], source: { type: string; id: string }) {
    return [...before, ...this.stmts, ...this.finish(source), ...after];
  }
}

/** A once-only guard: a second transaction writing the same key fails whole. */
export function onceStmt(db: D1Database, companyId: string, key: string, t = now()) {
  return db.prepare('INSERT INTO erp_done (company_id, key, created_at) VALUES (?, ?, ?)').bind(companyId, key.slice(0, 200), t);
}

// ------------------------------------------------------------------ reading stock

/** Available (on hand less reserved) per product, outside quarantine, for the given products (all when empty). */
export async function availableByProduct(db: D1Database, companyId: string, productIds?: string[]): Promise<Map<string, { onHand: number; reserved: number; available: number; quarantine: number }>> {
  const ids = productIds ? [...new Set(productIds)].slice(0, 2000) : null;
  const map = new Map<string, { onHand: number; reserved: number; available: number; quarantine: number }>();
  if (ids && !ids.length) return map;
  const chunks: (string[] | null)[] = ids ? Array.from({ length: Math.ceil(ids.length / 90) }, (_, i) => ids.slice(i * 90, i * 90 + 90)) : [null];
  for (const chunk of chunks) {
    const rows = await db
      .prepare(
        `SELECT s.product_id, SUM(CASE WHEN l.kind <> 'quarantine' THEN s.on_hand ELSE 0 END) AS on_hand,
                SUM(CASE WHEN l.kind <> 'quarantine' THEN s.reserved ELSE 0 END) AS reserved,
                SUM(CASE WHEN l.kind = 'quarantine' THEN s.on_hand ELSE 0 END) AS quarantine
           FROM erp_stock s JOIN erp_locations l ON l.company_id = s.company_id AND l.id = s.location_id
          WHERE s.company_id = ? ${chunk ? `AND s.product_id IN (${chunk.map(() => '?').join(',')})` : ''}
          GROUP BY s.product_id`,
      )
      .bind(companyId, ...(chunk ?? []))
      .all<{ product_id: string; on_hand: number; reserved: number; quarantine: number }>();
    for (const r of rows.results) {
      const onHand = q6(Number(r.on_hand ?? 0));
      const reserved = q6(Number(r.reserved ?? 0));
      map.set(r.product_id, { onHand, reserved, available: q6(onHand - reserved), quarantine: q6(Number(r.quarantine ?? 0)) });
    }
  }
  return map;
}

/** Quantity on order per product: open purchase orders (approved, sent, partly received), less what was accepted. */
export async function onOrderByProduct(db: D1Database, companyId: string): Promise<Map<string, number>> {
  const rows = await db
    .prepare(
      `SELECT l.product_id, SUM(l.quantity - l.received_qty) AS q FROM erp_po_lines l
         JOIN erp_purchase_orders o ON o.company_id = l.company_id AND o.id = l.po_id
        WHERE l.company_id = ? AND l.product_id IS NOT NULL AND o.status IN ('approved','sent','partially_received') GROUP BY l.product_id`,
    )
    .bind(companyId)
    .all<{ product_id: string; q: number }>();
  return new Map(rows.results.map((r) => [r.product_id, Math.max(0, q6(Number(r.q)))]));
}
