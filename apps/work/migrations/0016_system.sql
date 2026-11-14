-- BIZOMAT System (owner, 14 Nov 2026): one place for every tool a person uses (Project Management, the CRM, Finance and
-- CAD Automation), organised by company. Additive: two new tables, nothing else changes.
--
-- Every person has a company in the System. A registered company (co_companies, with its verified details) is used as
-- it is. Every person also gets a company of their own, in their own name and not registered (sys_companies): it holds
-- the tools they own that no registered company runs. Its tools are worked out when asked (owned tools minus tools a
-- registered company runs), so new and transferred tools are always in the right place and nothing is copied.
-- Registering a company with real details stays the job of /company: these rows never carry invented details.

CREATE TABLE sys_companies (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  -- how it was made: 'backfill' (the maintenance run or the super admin, for existing accounts) or 'visit' (the
  -- person's first visit to the System)
  created_via TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- What CAD Automation reports about each of its accounts (the computers, recent jobs and connected AI assistants), sent
-- by CAD Automation's server with its BIZOMAT client credentials (POST /api/id/cad-status). One row per CAD account
-- email; a newer report replaces the row. The System shows a row only to the person with that confirmed email, and to
-- the owner and administrators of a registered company that person belongs to.
CREATE TABLE sys_cad_status (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  -- the CAD account's BIZOMAT account id when it is linked (Sign in with BIZOMAT)
  bizomat_sub TEXT,
  -- 1 when CAD Automation has proven the email (a confirmed BIZOMAT or Google sign-in, or the owner's own setup)
  email_verified INTEGER NOT NULL DEFAULT 0,
  computers_json TEXT NOT NULL DEFAULT '[]',
  jobs_json TEXT NOT NULL DEFAULT '[]',
  assistants_json TEXT NOT NULL DEFAULT '[]',
  reported_at INTEGER NOT NULL
);
CREATE INDEX sys_cad_status_sub ON sys_cad_status(bizomat_sub);
