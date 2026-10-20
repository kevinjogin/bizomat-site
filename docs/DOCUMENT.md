# Feature format

This is the format an AI app writes to OpenSketch's `sw_` tools: sketches and features for `sw_add_features` and
`sw_batch`, and references for `sw_add_mate`. OpenSketch checks it with its own kernel (`opensketch/geometry.py`,
build123d) and the add-in builds it in SOLIDWORKS as native features. The AI gets a short version from
`sw_get_guide`.

A part is a list of features, built in order, like SOLIDWORKS' FeatureManager tree. Every feature has `id`
(unique), `type`, and optionally `name` (SOLIDWORKS style: Sketch1, Boss-Extrude1...; given, it renames the
feature in SOLIDWORKS) and `suppressed`. In SOLIDWORKS, feature ids are yours for that call; to point at
features already in the file, use their SOLIDWORKS names ("Sketch3", "Boss-Extrude1", "Plane1").

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
  (body_topology gives one as a face's `point`). On rebuild the face is found again
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
Reports separate `errors` and `warnings`: `rebuilt` means no rebuild errors; `clean` means no rebuild
errors or warnings. A successful rebuild can therefore have `rebuilt: true` and `clean: false`.

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

The solver (`opensketch/solver/solver.js`, run with node) treats every point as (x, y) and every circle
radius as unknowns, and reports degrees of freedom, per-entity defined state and over-defining relations.
Every sketch is solved before it is sent to SOLIDWORKS, and an over-defined sketch is refused. The kernel's
own rebuild uses the stored points as they are, so points should already satisfy the dimensions: a sketch
whose stored points miss a dimension by more than 0.001 mm (or 0.001 deg), or has an arc whose end is off
its circle, rebuilds with a `sketch_not_solved` warning that names them.

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
| `import` | `format` `"brep"`, `data` (BREP text, zlib-compressed, base64), `source` (file name), `label`. An imported body; the kernel uses it to hold SOLIDWORKS' current body while it checks new features. |
| `standard` | `kind` (`socket_head_cap_screw`, `hex_head_screw`, `counter_sunk_screw`, `button_head_screw`, `set_screw`, `hex_nut`, `plain_washer`, `ball_bearing`), `size` (`M6-1`; bearings `M8-22-7`), `length` (screws). A standard part made to size (bd_warehouse). Axis along the part Y axis, head above Y = 0, shank down -Y. |

Every feature type except `sketch`, `import` and `standard` is described once in the feature registry
(`opensketch/features/`): its fields, kinds, defaults and limits there are the authority for this table.
The registry drives the feature help in `sw_get_guide` and the input checks. A field's `default` is what
new features get when it is left out (a linear pattern with `direction2` also gets `count2` 2 and
`spacing2` = `spacing`; a chamfer with `distance2` but no `mode` gets `distance_distance`). A pattern makes
at most 2000 instances.

Edge references are `{"mid": [x,y,z]}`, the point at the middle of the edge. Face references are
`{"center": [x,y,z], "normal": [x,y,z]}`. They are matched to the nearest edge or face on rebuild.
Persistent names (below) are tried first.

Sweep uses all non-construction edges of its path sketch. Loft section order is significant;
guide curves and inner contours are not supported. Hole Wizard creates a dimensioned, flat-bottom
hole, counterbore or countersink at a plane coordinate. Hole depth follows the plane normal, or its
opposite when `reverse` is true. Through-all is directional. These are explicit dimensions, not
a fastener-standard or thread database. Hole features can be mirrored and patterned.

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
with a `name_not_found` warning when a name no longer exists. Either part alone is valid.

## Parameters and equations

SOLIDWORKS Tools > Equations (`opensketch/params.py`; in SOLIDWORKS, `sw_set_parameter` and `sw_set_equation`
write them as SOLIDWORKS' own global variables and equations). A part may have global variables, and any
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
- Driven fields keep their current number. A rebuild first recomputes the numbers; a sketch whose dimension
  changed is re-solved with the sketch solver. Registry limits apply: an `int` field must come out whole,
  `min`/`max` hold. A failing equation turns its feature red with the reason.

# Assemblies

## Mate references

Every reference names a `component` (its SOLIDWORKS name, for example `Bracket-1`) and one geometric entity,
in that component's **part** coordinates (the coordinates used while modelling the part):

| entity | form | from a face pick |
|---|---|---|
| plane | `"plane": {"point": [x,y,z], "normal": [x,y,z]}` | planar face: a point on it (not its centre, which can lie off a ring-shaped face) and outward normal |
| axis | `"axis": {"point": [x,y,z], "dir": [x,y,z]}` | cylindrical or conical face: its axis |
| point | `"point": [x,y,z]` | vertex or sketch point |
| named | `"ref": "Front Plane" / "Top Plane" / "Right Plane" / "Origin" / "X axis" / "Y axis" / "Z axis"` | the part's own reference geometry |

A reference without `component` (for example `{"ref": "Top Plane"}`) is the assembly's own reference
geometry, which is fixed. The add-in finds the face, edge or plane that each reference describes in the
component and selects it for SOLIDWORKS' mate.

## Mates

| type | references | meaning |
|---|---|---|
| `coincident` | plane-plane, plane-point, point-point, axis-axis, axis-plane, axis-point | entities lie on each other. Plane-plane uses `align`. |
| `concentric` | axis-axis | axes collinear |
| `parallel` | plane or axis, plane or axis | directions parallel (`align` optional) |
| `perpendicular` | plane or axis, plane or axis | directions perpendicular |
| `distance` | plane-plane, plane-point, point-point, axis-axis | `value` mm apart; plane-plane also parallel |
| `angle` | plane or axis, plane or axis | `value` degrees between directions |
| `lock` | any two references on two components | the second component keeps its current pose relative to the first |
| `hinge` | `refs`: two axes; optional `planes`: two planes (coincident, stops sliding); optional `angle_refs`: two planes or axes with `angle_min` / `angle_max` (degrees) | SOLIDWORKS Hinge mechanical mate: one rotation left, optionally limited |
| `limit_distance` | plane-plane (also kept parallel), plane-point, axis-axis, axis-point, point-point | distance between `min` and `max` mm |
| `limit_angle` | plane or axis, plane or axis | angle between `min` and `max` degrees |
- `align`: `"anti"` (normals face each other, SOLIDWORKS "Anti-Aligned", the default for touching
  faces), `"aligned"`, or `"auto"` (whichever SOLIDWORKS accepts first).
- `flip`: for `distance`, measure to the other side.
