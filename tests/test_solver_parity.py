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
    ] + lock_cases()
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
        assert p["comp_state"] == j["comp_state"], name
        assert {k: int(v) for k, v in p["dof"].items()} == j["dof"], name
        assert json.loads(json.dumps(p["updates"])) == j["updates"], name
