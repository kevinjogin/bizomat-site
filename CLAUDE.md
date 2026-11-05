# CLAUDE.md

Guidance for AI coding agents (and people) working in this repository.

## What this repo is

CADOS by KEVOS (product name; the code keeps OpenSketch as its internal name: the `opensketch` package,
`OPENSKETCH_*` settings, cookies, the add-in's COM ids and file names, the MCP tool names) connects AI apps (Claude,
ChatGPT and other MCP clients) to SOLIDWORKS on the user's own PC. The AI
calls the `sw_` MCP tools; the server checks each sketch and feature with OpenSketch's build123d/OpenCascade
kernel, queues the work, and the OpenSketch add-in in SOLIDWORKS (`solidworks/`, C#) fetches it over outgoing HTTPS
and makes native SOLIDWORKS features. A home page sets it up. License: AGPL-3.0-only.

KEVOS Bridge (0.11.0) builds on it: the server is the KEVOS gateway; each Windows computer runs the KEVOS Companion
(tray app, starts with Windows, registered by pairing) which holds a signed outbound link to the gateway and hands
commands to the add-in over a local named pipe; an MSI installs both. Docs: `docs/BRIDGE-PROTOCOL.md` (the contract),
`docs/KEVOS-*.md` (install, Cloudflare, security, versions, troubleshooting, build, signing, test report, release
notes). The MSI builds unsigned on Windows in CI (`installer` job); signing waits for a signing service.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Test before committing: `pytest -q` (needs node for the sketch solver; the slow KEVOS end-to-end test needs the .NET
  8 SDK) and `npm test` (the solver alone); the add-in and Companion with `bash solidworks/build.sh test` (.NET 8 SDK). For page changes, check the page in Chromium with
  Playwright at desktop and phone width.
- No emojis anywhere. Plain language, short sentences, little text on pages.
- Brand: CADOS by KEVOS. Never "OpenSketch" in anything people read (pages, MCP server name, messages); real file
  paths and file names (`Documents\OpenSketch`, `OpenSketchSW.exe`) stay as they are. Logos are SVG paths in
  `brand.py`: the CADOS wordmark (built from the KEVOS letterforms) with "by KEVOS"; the KEVOS logo links to
  https://kevos.com/. One design system for every page: tokens and components in `opensketch/static/ui/cados.css`
  (KEVOS orange #F47B20 for marks; #BF550B buttons and #B44F0A links for contrast on white; warm off-white
  surfaces, charcoal #16181D headings), shared head/header/footer in `brand.py`. Light theme. Inter Tight headings,
  Inter body, system monospace for technical labels; fonts served from `opensketch/static/fonts` (no third-party
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
- No personal, client or confidential details in code, comments, tests or docs: the repository is public.
- CI: `.github/workflows/tests.yml` (pytest in two jobs: main and `-m slow`; npm test) on pull requests and
  non-main pushes; `deploy.yml` deploys main to Fly after the same tests, skipping pushes that only touch notes,
  docs or tests, and fails if the live /healthz does not show the new version within 3 minutes; `solidworks.yml`
  builds and tests the add-in and keeps the zip as an artifact. `domain.yml` (run by hand, `.github/scripts/kevos-domain.sh`) gives the Fly app
  its own address on a Cloudflare domain: DNS record, Fly certificate and validation record, OPENSKETCH_PUBLIC_URL
  (secrets CLOUDFLARE_API_TOKEN, FLY_API_TOKEN). Python pins live in requirements.txt (image) and
  requirements-dev.txt (CI), with hashes.

## Current state (v0.8 server, KEVOS Bridge 0.11.0)

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
- MCP (`mcp_server.py`): one MCPServer "OpenSketch" with INSTRUCTIONS for SOLIDWORKS work and 31 tools: every `sw_`
  tool (`sw_tools.py`, `sw_selftest.py`, registered on `mcp` at import) plus `request_upload`. Every tool that reaches
  SOLIDWORKS takes an optional `device` (the `_routed` decorator sets `_DEVICE`/`_TOOL` for `_run`, `_geometry`, whose
  cache is per person and computer, and the status checks); `sw_list_devices`, `sw_command_status`,
  `sw_cancel_command` are new. The gates record the AI app's grant ({id, name}, no token) and a correlation id for
  commands. `Endpoint` serves it
  at each path in `PATHS` = ("/mcp", "/solidworks/mcp"): the path itself takes a Bearer token (`_BearerGate`, 401
  with the protected-resource pointer for that path), `path/<key>` the private address (`_TokenGate`,
  `auth.resolve_mcp`). /solidworks/mcp is a second address early connectors used. Stateless Streamable HTTP, JSON
  responses.
- OAuth (`mcpauth.py`): `RESOURCES` maps both paths to "OpenSketch" with their own protected-resource metadata; a
  token from either works on both; one connection per person and app. DCR, client metadata documents (fetched with
  `safefetch.py`: public https only, pinned address), PKCE S256, refresh rotation, revoke.
- Sign-in (`auth.py`, `accounts.py`, `oauth.py`): accounts with scrypt passwords, invites, Google sign-in (secret
  encrypted with `secretbox.py`), an optional early access code (`OPENSKETCH_ACCESS_CODE` or the owner's setting) that
  makes "Internal tester" accounts. Account admin is API only (`/api/account*`), no page yet.
- Pages: `/` is the product page for visitors (`site.landing`) and the dashboard for a signed-in person (and on an
  open server); `/overview` (product page) and `/docs` (setup, connection, auth, verify, self test, troubleshooting,
  security) are public (`auth.PUBLIC_PAGES`), as are `/privacy` and the design system under `/ui/` (`cados.css`,
  `og.png`, `icon-180.png`). FastAPI's own /docs and /redoc are off. Dashboard (`sw_page.py`, `/dashboard`, also
  `/solidworks`, sign-in required): five setup steps with progress (install, activate in SOLIDWORKS with the
  computers list and the direct link's address + key with Show / Copy / New key, connect the AI assistant with the
  connector address, per-app instructions, connected apps and the private address with Show / Copy / New address,
  verify, self test), a live status (Connected, Disconnected, Checking connection, Authentication required,
  Installation required, Connection error), a summary and help panel. `GET /api/solidworks` gives it everything in
  one call. Sign-in, consent, notice and pairing pages share `auth.PAGE` (product panel and form).
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
  the `addin-latest` GitHub release with every main build (`swbridge.ADDIN_DOWNLOAD`, `OPENSKETCH_ADDIN_URL`).
- Drawing API (0.10.0; `sw_get_drawing`, `sw_edit_drawing` in `sw_tools.py`, `solidworks/src/Addin/DrawingEdits.cs`):
  read the sheet, views (type, orientation, scale, outline in sheet mm, display, dimension count, model) and title
  block fields; change a drawing with up to 40 actions run in order (`DRAWING_ACTIONS` lists each one's keys and is
  checked on the server before anything is sent): view, projected (CreateUnfoldedViewAt3), section (a cutting line
  drawn in the view through a model point via ModelToViewTransform, or a fraction of the outline, then
  CreateSectionViewAt5), detail (a circle, then CreateDetailViewAt4), move, scale (or back to the sheet's), display,
  delete, rename, dimensions (InsertModelAnnotations3 on one view or all), arrange_dimensions, centre_marks
  (AutoInsertCenterMarks2), note (CreateText2), properties, sheet (scale, projection), bom (InsertBomTable4 with the
  first BOM template in SOLIDWORKS' file locations, then AutoBalloon5). A failing action stops the list; the result
  says which, with what was done before it. Not run in a real SOLIDWORKS yet.
- `sw_selftest.py`: stages plate / shapes / assembly in `Documents\OpenSketch\selftest` (the plate stage ends with its drawing and a PDF of it), each step ok / check /
  failed with the reason; the first thing to run on a new PC. Tests run it against SimSW, a stand-in add-in built
  on the kernel and mate solver.
- Add-in (`solidworks/`, .NET Framework 4.8 x64, SOLIDWORKS 2022 interop embedded; version in
  `Directory.Build.props`, 0.11.0): Core (Json, Geom, SketchPlan, BridgeClient; Bridge2: Crypto (ES256 JWS, JWK),
  Wire (ids, times, 4-byte-length frames), ReplayGuard, PipeLink (the add-in's pipe client: reader thread for pings and
  cancels, one worker for commands, outbox across reconnects, at-most-once by command id), CloudLink and
  CompanionEngine (the Companion's core: signed long poll, verification, routing to a SOLIDWORKS session, spool,
  persistent outbox, heartbeats), Destructive), Addin (Entry: KEVOS menu, KevosUi CommandManager group and tab; Host:
  the direct link and the Companion link, UI-thread snapshot of documents, document events, modal-dialog check,
  Safety confirmation of destructive ops; CompanionPipe: the pipe client that checks its server is the installed
  Companion; ConnectForm; Settings in HKCU\Software\OpenSketch and HKCU\Software\KEVOS\Bridge; Log in
  %LOCALAPPDATA%\OpenSketch\SolidWorks; Commands, Files, Pick, Sketches, Features, Edits with Journal rollback,
  Assembly), App `OpenSketchSW.exe` (Install for me = per-user COM registration + the launcher macro
  `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" from outside, direct link only).
  The COM ids are unchanged (existing registrations and the macro keep working); the add-in's title is KEVOS.
- KEVOS Companion (`solidworks/src/Companion`, `KEVOS.Companion.exe`, net48, compiles Core, no SOLIDWORKS reference):
  tray app, one per Windows user, starts at sign-in (HKLM Run from the MSI; per-user opt-out flag), pairing window,
  device key in CNG (TPM first, not exportable), the pipe `\\.\pipe\KEVOS.Bridge.<SID>` (first instance, user-only
  DACL, remote clients rejected, clients must be SLDWORKS.exe with the installed add-in), SOLIDWORKS detection and the
  LoadAddIn fallback, removal of old per-user OpenSketch registrations, crash restart, logs in
  %LOCALAPPDATA%\KEVOS\Bridge\logs, diagnostics, updater (gateway-signed manifest, hash, Authenticode, same publisher,
  the person asked). `--pair`, `--diagnose`, `--unpair`, `--startup on|off`, `--exit`.
- Installer (`installer/KEVOS-Bridge.wxs`, `installer/build.ps1`): WiX 5 per-machine x64 MSI; built and (with secrets)
  signed by the `installer` job in `solidworks.yml` on Windows; releases `bridge-latest` and `bridge-v<version>`.

## Hosting

- Code: https://github.com/jogkev-creator/CADOS (moved from jogkev-creator/opensketchyz in Nov 2026; release
  downloads, the MSI's links and `swbridge.ADDIN_DOWNLOAD` point there). The Fly app below was linked to the old
  repository: relink it in Fly (or deploy by hand) after the move.
- Public address https://cados.kevos.com (point it at the Fly app with `domain.yml`; deploy.yml sets it as
  OPENSKETCH_PUBLIC_URL unless the repository variable PUBLIC_URL says otherwise). Origin https://cados.fly.dev (Fly
  app `cados`, Sydney, first made with Fly Launch from GitHub on 4 Nov 2026); the deploy health checks use it.
  One deploy source: the app is linked to this repository in Fly (Fly builds and deploys every push to main itself;
  /healthz then reports version "dev", as no commit is passed in). On a push `deploy.yml` only runs the tests (unless
  the repository variable DEPLOY_ON_PUSH is "true"); run by hand it deploys from Actions and makes a missing volume
  and password secret. `fly-status.yml` (run by hand, changes nothing) prints the app's machines, volumes, secret
  names, releases, logs and /healthz: both need the repository secret FLY_API_TOKEN (a deploy token for cados).
  The OPENSKETCH_PASSWORD secret must be set on the Fly app. The Windows PC server (`windows/`) is the other way to run it.
- fly.toml: app `cados`, performance-1x (one dedicated core, 2 GB), `auto_stop_machines = "suspend"`, kill_timeout 15, volume
  `opensketch_data` at /data. The add-in's long poll keeps the machine awake while SOLIDWORKS is linked.
- `supervisor.py` (`python -m opensketch --supervise`, the image's CMD): asks /healthz every 5 s, restarts the server
  after 120 s without an answer (stacks to the log first), tells a suspended machine from a hang.
- `cadworker.py`: CAD in worker processes, one per person and kind, at most OPENSKETCH_CAD_LANES (3) live, one place
  kept for the owner, idle ones stop after 15 min, workers over 800 MB replaced. `OPENSKETCH_CAD_WORKERS=0` runs in
  threads (tests/conftest.py sets it).

- One Windows PC (`windows/`): `setup.ps1` (Python 3.12 venv, pinned packages, copies the add-in zip from
  Downloads), `start.ps1` (asks for the server password, kept only in that window, and an optional public https
  address for a tunnel; runs on port 8000), `update-addin.ps1` (newest add-in zip from Downloads, checked >= 0.10.0, into `%LOCALAPPDATA%\OpenSketch\AddIn`,
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
- No page for account admin (invites, people, early access, Google setup): the `/api/account*` routes remain.
- KEVOS: not yet run on Windows or in a real SOLIDWORKS; the MSI is built only by CI; no MCP progress notifications
  (JSON responses), progress is in `sw_command_status`; ChatGPT and Grok connectors untested; the gateway is one
  process (SQLite, live sessions in memory).
- App sign-in (OAuth) is tested with the MCP Python SDK client; not yet with every AI app's connector.
- The `ai` extra in pyproject.toml (anthropic) is no longer used; drop it the next time the pins are regenerated.

## Next

1. Run the KEVOS checklist (`docs/KEVOS-TEST-REPORT.md` section 4) on Windows with SOLIDWORKS 2022: the MSI, the
   Companion, the add-in's new UI, events, confirmation and modal check have only been compiled, not run.
1. Run the self test on real SOLIDWORKS installs and fix from the reports.
2. Tune SW_GUIDE from what the AI gets wrong on real work.
3. An account admin page.
