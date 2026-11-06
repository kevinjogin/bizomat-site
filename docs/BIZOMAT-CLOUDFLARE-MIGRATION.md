# BIZOMAT on Cloudflare: Phase 1 audit and migration plan

_6 Nov 2026. Phase 1 of the owner's request "Migrate BIZOMAT and its MCP server from Fly.io to Cloudflare". This is
an audit: nothing in production was changed. Code reviewed: gocore-website `main` 2c05106 (website, `apps/work`,
`apps/cad` copy, `infrastructure/`), CADOS `main` 17cb5b8 (the live CAD Automation server, add-in and laptop tools).
Platform facts are from Cloudflare's documentation as published in October and November 2026 (Containers limits,
pricing, lifecycle, FAQ and snapshots; Workers limits; Agents MCP transport)._

## 0. The short version

| | Finding |
| --- | --- |
| Domain | **bizomat.io is not registered.** The .io registry answers NXDOMAIN for bizomat.io, www and mcp. The domain the owner holds, on Cloudflare (nameservers uma and zac.ns.cloudflare.com), is **bizomat.ai**. A decision is needed before Phase 2. |
| Website | **Workers-native.** It ran as the Cloudflare Worker `throbbing-block-6c61` until 6 Nov 2026; `src/worker.ts` and `wrangler.toml` are still maintained. Low risk. |
| Project Management (`/tasks`) | **Workers-native** (Hono, D1, R2, KV, a Durable Object, a cron). It ran on Cloudflare until 6 Nov 2026 (`workos-platform-preview`). Its live data now sits on the Fly volume `work_data` and must move back to D1 and R2. |
| MCP server (CAD Automation, cados.fly.dev) | **Cannot run in a Worker.** It is a 15,000-line Python server with a C++ CAD kernel (OpenCascade), a Node.js solver subprocess, worker processes, files and SQLite on disk, and long-held connections to the SOLIDWORKS computers. The Cloudflare product built for this is **Containers**: the existing image runs unchanged behind the Worker `bizomat-mcp`. Containers need the **Workers Paid plan**, and their disk is **not persistent**, so the server's data folder needs a persistence layer on **R2**. |
| MCP contract | 31 tools, server name "BIZOMAT CAD Automation", Streamable HTTP, OAuth 2.1 with dynamic registration. Saved exactly in `docs/cloudflare/mcp-contract.json`; the migration must serve the same contract, checked by test. |
| Fly | Both Fly apps stay running and untouched until the owner approves their retirement (Phase 8). |

Decisions needed from the owner (section 9): the domain; the Workers Paid plan for Containers; whether Project
Management is its own Worker (recommended) or part of `bizomat`.

## 1. What runs in production today

| Address | Served by | Platform |
| --- | --- | --- |
| https://bizomat.ai/ (website) | Fly app `bizomat`, process groups `proxy` (router, :8080) and `web` (Node server, :8003), Sydney | Fly.io |
| https://bizomat.ai/tasks/ (Project Management) | Fly app `bizomat`, group `work` (Node runtime, :8002), volume `work_data` (3 GB, daily snapshots, 30 days) | Fly.io |
| https://bizomat.ai/cad/ (CAD Automation and its MCP endpoint https://bizomat.ai/cad/mcp) | Fly app `cados` (performance-1x, 2 GB, suspends when idle, volume `opensketch_data`), reached by the router over Fly's private network (`cados.internal:8080`) | Fly.io |
| https://bizomat.fly.dev | the router of `bizomat`: 301 to bizomat.ai, plus `/__proxy/health` and `/__proxy/ready` | Fly.io |
| https://cados.fly.dev, https://cados.kevos.com | `cados` directly: pages 301 to bizomat.ai/cad; MCP, OAuth, `/v2/` (computers), `/api/`, `/healthz` keep answering at those hosts | Fly.io |
| https://kevos.com | Worker `throbbing-block-6c61` (the KEVOS site, Stage 0) | Cloudflare |
| https://work.kevos.com | Worker `workos-platform-preview` (Project Management before its move; data as of 6 Nov 09:34 UTC) | Cloudflare |
| DNS for bizomat.ai | Cloudflare zone, DNS only (grey cloud) to Fly; MX for info@bizomat.ai at iCloud | Cloudflare |
| Installer downloads | GitHub Releases of jogkev-creator/CADOS (`bridge-latest`, 0.13.0) | GitHub |

Deploys are made from the owner's laptop (`C:\BIZOMAT\bizomat.ps1`: `deploy website`, `deploy cad`, `move tasks`,
`restore kevos`), with the laptop's own `fly` and `wrangler` sign-ins. This sandbox has no Fly or Cloudflare
credentials (the saved Cloudflare token is rejected), so every deploy and data move in the plan below is a laptop
command, prepared and tested here first.

## 2. Website (gocore-website, repository root)

- **Framework:** Astro 7.3 static build (`trailingSlash: always`, 4,441 pages including the Library), MDX, sitemap,
  Pagefind search index; self-hosted fonts. Build: `npm run build` (brand assets, Astro, Pagefind, postbuild checks
  that hash scripts for the CSP and write `dist/_headers` and `_redirects`, over 1,600 redirects).
- **Server code, two runtimes kept equal:** `src/worker.ts` (Cloudflare Worker, `wrangler.toml`) and `src/node/`
  (Node server for Fly, `npm run build:server`, which provides the same bindings: Workers AI over REST, in-memory rate
  limiters).
- **Routes:** every static page; `/api/chat`, `/api/discover`, `/api/discover/event`, `/api/learn/intent|plan|lesson|ask`,
  `/api/contact`, `/api/assessment`, `/api/assessment/stripe-webhook`; `/cad/...` and CAD's OAuth discovery paths
  (passed to CAD Automation), `/tasks/...` (passed to Project Management by the `TASKS` service binding), `/insights`
  redirects, host redirects (`www` to the apex), security headers and a strict CSP.
- **Bindings and settings (names only):** `ASSETS`, `AI` (Workers AI), `EMAIL` (send_email to the verified address
  kevin@kevos.com), `TASKS` (service binding), `CHAT_LIMITER` and `FORM_LIMITER` (Workers rate limiting),
  `DISCOVERY_EVENTS` (Analytics Engine, switched off), secrets `TURNSTILE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
  `RESEND_API_KEY` (optional mail provider), variables for models, limits and `ALLOWED_ORIGINS`. On Fly instead:
  secrets `CF_ACCOUNT_ID` and `CF_AI_TOKEN` (Workers AI over REST).
- **Stored data:** none. The site is stateless; forms send mail; the AI search reads its index from the build.
- **External services:** Workers AI, Turnstile, Cloudflare Email (send_email), optionally Resend and Stripe
  (webhook verified with `STRIPE_WEBHOOK_SECRET`).
- **Cloudflare fit:** native. The Worker build only needs its configuration changed: name `bizomat`, its own custom
  domain, the guard that today stops deploys to the kevos.com Worker (`scripts/kevos-guard.mjs`) replaced by a guard
  that deploys only to `bizomat`, and `/cad` pointed at the new MCP Worker (service binding) instead of an origin.

## 3. Project Management (`apps/work`)

- **Framework:** Hono 4 API and a React 19 single-page app (Vite, TipTap, TanStack Query), TypeScript, zod. Two runtimes:
  Worker (`src/worker/index.ts`, `wrangler.jsonc`) and Node (`src/node/`, SQLite, `ws`, an in-process scheduler) for Fly.
  Served under `/tasks` (`src/worker/mount.ts`, `<base href>`).
- **Cloudflare bindings (as deployed until 6 Nov):** `DB` (D1), `FILES` (R2), `CACHE` (KV), `BOARD_ROOMS` (Durable
  Object `BoardRoom`, SQLite class: live board updates over WebSocket), `ASSETS` (the SPA), `CF_VERSION_METADATA`,
  a Cron Trigger every 15 minutes (maintenance and scheduled automations), observability on.
- **Auth:** email and password (PBKDF2), sessions stored in the database, cookie scoped to `/tasks`; open sign-up
  (`ALLOW_SIGNUP=true`, 72-hour sessions); Google sign-in only when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  are set (off today); a founder admin console.
- **Integrations:** outbound webhooks per workspace (generic HTTPS, Slack `hooks.slack.com`, Microsoft Teams),
  triggered by item and automation events; automations run by the cron.
- **Data:** on the Fly volume `work_data` at `/data/work`: `db.sqlite` (schema 0001 to 0005, migrations applied at
  start) and `files/` (uploads and avatars). Moved there from D1 and R2 on 6 Nov 2026 (47 tables, 270 rows, 4 files at
  the time). The old D1 database `workos-platform-preview-db` and R2 bucket `workos-platform-preview-files` still hold
  the copy from before the move; they are stale.
- **Cloudflare fit:** native. Moving back needs a data move in the other direction (SQLite and files on Fly to a new
  D1 database and R2 bucket), tooling for which does not exist yet (the existing tooling goes D1 to Fly).

## 4. MCP server: CAD Automation (CADOS, Fly app `cados`)

### 4.1 Stack and runtime needs

- Python 3.12, FastAPI 0.147 and Starlette 1.6 on uvicorn, the MCP Python SDK 2.2 (Streamable HTTP), sse-starlette.
- CAD kernel: build123d 0.13 and cadquery-ocp 8.0 (OpenCascade, C++), numpy, scipy, scikit-learn, ezdxf, lib3mf, pillow,
  svg libraries. System libraries libGL, libGLU, X11 (headless rendering for previews).
- Node.js: the sketch solver (`solver/solve_cli.mjs`) runs as a subprocess.
- Processes: a supervisor (`--supervise`, restarts the server after 120 s without a health answer), the web server,
  and up to three CAD worker processes (`cadworker.py`, multiprocessing, 800 MB each before replacement).
- The image (`Dockerfile`) also builds the SOLIDWORKS add-in zip in a .NET 8 SDK stage.
- One instance by design: live sessions with the computers are kept in memory; SQLite and JSON files on local disk.

### 4.2 Endpoints

- Pages: `/` (product page or Home), `/overview`, `/docs`, `/privacy`, `/dashboard`, `/assistant`, `/solidworks`,
  `/tools`, `/history`, `/settings`, `/admin`; sign-in `/login`, `/setup`, `/signup`, `/join/...`, `/logout`,
  `/access`, `/auth/google` and `/auth/google/callback`; static `/ui/`, `/fonts/`, favicons; `/download/solidworks`.
- MCP (Streamable HTTP, stateless; each answer is an event stream with a keep-alive comment every 15 s):
  `/mcp` and `/solidworks/mcp` (Bearer token from OAuth), `/mcp/<key>` and `/solidworks/mcp/<key>` (private address).
  There is no legacy `/sse` endpoint: no existing client needs one.
- OAuth 2.1 (`mcpauth.py`): `/.well-known/oauth-protected-resource[/mcp|/solidworks/mcp]`,
  `/.well-known/oauth-authorization-server[...]`, `/.well-known/openid-configuration...`, `/oauth/register` (dynamic
  client registration; client metadata documents fetched from public https only), `/oauth/authorize` (GET and POST,
  the consent page), `/oauth/token` (PKCE S256, refresh rotation), `/oauth/revoke`.
- Computers (the BIZOMAT Companion; `devicebridge.py`): `/v2/keys`, `/v2/devices/pair/start|poll|password`,
  `/devices/pair`, `/v2/device/hello`, `/v2/device/next` (long poll, held up to 25 s), ack, progress, status,
  `/v2/device/file` (chunks), `/v2/device/blob/{id}`, `/v2/device/unpair`, `/v2/bridge/update.json` (signed release
  manifest). Every request carries a signed proof (ES256 JWS over method, path, time, one-time id, body hash); every
  command is signed by the server's key.
- The add-in's direct link (older): `/mcp/sw/hello|next|result|file|blob`. Uploads `/mcp/uploads/{id}` (PUT/POST),
  results `/mcp/artifacts/{id}/{file}`. Account and admin API under `/api/account...`, `/api/devices...`,
  `/api/commands`, `/api/solidworks`. `/healthz`.

### 4.3 The MCP contract (must not change)

Server name **BIZOMAT CAD Automation**, instructions of 1,857 characters, and these 31 tools (inputs in brackets;
`device` picks one of several paired computers):

| Tool | Inputs |
| --- | --- |
| `request_upload` | filename, size_bytes |
| `sw_status` | device |
| `sw_get_guide` | (none) |
| `sw_create_document` | name, kind, folder, units, device |
| `sw_open_document` | path, device |
| `sw_save` | doc, path, device |
| `sw_get_document` | doc, sketches, component, device |
| `sw_add_features` | features, doc, component, summary, predict, device |
| `sw_batch` | steps, doc, summary, stop_on_warnings, device |
| `sw_delete_items` | doc, features, components, mates, dry_run, device |
| `sw_undo` | doc, steps, device |
| `sw_set_parameter` | name, expression, doc, remove, comment, device |
| `sw_set_equation` | target, expression, doc, device |
| `sw_insert_component` | part, doc, position, rotation, fixed, device |
| `sw_add_mate` | type, refs, doc, value, align, flip, planes, angle_refs, angle_min, angle_max, min, max, name, device |
| `sw_body_topology` | doc, component, kind, near, limit, device |
| `sw_measure_items` | a, b, doc, device |
| `sw_inspect_design` | doc, component, device |
| `sw_preview` | doc, view, width, height, component, yaw, pitch, target, view_width, section, screenshot, device |
| `sw_check_interference` | doc, device |
| `sw_find_mate_candidates` | doc, device |
| `sw_create_drawing` | doc, sheet, projection, views, scale, dimensions, properties, name, folder, notes, centre_marks, overwrite, device |
| `sw_get_drawing` | doc, device |
| `sw_edit_drawing` | actions, doc, device |
| `sw_export` | format, doc, component, device |
| `sw_import` | filename, data, upload_id, folder, device |
| `sw_standard_part` | kind, size, length, folder, device |
| `sw_list_devices` | (none) |
| `sw_command_status` | command_id |
| `sw_cancel_command` | command_id |
| `sw_selftest` | stage, device |

The exact descriptions, input schemas and output schemas are in `docs/cloudflare/mcp-contract.json`, read from the
running code. Clients: Claude (custom connector), ChatGPT and other Streamable HTTP clients, connected by OAuth at
`https://bizomat.ai/cad/mcp` (or older connectors at `https://cados.kevos.com/mcp`, `https://cados.fly.dev/mcp`, which
keep their own address as the OAuth resource and issuer).

### 4.4 Data (the Fly volume `opensketch_data`, mounted at `/data`)

| File or folder | What it holds | Notes |
| --- | --- | --- |
| `users.json`, `accounts.enabled` | accounts (scrypt password hashes, roles, settings, invites) | a missing file with `accounts.enabled` present fails closed |
| `mcp_oauth.json` | OAuth clients, grants, refresh tokens | tokens are bound to their resource address |
| `google_oauth.json` | Google sign-in settings, client secret encrypted (`secretbox.py`) | callback registered at https://bizomat.ai/cad/auth/google/callback |
| `secret`, `secret.keys`, `ai_keys.secret` | server keys: per-person private addresses and add-in keys (HMAC), encryption key | changing them invalidates every key and private address |
| `bridge.sqlite` | paired computers (public keys), pairings, every command with history and result | SQLite |
| `bridge-signing-key.pem` | the key that signs commands; every paired Companion trusts it | must move unchanged, or every computer must pair again |
| `bridge-release.json`, `swbridge.json` | update manifest, direct-link state | |
| `uploads/`, `artifacts/`, `bridge-files/` | files in transit (kept 10 to 30 minutes) | need not move |

Settings: `OPENSKETCH_PUBLIC_URL` (today https://bizomat.ai/cad), `OPENSKETCH_REDIRECT_HOSTS`,
`OPENSKETCH_ALIAS_HOSTS`, `OPENSKETCH_DATA`, `OPENSKETCH_VERSION`, `OPENSKETCH_ACCESS_CODE`,
`OPENSKETCH_INSTALLER_URL`, `OPENSKETCH_ADDIN_URL`, `OPENSKETCH_KEY_SECRET`, `OPENSKETCH_MCP_TOKEN`, worker and disk
limits, and the legacy `OPENSKETCH_PASSWORD`. Fly secrets on `cados` are not visible from here: list their names on
the laptop with `fly secrets list -a cados` before Phase 5.

### 4.5 Long-running behaviour

- Computers hold a long poll for 25 s (`/v2/device/next`) and count as connected for 70 s after the last one.
- A tool call waits up to 240 s for SOLIDWORKS while its event stream sends a comment every 15 s.
- Uploads: up to 128 MB per file (`MAX_FILE`), upload links live 10 minutes.
- Fly suspends the machine when idle; a Companion's long poll keeps it awake.

### 4.6 Why it cannot be a plain Worker

| Need | Workers (V8 isolates, Python on Pyodide) |
| --- | --- |
| OpenCascade (C++ through cadquery-ocp), scipy, scikit-learn | not available |
| A Node.js subprocess, worker processes | no subprocesses or multiprocessing |
| Files and SQLite on local disk | no filesystem (D1, R2, KV, Durable Objects instead) |
| Memory: server about 2 GB, CAD workers up to 800 MB each | 128 MB per isolate |
| Rewriting the 31 tools in TypeScript | the tools depend on the CAD kernel, which has no JavaScript equivalent; the rewrite would remove functionality |

## 5. Cloudflare platform facts that shape the plan

- **Containers** run a Docker image behind a Worker; each instance belongs to a Durable Object, and a Worker reaches
  it only through that Durable Object (Durable Object Container API, `durable_object` scheduling policy, or the
  `Container` class). Not available on the Free plan; the **Workers Paid plan** ($5 a month) includes 25 GiB-hours
  of memory, 375 vCPU-minutes and 200 GB-hours of disk a month, then $0.0000025 per GiB-second of memory, $0.000020
  per vCPU-second of active CPU and $0.00000007 per GB-second of disk. Memory and disk are billed while the instance
  runs; it can sleep after an inactivity timeout.
- **Instance types:** lite (1/16 vCPU, 256 MiB, 2 GB), basic (1/4, 1 GiB, 4 GB), standard-1 (1/2, 4 GiB, 8 GB),
  standard-2 (1, 6 GiB, 12 GB), standard-3 (2, 8 GiB, 16 GB), standard-4 (4, 12 GiB, 20 GB). The image can be as
  large as the instance disk. Cold starts are usually 1 to 3 s, longer for large images.
- **Disk is ephemeral.** A sleeping or restarted instance starts from a fresh disk. Snapshots exist (durable_object
  policy) but are tied to the image version they were made from, so they cannot carry data across deploys. Cloudflare
  points to R2 (also through FUSE, without local-disk performance) for persistence.
- **Stopping:** Cloudflare sends SIGTERM and waits up to 15 minutes before SIGKILL (host maintenance, rollouts); there
  is no fixed maximum runtime.
- **Workers:** no wall-clock limit for an HTTP request while the client stays connected (long polls and 4-minute event
  streams work); CPU time 30 s by default on Paid (waiting does not count); incoming request bodies up to 100 MB on
  Free and Pro zones (Business 200 MB): uploads above 100 MB, which CAD allows today (128 MB), would be refused.
- **Remote MCP on Cloudflare:** Streamable HTTP is the standard transport (Agents SDK `createMcpHandler`), OAuth with
  `@cloudflare/workers-oauth-provider`. The existing server already speaks Streamable HTTP with its own OAuth, which
  clients use today.

## 6. Addresses in the code

| Repository | fly.dev | bizomat.ai | kevos.com | bizomat.io |
| --- | --- | --- | --- | --- |
| gocore-website | 140 lines in 32 files (router, Fly configs, deploy workflows, smoke tests, migration tooling, docs) | 584 lines in 90 files | 7,096 lines in 170 files (mostly Library content and history) | 0 |
| CADOS | 53 lines in 16 files (`fly.toml` redirect hosts, deploy and status workflows, Live TLS, laptop toolkit, tests) | 140 lines in 40 files (public URL, add-in and Companion default address, docs) | 86 lines in 15 files | 0 |

Addresses that matter at cutover: `OPENSKETCH_PUBLIC_URL` and the OAuth issuer and resources; the Companion's
default address and its move list (0.13.0 moves cados.kevos.com, cados.fly.dev and cad.bizomat.ai to
https://bizomat.ai/cad); the Google sign-in callback; the website's links to `/cad` and `/tasks`; Project
Management's `APP_URL` and canonical URL; the laptop toolkit's checks; the Live TLS host list.

## 7. Background jobs, monitoring, integrations

- Project Management: Cron every 15 minutes (maintenance, scheduled automations) on Workers; the Node scheduler on Fly.
- CAD Automation: the supervisor and CAD workers inside its instance; no cron.
- Monitoring today: Fly health checks (`/__proxy/health`, `/healthz`, `/api/health`), GitHub `Live TLS` every day,
  the laptop's live checks after each deploy. On Cloudflare: Workers Logs and observability for both Workers and the
  container (seven days), Logpush if longer is wanted.

## 8. Recommended architecture (for the owner's approval)

```
<domain>             Worker bizomat        static site (assets) + its APIs; /tasks -> Project Management;
                                           /cad -> bizomat-mcp (service binding, keeps today's addresses working)
<domain>/tasks       Worker bizomat-tasks  Project Management as it ran on Cloudflare: D1, R2, KV, BoardRoom, cron
mcp.<domain>         Worker bizomat-mcp    front door for CAD Automation: TLS, logs, routing to
                     + Container           the existing server image (one instance, standard-2: 1 vCPU, 6 GiB),
                     + R2 bucket           its data folder persisted in R2
```

- **MCP server:** keep the Python server and its MCP implementation exactly as they are (no tool, schema, OAuth or
  device-protocol change) and run the image as a Container. The Worker `bizomat-mcp` forwards every request on
  `mcp.<domain>` to the one instance through its Durable Object. The primary MCP endpoint is
  `https://mcp.<domain>/mcp` (the server serves the root of that host). Old addresses keep working for connectors and
  computers set up with them: bizomat.ai/cad and its MCP and OAuth paths through the website Worker, and
  cados.kevos.com as an alias.
- **Persistence for the container:** restore the data folder from R2 before the server starts; write each JSON state
  file through to R2 when it changes; replicate `bridge.sqlite` continuously to R2 (Litestream, which speaks R2's S3
  API); flush everything on SIGTERM. One instance only, so there is one writer. Files in transit stay on local disk.
  This is new code (a small sidecar and the image's start script), tested by restarting the container repeatedly
  without losing data.
- **Project Management:** its own Worker (recommended) keeps its D1, R2, KV, Durable Object and cron bindings and its
  deploys apart from the website, as before 6 Nov; the website reaches it by service binding at `/tasks`, so visitors
  see one site. The alternative is to fold it into the `bizomat` Worker (one deploy for both).
- **Why not the Agents SDK for MCP:** it would mean rewriting the tools in TypeScript while they depend on the Python
  CAD kernel, and re-implementing OAuth with a different token store (every connector would have to sign in again).
  The existing server already provides Streamable HTTP and OAuth 2.1; the Worker in front of it is Cloudflare's way to
  run such a server.

## 9. Decisions needed before Phase 2

1. **Domain.** bizomat.io is not registered. Either register it (Cloudflare Registrar, then the zone is in the same
   account) or use bizomat.ai, which is already the owner's, on Cloudflare, with its certificate, email and every
   link: website `https://bizomat.ai`, MCP `https://mcp.bizomat.ai/mcp`.
2. **Workers Paid plan** for Containers ($5 a month plus usage). Running all month, one standard-2 instance (1 vCPU,
   6 GiB, the closest to today's Fly machine) is about $41 of memory and disk, one standard-1 (1/2 vCPU, 4 GiB) about
   $27, plus a few dollars of active CPU; less when it sleeps. A paired Companion's long poll keeps it awake.
3. **Project Management** as its own Worker (recommended) or inside `bizomat`.

## 10. Plan after approval (each phase ends with its checks; nothing on Fly changes until Phase 8)

| Phase | Work | Gate |
| --- | --- | --- |
| 2 Website | `bizomat` Worker config (custom domain, bindings, secrets list), guard updated, `/cad` and `/tasks` bindings, tests and a preview deploy on a workers.dev address | every test, the page crawl and API checks against the preview |
| 3 MCP | `bizomat-mcp` Worker + Container + R2 persistence; canonical host `mcp.<domain>`; old addresses as aliases; Companion 0.13.1 moves old addresses to the new one; contract test against `mcp-contract.json`; the official MCP client, the stand-in Companion and the self test against the preview | contract identical; OAuth, pairing, a tool call through a stand-in computer, restart without data loss |
| 4 Cloudflare setup | laptop commands to create D1, R2, KV, set secrets, attach domains; DNS records listed for approval | each resource checked by wrangler |
| 5 Data | backups of both Fly volumes; Project Management SQLite and files to D1 and R2; the CAD data folder to R2; counts and checksums compared | counts equal, sign-in works on the previews |
| 6 Tests | the full list in the request, recorded as run or not run | written results |
| 7 Cutover | deploy, attach domains, DNS, live checks, connectors re-added where needed | live checks on the public addresses |
| 8 Fly | cleanup commands prepared; run only after the owner's approval | owner's go-ahead |
