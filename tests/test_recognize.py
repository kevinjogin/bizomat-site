"""Feature recognition (FeatureWorks): imported bodies become feature trees that rebuild to the same solid.

The test bodies are made with build123d the way a STEP file from another CAD system would bring them in; every
result is judged by rebuilding the recognised tree with geometry.py and comparing solids, never by trusting the
recogniser's own report.
"""
import json
import os
import shutil
import subprocess
import tempfile
import time

import pytest
from build123d import (Align, Axis, Box, BuildLine, BuildPart, BuildSketch, CounterBoreHole, CounterSinkHole,
                       Cylinder, GeomType, Hole, Location, Locations, Mode, Plane, Polyline, RectangleRounded, Sphere,
                       chamfer, export_step, extrude, fillet, make_face)
from fastapi.testclient import TestClient

from opensketch import ai, geometry, importer, inspection, recognize, server


# ----------------------------------------------------------------------------- bodies

def plate():
    """Plate, four through holes, rounded corners, top edges filleted."""
    with BuildPart() as p:
        Box(80, 50, 10)
        fillet(p.edges().filter_by(Axis.Z), 5)
        with Locations((30, 15, 0), (-30, 15, 0), (-30, -15, 0), (30, -15, 0)):
            Hole(3)
        fillet(p.edges().group_by(Axis.Z)[-1].filter_by(GeomType.LINE), 1)
    return p.part


def bracket():
    with BuildPart() as p:
        with BuildSketch(Plane.XY):
            with BuildLine():
                Polyline((0, 0), (40, 0), (40, 4), (4, 4), (4, 30), (0, 30), close=True)
            make_face()
        extrude(amount=20)
        with Locations(Location((20, 4, 10), (-90, 0, 0))):
            Hole(2.5)
    return p.part


def pocket_box():
    with BuildPart() as p:
        Box(60, 40, 20, align=(Align.CENTER, Align.CENTER, Align.MIN))
        with BuildSketch(Plane.XY.offset(20)):
            RectangleRounded(40, 20, 4)
        extrude(amount=-12, mode=Mode.SUBTRACT)
        chamfer(p.edges().group_by(Axis.Z)[-1].filter_by(lambda e: e.length > 39), 1)
    return p.part


def shaft():
    with BuildPart() as p:
        Cylinder(10, 30, align=(Align.CENTER, Align.CENTER, Align.MIN))
        with Locations((0, 0, 30)):
            Cylinder(6, 25, align=(Align.CENTER, Align.CENTER, Align.MIN))
        chamfer(p.edges().group_by(Axis.Z)[-1], 1)
    return p.part


def hole_styles():
    with BuildPart() as p:
        Box(60, 30, 12)
        with Locations((-18, 0, 6)):
            CounterBoreHole(3, 5, 4)
        with Locations((0, 0, 6)):
            CounterSinkHole(3, 6)
        with Locations((18, 0, 6)):
            Hole(2.5, depth=7)
    return p.part


def boss_plate():
    with BuildPart() as p:
        Box(50, 50, 6, align=(Align.CENTER, Align.CENTER, Align.MIN))
        with Locations((0, 0, 6)):
            Cylinder(8, 10, align=(Align.CENTER, Align.CENTER, Align.MIN))
        fillet(p.edges().filter_by(GeomType.CIRCLE).group_by(Axis.Z)[0], 2)
    return p.part


def blob():
    with BuildPart() as p:
        Sphere(20)
        Box(50, 50, 10, mode=Mode.INTERSECT)
        Hole(4)
    return p.part


def hole_row():
    with BuildPart() as p:
        Box(100, 20, 5)
        with Locations(*[(-40 + 20 * i, 0, 2.5) for i in range(5)]):
            CounterBoreHole(2, 3.5, 2)
    return p.part


def placed_tube():
    """A small tube far from the origin, as parts come out of an assembly STEP (world coordinates)."""
    with BuildPart() as p:
        with Locations((84, 16, 21.8)):
            Cylinder(3, 2.3)
            Hole(1.55)
    return p.part


def rounded_holes():
    """Eight holes with their top edges rounded: eight separate fillet chains of one radius, found in packs and
    written back as one Fillet feature."""
    with BuildPart() as p:
        Box(90, 40, 6)
        with Locations(*[(-35 + 10 * i, 0, 3) for i in range(8)]):
            Hole(2)
        fillet(p.edges().filter_by(GeomType.CIRCLE).group_by(Axis.Z)[-1], 0.5)
    return p.part


def solid(fn):
    return fn().solids()[0]


def rebuilt(feats):
    st, _ = geometry.regen({"features": feats})
    assert not [s for s in st.status if s.get("state") == "error"], st.status
    return geometry.solid_of(st.part)


def same(a, b):
    return recognize.diff_volume(a, b) <= max(2e-6 * b.volume, 1e-6)


def by_type(feats, t):
    return [f for f in feats if f["type"] == t]


# ----------------------------------------------------------------------------- recognition

CASES = {
    # name: (body, base, {feature type: count}), extrude counts boss extrudes and cut extrudes together
    "plate": (plate, "extrude", {"extrude": 1, "fillet": 1}),
    "bracket": (bracket, "extrude", {"extrude": 1, "hole": 1}),
    "pocket_box": (pocket_box, "extrude", {"extrude": 2, "chamfer": 1}),
    "shaft": (shaft, "revolve", {"revolve": 1, "chamfer": 1}),
    "hole_styles": (hole_styles, "extrude", {"extrude": 1, "hole": 3}),
    "boss_plate": (boss_plate, "extrude", {"extrude": 2, "fillet": 1}),
    "blob": (blob, "import", {"import": 1, "hole": 1}),
    "hole_row": (hole_row, "extrude", {"extrude": 1, "hole": 1, "linear_pattern": 1}),
    "placed_tube": (placed_tube, "extrude", {"extrude": 1}),
    "rounded_holes": (rounded_holes, "extrude", {"extrude": 1, "fillet": 1}),
}


@pytest.mark.parametrize("name", list(CASES))
def test_recognized_tree_rebuilds_the_same_solid(name):
    fn, base, counts = CASES[name]
    body = solid(fn)
    res = recognize.recognize_body(body)
    rep = res["report"]
    assert res["ok"] and rep["exact"], rep
    assert rep["base"] == base
    feats = res["features"]
    got = {t: len(by_type(feats, t)) for t in counts}
    assert got == counts, [(f["name"], f["type"]) for f in feats]
    assert same(rebuilt(feats), body)
    assert len({f["id"] for f in feats}) == len(feats)
    assert len({f["name"] for f in feats}) == len(feats)


def test_plate_sketch_holds_the_holes_and_is_fully_defined():
    res = recognize.recognize_body(solid(plate))
    sk = by_type(res["features"], "sketch")[0]
    assert sk["plane"] == {"ref": "Front Plane"}
    assert len([e for e in sk["entities"] if e["type"] == "circle"]) == 4  # through holes go in the sketch
    assert len([e for e in sk["entities"] if e["type"] == "arc"]) == 4     # rounded corners stay sketch arcs
    ext = by_type(res["features"], "extrude")[0]
    assert ext["end"] == "midplane" and ext["depth"] == 10
    fil = by_type(res["features"], "fillet")[0]
    assert fil["radius"] == 1 and len(fil["edges"]) == 8
    dims = [c for c in sk["constraints"] if c["type"] in ("distance", "diameter", "radius", "angle")]
    assert {c["name"] for c in dims} == {f"D{i + 1}" for i in range(len(dims))}
    assert all(c["type"] != "diameter" or c["value"] == 6 for c in dims)
    # The browser's own solver agrees: fully defined, nothing over-defining.
    out, why = inspection.solve_sketches([sk])
    if why is None:
        out = out[sk["id"]]
        assert out["status"] == "fully" and out["dof"] == 0 and not out["conflicts"]


def test_hole_styles_are_read_with_their_sizes():
    res = recognize.recognize_body(solid(hole_styles))
    holes = sorted(by_type(res["features"], "hole"), key=lambda f: f["x"])
    cb, cs, blind = holes
    assert cb["style"] == "counterbore" and cb["diameter"] == 6 and cb["bore_diameter"] == 10 and cb["bore_depth"] == 4
    assert cs["style"] == "countersink" and cs["diameter"] == 6 and cs["sink_diameter"] == 12 and cs["sink_angle"] == 82
    assert blind["style"] == "simple" and blind["end"] == "blind" and blind["depth"] == 7 and blind["diameter"] == 5
    assert all(h["end"] == "through_all" for h in (cb, cs))
    assert all(h["plane"]["type"] == "face" and h["plane"]["normal"] == [0, 0, 1] and h["reverse"] for h in holes)


def test_pocket_is_a_cut_from_the_top_face_that_follows_the_block():
    res = recognize.recognize_body(solid(pocket_box))
    sketches = by_type(res["features"], "sketch")
    cut = [f for f in by_type(res["features"], "extrude") if f["op"] == "cut"][0]
    assert cut["depth"] == 12 and cut["reverse"]
    top = next(s for s in sketches if s["id"] == cut["sketch"])
    assert top["plane"]["type"] == "face"
    # Make the block taller: the pocket moves up with the top face and keeps its depth.
    feats = json.loads(json.dumps(res["features"]))
    base = next(f for f in feats if f["type"] == "extrude" and f["op"] == "boss")
    base["depth"] = 25
    st, _ = geometry.regen({"features": feats})
    assert not [s for s in st.status if s.get("state") == "error"]
    bb = st.part.bounding_box()
    assert abs(bb.max.Z - 25) < 1e-6
    floor = [f for f in st.part.faces() if f.geom_type == GeomType.PLANE and abs(f.normal_at().Z - 1) < 1e-9
             and abs(f.center().Z - 13) < 1e-6]
    assert floor, "the pocket floor should sit 12 mm under the new top"


def test_kinds_limit_what_is_recognized():
    body = solid(plate)
    res = recognize.recognize_body(body, kinds=["extrudes", "holes"])  # fillets stay in the body
    assert res["report"]["base"] == "import" and not by_type(res["features"], "fillet")
    with pytest.raises(recognize.RecognizeError):
        recognize.recognize_body(body, kinds=["bosses"])


def test_nothing_recognizable_is_reported_plainly():
    with BuildPart() as p:
        Sphere(10)
    res = recognize.recognize_body(p.part.solids()[0])
    assert not res["ok"] and res["features"] is None
    assert "No features recognized" in res["report"]["message"]


def test_stop_ends_early():
    res = recognize.recognize_body(solid(plate), stop=lambda: True)
    assert not res["ok"] or res["report"]["base"] in ("import", "extrude")


# ----------------------------------------------------------------------------- documents

def step_doc(*bodies):
    from build123d import Compound
    fd, path = tempfile.mkstemp(suffix=".step")
    os.close(fd)
    try:
        shape = bodies[0] if len(bodies) == 1 else Compound(children=list(bodies))
        export_step(shape, path)
        return importer.import_step(open(path, "rb").read(), "parts.step")
    finally:
        os.unlink(path)


def test_part_document_keeps_later_features_and_rebuilds():
    doc = step_doc(solid(bracket))
    body = importer.decode_shape(doc["features"][0]["data"])
    edge = max((e for e in body.edges() if e.geom_type == GeomType.LINE), key=lambda e: e.position_at(0.5).Z)
    doc["features"].append({"id": "f9", "type": "chamfer", "name": "Chamfer1", "distance": 0.5,
                            "edges": [{"mid": geometry.vlist(edge.position_at(0.5))}]})
    before = rebuilt(doc["features"])
    r = recognize.recognize_part(doc)
    assert r["ok"] and r["report"]["exact"]
    feats = r["part"]["features"]
    assert feats[-1]["id"] == "f9" and not by_type(feats, "import")
    assert feats[-1]["name"] == "Chamfer1" and "Chamfer1" not in [f["name"] for f in feats[:-1]]
    assert same(rebuilt(feats), before)


def test_refuses_parts_without_an_import_or_with_solids_before_it():
    with pytest.raises(recognize.RecognizeError):
        recognize.recognize_part({"features": []})
    doc = step_doc(solid(bracket))
    doc["features"].insert(0, {"id": "s0", "type": "sketch", "name": "Sketch0", "plane": {"ref": "Front Plane"},
                               "entities": [], "constraints": []})
    doc["features"].insert(1, {"id": "e0", "type": "extrude", "name": "Boss-Extrude0", "sketch": "s0", "depth": 1})
    with pytest.raises(recognize.RecognizeError):
        recognize.recognize_part(doc)


def test_assembly_parts_are_recognized_one_by_one():
    tube = solid(placed_tube)
    asm = step_doc(solid(bracket), tube)
    assert asm["type"] == "assembly" and len(recognize.imported_parts(asm)) == 2
    seen = []
    res = recognize.recognize_doc(asm, progress=lambda done, total, name, reps: seen.append((done, total)))
    assert sorted(res["changed"]) == sorted(asm["parts"])
    assert seen[0] == (0, 2) and seen[-1] == (2, 2)
    for pid in res["changed"]:
        assert res["parts"][pid]["exact"]
        assert not by_type(res["doc"]["parts"][pid]["features"], "import")
    one = recognize.recognize_doc(asm, part_id=res["changed"][0])
    assert one["changed"] == [res["changed"][0]]
    with pytest.raises(recognize.RecognizeError):
        recognize.recognize_doc(asm, part_id="nope")


# ----------------------------------------------------------------------------- AI, MCP and the REST job

def test_ai_session_streams_the_recognized_tree_as_a_proposal():
    doc = step_doc(solid(bracket))
    sess = ai.Session(doc)
    report, clean, events = sess.apply("recognize_features", {})
    rep = json.loads(report)
    assert clean and rep["changed"] == ["part"] and rep["parts"]["part"]["exact"]
    kinds = [e["ev"] for e in events]
    assert kinds[0] == "build_start" and kinds[-1] == "proposal" and kinds.count("build_step") == len(sess.work["features"])
    assert not by_type(sess.work["features"], "import")
    assert "recognize_features" in [t["name"] for t in ai.TOOLS]
    assert "recognize_features" in ai.SYSTEM


@pytest.fixture
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)


def test_mcp_recognize_features_saves_one_version(data):
    from opensketch import auth, store
    from tests.test_mcp import _rpc
    doc = step_doc(solid(hole_styles))
    with TestClient(server.app) as c:
        url = f"/mcp/{auth.mcp_token()}"
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                    "clientInfo": {"name": "test", "version": "1"}})
        tools = {t["name"]: t for t in _rpc(c, url, "tools/list")["tools"]}
        assert "recognize_features" in tools
        rec = store.create("Holes", doc)
        res = _rpc(c, url, "tools/call", {"name": "recognize_features", "arguments": {"doc_id": rec["id"]}})
        body = json.loads(res["content"][0]["text"])
        assert body["clean"] and body["version"] == rec["version"] + 1
        assert body["report"]["parts"]["part"]["counts"]["hole"] == 3
        saved = store.get(rec["id"])
        assert saved["by"] == "claude" and not by_type(saved["doc"]["features"], "import")


def test_rest_job_recognizes_and_can_be_stopped(data):
    doc = step_doc(solid(pocket_box))
    with TestClient(server.app) as c:
        assert c.post("/api/recognize/start", json={"doc": {"features": []}}).status_code == 400
        assert c.post("/api/recognize/start", json={"doc": doc, "kinds": ["bosses"]}).status_code == 400
        jid = c.post("/api/recognize/start", json={"doc": doc}).json()["job"]
        for _ in range(600):
            s = c.get(f"/api/recognize/{jid}").json()
            if s["state"] not in ("running", "cancelling"):
                break
            time.sleep(0.1)
        assert s["state"] == "done", s
        upd = s["result"]["updates"]["part"]
        assert s["result"]["changed"] == ["part"] and s["parts"]["part"]["exact"]
        assert same(rebuilt(upd["features"]), importer.decode_shape(doc["features"][0]["data"]))
        # A stopped job frees the slot for the next one.
        jid = c.post("/api/recognize/start", json={"doc": step_doc(solid(plate))}).json()["job"]
        assert c.delete(f"/api/recognize/{jid}").json()["state"] in ("cancelling", "done", "cancelled")
        for _ in range(600):
            s = c.get(f"/api/recognize/{jid}").json()
            if s["state"] not in ("running", "cancelling"):
                break
            time.sleep(0.1)
        assert s["state"] in ("cancelled", "done")
        assert c.get("/api/recognize/nope").status_code == 404


# ----------------------------------------------------------------------------- Fully Define

def test_define_cli_never_over_defines():
    """A rectangle offered horizontal/vertical relations and all four lengths keeps only two lengths."""
    if not shutil.which("node"):
        pytest.skip("needs node")
    pts = [(0, 0), (40, 0), (40, 20), (0, 20)]
    ents = [{"id": f"p{i}", "type": "point", "x": x, "y": y} for i, (x, y) in enumerate(pts)]
    ents += [{"id": f"l{i}", "type": "line", "p1": f"p{i}", "p2": f"p{(i + 1) % 4}"} for i in range(4)]
    cands = [{"id": "h0", "type": "horizontal", "refs": ["l0"]}, {"id": "h2", "type": "horizontal", "refs": ["l2"]},
             {"id": "v1", "type": "vertical", "refs": ["l1"]}, {"id": "v3", "type": "vertical", "refs": ["l3"]}]
    cands += [{"id": f"d{i}", "type": "distance", "refs": [f"l{i}"], "value": 40 if i % 2 == 0 else 20} for i in range(4)]
    cands += [{"id": "o", "type": "coincident", "refs": ["p0", "origin"]}, {"id": "bad", "type": "distance", "refs": ["l0"], "value": 41}]
    req = {"sketches": [{"id": "s", "entities": ents, "constraints": [], "candidates": cands}]}
    out = subprocess.run(["node", str(recognize.DEFINE_CLI)], input=json.dumps(req), capture_output=True, text=True,
                         timeout=60)
    r = json.loads(out.stdout)["s"]
    assert r["dof"] == 0 and r["status"] == "fully"
    assert "bad" not in r["accepted"]  # untrue for the geometry
    assert len([a for a in r["accepted"] if a.startswith("d")]) == 2
    assert len([a for a in r["accepted"] if a[0] in "hv"]) == 4  # each ties a different pair of coordinates


# ----------------------------------------------------------------------------- safety nets

def test_solid_check_sees_a_moved_hole_of_the_same_volume():
    def plate_with_hole(x):
        with BuildPart() as p:
            Box(40, 20, 5)
            with Locations((x, 0, 0)):
                Hole(3)
        return p.part.solids()[0]
    a, b = plate_with_hole(10), plate_with_hole(-10)
    assert abs(a.volume - b.volume) < 1e-9
    assert recognize.same_solid(a, b, 1e-6, 1e-5)[0] is False
    assert recognize.surfaces_match(a, b, 1e-5) is False
    assert recognize.same_solid(a, plate_with_hole(10), 1e-6, 1e-5)[0] is True


def test_worker_that_hangs_is_killed_and_the_step_left_in_the_body(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_RECOGNIZE_STALL", "('fillet'")  # every fillet attempt hangs
    doc = step_doc(solid(plate))
    t = time.monotonic()
    r = recognize.recognize_part_safe(doc, hang=3)
    assert time.monotonic() - t < 90
    assert r["ok"] and r["report"]["exact"]
    feats = r["part"]["features"]
    assert not by_type(feats, "fillet") and by_type(feats, "import")  # the fillet stays in the imported body
    assert len(by_type(feats, "hole")) + 3 * len(by_type(feats, "linear_pattern")) >= 1  # the holes still come off
    assert any("stopped responding" in n for n in r["report"]["notes"])


def test_generic_step_labels_give_way_to_the_file_name():
    fd, path = tempfile.mkstemp(suffix=".step")
    os.close(fd)
    try:
        export_step(solid(bracket), path)  # build123d labels it "Open CASCADE STEP translator ..."
        doc = importer.import_step(open(path, "rb").read(), "lever_arm.step")
    finally:
        os.unlink(path)
    assert doc["name"] == "lever_arm"
    assert importer._clean_name("Inside_plate", "x") == "Inside_plate"
    assert importer._clean_name("Open_CASCADE_STEP_translator_7_8_7", "x") == "x"


def test_rim_fillets_follow_a_recognised_hole_pattern():
    """Blind holes in a row become a hole + pattern; the rim fillet must name the pattern's copies, so it keeps
    all four rims when the spacing is edited (it used to name holes the pattern had replaced)."""
    with BuildPart() as p:
        Box(90, 40, 10)
        with Locations(*[(-30 + 20 * i, 0, 5) for i in range(4)]):
            Hole(1, 4)
        fillet(p.edges().filter_by(GeomType.CIRCLE).group_by(Axis.Z)[-1], 0.5)
    body = p.part.solids()[0]
    res = recognize.recognize_body(body)
    assert res["ok"] and res["report"]["exact"], res["report"]
    feats = res["features"]
    assert len(by_type(feats, "linear_pattern")) == 1
    st, _ = geometry.regen({"features": feats})
    assert not [s for s in st.status if s.get("warnings")], [s for s in st.status if s.get("warnings")]
    pat = by_type(feats, "linear_pattern")[0]
    pat["spacing"] = 21
    st, _ = geometry.regen({"features": feats})
    assert sum(1 for f in st.part.faces() if f.geom_type == GeomType.TORUS) == 4
