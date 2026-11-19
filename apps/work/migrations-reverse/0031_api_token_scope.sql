-- Reverse of migrations/0031_api_token_scope.sql (Stage 1, R4). Run only to take R4 back out, after a database copy.
-- Every token made limited to a company then acts as its person everywhere: revoke them first if that is not wanted.
DROP INDEX IF EXISTS api_tokens_user;
ALTER TABLE api_tokens DROP COLUMN company_id;
ALTER TABLE api_tokens DROP COLUMN apps_json;
ALTER TABLE api_tokens DROP COLUMN read_only;
ALTER TABLE api_tokens DROP COLUMN revoked_reason;
DELETE FROM d1_migrations WHERE name = '0031_api_token_scope.sql';
