-- BIZOMAT ERP: Asset Management and Maintenance, Stage 1 (owner, 14 Nov 2026). Served at bizomat.ai/erp by this app,
-- with the same accounts, session, database and file store (src/worker/maintenance). Additive: new mt_* tables and
-- indexes only; no existing table, column or row is changed.
--
-- Stage 1 is the asset register (with its hierarchy), maintenance requests and standard work orders (tasks, parts
-- lines, labour time, notes, photos and documents), maintenance roles per company and a history of every change.
-- Preventive maintenance, readings, inspections, prestarts, stores and the rest are later stages: no tables for them.
--
-- Companies. company_id on every row is the id of an ERP company: a registered company (co_companies) or a person's
-- own company (sys_companies). It has no foreign key because it can name either table; every route resolves the
-- caller's access to that company first (src/worker/maintenance/access.ts) and filters every query on it, so one company
-- never sees another's rows. Rows inside a company point at each other with (company_id, id) keys, so a record can
-- never link to another company's asset, request or work order, even by mistake.
--
-- Links point one way only (parents first), as the data tooling needs (scripts/migrate/lib/d1-sql.mjs): assets, then
-- work orders (which name an asset), then requests (which name an asset and the work order made from them).

-- Per company: whether new requests wait for a supervisor's or administrator's approval (the one approval rule).
CREATE TABLE mt_settings (
  company_id TEXT PRIMARY KEY,
  require_approval INTEGER NOT NULL DEFAULT 1 CHECK (require_approval IN (0, 1)),
  updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  updated_at INTEGER NOT NULL
);

-- Maintenance roles chosen by an administrator. Without a row the default applies: a registered company's owner and
-- administrators are maintenance administrators and its other members requesters; a person's own company's owner is
-- its administrator. The owner of a registered company is always an administrator.
CREATE TABLE mt_roles (
  company_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','supervisor','technician','requester')),
  set_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  set_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, user_id)
);

-- The last number given out per company and kind: assets A-0001, requests MR-0001, work orders WO-00001.
CREATE TABLE mt_counters (
  company_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('asset','request','work_order')),
  value INTEGER NOT NULL,
  PRIMARY KEY (company_id, kind)
);

-- The asset register. An asset may sit under another asset of the same company (parent_id), to any depth; the
-- server refuses a parent that would make a loop. Costs are whole cents. specs_json: [{"key": "...", "value": "..."}].
CREATE TABLE mt_assets (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  manufacturer TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  serial_number TEXT NOT NULL DEFAULT '',
  registration_number TEXT NOT NULL DEFAULT '',
  purchase_date TEXT,
  commissioning_date TEXT,
  warranty_until TEXT,
  supplier TEXT NOT NULL DEFAULT '',
  purchase_cost_cents INTEGER CHECK (purchase_cost_cents IS NULL OR purchase_cost_cents >= 0),
  replacement_cost_cents INTEGER CHECK (replacement_cost_cents IS NULL OR replacement_cost_cents >= 0),
  location TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  -- a department of the registered company (co_departments), when one is chosen
  department_id TEXT REFERENCES co_departments(id) ON DELETE SET NULL,
  responsible_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  criticality TEXT NOT NULL DEFAULT 'medium' CHECK (criticality IN ('low','medium','high','critical')),
  status TEXT NOT NULL DEFAULT 'operating' CHECK (status IN ('operating','standby','under_maintenance','out_of_service','disposed')),
  strategy TEXT NOT NULL DEFAULT 'run_to_failure' CHECK (strategy IN ('run_to_failure','preventive','condition_based','predictive')),
  specs_json TEXT NOT NULL DEFAULT '[]',
  parent_id TEXT,
  -- lower-cased number, name, manufacturer, model, serial and location, for search
  search TEXT NOT NULL DEFAULT '',
  archived_at INTEGER,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, parent_id) REFERENCES mt_assets(company_id, id)
);
CREATE UNIQUE INDEX mt_assets_number ON mt_assets(company_id, number);
CREATE INDEX mt_assets_parent ON mt_assets(company_id, parent_id);
CREATE INDEX mt_assets_serial ON mt_assets(company_id, serial_number COLLATE NOCASE) WHERE serial_number <> '';

-- Standard work orders. A completed, closed or cancelled work order is locked: the server refuses changes until a
-- supervisor or administrator reopens it with a reason (recorded in mt_events).
CREATE TABLE mt_work_orders (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  asset_id TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'corrective' CHECK (job_type IN ('corrective','preventive','breakdown','inspection','emergency_repair','electrical','mechanical','calibration','planned_shutdown','general')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','assigned','in_progress','on_hold','completed','closed','cancelled')),
  department TEXT NOT NULL DEFAULT '',
  department_id TEXT REFERENCES co_departments(id) ON DELETE SET NULL,
  trade TEXT NOT NULL DEFAULT '',
  assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  contractor TEXT NOT NULL DEFAULT '',
  due_start TEXT,
  due_finish TEXT,
  estimated_minutes INTEGER CHECK (estimated_minutes IS NULL OR estimated_minutes >= 0),
  instructions TEXT NOT NULL DEFAULT '',
  safety TEXT NOT NULL DEFAULT '',
  project_ref TEXT NOT NULL DEFAULT '',
  customer_ref TEXT NOT NULL DEFAULT '',
  completion_notes TEXT NOT NULL DEFAULT '',
  completed_at INTEGER,
  completed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  closed_at INTEGER,
  cancelled_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id)
);
CREATE UNIQUE INDEX mt_work_orders_number ON mt_work_orders(company_id, number);
CREATE INDEX mt_work_orders_asset ON mt_work_orders(company_id, asset_id, status);
CREATE INDEX mt_work_orders_status ON mt_work_orders(company_id, status, due_finish);
CREATE INDEX mt_work_orders_assignee ON mt_work_orders(company_id, assigned_to, status);

-- Maintenance requests: anyone in the company may raise one. A request becomes (or joins) at most one work order.
CREATE TABLE mt_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  number TEXT NOT NULL COLLATE NOCASE,
  description TEXT NOT NULL,
  asset_id TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  department TEXT NOT NULL DEFAULT '',
  department_id TEXT REFERENCES co_departments(id) ON DELETE SET NULL,
  location TEXT NOT NULL DEFAULT '',
  -- the requested-by date: when the requester needs it done (YYYY-MM-DD)
  needed_by TEXT,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('submitted','awaiting_approval','approved','declined','info_requested','converted','completed','closed')),
  requested_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  decided_at INTEGER,
  decision_note TEXT NOT NULL DEFAULT '',
  work_order_id TEXT,
  completed_at INTEGER,
  closed_at INTEGER,
  search TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE (company_id, id),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id)
);
CREATE UNIQUE INDEX mt_requests_number ON mt_requests(company_id, number);
CREATE INDEX mt_requests_status ON mt_requests(company_id, status, created_at);
CREATE INDEX mt_requests_requester ON mt_requests(company_id, requested_by, created_at);
CREATE INDEX mt_requests_asset ON mt_requests(company_id, asset_id);
CREATE INDEX mt_requests_work_order ON mt_requests(company_id, work_order_id);

-- A work order's checklist: who ticked each task and when.
CREATE TABLE mt_wo_tasks (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  done_at INTEGER,
  done_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id) ON DELETE CASCADE
);
CREATE INDEX mt_wo_tasks_wo ON mt_wo_tasks(work_order_id, position);

-- Required parts as text lines (issuing from stores is a later stage).
CREATE TABLE mt_wo_parts (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  part TEXT NOT NULL,
  quantity REAL NOT NULL CHECK (quantity > 0),
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id) ON DELETE CASCADE
);
CREATE INDEX mt_wo_parts_wo ON mt_wo_parts(work_order_id, position);

-- Labour: each person's actual time on a work order, from the start/stop timer. One running timer (ended_at NULL) per
-- person per work order; minutes are worked out when it stops.
CREATE TABLE mt_labour (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  work_order_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  minutes INTEGER CHECK (minutes IS NULL OR minutes >= 0),
  created_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id) ON DELETE CASCADE
);
CREATE INDEX mt_labour_wo ON mt_labour(work_order_id, started_at);
CREATE UNIQUE INDEX mt_labour_running ON mt_labour(work_order_id, user_id) WHERE ended_at IS NULL;

-- Notes and comments on a request or a work order (exactly one).
CREATE TABLE mt_comments (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  request_id TEXT,
  work_order_id TEXT,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  CHECK ((request_id IS NULL) <> (work_order_id IS NULL)),
  FOREIGN KEY (company_id, request_id) REFERENCES mt_requests(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id)
);
CREATE INDEX mt_comments_request ON mt_comments(request_id, created_at);
CREATE INDEX mt_comments_wo ON mt_comments(work_order_id, created_at);

-- Photos and documents of an asset, a request or a work order (exactly one), kept in the app's file store (FILES).
CREATE TABLE mt_files (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  asset_id TEXT,
  request_id TEXT,
  work_order_id TEXT,
  name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER,
  CHECK ((asset_id IS NOT NULL) + (request_id IS NOT NULL) + (work_order_id IS NOT NULL) = 1),
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, request_id) REFERENCES mt_requests(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id)
);
CREATE INDEX mt_files_asset ON mt_files(asset_id, created_at);
CREATE INDEX mt_files_request ON mt_files(request_id, created_at);
CREATE INDEX mt_files_wo ON mt_files(work_order_id, created_at);

-- Every create, change and decision: who, what, when, and the values before and after where useful. Never file
-- contents. The history of an asset, request or work order is read from here.
CREATE TABLE mt_events (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  asset_id TEXT,
  request_id TEXT,
  work_order_id TEXT,
  summary TEXT NOT NULL DEFAULT '',
  before_json TEXT,
  after_json TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (company_id, asset_id) REFERENCES mt_assets(company_id, id),
  FOREIGN KEY (company_id, request_id) REFERENCES mt_requests(company_id, id),
  FOREIGN KEY (company_id, work_order_id) REFERENCES mt_work_orders(company_id, id)
);
CREATE INDEX mt_events_company ON mt_events(company_id, created_at);
CREATE INDEX mt_events_asset ON mt_events(company_id, asset_id, created_at);
CREATE INDEX mt_events_request ON mt_events(company_id, request_id, created_at);
CREATE INDEX mt_events_wo ON mt_events(company_id, work_order_id, created_at);
