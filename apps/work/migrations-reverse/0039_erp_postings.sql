-- Reverse of migrations/0039_erp_postings.sql. The journals, invoices and bills already made stay in Finance (reverse or
-- void them there if wanted) and their records in erp_integration_events stay; only the chosen posting accounts and the
-- remembered intercompany contacts are lost, the custom fields' definitions (their values stay in the records) and sign-in challenges waiting for a code, the price source
-- noted on sales order lines
-- (two-factor enrolments stay in user_mfa).
ALTER TABLE erp_so_lines DROP COLUMN price_note;
DROP INDEX IF EXISTS login_challenges_user;
DROP TABLE IF EXISTS login_challenges;
DROP TABLE IF EXISTS erp_custom_fields;
DROP TABLE IF EXISTS erp_ic_contacts;
DROP TABLE IF EXISTS erp_posting_accounts;
