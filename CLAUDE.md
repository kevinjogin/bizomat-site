# CLAUDE.md

## What this repo is

OpenSketch: a parametric CAD app whose interface and operation logic follow SOLIDWORKS, built on
build123d, with an AI copilot ("Cursor for hardware"). Python backend (FastAPI + build123d) rebuilds
the feature tree and solves assembly mates; the browser UI (plain ES modules + three.js, no build
step) does sketching, sketch solving, mate solving and all interaction. The server is asked for
assemblies only when a part changes.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Match SOLIDWORKS in layout and behaviour: icon positions, CommandManager order, PropertyManager layout,
  mouse and keyboard behaviour. When in doubt, do what SOLIDWORKS 2024 does. Icons are original.
- The look is Linear's by default (`css/linear.css`, rules under `.skin-linear` with `.theme-dark` (default)
  and `.theme-light` token sets; `skin.js` swaps icon, 3D and sketch colours), so OpenSketch does not look
  like SOLIDWORKS. `app.css` alone is the classic SOLIDWORKS look (`.skin-classic`). Switch: avatar menu or
  View > Theme. New UI: style it in app.css with the tokens, then add its Linear version in linear.css using
  the theme tokens (--side, --content, --raised, --field, --line, --text, --text-2, --muted, --accent...),
  and check it in both themes. Sketch states keep their meaning (blue under, ink fully, red over); in the
  dark theme the ink is light.
- New part features go through the feature registry (`opensketch/features/`): one file with a
  `FeatureType` (typed params, sections, defaults, limits) and its `build(feat, st, diagnostics)`,
  imported at the bottom of `features/__init__.py`. That alone gives the ribbon button, a generated
  PropertyManager, the AI's `add_<type>` tool and help line, the MCP tool and input checks. Write a
  hand-written PropertyManager in features.js (and set `ui="custom"`) only when the generated one
  cannot match SOLIDWORKS.
- The part and assembly documents (docs/DOCUMENT.md) are the single format for UI, AI and files.
  Change the format there first, then geometry.py / assembly.py, solver.js, features.js / asm.js and
  the AI system prompt in ai.py.
- Test before committing: `pytest -q` (includes the JS/Python mate solver parity test, needs node) and
  `npm ci` then `npm test` (Node >=20.6; every tests/js/*.test.mjs: solver, offset, DOM regressions); drive real UI
  flows with Playwright (Chromium is preinstalled in the cloud container) for UI changes. Without an
  API key, use the demo sessions (`demo: true` / `"part"` on /api/ai/stream, or
  `OPENSKETCH_AI_DEMO=1`) to exercise the live build path end to end.
- Any new AI tool must stream: emit events from `Session` in ai.py and play them in live.js.
- A new modelling tool on `ai.Session` also goes in `mcp_server.BATCH_TOOLS` (add_<feature> tools are
  allowed automatically). A geometry change must keep `tests/test_reference_parts.py` passing; never
  "fix" a reference number to match OpenSketch, work it out by hand.
- No emojis in UI text. Plain language, short sentences.
- Brand: names and headings in `--font-display` (Inter Tight, bold, tight tracking), pill buttons (`.btn.fv-pill`)
  for main calls to action, the text wordmark "OpenSketch" as the logo (no mark or tile; YZ 2026-10-19); new UI styled with the theme tokens and checked in dark,
  light and classic, and at phone width. Motion: `--ease`, 120-220 ms, nothing that blocks input.

## Current state (2026-10-19, v0.6: Files with pictures, installable app, Connect AI for any AI app, Stripe-like brand, text logo, Google sign-in set up in the app, upload links for big MCP imports, SOLIDWORKS add-in, dedicated CPU + self-restarting server, feature recognition, CAD in worker processes, one worker per person)

CAD in worker processes (2026-10-19, YZ at 14:29: "the site is basically frozen, New part / New assembly / open do
not work at all, a new tab does not load either"). Fly logs: the machine woke from idle at 14:28:31, was ready at
14:28:41, then answered nothing until a deploy replaced it at 14:31; opening a big model on a cold cache (Lavilock)
held the GIL in long OpenCascade calls, so every other request waited. A bigger machine does not help.
- `opensketch/cadworker.py`: `Lane` = one `spawn`ed worker process (ProcessPoolExecutor, max 1), started on first use
  (`MODEL.warm()` in the lifespan). `await lane.run(fn, *args, limit=)` sends `module:qualname` + args; the worker
  never raises (`_call` returns ("ok", value) or ("err", type name, message, traceback)), so the server gets
  `CadJobError(kind, message)` for any exception, `CadUnavailable` when the call ran past its limit (the lane's
  process is killed, the next call starts a fresh one) or the worker died (BrokenProcessPool: out of memory, a crash).
  Lanes: `MODEL` (limit `OPENSKETCH_CAD_LIMIT` 600 s, nice 2; keeps `geometry.built`'s cache between calls) and
  `BACKGROUND` (Files pictures; 180 s, nice 10, stops after 5 idle minutes). `start_job(fn, ..., on_event, uses)`:
  a process of its own for long jobs with progress (`progress(*a)` / `log(line)` -> on_event("progress", a); `stop()`
  after `cancel()`; "done" / "error" at the end; killed 30 s after a cancel it ignores; limit 1 h). Workers ignore
  SIGINT. Memory: ~240 MB private per CAD process (OpenCascade libraries are shared), main ~280 MB.
- `opensketch/cadjobs.py`: the browser routes' work as plain functions (regen, params, name_refs, face_owner,
  delete_plan, mass, interference, export, import_file, toolbox_part, thumb_png, review_checks, review_publish).
  server.py: those routes are `async` and go through `_cad(lane, fn, ...)` (CadUnavailable -> 503 with the plain
  message; unexpected exceptions -> 500 "Kind: message", as before); errors that had their own status keep it by
  `exc.kind` (FeatureError / AssemblyError on export 400, ImportError_ 422, ReviewError 400, NotFound 404). Pictures:
  `_render_thumb` reads the record here, draws in BACKGROUND, stores here (store writes stay in one process).
  `_light(doc)`: a part with only sketches and planes (<= 400 sketch entities) or an empty assembly is rebuilt here at
  once, so New part / New assembly and a first sketch never queue behind a big rebuild in the one MODEL worker.
  SOLIDWORKS macro jobs run via `start_job` (a daemon process, so the job itself must not start multiprocessing
  children). Feature recognition stays a thread: it already runs each part in its own spawned worker
  (`recognize_part_safe`).
- One worker per person (same day, YZ: "the goal is that my edits won't affect others' performance"):
  `cadworker.lane_for(person, kind)` replaces the single MODEL lane: key "edit:<account id>" (browser routes, via
  `server._lane(request)` = `store.owner_of(user)`, None -> "local") or "agent:<id>" (MCP tools), so one person's
  rebuilds never queue another's and their own clicks never queue behind their AI. At most `OPENSKETCH_CAD_LANES` (4)
  live person workers; past that a new one shares the least busy live lane. Idle person workers stop after 15 min
  (`PERSON_IDLE`; caches go with them). `_warm_owner()` starts the owner's edit worker at startup. They still share
  the CPU: on one core, two heavy jobs at once each run at about half speed (more cores or machines for that).
- MCP tools: `mcp_server._work(fn, *args, limit=)` runs each `*_sync` (`_apply_sync`, `_read_sync`, `_import_sync`,
  `_export_sync`, `_preview_sync`, `_batch_sync` (limit 1 h), `_topology_sync`, `_inspect_sync`, `_review_sync`,
  `_measure_sync`) in the caller's agent worker through `_as(user, name, args)` (sets `_mcp_user` there);
  `LONG_TOOLS` gives recognize_features 1 h. `Lane.run(..., raw=True)` re-raises the worker's own exception when it
  survives pickling (NotFound, ValueError, ImportError_...), so the tools' except clauses work unchanged; `Lane.call`
  is the same for code in a thread. Workers save documents, so `store.lock(doc_id)` is now `_DocLock`: a re-entrant
  thread lock plus an flock on `docs/<id>.lock` (removed by purge). SOLIDWORKS `sw_` tools still run in the server.
- In-app AI chat: `/api/ai/stream` runs `cadjobs.ai_stream` via `start_job` (a fresh process per request, ~4 s to
  load before the first event): events come back through `progress`, the conversation's history goes in and comes
  back (`ai._conversations` stays in the server); the response is an async generator, so Stop / leaving the page
  cancels the job (killed 10 s later if it has not stopped). Job processes are not daemons (a job may start its own
  processes, as feature recognition does); `cadworker.shutdown()` kills them.
- `OPENSKETCH_CAD_WORKERS=0` runs everything in threads as before; tests/conftest.py sets it so monkeypatches apply.
- Tests: `tests/test_cadworker.py` (11: same result from another process and the same worker next time, errors keep
  their type name, a runaway call is stopped and replaced, a crashed worker is replaced, a job's progress and result,
  and a real server answering /healthz, the Files list and New part in under 1 s while a ~25 s rebuild with ~2 s
  single OpenCascade calls runs; with OPENSKETCH_CAD_WORKERS=0 the same test waits 3 s for an answer). Checked in
  Chromium against a supervised server with workers: during that rebuild, Files > New part opened the editor in
  0.23 s and the Files page drew its cards in 0.57 s (before `_light`, New part waited for the rebuild); no page errors.
  Added with per-person workers: Claude's propose_features of that grid plate over MCP while the server answers
  /healthz, the document head and a regen in under 1 s (2.0 s without workers); the AI chat demo in its own process
  keeping its conversation; people get their own lanes; a person's medium rebuild finishes in under 5 s while
  another person's 25 s rebuild runs; routes use the signed-in person's lane.
- Also (same push): `auto_stop_machines = "suspend"` (wakes in a few hundred ms with memory and caches; needs 2 GB or
  less, no swap; a deploy still starts cold); the supervisor tells a paused machine from a hang (a jump of more than
  interval + timeout + 30 s between checks resets its clocks and logs "paused"), prints the server's stacks once
  after 30 s without an answer (`DUMP_SECONDS`, the server keeps running), and starts the server in its own process
  group so a restart also ends its workers (`_kill_group`); uvicorn `timeout_graceful_shutdown=3` (open long polls
  and streams no longer hold a stop for the full 8 s); the deploy workflow skips pushes that only change `**.md`,
  `docs/`, `tests/`, `solidworks/tests/` (each deploy is ~15-20 s offline; there were 15 by 14:30 that day).
  Supervisor test +1 (`test_a_paused_machine_is_not_taken_for_a_hang`).

Feature recognition (2026-10-19, YZ: "a feature recognition kind of feature so that imported parts can have auto
features"; SOLIDWORKS FeatureWorks). `opensketch/recognize.py` turns an `import` feature into ordinary features
(no format change; docs/DOCUMENT.md "Feature recognition"). Pipeline, every step proven by building forward:
- Local features, last made first: fillets (cylinder < 180 deg / torus / sphere faces with >= 2 smooth neighbours;
  cylinders along the main direction are kept as sketch arcs), chamfers (narrow inclined planes, cones between two
  circles, grouped by touching chains / width / singly), holes (concave coaxial cylinders, cones, flat floors and
  counterbore steps; simple / counterbore / countersink incl. a cone alone through thin stock; blind / through;
  drill points refused). Each group is removed with `BRepAlgoAPI_Defeaturing`; new sharp edges come from its
  history (`Modified`); the feature is rebuilt on the result (`after.fillet/chamfer`, `geometry.hole_tool`) and must
  give back the body: `Ctx.same_near` = equal volume + every sampled point on the faces around the change ON the
  other solid (`BRepClass3d_SolidClassifier`), no booleans. "Around the change" = the removed faces plus every
  face the defeaturing history reports modified or deleted (`_touched`): on the indicator slide defeaturing
  changed faces far from the fillet it removed, and a check limited to the removed faces let a 0.29 mm3 error
  through. Fillet chains go in packs of <= 6 faces (`BATCH_FACES`; 52 faces in one defeature took 88 s on the
  Lavilock plate, single chains ~0.5 s); packs of one size are merged back into one feature when OpenCascade
  takes them together (`_build`).
- Base: `_main_direction` (most faces along it, cap area counted twice). Extrudes along one direction
  (`_prismatic`: caps across, everything else along; levels = cap heights; sections at mid-slab -> `Regions` 2D
  booleans): `_cut_plan` (stock = union of slabs, cuts from top and bottom, valid only if every slab comes out
  right) vs `_boss_plan` (bottom-up, each region extruded as far as it persists); fewer features wins, a tie goes
  to cuts when they are interior pockets. Base sketch on a standard plane (midplane when symmetric) or a hidden
  offset `plane`; cuts and stacked bosses on `face` planes (follow depth edits; pinned `fixed` when the face
  attachment would land elsewhere, `_fix_face_planes`). Through holes along it go into the sketch as circles.
  Revolve when every face is a surface of revolution about one axis (half-section on a plane through it, a
  construction centerline as the axis). Otherwise the defeatured body stays an `import` feature (FeatureWorks
  does the same) with the recognised features on top.
- Sketches: `SketchBuilder` (lines, circles, arcs CCW, splines through 16 points for anything else = approximate)
  + candidates (origin coincident, H/V, tangent joints, diameters, radii, lengths, angles, origin anchors, point
  pair H/V distances); `static/js/sketch/define_cli.mjs` keeps a candidate only if its Jacobian rows are
  independent of what is kept (incremental Gram-Schmidt per connected group, solver.js's own equations via the new
  `_internals` export), so sketches are never over-defined and usually fully defined (D1, D2...).
- Build and check (`_build`, `attempt`): base, then stages in reverse; fillet/chamfer edges re-found on the rebuilt
  body (`_match_edges`: every rebuilt edge lying along a target, split or whole) and given persistent names in one
  rebuild (`naming.annotate_all`, new); after each stage the volume must equal the one recorded when it was found,
  else it is marked bad; rows of 3+ equal evenly spaced holes -> hole + `linear_pattern`. Final verdict
  `same_solid` = equal volume + full surface sampling both ways (booleans alone gave a false "same" on the inside
  shoe: OpenCascade returned empty cuts for two solids 0.014 mm3 apart; and a false "different" on the outside
  shoe). If the recognised base does not take the stages back exactly, the import base is tried; stages that will
  not rebuild are left in the body and the part reruns (at most twice). `ok` only for an exact result (or an
  approximate spline sketch within 0.1 %).
- Hangs: OpenCascade holds the GIL, and defeaturing one Lavilock spindle fillet ran 5 minutes, so the server runs
  each part in a spawned worker (`recognize_part_safe`): the worker marks each risky step in a heartbeat file
  (`_mark`), a step over `HANG_SECONDS` (20 s; whole-tree build/check 120 s) is killed, the part reruns from the
  worker's checkpoint (`_save_checkpoint` after each accepted stage: body + stages + failed attempts) skipping that
  step; out of time, one last worker builds from the checkpoint. `OPENSKETCH_RECOGNIZE_STALL` makes a worker stall
  on purpose (tests). `TIME_LIMIT` 120 s per part.
- `geometry.bbox`: bodies over 150 faces use OpenCascade's fast bounding box (the exact one cost 0.5 s per call on
  the 274-face plate and rebuilds ask for several per feature); small parts unchanged.
- Server: `POST /api/recognize/start {doc, part_id?, kinds?}` -> job (one per person; 400 without an import or with
  unknown kinds), `GET /api/recognize/{job}` (state, done/total, current part, per-part reports; result =
  {changed, parts, updates: {pid: {features, rollback}}}), `DELETE` stops it (`stop` reaches the worker).
  `recognize.recognize_doc(doc, part_id?, kinds?, progress, stop, isolate=True)`.
- AI / MCP: `ai.Session.recognize_features` (streams build_start / build_step per feature / proposal; assemblies
  re-solve), tool in `ai.TOOLS`, system prompt "Imported geometry" says to call it first; MCP tool
  `recognize_features(doc_id, part_id?, kinds?)` (now 66 tools with the SOLIDWORKS add-in tools), in `BATCH_TOOLS`; INSTRUCTIONS and
  import_document mention it; skill opensketch-cad "Imported STEP bodies".
- Browser (`static/js/featureworks.js`, `app.featureworks`): PropertyManager "FeatureWorks" (Recognition Mode
  note, Parts: this part / all imported parts in an assembly, Automatic Features checkboxes, Recognize / Stop /
  Recognize Again, Recognized Features list per part with one-line descriptions, status line with progress; part
  documents: Preview colours the import's faces by what they became, matched by face centre from the report's
  `faces` {kind: [centres]}: green extrude/revolve, blue hole, yellow fillet, orange chamfer, body colour = stays
  imported; restored on Cancel/OK); OK
  = one `app.commit('Recognize Features')` replacing the parts' features (refused if the model changed during the
  job); Cancel/close stops the job. Entry points: Features tab and Assembly tab button "Recognize Features"
  (icon `featureworks`), Insert menu FeatureWorks heading (`ribbon.buildMenus` now passes `{head}` items),
  right-click Imported1, a component, a component's Imported1 row (`compfeature`, had no menu before) and the
  assembly root, Edit Feature on Imported1 (dialog with Recognize Features), toast after uploading a STEP
  (`files.upload` -> `featureworks.offer()`). Rebuild as Features (AI) now calls recognize_features first.
- Import names: `importer._clean_name` ignores generic STEP labels ("Open CASCADE STEP translator ...", untitled,
  Part1...) and uses the file name.
- Lavilock O2S6 r6 (17 part STEPs, alg a269529) through `recognize_part_safe`, each result rebuilt and compared
  independently: 16 exact trees, 776 s in all. Fully recognised: cam roller (1 extrude), indicator lens (2),
  inside/outside back plates (1 extrude, 7/8 countersunk holes, 1 chamfer, sketch fully defined), inside rotor
  (5 extrudes, hole, chamfer, fillet). Imported base + recognised features: inside/outside plate (1/2 fillets,
  166/175 s, out of time), levers, shoes, spindles (one defeature step stalled and was skipped), outside rotor,
  snib (3 chamfers, fillet), snib carrier. Indicator slide: nothing recognised (its fillets do not rebuild exactly). Tests: `tests/test_recognize.py` (26: ten shapes rebuilt
  exactly incl. counterbore/countersink/blind sizes, a pocket that follows a taller block, kinds, refusals, part
  doc keeps later features, assembly parts one by one, AI session events, MCP version, REST job + stop,
  define_cli never over-defines, the solid check sees a moved hole, a stalled worker is killed, generic STEP
  label, eight hole fillets found in packs merged into one Fillet), `tests/js/featureworks.test.mjs` (7).
  374 pytest (2 skipped: macro toolchain) + 72 node (with the SOLIDWORKS add-in work on main). Checked in Chromium: upload -> toast -> Recognize -> OK -> undo/redo
  on the Lavilock back plate (1 extrude, 7 countersunk holes, 1 chamfer, fully defined sketch), a three-part STEP
  assembly recognised on all parts and applied, no page errors.

Server stays up (2026-10-19, YZ's screenshot: Files stuck on "Waiting for the server" for ~10 minutes after the 12:59
deploy; even /favicon.svg timed out, so the whole process was frozen, not crashed; a manual run of the Deploy workflow
brought it back. YZ: "make it so the server doesn't go down"):
- fly.toml: `performance-1x` (one dedicated core, 2 GB, never throttled; about US$0.058 an hour in syd, billed only
  while running; YZ chose it over shared-cpu-2x and performance-2x), `kill_timeout = 15` (top level: a key below a
  `[table]` header belongs to that table).
- `opensketch/supervisor.py`, run by `python -m opensketch --supervise` (Dockerfile CMD): a small parent process runs
  the server as a child, asks GET /healthz every 5 s (8 s timeout) and restarts it after 120 s with no answer
  (`OPENSKETCH_HANG_SECONDS`), 180 s if it never answered after starting (`OPENSKETCH_BOOT_SECONDS`), or when it
  exits. Before killing a hung server it sends SIGUSR1 (`__main__` registers `faulthandler` on it, so every thread's
  stack goes to the Fly log, even while a CAD call holds the GIL), then SIGTERM, then SIGKILL after 5 s. Servers that
  die or hang without ever answering are retried after 2, 4, 8... s (max 30). Fly's stop signal (SIGINT) is passed on
  as SIGINT and the server gets 8 s (`STOP_WAIT`) before SIGKILL, which also ends the "ignored SIGINT/SIGTERM on
  deploy" case. Fly only restarts a machine whose process exits (restart policy on-failure) and its health checks
  never restart anything, so the supervisor is what brings a hung server back. Store writes are atomic, so a kill
  loses no saved document. Codespaces is unchanged (run.sh restarts a crashed server; no --supervise).
- `/healthz` (server.py; public in PasswordGate, before the accounts check): `{ok, version}` after
  `run_in_threadpool(lambda: None)`, so it fails when the event loop is blocked or every worker thread is busy, the
  same things that stop real requests.
- Measured: OpenCascade (OCP) calls hold the GIL for their whole length (a 0.3 s boolean in a thread left the main
  thread without a single wakeup), so one long CAD call pauses every request for its length on any machine. The
  120 s limit leaves room for the slowest normal work (Lavilock rebuild ~11 s, interference ~29 s, both many short
  calls). Those pauses did show up, so the browser's CAD work moved to worker processes (see "CAD in worker processes").
- Checked: the real server under the supervisor locally: SIGSTOP on the child -> killed and answering again in 23 s
  (with OPENSKETCH_HANG_SECONDS=10); SIGTERM to the supervisor stops both in 2 s; SIGUSR1 prints the stacks and the
  server keeps answering. Tests: `tests/test_supervisor.py` (4: hung server restarted, exiting server restarted with
  backoff, healthy server left alone, /healthz without sign-in while the API still needs it).
- The add-in's link lives in the server's memory: a supervisor restart ends it and the add-in hears "restarted" and
  connects again. Its long poll counts as traffic, so the Fly machine stays awake while SOLIDWORKS is linked.

SOLIDWORKS add-in (2026-10-19, YZ: "a SOLIDWORKS plug-in that does everything OpenSketch does, native to SOLIDWORKS";
chosen scope: Claude builds in SOLIDWORKS 2022 on his work PC, no admin rights, linked through OpenSketch):
- Shape: Claude -> OpenSketch connector -> `sw_` MCP tools (65 tools in all, 24 `sw_`) -> `swbridge` queue -> the add-in on
  the PC long-polls the server over outgoing HTTPS and runs each command in SOLIDWORKS. SOLIDWORKS is the master copy;
  OpenSketch keeps no document for it.
- `swbridge.py`: per-person key `oss_...` = HMAC(data secret, person + counter) (`key_for`, `new_key` voids the old one,
  `resolve`); one Session per person (a new hello replaces the old one; 409 with reason restarted / replaced / closed so the
  add-in says why); routes in server.py `/mcp/sw/hello`, `GET /mcp/sw/next` (held `WAIT` 25 s), `/mcp/sw/result`,
  `/mcp/sw/file` (gzip bodies, files attached to a command), `/mcp/sw/blob/{id}` (files sent down, e.g. imports); connected =
  polled in the last `ALIVE` 70 s; a tool waits `DEFAULT_TIMEOUT` 240 s (more for big ops). Browser: `/api/sw` (status,
  key, address, download?), `POST /api/sw/key`, `/api/sw/download` (the zip in `static/downloads/`, built by the Dockerfile's
  `swaddin` stage from `solidworks/`; best effort). Connect AI dialog has a third tab "SOLIDWORKS" (`connect.js swTab`).
- `sw_tools.py`: sw_status, sw_get_guide (SW_GUIDE + ai.SYSTEM + skill reference), sw_create_document, sw_open_document,
  sw_save, sw_get_document, sw_add_features, sw_batch (all or nothing; BATCH_OPS), sw_delete_items, sw_undo,
  sw_set_parameter, sw_set_equation, sw_insert_component, sw_add_mate, sw_body_topology, sw_measure_items,
  sw_inspect_design, sw_preview, sw_check_interference, sw_find_mate_candidates, sw_export (artifacts.FORMATS gained x_t,
  igs, sldprt, sldasm, pdf), sw_import, sw_standard_part. Features use OpenSketch's document format: `_solve` checks them
  with the registry and solves each sketch with the browser solver (over-defined refused before anything is sent);
  `_predict` rebuilds them with OpenSketch's kernel on SOLIDWORKS' current body (STEP) and sends `expect` {dv, bbox,
  tool_bbox, plane, range} per feature (`expectations(st)`); features naming SOLIDWORKS features get none. Reading tools
  run here on a STEP of the body (`_geometry`, cached per person and part by SOLIDWORKS' update stamp).
- `sw_selftest.py`: `sw_selftest(stage)` plate (every part feature, read back with sketch states, STEP + topology,
  variable + equation, a batch that must roll back, export, save) / shapes (draft, shell, sweep, loft) / assembly (two
  blocks, components, coincident + distance + parallel mates, B's pose, interference, export). New files in
  `Documents\OpenSketch\selftest`; "@id" in the data = the SOLIDWORKS name an earlier step gave id; expectations from the
  STEP prediction, else from the whole test history built in OpenSketch. Reports ok / check / failed per step with the
  reason; the first thing to run on the work PC.
- Add-in (`solidworks/`, C#, .NET Framework 4.8 x64, SOLIDWORKS 2022 interop NuGet 30.5.1 embedded; builds on Linux with
  the .NET 8 SDK: `bash solidworks/build.sh test`; CI `.github/workflows/solidworks.yml` keeps the zip as an artifact):
  `src/Core` (Json, Geom, SketchPlan: sketch plan and relations from OpenSketch sketches, BridgeClient: hello / poll /
  gzip upload / blob / reasons), `src/Addin` (Entry: ISwAddin + menu; Host: one link per SOLIDWORKS, commands run on
  SOLIDWORKS' thread; ConnectForm; Settings in HKCU\Software\OpenSketch; Log in %LOCALAPPDATA%\OpenSketch\SolidWorks;
  Commands (dispatch, documents, read), Files (geometry STEP, export, import), Pick (faces/edges by point), Sketches,
  Features (each feature measured against `expect` and remade flipped, like the macro engine), Edits (delete, undo,
  variables, equations, batch with Journal rollback), Assembly (components, mates with alignments tried in order)),
  `src/App` OpenSketchSW.exe (Install for me = per-user COM registration under HKCU\Software\Classes + the add-in key
  + the launcher macro `Documents\OpenSketch\OpenSketch.swb`; Remove; "Connect to the open SOLIDWORKS" drives it from
  outside with an OLE message filter). Three ways to start because IT may block per-user add-ins: menu, macro
  (`OpenSketch.Sw.Launcher.Start`, which first tries `LoadAddIn`), outside exe.
- API review (independent agent against the interop's signature dump, 2026-10-19) and the fixes made: sketch segments and
  points are selected with their own Select4 (not IEntity; before, every merge, relation, dimension and revolve axis would
  have failed); sketch points are read again from their curves after sgMERGEPOINTS (one of the two objects dies); batch
  rollback puts equations back first and never deletes absorbed sketches (they may be the user's); horizontal / vertical
  relations and dimensions swap when OpenSketch's u lies along SOLIDWORKS' sketch y and are left out (with a note) when
  oblique; edges, faces, neutral planes and mate refs are found again on every retry, and a sketch's face plane from its
  spec; dimension names are `Name@<sketch name>` read after the rename, equations matched with or without `@file`; a
  hole id stands for all its cuts in mirrors / patterns (and `HoleN.depth` is the hole's own cut); chamfers may add
  material; hole sketches are all drawn on the start plane before cutting; mid-plane revolve uses SingleDir; the 2020+
  fillet gets its edges; a reference plane's frame is checked against its corner points (Transform direction unclear);
  one command at a time (semaphore) and no changes while the user has a sketch open; expressions use arcsin / arccos /
  atn, trig in degrees (set when no equation uses trig yet), a note when the document is not in mm; a failed sketch is
  deleted, not left half made; `--attach` ends with its window. Every SelectEntity result that matters is checked.
  A second review of those fixes: a draft retry finds faces again but keeps its neutral plane (no extra planes); a
  later sketch on an earlier face sketch only takes a face in the same plane (`CoplanarFace`), else the old face; fillet
  edges go as object[]; `@file` is stripped from equation names only for the document's own file (two components never
  match); failed relations or dimensions make the sketch a warning; a hole's second sketch goes on the first one's plane;
  `<feature>.diameter` is the diameter dimension in the feature's sketch (holes: `bore_*`, `sink_*` fields).
- Tests: `tests/test_swbridge.py` (4, fake add-in over real uvicorn; a renewed key says why even when a poll races it),
  `tests/test_sw_selftest.py` (11: the selftest data
  builds in OpenSketch, passes the send checks, plate sketches fully defined; all three stages pass against SimSW, a
  stand-in add-in built on OpenSketch's kernel and mate solver; a failing feature is reported and the run goes on),
  `solidworks/tests` (17 dotnet tests of Core; `e2e_link.py`: the real C# link client against a real server, 7 checks).

Autofill, PropertyManager tab, stalled server (2026-10-19, YZ's screenshots):
- The FeatureManager tree showed only "yyz.works@gmail.com": Chrome's password manager treats every field outside a
  `<form>` as one form, so a password field in a dialog (Account settings, Google client secret, the Connect AI key)
  made it put the saved email into the tree filter, which then hid every row. Fixes: `#treefilter` and `#cmdsearch` are
  `type=search` in forms of their own (`form[data-own-form]`, submit prevented in the App constructor, password-manager
  ignore attributes); every `dialog()` body is its own `<form class="dlg-b">` (submit prevented); Account settings has
  a hidden `autocomplete="username"` field with the email; the API key and Google client secret are masked text fields
  (`.os-secret`, `-webkit-text-security`, `dialogs.secretField`), not password fields. `tree.typedInput(e, el)`: only an
  InputEvent that is not `:autofill` filters (an autofill sends a plain Event; an `os-autofill` animation on
  `:-webkit-autofill` catches the rest) in tree.js and the command search. While a filter is on, `.tree-filtering`
  above the tree says "N items match" / "Nothing matches" with Clear filter; Escape clears. Test: tests/js/tree-filter.test.mjs.
- PropertyManager tab (second manager tab, `app.propertyTab`): the open command's PM; with none open in an assembly,
  the selected mate's PM (`asm.editMate`), else the Mate PM (preselected faces become Mate Selections); in a part a
  toast says why it is empty (it did nothing before).
- "Delete does nothing" and "rebuild error sometimes": Fly logs show the machine stopped answering (PU02 operation timed
  out, 01:22-01:24 UTC) and ignoring SIGINT/SIGTERM on the next deploy. shared-cpu-2x gets 6.25% of a core per vCPU
  once its burst balance (5 s at boot, up to 500 s) is spent; Lavilock rebuilds (~11 s CPU here), interference (~29 s)
  and server-drawn pictures (~15 s each, redrawn on every Files visit after an AI edit or a failed draw) used it up.
  Fixes: server pictures one at a time, never for documents over `THUMB_SERVER_MAX` (400 KB stored; the browser draws
  them when opened), and not retried for a version that failed (`server._thumb_failed`); `app.api` turns no answer or
  a non-JSON 502/503/504 into `serverAway()` (`err.away`), `app.apiPatient` retries rebuilds for ~75 s with the pill
  saying "Waiting for the server", `rebuildFailed` explains; Files `req` retries repeatable requests (not POST) with a
  "Waiting for the server" toast after 2.5 s, and Move to Trash dims the card at once (`.fv-card.working`). The real
  cure was CPU: the machine became performance-1x later that day (see "Server stays up").
  Test: tests/test_files.py::test_server_pictures_spare_the_server. Checked in Chromium: autofill dropped, filter note
  in dark/light/classic, Enter in the boxes does not reload, Mate PM / mate PM from the tab, regen through two 502s,
  Move to Trash through three 503s.

Rolled-back parts in assemblies (2026-10-19, YZ: Lavilock O2S6 assembly export "Cannot export Inside_plate<1>: no solid
body", while part exports worked): Inside_plate's `rollback` was 0 (bar above Imported1, its only feature), so the part
built to nothing in the assembly, was not drawn, and strict export refused with no reason. A part keeps building to its
bar in assemblies (as SOLIDWORKS does; SOLIDWORKS gives no sign of it there, OpenSketch now does):
- `geometry.rolled_back(doc)` -> first feature below the bar {id, name} or None; `rollback_note(doc, has_body)` the plain
  sentence. Part export of a part with no body says "rolled back... Rollback to End".
- `assembly.rolled_back_components`, `rollback_export_error`, `ROLL_TO_END_HINT`: `placed_solids(strict=True)` (all STEP/STL
  assembly exports) refuses first with every rolled-back active component named, whether it has no body or only misses
  features (suppressed components do not block). `regen_assembly` adds `parts[pid].rolled_back`.
- `artifacts.validate_geometry(doc, export=True)`: exports refuse with the same message; previews (`export=False`) warn and
  draw what is there; `preview.render_preview` skips a rolled-back part with no body (also fixes server-drawn Files pictures
  of such assemblies). Part branch (MCP part_id): no body -> refused with the reason; part-way -> warning.
- `ai._asm_report` (get_document / AI state): a warning per rolled-back part, so `clean` is false.
- Browser: `model-utils.rolledBackFeature(part)`; assembly tree greys the component (`rolledback` class), warning badge,
  title "Rolled back: the part's rollback bar is above X. Right-click > Roll Part to End."; its expanded features below the
  bar are greyed. Component menu "Roll Part to End" (`asm.rollPartsToEnd(pids)`, one undo step). `app.exportAs` on an
  assembly lists the rolled-back parts and offers Cancel / "Roll to End and Export".
- Tests: `tests/test_rollback_export.py` (6). Checked in Chromium on YZ's v31 document: tree flag, menu item, dialog, roll +
  export downloads the 6.58 MB STEP, Ctrl+Z puts the bar back. 328 pytest (2 skipped) + 62 node.
- How a bar ends up at the top by accident (a second part, Outside_back_plate, was found the same way): the rollback bar
  drag (`tree.dragRollback`) listened on the window without pointer capture, so a release outside the window was lost
  and the next click anywhere above the tree (ribbon, menus: above every row = index 0) committed "Rollback" to the top.
  Now: left button only, `setPointerCapture`, pointercancel / lostpointercapture end the drag without a change, a press
  that moves < 4 px is a click (no change, no undo step), no commit when the bar left the DOM or the index is unchanged.
  Return to Assembly from a rolled-back part shows a toast naming the feature and Roll Part to End. Checked in Chromium
  (click, cancelled press + ribbon click, drag to top + Ctrl+Z, drag above the last feature).

Upload links for the connector (2026-10-19, YZ: a 6.5 MB named STEP would be ~1.6 million base64 characters inside one
import_document call, too much for a model to write out exactly): `uploads.py` + MCP tool `request_upload(filename,
size_bytes?)` (now 41 tools) -> {upload_id, upload_url, method PUT, expires_at, expires_in_seconds 600, max_bytes, how
(`curl -sS -T 'file' '<url>'`), next}. The client sends the file's raw bytes to `PUT|POST /mcp/uploads/{id}?expires=&signature=`
(server.py `api_upload`; outside sign-in like /mcp/artifacts, no MCP credential in the link): signature = HMAC keyed by
`data_secret("upload-link")` + `mcp_token()` over id, owner and expiry (a new server password voids open links); bad
signature 404, used 409, expired 410; streamed to `<data>/uploads/<id>.part` (claimed with open "xb", so two uploads at once
-> 409), sha256 on the way; `Content-Encoding: gzip` or `X-OpenSketch-Gzip: 1` unzipped bounded; same 32 MiB cap as base64
(`mcp_server.MAX_IMPORT_BYTES`, after unzipping; 413); empty or multipart bodies 400; a failed upload leaves the link
usable. Answer 201 {upload_id, size_bytes, sha256, next}. `import_document(filename?, data?, name?, upload_id?)`: exactly
one of data / upload_id (data "" beside an upload_id counts as absent, for clients holding the old tool list where data
was required); filename defaults to the one given to request_upload; `uploads.take` refuses another person's id as
"Unknown upload_id" (owner = `store.owner_of`), a link with nothing sent yet, an expired or already imported one (names
the document). After import the bytes are deleted (`mark_imported`). Limits: link 10 min, file kept 30 min (`KEEP`), 4
open per person (`MAX_PENDING`), 256 MiB reserved server-wide (files held + 32 MiB per open link, `MAX_RESERVED`);
expired records cleaned on create/import. INSTRUCTIONS, MCP_PREFACE and README say to use it for anything over ~100 KB.
Tests: `tests/test_uploads.py` (5). Checked against a local server with curl: the 6.58 MB Lavilock O2S6 named STEP raw
(0.03 s) and gzipped (1.25 MB), then import_document (4.9 s) and get_document (17 parts, clean).
STEP import fix found on that file: `importer.import_step` merged solids by shape signature alone (volume, area, counts,
sorted box sizes), which ignores position and handedness, so a mirrored Inside/Outside pair (lever, rotor, spindle) or two
copies already in world coordinates (identity locations, as FreeCAD and build123d write placed parts) became one part
shown twice in the first one's place (17 parts -> 14). A solid now joins a part only if that part's shape moved by the
solid's own location lands on it (`_same_when_placed`: box corners and centre of mass within 1e-3 mm); true instances
still share. Test: `test_import.py::test_assembly_import_keeps_world_placed_copies_and_mirrors_apart`. 315 pytest (2 skipped) + 62 node.

v0.6 (2026-10-19, YZ: Stripe-like branding with the current colours, the installable web app, a file portal
with model pictures, a deep audit, "connect Claude, Codex or whatever", a better bring-your-own-key flow, subtle
2026 motion, and a GUI walk-through for upgrades):
- Files (`static/js/files.js`, `FilesView` = `app.files`): full-window page (Files button and the logo in the
  title bar, File > Open / Ctrl+O, task pane "Files" pane, `?view=files`). Search (Ctrl+K), filters (All, Recent
  7 days, Parts, Assemblies, Edited by AI, Trash), sort (last edited / name / created, remembered), grid or list,
  cards with picture, kind badge, "Open" badge, edited time, AI-edited in accent, counts and size. Card: click
  opens, F2 / double-click name renames, Delete trashes (toast with Undo), arrow keys move, menu (Open, Open in
  new tab, Rename, Duplicate, Download .osk, Version history (restore any kept version), Move to Trash; in the
  Trash: Restore, Delete forever). New part / New assembly create a file and open it; Upload (or drop files on
  the page) puts .osk / STEP / .brd / .zip into Files and opens it. An unsaved draft shows a "Save to Files" card.
- Server documents are per person (`store.py` rewritten): record gets `owner` (account id; None = made before
  accounts or on a server without accounts) and `created`; `docs/<id>.meta.json` (no model: name, version,
  kind, counts, size, requests count, owner, deleted, thumb) is what the list and the 1.5 s poll read (`head()`
  no longer parses the model; old documents get a meta on first read). Kept versions are capped at 64 MB per
  document (`HISTORY_MAX`, newest five always kept) so large STEP imports cannot fill the Fly volume. `store.can_see`: own files; the server
  owner also sees unowned ones; no accounts = everything. Trash = `deleted` time, removed after 30 days (on
  listing) or `purge`. `duplicate` copies model + picture. Routes (all 404 when not yours): GET /api/docs
  (cards, `?trash=1`), POST /api/docs (empty name -> next free "Part N" / "Assembly N"), GET/PUT
  /api/docs/{id}, PATCH (rename), POST .../duplicate, DELETE (trash; `?forever=1` from the Trash),
  POST .../restore, POST .../restore_version, GET .../versions, PUT/GET .../thumb. Reviews: publish, list and
  delete check the document's owner.
- Pictures: `viewer.snapshot()` draws bodies only (sketches if no body), trimetric, fitted, no selection colours,
  transparent, into a corner of the canvas and copies it out in the same task (preserveDrawingBuffer), then
  redraws; WebP (PNG where WebP cannot be written), 480x360. `serverdocs` sends one after a save (at most every
  20 s), on opening a file whose picture is missing/old/server-drawn, and when leaving a file. Server: PUT
  checks type/magic/size (600 KB); GET draws one with `preview.render_preview(..., transparent=True)` (RGBA PNG)
  when there is none, or when the AI changed the model since (by claude) / the picture was server-drawn; one
  render per document at a time; empty or failing models 404 (cards show the kind icon).
- Editing flow: every New / Upload / AI link is a file in Files and saves itself; the title bar shows the name
  (click to rename: PATCH, or a local rename for drafts) and a state pill: Saved / Saving / Offline (click to
  retry) / Changed elsewhere / Draft + "Save to Files". Ctrl+S on a draft = Save to Files dialog (name, or
  Download .osk instead); on a file = save now + picture. Save As is a list (A copy in Files, .osk, STEP, STL,
  SOLIDWORKS macro). Replacing an unsaved draft asks Save to Files / Don't save / Cancel (`confirmLeaveDraft`).
  Leaving a page with unsent edits warns (beforeunload) and flushes. A file deleted elsewhere stays open as a
  draft with a note. Start-up (`app.startup`): ?doc, else the file this browser had open (`opensketch.autosave.link`,
  fetched fresh), else an unsaved draft from localStorage, else the Files page. Browser copy (`autosave`) is
  debounced 400 ms and flushed on pagehide/hidden.
- Connect AI (`static/js/connect.js`, File / OpenSketch AI tab / account menu / AI pane): tab "Your AI app"
  with steps checked against the vendors' docs (Oct 2026) for ChatGPT (developer mode, chatgpt.com/plugins > Add
  custom MCP server, No authentication), Claude (Customize > Connectors, No sign-in), Claude Code (`claude mcp add
  --transport http --scope user`), Codex (app settings, `codex mcp add --url`, config.toml), Cursor (deeplink +
  ~/.cursor/mcp.json), VS Code (`vscode:mcp/install` + user mcp.json `type: http`), Gemini CLI (`httpUrl`), Other;
  warnings for no sign-in, Codespaces port, and a localhost address. Tab "Built-in AI" = the key form (replaces
  the old "AI model and key" dialog; `aikeys.aiKeyDialog` opens this tab): provider cards, Get a key (opens the
  provider's key page), paste -> provider recognised from the prefix (`providers.PROVIDERS[*].prefix`), checked
  at once (debounced), badge Checking / Key works / Not accepted, model list (`providers.chat_models`: drops
  embedding/speech/image models, newest first), Save and use; status line (yours / server key / none) with Remove.
- Personal connector addresses: `auth.mcp_token_for(user)`: the owner (and servers without accounts) keep the
  server-wide address (existing connectors keep working); members get HMAC(secret, "mcp:"+id). `auth.resolve_mcp`
  maps a token to the person; `mcp_server._TokenGate` puts them in a contextvar (`_mcp_user`, copied into tool
  tasks and worker threads); `_get`/`_check` refuse other people's or trashed documents; create/import set the owner;
  list_documents lists only theirs (id, name, kind, version, updated, by, summary, open). /api/connect returns
  the person's address and `personal`.
- Installable app (PWA): `static/manifest.webmanifest` (standalone, icons any + maskable, shortcuts Files / New
  part / New assembly, file_handlers .osk / .step / .stp -> `launchQueue` -> upload, launch_handler
  focus-existing), `static/icons/*.png` (rendered from the mark), `static/favicon.svg`, `opensketch/sw.js` served
  at /sw.js with the version and the shell list (`server._shell_assets`): app files network-first with a cache
  fallback, page loads network-first then the last app page (never a sign-in redirect), /api, /mcp, /review
  untouched; skipWaiting + claim, old caches dropped. PasswordGate lets GET /manifest.webmanifest, /sw.js,
  /favicon.svg, /icons/ through (browsers fetch the manifest without cookies). `AppFiles` sends Cache-Control:
  no-cache for app files (icons a week) so deploys apply at once. Review pages drop the manifest link. Chromium:
  no installability errors, SW controls the page.
- Brand (`static/css/brand.css`): the logo is the wordmark "OpenSketch" in Inter Tight 800, -0.04em tracking (title
  bar `.brand-text`, Files `.fv-brand`, sign-in pages `.brand`; hidden in the title bar on phones). The indigo cube tile
  was removed on 2026-10-19 (YZ: "keep the text as logo"; brand.js deleted). Favicon and app icons (the places that
  need a picture) are the wordmark's "O" (glyph outline from Inter Tight 800 as an SVG path, no font needed) in
  #f2f3f5 on #141517, not blue. Inter Tight 600-800 for names and headings (tight tracking), Inter
  400-700 for the UI; pill calls to action with a sliding arrow; a slow indigo mesh behind the Files header.
  Sign-in pages (`auth.PAGE`): angled indigo-to-pink band, bold pitch on the left, raised card, pill button,
  stacked on phones. Colours unchanged (tokens from linear.css; classic skin gets fallbacks).
- Motion (brand.css): dialogs pop in (180 ms ease-out) and fade out (closing dialogs leave #modal-layer at once),
  menus/popovers, task pane slide, toasts rise, cards stagger, button press scale; all off with
  prefers-reduced-motion. Dialogs: focus moves in (first field or primary button), Tab stays inside, focus
  returns on close, Escape closes only the top one; Escape closes context menus; menu labels are text.
- GUI audit fixes: rectangle / centre rectangle / circle / polygon draw by click-drag-release too (only lines
  did); the Design panel kept "Finish or cancel the open command first" after OK (closeCommand refreshes it);
  Save As buttons overflowed in a row; Custom Properties / Appearance panes had light-theme inputs in dark; the
  window grew wider than the screen below ~1150 px (ribbon min-content; `#app` columns minmax(0,1fr), ribbon
  scrolls); phones (<= 760 px): FeatureManager slides over the model (title bar button), task pane is a bottom
  sheet, ribbon scrolls; breadcrumb showed the previous file's name; AI replies' Markdown showed as raw ** and -
  (`static/js/md.js`, escaped first, http(s) links only); set_parameter / set_equation rows showed tool names;
  empty part / assembly shows a first-steps card (sketch on Front/Top/Right, describe it to the AI, upload).
  Old names updated (Connect Claude -> Connect AI, Open/Save to Server -> Files).
- Live AI checked (server Anthropic key, claude-opus-5-5): plate with four holes built in 50 s, variables +
  equations, clean, accepted; demo press built and accepted; pictures for both.
- Security and robustness audit (34 findings, fixed unless listed in Known limits):
  - Sign-in: `auth._safe_next` refuses control characters, backslashes and `//` (browsers drop tabs, so
    "/\t/evil.com" was an open redirect); rate limit per IP and per email (`LIMIT` 8 failures / 15 min ->
    429 "Too many tries", no hash tried while limited) on login, reset, setup and the old password form; scrypt
    and account file work run in `asyncio.to_thread` (the event loop no longer stalls); `_client` uses
    fly-client-ip / x-forwarded-for.
  - Cross-site writes: `PasswordGate._same_origin` refuses non-GET/HEAD/OPTIONS requests whose Origin is another
    site (or "null") or whose Sec-Fetch-Site is cross-site / same-site (403); /mcp/ is exempt (token in path).
  - Accounts fail closed: `accounts._read` caches by mtime (deep copies) and raises AccountError when users.json is
    damaged, or missing while `accounts.enabled` exists (written on every save), so a broken file never opens the
    server; the gate answers 503 JSON. Writes use mkstemp + os.replace (no shared .tmp name).
  - Google sign-in links a Google login to an existing password account only for gmail.com / googlemail.com or a
    Workspace domain (`hd` = the email's domain); other addresses get "Sign in with its password" (403).
  - Secrets: `auth.data_secret(label)` (data/secret.keys, first writer wins via os.link) keys OAuth state and
    artifact links (artifact key = HMAC(that secret, mcp_token), so a new password still voids old links); every
    secret compare is `hmac.compare_digest` on bytes (`auth._eq`).
  - AI keys: `aikeys.effective` gives the server's key to members only when open sign-up is off
    (OPENSKETCH_SHARE_SERVER_KEY=all to share anyway). Custom provider addresses: `providers.pinned` resolves the
    host once, refuses non-global addresses (incl. IPv4-mapped, NAT64, 6to4, Teredo, CGNAT, userinfo in the URL)
    and connects to that IP with the Host header and `sni_hostname` (no DNS rebinding); no redirects; upstream
    error bodies not echoed for custom addresses. The old /api/ai refuses without a key. Chat histories:
    `ai._Conversations` LRU, 200 kept.
  - Server load: /api/import/raw streams with a 128 MB cap (`IMPORT_MAX`) and unzips gzip bounded (a small gzip
    that unpacks to more is refused, truncated gzip = "arrived damaged"); macro jobs record their owner (status and
    zip 404 for others) and at most 2 run per person (`MACRO_RUNNING_MAX`, 429); server pictures render at most 2 at
    a time (`_thumb_slots`); picture uploads checked by Content-Length first; the Trash purge re-checks under the
    lock; published review links capped at 20 per document (`review.KEEP_PER_DOC`, oldest removed).
  - MCP: publish_review / list / delete check the document's owner (`_check`).
  - Browser: live.js captions and relation labels are text, not HTML (XSS); "Load the AI's version" waits for a save
    in flight; pagehide sends unsent edits with a keepalive PUT (< 60 KB); `app.api` shows the status text when the
    server sends no message and goes to sign-in on 401 (the AI stream too, and one bad line no longer ends it);
    account settings fetch errors are caught; Remove person asks first; dialog close and PropertyManager help are
    real buttons, the title-bar "?" opens a help menu.
- Sign in with Google from the app (2026-10-19, YZ: "add sign in with google"): it was built but needed
  GOOGLE_CLIENT_ID/SECRET as GitHub secrets, which were never set. Now the owner turns it on in the browser:
  avatar menu > Sign in with Google (also People on this server > Set up). The dialog lists the Google Auth
  Platform steps (Get started / External, Audience > Publish app, Clients > Create client > Web application) and
  shows this site's redirect address with Copy (`server._google_redirect` = request base + /auth/google/callback).
  `oauth.client()` = env GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET ("server", wins), else `google_oauth.json` in the
  data folder (client_id, secret Fernet-encrypted with the AI-key secret, updated) ("app"). `oauth.save` checks the
  Client ID suffix and the secret, then asks Google's token endpoint with a made-up code (`check_client`:
  invalid_client = refused with a plain message; invalid_grant = right; Google unreachable = saved unchecked).
  Routes (owner only, 403 for members): GET/POST/DELETE /api/account/google (never returns the secret; POST refused
  when the server's env sets it). The sign-in pages show Continue with Google (Google's light button) as soon as
  it is saved. Test: tests/test_accounts.py::test_owner_turns_google_on_in_the_app.
  Google Cloud for the live site (2026-10-19, set up for YZ in his account): project "OpenSketch" (opensketch-512019, no
  organisation), Google Auth Platform External, published (In production; home page + /privacy on the Branding page,
  authorized domain opensketch-yz.fly.dev, no logo so no Google review needed), web client "OpenSketch web" with
  redirect https://opensketch-yz.fly.dev/auth/google/callback. YZ pastes the Client ID + secret into the dialog once.
  Public privacy notice at /privacy (`auth.PRIVACY`, served by PasswordGate before any sign-in check; linked from the
  sign-in pages' footer): what the server keeps, the Google data used (name, email, verified, sub, hd) and that it
  is not shared, sold or used for ads or AI training; needed before the Google app can be published to everyone.
- AI apps sign in (2026-10-19, YZ: "have the MCP tied to the user account so one Claude account links without
  reconnecting"): OAuth 2.1 for MCP (`mcpauth.py`, MCP authorization spec 2025-11-25). Connector address is
  `<site>/mcp` for everyone. No/bad Bearer -> 401 `WWW-Authenticate: Bearer resource_metadata=".../.well-known/
  oauth-protected-resource/mcp", scope="opensketch"` (`mcp_server._BearerGate`, CORS open; open-mode servers need no
  token). Metadata: /.well-known/oauth-protected-resource[/mcp] (resource = base/mcp, authorization_servers = base),
  /.well-known/oauth-authorization-server[/mcp] (S256 only, iss parameter, DCR + Client ID Metadata Documents).
  Clients: DCR at /oauth/register (redirect URIs: https, http loopback, or an app scheme like cursor://; never
  fragments or userinfo; 30 per IP per hour; unused registrations dropped after 30 days; secrets stored as SHA-256)
  or an https client_id URL (CIMD, ChatGPT's way) fetched through `providers.pinned` (public IP only, no redirects,
  64 KB, 5 s, cached 1 h, client_id must equal the URL, public clients only). /oauth/authorize: the gate sends a
  signed-out person to sign-in (password or Google) and back; the consent page (`auth.consent_page`: app name as
  text, the return host, a warning for apps on this computer, Allow / Cancel) posts a signed request (HMAC, 15 min,
  bound to the person) back; Allow -> one-time code (memory, 10 min) to the registered redirect with state + iss.
  /oauth/token: authorization_code (PKCE S256 checked, resource must be this /mcp) and refresh_token (rotated every
  use, the previous one still works for 120 s so a retry does not break the link; 90 days); access tokens 1 h
  (`osa_`), refresh `osr_`, all stored as SHA-256 in `mcp_oauth.json` with one grant per person and app. Unknown
  client at the token endpoint -> 401 invalid_client (Claude re-registers). /oauth/revoke ends the grant. The token
  stands for the person (`_mcp_user`), so tools see only their files; removing a member drops their grants.
  Account settings > Connected AI apps (GET/DELETE /api/account/apps) with Disconnect. Connect AI dialog: plain
  address + per-app sign-in steps (Claude: Connect; ChatGPT: Authentication OAuth; Claude Code: /mcp >
  Authenticate; Codex: `codex mcp login opensketch`; Cursor and VS Code: their sign-in prompt; Gemini CLI: `/mcp
  auth`); "App cannot sign in? Use your private address" shows the old /mcp/<key> address, which keeps working.
  Tests: tests/test_mcp_oauth.py (7, incl. the MCP Python SDK's own OAuth client doing discovery, DCR, consent,
  PKCE and tool calls against a real uvicorn server, and CIMD with a pinned fetch). Checked in Chromium: consent
  page, Allow -> code -> token -> list_documents, Connected AI apps, Connect AI dialog.
- Tests: `tests/test_files.py` (8: history size cap, per-person files and 404s, rename/duplicate/trash/restore/purge/versions,
  30-day purge, meta-only poll and list, pictures browser + server-drawn + AI redraw + limits, personal MCP
  addresses over JSON-RPC, PWA files public and versioned), `tests/test_hardening.py` (8: safe next, cross-site
  writes 403, sign-in limit 429, damaged/missing users.json 503, upload cap + gzip bomb, macro job owners and
  limit, chat memory LRU, MCP publish_review owner check), `tests/test_aikeys.py` +1 (custom addresses stay
  public, DNS rebinding), `tests/js/md.test.mjs` (3).

## Earlier state (2026-10-18, v0.5: accounts, Linear look, Design panel, Ask AI on a selection; coupler mate, Motion Review)

Loading speed (2026-10-18, YZ: "slow to load the model, going back from the part to the assembly or importing,
and no indicator"): measured on a 4 MB STEP plate (1329 faces, 441 chamfered holes) and a STEP assembly.
- `geometry.mesh_shape`: one `BRepMesh_IncrementalMesh` pass over the whole body, triangles read straight from
  each face's triangulation (`_face_triangles`), edge polylines from `BRepAdaptor_Curve` (`_edge_points`;
  `mid` still `position_at(0.5)`). `Face.tessellate` meshed face by face and its "already meshed" check fails
  with relative deflection, so every face was meshed again. Bodies with >= `MESH_FINE_FACES` (400) faces use
  0.35 rad angular deflection instead of 0.2 (about half the triangles; edges stay smooth). Plate: 14.5 s -> 6.6 s cold.
- `geometry.built(doc)`: (regen state, mesh) cached by `body_key` (content without name/appearance/description/
  designer/type/seq/material, rollback null = absent), 24 entries. Used by `regen_result` (no preview) and
  `assembly.build_part`, so the part view and the assembly share builds: Open Part, Return to Assembly after an
  edit (the part view already built it), Ctrl+B and undo back to a built state are cache hits (plate: 0.37 s warm).
- `/api/regen` answers with `server.FastJSON` (json.dumps; FastAPI's jsonable_encoder took 0.85 s on a 10 MB mesh).
  `SelectiveGZip` gzips /api/regen, /api/import, /api/docs, /api/params, /api/interference, /api/toolbox,
  /api/review/check, /api/reviews, /api/features (>= 4 KB, level 5): the plate's mesh is 10 MB -> 1.5 MB on the wire.
  /api/ai/stream is not gzipped (events must not be held back).
- Browser: `app.busy(label, delay)` shows a centred "Loading model... / Rebuilding... / Opening <part>... /
  Importing <file>... / Updating preview..." pill with a spinner (`#busyind`, styled in app.css and linear.css)
  when server work takes over 250 ms (imports at once, previews after 400 ms); stacked jobs show the newest.
  Used by `app.regen(announce, label)`, `asm.regen(announce, docOverride, label)` (server path only),
  `importFile`, `loadFile`, the feature preview. Open Part shows the part at once from the assembly's mesh
  (`viewer.partGeo`, when `builtParts` says it is unchanged) and then rebuilds; Return to Assembly draws the
  assembly at once from the result kept on `docStack` (`res`), the edited part in its old shape until the rebuild.
- Checked in Chromium: plate STEP import 6.1 s end to end with the indicator, assembly Open Part shows faces in the
  same frame, return draws 8 components at once, edit + return updates the part, unchanged round trip = 1 request
  (the part view's status). Tests: `tests/test_loading_speed.py` (4). 290 pytest (2 skipped) + 59 node.
- Still slow on big models: the browser draws one mesh per face and one line per edge (1329 + 3099 objects on the
  plate); merging them into one geometry per body with face ranges for picking is the next step if needed.

Accounts (2026-10-18): `accounts.py` (users.json: scrypt-hashed passwords, owner/member roles, single-use
7-day invites stored as SHA-256; sessions.json: SHA-256 of random cookie tokens, 90 days, removed on sign out,
on a password change and when a member is removed). `auth.py` modes: `accounts` (any user exists: cookie
`opensketch_user` required), `password` (OPENSKETCH_PASSWORD set, no users: the sign-in page is "Create the owner
account" with the server password as the key; the old password-only cookie and POST still work until then),
`open` (neither: as before; the avatar offers Create owner account). Pages served by `PasswordGate`
(/login, /setup, /join/<token>, /reset (server password resets a forgotten password), /logout), Linear-style (dark),
no open redirect, 1 s delay on failures, X-Frame-Options DENY. `scope["state"]["user"]` = the person.
API: GET/POST /api/account (who, rename, change password), POST /api/account/invites, DELETE
/api/account/users/{id} (owner only). MCP token unchanged (still from the password or the data-folder secret);
/review/ and /mcp/ stay outside sign-in. `static/js/account.js`: avatar (initials) in the title bar, dark menu:
Account settings, Invite people (link + Copy), People on this server, look switch, Sign out.
Tests: `tests/test_accounts.py` (6).

Bring your own key + Google sign-in (2026-10-18, YZ):
- `aikeys.py`: per-account AI settings in `ai_keys.json` {user id or "local": provider, model, base_url, key
  (Fernet, secret in `ai_keys.secret` or OPENSKETCH_KEY_SECRET), hint (last 4), updated}; `effective(user)` =
  own key, else the server's ANTHROPIC_API_KEY (`server_config`, off with OPENSKETCH_SHARE_SERVER_KEY=0), else
  None. Routes: GET /api/ai/status (per person: available, source yours/server, provider, model, label), GET/POST/
  DELETE /api/ai/keys (never returns the key), POST /api/ai/models (checks a key by listing its models; stored
  key if none pasted). Custom addresses must be public https (`providers.check_base_url` refuses private,
  loopback, link-local hosts: the server makes the calls).
- `providers.py`: PROVIDERS anthropic / openai / gemini (OpenAI-compatible endpoint) / openrouter / custom.
  Anthropic = the SDK as before (`adapt_kwargs` drops betas/fallbacks/output_config for models other than
  claude-opus-5-5). Everything else = `OpenAICompatMessages`: Chat Completions streaming over httpx, request
  translated (`to_openai_messages`, `to_openai_tools`: server tools dropped), SSE translated back to
  Anthropic-shaped events (`translate_stream`: text, tool_use + input_json_delta so the live build works,
  reasoning -> thinking, finish_reason -> stop_reason) and a final message; `plain_blocks` stores replies as
  dicts so a conversation can switch provider. `ai.run_stream(..., ai_config)`; non-Claude models get no web
  tools and `NO_WEB_NOTE`; no key -> `NO_KEY` error pointing at the account menu; ProviderError 401/403 -> check
  the key. Browser: `static/js/aikeys.js` (dialog: provider, key, Check key fills a model list, model, base URL
  for custom, Remove my key; `refreshAIStatus`), account menu "AI model and key...", AI pane "Add your API key"
  button and a "Provider: model" line above the input.
- Google (`oauth.py`, on with GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET, staged to Fly by the deploy workflow):
  /auth/google -> Google with a random state in a signed 10-minute cookie (Path=/auth/google) and the request's
  own address as redirect (so fly.dev and a custom domain both work); /auth/google/callback checks the state,
  swaps the code with Google (client secret, TLS) and reads userinfo. `accounts.google_user`: linked Google id,
  else the account with the same verified email (linked); else an invite from the start link
  (`accept_invite(..., google=)`), else `sign_up` when the owner turned on open sign-up; unverified emails never
  create or link. Google-only accounts have no password (`has_password` false; Account settings offers "Set a
  password"). Owner setting `open_signup` (users.json settings; POST /api/account/settings; checkbox in People on
  this server); /signup page (email) when on. Login / join / signup pages show Continue / Join / Sign up with
  Google when configured.
- Readability (YZ's screenshot): dark theme sketch dimensions get a backing pill; while a sketch is open the
  body is mixed 90% toward #0a0b0d (`viewer.setSketchDim`, `skin.SKETCH_BODY_DIM`) so light sketch lines and
  blue under-defined geometry read clearly on it.
- Tests: `tests/test_aikeys.py` (6: encrypted per-person storage, server fallback, routes never return the key,
  message/tool/stream translation, a fake OpenAI-compatible server driving a full copilot session with a
  streamed propose_features call and live build_steps, provider errors in the chat); `tests/test_accounts.py`
  +3 (Google links by verified email, forged state, invite-only / invite / open sign-up / email sign-up /
  unverified refused, nothing before the owner exists). 286 pytest (2 skipped) + 59 node. Checked in Chromium:
  key dialog (Gemini, saved, status "yours"), AI pane with and without a key, sign-in page with Google.

Linear look (2026-10-18, replaces the same day's Figma look, which YZ did not like; from Linear's "How we
redesigned the Linear UI" and "Behind the latest design refresh": a few tokens per theme, warm neutral greys,
dimmed navigation so the content leads, fewer and smaller icons, fewer dividers, compact pill tabs):
`css/linear.css`. Dark (default) and light token sets; the title bar, ribbon, tree, task pane and status bar
share the dimmed `--side` colour with no dividers; the graphics area is the raised content card (1px line,
10px radius, soft radial in dark); pill tabs (CommandManager, Model / Motion Study); popovers and menus on
`--raised` with a hairline + shadow; quiet fields (`--field`, accent border on focus); indigo #5e6ad2 accent;
chrome icons monochrome (grayscale filter on strip, quick access, manager tabs, heads-up). `skin.js`: `SKIN`
linear/classic (an old "figma" choice becomes linear), `THEME` dark/light (`opensketch.theme`), `LOOK`,
`setLook`, `LOOKS`; per-theme icon palette swap (3- and 6-digit hexes; dark: dark fills, light strokes),
viewer colours (dark: body #8d9199, edges #16171a, indigo hover/selection) and `SKETCH_COLORS` patched into
`draw.SK` (dark: under #7c9dff, fully/dimension ink #f2f3f5, over #ff6369). index.html applies `skin-*` and
`theme-*` before first paint. Ctrl+K focuses command search (hint shown in the box). Sign-in pages are dark
Linear-style. Shared account / Design panel styles moved into app.css. Checked in Chromium: dark and light
part view, dark sketch mode (lines and dimensions readable), Design panel scrub flow, theme menu, Ctrl+K.

Design panel (2026-10-18, YZ: "a property window with Figma-like sliders that changes the value in the sketch
itself"): `static/js/design.js` = Task Pane tab "Design" (first). Opens by itself on selecting a face, feature,
sketch, component or mate (not during a command, sketch mode or a live AI build; closing it with x stops that,
stored in `opensketch.design.auto`). Rows: sketch dimensions (distance/diameter/radius/angle; driven and
equation-driven shown read-only with fx), registry numeric params of the feature whose `when` matches (plus
extrude `dir2.depth`), numeric global variables, mate value/min/max/angle limits. Each row: label scrub (pointer
capture, step per px from the value's size: 0.1 mm for 2-200 mm, Shift x10, Alt x0.1, 0.5 deg for angles),
range slider (min/max from the registry, else 0 to ~2.5x the value), number field (expressions, units,
arrow keys). Sketch dimensions are changed on a copy and solved with the browser solver; only a converged,
not over-defined result is kept (else the row flashes red, nothing changes). One undo step per drag / typed
value (`begin` pushUndo, `end` docChanged); rebuilds stream one request in flight, newest value wins. Faces:
`/api/face_owner` (`naming.face_owner`: the face's persistent name -> feature, role start/end/side/blend...,
the sketch curve of a side face) puts that feature and its sketch first and marks the rows that shape the
face (dimensions on the curve or its points, or the depth/radius for caps and blends). Because rebuilds
renumber faces, an edit started on a face selects its feature instead and keeps the face context (`pinned`).
Assemblies: a component shows its part's features (edits go into `doc.parts[pid]`, `asm.regen` rebuilds that
part); a mate shows its numbers. Proposal pending / sketch mode / open command: read-only with a note.
Checked in Chromium: top face of the bracket -> Face of Boss-Extrude1, Depth marked; scrub D2 50 -> 59.5 in
one undo step with 11 live rebuilds; typed depth 12 then Ctrl+Z; press assembly: component Base Plate D1
320 -> 340, mate limit max 300 -> 280.

Ask AI on a selection (2026-10-18): the Design panel's Ask box and the AI chat (an "About: ..." chip, x
to leave it out) send `selection` with /api/ai/stream (`design.describeSelection`: features/sketches by id,
faces with feature/role/entity/sketch and a `ref` {name, center, normal}, edges with {mid}, components with
part, mates). `ai.selection_note` appends it to the request as data (20 items, whitelisted keys, 600 chars
each); the system prompt's "Selection" paragraph says to change only what the request needs on them
(replace mode with identical other features, refs passed through to fillet/chamfer/shell/draft). The chat
shows "About: ..." under the user's message. Tests: `tests/test_design.py` (3: face owners on the bracket,
the route, the note reaching the conversation). 275 pytest (2 need the macro toolchain) + 59 node.


Coupler mate, contacts and Motion Review (2026-10-18; YZ: "drive a lever and the lock tongue moves", and the
review should be OpenSketch, not a separate page):
- `coupler` mate (docs/DOCUMENT.md, Mates > Coupler): `input_refs` + `input` (angle | distance) drive `refs` +
  `output` through `law` [[driver, driven], ...] (np.interp: straight between points, ends held; flat = dwell)
  or `ratio` + `offset`. Residual = driven - law(driver) (angle residual in rad x L). `coupler_measure`: angle
  = acos of directions (as limit_angle), distance = plane-plane / plane-point signed along the first plane,
  axis-x perpendicular, point-point straight. Both solvers (`assembly.py` coupler_measure / coupler_law,
  `asmsolver.js` couplerMeasure / couplerLaw / measurePair); `input_refs` is in REF_KEYS (and
  `mateReferences`), so drags, delete cascades and the review's moving set follow it. Parity: 5 coupler cases
  (bad start, pinned, ratio, bad law + bad measure messages, lever drag pushes the tongue). No latch state.
- `contacts` on the assembly [{id, name, a, b, joint?, from?, to?, of?}]: two components that must touch
  (gap <= CONTACT_MM 0.05 mm) through `joint`'s travel between from/to, or at rest; checked by the review only.
  `of` = the coupler whose PM made it. Deleting a component drops its contacts; deleting the joint mate makes
  it an at-rest check; deleting the `of` mate drops it (ai.delete_items and asm.deleteItems).
- AI / MCP: add_mate takes input_refs/input/output/law/ratio/offset/name (bad laws refused before solving);
  new tool `add_contact` (a, b, joint, from/to (MCP from_value/to_value), name, remove) in ai.TOOLS, MCP and
  BATCH_TOOLS; system prompt "When one part drives another through contact"; MCP now 40 tools.
- Coupler PM (`asm.couplerPM`, Mate PM > Mechanical Mates > Coupler..., Assembly ribbon Mate flyout, Insert >
  Coupler): Driver / Driven selection boxes with measure and current value (`measurePair`), Motion Law (table
  with editable points, Add Current Position, Add Point, an SVG chart with the driver's current value, or
  Ratio / Offset), Contact Check section (driver part, driven part, joint, from/to). Edit routes through
  `asm.editMate`. Icons coupler, contact, motionreview.
- Motion Review (`static/js/review.js`, Evaluate tab after Interference, Tools menu): PM with a slider + Play per
  joint (`asm.joints`: hinge with angle limits, limit mates with min < max), solved by `regenLocal` with that
  mate pinned, warm-started from the last pose in `this.work` (the document is not changed; closing redraws
  it); a part changed since the server build -> one `asm.regen` first. Checks: POST `/api/review/check`
  {doc} -> `review.checks` (build without bodies); items are clickable (go to the pose, the two parts red via
  `asm.colorOverride`); "model changed since these checks" note. Share section opens Publish Review.
- Share links: `review.publish` stores `<data>/reviews/<token>.json.gz` (build with bodies: `doc` = the solved
  assembly with every part reduced to name/appearance/material and no features or parameters, `result` =
  the /api/regen answer with all meshes, joints, checks, parts, mate_changes, changes, old ghost bodies).
  GET /review/<token> = static/index.html with `window.OPENSKETCH_REVIEW` + noindex; its relative files load
  from GET /review/{css,js,vendor}/... (`review_asset`, inside STATIC only); GET /review/<token>/data =
  the gz file with Content-Encoding gzip. PasswordGate exempts /review/ and GET /api/features. The app in
  review mode (`app.reviewMode`): no restore/autosave (never touches the visitor's own work), no server
  calls (asm.regen returns null instead of /api/regen), CommandManager/menus/task pane hidden
  (`body.review-mode`), Motion Review PM open with Review notes, Joints, Checks, What Changed (parts and
  mates, changed parts in black, previous version ghost). Phone (<= 760 px): graphics 58vh, PM below, page
  scrolls. Reviews published before this (`<token>.html`) are still served. Snapshot: press 33 KB, lock 5 KB (gz).
- `demo.lock_doc()`: case + guide, lever (hinge 90-150 deg measured case +X to lever +Y, so acos never
  sits at 0), tongue on the guide, coupler with `lock_law()` (dwell to 15 deg, then arm 20 sin + pin 3 +
  0.01 clearance every 2.5 deg), contact Pin on tongue 105-150. Review: tongue 8.19 -> 20.33 mm, touching
  (gap <= 0.01), no clash; law +0.3 -> apart at all 18 poses (0.31 mm), law -0.3 -> lever/tongue clash.
- Checked in Chromium: Coupler PM edit (20 law rows, chart, contact section, OK stores the law), Motion
  Review from the Evaluate tab (checks, slider to 135 deg moves the tongue to 17.15, Play, doc unchanged
  after closing), a clashing law listed and clicked (pose 121.3 deg, both parts red), Publish Review with
  compare, the link logged out at 390 px (notes, joint, checks, What Changed with "Lever throws tongue:
  changed", tap on the slider moves the tongue) and at desktop size, visitor's autosave untouched, no page
  errors. Rebased on v0.5 (accounts, Figma look, since replaced by the Linear look): review mode skips the account fetch and hides the avatar; the
  flows re-run with account sign-in. Tests: `tests/test_review.py` (9). 277 pytest (2 skipped) + 59 node.

## Earlier state (2026-10-17, v0.4 + mate solver in the browser + feature registry + SolidCraft borrowings 1 and 2)

Merged 2026-10-17: PR #7 (Offset Entities, see "Sketch Offset Entities") and PR #5 (review fixes + sweep, loft,
Hole Wizard; see "Review fixes"). Merge decisions: sweep / loft / hole are registered in
`features/builtin.py` (`ui="custom"`, PM hand-written in features.js by PR #5, geometry in
`geometry.sweep_tool` / `loft_tool` / `hole_tool`), so they have help lines, input checks and `add_sweep` /
`add_loft` / `add_hole` AI and MCP tools (MCP now 38). Confirm Delete keeps the server plan
(`/api/delete_plan`) with PR #5's escaping; `edits.sketch_ids` (sketch, path, profiles) matches
`featureSketchIds` in model-utils.js so sweep paths and loft profiles cascade. `commitFeature` keeps PR #5's
committing/valid guards and the persistent-name lookup. PM OK is a native button with `aria-disabled`, not
`disabled` (a click that commits a field on blur must reach OK; onclick re-checks okEnabled). app.js starts
only when `#viewport` exists (DOM tests import it). JS tests: `npm ci` then `npm test` (59). Checked in
Chromium: Hole Wizard PM through-all hole, Confirm Delete, Equations, markup in a name shown as text.
Tests: 259 pytest (2 need the macro toolchain) + 59 node.

SolidCraft borrowings, part 2 (2026-10-17): MCP now 35 tools. Seven more ideas, all in:
- Persistent names (`naming.py`): `regen` makes `st.namer = Namer()` and records each feature that changed the
  body (`record`: before/after, its tool from `st.tools`, pattern/mirror copies from `st.instances` = [(moved
  tool, op, seed id, label)], sketch edges and plane). Names are worked out lazily (`current(part)`) and only
  for the body after the last recorded step: per face, an on-face point (`inspection._face_point`) on a face
  of the body before -> inherit; on the feature's tool -> role (`_tool_names`: `side:<sketch entity>` when
  the entity's edge midpoint lies on it, caps `start` (on the sketch plane) / `end` / `end2` by sign along the
  normal and `reverse`, else `face:<i>`); on a pattern copy -> `<seed id>:<role>@<pattern id>#<label>`;
  else fillet `blend` / chamfer `bevel` + nearest picked edge's name, shell `inner` / draft `drafted` +
  nearest parallel old face, else `<fid>:new:<k>` (exact false). Inheritance uses raw names; `_split`
  adds `#[unique neighbour names]` or `~k` for pieces. `edge_names`: sorted pair `A|B`, `A|seam`, `~k` for
  duplicates. `find_edges` / `find_faces(part, refs, namer)` try `name` first, then `mid` / `center`;
  a name that is gone adds a `name_not_found` warning (via `namer.notes`, collected in `rebuild_feature`).
  Callers pass `st.namer`: fillet, chamfer, shell, pattern direction edge, draft, sldexport, measure.
  `body_topology(..., namer)` adds `name` (and `name_exact: false`) and puts it in each `ref`. Browser:
  `commitFeature` posts the feature and the part rolled back to it to `/api/name_refs`
  (`naming.annotate`) when it has edge/face picks, so hand picks store `{name, mid}`. Naming costs about
  one rebuild (measured on the 20-part corpus), so interactive rebuilds do not name. Checked in Chromium:
  a PM fillet stores `e1:end|e1:side:s1L1` and stays on that edge when the length variable goes 80 -> 140
  (volume change -51.50 = 4(1-pi/4)60).
- Global variables and equations (`params.py`): `parameters` [{name, expression, unit, comment}], feature
  `eq` {field path: expr}, sketch dimension `eq`. Driven numbers stay stored; `geometry.regen` runs
  `params.evaluate` first when `has_equations` (st.params report, st.evaluated doc; a feature with an
  equation problem gets an error status and is skipped). Expression evaluator is an AST whitelist
  (numbers, + - * / ^ %, names, pi, abs min max sqrt round floor ceil, trig in degrees, unit suffixes;
  exponent <= 64; no attributes or other calls). Variables in dependency order with cycle detection;
  reserved words refused. Registry checks on results (int whole, min/max). Sketch dimensions that changed
  re-solve with `solve_cli.mjs` (`entities: true`; LRU cache of 64); over-defined or unsolved -> error.
  `Session.settle_equations` stores computed numbers after every tool; tools `set_parameter` (remove refuses
  while used unless force) and `set_equation` (feature field or sketch dimension id/name; empty removes)
  in `ai.TOOLS`, MCP and `BATCH_TOOLS`; reports `parameters`, `equations`, `recomputed`, `now_failing`.
  inspect_design lists parameters and equations. Browser: Tools > Equations (`app.equationsDialog`, SW
  "Equations, Global Variables, and Dimensions": Global Variables and Equations tables, values from
  `/api/params` as you type, red problems, OK refused until clean, one undo step); `/api/regen` returns
  `equations` {recomputed, features} and `applyResult` copies those numbers (outside sketch mode, no undo
  step). Checked in Chromium: variable 120 drives D1 and depth = length / 6, bad name stays red, undo.
- Measure (`measure.py`, MCP `measure_items`): picks {face|edge|name|point} (+ component for assembly
  world coordinates, part_id otherwise; mixing refused). One item: area, type, normal, size, `openings`
  of a planar face (round: diameter, center; slot: width, center_distance, overall_length, centers;
  other: bbox), cylinder diameter/axis/`hole`/length, edge length/diameter/arc angle. Two items:
  min_distance + from/to/delta (`distance_to_with_closest_points`), touching, center_distance and
  axis_angle_deg for axes (cylinders, cones, circles, lines), angle_deg / plane_distance for planes,
  axis_to_plane angle/distance.
- Delete dry run (`edits.plan_delete`): references = any string field equal to another feature id;
  cascade: a feature whose `sketch` goes, a pattern/mirror left with no seeds (others trimmed); absorbed =
  sketches only deleted features used (`delete_absorbed`); would_fail / would_warn = new rebuild errors
  / warnings. `Session.delete_items` handles `features` (+ part_id) and `dry_run` (assemblies: mates that
  would fail, under-defined after); real deletes report `deleted`. `/api/delete_plan` drives the browser's
  Confirm Delete (also deleted, patterns kept, absorbed checkbox, dependent items that will show errors +
  Delete child features; rollback bar moves by the number removed before it). Checked in Chromium.
- Preview camera and section (`preview.py`): `yaw`/`pitch` (deg; `camera_direction`), `target` +
  `view_width` (mm) close-ups, `section` {point, normal}: each solid is split by OpenCascade
  (`Solid.split`, Keep.BOTTOM, plane moved into part coordinates per component) and faces on the cut plane
  are drawn orange. MCP preview_document passes them through `artifacts.preview_record(camera, section)`.
- Skill: `skills/opensketch-cad/` (SKILL.md: predict, stage with batch, measure, names, design intent;
  reference.md: plane table, argument shapes, names, error-to-fix table, red flags). `get_modelling_guide`
  appends reference.md (`SKILL_DIR`; the Dockerfile copies `skills/`). Also saved in yuanzhengyang98/skills
  (copy; this repo is the source).
- Sweeps and action matrix: `tests/test_sweeps.py` (plate variables to both ends and back: no errors,
  dof 0 for sketches with equations, hand volumes, exact return; traps: 0 or negative dimension, fractional
  or 0 count, 0 depth all fail loudly), `tests/test_naming.py` (open box sweep with the shell opening picked
  by name). `tests/action_matrix.py` (fillet, chamfer r 1, shell 0.8, draft 2 deg on every non-seam,
  non-smooth edge and planar face of the 14 reference parts + demo bracket + 5 press parts, judged by
  status, validity and volume) with baseline `tests/action_matrix.json` (fillet 327/327, chamfer 327/327,
  shell 115/130, draft 75/76); `tests/test_action_matrix.py` fails if anything that worked stops;
  `python -m tests.action_matrix --update` raises it. body_topology marks `seam` edges.
- Fix found by the matrix: OpenCascade returned some shells unchanged without an error, and they passed as
  ok. Shell now tries Kind.ARC then Kind.INTERSECTION and accepts only a body whose volume changed, else
  "Failed to shell the body. Try a thinner wall, shelling before the fillets, or removing a different face."
  (the cone shell now works with INTERSECTION; the 15 that still fail are refused loudly).
Tests: 227 pytest (2 need the macro toolchain) + 7 node.

SolidCraft borrowings (2026-10-17): ideas from bherbruck/solidcraft (Rust CAD with an MCP; read as a
reference, not forked: OpenSketch keeps build123d/OpenCascade and its SOLIDWORKS UI). Three MCP tools, now 32:
`batch(doc_id, steps[{tool, args}], summary, stop_on_warnings, dry_run)` (`mcp_server._batch_sync`): one
`ai.Session` runs every step under the doc lock; a step fails on a plain-text refusal, `input_problems`,
an exception, or an error (and with stop_on_warnings a warning) whose identity (part/id/mate/component/code,
not message) was not in the document before (`_baseline`) or an earlier step; then nothing is saved and the
reply is `isError` with `{ok: false, completed, failed {index, tool, error, report}, rolled_back, results,
note}`. Success: one version (one undo) with `_save_session` (shared with `_apply_sync`), compact per-step
reports, full report for the last. Allowed tools: `BATCH_TOOLS` + `add_<feature>`; max 100 steps; dry_run
saves nothing. `body_topology(doc_id, part_id, kind, near, limit)` and `inspect_design(doc_id, part_id,
sketches)` (both read-only, `inspection.py`). Topology: face index/type/area/center/`point` (on-face,
checked with `is_inside`, a centre can sit in a hole)/normal/axis/radius/`ref` {center, normal}; edge
index/type/mid/start/end/length/dir or center+radius/faces it joins/`face_angle_deg`/`ref` {mid}. Indices =
`faces()`/`edges()` order (same as `mesh_shape`, the browser's ids). `ref`s are exactly what
`find_faces`/`find_edges` match. Inspect (part): rebuilt/clean/errors/warnings, timeline (state,
volume_change_mm3), body (volume, area, CoM, bbox+size, counts, face_types, mass_g with a material),
sketches (curves, relations, dimensions, regions, and from the browser solver dof/status/conflicts/under).
Sketch DOF runs `static/js/sketch/solve_cli.mjs` (imports `solver.js`, so server and page agree) with node;
without node it says so in `sketch_note`. The Docker image now installs `nodejs`. Inspect (assembly):
components, mates, `under_defined`, each part's body; part_id gives one part with sketches. MCP guide
(`MCP_PREFACE`) gained "Predict, then measure" (from SolidCraft's skills): expected volume/bbox before each
stage, batches of 1-4 features, 0 volume change = missed cut, refs from body_topology, fillets last.
Reference parts: `tests/reference_parts/recipes.py` writes 14 JSON recipes (block, off-centre hole, tube,
cone, fillets, chamfer, shell, mid plane, draft frustum, linear/circular pattern, mirror, boss + blind cut
on a face, Right Plane boss) with volume, CoM and bbox from closed-form formulas (never from an OpenSketch
run); `tests/test_reference_parts.py` rebuilds them (volume 1e-6 relative, CoM/bbox 2e-3 mm) and checks the
JSON matches recipes.py. Change a recipe: run `python -m tests.reference_parts.recipes`.
Tests: `tests/test_mcp_inspect.py` (10, real MCP client: one version per batch with stage volumes, rollback
names the step and leaves the doc untouched, non-modelling tool and refused input refused, dry run,
existing errors ignored, stop_on_warnings on a missed cut, a topology `ref` drives a fillet whose volume
matches r^2(1-pi/4)L and a shell, on-face points with a hole, part inspect numbers + over/under sketches,
assembly inspect). 168 pytest + 7 node.

Feature registry (2026-10-17): one command list for the user, the AI and MCP. `opensketch/features/`
(`__init__.py`: `Param` kinds length/angle/number/int/bool/string/enum/plane/faces/edges/sketch/
sketch_line/features/axis/direction/object with doc, default, required, min/max, options, label, icon,
section, `when` (shown only for other param values), widget; `FeatureType` type/title/base/icon/
summary/params/build/ui/command/label/message/notes/keys; `REGISTRY`, `validate`, `new_feature`,
`help_text`, `ai_tools`, `public`). `builtin.py` describes the ten older features (`ui="custom"`, geometry
still in `geometry._regen_feature`); `draft.py` is the first feature added only through the registry.
Outputs: `GET /api/features` (browser: `features.js` loads it with top-level await as `SPECS`; app.js
starts on DOMContentLoaded or at once if parsing already finished); `generatedSpec` builds the
PropertyManager (rows per kind, rollouts per `section`, selection boxes routed by kind with the active
box first, a filled plane/sketch box hands over to the next empty one, okEnabled = required filled,
selected faces/edges highlighted); `generatedDefaults` prefills from the selection; `metaFor`,
`featureIcon`, `describeFeature` fall back to the registry; commands.js replaces a placeholder command
with the registry one and adds it to the ribbon (next to Shell) and Insert menu if missing. AI: help
lines for every type in `FEATURES_HELP`; `TOOLS += features.ai_tools()` (`add_<type>`, optional
part_id/name; 10 tools); `Session.add_feature` validates, appends (respects rollback), rebuilds with
`LiveBuilder` and streams build_start (`mode` part/asm) + build_step + proposal or assembly; propose_features
and create_part put registry problems in `report.input_problems` (not clean). MCP: one tool per type
generated with a dynamic signature (`Annotated` + pydantic `Field` descriptions), now 29 tools.
Taskpane titles "Adding <title>". Draft: neutral plane (plane or planar face), faces, angle (1 deg
default, 0.01-45), reverse; `Solid.draft` per solid; faces parallel to the neutral plane are refused.
Checked in Chromium: ribbon Draft enabled, PM (Draft Angle / Neutral Plane / Faces to Draft), top face
then two side faces picked in the graphics area, 3 deg, OK, Draft1 in the tree with no errors, volume
8000 -> 8158, Edit Feature shows the faces, Insert menu has Draft, no page errors.

Sketch Offset Entities (2026-10-16): selection stays in the active command instead of replacing its
PropertyManager with Arc/Line properties. Both preselection and command-first selection work;
window selection ignores included points/relations, and picking does not drag source geometry.
Hidden On Edge references are excluded; model-edge preselection/highlighting is cleared or suppressed
while this sketch-only command is active, preserving the separate Convert Entities workflow.
`sketch/offset.js` plans analytic line/arc/circle offsets, joins coincident converted endpoints,
expands chains by default, preserves construction flags, and rejects branches, overlaps,
intersections and collapsed/reversed results. `offset-command.js` owns Distance/Reverse/Select chain,
inline validation and a non-mutating dashed preview. Field feedback updates in place so committing
Distance on blur does not swallow a click on OK. Cancel, command replacement and sketch exit clear
the preview. `offset-apply.js` builds a detached candidate; solving must succeed before one undoable
commit. Output is ordinary editable geometry (arc/circle centers remain shared), without a persistent
offset-distance relation or schema changes. Removed the old partial polygon constraints, which
only drove one side's distance. Tests: 44 Node tests (37 new offset regressions), 137 pytest passed,
2 macro-toolchain tests skipped. Real browser checks: converted rounded slot, both selection orders,
2 mm outward/inward, chain toggle, collapse feedback, window selection, command replacement,
direct Distance-to-OK click, Cancel and one-step Undo. Saved geometry matches the expected radii
and spacing, preserves source entities, and extrudes as a closed ring with analytic volume.

Background CAD workflow (2026-10-16): MCP had 19 tools (29 with the registry's add_<type> tools), including `import_document`,
`export_document`, and `preview_document`. Source imports create a new server document (base64,
32 MiB decoded maximum); export/preview read a snapshot without a new version. `.osk`, STEP and
STL exports support optional assembly `part_id` in local coordinates. PNG previews return an MCP
image plus download metadata, generated by `preview.py` with NumPy/stdlib PNG encoding, a depth
buffer, solved component transforms, hidden/suppressed filtering, and triangle/pixel/edge budgets.
No browser or graphics driver is required; MCP guidance defaults to background work. These external
MCP file operations do not extend the in-app `Session` tool list. `artifacts.py` validates active
geometry and mates before STEP/STL/PNG, keeps native backups available, and stores immutable files
with SHA-256/version metadata. Downloads use exact-path HMAC capabilities under `/mcp/artifacts`,
expire after one hour, contain no MCP credential, and return no-store/nosniff headers. Store caps:
128 MiB per artifact, 512 MiB total, 128 files; expired files are pruned on publication after a five
minute grace period. The mounted MCP gate refreshes its single-use SDK session manager each startup.

Plane/report diagnostics: explicit `type: "fixed"` planes keep exact supplied coordinates; `face`
attachments retain nearest-face following and warn on movement or no match. Full/live rebuilds
share `rebuild_feature`; statuses include requested/resolved planes, tool/result bounds, extrusion
normal ranges and signed material change. No-effect cuts or merged bosses warn. AI/MCP reports
separate errors/warnings and `rebuilt`/`clean`; assembly insert/mate/delete retain existing issues.
These diagnostics do not validate intended dimensions, clearances or physical fit.

EAGLE import: `importer.import_file` dispatches STEP and XML `.brd`, including one-model ZIPs;
`import_step` remains compatible. REST uploads, Open, drag/drop and Insert Components accept boards.
`eagle.py` produces editable layer 20 outline (signed arcs), board-thickness extrusion from the layer stack
or explicit 1.6 mm default, and mechanical-hole cuts. It preserves component placements and 2D packages
under the documented `pcb` metadata; no component solids, copper or plated pad/via drills inferred.
Binary boards, custom DTD/entities, invalid/overlapping drills and ambiguous archives fail clearly;
XML/ZIP/package expansion is bounded. `model_view` summarizes package geometry counts for AI/MCP
without modifying the saved metadata. Official UNO Rev3e checked at 68.58 × 53.34 × 1.57 mm, four mounting
holes and 116 component records. Regression tests cover imports, original enclosure plane/no-op bugs,
stream parity, MCP downloads/auth/expiry, PNG visibility and workload limits. Native imports validate
nested document structure before saving while retaining repairable rebuild errors. Official .brd
and CAD ZIP file-picker flows were checked in the browser; STEP round-trip dimensions/volume and
MCP previews/downloads were checked with the official board and the completed enclosure.

Phase 1 (part files), phase 2 (assemblies + live AI build), phase 3 (import, motion, Toolbox, section) and phase 4 (SOLIDWORKS macro export) are done. 2026-10-16: the mate solver also runs in the browser (see Mate solving); STEP upload fixed for large files and .zip accepted (see Import); the AI can search the web and read pages, and prefers off-the-shelf parts (see AI); the codespace updates itself after each push (see Try it); MCP server + server-side documents shared live with the browser + optional password (see MCP); hosted on Fly.io at https://opensketch-yz.fly.dev since 2026-10-16 (see Try it).

| Area | State |
|---|---|
| UI shell | Title bar with quick access, menus, command search; CommandManager tabs Features / Sketch / Evaluate / OpenSketch AI for parts, Assembly / Evaluate / OpenSketch AI for assemblies; FeatureManager tree with rollback bar, context toolbars and menus; PropertyManager; Heads-up toolbar; confirmation corner; triad; Task Pane; status bar; New dialog (Part / Assembly). |
| Sketch | Line, centerline, rectangles, slot, circle, 3 arc types, polygon, point; inference and snapping; Smart Dimension with Modify box and driven prompt; relations and glyphs; drag; box select; trim; sketch fillet; convert, offset, mirror entities; live DOF solver with under/fully/over colours. Model edges (2026-10-16): edges of the body lying in the sketch plane (`sketcher.modelEdges`, from `viewer.bodyData`, cached per body/frame; lines, circles/arcs fitted by `circle3`, other types vertices only) are snap targets after sketch points: vertices and arc centres, line midpoints, then the curves (nearest wins against sketch curves); the edge highlights orange with the landing square while a tool is active. Committing (`pointFor` -> `linkModel`) adds `coincident` / `midpoint` to a hidden reference: `ref: "edge"` construction copy of the edge (`refKey` = edge midpoint) with fixed `ref` points (`refPoint` / `refEdge`, reused per edge); refs are skipped by render, hit test, snap, box select, trim, point reuse, revolve axis choice, inactive drawing and `geometry.sketch_geometry`; `pruneRefs` (every `edit` and `removeEntity`) drops refs nothing but their own fixes uses; glyphs: none for ref fixes, title "On Edge" for links. With no tool, hovering a model edge highlights it and clicking selects it (`modelSel`, Ctrl/Shift to add, Esc clears); Convert Entities converts a pre-selection at once (else the pick PM). Checked in Chromium on a sketch on a block face: point 3 px off an edge lands on it (On Edge, still under defined), corner point fully defined, circle centre midpoint-snapped, edge click + Convert adds a fixed line, deleting the point prunes its reference. |
| Features | Extrude boss/cut (blind, through all, up to next, mid plane, direction 2, draft), revolve boss/cut, sweep boss/cut (profile + connected path), loft boss/cut (ordered single contours), dimensioned simple/counterbore/countersink holes, fillet, chamfer, shell, mirror, linear and circular pattern, reference plane, Draft (neutral plane; registry-generated). Live previews; edit, suppress, rollback, delete, rename, undo/redo. |
| Assemblies | `assembly.py`: parts embedded in one .osk; part rebuild cache keyed by content; components with position/rotation (R = Rz Ry Rx); mates coincident, parallel, perpendicular, concentric, distance, angle, lock with align anti/aligned/auto; Levenberg-Marquardt solver over 6 DOF per free component (minimum motion), per-mate ok/error, per-component fixed/under/full and remaining DOF (SVD null space); plane/axis refs follow their face after part edits; interference (pairwise boolean common); STEP/STL export; mass. UI (`asm.js`): tree with (f)/(-) prefixes and Mates folder, Insert Components (parts in file, Browse, New Part), Mate PM with live preview that stays open, left-drag of under-defined components (one solve request in flight, warm-started), Fix/Float, Hide/Show, Suppress, Delete, Rename, Open Part / Return to Assembly (document stack; the edit is one undo step), Interference Detection PM, Motion Study tab = assembly playback in `sequence` order. |
| AI | `ai.py` streams NDJSON events (`/api/ai/stream`): summarized thinking, text, tool_start, build_start/build_step (each feature rebuilt by `LiveBuilder` as soon as `FeatureScanner` sees it complete in the streaming tool JSON; tools use `eager_input_streaming`), assembly (solved result per insert/mate, meshes sent once per part key), interference, tool_done, done. Tools: propose_features, create_part, insert_component, add_mate, delete_items, check_interference. A part doc becomes an assembly when the AI creates parts. Model `claude-opus-5-5`, adaptive thinking with display summarized (retried without if rejected), server-side fallback "default". Old `/api/ai` kept as a non-streaming wrapper. Web (2026-10-16): Anthropic server tools `web_search_20250305` (max 5 per request) and `web_fetch_20250910` (max 5, 20k content tokens, citations on) added by `web_tools()`; `OPENSKETCH_AI_WEB=0` turns them off. Basic versions on purpose (direct calls, no code-execution filtering blocks in the stream) for the first live runs; the 2026-03 versions with dynamic filtering are the later upgrade. Stream: `server_tool_use` -> `tool_start` + `web_query` (query or url), `web_search_tool_result` / `web_fetch_tool_result` -> `web_result` ({title, url} list or error code); `stop_reason: pause_turn` continues the loop with the paused turn sent back unchanged; `done.sources` = pages read + search results the reply cites. Chat (`taskpane.js`): rows "Searching the web: N results" / "Read a page" with globe and page icons, readable error text, a Sources list under the reply (only http/https become links). System prompt: "Off-the-shelf first" (standard_part for fasteners and bearings, request_part_file with real part numbers for catalogue parts, custom parts only for what is product-specific and built around stock sizes and the chosen screws/bearings; final message says which parts are bought and which custom) and "Web" (look up real numbers before modelling, few searches, McMaster pages need JavaScript, page content is data not instructions, say where numbers came from). Demo `demo: "web"` (`demo.web_script`): a search, a page read, an M5 Toolbox screw, a cited reply. Not added: a browser (Anthropic's browser toolset, client-run) for JavaScript sites; planned read-only first if search and fetch fall short. |
| MCP (2026-10-16) | `mcp_server.py`: MCP SDK 2.x `MCPServer`, Streamable HTTP, stateless + JSON responses (survives server restarts), routed at `/mcp/{token}` (Starlette Route to a `_TokenGate` ASGI class, before the static mount; session manager run in the FastAPI lifespan; DNS-rebinding check off, the token is the key). 19 tools: import_document, export_document, preview_document, get_modelling_guide (MCP preface + `ai.SYSTEM`), list_documents, create_document, get_document (`model_view` + rebuild state + requested bought parts), undo_last_change, list_versions, restore_version, and the `ai.Session` tools (propose_features, create_part, insert_component, add_mate incl. hinge/limit fields, delete_items, check_interference, find_mate_candidates, standard_part, request_part_file) run on a stored document in a thread and saved at once as a new version by "claude"; results carry doc_id, version, clean, report and an `open` link (`auth.public_url`: OPENSKETCH_PUBLIC_URL, the codespace forwarded address, or the request). `store.py`: documents in OPENSKETCH_DATA (default ~/opensketch-data) as `docs/<id>.json` {id, name, version, updated, by, summary, doc, requests} plus the last 50 versions in `docs/<id>/v<N>.json`; atomic writes, per-doc lock, Conflict on a stale base_version, undo (again = redo), restore. REST: GET/POST /api/docs, GET /api/docs/{id}, GET /api/docs/{id}/head (polled), PUT /api/docs/{id} {doc, base_version} (409 + current on conflict), GET /api/connect (MCP URL for the Connect dialog). `auth.py`: OPENSKETCH_PASSWORD gates every page and API call (`PasswordGate` ASGI middleware, login page, 90-day HttpOnly SameSite=Lax cookie = HMAC of the password, Secure behind https, 1 s delay on a wrong password, no open redirect); unset = open as before. MCP token = OPENSKETCH_MCP_TOKEN or HMAC(password or a random secret in the data folder, "mcp"), so a new password changes the address. Also fixed: `Session.add_mate` dropped hinge/limit fields (planes, angle_refs, angle_min/max, min/max); now kept, and in the add_mate schema. Browser (`static/js/serverdocs.js`, `app.server`): `?doc=<id>` (Claude's `open` links, reloads) or File > Open from Server opens a stored document and links the page to it (title shows "on server, shared with Claude"); polls `/head` every 1.5 s while visible and loads each newer version as one undo step ("Claude: <summary>"); your edits are PUT ~1.2 s after `docChanged` with the base version (only the swap itself is hidden from `changed()`, so an edit made during the redraw is saved); with local edits pending, an open command or sketch mode, or on a 409, a bar asks "Load Claude's version / Keep mine" (keep = save over it; theirs stays in history). Save on a linked doc saves now; Save As offers .osk download or a new server copy; File > Save to Server; opening a local file or New unlinks. Idle (2026-10-16): background requests (the `/head` poll and `/api/version`) run only while `app.isActive()` (tab visible and input in the last 15 min, `watchActivity`), so a hosted server can stop; the first input after a skipped check polls at once (`markActive`). Checked in Chromium: 0 requests while idle, catch-up on mouse move. Requested bought parts (`requests` on the record) become the AI pane's STEP cards; a replaced part leaves the list. Connect AI (OpenSketch AI tabs, File menu; was Connect Claude): `/api/connect` = the person's address; steps per AI app (connect.js), warnings when no password is set, in a codespace to make port 8000 public, and for a localhost address. A part document that becomes an assembly keeps its name (MCP and a named empty doc). Checked: a real MCP client session over HTTP (create document, plate part, M6 Toolbox screw, inserts, concentric mate, bought-part request, get_document, undo, versions, unknown doc); Playwright with a real MCP client driving the same document: `?doc` link opens it, Claude's insert appears in the page, a page edit reaches Claude's get_document as by "you", simultaneous changes raise the bar and Load Claude's version applies, a bought-part card appears, Connect and Open dialogs; with a password, a `?doc` link goes through login and lands on the document. Not yet tried through a real codespace public port and the real Claude connector. |
| Live view | `live.js`: parts built on a shelf beside the assembly (sketch in blue, then new material grows out of the sketch plane via clipping planes), components fly from the shelf to the solved pose, mates tween the components and flash them, interference shown in red; queue paced with speed-up on backlog; camera follows unless the user navigated in the last 4 s. Chat shows thinking, sentences and an activity row per tool. Stop aborts. Demo button plays `demo.py` (hand press: 5 parts, 8 components, 16 mates; L bracket part). |
| Import (v0.3, upload reworked 2026-10-16) | `importer.py`: STEP via `/api/import/raw?filename=` (body = the file's bytes, gzipped by the browser with `CompressionStream` and flagged `X-OpenSketch-Gzip: 1`; a 14.5 MB McMaster STEP goes up as 2.7 MB). Before, the client sent base64 JSON to `/api/import` (19 MB for that file), the Codespaces tunnel dropped it and the dialog read "Could not insert:" with nothing after it. `/api/import` (base64 JSON) is kept for scripts. Every server failure comes back as JSON `{error}` with text (`_import_reply`, `str(exc) or type name`); the client's `importFailText` explains statuses that never reached OpenSketch (413, 502-504, 401/403, network drop). A `.zip` is opened (`_from_zip`): one STEP inside is imported, `__MACOSX`/dot files ignored; several STEPs, no STEP or only SOLIDWORKS files give a plain message. `app.readDocFile` is the one reader for Open, drag-drop and Insert Components > Browse (STEP/zip/SLDPRT to the server, .osk/.json parsed, anything else a plain "cannot open .xxx files" message instead of a JSON parser error). One solid: part with an `import` feature (BREP zlib+base64 in the doc, decoded with an LRU cache) that later features build on. Several solids: assembly, parts deduplicated by shape signature, components at STEP positions, first fixed, no mates. .sldprt/.sldasm refused with a "save as STEP" message (closed format; user chose STEP for now). Open dialog, drag-drop on the graphics area (open, or insert into an assembly), Insert Components > Browse (STEP assemblies are flattened in). AI sees imports via `model_view` (data omitted, summary given) and `restore_blobs` puts data back by id. Quick actions: Rebuild as Features (report compares with the import by boolean volume), Add Mates (`find_mate_candidates` = `assembly.mate_candidates`: coaxial cylinders, opposite coplanar overlapping faces). |
| Toolbox (v0.3) | `standard` feature from bd_warehouse (ISO 4762/4014/10642/7380/4026 screws, ISO 4032 nut, ISO 7089 washer, SKT ball bearings), turned so the axis is Y with the head above Y=0. Design Library pane, Assembly > Toolbox, Edit Feature changes size/length. AI tools `standard_part` and `request_part_file` (McMaster number + link; user drops the STEP on the chat card, `replacePartFromFile` swaps the placeholder part). No automated McMaster download (login + terms). |
| Mate solving (2026-10-16) | Two copies of one solver: `assembly.py` `solve` (server: AI stream, exports, any regen after a part change) and `static/js/asmsolver.js` (browser: `solve`, `regenLocal` returns the same shape as `/api/regen`; own one-sided Jacobi SVD, no dependencies). `asm.regen` solves in the browser when `canSolveLocally`: every part's JSON equals what the server last built (`builtParts`) and the viewer holds that part's mesh key (`partsInfo`); otherwise one `/api/regen` (rebuilds the part, sends the mesh, `refind` moves mate refs onto the rebuilt faces) and `remember` stores the new parts. So drag, mates, Mate PM previews, Fix/Float, suppress are local (0 requests); a part edit is 1 request, then local again. Drag: browser solve once per animation frame for the newest mouse position, warm-started (`d.doc`); press ~8-11 ms per frame, full solve + DOF ~4 ms (node). `tests/test_solver_parity.py` runs both solvers (via `tests/js/asm_parity.mjs`) on 16 cases (pin, distance/angle, conflicts, lock, hinge, limits, slider, chain, floated, press drags) and compares poses, mate states and messages, component states, DOF, updates. Change one solver: change the other and run it. |
| Motion and view (v0.3, drag reworked 2026-10-16) | Drag by grab point: `/api/regen` with `drag`. Only the components linked to the dragged one (through mates, not through fixed components) are solved. `run_drag` = constrained Gauss-Newton: each step solves the mates' linearisation (SVD pseudo-inverse) and moves the grab point toward the cursor inside their null space, rotations weighted 200x costlier than moves (a free part slides, a hinge still turns), trust region ~20 deg / L/5 per step, step-length search 1 / 0.6 / 2 / 4 (the cursor is usually off the path a hinge allows); then `run_lm` makes every mate exact. DOF analysis is skipped on drag frames (the rebuild on release reports states). Press: ~40 ms per warm-started frame (was ~650 ms for a rotation). Client (`pumpDrag`): solved in the browser per animation frame (see Mate solving); if a part changed since the last server build it falls back to the server, one request in flight for the newest mouse position. Each frame starts from the last solved pose (`d.doc`); on release it waits, solves the release point, one undo step. No hidden auto-fix: only `fixed: true` components are fixed, so Float works on the first component and a floated assembly drags as a whole. `hinge` mate (concentric + optional coincident + optional angle limits) with its own PM (Mechanical Mates), `limit_distance` / `limit_angle` (Advanced Mates). Tab hides the component under the cursor (part: the body), Shift+Tab shows the nearest hidden component whose box the cursor ray hits. Section View (`section.js`): Front/Top/Right or picked face, offset slider + number, X/Y rotation, flip, drag arrow in the graphics area; stencil-capped cut faces in `viewer.rebuildCaps` (stencil meshes sit beside each face so they follow components). |
| SOLIDWORKS export (v0.4) | `sldexport.py` + `sldexport_vba.py`; engine vendored unchanged in `vendor/sldmacro` (PROVENANCE.md). Per part: `translate_part` makes an engine recipe in the frame of the first extrude's sketch plane (SW Front = that plane, origin = its origin, not re-centred, so OS named planes map to SW planes): extrudes along that one direction (z range from the tool solid, through all clamped to the part), sketch loops as circle/rect/rrect/obround/free, sketch holes in a boss become a separate cut, draft = taper, linear/circular patterns and mirrors of extrudes become copies, fillets/45 deg chamfers select edges by OS sample points (`_on`). Then `sldmacro check` must match the OS solid (both volumes <= max(0.05, 2e-5 V)); otherwise, or for revolve/shell/second direction/import/Toolbox, the part goes as STEP (`LoadFile4`). `emit` + `verify` (sketch solver, ~50 stand-in scenarios, ANTLR grammar, file). OpenSketch's module is injected into the engine's macro (declarations before `Sub main()`, `OsReset`/`OsAfterParts` around `BuildAll`, `OsKeep` after each `BuildN`), or put after a small shim when no part is built by the engine. Assembly: parts saved to Documents\OpenSketch\<Name>, `AddComponent5` + `Transform2` at the OS-solved pose (matrix convention chosen by `MathPoint.MultiplyTransform` against a probe point), Fix/Unfix, mates by `AddMate5` one at a time: readings tried in order (expected alignment first, flips for distance/angle, refused readings retried once), kept only with NoError and no component moved. Faces picked in the part doc by point then `GetCorresponding`; fallbacks: component bodies `GetBodies3`, `SelectByID2` + component check. Std planes by `FeatureByName`; axes without a round face get `InsertAxis2` (two std planes or a straight edge). Hinge = concentric + coincident + limit angle. Assembly stand-in: `sldexport_standin.py` runs the module in LibreOffice Basic against `sldexport_mock/*.bas` (mocks hold the parts' real faces and check every mate geometrically; 9 scenarios). UI: File > Save As > SOLIDWORKS Macro, File > Export SOLIDWORKS Macro: background job `/api/export/sldmacro/start`, poll, zip download (.bas, steps/, REPORT.md, verify.json, expected.json, standin.log, job.zip). Codespaces installs the toolchain in the background on first start (`.devcontainer/macro-toolchain.sh`); without it every part goes as STEP. |
| Evaluate / files | Mass properties with materials, measure, section view, check; save/open .osk (part or assembly; saving while editing a part from an assembly saves the assembly), STEP/STL export, browser autosave. |
| Try it | GitHub Codespaces: `.devcontainer/` (Python 3.12 image, OpenCascade system libs, `setup.sh` installs `.[ai,dev]`, `start.sh` serves on port 8000 and the browser opens automatically). README badge links to it. Self-update (2026-10-16): `start.sh` execs `.devcontainer/run.sh`, which runs the server and every `OPENSKETCH_UPDATE_SECONDS` (60) fetches origin/main; if new, fast-forwards (never when tracked files are edited or the branch has its own commits: it writes a note instead), reinstalls when pyproject.toml changed, notes a needed rebuild when devcontainer.json/setup.sh changed, restarts the server, and re-execs itself when run.sh changed (whole script runs from `main()`). Also restarts a crashed server. `OPENSKETCH_AUTO_UPDATE=0` stops updating. `/api/version` = {version: git short commit (or `OPENSKETCH_VERSION`), note: `~/.opensketch-update-note`}; the page polls it every 30 s and on tab focus (`watchVersion`) and shows a bar "OpenSketch was updated... Reload" (autosave keeps the model) or the note. An existing codespace gets this after one last restart. Hosting (2026-10-16, live at https://opensketch-yz.fly.dev, deployed by the workflow on every push to main; YZ is the only user): `Dockerfile` (python:3.12-slim, GL libs, deps installed from pyproject (the dependency layer stubs `opensketch/` and `opensketch/features/`; a new subpackage must be stubbed there too), app run from source in /app as root because Fly mounts /data root-owned, OPENSKETCH_DATA=/data, port 8080; ARG WITH_MACRO=1 installs LibreOffice/JDK/gcc + `setup_env.sh`, best effort with a STEP-only fallback; image 4.8 GB with it, 1.9 GB without), `.dockerignore`, `fly.toml` (app opensketch-yz, syd, performance-1x 2 GB since 2026-10-19 (was shared-cpu-2x), kill_timeout 15, auto stop/start, min 0 machines, volume opensketch_data at /data, no Fly health check so it can sleep; the image runs `--supervise`, which restarts a hung server, see "Server stays up"), `.github/workflows/deploy.yml` (push to main / manual; no-op without the FLY_API_TOKEN secret; refuses without OPENSKETCH_PASSWORD; first run creates the app (org from repo variable FLY_ORG, default personal: flyctl's name for YZ's org; the dashboard URL slug yuanzheng-yang is not accepted) and a 1 GB volume; stages OPENSKETCH_PASSWORD and ANTHROPIC_API_KEY as Fly secrets; `flyctl deploy --remote-only --ha=false` with OPENSKETCH_VERSION = short SHA and OPENSKETCH_PUBLIC_URL = https://$APP.fly.dev; app name override: repo variable FLY_APP; own domain: repo variable PUBLIC_URL sets OPENSKETCH_PUBLIC_URL, certificate added in the Fly dashboard). README "Host it on Fly.io" has the browser-only steps. Checked locally with Docker (workspace needs a CA-trusting base image and a registry mirror; not part of the repo): build with and without the toolchain, cold start 4.8 s, login, full MCP session, ~260 MB in use, documents survive a restart, `/api/export/sldmacro/toolchain` all present in the macro image. First real deploy 2026-10-16: 6 min, image 1.1 GB compressed, macro toolchain all OK on Fly's builder, login page 200; one machine in syd. Not yet tried: the Claude connector against the Fly address. Checked with a bare repo as GitHub: push -> new version in <10 s, edited file blocks with a note then updates once discarded, killed server restarted, run.sh change re-execs in place (one loop, one server), bar + Reload in Chromium. |
| Tests | 2026-10-17 registry: `tests/test_features_registry.py` (6: one description per command with AI tools/help, draft geometry incl. reverse and a refused parallel face, validation messages and `when`, demo features pass, input_problems in propose_features, add_draft/add_fillet events on a part and an assembly, MCP add_draft over JSON-RPC saved by claude and /api/features); 143 pytest. 2026-10-16 sketch: test_model_edge_references_are_hidden_from_profiles (refs never in profiles or drawn sketch edges). 57 pytest (55 + 2 needing the macro toolchain; 2026-10-16 MCP adds 4 in `tests/test_mcp.py`: store versions/conflict/undo/restore/path safety, password gate (redirect, 401, wrong password, no open redirect, cookie, wrong MCP address 404), MCP token follows the password, MCP JSON-RPC initialize/tools/list/tools/call building a part and a hinge mate with limits saved, head shows Claude as author; 2026-10-16 self-update adds /api/version with the note; 2026-10-16 web adds 5: web search/fetch events, pause_turn resumes with the paused turn last, sources de-duplicated, search error reaches the chat, `OPENSKETCH_AI_WEB=0`, off-the-shelf prompt, web demo session end to end; the fake client now snapshots the messages it was sent). Playwright 2026-10-16 web: demo "web" in the chat (rows, Toolbox screw, reply, Sources links open in a new tab, a `javascript:` link is not rendered). Upload fix adds 7: gzip and plain raw upload, zip with one STEP among junk, zip messages for none / SOLIDWORKS-only / several, errors always JSON with text (bad zip, bad gzip, an exception with no text), old base64 route). Playwright 2026-10-16: the 14.5 MB 1361A5 McMaster frame (36 bodies, 7 parts) opened from a .zip, inserted raw through Insert Components > Browse (36 -> 72 components), sent gzipped (2.7 MB), .txt gets the plain message. Before that, 40 pytest (2026-10-16 adds JS/Python solver parity on 16 cases,  Float really floats + floated drag carries the mated part, mated parts follow a drag both ways). v0.4: 37 pytest (v0.4 adds 8 macro export tests: recipes of the press parts, unsupported parts, fillet edges, patterns and mirror, assembly data consistency (faces on the SW-frame solid, transforms), STEP-only export, and with the toolchain: press export (5 parts as features, assembly stand-in), mixed assembly with every mate kind). Playwright v0.4: Save As > SOLIDWORKS Macro on the demo press, progress, summary, zip download. v0.3: 29 pytest (adds STEP part/assembly import, SLDPRT message, Toolbox, hinge drag, hinge angle limit, slider + limit distance, mate candidates, AI rebuild-as-features compare, blob restore, Toolbox + bought-part tools). Playwright v0.3: STEP part, SLDPRT message, STEP assembly, hinge drag by mouse, Tab / Shift+Tab, section arrow drag with caps, Toolbox insert, Hinge PM, bought-part card replace; v0.2 flows re-run. Earlier: 18 pytest (regen, sketch-on-face, previews, AI loop, mate solver incl. conflicts/lock/DOF/face following, interference, export, streaming AI with chunked tool JSON, demo press and bracket), 7 node solver tests. Playwright flows checked: demo press live build to accept, part demo live build, press over an existing part (conversion) and reject, load assembly, click-select, suppress mate + drag platen along columns, Mate PM distance mate, interference, Open Part edit + return + undo, Motion Study, New Assembly + New Part, part edit/undo/sketch regression. |

## Review fixes (2026-10-16)

See `docs/CODE_REVIEW_2026-10-16.md` for reproductions, new-feature usage and UX follow-up.
- STEP/STL and macro export reject active feature errors. Regular export temporary files are
  removed after download and on failure; expired completed macro ZIPs are removed on job creation.
- Failed/cancelled/stale previews cannot commit; repeated OK is guarded. Drafts without the UI-only
  `draftOn` flag survive manual edits and show their controls.
- Shared `model-utils.js`: escaped text/URLs, sketch consumers and transitive feature dependencies,
  rollback-aware removal, all hinge reference groups, assembly-space measurement coordinates.
- Sketch discard restores document and undo/redo history; cancelling a new sketch restores rollback.
- Malformed gzip/base64 and invalid Toolbox sizes/lengths return useful client errors.
- AI limit and hinge mate tools preserve and validate their bounds and supporting references.
- PM confirmation uses native labelled buttons; numeric wheel changes obey bounds. Unsupported
  commands are explicitly labelled in search/tooltips and cannot become the repeated command.
- `sweep`, `loft`, `hole` are in the document format, kernel, UI, tree, AI help and feature patterns.
  SOLIDWORKS macro export uses STEP fallback for parts containing these features.

## Known limits

- Files: no folders, sharing between accounts or per-file permissions beyond the owner; the Trash purge runs when
  a list is loaded; empty files made by New stay until deleted; pictures are 480x360 trimetric only.
- Connect AI: client steps are from vendor docs (Oct 2026), not tried end to end in ChatGPT, Codex, Cursor or
  VS Code; ChatGPT's developer-mode menu and plan rules differ between OpenAI's pages. App sign-in (OAuth) is
  tested with the MCP Python SDK client; not yet with the real Claude / ChatGPT connectors. No scopes beyond one
  ("opensketch" = everything the person can do); codes are in memory (a restart mid-sign-in means connect again).
- Service worker: offline shows the last app page and the browser copy of the model; rebuilds need the server.

- BYOK: only the Anthropic path has web search, thinking display and the server-side fallback; OpenAI-compatible
  providers get plain function calling (models that cannot call tools will not build). Not tried against the
  real OpenAI / Gemini / OpenRouter APIs yet (tests use a fake server). Keys saved while signed in with the old
  server password belong to "local". Google sign-in not yet tried with a real Google client (the in-app setup and
  the client check are tested against a fake token endpoint).
- Accounts: no email sending (invites are links you pass on; a forgotten password is reset with the server
  password). Documents are per person (owner only; no sharing between accounts yet). The sign-in rate limit is
  in memory (resets on restart, per machine). Documents still record `by: "you"` / `"claude"`, not the person's name.
- Audit items not done: no Content-Security-Policy header yet (inline scripts in index.html and the review page
  would need hashes); context menus have no arrow-key navigation; long AI provider errors are shown in full.
- Design panel: edge picks show the whole part (no edge-to-feature lookup yet); the face lookup costs one
  named rebuild on the server per face clicked; the slider range is fixed when the row is drawn; sketch
  dimensions inside a part opened from an assembly use the same path but were only checked on the press.
  Linear look: ribbon feature icons keep a two-tone style (light fill + accent), not Linear's single-stroke
  icons; chrome icons are greyed with a CSS filter.

- SOLIDWORKS add-in: nothing has run in a real SOLIDWORKS yet (only compiled against the 2022 interop, the link client
  tested against a real server, the server side against fakes). First run on YZ's PC: sw_selftest plate / shapes /
  assembly, then fix from its report and the log. Unconfirmed: SOLIDWORKS listing a per-user (HKCU) add-in at all
  (likely not, hence the macro and outside-exe routes), `.swb` macros running on his install, AddDimension2 taking model
  coordinates for the text position, obsolete calls kept for 2022 (FeatureFillet3, FeatureLinearPattern5, AddMate5,
  InsertProtrusionSwept4). Predictions: none for features that name existing SOLIDWORKS features (mirror / pattern of a
  tree feature), so those are not direction-checked. Coupler mates, contacts and reviews are OpenSketch-only. One
  SOLIDWORKS link per person (a second PC replaces the first). Equations are written for all configurations
  (per-configuration values are lost on a batch rollback). Commands can still arrive while SOLIDWORKS shows a modal
  dialog (only an open sketch is detected). SOLIDWORKS run as administrator ignores the per-user registration. Plain
  numbers in equations are in the document's unit (a note says so when it is not mm).
- SOLIDWORKS macros: nothing has been run in SOLIDWORKS yet; ask YZ for the log of the first run.
  Assembly-side API calls not confirmed: AddComponent5 + Transform2, AddMate5 (obsolete in 2022) with
  mark 1, GetCorresponding, GetBodies3, GetSelectedObjectsComponent4, DeSelect2, InsertAxis2,
  GetLastFeatureAdded, LoadFile4 for STEP, ModelDocExtension.SaveAs. Point refs (vertex, origin) and
  assembly datums other than the three planes are not exported (listed in the report). Revolves,
  shells, holes across the main direction go as STEP. The engine's stand-in fails two scenarios ("a
  relation moves the sketch", "relations and Fully Define Sketch move it") on parts with no Equal
  relation: its expectation is wrong (it only moves a sketch on an Equal relation); the export marks
  this as a known stand-in fault. To fix in the engine (cad-review-loop), not here.

- Persistent names are matched by geometry at each step (an on-face point on the old face or the tool),
  not taken from OpenCascade's operation history: a face that a later feature makes coincide with an old
  one inherits the old name, and `new:<k>` names (anything not recognised) can change. body_topology
  indices are list order and change when the body changes; pass `ref` (name + point), never the index.
- The browser stores names for picks on OK, but Edit Feature highlights picks by their stored point, which
  is stale after the part changes size (the feature itself follows the name).
- Equations: per part only (no assembly-level variables); the sketch Modify box does not create equations
  (use Tools > Equations); dimension references by name ("D1@Sketch1") inside expressions are not
  supported, only global variables.
- 15 shells and 1 draft in the action matrix fail in OpenCascade (side faces next to fillets, removing an
  already open top, a cone base); they now error instead of passing silently.
- Sketch DOF in inspect_design needs node on the server (Docker image: Debian nodejs 20, deployed to Fly
  2026-10-17; the devcontainer has it). Not yet called through the real Claude connector.
- batch runs on the server only (MCP). The in-app copilot still applies tools one at a time.
- Motion Review: checks solve each joint alone (others at rest); the app's sliders move one joint at a time
  from where the others are. Only hinge/limit mates with both limits are joints. Clash checks on 7 poses per
  joint (a clash shorter than ~1/6 of the travel can be missed); contacts on every pose in range. Contacts
  are whole-component distances (the nearest feature counts, not a named face). The share link loads
  three.js from the app's own vendor copy; published reviews are never removed automatically.
- Coupler: a function of the driver's position (no hysteresis, latch or spring return); angle measures are
  0-180 deg unsigned (choose angle refs so the travel does not cross 0 or 180); no gear / rack / screw /
  cam mates as such (a coupler with a ratio or table covers gear, rack and screw ratios).
- Mate references (plane / axis / point) are stored as geometry in part coordinates and re-matched to
  the nearest face after part edits; not topological. Mate picks: planar faces, cylindrical/conical
  faces, straight edges, the three assembly planes. No vertex or circular-edge picks yet.
- No tangent, width, symmetric, gear or slot mates; no sub-assemblies (STEP assemblies are flattened);
  no exploded views. Shift+Tab finds hidden components by bounding box, not exact shape.
- The upload fix is checked locally only; not yet confirmed through a real Codespaces tunnel. If a large file still fails there, the dialog now names the HTTP status.
- Feature recognition: bases only as extrudes along one direction or one revolve. Not yet recognised (they stay in
  the imported body): cuts and bosses in a second direction, drafted extrudes (cones and tapered walls, the
  Lavilock levers), turned bosses on a prismatic body, variable or B-spline fillets, chamfers made of irregular
  corner pieces, drill-point holes, holes crossing other holes, circular hole patterns, shells, mirrors. Fillets of
  one radius found in packs are merged back only when OpenCascade takes them in one go. A fillet OpenCascade will not
  build again on the rebuilt tree is left in the body (the inside rotor's 0.4 mm hole fillet on the first run). Large bodies are slow
  (defeaturing the 274-face Lavilock plate is minutes; the per-part limit is 120 s, then what is done is kept).
  Face-plane holes and cuts follow the face they were found on, by the stored normal and nearest face.
- STEP surfaces/wireframes are not imported (solids only). Section caps use one colour for every component.
- Sweep requires one closed profile and one connected sketch path; no guide curves or twist controls.
  Loft requires distinct ordered single contours, without inner contours or guide curves.
  Hole Wizard uses explicit flat-bottom dimensions, one position per feature; patterns can repeat it.
  Threads, fastener-standard presets and a multi-position hole sketch are not implemented.
- Not yet built (parts): rib, boundary features, splines, ellipses, text, wrap/intersect, Instant3D,
  configurations, drawings. Sweep / loft / hole are not in the action matrix or reference parts yet, and
  their faces get positional names (`<id>:face:<i>`) except sweep sides from the profile sketch.
- The AI path has been tested with fake and recorded clients only; not yet run against the live API.
  First live run to check: eager_input_streaming with fallbacks, that summarized thinking is
  accepted, and web search / fetch alongside the `server-side-fallback` beta (the fallback model must
  also take server tools). Web fetch cannot read JavaScript pages (McMaster-Carr product pages).

## Architecture direction (under evaluation)

Geometry may move from Python (server) to OpenCascade in the browser (WASM, likely replicad) so the
app runs as a plain web page with near-zero server cost. Before assemblies: a 2-3 day spike porting
extrude, cut, fillet and shell, compared against Python on a 30-feature part. Go if browser rebuilds
are within about 2x of Python and fillets do not fail more often; otherwise stay server-side.
The .osk JSON format stays the contract either way.

## Next phase

Feature recognition, next: drafted extrudes (taper), second-direction cuts and bosses (defeature a depression's
walls and floor, rebuild as a cut-extrude from that floor's plane), turned bosses and grooves as revolve features,
circular hole patterns and mirrors, the preview in assemblies, and running it on YZ's Lavilock O2S6 document
(69bc1fc107a3).

SolidCraft ideas a-g are done (see Current state). Still open from it: exact names from OpenCascade
history (BRepAlgoAPI Modified/Generated) instead of geometric matching; a replayable script export of the
timeline; a hostile-parameters fuzz test over every tool.

00. SOLIDWORKS add-in on YZ's work PC: install, connect, sw_selftest (three stages), fix from the report and log.
0. Run an exported macro in SOLIDWORKS 2022 (press demo first) and fix what the log shows; then
   revolves and cross holes as features where the engine allows.
1. Run the AI against the live API with an assembly prompt and tune the system prompt (mate
   reference habits, part datums) from what it gets wrong.
2. Assemblies: tangent / width / symmetric mates, vertex and circular-edge picks, rotate component
   drag, exploded view, sub-assemblies.
3. The browser-geometry spike (above): with mates now in the browser, part rebuilds are the only
   assembly work left on the server. If the spike passes, the AI and SOLIDWORKS macro export stay on
   a small server (API key, Python-only sldmacro engine); everything interactive runs in the page.
