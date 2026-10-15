"""Parts as SOLIDWORKS-style feature lists: one source for the macro, for its expected measurements and for the
check against the source solid.

A recipe is written in a design frame: any frame in which the part's main flat face is a plane Z = const and every
feature runs along Z. A Frame says where the SOLIDWORKS part's origin is in that frame (and whether the part is
turned about Z or drawn turned over). A recipe written in the part's own coordinates uses PART_FRAME.

Order of the features of a part, as the user models:
    1. extrudes and cuts, straight (Ex)      the first one is the base: its sketch is centred on the origin
    2. drafts (Dr)                           neutral-plane drafts on the side faces of the extrudes named
    3. chamfers (Ch)
    4. radii (Fi), in several features
    5. signs and symbols (Mk), last
"""
import math
import os
import sys
from dataclasses import dataclass, field

HERE = os.path.dirname(os.path.abspath(__file__))
if HERE not in sys.path:
    sys.path.insert(0, HERE)

TOL = 1e-6


# ---------------------------------------------------------------------------------------------- outlines
# a segment is ("L", x0, y0, x1, y1), ("A", cx, cy, x0, y0, x1, y1, ccw) or ("C", cx, cy, r)

@dataclass
class Shape:
    """One closed outline of a sketch. ents names the segments a dimension or relation can refer to."""
    kind: str
    segs: list
    p: dict = field(default_factory=dict)
    ents: dict = field(default_factory=dict)
    hints: list = field(default_factory=list)
    name: str = ""

    def hint(self, *h):
        self.hints += list(h)
        return self

    def named(self, n):
        self.name = n
        return self


def circle(x, y, r):
    return Shape("circle", [("C", x, y, r)], dict(x=x, y=y, r=r), dict(c=0))


def rrect(x0, y0, x1, y1, r):
    """Rectangle with rounded corners, counter-clockwise from the y0 side. Sides are named by the coordinate they sit on."""
    if r <= 0:
        return rect(x0, y0, x1, y1)
    a, b, c, d = x0 + r, x1 - r, y0 + r, y1 - r
    segs = [("L", a, y0, b, y0), ("A", b, c, b, y0, x1, c, True), ("L", x1, c, x1, d), ("A", b, d, x1, d, b, y1, True),
            ("L", b, y1, a, y1), ("A", a, d, a, y1, x0, d, True), ("L", x0, d, x0, c), ("A", a, c, x0, c, a, y0, True)]
    return Shape("rrect", segs, dict(x0=x0, y0=y0, x1=x1, y1=y1, r=r), dict(y0=0, x1=2, y1=4, x0=6, arcs=[1, 3, 5, 7]))


def rect(x0, y0, x1, y1):
    segs = [("L", x0, y0, x1, y0), ("L", x1, y0, x1, y1), ("L", x1, y1, x0, y1), ("L", x0, y1, x0, y0)]
    return Shape("rect", segs, dict(x0=x0, y0=y0, x1=x1, y1=y1, r=0), dict(y0=0, x1=1, y1=2, x0=3, arcs=[]))


def obround(x0, y0, x1, y1):
    """A straight slot in the box x0..x1, y0..y1: two straight sides and a half circle at each end of the long way.
    arc0 is the end at the low coordinate, arc1 the one at the high coordinate."""
    if x1 - x0 >= y1 - y0:
        r, yc = (y1 - y0) / 2, (y0 + y1) / 2
        a, b = x0 + r, x1 - r
        segs = [("L", a, y0, b, y0), ("A", b, yc, b, y0, b, y1, True), ("L", b, y1, a, y1), ("A", a, yc, a, y1, a, y0, True)]
        c0, c1, along = (a, yc), (b, yc), "x"
    else:
        r, xc = (x1 - x0) / 2, (x0 + x1) / 2
        a, b = y0 + r, y1 - r
        segs = [("L", x1, a, x1, b), ("A", xc, b, x1, b, x0, b, True), ("L", x0, b, x0, a), ("A", xc, a, x0, a, x1, a, True)]
        c0, c1, along = (xc, a), (xc, b), "y"
    assert b - a > 1e-6, "an obround needs a straight part"
    return Shape("obround", segs, dict(x0=x0, y0=y0, x1=x1, y1=y1, r=r, c0=c0, c1=c1, along=along),
                 dict(side0=0, side1=2, arc1=1, arc0=3, arcs=[1, 3]))


def tongue(xc, yc, r, x_end):
    """A round boss that runs into a wall: a half circle about (xc, yc) on a strip of the same width ending at x_end."""
    s = 1 if x_end < xc else -1
    segs = [("L", x_end, yc - s * r, xc, yc - s * r), ("A", xc, yc, xc, yc - s * r, xc, yc + s * r, True),
            ("L", xc, yc + s * r, x_end, yc + s * r), ("L", x_end, yc + s * r, x_end, yc - s * r)]
    return Shape("tongue", segs, dict(x=xc, y=yc, r=r, x_end=x_end), dict(arc=1, end=3, side0=0, side1=2, arcs=[1]))


def strip(a, b, w, polar=False):
    """A straight bar of width w from point a to point b (a rectangle at any angle), drawn about its centre line.
    end0 is the end at a, end1 the end at b. polar: b is meant as a length and an angle from a, not as a position."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    p0, p1, p2, p3 = (a[0] - nx, a[1] - ny), (b[0] - nx, b[1] - ny), (b[0] + nx, b[1] + ny), (a[0] + nx, a[1] + ny)
    segs = [("L", *p0, *p1), ("L", *p1, *p2), ("L", *p2, *p3), ("L", *p3, *p0)]
    return Shape("strip", segs, dict(a=tuple(a), b=tuple(b), w=w, polar=polar), dict(side0=0, end1=1, side1=2, end0=3, arcs=[]))


def dee(x, y, r, half, along="y"):
    """A round with two flats (double D): a circle of radius r about (x, y) cut by two lines `half` either side of the
    centre, running along Y (flats at x +- half) or along X."""
    k = math.sqrt(r * r - half * half)
    if along == "y":
        pts = [(x + half, y - k), (x + half, y + k), (x - half, y + k), (x - half, y - k)]
    else:
        pts = [(x + k, y + half), (x - k, y + half), (x - k, y - half), (x + k, y - half)]
    segs = [("L", *pts[0], *pts[1]), ("A", x, y, *pts[1], *pts[2], True), ("L", *pts[2], *pts[3]), ("A", x, y, *pts[3], *pts[0], True)]
    sh = free(segs)
    sh.p = dict(x=x, y=y, r=r, half=half)
    return sh


def sector(x, y, r0, r1, a0, a1):
    """Part of a ring about (x, y): radii r0..r1, from angle a0 to a1 (degrees from +X, counter-clockwise)."""
    c0, s0, c1, s1 = (math.cos(math.radians(a0)), math.sin(math.radians(a0)), math.cos(math.radians(a1)), math.sin(math.radians(a1)))
    A, B, C, D = (x + r0 * c0, y + r0 * s0), (x + r1 * c0, y + r1 * s0), (x + r1 * c1, y + r1 * s1), (x + r0 * c1, y + r0 * s1)
    return free([("L", *A, *B), ("A", x, y, *B, *C, True), ("L", *C, *D), ("A", x, y, *D, *A, False)])


def free(segs, name=""):
    """Any closed outline of lines and arcs, in drawing order."""
    return Shape("free", [tuple(g) for g in segs], {}, {}, name=name)


def polygon(pts):
    n = len(pts)
    return free([("L", *pts[i], *pts[(i + 1) % n]) for i in range(n)])


def seg_ends(g):
    """(start, end) of a line or arc; a circle has none."""
    if g[0] == "L":
        return (g[1], g[2]), (g[3], g[4])
    if g[0] == "A":
        return (g[3], g[4]), (g[5], g[6])
    return None, None


def seg_len(g):
    if g[0] == "C":
        return 2 * math.pi * g[3]
    if g[0] == "L":
        return math.hypot(g[3] - g[1], g[4] - g[2])
    _, cx, cy, x0, y0, x1, y1, ccw = g
    r = math.hypot(x0 - cx, y0 - cy)
    a0, a1 = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx)
    return r * ((a1 - a0) % (2 * math.pi) if ccw else (a0 - a1) % (2 * math.pi))


def seg_mid(g):
    """A point in the middle of a segment (for a circle: the point at 37 degrees, clear of the usual seams)."""
    if g[0] == "L":
        return ((g[1] + g[3]) / 2, (g[2] + g[4]) / 2)
    if g[0] == "C":
        a = math.radians(37)
        return (g[1] + g[3] * math.cos(a), g[2] + g[3] * math.sin(a))
    _, cx, cy, x0, y0, x1, y1, ccw = g
    r = math.hypot(x0 - cx, y0 - cy)
    a0, a1 = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx)
    sweep = (a1 - a0) % (2 * math.pi) if ccw else -((a0 - a1) % (2 * math.pi))
    am = a0 + sweep / 2
    return (cx + r * math.cos(am), cy + r * math.sin(am))


def loops_from_wires(face_or_wires, tol=1e-7):
    """Outlines (lists of segments) of the wires of a planar face parallel to XY, or of a list of wires."""
    from build123d import GeomType
    wires = list(face_or_wires.wires()) if hasattr(face_or_wires, "wires") else list(face_or_wires)
    out = []
    for w in wires:
        edges = list(w.order_edges()) if hasattr(w, "order_edges") else list(w.edges())
        segs = []
        for e in edges:
            p0, p1, pm = e @ 0, e @ 1, e @ 0.5
            if e.geom_type == GeomType.LINE:
                segs.append(("L", p0.X, p0.Y, p1.X, p1.Y))
            elif e.geom_type == GeomType.CIRCLE:
                c = e.arc_center
                if (p0 - p1).length < tol:
                    segs.append(("C", c.X, c.Y, e.radius))
                else:
                    cross = (pm.X - p0.X) * (p1.Y - pm.Y) - (pm.Y - p0.Y) * (p1.X - pm.X)
                    segs.append(("A", c.X, c.Y, p0.X, p0.Y, p1.X, p1.Y, cross > 0))
            else:
                raise ValueError(f"an outline has a {e.geom_type} edge: only lines and arcs can be sketched")
        # order_edges may hand the edges back end to start: make the chain run start to end
        fixed = []
        for i, g in enumerate(segs):
            if g[0] == "C" or not fixed:
                fixed.append(g)
                continue
            _, prev_end = seg_ends(fixed[-1])
            a, b = seg_ends(g)
            if math.dist(prev_end, a) > 1e-6 and math.dist(prev_end, b) < 1e-6:
                g = ("L", g[3], g[4], g[1], g[2]) if g[0] == "L" else ("A", g[1], g[2], g[5], g[6], g[3], g[4], not g[7])
            fixed.append(g)
        if len(fixed) > 1 and fixed[0][0] != "C":          # the first one may be the one that is reversed
            a0, b0 = seg_ends(fixed[0])
            a1, _ = seg_ends(fixed[1])
            if math.dist(b0, a1) > 1e-6 and math.dist(a0, a1) < 1e-6:
                g = fixed[0]
                fixed[0] = ("L", g[3], g[4], g[1], g[2]) if g[0] == "L" else ("A", g[1], g[2], g[5], g[6], g[3], g[4], not g[7])
        out.append(fixed)
    return out


def section_shapes(solid, z):
    """The outlines of a solid cut by the plane Z = z, as free shapes (every loop, outer and inner alike)."""
    from build123d import Plane
    cut = solid.intersect(Plane.XY.offset(z))
    faces = cut.faces() if cut is not None else []
    out = []
    for f in faces:
        out += [free(l) for l in loops_from_wires(f)]
    return out


# ---------------------------------------------------------------------------------------------- features

@dataclass
class Ex:
    """Straight boss or cut from z0 to z1 (design Z). The sketch is on the part's Front plane."""
    name: str
    op: str                 # "add" or "cut"
    z0: float
    z1: float
    shapes: list
    note: str = ""
    refs: tuple = ()        # names of earlier features whose edges locating dimensions should prefer
    taper: float = 0.0      # degrees: a wall angle of the extrude's own (a countersink). The outline as sketched is the one at z0
    outward: bool = False   # the tapered outline grows with depth (True) or shrinks (False)
    fixed: bool = False     # a traced outline (a cam profile): its segments are fixed where they are, not dimensioned


@dataclass
class Dr:
    """Neutral-plane draft on the side faces of the extrudes named. wider = +1 if the profile gets wider toward +Z."""
    name: str
    of: tuple
    angle: float
    neutral: float          # design Z of the neutral plane
    wider: int
    note: str = ""


@dataclass
class Ch:
    """Chamfer, size x 45 deg, on the edges a selector picks from the part as it is at that point."""
    name: str
    size: float
    edges: object
    note: str = ""


@dataclass
class Fi:
    name: str
    r: float
    edges: object
    note: str = ""
    prune: bool = True      # leave out the edges the replay cannot round (when it can then round the rest)


@dataclass
class Mk:
    """A sign or symbol: a shallow cut with its own wall angle, made last."""
    name: str
    z0: float
    z1: float
    shapes: list
    draft: float = 0.0
    note: str = ""
    op: str = "cut"


@dataclass
class Frame:
    """Where the SOLIDWORKS part's origin is in the design frame. rot: the part's X axis is turned this many degrees
    from the design's (a part drawn square to its own flats). flip: Y reversed (a mirror-image part drawn turned over)."""
    cx: float
    cy: float
    z0: float
    flip: bool = False
    rot: float = 0.0

    def xy(self, x, y):
        dx, dy = x - self.cx, y - self.cy
        if self.rot:
            c, s = math.cos(math.radians(self.rot)), math.sin(math.radians(self.rot))
            dx, dy = dx * c + dy * s, -dx * s + dy * c
        return (dx, -dy if self.flip else dy)

    def z(self, z):
        return z - self.z0

    def pt(self, x, y, z):
        return (*self.xy(x, y), self.z(z))

    def seg(self, g):
        if g[0] == "L":
            return ("L", *self.xy(g[1], g[2]), *self.xy(g[3], g[4]))
        if g[0] == "C":
            return ("C", *self.xy(g[1], g[2]), g[3])
        return ("A", *self.xy(g[1], g[2]), *self.xy(g[3], g[4]), *self.xy(g[5], g[6]), (not g[7]) if self.flip else g[7])

    def shape(self, sh):
        """An outline given in the design frame, in this frame, of the same kind where it still is one (a rectangle
        turned by anything but a quarter turn becomes a free outline)."""
        quarter = abs((self.rot / 90.0) - round(self.rot / 90.0)) < 1e-9
        if sh.kind == "circle":
            out = circle(*self.xy(sh.p["x"], sh.p["y"]), sh.p["r"])
        elif sh.kind in ("rrect", "rect", "obround") and quarter:
            (ax, ay), (bx, by) = self.xy(sh.p["x0"], sh.p["y0"]), self.xy(sh.p["x1"], sh.p["y1"])
            box = (min(ax, bx), min(ay, by), max(ax, bx), max(ay, by))
            out = obround(*box) if sh.kind == "obround" else rrect(*box, sh.p["r"])
        elif sh.kind == "strip":
            out = strip(self.xy(*sh.p["a"]), self.xy(*sh.p["b"]), sh.p["w"], sh.p.get("polar", False))
        elif sh.kind == "tongue" and not self.rot:
            out = tongue(*self.xy(sh.p["x"], sh.p["y"]), sh.p["r"], self.xy(sh.p["x_end"], sh.p["y"])[0])
        else:
            out = free([self.seg(g) for g in sh.segs])
        out.name, out.hints = sh.name, list(sh.hints)
        return out

    def solid(self, shape):
        """A solid in the design frame, put into this frame."""
        from build123d import Axis, Location, Plane, mirror
        out = shape.moved(Location((-self.cx, -self.cy, -self.z0)))
        if self.rot:
            out = out.rotate(Axis.Z, -self.rot)
        return mirror(out, about=Plane.XZ) if self.flip else out


PART_FRAME = Frame(0.0, 0.0, 0.0)       # for a recipe written in the part's own coordinates


@dataclass
class Part:
    key: str
    title: str
    frame: Frame
    steps: list
    src: object = None          # () -> the source solid (from STEP or from the design code), in the recipe's frame
    src_bare: object = None     # () -> the same without its radii, if the design code can build it that way
    notes: list = field(default_factory=list)
    where: str = ""             # in words: where the part's origin and Front plane are

    def ordered(self):
        """The features in the order SOLIDWORKS gets them."""
        # chamfers and radii keep the order the recipe lists them in: chamfers first, except a chamfer that follows a
        # rounded edge, which has to come after that radius
        rank = {Ex: 0, Dr: 1, Ch: 2, Fi: 2, Mk: 4}
        return sorted(self.steps, key=lambda s: rank[type(s)])       # sorted() is stable: the given order holds inside a kind

    def step(self, name):
        return [s for s in self.steps if s.name == name][0]


# ---------------------------------------------------------------------------------------------- build123d replay

def face_of(segs, z):
    from build123d import Circle, Line, Pos, ThreePointArc, Wire, make_face
    if len(segs) == 1 and segs[0][0] == "C":
        _, x, y, r = segs[0]
        return Pos(x, y, z) * Circle(r)
    edges = []
    for s in segs:
        if s[0] == "L":
            edges.append(Line((s[1], s[2], z), (s[3], s[4], z)))
        else:
            mx, my = seg_mid(s)
            edges.append(ThreePointArc((s[3], s[4], z), (mx, my, z), (s[5], s[6], z)))
    return make_face(Wire(edges))


def prism(shapes, z0, z1, angle=0.0, neutral=None, wider=1):
    """The solid an extrude sweeps between z0 and z1. With an angle, drafted about the plane Z = neutral so that it
    is wider toward +Z (wider = 1) or toward -Z (wider = -1); the outline as sketched is the one at the neutral plane."""
    from build123d import extrude
    lo, hi = min(z0, z1), max(z0, z1)
    out = None
    for sh in shapes:
        if not angle:
            pieces = [extrude(face_of(sh.segs, lo), amount=hi - lo, dir=(0, 0, 1))]
        else:
            zn = lo if neutral is None else neutral
            assert lo - 1e-9 <= zn <= hi + 1e-9, f"neutral plane {zn} outside {lo}..{hi}"
            pieces = []
            if hi - zn > 1e-9:
                pieces.append(extrude(face_of(sh.segs, zn), amount=hi - zn, dir=(0, 0, 1), taper=-wider * angle))
            if zn - lo > 1e-9:
                pieces.append(extrude(face_of(sh.segs, zn), amount=zn - lo, dir=(0, 0, -1), taper=wider * angle))
        for p in pieces:
            out = p if out is None else out + p
    return out


def biggest(x):
    s = [q for q in x.solids() if q.volume > 1e-9]
    return max(s, key=lambda q: q.volume) if s else x


def taper_wider(st):
    """For an extrude with a wall angle of its own: +1 if its outline is wider toward +Z, -1 if toward -Z."""
    return 1 if (st.z1 > st.z0) == st.outward else -1


def apply_ex(body, st, draft=None):
    if getattr(st, "taper", 0.0):
        assert draft is None, f"'{st.name}' has a wall angle of its own and cannot take a draft feature as well"
        p = prism(st.shapes, st.z0, st.z1, st.taper, st.z0, taper_wider(st))
    else:
        p = prism(st.shapes, st.z0, st.z1, *((draft.angle, draft.neutral, draft.wider) if draft else ()))
    if body is None:
        return p
    return body + p if st.op == "add" else body - p


def body_extrudes(part, upto=None, drafts=()):
    """The part after its extrudes (the first `upto` of them), with the drafts given already applied."""
    by = {}
    for d in drafts:
        for n in d.of:
            by[n] = d
    body = None
    exs = [s for s in part.steps if isinstance(s, Ex)]
    for i, st in enumerate(exs):
        if upto is not None and i >= upto:
            break
        body = apply_ex(body, st, by.get(st.name))
    return body


def moment_z(s, z0=0.0):
    from build123d import CenterOf
    return sum(q.volume * (q.center(CenterOf.MASS).Z - z0) for q in s.solids() if q.volume > 1e-9)


def n_bodies(s):
    return len([q for q in s.solids() if q.volume > 1e-6])


def box_of(s):
    b = s.bounding_box()
    return [b.min.X, b.min.Y, b.min.Z, b.max.X, b.max.Y, b.max.Z]


# ---------------------------------------------------------------------------------------------- edges of a body

def edge_info(e):
    """What a planner or a selector needs to know about an edge: kind, where it is, and a point on it."""
    from build123d import GeomType
    p0, p1, pm = e @ 0, e @ 1, e @ 0.5
    d = dict(e=e, mid=(pm.X, pm.Y, pm.Z), p0=(p0.X, p0.Y, p0.Z), p1=(p1.X, p1.Y, p1.Z), len=e.length)
    if e.geom_type == GeomType.LINE:
        d["kind"] = "line"
    elif e.geom_type == GeomType.CIRCLE:
        c = e.arc_center
        d.update(kind="circle", c=(c.X, c.Y, c.Z), r=e.radius, full=(p0 - p1).length < 1e-7)
        if d["full"]:                                   # e @ 0.5 is fine on a full circle; keep the point off the seam
            q = e @ 0.37
            d["mid"] = (q.X, q.Y, q.Z)
    else:
        d["kind"] = "other"
    d["flat"] = abs(p0.Z - p1.Z) < 1e-7 and abs(pm.Z - p0.Z) < 1e-7        # lies in a plane Z = const
    d["z"] = pm.Z
    return d


def edges_of(body):
    return [edge_info(e) for e in body.edges()]


def flat_faces(body, z):
    from build123d import GeomType
    return [f for f in body.faces() if f.geom_type == GeomType.PLANE and abs(f.bounding_box().min.Z - z) < 1e-6 and abs(f.bounding_box().max.Z - z) < 1e-6]


# ---- selectors: body -> list of build123d edges. They are written against the part in the recipe's frame.

def face_loop_edges(z, which="all", inside=None):
    """Edges of the flat faces at Z = z: 'outer' loops, 'inner' loops or 'all'. inside = (x0, y0, x1, y1) keeps only
    the loops that lie in that window."""
    def sel(body):
        out = []
        for f in flat_faces(body, z):
            wires = [(f.outer_wire(), True)] + [(w, False) for w in f.inner_wires()]
            for w, is_outer in wires:
                if which == "outer" and not is_outer or which == "inner" and is_outer:
                    continue
                if inside is not None:
                    b = w.bounding_box()
                    if not (inside[0] - 1e-6 <= b.min.X and b.max.X <= inside[2] + 1e-6 and inside[1] - 1e-6 <= b.min.Y and b.max.Y <= inside[3] + 1e-6):
                        continue
                out += list(w.edges())
        return out
    return sel


def circle_edges(z, r, at=None):
    """Circular edges of radius r in the plane Z = z (about the points given, or anywhere)."""
    def sel(body):
        out = []
        for d in edges_of(body):
            if d["kind"] == "circle" and d["flat"] and abs(d["z"] - z) < 1e-6 and abs(d["r"] - r) < 1e-6:
                if at is None or any(math.hypot(d["c"][0] - x, d["c"][1] - y) < 1e-6 for x, y in at):
                    out.append(d["e"])
        return out
    return sel


def circles_about(z, pts, rmax=None):
    """Circular edges in the plane Z = z about any of the points given (whatever their radius, or up to rmax)."""
    def sel(body):
        out = []
        for d in edges_of(body):
            if d["kind"] == "circle" and d["flat"] and abs(d["z"] - z) < 1e-6 and (rmax is None or d["r"] <= rmax + 1e-9):
                if any(math.hypot(d["c"][0] - x, d["c"][1] - y) < 1e-6 for x, y in pts):
                    out.append(d["e"])
        return out
    return sel


def concave_at(z, inside=None):
    """Inside corners that lie in the plane Z = z (optionally only those with their middle in a window x0, y0, x1, y1)."""
    def sel(body):
        from stages import is_concave
        out = []
        for d in edges_of(body):
            if d["flat"] and abs(d["z"] - z) < 1e-6:
                if inside is not None and not (inside[0] <= d["mid"][0] <= inside[2] and inside[1] <= d["mid"][1] <= inside[3]):
                    continue
                if is_concave(body, d["e"]):
                    out.append(d["e"])
        return out
    return sel


def concave_where(test):
    """Inside corners for which test(info) is true."""
    def sel(body):
        from stages import is_concave
        return [d["e"] for d in edges_of(body) if test(d) and is_concave(body, d["e"])]
    return sel


def upright_concave(window=None, z=None):
    """Inside corners that run up the part (not lying in a plane Z = const), with their middle in the window
    (x0, y0, x1, y1) and between the heights z = (lo, hi), where given."""
    def test(d):
        if d["flat"]:
            return False
        if window is not None and not (window[0] <= d["mid"][0] <= window[2] and window[1] <= d["mid"][1] <= window[3]):
            return False
        return z is None or z[0] <= d["mid"][2] <= z[1]
    return concave_where(test)


def convex_at(z, inside=None):
    """Outside corners that lie in the plane Z = z (optionally only those with their middle in a window)."""
    def sel(body):
        from stages import is_concave
        out = []
        for d in edges_of(body):
            if d["flat"] and abs(d["z"] - z) < 1e-6:
                if inside is not None and not (inside[0] <= d["mid"][0] <= inside[2] and inside[1] <= d["mid"][1] <= inside[3]):
                    continue
                if is_concave(body, d["e"]) is False:
                    out.append(d["e"])
        return out
    return sel


def outline_edges(z, shapes, tol=1e-6):
    """Edges in the plane Z = z that lie on the outline of the shapes given (the edges a feature's sketch left there)."""
    def sel(body):
        from stages import dist_to_segs
        out = []
        for d in edges_of(body):
            if d["flat"] and abs(d["z"] - z) < 1e-6:
                if all(dist_to_segs(q[0], q[1], shapes) < tol for q in (d["mid"], d["p0"], d["p1"])):
                    out.append(d["e"])
        return out
    return sel


def edges_where(test):
    """Edges for which test(info) is true (info as edge_info gives it)."""
    def sel(body):
        return [d["e"] for d in edges_of(body) if test(d)]
    return sel


def both(*sels):
    def sel(body):
        out = []
        for s in sels:
            for e in s(body):
                if not any(e.is_same(o) for o in out):
                    out.append(e)
        return out
    return sel
