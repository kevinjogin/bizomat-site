-- BIZOMAT ERP: the example company (owner's request, 14 Nov 2026: "add example site (Acme) to all users so they can
-- learn and ensure its demo site only for accounts"). Every person gets a company of invented example data of their own,
-- "Acme Studio (example)", with its own Projects workspace, CRM organisation, Finance business workspace and
-- Maintenance records, made through the app's own API (src/worker/system/example.ts). Only its owner sees it; it is
-- never shared, sends no email and is never on the public website.
--
-- Additive: one new table and its indexes. Nothing existing changes, so the earlier release ignores it.

CREATE TABLE sys_demo (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  -- the example company's id: the ERP's company switcher and Maintenance (mt_*.company_id) use it
  company_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  -- building: being made now; ready: in use; failed: the build stopped (a short reason in error); removed: the person
  -- removed it (never made again unless they ask)
  status TEXT NOT NULL CHECK (status IN ('building', 'ready', 'failed', 'removed')),
  workspace_id TEXT,
  crm_org_id TEXT,
  fin_org_id TEXT,
  -- a short reason only, never record content
  error TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  removed_at INTEGER
);
-- Notifications and invitations ask "is this space an example?" by the space's id.
CREATE INDEX sys_demo_workspace ON sys_demo(workspace_id) WHERE workspace_id IS NOT NULL;
CREATE INDEX sys_demo_crm ON sys_demo(crm_org_id) WHERE crm_org_id IS NOT NULL;
CREATE INDEX sys_demo_fin ON sys_demo(fin_org_id) WHERE fin_org_id IS NOT NULL;
