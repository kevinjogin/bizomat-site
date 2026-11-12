-- Project controls (owner's assignment, 12 Nov 2026): permanent task keys, scheduling data, typed dependencies,
-- working calendars, approved baselines, and dated progress and cost records for earned value. Additive only:
-- new columns default to NULL or a fixed value, new tables start empty; nothing is dropped or rewritten.

-- Permanent task keys (LASER-0001). The prefix belongs to the project; task_seq only ever increases, so a key is
-- never reused, even after its task is deleted. A key never changes when its task is renamed or moved.
ALTER TABLE boards ADD COLUMN task_prefix TEXT;
ALTER TABLE boards ADD COLUMN task_seq INTEGER NOT NULL DEFAULT 0;
ALTER TABLE items ADD COLUMN task_number INTEGER;
ALTER TABLE items ADD COLUMN task_key TEXT;
CREATE UNIQUE INDEX idx_items_task_key ON items(workspace_id, task_key) WHERE task_key IS NOT NULL;
CREATE INDEX idx_items_task_number ON items(board_id, task_number);

-- Scheduling data of a task beyond its planned dates (which stay in the board's timeline column).
CREATE TABLE task_schedules (
  item_id TEXT PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  duration_minutes INTEGER,
  duration_unit TEXT NOT NULL DEFAULT 'days',
  remaining_minutes INTEGER,
  milestone INTEGER NOT NULL DEFAULT 0,
  constraint_type TEXT NOT NULL DEFAULT 'ASAP',
  constraint_date TEXT,
  actual_start TEXT,
  actual_finish TEXT,
  percent_complete REAL,
  physical_percent REAL,
  scheduling_type TEXT NOT NULL DEFAULT 'fixed_duration',
  work_minutes INTEGER,
  units REAL,
  earning_method TEXT,
  earning_json TEXT NOT NULL DEFAULT '{}',
  pv_profile TEXT,
  pv_json TEXT NOT NULL DEFAULT '{}',
  updated_by TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_task_schedules_board ON task_schedules(board_id);

-- Dependencies between tasks of the same project, by their permanent ids (never by row position).
CREATE TABLE task_links (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  predecessor_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  successor_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'FS' CHECK (type IN ('FS', 'SS', 'FF', 'SF')),
  lag_minutes INTEGER NOT NULL DEFAULT 0,
  lag_unit TEXT NOT NULL DEFAULT 'days',
  created_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  CHECK (predecessor_id <> successor_id),
  UNIQUE (predecessor_id, successor_id)
);
CREATE INDEX idx_task_links_board ON task_links(board_id);
CREATE INDEX idx_task_links_successor ON task_links(successor_id);

-- Working calendars: the organisation's default (board_id NULL) and a project's own.
CREATE TABLE project_calendars (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  board_id TEXT REFERENCES boards(id) ON DELETE CASCADE,
  definition_json TEXT NOT NULL,
  updated_by TEXT,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX idx_project_calendars_scope ON project_calendars(workspace_id, COALESCE(board_id, ''));

-- Approved baselines: frozen copies of the plan. Numbered per project from 0 (the original). Insert-only, like
-- audit_events: no route updates or deletes them (test/project-controls.test.ts checks it). Not database triggers:
-- the data move to Cloudflare (scripts/migrate/to-cloudflare.mjs) copies plain rows and refuses schemas with triggers.
CREATE TABLE project_baselines (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  number INTEGER NOT NULL,
  name TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL DEFAULT '',
  approved_by TEXT NOT NULL,
  approved_on TEXT NOT NULL,
  previous_baseline_id TEXT REFERENCES project_baselines(id),
  project_start TEXT,
  project_finish TEXT,
  currency TEXT,
  bac TEXT,
  calendar_json TEXT NOT NULL,
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE (board_id, number)
);

-- A baseline keeps its tasks even when they are deleted from the plan later (no foreign key to items).
CREATE TABLE baseline_tasks (
  baseline_id TEXT NOT NULL REFERENCES project_baselines(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  task_key TEXT,
  wbs TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  planned_start TEXT,
  planned_finish TEXT,
  duration_minutes INTEGER,
  work_minutes INTEGER,
  owners_json TEXT NOT NULL DEFAULT '[]',
  planned_cost TEXT,
  pv_profile TEXT NOT NULL DEFAULT 'linear',
  pv_json TEXT NOT NULL DEFAULT '{}',
  earning_method TEXT NOT NULL DEFAULT 'percent_complete',
  milestone INTEGER NOT NULL DEFAULT 0,
  summary INTEGER NOT NULL DEFAULT 0,
  predecessors_json TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (baseline_id, item_id)
);

-- Progress as recorded on a date (history, for earned value at any past status date).
CREATE TABLE task_progress_entries (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  as_of TEXT NOT NULL,
  percent_complete REAL,
  physical_percent REAL,
  units_done REAL,
  milestones_json TEXT,
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_task_progress_item ON task_progress_entries(item_id, as_of);
CREATE INDEX idx_task_progress_board ON task_progress_entries(board_id, as_of);

-- Actual cost as spent on a date (time-phased actual cost). Amounts are exact decimal text.
CREATE TABLE task_cost_entries (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  spent_on TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_task_costs_board ON task_cost_entries(board_id, spent_on);
CREATE INDEX idx_task_costs_item ON task_cost_entries(item_id, spent_on);
