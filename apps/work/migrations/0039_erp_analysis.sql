-- Product Management's sales and margin analysis (owner, 20 Nov 2026: in the style of Phocas; src/worker/erp/analysis.ts).
-- Additive only. The analysis reads the ERP's own records and changes none of them; the one new table keeps the views
-- people save (a period, a comparison, a dimension, drill-down filters and a sort), their own or shared in the company.
-- A company table: company_id on every row and in every statement (test-node/company-queries.test.ts).
CREATE TABLE erp_analysis_views (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  shared INTEGER NOT NULL DEFAULT 0 CHECK (shared IN (0, 1)),
  spec_json TEXT NOT NULL CHECK (length(spec_json) <= 8000),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE INDEX erp_analysis_views_list ON erp_analysis_views(company_id, owner_id, shared);
