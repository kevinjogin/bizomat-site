# OpenSketch part document (`.osk`)

> Since 2026-10-20 OpenSketch is the connector to SOLIDWORKS: the AI writes features in this format to the
> sw_ tools, which check them with the kernel and build them in SOLIDWORKS. Parts about the browser UI, the
> in-app AI, EAGLE boards, reviews and macro export describe the archived app (branch archive/opensketch-app).

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
  A part inside an assembly builds to its bar there too (as in SOLIDWORKS); /api/regen marks it with
  `parts[pid].rolled_back` {id, name} and assembly STEP/STL exports refuse until it is rolled to the end.
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
- a planar face: `{"type": "face", "origin": [x,y,z], "normal": [x,y,z], "xdir": [x,y,z], "at": [x,y,z]}`.
  The origin is the part origin projected onto the face. `at` (optional) is a point on the picked face
  (the browser stores one; body_topology gives one as a face's `point`). On rebuild the face is found again
  among the planar faces with the same normal: the one holding `at` (nearest along the normal), else one
  at the stored height, else the nearest along the normal. So the sketch follows if an earlier depth
  changes, and a face away from the origin is not mistaken for the face below it that covers the origin.
  The stored origin is an attachment hint, not a fixed height. The rebuild reports the requested and
  resolved plane, and warns if reattachment moves it or no matching face exists.
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
- Closed loops become regions; loops inside loops become holes (even/odd nesting). Loops that cross or
  touch join into the outline of everything they enclose (two overlapping circles make one figure-eight, an
  overlapping pair of holes one hole), and a line from edge to edge of a region (T-junctions) keeps the
  whole region. A curve with a free end is an open contour: an error that names the free end.

Relations: `coincident` (point-point, point on line, point on circle/arc), `horizontal`, `vertical`
(a line, or two points), `parallel`, `perpendicular`, `collinear`, `equal` (lines or radii),
`tangent` (line-arc/circle or arc-arc), `concentric`, `midpoint` (point, line), `symmetric`
(point, point, centerline), `fix`.

Dimensions: `distance` (`refs` a line, two points, point-line or two parallel lines; `orient`
`aligned` / `horizontal` / `vertical`), `diameter`, `radius`, `angle` (two lines). `value` drives
the geometry unless `driven: true`. `label` is where the dimension text sits (sketch coordinates).
An `angle` is measured between the lines' directions (`p1` to `p2`), 0 to 180 degrees; with
`supplement: true` it is 180 minus that (the other side of the corner). A value can be set across 90
degrees. An angle without `supplement` gets it from the geometry the first time it is solved (whichever
side its value is nearer), and keeps it.

The solver (`static/js/sketch/solver.js`) treats every point as (x, y) and every circle radius as
unknowns, and reports degrees of freedom, per-entity defined state and over-defining relations.
The browser solves a sketch when it is opened; a rebuild uses the stored points as they are. So points
must already satisfy the dimensions: a sketch whose stored points miss a dimension by more than 0.001 mm
(or 0.001 deg), or has an arc whose end is off its circle, rebuilds with a `sketch_not_solved` warning
that names them.

## Features

| type | fields |
|---|---|
| `plane` | `base` (plane ref), `offset`, `flip` |
| `extrude` | `sketch`, `op` `boss`/`cut`, `end` `blind`/`through_all`/`midplane`/`up_to_next`, `depth`, `reverse`, `draft`, `draft_outward`, `dir2` `{end, depth}`, `merge`, `flip_side` |
| `revolve` | `sketch`, `axis` (line id in that sketch), `angle`, `op`, `end` `blind`/`midplane`, `reverse` |
| `sweep` | `sketch` (one closed profile), `path` (a different sketch with one connected path), `op` `boss`/`cut`, `merge` |
| `loft` | `profiles` (at least two different sketch ids, in section order; one closed contour each, without holes), `ruled`, `op` `boss`/`cut`, `merge` |
| `hole` | `plane` (plane ref), `x`, `y` (position in that plane), `diameter`, `end` `blind`/`through_all`, `depth`, `reverse`, `style` `simple`/`counterbore`/`countersink`, `bore_diameter`, `bore_depth`, `sink_diameter`, `sink_angle` (included angle, degrees) |
| `fillet` | `radius`, `edges` |
| `chamfer` | `distance`, `mode` `angle_distance`/`distance_distance`, `angle`, `distance2`, `edges` |
| `shell` | `thickness`, `faces` (removed), `outward` |
| `mirror` | `plane` (plane ref), `features` (ids; empty = whole body) |
| `linear_pattern` | `features`, `direction` (`X`/`Y`/`Z` or `{"edge": ref}`), `count`, `spacing`, `reverse`, optional `direction2`, `count2`, `spacing2` |
| `circular_pattern` | `features`, `axis` (`X`/`Y`/`Z` through the part origin, or `{"origin": [x,y,z], "dir": [x,y,z]}`; origin defaults to the part origin), `count`, `angle`, `equal_spacing`, `step` |
| `draft` | `neutral_plane` (plane ref or planar face), `faces` (faces to draft), `angle` (deg, default 1), `reverse` (flip the pull direction). Neutral plane draft: a positive angle narrows the part along the neutral plane's normal. |
| `import` | `format` `"brep"`, `data` (BREP text, zlib-compressed, base64), `source` (file name), `label`. An imported body (SOLIDWORKS "Imported1"); later features build on it. |
| `standard` | `kind` (`socket_head_cap_screw`, `hex_head_screw`, `counter_sunk_screw`, `button_head_screw`, `set_screw`, `hex_nut`, `plain_washer`, `ball_bearing`), `size` (`M6-1`; bearings `M8-22-7`), `length` (screws). A Toolbox part made to size (bd_warehouse). Axis along the part Y axis, head above Y = 0, shank down -Y. |

Every feature type except `sketch`, `import` and `standard` is described once in the feature registry
(`opensketch/features/`): its fields, kinds, defaults and limits there are the authority for this table.
The registry drives the PropertyManager, the ribbon, the AI's `add_<type>` tools and help text, the
MCP tools and input checks. A field's `default` is what new features are written with, always explicitly:
the PropertyManager prefills it, `add_<type>` fills it, and new features in `propose_features` /
`create_part` get every left-out default written in (a linear pattern with `direction2` also gets `count2` 2
and `spacing2` = `spacing`; a chamfer with `distance2` but no `mode` gets `distance_distance`). A field left
out of a document builds as it always has, so saved files never change shape: the registry's `omitted`
value where that differs from `default` (plane `offset` 0, fillet `radius` 1, chamfer `mode`
`distance_distance`, i.e. equal distances unless `distance2` is given, linear pattern `count` 2, `spacing`
10, `count2` 1, `spacing2` 10), else the `default`. A pattern makes at most 2000 instances.

Edge references are `{"mid": [x,y,z]}`, the point at the middle of the edge. Face references are
`{"center": [x,y,z], "normal": [x,y,z]}`. They are matched to the nearest edge or face on rebuild.
This is simple and works for most edits; it is not yet full topological naming.

Sweep uses all non-construction edges of its path sketch. Loft section order is significant;
guide curves and inner contours are not supported. Hole Wizard creates a dimensioned, flat-bottom
hole, counterbore or countersink at a plane coordinate. Hole depth follows the plane normal, or its
opposite when `reverse` is true. Through-all is directional. These are explicit dimensions, not
a fastener-standard or thread database. Hole features can be mirrored and patterned. The new
features use STEP fallback in SOLIDWORKS macro export.

Exports reject active rebuild errors rather than writing the last successfully rebuilt solid.
Suppressed and rolled-back features are intentionally excluded, as in the viewport.

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

## Face and edge references

Fillet / chamfer `edges`, shell / draft `faces` and pattern `direction` edges are references:

```json
{"name": "e1:end|e1:side:s1L1", "mid": [80, 30, 10]}
{"name": "e1:end", "center": [40, 30, 10], "normal": [0, 0, 1]}
```

`name` is the persistent name (`opensketch/naming.py`): a face is named after how it was made
(`<feature>:side:<sketch curve>`, `:start`, `:end`, `:end2`, `<seed face>@<pattern>#<copy>`,
`<fillet>:blend:<edge>`, `<chamfer>:bevel:<edge>`, `<shell>:inner:<face>`, `<draft>:drafted:<face>`,
`<feature>:new:<k>`), keeping that name while later features cut into it; pieces of a split face add
`#[<faces around it>]` or `~k`. An edge is its two faces, sorted: `<face A>|<face B>` (`<face>|seam`).
The name is tried first; `mid` (the edge point at parameter 0.5) or `center`/`normal` is the fallback,
with a `name_not_found` warning when a name no longer exists. Either part alone is valid; older files
have only the point. The browser adds names to its picks when a feature is accepted (`/api/name_refs`).

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
| plane | `"plane": {"point": [x,y,z], "normal": [x,y,z]}` | planar face: a point on it (not its centre, which can lie off a ring-shaped face) and outward normal |
| axis | `"axis": {"point": [x,y,z], "dir": [x,y,z]}` | cylindrical or conical face: its axis |
| point | `"point": [x,y,z]` | vertex or sketch point |
| named | `"ref": "Front Plane" / "Top Plane" / "Right Plane" / "Origin" / "X axis" / "Y axis" / "Z axis"` | the part's own reference geometry |

A reference without `component` (for example `{"ref": "Top Plane"}`) is the assembly's own reference
geometry, which is fixed.

When a part changes, plane and axis references follow their face: on rebuild each one is matched to
a face of the rebuilt part with the same direction (within 20% of the part size) and the stored point is
updated. A plane reference stays put while some face still lies in its plane (so an unchanged part never
moves its mates); otherwise it goes to the face that holds the stored point, else the nearest along the
normal. An axis goes to the nearest coaxial cylinder or cone. Like edge and face references in parts, this is geometric matching, not
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
| `limit_distance` | plane-plane (also kept parallel), plane-point, axis-axis, axis-point, point-point | distance between `min` and `max` mm, measured as a coupler's `distance` (below) |
| `limit_angle` | plane or axis, plane or axis | angle between `min` and `max` degrees |
| `coupler` | `input_refs`: the driver pair; `refs`: the driven pair (each pair: two references, usually on different components) | SOLIDWORKS Linear/Linear Coupler, generalised to a motion law: the driven measure follows the driver measure. See below. |

- `align`: `"anti"` (normals face each other, SOLIDWORKS "Anti-Aligned", the default for touching
  faces), `"aligned"`, or `"auto"` (whichever is closer when the mate is solved; the default).
- `flip`: for `distance`, measure to the other side.
- `suppressed`: the mate is ignored. A mate on a suppressed component is reported `suppressed` too.
- `value`, `min`, `max`, `angle_min`, `angle_max`, `ratio`, `offset`: numbers; `null` is the same as
  leaving it out. Anything else makes that mate an error, not the whole assembly.

The solver is a damped least-squares (Levenberg-Marquardt) solve over the six degrees of freedom of
every free component. It moves components as little as possible. Limits only act when exceeded.

Dragging: `/api/regen` takes `drag` = `{"component", "point" (part coordinates), "target" (assembly
coordinates)}`. The solver first pulls that point toward the target softly with every mate in place,
then makes every mate exact again. So a hinged lid swings, a slider slides, a linkage follows. Each mate reports `ok`, `error`
or `suppressed`.

Over-defining mates (as in SOLIDWORKS): when the mates cannot all hold, the solver adds them again in
document order, from where the components were, and rejects each mate that cannot hold together with the
ones before it. Only the rejected mates are errors; the others stay `ok` and the components sit where the
accepted mates put them (nothing moves to a compromise). A rejected mate's result has
`"over_defining": true`, `conflicts_with` (ids of the earlier mates it fights: those whose removal would let
it hold, else every earlier mate on its moving components) and a message such as "Over defines the assembly:
conflicts with Coincident3." `/api/regen` (and the browser's own solve) also lists their ids in `conflicts`. Drag frames skip this (the
solve on release does it).

### Coupler (motion law)

```json
{"id": "m7", "name": "Lever drives tongue", "type": "coupler",
 "input_refs": [{"component": "c1", "plane": {...}}, {"component": "c2", "plane": {...}}], "input": "angle",
 "refs": [{"component": "c1", "plane": {...}}, {"component": "c3", "plane": {...}}], "output": "distance",
 "law": [[0, 0], [15, 0], [60, 18]]}
```

- `input` / `output`: `"angle"` (degrees between the two directions, 0 to 180, as `limit_angle`) or
  `"distance"` (mm: plane-plane and plane-point signed along the first plane's normal, axis-point and
  axis-axis the distance from the axis, point-point straight-line).
- `law`: points `[driver value, driven value]` with driver values strictly increasing. Between points
  the driven value is interpolated in a straight line; outside them it holds the end value. A flat
  stretch is a dwell (the lever moves, the tongue waits), a steeper stretch a faster pickup.
- Instead of `law`: `ratio` and `offset` (driven = offset + ratio x driver), SOLIDWORKS's linear coupler.
- The driven part still needs its own mates (for a slide: coincident faces), leaving the one freedom the
  coupler takes. A coupler is a function of the driver's position, so it cannot hold a latch state
  (a tongue that stays out when the lever returns): model that position as its own joint.

## Contacts (should touch)

```json
"contacts": [{"id": "k1", "name": "Shoe on tongue", "a": "c2", "b": "c3", "joint": "m5", "from": 15, "to": 60}]
```

Two components that must touch (gap at most 0.05 mm, no overlap). The review checks it at rest, and
through `joint`'s travel between `from` and `to` (that joint's units) when `joint` is given. Nothing in
the solver uses it: it is a check that the motion law matches the shapes. `of`: the coupler mate that
made it (the Coupler PropertyManager's Contact Check); it goes when that mate or either component is
deleted.

## Sequence

`sequence` lists component ids in the order they were assembled (insertion order if absent).
Assembly Playback (Assembly tab) replays this order: each component flies in from an exploded position and
settles onto its mates. The AI fills it as it assembles.

# Import

`POST /api/import` with a STEP file returns a document. One solid: a part with an `import` feature.
Several solids: an assembly with one component per solid at its STEP position, the first one fixed, no
mates (as SOLIDWORKS does with STEP). Solids share a part when they have the same shape (volume, area,
face and edge count and size) and either the part's shape moved by the solid's own STEP location lands on
it (instances of one product), or the solid is the same product (its name without a copy number, such as
`Screw003`) moved without turning (copies written in world coordinates); the component is then placed by
that move. A mirror image never shares a part. Generic STEP names (`COMPOUND`, `Part1`, `Solid`, `Body`,
`Product`, `Assembly`, `Shape`, OpenCascade's translator text) give way to the file name. An `import`
feature's `data` (zlib + base64 BREP) unpacks to at most 512 MB. SOLIDWORKS files (.sldprt,
.sldasm) are refused with a message to save them as STEP first: the format is closed.

The AI never receives the BREP data: it gets the import feature with `data` omitted and a `summary`
(bounding box, volume, planar faces, cylinders). When it echoes the feature back, the data is restored
by feature id.

## Feature recognition

Recognize Features (`opensketch/recognize.py`, SOLIDWORKS FeatureWorks) replaces an `import` feature with
ordinary features; nothing new is added to the format. It works on an import that comes first in the tree
(sketches and planes before it are fine). Features after the import are kept and keep their references.

- Local features become `fillet` (constant radius; edge refs with persistent names), `chamfer` (equal
  distances as `angle_distance` 45, else `distance_distance`) and `hole` (`simple`, `counterbore`,
  `countersink`; `blind` with `depth` or `through_all`). A hole's `plane` is a `face` plane on the face it
  is drilled into (its origin is the part origin projected onto that face, `reverse: true` drills into the
  material), or a `fixed` plane at the rim when that face is not flat across the axis. Three or more equal
  holes in an evenly spaced row become one hole and a `linear_pattern` with a `vector` direction.
- The base becomes extrudes along one direction, or one `revolve` (sketch on a plane through the axis, a
  construction centerline as `axis`, 360 degrees). Extrudes are written as a stock with cuts from the top
  and bottom faces, or as stacked bosses, whichever needs fewer features. The base sketch sits on a
  standard plane where the body allows (`midplane` when the body is symmetric about it), else on a hidden
  reference `plane` offset from one. Cuts and stacked bosses sit on `face` planes so they follow an edited
  depth; a face plane that would land on another face is written `fixed`. Through holes along the extrude
  direction are circles in the sketch.
- Sketches get relations (horizontal, vertical, tangent, coincident with the origin) and dimensions
  (diameters, radii, lengths, angles, positions from the origin, named D1, D2...) only where the browser's
  sketch solver says they remove a degree of freedom (`static/js/sketch/define_cli.mjs`), so they are never
  over-defined and usually fully defined. Curves other than lines, circles and arcs become splines through
  points on them (close, not exact; the report says so).
- What is not recognised stays an `import` feature holding the body with the recognised features taken off.
- Generated ids start with `fw`. The finished tree is rebuilt and compared with the import: equal volume and
  every sampled surface point of each solid on the other's surface (OpenCascade booleans alone are not
  trusted for near-identical solids). A result that does not match is not offered.
