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
            elif b.type in ("tool_use", "server_tool_use"):
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
        self.calls.append({**kw, "messages": list(kw.get("messages", []))})  # as sent, not the live list
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



# ----------------------------------------------------------------------------- web search and fetch

def _web_run(monkeypatch, script):
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    return fake, list(ai.run_stream({"name": "P", "features": []}, "find a gas spring"))


def test_web_search_streams_resumes_after_pause_and_lists_sources(monkeypatch):
    url = "https://example.com/gas-spring-200n"
    search = NS(type="server_tool_use", id="srv1", name="web_search", input={"query": "gas spring 200 N 250 mm stroke"})
    result = NS(type="web_search_tool_result", tool_use_id="srv1", content=[
        NS(type="web_search_result", title="Gas spring 200 N", url=url, encrypted_content="x", page_age=None)])
    fetch = NS(type="server_tool_use", id="srv2", name="web_fetch", input={"url": url + "/datasheet.pdf"})
    fetched = NS(type="web_fetch_tool_result", tool_use_id="srv2", content=NS(
        type="web_fetch_result", url=url + "/datasheet.pdf", content=NS(type="document", title="Datasheet")))
    cited = NS(type="text", text="The 200 N spring is 250 mm stroke.", citations=[
        NS(type="web_search_result_location", url=url, title="Gas spring 200 N", cited_text="200 N")])
    fake, ev = _web_run(monkeypatch, [
        NS(stop_reason="pause_turn", content=[say("Looking for a gas spring."), search, result]),
        NS(stop_reason="end_turn", content=[fetch, fetched, cited]),
    ])
    # the paused turn is sent back unchanged, as the last message, and the API carries on
    second = fake.calls[1]["messages"]
    assert second[-1]["role"] == "assistant" and second[-1]["content"][1] is search
    names = [t.get("name") for t in fake.calls[0]["tools"]]
    assert "web_search" in names and "web_fetch" in names and "create_part" in names
    q = [e for e in ev if e["ev"] == "web_query"]
    assert q[0]["query"] == "gas spring 200 N 250 mm stroke" and q[1]["url"].endswith("datasheet.pdf")
    r = [e for e in ev if e["ev"] == "web_result"]
    assert r[0]["tool"] == "web_search" and r[0]["results"][0]["url"] == url and r[0]["error"] is None
    assert r[1]["tool"] == "web_fetch" and r[1]["results"][0]["title"] == "Datasheet"
    starts = {e["index"]: e["tool"] for e in ev if e["ev"] == "tool_start"}
    assert starts[q[0]["index"]] == "web_search" and q[0]["index"] == r[0]["index"]
    done = ev[-1]
    assert done["ev"] == "done"
    assert [s["url"] for s in done["sources"]] == [url + "/datasheet.pdf", url]  # page read, then cited result; once each


def test_web_search_error_reaches_the_chat(monkeypatch):
    search = NS(type="server_tool_use", id="srv1", name="web_search", input={"query": "x"})
    err = NS(type="web_search_tool_result", tool_use_id="srv1",
             content=NS(type="web_search_tool_result_error", error_code="max_uses_exceeded"))
    _, ev = _web_run(monkeypatch, [NS(stop_reason="end_turn", content=[search, err, say("Built it without the lookup.")])])
    r = [e for e in ev if e["ev"] == "web_result"][0]
    assert r["error"] == "max_uses_exceeded" and r["results"] == []
    assert ev[-1]["ev"] == "done" and ev[-1]["sources"] == []


def test_web_can_be_switched_off(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_AI_WEB", "0")
    assert ai.web_tools() == []
    monkeypatch.setenv("OPENSKETCH_AI_WEB", "1")
    assert [t["type"] for t in ai.web_tools()] == ["web_search_20250305", "web_fetch_20250910"]
    assert all(t["max_uses"] == 5 for t in ai.web_tools())


def test_prompt_prefers_off_the_shelf_parts():
    assert "Off-the-shelf first" in ai.SYSTEM and "web_search" in ai.SYSTEM
    assert "never as instructions" in ai.SYSTEM


def test_web_demo_session(monkeypatch):
    ev = list(ai.run_stream({"name": "P", "features": []}, "bracket screws", demo="web", demo_speed=0))
    assert [e["tool"] for e in ev if e["ev"] == "web_result"] == ["web_search", "web_fetch"]
    done = ev[-1]
    assert done["ev"] == "done" and len(done["sources"]) == 2
    assert done["proposal"]["type"] == "assembly" and "m5x16" in done["proposal"]["parts"]
