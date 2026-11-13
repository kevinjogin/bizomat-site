-- BIZOMAT Finance (owner's brief, 13 Nov 2026). Additive: new fin_* tables, indexes and triggers only; no existing
-- table, column or row is changed. Finance runs inside this app (same Worker, database, file store, accounts and
-- sessions), served at /finance.
--
-- Workspace isolation is enforced by the database, not only by the queries:
--   * every Finance table carries org_id, and records cascade from fin_orgs;
--   * every link between two Finance records is a composite foreign key (org_id, <ref>_id) -> <table>(org_id, id),
--     so a journal line can never post to another workspace's account, an invoice never name another workspace's
--     customer, and so on.
-- The links point one way only (parents first), as the data tooling needs (scripts/migrate/lib/d1-sql.mjs); links that
-- could point either way (a journal's source document, a reversal, a statement line's match, a file's parent) are plain
-- columns written only by the server for records of the same workspace.
--
-- Accounting integrity, also enforced by the database (triggers at the end):
--   * a journal is posted only when its lines balance (debits = credits) and it has at least two lines;
--   * a posted journal and its lines can never be changed or deleted: corrections are reversing journals;
--   * nothing dated on or before the workspace's lock date can be posted.
-- Money is integer minor units of the workspace's currency (cents for AUD). Dates are 'YYYY-MM-DD' text.

CREATE TABLE fin_orgs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('personal','household','business')),
  currency TEXT NOT NULL DEFAULT 'AUD',
  country TEXT NOT NULL DEFAULT 'Australia',
  timezone TEXT NOT NULL DEFAULT 'Australia/Sydney',
  fy_start_month INTEGER NOT NULL DEFAULT 7 CHECK (fy_start_month BETWEEN 1 AND 12),
  gst_registered INTEGER NOT NULL DEFAULT 0,
  gst_basis TEXT NOT NULL DEFAULT 'accrual' CHECK (gst_basis IN ('cash','accrual')),
  gst_period TEXT NOT NULL DEFAULT 'quarterly' CHECK (gst_period IN ('monthly','quarterly','annual')),
  bas_method TEXT NOT NULL DEFAULT 'simpler' CHECK (bas_method IN ('simpler','full')),
  legal_name TEXT NOT NULL DEFAULT '',
  abn TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  -- Nothing dated on or before this date can be posted or reversed (accounting period lock).
  lock_date TEXT,
  settings_json TEXT NOT NULL DEFAULT '{}',
  logo_key TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE TABLE fin_members (
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','accountant','finance_manager','contributor','viewer')),
  title TEXT NOT NULL DEFAULT '',
  invited_by TEXT,
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX fin_members_user ON fin_members(user_id);
-- Exactly one owner per workspace (ownership moves with a transfer).
CREATE UNIQUE INDEX fin_members_one_owner ON fin_members(org_id) WHERE role = 'owner';

CREATE TABLE fin_invitations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','accountant','finance_manager','contributor','viewer')),
  token_hash TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL DEFAULT '',
  invited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  last_sent_at INTEGER,
  send_count INTEGER NOT NULL DEFAULT 1,
  accepted_at INTEGER,
  accepted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  declined_at INTEGER,
  revoked_at INTEGER,
  revoked_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE INDEX fin_invitations_org ON fin_invitations(org_id, created_at);
CREATE INDEX fin_invitations_email ON fin_invitations(email);

-- Permission overrides per role and module (the code's defaults when absent; owner and admin are never overridden).
CREATE TABLE fin_role_permissions (
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  module TEXT NOT NULL,
  perms_json TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (org_id, role, module)
);

-- Numbering of invoices, bills, purchase orders and expense claims: the last number used per kind.
CREATE TABLE fin_counters (
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  last_number INTEGER NOT NULL,
  PRIMARY KEY (org_id, key)
);

CREATE TABLE fin_tax_codes (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  -- Basis points: 1000 = 10%.
  rate_bp INTEGER NOT NULL DEFAULT 0 CHECK (rate_bp BETWEEN 0 AND 10000),
  direction TEXT NOT NULL CHECK (direction IN ('sales','purchases','both')),
  -- BAS labels the amounts count toward, e.g. ["G1","1A"] (src/shared/fin/tax.ts).
  bas_json TEXT NOT NULL DEFAULT '[]',
  system_key TEXT,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, code),
  UNIQUE (org_id, id)
);

-- The chart of accounts: categories and money accounts are both accounts.
CREATE TABLE fin_accounts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset','liability','equity','revenue','expense')),
  subtype TEXT NOT NULL,
  -- A category's parent (one level of subcategories); the parent has the same type.
  parent_id TEXT,
  description TEXT NOT NULL DEFAULT '',
  tax_code_id TEXT,
  -- Accounts the books need: ar, ap, gst, claims, retained, opening, rounding.
  system_key TEXT,
  bank_name TEXT NOT NULL DEFAULT '',
  bank_number TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, code),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id)
);
CREATE INDEX fin_accounts_org ON fin_accounts(org_id, type, position);
CREATE UNIQUE INDEX fin_accounts_system ON fin_accounts(org_id, system_key) WHERE system_key IS NOT NULL;

-- Departments, projects and cost centres.
CREATE TABLE fin_tracking (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('department','project','cost_centre')),
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);
CREATE INDEX fin_tracking_org ON fin_tracking(org_id, kind);

-- Customers and suppliers.
CREATE TABLE fin_contacts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'customer' CHECK (kind IN ('customer','supplier','both')),
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  abn TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  terms_days INTEGER,
  default_account_id TEXT,
  default_tax_code_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, default_account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, default_tax_code_id) REFERENCES fin_tax_codes(org_id, id)
);
CREATE INDEX fin_contacts_org ON fin_contacts(org_id, name COLLATE NOCASE);

-- The general ledger. A journal is inserted as 'draft', its lines added and then posted in the same transaction; the
-- triggers below refuse an unbalanced or locked posting and any change to a posted journal.
CREATE TABLE fin_journals (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  date TEXT NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
  source_type TEXT NOT NULL CHECK (source_type IN ('manual','transaction','invoice','bill','expense_claim','payment','opening','reversal')),
  source_id TEXT,
  memo TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','posted')),
  -- The journal this one reverses, and the one that reversed this (same workspace; written by the server).
  reverses_id TEXT,
  reversed_by_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  posted_at INTEGER,
  UNIQUE (org_id, number),
  UNIQUE (org_id, id)
);
CREATE INDEX fin_journals_date ON fin_journals(org_id, date);
CREATE INDEX fin_journals_source ON fin_journals(org_id, source_type, source_id);

CREATE TABLE fin_journal_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  journal_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  account_id TEXT NOT NULL,
  debit INTEGER NOT NULL DEFAULT 0,
  credit INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  tax_code_id TEXT,
  -- The tax (GST) included with this line, signed like the line (debit positive, credit negative).
  tax_amount INTEGER NOT NULL DEFAULT 0,
  contact_id TEXT,
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  -- Household workspaces: the member the money belongs to (individual views). A plain column: a posted line never
  -- changes, so deleting an account must not try to clear it.
  person_id TEXT,
  CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);
CREATE INDEX fin_journal_lines_journal ON fin_journal_lines(journal_id, line_no);
CREATE INDEX fin_journal_lines_account ON fin_journal_lines(org_id, account_id);
CREATE INDEX fin_journal_lines_contact ON fin_journal_lines(org_id, contact_id);

-- Money in, money out and transfers on a money account (bank, cash, credit card, loan), with split lines.
CREATE TABLE fin_transactions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('receive','spend','transfer')),
  account_id TEXT NOT NULL,
  to_account_id TEXT,
  date TEXT NOT NULL,
  contact_id TEXT,
  payee TEXT NOT NULL DEFAULT '',
  reference TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tax_mode TEXT NOT NULL DEFAULT 'inclusive' CHECK (tax_mode IN ('inclusive','exclusive','none')),
  total INTEGER NOT NULL CHECK (total > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','posted','void')),
  journal_id TEXT,
  void_journal_id TEXT,
  reconciled INTEGER NOT NULL DEFAULT 0,
  recurring_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  person_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  rejected_note TEXT NOT NULL DEFAULT '',
  voided_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, to_account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id),
  FOREIGN KEY (org_id, void_journal_id) REFERENCES fin_journals(org_id, id)
);
CREATE INDEX fin_transactions_account ON fin_transactions(org_id, account_id, date);
CREATE INDEX fin_transactions_date ON fin_transactions(org_id, date);
CREATE INDEX fin_transactions_status ON fin_transactions(org_id, status);

CREATE TABLE fin_transaction_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  account_id TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  net INTEGER NOT NULL,
  tax INTEGER NOT NULL DEFAULT 0,
  tax_code_id TEXT,
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  FOREIGN KEY (org_id, transaction_id) REFERENCES fin_transactions(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);
CREATE INDEX fin_transaction_lines_tx ON fin_transaction_lines(transaction_id, line_no);

-- How each invoice or bill looks: title, colour, payment instructions and footer.
CREATE TABLE fin_doc_templates (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Invoice',
  accent TEXT NOT NULL DEFAULT '#0f766e',
  payment_instructions TEXT NOT NULL DEFAULT '',
  footer TEXT NOT NULL DEFAULT '',
  is_default INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id)
);

-- Sales invoices, supplier bills, purchase orders and expense claims.
CREATE TABLE fin_docs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('invoice','bill','purchase_order','expense_claim')),
  number TEXT NOT NULL,
  contact_id TEXT,
  -- Expense claims: the member who paid and is reimbursed.
  claimant_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  issue_date TEXT NOT NULL,
  due_date TEXT,
  reference TEXT NOT NULL DEFAULT '',
  tax_mode TEXT NOT NULL DEFAULT 'exclusive' CHECK (tax_mode IN ('inclusive','exclusive','none')),
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_total INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  amount_paid INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved','part_paid','paid','billed','void')),
  template_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  terms TEXT NOT NULL DEFAULT '',
  journal_id TEXT,
  void_journal_id TEXT,
  source_doc_id TEXT,
  recurring_id TEXT,
  sent_at INTEGER,
  rejected_note TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  submitted_at INTEGER,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  voided_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  CHECK (amount_paid >= 0 AND amount_paid <= total),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id),
  FOREIGN KEY (org_id, template_id) REFERENCES fin_doc_templates(org_id, id),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id),
  FOREIGN KEY (org_id, void_journal_id) REFERENCES fin_journals(org_id, id)
);
CREATE UNIQUE INDEX fin_docs_number ON fin_docs(org_id, kind, number) WHERE deleted_at IS NULL;
CREATE INDEX fin_docs_status ON fin_docs(org_id, kind, status, due_date);
CREATE INDEX fin_docs_contact ON fin_docs(org_id, contact_id);

CREATE TABLE fin_doc_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  doc_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  -- Thousandths: 1500 = 1.5.
  quantity_milli INTEGER NOT NULL DEFAULT 1000,
  unit_price INTEGER NOT NULL DEFAULT 0,
  -- Basis points: 1000 = 10%.
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000),
  account_id TEXT,
  tax_code_id TEXT,
  net INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  FOREIGN KEY (org_id, doc_id) REFERENCES fin_docs(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);
CREATE INDEX fin_doc_lines_doc ON fin_doc_lines(doc_id, line_no);

-- Payments recorded against an invoice, bill or expense claim (recorded only: BIZOMAT does not move money).
CREATE TABLE fin_payments (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  doc_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  date TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  reference TEXT NOT NULL DEFAULT '',
  journal_id TEXT,
  void_journal_id TEXT,
  voided_at INTEGER,
  reconciled INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, doc_id) REFERENCES fin_docs(org_id, id),
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id),
  FOREIGN KEY (org_id, void_journal_id) REFERENCES fin_journals(org_id, id)
);
CREATE INDEX fin_payments_doc ON fin_payments(org_id, doc_id);
CREATE INDEX fin_payments_account ON fin_payments(org_id, account_id, date);

-- Bank statements imported from CSV, OFX or QIF files, and their lines waiting to be matched.
CREATE TABLE fin_statement_imports (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  filename TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL CHECK (format IN ('csv','ofx','qif')),
  rows INTEGER NOT NULL DEFAULT 0,
  imported INTEGER NOT NULL DEFAULT 0,
  duplicates INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id)
);

CREATE TABLE fin_statement_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  import_id TEXT,
  date TEXT NOT NULL,
  -- Signed: money in positive, money out negative.
  amount INTEGER NOT NULL CHECK (amount <> 0),
  description TEXT NOT NULL DEFAULT '',
  payee TEXT NOT NULL DEFAULT '',
  reference TEXT NOT NULL DEFAULT '',
  dedupe_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unmatched' CHECK (status IN ('unmatched','matched','ignored')),
  matched_type TEXT CHECK (matched_type IN ('transaction','payment')),
  matched_id TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (org_id, account_id, dedupe_key),
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, import_id) REFERENCES fin_statement_imports(org_id, id) ON DELETE SET NULL
);
CREATE INDEX fin_statement_lines_open ON fin_statement_lines(org_id, account_id, status, date);

-- A completed reconciliation: the statement balance on a date, and the ledger balance it was checked against.
CREATE TABLE fin_reconciliations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  statement_date TEXT NOT NULL,
  statement_balance INTEGER NOT NULL,
  ledger_balance INTEGER NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id)
);
CREATE INDEX fin_reconciliations_account ON fin_reconciliations(org_id, account_id, statement_date);

-- Categorisation rules: text in a bank line suggests an account, tax code and contact.
CREATE TABLE fin_rules (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  match_text TEXT NOT NULL,
  direction TEXT NOT NULL DEFAULT 'any' CHECK (direction IN ('in','out','any')),
  account_id TEXT NOT NULL,
  tax_code_id TEXT,
  contact_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id)
);
CREATE INDEX fin_rules_org ON fin_rules(org_id, position);

-- Recurring transactions, invoices and bills: a template and a schedule, created by the 15-minute maintenance run.
CREATE TABLE fin_recurring (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('transaction','invoice','bill')),
  name TEXT NOT NULL,
  template_json TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly','fortnightly','monthly','quarterly','yearly')),
  next_date TEXT NOT NULL,
  end_date TEXT,
  remaining INTEGER,
  -- 1: post (approve) each new record; 0: leave it as a draft.
  auto_post INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  last_run_at INTEGER,
  last_error TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX fin_recurring_due ON fin_recurring(active, next_date);
CREATE INDEX fin_recurring_org ON fin_recurring(org_id);

CREATE TABLE fin_budgets (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  -- First month of the budget year ('YYYY-MM').
  start_month TEXT NOT NULL,
  months INTEGER NOT NULL DEFAULT 12 CHECK (months BETWEEN 1 AND 36),
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  -- Warn when spending reaches this share of the budget (percent).
  alert_pct INTEGER NOT NULL DEFAULT 90 CHECK (alert_pct BETWEEN 1 AND 1000),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);

CREATE TABLE fin_budget_lines (
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  budget_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  month TEXT NOT NULL CHECK (month GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]'),
  amount INTEGER NOT NULL,
  PRIMARY KEY (budget_id, account_id, month),
  FOREIGN KEY (org_id, budget_id) REFERENCES fin_budgets(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id)
);

-- Savings goals (personal and household): progress is the linked account's balance, or an amount set by hand.
CREATE TABLE fin_goals (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount INTEGER NOT NULL CHECK (target_amount > 0),
  target_date TEXT,
  account_id TEXT,
  saved_amount INTEGER NOT NULL DEFAULT 0,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id)
);

-- Receipts, invoices and other documents, attached to a record or kept in the library; versions are kept.
CREATE TABLE fin_files (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  parent_type TEXT NOT NULL DEFAULT 'none' CHECK (parent_type IN ('none','transaction','doc','journal','contact')),
  parent_id TEXT,
  folder TEXT NOT NULL DEFAULT '',
  account_id TEXT,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  replaces_id TEXT,
  search TEXT NOT NULL DEFAULT '',
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id)
);
CREATE INDEX fin_files_parent ON fin_files(org_id, parent_type, parent_id);
CREATE INDEX fin_files_org ON fin_files(org_id, created_at);

-- Reports generated on a schedule and kept in the documents library.
CREATE TABLE fin_report_schedules (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  report_key TEXT NOT NULL,
  params_json TEXT NOT NULL DEFAULT '{}',
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly','quarterly')),
  format TEXT NOT NULL DEFAULT 'pdf' CHECK (format IN ('pdf','csv')),
  next_date TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  last_run_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX fin_report_schedules_due ON fin_report_schedules(active, next_date);

CREATE TABLE fin_notifications (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  actor_id TEXT,
  dedupe_key TEXT,
  created_at INTEGER NOT NULL,
  read_at INTEGER
);
CREATE INDEX fin_notifications_user ON fin_notifications(user_id, org_id, created_at);
CREATE UNIQUE INDEX fin_notifications_dedupe ON fin_notifications(user_id, dedupe_key) WHERE dedupe_key IS NOT NULL;

CREATE TABLE fin_notification_prefs (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  in_app INTEGER NOT NULL DEFAULT 1,
  email INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, type)
);

-- Who changed what. Insert-only; no foreign keys, so the trail outlives what it describes.
CREATE TABLE fin_audit_log (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  actor_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  before_json TEXT,
  after_json TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX fin_audit_org ON fin_audit_log(org_id, created_at);
CREATE INDEX fin_audit_target ON fin_audit_log(org_id, target_type, target_id);

-- ---------------------------------------------------------------------------------------------------------------------
-- Ledger integrity. The server validates first; these refuse anything that gets past it.

-- Each trigger is written on one line: the move tool (scripts/migrate/to-cloudflare.mjs) copies their text into
-- one-statement-per-line SQL files when it clears a database to replace its rows.

-- Posting requires at least two lines whose debits equal their credits.
CREATE TRIGGER fin_journal_post_balanced BEFORE UPDATE OF status ON fin_journals WHEN NEW.status = 'posted' AND OLD.status <> 'posted' AND ((SELECT COUNT(*) FROM fin_journal_lines WHERE journal_id = NEW.id) < 2 OR (SELECT COALESCE(SUM(debit), 0) - COALESCE(SUM(credit), 0) FROM fin_journal_lines WHERE journal_id = NEW.id) <> 0) BEGIN SELECT RAISE(ABORT, 'FIN_UNBALANCED: a journal must balance and have at least two lines'); END;

-- Nothing dated on or before the lock date can be posted.
CREATE TRIGGER fin_journal_post_locked BEFORE UPDATE OF status ON fin_journals WHEN NEW.status = 'posted' AND OLD.status <> 'posted' AND NEW.date <= COALESCE((SELECT lock_date FROM fin_orgs WHERE id = NEW.org_id), '') BEGIN SELECT RAISE(ABORT, 'FIN_LOCKED: the period is locked'); END;

-- A posted journal keeps its date, workspace, number and status; only the pointer to its reversal is ever written.
CREATE TRIGGER fin_journal_posted_frozen BEFORE UPDATE ON fin_journals WHEN OLD.status = 'posted' AND (NEW.status <> 'posted' OR NEW.date <> OLD.date OR NEW.org_id <> OLD.org_id OR NEW.number <> OLD.number OR NEW.source_type <> OLD.source_type OR COALESCE(NEW.source_id, '') <> COALESCE(OLD.source_id, '') OR COALESCE(NEW.reverses_id, '') <> COALESCE(OLD.reverses_id, '') OR (OLD.reversed_by_id IS NOT NULL AND COALESCE(NEW.reversed_by_id, '') <> OLD.reversed_by_id)) BEGIN SELECT RAISE(ABORT, 'FIN_POSTED: a posted journal cannot be changed; reverse it instead'); END;

CREATE TRIGGER fin_journal_posted_no_delete BEFORE DELETE ON fin_journals WHEN OLD.status = 'posted' BEGIN SELECT RAISE(ABORT, 'FIN_POSTED: a posted journal cannot be deleted; reverse it instead'); END;

CREATE TRIGGER fin_journal_lines_posted_no_update BEFORE UPDATE ON fin_journal_lines WHEN (SELECT status FROM fin_journals WHERE id = OLD.journal_id) = 'posted' BEGIN SELECT RAISE(ABORT, 'FIN_POSTED: the lines of a posted journal cannot be changed'); END;

CREATE TRIGGER fin_journal_lines_posted_no_delete BEFORE DELETE ON fin_journal_lines WHEN (SELECT status FROM fin_journals WHERE id = OLD.journal_id) = 'posted' BEGIN SELECT RAISE(ABORT, 'FIN_POSTED: the lines of a posted journal cannot be deleted'); END;

-- No trigger refuses an INSERT of lines: the data tooling (scripts/migrate) applies these migrations to an empty D1 and
-- then loads posted journals and their lines as rows. The server only ever adds lines to a draft journal in the same
-- transaction that posts it, and the balance check above runs at that posting. Journal text stays short (descriptions
-- and memos are limited to 500 characters), so the tooling never rewrites a posted line in chunks.
