"""Reference parts with expected numbers worked out by hand (closed-form formulas), never by OpenSketch.

Run `python -m tests.reference_parts.recipes` to rewrite the JSON files after changing a recipe. The test
(tests/test_reference_parts.py) rebuilds each JSON file and compares volume, centre of mass and bounding
box. A kernel, feature or AI-written change that moves any of them fails the build.

Plane mapping (SOLIDWORKS): Front Plane sketch (x, y) -> world (X, Y), extrudes +Z; Top Plane sketch
(x, y) -> world (X, -Z), extrudes +Y; Right Plane sketch (x, y) -> world (-Z, Y), extrudes +X.

Idea from SolidCraft (bherbruck/solidcraft): its oracle parts checked against independent values.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

HERE = Path(__file__).parent
PI = math.pi


def rect(fid, plane, x0, y0, x1, y1, extra=()):
    pts = [("a", x0, y0), ("b", x1, y0), ("c", x1, y1), ("d", x0, y1)]
    ents = [{"id": f"{fid}{n}", "type": "point", "x": x, "y": y} for n, x, y in pts]
    for i in range(4):
        ents.append({"id": f"{fid}L{i}", "type": "line", "p1": f"{fid}{pts[i][0]}", "p2": f"{fid}{pts[(i + 1) % 4][0]}"})
    ents.extend(extra)
    return {"id": fid, "type": "sketch", "name": fid, "plane": plane, "entities": ents, "constraints": []}


def circle(fid, cx, cy, r):
    return [{"id": f"{fid}cp", "type": "point", "x": cx, "y": cy},
            {"id": f"{fid}c", "type": "circle", "center": f"{fid}cp", "r": r}]


def circle_sketch(fid, plane, cx, cy, r):
    return {"id": fid, "type": "sketch", "name": fid, "plane": plane, "entities": circle(fid, cx, cy, r), "constraints": []}


def poly_sketch(fid, plane, pts, axis=None):
    """Closed polygon; axis=(i, j) adds a construction line between points i and j (a revolve axis)."""
    ents = [{"id": f"{fid}p{i}", "type": "point", "x": x, "y": y} for i, (x, y) in enumerate(pts)]
    n = len(pts)
    ents += [{"id": f"{fid}l{i}", "type": "line", "p1": f"{fid}p{i}", "p2": f"{fid}p{(i + 1) % n}"} for i in range(n)]
    if axis:
        ents.append({"id": f"{fid}ax", "type": "line", "p1": f"{fid}p{axis[0]}", "p2": f"{fid}p{axis[1]}", "construction": True})
    return {"id": fid, "type": "sketch", "name": fid, "plane": plane, "entities": ents, "constraints": []}


def tube_sketch():
    """Rectangle r 5..15, y 0..30 with a separate centerline on the Y axis."""
    sk = poly_sketch("s1", {"ref": "Front Plane"}, [(5, 0), (15, 0), (15, 30), (5, 30)])
    sk["entities"] += [{"id": "s1o", "type": "point", "x": 0, "y": 0}, {"id": "s1t", "type": "point", "x": 0, "y": 30},
                       {"id": "s1ax", "type": "line", "p1": "s1o", "p2": "s1t", "construction": True}]
    return sk


FRONT, TOP, RIGHT = {"ref": "Front Plane"}, {"ref": "Top Plane"}, {"ref": "Right Plane"}


def combine(*items):
    """Volume and centre of mass of solids added (+V) and removed (-V): items are (V, (x, y, z))."""
    v = sum(i[0] for i in items)
    c = [sum(i[0] * i[1][k] for i in items) / v for k in range(3)]
    return v, c


def part(name, description, derivation, features, volume, com, bbox):
    return {"name": name, "description": description, "derivation": derivation, "features": features,
            "expect": {"volume_mm3": volume, "center_of_mass": com, "bbox": {"min": bbox[0], "max": bbox[1]}}}


def recipes() -> list[dict]:
    out = []

    out.append(part("block_offset", "Front Plane rectangle away from the origin, blind extrude.",
                    "V = 40*20*15; centre of the box.",
                    [rect("s1", FRONT, 10, 20, 50, 40), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 15}],
                    40 * 20 * 15, [30, 30, 7.5], ([10, 20, 0], [50, 40, 15])))

    vb, vh = 100 * 60 * 20, PI * 8 ** 2 * 20
    v, c = combine((vb, (50, 10, -30)), (-vh, (25, 10, -15)))
    out.append(part("block_hole_off_centre", "Top Plane block with a through hole off centre (centre of mass moves).",
                    "Box 100x60x20 minus cylinder r 8 at sketch (25, 15) = world (25, y, -15); weighted centres.",
                    [rect("s1", TOP, 0, 0, 100, 60), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
                     circle_sketch("s2", TOP, 25, 15, 8),
                     {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all",
                      "dir2": {"end": "through_all"}}],
                    v, c, ([0, 0, -60], [100, 20, 0])))

    out.append(part("revolved_tube", "Rectangle r 5..15, height 30, revolved 360 deg about a centerline on Y.",
                    "V = pi (15^2 - 5^2) 30; centre on the axis at mid height.",
                    [tube_sketch(),
                     {"id": "r1", "type": "revolve", "sketch": "s1", "axis": "s1ax", "angle": 360}],
                    PI * (15 ** 2 - 5 ** 2) * 30, [0, 15, 0], ([-15, 0, -15], [15, 30, 15])))

    out.append(part("revolved_cone", "Right triangle (base r 10, height 30) revolved about its vertical edge.",
                    "Cone: V = pi r^2 h / 3; centre of mass h/4 above the base.",
                    [poly_sketch("s1", FRONT, [(0, 0), (10, 0), (0, 30)], axis=(2, 0)),
                     {"id": "r1", "type": "revolve", "sketch": "s1", "axis": "s1ax", "angle": 360}],
                    PI * 100 * 30 / 3, [0, 7.5, 0], ([-10, 0, -10], [10, 30, 10])))

    vb = 40 * 30 * 20
    out.append(part("fillet_four_edges", "Block 40x30x20 with its four Z edges filleted r 5.",
                    "Each fillet removes r^2 (1 - pi/4) per mm of edge: V = 24000 - 4 * 25 (1 - pi/4) 20; symmetric.",
                    [rect("s1", FRONT, 0, 0, 40, 30), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
                     {"id": "f1", "type": "fillet", "radius": 5,
                      "edges": [{"mid": [0, 0, 10]}, {"mid": [40, 0, 10]}, {"mid": [40, 30, 10]}, {"mid": [0, 30, 10]}]}],
                    vb - 4 * 25 * (1 - PI / 4) * 20, [20, 15, 10], ([0, 0, 0], [40, 30, 20])))

    v, c = combine((vb, (20, 15, 10)), (-0.5 * 3 * 3 * 20, (40 - 1, 30 - 1, 10)))
    out.append(part("chamfer_one_edge", "Block 40x30x20, one Z edge chamfered 3 mm x 45 deg.",
                    "Removes a triangular prism 0.5*3*3*20 whose centroid is 1 mm in from each face.",
                    [rect("s1", FRONT, 0, 0, 40, 30), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
                     {"id": "c1", "type": "chamfer", "distance": 3, "edges": [{"mid": [40, 30, 10]}]}],
                    v, c, ([0, 0, 0], [40, 30, 20])))

    v, c = combine((vb, (20, 15, 10)), (-36 * 26 * 18, (20, 15, 11)))
    out.append(part("shell_open_top", "Block 40x30x20 shelled 2 mm inward with the +Z face removed.",
                    "Outer box minus the 36x26x18 cavity from z 2 to 20.",
                    [rect("s1", FRONT, 0, 0, 40, 30), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
                     {"id": "sh", "type": "shell", "thickness": 2, "faces": [{"center": [20, 15, 20], "normal": [0, 0, 1]}]}],
                    v, c, ([0, 0, 0], [40, 30, 20])))

    out.append(part("midplane_extrude", "Rectangle 20x10 extruded 30 mid plane.",
                    "V = 20*10*30, symmetric about the sketch plane.",
                    [rect("s1", FRONT, -10, -5, 10, 5), {"id": "e1", "type": "extrude", "sketch": "s1", "end": "midplane", "depth": 30}],
                    6000, [0, 0, 0], ([-10, -5, -15], [10, 5, 15])))

    h, a = 20, 20
    b = a - 2 * h * math.tan(math.radians(5))
    a1, a2 = a * a, b * b
    vol = h / 3 * (a1 + a2 + math.sqrt(a1 * a2))
    zc = h * (a1 + 2 * math.sqrt(a1 * a2) + 3 * a2) / (4 * (a1 + math.sqrt(a1 * a2) + a2))
    out.append(part("extrude_with_draft", "Square 20 x 20 extruded 20 with 5 deg inward draft (a square frustum).",
                    "Top side = 20 - 2*20*tan 5 deg; frustum V = h/3 (A1 + A2 + sqrt(A1 A2)); "
                    "centroid z = h (A1 + 2 sqrt(A1 A2) + 3 A2) / (4 (A1 + sqrt(A1 A2) + A2)).",
                    [rect("s1", FRONT, -10, -10, 10, 10), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20, "draft": 5}],
                    vol, [0, 0, zc], ([-10, -10, 0], [10, 10, 20])))

    out.append(part("linear_pattern_holes", "Plate 100x40x10 with a hole r 4 patterned 5 times at 20 mm along X.",
                    "V = 100*40*10 - 5 pi 16 10; holes at x 10..90 are centred on the plate, so the centre stays.",
                    [rect("s1", FRONT, 0, 0, 100, 40), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10},
                     circle_sketch("s2", FRONT, 10, 20, 4),
                     {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
                     {"id": "lp", "type": "linear_pattern", "features": ["e2"], "direction": "X", "count": 5, "spacing": 20}],
                    100 * 40 * 10 - 5 * PI * 16 * 10, [50, 20, 5], ([0, 0, 0], [100, 40, 10])))

    out.append(part("circular_pattern_holes", "Disc r 30 x 10 (Top Plane) with six r 3 holes on a 20 mm radius.",
                    "V = pi 30^2 10 - 6 pi 3^2 10; six equal holes keep the centre on the axis.",
                    [circle_sketch("s1", TOP, 0, 0, 30), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10},
                     circle_sketch("s2", TOP, 20, 0, 3),
                     {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
                     {"id": "cp", "type": "circular_pattern", "features": ["e2"], "axis": "Y", "count": 6}],
                    PI * 900 * 10 - 6 * PI * 9 * 10, [0, 5, 0], ([-30, 0, -30], [30, 10, 30])))

    out.append(part("mirror_about_right_plane", "Block x 10..30 mirrored about the Right Plane (two bodies).",
                    "V = 2 * 20*10*5; the pair is symmetric about X = 0.",
                    [rect("s1", FRONT, 10, 0, 30, 10), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5},
                     {"id": "m1", "type": "mirror", "plane": {"ref": "Right Plane"}, "features": ["e1"]}],
                    2000, [0, 5, 2.5], ([-30, 0, 0], [30, 10, 5])))

    v, c = combine((50 * 50 * 10, (25, 25, 5)), (10 * 10 * 15, (15, 15, 17.5)), (-PI * 25 * 4, (35, 35, 8)))
    face = {"type": "fixed", "origin": [0, 0, 10], "normal": [0, 0, 1], "xdir": [1, 0, 0]}
    out.append(part("boss_and_blind_cut_on_face", "Base 50x50x10, a 10x10x15 boss on its top, a blind 4 mm pocket r 5.",
                    "Base + boss (x,y 10..20, z 10..25) - cylinder r 5 depth 4 at (35, 35), z 6..10.",
                    [rect("s1", FRONT, 0, 0, 50, 50), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10},
                     rect("s2", face, 10, 10, 20, 20), {"id": "e2", "type": "extrude", "sketch": "s2", "depth": 15},
                     circle_sketch("s3", face, 35, 35, 5),
                     {"id": "e3", "type": "extrude", "sketch": "s3", "op": "cut", "depth": 4, "reverse": True}],
                    v, c, ([0, 0, 0], [50, 50, 25])))

    out.append(part("right_plane_boss", "Front plate plus a Right Plane boss extruded mid plane through it.",
                    "Plate x -30..30, y 0..10, z 0..40; boss sketch on Right Plane: sketch (x, y) -> world (-Z, Y), "
                    "rect x -40..0 (z 0..40), y -5..5, mid plane 30 -> X -15..15; overlap y 0..5 counted once.",
                    [rect("s1", FRONT, -30, 0, 30, 10), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 40},
                     rect("s2", RIGHT, -40, -5, 0, 5), {"id": "e2", "type": "extrude", "sketch": "s2", "end": "midplane", "depth": 30}],
                    *combine((60 * 10 * 40, (0, 5, 20)), (30 * 5 * 40, (0, -2.5, 20))),
                    ([-30, -5, 0], [30, 10, 40])))
    return out


def write() -> None:
    for r in recipes():
        r["expect"]["volume_mm3"] = round(r["expect"]["volume_mm3"], 6)
        r["expect"]["center_of_mass"] = [round(x, 6) + 0.0 for x in r["expect"]["center_of_mass"]]
        (HERE / f"{r['name']}.json").write_text(json.dumps(r, indent=1) + "\n")


if __name__ == "__main__":
    write()
