"""STEP/EAGLE dispatch, and the "imported" and "standard" feature bodies.

An imported solid is stored inside the document as BREP text (zlib + base64), so an .osk file stays
self-contained. SOLIDWORKS calls this an "Imported" base feature: you keep modelling on top of it.

A STEP with one solid becomes a part. A STEP with several solids becomes an assembly: one part per
distinct shape (identical shapes share a part, like instances), one component per solid at its STEP
position. Like SOLIDWORKS importing a STEP assembly, no mates come in; Add Mates (AI) or the Mate
command adds them.

A .zip imports exactly one supported CAD file. EAGLE board geometry is handled by eagle.py.
"""

from __future__ import annotations

import base64
import hashlib
import os
import re
import io
import tempfile
import zipfile
import zlib
from collections import OrderedDict

import numpy as np

from . import geometry

NATIVE_SOLIDWORKS = (".sldprt", ".sldasm", ".slddrw")


class ImportError_(Exception):
    pass


# ----------------------------------------------------------------------------- BREP blobs

def encode_shape(shape) -> str:
    from build123d import export_brep
    fd, path = tempfile.mkstemp(suffix=".brep")
    os.close(fd)
    try:
        export_brep(shape, path)
        raw = open(path, "rb").read()
    finally:
        os.unlink(path)
    return base64.b64encode(zlib.compress(raw, 6)).decode("ascii")


_decoded: "OrderedDict[str, object]" = OrderedDict()


def decode_shape(data: str):
    key = hashlib.sha1(data.encode("ascii")).hexdigest()
    hit = _decoded.get(key)
    if hit is not None:
        _decoded.move_to_end(key)
        return hit
    from build123d import import_brep
    raw = zlib.decompress(base64.b64decode(data))
    fd, path = tempfile.mkstemp(suffix=".brep")
    os.close(fd)
    try:
        open(path, "wb").write(raw)
        shape = import_brep(path)
    finally:
        os.unlink(path)
    solid = geometry.solid_of(shape) if shape is not None else None
    if solid is None:
        raise geometry.FeatureError("The imported data has no solid")
    _decoded[key] = solid
    while len(_decoded) > 48:
        _decoded.popitem(last=False)
    return solid


# ----------------------------------------------------------------------------- STEP

def _read_step(data: bytes):
    from build123d import import_step
    fd, path = tempfile.mkstemp(suffix=".step")
    os.close(fd)
    try:
        open(path, "wb").write(data)
        return import_step(path)
    finally:
        os.unlink(path)


def _leaves(shape, out):
    from build123d import Solid
    kids = list(getattr(shape, "children", ()) or ())
    if isinstance(shape, Solid) or not kids:
        out.append(shape)
        return
    for k in kids:
        _leaves(k, out)


def _signature(solid) -> tuple:
    bb = solid.bounding_box()
    dims = sorted(round(v, 3) for v in (bb.size.X, bb.size.Y, bb.size.Z))
    return (round(solid.volume, 2), round(solid.area, 2), len(solid.faces()), len(solid.edges()), tuple(dims))


def _same_when_placed(local, solid) -> bool:
    """True when the part's local shape, moved by this solid's own location, lands where this solid is.

    The signature ignores position and handedness, so on its own it would make a mirrored left/right pair, or two
    copies whose geometry is already in world coordinates (identity locations, as FreeCAD and build123d write
    them), one part shown twice in the first one's place."""
    placed = local.moved(solid.location)
    a, b = placed.bounding_box(), solid.bounding_box()
    tol = 1e-3 + 1e-6 * max(b.diagonal, 1.0)
    corners = [*tuple(a.min), *tuple(a.max)], [*tuple(b.min), *tuple(b.max)]
    return (all(abs(x - y) <= tol for x, y in zip(*corners))
            and (placed.center() - solid.center()).length <= tol)


GENERIC_LABELS = re.compile(r"^(open ?cascade step translator.*|step translator.*|untitled|unnamed|none|solid\d*|part\d*|body\d*)$",
                            re.IGNORECASE)


def _clean_name(label: str | None, fallback: str) -> str:
    s = (label or "").strip()
    s = re.sub(r"\s+", " ", s)
    if GENERIC_LABELS.match(re.sub(r"[_\s]+", " ", s)):  # what OpenCascade, FreeCAD or build123d write when nothing was named
        s = ""
    return s[:60] or fallback


def _slug(name: str, used: set) -> str:
    base = re.sub(r"[^a-z0-9]+", "", name.lower())[:24] or "part"
    if base[0].isdigit():
        base = "p" + base
    s, k = base, 2
    while s in used:
        s, k = f"{base}{k}", k + 1
    used.add(s)
    return s


def import_part_feature(solid, name: str, source: str) -> dict:
    return {"id": "imp1", "type": "import", "name": "Imported1", "format": "brep",
            "data": encode_shape(solid), "source": source, "label": name}


MAX_ARCHIVE_FILE_BYTES = 64 * 1024 * 1024


def _from_zip(data: bytes, filename: str, *, include_eagle=False) -> tuple[bytes, str]:
    """Read exactly one supported CAD file; never silently choose between models."""
    try:
        zf = zipfile.ZipFile(io.BytesIO(data))
    except zipfile.BadZipFile as exc:
        raise ImportError_(f"{filename} is not a readable zip file.") from exc
    with zf:
        if len(zf.infolist()) > 2000:
            raise ImportError_(f"{filename} has too many archive entries. Unzip it and open one CAD file.")
        entries = [i for i in zf.infolist() if not i.is_dir()
                   and not any(p.startswith(".") or p == "__MACOSX" for p in i.filename.split("/"))]
        extensions = (".step", ".stp", ".brd") if include_eagle else (".step", ".stp")
        models = [i for i in entries if os.path.splitext(i.filename)[1].lower() in extensions]
        if len(models) == 1:
            entry = models[0]
            if entry.file_size > MAX_ARCHIVE_FILE_BYTES:
                raise ImportError_("The CAD file inside the archive exceeds the 64 MiB import limit.")
            try:
                with zf.open(entry) as stream:
                    raw = stream.read(MAX_ARCHIVE_FILE_BYTES + 1)
            except (zipfile.BadZipFile, RuntimeError, NotImplementedError) as exc:
                raise ImportError_(f"Could not read the CAD file inside {filename}: {exc}") from exc
            if len(raw) > MAX_ARCHIVE_FILE_BYTES:
                raise ImportError_("The CAD file inside the archive exceeds the 64 MiB import limit.")
            return raw, os.path.basename(entry.filename)
        if len(models) > 1:
            listed = ", ".join(os.path.basename(i.filename) for i in models[:6]) + (" ..." if len(models) > 6 else "")
            kind = "STEP" if all(os.path.splitext(i.filename)[1].lower() in (".step", ".stp") for i in models) else "supported CAD"
            raise ImportError_(f"{filename} holds {len(models)} {kind} files ({listed}). Unzip it and open the one you want.")
        native = [i for i in entries if os.path.splitext(i.filename)[1].lower() in NATIVE_SOLIDWORKS]
        if native:
            raise ImportError_(
                f"{filename} only holds SOLIDWORKS files ({os.path.basename(native[0].filename)}). Download the STEP version "
                "instead, or in SOLIDWORKS use File > Save As > STEP AP214 (*.step).")
        suffix = " or an EAGLE board (.brd)" if include_eagle else ""
        raise ImportError_(f"{filename} has no STEP file inside (.step or .stp){suffix}.")


def import_file(data: bytes, filename: str = "model.step") -> dict:
    """Import STEP, an EAGLE XML board, or a ZIP containing exactly one of those."""
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".zip":
        data, filename = _from_zip(data, filename, include_eagle=True)
        ext = os.path.splitext(filename)[1].lower()
    if ext == ".brd":
        from .eagle import import_eagle
        return import_eagle(data, filename)
    if ext in (".step", ".stp", "") or ext in NATIVE_SOLIDWORKS:
        return import_step(data, filename)
    raise ImportError_(f"Cannot import {ext} files. Use STEP (.step or .stp), EAGLE XML (.brd), or a .zip holding one.")


def import_step(data: bytes, filename: str = "model.step") -> dict:
    """Return a part or assembly document for a STEP file, or a zip holding one."""
    ext = os.path.splitext(filename)[1].lower()
    if ext == ".zip":
        data, filename = _from_zip(data, filename)
        ext = os.path.splitext(filename)[1].lower()
    if ext in NATIVE_SOLIDWORKS:
        raise ImportError_(
            "SOLIDWORKS files (.sldprt, .sldasm) are a closed format that only SOLIDWORKS can read. "
            "In SOLIDWORKS use File > Save As > STEP AP214 (*.step), then open the STEP file here.")
    if ext not in (".step", ".stp", ""):
        raise ImportError_(f"Cannot import {ext} files. Use STEP (.step or .stp), or a .zip holding one.")
    try:
        root = _read_step(data)
    except Exception as exc:  # OCC reader errors
        raise ImportError_(f"Could not read the STEP file: {str(exc).strip() or type(exc).__name__}. Try exporting it again as STEP AP214.") from exc
    stem = os.path.splitext(os.path.basename(filename))[0] or "Imported"
    solids = list(root.solids()) if root is not None else []
    if not solids:
        raise ImportError_("The STEP file has no solid bodies (surfaces and wireframes are not supported yet).")
    leaves = []
    _leaves(root, leaves)
    labels = [getattr(l, "label", "") for l in leaves] if len(leaves) == len(solids) else [""] * len(solids)
    if len(solids) == 1:
        s = solids[0]
        name = _clean_name(labels[0] or getattr(root, "label", ""), stem)
        return {"version": 1, "type": "part", "name": name, "units": "mm",
                "features": [import_part_feature(s, name, os.path.basename(filename))], "rollback": None, "seq": 10}
    from . import assembly
    from build123d import Location
    asm = assembly.new_assembly(_clean_name(getattr(root, "label", ""), stem))
    groups: list[tuple[tuple, str, object]] = []
    used: set = set()
    counts: dict[str, int] = {}
    for i, s in enumerate(solids):
        local = s.located(Location())
        sig = _signature(local)
        pid = next((p for g, p, shape in groups if g == sig and _same_when_placed(shape, s)), None)
        name = _clean_name(labels[i], f"Body{i + 1}")
        if pid is None:
            pid = _slug(name, used)
            groups.append((sig, pid, local))
            asm["parts"][pid] = {"version": 1, "type": "part", "name": name, "units": "mm",
                                 "features": [import_part_feature(local, name, os.path.basename(filename))],
                                 "rollback": None, "seq": 10}
        counts[pid] = counts.get(pid, 0) + 1
        R, t = _matrix(s.location)
        cid = f"c{i + 1}"
        comp = {"id": cid, "part": pid, "name": f"{asm['parts'][pid]['name']}<{counts[pid]}>",
                "position": [round(float(v), 6) for v in t], "rotation": assembly.euler_of(R)}
        if i == 0:
            comp["fixed"] = True
        asm["components"].append(comp)
        asm["sequence"].append(cid)
    asm["seq"] = len(solids) + 1
    asm["source"] = os.path.basename(filename)
    return asm


def _matrix(loc):
    trsf = loc.wrapped.Transformation()
    R = np.array([[trsf.Value(r, c) for c in (1, 2, 3)] for r in (1, 2, 3)])
    t = np.array([trsf.Value(r, 4) for r in (1, 2, 3)])
    return R, t


# ----------------------------------------------------------------------------- standard parts (Toolbox)

STANDARD = {
    # kind: (module, class, required args, description)
    "socket_head_cap_screw": ("bd_warehouse.fastener", "SocketHeadCapScrew", ("size", "length"), "ISO 4762 socket head cap screw"),
    "hex_head_screw": ("bd_warehouse.fastener", "HexHeadScrew", ("size", "length"), "ISO 4014 hex head screw"),
    "counter_sunk_screw": ("bd_warehouse.fastener", "CounterSunkScrew", ("size", "length"), "ISO 10642 countersunk screw"),
    "button_head_screw": ("bd_warehouse.fastener", "ButtonHeadScrew", ("size", "length"), "ISO 7380 button head screw"),
    "set_screw": ("bd_warehouse.fastener", "SetScrew", ("size", "length"), "ISO 4026 set screw"),
    "hex_nut": ("bd_warehouse.fastener", "HexNut", ("size",), "ISO 4032 hex nut"),
    "plain_washer": ("bd_warehouse.fastener", "PlainWasher", ("size",), "ISO 7089 plain washer"),
    "ball_bearing": ("bd_warehouse.bearing", "SingleRowDeepGrooveBallBearing", ("size",), "Deep groove ball bearing (SKT), size bore-OD-width"),
}
DEFAULT_TYPE = {
    "SocketHeadCapScrew": "iso4762", "HexHeadScrew": "iso4014", "CounterSunkScrew": "iso10642",
    "ButtonHeadScrew": "iso7380_1", "SetScrew": "iso4026", "HexNut": "iso4032", "PlainWasher": "iso7089",
    "SingleRowDeepGrooveBallBearing": "SKT",
}

_std_cache: "OrderedDict[str, object]" = OrderedDict()


def standard_catalog() -> dict:
    """Kinds and their available sizes."""
    import importlib
    out = {}
    for kind, (mod, cls, req, desc) in STANDARD.items():
        try:
            C = getattr(importlib.import_module(mod), cls)
            sizes = list(C.sizes(DEFAULT_TYPE[cls]))
        except Exception:
            continue
        out[kind] = {"description": desc, "args": list(req), "sizes": sizes}
    return out


def build_standard(feat: dict):
    """Solid for a standard (Toolbox) part. Screws run down -Z from the head's underside at Z=0 in
    bd_warehouse; OpenSketch turns them so the axis is Y (up, as SOLIDWORKS) with the head on top."""
    import importlib
    from build123d import Axis
    kind = feat.get("kind")
    if kind not in STANDARD:
        raise geometry.FeatureError(f"Unknown standard part kind {kind!r}")
    mod, cls, req, _ = STANDARD[kind]
    args = {k: feat.get(k) for k in req}
    key = repr((kind, sorted(args.items())))
    hit = _std_cache.get(key)
    if hit is not None:
        return hit
    C = getattr(importlib.import_module(mod), cls)
    try:
        if cls == "SingleRowDeepGrooveBallBearing":
            s = C(str(args["size"]), DEFAULT_TYPE[cls])
        elif "length" in req:
            s = C(str(args["size"]), float(args["length"]), DEFAULT_TYPE[cls], simple=True)
        else:
            s = C(str(args["size"]), DEFAULT_TYPE[cls], simple=True)
    except Exception as exc:
        raise geometry.FeatureError(f"Standard part {kind} {args}: {exc}") from exc
    shape = geometry.solid_of(s)
    if shape is None:
        from build123d import Compound
        shape = Compound(children=list(s.solids()))
    shape = shape.rotate(Axis.X, -90)  # Z axis -> Y axis: shank along -Y, head above Y=0
    _std_cache[key] = shape
    while len(_std_cache) > 64:
        _std_cache.popitem(last=False)
    return shape


def standard_part_doc(kind: str, **args) -> dict:
    mod, cls, req, desc = STANDARD[kind]
    size = args.get("size")
    name = {"socket_head_cap_screw": "Socket Head Cap Screw", "hex_head_screw": "Hex Head Screw",
            "counter_sunk_screw": "Countersunk Screw", "button_head_screw": "Button Head Screw",
            "set_screw": "Set Screw", "hex_nut": "Hex Nut", "plain_washer": "Washer",
            "ball_bearing": "Ball Bearing"}[kind]
    label = f"{name} {size}" + (f"x{args['length']:g}" if "length" in args and args["length"] else "")
    feat = {"id": "std1", "type": "standard", "name": "Toolbox1", "kind": kind, **{k: args[k] for k in req}}
    return {"version": 1, "type": "part", "name": label, "units": "mm", "features": [feat], "rollback": None,
            "seq": 10, "appearance": "#9aa3ad", "material": {"name": "AISI 304", "density": 8.0e-6},
            "standard": {"kind": kind, "description": desc, **{k: args[k] for k in req}}}
