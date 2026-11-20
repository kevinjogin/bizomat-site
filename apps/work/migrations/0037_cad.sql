-- CAD Automation inside BIZOMAT ERP (owner's brief and approved audit of 19 Nov 2026; docs/cad/README.md). Additive
-- only: nothing acts until the flag cad_in_erp is on for a company. CAD Automation's engine, its computers' and AI
-- connectors' addresses and SOLIDWORKS on the customer's computer stay where they are; the ERP shows and manages them by
-- company and keeps what it saves (documents, bill of materials proposals) in its own tables.

-- CAD Automation's accounts as its sync reports them (company/cad-sync.ts), mapped to a BIZOMAT account by its BIZOMAT
-- id, or by an email both sides have confirmed; and, for the computers, commands and AI connections it already has, to
-- one company. An account that cannot be mapped or placed waits here for a platform admin (status 'review'). Nothing
-- is deleted.
CREATE TABLE cad_accounts (
  cad_account_id TEXT PRIMARY KEY CHECK (length(cad_account_id) BETWEEN 1 AND 64),
  email TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  sub TEXT,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  method TEXT CHECK (method IN ('sub', 'email')),
  company_id TEXT REFERENCES companies(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'review' CHECK (status IN ('mapped', 'review')),
  reason TEXT NOT NULL DEFAULT '',
  counts_json TEXT NOT NULL DEFAULT '{}',
  assigned_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  assigned_at INTEGER,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE INDEX cad_accounts_user ON cad_accounts(user_id);
CREATE INDEX cad_accounts_status ON cad_accounts(status, last_seen);

-- Each automation run CAD Automation finished for a company, once (its command id): the audit entry and, for a failed
-- run, the person's notice are made from it.
CREATE TABLE cad_runs (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  command_id TEXT NOT NULL CHECK (length(command_id) BETWEEN 1 AND 64),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  tool TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('done', 'failed', 'cancelled', 'expired')),
  seconds REAL,
  finished_at INTEGER NOT NULL,
  recorded_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, command_id)
);
CREATE INDEX cad_runs_when ON cad_runs(company_id, finished_at);

-- Where a document version saved from CAD Automation came from (5.1): the export, the command that made it and the
-- file's SHA-256, so a drawing on a product revision can be traced back to the SOLIDWORKS run that produced it.
CREATE TABLE cad_document_sources (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  version_id TEXT NOT NULL,
  document_id TEXT NOT NULL,
  export_id TEXT NOT NULL,
  command_id TEXT,
  format TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL,
  sha256 TEXT NOT NULL CHECK (length(sha256) = 64),
  size INTEGER NOT NULL,
  saved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  saved_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, version_id)
);
CREATE INDEX cad_document_sources_document ON cad_document_sources(company_id, document_id);

-- A bill of materials read from an assembly (5.2), proposed for a draft or in-change revision. Applying it adds or
-- changes lines of that revision only; a released bill of materials is never changed. Rejected and applied proposals
-- are kept.
CREATE TABLE cad_bom_proposals (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  command_id TEXT NOT NULL,
  assembly TEXT NOT NULL DEFAULT '',
  lines_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'applied', 'rejected')),
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, revision_id) REFERENCES erp_revisions(company_id, id)
);
CREATE INDEX cad_bom_proposals_revision ON cad_bom_proposals(company_id, revision_id, status);

-- A design document sent for review as a task (5.6): the task in the company's Projects and Tasks workspace.
CREATE TABLE cad_review_tasks (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  requested_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  requested_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, item_id)
);
CREATE INDEX cad_review_tasks_document ON cad_review_tasks(company_id, document_id);
