-- BIZOMAT ERP, Release 3 (owner's brief "BIZOMAT ERP — full enterprise functionality", section 6): manufacturing. Work
-- centres and machines with a capacity calendar and cost rates; routings with revisions and release control;
-- manufacturing orders with their materials, operations, labour and machine time, reports of output, scrap, rework and
-- downtime, inspection points and finished-goods receipts; the master production schedule, MRP runs with their inputs
-- and suggestions; and the costs of each order at close. Additive only: new tables and indexes, no existing table
-- changed.
--
-- As in Releases 1 and 2 (0020, 0021), every row carries company_id and rows link through (company_id, id) keys, so the
-- database refuses a link between two companies. Kinds that later releases may extend (methods, production types,
-- priorities, report kinds, time kinds, demand kinds, suggestion kinds, cost elements) are checked by the code, with a
-- length check here; statuses are listed. Stock moves through Release 2's ledger (erp_stock_moves, with new movement
-- types checked by stock.ts). Code: src/worker/erp (manufacturing.ts, production.ts, planning.ts, mfg-reports.ts).
-- Docs: docs/erp/release-3.md.

-- ------------------------------------------------------------------ settings and planning data

-- Per-company manufacturing settings. over_completion_pct: how far above its quantity an order may be completed (0: not
-- at all). reserve_on_release: materials are reserved when an order is released, as far as stock allows.
CREATE TABLE erp_mfg_settings (
  company_id TEXT PRIMARY KEY,
  over_completion_pct REAL NOT NULL DEFAULT 0 CHECK (over_completion_pct >= 0 AND over_completion_pct <= 100),
  reserve_on_release INTEGER NOT NULL DEFAULT 1 CHECK (reserve_on_release IN (0, 1)),
  fg_location_id TEXT,
  mrp_horizon_days INTEGER NOT NULL DEFAULT 90 CHECK (mrp_horizon_days >= 7 AND mrp_horizon_days <= 730),
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, fg_location_id) REFERENCES erp_locations(company_id, id)
);

-- How a product is planned: made or bought (checked by the code; empty: worked out from its released bill of materials
-- and routing), lead times, safety stock and order sizes. Reorder points stay in erp_product_stock (Release 2).
CREATE TABLE erp_product_planning (
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '' CHECK (length(source) <= 20),
  purchase_lead_days INTEGER CHECK (purchase_lead_days IS NULL OR (purchase_lead_days >= 0 AND purchase_lead_days <= 1000)),
  mfg_lead_days INTEGER CHECK (mfg_lead_days IS NULL OR (mfg_lead_days >= 0 AND mfg_lead_days <= 1000)),
  safety_stock REAL NOT NULL DEFAULT 0 CHECK (safety_stock >= 0),
  min_order_qty REAL CHECK (min_order_qty IS NULL OR min_order_qty > 0),
  order_multiple REAL CHECK (order_multiple IS NULL OR order_multiple > 0),
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, product_id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);

-- ------------------------------------------------------------------ work centres and machines

-- A work centre: its capacity calendar (working days as ISO weekday numbers, hours per day, efficiency, how many
-- machines or stations work in parallel) and its cost rates per hour (labour, machine, overhead per labour hour, or
-- overhead as a percentage of labour and machine cost).
CREATE TABLE erp_work_centres (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_hold','inactive')),
  working_days TEXT NOT NULL DEFAULT '1,2,3,4,5' CHECK (length(working_days) BETWEEN 1 AND 13),
  hours_per_day REAL NOT NULL DEFAULT 8 CHECK (hours_per_day > 0 AND hours_per_day <= 24),
  efficiency_pct REAL NOT NULL DEFAULT 100 CHECK (efficiency_pct > 0 AND efficiency_pct <= 200),
  machines INTEGER NOT NULL DEFAULT 1 CHECK (machines >= 1 AND machines <= 1000),
  labour_rate_cents INTEGER NOT NULL DEFAULT 0 CHECK (labour_rate_cents >= 0),
  machine_rate_cents INTEGER NOT NULL DEFAULT 0 CHECK (machine_rate_cents >= 0),
  overhead_rate_cents INTEGER NOT NULL DEFAULT 0 CHECK (overhead_rate_cents >= 0),
  overhead_pct REAL NOT NULL DEFAULT 0 CHECK (overhead_pct >= 0 AND overhead_pct <= 1000),
  search TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (overhead_rate_cents = 0 OR overhead_pct = 0)
);
CREATE UNIQUE INDEX erp_work_centres_code ON erp_work_centres(company_id, code);

-- A machine in a work centre. asset_id may name a Maintenance asset of the same company (read only: an open breakdown
-- work order on it shows the machine as down). The code checks the asset's company; there is no foreign key, so
-- Maintenance stays as it is.
CREATE TABLE erp_machines (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_centre_id TEXT NOT NULL,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  machine_rate_cents INTEGER CHECK (machine_rate_cents IS NULL OR machine_rate_cents >= 0),
  asset_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, work_centre_id) REFERENCES erp_work_centres(company_id, id)
);
CREATE UNIQUE INDEX erp_machines_code ON erp_machines(company_id, code);
CREATE INDEX erp_machines_centre ON erp_machines(company_id, work_centre_id);

-- ------------------------------------------------------------------ routings

-- A routing revision of a product: draft, released (one per product at a time) or superseded. Released by someone
-- other than its author (segregation of duties; the one-person company exception is recorded).
CREATE TABLE erp_routings (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  revision TEXT NOT NULL COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','released','superseded')),
  description TEXT NOT NULL DEFAULT '',
  lead_time_days INTEGER CHECK (lead_time_days IS NULL OR (lead_time_days >= 0 AND lead_time_days <= 1000)),
  copied_from TEXT,
  released_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  released_at INTEGER,
  release_note TEXT NOT NULL DEFAULT '',
  sod_exception INTEGER NOT NULL DEFAULT 0 CHECK (sod_exception IN (0, 1)),
  superseded_by TEXT,
  superseded_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE UNIQUE INDEX erp_routings_revision ON erp_routings(company_id, product_id, revision);
CREATE UNIQUE INDEX erp_routings_released ON erp_routings(company_id, product_id) WHERE status = 'released';

-- A routing's operations: number, work centre, machine, set-up and run time (minutes; run time per unit), crew, an
-- inspection point, an outsourced step (supplier and estimated cost per unit), and its predecessors (a JSON list of
-- operation numbers; NULL: the operation numbered before it) with whether it may overlap them.
CREATE TABLE erp_routing_operations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  routing_id TEXT NOT NULL,
  op_no INTEGER NOT NULL CHECK (op_no >= 1 AND op_no <= 9999),
  name TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  work_centre_id TEXT,
  machine_id TEXT,
  setup_minutes REAL NOT NULL DEFAULT 0 CHECK (setup_minutes >= 0),
  run_minutes REAL NOT NULL DEFAULT 0 CHECK (run_minutes >= 0),
  crew REAL NOT NULL DEFAULT 1 CHECK (crew >= 0 AND crew <= 100),
  inspection INTEGER NOT NULL DEFAULT 0 CHECK (inspection IN (0, 1)),
  inspection_note TEXT NOT NULL DEFAULT '',
  outsourced INTEGER NOT NULL DEFAULT 0 CHECK (outsourced IN (0, 1)),
  supplier_id TEXT,
  outsource_cost_cents INTEGER CHECK (outsource_cost_cents IS NULL OR outsource_cost_cents >= 0),
  outsource_days INTEGER CHECK (outsource_days IS NULL OR (outsource_days >= 0 AND outsource_days <= 1000)),
  predecessors TEXT,
  overlap INTEGER NOT NULL DEFAULT 0 CHECK (overlap IN (0, 1)),
  UNIQUE (company_id, id),
  UNIQUE (company_id, routing_id, op_no),
  CHECK (outsourced = 1 OR work_centre_id IS NOT NULL),
  CHECK (outsourced = 0 OR supplier_id IS NOT NULL),
  FOREIGN KEY (company_id, routing_id) REFERENCES erp_routings(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, work_centre_id) REFERENCES erp_work_centres(company_id, id),
  FOREIGN KEY (company_id, machine_id) REFERENCES erp_machines(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);

-- ------------------------------------------------------------------ manufacturing orders

-- A manufacturing order (MO-00001): a product made from a released bill of materials revision and a released routing.
-- max_qty is the quantity plus the company's over-completion tolerance when it was set: the CHECK refuses completing
-- more, so two people receiving the last units at once cannot both succeed. Estimated costs by element are kept on the
-- order; actual costs come from its movements, time and operations, and are written to erp_mo_costs when it closes.
CREATE TABLE erp_mfg_orders (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  product_id TEXT NOT NULL,
  bom_revision_id TEXT NOT NULL,
  routing_id TEXT,
  quantity REAL NOT NULL CHECK (quantity > 0),
  max_qty REAL NOT NULL CHECK (max_qty > 0),
  completed_qty REAL NOT NULL DEFAULT 0 CHECK (completed_qty >= 0),
  received_value_cents INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  required_date TEXT,
  finish_date TEXT,
  -- make_to_stock, make_to_order, engineer_to_order; discrete, assembly, batch, repetitive, job; low, normal, high,
  -- urgent (checked by the code)
  method TEXT NOT NULL DEFAULT 'make_to_stock' CHECK (length(method) BETWEEN 1 AND 30),
  production_type TEXT NOT NULL DEFAULT 'discrete' CHECK (length(production_type) BETWEEN 1 AND 30),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (length(priority) BETWEEN 1 AND 20),
  customer_ref TEXT NOT NULL DEFAULT '',
  fg_location_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','released','in_progress','completed','closed','cancelled')),
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision > 0),
  currency TEXT NOT NULL DEFAULT 'AUD',
  est_material_cents INTEGER NOT NULL DEFAULT 0,
  est_labour_cents INTEGER NOT NULL DEFAULT 0,
  est_machine_cents INTEGER NOT NULL DEFAULT 0,
  est_outsource_cents INTEGER NOT NULL DEFAULT 0,
  est_overhead_cents INTEGER NOT NULL DEFAULT 0,
  est_scrap_cents INTEGER NOT NULL DEFAULT 0,
  est_missing TEXT NOT NULL DEFAULT '',
  actual_cents INTEGER,
  variance_cents INTEGER,
  mrp_suggestion_id TEXT,
  released_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  released_at INTEGER,
  started_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  completed_at INTEGER,
  closed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  cancelled_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  cancelled_at INTEGER,
  cancel_reason TEXT NOT NULL DEFAULT '',
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (completed_qty <= max_qty + 1e-9),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, bom_revision_id) REFERENCES erp_revisions(company_id, id),
  FOREIGN KEY (company_id, routing_id) REFERENCES erp_routings(company_id, id),
  FOREIGN KEY (company_id, fg_location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_mfg_orders_number ON erp_mfg_orders(company_id, number);
CREATE INDEX erp_mfg_orders_status ON erp_mfg_orders(company_id, status, required_date);
CREATE INDEX erp_mfg_orders_product ON erp_mfg_orders(company_id, product_id, status);

-- Each earlier version of an amended order: what it said, and why it changed.
CREATE TABLE erp_mo_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  changed_at INTEGER NOT NULL,
  UNIQUE (company_id, mo_id, revision),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE
);

-- The people assigned to an order.
CREATE TABLE erp_mo_assignees (
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, mo_id, user_id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE
);

-- The materials of an order, from its bill of materials with the scrap allowance. issued_qty is net of returns: the
-- CHECK refuses returning more than was issued.
CREATE TABLE erp_mo_materials (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  product_id TEXT NOT NULL,
  bom_line_id TEXT,
  qty_per REAL NOT NULL CHECK (qty_per > 0),
  scrap_pct REAL NOT NULL DEFAULT 0 CHECK (scrap_pct >= 0),
  required_qty REAL NOT NULL CHECK (required_qty >= 0),
  issued_qty REAL NOT NULL DEFAULT 0 CHECK (issued_qty >= -1e-9),
  scrapped_qty REAL NOT NULL DEFAULT 0 CHECK (scrapped_qty >= 0),
  est_unit_cost_cents REAL,
  uom TEXT NOT NULL DEFAULT 'each',
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_mo_materials_mo ON erp_mo_materials(company_id, mo_id, position);
CREATE INDEX erp_mo_materials_product ON erp_mo_materials(company_id, product_id);

-- Which stock reservations (erp_reservations, Release 2) hold materials for which order.
CREATE TABLE erp_mo_reservations (
  company_id TEXT NOT NULL,
  reservation_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  PRIMARY KEY (company_id, reservation_id),
  FOREIGN KEY (company_id, reservation_id) REFERENCES erp_reservations(company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id),
  FOREIGN KEY (company_id, material_id) REFERENCES erp_mo_materials(company_id, id)
);
CREATE INDEX erp_mo_reservations_mo ON erp_mo_reservations(company_id, mo_id);

-- The operations of an order, copied from its routing, with what happened at each. max_qty copies the order's: the
-- CHECK refuses reporting more good output than the order may complete.
CREATE TABLE erp_mo_operations (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  op_no INTEGER NOT NULL,
  name TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  work_centre_id TEXT,
  machine_id TEXT,
  setup_minutes REAL NOT NULL DEFAULT 0,
  run_minutes REAL NOT NULL DEFAULT 0,
  crew REAL NOT NULL DEFAULT 1,
  inspection INTEGER NOT NULL DEFAULT 0 CHECK (inspection IN (0, 1)),
  inspection_note TEXT NOT NULL DEFAULT '',
  outsourced INTEGER NOT NULL DEFAULT 0 CHECK (outsourced IN (0, 1)),
  supplier_id TEXT,
  outsource_cost_cents INTEGER,
  outsource_days INTEGER,
  predecessors TEXT,
  overlap INTEGER NOT NULL DEFAULT 0 CHECK (overlap IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','paused','completed')),
  max_qty REAL NOT NULL,
  good_qty REAL NOT NULL DEFAULT 0 CHECK (good_qty >= 0),
  scrap_qty REAL NOT NULL DEFAULT 0 CHECK (scrap_qty >= 0),
  rework_qty REAL NOT NULL DEFAULT 0 CHECK (rework_qty >= 0),
  downtime_minutes REAL NOT NULL DEFAULT 0 CHECK (downtime_minutes >= 0),
  planned_start TEXT,
  planned_finish TEXT,
  started_at INTEGER,
  started_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  completed_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  inspection_result TEXT CHECK (inspection_result IS NULL OR inspection_result IN ('pass','fail')),
  inspection_comment TEXT NOT NULL DEFAULT '',
  inspection_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  inspection_at INTEGER,
  actual_outsource_cents INTEGER CHECK (actual_outsource_cents IS NULL OR actual_outsource_cents >= 0),
  UNIQUE (company_id, id),
  UNIQUE (company_id, mo_id, op_no),
  CHECK (good_qty <= max_qty + 1e-9),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, work_centre_id) REFERENCES erp_work_centres(company_id, id),
  FOREIGN KEY (company_id, machine_id) REFERENCES erp_machines(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);
CREATE INDEX erp_mo_operations_centre ON erp_mo_operations(company_id, work_centre_id, status);

-- Labour (per person) and machine time on an operation: a running timer (minutes NULL) or minutes entered, with the
-- rate per hour at the time and the cost it adds. Rework time is marked. One running timer per person, operation and
-- kind (labour, machine: checked by the code).
CREATE TABLE erp_mo_time (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  machine_id TEXT,
  started_at INTEGER,
  ended_at INTEGER,
  minutes REAL CHECK (minutes IS NULL OR (minutes >= 0 AND minutes <= 100000)),
  rework INTEGER NOT NULL DEFAULT 0 CHECK (rework IN (0, 1)),
  rate_cents INTEGER NOT NULL DEFAULT 0,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  overhead_cents INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, operation_id) REFERENCES erp_mo_operations(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, machine_id) REFERENCES erp_machines(company_id, id)
);
CREATE INDEX erp_mo_time_mo ON erp_mo_time(company_id, mo_id, created_at);
CREATE UNIQUE INDEX erp_mo_time_running ON erp_mo_time(company_id, operation_id, user_id, kind) WHERE minutes IS NULL;

-- What was reported at an operation: good output, scrap (with a reason), rework, downtime (minutes and a reason). Kinds
-- are checked by the code. A client key makes a double submission count once.
CREATE TABLE erp_mo_reports (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  minutes REAL NOT NULL DEFAULT 0 CHECK (minutes >= 0),
  reason TEXT NOT NULL DEFAULT '',
  machine_id TEXT,
  request_key TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, operation_id) REFERENCES erp_mo_operations(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, machine_id) REFERENCES erp_machines(company_id, id)
);
CREATE INDEX erp_mo_reports_mo ON erp_mo_reports(company_id, mo_id, created_at);
CREATE INDEX erp_mo_reports_kind ON erp_mo_reports(company_id, kind, created_at);
CREATE UNIQUE INDEX erp_mo_reports_request ON erp_mo_reports(company_id, request_key) WHERE request_key IS NOT NULL;

-- Finished goods received into stock from an order (FGR-00001), valued at the order's actual cost. A client key makes
-- a double submission or a retry return the first receipt.
CREATE TABLE erp_mo_receipts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  mo_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  lot TEXT NOT NULL DEFAULT '',
  serials_json TEXT NOT NULL DEFAULT '[]',
  expiry TEXT,
  unit_cost_cents REAL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  request_key TEXT,
  group_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, location_id) REFERENCES erp_locations(company_id, id)
);
CREATE UNIQUE INDEX erp_mo_receipts_number ON erp_mo_receipts(company_id, number);
CREATE UNIQUE INDEX erp_mo_receipts_request ON erp_mo_receipts(company_id, request_key) WHERE request_key IS NOT NULL;
CREATE INDEX erp_mo_receipts_mo ON erp_mo_receipts(company_id, mo_id, created_at);

-- The costs of an order when it closed, by element (materials, labour, machine, outsourcing, overheads, scrap, rework:
-- checked by the code): estimated, actual and the variance.
CREATE TABLE erp_mo_costs (
  company_id TEXT NOT NULL,
  mo_id TEXT NOT NULL,
  element TEXT NOT NULL CHECK (length(element) BETWEEN 1 AND 20),
  estimated_cents INTEGER NOT NULL DEFAULT 0,
  actual_cents INTEGER NOT NULL DEFAULT 0,
  variance_cents INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (company_id, mo_id, element),
  FOREIGN KEY (company_id, mo_id) REFERENCES erp_mfg_orders(company_id, id) ON DELETE CASCADE
);

-- ------------------------------------------------------------------ planning

-- The master production schedule: forecast or confirmed demand (checked by the code) for a product, a quantity and a
-- due date, with a reference (there are no sales orders before Release 5).
CREATE TABLE erp_mps_entries (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  due_date TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  reference TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','cancelled')),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);
CREATE INDEX erp_mps_entries_due ON erp_mps_entries(company_id, status, due_date);

-- One MRP run (MRP-00001) with the inputs it used (inputs_json: demand, stock, open orders, settings) and a summary.
CREATE TABLE erp_mrp_runs (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  run_date TEXT NOT NULL,
  horizon_days INTEGER NOT NULL,
  include_forecast INTEGER NOT NULL DEFAULT 0 CHECK (include_forecast IN (0, 1)),
  inputs_json TEXT NOT NULL DEFAULT '{}',
  summary_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'done' CHECK (status IN ('done')),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX erp_mrp_runs_number ON erp_mrp_runs(company_id, number);
CREATE INDEX erp_mrp_runs_created ON erp_mrp_runs(company_id, created_at);

-- Each product's netting in a run: its level, stock, safety stock, receipts expected, requirements and what was planned.
CREATE TABLE erp_mrp_lines (
  company_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT '',
  on_hand REAL NOT NULL DEFAULT 0,
  reserved REAL NOT NULL DEFAULT 0,
  available REAL NOT NULL DEFAULT 0,
  safety_stock REAL NOT NULL DEFAULT 0,
  reorder_point REAL,
  scheduled_receipts REAL NOT NULL DEFAULT 0,
  gross_requirements REAL NOT NULL DEFAULT 0,
  planned_qty REAL NOT NULL DEFAULT 0,
  projected_end REAL NOT NULL DEFAULT 0,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  detail_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (company_id, run_id, product_id),
  FOREIGN KEY (company_id, run_id) REFERENCES erp_mrp_runs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);

-- MRP's suggestions: buy (convert to a requisition), make (convert to a draft manufacturing order) and expedite (an
-- open purchase order or manufacturing order due after it is needed); kinds are checked by the code. messages: late,
-- overdue, expedite.
CREATE TABLE erp_mrp_suggestions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  quantity REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  need_date TEXT,
  order_date TEXT,
  lead_time_days INTEGER NOT NULL DEFAULT 0,
  supplier_id TEXT,
  ref_type TEXT NOT NULL DEFAULT '',
  ref_id TEXT,
  ref_number TEXT NOT NULL DEFAULT '',
  messages TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','converted','dismissed')),
  converted_type TEXT NOT NULL DEFAULT '',
  converted_id TEXT,
  converted_number TEXT NOT NULL DEFAULT '',
  converted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  converted_at INTEGER,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, run_id) REFERENCES erp_mrp_runs(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id),
  FOREIGN KEY (company_id, supplier_id) REFERENCES erp_suppliers(company_id, id)
);
CREATE INDEX erp_mrp_suggestions_run ON erp_mrp_suggestions(company_id, run_id, kind);
