-- BIZOMAT ERP modules framework (owner's brief "97-module enterprise expansion", 20 Nov 2026; docs/erp/MODULES.md).
-- Additive only: the records of the new modules (People and HR, payroll, timesheets, service, contracts, fleet,
-- calibration, fixed assets and the rest), their line items, references to shared records, comments, the ERP's alerts,
-- saved list filters and the marks that make reminders and escalations happen once. Numbering uses erp_sequences, the
-- history erp_events (entity_type 'record'), files erp_record_files (entity_type 'object') and Finance drafts
-- erp_integration_events, as the earlier releases do. Every table is a company table: company_id on every row and in
-- every statement (test-node/company-queries.test.ts).

-- One row per record of a framework object (src/shared/erp-objects). data_json holds the fields the definition names,
-- checked by the server; the columns beside it are what lists, filters, access and reminders need.
CREATE TABLE erp_objects (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  object TEXT NOT NULL CHECK (length(object) BETWEEN 3 AND 40),
  number TEXT NOT NULL CHECK (length(number) BETWEEN 1 AND 40),
  title TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (length(status) BETWEEN 1 AND 40),
  data_json TEXT NOT NULL DEFAULT '{}',
  amount_cents INTEGER,
  currency TEXT,
  date TEXT,
  due_date TEXT,
  -- the person the record belongs to (self service), the person it is assigned to, and the person who may also approve
  owner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  assignee_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  approver_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  status_at INTEGER NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  -- set by each save; the save's other statements apply only while it holds (two saves at once: one wins, whole)
  write_token TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER,
  UNIQUE (company_id, id),
  UNIQUE (company_id, object, number)
);
CREATE INDEX erp_objects_list ON erp_objects(company_id, object, archived_at, updated_at);
CREATE INDEX erp_objects_status ON erp_objects(company_id, object, status);
CREATE INDEX erp_objects_due ON erp_objects(company_id, due_date);
CREATE INDEX erp_objects_owner ON erp_objects(company_id, owner_user_id);
CREATE INDEX erp_objects_assignee ON erp_objects(company_id, assignee_id);

-- Line items of a record (timesheet hours, payslips, price list prices, readings, budget lines...), in order.
CREATE TABLE erp_object_lines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  data_json TEXT NOT NULL DEFAULT '{}',
  amount_cents INTEGER,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, record_id) REFERENCES erp_objects(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_object_lines_record ON erp_object_lines(company_id, record_id, position);

-- What each record refers to (its reference fields and lines): related records both ways, where-used, and the labels
-- shown to people who may read the record but not the record referred to.
CREATE TABLE erp_object_refs (
  company_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field TEXT NOT NULL,
  kind TEXT NOT NULL,
  target_id TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (company_id, record_id, field, target_id),
  FOREIGN KEY (company_id, record_id) REFERENCES erp_objects(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_object_refs_target ON erp_object_refs(company_id, kind, target_id);

CREATE TABLE erp_object_comments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, record_id) REFERENCES erp_objects(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_object_comments_record ON erp_object_comments(company_id, record_id, created_at);

-- The ERP's alerts to a person (approvals waiting, assignments, due dates, workflow rules), in the app and, where email
-- is set up, by email. The same dedupe key never alerts the same person twice. Never for the example company by email.
CREATE TABLE erp_alerts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 40),
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL,
  record_id TEXT,
  dedupe_key TEXT NOT NULL,
  emailed INTEGER NOT NULL DEFAULT 0,
  read_at INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, dedupe_key)
);
CREATE INDEX erp_alerts_user ON erp_alerts(company_id, user_id, read_at, created_at);

-- A person's saved list filters for one kind of record.
CREATE TABLE erp_object_views (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  object TEXT NOT NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 80),
  query TEXT NOT NULL CHECK (length(query) <= 2000),
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE INDEX erp_object_views_user ON erp_object_views(company_id, user_id, object);

-- Reminders and escalations done: one row per record, kind and occasion, so the 15-minute run acts once.
CREATE TABLE erp_object_marks (
  company_id TEXT NOT NULL,
  record_id TEXT NOT NULL,
  mark TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, record_id, mark)
);
