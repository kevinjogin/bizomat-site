-- BIZOMAT Stage 1, R2 (owner, 19 Nov 2026): the Admin Control Centre. Additive only: new tables, two nullable session
-- columns and append-only triggers on the new history table, no existing row or column changes.
--
-- Feature flags (src/worker/platform/flags.ts holds the registry: every flag, its kind, scopes, risk and default). A row
-- here overrides the default for one scope. A value is resolved from the most specific scope down: company, then the
-- company's rollout stage, then its country, then global, then the registry's default (off for every new feature).
-- Reverse: migrations-reverse/0029_platform_controls.sql (drops the four tables and the two session columns), tested by
-- test/platform-controls.test.ts.
CREATE TABLE feature_flags (
  key TEXT NOT NULL CHECK (length(key) BETWEEN 1 AND 80),
  scope TEXT NOT NULL CHECK (scope IN ('global', 'stage', 'country', 'company')),
  -- '' for global, 'internal' or 'pilot' for a stage, an ISO 3166-1 alpha-2 code for a country, a company id
  scope_id TEXT NOT NULL DEFAULT '' CHECK (length(scope_id) <= 64),
  value TEXT NOT NULL CHECK (length(value) BETWEEN 1 AND 64),
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  updated_by TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (key, scope, scope_id)
);

-- Every change, never edited or removed: who, when, the old and new value (NULL: the registry's default), and why.
CREATE TABLE feature_flag_changes (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  scope TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  reason TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  -- 'change', 'kill_switch' or 'reset'
  kind TEXT NOT NULL DEFAULT 'change' CHECK (kind IN ('change', 'kill_switch', 'reset')),
  ip TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX feature_flag_changes_key ON feature_flag_changes(key, created_at);
CREATE INDEX feature_flag_changes_time ON feature_flag_changes(created_at);
CREATE TRIGGER feature_flag_changes_no_update BEFORE UPDATE ON feature_flag_changes BEGIN SELECT RAISE(ABORT, 'feature flag history is append only'); END;
CREATE TRIGGER feature_flag_changes_no_delete BEFORE DELETE ON feature_flag_changes BEGIN SELECT RAISE(ABORT, 'feature flag history is append only'); END;

-- Rollout stages: a company marked internal (BIZOMAT's own test companies) or pilot gets the flags set for its stage
-- before everyone else. Companies without a row are in the general stage ("all").
CREATE TABLE company_rollout (
  company_id TEXT PRIMARY KEY CHECK (length(company_id) BETWEEN 1 AND 64),
  stage TEXT NOT NULL CHECK (stage IN ('internal', 'pilot')),
  reason TEXT NOT NULL CHECK (length(reason) BETWEEN 3 AND 500),
  updated_by TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Two-factor sign-in with an authenticator app (TOTP, RFC 6238). The secret is encrypted with the server's settings key
-- (the same key that protects the stored email settings), recovery codes are kept only as SHA-256 hashes.
CREATE TABLE user_mfa (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret_enc TEXT NOT NULL,
  confirmed_at INTEGER,
  -- the last 30-second step accepted, so a code is never accepted twice
  last_step INTEGER NOT NULL DEFAULT 0,
  recovery_json TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- When this session last proved the second factor, and when its person last confirmed their password and code for a
-- dangerous action (high-risk flags, the kill switch, platform admin grants).
ALTER TABLE sessions ADD COLUMN mfa_at INTEGER;
ALTER TABLE sessions ADD COLUMN reauth_at INTEGER;
