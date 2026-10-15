"""AI on imported geometry, Toolbox parts and bought-part requests (fake streaming client)."""
import json
from types import SimpleNamespace as NS

from build123d import Box, export_step

from opensketch import ai, importer
from tests.test_ai_stream import FakeMessages, say, use
from tests.test_assembly import rect_sketch


def run(monkeypatch, doc, script, prompt="x"):
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    return list(ai.run_stream(doc, prompt)), fake


def imported_block(tmp_path):
    p = tmp_path / "b.step"
    export_step(Box(60, 20, 40), str(p))
    return importer.import_step(p.read_bytes(), "b.step")


def tool_result(fake, tid):
    msgs = fake.calls[-1]["messages"]
    return next(c for m in msgs if m["role"] == "user" and isinstance(m["content"], list) for c in m["content"] if c["tool_use_id"] == tid)["content"]


def test_rebuild_imported_part_as_features(monkeypatch, tmp_path):
    doc = imported_block(tmp_path)
    feats = [rect_sketch("s1", "Top Plane", 60, 40), {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10, "dir2": {"end": "blind", "depth": 10}}]
    script = [NS(stop_reason="tool_use", content=[use(1, "propose_features", {"mode": "replace", "summary": "rebuild", "features": feats})]),
              NS(stop_reason="end_turn", content=[say("Rebuilt.")])]
    events, fake = run(monkeypatch, doc, script)
    sent = fake.calls[0]["messages"][0]["content"]
    assert "<omitted" in sent and '"summary"' in sent and len(sent) < 20000  # BREP never goes to the model
    rep = json.loads(tool_result(fake, "tu1"))
    cmp = rep["compared_with_import"]
    assert cmp["only_in_features"] < 1e-3 and cmp["only_in_import"] < 1e-3
    assert events[-1]["proposal"]["features"][0]["type"] == "sketch"


def test_append_keeps_import_data(monkeypatch, tmp_path):
    doc = imported_block(tmp_path)
    echoed = {k: v for k, v in doc["features"][0].items() if k != "data"} | {"data": "<omitted: 3 KB of BREP>"}
    hole = {"id": "s9", "type": "sketch", "name": "Sketch1", "plane": {"ref": "Top Plane"},
            "entities": [{"id": "c", "type": "point", "x": 0, "y": 0}, {"id": "o", "type": "circle", "center": "c", "r": 4}], "constraints": []}
    cut = {"id": "e9", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s9", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}}
    script = [NS(stop_reason="tool_use", content=[use(1, "propose_features", {"mode": "replace", "summary": "hole", "features": [echoed, hole, cut]})]),
              NS(stop_reason="end_turn", content=[say("Added a hole.")])]
    events, fake = run(monkeypatch, doc, script)
    prop = events[-1]["proposal"]
    assert prop["features"][0]["data"] == doc["features"][0]["data"]
    rep = json.loads(tool_result(fake, "tu1"))
    assert all(s["state"] == "ok" for s in rep["status"])


def test_toolbox_and_bought_parts(monkeypatch):
    script = [NS(stop_reason="tool_use", content=[
                  use(1, "standard_part", {"part_id": "screw", "kind": "socket_head_cap_screw", "size": "M6-1", "length": 16}),
                  use(2, "request_part_file", {"part_id": "spring", "description": "Gas spring 150 N, 250 mm extended", "mcmaster_part_number": "4138T52"}),
                  use(3, "create_part", {"part_id": "spring", "name": "Gas Spring (placeholder)", "features": [rect_sketch("s1", "Top Plane", 20, 20), {"id": "e1", "type": "extrude", "name": "B", "sketch": "s1", "depth": 250}]}),
                  use(4, "insert_component", {"component_id": "c1", "part": "spring"}),
                  use(5, "insert_component", {"component_id": "c2", "part": "screw", "position": [0, 300, 0]}),
                  use(6, "find_mate_candidates", {})]),
              NS(stop_reason="end_turn", content=[say("ok")])]
    events, fake = run(monkeypatch, {"name": "Part1", "features": []}, script)
    req = next(e for e in events if e["ev"] == "request_file")
    assert req["url"] == "https://www.mcmaster.com/4138T52/" and req["part"] == "spring"
    steps = [e for e in events if e["ev"] == "build_step" and e["feature"]["type"] == "standard"]
    assert steps and "body" in steps[0]
    prop = events[-1]["proposal"]
    assert prop["parts"]["screw"]["features"][0]["type"] == "standard"
    assert events[-1]["requests"][0]["mcmaster"] == "4138T52"
    assert "candidates" in json.loads(tool_result(fake, "tu6"))
