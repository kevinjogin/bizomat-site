"""Feature-tree regeneration with build123d.

A part document is plain JSON (see docs/DOCUMENT.md). `regen(doc)` walks the
feature list in order, the way SOLIDWORKS rebuilds the FeatureManager tree,
and returns the resulting solid plus per-feature status.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Any

from build123d import (
    Axis,
    Compound,
    Edge,
    Face,
    GeomType,
    Location,
    Part,
    Plane,
    Solid,
    Vector,
    Wire,
    extrude,
    mirror,
    offset,
    revolve,
)
from build123d.build_enums import AngularDirection, Until

# SOLIDWORKS convention: Y is up. Front = XY, Top = XZ (normal +Y), Right = YZ (normal +X).
STD_PLANES: dict[str, Plane] = {
    "Front Plane": Plane(origin=(0, 0, 0), x_dir=(1, 0, 0), z_dir=(0, 0, 1)),
    "Top Plane": Plane(origin=(0, 0, 0), x_dir=(1, 0, 0), z_dir=(0, 1, 0)),
    "Right Plane": Plane(origin=(0, 0, 0), x_dir=(0, 0, -1), z_dir=(1, 0, 0)),
}

FEATURE_TYPES = (
    "sketch", "plane", "extrude", "revolve", "fillet", "chamfer", "shell",
    "mirror", "linear_pattern", "circular_pattern", "import", "standard",
)


class FeatureError(Exception):
    pass


@dataclass
class RegenState:
    part: Any = None                      # current solid (Part/Solid/Compound) or None
    planes: dict = field(default_factory=dict)   # feature id -> Plane (sketches and ref planes)
    profiles: dict = field(default_factory=dict) # sketch id -> list[Face]
    sketch_edges: dict = field(default_factory=dict)  # sketch id -> {entity id: Edge}
    tools: dict = field(default_factory=dict)    # feature id -> (tool solid, op)
    status: list = field(default_factory=list)
    diagnostics: dict = field(default_factory=dict)  # feature id -> measured geometry + warnings


# ----------------------------------------------------------------------------- helpers

def v3(p) -> Vector:
    return Vector(float(p[0]), float(p[1]), float(p[2]))


def vlist(v: Vector) -> list[float]:
    return [round(v.X, 9), round(v.Y, 9), round(v.Z, 9)]


def plane_dict(pl: Plane) -> dict:
    return {
        "origin": vlist(pl.origin), "xdir": vlist(pl.x_dir),
        "ydir": vlist(pl.y_dir), "normal": vlist(pl.z_dir),
    }


def solid_of(part):
    if part is None:
        return None
    if isinstance(part, (Part, Compound)):
        solids = part.solids()
        if not solids:
            return None
        return part if len(solids) > 1 else solids[0]
    return part


def scale_of(part) -> float:
    if part is None:
        return 100.0
    bb = part.bounding_box()
    return max(bb.diagonal, 1.0)


# ----------------------------------------------------------------------------- planes

def resolve_plane(spec: dict, st: RegenState, diagnostics: dict | None = None) -> Plane:
    """Resolve a datum, fixed coordinate plane, or face attachment (which follows edits)."""
    if spec is None:
        raise FeatureError("No sketch plane")
    ref = spec.get("ref")
    if ref:
        if ref in STD_PLANES:
            pl = STD_PLANES[ref]
        elif ref in st.planes:
            pl = st.planes[ref]
        else:
            raise FeatureError(f"Plane reference '{ref}' not found")
        if diagnostics is not None:
            diagnostics.update(requested_plane=dict(spec), resolved_plane=plane_dict(pl))
        return pl
    mode = spec.get("type", "fixed")
    if mode not in ("face", "fixed"):
        raise FeatureError(f"Unknown plane type '{mode}'; use 'face' or 'fixed'")
    o, n, x = v3(spec["origin"]), v3(spec["normal"]).normalized(), v3(spec["xdir"]).normalized()
    requested_origin = o
    best = None
    if mode == "face" and st.part is not None:
        # Re-find the face: same normal, nearest to the stored origin. Follows depth changes.
        best, bestd = None, None
        for f in st.part.faces():
            if f.geom_type != GeomType.PLANE:
                continue
            fn = f.normal_at()
            if fn.dot(n) < 0.9999:
                continue
            d = f.distance_to(o)
            if bestd is None or d < bestd:
                best, bestd = f, d
        if best is not None:
            o = o + n * (best.center() - o).dot(n)
    pl = Plane(origin=o, x_dir=x, z_dir=n)
    if diagnostics is not None:
        diagnostics.update(requested_plane=dict(spec), resolved_plane=plane_dict(pl))
        shift = (o - requested_origin).length
        diagnostics["plane_resolution"] = {"mode": mode, "shift_mm": round(shift, 9)}
        if mode == "face":
            diagnostics["plane_resolution"]["matched_face"] = best is not None
            if best is None:
                diagnostics.setdefault("warnings", []).append({
                    "code": "face_plane_unmatched",
                    "message": "No face matches the requested plane normal; using its stored coordinates.",
                })
            elif shift > 1e-6:
                diagnostics.setdefault("warnings", []).append({
                    "code": "face_plane_moved",
                    "message": (f"Face attachment moved the sketch plane {shift:.6g} mm from "
                                f"{vlist(requested_origin)} to {vlist(o)}. Use a fixed plane for an exact coordinate."),
                })
    return pl


def plane_feature(feat: dict, st: RegenState, diagnostics: dict | None = None) -> Plane:
    base = resolve_plane(feat.get("base") or {"ref": "Front Plane"}, st, diagnostics)
    off = float(feat.get("offset", 0.0)) * (-1 if feat.get("flip") else 1)
    pl = Plane(origin=base.origin + base.z_dir * off, x_dir=base.x_dir, z_dir=base.z_dir)
    if feat.get("flip"):
        pl = Plane(origin=pl.origin, x_dir=pl.x_dir, z_dir=-pl.z_dir)
    if diagnostics is not None:
        diagnostics["resolved_base_plane"] = diagnostics["resolved_plane"]
        diagnostics["resolved_plane"] = plane_dict(pl)
    return pl


# ----------------------------------------------------------------------------- sketches

def sketch_geometry(feat: dict, pl: Plane, include_construction=False):
    """Build 3D edges for every sketch entity. Returns {entity id: Edge}."""
    ents = feat.get("entities", [])
    pts = {e["id"]: (float(e["x"]), float(e["y"])) for e in ents if e["type"] == "point"}
    pts["origin"] = (0.0, 0.0)

    def P(pid):
        if pid not in pts:
            raise FeatureError(f"Sketch point '{pid}' missing")
        return pl.from_local_coords(pts[pid])

    edges = {}
    for e in ents:
        t = e["type"]
        if t == "point":
            continue
        if e.get("construction") and not include_construction:
            continue
        if t == "line":
            a, b = P(e["p1"]), P(e["p2"])
            if (a - b).length < 1e-9:
                continue
            edges[e["id"]] = Edge.make_line(a, b)
        elif t == "circle":
            c = P(e["center"])
            r = float(e["r"])
            if r <= 1e-9:
                continue
            edges[e["id"]] = Edge.make_circle(r, Plane(origin=c, x_dir=pl.x_dir, z_dir=pl.z_dir))
        elif t == "arc":
            cx, cy = pts[e["center"]]
            sx, sy = pts[e["start"]]
            ex, ey = pts[e["end"]]
            r = math.hypot(sx - cx, sy - cy)
            if r <= 1e-9:
                continue
            a0 = math.degrees(math.atan2(sy - cy, sx - cx))
            a1 = math.degrees(math.atan2(ey - cy, ex - cx))
            if a1 <= a0 + 1e-9:
                a1 += 360.0
            c3 = pl.from_local_coords((cx, cy))
            edges[e["id"]] = Edge.make_circle(
                r, Plane(origin=c3, x_dir=pl.x_dir, z_dir=pl.z_dir), a0, a1,
                AngularDirection.COUNTER_CLOCKWISE,
            )
        elif t == "ellipse":
            c = P(e["center"])
            edges[e["id"]] = Edge.make_ellipse(
                float(e["rx"]), float(e["ry"]),
                Plane(origin=c, x_dir=pl.x_dir, z_dir=pl.z_dir).rotated((0, 0, float(e.get("angle", 0)))),
            )
        elif t == "spline":
            ctrl = [P(pid) for pid in e["points"]]
            if len(ctrl) >= 2:
                edges[e["id"]] = Edge.make_spline(ctrl)
    return edges


def sketch_profiles(edges: list[Edge], pl: Plane) -> list[Face]:
    """Closed contours -> faces with holes (even/odd nesting, like SOLIDWORKS contours)."""
    if not edges:
        raise FeatureError("Sketch is empty")
    wires = Wire.combine(edges, tol=1e-6)
    closed = [w for w in wires if w.is_closed]
    if len(closed) != len(wires):
        raise FeatureError("Sketch contains an open contour")
    faces = []
    for w in closed:
        try:
            faces.append(Face(w))
        except Exception as exc:  # self-intersecting etc.
            raise FeatureError(f"Cannot make a region from a contour: {exc}") from exc
    order = sorted(range(len(faces)), key=lambda i: -faces[i].area)
    parent = {}
    for idx, i in enumerate(order):
        probe = closed[i].edges()[0].position_at(0.5)
        for j in reversed(order[:idx]):  # smallest enclosing face first
            if faces[j].is_inside(probe):
                parent[i] = j
                break
    depth = {}

    def d(i):
        if i not in depth:
            depth[i] = 0 if i not in parent else d(parent[i]) + 1
        return depth[i]

    regions = []
    for i in order:
        if d(i) % 2 == 0:
            holes = [closed[k] for k in order if parent.get(k) == i]
            regions.append(Face(closed[i], holes) if holes else faces[i])
    # Orient every region with the sketch normal so extrude direction is predictable.
    out = []
    for f in regions:
        if f.normal_at().dot(pl.z_dir) < 0:
            f = f.reversed() if hasattr(f, "reversed") else -f
        out.append(f)
    return out


# ----------------------------------------------------------------------------- refs

def find_edges(part, refs: list[dict]) -> tuple[list[Edge], int]:
    """Edge refs are {"mid": [x,y,z]} (point at parameter 0.5). Returns matches, missing count."""
    if part is None:
        raise FeatureError("No body to modify")
    edges = part.edges()
    tol = scale_of(part) * 0.02
    found, missing = [], 0
    for r in refs:
        m = v3(r["mid"])
        best, bestd = None, None
        for e in edges:
            dd = (e.position_at(0.5) - m).length
            if bestd is None or dd < bestd:
                best, bestd = e, dd
        if best is not None and bestd <= tol:
            if not any(best.is_same(x) for x in found):
                found.append(best)
        else:
            missing += 1
    return found, missing


def find_faces(part, refs: list[dict]) -> tuple[list[Face], int]:
    if part is None:
        raise FeatureError("No body to modify")
    faces = part.faces()
    tol = scale_of(part) * 0.05
    found, missing = [], 0
    for r in refs:
        c = v3(r["center"])
        n = v3(r["normal"]) if r.get("normal") else None
        best, bestd = None, None
        for f in faces:
            if n is not None:
                try:
                    if f.normal_at(f.center()).dot(n) < 0.99:
                        continue
                except Exception:
                    continue
            dd = (f.center() - c).length
            if bestd is None or dd < bestd:
                best, bestd = f, dd
        if best is not None and bestd <= tol:
            found.append(best)
        else:
            missing += 1
    return found, missing


# ----------------------------------------------------------------------------- operations

def apply_op(part, tool, op: str, merge=True):
    if op == "cut":
        if part is None:
            raise FeatureError("Nothing to cut: create a boss first")
        res = part - tool
    else:
        if part is None:
            res = tool
        elif merge:
            res = part + tool
        else:
            res = Compound(children=[*part.solids(), *tool.solids()])
    if res is None or not res.solids():
        raise FeatureError("The operation removed the whole body")
    return solid_of(res)


def extrude_tool(feat: dict, st: RegenState):
    sk = feat.get("sketch")
    if sk not in st.profiles:
        raise FeatureError("Select a sketch to extrude")
    faces = st.profiles[sk]
    if isinstance(faces, FeatureError):
        raise faces
    pl = st.planes[sk]
    normal = pl.z_dir * (-1 if feat.get("reverse") else 1)
    big = scale_of(st.part) * 4 + 1000

    def one(direction, end, depth, draft):
        if end == "through_all":
            depth = big
        if depth is None or depth <= 0:
            raise FeatureError("Depth must be greater than 0")
        taper = float(draft or 0) * (-1 if feat.get("draft_outward") else 1)
        if end == "midplane":
            return extrude(faces, amount=depth / 2, dir=direction, both=True, taper=taper)
        if end == "up_to_next" and st.part is not None:
            return extrude(faces, dir=direction, until=Until.NEXT, target=st.part)
        return extrude(faces, amount=depth, dir=direction, taper=taper)

    end = feat.get("end", "blind")
    tool = one(normal, end, float(feat.get("depth", 10)), feat.get("draft", 0))
    d2 = feat.get("dir2")
    if d2 and end != "midplane":
        tool = tool + one(-normal, d2.get("end", "blind"), float(d2.get("depth", 10)), d2.get("draft", 0))
    if feat.get("op") == "cut" and feat.get("flip_side"):
        bb = st.part.bounding_box()
        tool = (Solid.make_box(bb.size.X + 2, bb.size.Y + 2, bb.size.Z + 2)
                .locate(Location(bb.min - Vector(1, 1, 1))) - tool)
    return tool


def revolve_tool(feat: dict, st: RegenState):
    sk = feat.get("sketch")
    if sk not in st.profiles:
        raise FeatureError("Select a sketch to revolve")
    faces = st.profiles[sk]
    if isinstance(faces, FeatureError):
        raise faces
    axis_id = feat.get("axis")
    ed = st.sketch_edges.get(sk, {}).get(axis_id)
    if ed is None or ed.geom_type != GeomType.LINE:
        raise FeatureError("Select a line or centerline as the axis of revolution")
    p0, p1 = ed.position_at(0), ed.position_at(1)
    d = (p1 - p0).normalized() * (-1 if feat.get("reverse") else 1)
    axis = Axis(p0, d)
    ang = float(feat.get("angle", 360))
    if not 0 < ang <= 360:
        raise FeatureError("Angle must be between 0 and 360 degrees")
    if feat.get("end") == "midplane" and ang < 360:
        faces = [f.rotate(axis, -ang / 2) for f in faces]
    return revolve(faces, axis=axis, revolution_arc=ang)


def pattern_seed_tools(feat: dict, st: RegenState):
    seeds = []
    for fid in feat.get("features", []):
        if fid not in st.tools:
            raise FeatureError(f"Feature '{fid}' cannot be patterned")
        seeds.append(st.tools[fid])
    if not seeds:
        raise FeatureError("Select features to pattern")
    return seeds


def direction_of(spec, st: RegenState) -> Vector:
    """Direction spec: "X"/"Y"/"Z", {"edge": {"mid": [...]}} or {"vector": [...]}."""
    if isinstance(spec, str):
        return {"X": Vector(1, 0, 0), "Y": Vector(0, 1, 0), "Z": Vector(0, 0, 1)}[spec.upper()]
    if isinstance(spec, dict) and "vector" in spec:
        return v3(spec["vector"]).normalized()
    if isinstance(spec, dict) and "edge" in spec:
        es, _ = find_edges(st.part, [spec["edge"]])
        if es and es[0].geom_type == GeomType.LINE:
            return (es[0].position_at(1) - es[0].position_at(0)).normalized()
    raise FeatureError("Select a linear edge or axis for the direction")


# ----------------------------------------------------------------------------- regen

def _regen_feature(feat: dict, st: RegenState):
    t = feat["type"]
    diagnostics = st.diagnostics[feat["id"]]
    if t in ("import", "standard"):
        from . import importer
        body = importer.decode_shape(feat["data"]) if t == "import" else importer.build_standard(feat)
        st.tools[feat["id"]] = (body, "boss")
        st.part = apply_op(st.part, body, "boss")
        return body
    if t == "plane":
        st.planes[feat["id"]] = plane_feature(feat, st, diagnostics)
        return None
    if t == "sketch":
        pl = resolve_plane(feat.get("plane"), st, diagnostics)
        st.planes[feat["id"]] = pl
        st.sketch_edges[feat["id"]] = sketch_geometry(feat, pl, include_construction=True)
        prof_edges = list(sketch_geometry(feat, pl).values())
        try:
            st.profiles[feat["id"]] = sketch_profiles(prof_edges, pl) if prof_edges else FeatureError("Sketch is empty")
        except FeatureError as exc:
            st.profiles[feat["id"]] = exc  # only an error if a feature consumes it
        return None
    if t in ("extrude", "revolve"):
        tool = extrude_tool(feat, st) if t == "extrude" else revolve_tool(feat, st)
        op = feat.get("op", "boss")
        st.tools[feat["id"]] = (tool, op)
        st.part = apply_op(st.part, tool, op, feat.get("merge", True))
        return tool
    if t == "fillet":
        edges, missing = find_edges(st.part, feat.get("edges", []))
        if not edges:
            raise FeatureError("Select edges to fillet")
        r = float(feat.get("radius", 1))
        try:
            st.part = solid_of(st.part.fillet(r, edges))
        except Exception as exc:
            raise FeatureError(f"Failed to create fillet (radius {r} too large?)") from exc
        return f"{missing} edge reference(s) missing" if missing else None
    if t == "chamfer":
        edges, missing = find_edges(st.part, feat.get("edges", []))
        if not edges:
            raise FeatureError("Select edges to chamfer")
        d1 = float(feat.get("distance", 1))
        d2 = feat.get("distance2")
        if feat.get("mode") == "angle_distance":
            d2 = d1 * math.tan(math.radians(float(feat.get("angle", 45))))
        try:
            st.part = solid_of(st.part.chamfer(d1, float(d2) if d2 else None, edges))
        except Exception as exc:
            raise FeatureError("Failed to create chamfer") from exc
        return f"{missing} edge reference(s) missing" if missing else None
    if t == "shell":
        faces, missing = find_faces(st.part, feat.get("faces", []))
        th = float(feat.get("thickness", 1))
        try:
            amt = th if feat.get("outward") else -th
            st.part = solid_of(offset(st.part, amount=amt, openings=faces))
        except Exception as exc:
            raise FeatureError("Failed to shell the body (thickness too large?)") from exc
        return f"{missing} face reference(s) missing" if missing else None
    if t == "mirror":
        pl = resolve_plane(feat.get("plane"), st, diagnostics)
        if feat.get("features"):
            for tool, op in pattern_seed_tools(feat, st):
                st.part = apply_op(st.part, mirror(tool, about=pl), op)
        else:
            if st.part is None:
                raise FeatureError("No body to mirror")
            st.part = apply_op(st.part, mirror(st.part, about=pl), "boss")
        return None
    if t == "linear_pattern":
        seeds = pattern_seed_tools(feat, st)
        d = direction_of(feat.get("direction", "X"), st) * (-1 if feat.get("reverse") else 1)
        n, sp = int(feat.get("count", 2)), float(feat.get("spacing", 10))
        d2 = feat.get("direction2")
        n2, sp2 = int(feat.get("count2", 1)), float(feat.get("spacing2", 10))
        dv2 = direction_of(d2, st) if d2 else None
        for i in range(n):
            for j in range(n2 if dv2 is not None else 1):
                if i == 0 and j == 0:
                    continue
                off = d * (sp * i) + (dv2 * (sp2 * j) if dv2 is not None else Vector())
                for tool, op in seeds:
                    st.part = apply_op(st.part, tool.moved(Location(off)), op)
        return None
    if t == "circular_pattern":
        seeds = pattern_seed_tools(feat, st)
        ax = feat.get("axis", "Y")
        if isinstance(ax, str):
            axis = {"X": Axis.X, "Y": Axis.Y, "Z": Axis.Z}[ax.upper()]
        else:
            axis = Axis(v3(ax["origin"]), v3(ax["dir"]))
        n = int(feat.get("count", 4))
        total = float(feat.get("angle", 360))
        step = total / n if feat.get("equal_spacing", True) and abs(total - 360) < 1e-9 else (
            total / max(n - 1, 1) if feat.get("equal_spacing", True) else float(feat.get("step", 90)))
        for i in range(1, n):
            for tool, op in seeds:
                st.part = apply_op(st.part, tool.rotate(axis, step * i), op)
        return None
    raise FeatureError(f"Unknown feature type '{t}'")


def shape_bounds(shape) -> list | None:
    if shape is None:
        return None
    bb = shape.bounding_box()
    return [vlist(bb.min), vlist(bb.max)]


def regen_feature(feat: dict, st: RegenState):
    """Build one feature, preserving its tool return value and recording measured diagnostics."""
    diagnostics = st.diagnostics[feat["id"]] = {}
    before = st.part
    before_volume = before.volume if before is not None else 0.0
    result = _regen_feature(feat, st)
    diagnostics["result_bbox"] = shape_bounds(st.part)
    if feat["type"] not in ("sketch", "plane") and st.part is not None:
        delta = st.part.volume - before_volume
        diagnostics["volume_change_mm3"] = round(delta, 9)
    if feat["id"] in st.tools:
        tool, op = st.tools[feat["id"]]
        diagnostics["tool_bbox"] = shape_bounds(tool)
        diagnostics["tool_volume_mm3"] = round(tool.volume, 9)
        if feat["type"] in ("extrude", "revolve"):
            diagnostics["resolved_plane"] = plane_dict(st.planes[feat["sketch"]])
            tolerance = max(1e-7, abs(before_volume) * 1e-10)
            if before is not None and abs(delta) <= tolerance and (op == "cut" or feat.get("merge", True)):
                diagnostics.setdefault("warnings", []).append({
                    "code": "no_material_removed" if op == "cut" else "no_material_added",
                    "message": ("Cut removed no material; check its plane, direction and depth." if op == "cut"
                                else "Merged boss added no material; its tool may be buried inside the existing body."),
                })
        if feat["type"] == "extrude":
            pl = st.planes[feat["sketch"]]
            bb = pl.to_local_coords(tool).bounding_box()
            diagnostics["extrusion"] = {
                "end": feat.get("end", "blind"), "requested_depth_mm": float(feat.get("depth", 10)),
                "reverse": bool(feat.get("reverse")),
                "normal_range_mm": [round(bb.min.Z, 9), round(bb.max.Z, 9)],
            }
            if feat.get("dir2"):
                diagnostics["extrusion"]["direction2"] = dict(feat["dir2"])
    return result


def rebuild_feature(feat: dict, st: RegenState) -> tuple[Any, dict]:
    """Shared full/live rebuild path: warnings do not turn valid geometry into an error."""
    result, error = None, None
    try:
        result = regen_feature(feat, st)
    except FeatureError as exc:
        error = str(exc)
    except Exception as exc:
        error = f"Rebuild error: {exc}"
    diagnostics = st.diagnostics.get(feat["id"], {})
    warnings = list(diagnostics.get("warnings", []))
    if isinstance(result, str):
        warnings.append({"code": "missing_reference", "message": result})
    status = {"id": feat["id"], "state": "error" if error else "warning" if warnings else "ok",
              "diagnostics": {k: v for k, v in diagnostics.items() if k != "warnings"}}
    if warnings:
        status["warnings"] = warnings
    if error or warnings:
        status["message"] = error or " ".join(w["message"] for w in warnings)
    st.status.append(status)
    return result, status


def regen(doc: dict, preview: dict | None = None) -> tuple[RegenState, Any]:
    """Rebuild the tree up to the rollback bar. With `preview`, the tentative feature is
    evaluated after the rolled-back state and its tool body is returned (not applied)."""
    st = RegenState()
    feats = doc.get("features", [])
    rb = doc.get("rollback")
    stop = len(feats) if rb is None else int(rb)
    if preview is not None and preview.get("_index") is not None:
        stop = min(stop, int(preview["_index"]))
    for i, f in enumerate(feats):
        if i >= stop:
            st.status.append({"id": f["id"], "state": "rolledback"})
            continue
        if f.get("suppressed"):
            st.status.append({"id": f["id"], "state": "suppressed"})
            continue
        rebuild_feature(f, st)
    tool = None
    if preview is not None:
        before = st.part
        tool, status = rebuild_feature({"id": "preview", **preview}, st)
        status["preview"] = True
        if isinstance(tool, str):
            tool = None
        if status["state"] == "error":
            st.part = before
        if preview.get("type") in ("extrude", "revolve"):
            st.part = before  # SOLIDWORKS shows the body as it was plus a yellow tool preview
        elif before is not None and st.part is not None and st.part is not before:
            tool = changed_faces(before, st.part)
            st.part = before
    return st, tool


def changed_faces(before, after):
    """Faces of `after` that do not exist in `before` (used to preview fillets, shells...)."""
    def sig(f):
        if f.geom_type == GeomType.PLANE:
            n = f.normal_at()
            return ("plane", tuple(round(c, 3) for c in vlist(n)), round(n.dot(f.center()), 3))
        return (f.geom_type.name, tuple(round(c, 3) for c in vlist(f.center())), round(f.area, 3))

    old = {sig(f) for f in before.faces()}
    new = [f for f in after.faces() if sig(f) not in old]
    return Compound(children=new) if new else None


# ----------------------------------------------------------------------------- output

def mesh_shape(shape, scale=None) -> dict:
    """Per-face triangles and per-edge polylines, ids are indices into faces()/edges()."""
    if shape is None:
        return {"faces": [], "edges": []}
    scale = scale or scale_of(shape)
    tol = max(scale * 5e-4, 0.005)
    edge_index = {hash(e): i for i, e in enumerate(shape.edges())}
    faces = []
    for i, f in enumerate(shape.faces()):
        try:
            verts, tris = f.tessellate(tol, 0.2)
        except Exception:
            continue
        info = {"id": i, "positions": [c for v in verts for c in (round(v.X, 5), round(v.Y, 5), round(v.Z, 5))],
                "indices": [k for t in tris for k in t], "type": f.geom_type.name.lower(),
                "center": vlist(f.center()), "area": f.area,
                "edges": [edge_index[hash(e)] for e in f.edges() if hash(e) in edge_index]}
        if f.geom_type == GeomType.PLANE:
            pl = Plane(f)
            info["plane"] = plane_dict(Plane(origin=f.center(), x_dir=pl.x_dir, z_dir=f.normal_at()))
            info["normal"] = vlist(f.normal_at())
        elif f.geom_type in (GeomType.CYLINDER, GeomType.CONE):
            try:
                ax = f.axis_of_rotation
                info["axis"] = {"point": vlist(ax.position), "dir": vlist(ax.direction)}
                if f.geom_type == GeomType.CYLINDER:
                    info["radius"] = round(f.radius, 6)
            except Exception:
                pass
        faces.append(info)
    edges = []
    for i, e in enumerate(shape.edges()):
        n = 2 if e.geom_type == GeomType.LINE else max(8, min(96, int(e.length / max(tol * 20, 1e-3)) + 8))
        pts = [e.position_at(k / (n - 1)) for k in range(n)]
        edges.append({"id": i, "points": [c for p in pts for c in (round(p.X, 5), round(p.Y, 5), round(p.Z, 5))],
                      "mid": vlist(e.position_at(0.5)), "type": e.geom_type.name.lower(),
                      "length": e.length})
    return {"faces": faces, "edges": edges}


def regen_result(doc: dict, preview: dict | None = None) -> dict:
    st, tool = regen(doc, preview)
    part = st.part
    out = {
        "status": st.status,
        "body": mesh_shape(part),
        "planes": {k: plane_dict(v) for k, v in st.planes.items()},
        "tool": mesh_shape(tool, scale_of(part) if part is not None else None) if tool is not None else None,
    }
    if part is not None:
        bb = part.bounding_box()
        out["bbox"] = [vlist(bb.min), vlist(bb.max)]
    return out


def mass_properties(doc: dict) -> dict:
    st, _ = regen(doc)
    part = st.part
    if part is None:
        return {"error": "No solid body"}
    density = float(doc.get("material", {}).get("density", 1.0e-6) or 0)  # kg/mm^3
    vol = part.volume
    from build123d import CenterOf
    com = part.center(CenterOf.MASS)
    bb = part.bounding_box()
    return {
        "volume": vol, "area": part.area, "mass": vol * density, "density": density,
        "center_of_mass": vlist(com), "bbox": [vlist(bb.min), vlist(bb.max)],
        "bodies": len(part.solids()),
    }


def export(doc: dict, fmt: str, path: str) -> None:
    from build123d import export_step, export_stl
    st, _ = regen(doc)
    if st.part is None:
        raise FeatureError("No solid body to export")
    if fmt == "step":
        export_step(st.part, path)
    elif fmt == "stl":
        export_stl(st.part, path)
    else:
        raise FeatureError(f"Unknown export format {fmt}")
