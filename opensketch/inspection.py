"""Numbers about a document for the AI, so it can check its work without looking at a picture.

- `body_topology`: every face and edge of a part with an on-face point, normal, axis, midpoint and
  adjacent faces, plus the exact reference to pass to fillet / chamfer / shell / draft. Indices are the
  same as the browser's selection ids (faces() / edges() order, see geometry.mesh_shape).
- `inspect_design`: one call with the rebuild state of every feature, the body's volume, area, centre of
  mass and bounding box, and every sketch's degrees of freedom (solved by the browser's own sketch
  solver, run with node, so the server and the page never disagree).

Idea borrowed from SolidCraft (bherbruck/solidcraft): body_topology and inspect_design in its MCP.
"""

from __future__ import annotations

import json
import math
import shutil
import subprocess
from pathlib import Path

from . import assembly, geometry

SOLVE_CLI = Path(__file__).parent / "solver" / "solve_cli.mjs"


def _r(v, n=3):
    return round(float(v), n) + 0.0  # + 0.0 turns -0.0 into 0.0


def _pt(v) -> list[float]:
    return [_r(x) for x in geometry.vlist(v)]


def _dir(v) -> list[float]:
    return [_r(x, 4) for x in geometry.vlist(v)]


def _type(shape) -> str:
    return str(shape.geom_type).split(".")[-1].lower()


# ----------------------------------------------------------------------------- topology

def _face_point(f):
    """A point that is really on the face (a face's centre can sit in a hole or outside a curved face)."""
    return geometry.on_face_point(f)


def _face_info(i: int, f) -> dict:
    t = _type(f)
    c = f.center()
    out = {"index": i, "type": t, "area": _r(f.area, 2), "center": _pt(c), "point": _pt(_face_point(f))}
    try:
        n = f.normal_at(c)
        if t == "plane":
            out["normal"] = _dir(n)
            out["ref"] = {"center": _pt(c), "normal": _dir(n)}  # what shell / draft faces expect
        else:
            out["ref"] = {"center": _pt(c)}
    except Exception:
        out["ref"] = {"center": _pt(c)}
    if t in ("cylinder", "cone", "sphere", "torus"):
        try:
            ax = f.axis_of_rotation
            out["axis"] = {"point": _pt(ax.position), "dir": _dir(ax.direction)}
        except Exception:
            pass
        try:
            out["radius"] = _r(f.radius)
        except Exception:
            pass
    return out


def _edge_info(i: int, e, faces: list) -> dict:
    t = _type(e)
    mid = e.position_at(0.5)
    out = {"index": i, "type": t, "mid": _pt(mid), "length": _r(e.length), "start": _pt(e.position_at(0)),
           "end": _pt(e.position_at(1)), "faces": faces, "ref": {"mid": _pt(mid)}}
    if t == "line":
        out["dir"] = _dir((e.position_at(1) - e.position_at(0)).normalized())
    if t in ("circle", "ellipse"):
        try:
            out["center"] = _pt(e.arc_center)
            out["radius"] = _r(e.radius)
            out["closed"] = (e.position_at(0) - e.position_at(1)).length < 1e-6
        except Exception:
            pass
    return out


def _face_angle(e, fa, fb) -> float | None:
    """Angle between the two faces' normals at the edge midpoint: 0 = tangent (smooth), 90 = square corner."""
    try:
        m = e.position_at(0.5)
        na, nb = fa.normal_at(m), fb.normal_at(m)
        return _r(math.degrees(math.acos(max(-1.0, min(1.0, na.dot(nb))))), 1)
    except Exception:
        return None


def body_topology(part, kind: str = "both", near: list | None = None, limit: int = 60, namer=None) -> dict:
    """Faces and edges of a solid. near=[x,y,z] sorts them nearest first; limit caps each list. With the
    rebuild's namer, every face and edge also gets its persistent name (naming.py), carried in `ref`."""
    if part is None:
        return {"error": "No solid body: build a feature first."}
    faces, edges = part.faces(), part.edges()
    fnames = enames = fexact = None
    if namer is not None:
        from .naming import edge_names
        nfaces, nnames, nexact = namer.current(part)
        if len(nfaces) == len(faces):
            fnames, fexact = nnames, nexact
            enames = edge_names(part, nfaces, nnames)
    edge_index = {hash(e): i for i, e in enumerate(edges)}
    edge_faces: dict[int, list[int]] = {}
    for fi, f in enumerate(faces):
        for e in f.edges():
            j = edge_index.get(hash(e))
            if j is not None and fi not in edge_faces.setdefault(j, []):
                edge_faces[j].append(fi)
    out: dict = {"faces_total": len(faces), "edges_total": len(edges)}
    target = geometry.v3(near) if near else None

    def pick(items, where):
        idx = list(range(len(items)))
        if target is not None:
            idx.sort(key=lambda i: (where(items[i]) - target).length)
        return idx[:max(1, limit)]

    if kind in ("both", "faces"):
        out["faces"] = [_face_info(i, faces[i]) for i in pick(faces, _face_point)]
        if fnames:
            for row in out["faces"]:
                row["name"] = fnames[row["index"]]
                row["ref"] = {"name": fnames[row["index"]], **row["ref"]}
                if not fexact[row["index"]]:
                    row["name_exact"] = False
    if kind in ("both", "edges"):
        rows = []
        for i in pick(edges, lambda e: e.position_at(0.5)):
            fs = edge_faces.get(i, [])
            row = _edge_info(i, edges[i], fs)
            if enames:
                row["name"] = enames[i]
                row["ref"] = {"name": enames[i], **row["ref"]}
            if len(fs) == 1:
                row["seam"] = True  # where a closed surface (a hole, a shaft) meets itself: not an edge to round
            if len(fs) == 2:
                a = _face_angle(edges[i], faces[fs[0]], faces[fs[1]])
                if a is not None:
                    row["face_angle_deg"] = a
            rows.append(row)
        out["edges"] = rows
    shown = len(out.get("faces", [])) + len(out.get("edges", []))
    if shown < (len(faces) if kind != "edges" else 0) + (len(edges) if kind != "faces" else 0):
        out["note"] = "Lists are cut to `limit`; pass near=[x,y,z] to get the items around a point first."
    return out


# ----------------------------------------------------------------------------- sketches

def solve_sketches(sketches: list[dict], entities: bool = False) -> tuple[dict, str | None]:
    """{sketch id: {dof, status, solved, conflicts, under}} from the browser solver, or ({}, reason).
    entities=True also returns each sketch's solved entities."""
    if not sketches:
        return {}, None
    node = shutil.which("node")
    if not node:
        return {}, "Sketch degrees of freedom need node, which is not installed on this server."
    payload = json.dumps({"sketches": [{"id": s["id"], "entities": s.get("entities", []),
                                        "constraints": s.get("constraints", [])} for s in sketches],
                          "entities": entities})
    try:
        r = subprocess.run([node, str(SOLVE_CLI)], input=payload, capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            return {}, f"Sketch solver failed: {r.stderr.strip()[:300]}"
        return json.loads(r.stdout), None
    except (subprocess.TimeoutExpired, ValueError, OSError) as exc:
        return {}, f"Sketch solver failed: {exc}"


def _sketch_rows(part_doc: dict, st) -> tuple[dict, str | None]:
    sks = [f for f in part_doc.get("features", []) if f.get("type") == "sketch"]
    solved, note = solve_sketches(sks)
    rows = {}
    for s in sks:
        ents = [e for e in s.get("entities", []) if not e.get("ref")]
        cons = s.get("constraints", [])
        prof = st.profiles.get(s["id"])
        row = {"name": s.get("name"), "curves": sum(1 for e in ents if e.get("type") != "point"),
               "relations": sum(1 for c in cons if c.get("type") not in ("distance", "diameter", "radius", "angle")),
               "dimensions": sum(1 for c in cons if c.get("type") in ("distance", "diameter", "radius", "angle")),
               "regions": len(prof) if isinstance(prof, list) else 0}
        if isinstance(prof, Exception):
            row["profile_error"] = str(prof)
        row.update(solved.get(s["id"], {}))
        rows[s["id"]] = row
    return rows, note


# ----------------------------------------------------------------------------- inspect

def _body(part, material: dict | None) -> dict | None:
    if part is None:
        return None
    from build123d import CenterOf
    bb = part.bounding_box()
    types: dict[str, int] = {}
    for f in part.faces():
        t = _type(f)
        types[t] = types.get(t, 0) + 1
    out = {"volume_mm3": _r(part.volume), "area_mm2": _r(part.area), "center_of_mass": _pt(part.center(CenterOf.MASS)),
           "bbox": {"min": _pt(bb.min), "max": _pt(bb.max), "size": _pt(bb.max - bb.min)},
           "solids": len(part.solids()), "faces": len(part.faces()), "edges": len(part.edges()),
           "vertices": len(part.vertices()), "face_types": types}
    if material and material.get("density"):
        out["material"] = material.get("name")
        out["mass_g"] = _r(part.volume * float(material["density"]) * 1000, 2)  # density is kg/mm^3
    return out


def inspect_part(part_doc: dict, sketches: bool = True) -> dict:
    from .docformat import status_report
    st = geometry.rebuilt(part_doc)
    rep = status_report(st.status)
    names = {f["id"]: (f.get("name"), f.get("type")) for f in part_doc.get("features", [])}
    timeline = []
    for s in st.status:
        name, typ = names.get(s["id"], (None, None))
        row = {"id": s["id"], "name": name, "type": typ, "state": s["state"]}
        if s.get("message"):
            row["message"] = s["message"]
        d = s.get("diagnostics") or {}
        if "volume_change_mm3" in d:
            row["volume_change_mm3"] = _r(d["volume_change_mm3"])
        timeline.append(row)
    out = {"kind": "part", "name": part_doc.get("name"), "units": part_doc.get("units", "mm"),
           "rebuilt": rep["rebuilt"], "clean": rep["clean"],
           "errors": [{"id": e["id"], "message": e.get("message")} for e in rep["errors"]],
           "warnings": rep["warnings"], "timeline": timeline,
           "body": _body(st.part, part_doc.get("material"))}
    if part_doc.get("rollback") is not None:
        out["rollback_at"] = part_doc["rollback"]
    from . import params
    if params.has_equations(part_doc):
        out["parameters"] = params.table(part_doc)
        out["equations"] = params.equations(part_doc)
    if sketches:
        out["sketches"], note = _sketch_rows(part_doc, st)
        if note:
            out["sketch_note"] = note
    return out


def inspect_design(doc: dict, part_id: str | None = None, sketches: bool = True) -> dict:
    """Part: the part's inspect. Assembly: component and mate states, plus each part's inspect
    (sketches only for part_id, to keep the reply small)."""
    if not assembly.is_assembly(doc):
        return inspect_part(doc, sketches)
    parts = doc.get("parts") or {}
    if part_id is not None:
        if part_id not in parts:
            return {"error": f"Unknown part {part_id!r}; parts: {sorted(parts)}."}
        return dict(inspect_part(parts[part_id], sketches), part_id=part_id)
    from .docformat import asm_report
    res = assembly.regen_assembly(doc)
    rep = asm_report(doc, res)
    out = {"kind": "assembly", "name": doc.get("name"), "rebuilt": rep["rebuilt"], "clean": rep["clean"],
           "errors": rep["errors"], "warnings": rep["warnings"], "components": rep["components"],
           "mates": rep["mates"],
           "under_defined": [c["id"] for c in rep["components"] if c["state"] not in ("fixed", "full")],
           "parts": {}}
    for pid, p in parts.items():
        info = inspect_part(p, sketches=False)
        out["parts"][pid] = {k: info[k] for k in ("name", "rebuilt", "clean", "errors", "body")}
    return out
