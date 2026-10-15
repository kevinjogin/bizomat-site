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
