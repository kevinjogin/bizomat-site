"""Password for the whole app, and the secret address of the MCP endpoint.

OPENSKETCH_PASSWORD set: every page and API call needs the login cookie (one password, no user names).
Not set: the app is open, as before (fine while the codespace port is private).

The MCP endpoint is /mcp/<token>. Claude's connector cannot log in with a cookie, so the address itself
is the key: the token is derived from the password (or from a random secret kept in the data folder
when there is no password), or set directly with OPENSKETCH_MCP_TOKEN. Changing the password changes
the address.
"""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import asyncio
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, quote

COOKIE = "opensketch_session"
OPEN_PATHS = ("/login", "/logout", "/mcp/")


def password() -> str:
    return os.environ.get("OPENSKETCH_PASSWORD", "")


def _base_secret() -> bytes:
    if password():
        return password().encode()
    from . import store
    p = store.data_dir() / "secret"
    if not p.exists():
        p.write_text(secrets.token_hex(32))
        p.chmod(0o600)
    return p.read_text().strip().encode()


def _mac(label: str, n: int) -> str:
    return hmac.new(_base_secret(), label.encode(), hashlib.sha256).hexdigest()[:n]


def mcp_token() -> str:
    return os.environ.get("OPENSKETCH_MCP_TOKEN") or _mac("mcp", 32)


def session_value() -> str:
    return _mac("session", 40)


def check_token(token: str) -> bool:
    return bool(token) and hmac.compare_digest(token, mcp_token())


def public_url(headers: dict | None = None) -> str:
    """Address the app is reached at: OPENSKETCH_PUBLIC_URL, the codespace's forwarded port, or the request."""
    env = os.environ.get("OPENSKETCH_PUBLIC_URL", "").rstrip("/")
    if env:
        return env
    name, domain = os.environ.get("CODESPACE_NAME"), os.environ.get("GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN")
    if name and domain:
        return f"https://{name}-{os.environ.get('OPENSKETCH_PORT', '8000')}.{domain}"
    if headers:
        host = headers.get("x-forwarded-host") or headers.get("host")
        proto = headers.get("x-forwarded-proto") or "http"
        if host:
            return f"{proto}://{host}"
    return "http://127.0.0.1:8000"


def _headers(scope) -> dict:
    return {k.decode().lower(): v.decode() for k, v in scope.get("headers", [])}


def logged_in(scope) -> bool:
    if not password():
        return True
    c = SimpleCookie()
    try:
        c.load(_headers(scope).get("cookie", ""))
    except Exception:
        return False
    v = c.get(COOKIE)
    return bool(v) and hmac.compare_digest(v.value, session_value())


LOGIN_PAGE = """<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>OpenSketch</title><style>
body{{margin:0;min-height:100vh;display:grid;place-items:center;background:linear-gradient(#fff,#dfe7f1 55%,#b9c8dc);font:14px system-ui,sans-serif;color:#222}}
form{{background:#fff;border:1px solid #d5d9de;border-radius:6px;padding:24px 28px;width:min(320px,calc(100vw - 32px));box-shadow:0 4px 18px rgba(0,0,0,.08)}}
h1{{font-size:18px;margin:0 0 4px}} h1 b{{color:#d9372b}} p{{color:#666;margin:0 0 16px;font-size:12.5px}}
input{{width:100%;box-sizing:border-box;padding:8px;border:1px solid #c5cad0;border-radius:4px;font-size:14px}}
button{{margin-top:12px;width:100%;padding:8px;border:0;border-radius:4px;background:#0a64c8;color:#fff;font-size:14px;cursor:pointer}}
.err{{color:#d9372b;font-size:12.5px;margin-top:8px}}</style></head><body>
<form method="post" action="/login"><h1><b>OPEN</b>SKETCH</h1><p>Enter the password to continue.</p>
<input type="hidden" name="next" value="{next}"><input type="password" name="password" autofocus autocomplete="current-password" aria-label="Password">
<button type="submit">Sign in</button>{error}</form></body></html>"""


async def _send(send, status: int, body: bytes, headers: list) -> None:
    await send({"type": "http.response.start", "status": status, "headers": headers})
    await send({"type": "http.response.body", "body": body})


def _safe_next(n: str) -> str:
    return n if n.startswith("/") and not n.startswith("//") else "/"


class PasswordGate:
    """ASGI middleware: login page, cookie check, logout. MCP paths are checked by their token instead."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or not password():
            return await self.app(scope, receive, send)
        path = scope.get("path", "")
        if path == "/login":
            return await self._login(scope, receive, send)
        if path == "/logout":
            return await _send(send, 303, b"", [(b"location", b"/login"),
                                                (b"set-cookie", f"{COOKIE}=; Path=/; Max-Age=0".encode())])
        # /review/<token>: published review pages, read-only, the unguessable token is the key
        if path.startswith("/mcp/") or path.startswith("/review/") or logged_in(scope):
            return await self.app(scope, receive, send)
        if scope.get("method") == "GET" and not path.startswith("/api/"):
            nxt = path + ("?" + scope["query_string"].decode() if scope.get("query_string") else "")
            return await _send(send, 303, b"", [(b"location", f"/login?next={quote(nxt)}".encode())])
        return await _send(send, 401, b'{"error":"Sign in to OpenSketch first."}', [(b"content-type", b"application/json")])

    async def _login(self, scope, receive, send):
        html = [(b"content-type", b"text/html; charset=utf-8"), (b"cache-control", b"no-store")]
        q = parse_qs(scope.get("query_string", b"").decode())
        if scope.get("method") != "POST":
            page = LOGIN_PAGE.format(next=_esc(_safe_next(q.get("next", ["/"])[0])), error="")
            return await _send(send, 200, page.encode(), html)
        body = b""
        while True:
            m = await receive()
            body += m.get("body", b"")
            if not m.get("more_body") or len(body) > 10000:
                break
        form = parse_qs(body.decode(errors="ignore"))
        nxt = _safe_next(form.get("next", ["/"])[0])
        if hmac.compare_digest(form.get("password", [""])[0].encode(), password().encode()):
            secure = "; Secure" if _headers(scope).get("x-forwarded-proto") == "https" else ""
            cookie = f"{COOKIE}={session_value()}; Path=/; Max-Age={90 * 86400}; HttpOnly; SameSite=Lax{secure}"
            return await _send(send, 303, b"", [(b"location", nxt.encode()), (b"set-cookie", cookie.encode())])
        await asyncio.sleep(1)  # slow down guessing
        page = LOGIN_PAGE.format(next=_esc(nxt), error='<div class="err">Wrong password.</div>')
        return await _send(send, 401, page.encode(), html)


def _esc(t: str) -> str:
    return t.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")
