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


def _plate_with_hole():
    return [rect_sketch("s1", {"ref": "Top Plane"}, 0, 0, 200, 200),
            {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5},
            {"id": "s2", "type": "sketch", "plane": {"ref": "Top Plane"}, "entities": circle_ent("c", 10, 10, 3), "constraints": []},
            {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}}]


def test_a_grid_pattern_is_one_boolean_per_seed():
    import time
    feats = _plate_with_hole() + [{"id": "p", "type": "linear_pattern", "features": ["e2"], "direction": "X", "count": 15,
                                   "spacing": 12, "direction2": "Z", "count2": 15, "spacing2": -12}]
    t = time.monotonic()
    st, _ = regen({"features": feats})
    ok(st)
    assert time.monotonic() - t < 5  # was ~20 s with a boolean per copy
    assert st.part.volume == pytest.approx(200 * 200 * 5 - 225 * math.pi * 9 * 5)
    assert len(st.instances["p"]) == 224
    feats[-1]["count"] = feats[-1]["count2"] = 50
    st, _ = regen({"features": feats})
    bad = next(s for s in st.status if s["id"] == "p")
    assert bad["state"] == "error" and "at most 2000" in bad["message"]
    from opensketch import features
    assert any("at most 2000" in m for m in features.validate(feats[-1]))


def test_left_out_values_build_with_the_registry_defaults():
    """What the PropertyManager, the Design panel, add_<type> and the SOLIDWORKS add-in assume a missing value is."""
    from opensketch import features
    base = _plate_with_hole()[:2]
    edge = [{"mid": [100, 5, 0]}]
    pairs = [
        ({"id": "f", "type": "fillet", "edges": edge}, {"radius": 2}),
        ({"id": "f", "type": "chamfer", "edges": edge, "distance": 2, "angle": 30}, {"mode": "angle_distance"}),
        ({"id": "f", "type": "linear_pattern", "features": ["e2"], "direction": "X"}, {"count": 3, "spacing": 20}),
    ]
    for left_out, given in pairs:
        feats = base + ([] if left_out["type"] != "linear_pattern" else _plate_with_hole()[2:])
        a, _ = regen({"features": feats + [left_out]})
        b, _ = regen({"features": feats + [{**left_out, **given}]})
        ok(a)
        assert a.part.volume == pytest.approx(b.part.volume), left_out["type"]
        for k, v in given.items():
            assert features.default_of(left_out["type"], k) == v
    a, _ = regen({"features": [{"id": "pl", "type": "plane", "base": {"ref": "Top Plane"}}]})
    assert a.planes["pl"].origin.Y == pytest.approx(features.default_of("plane", "offset"))


def _sk(ents):
    return {"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "entities": ents, "constraints": []}


def _pts(**p):
    return [{"id": k, "type": "point", "x": x, "y": y} for k, (x, y) in p.items()]


def _line(i, a, b):
    return {"id": i, "type": "line", "p1": a, "p2": b}


def test_overlapping_and_split_contours_make_regions():
    # two overlapping circles: one figure-eight solid, not two overlapping cylinders
    ents = circle_ent("a", 0, 0, 10) + circle_ent("b", 12, 0, 10)
    st, _ = regen({"features": [_sk(ents), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
    ok(st)
    lens = 2 * 100 * math.acos(6 / 10) - 6 * math.sqrt(400 - 144)  # r = 10, centres 12 apart
    assert len(st.part.solids()) == 1 and st.part.volume == pytest.approx((2 * math.pi * 100 - lens) * 5)
    # a rectangle split by a line, with and without its edges split at the T-junctions: the whole rectangle
    for split in (False, True):
        ents = _pts(a=(0, 0), b=(40, 0), c=(40, 20), d=(0, 20), m=(20, 0), n=(20, 20))
        outline = ["a", "m", "b", "c", "n", "d"] if split else ["a", "b", "c", "d"]
        ents += [_line(f"o{k}", outline[k], outline[(k + 1) % len(outline)]) for k in range(len(outline))]
        ents.append(_line("x", "m", "n"))
        st, _ = regen({"features": [_sk(ents), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
        ok(st)
        assert st.part.volume == pytest.approx(40 * 20 * 5)
    # a plate with two overlapping holes: one hole shaped like both
    ents = _pts(a=(-50, -30), b=(50, -30), c=(50, 30), d=(-50, 30)) + [_line(f"o{k}", "abcd"[k], "abcd"[(k + 1) % 4]) for k in range(4)]
    ents += circle_ent("h", 0, 0, 10) + circle_ent("g", 12, 0, 10)
    st, _ = regen({"features": [_sk(ents), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
    ok(st)
    assert st.part.volume == pytest.approx((6000 - (2 * math.pi * 100 - lens)) * 5)
    # a line that ends in the air is still an open contour, and the message says where
    ents = _pts(a=(0, 0), b=(40, 0), c=(40, 20), d=(0, 20), t=(20, 10)) + [_line(f"o{k}", "abcd"[k], "abcd"[(k + 1) % 4]) for k in range(4)]
    ents.append(_line("x", "a", "t"))
    st, _ = regen({"features": [_sk(ents), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
    err = st.status[1]
    assert err["state"] == "error" and "open contour" in err["message"] and "(20, 10)" in err["message"]


def test_many_holes_nest_quickly():
    import time
    ents = _pts(a=(0, 0), b=(150, 0), c=(150, 150), d=(0, 150)) + [_line(f"o{k}", "abcd"[k], "abcd"[(k + 1) % 4]) for k in range(4)]
    for i in range(14):
        for j in range(14):
            ents += circle_ent(f"h{i}_{j}", 10 + 10 * i, 10 + 10 * j, 3)
    t = time.monotonic()
    st, _ = regen({"features": [_sk(ents)]})
    assert time.monotonic() - t < 1.0  # 2.4 s with a classifier test per pair of contours
    faces = st.profiles["s1"]
    assert len(faces) == 1 and len(faces[0].inner_wires()) == 196


def test_a_sketch_whose_points_miss_its_dimensions_is_flagged():
    """The server builds stored points; the browser and the SOLIDWORKS path solve first. A sketch whose points do
    not fit its dimensions (an AI writing round numbers) must say so instead of building quietly."""
    sk = rect_sketch("s1", {"ref": "Front Plane"}, 0, 0, 100, 50)
    sk["constraints"] = [{"id": "D1", "name": "D1", "type": "distance", "refs": ["s1L0"], "value": 80},
                         {"id": "D2", "name": "D2", "type": "distance", "refs": ["s1L1"], "value": 50}]
    st, _ = regen({"features": [sk, {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]})
    s = st.status[0]
    assert s["state"] == "warning" and s["warnings"][0]["code"] == "sketch_not_solved"
    assert "D1 is 80 mm but the sketch is drawn at 100 mm" in s["message"] and "D2" not in s["message"]
    sk["constraints"][0]["value"] = 100
    st, _ = regen({"features": [sk]})
    assert st.status[0]["state"] == "ok"
    # an arc whose end is not on its circle (radius 10.2 at the end, 10 at the start)
    ents = [{"id": "c", "type": "point", "x": 0, "y": 0}, {"id": "a", "type": "point", "x": 10, "y": 0},
            {"id": "b", "type": "point", "x": -10.2, "y": 0},
            {"id": "arc", "type": "arc", "center": "c", "start": "a", "end": "b"}, {"id": "l", "type": "line", "p1": "b", "p2": "a"}]
    st, _ = regen({"features": [{"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "entities": ents, "constraints": []}]})
    assert "arc arc ends 0.2 mm off its circle" in st.status[0]["message"]
