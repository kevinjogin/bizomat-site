"""Review pages: a frozen, shareable record of a part or assembly at one version, like the Lavilock reviews.

`build(rec, compare=None, title=None, notes=None)` returns the page data:
- parts: each part's mesh (triangles and edges, int16 with a per-part scale, base64) and whether it changed
  since the compared version;
- components: their solved pose at rest;
- sliders: one per joint with travel (hinge with angle limits, limit_distance, limit_angle). The mate's
  limits are pinned to a sequence of values and the assembly is solved at each, warm-started from the
  previous pose, so the page only interpolates between real solver results (no solving in the browser);
- old: the compared version's changed parts at their old poses (drawn as a ghost);
- checks: mate and rebuild errors, clashes at rest and through each slider's travel, the closest approach
  of the moving parts to everything else, and how far each joint really reached;
- changes: the version summaries between the compared version and this one, plus a per-part note.

`page(data)` renders the self-contained HTML (YZ Default design system; three.js from cdnjs).
"""

from __future__ import annotations

import base64
import copy
import re
import secrets
import threading
import html
import json
import math
import time
from pathlib import Path

import numpy as np

from . import assembly, geometry

STEPS = 24          # solver poses per slider
CHECK_EVERY = 4     # clash check on every 4th pose (and both ends)
MAX_PAIRS = 400     # clash pairs per pose, moving parts first
CLASH_MM3 = 0.01    # smaller overlaps are parts touching (solver and tessellation tolerance), not clashes
TEMPLATE = Path(__file__).parent / "templates" / "review.html"


class ReviewError(Exception):
    pass


# ----------------------------------------------------------------------------- meshes

def _b64(a: np.ndarray) -> str:
    return base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()


def pack_mesh(mesh: dict) -> dict:
    """One geometry per part: positions and edge segments as int16 times `s` (mm), indices uint16/uint32."""
    pos, idx, segs = [], [], []
    base = 0
    for f in mesh.get("faces", []):
        p = np.asarray(f["positions"], float).reshape(-1, 3)
        pos.append(p)
        idx.append(np.asarray(f["indices"], np.int64) + base)
        base += len(p)
    for e in mesh.get("edges", []):
        p = np.asarray(e["points"], float).reshape(-1, 3)
        if len(p) >= 2:
            segs.append(np.repeat(p, 2, axis=0)[1:-1])
    P = np.concatenate(pos) if pos else np.zeros((0, 3))
    I = np.concatenate(idx) if idx else np.zeros(0, np.int64)
    E = np.concatenate(segs) if segs else np.zeros((0, 3))
    m = max(float(np.abs(P).max()) if len(P) else 0.0, float(np.abs(E).max()) if len(E) else 0.0, 1e-6)
    s = m / 32000.0
    big = base > 65535
    return {"s": s, "p": _b64(np.round(P / s).astype("<i2")), "i": _b64(I.astype("<u4" if big else "<u2")),
            "e": _b64(np.round(E / s).astype("<i2")), "big": big, "tris": int(len(I) // 3)}


def _mat(pose: assembly.Pose) -> list[float]:
    return [round(v, 6) for v in pose.matrix()]


# ----------------------------------------------------------------------------- joints

def _measure(m: dict, poses: dict) -> float | None:
    """The current value a limit mate measures (deg or mm), with the solver's own conventions."""
    t = m["type"]
    refs = m.get("angle_refs") if t == "hinge" else m.get("refs")
    if not refs or len(refs) != 2:
        return None
    a, b = (assembly.ref_world(r, poses) for r in refs)
    if t in ("hinge", "limit_angle"):
        if a[2] is None or b[2] is None:
            return None
        return math.degrees(math.acos(max(-1.0, min(1.0, float(a[2] @ b[2])))))
    order = {"plane": 0, "axis": 1, "point": 2}
    if order[a[0]] > order[b[0]]:
        a, b = b, a
    if a[0] == "plane" and b[0] == "plane":
        return float((b[1] - a[1]) @ a[2])
    return float(np.linalg.norm(b[1] - a[1]))


def _limits(m: dict) -> tuple[float | None, float | None]:
    if m["type"] == "hinge":
        return m.get("angle_min"), m.get("angle_max")
    return m.get("min"), m.get("max")


def _pin(m: dict, v: float) -> None:
    if m["type"] == "hinge":
        m["angle_min"] = m["angle_max"] = v
    else:
        m["min"] = m["max"] = v


def joints(asm: dict) -> list[dict]:
    """Mates with a travel to show: hinge with both angle limits, limit_distance, limit_angle."""
    out = []
    for m in asm.get("mates", []):
        if m.get("suppressed"):
            continue
        lo, hi = _limits(m)
        if m["type"] == "hinge" and not m.get("angle_refs"):
            continue
        if m["type"] in ("hinge", "limit_distance", "limit_angle") and lo is not None and hi is not None and hi > lo:
            out.append(m)
    return out


def _moving(asm: dict, mate_id: str) -> set[str]:
    """Components linked to the mate's components through mates, not through fixed components."""
    fixed = {c["id"] for c in asm.get("components", []) if c.get("fixed")}
    adj: dict[str, set] = {}
    for m in asm.get("mates", []):
        if m.get("suppressed"):
            continue
        cs = {r.get("component") for k in assembly.REF_KEYS for r in m.get(k) or [] if r.get("component")}
        for a in cs:
            adj.setdefault(a, set()).update(cs - {a})
    m = next(x for x in asm["mates"] if x["id"] == mate_id)
    start = {r.get("component") for k in assembly.REF_KEYS for r in m.get(k) or [] if r.get("component")} - fixed
    seen, todo = set(start), list(start)
    while todo:
        for n in adj.get(todo.pop(), ()):
            if n not in seen and n not in fixed:
                seen.add(n)
                todo.append(n)
    return seen


def _travel(asm: dict, m: dict, built: dict, size: float, rest_poses: dict) -> dict:
    """Solve the assembly with the joint pinned at STEPS values from its lower to its upper limit."""
    lo, hi = (float(v) for v in _limits(m))
    unit = "°" if m["type"] in ("hinge", "limit_angle") else "mm"
    rest = _measure(m, rest_poses)
    rest = min(hi, max(lo, rest)) if rest is not None else lo
    values = [lo + (hi - lo) * k / (STEPS - 1) for k in range(STEPS)]
    moving = _moving(asm, m["id"])
    solids = {c["id"]: built[c["part"]]["solid"] for c in asm["components"] if c.get("part") in built}
    frames, reached, errors = [], [], []

    def solve_at(doc, v):
        d = copy.deepcopy(doc)
        _pin(next(x for x in d["mates"] if x["id"] == m["id"]), v)
        sol = assembly.solve(d, size, solids)
        for c in d["components"]:
            if c["id"] in sol["poses"]:
                P = sol["poses"][c["id"]]
                c["position"], c["rotation"] = [float(x) for x in P.t], assembly.euler_of(P.R)
        bad = [k for k, s in sol["mates"].items() if s.get("state") == "error"]
        return d, sol, bad

    # walk out from the rest pose both ways, so each solve starts next to its answer
    order = sorted(range(STEPS), key=lambda k: abs(values[k] - rest))
    below = [k for k in range(STEPS) if values[k] < rest][::-1]
    above = [k for k in range(STEPS) if values[k] >= rest]
    results: dict[int, tuple] = {}
    for seq in (above, below):
        doc = asm
        for k in seq:
            doc, sol, bad = solve_at(doc, values[k])
            results[k] = (sol, bad, doc)
    del order
    # only the parts that really move (mated parts that stay put, like guide columns, are left out)
    moved = set()
    for cid in moving:
        ms = [np.array(_mat(results[k][0]["poses"][cid])) for k in range(STEPS) if cid in results[k][0]["poses"]]
        # 1 micron or 1e-5 rad: the solver leaves a few hundredths of a micron of noise on parts that stay
        if ms and max(max(float(np.abs(x[[3, 7, 11]] - ms[0][[3, 7, 11]]).max()) / 1e-3,
                          float(np.abs(x[[0, 1, 2, 4, 5, 6, 8, 9, 10]] - ms[0][[0, 1, 2, 4, 5, 6, 8, 9, 10]]).max()) / 1e-5)
                      for x in ms) > 1:
            moved.add(cid)
    moving = moved
    for k in range(STEPS):
        sol, bad, doc = results[k]
        frames.append({cid: _mat(sol["poses"][cid]) for cid in moving if cid in sol["poses"]})
        got = _measure(next(x for x in doc["mates"] if x["id"] == m["id"]), sol["poses"])
        reached.append(round(got, 4) if got is not None else None)
        if bad:
            errors.append({"value": round(values[k], 4), "mates": bad})
    label = m.get("name") or m["id"]
    return {"id": m["id"], "name": label, "type": m["type"], "unit": unit, "min": lo, "max": hi,
            "rest": round(rest, 4), "values": [round(v, 4) for v in values], "frames": frames,
            "moving": sorted(moving), "reached": reached, "errors": errors, "_docs": [results[k][2] for k in range(STEPS)]}


# ----------------------------------------------------------------------------- checks

def _placed(asm: dict, built: dict, poses: dict) -> dict:
    out = {}
    for c in asm.get("components", []):
        if c.get("suppressed") or c.get("hidden") or c.get("part") not in built or built[c["part"]]["solid"] is None:
            continue
        P = poses.get(c["id"]) or assembly.Pose.of(c)
        out[c["id"]] = built[c["part"]]["solid"].moved(assembly.location_of(P))
    return out


def _bbox_overlap(a, b, gap=0.0) -> bool:
    ba, bb = a.bounding_box(), b.bounding_box()
    return not (ba.max.X + gap < bb.min.X or bb.max.X + gap < ba.min.X or ba.max.Y + gap < bb.min.Y or
                bb.max.Y + gap < ba.min.Y or ba.max.Z + gap < bb.min.Z or bb.max.Z + gap < ba.min.Z)


def _clashes(placed: dict, only: set | None = None) -> list[dict]:
    ids = sorted(placed)
    pairs = [(a, b) for i, a in enumerate(ids) for b in ids[i + 1:] if only is None or a in only or b in only]
    out = []
    for a, b in pairs[:MAX_PAIRS]:
        if not _bbox_overlap(placed[a], placed[b]):
            continue
        try:
            common = placed[a] & placed[b]
            v = common.volume if common is not None else 0.0
        except Exception:
            continue
        if v > CLASH_MM3:
            out.append({"a": a, "b": b, "volume_mm3": round(v, 3)})
    return out


def _closest(placed: dict, moving: set) -> dict | None:
    best = None
    for a in sorted(moving):
        if a not in placed:
            continue
        for b in sorted(placed):
            if b in moving or not _bbox_overlap(placed[a], placed[b], gap=20.0):
                continue
            try:
                d = placed[a].distance_to(placed[b])
            except Exception:
                continue
            if d > 1e-4 and (best is None or d < best["mm"]):  # touching parts (a lid on its base) are not a gap
                best = {"a": a, "b": b, "mm": round(d, 3)}
    return best


# ----------------------------------------------------------------------------- compare

def _feature_changes(old: dict, new: dict) -> str:
    of = {f["id"]: f for f in old.get("features", [])}
    nf = {f["id"]: f for f in new.get("features", [])}
    name = lambda f: f.get("name") or f["id"]  # noqa: E731
    added = [name(nf[k]) for k in nf if k not in of]
    removed = [name(of[k]) for k in of if k not in nf]
    edited = [name(nf[k]) for k in nf if k in of and nf[k] != of[k]]
    bits = []
    if added:
        bits.append("added " + ", ".join(added))
    if edited:
        bits.append("changed " + ", ".join(edited))
    if removed:
        bits.append("removed " + ", ".join(removed))
    return "; ".join(bits) or "changed (properties)"


def _as_asm(doc: dict) -> dict:
    if assembly.is_assembly(doc):
        return doc
    asm = assembly.part_as_assembly(doc, name=doc.get("name") or "Part")
    for c in asm["components"]:
        c["fixed"] = True
    return asm


# ----------------------------------------------------------------------------- build

def build(rec: dict, compare: dict | None = None, title: str | None = None, notes: str | None = None,
          history: list[dict] | None = None) -> dict:
    """Page data for a stored record (and an older record to compare against)."""
    t0 = time.time()
    doc = rec["doc"]
    is_part = not assembly.is_assembly(doc)
    asm = _as_asm(copy.deepcopy(doc))
    if not asm.get("components"):
        raise ReviewError("Nothing to review: the document has no body or components yet.")
    built = {pid: assembly.build_part(p) for pid, p in asm.get("parts", {}).items()}
    res = assembly.regen_assembly(asm)
    asm = assembly.apply_solution(asm, res)  # mate refs moved onto the rebuilt faces, as the app does
    size = assembly._size(asm, built)
    rest = {c["id"]: assembly.Pose(np.array(c["matrix"]).reshape(4, 4)[:3, :3], np.array(c["position"]))
            for c in res["components"]}

    old_asm = _as_asm(copy.deepcopy(compare["doc"])) if compare else None
    old_keys = {pid: assembly.part_key(p) for pid, p in (old_asm or {}).get("parts", {}).items()}

    parts = {}
    for pid, p in asm["parts"].items():
        b = built[pid]
        info = {"name": p.get("name") or pid, "appearance": p.get("appearance"), "mesh": pack_mesh(b["mesh"]),
                "volume_mm3": round(b.get("volume") or 0.0, 3)}
        if p.get("material"):
            info["material"] = p["material"].get("name")
        if old_asm is not None:
            if pid not in old_keys:
                info["changed"] = "New part."
            elif old_keys[pid] != b["key"]:
                ch = _feature_changes(old_asm["parts"][pid], p)
                info["changed"] = ch[:1].upper() + ch[1:] + "."
        parts[pid] = info

    comps = []
    for c in asm["components"]:
        if c.get("suppressed"):
            continue
        comps.append({"id": c["id"], "part": c["part"], "name": c.get("name") or c["id"],
                      "matrix": _mat(rest.get(c["id"]) or assembly.Pose.of(c)), "fixed": bool(c.get("fixed")),
                      "hidden": bool(c.get("hidden"))})

    old = []
    if old_asm is not None:
        old_res = assembly.regen_assembly(old_asm)
        old_built = {pid: assembly.build_part(p) for pid, p in old_asm.get("parts", {}).items()}
        for c in old_res["components"]:
            pid = c["part"]
            if pid in old_built and (pid not in parts or parts[pid].get("changed")) and old_built[pid]["solid"] is not None:
                old.append({"mesh": pack_mesh(old_built[pid]["mesh"]), "matrix": [round(v, 6) for v in c["matrix"]]})

    # checks at rest
    checks: dict = {"errors": [], "clashes_rest": [], "joints": []}
    for pid, p in res["parts"].items():
        for s in p["status"]:
            if s["state"] == "error":
                checks["errors"].append(f"{parts[pid]['name']}: {s['id']} {s.get('message', '')}".strip())
    for m in res["mates"]:
        if m["state"] == "error":
            checks["errors"].append(f"Mate {m['id']}: {m.get('message', 'error')}")
    placed_rest = _placed(asm, built, rest)
    checks["clashes_rest"] = _clashes(placed_rest)

    sliders = []
    for m in joints(asm):
        tr = _travel(asm, m, built, size, rest)
        docs = tr.pop("_docs")
        clashes, closest = [], None
        for k in range(STEPS):
            if k % CHECK_EVERY and k not in (0, STEPS - 1):
                continue
            poses = {**rest, **{cid: assembly.Pose(np.array(M).reshape(4, 4)[:3, :3], np.array(M).reshape(4, 4)[:3, 3])
                                for cid, M in tr["frames"][k].items()}}
            placed = _placed(docs[k], built, poses)
            for cl in _clashes(placed, set(tr["moving"])):
                clashes.append({**cl, "value": tr["values"][k]})
            c = _closest(placed, set(tr["moving"]))
            if c and (closest is None or c["mm"] < closest["mm"]):
                closest = {**c, "value": tr["values"][k]}
        lo_got = next((v for v in tr["reached"] if v is not None), None)
        hi_got = next((v for v in reversed(tr["reached"]) if v is not None), None)
        checks["joints"].append({"id": tr["id"], "name": tr["name"], "unit": tr["unit"], "clashes": clashes,
                                 "closest": closest, "unreached": tr["errors"],
                                 "reached": [lo_got, hi_got], "poses_checked": len(range(0, STEPS, CHECK_EVERY)) + 1})
        sliders.append(tr)

    names = {c["id"]: c["name"] for c in comps}
    changes = []
    if compare and history:
        changes = [h for h in history if compare["version"] < h["version"] <= rec["version"]]
        changes = [{"version": h["version"], "by": h.get("by"), "summary": h.get("summary")} for h in sorted(changes, key=lambda h: h["version"])]
    return {"title": title or rec.get("name") or "Review", "name": rec.get("name"), "doc_id": rec.get("id"),
            "version": rec.get("version"), "compare": compare["version"] if compare else None,
            "kind": "part" if is_part else "assembly", "date": time.strftime("%d/%m/%Y"),
            "notes": notes or "", "parts": parts, "components": comps, "names": names, "sliders": sliders,
            "old": old, "checks": checks, "changes": changes, "bbox": res.get("bbox"),
            "build_seconds": round(time.time() - t0, 2)}


def page(data: dict) -> str:
    """The self-contained review page."""
    body = json.dumps(data, separators=(",", ":")).replace("</", "<\\/")
    tpl = TEMPLATE.read_text()
    return (tpl.replace("{{TITLE}}", html.escape(data["title"]))
               .replace("{{DATA}}", body))


# ----------------------------------------------------------------------------- stored reviews (share links)
# Each published review is one frozen HTML file in <data>/reviews/<token>.html, served at /review/<token>
# without the OpenSketch password: the unguessable token is the key, the page is read-only and holds no
# credential, and it can be deleted. reviews.json lists them (doc, versions, title, when).

TOKEN = re.compile(r"[A-Za-z0-9_-]{20,64}")
_lock = threading.Lock()


def _dir() -> Path:
    from . import store
    d = store.data_dir() / "reviews"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _index() -> list[dict]:
    try:
        return json.loads((_dir() / "reviews.json").read_text())
    except (OSError, ValueError):
        return []


def _write_index(items: list[dict]) -> None:
    tmp = _dir() / "reviews.json.tmp"
    tmp.write_text(json.dumps(items, indent=1))
    tmp.replace(_dir() / "reviews.json")


def share_url(token: str, base: str | None = None) -> str:
    from . import auth
    return f"{(base or auth.public_url()).rstrip('/')}/review/{token}"


def publish(doc_id: str, compare_version: int | None = None, title: str | None = None,
            notes: str | None = None, by: str = "you", base: str | None = None) -> dict:
    """Build and store a review of a stored document's current version. Returns its record with `url`."""
    from . import store
    rec = store.get(doc_id)
    compare = None
    if compare_version is not None:
        if int(compare_version) >= rec["version"]:
            raise ReviewError(f"Compare with an earlier version than {rec['version']}.")
        try:
            compare = store.get_version(doc_id, int(compare_version))
        except store.NotFound:
            raise ReviewError(f"Version {compare_version} is not kept (only the last {store.KEEP} are).") from None
    history = [{"version": rec["version"], "by": rec.get("by"), "summary": rec.get("summary")}] + store.versions(doc_id)
    data = build(rec, compare, title, notes, history)
    token = secrets.token_urlsafe(24)
    raw = page(data).encode()
    (_dir() / f"{token}.html").write_bytes(raw)
    item = {"token": token, "doc_id": doc_id, "name": rec.get("name"), "title": data["title"],
            "version": rec["version"], "compare": compare_version, "by": by, "created": time.time(),
            "size_kb": len(raw) // 1024}
    with _lock:
        _write_index([item] + _index())
    j = data["checks"]["joints"]
    summary = {"errors": len(data["checks"]["errors"]), "clashes_as_shown": len(data["checks"]["clashes_rest"]),
               "joints": [{"name": x["name"], "reached": x["reached"], "unit": x["unit"], "clashes": len(x["clashes"]),
                           "smallest_gap_mm": (x["closest"] or {}).get("mm")} for x in j],
               "changed_parts": [p["name"] for p in data["parts"].values() if p.get("changed")]}
    return dict(item, url=share_url(token, base), checks=summary)


def listing(doc_id: str | None = None, base: str | None = None) -> list[dict]:
    return [dict(i, url=share_url(i["token"], base)) for i in _index() if doc_id is None or i["doc_id"] == doc_id]


def html_path(token: str) -> Path | None:
    if not TOKEN.fullmatch(token or ""):
        return None
    p = _dir() / f"{token}.html"
    return p if p.exists() else None


def delete(token: str) -> bool:
    p = html_path(token)
    with _lock:
        items = _index()
        left = [i for i in items if i["token"] != token]
        if len(left) != len(items):
            _write_index(left)
    if p:
        p.unlink()
    return p is not None
