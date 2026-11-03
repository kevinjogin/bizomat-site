"""sw_selftest: one call per stage that tries every kind of thing the SOLIDWORKS add-in does, in new scratch files,
and reports each one. It is the first thing to run on a new PC: nothing in the add-in had been tried in a real
SOLIDWORKS before it shipped, and the report (with the add-in's log) says exactly which API calls need fixing.

Stages (each a few minutes at most, so no MCP client gives up on the call):
- plate: one part with every part feature (sketches with relations and dimensions, boss and cut extrudes, a
  sketch on a face, mid plane with draft, reference plane, mirror, linear and circular pattern, revolve,
  counterbore hole, fillet, chamfer), then reading the tree, the body as STEP, a global variable and an equation,
  a batch that must roll back, a STEP export and saving.
- shapes: a cup (draft, shell) and a sweep and a loft.
- assembly: two blocks, an assembly, components, mates, interference, mate candidates, export.

The features are plain OpenSketch features. A string "@<id>" stands for the SOLIDWORKS name an earlier step gave
feature <id> (Boss-Extrude2, Plane1, ...), so the test does not depend on SOLIDWORKS' numbering or language.
tests/test_sw_selftest.py builds every stage with OpenSketch's own kernel to prove the test itself is right.
"""

from __future__ import annotations

import copy
import time
from typing import Annotated, Any, Literal

from mcp.types import CallToolResult
from pydantic import Field

from . import sw_tools as T
from .mcp_server import mcp


def _pt(i, x, y):
    return {"id": i, "type": "point", "x": x, "y": y}


def _rect(sid, plane, x0, y0, x1, y1, dims=True, origin_corner=False):
    """A rectangle sketch from (x0, y0) to (x1, y1); fully defined unless dims=False."""
    ents = [_pt("a", x0, y0), _pt("b", x1, y0), _pt("c", x1, y1), _pt("d", x0, y1),
            {"id": "l1", "type": "line", "p1": "a", "p2": "b"}, {"id": "l2", "type": "line", "p1": "b", "p2": "c"},
            {"id": "l3", "type": "line", "p1": "c", "p2": "d"}, {"id": "l4", "type": "line", "p1": "d", "p2": "a"}]
    cons = [{"id": "h1", "type": "horizontal", "refs": ["l1"]}, {"id": "h2", "type": "horizontal", "refs": ["l3"]},
            {"id": "v1", "type": "vertical", "refs": ["l2"]}, {"id": "v2", "type": "vertical", "refs": ["l4"]}]
    if dims:
        cons += [{"id": "W", "type": "distance", "refs": ["l1"], "value": abs(x1 - x0)},
                 {"id": "H", "type": "distance", "refs": ["l2"], "value": abs(y1 - y0)}]
        if origin_corner:
            cons.append({"id": "o", "type": "coincident", "refs": ["a", "origin"]})
        else:
            cons += [{"id": "X", "type": "distance", "refs": ["a", "origin"], "orient": "horizontal", "value": abs(x0)},
                     {"id": "Y", "type": "distance", "refs": ["a", "origin"], "orient": "vertical", "value": abs(y0)}]
    return {"id": sid, "type": "sketch", "plane": plane, "entities": ents, "constraints": cons}


def _circle(sid, plane, cx, cy, d):
    """A fully defined circle sketch."""
    at = ([{"id": "o", "type": "coincident", "refs": ["c", "origin"]}] if cx == 0 and cy == 0 else
          [{"id": "X", "type": "distance", "refs": ["c", "origin"], "orient": "horizontal", "value": abs(cx)},
           {"id": "Y", "type": "distance", "refs": ["c", "origin"], "orient": "vertical", "value": abs(cy)}])
    return {"id": sid, "type": "sketch", "plane": plane,
            "entities": [_pt("c", cx, cy), {"id": "k", "type": "circle", "center": "c", "r": d / 2}],
            "constraints": [{"id": "D", "type": "diameter", "refs": ["k"], "value": d}] + at}


FRONT = {"ref": "Front Plane"}
TOP = {"ref": "Top Plane"}
RIGHT = {"ref": "Right Plane"}
TOP_FACE = {"type": "face", "origin": [0, 0, 10], "normal": [0, 0, 1], "xdir": [1, 0, 0]}  # the plate's top face


def plate_steps() -> list[tuple[str, list[dict]]]:
    """A 60 x 40 x 10 plate with every part feature on it, one step per kind."""
    return [
        ("sketch on Front (fully defined rectangle) and boss extrude",
         [_rect("s1", FRONT, 0, 0, 60, 40, origin_corner=True), {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 10}]),
        ("through-all cut (circle)",
         [_circle("s2", FRONT, 12, 20, 8), {"id": "e2", "type": "extrude", "sketch": "s2", "op": "cut", "end": "through_all"}]),
        ("sketch on a face and boss on it",
         [_circle("s3", TOP_FACE, 15, 30, 10), {"id": "e3", "type": "extrude", "sketch": "s3", "depth": 5}]),
        ("blind cut into the face (reverse)",
         [_rect("s4", TOP_FACE, 40, 5, 55, 15), {"id": "e4", "type": "extrude", "sketch": "s4", "op": "cut", "depth": 4,
                                                  "reverse": True}]),
        ("mid-plane boss with draft on an offset plane",
         [_rect("s5", {"type": "fixed", "origin": [0, 40, 0], "normal": [0, 1, 0], "xdir": [1, 0, 0]}, 25, -8, 35, -2),
          {"id": "e5", "type": "extrude", "sketch": "s5", "end": "midplane", "depth": 6, "draft": 2}]),
        ("reference plane offset from Right", [{"id": "pl", "type": "plane", "base": RIGHT, "offset": 30}]),
        ("mirror a feature about that plane", [{"id": "mi", "type": "mirror", "plane": {"ref": "@pl"}, "features": ["@e3"]}]),
        ("linear pattern of the hole along X",
         [{"id": "lp", "type": "linear_pattern", "features": ["@e2"], "direction": "X", "count": 3, "spacing": 12}]),
        ("circular pattern of the hole about Z",
         [{"id": "cp", "type": "circular_pattern", "features": ["@e2"], "axis": "Z", "count": 2, "angle": 25,
           "equal_spacing": False, "step": 25}]),
        ("revolve (half ring about a centerline)",
         [{"id": "s6", "type": "sketch", "plane": FRONT,
           "entities": [_pt("a", 66, 2), _pt("b", 70, 2), _pt("c", 70, 8), _pt("d", 66, 8), _pt("q", 60, 0), _pt("r", 60, 10),
                        {"id": "l1", "type": "line", "p1": "a", "p2": "b"}, {"id": "l2", "type": "line", "p1": "b", "p2": "c"},
                        {"id": "l3", "type": "line", "p1": "c", "p2": "d"}, {"id": "l4", "type": "line", "p1": "d", "p2": "a"},
                        {"id": "ax", "type": "line", "p1": "q", "p2": "r", "construction": True}],
           "constraints": [{"id": "h1", "type": "horizontal", "refs": ["l1"]}, {"id": "h2", "type": "horizontal", "refs": ["l3"]},
                           {"id": "v1", "type": "vertical", "refs": ["l2"]}, {"id": "v2", "type": "vertical", "refs": ["l4"]},
                           {"id": "va", "type": "vertical", "refs": ["ax"]}]},
          {"id": "r1", "type": "revolve", "sketch": "s6", "axis": "ax", "angle": 180}]),
        ("counterbore hole",
         [{"id": "h1", "type": "hole", "plane": TOP_FACE, "x": 54, "y": 34, "diameter": 4.5, "end": "through_all",
           "reverse": True, "style": "counterbore", "bore_diameter": 8, "bore_depth": 3}]),
        ("fillet a vertical edge", [{"id": "f1", "type": "fillet", "radius": 3, "edges": [{"mid": [0, 40, 5]}]}]),
        ("chamfer a bottom edge", [{"id": "c1", "type": "chamfer", "distance": 1, "edges": [{"mid": [30, 0, 0]}]}]),
    ]


FULLY_DEFINED = ("s1", "s2", "s3", "s4", "s5")  # the plate's sketches that must come out black in SOLIDWORKS


def cup_steps() -> list[tuple[str, list[dict]]]:
    """A 30 x 30 x 20 block, drafted on four sides and shelled open at the top."""
    return [
        ("boss for the cup", [_rect("s1", FRONT, 0, 0, 30, 30, origin_corner=True),
                              {"id": "e1", "type": "extrude", "sketch": "s1", "depth": 20}]),
        ("draft four side faces (neutral plane Front)",
         [{"id": "d1", "type": "draft", "neutral_plane": FRONT, "angle": 3,
           "faces": [{"center": [0, 15, 10], "normal": [-1, 0, 0]}, {"center": [30, 15, 10], "normal": [1, 0, 0]},
                     {"center": [15, 0, 10], "normal": [0, -1, 0]}, {"center": [15, 30, 10], "normal": [0, 1, 0]}]}]),
        ("shell, top face open", [{"id": "sh", "type": "shell", "thickness": 1.5,
                                   "faces": [{"center": [15, 15, 20], "normal": [0, 0, 1]}]}]),
    ]


def sweep_loft_steps() -> list[tuple[str, list[dict]]]:
    return [
        ("sweep a circle along a line", [
            _circle("p", FRONT, 0, 0, 6),
            {"id": "path", "type": "sketch", "plane": TOP,
             "entities": [_pt("a", 0, 0), _pt("b", 0, -40), {"id": "l", "type": "line", "p1": "a", "p2": "b"}],
             "constraints": [{"id": "o", "type": "coincident", "refs": ["a", "origin"]}, {"id": "v", "type": "vertical", "refs": ["l"]},
                             {"id": "L", "type": "distance", "refs": ["l"], "value": 40}]},
            {"id": "sw", "type": "sweep", "sketch": "p", "path": "path"}]),
        ("loft between two squares on parallel planes (around the sweep)", [
            _rect("q1", FRONT, -10, -10, 10, 10, dims=False),
            {"id": "pq", "type": "plane", "base": FRONT, "offset": 25},
            _rect("q2", {"ref": "pq"}, -5, -5, 5, 5, dims=False),
            {"id": "lo", "type": "loft", "profiles": ["q1", "q2"]}]),
    ]


def block_steps(w: float, d: float, h: float) -> list[tuple[str, list[dict]]]:
    return [(f"block {w:g} x {d:g} x {h:g}", [_rect("s1", FRONT, 0, 0, w, d, origin_corner=True),
                                             {"id": "e1", "type": "extrude", "sketch": "s1", "depth": h}])]


def mates(a: str, b: str) -> list[tuple[str, dict]]:
    """Mates between block A (60 x 40 x 10) and block B (30 x 30 x 20) by component name."""
    return [
        ("coincident faces (B's bottom on A's top)", {"type": "coincident", "align": "anti", "refs": [
            {"component": a, "plane": {"point": [30, 20, 10], "normal": [0, 0, 1]}},
            {"component": b, "plane": {"point": [15, 15, 0], "normal": [0, 0, -1]}}]}),
        ("distance between the Right planes", {"type": "distance", "value": 20, "refs": [
            {"component": a, "ref": "Right Plane"}, {"component": b, "ref": "Right Plane"}]}),
        ("parallel Top planes", {"type": "parallel", "refs": [{"component": a, "ref": "Top Plane"},
                                                             {"component": b, "ref": "Top Plane"}]}),
    ]


def resolve(obj: Any, names: dict[str, str]) -> Any:
    """Replace "@<id>" strings by the SOLIDWORKS name an earlier step gave that id."""
    if isinstance(obj, str) and obj.startswith("@"):
        return names.get(obj[1:], obj[1:])
    if isinstance(obj, list):
        return [resolve(v, names) for v in obj]
    if isinstance(obj, dict):
        return {k: resolve(v, names) for k, v in obj.items()}
    return obj


# ----------------------------------------------------------------------------- running it

class _Report:
    def __init__(self, stage: str):
        self.stage = stage
        self.rows: list[dict] = []
        self.t0 = time.monotonic()

    def add(self, what: str, result: str, **info) -> dict:
        row = {"step": len(self.rows) + 1, "what": what, "result": result}
        row.update({k: v for k, v in info.items() if v not in (None, [], {})})
        self.rows.append(row)
        return row

    def out(self, files: list[str]) -> dict:
        bad = [r for r in self.rows if r["result"] == "failed"]
        check = [r for r in self.rows if r["result"] == "check"]
        return {"stage": self.stage, "passed": sum(r["result"] == "ok" for r in self.rows), "check": len(check),
                "failed": len(bad), "seconds": round(time.monotonic() - self.t0, 1), "steps": self.rows,
                "files": files,
                "next": ("All steps passed." if not bad and not check else
                         "Send the OpenSketch developers this report and the add-in log (%LOCALAPPDATA%\\OpenSketch\\SolidWorks\\log.txt, "
                         "or Copy log in the OpenSketch window): each failed or check step names the SOLIDWORKS call to fix."),
                "note": "The test files stay open in SOLIDWORKS and are saved in Documents\\OpenSketch\\selftest; close or delete them when done."}


def _feature_rows(rows: list[dict]) -> list[dict]:
    keep = ("id", "type", "name", "state", "reason", "notes", "volume_change_mm3", "predicted_volume_change_mm3", "tried")
    return [{k: r[k] for k in keep if r.get(k) not in (None, [], "")} for r in rows or []]


def _history_expect(history: list[dict], plain: list[dict]) -> dict:
    """Predictions from the whole test history built in OpenSketch (exact, and possible for mirrors and patterns of
    earlier features, which a prediction on SOLIDWORKS' STEP body cannot make)."""
    from . import geometry
    doc = {"version": 1, "type": "part", "name": "selftest", "units": "mm", "rollback": None,
           "features": copy.deepcopy(history + plain)}
    try:
        st, _ = geometry.regen(doc)
    except Exception:
        return {}
    return T.expectations(st, {f["id"] for f in history})


async def _features(rep: _Report, what: str, doc: str, feats: list[dict], names: dict[str, str],
                    history: list[dict]) -> bool:
    plain = resolve(copy.deepcopy(feats), {})
    feats = resolve(copy.deepcopy(feats), names)
    try:
        solved, problems, _ = await T._thread(T._solve, feats)
    except Exception as exc:  # a bug in the test data, not in SOLIDWORKS
        rep.add(what, "failed", error=f"the test's features could not be read: {exc}")
        return False
    if problems:
        rep.add(what, "failed", error="the test's features were refused here: " + "; ".join(problems))
        return False
    expect, why = await T._predict(doc, None, solved)
    try:
        hist = await T._cad(_history_expect, history, plain)
    except Exception:
        hist = {}
    for f in solved:
        e = expect.get(f.get("id")) or {}
        if "dv" not in e and "dv" in (hist.get(f.get("id")) or {}):
            e = hist[f["id"]]
        if e:
            f["expect"] = e
    res, _, err = await T._run("add_features", {"doc": doc, "features": solved, "summary": "selftest: " + what}, timeout=300)
    rows = (res or {}).get("features") or []
    made = set()
    for r in rows:
        if r.get("id") and r.get("name"):
            names[r["id"]] = r["name"]
        if r.get("state") != "error":
            made.add(r.get("id"))
    history += [f for f in plain if f["id"] in made]
    states = {r.get("state") for r in rows}
    result = "failed" if err or "error" in states else "check" if "warning" in states else "ok"
    rep.add(what, result, error=err, features=_feature_rows(rows), prediction=why)
    return result != "failed"


async def _op(rep: _Report, what: str, op: str, args: dict, timeout: float = 180, check=None) -> dict | None:
    """One add-in command; check(result) returns a problem or None."""
    res, files, err = await T._run(op, args, timeout)
    if err:
        rep.add(what, "failed", error=err, detail=_short(res))
        return None
    problem = check(res, files) if check else None
    rep.add(what, "check" if problem else "ok", problem=problem, detail=_short(res))
    return res


def _short(res: Any, limit: int = 1200) -> Any:
    """Enough of a result to diagnose, without bodies of data."""
    import json
    if not isinstance(res, dict):
        return res
    slim = {k: v for k, v in res.items() if k not in ("features", "sketches", "dimensions", "steps")}
    text = json.dumps(slim, default=str)
    return slim if len(text) <= limit else text[:limit] + "..."


async def _new(rep: _Report, kind: str, name: str, files: list[str]) -> str | None:
    res = await _op(rep, f"new {kind} '{name}'", "create_document",
                    {"name": name, "kind": kind, "subfolder": "selftest", "units": "mm"},
                    check=lambda r, f: None if r.get("doc") else "no path came back")
    if res and res.get("doc"):
        files.append(res["doc"])
        return res["doc"]
    return None


async def _geometry_check(rep: _Report, doc: str, what: str, faces_min: int) -> None:
    try:
        g = await T._geometry(doc)
        if g["kind"] != "part":
            rep.add(what, "failed", error=f"expected a part, got {g['kind']}")
            return
        topo = await T._cad(T._topology_sync, g["doc"], "faces", None, 5)
    except Exception as exc:
        rep.add(what, "failed", error=str(exc))
        return
    n = topo.get("faces_total", 0)
    rep.add(what, "ok" if n >= faces_min else "check", faces=n,
            problem=None if n >= faces_min else f"only {n} faces in the STEP SOLIDWORKS sent (expected {faces_min} or more)")


async def stage_plate(rep: _Report) -> list[str]:
    files: list[str] = []
    doc = await _new(rep, "part", "selftest plate", files)
    if not doc:
        return files
    names: dict[str, str] = {}
    history: list[dict] = []
    for what, feats in plate_steps():
        await _features(rep, what, doc, feats, names, history)

    def read_ok(r, f):
        if not r.get("features"):
            return "no features read back"
        if r.get("problems"):
            return "rebuild problems: " + "; ".join(f"{p.get('feature')}: {p.get('reason')}" for p in r["problems"])
        states = r.get("sketches") or {}
        loose = [f"{names[s]} is {(states.get(names[s]) or {}).get('state', 'not read')}"
                 for s in FULLY_DEFINED if s in names and (states.get(names[s]) or {}).get("state") != "fully defined"]
        return "sketches meant to be fully defined: " + ", ".join(loose) if loose else None
    await _op(rep, "read the tree back (sketch states, errors)", "read", {"doc": doc, "sketches": True}, check=read_ok)
    await _geometry_check(rep, doc, "body to STEP and read here (topology)", 20)
    await _op(rep, "global variable", "set_parameter", {"doc": doc, "name": "selftest_t", "expression": "10"})
    base = names.get("e1")
    if base:
        await _op(rep, "equation on the plate depth", "set_equation",
                  {"doc": doc, "target": f"{base}.depth", "expression": "selftest_t"})
    # a batch whose second step must fail: everything it made has to go again
    before = await T._run("read", {"doc": doc}, 120)
    n0 = len(((before[0] or {}).get("features") or [])) if not before[2] else None
    bad = {"op": "add_features", "args": {"doc": doc, "features": [
        {"id": "bx", "type": "fillet", "radius": 1, "edges": [{"mid": [500, 500, 500]}]}]}}
    good_feats, _, _ = T._solve([_circle("bs", TOP_FACE, 30, 25, 3),
                                 {"id": "bc", "type": "extrude", "sketch": "bs", "op": "cut", "depth": 2, "reverse": True}])
    res, _, err = await T._run("batch", {"doc": doc, "steps": [{"op": "add_features", "args": {"doc": doc, "features": good_feats}}, bad],
                                         "summary": "selftest: rollback"}, 300)
    after = await T._run("read", {"doc": doc}, 120)
    n1 = len(((after[0] or {}).get("features") or [])) if not after[2] else None
    res = res or {}
    if res.get("ok") is False and res.get("rolled_back") and n0 is not None and n0 == n1:
        rep.add("batch with a failing step rolls back", "ok", failed_step=(res.get("failed") or {}).get("error"))
    else:
        rep.add("batch with a failing step rolls back", "failed",
                problem=f"ok={res.get('ok')} rolled_back={res.get('rolled_back')} features before={n0} after={n1}",
                error=err if res.get("ok") is not False else None)
    await _op(rep, "export STEP", "export", {"doc": doc, "format": "step"},
              check=lambda r, f: None if f.get(r.get("file") or "") else "no file came back")
    await _op(rep, "save", "save", {"doc": doc})
    # a drawing of the saved plate: standard views, scale, model dimensions, title block, then a PDF of it
    drw = await _op(rep, "drawing of the plate (A3, third angle, model dimensions, title block)", "create_drawing",
                    {"doc": doc, "sheet": "A3", "projection": "third", "dimensions": True,
                     "properties": {"Title": "OpenSketch self test plate", "DrawingNo": "SELFTEST-1", "Revision": "A"}},
                    timeout=300, check=lambda r, f: _drawing_problem(r))
    if drw and drw.get("doc"):
        files.append(drw["doc"])
        await _op(rep, "export the drawing as PDF", "export", {"doc": drw["doc"], "format": "pdf"},
                  check=lambda r, f: None if f.get(r.get("file") or "") else "no file came back")
    return files


def _drawing_problem(res: dict) -> str | None:
    """What is missing from a new drawing, or None: a saved file, four views (three standard and the isometric),
    and model dimensions in them."""
    if not res.get("doc"):
        return "no drawing path came back"
    views = res.get("views") or []
    if len(views) < 4:
        return f"{len(views)} views on the sheet, expected 4 (front, top, right, isometric)"
    if not res.get("dimensions"):
        return "no model dimensions in the views"
    return None


async def stage_shapes(rep: _Report) -> list[str]:
    files: list[str] = []
    for name, steps in (("selftest cup", cup_steps()), ("selftest sweep loft", sweep_loft_steps())):
        doc = await _new(rep, "part", name, files)
        if not doc:
            continue
        names: dict[str, str] = {}
        history: list[dict] = []
        for what, feats in steps:
            await _features(rep, what, doc, feats, names, history)
        await _op(rep, f"save {name}", "save", {"doc": doc})
    return files


async def stage_assembly(rep: _Report) -> list[str]:
    files: list[str] = []
    parts = []
    for name, steps in (("selftest block A", block_steps(60, 40, 10)), ("selftest block B", block_steps(30, 30, 20))):
        doc = await _new(rep, "part", name, files)
        if not doc:
            return files
        names: dict[str, str] = {}
        history: list[dict] = []
        for what, feats in steps:
            await _features(rep, what, doc, feats, names, history)
        await _op(rep, f"save {name}", "save", {"doc": doc})
        parts.append(doc)
    asm = await _new(rep, "assembly", "selftest assembly", files)
    if not asm:
        return files
    ca = await _op(rep, "insert block A (fixed, at the origin)", "insert_component",
                   {"doc": asm, "part": parts[0], "position": [0, 0, 0], "rotation": [0, 0, 0], "fixed": True},
                   check=lambda r, f: None if r.get("fixed") else "the first component is not fixed")
    cb = await _op(rep, "insert block B (free, moved and turned)", "insert_component",
                   {"doc": asm, "part": parts[1], "position": [80, 10, 30], "rotation": [0, 0, 30], "fixed": False},
                   check=lambda r, f: None if r.get("placed_as_asked") is True else f"placed at {r.get('placed_as_asked')}")
    if not ca or not cb:
        return files
    for what, mate in mates(ca["component"], cb["component"]):
        await _op(rep, "mate: " + what, "add_mate", {"doc": asm, "mate": mate},
                  check=lambda r, f: None if r.get("state") == "ok" else f"state {r.get('state')}: {r.get('reason')}")
    from . import assembly
    try:
        g = await T._geometry(asm)
        poses = {c["name"]: c["position"] for c in g["doc"]["components"]}
        b = poses.get(cb["component"])
        res = await T._cad(assembly.interference, g["doc"])
        clash = [i for i in res["interferences"] if i["volume"] > 1e-3]
        # B's origin: x 20 from A's Right plane, on A's top (z 10), y free; with the parallel Top planes not turned
        where_ok = b is not None and abs(b[0] - 20) < 1e-3 and abs(b[2] - 10) < 1e-3
        rep.add("assembly to STEP, B where the mates put it, no interference",
                "ok" if where_ok and not clash else "check", block_b_origin=b,
                interferences=[{"components": i["names"], "volume_mm3": round(i["volume"], 3)} for i in clash],
                problem=None if where_ok else "block B is not at x 20, z 10 (a mate went another way, or the placement "
                "matrix is read wrongly)")
    except Exception as exc:
        rep.add("assembly to STEP and interference", "failed", error=str(exc))
    await _op(rep, "export the assembly as STEP", "export", {"doc": asm, "format": "step"},
              check=lambda r, f: None if f.get(r.get("file") or "") else "no file came back")
    await _op(rep, "save the assembly", "save", {"doc": asm})
    return files


STAGES = {"plate": stage_plate, "shapes": stage_shapes, "assembly": stage_assembly}


@mcp.tool()
async def sw_selftest(stage: Annotated[Literal["plate", "shapes", "assembly"], Field(description=(
        "plate: every part feature on one part, reading back, variables, a batch rollback, export, save. "
        "shapes: draft, shell, sweep, loft. assembly: components, mates, interference, export."))] = "plate"
                      ) -> CallToolResult:
    """Check the SOLIDWORKS add-in on this PC: make new test files in Documents\\OpenSketch\\selftest and try every
    kind of thing the add-in does, one step at a time, each checked against what OpenSketch's own kernel makes of
    it. Run the three stages in turn (plate, shapes, assembly) when the user asks to test the add-in or after
    installing it. Reports each step as ok, check (made, but not as predicted) or failed, with SOLIDWORKS' reason."""
    st = T.swbridge.status(T._who())
    if not st.get("connected"):
        return T._text(dict(st, how=T.swbridge.NOT_CONNECTED), True)
    rep = _Report(stage)
    files = await STAGES[stage](rep)
    out = rep.out(files)
    return T._text(out, out["failed"] > 0)
