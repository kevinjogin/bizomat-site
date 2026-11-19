-- Stage 1, R4: API tokens limited to one company (audit E3 and S5; docs/platform/company-context.md). Reverse:
-- migrations-reverse/0031_api_token_scope.sql.
--
-- company_id: the one company a token may use (NULL: a token made before R4, acting as its person everywhere).
-- apps_json: the applications it may use within that company (NULL: all of them).
-- read_only: 1 when it may only read.
-- revoked_reason: why it was revoked (the person, a password change, a security reset, an administrator).
ALTER TABLE api_tokens ADD COLUMN company_id TEXT;
ALTER TABLE api_tokens ADD COLUMN apps_json TEXT;
ALTER TABLE api_tokens ADD COLUMN read_only INTEGER NOT NULL DEFAULT 0;
ALTER TABLE api_tokens ADD COLUMN revoked_reason TEXT;
CREATE INDEX api_tokens_user ON api_tokens(user_id, revoked_at);
