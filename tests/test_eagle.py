"""Mechanical EAGLE import: exact arcs, board coordinates, and safe dispatch."""
import io
import math
import zipfile

import pytest

from opensketch import eagle, geometry, importer


def board_xml(*, curve="90", rotation="R90", stack="", doctype=True):
    # A 10x10 board with a radius-1 rounded upper-right corner, a plain drill,
    # and a rotated package with one mechanical drill. No vendor CAD is copied.
    arc = ('x1="10" y1="9" x2="9" y2="10" curve="90"' if curve == "90" else
           'x1="9" y1="10" x2="10" y2="9" curve="-90"')
    return (f'''<?xml version="1.0" encoding="utf-8"?>
{'<!DOCTYPE eagle SYSTEM "eagle.dtd">' if doctype else ''}
<eagle version="9.3.1"><drawing><board><plain>
<wire x1="0" y1="0" x2="10" y2="0" width="0.2" layer="20"/>
<wire x1="10" y1="0" x2="10" y2="9" width="0.2" layer="20"/>
<wire {arc} width="0.2" layer="20"/>
<wire x1="9" y1="10" x2="0" y2="10" width="0.2" layer="20"/>
<wire x1="0" y1="10" x2="0" y2="0" width="0.2" layer="20"/>
<hole x="2" y="2" drill="1"/>
</plain><libraries><library name="test"><packages><package name="connector">
<wire x1="-1" y1="-2" x2="1" y2="-2" width="0.2" layer="21"/>
<pad name="1" x="0.5" y="0.5" drill="0.8" diameter="1.5"/>
<hole x="1" y="0" drill="2"/>
</package></packages></library></libraries>
<elements><element name="J1" library="test" package="connector" value="USB"
x="6" y="6" rot="{rotation}"/></elements><designrules>{stack}</designrules>
</board></drawing></eagle>''').encode()


def archive(files):
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for name, raw in files.items():
            z.writestr(name, raw)
    return out.getvalue()


@pytest.mark.parametrize("curve", ["90", "-90"])
def test_signed_arcs_and_mechanical_holes_are_exact_editable_geometry(curve):
    doc = importer.import_file(board_xml(curve=curve), "rounded.brd")
    assert [f["type"] for f in doc["features"]] == ["sketch", "extrude", "sketch", "extrude"]
    state, _ = geometry.regen(doc)
    area = 100 - (1-math.pi/4) - math.pi*(0.5**2+1**2)
    assert state.part.volume == pytest.approx(area*1.6, abs=1e-6)
    bb = state.part.bounding_box()
    assert (bb.min.X, bb.max.X, bb.min.Y, bb.max.Y, bb.min.Z, bb.max.Z) == pytest.approx((0,10,0,1.6,-10,0))
    assert all(s["state"] == "ok" for s in state.status)
    # Editing the imported board thickness changes the actual body.
    doc["features"][1]["depth"] = 2.4
    assert geometry.regen(doc)[0].part.volume == pytest.approx(area*2.4, abs=1e-6)


@pytest.mark.parametrize("rotation,location,side", [("R90", (6,7), "top"), ("MR90", (6,5), "bottom"), ("SMR90", (6,5), "bottom")])
def test_rotated_and_mirrored_package_drills_and_2d_metadata(rotation, location, side):
    doc = importer.import_file(board_xml(rotation=rotation), "board.BRD")
    pcb = doc["pcb"]
    assert (pcb["holes"][1]["x"],pcb["holes"][1]["y"]) == pytest.approx(location)
    comp = pcb["components"][0]
    assert comp["rotation"] == 90 and comp["side"] == side
    assert comp["position"] == [6, 0 if side == "bottom" else 1.6, -6]
    assert comp["spin"] == ("S" in rotation)
    pad = next(n for n in pcb["packages"][0]["geometry"] if n["tag"] == "pad")
    assert pad["attributes"]["drill"] == "0.8"
    assert "2D" in pcb["limitations"][0]
    assert "1.6 mm" in pcb["limitations"][-1]
    assert len(pcb["holes"]) == 2  # Electrical pad drills are metadata, not inferred mechanical holes.


def test_stack_thickness_uses_active_copper_and_dielectric_gap():
    copper = " ".join(["0.035mm"]+["0.2mm"]*14+["0.035mm"])
    stack = f'''<param name="layerSetup" value="(1*16)"/>
<param name="mtCopper" value="{copper}"/><param name="mtIsolate" value="1.5mm 99mm"/>'''
    doc = importer.import_file(board_xml(stack=stack), "board.brd")
    assert doc["features"][1]["depth"] == pytest.approx(1.57)
    assert doc["pcb"]["thickness"] == {"value": 1.57, "source": "eagle_layer_stack", "layer_setup": "(1*16)",
                                        "copper_mm": [.035,.035], "isolation_mm": [1.5]}


def test_archive_imports_one_board_and_ignores_schematic_and_hidden_files():
    raw = archive({"CAD/board.brd": board_xml(), "CAD/board.sch": b"schematic",
                   "__MACOSX/._board.brd": b"junk", ".cache/spare.brd": b"junk"})
    doc = importer.import_file(raw, "official-cad.zip")
    assert doc["pcb"]["source"] == "board.brd"


@pytest.mark.parametrize("files", [{"a.brd": b"x", "b.brd": b"x"}, {"a.step": b"x", "b.brd": b"x"}])
def test_ambiguous_archive_requires_explicit_file_selection(files):
    with pytest.raises(importer.ImportError_, match="holds 2 supported CAD files"):
        importer.import_file(archive(files), "models.zip")


def test_archive_rejects_oversized_entry_before_extracting(monkeypatch):
    monkeypatch.setattr(importer, "MAX_ARCHIVE_FILE_BYTES", 100)
    with pytest.raises(importer.ImportError_, match="exceeds"):
        importer.import_file(archive({"board.brd": b"a"*101}), "board.zip")


@pytest.mark.parametrize("raw,match", [
    (b"\x00binary\xff", "UTF-8"),
    (b"not XML", "not an EAGLE XML"),
    (b"<eagle><drawing>", "Could not read"),
    (b"<eagle><drawing><schematic/></drawing></eagle>", "not an EAGLE XML board"),
    (b"<board/>", "not an EAGLE XML board"),
    (b'<!DOCTYPE eagle SYSTEM "https://example.invalid/e.dtd"><eagle/>', "DTDs and entity"),
    (b'<!DOCTYPE eagle [<!ENTITY x SYSTEM "file:///etc/passwd">]><eagle>&x;</eagle>', "DTDs and entity"),
    (b'<!DOCTYPE eagle [<!ENTITY x "boom">]><eagle>&x;</eagle>', "DTDs and entity"),
])
def test_unsafe_or_non_eagle_input_is_rejected(raw, match):
    with pytest.raises(importer.ImportError_, match=match):
        importer.import_file(raw, "board.brd")


def test_xml_resource_limits(monkeypatch):
    monkeypatch.setattr(eagle, "MAX_XML_BYTES", 20)
    with pytest.raises(importer.ImportError_, match="16 MiB"):
        importer.import_file(board_xml(), "board.brd")
    monkeypatch.setattr(eagle, "MAX_XML_BYTES", 16*1024*1024)
    monkeypatch.setattr(eagle, "MAX_XML_ELEMENTS", 5)
    with pytest.raises(importer.ImportError_, match="element or nesting"):
        importer.import_file(board_xml(), "board.brd")


def test_open_outline_and_nonfinite_coordinates_fail_before_returning_doc():
    raw = board_xml().replace(b'<wire x1="0" y1="10" x2="0" y2="0" width="0.2" layer="20"/>', b"")
    with pytest.raises(importer.ImportError_, match="open contour"):
        importer.import_file(raw, "board.brd")
    with pytest.raises(importer.ImportError_, match="Invalid EAGLE wire x1"):
        importer.import_file(board_xml().replace(b'x1="0"', b'x1="nan"'), "board.brd")


def test_step_dispatch_remains_backward_compatible(monkeypatch):
    marker = {"type": "part"}
    monkeypatch.setattr(importer, "import_step", lambda data, filename: marker)
    assert importer.import_file(b"step", "part.step") is marker
    assert importer.import_file(archive({"part.stp": b"step"}), "part.zip") is marker


def test_nonfinite_component_rotation_is_rejected():
    with pytest.raises(importer.ImportError_, match="rotation angle"):
        importer.import_file(board_xml(rotation="R"+"9"*500), "board.brd")


def test_package_expansion_and_duplicate_drills_are_bounded(monkeypatch):
    repeated = b''.join(f'<element name="J{i}" library="test" package="connector" x="6" y="6" rot="R90"/>'.encode() for i in range(10))
    raw = board_xml().replace(b"</elements>", repeated+b"</elements>")
    monkeypatch.setattr(eagle, "MAX_MECHANICAL_INSTANCES", 8)
    with pytest.raises(importer.ImportError_, match="mechanical instance limit"):
        importer.import_file(raw, "board.brd")
    monkeypatch.setattr(eagle, "MAX_MECHANICAL_INSTANCES", 4000)
    monkeypatch.setattr(eagle, "MAX_COMPONENTS", 2)
    with pytest.raises(importer.ImportError_, match="component instance limit"):
        importer.import_file(raw, "board.brd")


def test_overlapping_drills_cannot_silently_become_annular_cuts():
    raw = board_xml().replace(b'<hole x="2" y="2" drill="1"/>', b'<hole x="2" y="2" drill="1"/><hole x="2" y="2" drill="2"/>')
    with pytest.raises(importer.ImportError_, match="Overlapping EAGLE mechanical holes"):
        importer.import_file(raw, "board.brd")
