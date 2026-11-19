-- Reverse of migrations/0033_verification.sql (Stage 1, R6). Run only to take R6 back out, after a database copy. Every
-- verification record, status history, uploaded document record and join request is lost (the uploaded files stay in
-- storage under evidence/ until removed).
DROP TABLE IF EXISTS company_join_requests;
DROP TABLE IF EXISTS company_evidence;
DROP TABLE IF EXISTS company_registry_providers;
DROP TRIGGER IF EXISTS company_verification_history_no_update;
DROP TRIGGER IF EXISTS company_verification_history_no_delete;
DROP TABLE IF EXISTS company_verification_history;
DROP TABLE IF EXISTS company_verifications;
DELETE FROM d1_migrations WHERE name = '0033_verification.sql';
