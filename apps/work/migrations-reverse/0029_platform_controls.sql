-- Reverse of migrations/0029_platform_controls.sql (Stage 1, R2). Run only to take R2 back out, after a database copy.
-- The feature flags, their history, the rollout stages and the authenticator-app secrets are lost.
DROP TRIGGER IF EXISTS feature_flag_changes_no_update;
DROP TRIGGER IF EXISTS feature_flag_changes_no_delete;
DROP TABLE IF EXISTS feature_flag_changes;
DROP TABLE IF EXISTS feature_flags;
DROP TABLE IF EXISTS company_rollout;
DROP TABLE IF EXISTS user_mfa;
ALTER TABLE sessions DROP COLUMN mfa_at;
ALTER TABLE sessions DROP COLUMN reauth_at;
DELETE FROM d1_migrations WHERE name = '0029_platform_controls.sql';
