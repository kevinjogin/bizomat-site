"""Sign in with BIZOMAT (opensketch/bizomat_id.py): off without its secret; PKCE and state; the code swapped server to
server with the client secret; accounts linked by a confirmed email, created only from an invite or open sign-up."""
import base64
from urllib.parse import parse_qs, urlparse

import httpx
import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, bizomat_id, server

SECRET = "s" * 40


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "BIZOMAT_ID_CLIENT_SECRET", "BIZOMAT_ID_CLIENT_ID",
              "BIZOMAT_ID_URL", "BIZOMAT_SITE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"):
        monkeypatch.delenv(k, raising=False)
    return tmp_path


def _owner(c, email="owner@example.com", pw="correct horse"):
    return c.post("/setup", data={"name": "Owner", "email": email, "new_password": pw, "next": "/"}, follow_redirects=False)


def _on(monkeypatch, info=None):
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    if info is not None:
        async def fake(code, redirect_uri, state):
            assert code == "good-code" and redirect_uri.endswith("/auth/bizomat/callback") and state
            return info
        monkeypatch.setattr(bizomat_id, "exchange", fake)


def _round(c, invite="", nxt=""):
    q = "&".join(x for x in (f"invite={invite}" if invite else "", f"next={nxt}" if nxt else "") if x)
    r = c.get("/auth/bizomat" + ("?" + q if q else ""), follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("https://bizomat.ai/company/authorize?")
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    return c.get(f"/auth/bizomat/callback?state={state}&code=good-code", follow_redirects=False)


def test_off_without_a_good_secret(monkeypatch):
    c = TestClient(server.app)
    _owner(c)
    assert c.get("/api/account").json()["bizomat"] is False
    c.get("/logout")
    assert b"with BIZOMAT" not in c.get("/login").content
    assert c.get("/auth/bizomat", follow_redirects=False).headers["location"] == "/login"
    for bad in ("short", "has a space" + "x" * 40):
        monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", bad)
        assert not bizomat_id.enabled()
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_ID", "not a client id")
    assert not bizomat_id.enabled()


def test_start_sends_the_browser_to_bizomat_with_pkce(monkeypatch):
    c = TestClient(server.app)
    _owner(c)
    _on(monkeypatch)
    assert c.get("/api/account").json()["bizomat"] is True
    c.get("/logout")
    page = c.get("/login").content
    assert b"Continue with BIZOMAT" in page and b'href="/auth/bizomat"' in page and b"or with email" in page
    r = c.get("/auth/bizomat?next=/history", follow_redirects=False)
    assert r.status_code == 303
    url = urlparse(r.headers["location"])
    assert (url.scheme, url.netloc, url.path) == ("https", "bizomat.ai", "/company/authorize")
    q = {k: v[0] for k, v in parse_qs(url.query).items()}
    assert q["client_id"] == "cad" and q["redirect_uri"] == "http://testserver/auth/bizomat/callback"
    assert q["code_challenge_method"] == "S256"
    verifier = bizomat_id.verifier_for(q["state"])
    assert len(verifier) == 43 and q["code_challenge"] == bizomat_id.challenge(verifier) != verifier
    cookie = r.headers["set-cookie"]
    assert cookie.startswith(bizomat_id.STATE_COOKIE + "=") and "Path=/auth/bizomat;" in cookie and "HttpOnly" in cookie
    assert verifier not in cookie and SECRET not in cookie and SECRET not in r.headers["location"]
    # another provider address for a test server
    monkeypatch.setenv("BIZOMAT_ID_URL", "http://127.0.0.1:8787/company/")
    assert bizomat_id.provider() == "http://127.0.0.1:8787/company"


def test_links_an_existing_account_by_confirmed_email(monkeypatch):
    c = TestClient(server.app)
    _owner(c)
    c.get("/logout")
    _on(monkeypatch, {"sub": "bz-1", "email": "Owner@example.com", "email_verified": True, "name": "Owner"})
    r = _round(c, nxt="/history")
    assert r.status_code == 303 and r.headers["location"] == "/history"
    assert f"{bizomat_id.STATE_COOKIE}=;" in " ".join(r.headers.get_list("set-cookie"))  # the step cookie is cleared
    me = c.get("/api/account").json()["user"]
    assert me["email"] == "owner@example.com" and me["bizomat"] and me["role"] == "owner" and me["has_password"]
    # the link holds by BIZOMAT account id, even after the email changes at BIZOMAT
    c.get("/logout")
    _on(monkeypatch, {"sub": "bz-1", "email": "renamed@example.com", "email_verified": True, "name": "Owner"})
    assert _round(c).status_code == 303 and c.get("/api/account").json()["user"]["email"] == "owner@example.com"


def test_an_unconfirmed_email_never_links_or_creates(monkeypatch):
    owner = TestClient(server.app)
    _owner(owner)
    owner.post("/api/account/settings", json={"open_signup": True})
    _on(monkeypatch, {"sub": "bz-x", "email": "owner@example.com", "email_verified": False, "name": "Someone"})
    r = _round(TestClient(server.app))
    assert r.status_code == 400 and b"not confirmed" in r.content
    _on(monkeypatch, {"sub": "bz-y", "email": "new@example.com", "email_verified": False, "name": "New"})
    assert _round(TestClient(server.app)).status_code == 400
    assert [u["email"] for u in accounts.list_users()] == ["owner@example.com"]


def test_new_people_need_an_invite_or_open_sign_up(monkeypatch):
    owner = TestClient(server.app)
    _owner(owner)
    _on(monkeypatch, {"sub": "bz-2", "email": "new@example.com", "email_verified": True, "name": "New Person"})
    stranger = TestClient(server.app)
    r = _round(stranger)
    assert r.status_code == 403 and b"invite-only" in r.content
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    page = stranger.get(f"/join/{token}").content
    assert b"Join with BIZOMAT" in page and f"invite={token}".encode() in page
    r = _round(stranger, token)
    assert r.status_code == 303
    me = stranger.get("/api/account").json()["user"]
    assert me["name"] == "New Person" and me["bizomat"] and me["has_password"] is False and me["role"] == "member"
    assert not accounts.invite_valid(token)
    # open sign-up
    assert b"Sign up with BIZOMAT" not in TestClient(server.app).get("/signup").content  # sign-up is closed
    owner.post("/api/account/settings", json={"open_signup": True})
    assert b"Sign up with BIZOMAT" in TestClient(server.app).get("/signup").content
    _on(monkeypatch, {"sub": "bz-3", "email": "third@example.com", "email_verified": True, "name": "Third"})
    third = TestClient(server.app)
    assert _round(third).status_code == 303 and third.get("/api/account").json()["user"]["email"] == "third@example.com"


def test_a_typed_email_is_taken_over_and_a_suspended_account_stays_out(monkeypatch):
    owner = TestClient(server.app)
    _owner(owner)
    owner.post("/api/account/settings", json={"open_signup": True})
    typed = TestClient(server.app)
    r = typed.post("/signup", data={"name": "Typed", "email": "typed@example.com", "new_password": "typed password"},
                   follow_redirects=False)
    assert r.status_code == 303
    # whoever typed that address never proved it: the person BIZOMAT vouches for takes the account over
    _on(monkeypatch, {"sub": "bz-4", "email": "typed@example.com", "email_verified": True, "name": "Typed"})
    holder = TestClient(server.app)
    assert _round(holder).status_code == 303
    me = holder.get("/api/account").json()["user"]
    assert me["bizomat"] and me["has_password"] is False
    assert typed.get("/api/account").status_code == 401  # the typed sign-in ended
    owner.post(f"/api/account/users/{me['id']}/suspend", json={"suspended": True})
    r = _round(TestClient(server.app))
    assert r.status_code == 403 and b"suspended" in r.content


def test_cancelled_forged_and_before_any_account(monkeypatch):
    _on(monkeypatch, {"sub": "bz-9", "email": "a@example.com", "email_verified": True, "name": "A"})
    r = _round(TestClient(server.app))
    assert r.status_code == 400 and b"owner account first" in r.content and not accounts.any_users()
    c = TestClient(server.app)
    _owner(c)
    c.get("/logout")
    r = c.get("/auth/bizomat/callback?state=nope&code=good-code", follow_redirects=False)
    assert r.status_code == 400 and b"expired" in r.content
    r = c.get("/auth/bizomat", follow_redirects=False)
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    r = c.get(f"/auth/bizomat/callback?state={state}&error=access_denied", follow_redirects=False)
    assert r.status_code == 400 and b"cancelled" in r.content
    assert c.get("/api/account").status_code == 401


def test_the_code_is_swapped_with_the_client_secret_and_the_verifier(monkeypatch):
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    seen = []

    def handler(request: httpx.Request) -> httpx.Response:
        seen.append(request)
        if request.url.path == "/company/api/id/token":
            form = parse_qs(request.content.decode())
            ok = (request.headers["authorization"] == "Basic " + base64.b64encode(f"cad:{SECRET}".encode()).decode()
                  and form == {"grant_type": ["authorization_code"], "code": ["the-code"],
                               "redirect_uri": ["https://bizomat.ai/cad/auth/bizomat/callback"],
                               "code_verifier": [bizomat_id.verifier_for("the-state")]})
            return httpx.Response(200, json={"access_token": "tok", "token_type": "Bearer"}) if ok else httpx.Response(401, json={"error": "invalid_client"})
        if request.url.path == "/company/api/id/userinfo":
            if request.headers.get("authorization") != "Bearer tok":
                return httpx.Response(401, json={"error": "invalid_token"})
            return httpx.Response(200, json={"sub": "u-1", "email": "a@example.com", "email_verified": True, "name": "A",
                                             "companies": [{"id": "c1", "name": "Example Pty Ltd", "role": "owner"}]})
        return httpx.Response(404)

    real = httpx.AsyncClient
    monkeypatch.setattr(bizomat_id.httpx, "AsyncClient", lambda **kw: real(transport=httpx.MockTransport(handler), **kw))
    import asyncio
    info = asyncio.run(bizomat_id.exchange("the-code", "https://bizomat.ai/cad/auth/bizomat/callback", "the-state"))
    assert info == {"sub": "u-1", "email": "a@example.com", "email_verified": True, "name": "A"}  # companies not kept
    assert [str(r.url) for r in seen] == ["https://bizomat.ai/company/api/id/token", "https://bizomat.ai/company/api/id/userinfo"]
    # a wrong verifier, a refused token and a refused account read each give a plain reason
    with pytest.raises(ValueError, match="did not accept"):
        asyncio.run(bizomat_id.exchange("the-code", "https://bizomat.ai/cad/auth/bizomat/callback", "another-state"))
    monkeypatch.setattr(bizomat_id.httpx, "AsyncClient",
                        lambda **kw: real(transport=httpx.MockTransport(lambda r: httpx.Response(200, json={"access_token": "x"})
                                                                         if r.url.path.endswith("/token") else httpx.Response(401)), **kw))
    with pytest.raises(ValueError, match="Could not read"):
        asyncio.run(bizomat_id.exchange("c", "https://bizomat.ai/cad/auth/bizomat/callback", "s"))
    # "email_verified" counts only when it is true itself
    monkeypatch.setattr(bizomat_id.httpx, "AsyncClient",
                        lambda **kw: real(transport=httpx.MockTransport(lambda r: httpx.Response(200, json={"access_token": "x"})
                                                                         if r.url.path.endswith("/token") else
                                                                         httpx.Response(200, json={"sub": "u", "email": "e@example.com",
                                                                                                   "email_verified": "true"})), **kw))
    assert asyncio.run(bizomat_id.exchange("c", "https://bizomat.ai/cad/auth/bizomat/callback", "s"))["email_verified"] is False


def test_privacy_notice_says_what_bizomat_shares():
    page = TestClient(server.app).get("/privacy").text
    assert "Sign in with BIZOMAT" in page and "does not keep your companies" in page
