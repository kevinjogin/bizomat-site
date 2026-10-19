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
    # like SOLIDWORKS: only the new mate is in error, it names the mate it fights, and nothing moves
    states = {m["id"]: m for m in res["mates"]}
    assert states["m1"]["state"] == states["m2"]["state"] == "ok"
    assert states["m3"]["state"] == "error" and states["m3"]["over_defining"] and states["m3"]["conflicts_with"] == ["m2"]
    assert states["m3"]["message"] == "Over defines the assembly: conflicts with m2."
    p = next(c for c in res["components"] if c["id"] == "c2")
    assert abs(p["position"][1] - 25) < 1e-4 and p["state"] == "under" and p["dof"] == 1


def test_suppressed_component_suppresses_its_mates():
    from opensketch import preview
    d = asm_doc()
    d["components"][1]["suppressed"] = True
    res = A.regen_assembly(d)
    assert [m["state"] for m in res["mates"]] == ["suppressed", "suppressed"]
    assert preview.render_preview(d)  # no "fix mate errors" refusal
    d["mates"][0]["refs"][1]["component"] = "c9"
    assert A.regen_assembly(d)["mates"][0] == {"id": "m1", "state": "error", "message": "Component c9 is missing"}


def test_mate_planes_stay_on_an_unchanged_tray_rim():
    """A rim's centre lies over the pocket; the pocket floor is nearer to it than the rim's edge. An unchanged
    part keeps the reference; a taller tray moves a reference stored on the rim with the rim."""
    from build123d import Align, Box, Pos
    tray = lambda h: Box(100, h, 100, align=(Align.CENTER, Align.MIN, Align.CENTER)) - Pos(0, h - 2.5, 0) * Box(60, 5, 60)
    assert A.refind({"component": "c", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}}, tray(10)) is None
    assert A.refind({"component": "c", "plane": {"point": [45, 10, 0], "normal": [0, 1, 0]}}, tray(10)) is None
    moved = A.refind({"component": "c", "plane": {"point": [45, 10, 0], "normal": [0, 1, 0]}}, tray(12))
    assert moved["plane"]["point"] == [45, 12, 0]


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


def hinge_doc():
    """A base block and a lid hinged on a pin axis along X at the back top edge."""
    base = {"name": "Base", "features": [rect_sketch("s1", "Top Plane", 100, 60), {"id": "e1", "type": "extrude", "name": "B", "sketch": "s1", "depth": 20}]}
    lid = {"name": "Lid", "features": [rect_sketch("s1", "Top Plane", 100, 60, 0, -30), {"id": "e1", "type": "extrude", "name": "B", "sketch": "s1", "depth": 5}]}
    # lid local: x -50..50, y 0..5, z 0..60 (sketch y -> world -z, centred at sketch y=-30 => z in 0..60)
    return {"type": "assembly", "parts": {"base": base, "lid": lid},
            "components": [{"id": "c1", "part": "base", "name": "Base<1>", "fixed": True, "position": [0, 0, 0], "rotation": [0, 0, 0]},
                           {"id": "c2", "part": "lid", "name": "Lid<1>", "position": [0, 20, -30], "rotation": [0, 0, 0]}],
            "mates": [{"id": "m1", "name": "Hinge1", "type": "hinge",
                       "refs": [{"component": "c1", "axis": {"point": [0, 20, -30], "dir": [1, 0, 0]}},
                                {"component": "c2", "axis": {"point": [0, 0, 0], "dir": [1, 0, 0]}}],
                       "planes": [{"component": "c1", "plane": {"point": [50, 10, 0], "normal": [1, 0, 0]}},
                                  {"component": "c2", "plane": {"point": [50, 2.5, 30], "normal": [1, 0, 0]}}],
                       "align": "aligned"}]}


def test_hinge_turns_when_dragged():
    d = hinge_doc()
    res = A.regen_assembly(d)
    lid = next(c for c in res["components"] if c["id"] == "c2")
    assert lid["state"] == "under" and lid["dof"] == 1 and res["mates"][0]["state"] == "ok"
    # grab the lid's front edge (local z=60) and pull it straight up: the lid must swing about the hinge
    d = A.apply_solution(d, res)
    res = A.regen_assembly(d, drag={"component": "c2", "point": [0, 5, 60], "target": [0, 80, 0]})
    lid = next(c for c in res["components"] if c["id"] == "c2")
    assert np.allclose(lid["position"], [0, 20, -30], atol=1e-4)  # stays on the hinge axis
    R = np.array(lid["matrix"]).reshape(4, 4)[:3, :3]
    front = R @ np.array([0, 5, 60.0]) + np.array(lid["position"])
    assert front[1] > 50  # swung up
    assert all(m["state"] == "ok" for m in res["mates"])


def test_hinge_angle_limit():
    d = hinge_doc()
    m = d["mates"][0]
    m["angle_refs"] = [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}},
                       {"component": "c2", "plane": {"point": [0, 5, 30], "normal": [0, 1, 0]}}]
    m["angle_min"], m["angle_max"] = 0, 110
    res = A.regen_assembly(d, drag={"component": "c2", "point": [0, 5, 60], "target": [0, 0, -200]})  # pull it right over
    lid = next(c for c in res["components"] if c["id"] == "c2")
    R = np.array(lid["matrix"]).reshape(4, 4)[:3, :3]
    ang = np.degrees(np.arccos(np.clip(R[:, 1] @ np.array([0, 1, 0]), -1, 1)))
    assert ang <= 110.5 and ang > 60, ang


def test_slider_and_limit_distance():
    d = asm_doc()  # pin concentric in the plate hole, free to slide and spin
    d["mates"] = d["mates"][:1] + [{"id": "m3", "type": "limit_distance", "min": 0, "max": 25,
                                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                                              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}],
                                     "align": "aligned"}]
    d["components"][1].update(position=[0, 15, 0], rotation=[0, 0, 0])
    res = A.regen_assembly(d, drag={"component": "c2", "point": [0, 0, 0], "target": [30, 300, 0]})
    pin = next(c for c in res["components"] if c["id"] == "c2")
    assert abs(pin["position"][0]) < 1e-4 and abs(pin["position"][2]) < 1e-4  # still in the hole
    assert pin["position"][1] == pytest.approx(35, abs=1e-3)  # stopped by the limit (10 + 25)


def test_mate_candidates_for_unmated_assembly():
    d = asm_doc()
    d["mates"] = []
    d["components"][1].update(position=[0, 10, 0], rotation=[0, 0, 0])  # pin standing in the hole, sitting on the plate top
    cands = A.mate_candidates(d)
    kinds = {c["type"] for c in cands}
    assert "concentric" in kinds and "coincident" in kinds
    conc = next(c for c in cands if c["type"] == "concentric")
    assert conc["radii"] == [5.0, 5.0]
    # using the suggested mates places the pin, leaving it free to spin
    d["mates"] = [{"id": "m1", **{k: v for k, v in conc.items() if k in ("type", "refs")}}]
    d["components"][1].update(position=[3, 30, 2])
    res = A.regen_assembly(d)
    pin = next(c for c in res["components"] if c["id"] == "c2")
    assert abs(pin["position"][0]) < 1e-4 and abs(pin["position"][2]) < 1e-4


def comp_of(res, cid):
    return next(c for c in res["components"] if c["id"] == cid)


def test_float_really_floats():
    # nothing fixed: no component is silently fixed, and dragging one carries the mated one along
    d = A.apply_solution(asm_doc(), A.regen_assembly(asm_doc()))
    del d["components"][0]["fixed"]
    res = A.regen_assembly(d)
    assert comp_of(res, "c1")["state"] == "under" and comp_of(res, "c2")["state"] == "under"
    assert np.allclose(comp_of(res, "c2")["position"], [0, 0, 0], atol=1e-4)  # nothing drifts when floated
    res = A.regen_assembly(d, drag={"component": "c1", "point": [40, 5, 30], "target": [140, 5, 30]})
    plate_, pin_ = comp_of(res, "c1"), comp_of(res, "c2")
    assert plate_["position"][0] > 90
    assert np.allclose(pin_["position"], plate_["position"], atol=1e-3)  # the pin stays in the hole
    assert np.allclose(plate_["rotation"], [0, 0, 0], atol=1e-2)  # slides, does not tumble
    assert all(m["state"] == "ok" for m in res["mates"])


def chain_doc():
    """Plate fixed; a block lying on it (free to slide and turn in its plane); a pin in the block's hole."""
    block = {"name": "Block", "features": [rect_sketch("s1", "Top Plane", 40, 40), {"id": "e1", "type": "extrude", "name": "B", "sketch": "s1", "depth": 10}]}
    return {"type": "assembly", "parts": {"plate": plate(), "block": block, "pin": pin()},
            "components": [{"id": "c1", "part": "plate", "name": "Plate<1>", "fixed": True, "position": [0, 0, 0], "rotation": [0, 0, 0]},
                           {"id": "c2", "part": "block", "name": "Block<1>", "position": [100, 10, 0], "rotation": [0, 0, 0]},
                           {"id": "c3", "part": "pin", "name": "Pin<1>", "position": [100, 20, 0], "rotation": [0, 0, 0]}],
            "mates": [{"id": "m1", "type": "coincident", "align": "anti",
                       "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                                {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]},
                      {"id": "m2", "type": "concentric", "refs": [{"component": "c2", "axis": {"point": [10, 0, 0], "dir": [0, 1, 0]}},
                                                                {"component": "c3", "ref": "Y axis"}]}]}


def test_mated_parts_follow_a_drag():
    d = A.apply_solution(chain_doc(), A.regen_assembly(chain_doc()))
    pin0 = np.array(comp_of(A.regen_assembly(d), "c3")["position"])
    # pull the block sideways: the pin rides along in its hole
    res = A.regen_assembly(d, drag={"component": "c2", "point": [-20, 5, 0], "target": [80, 15, 60]})
    blk, pin_ = comp_of(res, "c2"), comp_of(res, "c3")
    R = np.array(blk["matrix"]).reshape(4, 4)[:3, :3]
    hole = R @ np.array([10, 0, 0]) + np.array(blk["position"])
    assert np.linalg.norm(np.array(pin_["position"])[[0, 2]] - hole[[0, 2]]) < 1e-3
    assert np.linalg.norm(np.array(pin_["position"]) - pin0) > 20
    assert abs(blk["position"][1] - 10) < 1e-4  # still on the plate
    # pull the pin sideways: the block follows it across the plate
    res = A.regen_assembly(d, drag={"component": "c3", "point": [0, 20, 0], "target": [110, 20, 80]})
    blk, pin_ = comp_of(res, "c2"), comp_of(res, "c3")
    assert np.linalg.norm(np.array(blk["position"]) - [100, 10, 0]) > 40
    assert all(m["state"] == "ok" for m in res["mates"])
