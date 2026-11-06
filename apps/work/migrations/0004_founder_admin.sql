-- Founder admin dashboard: platform administrators, session analytics,
-- persistent activity events, daily activity and system-health metrics.
-- Additive only: no existing table is dropped or rewritten.

-- Platform-level administrators (distinct from workspace roles).
CREATE TABLE platform_admins (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('founder', 'admin')),
  granted_by TEXT,
  granted_at INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT ''
);

-- Fast per-user summaries.
ALTER TABLE users ADD COLUMN last_login_at INTEGER;
ALTER TABLE users ADD COLUMN last_active_at INTEGER;
ALTER TABLE users ADD COLUMN login_count INTEGER NOT NULL DEFAULT 0;

-- Session lifecycle (sessions are now retained as login history).
ALTER TABLE sessions ADD COLUMN last_activity_at INTEGER;  -- last heartbeat from an open, in-use tab
ALTER TABLE sessions ADD COLUMN ended_at INTEGER;
ALTER TABLE sessions ADD COLUMN end_reason TEXT;           -- logout | revoked | password_change | expired
CREATE INDEX idx_sessions_activity ON sessions(last_activity_at);
CREATE INDEX idx_sessions_created ON sessions(created_at);

-- Persistent product events (no passwords, message bodies or task descriptions).
CREATE TABLE user_activity_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  workspace_id TEXT,
  board_id TEXT,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_uae_created ON user_activity_events(created_at);
CREATE INDEX idx_uae_user ON user_activity_events(user_id, created_at);
CREATE INDEX idx_uae_type ON user_activity_events(event_type, created_at);
CREATE INDEX idx_uae_ws ON user_activity_events(workspace_id, created_at);
CREATE INDEX idx_uae_board ON user_activity_events(board_id, created_at);

-- One row per user per UTC day they were active (DAU / WAU / MAU history).
CREATE TABLE user_daily_activity (
  user_id TEXT NOT NULL,
  day TEXT NOT NULL,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  heartbeats INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);
CREATE INDEX idx_uda_day ON user_daily_activity(day);

-- Aggregated daily counters (anonymous page views, API errors, ...). No identifiers.
CREATE TABLE analytics_daily (
  day TEXT NOT NULL,
  metric TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric)
);

-- Sanitised server errors for the System Health page (no stack traces).
CREATE TABLE app_errors (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  method TEXT,
  route TEXT,
  status INTEGER,
  error_name TEXT,
  message TEXT
);
CREATE INDEX idx_errors_created ON app_errors(created_at);

CREATE TABLE system_kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- ---------------------------------------------------------------- backfill
-- Derived only from real existing records; flagged as backfilled.

UPDATE sessions SET last_activity_at = last_seen_at WHERE last_activity_at IS NULL;
UPDATE sessions SET ended_at = revoked_at, end_reason = 'revoked' WHERE revoked_at IS NOT NULL AND ended_at IS NULL;

UPDATE users SET
  last_login_at = (SELECT MAX(s.created_at) FROM sessions s WHERE s.user_id = users.id),
  last_active_at = (SELECT MAX(s.last_seen_at) FROM sessions s WHERE s.user_id = users.id),
  login_count = (SELECT COUNT(*) FROM sessions s WHERE s.user_id = users.id);
-- Users whose sessions were purged by the previous retention policy still logged in at least once (at sign-up).
UPDATE users SET login_count = 1, last_login_at = COALESCE(last_login_at, created_at) WHERE login_count = 0 AND password_hash IS NOT NULL;
UPDATE users SET last_active_at = MAX(COALESCE(last_active_at, 0), COALESCE((SELECT MAX(a.created_at) FROM activity_log a WHERE a.actor_id = users.id), 0), created_at);

INSERT INTO user_activity_events (id, user_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), id, 'user.registered', 'user', id, '{"backfilled":true}', created_at FROM users;
INSERT INTO user_activity_events (id, user_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), user_id, 'user.login', 'session', id, '{"backfilled":true}', created_at FROM sessions;
INSERT INTO user_activity_events (id, user_id, workspace_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), created_by, id, 'workspace.created', 'workspace', id, '{"backfilled":true}', created_at FROM workspaces;
INSERT INTO user_activity_events (id, user_id, workspace_id, board_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), created_by, workspace_id, id, 'project.created', 'board', id, '{"backfilled":true}', created_at FROM boards WHERE kind != 'template';
INSERT INTO user_activity_events (id, user_id, workspace_id, board_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), i.created_by, i.workspace_id, i.board_id, 'task.created', 'item', i.id, '{"backfilled":true}', i.created_at
  FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template';
INSERT INTO user_activity_events (id, user_id, workspace_id, board_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), NULL, i.workspace_id, i.board_id, 'task.completed', 'item', i.id, '{"backfilled":true}', i.completed_at
  FROM items i JOIN boards b ON b.id = i.board_id WHERE b.kind != 'template' AND i.completed_at IS NOT NULL;
INSERT INTO user_activity_events (id, user_id, workspace_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), m.user_id, m.workspace_id, 'member.joined', 'workspace', m.workspace_id, '{"backfilled":true}', m.joined_at
  FROM workspace_members m JOIN workspaces w ON w.id = m.workspace_id WHERE m.user_id != w.created_by;
INSERT INTO user_activity_events (id, user_id, workspace_id, event_type, entity_type, entity_id, metadata_json, created_at)
  SELECT 'bf-' || lower(hex(randomblob(10))), invited_by, workspace_id, 'member.invited', 'invitation', id, '{"backfilled":true}', created_at FROM invitations;

-- Daily activity from sign-ups, session starts/last-seen and real edits.
INSERT OR IGNORE INTO user_daily_activity (user_id, day, first_seen_at, last_seen_at, heartbeats)
  SELECT user_id, day, MIN(t), MAX(t), 0 FROM (
    SELECT id AS user_id, date(created_at / 1000, 'unixepoch') AS day, created_at AS t FROM users
    UNION ALL SELECT user_id, date(created_at / 1000, 'unixepoch'), created_at FROM sessions
    UNION ALL SELECT user_id, date(last_seen_at / 1000, 'unixepoch'), last_seen_at FROM sessions
    UNION ALL SELECT actor_id, date(created_at / 1000, 'unixepoch'), created_at FROM activity_log WHERE actor_id IS NOT NULL
  ) GROUP BY user_id, day;

INSERT INTO system_kv (key, value, updated_at) VALUES ('analytics_started_at', CAST(strftime('%s', 'now') * 1000 AS TEXT), strftime('%s', 'now') * 1000);

-- Founder access: bind to the account that ALREADY holds the founder email when
-- this migration runs (sign-up has no email verification, so a later sign-up
-- with this address does NOT gain admin rights). If the account does not exist
-- yet, nothing is granted; use the "Admin operations" workflow (grant-founder).
INSERT OR IGNORE INTO platform_admins (user_id, role, granted_by, granted_at, note)
  SELECT id, 'founder', 'migration-0004', strftime('%s', 'now') * 1000, 'Initial founder grant' FROM users WHERE email = 'kevin@kevos.com' COLLATE NOCASE;
