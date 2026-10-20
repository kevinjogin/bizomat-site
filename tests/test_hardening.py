"""Hardening: safe redirects, same-origin writes, sign-in limits, failing closed."""
import pytest
from fastapi.testclient import TestClient

from opensketch import auth, server


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    auth._fails.clear()
    return tmp_path


def _owner():
    c = TestClient(server.app)
    c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"})
    return c


def test_next_never_leaves_the_site():
    for bad in ("//evil.com", "/\t/evil.com", "/\r/evil.com", "/\n/evil.com", "/\\evil.com", "https://evil.com", "evil.com",
                "/\x7f/evil.com", ""):
        assert auth._safe_next(bad) == "/", bad
    assert auth._safe_next("/?a=1&step=2") == "/?a=1&step=2"


def test_cross_site_writes_are_refused():
    c = _owner()
    ok = c.post("/api/sw/key", headers={"Origin": "http://testserver", "Sec-Fetch-Site": "same-origin"})
    assert ok.status_code == 200
    for h in ({"Origin": "https://evil.example"}, {"Sec-Fetch-Site": "cross-site"}, {"Sec-Fetch-Site": "same-site"}, {"Origin": "null"}):
        assert c.post("/api/sw/key", headers=h).status_code == 403, h
        assert c.delete("/api/account/apps", headers=h).status_code == 403, h
    # reads are not cross-site writes
    assert c.get("/api/solidworks", headers={"Origin": "https://evil.example"}).status_code == 200


def test_sign_in_guessing_is_limited():
    _owner().get("/logout")
    c = TestClient(server.app)
    codes = [c.post("/login", data={"email": "owner@example.com", "password": f"wrong {i}"}, follow_redirects=False).status_code
             for i in range(auth.LIMIT + 1)]
    assert codes[:auth.LIMIT] == [401] * auth.LIMIT and codes[-1] == 429
    # even the right password waits now (no hash is tried while limited)
    r = c.post("/login", data={"email": "owner@example.com", "password": "correct horse"}, follow_redirects=False)
    assert r.status_code == 429 and b"Too many tries" in r.content
    auth._fails.clear()
    assert c.post("/login", data={"email": "owner@example.com", "password": "correct horse"}, follow_redirects=False).status_code == 303


def test_a_damaged_accounts_file_fails_closed(tmp_path):
    c = _owner()
    users = tmp_path / "data" / "users.json"
    users.write_text("{not json")
    anon = TestClient(server.app)
    assert anon.get("/api/solidworks").status_code == 503  # never "no accounts, open to everyone"
    users.unlink()
    assert anon.get("/api/solidworks").status_code == 503  # missing after accounts existed: closed too
    assert anon.get("/api/account").status_code == 503
