-- BIZOMAT WHS, hours worked follow-up (owner's brief of 15 Nov 2026, task 2): the history of every change to the hours
-- worked that injury frequency rates use (whs_hours, migration 0026). Each row is one change to one site and month: the
-- hours before (NULL when the month had none) and after (NULL when the figure was removed), who made it, when, and the
-- reason, which the application requires when a recorded figure is changed or removed (src/worker/whs/hours.ts).
--
-- Append-only: rows are never changed or deleted. The only deletion allowed is the example company's removal, which
-- writes whs_purges first in the same transaction (as for the incident history in 0026). changed_by may still be set to
-- NULL when an account is deleted (ON DELETE SET NULL), so the update trigger lists the other columns only.
--
-- Additive: one new table, its index and two triggers on it; no existing table changes, so the previous image runs on
-- the migrated database. Billing takes 0027 (built at the same time); this migration does not depend on it.

CREATE TABLE whs_hours_revisions (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  -- '' is hours for the whole company, not split by site (as in whs_hours)
  site_id TEXT NOT NULL DEFAULT '',
  month TEXT NOT NULL CHECK (length(month) = 7),
  before_hours REAL CHECK (before_hours IS NULL OR before_hours >= 0),
  after_hours REAL CHECK (after_hours IS NULL OR after_hours >= 0),
  reason TEXT NOT NULL DEFAULT '' CHECK (length(reason) <= 500),
  changed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  changed_at INTEGER NOT NULL
);
CREATE INDEX whs_hours_revisions_company ON whs_hours_revisions(company_id, changed_at);
CREATE INDEX whs_hours_revisions_month ON whs_hours_revisions(company_id, site_id, month, changed_at);
CREATE TRIGGER whs_hours_revisions_append_only BEFORE UPDATE OF id, company_id, site_id, month, before_hours, after_hours, reason, changed_at ON whs_hours_revisions BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the hours worked history is append-only'); END;
CREATE TRIGGER whs_hours_revisions_no_delete BEFORE DELETE ON whs_hours_revisions WHEN NOT EXISTS (SELECT 1 FROM whs_purges p WHERE p.company_id = OLD.company_id) BEGIN SELECT RAISE(ABORT, 'WHS_AUDIT: the hours worked history is append-only'); END;
