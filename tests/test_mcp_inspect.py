"""batch (rollback), body_topology and inspect_design over a real MCP client (borrowed from SolidCraft)."""
import json
import math

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, inspection, server, store
from tests.test_assembly import asm_doc
from tests.test_geometry import circle_ent, rect_sketch
from tests.test_mcp import _rpc

BOX = 80 * 60 * 10
HOLE = math.pi * 25 * 10


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)


@pytest.fixture
def mcp():
    with TestClient(server.app) as c:
        url = f"/mcp/{auth.mcp_token()}"
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                    "clientInfo": {"name": "test", "version": "1"}})

        def call(name, args):
            res = _rpc(c, url, "tools/call", {"name": name, "arguments": args})
            body = json.loads(res["content"][0]["text"])
            if isinstance(body, dict):
                body["_is_error"] = bool(res.get("isError"))
            return body
        call.tools = {t["name"]: t for t in _rpc(c, url, "tools/list")["tools"]}
        yield call


def block():
    return [rect_sketch("s1", {"ref": "Top Plane"}, -40, -30, 40, 30),
            {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10}]


def hole():
    return [{"id": "s2", "type": "sketch", "name": "Sketch2", "plane": {"ref": "Top Plane"}, "constraints": [],
             "entities": circle_ent("s2", 0, 0, 5)},
            {"id": "e2", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s2", "op": "cut", "end": "through_all",
             "dir2": {"end": "through_all"}}]


def test_tools_are_listed(mcp):
    assert {"batch", "body_topology", "inspect_design"} <= set(mcp.tools)
    assert mcp.tools["body_topology"]["annotations"]["readOnlyHint"] is True


def test_batch_saves_one_version_with_stage_results(mcp):
    d = mcp("create_document", {"name": "Block"})
    r = mcp("batch", {"doc_id": d["doc_id"], "summary": "Block with hole", "steps": [
        {"tool": "propose_features", "args": {"mode": "append", "summary": "Block", "features": block()}},
        {"tool": "propose_features", "args": {"mode": "append", "summary": "Hole", "features": hole()}},
    ]})
    assert r["ok"] and not r["_is_error"] and r["completed"] == 2 and r["version"] == 2
    assert abs(r["results"][0]["report"]["volume"] - BOX) < 1e-3          # stage 1 numbers
    assert abs(r["results"][1]["report"]["volume"] - (BOX - HOLE)) < 1e-2  # stage 2 numbers
    rec = store.get(d["doc_id"])
    assert rec["summary"] == "Block with hole" and len(rec["doc"]["features"]) == 4


def test_batch_rolls_back_on_failure_and_names_the_step(mcp):
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    before = store.get(d["doc_id"])
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": [
        {"tool": "propose_features", "args": {"mode": "append", "summary": "Hole", "features": hole()}},
        {"tool": "add_fillet", "args": {"radius": 2, "edges": [{"mid": [500, 500, 500]}]}},  # no such edge
        {"tool": "add_chamfer", "args": {"distance": 1, "edges": [{"mid": [40, 5, 30]}]}},
    ]})
    assert r["_is_error"] and not r["ok"] and r["rolled_back"]
    assert r["completed"] == 1 and r["failed"]["index"] == 1 and r["failed"]["tool"] == "add_fillet"
    assert "Rebuild errors" in r["failed"]["error"]
    after = store.get(d["doc_id"])
    assert after["version"] == before["version"] and after["doc"] == before["doc"]  # nothing of step 0 kept


def test_batch_refuses_bad_steps_before_running(mcp):
    d = mcp("create_document", {"name": "Block"})
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": [
        {"tool": "propose_features", "args": {"mode": "append", "summary": "Block", "features": block()}},
        {"tool": "undo_last_change", "args": {}}]})
    assert r["_is_error"] and r["failed"]["index"] == 1 and "Not a modelling tool" in r["failed"]["error"]
    assert store.get(d["doc_id"])["version"] == 1
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": [{"tool": "add_fillet", "args": {"radius": -3, "edges": []}}]})
    assert r["_is_error"] and r["failed"]["index"] == 0  # refused input (registry check) also rolls back


def test_batch_dry_run_and_existing_errors(mcp):
    d = mcp("create_document", {"name": "Block"})
    broken = block() + [{"id": "x1", "type": "extrude", "name": "Broken", "sketch": "nope", "depth": 5}]
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "replace", "summary": "Broken", "features": broken})
    v = store.get(d["doc_id"])["version"]
    steps = [{"tool": "propose_features", "args": {"mode": "append", "summary": "Hole", "features": hole()}}]
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": steps, "dry_run": True})
    assert r["ok"] and r["dry_run"] and store.get(d["doc_id"])["version"] == v
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": steps})  # the old broken feature is not this batch's fault
    assert r["ok"] and r["version"] == v + 1 and r["clean"] is False


def test_batch_stop_on_warnings(mcp):
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    miss = [{"id": "s9", "type": "sketch", "name": "Far", "plane": {"ref": "Top Plane"}, "constraints": [],
             "entities": circle_ent("s9", 500, 500, 5)},
            {"id": "e9", "type": "extrude", "name": "Missed", "sketch": "s9", "op": "cut", "end": "through_all",
             "dir2": {"end": "through_all"}}]
    steps = [{"tool": "propose_features", "args": {"mode": "append", "summary": "Missed cut", "features": miss}}]
    assert mcp("batch", {"doc_id": d["doc_id"], "steps": steps, "dry_run": True})["ok"]
    r = mcp("batch", {"doc_id": d["doc_id"], "steps": steps, "stop_on_warnings": True})
    assert r["_is_error"] and "Cut removed no material" in r["failed"]["error"]


def test_body_topology_refs_drive_a_fillet(mcp):
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    t = mcp("body_topology", {"doc_id": d["doc_id"], "kind": "edges", "near": [40, 5, 30], "limit": 1})
    e = t["edges"][0]
    assert t["edges_total"] == 12 and e["mid"] == [40.0, 5.0, 30.0] and e["length"] == 10.0
    assert e["face_angle_deg"] == 90.0 and len(e["faces"]) == 2 and "note" in t
    r = mcp("add_fillet", {"doc_id": d["doc_id"], "radius": 3, "edges": [e["ref"]]})
    assert r["clean"]
    removed = 9 * (1 - math.pi / 4) * 10  # r^2 (1 - pi/4) along a 10 mm edge
    assert abs(r["report"]["volume"] - (BOX - removed)) < 1e-2
    f = mcp("body_topology", {"doc_id": d["doc_id"], "kind": "faces", "limit": 50})
    cyl = [x for x in f["faces"] if x["type"] == "cylinder"]
    assert len(cyl) == 1 and cyl[0]["radius"] == 3.0 and abs(abs(cyl[0]["axis"]["dir"][1]) - 1) < 1e-6
    top = next(x for x in f["faces"] if x.get("normal") == [0.0, 1.0, 0.0])
    r = mcp("add_shell", {"doc_id": d["doc_id"], "thickness": 1, "faces": [top["ref"]]})
    assert r["clean"], r


def test_face_point_is_on_the_face_even_with_a_hole():
    from opensketch import geometry
    st, _ = geometry.regen({"features": block() + hole()})
    out = inspection.body_topology(st.part, "faces", limit=50)
    for f in out["faces"]:
        p = geometry.v3(f["point"])
        face = st.part.faces()[f["index"]]
        assert face.is_inside(p, tolerance=1e-3), f  # the top face's centre is in the hole; point is not


def test_inspect_design_part_numbers_and_sketch_dof(mcp):
    d = mcp("create_document", {"name": "Block"})
    feats = block() + hole()
    sk = feats[0]
    sk["constraints"] = [{"id": "h1", "type": "horizontal", "refs": ["s1L0"]}, {"id": "h2", "type": "horizontal", "refs": ["s1L2"]},
                         {"id": "v1", "type": "vertical", "refs": ["s1L1"]}, {"id": "v2", "type": "vertical", "refs": ["s1L3"]},
                         {"id": "v3", "type": "vertical", "refs": ["s1L1"]}]  # v3 repeats v1: over defined
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": feats})
    r = mcp("inspect_design", {"doc_id": d["doc_id"]})
    assert r["kind"] == "part" and r["rebuilt"] and r["clean"]
    b = r["body"]
    assert abs(b["volume_mm3"] - (BOX - HOLE)) < 1e-2 and b["bbox"]["size"] == [80.0, 10.0, 60.0]
    assert b["center_of_mass"] == [0.0, 5.0, 0.0] and b["face_types"] == {"plane": 6, "cylinder": 1}
    assert [t["volume_change_mm3"] for t in r["timeline"] if "volume_change_mm3" in t] == [BOX, round(-HOLE, 3)]
    s1, s2 = r["sketches"]["s1"], r["sketches"]["s2"]
    assert s1["status"] == "over" and s1["conflicts"] and s1["relations"] == 5 and s1["regions"] == 1
    assert s2["status"] == "under" and s2["dof"] == 3 and s2["under"] == ["s2c"]


def test_inspect_design_assembly(mcp):
    rec = store.create("Pin assembly", doc=asm_doc(), by="you")
    r = mcp("inspect_design", {"doc_id": rec["id"]})
    assert r["kind"] == "assembly" and set(r["parts"]) == {"plate", "pin"}
    assert r["parts"]["pin"]["body"]["volume_mm3"] > 0 and "sketches" not in r["parts"]["pin"]
    assert {m["id"] for m in r["mates"]} == {"m1", "m2"}
    assert "c2" in r["under_defined"]  # concentric + coincident leave the pin free to spin
    one = mcp("inspect_design", {"doc_id": rec["id"], "part_id": "pin"})
    assert one["part_id"] == "pin" and "s1" in one["sketches"]
    assert mcp("inspect_design", {"doc_id": rec["id"], "part_id": "nope"})["error"].startswith("Unknown part")
