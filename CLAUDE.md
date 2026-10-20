# CLAUDE.md

## What this repo is

OpenSketch connects AI apps (Claude, ChatGPT...) to SOLIDWORKS on the user's own PC. The AI calls the `sw_` MCP
tools; the server checks each sketch and feature with OpenSketch's build123d/OpenCascade kernel, queues the work,
and the OpenSketch add-in in SOLIDWORKS (solidworks/, C#) fetches it over outgoing HTTPS and makes native
SOLIDWORKS features. A home page sets it up. There is no browser CAD app any more.

Archive (2026-10-20, YZ: "make this the default view of how opensketch works, put that gui interface and
unnecessary previous stuff to archive"): the browser CAD app (SOLIDWORKS-style UI, Files, in-app AI chat with
BYOK, OpenSketch documents and their MCP tools, Motion Review and share links, feature recognition, SOLIDWORKS
macro export and its toolchain, EAGLE import, demos, PWA, Codespaces setup, the opensketch-cad skill) lives on the
branch `archive/opensketch-app` (commit d6c4f66, the last main with the app). Its CLAUDE.md there has the full
history. The data on the Fly volume (the app's documents) was left in place.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Test before committing: `pytest -q` (needs node for the sketch solver) and `npm test` (the solver alone). For
  page changes, check the page in Chromium with Playwright (`pip install playwright`, `python -m playwright
  install chromium`) at desktop and phone width.
- No emojis anywhere. Plain language, short sentences, little text on pages (YZ dislikes text-heavy screens).
- Brand: the text wordmark "OpenSketch" (Inter Tight 800, tight tracking) as the logo, "for SOLIDWORKS" beside it
  on the home page; the sign-in pages' look (dark, the angled indigo-to-pink band, raised cards, pill calls to
  action); fonts served from static/fonts (no third-party requests: the privacy page says so).
- The feature format (docs/DOCUMENT.md, the registry in `opensketch/features/`) is what the AI writes; the add-in
  turns it into SOLIDWORKS features. Change the format there first, then the kernel, then the add-in.
- Heavy work never runs on the web server's event loop: OpenCascade goes through the person's "agent" CAD worker
  (`cadworker.lane_for(person, "agent")`), node and big file writes through threads.
- CI: `.github/workflows/tests.yml` (pytest in two jobs: main and `-m slow`; npm test) on pull requests and
  non-main pushes; `deploy.yml` deploys main to Fly after the same tests, skipping pushes that only touch notes,
  docs or tests, and fails if the live /healthz does not show the new version in 3 minutes; `solidworks.yml`
  builds and tests the add-in and keeps the zip as an artifact. Python pins live in requirements.txt (image) and
  requirements-dev.txt (CI), with hashes.

## Current state (2026-10-20, v0.8: the connector is OpenSketch)

- MCP (`mcp_server.py`): one MCPServer "OpenSketch" with INSTRUCTIONS for SOLIDWORKS work and 25 tools: every `sw_`
  tool (`sw_tools.py`, `sw_selftest.py`, registered on `mcp` at import) plus `request_upload` (says sw_import).
  `Endpoint` serves it at each path in `PATHS` = ("/mcp", "/solidworks/mcp"): the path itself takes a Bearer token
  (`_BearerGate`, 401 with the protected-resource pointer for that path), `path/<key>` the private address
  (`_TokenGate`, `auth.resolve_mcp`). /solidworks/mcp was the connector's address on 2026-10-20 while the app owned
  /mcp; kept so a connector added then still works. Stateless Streamable HTTP, JSON responses.
- OAuth (`mcpauth.py`): `RESOURCES` maps both paths to "OpenSketch" with their own metadata
  (`/.well-known/oauth-protected-resource[/mcp|/solidworks/mcp]`); a token from either works on both; one
  connection per person and app. Consent page and sign-in pitch ("Your AI, building in SOLIDWORKS.") speak
  SOLIDWORKS; footer "AI for SOLIDWORKS". DCR, client metadata documents, PKCE S256, refresh rotation, revoke: as
  before (tests/test_mcp_oauth.py, including the MCP SDK's own OAuth client).
- Home page (`sw_page.py`, served at `/` and `/solidworks`, sign-in required): four steps (download the add-in;
  address + key with Show / Copy / New key; the connector address, the private address under "Your app cannot sign
  in?" with New address, connected AI apps with Disconnect; the self-test prompt), a live status pill
  ("Connected: SOLIDWORKS 2022 on PC"), steps ticked when done, polled every 3 s while visible.
  `GET /api/solidworks` gives it everything in one call; `POST /api/sw/key`, `POST /api/connect/new_address`,
  `DELETE /api/account/apps/{id}` do the changes.
- Server (`server.py`, ~900 lines, was ~2,200): lifespan (warms the owner's agent CAD worker, runs the MCP session
  manager), BodyLimit, RequestLog, PasswordGate; /healthz; account routes (`/api/account*`: settings, invites, early
  access, Google setup, people) kept as APIs without a page; add-in link (`/mcp/sw/hello|next|result|file|blob`),
  `/api/sw*`; upload links (`/mcp/uploads/{id}`) and artifact downloads (`/mcp/artifacts/...`); OAuth routes; static
  files (favicon, fonts, `static/downloads/OpenSketch-SOLIDWORKS.zip` built by the Dockerfile).
- Kernel kept for the tools: geometry, features (registry), assembly, naming, params, inspection (sketch DOF via
  `solver/solve_cli.mjs`), measure, preview, importer (STEP only; `surfaces_match` moved in from recognition),
  artifacts, uploads, cadworker, store (accounts' data folder; its document code is unused now), accounts, auth,
  oauth, aikeys (encrypts the saved Google secret), providers (pinned fetches for OAuth client metadata).
  `docformat.py`: the feature-format text `sw_get_guide` appends (FEATURES_HELP from the registry + mate references)
  and the rebuild reports inspection uses.
- Privacy page rewritten for the connector (what passes through, nothing kept beyond short-lived uploads and
  exports, no AI of its own).
- Docker image: no macro toolchain (LibreOffice/JDK gone), no skills/; node stays for the sketch solver.
- Tests: the app's test files archived, 20 left for the connector and kernel; `tests/test_connector.py` (only
  SOLIDWORKS tools on both paths, one sign-in for both, private addresses, home page and API, the app's routes are
  gone); `tests/test_uploads.py` (links, signatures, gzip, per account, expiry); account, OAuth, hardening and
  worker tests adapted to the new routes; `tests/js/solver.test.mjs`.

## SOLIDWORKS add-in and tools (2026-10-19, unchanged since)

- Shape: AI app -> `/mcp` -> `sw_` tools -> `swbridge` queue -> the add-in long-polls the server over outgoing HTTPS
  and runs each command in SOLIDWORKS. SOLIDWORKS is the master copy; the server keeps no document for it.
- `swbridge.py`: per-person key `oss_...` = HMAC(data secret, person + counter) (`key_for`, `new_key`, `resolve`);
  one session per person (a new hello replaces the old one; 409 with reason restarted / replaced / closed);
  routes `/mcp/sw/hello`, `GET /mcp/sw/next` (held 25 s), `/mcp/sw/result`, `/mcp/sw/file` (gzip bodies),
  `/mcp/sw/blob/{id}`; connected = polled in the last 70 s; a tool waits 240 s by default. NOT_CONNECTED and the key
  errors point at the home page.
- `sw_tools.py`: features in OpenSketch's format are checked by the registry and each sketch is solved by
  `solver/solver.js` (over-defined refused before sending); `_predict` rebuilds them with the kernel on
  SOLIDWORKS' current body (STEP) and sends `expect` {dv, bbox, tool_bbox, plane, range} per feature; the add-in
  remakes a feature flipped when SOLIDWORKS read the direction the other way. Reading tools run on a STEP of the
  body, cached per person and part by SOLIDWORKS' update stamp. `sw_get_guide` = SW_GUIDE + docformat.GUIDE.
- `sw_selftest.py`: stages plate / shapes / assembly in `Documents\OpenSketch\selftest`, each step ok / check /
  failed with the reason; the first thing to run on a new PC.
- Add-in (`solidworks/`, .NET Framework 4.8 x64, SOLIDWORKS 2022 interop embedded; `bash solidworks/build.sh
  test`): Core (Json, Geom, SketchPlan, BridgeClient), Addin (Entry, Host, ConnectForm, Settings in
  HKCU\Software\OpenSketch, Log in %LOCALAPPDATA%\OpenSketch\SolidWorks, Commands, Files, Pick, Sketches, Features,
  Edits with Journal rollback, Assembly), App `OpenSketchSW.exe` (Install for me = per-user COM registration + the
  launcher macro `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" from outside).
  Three ways to start because IT may block per-user add-ins. Its texts point at "the OpenSketch SOLIDWORKS page".
- API review fixes (2026-10-19) are in the archive branch's CLAUDE.md ("SOLIDWORKS add-in").

## Server stays up (from the app, still in force)

- fly.toml: performance-1x (one dedicated core, 2 GB), `auto_stop_machines = "suspend"`, kill_timeout 15, volume
  `opensketch_data` at /data. The add-in's long poll keeps the machine awake while SOLIDWORKS is linked.
- `supervisor.py` (`python -m opensketch --supervise`, the image's CMD): asks /healthz every 5 s, restarts the
  server after 120 s without an answer (stacks to the log first), tells a suspended machine from a hang.
- `cadworker.py`: CAD in worker processes, one per person and kind (`lane_for(person, "agent")` for the tools), at
  most OPENSKETCH_CAD_LANES (3) live, one place kept for the owner, idle ones stop after 15 min, `make_room` before
  jobs, workers over 800 MB replaced. `OPENSKETCH_CAD_WORKERS=0` runs in threads (tests/conftest.py sets it).

## Known limits

- Nothing has run in a real SOLIDWORKS yet: only compiled against the 2022 interop, the link client tested against a
  real server, the server side against fakes. First run on YZ's work PC: install, connect, sw_selftest (three
  stages), then fix from the report and the log. Unconfirmed: SOLIDWORKS listing a per-user (HKCU) add-in at all
  (likely not, hence the macro and outside-exe routes), `.swb` macros on his install, AddDimension2 text position,
  obsolete calls kept for 2022 (FeatureFillet3, FeatureLinearPattern5, AddMate5, InsertProtrusionSwept4).
- No prediction for features that name existing SOLIDWORKS features (mirror / pattern of a tree feature). One
  SOLIDWORKS link per person. Equations are written for all configurations. Commands can arrive while SOLIDWORKS
  shows a modal dialog (only an open sketch is detected). SOLIDWORKS run as administrator ignores the per-user
  registration. Plain numbers in equations are in the document's unit.
- Large assemblies are slow to read: each read exports a STEP of the bodies that changed.
- No page for account admin (invites, people, early access, Google setup): the `/api/account*` routes remain.
  Sign-in pages still say "Sign in to your OpenSketch account."
- App sign-in (OAuth) is tested with the MCP Python SDK client; not yet with the real Claude / ChatGPT connectors.
- `store.py` still holds the app's document code (unused); `aikeys.py` and `providers.py` hold BYOK code of which
  only the Google-secret encryption and the pinned fetch are used. Trim when convenient.

## Next

1. On YZ's work PC: home page, install, connect, add `<site>/mcp` in Claude, run the self test; fix from the report.
2. Then real work on his projects (Lavilock, Doric windows) and tune SW_GUIDE from what the AI gets wrong.
3. Its own domain (PUBLIC_URL) and an account admin page if other people start using it.
