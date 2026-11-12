# Deploying project controls (planned by the owner for December 2026)

_Written 12 Nov 2026. Everything is stored on GitHub: branch `feature/project-controls-cpm-evm`, pull request #19
("Advanced project controls, workspace customisation and board category descriptions"). It is not merged and not
deployed. The owner plans to deploy it next month. This page lists the steps in order._

## What the release contains

Project Management (`apps/work`) gains:

- permanent task IDs and WBS numbering;
- scheduling data, typed dependencies with lead and lag, and working calendars;
- the critical path engine, the Gantt upgrade and approved baselines;
- earned value, the Project controls screen and new report sections;
- workspace renaming and colours, and category descriptions.

What each part does: `README.md` in this folder and `workspace-and-categories.md`.

The release has two database migrations, both additive (new tables, and new columns that are nullable or have a
default):

- `apps/work/migrations/0008_project_controls.sql`;
- `apps/work/migrations/0009_group_descriptions.sql`.

## 1. Before deploying

1. Bring the branch up to date with `main` (it was current on 12 Nov 2026). Run each of these in order:
   - `git fetch origin`
   - `git checkout feature/project-controls-cpm-evm`
   - `git merge origin/main`

   Resolve any conflicts, then push.
2. **Check the migration numbers.**
   - Look in `apps/work/migrations/` on `main`. If it has gained migrations numbered 0008 or higher since
     12 Nov 2026, rename this branch's two files so they come after the last one on `main`.
   - Migrations run in name order and are recorded by name.
   - Never rename a migration that has already run in production.
3. Run the checks. In `apps/work`, run each of these in order:
   - `npm ci`
   - `npm run check`
   - `npm run test:e2e`

   "core board workflow" in the browser tests fails now and then on `main` too; if it does, run it again once.
4. Wait for CI on pull request #19. "Verify KEVOS site" (the homepage text check) and "CAD move rehearsal" also fail
   on `main` and are unrelated.
5. Review the screenshots in `screenshots/`. Optionally try it locally, as in the pull request's "Manual review
   instructions".

## 2. Deploying

1. Merge pull request #19 into `main`.
2. Run the deploy: GitHub, Actions, "BIZOMAT deploy (bizomat)", Run workflow on `main`, `confirm` = `DEPLOY`. The
   workflow does three things in order:
   - checks that the live Machines stay as they are;
   - snapshots the work volume;
   - deploys one Machine per process group.
3. When it starts, the work server copies the database to `/data/work/pre-migration-backups/`, then applies the new
   migrations. Nothing else changes until people use the new features.

## 3. After deploying

1. Check that `https://bizomat.ai/tasks/api/health` answers `"status":"ok"` and `"db":"ok"`.
2. Sign in and open a board. Check four things:
   - tasks show keys (`PREFIX-0001`);
   - the Gantt shows the critical path;
   - Project controls opens from the board header;
   - an existing report still generates.
3. Run the smoke test: `node infrastructure/smoke/smoke.mjs https://bizomat.ai --mode live`. Compare it with the run
   after the 12 Nov 2026 deploy:
   - every website, CAD and Project Management check on bizomat.ai passed;
   - the router's `/__proxy/health` and `/__proxy/ready` answered 404 from outside;
   - the old kevos.com addresses could not be reached from that test machine.
4. Run the public page checks in `CLAUDE.md` ("After any production change").

## 4. First use, per project

- Set the project calendar (working days, hours, public holidays, time zone) and, if wanted, the task ID prefix:
  Project controls, Calendar and settings.
- Mark the budget column as the approved budget.
- Approve baseline 0 before relying on variances or earned value.
- Record dated cost entries, so earned value has history.

## 5. Rollback

- **The code.**
  - Revert the merge commit of pull request #19 on `main` in a pull request, merge it and deploy again.
  - The earlier code runs on the migrated database and simply does not use the new tables and columns.
  - Do not drop them: they hold the new data.
- **The data,** only if data is damaged.
  - Two copies exist: the volume snapshot the deploy took, or the server's copy in `pre-migration-backups/`.
  - How to restore: `docs/deployment/fly-deployment.md`.

## 6. Still open from 12 Nov 2026: the email link test

The invitation link fix (pull request #18) is live. Links are always `https://bizomat.ai/tasks/invite/<token>`.

**The founder's test, still to do.** Brevo's click tracking sends each click through `r.<branded domain>` first, and
that path has not been checked end to end:

1. Open Founder console, Email. "Links in emails" should show `https://bizomat.ai/tasks` with no warning.
2. Send a test email to yourself.
3. In the email, click "Check an email link". It should end on "Email links work".

**If it stops at `r.www.bizomat.ai`:**

- Paste the link into the console's "Check an email link" box. It follows each redirect and says where the link
  breaks.
- Then fix the DNS by hand. Pick one:
  - add Brevo's record for that name in Cloudflare, set to DNS only;
  - move the branded tracking domain to a name used only for email;
  - remove the branding.

Details: `docs/email/brevo-invitation-link-troubleshooting.md`.
