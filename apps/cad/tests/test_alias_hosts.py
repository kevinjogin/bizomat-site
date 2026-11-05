"""Two public host names for one app during the domain move (OPENSKETCH_ALIAS_HOSTS): each gets OAuth and MCP metadata
for itself (clients check that the metadata names the address they used), an app's sign-in works across both, tokens
and refreshes work on both, and the canonical redirect leaves both alone unless one is listed to redirect."""
import base64
import hashlib
import re
import secrets
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from opensketch import mcpauth, server

NEW, OLD = "cad.bizomat.ai", "cados.kevos.com"
REDIRECT = "https://claude.ai/api/mcp/auth_callback"
ACCEPT = {"Accept": "application/json, text/event-stream"}


@pytest.fixture(autouse=True)
def env(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_REDIRECT_HOSTS", "OPENSKETCH_TRUSTED_PROXIES", "FLY_APP_NAME"):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setenv("OPENSKETCH_ALIAS_HOSTS", f"{NEW}, {OLD.upper()}")
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://" + OLD)
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    mcpauth._token_hits.clear()


def _on(host, **kw):
    return TestClient(server.app, base_url="https://" + host, **kw)


def _owner(host=NEW):
    c = _on(host)
    r = c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"},
               follow_redirects=False)
    assert r.status_code == 303, r.text
    return c


def _pkce():
    v = secrets.token_urlsafe(48)
    return v, base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).decode().rstrip("=")


def _register(c):
    r = c.post("/oauth/register", json={"client_name": "Claude", "redirect_uris": [REDIRECT]})
    assert r.status_code == 201, r.text
    return r.json()["client_id"]


def _sign_in(browser, cid, resource):
    """The person's browser on browser's host: consent, Allow. Returns (the query sent back to the app, verifier)."""
    verifier, chal = _pkce()
    page = browser.get("/oauth/authorize", params={
        "response_type": "code", "client_id": cid, "redirect_uri": REDIRECT, "state": "s1", "code_challenge": chal,
        "code_challenge_method": "S256", "scope": "opensketch", "resource": resource})
    assert page.status_code == 200 and "Allow" in page.text, page.text[:400]
    req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
    r = browser.post("/oauth/authorize", data={"req": req}, follow_redirects=False)
    assert r.status_code == 303
    return parse_qs(urlparse(r.headers["location"]).query), verifier


def _token(app, host, **form):
    return app.post("/oauth/token", data=form, headers={"host": host})


def _tools(app, host, access):
    return app.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
                    headers={**ACCEPT, "host": host, "Authorization": f"Bearer {access}"})


def test_each_host_gets_metadata_for_itself():
    _owner(NEW)  # sign-in on, so the MCP endpoint asks for it
    for host in (NEW, OLD):
        c = _on(host)
        pr = c.get("/.well-known/oauth-protected-resource/mcp").json()
        assert pr["resource"] == f"https://{host}/mcp" and pr["authorization_servers"] == [f"https://{host}"]
        assert c.get("/.well-known/oauth-protected-resource/solidworks/mcp").json()["resource"] == f"https://{host}/solidworks/mcp"
        md = c.get("/.well-known/oauth-authorization-server").json()
        assert md["issuer"] == f"https://{host}" and md["token_endpoint"] == f"https://{host}/oauth/token"
        assert md["authorization_endpoint"] == f"https://{host}/oauth/authorize"
        r = c.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}, headers=ACCEPT)
        assert r.status_code == 401
        assert f'resource_metadata="https://{host}/.well-known/oauth-protected-resource/mcp"' in r.headers["www-authenticate"]
        # a port or a trailing dot in Host is the same host
        assert _on(host).get("/.well-known/oauth-authorization-server", headers={"host": host + ":443"}).json()["issuer"] == f"https://{host}"


def test_other_hosts_and_unset_aliases_keep_the_public_address(monkeypatch):
    for host in ("cados.fly.dev", "evil.example", "127.0.0.1:8001"):
        assert _on(host).get("/.well-known/oauth-authorization-server").json()["issuer"] == "https://" + OLD, host
    monkeypatch.delenv("OPENSKETCH_ALIAS_HOSTS")
    assert _on(NEW).get("/.well-known/oauth-authorization-server").json()["issuer"] == "https://" + OLD


def test_the_proxys_forwarded_host_counts_and_nobody_elses():
    via = TestClient(server.app, base_url="http://127.0.0.1:8001", client=("127.0.0.1", 50000))
    md = via.get("/.well-known/oauth-authorization-server", headers={"x-forwarded-host": NEW, "x-forwarded-proto": "https"}).json()
    assert md["issuer"] == "https://" + NEW
    direct = TestClient(server.app, base_url="https://evil.example", client=("198.51.100.20", 50000))
    md = direct.get("/.well-known/oauth-authorization-server", headers={"x-forwarded-host": NEW}).json()
    assert md["issuer"] == "https://" + OLD  # a client's own X-Forwarded-Host is ignored


def test_a_sign_in_on_one_host_works_on_both_and_refreshes_from_either():
    browser = _owner(NEW)
    with _on(NEW) as app:
        cid = _register(app)
        back, verifier = _sign_in(browser, cid, f"https://{NEW}/mcp")
        assert back["iss"] == ["https://" + NEW]  # the issuer the app found on cad.bizomat.ai
        tok = _token(app, NEW, grant_type="authorization_code", code=back["code"][0], redirect_uri=REDIRECT,
                     client_id=cid, code_verifier=verifier, resource=f"https://{NEW}/mcp")
        assert tok.status_code == 200, tok.text
        t = tok.json()
        for host in (NEW, OLD):  # tokens are looked up by their hash: no host in them
            assert _tools(app, host, t["access_token"]).status_code == 200, host
        # an app that moved to the other host refreshes there, naming that host's resource
        again = _token(app, OLD, grant_type="refresh_token", refresh_token=t["refresh_token"], client_id=cid,
                       resource=f"https://{OLD}/mcp")
        assert again.status_code == 200, again.text
        t2 = again.json()
        assert _tools(app, NEW, t2["access_token"]).status_code == 200
        back_again = _token(app, NEW, grant_type="refresh_token", refresh_token=t2["refresh_token"], client_id=cid,
                            resource=f"https://{NEW}/solidworks/mcp")
        assert back_again.status_code == 200, back_again.text
        # one connection for this person and app, whichever host it used
        assert [a["name"] for a in browser.get("/api/solidworks").json()["apps"]] == ["Claude"]


def test_an_app_that_found_the_old_host_can_finish_on_the_new_one():
    """A connector set up with cados.kevos.com whose browser lands on cad.bizomat.ai (a redirect, a bookmark): the
    resource names the old host, the code works, and `iss` names the issuer the app read on the old host."""
    browser = _owner(NEW)
    with _on(OLD) as app:
        cid = _register(app)
        back, verifier = _sign_in(browser, cid, f"https://{OLD}/mcp")
        assert back["iss"] == ["https://" + OLD]
        tok = _token(app, OLD, grant_type="authorization_code", code=back["code"][0], redirect_uri=REDIRECT,
                     client_id=cid, code_verifier=verifier, resource=f"https://{NEW}/mcp")  # either host's resource
        assert tok.status_code == 200, tok.text
        assert _tools(app, NEW, tok.json()["access_token"]).status_code == 200


def test_a_resource_on_another_server_is_still_refused():
    browser = _owner(NEW)
    cid = _register(_on(NEW))
    verifier, chal = _pkce()
    page = browser.get("/oauth/authorize", params={
        "response_type": "code", "client_id": cid, "redirect_uri": REDIRECT, "code_challenge": chal,
        "code_challenge_method": "S256", "resource": "https://evil.example/mcp"})
    assert page.status_code == 400 and "different server" in page.text
    back, verifier = _sign_in(browser, cid, f"https://{NEW}/mcp")
    bad = _token(_on(NEW), NEW, grant_type="authorization_code", code=back["code"][0], redirect_uri=REDIRECT, client_id=cid,
                 code_verifier=verifier, resource="https://evil.example/mcp")
    assert bad.status_code == 400 and bad.json()["error"] == "invalid_target"


def test_alias_hosts_are_not_redirected_unless_listed(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", "cados.fly.dev")
    for host in (NEW, OLD):
        assert _on(host).get("/docs", follow_redirects=False).status_code == 200, host
    assert _on("cados.fly.dev").get("/docs", follow_redirects=False).headers["location"] == f"https://{OLD}/docs"
    # the operator moves browsers to the new name: only then is the old alias redirected (programs never are)
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://" + NEW)
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", f"cados.fly.dev,{OLD}")
    r = _on(OLD).get("/docs?x=1", follow_redirects=False)
    assert r.status_code == 301 and r.headers["location"] == f"https://{NEW}/docs?x=1"
    assert _on(NEW).get("/docs", follow_redirects=False).status_code == 200
    assert _on(OLD).get("/.well-known/oauth-authorization-server", follow_redirects=False).json()["issuer"] == "https://" + OLD


def test_pages_show_the_visitors_host_and_name_one_canonical_address():
    docs = _on(NEW).get("/docs").text
    assert f"GATEWAY_URL=https://{NEW}" in docs and f"<code>https://{NEW}</code>" in docs
    assert f'<link rel="canonical" href="https://{OLD}/docs">' in docs  # OPENSKETCH_PUBLIC_URL, on either host
    owner = _owner(NEW)
    d = owner.get("/api/solidworks").json()
    assert d["url"] == f"https://{NEW}/mcp" and d["server"] == f"https://{NEW}"
