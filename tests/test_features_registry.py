"""The feature registry: one description per feature gives the PropertyManager data, the AI tools and
help, the MCP tools, input checks and the rebuild (Draft is the first feature added only through it)."""
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import ai, demo, features, geometry, server, store


def block(w=40, d=20, h=10):
    """A w x d block standing on the Top Plane, h tall along +Y."""
    pts = [(-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)]
    ents = [{"id": "origin", "type": "point", "x": 0, "y": 0}]
    ents += [{"id": f"p{i}", "type": "point", "x": x, "y": y} for i, (x, y) in enumerate(pts)]
    ents += [{"id": f"l{i}", "type": "line", "p1": f"p{i}", "p2": f"p{(i + 1) % 4}"} for i in range(4)]
    return {"version": 1, "type": "part", "name": "Block", "units": "mm", "features": [
        {"id": "s1", "name": "Sketch1", "type": "sketch", "plane": {"ref": "Top Plane"}, "entities": ents, "constraints": []},
        {"id": "e1", "name": "Boss-Extrude1", "type": "extrude", "sketch": "s1", "op": "boss", "end": "blind", "depth": h}]}


SIDES = [{"center": [20, 5, 0], "normal": [1, 0, 0]}, {"center": [-20, 5, 0], "normal": [-1, 0, 0]}]


def test_every_command_has_one_description():
    assert {"plane", "extrude", "revolve", "fillet", "chamfer", "shell", "mirror", "linear_pattern",
            "circular_pattern", "draft"} <= set(features.REGISTRY)
    pub = features.public()
    assert pub["draft"]["ui"] == "generated" and pub["extrude"]["ui"] == "custom"
    assert [p["name"] for p in pub["draft"]["params"]] == ["angle", "neutral_plane", "reverse", "faces"]
    # the AI gets a tool and a help line per feature, from the same description
    names = {t["name"] for t in ai.TOOLS}
    assert {f"add_{t}" for t in features.REGISTRY} <= names
    assert '- draft: {"type":"draft"' in ai.SYSTEM and '- extrude: {"type":"extrude"' in ai.SYSTEM
    sch = next(t for t in ai.TOOLS if t["name"] == "add_draft")["input_schema"]
    assert sch["required"] == ["neutral_plane", "faces"] and sch["properties"]["angle"]["maximum"] == 45


def test_draft_rebuilds():
    doc = block()
    doc["features"].append({"id": "d1", "name": "Draft1", "type": "draft", "neutral_plane": {"ref": "Top Plane"},
                            "angle": 5, "faces": SIDES})
    st, _ = geometry.regen(doc)
    assert [s["state"] for s in st.status] == ["ok", "ok", "ok"]
    # two 20 x 10 side faces each lose a wedge of 0.5 * 10 * tan(5 deg) * 10 * 20
    assert st.part.volume == pytest.approx(8000 - 2 * 0.5 * 10 * 10 * 20 * 0.0874887, rel=1e-4)
    bb = st.part.bounding_box()
    assert bb.max.X == pytest.approx(20) and bb.min.Y == pytest.approx(0)  # full size at the neutral plane
    doc["features"][-1]["reverse"] = True  # pull the other way: the faces lean out
    st, _ = geometry.regen(doc)
    assert st.part.volume > 8000
    doc["features"][-1]["faces"] = [{"center": [0, 10, 0], "normal": [0, 1, 0]}]  # parallel to the neutral plane
    st, _ = geometry.regen(doc)
    assert st.status[-1]["state"] == "error" and "parallel" in st.status[-1]["message"]


def test_validation_messages():
    assert features.validate({"type": "draft", "neutral_plane": {"ref": "Top Plane"}, "faces": SIDES, "angle": 3}) == []
    probs = features.validate({"id": "d", "type": "draft", "angle": 90, "faces": "all"})
    assert any("angle must be at most 45" in p for p in probs)
    assert any("neutral_plane is required" in p for p in probs)
    assert any("faces must be a list" in p for p in probs)
    assert "unknown feature type 'rib'" in features.validate({"type": "rib"})[0]
    # `when`: a chamfer's second distance is only checked in distance-distance mode
    assert features.validate({"type": "chamfer", "edges": [{"mid": [0, 0, 0]}], "distance2": -1}) == []
    assert features.validate({"type": "chamfer", "edges": [{"mid": [0, 0, 0]}], "mode": "distance_distance", "distance2": -1})
    # everything the demo sessions write passes
    for f in demo.bracket_features() + demo.base_part() + demo.cylinder_part():
        assert features.validate(f) == [], f


def test_ai_reports_input_problems():
    s = ai.Session(block())
    rep, clean, _ = s.propose_features({"mode": "append", "summary": "x", "features": [
        {"id": "d1", "type": "draft", "neutral_plane": {"ref": "Top Plane"}, "angle": "steep", "faces": SIDES}]})
    assert not clean and "angle must be a number" in json.loads(rep)["input_problems"][0]


def test_add_draft_tool_streams_and_appends():
    s = ai.Session(block())
    rep, clean, events = s.apply("add_draft", {"neutral_plane": {"ref": "Top Plane"}, "faces": SIDES, "angle": 3})
    assert clean, rep
    f = s.work["features"][-1]
    assert f["type"] == "draft" and f["name"] == "Draft1" and f["angle"] == 3 and f["reverse"] is False
    assert [e["ev"] for e in events] == ["build_start", "build_step", "proposal"]
    assert events[0]["mode"] == "part" and events[1]["feature"]["name"] == "Draft1" and "body" in events[1]
    assert json.loads(rep)["volume"] < 8000
    rep, clean, events = s.apply("add_draft", {"faces": SIDES})
    assert not clean and "neutral_plane is required" in rep and not events
    # the same tool on an assembly needs a part
    asm = ai._working_assembly(block())
    s = ai.Session(asm)
    pid = next(iter(asm["parts"]))
    rep, clean, _ = s.apply("add_draft", {"neutral_plane": {"ref": "Top Plane"}, "faces": SIDES})
    assert not clean and "part_id" in rep
    rep, clean, events = s.apply("add_fillet", {"part_id": pid, "radius": 1, "edges": [{"mid": [20, 10, 0]}]})
    assert clean, rep
    assert s.work["parts"][pid]["features"][-1]["name"] == "Fillet1"
    assert events[0]["mode"] == "asm" and events[-1]["ev"] == "assembly"


def test_mcp_and_browser_get_the_same_list(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    from opensketch import auth
    from tests.test_mcp import _rpc
    with TestClient(server.app) as c:
        assert c.get("/api/features").json()["draft"]["title"] == "Draft"
        url = f"/mcp/{auth.mcp_token()}"
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                    "clientInfo": {"name": "test", "version": "1"}})
        tools = {t["name"]: t for t in _rpc(c, url, "tools/list")["tools"]}
        assert set(tools["add_draft"]["inputSchema"]["required"]) == {"doc_id", "neutral_plane", "faces"}
        rec = store.create("Block", block())
        out = _rpc(c, url, "tools/call", {"name": "add_draft", "arguments": {
            "doc_id": rec["id"], "neutral_plane": {"ref": "Top Plane"}, "faces": SIDES, "angle": 2}})
        r = json.loads(out["content"][0]["text"])
        assert r["clean"] and r["version"] == 2
        saved = store.get(rec["id"])
        assert saved["doc"]["features"][-1]["type"] == "draft" and saved["by"] == "claude"


def test_circular_pattern_axis_object_without_origin():
    from opensketch import features, geometry
    from tests.test_geometry import circle_ent, rect_sketch
    feats = [rect_sketch("s1", {"ref": "Top Plane"}, -50, -50, 50, 50), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 5},
             {"id": "s2", "type": "sketch", "plane": {"ref": "Top Plane"}, "entities": circle_ent("c", 30, 0, 3), "constraints": []},
             {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
             {"id": "p", "type": "circular_pattern", "features": ["e2"], "axis": {"dir": [0, 1, 0]}, "count": 4}]
    assert features.validate(feats[-1]) == []
    st, _ = geometry.regen({"features": feats})
    assert all(s["state"] == "ok" for s in st.status)
    assert features.validate({**feats[-1], "axis": {"dir": [0, 0, 0]}})
