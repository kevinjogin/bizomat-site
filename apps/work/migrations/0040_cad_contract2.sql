-- CAD Automation in BIZOMAT ERP, contract 2 (owner's approval of 20 Nov 2026; docs/cad/README.md, "Contract 2").
-- Additive only.

-- Each download of a company's CAD export through an AI assistant's link, once (the engine's id for it): its entry in
-- the company's history is made from it, as a download from the ERP itself is. Never the file or the link.
CREATE TABLE cad_downloads (
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  download_id TEXT NOT NULL CHECK (length(download_id) BETWEEN 1 AND 64),
  export_id TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  size INTEGER NOT NULL DEFAULT 0,
  sha256 TEXT NOT NULL DEFAULT '',
  downloaded_at INTEGER NOT NULL,
  recorded_at INTEGER NOT NULL,
  PRIMARY KEY (company_id, download_id)
);
CREATE INDEX cad_downloads_when ON cad_downloads(company_id, downloaded_at);

-- The person asked to review a design document (5.6): the task is given to them where the board has a People column,
-- and they are told in either case.
ALTER TABLE cad_review_tasks ADD COLUMN reviewer_id TEXT REFERENCES users(id) ON DELETE SET NULL;
