"""Sign-in for AI apps that connect to OpenSketch: OAuth 2.1 for the MCP endpoint (MCP authorization spec).

An AI app (Claude, ChatGPT, Codex, Cursor, VS Code...) is given only the plain address <site>/mcp. Its first request
gets 401 with a pointer to the protected-resource metadata; it reads the authorization-server metadata, registers
itself (Dynamic Client Registration, RFC 7591), and sends the person's browser to /oauth/authorize. There they sign
in to OpenSketch as usual (password or Google) and click Allow on a consent page. The AI app swaps the one-time
code (PKCE S256 required) for an access token (1 hour) and a refresh token (90 days, rotated on every use), and sends
`Authorization: Bearer <access token>` with every MCP request. The token stands for that person: the MCP tools reach
only their own SOLIDWORKS link. People see and disconnect their apps on the home page.

Stored in <data>/mcp_oauth.json: registered clients (secrets as SHA-256), grants (one per person and app: who, which
app, when, the current refresh token's SHA-256) and live access tokens (SHA-256 -> grant, expiry). Codes live in
memory for 10 minutes. The old private addresses (/mcp/<key>) keep working beside this.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import os
import secrets
import tempfile
import threading
import time
from urllib.parse import urlencode, urlsplit

SCOPE = "opensketch"
ACCESS_TTL = 3600
REFRESH_TTL = 90 * 86400
REFRESH_GRACE = 120          # a retried refresh with the token just replaced still works for this long
CODE_TTL = 600
CONSENT_TTL = 900
MAX_CLIENTS = 2000           # when full, the oldest registration never used for a grant makes room
UNUSED_CLIENT_DAYS = 30      # registrations never used for a grant are removed after this
REGISTER_LIMIT = 30          # registrations per address (IPv6: per /64) per hour
MAX_REDIRECTS = 5            # return addresses per registration
MAX_REDIRECT_LEN = 512
TOKEN_LIMIT = 120            # token and revoke calls per address per minute
TOUCH_EVERY = 300            # how often "last used" is written

_lock = threading.RLock()
_codes: dict[str, dict] = {}
_reg_hits: dict[str, list[float]] = {}
_touched: dict[str, float] = {}


class OAuthError(Exception):
    def __init__(self, error: str, description: str, status: int = 400):
        super().__init__(description)
        self.error, self.description, self.status = error, description, status

    def body(self) -> dict:
        return {"error": self.error, "error_description": self.description}


# ----------------------------------------------------------------------------- storage

def _file():
    from . import store
    return store.data_dir() / "mcp_oauth.json"


_cache: dict[str, tuple] = {}  # file -> (inode, mtime_ns, size, parsed): the MCP endpoint reads it on every request


def _view() -> dict:
    """The stored clients, grants and access tokens, parsed once per change and shared: never change it."""
    p = _file()
    try:
        st = p.stat()
    except FileNotFoundError:
        return {"clients": {}, "grants": {}, "access": {}}
    hit = _cache.get(str(p))
    if hit and hit[:3] == (st.st_ino, st.st_mtime_ns, st.st_size):
        return hit[3]
    try:
        d = json.loads(p.read_text())
    except ValueError:
        d = {}
    if not isinstance(d, dict):
        d = {}
    for k in ("clients", "grants", "access"):
        d.setdefault(k, {})
    _cache[str(p)] = (st.st_ino, st.st_mtime_ns, st.st_size, d)
    return d


def _load() -> dict:
    """A private copy for a writer (hold _lock, then _save)."""
    import copy
    return copy.deepcopy(_view())


def _save(d: dict) -> None:
    now = time.time()
    d["access"] = {k: v for k, v in d["access"].items() if v.get("exp", 0) > now and v.get("grant") in d["grants"]}
    d["grants"] = {k: v for k, v in d["grants"].items() if v.get("refresh_exp", 0) > now}
    used = {g["client_id"] for g in d["grants"].values()}
    d["clients"] = {k: v for k, v in d["clients"].items()
                    if k in used or now - v.get("created", now) < UNUSED_CLIENT_DAYS * 86400}
    p = _file()
    p.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=p.parent, prefix=".mcp_oauth.", suffix=".tmp")
    with os.fdopen(fd, "w") as f:
        json.dump(d, f)
    os.chmod(tmp, 0o600)
    os.replace(tmp, p)
    import copy
    st = p.stat()
    _cache[str(p)] = (st.st_ino, st.st_mtime_ns, st.st_size, copy.deepcopy(d))


def _h(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _eq(a: str, b: str) -> bool:
    return hmac.compare_digest(str(a or "").encode(), str(b or "").encode())


# ----------------------------------------------------------------------------- metadata

def base_url(headers: dict) -> str:
    """This request's address for the metadata: the alias host it was made to, else OPENSKETCH_PUBLIC_URL, else its own
    host (auth.public_url). A client that connects to cad.bizomat.ai is told about cad.bizomat.ai, one that connects to
    cados.kevos.com about cados.kevos.com: OAuth clients check that the metadata names the address they used."""
    from . import auth
    return auth.public_url(headers).rstrip("/")


def own_bases(headers: dict) -> list[str]:
    """Every address this server answers as: this request's own first, then each alias host and OPENSKETCH_PUBLIC_URL."""
    from . import auth
    out = [base_url(headers)]
    for b in auth.known_bases():
        if _canon(b) not in {_canon(x) for x in out}:
            out.append(b.rstrip("/"))
    return out


def _own_targets(bases: list[str]) -> dict[str, str]:
    """canon(address) -> MCP resource, for each base's MCP paths and the bare base (which means its /mcp)."""
    out: dict[str, str] = {}
    for b in bases:
        for p in RESOURCES:
            out.setdefault(_canon(b + p), b + p)
        out.setdefault(_canon(b), b + "/mcp")
    return out


def issuer_for(resource: str, headers: dict) -> str:
    """The issuer to name in an authorization response (RFC 9207 iss): the server address the app signed in to, which is
    its resource's own address when that is one of this server's (the metadata it read there named that issuer)."""
    o = _canon(_origin(resource))
    return next((b for b in own_bases(headers) if _canon(b) == o), base_url(headers))


# The MCP endpoint's addresses (mcp_server.PATHS): /mcp, and /solidworks/mcp, a second address early connectors
# used. Both are the same server, so a token from either works on both, on every public host name (tokens are looked
# up by their hash, with no host in them).
RESOURCES = {"/mcp": "BIZOMAT CAD Automation", "/solidworks/mcp": "BIZOMAT CAD Automation"}


def resource_url(headers: dict, path: str = "/mcp") -> str:
    return base_url(headers) + path


def resource_metadata_url(headers: dict, path: str = "/mcp") -> str:
    return base_url(headers) + "/.well-known/oauth-protected-resource" + path


def protected_resource(headers: dict, path: str = "/mcp") -> dict:
    return {"resource": resource_url(headers, path), "authorization_servers": [base_url(headers)],
            "scopes_supported": [SCOPE], "bearer_methods_supported": ["header"], "resource_name": RESOURCES[path],
            "resource_documentation": base_url(headers) + "/privacy"}




def server_metadata(headers: dict) -> dict:
    b = base_url(headers)
    return {"issuer": b, "authorization_endpoint": b + "/oauth/authorize", "token_endpoint": b + "/oauth/token",
            "registration_endpoint": b + "/oauth/register", "revocation_endpoint": b + "/oauth/revoke",
            "scopes_supported": [SCOPE], "response_types_supported": ["code"], "response_modes_supported": ["query"],
            "grant_types_supported": ["authorization_code", "refresh_token"],
            "code_challenge_methods_supported": ["S256"],
            "token_endpoint_auth_methods_supported": ["none", "client_secret_post", "client_secret_basic"],
            "revocation_endpoint_auth_methods_supported": ["none", "client_secret_post", "client_secret_basic"],
            "authorization_response_iss_parameter_supported": True, "client_id_metadata_document_supported": True,
            "service_documentation": b + "/privacy"}


def challenge(headers: dict, error: str = "", path: str = "/mcp") -> str:
    """The WWW-Authenticate value for a 401 from an MCP endpoint."""
    extra = f', error="{error}"' if error else ""
    return f'Bearer resource_metadata="{resource_metadata_url(headers, path)}", scope="{SCOPE}"{extra}'


# ----------------------------------------------------------------------------- clients (RFC 7591)

_BAD_SCHEMES = {"javascript", "data", "file", "vbscript", "about", "blob", "ftp", "ws", "wss", "chrome", "view-source"}


def redirect_ok(uri: str) -> bool:
    """https anywhere; http only to this computer (localhost, 127.0.0.1, [::1]); or an app's own scheme
    (cursor://..., vscode://...). Never a fragment, never credentials in the address."""
    if not isinstance(uri, str) or not uri or len(uri) > MAX_REDIRECT_LEN or any(ord(c) < 0x21 for c in uri):
        return False
    try:
        u = urlsplit(uri)
    except ValueError:
        return False
    if u.fragment or "#" in uri or u.username or u.password:
        return False
    s = u.scheme.lower()
    if s == "https":
        return bool(u.hostname)
    if s == "http":
        return (u.hostname or "") in ("localhost", "127.0.0.1", "::1")
    return bool(s) and s not in _BAD_SCHEMES and s.isascii() and (s[0].isalpha())


def _rate_ok(ip: str, limit: int = REGISTER_LIMIT, window: float = 3600, table: dict | None = None) -> bool:
    """At most `limit` calls per `window` seconds from one client address (auth._client: IPv6 counts per /64)."""
    table = _reg_hits if table is None else table
    now = time.time()
    with _lock:
        if len(table) > 5000:  # forget addresses that went quiet, never the whole table
            for k in [k for k, v in table.items() if not v or now - v[-1] >= window]:
                table.pop(k, None)
        hits = [t for t in table.get(ip, []) if now - t < window]
        table[ip] = hits
        if len(hits) >= limit:
            return False
        hits.append(now)
        return True


_token_hits: dict[str, list[float]] = {}


def token_rate_ok(ip: str) -> bool:
    """The public token and revoke endpoints: TOKEN_LIMIT calls a minute per address."""
    return _rate_ok(ip or "?", TOKEN_LIMIT, 60, _token_hits)


def register(meta: dict, ip: str = "") -> dict:
    if not isinstance(meta, dict):
        raise OAuthError("invalid_client_metadata", "Send the client metadata as a JSON object.")
    uris = meta.get("redirect_uris")
    if not isinstance(uris, list) or not uris or len(uris) > MAX_REDIRECTS or not all(redirect_ok(u) for u in uris):
        raise OAuthError("invalid_redirect_uri", f"redirect_uris must be 1 to {MAX_REDIRECTS} https addresses, http://localhost "
                                                 "or an app's own scheme.")
    method = meta.get("token_endpoint_auth_method") or "none"
    if method not in ("none", "client_secret_post", "client_secret_basic"):
        raise OAuthError("invalid_client_metadata", "token_endpoint_auth_method must be none, client_secret_post or client_secret_basic.")
    grants = meta.get("grant_types") or ["authorization_code", "refresh_token"]
    if not isinstance(grants, list) or "authorization_code" not in grants:
        raise OAuthError("invalid_client_metadata", "grant_types must include authorization_code.")
    name = str(meta.get("client_name") or "An AI app").strip()[:80] or "An AI app"
    if not _rate_ok(ip or "?"):
        raise OAuthError("temporarily_unavailable", "Too many registrations from this address. Try again later.", 429)
    client_id = "osc_" + secrets.token_urlsafe(18)
    rec = {"name": name, "redirect_uris": uris, "auth": method, "created": int(time.time()),
           "uri": str(meta.get("client_uri") or "")[:300] if redirect_ok(str(meta.get("client_uri") or "")) else ""}
    out = {"client_id": client_id, "client_id_issued_at": rec["created"], "client_name": name, "redirect_uris": uris,
           "grant_types": ["authorization_code", "refresh_token"], "response_types": ["code"],
           "token_endpoint_auth_method": method, "scope": SCOPE}
    if method != "none":
        secret = "oss_" + secrets.token_urlsafe(32)
        rec["secret"] = _h(secret)
        out["client_secret"], out["client_secret_expires_at"] = secret, 0
    with _lock:
        d = _load()
        if len(d["clients"]) >= MAX_CLIENTS:  # make room: the oldest registrations no grant ever used
            used = {g["client_id"] for g in d["grants"].values()}
            unused = sorted((v.get("created", 0), k) for k, v in d["clients"].items() if k not in used)
            if not unused:
                raise OAuthError("temporarily_unavailable", "This server has too many connected apps.", 503)
            for _, k in unused[:len(d["clients"]) - MAX_CLIENTS + 1]:
                d["clients"].pop(k, None)
        d["clients"][client_id] = rec
        _save(d)
    return out


def client(client_id: str, fetch: bool = True) -> dict | None:
    """A registered client (osc_...), or a Client ID Metadata Document: an https URL whose JSON describes the app
    (ChatGPT uses https://chatgpt.com/oauth/client.json). None when unknown or unreadable. fetch=False: a document
    only when it was read already (ensure_client), never a network call."""
    if not isinstance(client_id, str):
        return None
    if client_id.startswith("https://"):
        return metadata_client(client_id, fetch)
    if not client_id.startswith("osc_"):
        return None
    return _view()["clients"].get(client_id)


# ----------------------------------------------------------------------------- client ID metadata documents

CIMD_TTL = 3600
CIMD_FAIL_TTL = 60
CIMD_MAX_BYTES = 64 * 1024
CIMD_DEADLINE = 5.0          # the whole fetch (connect, every read)
CIMD_WORKERS = 4             # fetches at once, in their own threads (never the server's request threads)
_cimd: dict[str, tuple[float, dict | None]] = {}
_cimd_slots = threading.BoundedSemaphore(CIMD_WORKERS)
_cimd_running: dict[str, object] = {}
_cimd_pool = None


def _cimd_future(url: str):
    """The fetch of this document, started if needed: one per address, at most CIMD_WORKERS at once, refused
    at once when they are all busy (slow or hostile addresses cannot pile up)."""
    global _cimd_pool
    from concurrent.futures import ThreadPoolExecutor
    with _lock:
        f = _cimd_running.get(url)
        if f is not None:
            return f
        if not _cimd_slots.acquire(blocking=False):
            raise OAuthError("temporarily_unavailable", "Too many apps are connecting right now. Try again in a minute.", 503)
        if _cimd_pool is None:
            _cimd_pool = ThreadPoolExecutor(max_workers=CIMD_WORKERS, thread_name_prefix="cimd")
        try:
            f = _cimd_pool.submit(_cimd_run, url)
        except BaseException:
            _cimd_slots.release()
            raise
        _cimd_running[url] = f
        return f


def _cimd_run(url: str):
    try:
        return _read_metadata(url)
    finally:
        with _lock:
            _cimd_running.pop(url, None)
        _cimd_slots.release()


def _remember(url: str, rec: dict | None) -> None:
    now = time.time()
    with _lock:
        if len(_cimd) > 500:
            for k in [k for k, v in _cimd.items() if v[0] <= now] or sorted(_cimd, key=lambda k: _cimd[k][0])[:100]:
                _cimd.pop(k, None)
        _cimd[url] = (now + (CIMD_TTL if rec else CIMD_FAIL_TTL), rec)


async def ensure_client(client_id) -> None:
    """Read an app's metadata document (if its client_id is one) without holding a request thread: the fetch runs
    in this module's own small pool and is given up after CIMD_DEADLINE + 1 s. Then client(id, fetch=False)
    answers from the cache."""
    import asyncio
    if not isinstance(client_id, str) or not client_id.startswith("https://") or not _cimd_url_ok(client_id):
        return
    hit = _cimd.get(client_id)
    if hit and hit[0] > time.time():
        return
    f = _cimd_future(client_id)
    try:
        rec = await asyncio.wait_for(asyncio.shield(asyncio.wrap_future(f)), CIMD_DEADLINE + 1)
    except (OAuthError, asyncio.TimeoutError):
        rec = None
    _remember(client_id, rec)


def _cimd_url_ok(url: str) -> bool:
    try:
        u = urlsplit(url)
    except ValueError:
        return False
    return (len(url) <= 500 and u.scheme == "https" and bool(u.hostname) and u.path not in ("", "/")
            and not u.fragment and not u.username and not u.password and "#" not in url and "/./" not in u.path
            and "/../" not in u.path)


def _fetch_metadata(url: str) -> dict:
    """GET the app's metadata document. Only public https addresses, connected by the address checked just now
    (no DNS rebinding), no redirects, at most 64 KB, 5 seconds (the server makes this request: SSRF rules apply)."""
    import httpx
    from . import safefetch
    deadline = time.monotonic() + CIMD_DEADLINE
    try:
        target, host, ext = safefetch.pinned(url)
        left = max(0.5, deadline - time.monotonic())
        with httpx.Client(timeout=httpx.Timeout(left), follow_redirects=False) as http:
            with http.stream("GET", target, headers={**host, "Accept": "application/json"}, extensions=ext) as r:
                if r.status_code != 200:
                    raise OAuthError("invalid_client", f"The app's details at {urlsplit(url).hostname} could not be read ({r.status_code}).")
                body = b""
                for chunk in r.iter_bytes():
                    body += chunk
                    if len(body) > CIMD_MAX_BYTES:
                        raise OAuthError("invalid_client", "The app's details document is too large.")
                    if time.monotonic() > deadline:  # a server that trickles bytes: the read timeout alone never ends
                        raise OAuthError("invalid_client", f"{urlsplit(url).hostname} took too long to send the app's details.")
    except safefetch.FetchError as e:
        raise OAuthError("invalid_client", f"The app's details address is not usable: {e}") from None
    except httpx.HTTPError:
        raise OAuthError("invalid_client", f"Could not reach {urlsplit(url).hostname} to read the app's details.") from None
    try:
        return json.loads(body)
    except ValueError:
        raise OAuthError("invalid_client", "The app's details document is not JSON.") from None


def _read_metadata(url: str) -> dict:
    """Fetch and check an app's metadata document -> its client record. Raises OAuthError."""
    doc = _fetch_metadata(url)
    uris = doc.get("redirect_uris") if isinstance(doc, dict) else None
    if not isinstance(doc, dict) or doc.get("client_id") != url:
        raise OAuthError("invalid_client", "The app's details document names a different client.")
    if not isinstance(uris, list) or not uris or len(uris) > 20 or not all(redirect_ok(u) for u in uris):
        raise OAuthError("invalid_client", "The app's details document has no usable return address.")
    if (doc.get("token_endpoint_auth_method") or "none") != "none":
        raise OAuthError("invalid_client", "Only public apps (token_endpoint_auth_method none) are supported.")
    host = urlsplit(url).hostname
    return {"name": str(doc.get("client_name") or host).strip()[:80] or host, "redirect_uris": uris, "auth": "none",
            "created": int(time.time()), "cimd": True, "host": host}


def metadata_client(url: str, fetch: bool = True) -> dict | None:
    if not _cimd_url_ok(url):
        return None
    hit = _cimd.get(url)
    if hit and hit[0] > time.time():
        return hit[1]
    if not fetch:
        return None
    from concurrent.futures import TimeoutError as FutureTimeout
    try:
        rec = _cimd_future(url).result(timeout=CIMD_DEADLINE + 1)
    except (OAuthError, FutureTimeout):
        rec = None
    _remember(url, rec)
    return rec


def _client_auth(form: dict, basic: str) -> tuple[str, dict]:
    """Who is calling the token or revoke endpoint: (client id, record). Public clients send only client_id."""
    cid, secret = form.get("client_id", ""), form.get("client_secret", "")
    if basic.lower().startswith("basic "):
        try:
            from urllib.parse import unquote
            raw = base64.b64decode(basic[6:].strip()).decode()
            a, _, b = raw.partition(":")
            cid, secret = unquote(a), unquote(b)
        except Exception:
            raise OAuthError("invalid_client", "The client credentials could not be read.", 401)
    rec = client(cid, fetch=False)  # a metadata document was read before this, off the request threads (ensure_client)
    if rec is None:
        raise OAuthError("invalid_client", "This app is not registered here (any more). Connect it again.", 401)
    if rec.get("secret") and not _eq(_h(secret or ""), rec["secret"]):
        raise OAuthError("invalid_client", "The client secret is wrong.", 401)
    return cid, rec


# ----------------------------------------------------------------------------- authorize

def _canon(uri: str) -> str:
    u = urlsplit(uri or "")
    return f"{u.scheme.lower()}://{(u.netloc or '').lower()}{u.path.rstrip('/')}"


def check_authorize(params: dict, headers: dict) -> tuple[dict, dict]:
    """Validate an authorization request. Every problem raises OAuthError and is shown as a page, never sent to the
    return address: anyone can register a client with any https return address, so an error redirect would let a
    link on this site bounce a signed-in person to any site (real apps always send a valid request)."""
    rec = client(params.get("client_id", ""), fetch=False)
    if rec is None:
        raise OAuthError("invalid_client", "CAD Automation does not know this app, or could not read its details. Remove the connector in your AI app and add it again.")
    redirect = params.get("redirect_uri") or (rec["redirect_uris"][0] if len(rec["redirect_uris"]) == 1 else "")
    if redirect not in rec["redirect_uris"]:
        raise OAuthError("invalid_request", "The app sent a return address it did not register.")
    state = params.get("state", "")
    if params.get("response_type") != "code":
        raise OAuthError("unsupported_response_type", "The app asked for something other than a sign-in code (response_type=code).")
    if params.get("code_challenge_method") != "S256" or not (43 <= len(params.get("code_challenge", "")) <= 128):
        raise OAuthError("invalid_request", "The app did not protect the sign-in with PKCE (S256).")
    res = params.get("resource")
    known = _own_targets(own_bases(headers))  # this host, and the server's other public host names
    if res and _canon(res) not in known:
        raise OAuthError("invalid_target", "The app asked to sign in to a different server.")
    target = known.get(_canon(res or ""), resource_url(headers))
    scope = params.get("scope") or SCOPE
    if any(s not in (SCOPE, "openid", "profile", "email", "offline_access") for s in scope.split()):
        raise OAuthError("invalid_scope", f"The app asked for more than CAD Automation offers (scope {SCOPE}).")
    req = {"client_id": params["client_id"], "redirect_uri": redirect, "state": state,
           "code_challenge": params["code_challenge"], "resource": target, "scope": SCOPE}
    return rec, req


def with_query(uri: str, **q) -> str:
    q = {k: v for k, v in q.items() if v is not None}
    return uri + ("&" if urlsplit(uri).query else "?") + urlencode(q)


def _sig_key() -> bytes:
    from . import auth
    return auth.data_secret("mcp-oauth-consent")


def sign_request(req: dict, user_id: str) -> str:
    payload = dict(req, u=user_id, exp=int(time.time()) + CONSENT_TTL)
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    return raw + "." + hmac.new(_sig_key(), raw.encode(), hashlib.sha256).hexdigest()


def read_request(blob: str, user_id: str) -> dict | None:
    try:
        raw, mac = blob.rsplit(".", 1)
        if not _eq(mac, hmac.new(_sig_key(), raw.encode(), hashlib.sha256).hexdigest()):
            return None
        d = json.loads(base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)))
    except Exception:
        return None
    if d.get("exp", 0) < time.time() or not _eq(d.get("u", ""), user_id):
        return None
    return d


def issue_code(req: dict, user_id: str) -> str:
    code = "osk_" + secrets.token_urlsafe(32)
    now = time.time()
    with _lock:
        for k in [k for k, v in _codes.items() if v["exp"] < now]:
            _codes.pop(k, None)
        _codes[_h(code)] = dict(req, user=user_id, exp=now + CODE_TTL)
    return code


# ----------------------------------------------------------------------------- tokens

def _new_tokens(d: dict, grant_id: str) -> dict:
    access, refresh = "osa_" + secrets.token_urlsafe(32), "osr_" + secrets.token_urlsafe(32)
    now = int(time.time())
    g = d["grants"][grant_id]
    g["refresh_prev"], g["refresh_prev_until"] = g.get("refresh"), now + REFRESH_GRACE
    g["refresh"], g["refresh_exp"] = _h(refresh), now + REFRESH_TTL
    d["access"][_h(access)] = {"grant": grant_id, "exp": now + ACCESS_TTL}
    return {"access_token": access, "token_type": "Bearer", "expires_in": ACCESS_TTL, "refresh_token": refresh,
            "scope": SCOPE}


def _user_exists(user_id: str) -> bool:
    if user_id in ("server", "local"):
        return True
    from . import accounts
    return accounts.get(user_id) is not None


def token(form: dict, basic: str = "") -> dict:
    grant_type = form.get("grant_type", "")
    cid, rec = _client_auth(form, basic)
    with _lock:
        if grant_type == "authorization_code":
            c = _codes.pop(_h(form.get("code", "")), None)
            if c is None or c["exp"] < time.time() or c["client_id"] != cid:
                raise OAuthError("invalid_grant", "The sign-in code is wrong, used or expired. Connect again.")
            if form.get("redirect_uri") and form["redirect_uri"] != c["redirect_uri"]:
                raise OAuthError("invalid_grant", "The return address does not match the sign-in.")
            verifier = form.get("code_verifier", "")
            calc = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip("=")
            if not verifier or not _eq(calc, c["code_challenge"]):
                raise OAuthError("invalid_grant", "The PKCE code_verifier does not match.")
            if form.get("resource") and _canon(form["resource"]) not in (
                    _canon(c["resource"]), _canon(c["resource"].rsplit("/mcp", 1)[0]), _canon(_origin(c["resource"]))) \
                    and _canon(form["resource"]) not in _own_targets(_settings_bases()):
                raise OAuthError("invalid_target", "This server only issues tokens for its own MCP endpoint.")
            if not _user_exists(c["user"]):
                raise OAuthError("invalid_grant", "That CAD Automation account no longer exists.")
            d = _load()
            gid = "osg_" + secrets.token_urlsafe(12)
            now = int(time.time())
            r = urlsplit(c["redirect_uri"])
            host = r.hostname or r.scheme
            # one connection per person and app: the same client, or the same app registered again (Claude
            # registers on every connect) returning to the same public https host
            same = [k for k, g in d["grants"].items() if g["user"] == c["user"] and (
                g["client_id"] == cid or (r.scheme == "https" and host not in ("localhost", "127.0.0.1", "::1")
                                          and g.get("name") == rec["name"] and g.get("host") == host))]
            for k in same:
                d["grants"].pop(k, None)
            d["grants"][gid] = {"user": c["user"], "client_id": cid, "name": rec["name"], "host": host,
                                "resource": c["resource"], "created": now, "last_used": now}
            out = _new_tokens(d, gid)
            _save(d)
            return out
        if grant_type == "refresh_token":
            # A refresh keeps its grant, and a `resource` sent with it is not checked: the tokens work on every address
            # of this server, so an app that moved from cados.kevos.com to cad.bizomat.ai (or back) refreshes as before.
            h, now = _h(form.get("refresh_token", "")), time.time()
            d = _load()
            gid = next((k for k, g in d["grants"].items() if g.get("refresh") and _eq(g["refresh"], h)), None)
            if gid is None:  # the token just replaced: a retry of the same refresh (network hiccup) still works
                gid = next((k for k, g in d["grants"].items()
                            if g.get("refresh_prev") and _eq(g["refresh_prev"], h) and g.get("refresh_prev_until", 0) > now), None)
            g = d["grants"].get(gid) if gid else None
            if g is None or g["client_id"] != cid or g.get("refresh_exp", 0) < now:
                raise OAuthError("invalid_grant", "This connection was ended or has expired. Connect again.")
            if not _user_exists(g["user"]):
                d["grants"].pop(gid, None)
                _save(d)
                raise OAuthError("invalid_grant", "That CAD Automation account no longer exists.")
            out = _new_tokens(d, gid)
            g["last_used"] = int(now)
            _save(d)
            return out
    raise OAuthError("unsupported_grant_type", "Use authorization_code or refresh_token.")


def revoke(form: dict, basic: str = "") -> None:
    """RFC 7009: ends the whole connection the token belongs to. Unknown tokens are not an error."""
    cid, _ = _client_auth(form, basic)
    h = _h(form.get("token", ""))
    with _lock:
        d = _load()
        gid = (d["access"].get(h) or {}).get("grant") or next(
            (k for k, g in d["grants"].items() if g.get("refresh") == h or g.get("refresh_prev") == h), None)
        if gid and d["grants"].get(gid, {}).get("client_id") == cid:
            d["grants"].pop(gid, None)
            _save(d)


def _origin(uri: str) -> str:
    u = urlsplit(uri or "")
    return f"{u.scheme}://{u.netloc}"


def _settings_bases() -> list[str]:
    """The server's public addresses from its settings (no request at hand): the alias hosts and OPENSKETCH_PUBLIC_URL."""
    from . import auth
    return auth.known_bases()


def user_for_access(tok: str) -> tuple[bool, dict | None]:
    """(valid, person) for a Bearer token on the MCP endpoint. Person None = a server without accounts."""
    if not tok or not tok.startswith("osa_") or len(tok) > 100:
        return False, None
    d = _view()
    a = d["access"].get(_h(tok))
    now = time.time()
    if not a or a["exp"] < now:
        return False, None
    g = d["grants"].get(a["grant"])
    if not g:
        return False, None
    from . import accounts
    if g["user"] in ("server", "local"):
        user = accounts.owner()
        if user is None and accounts.any_users():
            return False, None
    else:
        user = accounts.get(g["user"])
        if user is None:
            return False, None
    gid = a["grant"]
    if now - _touched.get(gid, 0) > TOUCH_EVERY:
        _touched[gid] = now
        with _lock:
            d = _load()
            if gid in d["grants"]:
                d["grants"][gid]["last_used"] = int(now)
                _save(d)
    return True, user


def grant_info(tok: str) -> dict | None:
    """{id, name} of the AI app connection a valid access token belongs to (for audit and the confirmation shown at
    the SOLIDWORKS computer). Never the token itself."""
    if not tok or not tok.startswith("osa_") or len(tok) > 100:
        return None
    d = _view()
    a = d["access"].get(_h(tok))
    g = d["grants"].get(a["grant"]) if a else None
    return {"id": a["grant"], "name": g.get("name") or "AI app"} if g else None


# ----------------------------------------------------------------------------- the person's own list

def grants_for(user_id: str) -> list[dict]:
    d = _view()
    out = [{"id": k, "name": g["name"], "host": g.get("host", ""), "created": g["created"], "last_used": g.get("last_used")}
           for k, g in d["grants"].items() if g["user"] == user_id]
    return sorted(out, key=lambda g: -(g["last_used"] or 0))


def drop_grant(user_id: str, grant_id: str) -> bool:
    with _lock:
        d = _load()
        g = d["grants"].get(grant_id)
        if not g or g["user"] != user_id:
            return False
        d["grants"].pop(grant_id)
        _save(d)
        return True


def drop_user(user_id: str) -> None:
    with _lock:
        d = _load()
        d["grants"] = {k: g for k, g in d["grants"].items() if g["user"] != user_id}
        _save(d)
