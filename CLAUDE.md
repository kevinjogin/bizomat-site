# CLAUDE.md

## What this repo is

OpenSketch: a parametric CAD app whose interface and operation logic follow SOLIDWORKS, built on
build123d, with an AI copilot ("Cursor for hardware"). Python backend (FastAPI + build123d) rebuilds
the feature tree; the browser UI (plain ES modules + three.js, no build step) does sketching,
solving and all interaction.

## Rules

- After completing any phase or significant change, update this file to reflect the current state before committing.
- Match SOLIDWORKS: icon positions, CommandManager order, PropertyManager layout, feedback colours,
  mouse and keyboard behaviour. When in doubt, do what SOLIDWORKS 2024 does. Icons are original.
- The part document (docs/DOCUMENT.md) is the single format for UI, AI and files. Change the
  format there first, then geometry.py, solver.js, features.js and the AI system prompt in ai.py.
- Test before committing: `pytest -q` and `node --test tests/js/solver.test.mjs`; drive real UI
  flows with Playwright (Chromium is preinstalled in the cloud container) for UI changes.
- No emojis in UI text. Plain language, short sentences.

## Current state (2026-10-15)

Phase 1, part files, is done:

| Area | State |
|---|---|
| UI shell | Title bar with quick access, menus, command search; CommandManager tabs Features / Sketch / Evaluate / OpenSketch AI; FeatureManager tree with rollback bar, context toolbars and menus; PropertyManager; Heads-up toolbar; confirmation corner; triad; Task Pane; status bar. |
| Sketch | Line, centerline, rectangles, slot, circle, 3 arc types, polygon, point; inference and snapping; Smart Dimension with Modify box and driven prompt; relations and glyphs; drag; box select; trim; sketch fillet; convert, offset, mirror entities; live DOF solver with under/fully/over colours. |
| Features | Extrude boss/cut (blind, through all, up to next, mid plane, direction 2, draft), revolve boss/cut, fillet, chamfer, shell, mirror, linear and circular pattern, reference plane. Live previews; edit, suppress, rollback, delete, rename, undo/redo. |
| Evaluate / files | Mass properties with materials, measure, section view, check; save/open .osk, STEP/STL export, browser autosave. |
| AI | `ai.py` tool loop with Claude (`claude-opus-5-5`, server-side fallback "default"); proposal shown in purple, Accept/Reject. Needs ANTHROPIC_API_KEY. |
| Try it | GitHub Codespaces: `.devcontainer/` (Python 3.12 image, OpenCascade system libs, `setup.sh` installs `.[ai,dev]`, `start.sh` serves on port 8000 and the browser opens automatically). README badge links to it. Tested in the same base image: setup, start, pytest, part rebuild. |
| Tests | 7 pytest (regen, sketch-on-face tracking, previews, AI loop with fake client), 7 node solver tests. UI flows checked with Playwright: sketch + dimension + extrude, sketch on face + cut + fillet, revolve + sketch fillet + edit + undo, trim + rollback + save/open. |

## Known limits

- Edge/face references are matched by midpoint/center, not full topological naming.
- Not yet built: assemblies and mates (next phase), Hole Wizard, sweep, loft, draft feature, rib,
  splines, ellipses, text, Instant3D, equations, configurations, drawings.
- The AI path has been tested with a fake client only; not yet run against the live API.

## Architecture direction (under evaluation)

Geometry may move from Python (server) to OpenCascade in the browser (WASM, likely replicad) so the
app runs as a plain web page with near-zero server cost. Before assemblies: a 2-3 day spike porting
extrude, cut, fillet and shell, compared against Python on a 30-feature part. Go if browser rebuilds
are within about 2x of Python and fillets do not fail more often; otherwise stay server-side.
The .osk JSON format stays the contract either way.

## Next phase

Assemblies with SOLIDWORKS mates: assembly document format, insert components, Mate PropertyManager
(standard mates first), a mate solver, MateGroup in the tree, then interference detection.
