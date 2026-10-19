"""The browser mate solver (static/js/asmsolver.js) must agree with assembly.py: same poses, mate
states, component states, degrees of freedom and document updates, on the same assemblies.
The browser solves drags and mate edits; the server solves for the AI and for exports."""
import copy
import json
import math
import shutil
import subprocess
from pathlib import Path

import numpy as np
import pytest

from opensketch import assembly as A
from tests import test_assembly as T

ROOT = Path(__file__).resolve().parent.parent
pytestmark = pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")


def press():
    from opensketch import ai
    events = list(ai.run_stream({"name": "Part1", "features": []}, "build a hand press", demo=True, demo_speed=0))
    asm = events[-1]["proposal"]
    return A.apply_solution(asm, A.regen_assembly(asm))


def lock_and_distance():
    d = T.asm_doc()
    d["mates"] = [d["mates"][0], {"id": "m3", "type": "distance", "value": 12,
                                  "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                                           {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]},
                  {"id": "m4", "type": "angle", "value": 30, "refs": [{"component": "c1", "plane": {"point": [0, 0, 0], "normal": [1, 0, 0]}},
                                                                      {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [1, 0, 0]}}]}]
    return d


def conflict():
    d = T.asm_doc()
    d["mates"].append({"id": "m9", "type": "distance", "value": 30, "refs": [{"component": "c1", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}},
                                                                            {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}]})
    d["mates"].append({"id": "m10", "type": "concentric", "refs": [{"component": "c2", "ref": "Y axis"}, {"component": "c2", "ref": "X axis"}]})
    return d


def locked():
    d = T.asm_doc()
    d["mates"] = [{"id": "m1", "type": "lock", "refs": [{"component": "c1", "ref": "Origin"}, {"component": "c2", "ref": "Origin"}]}]
    return d


def limits():
    d = T.hinge_doc()
    m = d["mates"][0]
    m["angle_refs"] = [{"component": "c1", "plane": {"point": [0, 20, 0], "normal": [0, 1, 0]}},
                       {"component": "c2", "plane": {"point": [0, 5, 30], "normal": [0, 1, 0]}}]
    m["angle_min"], m["angle_max"] = 0, 110
    return d


def slider():
    d = T.asm_doc()
    d["mates"] = d["mates"][:1] + [{"id": "m3", "type": "limit_distance", "min": 0, "max": 25,
                                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                                              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}],
                                     "align": "aligned"}]
    d["components"][1].update(position=[0, 15, 0], rotation=[0, 0, 0])
    return d


def floated(d):
    d = copy.deepcopy(d)
    for c in d["components"]:
        c.pop("fixed", None)
    return d


def lock_cases():
    from opensketch import demo
    d = demo.lock_doc()
    d["components"][2]["position"] = [30, 4, 5]  # tongue far from where the law puts it
    pinned = copy.deepcopy(d)
    pinned["mates"][0]["angle_min"] = pinned["mates"][0]["angle_max"] = 125
    ratio = copy.deepcopy(pinned)
    ratio["mates"][3].pop("law")
    ratio["mates"][3].update(ratio=0.4, offset=-30)
    bad = copy.deepcopy(d)
    bad["mates"][3]["law"] = [[90, 8], [90, 9]]
    bad["mates"].append({**copy.deepcopy(d["mates"][3]), "id": "m9", "input": "speed"})
    solved = A.apply_solution(demo.lock_doc(), A.regen_assembly(demo.lock_doc()))
    return [
        ("coupler: tongue from a bad start", d, None),
        ("coupler: lever pinned at 125", pinned, None),
        ("coupler: ratio", ratio, None),
        ("coupler: bad law and measure", bad, None),
        ("coupler: drag the lever", solved, {"component": "c2", "point": [0, -20, -2], "target": [15, -12, 8]}),
    ]


def distance_conflict():
    """A pin 15 mm above the plate, then a mate that also puts it on the plate bottom: only the new mate fails."""
    d = T.asm_doc()
    d["mates"][1] = {"id": "m2", "type": "distance", "value": 15, "align": "aligned",
                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}},
                              {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}]}
    d["mates"].append({"id": "m3", "type": "coincident", "align": "aligned",
                       "refs": [{"component": "c1", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}},
                                {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [0, 1, 0]}}]})
    return d


def stack(conflict_value=20):
    """Four 10 mm blocks stacked on each other, plus a distance that says the top is 20 mm above the base's top."""
    block = {"name": "Block", "features": [T.rect_sketch("s1", "Top Plane", 40, 40), {"id": "e1", "type": "extrude", "name": "B", "sketch": "s1", "depth": 10}]}
    comps = [{"id": f"c{i}", "part": "block", "name": f"Block<{i}>", "position": [0, 10 * (i - 1), 0], "rotation": [0, 0, 0]} for i in range(1, 5)]
    comps[0]["fixed"] = True
    top = lambda c: {"component": c, "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}}
    bottom = lambda c: {"component": c, "plane": {"point": [0, 0, 0], "normal": [0, -1, 0]}}
    mates = [{"id": f"m{i}", "name": f"Coincident{i}", "type": "coincident", "align": "anti", "refs": [top(f"c{i}"), bottom(f"c{i + 1}")]}
             for i in range(1, 4)]
    mates.append({"id": "m9", "name": "Distance1", "type": "distance", "value": conflict_value, "align": "aligned",
                  "refs": [top("c1"), top("c4")]})
    comps[3]["position"] = [3, 30, -2]  # a little off, so the solve has work to do
    return {"type": "assembly", "parts": {"block": block}, "components": comps, "mates": mates}


def fixed_conflict():
    d = T.asm_doc()
    d["components"][1].update(fixed=True)
    return d


def edge_cases():
    """Data the browser and the server both meet: empty optional lists, null or bad numbers, suppressed
    components, limit_distance between a plane and a point, a lock between two datums."""
    empty = T.hinge_doc()
    empty["mates"][0]["planes"] = []
    empty_angle = T.hinge_doc()
    empty_angle["mates"][0].update(angle_refs=[], angle_min=0, angle_max=90)
    numbers = T.asm_doc()
    numbers["mates"][1] = {**numbers["mates"][1], "type": "distance", "value": None}  # null = the default, 0 mm
    numbers["mates"].append({"id": "m3", "type": "angle", "value": "steep", "refs": [
        {"component": "c1", "plane": {"point": [0, 0, 0], "normal": [1, 0, 0]}}, {"component": "c2", "plane": {"point": [0, 0, 0], "normal": [1, 0, 0]}}]})
    numbers["mates"].append({"id": "m4", "type": "limit_distance", "min": "", "max": 5, "refs": [
        {"component": "c1", "point": [0, 0, 0]}, {"component": "c2", "point": [0, 0, 0]}]})
    off = T.chain_doc()
    off["components"][2]["suppressed"] = True
    off["mates"].append({"id": "m3", "type": "coincident", "refs": [{"component": "c9", "ref": "Origin"}, {"component": "c2", "ref": "Origin"}]})
    lim = T.asm_doc()
    lim["components"][1].update(position=[50, 15, 0], rotation=[0, 0, 0])
    lim["mates"] = [{"id": "m1", "type": "limit_distance", "min": 0, "max": 10,
                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}}, {"component": "c2", "point": [0, 0, 0]}]},
                    {"id": "m2", "type": "limit_distance", "min": 0, "max": 10,
                     "refs": [{"component": "c1", "plane": {"point": [0, 10, 0], "normal": [0, 1, 0]}}, {"component": "c2", "ref": "Y axis"}]}]
    datums = T.asm_doc()
    datums["mates"].append({"id": "m3", "type": "lock", "refs": [{"ref": "Origin"}, {"ref": "Top Plane"}]})
    return [
        ("hinge with empty planes", empty, None),
        ("hinge with empty angle_refs", empty_angle, None),
        ("null and bad numbers", numbers, None),
        ("suppressed component and a missing one", off, None),
        ("limit_distance plane-point and plane-axis", lim, None),
        ("lock between two datums", datums, None),
    ]


def conflict_cases():
    return [
        ("conflicting distance leaves the other mates ok", distance_conflict(), None),
        ("stack with a conflicting distance", stack(), None),
        ("stack whose distance agrees", stack(30), None),
        ("mate between fixed components", fixed_conflict(), None),
    ]


def cases():
    p = press()
    by = {c["id"]: c for c in p["components"]}
    p_nomate = copy.deepcopy(p)
    next(m for m in p_nomate["mates"] if m["id"] == "m16")["suppressed"] = True
    hinge_solved = A.apply_solution(T.hinge_doc(), A.regen_assembly(T.hinge_doc()))
    chain = A.apply_solution(T.chain_doc(), A.regen_assembly(T.chain_doc()))
    out = [
        ("pin in hole, from a bad start", T.asm_doc(), None),
        ("distance + angle", lock_and_distance(), None),
        ("conflict and a bad mate", conflict(), None),
        ("lock (pose written back)", locked(), None),
        ("hinge", T.hinge_doc(), None),
        ("hinge drag", hinge_solved, {"component": "c2", "point": [0, 5, 60], "target": [0, 80, 0]}),
        ("hinge drag past its limit", limits(), {"component": "c2", "point": [0, 5, 60], "target": [0, 0, -200]}),
        ("slider drag to its limit", slider(), {"component": "c2", "point": [0, 0, 0], "target": [30, 300, 0]}),
        ("chain: drag the block", chain, {"component": "c2", "point": [-20, 5, 0], "target": [80, 15, 60]}),
        ("chain: drag the pin", chain, {"component": "c3", "point": [0, 20, 0], "target": [110, 20, 80]}),
        ("floated plate drag", floated(A.apply_solution(T.asm_doc(), A.regen_assembly(T.asm_doc()))),
         {"component": "c1", "point": [40, 5, 30], "target": [140, 5, 30]}),
        ("press", p, None),
        ("press floated", floated(p), None),
        ("press: spin the cylinder", p, {"component": "c7", "point": [40, 0, 0],
                                        "target": [45 * math.cos(0.3), 400, 45 * math.sin(0.3)]}),
        ("press: slide the platen", p_nomate, {"component": "c8", "point": [0, 0, 0], "target": list(np.array(by["c8"]["position"]) + [0, -60, 0])}),
        ("press floated: drag the base", floated(p), {"component": "c1", "point": [100, 10, 50], "target": [130, 10, 50]}),
    ] + lock_cases() + conflict_cases() + edge_cases()
    return out


def size_of(asm):
    built = {pid: A.build_part(part) for pid, part in asm["parts"].items()}
    return A._size(asm, built)


def strip(o):
    """JSON form of a Python solve result, like the JS harness prints."""
    return {"poses": {k: p.matrix() for k, p in o["poses"].items()}, "mates": o["mates"], "comp_state": o["comp_state"],
            "dof": o["dof"], "updates": o["updates"]}


def test_browser_solver_matches_python(tmp_path):
    cs = cases()
    payload, py = [], []
    for name, asm, drag in cs:
        size = size_of(asm)
        payload.append({"asm": asm, "size": size, "drag": drag})
        py.append(strip(A.solve(asm, size, None, drag)))  # no face following: parts did not change
    f = tmp_path / "cases.json"
    f.write_text(json.dumps(payload))
    run = subprocess.run(["node", str(ROOT / "tests/js/asm_parity.mjs"), str(f)], capture_output=True, text=True, timeout=300)
    assert run.returncode == 0, run.stderr
    js = json.loads(run.stdout)
    for (name, asm, drag), p, j in zip(cs, py, js):
        assert set(p["poses"]) == set(j["poses"]), name
        for cid in p["poses"]:
            a, b = np.array(p["poses"][cid]).reshape(4, 4), np.array(j["poses"][cid]).reshape(4, 4)
            assert np.allclose(a[:3, :3], b[:3, :3], atol=1e-4), (name, cid, a, b)
            assert np.allclose(a[:3, 3], b[:3, 3], atol=1e-3), (name, cid, a[:3, 3], b[:3, 3])
        assert {k: v["state"] for k, v in p["mates"].items()} == {k: v["state"] for k, v in j["mates"].items()}, name
        assert {k: v.get("message") for k, v in p["mates"].items()} == {k: v.get("message") for k, v in j["mates"].items()}, name
        assert {k: v.get("conflicts_with") for k, v in p["mates"].items()} == {k: v.get("conflicts_with") for k, v in j["mates"].items()}, name
        assert p["comp_state"] == j["comp_state"], name
        assert {k: int(v) for k, v in p["dof"].items()} == j["dof"], name
        assert json.loads(json.dumps(p["updates"])) == j["updates"], name


def test_browser_regen_matches_server_regen(tmp_path):
    """regenLocal (what the browser draws without asking the server) against regen_assembly, each side
    working out the assembly size itself from the parts the server sent."""
    cs = [c for c in cases() if not c[0].startswith("press")]
    payload, py = [], []
    for name, asm, drag in cs:
        res = A.regen_assembly(asm, drag=drag)
        parts = {pid: {k: v for k, v in info.items() if k != "body"} for pid, info in res["parts"].items()}
        payload.append({"asm": asm, "parts": parts, "drag": drag})
        py.append(res)
    f = tmp_path / "cases.json"
    f.write_text(json.dumps(payload))
    run = subprocess.run(["node", str(ROOT / "tests/js/asm_parity.mjs"), str(f)], capture_output=True, text=True, timeout=300)
    assert run.returncode == 0, run.stderr
    for (name, asm, drag), p, j in zip(cs, py, json.loads(run.stdout)):
        assert [c["id"] for c in p["components"]] == [c["id"] for c in j["components"]], name
        for a, b in zip(p["components"], j["components"]):
            assert np.allclose(a["matrix"], b["matrix"], atol=1e-3), (name, a["id"], a["matrix"], b["matrix"])
            assert (a["state"], a["dof"], a.get("message")) == (b["state"], b["dof"], b.get("message")), (name, a, b)
        strip_m = lambda ms: [{k: v for k, v in m.items() if k != "residual"} for m in ms]
        assert strip_m(p["mates"]) == strip_m(j["mates"]), name
        assert p["conflicts"] == j["conflicts"], name
        # the browser does no face following (that needs the rebuilt solids), so compare the rest
        moved = lambda u: {m: {k: v for k, v in x.items() if k not in A.REF_KEYS} for m, x in u.items()}
        assert {k: v for k, v in moved(json.loads(json.dumps(p["updates"]))).items() if v} == {k: v for k, v in moved(j["updates"]).items() if v}, name
        assert (p.get("bbox") is None) == (j.get("bbox") is None), name
        if p.get("bbox"):
            assert np.allclose(p["bbox"], j["bbox"], atol=1e-3), name
