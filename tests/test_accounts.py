"""Accounts: owner setup, sign in and out, sessions, invites, password reset, and that MCP is unaffected."""
import json

import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, auth, server


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.delenv("OPENSKETCH_MCP_TOKEN", raising=False)
    return tmp_path


def _owner(c, email="owner@example.com", pw="correct horse", server_pw=None):
    form = {"name": "Owner", "email": email, "new_password": pw, "next": "/"}
    if server_pw is not None:
        form["server_password"] = server_pw
    return c.post("/setup", data=form, follow_redirects=False)


def test_open_mode_setup_turns_sign_in_on(tmp_path):
    c = TestClient(server.app)
    assert c.get("/api/solidworks").status_code == 200  # nobody, no password: open as before
    assert c.get("/api/account").json()["mode"] == "open"
    assert c.get("/login", follow_redirects=False).headers["location"] == "/setup"
    assert _owner(c, pw="short").status_code == 400  # too short
    r = _owner(c)
    assert r.status_code == 303 and "opensketch_user=" in r.headers["set-cookie"]
    me = c.get("/api/account").json()
    assert me["mode"] == "accounts" and me["user"]["email"] == "owner@example.com" and me["user"]["role"] == "owner"
    anon = TestClient(server.app)
    assert anon.get("/api/solidworks").status_code == 401
    assert anon.get("/", follow_redirects=False).headers["location"].startswith("/login")
    assert _owner(anon, email="x@example.com").headers["location"] == "/login"  # setup is closed now
    # files keep no password and no usable session token
    raw = (tmp_path / "data" / "users.json").read_text() + (tmp_path / "data" / "sessions.json").read_text()
    assert "correct horse" not in raw and c.cookies.get("opensketch_user") not in raw


def test_sign_in_wrong_password_sign_out():
    c = TestClient(server.app)
    _owner(c)
    c.get("/logout")
    assert c.get("/api/solidworks").status_code == 401  # the session is gone on the server
    bad = c.post("/login", data={"email": "owner@example.com", "password": "nope", "next": "/"}, follow_redirects=False)
    assert bad.status_code == 401 and b"wrong" in bad.content
    assert c.post("/login", data={"email": "nobody@example.com", "password": "x"}, follow_redirects=False).status_code == 401
    r = c.post("/login", data={"email": "Owner@Example.com ", "password": "correct horse", "next": "//evil.example"}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/"  # no open redirect
    assert c.get("/api/solidworks").status_code == 200


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
    assert old.get("/api/solidworks").status_code == 401  # accounts now: the shared password cookie no longer signs in
    assert c.get("/api/account").json()["user"]["name"] == "Owner"


def test_invites_members_and_owner_rules():
    owner = TestClient(server.app)
    _owner(owner)
    inv = owner.post("/api/account/invites").json()
    assert inv["url"].split("/join/")[1] and inv["days"] == 7
    token = inv["url"].split("/join/")[1]
    guest = TestClient(server.app)
    assert guest.get(f"/join/{token}").status_code == 200
    assert guest.post(f"/join/{token}", data={"name": "Tom", "email": "owner@example.com", "new_password": "longenough"},
                      follow_redirects=False).status_code == 400  # email taken
    r = guest.post(f"/join/{token}", data={"name": "Tom", "email": "t@example.com", "new_password": "longenough"}, follow_redirects=False)
    assert r.status_code == 303 and guest.get("/api/solidworks").status_code == 200
    assert TestClient(server.app).get(f"/join/{token}").status_code == 410  # single use
    me = guest.get("/api/account").json()
    assert me["user"]["role"] == "member" and "users" not in me
    assert guest.post("/api/account/invites").status_code == 403  # members cannot invite
    users = owner.get("/api/account").json()["users"]
    assert {u["email"] for u in users} == {"owner@example.com", "t@example.com"}
    owner_id = next(u["id"] for u in users if u["role"] == "owner")
    member_id = next(u["id"] for u in users if u["role"] == "member")
    assert owner.delete(f"/api/account/users/{owner_id}").status_code == 400
    assert owner.delete(f"/api/account/users/{member_id}").status_code == 200
    assert guest.get("/api/solidworks").status_code == 401  # removed: signed out at once


def test_change_password_and_reset(monkeypatch):
    c = TestClient(server.app)
    _owner(c)
    assert c.post("/api/account", json={"current_password": "wrong", "new_password": "a new password"}).status_code == 400
    assert c.post("/api/account", json={"current_password": "correct horse", "new_password": "a new password"}).json()["signed_out"]
    assert c.get("/api/solidworks").status_code == 401  # every session ends on a password change
    assert c.post("/login", data={"email": "owner@example.com", "password": "a new password"}, follow_redirects=False).status_code == 303
    assert c.post("/api/account", json={"name": "Olivia"}).json()["user"]["name"] == "Olivia"
    # reset needs the server password
    assert TestClient(server.app).get("/reset", follow_redirects=False).headers["location"] == "/login"
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    r = TestClient(server.app)
    assert r.post("/reset", data={"email": "owner@example.com", "server_password": "nope", "new_password": "third password"}).status_code == 401
    assert r.post("/reset", data={"email": "owner@example.com", "server_password": "server-secret", "new_password": "third password"},
                  follow_redirects=False).status_code == 303
    assert r.get("/api/solidworks").status_code == 200


def test_mcp_ignores_accounts():
    token_before = auth.mcp_token()
    c = TestClient(server.app)
    _owner(c)
    assert auth.mcp_token() == token_before  # Claude's connector address does not change
    with TestClient(server.app) as anon:
        r = anon.post(f"/mcp/{token_before}", headers={"accept": "application/json, text/event-stream", "content-type": "application/json"},
                      content=json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize",
                                          "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}}}))
        assert r.status_code == 200


def _google(monkeypatch, info):
    from opensketch import oauth
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "cid.apps.googleusercontent.com")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "secret")

    async def fake(code, redirect_uri):
        assert code == "good-code" and redirect_uri.endswith("/auth/google/callback")
        return info
    monkeypatch.setattr(oauth, "exchange", fake)


def _google_round(c, invite=""):
    from urllib.parse import parse_qs, urlparse
    r = c.get("/auth/google" + (f"?invite={invite}" if invite else ""), follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("https://accounts.google.com/")
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    return c.get(f"/auth/google/callback?state={state}&code=good-code", follow_redirects=False)


def test_google_sign_in_links_by_verified_email(monkeypatch):
    c = TestClient(server.app)
    assert b"Continue with Google" not in c.get("/login").content  # not configured: no button
    _owner(c)
    c.get("/logout")
    # a Google account made for a non-Google address (no hd) cannot take over an account with a password
    _google(monkeypatch, {"sub": "g-x", "email": "Owner@example.com", "email_verified": True, "name": "Someone"})
    r = _google_round(c)
    assert r.status_code == 403 and b"Sign in with its password" in r.content
    # Gmail or a Workspace account in its own domain (hd) links itself
    _google(monkeypatch, {"sub": "g-1", "email": "Owner@example.com", "email_verified": True, "name": "Owner", "hd": "example.com"})
    assert b"Continue with Google" in c.get("/login").content
    r = _google_round(c)
    assert r.status_code == 303 and r.headers["location"] == "/"
    me = c.get("/api/account").json()["user"]
    assert me["email"] == "owner@example.com" and me["google"] and me["role"] == "owner"
    # a forged state is refused
    r = c.get("/auth/google/callback?state=nope&code=good-code", follow_redirects=False)
    assert r.status_code == 400 and b"expired" in r.content


def test_google_sign_up_needs_an_invite_or_open_sign_up(monkeypatch):
    owner = TestClient(server.app)
    _owner(owner)
    _google(monkeypatch, {"sub": "g-2", "email": "new@example.com", "email_verified": True, "name": "New Person"})
    stranger = TestClient(server.app)
    r = _google_round(stranger)
    assert r.status_code == 403 and b"invite-only" in r.content
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    assert b"Join with Google" in stranger.get(f"/join/{token}").content
    r = _google_round(stranger, token)
    assert r.status_code == 303 and stranger.get("/api/account").json()["user"]["name"] == "New Person"
    assert not accounts.invite_valid(token)
    # Google-only accounts have no password until they set one
    me = stranger.get("/api/account").json()["user"]
    assert me["has_password"] is False
    assert stranger.post("/login", data={"email": "new@example.com", "password": ""}, follow_redirects=False).status_code == 401
    assert stranger.post("/api/account", json={"new_password": "now a password"}).json()["signed_out"]
    assert stranger.post("/login", data={"email": "new@example.com", "password": "now a password"}, follow_redirects=False).status_code == 303
    # open sign-up
    _google(monkeypatch, {"sub": "g-3", "email": "third@example.com", "email_verified": True, "name": "Third"})
    assert owner.post("/api/account/settings", json={"open_signup": True}).json()["open_signup"] is True
    assert stranger.post("/api/account/settings", json={"open_signup": False}).status_code == 403  # members cannot
    third = TestClient(server.app)
    assert _google_round(third).status_code == 303
    fourth = TestClient(server.app)
    assert b"Create an account" in fourth.get("/login").content
    r = fourth.post("/signup", data={"name": "Four", "email": "four@example.com", "new_password": "fourfourfour"}, follow_redirects=False)
    assert r.status_code == 303 and fourth.get("/api/account").json()["user"]["role"] == "member"
    # an unverified Google email never creates or links an account
    _google(monkeypatch, {"sub": "g-5", "email": "owner@example.com", "email_verified": False, "name": "Fake"})
    r = _google_round(TestClient(server.app))
    assert r.status_code == 400 and b"not verified" in r.content


def test_google_before_any_account(monkeypatch):
    _google(monkeypatch, {"sub": "g-9", "email": "a@example.com", "email_verified": True, "name": "A"})
    r = _google_round(TestClient(server.app))
    assert r.status_code == 400 and b"owner account first" in r.content
    assert not accounts.any_users()


def test_owner_turns_google_on_in_the_app(monkeypatch, tmp_path):
    """No server settings needed: the owner pastes a Google Cloud client; it is checked, stored encrypted,
    drives the sign-in button and the redirect to Google, and can be turned off. Members cannot touch it."""
    import httpx
    from urllib.parse import parse_qs, urlparse
    from opensketch import oauth
    monkeypatch.delenv("GOOGLE_CLIENT_ID", raising=False)
    monkeypatch.delenv("GOOGLE_CLIENT_SECRET", raising=False)
    sent = []

    def fake_post(url, data=None, timeout=None):  # Google's token endpoint answering a made-up code
        sent.append(data)
        err = "invalid_grant" if data["client_secret"] == "GOCSPX-right-secret" else "invalid_client"
        return httpx.Response(400 if err == "invalid_grant" else 401, json={"error": err}, request=httpx.Request("POST", url))
    monkeypatch.setattr(oauth.httpx, "post", fake_post)
    owner = TestClient(server.app)
    _owner(owner)
    st = owner.get("/api/account/google").json()
    assert st == {"enabled": False, "source": None, "client_id": "", "redirect_uri": "http://testserver/auth/google/callback", "updated": None}
    cid = "123-abc.apps.googleusercontent.com"
    assert "ends with" in owner.post("/api/account/google", json={"client_id": "123-abc", "client_secret": "GOCSPX-right-secret"}).json()["error"]
    assert "Client secret" in owner.post("/api/account/google", json={"client_id": cid, "client_secret": ""}).json()["error"]
    r = owner.post("/api/account/google", json={"client_id": cid, "client_secret": "GOCSPX-wrong-secret"})
    assert r.status_code == 400 and "does not accept" in r.json()["error"] and not oauth.enabled()
    r = owner.post("/api/account/google", json={"client_id": cid, "client_secret": "GOCSPX-right-secret"})
    assert r.status_code == 200 and r.json()["enabled"] and r.json()["source"] == "app" and r.json()["client_id"] == cid
    assert sent[-1]["redirect_uri"] == "http://testserver/auth/google/callback"
    assert "GOCSPX-right-secret" not in (tmp_path / "data" / "google_oauth.json").read_text()  # encrypted
    assert "GOCSPX" not in owner.get("/api/account/google").text
    assert owner.get("/api/account").json()["google"] is True
    anon = TestClient(server.app)
    assert b"Continue with Google" in anon.get("/login").content
    loc = anon.get("/auth/google", follow_redirects=False).headers["location"]
    assert parse_qs(urlparse(loc).query)["client_id"] == [cid]
    # members cannot read or change it
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    member = TestClient(server.app)
    member.post(f"/join/{token}", data={"name": "Mei", "email": "mei@example.com", "new_password": "battery staple"})
    assert member.get("/api/account/google").status_code == 403
    assert member.post("/api/account/google", json={"client_id": cid, "client_secret": "GOCSPX-right-secret"}).status_code == 403
    assert member.delete("/api/account/google").status_code == 403
    # the server's own settings win and cannot be changed through the API
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "env.apps.googleusercontent.com")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "env-secret")
    assert owner.get("/api/account/google").json()["source"] == "server"
    assert owner.post("/api/account/google", json={"client_id": cid, "client_secret": "GOCSPX-right-secret"}).status_code == 400
    monkeypatch.delenv("GOOGLE_CLIENT_ID")
    monkeypatch.delenv("GOOGLE_CLIENT_SECRET")
    # off again
    assert owner.delete("/api/account/google").json()["enabled"] is False
    assert b"Continue with Google" not in anon.get("/login").content
    assert anon.get("/auth/google", follow_redirects=False).headers["location"] == "/login"
    # Google unreachable: saved unchecked rather than blocked
    monkeypatch.setattr(oauth.httpx, "post", lambda *a, **k: (_ for _ in ()).throw(httpx.ConnectError("offline")))
    assert owner.post("/api/account/google", json={"client_id": cid, "client_secret": "GOCSPX-any-secret"}).json()["enabled"]


def test_privacy_page_is_public():
    c = TestClient(server.app)
    _owner(c)
    anon = TestClient(server.app)
    r = anon.get("/privacy", follow_redirects=False)
    assert r.status_code == 200 and b"Sign in with Google" in r.content and b"not sold" in r.content
    assert b'href="/privacy"' in anon.get("/login").content


def test_early_access_code_skips_sign_up_as_an_internal_tester(monkeypatch):
    """Showcase visitors type a code, skip sign-up and show up as Internal tester."""
    monkeypatch.delenv("OPENSKETCH_ACCESS_CODE", raising=False)
    auth._fails.clear()
    owner = TestClient(server.app)
    _owner(owner)
    visitor = TestClient(server.app)
    assert visitor.get("/access").status_code == 410  # no code set: closed
    assert b"/access" not in visitor.get("/login").content

    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "showcase")  # the server's code (fly.toml)
    assert b'href="/access"' in visitor.get("/login").content
    assert b'value="showcase"' in visitor.get("/access?code=showcase").content  # a link can carry the code
    r = visitor.post("/access", data={"code": "access21", "next": "/"}, follow_redirects=False)
    assert r.status_code == 401 and b"not right" in r.content
    r = visitor.post("/access", data={"code": " Showcase ", "next": "/?step=2"}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/?step=2" and "opensketch_user=" in r.headers["set-cookie"]
    me = visitor.get("/api/account").json()["user"]
    assert me["name"] == "Internal tester 1" and me["tester"] and me["role"] == "tester"
    assert "access" not in visitor.get("/api/account").json()  # the code is the owner's to see
    assert visitor.get("/access", follow_redirects=False).headers["location"] == "/"  # already in
    # their own SOLIDWORKS key, not the owner's
    assert visitor.get("/api/solidworks").json()["key"] != owner.get("/api/solidworks").json()["key"]
    second = TestClient(server.app)
    second.post("/access", data={"code": "showcase", "next": "/"})
    assert second.get("/api/account").json()["user"]["name"] == "Internal tester 2"

    # the owner sees, changes, turns off and clears it
    a = owner.get("/api/account").json()["access"]
    assert a == {"code": "showcase", "on": True, "source": "server", "testers": 2, "link": "http://testserver/access"}
    assert owner.post("/api/account/settings", json={"access_code": "no"}).status_code == 400  # too short
    assert owner.post("/api/account/settings", json={"access_code": "showcase-2026"}).json()["access"]["code"] == "showcase-2026"
    third = TestClient(server.app)
    assert third.post("/access", data={"code": "showcase"}, follow_redirects=False).status_code == 401  # the old code is gone
    assert third.post("/access", data={"code": "SHOWCASE-2026"}, follow_redirects=False).status_code == 303
    assert owner.post("/api/account/settings", json={"access_on": False}).json()["access"]["on"] is False
    assert TestClient(server.app).get("/access").status_code == 410
    t2 = second.get("/api/account").json()["user"]["id"]
    assert owner.delete(f"/api/account/users/{t2}").status_code == 200
    assert second.get("/api/solidworks").status_code == 401
    assert visitor.post("/api/account/settings", json={"access_on": True}).status_code == 403  # owner only
    assert owner.delete("/api/account/testers").json() == {"removed": 2}
    assert visitor.get("/api/solidworks").status_code == 401  # signed out at once
    assert [u["role"] for u in accounts.list_users()] == ["owner"]


def test_access_code_guessing_is_limited(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_ACCESS_CODE", "showcase")
    auth._fails.clear()
    _owner(TestClient(server.app))
    c = TestClient(server.app)
    codes = [c.post("/access", data={"code": f"guess{i}"}, follow_redirects=False).status_code for i in range(auth.LIMIT + 1)]
    assert codes[:auth.LIMIT] == [401] * auth.LIMIT and codes[-1] == 429
    assert c.post("/access", data={"code": "showcase"}, follow_redirects=False).status_code == 429  # waits even when right
    auth._fails.clear()


