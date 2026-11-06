"""sw_selftest (sw_selftest.py): the test data is right, and the whole run works against a simulated SOLIDWORKS.

1. Every stage's features build in OpenSketch's own kernel with no errors, every solid feature changes the volume,
   and the sketches meant to be fully defined are (the sketch solver says so).
2. The three stages run through the real MCP tool against a SimSW: a stand-in for the add-in that builds with
   OpenSketch's kernel, names features the way SOLIDWORKS does, answers "geometry" with a real STEP, solves
   mates with OpenSketch's solver and refuses what the real add-in refuses. Every step must pass, which also
   proves the predictions the selftest sends agree with an exact build of the same steps.
"""

import copy
import json
import re
import tempfile
from pathlib import Path

import anyio
import numpy as np
import pytest

from opensketch import assembly, geometry, inspection, sw_selftest, sw_tools, swbridge


def _plain(feats):
    """The test's features with "@id" turned back into OpenSketch ids."""
    return sw_selftest.resolve(copy.deepcopy(feats), {})


def _build(steps):
    feats = [f for _, fs in steps for f in _plain(fs)]
    doc = {"version": 1, "type": "part", "name": "t", "units": "mm", "rollback": None, "features": feats}
    st, _ = geometry.regen(doc)
    return doc, st


@pytest.mark.parametrize("steps", [sw_selftest.plate_steps(), sw_selftest.cup_steps(), sw_selftest.sweep_loft_steps(),
                                   sw_selftest.block_steps(60, 40, 10)])
def test_every_stage_builds_in_opensketch(steps):
    doc, st = _build(steps)
    bad = [(s["id"], s.get("message")) for s in st.status if s.get("state") == "error"]
    assert not bad
    for s in st.status:
        f = next(f for f in doc["features"] if f["id"] == s["id"])
        if f["type"] in ("sketch", "plane"):
            continue
        dv = (s.get("diagnostics") or {}).get("volume_change_mm3")
        assert dv is not None and abs(dv) > 1, (f["id"], f["type"], dv)
    assert st.part is not None and len(st.part.solids()) == 1


def test_every_stage_passes_the_checks_made_before_sending():
    for steps in (sw_selftest.plate_steps(), sw_selftest.cup_steps(), sw_selftest.sweep_loft_steps(),
                  sw_selftest.block_steps(30, 30, 20)):
        _, problems, _ = sw_tools._solve([f for _, fs in steps for f in _plain(fs)])
        assert not problems


def test_plate_sketches_meant_fully_defined_are():
    doc, _ = _build(sw_selftest.plate_steps())
    sks = [f for f in doc["features"] if f["type"] == "sketch"]
    solved, why = inspection.solve_sketches(sks)
    assert why is None
    for sid in sw_selftest.FULLY_DEFINED:
        assert solved[sid]["dof"] == 0 and solved[sid]["status"] not in ("over", "under"), (sid, solved[sid])


# ----------------------------------------------------------------------------- a simulated SOLIDWORKS

SW_NAMES = {"sketch": "Sketch", "plane": "Plane", "revolve": "Revolve", "mirror": "Mirror", "linear_pattern": "LPattern",
            "circular_pattern": "CirPattern", "hole": "Hole", "fillet": "Fillet", "chamfer": "Chamfer", "shell": "Shell",
            "draft": "Draft", "sweep": "Sweep", "loft": "Loft"}


class SimSW:
    """Answers the add-in's commands with OpenSketch's kernel."""

    def __init__(self):
        self.docs: dict[str, dict] = {}
        self.ops: list[str] = []
        self.stamp = 0

    async def run(self, op, args, timeout=0, blobs=None):
        self.ops.append(op)
        args = {k: v for k, v in args.items() if v is not None}
        try:
            res, files = await anyio.to_thread.run_sync(lambda: getattr(self, "op_" + op)(args))
        except SimRefusal as exc:
            return exc.result, {}, str(exc)
        return res, files, None

    # documents
    def op_create_document(self, a):
        ext = ".SLDASM" if a["kind"] == "assembly" else ".SLDPRT"
        path = f"C:\\Users\\me\\Documents\\OpenSketch\\{a.get('subfolder', '')}\\{a['name']}{ext}"
        self.docs[path] = {"kind": a["kind"], "title": a["name"] + ext, "features": [], "names": {}, "count": {},
                           "components": [], "mates": [], "params": {}, "stamp": 0}
        return {"doc": path, "title": a["name"] + ext, "kind": a["kind"]}, {}

    def _doc(self, a):
        if a.get("doc") not in self.docs:
            raise SimRefusal(f"No open document {a.get('doc')}")
        return self.docs[a["doc"]]

    def op_save(self, a):
        return {"doc": self._doc(a) and a["doc"], "saved": True}, {}

    # features
    def _regen(self, d):
        doc = {"version": 1, "type": "part", "name": d["title"], "units": "mm", "rollback": None,
               "features": copy.deepcopy(d["features"])}
        st, _ = geometry.regen(doc)
        return doc, st

    def _sw_name(self, d, f):
        t = f["type"]
        if t == "extrude":
            base = "Cut-Extrude" if f.get("op") == "cut" else "Boss-Extrude"
        else:
            base = SW_NAMES[t]
        d["count"][base] = d["count"].get(base, 0) + 1
        return f"{base}{d['count'][base]}"

    def op_add_features(self, a, d=None):
        d = d or self._doc(a)
        rows, stopped = [], None
        for f in a["features"]:
            f = copy.deepcopy(f)
            expect = f.pop("expect", None)
            f = _swap(f, d["names"])  # SOLIDWORKS names -> the ids the simulated tree uses
            if any(x["id"] == f["id"] for x in d["features"]):
                f["id"] = f["id"] + "_" + str(len(d["features"]))
            _, st0 = self._regen(d)
            v0 = st0.part.volume if st0.part is not None else 0.0
            d["features"].append(f)
            _, st = self._regen(d)
            s = next(x for x in st.status if x["id"] == f["id"])
            row = {"id": a_id(f), "type": f["type"]}
            if s.get("state") == "error":
                d["features"].pop()
                row.update(state="error", reason=s.get("message"))
                rows.append(row)
                stopped = f"{row['id']}: {row['reason']}"
                break
            name = self._sw_name(d, f)
            d["names"][name] = f["id"]
            row.update(name=name, state="ok")
            if f["type"] not in ("sketch", "plane"):
                v1 = st.part.volume if st.part is not None else 0.0
                row["volume_change_mm3"] = round(v1 - v0, 3)
                if expect and "dv" in expect:
                    row["predicted_volume_change_mm3"] = round(expect["dv"], 3)
                    if abs((v1 - v0) - expect["dv"]) > 0.05 + 2e-5 * v1 + 0.02 * abs(expect["dv"]):
                        row["state"] = "warning"
                        row["notes"] = [f"volume change {v1 - v0:.3f}, predicted {expect['dv']:.3f}"]
            rows.append(row)
            d["stamp"] += 1
        res = {"doc": a.get("doc"), "features": rows}
        if stopped:
            raise SimRefusal("Stopped at " + stopped, res)
        return res, {}

    def op_read(self, a):
        d = self._doc(a)
        doc, st = self._regen(d)
        names = {v: k for k, v in d["names"].items()}
        sks = [f for f in doc["features"] if f["type"] == "sketch"]
        solved, _ = inspection.solve_sketches(sks)
        sketches = {names[f["id"]]: {"state": "fully defined" if solved[f["id"]]["dof"] == 0 else "under defined"}
                    for f in sks}
        return {"features": [{"name": names.get(f["id"], f["id"]), "type": f["type"]} for f in doc["features"]],
                "sketches": sketches}, {}

    def op_set_parameter(self, a):
        self._doc(a)["params"][a["name"]] = a["expression"]
        return {"name": a["name"]}, {}

    def op_set_equation(self, a):
        d = self._doc(a)
        target = a["target"]
        feat, field = target.split(".")
        assert feat in d["names"], target
        assert d["params"].get(a["expression"]) == "10", "the equation must use the variable just made"
        return {"target": target}, {}

    def op_batch(self, a):
        d = self._doc(a)
        snap = copy.deepcopy(d)
        results = []
        for i, step in enumerate(a["steps"]):
            try:
                res, _ = getattr(self, "op_" + step["op"])(dict(step["args"], doc=a["doc"]))
            except SimRefusal as exc:
                self.docs[a["doc"]] = snap
                return {"ok": False, "completed": i, "failed": {"index": i, "op": step["op"], "error": str(exc)},
                        "rolled_back": True, "results": results}, {}
            results.append(res)
        return {"ok": True, "completed": len(results), "results": results}, {}

    def op_create_drawing(self, a):
        model = self._doc(a)
        if model["kind"] not in ("part", "assembly"):
            raise SimRefusal(f"{model['title']} is a {model['kind']}: a drawing is made of a part or an assembly.")
        stem = model["title"].rsplit(".", 1)[0]
        path = a["doc"].rsplit("\\", 1)[0] + "\\" + (a.get("name") or stem) + ".SLDDRW"
        self.docs[path] = {"kind": "drawing", "title": stem + ".SLDDRW", "features": [], "names": {}, "count": {},
                           "components": [], "mates": [], "params": {}, "stamp": 0}
        views = [{"name": f"Drawing View{i}", "orientation": o} for i, o in enumerate(("*Front", "*Top", "*Right", "*Isometric"), 1)]
        return {"doc": path, "title": stem + ".SLDDRW", "kind": "drawing", "model": a["doc"],
                "sheet": {"size": a.get("sheet", "A3"), "scale": "1:1", "projection": "third angle"},
                "views": views, "dimensions": 6, "properties": sorted(a.get("properties") or {})}, {}

    def op_export(self, a):
        d = self._doc(a)
        return {"file": "out.step", "title": d["title"]}, {"out.step": b"ISO-10303-21;"}

    def _step(self, d):
        _, st = self._regen(d)
        if st.part is None:
            raise SimRefusal(f"{d['title']} has no solid body yet.")
        with tempfile.TemporaryDirectory() as tmp:
            p = Path(tmp) / "b.step"
            from build123d import export_step
            export_step(st.part, str(p))
            return p.read_bytes()

    def op_geometry(self, a):
        d = self._doc(a)
        if d["kind"] == "part":
            return ({"kind": "part", "key": a["doc"], "title": d["title"],
                     "parts": {a["doc"]: {"file": "p.step", "stamp": d["stamp"], "title": d["title"]}}},
                    {"p.step": self._step(d)})
        parts, files, comps = {}, {}, []
        pose = self._solve(d)
        for i, c in enumerate(d["components"]):
            pd = self.docs[c["part"]]
            if c["part"] not in parts:
                fname = f"p{len(parts)}.step"
                files[fname] = self._step(pd)
                parts[c["part"]] = {"file": fname, "stamp": pd["stamp"], "title": pd["title"]}
            P = pose[c["id"]]
            comps.append({"name": c["id"], "key": c["part"], "matrix": list(np.asarray(P.R).flatten()) + list(P.t)})
        return {"kind": "assembly", "title": d["title"], "parts": parts, "components": comps}, files

    # assemblies
    def op_insert_component(self, a):
        d = self._doc(a)
        stem = Path(a["part"].replace("\\", "/")).stem
        n = sum(c["id"].startswith(stem + "-") for c in d["components"]) + 1
        fixed = a.get("fixed", not d["components"])
        d["components"].append({"id": f"{stem}-{n}", "part": a["part"], "position": a.get("position") or [0, 0, 0],
                                "rotation": a.get("rotation") or [0, 0, 0], "fixed": bool(fixed)})
        return {"component": f"{stem}-{n}", "fixed": bool(fixed), "placed_as_asked": True}, {}

    def _osasm(self, d):
        keys = {}
        for c in d["components"]:
            keys.setdefault(c["part"], "p" + str(len(keys) + 1))
        parts = {}
        for path, k in keys.items():
            pd = self.docs[path]
            parts[k] = {"version": 1, "type": "part", "name": pd["title"], "units": "mm", "rollback": None,
                        "features": copy.deepcopy(pd["features"])}
        comps = [dict(c, part=keys[c["part"]], name=c["id"]) for c in d["components"]]
        return {"version": 1, "type": "assembly", "name": d["title"], "units": "mm", "parts": parts,
                "components": comps, "mates": copy.deepcopy(d["mates"])}

    def _solve(self, d):
        return assembly.solve(self._osasm(d))["poses"]

    def op_add_mate(self, a):
        d = self._doc(a)
        mate = dict(a["mate"], id="m" + str(len(d["mates"]) + 1))
        d["mates"].append(mate)
        rep = assembly.solve(self._osasm(d))["mates"][mate["id"]]
        if rep.get("state") not in ("ok", "satisfied", None) and rep.get("residual", 0) > 1e-6:
            d["mates"].pop()
            raise SimRefusal(f"the mate does not hold: {rep}")
        # SOLIDWORKS moves the components when a mate is added
        poses = self._solve(d)
        for c in d["components"]:
            P = poses[c["id"]]
            c["position"], c["rotation"] = [float(v) for v in P.t], assembly.euler_of(P.R)
        return {"mate": f"Mate{len(d['mates'])}", "state": "ok"}, {}


class SimRefusal(Exception):
    def __init__(self, msg, result=None):
        super().__init__(msg)
        self.result = result or {}


def a_id(f):
    return re.sub(r"_\d+$", "", f["id"])


def _swap(obj, back):
    if isinstance(obj, str):
        return back.get(obj, obj)
    if isinstance(obj, list):
        return [_swap(v, back) for v in obj]
    if isinstance(obj, dict):
        return {k: (_swap(v, back) if k not in ("id", "type", "name") else v) for k, v in obj.items()}
    return obj


@pytest.fixture()
def sim(monkeypatch, tmp_path):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    s = SimSW()
    monkeypatch.setattr(sw_tools, "_run", s.run)
    monkeypatch.setattr(swbridge, "status", lambda who: {"connected": True, "machine": "SIM"})
    sw_tools._cache.clear()
    yield s
    sw_tools._cache.clear()


@pytest.mark.parametrize("stage", ["plate", "shapes", "assembly"])
def test_selftest_stage_passes_against_a_simulated_solidworks(sim, stage):
    res = anyio.run(sw_selftest.sw_selftest, stage)
    out = json.loads(res.content[0].text)
    bad = [r for r in out["steps"] if r["result"] != "ok"]
    assert not bad, json.dumps(bad, indent=1)[:4000]
    assert not res.is_error and out["failed"] == 0 and out["passed"] == len(out["steps"])
    assert out["files"]
    if stage == "plate":
        assert "batch" in sim.ops and "export" in sim.ops and "create_drawing" in sim.ops
        assert any(f.endswith(".SLDDRW") for f in out["files"])
        # every feature carried a prediction that matched the simulated build
        rows = [f for r in out["steps"] for f in r.get("features", [])]
        solid = [f for f in rows if f["type"] not in ("sketch", "plane")]
        assert solid and all("predicted_volume_change_mm3" in f for f in solid), solid


def test_selftest_reports_a_failing_feature(sim, monkeypatch):
    real = sim.op_add_features

    def broken(a, d=None):
        if any(f["type"] == "fillet" for f in a["features"]):
            raise SimRefusal("Stopped at f1: FeatureFillet3 returned nothing",
                             {"features": [{"id": "f1", "type": "fillet", "state": "error", "reason": "FeatureFillet3 returned nothing"}]})
        return real(a, d)
    monkeypatch.setattr(sim, "op_add_features", broken)
    res = anyio.run(sw_selftest.sw_selftest, "plate")
    out = json.loads(res.content[0].text)
    assert res.is_error and out["failed"] >= 1
    row = next(r for r in out["steps"] if r["what"].startswith("fillet"))
    assert row["result"] == "failed" and "FeatureFillet3" in row["error"]
    # the run carried on: the chamfer after it was still tried
    assert next(r for r in out["steps"] if r["what"].startswith("chamfer"))["result"] == "ok"
    assert "log.txt" in out["next"]


def test_selftest_not_connected(monkeypatch, tmp_path):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setattr(swbridge, "status", lambda who: {"connected": False})
    res = anyio.run(sw_selftest.sw_selftest, "plate")
    assert res.is_error and "how" in json.loads(res.content[0].text)
    # through the MCP server as a client sees it: the same error result, not a wrapped object
    from opensketch import mcp_server
    out = anyio.run(mcp_server.mcp.call_tool, "sw_selftest", {"stage": "shapes"})
    blocks = out.content if hasattr(out, "content") else out[0] if isinstance(out, tuple) else out
    text = blocks[0].text
    assert "how" in json.loads(text), text
