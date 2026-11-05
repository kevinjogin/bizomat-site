"""Fetching a URL someone else named (an AI app's OAuth client metadata document, mcpauth.py) without letting it
reach the server's own network: public https addresses only, and the connection goes to the address that was checked
(no second DNS lookup), which defeats DNS rebinding."""

from __future__ import annotations


class FetchError(Exception):
    def __init__(self, message: str, status: int | None = None):
        super().__init__(message)
        self.status = status


def _public_ip(ip) -> bool:
    """Reachable on the public internet: not private, loopback, link-local, shared (CGNAT), NAT64..."""
    import ipaddress
    if ip.version == 6 and ip.ipv4_mapped:
        ip = ip.ipv4_mapped
    if not ip.is_global or ip.is_multicast:
        return False
    for net in ("64:ff9b::/96", "64:ff9b:1::/48", "2002::/16", "2001::/32"):  # NAT64, 6to4, Teredo can reach inside
        if ip.version == 6 and ip in ipaddress.ip_network(net):
            return False
    return True


def resolve_public(host: str, port: int) -> str:
    """One public address for host, or FetchError when any address it resolves to is not public."""
    import ipaddress
    import socket
    try:
        infos = socket.getaddrinfo(host, port, proto=socket.IPPROTO_TCP)
    except OSError:
        raise FetchError(f"Could not find {host}.") from None
    addrs = [ipaddress.ip_address(i[4][0].split("%")[0]) for i in infos]
    if not addrs or not all(_public_ip(ip) for ip in addrs):
        raise FetchError("That address is on a private network.")
    return str(addrs[0])


def check_base_url(url: str) -> str:
    """An address the server may fetch: public https only, so private and local addresses (cloud metadata, other
    services on the machine, Fly's private network) are refused."""
    from urllib.parse import urlparse
    u = urlparse((url or "").strip())
    if u.scheme != "https" or not u.hostname or u.username or u.password:
        raise FetchError("The address must start with https://.")
    resolve_public(u.hostname, u.port or 443)
    return url.strip().rstrip("/")


def pinned(url: str) -> tuple[str, dict, dict]:
    """The request URL with the host replaced by an address checked just now, the Host header and the TLS name. Connecting to the checked address (not a fresh lookup) defeats DNS rebinding."""
    from urllib.parse import urlsplit, urlunsplit
    check_base_url(url)
    u = urlsplit(url)
    ip = resolve_public(u.hostname, u.port or 443)
    netloc = (f"[{ip}]" if ":" in ip else ip) + (f":{u.port}" if u.port else "")
    return urlunsplit((u.scheme, netloc, u.path, u.query, "")), {"Host": u.netloc}, {"sni_hostname": u.hostname}
