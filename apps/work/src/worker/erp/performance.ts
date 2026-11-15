// Supplier performance, measured from goods receipts (Release 2): used by the supplier page and the supplier delivery
// performance report.

import { q6 } from './stock';

export interface Performance {
  supplierId: string;
  orders: number;
  receipts: number;
  onTimeRate: number | null;
  onTimeMeasured: number;
  inFullRate: number | null;
  inFullMeasured: number;
  avgLeadTimeDays: number | null;
  rejectedQty: number;
  receivedQty: number;
}

/**
 * Measured from goods receipts:
 *   on time    receipts dated on or before the order's required date, of the receipts of orders that have one
 *   in full    orders whose first receipt accepted every line's full quantity with nothing damaged or rejected
 *   lead time  days from the order date to its first receipt, averaged over orders
 */
export async function supplierPerformance(db: D1Database, companyId: string, supplierId?: string, range?: { from?: string; to?: string }): Promise<Performance[]> {
  const where = ['r.company_id = ?'];
  const args: unknown[] = [companyId];
  if (supplierId) {
    where.push('r.supplier_id = ?');
    args.push(supplierId);
  }
  if (range?.from) {
    where.push('r.received_date >= ?');
    args.push(range.from);
  }
  if (range?.to) {
    where.push('r.received_date <= ?');
    args.push(range.to);
  }
  const rows = await db
    .prepare(
      `SELECT r.id, r.supplier_id, r.po_id, r.received_date, r.on_time, r.created_at, o.order_date,
              (SELECT COALESCE(SUM(x.received_qty), 0) FROM erp_receipt_lines x WHERE x.company_id = r.company_id AND x.receipt_id = r.id) AS received,
              (SELECT COALESCE(SUM(x.damaged_qty + x.rejected_qty), 0) FROM erp_receipt_lines x WHERE x.company_id = r.company_id AND x.receipt_id = r.id) AS refused,
              (SELECT COUNT(*) FROM erp_po_lines pl WHERE pl.company_id = r.company_id AND pl.po_id = r.po_id AND NOT EXISTS (
                 SELECT 1 FROM erp_receipt_lines x WHERE x.company_id = r.company_id AND x.receipt_id = r.id AND x.po_line_id = pl.id AND x.accepted_qty >= pl.quantity - 1e-9 AND x.damaged_qty = 0 AND x.rejected_qty = 0)) AS short_lines
         FROM erp_receipts r JOIN erp_purchase_orders o ON o.company_id = r.company_id AND o.id = r.po_id
        WHERE ${where.join(' AND ')} ORDER BY r.created_at, r.rowid`,
    )
    .bind(...args)
    .all<any>();
  const by = new Map<string, { receipts: number; onTime: number; measured: number; firsts: Map<string, any>; rejected: number; received: number }>();
  for (const r of rows.results) {
    let s = by.get(r.supplier_id);
    if (!s) by.set(r.supplier_id, (s = { receipts: 0, onTime: 0, measured: 0, firsts: new Map(), rejected: 0, received: 0 }));
    s.receipts++;
    if (r.on_time !== null) {
      s.measured++;
      if (r.on_time) s.onTime++;
    }
    s.rejected += Number(r.refused);
    s.received += Number(r.received);
    if (!s.firsts.has(r.po_id)) s.firsts.set(r.po_id, r);
  }
  const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
  return [...by.entries()].map(([id, s]) => {
    const firsts = [...s.firsts.values()];
    const inFull = firsts.filter((f) => Number(f.short_lines) === 0).length;
    const leads = firsts.map((f) => days(f.order_date, f.received_date)).filter((d) => Number.isFinite(d) && d >= 0);
    return {
      supplierId: id,
      orders: firsts.length,
      receipts: s.receipts,
      onTimeRate: s.measured ? s.onTime / s.measured : null,
      onTimeMeasured: s.measured,
      inFullRate: firsts.length ? inFull / firsts.length : null,
      inFullMeasured: firsts.length,
      avgLeadTimeDays: leads.length ? Math.round((leads.reduce((x, y) => x + y, 0) / leads.length) * 10) / 10 : null,
      rejectedQty: q6(s.rejected),
      receivedQty: q6(s.received),
    };
  });
}

export const PERFORMANCE_HELP = 'Measured from goods receipts. On time: received on or before the order’s required date. In full: the first receipt of an order accepted every line in full, nothing damaged or rejected. Lead time: days from the order date to its first receipt.';
