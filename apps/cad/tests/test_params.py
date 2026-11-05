"""Global variables and equations (params.py): evaluation, sketch re-solve, rebuild, MCP tools."""
import math

import pytest

from opensketch import geometry, params
from tests.reference_parts.recipes import FRONT, circle_sketch, rect


def defined_rect(length=80, width=60):
    """A rectangle with its corner on the origin, fully defined by D1 (length) and D2 (width)."""
    sk = rect("s1", FRONT, 0, 0, length, width)
    sk["constraints"] = [
        {"id": "h1", "type": "horizontal", "refs": ["s1L0"]}, {"id": "h2", "type": "horizontal", "refs": ["s1L2"]},
        {"id": "v1", "type": "vertical", "refs": ["s1L1"]}, {"id": "v2", "type": "vertical", "refs": ["s1L3"]},
        {"id": "k0", "type": "coincident", "refs": ["s1a", "origin"]},
        {"id": "D1", "name": "D1", "type": "distance", "refs": ["s1L0"], "value": length, "eq": "length"},
        {"id": "D2", "name": "D2", "type": "distance", "refs": ["s1L1"], "value": width, "eq": "width"}]
    return sk


def part(length="80", width="60", thick="10", holes="2"):
    return {"name": "Plate", "parameters": [
        {"name": "length", "expression": length, "unit": "mm"}, {"name": "width", "expression": width, "unit": "mm"},
        {"name": "thick", "expression": thick, "unit": "mm", "comment": "5 to 20"},
        {"name": "holes", "expression": holes, "unit": ""}],
        "features": [defined_rect(), {"id": "e1", "type": "extrude", "name": "Boss", "sketch": "s1", "depth": 10, "eq": {"depth": "thick"}},
                     circle_sketch("s2", FRONT, 10, 10, 3),
                     {"id": "e2", "type": "extrude", "name": "Hole", "sketch": "s2", "op": "cut", "end": "through_all",
                      "dir2": {"end": "through_all"}},
                     {"id": "lp", "type": "linear_pattern", "name": "LPattern1", "features": ["e2"], "direction": "X",
                      "count": 2, "spacing": 20, "eq": {"count": "holes", "spacing": "(length - 20) / max(holes - 1, 1)"}}]}


def volume(doc):
    st, _ = geometry.regen(doc)
    bad = [s for s in st.status if s["state"] == "error"]
    return (st.part.volume if st.part is not None else None), bad, st


@pytest.mark.parametrize("expr,vals,want", [
    ("2 + 3 * 4", {}, 14), ("2^3", {}, 8), ("1in", {}, 25.4), ("90deg", {}, 90), ("pi/2 rad", {}, None),
    ("w/2 - 6", {"w": 40}, 14), ("sqrt(16) + abs(-1)", {}, 5), ("sin(30)", {}, 0.5), ("max(1, 2, 3)", {}, 3),
    ("=2cm", {}, 20),
])
def test_expressions(expr, vals, want):
    if want is None:
        assert abs(params.evaluate_expr("1 rad", {}) - 180 / math.pi) < 1e-9
        return
    assert abs(params.evaluate_expr(expr, vals) - want) < 1e-9


@pytest.mark.parametrize("bad", ["__import__('os')", "a.b", "open('x')", "1/0", "2 ** 1000", "[1, 2]", "x if 1 else 2", "",
                                 "(-8)^(1/3)", "(-a)^0.5", "floor(1e308*10)", "round(1e308*10)", "ceil(-1e309)", "(1e200)^2",
                                 "sqrt(-1)", "1e308 * 10"])
def test_expressions_refused(bad):
    with pytest.raises(params.ExprError):
        params.evaluate_expr(bad, {"a": 1})


def test_variables_order_cycles_and_names():
    vals, probs = params.variables({"parameters": [{"name": "b", "expression": "a * 2"}, {"name": "a", "expression": "3"},
                                                   {"name": "c", "expression": "d + 1"}, {"name": "d", "expression": "c"},
                                                   {"name": "e", "expression": "zz"}, {"name": "sin", "expression": "1"},
                                                   {"name": "f", "expression": "c + 1"}]})
    assert vals == {"a": 3, "b": 6}
    assert "Circular" in probs["c"] and "Circular" in probs["d"] and "Unknown name" in probs["e"]
    assert "reserved" in probs["sin"] and "has a problem" in probs["f"]


def test_rebuild_follows_equations_and_resolves_sketch():
    doc = part()
    v, bad, st = volume(doc)
    assert not bad and abs(v - (80 * 60 * 10 - 2 * math.pi * 9 * 10)) < 1e-3
    doc = part(length="120", thick="5", holes="4")
    v, bad, st = volume(doc)  # the sketch is re-solved with D1 = 120 by the sketch solver
    assert not bad, bad
    bb = st.part.bounding_box()
    assert abs(bb.max.X - 120) < 1e-6 and abs(bb.max.Z - 5) < 1e-6
    assert abs(v - (120 * 60 * 5 - 4 * math.pi * 9 * 5)) < 1e-3
    rec = {r["field"]: r["new"] for r in st.params["recomputed"]}
    assert rec["D1"] == 120 and rec["count"] == 4 and rec["spacing"] == pytest.approx(100 / 3)


def test_bad_equations_turn_the_feature_red():
    v, bad, st = volume(part(holes="2.5"))
    assert [b["id"] for b in bad] == ["lp"] and "whole number" in bad[0]["message"]
    v, bad, st = volume(part(thick="-1"))
    assert "e1" in [b["id"] for b in bad] and "at least" in next(b for b in bad if b["id"] == "e1")["message"]
    v, bad, st = volume(part(width="nope"))
    assert any(b["id"] == "s1" and "has a problem" in b["message"] for b in bad)




def test_a_bad_expression_marks_its_feature_and_the_rest_rebuilds():
    """gap = (w - 40)^0.5 with w = 30 is a complex number in Python: the rebuild reports it instead of failing with a TypeError."""
    doc = part()
    doc["parameters"].append({"name": "gap", "expression": "(length - 90)^0.5", "unit": "mm"})
    doc["features"][1]["eq"] = {"depth": "gap"}
    vol, bad, st = volume(doc)
    assert bad[0]["id"] == "e1" and "'gap', which has a problem" in bad[0]["message"]  # the later features lose their body
    assert "fractional power" in params.table(doc)[-1]["problem"]


def triangle(third="w"):
    """Sides 10 and 10 and a third side driven by a variable: 30 cannot be a triangle."""
    pts = [("a", 0, 0), ("b", 10, 0), ("c", 5, 8.660254)]
    ents = [{"id": i, "type": "point", "x": x, "y": y} for i, x, y in pts]
    ents += [{"id": f"l{k}", "type": "line", "p1": pts[k][0], "p2": pts[(k + 1) % 3][0]} for k in range(3)]
    cons = [{"id": "k", "type": "coincident", "refs": ["a", "origin"]}, {"id": "h", "type": "horizontal", "refs": ["l0"]},
            {"id": "D1", "name": "D1", "type": "distance", "refs": ["l0"], "value": 10},
            {"id": "D2", "name": "D2", "type": "distance", "refs": ["l1"], "value": 10},
            {"id": "D3", "name": "D3", "type": "distance", "refs": ["l2"], "value": 10, "eq": third}]
    return {"parameters": [{"name": "w", "expression": "10", "unit": "mm"}], "features": [
        {"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "entities": ents, "constraints": cons},
        {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5}]}


def test_a_dimension_the_sketch_cannot_take_is_not_stored_as_built():
    doc = triangle()
    doc["parameters"][0]["expression"] = "30"
    for _ in range(2):  # copy the features as built, then rebuild again: still an error, D3 still 10
        res = geometry.regen_result(doc)
        assert next(s for s in res["status"] if s["id"] == "s1")["state"] == "error"
        for f in (res.get("equations") or {}).get("features", {}).values():
            doc["features"] = [f if g["id"] == f["id"] else g for g in doc["features"]]
        assert doc["features"][0]["constraints"][4]["value"] == 10
    doc["parameters"][0]["expression"] = "12"
    st, _ = geometry.regen(doc)
    assert all(s["state"] == "ok" for s in st.status)
    c = next(e for e in st.evaluated["features"][0]["entities"] if e["id"] == "c")
    assert math.hypot(c["x"], c["y"]) == pytest.approx(12)


def test_an_equation_drives_an_angle_past_90_degrees():
    t = math.radians(30)
    ents = [{"id": "a", "type": "point", "x": 50, "y": 0}, {"id": "c", "type": "point", "x": 50 * math.cos(t), "y": 50 * math.sin(t)},
            {"id": "l1", "type": "line", "p1": "origin", "p2": "a"}, {"id": "l2", "type": "line", "p1": "origin", "p2": "c"}]
    cons = [{"id": "h", "type": "horizontal", "refs": ["l1"]},
            {"id": "L1", "type": "distance", "refs": ["l1"], "value": 50}, {"id": "L2", "type": "distance", "refs": ["l2"], "value": 50},
            {"id": "A", "name": "A", "type": "angle", "refs": ["l1", "l2"], "value": 30, "eq": "ang"}]
    doc = {"parameters": [{"name": "ang", "expression": "150", "unit": "deg"}],
           "features": [{"id": "s1", "type": "sketch", "plane": {"ref": "Front Plane"}, "entities": ents, "constraints": cons}]}
    new, report = params.evaluate(doc)
    assert not report["problems"]
    c = next(e for e in new["features"][0]["entities"] if e["id"] == "c")
    assert math.degrees(math.atan2(c["y"], c["x"])) == pytest.approx(150, abs=1e-6)
