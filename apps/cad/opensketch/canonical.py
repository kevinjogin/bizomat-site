"""One public address: browsers that reach the app on an old host name (cados.fly.dev) are sent to the canonical
address (https://cados.kevos.com) with a permanent redirect (301), keeping the path and the query; the browser keeps
the #fragment itself.

Settings (both needed, so self-hosted servers and the tests are untouched):
- OPENSKETCH_REDIRECT_HOSTS: the exact host names to redirect, comma separated (e.g. "cados.fly.dev").
- OPENSKETCH_PUBLIC_URL: where to (e.g. "https://cados.kevos.com"). Its host is never redirected, so no loop.

Only the Host header is read. Behind a trusted proxy, proxy.py (the outermost middleware) has already put that
proxy's X-Forwarded-Host there; an X-Forwarded-Host from anyone else is removed before this runs, so a visitor cannot
pick the answer.

The alias hosts (OPENSKETCH_ALIAS_HOSTS, the host names that serve this same app during a domain move, for example
cad.bizomat.ai and cados.kevos.com) are served like any other host: one is redirected only when it is also listed in
OPENSKETCH_REDIRECT_HOSTS.

Not redirected, on purpose:
- anything but GET and HEAD (a 301 makes a browser drop a POST's body);
- /healthz (the deploy check and the supervisor);
- the paths programs call with their own credentials: the MCP endpoints and their uploads and downloads, OAuth
  metadata, registration, token and revoke, the add-in's link (/mcp/sw/), the Companion's API (/v2/), and the
  page API (/api/). A connector, add-in or computer set up with the old address keeps working until it is moved.
"""

from __future__ import annotations

import os
from urllib.parse import urlsplit

KEEP_PREFIXES = ("/mcp", "/solidworks/mcp", "/oauth/register", "/oauth/token", "/oauth/revoke", "/.well-known/",
                 "/v2/", "/api/")
KEEP_PATHS = ("/healthz",)


def _host_only(value: str) -> str:
    """'Cados.Fly.Dev:443' -> 'cados.fly.dev' (IPv6 literals keep their brackets)."""
    v = (value or "").strip().lower().rstrip(".")
    if v.startswith("["):
        return v.split("]")[0] + "]"
    return v.split(":")[0].rstrip(".")


def settings() -> tuple[frozenset[str], str]:
    """(hosts to redirect, canonical base URL) or (empty, "") when off or set up so that it would loop."""
    hosts = frozenset(h for h in (_host_only(x) for x in os.environ.get("OPENSKETCH_REDIRECT_HOSTS", "").split(",")) if h)
    target = os.environ.get("OPENSKETCH_PUBLIC_URL", "").strip().rstrip("/")
    parts = urlsplit(target)
    if not hosts or parts.scheme not in ("http", "https") or not parts.hostname or parts.path not in ("", "/"):
        return frozenset(), ""
    if _host_only(parts.netloc) in hosts:  # the canonical host itself: never
        return frozenset(), ""
    return hosts, f"{parts.scheme}://{parts.netloc}"


def _kept(path: str) -> bool:
    return path in KEEP_PATHS or path.startswith(KEEP_PREFIXES)


def location(scope) -> str | None:
    """The redirect target for this request, or None to serve it here."""
    if scope.get("type") != "http" or scope.get("method") not in ("GET", "HEAD"):
        return None
    hosts, base = settings()
    if not hosts:
        return None
    host = ""
    for k, v in scope.get("headers") or []:
        if k == b"host":
            host = v.decode("latin-1")
            break
    if _host_only(host) not in hosts:
        return None
    path = scope.get("path") or "/"
    if _kept(path):
        return None
    raw = scope.get("raw_path")
    target_path = raw.decode("latin-1") if raw else path
    if not target_path.startswith("/") or target_path.startswith("//"):
        target_path = "/" + target_path.lstrip("/")
    q = scope.get("query_string") or b""
    return base + target_path + ("?" + q.decode("latin-1") if q else "")


class CanonicalHost:
    """ASGI middleware, outermost: answers 301 before anything else runs."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        to = location(scope)
        if to is None:
            return await self.app(scope, receive, send)
        await send({"type": "http.response.start", "status": 301, "headers": [
            (b"location", to.encode("latin-1")), (b"content-type", b"text/plain; charset=utf-8"),
            (b"cache-control", b"public, max-age=86400"), (b"content-length", str(len(b"Moved to " + to.encode("latin-1"))).encode())]})
        await send({"type": "http.response.body", "body": b"" if scope.get("method") == "HEAD" else b"Moved to " + to.encode("latin-1")})
