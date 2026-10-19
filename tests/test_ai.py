"""AI loop test with a fake Anthropic client: proposal -> rebuild report -> final reply."""
from types import SimpleNamespace as NS

from opensketch import ai


class FakeMessages:
    def __init__(self, script):
        self.script = list(script)
        self.calls = []

    def create(self, **kw):
        self.calls.append(kw)
        return self.script.pop(0)


def plate_features():
    pts = [("a", -30, -20), ("b", 30, -20), ("c", 30, 20), ("d", -30, 20)]
    ents = [{"id": i, "type": "point", "x": x, "y": y} for i, x, y in pts]
    ents += [{"id": f"l{k}", "type": "line", "p1": pts[k][0], "p2": pts[(k + 1) % 4][0]} for k in range(4)]
    return [{"id": "s1", "type": "sketch", "name": "Sketch1", "plane": {"ref": "Top Plane"}, "entities": ents, "constraints": []},
            {"id": "e1", "type": "extrude", "name": "Boss-Extrude1", "sketch": "s1", "depth": 8}]


def run(doc, prompt):
    """The whole loop, as the chat runs it (run_stream), down to its last event."""
    events = list(ai.run_stream(doc, prompt))
    assert events[-1]["ev"] != "error", events[-1]
    return events[-1]


def test_ai_loop(monkeypatch):
    use = NS(type="tool_use", id="tu1", name="propose_features",
             input={"mode": "replace", "features": plate_features(), "summary": "60 x 40 x 8 plate"})
    script = [NS(stop_reason="tool_use", content=[use]),
              NS(stop_reason="end_turn", content=[NS(type="text", text="Built a 60 x 40 x 8 mm plate.")])]
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    out = run({"name": "Part1", "features": []}, "make a plate")
    assert out["proposal"]["features"][1]["depth"] == 8
    assert out["reply"].startswith("Built")
    assert out["steps"] == [{"summary": "60 x 40 x 8 plate", "clean": True}]
    # the rebuild report went back to the model as a tool_result
    tr = fake.calls[1]["messages"][2]["content"][0]
    assert tr["type"] == "tool_result" and '"volume": 19200.0' in tr["content"]
    assert fake.calls[0]["model"] == "claude-opus-5-5"


def test_ai_unavailable(monkeypatch):
    monkeypatch.setattr(ai, "available", lambda: False)
    monkeypatch.delenv("OPENSKETCH_AI_DEMO", raising=False)
    events = list(ai.run_stream({"features": []}, "x"))
    assert events == [{"ev": "error", "message": ai.NO_KEY}]
