"""A part left rolled back inside an assembly (YZ 2026-10-19: Lavilock O2S6, Inside_plate's rollback bar was
above its only feature, Imported1, so the assembly's STEP/STL export failed with a bare "no solid body").

The part keeps building to its rollback bar in the assembly (as in SOLIDWORKS), but every place that meets
it now names the part and the fix, and a preview draws what is there instead of refusing."""
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import ai, artifacts, assembly as A, geometry, preview, server, store
from tests.test_assembly import asm_doc


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def rolled(at):
    d = asm_doc()
    d["parts"]["plate"]["rollback"] = at
    return d


def test_rolled_back_reads_the_bar():
    p = asm_doc()["parts"]["plate"]
    assert geometry.rolled_back(p) is None
    for at, name in ((0, "Sketch1"), (1, "Boss-Extrude1"), (3, "Cut-Extrude1"), (-2, "Sketch1")):
        assert geometry.rolled_back(dict(p, rollback=at))["name"] == name
    assert geometry.rolled_back(dict(p, rollback=4)) is None  # bar after the last feature = at the end
    assert geometry.rolled_back(dict(p, rollback=None)) is None
    assert geometry.rolled_back(dict(p, rollback="x")) is None


def test_assembly_export_names_the_rolled_back_part(tmp_path):
    for at, what in ((0, "so it has no body"), (3, "features from there down are left out")):
        d = rolled(at)
        with pytest.raises(A.AssemblyError) as err:
            A.export(d, "step", str(tmp_path / "a.step"))
        msg = str(err.value)
        assert "Plate<1>" in msg and "rolled back" in msg and what in msg and "Roll Part to End" in msg
        assert "no solid body" not in msg
    d = rolled(0)
    d["components"][0]["suppressed"] = True  # a suppressed component is not exported, so it does not block
    d["mates"] = []
    A.export(d, "stl", str(tmp_path / "b.stl"))
    d = rolled(0)
    d["parts"]["plate"]["rollback"] = None  # rolled to the end: the export works again
    A.export(d, "step", str(tmp_path / "c.step"))
    assert (tmp_path / "c.step").stat().st_size > 1000


def test_regen_and_ai_report_flag_the_rolled_back_part():
    res = A.regen_assembly(rolled(0))
    assert res["parts"]["plate"]["rolled_back"] == {"id": "s1", "name": "Sketch1"}
    assert "rolled_back" not in res["parts"]["pin"]
    report = ai._asm_report(rolled(0), res)
    assert not report["clean"]
    (w,) = [w for w in report["warnings"] if w.get("part") == "plate"]
    assert "rolled back" in w["message"] and "no body" in w["message"] and "Roll Part to End" in w["message"]
    assert ai._asm_report(asm_doc(), A.regen_assembly(asm_doc()))["clean"]


def test_mcp_export_refuses_and_preview_draws_what_is_there():
    rec = store.create("Rolled", doc=rolled(0))
    with pytest.raises(artifacts.ArtifactError, match=r"Cannot export\. Plate<1>: Plate is rolled back.*Roll Part to End"):
        artifacts.export_record(rec, "step")
    assert artifacts.export_record(rec, "osk")["format"] == "osk"
    meta, png = artifacts.preview_record(rec, "isometric", 320, 240)
    assert png[:8] == b"\x89PNG\r\n\x1a\n"
    assert any("rolled back" in w for w in meta["warnings"])
    # the part on its own (part_id): nothing to export or draw, with the same plain reason
    with pytest.raises(artifacts.ArtifactError, match="rolled back.*Rollback to End"):
        artifacts.export_record(rec, "step", "plate")
    # rolled back part-way: the part export works and says what was left out
    half = store.create("Half", doc=rolled(3))
    out = artifacts.export_record(half, "stl", "plate")
    assert any("left out" in w for w in out["warnings"])
    # the server-drawn Files picture skips the empty part instead of failing
    assert preview.render_preview(rolled(0), width=240, height=180, transparent=True)[:4] == b"\x89PNG"


def test_part_export_route_says_how_to_roll_forward():
    part = dict(asm_doc()["parts"]["plate"], rollback=0)
    with TestClient(server.app) as client:
        r = client.post("/api/export/step", json={"doc": part})
        assert r.status_code == 400
        assert "rollback bar is above Sketch1" in r.json()["detail"] and "Rollback to End" in r.json()["detail"]
        r = client.post("/api/export/step", json={"doc": rolled(0)})
        assert r.status_code == 400 and "Roll Part to End" in r.json()["detail"]
        assert client.post("/api/export/step", json={"doc": asm_doc()}).status_code == 200


def test_lavilock_style_import_part_rolled_back_above_its_only_feature(tmp_path):
    """The shape of YZ's document: an imported part whose bar sits above Imported1."""
    from build123d import Box, export_step
    export_step(Box(10, 20, 30), str(tmp_path / "b.step"))
    from opensketch import importer
    part = importer.import_step((tmp_path / "b.step").read_bytes(), "b.step")
    part = part if part.get("type") != "assembly" else next(iter(part["parts"].values()))
    d = {"type": "assembly", "name": "Lock", "parts": {"plate": dict(part, name="Inside_plate", rollback=0)},
         "components": [{"id": "c1", "part": "plate", "name": "Inside_plate<1>", "fixed": True,
                         "position": [0, 0, 0], "rotation": [0, 0, 0]}], "mates": []}
    with pytest.raises(A.AssemblyError, match="Inside_plate<1>: Inside_plate is rolled back: its rollback bar is above Imported1, so it has no body"):
        A.export(d, "step", str(tmp_path / "x.step"))
    d["parts"]["plate"]["rollback"] = None
    A.export(d, "step", str(tmp_path / "x.step"))
    assert json.dumps(A.regen_assembly(d)["parts"]["plate"].get("rolled_back")) == "null"
