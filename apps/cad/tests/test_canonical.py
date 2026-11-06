"""The old host name (cados.fly.dev) sends browsers to the public address (https://cados.kevos.com) with a 301 that
keeps the path and the query; programs on the old address (health checks, MCP, OAuth, the device and add-in links,
the page API) are served as before; the public address itself and every other host are never redirected."""
import pytest
from fastapi.testclient import TestClient

from opensketch import canonical, server

OLD, NEW = "cados.fly.dev", "https://cados.kevos.com"


@pytest.fixture(autouse=True)
def env(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_PASSWORD", raising=False)
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", NEW)
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", OLD)


def _get(path, host=OLD, method="GET", **kw):
    c = TestClient(server.app, base_url="https://" + host)
    return c.request(method, path, headers={"host": host, **kw.pop("headers", {})}, follow_redirects=False, **kw)


@pytest.mark.parametrize("path, want", [
    ("/", NEW + "/"),
    ("/docs", NEW + "/docs"),
    ("/login?next=dashboard", NEW + "/login?next=dashboard"),
    ("/login?next=%2Fdashboard&x=a%20b&x=2", NEW + "/login?next=%2Fdashboard&x=a%20b&x=2"),
    ("/dashboard", NEW + "/dashboard"),
    ("/privacy", NEW + "/privacy"),
    ("/oauth/authorize?client_id=c&state=s", NEW + "/oauth/authorize?client_id=c&state=s"),  # people's sign-in page
    ("/devices/pair?code=ABCD-EFGH", NEW + "/devices/pair?code=ABCD-EFGH"),
    ("/ui/cados.css", NEW + "/ui/cados.css"),
    ("/a%2Fb", NEW + "/a%2Fb"),  # the path exactly as sent
])
def test_old_host_redirects_permanently_keeping_path_and_query(path, want):
    r = _get(path)
    assert r.status_code == 301 and r.headers["location"] == want
    h = _get(path, method="HEAD")
    assert h.status_code == 301 and h.headers["location"] == want and h.content == b""


def test_host_header_case_port_and_trailing_dot():
    for host in ("CADOS.FLY.DEV", "cados.fly.dev:443", "cados.fly.dev."):
        assert _get("/docs", host).headers["location"] == NEW + "/docs", host


@pytest.mark.parametrize("path", ["/healthz", "/mcp", "/mcp/", "/mcp/some-private-key", "/solidworks/mcp",
                                  "/.well-known/oauth-protected-resource", "/.well-known/oauth-authorization-server/mcp",
                                  "/v2/keys", "/v2/bridge/update.json", "/v2/device/next", "/mcp/sw/next",
                                  "/mcp/artifacts/x/y", "/api/solidworks", "/oauth/token", "/oauth/register"])
def test_machine_paths_and_health_checks_are_served_on_the_old_host(path):
    scope = {"type": "http", "method": "GET", "path": path, "raw_path": path.encode(), "query_string": b"x=1",
             "headers": [(b"host", OLD.encode())]}
    assert canonical.location(scope) is None, path
    if not path.startswith(("/mcp", "/solidworks/mcp")):  # the MCP endpoints need the app's lifespan to answer
        assert _get(path).status_code != 301, path


def test_only_get_and_head_are_redirected():
    for method in ("POST", "PUT", "DELETE", "OPTIONS"):
        assert _get("/login", method=method).status_code != 301, method


def test_the_public_address_and_other_hosts_are_served():
    assert _get("/", "cados.kevos.com").status_code == 200
    assert _get("/docs", "cados.kevos.com").status_code == 200
    assert _get("/docs", "evil.cados.fly.dev").status_code == 200
    assert _get("/docs", "127.0.0.1:8080").status_code == 200  # the supervisor and Fly's own checks


def test_forwarded_host_is_not_trusted():
    # a visitor on the public address cannot make it redirect by claiming the old host
    assert _get("/docs", "cados.kevos.com", headers={"x-forwarded-host": OLD}).status_code == 200
    # and the old host is redirected whatever forwarded host it claims
    r = _get("/docs", OLD, headers={"x-forwarded-host": "cados.kevos.com"})
    assert r.status_code == 301 and r.headers["location"] == NEW + "/docs"


def test_no_loop_and_off_unless_set(monkeypatch):
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", "cados.kevos.com,cados.fly.dev")  # target among the old hosts
    assert canonical.settings() == (frozenset(), "") and _get("/docs").status_code == 200
    monkeypatch.setenv("OPENSKETCH_REDIRECT_HOSTS", OLD)
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", "https://cados.kevos.com/sub")  # a path: pages go there (test_path_prefix.py)
    assert _get("/docs").headers["location"] == "https://cados.kevos.com/sub/docs"
    for bad in ("https://cados.kevos.com/Sub", "https://cados.kevos.com/sub?x=1"):  # not an address with a lowercase path
        monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", bad)
        assert _get("/docs").status_code == 200, bad
    monkeypatch.delenv("OPENSKETCH_PUBLIC_URL")
    assert _get("/docs").status_code == 200
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", NEW)
    monkeypatch.delenv("OPENSKETCH_REDIRECT_HOSTS")
    assert _get("/docs").status_code == 200


def test_canonical_tags_name_the_public_address():
    html = _get("/docs", "cados.kevos.com").text
    assert '<link rel="canonical" href="https://cados.kevos.com/docs">' in html
    assert '<meta property="og:url" content="https://cados.kevos.com/docs">' in html
    assert 'content="https://cados.kevos.com/ui/og.png"' in html
    product = _get("/overview", "cados.kevos.com").text  # the product page's canonical address is /
    assert '<link rel="canonical" href="https://cados.kevos.com/">' in product
