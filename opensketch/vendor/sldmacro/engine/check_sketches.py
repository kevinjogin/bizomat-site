"""Checks every sketch of a job's macro with an independent constraint solver (SolveSpace, python_solvespace).

The macro's own planner (constrain.py) decides which relations and dimensions define each sketch. This script does not
use it: it reads the macro text itself. For each boss or cut it draws the outline as the macro does (Ln, Ar, Ci), adds
the macro's construction lines and points (Cn, Pt), the model edges it refers to (Ed, fixed where expected.json says
they are), then every relation (Rel) and dimension (Dm), each mapped to SolveSpace constraints. Then:

  - the solver must accept the sketch as drawn, with 0 degrees of freedom left;
  - pushed off by up to 0.2 mm at random (several times), it must come back to the sketch as drawn, so the dimensions
    have the values the drawing has and nothing can slide.

Signs and symbols are fixed segment by segment, so they are not checked here.

    <python with python_solvespace> check_sketches.py [macro] [expected.json]

With no arguments: the macro and expected.json of the job in the current folder (or SLDMACRO_JOB).
"""
import json
import math
import os
import random
import re
import sys

from python_solvespace import ResultFlag, SolverSystem

HERE = os.path.dirname(os.path.abspath(__file__))
TOL = 1e-5          # mm (the macro's numbers are rounded to 1e-6)


def subs_of(text):
    """{procedure name: [statement lines]} of the generated part of the macro, with chained pieces (name_1, ...) joined."""
    out, name, body = {}, None, []
    for line in text.splitlines():
        m = re.match(r"Private Sub (\w+)\(\)", line)
        if m:
            name, body = m.group(1), []
            continue
        if name and line.strip() == "End Sub":
            out[name] = body
            name = None
            continue
        if name:
            body.append(line.strip())
    joined = {}
    for n, b in out.items():
        if re.search(r"_\d+$", n) and n.rsplit("_", 1)[0] in out:
            continue
        lines, k = [], 0
        cur = b
        while True:
            nxt = f"{n}_{k + 1}"
            lines += [l for l in cur if l != nxt]
            if nxt in out and nxt in cur:
                cur, k = out[nxt], k + 1
            else:
                break
        joined[n] = lines
    return joined


def args_of(line):
    """The arguments of a call such as  Rel "sgTANGENT", "S1", "S2"  as numbers and strings."""
    rest = line.split(" ", 1)[1] if " " in line else ""
    out = []
    for a in re.findall(r'"[^"]*"|[^,\s][^,]*', rest):
        a = a.strip()
        out.append(a[1:-1] if a.startswith('"') else float(a))
    return out


class Check:
    def __init__(self, draw, define, eds):
        self.s = SolverSystem()
        self.wp = self.s.create_2d_base()
        self.nm = self.s.add_normal_3d(1.0, 0.0, 0.0, 0.0)          # the sketch plane's normal, for arcs and circles
        self.s.set_group(2)
        self.pt = {}            # ("A"|"B"|"C", k) -> point entity
        self.ent = {}           # k -> line / arc / circle entity, or a point for Pt
        self.kind = {}          # k -> L, A, C, N, P
        self.geo = {}           # k -> as drawn
        self.free = []          # (point entity, x, y) as drawn: what must come back
        self.eds = {}
        self.dist_sign = 1
        o = self.point(0.0, 0.0, False)                           # fixed where it is (not pushed about below)
        self.s.dragged(o, self.wp)
        self.origin = o
        for line in draw:
            self.draw(line)
        self.define_lines = define
        self.eds_truth = eds

    def point(self, x, y, keep=True):
        p = self.s.add_point_2d(x, y, self.wp)
        if keep:
            self.free.append((p, x, y))
        return p

    def draw(self, line):
        op, a = line.split(" ", 1)[0], args_of(line)
        k = int(a[0])
        if op in ("Ln", "Cn"):
            pa, pb = self.point(a[1], a[2]), self.point(a[3], a[4])
            self.pt[("A", k)], self.pt[("B", k)] = pa, pb
            self.ent[k] = self.s.add_line_2d(pa, pb, self.wp)
            self.kind[k] = "L" if op == "Ln" else "N"
            self.geo[k] = a[1:5]
        elif op == "Ar":
            c, pa, pb = self.point(a[1], a[2]), self.point(a[3], a[4]), self.point(a[5], a[6])
            self.pt[("C", k)], self.pt[("A", k)], self.pt[("B", k)] = c, pa, pb
            # SolveSpace arcs run counter-clockwise from their start to their end
            self.ent[k] = self.s.add_arc(self.nm, c, pa, pb, self.wp) if a[7] > 0 else self.s.add_arc(self.nm, c, pb, pa, self.wp)
            self.kind[k] = "A"
            self.geo[k] = a[1:8]
        elif op == "Ci":
            c = self.point(a[1], a[2])
            self.pt[("C", k)] = c
            self.ent[k] = self.s.add_circle(self.nm, c, self.s.add_distance(a[3], self.wp), self.wp)
            self.kind[k] = "C"
            self.geo[k] = a[1:4]
        elif op == "Pt":
            p = self.point(a[1], a[2])
            self.pt[("C", k)] = p
            self.ent[k] = p
            self.kind[k] = "P"
            self.geo[k] = a[1:3]
        else:
            raise ValueError(line)

    def edge(self, k, x, y, z):
        """A model edge, fixed where the part has it."""
        hit = [e for e in self.eds_truth if max(abs(e["p"][0] - x), abs(e["p"][1] - y), abs(e["p"][2] - z)) < 1e-5]
        assert hit, f"no geometry for model edge {k} at {x, y, z}"
        g = hit[0]["geo"]
        if g[0] == "L":
            a, b = self.point(g[1], g[2], False), self.point(g[3], g[4], False)
            self.s.dragged(a, self.wp)
            self.s.dragged(b, self.wp)
            self.eds[k] = ("L", self.s.add_line_2d(a, b, self.wp), (g[1], g[2], g[3], g[4]))
        else:
            c = self.point(g[1], g[2], False)
            self.s.dragged(c, self.wp)
            self.eds[k] = ("C", c, (g[1], g[2]))

    # ---- what a code names
    def thing(self, code):
        if code == "O":
            return ("P", self.origin, (0.0, 0.0))
        t, k = code[0], int(code[1:])
        if t == "E":
            return self.eds[k]
        if t == "S":
            kd = self.kind[k]
            if kd in ("L", "N"):
                return ("L", self.ent[k], tuple(self.geo[k][:4]))
            if kd == "P":
                return ("P", self.ent[k], tuple(self.geo[k]))
            return (kd, self.ent[k], self.geo[k])
        g = self.geo[k]
        if t == "C":
            return ("P", self.pt[("C", k)], (g[0], g[1]))
        if self.kind[k] in ("L", "N"):
            xy = (g[0], g[1]) if t == "A" else (g[2], g[3])
        else:
            xy = (g[2], g[3]) if t == "A" else (g[4], g[5])
        return ("P", self.pt[(t, k)], xy)

    def centre(self, th):
        """The centre point of a circle, an arc or a point."""
        if th[0] == "P":
            return th[1]
        if th[0] in ("A", "C") and isinstance(th[2], tuple) and len(th[2]) == 2:          # a model circle
            return th[1]
        return None

    def centre_of_seg(self, code):
        k = int(code[1:])
        return self.pt[("C", k)]

    def helper_line(self, p, q):
        return self.s.add_line_2d(p, q, self.wp)

    # ---- relations and dimensions
    def rel(self, kind, refs):
        s, wp = self.s, self.wp
        th = [self.thing(r) for r in refs]
        if kind == "sgMERGEPOINTS":
            s.coincident(th[0][1], th[1][1], wp)
        elif kind == "sgHORIZONTAL2D":
            s.horizontal(th[0][1], wp)
        elif kind == "sgVERTICAL2D":
            s.vertical(th[0][1], wp)
        elif kind == "sgTANGENT":
            self.tangent(refs[0], refs[1])
        elif kind == "sgSAMELENGTH":
            s.equal(th[0][1], th[1][1], wp)
        elif kind == "sgCONCENTRIC":
            ps = []
            for r, t in zip(refs, th):
                if r[0] == "S" and t[0] in ("A", "C"):
                    ps.append(self.centre_of_seg(r))
                else:
                    ps.append(t[1])
            s.coincident(ps[0], ps[1], wp)
        elif kind == "sgCOINCIDENT":
            pts = [t for t in th if t[0] == "P"]
            other = [t for t in th if t[0] != "P"]
            if len(pts) == 2:
                s.coincident(pts[0][1], pts[1][1], wp)
            else:
                s.coincident(pts[0][1], other[0][1], wp)
        elif kind == "sgATMIDDLE":
            p = [t for t in th if t[0] == "P"][0]
            ln = [t for t in th if t[0] == "L"][0]
            s.midpoint(p[1], ln[1], wp)
        elif kind in ("sgHORIZONTALPOINTS2D", "sgVERTPOINTS2D"):
            h = self.helper_line(th[0][1], th[1][1])
            (s.horizontal if kind == "sgHORIZONTALPOINTS2D" else s.vertical)(h, wp)
        elif kind == "sgCOLINEAR":
            k = int(refs[0][1:])
            s.coincident(self.pt[("A", k)], th[1][1], wp)
            s.coincident(self.pt[("B", k)], th[1][1], wp)
        elif kind == "sgPARALLEL":
            s.parallel(th[0][1], th[1][1], wp)
        elif kind == "sgPERPENDICULAR":
            s.perpendicular(th[0][1], th[1][1], wp)
        elif kind == "sgFIXED":
            k = int(refs[0][1:])
            for w in "ABC":
                if (w, k) in self.pt:
                    s.dragged(self.pt[(w, k)], wp)
        else:
            raise ValueError(kind)

    def tangent(self, ca, cb):
        """Tangent where the two segments meet: the line square to the arc's radius there (or the two radii in line)."""
        ka, kb = int(ca[1:]), int(cb[1:])
        ends = {}
        for k in (ka, kb):
            g = self.geo[k]
            ends[k] = [("A", (g[0], g[1])), ("B", (g[2], g[3]))] if self.kind[k] in ("L", "N") else [("A", (g[2], g[3])), ("B", (g[4], g[5]))]
        joint = None
        for wa, pa in ends[ka]:
            for wb, pb in ends[kb]:
                if math.dist(pa, pb) < 1e-6:
                    joint = (wa, wb)
        assert joint, f"tangent between {ca} and {cb}, which do not meet"
        radii = []
        for k, w in ((ka, joint[0]), (kb, joint[1])):
            if self.kind[k] == "A":
                radii.append(self.helper_line(self.pt[("C", k)], self.pt[(w, k)]))
        lines = [self.ent[k] for k in (ka, kb) if self.kind[k] in ("L", "N")]
        if len(radii) == 2:
            self.s.parallel(radii[0], radii[1], self.wp)
        else:
            self.s.perpendicular(lines[0], radii[0], self.wp)

    def dim(self, how, a, b, value):
        s, wp = self.s, self.wp
        if how in (3, 4):
            t = self.thing(a)
            s.diameter(t[1], 2 * value if how == 3 else value)
            return
        if not b:                                       # one line: its length
            k = int(a[1:])
            s.distance(self.pt[("A", k)], self.pt[("B", k)], value, wp)
            return
        ta, tb = self.thing(a), self.thing(b)
        if how == 5:
            # the angle between two lines: SolveSpace measures it between their directions as drawn, so give it that one
            (ax, ay, bx, by), (cx, cy, dx, dy) = ta[2], tb[2]
            ang = math.degrees(math.atan2((bx - ax) * (dy - cy) - (by - ay) * (dx - cx), (bx - ax) * (dx - cx) + (by - ay) * (dy - cy)))
            want = abs(ang)
            assert min(abs(want - value), abs(180.0 - want - value)) < 1e-3, f"angle dimension {value} on lines {want:.4f} deg apart"
            s.angle(ta[1], tb[1], want, wp)
            return
        if how in (1, 2):
            # a horizontal (vertical) distance: a helper point level with the one and in line with the other
            (x1, y1), (x2, y2) = ta[2][:2], tb[2][:2]
            h = self.point(x2, y1) if how == 1 else self.point(x1, y2)
            l1, l2 = self.helper_line(ta[1], h), self.helper_line(h, tb[1])
            if how == 1:
                s.horizontal(l1, wp)
                s.vertical(l2, wp)
            else:
                s.vertical(l1, wp)
                s.horizontal(l2, wp)
            s.distance(ta[1], h, value, wp)
            return
        # how 0: a point or a line to a line
        if ta[0] == "L" and tb[0] == "L":
            k = int(a[1:])
            p, pxy, ln, lg = self.pt[("A", k)], ta[2][:2], tb[1], tb[2]
        elif ta[0] == "P":
            p, pxy, ln, lg = ta[1], ta[2], tb[1], tb[2]
        else:
            p, pxy, ln, lg = tb[1], tb[2], ta[1], ta[2]
        (ax, ay, bx, by) = lg
        cross = (bx - ax) * (pxy[1] - ay) - (by - ay) * (pxy[0] - ax)
        s.distance(p, ln, -math.copysign(value, cross) * self.dist_sign, wp)

    def define(self):
        for line in self.define_lines:
            op, a = line.split(" ", 1)[0], args_of(line)
            if op in ("Cn", "Pt"):
                self.draw(line)
            elif op == "Ed":
                self.edge(int(a[0]), a[1], a[2], a[3])
            elif op == "Rel":
                self.rel(a[0], [r for r in a[1:] if r])
            elif op == "Dm":
                self.dim(int(a[0]), a[1], a[2], a[5])
            elif op == "FixAll":
                for p, _, _ in self.free:
                    self.s.dragged(p, self.wp)
            else:
                raise ValueError(line)

    def off_by(self):
        return max(math.dist(self.s.params(p.params), (x, y)) for p, x, y in self.free)


def check(draw, define, eds, tries=12):
    if any(l.startswith("FixAll") for l in define):
        return ""                                   # a traced outline, fixed segment by segment like a sign
    c = Check(draw, define, eds)
    c.define()
    r = c.s.solve()
    if r != ResultFlag.OKAY:
        return f"the solver cannot meet it (result {r}, failing {c.s.failures()})"
    dof = c.s.dof()
    moved = c.off_by()
    if moved > TOL:
        return f"solving it moves it by {moved:.6f} mm"
    rnd = random.Random(7)
    worst = 0.0
    for _ in range(tries):
        for p, x, y in c.free:
            c.s.set_params(p.params, (x + rnd.uniform(-0.2, 0.2), y + rnd.uniform(-0.2, 0.2)))
        r = c.s.solve()
        worst = max(worst, c.off_by() if r == ResultFlag.OKAY else 1e9)
    if dof != 0:
        return f"{dof} degree(s) of freedom left"
    if worst > 1e-4:
        return f"pushed off, it does not come back (off by {worst:.4f} mm)"
    return ""


def main():
    if len(sys.argv) > 2:
        macro, truth = sys.argv[1], sys.argv[2]
    else:
        sys.path.insert(0, HERE)
        from jobcfg import job
        macro, truth = (sys.argv[1] if len(sys.argv) > 1 else job().macro), job().truth
    subs = subs_of(open(macro).read())
    d = json.load(open(truth))
    bad = n = 0
    for p in d["parts"]:
        for st in p["steps"]:
            if st["kind"] != "ex":
                continue
            draw = subs[f"P{p['no']}_S{st['no']}"]
            define = subs.get(f"P{p['no']}_D{st['no']}", [])
            n += 1
            why = check(draw, define, st["eds"])
            if why:
                bad += 1
            print(f"{'FAIL' if why else 'ok  '}  {p['title']}: {st['name']}" + (f": {why}" if why else ""))
    print(f"{n} sketches, {bad} not exactly defined")
    print("SKETCHES: " + ("ALL PASS" if not bad else f"{bad} FAILED"))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
