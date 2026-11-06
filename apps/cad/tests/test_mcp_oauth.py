"""AI apps sign in to OpenSketch (OAuth 2.1 for the MCP endpoint): metadata, registration, consent, PKCE, tokens
scoped to the person, refresh rotation, revoking, disconnecting; and the official MCP SDK client doing the whole
dance against a real server."""
import base64
import hashlib
import json
import re
import secrets
import socket
import threading
import time
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from opensketch import mcpauth, server, store
from tests.mcp_reply import rpc

ACCEPT = {"Accept": "application/json, text/event-stream"}


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_PUBLIC_URL"):
        monkeypatch.delenv(k, raising=False)
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    return tmp_path


@pytest.fixture
def app():
    """The AI app's own requests (no cookies), with the server's lifespan running (the MCP session manager)."""
    with TestClient(server.app) as c:
        yield c


def _owner():
    c = TestClient(server.app)
    c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"})
    return c


def _member(owner, email="mei@example.com"):
    token = owner.post("/api/account/invites").json()["url"].split("/join/")[1]
    m = TestClient(server.app)
    m.post(f"/join/{token}", data={"name": "Mei", "email": email, "new_password": "battery staple"})
    return m


def _pkce():
    v = secrets.token_urlsafe(48)
    return v, base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).decode().rstrip("=")


def _register(c, redirect="https://claude.ai/api/mcp/auth_callback", **extra):
    r = c.post("/oauth/register", json={"client_name": "Claude", "redirect_uris": [redirect], **extra})
    assert r.status_code == 201, r.text
    return r.json()


def _connect(browser, app_client, client_info, redirect="https://claude.ai/api/mcp/auth_callback"):
    """The person's browser goes through consent; the AI app swaps the code. Returns the token response."""
    verifier, chal = _pkce()
    q = {"response_type": "code", "client_id": client_info["client_id"], "redirect_uri": redirect, "state": "s1",
         "code_challenge": chal, "code_challenge_method": "S256", "scope": "opensketch", "resource": "http://testserver/mcp"}
    page = browser.get("/oauth/authorize", params=q)
    assert page.status_code == 200 and b"Allow" in page.content, page.text[:300]
    req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
    r = browser.post("/oauth/authorize", data={"req": req}, follow_redirects=False)
    assert r.status_code == 303
    back = parse_qs(urlparse(r.headers["location"]).query)
    assert back["state"] == ["s1"] and back["iss"] == ["http://testserver"]
    form = {"grant_type": "authorization_code", "code": back["code"][0], "redirect_uri": redirect,
            "client_id": client_info["client_id"], "code_verifier": verifier, "resource": "http://testserver/mcp"}
    if client_info.get("client_secret"):
        form["client_secret"] = client_info["client_secret"]
    tok = app_client.post("/oauth/token", data=form)
    assert tok.status_code == 200, tok.text
    return tok.json()


def _mcp(c, access, method="tools/call", params=None):
    body = {"jsonrpc": "2.0", "id": 1, "method": method, "params": params or {}}
    return c.post("/mcp", json=body, headers={**ACCEPT, "Authorization": f"Bearer {access}"})


def test_discovery_is_public_and_the_endpoint_asks_to_sign_in():
    _owner()
    anon = TestClient(server.app)
    pr = anon.get("/.well-known/oauth-protected-resource/mcp")
    assert pr.status_code == 200 and pr.headers["access-control-allow-origin"] == "*"
    assert pr.json()["resource"] == "http://testserver/mcp" and pr.json()["authorization_servers"] == ["http://testserver"]
    assert anon.get("/.well-known/oauth-protected-resource").json() == pr.json()
    md = anon.get("/.well-known/oauth-authorization-server").json()
    assert md["code_challenge_methods_supported"] == ["S256"] and md["registration_endpoint"].endswith("/oauth/register")
    assert md["issuer"] == "http://testserver" and "refresh_token" in md["grant_types_supported"]
    r = anon.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}, headers=ACCEPT)
    assert r.status_code == 401
    assert 'resource_metadata="http://testserver/.well-known/oauth-protected-resource/mcp"' in r.headers["www-authenticate"]
    bad = anon.post("/mcp", json={}, headers={**ACCEPT, "Authorization": "Bearer osa_nope"})
    assert bad.status_code == 401 and 'error="invalid_token"' in bad.headers["www-authenticate"]
    assert anon.options("/mcp").status_code == 204 and anon.options("/oauth/token").status_code == 204


def test_registration_checks_return_addresses():
    _owner()
    c = TestClient(server.app)
    for bad in (["http://evil.example/cb"], ["javascript:alert(1)"], ["https://x.example/cb#frag"], [], "nope",
                ["https://user:pw@x.example/cb"]):
        assert c.post("/oauth/register", json={"redirect_uris": bad}).status_code == 400, bad
    for ok in ("https://claude.ai/api/mcp/auth_callback", "http://127.0.0.1:33418/callback", "http://localhost:6274/oauth",
               "cursor://anysphere.cursor-mcp/oauth/callback"):
        info = _register(c, ok)
        assert info["client_id"].startswith("osc_") and "client_secret" not in info
    conf = _register(c, token_endpoint_auth_method="client_secret_post")
    assert conf["client_secret"].startswith("oss_")
    assert conf["client_secret"] not in (store.data_dir() / "mcp_oauth.json").read_text()  # stored hashed


def test_sign_in_consent_tokens_and_solidworks_are_per_person(app):
    owner = _owner()
    member = _member(owner)
    # the owner's SOLIDWORKS is linked; Mei's is not
    key = owner.get("/api/solidworks").json()["key"]
    assert app.post("/mcp/sw/hello", json={"client": "addin", "machine": "OWNER-PC"},
                    headers={"Authorization": f"Bearer {key}"}).status_code == 200
    info = _register(app)
    # signed out: the consent link goes through sign-in and comes back
    v, chal = _pkce()
    q = f"/oauth/authorize?response_type=code&client_id={info['client_id']}&redirect_uri=https%3A%2F%2Fclaude.ai%2Fapi%2Fmcp%2Fauth_callback&code_challenge={chal}&code_challenge_method=S256&state=x"
    fresh = TestClient(server.app)
    r = fresh.get(q, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("/login?next=/oauth/authorize")
    nxt = parse_qs(urlparse(r.headers["location"]).query)["next"][0]
    r = fresh.post("/login", data={"email": "owner@example.com", "password": "correct horse", "next": nxt}, follow_redirects=False)
    assert r.headers["location"] == q and b"Allow" in fresh.get(q).content
    # a client name with markup is shown as text
    sneaky = _register(app, client_name='<img src=x onerror=alert(1)>')
    page = owner.get(q.replace(info["client_id"], sneaky["client_id"]))
    assert b"<img src=x" not in page.content and b"&lt;img" in page.content
    # unknown client or unregistered return address: a page, never a redirect
    assert owner.get(q.replace(info["client_id"], "osc_nope"), follow_redirects=False).status_code == 400
    assert owner.get(q.replace("claude.ai", "evil.example"), follow_redirects=False).status_code == 400
    # no PKCE (or any other bad request): a page too, never a redirect (anyone can register any return address,
    # so an error redirect would make this site bounce signed-in people anywhere)
    r = owner.get(q.replace("S256", "plain"), follow_redirects=False)
    assert r.status_code == 400 and "location" not in r.headers and b"PKCE" in r.content
    assert owner.get(q.replace("response_type=code", "response_type=x"), follow_redirects=False).status_code == 400
    # Cancel
    page = owner.get(q)
    req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
    r = owner.post("/oauth/authorize", data={"req": req, "action": "deny"}, follow_redirects=False)
    assert "error=access_denied" in r.headers["location"] and "state=x" in r.headers["location"]
    # the signed request belongs to the person who saw it, and Allow needs this site's page
    assert member.post("/oauth/authorize", data={"req": req}, follow_redirects=False).status_code == 400
    assert owner.post("/oauth/authorize", data={"req": req}, headers={"Origin": "https://evil.example"}).status_code == 403

    tok = _connect(owner, app, info)
    assert tok["token_type"] == "Bearer" and tok["expires_in"] == 3600 and tok["refresh_token"].startswith("osr_")
    init = _mcp(app, tok["access_token"], "initialize",
                {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}})
    assert init.status_code == 200 and init.headers["access-control-allow-origin"] == "*"
    status = json.dumps(rpc(_mcp(app, tok["access_token"], params={"name": "sw_status", "arguments": {}})))
    assert "OWNER-PC" in status
    # Mei connects her own Claude: it reaches only her SOLIDWORKS link (none yet)
    tok2 = _connect(member, app, info)
    status = json.dumps(rpc(_mcp(app, tok2["access_token"], params={"name": "sw_status", "arguments": {}})))
    assert "OWNER-PC" not in status and '\\"connected\\": false' in status
    # a code works once; a wrong verifier never
    assert app.post("/oauth/token", data={"grant_type": "authorization_code", "code": "osk_nope", "client_id": info["client_id"],
                                          "code_verifier": "x" * 50}).json()["error"] == "invalid_grant"


def test_refresh_rotation_revoke_and_disconnect(monkeypatch, app):
    owner = _owner()
    info = _register(app)
    tok = _connect(owner, app, info)
    ref = {"grant_type": "refresh_token", "refresh_token": tok["refresh_token"], "client_id": info["client_id"]}
    new = app.post("/oauth/token", data=ref).json()
    assert new["access_token"] != tok["access_token"] and new["refresh_token"] != tok["refresh_token"]
    assert app.post("/oauth/token", data=ref).status_code == 200  # a retry right after still works (grace)
    import types
    later = [0.0]
    monkeypatch.setattr(mcpauth, "time", types.SimpleNamespace(time=lambda: time.time() + later[0]))
    later[0] = mcpauth.REFRESH_GRACE + 5
    assert app.post("/oauth/token", data=ref).json()["error"] == "invalid_grant"  # the replaced one, later: refused
    later[0] = mcpauth.ACCESS_TTL + 10
    assert _mcp(app, tok["access_token"], "tools/list").status_code == 401  # access tokens expire
    later[0] = 0
    # another app cannot use this app's refresh token
    other = _register(app)
    latest = app.post("/oauth/token", data=dict(ref, refresh_token=new["refresh_token"])).json()
    assert "refresh_token" in latest, latest
    assert app.post("/oauth/token", data={**ref, "refresh_token": latest["refresh_token"], "client_id": other["client_id"]}).status_code == 400
    # the home page's API lists it; Disconnect ends it
    apps = owner.get("/api/account/apps").json()["apps"]
    assert len(apps) == 1 and apps[0]["name"] == "Claude" and apps[0]["host"] == "claude.ai"
    assert _mcp(app, latest["access_token"], "tools/list").status_code == 200
    owner.delete(f"/api/account/apps/{apps[0]['id']}")
    assert _mcp(app, latest["access_token"], "tools/list").status_code == 401
    assert app.post("/oauth/token", data={**ref, "refresh_token": latest["refresh_token"]}).status_code == 400
    # revoke from the app's side (RFC 7009)
    tok = _connect(owner, app, info)
    assert app.post("/oauth/revoke", data={"token": tok["refresh_token"], "client_id": info["client_id"]}).status_code == 200
    assert _mcp(app, tok["access_token"], "tools/list").status_code == 401
    # an unknown client at the token endpoint: 401 invalid_client, so the app registers again
    r = app.post("/oauth/token", data={**ref, "client_id": "osc_gone"})
    assert r.status_code == 401 and r.json()["error"] == "invalid_client"


def test_removed_member_loses_their_connections_and_old_addresses_still_work(app):
    owner = _owner()
    member = _member(owner)
    info = _register(app)
    tok = _connect(member, app, info)
    assert _mcp(app, tok["access_token"], "tools/list").status_code == 200
    mid = member.get("/api/account").json()["user"]["id"]
    owner.delete(f"/api/account/users/{mid}")
    assert _mcp(app, tok["access_token"], "tools/list").status_code == 401
    # the private address still works next to sign-in
    key_url = owner.get("/api/solidworks").json()
    assert key_url["url"] == "http://testserver/mcp" and key_url["signin"] is True
    path = "/mcp/" + key_url["private_url"].split("/mcp/")[1]
    r = app.post(path, json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}, headers=ACCEPT)
    assert r.status_code == 200 and "sw_status" in r.text


def _free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


def test_the_official_mcp_client_signs_in_and_works():
    """The MCP Python SDK's own OAuth client: discovery from the 401, registration, the browser consent (played by
    an httpx client holding the owner's sign-in cookie), PKCE code exchange, then real tool calls."""
    import anyio
    import httpx
    import uvicorn
    from mcp import ClientSession
    from mcp.client.auth import OAuthClientProvider
    from mcp.client.streamable_http import create_mcp_http_client, streamable_http_client
    from mcp.shared.auth import AuthorizationCodeResult, OAuthClientMetadata

    port = _free_port()
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    base = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            httpx.get(base + "/.well-known/oauth-authorization-server", timeout=1)
            break
        except Exception:
            time.sleep(0.05)
    try:
        browser = httpx.Client(base_url=base, timeout=20)
        browser.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"},
                     headers={"Origin": base})
        seen = {}

        async def redirect_handler(url: str):
            page = browser.get(url)
            assert page.status_code == 200, page.text[:200]
            req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
            r = browser.post("/oauth/authorize", data={"req": req}, headers={"Origin": base})
            seen["location"] = r.headers["location"]

        async def callback_handler():
            q = parse_qs(urlparse(seen["location"]).query)
            return AuthorizationCodeResult(code=q["code"][0], state=q.get("state", [None])[0], iss=q.get("iss", [None])[0])

        class Mem:
            tokens = client = None

            async def get_tokens(self):
                return self.tokens

            async def set_tokens(self, t):
                self.tokens = t

            async def get_client_info(self):
                return self.client

            async def set_client_info(self, c):
                self.client = c

        storage = Mem()
        provider = OAuthClientProvider(
            server_url=base + "/mcp",
            client_metadata=OAuthClientMetadata(client_name="SDK test", redirect_uris=["http://localhost:3999/callback"],
                                                grant_types=["authorization_code", "refresh_token"],
                                                response_types=["code"], token_endpoint_auth_method="none"),
            storage=storage, redirect_handler=redirect_handler, callback_handler=callback_handler)

        async def run():
            async with create_mcp_http_client(auth=provider) as http:
                async with streamable_http_client(base + "/mcp", http_client=http) as streams:
                    async with ClientSession(streams[0], streams[1]) as s:
                        await s.initialize()
                        tools = await s.list_tools()
                        assert any(t.name == "sw_status" for t in tools.tools)
                        res = await s.call_tool("sw_status", {})
                        return json.dumps(res.model_dump())

        out = anyio.run(run)
        assert "connected" in out and "isError\": true" not in out
        assert storage.tokens.access_token.startswith("osa_") and storage.tokens.refresh_token.startswith("osr_")
        apps = browser.get("/api/account/apps").json()["apps"]
        assert apps and apps[0]["name"] == "SDK test" and apps[0]["host"] == "localhost"
    finally:
        srv.should_exit = True
        th.join(timeout=10)


def test_the_official_mcp_client_signs_in_under_a_path_prefix(monkeypatch):
    """The same, with the server at a path (https://bizomat.ai/cad): the SDK finds the protected-resource metadata at
    /.well-known/oauth-protected-resource/cad/mcp and the authorization server's at
    /.well-known/oauth-authorization-server/cad (RFC 9728 and RFC 8414), and checks the issuer that comes back."""
    import anyio
    import httpx
    import uvicorn
    from mcp import ClientSession
    from mcp.client.auth import OAuthClientProvider
    from mcp.client.streamable_http import create_mcp_http_client, streamable_http_client
    from mcp.shared.auth import AuthorizationCodeResult, OAuthClientMetadata

    port = _free_port()
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    base = f"http://127.0.0.1:{port}"
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", base + "/cad")
    for _ in range(100):
        try:
            httpx.get(base + "/.well-known/oauth-authorization-server", timeout=1)
            break
        except Exception:
            time.sleep(0.05)
    try:
        browser = httpx.Client(base_url=base, timeout=20)
        browser.post("/cad/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"},
                     headers={"Origin": base})
        seen = {}

        async def redirect_handler(url: str):
            page = browser.get(url)
            assert page.status_code == 200, page.text[:200]
            req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
            r = browser.post("/cad/oauth/authorize", data={"req": req}, headers={"Origin": base})
            seen["location"] = r.headers["location"]

        async def callback_handler():
            q = parse_qs(urlparse(seen["location"]).query)
            return AuthorizationCodeResult(code=q["code"][0], state=q.get("state", [None])[0], iss=q.get("iss", [None])[0])

        class Mem:
            tokens = client = None

            async def get_tokens(self):
                return self.tokens

            async def set_tokens(self, t):
                self.tokens = t

            async def get_client_info(self):
                return self.client

            async def set_client_info(self, c):
                self.client = c

        storage = Mem()
        provider = OAuthClientProvider(
            server_url=base + "/cad/mcp",
            client_metadata=OAuthClientMetadata(client_name="SDK test", redirect_uris=["http://localhost:3999/callback"],
                                                grant_types=["authorization_code", "refresh_token"],
                                                response_types=["code"], token_endpoint_auth_method="none"),
            storage=storage, redirect_handler=redirect_handler, callback_handler=callback_handler)

        async def run():
            async with create_mcp_http_client(auth=provider) as http:
                async with streamable_http_client(base + "/cad/mcp", http_client=http) as streams:
                    async with ClientSession(streams[0], streams[1]) as s:
                        await s.initialize()
                        tools = await s.list_tools()
                        assert any(t.name == "sw_status" for t in tools.tools)
                        res = await s.call_tool("sw_status", {})
                        return json.dumps(res.model_dump())

        out = anyio.run(run)
        assert "connected" in out and "isError\": true" not in out
        assert storage.tokens.access_token.startswith("osa_") and storage.tokens.refresh_token.startswith("osr_")
        apps = browser.get("/cad/api/account/apps").json()["apps"]
        assert apps and apps[0]["name"] == "SDK test" and apps[0]["host"] == "localhost"
    finally:
        srv.should_exit = True
        th.join(timeout=10)


def test_apps_that_describe_themselves_with_a_metadata_url(monkeypatch, app):
    """Client ID Metadata Documents (ChatGPT's way): the client_id is an https URL; OpenSketch reads it from the
    checked public address (pinned, no redirects) and accepts only the return addresses it lists."""
    import httpx
    from opensketch import safefetch
    url = "https://chatgpt.example/oauth/client.json"
    docs = {url: {"client_id": url, "client_name": "ChatGPT", "token_endpoint_auth_method": "none",
                  "redirect_uris": ["https://chatgpt.example/connector_platform_oauth_redirect"]},
            "https://liar.example/client.json": {"client_id": "https://someone-else.example/client.json",
                                                  "redirect_uris": ["https://liar.example/cb"]}}
    seen = []

    def handler(request: httpx.Request):
        seen.append(request)
        name = request.headers["host"]
        doc = docs.get(f"https://{name}{request.url.path}")
        return httpx.Response(200, json=doc) if doc else httpx.Response(404)

    real = httpx.Client
    monkeypatch.setattr(httpx, "Client", lambda **kw: real(transport=httpx.MockTransport(handler), **kw))
    monkeypatch.setattr(safefetch, "resolve_public", lambda host, port: "93.184.215.14")
    mcpauth._cimd.clear()
    assert app.get("/.well-known/oauth-authorization-server").json()["client_id_metadata_document_supported"] is True
    owner = _owner()
    tok = _connect(owner, app, {"client_id": url}, redirect="https://chatgpt.example/connector_platform_oauth_redirect")
    assert seen[0].url.host == "93.184.215.14" and seen[0].headers["host"] == "chatgpt.example"
    assert seen[0].extensions["sni_hostname"] == "chatgpt.example"
    assert _mcp(app, tok["access_token"], "tools/list").status_code == 200
    refreshed = app.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": tok["refresh_token"], "client_id": url})
    assert refreshed.status_code == 200
    page = owner.get("/oauth/authorize", params={"response_type": "code", "client_id": url, "code_challenge": "x" * 43,
                                                 "code_challenge_method": "S256",
                                                 "redirect_uri": "https://chatgpt.example/connector_platform_oauth_redirect"})
    assert b"chatgpt.example" in page.content
    # a return address the document does not list, a document naming another client, a private address: refused
    bad = {"response_type": "code", "code_challenge": "x" * 43, "code_challenge_method": "S256"}
    assert owner.get("/oauth/authorize", params={**bad, "client_id": url, "redirect_uri": "https://evil.example/cb"},
                     follow_redirects=False).status_code == 400
    assert owner.get("/oauth/authorize", params={**bad, "client_id": "https://liar.example/client.json",
                                                 "redirect_uri": "https://liar.example/cb"}, follow_redirects=False).status_code == 400

    def private(host, port):
        raise safefetch.FetchError("private")
    monkeypatch.setattr(safefetch, "resolve_public", private)
    mcpauth._cimd.clear()
    assert owner.get("/oauth/authorize", params={**bad, "client_id": "https://internal.example/c.json",
                                                 "redirect_uri": "https://internal.example/cb"}, follow_redirects=False).status_code == 400
