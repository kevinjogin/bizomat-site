"""CAD Automation under the BIZOMAT website's address: OPENSKETCH_PUBLIC_URL = https://bizomat.ai/cad, as fly.toml
sets it (ported from jogkev-creator/CADOS#14 and #15).

- Requests under /cad are served with the prefix taken off (the app sees its own paths) and every root path the app
  writes gets it back: links in HTML, Location headers, cookie paths. No link on any page leaves /cad, and every page
  runs only the scripts its Content Security Policy names (bizomat.ai is one origin for the website and both apps).
- The OAuth metadata of https://bizomat.ai/cad/mcp is where RFC 8414 and RFC 9728 put it, at the root of the host.
- On bizomat.ai, /CAD answers 301 to /cad, and a page outside /cad answers 302 into it.
- The old address cados.kevos.com (OPENSKETCH_ALIAS_HOSTS and OPENSKETCH_REDIRECT_HOSTS) sends pages to
  https://bizomat.ai/cad with a 301 and keeps serving programs (MCP, OAuth, the add-in link, the Companion API) at
  its root with its own address.
- Connectors set up with either the new or the old address sign in and keep working."""
import base64
import hashlib
import re
import secrets
from urllib.parse import parse_qs, urlparse

import pytest
from fastapi.testclient import TestClient

from opensketch import canonical, mcpauth, server, uploads

SITE, PRE, NEW = "bizomat.ai", "/cad", "https://bizomat.ai/cad"
OLD = ("cados.kevos.com",)
ACCEPT = {"Accept": "application/json, text/event-stream"}


@pytest.fixture(autouse=True)
def env(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "OPENSKETCH_TRUSTED_PROXIES", "FLY_APP_NAME"):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", NEW)
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", ",".join(OLD))
    monkeypatch.setenv("OPENSKETCH_ALIAS_HOSTS", ",".join(OLD))
    mcpauth._codes.clear()
    mcpauth._reg_hits.clear()
    mcpauth._token_hits.clear()


def _client(host=SITE):
    return TestClient(server.app, base_url="https://" + host)


def _get(path, host=SITE, method="GET", **kw):
    return _client(host).request(method, path, headers={"host": host, **kw.pop("headers", {})},
                                 follow_redirects=False, **kw)


PAGES = ["/", "/docs", "/overview", "/privacy", "/login?next=dashboard", "/login?next=%2Fdashboard&x=a%20b&x=2",
         "/dashboard", "/download/solidworks", "/oauth/authorize?client_id=c&state=s", "/devices/pair?code=ABCD-EFGH",
         "/ui/cados.css", "/a%2Fb"]
PROGRAMS = ["/healthz", "/mcp", "/mcp/", "/mcp/some-private-key", "/solidworks/mcp",
            "/.well-known/oauth-protected-resource", "/.well-known/oauth-authorization-server/mcp", "/v2/keys",
            "/v2/bridge/update.json", "/v2/device/next", "/mcp/sw/next", "/mcp/artifacts/x/y", "/mcp/uploads/x",
            "/api/solidworks", "/oauth/token", "/oauth/register", "/oauth/revoke"]
LINK = re.compile(r"""(?:href|src|action|formaction)\s*=\s*["']([^"']*)["']|url\(\s*["']?([^)"']*)""")
INLINE = re.compile(r"<script>(.*?)</script>", re.S)


def _policy_holds(r) -> None:
    """A page runs only scripts its Content Security Policy names: its file, and each inline script by its hash."""
    if not r.headers.get("content-type", "").startswith("text/html"):
        return
    csp = r.headers.get("content-security-policy", "")
    assert "script-src 'self'" in csp and "frame-ancestors 'none'" in csp, (r.url, csp)
    assert "'unsafe-inline'" not in csp.split("script-src")[1].split(";")[0], csp
    for body in INLINE.findall(r.text):
        h = "'sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode() + "'"
        assert h in csp, (r.url, body[:60])
    assert re.findall(r"<script(?![^>]*\bsrc=)(?!>)[^>]*>", r.text) == [], r.url  # no other inline script
    assert r.headers.get("x-content-type-options") == "nosniff", r.url


def _outside(html: str) -> list[str]:
    """Links in a page that are root paths outside /cad (absolute https links and #fragments are fine)."""
    found = [a or b for a, b in LINK.findall(html)]
    return [u for u in found if u.startswith("/") and not u.startswith("//")
            and not (u == PRE or u.startswith(PRE + "/") or u.startswith(PRE + "?") or u.startswith(PRE + "#"))]


# ----------------------------------------------------------------------------- the address and its parts

def test_the_public_address_may_carry_a_lowercase_path(monkeypatch):
    assert canonical.canonical() == (SITE, NEW) and canonical.prefix() == PRE
    assert canonical.settings() == (frozenset(OLD), NEW)
    for good, pre in (("https://bizomat.ai/cad/", "/cad"), ("https://bizomat.ai", ""), ("https://bizomat.ai/a/b-2", "/a/b-2")):
        monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", good)
        assert canonical.prefix() == pre, good
    for bad in ("https://bizomat.ai/CAD", "https://bizomat.ai/c d", "https://bizomat.ai/cad?x=1", "ftp://bizomat.ai/cad",
                "https://bizomat.ai/-cad"):
        monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", bad)
        assert canonical.canonical() == ("", "") and canonical.settings() == (frozenset(), ""), bad


def test_root_paths_written_by_the_app_get_the_prefix():
    page = (b'<a href="/docs">x</a><link href="/ui/cados.css"><script src=\'/ui/app.js\'></script>'
            b'<form action="/login"><a href="//cdn.example/x"><a href="/cad/docs"><a href="/cadence">'
            b'<a href="https://bizomat.ai/docs"><a href="#top"><p>Use /docs and href=/x in prose</p>'
            b'<div style="background:url(/ui/a.png)"><a href="/cad">')
    out = canonical.rewrite_html(page, PRE).decode()
    assert 'href="/cad/docs"' in out and 'href="/cad/ui/cados.css"' in out and "src='/cad/ui/app.js'" in out
    assert 'action="/cad/login"' in out and 'href="//cdn.example/x"' in out and 'href="/cad/cadence"' in out
    assert out.count('href="/cad/docs"') == 2 and 'href="https://bizomat.ai/docs"' in out and 'href="#top"' in out
    assert "Use /docs and href=/x in prose" in out and "url(/cad/ui/a.png)" in out and 'href="/cad"' in out
    assert canonical.add_prefix("/login?next=/x", PRE) == "/cad/login?next=/x"
    assert canonical.add_prefix("/cad/x", PRE) == "/cad/x" and canonical.add_prefix("https://x/y", PRE) == "https://x/y"


# ----------------------------------------------------------------------------- bizomat.ai/cad

@pytest.mark.parametrize("path", ["/cad", "/cad/", "/cad/docs", "/cad/overview", "/cad/privacy", "/cad/setup",
                                  "/cad/ui/cados.css", "/cad/ui/app.js", "/cad/ui/bizomat-tokens.css",
                                  "/cad/fonts/fonts.css", "/cad/fonts/oxanium-latin.woff2", "/cad/favicon.svg",
                                  "/cad/healthz"])
def test_the_app_is_served_under_cad(path):
    r = _get(path)
    assert r.status_code == 200, (path, r.status_code, r.headers.get("location"))


def test_the_stylesheets_find_their_fonts_under_cad():
    """The fonts the pages preload are the ones the stylesheets ask for: under /cad, never the website's /fonts/."""
    page = _get("/cad/docs").text
    css = _get("/cad/ui/bizomat-tokens.css").text
    for font in ("oxanium-latin.woff2", "inter-tight-latin.woff2"):
        assert f'href="/cad/fonts/{font}"' in page, font
        assert f"url('../fonts/{font}')" in css and f"url('/fonts/{font}')" not in css, font  # ../ from /cad/ui/
    assert "url(inter-tight-latin.woff2)" in _get("/cad/fonts/fonts.css").text  # relative to /cad/fonts/


def test_the_rest_of_bizomat_ai_is_sent_into_cad():
    r = _get("/docs?x=1")
    assert r.status_code == 302 and r.headers["location"] == "/cad/docs?x=1" and r.headers["cache-control"] == "no-store"
    assert _get("/").headers["location"] == "/cad/"
    for path, want in (("/CAD/docs", "/cad/docs"), ("/Cad", "/cad"), ("/CAD/", "/cad/")):
        r = _get(path)
        assert r.status_code == 301 and r.headers["location"] == want, path
    assert _get("/healthz").status_code == 200  # the deploy check, on any host
    _setup_owner()  # sign-in on: the MCP endpoint asks for a token (an open server would need the app's lifespan)
    assert _get("/mcp", method="POST", json={}).status_code == 401  # a program at the root is never moved


def test_no_link_on_any_page_leaves_cad():
    """Every page, signed out and signed in, keeps its links under /cad and runs only the scripts its policy names."""
    for path in ("/cad/", "/cad/docs", "/cad/overview", "/cad/privacy", "/cad/setup", "/cad/login", "/cad/no-such-page"):
        r = _client().get(path, headers={"accept": "text/html"})
        assert not _outside(r.text), (path, _outside(r.text)[:5])
        _policy_holds(r)
    owner = _client()
    r = owner.post("/cad/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse",
                                       "next": "/"}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/cad/"
    assert all("Path=/cad;" in c for c in r.headers.get_list("set-cookie") if "Path=" in c), r.headers.get_list("set-cookie")
    for path in ("/cad/", "/cad/dashboard", "/cad/assistant", "/cad/solidworks", "/cad/tools", "/cad/history",
                 "/cad/settings", "/cad/admin", "/cad/devices/pair", "/cad/login"):
        r = owner.get(path, follow_redirects=False)
        assert r.status_code in (200, 303), (path, r.status_code)
        assert not _outside(r.text), (path, _outside(r.text)[:5])
        _policy_holds(r)
        if r.status_code == 303:
            assert r.headers["location"].startswith("/cad"), (path, r.headers["location"])
    r = _client().get("/cad/dashboard", follow_redirects=False)  # signed out: sign-in under /cad, coming back to /cad
    assert r.status_code == 303 and r.headers["location"].startswith("/cad/login")


def test_pages_at_the_root_of_a_host_get_the_same_policy_and_keep_their_links(monkeypatch):
    """A host of its own (the old addresses, a self-hosted server): no prefix anywhere, the same page policy."""
    monkeypatch.delenv("OPENSKETCH_REDIRECT_HOSTS")
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://cad.example.test")
    for path in ("/", "/docs", "/overview", "/setup"):
        r = _get(path, "cad.example.test", headers={"accept": "text/html"})
        assert r.status_code == 200 and 'href="/ui/cados.css"' in r.text and "/cad/" not in r.text, path
        _policy_holds(r)
    assert "content-security-policy" not in _get("/healthz", "cad.example.test").headers  # only pages get the policy
    assert _get("/healthz", "cad.example.test").headers["x-content-type-options"] == "nosniff"


def test_the_script_takes_the_prefix_from_its_own_address():
    js = _get("/cad/ui/app.js").text
    assert "new URL(document.currentScript.src).pathname" in js and "fetch(BASE + path" in js
    assert "location.href = '/" not in js  # every page change goes through BASE


# ----------------------------------------------------------------------------- the old address

@pytest.mark.parametrize("host", OLD)
@pytest.mark.parametrize("path", PAGES)
def test_the_old_address_sends_pages_to_bizomat_ai_cad(host, path):
    r = _get(path, host)
    assert r.status_code == 301 and r.headers["location"] == NEW + path
    h = _get(path, host, method="HEAD")
    assert h.status_code == 301 and h.headers["location"] == NEW + path and h.content == b""


@pytest.mark.parametrize("host", OLD)
@pytest.mark.parametrize("path", PROGRAMS)
def test_programs_on_the_old_address_are_never_redirected(host, path):
    scope = {"type": "http", "method": "GET", "path": path, "raw_path": path.encode(), "query_string": b"x=1",
             "headers": [(b"host", host.encode())]}
    assert canonical.location(scope) is None, path
    if not path.startswith(("/mcp", "/solidworks/mcp")):  # the MCP endpoints need the app's lifespan to answer
        assert _get(path, host).status_code != 301, path


def test_only_get_and_head_are_redirected_and_forwarded_hosts_are_not_trusted():
    for method in ("POST", "PUT", "DELETE", "OPTIONS"):
        assert _get("/login", "cados.kevos.com", method=method).status_code != 301, method
    r = _get("/docs", "cados.kevos.com", headers={"x-forwarded-host": SITE})
    assert r.status_code == 301 and r.headers["location"] == NEW + "/docs"
    assert _get("/cad/docs", "evil.example").status_code == 200  # another host: served, its Host never echoed


# ----------------------------------------------------------------------------- OAuth

def _setup_owner(host=SITE, prefix=PRE):
    b = _client(host)
    r = b.post(prefix + "/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse",
                                        "next": "/"}, headers={"host": host}, follow_redirects=False)
    assert r.status_code == 303, r.text[:300]
    return b


def test_oauth_metadata_sits_where_rfc_8414_and_9728_put_it():
    _setup_owner()
    for url in ("/.well-known/oauth-protected-resource/cad/mcp", "/cad/.well-known/oauth-protected-resource/mcp"):
        pr = _get(url).json()
        assert pr["resource"] == NEW + "/mcp" and pr["authorization_servers"] == [NEW], url
    sw = _get("/.well-known/oauth-protected-resource/cad/solidworks/mcp").json()
    assert sw["resource"] == NEW + "/solidworks/mcp"
    for url in ("/.well-known/oauth-authorization-server/cad", "/cad/.well-known/oauth-authorization-server",
                "/.well-known/openid-configuration/cad"):
        md = _get(url).json()
        assert md["issuer"] == NEW, url
        for k in ("authorization_endpoint", "token_endpoint", "registration_endpoint", "revocation_endpoint"):
            assert md[k].startswith(NEW + "/oauth/"), (url, k)
    r = _get("/cad/mcp", method="POST", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}},
             headers=ACCEPT)
    assert r.status_code == 401
    assert 'resource_metadata="https://bizomat.ai/.well-known/oauth-protected-resource/cad/mcp"' in r.headers["www-authenticate"]
    for host in OLD:  # the old address keeps naming itself for its connectors
        pr = _get("/.well-known/oauth-protected-resource/mcp", host).json()
        assert pr["resource"] == f"https://{host}/mcp" and pr["authorization_servers"] == [f"https://{host}"]
        assert _get("/.well-known/oauth-authorization-server", host).json()["issuer"] == f"https://{host}"
        r = _get("/mcp", host, method="POST", json={"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}},
                 headers=ACCEPT)
        assert f'resource_metadata="https://{host}/.well-known/oauth-protected-resource/mcp"' in r.headers["www-authenticate"]


def _pkce():
    v = secrets.token_urlsafe(48)
    return v, base64.urlsafe_b64encode(hashlib.sha256(v.encode()).digest()).decode().rstrip("=")


CALLBACK = "https://claude.ai/api/mcp/auth_callback"


def _sign_in(app, browser, resource_base, api_prefix, host):
    """An AI app set up with <resource_base>/mcp: registration and token on that address; consent in the browser,
    which the old address sends on to bizomat.ai/cad."""
    hdr = {"host": host}
    reg = app.post(api_prefix + "/oauth/register", json={"client_name": "Claude", "redirect_uris": [CALLBACK]}, headers=hdr)
    assert reg.status_code == 201, reg.text
    cid = reg.json()["client_id"]
    verifier, chal = _pkce()
    q = {"response_type": "code", "client_id": cid, "redirect_uri": CALLBACK, "state": "s1", "code_challenge": chal,
         "code_challenge_method": "S256", "scope": "opensketch", "resource": resource_base + "/mcp"}
    r = browser.get(f"https://{host}{api_prefix}/oauth/authorize", params=q, headers=hdr, follow_redirects=False)
    if r.status_code == 301:
        assert r.headers["location"].startswith(NEW + "/oauth/authorize?")
        r = browser.get(r.headers["location"], headers={"host": SITE}, follow_redirects=False)
    assert r.status_code == 200 and b"Allow" in r.content, r.text[:300]
    req = re.search(r'name="req" value="([^"]+)"', r.text).group(1)
    r = browser.post(NEW + "/oauth/authorize", data={"req": req}, headers={"host": SITE}, follow_redirects=False)
    assert r.status_code == 303
    back = parse_qs(urlparse(r.headers["location"]).query)
    tok = app.post(api_prefix + "/oauth/token", headers=hdr, data={
        "grant_type": "authorization_code", "code": back["code"][0], "redirect_uri": CALLBACK, "client_id": cid,
        "code_verifier": verifier, "resource": resource_base + "/mcp"})
    assert tok.status_code == 200, tok.text
    return tok.json(), back["iss"][0], cid


def _initialize(app, host, path, access):
    body = {"jsonrpc": "2.0", "id": 1, "method": "initialize",
            "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "t", "version": "1"}}}
    return app.post(path, json=body, headers={**ACCEPT, "host": host, "Authorization": f"Bearer {access}"})


def test_apps_set_up_with_the_new_or_the_old_address_sign_in_and_keep_working():
    browser = _setup_owner()
    with TestClient(server.app, base_url="https://" + SITE) as app:
        for host, resource_base, api_prefix in ((SITE, NEW, PRE), ("cados.kevos.com", "https://cados.kevos.com", "")):
            tok, iss, cid = _sign_in(app, browser, resource_base, api_prefix, host)
            assert iss == resource_base, host  # RFC 9207: the issuer whose metadata it read
            assert _initialize(app, host, api_prefix + "/mcp", tok["access_token"]).status_code == 200, host
            assert _initialize(app, SITE, "/cad/mcp", tok["access_token"]).status_code == 200, host  # not tied to a host
            refreshed = app.post(api_prefix + "/oauth/token", headers={"host": host}, data={
                "grant_type": "refresh_token", "refresh_token": tok["refresh_token"], "client_id": cid,
                "resource": resource_base + "/mcp"})
            assert refreshed.status_code == 200, refreshed.text


def test_google_sign_in_comes_back_under_cad(monkeypatch):
    """Google sends the person back to the address the sign-in started from, under /cad (the website owns the rest of
    bizomat.ai), and the state cookie is scoped there: the return address registered with Google is
    https://bizomat.ai/cad/auth/google/callback, which the settings page shows."""
    from opensketch import oauth
    browser = _setup_owner()
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "cid.apps.googleusercontent.com")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "secret")
    asked = []

    async def exchange(code, redirect_uri):
        asked.append(redirect_uri)
        return {"sub": "g-1", "email": "owner@example.com", "email_verified": True, "name": "Owner", "hd": "example.com"}
    monkeypatch.setattr(oauth, "exchange", exchange)
    back = NEW + "/auth/google/callback"
    assert browser.get(PRE + "/api/account/google", headers={"host": SITE}).json()["redirect_uri"] == back
    browser.get(PRE + "/logout", headers={"host": SITE})
    r = browser.get(PRE + "/auth/google", headers={"host": SITE}, follow_redirects=False)
    assert r.status_code == 303 and parse_qs(urlparse(r.headers["location"]).query)["redirect_uri"] == [back]
    assert "Path=/cad/auth/google;" in r.headers["set-cookie"]
    state = parse_qs(urlparse(r.headers["location"]).query)["state"][0]
    r = browser.get(f"{PRE}/auth/google/callback?state={state}&code=good-code", headers={"host": SITE}, follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == PRE + "/", r.text[:300]
    assert asked == [back]
    assert browser.get(PRE + "/api/account", headers={"host": SITE}).json()["user"]["google"]


def test_sign_in_to_another_server_is_refused():
    browser = _setup_owner()
    reg = browser.post("/cad/oauth/register", json={"client_name": "Claude", "redirect_uris": [CALLBACK]}).json()
    _, chal = _pkce()
    for res in ("https://evil.example/mcp", "https://bizomat.ai/mcp", "https://bizomat.ai/cadx/mcp",
                "https://cados.kevos.com.evil.example/mcp", "https://kevos.com/mcp"):
        q = {"response_type": "code", "client_id": reg["client_id"], "redirect_uri": CALLBACK, "state": "s",
             "code_challenge": chal, "code_challenge_method": "S256", "resource": res}
        r = browser.get("/cad/oauth/authorize", params=q, follow_redirects=False)
        assert r.status_code == 400 and "location" not in r.headers, res


def test_the_app_sees_its_own_paths_and_links_name_the_public_address():
    seen = []

    async def app(scope, receive, send):
        seen.append((scope["path"], scope.get("root_path")))
        await send({"type": "http.response.start", "status": 200, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    c = TestClient(canonical.CanonicalHost(app))
    for host, path in ((SITE, "/cad/mcp"), ("cados.kevos.com", "/mcp"), ("cados.kevos.com", "/v2/device/next"),
                       (SITE, "/.well-known/oauth-protected-resource/cad/mcp"), (SITE, "/.well-known/openid-configuration/cad")):
        c.post(path, headers={"host": host})
    assert seen == [("/mcp", "/cad"), ("/mcp", ""), ("/v2/device/next", ""),
                    ("/.well-known/oauth-protected-resource/mcp", "/cad"), ("/.well-known/oauth-authorization-server", "/cad")]
    assert uploads.create(None, "plate.step", 2**20)["upload_url"].startswith(NEW + "/mcp/uploads/")
