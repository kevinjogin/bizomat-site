"""Parameter sweeps (idea from SolidCraft's checking skill): push each driving variable to both ends of its
range and back. Every state must rebuild with no errors, sketches carrying equations must stay fully
defined, the volume must match a hand formula, and coming back must give the original part exactly.
Also the known traps: a dimension driven to 0 or below, and a fractional count, must fail loudly instead
of quietly mirroring or rounding the geometry.
"""
import copy
import math

import pytest

from opensketch import geometry, inspection
from tests.test_params import part as plate_part

# variable: (low, high) of the sensible range
PLATE_RANGES = {"length": (60, 200), "width": (30, 100), "thick": (2, 20), "holes": (1, 5)}


def plate_volume(v):
    return v["length"] * v["width"] * v["thick"] - v["holes"] * math.pi * 9 * v["thick"]


def with_vars(doc, **vals):
    d = copy.deepcopy(doc)
    for p in d["parameters"]:
        if p["name"] in vals:
            p["expression"] = str(vals[p["name"]])
    return d


def build(doc):
    st, _ = geometry.regen(doc)
    errors = [(s["id"], s.get("message")) for s in st.status if s["state"] == "error"]
    return st, errors


@pytest.mark.parametrize("name", list(PLATE_RANGES))
def test_plate_sweep(name):
    base = plate_part()
    values = {"length": 80, "width": 60, "thick": 10, "holes": 2}
    st0, err = build(base)
    assert not err
    v0 = st0.part.volume
    lo, hi = PLATE_RANGES[name]
    for x in (lo, hi, values[name]):  # both ends, then back
        vals = dict(values, **{name: x})
        doc = with_vars(base, **vals)
        st, err = build(doc)
        assert not err, (name, x, err)
        assert abs(st.part.volume - plate_volume(vals)) < 1e-3 * max(1, plate_volume(vals) / 1e4), (name, x)
        bb = st.part.bounding_box()
        assert abs(bb.max.X - vals["length"]) < 1e-6 and abs(bb.max.Y - vals["width"]) < 1e-6
        evaluated = st.evaluated
        driven = [f for f in evaluated["features"] if f["type"] == "sketch" and any(c.get("eq") for c in f["constraints"])]
        solved, note = inspection.solve_sketches(driven)
        assert note is None and all(solved[f["id"]]["dof"] == 0 for f in driven), (name, x, solved)
    assert abs(st.part.volume - v0) < 1e-9  # back where it started, exactly


@pytest.mark.parametrize("vals,where,msg", [
    ({"length": 0}, "s1", "more than 0"),           # a dimension driven to 0 must not collapse or flip
    ({"width": -30}, "s1", "more than 0"),          # a negative length must not mirror the sketch
    ({"holes": 2.5}, "lp", "whole number"),         # a fractional count must not be rounded quietly
    ({"holes": 0}, "lp", "at least 1"),
    ({"thick": 0}, "e1", "at least"),
])
def test_traps_fail_loudly(vals, where, msg):
    st, err = build(with_vars(plate_part(), **vals))
    hit = [m for i, m in err if i == where]
    if not hit and where == "e1":  # depth 0 passes the registry (min 0) and the rebuild refuses it
        hit = [m for i, m in err if i == "e1"]
    assert hit and (msg in hit[0] or "greater than 0" in hit[0]), err
