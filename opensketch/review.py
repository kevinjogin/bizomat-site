"""Motion Review: joints driven through their travel, checks, and frozen share links.

In the app, Evaluate > Motion Review drives each joint with the browser's mate solver and asks
`/api/review/check` (`checks(doc)`) for the checks. File > Publish Review stores a snapshot that the same
app opens read-only at /review/<token>.

`build(rec, compare=None, title=None, notes=None, history=None, bodies=True)` returns:
- doc: the solved assembly (a part is wrapped as one fixed component); with bodies, the parts' features
  are left out (the link shares the shapes, not the model), and result: what /api/regen returns for it,
  with every part's mesh, so the read-only app solves joints itself;
- parts: name, whether it changed since the compared version (and how), volume, material;
- joints: one per mate with travel (hinge with angle limits, limit_distance, limit_angle): its range,
  rest value, the components it moves and how far it really reached. The mate's limits are pinned at
  STEPS values and the assembly is solved at each, warm-started outward from the rest pose;
- old: the compared version's changed parts at their old poses (a ghost);
- checks: mate and rebuild errors, clashes at rest and through each joint's travel, the smallest gap of
  the moving parts, and declared contacts (`contacts` in the document) that stop touching;
- changes: the version summaries between the compared version and this one.
"""

from __future__ import annotations

import gzip
import copy
import re
import secrets
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
CONTACT_MM = 0.05   # a declared contact further apart than this is reported as not touching


class ReviewError(Exception):
    pass


# ----------------------------------------------------------------------------- poses

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


def _gap(placed: dict, a: str, b: str) -> float | None:
    if a not in placed or b not in placed:
        return None
    try:
        return float(placed[a].distance_to(placed[b]))
    except Exception:
        return None


def _contact_report(k: dict, unit: str | None, names: dict) -> dict:
    return {"id": k.get("id"), "name": k.get("name") or f"{names.get(k['a'], k['a'])} on {names.get(k['b'], k['b'])}",
            "a": k["a"], "b": k["b"], "joint": k.get("joint"), "from": k.get("from"), "to": k.get("to"), "unit": unit,
            "checked": 0, "largest_gap_mm": None, "apart": []}


def _contact_add(rep: dict, gap: float | None, value=None) -> None:
    if gap is None:
        return
    rep["checked"] += 1
    if rep["largest_gap_mm"] is None or gap > rep["largest_gap_mm"]:
        rep["largest_gap_mm"] = round(gap, 4)
    if gap > CONTACT_MM:
        rep["apart"].append({"value": value, "gap_mm": round(gap, 3)})


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

def _viewer_doc(asm: dict) -> dict:
    """The solved assembly without the parts' features: the read-only app needs shapes, not the model."""
    d = copy.deepcopy(asm)
    for pid, p in d.get("parts", {}).items():
        d["parts"][pid] = {k: p[k] for k in ("name", "appearance", "material") if k in p}
        d["parts"][pid].update(type="part", features=[])
    for k in ("requests", "parameters"):
        d.pop(k, None)
    return d


def build(rec: dict, compare: dict | None = None, title: str | None = None, notes: str | None = None,
          history: list[dict] | None = None, bodies: bool = True) -> dict:
    """Review data for a stored record (and an older record to compare against)."""
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
        info = {"name": p.get("name") or pid, "volume_mm3": round(b.get("volume") or 0.0, 3)}
        if p.get("material"):
            info["material"] = p["material"].get("name")
        if old_asm is not None:
            if pid not in old_keys:
                info["changed"] = "New part."
            elif old_keys[pid] != b["key"]:
                ch = _feature_changes(old_asm["parts"][pid], p)
                info["changed"] = ch[:1].upper() + ch[1:] + "."
        parts[pid] = info

    old = []
    if old_asm is not None and bodies:
        old_res = assembly.regen_assembly(old_asm)
        old_built = {pid: assembly.build_part(p) for pid, p in old_asm.get("parts", {}).items()}
        for c in old_res["components"]:
            pid = c["part"]
            if pid in old_built and (pid not in parts or parts[pid].get("changed")) and old_built[pid]["solid"] is not None:
                old.append({"part": pid, "body": old_built[pid]["mesh"], "matrix": [round(v, 6) for v in c["matrix"]]})

    # checks at rest
    checks: dict = {"errors": [], "clashes_rest": [], "joints": []}
    for pid, p in res["parts"].items():
        for st in p["status"]:
            if st["state"] == "error":
                checks["errors"].append(f"{parts[pid]['name']}: {st['id']} {st.get('message', '')}".strip())
    for m in res["mates"]:
        if m["state"] == "error":
            checks["errors"].append(f"Mate {m['id']}: {m.get('message', 'error')}")
    placed_rest = _placed(asm, built, rest)
    checks["clashes_rest"] = _clashes(placed_rest)

    names0 = {c["id"]: c.get("name") or c["id"] for c in asm["components"]}
    comp_ids = {c["id"] for c in asm["components"] if not c.get("suppressed")}
    contacts = [k for k in asm.get("contacts") or [] if k.get("a") in comp_ids and k.get("b") in comp_ids]
    joint_ids = {m["id"] for m in joints(asm)}
    contact_reps = {}
    for i, k in enumerate(contacts):
        if k.get("joint") not in joint_ids:  # no travel to check: at rest
            rep = contact_reps[i] = _contact_report(k, None, names0)
            _contact_add(rep, _gap(placed_rest, k["a"], k["b"]))

    joint_out = []
    for m in joints(asm):
        tr = _travel(asm, m, built, size, rest)
        docs = tr.pop("_docs")
        clashes, closest = [], None
        for k in range(STEPS):
            if k % CHECK_EVERY and k not in (0, STEPS - 1):
                continue
            poses = _poses(rest, tr["frames"][k])
            placed = _placed(docs[k], built, poses)
            for cl in _clashes(placed, set(tr["moving"])):
                clashes.append({**cl, "value": tr["values"][k]})
            c = _closest(placed, set(tr["moving"]))
            if c and (closest is None or c["mm"] < closest["mm"]):
                closest = {**c, "value": tr["values"][k]}
        for i, k in [(i, k) for i, k in enumerate(contacts) if k.get("joint") == m["id"]]:
            rep = contact_reps[i] = _contact_report(k, tr["unit"], names0)
            lo_k = k["from"] if k.get("from") is not None else tr["min"]
            hi_k = k["to"] if k.get("to") is not None else tr["max"]
            for j in range(STEPS):
                got = tr["reached"][j]
                if got is None or got < lo_k - 1e-6 or got > hi_k + 1e-6:
                    continue
                pl = {c: sol for c, sol in _placed(docs[j], built, _poses(rest, tr["frames"][j])).items() if c in (k["a"], k["b"])}
                _contact_add(rep, _gap(pl, k["a"], k["b"]), tr["values"][j])
        lo_got = next((v for v in tr["reached"] if v is not None), None)
        hi_got = next((v for v in reversed(tr["reached"]) if v is not None), None)
        checks["joints"].append({"id": tr["id"], "name": tr["name"], "unit": tr["unit"], "clashes": clashes,
                                 "closest": closest, "unreached": tr["errors"],
                                 "reached": [lo_got, hi_got], "poses_checked": len(range(0, STEPS, CHECK_EVERY)) + 1})
        joint_out.append({k: tr[k] for k in ("id", "name", "type", "unit", "min", "max", "rest", "moving")}
                         | {"reached": [lo_got, hi_got]})
    checks["contacts"] = [contact_reps[i] for i in sorted(contact_reps)]

    mate_changes = []
    if old_asm is not None:
        om = {m["id"]: m for m in old_asm.get("mates", [])}
        nm_ = {m["id"]: m for m in asm.get("mates", [])}
        strip = lambda m: {k: v for k, v in m.items() if k not in ("refs", "planes", "angle_refs", "input_refs", "align", "pose")}  # noqa: E731
        for mid, m in nm_.items():
            label = m.get("name") or mid
            if mid not in om:
                mate_changes.append(f"{label}: new mate.")
            elif strip(m) != strip(om[mid]):
                mate_changes.append(f"{label}: changed.")
        mate_changes += [f"{om[mid].get('name') or mid}: removed." for mid in om if mid not in nm_]
    changes = []
    if compare and history:
        changes = [h for h in history if compare["version"] < h["version"] <= rec["version"]]
        changes = [{"version": h["version"], "by": h.get("by"), "summary": h.get("summary")} for h in sorted(changes, key=lambda h: h["version"])]
    out = {"title": title or rec.get("name") or "Review", "name": rec.get("name"), "doc_id": rec.get("id"),
           "version": rec.get("version"), "compare": compare["version"] if compare else None,
           "kind": "part" if is_part else "assembly", "date": time.strftime("%d/%m/%Y"), "notes": notes or "",
           "parts": parts, "mate_changes": mate_changes, "names": names0, "joints": joint_out, "old": old, "checks": checks, "changes": changes}
    if bodies:
        out["doc"] = _viewer_doc(asm)
        out["doc"]["name"] = rec.get("name") or out["doc"].get("name")
        out["result"] = res
    out["build_seconds"] = round(time.time() - t0, 2)
    return out


def checks(doc: dict) -> dict:
    """The checks for the app's Motion Review (a document as it is in the editor, not stored)."""
    out = build({"id": None, "name": doc.get("name"), "version": None, "doc": doc}, bodies=False)
    return {k: out[k] for k in ("checks", "joints", "names", "build_seconds")}


def _poses(rest: dict, frame: dict) -> dict:
    return {**rest, **{cid: assembly.Pose(np.array(M).reshape(4, 4)[:3, :3], np.array(M).reshape(4, 4)[:3, 3])
                       for cid, M in frame.items()}}


# ----------------------------------------------------------------------------- stored reviews (share links)
# Each published review is one gzipped JSON snapshot in <data>/reviews/<token>.json.gz. /review/<token>
# serves the OpenSketch app in read-only mode, which loads /review/<token>/data, without the OpenSketch
# password: the unguessable token is the key, it holds no credential and no feature history, and it can
# be deleted. Reviews published before 2026-10-18 are frozen HTML pages (<token>.html), still served.
# reviews.json lists them (doc, versions, title, when).

TOKEN = re.compile(r"[A-Za-z0-9_-]{20,64}")


def _dir() -> Path:
    from . import store
    d = store.data_dir() / "reviews"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _locked():
    """reviews.json is changed by the web server (delete) and by CAD worker processes (publish): a file lock."""
    from . import store
    return store.file_lock(_dir() / ".lock")


def _index(strict: bool = False) -> list[dict]:
    """The published reviews. A damaged list reads as empty for showing, but is never written over (strict)."""
    p = _dir() / "reviews.json"
    try:
        items = json.loads(p.read_text())
        if not isinstance(items, list):
            raise ValueError
        return [i for i in items if isinstance(i, dict) and isinstance(i.get("token"), str)]
    except FileNotFoundError:
        return []
    except (OSError, ValueError):
        if strict:
            raise ReviewError("The list of published reviews is damaged, so nothing was changed. "
                              "Ask the person who runs this server to restore reviews.json.") from None
        return []


def _write_index(items: list[dict]) -> None:
    from . import store
    store._write_bytes(_dir() / "reviews.json", json.dumps(items, indent=1).encode())


def share_url(token: str, base: str | None = None) -> str:
    from . import auth
    return f"{(base or auth.public_url()).rstrip('/')}/review/{token}"


def summary(data: dict) -> dict:
    j = data["checks"]["joints"]
    return {"errors": len(data["checks"]["errors"]), "clashes_as_shown": len(data["checks"]["clashes_rest"]),
            "joints": [{"name": x["name"], "reached": x["reached"], "unit": x["unit"], "clashes": len(x["clashes"]),
                        "smallest_gap_mm": (x["closest"] or {}).get("mm")} for x in j],
            "contacts": [{"name": k["name"], "checked": k["checked"], "apart": len(k["apart"]),
                          "largest_gap_mm": k["largest_gap_mm"]} for k in data["checks"].get("contacts", [])],
            "changed_parts": [p["name"] for p in data["parts"].values() if p.get("changed")]}


KEEP_PER_DOC = 20    # published links kept per document (each is a full set of meshes)
KEEP_PER_OWNER = 60  # and per account with a storage limit (store.QUOTA: everyone but the server owner)


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
            raise ReviewError(f"Version {compare_version} is not kept any more.") from None
    history = [{"version": rec["version"], "by": rec.get("by"), "summary": rec.get("summary")}] + store.versions(doc_id)
    data = build(rec, compare, title, notes, history)
    token = secrets.token_urlsafe(24)
    raw = gzip.compress(json.dumps(data, separators=(",", ":")).encode(), 6)
    store.check_disk(len(raw), extra=store.RESERVE)  # a review link never takes the last room documents need
    owner = rec.get("owner")
    item = {"token": token, "doc_id": doc_id, "owner": owner, "name": rec.get("name"), "title": data["title"],
            "version": rec["version"], "compare": compare_version, "by": by, "created": time.time(),
            "size_kb": len(raw) // 1024}
    with _locked():
        items = [item] + _index(strict=True)
        store._write_bytes(_dir() / f"{token}.json.gz", raw)
        _write_index(items)
    gone = [i for i in items if i.get("doc_id") == doc_id][KEEP_PER_DOC:]  # a document's newest links stay
    if store.limits(owner) is not None:
        gone += [i for i in items if i.get("owner") == owner and owner is not None][KEEP_PER_OWNER:]
    for old in gone:
        delete(old["token"])
    return dict(item, url=share_url(token, base), checks=summary(data))


def listing(doc_id: str | None = None, base: str | None = None) -> list[dict]:
    return [dict(i, url=share_url(i["token"], base)) for i in _index() if doc_id is None or i.get("doc_id") == doc_id]


def data_path(token: str) -> Path | None:
    if not TOKEN.fullmatch(token or ""):
        return None
    p = _dir() / f"{token}.json.gz"
    return p if p.exists() else None


def html_path(token: str) -> Path | None:
    """A review published before the app viewer (a frozen HTML page)."""
    if not TOKEN.fullmatch(token or ""):
        return None
    p = _dir() / f"{token}.html"
    return p if p.exists() else None


def viewer_page(token: str, static: Path) -> str:
    """The app's index.html, opened read-only on this review (relative asset paths resolve under /review/)."""
    page = (static / "index.html").read_text()
    page = re.sub(r'<link rel="manifest"[^>]*>\n?', "", page)  # a shared review is not the installable app
    inject = (f'<meta name="robots" content="noindex, nofollow">\n'
              f'<script>window.OPENSKETCH_REVIEW = {json.dumps(token)};</script>\n')
    return page.replace("</head>", inject + "</head>", 1)


def delete(token: str) -> bool:
    paths = [p for p in (data_path(token), html_path(token)) if p]
    with _locked():
        items = _index(strict=True)
        left = [i for i in items if i["token"] != token]
        if len(left) != len(items):
            _write_index(left)
        for p in paths:
            p.unlink(missing_ok=True)
    return bool(paths)


def delete_for_doc(doc_id: str) -> int:
    """Unpublish every review of a document (it was deleted for good: its links must stop working too)."""
    tokens = [i["token"] for i in _index() if i.get("doc_id") == doc_id]
    for t in tokens:
        delete(t)
    return len(tokens)
