# OpenSketch part document (`.osk`)

A part is one JSON object. The FeatureManager tree is the `features` list, rebuilt in order by
`opensketch/geometry.py` (build123d). The same format is written by the UI, read by the AI copilot,
and saved to disk, so a part made by hand and a part made by the AI are the same thing.

```json
{
  "version": 1,
  "name": "Part1",
  "units": "mm",
  "features": [ ... ],
  "rollback": null,
  "material": { "name": "6061 Alloy", "density": 2.7e-6 },
  "appearance": "#c4cad2",
  "seq": 42
}
```

- `rollback`: index of the rollback bar (`null` = end of tree). Features at or after it are not built.
- `material.density` is in kg/mm^3.
- `seq` is the id counter used by the UI.

Every feature has `id` (unique), `type`, `name` (SOLIDWORKS style: Sketch1, Boss-Extrude1...),
and optionally `suppressed`, `hidden`, `shown`.

## EAGLE board import metadata

An imported EAGLE XML `.brd` is an ordinary editable part: layer 20 perimeter sketches,
board extrusion, and mechanical hole cuts. It may also carry a `pcb` object containing
`format: "eagle-xml"`, `source`, `eagle_version`, `coordinates`, `thickness`, `outline`,
`holes`, `components`, `packages`, and `limitations`. Geometry remains in `features`;
metadata does not silently create component solids or constrain later edits.

`thickness` records `value` (mm), `source`, and any available `layer_setup`, `copper_mm`
and `isolation_mm`. `holes` records EAGLE XY centres, drill diameter, and source.
`components` preserves the name, value, library/package identifiers, EAGLE XY position,
rotation, mirrored/spin flags, side and 3D board-plane position. `packages` preserves
2D package geometry and pad records as tagged attributes/children. EAGLE XY maps to
OpenSketch `[x, height, -y]`; component heights are not inferred from silkscreen.

The `limitations` list distinguishes exact board geometry from unmodelled components
and reports a default thickness when the file has no usable stackup.

## Conventions

Units are millimetres and degrees. Y is up, as in SOLIDWORKS.

| Plane | build123d plane | Sketch x | Sketch y | Normal |
|---|---|---|---|---|
| Front Plane | XY | +X | +Y | +Z |
| Top Plane | XZ | +X | -Z | +Y |
| Right Plane | YZ | -Z | +Y | +X |

A plane reference is one of:

- `{"ref": "Front Plane"}` (or Top / Right), or `{"ref": "<plane or sketch feature id>"}`
- a planar face: `{"type": "face", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}`.
  The origin is the part origin projected onto the face. On rebuild the face is found again
  (same normal, nearest face), so the sketch follows if an earlier depth changes. The stored origin
  is an attachment hint, not a fixed height. The rebuild reports the requested and resolved plane,
  and warns if reattachment moves it or no matching face exists.
- a fixed coordinate plane: `{"type": "fixed", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z]}`.
  It stays at the supplied origin even if nearby faces move. Use this for computed enclosure floor,
  pocket, or pin heights. A `plane` feature offset from a named plane is another fixed datum option.
  Existing explicit coordinate planes without a `type` retain this fixed behavior.

Rebuild statuses include `diagnostics`: requested/resolved planes for sketch and reference-plane
features; `tool_bbox` and `result_bbox` in part coordinates; and signed `volume_change_mm3` for solid
operations. Extrudes also report the actual tool `normal_range_mm` relative to the resolved sketch
plane and requested end/depth settings. A cut that removes no material or a merged boss that adds
no material raises a warning, even when the CAD operation succeeds. These bounds and volumes
describe the generated geometry; they do not assert a design's intended dimensions or clearances.
AI/MCP part reports separate `errors` and `warnings`: `rebuilt` means no rebuild errors; `clean`
means no rebuild errors or warnings. A successful rebuild can therefore have `rebuilt: true` and
`clean: false`. Both full rebuilds and streamed feature steps use the same diagnostics.
Assembly reports aggregate all part, mate, and component errors/warnings, including after inserting,
mating, or deleting a component. A successful individual operation does not clear existing warnings.

## Sketch

```json
{
  "id": "s1", "type": "sketch", "name": "Sketch1", "plane": {"ref": "Top Plane"},
  "entities": [
    {"id": "p1", "type": "point", "x": 0, "y": 0},
    {"id": "l1", "type": "line", "p1": "p1", "p2": "p2", "construction": false},
    {"id": "c1", "type": "circle", "center": "p3", "r": 5},
    {"id": "a1", "type": "arc", "center": "p4", "start": "p5", "end": "p6"}
  ],
  "constraints": [
    {"id": "k1", "type": "horizontal", "refs": ["l1"]},
    {"id": "k2", "type": "distance", "refs": ["l1"], "value": 40, "name": "D1", "label": [0, -8]}
  ]
}
```

- `origin` is the fixed sketch origin point and can be used in `refs`.
- Lines that share a point id are connected (SOLIDWORKS "Merge").
- Arcs run counter-clockwise from `start` to `end`.
- Construction geometry (centerlines) is ignored for profiles; a centerline is the usual revolve axis.
- `"ref": "edge"` marks hidden reference geometry: a fixed, construction copy of a model edge that lies in
  the sketch plane (with `"refKey"` naming the edge by its midpoint), plus its fixed endpoints. A point
  snapped onto a model edge is `coincident` (or `midpoint`) with it, which SOLIDWORKS shows as On Edge.
  References are never drawn, picked or used for profiles, and are dropped once nothing refers to them.
- Closed loops become regions; loops inside loops become holes (even/odd nesting).

Relations: `coincident` (point-point, point on line, point on circle/arc), `horizontal`, `vertical`
(a line, or two points), `parallel`, `perpendicular`, `collinear`, `equal` (lines or radii),
`tangent` (line-arc/circle or arc-arc), `concentric`, `midpoint` (point, line), `symmetric`
(point, point, centerline), `fix`.

Dimensions: `distance` (`refs` a line, two points, point-line or two parallel lines; `orient`
`aligned` / `horizontal` / `vertical`), `diameter`, `radius`, `angle` (two lines). `value` drives
the geometry unless `driven: true`. `label` is where the dimension text sits (sketch coordinates).

The solver (`static/js/sketch/solver.js`) treats every point as (x, y) and every circle radius as
unknowns, and reports degrees of freedom, per-entity defined state and over-defining relations.

## Features

| type | fields |
|---|---|
| `plane` | `base` (plane ref), `offset`, `flip` |
| `extrude` | `sketch`, `op` `boss`/`cut`, `end` `blind`/`through_all`/`midplane`/`up_to_next`, `depth`, `reverse`, `draft`, `draft_outward`, `dir2` `{end, depth}`, `merge`, `flip_side` |
| `revolve` | `sketch`, `axis` (line id in that sketch), `angle`, `op`, `end` `blind`/`midplane`, `reverse` |
| `fillet` | `radius`, `edges` |
| `chamfer` | `distance`, `mode` `angle_distance`/`distance_distance`, `angle`, `distance2`, `edges` |
| `shell` | `thickness`, `faces` (removed), `outward` |
| `mirror` | `plane` (plane ref), `features` (ids; empty = whole body) |
| `linear_pattern` | `features`, `direction` (`X`/`Y`/`Z` or `{"edge": ref}`), `count`, `spacing`, `reverse`, optional `direction2`, `count2`, `spacing2` |
| `circular_pattern` | `features`, `axis` (`X`/`Y`/`Z`), `count`, `angle`, `equal_spacing`, `step` |
| `draft` | `neutral_plane` (plane ref or planar face), `faces` (faces to draft), `angle` (deg, default 1), `reverse` (flip the pull direction). Neutral plane draft: a positive angle narrows the part along the neutral plane's normal. |
| `import` | `format` `"brep"`, `data` (BREP text, zlib-compressed, base64), `source` (file name), `label`. An imported body (SOLIDWORKS "Imported1"); later features build on it. |
| `standard` | `kind` (`socket_head_cap_screw`, `hex_head_screw`, `counter_sunk_screw`, `button_head_screw`, `set_screw`, `hex_nut`, `plain_washer`, `ball_bearing`), `size` (`M6-1`; bearings `M8-22-7`), `length` (screws). A Toolbox part made to size (bd_warehouse). Axis along the part Y axis, head above Y = 0, shank down -Y. |

Every feature type except `sketch`, `import` and `standard` is described once in the feature registry
(`opensketch/features/`): its fields, kinds, defaults and limits there are the authority for this table.
The registry drives the PropertyManager, the ribbon, the AI's `add_<type>` tools and help text, the
MCP tools and input checks.

Edge references are `{"mid": [x,y,z]}`, the point at the middle of the edge. Face references are
`{"center": [x,y,z], "normal": [x,y,z]}`. They are matched to the nearest edge or face on rebuild.
This is simple and works for most edits; it is not yet full topological naming.

# Assembly document

An assembly is also one JSON object, saved as `.osk`. It carries its parts inside it, so one file
holds the whole product. Parts are ordinary part documents (above); components are placed copies
of a part; mates position the components, as in SOLIDWORKS.

```json
{
  "version": 1,
  "type": "assembly",
  "name": "Assem1",
  "units": "mm",
  "parts": {
    "base": { "name": "Base", "features": [ ... ], "appearance": "#8a96a3", "material": {...} },
    "pin":  { "name": "Pin",  "features": [ ... ] }
  },
  "components": [
    {"id": "c1", "part": "base", "name": "Base<1>", "fixed": true, "position": [0, 0, 0], "rotation": [0, 0, 0]},
    {"id": "c2", "part": "pin",  "name": "Pin<1>", "position": [0, 40, 0], "rotation": [0, 0, 0]}
  ],
  "mates": [
    {"id": "m1", "name": "Concentric1", "type": "concentric",
     "refs": [{"component": "c1", "axis": {"point": [0, 0, 0], "dir": [0, 1, 0]}},
              {"component": "c2", "axis": {"point": [0, 0, 0], "dir": [0, 1, 0]}}]},
    {"id": "m2", "name": "Coincident1", "type": "coincident", "align": "anti",
     "refs": [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}},
              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]}
  ],
  "sequence": ["c1", "c2"],
  "seq": 3
}
```

A part document may carry `"type": "part"`; a document without `type` is a part.

## Parameters and equations

SOLIDWORKS Tools > Equations (`opensketch/params.py`). A part may have global variables, and any
number in a feature or any sketch dimension may be driven by an equation:

```json
{
  "parameters": [{"name": "length", "expression": "120", "unit": "mm", "comment": "80 to 200"},
                 {"name": "wall", "expression": "length / 40", "unit": "mm"}],
  "features": [
    {"id": "s1", "type": "sketch", "constraints": [
      {"id": "D1", "name": "D1", "type": "distance", "refs": ["l1"], "value": 120, "eq": "length"}]},
    {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 3, "eq": {"depth": "wall", "dir2.depth": "wall / 2"}}
  ]
}
```

- `parameters`: name (a letter or `_`, then letters, digits, `_`; not a function or unit name), expression
  (a number or an equation of other variables), unit (`mm`, `deg` or empty), comment.
- `eq` on a feature: field path to expression; a nested field uses a dot (`dir2.depth`).
- `eq` on a sketch dimension (`distance`, `diameter`, `radius`, `angle`; not `driven`).
- Expressions: numbers, `+ - * / ^ %`, parentheses, variables, `pi`, `abs min max sqrt round floor ceil`,
  `sin cos tan asin acos atan atan2` in degrees, unit suffixes `mm cm m in deg rad` (lengths in mm, angles
  in degrees). Nothing else is evaluated.
- Driven fields keep their current number, so every reader sees a plain document. A rebuild first
  recomputes the numbers; a sketch whose dimension changed is re-solved with the browser's solver
  (`solver.js`, run by node on the server). Registry limits apply: an `int` field must come out whole,
  `min`/`max` hold. A failing equation turns its feature red with the reason.

## Components

- `part`: key into `parts`. Several components can use the same part (instances `<1>`, `<2>`).
- `position` (mm) and `rotation` (degrees) place the part's origin in the assembly. The rotation is
  applied about the assembly X axis, then Y, then Z (fixed axes): R = Rz * Ry * Rx.
- `fixed`: the component does not move (SOLIDWORKS "(f)"). Only components with `fixed: true` are fixed; with
  none fixed, every component floats (the solver still moves them as little as possible). New assemblies,
  STEP imports and the AI fix the first component.
- `hidden`, `suppressed` as for features. A suppressed component and its mates are ignored.
- The mate solver writes the solved `position` and `rotation` back, so the file always shows where
  every component sits. Positions given by hand or by the AI are the starting guess; unmated
  directions keep them.

## Mate references

Every reference names a `component` and one geometric entity, in that component's **part**
coordinates (the coordinates used while modelling the part):

| entity | form | from a face pick |
|---|---|---|
| plane | `"plane": {"point": [x,y,z], "normal": [x,y,z]}` | planar face: center and outward normal |
| axis | `"axis": {"point": [x,y,z], "dir": [x,y,z]}` | cylindrical or conical face: its axis |
| point | `"point": [x,y,z]` | vertex or sketch point |
| named | `"ref": "Front Plane" / "Top Plane" / "Right Plane" / "Origin" / "X axis" / "Y axis" / "Z axis"` | the part's own reference geometry |

A reference without `component` (for example `{"ref": "Top Plane"}`) is the assembly's own reference
geometry, which is fixed.

When a part changes, plane and axis references follow their face: on rebuild each one is matched to
the nearest face of the rebuilt part with the same direction (within 20% of the part size) and the
stored point is updated. Like edge and face references in parts, this is geometric matching, not
full topological naming.

## Mates

| type | references | meaning |
|---|---|---|
| `coincident` | plane-plane, plane-point, point-point, axis-axis, axis-plane, axis-point | entities lie on each other. Plane-plane uses `align`. |
| `concentric` | axis-axis | axes collinear |
| `parallel` | plane or axis, plane or axis | directions parallel (`align` optional) |
| `perpendicular` | plane or axis, plane or axis | directions perpendicular |
| `distance` | plane-plane, plane-point, point-point, axis-axis | `value` mm apart; plane-plane also parallel |
| `angle` | plane or axis, plane or axis | `value` degrees between directions |
| `lock` | any two references on two components | the second component keeps its current pose relative to the first; the pose is stored in `pose` |
| `hinge` | `refs`: two axes; optional `planes`: two planes (coincident, stops sliding); optional `angle_refs`: two planes or axes with `angle_min` / `angle_max` (degrees) | SOLIDWORKS Hinge mechanical mate: one rotation left, optionally limited |
| `limit_distance` | plane-plane (also kept parallel), or point-point | distance between `min` and `max` mm |
| `limit_angle` | plane or axis, plane or axis | angle between `min` and `max` degrees |

- `align`: `"anti"` (normals face each other, SOLIDWORKS "Anti-Aligned", the default for touching
  faces), `"aligned"`, or `"auto"` (whichever is closer when the mate is solved; the default).
- `flip`: for `distance`, measure to the other side.
- `suppressed`: the mate is ignored.

The solver is a damped least-squares (Levenberg-Marquardt) solve over the six degrees of freedom of
every free component. It moves components as little as possible. Limits only act when exceeded.

Dragging: `/api/regen` takes `drag` = `{"component", "point" (part coordinates), "target" (assembly
coordinates)}`. The solver first pulls that point toward the target softly with every mate in place,
then makes every mate exact again. So a hinged lid swings, a slider slides, a linkage follows. Each mate reports `ok` or `error`
(cannot be satisfied together with the others, like an over-defining mate in SOLIDWORKS).

## Sequence

`sequence` lists component ids in the order they were assembled (insertion order if absent).
The Motion Study tab replays this order: each component flies in from an exploded position and
settles onto its mates. The AI fills it as it assembles.

# Import

`POST /api/import` with a STEP file returns a document. One solid: a part with an `import` feature.
Several solids: an assembly with one part per distinct shape (same volume, area, face and edge count
and size are taken as the same part, so instances share it) and one component per solid at its STEP
position, the first one fixed, no mates (as SOLIDWORKS does with STEP). SOLIDWORKS files (.sldprt,
.sldasm) are refused with a message to save them as STEP first: the format is closed.

The AI never receives the BREP data: it gets the import feature with `data` omitted and a `summary`
(bounding box, volume, planar faces, cylinders). When it echoes the feature back, the data is restored
by feature id.
