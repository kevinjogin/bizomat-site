-- Reverse of migrations/0039_erp_postings.sql. The journals, invoices and bills already made stay in Finance (reverse or
-- void them there if wanted) and their records in erp_integration_events stay; only the chosen posting accounts and the
-- remembered intercompany contacts are lost.
DROP TABLE IF EXISTS erp_ic_contacts;
DROP TABLE IF EXISTS erp_posting_accounts;
