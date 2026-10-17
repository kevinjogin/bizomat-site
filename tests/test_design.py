"""Design panel support: which feature made a face (/api/face_owner) and the AI's selection note."""
from fastapi.testclient import TestClient

from opensketch import ai, demo, geometry, naming, server


def _bracket():
    return {"version": 1, "name": "Bracket", "units": "mm", "features": demo.bracket_features(), "rollback": None, "seq": 100}


def test_face_owner_names_feature_role_and_sketch_curve():
    doc = _bracket()
    faces = geometry.regen_result(doc)["body"]["faces"]
    owners = {}
    for f in faces:
        o = naming.face_owner(doc, f["center"], f.get("normal"))
        owners.setdefault(o["feature"], set()).add(o["role"])
    # every face is owned by a real feature: base and upright extrudes, both cuts, the fillet
    assert set(owners) == {"f1", "f2", "f3", "f4", "f5"}
    assert {"start", "end", "side"} <= owners["f1"] and owners["f5"] == {"blend"}
    top = next(f for f in faces if f["type"] == "plane" and abs(f["normal"][1]) > 0.99 and abs(f["center"][1] - 8) < 1e-6)
    o = naming.face_owner(doc, top["center"], top["normal"])
    assert o["feature"] == "f1" and o["role"] == "end" and o["sketch"] == "s1"  # the top of the base: its depth
    side = next(f for f in faces if f["type"] == "cylinder" and naming.face_owner(doc, f["center"])["feature"] == "f4")
    o = naming.face_owner(doc, side["center"])
    assert o["entity"] == "s4o" and o["sketch"] == "s4"  # the hole wall came from circle s4o (its diameter)
    assert naming.face_owner(doc, [999, 999, 999])["feature"] is None


def test_face_owner_route():
    doc = _bracket()
    f = geometry.regen_result(doc)["body"]["faces"][0]
    r = TestClient(server.app).post("/api/face_owner", json={"doc": doc, "center": f["center"], "normal": f.get("normal")})
    assert r.status_code == 200 and r.json()["feature"] in {"f1", "f2", "f3", "f4", "f5"}


def test_selection_note_reaches_the_request():
    note = ai.selection_note([{"kind": "face", "feature": "f1", "role": "end", "ref": {"name": "f1:end", "center": [0, 8, 0]},
                               "junk": "x" * 5000}, "not a dict", {"kind": "component", "id": "c1", "name": "Base<1>", "part": "base"}])
    assert "Selected in OpenSketch" in note and '"f1:end"' in note and "Base<1>" in note and "junk" not in note
    assert ai.selection_note(None) == "" and ai.selection_note([]) == ""
    events = list(ai.run_stream(_bracket(), "Make it thicker", demo="part", demo_speed=1000,
                                selection=[{"kind": "feature", "id": "f1", "name": "Boss-Extrude1", "type": "extrude"}]))
    conv = next(e["conversation"] for e in events if e["ev"] == "start")
    first = ai._conversations[conv][0]["content"]
    assert first.startswith("Current part document") and "Request: Make it thicker" in first
    assert "Selected in OpenSketch" in first and "Boss-Extrude1" in first
