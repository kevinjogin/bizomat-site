"""A stand-in for the CAD server in the move rehearsal (rehearse.sh): started as `python3 cad-standin.py -m opensketch
--host :: --port N ...` so the move's scripts see it as CAD Automation (freeze.sh pauses Python processes; restore.sh
looks for "-m opensketch"). It answers only what the move checks, from its own data folder (OPENSKETCH_DATA), as
CAD Automation does (canonical.py: the prefix of OPENSKETCH_PUBLIC_URL is taken off on that host):

  /healthz                                   {"ok": true, "version": OPENSKETCH_VERSION}
  /v2/keys                                   the public key of bridge-signing-key.pem, with its RFC 7638 kid
  /setup                                     303 to /cad/login once users.json holds an account
  /login                                     200
  POST /mcp                                  401 naming /.well-known/oauth-protected-resource/cad/mcp
  /.well-known/oauth-protected-resource/cad/mcp   {"resource": ".../cad/mcp"}
  POST /api/touch                            writes sessions.json (a write, like a sign-in)
Standard library only (the P-256 public key is read from the PKCS#8 DER, where OpenSSL keeps it). Throwaway data only.
"""

import base64
import hashlib
import json
import os
import socket
import sys
import time
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DATA = os.environ.get("OPENSKETCH_DATA", "/data")
PUBLIC = os.environ.get("OPENSKETCH_PUBLIC_URL", "https://bizomat.ai/cad")
VERSION = os.environ.get("OPENSKETCH_VERSION", "standin")
P = urllib.parse.urlsplit(PUBLIC)
PREFIX = P.path.rstrip("/")


def b64u(b: bytes) -> str:
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def jwk():
    with open(os.path.join(DATA, "bridge-signing-key.pem")) as fh:
        der = base64.b64decode("".join(l for l in fh.read().splitlines() if not l.startswith("-----")))
    i = der.find(b"\x03\x42\x00\x04")  # BIT STRING, 66 bytes, uncompressed point
    x, y = der[i + 4:i + 36], der[i + 36:i + 68]
    key = {"crv": "P-256", "kty": "EC", "x": b64u(x), "y": b64u(y)}
    kid = b64u(hashlib.sha256(json.dumps(key, sort_keys=True, separators=(",", ":")).encode()).digest())
    return dict(key, kid=kid, alg="ES256", use="sig")


def has_accounts() -> bool:
    try:
        with open(os.path.join(DATA, "users.json")) as fh:
            return bool(json.load(fh).get("users"))
    except (OSError, ValueError):
        return False


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def send(self, status, body=b"", ctype="application/json", headers=()):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for k, v in headers:
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":  # a body after a HEAD answer would be read as the next answer
            self.wfile.write(body)

    def read_body(self) -> bytes:
        """The whole request body, by Content-Length or in chunks: the router sends a POST without a body as one empty
        chunk ("0"). Anything left unread stays on the kept-alive connection and is taken for the next request, whose
        400 (written without a status line on Python 3.12) then breaks the router's reading of this answer."""
        if "chunked" in (self.headers.get("Transfer-Encoding") or "").lower():
            body = b""
            while True:
                size = int(self.rfile.readline().split(b";")[0].strip() or b"0", 16)
                if not size:
                    while self.rfile.readline() not in (b"\r\n", b"\n", b""):  # trailers, then the blank line
                        pass
                    return body
                body += self.rfile.read(size)
                self.rfile.readline()  # the line end after each chunk
        n = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(n) if n else b""

    def route(self):
        host = (self.headers.get("Host") or "").split(":")[0].lower()
        path = urllib.parse.urlsplit(self.path).path
        prefix = PREFIX if host == P.hostname and (path == PREFIX or path.startswith(PREFIX + "/")) else ""
        if prefix:
            path = path[len(prefix):] or "/"
        base = f"{P.scheme}://{host}{PREFIX}" if prefix else f"{P.scheme}://{host}"
        self.read_body()
        if path == "/healthz":
            return self.send(200, json.dumps({"ok": True, "version": VERSION}).encode())
        if path == "/v2/keys":
            return self.send(200, json.dumps({"keys": [jwk()]}).encode())
        if path == "/setup":
            if has_accounts():
                return self.send(303, b"", "text/plain", [("Location", f"{prefix}/login")])
            return self.send(200, b"setup", "text/html")
        if path == "/login":
            return self.send(200, b"<title>Sign in</title>", "text/html")
        if path == "/mcp" and self.command == "POST":
            meta = f"{P.scheme}://{host}/.well-known/oauth-protected-resource{prefix}/mcp"
            return self.send(401, b'{"error": "unauthorized"}', headers=[("WWW-Authenticate", f'Bearer resource_metadata="{meta}"')])
        if path.startswith("/.well-known/oauth-protected-resource"):
            return self.send(200, json.dumps({"resource": f"{P.scheme}://{host}{path[len('/.well-known/oauth-protected-resource'):]}",
                                              "authorization_servers": [base]}).encode())
        if path == "/api/touch" and self.command == "POST":
            f = os.path.join(DATA, "sessions.json")
            with open(f) as fh:
                s = json.load(fh)
            s[hashlib.sha256(str(time.time()).encode()).hexdigest()] = {"user": "u1", "created": int(time.time()), "expires": 4102444800}
            with open(f + ".tmp", "w") as fh:
                json.dump(s, fh)
            os.replace(f + ".tmp", f)
            return self.send(200, b'{"ok": true}')
        return self.send(404, b'{"error": "not found"}')

    do_GET = do_POST = do_HEAD = route


class DualStack(ThreadingHTTPServer):
    address_family = socket.AF_INET6
    daemon_threads = True

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def main(argv):
    port = int(argv[argv.index("--port") + 1]) if "--port" in argv else 8000
    try:
        server = DualStack(("::", port), Handler)
    except OSError:
        server = ThreadingHTTPServer(("0.0.0.0", port), Handler)
    print(f"cad-standin: {DATA} on port {port}, version {VERSION}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main(sys.argv)
