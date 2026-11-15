-- BIZOMAT ERP: Asset Management and Maintenance, stages M2 and M3 (ERP Release 4, part B). Additive: new mt_* tables
-- and indexes only. No existing table, column or row is changed (mt_assets, mt_work_orders, mt_labour and the rest of
-- 0018 keep their CHECK lists; nothing here rebuilds them).
--
--   M2  preventive maintenance (schedules per asset, templates per asset class, one work order per due occurrence),
--       meters and gauges with readings, inspection templates and inspections on work orders with their follow-ups.
--   M3  prestart checks, parts issued to work orders through ERP Inventory (erp_stock_moves, no second stock system),
--       maintenance stores (ERP warehouses), trades, technicians' labour rates and labour costs, downtime, sites.
--
-- Companies and keys as in 0018: company_id on every row, rows pointing at each other through (company_id, id) keys so a
-- record can never link to another company's. Money is whole cents. Kinds that later stages may extend (trigger kinds,
-- intervals, item kinds, sources, follow-up actions) are checked by the code (src/worker/maintenance), never listed in a
-- CHECK. Links point one way (parents first), as the data tooling needs.

-- ------------------------------------------------------------------ sites

-- Sites of a company (a plant, a depot, a building). Assets are placed in a site through mt_asset_sites, a side table, so
-- mt_assets is not changed.
CREATE TABLE mt_sites (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  code TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX mt_sites_code ON mt_sites(company_id, code);

CREATE TABLE mt_asset_sites (
  company_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, asset_id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, site_id) REFERENCES mt_sites(company_id, id)
);
CREATE INDEX mt_asset_sites_site ON mt_asset_sites(company_id, site_id);

-- ------------------------------------------------------------------ trades, technicians and labour costs

-- Trades (skills) with an optional hourly labour rate.
CREATE TABLE mt_trades (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  rate_cents INTEGER CHECK (rate_cents IS NULL OR rate_cents >= 0),
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX mt_trades_name ON mt_trades(company_id, name);

-- A person's own hourly labour rate in the company (optional).
CREATE TABLE mt_technicians (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rate_cents INTEGER CHECK (rate_cents IS NULL OR rate_cents >= 0),
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id)
);

-- The trades a person works in.
CREATE TABLE mt_technician_trades (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_id TEXT NOT NULL,
  PRIMARY KEY (company_id, user_id, trade_id),
  FOREIGN KEY (company_id, trade_id) REFERENCES mt_trades(company_id, id) ON DELETE CASCADE
);

-- The cost of each labour line (mt_labour: the timer, and from this stage manual time entries), priced once when the time
-- is recorded, so a later change of rate never changes past costs. entry: timer | manual. rate_source says which rate
-- applied (the person's, the work order's trade, the person's trade); a NULL rate means none was set then.
CREATE TABLE mt_labour_costs (
  labour_id TEXT PRIMARY KEY REFERENCES mt_labour(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  entry TEXT NOT NULL CHECK (length(entry) BETWEEN 1 AND 20),
  work_date TEXT NOT NULL,
  minutes INTEGER NOT NULL CHECK (minutes >= 0),
  rate_cents INTEGER CHECK (rate_cents IS NULL OR rate_cents >= 0),
  rate_source TEXT NOT NULL DEFAULT '',
  cost_cents INTEGER CHECK (cost_cents IS NULL OR cost_cents >= 0),
  note TEXT NOT NULL DEFAULT '',
  entered_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id) ON DELETE CASCADE
);
CREATE INDEX mt_labour_costs_wo ON mt_labour_costs(company_id, work_order_id);
CREATE INDEX mt_labour_costs_date ON mt_labour_costs(company_id, work_date);

-- ------------------------------------------------------------------ downtime

-- When the asset of a work order was down (for downtime, mean time between failures and mean time to repair).
CREATE TABLE mt_downtime (
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  cause TEXT NOT NULL DEFAULT '',
  recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, work_order_id),
  CHECK (ended_at IS NULL OR ended_at >= started_at),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id) ON DELETE CASCADE,
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id)
);
CREATE INDEX mt_downtime_asset ON mt_downtime(company_id, asset_id, started_at);

-- ------------------------------------------------------------------ inspection templates (checklists)

-- A checklist used for work order inspections and prestart checks. fail_action: what a failed inspection makes (one
-- corrective work order, one request, or nothing): work_order | request | none.
CREATE TABLE mt_insp_templates (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE,
  description TEXT NOT NULL DEFAULT '',
  fail_action TEXT NOT NULL DEFAULT 'work_order' CHECK (length(fail_action) BETWEEN 1 AND 20),
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id)
);
CREATE UNIQUE INDEX mt_insp_templates_name ON mt_insp_templates(company_id, name);

-- Its items: kind pass_fail | number | text; a number passes inside min and max. critical: a failure in a prestart sets the
-- asset out of service. Items are archived, never deleted, once results name them.
CREATE TABLE mt_insp_items (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (length(kind) BETWEEN 1 AND 20),
  unit TEXT NOT NULL DEFAULT '',
  min_value REAL,
  max_value REAL,
  required INTEGER NOT NULL DEFAULT 1 CHECK (required IN (0, 1)),
  critical INTEGER NOT NULL DEFAULT 0 CHECK (critical IN (0, 1)),
  archived_at INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (min_value IS NULL OR max_value IS NULL OR min_value <= max_value),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id)
);
CREATE INDEX mt_insp_items_template ON mt_insp_items(company_id, template_id, position);

-- The prestart checklist of an asset (side table: mt_assets is not changed).
CREATE TABLE mt_asset_prestart (
  company_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, asset_id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id)
);

-- ------------------------------------------------------------------ meters, gauges and prestarts

-- A meter (rising: hours, kilometres, cycles) or a gauge (any value: temperature, pressure, vibration) on an asset. A
-- rising meter refuses a lower reading unless it is marked as a reset; with a rollover value, a reset counts on past it.
-- last_seq orders the readings: each reading takes the next number, unique per meter, so two readings saved at the
-- same moment cannot both be the next one (one transaction fails whole).
CREATE TABLE mt_meters (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  rising INTEGER NOT NULL DEFAULT 1 CHECK (rising IN (0, 1)),
  rollover_value REAL CHECK (rollover_value IS NULL OR rollover_value > 0),
  expected_min REAL,
  expected_max REAL,
  last_seq INTEGER NOT NULL DEFAULT 0 CHECK (last_seq >= 0),
  last_value REAL,
  last_total REAL,
  last_read_at INTEGER,
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  CHECK (expected_min IS NULL OR expected_max IS NULL OR expected_min <= expected_max),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id)
);
CREATE INDEX mt_meters_asset ON mt_meters(company_id, asset_id);

-- A prestart check: a quick check of an asset before use. A failed critical item sets the asset out of service (the
-- status before is kept here and in the history) and a failure raises one request.
CREATE TABLE mt_prestarts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  result TEXT NOT NULL CHECK (length(result) BETWEEN 1 AND 20),
  failed_items INTEGER NOT NULL DEFAULT 0 CHECK (failed_items >= 0),
  critical_failed INTEGER NOT NULL DEFAULT 0 CHECK (critical_failed >= 0),
  status_before TEXT NOT NULL DEFAULT '',
  set_out_of_service INTEGER NOT NULL DEFAULT 0 CHECK (set_out_of_service IN (0, 1)),
  request_id TEXT,
  notes TEXT NOT NULL DEFAULT '',
  performed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  performed_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id),
  FOREIGN KEY (company_id, request_id) REFERENCES mt_requests(company_id, id)
);
CREATE INDEX mt_prestarts_asset ON mt_prestarts(company_id, asset_id, performed_at);

-- Readings of a meter or gauge. delta is the usage a rising meter's reading added (after a reset or a rollover it is
-- counted on from zero); total is the meter's life total, which meter-based preventive maintenance uses. source:
-- manual | work_order | prestart.
CREATE TABLE mt_readings (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  meter_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  seq INTEGER NOT NULL CHECK (seq > 0),
  value REAL NOT NULL,
  delta REAL,
  total REAL,
  reset INTEGER NOT NULL DEFAULT 0 CHECK (reset IN (0, 1)),
  out_of_range INTEGER NOT NULL DEFAULT 0 CHECK (out_of_range IN (0, 1)),
  source TEXT NOT NULL CHECK (length(source) BETWEEN 1 AND 20),
  work_order_id TEXT,
  prestart_id TEXT,
  note TEXT NOT NULL DEFAULT '',
  read_at INTEGER NOT NULL,
  entered_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, meter_id) REFERENCES mt_meters(company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, prestart_id) REFERENCES mt_prestarts(company_id, id)
);
CREATE UNIQUE INDEX mt_readings_seq ON mt_readings(company_id, meter_id, seq);
CREATE INDEX mt_readings_asset ON mt_readings(company_id, asset_id, read_at);

-- ------------------------------------------------------------------ preventive maintenance

-- A template for an asset class: it covers every asset of a category (in a site, when one is chosen) with a schedule of
-- its own. trigger_kind: time | meter | condition; interval_unit: day | week | month; basis: completion | fixed. A meter
-- or condition template names the meter each asset must have (meter_name).
CREATE TABLE mt_pm_templates (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_category TEXT NOT NULL COLLATE NOCASE,
  site_id TEXT,
  description TEXT NOT NULL DEFAULT '',
  trigger_kind TEXT NOT NULL CHECK (length(trigger_kind) BETWEEN 1 AND 20),
  interval_n INTEGER CHECK (interval_n IS NULL OR interval_n > 0),
  interval_unit TEXT,
  basis TEXT NOT NULL DEFAULT 'completion' CHECK (length(basis) BETWEEN 1 AND 20),
  meter_name TEXT NOT NULL DEFAULT '',
  meter_interval REAL CHECK (meter_interval IS NULL OR meter_interval > 0),
  cond_below REAL,
  cond_above REAL,
  start_date TEXT,
  job_type TEXT NOT NULL DEFAULT 'preventive',
  priority TEXT NOT NULL DEFAULT 'medium',
  tasks_json TEXT NOT NULL DEFAULT '[]',
  parts_json TEXT NOT NULL DEFAULT '[]',
  estimated_minutes INTEGER CHECK (estimated_minutes IS NULL OR estimated_minutes >= 0),
  lead_days INTEGER NOT NULL DEFAULT 0 CHECK (lead_days BETWEEN 0 AND 365),
  trade TEXT NOT NULL DEFAULT '',
  assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  inspection_template_id TEXT,
  instructions TEXT NOT NULL DEFAULT '',
  safety TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, site_id) REFERENCES mt_sites(company_id, id),
  FOREIGN KEY (company_id, inspection_template_id) REFERENCES mt_insp_templates(company_id, id)
);

-- A preventive maintenance schedule of one asset (made by hand, or by a template for each asset of its class). The
-- definition columns are the template's; the state columns say when it is next due.
CREATE TABLE mt_pm_schedules (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  template_id TEXT,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  trigger_kind TEXT NOT NULL CHECK (length(trigger_kind) BETWEEN 1 AND 20),
  interval_n INTEGER CHECK (interval_n IS NULL OR interval_n > 0),
  interval_unit TEXT,
  basis TEXT NOT NULL DEFAULT 'completion' CHECK (length(basis) BETWEEN 1 AND 20),
  meter_id TEXT,
  meter_interval REAL CHECK (meter_interval IS NULL OR meter_interval > 0),
  cond_below REAL,
  cond_above REAL,
  start_date TEXT,
  anchor_day INTEGER CHECK (anchor_day IS NULL OR anchor_day BETWEEN 1 AND 31),
  job_type TEXT NOT NULL DEFAULT 'preventive',
  priority TEXT NOT NULL DEFAULT 'medium',
  tasks_json TEXT NOT NULL DEFAULT '[]',
  parts_json TEXT NOT NULL DEFAULT '[]',
  estimated_minutes INTEGER CHECK (estimated_minutes IS NULL OR estimated_minutes >= 0),
  lead_days INTEGER NOT NULL DEFAULT 0 CHECK (lead_days BETWEEN 0 AND 365),
  trade TEXT NOT NULL DEFAULT '',
  assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  inspection_template_id TEXT,
  instructions TEXT NOT NULL DEFAULT '',
  safety TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  next_due_date TEXT,
  next_due_meter REAL,
  last_done_date TEXT,
  last_done_meter REAL,
  last_work_order_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_pm_templates(company_id, id),
  FOREIGN KEY (company_id, meter_id) REFERENCES mt_meters(company_id, id),
  FOREIGN KEY (company_id, inspection_template_id) REFERENCES mt_insp_templates(company_id, id)
);
CREATE INDEX mt_pm_schedules_asset ON mt_pm_schedules(company_id, asset_id);
CREATE INDEX mt_pm_schedules_due ON mt_pm_schedules(active, next_due_date);
CREATE INDEX mt_pm_schedules_meter ON mt_pm_schedules(company_id, meter_id);
CREATE UNIQUE INDEX mt_pm_schedules_template ON mt_pm_schedules(company_id, template_id, asset_id) WHERE template_id IS NOT NULL;

-- One row per due occurrence of a schedule, with the one work order made for it. occurrence_key (t:<due date>,
-- m:<due meter total>, c:<reading id>) is unique per schedule, and open_slot (1 while the work order is outstanding) is
-- unique per schedule: two generation runs at the same moment, or the cron and the button together, make one work
-- order, because the second transaction fails whole.
CREATE TABLE mt_pm_occurrences (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  schedule_id TEXT NOT NULL,
  occurrence_key TEXT NOT NULL,
  due_date TEXT NOT NULL,
  due_meter REAL,
  trigger_reading_id TEXT,
  work_order_id TEXT NOT NULL,
  open_slot INTEGER CHECK (open_slot IS NULL OR open_slot = 1),
  made_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  made_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, schedule_id, occurrence_key),
  FOREIGN KEY (company_id, schedule_id) REFERENCES mt_pm_schedules(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, trigger_reading_id) REFERENCES mt_readings(company_id, id)
);
CREATE UNIQUE INDEX mt_pm_occurrences_open ON mt_pm_occurrences(company_id, schedule_id) WHERE open_slot = 1;
CREATE UNIQUE INDEX mt_pm_occurrences_wo ON mt_pm_occurrences(company_id, work_order_id);
CREATE INDEX mt_pm_occurrences_due ON mt_pm_occurrences(company_id, due_date);

-- ------------------------------------------------------------------ inspections on work orders

-- An inspection template attached to a work order; status open | passed | failed once completed. A failed inspection
-- makes one follow-up (a corrective work order or a request).
CREATE TABLE mt_wo_inspections (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (length(status) BETWEEN 1 AND 20),
  completed_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  follow_up_work_order_id TEXT,
  follow_up_request_id TEXT,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  UNIQUE (company_id, work_order_id, template_id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, template_id) REFERENCES mt_insp_templates(company_id, id),
  FOREIGN KEY (company_id, follow_up_work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, follow_up_request_id) REFERENCES mt_requests(company_id, id)
);

-- The result of each item of an inspection or a prestart (exactly one), with the item's label, kind and limits as they
-- were, so a later change to the template never changes a recorded result.
CREATE TABLE mt_insp_results (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  inspection_id TEXT,
  prestart_id TEXT,
  item_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  kind TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  min_value REAL,
  max_value REAL,
  critical INTEGER NOT NULL DEFAULT 0 CHECK (critical IN (0, 1)),
  passed INTEGER CHECK (passed IS NULL OR passed IN (0, 1)),
  value_num REAL,
  value_text TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  recorded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  recorded_at INTEGER NOT NULL,
  CHECK ((inspection_id IS NULL) <> (prestart_id IS NULL)),
  FOREIGN KEY (company_id, inspection_id) REFERENCES mt_wo_inspections(company_id, id),
  FOREIGN KEY (company_id, prestart_id) REFERENCES mt_prestarts(company_id, id),
  FOREIGN KEY (company_id, item_id) REFERENCES mt_insp_items(company_id, id)
);
CREATE UNIQUE INDEX mt_insp_results_item ON mt_insp_results(inspection_id, item_id) WHERE inspection_id IS NOT NULL;
CREATE INDEX mt_insp_results_prestart ON mt_insp_results(prestart_id, position) WHERE prestart_id IS NOT NULL;

-- ------------------------------------------------------------------ parts from ERP Inventory

-- The ERP warehouses that are maintenance stores. Stock itself stays in ERP Inventory (erp_stock, erp_stock_moves).
CREATE TABLE mt_stores (
  company_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, warehouse_id),
  FOREIGN KEY (company_id, warehouse_id) REFERENCES erp_warehouses(company_id, id)
);

-- Net quantity of each product issued to a work order (issues less returns), changed in the same transaction as the
-- stock movement. The CHECK refuses returning more than was issued, also when two returns arrive together. The cost of
-- the parts is read from the movement ledger (erp_stock_moves, source_type work_order).
CREATE TABLE mt_wo_stock (
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  issued_qty REAL NOT NULL DEFAULT 0 CHECK (issued_qty >= -1e-9),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, work_order_id, product_id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id),
  FOREIGN KEY (company_id, product_id) REFERENCES erp_products(company_id, id)
);

-- ------------------------------------------------------------------ once-only keys

-- A key written in the same transaction as something that must happen once (a follow-up of a failed inspection, a
-- request from a prestart, a parts issue sent twice): a second transaction writing the same key fails whole.
CREATE TABLE mt_done (
  company_id TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, key)
);
