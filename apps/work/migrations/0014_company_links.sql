-- Links between the tools a company runs (owner's request, 13 Nov 2026: "linking all the things between TASKS, CRM,
-- FINANCE"). Additive: three new co_* tables; no existing table, column or row is changed. Each link joins records of
-- two tools that belong to the same company (src/worker/company/links.ts checks both sides on every request):
--
--   co_customer_links  one customer record: a CRM company and the Finance contact it is billed as
--   co_deal_links      a CRM deal and what it became: a draft Finance invoice, a Project Management project (board)
--   co_project_links   a Project Management project and the Finance tracking project its income and costs are posted to
--
-- A link never copies money or records between tools: figures are read from the tool that owns them, at the time.

CREATE TABLE co_customer_links (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  crm_company_id TEXT NOT NULL,
  fin_contact_id TEXT NOT NULL,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, crm_company_id),
  UNIQUE (company_id, fin_contact_id)
);

CREATE TABLE co_deal_links (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  crm_deal_id TEXT NOT NULL,
  fin_invoice_id TEXT,
  pm_board_id TEXT,
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, crm_deal_id)
);
CREATE INDEX co_deal_links_board ON co_deal_links(company_id, pm_board_id);

CREATE TABLE co_project_links (
  company_id TEXT NOT NULL REFERENCES co_companies(id) ON DELETE CASCADE,
  pm_board_id TEXT NOT NULL,
  fin_tracking_id TEXT NOT NULL,
  -- The project's budget in Finance's minor units (cents), set here; NULL when none is set.
  budget INTEGER CHECK (budget IS NULL OR budget >= 0),
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, pm_board_id),
  UNIQUE (company_id, fin_tracking_id)
);
