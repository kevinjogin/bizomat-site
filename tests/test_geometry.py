"""Regen tests: sketch -> extrude -> cut -> fillet -> chamfer -> shell -> patterns."""
import math

import pytest

from opensketch.geometry import regen, regen_result, mass_properties
from opensketch import geometry


def rect_sketch(fid, plane, x0, y0, x1, y1, extra=()):
    pts = [("a", x0, y0), ("b", x1, y0), ("c", x1, y1), ("d", x0, y1)]
    ents = [{"id": f"{fid}{n}", "type": "point", "x": x, "y": y} for n, x, y in pts]
    names = [p[0] for p in pts]
    for i in range(4):
        ents.append({"id": f"{fid}L{i}", "type": "line", "p1": f"{fid}{names[i]}", "p2": f"{fid}{names[(i + 1) % 4]}"})
    ents.extend(extra)
    return {"id": fid, "type": "sketch", "name": fid, "plane": plane, "entities": ents, "constraints": []}


def circle_ent(fid, cx, cy, r):
    return [{"id": f"{fid}cp", "type": "point", "x": cx, "y": cy},
            {"id": f"{fid}c", "type": "circle", "center": f"{fid}cp", "r": r}]


def ok(st):
    bad = [s for s in st.status if s["state"] == "error"]
    assert not bad, bad


def test_block_with_hole():
    doc = {"features": [
        rect_sketch("s1", {"ref": "Top Plane"}, -50, -30, 50, 30, circle_ent("s1", 0, 0, 10)),
        {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
    ]}
    st, _ = regen(doc)
    ok(st)
    expected = 100 * 60 * 20 - math.pi * 100 * 20
    assert abs(st.part.volume - expected) < 1e-3
    bb = st.part.bounding_box()
    assert abs(bb.max.Y - 20) < 1e-6 and abs(bb.min.Y) < 1e-6  # top plane extrudes along +Y


def test_cut_fillet_chamfer_shell():
    doc = {"features": [
        rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 40, 40),
        {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 30},
        rect_sketch("s2", {"type": "face", "origin": [20, 20, 30], "normal": [0, 0, 1], "xdir": [1, 0, 0]},
                    -5, -5, 5, 5),
        {"id": "c1", "type": "extrude", "op": "cut", "sketch": "s2", "end": "through_all", "reverse": True},
    ]}
    st, _ = regen(doc)
    ok(st)
    assert abs(st.part.volume - (40 * 40 * 30 - 10 * 10 * 30)) < 1e-3
    doc["features"].append({"id": "f1", "type": "fillet", "radius": 3, "edges": [{"mid": [0, 0, 15]}]})
    doc["features"].append({"id": "ch", "type": "chamfer", "distance": 1, "edges": [{"mid": [40, 40, 15]}]})
    doc["features"].append({"id": "sh", "type": "shell", "thickness": 2,
                            "faces": [{"center": [20, 40, 15], "normal": [0, 1, 0]}]})
    st, _ = regen(doc)
    ok(st)
    assert st.part.volume < 40 * 40 * 30 - 10 * 10 * 30


def test_sketch_on_face_follows_depth_change():
    doc = {"features": [
        rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 40, 40),
        {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 30},
        rect_sketch("s2", {"type": "face", "origin": [20, 20, 30], "normal": [0, 0, 1], "xdir": [1, 0, 0]},
                    -5, -5, 5, 5),
        {"id": "e2", "type": "extrude", "sketch": "s2", "depth": 10},
    ]}
    doc["features"][1]["depth"] = 50
    st, _ = regen(doc)
    ok(st)
    assert abs(st.part.bounding_box().max.Z - 60) < 1e-6


def test_revolve_and_patterns():
    prof = {"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "constraints": [], "entities": [
        {"id": "p0", "type": "point", "x": 0, "y": 0}, {"id": "p1", "type": "point", "x": 0, "y": 10},
        {"id": "p2", "type": "point", "x": 20, "y": 10}, {"id": "p3", "type": "point", "x": 20, "y": 0},
        {"id": "ax", "type": "line", "p1": "p0", "p2": "p1", "construction": True},
        {"id": "l1", "type": "line", "p1": "p0", "p2": "p1"}, {"id": "l2", "type": "line", "p1": "p1", "p2": "p2"},
        {"id": "l3", "type": "line", "p1": "p2", "p2": "p3"}, {"id": "l4", "type": "line", "p1": "p3", "p2": "p0"},
    ]}
    doc = {"features": [prof, {"id": "r1", "type": "revolve", "sketch": "s1", "axis": "ax", "angle": 360}]}
    st, _ = regen(doc)
    ok(st)
    assert abs(st.part.volume - math.pi * 400 * 10) < 1e-2
    doc["features"] += [
        rect_sketch("s2", {"ref": "Top Plane"}, 12, -2, 16, 2),
        {"id": "c1", "type": "extrude", "op": "cut", "sketch": "s2", "end": "through_all", "dir2": {"end": "through_all"}},
        {"id": "cp", "type": "circular_pattern", "features": ["c1"], "axis": "Y", "count": 6},
    ]
    st, _ = regen(doc)
    ok(st)
    assert abs(st.part.volume - (math.pi * 400 * 10 - 6 * 16 * 10)) < 1e-2
    doc["features"].append({"id": "lp", "type": "linear_pattern", "features": ["r1"], "direction": "X", "count": 3, "spacing": 50})
    st, _ = regen(doc)
    ok(st)
    assert len(st.part.solids()) == 1 or st.part.volume > 0


def test_errors_and_preview():
    doc = {"features": [{"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "constraints": [], "entities": [
        {"id": "a", "type": "point", "x": 0, "y": 0}, {"id": "b", "type": "point", "x": 10, "y": 0},
        {"id": "l", "type": "line", "p1": "a", "p2": "b"}]},
        {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]}
    st, _ = regen(doc)
    assert st.status[1]["state"] == "error" and "open" in st.status[1]["message"]
    doc2 = {"features": [rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 10, 10)]}
    res = regen_result(doc2, preview={"id": "pv", "type": "extrude", "sketch": "s1", "depth": 5})
    assert res["tool"] and res["tool"]["faces"] and not res["body"]["faces"]
    doc2["features"].append({"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5})
    mp = mass_properties(doc2)
    assert abs(mp["volume"] - 500) < 1e-6


def test_model_edge_references_are_hidden_from_profiles():
    """A sketch whose point is On Edge of the model keeps a hidden, fixed copy of that edge ("ref": "edge").
    It must never become part of a profile or of the drawn sketch edges."""
    from build123d import Plane
    sk = {"id": "s", "type": "sketch", "plane": {"ref": "Front Plane"}, "entities": [
        {"id": "r1", "type": "point", "x": -50, "y": -20, "ref": "edge"},
        {"id": "r2", "type": "point", "x": 50, "y": -20, "ref": "edge"},
        {"id": "rl", "type": "line", "p1": "r1", "p2": "r2", "construction": True, "ref": "edge", "refKey": "edge:0,0,20"},
        {"id": "c", "type": "point", "x": 0, "y": -20},
        {"id": "ci", "type": "circle", "center": "c", "r": 5}],
        "constraints": [{"id": "k1", "type": "fix", "refs": ["r1"]}, {"id": "k2", "type": "fix", "refs": ["r2"]},
                        {"id": "k3", "type": "coincident", "refs": ["c", "rl"]}]}
    assert set(geometry.sketch_geometry(sk, Plane.XY)) == {"ci"}
    assert set(geometry.sketch_geometry(sk, Plane.XY, include_construction=True)) == {"ci"}
    doc = {"name": "P", "features": [sk, {"id": "e", "type": "extrude", "sketch": "s", "op": "boss", "end": "blind", "depth": 3}]}
    st, _ = geometry.regen(doc)
    assert st.part.volume == pytest.approx(3.14159265 * 25 * 3, rel=1e-4)
