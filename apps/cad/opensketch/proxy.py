"""Who is asking, and at which address, when the app runs behind a proxy.

The app runs on its own (python -m opensketch), on Fly.io with Fly's edge proxy in front, or behind the BIZOMAT
platform proxy on the same machine (it serves cad.bizomat.ai and cados.kevos.com, sets X-Forwarded-For to the one
client address, X-Forwarded-Proto and X-Forwarded-Host, and passes Fly's Fly-Client-IP on). ForwardedHeaders, the
outermost middleware, decides once per request what to believe, so the rest of the app reads plain values.

What is trusted:
- Trusted proxies: OPENSKETCH_TRUSTED_PROXIES, addresses or networks, comma separated. Default "127.0.0.0/8,::1": a
  proxy on the same machine (an IPv4 client seen on a dual-stack socket as ::ffff:a.b.c.d counts as a.b.c.d). "none"
  trusts no proxy.
- The client address, which the rate limits and logs read (scope["client"]): on Fly.io (FLY_APP_NAME is set in every
  Fly machine), Fly-Client-IP, which Fly's edge sets on each request it accepts, in place of any value a client sent.
  Otherwise, on a connection from a trusted proxy, the right-most X-Forwarded-For address that is not itself a trusted
  proxy: the address that proxy saw. Anything a client wrote before it is ignored. Otherwise the connection's own
  address. Inside one Fly organisation, a machine that reaches this app over the private network directly could send
  its own Fly-Client-IP: that network is the operator's own.
- The host name (the Host header, which the OAuth and MCP metadata, links, the same-origin check and the canonical
  redirect read): X-Forwarded-Host from a trusted proxy (its right-most value), else Host as sent. X-Forwarded-Host
  from anyone else is removed, so nothing downstream can read it.
- The scheme (scope["scheme"] and X-Forwarded-Proto): believed from a trusted proxy or, on Fly.io, from Fly's edge;
  removed otherwise.

The connection's own address stays in scope["opensketch.peer"]. uvicorn's own proxy-header handling is turned off
(__main__.py), so this module is the only place that decides.
"""

from __future__ import annotations

import ipaddress
import os
import re
from functools import lru_cache

DEFAULT_TRUSTED = "127.0.0.0/8,::1"
PEER_KEY = "opensketch.peer"
# A host name or address with an optional port. Labels are separated by dots, so a long run of letters cannot make the
# match backtrack (the value comes from the client, through the proxy).
_LABEL = rb"[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
_HOST_RE = re.compile(rb"(?:" + _LABEL + rb"(?:\." + _LABEL + rb")*\.?|\[[0-9A-Fa-f:.]{2,45}\])(?::\d{1,5})?")
MAX_HOST = 260


def host_ok(host: bytes) -> bool:
    """A plain host[:port] (no path, no spaces, no user name)."""
    return 0 < len(host) <= MAX_HOST and _HOST_RE.fullmatch(host) is not None


def ip(value) -> ipaddress.IPv4Address | ipaddress.IPv6Address | None:
    """An address from a header or a socket: '203.0.113.9', '[2001:db8::1]:443', '::ffff:127.0.0.1' (as 127.0.0.1),
    '203.0.113.9:4711'. None when it is not an address ('unknown', 'testclient', empty)."""
    if value is None:
        return None
    v = str(value).strip()
    if v.startswith("[") and "]" in v:
        v = v[1:v.index("]")]
    v = v.split("%")[0]
    try:
        a = ipaddress.ip_address(v)
    except ValueError:
        if v.count(":") != 1:
            return None
        try:
            a = ipaddress.ip_address(v.split(":")[0])
        except ValueError:
            return None
    if a.version == 6 and a.ipv4_mapped:
        return a.ipv4_mapped
    return a


@lru_cache(maxsize=16)
def _networks(raw: str) -> tuple:
    out = []
    for part in raw.split(","):
        part = part.strip()
        if not part or part.lower() == "none":
            continue
        try:
            out.append(ipaddress.ip_network(part, strict=False))
        except ValueError:
            continue
    return tuple(out)


def trusted_networks() -> tuple:
    return _networks(os.environ.get("OPENSKETCH_TRUSTED_PROXIES", DEFAULT_TRUSTED))


def is_trusted(addr) -> bool:
    """Is this address one of the trusted proxies (OPENSKETCH_TRUSTED_PROXIES)?"""
    a = addr if isinstance(addr, (ipaddress.IPv4Address, ipaddress.IPv6Address)) else ip(addr)
    return a is not None and any(a.version == n.version and a in n for n in trusted_networks())


def on_fly() -> bool:
    """Running in a Fly.io machine, behind Fly's edge proxy (Fly sets FLY_APP_NAME in every machine)."""
    return bool(os.environ.get("FLY_APP_NAME"))


def peer(scope) -> str:
    """The address of the connection itself (before ForwardedHeaders replaced scope["client"])."""
    p = scope.get(PEER_KEY) if PEER_KEY in scope else scope.get("client")
    return str((p or ("",))[0] or "")


def _values(scope, name: bytes) -> list[str]:
    """Every comma-separated value of a header, over all its lines, in order."""
    out = []
    for k, v in scope.get("headers") or []:
        if k.lower() == name:
            out += [x.strip() for x in v.decode("latin-1").split(",") if x.strip()]
    return out


def client_ip(scope) -> str:
    """The client's address for rate limits and logs (the rules are in the module docstring)."""
    if on_fly():
        fly = _values(scope, b"fly-client-ip")
        a = ip(fly[-1]) if fly else None
        if a is not None:
            return str(a)
    p = peer(scope)
    pa = ip(p)
    if pa is not None and is_trusted(pa):
        last = None
        for hop in reversed(_values(scope, b"x-forwarded-for")):
            a = ip(hop)
            if a is None:
                break  # a value that is not an address: believe nothing further left
            if not is_trusted(a):
                return str(a)
            last = a
        if last is not None:
            return str(last)
    return str(pa) if pa is not None else (p or "?")


def trusted_peer(scope) -> bool:
    """Did this connection come from a trusted proxy?"""
    return is_trusted(peer(scope))


class ForwardedHeaders:
    """ASGI middleware, outermost: applies the rules above to the scope (client, Host, scheme) once per request. It
    changes the server's own scope, so uvicorn's access log, when it is on, shows the same client."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") not in ("http", "websocket") or PEER_KEY in scope:
            return await self.app(scope, receive, send)
        original = scope.get("client")
        scope[PEER_KEY] = original
        trusted = is_trusted(peer(scope))
        headers = list(scope.get("headers") or [])
        hosts = [x for k, v in headers if k.lower() == b"x-forwarded-host" for x in v.split(b",") if x.strip()]
        protos = [x for k, v in headers if k.lower() == b"x-forwarded-proto" for x in v.split(b",") if x.strip()]
        out = [(k, v) for k, v in headers if k.lower() not in (b"x-forwarded-host", b"x-forwarded-proto")]
        if trusted and hosts:
            host = hosts[-1].strip()
            if host_ok(host):
                out = [(k, v) for k, v in out if k.lower() != b"host"] + [(b"host", host.lower())]
        if (trusted or on_fly()) and protos:
            proto = protos[-1].strip().lower()
            if proto in (b"http", b"https"):
                out.append((b"x-forwarded-proto", proto))
                if scope["type"] == "http":
                    scope["scheme"] = proto.decode()
                else:
                    scope["scheme"] = "wss" if proto == b"https" else "ws"
        scope["headers"] = out
        who = client_ip(scope)
        same = original and str(ip(original[0]) or original[0]) == who
        scope["client"] = (who, original[1] if same and len(original) > 1 else 0)
        return await self.app(scope, receive, send)
