# CLAUDE.md

Guidance for AI coding agents (and people) working in this repository.

## What this repo is

CADOS by KEVOS (product name; the code keeps OpenSketch as its internal name: the `opensketch` package,
`OPENSKETCH_*` settings, cookies, the add-in's COM ids and file names, the MCP tool names) connects AI apps (Claude,
ChatGPT and other MCP clients) to SOLIDWORKS on the user's own PC. The AI
calls the `sw_` MCP tools; the server checks each sketch and feature with OpenSketch's build123d/OpenCascade
kernel, queues the work, and the OpenSketch add-in in SOLIDWORKS (`solidworks/`, C#) fetches it over outgoing HTTPS
and makes native SOLIDWORKS features. A home page sets it up. License: AGPL-3.0-only.

BIZOMAT CAD Automation for SOLIDWORKS (0.13.1; CADOS for SOLIDWORKS in 0.12, KEVOS Bridge up to 0.11) builds on it: the server is the CADOS gateway; each
Windows computer runs the native CADOS add-in (COM `ISwAddin`, Tools > Add-Ins > CADOS, CADOS tab, menu and task pane)
and the KEVOS Companion (tray app, starts with Windows, registered by pairing) which holds a signed outbound link to the
gateway and hands commands to the add-in over a local named pipe; one MSI ("CADOS for SOLIDWORKS") installs both.
`docs/CADOS-ADDIN.md` has the architecture, the gap report (there was never a macro product: the add-in was always a
COM add-in) and the release process. Docs: `docs/BRIDGE-PROTOCOL.md` (the contract),
`docs/KEVOS-*.md` (install, Cloudflare, security, versions, troubleshooting, build, signing, test report, release
notes). The MSI builds unsigned on Windows in CI (`installer` job); release signing waits for a signing service.
Development signing (`installer/sign-development.ps1`, `docs/BIZOMAT-DEV-SIGNING.md`) runs on the Windows development
computer with a self-signed `CN=BIZOMAT Development` certificate from its certificate store (not trusted elsewhere);
`installer-test.yml` runs it with a throwaway certificate, and (job `upgrade`, `.github/scripts/test-upgrade.ps1`) installs
0.13.0 built from ce0c810, upgrades it to the current version and checks the upgrade in place: one product, the new
version in the install record and the list of apps, the Companion and add-in replaced, the registrations, and each
person's settings and data kept. Installer backups: `backups/installer/` (original, as
released; development-signed), never overwritten. The development certificate in use since 16 Nov 2026 (AEDT) is
`CB6DBE7431F93403751B1BFE72B6C514D5E23F69` (`installer/signing/`), made on the owner's current PC; the 8 Nov one
(`DBEB45D1...`, which signed 0.13.0) is on no computer any more. The development-signed 0.13.1 is backed up in
`backups/installer/development-signed/0.13.1-20261116-0918` (branch `installer-0.13.1-dev`): its program files are
byte for byte the CI build's apart from the signatures, and its text files apart from line endings.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Test before committing: `pytest -q` (needs node for the sketch solver; the slow KEVOS end-to-end test needs the .NET
  8 SDK) and `npm test` (the solver alone); the add-in and Companion with `bash solidworks/build.sh test` (.NET 8 SDK);
  the Cloudflare Worker with `cd cloudflare/mcp && npm ci && npm run check` (Node 22, python3). For page changes, check the page in Chromium with
  Playwright at desktop and phone width.
- No emojis anywhere. Plain language, short sentences, little text on pages.
- BIZOMAT corporate footer (owner, 8 Nov 2026; the website's `src/config/platform.ts` is the source): `brand.SLOGAN`
  ("Connecting Intelligence. Empowering Progress."), `brand.CORPORATE` (short description) and
  `brand.copyright_line()` ("(c) <year> BIZOMAT. All rights reserved.") in the site footer, the app footer and the
  sign-in panel; the footer's BIZOMAT column links Home, About (/engine-room/), Systems (/systems/) and Contact on
  bizomat.ai (owner, 14 Nov 2026: Systems replaced Products and Project Management); legal links read Privacy Policy
  and Terms of Use. Product name, headline, logo and colours unchanged.
- Brand: CADOS by KEVOS. Never "OpenSketch" in anything people read (pages, MCP server name, messages); real file
  paths and file names (`Documents\OpenSketch`, `OpenSketchSW.exe`) stay as they are. Logos are SVG paths in
  `brand.py`: the CADOS wordmark (built from the KEVOS letterforms) with "by KEVOS"; the KEVOS logo links to
  https://kevos.com/. One design system for every page: tokens and components in `opensketch/static/ui/cados.css`,
  set to kevos.com's own tokens (its `src/styles/global.css`: paper #fbfaf7, ink #1c1b19, muted #69665f, logo orange
  #ff6a13 for marks, accent #c2410c for buttons and links, hover #9a3412, 8 px buttons, 14 px cards, one family
  Inter Tight), shared head/header/footer in `brand.py`. The KEVOS wordmark path and the favicon are kevos.com's
  official files (`static/ui/kevos-wordmark.svg`, `static/favicon.svg`; `favicon.ico` and `ui/icon-*.png` are
  rendered from it). Light theme. System monospace for technical labels; fonts served from `opensketch/static/fonts` (no third-party
  requests: the privacy page says so). Copy claims only what the code does (site.py says where each comes from).
- The feature format (`docs/DOCUMENT.md`, the registry in `opensketch/features/`) is the contract between the AI,
  the kernel and the add-in. Change it there first, then the kernel, then the add-in. The bridge protocol
  (`docs/BRIDGE-PROTOCOL.md`) is the contract between gateway, Companion and add-in: change it there first, then
  `devicebridge.py`, then `solidworks/src/Core/Bridge2`, and keep `tests/bridge_fakes.py` and BridgeProbe in step.
- SOLIDWORKS API calls only on SOLIDWORKS' UI thread (Host marshals); never from the Companion (it may only start
  SOLIDWORKS or ask it once to LoadAddIn) and never from a service. Code that runs inside SOLIDWORKS (the add-in, the
  pipe link) must never let an exception escape a thread: it would close SOLIDWORKS.
- Heavy work never runs on the web server's event loop: OpenCascade goes through the person's "agent" CAD worker
  (`cadworker.lane_for(person, "agent")`), node and big file writes through threads.
- No personal, client or confidential details in code, comments, tests or docs (the repository is private since 7 Nov
  2026, but it may be shared). Nothing public may link to GitHub: every repository is private, so its pages, releases
  and raw files answer 404 to everyone else. Downloads are published on bizomat.ai (`/downloads/cad/`, R2).
- CI: `.github/workflows/tests.yml` (pytest in two jobs: main and `-m slow`; npm test; the Cloudflare Worker's
  `npm run check` in `cloudflare/mcp` on Node 22) on pull requests and
  non-main pushes; `deploy.yml` is the only way to production (Hosting, below; owner, 16 Nov 2026): on a push to main
  that changes what the image is built from or fly.toml, after the tests and the image's smoke test, it deploys that
  exact image and checks it, rolling back by itself when a core check fails; `fly-status.yml` (by hand, read only)
  checks that Fly has no deployment source for cados, so nothing deploys around it. main is protected by the ruleset
  `.github/rulesets/main.json` (a pull request with the four tests.yml checks passing, no force push, no deletion, no
  bypass; applied by the owner with `gh api`, README.md section 11; `tests/test_ruleset.py`), so tests.yml runs on
  every pull request, docs-only ones included; `solidworks.yml`
  builds and tests the add-in and keeps the zip as an artifact. `domain.yml` (run by hand, `.github/scripts/kevos-domain.sh`) gives the Fly app
  its own address on a Cloudflare domain: DNS record, Fly certificate and validation record, OPENSKETCH_PUBLIC_URL
  (secrets CLOUDFLARE_API_TOKEN, FLY_CADOS_TOKEN; app fixed to cados). Python pins live in requirements.txt (image) and
  requirements-dev.txt (CI), with hashes.

## Current state (v0.8 server, BIZOMAT CAD Automation for SOLIDWORKS 0.13.1)

- KEVOS registered computers (`devicebridge.py`, router included in `server.py`): pairing (`/v2/devices/pair/*`, the
  signed-in page `/devices/pair`), device proofs (`Authorization: KEVOS-Device <JWS>`, ES256 by the computer's
  key: method, path, time, one-time id, body hash), the gateway's command key (`bridge-signing-key.pem` in the data
  folder; commands and cancels are JWS the Companion verifies), SQLite `bridge.sqlite` (devices, pairings, every
  command with its history and result), live sessions in memory, `/v2/device/*` (hello, long-poll next, ack,
  progress, status, chunked file, result, blob, unpair), `/v2/bridge/update.json` (signed release manifest from
  `bridge-release.json`), `/api/devices` (list, default, remove). `swbridge.call(..., device=)` routes to a computer
  when one is online (`devicebridge.pick`: by name, the only one, the only one with SOLIDWORKS, the default, else
  `DEVICE_AMBIGUOUS`), else to the v1 add-in link; `swbridge.status` adds the computers. On an open server (no
  password, no accounts) pairing is taken only from the server's own machine. Tests: `tests/test_devicebridge.py`
  with the stand-in Companion `tests/bridge_fakes.py` (every SOLIDWORKS tool and the self test run through a
  computer), `tests/test_bridge_e2e.py` (slow: the C# Companion and add-in link, `solidworks/tests/BridgeProbe`).
- MCP (`mcp_server.py`): one MCPServer "CADOS" with INSTRUCTIONS for SOLIDWORKS work and 31 tools: every `sw_`
  tool (`sw_tools.py`, `sw_selftest.py`, registered on `mcp` at import) plus `request_upload`. Every tool that reaches
  SOLIDWORKS takes an optional `device` (the `_routed` decorator sets `_DEVICE`/`_TOOL` for `_run`, `_geometry`, whose
  cache is per person and computer, and the status checks); `sw_list_devices`, `sw_command_status`,
  `sw_cancel_command` are new. The gates record the AI app's grant ({id, name}, no token) and a correlation id for
  commands. `Endpoint` serves it
  at each path in `PATHS` = ("/mcp", "/solidworks/mcp"): the path itself takes a Bearer token (`_BearerGate`, 401
  with the protected-resource pointer for that path), `path/<key>` the private address (`_TokenGate`,
  `auth.resolve_mcp`). /solidworks/mcp is a second address early connectors used. Stateless Streamable HTTP; each answer
  is an event stream (`json_response=False`): its headers go at once and sse-starlette sends a comment every 15 s,
  so a tool that waits minutes for SOLIDWORKS survives a proxy's idle limit (Cloudflare in front of bizomat.ai: 524
  after 100 s of silence). Tests read answers with `tests/mcp_reply.rpc`.
- OAuth (`mcpauth.py`): `RESOURCES` maps both paths to "CADOS" with their own protected-resource metadata; a
  token from either works on both; one connection per person and app. DCR, client metadata documents (fetched with
  `safefetch.py`: public https only, pinned address), PKCE S256, refresh rotation, revoke.
- Sign-in (`auth.py`, `accounts.py`, `oauth.py`, `bizomat_id.py`): accounts with scrypt passwords, invites, Google sign-in (secret
  encrypted with `secretbox.py`), Sign in with BIZOMAT (14 Nov 2026: CAD is the client `cad` of the BIZOMAT sign-in
  provider in kevinjogin/bizomat-site, `apps/work/src/worker/company/id-provider.ts`; OAuth code with PKCE S256, the
  verifier derived from the state with a server key, the code swapped server to server with HTTP Basic; on only with
  BIZOMAT_ID_CLIENT_SECRET, whose SHA-256 the BIZOMAT side lists in WORK_BIZOMAT_ID_CLIENTS; BIZOMAT_ID_CLIENT_ID and
  BIZOMAT_ID_URL for a test server; return address https://bizomat.ai/cad/auth/bizomat/callback; the same account rules
  as Google (`accounts.bizomat_user`: linked id, else a confirmed email, else invite or open sign-up; an unconfirmed
  BIZOMAT email never links or creates); the account keeps the BIZOMAT id only, not the companies;
  `tests/test_bizomat_id.py`, `tests/test_canonical.py`; the same secret turns on the status report to BIZOMAT ERP,
  below; the owner's steps for both: `docs/SITE-CAD-INTEGRATION.md` section 8), an optional early access code (`OPENSKETCH_ACCESS_CODE` or the owner's setting) that
  makes "Internal tester" accounts. The setup page shows only until the first account exists; after that `/login` is
  Sign in ("Welcome back"), and a person already signed in on that browser (90-day session) goes straight to `next`.
  Sign-in pages and messages never name the OPENSKETCH_* settings. New-account forms (setup, join, sign-up) come with
  a strong password filled in (`auth.suggest_password`, dots with Show, hidden `suggested`); keeping it holds it in
  memory for 30 minutes (`auth.hold_new_password`) so Home shows it once (`GET/DELETE /api/account/new-password`).
  Each account records who chose its password (`pw_by`: self, suggested, owner; `pw_at`), shown on Admin; only the
  scrypt hash is kept, so nobody (the owner included) can read a password back. A member whose password the owner
  set sees "Choose your own in Settings" on Home. No server password anywhere: `auth.mode(scope)` is accounts
  (any account exists), setup (no account and the server is `reachable_by_others()`: OPENSKETCH_PUBLIC_URL on a
  non-loopback host, OPENSKETCH_REQUIRE_SIGNIN, or the legacy OPENSKETCH_PASSWORD still set; or the request is not
  `is_local`: a non-loopback client, any forwarding header, a non-loopback Host (DNS rebinding) or an Origin of
  another site; `mode()` without a scope never reads open) or open (no account, the machine itself only). In
  setup mode only /setup, the product pages and static files answer (no MCP, API, pairing, sign-up, add-in link,
  and no AI app grant made before accounts: "local" grants work only in open mode, "server" ones never without an
  owner); on a server not `reachable_by_others()` /setup itself is taken only from the machine (403 otherwise).
  PasswordGate refuses paths with `.`/`..` segments, `//` or a backslash (400). The first person to submit /setup (name, email, password, "Anyone can create their own account", ticked by default) owns the
  server. OPENSKETCH_PASSWORD is read only as the seed of an old owner's server-wide private address
  (`_legacy_password`). No /reset page: the owner resets people on Admin, and their own password with
  `python -m opensketch --reset-password EMAIL` on the server (`fly ssh console`). Suspension (`accounts.set_suspended`,
  Admin Suspend/Resume, `POST /api/account/users/<id>/suspend`, never the owner): `accounts.get` returns None for a
  suspended account, so sessions, OAuth tokens and refreshes, the private address, the add-in key (`swbridge.resolve`)
  and paired computers (`ACCOUNT_SUSPENDED`, 401; `devicebridge.suspend_person` closes live sessions (409 reason
  suspended) and fails waiting commands; the Companion keeps its pairing and retries) stop at once; OAuth grants are
  kept (refresh says suspended, works again after Resume); sign-in
  (password, Google, Companion password pairing) says it is suspended; `get_any` is for the owner's views.
  `tests/test_mcp_access.py` covers setup mode, per-person MCP, suspension, expiry and no shared password.
- Status in BIZOMAT ERP (`erpstatus.py`, 15 Nov 2026; built on the branch `claude/bizomat-sign-in`, live once merged
  and deployed with the secret set): CAD reports each account's computers, recent jobs and AI assistants to
  `POST <bizomat_id.provider()>/api/id/cad-status` (https://bizomat.ai/company/api/id/cad-status, the website's
  `apps/work/src/worker/company/id-provider.ts`; HTTP Basic, client `cad`, `BIZOMAT_ID_CLIENT_SECRET`, each part
  form-encoded), which BIZOMAT ERP shows by company (`system/system.ts` `cadFor`: by the BIZOMAT id `sub`, or by an email
  both sides confirmed). On only with the secret and only with accounts; a daemon thread `erp-status` started and
  stopped by `server.lifespan`, never the event loop: a full report every 180 s, and one 10 s after a change
  (`erpstatus.changed()` only sets a flag; called by `devicebridge` on hello, pairing, a closed session and a finished
  command, by `swbridge` on the direct link's hello and drop; a 15 s look at which computers are online catches one that
  stops polling), rounds at least 30 s apart, 10 s per request, back-off 1 to 30 minutes (and `Retry-After`), at most
  100 accounts and 512 KiB per request. Only accounts whose email is proven (`accounts.confirmed_accounts`:
  `email_verified`, set by the owner's setup and by a confirmed Google or BIZOMAT sign-in or link; typed emails never)
  and that the ERP's own email check (zod) takes. Per account: up to 20 computers (paired ones from `bridge.sqlite` and
  the live sessions, plus the direct link while connected: name, online, SOLIDWORKS "2022 SP5, ready" or what is
  installed, add-in version, last seen), the last 10 commands (id, the tool's title, status, time) and up to 20 AI apps
  (name, connected, last used). Texts cut to the ERP's limits in UTF-16 units; credential-shaped texts dropped; never
  the ERP's optional `open` (document name), the Companion version (no field in the contract), paths, files or tokens.
  An account no longer reported is withdrawn once (emailVerified false, no sub, empty lists); the reported emails and
  the last outcome are kept in `erp_status.json` in the data folder. The Admin page's BIZOMAT ERP panel (`erp` in
  `GET /api/admin/people`, `erpstatus.status()`) shows on or off, the last report and the last error. The privacy notice
  (`auth.PRIVACY_BODY`, section `erp`) and the docs page say what is sent. Tests: `tests/test_erpstatus.py` (a
  stand-in ERP with the ERP's own rules; the slow test runs the real work app when `BIZOMAT_WORK_APP` names a built
  `apps/work`, and checks who sees which computer).
- Malware scan of BIZOMAT ERP's verification documents (`evidencescan.py`, 19 Nov 2026; the owner chose this 2 GB
  Machine because BIZOMAT's own have 512 MB and ClamAV needs about 1 GB while it scans: measured 1,000 MB at its peak,
  about 12 s a file, ClamAV 1.5.4 with the full signature set). A daemon thread `evidence-scan` (started and stopped by
  `server.lifespan`, never the event loop) asks `POST <bizomat_id.provider()>/api/id/scan/next` with the BIZOMAT client
  credentials (HTTP Basic, client `cad`; no new secret, no new open address), checks the bytes against the ERP's
  SHA-256, scans them in a private temporary folder at nice 19 and deletes them, and posts `scan/result` (clean,
  infected with the signature, or error). Files over ClamAV's limits and encrypted documents count as infected. One at
  a time, only while 1,300 MB are free (`OPENSKETCH_SCAN_MIN_FREE_MB`; unknown memory: never). freshclam fetches the
  signatures to the Machine's own disk (`/var/lib/clamav`, not the volume) every 6 hours with `TestDatabases no`. Off
  without the BIZOMAT client secret or ClamAV (the image installs clamav and clamav-freshclam), or with
  `OPENSKETCH_EVIDENCE_SCAN=0`; the ERP (bizomat-site `apps/work/src/worker/company/scan.ts`) hands out nothing until
  its flag `evidence_scanning` is on. Admin's people API reports its status (`evidence_scan`). Tests:
  `tests/test_evidencescan.py` (stand-in ERP and ClamAV; a slow test runs the real ClamAV on EICAR when installed).
  Deployed 19 Nov 2026 (version 00f46c2, deploy run 44626760785, every core and public check passed); it scans nothing
  while the ERP's flag is off, and the privacy notice says where documents are scanned.
- Pages: `/` is the product page for visitors (`site.landing`) and the app's Home for a signed-in person (and on an
  open server); `/overview` (product page) and `/docs` (setup, connection, auth, verify, self test, troubleshooting,
  security) are public (`auth.PUBLIC_PAGES`), as are `/privacy` and the design system under `/ui/` (`cados.css`,
  `app.js`, `og.png`, icons, `kevos-wordmark.svg`). FastAPI's own /docs and /redoc are off. A browser asking for a
  missing page gets the branded 404 (`site.not_found`); API, MCP and device paths keep JSON 404s.
- The signed-in app (`app_pages.py`, one script `static/ui/app.js`, sections in `brand.APP_NAV`): Home (`/dashboard`:
  "Engineering, made intelligent.", a task box that copies the task for the AI assistant and opens Claude or ChatGPT,
  connection summary, a 4-step setup list, recent activity), CAD Assistant (`/assistant`: connector address,
  per-app steps, connected apps with Disconnect, example requests from `catalog.EXAMPLES`), SOLIDWORKS
  (`/solidworks`: installer, computers with default/remove, how CADOS connects (add-in, Companion, cloud MCP,
  self-hosted, direct link, launcher macro: never called an add-in), service address, manual package), Tools
  (`/tools`: every MCP tool in plain words from `catalog.GROUPS`, searchable; `tests/test_app_pages.py` keeps it equal
  to the registered tools), History (`/history`: `GET /api/commands`, the person's commands to paired computers from
  bridge.sqlite; direct-link commands are not recorded), Settings (`/settings`: account, private address and add-in
  key with Show / Copy / New, change password, sign out), Admin (`/admin`, the owner only; anyone else is sent to
  Home: add a person with a suggested password the owner can change, shown once after adding (`POST /api/account/users`, role member), suspend or resume a person, set someone's password
  (`POST /api/account/users/<id>/password`: signs them out everywhere and ends their AI apps' sign-ins), remove a
  person (also revokes their paired computers), people with their computers and AI apps (`GET /api/admin/people`),
  invite links, open sign-up). People sign in with that password when the installer's pairing step opens the
  browser, or type the same email and password in the Companion's pairing window (`POST /v2/devices/pair/password`,
  signed with the pairing key, rate-limited like the sign-in page; the password is sent once and kept nowhere). The
  installer download (`/download/solidworks`) needs sign-in. No Automation section: CADOS keeps no stored automations. Live status
  states: Connected, Disconnected, Checking connection, Authentication required, Installation required, Connection
  error. App header: the sections, the BIZOMAT menu (BIZOMAT platform, Systems at bizomat.ai/systems/, CAD
  Automation), the person, Sign out; app footer links bizomat.ai, Systems, Documentation, the legal pages and Support. `GET /api/solidworks` still gives the pages everything in one call. Sign-in, consent, notice and
  pairing pages share `auth.PAGE` (product panel and form).
- Server (`server.py`): lifespan (warms the owner's agent CAD worker, runs the MCP session manager), BodyLimit,
  RequestLog, PasswordGate; /healthz; account routes; add-in link (`/mcp/sw/hello|next|result|file|blob`), `/api/sw*`;
  upload links (`/mcp/uploads/{id}`) and artifact downloads (`/mcp/artifacts/...`); OAuth routes; static files
  (favicon, fonts, `static/downloads/OpenSketch-SOLIDWORKS.zip` built by the Dockerfile). `/privacy` is public.
- Kernel used by the tools: geometry, features (registry), assembly, naming, params, inspection (sketch DOF via
  `solver/solve_cli.mjs`), measure, preview, importer (STEP), artifacts, uploads, cadworker. `store.py` is the data
  folder and its shared helpers. `docformat.py` is the feature-format text `sw_get_guide` appends and the rebuild
  reports inspection uses.

## SOLIDWORKS add-in and tools

- Shape: AI app -> `/mcp` -> `sw_` tools -> `swbridge` queue -> the add-in long-polls the server over outgoing HTTPS
  and runs each command in SOLIDWORKS. SOLIDWORKS is the master copy; the server keeps no document for it.
- `swbridge.py`: per-person key `oss_...` = HMAC(data secret, person + counter) (`key_for`, `new_key`, `resolve`);
  one session per person (a new hello replaces the old one; 409 with reason restarted / replaced / closed); routes
  `/mcp/sw/hello`, `GET /mcp/sw/next` (held 25 s), `/mcp/sw/result`, `/mcp/sw/file` (gzip bodies),
  `/mcp/sw/blob/{id}`; connected = polled in the last 70 s; a tool waits 240 s by default.
- `sw_tools.py`: features are checked by the registry and each sketch is solved by `solver/solver.js` (over-defined
  refused before sending); `_predict` rebuilds them with the kernel on SOLIDWORKS' current body (STEP) and sends
  `expect` {dv, bbox, tool_bbox, plane, range} per feature; the add-in remakes a feature flipped when SOLIDWORKS read
  the direction the other way. Reading tools run on a STEP of the body, cached per person and part by SOLIDWORKS'
  update stamp. `sw_get_guide` = SW_GUIDE + docformat.GUIDE.
- Drawings (`sw_create_drawing` in `sw_tools.py`, `solidworks/src/Addin/Drawings.cs`): a native .SLDDRW of a saved
  part or assembly from the user's default drawing template, saved next to the model. Sheet A4 to A0 (the
  template's own sheet wins; a note says so), third angle (default, AS 1100) or first angle; the standard views
  (Create3rdAngleViews2 / Create1stAngleViews2) plus an isometric in the free upper right, or named views on a grid;
  the largest preferred scale that fits (from the model's box) unless given; SOLIDWORKS' automatic view scaling is
  turned off while placing views and put back; model dimensions marked for drawing (InsertModelAnnotations3);
  title block fields as the drawing's custom properties. The result lists each view's outline and notes (views off
  the sheet, no dimensions, unsaved model). A half-made drawing is closed. sw_export takes pdf (all sheets), dwg and
  dxf (active sheet) and slddrw from a drawing; sw_preview of a drawing needs screenshot=true. The API calls were
  checked against the SOLIDWORKS 2022 interop (30.5.1). First real run (0.9.0): views placed by SOLIDWORKS fell off
  the sheet at 2:1, and a drawing sheet counted as an open sketch for NotWhileTheUserEdits (now skipped for
  drawings). 0.9.1 sets the views out itself (`ArrangeStandard`: a 25 mm gap from the front view, the group centred
  in the left two thirds above a 65 mm title band, the isometric centred to the right; notes when they do not fit),
  turns on SOLIDWORKS' automatic centre marks and centre lines, auto-arranges each view's dimensions, writes the
  general notes it is sent (`DEFAULT_NOTES`: units, do not scale, deburr, ISO 2768-m) bottom left, and replaces a
  drawing of the same name with overwrite=true. SW_GUIDE has the drafting practice (AS 1100.101/201, ISO 128,
  ISO 129-1) the AI follows: dimension sketches from datums, fewest views, preferred scales, check by screenshot and
  remake. The add-in is 0.10.0
  (`solidworks/Directory.Build.props`; bump it whenever the add-in learns a command). Its hello sends its version and
  the DLL's path; `swbridge.addin_too_old` makes sw_create_drawing, the dwg/dxf/slddrw exports and sw_status
  (`update_needed`) say which add-in is loaded and how to update, before anything is sent. `solidworks.yml` replaces
  the `addin-latest` GitHub release with every main build (private: for the owner). The update message points at
  `swbridge.addin_download()`: `OPENSKETCH_ADDIN_URL`, else this server's own package (`/api/sw/download`).
- Drawing API (0.10.0; `sw_get_drawing`, `sw_edit_drawing` in `sw_tools.py`, `solidworks/src/Addin/DrawingEdits.cs`):
  read the sheet, views (type, orientation, scale, outline in sheet mm, display, dimension count, model) and title
  block fields; change a drawing with up to 40 actions run in order (`DRAWING_ACTIONS` lists each one's keys and is
  checked on the server before anything is sent): view, projected (CreateUnfoldedViewAt3), section (a cutting line
  drawn in the view through a model point via ModelToViewTransform, or a fraction of the outline, then
  CreateSectionViewAt5), detail (a circle, then CreateDetailViewAt4), move, scale (or back to the sheet's), display,
  delete, rename, dimensions (InsertModelAnnotations3 on one view or all), arrange_dimensions, centre_marks
  (AutoInsertCenterMarks2), note (CreateText2), properties, sheet (scale, projection), bom (InsertBomTable4 with the
  first BOM template in SOLIDWORKS' file locations, then AutoBalloon5). A failing action stops the list; the result
  says which, with what was done before it. `sw_get_drawing` ran in a real SOLIDWORKS on 15 Nov 2026; `sw_edit_drawing` not yet.
- `sw_selftest.py`: stages plate / shapes / assembly in `Documents\OpenSketch\selftest` (the plate stage ends with its drawing and a PDF of it), each step ok / check /
  failed with the reason; the first thing to run on a new PC. Tests run it against SimSW, a stand-in add-in built
  on the kernel and mate solver.
- Add-in (`solidworks/`, .NET Framework 4.8 x64, SOLIDWORKS 2022 interop embedded; version in
  `Directory.Build.props`, 0.13.1: the Companion's pause and resume fix): Core (Json, Geom, SketchPlan, BridgeClient; Bridge2: Crypto (ES256 JWS, JWK),
  Wire (ids, times, 4-byte-length frames), ReplayGuard, PipeLink (the add-in's pipe client: reader thread for pings and
  cancels, one worker for commands, outbox across reconnects, at-most-once by command id), CloudLink and
  CompanionEngine (the Companion's core: signed long poll, verification, routing to a SOLIDWORKS session, spool,
  persistent outbox, heartbeats), Destructive), Addin (Entry: CADOS menu (title CADOS in Tools > Add-Ins), KevosUi CommandManager group and CADOS tab (removes the old KEVOS tab), CadosPane task pane (state, Connect/Disconnect, prompts to copy, confirmation setting, activity, links); Host:
  the direct link and the Companion link, UI-thread snapshot of documents, document events, modal-dialog check,
  Safety confirmation of destructive ops; CompanionPipe: the pipe client that checks its server is the installed
  Companion; ConnectForm; Settings in HKCU\Software\OpenSketch and HKCU\Software\KEVOS\Bridge; Log in
  %LOCALAPPDATA%\OpenSketch\SolidWorks; Commands, Files, Pick, Sketches, Features, Edits with Journal rollback,
  Assembly), App `OpenSketchSW.exe` (Install for me = per-user COM registration + the launcher macro
  `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" from outside, direct link only).
  The COM ids are unchanged (existing registrations and the macro keep working); the add-in's title is CADOS.
- KEVOS Companion (`solidworks/src/Companion`, `KEVOS.Companion.exe`, net48, compiles Core, no SOLIDWORKS reference):
  tray app, one per Windows user, starts at sign-in (HKLM Run from the MSI; per-user opt-out flag), pairing window,
  device key in CNG (TPM first, not exportable), the pipe `\\.\pipe\KEVOS.Bridge.<SID>` (first instance, user-only
  DACL, remote clients rejected, clients must be SLDWORKS.exe with the installed add-in), SOLIDWORKS detection and the
  LoadAddIn fallback, removal of old per-user OpenSketch registrations, crash restart, logs in
  %LOCALAPPDATA%\KEVOS\Bridge\logs, diagnostics, updater (gateway-signed manifest, hash, Authenticode, same publisher,
  the person asked). `--pair`, `--diagnose`, `--unpair`, `--startup on|off`, `--exit`.
- Installer (`installer/KEVOS-Bridge.wxs`, `installer/build.ps1`): WiX 5 per-machine x64 MSI "BIZOMAT CAD Automation for
  SOLIDWORKS" (UpgradeCode unchanged: upgrades CADOS for SOLIDWORKS and KEVOS Bridge), `BIZOMAT-CAD-Automation-<version>-x64.msi`
  plus the stable `BIZOMAT-CAD-Automation-x64.msi` (and `CADOS-for-SOLIDWORKS-x64.msi`, the 0.12 stable name, as a copy); built and (with secrets) signed by the `installer` job in `solidworks.yml` on Windows;
  releases `bridge-latest` and `bridge-v<version>` (private: the owner downloads from there). Public copies are on
  bizomat.ai: `tools/laptop/cloudflare.ps1 publish installer -File <msi>` puts the versioned and stable names and their
  `.sha256` files in the R2 bucket `bizomat-downloads` (the website Worker serves `/downloads/`). It also writes the
  release record as `/downloads/cad/release.json` and as CAD's `bridge-release.json` in R2. `build.ps1`'s `release.json`
  points there too. `/download/solidworks` (signed in) redirects to OPENSKETCH_INSTALLER_URL, else serves
  `<data>/downloads/BIZOMAT-CAD-Automation-x64.msi` itself when the operator put one there (`server.local_installer`;
  on Fly `/data/downloads/`, because bizomat.ai is still the Fly website, which has no /downloads/ route: the fallback
  below answered 404 on 8 Nov 2026), else redirects to the published `bridge-release.json` msi_url, else
  `https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi`. `/download/solidworks.sha256` (the pages'
  checksum link) answers for the file on the volume, else redirects to `brand.checksum_url()`. Pages link the
  checksum (`/download/solidworks.sha256`) and support (`brand.support_url()`: the website's contact page), never GitHub.
  Since 15 Nov 2026 (22:45 UTC) the volume holds the development-signed 0.13.1 (1,323,008 bytes, SHA-256
  `cc8f04ecb1ee20fdcc96261ea100ef48fa03850db454f29908b032aa10c7d1a2`, signer `CB6DBE74...`), put there by
  `.github/workflows/installer-volume.yml` (by hand, `confirm` = PLACE; inputs: the branch holding the backup, its path
  under `backups/installer/`, SHA-256, version and signer thumbprint or `unsigned`; checked on the runner with msitools
  and `.github/scripts/msi-signer.sh`, fetched by the Machine from that commit and checked again, swapped in with one
  rename, the file before kept as `previous-<time>-<sha>.msi`; no restart). The development-signed 0.13.0 it replaced is
  `/data/downloads/previous-20261115T224521Z-51b6de4152e6.msi`. `fly-status.yml` prints each installer's SHA-256.
  `tests/test_installer.py` keeps the MSI, the add-in code and the download link in step. `build.ps1` signs with a
  store certificate by thumbprint (`-CertThumbprint`/KEVOS_SIGN_THUMBPRINT, never falls back to unsigned when one is
  asked for) or a `.pfx` (CI); `-Timestamp ''` signs without a timestamp, `-NameSuffix` (sign-development passes
  `-DEV` for a self-signed certificate). `sign-development.ps1`: finds or makes the certificate (RSA 3072, 2 years,
  NonExportable), finds SignTool or installs only the SDK Signing Tools (`-SdkSetup`), trusts the public certificate
  for this user (`-TrustOnThisComputer`), builds (`-Build`), signs the three own binaries and the MSI (SHA-256,
  RFC 3161), checks each with `signtool verify /pa` and Get-AuthenticodeSignature, unpacks the MSI (`msiexec /a`) to
  check the files in it, writes `installer/out/signing-report.*` and backs up (`-Backup`). The tests check it never
  exports a private key and the repository holds none. The original 0.13.0 MSI (unsigned, from `bridge-latest`,
  which CI remakes on every build) is in `backups/installer/original/2026-11-07`.

## Hosting

- Code: https://github.com/kevinjogin/bizomat-cad (since 9 Nov 2026; before that jogkev-creator/CADOS, and before that
  jogkev-creator/opensketchyz, with the same commits: those are archives, never push there; release
  downloads are on bizomat.ai now, as the repository is private since 7 Nov 2026: see the Rules). The laptop works from
  its own signed-in clones (`bizomat.ps1 setup`, then `git pull`); raw GitHub links do not work for a private
  repository. GitHub Actions minutes for private repositories are limited: when they run out, every job fails at once
  with no log (seen 7 Nov 2026), and `cloudflare.ps1` runs the repository's own checks before each deploy. The Fly app
  below must have no GitHub repository connected (Fly dashboard > cados > Settings): **GitHub Actions' `deploy.yml` is
  the single deployment authority** (owner, 16 Nov 2026). One was connected on 15 and 16 Nov 2026: every push to main
  was built and deployed by Fly itself about a minute after the merge, docs-only and `[skip ci]` merges included
  (releases v22, v24, v26, v28, v29, v31, v33 and v34; /healthz version `dev`; no tests, no preflight), before
  deploy.yml's own release (v35 on 16 Nov: `9ec8423`). Both kinds of image were tagged `deployment-<id>`, so only the
  version told them apart. **The owner disconnected Fly's GitHub deployment for cados on 16 Nov 2026.** Fly's API
  (GraphQL, read only with FLY_CADOS_TOKEN) confirmed it independently, before and after the merge of #13 (b7db50e,
  01:08 UTC): `hasDeploymentSource: false` and `deploymentSource: null` in Fly status runs 43784118963 (01:05 UTC) and
  43784971587 (01:13 UTC). That merge changed no deploy path and made no release: v35 stayed the latest, and the
  Machine was not restarted (last updated 00:20:46 UTC before and after). Since then `fly-status.yml` checks it on
  every run (its last step, `.github/scripts/fly-deploy-source.sh`; `tests/test_fly_deploy_source.py`): it passes with
  no deployment source, fails with an error naming what Fly reports when one is connected, and fails without claiming
  anything when the answer cannot be read. It never disconnects anything (that is done by hand in the Fly dashboard),
  never prints the token or the raw answer, and deploys nothing. deploy.yml also warns when production reports `dev`
  and reports any release it did not make; a merge that does not deploy (docs, workflows, tests) must leave the release
  list unchanged. The first deploy of a genuine change (the malware scanner, 19 Nov 2026) rolled back on the image check
  (run 44623909917); after the config-digest fix (#17) it deployed by hand (run 44626760785, 00f46c2).
- Listens on `::` (`--host ::`, `__main__.listen_sockets`: one dual-stack socket, IPv4 alone where there is no IPv6), so
  the BIZOMAT router (Fly app `bizomat`) reaches it over Fly's private network at cados.internal:8080.
- Public address https://bizomat.ai/cad: CAD Automation lives under the BIZOMAT website's own address (the owner's
  decision: everything under bizomat.ai, /cad, /tasks, ...). `canonical.py` (outermost middleware, Host header only):
  a request under the prefix of OPENSKETCH_PUBLIC_URL is served with the prefix taken off the path and put in
  root_path, so routes, the sign-in gate and the computers' signed paths (relative to the gateway address, see
  docs/BRIDGE-PROTOCOL.md) are unchanged; root paths the app writes get the prefix back (HTML href/src/action/url(),
  Location, cookie Path; static/ui/app.js takes it from its own address); pages under the prefix are not gzipped
  by the app (they are rewritten as text). The OAuth metadata of the prefixed resource is served at the root of the
  host (RFC 9728 /.well-known/oauth-protected-resource/cad/mcp, RFC 8414 /.well-known/oauth-authorization-server/cad,
  also /.well-known/openid-configuration/cad); the 401 pointer names the RFC 9728 address and the issuer is
  https://bizomat.ai/cad. On bizomat.ai /CAD 301s to /cad and other pages 302 into /cad (until the website's Worker
  serves the root: it passes /cad/*, the OAuth well-known paths and the root program paths below on to this app). OPENSKETCH_REDIRECT_HOSTS
  (cados.fly.dev, cados.kevos.com, cad.bizomat.ai) are old hosts: pages 301 to https://bizomat.ai/cad, programs
  (/healthz, /mcp*, /solidworks/mcp*, OAuth register/token/revoke, /.well-known/, /v2/, /api/) keep working at their
  root with that host's own address (`canonical.machine_base`), and the consent page accepts a resource on any of
  the server's addresses and answers with that address as `iss`. Every HTML answer carries `server.PAGE_CSP` (`PagePolicy`): scripts only from this server and the two inline
  scripts by hash (`brand.MENU_SCRIPT`, `auth.SHOW_SCRIPT`; a new inline script needs its hash there, and
  `tests/test_canonical.py` crawls every page to check), because the website and Project Management share the
  bizomat.ai origin. Google sign-in comes back under the prefix
  (`auth._request_base` adds root_path): the Google client lists https://bizomat.ai/cad/auth/google/callback. Behind Cloudflare the visitor's address is
  CF-Connecting-IP, believed only from Cloudflare's edge ranges (`auth.CLOUDFLARE_NETS`). Tests:
  `tests/test_canonical.py`, the official MCP client and a paired computer under /cad.
  Favicons (`static/favicon.svg|ico`, `ui/icon-32.png`, `ui/icon-180.png`) are the KEVOS K (drawn from the KEVOS logo;
  kevos.com could not be fetched from the build session). Origin https://cados.fly.dev (Fly
  app `cados`, in ams (Amsterdam), first made with Fly Launch from GitHub on 4 Nov 2026); the deploy health checks use it.
  Deploys (owner, 16 Nov 2026): only `.github/workflows/deploy.yml`. On a push to main that changes what the image is
  built from (Dockerfile, .dockerignore, requirements.txt, opensketch/, solidworks/ but not its tests) or fly.toml, it
  runs the tests (tests.yml) and, beside them, builds the image once on the runner (OPENSKETCH_VERSION = the commit's
  first 7 characters; layers of the running image reused when it was built there), smoke-tests it as a container
  (`.github/scripts/image-smoke.sh`) and pushes it to registry.fly.io/cados:sha-<commit>. Only when both pass: the
  preflight (`.github/scripts/fly-preflight.py`, which stops a deploy that would add, remove or resize the Machine), the
  running image recorded, the optional secrets staged (`flyctl secrets import` on standard input, never a command line),
  then `flyctl deploy --image` of that exact image (no build). Core checks (`.github/scripts/cados-checks.sh core`:
  /healthz reports the commit, the Machine runs the pushed digest, MCP answers 401 with a Bearer challenge, the OAuth
  metadata answers) deploy the recorded image again when one fails (automatic rollback) and fail the run; the checks
  through bizomat.ai and Sign in with BIZOMAT (the token endpoint must refuse a made-up code as invalid_grant, never
  invalid_client) fail it without a rollback. The image check passes when Fly reports the pushed manifest digest or, because Fly runs an image
  under its own `deployment-<id>` tag with a rewritten manifest, when that manifest has the pushed image's config digest
  (`.github/scripts/image-config.sh`, `tests/test_image_config.py`). The first deploy of a real change (19 Nov 2026, the
  malware scanner, run 44623909917) failed only that check (the new server answered every other) and rolled back by
  itself to 9ec8423; this was the fix. Docs, workflows, scripts, tests, the installer and backups reach main
  without a deploy (tests/test_deploy_workflow.py keeps the paths equal to the Dockerfile's COPY lines and holds the
  other rules). By hand (Actions > Deploy to Fly.io (cados)): `deploy` (`confirm` = `DEPLOY`), `rollback` (`image` =
  `sha-<commit>` or a `deployment-<id>`, an image already in the registry, no build) or `build-only` (any branch: pushes
  `check-<commit>-<run>`, deploys nothing). One deploy at a time (concurrency `deploy-cados`; of the waiting runs only
  the newest is kept); a re-run of a live commit deploys nothing. The laptop's `bizomat.ps1 deploy cad` starts this
  workflow with the GitHub CLI and never deploys itself. Repository secret FLY_CADOS_TOKEN, a deploy token for cados
  only (it also pushes to the registry). It never creates an app, Machine or volume.
  Production, read from Fly on 9 Nov 2026: one Machine in ams (Amsterdam, not Sydney), shared CPU, 2 vCPUs, 2048 MB,
  and the 1 GB volume opensketch_data in ams; fly.toml matches it. Never add a Machine, change its size or memory, or
  move its region without the owner's approval (a move to syd means moving the volume: a planned change of its own).
  `fly-status.yml` (run by hand, changes nothing) prints the app's machines, volumes, secret
  names, releases, logs and /healthz, and last checks that no repository is connected to the app in Fly (it fails if
  one is): both need the repository secret FLY_CADOS_TOKEN (a deploy token for cados).
  How this app and the BIZOMAT website (kevinjogin/bizomat-site, Fly app `bizomat`) work together:
  `docs/SITE-CAD-INTEGRATION.md`.
  No password secret is needed on Fly (fly.toml sets OPENSKETCH_PUBLIC_URL, so a fresh server waits in setup mode);
  an old OPENSKETCH_PASSWORD secret can be unset. The Windows PC server (`windows/`) is the other way to run it.
- fly.toml: app `cados`, `primary_region = 'ams'`, shared-cpu-2x with 2 GB (the live Machine; it said syd and performance-1x
  until 9 Nov 2026), always on since 14 Nov 2026 (`auto_stop_machines = "off"`, `min_machines_running = 1`), kill_timeout 15,
  volume `opensketch_data` at /data. It was `suspend` before: bizomat.ai/cad and the computers' long polls reach it over
  Fly's private network from the app bizomat, which does not count as traffic and cannot wake it, so it slept and
  bizomat.ai/cad answered 502. Sleeping again needs Flycast between the router and this app.
- `supervisor.py` (`python -m opensketch --supervise`, the image's CMD): asks /healthz every 5 s, restarts the server
  after 120 s without an answer (stacks to the log first), tells a suspended machine from a hang. With
  OPENSKETCH_PERSIST_URL it first restores the data folder from an object store and copies changes back
  (`persist.py`, below).
- Cloudflare (migration from Fly, Nov 2026; plan in gocore-website `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`):
  `cloudflare/mcp` is the Worker `bizomat-mcp` (custom domain mcp.bizomat.ai; the website Worker hands bizomat.ai/cad
  here by service binding) in front of one Cloudflare Container built from this Dockerfile (`CadServer`, standard-2,
  `max_instances` 1, instance "main", sleeps after 30 min). The Worker sets X-Forwarded-Proto and X-Forwarded-Host
  from the visitor's own address (`settings.ts` `forServer`) and gives the container OPENSKETCH_DATA=/data,
  OPENSKETCH_PERSIST_URL=http://persist.bizomat.internal and OPENSKETCH_CLIENT_IP_HEADER=cf-connecting-ip
  (`auth._client` then believes only CF-Connecting-IP). Container disks do not last, so `persist.py` (run by the
  supervisor) restores the top-level state files from R2 (`bizomat-mcp-data`, keys `data/<name>`, names
  `persist.NAME`) through the Worker's outbound handler (`src/persist.ts`: GET /list, GET/PUT/DELETE /o/<key>,
  streamed, R2 checks each PUT's SHA-256; no R2 keys in the container), refuses to start the server when R2 holds no
  `accounts.enabled` (exit 2; visitors get 503, never /setup; OPENSKETCH_PERSIST_EMPTY_OK=1 for a deliberate empty
  start), copies changed files every 2 s (SQLite through the online backup; a refused file never holds back the
  others) and once more on SIGTERM. OPENSKETCH_MCP_URL (`server._mcp_base`) makes the connector address
  https://mcp.bizomat.ai/mcp; mcp.bizomat.ai is in OPENSKETCH_REDIRECT_HOSTS, so OAuth there has issuer
  https://mcp.bizomat.ai. Tests: `tests/test_persist.py`; `cloudflare/mcp/test` (vitest; `contract.test.ts` runs
  persist.py against the Worker's store). A local run of the whole stack (`wrangler dev` with Docker: Worker,
  container, local R2) passed: fail-closed 503 on an empty store, cold start about 3 s, sign-in, OAuth discovery,
  the MCP SDK client (31 tools), a stand-in Companion paired through the page with 25 s long polls and commands,
  and sessions, computers and command history restored onto a fresh disk. Not yet deployed. `CAD_PAUSED=1` (a Worker
  secret) answers 503 and stops a running server so a new copy of the data can go into R2. The laptop runs the move
  with `tools/laptop/cloudflare.ps1`: check, deploy mcp|tasks|website, secrets website, move tasks|cad (-Local,
  -Replace, -Final), switch (prints the DNS steps; DNS stays the owner's), status. It is ASCII and PS 5.1, apart from
  bizomat.ps1.
  The data moves from Fly with `cloudflare/mcp/scripts/move-from-fly.mjs` (prepare, then apply) before the DNS switch.
  Secrets a Fly server may have (OPENSKETCH_PASSWORD or OPENSKETCH_MCP_TOKEN: the private address and link signature seed;
  OPENSKETCH_KEY_SECRET; GOOGLE_CLIENT_ID/SECRET; OPENSKETCH_ADDIN_URL) are passed to the container when set as Worker
  secrets (`settings.ts` PASSED); `cloudflare.ps1 secrets mcp` copies them from the Fly Machine unseen. Readiness
  rehearsal (7 Nov 2026): the production image seeded over HTTP, `move cad -Local`, the restored stack behind the website
  Worker over https: same accounts, settings, OAuth grants, private address, add-in key, paired computer and history as
  Fly; every tool; a 150 s call with a keep-alive every 15 s (gocore-website docs/BIZOMAT-CLOUDFLARE-MIGRATION.md).
- `cadworker.py`: CAD in worker processes, one per person and kind, at most OPENSKETCH_CAD_LANES (3) live, one place
  kept for the owner, idle ones stop after 15 min, workers over 800 MB replaced. `OPENSKETCH_CAD_WORKERS=0` runs in
  threads (tests/conftest.py sets it), so `tests/test_cadworker.py` imports every module first in a fresh process and
  runs sw_tools' worker functions in a real worker (a worker's first import is the module of the function it runs).

- One Windows PC (`windows/`): `setup.ps1` (Python 3.12 venv, pinned packages, copies the add-in zip from
  Downloads), `start.ps1` (asks for an optional public https address for a tunnel; no server password; runs on port
  8000), `update-addin.ps1` (newest add-in zip from Downloads, checked >= 0.10.0, into `%LOCALAPPDATA%\OpenSketch\AddIn`,
  `OpenSketchSW.exe --install`, prints the registered CodeBase and its version), `connect-claude.ps1` (adds the private address to Claude Desktop's config through
  `cmd /c npx mcp-remote`, with a backup, and restarts it), `README.md` (steps: add-in from the Actions artifact, the
  macro, Claude Desktop, Cloudflare Tunnel for web AI apps). The add-in's default address is `http://127.0.0.1:8000` (`Settings.DefaultServer`).
  On Windows the CAD workers lower their priority with psutil (there is no `os.nice`).

## Known limits

- The add-in has been compiled against the SOLIDWORKS 2022 interop and its link tested against a real server; it has
  not yet been run on many real SOLIDWORKS installs. Unconfirmed: SOLIDWORKS listing a per-user (HKCU) add-in at all
  (hence the macro and outside-exe routes), `.swb` macros on every install, AddDimension2 text position, obsolete
  calls kept for 2022 (FeatureFillet3, FeatureLinearPattern5, AddMate5, InsertProtrusionSwept4).
- No prediction for features that name existing SOLIDWORKS features (mirror / pattern of a tree feature). One
  SOLIDWORKS link per person. Equations are written for all configurations. Commands can arrive while SOLIDWORKS
  shows a modal dialog (only an open sketch is detected). SOLIDWORKS run as administrator ignores the per-user
  registration. Plain numbers in equations are in the document's unit.
- Large assemblies are slow to read: each read exports a STEP of the bodies that changed.
- Account admin page (`/admin`) covers people, passwords, invites and open sign-up; early access codes and Google
  sign-in setup are still API only (`/api/account/settings`, `/api/account/google`).
- On Cloudflare: a state file over 64 MiB is not copied to R2 (logged; `bridge.sqlite` grows with the command
  history); files in transit (uploads, exports, file chunks) do not survive a container restart; a container killed
  without SIGTERM loses up to 2 s of changes.
- Pause and resume (15 Nov 2026): the Companion posts its status beside the held long poll (`PushStatusSoon` in
  `CompanionEngine.SetPaused`), so the gateway sees a resume within about 0.5 s. Before, it waited for the poll (up to
  25 s), the AI's commands were refused as PAUSED meanwhile, and `tests/test_bridge_e2e.py` failed about one run in
  three; the test now requires pause and resume to be seen within 5 s.
- On the owner's PC (15 Nov 2026): 0.13.0 upgraded in place to the CI-built 0.13.1 (same device id, still paired, the
  Companion reported 0.13.1 and online).
- First run in a real SOLIDWORKS (15 Nov 2026, 23:10 to 23:45 UTC; SOLIDWORKS 2022 SP5, 30.5.0, on the owner's PC, add-in
  and Companion 0.13.1, through the Companion and the MCP from an AI app): a part (fully defined sketch, extrude, hole,
  fillets: each volume exactly as the kernel predicted), a batch rolled back after a failing step (volume back to the
  last digit), a delete not done without the person's approval, a global variable, save, a STEP export, an assembly
  (insert, concentric and coincident mates, no interference), a drawing (A3, 2:1, third angle, 4 views, 18 dimensions,
  notes, title block properties) and its PDF, a SOLIDWORKS screenshot and a command's history in `sw_command_status`;
  the owner then reported pause and resume and the add-in's reconnection after Tools > Add-Ins off and on as working
  (not watched remotely). Results and what was not tested: `docs/KEVOS-TEST-REPORT.md` section 4. Found:
  `sw_selftest` cannot finish from an AI app that ends a tool call after 60 s (Claude's did): the stage stops with the
  call, after its first step, and leaves an unsaved part; a fillet with its prediction (the body read back as STEP)
  took over 60 s; one status read took 39 s (the Companion took the command after 12 s, the add-in answered 26 s later
  with six documents open); the owner's default drawing template has no sheet format, so no title block shows.
- KEVOS: the release MSI is built only by CI; no MCP progress notifications
  (JSON responses), progress is in `sw_command_status`; ChatGPT and Grok connectors untested; the gateway is one
  process (SQLite, live sessions in memory).
- App sign-in (OAuth) is tested with the MCP Python SDK client; not yet with every AI app's connector.
- The `ai` extra in pyproject.toml (anthropic) is no longer used; drop it the next time the pins are regenerated.
- BIZOMAT ERP status: tested against a stand-in and the real work app run locally, not yet against production. The
  ERP's contract has no field for the Companion's version, so it is not reported. Direct-link commands are not recorded,
  so they are not among the reported jobs.

## Next

1. Make `sw_selftest` survive an AI app's 60 s tool limit (run each stage in the background and report progress), and
   make the slow reads faster (a fillet's prediction, a status read with many documents open).
1. Finish the KEVOS checklist (`docs/KEVOS-TEST-REPORT.md` section 4): the items still marked not tested.
1. Run the self test on more real SOLIDWORKS installs and fix from the reports.
2. Tune SW_GUIDE from what the AI gets wrong on real work.
3. Early access and Google sign-in settings on the Admin page.
