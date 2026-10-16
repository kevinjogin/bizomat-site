"""STEP import (part and assembly), imported bodies you can keep modelling on, Toolbox parts."""
import math

import pytest
from build123d import Box, Compound, Cylinder, Location, export_step

from opensketch import assembly, geometry, importer


def step_bytes(shape, tmp_path, name="m.step"):
    p = tmp_path / name
    export_step(shape, str(p))
    return p.read_bytes()


def test_part_import_and_edit(tmp_path):
    data = step_bytes(Box(60, 20, 40), tmp_path)
    doc = importer.import_step(data, "block.step")
    assert doc["type"] == "part" and doc["features"][0]["type"] == "import"
    st, _ = geometry.regen(doc)
    assert st.part.volume == pytest.approx(60 * 20 * 40)
    # keep modelling: a through hole cut on the Top Plane
    doc["features"] += [
        {"id": "s1", "type": "sketch", "name": "Sketch1", "plane": {"ref": "Top Plane"},
         "entities": [{"id": "c", "type": "point", "x": 0, "y": 0}, {"id": "o", "type": "circle", "center": "c", "r": 5}],
         "constraints": []},
        {"id": "e1", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s1", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
    ]
    st, _ = geometry.regen(doc)
    assert st.part.volume == pytest.approx(60 * 20 * 40 - math.pi * 25 * 20, rel=1e-4)
    assert all(s["state"] == "ok" for s in st.status)


def test_assembly_import_shares_instances(tmp_path):
    plate = Box(80, 10, 60)
    plate.label = "Plate"
    pin = Cylinder(5, 40)
    pin.label = "Pin"
    sub = Compound(children=[pin.moved(Location((0, 0, 0)))], label="Sub")
    a = Compound(children=[plate, pin.moved(Location((20, 0, 0))), sub.moved(Location((-20, 5, 0), (0, 0, 30)))], label="Assy")
    doc = importer.import_step(step_bytes(a, tmp_path), "assy.step")
    assert doc["type"] == "assembly" and doc["name"] == "Assy"
    assert len(doc["parts"]) == 2 and len(doc["components"]) == 3
    names = [c["name"] for c in doc["components"]]
    assert names == ["Plate<1>", "Pin<1>", "Pin<2>"]
    assert doc["components"][0]["fixed"]
    c3 = doc["components"][2]
    assert c3["position"] == pytest.approx([-20, 5, 0], abs=1e-6) and c3["rotation"] == pytest.approx([0, 0, 30], abs=1e-6)
    res = assembly.regen_assembly(doc)
    bb = res["bbox"]
    assert bb[0][0] == pytest.approx(-40, abs=1e-3)


def test_solidworks_files_explain(tmp_path):
    with pytest.raises(importer.ImportError_) as e:
        importer.import_step(b"x", "lid.SLDPRT")
    assert "STEP" in str(e.value)


def test_standard_parts():
    cat = importer.standard_catalog()
    assert "M6-1" in cat["socket_head_cap_screw"]["sizes"]
    doc = importer.standard_part_doc("socket_head_cap_screw", size="M6-1", length=20)
    st, _ = geometry.regen(doc)
    bb = st.part.bounding_box()
    # axis along Y, shank below Y=0, head above it
    assert bb.min.Y == pytest.approx(-20, abs=0.05) and bb.max.Y > 4
    assert abs(bb.min.X + bb.max.X) < 1e-6 and abs(bb.min.Z + bb.max.Z) < 1e-6
    nut = importer.standard_part_doc("hex_nut", size="M6-1")
    assert geometry.regen(nut)[0].part.volume > 100


# ----------------------------------------------------------------------------- upload route
# The browser sends the file's raw bytes to /api/import/raw, gzipped. Before 2026-10-16 it sent base64
# JSON, which made a 14 MB McMaster STEP a 19 MB request that the Codespaces tunnel dropped, and the
# app showed "Could not insert:" with nothing after it.

import gzip
import io
import zipfile

from fastapi.testclient import TestClient

from opensketch import server


@pytest.fixture
def client():
    return TestClient(server.app)


def _zip(files):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        for name, data in files.items():
            zf.writestr(name, data)
    return buf.getvalue()


def test_raw_upload_gzip(client, tmp_path):
    data = step_bytes(Box(60, 20, 40), tmp_path)
    r = client.post("/api/import/raw", params={"filename": "block.STEP"}, content=gzip.compress(data),
                    headers={"Content-Type": "application/octet-stream", "X-OpenSketch-Gzip": "1"})
    assert r.status_code == 200 and r.json()["doc"]["type"] == "part"
    # plain bytes work too (browsers without CompressionStream)
    r = client.post("/api/import/raw", params={"filename": "block.stp"}, content=data)
    assert r.status_code == 200 and r.json()["doc"]["features"][0]["type"] == "import"


def test_raw_upload_zip(client, tmp_path):
    pin = step_bytes(Cylinder(5, 40), tmp_path)
    z = _zip({"__MACOSX/._91290A115.STEP": b"junk", "91290A115/91290A115.STEP": pin, "readme.txt": b"hi"})
    r = client.post("/api/import/raw", params={"filename": "91290A115.zip"}, content=z)
    assert r.status_code == 200
    doc = r.json()["doc"]
    assert doc["type"] == "part" and doc["features"][0]["source"] == "91290A115.STEP"


@pytest.mark.parametrize("files,expect", [
    ({"readme.txt": b"hi"}, "has no STEP file inside"),
    ({"a.sldprt": b"x"}, "only holds SOLIDWORKS files"),
    ({"a.step": b"x", "b.stp": b"y"}, "holds 2 STEP files"),
])
def test_zip_messages(client, files, expect):
    r = client.post("/api/import/raw", params={"filename": "parts.zip"}, content=_zip(files))
    assert r.status_code == 422 and expect in r.json()["error"]


def test_upload_errors_are_always_json_with_text(client, monkeypatch):
    r = client.post("/api/import/raw", params={"filename": "x.zip"}, content=b"not a zip")
    assert r.status_code == 422 and "not a readable zip" in r.json()["error"]
    r = client.post("/api/import/raw", params={"filename": "x.step"}, content=b"oops",
                    headers={"X-OpenSketch-Gzip": "1"})
    assert r.status_code == 400 and r.json()["error"]

    def boom(*a, **k):
        raise RuntimeError()
    monkeypatch.setattr(importer, "import_step", boom)
    r = client.post("/api/import/raw", params={"filename": "x.step"}, content=b"ISO-10303-21;")
    assert r.status_code == 422 and r.json()["error"].strip().endswith("RuntimeError")


def test_old_json_route_still_works(client, tmp_path):
    import base64
    data = step_bytes(Box(10, 10, 10), tmp_path)
    r = client.post("/api/import", json={"filename": "b.step", "data": base64.b64encode(data).decode()})
    assert r.status_code == 200 and r.json()["doc"]["type"] == "part"
