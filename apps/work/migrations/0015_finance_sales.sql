-- BIZOMAT Finance, Stage 1 of the accounting upgrade (owner's brief, 13 Nov 2026): quotes, credit notes, a shared
-- document engine and secure online links. Additive only:
--
--   * new columns (ALTER TABLE ... ADD COLUMN with constant defaults) on fin_docs, fin_doc_lines and
--     fin_doc_templates; every existing row keeps its values and reads the defaults for the new columns;
--   * new tables for quotes (fin_quotes, fin_quote_lines, fin_quote_versions, fin_quote_events) and credit notes
--     (fin_credit_notes, fin_credit_note_lines, fin_credit_allocations, fin_credit_refunds).
--
-- fin_docs is not rebuilt: its kind and status checks stay as they are, so quotes and credit notes have tables of their
-- own. Like every Finance table they carry org_id, and links between Finance records are composite foreign keys
-- (org_id, <ref>_id) so a record can never point into another workspace. Links that could point either way (a quote's
-- invoice, an invoice's quote) are plain columns written only by the server for records of the same workspace.

-- ------------------------------------------------------------------ invoices, bills, orders and claims: new details

-- Where goods go, when it differs from the billing address.
ALTER TABLE fin_docs ADD COLUMN delivery_address TEXT NOT NULL DEFAULT '';
-- The salesperson on an invoice (a member of the workspace).
ALTER TABLE fin_docs ADD COLUMN sales_rep_id TEXT;
-- A discount on the whole document, in basis points (1000 = 10%), applied to every line before tax.
ALTER TABLE fin_docs ADD COLUMN discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000);
-- The quote an invoice was made from, and the share of that quote it invoices (basis points; 10000 = all of it).
ALTER TABLE fin_docs ADD COLUMN quote_id TEXT;
ALTER TABLE fin_docs ADD COLUMN quote_bp INTEGER NOT NULL DEFAULT 0 CHECK (quote_bp BETWEEN 0 AND 10000);
-- A secure online link: the link carries a signature over the document and this value; clearing it withdraws the link.
ALTER TABLE fin_docs ADD COLUMN public_nonce TEXT;
ALTER TABLE fin_docs ADD COLUMN viewed_at INTEGER;

-- A line may be a heading that groups the lines after it; lines may carry an item code and a unit.
ALTER TABLE fin_doc_lines ADD COLUMN line_kind TEXT NOT NULL DEFAULT 'item' CHECK (line_kind IN ('item','heading'));
ALTER TABLE fin_doc_lines ADD COLUMN item_code TEXT NOT NULL DEFAULT '';
ALTER TABLE fin_doc_lines ADD COLUMN unit TEXT NOT NULL DEFAULT '';

-- Document templates: page layout, typeface, titles and default terms for each kind of document.
ALTER TABLE fin_doc_templates ADD COLUMN layout TEXT NOT NULL DEFAULT 'portrait' CHECK (layout IN ('portrait','landscape'));
ALTER TABLE fin_doc_templates ADD COLUMN font TEXT NOT NULL DEFAULT 'helvetica' CHECK (font IN ('helvetica','times','courier'));
ALTER TABLE fin_doc_templates ADD COLUMN quote_title TEXT NOT NULL DEFAULT 'Quote';
ALTER TABLE fin_doc_templates ADD COLUMN credit_note_title TEXT NOT NULL DEFAULT 'Credit note';
ALTER TABLE fin_doc_templates ADD COLUMN quote_terms TEXT NOT NULL DEFAULT '';
ALTER TABLE fin_doc_templates ADD COLUMN invoice_terms TEXT NOT NULL DEFAULT '';
ALTER TABLE fin_doc_templates ADD COLUMN show_signature INTEGER NOT NULL DEFAULT 1;
ALTER TABLE fin_doc_templates ADD COLUMN show_remittance INTEGER NOT NULL DEFAULT 1;

-- ------------------------------------------------------------------ quotes

CREATE TABLE fin_quotes (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  contact_id TEXT,
  -- The CRM deal this quote is for, when the workspace belongs to a company that runs the CRM.
  crm_deal_id TEXT,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  reference TEXT NOT NULL DEFAULT '',
  sales_rep_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  delivery_address TEXT NOT NULL DEFAULT '',
  tax_mode TEXT NOT NULL DEFAULT 'exclusive' CHECK (tax_mode IN ('inclusive','exclusive','none')),
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000),
  -- Totals of the lines that count (optional lines do not): the net after discounts, the overall discount, GST, total.
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  tax_total INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  -- The share already invoiced, in basis points (10000 = all of it): progress invoicing.
  invoiced_bp INTEGER NOT NULL DEFAULT 0 CHECK (invoiced_bp BETWEEN 0 AND 10000),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','accepted','declined','expired','converted','cancelled')),
  version INTEGER NOT NULL DEFAULT 1,
  template_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  terms TEXT NOT NULL DEFAULT '',
  public_nonce TEXT,
  sent_at INTEGER,
  viewed_at INTEGER,
  accepted_at INTEGER,
  -- Who accepted: the name the customer typed online, or the one a member recorded.
  accepted_name TEXT NOT NULL DEFAULT '',
  accepted_online INTEGER NOT NULL DEFAULT 0,
  declined_at INTEGER,
  decline_reason TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  UNIQUE (org_id, number),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id),
  FOREIGN KEY (org_id, template_id) REFERENCES fin_doc_templates(org_id, id)
);
CREATE INDEX fin_quotes_list ON fin_quotes(org_id, deleted_at, status, issue_date);
CREATE INDEX fin_quotes_deal ON fin_quotes(org_id, crm_deal_id);

CREATE TABLE fin_quote_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  line_kind TEXT NOT NULL DEFAULT 'item' CHECK (line_kind IN ('item','heading')),
  item_code TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  quantity_milli INTEGER NOT NULL DEFAULT 1000,
  unit TEXT NOT NULL DEFAULT '',
  unit_price INTEGER NOT NULL DEFAULT 0,
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000),
  -- An optional item is shown with its price but is not in the total until the customer takes it.
  optional INTEGER NOT NULL DEFAULT 0,
  account_id TEXT,
  tax_code_id TEXT,
  net INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  FOREIGN KEY (org_id, quote_id) REFERENCES fin_quotes(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);
CREATE INDEX fin_quote_lines_quote ON fin_quote_lines(quote_id, line_no);

-- Each version a customer was sent, exactly as it was (the document and its lines as JSON).
CREATE TABLE fin_quote_versions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (quote_id, version),
  FOREIGN KEY (org_id, quote_id) REFERENCES fin_quotes(org_id, id) ON DELETE CASCADE
);

-- What happened to a quote and who did it (the customer, through the online link, is named as they typed it).
CREATE TABLE fin_quote_events (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_id TEXT,
  actor_name TEXT NOT NULL DEFAULT '',
  detail_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, quote_id) REFERENCES fin_quotes(org_id, id) ON DELETE CASCADE
);
CREATE INDEX fin_quote_events_quote ON fin_quote_events(quote_id, created_at);

-- ------------------------------------------------------------------ credit notes

CREATE TABLE fin_credit_notes (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  number TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  -- The invoice it corrects, when there is one (credits can also stand alone and be applied later).
  invoice_id TEXT,
  issue_date TEXT NOT NULL,
  reference TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  tax_mode TEXT NOT NULL DEFAULT 'exclusive' CHECK (tax_mode IN ('inclusive','exclusive','none')),
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_total INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0 CHECK (total >= 0),
  -- Applied to invoices, and paid back to the customer.
  allocated INTEGER NOT NULL DEFAULT 0,
  refunded INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','applied','void')),
  template_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  journal_id TEXT,
  void_journal_id TEXT,
  public_nonce TEXT,
  sent_at INTEGER,
  viewed_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  voided_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  CHECK (allocated >= 0 AND refunded >= 0 AND allocated + refunded <= total),
  UNIQUE (org_id, number),
  UNIQUE (org_id, id),
  FOREIGN KEY (org_id, contact_id) REFERENCES fin_contacts(org_id, id),
  FOREIGN KEY (org_id, invoice_id) REFERENCES fin_docs(org_id, id),
  FOREIGN KEY (org_id, template_id) REFERENCES fin_doc_templates(org_id, id),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id),
  FOREIGN KEY (org_id, void_journal_id) REFERENCES fin_journals(org_id, id)
);
CREATE INDEX fin_credit_notes_list ON fin_credit_notes(org_id, deleted_at, status, issue_date);

CREATE TABLE fin_credit_note_lines (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  credit_note_id TEXT NOT NULL,
  line_no INTEGER NOT NULL,
  line_kind TEXT NOT NULL DEFAULT 'item' CHECK (line_kind IN ('item','heading')),
  item_code TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  quantity_milli INTEGER NOT NULL DEFAULT 1000,
  unit TEXT NOT NULL DEFAULT '',
  unit_price INTEGER NOT NULL DEFAULT 0,
  discount_bp INTEGER NOT NULL DEFAULT 0 CHECK (discount_bp BETWEEN 0 AND 10000),
  account_id TEXT,
  tax_code_id TEXT,
  net INTEGER NOT NULL DEFAULT 0,
  tax INTEGER NOT NULL DEFAULT 0,
  department_id TEXT,
  project_id TEXT,
  cost_centre_id TEXT,
  FOREIGN KEY (org_id, credit_note_id) REFERENCES fin_credit_notes(org_id, id) ON DELETE CASCADE,
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, tax_code_id) REFERENCES fin_tax_codes(org_id, id),
  FOREIGN KEY (org_id, department_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, project_id) REFERENCES fin_tracking(org_id, id),
  FOREIGN KEY (org_id, cost_centre_id) REFERENCES fin_tracking(org_id, id)
);
CREATE INDEX fin_credit_note_lines_note ON fin_credit_note_lines(credit_note_id, line_no);

-- A credit applied to an invoice: both sit in the customer's receivable, so applying one posts nothing; it lowers what
-- the invoice still owes (fin_docs.amount_paid) and what the credit has left.
CREATE TABLE fin_credit_allocations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  credit_note_id TEXT NOT NULL,
  invoice_id TEXT NOT NULL,
  date TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  voided_at INTEGER,
  FOREIGN KEY (org_id, credit_note_id) REFERENCES fin_credit_notes(org_id, id),
  FOREIGN KEY (org_id, invoice_id) REFERENCES fin_docs(org_id, id)
);
CREATE INDEX fin_credit_allocations_note ON fin_credit_allocations(org_id, credit_note_id);
CREATE INDEX fin_credit_allocations_invoice ON fin_credit_allocations(org_id, invoice_id);

-- Money paid back to the customer for a credit (recorded only: BIZOMAT does not move money).
CREATE TABLE fin_credit_refunds (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES fin_orgs(id) ON DELETE CASCADE,
  credit_note_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  date TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  reference TEXT NOT NULL DEFAULT '',
  journal_id TEXT,
  void_journal_id TEXT,
  voided_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id, credit_note_id) REFERENCES fin_credit_notes(org_id, id),
  FOREIGN KEY (org_id, account_id) REFERENCES fin_accounts(org_id, id),
  FOREIGN KEY (org_id, journal_id) REFERENCES fin_journals(org_id, id),
  FOREIGN KEY (org_id, void_journal_id) REFERENCES fin_journals(org_id, id)
);
CREATE INDEX fin_credit_refunds_note ON fin_credit_refunds(org_id, credit_note_id);
