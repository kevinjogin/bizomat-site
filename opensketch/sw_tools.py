"""Claude builds in SOLIDWORKS: the sw_ MCP tools.

The model is a real SOLIDWORKS part or assembly on the user's PC, reached through the add-in (solidworks/ in this
repo, linked by swbridge.py). SOLIDWORKS is the master copy: the user can edit the same file by hand between calls,
and sw_get_document reads it as it is now.

- Writing: features in OpenSketch's document format (sketches with relations and dimensions, extrudes, revolves,
  fillets, patterns... see sw_get_guide) are made as native SOLIDWORKS features, fully defined sketches where the
  sketch says so. Before anything is sent, the features are checked by the registry and each sketch is solved
  by OpenSketch's sketch solver (solver/solver.js, run with node), so SOLIDWORKS gets exact coordinates.
- Reading: the feature tree, errors, sketches and mates come from SOLIDWORKS itself. Topology, measuring,
  previews, interference and mate candidates run here on the STEP of the current body (cached by SOLIDWORKS'
  update stamp), with OpenSketch's own tested code.
- All OpenCascade work (reading SOLIDWORKS' STEP, predictions, topology, measuring, previews, interference) runs in
  the person's "agent" CAD worker (cadworker.lane_for): in the web server it would
  hold the GIL and pause every request on the server. Node (the sketch solver) and big file writes run in threads.
"""

from __future__ import annotations

import base64
import binascii
import copy
import json
import re
from collections import OrderedDict
from typing import Annotated, Any, Literal

import numpy as np
from mcp.types import CallToolResult, ImageContent, TextContent, ToolAnnotations
from pydantic import Field

from . import artifacts, assembly, cadworker, features, importer, inspection, measure, store, swbridge, uploads
from .mcp_server import MAX_IMPORT_BYTES, StdKind, _check_filename, _who, mcp


async def _cad(fn, *args, limit: float | None = None):
    """fn(*args) in the calling person's agent CAD worker. Exceptions come back as their own types (ValueError,
    ImportError_, MeasureError...); CadUnavailable when the worker ran out of time, was busy or stopped."""
    lane = cadworker.lane_for(store.owner_of(_who()), "agent")
    return await lane.run(fn, *args, limit=limit, raw=True)


async def _thread(fn, *args):
    import anyio
    return await anyio.to_thread.run_sync(fn, *args)


# Errors a geometry tool reports as a plain error result (anything else is a bug and is raised).
GEOM_ERRORS = (ValueError, importer.ImportError_, cadworker.CadUnavailable, cadworker.CadJobError)

SW_GUIDE = """You are building in SOLIDWORKS 2022 on the user's PC through the OpenSketch add-in. Everything you
make is a native SOLIDWORKS feature in the user's own file, and the user may change the file by hand between
your calls, so read before you write (sw_get_document).

Workflow:
- sw_status first: is SOLIDWORKS connected, which documents are open. If not connected, tell the user what the
  status says and stop.
- sw_create_document makes a new part or assembly from the user's default template and saves it in
  Documents\\OpenSketch (or `folder`). Every other tool takes `doc`: its path or window title from sw_status;
  leave it out for the active document.
- sw_add_features writes features in OpenSketch's document format (below): sketches with entities, relations and
  dimensions, then extrudes, revolves, sweeps, lofts, holes, fillets, chamfers, shells, drafts, mirrors,
  patterns and planes. Feature ids are yours for that call; to point at features already in the file, use their
  SOLIDWORKS names ("Sketch3", "Boss-Extrude1", "Plane1"). Every sketch is checked and solved here first; give
  relations and dimensions so it ends fully defined (black in SOLIDWORKS), as a designer would.
- Each feature comes back with its SOLIDWORKS name, state (ok, warning, error with SOLIDWORKS' reason), the
  volume change and the body's bounding box. Predict them before you build; a difference means a wrong plane,
  direction or depth.
- sw_batch runs several steps as one change: if a step fails, everything the batch made is removed again.
- Pick faces and edges with sw_body_topology (pass each item's `ref`), check with sw_measure_items and
  sw_inspect_design, look with sw_preview (a section shows walls and bores).
- Assemblies: make each part (sw_create_document + sw_add_features), sw_insert_component them, then sw_add_mate
  with references in each component's PART coordinates ({"component": "<SOLIDWORKS component name, e.g.
  Bracket-1>", "plane": {...} | "axis": {...} | "ref": "Front Plane"}). sw_find_mate_candidates suggests mates.
  sw_check_interference at the end.
- Global variables and equations are SOLIDWORKS' own (Tools > Equations): sw_set_parameter, sw_set_equation.
- Standard fasteners and bearings: sw_standard_part (ISO sizes) saves them as parts you can insert.
- Drawings: sw_create_drawing makes a native .SLDDRW of a saved part or assembly (sheet A4 to A0, third or first
  angle projection, the standard views plus an isometric or the views you name, a sheet scale that fits, the
  model's dimensions, title block fields as custom properties). Dimensions come from the model's sketches and
  features, so build fully defined sketches with sensible dimensions first. Look at the result with sw_preview
  (doc = the drawing, screenshot=true) and export it with sw_export (pdf, dwg or dxf).
- sw_selftest (stages plate, shapes, assembly) checks the add-in on a new PC in scratch files; run it when the
  user asks to test the add-in, and pass on its report.
- sw_undo takes back the last change; sw_save saves (new documents are saved when made, later changes are not
  saved until you call sw_save or the user saves).

How the format maps to SOLIDWORKS:
- Feature names are SOLIDWORKS' (Sketch1, Boss-Extrude1, Cut-Extrude1, Fillet1...). `name` on a feature
  renames it in the tree.
- Sketch relations become SOLIDWORKS relations, dimensions become driving dimensions named as you name them
  (D1, D2... by default); `eq` on a dimension or feature field becomes a SOLIDWORKS equation.
- Planes: Front / Top / Right are SOLIDWORKS' own. A "face" plane sketches on that face. A "fixed" plane must be
  parallel to Front, Top or Right (it becomes an offset reference plane); otherwise make a `plane` feature.
- `hole` features are made as cut extrudes (one for a plain hole, two for a counterbore, a tapered cut for a
  countersink), named Hole1, Hole2...

The feature format follows.

"""

MATE_TYPES = Literal["coincident", "concentric", "parallel", "perpendicular", "distance", "angle", "lock",
                     "hinge", "limit_distance", "limit_angle"]
_DOC = Annotated[str | None, Field(description="Path or window title from sw_status; omit for the active document")]
_COMP = Annotated[str | None, Field(description="Assemblies: a component name (e.g. Bracket-1) to work on its part")]


def _text(obj: Any, error: bool = False) -> CallToolResult:
    return CallToolResult(content=[TextContent(type="text", text=json.dumps(obj))], is_error=error)


async def _run(op: str, args: dict, timeout: float = swbridge.DEFAULT_TIMEOUT, blobs: dict | None = None
               ) -> tuple[dict | None, dict, str | None]:
    """(result, files, error) for one SOLIDWORKS command."""
    try:
        body, files = await swbridge.call(_who(), op, {k: v for k, v in args.items() if v is not None}, timeout, blobs)
    except swbridge.BridgeError as exc:
        return None, {}, str(exc)
    if not body.get("ok"):
        out = body.get("result") if isinstance(body.get("result"), dict) else {}
        return out, files, body.get("error") or "SOLIDWORKS could not do it."
    return body.get("result") or {}, files, None


async def _simple(op: str, args: dict, timeout: float = swbridge.DEFAULT_TIMEOUT) -> CallToolResult:
    res, _, err = await _run(op, args, timeout)
    if err:
        return _text(dict(res or {}, error=err), True)
    return _text(res)


# ----------------------------------------------------------------------------- connection and documents

@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_status() -> CallToolResult:
    """Is SOLIDWORKS connected through the OpenSketch add-in, which version, and which documents are open
    (path, title, part or assembly, active, unsaved changes). Call it first."""
    st = swbridge.status(_who())
    if not st.get("connected"):
        return _text(dict(st, how=swbridge.NOT_CONNECTED))
    res, _, err = await _run("status", {}, timeout=30)
    if err:
        return _text(dict(st, error=err), True)
    out = dict(st, **(res or {}))
    old = swbridge.addin_too_old(_who(), DRAWINGS_FROM, "Making drawings")
    if old:
        out["update_needed"] = old
    return _text(out)


@mcp.tool()
def sw_get_guide() -> str:
    """How to build in SOLIDWORKS with these tools, and the feature format (sketches, features, mate references).
    Read it once before your first change."""
    from .docformat import GUIDE
    return SW_GUIDE + GUIDE


@mcp.tool()
async def sw_create_document(name: str, kind: Literal["part", "assembly"] = "part",
                             folder: Annotated[str | None, Field(description="Windows folder; default Documents\\OpenSketch")] = None,
                             units: Literal["mm", "inch"] = "mm") -> CallToolResult:
    """A new SOLIDWORKS part or assembly from the user's default template, saved as <name>.SLDPRT / .SLDASM
    (a free name is chosen if the file exists). Units MMGS by default. Returns its path: pass it as `doc`."""
    return await _simple("create_document", {"name": name, "kind": kind, "folder": folder, "units": units})


@mcp.tool()
async def sw_open_document(path: Annotated[str, Field(description="Full Windows path of a .SLDPRT or .SLDASM")]) -> CallToolResult:
    """Open a SOLIDWORKS file (or bring it to the front if it is open)."""
    return await _simple("open_document", {"path": path}, timeout=180)


@mcp.tool()
async def sw_save(doc: _DOC = None, path: Annotated[str | None, Field(description="Save As this path instead")] = None) -> CallToolResult:
    """Save the document (Save As with path)."""
    return await _simple("save", {"doc": doc, "path": path}, timeout=180)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_get_document(doc: _DOC = None, sketches: Annotated[bool, Field(description="Include every sketch's entities, relations and dimensions")] = False,
                          component: _COMP = None) -> CallToolResult:
    """Read a SOLIDWORKS document as it is now: the feature tree (name, type, suppressed, rebuild errors and
    warnings with SOLIDWORKS' reason), sketch states (fully / under / over defined), dimensions, global
    variables and equations, the body's volume and bounding box; for an assembly its components (file, fixed,
    position) and mates with their state. sketches=true adds each sketch's entities (in sketch coordinates, with
    ids you can use), relations and dimensions. Read before editing: the user may have changed it by hand."""
    return await _simple("read", {"doc": doc, "sketches": sketches, "component": component}, timeout=120)


# ----------------------------------------------------------------------------- writing features

class _Bad(ValueError):
    pass


def _solve(feats: list[dict]) -> tuple[list[dict], list[str], dict]:
    """Check features with the registry and solve every sketch with the sketch solver. Returns the features
    with solved coordinates, input problems, and per-sketch solver notes."""
    problems: list[str] = []
    out = copy.deepcopy(feats)
    for f in out:
        problems += features.validate(f)
        if f.get("type") == "sketch":
            ents = f.get("entities")
            if not isinstance(ents, list) or not ents:
                problems.append(f"{f.get('name') or f.get('id') or 'sketch'}: a sketch needs entities")
    sks = [f for f in out if f.get("type") == "sketch" and isinstance(f.get("entities"), list)]
    notes: dict = {}
    if sks and not problems:
        solved, why = inspection.solve_sketches(sks, entities=True)
        if why:
            notes["solver"] = why  # node missing: SOLIDWORKS solves on its own
        for f in sks:
            r = solved.get(f["id"]) or {}
            if r.get("error"):
                problems.append(f"{f.get('name') or f['id']}: the sketch cannot be solved ({r['error']})")
                continue
            if r.get("status") == "over" or r.get("conflicts"):
                problems.append(f"{f.get('name') or f['id']}: over defined (conflicting: {r.get('conflicts')})")
                continue
            if r.get("entities"):
                f["entities"] = r["entities"]
            notes[f["id"]] = {k: r.get(k) for k in ("dof", "status", "under") if r.get(k) is not None}
    return out, problems, notes


async def _predict(doc: str | None, component: str | None, feats: list[dict]) -> tuple[dict, str | None]:
    """What OpenSketch's own kernel makes of these features on SOLIDWORKS' current body: each feature's volume
    change, the body's box after it, an extrude's range along its sketch normal and the resolved sketch planes.
    The add-in compares and makes a feature the other way round if SOLIDWORKS read a flag differently. Features that refer to SOLIDWORKS names get no prediction."""
    try:
        g = await _geometry(doc, component)
        if g["kind"] != "part":
            return {}, "no prediction for an assembly without component"
        base = [dict(f, id="__body") for f in g["doc"]["features"]]
    except GEOM_ERRORS as exc:
        if "no solid body" not in str(exc):
            return {}, f"no prediction: {exc}"
        base = []
    pdoc = {"version": 1, "type": "part", "name": "prediction", "units": "mm", "rollback": None,
            "features": base + copy.deepcopy(feats)}
    try:
        return await _cad(_predict_sync, pdoc), None
    except Exception as exc:  # the prediction is a help, never a blocker
        return {}, f"no prediction: {exc}"


def _predict_sync(pdoc: dict) -> dict:
    """In the worker: rebuild the prediction document and say what each new feature should do."""
    from . import geometry
    st, _ = geometry.regen(pdoc)
    return expectations(st, {"__body"})


def expectations(st, skip: set = frozenset()) -> dict:
    """{feature id: what the add-in checks it against} from an OpenSketch rebuild."""
    out: dict = {}
    for s in st.status:
        fid = s.get("id")
        if fid in skip:
            continue
        d = s.get("diagnostics") or {}
        e: dict = {}
        if s.get("state") == "error":
            e["error"] = s.get("message")
        if "volume_change_mm3" in d:
            e["dv"] = d["volume_change_mm3"]
        for k_in, k_out in (("result_bbox", "bbox"), ("tool_bbox", "tool_bbox"), ("resolved_plane", "plane")):
            if d.get(k_in) is not None:
                e[k_out] = d[k_in]
        if d.get("extrusion"):
            e["range"] = d["extrusion"].get("normal_range_mm")
        if e:
            out[fid] = e
    return out


@mcp.tool()
async def sw_add_features(features: Annotated[list[dict], Field(description="Features in OpenSketch's format, in tree order (sw_get_guide)")],
                          doc: _DOC = None, component: _COMP = None,
                          summary: str = "",
                          predict: Annotated[bool, Field(description="Build the same features here on the current body first and check SOLIDWORKS against it")] = True) -> CallToolResult:
    """Make features in a SOLIDWORKS part (or in a component's part with component): sketches (entities,
    relations, dimensions), plane, extrude (boss/cut, blind, through all, up to next, mid plane, two directions,
    draft), revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, linear and circular pattern.
    Each sketch is solved here first; SOLIDWORKS gets exact coordinates, then the relations and dimensions.
    Every feature is checked after it is made (direction, volume change, errors) and made the other way if
    SOLIDWORKS read a flag differently. Returns each feature's SOLIDWORKS name, state, volume change and the
    body's bounding box. Stops at the first feature that fails and leaves the earlier ones in place (use
    sw_batch to have it all or nothing)."""
    try:
        feats, problems, notes = await _thread(_solve, features)  # node solves the sketches: not on the event loop
    except Exception as exc:
        return _text({"error": f"Could not read the features: {exc}"}, True)
    if problems:
        return _text({"error": "Input problems; nothing was sent to SOLIDWORKS.", "input_problems": problems}, True)
    expect, why = await _predict(doc, component, feats) if predict else ({}, None)
    for f in feats:
        if f.get("id") in expect:
            f["expect"] = expect[f["id"]]
    res, _, err = await _run("add_features", {"doc": doc, "component": component, "features": feats, "summary": summary},
                             timeout=600)
    out = dict(res or {})
    if notes:
        out["sketch_solver"] = notes
    if why:
        out["prediction"] = why
    if err:
        out["error"] = err
        return _text(out, True)
    return _text(out)


BATCH_OPS = {"sw_add_features": "add_features", "sw_insert_component": "insert_component", "sw_add_mate": "add_mate",
             "sw_set_parameter": "set_parameter", "sw_set_equation": "set_equation"}


@mcp.tool()
async def sw_batch(steps: Annotated[list[dict], Field(description=(
                       'Steps in order, each {"tool": "<tool>", "args": {...}} with that tool\'s arguments (doc may be '
                       'left out: the batch doc is used). Tools: sw_add_features, sw_insert_component, sw_add_mate, '
                       'sw_set_parameter, sw_set_equation.'))],
                   doc: _DOC = None, summary: str = "",
                   stop_on_warnings: bool = False) -> CallToolResult:
    """Run several steps in SOLIDWORKS as ONE change: if a step fails (an error, a feature SOLIDWORKS cannot
    make, a mate that does not hold, or with stop_on_warnings a warning), everything the batch made is removed
    and changed values are put back, and the reply says which step failed and why. Build parts in stages of a
    few features, checking each stage's volume and bounding box."""
    if not steps:
        return _text({"ok": False, "error": "steps is empty."}, True)
    if len(steps) > 100:
        return _text({"ok": False, "error": "At most 100 steps per batch."}, True)
    send, notes = [], {}
    for i, s in enumerate(steps):
        tool = s.get("tool") if isinstance(s, dict) else None
        args = dict(s.get("args") or {}) if isinstance(s, dict) and isinstance(s.get("args", {}), dict) else None
        if tool not in BATCH_OPS or args is None:
            return _text({"ok": False, "completed": 0, "failed": {"index": i, "tool": tool,
                          "error": f"Use one of {', '.join(BATCH_OPS)} with an args object."}, "rolled_back": True}, True)
        args.setdefault("doc", doc)
        if tool == "sw_add_features":
            try:
                feats, problems, n = await _thread(_solve, args.get("features") or [])
            except Exception as exc:
                problems, feats, n = [f"Could not read the features: {exc}"], [], {}
            if problems:
                return _text({"ok": False, "completed": 0, "failed": {"index": i, "tool": tool,
                              "error": "Input problems: " + "; ".join(problems)}, "rolled_back": True,
                              "note": "Nothing was sent to SOLIDWORKS."}, True)
            args["features"] = feats
            if n:
                notes[str(i)] = n
        if tool == "sw_add_mate":
            args = _mate_args(args)
        send.append({"op": BATCH_OPS[tool], "args": {k: v for k, v in args.items() if v is not None}})
    # one prediction for all the feature steps on this document, in order (later steps build on earlier ones)
    fsteps = [st for st in send if st["op"] == "add_features" and not st["args"].get("component")
              and st["args"].get("doc") in (None, doc)]
    allf = [f for st in fsteps for f in st["args"]["features"]]
    ids = [f.get("id") for f in allf]
    if allf and len(ids) == len(set(ids)):
        expect, why = await _predict(doc, None, allf)
        for f in allf:
            if f.get("id") in expect:
                f["expect"] = expect[f["id"]]
        if why:
            notes["prediction"] = why
    res, _, err = await _run("batch", {"doc": doc, "steps": send, "summary": summary,
                                       "stop_on_warnings": stop_on_warnings}, timeout=900)
    out = dict(res or {})
    if notes:
        out["sketch_solver"] = notes
    if err:
        out.setdefault("ok", False)
        out["error"] = err
        return _text(out, True)
    return _text(out, not out.get("ok", True))


@mcp.tool()
async def sw_delete_items(doc: _DOC = None, features: list[str] | None = None, components: list[str] | None = None,
                          mates: list[str] | None = None,
                          dry_run: Annotated[bool, Field(description="Only report what would go with them")] = False) -> CallToolResult:
    """Delete features (by SOLIDWORKS name; their absorbed sketches go too, children that depend on them are
    listed), components or mates. dry_run=true lists what would be deleted and what depends on it."""
    return await _simple("delete", {"doc": doc, "features": features, "components": components, "mates": mates,
                                    "dry_run": dry_run})


@mcp.tool()
async def sw_undo(doc: _DOC = None, steps: Annotated[int, Field(ge=1, le=20)] = 1) -> CallToolResult:
    """SOLIDWORKS Edit > Undo, `steps` times."""
    return await _simple("undo", {"doc": doc, "steps": steps})


@mcp.tool()
async def sw_set_parameter(name: str, expression: str | None = None, doc: _DOC = None,
                           remove: bool = False, comment: str | None = None) -> CallToolResult:
    """Create, change or remove a SOLIDWORKS global variable (Tools > Equations): "wall" = 2.5, or an
    expression of other variables ("length / 40"). Everything that uses it is rebuilt."""
    return await _simple("set_parameter", {"doc": doc, "name": name, "expression": expression, "remove": remove,
                                           "comment": comment})


@mcp.tool()
async def sw_set_equation(target: Annotated[str, Field(description='A dimension "D1@Sketch1", or "<feature name>.<field>" such as "Boss-Extrude1.depth" (fields: depth, dir2.depth, diameter (from the feature\'s sketch), radius, distance, thickness, offset, spacing, spacing2, angle, draft, step, count, count2; holes also bore_depth, bore_diameter, sink_diameter)')],
                          expression: Annotated[str | None, Field(description='Global variables and numbers, e.g. "wall * 2"; empty removes the equation')] = None,
                          doc: _DOC = None) -> CallToolResult:
    """Drive a dimension with an equation of global variables (SOLIDWORKS Equations)."""
    return await _simple("set_equation", {"doc": doc, "target": target, "expression": expression})


# ----------------------------------------------------------------------------- assemblies

@mcp.tool()
async def sw_insert_component(part: Annotated[str, Field(description="Path of a .SLDPRT/.SLDASM, or an open document's title")],
                              doc: _DOC = None,
                              position: Annotated[list[float] | None, Field(description="[x,y,z] mm of the part origin")] = None,
                              rotation: Annotated[list[float] | None, Field(description="[rx,ry,rz] degrees about the assembly X, then Y, then Z axes")] = None,
                              fixed: bool | None = None) -> CallToolResult:
    """Insert a part (or sub-assembly) into the assembly at a position; mates finish the placement. The first
    component is fixed unless fixed=false. Returns the component's name (e.g. Bracket-1) for mates."""
    return await _simple("insert_component", {"doc": doc, "part": part, "position": position, "rotation": rotation,
                                              "fixed": fixed}, timeout=180)


def _mate_args(a: dict) -> dict:
    mate = {k: a.get(k) for k in ("type", "refs", "value", "align", "flip", "planes", "angle_refs", "angle_min",
                                  "angle_max", "min", "max", "name") if a.get(k) is not None}
    return {"doc": a.get("doc"), "mate": mate}


@mcp.tool()
async def sw_add_mate(type: MATE_TYPES, refs: list[dict], doc: _DOC = None, value: float | None = None,
                      align: Literal["anti", "aligned", "auto"] | None = None, flip: bool | None = None,
                      planes: list[dict] | None = None, angle_refs: list[dict] | None = None,
                      angle_min: float | None = None, angle_max: float | None = None,
                      min: float | None = None, max: float | None = None, name: str | None = None) -> CallToolResult:
    """Add a SOLIDWORKS mate. refs: two references in each component's PART coordinates, e.g.
    {"component": "Base-1", "plane": {"point": [x,y,z], "normal": [x,y,z]}}, {"component": "Pin-1", "axis":
    {"point": [...], "dir": [...]}}, {"component": "Base-1", "ref": "Top Plane"}, or {"ref": "Front Plane"}
    for the assembly's own plane. value: mm or degrees for distance / angle. hinge: refs = two axes, planes =
    two faces that stay together, angle_refs + angle_min / angle_max = travel limits (a Hinge mate).
    limit_distance / limit_angle: refs + min / max. The mate is kept only if SOLIDWORKS makes it without error;
    alignments are tried in order (the one you give first). Returns the mate's name and state."""
    return await _simple("add_mate", _mate_args({"doc": doc, "type": type, "refs": refs, "value": value, "align": align,
                                                 "flip": flip, "planes": planes, "angle_refs": angle_refs,
                                                 "angle_min": angle_min, "angle_max": angle_max, "min": min, "max": max,
                                                 "name": name}))


# ----------------------------------------------------------------------------- geometry here (STEP), cached

_cache: OrderedDict = OrderedDict()
CACHE = 24
CACHE_BYTES = 96 * 2**20  # the parts' BREP text kept here (in the web server's memory) between calls


def _size(doc: dict) -> int:
    return sum(len(f.get("data") or "") for f in doc.get("features", []))


def _remember(key: tuple, value: dict) -> None:
    _cache[key] = value
    _cache.move_to_end(key)
    while len(_cache) > CACHE or (len(_cache) > 1 and sum(_size(v["doc"]) for v in _cache.values()) > CACHE_BYTES):
        _cache.popitem(last=False)


def _parts_from_step(items: list[tuple[bytes, str]]) -> list[dict]:
    """In the worker: SOLIDWORKS' STEP files -> part documents with one imported body each."""
    return [_part_doc_from_step(raw, title) for raw, title in items]


def _part_doc_from_step(raw: bytes, title: str) -> dict:
    shape = importer._read_step(raw)
    solids = shape.solids() if hasattr(shape, "solids") else []
    if not solids:
        raise ValueError(f"{title}: the STEP from SOLIDWORKS has no solid body.")
    from build123d import Compound
    body = solids[0] if len(solids) == 1 else Compound(children=list(solids))
    return {"version": 1, "type": "part", "name": title, "units": "mm",
            "features": [importer.import_part_feature(body, title, title + ".step")], "rollback": None}


def _matrix_pose(m: list[float]) -> tuple[list[float], list[float]]:
    """SOLIDWORKS component placement [r00..r22 by rows, tx, ty, tz mm] -> OpenSketch position, rotation."""
    R = np.array(m[:9], dtype=float).reshape(3, 3)
    return [round(float(v), 6) for v in m[9:12]], assembly.euler_of(assembly.orthonormal(R))


async def _geometry(doc: str | None, component: str | None = None) -> dict:
    """An OpenSketch document holding SOLIDWORKS' current geometry: a part with one imported body, or an
    assembly whose component ids are SOLIDWORKS' component names. Parts are re-exported only when SOLIDWORKS'
    update stamp changed."""
    pid = swbridge.person_id(_who())
    have = {k[1]: v["stamp"] for k, v in _cache.items() if k[0] == pid}
    res, files, err = await _run("geometry", {"doc": doc, "component": component, "have": have}, timeout=600)
    if err:
        raise ValueError(err)
    parts: dict[str, dict] = {}
    sent = {key: info for key, info in (res.get("parts") or {}).items() if info.get("file")}
    for key, info in sent.items():
        if not files.get(info["file"]):
            raise ValueError(f"SOLIDWORKS sent no STEP for {info.get('title') or key}.")
    fresh: dict[str, dict] = {}
    if sent:  # read in the worker, all in one call
        docs = await _cad(_parts_from_step, [(files[i["file"]], i.get("title") or "Part") for i in sent.values()])
        fresh = dict(zip(sent, docs))
        for key, d in fresh.items():
            _remember((pid, key), {"stamp": sent[key].get("stamp"), "doc": d})
    for key, info in (res.get("parts") or {}).items():
        ck = (pid, key)
        if key in fresh:
            parts[key] = fresh[key]
        elif ck in _cache and _cache[ck]["stamp"] == info.get("stamp"):
            parts[key] = _cache[ck]["doc"]
            _cache.move_to_end(ck)
        else:
            raise ValueError(f"No geometry for {info.get('title') or key}; try again.")
    if res.get("kind") != "assembly":
        key = res.get("key")
        if key not in parts:
            raise ValueError("SOLIDWORKS sent no body for this part (is it empty?).")
        return {"kind": "part", "doc": parts[key], "title": res.get("title")}
    keys = {}
    for k in parts:
        keys[k] = "p" + str(len(keys) + 1)
    comps = []
    for c in res.get("components") or []:
        if c.get("key") not in parts:
            continue
        pos, rot = _matrix_pose(c["matrix"])
        comps.append({"id": c["name"], "name": c["name"], "part": keys[c["key"]], "position": pos, "rotation": rot,
                      "fixed": True, **({"hidden": True} if c.get("hidden") else {}),
                      **({"suppressed": True} if c.get("suppressed") else {})})
    osdoc = {"version": 1, "type": "assembly", "name": res.get("title") or "Assembly", "units": "mm",
             "parts": {keys[k]: v for k, v in parts.items()}, "components": comps, "mates": []}
    return {"kind": "assembly", "doc": osdoc, "title": res.get("title"), "part_keys": keys}


def _topology_sync(osdoc: dict, kind, near, limit) -> dict:
    from . import geometry
    st, _ = geometry.regen(osdoc)
    out = inspection.body_topology(st.part, kind, near, limit, None)
    for f in out.get("faces", []):
        f.pop("name", None)
    for e in out.get("edges", []):
        e.pop("name", None)
    return out


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_body_topology(doc: _DOC = None, component: _COMP = None,
                           kind: Literal["both", "faces", "edges"] = "both",
                           near: Annotated[list[float] | None, Field(description="[x,y,z] mm: items nearest this point first")] = None,
                           limit: Annotated[int, Field(ge=1, le=500)] = 60) -> CallToolResult:
    """Faces and edges of the part's body as SOLIDWORKS has it now (part coordinates; in an assembly give
    component). Faces: type, area, centre, an on-face point, normal, axis and radius, `ref`. Edges: type,
    midpoint, ends, length, direction or centre and radius, the faces it joins, face_angle_deg (90 = square
    corner, 0 = smooth), seam, `ref`. Pass a ref as-is in fillet / chamfer edges, shell / draft faces, mate
    planes and axes."""
    try:
        g = await _geometry(doc, component)
        if g["kind"] != "part":
            return _text({"error": "This is an assembly: give component (its part's faces, in part coordinates)."}, True)
        out = await _cad(_topology_sync, g["doc"], kind, near, limit)
    except GEOM_ERRORS as exc:
        return _text({"error": str(exc)}, True)
    out["coordinates"] = "part" + (f" ({component})" if component else "")
    return _text(out)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_measure_items(a: Annotated[dict, Field(description='{"face": ref} | {"edge": ref} | {"point": [x,y,z]}; in an assembly add "component": "<name>" (assembly coordinates)')],
                           b: Annotated[dict | None, Field(description="Optional second item, same form")] = None,
                           doc: _DOC = None) -> CallToolResult:
    """Measure like SOLIDWORKS Evaluate > Measure, on the current geometry: one item gives area, length,
    diameter, axis, normal, hole or not, and the holes and slots through a planar face; two items give the
    minimum distance with its points, centre distance between axes, angles and plane distances."""
    try:
        g = await _geometry(doc)
        out = await _cad(measure.measure, g["doc"], a, b, None)
    except GEOM_ERRORS + (measure.MeasureError,) as exc:
        return _text({"error": str(exc)}, True)
    return _text(out)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_inspect_design(doc: _DOC = None, component: _COMP = None) -> CallToolResult:
    """Numbers to check against what you meant: every feature's state, the body's volume, area, centre of mass,
    bounding box, body count, mass with the SOLIDWORKS material, each sketch's state (fully / under / over
    defined); for an assembly the components, mates and their states."""
    return await _simple("read", {"doc": doc, "component": component, "numbers": True}, timeout=180)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_preview(doc: _DOC = None, view: Literal["isometric", "top", "front", "right"] = "isometric",
                     width: int = 960, height: int = 720, component: _COMP = None,
                     yaw: Annotated[float | None, Field(description="Degrees about +Y from the front toward the right; with pitch, replaces view")] = None,
                     pitch: Annotated[float | None, Field(description="Degrees above the XZ plane (90 = top)")] = None,
                     target: Annotated[list[float] | None, Field(description="[x,y,z] mm to centre on (close-ups)")] = None,
                     view_width: Annotated[float | None, Field(description="Width shown in mm (zoom)")] = None,
                     section: Annotated[dict | None, Field(description='{"point": [x,y,z], "normal": [x,y,z]}: cut away the normal\'s side')] = None,
                     screenshot: Annotated[bool, Field(description="A picture of the SOLIDWORKS window itself instead (no section or camera options)")] = False
                     ) -> CallToolResult:
    """A PNG of the current SOLIDWORKS geometry, returned directly. Rendered here from the body (any view, close-
    ups, a section to look inside), or with screenshot=true the SOLIDWORKS window as the user sees it."""
    if not 128 <= width <= 1600 or not 128 <= height <= 1600:
        return _text({"error": "width and height must be 128..1600."}, True)
    if screenshot:
        res, files, err = await _run("screenshot", {"doc": doc, "view": view, "width": width, "height": height}, timeout=120)
        raw = files.get((res or {}).get("file") or "")
        if err or not raw:
            return _text({"error": err or "SOLIDWORKS sent no picture."}, True)
    else:
        try:
            g = await _geometry(doc, component)
            cam = {k: v for k, v in {"yaw": yaw, "pitch": pitch, "target": target, "view_width": view_width}.items() if v is not None}
            raw = await _cad(_preview_sync, g["doc"], view, width, height, section, cam)
        except GEOM_ERRORS as exc:
            return _text({"error": f"Cannot preview: {exc}"}, True)
        res = {"view": view, "width": width, "height": height}
    rec = {"id": "solidworks", "version": 0, "name": "SOLIDWORKS"}
    try:
        info = await _thread(artifacts.publish, rec, raw, "png", (res or {}).get("title") or "SOLIDWORKS")
    except artifacts.ArtifactError:
        info = {}
    meta = dict(res or {}, **{k: info[k] for k in ("download_url", "expires_at") if k in info})
    return CallToolResult(content=[TextContent(type="text", text=json.dumps(meta)),
                                   ImageContent(type="image", data=base64.b64encode(raw).decode(), mime_type="image/png")])


def _preview_sync(doc: dict, view, width, height, section, cam) -> bytes:
    from .preview import render_preview
    return render_preview(doc, view=view, width=width, height=height, section=section, **cam)


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_check_interference(doc: _DOC = None) -> CallToolResult:
    """Every pair of components in the assembly whose bodies overlap, with the overlap volume (mm3)."""
    try:
        g = await _geometry(doc)
        if g["kind"] != "assembly":
            return _text({"error": "Interference needs an assembly."}, True)
        res = await _cad(assembly.interference, g["doc"])
    except GEOM_ERRORS + (assembly.AssemblyError,) as exc:
        return _text({"error": str(exc)}, True)
    return _text({"checked": res["checked"], "interferences": [
        {"components": i["names"], "volume_mm3": round(i["volume"], 3)} for i in res["interferences"]]})


@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_find_mate_candidates(doc: _DOC = None) -> CallToolResult:
    """Likely mates from the assembly's geometry (shafts in holes, faces lying on each other), with references
    ready for sw_add_mate. Useful after inserting parts or importing a STEP assembly."""
    try:
        g = await _geometry(doc)
        if g["kind"] != "assembly":
            return _text({"error": "Mate candidates need an assembly."}, True)
        res = await _cad(assembly.mate_candidates, g["doc"])
    except GEOM_ERRORS + (assembly.AssemblyError,) as exc:
        return _text({"error": str(exc)}, True)
    return _text({"candidates": res})


# ----------------------------------------------------------------------------- drawings

DRAWINGS_FROM = "0.9.0"   # the first add-in that knows create_drawing and the drawing export formats
DRAWING_VIEWS = Literal["front", "top", "right", "left", "bottom", "back", "isometric"]
_SCALE = re.compile(r"^\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)\s*$")


@mcp.tool()
async def sw_create_drawing(
        doc: Annotated[str | None, Field(description="The part or assembly to draw (path or window title); omit for the active document. It must have been saved.")] = None,
        sheet: Annotated[Literal["A4", "A3", "A2", "A1", "A0"], Field(description="Sheet size, landscape")] = "A3",
        projection: Annotated[Literal["third", "first"], Field(description="Third angle (AS 1100, ASME) or first angle (ISO in Europe)")] = "third",
        views: Annotated[list[DRAWING_VIEWS] | None, Field(description="Omit for the standard set: front, top and right in the chosen projection, plus an isometric. Or name the views you want.")] = None,
        scale: Annotated[str | None, Field(description='Sheet scale such as "1:2" or "2:1"; omit to choose the largest standard scale that fits the sheet')] = None,
        dimensions: Annotated[bool, Field(description="Insert the model's own dimensions (those marked for drawing) into the views")] = True,
        properties: Annotated[dict[str, str] | None, Field(description='Title block fields, set as the drawing\'s custom properties, e.g. {"Title": "Mounting plate", "DrawingNo": "KV-1001", "Revision": "A", "DrawnBy": "KJ", "Material": "6061-T6"}')] = None,
        name: Annotated[str | None, Field(description="File name without extension; default the model's name")] = None,
        folder: Annotated[str | None, Field(description="Windows folder; default the model's own folder")] = None) -> CallToolResult:
    """A native SOLIDWORKS drawing (.SLDDRW) of a part or assembly, from the user's default drawing template: the
    views on one sheet, the sheet scale, the model's dimensions and the title block properties. It is saved next to
    the model. Look at it with sw_preview (doc = the drawing, screenshot=true); export it with sw_export (pdf, dwg
    or dxf)."""
    m = _SCALE.match(scale) if scale else None
    if scale and (not m or float(m.group(1)) <= 0 or float(m.group(2)) <= 0):
        return _text({"error": 'scale is "a:b" with two positive numbers, for example "1:2" or "2:1".'}, True)
    props = {}
    for k, v in (properties or {}).items():
        k, v = str(k).strip(), str(v).strip()
        if not k or len(k) > 40 or len(v) > 200 or any(c in k for c in '"$@'):
            return _text({"error": f"Title block property {k[:40]!r}: names up to 40 characters (no quotes, $ or @), values up to 200."}, True)
        props[k] = v
    if len(props) > 30:
        return _text({"error": "At most 30 title block properties."}, True)
    if views is not None and not views:
        return _text({"error": "views: name at least one view, or leave it out for the standard set."}, True)
    old = swbridge.addin_too_old(_who(), DRAWINGS_FROM, "Making drawings")
    if old:
        return _text({"error": old}, True)
    args = {"doc": doc, "sheet": sheet, "projection": projection, "views": list(dict.fromkeys(views)) if views else None,
            "scale": [float(m.group(1)), float(m.group(2))] if m else None, "dimensions": dimensions,
            "properties": props or None, "name": name, "folder": folder}
    return await _simple("create_drawing", args, timeout=600)


# ----------------------------------------------------------------------------- files in and out

@mcp.tool(annotations=ToolAnnotations(read_only_hint=True, destructive_hint=False, open_world_hint=False))
async def sw_export(format: Literal["step", "stl", "x_t", "igs", "sldprt", "sldasm", "slddrw", "pdf", "dwg", "dxf"],
                    doc: _DOC = None, component: _COMP = None) -> CallToolResult:
    """Export from SOLIDWORKS and return a download_url valid for one hour. Parts and assemblies: STEP, STL,
    Parasolid, IGES, a copy of the native file, or a PDF of the view. Drawings: PDF (every sheet), DWG or DXF (the
    active sheet), or a copy of the .SLDDRW."""
    if format in ("dwg", "dxf", "slddrw"):
        old = swbridge.addin_too_old(_who(), DRAWINGS_FROM, f"Exporting {format.upper()}")
        if old:
            return _text({"error": old}, True)
    res, files, err = await _run("export", {"doc": doc, "component": component, "format": format}, timeout=600)
    raw = files.get((res or {}).get("file") or "")
    if err or not raw:
        return _text({"error": err or "SOLIDWORKS sent no file."}, True)
    rec = {"id": "solidworks", "version": 0, "name": "SOLIDWORKS"}
    try:
        # a native copy is named for what it is (a drawing asked for as sldprt is still an .slddrw)
        fmt = (res or {}).get("format") if (res or {}).get("format") in artifacts.FORMATS else format
        info = await _thread(artifacts.publish, rec, raw, fmt, (res or {}).get("title") or "SOLIDWORKS")
    except artifacts.ArtifactError as exc:
        return _text({"error": str(exc)}, True)
    return _text(dict(res, **info))


@mcp.tool()
async def sw_import(filename: Annotated[str | None, Field(description="e.g. bracket.step; optional with upload_id")] = None,
                    data: Annotated[str | None, Field(description="Base64 file bytes, small files only")] = None,
                    upload_id: Annotated[str | None, Field(description="From request_upload, after sending the file")] = None,
                    folder: Annotated[str | None, Field(description="Where to save the SOLIDWORKS files; default Documents\\OpenSketch")] = None) -> CallToolResult:
    """Open a STEP, IGES or Parasolid file in SOLIDWORKS (an assembly if it has several bodies) and save it as
    SOLIDWORKS files. For anything over about 100 KB use request_upload first, as for import_document."""
    who = _who()
    if not swbridge.status(who).get("connected"):  # before holding the file in memory for SOLIDWORKS
        return _text({"error": swbridge.NOT_CONNECTED}, True)

    def read():
        if upload_id:
            raw, meta = uploads.take(upload_id, who)
            return raw, _check_filename(filename or meta["filename"])
        name = _check_filename(filename)
        if not data:
            raise ValueError("Give data or upload_id.")
        return base64.b64decode(data, validate=True), name
    try:
        raw, filename = await _thread(read)
        if not raw or len(raw) > MAX_IMPORT_BYTES:
            raise ValueError("The file must be 1 byte to 32 MiB.")
    except (ValueError, binascii.Error, uploads.UploadError) as exc:
        return _text({"error": f"Cannot import: {exc}"}, True)
    bid = swbridge.add_blob(who, raw, filename)
    try:
        res, _, err = await _run("import", {"filename": filename, "folder": folder}, timeout=600, blobs={"file": bid})
    finally:
        swbridge.drop_blob(bid)  # SOLIDWORKS has it (or will never fetch it): free the memory
    if upload_id and not err:
        uploads.mark_imported(upload_id, "solidworks")
    if err:
        return _text(dict(res or {}, error=err), True)
    return _text(res)


@mcp.tool()
async def sw_standard_part(kind: StdKind, size: str, length: float | None = None,
                           folder: Annotated[str | None, Field(description="Default Documents\\OpenSketch\\Toolbox")] = None) -> CallToolResult:
    """An ISO screw, nut, washer or ball bearing made to size and saved as a SOLIDWORKS part (from STEP), ready
    for sw_insert_component. size e.g. "M6-1" (screws, nuts, washers) or "M8-22-7" (bore-OD-width bearings);
    length mm for screws. Axis along the part Y axis, head above Y = 0, shank down -Y."""
    if not swbridge.status(_who()).get("connected"):
        return _text({"error": swbridge.NOT_CONNECTED}, True)
    try:
        pdoc, raw = await _cad(_standard_step, kind, size, length)
    except (KeyError, ValueError, TypeError) as exc:
        return _text({"error": f"Cannot make that part: {exc}. Check the kind, size and length."}, True)
    except Exception as exc:  # bd_warehouse refuses unknown sizes with its own errors
        return _text({"error": f"Cannot make that part: {exc}"}, True)
    name = pdoc["name"].replace(" ", "_")
    bid = swbridge.add_blob(_who(), raw, name + ".step")
    try:
        res, _, err = await _run("import", {"filename": name + ".step", "folder": folder, "subfolder": "Toolbox",
                                            "name": pdoc["name"]}, timeout=300, blobs={"file": bid})
    finally:
        swbridge.drop_blob(bid)
    if err:
        return _text(dict(res or {}, error=err), True)
    return _text(dict(res, standard=pdoc.get("standard")))


def _standard_step(kind: str, size: str, length: float | None) -> tuple[dict, bytes]:
    """In the worker: a standard part and its STEP."""
    import tempfile
    from pathlib import Path
    from . import geometry
    pdoc = importer.standard_part_doc(kind, size=size, **({"length": length} if length else {}))
    st, _ = geometry.regen(pdoc)
    if st.part is None:
        raise ValueError("The part could not be made at that size.")
    with tempfile.TemporaryDirectory() as tmp:
        p = Path(tmp) / "part.step"
        geometry.export(pdoc, "step", str(p))
        return pdoc, p.read_bytes()
