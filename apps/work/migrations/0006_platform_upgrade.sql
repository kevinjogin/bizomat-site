-- Platform upgrade (12 Nov 2026): organisation roles and membership status, project and task permissions, finance
-- settings, a permanent audit trail, the email outbox (Brevo) and project reports.
--
-- Safety rules for this file:
--   * Additive. No user data is dropped or changed. Existing amounts, column values and history stay byte for byte.
--   * Two tables are rebuilt only to widen a CHECK constraint (SQLite cannot alter one): workspace_members (adds the
--     roles project_manager and guest, and a status) and invitations (the same roles, plus resend and grant fields).
--     Every row is copied with every column; no other table references either one, so no foreign key moves.
--   * The previous Worker version keeps working on this schema: it never writes the new roles, and the new columns
--     have defaults.

-- ------------------------------------------------------------------ organisation membership

CREATE TABLE workspace_members_v2 (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','project_manager','member','viewer','guest')),
  joined_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  suspended_at INTEGER,
  suspended_by TEXT,
  invited_by TEXT,
  PRIMARY KEY (workspace_id, user_id)
);
INSERT INTO workspace_members_v2 (workspace_id, user_id, role, joined_at)
  SELECT workspace_id, user_id, role, joined_at FROM workspace_members;
DROP TABLE workspace_members;
ALTER TABLE workspace_members_v2 RENAME TO workspace_members;
CREATE INDEX idx_wm_user ON workspace_members(user_id);

CREATE TABLE invitations_v2 (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('admin','project_manager','member','viewer','guest')),
  token_hash TEXT NOT NULL UNIQUE,
  invited_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  accepted_at INTEGER,
  revoked_at INTEGER,
  -- added 12 Nov 2026
  accepted_by TEXT,
  revoked_by TEXT,
  last_sent_at INTEGER,
  send_count INTEGER NOT NULL DEFAULT 0,
  -- Project or task access given on acceptance: [{"kind":"board","id":"..","level":"view"}, {"kind":"item",..}]
  grants_json TEXT NOT NULL DEFAULT '[]',
  message TEXT NOT NULL DEFAULT ''
);
INSERT INTO invitations_v2 (id, workspace_id, email, role, token_hash, invited_by, created_at, expires_at, accepted_at, revoked_at)
  SELECT id, workspace_id, email, role, token_hash, invited_by, created_at, expires_at, accepted_at, revoked_at FROM invitations;
DROP TABLE invitations;
ALTER TABLE invitations_v2 RENAME TO invitations;
CREATE INDEX idx_invites_ws ON invitations(workspace_id);
CREATE INDEX idx_invites_email ON invitations(email);

-- ------------------------------------------------------------------ finance settings

-- NULL until an administrator chooses it: existing amounts are never assumed to be in any currency.
ALTER TABLE workspaces ADD COLUMN default_currency TEXT;
-- Project (board) details used by reports and finance. currency NULL = inherit the organisation's.
ALTER TABLE boards ADD COLUMN currency TEXT;
ALTER TABLE boards ADD COLUMN start_date TEXT;
ALTER TABLE boards ADD COLUMN manager_id TEXT;

-- ------------------------------------------------------------------ project permissions

-- Per person, per project: an explicit "no access" and capability overrides. NULL = the default for the person's
-- access level (board_members role, else the organisation role). Organisation owners and admins are never denied.
CREATE TABLE board_permissions (
  board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  denied INTEGER NOT NULL DEFAULT 0,
  view_finance INTEGER,
  edit_finance INTEGER,
  manage_members INTEGER,
  create_tasks INTEGER,
  assign_tasks INTEGER,
  delete_tasks INTEGER,
  generate_reports INTEGER,
  updated_by TEXT,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (board_id, user_id)
);
CREATE INDEX idx_board_perm_user ON board_permissions(user_id, workspace_id);

-- ------------------------------------------------------------------ task permissions

-- Access to one task (and its subitems) without access to the rest of the project.
CREATE TABLE item_permissions (
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  can_edit INTEGER NOT NULL DEFAULT 0,
  can_update_status INTEGER NOT NULL DEFAULT 1,
  can_comment INTEGER NOT NULL DEFAULT 1,
  can_upload INTEGER NOT NULL DEFAULT 0,
  can_manage_assignments INTEGER NOT NULL DEFAULT 0,
  can_view_finance INTEGER NOT NULL DEFAULT 0,
  granted_by TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (item_id, user_id)
);
CREATE INDEX idx_item_perm_user ON item_permissions(user_id, workspace_id);
CREATE INDEX idx_item_perm_board ON item_permissions(board_id);

-- ------------------------------------------------------------------ permanent audit trail

-- Append-only: the application only ever inserts here (no route updates or deletes a row). No foreign keys, so the
-- record outlives the project, task or person it describes.
CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  board_id TEXT,
  item_id TEXT,
  actor_id TEXT,
  event_type TEXT NOT NULL,
  before_json TEXT,
  after_json TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_ae_ws ON audit_events(workspace_id, created_at);
CREATE INDEX idx_ae_board ON audit_events(board_id, created_at);
CREATE INDEX idx_ae_item ON audit_events(item_id, created_at);
CREATE INDEX idx_ae_type ON audit_events(event_type, created_at);

-- ------------------------------------------------------------------ email (Brevo)

CREATE TABLE email_outbox (
  id TEXT PRIMARY KEY,
  workspace_id TEXT,
  user_id TEXT,
  to_email TEXT NOT NULL COLLATE NOCASE,
  to_name TEXT NOT NULL DEFAULT '',
  template TEXT NOT NULL,
  -- 0 = critical (invitations, security), 1 = normal notifications
  priority INTEGER NOT NULL DEFAULT 1,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT NOT NULL,
  -- 1 = the body holds a secret link (an invitation): it is cleared once the message has been handed over or given up
  sensitive INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('queued','sending','sent','delivered','deferred','failed','bounced','blocked','suppressed','skipped')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL,
  provider TEXT,
  provider_message_id TEXT,
  last_error TEXT,
  last_event TEXT,
  last_event_at INTEGER,
  created_at INTEGER NOT NULL,
  sent_at INTEGER,
  updated_at INTEGER NOT NULL
);
CREATE INDEX idx_outbox_due ON email_outbox(status, priority, next_attempt_at);
CREATE INDEX idx_outbox_ws ON email_outbox(workspace_id, created_at);
CREATE INDEX idx_outbox_msg ON email_outbox(provider_message_id);
CREATE INDEX idx_outbox_sent ON email_outbox(sent_at);

CREATE TABLE email_events (
  id TEXT PRIMARY KEY,
  outbox_id TEXT,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  event TEXT NOT NULL,
  reason TEXT,
  occurred_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_email_events_outbox ON email_events(outbox_id, created_at);

-- Addresses that hard-bounced, were blocked or complained: nothing more is sent to them until an admin clears it.
CREATE TABLE email_suppressions (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  reason TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- ------------------------------------------------------------------ project reports

-- A finalised report never changes: its snapshot and every exported file are stored at generation time.
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  board_id TEXT NOT NULL,
  board_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  version INTEGER NOT NULL,
  sections_json TEXT NOT NULL,
  options_json TEXT NOT NULL,
  includes_finance INTEGER NOT NULL DEFAULT 0,
  snapshot_key TEXT NOT NULL,
  snapshot_sha256 TEXT NOT NULL,
  files_json TEXT NOT NULL DEFAULT '{}',
  history_from INTEGER,
  generated_by TEXT NOT NULL,
  generated_at INTEGER NOT NULL,
  UNIQUE (board_id, version)
);
CREATE INDEX idx_reports_board ON reports(board_id, generated_at);
CREATE INDEX idx_reports_ws ON reports(workspace_id, generated_at);
