"""Feature recognition (SOLIDWORKS FeatureWorks): an imported body becomes an editable feature tree.

How it works. Every guess is proven by building the feature forward and comparing solids, so nothing that does
not reproduce the body is ever kept:

1. Local features, the last made first. Fillets (constant-radius round blends), chamfers (bevel strips and
   cones) and holes (simple, counterbore, countersink; blind or through) are taken off the body with
   OpenCascade's defeaturing (BRepAlgoAPI_Defeaturing). The feature is then built on what is left; it must give
   back the body it came from (symmetric difference about zero) or it stays in the body.
2. The base. Extrudes along one direction, written as a stock with cuts or as stacked bosses (whichever needs
   fewer features), or one revolve. Sketches are sections of the body; relations and dimensions are added only
   where the browser's own sketch solver says they take away a degree of freedom (sketch/define_cli.mjs), so a
   sketch is never over-defined. Through holes along the extrude direction go into the sketch as circles.
3. What cannot be recognised stays an imported body (FeatureWorks leaves Imported1 too), with the recognised
   features on top of it.

The finished tree is rebuilt by geometry.py and compared with the import before it is offered.
"""

from __future__ import annotations

import copy
import json
import math
import os
import re
import shutil
import subprocess
import time
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path

from build123d import Compound, Edge, Face, GeomType, Plane, Solid, Vector, Wire
from OCP.BRepAdaptor import BRepAdaptor_Surface
from OCP.BRepAlgoAPI import BRepAlgoAPI_Defeaturing
from OCP.GeomAbs import (GeomAbs_Cone, GeomAbs_Cylinder, GeomAbs_Plane, GeomAbs_Sphere, GeomAbs_SurfaceOfExtrusion,
                         GeomAbs_SurfaceOfRevolution, GeomAbs_Torus)
from OCP.ShapeUpgrade import ShapeUpgrade_UnifySameDomain
from OCP.TopAbs import TopAbs_SOLID

from . import geometry

KINDS = ("extrudes", "revolves", "holes", "fillets", "chamfers")
KIND_LABELS = {"extrudes": "Extrudes", "revolves": "Revolves", "holes": "Holes", "fillets": "Fillets", "chamfers": "Chamfers"}
DEFINE_CLI = Path(__file__).parent / "static" / "js" / "sketch" / "define_cli.mjs"
TIME_LIMIT = 120.0          # seconds per part; what is not done by then stays in the imported body
MAX_LEVELS = 12             # extrude levels along one direction
STD_FOR_AXIS = (("Front Plane", Vector(0, 0, 1)), ("Top Plane", Vector(0, 1, 0)), ("Right Plane", Vector(1, 0, 0)))


class RecognizeError(Exception):
    pass


# OpenCascade can hang inside one call (defeaturing a fillet next to a B-spline did, on a real part), and Python
# cannot interrupt it. Workers announce each risky step here; recognize_part_safe kills a worker stuck on one step
# and runs the part again without it.
_beat = None


def _mark(label: str | None) -> None:
    if _beat is not None:
        _beat(label)
        stall = os.environ.get("OPENSKETCH_RECOGNIZE_STALL")  # tests: make a worker hang on a step like this one
        if stall and label and label.startswith(stall):
            time.sleep(3600)


# ----------------------------------------------------------------------------- small geometry helpers

def _v(p) -> Vector:
    return Vector(p.X(), p.Y(), p.Z())


def _par(a: Vector, b: Vector, tol: float = 1e-7) -> bool:
    return a.normalized().cross(b.normalized()).length < tol


def _line_dist(p: Vector, o: Vector, d: Vector) -> float:
    w = p - o
    return (w - d * w.dot(d)).length


def _r(x: float, nd: int = 6) -> float:
    v = round(float(x), nd)
    return 0.0 if v == 0 else v


def _canon(d: Vector) -> Vector:
    """One sign for a direction (largest component positive), so +d and -d compare equal."""
    d = d.normalized()
    comps = (d.X, d.Y, d.Z)
    k = max(range(3), key=lambda i: abs(comps[i]))
    return d if comps[k] > 0 else -d


def _xdir_for(n: Vector) -> Vector:
    """Sketch x direction for a plane normal, matching the standard planes (Front/Top: +X, Right: -Z)."""
    n = n.normalized()
    if abs(abs(n.X) - 1) < 1e-9:
        return Vector(0, 0, -1)
    if abs(abs(n.Y) - 1) < 1e-9 or abs(abs(n.Z) - 1) < 1e-9:
        return Vector(1, 0, 0)
    w = min((Vector(1, 0, 0), Vector(0, 1, 0), Vector(0, 0, 1)), key=lambda a: abs(a.dot(n)))
    return (w - n * w.dot(n)).normalized()


def _face_point(f) -> Vector:
    from .inspection import _face_point
    return _face_point(f)


def _one_solid(shape):
    if shape is None or shape.IsNull():
        return None
    if shape.ShapeType() == TopAbs_SOLID:
        return Solid(shape)
    sols = Compound(shape).solids()
    return sols[0] if len(sols) == 1 else None


def _unify(shape):
    try:
        u = ShapeUpgrade_UnifySameDomain(shape.wrapped, True, True, True)
        u.Build()
        return Compound(u.Shape()) if not isinstance(shape, Solid) else (_one_solid(u.Shape()) or shape)
    except Exception:
        return shape


@dataclass
class Surf:
    kind: str
    normal: Vector | None = None
    origin: Vector | None = None
    axis: Vector | None = None
    radius: float = 0.0
    major: float = 0.0
    semi: float = 0.0


def _surf(face) -> Surf:
    try:
        ad = BRepAdaptor_Surface(face.wrapped)
        t = ad.GetType()
        if t == GeomAbs_Plane:
            return Surf("plane", normal=face.normal_at().normalized(), origin=_v(ad.Plane().Location()))
        if t == GeomAbs_Cylinder:
            c = ad.Cylinder()
            a = c.Axis()
            return Surf("cylinder", origin=_v(a.Location()), axis=_v(a.Direction()).normalized(), radius=c.Radius())
        if t == GeomAbs_Cone:
            c = ad.Cone()
            a = c.Axis()
            return Surf("cone", origin=_v(a.Location()), axis=_v(a.Direction()).normalized(), radius=c.RefRadius(),
                        semi=c.SemiAngle())
        if t == GeomAbs_Sphere:
            s = ad.Sphere()
            return Surf("sphere", origin=_v(s.Location()), radius=s.Radius())
        if t == GeomAbs_Torus:
            s = ad.Torus()
            a = s.Axis()
            return Surf("torus", origin=_v(a.Location()), axis=_v(a.Direction()).normalized(), radius=s.MinorRadius(),
                        major=s.MajorRadius())
        if t == GeomAbs_SurfaceOfRevolution:
            a = ad.AxeOfRevolution()
            return Surf("revolution", origin=_v(a.Location()), axis=_v(a.Direction()).normalized())
        if t == GeomAbs_SurfaceOfExtrusion:
            return Surf("extrusion", axis=_v(ad.Direction()).normalized())
    except Exception:
        pass
    return Surf("other")


def _concave(face, s: Surf) -> bool:
    """A cylinder or cone whose material is outside it (a hole wall), not inside (a boss)."""
    try:
        p = _face_point(face)
        n = face.normal_at(p)
    except Exception:
        return False
    w = p - s.origin
    radial = w - s.axis * w.dot(s.axis)
    return radial.length > 1e-12 and n.dot(radial) < 0


def _uspan(face) -> float:
    try:
        u0, u1, _, _ = face._uv_bounds()
        return u1 - u0
    except Exception:
        return 2 * math.pi


class Topo:
    """The faces of a body, their surfaces, and which faces meet along which edges."""

    def __init__(self, body):
        self.body = body
        self.faces = body.faces()
        self.surfs = [_surf(f) for f in self.faces]
        self.e2f: dict[int, list[int]] = defaultdict(list)
        self.edge: dict[int, Edge] = {}
        for i, f in enumerate(self.faces):
            for e in f.edges():
                h = hash(e.wrapped)
                if i not in self.e2f[h]:
                    self.e2f[h].append(i)
                self.edge.setdefault(h, e)
        self.nbrs: dict[int, list[tuple[int, int]]] = defaultdict(list)
        for h, fl in self.e2f.items():
            if len(fl) == 2:
                a, b = fl
                self.nbrs[a].append((h, b))
                self.nbrs[b].append((h, a))
        self._smooth: dict[int, bool] = {}
        self.scale = max(geometry.bbox(body).diagonal, 1.0)
        self.tol = 1e-6 * self.scale

    def smooth(self, h: int) -> bool:
        """The two faces at this edge meet tangentially (no crease)."""
        if h not in self._smooth:
            fl = self.e2f.get(h, [])
            ok = len(fl) == 2
            if ok:
                e, fa, fb = self.edge[h], self.faces[fl[0]], self.faces[fl[1]]
                for t in (0.2, 0.5, 0.8):
                    try:
                        p = e.position_at(t)
                        if fa.normal_at(p).dot(fb.normal_at(p)) < 1 - 1e-5:
                            ok = False
                            break
                    except Exception:
                        ok = False
                        break
            self._smooth[h] = ok
        return self._smooth[h]


# ----------------------------------------------------------------------------- context

@dataclass
class Ctx:
    volume: float
    scale: float
    deadline: float
    kinds: set
    notes: list = field(default_factory=list)
    checks: int = 0
    stop: object = None  # callable: True when the user cancelled
    skip: set = field(default_factory=set)  # steps a worker hung on before (repr of their signatures)
    bad: set = field(default_factory=set)   # stages that would not rebuild on the recognised tree
    log: list = field(default_factory=list)  # every accepted stage, in order (for checkpoints)
    failed: set = field(default_factory=set)
    on_stage: object = None                  # called after each accepted stage (a worker saves a checkpoint)
    built: list = field(default_factory=list)  # stages that made it into the last tree built

    def accepted(self, stage: "Stage") -> None:
        self.log.append(stage)
        if self.on_stage is not None:
            try:
                self.on_stage(self, stage.after)
            except Exception:
                pass

    @property
    def vtol(self) -> float:
        return max(2e-6 * self.volume, 1e-7 * self.scale ** 3, 1e-6)

    def time_left(self) -> bool:
        if self.stop is not None and self.stop():
            return False
        return time.monotonic() < self.deadline

    @property
    def ltol(self) -> float:
        return max(1e-5 * self.scale, 1e-5)

    def same(self, a, b) -> bool:
        """Two solids are the same (equal volume, each one's surface on the other's)."""
        self.checks += 1
        return same_solid(a, b, self.vtol, self.ltol)[0]

    def same_near(self, a, b, region: list) -> bool:
        """The check for one recognised feature: equal volume, and the faces around the change (the faces the
        feature made) lie on each other. Faces away from it are not touched by defeaturing or by the feature."""
        self.checks += 1
        try:
            if a is None or b is None or abs(a.volume - b.volume) > self.vtol:
                return False
        except Exception:
            return False
        return surfaces_match(a, b, self.ltol, near=region)


def diff_volume(a, b) -> float:
    """Volume in one solid and not the other, both ways; infinity when OpenCascade cannot tell. The two cuts must
    agree with the volumes (V(a) - V(b) = V(a - b) - V(b - a)): a boolean between near-identical solids can fail
    quietly and give back one of its inputs, which would look like no overlap at all, or like a perfect match."""
    try:
        va, vb = a.volume, b.volume
        ab, ba = a - b, b - a
        d1 = sum(x.volume for x in ab.solids()) if ab is not None else 0.0
        d2 = sum(x.volume for x in ba.solids()) if ba is not None else 0.0
    except Exception:
        return math.inf
    tol = max(1e-6 * max(va, vb), 1e-6)
    if abs((va - vb) - (d1 - d2)) > tol or d1 > va + tol or d2 > vb + tol:
        return math.inf
    return d1 + d2


def _samples(face, n: int = 3) -> list[Vector]:
    pts = []
    try:
        pts.append(_face_point(face))
    except Exception:
        pass
    for u, v in ((0.31, 0.37), (0.71, 0.63), (0.13, 0.83), (0.87, 0.19))[: max(0, n - 1)]:
        try:
            p = face.position_at(u, v)
            if face.is_inside(p, tolerance=1e-6):
                pts.append(p)
        except Exception:
            continue
    return pts


def _box_of(shapes):
    bb = None
    for sh in shapes:
        b = sh.bounding_box(optimal=False)
        bb = b if bb is None else bb.add(b)
    return bb


def _boxes_meet(a, b, m: float) -> bool:
    return (a.min.X - m <= b.max.X and b.min.X - m <= a.max.X and a.min.Y - m <= b.max.Y and b.min.Y - m <= a.max.Y
            and a.min.Z - m <= b.max.Z and b.min.Z - m <= a.max.Z)


def surfaces_match(a, b, tol: float, near: list | None = None) -> bool:
    """No booleans: every sampled point on either solid's faces lies on the other solid's boundary. With `near`
    (faces around a change), only faces whose box meets theirs are sampled."""
    from OCP.BRepClass3d import BRepClass3d_SolidClassifier
    from OCP.gp import gp_Pnt
    from OCP.TopAbs import TopAbs_ON
    region, margin = None, 0.0
    if near:
        region = _box_of(near)
        margin = 0.25 * region.diagonal + 10 * tol
    for x, y in ((a, b), (b, a)):
        cls = BRepClass3d_SolidClassifier()
        cls.Load(y.wrapped)
        for f in x.faces():
            if region is not None and not _boxes_meet(f.bounding_box(optimal=False), region, margin):
                continue
            for p in _samples(f):
                cls.Perform(gp_Pnt(p.X, p.Y, p.Z), tol)
                if cls.State() != TopAbs_ON:
                    return False
    return True


def same_solid(a, b, vtol: float, ltol: float) -> tuple[bool, float]:
    """(same, volume difference). Same means equal volume and every sampled surface point of each solid lying on
    the other (booleans alone are not trusted: between near-identical solids OpenCascade can return empty cuts,
    which read as a perfect match). The difference is the boolean one when the booleans hold together."""
    if a is None or b is None:
        return False, math.inf
    try:
        dv = abs(a.volume - b.volume)
    except Exception:
        return False, math.inf
    d = diff_volume(a, b)
    if dv > vtol:
        return False, d if math.isfinite(d) else dv
    if not surfaces_match(a, b, ltol):
        return False, d if math.isfinite(d) and d > vtol else max(dv, vtol * 10)
    return True, dv


def _defeature(body, faces):
    """Remove faces and heal the gap by extending their neighbours. (result, algorithm) or (None, None)."""
    df = BRepAlgoAPI_Defeaturing()
    df.SetShape(body.wrapped)
    for f in faces:
        df.AddFaceToRemove(f.wrapped)
    df.SetRunParallel(False)
    df.SetToFillHistory(True)
    try:
        df.Build()
    except Exception:
        return None, None
    if not df.IsDone():
        return None, None
    res = _one_solid(df.Shape())
    if res is None or not res.is_valid:
        return None, None
    if len(res.faces()) >= len(body.faces()) and abs(res.volume - body.volume) <= 1e-9 * max(body.volume, 1.0):
        return None, None  # nothing changed: OpenCascade gave the body back
    return res, df


def _touched(before, removed: list, df) -> list:
    """Faces of `before` the defeaturing changed: the removed ones and every face its history says it modified or
    deleted (healing can reach well past the removed faces)."""
    out = list(removed)
    keys = {hash(f.wrapped) for f in removed}
    for f in before.faces():
        if hash(f.wrapped) in keys:
            continue
        try:
            changed = df.IsDeleted(f.wrapped) or any(not m.IsSame(f.wrapped) for m in df.Modified(f.wrapped))
        except Exception:
            changed = True
        if changed:
            out.append(f)
    return out


def _new_edges(before, after, df) -> list:
    """Edges of the defeatured body that are neither old edges nor old edges made longer: the sharp edges where
    the removed faces were."""
    known = set()
    for e in before.edges():
        known.add(hash(e.wrapped))
        try:
            for m in df.Modified(e.wrapped):
                known.add(hash(m))
        except Exception:
            pass
    return [e for e in after.edges() if hash(e.wrapped) not in known]


@dataclass
class Stage:
    kind: str            # fillet | chamfer | hole
    before: object
    after: object
    feat: dict           # the feature without id/name; fillet and chamfer get edges when they are built
    edges: list = field(default_factory=list)
    faces: int = 0
    meta: dict = field(default_factory=dict)
    in_sketch: bool = False
    sig: str = ""        # the face group it came from, to leave it in the body on a rerun
    vol_before: float = 0.0  # volume with the feature: the rebuilt tree must come back to it
    centers: list = field(default_factory=list)  # centres of the faces it took off (the preview colours them)


def _face_sig(topo: Topo, idxs) -> tuple:
    return tuple(sorted((tuple(round(c, 4) for c in geometry.vlist(topo.faces[i].center())), round(topo.faces[i].area, 4))
                        for i in idxs))


def _skipped(ctx: "Ctx", sig: tuple) -> bool:
    """A group the worker hung on, or one holding a face whose feature would not rebuild before."""
    return repr(sig) in ctx.skip or any("face:" + repr(k) in ctx.skip for k in sig[1])


def _bad_keys(sig: str) -> set:
    import ast
    try:
        kind, faces = ast.literal_eval(sig)
    except Exception:
        return set()
    return {"face:" + repr(k) for k in faces}


def _chains(topo: Topo, idxs: list[int]) -> list[list[int]]:
    """Faces of a group joined to each other by smooth edges."""
    s = set(idxs)
    seen, out = set(), []
    for i in idxs:
        if i in seen:
            continue
        comp, stack = [], [i]
        seen.add(i)
        while stack:
            k = stack.pop()
            comp.append(k)
            for h, j in topo.nbrs[k]:
                if j in s and j not in seen and topo.smooth(h):
                    seen.add(j)
                    stack.append(j)
        out.append(comp)
    return out


# ----------------------------------------------------------------------------- fillets

BATCH_FACES = 6  # defeaturing time grows much faster than the face count (52 fillet faces at once: 88 s)


def _batches(chains: list[list[int]]):
    """Groups to try, largest first: whole chains packed up to BATCH_FACES faces, and on to smaller packs and
    single chains. A chain larger than the limit is tried on its own."""
    seen = set()
    for size in (BATCH_FACES, BATCH_FACES // 2, 1):
        out, cur = [], []
        for c in chains:
            if cur and len(cur) + len(c) > size:
                out.append(cur)
                cur = []
            cur = cur + c
        if cur:
            out.append(cur)
        for g in out:
            key = tuple(sorted(g))
            if key not in seen:
                seen.add(key)
                yield g


def _blend_radius(topo: Topo, i: int, keep: Vector | None) -> float | None:
    s = topo.surfs[i]
    if s.kind == "cylinder":
        if keep is not None and _par(s.axis, keep):
            return None  # a round corner of an extruded outline: an arc in the sketch
        if _uspan(topo.faces[i]) >= math.pi - 1e-6:
            return None  # half or full cylinder: a slot end, boss or hole, not a blend
        r = s.radius
    elif s.kind in ("torus", "sphere"):
        r = s.radius
    else:
        return None
    if len({j for h, j in topo.nbrs[i] if topo.smooth(h)}) < 2:
        return None
    return r


def _try_fillet(ctx: Ctx, body, topo: Topo, grp: list[int], r: float) -> Stage | None:
    removed = [topo.faces[i] for i in grp]
    after, df = _defeature(body, removed)
    if after is None:
        return None
    edges = _new_edges(body, after, df)
    if not edges:
        return None
    try:
        rebuilt = geometry.solid_of(after.fillet(r, edges))
    except Exception:
        return None
    if not ctx.same_near(rebuilt, body, _touched(body, removed, df)):
        return None
    return Stage("fillet", body, after, {"type": "fillet", "radius": _r(r)}, edges=edges, faces=len(grp),
                 vol_before=body.volume, centers=[geometry.vlist(f.center()) for f in removed])


def _fillets(ctx: Ctx, body, keep, failed: set) -> tuple[object, list[Stage]]:
    stages = []
    while ctx.time_left():
        topo = Topo(body)
        groups: dict[float, list[int]] = defaultdict(list)
        for i in range(len(topo.faces)):
            r = _blend_radius(topo, i, keep)
            if r is not None:
                groups[round(r, 6)].append(i)
        progress = False
        for r in sorted(groups):
            idxs = groups[r]
            chains = sorted(_chains(topo, idxs), key=len, reverse=True)
            for grp in _batches(chains):
                sig = ("fillet", _face_sig(topo, grp))
                if sig in failed or _skipped(ctx, sig) or not ctx.time_left():
                    continue
                _mark(repr(sig))
                st = _try_fillet(ctx, body, topo, grp, r)
                _mark(None)
                if st is None:
                    failed.add(sig)
                    continue
                st.sig = repr(sig)
                stages.append(st)
                ctx.accepted(st)
                body = st.after
                progress = True
                break
            if progress:
                break
        if not progress:
            break
    return body, stages


# ----------------------------------------------------------------------------- chamfers

def _chamfer_width(topo: Topo, i: int, keep: Vector | None) -> float | None:
    f, s = topo.faces[i], topo.surfs[i]
    if s.kind == "plane":
        if keep is not None and (abs(s.normal.dot(keep)) < 1e-7 or _par(s.normal, keep)):
            return None  # a side or cap of the extrusion
    elif s.kind == "cone":
        circles = [e for e in f.edges() if e.geom_type == GeomType.CIRCLE]
        if len(circles) != 2:
            return None
        for h, j in topo.nbrs[i]:  # the edge of a hole: the hole takes it as a countersink
            o = topo.surfs[j]
            if o.kind == "cylinder" and _par(o.axis, s.axis) and _line_dist(o.origin, s.origin, s.axis) < topo.tol \
                    and _concave(topo.faces[j], o):
                return None
    else:
        return None
    edges = f.edges()
    length = max((e.length for e in edges), default=0.0)
    if length <= 0:
        return None
    w = f.area / length
    if not (0 < w <= 0.12 * topo.scale and w <= 0.6 * length):
        return None
    sharp = {j for h, j in topo.nbrs[i] if not topo.smooth(h)}
    if len(sharp) < 2:
        return None
    try:
        p = _face_point(f)
        n = f.normal_at(p)
    except Exception:
        return None
    inclined = 0
    for j in sharp:
        o = topo.faces[j]
        try:
            m = o.normal_at(o.edges()[0].position_at(0.5)) if topo.surfs[j].kind == "plane" else None
        except Exception:
            m = None
        if m is not None and math.cos(math.radians(85)) < n.dot(m) < math.cos(math.radians(5)):
            inclined += 1
    if s.kind == "plane" and inclined < 1:
        return None
    return w


def _try_chamfer(ctx: Ctx, body, topo: Topo, grp: list[int]) -> Stage | None:
    removed = [topo.faces[i] for i in grp]
    after, df = _defeature(body, removed)
    if after is None:
        return None
    edges = _new_edges(body, after, df)
    if not edges:
        return None
    f = topo.faces[grp[0]]
    try:
        sharp = min(edges, key=lambda e: f.distance_to(e.position_at(0.5)))
        p = sharp.position_at(0.5)
        rails = sorted(f.edges(), key=lambda x: x.distance_to(p))[:2]
        d1, d2 = (r.distance_to(p) for r in rails)
    except Exception:
        return None
    if min(d1, d2) <= 1e-9:
        return None
    orders = [(d1, d2)] if abs(d1 - d2) <= 1e-7 * ctx.scale else [(d1, d2), (d2, d1)]
    region = _touched(body, removed, df)
    for a, b in orders:
        try:
            rebuilt = geometry.solid_of(after.chamfer(a, b if abs(a - b) > 1e-7 * ctx.scale else None, edges))
        except Exception:
            continue
        if ctx.same_near(rebuilt, body, region):
            if abs(a - b) <= 1e-7 * ctx.scale:
                feat = {"type": "chamfer", "mode": "angle_distance", "distance": _r(a), "angle": 45}
            else:
                feat = {"type": "chamfer", "mode": "distance_distance", "distance": _r(a), "distance2": _r(b)}
            return Stage("chamfer", body, after, feat, edges=edges, faces=len(grp), vol_before=body.volume,
                         centers=[geometry.vlist(f.center()) for f in removed])
    return None


def _linked(topo: Topo, idxs: list[int]) -> list[list[int]]:
    """Faces of a group that touch each other along any edge (a mitred chamfer runs round a corner this way)."""
    s = set(idxs)
    seen, out = set(), []
    for i in idxs:
        if i in seen:
            continue
        comp, stack = [], [i]
        seen.add(i)
        while stack:
            k = stack.pop()
            comp.append(k)
            for h, j in topo.nbrs[k]:
                if j in s and j not in seen:
                    seen.add(j)
                    stack.append(j)
        out.append(comp)
    return out


def _chamfers(ctx: Ctx, body, keep, failed: set) -> tuple[object, list[Stage]]:
    stages = []
    while ctx.time_left():
        topo = Topo(body)
        widths: dict[float, list[int]] = defaultdict(list)
        cand = []
        for i in range(len(topo.faces)):
            w = _chamfer_width(topo, i, keep)
            if w is not None:
                widths[round(w, 4)].append(i)
                cand.append(i)
        if not cand:
            break
        attempts, seen_att = [], set()
        for grp in [cand] + sorted(_linked(topo, cand), key=len, reverse=True) + list(widths.values()) + [[i] for i in cand]:
            key = tuple(sorted(grp))
            if key not in seen_att:
                seen_att.add(key)
                attempts.append(grp)
        progress = False
        for grp in attempts:
            sig = ("chamfer", _face_sig(topo, grp))
            if sig in failed or _skipped(ctx, sig) or not ctx.time_left():
                continue
            _mark(repr(sig))
            st = _try_chamfer(ctx, body, topo, grp)
            _mark(None)
            if st is None:
                failed.add(sig)
                continue
            st.sig = repr(sig)
            stages.append(st)
            ctx.accepted(st)
            body = st.after
            progress = True
            break
        if not progress:
            break
    return body, stages


# ----------------------------------------------------------------------------- holes

def _coaxial(s: Surf, o: Vector, d: Vector, tol: float) -> bool:
    return s.axis is not None and _par(s.axis, d) and _line_dist(s.origin, o, d) < tol


def _hole_wall(topo: Topo, j: int, o: Vector, d: Vector) -> bool:
    s = topo.surfs[j]
    return s.kind in ("cylinder", "cone") and _coaxial(s, o, d, topo.tol) and _concave(topo.faces[j], s)


def _hole_floor(topo: Topo, j: int, o: Vector, d: Vector) -> bool:
    """A flat bottom or counterbore step: a plane across the axis bounded only by circles on it, every one of them
    shared with a hole wall."""
    s = topo.surfs[j]
    if s.kind != "plane" or not _par(s.normal, d):
        return False
    for e in topo.faces[j].edges():
        if e.geom_type != GeomType.CIRCLE or _line_dist(e.arc_center, o, d) > topo.tol:
            return False
    return all(_hole_wall(topo, k, o, d) for h, k in topo.nbrs[j])


def _hole_groups(topo: Topo) -> list[tuple[list[int], Vector, Vector]]:
    seen, out = set(), []
    for i, s in enumerate(topo.surfs):
        if i in seen or s.kind not in ("cylinder", "cone") or not _concave(topo.faces[i], s):
            continue
        o, d = s.origin, s.axis
        grp, stack = [i], [i]
        seen.add(i)
        while stack:
            k = stack.pop()
            for h, j in topo.nbrs[k]:
                if j in seen:
                    continue
                if _hole_wall(topo, j, o, d) or _hole_floor(topo, j, o, d):
                    seen.add(j)
                    grp.append(j)
                    stack.append(j)
        out.append((grp, o, d))
    return out


def _axial_range(face, o: Vector, d: Vector) -> tuple[float, float]:
    ts = []
    for e in face.edges():
        for t in (0.0, 0.25, 0.5, 0.75, 1.0):
            ts.append((e.position_at(t) - o).dot(d))
    return min(ts), max(ts)


def _plane_spec(point: Vector, normal: Vector, kind: str = "face") -> tuple[dict, Plane]:
    """A sketch or hole plane through `point` with this normal; its origin is the part origin projected onto it."""
    n = normal.normalized()
    o = n * point.dot(n)
    x = _xdir_for(n)
    spec = {"type": kind, "origin": geometry.vlist(o), "normal": geometry.vlist(n), "xdir": geometry.vlist(x)}
    return spec, Plane(origin=o, x_dir=x, z_dir=n)


def _face_spec_holds(body, spec: dict) -> bool:
    """A face-attached plane finds a face at its own height on this body (it re-finds the nearest face with the
    same normal, which can be another one)."""
    try:
        pl = geometry.resolve_plane(spec, geometry.RegenState(part=body))
    except Exception:
        return False
    return (pl.origin - Vector(*spec["origin"])).length <= 1e-7 * max(1.0, geometry.bbox(body).diagonal)


def _fix_face_planes(feats: list[dict], st) -> bool:
    """Sketches whose face attachment moved them to another face: pin them where they were meant to be."""
    changed = False
    for f in feats:
        if f.get("type") != "sketch" or (f.get("plane") or {}).get("type") != "face":
            continue
        res = (st.diagnostics.get(f["id"]) or {}).get("plane_resolution") or {}
        if res.get("shift_mm", 0) > 1e-7 or not res.get("matched_face", True):
            f["plane"] = {**f["plane"], "type": "fixed"}
            changed = True
    return changed


def _classify_hole(topo: Topo, grp: list[int], o: Vector, d: Vector) -> dict | None:
    """What kind of hole a group of faces is: simple / counterbore / countersink, blind or through."""
    cyl, cones, floors = [], [], []
    for i in grp:
        s = topo.surfs[i]
        lo, hi = _axial_range(topo.faces[i], o, d)
        item = (i, s, lo, hi)
        (cyl if s.kind == "cylinder" else cones if s.kind == "cone" else floors).append(item)
    tol = topo.tol
    if not cyl:
        # A plain conical hole (a countersink right through thin stock): the bore is the small end of the cone.
        if len(cones) != 1 or floors:
            return None
        circles = [e for e in topo.faces[cones[0][0]].edges() if e.geom_type == GeomType.CIRCLE]
        if len(circles) != 2:
            return None
        r0 = min(e.radius for e in circles)
    else:
        r0 = min(s.radius for _, s, _, _ in cyl)
    tmin = min(lo for _, _, lo, _ in cyl + cones + floors)
    tmax = max(hi for _, _, _, hi in cyl + cones + floors)
    # Boundary: where the hole's faces meet the rest of the body.
    inside = set(grp)
    bnd_lo, bnd_hi, entrance_faces = False, False, {"lo": set(), "hi": set()}
    for i in grp:
        for h, j in topo.nbrs[i]:
            if j in inside:
                continue
            e = topo.edge[h]
            ts = [(e.position_at(t) - o).dot(d) for t in (0.0, 0.5, 1.0)]
            if max(ts) >= tmax - 1e-6 * topo.scale - (tmax - tmin) * 0.01:
                bnd_hi = True
                entrance_faces["hi"].add(j)
            elif min(ts) <= tmin + 1e-6 * topo.scale + (tmax - tmin) * 0.01:
                bnd_lo = True
                entrance_faces["lo"].add(j)
            else:
                return None  # meets the body in the middle: a cross hole or a notch, not a plain hole
    floors_flat = [f for f in floors if len(topo.faces[f[0]].edges()) == 1]  # a disk: flat bottom
    steps = [f for f in floors if len(topo.faces[f[0]].edges()) == 2]
    if len(floors_flat) > 1 or len(steps) > 1:
        return None
    big = [c for c in cyl if c[1].radius > r0 + tol]
    if len({round(c[1].radius, 6) for c in big}) > 1:
        return None
    through = bnd_lo and bnd_hi
    if not through and not (bnd_lo or bnd_hi):
        return None
    if through and floors_flat:
        return None
    # Which end is the entrance.
    if through:
        ends = []
        for end in ("lo", "hi"):
            t_end = tmin if end == "lo" else tmax
            has_cb = any(abs((c[2] if end == "lo" else c[3]) - t_end) < 1e-6 * topo.scale for c in big)
            has_cs = any(abs((c[2] if end == "lo" else c[3]) - t_end) < 1e-6 * topo.scale for c in cones)
            ends.append((end, has_cb or has_cs))
        marked = [e for e, m in ends if m]
        if not cyl:  # a cone alone: drilled from its wide end
            i, sc, lo, hi = cones[0]
            wide = max((e for e in topo.faces[i].edges() if e.geom_type == GeomType.CIRCLE), key=lambda e: e.radius)
            marked = ["hi" if (wide.arc_center - o).dot(d) > (lo + hi) / 2 else "lo"]
        if len(marked) > 1:
            return None
        if marked:
            entry = marked[0]
        else:
            out = -d  # outward at the low end is -d, at the high end +d
            prefer = [Vector(0, 1, 0), Vector(0, 0, 1), Vector(1, 0, 0)]
            score = lambda end: next((k for k, a in enumerate(prefer) if abs((out if end == "lo" else -out).dot(a)) > 0.5
                                      and (out if end == "lo" else -out).dot(a) > 0), 9)  # noqa: E731
            entry = min(("hi", "lo"), key=score)
    else:
        entry = "lo" if bnd_lo else "hi"
    a_in = d if entry == "lo" else -d
    t_entry = tmin if entry == "lo" else tmax
    # Every wall must sit in a stack from the entrance: [countersink cone | counterbore + step], bore, [floor].
    def depth_of(t):
        return abs(t - t_entry)
    style, info = "simple", {}
    if big:
        if cones:
            return None
        _, sb, lo, hi = big[0]
        near = min(depth_of(lo), depth_of(hi))
        far = max(depth_of(lo), depth_of(hi))
        if near > 1e-6 * topo.scale or not steps:
            return None
        style = "counterbore"
        info = {"bore_diameter": _r(2 * sb.radius), "bore_depth": _r(far)}
    elif cones:
        if len(cones) != 1:
            return None
        i, sc, lo, hi = cones[0]
        near = min(depth_of(lo), depth_of(hi))
        if near > 1e-6 * topo.scale:
            if through or floors_flat:
                return None
            return None  # a drill point at the bottom: the Hole feature only makes flat bottoms
        circles = [e for e in topo.faces[i].edges() if e.geom_type == GeomType.CIRCLE]
        R = max(e.radius for e in circles)
        style = "countersink"
        info = {"sink_diameter": _r(2 * R), "sink_angle": _r(math.degrees(2 * abs(sc.semi)))}
    elif steps:
        return None
    # Entrance plane: the face the hole is drilled into, when it is flat across the axis; else a plane at the rim.
    ent = entrance_faces[entry]
    outward = -a_in
    planar = ent and all(topo.surfs[j].kind == "plane" and _par(topo.surfs[j].normal, d)
                         and topo.surfs[j].normal.dot(outward) > 0 for j in ent)
    centre = o + d * t_entry
    if planar:
        levels = {round(topo.faces[j].center().dot(d), 6) for j in ent}
        if len(levels) != 1:
            planar = False
    spec, pl = _plane_spec(centre, outward, "face" if planar else "fixed")
    if planar and not _face_spec_holds(topo.body, spec):
        spec, pl = _plane_spec(centre, outward, "fixed")
    local = pl.to_local_coords(centre)
    feat = {"type": "hole", "plane": spec, "x": _r(local.X), "y": _r(local.Y), "diameter": _r(2 * r0),
            "reverse": True, "style": style, **info}
    if through:
        feat["end"] = "through_all"
    else:
        feat["end"] = "blind"
        feat["depth"] = _r(tmax - tmin)
    return {"feat": feat, "through": through, "axis": a_in, "centre": centre, "radius": r0,
            "length": tmax - tmin}


def _hole_tool(feat: dict, part):
    st = geometry.RegenState(part=part)
    return geometry.hole_tool(feat, st)


def _try_holes(ctx: Ctx, body, topo: Topo, items: list) -> list[Stage] | None:
    faces = [topo.faces[i] for it in items for i in it["faces"]]
    after, df = _defeature(body, faces)
    if after is None:
        return None
    rebuilt = after
    try:
        for it in items:
            rebuilt = geometry.solid_of(rebuilt - _hole_tool(it["feat"], after))
    except Exception:
        return None
    if not ctx.same_near(rebuilt, body, _touched(body, faces, df)):
        return None
    return [Stage("hole", body, after, it["feat"], faces=len(it["faces"]),
                  meta={k: it[k] for k in ("through", "axis", "centre", "radius", "length")},
                  centers=[geometry.vlist(topo.faces[i].center()) for i in it["faces"]]) for it in items]


def _holes(ctx: Ctx, body, failed: set) -> tuple[object, list[Stage]]:
    stages = []
    while ctx.time_left():
        topo = Topo(body)
        found = []
        for grp, o, d in _hole_groups(topo):
            info = _classify_hole(topo, grp, o, d)
            if info is None:
                continue
            info["faces"] = grp
            found.append(info)
        if not found:
            break
        kinds: dict[str, list] = defaultdict(list)
        for it in found:
            f = it["feat"]
            key = json.dumps({k: f.get(k) for k in ("diameter", "end", "depth", "style", "bore_diameter", "bore_depth",
                                                    "sink_diameter", "sink_angle")}, sort_keys=True)
            kinds[key].append(it)
        progress = False
        for key, items in sorted(kinds.items(), key=lambda kv: -len(kv[1])):
            attempts = [items] + ([[it] for it in items] if len(items) > 1 else [])
            for its in attempts:
                sig = ("hole", _face_sig(topo, [i for it in its for i in it["faces"]]))
                if sig in failed or _skipped(ctx, sig) or not ctx.time_left():
                    continue
                _mark(repr(sig))
                got = _try_holes(ctx, body, topo, its)
                _mark(None)
                if got is None:
                    failed.add(sig)
                    continue
                for g in got:
                    g.sig = repr(sig)
                got[0].vol_before = body.volume  # built last of its group: the group together gives back this body
                # Several holes removed together: keep one stage per hole, all with the same before/after bodies.
                stages.extend(got)
                for g in got:
                    ctx.accepted(g)
                body = got[0].after
                progress = True
                break
            if progress:
                break
        if not progress:
            break
    return body, stages


# ----------------------------------------------------------------------------- 2D regions

class Regions:
    """Planar regions in one sketch frame (faces on z = 0), with the boolean operations the decompositions need."""

    def __init__(self, scale: float):
        self.atol = max(1e-9, 1e-7 * scale * scale)

    def clean(self, shape) -> list[Face]:
        if shape is None:
            return []
        try:
            faces = shape.faces() if not isinstance(shape, Face) else [shape]
        except Exception:
            return []
        if not faces:
            return []
        if len(faces) > 1:
            faces = _unify(Compound(children=faces)).faces()
        else:
            faces = _unify(Compound(children=faces)).faces() or faces
        return [f for f in faces if f.area > self.atol]

    def union(self, *groups) -> list[Face]:
        faces = [f for g in groups for f in g]
        if not faces:
            return []
        if len(faces) == 1:
            return self.clean(faces[0])
        return self.clean(faces[0].fuse(*faces[1:]))

    def cut(self, a: list[Face], b: list[Face]) -> list[Face]:
        if not a:
            return []
        if not b:
            return list(a)
        out = []
        for f in a:
            out.extend(self.clean(f.cut(*b)))
        return out

    def inter(self, a: list[Face], b: list[Face]) -> list[Face]:
        if not a or not b:
            return []
        out = []
        for f in a:
            for g in b:
                try:
                    out.extend(self.clean(f.intersect(g)))
                except Exception:
                    continue
        return self.union(out) if len(out) > 1 else out

    @staticmethod
    def area(a: list[Face]) -> float:
        return sum(f.area for f in a)

    def empty(self, a: list[Face]) -> bool:
        return self.area(a) <= self.atol * max(1, len(a))

    def subset(self, a: list[Face], b: list[Face]) -> bool:
        return self.empty(self.cut(a, b))


def _section(body, frame: Plane, height: float, size: float) -> list[Face]:
    """The body cut by the plane at `height` along the frame normal, as faces in frame coordinates (z = 0)."""
    pl = Plane(origin=frame.origin + frame.z_dir * height, x_dir=frame.x_dir, z_dir=frame.z_dir)
    c = pl.to_local_coords(geometry.bbox(body).center())
    big = Face.make_rect(size, size, Plane(origin=pl.from_local_coords((c.X, c.Y, 0)), x_dir=pl.x_dir, z_dir=pl.z_dir))
    res = body & big
    faces = res.faces() if res is not None else []
    return [pl.to_local_coords(f) for f in faces]


# ----------------------------------------------------------------------------- sketches

class SketchBuilder:
    """Sketch entities from planar faces, plus relation and dimension candidates for Fully Define."""

    def __init__(self, sid: str, approx_note: list):
        self.sid = sid
        self.ents: list[dict] = []
        self.pts: dict[tuple, str] = {}
        self.n = 0
        self.curves: list[dict] = []
        self.approx = approx_note

    def _id(self, kind: str) -> str:
        self.n += 1
        return f"{self.sid}{kind}{self.n}"

    def point(self, x: float, y: float) -> str:
        key = (round(x, 6) + 0.0, round(y, 6) + 0.0)
        if key in self.pts:
            return self.pts[key]
        pid = self._id("p")
        self.ents.append({"id": pid, "type": "point", "x": round(x, 9) + 0.0, "y": round(y, 9) + 0.0})
        self.pts[key] = pid
        return pid

    def xy(self, pid: str) -> tuple[float, float]:
        e = next(e for e in self.ents if e["id"] == pid)
        return e["x"], e["y"]

    def add_face(self, face: Face, mapping):
        for w in [face.outer_wire(), *face.inner_wires()]:
            for e in w.edges():
                self.add_edge(e, mapping)

    def add_edge(self, e: Edge, mapping, construction: bool = False) -> str | None:
        gt = e.geom_type

        def m(p):
            return mapping(p.X, p.Y)
        if gt == GeomType.LINE:
            a, b = m(e.position_at(0)), m(e.position_at(1))
            if math.dist(a, b) < 1e-9:
                return None
            ent = {"id": self._id("l"), "type": "line", "p1": self.point(*a), "p2": self.point(*b)}
            if construction:
                ent["construction"] = True
        elif gt == GeomType.CIRCLE:
            c = m(e.arc_center)
            r = e.radius
            if e.is_closed:
                ent = {"id": self._id("c"), "type": "circle", "center": self.point(*c), "r": round(r, 9)}
            else:
                s, mid, t = m(e.position_at(0)), m(e.position_at(0.5)), m(e.position_at(1))
                ang = lambda q: math.atan2(q[1] - c[1], q[0] - c[0])  # noqa: E731
                a0, am, a1 = ang(s), ang(mid), ang(t)
                sweep = (a1 - a0) % (2 * math.pi)
                if (am - a0) % (2 * math.pi) > sweep:
                    s, t = t, s
                ent = {"id": self._id("a"), "type": "arc", "center": self.point(*c), "start": self.point(*s),
                       "end": self.point(*t)}
        else:
            pts = [m(e.position_at(k / 16)) for k in range(17)]
            closed = math.dist(pts[0], pts[-1]) < 1e-9
            ids = [self.point(*p) for p in (pts[:-1] if closed else pts)]
            if closed:
                ids.append(ids[0])
            ent = {"id": self._id("s"), "type": "spline", "points": ids}
            self.approx.append(self.sid)
        self.ents.append(ent)
        if not construction:
            self.curves.append(ent)
        return ent["id"]

    # -- Fully Define candidates, in the order SOLIDWORKS users usually think: relations, sizes, positions.
    def candidates(self) -> list[dict]:
        P = {e["id"]: (e["x"], e["y"]) for e in self.ents if e["type"] == "point"}
        xs = [p[0] for p in P.values()] or [0]
        ys = [p[1] for p in P.values()] or [0]
        size = max(max(xs) - min(xs), max(ys) - min(ys), 1.0)
        off = 0.06 * size
        cx, cy = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        out: list[dict] = []
        k = [0]

        def cid():
            k[0] += 1
            return f"{self.sid}k{k[0]}"
        lines = [e for e in self.curves if e["type"] == "line"]
        arcs = [e for e in self.curves if e["type"] == "arc"]
        circles = [e for e in self.curves if e["type"] == "circle"]
        for pid, (x, y) in P.items():
            if abs(x) < 1e-9 and abs(y) < 1e-9:
                out.append({"id": cid(), "type": "coincident", "refs": [pid, "origin"]})
        hv = set()
        for ln in lines:
            (x1, y1), (x2, y2) = P[ln["p1"]], P[ln["p2"]]
            if abs(y2 - y1) < 1e-9:
                out.append({"id": cid(), "type": "horizontal", "refs": [ln["id"]]})
                hv.add(ln["id"])
            elif abs(x2 - x1) < 1e-9:
                out.append({"id": cid(), "type": "vertical", "refs": [ln["id"]]})
                hv.add(ln["id"])
        # Tangent joints.
        ends = defaultdict(list)
        for e in lines:
            ends[e["p1"]].append(e)
            ends[e["p2"]].append(e)
        for e in arcs:
            ends[e["start"]].append(e)
            ends[e["end"]].append(e)

        def tangent_dir(e, pid):
            x, y = P[pid]
            if e["type"] == "line":
                o = e["p2"] if e["p1"] == pid else e["p1"]
                return (P[o][0] - x, P[o][1] - y)
            c = P[e["center"]]
            return (-(y - c[1]), x - c[0])  # perpendicular to the radius
        tangents = set()
        for pid, es in ends.items():
            if len(es) != 2 or all(e["type"] == "line" for e in es):
                continue
            a, b = (tangent_dir(e, pid) for e in es)
            na, nb = math.hypot(*a), math.hypot(*b)
            if na < 1e-12 or nb < 1e-12:
                continue
            if abs(a[0] * b[1] - a[1] * b[0]) / (na * nb) < 1e-6:
                out.append({"id": cid(), "type": "tangent", "refs": [es[0]["id"], es[1]["id"]]})
                tangents.add(pid)
        dims: list[dict] = []
        for c in circles:
            x, y = P[c["center"]]
            r = c["r"]
            dims.append({"id": cid(), "type": "diameter", "refs": [c["id"]], "value": _r(2 * r),
                         "label": [_r(x + (r + off) * 0.7071), _r(y + (r + off) * 0.7071)]})
        seen_r = set()
        for a in arcs:
            c = P[a["center"]]
            s = P[a["start"]]
            r = math.hypot(s[0] - c[0], s[1] - c[1])
            mx, my = (s[0] + P[a["end"]][0]) / 2 - c[0], (s[1] + P[a["end"]][1]) / 2 - c[1]
            nm = math.hypot(mx, my) or 1.0
            dims.append({"id": cid(), "type": "radius", "refs": [a["id"]], "value": _r(r),
                         "label": [_r(c[0] + mx / nm * (r + off)), _r(c[1] + my / nm * (r + off))]})
            seen_r.add(a["id"])
        for ln in sorted(lines, key=lambda e: -math.dist(P[e["p1"]], P[e["p2"]])):
            (x1, y1), (x2, y2) = P[ln["p1"]], P[ln["p2"]]
            L = math.hypot(x2 - x1, y2 - y1)
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            nx, ny = -(y2 - y1) / L, (x2 - x1) / L
            if nx * (mx - cx) + ny * (my - cy) < 0:
                nx, ny = -nx, -ny
            dims.append({"id": cid(), "type": "distance", "refs": [ln["id"]], "value": _r(L),
                         "label": [_r(mx + nx * off), _r(my + ny * off)]})
        # Angles between lines meeting at a corner when neither is horizontal or vertical.
        for pid, es in ends.items():
            ls = [e for e in es if e["type"] == "line"]
            if len(ls) != 2 or (ls[0]["id"] in hv and ls[1]["id"] in hv):
                continue
            a, b = (tangent_dir(e, pid) for e in ls)
            ang = math.degrees(abs(math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1])))
            if 1e-6 < ang < 180 - 1e-6:
                x, y = P[pid]
                dims.append({"id": cid(), "type": "angle", "refs": [ls[0]["id"], ls[1]["id"]], "value": _r(ang),
                             "label": [_r(x + off), _r(y + off)]})
        out.extend(dims)
        # Positions: tie each connected piece to the origin.
        parent = {pid: pid for pid in P}

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        for e in self.curves:
            ids = [e.get(q) for q in ("p1", "p2", "center", "start", "end") if e.get(q)] + list(e.get("points", []))
            for q in ids[1:]:
                ra, rb = find(ids[0]), find(q)
                if ra != rb:
                    parent[ra] = rb
        comps = defaultdict(list)
        for pid in P:
            comps[find(pid)].append(pid)
        centres = {c["center"] for c in circles} | {a["center"] for a in arcs}
        for pts in comps.values():
            anchor = next((p for p in pts if p in centres), None) or min(pts, key=lambda p: (P[p][0] + P[p][1], P[p][0]))
            x, y = P[anchor]
            for orient, val, rel in (("horizontal", x, "vertical"), ("vertical", y, "horizontal")):
                if abs(val) < 1e-9:
                    out.append({"id": cid(), "type": rel, "refs": [anchor, "origin"]})
                else:
                    lab = [_r(x / 2), _r(y + off)] if orient == "horizontal" else [_r(x + off), _r(y / 2)]
                    out.append({"id": cid(), "type": "distance", "refs": ["origin", anchor], "orient": orient,
                                "value": _r(abs(val)), "label": lab})
            ax, ay = P[anchor]
            for q in pts:
                if q == anchor:
                    continue
                x, y = P[q]
                for orient, val, rel in (("horizontal", x - ax, "vertical"), ("vertical", y - ay, "horizontal")):
                    if abs(val) < 1e-9:
                        out.append({"id": cid(), "type": rel, "refs": [anchor, q]})
                    else:
                        lab = [_r((x + ax) / 2), _r(y + off)] if orient == "horizontal" else [_r(x + off), _r((y + ay) / 2)]
                        out.append({"id": cid(), "type": "distance", "refs": [anchor, q], "orient": orient,
                                    "value": _r(abs(val)), "label": lab})
        return out

    def sketch(self, name: str, plane: dict) -> dict:
        return {"id": self.sid, "type": "sketch", "name": name, "plane": plane, "entities": self.ents, "constraints": [],
                "_candidates": self.candidates()}


def _define_sketches(sketches: list[dict], notes: list) -> None:
    """Keep the relation and dimension candidates the sketch solver says are independent (Fully Define)."""
    node = shutil.which("node")
    todo = [s for s in sketches if s.get("_candidates")]
    if not todo:
        for s in sketches:
            s.pop("_candidates", None)
        return
    res = {}
    if node:
        req = {"sketches": [{"id": s["id"], "entities": s["entities"], "constraints": s["constraints"],
                             "candidates": s["_candidates"]} for s in todo]}
        try:
            out = subprocess.run([node, str(DEFINE_CLI)], input=json.dumps(req), capture_output=True, text=True,
                                 timeout=120)
            res = json.loads(out.stdout or "{}")
        except Exception as exc:
            notes.append(f"Sketch dimensions were not added ({type(exc).__name__}).")
    else:
        notes.append("Sketch dimensions were not added: the server has no node to run the sketch solver.")
    for s in sketches:
        cands = s.pop("_candidates", [])
        r = res.get(s["id"]) or {}
        keep = set(r.get("accepted") or [])
        n = 0
        for c in cands:
            if c["id"] in keep:
                if c["type"] in ("distance", "diameter", "radius", "angle"):
                    n += 1
                    c["name"] = f"D{n}"
                s["constraints"].append(c)
        if r:
            s["_dof"] = r.get("dof")
            s["_status"] = r.get("status")


# ----------------------------------------------------------------------------- base: extrudes

@dataclass
class Op:
    op: str               # boss | cut
    lo: int               # level indices; the material/cut spans heights[lo]..heights[hi]
    hi: int
    regions: list         # faces in the frame (z = 0)
    from_top: bool = False  # sketch at heights[hi], extruded down (cuts from the top, or the base reversed)
    base: bool = False


def _prismatic(topo: Topo, d: Vector) -> list[float] | None:
    """Heights of the planar caps across `d` when every other face runs along `d`; None if it is not an extrusion."""
    hs = []
    for f, s in zip(topo.faces, topo.surfs):
        if s.kind == "plane":
            if _par(s.normal, d):
                hs.append(s.origin.dot(d))
            elif abs(s.normal.dot(d)) > 1e-7:
                return None
        elif s.kind in ("cylinder", "extrusion"):
            if not _par(s.axis, d):
                return None
        elif s.kind == "other":
            for u in (0.1, 0.5, 0.9):
                for v in (0.1, 0.5, 0.9):
                    try:
                        if abs(f.normal_at(f.position_at(u, v)).dot(d)) > 1e-6:
                            return None
                    except Exception:
                        return None
        else:
            return None
    hs.sort()
    out = []
    for h in hs:
        if not out or h - out[-1] > topo.tol:
            out.append(h)
    return out if len(out) >= 2 else None


def _frame_for(d: Vector) -> tuple[str | None, Vector]:
    for name, n in STD_FOR_AXIS:
        if _par(d, n):
            return name, n
    return None, _canon(d)


def _cut_plan(R: Regions, slabs: list[list[Face]]) -> list[Op] | None:
    n = len(slabs)
    S = R.union(*slabs)
    E = [R.cut(S, s) for s in slabs]
    ops = [Op("boss", 0, n, S, base=True)]
    cover = [[] for _ in range(n)]
    acc = None
    for k in range(n - 1, 0, -1):          # from the top down to level k
        acc = E[k] if acc is None else R.inter(acc, E[k])
        if R.empty(acc):
            break
        top = R.cut(acc, E[k - 1])
        if not R.empty(top):
            ops.append(Op("cut", k, n, top, from_top=True))
            for i in range(k, n):
                cover[i].extend(top)
    acc = None
    for k in range(0, n - 1):              # from the bottom up to level k + 1
        acc = E[k] if acc is None else R.inter(acc, E[k])
        if R.empty(acc):
            break
        bot = R.cut(acc, E[k + 1])
        if not R.empty(bot):
            ops.append(Op("cut", 0, k + 1, bot))
            for i in range(0, k + 1):
                cover[i].extend(bot)
    for i in range(n):  # every slab must come out right
        got = R.cut(S, cover[i]) if cover[i] else S
        if not (R.subset(got, slabs[i]) and R.subset(slabs[i], got)):
            return None
    return ops


def _boss_plan(R: Regions, slabs: list[list[Face]]) -> list[Op]:
    n = len(slabs)
    covered = [[] for _ in range(n)]
    ops = []
    for i in range(n):
        new = R.cut(slabs[i], covered[i]) if covered[i] else list(slabs[i])
        for comp in new:
            k = 1
            while i + k < n and R.subset([comp], slabs[i + k]):
                k += 1
            ops.append(Op("boss", i, i + k, [comp], base=not ops))
            for j in range(i, i + k):
                covered[j] = R.union(covered[j], [comp])
    merged: dict[tuple, Op] = {}
    for o in ops:
        key = (o.lo, o.hi)
        if key in merged:
            merged[key].regions.extend(o.regions)
        else:
            merged[key] = o
    return list(merged.values())


def _interior(R: Regions, regions: list[Face], outline: list[Face]) -> bool:
    """A cut region that stays inside the outline (a pocket), not one that eats into its edge (a step)."""
    try:
        outer = [Face(f.outer_wire()) for f in outline]
    except Exception:
        return False
    for f in regions:
        for e in f.outer_wire().edges():
            if any(o.outer_wire().distance_to(e.position_at(0.5)) < 1e-7 for o in outer):
                return False
    return True


@dataclass
class BasePlan:
    kind: str                 # extrude | revolve
    feats: list               # feature dicts (sketches carry _candidates)
    ops: int
    body: object              # the solid these features must make
    sketch_holes: list = field(default_factory=list)  # hole stages now drawn in the base sketch
    note: str = ""


class Namer:
    def __init__(self, existing: list[dict]):
        self.used_ids = {f.get("id") for f in existing}
        self.names = [f.get("name") or "" for f in existing]
        self.k = 0

    def id(self, prefix: str = "fw") -> str:
        while True:
            self.k += 1
            fid = f"{prefix}{self.k}"
            if fid not in self.used_ids:
                self.used_ids.add(fid)
                return fid

    def name(self, base: str) -> str:
        n = 0
        for s in self.names:
            m = re.fullmatch(re.escape(base) + r"(\d+)", s)
            if m:
                n = max(n, int(m.group(1)))
        out = f"{base}{n + 1}"
        self.names.append(out)
        return out


def _extrude_plans(ctx: Ctx, body, holes: list[Stage], namer_seed: list[dict]) -> list[BasePlan]:
    topo = Topo(body)
    R = Regions(topo.scale)
    dirs = []
    for f, s in zip(topo.faces, topo.surfs):
        n = s.normal if s.kind == "plane" else s.axis if s.kind == "cylinder" else None
        if n is None:
            continue
        n = _canon(n)
        for item in dirs:
            if _par(item[0], n):
                item[1] += f.area if s.kind == "plane" else 0
                break
        else:
            dirs.append([n, f.area if s.kind == "plane" else 0])
    dirs.sort(key=lambda x: -x[1])
    plans = []
    size = topo.scale * 4
    for d, cap_area in dirs[:8]:
        if not ctx.time_left():
            break
        std, N = _frame_for(d)
        levels = _prismatic(topo, N)
        if levels is None or len(levels) - 1 > MAX_LEVELS:
            continue
        frame = Plane(origin=(0, 0, 0), x_dir=_xdir_for(N), z_dir=N)
        try:
            slabs = [_section(body, frame, (levels[i] + levels[i + 1]) / 2, size) for i in range(len(levels) - 1)]
        except Exception:
            continue
        slabs = [R.clean(Compound(children=s)) if s else [] for s in slabs]
        if any(not s for s in slabs):
            continue
        # Through holes along this direction that run through every slab they meet: circles in the sketches.
        in_sketch = []
        for hs in holes:
            m = hs.meta
            if not (m.get("through") and hs.feat.get("style") == "simple" and _par(m["axis"], N)):
                continue
            c = frame.to_local_coords(m["centre"])
            disk = Face(Wire([Edge.make_circle(m["radius"], Plane(origin=(c.X, c.Y, 0)))]))
            ok = True
            lo_t, hi_t = sorted(((m["centre"]).dot(N), (m["centre"] + m["axis"] * m["length"]).dot(N)))
            for i, s in enumerate(slabs):
                a = R.area(R.inter([disk], s))
                full = abs(a - disk.area) <= R.atol * 10 + 1e-9 * disk.area
                none = a <= R.atol * 10
                mid = (levels[i] + levels[i + 1]) / 2
                if not (full or none) or (full and not (lo_t - topo.tol <= mid <= hi_t + topo.tol)):
                    ok = False
                    break
            if ok:
                in_sketch.append((hs, disk))
        if in_sketch:
            disks = [dk for _, dk in in_sketch]
            slabs = [R.cut(s, disks) for s in slabs]
        heights = levels
        cands = []
        cut = _cut_plan(R, slabs)
        boss = _boss_plan(R, slabs)
        if cut is not None:
            interior = all(_interior(R, o.regions, cut[0].regions) for o in cut[1:])
            cands.append((len(cut), 0 if interior else 1, cut))
        cands.append((len(boss), 0.5, boss))
        cands.sort(key=lambda c: (c[0], c[1]))
        ops = cands[0][2]
        feats = _ops_to_features(ops, heights, std, N, frame, namer_seed, slabs, R)
        target = body
        if in_sketch:
            tools = []
            for hs, _ in in_sketch:
                m = hs.meta
                tools.append(Solid.make_cylinder(m["radius"], m["length"],
                                                 Plane(origin=m["centre"], x_dir=_xdir_for(m["axis"]), z_dir=m["axis"])))
            target = body
            for t in tools:
                target = geometry.solid_of(target - t)
        plans.append(BasePlan("extrude", feats, len(ops), target, [hs for hs, _ in in_sketch],
                              note=f"{len(ops)} extrude{'s' if len(ops) != 1 else ''} along {geometry.vlist(N)}"))
        if len(ops) == 1:
            break
    return plans


def _ops_to_features(ops: list[Op], h: list[float], std: str | None, N: Vector, frame: Plane, existing: list[dict],
                     slabs=None, R: Regions | None = None) -> list[dict]:
    namer = Namer(existing)
    feats: list[dict] = []
    tol = 1e-7 * max(1.0, max(abs(x) for x in h))

    def flat_plane(height: float) -> tuple[dict, int]:
        """A plane at `height` with normal +N: a standard plane, else a reference plane feature."""
        if abs(height) < tol and std:
            return {"ref": std}, 1
        if std:
            pid = namer.id("fwpl")
            feats.append({"id": pid, "type": "plane", "name": namer.name("Plane"), "base": {"ref": std},
                          "offset": _r(height), "hidden": True})
            return {"ref": pid}, 1
        spec, _ = _plane_spec(N * height, N, "fixed")
        return spec, 1

    for o in ops:
        sid = namer.id("fws")
        sk_name = namer.name("Sketch")
        fid = namer.id("fwf")
        depth = h[o.hi] - h[o.lo]
        flip = 1
        extra: dict = {}
        if o.base:
            lo, hi = h[o.lo], h[o.hi]
            if std and abs(lo + hi) < tol:
                plane, flip = {"ref": std}, 1
                extra = {"end": "midplane"}
            elif abs(hi) < tol and std:
                plane, flip = {"ref": std}, 1
                extra = {"reverse": True}
            else:
                plane, flip = flat_plane(lo)
        elif o.op == "cut" and o.from_top:
            spec, _ = _plane_spec(N * h[o.hi], N, "face")
            plane, flip = spec, 1
            extra = {"reverse": True}
        elif o.op == "cut":
            spec, _ = _plane_spec(N * h[o.lo], -N, "face")
            plane, flip = spec, -1
            extra = {"reverse": True}
        else:  # a boss starting at h[lo]
            plane, flip = flat_plane(h[o.lo])
            if o.lo > 0 and slabs is not None and all(R.subset([f], slabs[o.lo - 1]) for f in o.regions):
                # On top of material already there: attach to that face so it follows the depth below it.
                if isinstance(plane, dict) and plane.get("ref", "").startswith("fwpl"):
                    feats[:] = [f for f in feats if f["id"] != plane["ref"]]
                    namer.names.pop()
                plane, _ = _plane_spec(N * h[o.lo], N, "face")
        sb = SketchBuilder(sid, [])
        mapping = (lambda x, y: (x, y)) if flip == 1 else (lambda x, y: (x, -y))
        for f in o.regions:
            sb.add_face(f, mapping)
        sk = sb.sketch(sk_name, plane)
        if sb.approx:
            sk["_approx"] = True
        feats.append(sk)
        name = namer.name("Boss-Extrude" if o.op == "boss" else "Cut-Extrude")
        feat = {"id": fid, "type": "extrude", "name": name, "sketch": sid, "op": o.op, "end": "blind",
                "depth": _r(depth)}
        feat.update(extra)
        if feat.get("end") == "midplane":
            feat.pop("reverse", None)
        feats.append(feat)
    return feats


# ----------------------------------------------------------------------------- base: revolve

def _revolve_plan(ctx: Ctx, body, existing: list[dict]) -> BasePlan | None:
    topo = Topo(body)
    axis = None
    for s in topo.surfs:
        if s.kind in ("cylinder", "cone", "torus", "revolution"):
            axis = (s.origin, s.axis)
            break
    if axis is None:
        return None
    o, a = axis
    for f, s in zip(topo.faces, topo.surfs):
        if s.kind == "plane":
            if not _par(s.normal, a):
                return None
        elif s.kind in ("cylinder", "cone", "torus", "revolution"):
            if not _coaxial(s, o, a, topo.tol):
                return None
        elif s.kind == "sphere":
            if _line_dist(s.origin, o, a) > topo.tol:
                return None
        else:
            return None
    a = _canon(a)
    o = o - a * o.dot(a)  # the axis point nearest the origin
    plane_spec, pl = None, None
    for name, n in STD_FOR_AXIS:
        if abs(n.dot(a)) < 1e-9 and abs(o.dot(n)) < topo.tol:
            pl = geometry.STD_PLANES[name]
            plane_spec = {"ref": name}
            break
    if pl is None:
        w = min((Vector(1, 0, 0), Vector(0, 1, 0), Vector(0, 0, 1)), key=lambda x: abs(x.dot(a)))
        n = a.cross(w).normalized()
        plane_spec, pl = _plane_spec(o, n, "fixed")
    u = pl.z_dir.cross(a).normalized()   # in the plane, across the axis
    bb = geometry.bbox(body)
    L = bb.diagonal * 2 + 10
    corners = [o - a * L, o + a * L, o + a * L + u * L, o - a * L + u * L]
    from build123d import Polyline, make_face
    try:
        half = make_face(Polyline(*corners, close=True))
        res = body & half
        faces = res.faces() if res is not None else []
    except Exception:
        return None
    if not faces:
        return None
    namer = Namer(existing)
    sid, fid = namer.id("fws"), namer.id("fwf")
    sb = SketchBuilder(sid, [])
    loc = [pl.to_local_coords(f) for f in faces]
    for f in loc:
        sb.add_face(f, lambda x, y: (x, y))
    ts = [(v - o).dot(a) for f in faces for v in (f.bounding_box().min, f.bounding_box().max)]
    p0 = pl.to_local_coords(o + a * (min(ts) - 0.1 * bb.diagonal))
    p1 = pl.to_local_coords(o + a * (max(ts) + 0.1 * bb.diagonal))
    axis_id = sb.add_edge(Edge.make_line(p0, p1), lambda x, y: (x, y), construction=True)
    sk = sb.sketch(namer.name("Sketch"), plane_spec)
    if sb.approx:
        sk["_approx"] = True
    feats = [sk, {"id": fid, "type": "revolve", "name": namer.name("Revolve"), "sketch": sid, "axis": axis_id,
                  "angle": 360, "op": "boss"}]
    return BasePlan("revolve", feats, 1, body, note="one revolve")


# ----------------------------------------------------------------------------- building and checking

def _match_edges(part, targets: list, scale: float) -> list[dict] | None:
    """Edge refs on the rebuilt body for edges found on the recognition body: every rebuilt edge lying along one of
    them (an edge can come back split in pieces, or as part of a longer edge)."""
    tol = max(1e-6 * scale, 1e-6)
    out, seen = [], set()
    edges = part.edges()

    def on(a, b):  # every sample of a lies on b
        try:
            return all(b.distance_to(a.position_at(q)) <= tol for q in (0.2, 0.5, 0.8))
        except Exception:
            return False
    for t in targets:
        hit = False
        for e in edges:
            if e.geom_type != t.geom_type or not (on(e, t) or on(t, e)):
                continue
            hit = True
            k = hash(e.wrapped)
            if k not in seen:
                seen.add(k)
                out.append({"mid": geometry.vlist(e.position_at(0.5))})
        if not hit:
            return None
    return out


def _build(feats: list[dict], ctx: Ctx, stages: list[Stage], namer: Namer) -> tuple[list[dict], object, list[str]]:
    """Rebuild base features, then each stage in the order it was made, filling fillet and chamfer edges from the
    rebuilt body. After each stage the body must have the volume it had when that feature was recognised.
    Returns (features, body, problems)."""
    st = geometry.RegenState()
    in_place = not any(s.in_sketch for s in stages)  # holes drawn in the sketch shift later volumes on purpose
    ctx.built = []
    out, problems = [], []
    for f in feats:
        _, status = geometry.rebuild_feature(f, st)
        if status["state"] == "error":
            problems.append(f"{f.get('name')}: {status.get('message')}")
            return out, None, problems
        out.append(f)
    fwd = [x for x in reversed(stages) if not x.in_sketch]
    i = 0
    while i < len(fwd):
        s = fwd[i]
        # Fillets (or chamfers) of one size found in separate packs: one feature when OpenCascade takes them together.
        run = [s]
        while (s.kind in ("fillet", "chamfer") and i + len(run) < len(fwd) and fwd[i + len(run)].kind == s.kind
               and fwd[i + len(run)].feat == s.feat):
            run.append(fwd[i + len(run)])
        if len(run) > 1:
            refs = []
            for x in run:
                got = _match_edges(st.part, x.edges, ctx.scale)
                if not got:
                    refs = None
                    break
                refs += [r for r in got if r not in refs]
            if refs:
                f = {"id": "merge", **copy.deepcopy(s.feat), "edges": refs}
                before = st.part
                _, status = geometry.rebuild_feature(f, st)
                ok = status["state"] != "error" and st.part is not None
                if ok and in_place and run[-1].vol_before:
                    try:
                        ok = abs(st.part.volume - run[-1].vol_before) <= ctx.vtol
                    except Exception:
                        ok = False
                if ok:
                    f["id"] = namer.id("fwf")
                    f["name"] = namer.name({"fillet": "Fillet", "chamfer": "Chamfer"}[s.kind])
                    st.diagnostics[f["id"]] = st.diagnostics.pop("merge", {})
                    out.append(f)
                    ctx.built.extend(run)
                    i += len(run)
                    continue
                st.part = before
        i += 1
        f = {"id": namer.id("fwf"), **copy.deepcopy(s.feat)}
        base = {"fillet": "Fillet", "chamfer": "Chamfer", "hole": "Hole"}[s.kind]
        f["name"] = namer.name(base)
        if s.kind in ("fillet", "chamfer"):
            refs = _match_edges(st.part, s.edges, ctx.scale)
            if not refs:
                problems.append(f"{f['name']}: its edges are not on the rebuilt body")
                ctx.bad.add(s.sig)
                continue
            f["edges"] = refs
        before = st.part
        _, status = geometry.rebuild_feature(f, st)
        if status["state"] == "error":
            st.part = before
            problems.append(f"{f['name']}: {status.get('message')}")
            ctx.bad.add(s.sig)
            continue
        out.append(f)
        ctx.built.append(s)
        if s.vol_before and st.part is not None and in_place:
            try:
                drift = abs(st.part.volume - s.vol_before)
            except Exception:
                drift = 0.0
            if drift > ctx.vtol:
                problems.append(f"{f['name']} rebuilds {drift:.3g} mm3 away from the import")
                ctx.bad.add(s.sig)
    return out, st.part, problems


def _name_refs(feats: list[dict]) -> None:
    """Persistent names on fillet and chamfer edges (naming.py), so they stay on their edges when an earlier depth
    or size is edited, as picks made in the app do."""
    from . import naming
    if not any(f["type"] in ("fillet", "chamfer") for f in feats):
        return
    try:
        feats[:] = naming.annotate_all(feats, ("fillet", "chamfer"))
    except Exception:
        pass


def _hole_patterns(feats: list[dict], namer: Namer) -> list[dict]:
    """Holes with the same size on the same plane in an evenly spaced row become one hole and a linear pattern."""
    holes = [f for f in feats if f["type"] == "hole"]
    groups = defaultdict(list)
    for f in holes:
        key = json.dumps({k: v for k, v in f.items() if k not in ("id", "name", "x", "y")}, sort_keys=True)
        groups[key].append(f)
    drop, add = set(), {}
    for items in groups.values():
        if len(items) < 3:
            continue
        pts = [(f["x"], f["y"]) for f in items]
        # A straight row with equal steps.
        order = sorted(range(len(pts)), key=lambda i: pts[i])
        p = [pts[i] for i in order]
        dx, dy = p[1][0] - p[0][0], p[1][1] - p[0][1]
        step = math.hypot(dx, dy)
        if step < 1e-6:
            continue
        if not all(abs((p[i][0] - p[0][0]) - dx * i) < 1e-6 and abs((p[i][1] - p[0][1]) - dy * i) < 1e-6
                   for i in range(len(p))):
            continue
        seed = items[order[0]]
        spec = seed["plane"]
        xd, n = Vector(*spec["xdir"]), Vector(*spec["normal"])
        yd = n.cross(xd)
        v = (xd * dx + yd * dy).normalized()
        add[seed["id"]] = {"id": namer.id("fwf"), "type": "linear_pattern", "name": namer.name("LPattern"),
                           "features": [seed["id"]], "direction": {"vector": geometry.vlist(v)}, "count": len(p),
                           "spacing": _r(step)}
        drop.update(f["id"] for f in items if f is not seed)
    if not add:
        return feats
    out = []
    for f in feats:
        if f["id"] in drop:
            continue
        out.append(f)
        if f["id"] in add:
            out.append(add[f["id"]])
    return out


def _counts(feats: list[dict]) -> dict:
    c: dict[str, int] = defaultdict(int)
    for f in feats:
        t = f["type"]
        if t == "extrude":
            t = "cut" if f.get("op") == "cut" else "extrude"
        c[t] += 1
    return dict(c)


def _main_direction(topo: Topo) -> Vector | None:
    """The direction most of the body runs along (caps across it, walls along it), with cap area counted twice so a
    plate's direction is through its thickness; None when under half the surface fits any direction. Round corners
    whose axis runs along it are arcs in an extrusion's sketch, not fillet features."""
    total = sum(f.area for f in topo.faces) or 1.0
    best, keep = (0.0, 0.0), None
    seen: list[Vector] = []
    for s in topo.surfs:
        if s.kind != "plane" or any(_par(s.normal, d) for d in seen):
            continue
        d = s.normal
        seen.append(d)
        fit = cap = 0.0
        for g, t in zip(topo.faces, topo.surfs):
            if t.kind == "plane" and _par(t.normal, d):
                fit += g.area
                cap += g.area
            elif t.kind == "plane" and abs(t.normal.dot(d)) < 1e-7 or t.kind == "cylinder" and _par(t.axis, d):
                fit += g.area
        if fit / total >= 0.5 and fit + cap > best[1]:
            best, keep = (fit / total, fit + cap), _canon(d)
    return keep


def recognize_body(body, kinds=None, existing: list[dict] | None = None, time_limit: float = TIME_LIMIT,
                   source: dict | None = None, stop=None, skip=(), resume=None, on_stage=None) -> dict:
    """Recognise features on one solid. Returns {ok, features, report}; `features` replace the import feature.
    A recognised fillet, chamfer or hole that OpenCascade will not build again on the recognised tree (it splits
    faces differently there) is left in the body and the recognition runs again, at most twice."""
    t0 = time.monotonic()
    skip = set(skip or ())
    res = None
    for _ in range(3):
        left = time_limit - (time.monotonic() - t0)
        if res is not None and left < 5:
            break
        bad: set = set()
        res = _recognize_once(body, kinds, existing, left, source, stop, skip, bad, resume, on_stage)
        resume = None  # a second pass starts again from the import
        if not bad or res["report"].get("exact") or (stop is not None and stop()):
            break
        for b in bad:
            skip |= _bad_keys(b)
        if on_stage is not None:
            on_stage(None, None)  # the saved progress held a stage that will not rebuild: drop it
    res["report"]["seconds"] = round(time.monotonic() - t0, 2)
    notes = res["report"].get("notes") or []
    res["report"]["notes"] = list(dict.fromkeys(notes))
    return res


def _recognize_once(body, kinds, existing, time_limit, source, stop, skip, bad: set, resume=None, on_stage=None) -> dict:
    t0 = time.monotonic()
    kinds = set(kinds or KINDS)
    unknown = kinds - set(KINDS)
    if unknown:
        raise RecognizeError(f"Unknown feature kinds: {', '.join(sorted(unknown))}. Use {', '.join(KINDS)}.")
    existing = existing or []
    body = geometry.solid_of(body)
    if body is None or not hasattr(body, "volume"):
        raise RecognizeError("The imported data has no solid")
    if len(body.solids()) != 1:
        raise RecognizeError("The imported body has several solids; recognition works on one solid at a time")
    V0 = body.volume
    topo0 = Topo(body)
    ctx = Ctx(volume=V0, scale=topo0.scale, deadline=t0 + time_limit, kinds=kinds, stop=stop, skip=set(skip or ()),
              bad=bad, on_stage=on_stage)
    # The main direction: the one most faces run along, so round corners of an extruded outline stay sketch arcs.
    keep = _main_direction(topo0)
    failed: set = ctx.failed
    stages: list[Stage] = []
    cur = body
    if resume:  # a worker that was stopped saved what it had recognised: carry on from there
        cur = resume["cur"]
        stages = list(resume["stages"])
        ctx.log = list(stages)
        ctx.skip |= set(resume.get("failed") or ())
    for rnd in range(2):
        while ctx.time_left():
            n0 = len(stages)
            if "fillets" in kinds:
                cur, got = _fillets(ctx, cur, keep, failed)
                stages += got
            if "chamfers" in kinds:
                cur, got = _chamfers(ctx, cur, keep, failed)
                stages += got
            if len(stages) == n0:
                break
        if rnd == 0 and "holes" in kinds:
            cur, got = _holes(ctx, cur, failed)
            stages += got
            if not got:
                break
    hole_stages = [s for s in stages if s.kind == "hole"]
    plans: list[BasePlan] = []
    _mark("base")
    if "base" in ctx.skip:
        ctx.notes.append("The base was skipped: OpenCascade stopped responding while reading it.")
    else:
        if "extrudes" in kinds and ctx.time_left():
            plans += _extrude_plans(ctx, cur, hole_stages, existing)
        if "revolves" in kinds and ctx.time_left():
            rp = _revolve_plan(ctx, cur, existing)
            if rp is not None:
                plans.append(rp)
    plans.sort(key=lambda p: (p.ops, -len(p.sketch_holes), 0 if p.kind == "extrude" else 1))
    notes = ctx.notes
    chosen, base_feats = None, None
    for plan in plans:
        if not ctx.time_left():
            break
        sk = [f for f in plan.feats if f["type"] == "sketch"]
        _define_sketches(sk, notes)
        st, _ = geometry.regen({"features": plan.feats})
        if _fix_face_planes(plan.feats, st):
            st, _ = geometry.regen({"features": plan.feats})
        if any(s.get("state") == "error" for s in st.status) or st.part is None:
            continue
        if ctx.same(geometry.solid_of(st.part), plan.body):
            chosen, base_feats = plan, plan.feats
            break
    def attempt(plan):
        """Build the tree on a recognised base (or on what is left of the import) and compare it with the import."""
        for hs in hole_stages:
            hs.in_sketch = bool(plan and hs in plan.sketch_holes)
        namer = Namer(existing + (plan.feats if plan else []))
        if plan is None:
            from . import importer
            imp = {"id": namer.id("fwimp"), "type": "import", "name": namer.name("Imported"), "format": "brep",
                   "data": importer.encode_shape(cur), **({k: source[k] for k in ("source", "label") if k in source} if source else {})}
            base = [imp]
        else:
            base = plan.feats
        feats, final, problems = _build(base, ctx, stages, namer)
        if final is None:
            return None
        feats = [{k: v for k, v in f.items() if not k.startswith("_")} for f in feats]
        _name_refs(feats)
        feats = _hole_patterns(feats, namer)
        k = 0
        for f in feats:  # number the holes in tree order once patterns have taken their copies
            if f["type"] == "hole" and re.fullmatch(r"Hole\d+", f.get("name", "")):
                k += 1
                f["name"] = f"Hole{k}"
        st, _ = geometry.regen({"features": feats})
        final = geometry.solid_of(st.part) if st.part is not None else None
        errors = [x for x in st.status if x.get("state") == "error"]
        ok, d = same_solid(final, body, ctx.vtol, ctx.ltol)
        return {"feats": feats, "base": base, "problems": problems, "errors": errors, "diff": d,
                "exact": ok and not errors and not problems}

    base_note = ""
    _mark("base" if chosen is not None else "build")
    got = attempt(chosen) if chosen is not None else None
    _mark("build")
    if chosen is not None and (got is None or not got["exact"]) and stages:
        # The recognised base did not take every local feature back exactly (OpenCascade can split an edge or a
        # face differently): keep the local features on what is left of the import instead.
        alt = attempt(None)
        if alt is not None and (got is None or alt["exact"] or alt["diff"] < got["diff"]):
            got, chosen = alt, None
            base_note = ("The base was recognized, but the fillets, chamfers or holes did not rebuild exactly on it, "
                         "so the base stays an imported body.")
    elif chosen is None:
        base_note = "The base body is not a set of extrudes along one direction or a revolve, so it stays an imported body."
        if not stages:
            return {"ok": False, "features": None, "report": {
                "recognized": 0, "message": "No features recognized. " + base_note,
                "seconds": round(time.monotonic() - t0, 2), "notes": notes}}
        got = attempt(None)
    _mark(None)
    if got is None:
        return {"ok": False, "features": None, "report": {"recognized": 0, "message": "Rebuild failed",
                                                          "seconds": round(time.monotonic() - t0, 2), "notes": notes}}
    feats, d, errors, exact = got["feats"], got["diff"], got["errors"], got["exact"]
    base_feats = got["base"]
    counts = _counts(feats)
    report = {
        "recognized": sum(v for k, v in counts.items() if k not in ("sketch", "plane", "import")),
        "base": chosen.kind if chosen else "import",
        "counts": counts,
        "exact": exact,
        "import_volume": round(V0, 3),
        "difference_mm3": round(d, 6) if math.isfinite(d) else None,
        "seconds": round(time.monotonic() - t0, 2),
        "sketches": {f["name"]: {"dof": f.get("_dof"), "status": f.get("_status")}
                     for f in (base_feats or []) if f.get("type") == "sketch" and "_dof" in f},
        "notes": notes + got["problems"] + ([base_note] if base_note else []),
        "checks": ctx.checks,
        "faces": _face_kinds(ctx.built),
    }
    if any(f.get("_approx") for f in (base_feats or [])):
        report["notes"].append("A sketch holds spline curves, drawn through points on the original curve; the "
                               "result is close but not exact.")
    if stop is not None and stop():
        report["notes"].append("Stopped; what was not recognized stays in the imported body.")
    elif not ctx.time_left():
        report["notes"].append(f"Stopped after {int(time_limit)} s; what was not recognized stays in the imported body.")
    if errors:
        report["notes"].append("The recognized tree has rebuild errors: " +
                               "; ".join(str(e.get("message")) for e in errors[:3]))
    report["message"] = _message(report)
    approx = any(f.get("_approx") for f in (base_feats or []))
    return {"ok": bool(feats) and not errors and (exact or (approx and d <= 1e-3 * V0)), "features": feats,
            "report": report}


def _face_kinds(built: list) -> dict:
    """Centres of the import's faces each kind of recognised feature took, for the PropertyManager's preview."""
    out: dict[str, list] = {}
    for st in built:
        if not st.in_sketch:
            out.setdefault(st.kind, []).extend(st.centers)
    return out


def _message(rep: dict) -> str:
    c = rep.get("counts", {})
    parts = []
    for key, word in (("extrude", "boss extrude"), ("cut", "cut extrude"), ("revolve", "revolve"), ("hole", "hole"),
                      ("linear_pattern", "hole pattern"), ("chamfer", "chamfer"), ("fillet", "fillet")):
        if c.get(key):
            parts.append(f"{c[key]} {word}{'s' if c[key] != 1 else ''}")
    head = ("Recognized " + ", ".join(parts) + ".") if parts else "Nothing recognized."
    if rep.get("base") == "import":
        head += " The base stays an imported body."
    if rep.get("exact"):
        head += " Same solid as the import."
    elif rep.get("difference_mm3") is not None:
        head += f" Differs from the import by {rep['difference_mm3']:g} mm3."
    return head


# ----------------------------------------------------------------------------- documents

def _import_index(part: dict, feature_id: str | None = None) -> int:
    feats = part.get("features", [])
    for i, f in enumerate(feats):
        if f.get("type") == "import" and (feature_id is None or f.get("id") == feature_id):
            if any(g.get("type") not in ("sketch", "plane") for g in feats[:i]):
                raise RecognizeError("Feature recognition works on an imported body that comes first in the tree; "
                                     "this one has solid features before it.")
            return i
    raise RecognizeError("This part has no imported body to recognize" if feature_id is None
                         else f"No imported body with id {feature_id!r}")


def recognize_part(part: dict, kinds=None, feature_id: str | None = None, time_limit: float = TIME_LIMIT,
                   stop=None, skip=(), resume=None, on_stage=None) -> dict:
    """Recognise the part's imported body. Returns {ok, part (a new part document or None), report}."""
    from . import importer
    i = _import_index(part, feature_id)
    feats = part.get("features", [])
    imp = feats[i]
    if not imp.get("data") or str(imp["data"]).startswith("<omitted"):
        raise RecognizeError("The imported body's data is missing")
    body = importer.decode_shape(imp["data"])
    others = feats[:i] + feats[i + 1:]
    res = recognize_body(body, kinds, existing=others, time_limit=time_limit, source=imp, stop=stop, skip=skip,
                         resume=resume, on_stage=on_stage)
    rep = res["report"]
    rep["import"] = imp.get("name") or imp.get("id")
    if not res["ok"]:
        return {"ok": False, "part": None, "report": rep}
    new = copy.deepcopy(part)
    new["features"] = feats[:i] + res["features"] + feats[i + 1:]
    rb = part.get("rollback")
    if rb is not None and rb > i:
        new["rollback"] = rb + len(res["features"]) - 1
    return {"ok": True, "part": new, "report": rep}


HANG_SECONDS = 20.0   # one OpenCascade step taking this long has hung (they take under 3 s on a 300-face part)
MAX_RESTARTS = 6


def _save_checkpoint(path: str, ctx, cur) -> None:
    """What a worker has recognised so far, so a restarted worker carries on instead of starting again."""
    from . import importer
    if ctx is None:
        try:
            os.unlink(path)
        except OSError:
            pass
        return
    vec = lambda v: [v.X, v.Y, v.Z] if isinstance(v, Vector) else v  # noqa: E731
    data = {"cur": importer.encode_shape(cur), "failed": sorted(repr(x) for x in ctx.failed),
            "stages": [{"kind": st.kind, "feat": st.feat, "sig": st.sig, "faces": st.faces, "vol": st.vol_before,
                        "centers": st.centers,
                        "meta": {k: vec(v) for k, v in st.meta.items()},
                        "edges": importer.encode_shape(Compound(children=st.edges)) if st.edges else None}
                       for st in ctx.log]}
    tmp = path + ".tmp"
    with open(tmp, "w") as fh:
        json.dump(data, fh)
    os.replace(tmp, path)


def _load_checkpoint(path: str) -> dict | None:
    from build123d import import_brep
    from . import importer
    try:
        with open(path) as fh:
            data = json.load(fh)
    except (OSError, ValueError):
        return None

    def edges_of(blob):
        if not blob:
            return []
        import base64
        import tempfile
        import zlib
        fd, p = tempfile.mkstemp(suffix=".brep")
        os.close(fd)
        try:
            with open(p, "wb") as fh:
                fh.write(zlib.decompress(base64.b64decode(blob)))
            return import_brep(p).edges()
        finally:
            os.unlink(p)
    try:
        stages = []
        for d in data["stages"]:
            meta = {k: Vector(*v) if isinstance(v, list) and len(v) == 3 else v for k, v in d["meta"].items()}
            stages.append(Stage(d["kind"], None, None, d["feat"], edges=edges_of(d["edges"]), faces=d["faces"],
                                meta=meta, sig=d["sig"], vol_before=d.get("vol") or 0.0, centers=d.get("centers") or []))
        return {"cur": importer.decode_shape(data["cur"]), "stages": stages, "failed": data.get("failed") or []}
    except Exception:
        return None


def _child(out, part, kinds, feature_id, time_limit, skip, beat_path, checkpoint):  # pragma: no cover - a worker
    """Worker process: recognise one part, announcing each risky step in beat_path, saving progress in checkpoint,
    and send the result back. It ends itself if the process that started it dies (an AI chat that was stopped, a
    CAD worker that was killed): a result nobody reads would otherwise keep it waiting at exit for good."""
    global _beat
    from . import cadworker
    cadworker._die_with_parent()
    cadworker.oom_score(800)
    try:
        os.nice(5)  # below the web server and the people's CAD workers
    except OSError:
        pass

    def beat(label):
        tmp = beat_path + ".tmp"
        with open(tmp, "w") as fh:
            json.dump({"label": label, "t": time.time()}, fh)
        os.replace(tmp, beat_path)
    _beat = beat
    try:
        resume = _load_checkpoint(checkpoint)
        res = recognize_part(part, kinds, feature_id, time_limit=time_limit, skip=skip, resume=resume,
                             on_stage=lambda ctx, cur: _save_checkpoint(checkpoint, ctx, cur))
        out.put(json.dumps({"ok": True, "result": res}))
    except RecognizeError as exc:
        out.put(json.dumps({"ok": False, "error": str(exc)}))
    except Exception as exc:
        out.put(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}))


def recognize_part_safe(part: dict, kinds=None, feature_id: str | None = None, time_limit: float = TIME_LIMIT,
                        stop=None, hang: float = HANG_SECONDS) -> dict:
    """recognize_part in a worker process. A worker stuck in one OpenCascade call is killed and the part runs
    again without that step (it stays in the imported body); a stop request kills the worker at once."""
    import multiprocessing as mp
    import os
    import queue as queue_mod
    import tempfile
    _import_index(part, feature_id)  # plain refusals before starting a process
    ctx = mp.get_context("spawn")
    skip: list[str] = []
    started = time.monotonic()
    skipped_notes = []
    fd, checkpoint = tempfile.mkstemp(suffix=".ckpt")
    os.close(fd)
    os.unlink(checkpoint)
    try:
        last = False
        for _ in range(MAX_RESTARTS + 2):
            left = time_limit - (time.monotonic() - started)
            if left <= 5:
                if last or not os.path.exists(checkpoint):
                    break
                last, left = True, 1.0  # out of time: one more worker builds what the checkpoint holds
            fd, beat_path = tempfile.mkstemp(suffix=".beat")
            os.close(fd)
            os.unlink(beat_path)
            q = ctx.Queue()
            proc = ctx.Process(target=_child, args=(q, part, list(kinds) if kinds else None, feature_id, left, skip, beat_path,
                                                    checkpoint), daemon=True)
            proc.start()
            msg, hung = None, None
            try:
                while True:
                    try:
                        msg = q.get(timeout=0.5)
                        break
                    except queue_mod.Empty:
                        pass
                    if stop is not None and stop():
                        break
                    if not proc.is_alive():
                        try:
                            msg = q.get(timeout=1)
                        except queue_mod.Empty:
                            pass
                        break
                    try:
                        with open(beat_path) as fh:
                            b = json.load(fh)
                    except (OSError, ValueError):
                        b = None
                    # One defeature or check that runs on is a hang; building and checking the whole tree may
                    # legitimately take a while on a large body.
                    limit = hang if b and b.get("label") not in ("base", "build") else max(6 * hang, 120.0)
                    if b and b.get("label") and time.time() - b["t"] > limit:
                        hung = b["label"]
                        break
                    if time.monotonic() - started > time_limit + 180.0 + (300.0 if last else 0.0):
                        hung = "time"
                        break
            finally:
                if proc.is_alive():
                    proc.kill()
                proc.join(timeout=5)
                for path in (beat_path, beat_path + ".tmp"):
                    try:
                        os.unlink(path)
                    except OSError:
                        pass
            if msg is not None:
                data = json.loads(msg)
                if not data["ok"]:
                    raise RecognizeError(data["error"])
                res = data["result"]
                if skipped_notes:
                    res["report"].setdefault("notes", []).extend(skipped_notes)
                return res
            if stop is not None and stop():
                return {"ok": False, "part": None, "report": {"recognized": 0, "message": "Stopped.", "notes": []}}
            if hung is None:
                return {"ok": False, "part": None, "report": {
                    "recognized": 0, "message": f"The recognition worker stopped (exit code {proc.exitcode}).", "notes": []}}
            if hung in skip or last:
                break
            if hung == "time":
                continue  # the next round finds no time left and builds from the checkpoint
            skip.append(hung)
            if hung == "build":
                skip.append("base")
            skipped_notes.append("OpenCascade stopped responding on one step; that part of the body stays imported.")
        return {"ok": False, "part": None, "report": {
            "recognized": 0, "message": "OpenCascade stopped responding on this part, so nothing was recognized.",
            "notes": skipped_notes}}
    finally:
        for path in (checkpoint, checkpoint + ".tmp"):
            try:
                os.unlink(path)
            except OSError:
                pass


def imported_parts(doc: dict) -> list[str]:
    from . import assembly
    if not assembly.is_assembly(doc):
        return ["part"] if any(f.get("type") == "import" for f in doc.get("features", [])) else []
    return [pid for pid, p in (doc.get("parts") or {}).items()
            if any(f.get("type") == "import" for f in p.get("features", []))]


def recognize_doc(doc: dict, part_id: str | None = None, kinds=None, time_limit: float = TIME_LIMIT,
                  progress=None, stop=None, isolate: bool = True) -> dict:
    """A part or an assembly: recognise one part (`part_id`) or every part that has an imported body.
    Returns {doc (changed copy), parts: {pid: report}, changed: [pids]}. `progress(done, total, name, reports)` is
    called before each part and at the end. Each part runs in a worker process (`isolate`), so a hang in
    OpenCascade costs that step, not the server."""
    from . import assembly
    out = copy.deepcopy(doc)
    reports, changed = {}, []
    tell = progress or (lambda *a: None)
    if not assembly.is_assembly(doc):
        tell(0, 1, doc.get("name") or "Part", reports)
        r = (recognize_part_safe if isolate else recognize_part)(doc, kinds, time_limit=time_limit, stop=stop)
        reports["part"] = r["report"]
        if r["ok"]:
            out = {**out, "features": r["part"]["features"], "rollback": r["part"].get("rollback")}
            changed.append("part")
        tell(1, 1, None, reports)
        return {"doc": out, "parts": reports, "changed": changed}
    parts = out.get("parts") or {}
    ids = [part_id] if part_id else imported_parts(doc)
    if part_id and part_id not in parts:
        raise RecognizeError(f"No part {part_id!r} in this assembly")
    for k, pid in enumerate(ids):
        if stop is not None and stop():
            break
        tell(k, len(ids), parts[pid].get("name") or pid, reports)
        try:
            r = (recognize_part_safe if isolate else recognize_part)(parts[pid], kinds, time_limit=time_limit, stop=stop)
        except RecognizeError as exc:
            reports[pid] = {"recognized": 0, "message": str(exc)}
            continue
        reports[pid] = {**r["report"], "name": parts[pid].get("name")}
        if r["ok"]:
            parts[pid] = r["part"]
            changed.append(pid)
    tell(len(ids), len(ids), None, reports)
    return {"doc": out, "parts": reports, "changed": changed}
