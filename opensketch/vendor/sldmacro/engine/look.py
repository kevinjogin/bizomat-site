"""Looks at a solid the way you would before modelling it: what it is made of, which way its features run, the
heights of its flat faces, and its outline at any height, in numbers you can copy into a recipe.

    python look.py <file.step>                      what is in the file; the best feature direction; faces; levels
    python look.py <file.step> --pick 2             one solid of several (position, or the start of its label)
    python look.py <file.step> --z 0,1,0            look along this direction of the file instead (it becomes +Z)
    python look.py <file.step> --x 1,0,0            ... with this direction as +X
    python look.py <file.step> --origin 12.5,-7.25,30   ... and this point (read from the listing with --z / --x) as the origin
    python look.py <file.step> --at 0.5,2.0,7.9     the outlines at these heights (after --z), every segment listed
    python look.py <file.step> --edges              sharp and rounded edges by kind and size (chamfers, radii, drafts)
    python look.py <file.step> --png out.png        a picture: the outline at each level, and three views

Everything is in mm and degrees, in the frame the recipe would use (after --z / --x / --origin): the same three
values go into source.oriented(step(...), z=..., x=..., origin=...) in the recipe. Paths are relative to the current
folder.
"""
import math
import sys


def _vec(text):
    v = [float(x) for x in text.split(",")]
    assert len(v) == 3, "a direction is three numbers: 0,0,1"
    return tuple(v)


def r3(v):
    return round(float(v) + 0.0, 3) + 0.0


def exact(v):
    """A number with enough digits to copy into --z / --x / --origin (and so into the recipe) without losing anything."""
    s = f"{float(v):.10f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def exact3(v):
    return ",".join(exact(c) for c in v)


def face_kinds(solid):
    """One dict per face: kind, area, and what that kind needs to be understood."""
    from build123d import GeomType
    from OCP.BRepAdaptor import BRepAdaptor_Surface
    out = []
    for f in solid.faces():
        d = dict(face=f, area=f.area, kind="other")
        b = f.bounding_box()
        d["z"] = (b.min.Z, b.max.Z)
        d["box"] = (b.min.X, b.min.Y, b.min.Z, b.max.X, b.max.Y, b.max.Z)
        gt = f.geom_type
        try:
            if gt == GeomType.PLANE:
                n = f.normal_at(f.center())
                d.update(kind="plane", n=(n.X, n.Y, n.Z))
            elif gt == GeomType.CYLINDER:
                cy = BRepAdaptor_Surface(f.wrapped).Cylinder()
                ax = cy.Axis()
                d.update(kind="cylinder", r=cy.Radius(), dir=(ax.Direction().X(), ax.Direction().Y(), ax.Direction().Z()),
                         at=(ax.Location().X(), ax.Location().Y(), ax.Location().Z()))
            elif gt == GeomType.CONE:
                co = BRepAdaptor_Surface(f.wrapped).Cone()
                ax = co.Axis()
                d.update(kind="cone", half=math.degrees(co.SemiAngle()), dir=(ax.Direction().X(), ax.Direction().Y(), ax.Direction().Z()),
                         at=(ax.Location().X(), ax.Location().Y(), ax.Location().Z()))
            elif gt == GeomType.TORUS:
                to = BRepAdaptor_Surface(f.wrapped).Torus()
                ax = to.Axis()
                d.update(kind="torus", r=to.MinorRadius(), R=to.MajorRadius(), dir=(ax.Direction().X(), ax.Direction().Y(), ax.Direction().Z()))
            elif gt == GeomType.SPHERE:
                d.update(kind="sphere", r=BRepAdaptor_Surface(f.wrapped).Sphere().Radius())
            else:
                d["kind"] = str(gt).split(".")[-1].lower()
        except Exception as e:                                   # a face OpenCascade cannot classify: say so, carry on
            d["kind"] = "other"
            d["why"] = str(e)
        out.append(d)
    return out


def fits(d, axis, tol=1e-6):
    """How a face fits features that run along `axis`: 'cap' (flat, square to it), 'wall' (straight along it),
    'taper' (a cone about it or a flat face at an angle: draft, countersink, chamfer), 'round' (a fillet), or None."""
    ax = axis
    dot = lambda a, b: a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    if d["kind"] == "plane":
        c = abs(dot(d["n"], ax))
        if c > 1 - tol:
            return "cap"
        if c < tol:
            return "wall"
        lean = 90.0 - math.degrees(math.acos(min(1.0, c)))     # how far the face leans from the axis, degrees
        if lean <= 15.0 + 1e-6 or abs(lean - 45.0) < 0.5:       # a draft, or a 45 deg chamfer
            return "taper"
        return None
    if d["kind"] == "cylinder":
        c = abs(dot(d["dir"], ax))
        if c > 1 - tol:
            return "wall"
        if c < tol:
            return "round"                 # a rounded edge lying across the axis (or a hole across it: see the report)
        return None
    if d["kind"] == "cone":
        return "taper" if abs(dot(d["dir"], ax)) > 1 - tol else None
    if d["kind"] in ("torus", "sphere"):
        return "round"
    return None


def candidate_axes(faces):
    seen = []
    for d in faces:
        v = d.get("n") if d["kind"] == "plane" else d.get("dir")
        if not v:
            continue
        v = tuple(v)
        if not any(abs(abs(sum(a * b for a, b in zip(v, s))) - 1) < 1e-6 for s in seen):
            seen.append(v)
    for v in ((0, 0, 1), (0, 1, 0), (1, 0, 0)):
        if not any(abs(abs(sum(a * b for a, b in zip(v, s))) - 1) < 1e-6 for s in seen):
            seen.append(v)
    return seen


def rank_axes(faces):
    total = sum(d["area"] for d in faces) or 1.0
    rows = []
    for ax in candidate_axes(faces):
        kinds = {}
        odd = []
        for d in faces:
            k = fits(d, ax)
            kinds[k] = kinds.get(k, 0.0) + d["area"]
            if k is None:
                odd.append(d)
        # cylinders across the axis that are holes or bosses, not rounded edges, do not fit either: a rounded edge is
        # a small fraction of a turn; count a cylinder across the axis as odd if it goes more than half way round
        for d in faces:
            if d["kind"] == "cylinder" and fits(d, ax) == "round":
                try:
                    turn = d["area"] / (2 * math.pi * d["r"] * max(1e-9, _len_along(d)))
                except Exception:
                    turn = 0
                if turn > 0.51:
                    odd.append(d)
                    kinds["round"] -= d["area"]
                    kinds[None] = kinds.get(None, 0.0) + d["area"]
        ok = (total - kinds.get(None, 0.0)) / total
        rows.append(dict(axis=ax, ok=ok, caps=kinds.get("cap", 0.0), walls=kinds.get("wall", 0.0), taper=kinds.get("taper", 0.0),
                         rounds=kinds.get("round", 0.0), odd=odd))
    rows.sort(key=lambda r: (-round(r["ok"], 4), -(r["caps"] + r["walls"]), -r["caps"]))
    return rows


def _len_along(d):
    """Length of a cylinder face along its own axis."""
    b = d["box"]
    ax = d["dir"]
    ext = [(b[3] - b[0]), (b[4] - b[1]), (b[5] - b[2])]
    return abs(ext[0] * ax[0]) + abs(ext[1] * ax[1]) + abs(ext[2] * ax[2])


def describe_segs(segs):
    out = []
    for g in segs:
        if g[0] == "C":
            out.append(f"      circle  centre ({r3(g[1])}, {r3(g[2])})  r {r3(g[3])}  (dia {r3(2 * g[3])})")
        elif g[0] == "L":
            L = math.hypot(g[3] - g[1], g[4] - g[2])
            ang = math.degrees(math.atan2(g[4] - g[2], g[3] - g[1]))
            out.append(f"      line    ({r3(g[1])}, {r3(g[2])}) -> ({r3(g[3])}, {r3(g[4])})  length {r3(L)}  at {r3(ang)} deg")
        else:
            r = math.hypot(g[3] - g[1], g[4] - g[2])
            out.append(f"      arc     centre ({r3(g[1])}, {r3(g[2])})  r {r3(r)}  ({r3(g[3])}, {r3(g[4])}) -> ({r3(g[5])}, {r3(g[6])})  {'ccw' if g[7] else 'cw'}")
    return out


def guess_shape(segs):
    """Says what a loop looks like, so the recipe can use the matching outline (and get a designer's dimensions)."""
    kinds = "".join(g[0] for g in segs)
    if kinds == "C":
        g = segs[0]
        return f"circle({r3(g[1])}, {r3(g[2])}, {r3(g[3])})"
    # the box of the loop: end points, and for every arc the points where it reaches furthest (an obround's half
    # circles go well beyond their end points)
    xs, ys = [], []
    for g in segs:
        if g[0] == "L":
            xs += [g[1], g[3]]
            ys += [g[2], g[4]]
        else:
            _, cx, cy, x0, y0, x1, y1, ccw = g
            xs += [x0, x1]
            ys += [y0, y1]
            r = math.hypot(x0 - cx, y0 - cy)
            a0, a1 = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx)
            sweep = (a1 - a0) % (2 * math.pi) if ccw else (a0 - a1) % (2 * math.pi)
            for q in range(4):
                a = q * math.pi / 2
                rel = (a - a0) % (2 * math.pi) if ccw else (a0 - a) % (2 * math.pi)
                if rel <= sweep + 1e-9:
                    xs.append(cx + r * math.cos(a))
                    ys.append(cy + r * math.sin(a))
    box = (r3(min(xs)), r3(min(ys)), r3(max(xs)), r3(max(ys)))
    level = all(abs(g[1] - g[3]) < 1e-6 or abs(g[2] - g[4]) < 1e-6 for g in segs if g[0] == "L")
    if kinds == "LLLL" and level:
        return "rect(%s, %s, %s, %s)" % box
    if sorted(kinds) == sorted("LALALALA") and level:
        rs = {r3(math.hypot(g[3] - g[1], g[4] - g[2])) for g in segs if g[0] == "A"}
        if len(rs) == 1:
            return "rrect(%s, %s, %s, %s, %s)" % (*box, rs.pop())
    if sorted(kinds) == sorted("LALA") and level:
        return "obround(%s, %s, %s, %s)" % box
    if kinds.count("L") == 4 and "A" not in kinds:
        return "strip(a, b, w)  (a bar at an angle: its centre line and width are in the listing)  or polygon([...])"
    if sorted(kinds) == sorted("LLLA") and level:
        return "tongue(xc, yc, r, x_end)  (a round end on a strip)"
    return f"free([...])  ({kinds.count('L')} lines, {kinds.count('A')} arcs; box x {box[0]}..{box[2]}, y {box[1]}..{box[3]})"


def report(solid, at=(), edges=False, png=None, out=print, axes=None):
    from build123d import CenterOf
    faces = face_kinds(solid)
    b = solid.bounding_box()
    c = solid.center(CenterOf.MASS)
    out(f"solid: volume {solid.volume:.3f} mm3, {len(faces)} faces, {len(solid.edges())} edges")
    out(f"box:   x {r3(b.min.X)} .. {r3(b.max.X)}   y {r3(b.min.Y)} .. {r3(b.max.Y)}   z {r3(b.min.Z)} .. {r3(b.max.Z)}"
        f"   (size {r3(b.max.X - b.min.X)} x {r3(b.max.Y - b.min.Y)} x {r3(b.max.Z - b.min.Z)})")
    out(f"centre of mass: ({r3(c.X)}, {r3(c.Y)}, {r3(c.Z)})   centre of the box: ({r3((b.min.X + b.max.X) / 2)}, {r3((b.min.Y + b.max.Y) / 2)}, {r3((b.min.Z + b.max.Z) / 2)})")

    out("\nwhich way the features run (a recipe needs every feature along Z, every sketch on a plane Z = const):")
    rows = rank_axes(faces)
    for r in rows[:6]:
        ax = r["axis"]
        tag = "this frame's Z" if abs(abs(ax[2]) - 1) < 1e-6 else f"--z {exact3(ax)}"
        out(f"   along ({r3(ax[0])}, {r3(ax[1])}, {r3(ax[2])})  [{tag}]: {100 * r['ok']:.1f}% of the surface fits "
            f"(flat ends {r['caps']:.0f} mm2, straight walls {r['walls']:.0f}, sloped {r['taper']:.0f}, rounded {r['rounds']:.0f}); "
            f"{len(r['odd'])} face(s) do not fit")
    zrow = [r for r in rows if abs(abs(r["axis"][2]) - 1) < 1e-6][0]
    best = rows[0]
    if best["ok"] > zrow["ok"] + 1e-9:
        ax = best["axis"]
        out(f"   -> this frame's Z is not the best direction: look again with --z {exact3(ax)} "
            f"(or its opposite, to choose which flat face is the Front plane). Copy the direction with all its digits.")
    if zrow["odd"]:
        out(f"\n   {len(zrow['odd'])} face(s) do not fit features along this frame's Z (a hole or boss across it, a swept or free-form face):")
        for d in sorted(zrow["odd"], key=lambda d: -d["area"])[:12]:
            extra = f" r {r3(d['r'])} axis ({r3(d['dir'][0])}, {r3(d['dir'][1])}, {r3(d['dir'][2])})" if d["kind"] == "cylinder" else ""
            out(f"      {d['kind']}{extra}, {d['area']:.2f} mm2, x {r3(d['box'][0])}..{r3(d['box'][3])} y {r3(d['box'][1])}..{r3(d['box'][4])} z {r3(d['box'][2])}..{r3(d['box'][5])}")
        out("   The macro engine cannot make those as they are. Try another direction (--z), or report them as left out.")

    Z = (0.0, 0.0, 1.0)
    out("\nflat faces square to Z (the levels; a boss or cut starts and ends on these):")
    levels = {}
    for d in faces:
        if d["kind"] == "plane" and fits(d, Z) == "cap":
            z = r3(d["z"][0])
            e = levels.setdefault(z, dict(up=0.0, down=0.0, n=0))
            e["up" if d["n"][2] > 0 else "down"] += d["area"]
            e["n"] += 1
    for z in sorted(levels):
        e = levels[z]
        out(f"   Z {z:>9}: {e['n']} face(s), facing +Z {e['up']:.1f} mm2, facing -Z {e['down']:.1f} mm2")

    frame_hints(solid, faces, out, axes)

    out("\nstraight walls along Z: round ones (holes and bosses), by axis and radius:")
    cyl = {}
    for d in faces:
        if d["kind"] == "cylinder" and fits(d, Z) == "wall":
            k = (r3(d["at"][0]), r3(d["at"][1]), r3(d["r"]))
            e = cyl.setdefault(k, dict(z0=1e9, z1=-1e9, area=0.0, hole=None))
            e["z0"], e["z1"] = min(e["z0"], d["z"][0]), max(e["z1"], d["z"][1])
            e["area"] += d["area"]
            if e["hole"] is None:
                try:
                    # the outward normal of a hole's wall points at its axis
                    p = d["face"].center()
                    n = d["face"].normal_at(p)
                    e["hole"] = (n.X * (d["at"][0] - p.X) + n.Y * (d["at"][1] - p.Y)) > 0
                except Exception:
                    pass
    for (x, y, r), e in sorted(cyl.items(), key=lambda kv: (kv[0][2], kv[0][0], kv[0][1])):
        what = "hole / inside corner" if e["hole"] else ("boss / outside corner" if e["hole"] is False else "?")
        full = e["area"] / (2 * math.pi * r * max(1e-9, e["z1"] - e["z0"]))
        out(f"   axis ({x:>9}, {y:>9})  r {r:>7} (dia {r3(2 * r)})  Z {r3(e['z0'])} .. {r3(e['z1'])}  {what}, {min(1.0, full) * 100:.0f}% of a turn")

    slopes = [d for d in faces if fits(d, Z) == "taper"]
    if slopes:
        out("\nsloped faces (a draft, a countersink or lead-in cone, a chamfer):")
        seen = {}
        for d in slopes:
            if d["kind"] == "cone":
                k = ("cone", r3(d["half"]), r3(d["at"][0]), r3(d["at"][1]), r3(d["z"][0]), r3(d["z"][1]))
            else:
                ang = r3(90 - math.degrees(math.acos(min(1.0, abs(d["n"][2])))))          # angle of the face from Z
                k = ("flat", ang, None, None, r3(d["z"][0]), r3(d["z"][1]))
            seen.setdefault(k, [0, 0.0])
            seen[k][0] += 1
            seen[k][1] += d["area"]
        for k, (n, area) in sorted(seen.items(), key=lambda kv: str(kv[0])):
            if k[0] == "cone":
                out(f"   cone about ({k[2]}, {k[3]}), {k[1]} deg from Z, Z {k[4]} .. {k[5]}: {n} face(s), {area:.2f} mm2")
            else:
                out(f"   flat face(s) {k[1]} deg from Z, Z {k[4]} .. {k[5]}: {n} face(s), {area:.2f} mm2")
    rounds = [d for d in faces if fits(d, Z) == "round"]
    if rounds:
        out("\nrounded faces (radii that are features of their own, made after the extrudes):")
        seen = {}
        for d in rounds:
            k = (d["kind"], r3(d.get("r", 0)))
            seen.setdefault(k, [0, 0.0, 1e9, -1e9])
            seen[k][0] += 1
            seen[k][1] += d["area"]
            seen[k][2], seen[k][3] = min(seen[k][2], d["z"][0]), max(seen[k][3], d["z"][1])
        for (kind, r), (n, area, z0, z1) in sorted(seen.items(), key=lambda kv: kv[0][1]):
            out(f"   R{r} ({'round an edge that lies flat' if kind == 'cylinder' else 'round a curved edge' if kind == 'torus' else kind}): "
                f"{n} face(s), {area:.2f} mm2, Z {r3(z0)} .. {r3(z1)}")

    if edges:
        from core import edge_info
        from stages import is_concave
        out("\nedges, by kind (inside corners still sharp are where a radius would go):")
        cnt = {}
        for e in solid.edges():
            d = edge_info(e)
            cc = is_concave(solid, e)
            k = (d["kind"], "inside corner" if cc else ("outside corner" if cc is False else "smooth"), "flat" if d["flat"] else "upright / sloped")
            cnt.setdefault(k, [0, 0.0])
            cnt[k][0] += 1
            cnt[k][1] += d["len"]
        for k, (n, length) in sorted(cnt.items()):
            out(f"   {k[0]:<7} {k[1]:<15} {k[2]:<16} {n:>4} edge(s), {length:.1f} mm")

    zs = list(at)
    if not zs:
        lv = sorted(levels)
        zs = [round((a + b_) / 2, 4) for a, b_ in zip(lv, lv[1:]) if b_ - a > 1e-6]
        out("\noutlines half way between each pair of levels (give --at z1,z2 for other heights):")
    else:
        out("\noutlines:")
    from core import section_shapes
    for z in zs:
        try:
            shapes = section_shapes(solid, z)
        except ValueError as e:
            out(f"   Z {z}: {e}")
            continue
        out(f"   Z {z}: {len(shapes)} loop(s)")
        for i, sh in enumerate(shapes, 1):
            out(f"    loop {i}: looks like {guess_shape(sh.segs)}")
            for line in describe_segs(sh.segs):
                out(line)
    if png:
        picture(solid, sorted(levels), zs, png)
        out(f"\npicture written: {png}")


def frame_hints(solid, faces, out, axes=None):
    """Exact candidates for the recipe's frame, in file terms where that is what the options take: copy every digit."""
    Z = (0.0, 0.0, 1.0)
    caps = [d for d in faces if d["kind"] == "plane" and fits(d, Z) == "cap"]
    if not caps:
        return
    big = max(caps, key=lambda d: d["area"])
    lo = min(d["z"][0] for d in caps)
    out("\nfor the recipe's frame (exact values: copy every digit; a rounded origin shows up as 0.001 errors everywhere):")
    bb = big["face"].bounding_box()
    cx, cy = (bb.min.X + bb.max.X) / 2, (bb.min.Y + bb.max.Y) / 2
    up = big["n"][2] > 0
    out(f"   the largest flat face is at Z {exact(big['z'][0])}, facing {'+Z' if up else '-Z'}; the centre of its outline's box is ({exact(cx)}, {exact(cy)})")
    if up and abs(big["z"][0] - lo) > 1e-6:
        out("   it faces +Z with the rest of the part below it. To make it the Front plane with the part rising from it, look again "
            "with --z reversed (every sign changed); the values below are for the frame as it is now")
    out(f"   Front plane on the lowest face, origin at the centre of the largest face's outline:  --origin {exact(cx)},{exact(cy)},{exact(lo)}")
    # the part's axis: the line most of its round walls share (a bore with flats or a rim with a slot is not a full
    # turn, so count every round wall and every cone about Z, by area)
    shared = {}
    for d in faces:
        if (d["kind"] == "cylinder" and fits(d, Z) == "wall") or (d["kind"] == "cone" and fits(d, Z) == "taper"):
            k = (round(d["at"][0], 5), round(d["at"][1], 5))
            e = shared.setdefault(k, dict(area=0.0, r=0.0, at=d["at"]))
            e["area"] += d["area"]
            e["r"] = max(e["r"], d.get("r", 0.0))
    if shared:
        total = sum(e["area"] for e in shared.values())
        e = max(shared.values(), key=lambda e: e["area"])
        if e["area"] > 0.5 * total:
            out(f"   most of the round walls ({100 * e['area'] / total:.0f}% by area, the biggest r {exact(e['r'])}) share the axis at "
                f"({exact(e['at'][0])}, {exact(e['at'][1])}): for a part that turns about its axis,  --origin {exact(e['at'][0])},{exact(e['at'][1])},{exact(lo)}")
    dirs = {}
    try:
        for e in big["face"].outer_wire().edges():
            if e.geom_type.name == "LINE":
                p0, p1 = e @ 0, e @ 1
                dx, dy = p1.X - p0.X, p1.Y - p0.Y
                L = math.hypot(dx, dy)
                if L > 1e-6:
                    ux, uy = dx / L, dy / L
                    if ux < -1e-9 or (abs(ux) < 1e-9 and uy < 0):
                        ux, uy = -ux, -uy
                    k = (round(ux, 6), round(uy, 6))
                    dirs.setdefault(k, [0.0, (ux, uy)])
                    dirs[k][0] += L
    except Exception:
        pass
    if dirs:
        total, (ux, uy) = max(dirs.values(), key=lambda v: v[0])
        if abs(abs(ux) - 1) < 1e-9:
            out("   the long straight sides of that face already run along X")
        elif axes is not None:
            xv, yv, _ = axes
            f = (xv.X * ux + yv.X * uy, xv.Y * ux + yv.Y * uy, xv.Z * ux + yv.Z * uy)
            out(f"   the long straight sides of that face run along ({exact(ux)}, {exact(uy)}) here. To put them along X:  --x {exact3(f)}"
                f"   (the origin values above then change: look again)")


def picture(solid, levels, zs, path):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from compare import loops
    n = len(zs)
    cols = min(3, max(1, n))
    rows = (n + cols - 1) // cols + 1
    fig = plt.figure(figsize=(5.2 * cols, 4.6 * rows), dpi=110)
    b = solid.bounding_box()
    for i, z in enumerate(zs):
        ax = fig.add_subplot(rows, cols, i + 1)
        for outer, holes in loops(solid, z):
            xs, ys = zip(*(outer + outer[:1]))
            ax.fill(xs, ys, color="#c9d6e4", ec="#1b2a3a", lw=1.0)
            for h in holes:
                hx, hy = zip(*(h + h[:1]))
                ax.fill(hx, hy, color="white", ec="#1b2a3a", lw=1.0)
        ax.set_aspect("equal")
        ax.set_xlim(b.min.X - 1, b.max.X + 1)
        ax.set_ylim(b.min.Y - 1, b.max.Y + 1)
        ax.axhline(0, color="#b03030", lw=0.5)
        ax.axvline(0, color="#b03030", lw=0.5)
        ax.set_title(f"section at Z {z:g}", fontsize=10)
        ax.grid(True, lw=0.3, color="#cccccc")
        ax.tick_params(labelsize=7)
    # three outline views: every edge, sampled
    views = [("from +Z (X right, Y up)", lambda p: (p.X, p.Y)), ("from -Y (X right, Z up)", lambda p: (p.X, p.Z)), ("from +X (Y right, Z up)", lambda p: (p.Y, p.Z))]
    for j, (title, pick) in enumerate(views):
        if j >= cols:
            break
        ax = fig.add_subplot(rows, cols, (rows - 1) * cols + j + 1)
        for e in solid.edges():
            k = max(2, min(60, int(e.length / 0.3)))
            pts = [pick(e.position_at(t / k)) for t in range(k + 1)]
            ax.plot([p[0] for p in pts], [p[1] for p in pts], color="#1b2a3a", lw=0.6)
        ax.set_aspect("equal")
        ax.set_title(title + ": all edges", fontsize=10)
        ax.grid(True, lw=0.3, color="#cccccc")
        ax.tick_params(labelsize=7)
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def main(argv):
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__)
        return 0
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from source import frame_axes, oriented, solids_in
    path, args = argv[0], argv[1:]
    opt = dict(pick=None, z=None, x=None, origin=None, at=(), edges=False, png=None)
    i = 0
    while i < len(args):
        a = args[i]
        if a == "--edges":
            opt["edges"] = True
        elif a in ("--pick", "--z", "--x", "--origin", "--at", "--png"):
            i += 1
            v = args[i]
            if a == "--pick":
                opt["pick"] = int(v) if v.lstrip("-").isdigit() else v
            elif a in ("--z", "--x", "--origin"):
                opt[a[2:]] = _vec(v)
            elif a == "--at":
                opt["at"] = tuple(float(q) for q in v.split(","))
            else:
                opt["png"] = v
        else:
            raise SystemExit(f"unknown option {a}\n{__doc__}")
        i += 1
    os.environ.setdefault("SLDMACRO_JOB", os.getcwd())
    found = solids_in(os.path.abspath(path))
    print(f"{path}: {len(found)} solid(s)")
    for k, (label, s) in enumerate(found):
        bb = s.bounding_box()
        print(f"   {k}: {label or '(no label)'}: {s.volume:.3f} mm3, {len(s.faces())} faces, box {r3(bb.max.X - bb.min.X)} x {r3(bb.max.Y - bb.min.Y)} x {r3(bb.max.Z - bb.min.Z)}")
    if len(found) > 1 and opt["pick"] is None:
        print("several solids: say which with --pick <position or label>")
        return 0
    if opt["pick"] is None:
        solid = found[0][1]
    elif isinstance(opt["pick"], int):
        solid = found[opt["pick"]][1]
    else:
        hit = [s for n, s in found if n.lower().startswith(opt["pick"].lower())]
        assert len(hit) == 1, f"--pick {opt['pick']}: {len(hit)} solids match"
        solid = hit[0]
    if opt["z"] or opt["x"] or opt["origin"]:
        solid = oriented(solid, z=opt["z"] or (0, 0, 1), x=opt["x"], origin=opt["origin"] or (0, 0, 0))
        print(f"looking along {opt['z'] or (0, 0, 1)} (now +Z)" + (f", with {opt['x']} as +X" if opt["x"] else "") +
              (f", origin at {opt['origin']} of that frame" if opt["origin"] else ""))
        print(f"in the recipe: oriented(step(...), z={opt['z'] or (0, 0, 1)}, x={opt['x']}, origin={opt['origin'] or (0, 0, 0)})")
    print()
    report(solid, at=opt["at"], edges=opt["edges"], png=opt["png"], axes=frame_axes(opt["z"] or (0, 0, 1), opt["x"]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
