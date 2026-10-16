"""Global variables and equations (params.py): evaluation, sketch re-solve, rebuild, MCP tools."""
import math

import pytest

from opensketch import geometry, params, store
from tests.reference_parts.recipes import FRONT, circle_sketch, rect
from tests.test_mcp_inspect import data, mcp  # noqa: F401  (fixtures)


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


@pytest.mark.parametrize("bad", ["__import__('os')", "a.b", "open('x')", "1/0", "2 ** 1000", "[1, 2]", "x if 1 else 2", ""])
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
    v, bad, st = volume(doc)  # the sketch is re-solved with D1 = 120 by the browser's solver
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


def test_mcp_set_parameter_and_equation(mcp):
    d = mcp("create_document", {"name": "Plate"})
    doc = d["doc_id"]
    p = part()
    feats = p["features"]
    for f in feats:  # build without equations first, then add them through the tools
        f.pop("eq", None)
        for c in f.get("constraints", []):
            c.pop("eq", None)
    mcp("propose_features", {"doc_id": doc, "mode": "append", "summary": "Plate", "features": feats})
    for n, e in (("length", "80"), ("width", "60"), ("thick", "10")):
        r = mcp("set_parameter", {"doc_id": doc, "name": n, "expression": e})
        assert r["clean"], r
    r = mcp("set_equation", {"doc_id": doc, "feature": "s1", "field": "D1", "expression": "length"})
    assert r["clean"] and r["report"]["equations"][0]["expression"] == "length"
    r = mcp("set_equation", {"doc_id": doc, "feature": "Boss", "field": "depth", "expression": "=thick"})
    assert r["clean"]
    r = mcp("set_parameter", {"doc_id": doc, "name": "length", "expression": "100"})
    rep = r["report"]
    assert r["clean"] and abs(rep["bbox_max"][0] - 100) < 1e-6
    assert {"feature": "s1", "field": "D1", "old": 80, "new": 100} in rep["recomputed"]
    row = next(x for x in rep["parameters"] if x["name"] == "length")
    assert row["value"] == 100 and row["used_by"] == ["D1@s1"]
    stored = store.get(doc)["doc"]  # the stored numbers follow, so the browser shows what is built
    assert next(c for c in stored["features"][0]["constraints"] if c["id"] == "D1")["value"] == 100
    r = mcp("set_parameter", {"doc_id": doc, "name": "thick", "remove": True})
    assert "used by depth@Boss" in str(r)
    r = mcp("set_parameter", {"doc_id": doc, "name": "loop", "expression": "loop + 1"})
    assert "Circular" in str(r)
    r = mcp("set_equation", {"doc_id": doc, "feature": "Boss", "field": "colour", "expression": "1"})
    assert "no number" in str(r)
    ins = mcp("inspect_design", {"doc_id": doc})
    assert {x["name"] for x in ins["parameters"]} == {"length", "width", "thick"} and len(ins["equations"]) == 2
    r = mcp("batch", {"doc_id": doc, "steps": [{"tool": "set_parameter", "args": {"name": "thick", "expression": "-3"}}]})
    assert r["_is_error"] and "at least" in r["failed"]["error"]
