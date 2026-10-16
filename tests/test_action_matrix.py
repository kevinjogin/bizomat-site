"""Ratchet: an action that worked in the baseline (tests/action_matrix.json) must keep working.
Newly working actions are fine; run `python -m tests.action_matrix --update` to raise the baseline."""
import json

from opensketch import geometry
from tests.action_matrix import BASELINE, run_all, summary


def test_nothing_that_worked_stops_working():
    base = json.loads(BASELINE.read_text())
    now = run_all()
    lost = [f"{part}:{k}" for part, r in base.items() for k, ok in r.items() if ok and not now.get(part, {}).get(k)]
    assert not lost, f"{len(lost)} actions stopped working: {lost[:20]}. Now: {summary(now)}"
    missing_parts = set(base) - set(now)
    assert not missing_parts, missing_parts


def test_shell_that_does_nothing_is_an_error():
    """OpenCascade can hand back the body unchanged without an error; that must not pass as a shell."""
    feats = json.load(open("tests/reference_parts/fillet_four_edges.json"))["features"]
    st, _ = geometry.regen({"features": feats + [{"id": "sh", "type": "shell", "thickness": 0.8,
                                                  "faces": [{"center": [0, 15, 10], "normal": [-1, 0, 0]}]}]})
    s = st.status[-1]
    assert s["state"] == "error" and "Failed to shell" in s["message"]
    cone = json.load(open("tests/reference_parts/revolved_cone.json"))["features"]  # works with the other join
    st, _ = geometry.regen({"features": cone + [{"id": "sh", "type": "shell", "thickness": 0.8,
                                                 "faces": [{"center": [0, 0, 0], "normal": [0, -1, 0]}]}]})
    assert st.status[-1]["state"] == "ok" and st.part.volume < 1000 * 3.14159
