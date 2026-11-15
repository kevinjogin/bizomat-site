// BIZOMAT ERP, Release 2: the company's purchasing and inventory settings (erp_settings), set by an ERP administrator.
//
//   purchase order approval limit   a buyer's order at or below it is approved when submitted; above it a procurement
//                                   manager approves. Not set: every order needs a procurement manager.
//   adjustment approval threshold   a stock adjustment worth more than it waits for a warehouse manager. Not set: every
//                                   adjustment does.
//   allow negative stock            off by default: stock never goes below zero (the database refuses it).
//   costing method                  weighted average or FIFO, chosen before the first stock movement and then locked. If
//                                   none is chosen, the first movement locks weighted average (the default).
//
//   GET /c/:company/erp-settings, PUT /c/:company/erp-settings

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, now } from '../lib/util';
import { requireErp } from './access';
import { changed, eventStmt, zCurrency } from './util';

export const settingsRoutes = new Hono<AppEnv>();

export type CostingMethod = 'weighted_average' | 'fifo';
export const COSTING_LABELS: Record<CostingMethod, string> = { weighted_average: 'Weighted average', fifo: 'First in, first out (FIFO)' };

export interface ErpSettings {
  poApprovalLimitCents: number | null;
  adjustmentApprovalCents: number | null;
  allowNegativeStock: boolean;
  costingMethod: CostingMethod | null;
  costingLockedAt: number | null;
  currency: string;
}

export async function loadSettings(db: D1Database, companyId: string): Promise<ErpSettings> {
  const r = await db.prepare('SELECT * FROM erp_settings WHERE company_id = ?').bind(companyId).first<any>();
  return {
    poApprovalLimitCents: r?.po_approval_limit_cents ?? null,
    adjustmentApprovalCents: r?.adjustment_approval_cents ?? null,
    allowNegativeStock: !!r?.allow_negative_stock,
    costingMethod: (r?.costing_method as CostingMethod | null) ?? null,
    costingLockedAt: r?.costing_locked_at ?? null,
    currency: r?.currency ?? 'AUD',
  };
}

export function settingsDTO(s: ErpSettings, moves: boolean) {
  return {
    ...s,
    costingLocked: !!s.costingLockedAt || moves,
    costingLabel: s.costingMethod ? COSTING_LABELS[s.costingMethod] : 'Not chosen yet (weighted average is used at the first stock movement)',
  };
}

settingsRoutes.get('/c/:company/erp-settings', async (c) => {
  const a = await requireErp(c, 'products.view');
  const db = c.env.DB;
  const s = await loadSettings(db, a.companyId);
  const moves = !!(await db.prepare('SELECT 1 FROM erp_stock_moves WHERE company_id = ? LIMIT 1').bind(a.companyId).first());
  return c.json({ settings: settingsDTO(s, moves), methods: Object.entries(COSTING_LABELS).map(([value, label]) => ({ value, label })) });
});

settingsRoutes.put('/c/:company/erp-settings', async (c) => {
  const a = await requireErp(c, 'settings.manage');
  const db = c.env.DB;
  const input = await body(
    c,
    z.object({
      poApprovalLimitCents: z.number().int().min(0).max(1e13).nullable().optional(),
      adjustmentApprovalCents: z.number().int().min(0).max(1e13).nullable().optional(),
      allowNegativeStock: z.boolean().optional(),
      costingMethod: z.enum(['weighted_average', 'fifo']).optional(),
      currency: zCurrency.optional(),
    }),
  );
  const before = await loadSettings(db, a.companyId);
  const moves = !!(await db.prepare('SELECT 1 FROM erp_stock_moves WHERE company_id = ? LIMIT 1').bind(a.companyId).first());
  if (input.costingMethod && input.costingMethod !== before.costingMethod && (before.costingLockedAt || moves)) {
    throw new HttpError(409, 'The costing method is locked: it was fixed by the first stock movement and cannot change');
  }
  if (input.currency && input.currency !== before.currency && moves) throw new HttpError(409, 'The stock currency cannot change once stock has moved');
  const after: ErpSettings = {
    poApprovalLimitCents: input.poApprovalLimitCents !== undefined ? input.poApprovalLimitCents : before.poApprovalLimitCents,
    adjustmentApprovalCents: input.adjustmentApprovalCents !== undefined ? input.adjustmentApprovalCents : before.adjustmentApprovalCents,
    allowNegativeStock: input.allowNegativeStock ?? before.allowNegativeStock,
    costingMethod: input.costingMethod ?? before.costingMethod,
    costingLockedAt: before.costingLockedAt,
    currency: input.currency ?? before.currency,
  };
  const diff = changed(before as unknown as Record<string, unknown>, after as unknown as Record<string, unknown>);
  if (!diff.any) return c.json({ settings: settingsDTO(after, moves) });
  const t = now();
  const stmts: D1PreparedStatement[] = [
    db
      .prepare(
        `INSERT INTO erp_settings (company_id, po_approval_limit_cents, adjustment_approval_cents, allow_negative_stock, costing_method, currency, updated_by, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
         ON CONFLICT(company_id) DO UPDATE SET po_approval_limit_cents = ?2, adjustment_approval_cents = ?3, allow_negative_stock = ?4,
           costing_method = CASE WHEN erp_settings.costing_locked_at IS NULL THEN ?5 ELSE erp_settings.costing_method END, currency = ?6, updated_by = ?7, updated_at = ?8`,
      )
      .bind(a.companyId, after.poApprovalLimitCents, after.adjustmentApprovalCents, after.allowNegativeStock ? 1 : 0, after.costingMethod, after.currency, a.userId, t),
    // Every stock row carries the setting, so its CHECK refuses stock below zero while the setting is off. Turning it off
    // while some stock is below zero fails here and changes nothing.
    db.prepare('UPDATE erp_stock SET neg_ok = ? WHERE company_id = ?').bind(after.allowNegativeStock ? 1 : 0, a.companyId),
    eventStmt(db, { companyId: a.companyId, actorId: a.userId, action: 'settings.changed', entityType: 'settings', entityId: a.companyId, summary: 'Purchasing and inventory settings changed', before: diff.before, after: diff.after, at: t }),
  ];
  try {
    await db.batch(stmts);
  } catch (e) {
    if (/CHECK constraint failed/i.test(String((e as Error)?.message ?? e))) throw new HttpError(409, 'Some stock is below zero: correct it before turning negative stock off');
    throw e;
  }
  return c.json({ settings: settingsDTO(await loadSettings(db, a.companyId), moves) });
});
