-- BIZOMAT ERP: postings to Finance's ledger from the modules framework (batch 2, item 1; docs/erp/postings.md), and the
-- intercompany contacts of consolidation (batch 2, item 2).
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
