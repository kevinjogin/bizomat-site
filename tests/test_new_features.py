"""Analytical geometry checks for the newly enabled modelling commands."""
import math

import pytest

from opensketch.geometry import regen, regen_result, export
from opensketch import sldexport
from tests.test_geometry import rect_sketch, circle_ent, ok


def circle(fid, radius, z=0):
    return {"id": fid, "type": "sketch", "name": fid,
            "plane": {"type": "fixed", "origin": [0, 0, z], "normal": [0, 0, 1], "xdir": [1, 0, 0]},
            "entities": circle_ent(fid, 0, 0, radius), "constraints": []}


def path():
    return {"id": "path", "name": "Path", "type": "sketch", "plane": {"ref": "Right Plane"},
            "entities": [{"id": "a", "type": "point", "x": 0, "y": 0},
                         {"id": "b", "type": "point", "x": -20, "y": 0},
                         {"id": "l", "type": "line", "p1": "a", "p2": "b"}], "constraints": []}


def block():
    return [rect_sketch("base", {"ref": "Front Plane"}, -20, -20, 20, 20),
            {"id": "boss", "type": "extrude", "name": "Boss", "sketch": "base", "depth": 20}]


@pytest.mark.parametrize("kind", ["sweep", "loft"])
@pytest.mark.parametrize("cut", [False, True])
def test_sweep_and_loft_volumes_preview_and_export(kind, cut, tmp_path):
    profiles = [circle("s1", 2), path()] if kind == "sweep" else [circle("s1", 2), circle("s2", 4, 20)]
    feature = {"id": "f", "name": kind, "type": kind, "op": "cut" if cut else "boss"}
    feature.update({"sketch": "s1", "path": "path"} if kind == "sweep" else {"profiles": ["s1", "s2"]})
    doc = {"name": kind, "features": (block() if cut else []) + profiles}
    preview = regen_result(doc, feature)
    assert preview["tool"]["faces"] and preview["status"][-1]["state"] == "ok"
    assert bool(preview["body"]["faces"]) == cut
    doc["features"].append(feature)
    st, _ = regen(doc)
    ok(st)
    expected = math.pi * 4 * 20 if kind == "sweep" else math.pi * 20 / 3 * (4 + 8 + 16)
    if cut:
        expected = 32000 - expected
    assert st.part.volume == pytest.approx(expected, rel=1e-7)
    assert st.part.is_valid
    export(doc, "step", str(tmp_path / "model.step"))
    assert (tmp_path / "model.step").stat().st_size > 0
    with pytest.raises(sldexport.Unsupported):
        sldexport.translate_part(doc, "test")


@pytest.mark.parametrize("style", ["simple", "counterbore", "countersink"])
@pytest.mark.parametrize("reverse", [False, True])
def test_hole_volume_and_direction(style, reverse):
    hole = {"id": "hole", "type": "hole", "style": style, "diameter": 6,
            "plane": {"type": "fixed", "origin": [0, 0, 20 if reverse else 0], "normal": [0, 0, 1], "xdir": [1, 0, 0]},
            "reverse": reverse, "end": "through_all", "x": 7, "y": -5,
            "bore_diameter": 10, "bore_depth": 4, "sink_diameter": 12, "sink_angle": 90}
    doc = {"features": block() + [hole]}
    st, _ = regen(doc)
    ok(st)
    removed = math.pi * 9 * 20
    if style == "counterbore":
        removed += math.pi * (25 - 9) * 4
    elif style == "countersink":
        removed += math.pi * 3 / 3 * (36 + 18 + 9) - math.pi * 9 * 3
    assert st.part.volume == pytest.approx(32000 - removed, rel=1e-7)
    assert len(st.part.solids()) == 1 and st.part.is_valid


def test_blind_hole_pattern_and_edit():
    hole = {"id": "h", "type": "hole", "plane": {"ref": "Front Plane"}, "x": -10,
            "diameter": 4, "end": "blind", "depth": 6}
    doc = {"features": block() + [hole, {"id": "p", "type": "linear_pattern", "features": ["h"], "direction": "X", "count": 3, "spacing": 10}]}
    st, _ = regen(doc)
    ok(st)
    assert st.part.volume == pytest.approx(32000 - 3 * math.pi * 4 * 6)
    hole["depth"] = 9
    st, _ = regen(doc)
    ok(st)
    assert st.part.volume == pytest.approx(32000 - 3 * math.pi * 4 * 9)


@pytest.mark.parametrize("params", [{"diameter": -2}, {"x": 100}, {"reverse": True},
                                   {"style": "counterbore", "bore_diameter": 2, "bore_depth": 1},
                                   {"style": "countersink", "sink_diameter": 10, "sink_angle": 180}])
def test_invalid_hole_keeps_previous_body(params):
    hole = {"id": "h", "type": "hole", "plane": {"ref": "Front Plane"}, "diameter": 4, "depth": 10, **params}
    st, _ = regen({"features": block() + [hole]})
    assert st.status[-1]["state"] == "error" and st.part.volume == pytest.approx(32000)


def test_sweep_path_and_loft_section_validation():
    p = path()
    p["entities"][-1]["construction"] = True
    st, _ = regen({"features": [circle("s1", 2), p, {"id": "f", "type": "sweep", "sketch": "s1", "path": "path"}]})
    assert st.part is None and "connected chain" in st.status[-1]["message"]
    for profiles in [["s1"], ["s1", "s1"]]:
        st, _ = regen({"features": [circle("s1", 2), {"id": "f", "type": "loft", "profiles": profiles}]})
        assert st.part is None and "two different" in st.status[-1]["message"]
    ring = circle("s1", 4)
    ring["entities"] += circle_ent("inner", 0, 0, 2)
    st, _ = regen({"features": [ring, circle("s2", 5, 20), {"id": "f", "type": "loft", "profiles": ["s1", "s2"]}]})
    assert st.part is None and "inner contours" in st.status[-1]["message"]


def test_registry_gives_the_new_features_ai_and_mcp_tools():
    """Merged with the feature registry: help lines, input checks and add_<type> tools for Claude."""
    from opensketch import features
    from opensketch.ai import SYSTEM
    for t in ("sweep", "loft", "hole"):
        assert t in features.REGISTRY and f"- {t}:" in SYSTEM
    assert features.validate({"type": "hole", "plane": {"ref": "Top Plane"}})[0].endswith("is required (Hole diameter (mm))")
    assert features.validate({"type": "loft", "name": "Loft1"}) == ["Loft1: profiles is required (Profile sketch ids in section order (at least two different sketches))"]


def test_add_hole_over_mcp(tmp_path, monkeypatch):
    import json
    from fastapi.testclient import TestClient
    from opensketch import auth, server
    from tests.test_mcp import _rpc
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    with TestClient(server.app) as c:
        url = f"/mcp/{auth.mcp_token()}"
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
        names = {t["name"] for t in _rpc(c, url, "tools/list")["tools"]}
        assert {"add_sweep", "add_loft", "add_hole"} <= names
        call = lambda n, a: json.loads(_rpc(c, url, "tools/call", {"name": n, "arguments": a})["content"][0]["text"])  # noqa: E731
        d = call("create_document", {"name": "Plate"})
        call("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
        r = call("add_hole", {"doc_id": d["doc_id"], "plane": {"type": "fixed", "origin": [0, 0, 20], "normal": [0, 0, 1], "xdir": [1, 0, 0]},
                              "diameter": 6, "end": "through_all", "reverse": True})
        assert r["clean"] and r["report"]["volume"] == pytest.approx(32000 - math.pi * 9 * 20, rel=1e-7)


def test_delete_plan_follows_sweep_paths_and_loft_profiles():
    from opensketch import edits
    sweep = {"features": [circle("s1", 2), path(), {"id": "f", "type": "sweep", "sketch": "s1", "path": "path"}]}
    plan = edits.plan_delete(sweep, ["path"])
    assert plan["deleted_with_it"] == ["f"] and plan["absorbed"] == ["s1"]
    loft = {"features": [circle("s1", 2), circle("s2", 4, 20), {"id": "f", "type": "loft", "profiles": ["s1", "s2"]}]}
    plan = edits.plan_delete(loft, ["f"])
    assert plan["deleted_with_it"] == [] and sorted(plan["absorbed"]) == ["s1", "s2"]
