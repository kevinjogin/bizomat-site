# Discovery: CAD Automation (formerly CADOS)

Read-only discovery for the ERP architecture assessment, 13 Nov 2026. Nothing was changed.

## 0. Scope and sources

- **What was read.** `apps/cad/` in this repository. It is a byte-for-byte copy of `kevinjogin/bizomat-cad` at commit
  `e669cc6` (tree `e97f6f4`), pinned in `apps/cad-source.json`. It is never edited here: CAD Automation changes in
  bizomat-cad, then comes back with `node scripts/sync-cad.mjs to <commit>`.
- **Production facts** come from `docs/SITE-CAD-INTEGRATION.md`, which records what Fly reported on 9 Nov 2026.
  Production may run a different commit from the pinned copy. Where the two disagree, both are given (section 7).
- **Names.** The code keeps the internal name OpenSketch: the `opensketch` Python package, `OPENSKETCH_*` settings,
  cookies, COM ids, file paths and the `sw_` MCP tool names. The device protocol keeps KEVOS names (`KEVOS-Device`
  proofs, `kevos-*` message types). People see "BIZOMAT CAD Automation" (`apps/cad/opensketch/mcp_server.py` `NAME`).
- **Other sources:** `apps/cad/CLAUDE.md`, `apps/cad/docs/BRIDGE-PROTOCOL.md`, `apps/cad/docs/CADOS-ADDIN.md`,
  `apps/cad/docs/KEVOS-SECURITY.md`, `apps/cad/docs/KEVOS-INSTALL.md`, `apps/cad/docs/KEVOS-VERSIONS.md`,
  `infrastructure/migrate/cad/README.md`, `docs/company/README.md`, `docs/BIZOMAT-PROJECT-STATUS.md`.

## 1. Architecture

### 1.1 Components

| Component | Language and stack | Source | Runs where |
| --- | --- | --- | --- |
| Gateway server | Python 3.12, FastAPI 0.147, uvicorn 0.53, MCP Python SDK 2.2, sse-starlette | `apps/cad/opensketch/` (`server.py` is the app) | Fly app `cados` (Linux container). Can also run on one Windows PC (`apps/cad/windows/`) |
| Geometry kernel | build123d 0.13 on OpenCascade (OCP) | `opensketch/geometry.py`, `assembly.py`, `measure.py`, `preview.py`, `importer.py`, `features/` | Inside the server's CAD worker processes |
| Sketch solver | JavaScript, run with `node` once per check (30 s limit) | `opensketch/solver/solver.js`, `solve_cli.mjs`; called from `opensketch/inspection.py` | Server container |
| SOLIDWORKS add-in | C#, .NET Framework 4.8 x64, COM `ISwAddin`, SOLIDWORKS 2022 interop 30.5.1 (types embedded) | `apps/cad/solidworks/src/Addin`, `src/Core` | Inside SOLIDWORKS on the user's Windows computer |
| Companion | C#, .NET Framework 4.8, tray app `KEVOS.Companion.exe`, no SOLIDWORKS reference | `apps/cad/solidworks/src/Companion`, `src/Core/Bridge2` | User's Windows computer, one per Windows user, starts at sign-in |
| Manual installer and launcher | C#, `OpenSketchSW.exe` (per-user COM registration, launcher macro `Documents\OpenSketch\OpenSketch.swb`) | `apps/cad/solidworks/src/App` | User's computer, for locked-down or development machines |
| MSI installer | WiX 5, per-machine x64, "BIZOMAT CAD Automation for SOLIDWORKS" | `apps/cad/installer/KEVOS-Bridge.wxs`, `installer/build.ps1` | Installs the add-in and the Companion into `C:\Program Files\KEVOS\Bridge` |
| Cloudflare Worker `bizomat-mcp` | TypeScript, Cloudflare Container and R2 | `apps/cad/cloudflare/mcp/` | **Not deployed** (a planned move) |

Versions: the add-in, Companion and MSI are 0.13.0 (`apps/cad/solidworks/Directory.Build.props`). The server
reports its git commit, or `OPENSKETCH_VERSION` from the image build, on `/healthz` (`server.py` `VERSION`).
Licence: AGPL-3.0-only (`apps/cad/LICENSE`, `apps/cad/README.md`).

CAD Automation runs no AI of its own. The person's own AI app (Claude, ChatGPT or any MCP client) does the thinking and
calls the MCP tools (`apps/cad/docs/CADOS-ADDIN.md`, section 1).

### 1.2 Process model and start-up

- **Image** (`apps/cad/Dockerfile`): Python 3.12 slim pinned by digest, X/GL libraries for OpenCascade, `nodejs`,
  Python packages from `requirements.txt` with hashes. A .NET 8 stage builds the add-in zip for download (best effort).
- **Command:** `python -m opensketch --host :: --port 8080 --no-browser --supervise`.
- **Supervisor** (`opensketch/supervisor.py`): the parent process. It starts the server as a child, asks `/healthz`
  every 5 s and restarts the server after 120 s without an answer (thread stacks go to the log first). With
  `OPENSKETCH_PERSIST_URL` set it first restores the data folder from an object store (`opensketch/persist.py`;
  Cloudflare plan only).
- **Server** (`opensketch/__main__.py`): one uvicorn process. It listens on one dual-stack socket on `::` so the
  BIZOMAT router reaches it over Fly's private IPv6 network. Long polls get 3 s to finish on shutdown.
- **Lifespan** (`server.py` `lifespan`): warms the owner's "agent" CAD worker, then runs the MCP session manager.
- **Middleware**, outermost first (`server.py`): `CanonicalHost` (old hosts, the `/cad` prefix), `PagePolicy` (CSP,
  nosniff), `BodyLimit`, `RequestLog` (5xx and slow requests only), `PasswordGate` (sign-in, `opensketch/auth.py`).
- **CAD workers** (`opensketch/cadworker.py`): OpenCascade holds Python's lock for each call, so heavy geometry runs in
  separate processes (`spawn`). One worker per person and kind ("agent" for the `sw_` tools). At most 3 person workers
  live at once (`OPENSKETCH_CAD_LANES`), one place kept for the owner. Idle workers stop after 15 minutes. A worker
  over 800 MB is replaced after its call. One call runs at a time per worker; later calls wait.
- **Recovery:** `python -m opensketch --reset-password EMAIL` on the server (`fly ssh console`) gives an account a new
  password.

### 1.3 What runs where

**On the cloud server (`cados`):**
- sign-in pages, accounts, the owner's Admin page;
- OAuth for AI apps and the MCP endpoint with every tool;
- checks before anything reaches SOLIDWORKS: the feature registry (`opensketch/features/`), the sketch solver, and a
  predicted volume and bounding box for each feature, rebuilt on OpenCascade (`sw_tools.py` `_solve`, `_predict`);
- reading geometry: the add-in sends a STEP of the current body, and the server works out faces and edges,
  measurements, preview images, interference and mate suggestions (cached per person and part by SOLIDWORKS' update
  stamp);
- standard parts: ISO screws, nuts, washers and bearings are made as STEP on the server, then imported by SOLIDWORKS;
- the command queue, the audit record of every command to a paired computer, and short-lived files (uploads, exports).

**On the user's Windows computer:**
- SOLIDWORKS 2022 or newer, with the user's own licence, templates and files (`apps/cad/docs/KEVOS-INSTALL.md`);
- the add-in, which runs each command through the SOLIDWORKS API on SOLIDWORKS' UI thread, asks before destructive
  operations and shows a task pane;
- the Companion, which holds the device key, the signed outbound link to the server, pairing and verified updates.

**SOLIDWORKS is the master copy.** The server keeps no model. Every part, assembly and drawing is a file on the
user's computer (default folder `Documents\OpenSketch`).

### 1.4 The path of one command

```
AI app --MCP (HTTPS, OAuth)--> sw_ tool --swbridge.call--> devicebridge (paired computer, protocol 2)
                                                        or swbridge v1 (the add-in's direct link, fallback)
   --outbound HTTPS long poll from the computer--> Companion --named pipe--> add-in --> SOLIDWORKS API
```

- `swbridge.call` (`opensketch/swbridge.py`) sends to a paired computer when one is online
  (`devicebridge.pick`: by name, the only one, the only one with SOLIDWORKS, the default; else `DEVICE_AMBIGUOUS`),
  else to the v1 direct add-in link.
- Nothing connects in to the user's computer. The computer works behind a company firewall or proxy.

### 1.5 Realtime channels

| Channel | How | Limits |
| --- | --- | --- |
| MCP | Streamable HTTP, stateless; each answer is a server-sent event stream with a comment every 15 s (`mcp_server.py` `Endpoint.configure`) | A tool waits 240 s by default (`swbridge.DEFAULT_TIMEOUT`), 600 s for drawings, exports and imports, up to 900 s in total. Keeps Cloudflare's 100 s idle limit at bay |
| Companion to server | `GET /v2/device/next` long poll held 25 s; online = polled in the last 70 s (`devicebridge.py`) | Commands are signed JWS, delivered again without an ack after 10 s, at most 5 times |
| Add-in direct link (v1) | `GET /mcp/sw/next` long poll held 25 s (`swbridge.py`) | One session per person |
| Companion to add-in | Local named pipe `\\.\pipe\KEVOS.Bridge.<SID>`, 4-byte length frames (`Core/Bridge2/PipeLink.cs`, `Wire.cs`) | This Windows user only; the client must be SOLIDWORKS with the installed add-in |
| Browser pages | `static/ui/app.js` polls `/api/solidworks` every 4 s and recent activity every 15 s | Stops while the tab is hidden |

There are no WebSockets, no webhooks and no outbound event notifications.

## 2. Routes and entry points

**Addresses.** Public address `https://bizomat.ai/cad` (`OPENSKETCH_PUBLIC_URL`). Fly origin `https://cados.fly.dev`.
Old hosts `cados.kevos.com` and `cad.bizomat.ai` (`OPENSKETCH_REDIRECT_HOSTS`): pages there answer 301 to
bizomat.ai/cad; programs (`/healthz`, `/mcp*`, `/solidworks/mcp*`, OAuth, `/.well-known/`, `/v2/`, `/api/`) keep
answering at that host's root (`opensketch/canonical.py` `KEEP_PREFIXES`). `canonical.py` takes the `/cad` prefix off
each request and writes it back into links, redirects and cookie paths. Paths below are the app's own; on bizomat.ai
they sit under `/cad`.

### 2.1 Pages

| Path | What | Access |
| --- | --- | --- |
| `/` | Product page for visitors; Home for a signed-in person | Public / signed in |
| `/overview`, `/docs`, `/privacy` | Product page, documentation, privacy page | Public (`auth.PUBLIC_PAGES`) |
| `/dashboard` | Home: task box, connection summary, 4-step setup, recent activity | Signed in |
| `/assistant` | CAD Assistant: connector address, steps per AI app, connected apps | Signed in |
| `/solidworks` | Installer, computers (default, remove), how it connects | Signed in |
| `/tools` | Every MCP tool in plain words (`catalog.py`) | Signed in |
| `/history` | The person's commands to paired computers | Signed in |
| `/settings` | Account, private address, add-in key, password, sign out | Signed in |
| `/admin` | People, passwords, suspension, invites, open sign-up | Owner only |
| `/devices/pair` | Approve a computer's pairing code | Signed in |
| `/login`, `/logout`, `/setup`, `/signup`, `/access`, `/join/<invite>`, `/auth/google`, `/auth/google/callback` | Sign-in pages, handled inside `auth.PasswordGate` | Public |
| `/ui/*`, `/fonts/*`, favicons | Design system and fonts | Public |

### 2.2 REST API (`/api/*`)

These serve the app's own pages. They take the browser session cookie only. A browser write must come from the same
site (`auth._same_origin`). There is no API key for them.

| Endpoint | Purpose | Who |
| --- | --- | --- |
| `GET/POST /api/account` | Who is signed in; rename, change password | Signed in |
| `GET/DELETE /api/account/new-password` | The suggested password, shown once | Signed in |
| `POST /api/account/keep` | An early-access tester keeps the account | Tester |
| `POST /api/account/settings`, `DELETE /api/account/testers` | Open sign-up, early access code, remove testers | Owner |
| `GET/POST/DELETE /api/account/google` | Google sign-in client settings | Owner |
| `GET/POST /api/account/invites`, `DELETE /api/account/invites/{id}` | Invite links (7 days) | Owner |
| `POST /api/account/users`, `DELETE /api/account/users/{id}`, `POST .../{id}/password`, `POST .../{id}/suspend` | Add, remove, set password, suspend | Owner |
| `GET /api/admin/people` | People with their computer and app counts | Owner |
| `GET/DELETE /api/account/apps`, `DELETE /api/account/apps/{grant}` | Connected AI apps; disconnect | Signed in |
| `POST /api/connect/new_address` | A new private connector address | Signed in |
| `GET /api/sw`, `POST /api/sw/key`, `GET /api/sw/download` | v1 add-in key, new key, add-in zip | Signed in |
| `GET /api/solidworks` | Everything Home shows in one call | Signed in |
| `GET /api/devices`, `POST/DELETE /api/devices/{id}` | Paired computers: list, rename, default, remove | Signed in |
| `GET /api/commands?limit=` | The person's recent commands (up to 200) | Signed in |

### 2.3 MCP endpoints

Served by `mcp_server.Endpoint` for each path in `PATHS = ("/mcp", "/solidworks/mcp")`:

- `/mcp` and `/solidworks/mcp`: `Authorization: Bearer <OAuth access token>` (`_BearerGate`). Without a valid token:
  401 with a `WWW-Authenticate` pointer to the protected-resource metadata. CORS is open (`*`).
- `/mcp/<key>` and `/solidworks/mcp/<key>`: the person's private address, for apps that cannot sign in (`_TokenGate`,
  `auth.resolve_mcp`). A wrong key gives 404.
- `/solidworks/mcp` is a second address that early connectors used. A token from either path works on both.
- On bizomat.ai: `https://bizomat.ai/cad/mcp` is the address people are given; `https://bizomat.ai/mcp` also reaches
  CAD (it is in `CAD_PATHS`). The Cloudflare plan adds `https://mcp.bizomat.ai/mcp` (`OPENSKETCH_MCP_URL`; not deployed).

### 2.4 OAuth endpoints (for MCP clients)

- Metadata: `/.well-known/oauth-protected-resource`, `.../mcp`, `.../solidworks/mcp`;
  `/.well-known/oauth-authorization-server` (also `.../mcp`, `.../solidworks/mcp`). For the prefixed resource,
  `canonical.py` serves `/.well-known/oauth-protected-resource/cad/mcp`, `/.well-known/oauth-authorization-server/cad`
  and `/.well-known/openid-configuration/cad` at the root of bizomat.ai. Issuer: `https://bizomat.ai/cad`.
- `POST /oauth/register` (Dynamic Client Registration), `GET/POST /oauth/authorize` (consent page, then the decision),
  `POST /oauth/token`, `POST /oauth/revoke` (`server.py`, logic in `opensketch/mcpauth.py`).

### 2.5 SOLIDWORKS links

- **v1 direct add-in link** (`server.py`, `swbridge.py`), `Authorization: Bearer oss_...`:
  `POST /mcp/sw/hello`, `GET /mcp/sw/next`, `POST /mcp/sw/result`, `POST /mcp/sw/file`, `GET /mcp/sw/blob/{id}`.
- **v2 paired computers** (`devicebridge.py` router; contract in `apps/cad/docs/BRIDGE-PROTOCOL.md`), every request
  signed `Authorization: KEVOS-Device <JWS>`: `GET /v2/keys` (the gateway's public key);
  `POST /v2/devices/pair/start|poll|password`; `POST /v2/device/hello`, `GET /v2/device/next`,
  `POST /v2/device/ack|progress|status|result|unpair|file`, `GET /v2/device/blob/{id}`;
  `GET /v2/bridge/update.json` (signed release manifest for the Companion's updater).

### 2.6 Capability links, downloads and health

- `PUT/POST /mcp/uploads/{id}?expires=&signature=`: one-time upload link from `request_upload` (10 minutes, one use).
- `GET /mcp/artifacts/{id}/{filename}?expires=&signature=`: export download (1 hour; previews 10 minutes).
- `GET /download/solidworks` (signed in): the MSI. Order: `OPENSKETCH_INSTALLER_URL`, else a file on the volume
  (`/data/downloads/BIZOMAT-CAD-Automation-x64.msi`), else the published release record, else
  `https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi` (R2 bucket `bizomat-downloads`, served by the
  website). `GET /download/solidworks.sha256`: its checksum.
- `GET /healthz`: `{"ok": true, "version": "<commit>"}`, no sign-in. Used by the supervisor and deploy checks. The
  Cloudflare plan adds `/__worker/health` on the Worker.

### 2.7 How the website routes CAD paths

- One regular expression, `CAD_PATHS`, in two places that tests keep equal: `infrastructure/proxy/routes.mjs` (the Fly
  router in the `bizomat` app) and `src/server/platform-paths.ts` (the website's Cloudflare Worker, not deployed).
- It matches `/cad`, `/cad/...`, `/mcp...`, `/solidworks/mcp...`, `/oauth/...`, `/v2/...`, `/healthz` and the OAuth and
  OpenID `.well-known` paths (plus `acme-challenge`). On bizomat.ai, `/api/` is not in it: CAD's API is reached as
  `/cad/api/...`.
- The router sends them to `UPSTREAM_CAD = "http://cados.internal:8080"` (`fly.website.toml`), over Fly's private
  network. It never rewrites the path or the Host header. `cados.kevos.com` is proxied whole to CAD by host.
- `src/worker.ts` (`routeApps`) sends `CAD_PATHS` to the `CAD` service binding (the Worker `bizomat-mcp`) when bound,
  else to the origin. Not deployed.
- The website's product page is `/cad-automation/` (`src/pages/cad-automation.astro`), because `/cad` is the app.

## 3. The MCP tools

One MCP server named "BIZOMAT CAD Automation" with instructions for SOLIDWORKS work (`mcp_server.py` `INSTRUCTIONS`).
31 tools: 29 in `opensketch/sw_tools.py`, `sw_selftest` in `opensketch/sw_selftest.py`, `request_upload` in
`opensketch/mcp_server.py`. The grouping below is `opensketch/catalog.py`, which `tests/test_app_pages.py` keeps equal
to the registered tools. Every tool that reaches SOLIDWORKS takes an optional `device` (which paired computer) and
most take `doc` (a path or window title; omitted means the active document).

**Connection and documents**

| Tool | What it does |
| --- | --- |
| `sw_status` | Checks SOLIDWORKS is connected and lists open documents (path, type, active, unsaved); says if the add-in needs an update |
| `sw_get_guide` | Returns the working guide, drafting practice and the feature format (`docformat.py`) |
| `sw_create_document` | New part or assembly from the user's default template, saved (default `Documents\OpenSketch`), mm or inch |
| `sw_open_document` | Opens a .SLDPRT or .SLDASM, or brings it to the front |
| `sw_save` | Saves, or Save As a new path |
| `sw_get_document` | Reads the feature tree, rebuild errors, sketch states, dimensions, global variables, equations, volume, bounding box; for assemblies, components and mates |

**Building and changing parts**

| Tool | What it does |
| --- | --- |
| `sw_add_features` | Makes sketches and features (extrude, revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, linear and circular patterns, planes); each sketch is solved and checked first |
| `sw_batch` | Up to 100 steps (`sw_add_features`, `sw_insert_component`, `sw_add_mate`, `sw_set_parameter`, `sw_set_equation`) as one change, rolled back if a step fails |
| `sw_delete_items` | Deletes features, components or mates; `dry_run` lists dependants; confirmed at the computer by default |
| `sw_undo` | Edit > Undo, 1 to 20 steps; confirmed at the computer by default |
| `sw_set_parameter` | Creates, changes or removes a SOLIDWORKS global variable |
| `sw_set_equation` | Drives a dimension or feature field with an equation |
| `sw_standard_part` | Makes an ISO screw, nut, washer or ball bearing to size and saves it as a part |

**Assemblies**

| Tool | What it does |
| --- | --- |
| `sw_insert_component` | Inserts a part or sub-assembly at a position |
| `sw_add_mate` | Adds a mate (coincident, concentric, parallel, perpendicular, distance, angle, lock, hinge, limits) |
| `sw_find_mate_candidates` | Suggests likely mates, such as shafts in holes |
| `sw_check_interference` | Lists overlapping component pairs with the overlap volume |

**Checking and measuring**

| Tool | What it does |
| --- | --- |
| `sw_inspect_design` | Feature states, volume, area, centre of mass, bounding box, mass with the SOLIDWORKS material, sketch states |
| `sw_measure_items` | Measures faces, edges and points, like Evaluate > Measure |
| `sw_body_topology` | Lists faces and edges with references for picking |
| `sw_preview` | A PNG of the model from any view, close-up or section; or a screenshot of the SOLIDWORKS window |

**Drawings**

| Tool | What it does |
| --- | --- |
| `sw_create_drawing` | A native .SLDDRW of a saved part or assembly: sheet A4 to A0, third or first angle, standard views plus isometric, a preferred scale, model dimensions, centre marks, general notes, title block fields as custom properties (up to 30); saved next to the model |
| `sw_get_drawing` | Reads the sheet (size, scale, projection), every view and the title block custom properties |
| `sw_edit_drawing` | Up to 40 actions in order: model, projected, section and detail views; move, scale, display, delete, rename views; dimensions, centre marks, notes, title block properties, sheet scale and projection, a BOM table with balloons |

**Files**

| Tool | What it does |
| --- | --- |
| `sw_import` | Opens a STEP, IGES or Parasolid file and saves it as SOLIDWORKS files (32 MiB at most) |
| `request_upload` | A one-time link to send a large file with an HTTP PUT, then `sw_import(upload_id)` |
| `sw_export` | Exports STEP, STL, Parasolid, IGES, native copies, PDF; from drawings PDF (all sheets), DWG or DXF (active sheet); returns a download link valid for one hour |

**Computers and commands**

| Tool | What it does |
| --- | --- |
| `sw_list_devices` | The person's paired computers: online, default, SOLIDWORKS sessions and add-in versions |
| `sw_command_status` | One command's state, history, progress and result, including one that finished after its call gave up |
| `sw_cancel_command` | Cancels a command: withdrawn if not started; a running batch stops and rolls back |
| `sw_selftest` | Checks a computer in stages (plate, shapes, assembly) in scratch files, step by step |

Server-side checks on drawing actions and title block fields happen before anything is sent (`sw_tools.py`
`DRAWING_ACTIONS`, `_drawing_action`). Older add-ins are refused with a message to update (`swbridge.addin_too_old`).

## 4. Data

### 4.1 Where data is stored

- **One data folder**, `OPENSKETCH_DATA`: `/data` on the Fly volume `opensketch_data` (1 GB). Default elsewhere:
  `~/opensketch-data` (`opensketch/store.py`).
- **No database server.** Small JSON files plus one SQLite file, `bridge.sqlite`, in WAL mode
  (`devicebridge.py` `_db`). Writes go through temporary files and file locks (`store.file_lock`).
- **Disk guard:** writes are refused when less than 150 MB would stay free (`OPENSKETCH_DISK_RESERVE_MB`).
- **Cloudflare plan (not deployed):** the container's disk does not last, so `persist.py` restores the top-level state
  files from the R2 bucket `bizomat-mcp-data` (keys `data/<name>`) and copies changes back every 2 s. It refuses to
  start the server when R2 holds no accounts. State files over 64 MiB are not copied.

### 4.2 Files in the data folder

| File | Holds |
| --- | --- |
| `users.json` | Accounts (`id`, `email`, `name`, `role`, scrypt `salt` and `hash`, `created`, `email_verified`, `google`, `mcp_n`, suspension, `pw_by`, `pw_at`), invites (SHA-256 only), settings (open sign-up, access code) |
| `accounts.enabled` | Marker written with the first account; a missing `users.json` then fails closed |
| `sessions.json` | Browser sessions: SHA-256 of the cookie token, user, created, expires (90 days) |
| `mcp_oauth.json` | OAuth clients (secrets hashed), grants (one per person and app, refresh token hash), live access tokens (hashed) |
| `google_oauth.json` | Google sign-in client, its secret encrypted (`secretbox.py`) |
| `swbridge.json` | Counters for each person's v1 add-in key |
| `secret`, `secret.keys`, `ai_keys.secret` | Base secrets: private addresses, add-in keys, link signatures, the Fernet key |
| `bridge-signing-key.pem` | The gateway's P-256 command key; Companions pinned it at pairing |
| `bridge.sqlite` | Paired computers, pairings, every command to a paired computer |
| `bridge-release.json` | The Companion release offered to computers (operator-written) |
| `uploads/`, `artifacts/`, `bridge-files/` | Files in transit: uploads (30 minutes), exports (1 hour), command file chunks |
| `downloads/` | An installer the operator may place there |

### 4.3 `bridge.sqlite` tables (`devicebridge.py` `SCHEMA`)

- `devices`: `id`, `owner` (account id), `name`, `jwk` (public key), `jkt` (key thumbprint, unique), `created`,
  `last_seen`, `revoked`, `is_default`, `info`.
- `pairings`: `id`, `code` (user code), `jwk`, `jkt`, `name`, `info`, `created`, `expires`, `status`, `device_id`,
  `owner`, `ip`.
- `commands`: `id`, `device_id`, `owner`, `tool`, `op`, `effect`, `risk`, `params_sha256`, `status`, `created`,
  `expires`, `updated`, `attempts`, `history` (JSON, last 50 state changes), `result` (JSON), `error` (JSON),
  `correlation`, `client` (the AI app grant). Index on `(owner, created)`.

Command states: `queued`, `delivered`, `accepted`, `running`, then `succeeded`, `failed`, `cancelled`, `expired`,
`rejected`, `denied` or `unknown` (the server restarted while it ran) (`apps/cad/docs/BRIDGE-PROTOCOL.md`, section 4).

### 4.4 What an engineering record looks like

- **There is no engineering record on the server.** No model store, no drawing register, no revisions, no part
  numbers, no PDM and no BOM table. Parts, assemblies and drawings are SOLIDWORKS files on the user's computer.
- **A command record** is the nearest thing to a job. `sw_command_status` returns: `command_id`, `device`, `tool`,
  `op`, `effect`, `risk`, `status`, `created_at`, `expires_at`, `updated_at`, `attempts`, `history`, and when present
  `progress`, `waiting_for`, `result`, `error` (`devicebridge.command_record`). Commands through the v1 direct link
  are not recorded.
- **Read on demand from SOLIDWORKS:** the feature tree, sketches, dimensions, global variables and equations,
  components and mates (`sw_get_document`); volume, area, mass, centre of mass, bounding box and material name
  (`sw_inspect_design`, add-in `Commands.cs`); a drawing's sheet, views and title block custom properties
  (`sw_get_drawing`, add-in `DrawingEdits.cs`).
- **Not read or written by any tool:** a part's or assembly's own custom properties (part number, description),
  SOLIDWORKS configurations, and a BOM as data (the `bom` drawing action inserts a table into a drawing only). Equations
  are written for all configurations (`apps/cad/CLAUDE.md`, Known limits).
- **Transient copies on the server:** a STEP of the current body for reading tools (worker memory), exports for one
  hour, previews for ten minutes, uploads for thirty minutes. Room: 32 files or 128 MiB of exports per person, 256 MiB
  in all (`artifacts.py`); 4 pending uploads per person, 192 MiB in all (`uploads.py`).

### 4.5 Retention

- Browser sessions last 90 days; invites 7 days; pairings are deleted an hour after they expire.
- OAuth access tokens last 1 hour, refresh tokens 90 days; client registrations never used for a grant go after 30 days.
- Command history in `bridge.sqlite` is never pruned. It grows with use (also noted in `apps/cad/CLAUDE.md`).

## 5. Accounts and tenancy

### 5.1 People and sign-in

- **Its own accounts** (`opensketch/accounts.py`, `auth.py`). Email and password (scrypt, at least 8 characters).
  Sessions are random cookie tokens (`opensketch_user`), 90 days, only their SHA-256 stored.
- **Google sign-in** (`opensketch/oauth.py`): optional OpenID Connect. Configured with `GOOGLE_CLIENT_ID` and
  `GOOGLE_CLIENT_SECRET` or by the owner. An existing account is linked by Google id or by the same verified email; a
  new account needs an invite or open sign-up. Callback `https://bizomat.ai/cad/auth/google/callback`.
- **Roles:** `owner` (the first person to submit `/setup`; administers everyone), `member`, `tester` (early access by
  code, "Internal tester N", until kept with an email and password). There is no other role.
- **Modes** (`auth.mode`): `accounts` (an account exists: everything needs sign-in), `setup` (no account on a server
  others can reach: only `/setup` and product pages answer), `open` (no account, request from the machine itself).
- **Joining:** invite links (7 days, single use), open sign-up when the owner turns it on, early access code.
- **Suspension:** the owner suspends a person. Sessions, OAuth tokens, the private address, the add-in key and paired
  computers stop at once; nothing is deleted. **Removal** also revokes the person's apps and computers.

### 5.2 Tenancy

- **No organisations, teams, companies or departments.** One server has one owner and any number of people.
- Everything else is **per person**: their SOLIDWORKS link, paired computers, commands, connected AI apps, uploads,
  exports and CAD worker. People never see each other's.
- The owner sees, on Admin, each person's name, email, role, number of computers (and online), and the names of
  their connected AI apps (`GET /api/admin/people`). Not their commands.

### 5.3 Credentials for MCP clients

- **OAuth 2.1** (`opensketch/mcpauth.py`): Dynamic Client Registration (RFC 7591) and client metadata documents
  (fetched through `safefetch.py`: public https only); PKCE S256 required; the person signs in and clicks Allow on a
  consent page. Access token 1 hour, refresh token 90 days, rotated on each use. Grant types: `authorization_code`
  and `refresh_token` only. One scope, `opensketch`. One grant per person and app. Tokens are opaque and stored hashed.
- **Every token stands for one person.** There is no client-credentials grant and no service account.
- **Private address** `/mcp/<key>` for apps that cannot sign in: HMAC of the data folder's secret over the person's id
  and a counter (`auth.mcp_token_for`). "New address" voids the old one. The owner may still hold the server-wide
  address from before accounts (`OPENSKETCH_MCP_TOKEN`, or one derived from a legacy `OPENSKETCH_PASSWORD`).

### 5.4 Credentials for computers

- **v1 add-in key** `oss_...` (`swbridge.key_for`): per person, HMAC with a counter. Reaches only the add-in link.
  Stored on the computer in HKCU, encrypted with DPAPI.
- **Paired computers (v2):** the Companion makes an EC P-256 key in the Windows key store (TPM first, not
  exportable). Pairing: it shows a user code (like `ABCD-EFGH`, 10 minutes), and the person approves it at
  `/devices/pair`, or types their email and password in the Companion's window. The computer is bound to that account.
  Every request is a JWS over method, path, time, a one-time id and the body hash. Every command is a JWS signed by the
  gateway's key, names one computer, carries an expiry and runs at most once (`devicebridge.py`,
  `apps/cad/docs/KEVOS-SECURITY.md`).

### 5.5 BIZOMAT accounts

- **Planned:** "Sign in with BIZOMAT" (`docs/company/README.md`, section "BIZOMAT sign-in for CAD Automation"). The
  provider side exists in the Project Management app (`apps/work/src/worker/company/id-provider.ts`): OAuth 2.0 code
  with PKCE, `/company/authorize`, `/company/api/id/token`, `/company/api/id/userinfo` (returns `sub`, `email`,
  `email_verified`, `name` and the person's companies with role). The client list `BIZOMAT_ID_CLIENTS` is not set yet
  (`docs/BIZOMAT-PROJECT-STATUS.md`, 13 Nov 2026).
- **Not built on the CAD side.** The pinned copy has no "Sign in with BIZOMAT" button and no
  `/auth/bizomat/callback` route. **CAD Automation cannot yet accept BIZOMAT accounts.** People keep separate CAD
  accounts. The plan is to link an existing CAD account only by a confirmed email, as Google sign-in does, so its
  connectors and paired computers keep working.

## 6. Permissions and security

- **Sign-in gate** (`auth.PasswordGate`): refuses paths with `.`, `..`, `//` or backslashes (400). Browser writes
  must come from the site itself (`Origin` / `Sec-Fetch-Site`), else 403. Machine paths (MCP, OAuth, `/v2/`) are
  checked by their own credentials instead. Pages without a session redirect to `/login`; APIs answer 401. In setup
  mode nothing but setup and product pages answers.
- **Owner-only actions** use `server._owner` (403 for anyone else). The owner cannot read passwords back; only the
  hash is kept.
- **Per-person isolation:** tools act only on the calling person's SOLIDWORKS link and computers; commands are looked
  up by `owner` (`command_record`); uploads are refused to anyone but their owner (`uploads.take`); CAD workers and
  geometry caches are per person.
- **No fine-grained permissions for AI apps.** One OAuth scope gives every tool. Tool annotations mark read-only tools
  (`ToolAnnotations`), but nothing enforces read-only access per client.
- **Risk and confirmation:** each add-in operation has an effect and a risk (`devicebridge.OPS`, `risk_of`). Delete,
  undo, Save As to a path, overwriting a drawing, removing a variable and deleting a drawing view are "high". The
  add-in asks the person at the computer to confirm these by default (`Addin/Safety.cs`; a setting in the task pane).
  Parameters are checked by the tool, by the gateway (known op, size, no credentials), by the Companion and by the
  add-in. Commands are refused while SOLIDWORKS shows a modal dialog it can detect.
- **Rate limits** (in memory, per address; IPv6 counted per /64):

| What | Limit | Source |
| --- | --- | --- |
| Failed sign-ins | 8 per email per 15 minutes; 8 per address per 5 minutes | `auth.py` `LIMIT`, `WINDOW`, `IP_WINDOW` |
| New accounts | 30 per address per hour | `auth.NEW_PER_HOUR` |
| OAuth client registrations | 30 per address per hour | `mcpauth.REGISTER_LIMIT` |
| OAuth token and revoke | 120 per address per minute | `mcpauth.TOKEN_LIMIT` |
| Pairing starts | 20 per address per hour | `devicebridge.PAIR_LIMIT` |
| Companion password pairing | As sign-in | `devicebridge.pair_password` |

  No rate limit on MCP tool calls was found. Each person's CAD worker runs one call at a time.
- **Size limits:** form bodies 64 KB, API and MCP bodies 68 MiB (`server.BodyLimit`); imports 32 MiB; files from
  SOLIDWORKS 128 MiB (chunks of 32 MiB); a command 1 MiB.
- **Page headers:** a Content Security Policy on every HTML answer (scripts only from the server and two hashed inline
  scripts), `nosniff`, `X-Frame-Options: DENY`. bizomat.ai is one origin shared with the website and Project
  Management, which is why the policy is strict (`server.PAGE_CSP`).
- **Capability links:** export and upload links are signed and expire. Anyone holding an export link can download that
  one file within the hour.
- **Client address:** `Fly-Client-IP` or `X-Forwarded-For`; `CF-Connecting-IP` is believed only from Cloudflare's
  edge ranges (`auth.CLOUDFLARE_NETS`).
- **Audit:** every command to a paired computer is stored with who, which AI app, which computer, tool, op, risk,
  a parameters hash and each state change. Logs hold command ids, ops and file names, not parameters
  (`apps/cad/docs/KEVOS-SECURITY.md`). The server logs only 5xx and slow requests (`server.RequestLog`).
- **Data leaving the computer:** reading tools send a STEP of the current body to the server; exports send the
  exported file (`apps/cad/docs/KEVOS-SECURITY.md`, "Data that leaves the computer").

## 7. Deployment

### 7.1 Production (Fly app `cados`)

| Item | `docs/SITE-CAD-INTEGRATION.md` (read from Fly, 9 Nov 2026) | Pinned copy (`apps/cad/fly.toml`, `.github/workflows/deploy.yml`) |
| --- | --- | --- |
| Repository | `kevinjogin/bizomat-cad` | same |
| Region | **Amsterdam (`ams`)** | `primary_region = 'syd'`; deploy workflow `REGION: syd` |
| Machine | One Machine `app`, shared CPU, 2 vCPUs, 2048 MB | `performance-1x`, 2 GB |
| Volume | `opensketch_data`, 1 GB | `opensketch_data` at `/data` (made with 1 GB) |
| Deploy workflow secret | `FLY_CADOS_TOKEN` | `FLY_API_TOKEN` |

The integration doc says each repository's Fly configuration matches production, so bizomat-cad has probably changed
since the pinned commit. This needs confirming against bizomat-cad `main` and `fly status`.

Common to both:
- `internal_port = 8080`, `force_https`, `auto_stop_machines = 'suspend'`, `auto_start_machines = true`,
  `min_machines_running = 0`, concurrency soft 200 / hard 1000 requests, `kill_timeout = 15s`.
- Environment: `OPENSKETCH_DATA=/data`, `OPENSKETCH_PUBLIC_URL=https://bizomat.ai/cad`,
  `OPENSKETCH_REDIRECT_HOSTS=cados.fly.dev,cados.kevos.com,cad.bizomat.ai`.
- Secret names the server reads (values not recorded here; which are set is not known): `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`, `OPENSKETCH_ACCESS_CODE`, `OPENSKETCH_KEY_SECRET`, `OPENSKETCH_MCP_TOKEN`,
  `OPENSKETCH_ADDIN_URL`, `OPENSKETCH_INSTALLER_URL`, and a legacy `OPENSKETCH_PASSWORD` that may still be set (it only
  seeds the owner's old private address). No server password is needed.
- **How it deploys:** the Fly app is linked to the repository and Fly builds every push to `main` itself (`/healthz`
  then reports "dev"). `deploy.yml` deploys only when run by hand (or with `DEPLOY_ON_PUSH`), after the tests, and
  fails if `/healthz` does not show the new version within 3 minutes. Each deploy restarts the one server (about 15 s
  offline). `fly-status.yml` reads the app's state.
- **Suspend and the private network:** Fly wakes a suspended Machine for public requests, and the add-ins' long polls
  keep it awake. Requests over the private network (the router's `cados.internal`) do not wake it, so `bizomat.ai/cad`
  can fail while `cados` is suspended. A bizomat-cad branch proposes `auto_stop_machines = "off"`; not merged
  (`docs/SITE-CAD-INTEGRATION.md`, section 1).
- **Shared with the site:** nothing. No shared database, queue or secret. Both apps must stay in the same Fly
  organisation for `cados.internal` to resolve.

### 7.2 Add-in and installer releases

- `solidworks.yml` (bizomat-cad) builds and tests the add-in and Companion and builds the MSI on Windows, unsigned
  unless signing secrets are set. Releases on GitHub are private.
- The public MSI, its `.sha256` and the release record are put in the R2 bucket `bizomat-downloads` from the laptop
  (`tools/laptop/cloudflare.ps1 publish installer`); the website serves `/downloads/cad/`.
- Silent install for IT: `msiexec /i BIZOMAT-CAD-Automation-x64.msi /qn GATEWAY_URL=https://bizomat.ai/cad`
  (`apps/cad/docs/KEVOS-INSTALL.md`).

### 7.3 The planned move into `bizomat` (not carried out)

- Plan (6 Nov 2026): a `cad` process group in the `bizomat` app, performance-1x 2 GB, volume `cad_data` (3 GB, Sydney),
  with the data moved byte for byte by `infrastructure/migrate/cad/to-fly.mjs` (laptop: `bizomat.ps1 move cad`) and a
  holding page on an empty volume. Rehearsed in CI (`infrastructure/migrate/test/cad-move/rehearse.sh`).
- **Not carried out.** The `cad` group never ran and was removed from `fly.website.toml` on 9 Nov 2026. CAD stays in
  `cados`. The site's image (`infrastructure/fly/Dockerfile`) still builds CAD stages from `apps/cad`, and
  `infrastructure/fly/entrypoint.sh` still has a `cad` role, which is why the copy stays.
- **Cloudflare plan (also not deployed):** Worker `bizomat-mcp` at `mcp.bizomat.ai`, one Container (`standard-2`,
  `max_instances` 1, sleeps after 30 minutes), data in R2 `bizomat-mcp-data` (`apps/cad/cloudflare/mcp/`,
  `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`).
- **Self-hosting:** the same server can run on one Windows PC on port 8000 (`apps/cad/windows/`), optionally behind a
  tunnel.

## 8. Integration points an ERP could use

### 8.1 What exists today

The only programmatic API is **MCP over HTTPS**. MCP is JSON-RPC; any MCP client can call `tools/list` and
`tools/call`, not only an AI app. It authenticates as **one person**: with that person's OAuth token at `/mcp`, or with
their private address `/mcp/<key>`. Every call needs that person's computer online with SOLIDWORKS open.

| ERP need | Today | Notes |
| --- | --- | --- |
| Generate a drawing for a product | `sw_create_drawing` with `properties` (for example `DrawingNo`, `Revision`, `Material`), then `sw_edit_drawing` | The model must be a saved file on the user's computer; overwriting asks for confirmation at the computer by default |
| Export files | `sw_export`: STEP, STL, Parasolid, IGES, native copies, PDF, DWG, DXF | Returns a `download_url` valid for one hour; the ERP must fetch and keep the file itself |
| Read properties | `sw_get_drawing` (title block custom properties); `sw_inspect_design` (mass, volume, area, bounding box, material name); `sw_get_document` (dimensions, global variables, components, mates) | Part and assembly custom properties are not readable |
| Drive a configurable product | `sw_set_parameter`, `sw_set_equation`, `sw_batch` | Global variables and equations only; no configurations |
| Import a supplier model | `request_upload` then `sw_import` | 32 MiB at most |
| Job status | `sw_command_status`, `sw_cancel_command`; a long call returns `STILL_RUNNING` with a `command_id` | Paired computers only; poll, there are no callbacks |
| Which computers can work | `sw_status`, `sw_list_devices` | Per person |
| History | `GET /api/commands`, `GET /api/devices` | Browser session cookie only: not usable from a server |
| Monitoring | `GET /healthz` | Public, no data |

### 8.2 What would be new

- Service-to-service access: a client-credentials grant, service accounts or API keys with scopes. Today every token
  is a person and every scope is all tools.
- A REST or job API that does not go through MCP, with webhooks or events when a command finishes.
- Reading and writing part and assembly custom properties; reading a BOM as data; SOLIDWORKS configurations.
- A server-side file store, revisions or a PDM link. Today files live only on the user's computer and exports last an
  hour.
- Tenancy that matches BIZOMAT companies and departments. CAD has one owner per server and personal resources only.
- "Sign in with BIZOMAT" on the CAD side (section 5.5), and a way to map a BIZOMAT company to CAD people.
- A queue that spreads work across several SOLIDWORKS computers or people. Today a command goes to one person's
  computer, and each SOLIDWORKS session runs one command at a time.

## 9. Feature inventory (in user terms)

- Connect an AI assistant (Claude, ChatGPT and other MCP apps) to SOLIDWORKS on your own computer, by signing in from
  the app or with a private address.
- Install one Windows package (add-in and Companion); add the computer to your account with a short code or your
  email and password; several computers per person, with a default.
- Ask in plain words; the assistant builds native SOLIDWORKS parts with fully defined sketches, extrudes, revolves,
  sweeps, lofts, holes, fillets, chamfers, shells, drafts, mirrors, patterns and planes.
- Every feature is checked first: sketches solved, volume and size predicted, and compared with what SOLIDWORKS made.
- Build in steps that roll back as one if a step fails; undo; delete with a dry run.
- Global variables and equations.
- Assemblies: insert components, add mates, get mate suggestions, check interference.
- ISO screws, nuts, washers and ball bearings made to size.
- Measure, inspect mass properties, list faces and edges, preview images and screenshots, sections.
- Drawings: create from a saved model with standard views, scale, dimensions, centre marks, notes and title block;
  add section, detail and projected views, notes, a parts list with balloons; read the layout back.
- Import STEP, IGES and Parasolid; export STEP, STL, Parasolid, IGES, native files, PDF, DWG and DXF.
- See command progress, cancel commands, and a history of commands to your computers.
- Confirm deletions, undo and overwrites at the SOLIDWORKS computer before they happen.
- A self test that checks a new computer step by step.
- Admin for the owner: add people, invite links, open sign-up, set passwords, suspend and remove people, see their
  computers and connected apps. Google sign-in optional.
- Pages under bizomat.ai/cad with the BIZOMAT footer; light theme only in the pinned copy (no system or dark theme).

## 10. Constraints and risks for ERP integration

- **Separate repository and app.** CAD changes only in `kevinjogin/bizomat-cad` and deploys to `cados` from there.
  `apps/cad` here is a pinned copy that must not be edited. Any change to CAD paths, MCP endpoints, OAuth paths or the
  device API must change both repositories together (`docs/SITE-CAD-INTEGRATION.md`, sections 2 and 7).
- **Pinned copy versus production.** The copy is `e669cc6`. Region, machine size and the deploy secret name differ
  between the copy and the integration doc (section 7.1). Production should be checked before design decisions.
- **Separate accounts.** CAD keeps its own users, sessions and OAuth. BIZOMAT sign-in exists only on the provider
  side; the CAD client is not built. No company, department or role model to map from the ERP.
- **Person-bound access.** No service identity. An ERP would act as a person, with that person's consent page, a
  90-day refresh token, or a private address that is a long-lived secret in a URL.
- **Region and availability.** `cados` runs in Amsterdam while `bizomat` runs in Sydney: about a quarter of a second
  per request. One Machine, one server process, live sessions and waiting calls in memory; a restart or deploy marks
  open commands `unknown`. A suspended Machine is not woken by the router's private-network requests.
- **A SOLIDWORKS computer is required.** Every model operation needs a Windows 10 or 11 computer with SOLIDWORKS 2022
  or newer running, the add-in loaded, the Companion paired and online. A modal dialog blocks commands. Destructive
  operations wait for a person at the computer by default. Each SOLIDWORKS session runs one command at a time, and
  tools time out after 4 to 15 minutes.
- **Licensing.** SOLIDWORKS runs on the user's own licence (`opensketch/site.py`). Whether unattended or
  server-driven use of a seat is allowed is not addressed in the repository; it depends on the SOLIDWORKS licence
  terms. CAD Automation itself is AGPL-3.0-only: users of it as a network service must be offered its source.
  `docs/BIZOMAT-PROJECT-STATUS.md` (section 7) still says "the repository is public", but every repository has been
  private since 7 Nov 2026.
- **Maturity.** The Companion, the MSI, the add-in's new UI, events, confirmation and modal check have been compiled
  but not run on Windows; the drawing editing API has not run in a real SOLIDWORKS; the MSI is unsigned; ChatGPT and
  Grok connectors are untested (`apps/cad/CLAUDE.md`, Known limits and Next; `apps/cad/docs/KEVOS-VERSIONS.md`).
- **No engineering data of record.** No revisions, part numbers, BOM data or file store on the server. Exports vanish
  after an hour. An ERP would have to hold any record itself.
- **Small storage.** A 1 GB volume; 256 MiB for exports, 192 MiB for uploads; command history never pruned.
- **Data leaves the computer.** Geometry reads send a STEP of the body to the server; exports pass through it. This
  matters for client confidentiality and for the server's region.
- **Planned changes in flight.** The Cloudflare plan would add `mcp.bizomat.ai/mcp`, move data to R2, sleep the
  container after 30 minutes, and limit state files to 64 MiB. Old hosts still serve programs and must keep working
  until every connector and computer uses `bizomat.ai/cad`.
- **Legacy names in contracts.** Tool names (`sw_*`), the OAuth scope (`opensketch`), settings (`OPENSKETCH_*`) and
  protocol names (`KEVOS-*`) are part of the interface. Renaming them breaks connectors and paired computers.
