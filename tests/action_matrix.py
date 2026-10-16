"""Action matrix (idea from SolidCraft's docs/action-matrix.md): try fillet, chamfer, shell and draft on every
edge and planar face of a corpus of real parts, through OpenSketch's own feature code (refs matched the
way an AI or the browser would pass them). The baseline (action_matrix.json) records what works today.
tests/test_action_matrix.py fails when something that worked stops working; something that newly works
is fine, and `python -m tests.action_matrix --update` ratchets the baseline up.

Each action is judged on the result: no error, a valid solid, and the volume moving the right way (a
fillet or chamfer changes it, a shell removes material, a draft changes it).
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

from opensketch import demo, geometry, inspection

HERE = Path(__file__).parent
BASELINE = HERE / "action_matrix.json"
RADIUS = 1.0      # fillet radius and chamfer distance, mm
SHELL = 0.8       # wall, mm
DRAFT = 2.0       # degrees


def corpus() -> dict[str, list[dict]]:
    parts = {}
    for f in sorted((HERE / "reference_parts").glob("*.json")):
        parts[f.stem] = json.loads(f.read_text())["features"]
    parts["demo_bracket"] = demo.bracket_features()
    for name in ("base_part", "column_part", "crown_part", "platen_part", "cylinder_part"):
        parts["press_" + name.replace("_part", "")] = getattr(demo, name)()
    return parts


def _key(ref: dict) -> str:
    return ",".join(f"{v:g}" for v in (ref.get("mid") or ref.get("center")))


def run_part(features: list[dict]) -> dict[str, bool]:
    st, _ = geometry.regen({"features": features})
    base = st.part
    if base is None or any(s["state"] == "error" for s in st.status):
        return {"rebuild": False}
    out: dict[str, bool] = {"rebuild": True}
    v0 = base.volume
    topo = inspection.body_topology(base, "both", limit=10_000)
    planar = [f for f in topo["faces"] if f["type"] == "plane"]

    def attempt(feat, check):
        trial = geometry.RegenState(part=base, planes=dict(st.planes))
        _, status = geometry.rebuild_feature(dict(feat, id="x"), trial)
        part = trial.part
        try:
            valid = part.is_valid() if callable(getattr(part, "is_valid", None)) else bool(part.is_valid)
            ok = status["state"] != "error" and part is not None and valid and check(part.volume)
        except Exception:
            ok = False
        return bool(ok)

    for e in topo["edges"]:
        if e.get("face_angle_deg") == 0.0 or e.get("seam"):
            continue  # already smooth, or a seam of a closed surface: not edges anyone rounds
        k = _key(e["ref"])
        out[f"fillet:{k}"] = attempt({"type": "fillet", "radius": RADIUS, "edges": [e["ref"]]}, lambda v: abs(v - v0) > 1e-6)
        out[f"chamfer:{k}"] = attempt({"type": "chamfer", "distance": RADIUS, "edges": [e["ref"]]}, lambda v: abs(v - v0) > 1e-6)
    for f in planar:
        k = _key(f["ref"])
        out[f"shell:{k}"] = attempt({"type": "shell", "thickness": SHELL, "faces": [f["ref"]]}, lambda v: v < v0 - 1e-6)
    neutral = max(planar, key=lambda f: f["area"]) if planar else None
    if neutral:
        n = neutral["normal"]
        for f in planar:
            if abs(sum(a * b for a, b in zip(f["normal"], n))) > 1e-6:
                continue  # draft the faces square to the largest face, the usual case
            k = _key(f["ref"])
            plane = {"type": "fixed", "origin": neutral["center"], "normal": n, "xdir": _xdir(n)}
            out[f"draft:{k}"] = attempt({"type": "draft", "neutral_plane": plane, "faces": [f["ref"]], "angle": DRAFT},
                                        lambda v: abs(v - v0) > 1e-6)
    return out


def _xdir(n):
    a = [1, 0, 0] if abs(n[0]) < 0.9 else [0, 1, 0]
    x = [a[1] * n[2] - a[2] * n[1], a[2] * n[0] - a[0] * n[2], a[0] * n[1] - a[1] * n[0]]
    m = sum(c * c for c in x) ** 0.5
    return [c / m for c in x]


def run_all() -> dict[str, dict[str, bool]]:
    return {name: run_part(feats) for name, feats in corpus().items()}


def summary(results: dict) -> dict:
    out = {}
    for part, r in results.items():
        for k, ok in r.items():
            action = k.split(":")[0]
            s = out.setdefault(action, [0, 0])
            s[0] += ok
            s[1] += 1
    return {a: f"{p}/{n}" for a, (p, n) in sorted(out.items())}


if __name__ == "__main__":
    res = run_all()
    if "--update" in sys.argv:
        BASELINE.write_text(json.dumps(res, indent=1, sort_keys=True) + "\n")
        print("baseline written")
    print(json.dumps(summary(res), indent=1))
