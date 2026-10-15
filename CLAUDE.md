# CLAUDE.md

## What this repo is

OpenSketch: a parametric CAD app whose interface and operation logic follow SOLIDWORKS, built on
build123d, with an AI copilot ("Cursor for hardware"). Python backend (FastAPI + build123d) rebuilds
the feature tree and solves assembly mates; the browser UI (plain ES modules + three.js, no build
step) does sketching, sketch solving and all interaction.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Match SOLIDWORKS: icon positions, CommandManager order, PropertyManager layout, feedback colours,
  mouse and keyboard behaviour. When in doubt, do what SOLIDWORKS 2024 does. Icons are original.
- The part and assembly documents (docs/DOCUMENT.md) are the single format for UI, AI and files.
  Change the format there first, then geometry.py / assembly.py, solver.js, features.js / asm.js and
  the AI system prompt in ai.py.
- Test before committing: `pytest -q` and `node --test tests/js/solver.test.mjs`; drive real UI
  flows with Playwright (Chromium is preinstalled in the cloud container) for UI changes. Without an
  API key, use the demo sessions (`demo: true` / `"part"` on /api/ai/stream, or
  `OPENSKETCH_AI_DEMO=1`) to exercise the live build path end to end.
- Any new AI tool must stream: emit events from `Session` in ai.py and play them in live.js.
- No emojis in UI text. Plain language, short sentences.

## Current state (2026-10-16, v0.3)

Phase 1 (part files), phase 2 (assemblies + live AI build) and phase 3 (import, motion, Toolbox, section) are done.

| Area | State |
|---|---|
| UI shell | Title bar with quick access, menus, command search; CommandManager tabs Features / Sketch / Evaluate / OpenSketch AI for parts, Assembly / Evaluate / OpenSketch AI for assemblies; FeatureManager tree with rollback bar, context toolbars and menus; PropertyManager; Heads-up toolbar; confirmation corner; triad; Task Pane; status bar; New dialog (Part / Assembly). |
| Sketch | Line, centerline, rectangles, slot, circle, 3 arc types, polygon, point; inference and snapping; Smart Dimension with Modify box and driven prompt; relations and glyphs; drag; box select; trim; sketch fillet; convert, offset, mirror entities; live DOF solver with under/fully/over colours. |
| Features | Extrude boss/cut (blind, through all, up to next, mid plane, direction 2, draft), revolve boss/cut, fillet, chamfer, shell, mirror, linear and circular pattern, reference plane. Live previews; edit, suppress, rollback, delete, rename, undo/redo. |
| Assemblies | `assembly.py`: parts embedded in one .osk; part rebuild cache keyed by content; components with position/rotation (R = Rz Ry Rx); mates coincident, parallel, perpendicular, concentric, distance, angle, lock with align anti/aligned/auto; Levenberg-Marquardt solver over 6 DOF per free component (minimum motion), per-mate ok/error, per-component fixed/under/full and remaining DOF (SVD null space); plane/axis refs follow their face after part edits; interference (pairwise boolean common); STEP/STL export; mass. UI (`asm.js`): tree with (f)/(-) prefixes and Mates folder, Insert Components (parts in file, Browse, New Part), Mate PM with live preview that stays open, left-drag of under-defined components with throttled re-solve, Fix/Float, Hide/Show, Suppress, Delete, Rename, Open Part / Return to Assembly (document stack; the edit is one undo step), Interference Detection PM, Motion Study tab = assembly playback in `sequence` order. |
| AI | `ai.py` streams NDJSON events (`/api/ai/stream`): summarized thinking, text, tool_start, build_start/build_step (each feature rebuilt by `LiveBuilder` as soon as `FeatureScanner` sees it complete in the streaming tool JSON; tools use `eager_input_streaming`), assembly (solved result per insert/mate, meshes sent once per part key), interference, tool_done, done. Tools: propose_features, create_part, insert_component, add_mate, delete_items, check_interference. A part doc becomes an assembly when the AI creates parts. Model `claude-opus-5-5`, adaptive thinking with display summarized (retried without if rejected), server-side fallback "default". Old `/api/ai` kept as a non-streaming wrapper. |
| Live view | `live.js`: parts built on a shelf beside the assembly (sketch in blue, then new material grows out of the sketch plane via clipping planes), components fly from the shelf to the solved pose, mates tween the components and flash them, interference shown in red; queue paced with speed-up on backlog; camera follows unless the user navigated in the last 4 s. Chat shows thinking, sentences and an activity row per tool. Stop aborts. Demo button plays `demo.py` (hand press: 5 parts, 8 components, 16 mates; L bracket part). |
| Import (v0.3) | `importer.py`: STEP via `/api/import` (client sends base64). One solid: part with an `import` feature (BREP zlib+base64 in the doc, decoded with an LRU cache) that later features build on. Several solids: assembly, parts deduplicated by shape signature, components at STEP positions, first fixed, no mates. .sldprt/.sldasm refused with a "save as STEP" message (closed format; user chose STEP for now). Open dialog, drag-drop on the graphics area (open, or insert into an assembly), Insert Components > Browse (STEP assemblies are flattened in). AI sees imports via `model_view` (data omitted, summary given) and `restore_blobs` puts data back by id. Quick actions: Rebuild as Features (report compares with the import by boolean volume), Add Mates (`find_mate_candidates` = `assembly.mate_candidates`: coaxial cylinders, opposite coplanar overlapping faces). |
| Toolbox (v0.3) | `standard` feature from bd_warehouse (ISO 4762/4014/10642/7380/4026 screws, ISO 4032 nut, ISO 7089 washer, SKT ball bearings), turned so the axis is Y with the head above Y=0. Design Library pane, Assembly > Toolbox, Edit Feature changes size/length. AI tools `standard_part` and `request_part_file` (McMaster number + link; user drops the STEP on the chat card, `replacePartFromFile` swaps the placeholder part). No automated McMaster download (login + terms). |
| Motion and view (v0.3) | Drag by grab point: `/api/regen` with `drag` adds a soft goal residual, then a second solve without it makes mates exact (hinge turns, slider slides, linkages follow), ~100 ms per solve on the press, client throttled to 60 ms, one undo step on release. `hinge` mate (concentric + optional coincident + optional angle limits) with its own PM (Mechanical Mates), `limit_distance` / `limit_angle` (Advanced Mates). Tab hides the component under the cursor (part: the body), Shift+Tab shows the nearest hidden component whose box the cursor ray hits. Section View (`section.js`): Front/Top/Right or picked face, offset slider + number, X/Y rotation, flip, drag arrow in the graphics area; stencil-capped cut faces in `viewer.rebuildCaps` (stencil meshes sit beside each face so they follow components). |
| Evaluate / files | Mass properties with materials, measure, section view, check; save/open .osk (part or assembly; saving while editing a part from an assembly saves the assembly), STEP/STL export, browser autosave. |
| Try it | GitHub Codespaces: `.devcontainer/` (Python 3.12 image, OpenCascade system libs, `setup.sh` installs `.[ai,dev]`, `start.sh` serves on port 8000 and the browser opens automatically). README badge links to it. |
| Tests | 29 pytest (adds STEP part/assembly import, SLDPRT message, Toolbox, hinge drag, hinge angle limit, slider + limit distance, mate candidates, AI rebuild-as-features compare, blob restore, Toolbox + bought-part tools). Playwright v0.3: STEP part, SLDPRT message, STEP assembly, hinge drag by mouse, Tab / Shift+Tab, section arrow drag with caps, Toolbox insert, Hinge PM, bought-part card replace; v0.2 flows re-run. Earlier: 18 pytest (regen, sketch-on-face, previews, AI loop, mate solver incl. conflicts/lock/DOF/face following, interference, export, streaming AI with chunked tool JSON, demo press and bracket), 7 node solver tests. Playwright flows checked: demo press live build to accept, part demo live build, press over an existing part (conversion) and reject, load assembly, click-select, suppress mate + drag platen along columns, Mate PM distance mate, interference, Open Part edit + return + undo, Motion Study, New Assembly + New Part, part edit/undo/sketch regression. |

## Known limits

- Edge/face references are matched by midpoint/center, not full topological naming.
- Mate references (plane / axis / point) are stored as geometry in part coordinates and re-matched to
  the nearest face after part edits; not topological. Mate picks: planar faces, cylindrical/conical
  faces, straight edges, the three assembly planes. No vertex or circular-edge picks yet.
- No tangent, width, symmetric, gear or slot mates; no sub-assemblies (STEP assemblies are flattened);
  no exploded views. Shift+Tab finds hidden components by bounding box, not exact shape.
- Imported bodies have no history; Rebuild as Features depends on the AI. STEP surfaces/wireframes
  are not imported (solids only). Section caps use one colour for every component.
- Not yet built (parts): Hole Wizard, sweep, loft, draft feature, rib, splines, ellipses, text,
  Instant3D, equations, configurations, drawings.
- The AI path has been tested with fake and recorded clients only; not yet run against the live API.
  First live run to check: eager_input_streaming with fallbacks, and that summarized thinking is
  accepted.

## Architecture direction (under evaluation)

Geometry may move from Python (server) to OpenCascade in the browser (WASM, likely replicad) so the
app runs as a plain web page with near-zero server cost. Before assemblies: a 2-3 day spike porting
extrude, cut, fillet and shell, compared against Python on a 30-feature part. Go if browser rebuilds
are within about 2x of Python and fillets do not fail more often; otherwise stay server-side.
The .osk JSON format stays the contract either way.

## Next phase

0. v0.4: SOLIDWORKS macro export via the sldmacro engine (cad-toolkit skill): translate OpenSketch
   features to sldmacro recipes, run emit + verify on the server, add an assembly step (save parts,
   insert components, add mates incl. hinge and limits, measure and log each mate). Engine limits:
   one-direction prismatic features only (no revolve, shell, pattern, mirror); nothing confirmed in
   SOLIDWORKS until YZ sends a log back.
1. Run the AI against the live API with an assembly prompt and tune the system prompt (mate
   reference habits, part datums) from what it gets wrong.
2. Assemblies: tangent / width / symmetric mates, vertex and circular-edge picks, rotate component
   drag, exploded view, sub-assemblies.
3. The browser-geometry spike (above) still applies; the assembly solver is pure numpy and would
   port to JS easily.
