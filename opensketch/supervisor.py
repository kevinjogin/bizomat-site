"""Keeps the hosted server answering: `python -m opensketch --supervise` runs the server as a child process,
asks it for /healthz every few seconds and restarts it when it stops answering or exits.

Why: Fly.io restarts a machine only when its process exits, and its health checks never restart anything. A
server stuck in a CAD call (or starved of CPU, or with every worker thread busy) keeps running and answers
nothing, so it stays down until the next deploy. On 2026-10-19 the site sat at "Waiting for the server" for
over 10 minutes that way.

Before killing a hung server the supervisor sends it SIGUSR1, which makes it print every thread's stack to
the log (faulthandler, works while another thread holds the GIL), so the log shows what it was stuck on.
"""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import threading
import time
import urllib.request

HANG_SECONDS = 120.0   # no answer for this long after it has answered once -> restart
BOOT_SECONDS = 180.0   # never answered this long after starting -> restart
INTERVAL = 5.0         # seconds between checks
TIMEOUT = 8.0          # seconds one check may take
STOP_WAIT = 8.0        # seconds the server gets to stop by itself before it is killed (fly.toml kill_timeout is more)


def _log(msg: str) -> None:
    print(f"OpenSketch supervisor: {msg}", flush=True)


class Supervisor:
    def __init__(self, cmd: list[str], url: str, *, interval: float = INTERVAL, timeout: float = TIMEOUT,
                 hang: float = HANG_SECONDS, boot: float = BOOT_SECONDS, stop_wait: float = STOP_WAIT,
                 backoff_max: float = 30.0, log=_log):
        self.cmd, self.url = cmd, url
        self.interval, self.timeout, self.hang, self.boot = interval, timeout, hang, boot
        self.stop_wait, self.backoff_max = stop_wait, backoff_max
        self.log = log
        self.child: subprocess.Popen | None = None
        self.restarts = 0
        self._stop = threading.Event()

    def healthy(self) -> bool:
        try:
            with urllib.request.urlopen(self.url, timeout=self.timeout) as r:
                return r.status == 200
        except Exception:
            return False

    def stop(self) -> None:
        """Stop the server and the supervisor (Fly's stop signal, Ctrl+C). Safe to call from a signal handler."""
        self._stop.set()
        child = self.child
        if child is not None and child.poll() is None:
            try:
                child.send_signal(signal.SIGINT)  # uvicorn finishes open requests and exits
            except OSError:
                pass

    def run(self) -> int:
        fails = 0  # servers in a row that died or hung without ever answering
        while not self._stop.is_set():
            started = time.monotonic()
            self.child = subprocess.Popen(self.cmd)
            reason, answered = self._watch(started)
            if self._stop.is_set():
                break
            self.restarts += 1
            fails = 0 if answered else fails + 1
            # a server that dies straight away (a broken deploy) is retried slower and slower, not in a tight loop
            delay = min(self.backoff_max, 2.0 ** fails) if fails else 1.0
            self.log(f"{reason}; starting it again in {delay:g} s (restart {self.restarts})")
            self._stop.wait(delay)
        self._end_child()
        return 0

    def _watch(self, started: float) -> tuple[str, bool]:
        last_ok = None
        while True:
            if self._stop.wait(self.interval):
                return "stopping", last_ok is not None
            code = self.child.poll()
            if code is not None:
                return f"the server exited (code {code})", last_ok is not None
            ok = self.healthy()
            if self._stop.is_set():
                return "stopping", last_ok is not None
            now = time.monotonic()
            if ok:
                last_ok = now
            elif last_ok is None and now - started > self.boot:
                self._kill_hung()
                return f"the server did not start answering within {self.boot:g} s", False
            elif last_ok is not None and now - last_ok > self.hang:
                self._kill_hung()
                return f"the server stopped answering ({now - last_ok:.0f} s without an answer)", True

    def _kill_hung(self) -> None:
        child = self.child
        if child is None or child.poll() is not None:
            return
        if hasattr(signal, "SIGUSR1"):
            try:  # print every thread's stack to the log first
                child.send_signal(signal.SIGUSR1)
                child.wait(1.0)
            except (OSError, subprocess.TimeoutExpired):
                pass
        self._end_child(signal.SIGTERM, wait=min(self.stop_wait, 5.0))

    def _end_child(self, sig=signal.SIGINT, wait: float | None = None) -> None:
        child = self.child
        if child is None or child.poll() is not None:
            return
        try:
            child.send_signal(sig)
            child.wait(self.stop_wait if wait is None else wait)
        except subprocess.TimeoutExpired:
            self.log("the server did not stop by itself; killing it")
            child.kill()
            child.wait()
        except OSError:
            pass


def main(host: str, port: int) -> int:
    """Entry point for `python -m opensketch --supervise`: the server runs as a child on the same host and port."""
    cmd = [sys.executable, "-m", "opensketch", "--host", host, "--port", str(port), "--no-browser"]
    probe = "127.0.0.1" if host in ("0.0.0.0", "", "::") else host
    sup = Supervisor(cmd, f"http://{probe}:{port}/healthz",
                     hang=float(os.environ.get("OPENSKETCH_HANG_SECONDS", HANG_SECONDS)),
                     boot=float(os.environ.get("OPENSKETCH_BOOT_SECONDS", BOOT_SECONDS)))

    def on_signal(_sig, _frame):
        sup.stop()

    signal.signal(signal.SIGINT, on_signal)
    signal.signal(signal.SIGTERM, on_signal)
    _log(f"watching the server at {sup.url} (restart after {sup.hang:g} s without an answer)")
    return sup.run()
