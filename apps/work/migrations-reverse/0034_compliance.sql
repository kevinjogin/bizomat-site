-- Reverse of migrations/0034_compliance.sql (Stage 1, R7). Run only to take R7 back out, after a database copy. Every
-- compliance record, legal review, deletion batch report, export record and password reset link is lost (built exports
-- stay in storage under exports/ until removed), and the audit log is no longer protected by triggers.
DROP TRIGGER IF EXISTS audit_log_no_update;
DROP TRIGGER IF EXISTS audit_log_no_delete;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS data_exports;
DROP TABLE IF EXISTS deletion_batches;
DROP TABLE IF EXISTS legal_reviews;
DROP TABLE IF EXISTS compliance_extensions;
DROP TABLE IF EXISTS compliance_accounts;
DROP TABLE IF EXISTS compliance_notifications;
DROP TABLE IF EXISTS compliance_recipient_lists;
DROP TABLE IF EXISTS compliance_exemptions;
DELETE FROM d1_migrations WHERE name = '0034_compliance.sql';
