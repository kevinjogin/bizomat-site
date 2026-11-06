"""CAD Automation's holding page on the platform's cad Machine: bizomat-entrypoint cad runs it instead of the CAD
server while /data/cad holds no CAD data (a new volume, before `bizomat.ps1 move cad` puts the data there) and in
maintenance mode (/data/.bizomat-maintenance).

    python3 cad-holding.py <waiting-for-data|maintenance> [port]

  GET or HEAD /healthz   200 {"ok": false, "service": "cad", "status": ..., "version": ...}
                         200, so Fly's check passes and a deploy does not wait for a Machine that is idle on purpose;
                         "ok": false, so a person or a script reading it sees that CAD Automation is not serving.
  anything else          503 with Retry-After: a short page for browsers, JSON for programs (the add-in, the
                         Companion and AI apps try again by themselves).

It never reads or writes /data and logs no requests (no client addresses). Standard library only. It listens like the
CAD server: one dual-stack socket on :: (IPv6 for the router's private network, IPv4 for Fly's checks), or IPv4 alone
where the kernel has no IPv6.
"""

from __future__ import annotations

import json
import os
import signal
import socket
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

STATES = ("waiting-for-data", "maintenance")
RETRY_AFTER = "30"
HEADLINE = {"waiting-for-data": "CAD Automation is being moved", "maintenance": "CAD Automation is in maintenance"}
PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CAD Automation: back shortly</title></head>
<body><h1>{headline}</h1>
<p>It will be back in a few minutes. Reload this page then.</p>
<p>BIZOMAT</p></body></html>
"""


def make_handler(state: str, version: str):
    health = json.dumps({"ok": False, "service": "cad", "status": state, "version": version}).encode()
    message = f"{HEADLINE[state]}. It will be back in a few minutes; try again then."
    busy = json.dumps({"ok": False, "error": {"code": "CAD_UNAVAILABLE", "message": message}, "status": state}).encode()
    page = PAGE.format(headline=HEADLINE[state]).encode()

    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"
        def version_string(self) -> str:
            return "bizomat-cad-holding"

        def log_message(self, format, *args):  # no request log: it would hold client addresses
            pass

        def _send(self, status: int, body: bytes, ctype: str, head: bool) -> None:
            self.send_response(status)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Security-Policy", "default-src 'none'")
            self.send_header("X-Content-Type-Options", "nosniff")
            if status == 503:
                self.send_header("Retry-After", RETRY_AFTER)
            self.send_header("Connection", "close")
            self.end_headers()
            if not head:
                self.wfile.write(body)
            self.close_connection = True

        def _answer(self) -> None:
            head = self.command == "HEAD"
            path = self.path.split("?", 1)[0]
            if path == "/healthz" and self.command in ("GET", "HEAD"):
                return self._send(200, health, "application/json", head)
            if "text/html" in (self.headers.get("Accept") or ""):
                return self._send(503, page, "text/html; charset=utf-8", head)
            return self._send(503, busy, "application/json", head)

        do_GET = do_HEAD = do_POST = do_PUT = do_PATCH = do_DELETE = do_OPTIONS = _answer

    return Handler


class DualStackServer(ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True
    allow_reuse_address = True

    def server_bind(self) -> None:
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def _stop(signum, frame):  # SIGTERM (fly machine stop, a deploy): leave serve_forever
    raise KeyboardInterrupt


def serve(state: str, port: int) -> None:
    version = os.environ.get("OPENSKETCH_VERSION") or os.environ.get("BIZOMAT_VERSION") or "dev"
    handler = make_handler(state, version)
    try:
        server: ThreadingHTTPServer = DualStackServer(("::", port), handler)
    except OSError:
        server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    signal.signal(signal.SIGTERM, _stop)
    print(f"cad-holding: {state}: answering on port {port} until the CAD server can start", file=sys.stderr, flush=True)
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


def main(argv: list[str]) -> int:
    if len(argv) < 2 or argv[1] not in STATES:
        print(f"usage: cad-holding.py <{'|'.join(STATES)}> [port]", file=sys.stderr)
        return 64
    port = int(argv[2]) if len(argv) > 2 else 8001
    serve(argv[1], port)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
