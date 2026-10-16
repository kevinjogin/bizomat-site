"""Export a part or an assembly as a SOLIDWORKS macro (.bas) that rebuilds it in SOLIDWORKS.

Parts are rebuilt as native features by the sldmacro engine (vendor/sldmacro): extrudes and cuts with fully
defined sketches, then chamfers and radii. A part the engine cannot make (a revolve, a shell, a feature off
the main direction, an imported or Toolbox body) is sent as a STEP file that the macro imports, so the
assembly is still complete and its mates still find their faces. The report says which parts and why.

For an assembly, OpenSketch adds its own VBA module (sldexport_vba.py) after the engine's code: it saves the
parts, inserts each component where OpenSketch's solver put it, and adds the mates one at a time, keeping a
mate only if SOLIDWORKS makes it without error and without moving any component.

    export(doc, out_zip, name=None, verify=True, log=print) -> report dict

Nothing here runs SOLIDWORKS. What is checked here: the engine's four checks of the part macro (sketch
solver, stand-in run, VBA grammar, file), and the VBA grammar and name scan of the final file.
"""

from __future__ import annotations

import io
import json
import math
import os
import re
import shutil
import subprocess
import tempfile
import time
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from . import assembly, geometry, sldexport_vba as vba

ENGINE = Path(__file__).parent / "vendor" / "sldmacro" / "engine"
SETUP = Path(__file__).parent / "vendor" / "sldmacro" / "scripts" / "setup_env.sh"
LOG_SUFFIX = "_log.txt"


class Unsupported(Exception):
    """A part the engine cannot rebuild as features: it goes in as a STEP import."""


# ----------------------------------------------------------------------------- toolchain

def _env_file() -> dict:
    out = {}
    p = Path.home() / ".sldmacro" / "env.sh"
    if p.exists():
        for line in p.read_text().splitlines():
            m = re.match(r'export (\w+)="([^"]*)"', line.strip())
            if m:
                out[m.group(1)] = m.group(2)
    return out


def toolchain() -> dict:
    """Which pieces of the engine's toolchain are here. ok: parts can be built as features (needs the CAD
    environment); checks lists the macro checks that can run."""
    env = _env_file()
    get = lambda k, d: os.environ.get(k) or env.get(k) or d
    cad = get("SLDMACRO_CAD_PY", str(Path.home() / ".venvs/sldmacro-cad/bin/python"))
    slvs = get("SLDMACRO_SLVS_PY", str(Path.home() / ".venvs/sldmacro-slvs/bin/python"))
    sys_py = get("SLDMACRO_SYS_PY", "/usr/bin/python3")
    have = {
        "cad": os.path.exists(cad),
        "sketches": os.path.exists(slvs),
        "standin": shutil.which("soffice") is not None and _has_uno(sys_py),
        "grammar": shutil.which("java") is not None and (Path.home() / ".cache" / "sldmacro-grammar").exists(),
    }
    return {"ok": have["cad"], "have": have, "cad_py": cad, "slvs_py": slvs, "sys_py": sys_py,
            "missing": [k for k, v in have.items() if not v]}


def _has_uno(py: str) -> bool:
    try:
        return subprocess.run([py, "-c", "import uno"], capture_output=True, timeout=20).returncode == 0
    except Exception:
        return False


def _run(tc: dict, args: list[str], cwd: str, timeout: int = 1800) -> tuple[int, str]:
    env = dict(os.environ)
    env.update(SLDMACRO_ENGINE=str(ENGINE), SLDMACRO_CAD_PY=tc["cad_py"], SLDMACRO_SLVS_PY=tc["slvs_py"],
               SLDMACRO_SYS_PY=tc["sys_py"], SLDMACRO_JOB=cwd)
    env.pop("PYTHONPATH", None)
    r = subprocess.run([tc["sys_py"], str(ENGINE / "sldmacro.py"), *args], cwd=cwd, env=env,
                       capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout + r.stderr


# ----------------------------------------------------------------------------- numbers and frames

def _n(v: float, nd: int = 6) -> float:
    v = round(float(v), nd)
    if abs(v - round(v)) < 1e-6:
        v = float(round(v))
    return 0.0 if v == 0 else v


def _vb(v: float) -> str:
    """A VBA Double literal."""
    v = float(v)
    if v == 0:
        return "0#"
    s = f"{v:.12g}".upper()
    if "E" not in s and "." not in s:
        s += "#"
    return s


def _q(s: str) -> str:
    s = "".join(c if 32 <= ord(c) < 127 else "?" for c in str(s))
    return '"' + s.replace('"', "'") + '"'


@dataclass
class Frame:
    """The SOLIDWORKS part frame inside the OpenSketch part: p_os = o + M.T @ p_sw (M rows = x, y, z)."""
    o: np.ndarray
    M: np.ndarray

    @classmethod
    def identity(cls):
        return cls(np.zeros(3), np.eye(3))

    @classmethod
    def of_plane(cls, pl):
        x = np.array(geometry.vlist(pl.x_dir), float)
        z = np.array(geometry.vlist(pl.z_dir), float)
        y = np.cross(z, x)
        return cls(np.array(geometry.vlist(pl.origin), float), np.array([x, y, z]))

    def to_sw(self, p):
        return self.M @ (np.asarray(p, float) - self.o)

    def dir_sw(self, d):
        return self.M @ np.asarray(d, float)

    def plane(self):
        from build123d import Plane
        return Plane(origin=tuple(self.o), x_dir=tuple(self.M[0]), z_dir=tuple(self.M[2]))

    def is_identity(self):
        return np.allclose(self.o, 0) and np.allclose(self.M, np.eye(3))


# ----------------------------------------------------------------------------- outlines

def _loops(face) -> list[tuple[list, bool]]:
    """(segments, is_outer) for each wire of a planar face lying in a plane Z = const of the frame."""
    from build123d import GeomType
    outer = face.outer_wire()
    out = []
    for w in face.wires():
        segs = []
        edges = list(w.order_edges()) if hasattr(w, "order_edges") else list(w.edges())
        for e in edges:
            p0, p1, pm = e @ 0, e @ 1, e @ 0.5
            if e.geom_type == GeomType.LINE:
                segs.append(["L", p0.X, p0.Y, p1.X, p1.Y])
            elif e.geom_type == GeomType.CIRCLE:
                c = e.arc_center
                if (p0 - p1).length < 1e-7:
                    segs.append(["C", c.X, c.Y, e.radius])
                else:
                    cross = (pm.X - p0.X) * (p1.Y - pm.Y) - (pm.Y - p0.Y) * (p1.X - pm.X)
                    segs.append(["A", c.X, c.Y, p0.X, p0.Y, p1.X, p1.Y, cross > 0])
            else:
                raise Unsupported(f"a sketch has a {e.geom_type.name.lower()} edge (only lines and arcs can be rebuilt)")
        # chain them start to end
        fixed = []
        for g in segs:
            if g[0] == "C" or not fixed:
                fixed.append(g)
                continue
            pe = _end(fixed[-1])
            a, b = _start(g), _end(g)
            if math.dist(pe, a) > 1e-6 and math.dist(pe, b) < 1e-6:
                g = _rev(g)
            fixed.append(g)
        if len(fixed) > 1 and fixed[0][0] != "C":
            if math.dist(_end(fixed[0]), _start(fixed[1])) > 1e-6 and math.dist(_start(fixed[0]), _start(fixed[1])) < 1e-6:
                fixed[0] = _rev(fixed[0])
        out.append((fixed, w.is_same(outer)))
    return out


def _start(g):
    return (g[1], g[2]) if g[0] == "L" else (g[3], g[4])


def _end(g):
    return (g[3], g[4]) if g[0] == "L" else (g[5], g[6])


def _rev(g):
    if g[0] == "L":
        return ["L", g[3], g[4], g[1], g[2]]
    return ["A", g[1], g[2], g[5], g[6], g[3], g[4], not g[7]]


def _shape_code(segs) -> str:
    """The named outline a loop is (circle, rect, rrect, obround), else free(...)."""
    if len(segs) == 1 and segs[0][0] == "C":
        _, x, y, r = segs[0]
        return f"circle({_n(x)}, {_n(y)}, {_n(r)})"
    lines = [g for g in segs if g[0] == "L"]
    arcs = [g for g in segs if g[0] == "A"]
    level = all(abs(g[2] - g[4]) < 1e-7 or abs(g[1] - g[3]) < 1e-7 for g in lines)
    xs = [v for g in segs for v in ((g[1], g[3]) if g[0] == "L" else (g[3], g[5]))]
    ys = [v for g in segs for v in ((g[2], g[4]) if g[0] == "L" else (g[4], g[6]))]
    if level and xs:
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        if len(segs) == 4 and len(lines) == 4:
            return f"rect({_n(x0)}, {_n(y0)}, {_n(x1)}, {_n(y1)})"
        rs = {round(math.hypot(g[3] - g[1], g[4] - g[2]), 6) for g in arcs}
        if len(segs) == 8 and len(lines) == 4 and len(arcs) == 4 and len(rs) == 1:
            r = rs.pop()
            # an arc's extreme reaches the box: the box of the corners plus r
            cx = [g[1] for g in arcs]
            cy = [g[2] for g in arcs]
            X0, X1, Y0, Y1 = min(cx) - r, max(cx) + r, min(cy) - r, max(cy) + r
            if all(arc_ccw_consistent(g) for g in arcs):
                return f"rrect({_n(X0)}, {_n(Y0)}, {_n(X1)}, {_n(Y1)}, {_n(r)})"
        if len(segs) == 4 and len(lines) == 2 and len(arcs) == 2 and len(rs) == 1:
            r = rs.pop()
            cx = [g[1] for g in arcs]
            cy = [g[2] for g in arcs]
            X0, X1, Y0, Y1 = min(cx) - r, max(cx) + r, min(cy) - r, max(cy) + r
            if (abs((X1 - X0) - 2 * r) < 1e-6) != (abs((Y1 - Y0) - 2 * r) < 1e-6):
                return f"obround({_n(X0)}, {_n(Y0)}, {_n(X1)}, {_n(Y1)})"
    parts = []
    for g in segs:
        if g[0] == "L":
            parts.append(f"(\"L\", {_n(g[1])}, {_n(g[2])}, {_n(g[3])}, {_n(g[4])})")
        elif g[0] == "A":
            parts.append(f"(\"A\", {_n(g[1])}, {_n(g[2])}, {_n(g[3])}, {_n(g[4])}, {_n(g[5])}, {_n(g[6])}, {bool(g[7])})")
        else:
            parts.append(f"(\"C\", {_n(g[1])}, {_n(g[2])}, {_n(g[3])})")
    return "free([" + ", ".join(parts) + "])"


def arc_ccw_consistent(g) -> bool:
    """A corner arc is a quarter circle."""
    _, cx, cy, x0, y0, x1, y1, ccw = g
    a0, a1 = math.atan2(y0 - cy, x0 - cx), math.atan2(y1 - cy, x1 - cx)
    sweep = (a1 - a0) % (2 * math.pi) if ccw else (a0 - a1) % (2 * math.pi)
    return abs(sweep - math.pi / 2) < 1e-6


# ----------------------------------------------------------------------------- part -> recipe

@dataclass
class Recipe:
    key: str
    title: str
    frame: Frame
    steps: list = field(default_factory=list)       # code lines
    notes: list = field(default_factory=list)
    where: str = ""
    solid: object = None                           # the OpenSketch solid, in OpenSketch part coordinates
    edge_groups: list = field(default_factory=list)


def _safe_name(s: str, used: set) -> str:
    base = re.sub(r"[^A-Za-z0-9 _-]+", "", str(s)).strip()[:24] or "feature"
    n, k = base, 2
    while n.lower() in used:
        n, k = f"{base} {k}", k + 1
    used.add(n.lower())
    return n


def translate_part(doc: dict, key: str) -> Recipe:
    """The engine's recipe for an OpenSketch part, or Unsupported with the reason."""
    from build123d import Axis, Location, Plane, mirror as b_mirror

    feats = doc.get("features", [])
    rb = doc.get("rollback")
    stop = len(feats) if rb is None else int(rb)
    st = geometry.RegenState()
    rec = Recipe(key=key, title=_title(doc.get("name") or key), frame=None)
    frame, fpl = None, None
    finishing = False
    seeds = {}            # extrude id -> (faces in frame, z0, z1, op, taper, outward, name)
    used = set()

    def ex_lines(name, op, z0, z1, faces, taper=0.0, outward=False, note=""):
        outer, holes = [], []
        for f in faces:
            for segs, is_outer in _loops(f):
                (outer if is_outer else holes).append(_shape_code(segs))
        if op == "cut" and holes:
            raise Unsupported(f"{name}: a cut whose sketch has islands")
        extra = f", taper={_n(taper)}" + (", outward=True" if outward else "") if taper else ""
        nm = _safe_name(name, used)
        out = [f"Ex({_q(nm)}, {_q('add' if op != 'cut' else 'cut')}, {_n(z0)}, {_n(z1)}, [{', '.join(outer)}], {_q(note)}{extra}),"]
        if holes:
            if taper:
                raise Unsupported(f"{name}: a drafted boss with holes in its sketch")
            hn = _safe_name(name + " holes", used)
            out.append(f"Ex({_q(hn)}, \"cut\", {_n(z0)}, {_n(z1)}, [{', '.join(holes)}], {_q('holes in the sketch of ' + nm)}),")
        return out

    for i, f in enumerate(feats):
        if i >= stop or f.get("suppressed"):
            continue
        t = f["type"]
        if t in ("sketch", "plane"):
            geometry.regen_feature(f, st)
            continue
        if t in ("revolve", "shell", "import", "standard"):
            raise Unsupported({"revolve": "it has a revolve", "shell": "it has a shell",
                               "import": "it is an imported body", "standard": "it is a Toolbox part"}[t])
        if t == "extrude":
            if finishing:
                raise Unsupported("an extrude comes after a fillet or chamfer")
            if f.get("merge") is False or f.get("flip_side"):
                raise Unsupported(f"{f.get('name')}: a separate body or a flipped cut")
            before = st.part
            geometry.regen_feature(f, st)
            tool, op = st.tools[f["id"]]
            pl = st.planes[f["sketch"]]
            if frame is None:
                frame = Frame.of_plane(pl)
                fpl = frame.plane()
            zdir = frame.M[2]
            if abs(abs(float(np.dot(geometry.vlist(pl.z_dir), zdir))) - 1) > 1e-9:
                raise Unsupported(f"{f.get('name')} runs in another direction than the first extrude")
            zs = float(np.dot(np.array(geometry.vlist(pl.origin)) - frame.o, zdir))
            tb = fpl.to_local_coords(tool).bounding_box()
            lo, hi = tb.min.Z, tb.max.Z
            if f.get("end") == "through_all" or (f.get("dir2") or {}).get("end") == "through_all":
                ref = before if op == "cut" else st.part
                if ref is None:
                    raise Unsupported("through all with nothing to go through")
                pb = fpl.to_local_coords(ref).bounding_box()
                lo, hi = max(lo, pb.min.Z), min(hi, pb.max.Z)
            if abs(lo - zs) < 1e-6:
                z0, z1 = zs, hi
            elif abs(hi - zs) < 1e-6:
                z0, z1 = zs, lo
            else:
                z0, z1 = lo, hi
            taper = float(f.get("draft") or 0)
            if taper and (abs(z0 - zs) > 1e-6 or f.get("dir2") or f.get("end") == "midplane"):
                raise Unsupported(f"{f.get('name')}: a draft on an extrude in two directions")
            faces = [fpl.to_local_coords(x) for x in st.profiles[f["sketch"]]]
            end = f.get("end", "blind")
            note = f"{f.get('name', 'extrude')}: {end.replace('_', ' ')}" + (f" {_n(f.get('depth', 0))} mm" if end in ("blind", "midplane") else "")
            rec.steps += ex_lines(f.get("name") or f["id"], "cut" if op == "cut" else "add", z0, z1, faces, taper,
                                  bool(f.get("draft_outward")), note)
            seeds[f["id"]] = (faces, z0, z1, op, taper, bool(f.get("draft_outward")), f.get("name") or f["id"])
            continue
        if t in ("linear_pattern", "circular_pattern", "mirror"):
            if finishing:
                raise Unsupported("a pattern comes after a fillet or chamfer")
            ids = f.get("features") or []
            if not ids or any(x not in seeds for x in ids):
                raise Unsupported(f"{f.get('name')}: patterns and mirrors of anything but extrudes")
            moves = []
            if t == "linear_pattern":
                d = np.array(geometry.vlist(geometry.direction_of(f.get("direction", "X"), st))) * (-1 if f.get("reverse") else 1)
                d2 = f.get("direction2")
                dv2 = np.array(geometry.vlist(geometry.direction_of(d2, st))) if d2 else None
                n, sp = int(f.get("count", 2)), float(f.get("spacing", 10))
                n2, sp2 = int(f.get("count2", 1)), float(f.get("spacing2", 10))
                for a in range(n):
                    for b in range(n2 if dv2 is not None else 1):
                        if a == 0 and b == 0:
                            continue
                        off = d * sp * a + (dv2 * sp2 * b if dv2 is not None else 0)
                        o2 = frame.dir_sw(off)
                        if abs(o2[2]) > 1e-7:
                            raise Unsupported(f"{f.get('name')}: a pattern out of the sketch plane")
                        moves.append(lambda x, o2=o2: x.moved(Location((o2[0], o2[1], 0))))
            elif t == "circular_pattern":
                ax = f.get("axis", "Y")
                if isinstance(ax, str):
                    ap, ad = np.zeros(3), np.eye(3)["XYZ".index(ax.upper())]
                else:
                    ap, ad = np.array(ax["origin"], float), np.array(ax["dir"], float)
                ad2 = frame.dir_sw(ad / np.linalg.norm(ad))
                if abs(abs(ad2[2]) - 1) > 1e-9:
                    raise Unsupported(f"{f.get('name')}: a circular pattern about an axis across the sketch plane")
                ap2 = frame.to_sw(ap)
                n = int(f.get("count", 4))
                total = float(f.get("angle", 360))
                step = total / n if f.get("equal_spacing", True) and abs(total - 360) < 1e-9 else (
                    total / max(n - 1, 1) if f.get("equal_spacing", True) else float(f.get("step", 90)))
                axis = Axis((ap2[0], ap2[1], 0), tuple(ad2))
                for k in range(1, n):
                    moves.append(lambda x, a=step * k: x.rotate(axis, a))
            else:
                pl = geometry.resolve_plane(f.get("plane"), st)
                n2 = frame.dir_sw(geometry.vlist(pl.z_dir))
                if abs(n2[2]) > 1e-7:
                    raise Unsupported(f"{f.get('name')}: a mirror about a plane parallel to the sketch plane")
                p2 = frame.to_sw(geometry.vlist(pl.origin))
                mp = Plane(origin=tuple(p2), z_dir=tuple(n2))
                moves.append(lambda x: b_mirror(x, about=mp))
            geometry.regen_feature(f, st)
            for fid in ids:
                faces, z0, z1, op, taper, outward, nm = seeds[fid]
                for k, mv in enumerate(moves, 1):
                    moved = [mv(x) for x in faces]
                    moved = [x.faces()[0] if hasattr(x, "faces") and not hasattr(x, "outer_wire") else x for x in moved]
                    rec.steps += ex_lines(f"{nm} {f.get('name', t)} {k}", "cut" if op == "cut" else "add", z0, z1, moved,
                                          taper, outward, f"{f.get('name', t)}: copy {k} of {nm}")
            continue
        if t in ("fillet", "chamfer"):
            if frame is None:
                raise Unsupported("a fillet or chamfer before any extrude")
            edges, _ = geometry.find_edges(st.part, f.get("edges", []), st.namer)
            groups = []
            for e in edges:
                pts = [frame.to_sw(geometry.vlist(e @ s)) for s in (0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875)]
                groups.append([[_n(v, 6) for v in p] for p in pts])
            geometry.regen_feature(f, st)
            finishing = True
            sel = f"_on({json.dumps(groups)})"
            nm = _safe_name(f.get("name") or f["id"], used)
            if t == "fillet":
                r = float(f.get("radius", 1))
                rec.steps.append(f"Fi({_q(nm)}, {_n(r)}, {sel}, {_q(f'R{_n(r)} on {len(edges)} edge(s)')}),")
            else:
                d1 = float(f.get("distance", 1))
                d2 = f.get("distance2")
                if f.get("mode") == "angle_distance":
                    if abs(float(f.get("angle", 45)) - 45) > 1e-9:
                        raise Unsupported(f"{f.get('name')}: a chamfer that is not 45 deg")
                elif d2 is not None and abs(float(d2) - d1) > 1e-9:
                    raise Unsupported(f"{f.get('name')}: a chamfer with two distances")
                rec.steps.append(f"Ch({_q(nm)}, {_n(d1)}, {sel}, {_q(f'{_n(d1)} x 45 deg on {len(edges)} edge(s)')}),")
            continue
        raise Unsupported(f"it has a {t} feature")

    if frame is None:
        raise Unsupported("it has no extrude")
    bad = [s for s in st.status if s.get("state") == "error"]
    if bad:
        raise Unsupported("a feature fails to rebuild in OpenSketch")
    if geometry.solid_of(st.part) is None or len(st.part.solids()) != 1:
        raise Unsupported("it is not one solid body")
    rec.frame = frame
    rec.solid = geometry.solid_of(st.part)
    first = next(f for f in feats if f["type"] == "extrude")
    sk = next((f for f in feats if f["id"] == first.get("sketch")), {})
    plref = (sk.get("plane") or {}).get("ref") or "a face"
    rec.where = (f"origin at the OpenSketch part origin" if np.allclose(frame.o, 0) else "origin at the first sketch's origin") + \
        f"; Front plane = the plane of the first sketch ({plref} in OpenSketch)"
    if not np.allclose(frame.o, 0) or not np.allclose(frame.M, np.eye(3)):
        rec.notes.append(f"The SOLIDWORKS Front plane is the OpenSketch {plref}, so the part is turned compared with OpenSketch; "
                         "the assembly places it so that it sits where OpenSketch has it.")
    rec.notes.append("The first sketch is placed where it is in OpenSketch, not re-centred on the origin, "
                     "so that the part's planes match the mates.")
    return rec


def _title(s: str) -> str:
    s = "".join(c for c in str(s) if 32 <= ord(c) < 127).replace('"', "'").strip()
    return s[:60] or "Part"


def recipe_text(rec: Recipe) -> str:
    return f'''"""{rec.title}: made from an OpenSketch part by opensketch.sldexport."""
from core import Ch, Ex, Fi, PART_FRAME, Part, circle, edges_where, free, obround, rect, rrect
from source import step


def source():
    return step("src/{rec.key}.step")


def _on(groups, tol=1e-3):
    """Edges of the part as it is at that point that run through the OpenSketch edges (sample points)."""
    def pick(d):
        from build123d import Vector
        e = d["e"]
        return any(any(e.distance_to(Vector(*p)) < tol for p in g) for g in groups)
    return edges_where(pick)


def part():
    steps = [
{chr(10).join("        " + s for s in rec.steps)}
    ]
    return Part({rec.key!r}, {rec.title!r}, PART_FRAME, steps, src=source,
                notes={rec.notes!r},
                where={rec.where!r})
'''


def _export_step(solid, path: str):
    from build123d import export_step
    export_step(solid, path)


# ----------------------------------------------------------------------------- assembly data

STD_N = {1: np.array([0, 0, 1.0]), 2: np.array([0, 1.0, 0]), 3: np.array([1.0, 0, 0])}   # SW Front, Top, Right
NAMED_PLANE_NO = {"Front Plane": 1, "Top Plane": 2, "Right Plane": 3}


def _std_plane(p, n) -> tuple[int, int] | None:
    """(plane number, sign) if the plane (point, normal) is one of the standard planes."""
    for k, e in STD_N.items():
        dot = float(np.dot(n, e))
        if abs(abs(dot) - 1) < 1e-7 and abs(float(np.dot(p, e))) < 1e-6:
            return k, (1 if dot > 0 else -1)
    return None


def _std_axis(p, d) -> tuple[int, int] | None:
    """The two standard planes whose intersection is this axis."""
    for k, (a, b) in {0: (2, 1), 1: (1, 3), 2: (2, 3)}.items():   # X: Top & Front, Y: Front & Right, Z: Top & Right
        e = np.eye(3)[k]
        if abs(abs(float(np.dot(d, e))) - 1) < 1e-7 and np.linalg.norm(np.cross(p, e)) < 1e-6:
            return a, b
    return None


def _inner_point(face):
    """A point on a face, well inside it: the centroid of its largest mesh triangle, put back onto the
    surface (a centroid on a curved face lies under it)."""
    from OCP.BRepBuilderAPI import BRepBuilderAPI_MakeVertex
    from OCP.BRepExtrema import BRepExtrema_DistShapeShape
    from OCP.gp import gp_Pnt
    verts, tris = face.tessellate(0.05, 0.3)
    best, area = None, -1.0
    for t in tris:
        a, b, c = (np.array(geometry.vlist(verts[i])) for i in t)
        ar = float(np.linalg.norm(np.cross(b - a, c - a))) / 2
        if ar > area:
            best, area = (a + b + c) / 3, ar
    if best is None:
        return np.array(geometry.vlist(face.center()))
    v = BRepBuilderAPI_MakeVertex(gp_Pnt(*best)).Vertex()
    d = BRepExtrema_DistShapeShape(v, face.wrapped)
    if d.IsDone() and d.NbSolution() > 0:
        q = d.PointOnShape2(1)
        return np.array([q.X(), q.Y(), q.Z()])
    return best


def _find_face(solid, kind, p, d):
    """A face of the solid for a plane or axis reference: (face, inner point, outward-normal sign or 0)."""
    from build123d import GeomType
    best = None
    for f in solid.faces():
        try:
            if kind == "plane" and f.geom_type == GeomType.PLANE:
                n = np.array(geometry.vlist(f.normal_at()))
                if abs(abs(float(n @ d)) - 1) > 1e-6:
                    continue
                q = np.array(geometry.vlist(f.center()))
                if abs(float((q - p) @ d)) > 1e-4:
                    continue
                dist = f.distance_to(geometry.v3(p))
                if best is None or dist < best[0]:
                    best = (dist, f, 1 if float(n @ d) > 0 else -1)
            elif kind == "axis" and f.geom_type in (GeomType.CYLINDER, GeomType.CONE):
                ax = f.axis_of_rotation
                ad = np.array(geometry.vlist(ax.direction))
                if abs(abs(float(ad @ d)) - 1) > 1e-6:
                    continue
                ap = np.array(geometry.vlist(ax.position))
                off = float(np.linalg.norm(np.cross(p - ap, d)))
                if off > 1e-4:
                    continue
                along = abs(float((p - ap) @ d))
                if best is None or along < best[0]:
                    best = (along, f, 0)
        except Exception:
            continue
    if best is None:
        return None
    return best[1], _inner_point(best[1]), best[2]


def _find_edge(solid, p, d):
    """The middle of a straight edge of the solid that lies on the axis (point p, direction d), or None."""
    from build123d import GeomType
    if solid is None:
        return None
    for e in solid.edges():
        if e.geom_type != GeomType.LINE:
            continue
        a, b = np.array(geometry.vlist(e @ 0)), np.array(geometry.vlist(e @ 1))
        u = b - a
        L = float(np.linalg.norm(u))
        if L < 1e-9 or abs(abs(float(u @ d)) / L - 1) > 1e-7:
            continue
        if np.linalg.norm(np.cross(a - p, d)) < 1e-5:
            return (a + b) / 2
    return None


class AsmData:
    def __init__(self):
        self.lines: list[str] = []
        self.mates: list[dict] = []
        self.ents: list[dict] = []
        self.axes: list[tuple] = []    # (part index, "P", plane a, plane b) or (part index, "E", x, y, z)
        self.skipped: list[str] = []
        self.comps = 0
        self.n_ents = 0
        self.truth_comps: list[dict] = []


def _entity(ref, comps_by_id, poses, parts_info, data: AsmData, what: str):
    """An entity spec {comp, kind, num, pt(part mm), apt(asm mm), sign} for a mate reference, or a reason string."""
    cid = ref.get("component")
    k, p, d = assembly.ref_local(ref)
    if cid is None:
        if k == "plane":
            sp = _std_plane(p, d)
            if sp:
                return {"comp": 0, "kind": "G", "num": sp[0], "pt": p, "apt": p, "sign": sp[1], "n_world": d}
        return f"{what}: a reference on the assembly that is not one of its standard planes"
    c, ci = comps_by_id[cid]
    info = parts_info[c["part"]]
    fr: Frame = info["frame"]
    pose = poses[cid]
    named = ref.get("ref")
    if k == "point":
        return f"{what}: a point reference (vertex and origin picks are not exported yet)"
    # a face of the part first: it is what a designer picks
    hit = _find_face(info["solid"], k, p, d) if info["solid"] is not None else None
    if hit is not None:
        face, q, sgn = hit
        return {"comp": ci, "kind": "F", "num": 0, "pt": fr.to_sw(q), "apt": pose.R @ q + pose.t, "sign": sgn,
                "n_world": pose.R @ d}
    ps, ds = fr.to_sw(p), fr.dir_sw(d)
    if k == "plane":
        sp = _std_plane(ps, ds)
        if sp:
            return {"comp": ci, "kind": "P", "num": sp[0], "pt": ps, "apt": pose.R @ p + pose.t, "sign": sp[1],
                    "n_world": pose.R @ d}
        return f"{what}: a plane of {c.get('name')} that is neither a face nor a standard plane"
    sa = _std_axis(ps, ds)
    ed = None if sa else _find_edge(info["solid"], p, d)
    if ed is not None:
        q = fr.to_sw(ed)
        key = (info["index"], "E", *[_n(v, 6) for v in q])
        if key not in data.axes:
            data.axes.append(key)
        return {"comp": ci, "kind": "X", "num": data.axes.index(key) + 1, "pt": ps, "apt": pose.R @ p + pose.t, "sign": 0,
                "n_world": pose.R @ d}
    if sa:
        key = (info["index"], "P", sa[0], sa[1])
        if key not in data.axes:
            data.axes.append(key)
        return {"comp": ci, "kind": "X", "num": data.axes.index(key) + 1, "pt": ps, "apt": pose.R @ p + pose.t, "sign": 0,
                "n_world": pose.R @ d}
    return f"{what}: an axis of {c.get('name')} with no round face, straight edge or standard axis on it"


def _readings(kind: str, ents: list, os_align: str | None, flips: bool) -> list[str]:
    """Alignments to try, the expected one first."""
    order = ["C", "A", "N"]
    signs = [e.get("sign", 0) for e in ents]
    if len(ents) == 2 and all(signs) and ents[0].get("n_world") is not None and ents[1].get("n_world") is not None:
        na = ents[0]["n_world"] * signs[0]
        nb = ents[1]["n_world"] * signs[1]
        dot = float(np.dot(na, nb))
        if abs(abs(dot) - 1) < 1e-4:
            first = "A" if dot > 0 else "N"
            order = [first, "N" if first == "A" else "A", "C"]
    if flips:
        order = [x for r in order for x in (r, r + "F")]
    return order


def _current_value(m, poses):
    """Distance (mm) or angle (deg) between the references at the solved positions."""
    a = assembly.ref_world(m["refs"][0], poses)
    b = assembly.ref_world(m["refs"][1], poses)
    if m["type"] == "limit_angle":
        da, db = a[2], b[2]
        return math.degrees(math.acos(max(-1.0, min(1.0, abs(float(da @ db))))))
    if a[0] == "plane" and b[0] == "plane":
        return abs(float((b[1] - a[1]) @ a[2]))
    return float(np.linalg.norm(b[1] - a[1]))


def build_asm_data(asm: dict, parts_info: dict) -> tuple[AsmData, dict]:
    """Components (where OpenSketch solved them) and mates as SOLIDWORKS will get them."""
    res = assembly.regen_assembly(asm)
    solved = assembly.apply_solution(asm, res)
    states = {m["id"]: m for m in res["mates"]}
    comps = [c for c in solved.get("components", []) if not c.get("suppressed")]
    poses = {c["id"]: assembly.Pose.of(c) for c in comps}
    data = AsmData()
    by = {c["id"]: (c, i + 1) for i, c in enumerate(comps)}
    any_fixed = any(c.get("fixed") for c in comps)
    fixed = {c["id"] for c in comps if c.get("fixed")} or ({comps[0]["id"]} if comps else set())
    L = data.lines
    data.comps = len(comps)
    for c, i in by.values():
        info = parts_info[c["part"]]
        fr: Frame = info["frame"]
        pose = poses[c["id"]]
        Rsw = pose.R @ fr.M.T
        tsw = pose.R @ fr.o + pose.t
        L.append(f"gOsCPart({i}) = {info['index']}")
        L.append(f"gOsCName({i}) = {_q(c.get('name') or c['id'])}")
        L.append(f"gOsCFixed({i}) = {'True' if c['id'] in fixed else 'False'}")
        data.truth_comps.append({"xf": [float(v) for v in list(Rsw.flatten()) + list(tsw / 1000.0)], "fixed": c["id"] in fixed})
        for k, v in enumerate(list(Rsw.flatten()) + list(tsw / 1000.0)):
            L.append(f"gOsXf({i}, {k}) = {_vb(round(float(v), 12))}")
        bb = info["solid"].bounding_box() if info["solid"] is not None else None
        probe_os = np.array(geometry.vlist(bb.max)) if bb is not None else np.array([10.0, 20.0, 30.0])
        probe_sw = fr.to_sw(probe_os)
        world = pose.R @ probe_os + pose.t
        for k, v in enumerate(list(probe_sw / 1000.0) + list(world / 1000.0)):
            L.append(f"gOsProbe({i}, {k}) = {_vb(round(float(v), 12))}")
    if not any_fixed and comps:
        data.skipped.append(f"No component is fixed in OpenSketch; {comps[0].get('name')} is fixed in SOLIDWORKS, as OpenSketch's solver does.")

    def add_mate(swtype, what, ents, readings, nums=(0, 0, 0, 0, 0, 0)):
        data.mates.append({"type": swtype, "what": what, "ents": ents, "try": readings, "nums": nums})

    for m in solved.get("mates", []):
        if m.get("suppressed"):
            continue
        cn = [by[r["component"]][0].get("name") or r["component"] if r.get("component") in by else "the assembly"
              for r in m.get("refs") or []]
        name = (m.get("name") or m.get("id")) + (f" ({cn[0]} to {cn[1]})" if len(cn) == 2 else "")
        st = states.get(m["id"], {})
        if st.get("state") == "error":
            data.skipped.append(f"{name}: not exported, it is in error in OpenSketch ({st.get('message')})")
            continue
        t = m["type"]
        try:
            if t == "lock":
                cs = [r.get("component") for r in m["refs"]]
                if None in cs:
                    data.skipped.append(f"{name}: lock to the assembly; the component is fixed instead")
                    continue
                ents = [{"comp": by[cid][1], "kind": "K", "num": 0, "pt": np.zeros(3), "apt": np.zeros(3)} for cid in cs]
                add_mate("swMateLOCK", f"{name}: lock", ents, ["C"])
                continue
            groups = []
            if t == "hinge":
                groups.append(("swMateCONCENTRIC", f"{name}: hinge axis (concentric)", m["refs"], False, None))
                if m.get("planes"):
                    groups.append(("swMateCOINCIDENT", f"{name}: hinge faces (coincident)", m["planes"], False, None))
                if m.get("angle_refs") and (m.get("angle_min") is not None or m.get("angle_max") is not None):
                    groups.append(("swMateANGLE", f"{name}: hinge angle limits", m["angle_refs"], True,
                                   ("angle", m.get("angle_min"), m.get("angle_max"))))
            else:
                sw = {"coincident": "swMateCOINCIDENT", "concentric": "swMateCONCENTRIC", "parallel": "swMatePARALLEL",
                      "perpendicular": "swMatePERPENDICULAR", "distance": "swMateDISTANCE", "angle": "swMateANGLE",
                      "limit_distance": "swMateDISTANCE", "limit_angle": "swMateANGLE"}[t]
                lim = None
                if t == "limit_distance":
                    lim = ("distance", m.get("min"), m.get("max"))
                elif t == "limit_angle":
                    lim = ("angle", m.get("min"), m.get("max"))
                groups.append((sw, f"{name}: {t.replace('_', ' ')}", m["refs"], t in ("distance", "angle") or lim is not None, lim))
            for swtype, what, refs, flips, lim in groups:
                ents = []
                for r in refs:
                    e = _entity(r, by, poses, parts_info, data, what)
                    if isinstance(e, str):
                        raise Unsupported(e)
                    ents.append(e)
                nums = (0, 0, 0, 0, 0, 0)
                if swtype == "swMateDISTANCE":
                    if lim:
                        cur = _current_value({"type": "limit_distance", "refs": refs}, poses)
                        lo = lim[1] if lim[1] is not None else cur
                        hi = lim[2] if lim[2] is not None else cur
                        nums = (cur / 1000, hi / 1000, lo / 1000, 0, 0, 0)
                    else:
                        v = abs(float(m.get("value", 0))) / 1000
                        nums = (v, v, v, 0, 0, 0)
                elif swtype == "swMateANGLE":
                    if lim:
                        cur = _current_value({"type": "limit_angle", "refs": refs}, poses)
                        lo = lim[1] if lim[1] is not None else cur
                        hi = lim[2] if lim[2] is not None else cur
                        nums = (0, 0, 0, math.radians(cur), math.radians(hi), math.radians(lo))
                    else:
                        a = math.radians(float(m.get("value", 90)))
                        nums = (0, 0, 0, a, a, a)
                kind = "plane" if swtype in ("swMateCOINCIDENT", "swMateDISTANCE", "swMatePARALLEL") else "other"
                add_mate(swtype, what, ents, _readings(kind, ents, m.get("align"), flips), nums)
        except Unsupported as exc:
            data.skipped.append(f"{name}: not exported. {exc}")
    return data, {"poses": poses, "fixed": fixed, "comps": comps}


def asm_vba_lines(data: AsmData) -> list[str]:
    L = list(data.lines)
    e_no = 0
    for i, m in enumerate(data.mates, 1):
        L.append(f"gOsMType({i}) = swMateType_e.{m['type']}")
        L.append(f"gOsMWhat({i}) = {_q(m['what'])}")
        L.append(f"gOsMTry({i}) = {_q(','.join(m['try']))}")
        for k, v in enumerate(m["nums"]):
            L.append(f"gOsMNum({i}, {k}) = {_vb(round(float(v), 12))}")
        L.append(f"gOsMFirst({i}) = {e_no + 1}")
        L.append(f"gOsMCount({i}) = {len(m['ents'])}")
        for e in m["ents"]:
            e_no += 1
            L.append(f"gOsEComp({e_no}) = {e['comp']}")
            L.append(f"gOsEKind({e_no}) = {_q(e['kind'])}")
            L.append(f"gOsENum({e_no}) = {e['num']}")
            for k, v in enumerate(list(e["pt"]) + list(e["apt"])):
                L.append(f"gOsEPt({e_no}, {k}) = {_vb(round(float(v), 9))}")
    for k, ax in enumerate(data.axes, 1):
        L.append(f"gOsAPart({k}) = {ax[0]}")
        L.append(f"gOsAKind({k}) = {_q(ax[1])}")
        if ax[1] == "P":
            L.append(f"gOsAPl({k}, 0) = {ax[2]}")
            L.append(f"gOsAPl({k}, 1) = {ax[3]}")
        else:
            for j in range(3):
                L.append(f"gOsAPt({k}, {j}) = {_vb(ax[2 + j])}")
    data.n_ents = e_no
    return L


def data_procs(lines: list[str], chunk: int = 200) -> str:
    """OsData and its pieces (a procedure stays well under VBA's limits)."""
    pieces = [lines[k:k + chunk] for k in range(0, len(lines), chunk)] or [[]]
    out = ["Private Sub OsData()"] + [f"    OsData{k + 1}" for k in range(len(pieces))] + ["End Sub", ""]
    for k, p in enumerate(pieces):
        out += [f"Private Sub OsData{k + 1}()"] + ["    " + l for l in p] + ["End Sub", ""]
    return "\n".join(out)


def os_module(order: list, data: "AsmData", lines: list[str], NAME: str, title: str, is_asm: bool,
              all_step: bool = False) -> tuple[str, str]:
    """The declarations and the code of OpenSketch's VBA module, with its data filled in.
    all_step: every part is imported from <key>.step (the assembly stand-in runs it that way)."""
    plines = []
    for e in order:
        i = e["index"]
        step = f"{e['key']}.step" if all_step else (e.get("step", "") if e["mode"] == "step" else "")
        plines += [f"gOsKey({i}) = {_q(e['key'])}", f"gOsTitle({i}) = {_q(e['title'])}",
                   f"gOsStep({i}) = {_q(step)}", f"gOsWhy({i}) = {_q(e['why'] or ('stand-in' if all_step else ''))}"]
    osdata = data_procs(plines + lines)
    counts = {"NP": len(order), "NC": data.comps, "NM": len(data.mates), "NE": data.n_ents, "NA": len(data.axes)}
    decl = vba.DECL
    for k, v in counts.items():
        decl = decl.replace(f"@@{k}@@", str(v))
    # arrays need at least one element
    decl = re.sub(r"\(1 To (OS_N[PCMEA])\b", lambda m: f"(1 To {max(1, counts[m.group(1)[3:]])}", decl)
    decl = (decl.replace("@@MAKE_ASM@@", "True").replace("@@NAME@@", NAME).replace("@@ASM_TITLE@@", title.replace('"', "'"))
            .replace("@@IS_ASM@@", "True" if is_asm else "False"))
    return decl, vba.CODE.replace("'@@OSDATA@@", osdata)


def standalone_macro(order, decl, code_mod, NAME, title, is_asm) -> str:
    """A macro with no engine part: the shim, then OpenSketch's module."""
    log_name = NAME + LOG_SUFFIX
    table = "\n".join(f"'   {e['index']}. {e['title']} (key \"{e['key']}\"): STEP import, {e['why']}" for e in order)
    head = (vba.SHIM_HEAD.replace("'@@TITLE@@", f"' {title}: imported from STEP" + (", assembled and mated" if is_asm else ""))
            .replace("@@NAME@@", NAME).replace("@@LOGNAME@@", log_name).replace("'@@PARTS@@", table))
    return head + decl + vba.SHIM_CODE.replace("@@LOGHEAD@@", title.replace('"', "'")) + code_mod


# ----------------------------------------------------------------------------- the export

def _slug(s: str, used: set) -> str:
    b = re.sub(r"[^a-z0-9]+", "_", str(s).lower()).strip("_")[:20] or "part"
    if b[0].isdigit():
        b = "p_" + b
    n, k = b, 2
    while n in used:
        n, k = f"{b}_{k}", k + 1
    used.add(n)
    return n


def _check_ok(out: str, key: str) -> tuple[bool, str]:
    m = re.search(r"only in the features ([\d.]+), only in the source ([\d.]+) mm3", out)
    v = re.search(r"features ([\d.]+) mm3, source ([\d.]+) mm3", out)
    if not m or not v:
        return False, "the engine's check did not finish: " + out.strip().splitlines()[-1][:200] if out.strip() else "no output"
    a, b, vol = float(m.group(1)), float(m.group(2)), float(v.group(2))
    tol = max(0.05, 2e-5 * vol)
    if a <= tol and b <= tol:
        return True, f"features {float(v.group(1)):.3f} mm3 against {vol:.3f} mm3; only in the features {a:.3f}, only in the source {b:.3f}"
    return False, f"the rebuilt features differ from the part (only in the features {a:.3f} mm3, only in the source {b:.3f} mm3)"


KNOWN_FAULT_SCENARIOS = {"a relation moves the sketch", "relations and Fully Define Sketch move it"}


def _known_standin_fault(job: str) -> str | None:
    """The engine's stand-in moves a sketch only on an Equal relation, but expects a redraw whenever a sketch
    has any relation. Parts with no Equal relation then fail those two scenarios through no fault of the
    macro. Returns a note if that is the only failure, else None."""
    try:
        log = open(os.path.join(job, "out", "standin.log")).read()
        truth = json.load(open(os.path.join(job, "out", "expected.json")))
    except Exception:
        return None
    failed = {m.group(1).strip() for m in re.finditer(r"^FAIL\s+(.+?)\s+\(", log, re.M)}
    if not failed or not failed <= KNOWN_FAULT_SCENARIOS:
        return None
    if "Basic error" in log or "STAND-IN: " not in log:
        return None
    has_eq = any("EQ" in (st.get("rel_kinds") or []) for p in truth["parts"] for st in p["steps"])
    if has_eq:
        return None
    return ("the two failing scenarios (" + ", ".join(sorted(failed)) + ") expect a sketch to be redrawn after a relation "
            "moves it, but the stand-in only moves a sketch on an Equal relation and these parts have none. "
            "This is a fault of the engine's stand-in, not of this macro; it should be fixed in the engine.")


def export(doc: dict, out_zip: str, name: str | None = None, verify: bool = True, log=print,
           force_step: bool = False) -> dict:
    """Write the macro and everything that goes with it into a zip. Returns the report."""
    t0 = time.time()
    is_asm = assembly.is_assembly(doc)
    title = _title(doc.get("name") or ("Assembly" if is_asm else "Part"))
    NAME = re.sub(r"[^A-Za-z0-9_-]+", "_", name or title).strip("_")[:40] or "OpenSketch"
    tc = toolchain()
    report = {"name": NAME, "title": title, "assembly": is_asm, "parts": [], "mates": {}, "checks": {},
              "toolchain": tc["have"], "notes": []}
    parts = doc["parts"] if is_asm else {"part": doc}
    if is_asm:
        used_pids = {c["part"] for c in doc.get("components", []) if not c.get("suppressed")}
        parts = {pid: p for pid, p in parts.items() if pid in used_pids}
    work = tempfile.mkdtemp(prefix="osk_sldmacro_")
    job = os.path.join(work, "job")
    for d in ("recipes", "src", "out", "steps"):
        os.makedirs(os.path.join(job, d), exist_ok=True)
    open(os.path.join(job, "recipes", "__init__.py"), "w").close()

    # 1. each part: a recipe, or a STEP import
    used, info = set(), {}
    for idx, (pid, p) in enumerate(parts.items(), 1):
        key = _slug(p.get("name") or pid, used)
        b = assembly.build_part(p)
        solid = b["solid"]
        entry = {"pid": pid, "key": key, "title": _title(p.get("name") or pid), "index": idx, "solid": solid,
                 "frame": Frame.identity(), "mode": "step", "why": "", "features": 0}
        if solid is None:
            raise ValueError(f"{entry['title']} does not rebuild in OpenSketch; fix it before exporting")
        try:
            if force_step:
                raise Unsupported("STEP import was asked for")
            if not tc["ok"]:
                raise Unsupported("the macro toolchain is not installed on this server")
            rec = translate_part(p, key)
            entry.update(frame=rec.frame, mode="features", rec=rec, features=len(rec.steps))
            src = rec.frame.plane().to_local_coords(rec.solid)
            _export_step(src, os.path.join(job, "src", f"{key}.step"))
            open(os.path.join(job, "recipes", f"{key}.py"), "w").write(recipe_text(rec))
            open(os.path.join(job, "job.py"), "w").write(f'NAME = "{key}_probe"\nTITLE = "probe"\nPARTS = ["{key}"]\n')
            log(f"{entry['title']}: checking {len(rec.steps)} features against the part")
            code, out = _run(tc, ["check", key], job, timeout=900)
            ok, why = _check_ok(out, key)
            if code != 0 or not ok:
                raise Unsupported(why if not ok else "the engine's check failed: " + out.strip()[-300:])
            entry["check"] = why
        except Unsupported as exc:
            entry.update(mode="step", why=str(exc), frame=Frame.identity())
        except Exception as exc:     # a fault while translating: still export the part, as STEP
            entry.update(mode="step", why=f"could not be translated ({type(exc).__name__}: {exc})", frame=Frame.identity())
        if entry["mode"] == "step":
            fn = f"{key}.step"
            _export_step(solid, os.path.join(job, "steps", fn))
            entry["step"] = fn
            log(f"{entry['title']}: STEP import ({entry['why']})")
        info[pid] = entry

    built = [e for e in info.values() if e["mode"] == "features"]
    # 2. the engine's macro for the parts it builds (one more round if emit refuses one)
    bas = None
    for attempt in range(2):
        if not built:
            break
        open(os.path.join(job, "job.py"), "w").write(
            f'NAME = "{NAME}"\nTITLE = {title!r}\nPARTS = {[e["key"] for e in built]!r}\n')
        log(f"writing the feature macro for {len(built)} part(s)")
        code, out = _run(tc, ["emit"], job, timeout=3600)
        if code == 0 and os.path.exists(os.path.join(job, "out", NAME + ".bas")):
            bas = open(os.path.join(job, "out", NAME + ".bas"), newline="").read().replace("\r\n", "\n")
            break
        bad = [e for e in built if e["title"] in out[-4000:]] or built
        for e in bad if len(built) > 1 and attempt == 0 else built:
            e.update(mode="step", why="the engine would not write a macro for it that checks itself", frame=Frame.identity())
            fn = f"{e['key']}.step"
            _export_step(e["solid"], os.path.join(job, "steps", fn))
            e["step"] = fn
        built = [e for e in info.values() if e["mode"] == "features"]

    if bas is not None and verify:
        log("checking the feature macro (sketch solver, stand-in, grammar, file)")
        code, out = _run(tc, ["verify"], job, timeout=3600)
        vj = os.path.join(job, "out", "verify.json")
        if os.path.exists(vj):
            v = json.load(open(vj))
            report["checks"]["engine"] = {k: {"ok": x["ok"], "summary": re.sub(r"/\S*/", "", x["summary"])} for k, x in v["checks"].items()}
            report["checks"]["engine_ok"] = v["ok"]
            fault = _known_standin_fault(job)
            if fault and not v["checks"]["standin"]["ok"] and all(x["ok"] for k, x in v["checks"].items() if k != "standin"):
                report["checks"]["engine"]["standin"]["known_fault"] = fault
                report["checks"]["engine_ok_except_known"] = True
        else:
            report["checks"]["engine_ok"] = False
            report["checks"]["engine"] = {"verify": {"ok": False, "summary": out.strip()[-400:]}}

    # 3. assembly data and the OpenSketch module
    order = list(info.values())
    if is_asm:
        data, _ = build_asm_data(doc, info)
        lines = asm_vba_lines(data)
    else:
        data = AsmData()
        data.n_ents = 0
        lines = []
    decl, code_mod = os_module(order, data, lines, NAME, title, is_asm)
    log_name = NAME + LOG_SUFFIX
    if bas is not None:
        text = bas
        assert text.count("\nSub main()") == 1 and text.count("\n    BuildAll\n") == 1
        text = text.replace("\nSub main()", decl.rstrip("\n") + "\n\nSub main()", 1)
        text = text.replace("\n    BuildAll\n", "\n    OsReset\n    BuildAll\n    OsAfterParts\n", 1)
        for e in built:
            n_engine = [x["key"] for x in built].index(e["key"]) + 1
            pat = f'    If WantPart("{e["key"]}") Then Build{n_engine}\n'
            assert pat in text, pat
            text = text.replace(pat, f'    If WantPart("{e["key"]}") Then\n        Set gModel = Nothing\n        Build{n_engine}\n'
                                     f'        OsKeep {n_engine}, {e["index"]}\n    End If\n', 1)
        text = text.rstrip("\n") + "\n" + code_mod
        if is_asm or any(e["mode"] == "step" for e in order):
            note = ("' OpenSketch: parts marked STEP are imported from steps\\ (save this macro in the unzipped folder).\n"
                    "' With an assembly, the parts and the assembly are saved in Documents\\OpenSketch\\" + NAME +
                    " and the mates are\n' added one by one; a mate is kept only if it holds without moving anything.\n")
            text = text.replace("\nOption Explicit\n", "\n" + note + "Option Explicit\n", 1)
    else:
        text = standalone_macro(order, decl, code_mod, NAME, title, is_asm)
    text = "".join(c if ord(c) < 128 else "?" for c in text)
    macro = os.path.join(job, "out", NAME + ".bas")
    open(macro, "w", newline="").write(text.replace("\n", "\r\n"))

    # 4. checks of the final file, and the assembly stand-in
    report["checks"]["final"] = final_checks(macro, tc)
    if is_asm and data.mates is not None:
        if tc["have"]["standin"]:
            log("running the assembly stand-in (LibreOffice)")
            report["checks"]["assembly_standin"] = assembly_standin(order, data, lines, NAME, title, job, tc)
        else:
            report["checks"]["assembly_standin"] = {"ok": None, "summary": "not run: LibreOffice with python3-uno is not installed here"}

    # 5. report and zip
    for e in order:
        report["parts"].append({"title": e["title"], "key": e["key"], "mode": e["mode"], "why": e["why"],
                                "features": e["features"], "check": e.get("check", ""),
                                "notes": e["rec"].notes if e["mode"] == "features" and e.get("rec") else []})
    report["mates"] = {"exported": len(data.mates), "skipped": data.skipped, "axes_added": len(data.axes)}
    report["seconds"] = round(time.time() - t0, 1)
    md = report_md(report, NAME, log_name)
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as z:
        z.write(macro, f"{NAME}.bas")
        z.writestr("REPORT.md", md)
        for e in order:
            if e["mode"] == "step":
                z.write(os.path.join(job, "steps", e["step"]), f"steps/{e['step']}")
        for fn in ("verify.json", "expected.json", "standin.log"):
            p = os.path.join(job, "out", fn)
            if os.path.exists(p):
                z.write(p, fn)
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as jz:
            for root, dirs, files in os.walk(job):
                dirs[:] = [d for d in dirs if d not in ("_cache", "_work", "__pycache__")]
                for fn in files:
                    full = os.path.join(root, fn)
                    jz.write(full, os.path.relpath(full, job))
        z.writestr("job.zip", buf.getvalue())
    report["macro_lines"] = text.count("\n")
    if os.environ.get("OSK_KEEP_WORK"):
        report["work"] = work
    else:
        shutil.rmtree(work, ignore_errors=True)
    return report


def _faces_truth(solid) -> list[dict]:
    from build123d import GeomType
    out = []
    for f in solid.faces():
        bb = f.bounding_box()
        box = [bb.min.X, bb.min.Y, bb.min.Z, bb.max.X, bb.max.Y, bb.max.Z]
        if f.geom_type == GeomType.PLANE:
            c = f.center()
            n = f.normal_at(c)
            out.append({"kind": "P", "g": [c.X, c.Y, c.Z, n.X, n.Y, n.Z, 0.0], "box": box})
        elif f.geom_type == GeomType.CYLINDER:
            ax = f.axis_of_rotation
            p, d = ax.position, ax.direction
            out.append({"kind": "C", "g": [p.X, p.Y, p.Z, d.X, d.Y, d.Z, f.radius], "box": box})
    for e in solid.edges():
        if e.geom_type == GeomType.LINE:
            a, b = e @ 0, e @ 1
            u = (b - a).normalized()
            out.append({"kind": "L", "g": [a.X, a.Y, a.Z, u.X, u.Y, u.Z, 0.0],
                        "box": [min(a.X, b.X), min(a.Y, b.Y), min(a.Z, b.Z), max(a.X, b.X), max(a.Y, b.Y), max(a.Z, b.Z)]})
    return out


def assembly_standin(order, data, lines, NAME, title, job, tc) -> dict:
    """Runs the OpenSketch module (every part as a STEP import) against the assembly mocks."""
    decl, code_mod = os_module(order, data, lines, NAME, title, True, all_step=True)
    text = standalone_macro(order, decl, code_mod, NAME, title, True)
    mpath = os.path.join(job, "out", "standin_asm.bas")
    open(mpath, "w").write(text)
    parts = []
    for e in order:
        sw = e["frame"].plane().to_local_coords(e["solid"]) if not e["frame"].is_identity() else e["solid"]
        parts.append({"step": f"{e['key']}.step", "title": e["title"], "faces": _faces_truth(sw)})
    truth = {"parts": parts, "comps": data.truth_comps, "mates": len(data.mates), "log_name": NAME + LOG_SUFFIX}
    jpath = os.path.join(job, "out", "standin_asm.json")
    json.dump({"truth": truth, "macro": mpath}, open(jpath, "w"))
    env = dict(os.environ)
    env.pop("PYTHONPATH", None)
    try:
        r = subprocess.run([tc["sys_py"], str(Path(__file__).parent / "sldexport_standin.py"), jpath], capture_output=True,
                           text=True, timeout=900, env=env)
        res = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception as exc:
        return {"ok": False, "summary": f"the stand-in could not run: {exc}", "runs": []}
    open(os.path.join(job, "out", "standin_asm.log"), "w").write(json.dumps(res, indent=1))
    return res


def final_checks(macro: str, tc: dict) -> dict:
    """VBA grammar and the name scan on the final file (the engine's verify saw only its own part)."""
    out = {}
    raw = open(macro, "rb").read()
    s = raw.decode("ascii", errors="replace")
    probs = []
    if raw.count(b"\n") != raw.count(b"\r\n"):
        probs.append("bare LF line endings")
    if any(b > 127 for b in raw):
        probs.append("non-ASCII characters")
    if max(len(l) for l in s.split("\r\n")) >= 1023:
        probs.append("a line of 1023 characters or more")
    if "@@" in s:
        probs.append("an unfilled placeholder")
    out["text"] = {"ok": not probs, "summary": "; ".join(probs) or f"{s.count(chr(10))} lines, CR LF, ASCII"}
    r = subprocess.run([tc["sys_py"], str(ENGINE / "check_names.py"), macro], capture_output=True, text=True)
    out["names"] = {"ok": r.returncode == 0, "summary": (r.stdout + r.stderr).strip()[-600:] or "no name hides another"}
    if tc["have"]["grammar"]:
        r = subprocess.run([tc["sys_py"], str(ENGINE / "check_grammar.py"), macro], capture_output=True, text=True, timeout=600)
        line = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith("GRAMMAR")]
        out["grammar"] = {"ok": r.returncode == 0, "summary": re.sub(r"\S*/", "", line[-1]) if line else (r.stdout + r.stderr)[-600:]}
    else:
        out["grammar"] = {"ok": None, "summary": "not run: Java or the grammar is not installed here"}
    return out


def report_md(rep: dict, NAME: str, log_name: str) -> str:
    L = [f"# {rep['title']}: SOLIDWORKS macro", ""]
    L += ["This macro has not been run in SOLIDWORKS. It checks itself while it runs and writes a log; "
          "please send the log back after the first run.", ""]
    L += ["## How to run it (SOLIDWORKS 2022)", "",
          "1. Unzip this download to a folder.",
          f"2. In SOLIDWORKS: Tools > Macro > New. Save the new macro in the unzipped folder (next to `{NAME}.bas`"
          + (" and `steps`" if any(p["mode"] == "step" for p in rep["parts"]) else "") + ").",
          f"3. Replace everything in the editor with the text of `{NAME}.bas` and press F5.",
          f"4. The log is `%TEMP%\\{log_name}`. The message at the end gives its full path.", ""]
    if rep["assembly"]:
        L += [f"The parts and the assembly are saved in `Documents\\OpenSketch\\{NAME}` (change `SAVE_FOLDER` at the top "
              "of the macro). `MAKE_ASSEMBLY = False` builds the parts only. `ONLY = \"key\"` builds one part (no assembly then).", ""]
    else:
        L += ["The part is built in a new part document and left open, unsaved.", ""]
    L += ["## Parts", "", "| Part | Key | How | Features | Check against OpenSketch |", "|---|---|---|---|---|"]
    for p in rep["parts"]:
        how = "native features" if p["mode"] == "features" else "STEP import"
        L.append(f"| {p['title']} | `{p['key']}` | {how} | {p['features'] or '-'} | {p['check'] or p['why']} |")
    L.append("")
    noted = [p for p in rep["parts"] if p.get("notes")]
    if noted:
        L += ["Differences from OpenSketch, on purpose:", ""]
        for p in noted:
            L += [f"- {p['title']}: {n}" for n in p["notes"]]
        L.append("")
    steps = [p for p in rep["parts"] if p["mode"] == "step"]
    if steps:
        L += ["Parts sent as STEP keep their exact shape and are mated like the others, but have no feature tree in "
              "SOLIDWORKS (an Imported body). Why each one:", ""]
        L += [f"- {p['title']}: {p['why']}." for p in steps]
        L.append("")
    if rep["assembly"]:
        m = rep["mates"]
        L += ["## Mates", "", f"{m['exported']} SOLIDWORKS mates are added (a hinge becomes Concentric + Coincident, and an "
              "Angle mate with limits if it has them). Each is tried with the alignment OpenSketch has first, then the others, "
              "and kept only if SOLIDWORKS reports no error and no component moves. Components start where OpenSketch's "
              "solver put them.", ""]
        if m["axes_added"]:
            L += [f"{m['axes_added']} reference axis(es) are added to parts where a mate needs an axis that has no round face.", ""]
        if m["skipped"]:
            L += ["Not exported (add by hand in SOLIDWORKS):", ""] + [f"- {s}" for s in m["skipped"]] + [""]
    L += ["## What was checked here", ""]
    eng = rep["checks"].get("engine")
    if eng:
        for k, v in eng.items():
            L.append(f"- Feature macro, {k}: {'PASS' if v['ok'] else 'FAIL'}. {v['summary']}")
            if v.get("known_fault"):
                L.append(f"  Known stand-in fault: {v['known_fault']}")
    elif any(p["mode"] == "features" for p in rep["parts"]):
        L.append("- Feature macro: the engine's own checks (sketch solver, stand-in, rebuild) were NOT run: this was a quick "
                 "export. Export again with Full checks for them.")
    for k, v in rep["checks"].get("final", {}).items():
        res = "not run" if v["ok"] is None else ("PASS" if v["ok"] else "FAIL")
        L.append(f"- Final file, {k}: {res}. {v['summary']}")
    asi = rep["checks"].get("assembly_standin")
    if asi:
        res = "not run" if asi.get("ok") is None else ("PASS" if asi["ok"] else "FAIL")
        L.append(f"- Assembly stand-in: {res}. {asi.get('summary', '')}")
        for r in asi.get("runs", []):
            L.append(f"  - {r['scenario']}: {'ok' if r['ok'] else 'FAIL: ' + '; '.join(r['problems'])}")
    L += ["", "The engine's stand-in runs the part features against mock SOLIDWORKS objects. The assembly stand-in runs "
          "OpenSketch's part of the macro (STEP import, saving, components, mates) the same way: its mocks hold each "
          "part's real faces and check every mate against them, so a mate made the wrong way round moves a component "
          "and the macro must notice and try again. Neither shows that SOLIDWORKS behaves like the mocks.", ""]
    L += ["## Not confirmed in SOLIDWORKS yet", "",
          "- `AddComponent5` with a saved part path, then `Component2.Transform2`. The macro tests which way SOLIDWORKS "
          "reads the rotation matrix with `MathPoint.MultiplyTransform` and uses that one.",
          "- `AddMate5` (obsolete in 2022 but present) with selection mark 1; faces picked in the part with "
          "`GetClosestPointOn`, then `Component2.GetCorresponding`; `SelectByID2` at the assembly point as a fallback.",
          "- `Component2.GetBodies3` (faces of a component in the assembly), `SelectionMgr.GetSelectedObjectsComponent4` "
          "and `DeSelect2`, used when `GetCorresponding` is not there.",
          "- `InsertAxis2` on two standard planes or on one straight edge, for mates on an axis that has no round face.",
          "- `GetLastFeatureAdded` to delete a mate that moved something.",
          "- `LoadFile4` with `GetImportFileData` for STEP files (with 3D Interconnect on, the body may stay linked to the STEP file).",
          "- `ModelDocExtension.SaveAs` (obsolete, present) to save parts and the assembly.",
          "- Everything listed in the engine's own list (vendor/sldmacro/reference/traps.md, \"Unconfirmed API calls\").", ""]
    L += ["## What to send back", "", f"The log `%TEMP%\\{log_name}`, whether or not anything is flagged.", ""]
    L += [f"Export took {rep.get('seconds', 0)} s.", ""]
    return "\n".join(L)
