// The chart of accounts: account types and subtypes, which of them are money accounts (bank, cash, credit cards and
// loans: the accounts transactions are recorded on), how each counts in the cash flow statement, and the charts a new
// workspace starts with. Every category is an account, so the ledger underneath stays double-entry.

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export const ACCOUNT_TYPES: AccountType[] = ['asset', 'liability', 'equity', 'revenue', 'expense'];
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = { asset: 'Assets', liability: 'Liabilities', equity: 'Equity', revenue: 'Income', expense: 'Expenses' };

export type CashflowClass = 'cash' | 'operating' | 'investing' | 'financing';

export interface SubtypeDef {
  type: AccountType;
  label: string;
  /** Transactions are recorded on it (bank, cash, credit card, loan). */
  money: boolean;
  cashflow: CashflowClass;
}

export const SUBTYPES: Record<string, SubtypeDef> = {
  bank: { type: 'asset', label: 'Bank account', money: true, cashflow: 'cash' },
  cash: { type: 'asset', label: 'Cash', money: true, cashflow: 'cash' },
  receivable: { type: 'asset', label: 'Accounts receivable', money: false, cashflow: 'operating' },
  current_asset: { type: 'asset', label: 'Current asset', money: false, cashflow: 'operating' },
  fixed_asset: { type: 'asset', label: 'Fixed asset', money: false, cashflow: 'investing' },
  investment: { type: 'asset', label: 'Investment', money: false, cashflow: 'investing' },
  credit_card: { type: 'liability', label: 'Credit card', money: true, cashflow: 'operating' },
  loan: { type: 'liability', label: 'Loan', money: true, cashflow: 'financing' },
  payable: { type: 'liability', label: 'Accounts payable', money: false, cashflow: 'operating' },
  tax: { type: 'liability', label: 'Tax (GST)', money: false, cashflow: 'operating' },
  current_liability: { type: 'liability', label: 'Current liability', money: false, cashflow: 'operating' },
  non_current_liability: { type: 'liability', label: 'Non-current liability', money: false, cashflow: 'financing' },
  equity: { type: 'equity', label: 'Equity', money: false, cashflow: 'financing' },
  retained_earnings: { type: 'equity', label: 'Retained earnings', money: false, cashflow: 'financing' },
  revenue: { type: 'revenue', label: 'Income', money: false, cashflow: 'operating' },
  other_income: { type: 'revenue', label: 'Other income', money: false, cashflow: 'operating' },
  direct_cost: { type: 'expense', label: 'Cost of goods sold', money: false, cashflow: 'operating' },
  expense: { type: 'expense', label: 'Operating expense', money: false, cashflow: 'operating' },
  other_expense: { type: 'expense', label: 'Other expense', money: false, cashflow: 'operating' },
};
export const SUBTYPE_KEYS = Object.keys(SUBTYPES);
export const MONEY_SUBTYPES = SUBTYPE_KEYS.filter((k) => SUBTYPES[k].money);
/** Cash for the cash flow statement and forecast: bank and cash accounts. */
export const CASH_SUBTYPES = ['bank', 'cash'];

/** Accounts the books need. They cannot be archived, and their type does not change. */
export type SystemKey = 'ar' | 'ap' | 'gst' | 'claims' | 'retained' | 'opening';
export const SYSTEM_KEYS: SystemKey[] = ['ar', 'ap', 'gst', 'claims', 'retained', 'opening'];

export interface ChartAccount {
  code: string;
  name: string;
  subtype: string;
  /** The code of the parent category. */
  parent?: string;
  /** Default tax code (DEFAULT_TAX_CODES key), business workspaces. */
  tax?: string;
  system?: SystemKey;
  isDefault?: boolean;
}

/** A business chart in the Australian style; codes and names can be changed. */
export const BUSINESS_CHART: ChartAccount[] = [
  { code: '090', name: 'Business bank account', subtype: 'bank', isDefault: true },
  { code: '091', name: 'Business savings account', subtype: 'bank' },
  { code: '095', name: 'Petty cash', subtype: 'cash' },
  { code: '610', name: 'Accounts receivable', subtype: 'receivable', system: 'ar' },
  { code: '620', name: 'Prepayments', subtype: 'current_asset' },
  { code: '630', name: 'Inventory', subtype: 'current_asset' },
  { code: '710', name: 'Office equipment', subtype: 'fixed_asset', tax: 'capital' },
  { code: '720', name: 'Computer equipment', subtype: 'fixed_asset', tax: 'capital' },
  { code: '730', name: 'Motor vehicles', subtype: 'fixed_asset', tax: 'capital' },
  { code: '790', name: 'Less accumulated depreciation', subtype: 'fixed_asset', tax: 'bas_excluded' },
  { code: '800', name: 'Accounts payable', subtype: 'payable', system: 'ap' },
  { code: '801', name: 'Expense claims payable', subtype: 'current_liability', system: 'claims' },
  { code: '804', name: 'Business credit card', subtype: 'credit_card' },
  { code: '820', name: 'GST', subtype: 'tax', system: 'gst' },
  { code: '825', name: 'PAYG withholding payable', subtype: 'current_liability', tax: 'bas_excluded' },
  { code: '826', name: 'Superannuation payable', subtype: 'current_liability', tax: 'bas_excluded' },
  { code: '830', name: 'Income tax payable', subtype: 'current_liability', tax: 'bas_excluded' },
  { code: '900', name: 'Business loan', subtype: 'loan', tax: 'bas_excluded' },
  { code: '960', name: 'Retained earnings', subtype: 'retained_earnings', system: 'retained' },
  { code: '970', name: 'Owner funds introduced', subtype: 'equity', tax: 'bas_excluded' },
  { code: '980', name: 'Owner drawings', subtype: 'equity', tax: 'bas_excluded' },
  { code: '990', name: 'Opening balances', subtype: 'equity', system: 'opening' },
  { code: '200', name: 'Sales', subtype: 'revenue', tax: 'gst_sales', isDefault: true },
  { code: '210', name: 'Services', subtype: 'revenue', tax: 'gst_sales' },
  { code: '260', name: 'Other revenue', subtype: 'revenue', tax: 'gst_sales' },
  { code: '270', name: 'Interest income', subtype: 'other_income', tax: 'input_sales' },
  { code: '310', name: 'Cost of goods sold', subtype: 'direct_cost', tax: 'gst_purchases' },
  { code: '320', name: 'Subcontractors', subtype: 'direct_cost', tax: 'gst_purchases' },
  { code: '400', name: 'Advertising and marketing', subtype: 'expense', tax: 'gst_purchases' },
  { code: '404', name: 'Bank fees', subtype: 'expense', tax: 'free_purchases' },
  { code: '408', name: 'Cleaning', subtype: 'expense', tax: 'gst_purchases' },
  { code: '412', name: 'Consulting and accounting', subtype: 'expense', tax: 'gst_purchases' },
  { code: '416', name: 'Depreciation', subtype: 'expense', tax: 'bas_excluded' },
  { code: '420', name: 'Entertainment', subtype: 'expense', tax: 'gst_purchases' },
  { code: '425', name: 'Freight and courier', subtype: 'expense', tax: 'gst_purchases' },
  { code: '429', name: 'General expenses', subtype: 'expense', tax: 'gst_purchases', isDefault: true },
  { code: '433', name: 'Insurance', subtype: 'expense', tax: 'gst_purchases' },
  { code: '437', name: 'Interest expense', subtype: 'expense', tax: 'input_purchases' },
  { code: '441', name: 'Legal expenses', subtype: 'expense', tax: 'gst_purchases' },
  { code: '445', name: 'Light, power and heating', subtype: 'expense', tax: 'gst_purchases' },
  { code: '449', name: 'Motor vehicle expenses', subtype: 'expense', tax: 'gst_purchases' },
  { code: '453', name: 'Office expenses', subtype: 'expense', tax: 'gst_purchases' },
  { code: '461', name: 'Printing and stationery', subtype: 'expense', tax: 'gst_purchases' },
  { code: '469', name: 'Rent', subtype: 'expense', tax: 'gst_purchases' },
  { code: '473', name: 'Repairs and maintenance', subtype: 'expense', tax: 'gst_purchases' },
  { code: '477', name: 'Wages and salaries', subtype: 'expense', tax: 'bas_excluded' },
  { code: '478', name: 'Superannuation', subtype: 'expense', tax: 'bas_excluded' },
  { code: '485', name: 'Subscriptions and software', subtype: 'expense', tax: 'gst_purchases' },
  { code: '489', name: 'Telephone and internet', subtype: 'expense', tax: 'gst_purchases' },
  { code: '493', name: 'Travel - national', subtype: 'expense', tax: 'gst_purchases' },
  { code: '494', name: 'Travel - international', subtype: 'expense', tax: 'free_purchases' },
  { code: '505', name: 'Income tax expense', subtype: 'other_expense', tax: 'bas_excluded' },
];

/** A personal or household chart: money accounts, assets and debts, and spending categories in groups. */
export const PERSONAL_CHART: ChartAccount[] = [
  { code: '1000', name: 'Everyday account', subtype: 'bank', isDefault: true },
  { code: '1010', name: 'Savings account', subtype: 'bank' },
  { code: '1020', name: 'Cash', subtype: 'cash' },
  { code: '1100', name: 'Home', subtype: 'fixed_asset' },
  { code: '1110', name: 'Vehicles', subtype: 'fixed_asset' },
  { code: '1120', name: 'Investments and shares', subtype: 'investment' },
  { code: '1130', name: 'Superannuation', subtype: 'investment' },
  { code: '2000', name: 'Credit card', subtype: 'credit_card' },
  { code: '2100', name: 'Home loan', subtype: 'loan' },
  { code: '2110', name: 'Car loan', subtype: 'loan' },
  { code: '2120', name: 'Personal loan', subtype: 'loan' },
  { code: '3000', name: 'Opening balances', subtype: 'equity', system: 'opening' },
  { code: '3100', name: 'Net worth carried forward', subtype: 'retained_earnings', system: 'retained' },
  { code: '4000', name: 'Salary and wages', subtype: 'revenue', isDefault: true },
  { code: '4010', name: 'Interest', subtype: 'other_income' },
  { code: '4020', name: 'Dividends', subtype: 'other_income' },
  { code: '4030', name: 'Government payments', subtype: 'revenue' },
  { code: '4040', name: 'Gifts received', subtype: 'other_income' },
  { code: '4090', name: 'Other income', subtype: 'other_income' },
  { code: '5000', name: 'Food', subtype: 'expense' },
  { code: '5001', name: 'Groceries', subtype: 'expense', parent: '5000' },
  { code: '5002', name: 'Eating out', subtype: 'expense', parent: '5000' },
  { code: '5100', name: 'Home', subtype: 'expense' },
  { code: '5101', name: 'Rent', subtype: 'expense', parent: '5100' },
  { code: '5102', name: 'Mortgage interest', subtype: 'expense', parent: '5100' },
  { code: '5103', name: 'Home maintenance', subtype: 'expense', parent: '5100' },
  { code: '5104', name: 'Council rates and strata', subtype: 'expense', parent: '5100' },
  { code: '5200', name: 'Bills and utilities', subtype: 'expense' },
  { code: '5201', name: 'Electricity and gas', subtype: 'expense', parent: '5200' },
  { code: '5202', name: 'Water', subtype: 'expense', parent: '5200' },
  { code: '5203', name: 'Phone and internet', subtype: 'expense', parent: '5200' },
  { code: '5300', name: 'Transport', subtype: 'expense' },
  { code: '5301', name: 'Fuel', subtype: 'expense', parent: '5300' },
  { code: '5302', name: 'Public transport', subtype: 'expense', parent: '5300' },
  { code: '5303', name: 'Registration and insurance', subtype: 'expense', parent: '5300' },
  { code: '5304', name: 'Car servicing', subtype: 'expense', parent: '5300' },
  { code: '5400', name: 'Health', subtype: 'expense' },
  { code: '5401', name: 'Medical and pharmacy', subtype: 'expense', parent: '5400' },
  { code: '5402', name: 'Health insurance', subtype: 'expense', parent: '5400' },
  { code: '5500', name: 'Family', subtype: 'expense' },
  { code: '5501', name: 'Childcare', subtype: 'expense', parent: '5500' },
  { code: '5502', name: 'Education', subtype: 'expense', parent: '5500' },
  { code: '5600', name: 'Lifestyle', subtype: 'expense' },
  { code: '5601', name: 'Clothing', subtype: 'expense', parent: '5600' },
  { code: '5602', name: 'Entertainment', subtype: 'expense', parent: '5600' },
  { code: '5603', name: 'Subscriptions', subtype: 'expense', parent: '5600' },
  { code: '5604', name: 'Holidays and travel', subtype: 'expense', parent: '5600' },
  { code: '5605', name: 'Gifts and donations', subtype: 'expense', parent: '5600' },
  { code: '5700', name: 'Financial', subtype: 'expense' },
  { code: '5701', name: 'Bank fees and charges', subtype: 'expense', parent: '5700' },
  { code: '5702', name: 'Loan interest', subtype: 'expense', parent: '5700' },
  { code: '5900', name: 'Other spending', subtype: 'expense', isDefault: true },
];
