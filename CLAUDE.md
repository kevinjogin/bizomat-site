# CLAUDE.md

Guidance for AI coding agents (and people) working in this repository.

## What this repo is

OpenSketch connects AI apps (Claude, ChatGPT and other MCP clients) to SOLIDWORKS on the user's own PC. The AI
calls the `sw_` MCP tools; the server checks each sketch and feature with OpenSketch's build123d/OpenCascade
kernel, queues the work, and the OpenSketch add-in in SOLIDWORKS (`solidworks/`, C#) fetches it over outgoing HTTPS
and makes native SOLIDWORKS features. A home page sets it up. License: AGPL-3.0-only.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Test before committing: `pytest -q` (needs node for the sketch solver) and `npm test` (the solver alone); the
  add-in with `bash solidworks/build.sh test` (.NET 8 SDK). For page changes, check the page in Chromium with
  Playwright at desktop and phone width.
- No emojis anywhere. Plain language, short sentences, little text on pages.
- Brand: the text wordmark "OpenSketch" (Inter Tight 800, tight tracking) as the logo, "for SOLIDWORKS" beside it on
  the home page; the sign-in pages' look (dark, the angled indigo-to-pink band, raised cards, pill calls to action);
  fonts served from `opensketch/static/fonts` (no third-party requests: the privacy page says so).
- The feature format (`docs/DOCUMENT.md`, the registry in `opensketch/features/`) is the contract between the AI,
  the kernel and the add-in. Change it there first, then the kernel, then the add-in.
- Heavy work never runs on the web server's event loop: OpenCascade goes through the person's "agent" CAD worker
  (`cadworker.lane_for(person, "agent")`), node and big file writes through threads.
- No personal, client or confidential details in code, comments, tests or docs: the repository is public.
- CI: `.github/workflows/tests.yml` (pytest in two jobs: main and `-m slow`; npm test) on pull requests and
  non-main pushes; `deploy.yml` deploys main to Fly after the same tests, skipping pushes that only touch notes,
  docs or tests, and fails if the live /healthz does not show the new version within 3 minutes; `solidworks.yml`
  builds and tests the add-in and keeps the zip as an artifact. Python pins live in requirements.txt (image) and
  requirements-dev.txt (CI), with hashes.

## Current state (v0.8)

- MCP (`mcp_server.py`): one MCPServer "OpenSketch" with INSTRUCTIONS for SOLIDWORKS work and 28 tools: every `sw_`
  tool (`sw_tools.py`, `sw_selftest.py`, registered on `mcp` at import) plus `request_upload`. `Endpoint` serves it
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
- Home page (`sw_page.py`, at `/` and `/solidworks`, sign-in required): download the add-in; address + key with Show
  / Copy / New key; the connector address, the private address with New address, connected AI apps with Disconnect;
  the self-test prompt; a live status pill. `GET /api/solidworks` gives it everything in one call.
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
- Add-in (`solidworks/`, .NET Framework 4.8 x64, SOLIDWORKS 2022 interop embedded): Core (Json, Geom, SketchPlan,
  BridgeClient), Addin (Entry, Host, ConnectForm, Settings in HKCU\Software\OpenSketch, Log in
  %LOCALAPPDATA%\OpenSketch\SolidWorks, Commands, Files, Pick, Sketches, Features, Edits with Journal rollback,
  Assembly), App `OpenSketchSW.exe` (Install for me = per-user COM registration + the launcher macro
  `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" from outside). Three ways to start
  because IT may block per-user add-ins.

## Hosting

- fly.toml: performance-1x (one dedicated core, 2 GB), `auto_stop_machines = "suspend"`, kill_timeout 15, volume
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
- App sign-in (OAuth) is tested with the MCP Python SDK client; not yet with every AI app's connector.
- The `ai` extra in pyproject.toml (anthropic) is no longer used; drop it the next time the pins are regenerated.

## Next

1. Run the self test on real SOLIDWORKS installs and fix from the reports.
2. Tune SW_GUIDE from what the AI gets wrong on real work.
3. An account admin page.
