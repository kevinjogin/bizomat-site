"""Plans the relations and dimensions that make a sketch fully defined, the way a designer would put them on.

A sketch is drawn at exact coordinates first; this module then decides which relations (horizontal, tangent, equal,
concentric, at midpoint ...) and which dimensions (to the related edges of the part, between holes, sizes) pin it down.
Each candidate is kept only if it removes degrees of freedom that are still free, so the result is exactly defined:
nothing left to drag, nothing redundant. The test is the rank of the constraint equations' Jacobian at the drawn
position, which is what a sketch solver's count of degrees of freedom comes to.

References a plan can use (encoded for the macro):
    ("S", i)            segment i of the sketch (1-based, in drawing order; helpers come after the outlines)
    ("P", i, "a"|"b"|"c")   start, end or centre point of segment i
    ("O",)              the sketch origin
    ("E", (x, y, z))    the model edge through that point (design frame)
"""
import math

import numpy as np

from core import seg_ends, seg_mid

EPS = 1e-7
NEAR = 3.5              # mm: a parallel edge this close to a side is "the wall next to it"


# ---------------------------------------------------------------------------------------------- the reference pool

def ref_pool(body, origin):
    """Straight edges (lying in a plane Z = const) and circular edges about Z of the part, as 2D references."""
    from core import edges_of
    lines, circles = {}, {}
    if body is None:
        return dict(lines=[], circles=[])
    for d in edges_of(body):
        if not d["flat"]:
            continue
        if d["kind"] == "line" and d["len"] > 0.05:
            (x0, y0, _), (x1, y1, _) = d["p0"], d["p1"]
            L = math.hypot(x1 - x0, y1 - y0)
            ux, uy = (x1 - x0) / L, (y1 - y0) / L
            if ux < -1e-9 or (abs(ux) < 1e-9 and uy < 0):
                ux, uy = -ux, -uy
            c = -uy * x0 + ux * y0                                  # signed offset of the line from the design origin
            key = (round(ux, 6), round(uy, 6), round(c, 5))
            if key not in lines or d["len"] > lines[key]["len"]:
                lines[key] = dict(u=(ux, uy), c=c, len=d["len"], probe=d["mid"], p0=(x0, y0), p1=(x1, y1))
        elif d["kind"] == "circle":
            key = (round(d["c"][0], 5), round(d["c"][1], 5), round(d["r"], 5))
            if key not in circles or d["len"] > circles[key]["len"]:
                circles[key] = dict(c=(d["c"][0], d["c"][1]), r=d["r"], len=d["len"], probe=d["mid"], z=d["z"])
    return dict(lines=list(lines.values()), circles=list(circles.values()))


def on_shapes(ref, shapes):
    """Does a reference line or circle lie on the outline of any of these shapes?"""
    for sh in shapes:
        for g in sh.segs:
            if "u" in ref and g[0] == "L":
                ux, uy = ref["u"]
                d0 = abs(-uy * g[1] + ux * g[2] - ref["c"])
                d1 = abs(-uy * g[3] + ux * g[4] - ref["c"])
                if d0 < 1e-6 and d1 < 1e-6:
                    return True
            if "r" in ref and g[0] in ("C", "A") and math.hypot(g[1] - ref["c"][0], g[2] - ref["c"][1]) < 1e-6:
                return True
    return False


# ---------------------------------------------------------------------------------------------- the model

class Sketch:
    """Points, segments and constraint rows of one sketch."""

    def __init__(self, shapes, origin):
        self.origin = origin
        self.segs = []              # dicts: t ("L", "A", "C", "CL", "PT"), geometry, variable indices, shape index
        self.q = []                 # variables
        self.rows = []              # residual functions already accepted
        self.rels, self.dims = [], []
        self.J = np.zeros((0, 0))
        self.shape_segs = []        # per shape: list of segment indices (1-based)
        self.n_text = 0
        for si, sh in enumerate(shapes):
            idx = []
            pts = {}                # merged joints inside this outline

            def pt(x, y, shared=True):
                key = (round(x, 6), round(y, 6))
                if shared and key in pts:
                    return pts[key]
                i = len(self.q)
                self.q += [x, y]
                if shared:
                    pts[key] = i
                return i
            for g in sh.segs:
                if g[0] == "L":
                    s = dict(t="L", g=g, a=pt(g[1], g[2]), b=pt(g[3], g[4]))
                elif g[0] == "A":
                    s = dict(t="A", g=g, c=pt(g[1], g[2], shared=False), a=pt(g[3], g[4]), b=pt(g[5], g[6]))
                else:
                    c = pt(g[1], g[2], shared=False)
                    r = len(self.q)
                    self.q.append(g[3])
                    s = dict(t="C", g=g, c=c, r=r)
                s["shape"] = si
                self.segs.append(s)
                idx.append(len(self.segs))
            self.shape_segs.append(idx)
        self.q = np.array(self.q, dtype=float)
        # an arc's two ends are the same distance from its centre: part of what an arc is, not a relation
        for s in self.segs:
            if s["t"] == "A":
                self._force(self._f_arc(s))
        # joints
        for idx in self.shape_segs:
            n = len(idx)
            for k in range(n):
                i, j = idx[k], idx[(k + 1) % n]
                a, b = self.segs[i - 1], self.segs[j - 1]
                if a["t"] in ("L", "A") and b["t"] in ("L", "A") and a["b"] == b["a"] and i != j:
                    self.rels.append(("MERGE", [("P", i, "b"), ("P", j, "a")]))

    # ---- variables
    def add_var(self, *vals):
        i = len(self.q)
        self.q = np.concatenate([self.q, np.array(vals, dtype=float)])
        if self.J.shape[0]:
            self.J = np.hstack([self.J, np.zeros((self.J.shape[0], len(vals)))])
        return i

    def P(self, i):
        return (self.q[i], self.q[i + 1])

    def helper_line(self, x0, y0, x1, y1):
        a, b = self.add_var(x0, y0), self.add_var(x1, y1)
        self.segs.append(dict(t="CL", g=("L", x0, y0, x1, y1), a=a, b=b, shape=-1))
        return len(self.segs)

    def helper_point(self, x, y):
        p = self.add_var(x, y)
        self.segs.append(dict(t="PT", g=("P", x, y), c=p, shape=-1))
        return len(self.segs)

    # ---- rank bookkeeping
    def _jac(self, fs):
        n = len(self.q)
        out = np.zeros((len(fs), n))
        h = 1e-6
        for k in range(n):
            q1, q0 = self.q.copy(), self.q.copy()
            q1[k] += h
            q0[k] -= h
            out[:, k] = [(f(q1) - f(q0)) / (2 * h) for f in fs]
        return out

    @staticmethod
    def _rank(M):
        if M.size == 0:
            return 0
        s = np.linalg.svd(M, compute_uv=False)
        return int((s > 1e-7 * max(1.0, s[0])).sum())

    def rank(self):
        return self._rank(self.J)

    def free(self):
        return len(self.q) - self.rank()

    def _force(self, fs):
        fs = fs if isinstance(fs, list) else [fs]
        rows = self._jac(fs)
        self.J = rows if self.J.shape[0] == 0 else np.vstack([self.J, rows])
        self.rows += fs

    def gain(self, fs):
        """How many still-free degrees of freedom these equations would remove, and whether they hold as drawn."""
        fs = fs if isinstance(fs, list) else [fs]
        if any(abs(f(self.q)) > 1e-6 for f in fs):
            return -1
        rows = self._jac(fs)
        both = rows if self.J.shape[0] == 0 else np.vstack([self.J, rows])
        return self._rank(both) - self.rank()

    def take(self, fs):
        """Adds the equations if every one of them removes a degree of freedom. True if added."""
        fs = fs if isinstance(fs, list) else [fs]
        if self.gain(fs) != len(fs):
            return False
        self._force(fs)
        return True

    # ---- residuals
    def _f_arc(self, s):
        c, a, b = s["c"], s["a"], s["b"]
        return lambda q: math.hypot(q[a] - q[c], q[a + 1] - q[c + 1]) - math.hypot(q[b] - q[c], q[b + 1] - q[c + 1])

    def radius(self, s):
        if s["t"] == "C":
            r = s["r"]
            return lambda q: q[r]
        c, a = s["c"], s["a"]
        return lambda q: math.hypot(q[a] - q[c], q[a + 1] - q[c + 1])

    def pidx(self, ref):
        """Variable index of a point reference ("P", i, which), or None for the origin."""
        if ref[0] == "O":
            return None
        s = self.segs[ref[1] - 1]
        return s[ref[2]]

    def xy(self, ref):
        i = self.pidx(ref)
        if i is None:
            ox, oy = self.origin
            return lambda q: (ox, oy)
        return lambda q: (q[i], q[i + 1])

    # ---- relations (each returns True if it was added)
    def rel(self, kind, refs, fs):
        if self.take(fs):
            self.rels.append((kind, refs))
            return True
        return False

    def hor(self, i):
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        return self.rel("HOR", [("S", i)], lambda q: q[a + 1] - q[b + 1])

    def ver(self, i):
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        return self.rel("VER", [("S", i)], lambda q: q[a] - q[b])

    def tan(self, i, j, shared):
        a, b = self.segs[i - 1], self.segs[j - 1]
        p = shared

        def nrm(q, s):
            if s["t"] in ("L", "CL"):
                dx, dy = q[s["b"]] - q[s["a"]], q[s["b"] + 1] - q[s["a"] + 1]
            else:                                                   # tangent direction of the arc at p
                dx, dy = -(q[p + 1] - q[s["c"] + 1]), q[p] - q[s["c"]]
            L = math.hypot(dx, dy)
            return dx / L, dy / L

        def f(q):
            ux, uy = nrm(q, a)
            vx, vy = nrm(q, b)
            return ux * vy - uy * vx
        return self.rel("TAN", [("S", i), ("S", j)], f)

    def eq(self, i, j):
        ra, rb = self.radius(self.segs[i - 1]), self.radius(self.segs[j - 1])
        return self.rel("EQ", [("S", i), ("S", j)], lambda q: ra(q) - rb(q))

    def col(self, i, target, tref):
        """Line i collinear with a fixed line (model edge) or with sketch line (given as segment index)."""
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        if isinstance(target, int):
            t = self.segs[target - 1]
            ta, tb = t["a"], t["b"]

            def d(q, p):
                ux, uy = q[tb] - q[ta], q[tb + 1] - q[ta + 1]
                L = math.hypot(ux, uy)
                return (-(uy / L) * (q[p] - q[ta]) + (ux / L) * (q[p + 1] - q[ta + 1]))
        else:
            ux, uy = target["u"]
            c = target["c"]

            def d(q, p):
                return -uy * q[p] + ux * q[p + 1] - c
        # the line already has its direction when this is used, so one point on the target line is all that is left
        return self.rel("COL", [("S", i), tref], lambda q: d(q, a))

    def _dir(self, target):
        """q -> unit direction of a sketch line (segment index) or of a fixed line (a model edge)."""
        if isinstance(target, int):
            t = self.segs[target - 1]
            ta, tb = t["a"], t["b"]

            def u(q):
                dx, dy = q[tb] - q[ta], q[tb + 1] - q[ta + 1]
                L = math.hypot(dx, dy)
                return dx / L, dy / L
            return u
        ux, uy = target["u"]
        return lambda q: (ux, uy)

    def par(self, i, target, tref):
        """Line i parallel to a sketch line (segment index) or to a model edge."""
        a, b = self._dir(i), self._dir(target)

        def f(q):
            (ux, uy), (vx, vy) = a(q), b(q)
            return ux * vy - uy * vx
        return self.rel("PAR", [("S", i), tref], f)

    def perp(self, i, target, tref):
        a, b = self._dir(i), self._dir(target)

        def f(q):
            (ux, uy), (vx, vy) = a(q), b(q)
            return ux * vx + uy * vy
        return self.rel("PERP", [("S", i), tref], f)

    def conc_seg(self, i, j):
        """Arc or circle i about the same centre as arc or circle j of the sketch."""
        c, d = self.segs[i - 1]["c"], self.segs[j - 1]["c"]
        return self.rel("CONC", [("S", i), ("S", j)], [lambda q: q[c] - q[d], lambda q: q[c + 1] - q[d + 1]])

    def conc_point(self, pref, centre, tref):
        """A sketch point on the centre of a model circle."""
        c = self.pidx(pref)
        cx, cy = centre
        return self.rel("CONC", [pref, tref], [lambda q: q[c] - cx, lambda q: q[c + 1] - cy])

    def coin_points(self, p1, p2):
        """Two sketch points at one place."""
        a, b = self.pidx(p1), self.pidx(p2)
        return self.rel("COIN", [p1, p2], [lambda q: q[a] - q[b], lambda q: q[a + 1] - q[b + 1]])

    def col_edge(self, i, ref, tref):
        """Line i on a model edge's line, when its direction is not settled yet: both its ends on that line."""
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        ux, uy = ref["u"]
        c = ref["c"]
        return self.rel("COL", [("S", i), tref], [lambda q: -uy * q[a] + ux * q[a + 1] - c, lambda q: -uy * q[b] + ux * q[b + 1] - c])

    def mid_edge(self, pref, ref, tref):
        """A sketch point at the middle of a straight model edge."""
        p = self.pidx(pref)
        mx, my = (ref["p0"][0] + ref["p1"][0]) / 2, (ref["p0"][1] + ref["p1"][1]) / 2
        return self.rel("MID", [pref, tref], [lambda q: q[p] - mx, lambda q: q[p + 1] - my])

    def conc(self, i, centre, tref):
        """Centre of circle / arc / point i on a fixed centre."""
        c = self.segs[i - 1]["c"]
        cx, cy = centre
        return self.rel("CONC", [("S", i) if self.segs[i - 1]["t"] != "PT" else ("P", i, "c"), tref], [lambda q: q[c] - cx, lambda q: q[c + 1] - cy])

    def coin_origin_line(self, i):
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        ox, oy = self.origin

        def f(q):
            ux, uy = q[b] - q[a], q[b + 1] - q[a + 1]
            L = math.hypot(ux, uy)
            return (-(uy) * (ox - q[a]) + ux * (oy - q[a + 1])) / L
        return self.rel("COIN", [("O",), ("S", i)], f)

    def coin_point_origin(self, pref):
        p = self.pidx(pref)
        ox, oy = self.origin
        return self.rel("COIN", [pref, ("O",)], [lambda q: q[p] - ox, lambda q: q[p + 1] - oy])

    def mid(self, pref, i):
        """Point pref at the middle of line i."""
        p = self.pidx(pref)
        s = self.segs[i - 1]
        a, b = s["a"], s["b"]
        return self.rel("MID", [pref, ("S", i)], [lambda q: q[p] - (q[a] + q[b]) / 2, lambda q: q[p + 1] - (q[a + 1] + q[b + 1]) / 2])

    def hpt(self, p1, p2):
        f1, f2 = self.xy(p1), self.xy(p2)
        return self.rel("HPT", [p1, p2], lambda q: f1(q)[1] - f2(q)[1])

    def vpt(self, p1, p2):
        f1, f2 = self.xy(p1), self.xy(p2)
        return self.rel("VPT", [p1, p2], lambda q: f1(q)[0] - f2(q)[0])

    def fix(self, i):
        s = self.segs[i - 1]
        fs = []
        for k in ("a", "b", "c"):
            if k in s:
                v = s[k]
                x0, y0 = self.q[v], self.q[v + 1]
                for j, val in ((v, x0), (v + 1, y0)):
                    f = (lambda j, val: lambda q: q[j] - val)(j, val)
                    if self.gain(f) == 1:
                        fs.append(f)
                        self._force(f)
        if s["t"] == "C":
            r, r0 = s["r"], self.q[s["r"]]
            f = lambda q: q[r] - r0
            if self.gain(f) == 1:
                fs.append(f)
                self._force(f)
        if fs:
            self.rels.append(("FIX", [("S", i)]))
        return bool(fs)

    # ---- dimensions
    def _text(self, x, y):
        self.n_text += 1
        return (x, y)

    def dim(self, kind, refs, fs, at, value):
        if abs(value) < 1e-6:                                       # nothing is dimensioned 0: that is a relation
            return False
        if self.take(fs):
            self.dims.append((kind, refs, self._text(*at), value))
            return True
        return False

    def dim_line_ref(self, i, ref, tref):
        """Distance between line i and a parallel fixed line (model edge)."""
        s = self.segs[i - 1]
        a = s["a"]
        ux, uy = ref["u"]
        c = ref["c"]
        val = -uy * self.q[a] + ux * self.q[a + 1] - c
        mx, my = seg_mid(s["g"])
        return self.dim("DIST", [("S", i), tref], lambda q: (-uy * q[a] + ux * q[a + 1] - c) - val,
                        (mx - uy * (-val / 2) + ux * 4, my + ux * (-val / 2) + uy * 4), abs(val))

    def dim_line_line(self, i, j):
        """Distance between two parallel sketch lines (a size)."""
        s, t = self.segs[i - 1], self.segs[j - 1]
        a, ta, tb = s["a"], t["a"], t["b"]

        def d(q):
            ux, uy = q[tb] - q[ta], q[tb + 1] - q[ta + 1]
            L = math.hypot(ux, uy)
            return (-(uy / L) * (q[a] - q[ta]) + (ux / L) * (q[a + 1] - q[ta + 1]))
        val = d(self.q)
        (m1x, m1y), (m2x, m2y) = seg_mid(s["g"]), seg_mid(t["g"])
        ux, uy = self.q[tb] - self.q[ta], self.q[tb + 1] - self.q[ta + 1]
        L = math.hypot(ux, uy)
        ux, uy = ux / L, uy / L
        # the text goes past the ends of the two lines, clear of the outline
        cx, cy = (m1x + m2x) / 2, (m1y + m2y) / 2
        ends = [p for g in (s["g"], t["g"]) for p in seg_ends(g)]
        far = max((p[0] - cx) * ux + (p[1] - cy) * uy for p in ends)
        return self.dim("DIST", [("S", i), ("S", j)], lambda q: d(q) - val, (cx + ux * (far + 8), cy + uy * (far + 8)), abs(val))

    def dim_point_ref(self, pref, ref, tref):
        """Distance from a point to a fixed line (model edge)."""
        p = self.pidx(pref)
        ux, uy = ref["u"]
        c = ref["c"]
        val = -uy * self.q[p] + ux * self.q[p + 1] - c
        x, y = self.q[p], self.q[p + 1]
        return self.dim("DIST", [pref, tref], lambda q: (-uy * q[p] + ux * q[p + 1] - c) - val, (x + uy * val / 2 + ux * 4, y - ux * val / 2 + uy * 4), abs(val))

    def dim_point_line(self, pref, j):
        """Distance from a point to a sketch line."""
        p = self.pidx(pref)
        t = self.segs[j - 1]
        ta, tb = t["a"], t["b"]

        def d(q):
            ux, uy = q[tb] - q[ta], q[tb + 1] - q[ta + 1]
            L = math.hypot(ux, uy)
            return (-(uy / L) * (q[p] - q[ta]) + (ux / L) * (q[p + 1] - q[ta + 1]))
        val = d(self.q)
        x, y = self.q[p], self.q[p + 1]
        mx, my = seg_mid(t["g"])
        return self.dim("DIST", [pref, ("S", j)], lambda q: d(q) - val, ((x + mx) / 2 + 3, (y + my) / 2 + 3), abs(val))

    def dim_len(self, i):
        """Length of sketch line i."""
        t = self.segs[i - 1]
        ta, tb = t["a"], t["b"]
        d = lambda q: math.hypot(q[tb] - q[ta], q[tb + 1] - q[ta + 1])
        val = d(self.q)
        mx, my = seg_mid(t["g"])
        ux, uy = (self.q[tb] - self.q[ta]) / val, (self.q[tb + 1] - self.q[ta + 1]) / val
        return self.dim("DIST", [("S", i)], lambda q: d(q) - val, (mx - uy * 5.0, my + ux * 5.0), val)

    def dim_origin_line(self, i):
        """Distance from the origin to sketch line i."""
        t = self.segs[i - 1]
        ta, tb = t["a"], t["b"]
        ox, oy = self.origin

        def d(q):
            ux, uy = q[tb] - q[ta], q[tb + 1] - q[ta + 1]
            L = math.hypot(ux, uy)
            return (-(uy / L) * (ox - q[ta]) + (ux / L) * (oy - q[ta + 1]))
        val = d(self.q)
        if abs(val) < 1e-6:
            return False
        mx, my = seg_mid(t["g"])
        return self.dim("DIST", [("O",), ("S", i)], lambda q: d(q) - val, ((ox + mx) / 2 + 3, (oy + my) / 2 + 3), abs(val))

    def dim_ang(self, i, target, tref):
        """Angle between sketch line i and a sketch line (segment index) or a model edge. The value is the angle between
        the two lines as lines, 0 to 90 degrees."""
        a, b = self._dir(i), self._dir(target)

        def ang(q):
            (ux, uy), (vx, vy) = a(q), b(q)
            return math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
        v0 = ang(self.q)
        deg = abs(math.degrees(v0)) % 180.0
        deg = min(deg, 180.0 - deg)
        if deg < 0.01:
            return False

        def f(q):
            d = ang(q) - v0
            return math.atan2(math.sin(d), math.cos(d))
        # the text goes inside the sharp angle, a little way from where the two lines cross
        s = self.segs[i - 1]
        (ux, uy) = a(self.q)
        (vx, vy) = b(self.q)
        if ux * vx + uy * vy < 0:
            vx, vy = -vx, -vy
        x1, y1 = self.q[s["a"]], self.q[s["a"] + 1]
        if isinstance(target, int):
            t = self.segs[target - 1]
            x2, y2 = self.q[t["a"]], self.q[t["a"] + 1]
        else:
            x2, y2 = target["p0"]
        den = ux * vy - uy * vx
        k = ((x2 - x1) * vy - (y2 - y1) * vx) / den
        ix, iy = x1 + k * ux, y1 + k * uy
        mx, my = seg_mid(s["g"])
        if math.hypot(ix - mx, iy - my) > 40.0:                      # nearly parallel: they cross far off the part
            return self.dim("ANG", [("S", i), tref], f, (mx - uy * 6.0, my + ux * 6.0), deg)
        sg = 1.0 if (mx - ix) * ux + (my - iy) * uy >= 0 else -1.0
        bx, by = sg * (ux + vx), sg * (uy + vy)
        L = math.hypot(bx, by)
        at = (ix + bx / L * 7.0, iy + by / L * 7.0)
        return self.dim("ANG", [("S", i), tref], f, at, deg)

    def dim_h(self, p1, p2):
        f1, f2 = self.xy(p1), self.xy(p2)
        val = f1(self.q)[0] - f2(self.q)[0]
        (x1, y1), (x2, y2) = f1(self.q), f2(self.q)
        return self.dim("HDIST", [p1, p2], lambda q: f1(q)[0] - f2(q)[0] - val, ((x1 + x2) / 2, max(y1, y2) + 5), abs(val))

    def dim_v(self, p1, p2):
        f1, f2 = self.xy(p1), self.xy(p2)
        val = f1(self.q)[1] - f2(self.q)[1]
        (x1, y1), (x2, y2) = f1(self.q), f2(self.q)
        return self.dim("VDIST", [p1, p2], lambda q: f1(q)[1] - f2(q)[1] - val, (max(x1, x2) + 5, (y1 + y2) / 2), abs(val))

    def dim_r(self, i):
        s = self.segs[i - 1]
        f = self.radius(s)
        val = f(self.q)
        mx, my = seg_mid(s["g"])
        cx, cy = self.q[s["c"]], self.q[s["c"] + 1]
        k = 1 + 3.0 / max(val, 0.5)
        at = (cx + (mx - cx) * k, cy + (my - cy) * k)
        if s["t"] == "C":
            return self.dim("DIA", [("S", i)], lambda q: f(q) - val, at, 2 * val)
        return self.dim("RAD", [("S", i)], lambda q: f(q) - val, at, val)


# ---------------------------------------------------------------------------------------------- the planner

def _side(sk, idx, sh, name):
    """Segment index (1-based in the sketch) of a named side of a shape."""
    return idx[sh.ents[name]]


def _nearest_parallel(pool, u, c, exclude_zero=True, limit=None, prefer=None, shapes_by_name=None, span=None, only_preferred=False):
    """The reference line parallel to direction u nearest to the line with offset c. prefer: names of features whose
    edges win over the rest. span = (lo, hi) along u: only edges that run alongside that stretch count (a wall
    "next to" a side has to be next to it, not merely in line with it somewhere else on the part)."""
    best = None
    for ref in pool["lines"]:
        if abs(ref["u"][0] - u[0]) > 1e-6 or abs(ref["u"][1] - u[1]) > 1e-6:
            continue
        if span is not None:
            t0 = ref["p0"][0] * u[0] + ref["p0"][1] * u[1]
            t1 = ref["p1"][0] * u[0] + ref["p1"][1] * u[1]
            if max(t0, t1) < span[0] - 0.5 or min(t0, t1) > span[1] + 0.5:
                continue
        d = abs(ref["c"] - c)
        if exclude_zero and d < 1e-6:
            continue
        if limit is not None and d > limit:
            continue
        rank = 1
        if prefer and shapes_by_name:
            for k, n in enumerate(prefer):
                if n in shapes_by_name and on_shapes(ref, shapes_by_name[n]):
                    rank = -len(prefer) + k
                    break
        if only_preferred and rank == 1:
            continue
        key = (rank, d)
        if best is None or key < best[0]:
            best = (key, ref)
    return best[1] if best else None


def _span(sh, u):
    """Extent of a shape along the direction u."""
    ts = []
    for g in sh.segs:
        if g[0] == "C":
            t = g[1] * u[0] + g[2] * u[1]
            ts += [t - g[3], t + g[3]]
        else:
            for p in seg_ends(g):
                ts.append(p[0] * u[0] + p[1] * u[1])
    return (min(ts), max(ts))


def seg_sweep(g):
    """Angle an arc turns through (radians)."""
    _, cx, cy, x0, y0, x1, y1, ccw = g
    a0, a1 = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx)
    return (a1 - a0) % (2 * math.pi) if ccw else (a0 - a1) % (2 * math.pi)


def _line_uc(g):
    x0, y0, x1, y1 = g[1:5]
    L = math.hypot(x1 - x0, y1 - y0)
    ux, uy = (x1 - x0) / L, (y1 - y0) / L
    if ux < -1e-9 or (abs(ux) < 1e-9 and uy < 0):
        ux, uy = -ux, -uy
    return (ux, uy), -uy * x0 + ux * y0


def plan(shapes, origin, pool, is_base=False, prefer=(), shapes_by_name=None, base_name=None, fix_free=False, fix_all=False):
    """The relations and dimensions for one sketch. Returns the Sketch (rels, dims, helpers in segs, free()).
    fix_all: a traced outline, every segment fixed where it is drawn."""
    sk = Sketch(shapes, origin)
    shapes_by_name = shapes_by_name or {}
    if fix_all:
        for i in range(1, len(sk.segs) + 1):
            sk.fix(i)
        return sk
    E = lambda ref: ("E", ref["probe"])
    datum_pts = {}                                                  # reference circle -> helper point at its centre

    def datum_point(ref):
        key = (round(ref["c"][0], 5), round(ref["c"][1], 5))
        if key not in datum_pts:
            i = sk.helper_point(*ref["c"])
            assert sk.conc(i, ref["c"], E(ref))
            datum_pts[key] = ("P", i, "c")
        return datum_pts[key]

    def pref_circle():
        """Axis of the first preferred feature that is round (a hole, a boss), as a reference circle. Corner radii of
        a rectangle are not an axis anyone measures from."""
        for n in prefer:
            for sh in shapes_by_name.get(n, []):
                if sh.kind in ("circle", "tongue"):
                    for ref in pool["circles"]:
                        if math.hypot(ref["c"][0] - sh.p["x"], ref["c"][1] - sh.p["y"]) < 1e-6:
                            return ref
        return None

    # 1. what the outlines are made of: horizontal, vertical, tangent
    for i, s in enumerate(sk.segs, 1):
        if s["t"] == "L":
            g = s["g"]
            if abs(g[2] - g[4]) < EPS:
                sk.hor(i)
            elif abs(g[1] - g[3]) < EPS:
                sk.ver(i)
    for idx in sk.shape_segs:
        n = len(idx)
        for k in range(n):
            i, j = idx[k], idx[(k + 1) % n]
            a, b = sk.segs[i - 1], sk.segs[j - 1]
            if i == j or "b" not in a or "a" not in b or a["b"] != b["a"]:
                continue
            if a["t"] == "A" or b["t"] == "A":
                p = a["b"]
                # tangent only where the outline really is smooth
                def direction(s, at_end):
                    g = s["g"]
                    if s["t"] == "L":
                        return (g[3] - g[1], g[4] - g[2])
                    px, py = (g[5], g[6]) if at_end else (g[3], g[4])
                    rx, ry = px - g[1], py - g[2]
                    return (-ry, rx) if g[7] else (ry, -rx)
                d1, d2 = direction(a, True), direction(b, False)
                cr = (d1[0] * d2[1] - d1[1] * d2[0]) / (math.hypot(*d1) * math.hypot(*d2))
                if abs(cr) < 1e-6:
                    sk.tan(i, j, p)

    # 2. equal radii
    groups = {}
    for i, s in enumerate(sk.segs, 1):
        if s["t"] in ("A", "C"):
            r = s["g"][3] if s["t"] == "C" else math.hypot(s["g"][3] - s["g"][1], s["g"][4] - s["g"][2])
            groups.setdefault((s["t"], round(r, 6)), []).append(i)
    for (_, _), members in groups.items():
        for j in members[1:]:
            sk.eq(j, members[0])

    ox, oy = origin
    # a part that starts from something round has an axis, not walls: what is not tied to a feature named in refs is
    # then measured from the origin rather than from whatever straight edge happens to be nearest
    round_base = bool(base_name) and all(sh.kind == "circle" for sh in shapes_by_name.get(base_name, [])) and not is_base
    seen_circles = []                                               # (segment index, x, y) of circles already placed in this sketch
    seen_lines = []                                                 # (segment index, u, c) of sides already placed

    def locate_point(pref, x, y, want_x=True, want_y=True):
        """Pins a point (a hole centre, an arc centre): on the centre lines, in line with another hole, from the datum
        axis or from the nearest edge of the base."""
        if want_y and abs(y - oy) < EPS and sk.hpt(pref, ("O",)):
            want_y = False
        if want_x and abs(x - ox) < EPS and sk.vpt(pref, ("O",)):
            want_x = False
        for (j, cx, cy) in seen_circles:
            if want_x and abs(cx - x) < EPS and sk.vpt(pref, ("P", j, "c")):
                want_x = False
            if want_y and abs(cy - y) < EPS and sk.hpt(pref, ("P", j, "c")):
                want_y = False
        dc = pref_circle()
        if dc is not None and (want_x or want_y):
            dp = datum_point(dc)
            if want_x and abs(dc["c"][0] - x) > EPS and sk.dim_h(pref, dp):
                want_x = False
            if want_y and abs(dc["c"][1] - y) > EPS and sk.dim_v(pref, dp):
                want_y = False
        if want_x:
            ref = _nearest_parallel(pool, (0.0, 1.0), -x, prefer=prefer or ((base_name,) if base_name else ()), shapes_by_name=shapes_by_name,
                                    only_preferred=round_base)
            if ref is not None and sk.dim_point_ref(pref, ref, E(ref)):
                want_x = False
        if want_y:
            ref = _nearest_parallel(pool, (1.0, 0.0), y, prefer=prefer or ((base_name,) if base_name else ()), shapes_by_name=shapes_by_name,
                                    only_preferred=round_base)
            if ref is not None and sk.dim_point_ref(pref, ref, E(ref)):
                want_y = False
        if want_x:
            sk.dim_h(pref, ("O",))
        if want_y:
            sk.dim_v(pref, ("O",))

    def locate_pair(idx, sh, lo, hi, axis, inset=False):
        """Pins the two parallel sides of a rectangle along one axis. lo / hi are the names of the sides."""
        i0, i1 = _side(sk, idx, sh, lo), _side(sk, idx, sh, hi)
        g0, g1 = sk.segs[i0 - 1]["g"], sk.segs[i1 - 1]["g"]
        (u, c0), (_, c1) = _line_uc(g0), _line_uc(g1)
        span = _span(sh, u)
        o = oy if axis == "y" else -ox                              # offset of the centre line through the origin
        # in line with a side already drawn in this sketch
        done0 = done1 = False
        for (j, uj, cj) in seen_lines:
            if abs(uj[0] - u[0]) < 1e-9 and abs(uj[1] - u[1]) < 1e-9:
                if not done0 and abs(cj - c0) < EPS:
                    done0 = sk.col(i0, j, ("S", j))
                if not done1 and abs(cj - c1) < EPS:
                    done1 = sk.col(i1, j, ("S", j))
        # on an edge of the part
        for k, (i, c) in enumerate(((i0, c0), (i1, c1))):
            if (done0, done1)[k]:
                continue
            ref = _nearest_parallel(pool, u, c, exclude_zero=False, limit=1e-6)
            if ref is not None and sk.col(i, ref, E(ref)):
                if k == 0:
                    done0 = True
                else:
                    done1 = True
        # through the origin
        for k, (i, c) in enumerate(((i0, c0), (i1, c1))):
            if not (done0, done1)[k] and abs(c - o) < EPS and not is_base and sk.coin_origin_line(i):
                if k == 0:
                    done0 = True
                else:
                    done1 = True
        # an outline that follows the walls all round (a pocket inside a body): each side from the wall next to it
        if inset:
            for k, (i, c) in enumerate(((i0, c0), (i1, c1))):
                if not (done0, done1)[k]:
                    ref = _nearest_parallel(pool, u, c, limit=NEAR, span=span)
                    if ref is not None and sk.dim_line_ref(i, ref, E(ref)):
                        if k == 0:
                            done0 = True
                        else:
                            done1 = True
            if done0 and done1:
                return
        # centred on the centre line: a construction line between the middles of the other two sides, through the origin
        if not (done0 or done1) and abs((c0 + c1) / 2 - o) < EPS:
            other = ("x0", "x1") if axis == "y" else ("y0", "y1")
            j0, j1 = _side(sk, idx, sh, other[0]), _side(sk, idx, sh, other[1])
            m0, m1 = seg_mid(sk.segs[j0 - 1]["g"]), seg_mid(sk.segs[j1 - 1]["g"])
            n = sk.helper_line(*m0, *m1)
            ok = sk.mid(("P", n, "a"), j0) and sk.mid(("P", n, "b"), j1) and sk.coin_origin_line(n)
            if ok:
                sk.dim_line_line(i1, i0)
                done0 = done1 = True
        if done0 and done1:
            return
        # the wall next to each side
        near0 = None if done0 else _nearest_parallel(pool, u, c0, limit=NEAR, span=span)
        near1 = None if done1 else _nearest_parallel(pool, u, c1, limit=NEAR, span=span)
        if near0 is not None and not done0:
            done0 = sk.dim_line_ref(i0, near0, E(near0))
        if near1 is not None and not done1:
            done1 = sk.dim_line_ref(i1, near1, E(near1))
        if done0 and done1:
            return
        # one side from the datum (the preferred feature's axis or edge, else the nearest edge of the base), then the size
        if not (done0 or done1):
            dc = pref_circle()
            if dc is not None:
                dp = datum_point(dc)
                k = 0 if abs(c0 - (-u[1] * dc["c"][0] + u[0] * dc["c"][1])) <= abs(c1 - (-u[1] * dc["c"][0] + u[0] * dc["c"][1])) else 1
                if sk.dim_point_line(dp, (i0, i1)[k]):
                    done0, done1 = (k == 0), (k == 1)
            if not (done0 or done1):
                pr = prefer or ((base_name,) if base_name else ())
                r0 = _nearest_parallel(pool, u, c0, prefer=pr, shapes_by_name=shapes_by_name, only_preferred=round_base)
                r1 = _nearest_parallel(pool, u, c1, prefer=pr, shapes_by_name=shapes_by_name, only_preferred=round_base)
                pick = None
                if r0 is not None and r1 is not None:
                    pick = (i0, r0, 0) if abs(r0["c"] - c0) <= abs(r1["c"] - c1) else (i1, r1, 1)
                elif r0 is not None:
                    pick = (i0, r0, 0)
                elif r1 is not None:
                    pick = (i1, r1, 1)
                if pick is not None and sk.dim_line_ref(pick[0], pick[1], E(pick[1])):
                    done0, done1 = (pick[2] == 0), (pick[2] == 1)
            if not (done0 or done1) and not is_base:
                # from the origin: the side nearer to it
                k = 0 if abs(c0 - o) <= abs(c1 - o) else 1
                if sk.dim_origin_line((i0, i1)[k]):
                    done0, done1 = (k == 0), (k == 1)
        if done0 != done1:
            sk.dim_line_line(i1, i0)

    def mid_of_edge(pref, x, y):
        """Ties a point to the middle of a straight edge of a feature named in refs, if it is there."""
        for ref in pool["lines"]:
            mx, my = (ref["p0"][0] + ref["p1"][0]) / 2, (ref["p0"][1] + ref["p1"][1]) / 2
            if math.hypot(mx - x, my - y) < 1e-6 and any(n in shapes_by_name and on_shapes(ref, shapes_by_name[n]) for n in prefer):
                if sk.mid_edge(pref, ref, E(ref)):
                    return True
        return False

    def locate_end(pref, x, y):
        """Pins the end of a centre line: on the origin, on the axis of something round already there, on a centre
        already placed in this sketch, or by dimensions."""
        if abs(x - ox) < EPS and abs(y - oy) < EPS and sk.coin_point_origin(pref):
            return
        for (j, cx, cy) in seen_circles:
            if abs(cx - x) < EPS and abs(cy - y) < EPS and sk.coin_points(pref, ("P", j, "c")):
                return
        same = [r for r in pool["circles"] if math.hypot(r["c"][0] - x, r["c"][1] - y) < 1e-6]
        if same:
            same.sort(key=lambda r: (0 if any(n in shapes_by_name and on_shapes(r, shapes_by_name[n]) for n in prefer) else 1, -r["len"]))
            if sk.conc_point(pref, same[0]["c"], E(same[0])):
                return
        locate_point(pref, x, y)

    def angle_ref(i, idx):
        """What a slanted line's angle is dimensioned to: a level or upright line of the same outline, else a level or
        upright straight edge of the part (the preferred features' first, then the longest). The one it is nearer to
        in angle wins. Returns (target, tref) or None."""
        u, _ = _line_uc(sk.segs[i - 1]["g"])
        cands = []
        for j in idx:
            t = sk.segs[j - 1]
            if t["t"] == "L" and j != i:
                v, _ = _line_uc(t["g"])
                if abs(v[0]) < 1e-9 or abs(v[1]) < 1e-9:
                    cands.append((0, v, j, ("S", j), 0.0))
        for ref in pool["lines"]:
            v = ref["u"]
            if abs(v[0]) < 1e-9 or abs(v[1]) < 1e-9:
                rank = 2
                for n in prefer:
                    if n in shapes_by_name and on_shapes(ref, shapes_by_name[n]):
                        rank = 1
                cands.append((rank, v, ref, E(ref), -ref["len"]))
        best = None
        for rank, v, target, tref, tie in cands:
            a = math.degrees(math.acos(min(1.0, abs(u[0] * v[0] + u[1] * v[1]))))
            key = (rank, 0 if a <= 45.0 + 1e-9 else 1, tie)
            if best is None or key < best[0]:
                best = (key, target, tref)
        return (best[1], best[2], best[0]) if best else None

    def plan_strip(idx, sh):
        """A bar at an angle: a construction line down its middle from end to end; the ends square to it and centred on
        it, a side parallel to it, the width; then the two ends of the centre line."""
        i_s0, i_e1, i_s1, i_e0 = (idx[sh.ents[k]] for k in ("side0", "end1", "side1", "end0"))
        a, b = sh.p["a"], sh.p["b"]
        n = sk.helper_line(*a, *b)
        sk.mid(("P", n, "a"), i_e0)
        sk.mid(("P", n, "b"), i_e1)
        sk.perp(i_e0, n, ("S", n))
        sk.perp(i_e1, n, ("S", n))
        sk.par(i_s0, n, ("S", n))
        sk.dim_line_line(i_s1, i_s0)
        locate_end(("P", n, "a"), *a)
        level, upright = abs(a[1] - b[1]) < EPS, abs(a[0] - b[0]) < EPS
        if level:
            sk.hor(n)
        elif upright:
            sk.ver(n)
        if sh.p.get("polar") or level or upright:
            # the far end by the bar's length, and its angle if it is neither level nor upright
            if not (level or upright):
                ref = angle_ref(n, idx)
                if ref is not None:
                    sk.dim_ang(n, ref[0], ref[1])
            sk.dim_len(n)
        locate_end(("P", n, "b"), *b)

    def plan_free(idx, sh):
        """Any outline of lines and arcs. Arcs about something that is already there are tied to it; slanted lines that
        belong together are made parallel or square to each other and one of them gets an angle; level and upright
        lines are placed from the walls, from each other or from the origin. What is then still loose (the ends of a
        single slanted edge, say) gets its dimensions in the last step."""
        lines = [i for i in idx if sk.segs[i - 1]["t"] == "L"]
        arcs = [i for i in idx if sk.segs[i - 1]["t"] in ("A", "C")]
        slanted = []
        for i in lines:
            u, c = _line_uc(sk.segs[i - 1]["g"])
            if abs(u[0]) > 1e-9 and abs(u[1]) > 1e-9:
                slanted.append((i, u, c))
        # slanted lines: parallel or square to an earlier one; the first of a family, or a line through the origin, gets an angle
        fam = []                                                    # lines whose direction is settled
        on_edge = set()
        # of two lines square to each other, the one that makes the smaller angle with its reference carries the angle
        for k in range(len(slanted)):
            i, u, c = slanted[k]
            if any(abs(u[0] * v[1] - u[1] * v[0]) < 1e-9 or abs(u[0] * v[0] + u[1] * v[1]) < 1e-9 for (_, v, _) in slanted[:k]):
                continue
            if any(_nearest_parallel(pool, v, cv, exclude_zero=False, limit=1e-6) is not None for (_, v, cv) in slanted
                   if abs(u[0] * v[1] - u[1] * v[0]) < 1e-9 or abs(u[0] * v[0] + u[1] * v[1]) < 1e-9):
                continue                                            # one of the family lies on an edge of the part: that settles its direction
            ri = angle_ref(i, idx)
            for m in range(k + 1, len(slanted)):
                j, v, cj = slanted[m]
                if abs(u[0] * v[0] + u[1] * v[1]) < 1e-9:
                    rj = angle_ref(j, idx)
                    if ri is not None and rj is not None and rj[2] < ri[2]:
                        slanted[k], slanted[m] = slanted[m], slanted[k]
                    break
        for (i, u, c) in slanted:
            ref = _nearest_parallel(pool, u, c, exclude_zero=False, limit=1e-6)
            if ref is not None and sk.col_edge(i, ref, E(ref)):
                fam.append((i, u))
                on_edge.add(i)
        for k, (i, u, c) in enumerate(slanted):
            done = False
            if i in on_edge:
                continue
            for (j, v) in fam:
                if abs(u[0] * v[1] - u[1] * v[0]) < 1e-9:
                    done = sk.par(i, j, ("S", j))
                elif abs(u[0] * v[0] + u[1] * v[1]) < 1e-9:
                    done = sk.perp(i, j, ("S", j))
                if done:
                    break
            if not done:
                partner = any(abs(u[0] * v[1] - u[1] * v[0]) < 1e-9 or abs(u[0] * v[0] + u[1] * v[1]) < 1e-9 for (j, v, _) in slanted[k + 1:])
                through = abs(-u[1] * ox + u[0] * oy - c) < EPS
                if partner or through:
                    ref = angle_ref(i, idx)
                    if ref is not None:
                        done = sk.dim_ang(i, ref[0], ref[1])
            if done:
                fam.append((i, u))
        # arcs: about the origin, about something round already there, about an arc already placed; a half circle or
        # more is placed like a hole
        for i in arcs:
            g = sk.segs[i - 1]["g"]
            x, y = g[1], g[2]
            pc = ("P", i, "c")
            placed = False
            if abs(x - ox) < EPS and abs(y - oy) < EPS:
                placed = sk.coin_point_origin(pc)
            if not placed:
                same = [r for r in pool["circles"] if math.hypot(r["c"][0] - x, r["c"][1] - y) < 1e-6]
                if same:
                    rr = g[3] if g[0] == "C" else math.hypot(g[3] - x, g[4] - y)
                    same.sort(key=lambda r: (0 if any(n in shapes_by_name and on_shapes(r, shapes_by_name[n]) for n in prefer) else 1, abs(r["r"] - rr)))
                    placed = sk.conc(i, same[0]["c"], E(same[0]))
            if not placed:
                for (j, cx, cy) in seen_circles:
                    if abs(cx - x) < EPS and abs(cy - y) < EPS and j != i:
                        placed = sk.conc_seg(i, j) if sk.segs[j - 1]["t"] in ("A", "C") else sk.coin_points(pc, ("P", j, "c"))
                        if placed:
                            break
            if not placed and (g[0] == "C" or seg_sweep(g) >= math.pi - 1e-6):
                locate_point(pc, x, y)
                placed = True
            if placed:
                seen_circles.append((i, x, y))
        for i in arcs:
            sk.dim_r(i)
        # lines: on an edge, through the origin, in line with or a distance from a line already placed, from the wall
        # next to them, from the datum
        mine = []
        for i in lines:
            g = sk.segs[i - 1]["g"]
            u, c = _line_uc(g)
            is_slanted = abs(u[0]) > 1e-9 and abs(u[1]) > 1e-9
            if is_slanted and not any(j == i for (j, _) in fam):
                continue                                            # a single slanted edge: its ends are dimensioned instead
            if i in on_edge:
                mine.append((i, u, c))
                continue
            done = False
            ref = _nearest_parallel(pool, u, c, exclude_zero=False, limit=1e-6)
            if ref is not None:
                done = sk.col(i, ref, E(ref))
            if not done and abs(-u[1] * ox + u[0] * oy - c) < EPS:
                done = sk.coin_origin_line(i)
            if not done:
                for (j, uj, cj) in seen_lines + mine:
                    if abs(uj[0] - u[0]) < 1e-9 and abs(uj[1] - u[1]) < 1e-9 and abs(cj - c) < EPS:
                        done = sk.col(i, j, ("S", j))
                        if done:
                            break
            if not done:
                span = None
                ts = [p[0] * u[0] + p[1] * u[1] for p in seg_ends(g)]
                span = (min(ts), max(ts))
                ref = _nearest_parallel(pool, u, c, limit=NEAR, span=span, prefer=prefer, shapes_by_name=shapes_by_name, only_preferred=True)
                if ref is not None:
                    done = sk.dim_line_ref(i, ref, E(ref))
            if not done:
                near = [(abs(cj - c), j) for (j, uj, cj) in mine if abs(uj[0] - u[0]) < 1e-9 and abs(uj[1] - u[1]) < 1e-9]
                for _, j in sorted(near):
                    done = sk.dim_line_line(i, j)
                    if done:
                        break
            if not done:
                dc = pref_circle()
                if dc is not None:
                    done = sk.dim_point_line(datum_point(dc), i)
            if not done:
                done = sk.dim_origin_line(i)
            mine.append((i, u, c))
        seen_lines.extend(mine)

    # 3. each outline in turn
    for si, sh in enumerate(shapes):
        idx = sk.shape_segs[si]
        if sh.kind == "circle":
            i = idx[0]
            x, y = sh.p["x"], sh.p["y"]
            placed = False
            if is_base and abs(x - ox) < EPS and abs(y - oy) < EPS:
                placed = sk.coin_point_origin(("P", i, "c"))
            if not placed:
                same = [r for r in pool["circles"] if math.hypot(r["c"][0] - x, r["c"][1] - y) < 1e-6]
                if same:
                    same.sort(key=lambda r: (0 if any(n in shapes_by_name and on_shapes(r, shapes_by_name[n]) for n in prefer) else 1, abs(r["r"] - sh.p["r"])))
                    placed = sk.conc(i, same[0]["c"], E(same[0]))
            if not placed:
                placed = mid_of_edge(("P", i, "c"), x, y)
            if not placed:
                locate_point(("P", i, "c"), x, y)
            sk.dim_r(i)
            seen_circles.append((i, x, y))
        elif sh.kind in ("rrect", "rect"):
            inset = True
            for nm in ("x0", "x1", "y0", "y1"):
                u, c = _line_uc(sk.segs[_side(sk, idx, sh, nm) - 1]["g"])
                if _nearest_parallel(pool, u, c, limit=NEAR, span=_span(sh, u)) is None:
                    inset = False
            locate_pair(idx, sh, "x0", "x1", "x", inset)
            locate_pair(idx, sh, "y0", "y1", "y", inset)
            for a in sh.ents.get("arcs", [])[:1]:
                sk.dim_r(idx[a])
            for nm in ("x0", "x1", "y0", "y1"):
                i = _side(sk, idx, sh, nm)
                u, c = _line_uc(sk.segs[i - 1]["g"])
                seen_lines.append((i, u, c))
        elif sh.kind == "obround":
            # across: the two straight sides (on the origin's centre line, in line with a slot already placed, or
            # from the datum), and the width between them; along: an end from the wall next to it, else as a point;
            # the other end from the first
            i_s0, i_s1 = idx[sh.ents["side0"]], idx[sh.ents["side1"]]
            i_a0, i_a1 = idx[sh.ents["arc0"]], idx[sh.ents["arc1"]]
            c0, c1 = sh.p["c0"], sh.p["c1"]
            pc0, pc1 = ("P", i_a0, "c"), ("P", i_a1, "c")
            horiz = sh.p["along"] == "x"
            same = sk.hpt if horiz else sk.vpt                          # the centres stay on their centre line
            across = (lambda p: p[1]) if horiz else (lambda p: p[0])
            along = (lambda p: p[0]) if horiz else (lambda p: p[1])
            o_across = oy if horiz else ox
            done = False
            if abs(across(c0) - o_across) < EPS:
                done = same(pc0, ("O",))
            for (j, cx, cy) in seen_circles:
                if not done and abs(across((cx, cy)) - across(c0)) < EPS:
                    done = same(pc0, ("P", j, "c"))
            if not done:
                dc = pref_circle()
                if dc is not None:
                    dp = datum_point(dc)
                    g0, g1 = sk.segs[i_s0 - 1]["g"], sk.segs[i_s1 - 1]["g"]
                    (u, k0), (_, k1) = _line_uc(g0), _line_uc(g1)
                    kd = -u[1] * dc["c"][0] + u[0] * dc["c"][1]
                    done = sk.dim_point_line(dp, i_s0 if abs(k0 - kd) <= abs(k1 - kd) else i_s1)
            if not done:
                locate_point(pc0, *c0, want_x=not horiz, want_y=horiz)
            sk.dim_line_line(i_s1, i_s0)
            # along
            placed = [False, False]
            for k, (pc, c) in enumerate(((pc0, c0), (pc1, c1))):
                for (j, cx, cy) in seen_circles:
                    if not placed[k] and abs(along((cx, cy)) - along(c)) < EPS:
                        placed[k] = (sk.vpt if horiz else sk.hpt)(pc, ("P", j, "c"))
            if not any(placed):
                u = (0.0, 1.0) if horiz else (1.0, 0.0)                # direction of a wall across the slot
                span = _span(sh, u)
                best = None
                for k, c in enumerate((c0, c1)):
                    off = -c[0] if horiz else c[1]
                    ref = _nearest_parallel(pool, u, off, limit=NEAR + sh.p["r"], span=span)
                    if ref is not None and (best is None or abs(ref["c"] - off) < best[0]):
                        best = (abs(ref["c"] - off), k, ref)
                if best is not None:
                    k = best[1]
                    placed[k] = sk.dim_point_ref((pc0, pc1)[k], best[2], E(best[2]))
                if not any(placed):
                    # no wall next to either end: one end is located the way any point is (locate_point). Take the end
                    # for which that reads best: on the origin line or in line with a hole already placed, else the
                    # one nearer to the wall it would be measured from (a designer dimensions the near end, 10 from
                    # the edge, not the far one, 16). End 0 unless end 1 is strictly better.
                    def reads(c):
                        a = along(c)
                        if abs(a - (ox if horiz else oy)) < EPS:
                            return 0.0
                        if any(abs(along((cx, cy)) - a) < EPS for (_, cx, cy) in seen_circles):
                            return 0.0
                        off = -c[0] if horiz else c[1]
                        ref = _nearest_parallel(pool, u, off, prefer=prefer or ((base_name,) if base_name else ()),
                                                shapes_by_name=shapes_by_name, only_preferred=round_base)
                        return abs(ref["c"] - off) if ref is not None else 1e9
                    k_near = 1 if reads(c1) < reads(c0) - 1e-9 else 0
                    locate_point((pc0, pc1)[k_near], *(c0, c1)[k_near], want_x=horiz, want_y=not horiz)
                    placed[k_near] = True
            for k in (0, 1):
                if not placed[k]:
                    other = (pc0, pc1)[1 - k]
                    (sk.dim_h if horiz else sk.dim_v)((pc0, pc1)[k], other)
            seen_circles += [(i_a0, *c0), (i_a1, *c1)]
        elif sh.kind == "tongue":
            i_arc = idx[sh.ents["arc"]]
            locate_point(("P", i_arc, "c"), sh.p["x"], sh.p["y"])
            sk.dim_r(i_arc)
            i_end = idx[sh.ents["end"]]
            u, c = _line_uc(sk.segs[i_end - 1]["g"])
            ref = _nearest_parallel(pool, u, c, limit=NEAR, span=_span(sh, u)) or _nearest_parallel(pool, u, c)
            if ref is not None:
                sk.dim_line_ref(i_end, ref, E(ref))
        elif sh.kind == "strip":
            plan_strip(idx, sh)
        elif fix_free:
            for i in idx:
                sk.fix(i)
        else:
            plan_free(idx, sh)

    # 4. whatever is still free: radii, then positions from the datum axis or the origin
    for i, s in enumerate(sk.segs, 1):
        if s["t"] in ("A", "C") and sk.free():
            sk.dim_r(i)
    if sk.free():
        dc = pref_circle()
        datum = datum_point(dc) if dc is not None else ("O",)
        dx, dy = sk.xy(datum)(sk.q)
        for i, s in enumerate(sk.segs, 1):
            for k in ("a", "b", "c"):
                if k in s and sk.free() and s["t"] != "PT":
                    pref = ("P", i, k)
                    x, y = sk.xy(pref)(sk.q)
                    if abs(x - dx) < EPS:
                        sk.vpt(pref, datum)
                    else:
                        sk.dim_h(pref, datum)
                    if abs(y - dy) < EPS:
                        sk.hpt(pref, datum)
                    else:
                        sk.dim_v(pref, datum)
    # a line made collinear with something has its direction from that: its own horizontal / vertical relation would be
    # one relation too many in SOLIDWORKS (redundant, though true)
    lined = {refs[0][1] for kind, refs in sk.rels if kind == "COL"}
    sk.rels = [(kind, refs) for kind, refs in sk.rels if not (kind in ("HOR", "VER") and refs[0][1] in lined)]
    return sk


def describe(sk):
    names = dict(MERGE="join", HOR="horizontal", VER="vertical", TAN="tangent", EQ="equal", CONC="concentric", COIN="coincident",
                 MID="at midpoint", HPT="level with", VPT="in line (vertical) with", COL="collinear", FIX="fixed", PAR="parallel", PERP="perpendicular")
    from collections import Counter
    c = Counter(k for k, _ in sk.rels)
    out = ["relations: " + ", ".join(f"{n} {names[k]}" for k, n in c.items())]

    def nm(r):
        if r[0] == "O":
            return "origin"
        if r[0] == "E":
            return "edge@(%.2f, %.2f, %.2f)" % r[1]
        if r[0] == "S":
            return f"{sk.segs[r[1] - 1]['t']}{r[1]}"
        return f"{sk.segs[r[1] - 1]['t']}{r[1]}.{r[2]}"
    for kind, refs, at, val in sk.dims:
        out.append(f"   {kind:<5} {val:8.3f}  " + " to ".join(nm(r) for r in refs))
    out.append(f"   degrees of freedom left: {sk.free()}  ({len(sk.q)} variables)")
    return "\n".join(out)
