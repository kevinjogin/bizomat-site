# Recipes: the reference

A recipe is `recipes/<key>.py` in the job folder. `part()` returns a `Part`. Everything is in mm and degrees, in
the frame `source()` returns the solid in (see `oriented` below). Imports: `from core import ...`,
`from source import step, oriented`.

```python
from core import Ch, Dr, Ex, Fi, Mk, PART_FRAME, Part, circle, circle_edges, face_loop_edges, obround, rrect
from source import oriented, step

def source():
    return oriented(step("src/bracket.step"), z=(0, 1, 0), x=(0, 0, 1), origin=(-7.25, 12.5, 30.0))

def part():
    steps = [
        Ex("plate", "add", 0.0, 4.0, [rrect(-30, -20, 30, 20, 4.0)], "60 x 40, R4 corners, 4 thick"),   # the base: on the origin
        Ex("boss", "add", 4.0, 12.0, [circle(-15, 0, 8.0)], "16 dia, 8 high"),
        Ex("bore", "cut", 12.0, 0.0, [circle(-15, 0, 4.0)], "8 dia through", refs=("boss",)),
        Dr("boss draft", ("boss",), 2.0, 4.0, -1, "2 deg from the plate's top face"),
        Ch("top edge", 0.5, face_loop_edges(4.0, "outer"), "0.5 x 45 deg"),
        Fi("boss root", 1.0, circle_edges(4.0, 8.0), "R1 where the boss meets the plate"),
    ]
    return Part("bracket", "Bracket", PART_FRAME, steps, src=source, notes=[], where="origin at ...; Front plane = ...")
```

## The source solid

- `step(path, pick=None)`: the solid in a STEP file (path relative to the job folder). Several solids in one file:
  `pick=2` (position) or `pick="Lid"` (the start of its label). `sldmacro look` lists them.
- `oriented(solid, z=(0,0,1), x=None, origin=(0,0,0))`: the file's direction `z` becomes +Z and `x` becomes +X,
  then the point `origin`, given in that turned frame, becomes (0, 0, 0). Take the three values from
  `sldmacro look <file> --z ... --x ... --origin ...` once its listing reads in the frame you want.
- Choosing the frame: the Front plane (Z = 0) is a main flat face, usually the one the first extrude starts from.
  The origin is the centre of the base outline, or on the axis of a part that has one. To use the opposite face as
  the Front plane, reverse `z` (and check `x`, so the part is not mirrored: `oriented` never mirrors).
- A mirror-image twin of a part already written: `Frame(0, 0, 0, flip=True)` instead of `PART_FRAME` draws the same
  recipe turned over (Y reversed). `Frame(cx, cy, z0, rot=deg)` places the SOLIDWORKS origin elsewhere in the
  recipe's frame; with `oriented` you rarely need it.
- From build123d code instead of a file: `src=lambda: my_design.build_part()`; `src_bare=` may give the same part
  without its radii, for a tighter check of the extrudes.

## Outlines (the shapes in a sketch)

Each is one closed loop. A sketch is a list of them (holes of one size together: `[circle(x, y, r) for x, y in pts]`).

| Outline | Meaning |
|---|---|
| `circle(x, y, r)` | a full circle |
| `rect(x0, y0, x1, y1)` | a level rectangle |
| `rrect(x0, y0, x1, y1, r)` | a level rectangle with rounded corners |
| `obround(x0, y0, x1, y1)` | a straight slot filling that box, a half circle at each end of the long way |
| `tongue(xc, yc, r, x_end)` | a round end about (xc, yc) on a strip of the same width that runs to x = x_end (a round boss running into a wall; a slot open at one end) |
| `strip(a, b, w)` | a straight bar of width w from point a to point b, at any angle; `polar=True` if b is meant as a length and an angle from a |
| `dee(x, y, r, half, along="y")` | a round with two flats (double D), the flats `half` either side of the centre |
| `sector(x, y, r0, r1, a0, a1)` | part of a ring about (x, y) between two angles |
| `polygon([(x, y), ...])` | straight sides through the points |
| `free([seg, ...])` | any closed loop, in drawing order: `("L", x0, y0, x1, y1)`, `("A", cx, cy, x0, y0, x1, y1, ccw)` |

`core.section_shapes(solid, z)` returns the loops of a solid at a height as `free` shapes, for an outline too long
to type (a cam profile): use it with `Ex(..., fixed=True)`.

Outlines must be lines and arcs. A spline edge in the source cannot be sketched: say so.

## Features

- `Ex(name, op, z0, z1, shapes, note="", refs=(), taper=0.0, outward=False, fixed=False)`: a boss (`"add"`) or cut
  (`"cut"`) from height `z0` to `z1`. The direction matters: the sketch is "at" `z0` and the feature runs to `z1`.
  A cut through a plate 4 thick from its top: `z0=4.0, z1=0.0`.
  - `refs`: names of earlier features this sketch should be measured from (whose edges or axis its dimensions
    prefer). Without it the planner uses the base feature and the nearest edges.
  - `taper`: a wall angle of the feature's own, in degrees; the outline as sketched is the one at `z0`, and it
    shrinks with depth unless `outward=True`. A 90 deg countersink is a cut with `taper=45.0`, sketched at its big
    diameter. A lead-in cone likewise. Do NOT chamfer the mouth of a tapered hole instead (it fails in the replay).
  - `fixed=True`: a traced outline; its segments are fixed where they are, not dimensioned.
- `Dr(name, of, angle, neutral, wider, note="")`: a neutral-plane draft on the side faces of the extrudes named in
  `of` (a tuple of names). `neutral` is the height of the neutral plane (a flat face of the part at that height, or
  0 for the Front plane). `wider = +1` if the drafted feature gets wider toward +Z, `-1` toward -Z. One `Dr` per
  feature drafted. A feature with a `taper` of its own cannot also take a `Dr`.
- `Ch(name, size, edges, note="")`: a chamfer, size x 45 deg, on the edges a selector picks.
- `Fi(name, r, edges, note="", prune=True)`: a radius on the edges a selector picks. If the replay cannot round
  every edge selected, it leaves out the ones that fail and says so (`prune=False` stops that).
- `Mk(name, z0, z1, shapes, draft=0.0, note="", op="cut")`: a sign or symbol, a shallow cut made last, its outline
  traced and fixed.

Order in the macro: all `Ex` in the order listed, then all `Dr`, then `Ch` and `Fi` in the order listed (list
chamfers first), then `Mk`. Names must be unique within a part, plain ASCII, short ("bolt holes", "rib root").
The `note` is what YZ reads in the feature table: say the sizes a designer would ("2 x 4.5 dia, 24 apart").

## Selectors (which edges a chamfer or radius takes)

A selector is called with the part as it is at that point and returns edges. Heights and positions are in the
recipe's frame.

| Selector | Picks |
|---|---|
| `face_loop_edges(z, which="all", inside=None)` | edges of the flat faces at height z: `"outer"` loops, `"inner"` loops or `"all"`; `inside=(x0, y0, x1, y1)` keeps the loops in that window |
| `circle_edges(z, r, at=None)` | circular edges of radius r in the plane at height z (`at=[(x, y), ...]`: only about those centres) |
| `circles_about(z, pts, rmax=None)` | circular edges at height z about those centres, any radius (up to rmax) |
| `concave_at(z, inside=None)` | inside corners lying in the plane at height z (the foot of a wall, the floor of a pocket) |
| `convex_at(z, inside=None)` | outside corners lying in that plane (the rim of a boss, the top of a wall) |
| `upright_concave(window=None, z=None)` | inside corners that run up the part: `window=(x0, y0, x1, y1)`, `z=(lo, hi)` |
| `outline_edges(z, shapes)` | edges at height z that lie on the outline of those shapes (what a feature's sketch left there) |
| `edges_where(test)`, `concave_where(test)` | any edge (any inside corner) for which `test(info)` is true; `info` has `kind` (line, circle), `mid`, `p0`, `p1`, `z`, `flat`, `len`, and for circles `c`, `r`, `full` |
| `both(sel1, sel2, ...)` | the union |

`sldmacro check <key>` prints how many edges each chamfer and radius took and their length: read it.
`sldmacro where <key>` lists every piece of material that is only in the features or only in the source.

## Part

`Part(key, title, frame, steps, src=None, src_bare=None, notes=[], where="")`

- `key`: the recipe file's name; it is what `ONLY = "..."` takes in the macro.
- `title`: what the part is called in the macro, the log and the report. Plain ASCII.
- `notes`: every difference from the source made on purpose, and everything left out, in YZ's terms.
- `where`: one sentence: where the origin is, which face is the Front plane, which way X runs.

## How the planner defines a sketch (so you can steer it)

It keeps a relation or a dimension only if it removes a degree of freedom, so a plan is exactly defined and
nothing is redundant. Nothing is dimensioned 0 (that is a relation). In order: horizontal / vertical, tangent,
equal radii; then per outline:

- circles: concentric with a model circle; at the middle of an edge of a `refs` feature; or located from the
  origin line, in line with a hole already placed, from the datum axis, from the nearest edge;
- rectangles: sides collinear with an edge or a side already drawn, through the origin, inset from the walls next
  to them, centred by a construction line through their side midpoints, or one side from the datum plus the size;
- `obround`: across from the origin line or datum plus its width; along from the wall next to an end plus the
  centre distance (with no wall next to either end: the end that is on the origin line, in line with a hole, or
  nearer to the wall it is measured from). `tongue`: from the datum, radius, end from the wall;
- `strip`: a construction centre line with the ends at its midpoints and square to it, the width, each end on the
  origin, on a model circle's centre, on a centre already placed, or by H / V dimensions; a level, upright or
  `polar` strip by its length (and angle);
- `free`: slanted lines on a model edge are made collinear with it; families of lines parallel or perpendicular;
  the first of a family gets an angle to a level or upright line; arcs about the origin or a model circle are tied
  to it; radii; then lines by collinear, through the origin, distance from a wall of a `refs` feature, from a
  parallel line already placed, from the datum, from the origin.

On a part whose first feature is round, nothing is measured from a straight edge unless that edge belongs to a
`refs` feature. So: name in `refs` the feature a sketch belongs to; split one complicated outline into simpler
features; use `strip(polar=True)` for a bar meant by length and angle.

If a plan still has degrees of freedom left, the macro finishes that sketch with Fully Define Sketch and a note
says so. Avoid it where you can; never leave a base sketch like that.
