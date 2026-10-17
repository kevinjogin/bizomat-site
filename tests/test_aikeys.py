"""Bring your own key: encrypted per-account settings, the routes, and the OpenAI-compatible adapter driving
a real copilot session (tool call streamed, feature built, reply) through a fake provider."""
import json

import httpx
import pytest
from fastapi.testclient import TestClient

from opensketch import ai, aikeys, demo, providers, server


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN", "OPENSKETCH_KEY_SECRET",
              "OPENSKETCH_AI_DEMO"):
        monkeypatch.delenv(k, raising=False)
    return tmp_path


def test_keys_are_encrypted_private_and_per_person(tmp_path):
    s = aikeys.save("u1", "openai", "some-model", "sk-test-1234567890abcd")
    assert s == {"provider": "openai", "model": "some-model", "base_url": "https://api.openai.com/v1", "hint": "...abcd",
                 "updated": s["updated"]}
    raw = (tmp_path / "data" / "ai_keys.json").read_text()
    assert "sk-test-1234567890abcd" not in raw
    assert aikeys.config_for("u1")["key"] == "sk-test-1234567890abcd"
    assert aikeys.config_for("u2") is None
    # change the model without re-pasting the key; changing provider needs a key
    assert aikeys.save("u1", "openai", "other", None)["model"] == "other"
    with pytest.raises(aikeys.KeyError_):
        aikeys.save("u1", "gemini", "m", None)
    with pytest.raises(aikeys.KeyError_):
        aikeys.save("u1", "openai", "", "sk-xxxxxxxxxx")
    with pytest.raises(aikeys.KeyError_):
        aikeys.save("u1", "custom", "m", "sk-xxxxxxxxxx", "http://127.0.0.1:11434/v1")  # private address refused
    aikeys.remove("u1")
    assert aikeys.config_for("u1") is None


def test_server_key_fallback(monkeypatch):
    assert aikeys.effective(None) is None
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-server")
    assert aikeys.effective(None)["source"] == "server"
    aikeys.save("local", "gemini", "g-model", "AIzaXXXXXXXXXXXX")
    assert aikeys.effective(None)["provider"] == "gemini"  # your own key wins
    monkeypatch.setenv("OPENSKETCH_SHARE_SERVER_KEY", "0")
    aikeys.remove("local")
    assert aikeys.effective(None) is None


def test_routes_never_return_the_key():
    c = TestClient(server.app)
    st = c.get("/api/ai/status").json()
    assert st["available"] is False and st["source"] is None
    keys = c.get("/api/ai/keys").json()
    assert keys["settings"] is None and {p["id"] for p in keys["providers"]} >= {"anthropic", "openai", "gemini", "openrouter", "custom"}
    assert c.post("/api/ai/keys", json={"provider": "openai", "model": "m", "key": "short"}).status_code == 400
    r = c.post("/api/ai/keys", json={"provider": "openrouter", "model": "vendor/model", "key": "sk-or-v1-abcdefgh9876"})
    assert r.status_code == 200 and "sk-or" not in r.text and r.json()["settings"]["hint"] == "...9876"
    st = c.get("/api/ai/status").json()
    assert st["available"] and st["source"] == "yours" and st["model"] == "vendor/model"
    assert "9876" not in json.dumps(c.get("/api/ai/keys").json()["settings"]["provider"])
    assert c.post("/api/ai/models", json={"provider": "custom", "key": "sk-xxxxxxxxxx", "base_url": "https://localhost/v1"}).status_code == 400
    assert c.delete("/api/ai/keys").json()["settings"] is None


def test_message_and_tool_translation():
    msgs = [{"role": "user", "content": "make a plate"},
            {"role": "assistant", "content": [{"type": "text", "text": "Building."},
                                              {"type": "tool_use", "id": "t1", "name": "propose_features", "input": {"a": 1}}]},
            {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "t1", "content": "ok"}]}]
    out = providers.to_openai_messages("SYS", msgs)
    assert out[0] == {"role": "system", "content": "SYS"}
    assert out[2]["tool_calls"][0]["function"] == {"name": "propose_features", "arguments": '{"a": 1}'}
    assert out[3] == {"role": "tool", "tool_call_id": "t1", "content": "ok"}
    tools = providers.to_openai_tools([{"name": "x", "description": "d", "input_schema": {"type": "object"}},
                                       {"type": "web_search_20250305", "name": "web_search"}])
    assert [t["function"]["name"] for t in tools] == ["x"]
    events = []
    lines = ['data: {"choices":[{"delta":{"content":"Hi "}}]}', 'data: {"choices":[{"delta":{"content":"there."}}]}',
             'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"id":"c1","function":{"name":"add_mate","arguments":"{\\"a\\""}}]}}]}',
             'data: {"choices":[{"delta":{"tool_calls":[{"index":0,"function":{"arguments":": 2}"}}]},"finish_reason":"tool_calls"}]}',
             'data: [DONE]']
    final = providers.translate_stream(lines, events.append)
    assert [e.type for e in events].count("content_block_start") == 2
    assert final.stop_reason == "tool_use" and final.content[0].text == "Hi there."
    assert final.content[1].name == "add_mate" and final.content[1].input == {"a": 2}
    assert providers.plain_blocks(final.content)[1] == {"type": "tool_use", "id": "c1", "name": "add_mate", "input": {"a": 2}}


def _sse(chunks):
    return "".join(f"data: {json.dumps(c)}\n\n" for c in chunks) + "data: [DONE]\n\n"


def test_openai_compatible_provider_runs_a_copilot_session(monkeypatch):
    """A fake OpenAI-compatible server: first answer streams a propose_features call in pieces, the second a reply.
    The session must build the part live (build_step events) and finish with a proposal."""
    feats = demo.bracket_features()[:2]  # sketch + extrude
    args = json.dumps({"mode": "replace", "summary": "Base plate", "features": feats})
    seen = []

    def handler(request: httpx.Request):
        body = json.loads(request.content)
        seen.append(body)
        assert request.headers["authorization"] == "Bearer sk-fake-1234567890"
        assert request.url.path == "/v1/chat/completions" and body["model"] == "fake-model" and body["stream"]
        if len(seen) == 1:
            pieces = [args[i:i + 40] for i in range(0, len(args), 40)]
            chunks = [{"choices": [{"delta": {"content": "Base plate first."}}]},
                      {"choices": [{"delta": {"tool_calls": [{"index": 0, "id": "call_1", "type": "function",
                                                              "function": {"name": "propose_features", "arguments": ""}}]}}]}]
            chunks += [{"choices": [{"delta": {"tool_calls": [{"index": 0, "function": {"arguments": p}}]}}]} for p in pieces]
            chunks.append({"choices": [{"delta": {}, "finish_reason": "tool_calls"}]})
        else:
            assert body["messages"][-1]["role"] == "tool" and body["messages"][-1]["tool_call_id"] == "call_1"
            chunks = [{"choices": [{"delta": {"content": "Done: an 80 x 50 x 8 mm plate."}, "finish_reason": "stop"}]}]
        return httpx.Response(200, text=_sse(chunks), headers={"content-type": "text/event-stream"})

    real = httpx.Client
    monkeypatch.setattr(providers.httpx, "Client", lambda **kw: real(transport=httpx.MockTransport(handler), **kw))
    cfg = {"provider": "custom", "model": "fake-model", "base_url": "https://llm.example.com/v1", "key": "sk-fake-1234567890", "source": "yours"}
    doc = {"version": 1, "name": "Part1", "units": "mm", "features": [], "rollback": None, "seq": 1}
    events = list(ai.run_stream(doc, "An 80 x 50 x 8 plate", ai_config=cfg))
    kinds = [e["ev"] for e in events]
    assert "error" not in kinds, events[-1]
    assert "build_step" in kinds and "tool_done" in kinds
    done = events[-1]
    assert done["ev"] == "done" and done["reply"].startswith("Done") and len(done["proposal"]["features"]) == 2
    names = {t["function"]["name"] for t in seen[0]["tools"]}
    assert "propose_features" in names and not {"web_search", "web_fetch"} & names  # no Anthropic server tools elsewhere
    assert "Web search and page reading are not available" in seen[0]["messages"][0]["content"]


def test_provider_errors_reach_the_chat(monkeypatch):
    real = httpx.Client
    monkeypatch.setattr(providers.httpx, "Client", lambda **kw: real(transport=httpx.MockTransport(
        lambda r: httpx.Response(401, json={"error": {"message": "Incorrect API key"}})), **kw))
    cfg = {"provider": "openai", "model": "m", "base_url": "https://api.openai.com/v1", "key": "sk-bad-1234567890", "source": "yours"}
    events = list(ai.run_stream({"version": 1, "name": "P", "units": "mm", "features": []}, "x", ai_config=cfg))
    assert events[-1]["ev"] == "error" and "Incorrect API key" in events[-1]["message"] and "AI model and key" in events[-1]["message"]
    no_key = list(ai.run_stream({"version": 1, "name": "P", "units": "mm", "features": []}, "x"))
    assert no_key[-1]["ev"] == "error" and "API key" in no_key[-1]["message"]
