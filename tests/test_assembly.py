"""Assembly: mate solver, regen output, interference, export."""
import math

import numpy as np
import pytest

from opensketch import assembly as A


def rect_sketch(sid, plane, w, h, cx=0, cy=0):
    pts = [("a", -w / 2, -h / 2), ("b", w / 2, -h / 2), ("c", w / 2, h / 2), ("d", -w / 2, h / 2)]
    ents = [{"id": f"{sid}{i}", "type": "point", "x": x + cx, "y": y + cy} for i, x, y in pts]
    ents += [{"id": f"{sid}l{k}", "type": "line", "p1": f"{sid}{pts[k][0]}", "p2": f"{sid}{pts[(k + 1) % 4][0]}"} for k in range(4)]
    return {"id": sid, "type": "sketch", "name": "Sketch1", "plane": {"ref": plane}, "entities": ents, "constraints": []}


def circle_sketch(sid, plane, r):
    return {"id": sid, "type": "sketch", "name": "Sketch1", "plane": {"ref": plane},
            "entities": [{"id": sid + "c", "type": "point", "x": 0, "y": 0}, {"id": sid + "o", "type": "circle", "center": sid + "c", "r": r}],
            "constraints": []}


def plate():
    return {"name": "Plate", "features": [
        rect_sketch("s1", "Top Plane", 80, 60),
        {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 10},
        circle_sketch("s2", "Top Plane", 5),
        {"id": "e2", "type": "extrude", "name": "Cut-Extrude1", "sketch": "s2", "op": "cut", "end": "through_all", "dir2": {"end": "through_all"}},
    ]}


def pin():
    return {"name": "Pin", "features": [circle_sketch("s1", "Top Plane", 5),
                                        {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 40}]}


def asm_doc():
    return {"type": "assembly", "name": "Assem1", "parts": {"plate": plate(), "pin": pin()},
            "components": [
                {"id": "c1", "part": "plate", "name": "Plate<1>", "fixed": True, "position": [0, 0, 0], "rotation": [0, 0, 0]},
                {"id": "c2", "part": "pin", "name": "Pin<1>", "position": [33, 70, -12], "rotation": [10, 0, 25]},
            ],
            "mates": [
                {"id": "m1", "type": "concentric", "refs": [{"component": "c1", "axis": {"point": [0, 0, 0], "dir": [0, 1, 0]}},
                                                          {"component": "c2", "ref": "Y axis"}]},
                {"id": "m2", "type": "coincident", "align": "aligned",
                 "refs": [{"component": "c1", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}},
                          {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]},
            ]}


def test_euler_roundtrip():
    for r in ([10, 20, 30], [0, 0, 90], [-45, 30, 170]):
        assert np.allclose(A.euler_of(A.rot_euler(r)), r, atol=1e-6)


def test_pin_in_hole():
    res = A.regen_assembly(asm_doc())
    assert all(m["state"] == "ok" for m in res["mates"]), res["mates"]
    pin_ = next(c for c in res["components"] if c["id"] == "c2")
    # pin axis vertical through the hole, bottom flush with plate bottom (y = 0)
    assert np.allclose(pin_["position"], [0, 0, 0], atol=1e-4)
    R = np.array(pin_["matrix"]).reshape(4, 4)[:3, :3]
    assert abs(R[1, 1] - 1) < 1e-6
    assert pin_["state"] == "under" and pin_["dof"] == 1  # still free to spin about its axis
    assert next(c for c in res["components"] if c["id"] == "c1")["state"] == "fixed"
    assert "body" in res["parts"]["pin"]
    # known meshes are not resent
    res2 = A.regen_assembly(asm_doc(), known={k: v["key"] for k, v in res["parts"].items()})
    assert "body" not in res2["parts"]["pin"]


def test_distance_and_conflict():
    d = asm_doc()
    d["mates"][1] = {"id": "m2", "type": "distance", "value": 15, "align": "aligned",
                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}]}
    res = A.regen_assembly(d)
    p = next(c for c in res["components"] if c["id"] == "c2")
    assert abs(p["position"][1] - 25) < 1e-4
    # add a conflicting mate: the pin cannot also sit on the plate bottom
    d["mates"].append({"id": "m3", "type": "coincident", "align": "aligned",
                       "refs": [{"component": "c1", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}},
                                {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}]})
    res = A.regen_assembly(d)
    assert any(m["state"] == "error" for m in res["mates"])


def test_lock_and_interference(tmp_path):
    d = asm_doc()
    d["mates"] = [{"id": "m1", "type": "lock", "refs": [{"component": "c1", "ref": "Origin"}, {"component": "c2", "ref": "Origin"}]}]
    d["components"][1].update(position=[30, 0, 20], rotation=[0, 0, 0])
    res = A.regen_assembly(d)
    p = next(c for c in res["components"] if c["id"] == "c2")
    assert p["state"] == "full" and np.allclose(p["position"], [30, 0, 20], atol=1e-6)
    assert "pose" in res["updates"]["m1"]
    inter = A.interference(d)  # pin at (30, 0, 20) cuts through the plate
    assert len(inter["interferences"]) == 1
    assert inter["interferences"][0]["volume"] == pytest.approx(math.pi * 25 * 10, rel=1e-3)
    A.export(d, "step", str(tmp_path / "a.step"))
    assert (tmp_path / "a.step").stat().st_size > 1000


def test_bad_mate_reports_error():
    d = asm_doc()
    d["mates"].append({"id": "m9", "type": "concentric", "refs": [{"component": "c1", "ref": "Top Plane"}, {"component": "c2", "ref": "Y axis"}]})
    res = A.regen_assembly(d)
    m9 = next(m for m in res["mates"] if m["id"] == "m9")
    assert m9["state"] == "error" and "axes" in m9["message"]


def test_mates_follow_faces_when_a_part_changes():
    d = asm_doc()
    d["mates"][1] = {"id": "m2", "type": "coincident", "align": "anti",
                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]}
    res = A.regen_assembly(d)
    assert abs(next(c for c in res["components"] if c["id"] == "c2")["position"][1] - 10) < 1e-4
    d = A.apply_solution(d, res)
    d["parts"]["plate"]["features"][1]["depth"] = 16  # plate gets thicker: the pin must follow its top face
    res = A.regen_assembly(d)
    assert abs(next(c for c in res["components"] if c["id"] == "c2")["position"][1] - 16) < 1e-4
    assert res["updates"]["m2"]["refs"][0]["plane"]["point"][1] == 16
