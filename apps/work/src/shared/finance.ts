// Finance summaries for a project: totals per financial column and per finance role, by group and for the board,
// always per currency and always in integer arithmetic (./money.ts). Used by the board's Finance panel, the API and
// project reports, so the same figures appear everywhere.

import { FINANCE_ROLE_LABELS, type FinanceRole } from './columns';
import { formatScaled, MoneyTotals, percent, scaledToDecimal, toScaled, currencyInfo } from './money';
import { isFinancialColumn } from './permissions';

export interface FinanceColumnLike {
  id: string;
  title: string;
  type: string;
  settings: Record<string, any>;
}

export interface FinanceItemLike {
  id: string;
  name: string;
  groupId: string;
  parentItemId: string | null;
  values: Record<string, unknown>;
}

export type CurrencySource = 'column' | 'project' | 'organisation' | 'unset';

/** The currency a column's amounts are in: its own fixed code, else the project's, else the organisation's. */
export function resolveColumnCurrency(settings: Record<string, any> | null | undefined, boardCurrency: string | null, workspaceCurrency: string | null): { currency: string | null; source: CurrencySource } {
  const s = settings ?? {};
  if (s.currencyMode !== 'inherit' && typeof s.currency === 'string' && /^[A-Z]{3}$/.test(s.currency)) return { currency: s.currency, source: 'column' };
  if (boardCurrency) return { currency: boardCurrency, source: 'project' };
  if (workspaceCurrency) return { currency: workspaceCurrency, source: 'organisation' };
  return { currency: null, source: 'unset' };
}

export interface MoneyFigure {
  currency: string | null;
  /** Decimal string at the currency's minor unit (two places when no currency is set). */
  amount: string;
  display: string;
}

export function figure(scaled: bigint, currency: string | null): MoneyFigure {
  const digits = currencyInfo(currency)?.minor ?? 2;
  return { currency, amount: scaledToDecimal(scaled, digits), display: formatScaled(scaled, currency) };
}

export interface ColumnTotal {
  columnId: string;
  title: string;
  role: FinanceRole | null;
  roleLabel: string | null;
  currency: string | null;
  currencySource: CurrencySource;
  /** False for an existing column whose currency nobody has confirmed (it kept the code it was created with). */
  currencyConfirmed: boolean;
  total: MoneyFigure;
  /** Tasks with an amount in this column (top-level tasks only). */
  count: number;
}

export interface RoleSummary {
  currency: string | null;
  approvedBudget: MoneyFigure | null;
  estimatedCost: MoneyFigure | null;
  actualCost: MoneyFigure | null;
  committed: MoneyFigure | null;
  /** Approved budget - actual cost - committed expenditure. */
  remaining: MoneyFigure | null;
  /** Approved budget - actual cost (positive: under budget). */
  variance: MoneyFigure | null;
  /** Approved budget - estimated cost (positive: the estimate is within budget). */
  forecastVariance: MoneyFigure | null;
  /** (actual + committed) / approved, percent with one decimal. */
  utilisation: string | null;
}

export interface FinanceSummary {
  columns: ColumnTotal[];
  byRole: RoleSummary[];
  groups: { groupId: string; name: string; totals: { columnId: string; total: MoneyFigure; count: number }[] }[];
  tasks: { itemId: string; name: string; groupId: string; amounts: { columnId: string; amount: MoneyFigure }[] }[];
  currencies: (string | null)[];
  /** True when columns are in more than one currency: totals are then shown side by side, never added. */
  mixedCurrencies: boolean;
  /** Financial columns without a currency (none chosen for the organisation or project). */
  unsetCurrencyColumns: number;
}

/**
 * Sum top-level tasks only: a parent's amount is taken as its total, so subitems are never counted twice.
 */
export function summariseFinance(
  columns: FinanceColumnLike[],
  items: FinanceItemLike[],
  groups: { id: string; name: string }[],
  ctx: { boardCurrency: string | null; workspaceCurrency: string | null },
): FinanceSummary {
  const fin = columns.filter(isFinancialColumn);
  const top = items.filter((i) => !i.parentItemId);
  const colTotals: ColumnTotal[] = [];
  const roleTotals = new Map<string, { approved?: bigint; estimated?: bigint; actual?: bigint; committed?: bigint }>();
  const currencyOf = new Map<string, string | null>();
  for (const c of fin) {
    const { currency, source } = resolveColumnCurrency(c.settings, ctx.boardCurrency, ctx.workspaceCurrency);
    currencyOf.set(c.id, currency);
    let total = 0n;
    let count = 0;
    for (const it of top) {
      const s = toScaled(it.values[c.id]);
      if (s == null) continue;
      total += s;
      count++;
    }
    const role = (c.settings?.financeRole as FinanceRole | undefined) ?? null;
    colTotals.push({
      columnId: c.id,
      title: c.title,
      role,
      roleLabel: role ? FINANCE_ROLE_LABELS[role] : null,
      currency,
      currencySource: source,
      // An organisation or project currency was chosen by an administrator; a column's own code counts only once
      // someone confirmed it (columns made before finance settings carry the code they were created with).
      currencyConfirmed: source === 'column' ? c.settings?.currencyConfirmed === true : source !== 'unset',
      total: figure(total, currency),
      count,
    });
    if (role && role !== 'other') {
      const key = currency ?? '';
      const r = roleTotals.get(key) ?? {};
      const field = role === 'approved_budget' ? 'approved' : role === 'estimated_cost' ? 'estimated' : role === 'actual_cost' ? 'actual' : 'committed';
      r[field] = (r[field] ?? 0n) + total;
      roleTotals.set(key, r);
    }
  }
  const byRole: RoleSummary[] = Array.from(roleTotals.entries()).map(([key, r]) => {
    const cur = key || null;
    const f = (v: bigint | undefined) => (v === undefined ? null : figure(v, cur));
    const remaining = r.approved !== undefined ? r.approved - (r.actual ?? 0n) - (r.committed ?? 0n) : undefined;
    const variance = r.approved !== undefined && r.actual !== undefined ? r.approved - r.actual : undefined;
    const forecast = r.approved !== undefined && r.estimated !== undefined ? r.approved - r.estimated : undefined;
    const utilisation = r.approved !== undefined && (r.actual !== undefined || r.committed !== undefined) ? percent((r.actual ?? 0n) + (r.committed ?? 0n), r.approved) : null;
    return {
      currency: cur,
      approvedBudget: f(r.approved),
      estimatedCost: f(r.estimated),
      actualCost: f(r.actual),
      committed: f(r.committed),
      remaining: f(remaining),
      variance: f(variance),
      forecastVariance: f(forecast),
      utilisation,
    };
  });
  const groupOut = groups.map((g) => {
    const its = top.filter((i) => i.groupId === g.id);
    return {
      groupId: g.id,
      name: g.name,
      totals: fin.map((c) => {
        const t = new MoneyTotals();
        let count = 0;
        for (const it of its) {
          if (toScaled(it.values[c.id]) == null) continue;
          t.add(currencyOf.get(c.id), it.values[c.id]);
          count++;
        }
        return { columnId: c.id, total: figure(t.get(currencyOf.get(c.id)), currencyOf.get(c.id) ?? null), count };
      }),
    };
  });
  const tasks = top
    .map((it) => ({
      itemId: it.id,
      name: it.name,
      groupId: it.groupId,
      amounts: fin.flatMap((c) => {
        const s = toScaled(it.values[c.id]);
        return s == null ? [] : [{ columnId: c.id, amount: figure(s, currencyOf.get(c.id) ?? null) }];
      }),
    }))
    .filter((t) => t.amounts.length);
  const currencies = Array.from(new Set(colTotals.map((c) => c.currency)));
  return {
    columns: colTotals,
    byRole,
    groups: groupOut,
    tasks,
    currencies,
    mixedCurrencies: currencies.filter(Boolean).length > 1,
    unsetCurrencyColumns: colTotals.filter((c) => !c.currency).length,
  };
}
