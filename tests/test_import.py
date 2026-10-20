"""STEP import (part and assembly), imported bodies you can keep modelling on, standard parts."""
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


def _world(shape):
    """The shape's geometry where it is, with no location (as FreeCAD and build123d write placed parts)."""
    from build123d import Solid
    from OCP.BRepBuilderAPI import BRepBuilderAPI_Transform
    t = shape.location.wrapped.Transformation()
    return Solid(BRepBuilderAPI_Transform(shape.located(Location()).wrapped, t, True).Shape())


def test_assembly_import_keeps_world_placed_copies_and_mirrors_apart(tmp_path):
    """A mirrored left/right pair and two copies of one part placed in world coordinates have the same shape
    signature; each must stay its own part where it is, not become a second copy of the first."""
    from build123d import Plane, Pos
    ell = (Box(30, 10, 10) + Pos(-10, 0, 15) * Box(10, 10, 20)).solids()[0]
    left = _world(ell.translate((-50, 0, 0)))
    right = _world(left.mirror(Plane.YZ))
    pin_a, pin_b = _world(Cylinder(3, 20).translate((0, 30, 0))), _world(Cylinder(3, 20).translate((0, -30, 0)))
    for s, n in ((left, "Left"), (right, "Right"), (pin_a, "Pin_A"), (pin_b, "Pin_B")):
        assert s.location.position.length == 0
        s.label = n
    doc = importer.import_step(step_bytes(Compound(children=[left, right, pin_a, pin_b], label="Pairs"), tmp_path), "pairs.step")
    assert len(doc["parts"]) == 4
    assert [c["name"] for c in doc["components"]] == ["Left<1>", "Right<1>", "Pin_A<1>", "Pin_B<1>"]
    for comp, src in zip(doc["components"], (left, right, pin_a, pin_b)):
        solid = assembly.build_part(doc["parts"][comp["part"]])["solid"]
        assert comp["position"] == pytest.approx([0, 0, 0]) and comp["rotation"] == pytest.approx([0, 0, 0])
        assert (solid.center() - src.center()).length < 1e-6
    bb = assembly.regen_assembly(doc)["bbox"]
    assert bb[0] == pytest.approx([-65, -33, -10], abs=1e-3) and bb[1] == pytest.approx([65, 33, 25], abs=1e-3)
    # true instances (one shape, several locations) still share one part
    pin = Cylinder(3, 20)
    pin.label = "Pin"
    two = Compound(children=[pin.moved(Location((10, 0, 0))), pin.moved(Location((-10, 0, 0), (0, 0, 45)))], label="Two")
    doc = importer.import_step(step_bytes(two, tmp_path, "two.step"), "two.step")
    assert len(doc["parts"]) == 1 and len(doc["components"]) == 2


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


# ----------------------------------------------------------------------------- server odds and ends

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














def test_imported_body_data_is_unzipped_with_a_cap():
    import base64
    import zlib
    from opensketch import geometry, importer
    bomb = base64.b64encode(zlib.compress(b"\0" * (80 * 1024 * 1024), 9)).decode()  # 80 MB of zeros in ~80 KB
    with pytest.raises(geometry.FeatureError, match="512 MB"):
        importer.decode_shape(bomb)
    with pytest.raises(geometry.FeatureError, match="damaged"):
        importer.decode_shape("not base64 at all!")
    with pytest.raises(geometry.FeatureError, match="damaged"):
        importer.decode_shape(base64.b64encode(b"x" * 100).decode())
    doc = {"features": [{"id": "i1", "type": "import", "data": bomb}]}
    st, _ = geometry.regen(doc)
    assert st.status[0]["state"] == "error" and "512 MB" in st.status[0]["message"]
    from build123d import Box
    assert importer.decode_shape(importer.encode_shape(Box(1, 2, 3))).volume == pytest.approx(6)


def test_generic_step_labels_use_the_file_name(tmp_path):
    from build123d import Box, export_step
    from opensketch import importer
    box = Box(10, 20, 30)
    path = tmp_path / "block_10x20x30.step"
    export_step(box, str(path))
    assert "COMPOUND" in path.read_text(errors="replace")
    doc = importer.import_file(path.read_bytes(), "block_10x20x30.step")
    assert doc["name"] == "block_10x20x30"
    box.label = "Bracket"
    export_step(box, str(path))
    assert importer.import_file(path.read_bytes(), "block_10x20x30.step")["name"] == "Bracket"
    for label in ("COMPOUND", "Part_1", "Assembly 2", "SHAPE", "Product1"):
        assert importer._clean_name(label, "file") == "file", label


def test_world_placed_copies_of_one_product_share_a_part(tmp_path):
    """FreeCAD and build123d write copies in world coordinates (identity locations), numbered Screw001...: one
    part, each component placed by its move. A mirrored copy and a differently named product stay apart."""
    from build123d import Plane, Pos
    base = _world(Box(100, 10, 20).translate((0, -5, 0)))
    base.label = "Base"
    screws = []
    for i in range(6):
        s = _world((Cylinder(2, 10) + Pos(0, 0, 6) * Cylinder(3.5, 2)).translate((-40 + 15 * i, 0, 15)))
        s.label = f"Screw{i + 1:03d}"
        screws.append(s)
    ell = (Box(30, 10, 10) + Pos(-10, 0, 15) * Box(10, 10, 20)).solids()[0]
    left = _world(ell.translate((-50, 40, 0)))
    right = _world(left.mirror(Plane.YZ))
    left.label, right.label = "Lever001", "Lever002"
    doc = importer.import_step(step_bytes(Compound(children=[base, *screws, left, right], label="Box"), tmp_path), "box.step")
    assert len(doc["parts"]) == 4  # base, one screw, both levers (a mirror image is not a move)
    comps = doc["components"]
    assert len({c["part"] for c in comps[1:7]}) == 1
    assert [c["name"] for c in comps[1:7]] == [f"Screw001<{k}>" for k in range(1, 7)]
    res = assembly.regen_assembly(doc)
    for comp, src in zip(res["components"][1:7], screws):
        solid = assembly.build_part(doc["parts"][comp["part"]])["solid"].moved(assembly.location_of(assembly.Pose.of(comp)))
        assert (solid.center() - src.center()).length < 1e-6
        assert abs(solid.volume - src.volume) < 1e-6
