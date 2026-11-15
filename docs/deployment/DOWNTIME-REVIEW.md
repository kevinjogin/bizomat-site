# Deploy downtime on the Fly app `bizomat`: review and recommendation

> **15 Nov 2026:** the owner approved these recommendations. Recommendations 1, 2, 4 and 5 are built
> (`.github/workflows/bizomat-deploy.yml`, `.github/scripts/stage-secrets.sh`, `.github/scripts/outage-summary.py`,
> `infrastructure/fly/Dockerfile` target `runtime-website`, `fly.website.toml`). Recommendation 3 (the router's
> fallback) changes the router every request passes through, so it follows in its own change with its own tests.

Review of 15 Nov 2026. It covers the owner's question "can deploys be safer without new infrastructure?" Owner's
decision: keep the existing infrastructure. No new Machine, no larger Machine, no new app or server, no added recurring
cost. Nothing here has been changed or deployed. These are proposals for the owner to approve one by one.

## 1. What happens today, measured

The deploy workflow (`.github/workflows/bizomat-deploy.yml`) runs:

```
flyctl deploy --config fly.website.toml --app bizomat --local-only --ha=false --build-arg BIZOMAT_VERSION=<commit> --wait-timeout 10m
```

`fly.website.toml` sets three things:
- `[deploy] strategy = "rolling"`, `max_unavailable = 1`;
- one Machine in each of the groups proxy, web and work;
- `kill_timeout = 15`.

In both logs below, flyctl replaced the three groups **at the same time** (`max_unavailable` counts within each group, and each group has one Machine).
- Each Machine is replaced in place: stopped, given the new image, started.
- The proxy is the only Machine that takes public traffic. While it is down, everything under bizomat.ai is down,
  including `/cad` (CAD runs in the separate app `cados`, but its traffic passes through this proxy).

Timings from the deploy logs:

| Run | Machine config updated | proxy started | work started | web started | What visitors saw |
| --- | --- | --- | --- | --- | --- |
| 37 (WHS) | 08:32:00-07 | 08:32:50 (43 s) | 08:32:58 (51 s) | 08:36:27 (4 min 20 s) | Everything down for about 45 s, then the website 502 until about 08:36:30 (the proxy was back, web was not) |
| 38 (design audit) | 08:55:21-28 | 08:56:51 (83 s) | 08:56:25 (57 s) | 08:56:10 (42 s) | Everything down for about 85 s (until the proxy was back) |

flyctl's smoke checks and health checks pass within about 10 s of each start.

So nearly all of each window lies between "config updated" and "started". That interval covers three things:
- stopping the old process (up to 15 s; the proxy waits up to 10 s for open requests);
- fetching and unpacking the image on that Machine's host;
- starting the process.

The servers themselves start in seconds. **The image fetch is most of the outage.** The web Machine's 4 min 20 s in
run 37 is an outlier whose cause the logs do not show. A slow image fetch on that host is the likely one, but it is not
proven.

## 2. What the image holds

- `infrastructure/fly/Dockerfile`, target `runtime`: **612 MB compressed** (run 37's log), **2.69 GB unpacked** (CI's
  "image and local stack" job, 15 Nov 2026).
- Every Machine of the app fetches all of it, whatever its role.

| Part | Needed by | Size |
| --- | --- | --- |
| CAD Automation's Python packages (`/opt/cad/venv`: OpenCascade, build123d, scipy, numpy and others) | the `cad` role only | About 1.0 GB unpacked. Measured here on the same pinned packages (the dev set, slightly larger): OCP and its libraries alone 383 MB |
| X and GL system libraries for OpenCascade, the SOLIDWORKS add-in zip (.NET build), `apps/cad/opensketch` | the `cad` role only | not measured; the .NET build also adds minutes to every deploy's build |
| The website build (`/app/web/dist`, Library pages, Pagefind, tools) | web | about 360 MB unpacked (a local build of 14 Nov 2026); changes on most deploys |
| Project Management (`/app/work`: dist and production node_modules) | work | tens of MB |
| Node 22, Python 3.12 slim, the proxy, the entrypoint | all | small |

**No Machine of this app runs the `cad` role.** The `cad` group was removed from `fly.website.toml` on 9 Nov 2026, and
CAD runs in the app `cados`. So about 40 per cent of the unpacked image is fetched on every replacement and never used.

## 3. What the parts do during a restart

- **Proxy** (`infrastructure/proxy/`):
  - On SIGTERM it stops taking connections and waits up to `PROXY_SHUTDOWN_GRACE_MS` (10 s) for open requests,
    then exits. CAD Companions' 25 s long polls make it wait the full 10 s whenever a computer is connected.
  - When web or work does not answer, it retries once on a refused connection, then answers its own page
    "Service unavailable ... try again in a minute" (502, `Retry-After: 10`).
  - It has no waiting and no fallback.
- **Web** (`src/node/server.ts`) and **work** (`apps/work/src/node/server.ts`, `runtime.ts`) stop gracefully on
  SIGTERM. Work waits up to 10 s for requests and background work, closes WebSockets (open boards reconnect) and
  closes the database.
- **Work on start** applies pending migrations. Before that, it copies the database with `VACUUM INTO` to
  `pre-migration-backups/`, only when a migration is pending. In run 35 this showed as a few seconds of 502 after
  the router was back.
- **Fly checks** (`[checks]` in `fly.website.toml`) tell flyctl when a Machine is good. They do not hold back traffic
  from web or work. The proxy reaches them by their private address whatever the check says.

## 4. flyctl facts checked (flyctl v0.5.10, 12 Nov 2026 build, `flyctl deploy --help`)

- `--process-groups`: deploy only to the Machines of these groups.
- `--only-machines`, `--exclude-machines`: the same by Machine id.
- `--image`: deploy an image already built.
- `--build-only`, `--push`, `--image-label`: build and push once, then deploy that image by its label.
- `--build-target`: the Dockerfile stage. In `fly.website.toml` it is `[build] build-target = "..."`.
- `--strategy`: `canary`, `rolling`, `bluegreen` or `immediate`. `--max-unavailable`, `--wait-timeout`,
  `--smoke-checks`.
- `fly secrets import --stage` reads `NAME=VALUE` lines from standard input. `fly secrets deploy` applies staged
  secrets to every Machine of the app, a restart like a deploy.

`bluegreen` and `canary` start temporary extra Machines. `bluegreen` is not available for groups with a volume, and
work has one. Both are out of scope under the owner's decision unless approved.

## 5. Recommendations, best first

Each one costs nothing recurring and adds no Machine. Each needs the owner's approval and a pull request with CI. The
effects are estimates from the two runs above until recommendation 1 measures them.

### 1. Measure the outage on every deploy

- **What:** while the deploy step runs, a background loop in the workflow requests `https://bizomat.ai/` and
  `https://bizomat.ai/erp/login` once a second. It writes the first and last failing second of each to the step summary.
- **Effect:** none on the outage. It turns the estimates in this document into facts, deploy by deploy.
- **Risk:** none. The loop only reads public pages.
- **Files:** `.github/workflows/bizomat-deploy.yml` (one step started before "Deploy" and stopped after it).

### 2. Deploy in order, and leave the proxy alone when it has not changed

The biggest change in what visitors see.

- **What:** replace the single `flyctl deploy` with these steps:
  1. Build and push once:
     `flyctl deploy --config fly.website.toml -a bizomat --local-only --build-only --push --image-label <commit> ...`.
  2. `flyctl deploy --config fly.website.toml -a bizomat --image registry.fly.io/bizomat:<commit> --process-groups work --ha=false --wait-timeout 10m`.
  3. The same with `--process-groups web`.
  4. The proxy only when needed, with `--process-groups proxy`. It is needed when any of these has changed since the
     version the proxy reports (`/__proxy/health` `version`, then `git diff --name-only <that>..HEAD`):
     - `infrastructure/proxy/`;
     - `infrastructure/fly/entrypoint.sh`;
     - `infrastructure/fly/Dockerfile`;
     - the proxy's parts of `fly.website.toml` (`[http_service]`, `[checks.proxy]`, `[env]` `UPSTREAM_*`, `PROXY_*`,
       `BIZOMAT_PREVIEW_ROUTING`, `TASKS_REDIRECT_ORIGIN`).

     A workflow input `deploy_proxy` (`auto`, `yes`) lets the owner force it.

  The step "The router serves the new version" then checks each Machine's image label
  (`flyctl machines list -a bizomat --json`), not the proxy's version. Optionally, `/__proxy/ready` could report each
  backend's version.
- **Effect:**
  - On most deploys the proxy stays up, so bizomat.ai is never down as a whole.
  - The website is down only while web restarts (42 s in run 38; with recommendation 3, close to nothing for pages).
  - The ERP is down only while work restarts (51 to 57 s in the runs above).
  - CAD Automation (`/cad`) is not touched at all.
  - Deploys that change the proxy still have its 45 to 85 s, but those are rare.
- **Cost:** none. The deploy takes about a minute longer (the groups one after another).
- **Risk:** low.
  - A setting change meant for the proxy waits until the proxy is deployed. The rule above catches the files that
    matter, and `deploy_proxy = yes` covers anything else.
  - Staged secrets apply only to the groups deployed. Today the proxy takes no secrets.
  - Rollback becomes possible per group: `flyctl deploy ... --image <previous> --process-groups web --ha=false`.
- **Files:**
  - `.github/workflows/bizomat-deploy.yml`;
  - the "Recovery and maintenance" notes in `README.md` and `docs/deployment/fly-deployment.md`;
  - the laptop tool's `deploy website` if it should match.

### 3. The proxy waits and falls back instead of answering 502 at once

- **What:**
  1. **Website pages during a web restart.** For a `GET` or `HEAD` that web cannot take (refused connection), the
     proxy serves the file from its own copy of the website build. The image already has `/app/web/dist`, readable by
     the proxy's user. To keep headers identical (the site's CSP, `_headers`, `_redirects`), it uses the web server's
     own static-file code (`src/node/assets.ts`), built as a small module beside `dist-server/server.mjs`, not a
     second copy of the rules. AI search and the contact form answer 503 with `Retry-After`.
  2. **The ERP and the rest of web during a restart.** For `GET` and `HEAD` with a refused connection, the proxy tries
     again about once a second for up to about 20 s before answering. Other methods keep today's single retry; they
     are not safe to repeat. After that they get 503 with `Retry-After: 10`.
  3. **A clearer holding page:** "BIZOMAT is being updated. This page tries again in 10 seconds." It uses a meta
     refresh, with no script, so it stays inside the proxy's CSP.
- **Effect:**
  - Website pages stay up while web restarts.
  - App pages wait a few seconds instead of failing, and the post-migration 502s of run 35 disappear.
  - It does nothing for the proxy's own restart (recommendation 2 makes that rare).
- **Cost:** none.
- **Risk:** medium.
  - It touches the router every request passes through, so it needs the proxy's tests extended for each case.
  - Waiting must stay bounded so a dead backend does not tie up connections.
  - It relies on the proxy's image holding the website build. It does today, but a later split of images per group
    would need to keep `dist` in the proxy's image.
- **Files:**
  - `infrastructure/proxy/proxy.mjs`, `pages.mjs`, `upstreams.mjs`, `config.mjs` and their tests in
    `infrastructure/proxy/test/`;
  - `src/node/assets.ts` (an export only) and its build step in `package.json`;
  - `infrastructure/fly/Dockerfile` (copy the module).

### 4. Leave CAD Automation out of the image this app deploys

- **What:** add a Dockerfile target, for example `runtime-website`, with no CAD layers. It drops:
  - the `cad-deps` venv;
  - the add-in (`swaddin`);
  - the X and GL libraries;
  - `apps/cad/opensketch`;
  - the CAD import check.

  Point `fly.website.toml` at it with `[build] build-target = "runtime-website"`. Keep the target `runtime` (with CAD)
  for `fly.toml` and the local compose stack (`infrastructure/local/compose.yml`, `BIZOMAT_BUILD_TARGET`, default
  `runtime`), so the earlier single-app plan and its rehearsal keep working. In the entrypoint, the `cad` role on an
  image without CAD stops with a clear message. No Machine runs it here. CI's image job builds both targets and prints
  both sizes.
- **Effect:**
  - The image shrinks by roughly 1 GB unpacked (more than a third). Every replacement fetches less, most of all on a
    host that does not have the layers cached.
  - The deploy's build also gets shorter (no .NET or OpenCascade) and needs less room on the runner.
  - Not measured yet: recommendation 1 will show it.
- **Cost:** none.
- **Risk:** low. Nothing that runs on these Machines uses the removed parts. The preflight still sees the same
  Machines.
- **Files:**
  - `infrastructure/fly/Dockerfile`;
  - `fly.website.toml` (`[build]`);
  - `infrastructure/fly/entrypoint.sh` (one check);
  - `.github/workflows/bizomat-ci.yml` (build and size of the new target);
  - `infrastructure/fly/test/check-config.py` if it checks `[build]`.

### 5. Shorter waits when stopping

- **What:** `PROXY_SHUTDOWN_GRACE_MS` from 10 s to 3 s (in `fly.website.toml` `[env]`).
  - Connected CAD Companions hold 25 s long polls through the proxy, so today the proxy waits the full 10 s on every
    restart while refusing new connections.
  - The Companions poll again on their own.
  - `kill_timeout` stays 15 s.
- **Effect:** up to 7 s less on each proxy restart. Small, and rarer with recommendation 2.
- **Cost:** none. **Risk:** low. A normal request finishes well inside 3 s; long polls and WebSockets reconnect.
- **Files:** `fly.website.toml`, `infrastructure/proxy/config.mjs` (comment only).

### 6. Deploy at a quiet time

Until 2 and 3 are in place, run deploys when the fewest people use the ERP (for example late evening, Sydney time). Say
so in the workflow's description. **Cost:** none. **Effect:** fewer people see the outage.

## 6. Not recommended under the owner's decision

Each needs the owner's explicit approval:

| Option | Why not now |
| --- | --- |
| `--strategy bluegreen` or `canary` | Starts temporary extra Machines on every deploy (billed while they run). `bluegreen` cannot be used for work (it has a volume). |
| A second proxy or web Machine | Removes the outage for that group, but it is a recurring cost, and the owner has ruled it out. |
| `--ha=true` | Creates spare Machines. Work must never have two (each would get its own empty volume). |
| `immediate` strategy | Replaces everything at once without waiting: no better than today. |

## 7. Expected result

These are estimates, to be confirmed by recommendation 1.

| | Website pages | ERP and the apps | `/cad` | Everything at once |
| --- | --- | --- | --- | --- |
| Today (runs 37 and 38) | 85 s to about 4.5 min | 85 s | 45 to 85 s (the proxy) | 45 to 85 s |
| With 2 | 40 to 60 s (web restart) | 50 to 60 s (work restart) | none | only on the rare proxy deploys |
| With 2 and 3 | about none (pages from the proxy's copy) | requests wait up to about 20 s, then 503 | none | only on the rare proxy deploys |
| With 4 added | each restart shorter, most on hosts without cached layers | shorter | none | shorter |

Suggested order: 1 and 4 first (low risk, measure the gain), then 2, then 3 with its tests. Each is a separate pull
request, CI, and a deploy the owner runs.

## 8. Rollback stays as it is

- `flyctl releases -a bizomat --image`, then
  `flyctl deploy --config fly.website.toml -a bizomat --image <previous> --ha=false`. With recommendation 2 it can
  also be done one group at a time with `--process-groups`.
- Data: `pre-migration-backups/` on the work volume, the workflow's snapshot before each deploy, and the daily volume
  snapshots (`docs/deployment/fly-deployment.md`).
