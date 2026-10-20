"""OpenSketch is the connector between AI apps and SOLIDWORKS: the MCP endpoint has only the SOLIDWORKS tools, at
/mcp and at /solidworks/mcp (a second address early connectors used); the home page sets it up; the server has no
routes beyond the connector, sign-in and account APIs."""
import re
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from opensketch import mcp_server, mcpauth, server, swbridge
from tests.test_mcp_oauth import ACCEPT, _owner, _pkce, _register


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_PUBLIC_URL"):
        monkeypatch.delenv(k, raising=False)
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    swbridge.reset_for_tests()
    yield tmp_path
    swbridge.reset_for_tests()


@pytest.fixture
def app():
    with TestClient(server.app) as c:
        yield c


def _rpc(c, path, method, params=None, token=None):
    h = dict(ACCEPT, **({"Authorization": f"Bearer {token}"} if token else {}))
    return c.post(path, json={"jsonrpc": "2.0", "id": 1, "method": method, "params": params or {}}, headers=h)


def _connect(person, app_client, info, resource):
    redirect = info["redirect_uris"][0]
    verifier, chal = _pkce()
    q = {"response_type": "code", "client_id": info["client_id"], "redirect_uri": redirect, "state": "s",
         "code_challenge": chal, "code_challenge_method": "S256", "scope": "opensketch", "resource": resource}
    page = person.get("/oauth/authorize", params=q)
    assert page.status_code == 200, page.text[:300]
    req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
    r = person.post("/oauth/authorize", data={"req": req}, follow_redirects=False)
    code = parse_qs(urlparse(r.headers["location"]).query)["code"][0]
    tok = app_client.post("/oauth/token", data={"grant_type": "authorization_code", "code": code, "redirect_uri": redirect,
                                                "client_id": info["client_id"], "code_verifier": verifier,
                                                "resource": resource})
    assert tok.status_code == 200, tok.text
    return page.text, tok.json()


def test_only_the_solidworks_tools_on_both_addresses(app):
    for path in mcp_server.PATHS:  # no accounts: open
        r = _rpc(app, path, "tools/list")
        assert r.status_code == 200, (path, r.text)
        names = {t["name"] for t in r.json()["result"]["tools"]}
        assert names == {n for n in names if n.startswith("sw_")} | {"request_upload"}
        assert {"sw_status", "sw_get_guide", "sw_add_features", "sw_batch", "sw_add_mate", "sw_selftest"} <= names
        assert len(names) == 25
    init = _rpc(app, "/mcp", "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                            "clientInfo": {"name": "t", "version": "1"}}).json()["result"]
    assert init["serverInfo"]["name"] == "OpenSketch" and "sw_status first" in init["instructions"]
    out = _rpc(app, "/mcp", "tools/call", {"name": "sw_status", "arguments": {}}).json()["result"]
    assert '"connected": false' in out["content"][0]["text"] and "home page" in out["content"][0]["text"]
    guide = _rpc(app, "/mcp", "tools/call", {"name": "sw_get_guide", "arguments": {}}).json()["result"]["content"][0]["text"]
    assert "sw_status first" in guide and '"type":"sketch"' in guide and "Mate references" in guide
    assert "viewport" not in guide  # only the SOLIDWORKS workflow


def test_one_sign_in_works_on_both_addresses(app):
    owner = _owner()
    r = _rpc(app, "/mcp", "tools/list")
    assert r.status_code == 401
    assert "/.well-known/oauth-protected-resource/mcp" in r.headers["www-authenticate"]
    r = _rpc(app, "/solidworks/mcp", "tools/list")
    assert "/.well-known/oauth-protected-resource/solidworks/mcp" in r.headers["www-authenticate"]
    for path in mcp_server.PATHS:
        meta = app.get("/.well-known/oauth-protected-resource" + path).json()
        assert meta["resource"] == "http://testserver" + path and meta["resource_name"] == "OpenSketch"
        assert app.get("/.well-known/oauth-authorization-server" + path).json()["issuer"] == "http://testserver"
    info = _register(app)
    page, tok = _connect(owner, app, info, "http://testserver/solidworks/mcp")
    assert "build in SOLIDWORKS" in page and "Your AI, building in SOLIDWORKS." in page
    for path in mcp_server.PATHS:
        assert _rpc(app, path, "tools/list", token=tok["access_token"]).status_code == 200
    # Claude connected again to /mcp: one connection per app, as before
    _connect(owner, app, _register(app), "http://testserver/mcp")
    assert [a["name"] for a in owner.get("/api/solidworks").json()["apps"]] == ["Claude"]


def test_private_address_on_both_paths(app):
    owner = _owner()
    d = owner.get("/api/solidworks").json()
    key = d["private_url"].split("/mcp/")[1]
    assert d["private_url"] == f"http://testserver/mcp/{key}" and d["url"] == "http://testserver/mcp"
    for path in mcp_server.PATHS:
        assert _rpc(app, f"{path}/{key}", "tools/list").status_code == 200
        assert _rpc(app, f"{path}/not-a-key", "tools/list").status_code == 404
    new = owner.post("/api/connect/new_address").json()["mcp_url"].split("/mcp/")[1]
    assert new != key and _rpc(app, f"/mcp/{key}", "tools/list").status_code == 404


def test_home_page_and_its_api(app):
    owner = _owner()
    anon = TestClient(server.app)
    r = anon.get("/", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/login?next=/"
    login = anon.get("/login").text
    assert "Your AI, building in SOLIDWORKS." in login and "AI for SOLIDWORKS" in login and "manifest" not in login
    for path in ("/", "/solidworks"):
        page = owner.get(path)
        assert page.status_code == 200 and "OpenSketch" in page.text and "/api/solidworks" in page.text
    d = owner.get("/api/solidworks").json()
    assert d["key"].startswith("oss_") and d["status"] == {"connected": False} and d["signin"] is True
    assert d["user"]["email"] == "owner@example.com" and d["apps"] == []
    h = {"Authorization": f"Bearer {d['key']}"}
    assert app.post("/mcp/sw/hello", json={"client": "addin", "sw_version": "30.5.0", "machine": "PC1"}, headers=h).status_code == 200
    st = owner.get("/api/solidworks").json()["status"]
    assert st["connected"] and st["machine"] == "PC1"
    bad = app.post("/mcp/sw/hello", json={}, headers={"Authorization": "Bearer oss_" + "0" * 40})
    assert bad.status_code == 401 and "home page, http://testserver" in bad.json()["detail"]
    privacy = anon.get("/privacy").text
    assert "SOLIDWORKS" in privacy and "built-in AI" not in privacy


def test_only_connector_routes():
    owner = _owner()
    allowed = ("/healthz", "/api/account", "/api/sw", "/api/solidworks", "/api/connect/", "/mcp", "/solidworks",
               "/.well-known/", "/oauth/", "/openapi.json", "/docs", "/redoc")
    paths = [getattr(r, "path", "") for r in server.app.routes]
    assert [p for p in paths if p not in ("/", "") and not p.startswith(allowed)] == []
    for path in ("/api/docs", "/api/features", "/api/version", "/sw.js", "/manifest.webmanifest", "/js/app.js",
                 "/css/app.css", "/review/abc"):
        assert owner.get(path).status_code == 404, path
    for path in ("/api/regen", "/api/ai/stream", "/api/import/raw", "/api/export/start"):
        assert owner.post(path, json={}).status_code in (404, 405), path
    assert owner.get("/fonts/fonts.css").status_code == 200 and owner.get("/healthz").json()["ok"]
