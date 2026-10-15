"""Comparing two solids that should be the same, without trusting any one method.

OpenCascade booleans between near-identical solids can fail quietly, and a fillet can return a valid-looking solid
that sections and booleans cannot use. So: the boolean first, accepted only if it accounts for the difference in
volume; then slice by slice; then by counting sample points.
"""
import math
import random


def box_of(s):
    b = s.bounding_box()
    return [b.min.X, b.min.Y, b.min.Z, b.max.X, b.max.Y, b.max.Z]


def loops(sh, z):
    """Section of sh by the plane Z = z as (outer, [holes]) lists of (x, y) points."""
    from build123d import Box, Location
    b = box_of(sh)
    span = 4 * max(b[3] - b[0], b[4] - b[1], 1.0) + 2 * max(abs(v) for v in b[:2] + b[3:5]) + 10
    try:
        sec = sh & Box(span, span, 0.002).moved(Location((0, 0, z)))
    except Exception:
        return []
    if sec is None:
        return []

    def ring(w):
        pts = []
        try:
            es = list(w.order_edges())
        except Exception:
            es = list(w.edges())
        for e in es:
            try:
                k = max(2, int(e.length / 0.25))
                seg = [(q.X, q.Y) for q in (e.position_at(i / k) for i in range(k + 1))]
            except Exception:
                continue
            if pts and (math.dist(pts[-1], seg[0]) > math.dist(pts[-1], seg[-1])):
                seg = seg[::-1]
            pts += seg
        return pts

    out = []
    for f in sec.faces():
        try:
            n = f.normal_at()
        except Exception:
            continue
        if n.Z < 0.9:
            continue
        try:
            o = ring(f.outer_wire())
            if len(o) > 2:
                out.append((o, [h for h in (ring(w) for w in f.inner_wires()) if len(h) > 2]))
        except Exception:
            pass
    return out


def section(shape, z):
    """The shape cut by the plane Z = z, as one shapely geometry."""
    from shapely.geometry import Polygon
    from shapely.ops import unary_union
    polys = []
    for outer, holes in loops(shape, z):
        if len(outer) >= 3:
            pg = Polygon(outer, [h for h in holes if len(h) >= 3])
            polys.append(pg if pg.is_valid else pg.buffer(0))
    return unary_union(polys) if polys else Polygon()


def compare(a, b, dz=0.1):
    """Compares two solids slice by slice. Returns (volume only in a, volume only in b, the worst slices)."""
    za = min(box_of(a)[2], box_of(b)[2]) + 0.013
    zb = max(box_of(a)[5], box_of(b)[5]) - 0.013
    n = max(1, int((zb - za) / dz))
    only_a = only_b = 0.0
    worst = []
    for i in range(n + 1):
        z = za + (zb - za) * i / n
        sa, sb = section(a, z), section(b, z)
        da, db = sa.difference(sb), sb.difference(sa)
        only_a += da.area * (zb - za) / n
        only_b += db.area * (zb - za) / n
        d = da.union(db)
        if d.area > 0.02:
            big = max(getattr(d, "geoms", [d]), key=lambda g: g.area)
            worst.append((d.area, z, [round(v, 2) for v in big.bounds]))
    worst.sort(reverse=True)
    return only_a, only_b, worst


def differ(a, b, log=print):
    """(volume only in a, volume only in b, worst slices, method). The boolean's result is used only if it accounts for
    the difference in volume; otherwise the slices; and if they do not account for it either (a section can fail on a
    filleted body), sample points that are inside one solid and not the other (coarse: good for telling a real
    difference from a failed check)."""
    dv = a.volume - b.volume
    try:
        oa = sum(q.volume for q in (a - b).solids())
        ob = sum(q.volume for q in (b - a).solids())
        if abs(dv - (oa - ob)) < 1e-3 + 1e-6 * a.volume and oa < 0.2 * a.volume and ob < 0.2 * b.volume:
            return oa, ob, [], "boolean"
    except Exception:
        pass
    try:
        oa, ob, worst = compare(a, b)
        if abs(dv - (oa - ob)) < 0.05 + 0.002 * a.volume:
            return oa, ob, worst, "slices"
    except Exception:
        pass
    from build123d import Vector
    ba, bb = a.bounding_box(), b.bounding_box()
    lo = [min(ba.min.X, bb.min.X), min(ba.min.Y, bb.min.Y), min(ba.min.Z, bb.min.Z)]
    hi = [max(ba.max.X, bb.max.X), max(ba.max.Y, bb.max.Y), max(ba.max.Z, bb.max.Z)]
    rnd, n, na, nb = random.Random(3), 6000, 0, 0
    for _ in range(n):
        q = Vector(*[rnd.uniform(l, h) for l, h in zip(lo, hi)])
        ia, ib = a.is_inside(q), b.is_inside(q)
        na += ia and not ib
        nb += ib and not ia
    cell = (hi[0] - lo[0]) * (hi[1] - lo[1]) * (hi[2] - lo[2]) / n
    if log:
        log(f"      (compared by {n} sample points, {cell:.2f} mm3 each: neither the boolean nor the slices could be used)")
    return na * cell, nb * cell, [], "sample points"


def loops_of(segs, tol=1e-6):
    """Splits the segments of a sketch, in the order they were drawn, into closed loops."""
    out, cur, start, end = [], [], None, None
    for g in segs:
        if g[0] == "C":
            assert not cur, "a circle inside an open outline"
            out.append([g])
            continue
        p0, p1 = (g[1:3], g[3:5]) if g[0] == "L" else (g[3:5], g[5:7])
        if not cur:
            start = p0
        else:
            assert math.dist(end, p0) < tol, f"outline not continuous at {p0}"
        cur.append(g)
        end = p1
        if math.dist(end, start) < tol:
            out.append(cur)
            cur = []
    assert not cur, "an outline is not closed"
    return out
