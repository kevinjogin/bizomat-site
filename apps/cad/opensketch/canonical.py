"""One public address, and the other addresses the same app answers on.

- OPENSKETCH_PUBLIC_URL: the canonical address. It may carry a path: "https://bizomat.ai/cad", where the BIZOMAT
  website owns the rest of bizomat.ai. Links, canonical tags and the OAuth metadata of new connections use it.
- OPENSKETCH_REDIRECT_HOSTS: old host names, comma separated. A browser asking one of them for a page gets a
  permanent redirect (301) to the same path and query under the canonical address; the browser keeps the #fragment.
- OPENSKETCH_ALIAS_HOSTS: host names served as they are (no redirect).

The canonical host is ignored in both lists, so moving the canonical address is a change of OPENSKETCH_PUBLIC_URL alone.

Under a path prefix ("/cad"):
- A request for <prefix>/... is served with the prefix taken off the path and put in the ASGI root_path. Inside, the
  app sees the same paths as on a host of its own: routes, the sign-in gate and the computers' signed request paths
  (relative to the address they were paired with) are unchanged.
- Root paths the app writes get the prefix back: href, src, action and url() in HTML, Location headers and cookie
  paths. static/ui/app.js takes the prefix from its own address.
- The OAuth metadata of a resource under the prefix sits at the root of the host, where RFC 8414 and RFC 9728 put
  it: /.well-known/oauth-protected-resource/cad/mcp and /.well-known/oauth-authorization-server/cad (also asked for
  as /.well-known/openid-configuration/cad). Those are served too.
- On the canonical host, /CAD/... (any case) answers 301 to /cad/...; another page answers 302 to the same path under
  the prefix (once the website serves the root of that host, such requests never reach this app).

Only the Host header is read (the proxy sets it from the address the visitor used); X-Forwarded-Host is never trusted.

Not redirected, on purpose:
- anything but GET and HEAD (a 301 makes a browser drop a POST's body);
- /healthz (the deploy check and the supervisor);
- the paths programs call with their own credentials: the MCP endpoints and their uploads and downloads, OAuth
  metadata, registration, token and revoke, the add-in's link (/mcp/sw/), the KEVOS Companion's API (/v2/), and the
  page API (/api/). A connector, add-in or computer set up with an old address keeps working until it is moved.

On an old or alias host those paths keep that host as their own address (machine_base): the OAuth metadata names it
as the resource and the issuer, and upload and download links use it, because an AI app checks that the metadata
names the address it connected to. Any other host name gets the canonical address (a Host header is never echoed).
"""

from __future__ import annotations

import contextvars
import os
import re
from functools import lru_cache
from urllib.parse import urlsplit

KEEP_PREFIXES = ("/mcp", "/solidworks/mcp", "/oauth/register", "/oauth/token", "/oauth/revoke", "/.well-known/",
                 "/v2/", "/api/")
KEEP_PATHS = ("/healthz",)
WELL_KNOWN = ("/.well-known/oauth-protected-resource", "/.well-known/oauth-authorization-server")
OPENID = "/.well-known/openid-configuration"
STATIC_DIRS = ("/ui/", "/fonts/")  # files with no root path in them: served as they are, compressed when asked
STATIC_FILES = ("/favicon.ico", "/favicon.svg")
_PREFIX = re.compile(r"(?:/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+")

# The old or alias host's base URL ("https://cados.fly.dev") while a request that came in on it is served, else "".
_machine_base: contextvars.ContextVar = contextvars.ContextVar("opensketch_machine_base", default="")


def _host_only(value: str) -> str:
    """'Cados.Fly.Dev:443' -> 'cados.fly.dev' (IPv6 literals keep their brackets)."""
    v = (value or "").strip().lower().rstrip(".")
    if v.startswith("["):
        return v.split("]")[0] + "]"
    return v.split(":")[0].rstrip(".")


def _hosts(name: str) -> frozenset[str]:
    return frozenset(h for h in (_host_only(x) for x in os.environ.get(name, "").split(",")) if h)


def canonical() -> tuple[str, str]:
    """(canonical host, canonical base URL with its path, e.g. "https://bizomat.ai/cad"), or ("", "") when
    OPENSKETCH_PUBLIC_URL is unset or not an origin with an optional lowercase path."""
    target = os.environ.get("OPENSKETCH_PUBLIC_URL", "").strip().rstrip("/")
    parts = urlsplit(target)
    if parts.scheme not in ("http", "https") or not parts.hostname or parts.query or parts.fragment:
        return "", ""
    path = parts.path.rstrip("/")
    if path and not _PREFIX.fullmatch(path):
        return "", ""
    return _host_only(parts.netloc), f"{parts.scheme}://{parts.netloc}{path}"


def prefix() -> str:
    """The canonical address's path ("/cad"), or "" when the app has its host's root."""
    _, base = canonical()
    return urlsplit(base).path if base else ""


def settings() -> tuple[frozenset[str], str]:
    """(old hosts to redirect, canonical base URL), or (empty, "") when off. The canonical host is never redirected."""
    host, base = canonical()
    if not base:
        return frozenset(), ""
    hosts = _hosts("OPENSKETCH_REDIRECT_HOSTS") - {host}
    return (hosts, base) if hosts else (frozenset(), "")


def alias_hosts() -> frozenset[str]:
    """Host names served as they are that keep their own address for programs (not the canonical one, not an old one)."""
    host, base = canonical()
    if not base:
        return frozenset()
    return _hosts("OPENSKETCH_ALIAS_HOSTS") - {host} - _hosts("OPENSKETCH_REDIRECT_HOSTS")


def _known_hosts() -> frozenset[str]:
    return settings()[0] | alias_hosts()


def legacy_bases() -> list[str]:
    """Base URLs of the old and alias host names ("https://cados.fly.dev", ...), or []. Programs there use the root."""
    _, base = canonical()
    scheme = urlsplit(base).scheme if base else ""
    return [f"{scheme}://{h}" for h in sorted(_known_hosts())]


def _legacy_base(host_header: str) -> str:
    h = _host_only(host_header)
    if not h or h not in _known_hosts():
        return ""
    return f"{urlsplit(canonical()[1]).scheme}://{h}"


def machine_base(headers: dict | None = None) -> str:
    """The old or alias host's base URL when the request came in on one of them, else "" (use the canonical address).
    With headers, from their Host header; without, for the request being served (set by CanonicalHost)."""
    if headers is not None:
        return _legacy_base(headers.get("host", ""))
    return _machine_base.get()


def _kept(path: str) -> bool:
    return path in KEEP_PATHS or path.startswith(KEEP_PREFIXES)


def _host(scope) -> str:
    for k, v in scope.get("headers") or []:
        if k == b"host":
            return v.decode("latin-1")
    return ""


def inside(path: str, pre: str) -> str | None:
    """The app's own path for a request path under the prefix ("/cad/docs" -> "/docs", "/cad" -> "/", and the root
    OAuth metadata of the prefixed resource: "/.well-known/oauth-protected-resource/cad/mcp" ->
    "/.well-known/oauth-protected-resource/mcp"), or None."""
    if not pre:
        return None
    if path == pre:
        return "/"
    if path.startswith(pre + "/"):
        return path[len(pre):]
    for wk in WELL_KNOWN:
        if path == wk + pre or path.startswith(wk + pre + "/"):
            return wk + path[len(wk) + len(pre):]
    if path == OPENID + pre:
        return WELL_KNOWN[1]
    return None


def location(scope) -> str | None:
    """The 301 target for a page request on an old host, or None to serve it here. The path is the app's own path
    (after the prefix was taken off)."""
    if scope.get("type") != "http" or scope.get("method") not in ("GET", "HEAD"):
        return None
    hosts, base = settings()
    if not hosts:
        return None
    if _host_only(_host(scope)) not in hosts:
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


def _redirect(status: int, to: str, cache: bytes):
    body = b"Moved to " + to.encode("latin-1")
    start = {"type": "http.response.start", "status": status, "headers": [
        (b"location", to.encode("latin-1")), (b"content-type", b"text/plain; charset=utf-8"), (b"cache-control", cache),
        (b"content-length", str(len(body)).encode())]}
    return start, body


@lru_cache(maxsize=8)
def _patterns(pre: str):
    seg = re.escape(pre[1:].encode())
    not_yet = rb"(?!" + seg + rb"(?:[/\"'?#)]|$))"  # a path already under the prefix keeps it
    attr = re.compile(rb"(\b(?:href|src|action|formaction|poster)\s*=\s*[\"'])/(?!/)" + not_yet)
    url = re.compile(rb"(url\(\s*[\"']?)/(?!/)" + not_yet)
    return attr, url


def add_prefix(value: str, pre: str) -> str:
    """A root path the app wrote, under the prefix ("/login" -> "/cad/login"); anything else as it is."""
    if not value.startswith("/") or value.startswith("//") or value == pre or value.startswith(pre + "/") \
            or value.startswith(pre + "?") or value.startswith(pre + "#"):
        return value
    return pre + value


def _cookie_path(header: bytes, pre: str) -> bytes:
    def fix(m):
        p = m.group(2).decode("latin-1")
        return m.group(1) + (pre if p == "/" else add_prefix(p, pre)).encode("latin-1")
    return re.sub(rb"(;\s*[Pp]ath=)(/[^;]*)", fix, header)


def rewrite_html(body: bytes, pre: str) -> bytes:
    attr, url = _patterns(pre)
    p = pre.encode() + b"/"
    return url.sub(lambda m: m.group(1) + p, attr.sub(lambda m: m.group(1) + p, body))


def _prefixing_send(send, pre: str, head: bool):
    """Wraps send: Location and cookie paths get the prefix; an HTML body has its root paths rewritten (it is small:
    a page, collected whole); every other body passes through untouched."""
    state = {"start": None, "chunks": []}

    async def wrapped(message):
        if message["type"] == "http.response.start":
            headers, html = [], False
            for k, v in message.get("headers", []):
                if k == b"location":
                    v = add_prefix(v.decode("latin-1"), pre).encode("latin-1")
                elif k == b"set-cookie":
                    v = _cookie_path(v, pre)
                elif k == b"content-type" and v.split(b";")[0].strip().lower() == b"text/html":
                    html = True
                headers.append((k, v))
            message = dict(message, headers=headers)
            if not html:
                return await send(message)
            state["start"] = message
            return None
        if message["type"] == "http.response.body" and state["start"] is not None:
            state["chunks"].append(message.get("body", b""))
            if message.get("more_body"):
                return None
            start, state["start"] = state["start"], None
            body = rewrite_html(b"".join(state["chunks"]), pre)
            hdrs = [(k, v) for k, v in start["headers"] if k != b"content-length"]
            if not head:
                hdrs.append((b"content-length", str(len(body)).encode()))
            await send(dict(start, headers=hdrs))
            return await send({"type": "http.response.body", "body": b"" if head else body})
        return await send(message)

    return wrapped


class CanonicalHost:
    """ASGI middleware, outermost: the path prefix, then the old hosts' redirects, before anything else runs."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)
        pre = prefix()
        path = scope.get("path") or "/"
        method = scope.get("method")
        q = scope.get("query_string") or b""
        mine = inside(path, pre)
        if pre and mine is None and _host_only(_host(scope)) == canonical()[0]:
            # the canonical host, outside the prefix: /CAD/... in another case, or a page of the website's part
            low = path.lower()
            if (low == pre or low.startswith(pre + "/")) and method in ("GET", "HEAD"):
                to = pre + path[len(pre):] + ("?" + q.decode("latin-1") if q else "")
                start, body = _redirect(301, to, b"public, max-age=86400")
                await send(start)
                return await send({"type": "http.response.body", "body": b"" if method == "HEAD" else body})
            if method in ("GET", "HEAD") and not _kept(path):
                to = pre + path + ("?" + q.decode("latin-1") if q else "")
                start, body = _redirect(302, to, b"no-store")
                await send(start)
                return await send({"type": "http.response.body", "body": b"" if method == "HEAD" else body})
        if mine is not None:
            raw = scope.get("raw_path")
            if raw and raw.startswith(pre.encode()):
                raw = raw[len(pre):] or b"/"
            elif raw:
                raw = mine.encode("latin-1")
            headers = scope.get("headers") or []
            if not mine.startswith(STATIC_DIRS) and mine not in STATIC_FILES:
                # a page is rewritten as text, so the app must not compress it (Cloudflare compresses on the way out)
                headers = [(k, v) for k, v in headers if k != b"accept-encoding"]
            scope = dict(scope, path=mine, raw_path=raw, root_path=scope.get("root_path", "") + pre, headers=headers)
            send = _prefixing_send(send, pre, method == "HEAD")
        to = location(scope)
        if to is not None:
            start, body = _redirect(301, to, b"public, max-age=86400")
            await send(start)
            return await send({"type": "http.response.body", "body": b"" if method == "HEAD" else body})
        tok = _machine_base.set(_legacy_base(_host(scope)))
        try:
            return await self.app(scope, receive, send)
        finally:
            _machine_base.reset(tok)
