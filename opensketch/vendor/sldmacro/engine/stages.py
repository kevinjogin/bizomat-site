"""What a part is after each of its features, worked out in build123d: the body, the change in volume and in
moment, the points the macro uses to find faces and edges, and what the part would become if SOLIDWORKS read a
feature call another way (the "readings")."""
import math

from core import (Ch, Dr, Ex, Fi, Mk, apply_ex, biggest, body_extrudes, box_of, edge_info, flat_faces, moment_z, n_bodies, prism,
                  seg_len, seg_mid, taper_wider)


def inner_point(face):
    """A point well inside a face (the centroid of its biggest triangle, put back on the surface if it is a cylinder)."""
    from build123d import GeomType, Vector
    verts, tris = face.tessellate(0.01, 0.2)
    best, area = None, -1.0
    for a, b, c in tris:
        pa, pb, pc = verts[a], verts[b], verts[c]
        ar = ((pb - pa).cross(pc - pa)).length
        if ar > area:
            area, best = ar, (pa + pb + pc) / 3
    if face.geom_type == GeomType.CYLINDER:
        ax = face.axis_of_rotation if hasattr(face, "axis_of_rotation") and face.axis_of_rotation is not None else None
        if ax is not None:
            o, d = Vector(ax.position), Vector(ax.direction)
            foot = o + d * ((best - o).dot(d))
            rad = best - foot
            best = foot + rad.normalized() * face.radius
    return (best.X, best.Y, best.Z)


def is_vertical(face):
    """Side face of a straight extrude along Z: a plane that contains the Z direction, or a cylinder about Z."""
    from build123d import GeomType
    if face.geom_type == GeomType.PLANE:
        n = face.normal_at(face.center())
        return abs(n.Z) < 1e-7
    if face.geom_type == GeomType.CYLINDER:
        ax = face.axis_of_rotation
        return ax is not None and abs(abs(ax.direction.Z) - 1) < 1e-7
    return False


def dist_to_segs(x, y, shapes):
    best = 1e9
    for sh in shapes:
        for g in sh.segs:
            if g[0] == "C":
                d = abs(math.hypot(x - g[1], y - g[2]) - g[3])
            elif g[0] == "L":
                ax, ay, bx, by = g[1:]
                L2 = (bx - ax) ** 2 + (by - ay) ** 2
                t = max(0.0, min(1.0, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / L2)) if L2 else 0.0
                d = math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay))
            else:
                _, cx, cy, x0, y0, x1, y1, ccw = g
                r = math.hypot(x0 - cx, y0 - cy)
                a0, a1, a = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx), math.atan2(y - cy, x - cx)
                sweep = (a1 - a0) % (2 * math.pi) if ccw else (a0 - a1) % (2 * math.pi)
                rel = (a - a0) % (2 * math.pi) if ccw else (a0 - a) % (2 * math.pi)
                d = abs(math.hypot(x - cx, y - cy) - r) if rel <= sweep + 1e-9 else min(math.hypot(x - x0, y - y0), math.hypot(x - x1, y - y1))
            best = min(best, d)
    return best


def opposite_point(face, p):
    """For a cylinder that goes all the way round: the point across the axis from p (SOLIDWORKS may hold such a wall
    as two half faces; a point on each finds both). None for any other face."""
    from build123d import GeomType, Vector
    if face.geom_type != GeomType.CYLINDER:
        return None
    if not any(e.geom_type == GeomType.CIRCLE and ((e @ 0) - (e @ 1)).length < 1e-7 for e in face.edges()):
        return None
    ax = face.axis_of_rotation
    o, d = Vector(ax.position), Vector(ax.direction)
    v = Vector(*p)
    foot = o + d * ((v - o).dot(d))
    q = foot - (v - foot)
    from build123d import Vertex
    if face.distance_to(Vertex(q.X, q.Y, q.Z)) > 1e-6:              # the wall is cut away there
        return None
    return (q.X, q.Y, q.Z)


def side_faces(body, ex):
    """The faces of the body that are side faces of an extrude (vertical, on its outline, within its height), each with
    the point(s) the macro finds it by."""
    lo, hi = min(ex.z0, ex.z1), max(ex.z0, ex.z1)
    out = []
    for f in body.faces():
        if not is_vertical(f):
            continue
        p = inner_point(f)
        if lo - 1e-6 <= p[2] <= hi + 1e-6 and dist_to_segs(p[0], p[1], ex.shapes) < 1e-6:
            q = opposite_point(f, p)
            out.append((f, [p] + ([q] if q else [])))
    return out


def is_concave(body, e, eps=0.01):
    """True for an inside corner (a fillet there adds material), False for an outside corner, None for a smooth edge.
    Stepping off the edge along the difference of the two face normals stays inside the solid at an inside corner."""
    from build123d import Vector
    m = e @ 0.5
    near = [f for f in body.faces() if any(e.is_same(x) for x in f.edges())]
    if len(near) != 2:
        return None
    n1, n2 = near[0].normal_at(m), near[1].normal_at(m)
    d = n1 - n2
    if d.length < 0.05:
        return None
    d = d.normalized() * eps
    inside = [body.is_inside(Vector(m.X + s * d.X, m.Y + s * d.Y, m.Z + s * d.Z)) for s in (1, -1)]
    return all(inside) if inside[0] == inside[1] else None


def edge_probes(edges):
    """Points the macro finds the edges by: one in the middle of each; two, across from each other, on a full circle."""
    out = []
    for e in edges:
        d = edge_info(e)
        out.append(d["mid"])
        if d.get("full"):
            q = e @ 0.87
            out.append((q.X, q.Y, q.Z))
    return out


def try_chamfer(body, edges, size):
    from build123d import chamfer
    out = chamfer(edges, size)
    assert out.is_valid and n_bodies(out) == 1
    return biggest(out)


def try_fillet(body, edges, r):
    from build123d import fillet
    try:
        out = fillet(edges, r)
        if out.is_valid and n_bodies(out) == 1:
            a, b = box_of(body), box_of(out)
            if max(abs(p - q) for p, q in zip(a, b)) < 1e-3 and abs(out.volume - body.volume) < 0.05 * body.volume:
                return biggest(out)
    except Exception:
        pass
    return None


def build(part, log=None):
    """The part feature by feature, in the order SOLIDWORKS gets them. Each row: step, kind, before, after, dv, dm,
    exact (False where build123d could not make the feature and the change is an estimate), and what the macro needs
    to select (probes, neutral)."""
    zf = part.frame.z0
    rows = []
    exs = [s for s in part.steps if isinstance(s, Ex)]
    body = None
    for i, st in enumerate(exs):
        after = apply_ex(body, st)
        rows.append(dict(step=st, kind="ex", before=body, after=after))
        if st.taper:
            rows[-1]["wider"] = taper_wider(st)
        body = after
    done = []
    for st in [s for s in part.steps if isinstance(s, Dr)]:
        probes = []
        for name in st.of:
            got = side_faces(body, part.step(name))
            assert got, f"{part.key}: draft '{st.name}': no side faces of '{name}' in the part"
            for _, pts in got:
                probes += pts
        if abs(st.neutral - zf) < 1e-9:
            neutral = None                                         # the Front plane
        else:
            ff = flat_faces(body, st.neutral)
            assert ff, f"{part.key}: draft '{st.name}': no flat face at Z {st.neutral} to use as the neutral plane"
            neutral = inner_point(max(ff, key=lambda f: f.area))
        done.append(st)
        after = body_extrudes(part, drafts=done)
        flipped = body_extrudes(part, drafts=done[:-1] + [Dr(st.name, st.of, st.angle, st.neutral, -st.wider)])
        rows.append(dict(step=st, kind="dr", before=body, after=after, probes=probes, neutral=neutral, flipped=flipped))
        body = after
    for st in [s for s in part.steps if isinstance(s, (Ch, Fi))]:      # chamfers, then radii, in the order the recipe lists them
        edges = st.edges(body)
        assert edges, f"{part.key}: '{st.name}' selects no edge"
        length = sum(e.length for e in edges)
        row = dict(step=st, before=body, probes=edge_probes(edges), length=length, n_edges=len(edges))
        if isinstance(st, Ch):
            try:
                after = try_chamfer(body, edges, st.size)
            except Exception as e:
                raise RuntimeError(f"{part.key}: chamfer '{st.name}' ({len(edges)} edges) cannot be made in the replay: {e}") from None
            row.update(kind="ch", after=after, exact=True)
        else:
            after = try_fillet(body, edges, st.r)
            if after is None and len(edges) > 1 and getattr(st, "prune", True):
                # some edges cannot be rounded (they run out on a face that is tangent there, or off the part). A design's own
                # rounding leaves those sharp; so does this feature, if the rest can then be made
                alone = [e for e in edges if try_fillet(body, [e], st.r) is not None]
                if alone and len(alone) < len(edges):
                    after = try_fillet(body, alone, st.r)
                    if after is not None:
                        if log:
                            log(f"   {part.key}: '{st.name}': {len(edges) - len(alone)} of {len(edges)} edges cannot be rounded and are left sharp")
                        edges = alone
                        length = sum(e.length for e in edges)
                        row.update(probes=edge_probes(edges), length=length, n_edges=len(edges))
            conc = [is_concave(body, e) for e in edges]
            sign = 1 if sum(1 for c in conc if c) >= len(conc) / 2 else -1
            row.update(kind="fi", exact=after is not None, concave=sign > 0,
                       estimate=sign * length * st.r ** 2 * (1 - math.pi / 4))
            if after is None:
                after = body
                if log:
                    log(f"   {part.key}: '{st.name}': build123d cannot make this fillet; its volume is an estimate")
        row["after"] = after
        rows.append(row)
        body = after
    for st in [s for s in part.steps if isinstance(s, Mk)]:
        wider = 1 if st.z1 < st.z0 else -1                         # narrower with depth
        tool = prism(st.shapes, st.z0, st.z1, st.draft, st.z0, wider)
        after = body - tool if st.op == "cut" else body + tool
        rows.append(dict(step=st, kind="mk", before=body, after=after, wider=wider))
        body = after
    for r in rows:
        b, a = r["before"], r["after"]
        v0, m0 = (b.volume, moment_z(b, zf)) if b is not None else (0.0, 0.0)
        r["dv"], r["dm"] = a.volume - v0, moment_z(a, zf) - m0
        r["v"], r["m"] = a.volume, moment_z(a, zf)
        r.setdefault("exact", True)
        if r["kind"] == "fi" and not r["exact"]:
            r["dv"], r["dm"] = r["estimate"], 0.0
        if r["kind"] == "dr":
            f = r["flipped"]
            r["flip_dv"], r["flip_dm"] = f.volume - v0, moment_z(f, zf) - m0
    return rows


def reading_cands(part, row):
    """Every way SOLIDWORKS could read a boss / cut / mark call: which side of the Front plane it starts, which way it
    runs and (marks only) which way its walls lean, as (z start, z end, wider) in the design frame. The first is the
    feature as designed."""
    st, zf = row["step"], part.frame.z0
    depth = abs(st.z1 - st.z0)
    draft = getattr(st, "draft", 0.0) or getattr(st, "taper", 0.0)
    w_right = row.get("wider", 1)
    cands = [(st.z0, st.z1, w_right)]
    starts = [st.z0] if abs(st.z0 - zf) < 1e-9 else [st.z0, 2 * zf - st.z0]
    for zs in starts:
        for sgn in (1, -1):
            for w in ([w_right, -w_right] if draft else [w_right]):
                c = (zs, zs + sgn * depth, w)
                if not any(abs(c[0] - o[0]) < 1e-9 and abs(c[1] - o[1]) < 1e-9 and c[2] == o[2] for o in cands):
                    cands.append(c)
    return cands


def one_reading(part, st, before, cand, w_right=1):
    """What the part becomes for one reading: change in volume and in moment, number of bodies. Z in the part's frame."""
    zf = part.frame.z0
    zs, ze, w = cand
    draft = getattr(st, "draft", 0.0) or getattr(st, "taper", 0.0)
    v0, m0 = (before.volume, moment_z(before, zf)) if before is not None else (0.0, 0.0)
    tool = prism(st.shapes, zs, ze, draft, zs if draft else None, w)
    after = tool if before is None else (before + tool if st.op == "add" else before - tool)
    sol = [q for q in after.solids() if q.volume > 1e-6]
    return dict(z0=zs - zf, z1=ze - zf, widen=(w != w_right), dv=sum(q.volume for q in sol) - v0, dm=moment_z(after, zf) - m0, bodies=len(sol))
