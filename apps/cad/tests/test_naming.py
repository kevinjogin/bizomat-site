"""Persistent face and edge names (naming.py, idea from SolidCraft): picks survive upstream edits."""
import copy
import math

import pytest

from opensketch import geometry, inspection
from tests.reference_parts.recipes import FRONT, circle_sketch, rect
from tests.test_params import part as param_plate
from tests.test_sweeps import with_vars


def slot(fid, x0, x1, y, r):
    """A straight slot from x0 to x1 (arc centres) at height y, width 2r, on the Front Plane."""
    p = lambda n, x, yy: {"id": f"{fid}{n}", "type": "point", "x": x, "y": yy}  # noqa: E731
    ents = [p("a", x0, y - r), p("b", x1, y - r), p("c", x1, y + r), p("d", x0, y + r), p("c1", x0, y), p("c2", x1, y),
            {"id": f"{fid}l1", "type": "line", "p1": f"{fid}a", "p2": f"{fid}b"},
            {"id": f"{fid}l2", "type": "line", "p1": f"{fid}c", "p2": f"{fid}d"},
            {"id": f"{fid}a1", "type": "arc", "center": f"{fid}c2", "start": f"{fid}b", "end": f"{fid}c"},
            {"id": f"{fid}a2", "type": "arc", "center": f"{fid}c1", "start": f"{fid}d", "end": f"{fid}a"}]
    return {"id": fid, "type": "sketch", "name": fid, "plane": FRONT, "entities": ents, "constraints": []}


def slotted_plate():
    through = {"op": "cut", "end": "through_all", "dir2": {"end": "through_all"}}
    return [rect("s1", FRONT, 0, 0, 100, 40), {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10},
            circle_sketch("s2", FRONT, 20, 20, 4), {"id": "e2", "type": "extrude", "name": "Hole", "sketch": "s2", **through},
            slot("s3", 60, 80, 15, 5), {"id": "e3", "type": "extrude", "name": "Slot", "sketch": "s3", **through},
            {"id": "lp", "type": "linear_pattern", "name": "LPattern1", "features": ["e2"], "direction": "Y", "count": 2,
             "spacing": 10}]



def names_of(doc):
    st, _ = geometry.regen(doc)
    t = inspection.body_topology(st.part, "both", limit=500, namer=st.namer)
    return st, {f["name"] for f in t["faces"]}, {e["name"] for e in t["edges"]}, t


def test_names_by_role():
    st, faces, edges, _ = names_of({"features": slotted_plate()})
    assert {"e1:start", "e1:end", "e1:side:s1L0", "e1:side:s1L1", "e1:side:s1L2", "e1:side:s1L3"} <= faces
    assert "e2:side:s2c" in faces and "e2:side:s2c@lp#2" in faces            # hole and its pattern copy
    assert {"e3:side:s3a1", "e3:side:s3a2", "e3:side:s3l1", "e3:side:s3l2"} <= faces  # the slot's four walls
    assert "e1:end|e1:side:s1L1" in edges and "e1:end|e2:side:s2c@lp#2" in edges


def test_fillet_by_name_survives_a_length_change():
    base = param_plate()
    edge = "e1:end|e1:side:s1L1"  # the top edge of the right-hand side: along Y, as long as the width
    base["features"].append({"id": "f1", "type": "fillet", "name": "Fillet1", "radius": 2,
                             "edges": [{"name": edge, "mid": [80, 30, 10]}]})
    for length in (80, 140, 60):
        doc = with_vars(base, length=length, holes=2)
        st, _ = geometry.regen(doc)
        s = st.status[-1]
        assert s["state"] == "ok", (length, s)
        plain = with_vars(param_plate(), length=length, holes=2)
        v0 = geometry.regen(plain)[0].part.volume
        assert abs((v0 - st.part.volume) - 4 * (1 - math.pi / 4) * 60) < 1e-3, length  # r^2 (1 - pi/4) x width
        bb = st.part.bounding_box()
        assert abs(bb.max.X - length) < 1e-6
    # the old way: a midpoint alone misses once the plate is longer
    mid_only = copy.deepcopy(base)
    mid_only["features"][-1]["edges"] = [{"mid": [80, 30, 10]}]
    st, _ = geometry.regen(with_vars(mid_only, length=140, holes=2))
    assert st.status[-1]["state"] == "error"


def test_unknown_name_falls_back_to_the_position_with_a_warning():
    feats = slotted_plate() + [{"id": "f1", "type": "fillet", "radius": 1, "edges": [{"name": "nope|nope", "mid": [100, 20, 10]}]}]
    st, _ = geometry.regen({"features": feats})
    s = st.status[-1]
    assert s["state"] == "warning" and s["warnings"][0]["code"] == "name_not_found"
    st, _ = geometry.regen({"features": slotted_plate() + [{"id": "f1", "type": "fillet", "radius": 1, "edges": [{"name": "nope|nope"}]}]})
    assert st.status[-1]["state"] == "error"


def test_split_faces_blends_and_shells_are_named():
    through = {"op": "cut", "end": "through_all", "dir2": {"end": "through_all"}}
    feats = [rect("s1", FRONT, 0, 0, 100, 40), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10},
             rect("s2", FRONT, 45, -5, 55, 45), {"id": "e2", "type": "extrude", "sketch": "s2", **through}]
    st, faces, edges, t = names_of({"features": feats})  # the cut splits the plate in two
    tops = sorted(n for n in faces if n.startswith("e1:end"))
    assert len(tops) == 2 and all("#[" in n for n in tops) and tops[0] != tops[1]
    feats2 = [rect("s1", FRONT, 0, 0, 40, 30), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20},
              {"id": "f1", "type": "fillet", "radius": 3, "edges": [{"name": "e1:side:s1L0|e1:side:s1L1"}]},
              {"id": "sh", "type": "shell", "thickness": 2, "faces": [{"name": "e1:end"}]}]
    st, faces, edges, t = names_of({"features": feats2})
    assert st.status[-1]["state"] == "ok" and st.status[-2]["state"] == "ok"
    assert "f1:blend:e1:side:s1L0|e1:side:s1L1" in faces
    assert {"sh:inner:e1:start", "sh:inner:e1:side:s1L0"} <= faces
    rim = [f for f in t["faces"] if f["name"] == "e1:end"]  # the top is now only the 2 mm rim around the opening
    assert len(rim) == 1 and rim[0]["area"] < 40 * 30 - 36 * 26 + 1


def test_names_survive_reordering_upstream():
    """Inserting a feature before the fillet changes face and edge order, not the fillet's edge."""
    base = [rect("s1", FRONT, 0, 0, 60, 40), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10}]
    fillet = {"id": "f1", "type": "fillet", "radius": 2, "edges": [{"name": "e1:end|e1:side:s1L2"}]}
    v1 = geometry.regen({"features": base + [fillet]})[0].part.volume
    extra = [circle_sketch("s9", FRONT, 30, 20, 5), {"id": "e9", "type": "extrude", "sketch": "s9", "op": "cut", "end": "through_all",
                                                      "dir2": {"end": "through_all"}}]
    st, _ = geometry.regen({"features": base + extra + [fillet]})
    assert st.status[-1]["state"] == "ok"
    assert abs((v1 - st.part.volume) - math.pi * 25 * 10) < 1e-3  # same fillet, plus the hole


BOX_RANGES = {"L": (40, 160), "W": (30, 90), "H": (15, 60), "t": (1, 5)}


def box_part():
    sk = rect("s1", FRONT, 0, 0, 80, 50)
    sk["constraints"] = [
        {"id": "h1", "type": "horizontal", "refs": ["s1L0"]}, {"id": "h2", "type": "horizontal", "refs": ["s1L2"]},
        {"id": "v1", "type": "vertical", "refs": ["s1L1"]}, {"id": "v2", "type": "vertical", "refs": ["s1L3"]},
        {"id": "k0", "type": "coincident", "refs": ["s1a", "origin"]},
        {"id": "D1", "type": "distance", "refs": ["s1L0"], "value": 80, "eq": "L"},
        {"id": "D2", "type": "distance", "refs": ["s1L1"], "value": 50, "eq": "W"}]
    return {"parameters": [{"name": "L", "expression": "80"}, {"name": "W", "expression": "50"},
                           {"name": "H", "expression": "30"}, {"name": "t", "expression": "2"}],
            "features": [sk, {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 30, "eq": {"depth": "H"}},
                         {"id": "sh", "type": "shell", "thickness": 2, "eq": {"thickness": "t"}, "faces": [{"name": "e1:end"}]}]}


@pytest.mark.parametrize("name", list(BOX_RANGES))
def test_open_box_sweep_keeps_its_opening(name):
    """The shell's open face is picked by name, so it stays the top through every size."""
    vals = {"L": 80, "W": 50, "H": 30, "t": 2}
    lo, hi = BOX_RANGES[name]
    for x in (lo, hi, vals[name]):
        v = dict(vals, **{name: x})
        st, _ = geometry.regen(with_vars(box_part(), **v))
        assert all(s["state"] == "ok" for s in st.status), (name, x, st.status)
        want = v["L"] * v["W"] * v["H"] - (v["L"] - 2 * v["t"]) * (v["W"] - 2 * v["t"]) * (v["H"] - v["t"])
        assert abs(st.part.volume - want) < 1e-6 * want, (name, x)


