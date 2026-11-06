"""--host :: listens on every address. On Fly the BIZOMAT router reaches CAD Automation over the private network,
which is IPv6 (cados.internal:8080), while Fly's proxy and the supervisor's health check use IPv4; with --host
0.0.0.0 the router could not connect. Where the system has no IPv6 at all, IPv4 alone."""

import os
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

import pytest

from opensketch import supervisor


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
        _accepts(socks, "127.0.0.1")  # Fly's proxy and the supervisor
        if _ipv6():
            _accepts(socks, "::1")  # the private network
    finally:
        for s in socks:
            s.close()
    assert display_url("::", 8080) == "http://127.0.0.1:8080/" and display_url("::1", 8080) == "http://[::1]:8080/"
    assert supervisor.probe_url("::", 8080) == "http://127.0.0.1:8080/healthz"
    assert supervisor.probe_url("[::]", 8080) == "http://127.0.0.1:8080/healthz"
    assert supervisor.probe_url("0.0.0.0", 8080) == "http://127.0.0.1:8080/healthz"
    assert supervisor.probe_url("::1", 8080) == "http://[::1]:8080/healthz"
    assert supervisor.probe_url("cados.internal", 8080) == "http://cados.internal:8080/healthz"


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


def test_the_server_is_handed_the_sockets_for_every_address(monkeypatch, capsys):
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
    assert got["sockets"] and got["config"].timeout_graceful_shutdown == 3
    assert "CAD Automation running at http://127.0.0.1:0/ (every address)" in capsys.readouterr().out


@pytest.mark.slow
def test_the_supervised_server_on_every_address_answers_its_health_check(tmp_path):
    """The command the Dockerfile runs: python -m opensketch --host :: --port <p> --no-browser --supervise."""
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        port = s.getsockname()[1]
    env = dict(os.environ, OPENSKETCH_DATA=str(tmp_path / "data"), OPENSKETCH_CAD_WORKERS="0", PYTHONUNBUFFERED="1")
    root = Path(__file__).resolve().parents[1]
    p = subprocess.Popen([sys.executable, "-m", "opensketch", "--host", "::", "--port", str(port), "--no-browser", "--supervise"],
                         cwd=root, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, start_new_session=True)
    try:
        deadline, ok = time.monotonic() + 240, None
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
    finally:
        p.terminate()
        try:
            p.communicate(timeout=20)
        except subprocess.TimeoutExpired:
            p.kill()
            p.communicate()
