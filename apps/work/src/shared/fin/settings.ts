// Workspace settings kept in fin_orgs.settings_json, always read through finSettings(), which fills in what is missing
// and drops what is malformed.

import type { WorkspaceKind } from './roles';

export type DocKind = 'invoice' | 'bill' | 'purchase_order' | 'expense_claim';
export const DOC_KINDS: DocKind[] = ['invoice', 'bill', 'purchase_order', 'expense_claim'];
export const DOC_LABELS: Record<DocKind, { one: string; many: string; path: string }> = {
  invoice: { one: 'Invoice', many: 'Invoices', path: 'invoices' },
  bill: { one: 'Bill', many: 'Bills', path: 'bills' },
  purchase_order: { one: 'Purchase order', many: 'Purchase orders', path: 'purchase-orders' },
  expense_claim: { one: 'Expense claim', many: 'Expense claims', path: 'expense-claims' },
};

export interface FinSettings {
  /** Number prefix per document kind ("INV-" gives INV-0001). */
  prefixes: Record<DocKind, string>;
  /** Days until an invoice or bill is due when no other terms apply. */
  termsDays: number;
  /** Records a contributor creates wait for approval before they are posted. */
  approvals: { transactions: boolean; bills: boolean; expenseClaims: boolean; invoices: boolean };
  alerts: {
    /** Remind this many days before an invoice is due (0: off). */
    invoiceDueDays: number;
    overdueInvoices: boolean;
    billDueDays: number;
    overdueBills: boolean;
    budgets: boolean;
    monthlySummary: boolean;
  };
  /** Possible duplicates: the same amount on the same account within this many days. */
  duplicateDays: number;
}

export function defaultSettings(kind: WorkspaceKind): FinSettings {
  const business = kind === 'business';
  return {
    prefixes: { invoice: 'INV-', bill: 'BILL-', purchase_order: 'PO-', expense_claim: 'EXP-' },
    termsDays: 14,
    approvals: { transactions: business, bills: business, expenseClaims: business, invoices: false },
    alerts: { invoiceDueDays: business ? 3 : 0, overdueInvoices: business, billDueDays: 3, overdueBills: true, budgets: true, monthlySummary: true },
    duplicateDays: 3,
  };
}

const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d);
const int = (v: unknown, d: number, min: number, max: number) => (typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : d);
const prefix = (v: unknown, d: string) => (typeof v === 'string' && /^[A-Za-z0-9 _/-]{0,12}$/.test(v) ? v : d);

export function finSettings(raw: unknown, kind: WorkspaceKind): FinSettings {
  const d = defaultSettings(kind);
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const p = r.prefixes ?? {};
  const ap = r.approvals ?? {};
  const al = r.alerts ?? {};
  return {
    prefixes: { invoice: prefix(p.invoice, d.prefixes.invoice), bill: prefix(p.bill, d.prefixes.bill), purchase_order: prefix(p.purchase_order, d.prefixes.purchase_order), expense_claim: prefix(p.expense_claim, d.prefixes.expense_claim) },
    termsDays: int(r.termsDays, d.termsDays, 0, 365),
    approvals: { transactions: bool(ap.transactions, d.approvals.transactions), bills: bool(ap.bills, d.approvals.bills), expenseClaims: bool(ap.expenseClaims, d.approvals.expenseClaims), invoices: bool(ap.invoices, d.approvals.invoices) },
    alerts: {
      invoiceDueDays: int(al.invoiceDueDays, d.alerts.invoiceDueDays, 0, 60),
      overdueInvoices: bool(al.overdueInvoices, d.alerts.overdueInvoices),
      billDueDays: int(al.billDueDays, d.alerts.billDueDays, 0, 60),
      overdueBills: bool(al.overdueBills, d.alerts.overdueBills),
      budgets: bool(al.budgets, d.alerts.budgets),
      monthlySummary: bool(al.monthlySummary, d.alerts.monthlySummary),
    },
    duplicateDays: int(r.duplicateDays, d.duplicateDays, 0, 30),
  };
}
