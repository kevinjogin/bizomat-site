"""Assemblies: components placed by mates (see docs/DOCUMENT.md, "Assembly document").

Each part in `asm["parts"]` is rebuilt with geometry.regen (cached by content, so adding a mate
does not rebuild every part). Components are placed copies of a part; the mate solver moves free
components as little as possible until every mate holds, like SOLIDWORKS does when you add a mate.
"""

from __future__ import annotations

import copy
import hashlib
import json
import math
from collections import OrderedDict

import numpy as np

from . import geometry

NAMED = {
    "Front Plane": ("plane", (0, 0, 0), (0, 0, 1)),
    "Top Plane": ("plane", (0, 0, 0), (0, 1, 0)),
    "Right Plane": ("plane", (0, 0, 0), (1, 0, 0)),
    "Origin": ("point", (0, 0, 0), None),
    "X axis": ("axis", (0, 0, 0), (1, 0, 0)),
    "Y axis": ("axis", (0, 0, 0), (0, 1, 0)),
    "Z axis": ("axis", (0, 0, 0), (0, 0, 1)),
}

MATE_TYPES = ("coincident", "concentric", "parallel", "perpendicular", "distance", "angle", "lock",
              "hinge", "limit_distance", "limit_angle")
REF_KEYS = ("refs", "planes", "angle_refs")  # every reference list a mate may carry


class AssemblyError(Exception):
    pass


def is_assembly(doc: dict) -> bool:
    return isinstance(doc, dict) and doc.get("type") == "assembly"


# ----------------------------------------------------------------------------- rotations

def rot_euler(r) -> np.ndarray:
    """R = Rz * Ry * Rx, angles in degrees (rotations about the fixed assembly axes)."""
    a, b, c = (math.radians(float(v)) for v in (r or (0, 0, 0)))
    ca, sa, cb, sb, cc, sc = math.cos(a), math.sin(a), math.cos(b), math.sin(b), math.cos(c), math.sin(c)
    rx = np.array([[1, 0, 0], [0, ca, -sa], [0, sa, ca]])
    ry = np.array([[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]])
    rz = np.array([[cc, -sc, 0], [sc, cc, 0], [0, 0, 1]])
    return rz @ ry @ rx


def euler_of(R: np.ndarray) -> list[float]:
    sb = -R[2, 0]
    sb = max(-1.0, min(1.0, sb))
    b = math.asin(sb)
    if abs(sb) < 0.999999:
        a = math.atan2(R[2, 1], R[2, 2])
        c = math.atan2(R[1, 0], R[0, 0])
    else:  # gimbal lock: put everything in z
        a = 0.0
        c = math.atan2(-R[0, 1], R[1, 1])
    return [_clean(math.degrees(v)) for v in (a, b, c)]


def _clean(v: float, nd: int = 6) -> float:
    v = round(float(v), nd)
    return 0.0 if v == 0 else v


def expm(w) -> np.ndarray:
    th = float(np.linalg.norm(w))
    if th < 1e-12:
        return np.eye(3)
    k = np.asarray(w) / th
    K = np.array([[0, -k[2], k[1]], [k[2], 0, -k[0]], [-k[1], k[0], 0]])
    return np.eye(3) + math.sin(th) * K + (1 - math.cos(th)) * (K @ K)


def orthonormal(R: np.ndarray) -> np.ndarray:
    u, _, vt = np.linalg.svd(R)
    return u @ vt


class Pose:
    __slots__ = ("R", "t")

    def __init__(self, R=None, t=None):
        self.R = np.eye(3) if R is None else np.asarray(R, float)
        self.t = np.zeros(3) if t is None else np.asarray(t, float)

    @classmethod
    def of(cls, comp: dict) -> "Pose":
        return cls(rot_euler(comp.get("rotation")), np.array(comp.get("position") or (0, 0, 0), float))

    def matrix(self) -> list[float]:
        m = np.eye(4)
        m[:3, :3] = self.R
        m[:3, 3] = self.t
        return [_clean(v, 9) for v in m.flatten()]


def location_of(pose: Pose):
    from build123d import Location
    from OCP.gp import gp_Trsf
    R, t = pose.R, pose.t
    tr = gp_Trsf()
    tr.SetValues(R[0, 0], R[0, 1], R[0, 2], t[0], R[1, 0], R[1, 1], R[1, 2], t[1], R[2, 0], R[2, 1], R[2, 2], t[2])
    return Location(tr)


# ----------------------------------------------------------------------------- part cache

_cache: "OrderedDict[str, dict]" = OrderedDict()
CACHE_SIZE = 96


def part_key(part: dict) -> str:
    clean = {k: v for k, v in part.items() if not str(k).startswith("_") and k not in ("appearance", "name", "description", "designer")}
    return hashlib.sha1(json.dumps(clean, sort_keys=True).encode()).hexdigest()[:16]


def build_part(part: dict) -> dict:
    """Rebuild a part (cached by content). Returns {solid, status, mesh, bbox, volume, key}."""
    key = part_key(part)
    hit = _cache.get(key)
    if hit is not None:
        _cache.move_to_end(key)
        return hit
    st, _ = geometry.regen(part)
    solid = st.part
    out = {"key": key, "solid": solid, "status": st.status, "planes": {k: geometry.plane_dict(v) for k, v in st.planes.items()}}
    if solid is not None:
        out["mesh"] = geometry.mesh_shape(solid)
        bb = solid.bounding_box()
        out["bbox"] = [geometry.vlist(bb.min), geometry.vlist(bb.max)]
        out["volume"] = solid.volume
    else:
        out["mesh"] = {"faces": [], "edges": []}
        out["bbox"] = None
        out["volume"] = 0.0
    _cache[key] = out
    while len(_cache) > CACHE_SIZE:
        _cache.popitem(last=False)
    return out


# ----------------------------------------------------------------------------- references

def ref_local(ref: dict) -> tuple[str, np.ndarray, np.ndarray | None]:
    """(kind, point, dir) of a mate reference in its component's part coordinates."""
    if not isinstance(ref, dict):
        raise AssemblyError("A mate reference must be an object")
    if "ref" in ref:
        if ref["ref"] not in NAMED:
            raise AssemblyError(f"Unknown reference {ref['ref']!r}")
        k, p, d = NAMED[ref["ref"]]
        return k, np.array(p, float), None if d is None else np.array(d, float)
    if "plane" in ref:
        pl = ref["plane"]
        n = np.array(pl.get("normal") or (0, 0, 1), float)
        return "plane", np.array(pl.get("point") or (0, 0, 0), float), n / (np.linalg.norm(n) or 1)
    if "axis" in ref:
        ax = ref["axis"]
        d = np.array(ax.get("dir") or (0, 0, 1), float)
        return "axis", np.array(ax.get("point") or (0, 0, 0), float), d / (np.linalg.norm(d) or 1)
    if "point" in ref:
        return "point", np.array(ref["point"], float), None
    raise AssemblyError("A mate reference needs plane, axis, point or ref")


def _cross(a, b) -> np.ndarray:
    """np.cross for 3-vectors without its axis handling (it dominates the solver's time)."""
    return np.array([a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]])


def ref_world(ref: dict, poses: dict) -> tuple[str, np.ndarray, np.ndarray | None]:
    loc = ref.get("_l")  # parsed once per solve (see solve)
    k, p, d = loc if loc is not None else ref_local(ref)
    cid = ref.get("component")
    if cid is None:
        return k, p, d
    pose = poses[cid]
    return k, pose.R @ p + pose.t, None if d is None else pose.R @ d


def refind(ref: dict, solid) -> dict | None:
    """Follow a plane or axis reference to the matching face of the rebuilt part (same direction,
    nearest), so mates stay on their faces when a part changes size. Returns an updated reference,
    or None when nothing changed. Like part features, this is geometric matching, not topological
    naming."""
    if solid is None or ("plane" not in ref and "axis" not in ref):
        return None
    from build123d import GeomType
    _, p, d = ref_local(ref)
    best, bestd = None, None
    for f in solid.faces():
        try:
            if "plane" in ref and f.geom_type == GeomType.PLANE:
                n = np.array(geometry.vlist(f.normal_at()))
                if float(n @ d) < 0.9999:
                    continue
                dist = f.distance_to(geometry.v3(p))
                if bestd is None or dist < bestd:
                    best, bestd = np.array(geometry.vlist(f.center())), dist
            elif "axis" in ref and f.geom_type in (GeomType.CYLINDER, GeomType.CONE):
                ax = f.axis_of_rotation
                ad = np.array(geometry.vlist(ax.direction))
                if abs(float(ad @ d)) < 0.9999:
                    continue
                ap = np.array(geometry.vlist(ax.position))
                dist = float(np.linalg.norm(np.cross(p - ap, ad)))
                if bestd is None or dist < bestd:
                    best, bestd = ap, dist
        except Exception:
            continue
    # only follow a face that moved a little; a reference far from any face is a datum, keep it
    if best is None or bestd > 0.2 * geometry.scale_of(solid):
        return None
    if "plane" in ref:
        off = float((best - p) @ d)
        if abs(off) < 1e-7:
            return None
        q = p + d * off
        return {**ref, "plane": {**ref["plane"], "point": [_clean(v) for v in q]}}
    proj = best + d * float((p - best) @ d)
    if float(np.linalg.norm(proj - p)) < 1e-7:
        return None
    return {**ref, "axis": {**ref["axis"], "point": [_clean(v) for v in proj]}}


# ----------------------------------------------------------------------------- mate residuals

def _resolve_align(m: dict, a, b) -> str:
    al = m.get("align") or "auto"
    if al in ("anti", "aligned"):
        return al
    if a[2] is None or b[2] is None:
        return "anti"
    return "anti" if float(np.dot(a[2], b[2])) < 0 else "aligned"


def mate_residual(m: dict, poses: dict, L: float, align: str) -> np.ndarray:
    if m["type"] == "_goal":
        P = poses[m["component"]]
        return (P.R @ m["point"] + P.t - m["target"]) * m.get("weight", 1e-2)
    a = ref_world(m["refs"][0], poses)
    b = ref_world(m["refs"][1], poses)
    t = m["type"]
    ka, kb = a[0], b[0]
    # order pairs so the "bigger" entity comes first where it matters
    order = {"plane": 0, "axis": 1, "point": 2}
    if order[ka] > order[kb] and t not in ("lock", "hinge"):
        a, b = b, a
        ka, kb = kb, ka
    pa, da = a[1], a[2]
    pb, db = b[1], b[2]
    sgn = 1.0 if align == "aligned" else -1.0

    def dir_match():
        return (da - sgn * db) * L

    if t == "_goal":  # drag: pull a point of a component toward the cursor (soft)
        P = poses[m["component"]]
        return (P.R @ m["point"] + P.t - m["target"]) * m.get("weight", 1e-2)
    if t == "hinge":
        out = [mate_residual({"type": "concentric", "refs": m["refs"]}, poses, L, align)]
        if m.get("planes"):
            out.append(mate_residual({"type": "coincident", "refs": m["planes"]}, poses, L, m.get("_plane_align", "anti")))
        if m.get("angle_refs") and (m.get("angle_min") is not None or m.get("angle_max") is not None):
            out.append(mate_residual({"type": "limit_angle", "refs": m["angle_refs"], "min": m.get("angle_min"),
                                      "max": m.get("angle_max")}, poses, L, align))
        return np.concatenate(out)
    if t == "limit_angle":
        if da is None or db is None:
            raise AssemblyError("Angle limits need planes or axes")
        ang = math.degrees(math.acos(max(-1.0, min(1.0, float(da @ db)))))
        lo, hi = m.get("min"), m.get("max")
        over = (max(0.0, ang - hi) if hi is not None else 0.0) + (max(0.0, lo - ang) if lo is not None else 0.0)
        return np.array([math.radians(over) * L])
    if t == "limit_distance":
        lo, hi = m.get("min"), m.get("max")
        if ka == "plane" and kb == "plane":
            v = float((pb - pa) @ da)
            par = dir_match()
        else:
            v = float(np.linalg.norm(pb - pa))
            par = np.zeros(0)
        over = (max(0.0, v - hi) if hi is not None else 0.0) + (max(0.0, lo - v) if lo is not None else 0.0)
        return np.concatenate([par, [over]])
    if t == "lock":
        rel = m.get("_pose")
        ca, cb = m["refs"][0].get("component"), m["refs"][1].get("component")
        PA = poses[ca] if ca else Pose()
        PB = poses[cb] if cb else Pose()
        Rr, tr = rel
        return np.concatenate([((PA.R.T @ PB.R) - Rr).flatten() * L, PA.R.T @ (PB.t - PA.t) - tr])
    if t == "coincident":
        if ka == "plane" and kb == "plane":
            return np.concatenate([dir_match(), [np.dot(pb - pa, da)]])
        if ka == "plane" and kb == "axis":
            return np.array([np.dot(db, da) * L, np.dot(pb - pa, da)])
        if ka == "plane" and kb == "point":
            return np.array([np.dot(pb - pa, da)])
        if ka == "axis" and kb == "axis":
            return np.concatenate([_cross(da, db) * L, _cross(pb - pa, da)])
        if ka == "axis" and kb == "point":
            return _cross(pb - pa, da)
        return pb - pa
    if t == "concentric":
        if ka != "axis" or kb != "axis":
            raise AssemblyError("Concentric needs two axes (cylindrical faces)")
        return np.concatenate([_cross(da, db) * L, _cross(pb - pa, da)])
    if t in ("parallel", "perpendicular", "angle"):
        if da is None or db is None:
            raise AssemblyError(f"{t.capitalize()} needs planes or axes")
        if t == "parallel":
            return dir_match() if m.get("align") in ("anti", "aligned") else _cross(da, db) * L
        if t == "perpendicular":
            return np.array([np.dot(da, db) * L])
        ang = math.radians(float(m.get("value", 90)))
        return np.array([(abs(np.dot(da, db)) - abs(math.cos(ang))) * L])
    if t == "distance":
        v = float(m.get("value", 0)) * (-1 if m.get("flip") else 1)
        if ka == "plane" and kb == "plane":
            return np.concatenate([dir_match(), [np.dot(pb - pa, da) - v]])
        if ka == "plane" and kb == "point":
            return np.array([np.dot(pb - pa, da) - v])
        if ka == "axis" and kb == "axis":
            return np.concatenate([_cross(da, db) * L, [np.linalg.norm(_cross(pb - pa, da)) - abs(v)]])
        if ka == "point" and kb == "point":
            return np.array([np.linalg.norm(pb - pa) - abs(v)])
        if ka == "axis" and kb == "point":
            return np.array([np.linalg.norm(_cross(pb - pa, da)) - abs(v)])
        if ka == "plane" and kb == "axis":
            return np.array([np.dot(db, da) * L, np.dot(pb - pa, da) - v])
    raise AssemblyError(f"Unknown mate type {t!r}")


# ----------------------------------------------------------------------------- solver

def solve(asm: dict, size: float = 100.0, solids: dict | None = None, drag: dict | None = None) -> dict:
    """Solve the mates. Returns {poses, mates: {id: {state, message, residual}}, comp_state, updates}.

    `solids` (component id -> rebuilt part solid) lets references follow their faces.
    `drag` = {"component", "point" (part coordinates), "target" (assembly coordinates)}: the component
    is pulled so that point follows the cursor while every mate keeps holding, the way SOLIDWORKS
    drags a component (a hinge turns, a slider slides)."""
    comps = [c for c in asm.get("components", []) if not c.get("suppressed")]
    ids = {c["id"] for c in comps}
    poses = {c["id"]: Pose.of(c) for c in comps}
    # only components the user fixed are fixed; with none fixed everything floats (SOLIDWORKS allows
    # that). The solver moves components as little as possible, so nothing drifts.
    fixed = {c["id"] for c in comps if c.get("fixed")}
    L = max(size, 1.0)
    mates, report, updates = [], {}, {}
    for m in asm.get("mates", []):
        if m.get("suppressed"):
            report[m["id"]] = {"state": "suppressed"}
            continue
        refs = m.get("refs") or []
        try:
            if m.get("type") not in MATE_TYPES:
                raise AssemblyError(f"Unknown mate type {m.get('type')!r}")
            if len(refs) != 2:
                raise AssemblyError("A mate needs two references")
            mm = dict(m)
            all_cs = []
            for key in REF_KEYS:
                lst = m.get(key)
                if not lst:
                    continue
                if len(lst) != 2:
                    raise AssemblyError(f"{key} needs two references")
                for r in lst:
                    if r.get("component") is not None and r.get("component") not in ids:
                        raise AssemblyError(f"Component {r.get('component')} is missing or suppressed")
                if solids:
                    moved = [refind(r, solids.get(r.get("component"))) for r in lst]
                    if any(moved):
                        lst = [n or r for n, r in zip(moved, lst)]
                        updates.setdefault(m["id"], {})[key] = lst
                mm[key] = [{**r, "_l": ref_local(r)} for r in lst]  # parsed once, not per residual
                all_cs += [r.get("component") for r in lst]
            refs = mm["refs"]
            cs = [r.get("component") for r in refs]
            if cs[0] is not None and cs[0] == cs[1]:
                raise AssemblyError("Both references are on the same component")
            cs = list(dict.fromkeys(all_cs))
            a, b = ref_world(refs[0], poses), ref_world(refs[1], poses)
            if m["type"] == "hinge" and mm.get("planes"):
                pa, pb = ref_world(mm["planes"][0], poses), ref_world(mm["planes"][1], poses)
                mm["_plane_align"] = _resolve_align({"align": m.get("align")}, pa, pb)
            align = _resolve_align(m, a, b) if m["type"] in ("coincident", "distance", "parallel", "limit_distance") else "anti"
            if m["type"] in ("coincident", "distance") and (m.get("align") or "auto") == "auto" and a[2] is not None and b[2] is not None:
                updates.setdefault(m["id"], {})["align"] = align
            if m["type"] == "lock":
                if m.get("pose"):
                    rel = (rot_euler(m["pose"].get("rotation")), np.array(m["pose"].get("position") or (0, 0, 0), float))
                else:
                    PA = poses[cs[0]] if cs[0] else Pose()
                    PB = poses[cs[1]] if cs[1] else Pose()
                    rel = (PA.R.T @ PB.R, PA.R.T @ (PB.t - PA.t))
                    updates.setdefault(m["id"], {})["pose"] = {"position": [_clean(v) for v in rel[1]], "rotation": euler_of(rel[0])}
                mm["_pose"] = rel
            mate_residual(mm, poses, L, align)  # validates the reference kinds
            mates.append((mm, align, [c for c in cs if c is not None]))
            report[m["id"]] = {"state": "ok"}
        except AssemblyError as exc:
            report[m["id"]] = {"state": "error", "message": str(exc)}
    hard = list(mates)
    order_ids = [x["id"] for x in comps]
    tol = max(1e-6 * L, 1e-7)
    iters = 0

    # Drag: only the components linked to the dragged one (through mates, not through fixed
    # components) can move, so the rest of the assembly costs nothing.
    goal = None
    active = hard
    if drag and drag.get("component") in ids and drag["component"] not in fixed:
        g = drag["component"]
        group, grew = {g}, True
        while grew:
            grew = False
            for _, _, cs in hard:
                if group.intersection(cs):
                    for c in cs:
                        if c not in fixed and c not in group:
                            group.add(c)
                            grew = True
        active = [x for x in hard if group.intersection(x[2])]
        goal = ({"type": "_goal", "id": "_goal", "component": g, "point": np.array(drag["point"], float),
                 "target": np.array(drag["target"], float), "weight": 1.0}, "anti", [g])
    free = sorted({c for _, _, cs in active for c in cs if c not in fixed} | ({goal[0]["component"]} if goal else set()),
                  key=lambda c: order_ids.index(c))
    idx = {c: i for i, c in enumerate(free)}
    n = 6 * len(free)

    class System:
        """Residuals and finite-difference Jacobian of a list of mates over the free components."""

        def __init__(self, ms):
            self.ms = ms
            self.by_comp = {c: [k for k, (_, _, cs) in enumerate(ms) if c in cs] for c in free}

        def parts(self, P, subset=None):
            return [mate_residual(m, P, L, al) for k, (m, al, _) in enumerate(self.ms) if subset is None or k in subset]

        def res(self, P):
            r = self.parts(P)
            self.offs = np.concatenate([[0], np.cumsum([len(x) for x in r])]).astype(int)
            return np.concatenate(r) if r else np.zeros(0)

        def jac(self, P, r0):
            offs = self.offs
            J = np.zeros((len(r0), n))
            h = 1e-6 * L
            for c in free:
                ks = self.by_comp[c]
                if not ks:
                    continue
                base = [r0[offs[k]:offs[k + 1]] for k in ks]
                kset = set(ks)
                for j in range(6):
                    rr = self.parts(perturbed(P, c, j, h), kset)
                    col = 6 * idx[c] + j
                    for k, rk, bk in zip(ks, rr, base):
                        J[offs[k]:offs[k + 1], col] = (rk - bk) / h
            return J

    def perturbed(P, c, j, h):
        Q = dict(P)
        p = P[c]
        if j < 3:
            t = p.t.copy()
            t[j] += h
            Q[c] = Pose(p.R, t)
        else:
            w = np.zeros(3)
            w[j - 3] = h / L
            Q[c] = Pose(expm(w) @ p.R, p.t)
        return Q

    def step(P, dx):
        Q = dict(P)
        for c in free:
            v = dx[6 * idx[c]: 6 * idx[c] + 6]
            if not v.any():
                continue
            p = P[c]
            Q[c] = Pose(orthonormal(expm(v[3:] / L) @ p.R), p.t + v[:3])
        return Q

    def run_lm(P, sys_):
        """Make every mate hold, moving the free components as little as possible."""
        nonlocal iters
        lam = 1e-3
        r = sys_.res(P)
        cost = float(r @ r)
        for _ in range(1, 200):
            iters += 1
            if math.sqrt(cost) < tol * 0.01:
                break
            J = sys_.jac(P, r)
            A = J.T @ J
            gr = J.T @ r
            improved = False
            dx = np.zeros(n)
            for _ in range(12):
                try:
                    dx = -np.linalg.solve(A + lam * np.eye(n), gr)
                except np.linalg.LinAlgError:
                    lam *= 10
                    continue
                Q = step(P, dx)
                r2 = sys_.res(Q)
                c2 = float(r2 @ r2)
                if c2 < cost:
                    P, r, cost = Q, r2, c2
                    lam = max(lam / 5, 1e-12)
                    improved = True
                    break
                lam *= 10
            if not improved or float(np.linalg.norm(dx)) < 1e-12 * L:
                break
        sys_.res(P)
        return P

    # Rotations cost more than moves when the cursor can be followed either way, so a free part
    # slides with the cursor instead of tumbling; a hinge still turns (it has no other way).
    D = np.tile([1.0, 1.0, 1.0, 0.005, 0.005, 0.005], len(free))

    def run_drag(P, sys_, nh):
        """Constrained Gauss-Newton: each step keeps the mates (linearised) and moves the grabbed
        point as close to the cursor as they allow, with the smallest motion."""
        nonlocal iters
        for _ in range(40):
            iters += 1
            r = sys_.res(P)
            J = sys_.jac(P, r) * D
            rm, rg, Jm, Jg = r[:nh], r[nh:], J[:nh], J[nh:]
            if nh:
                U, sv, Vt = np.linalg.svd(Jm, full_matrices=True)
                rank = int(np.sum(sv > 1e-8 * max(1.0, sv[0] if len(sv) else 1.0)))
                y = -(Vt[:rank].T @ ((U[:, :rank].T @ rm) / sv[:rank]))
                N = Vt[rank:].T
            else:
                y, N = np.zeros(n), np.eye(n)
            if N.shape[1]:
                z = np.linalg.lstsq(Jg @ N, -(Jg @ y + rg), rcond=1e-9)[0]
                y = y + N @ z
            dx = D * y
            scale = 1.0  # trust region: no single step turns more than ~20 deg or moves more than L/5
            for c in free:
                v = dx[6 * idx[c]: 6 * idx[c] + 6]
                tn, rn = float(np.linalg.norm(v[:3])), float(np.linalg.norm(v[3:])) / L
                if tn > 0.2 * L:
                    scale = min(scale, 0.2 * L / tn)
                if rn > 0.35:
                    scale = min(scale, 0.35 / rn)
            # When the cursor is off the path the mates allow (a hinge point can only reach a circle),
            # plain Gauss-Newton only creeps toward the closest point. Try longer strides along the
            # same step and keep the best (residual evaluations are cheap next to a Jacobian).
            best, bestc = None, None
            for a in (1.0, 0.6, 2.0, 4.0):  # 0.6 damps a step that overshoots back and forth
                if a > 1 and scale < 1:
                    break
                Q = step(P, dx * scale * a)
                rq = sys_.res(Q)
                cq = float(rq[nh:] @ rq[nh:]) + 100.0 * float(rq[:nh] @ rq[:nh])
                if bestc is None or cq < bestc:
                    best, bestc = Q, cq
                elif a > 2:
                    break
            P = best
            if float(np.linalg.norm(dx)) < 5e-4 * L and float(np.linalg.norm(rm)) < tol:  # the cursor is not that exact; run_lm makes the mates exact
                break
        return P

    if n and (active or goal):
        if goal:
            poses = run_drag(poses, System(active + [goal]), int(sum(len(x) for x in System(active).parts(poses))))
        if active:
            poses = run_lm(poses, System(active))  # make every mate exact
    # per-mate result
    whole = System(hard)
    final = whole.parts(poses)
    for (m, al, cs), rk in zip(hard, final):
        err = float(np.max(np.abs(rk))) if len(rk) else 0.0
        rep = report[m["id"]]
        rep["residual"] = err
        if err > max(1e-3, 1e-5 * L):
            rep["state"] = "error"
            rep["message"] = "This mate cannot be satisfied with the other mates (over defining or conflicting)."
    # degrees of freedom left per component (SOLIDWORKS "(-)" under defined). Every component that
    # is neither fixed nor in a mate keeps all 6.
    comp_state = {c["id"]: "fixed" if c["id"] in fixed else "under" for c in comps}
    dofs = {}
    mated = sorted({c for _, _, cs in hard for c in cs if c not in fixed}, key=lambda c: order_ids.index(c))
    if mated and not goal:  # drag frames only draw; the rebuild after the drag reports the states
        free = mated
        idx = {c: i for i, c in enumerate(free)}
        n = 6 * len(free)
        whole = System(hard)
        r = whole.res(poses)
        J = whole.jac(poses, r) if len(r) else np.zeros((0, n))
        if J.shape[0]:
            _, sv, vt = np.linalg.svd(J, full_matrices=True)
            rank = int(np.sum(sv > 1e-6 * max(1.0, sv[0] if len(sv) else 1.0)))
            null = vt[rank:]
        else:
            null = np.eye(n)
        for c in free:
            blk = null[:, 6 * idx[c]: 6 * idx[c] + 6] if null.size else np.zeros((0, 6))
            comp_state[c] = "full" if (blk.size == 0 or float(np.max(np.abs(blk))) < 1e-6) else "under"
            dofs[c] = int(np.linalg.matrix_rank(blk, tol=1e-6)) if blk.size else 0
    return {"poses": poses, "mates": report, "comp_state": comp_state, "dof": dofs, "updates": updates, "iterations": iters, "fixed": fixed}


# ----------------------------------------------------------------------------- regen

def part_of(asm: dict, comp: dict) -> dict:
    p = asm.get("parts", {}).get(comp.get("part"))
    if p is None:
        raise AssemblyError(f"Component {comp.get('name', comp.get('id'))} uses missing part {comp.get('part')!r}")
    return p


def regen_assembly(asm: dict, known: dict | None = None, solve_mates: bool = True, drag: dict | None = None) -> dict:
    """Rebuild parts, solve mates, return what the UI draws.

    `known` maps part id -> cache key the client already holds; those meshes are not resent."""
    known = known or {}
    parts_out, built = {}, {}
    for pid, part in (asm.get("parts") or {}).items():
        b = build_part(part)
        built[pid] = b
        info = {"key": b["key"], "status": b["status"], "bbox": b["bbox"], "name": part.get("name", pid),
                "appearance": part.get("appearance"), "planes": b["planes"]}
        if known.get(pid) != b["key"]:
            info["body"] = b["mesh"]
        parts_out[pid] = info
    size = _size(asm, built)
    solids = {c["id"]: built[c["part"]]["solid"] for c in asm.get("components", []) if c.get("part") in built}
    sol = solve(asm, size, solids, drag) if solve_mates else {"poses": {c["id"]: Pose.of(c) for c in asm.get("components", [])},
                                                "mates": {}, "comp_state": {}, "dof": {}, "updates": {}, "fixed": set()}
    comps_out = []
    lo, hi = np.full(3, np.inf), np.full(3, -np.inf)
    for c in asm.get("components", []):
        pose = sol["poses"].get(c["id"]) or Pose.of(c)
        st = "suppressed" if c.get("suppressed") else sol["comp_state"].get(c["id"], "under")
        err = None
        if c.get("part") not in built:
            st, err = "error", f"Missing part {c.get('part')!r}"
        comps_out.append({"id": c["id"], "part": c.get("part"), "matrix": pose.matrix(),
                          "position": [_clean(v) for v in pose.t], "rotation": euler_of(pose.R),
                          "state": st, "dof": sol["dof"].get(c["id"], 0 if st in ("fixed", "full") else 6),
                          **({"message": err} if err else {})})
        b = built.get(c.get("part"))
        if b and b["bbox"] and not c.get("suppressed") and not c.get("hidden"):
            for corner in _corners(b["bbox"]):
                w = pose.R @ np.array(corner) + pose.t
                lo, hi = np.minimum(lo, w), np.maximum(hi, w)
    out = {"type": "assembly", "parts": parts_out, "components": comps_out,
           "mates": [{"id": m["id"], **sol["mates"].get(m["id"], {"state": "ok"})} for m in asm.get("mates", [])],
           "updates": {k: v for k, v in sol["updates"].items()}}
    if np.all(np.isfinite(lo)):
        out["bbox"] = [[_clean(v) for v in lo], [_clean(v) for v in hi]]
    return out


def apply_solution(asm: dict, res: dict) -> dict:
    """Write solved positions and resolved mate options back into a copy of the document."""
    new = copy.deepcopy(asm)
    by = {c["id"]: c for c in res["components"]}
    for c in new.get("components", []):
        s = by.get(c["id"])
        if s and not c.get("suppressed"):
            c["position"], c["rotation"] = s["position"], s["rotation"]
    for m in new.get("mates", []):
        m.update(res.get("updates", {}).get(m["id"], {}))
    return new


def _corners(bb):
    (x0, y0, z0), (x1, y1, z1) = bb
    return [(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]


def _size(asm, built) -> float:
    s = 0.0
    for b in built.values():
        if b["bbox"]:
            s = max(s, max(hi - lo for lo, hi in zip(*b["bbox"])))
    for c in asm.get("components", []):
        s = max(s, *(abs(v) for v in (c.get("position") or (0, 0, 0))))
    return s or 100.0


# ----------------------------------------------------------------------------- shapes, checks, files

def placed_solids(asm: dict, strict: bool = False) -> list[tuple[dict, object]]:
    built = {pid: build_part(p) for pid, p in asm.get("parts", {}).items()}
    solids = {c["id"]: built[c["part"]]["solid"] for c in asm.get("components", []) if c.get("part") in built}
    sol = solve(asm, _size(asm, built), solids)
    out = []
    for c in asm.get("components", []):
        if c.get("suppressed"):
            continue
        b = build_part(part_of(asm, c))
        if strict:
            geometry.require_clean(b["status"], c.get("name") or c["id"])
        if b["solid"] is None:
            if strict:
                raise AssemblyError(f"Cannot export {c.get('name') or c['id']}: no solid body")
            continue
        out.append((c, b["solid"].moved(location_of(sol["poses"][c["id"]]))))
    return out


def interference(asm: dict) -> dict:
    items = placed_solids(asm)
    found = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            (ca, a), (cb, b) = items[i], items[j]
            ba, bb = a.bounding_box(), b.bounding_box()
            amin, amax, bmin, bmax = (geometry.vlist(v) for v in (ba.min, ba.max, bb.min, bb.max))
            if any(amax[k] < bmin[k] or bmax[k] < amin[k] for k in range(3)):
                continue
            try:
                common = a & b
                vol = common.volume if common is not None else 0.0
            except Exception:
                continue
            if vol > 1e-3:
                found.append({"a": ca["id"], "b": cb["id"], "names": [ca.get("name"), cb.get("name")],
                              "volume": vol, "mesh": geometry.mesh_shape(common)})
    return {"interferences": found, "checked": len(items)}


def mass_properties(asm: dict) -> dict:
    total_m, total_v, com = 0.0, 0.0, np.zeros(3)
    from build123d import CenterOf
    for c, s in placed_solids(asm):
        part = part_of(asm, c)
        rho = float((part.get("material") or {}).get("density", 1.0e-6) or 0)
        v = s.volume
        m = v * rho
        total_v += v
        total_m += m
        com += np.array(geometry.vlist(s.center(CenterOf.MASS))) * (m if rho else v)
    w = total_m if total_m else total_v
    return {"volume": total_v, "mass": total_m, "center_of_mass": [float(x) for x in (com / w if w else com)],
            "components": len(asm.get("components", []))}


def export(asm: dict, fmt: str, path: str) -> None:
    from build123d import Compound, export_step, export_stl
    shapes = []
    for c, s in placed_solids(asm, strict=True):
        s.label = c.get("name") or c["id"]
        shapes.append(s)
    if not shapes:
        raise geometry.FeatureError("The assembly has no solid components")
    comp = Compound(children=shapes)
    comp.label = asm.get("name", "Assem1")
    if fmt == "step":
        export_step(comp, path)
    elif fmt == "stl":
        export_stl(comp, path)
    else:
        raise geometry.FeatureError(f"Unknown export format {fmt}")


def part_as_assembly(part: dict, name: str = "Assem1") -> dict:
    """Wrap a part document in a new assembly with one fixed component."""
    pid = "part1"
    p = copy.deepcopy(part)
    p.pop("rollback", None)
    pname = p.get("name") or "Part1"
    return {"version": 1, "type": "assembly", "name": name, "units": "mm", "parts": {pid: p},
            "components": [{"id": "c1", "part": pid, "name": f"{pname}<1>", "fixed": True,
                            "position": [0, 0, 0], "rotation": [0, 0, 0]}],
            "mates": [], "sequence": ["c1"], "seq": 2}


def new_assembly(name: str = "Assem1") -> dict:
    return {"version": 1, "type": "assembly", "name": name, "units": "mm", "parts": {}, "components": [], "mates": [], "sequence": [], "seq": 1}


# ----------------------------------------------------------------------------- mate candidates (imported assemblies)

def mate_candidates(asm: dict, limit: int = 80) -> list[dict]:
    """Geometric hints for mating an assembly that came in without mates (a STEP): shafts in holes
    (coaxial cylinders) and faces lying on each other (opposite, coplanar, overlapping planar faces).
    References are in each component's part coordinates, ready for add_mate."""
    from build123d import GeomType
    built = {pid: build_part(p) for pid, p in asm.get("parts", {}).items()}
    comps = [c for c in asm.get("components", []) if not c.get("suppressed") and built.get(c.get("part"), {}).get("solid") is not None]
    sol = solve(asm, _size(asm, built))
    size = _size(asm, built)
    tol = max(0.02, 1e-4 * size)
    info = {}
    for c in comps:
        solid = built[c["part"]]["solid"]
        P = sol["poses"][c["id"]]
        cyl, pl = [], []
        for f in solid.faces():
            try:
                if f.geom_type in (GeomType.CYLINDER, GeomType.CONE):
                    ax = f.axis_of_rotation
                    p0, d0 = np.array(geometry.vlist(ax.position)), np.array(geometry.vlist(ax.direction))
                    cyl.append({"p": p0, "d": d0, "P": P.R @ p0 + P.t, "D": P.R @ d0,
                                "r": round(f.radius, 4) if f.geom_type == GeomType.CYLINDER else None})
                elif f.geom_type == GeomType.PLANE:
                    n0 = np.array(geometry.vlist(f.normal_at()))
                    c0 = np.array(geometry.vlist(f.center()))
                    bb = f.bounding_box()
                    corners = np.array([[x, y, z] for x in (bb.min.X, bb.max.X) for y in (bb.min.Y, bb.max.Y) for z in (bb.min.Z, bb.max.Z)])
                    W = corners @ P.R.T + P.t
                    pl.append({"p": c0, "n": n0, "P": P.R @ c0 + P.t, "N": P.R @ n0, "lo": W.min(0), "hi": W.max(0), "area": f.area})
            except Exception:
                continue
        info[c["id"]] = (cyl, pl)
    out = []
    names = {c["id"]: c.get("name", c["id"]) for c in comps}
    seen = set()
    for i, a in enumerate(comps):
        for b in comps[i + 1:]:
            ca, pa = info[a["id"]]
            cb, pb = info[b["id"]]
            for x in ca:
                for y in cb:
                    if np.linalg.norm(np.cross(x["D"], y["D"])) > 1e-3:
                        continue
                    if np.linalg.norm(np.cross(y["P"] - x["P"], x["D"])) > tol:
                        continue
                    key = ("c", a["id"], b["id"], x.get("r"), y.get("r"))
                    if key in seen:
                        continue
                    seen.add(key)
                    out.append({"type": "concentric", "components": [names[a["id"]], names[b["id"]]],
                                "radii": [x.get("r"), y.get("r")],
                                "refs": [{"component": a["id"], "axis": {"point": [_clean(v, 4) for v in x["p"]], "dir": [_clean(v, 5) for v in x["d"]]}},
                                         {"component": b["id"], "axis": {"point": [_clean(v, 4) for v in y["p"]], "dir": [_clean(v, 5) for v in y["d"]]}}]})
            for x in pa:
                for y in pb:
                    if float(x["N"] @ y["N"]) > -0.9999:
                        continue
                    if abs(float((y["P"] - x["P"]) @ x["N"])) > tol:
                        continue
                    if np.any(x["hi"] + tol < y["lo"]) or np.any(y["hi"] + tol < x["lo"]):
                        continue
                    out.append({"type": "coincident", "align": "anti", "components": [names[a["id"]], names[b["id"]]],
                                "areas": [round(x["area"], 1), round(y["area"], 1)],
                                "refs": [{"component": a["id"], "plane": {"point": [_clean(v, 4) for v in x["p"]], "normal": [_clean(v, 5) for v in x["n"]]}},
                                         {"component": b["id"], "plane": {"point": [_clean(v, 4) for v in y["p"]], "normal": [_clean(v, 5) for v in y["n"]]}}]})
    out.sort(key=lambda m: (m["components"], m["type"] != "concentric", -max(m.get("areas") or [0])))
    return out[:limit]
