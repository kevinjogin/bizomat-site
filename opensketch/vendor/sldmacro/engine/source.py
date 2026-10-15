"""The source solid of a part: read from a STEP file (or built by the design's own code) and put into the frame the
recipe is written in.

    from source import step, oriented

    SRC = lambda: step("src/bracket.step")                                   # as the file has it
    SRC = lambda: oriented(step("src/knob.step"), z=(0, 1, 0), x=(1, 0, 0))  # the file's +Y becomes the recipe's +Z
    SRC = lambda: oriented(step("src/knob.step"), z=(0, 1, 0), x=(1, 0, 0), origin=(12.5, -7.25, 30.0))   # ... and that point the origin
    SRC = lambda: step("src/set.step", pick="Lid")                          # one solid of several, by label
    SRC = lambda: step("src/set.step", pick=2)                              # ... or by position (0 = the first)

Paths are relative to the job folder. Solids are read once and kept.
"""
import os

_seen = {}


def _solids(shape):
    return [s for s in shape.solids() if s.volume > 1e-9]


def step(path, pick=None):
    """The solid in a STEP file. A file with several solids needs pick: a label (as SOLIDWORKS or the exporter named
    the body; the start of it is enough) or a position."""
    from build123d import import_step
    from jobcfg import job_dir
    full = path if os.path.isabs(path) else os.path.join(job_dir(), path)
    key = (os.path.abspath(full), os.path.getmtime(full))
    if key not in _seen:
        _seen[key] = import_step(full)
    shape = _seen[key]
    named = []

    def walk(node, trail=""):
        label = getattr(node, "label", "") or ""
        kids = list(getattr(node, "children", []) or [])
        if kids:
            for k in kids:
                walk(k, label or trail)
        else:
            for s in _solids(node):
                named.append((label or trail, s))
    walk(shape)
    if not named:
        named = [("", s) for s in _solids(shape)]
    if not named:
        raise ValueError(f"{path}: no solid in the file (surfaces only?)")
    if pick is None:
        if len(named) != 1:
            names = ", ".join(f"{i}: {n or '(no label)'} {s.volume:.1f} mm3" for i, (n, s) in enumerate(named))
            raise ValueError(f"{path}: {len(named)} solids in the file; say which with pick=  ({names})")
        return named[0][1]
    if isinstance(pick, int):
        return named[pick][1]
    hit = [s for n, s in named if n.lower().startswith(str(pick).lower())]
    if len(hit) != 1:
        raise ValueError(f"{path}: pick={pick!r} matches {len(hit)} solids; labels: {[n for n, _ in named]}")
    return hit[0]


def solids_in(path):
    """[(label, solid)] of a STEP file, for looking at what it holds."""
    from build123d import import_step
    from jobcfg import job_dir
    full = path if os.path.isabs(path) else os.path.join(job_dir(), path)
    shape = import_step(full)
    out = []

    def walk(node, trail=""):
        label = getattr(node, "label", "") or ""
        kids = list(getattr(node, "children", []) or [])
        if kids:
            for k in kids:
                walk(k, label or trail)
        else:
            for s in _solids(node):
                out.append((label or trail, s))
    walk(shape)
    return out or [("", s) for s in _solids(shape)]


def oriented(solid, z=(0, 0, 1), x=None, origin=(0, 0, 0)):
    """The solid moved rigidly so that the direction z of the file becomes +Z and x becomes +X (any direction square
    to z if not given); then the point `origin`, GIVEN IN THAT TURNED FRAME, becomes (0, 0, 0). So: look at the solid
    with the z and x you want (look.py --z ... --x ...), read off where the recipe's origin should be, and pass those
    numbers as origin. Use it whenever the part's main flat face is not the plane Z = 0 of the file, its features run
    along another axis, or the first sketch would not be centred on the origin."""
    from build123d import Location, Plane
    xv, _, zv = frame_axes(z, x)
    turned = Plane(origin=(0, 0, 0), x_dir=xv, z_dir=zv).to_local_coords(solid)
    if any(abs(v) > 0 for v in origin):
        turned = turned.moved(Location((-origin[0], -origin[1], -origin[2])))
    return turned


def frame_axes(z=(0, 0, 1), x=None):
    """The unit vectors, in the file's frame, of the X, Y and Z axes of the frame oriented() turns the solid into."""
    from build123d import Vector
    zv = Vector(*z).normalized()
    if x is None:
        seed = Vector(1, 0, 0) if abs(zv.X) < 0.9 else Vector(0, 1, 0)
        xv = (seed - zv * seed.dot(zv)).normalized()
    else:
        xv = Vector(*x)
        xv = (xv - zv * xv.dot(zv)).normalized()
    return xv, zv.cross(xv), zv
