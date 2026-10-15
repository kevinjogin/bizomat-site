"""The scripted demo session builds a fully mated hand press through the real streaming path."""
from opensketch import ai


def test_demo_press():
    events = list(ai.run_stream({"name": "Part1", "features": []}, "build a hand press", demo=True, demo_speed=0))
    done = events[-1]
    assert done["ev"] == "done", events[-1]
    asm = done["proposal"]
    assert asm["type"] == "assembly"
    assert len(asm["parts"]) == 5 and len(asm["components"]) == 8 and len(asm["mates"]) == 16
    last = [e for e in events if e["ev"] == "assembly"][-1]["result"]
    assert all(m["state"] == "ok" for m in last["mates"]), [m for m in last["mates"] if m["state"] != "ok"]
    by = {c["id"]: c for c in last["components"]}
    assert abs(by["c6"]["position"][1] - 370) < 1e-3          # crown on the column tops
    assert abs(by["c8"]["position"][1] - 240) < 1e-3          # platen on the rod tip
    assert by["c8"]["state"] == "full" and by["c7"]["dof"] == 1  # cylinder may still spin about its axis
    inter = next(e for e in events if e["ev"] == "interference")
    assert inter["items"] == [], [(i["a"], i["b"], i["volume"]) for i in inter["items"]]
    assert any(e["ev"] == "thinking" for e in events)
    assert sum(1 for e in events if e["ev"] == "build_step") >= 15


def test_demo_part():
    events = list(ai.run_stream({"name": "Part1", "features": []}, "bracket", demo="part", demo_speed=0))
    done = events[-1]
    assert done["ev"] == "done" and done["proposal"]["features"][-1]["type"] == "fillet"
    steps = [e for e in events if e["ev"] == "build_step"]
    assert len(steps) == 9 and all(s["state"] == "ok" for s in steps), [(s["feature"], s.get("message")) for s in steps if s["state"] != "ok"]
