"""Audit fixes (2026-10-19): safe redirects, same-origin writes, sign-in limits, failing closed, upload caps,
macro job owners, bounded chat memory."""
import gzip
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import ai, auth, server


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    auth._fails.clear()
    return tmp_path


def _owner():
    c = TestClient(server.app)
    c.post("/setup", data={"name": "YZ", "email": "yz@example.com", "new_password": "correct horse", "next": "/"})
    return c


def test_next_never_leaves_the_site():
    for bad in ("//evil.com", "/\t/evil.com", "/\r/evil.com", "/\n/evil.com", "/\\evil.com", "https://evil.com", "evil.com",
                "/\x7f/evil.com", ""):
        assert auth._safe_next(bad) == "/", bad
    assert auth._safe_next("/?doc=abc&view=files") == "/?doc=abc&view=files"


def test_cross_site_writes_are_refused():
    c = _owner()
    ok = c.post("/api/docs", json={"name": "", "kind": "part"}, headers={"Origin": "http://testserver", "Sec-Fetch-Site": "same-origin"})
    assert ok.status_code == 200
    for h in ({"Origin": "https://evil.example"}, {"Sec-Fetch-Site": "cross-site"}, {"Sec-Fetch-Site": "same-site"}, {"Origin": "null"}):
        r = c.post("/api/docs", json={"name": "x"}, headers=h)
        assert r.status_code == 403, h
        assert c.post("/api/import/raw?filename=a.step", content=b"x", headers={"Content-Type": "text/plain", **h}).status_code == 403
    # reads and the MCP endpoint are not browser writes
    assert c.get("/api/docs", headers={"Origin": "https://evil.example"}).status_code == 200


def test_sign_in_guessing_is_limited():
    _owner().get("/logout")
    c = TestClient(server.app)
    codes = [c.post("/login", data={"email": "yz@example.com", "password": f"wrong {i}"}, follow_redirects=False).status_code
             for i in range(auth.LIMIT + 1)]
    assert codes[:auth.LIMIT] == [401] * auth.LIMIT and codes[-1] == 429
    # even the right password waits now (no hash is tried while limited)
    r = c.post("/login", data={"email": "yz@example.com", "password": "correct horse"}, follow_redirects=False)
    assert r.status_code == 429 and b"Too many tries" in r.content
    auth._fails.clear()
    assert c.post("/login", data={"email": "yz@example.com", "password": "correct horse"}, follow_redirects=False).status_code == 303


def test_a_damaged_accounts_file_fails_closed(tmp_path):
    c = _owner()
    users = tmp_path / "data" / "users.json"
    users.write_text("{not json")
    anon = TestClient(server.app)
    assert anon.get("/api/docs").status_code == 503  # never "no accounts, open to everyone"
    users.unlink()
    assert anon.get("/api/docs").status_code == 503  # missing after accounts existed: closed too
    assert anon.get("/api/account").status_code == 503


def test_uploads_are_capped_and_gzip_bombs_refused(monkeypatch):
    monkeypatch.setattr(server, "IMPORT_MAX", 1000)
    c = TestClient(server.app)
    assert c.post("/api/import/raw?filename=a.step", content=b"x" * 2000).status_code == 413
    bomb = gzip.compress(b"\0" * 50000)
    assert len(bomb) < 1000
    assert c.post("/api/import/raw?filename=a.step", content=bomb, headers={"X-OpenSketch-Gzip": "1"}).status_code == 413


def test_macro_exports_belong_to_whoever_started_them(monkeypatch):
    owner = _owner()
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    member = TestClient(server.app)
    member.post(f"/join/{token}", data={"name": "Mei", "email": "mei@example.com", "new_password": "battery staple"})
    import threading
    monkeypatch.setattr(server.sldexport, "export", lambda *a, **k: threading.Event().wait(2) or {})
    from opensketch import demo
    doc = {"version": 1, "name": "B", "units": "mm", "features": demo.bracket_features(), "seq": 1000, "rollback": None}
    jid = owner.post("/api/export/sldmacro/start", json={"doc": doc}).json()["job"]
    assert owner.get(f"/api/export/sldmacro/{jid}").status_code == 200
    assert member.get(f"/api/export/sldmacro/{jid}").status_code == 404
    assert member.get(f"/api/export/sldmacro/{jid}/zip").status_code == 404
    owner.post("/api/export/sldmacro/start", json={"doc": doc})
    assert owner.post("/api/export/sldmacro/start", json={"doc": doc}).status_code == 429  # two at once per person


def test_chat_memory_is_bounded():
    conv = ai._Conversations()
    for i in range(conv.MAX + 50):
        conv.setdefault(f"c{i}", [])
    assert len(conv) == conv.MAX and "c0" not in conv and f"c{conv.MAX + 49}" in conv
    conv.setdefault("c60", [])  # touched: kept as newest
    conv.setdefault("new", [])
    assert "c60" in conv and "c50" not in conv


def test_mcp_review_publish_checks_the_owner():
    owner = _owner()
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    member = TestClient(server.app)
    member.post(f"/join/{token}", data={"name": "Mei", "email": "mei@example.com", "new_password": "battery staple"})
    from tests.test_mcp import _rpc
    mine = owner.post("/api/docs", json={"name": "Secret", "kind": "assembly"}).json()
    with TestClient(server.app) as c:
        url = "/mcp/" + member.get("/api/connect").json()["mcp_url"].split("/mcp/")[1]
        _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
        r = c.post(url, json={"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "publish_review", "arguments": {"doc_id": mine["id"]}}},
                   headers={"Accept": "application/json, text/event-stream"}).json()
        text = json.dumps(r)
        assert "/review/" not in text and ("No document" in text or "error" in text.lower())
