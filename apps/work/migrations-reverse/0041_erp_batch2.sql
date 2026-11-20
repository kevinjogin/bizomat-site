-- Reverse of migrations/0041_erp_batch2.sql. Run only after a database copy. What stays: the journals, invoices and bills
-- already made in Finance (reverse or void them there if wanted) and their records in erp_integration_events, the values
-- of custom fields (in the records), two-factor enrolments (user_mfa), and quotations entered through the portal (as if a
-- buyer had entered them). What is lost: the chosen posting accounts, the remembered intercompany contacts, the custom
-- fields' definitions, sign-in challenges waiting for a code, the price source noted on sales order lines, and the supplier
-- portal's people and acknowledgements.
ALTER TABLE erp_record_files DROP COLUMN source;
ALTER TABLE erp_quotations DROP COLUMN source;
DROP TABLE IF EXISTS erp_po_acknowledgements;
DROP INDEX IF EXISTS erp_supplier_portal_users_supplier;
DROP INDEX IF EXISTS erp_supplier_portal_users_user;
DROP TABLE IF EXISTS erp_supplier_portal_users;
ALTER TABLE erp_so_lines DROP COLUMN price_note;
DROP INDEX IF EXISTS login_challenges_user;
DROP TABLE IF EXISTS login_challenges;
DROP TABLE IF EXISTS erp_custom_fields;
DROP TABLE IF EXISTS erp_ic_contacts;
DROP TABLE IF EXISTS erp_posting_accounts;
