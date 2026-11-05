"""Behind a proxy (proxy.py): the client address the rate limits and logs use, the host name and the scheme come from a
trusted proxy's headers (a proxy on the same machine by default, Fly's edge for Fly-Client-IP) and never from a client's
own; `--host ::` listens on IPv6 and IPv4, and the supervisor's health check reaches it; the data folder is a setting."""
import asyncio
import os
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from opensketch import auth, mcpauth, proxy, server, supervisor

PROXY = ("127.0.0.1", 50000)          # the platform proxy, on the same machine
DIRECT = ("198.51.100.20", 50000)     # someone who reached the app without the proxy


@pytest.fixture(autouse=True)
def env(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_PUBLIC_URL", "OPENSKETCH_ALIAS_HOSTS", "OPENSKETCH_TRUSTED_PROXIES",
              "OPENSKETCH_REDIRECT_HOSTS", "FLY_APP_NAME"):
        monkeypatch.delenv(k, raising=False)
    mcpauth._token_hits.clear()
    return tmp_path


def _scope(client, **headers):
    return {"type": "http", "client": client,
            "headers": [(k.replace("_", "-").encode(), v.encode()) for k, v in headers.items()]}


def test_forwarded_for_is_believed_only_from_a_trusted_proxy():
    # through the proxy: the one address it set, or the right-most one when a client wrote its own before it
    assert proxy.client_ip(_scope(PROXY, x_forwarded_for="203.0.113.9")) == "203.0.113.9"
    assert proxy.client_ip(_scope(PROXY, x_forwarded_for="10.9.9.9, 203.0.113.9")) == "203.0.113.9"
    # a proxy hop on this machine is skipped; the dual-stack form of 127.0.0.1 is still this machine
    assert proxy.client_ip(_scope(PROXY, x_forwarded_for="203.0.113.9, 127.0.0.1")) == "203.0.113.9"
    assert proxy.client_ip(_scope(("::ffff:127.0.0.1", 1), x_forwarded_for="2001:db8::7")) == "2001:db8::7"
    # nothing usable from the proxy: the proxy itself
    assert proxy.client_ip(_scope(PROXY, x_forwarded_for="unknown")) == "127.0.0.1"
    assert proxy.client_ip(_scope(PROXY)) == "127.0.0.1"
    # anyone else: its own address, whatever it claims
    assert proxy.client_ip(_scope(DIRECT, x_forwarded_for="203.0.113.9", fly_client_ip="203.0.113.10")) == DIRECT[0]
    assert proxy.client_ip(_scope(("::ffff:198.51.100.20", 1))) == "198.51.100.20"
    assert proxy.client_ip(_scope(("testclient", 1), x_forwarded_for="203.0.113.9")) == "testclient"


def test_fly_client_ip_is_believed_on_fly_only(monkeypatch):
    s = _scope(("172.16.5.5", 1), fly_client_ip="203.0.113.10", x_forwarded_for="10.0.0.1")
    assert proxy.client_ip(s) == "172.16.5.5"  # not on Fly: a client could have written it
    monkeypatch.setenv("FLY_APP_NAME", "cados")
    assert proxy.client_ip(s) == "203.0.113.10"  # Fly's edge sets it on every request it takes
    assert proxy.client_ip(_scope(PROXY, fly_client_ip="203.0.113.10", x_forwarded_for="203.0.113.10")) == "203.0.113.10"
    assert proxy.client_ip(_scope(PROXY, fly_client_ip="not an address", x_forwarded_for="203.0.113.9")) == "203.0.113.9"


def test_the_trusted_proxies_are_a_setting(monkeypatch):
    s = _scope(("10.1.2.3", 1), x_forwarded_for="203.0.113.9")
    assert proxy.client_ip(s) == "10.1.2.3"
    monkeypatch.setenv("OPENSKETCH_TRUSTED_PROXIES", "10.0.0.0/8, fdaa::/16")
    assert proxy.client_ip(s) == "203.0.113.9"
    assert proxy.is_trusted("fdaa:0:1::3") and not proxy.is_trusted("127.0.0.1")
    monkeypatch.setenv("OPENSKETCH_TRUSTED_PROXIES", "none")
    assert proxy.client_ip(_scope(PROXY, x_forwarded_for="203.0.113.9")) == "127.0.0.1"


def test_a_hostile_host_header_is_refused_quickly():
    t = time.monotonic()
    assert not proxy.host_ok(b"a" * 5000 + b"!") and not proxy.host_ok((b"a" * 60 + b".") * 40 + b"!")
    assert time.monotonic() - t < 0.5
    for good in (b"cad.bizomat.ai", b"cados.kevos.com:443", b"127.0.0.1:8001", b"[::1]:8001", b"localhost"):
        assert proxy.host_ok(good), good
    for bad in (b"evil.example/path", b"a b", b"user@host", b"", b"host:99999999"):
        assert not proxy.host_ok(bad), bad


def test_the_middleware_sets_client_host_and_scheme_from_the_proxy_only():
    seen = {}

    async def app(scope, receive, send):
        seen.update(client=scope["client"], scheme=scope["scheme"], headers=dict(scope["headers"]), peer=proxy.peer(scope))

    mw = proxy.ForwardedHeaders(app)
    asyncio.run(mw({"type": "http", "scheme": "http", "client": ("::ffff:127.0.0.1", 41000),
                    "headers": [(b"host", b"127.0.0.1:8001"), (b"x-forwarded-for", b"203.0.113.9"),
                                (b"x-forwarded-proto", b"https"), (b"x-forwarded-host", b"Cad.Bizomat.AI")]}, None, None))
    assert seen["client"] == ("203.0.113.9", 0) and seen["scheme"] == "https" and seen["peer"] == "::ffff:127.0.0.1"
    assert seen["headers"][b"host"] == b"cad.bizomat.ai" and b"x-forwarded-host" not in seen["headers"]
    asyncio.run(mw({"type": "http", "scheme": "http", "client": DIRECT,
                    "headers": [(b"host", b"cados.kevos.com"), (b"x-forwarded-for", b"203.0.113.9"),
                                (b"x-forwarded-proto", b"https"), (b"x-forwarded-host", b"cad.bizomat.ai")]}, None, None))
    assert seen["client"] == DIRECT and seen["scheme"] == "http" and seen["headers"][b"host"] == b"cados.kevos.com"
    assert b"x-forwarded-host" not in seen["headers"] and b"x-forwarded-proto" not in seen["headers"]


def test_rate_limits_count_the_real_client_and_cannot_be_dodged(monkeypatch):
    """The token endpoint's per-address limit: through the proxy each client has its own count; a client that reaches
    the app directly cannot get a fresh count by writing X-Forwarded-For or Fly-Client-IP."""
    monkeypatch.setattr(mcpauth, "TOKEN_LIMIT", 2)
    via = TestClient(server.app, client=PROXY)

    def token(c, **h):
        return c.post("/oauth/token", data={"grant_type": "refresh_token", "client_id": "osc_x"},
                      headers={k.replace("_", "-"): v for k, v in h.items()}).status_code

    assert [token(via, x_forwarded_for="203.0.113.1") for _ in range(3)] == [401, 401, 429]
    assert token(via, x_forwarded_for="203.0.113.2") == 401  # another person behind the same proxy
    assert token(via, x_forwarded_for="198.51.100.7, 203.0.113.1") == 429  # a claimed address in front changes nothing
    direct = TestClient(server.app, client=DIRECT)
    codes = [token(direct, x_forwarded_for=f"203.0.113.{100 + i}", fly_client_ip=f"203.0.113.{200 + i}") for i in range(3)]
    assert codes == [401, 401, 429]


def test_sign_in_cookies_are_secure_behind_the_https_proxy():
    def setup(client, **h):
        r = TestClient(server.app, client=client).post(
            "/setup", data={"name": "O", "email": "o@example.com", "new_password": "owner-pass-1"},
            headers={k.replace("_", "-"): v for k, v in h.items()}, follow_redirects=False)
        assert r.status_code == 303, r.text
        return r.headers["set-cookie"]

    assert "Secure" in setup(PROXY, x_forwarded_proto="https")


def test_a_client_cannot_claim_https_without_the_proxy():
    r = TestClient(server.app, client=DIRECT).post(
        "/setup", data={"name": "O", "email": "o@example.com", "new_password": "owner-pass-1"},
        headers={"x-forwarded-proto": "https"}, follow_redirects=False)
    assert r.status_code == 303 and "Secure" not in r.headers["set-cookie"]


def test_an_open_server_takes_pairing_only_from_its_own_machine_even_behind_a_proxy():
    form = {"code": "ABCD-EFGH", "name": "PC"}
    through = TestClient(server.app, client=PROXY).post("/devices/pair", data=form, headers={"x-forwarded-for": "203.0.113.9"})
    assert through.status_code == 403  # a visitor through the proxy is not this machine
    local = TestClient(server.app, client=PROXY).post("/devices/pair", data=form)
    assert local.status_code != 403  # someone at the machine itself (the code is just unknown)


def test_the_problem_log_names_the_real_client(capsys):
    async def failing(scope, receive, send):
        await send({"type": "http.response.start", "status": 503, "headers": []})
        await send({"type": "http.response.body", "body": b""})

    async def send(_message):
        pass

    app = proxy.ForwardedHeaders(server.RequestLog(failing))
    asyncio.run(app({"type": "http", "method": "GET", "path": "/api/x", "client": PROXY,
                     "headers": [(b"x-forwarded-for", b"203.0.113.9")]}, None, send))
    asyncio.run(app({"type": "http", "method": "GET", "path": "/api/x", "client": DIRECT,
                     "headers": [(b"x-forwarded-for", b"203.0.113.9")]}, None, send))
    out = capsys.readouterr().out.splitlines()
    assert "-> 503" in out[0] and "from 203.0.113.9" in out[0] and f"from {DIRECT[0]}" in out[1]


# ----------------------------------------------------------------------------- listening on :: and the health check

def _ipv6() -> bool:
    try:
        with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
            s.bind(("::1", 0))
        return True
    except OSError:
        return False


def _accepts(socks, addr):
    port = socks[0].getsockname()[1]
    with socket.create_connection((addr, port), timeout=3):
        pass


def test_every_address_means_ipv4_too():
    from opensketch.__main__ import display_url, listen_sockets
    assert listen_sockets("127.0.0.1", 0) is None and listen_sockets("0.0.0.0", 0) is None  # uvicorn binds those itself
    socks = listen_sockets("::", 0)
    try:
        assert socks and len({s.getsockname()[1] for s in socks}) == 1
        _accepts(socks, "127.0.0.1")  # the supervisor and a proxy on this machine
        if _ipv6():
            _accepts(socks, "::1")
    finally:
        for s in socks:
            s.close()
    assert display_url("::", 8001) == "http://127.0.0.1:8001/" and display_url("::1", 8001) == "http://[::1]:8001/"
    assert supervisor.probe_url("::", 8001) == "http://127.0.0.1:8001/healthz"
    assert supervisor.probe_url("[::]", 8001) == "http://127.0.0.1:8001/healthz"
    assert supervisor.probe_url("0.0.0.0", 8080) == "http://127.0.0.1:8080/healthz"
    assert supervisor.probe_url("::1", 8001) == "http://[::1]:8001/healthz"
    assert supervisor.probe_url("cad.internal", 8001) == "http://cad.internal:8001/healthz"


@pytest.mark.skipif(not socket.has_dualstack_ipv6(), reason="this system cannot make a dual-stack socket")
def test_one_dual_stack_socket_where_the_system_allows_it():
    from opensketch.__main__ import listen_sockets
    socks = listen_sockets("::", 0)
    try:
        assert len(socks) == 1 and socks[0].family == socket.AF_INET6
        _accepts(socks, "127.0.0.1")
        _accepts(socks, "::1")
    finally:
        socks[0].close()


def test_the_server_runs_without_uvicorns_own_proxy_headers(monkeypatch, capsys):
    """__main__ hands uvicorn the sockets for :: and turns its X-Forwarded-* handling off (proxy.py decides)."""
    import uvicorn

    from opensketch import __main__ as main_mod
    from opensketch import cadworker
    got = {}

    class FakeServer:
        def __init__(self, config):
            got["config"], self.started = config, True

        def run(self, sockets=None):
            got["sockets"] = sockets
            for s in sockets or []:
                s.close()

    monkeypatch.setattr(uvicorn, "Server", FakeServer)
    monkeypatch.setattr(cadworker, "oom_score", lambda n: None)
    monkeypatch.setattr(main_mod.faulthandler, "register", lambda *a, **k: None)  # needs a real stderr
    monkeypatch.setattr(sys, "argv", ["opensketch", "--host", "::", "--port", "0", "--no-browser"])
    main_mod.main()
    assert got["config"].proxy_headers is False and got["sockets"]
    assert "BIZOMAT CAD Automation running at http://127.0.0.1:0/" in capsys.readouterr().out


@pytest.mark.slow
def test_the_supervised_server_on_every_address_answers_its_health_check(tmp_path):
    """The command the platform runs: python -m opensketch --host :: --port <p> --no-browser --supervise, with its data
    in a folder of its own (OPENSKETCH_DATA=/data/cad on the platform; nothing assumes /data)."""
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    data = tmp_path / "data" / "cad"
    env = dict(os.environ, OPENSKETCH_DATA=str(data), OPENSKETCH_CAD_WORKERS="0", PYTHONUNBUFFERED="1")
    root = Path(__file__).resolve().parents[1]
    p = subprocess.Popen([sys.executable, "-m", "opensketch", "--host", "::", "--port", str(port), "--no-browser", "--supervise"],
                         cwd=root, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, start_new_session=True)
    try:
        deadline, ok = time.monotonic() + 90, None
        while time.monotonic() < deadline and ok is None:
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{port}/healthz", timeout=2) as r:
                    ok = r.status == 200 and b'"ok":true' in r.read()
            except OSError:
                time.sleep(0.5)
        assert ok, "no answer on 127.0.0.1"
        if _ipv6():
            with urllib.request.urlopen(f"http://[::1]:{port}/healthz", timeout=5) as r:
                assert r.status == 200
        assert data.is_dir()  # made at start, nested folders included
    finally:
        p.terminate()
        try:
            out, _ = p.communicate(timeout=20)
        except subprocess.TimeoutExpired:
            p.kill()
            out, _ = p.communicate()
    assert f"watching the server at http://127.0.0.1:{port}/healthz" in out, out
    assert "BIZOMAT CAD Automation running at" in out, out
