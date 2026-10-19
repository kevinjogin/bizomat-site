"""Feature-tree regeneration with build123d.

A part document is plain JSON (see docs/DOCUMENT.md). `regen(doc)` walks the
feature list in order, the way SOLIDWORKS rebuilds the FeatureManager tree,
and returns the resulting solid plus per-feature status.
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import threading
from collections import OrderedDict
from dataclasses import dataclass, field
from typing import Any

from build123d import (
    Axis,
    Compound,
    Edge,
    Face,
    GeomType,
    Kind,
    Location,
    Part,
    Plane,
    Solid,
    Vector,
    Wire,
    extrude,
    loft,
    mirror,
    offset,
    revolve,
    sweep,
)
from build123d.build_enums import AngularDirection, Until
from OCP.BRep import BRep_Tool
from OCP.BRepAdaptor import BRepAdaptor_Curve
from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.TopAbs import TopAbs_Orientation
from OCP.TopLoc import TopLoc_Location

# SOLIDWORKS convention: Y is up. Front = XY, Top = XZ (normal +Y), Right = YZ (normal +X).
STD_PLANES: dict[str, Plane] = {
    "Front Plane": Plane(origin=(0, 0, 0), x_dir=(1, 0, 0), z_dir=(0, 0, 1)),
    "Top Plane": Plane(origin=(0, 0, 0), x_dir=(1, 0, 0), z_dir=(0, 1, 0)),
    "Right Plane": Plane(origin=(0, 0, 0), x_dir=(0, 0, -1), z_dir=(1, 0, 0)),
}

FEATURE_TYPES = (
    "sketch", "plane", "extrude", "revolve", "fillet", "chamfer", "shell",
    "mirror", "linear_pattern", "circular_pattern", "import", "standard", "sweep", "loft", "hole",
)


class FeatureError(Exception):
    pass


@dataclass
class RegenState:
    part: Any = None                      # current solid (Part/Solid/Compound) or None
    planes: dict = field(default_factory=dict)   # feature id -> Plane (sketches and ref planes)
    profiles: dict = field(default_factory=dict) # sketch id -> list[Face]
    sketch_edges: dict = field(default_factory=dict)  # sketch id -> {entity id: Edge}
    path_edges: dict = field(default_factory=dict)    # sketch id -> non-construction edges
    tools: dict = field(default_factory=dict)    # feature id -> (tool solid, op)
    status: list = field(default_factory=list)
    diagnostics: dict = field(default_factory=dict)  # feature id -> measured geometry + warnings
    params: dict | None = None  # params.evaluate report when the part has variables or equations
    evaluated: dict | None = None  # the part with equation results, when params is set
    instances: dict = field(default_factory=dict)  # pattern/mirror id -> [(moved tool, op, seed id, label)]
    namer: Any = None  # naming.Namer: persistent face and edge names, worked out on request
    measured: tuple | None = None  # (body, its volume): the last volume worked out, so the next feature reuses it


# ----------------------------------------------------------------------------- helpers

def param(feat: dict, name: str, fallback=None):
    """A feature's value, or what the registry says a document that leaves it out means (Param.omitted, else
    Param.default): the numbers older files were always built with, so they never change shape on reopen.
    New features are written with every value (features.with_defaults)."""
    v = feat.get(name)
    if v is not None:
        return v
    from . import features as registry
    d = registry.left_out(feat.get("type"), name)
    return fallback if d is None else d


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


BIG_BODY_FACES = 150  # above this, bounding boxes come from OpenCascade's fast box (the exact one took 0.5 s on a
                      # 274-face imported plate, and a rebuild asks for several per feature)


def bbox(shape):
    """The shape's bounding box: exact for ordinary parts, the fast (slightly looser) box for large bodies."""
    try:
        big = len(shape.faces()) > BIG_BODY_FACES
    except Exception:
        big = False
    return shape.bounding_box(optimal=not big)


def scale_of(part) -> float:
    if part is None:
        return 100.0
    bb = bbox(part)
    return max(bb.diagonal, 1.0)


def face_contains(face, point, tol: float = 1e-6) -> bool:
    """Whether a point, projected onto the face's surface, lands on the face (inside or on its boundary).
    A 2D classifier on the face: much cheaper than Face.is_inside, which builds a 3D solid classifier."""
    from OCP.BRepClass import BRepClass_FaceClassifier
    from OCP.TopAbs import TopAbs_IN, TopAbs_ON
    from OCP.gp import gp_Pnt
    try:
        p = point if isinstance(point, Vector) else v3(point)
        state = BRepClass_FaceClassifier(face.wrapped, gp_Pnt(p.X, p.Y, p.Z), tol).State()
    except Exception:
        return False
    return state in (TopAbs_IN, TopAbs_ON)


def on_face_point(f) -> Vector:
    """A point that is really on the face (a face's centre can sit in a hole or outside a curved face)."""
    try:
        c = f.center()
        if f.geom_type == GeomType.PLANE and face_contains(f, c, 1e-4):
            return c
    except Exception:
        pass
    for u in (0.5, 0.25, 0.75, 0.1, 0.9):
        for v in (0.5, 0.25, 0.75, 0.1, 0.9):
            try:
                p = f.position_at(u, v)
                if face_contains(f, p, 1e-4):
                    return p
            except Exception:
                continue
    return f.edges()[0].position_at(0.5)


SAME_PLANE_MM = 1e-6


def match_face_plane(faces, n: Vector, o: Vector, at: Vector | None = None, level_first: bool = False):
    """The planar face a face attachment (or a mate's plane reference) means, among `faces`, as
    (face, offset along n from o) or (None, None). A face whose plane faces along n and that:
    1. holds the anchor `at` (a point that was on the picked face): the nearest such along n, so it follows a
       face that moved with an edit;
    2. lies at the stored height: keep it there (an unchanged part never moves the plane);
    3. otherwise the nearest along n (in-plane distance is not a measure of "the same face": a raised boss
       away from the origin is far from it in plane, the face below it is not).
    `level_first` tries 2 before 1, for anchors that may not be on the face (a mate reference stored at a
    face's centre, which for a tray rim lies over the pocket)."""
    cands = []
    for f in faces:
        if f.geom_type != GeomType.PLANE:
            continue
        try:
            fn = f.normal_at()
            if fn.dot(n) < 0.9999:
                continue
            cands.append((f, (f.center() - o).dot(n)))
        except Exception:
            continue
    if not cands:
        return None, None
    level = [c for c in cands if abs(c[1]) <= SAME_PLANE_MM]
    if level and level_first:
        return level[0][0], 0.0
    if at is not None:
        holding = [c for c in cands if face_contains(c[0], at)]
        if holding:
            return min(holding, key=lambda c: abs(c[1]))
    if level:
        return level[0][0], 0.0
    best = min(abs(c[1]) for c in cands)
    near = [c for c in cands if abs(c[1]) <= best + SAME_PLANE_MM]
    return next((c for c in near if face_contains(c[0], o)), near[0])


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
        # Re-find the face (match_face_plane): the one holding the stored anchor `at`, else the one at the
        # stored height, else the nearest along the normal. Follows depth changes.
        at = spec.get("at")
        best, off = match_face_plane(st.part.faces(), n, o, v3(at) if at else None)
        if best is not None:
            o = o + n * off
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
    off = float(param(feat, "offset", 0.0)) * (-1 if feat.get("flip") else 1)
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
        if e.get("ref") or (e.get("construction") and not include_construction):
            continue  # "ref": hidden copy of a model edge that On Edge relations attach to
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


UNSOLVED_MM, UNSOLVED_DEG = 1e-3, 1e-3


def unsolved(feat: dict) -> list[str]:
    """Where a sketch's stored points disagree with its dimensions (measured as solver.js measure() does), and
    arcs whose end is off their circle. The browser solves a sketch when it is opened; the server builds what is
    stored, so a sketch written by the AI or a script with points that do not fit its dimensions builds a
    different part than it says."""
    ents = {e.get("id"): e for e in feat.get("entities") or [] if isinstance(e, dict)}

    def pt(pid):
        if pid == "origin":
            return 0.0, 0.0
        e = ents[pid]
        if e.get("type") != "point":
            return pt(e["center"])
        return float(e["x"]), float(e["y"])

    def radius(e):
        if e["type"] == "circle":
            return float(e["r"])
        (cx, cy), (sx, sy) = pt(e["center"]), pt(e["start"])
        return math.hypot(sx - cx, sy - cy)

    def line_dist(q, ln):
        (ax, ay), (bx, by) = pt(ln["p1"]), pt(ln["p2"])
        return abs((q[0] - ax) * (by - ay) - (q[1] - ay) * (bx - ax)) / (math.hypot(bx - ax, by - ay) or 1e-12)

    out = []
    try:
        for e in ents.values():
            if e.get("type") == "arc" and not e.get("ref"):
                (cx, cy), (ex, ey) = pt(e["center"]), pt(e["end"])
                gap = abs(math.hypot(ex - cx, ey - cy) - radius(e))
                if gap > UNSOLVED_MM:
                    out.append(f"arc {e['id']} ends {gap:.4g} mm off its circle")
        for c in feat.get("constraints") or []:
            t = c.get("type") if isinstance(c, dict) else None
            if t not in ("distance", "diameter", "radius", "angle") or c.get("driven") or c.get("value") is None:
                continue
            v, refs, label = float(c["value"]), c.get("refs") or [], c.get("name") or c.get("id")
            get = lambda i: {"type": "point"} if i == "origin" else ents[i]
            if t in ("diameter", "radius"):
                m = radius(ents[refs[0]]) * (2 if t == "diameter" else 1)
            elif t == "angle":
                l1, l2 = ents[refs[0]], ents[refs[1]]
                (a1, b1), (a2, b2) = (pt(l1["p1"]), pt(l1["p2"])), (pt(l2["p1"]), pt(l2["p2"]))
                d1, d2 = (b1[0] - a1[0], b1[1] - a1[1]), (b2[0] - a2[0], b2[1] - a2[1])
                th = abs(math.degrees(math.atan2(d1[0] * d2[1] - d1[1] * d2[0], d1[0] * d2[0] + d1[1] * d2[1])))
                sides = [180 - th] if c.get("supplement") else [th] if c.get("supplement") is False else [th, 180 - th]
                if min(abs(v - s) for s in sides) > UNSOLVED_DEG:
                    out.append(f"{label} is {v:g} deg but the lines are drawn at {th:.6g} deg")
                continue
            else:
                A, B = (refs + [None])[:2]
                if len(refs) == 1 and get(A).get("type") == "line":
                    A, B = get(A)["p1"], get(A)["p2"]
                ea, eb = get(A), get(B)
                if ea.get("type") == "line" and eb.get("type") == "line":
                    m = line_dist(pt(eb["p1"]), ea)
                elif ea.get("type") == "line":
                    m = line_dist(pt(B), ea)
                elif eb.get("type") == "line":
                    m = line_dist(pt(A), eb)
                else:
                    (ax, ay), (bx, by) = pt(A), pt(B)
                    o = c.get("orient")
                    m = abs(bx - ax) if o == "horizontal" else abs(by - ay) if o == "vertical" else math.hypot(bx - ax, by - ay)
            if abs(m - v) > max(UNSOLVED_MM, 1e-9 * abs(v)):
                out.append(f"{label} is {v:g} mm but the sketch is drawn at {m:.6g} mm")
    except (KeyError, TypeError, ValueError, IndexError):
        pass  # a broken reference is reported by the solver and the build, not here
    return out


def sketch_profiles(edges: list[Edge], pl: Plane) -> list[Face]:
    """Closed contours -> faces with holes (even/odd nesting, like SOLIDWORKS contours). Contours that cross or
    touch, and lines that split a region (T-junctions), are first turned into the regions they bound
    (_merged_contours): overlapping shapes on one level join (two overlapping circles make a figure-eight, never
    two overlapping solids) and a splitting line keeps the whole region."""
    if not edges:
        raise FeatureError("Sketch is empty")
    wires = Wire.combine(edges, tol=1e-6)
    closed = [w for w in wires if w.is_closed]
    if len(closed) != len(wires) or _contours_touch(closed):
        closed = _merged_contours(edges, pl)
    faces = []
    for w in closed:
        try:
            faces.append(Face(w))
        except Exception as exc:  # self-intersecting etc.
            raise FeatureError(f"Cannot make a region from a contour: {exc}") from exc
    order = sorted(range(len(faces)), key=lambda i: -faces[i].area)
    # Nesting: the smallest earlier (larger) contour whose box holds this one's box and whose face holds a point
    # of it. Boxes first, so sibling holes in a grid are never classified against each other.
    boxes = [_box2(w, pl) for w in closed]
    parent = {}
    for idx, i in enumerate(order):
        probe = closed[i].edges()[0].position_at(0.5)
        for j in reversed(order[:idx]):  # smallest enclosing face first
            if _box_holds(boxes[j], boxes[i]) and face_contains(faces[j], probe):
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


def _box2(shape, pl: Plane):
    """(xmin, ymin, xmax, ymax) of a planar shape in the sketch plane's coordinates."""
    bb = pl.to_local_coords(shape).bounding_box()
    return (bb.min.X, bb.min.Y, bb.max.X, bb.max.Y)


def _box_holds(a, b, tol: float = 1e-6) -> bool:
    return a[0] <= b[0] + tol and a[1] <= b[1] + tol and a[2] >= b[2] - tol and a[3] >= b[3] - tol


def _contours_touch(closed: list) -> bool:
    """Whether any two closed contours cross or touch (boxes first, then the exact distance)."""
    if len(closed) < 2:
        return False
    import numpy as np
    from OCP.BRepExtrema import BRepExtrema_DistShapeShape
    boxes = []
    for w in closed:
        bb = w.bounding_box()
        boxes.append((bb.min.X, bb.min.Y, bb.min.Z, bb.max.X, bb.max.Y, bb.max.Z))
    b = np.array(boxes)
    tol = 1e-6
    lo, hi = b[:, :3], b[:, 3:]
    meet = np.all((lo[:, None, :] <= hi[None, :, :] + tol) & (lo[None, :, :] <= hi[:, None, :] + tol), axis=2)
    for i, j in zip(*np.nonzero(np.triu(meet, 1))):
        dist = BRepExtrema_DistShapeShape(closed[i].wrapped, closed[j].wrapped)
        dist.Perform()
        if dist.IsDone() and dist.Value() <= 1e-6:
            return True
    return False


def _merged_contours(edges: list[Edge], pl: Plane) -> list:
    """Closed contours that no longer touch one another, from sketch curves that cross, touch, branch or meet in
    T-junctions. The curves are split where they meet; curves with a free end are an open contour (an error
    that says where); each connected group that is a single loop stays that loop, and a group with branches
    becomes the outline of every region it encloses."""
    from OCP.BOPAlgo import BOPAlgo_Builder
    if len(edges) > 1:
        gf = BOPAlgo_Builder()
        for e in edges:
            gf.AddArgument(e.wrapped)
        gf.SetRunParallel(False)
        gf.Perform()
        if gf.HasErrors():
            raise FeatureError("Sketch curves cross in a way that cannot be resolved")
        split = Compound(gf.Shape()).edges()
    else:
        split = list(edges)
    ends: dict[int, list] = {}   # vertex -> edges that end there (a closed curve counts twice)
    where: dict[int, Vector] = {}
    for k, e in enumerate(split):
        for v in (e.vertices() if not e.is_closed else e.vertices() * 2):
            ends.setdefault(hash(v), []).append(k)
            where[hash(v)] = Vector(v.X, v.Y, v.Z)
    free = [h for h, ks in ends.items() if len(ks) == 1]
    if free:
        p = pl.to_local_coords(where[free[0]])
        raise FeatureError(f"Sketch contains an open contour: the curve ending at ({p.X:.6g}, {p.Y:.6g}) "
                           "is not connected to anything")
    # connected groups of curves
    group = list(range(len(split)))

    def root(k):
        while group[k] != k:
            group[k] = group[group[k]]
            k = group[k]
        return k

    for ks in ends.values():
        for k in ks[1:]:
            group[root(k)] = root(ks[0])
    groups: dict[int, list] = {}
    for k in range(len(split)):
        groups.setdefault(root(k), []).append(k)
    out = []
    for ks in groups.values():
        es = [split[k] for k in ks]
        verts = {hash(v) for k in ks for v in split[k].vertices()}
        if all(len(ends[h]) == 2 for h in verts):  # one simple loop
            ws = Wire.combine(es, tol=1e-6)
            if len(ws) == 1 and ws[0].is_closed:
                out.append(ws[0])
                continue
        out.extend(f.outer_wire() for f in _enclosed(es, pl))
    return out


def _enclosed(edges: list[Edge], pl: Plane) -> list[Face]:
    """The union of every region a connected group of curves encloses, as faces (no holes)."""
    from OCP.BRepAlgoAPI import BRepAlgoAPI_Splitter
    from build123d.topology.shape_core import List_TopoDS_Shape
    x0, y0, x1, y1 = _box2(Compound(children=edges), pl)
    size = 4 * max(x1 - x0, y1 - y0, 1.0)
    centre = pl.from_local_coords(((x0 + x1) / 2, (y0 + y1) / 2))
    big = Face.make_rect(size, size, Plane(origin=centre, x_dir=pl.x_dir, z_dir=pl.z_dir))
    args, tools = List_TopoDS_Shape(), List_TopoDS_Shape()
    args.Append(big.wrapped)
    for e in edges:
        tools.Append(e.wrapped)
    sp = BRepAlgoAPI_Splitter()
    sp.SetArguments(args)
    sp.SetTools(tools)
    sp.Build()
    inner = [f for f in Compound(sp.Shape()).faces() if _box_holds(_box2(big, pl), _box2(f, pl), -1e-6)]
    if not inner:
        raise FeatureError("Sketch curves meet but enclose no region")
    merged = inner[0].fuse(*inner[1:]) if len(inner) > 1 else inner[0]
    return list(merged.faces())


# ----------------------------------------------------------------------------- refs

def _by_name(namer, part, ref: dict, kind: str):
    """Shapes a ref's persistent name points at (naming.py), or None when it has no name or no match."""
    name = ref.get("name") if isinstance(ref, dict) else None
    if not name or namer is None:
        return None
    try:
        hit = namer.resolve_edges(part, name) if kind == "edge" else namer.resolve_faces(part, name)
    except Exception:
        hit = []
    if not hit:
        namer.notes.append(f"No {kind} named {name!r}; used its position instead." if ref.get("mid" if kind == "edge" else "center")
                           else f"No {kind} named {name!r}.")
        return None
    return hit


def find_edges(part, refs: list[dict], namer=None) -> tuple[list[Edge], int]:
    """Edge refs are {"name": persistent name} and/or {"mid": [x,y,z]} (point at parameter 0.5). The name is
    tried first (it survives upstream edits), the midpoint second. Returns matches, missing count."""
    if part is None:
        raise FeatureError("No body to modify")
    edges = part.edges()
    tol = scale_of(part) * 0.02
    found, missing = [], 0
    for r in refs:
        named = _by_name(namer, part, r, "edge")
        if named:
            for e in named:
                if not any(e.is_same(x) for x in found):
                    found.append(e)
            continue
        if not isinstance(r, dict) or "mid" not in r:
            missing += 1
            continue
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


def find_faces(part, refs: list[dict], namer=None) -> tuple[list[Face], int]:
    """Face refs are {"name": persistent name} and/or {"center": [x,y,z], "normal": [x,y,z]}; name first."""
    if part is None:
        raise FeatureError("No body to modify")
    faces = part.faces()
    tol = scale_of(part) * 0.05
    found, missing = [], 0
    for r in refs:
        named = _by_name(namer, part, r, "face")
        if named:
            found.extend(f for f in named if not any(f.is_same(x) for x in found))
            continue
        if not isinstance(r, dict) or "center" not in r:
            missing += 1
            continue
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
        if end == "up_to_next" and st.part is None:
            raise FeatureError("Up To Next needs an existing body")
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
    tool = one(normal, end, float(param(feat, "depth", 10)), feat.get("draft", 0))
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
    ang = float(param(feat, "angle", 360))
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


def single_profile(sketch, st: RegenState):
    faces = st.profiles.get(sketch)
    if isinstance(faces, FeatureError):
        raise faces
    if not faces or len(faces) != 1:
        raise FeatureError("Select a sketch with one closed profile")
    return faces[0]


def sweep_tool(feat: dict, st: RegenState):
    profile = single_profile(feat.get("sketch"), st)
    path_id = feat.get("path")
    if path_id == feat.get("sketch"):
        raise FeatureError("Select a different sketch for the sweep path")
    # Construction edges are present in sketch_edges for revolve axes; omit them here.
    edges = st.path_edges.get(path_id, [])
    wires = Wire.combine(edges, tol=1e-6) if edges else []
    if len(wires) != 1:
        raise FeatureError("The sweep path must be one connected chain of non-construction edges")
    return sweep(profile, path=wires[0])


def loft_tool(feat: dict, st: RegenState):
    ids = feat.get("profiles", [])
    if len(ids) < 2 or len(set(ids)) != len(ids):
        raise FeatureError("Select at least two different sketches in section order")
    faces = [single_profile(sid, st) for sid in ids]
    if any(f.inner_wires() for f in faces):
        raise FeatureError("Loft sections with inner contours are not supported; loft the outside, then cut the inside")
    return loft(faces, ruled=bool(feat.get("ruled")))


def hole_tool(feat: dict, st: RegenState):
    if st.part is None:
        raise FeatureError("Create a solid body before adding a hole")
    pl = resolve_plane(feat.get("plane"), st)
    origin = pl.origin + pl.x_dir * float(feat.get("x", 0)) + pl.y_dir * float(feat.get("y", 0))
    normal = pl.z_dir * (-1 if feat.get("reverse") else 1)
    axis_plane = Plane(origin=origin, x_dir=pl.x_dir, z_dir=normal)
    diameter = float(feat.get("diameter", 0))
    depth = float(param(feat, "depth", 10))
    if not math.isfinite(diameter) or diameter <= 0:
        raise FeatureError("Hole diameter must be greater than 0")
    if feat.get("end", "blind") == "through_all":
        bb = st.part.bounding_box()
        corners = [Vector(x, y, z) for x in (bb.min.X, bb.max.X)
                   for y in (bb.min.Y, bb.max.Y) for z in (bb.min.Z, bb.max.Z)]
        depth = max((p - origin).dot(normal) for p in corners) + 1
    elif feat.get("end", "blind") != "blind":
        raise FeatureError("Hole end condition must be Blind or Through All")
    if not math.isfinite(depth) or depth <= 0:
        raise FeatureError("Hole depth must be greater than 0; check its direction")
    radius = diameter / 2
    tool = Solid.make_cylinder(radius, depth, axis_plane)
    style = feat.get("style", "simple")
    if style == "counterbore":
        outer = float(feat.get("bore_diameter", 0)) / 2
        recess = float(feat.get("bore_depth", 0))
        if not all(math.isfinite(v) for v in (outer, recess)) or outer <= radius or not 0 < recess <= depth:
            raise FeatureError("Counterbore diameter must exceed the hole diameter and its depth must fit within the hole")
        tool = tool + Solid.make_cylinder(outer, recess, axis_plane)
    elif style == "countersink":
        outer = float(feat.get("sink_diameter", 0)) / 2
        angle = float(param(feat, "sink_angle", 90))
        if not all(math.isfinite(v) for v in (outer, angle)) or outer <= radius or not 0 < angle < 180:
            raise FeatureError("Countersink diameter must exceed the hole diameter; included angle must be between 0 and 180 degrees")
        recess = (outer - radius) / math.tan(math.radians(angle / 2))
        if recess > depth:
            raise FeatureError("Countersink is deeper than the hole")
        tool = tool + Solid.make_cone(outer, radius, recess, axis_plane)
    elif style != "simple":
        raise FeatureError("Unknown hole style")
    common = st.part & tool
    if common is None or common.volume <= 1e-9:
        raise FeatureError("The hole does not intersect the body; check its position and direction")
    return tool


def direction_of(spec, st: RegenState) -> Vector:
    """Direction spec: "X"/"Y"/"Z", {"edge": {"mid": [...]}} or {"vector": [...]}."""
    if isinstance(spec, str):
        return {"X": Vector(1, 0, 0), "Y": Vector(0, 1, 0), "Z": Vector(0, 0, 1)}[spec.upper()]
    if isinstance(spec, dict) and "vector" in spec:
        return v3(spec["vector"]).normalized()
    if isinstance(spec, dict) and "edge" in spec:
        es, _ = find_edges(st.part, [spec["edge"]], st.namer)
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
        off = unsolved(feat)
        if off:
            diagnostics.setdefault("warnings", []).append({
                "code": "sketch_not_solved",
                "message": ("The sketch is built from its stored points, which do not match its dimensions: "
                            + "; ".join(off[:4]) + (f" (and {len(off) - 4} more)" if len(off) > 4 else "")
                            + ". Open the sketch to solve it, or write points that satisfy the dimensions.")})
        st.sketch_edges[feat["id"]] = sketch_geometry(feat, pl, include_construction=True)
        prof_edges = list(sketch_geometry(feat, pl).values())
        st.path_edges[feat["id"]] = prof_edges
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
    if t in ("sweep", "loft", "hole"):
        tool = {"sweep": sweep_tool, "loft": loft_tool, "hole": hole_tool}[t](feat, st)
        if tool is None or not tool.solids() or not tool.is_valid:
            raise FeatureError("The feature did not produce a valid solid")
        op = "cut" if t == "hole" else feat.get("op", "boss")
        after = apply_op(st.part, tool, op, feat.get("merge", True))
        st.tools[feat["id"]] = (tool, op)
        st.part = after
        return tool
    if t == "fillet":
        edges, missing = find_edges(st.part, feat.get("edges", []), st.namer)
        if not edges:
            raise FeatureError("Select edges to fillet")
        r = float(param(feat, "radius", 1))
        try:
            st.part = solid_of(st.part.fillet(r, edges))
        except Exception as exc:
            raise FeatureError(f"Failed to create fillet (radius {r} too large?)") from exc
        return f"{missing} edge reference(s) missing" if missing else None
    if t == "chamfer":
        edges, missing = find_edges(st.part, feat.get("edges", []), st.namer)
        if not edges:
            raise FeatureError("Select edges to chamfer")
        d1 = float(param(feat, "distance", 1))
        d2 = feat.get("distance2")
        if param(feat, "mode") == "angle_distance":
            d2 = d1 * math.tan(math.radians(float(param(feat, "angle", 45))))
        try:
            st.part = solid_of(st.part.chamfer(d1, float(d2) if d2 else None, edges))
        except Exception as exc:
            raise FeatureError("Failed to create chamfer") from exc
        return f"{missing} edge reference(s) missing" if missing else None
    if t == "shell":
        faces, missing = find_faces(st.part, feat.get("faces", []), st.namer)
        th = float(param(feat, "thickness", 1))
        amt = th if feat.get("outward") else -th
        before = st.part.volume
        result = None
        # OpenCascade sometimes fails with one corner join and works with the other, and sometimes hands
        # back the body unchanged without an error: try both, and only accept a body that really changed.
        for kind in (Kind.ARC, Kind.INTERSECTION):
            try:
                r = solid_of(offset(st.part, amount=amt, openings=faces, kind=kind))
            except Exception:
                continue
            if r is not None and abs(r.volume - before) > max(1e-9, 1e-9 * abs(before)):
                result = r
                break
        if result is None:
            raise FeatureError("Failed to shell the body. Try a thinner wall, shelling before the fillets, "
                               "or removing a different face.")
        st.part = result
        return f"{missing} face reference(s) missing" if missing else None
    if t == "mirror":
        pl = resolve_plane(feat.get("plane"), st, diagnostics)
        if feat.get("features"):
            for (tool, op), sid in zip(pattern_seed_tools(feat, st), feat["features"]):
                copy = mirror(tool, about=pl)
                st.instances.setdefault(feat["id"], []).append((copy, op, sid, "m"))
                st.part = apply_op(st.part, copy, op)
        else:
            if st.part is None:
                raise FeatureError("No body to mirror")
            st.part = apply_op(st.part, mirror(st.part, about=pl), "boss")
        return None
    if t == "linear_pattern":
        seeds = pattern_seed_tools(feat, st)
        d = direction_of(feat.get("direction", "X"), st) * (-1 if feat.get("reverse") else 1)
        n, sp = int(param(feat, "count", 2)), float(param(feat, "spacing", 10))
        d2 = feat.get("direction2")
        n2, sp2 = int(param(feat, "count2", 1)), float(param(feat, "spacing2", 10))
        dv2 = direction_of(d2, st) if d2 else None
        _check_instances(n * (n2 if dv2 is not None else 1))
        for (tool, op), sid in zip(seeds, feat["features"]):  # seed by seed, all copies of one in one boolean
            copies = []
            for i in range(n):
                for j in range(n2 if dv2 is not None else 1):
                    if i == 0 and j == 0:
                        continue
                    off = d * (sp * i) + (dv2 * (sp2 * j) if dv2 is not None else Vector())
                    copy = tool.moved(Location(off))
                    st.instances.setdefault(feat["id"], []).append((copy, op, sid, f"{i + 1}" + (f".{j + 1}" if dv2 is not None else "")))
                    copies.append(copy)
            _apply_copies(st, copies, op)
        return None
    if t == "circular_pattern":
        seeds = pattern_seed_tools(feat, st)
        ax = feat.get("axis", "Y")
        if isinstance(ax, str):
            axis = {"X": Axis.X, "Y": Axis.Y, "Z": Axis.Z}[ax.upper()]
        else:
            axis = Axis(v3(ax.get("origin") or (0, 0, 0)), v3(ax["dir"]))
        n = int(param(feat, "count", 4))
        total = float(param(feat, "angle", 360))
        step = total / n if feat.get("equal_spacing", True) and abs(total - 360) < 1e-9 else (
            total / max(n - 1, 1) if feat.get("equal_spacing", True) else float(param(feat, "step", 90)))
        _check_instances(n)
        for (tool, op), sid in zip(seeds, feat["features"]):
            copies = []
            for i in range(1, n):
                copy = tool.rotate(axis, step * i)
                st.instances.setdefault(feat["id"], []).append((copy, op, sid, f"{i + 1}"))
                copies.append(copy)
            _apply_copies(st, copies, op)
        return None
    from . import features as registry
    ft = registry.get(t)
    if ft is not None and ft.build is not None:
        return ft.build(feat, st, diagnostics)
    raise FeatureError(f"Unknown feature type '{t}'")


PATTERN_MAX = 2000  # instances of one pattern feature (a 500 x 500 grid would run for many minutes)


def _check_instances(total: int) -> None:
    if total > PATTERN_MAX:
        raise FeatureError(f"A pattern can make at most {PATTERN_MAX} instances; this one asks for {total}.")


def _apply_copies(st: RegenState, copies: list, op: str) -> None:
    """Every copy of one seed in a single boolean: one cut or fuse with all of them, not one per copy against an
    ever larger body (225 holes: 0.35 s instead of 10 s)."""
    if copies:
        st.part = apply_op(st.part, copies[0] if len(copies) == 1 else Compound(children=copies), op)


def shape_bounds(shape) -> list | None:
    if shape is None:
        return None
    bb = bbox(shape)
    return [vlist(bb.min), vlist(bb.max)]


def _volume(st: RegenState, body) -> float:
    """A body's volume, worked out once: each feature's body before is the last one's after (OpenCascade does
    not keep volumes, and one takes ~0.13 s on a 900-face body)."""
    if st.measured is not None and st.measured[0] is body:
        return st.measured[1]
    v = body.volume
    st.measured = (body, v)
    return v


def regen_feature(feat: dict, st: RegenState):
    """Build one feature, preserving its tool return value and recording measured diagnostics."""
    diagnostics = st.diagnostics[feat["id"]] = {}
    before = st.part
    solid = feat["type"] not in ("sketch", "plane")
    before_volume = _volume(st, before) if solid and before is not None else 0.0
    result = _regen_feature(feat, st)
    diagnostics["result_bbox"] = shape_bounds(st.part)
    if solid and st.part is not None:
        delta = _volume(st, st.part) - before_volume
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
    if st.namer is not None and st.namer.notes:
        warnings.extend({"code": "name_not_found", "message": m} for m in st.namer.notes)
        st.namer.notes.clear()
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
    from . import naming, params
    st = RegenState(namer=naming.Namer())
    if params.has_equations(doc):
        doc, st.params = params.evaluate(doc)  # equations drive the numbers before anything is built
        st.evaluated = doc
    eq_problems = (st.params or {}).get("problems", {})
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
        if f["id"] in eq_problems:
            st.status.append({"id": f["id"], "state": "error", "message": f"Equation: {eq_problems[f['id']]}",
                              "diagnostics": {}})
            continue
        before = st.part
        rebuild_feature(f, st)
        st.namer.record(f, before, st)
    tool = _preview_on(st, preview) if preview is not None else None
    return st, tool


def _preview_on(st: RegenState, preview: dict):
    """Build a tentative feature on a rebuilt state and return what to draw for it; the state's body stays as
    it was (SOLIDWORKS shows the body plus a yellow preview)."""
    before = st.part
    tool, status = rebuild_feature({"id": "preview", **preview}, st)
    status["preview"] = True
    if isinstance(tool, str):
        tool = None
    if status["state"] == "error":
        st.part = before
    if preview.get("type") in ("extrude", "revolve", "sweep", "loft", "hole"):
        st.part = before  # SOLIDWORKS shows the body as it was plus a yellow tool preview
    elif before is not None and st.part is not None and st.part is not before:
        tool = changed_faces(before, st.part)
        st.part = before
    return tool


def _preview_state(doc: dict, preview: dict) -> tuple[RegenState, dict, Any]:
    """(state, body mesh, preview tool) for a PropertyManager preview. The tree above the feature does not change
    while the PropertyManager is open, so it comes from the build cache (the document rolled back to the
    feature) and only the tentative feature is built, on a copy of that state."""
    feats = doc.get("features", [])
    rb = doc.get("rollback")
    stop = len(feats) if rb is None else int(rb)
    if preview.get("_index") is not None:
        stop = min(stop, int(preview["_index"]))
    base, body = built({**doc, "rollback": None if stop >= len(feats) else stop})
    st = RegenState(part=base.part, planes=dict(base.planes), profiles=dict(base.profiles),
                    sketch_edges=dict(base.sketch_edges), path_edges=dict(base.path_edges), tools=dict(base.tools),
                    status=list(base.status), diagnostics=dict(base.diagnostics), params=base.params,
                    evaluated=base.evaluated, instances=dict(base.instances), namer=base.namer, measured=base.measured)
    return st, body, _preview_on(st, preview)


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

MESH_FINE_FACES = 400


def mesh_shape(shape, scale=None) -> dict:
    """Per-face triangles and per-edge polylines, ids are indices into faces()/edges()."""
    if shape is None:
        return {"faces": [], "edges": []}
    scale = scale or scale_of(shape)
    tol = max(scale * 5e-4, 0.005)
    edge_list = shape.edges()
    edge_index = {hash(e): i for i, e in enumerate(edge_list)}
    face_list = shape.faces()
    # Angular deflection: 0.2 rad for ordinary parts; big imported models (hundreds of faces, often many small
    # holes) get 0.35 rad, which halves their triangles and meshing time. Edges are drawn separately and stay smooth.
    angle = 0.2 if len(face_list) < MESH_FINE_FACES else 0.35
    # One mesh pass over the whole shape. Face.tessellate meshes face by face and, because its "already
    # meshed?" check fails for relative deflection, remeshed every face again: 2.5x slower on big parts.
    try:
        BRepMesh_IncrementalMesh(shape.wrapped, tol, True, angle, True)
    except Exception:
        pass
    faces = []
    for i, f in enumerate(face_list):
        tri = _face_triangles(f, tol, angle)
        if tri is None:
            continue
        positions, indices = tri
        info = {"id": i, "positions": positions,
                "indices": indices, "type": f.geom_type.name.lower(),
                "center": vlist(f.center()), "area": f.area,
                "edges": [edge_index[hash(e)] for e in f.edges() if hash(e) in edge_index]}
        if f.geom_type == GeomType.PLANE:
            pl = Plane(f)
            info["plane"] = plane_dict(Plane(origin=f.center(), x_dir=pl.x_dir, z_dir=f.normal_at()))
            info["normal"] = vlist(f.normal_at())
            on = _on_face(positions, indices)
            if on is not None:
                info["point"] = on  # really on the face (its centre can sit in a hole): anchors for sketches and mates
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
    for i, e in enumerate(edge_list):
        length = e.length
        n = 2 if e.geom_type == GeomType.LINE else max(8, min(96, int(length / max(tol * 20, 1e-3)) + 8))
        edges.append({"id": i, "points": _edge_points(e, n), "mid": vlist(e.position_at(0.5)),
                      "type": e.geom_type.name.lower(), "length": length})
    return {"faces": faces, "edges": edges}


def _on_face(positions, indices):
    """The centre of the face's largest triangle: a point inside a planar face, whatever its shape."""
    best, area = None, -1.0
    for k in range(0, min(len(indices), 3 * 64) - 2, 3):  # any real triangle will do; the largest of a few
        a, b, c = (positions[3 * indices[k + j]: 3 * indices[k + j] + 3] for j in range(3))
        u = [b[i] - a[i] for i in range(3)]
        v = [c[i] - a[i] for i in range(3)]
        w = (u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0])
        ar = w[0] * w[0] + w[1] * w[1] + w[2] * w[2]
        if ar > area:
            best, area = (a, b, c), ar
    if best is None:
        return None
    return [round((best[0][i] + best[1][i] + best[2][i]) / 3, 6) for i in range(3)]


def _face_triangles(f, tol, angle=0.2):
    """Flat positions and indices of a face's triangulation (made by mesh_shape's single mesh pass)."""
    loc = TopLoc_Location()
    poly = BRep_Tool.Triangulation_s(f.wrapped, loc)
    if poly is None:
        try:
            verts, tris = f.tessellate(tol, angle)
        except Exception:
            return None
        return ([c for v in verts for c in (round(v.X, 5), round(v.Y, 5), round(v.Z, 5))],
                [k for t in tris for k in t])
    trsf = None if loc.IsIdentity() else loc.Transformation()
    positions = []
    add = positions.extend
    for k in range(1, poly.NbNodes() + 1):
        p = poly.Node(k)
        if trsf is not None:
            p = p.Transformed(trsf)
        add((round(p.X(), 5), round(p.Y(), 5), round(p.Z(), 5)))
    reverse = f.wrapped.Orientation() == TopAbs_Orientation.TopAbs_REVERSED
    indices = []
    add = indices.extend
    for t in poly.Triangles():
        a, b, c = t.Value(1) - 1, t.Value(2) - 1, t.Value(3) - 1
        add((a, c, b) if reverse else (a, b, c))
    return positions, indices


def _edge_points(e, n):
    """n points along an edge, evenly spaced in its curve parameter (by length for lines and arcs)."""
    try:
        curve = BRepAdaptor_Curve(e.wrapped)
        u0, u1 = curve.FirstParameter(), curve.LastParameter()
        out = []
        for k in range(n):
            p = curve.Value(u0 + (u1 - u0) * k / (n - 1))
            out.extend((round(p.X(), 5), round(p.Y(), 5), round(p.Z(), 5)))
        return out
    except Exception:
        pts = [e.position_at(k / (n - 1)) for k in range(n)]
        return [c for p in pts for c in (round(p.X, 5), round(p.Y, 5), round(p.Z, 5))]


# Rebuilt bodies and their meshes, by geometry content. Shared by the part view (/api/regen on a part) and the
# assembly part cache, so opening a part from an assembly, returning to it unchanged, or rebuilding a part that
# was just built (Ctrl+B, undo back to it) does not rebuild and re-mesh it again.
_built: "OrderedDict[str, tuple]" = OrderedDict()
_built_lock = threading.Lock()
BUILT_CACHE_SIZE = 24
# Bounded by size too: an entry keeps the rebuild state (every feature's tool and intermediate bodies) and the mesh
# as Python lists, ~20-30 MB for a 200-face plate, and a Design panel drag adds one per step. 24 such entries took
# a worker past 1 GB on a 2 GB machine.
BUILT_CACHE_MB = float(os.environ.get("OPENSKETCH_BUILT_CACHE_MB", 200))
_built_bytes: dict[str, int] = {}
NOT_GEOMETRY = ("appearance", "name", "description", "designer", "type", "seq", "material")


def _mesh_bytes(mesh: dict) -> int:
    """About what a cache entry holds in memory: its mesh numbers (Python floats in lists, ~40 B each), twice that
    for the rebuild state's bodies and tools (OpenCascade's own memory, not visible from here; measured), and a base."""
    n = sum(len(f.get("positions") or ()) + len(f.get("indices") or ()) for f in mesh.get("faces") or ())
    n += sum(len(e.get("points") or ()) for e in mesh.get("edges") or ())
    return 120 * n + 256 * 1024


def _trim_memory() -> None:
    """Give freed memory back to the system (glibc keeps it otherwise, so a worker never shrinks)."""
    try:
        import ctypes
        ctypes.CDLL("libc.so.6").malloc_trim(0)
    except Exception:
        pass


def body_key(doc: dict) -> str:
    clean = {k: v for k, v in doc.items() if not str(k).startswith("_") and k not in NOT_GEOMETRY}
    if clean.get("rollback") is None:
        clean.pop("rollback", None)
    return hashlib.sha1(json.dumps(clean, sort_keys=True, default=str).encode()).hexdigest()


def built(doc: dict) -> tuple["RegenState", dict]:
    """(regen state, mesh) of a document, cached by content. Callers must not change what they get."""
    key = body_key(doc)
    with _built_lock:
        hit = _built.get(key)
        if hit is not None:
            _built.move_to_end(key)
            return hit
    st, _ = regen(doc)
    out = (st, mesh_shape(st.part))
    budget = BUILT_CACHE_MB * 2**20
    evicted = False
    with _built_lock:
        _built[key] = out
        _built_bytes[key] = _mesh_bytes(out[1])
        while len(_built) > 1 and (len(_built) > BUILT_CACHE_SIZE or sum(_built_bytes.get(k, 0) for k in _built) > budget):
            old, _ = _built.popitem(last=False)
            _built_bytes.pop(old, None)
            evicted = True
    if evicted:
        _trim_memory()
    return out


_last_state: tuple | None = None  # (body key, state) of the latest rebuilt() miss


def rebuilt(doc: dict) -> RegenState:
    """The regen state of a document for read-only use (delete plans, measure, inspect, section previews,
    exports): built()'s cached state when it holds the document, else one rebuild without a mesh, kept for the
    next caller (a check and the export after it share it). Callers must not change what they get."""
    global _last_state
    key = body_key(doc)
    with _built_lock:
        hit = _built.get(key)
    if hit is not None and getattr(hit[0], "namer", None) is not None:
        return hit[0]
    last = _last_state
    if last is not None and last[0] == key:
        return last[1]
    st, _ = regen(doc)
    _last_state = (key, st)
    return st


def regen_result(doc: dict, preview: dict | None = None) -> dict:
    if preview is None:
        st, body = built(doc)
        tool = None
    else:
        st, body, tool = _preview_state(doc, preview)
    part = st.part
    out = {
        "status": st.status,
        "body": body,
        "planes": {k: plane_dict(v) for k, v in st.planes.items()},
        "tool": mesh_shape(tool, scale_of(part) if part is not None else None) if tool is not None else None,
    }
    if part is not None:
        bb = part.bounding_box()
        out["bbox"] = [vlist(bb.min), vlist(bb.max)]
    if st.params and st.params.get("recomputed"):
        # numbers the equations changed: the browser copies these features so it shows what was built
        ids = {r["feature"] for r in st.params["recomputed"]}
        out["equations"] = {"recomputed": st.params["recomputed"],
                            "features": {f["id"]: f for f in st.evaluated.get("features", []) if f["id"] in ids}}
    return out


def mass_properties(doc: dict) -> dict:
    st = rebuilt(doc)
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


def rolled_back(doc: dict) -> dict | None:
    """The first feature below a part's rollback bar as {id, name}, or None when the bar is at the end."""
    feats = doc.get("features") or []
    rb = doc.get("rollback")
    if rb is None:
        return None
    try:
        rb = max(int(rb), 0)
    except (TypeError, ValueError):
        return None
    if rb >= len(feats):
        return None
    f = feats[rb]
    return {"id": f.get("id"), "name": f.get("name") or f.get("id")}


def rollback_note(doc: dict, has_body: bool) -> str | None:
    """Plain words for a part left rolled back, or None. A rolled-back part builds only the features
    above its bar, here and in every assembly that uses it (as in SOLIDWORKS)."""
    rb = rolled_back(doc)
    if rb is None:
        return None
    left = "so the features from there down are left out" if has_body else "so it has no body"
    return f"{doc.get('name') or 'The part'} is rolled back: its rollback bar is above {rb['name']}, {left}."


def export(doc: dict, fmt: str, path: str) -> None:
    from build123d import export_step, export_stl
    st = rebuilt(doc)
    require_clean(st.status, doc.get("name", "Part"))
    if st.part is None:
        note = rollback_note(doc, False)
        if note:
            raise FeatureError(f"{note} Right-click the part name at the top of the tree and choose Rollback to End.")
        raise FeatureError("No solid body to export")
    if fmt == "step":
        export_step(st.part, path)
    elif fmt == "stl":
        export_stl(st.part, path)
    else:
        raise FeatureError(f"Unknown export format {fmt}")


def require_clean(status: list[dict], name: str = "Part") -> None:
    bad = next((s for s in status if s.get("state") == "error"), None)
    if bad:
        raise FeatureError(f"Cannot export {name}: feature {bad['id']} failed: {bad.get('message', 'Rebuild error')}")
