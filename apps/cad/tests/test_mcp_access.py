"""Who may use the CADOS MCP server. There is no server password: a person's own CADOS account is the only key.

- A public server with no account answers no MCP request (setup mode) until its owner creates the first account.
- Each MCP request is one signed-in person: an AI app's OAuth token (per person and app) or that person's own private
  address. Nothing else gets in.
- Suspending a person stops everything at once: sign-in, browser sessions, AI app tokens and refreshes, the private
  address and the add-in key. Resuming lets them back in without new setup for the address and key.
- Expired sessions and expired tokens are refused.
"""
import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, auth, mcpauth, server, swbridge
from tests.mcp_reply import rpc
from tests.test_mcp_oauth import ACCEPT, _connect, _mcp, _register

INIT = {"jsonrpc": "2.0", "id": 1, "method": "initialize",
        "params": {"protocolVersion": "2025-03-26", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}}}


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "http://testserver")  # a server others can reach (as on Fly)
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN"):
        monkeypatch.delenv(k, raising=False)
    auth._fails.clear()
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    return tmp_path


def _owner_with_open_signup():
    c = TestClient(server.app)
    r = c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "owner-pass-1",
                               "open_signup": "on", "next": "/"}, follow_redirects=False)
    assert r.status_code == 303, r.text
    return c


def _sign_up(email="ann@example.com", pw="anns-pass-1"):
    c = TestClient(server.app)
    r = c.post("/signup", data={"name": "Ann", "email": email, "new_password": pw}, follow_redirects=False)
    assert r.status_code == 303, r.text
    return c


def _private(c) -> str:
    return "/mcp/" + c.get("/api/solidworks").json()["private_url"].split("/mcp/")[1]


def test_a_public_server_answers_no_mcp_until_it_has_an_owner():
    with TestClient(server.app) as app:
        assert app.post(f"/mcp/{auth.mcp_token()}", json=INIT, headers=ACCEPT).status_code == 404  # not even the server-wide key
        assert app.post("/mcp", json=INIT, headers=ACCEPT).status_code == 401
        assert app.get("/api/solidworks").status_code == 401
        assert not swbridge.resolve(swbridge.key_for(None))[0]  # nor the add-in link
        assert app.get("/dashboard", follow_redirects=False).headers["location"] == "/setup"
    _owner_with_open_signup()
    with TestClient(server.app) as app:
        assert app.post("/mcp", json=INIT, headers=ACCEPT).status_code == 401  # still: sign in first


def test_each_mcp_request_is_one_signed_in_person():
    owner = _owner_with_open_signup()
    ann = _sign_up()
    with TestClient(server.app) as app:
        # an AI app (Claude, ChatGPT...) connects with OAuth: Ann signs in once, clicks Allow, and the app gets her token
        tok = _connect(ann, app, _register(app))
        r = _mcp(app, tok["access_token"], "tools/list")
        assert r.status_code == 200 and any(t["name"] == "sw_status" for t in rpc(r)["result"]["tools"])
        assert mcpauth.user_for_access(tok["access_token"])[1]["email"] == "ann@example.com"
        # no token, a made-up token, or a made-up private address: refused
        assert app.post("/mcp", json=INIT, headers=ACCEPT).status_code == 401
        assert _mcp(app, "osa_" + "x" * 40, "tools/list").status_code == 401
        assert app.post("/mcp/" + "0" * 32, json=INIT, headers=ACCEPT).status_code == 404
        # her private address (for apps that cannot sign in) is hers alone, and differs from the owner's
        assert app.post(_private(ann), json=INIT, headers=ACCEPT).status_code == 200
        assert _private(ann) != _private(owner)
        # a second connect is not a second password prompt: a signed-in person only clicks Allow
        again = _connect(ann, app, _register(app, client_name="ChatGPT", redirect="https://chatgpt.com/connector_platform_oauth_redirect"),
                         redirect="https://chatgpt.com/connector_platform_oauth_redirect")
        assert _mcp(app, again["access_token"], "tools/list").status_code == 200


def test_suspending_a_person_stops_every_way_in_at_once():
    owner = _owner_with_open_signup()
    ann = _sign_up()
    ann_id = ann.get("/api/account").json()["user"]["id"]
    with TestClient(server.app) as app:
        client = _register(app)
        tok = _connect(ann, app, client)
        private, key = _private(ann), ann.get("/api/solidworks").json()["key"]
        assert swbridge.resolve(key)[0]

        # only the owner suspends, and never the owner account
        assert ann.post(f"/api/account/users/{ann_id}/suspend", json={"suspended": True}).status_code == 403
        me = owner.get("/api/account").json()["user"]["id"]
        assert owner.post(f"/api/account/users/{me}/suspend", json={"suspended": True}).status_code == 400
        r = owner.post(f"/api/account/users/{ann_id}/suspend", json={"suspended": True})
        assert r.status_code == 200 and r.json()["user"]["suspended"] is True

        assert ann.get("/api/solidworks").status_code == 401                         # her browser session ended
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 401       # her AI apps stop at once
        assert app.post(private, json=INIT, headers=ACCEPT).status_code == 404       # her private address too
        assert not swbridge.resolve(key)[0]                                           # and her add-in key
        refresh = lambda t: app.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": t,
                                                           "client_id": client["client_id"]})
        r = refresh(tok["refresh_token"])
        assert r.status_code == 400 and r.json()["error"] == "invalid_grant" and "suspended" in r.json()["error_description"]
        back = TestClient(server.app)
        r = back.post("/login", data={"email": "ann@example.com", "password": "anns-pass-1", "next": "/"})
        assert r.status_code == 403 and "suspended" in r.text                      # the right password, still no
        assert back.post("/login", data={"email": "ann@example.com", "password": "wrong-pass-1", "next": "/"}).status_code == 401
        people = {p["email"]: p for p in owner.get("/api/admin/people").json()["people"]}
        assert people["ann@example.com"]["suspended"] is True

        # resumed: she signs in again; her private address, add-in key and AI app connection all work again as they were
        assert owner.post(f"/api/account/users/{ann_id}/suspend", json={"suspended": False}).status_code == 200
        assert back.post("/login", data={"email": "ann@example.com", "password": "anns-pass-1", "next": "/"},
                         follow_redirects=False).status_code == 303
        assert app.post(private, json=INIT, headers=ACCEPT).status_code == 200 and swbridge.resolve(key)[0]
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 200
        r = refresh(tok["refresh_token"])
        assert r.status_code == 200 and _mcp(app, r.json()["access_token"], "tools/list").status_code == 200


def test_expired_sessions_and_tokens_are_refused(monkeypatch):
    _owner_with_open_signup()
    ann = _sign_up()
    with TestClient(server.app) as app:
        tok = _connect(ann, app, _register(app))
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 200
        now = accounts.time.time()
        monkeypatch.setattr(mcpauth.time, "time", lambda: now + mcpauth.ACCESS_TTL + 5)
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 401   # the app refreshes, or signs in again
        monkeypatch.setattr(accounts.time, "time", lambda: now + accounts.SESSION_DAYS * 86400 + 5)
        assert ann.get("/api/solidworks").status_code == 401
        assert ann.get("/dashboard", follow_redirects=False).headers["location"].startswith("/login")


def test_no_shared_server_password_anywhere():
    owner = _owner_with_open_signup()
    ann = _sign_up()
    pages = [TestClient(server.app).get(p).text for p in ("/login", "/signup", "/docs", "/")]
    pages += [owner.get(p).text for p in ("/dashboard", "/admin", "/settings", "/solidworks", "/assistant")]
    pages += [ann.get(p).text for p in ("/dashboard", "/settings")]
    for t in pages:
        assert "server password" not in t.lower() and "server_password" not in t and "OPENSKETCH_PASSWORD" not in t
    assert owner.get("/api/admin/server-password").status_code == 404
    assert "reset_with_server_password" not in owner.get("/api/account").json()


def test_a_connection_made_before_any_account_stops_when_others_can_reach_the_server(monkeypatch):
    """An AI app approved on a server open to its own machine (a "local" grant) works only there. Once the server can
    be reached from elsewhere and has no owner, that token and its refresh are refused (setup mode answers no MCP)."""
    monkeypatch.delenv("OPENSKETCH_PUBLIC_URL")
    local = dict(base_url="http://127.0.0.1:8000", client=("127.0.0.1", 50000))
    with TestClient(server.app, **local) as app:
        browser = TestClient(server.app, **local)
        client = _register(app)
        from tests.test_mcp_oauth import _pkce
        import re
        from urllib.parse import parse_qs, urlparse
        verifier, chal = _pkce()
        cb = "https://claude.ai/api/mcp/auth_callback"
        page = browser.get("/oauth/authorize", params={"response_type": "code", "client_id": client["client_id"], "redirect_uri": cb,
                                                       "state": "s", "code_challenge": chal, "code_challenge_method": "S256"})
        req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
        code = parse_qs(urlparse(browser.post("/oauth/authorize", data={"req": req}, follow_redirects=False).headers["location"]).query)["code"][0]
        tok = app.post("/oauth/token", data={"grant_type": "authorization_code", "code": code, "redirect_uri": cb,
                                             "client_id": client["client_id"], "code_verifier": verifier}).json()
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 200  # on its own machine: fine
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://cados.example.com")
    with TestClient(server.app, **local) as app:
        assert _mcp(app, tok["access_token"], "tools/list").status_code == 401
        r = app.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": tok["refresh_token"],
                                           "client_id": client["client_id"]})
        assert r.status_code == 400
    monkeypatch.delenv("OPENSKETCH_PUBLIC_URL")
    with TestClient(server.app, client=("203.0.113.9", 50000)) as remote:  # nor from another address
        assert _mcp(remote, tok["access_token"], "tools/list").status_code == 401


def test_a_page_on_another_site_cannot_use_a_server_open_to_its_own_machine(monkeypatch):
    """Open mode serves this machine's own programs only: a web page elsewhere (its Origin), or one that rebinds its own
    name to 127.0.0.1 (its Host), gets setup mode: no MCP, no keys, no setup from that page."""
    monkeypatch.delenv("OPENSKETCH_PUBLIC_URL")
    local = dict(base_url="http://127.0.0.1:8000", client=("127.0.0.1", 50000))
    with TestClient(server.app, **local) as app:
        assert app.post("/mcp", json=INIT, headers=ACCEPT).status_code == 200  # this machine's own program
        assert app.post("/mcp", json=INIT, headers={**ACCEPT, "Origin": "https://evil.example"}).status_code == 401
        assert app.get("/api/solidworks", headers={"Origin": "https://evil.example"}).status_code == 401
    with TestClient(server.app, base_url="http://attacker.example:8000", client=("127.0.0.1", 50000)) as rebound:
        assert rebound.get("/api/solidworks").status_code == 401
        assert rebound.post("/mcp", json=INIT, headers=ACCEPT).status_code == 401
        r = rebound.post("/setup", data={"name": "X", "email": "x@example.com", "new_password": "attacker-1"},
                         headers={"Origin": "http://attacker.example:8000"}, follow_redirects=False)
        assert r.status_code == 403 and not accounts.any_users()


def test_dot_segments_never_slip_past_sign_in():
    c = TestClient(server.app, client=("203.0.113.9", 50000))
    # (encoded, so the client sends the dots as they are; the server decodes them before routing)
    for p in ("/mcp/%2E%2E/favicon.svg", "/mcp/%2e%2e/fonts/fonts.css", "/v2/device/%2E%2E/%2E%2E/downloads/x.zip",
              "/mcp/%2E/x", "/ui//app.js", "/mcp%2F..%2Ffavicon.svg"):
        assert c.get(p).status_code == 400, p
    assert c.get("/favicon.svg").status_code == 200
