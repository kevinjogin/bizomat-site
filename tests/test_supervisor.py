"""The hosted server restarts itself when it hangs or exits (2026-10-19: the Fly site sat at "Waiting for the
server" for over 10 minutes, and Fly only restarts a machine whose process exits)."""
import sys
import textwrap
import threading
import time

from fastapi.testclient import TestClient

from opensketch import server, supervisor

# A stand-in server: notes each start in a file, answers /healthz, then hangs (stops answering but keeps running)
# after HANG_AFTER seconds, or exits with code 3 when EXIT is set.
FAKE = textwrap.dedent("""
    import http.server, os, socketserver, sys, threading, time
    port, starts, mode = int(sys.argv[1]), sys.argv[2], sys.argv[3]
    with open(starts, "a") as f:
        f.write("start\\n")
    if mode == "exit":
        time.sleep(0.3)
        sys.exit(3)
    born = time.monotonic()
    hung = threading.Event()
    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            if mode == "hang" and time.monotonic() - born > 1.0:
                hung.wait()  # never answers again, like a server stuck in a CAD call
            self.send_response(200); self.end_headers(); self.wfile.write(b"ok")
        def log_message(self, *a):
            pass
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(("127.0.0.1", port), H)
    srv.daemon_threads = True
    srv.serve_forever()
""")


def _free_port():
    import socket
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _run(tmp_path, mode, until, timeout=20):
    script = tmp_path / "fake.py"
    script.write_text(FAKE)
    starts = tmp_path / "starts.txt"
    port = _free_port()
    logs = []
    sup = supervisor.Supervisor([sys.executable, str(script), str(port), str(starts), mode],
                                f"http://127.0.0.1:{port}/healthz", interval=0.2, timeout=0.5, hang=1.0, boot=3.0,
                                stop_wait=2.0, backoff_max=0.3, log=logs.append)
    t = threading.Thread(target=sup.run, daemon=True)
    t.start()
    end = time.monotonic() + timeout
    while time.monotonic() < end and not until(starts.read_text().count("start") if starts.exists() else 0):
        time.sleep(0.1)
    child = sup.child
    sup.stop()
    t.join(10)
    assert not t.is_alive(), "the supervisor did not stop"
    assert child.poll() is not None, "the server was left running"
    return starts.read_text().count("start"), logs, sup


def test_a_hung_server_is_restarted(tmp_path):
    n, logs, sup = _run(tmp_path, "hang", lambda n: n >= 2)
    assert n >= 2 and sup.restarts >= 1
    assert any("stopped answering" in m for m in logs), logs


def test_a_server_that_exits_is_restarted_with_backoff(tmp_path):
    n, logs, sup = _run(tmp_path, "exit", lambda n: n >= 3)
    assert n >= 3
    assert any("exited (code 3)" in m for m in logs), logs


def test_a_healthy_server_is_left_alone(tmp_path):
    t0 = time.monotonic()
    n, logs, sup = _run(tmp_path, "ok", lambda n: n >= 1 and time.monotonic() - t0 > 2.5)
    assert n == 1 and sup.restarts == 0 and logs == []


def test_healthz_answers_without_sign_in(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "a server password")
    c = TestClient(server.app)
    r = c.get("/healthz")
    assert r.status_code == 200 and r.json()["ok"] is True
    assert c.get("/api/docs").status_code == 401  # everything else still needs signing in


def test_a_paused_machine_is_not_taken_for_a_hang(tmp_path, monkeypatch):
    """Fly can suspend an idle machine: the clock jumps on waking, but the server is fine."""
    clock = {"skew": 0.0}
    real = time.monotonic
    monkeypatch.setattr(supervisor.time, "monotonic", lambda: real() + clock["skew"])
    script = tmp_path / "fake.py"
    script.write_text(FAKE)
    starts = tmp_path / "starts.txt"
    port = _free_port()
    logs = []
    sup = supervisor.Supervisor([sys.executable, str(script), str(port), str(starts), "ok"],
                                f"http://127.0.0.1:{port}/healthz", interval=0.2, timeout=0.5, hang=1.0, boot=3.0,
                                stop_wait=2.0, log=logs.append)
    t = threading.Thread(target=sup.run, daemon=True)
    t.start()
    time.sleep(1.5)
    clock["skew"] = 3600.0  # an hour "passes" in one step
    time.sleep(1.5)
    sup.stop()
    t.join(10)
    assert sup.restarts == 0 and starts.read_text().count("start") == 1
    assert any("paused" in m for m in logs), logs
