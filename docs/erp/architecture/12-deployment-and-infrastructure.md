# 12. Deployment and infrastructure strategy

Status: assessment and recommendations for review; nothing here is implemented. Facts and measurements:
`../discovery/website-and-infrastructure.md` sections 5, 6 and 8.

## 12.1 Can the existing infrastructure carry the ERP?

**Yes for the shell and the first modules, with conditions; measure before the stock and manufacturing stages.**

| Resource | Today | ERP effect | Assessment |
| --- | --- | --- | --- |
| work Machine memory (512 MB, no swap) | Four products in one Node process; no recorded figure | More code, larger lists and PDFs | Likely enough for Stages 1 to 4 if lists page and PDFs stay small; must be measured (`process.memoryUsage()`, `VmHWM`) before Stage 5 |
| CPU (one shared vCPU) | Reports, CPM scheduling, imports already CPU-heavy | Valuation, planning, consolidated reports | Fine for a small company if heavy work is batched; long synchronous computations block everyone |
| Database (one SQLite file, WAL, synchronous driver) | 144 tables; small data | ERP tables and stock moves grow fastest | SQLite handles millions of rows on one Machine; the risk is long queries on the event loop, not size. Index every list; summarise journals |
| Volume (3 GB, auto-extend to 20 GB) | Database, files, up to five pre-migration copies | More rows and documents | Copies multiply disk use; trim copies once the database is large (owner's call) |
| Start-up | Integrity check of the whole file; full copy before a migration | Larger file | Watch the deploy's health wait (30 s grace, 10-minute deploy wait) as data grows |
| Background jobs (one 15-minute run in process) | Every tool's jobs in sequence | ERP outbox, balances, scheduled reports | Keep each step short and bounded; split long work across runs |
| Proxy and routing | Path rules for four mounts | One more mount (`/erp`) | Trivial change, tested by the proxy suite |
| Image and deploy | Full rebuild each deploy; image carries unused CAD layers | Larger client and server bundles | Acceptable; a slimmer image and a build cache would shorten deploys |
| CAD Automation (separate app, other region, suspends) | Per person, MCP only | Drawing generation | Not a capacity issue for `bizomat`; a latency and availability dependency for that one feature |

## 12.2 Deployment plan for ERP (no new infrastructure)

1. **Code**: ERP lives in `apps/work` (server `src/worker/erp/`, client `src/client/erp/`), migrations `0016_*` onward,
   all additive.
2. **Routing**: add `ERP_PATHS` (`/erp`) to `infrastructure/proxy/routes.mjs` (to work), to the website Worker
   (`src/worker.ts`), to the local stub, and to `MOUNTS` in `apps/work/src/worker/mount.ts` (cookie path); a website
   test refuses any page at `/erp`.
3. **Checks**: `infrastructure/smoke/smoke.mjs` gains `/erp/api/health`, `/erp/login`, the carry and 401 checks; the
   deploy workflow waits for `/erp/login`.
4. **Release**: the existing `bizomat-deploy.yml` (`confirm` = `DEPLOY`); the preflight keeps Machines unchanged;
   the volume snapshot runs first; the work server copies the database before migrating.
5. **Live checks**: smoke test and the page list in `CLAUDE.md` plus `/erp/`.
6. **Rollback**: redeploy the previous image; the new tables stay and are ignored; the proxy rule for `/erp` goes
   back to the website (404) with the old image.

## 12.3 Configuration

- New ERP settings go through the work role's allow-list in `infrastructure/fly/entrypoint.sh` (as `WORK_*` names
  mapped to the app's names) **and** `apps/work/src/node/config.ts`, with a test, because of finding F1 (today
  `ABR_GUID` and `BIZOMAT_ID_CLIENTS` reach neither).
- Secrets stay `WORK_`-prefixed (Fly secrets are app-wide; the entrypoint limits each role).
- No new external service is needed for Stages 1 to 11. A carrier, payment or bank provider would each be the
  owner's decision with its own security review.

## 12.4 Recommended optimisations (not implemented; owner's approval where marked)

| # | Recommendation | Why | Approval |
| --- | --- | --- | --- |
| 1 | Take the 15 read-only measurements (memory, heap limit, database and volume sizes, run durations, start-up time) listed in `website-and-infrastructure.md` 8.10 | Facts before the stock and manufacturing stages | Owner (Fly access) |
| 2 | A founder-only capacity panel (memory, event-loop delay, database file sizes) | Watch capacity without SSH | Code change |
| 3 | Page every list, stream exports, cap report sizes, batch heavy work; consider a `worker_threads` worker with a read-only connection for reports | Keep the single event loop responsive | Code change |
| 4 | Fix F1: pass `ABR_GUID`, `BIZOMAT_ID_CLIENTS` (and future ERP settings) through the entrypoint and the Node config, with a test | The documented settings currently have no effect | Code change |
| 5 | A slimmer image (drop the CAD layers this app no longer runs) and a Docker layer cache in the deploy | Faster, cheaper deploys | Code change |
| 6 | Keep fewer pre-migration copies once the database is large | Disk use | Owner |
| 7 | Swap on the work Machine | Cushion against out-of-memory restarts | Owner (Machine change) |
| 8 | 1 GB for the work Machine if measurements show the need | Headroom for five products in one process | Owner (Machine change; deploy with `allow_machine_change` = `YES`) |
| 9 | Indexes and `EXPLAIN QUERY PLAN` checks on a database of the expected size for every ERP list and report | Query time on the event loop | Code change |
| 10 | Batch `IN (...)` lists in ERP code (and fix the 80 existing places if the Cloudflare plan stays) | D1's parameter cap | Code change |

## 12.5 What will not be done

- No new Fly app, Machine, process group, volume, database or server.
- No staging environment without the owner's approval (verification stays local: both runtimes, the compose stack,
  browser tests, then the live checks).
- No DNS change (ERP is a path on bizomat.ai).
- The design prototype is not part of any application. It was published at `bizomat.ai/system-preview/` and retired on
  14 Nov 2026 (owner): no longer built into the image; the address answers 301 to `/systems/erp/`. The ERP is at `/erp`.
