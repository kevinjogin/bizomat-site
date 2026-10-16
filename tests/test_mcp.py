"""Server documents, the password gate and the MCP endpoint (a real MCP client over HTTP)."""
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, server, store


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def test_store_versions_conflict_undo_restore():
    rec = store.create("Plate")
    v2 = store.save(rec["id"], dict(rec["doc"], features=[{"id": "a"}]), "claude", "Added a", base_version=1)
    assert v2["version"] == 2 and v2["by"] == "claude"
    with pytest.raises(store.Conflict):
        store.save(rec["id"], rec["doc"], "you", base_version=1)  # based on an old version
    u = store.undo(rec["id"], "you")
    assert u["version"] == 3 and u["doc"]["features"] == [] and u["summary"].startswith("Undid")
    r = store.restore(rec["id"], 2, "you")
    assert r["doc"]["features"] == [{"id": "a"}]
    assert [v["version"] for v in store.versions(rec["id"])] == [3, 2, 1]
    assert store.listing()[0]["id"] == rec["id"]
    with pytest.raises(store.NotFound):
        store.get("../etc/passwd")


def test_password_gate(monkeypatch):
    c = TestClient(server.app)
    assert c.get("/api/docs").status_code == 200  # no password: open, as before
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "s3cret")
    c = TestClient(server.app)
    r = c.get("/", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("/login")
    assert c.get("/api/docs").status_code == 401
    assert c.post("/login", data={"password": "nope", "next": "/"}, follow_redirects=False).status_code == 401
    r = c.post("/login", data={"password": "s3cret", "next": "//evil.example"}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/"  # no open redirect
    assert c.get("/api/docs").status_code == 200  # cookie set
    assert c.post(f"/mcp/{'0' * 32}").status_code == 404  # wrong MCP address


def test_mcp_token_follows_password(monkeypatch):
    t1 = auth.mcp_token()
    assert t1 == auth.mcp_token() and len(t1) == 32  # stable random secret without a password
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "a")
    ta = auth.mcp_token()
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "b")
    assert auth.mcp_token() != ta  # changing the password changes the address


def _rpc(c, url, method, params=None, i=1):
    r = c.post(url, json={"jsonrpc": "2.0", "id": i, "method": method, "params": params or {}},
               headers={"Accept": "application/json, text/event-stream"})
    assert r.status_code == 200, r.text
    return r.json()["result"]


def test_mcp_tools_build_and_save(monkeypatch):
    from tests.test_assembly import plate
    with TestClient(server.app) as c:  # runs the lifespan (MCP session manager)
        url = f"/mcp/{auth.mcp_token()}"
        init = _rpc(c, url, "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                           "clientInfo": {"name": "test", "version": "1"}})
        assert init["serverInfo"]["name"] == "OpenSketch"
        names = {t["name"] for t in _rpc(c, url, "tools/list")["tools"]}
        assert {"create_document", "create_part", "add_mate", "standard_part", "get_document", "undo_last_change"} <= names
        call = lambda name, args: json.loads(_rpc(c, url, "tools/call", {"name": name, "arguments": args})["content"][0]["text"])
        d = call("create_document", {"name": "Plate"})
        r = call("create_part", {"doc_id": d["doc_id"], "part_id": "plate", "name": "Plate", "features": plate()["features"]})
        assert r["clean"] and r["version"] == 2
        r = call("add_mate", {"doc_id": d["doc_id"], "type": "hinge", "refs": [{"component": "x", "ref": "Y axis"}] * 2,
                              "angle_min": 0, "angle_max": 90})
        assert store.get(d["doc_id"])["doc"]["mates"][0]["angle_max"] == 90  # hinge limits are kept
        # the browser saw it: the document is on the server with Claude as the author
        head = c.get(f"/api/docs/{d['doc_id']}/head").json()
        assert head["by"] == "claude" and head["version"] == r["version"]
