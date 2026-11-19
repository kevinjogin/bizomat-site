-- Malware scanning of verification documents (owner, 19 Nov 2026; docs/platform/verification.md, "Malware scan").
-- Every document a company uploads for manual review is scanned with ClamAV before anyone may open or accept it. The
-- scanner runs on CAD Automation's Machine (2 GB; BIZOMAT's own Machines have 512 MB and ClamAV needs about 1 GB) and
-- asks for documents with CAD's BIZOMAT client credentials (src/worker/company/scan.ts); it hands out nothing until
-- the flag evidence_scanning is on.
--
-- scan_status: pending (waiting), scanning (handed out at scan_claimed_at), clean, infected (the file is deleted from
-- storage), failed (five attempts ended in an error). Documents uploaded before this migration start as pending.
ALTER TABLE company_evidence ADD COLUMN scan_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE company_evidence ADD COLUMN scan_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE company_evidence ADD COLUMN scan_claimed_at INTEGER;
ALTER TABLE company_evidence ADD COLUMN scanned_at INTEGER;
-- the signature found, or the scanner's error, and the engine and signature database that gave the verdict
ALTER TABLE company_evidence ADD COLUMN scan_detail TEXT;
ALTER TABLE company_evidence ADD COLUMN scan_engine TEXT;
CREATE INDEX company_evidence_scan ON company_evidence(scan_status, uploaded_at);
