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
  (same normal, nearest face), so the sketch follows if an earlier depth changes.

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

Edge references are `{"mid": [x,y,z]}`, the point at the middle of the edge. Face references are
`{"center": [x,y,z], "normal": [x,y,z]}`. They are matched to the nearest edge or face on rebuild.
This is simple and works for most edits; it is not yet full topological naming.
