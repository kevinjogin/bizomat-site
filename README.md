# OpenSketch

A parametric CAD app that works the way SOLIDWORKS works, built on
[build123d](https://github.com/gumyr/build123d) (OpenCascade), with an AI copilot that writes
real, editable features into the same tree you edit by hand. Think "Cursor for hardware".

![The AI assembling a hand press, live](docs/img/live-build.png)

Version 0.3 adds **STEP import** (parts and assemblies, then keep editing by hand or with the AI),
**mates that move like SOLIDWORKS** (drag a hinged lid open, Hinge and limit mates), a **Toolbox** of
standard screws, nuts, washers and bearings, **Tab / Shift+Tab** hide and show, and a **Section View**
with a draggable arrow and filled cut faces.

Version 0.2 added **assemblies** (components, SOLIDWORKS-style mates, a mate solver, interference
detection) and an AI that **builds in front of you**: each part grows feature by feature while
Claude writes it, then the components fly in and settle onto their mates.

No API key? Open the AI pane (Ctrl+L) and click **Watch a demo** to see a recorded session play
through the same live view.

## Try it in the browser

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/yuanzhengyang98/opensketch?quickstart=1)

Click the badge, then **Create codespace**. GitHub sets up a cloud machine and OpenSketch opens in
a new browser tab. The first launch takes about 3 to 5 minutes; later launches take seconds. If the
tab does not open, go to the **Ports** tab and click the globe next to port 8000.

For the AI copilot, add `ANTHROPIC_API_KEY` as a Codespaces secret
(GitHub > Settings > Codespaces > Secrets) before you create the codespace.

Stop the codespace when you are done (it also stops itself after 30 idle minutes).

## Run it locally

```bash
pip install -e .            # build123d, fastapi, uvicorn
pip install -e ".[ai]"      # optional: the AI copilot (anthropic SDK)
export ANTHROPIC_API_KEY=... # optional
python -m opensketch         # opens http://127.0.0.1:8000
OPENSKETCH_AI_DEMO=1 python -m opensketch   # every AI request plays the recorded demo
```

## What works

The layout and the click-flow follow SOLIDWORKS 2024: CommandManager tabs (Features, Sketch,
Evaluate, add-in tab), FeatureManager design tree with rollback bar, PropertyManager with green
check / red X and pink selection boxes, Heads-up View toolbar, confirmation corner, reference triad,
Task Pane on the right, status bar with Under/Fully/Over Defined and "Editing Sketch1".

**Sketch**
- Sketch on Front / Top / Right, on reference planes, or on any planar face (Normal To on entry).
- Line (click-click chains, click-drag), Centerline, Corner and Center Rectangle, Straight Slot,
  Circle, Centerpoint / 3 Point / Tangent Arc, Polygon, Point.
- Inference while sketching: endpoint merge, point on curve, midpoint, horizontal / vertical
  relations, dotted alignment guides, cursor glyphs and live length/radius readouts.
- Smart Dimension: lines (aligned / horizontal / vertical by cursor position), point-point,
  point-line, parallel lines, angle, diameter, radius. Modify box on placement and on double-click.
  Over-defining dimensions ask "Make this dimension driven?".
- Relations: Add Relations list filtered by selection (SOLIDWORKS rules), relation glyphs,
  Display/Delete Relations, drag-to-solve, box select (window / crossing).
- Blue = under defined, black = fully defined, red = over defined, from a live 2D solver with
  degrees-of-freedom and redundancy analysis.
- Trim (to closest), Sketch Fillet (keeps a virtual sharp), Convert Entities, Offset Entities,
  Mirror Entities, Repair Sketch.

**Features**
- Extruded Boss/Base and Extruded Cut: Blind, Through All, Up To Next, Mid Plane, Direction 2,
  draft, flip side to cut, merge result. Start from a sketch or pick a plane inside the command.
- Revolved Boss/Base and Revolved Cut (auto-picks the only centerline).
- Fillet, Chamfer (angle-distance, distance-distance), Shell, Mirror, Linear Pattern,
  Circular Pattern, Reference Plane.
- Live yellow previews computed by build123d; edit feature, edit sketch, suppress, rollback,
  rename (F2), delete with dependants, undo/redo for every step.

**Evaluate and files**
- Mass Properties (with material), Measure, Section View, Check (What's Wrong).
- Save / Open `.osk` (JSON), export STEP and STL, autosave in the browser.

**Assemblies** (File > New > Assembly, or ask the AI for a multi-part product)

![Hand press assembly](docs/img/assembly.png)

- One `.osk` file holds the assembly and its parts ([format](docs/DOCUMENT.md#assembly-document)).
- Assembly CommandManager: Insert Components (parts in the file, Browse for a part file, or New
  Part), Mate, Move Component, Fix / Float, Hide/Show, Open Part, Interference Detection,
  Assembly Playback.
- Standard mates: Coincident, Parallel, Perpendicular, Concentric, Lock, Distance, Angle, with
  Aligned / Anti-Aligned. The Mate PropertyManager previews live and stays open for the next mate.
- Mate solver (damped least squares over each free component's six degrees of freedom) moves
  components as little as possible. The tree shows (f) fixed and (-) under defined, as SOLIDWORKS
  does; mates that cannot be satisfied turn red.
- Drag an under-defined component with the left mouse button: the mates keep holding, so a platen
  slides along its columns.
- Open Part edits a component's part in place; Return to Assembly brings the change back as one
  undo step, and mates follow the faces that moved.
- Motion Study 1 (bottom tab) replays the assembly order: each component flies in and settles.
- Interference Detection lists overlapping pairs with their volume and shows the clash in red.
- STEP / STL export of the whole assembly, mass properties with each part's own material.

**Import and Toolbox**
- Open or drop a STEP file. One body becomes a part with an `Imported1` feature you can keep adding
  cuts, fillets and shells to. Several bodies become an assembly, identical bodies sharing one part.
  OpenSketch AI > **Rebuild as Features** turns an imported body into an editable feature tree and
  checks the volume against the import; **Add Mates** mates an imported assembly from its geometry.
- SOLIDWORKS files (.sldprt, .sldasm) are a closed format: save them as STEP in SOLIDWORKS first.
- Toolbox (Design Library pane, or Assembly > Toolbox): ISO screws, nuts, washers and ball bearings,
  made to size. The AI uses it too, and for bought parts it gives you the McMaster-Carr number to
  download; drop the STEP on its card and it replaces the placeholder.

**Motion and viewing**
- Drag any component by any point: it follows the mouse within its mates, so a hinge turns and a
  slider slides. Hinge mate (Mechanical Mates), Limit Distance and Limit Angle (Advanced Mates).
- Tab hides the component under the cursor, Shift+Tab shows hidden ones there.
- Section View: Front / Top / Right or a picked face, offset slider, X / Y rotation, a blue arrow to
  drag in the graphics area, filled cut faces. Works in parts and assemblies.

![Section View on a hinged box](docs/img/section.png)

**AI copilot** (Task Pane, or Ctrl+L)
- Describe a part, a change, or a whole product. For one piece, Claude writes features in the
  [document format](docs/DOCUMENT.md). For a product with several pieces, Claude builds an assembly
  the way a SOLIDWORKS user would: create each part, insert components, add mates, check
  interference. Rebuild and solver results go back to Claude so it can fix its own errors.
- Live build view: the reply streams in (thinking summary, one sentence per step, a row per tool
  call with features ticking off). In the graphics area each part is built on a shelf beside the
  assembly: the sketch appears in blue, then the new material grows out of the sketch plane. Each
  inserted component flies from the shelf to its place, and each mate slides the components into
  position. You can rotate and zoom while it works; Stop cancels.
- The result shows in purple until you Accept or Reject it. Everything stays editable: sketches come
  with relations and dimensions, components with real mates. Quick actions: Explain Model / Assembly,
  Fix Errors, Fix Mates, Fully Define.

## Mouse and keys

Middle drag rotates, Ctrl + middle pans, Shift + middle zooms, wheel zooms at the cursor
(Alt + left drag rotates on a trackpad). Space opens View Orientation, Ctrl+1..8 standard views,
F zoom to fit, arrows rotate, S opens the shortcut bar, Enter repeats the last command,
Ctrl+B rebuilds, Ctrl+Z / Ctrl+Y undo / redo. Help > Keyboard Shortcuts lists them all.

## Architecture

```
opensketch/
  geometry.py        feature-tree regen with build123d, tessellation, mass props, export
  assembly.py        assemblies: part cache, mate solver, interference, export
  server.py          FastAPI: /api/regen (parts and assemblies), /api/mass, /api/interference,
                     /api/export, /api/ai/stream (newline-delimited JSON events)
  ai.py              streaming Claude tool loop: propose_features, create_part, insert_component,
                     add_mate, delete_items, check_interference; rebuilds each feature as it arrives
  demo.py            recorded sessions (hand press, L bracket) for "Watch a demo" and tests
  importer.py        STEP import (parts, assemblies), embedded BREP bodies, Toolbox parts (bd_warehouse)
  static/
    index.html, css/app.css
    js/app.js        controller: modes, selection, commands, PropertyManager flow, undo
    js/asm.js        assembly mode: tree, Mate PM, drag, Open Part, playback, interference
    js/live.js       live build view: shelf, sketch-then-grow, fly-in, mate slides, pacing
    js/section.js    Section View: plane, offset, rotations, drag arrow (caps drawn in viewer.js)
    js/toolbox.js    Toolbox pane and editing Toolbox parts
    js/viewer.js     three.js graphics area (orthographic, SOLIDWORKS mouse, components, tweens)
    js/sketch/       solver.js (constraint solver), sketcher.js (tools), draw.js, geom2d.js
    js/ui/           ribbon.js, tree.js, pm.js, dialogs.js, taskpane.js
    js/features.js   PropertyManager definitions for each feature
    js/commands.js   command registry and CommandManager layout
```

The browser solves sketches (instant dragging); the server rebuilds solids. The part is plain JSON,
so the UI, the AI and files share one format.

## Tests

```bash
pytest -q                                  # regen, previews, mate solver, streaming AI (fake client), demos
node --test tests/js/solver.test.mjs       # sketch solver
```

## Roadmap

1. SOLIDWORKS macro export of parts and mated assemblies (next, v0.4).
2. Assemblies: tangent, width and symmetric mates, gear and slot mates, sub-assemblies, exploded
   views, mate references picked from vertices and circular edges.
3. Remaining part features: Hole Wizard, Swept / Lofted, Draft, Rib, Instant3D drag handles,
   splines, sketch text, equations and global variables, configurations.
4. Stronger topological naming for fillet/chamfer edge references.
5. Drawings.

SOLIDWORKS is a trademark of Dassault Systemes. OpenSketch is not affiliated with it; the icons
are original drawings.
