"""The AI's tools and the MCP endpoint: refusals change nothing, cut-off or garbled calls do not run, ids stay unique,
long chats stay bounded, live events stay small, Claude's saves never hold the document lock while CAD runs and
never overwrite the person's edits, undo says what it undid, bought-part links go where they say."""
import json
import threading
import time
from types import SimpleNamespace as NS

import pytest

from opensketch import ai, assembly, demo, geometry, inspection, mcp_server, providers, store
from tests.test_ai_stream import FakeMessages, say, use
from tests.test_assembly import asm_doc, pin, plate
from tests.test_geometry import rect_sketch
from tests.test_mcp_inspect import block, data, hole, mcp  # noqa: F401  (fixtures)


def part_doc():
    return {"version": 1, "type": "part", "name": "Block", "units": "mm", "features": block(), "rollback": None}


# ----------------------------------------------------------------------------- refusals change nothing (ai-mcp-2)

def test_refused_tools_leave_the_work_as_it_was():
    s = ai.Session(part_doc())
    before = json.dumps(s.work, sort_keys=True)
    rep, clean, ev = s.apply("insert_component", {"component_id": "c1", "part": "typo"})
    assert not clean and "Unknown part" in rep and not ev
    assert json.dumps(s.work, sort_keys=True) == before  # still a part, not an assembly
    rep, clean, _ = s.apply("set_parameter", {"name": "wall", "expression": "2"})
    assert clean
    before = json.dumps(s.work, sort_keys=True)
    rep, clean, _ = s.apply("set_equation", {"feature": "e1", "field": "depth", "expression": "nosuchvar * 2"})
    assert not clean and rep.startswith("Not set") and "eq" not in s.work["features"][1]
    assert json.dumps(s.work, sort_keys=True) == before
    # a malformed position is refused before anything is added, and the session keeps working
    s = ai.Session(asm_doc())
    rep, clean, _ = s.apply("insert_component", {"component_id": "c9", "part": "pin", "position": [1, 2]})
    assert not clean and "three finite numbers" in rep and len(s.work["components"]) == 2
    rep, clean, _ = s.apply("add_mate", {"type": "distance", "value": 5, "refs": [
        {"component": "c1", "ref": "Top Plane"}, {"component": "c2", "ref": "Top Plane"}]})
    assert ai._is_report(rep)


def test_tool_input_is_checked_against_the_schema():
    s = ai.Session(part_doc())
    for name, inp, words in [
            ("create_part", {}, "needs part_id, name, features"),
            ("propose_features", {"mode": "sideways", "summary": "x", "features": []}, "mode must be one of"),
            ("add_mate", {"type": "distance", "refs": [{"component": "c1"}]}, "2 items"),
            ("add_contact", {"a": "c1", "b": "c2", "from_val": 3}, "does not take from_val"),
            ("add_fillet", {"radius": 1, "edges": [], "radius_mm": 2}, "does not take radius_mm")]:
        before = json.dumps(s.work, sort_keys=True)
        rep, clean, ev = s.apply(name, inp)
        assert not clean and words in rep and not ev, (name, rep)
        assert json.dumps(s.work, sort_keys=True) == before


def test_feature_ids_must_be_unique():
    s = ai.Session(part_doc())
    rep, clean, _ = s.apply("propose_features", {"mode": "append", "summary": "again", "features": block()})
    assert not clean and "already used: s1, e1" in rep and len(s.work["features"]) == 2
    rep, clean, _ = s.apply("propose_features", {"mode": "replace", "summary": "twice", "features": block() + block()})
    assert not clean and "already used" in rep
    rep, clean, _ = s.apply("propose_features", {"mode": "append", "summary": "hole", "features": hole()})
    assert clean and [f["id"] for f in s.work["features"]] == ["s1", "e1", "s2", "e2"]


def test_mcp_saves_nothing_when_a_tool_refuses(mcp):  # noqa: F811
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    v = store.get(d["doc_id"])["version"]
    r = mcp("set_equation", {"doc_id": d["doc_id"], "feature": "e1", "field": "depth", "expression": "nosuchvar * 2"})
    assert "Not set" in r["report"] and r["note"] == "Nothing changed."
    r = mcp("insert_component", {"doc_id": d["doc_id"], "component_id": "c1", "part": "typo"})
    rec = store.get(d["doc_id"])
    assert rec["version"] == v and rec["doc"]["type"] == "part"
    r = mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Again", "features": block()})
    assert "already used" in r["report"] and store.get(d["doc_id"])["version"] == v


# ----------------------------------------------------------------------------- cut-off and garbled calls (ai-mcp-9)

def _run(monkeypatch, script, doc=None):
    fake = FakeMessages(script)
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    return fake, list(ai.run_stream(doc or {"name": "P", "features": []}, "make a plate"))


def test_a_call_cut_off_at_the_output_limit_is_not_run(monkeypatch):
    cut = use(1, "propose_features", {"mode": "replace", "summary": "Plate", "features": block()[:1]})
    fake, ev = _run(monkeypatch, [NS(stop_reason="max_tokens", content=[say("Plate."), cut]),
                                  NS(stop_reason="end_turn", content=[say("I will send it in parts.")])])
    done = ev[-1]
    assert done["ev"] == "done" and done["proposal"] is None  # the partial tree was never applied
    tr = fake.calls[1]["messages"][-1]["content"][0]
    assert tr["is_error"] and "cut off at the output limit" in tr["content"]
    td = next(e for e in ev if e["ev"] == "tool_done")
    assert not td["clean"] and "cut off" in td["summary"]
    assert fake.calls[0]["max_tokens"] == ai.MAX_TOKENS >= 64000
    assert fake.calls[0]["cache_control"] == {"type": "ephemeral"}  # system, tools and history are cached


def test_unparseable_arguments_from_other_providers_are_not_run():
    lines = ['data: ' + json.dumps({"choices": [{"delta": {"tool_calls": [
                {"index": 0, "id": "c1", "function": {"name": "create_part", "arguments": '{"part_id": "a", "feat'}}]}}]}),
             'data: ' + json.dumps({"choices": [{"delta": {}, "finish_reason": "tool_calls"}]}), "data: [DONE]"]
    msg = providers.translate_stream(lines, lambda e: None)
    assert msg.content[0].input == {} and msg.invalid_inputs == {"c1": '{"part_id": "a", "feat'}
    assert "invalid_inputs" not in providers.plain_blocks(msg.content)[0]  # never sent back to any provider


# ----------------------------------------------------------------------------- long chats stay bounded (ai-mcp-1)

def test_follow_up_turns_send_only_what_changed(monkeypatch):
    h = ai.History()
    first = ai.document_message(h, part_doc(), "part")
    assert first.startswith("Current part document:\n```json")
    assert "unchanged" not in ai.document_message(h, part_doc(), "part") and "the same as" in ai.document_message(h, part_doc(), "part")
    d = part_doc()
    d["features"] += hole()
    d["features"][1]["depth"] = 12
    note = ai.document_message(h, d, "part")
    delta = json.loads(note.split("```json\n")[1].split("\n```")[0])
    assert [f["id"] for f in delta["features"]["changed"]] == ["e1", "s2", "e2"] and "order" not in delta["features"]
    later = [ai.document_message(h, d, "part") for _ in range(ai.FULL_SNAPSHOT_EVERY)]
    assert any(m.startswith("Current part document:\n```json") for m in later)  # the whole document again now and then
    a, b = asm_doc(), asm_doc()
    b["mates"] = b["mates"][:1]
    b["parts"]["pin"]["name"] = "Long pin"
    delta = ai.doc_delta(ai.model_view(a), ai.model_view(b))
    assert delta["mates"] == {"removed": ["m2"]} and list(delta["parts"]["changed"]) == ["pin"]


def test_a_long_chat_is_compacted_and_keeps_working(monkeypatch):
    h = ai.History()
    for t in range(6):
        h.append({"role": "user", "content": f"Current part document:\n```json\n{'x' * 40000}\n```\n\nRequest: turn {t}"})
        h.append({"role": "assistant", "content": [
            {"type": "thinking", "thinking": "...", "signature": "sig"}, say(f"Doing {t}."),
            {"type": "tool_use", "id": f"t{t}", "name": "create_part",
             "input": {"part_id": "p", "name": "P", "features": [{"id": f"f{k}", "type": "sketch"} for k in range(400)]}}]})
        h.append({"role": "user", "content": [{"type": "tool_result", "tool_use_id": f"t{t}",
                                               "content": json.dumps({"clean": True, "status": ["y" * 9000]})}]})
        h.append({"role": "assistant", "content": [say(f"Done {t}.")]})
    h.view = {"features": []}
    assert ai.compact_history(h, budget=100_000)
    assert ai._size_of(list(h)) < 100_000 and h.view is None
    text = json.dumps(list(h), default=str)
    assert "thinking" not in text  # edited history: no thinking block may be replayed
    assert "Request: turn 5" in text and "Doing 5." in text  # the conversation stays readable
    assert "its document snapshot is omitted" in text and "old result, shortened" in text
    ids = [b["id"] for m in h if m["role"] == "assistant" for b in m["content"] if b.get("type") == "tool_use"]
    results = [b["tool_use_id"] for m in h if m["role"] == "user" and isinstance(m["content"], list) for b in m["content"]]
    assert ids == results  # every call still has its result


def test_chat_memory_is_bounded_by_bytes():
    conv = ai._Conversations()
    conv.MAX_BYTES = 200_000
    for i in range(10):
        conv[f"c{i}"] = ai.History([{"role": "user", "content": "x" * 50_000}])
    assert len(conv) <= 4 and "c9" in conv and "c0" not in conv


def test_a_stopped_chat_and_a_lost_chat_carry_on(monkeypatch):
    conv = "stopped-chat"
    ai._conversations[conv] = ai.History([{"role": "user", "content": "Request: x"},
                                          {"role": "assistant", "content": [use(1, "create_part", {"part_id": "p"})]}])
    fake, ev = None, None
    fake = FakeMessages([NS(stop_reason="end_turn", content=[say("ok")])])
    monkeypatch.setattr(ai, "available", lambda: True)
    import anthropic
    monkeypatch.setattr(anthropic, "Anthropic", lambda: NS(beta=NS(messages=fake)))
    ev = list(ai.run_stream({"name": "P", "features": []}, "again", conv))
    sent = fake.calls[0]["messages"]
    assert sent[2]["content"][0]["tool_use_id"] == "tu1" and sent[2]["content"][0]["is_error"]  # the open call answered
    assert "history_lost" not in ev[0]
    fake.script = [NS(stop_reason="end_turn", content=[say("ok")])]
    ev = list(ai.run_stream({"name": "P", "features": []}, "hello", "gone-after-a-restart"))
    assert ev[0]["history_lost"] and ev[0]["conversation"] != "gone-after-a-restart"


# ----------------------------------------------------------------------------- live events stay small (ai-mcp-12)

def test_live_events_carry_no_features_and_big_bodies_are_not_meshed(monkeypatch):
    doc = demo.press_doc()
    s = ai.Session(doc)
    m = doc["mates"][0]
    rep, clean, events = s.apply("add_mate", {"type": "distance", "refs": m["refs"], "value": 5})
    ev = events[-1]
    assert ev["ev"] == "assembly" and all(set(p) <= {"name", "appearance"} for p in ev["doc"]["parts"].values())
    assert ev["doc"]["mates"][-1]["type"] == "distance" and ev["doc"]["components"]
    assert all("status" not in p and "planes" not in p for p in ev["result"]["parts"].values())
    rep = json.loads(rep)
    assert all(set(p) == {"bbox", "rebuilt", "clean"} for p in rep["parts"].values())  # every part's status once is enough
    monkeypatch.setattr(ai, "LIVE_MESH_FACES", 3)
    step = ai.LiveBuilder(block()[:1]).add(block()[1])
    assert step.get("body_skipped") and "body" not in step and step["bbox"]


# ----------------------------------------------------------------------------- builds once (perf) and names (parity)

def test_an_ai_change_to_a_placed_part_is_built_once(monkeypatch):
    doc = demo.press_doc()
    assembly.regen_assembly(doc)  # what the agent's worker already holds
    n = {"calls": 0}
    real = geometry._regen_feature

    def counting(*a, **k):
        n["calls"] += 1
        return real(*a, **k)
    monkeypatch.setattr(geometry, "_regen_feature", counting)
    s = ai.Session(doc)
    rep, clean, _ = s.apply("add_plane", {"part_id": "base", "base": {"ref": "Top Plane"}, "offset": 5})
    assert clean and n["calls"] == len(doc["parts"]["base"]["features"]) + 1


def test_add_feature_keeps_named_edges_after_a_size_change():
    d = part_doc()
    st, _ = geometry.regen(d)
    edge = next(e for e in inspection.body_topology(st.part, "edges", [40, 10, 0], 5, st.namer)["edges"]
                if e.get("name", "").count("|") == 1 and "end" in e["name"])
    d["features"].append({"id": "f1", "type": "fillet", "name": "Fillet1", "radius": 2, "edges": [edge["ref"]]})
    for e in d["features"][0]["entities"]:
        if e["type"] == "point":
            e["x"] *= 1.75  # the block gets wider: only the edge's name still finds it
    s = ai.Session(d)
    rep, clean, _ = s.apply("add_plane", {"base": {"ref": "Top Plane"}, "offset": 30})
    states = {x["id"]: x["state"] for x in json.loads(rep)["status"]}
    assert states["f1"] == "ok", rep


def test_cut_features_are_named_like_the_app_names_them():
    s = ai.Session(part_doc())
    s.apply("propose_features", {"mode": "append", "summary": "sketch", "features": hole()[:1]})
    rep, clean, _ = s.apply("add_extrude", {"sketch": "s2", "op": "cut", "end": "through_all"})
    assert json.loads(rep)["feature"]["name"] == "Cut-Extrude1"


# ----------------------------------------------------------------------------- MCP: locks, versions, undo, repeats

def test_claude_does_not_hold_the_lock_and_reruns_on_the_new_version(mcp, monkeypatch):  # noqa: F811
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    real = ai.Session.apply
    seen = {"runs": 0, "user_saved_in": None}

    def slow(self, name, inp):
        seen["runs"] += 1
        if seen["runs"] == 1:  # while Claude's tool runs, the person saves a rename in the app
            t0 = time.monotonic()
            th = threading.Thread(target=lambda: store.rename(d["doc_id"], "Renamed by you"))
            th.start()
            th.join(5)
            seen["user_saved_in"] = None if th.is_alive() else time.monotonic() - t0
        return real(self, name, inp)
    monkeypatch.setattr(ai.Session, "apply", slow)
    r = mcp("add_fillet", {"doc_id": d["doc_id"], "radius": 1, "edges": [{"mid": [40, 10, 0]}]})
    assert seen["user_saved_in"] is not None and seen["user_saved_in"] < 2  # the person's save did not wait
    assert seen["runs"] == 2 and r["version"] == 4  # Claude's change was made again on the person's version
    rec = store.get(d["doc_id"])
    assert rec["name"] == "Renamed by you" and rec["doc"]["features"][-1]["type"] == "fillet"


def test_stale_base_versions_and_replace_conflicts_save_nothing(mcp):  # noqa: F811
    d = mcp("create_document", {"name": "Block"})
    r = mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    store.rename(d["doc_id"], "Mine now")
    r = mcp("propose_features", {"doc_id": d["doc_id"], "mode": "replace", "summary": "Rewrite",
                                 "features": block() + hole(), "base_version": r["version"]})
    assert "changed after version 2" in r["error"] and r["changed_since"][0]["summary"] == "Renamed to Mine now"
    assert store.get(d["doc_id"])["version"] == 3
    r = mcp("batch", {"doc_id": d["doc_id"], "base_version": 2, "steps": [
        {"tool": "propose_features", "args": {"mode": "append", "summary": "Hole", "features": hole()}}]})
    assert r["_is_error"] and r["rolled_back"] and store.get(d["doc_id"])["version"] == 3


def test_undo_only_undoes_claudes_change_and_says_what_it_undid(mcp):  # noqa: F811
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    rec = store.get(d["doc_id"])
    store.save(d["doc_id"], dict(rec["doc"], features=rec["doc"]["features"][:1]), "you", "Deleted the extrude")
    r = mcp("undo_last_change", {"doc_id": d["doc_id"]})
    assert "made by the user in the app: Deleted the extrude" in r["error"] and store.get(d["doc_id"])["version"] == 3
    r = mcp("undo_last_change", {"doc_id": d["doc_id"], "expected_version": 3})
    assert r["undid"] == {"version": 3, "by": "you", "summary": "Deleted the extrude"} and r["version"] == 4
    assert len(store.get(d["doc_id"])["doc"]["features"]) == 2


def test_the_same_call_twice_is_made_once(mcp):  # noqa: F811
    d = mcp("create_document", {"name": "Block"})
    mcp("propose_features", {"doc_id": d["doc_id"], "mode": "append", "summary": "Block", "features": block()})
    args = {"doc_id": d["doc_id"], "radius": 1, "edges": [{"mid": [40, 10, 0]}]}
    first = mcp("add_fillet", args)
    again = mcp("add_fillet", args)  # a client that timed out and retried
    assert again["version"] == first["version"] and "not made again" in again["note"]
    assert sum(f["type"] == "fillet" for f in store.get(d["doc_id"])["doc"]["features"]) == 1


def test_batch_ignores_a_parts_old_errors_in_an_assembly(mcp):  # noqa: F811
    doc = asm_doc()
    doc["parts"]["plate"]["features"].append({"id": "bad1", "type": "extrude", "name": "Broken", "sketch": "nope", "depth": 5})
    rec = store.create("Assembly", doc)
    r = mcp("batch", {"doc_id": rec["id"], "steps": [
        {"tool": "add_plane", "args": {"part_id": "plate", "base": {"ref": "Top Plane"}, "offset": 5}}]})
    assert r["ok"] and not r["_is_error"], r


def test_contact_range_names_agree(mcp):  # noqa: F811
    rec = store.create("Assembly", asm_doc())
    r = mcp("add_contact", {"doc_id": rec["id"], "a": "c1", "b": "c2", "joint": "m1", "from": 10, "to": 20})
    assert r["report"]["contact"]["from"] == 10 and r["report"]["contact"]["to"] == 20
    r = mcp("batch", {"doc_id": rec["id"], "steps": [
        {"tool": "add_contact", "args": {"a": "c1", "b": "c2", "joint": "m1", "from_value": 1, "to_value": 2}},
        {"tool": "add_contact", "args": {"a": "c2", "b": "c1", "joint": "m1", "from": 3, "to": 4}}]})
    assert r["ok"]
    got = [(k["from"], k["to"]) for k in store.get(rec["id"])["doc"]["contacts"]]
    assert got == [(10, 20), (1, 2), (3, 4)]


# ----------------------------------------------------------------------------- bought-part links (ai-mcp-17)

def test_a_mcmaster_number_always_links_to_mcmaster():
    s = ai.Session(part_doc())
    _, clean, ev = s.apply("request_part_file", {"part_id": "spring", "description": "Gas spring",
                                                 "mcmaster_part_number": "4138t52", "url": "https://mcmaster-cad.example/x.zip"})
    assert clean and ev[0]["url"] == "https://www.mcmaster.com/4138T52/" and ev[0]["page"] == "https://mcmaster-cad.example/x.zip"
    rep, clean, _ = s.apply("request_part_file", {"part_id": "x", "description": "x", "mcmaster_part_number": "../evil"})
    assert not clean and "letters and digits" in rep
    rep, clean, _ = s.apply("request_part_file", {"part_id": "x", "description": "x", "url": "javascript:alert(1)"})
    assert not clean and len(s.requests) == 1
