-- Reverse of migrations/0035_evidence_scan.sql. Run only to take the malware scan back out, after a database copy:
-- the scan verdicts are lost (documents deleted as infected stay deleted).
DROP INDEX IF EXISTS company_evidence_scan;
ALTER TABLE company_evidence DROP COLUMN scan_engine;
ALTER TABLE company_evidence DROP COLUMN scan_detail;
ALTER TABLE company_evidence DROP COLUMN scanned_at;
ALTER TABLE company_evidence DROP COLUMN scan_claimed_at;
ALTER TABLE company_evidence DROP COLUMN scan_attempts;
ALTER TABLE company_evidence DROP COLUMN scan_status;
DELETE FROM d1_migrations WHERE name = '0035_evidence_scan.sql';
