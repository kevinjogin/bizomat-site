"""Deleting features from a part the way SOLIDWORKS does, with a dry run that says what happens first.

`plan_delete(part, ids)` works out:
- deleted_with_it: features that cannot exist without the deleted ones (an extrude whose sketch goes, a
  pattern or mirror left with nothing to copy), followed through the tree;
- absorbed: sketches only the deleted features used (SOLIDWORKS "Delete absorbed features"), removed too
  unless delete_absorbed is false;
- patterns_trimmed: patterns and mirrors that keep their other seeds;
- would_fail / would_warn: what the rebuild without them reports that it did not report before (a sketch on
  a deleted plane, a fillet whose edge has gone, ...). Those features stay, as in SOLIDWORKS: they turn red
  and can be repaired.

Idea from SolidCraft (bherbruck/solidcraft): timeline.dependents {deleted_with_it, would_fail}.
"""

from __future__ import annotations

import copy

from . import geometry

SKIP_KEYS = ("id", "name", "type")


def _strings(value) -> set[str]:
    if isinstance(value, str):
        return {value}
    if isinstance(value, dict):
        out: set[str] = set()
        for k, v in value.items():
            if k not in SKIP_KEYS:
                out |= _strings(v)
        return out
    if isinstance(value, list):
        out = set()
        for v in value:
            out |= _strings(v)
        return out
    return set()


def references(feat: dict, ids: set[str]) -> set[str]:
    """Ids of other features this feature refers to (sketch, plane refs, pattern seeds, any registry field)."""
    return {s for s in _strings(feat) if s in ids and s != feat.get("id")}


def sketch_ids(feat: dict) -> list[str]:
    """Sketches a feature consumes (it cannot exist without them): extrude/revolve/sweep sketch, sweep path,
    loft profiles. Same rule as featureSketchIds in static/js/model-utils.js."""
    ids = [feat.get("sketch"), feat.get("path")] + list(feat.get("profiles") or [])
    return [i for i in ids if isinstance(i, str)]


def _problems(doc: dict) -> tuple[dict, dict]:
    st = geometry.rebuilt(doc)  # the part as it stands is usually what the browser just built
    errs = {s["id"]: s.get("message", "error") for s in st.status if s["state"] == "error"}
    warns = {s["id"]: s.get("message", "warning") for s in st.status if s["state"] == "warning"}
    return errs, warns


def plan_delete(part: dict, ids: list[str], delete_absorbed: bool = True) -> dict:
    feats = part.get("features", [])
    by_id = {f["id"]: f for f in feats}
    unknown = [i for i in ids if i not in by_id]
    if unknown:
        return {"error": f"Unknown feature ids {unknown}; features: {[f['id'] for f in feats]}."}
    all_ids = set(by_id)
    gone = set(ids)
    with_it: list[str] = []
    trimmed: dict[str, list[str]] = {}
    changed = True
    while changed:  # follow the tree: a cascade can empty a pattern, and so on
        changed = False
        for f in feats:
            fid = f["id"]
            if fid in gone:
                continue
            if any(i in gone for i in sketch_ids(f)):
                gone.add(fid)
                with_it.append(fid)
                changed = True
                continue
            seeds = f.get("features")
            if isinstance(seeds, list) and seeds and any(s in gone for s in seeds):
                left = [s for s in seeds if s not in gone]
                if not left:
                    gone.add(fid)
                    with_it.append(fid)
                    trimmed.pop(fid, None)
                    changed = True
                else:
                    trimmed[fid] = left
    absorbed = []
    if delete_absorbed:
        users: dict[str, set[str]] = {}
        for f in feats:
            for r in references(f, all_ids):
                users.setdefault(r, set()).add(f["id"])
        for f in feats:
            fid = f["id"]
            if f.get("type") == "sketch" and fid not in gone and users.get(fid) and users[fid] <= gone:
                absorbed.append(fid)
        gone |= set(absorbed)

    new = copy.deepcopy(part)
    kept = []
    for f in new.get("features", []):
        if f["id"] in gone:
            continue
        if f["id"] in trimmed:
            f["features"] = trimmed[f["id"]]
        kept.append(f)
    new["features"] = kept
    rb = part.get("rollback")
    if rb is not None:
        new["rollback"] = rb - sum(1 for f in feats[:rb] if f["id"] in gone)

    before_e, before_w = _problems(part)
    after_e, after_w = _problems(new)
    names = {f["id"]: f.get("name") or f["id"] for f in feats}
    return {
        "deleted": list(ids),
        "deleted_with_it": with_it,
        "absorbed": absorbed,
        "patterns_trimmed": [{"id": k, "keeps": v} for k, v in trimmed.items()],
        "would_fail": [{"id": k, "name": names.get(k), "message": v} for k, v in after_e.items() if k not in before_e],
        "would_warn": [{"id": k, "name": names.get(k), "message": v} for k, v in after_w.items()
                       if k not in before_w and k not in after_e],
        "part": new,
    }
