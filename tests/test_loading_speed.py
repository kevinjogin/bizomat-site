"""Loading speed: one mesh pass per body, the shared build cache, and gzipped mesh responses."""
import gzip
import json

import numpy as np
from fastapi.testclient import TestClient

from opensketch import assembly, demo, geometry
from opensketch.server import app


def _base():
    return {"type": "part", "name": "Base", "features": demo.bracket_features()}


def test_mesh_triangles_face_outward_and_ids_match_faces():
    st, _ = geometry.regen(_base())
    part = st.part
    mesh = geometry.mesh_shape(part)
    faces = part.faces()
    assert [f["id"] for f in mesh["faces"]] == list(range(len(faces)))
    assert len(mesh["edges"]) == len(part.edges())
    for f in mesh["faces"]:
        pos = np.array(f["positions"]).reshape(-1, 3)
        idx = np.array(f["indices"]).reshape(-1, 3)
        assert len(idx) and idx.max() < len(pos)
        if "normal" in f:  # planar: every triangle winds the same way as the face's outward normal
            a, b, c = pos[idx[:, 0]], pos[idx[:, 1]], pos[idx[:, 2]]
            n = np.cross(b - a, c - a)
            assert np.all(n @ np.array(f["normal"]) > 0), f["id"]
    for e in mesh["edges"]:  # the polyline follows the edge through its middle
        pts = np.array(e["points"]).reshape(-1, 3)
        mid = np.array(e["mid"])
        if e["type"] == "line":
            assert len(pts) == 2 and np.allclose(pts.mean(axis=0), mid, atol=1e-4)
        else:
            assert np.min(np.linalg.norm(pts - mid, axis=1)) <= e["length"] / (len(pts) - 1) + 1e-4


def test_part_view_reuses_the_assembly_build():
    part = _base()
    built = assembly.build_part(part)
    # the part view sends the same part with its own bookkeeping (seq, rollback null, another name)
    view = {**json.loads(json.dumps(part)), "seq": 1000, "rollback": None, "name": "Renamed"}
    res = geometry.regen_result(view)
    assert res["body"] is built["mesh"]
    # a geometry change is a new build
    changed = json.loads(json.dumps(view))
    changed["features"][1]["depth"] = changed["features"][1].get("depth", 10) + 5
    assert geometry.regen_result(changed)["body"] is not built["mesh"]


def test_regen_response_is_gzipped_but_ai_stream_is_not():
    c = TestClient(app)
    r = c.post("/api/regen", json={"doc": _base()}, headers={"Accept-Encoding": "gzip"})
    assert r.status_code == 200 and r.headers.get("content-encoding") == "gzip"
    assert r.json()["body"]["faces"]
    r = c.post("/api/ai/stream", json={"doc": {"features": []}, "prompt": "x", "demo": "part"},
               headers={"Accept-Encoding": "gzip"})
    assert r.status_code == 200 and "content-encoding" not in r.headers


def test_big_models_get_a_coarser_mesh(monkeypatch):
    from build123d import Box, Cylinder, Pos
    plate = Box(200, 200, 6) - [Pos(x, y, 0) * Cylinder(2, 10) for x in range(-90, 91, 9) for y in range(-90, 91, 9)]
    assert len(plate.faces()) >= geometry.MESH_FINE_FACES
    tris = lambda m: sum(len(f["indices"]) // 3 for f in m["faces"])
    coarse = geometry.mesh_shape(plate)
    monkeypatch.setattr(geometry, "MESH_FINE_FACES", 10 ** 9)
    fine = geometry.mesh_shape(plate)
    assert len(coarse["faces"]) == len(fine["faces"]) and len(coarse["edges"]) == len(fine["edges"])
    assert tris(coarse) < 0.75 * tris(fine)
