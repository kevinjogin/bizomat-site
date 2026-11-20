-- BIZOMAT ERP: postings to Finance's ledger from the modules framework (batch 2, item 1; docs/erp/postings.md), and the
-- intercompany contacts of consolidation (batch 2, item 2), custom fields (batch 2, item 3) and the sign-in challenge of
-- two-factor sign-in for everyone and the price source of sales order lines (batch 2, item 4), and the supplier portal
-- (batch 2, item 5).
-- Depreciation of fixed assets, approved pay runs and earned revenue become posted journals in the company's Finance
-- business workspace, through Finance's own ledger code (src/worker/fin/ledger.ts), into the accounts the company
-- chooses here. Additive only. Each journal is recorded once per key in erp_integration_events (kind
-- 'finance.journal'), in the same transaction as the journal, so a second attempt posts nothing.

-- The account the company posts each part of a journal to, in one Finance workspace. A role without a row is not
-- chosen yet: nothing of that kind posts until it is (the settings screen suggests accounts from the chart).
CREATE TABLE erp_posting_accounts (
  company_id TEXT NOT NULL,
  fin_org_id TEXT NOT NULL,
  -- dep_expense, dep_accumulated, wages_expense, contribution_expense, withholding_payable, contribution_payable,
  -- deductions_payable, net_pay, rev_deferred, rev_earned (src/worker/erp/objects/postings.ts checks the list)
  role TEXT NOT NULL CHECK (length(role) BETWEEN 3 AND 40),
  account_id TEXT NOT NULL,
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, fin_org_id, role)
);

-- Consolidation and intercompany (catalogue 21; docs/erp/consolidation.md): the Finance contact that stands for a legal
-- entity of the company's group in one Finance workspace (the buyer as a customer in the seller's workspace, the seller as
-- a supplier in the buyer's). Remembered when an intercompany transaction makes its invoice and bill; the consolidated
-- report eliminates the balances posted against these contacts. Nothing is copied: the contact stays Finance's.
CREATE TABLE erp_ic_contacts (
  company_id TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  fin_org_id TEXT NOT NULL,
  contact_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, entity_id, fin_org_id)
);

-- Custom fields on the modules framework's records (batch 2, item 3; src/worker/erp/objects/custom.ts): added by an ERP
-- administrator to one kind of record. Values are kept in the record (erp_objects.data_json) under the field's key; an
-- archived field is hidden and its values kept. The type never changes.
CREATE TABLE erp_custom_fields (
  company_id TEXT NOT NULL,
  object TEXT NOT NULL CHECK (length(object) BETWEEN 3 AND 40),
  key TEXT NOT NULL CHECK (key LIKE 'cf\_%' ESCAPE '\' AND length(key) BETWEEN 4 AND 40),
  label TEXT NOT NULL CHECK (length(label) BETWEEN 1 AND 80),
  type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'number', 'money', 'date', 'select', 'bool')),
  options_json TEXT NOT NULL DEFAULT '[]',
  required INTEGER NOT NULL DEFAULT 0 CHECK (required IN (0, 1)),
  list INTEGER NOT NULL DEFAULT 0 CHECK (list IN (0, 1)),
  help TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, object, key)
);

-- Two-factor sign-in for every account (batch 2, item 4; flag account_two_factor, off; src/worker/auth/two-factor.ts):
-- a password (or Google) sign-in of a person who has turned two-factor sign-in on makes no session yet, only this
-- challenge, which a code from their authenticator app (or a recovery code) turns into one. Ten minutes, five tries,
-- used once; only its SHA-256 is kept. Enrolments stay in user_mfa (migration 0029).
CREATE TABLE login_challenges (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (length(provider) BETWEEN 1 AND 40),
  redirect_to TEXT,
  ip TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
CREATE INDEX login_challenges_user ON login_challenges(user_id, created_at);

-- Price lists and promotions on sales orders (batch 2, item 4; src/worker/erp/objects/pricing.ts): where each line's
-- price came from (the price list, the promotion, the standard price, or typed by hand), in plain words.
ALTER TABLE erp_so_lines ADD COLUMN price_note TEXT NOT NULL DEFAULT '';

-- The supplier portal (batch 2, item 5; flag supplier_portal, off; src/worker/erp/supplier-portal.ts): a supplier's own
-- people, invited by email by a buyer, sign in with their own BIZOMAT account and see only that supplier's purchase
-- orders and requests for quotation in that company. They are not members of the company. An invitation's token is kept
-- as its SHA-256 only, until it is accepted by the account with the invited address.
CREATE TABLE erp_supplier_portal_users (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 3 AND 320),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('invited', 'active', 'revoked')),
  invited_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  invited_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  revoked_at INTEGER,
  revoked_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_supplier_portal_users_user ON erp_supplier_portal_users(user_id, status);
CREATE INDEX erp_supplier_portal_users_supplier ON erp_supplier_portal_users(company_id, supplier_id, status);

-- A supplier's answer to a purchase order through the portal: accepted (with the date it promises) or declined, once per
-- revision of the order (an amended order is answered again).
CREATE TABLE erp_po_acknowledgements (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  po_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('accepted', 'declined')),
  promised_date TEXT,
  note TEXT NOT NULL DEFAULT '',
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, po_id, revision),
  FOREIGN KEY (company_id, po_id) REFERENCES erp_purchase_orders(company_id, id) ON DELETE CASCADE
);

-- Who entered a quotation: a buyer ('staff', as before) or the supplier through the portal ('portal').
ALTER TABLE erp_quotations ADD COLUMN source TEXT NOT NULL DEFAULT 'staff' CHECK (source IN ('staff', 'portal'));
