"""OpenSketch for SOLIDWORKS on its own (sw_connector.py, sw_page.py): the /solidworks/mcp endpoint serves only the
SOLIDWORKS tools, AI apps sign in to it with tokens that work only there (and Claude connected to both endpoints
keeps both), and the /solidworks page and its API."""
import re
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from opensketch import mcpauth, server, sw_connector, swbridge
from tests.test_mcp_oauth import ACCEPT, _owner, _pkce, _register


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_PUBLIC_URL", "CODESPACE_NAME",
              "OPENSKETCH_HOME", "OPENSKETCH_SOLIDWORKS_HOSTS"):
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


def _connect(browser, app_client, info, resource):
    redirect = info["redirect_uris"][0]
    verifier, chal = _pkce()
    q = {"response_type": "code", "client_id": info["client_id"], "redirect_uri": redirect, "state": "s",
         "code_challenge": chal, "code_challenge_method": "S256", "scope": "opensketch", "resource": resource}
    page = browser.get("/oauth/authorize", params=q)
    assert page.status_code == 200, page.text[:300]
    req = re.search(r'name="req" value="([^"]+)"', page.text).group(1)
    r = browser.post("/oauth/authorize", data={"req": req}, follow_redirects=False)
    code = parse_qs(urlparse(r.headers["location"]).query)["code"][0]
    tok = app_client.post("/oauth/token", data={"grant_type": "authorization_code", "code": code, "redirect_uri": redirect,
                                                "client_id": info["client_id"], "code_verifier": verifier,
                                                "resource": resource})
    assert tok.status_code == 200, tok.text
    return page.text, tok.json()


def test_the_endpoint_has_only_the_solidworks_tools(app):
    r = _rpc(app, "/solidworks/mcp", "tools/list")  # no accounts: open, like /mcp
    assert r.status_code == 200, r.text
    names = {t["name"] for t in r.json()["result"]["tools"]}
    assert names == set(sw_connector.sw_tool_names()) | {"request_upload"}
    assert {"sw_status", "sw_add_features", "sw_selftest"} <= names
    assert not names & {"get_document", "create_document", "batch", "add_extrude"}
    init = _rpc(app, "/solidworks/mcp", "initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                                                       "clientInfo": {"name": "t", "version": "1"}}).json()["result"]
    assert init["serverInfo"]["name"] == "OpenSketch for SOLIDWORKS" and "sw_status first" in init["instructions"]
    # the tools are OpenSketch's own: not connected says how, upload links point at sw_import
    out = _rpc(app, "/solidworks/mcp", "tools/call", {"name": "sw_status", "arguments": {}}).json()["result"]
    assert '"connected": false' in out["content"][0]["text"] and "/solidworks" in out["content"][0]["text"]
    up = _rpc(app, "/solidworks/mcp", "tools/call", {"name": "request_upload", "arguments": {"filename": "a.step"}}).json()
    assert "sw_import(upload_id=" in up["result"]["content"][0]["text"]


def test_sign_in_is_per_endpoint(app):
    owner = _owner()
    # signed in: no token is 401 pointing at this endpoint's own metadata
    r = _rpc(app, "/solidworks/mcp", "tools/list")
    assert r.status_code == 401
    assert "/.well-known/oauth-protected-resource/solidworks/mcp" in r.headers["www-authenticate"]
    meta = app.get("/.well-known/oauth-protected-resource/solidworks/mcp").json()
    assert meta["resource"] == "http://testserver/solidworks/mcp" and meta["resource_name"] == "OpenSketch for SOLIDWORKS"
    assert app.get("/.well-known/oauth-authorization-server/solidworks/mcp").json()["issuer"] == "http://testserver"

    info = _register(app)
    page, sw = _connect(owner, app, info, "http://testserver/solidworks/mcp")
    assert "build in SOLIDWORKS" in page and "Your AI, building in SOLIDWORKS." in page
    assert _rpc(app, "/solidworks/mcp", "tools/list", token=sw["access_token"]).status_code == 200
    assert _rpc(app, "/mcp", "tools/list", token=sw["access_token"]).status_code == 401  # not for OpenSketch's files

    # Claude registers again for the other connector: both connections stay
    info2 = _register(app)
    _, os_ = _connect(owner, app, info2, "http://testserver/mcp")
    assert _rpc(app, "/mcp", "tools/list", token=os_["access_token"]).status_code == 200
    assert _rpc(app, "/solidworks/mcp", "tools/list", token=os_["access_token"]).status_code == 401
    assert _rpc(app, "/solidworks/mcp", "tools/list", token=sw["access_token"]).status_code == 200
    # the page lists only the connection to the SOLIDWORKS endpoint
    apps = owner.get("/api/solidworks").json()["apps"]
    assert [a["endpoint"] for a in apps] == ["/solidworks/mcp"]
    # refresh keeps it on its endpoint
    r = app.post("/oauth/token", data={"grant_type": "refresh_token", "refresh_token": sw["refresh_token"],
                                       "client_id": info["client_id"]})
    assert r.status_code == 200
    assert _rpc(app, "/solidworks/mcp", "tools/list", token=r.json()["access_token"]).status_code == 200
    assert _rpc(app, "/mcp", "tools/list", token=r.json()["access_token"]).status_code == 401


def test_grants_from_before_were_for_mcp():
    assert mcpauth._grant_path({"user": "u"}) == "/mcp"
    assert mcpauth._grant_path({"resource": "https://x.dev/solidworks/mcp"}) == "/solidworks/mcp"
    assert mcpauth._grant_path({"resource": "https://x.dev"}) == ""  # the app named only the server: either


def test_private_address(app):
    owner = _owner()
    d = owner.get("/api/solidworks").json()
    path = urlparse(d["private_url"]).path
    assert path.startswith("/solidworks/mcp/")
    assert _rpc(app, path, "tools/list").status_code == 200
    assert _rpc(app, "/solidworks/mcp/not-a-key", "tools/list").status_code == 404


def test_page_and_api(app, monkeypatch):
    owner = _owner()
    anon = TestClient(server.app)
    r = anon.get("/solidworks", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/login?next=/solidworks"
    login = anon.get("/login?next=/solidworks").text
    assert "Your AI, building in SOLIDWORKS." in login
    assert "CAD that builds while you watch." in anon.get("/login").text
    page = owner.get("/solidworks")
    assert page.status_code == 200 and "OpenSketch for SOLIDWORKS" in page.text and "/api/solidworks" in page.text
    d = owner.get("/api/solidworks").json()
    assert d["url"] == "http://testserver/solidworks/mcp" and d["key"].startswith("oss_")
    assert d["status"] == {"connected": False} and d["user"]["email"] == "yz@example.com" and d["signin"] is True
    # SOLIDWORKS says hello with that key: connected, with its version and PC
    h = {"Authorization": f"Bearer {d['key']}"}
    assert app.post("/mcp/sw/hello", json={"client": "addin", "sw_version": "30.5.0", "machine": "PC1"}, headers=h).status_code == 200
    st = owner.get("/api/solidworks").json()["status"]
    assert st["connected"] and st["machine"] == "PC1"
    # a wrong key points at the page
    bad = app.post("/mcp/sw/hello", json={}, headers={"Authorization": "Bearer oss_" + "0" * 40})
    assert bad.status_code == 401 and "/solidworks" in bad.json()["detail"]
    # home: the app by default, the SOLIDWORKS page when asked
    assert "OpenSketch for SOLIDWORKS" not in owner.get("/").text
    monkeypatch.setenv("OPENSKETCH_HOME", "solidworks")
    assert "Your AI, building in SOLIDWORKS." in owner.get("/").text
    monkeypatch.delenv("OPENSKETCH_HOME")
    monkeypatch.setenv("OPENSKETCH_SOLIDWORKS_HOSTS", "sw.example.com")
    assert "Your AI, building in SOLIDWORKS." in owner.get("/", headers={"host": "sw.example.com"}).text
    assert "Your AI, building in SOLIDWORKS." not in owner.get("/").text
