"""Streaming AI loop with a fake client that streams tool input in small chunks."""
import json
from types import SimpleNamespace as NS

import numpy as np

from opensketch import ai
from tests.test_assembly import pin, plate


class FakeStream:
    def __init__(self, resp):
        self.resp = resp

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False

    def __iter__(self):
        for i, b in enumerate(self.resp.content):
            yield NS(type="content_block_start", index=i, content_block=b)
            if b.type == "text":
                yield NS(type="content_block_delta", index=i, delta=NS(type="text_delta", text=b.text))
            elif b.type == "tool_use":
                s = json.dumps(b.input)
                for k in range(0, len(s), 7):
                    yield NS(type="content_block_delta", index=i, delta=NS(type="input_json_delta", partial_json=s[k:k + 7]))
            yield NS(type="content_block_stop", index=i)

    def get_final_message(self):
        return self.resp


class FakeMessages:
    def __init__(self, script):
        self.script = list(script)
        self.calls = []

    def stream(self, **kw):
        self.calls.append(kw)
        return FakeStream(self.script.pop(0))


def use(i, name, inp):
    return NS(type="tool_use", id=f"tu{i}", name=name, input=inp)


def say(t):
    return NS(type="text", text=t)


def test_scanner_finds_features_in_chunks():
    s = ai.FeatureScanner()
    src = json.dumps({"part_id": "p", "name": "X {not} [a]", "features": [{"id": "a", "name": "S\"1", "x": [1, {"y": 2}]}, {"id": "b"}], "z": [{"q": 1}]})
    got = []
    for k in range(len(src)):
        got += s.feed(src[k])
    assert [f["id"] for f in got] == ["a", "b"]
    assert s.field("part_id") == "p"


def test_stream_builds_assembly(monkeypatch):
    up = {"component": "c1", "axis": {"point": [0, 0, 0], "dir": [0, 1, 0]}}
    script = [
        NS(stop_reason="tool_use", content=[say("Plate with a hole."), use(1, "create_part", {"part_id": "plate", "name": "Plate", "features": plate()["features"]})]),
        NS(stop_reason="tool_use", content=[use(2, "create_part", {"part_id": "pin", "name": "Pin", "material": "AISI 304", "features": pin()["features"]})]),
        NS(stop_reason="tool_use", content=[use(3, "insert_component", {"component_id": "c1", "part": "plate"}),
                                            use(4, "insert_component", {"component_id": "c2", "part": "pin", "position": [40, 60, 0], "rotation": [0, 0, 20]})]),
        NS(stop_reason="tool_use", content=[use(5, "add_mate", {"type": "concentric", "refs": [up, {"component": "c2", "ref": "Y axis"}]}),
                                            use(6, "add_mate", {"type": "coincident", "align": "aligned", "refs": [
                                                {"component": "c1", "ref": "Top Plane"}, {"component": "c2", "ref": "Top Plane"}]})]),
        NS(stop_reason="tool_use", content=[use(7, "check_interference", {})]),
        NS(stop_reason="end_turn", content=[say("Built a plate with a pin.")]),
    ]
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    events = list(ai.run_stream({"name": "Part1", "features": []}, "plate with a pin"))
    kinds = [e["ev"] for e in events]
    assert kinds[0] == "start" and kinds[-1] == "done"
    steps = [e for e in events if e["ev"] == "build_step"]
    assert len(steps) == 6  # 4 plate features + 2 pin features, each rebuilt while streaming
    assert steps[0]["feature"]["type"] == "sketch" and "frame" in steps[0] and "body" not in steps[0]
    assert "body" in steps[1] and steps[1]["bbox"][1][1] == 10
    starts = [e for e in events if e["ev"] == "build_start"]
    assert [s["part"] for s in starts] == ["plate", "pin"]
    asm_ev = [e for e in events if e["ev"] == "assembly"]
    assert [e["action"]["kind"] for e in asm_ev] == ["insert", "insert", "mate", "mate"]
    # meshes are sent once per part
    assert "body" in asm_ev[0]["result"]["parts"]["plate"] and "body" not in asm_ev[1]["result"]["parts"]["plate"]
    done = events[-1]
    prop = done["proposal"]
    assert prop["type"] == "assembly" and len(prop["components"]) == 2 and len(prop["mates"]) == 2
    c2 = prop["components"][1]
    assert np.allclose(c2["position"], [0, 0, 0], atol=1e-4)
    assert prop["parts"]["pin"]["material"]["name"] == "AISI 304"
    assert prop["sequence"] == ["c1", "c2"]
    inter = next(e for e in events if e["ev"] == "interference")
    assert inter["items"] == []
    assert "".join(e["delta"] for e in events if e["ev"] == "text").startswith("Plate with a hole.")
    assert fake.calls[0]["thinking"]["display"] == "summarized"
    # create_part reports geometry for mating
    msgs = fake.calls[-1]["messages"]
    tr = next(c for m in msgs if m["role"] == "user" and isinstance(m["content"], list) for c in m["content"] if c["tool_use_id"] == "tu1")
    rep = json.loads(tr["content"])
    assert rep["cylinders"] and rep["planar_faces"]


def test_part_request_converts_to_assembly(monkeypatch):
    script = [NS(stop_reason="tool_use", content=[use(1, "create_part", {"part_id": "pin", "name": "Pin", "features": pin()["features"]})]),
              NS(stop_reason="end_turn", content=[say("ok")])]
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    doc = plate()
    events = list(ai.run_stream(doc, "add a pin"))
    prop = events[-1]["proposal"]
    assert prop["type"] == "assembly" and set(prop["parts"]) == {"part1", "pin"}
    assert prop["components"][0]["part"] == "part1" and prop["components"][0]["fixed"]
