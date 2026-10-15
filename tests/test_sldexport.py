"""SOLIDWORKS macro export: part recipes, assembly data, the final file, and (when the toolchain is here) the
engine and the assembly stand-in."""
import json
import os
import sys
import zipfile

import numpy as np
import pytest

from opensketch import ai, assembly as A, importer, sldexport as X

sys.path.insert(0, os.path.dirname(__file__))
from test_assembly import hinge_doc, pin, plate  # noqa: E402


@pytest.fixture(scope="module")
def press():
    ev = list(ai.run_stream({"name": "Part1", "features": []}, "build a hand press", demo=True, demo_speed=0))
    return ev[-1]["proposal"]


@pytest.fixture(scope="module")
def bracket():
    ev = list(ai.run_stream({"name": "Part1", "features": []}, "bracket", demo="part", demo_speed=0))
    return ev[-1]["proposal"]


def mixed(bracket_doc):
    """Every kind of mate the export handles: hinge with limits, ground planes, part planes, distance,
    limit distance, lock, angle; a STEP-only part and a Toolbox part."""
    h = hinge_doc()
    m = h["mates"][0]
    m["angle_refs"] = [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}},
                       {"component": "c2", "plane": {"point": [0, 5, 30], "normal": [0, 1, 0]}}]
    m["angle_min"], m["angle_max"] = 0, 110
    screw = importer.standard_part_doc("socket_head_cap_screw", size="M6-1", length=20)
    G = lambda r: {"component": None, "ref": r}
    asm = {"type": "assembly", "name": "Mixed",
           "parts": {"base": h["parts"]["base"], "lid": h["parts"]["lid"], "plate": plate(), "pin": pin(), "bracket": bracket_doc, "screw": screw},
           "components": h["components"] + [
               {"id": "c3", "part": "plate", "name": "Plate<1>", "position": [150, 1, 190], "rotation": [0, 5, 0]},
               {"id": "c4", "part": "pin", "name": "Pin<1>", "position": [150, 25, 200], "rotation": [0, 0, 0]},
               {"id": "c5", "part": "bracket", "name": "Bracket<1>", "position": [-150, 0, 0], "rotation": [0, 30, 0]},
               {"id": "c6", "part": "screw", "name": "Screw<1>", "position": [0, 21, 0], "rotation": [0, 20, 0]}],
           "mates": h["mates"] + [
               {"id": "m2", "type": "coincident", "refs": [G("Top Plane"), {"component": "c3", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]},
               {"id": "m3", "type": "coincident", "refs": [G("Right Plane"), {"component": "c3", "ref": "Right Plane"}]},
               {"id": "m4", "type": "distance", "value": 200, "refs": [G("Front Plane"), {"component": "c3", "ref": "Front Plane"}]},
               {"id": "m5", "type": "concentric", "refs": [{"component": "c3", "axis": {"point": [0, 0, 0], "dir": [0, 1, 0]}}, {"component": "c4", "ref": "Y axis"}]},
               {"id": "m6", "type": "limit_distance", "min": 0, "max": 25, "align": "aligned",
                "refs": [{"component": "c3", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}}, {"component": "c4", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}]},
               {"id": "m7", "type": "lock", "refs": [{"component": "c1", "ref": "Origin"}, {"component": "c5", "ref": "Origin"}]},
               {"id": "m8", "type": "coincident", "refs": [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}}, {"component": "c6", "ref": "Top Plane"}]},
               {"id": "m9", "type": "concentric", "refs": [{"component": "c1", "ref": "Y axis"}, {"component": "c6", "ref": "Y axis"}]},
               {"id": "m10", "type": "angle", "value": 30, "refs": [{"component": "c1", "ref": "Front Plane"}, {"component": "c6", "ref": "Front Plane"}]},
           ]}
    res = A.regen_assembly(asm)
    assert all(x["state"] == "ok" for x in res["mates"]), res["mates"]
    return A.apply_solution(asm, res)


def test_recipes_of_the_press_parts(press):
    base = X.translate_part(press["parts"]["base"], "base")
    assert base.steps[0].startswith('Ex("Boss-Extrude1", "add", 0.0, 25.0, [rect(-160.0, -110.0, 160.0, 110.0)]')
    assert "circle(110.0, 60.0, 10.25)" in base.steps[1] and '"cut"' in base.steps[1]   # the holes of the sketch
    cyl = X.translate_part(press["parts"]["cylinder"], "cylinder")
    assert '0.0, -140.0' in cyl.steps[1]                                                   # reversed extrude
    # OpenSketch Top Plane sketches: the SOLIDWORKS Front plane is the OpenSketch Top Plane
    assert np.allclose(base.frame.M, [[1, 0, 0], [0, 0, -1], [0, 1, 0]])


def test_parts_the_engine_cannot_make(bracket):
    with pytest.raises(X.Unsupported, match="another direction"):
        X.translate_part(bracket, "bracket")
    with pytest.raises(X.Unsupported, match="Toolbox"):
        X.translate_part(importer.standard_part_doc("hex_nut", size="M6-1"), "nut")


def test_fillet_edges_are_carried(press):
    p = json.loads(json.dumps(press["parts"]["base"]))
    st, _ = __import__("opensketch.geometry", fromlist=["regen"]).regen(p)
    top = max(st.part.edges(), key=lambda e: (e @ 0.5).Y + (e @ 0.5).X * 1e-3)
    m = top @ 0.5
    p["features"].append({"id": "fi1", "type": "fillet", "name": "Fillet1", "radius": 2, "edges": [{"mid": [m.X, m.Y, m.Z]}]})
    rec = X.translate_part(p, "base")
    assert rec.steps[-1].startswith('Fi("Fillet1", 2.0, _on(')


def test_assembly_data_is_consistent(bracket):
    """Every face a mate picks lies on the part in its SOLIDWORKS frame, and lands where OpenSketch has it."""
    asm = mixed(bracket)
    info = {}
    for i, (pid, p) in enumerate(asm["parts"].items(), 1):
        b = A.build_part(p)
        try:
            rec = X.translate_part(p, pid)
            fr = rec.frame
        except X.Unsupported:
            fr = X.Frame.identity()
        info[pid] = {"index": i, "solid": b["solid"], "frame": fr}
    data, sol = X.build_asm_data(asm, info)
    assert not data.skipped, data.skipped
    types = [m["type"] for m in data.mates]
    for t in ("swMateCONCENTRIC", "swMateCOINCIDENT", "swMateANGLE", "swMateDISTANCE", "swMateLOCK"):
        assert t in types
    hinge_angle = next(m for m in data.mates if "hinge angle" in m["what"])
    assert hinge_angle["nums"][4] == pytest.approx(np.radians(110)) and hinge_angle["nums"][5] == 0
    assert len(data.axes) == 3 and any(a[1] == "E" for a in data.axes)    # one axis along the base's back edge
    comps = sol["comps"]
    for m in data.mates:
        for e in m["ents"]:
            if e["kind"] != "F":
                continue
            c = comps[e["comp"] - 1]
            ii = info[c["part"]]
            pose = A.Pose.of(c)
            Rsw = pose.R @ ii["frame"].M.T
            tsw = pose.R @ ii["frame"].o + pose.t
            assert np.allclose(Rsw @ e["pt"] + tsw, e["apt"], atol=1e-6)
            sw = ii["frame"].plane().to_local_coords(ii["solid"])
            from build123d import Vector
            assert min(f.distance_to(Vector(*e["pt"])) for f in sw.faces()) < 1e-6


def test_export_as_step_only(tmp_path, press):
    out = tmp_path / "press.zip"
    rep = X.export(press, str(out), verify=False, force_step=True, log=lambda s: None)
    assert all(p["mode"] == "step" for p in rep["parts"]) and rep["mates"]["exported"] == 16
    z = zipfile.ZipFile(out)
    names = z.namelist()
    assert "Assem1.bas" in names and "REPORT.md" in names and sum(n.startswith("steps/") for n in names) == 5
    raw = z.read("Assem1.bas")
    assert raw.count(b"\n") == raw.count(b"\r\n") and b"@@" not in raw and max(raw) < 128
    assert b"swMateType_e.swMateCONCENTRIC" in raw and b"Sub main()" in raw
    assert rep["checks"]["final"]["names"]["ok"], rep["checks"]["final"]["names"]
    assert "has not been run in SOLIDWORKS" in z.read("REPORT.md").decode()


needs_toolchain = pytest.mark.skipif(not X.toolchain()["ok"] or not X.toolchain()["have"]["standin"],
                                     reason="the sldmacro toolchain is not installed here")


@needs_toolchain
def test_export_press_with_features(tmp_path, press):
    rep = X.export(press, str(tmp_path / "p.zip"), verify=False, log=lambda s: None)
    assert [p["mode"] for p in rep["parts"]] == ["features"] * 5
    fin = rep["checks"]["final"]
    assert fin["grammar"]["ok"] and fin["names"]["ok"], fin
    st = rep["checks"]["assembly_standin"]
    assert st["ok"], [r for r in st["runs"] if not r["ok"]]


@needs_toolchain
def test_export_mixed_assembly_standin(tmp_path, bracket):
    rep = X.export(mixed(bracket), str(tmp_path / "m.zip"), verify=False, log=lambda s: None)
    modes = {p["title"]: p["mode"] for p in rep["parts"]}
    assert modes["Base"] == "features" and modes["Part1"] == "step" and modes["Socket Head Cap Screw M6-1x20"] == "step"
    assert rep["mates"]["exported"] == 12 and rep["mates"]["axes_added"] == 3
    st = rep["checks"]["assembly_standin"]
    assert st["ok"], [r for r in st["runs"] if not r["ok"]]
    assert rep["checks"]["final"]["grammar"]["ok"] and rep["checks"]["final"]["names"]["ok"]


def test_patterns_and_mirror_become_copies():
    from test_assembly import circle_sketch, rect_sketch

    def circ(sid, r, x, y):
        sk = circle_sketch(sid, "Top Plane", r)
        sk["entities"][0].update(x=x, y=y)
        return sk
    p = {"name": "Patterned", "features": [
        rect_sketch("s1", "Top Plane", 120, 80), {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 8},
        circ("s2", 3, -40, -25), {"id": "e2", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s2", "op": "cut", "end": "through_all"},
        {"id": "p1", "type": "linear_pattern", "name": "LPattern1", "features": ["e2"], "direction": "X", "count": 3, "spacing": 20},
        circ("s3", 4, 30, 0), {"id": "e3", "type": "extrude", "name": "Boss-Extrude2", "sketch": "s3", "depth": 6, "reverse": True},
        {"id": "p2", "type": "circular_pattern", "name": "CirPattern1", "features": ["e3"], "axis": "Y", "count": 4, "angle": 360},
        {"id": "p3", "type": "mirror", "name": "Mirror1", "features": ["e2"], "plane": {"ref": "Right Plane"}}]}
    rec = X.translate_part(p, "pat")
    assert len(rec.steps) == 9
    assert "circle(-20.0, -25.0, 3.0)" in rec.steps[2] and "circle(0.0, -25.0, 3.0)" in rec.steps[3]   # sketch y -> part -z
    assert "circle(0.0, 30.0, 4.0)" in rec.steps[5] and "circle(40.0, -25.0, 3.0)" in rec.steps[8]
