# CLAUDE.md

Guidance for AI coding agents (and people) working in this repository.

## What this repo is

BIZOMAT CAD Automation (short: CAD Automation; a product of the BIZOMAT platform, "Intelligent Business Automation
Platform"; called CADOS by KEVOS until November 2026) connects AI apps (Claude, ChatGPT and other MCP clients) to
SOLIDWORKS on the user's own PC. The code keeps OpenSketch as its internal name: the `opensketch` package,
`OPENSKETCH_*` settings, cookies, the add-in's COM ids and file names, the MCP tool names. The AI calls the `sw_` MCP
tools; the server checks each sketch and feature with OpenSketch's build123d/OpenCascade kernel, queues the work, and
the add-in in SOLIDWORKS (`solidworks/`, C#) fetches it over outgoing HTTPS and makes native SOLIDWORKS features. A
home page sets it up. License: AGPL-3.0-only. This folder is `apps/cad` in the BIZOMAT platform repository (the
website at its root, `apps/work` Project Management, `shared/brand` the brand system); its CADOS history is kept.

BIZOMAT CAD Automation for SOLIDWORKS (0.12.3; CADOS for SOLIDWORKS in 0.12.0 to 0.12.2, KEVOS Bridge up to 0.11) builds
on it: the server is the CAD Automation gateway; each Windows computer runs the native add-in (COM `ISwAddin`, Tools >
Add-Ins > BIZOMAT CAD Automation, BIZOMAT tab, menu and task pane) and the BIZOMAT Companion (`KEVOS.Companion.exe`,
tray app, starts with Windows, registered by pairing) which holds a signed outbound link to the gateway and hands
commands to the add-in over a local named pipe; one MSI ("BIZOMAT CAD Automation for SOLIDWORKS", file
`CADOS-for-SOLIDWORKS-*.msi`) installs both. `docs/CADOS-ADDIN.md` has the architecture, the gap report (there was never
a macro product: the add-in was always a COM add-in) and the release process. Docs: `docs/BRIDGE-PROTOCOL.md` (the
contract), `docs/KEVOS-*.md` (install, Cloudflare, security, versions, troubleshooting, build, signing, test report,
release notes; the file names are historical). The MSI builds unsigned on Windows in CI (`installer` job); signing
waits for a signing service.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Test before committing: `pytest -q` (needs node for the sketch solver; the slow bridge end-to-end test needs the .NET
  8 SDK) and `npm test` (the solver alone); the add-in and Companion with `bash solidworks/build.sh test` (.NET 8 SDK). For page changes, check the page in Chromium with
  Playwright at desktop and phone width.
- No emojis anywhere. Plain language, short sentences, little text on pages.
- Brand: BIZOMAT CAD Automation ("CAD Automation" for short; "BIZOMAT" alone in SOLIDWORKS' tab and menu, "BIZOMAT
  Companion" for the tray app). Never write "®" or "TM" after BIZOMAT. Never "OpenSketch", "CADOS" or "KEVOS" in
  anything people read (pages, MCP server name and instructions, tool descriptions, messages, the add-in, the
  Companion, the installer), except a history note such as "called CADOS until November 2026"; ids and real paths and
  file names stay as they are (`Documents\OpenSketch`, `OpenSketchSW.exe`, `KEVOS.Companion.exe`,
  `Software\KEVOS\Bridge`, the pipe, the COM ids, `CADOS-for-SOLIDWORKS-*.msi`, `cados.css`, the bridge protocol's
  `KEVOS-*` and `kevos-*` names, the default service address https://cados.kevos.com). The brand system is
  `shared/brand/` at the repository root; `node shared/brand/build.mjs` copies it here (`opensketch/bizomat_brand.py`:
  WORDMARK_PATH, B_PATH, BAR_PATH and the colours; `static/ui/bizomat-tokens.css`; `static/ui/bizomat-logo-light.svg`;
  `static/favicon.*`, `ui/icon-*.png`, `ui/og.png`; `static/fonts/oxanium-latin.woff2`): never edit the copies by hand.
  `brand.py` draws the wordmark inline (navy #0a1f33 word, teal #0f766e connector bar, the B's middle bar) with the
  product label "CAD Automation", the BIZOMAT menu (the platform at BIZOMAT_SITE_URL, default https://bizomat.ai;
  Project Management at BIZOMAT_WORK_URL, default https://work.bizomat.ai; CAD Automation), and footers with this
  app's /privacy and the platform's Privacy, Terms and Disclaimer; page titles "<Page> | BIZOMAT CAD Automation".
  One design system for every page: `/ui/bizomat-tokens.css` is linked before `/ui/cados.css`, whose own variables
  map to the `--bz-*` tokens (teal #0f766e buttons and links, hover #115e59, mark #14b8a6, paper #f7f9fb, ink #0e1726,
  muted #56657a, 8 px buttons, 12 px cards; H1 to H4 in Oxanium 650, body Inter Tight). The C# side draws the same
  paths (`solidworks/src/Core/BrandArt.cs`, checked against `bizomat_brand.py` by `tests/test_installer.py`;
  `src/Shared/BrandDraw.cs`). Light theme. System monospace for technical labels; fonts served from
  `opensketch/static/fonts` (no third-party requests: the privacy page says so). Copy claims only what the code does
  (site.py says where each comes from).
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

## Current state (v0.8 server, BIZOMAT CAD Automation for SOLIDWORKS 0.12.3)

- Registered computers (`devicebridge.py`, built as the KEVOS bridge; router included in `server.py`): pairing (`/v2/devices/pair/*`, the
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
- MCP (`mcp_server.py`): one MCPServer "BIZOMAT CAD Automation" with INSTRUCTIONS for SOLIDWORKS work and 31 tools: every `sw_`
  tool (`sw_tools.py`, `sw_selftest.py`, registered on `mcp` at import) plus `request_upload`. Every tool that reaches
  SOLIDWORKS takes an optional `device` (the `_routed` decorator sets `_DEVICE`/`_TOOL` for `_run`, `_geometry`, whose
  cache is per person and computer, and the status checks); `sw_list_devices`, `sw_command_status`,
  `sw_cancel_command` are new. The gates record the AI app's grant ({id, name}, no token) and a correlation id for
  commands. `Endpoint` serves it
  at each path in `PATHS` = ("/mcp", "/solidworks/mcp"): the path itself takes a Bearer token (`_BearerGate`, 401
  with the protected-resource pointer for that path), `path/<key>` the private address (`_TokenGate`,
  `auth.resolve_mcp`). /solidworks/mcp is a second address early connectors used. Stateless Streamable HTTP, JSON
  responses.
- OAuth (`mcpauth.py`): `RESOURCES` maps both paths to "BIZOMAT CAD Automation" with their own protected-resource
  metadata; a token from either works on both; one connection per person and app. Two public host names
  (OPENSKETCH_ALIAS_HOSTS, e.g. "cad.bizomat.ai,cados.kevos.com"): a request to one gets `auth.public_url()` /
  `mcpauth.base_url()` = https://<that host>, so its metadata names the address the client used (else
  OPENSKETCH_PUBLIC_URL, else the request's host); tokens are looked up by hash and work on both; authorize and token
  accept either host's resource (`own_bases`, `_own_targets`), `iss` is the issuer of the resource's host
  (`issuer_for`), refresh ignores `resource`; a resource elsewhere is `invalid_target` (`tests/test_alias_hosts.py`). DCR, client metadata documents (fetched with
  `safefetch.py`: public https only, pinned address), PKCE S256, refresh rotation, revoke.
- Sign-in (`auth.py`, `accounts.py`, `oauth.py`): accounts with scrypt passwords, invites, Google sign-in (secret
  encrypted with `secretbox.py`), an optional early access code (`OPENSKETCH_ACCESS_CODE` or the owner's setting) that
  makes "Internal tester" accounts. The setup page shows only until the first account exists; after that `/login` is
  Sign in ("Welcome back"), and a person already signed in on that browser (90-day session) goes straight to `next`.
  Sign-in pages and messages never name the OPENSKETCH_* settings. New-account forms (setup, join, sign-up) come with
  a strong password filled in (`auth.suggest_password`, dots with Show, hidden `suggested`); keeping it holds it in
  memory for 30 minutes (`auth.hold_new_password`) so Home shows it once (`GET/DELETE /api/account/new-password`).
  Each account records who chose its password (`pw_by`: self, suggested, owner; `pw_at`), shown on Admin; only the
  scrypt hash is kept, so nobody (the owner included) can read a password back. A member whose password the owner
  set sees "Choose your own in Settings" on Home. The server password is asked only on the setup page (and /reset);
  spaces and one pair of quotes around it are forgiven (`auth._loose`). The setup page's "Anyone can create their
  own account" box (ticked by default) turns on open sign-up with the owner account; the page tells other visitors
  CAD Automation is not set up yet. Sign-in pages say "Sign in to BIZOMAT" with "CAD Automation" over each form. After sign-in the owner sees the server password on Admin (`GET /api/admin/server-password`,
  owner only, fetched on Show/Copy load, never in page source); people never need it.
- Pages: `/` is the product page for visitors (`site.landing`) and the app's Home for a signed-in person (and on an
  open server); `/overview` (product page) and `/docs` (setup, connection, auth, verify, self test, troubleshooting,
  security) are public (`auth.PUBLIC_PAGES`), as are `/privacy` and the design system under `/ui/` (`cados.css`,
  `app.js`, `bizomat-tokens.css`, `bizomat-logo-light.svg`, `og.png`, icons). FastAPI's own /docs and /redoc are off. A browser asking for a
  missing page gets the branded 404 (`site.not_found`); API, MCP and device paths keep JSON 404s.
- The signed-in app (`app_pages.py`, one script `static/ui/app.js`, sections in `brand.APP_NAV`): Home (`/dashboard`:
  "Engineering, made intelligent.", a task box that copies the task for the AI assistant and opens Claude or ChatGPT,
  connection summary, a 4-step setup list, recent activity), CAD Assistant (`/assistant`: connector address,
  per-app steps, connected apps with Disconnect, example requests from `catalog.EXAMPLES`), SOLIDWORKS
  (`/solidworks`: installer, computers with default/remove, how CAD Automation connects (add-in, Companion, cloud MCP,
  self-hosted, direct link, launcher macro: never called an add-in), service address, manual package), Tools
  (`/tools`: every MCP tool in plain words from `catalog.GROUPS`, searchable; `tests/test_app_pages.py` keeps it equal
  to the registered tools), History (`/history`: `GET /api/commands`, the person's commands to paired computers from
  bridge.sqlite; direct-link commands are not recorded), Settings (`/settings`: account, private address and add-in
  key with Show / Copy / New, change password, sign out), Admin (`/admin`, the owner only; anyone else is sent to
  Home: add a person with a suggested password the owner can change, shown once after adding (`POST /api/account/users`, role member), set someone's password
  (`POST /api/account/users/<id>/password`: signs them out everywhere and ends their AI apps' sign-ins), remove a
  person (also revokes their paired computers), people with their computers and AI apps (`GET /api/admin/people`),
  invite links, open sign-up). People sign in with that password when the installer's pairing step opens the
  browser, or type the same email and password in the Companion's pairing window (`POST /v2/devices/pair/password`,
  signed with the pairing key, rate-limited like the sign-in page; the password is sent once and kept nowhere). The
  installer download (`/download/solidworks`) needs sign-in. No stored-automation section: the app keeps no stored automations. Live status
  states: Connected, Disconnected, Checking connection, Authentication required, Installation required, Connection
  error. App header: the BIZOMAT wordmark with "CAD Automation", the sections, a BIZOMAT menu (the platform, Project
  Management, CAD Automation), the person, Sign out; app footer links the platform, Project Management, Documentation,
  /privacy, the platform's Privacy, Terms and Disclaimer, and Support. `GET /api/solidworks` still gives the pages everything in one call. Sign-in, consent, notice and
  pairing pages share `auth.PAGE` (product panel and form).
- Behind a proxy (`proxy.py`, `ForwardedHeaders`, the outermost middleware): the client address (rate limits, the
  RequestLog line) is Fly-Client-IP on Fly.io (FLY_APP_NAME set), else the right-most X-Forwarded-For address that is
  not a trusted proxy when the connection is from one (OPENSKETCH_TRUSTED_PROXIES, default 127.0.0.0/8 and ::1), else
  the connection's; X-Forwarded-Host (into Host) and X-Forwarded-Proto are believed only from a trusted proxy (the
  scheme also from Fly's edge) and removed otherwise. `__main__.py` turns uvicorn's own proxy headers off, and for
  `--host ::` opens one dual-stack socket (else an IPv6 and an IPv4 one; IPv4 only without IPv6) so 127.0.0.1 reaches
  it; `supervisor.probe_url` asks 127.0.0.1 for wildcard hosts and brackets IPv6 literals. An open server's pairing
  check uses the decided client, so a visitor through a local proxy is remote. The platform runs `python -m opensketch
  --host :: --port 8001 --no-browser --supervise` with OPENSKETCH_DATA=/data/cad (nothing assumes /data)
  (`tests/test_proxy.py`, its slow test starts exactly that).
- Server (`server.py`): lifespan (warms the owner's agent CAD worker, runs the MCP session manager), ForwardedHeaders,
  CanonicalHost, BodyLimit, RequestLog, PasswordGate; /healthz; account routes; add-in link (`/mcp/sw/hello|next|result|file|blob`), `/api/sw*`;
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
  remake. The add-in is 0.12.3
  (`solidworks/Directory.Build.props`; bump it whenever the add-in or the Companion changes). Its hello sends its version and
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
  `Directory.Build.props`, 0.12.3; Company BIZOMAT, Product "BIZOMAT CAD Automation for SOLIDWORKS"): Core (Json, Geom,
  SketchPlan, BridgeClient, BrandArt (the names, the logo's paths as polygons, the tab names); Bridge2: Crypto (ES256 JWS, JWK),
  Wire (ids, times, 4-byte-length frames), ReplayGuard, PipeLink (the add-in's pipe client: reader thread for pings and
  cancels, one worker for commands, outbox across reconnects, at-most-once by command id), CloudLink and
  CompanionEngine (the Companion's core: signed long poll, verification, routing to a SOLIDWORKS session, spool,
  persistent outbox, heartbeats), Destructive), Shared (BrandDraw: the wordmark and mark in GDI+, compiled into the
  add-in and the Companion, not the Linux tests), Addin (Entry: BIZOMAT menu (title "BIZOMAT CAD Automation" in Tools >
  Add-Ins), KevosUi CommandManager group and BIZOMAT tab (removes the old KEVOS and CADOS tabs:
  BrandArt.TabsToReplace), icons (the mark, teal buttons), CadosPane task pane "BIZOMAT CAD Automation" (the wordmark,
  state, Connect/Disconnect, prompts to copy, confirmation setting, activity, links); Host:
  the direct link and the Companion link, UI-thread snapshot of documents, document events, modal-dialog check,
  Safety confirmation of destructive ops; CompanionPipe: the pipe client that checks its server is the installed
  Companion; ConnectForm; Settings in HKCU\Software\OpenSketch and HKCU\Software\KEVOS\Bridge; Log in
  %LOCALAPPDATA%\OpenSketch\SolidWorks; Commands, Files, Pick, Sketches, Features, Edits with Journal rollback,
  Assembly), App `OpenSketchSW.exe` (Install for me = per-user COM registration + the launcher macro
  `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" from outside, direct link only).
  The COM ids are unchanged (existing registrations and the macro keep working); the add-in's title is "BIZOMAT CAD
  Automation" (Entry.cs, the MSI and the per-user install write the same).
- BIZOMAT Companion (`solidworks/src/Companion`, `KEVOS.Companion.exe`, net48, compiles Core and Shared, no SOLIDWORKS
  reference; AssemblyTitle "BIZOMAT Companion" for Task Manager): tray app (the BIZOMAT mark with a status dot; "Pause
  CAD Automation"), one per Windows user, starts at sign-in (HKLM Run from the MSI; per-user opt-out flag), pairing window,
  device key in CNG (TPM first, not exportable), the pipe `\\.\pipe\KEVOS.Bridge.<SID>` (first instance, user-only
  DACL, remote clients rejected, clients must be SLDWORKS.exe with the installed add-in), SOLIDWORKS detection and the
  LoadAddIn fallback, removal of old per-user OpenSketch registrations, crash restart, logs in
  %LOCALAPPDATA%\KEVOS\Bridge\logs, diagnostics, updater (gateway-signed manifest, hash, Authenticode, same publisher,
  the person asked). `--pair`, `--diagnose`, `--unpair`, `--startup on|off`, `--exit`.
- Installer (`installer/KEVOS-Bridge.wxs`, `installer/build.ps1`): WiX 5 per-machine x64 MSI "BIZOMAT CAD Automation
  for SOLIDWORKS" by BIZOMAT (Start menu folder BIZOMAT: BIZOMAT Companion, Pair this computer with CAD Automation, CAD
  Automation diagnostics, Remove this computer from CAD Automation; UpgradeCode, component key paths, install folder,
  registry keys and the Run value's name unchanged: upgrades KEVOS Bridge and CADOS for SOLIDWORKS),
  `CADOS-for-SOLIDWORKS-<version>-x64.msi` plus the stable `CADOS-for-SOLIDWORKS-x64.msi` (file names kept); built and (with secrets) signed by the `installer` job in `solidworks.yml` on Windows;
  releases `bridge-latest` and `bridge-v<version>`. `/download/solidworks` (public) redirects to
  OPENSKETCH_INSTALLER_URL, else the published `bridge-release.json` msi_url, else the stable bridge-latest asset.
  `tests/test_installer.py` keeps the MSI, the add-in code and the download link in step.

## Hosting

- Code: `apps/cad` in the BIZOMAT platform repository (jogkev-creator/gocore-website), with the history of
  https://github.com/jogkev-creator/CADOS (moved from jogkev-creator/opensketchyz in Nov 2026), which still holds the
  releases: release downloads, the MSI's links and `swbridge.ADDIN_DOWNLOAD` point there. The workflows in
  `apps/cad/.github` run only in that repository; the platform's own workflows are at the repository root.
- BIZOMAT platform: one Fly.io app with a proxy in front; this server runs there as `python -m opensketch --host ::
  --port 8001 --no-browser --supervise` (OPENSKETCH_DATA=/data/cad) and answers on https://cad.bizomat.ai and, for
  existing connectors, add-ins and Companions, https://cados.kevos.com (OPENSKETCH_ALIAS_HOSTS lists both). The
  platform's own docs (repository root `docs/BIZOMAT-*.md`) describe the proxy and the cutover.
- Until the cutover: public address https://cados.kevos.com (point it at the Fly app with `domain.yml`; fly.toml [env] and deploy.yml set
  it as OPENSKETCH_PUBLIC_URL). `canonical.py` (outermost middleware) answers 301 on the old host (fly.toml
  OPENSKETCH_REDIRECT_HOSTS=cados.fly.dev, Host header only) for GET/HEAD, keeping path and query; never for
  /healthz, /mcp*, /solidworks/mcp*, OAuth register/token/revoke, /.well-known/, /v2/, /api/ (`tests/test_canonical.py`).
  Alias hosts are redirected only when they are also in OPENSKETCH_REDIRECT_HOSTS. Favicons (`static/favicon.svg|ico`,
  `ui/icon-32.png`, `ui/icon-180.png`) are the BIZOMAT mark (shared/brand). Origin https://cados.fly.dev (Fly
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
- Account admin page (`/admin`) covers people, passwords, invites and open sign-up; early access codes and Google
  sign-in setup are still API only (`/api/account/settings`, `/api/account/google`).
- The device bridge: not yet run on Windows or in a real SOLIDWORKS; the MSI is built only by CI; no MCP progress notifications
  (JSON responses), progress is in `sw_command_status`; ChatGPT and Grok connectors untested; the gateway is one
  process (SQLite, live sessions in memory).
- App sign-in (OAuth) is tested with the MCP Python SDK client; not yet with every AI app's connector.
- The `ai` extra in pyproject.toml (anthropic) is no longer used; drop it the next time the pins are regenerated.

## Next

1. Run the checklist (`docs/KEVOS-TEST-REPORT.md` section 4) on Windows with SOLIDWORKS 2022: the MSI, the
   Companion, the add-in's BIZOMAT UI (tab, menu, task pane, icons drawn from the brand paths, the old CADOS and KEVOS
   tabs removed), events, confirmation and modal check have only been compiled, not run.
1. When cad.bizomat.ai is live: set OPENSKETCH_PUBLIC_URL to it (canonical tags), keep both hosts in
   OPENSKETCH_ALIAS_HOSTS, and leave cados.kevos.com out of OPENSKETCH_REDIRECT_HOSTS while connectors still use it.
1. Run the self test on real SOLIDWORKS installs and fix from the reports.
2. Tune SW_GUIDE from what the AI gets wrong on real work.
3. Early access and Google sign-in settings on the Admin page.
