-- WorkOS initial schema.
-- Conventions:
--   * ids are TEXT (random, URL-safe)
--   * timestamps are INTEGER milliseconds since epoch (UTC)
--   * every workspace-owned table carries workspace_id for tenant isolation;
--     every query in the application filters on it.

PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT,              -- NULL for users that only use external providers
  avatar_key TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  locale TEXT NOT NULL DEFAULT 'en',
  theme TEXT NOT NULL DEFAULT 'system',
  preferences_json TEXT NOT NULL DEFAULT '{}',
  failed_logins INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER,
  disabled_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE user_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  email TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE (provider, provider_subject)
);
CREATE INDEX idx_identities_user ON user_identities(user_id);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  csrf_token TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'password',
  user_agent TEXT,
  ip TEXT,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

CREATE TABLE oauth_states (
  state TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  code_verifier TEXT NOT NULL,
  redirect_to TEXT,
  link_user_id TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE api_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  prefix TEXT NOT NULL,
  last_used_at INTEGER,
  expires_at INTEGER,
  revoked_at INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL
);

CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_key TEXT,
  color TEXT NOT NULL DEFAULT '#5b5bd6',
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER
);

CREATE TABLE workspace_members (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','member','viewer')),
  joined_at INTEGER NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);
CREATE INDEX idx_wm_user ON workspace_members(user_id);

CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','member','viewer')),
  token_hash TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  revoked_at INTEGER
);
CREATE INDEX idx_invites_ws ON invitations(workspace_id);
CREATE INDEX idx_invites_email ON invitations(email);

CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#0ea5e9',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_teams_ws ON teams(workspace_id);

CREATE TABLE team_members (
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);

CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'board' CHECK (kind IN ('board','personal','template')),
  visibility TEXT NOT NULL DEFAULT 'workspace' CHECK (visibility IN ('workspace','private')),
  icon TEXT NOT NULL DEFAULT 'grid',
  settings_json TEXT NOT NULL DEFAULT '{}',
  position REAL NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);
CREATE INDEX idx_boards_ws ON boards(workspace_id, archived_at);

CREATE TABLE board_members (
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','editor','viewer')),
  PRIMARY KEY (board_id, user_id)
);
CREATE INDEX idx_bm_user ON board_members(user_id);

CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#5b5bd6',
  position REAL NOT NULL,
  collapsed INTEGER NOT NULL DEFAULT 0,
  archived_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_groups_board ON groups(board_id, position);

CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  settings_json TEXT NOT NULL DEFAULT '{}',
  position REAL NOT NULL,
  width INTEGER NOT NULL DEFAULT 160,
  hidden INTEGER NOT NULL DEFAULT 0,
  required INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_columns_board ON columns(board_id, position);

CREATE TABLE items (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  parent_item_id TEXT REFERENCES items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  position REAL NOT NULL,
  values_json TEXT NOT NULL DEFAULT '{}',
  search_text TEXT NOT NULL DEFAULT '',
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  completed_at INTEGER,
  archived_at INTEGER
);
CREATE INDEX idx_items_board ON items(board_id, group_id, position);
CREATE INDEX idx_items_parent ON items(parent_item_id);
CREATE INDEX idx_items_ws ON items(workspace_id);

CREATE TABLE views (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  settings_json TEXT NOT NULL DEFAULT '{}',
  position REAL NOT NULL,
  owner_id TEXT,                    -- NULL = shared view, otherwise personal saved view
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_views_board ON views(board_id);

CREATE TABLE updates (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  parent_update_id TEXT REFERENCES updates(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  edited_at INTEGER,
  deleted_at INTEGER
);
CREATE INDEX idx_updates_item ON updates(item_id, created_at);

CREATE TABLE attachments (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT,
  item_id TEXT,
  document_id TEXT,
  update_id TEXT,
  scope TEXT NOT NULL CHECK (scope IN ('item','document','avatar','logo')),
  uploader_id TEXT NOT NULL REFERENCES users(id),
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER
);
CREATE INDEX idx_attach_item ON attachments(item_id);
CREATE INDEX idx_attach_doc ON attachments(document_id);
CREATE INDEX idx_attach_ws ON attachments(workspace_id);

CREATE TABLE activity_log (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT,
  item_id TEXT,
  actor_id TEXT,
  action TEXT NOT NULL,
  column_id TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_activity_item ON activity_log(item_id, created_at);
CREATE INDEX idx_activity_board ON activity_log(board_id, created_at);
CREATE INDEX idx_activity_ws ON activity_log(workspace_id, created_at);

CREATE TABLE favourites (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, entity_type, entity_id)
);

CREATE TABLE recents (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  visited_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, entity_type, entity_id)
);

CREATE TABLE saved_filters (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'search',
  query_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE dashboards (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  board_ids_json TEXT NOT NULL DEFAULT '[]',
  settings_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);
CREATE INDEX idx_dash_ws ON dashboards(workspace_id);

CREATE TABLE dashboard_widgets (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  dashboard_id TEXT NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  config_json TEXT NOT NULL DEFAULT '{}',
  position REAL NOT NULL,
  w INTEGER NOT NULL DEFAULT 1,
  h INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_widgets_dash ON dashboard_widgets(dashboard_id, position);

CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL DEFAULT '{"type":"doc","content":[]}',
  search_text TEXT NOT NULL DEFAULT '',
  board_id TEXT,
  item_id TEXT,
  visibility TEXT NOT NULL DEFAULT 'workspace' CHECK (visibility IN ('workspace','private')),
  version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  updated_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);
CREATE INDEX idx_docs_ws ON documents(workspace_id);

CREATE TABLE document_members (
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('editor','viewer')),
  PRIMARY KEY (document_id, user_id)
);

CREATE TABLE document_versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_docver_doc ON document_versions(document_id, version);

CREATE TABLE document_comments (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  parent_id TEXT,
  author_id TEXT NOT NULL,
  body TEXT NOT NULL,
  resolved_at INTEGER,
  created_at INTEGER NOT NULL,
  deleted_at INTEGER
);
CREATE INDEX idx_doccom_doc ON document_comments(document_id);

CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_goal_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  owner_id TEXT,
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track','at_risk','off_track','achieved','cancelled')),
  progress_mode TEXT NOT NULL DEFAULT 'manual' CHECK (progress_mode IN ('manual','boards')),
  start_value REAL NOT NULL DEFAULT 0,
  target_value REAL NOT NULL DEFAULT 100,
  current_value REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '%',
  start_date TEXT,
  due_date TEXT,
  board_ids_json TEXT NOT NULL DEFAULT '[]',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  archived_at INTEGER
);
CREATE INDEX idx_goals_ws ON goals(workspace_id);

CREATE TABLE automations (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  trigger_json TEXT NOT NULL,
  conditions_json TEXT NOT NULL DEFAULT '{"op":"and","rules":[]}',
  actions_json TEXT NOT NULL,
  state_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_run_at INTEGER,
  run_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_auto_board ON automations(board_id, enabled);

CREATE TABLE automation_runs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  automation_id TEXT NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL,
  item_id TEXT,
  event_key TEXT NOT NULL UNIQUE,     -- duplicate-prevention key
  event_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running','succeeded','failed','skipped')),
  attempts INTEGER NOT NULL DEFAULT 1,
  depth INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  result_json TEXT,
  started_at INTEGER NOT NULL,
  finished_at INTEGER,
  next_retry_at INTEGER
);
CREATE INDEX idx_runs_auto ON automation_runs(automation_id, started_at);
CREATE INDEX idx_runs_retry ON automation_runs(status, next_retry_at);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  entity_type TEXT,
  entity_id TEXT,
  link TEXT,
  actor_id TEXT,
  dedupe_key TEXT UNIQUE,
  read_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_notif_user ON notifications(user_id, read_at, created_at);

CREATE TABLE notification_preferences (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  in_app INTEGER NOT NULL DEFAULT 1,
  email INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, type)
);

CREATE TABLE time_entries (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  board_id TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  duration_seconds INTEGER,
  note TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_time_item ON time_entries(item_id);
CREATE INDEX idx_time_user ON time_entries(user_id, ended_at);

CREATE TABLE planner_entries (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  day TEXT NOT NULL,                  -- YYYY-MM-DD
  position REAL NOT NULL DEFAULT 0,
  done INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  UNIQUE (user_id, item_id, day)
);
CREATE INDEX idx_planner_user_day ON planner_entries(user_id, day);

CREATE TABLE integrations (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  board_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','connected','error','disabled')),
  config_json TEXT NOT NULL DEFAULT '{}',
  secret TEXT,                         -- signing secret / webhook URL (never returned to clients)
  events_json TEXT NOT NULL DEFAULT '[]',
  last_status TEXT,
  last_error TEXT,
  last_delivery_at INTEGER,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_integrations_ws ON integrations(workspace_id);

CREATE TABLE integration_deliveries (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  integration_id TEXT NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  status_code INTEGER,
  ok INTEGER NOT NULL,
  error TEXT,
  duration_ms INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_deliveries_int ON integration_deliveries(integration_id, created_at);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  actor_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  ip TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_audit_ws ON audit_log(workspace_id, created_at);
