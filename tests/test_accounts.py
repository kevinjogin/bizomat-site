"""Accounts: owner setup, sign in and out, sessions, invites, password reset, and that MCP is unaffected."""
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, auth, server, store


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _owner(c, email="yz@example.com", pw="correct horse", server_pw=None):
    form = {"name": "YZ", "email": email, "new_password": pw, "next": "/"}
    if server_pw is not None:
        form["server_password"] = server_pw
    return c.post("/setup", data=form, follow_redirects=False)


def test_open_mode_setup_turns_sign_in_on(tmp_path):
    c = TestClient(server.app)
    assert c.get("/api/docs").status_code == 200  # nobody, no password: open as before
    assert c.get("/api/account").json()["mode"] == "open"
    assert c.get("/login", follow_redirects=False).headers["location"] == "/setup"
    assert _owner(c, pw="short").status_code == 400  # too short
    r = _owner(c)
    assert r.status_code == 303 and "opensketch_user=" in r.headers["set-cookie"]
    me = c.get("/api/account").json()
    assert me["mode"] == "accounts" and me["user"]["email"] == "yz@example.com" and me["user"]["role"] == "owner"
    anon = TestClient(server.app)
    assert anon.get("/api/docs").status_code == 401
    assert anon.get("/", follow_redirects=False).headers["location"].startswith("/login")
    assert _owner(anon, email="x@example.com").headers["location"] == "/login"  # setup is closed now
    # files keep no password and no usable session token
    raw = (tmp_path / "data" / "users.json").read_text() + (tmp_path / "data" / "sessions.json").read_text()
    assert "correct horse" not in raw and c.cookies.get("opensketch_user") not in raw


def test_sign_in_wrong_password_sign_out():
    c = TestClient(server.app)
    _owner(c)
    c.get("/logout")
    assert c.get("/api/docs").status_code == 401  # the session is gone on the server
    bad = c.post("/login", data={"email": "yz@example.com", "password": "nope", "next": "/"}, follow_redirects=False)
    assert bad.status_code == 401 and b"wrong" in bad.content
    assert c.post("/login", data={"email": "nobody@example.com", "password": "x"}, follow_redirects=False).status_code == 401
    r = c.post("/login", data={"email": "YZ@Example.com ", "password": "correct horse", "next": "//evil.example"}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/"  # no open redirect
    assert c.get("/api/docs").status_code == 200


def test_password_mode_needs_the_server_password_to_set_up(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    c = TestClient(server.app)
    assert c.get("/api/account").status_code == 401
    page = c.get("/login")
    assert page.status_code == 200 and b"Create the owner account" in page.content and b"server_password" in page.content
    assert _owner(c, server_pw="wrong").status_code == 401
    assert not accounts.any_users()
    # the old password cookie still works until the owner exists
    old = TestClient(server.app)
    old.post("/login", data={"password": "server-secret", "next": "/"})
    me = old.get("/api/account").json()
    assert me["mode"] == "password" and me["user"]["legacy"] and me["can_setup"]
    assert _owner(c, server_pw="server-secret").status_code == 303
    assert old.get("/api/docs").status_code == 401  # accounts now: the shared password cookie no longer signs in
    assert c.get("/api/account").json()["user"]["name"] == "YZ"


def test_invites_members_and_owner_rules():
    owner = TestClient(server.app)
    _owner(owner)
    inv = owner.post("/api/account/invites").json()
    assert inv["url"].split("/join/")[1] and inv["days"] == 7
    token = inv["url"].split("/join/")[1]
    guest = TestClient(server.app)
    assert guest.get(f"/join/{token}").status_code == 200
    assert guest.post(f"/join/{token}", data={"name": "Tiff", "email": "yz@example.com", "new_password": "longenough"},
                      follow_redirects=False).status_code == 400  # email taken
    r = guest.post(f"/join/{token}", data={"name": "Tiff", "email": "t@example.com", "new_password": "longenough"}, follow_redirects=False)
    assert r.status_code == 303 and guest.get("/api/docs").status_code == 200
    assert TestClient(server.app).get(f"/join/{token}").status_code == 410  # single use
    me = guest.get("/api/account").json()
    assert me["user"]["role"] == "member" and "users" not in me
    assert guest.post("/api/account/invites").status_code == 403  # members cannot invite
    users = owner.get("/api/account").json()["users"]
    assert {u["email"] for u in users} == {"yz@example.com", "t@example.com"}
    owner_id = next(u["id"] for u in users if u["role"] == "owner")
    member_id = next(u["id"] for u in users if u["role"] == "member")
    assert owner.delete(f"/api/account/users/{owner_id}").status_code == 400
    assert owner.delete(f"/api/account/users/{member_id}").status_code == 200
    assert guest.get("/api/docs").status_code == 401  # removed: signed out at once


def test_change_password_and_reset(monkeypatch):
    c = TestClient(server.app)
    _owner(c)
    assert c.post("/api/account", json={"current_password": "wrong", "new_password": "a new password"}).status_code == 400
    assert c.post("/api/account", json={"current_password": "correct horse", "new_password": "a new password"}).json()["signed_out"]
    assert c.get("/api/docs").status_code == 401  # every session ends on a password change
    assert c.post("/login", data={"email": "yz@example.com", "password": "a new password"}, follow_redirects=False).status_code == 303
    assert c.post("/api/account", json={"name": "Yuanzheng"}).json()["user"]["name"] == "Yuanzheng"
    # reset needs the server password
    assert TestClient(server.app).get("/reset", follow_redirects=False).headers["location"] == "/login"
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    r = TestClient(server.app)
    assert r.post("/reset", data={"email": "yz@example.com", "server_password": "nope", "new_password": "third password"}).status_code == 401
    assert r.post("/reset", data={"email": "yz@example.com", "server_password": "server-secret", "new_password": "third password"},
                  follow_redirects=False).status_code == 303
    assert r.get("/api/docs").status_code == 200


def test_mcp_and_reviews_ignore_accounts():
    token_before = auth.mcp_token()
    c = TestClient(server.app)
    _owner(c)
    assert auth.mcp_token() == token_before  # Claude's connector address does not change
    with TestClient(server.app) as anon:
        r = anon.post(f"/mcp/{token_before}", headers={"accept": "application/json, text/event-stream", "content-type": "application/json"},
                      content=json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                                          "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}}}))
        assert r.status_code == 200
        assert anon.get("/review/nonexistenttoken000000000000").status_code == 404  # not a sign-in redirect
