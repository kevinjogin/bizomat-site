-- BIZOMAT ERP, Release 4 part A (owner's brief "BIZOMAT ERP — full enterprise functionality", section 7): quality
-- management. Inspection plans with versions and characteristics; inspections (QI-00001) of goods receipts, manufacturing
-- operations, finished-goods receipts and suppliers, with readings per characteristic and sample and a result worked out
-- from the limits; nonconformance reports (NCR-00001) with containment, root cause, dispositions and the actions that
-- carry them out through Release 2's stock service; corrective and preventive actions (CA-00001) with approval,
-- verification and closure. Additive only: new tables and indexes, no existing table changed, no trigger.
--
-- As in Releases 1 to 3 (0020 to 0022), every row carries company_id and rows link through (company_id, id) keys, so
-- the database refuses a link between two companies. Kinds that later releases may extend (plan kinds, characteristic
-- kinds, inspection sources, severities, dispositions, action kinds, CAPA kinds) are checked by the code, with a length
-- check here; statuses and results are listed. A Maintenance asset named on an NCR is read only: no foreign key to
-- Maintenance's tables (as Release 3's machines). Stock moves through Release 2's ledger (erp_stock_moves).
-- Code: src/worker/erp (quality.ts, ncr.ts, quality-reports.ts). Docs: docs/erp/release-4-quality.md.

-- ------------------------------------------------------------------ inspection plans

-- An inspection plan version (QP-00001, version 1, 2, ...): what to check for a kind of inspection (incoming, first
-- article, in-process, final, supplier, product), applying to a product (optionally one revision), a supplier, or an
-- operation of a routing (routing and operation number). One draft and one released version per plan at a time;
-- releasing a draft supersedes the released one in the same transaction.
CREATE TABLE erp_qc_plans (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  version INTEGER NOT NULL CHECK (version >= 1 AND version <= 9999),
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','released','superseded')),
  description TEXT NOT NULL DEFAULT '',
  product_id TEXT,
  revision_id TEXT,
  supplier_id TEXT,
  routing_id TEXT,
  op_no INTEGER CHECK (op_no IS NULL OR (op_no >= 1 AND op_no <= 9999)),
  copied_from TEXT,
  released_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  released_at INTEGER,
  release_note TEXT NOT NULL DEFAULT '',
  superseded_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, revision_id) REFERENCES erp_revisions(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id),
  FOREIGN KEY (company_id, routing_id) REFERENCES erp_routings(company_id, id)
);
CREATE UNIQUE INDEX erp_qc_plans_version ON erp_qc_plans(company_id, number, version);
CREATE UNIQUE INDEX erp_qc_plans_released ON erp_qc_plans(company_id, number) WHERE status = 'released';
CREATE UNIQUE INDEX erp_qc_plans_draft ON erp_qc_plans(company_id, number) WHERE status = 'draft';
CREATE INDEX erp_qc_plans_product ON erp_qc_plans(company_id, product_id, status);
CREATE INDEX erp_qc_plans_supplier ON erp_qc_plans(company_id, supplier_id, status);

-- A plan's characteristics: a dimension or measured value (unit, nominal, tolerance, minimum, maximum), an attribute
-- (pass or fail) or a visual check; how many samples to read; whether a photo is needed.
CREATE TABLE erp_qc_plan_chars (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  unit TEXT NOT NULL DEFAULT '',
  nominal REAL,
  tolerance REAL CHECK (tolerance IS NULL OR tolerance >= 0),
  min_value REAL,
  max_value REAL,
  sample_size INTEGER NOT NULL DEFAULT 1 CHECK (sample_size >= 1 AND sample_size <= 200),
  photo_required INTEGER NOT NULL DEFAULT 0 CHECK (photo_required IN (0, 1)),
  instructions TEXT NOT NULL DEFAULT '',
  UNIQUE (company_id, id),
  CHECK (min_value IS NULL OR max_value IS NULL OR min_value <= max_value),
  FOREIGN KEY (company_id, plan_id) REFERENCES erp_qc_plans(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_qc_plan_chars_plan ON erp_qc_plan_chars(company_id, plan_id, position);

-- ------------------------------------------------------------------ inspections

-- An inspection (QI-00001). Its source (a goods receipt line, a manufacturing operation, a finished-goods receipt, a
-- supplier, or made by hand; checked by the code) and the records it came from; at most one inspection that is not
-- cancelled per receipt line, operation or finished-goods receipt. result is worked out on the server from the
-- readings (passed or failed); a quality manager may accept a failed lot on condition, with a reason (conditional).
-- quarantined_qty and released_qty: stock this inspection moved into quarantine and out of it again.
CREATE TABLE erp_qc_inspections (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','completed','cancelled')),
  result TEXT CHECK (result IS NULL OR result IN ('passed','failed','conditional')),
  plan_id TEXT,
  plan_label TEXT NOT NULL DEFAULT '',
  source_type TEXT NOT NULL CHECK (length(source_type) BETWEEN 1 AND 40),
  source_id TEXT,
  product_id TEXT,
  supplier_id TEXT,
  receipt_id TEXT,
  receipt_line_id TEXT,
  mo_id TEXT,
  mo_operation_id TEXT,
  fg_receipt_id TEXT,
  location_id TEXT,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  quantity REAL CHECK (quantity IS NULL OR quantity >= 0),
  quarantined_qty REAL NOT NULL DEFAULT 0 CHECK (quarantined_qty >= 0),
  released_qty REAL NOT NULL DEFAULT 0 CHECK (released_qty >= 0),
  notes TEXT NOT NULL DEFAULT '',
  concession_note TEXT NOT NULL DEFAULT '',
  concession_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  concession_at INTEGER,
  inspector_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  completed_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  request_key TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (released_qty <= quarantined_qty + 1e-9),
  FOREIGN KEY (company_id, plan_id) REFERENCES erp_qc_plans(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id),
  FOREIGN KEY (company_id, receipt_id) REFERENCES erp_receipts(company_id, id),
  FOREIGN KEY (company_id, receipt_line_id) REFERENCES erp_receipt_lines(company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id),
  FOREIGN KEY (company_id, mo_operation_id) REFERENCES erp_mo_operations(company_id, id),
  FOREIGN KEY (company_id, fg_receipt_id) REFERENCES erp_mo_receipts(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_qc_inspections_number ON erp_qc_inspections(company_id, number);
CREATE UNIQUE INDEX erp_qc_inspections_source ON erp_qc_inspections(company_id, source_type, source_id) WHERE source_id IS NOT NULL AND status <> 'cancelled';
CREATE UNIQUE INDEX erp_qc_inspections_request ON erp_qc_inspections(company_id, request_key) WHERE request_key IS NOT NULL;
CREATE INDEX erp_qc_inspections_status ON erp_qc_inspections(company_id, status, created_at);
CREATE INDEX erp_qc_inspections_product ON erp_qc_inspections(company_id, product_id, completed_at);
CREATE INDEX erp_qc_inspections_supplier ON erp_qc_inspections(company_id, supplier_id, completed_at);
CREATE INDEX erp_qc_inspections_lot ON erp_qc_inspections(company_id, product_id, lot) WHERE lot <> '';
CREATE INDEX erp_qc_inspections_mo ON erp_qc_inspections(company_id, mo_id) WHERE mo_id IS NOT NULL;

-- An inspection's characteristics: copied from its plan when it is made (so a later plan version never changes a past
-- inspection), or added by hand to an inspection without a plan. lower_limit and upper_limit are the limits the
-- server compares readings with; result is worked out from the readings.
CREATE TABLE erp_qc_insp_chars (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  inspection_id TEXT NOT NULL,
  plan_char_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  unit TEXT NOT NULL DEFAULT '',
  nominal REAL,
  tolerance REAL CHECK (tolerance IS NULL OR tolerance >= 0),
  min_value REAL,
  max_value REAL,
  lower_limit REAL,
  upper_limit REAL,
  sample_size INTEGER NOT NULL DEFAULT 1 CHECK (sample_size >= 1 AND sample_size <= 200),
  photo_required INTEGER NOT NULL DEFAULT 0 CHECK (photo_required IN (0, 1)),
  instructions TEXT NOT NULL DEFAULT '',
  result TEXT CHECK (result IS NULL OR result IN ('pass','fail')),
  UNIQUE (company_id, id),
  CHECK (lower_limit IS NULL OR upper_limit IS NULL OR lower_limit <= upper_limit),
  FOREIGN KEY (company_id, inspection_id) REFERENCES erp_qc_inspections(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_qc_insp_chars_inspection ON erp_qc_insp_chars(company_id, inspection_id, position);

-- One reading per characteristic and sample: a value (dimensions and measured values) or conforming yes or no
-- (attributes and visual checks), with ok worked out on the server, who recorded it and when.
CREATE TABLE erp_qc_readings (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  inspection_id TEXT NOT NULL,
  char_id TEXT NOT NULL,
  sample_no INTEGER NOT NULL CHECK (sample_no >= 1 AND sample_no <= 200),
  value REAL,
  conforming INTEGER CHECK (conforming IS NULL OR conforming IN (0, 1)),
  ok INTEGER NOT NULL CHECK (ok IN (0, 1)),
  note TEXT NOT NULL DEFAULT '',
  recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  recorded_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, char_id, sample_no),
  CHECK (value IS NOT NULL OR conforming IS NOT NULL),
  FOREIGN KEY (company_id, inspection_id) REFERENCES erp_qc_inspections(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, char_id) REFERENCES erp_qc_insp_chars(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_qc_readings_inspection ON erp_qc_readings(company_id, inspection_id);

-- ------------------------------------------------------------------ nonconformance

-- A nonconformance report (NCR-00001): what is affected (product, lot or serial, quantity, receipt, manufacturing
-- order, supplier, a Maintenance asset of the same company or a process), the defect and its severity, containment,
-- root cause (five whys or free text), the disposition decided by a quality manager, verification and closure.
CREATE TABLE erp_qc_ncrs (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (length(severity) BETWEEN 1 AND 20),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','contained','investigating','dispositioned','capa','verification','closed','cancelled')),
  product_id TEXT,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  quantity REAL CHECK (quantity IS NULL OR quantity >= 0),
  receipt_id TEXT,
  mo_id TEXT,
  supplier_id TEXT,
  asset_id TEXT,
  process TEXT NOT NULL DEFAULT '',
  location_id TEXT,
  containment TEXT NOT NULL DEFAULT '',
  contained_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  contained_at INTEGER,
  root_cause_method TEXT NOT NULL DEFAULT '' CHECK (length(root_cause_method) <= 20),
  whys_json TEXT NOT NULL DEFAULT '[]',
  root_cause TEXT NOT NULL DEFAULT '',
  investigated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  investigated_at INTEGER,
  disposition_note TEXT NOT NULL DEFAULT '',
  dispositioned_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  dispositioned_at INTEGER,
  verification_note TEXT NOT NULL DEFAULT '',
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  request_key TEXT,
  raised_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, receipt_id) REFERENCES erp_receipts(company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_qc_ncrs_number ON erp_qc_ncrs(company_id, number);
CREATE UNIQUE INDEX erp_qc_ncrs_request ON erp_qc_ncrs(company_id, request_key) WHERE request_key IS NOT NULL;
CREATE INDEX erp_qc_ncrs_status ON erp_qc_ncrs(company_id, status, created_at);
CREATE INDEX erp_qc_ncrs_product ON erp_qc_ncrs(company_id, product_id, lot);
CREATE INDEX erp_qc_ncrs_supplier ON erp_qc_ncrs(company_id, supplier_id, created_at);

-- The inspections an NCR came from or refers to.
CREATE TABLE erp_qc_ncr_inspections (
  company_id TEXT NOT NULL,
  ncr_id TEXT NOT NULL,
  inspection_id TEXT NOT NULL,
  PRIMARY KEY (company_id, ncr_id, inspection_id),
  FOREIGN KEY (company_id, ncr_id) REFERENCES erp_qc_ncrs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, inspection_id) REFERENCES erp_qc_inspections(company_id, id) ON DELETE CASCADE
);
CREATE INDEX erp_qc_ncr_inspections_inspection ON erp_qc_ncr_inspections(company_id, inspection_id);

-- The disposition of an NCR, one line per kind (use as is, rework, repair, scrap, return to supplier, regrade; checked
-- by the code) with its quantity. done_qty grows with the actions that carry it out; the CHECK refuses doing more than
-- was decided, so two people carrying out the same disposition at once cannot both take the last units.
CREATE TABLE erp_qc_dispositions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  ncr_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 30),
  quantity REAL NOT NULL CHECK (quantity >= 0),
  done_qty REAL NOT NULL DEFAULT 0 CHECK (done_qty >= 0),
  note TEXT NOT NULL DEFAULT '',
  UNIQUE (company_id, id),
  UNIQUE (company_id, ncr_id, kind),
  CHECK (done_qty <= quantity + 1e-9),
  FOREIGN KEY (company_id, ncr_id) REFERENCES erp_qc_ncrs(company_id, id) ON DELETE CASCADE
);

-- What was done to carry out a disposition (scrap, return to supplier, release from quarantine, a rework or repair
-- note, done where it stands; checked by the code), with the stock movements it made (group_id in erp_stock_moves).
-- The client's key makes a double submission or a retry do it once.
CREATE TABLE erp_qc_ncr_actions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  ncr_id TEXT NOT NULL,
  disposition_id TEXT,
  action TEXT NOT NULL CHECK (length(action) BETWEEN 1 AND 30),
  quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  product_id TEXT,
  location_id TEXT,
  to_location_id TEXT,
  lot TEXT NOT NULL DEFAULT '',
  serial TEXT NOT NULL DEFAULT '',
  group_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  request_key TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, ncr_id) REFERENCES erp_qc_ncrs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, disposition_id) REFERENCES erp_qc_dispositions(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id),
  FOREIGN KEY (company_id, to_location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_qc_ncr_actions_request ON erp_qc_ncr_actions(company_id, request_key) WHERE request_key IS NOT NULL;
CREATE INDEX erp_qc_ncr_actions_ncr ON erp_qc_ncr_actions(company_id, ncr_id, created_at);

-- ------------------------------------------------------------------ corrective and preventive actions

-- A corrective or preventive action (CA-00001; kinds checked by the code), from an NCR or on its own: a responsible
-- person, a due date, evidence (files), approval by a quality manager who neither proposed it nor is to do it,
-- progress, an effectiveness check and closure by a quality manager who did not do it. In a company of one person the
-- approval and closure are the recorded exception (approval_sod, closure_sod).
CREATE TABLE erp_qc_capas (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  ncr_id TEXT,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed','approved','in_progress','done','verified','closed','cancelled')),
  approved_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at INTEGER,
  approval_note TEXT NOT NULL DEFAULT '',
  approval_sod INTEGER NOT NULL DEFAULT 0 CHECK (approval_sod IN (0, 1)),
  started_at INTEGER,
  done_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  done_at INTEGER,
  done_note TEXT NOT NULL DEFAULT '',
  verified_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  verified_at INTEGER,
  verification_note TEXT NOT NULL DEFAULT '',
  effective INTEGER CHECK (effective IS NULL OR effective IN (0, 1)),
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  closure_note TEXT NOT NULL DEFAULT '',
  closure_sod INTEGER NOT NULL DEFAULT 0 CHECK (closure_sod IN (0, 1)),
  cancel_reason TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, ncr_id) REFERENCES erp_qc_ncrs(company_id, id)
);
CREATE UNIQUE INDEX erp_qc_capas_number ON erp_qc_capas(company_id, number);
CREATE INDEX erp_qc_capas_status ON erp_qc_capas(company_id, status, due_date);
CREATE INDEX erp_qc_capas_ncr ON erp_qc_capas(company_id, ncr_id);
CREATE INDEX erp_qc_capas_responsible ON erp_qc_capas(company_id, responsible_id, status);
