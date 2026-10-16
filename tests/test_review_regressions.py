"""Review regressions: data errors must not look like successful CAD operations."""
import gzip
from copy import deepcopy

import pytest
from fastapi.testclient import TestClient

from opensketch import ai, assembly, geometry, server, sldexport
from tests.test_assembly import asm_doc
from tests.test_geometry import rect_sketch


def broken_part():
    return {"name": "Bracket", "features": [
        rect_sketch("s", {"ref": "Front Plane"}, 0, 0, 10, 10),
        {"id": "boss", "type": "extrude", "sketch": "s", "depth": 10},
        {"id": "bad", "type": "fillet", "radius": 99, "edges": [{"mid": [0, 0, 5]}]},
    ]}


@pytest.mark.parametrize("fmt", ["step", "stl"])
def test_export_rejects_failed_features(fmt, tmp_path):
    doc = broken_part()
    with pytest.raises(geometry.FeatureError, match="bad.*fillet"):
        geometry.export(doc, fmt, str(tmp_path / f"bad.{fmt}"))
    asm = assembly.part_as_assembly(doc)
    with pytest.raises(geometry.FeatureError, match="bad"):
        assembly.export(asm, fmt, str(tmp_path / f"asm.{fmt}"))
    doc["features"][-1]["suppressed"] = True
    geometry.export(doc, fmt, str(tmp_path / f"good.{fmt}"))
    assert (tmp_path / f"good.{fmt}").stat().st_size > 0


def test_macro_fallback_cannot_hide_rebuild_failure(tmp_path):
    with pytest.raises(geometry.FeatureError, match="bad"):
        sldexport.export(broken_part(), str(tmp_path / "bad.zip"), force_step=True)


def test_failed_and_successful_export_clean_up_tempfiles(monkeypatch, tmp_path):
    original = server.tempfile.mkstemp
    created = []
    def make_temp(*args, **kwargs):
        fd, path = original(*args, **kwargs, dir=tmp_path)
        created.append(path)
        return fd, path
    monkeypatch.setattr(server.tempfile, "mkstemp", make_temp)
    client = TestClient(server.app)
    doc = broken_part()
    result = client.post("/api/export/step", json={"doc": doc})
    assert result.status_code == 400 and "bad" in result.json()["detail"]
    doc["features"].pop()
    result = client.post("/api/export/step", json={"doc": doc})
    assert result.status_code == 200 and result.content.startswith(b"ISO-10303-21")
    from pathlib import Path
    assert len(created) == 2 and not any(Path(p).exists() for p in created)


@pytest.mark.parametrize("payload", [b"not gzip", gzip.compress(b"step")[:-2], b'\x1f\x8b\x08\x00' + b'\x00' * 10])
def test_damaged_gzip_has_readable_error(payload):
    response = TestClient(server.app).post("/api/import/raw?filename=part.step", content=payload,
                                           headers={"X-OpenSketch-Gzip": "1"})
    assert response.status_code == 400
    assert response.json()["error"]


def test_invalid_base64_and_toolbox_requests():
    client = TestClient(server.app)
    response = client.post("/api/import", json={"filename": "part.step", "data": "!bad"})
    assert response.status_code == 400 and "base64" in response.json()["error"]
    for size, length in [("invalid", 10), ("M6-1", -1), ("M6-1", 0)]:
        response = client.post("/api/toolbox/part", json={"kind": "socket_head_cap_screw", "size": size, "length": length})
        assert response.status_code == 400 and response.json()["detail"]


def test_ai_preserves_limits_and_hinge_references():
    doc = asm_doc()
    doc["mates"] = []
    session = ai.Session(doc)
    refs = [{"component": "c1", "ref": "Y axis"}, {"component": "c2", "ref": "Y axis"}]
    _, clean, _ = session.add_mate({"type": "limit_angle", "refs": refs, "min": 20, "max": 50})
    assert clean
    assert session.work["mates"][-1]["min"] == 20 and session.work["mates"][-1]["max"] == 50
    session.work["mates"] = []
    params = {"type": "hinge", "refs": refs,
              "planes": [{"component": c, "ref": "Top Plane"} for c in ("c1", "c2")],
              "angle_refs": [{"component": c, "ref": "Front Plane"} for c in ("c1", "c2")],
              "angle_min": 0, "angle_max": 90}
    session.add_mate(params)
    stored = session.work["mates"][-1]
    assert all(stored[k] == v for k, v in params.items())
    schema = next(t for t in ai.TOOLS if t["name"] == "add_mate")["input_schema"]["properties"]
    assert set(params) <= set(schema)


def test_invalid_limits_do_not_create_a_mate():
    session = ai.Session(asm_doc())
    before = deepcopy(session.work)
    _, clean, _ = session.add_mate({"type": "limit_angle", "refs": [], "min": 90, "max": 10})
    assert not clean and session.work == before


def test_ai_delete_cascades_all_hinge_reference_lists():
    doc = asm_doc()
    doc["components"].append({"id": "c3", "part": "plate", "fixed": True})
    doc["mates"] = [{"id": "h", "type": "hinge",
                     "refs": [{"component": "c1", "ref": "Y axis"}, {"component": "c2", "ref": "Y axis"}],
                     "planes": [{"component": "c1", "ref": "Top Plane"}, {"component": "c3", "ref": "Top Plane"}]}]
    session = ai.Session(doc)
    session.delete_items({"components": ["c3"]})
    assert session.work["mates"] == []


def test_up_to_next_requires_a_target():
    doc = broken_part()
    doc["features"] = doc["features"][:2]
    doc["features"][1]["end"] = "up_to_next"
    st, _ = geometry.regen(doc)
    assert st.part is None and "existing body" in st.status[-1]["message"]
