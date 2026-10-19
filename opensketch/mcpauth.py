"""Sign-in for AI apps that connect to OpenSketch: OAuth 2.1 for the MCP endpoint (MCP authorization spec).

An AI app (Claude, ChatGPT, Codex, Cursor, VS Code...) is given only the plain address <site>/mcp. Its first request
gets 401 with a pointer to the protected-resource metadata; it reads the authorization-server metadata, registers
itself (Dynamic Client Registration, RFC 7591), and sends the person's browser to /oauth/authorize. There they sign
in to OpenSketch as usual (password or Google) and click Allow on a consent page. The app swaps the one-time code
(PKCE S256 required) for an access token (1 hour) and a refresh token (90 days, rotated on every use), and sends
`Authorization: Bearer <access token>` with every MCP request. The token stands for that person: the MCP tools see
only their files. People see and disconnect their apps in Account settings.

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
MAX_CLIENTS = 2000
UNUSED_CLIENT_DAYS = 30      # registrations never used for a grant are removed after this
REGISTER_LIMIT = 30          # registrations per address per hour
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


def _load() -> dict:
    try:
        d = json.loads(_file().read_text())
    except (FileNotFoundError, ValueError):
        d = {}
    for k in ("clients", "grants", "access"):
        d.setdefault(k, {})
    return d


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


def _h(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def _eq(a: str, b: str) -> bool:
    return hmac.compare_digest(str(a or "").encode(), str(b or "").encode())


# ----------------------------------------------------------------------------- metadata

def base_url(headers: dict) -> str:
    from . import auth
    return auth.public_url(headers).rstrip("/")


def resource_url(headers: dict) -> str:
    return base_url(headers) + "/mcp"


def resource_metadata_url(headers: dict) -> str:
    return base_url(headers) + "/.well-known/oauth-protected-resource/mcp"


def protected_resource(headers: dict) -> dict:
    return {"resource": resource_url(headers), "authorization_servers": [base_url(headers)],
            "scopes_supported": [SCOPE], "bearer_methods_supported": ["header"], "resource_name": "OpenSketch",
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


def challenge(headers: dict, error: str = "") -> str:
    """The WWW-Authenticate value for a 401 from the MCP endpoint."""
    extra = f', error="{error}"' if error else ""
    return f'Bearer resource_metadata="{resource_metadata_url(headers)}", scope="{SCOPE}"{extra}'


# ----------------------------------------------------------------------------- clients (RFC 7591)

_BAD_SCHEMES = {"javascript", "data", "file", "vbscript", "about", "blob", "ftp", "ws", "wss", "chrome", "view-source"}


def redirect_ok(uri: str) -> bool:
    """https anywhere; http only to this computer (localhost, 127.0.0.1, [::1]); or an app's own scheme
    (cursor://..., vscode://...). Never a fragment, never credentials in the address."""
    if not isinstance(uri, str) or not uri or len(uri) > 2000 or any(ord(c) < 0x21 for c in uri):
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


def _rate_ok(ip: str) -> bool:
    now = time.time()
    hits = [t for t in _reg_hits.get(ip, []) if now - t < 3600]
    _reg_hits[ip] = hits
    if len(hits) >= REGISTER_LIMIT:
        return False
    hits.append(now)
    return True


def register(meta: dict, ip: str = "") -> dict:
    if not isinstance(meta, dict):
        raise OAuthError("invalid_client_metadata", "Send the client metadata as a JSON object.")
    uris = meta.get("redirect_uris")
    if not isinstance(uris, list) or not uris or len(uris) > 10 or not all(redirect_ok(u) for u in uris):
        raise OAuthError("invalid_redirect_uri", "redirect_uris must be https addresses, http://localhost or an app's own scheme.")
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
        if len(d["clients"]) >= MAX_CLIENTS:
            raise OAuthError("temporarily_unavailable", "This server has too many registered apps.", 503)
        d["clients"][client_id] = rec
        _save(d)
    return out


def client(client_id: str) -> dict | None:
    """A registered client (osc_...), or a Client ID Metadata Document: an https URL whose JSON describes the app
    (ChatGPT uses https://chatgpt.com/oauth/client.json). None when unknown or unreadable."""
    if not isinstance(client_id, str):
        return None
    if client_id.startswith("https://"):
        return metadata_client(client_id)
    if not client_id.startswith("osc_"):
        return None
    return _load()["clients"].get(client_id)


# ----------------------------------------------------------------------------- client ID metadata documents

CIMD_TTL = 3600
CIMD_FAIL_TTL = 60
CIMD_MAX_BYTES = 64 * 1024
_cimd: dict[str, tuple[float, dict | None]] = {}


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
    from . import providers
    try:
        target, host, ext = providers.pinned(url)
        with httpx.Client(timeout=5, follow_redirects=False) as http:
            with http.stream("GET", target, headers={**host, "Accept": "application/json"}, extensions=ext) as r:
                if r.status_code != 200:
                    raise OAuthError("invalid_client", f"The app's details at {urlsplit(url).hostname} could not be read ({r.status_code}).")
                body = b""
                for chunk in r.iter_bytes():
                    body += chunk
                    if len(body) > CIMD_MAX_BYTES:
                        raise OAuthError("invalid_client", "The app's details document is too large.")
    except providers.ProviderError as e:
        raise OAuthError("invalid_client", f"The app's details address is not usable: {e}") from None
    except httpx.HTTPError:
        raise OAuthError("invalid_client", f"Could not reach {urlsplit(url).hostname} to read the app's details.") from None
    try:
        return json.loads(body)
    except ValueError:
        raise OAuthError("invalid_client", "The app's details document is not JSON.") from None


def metadata_client(url: str) -> dict | None:
    if not _cimd_url_ok(url):
        return None
    now = time.time()
    hit = _cimd.get(url)
    if hit and hit[0] > now:
        return hit[1]
    try:
        doc = _fetch_metadata(url)
        uris = doc.get("redirect_uris") if isinstance(doc, dict) else None
        if not isinstance(doc, dict) or doc.get("client_id") != url:
            raise OAuthError("invalid_client", "The app's details document names a different client.")
        if not isinstance(uris, list) or not uris or len(uris) > 20 or not all(redirect_ok(u) for u in uris):
            raise OAuthError("invalid_client", "The app's details document has no usable return address.")
        if (doc.get("token_endpoint_auth_method") or "none") != "none":
            raise OAuthError("invalid_client", "Only public apps (token_endpoint_auth_method none) are supported.")
        host = urlsplit(url).hostname
        rec = {"name": str(doc.get("client_name") or host).strip()[:80] or host, "redirect_uris": uris, "auth": "none",
               "created": int(now), "cimd": True, "host": host}
        if len(_cimd) > 500:
            _cimd.clear()
        _cimd[url] = (now + CIMD_TTL, rec)
        return rec
    except OAuthError:
        _cimd[url] = (now + CIMD_FAIL_TTL, None)
        return None


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
    rec = client(cid)
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
    """Validate an authorization request. Problems with the client or redirect address raise OAuthError (shown as
    a page, never redirected); the rest raise RedirectError so the app hears about them."""
    rec = client(params.get("client_id", ""))
    if rec is None:
        raise OAuthError("invalid_client", "OpenSketch does not know this app, or could not read its details. Remove the connector in the app and add it again.")
    redirect = params.get("redirect_uri") or (rec["redirect_uris"][0] if len(rec["redirect_uris"]) == 1 else "")
    if redirect not in rec["redirect_uris"]:
        raise OAuthError("invalid_request", "The app sent a return address it did not register.")
    state = params.get("state", "")
    if params.get("response_type") != "code":
        raise RedirectError(redirect, state, "unsupported_response_type", "Only response_type=code is supported.", headers)
    if params.get("code_challenge_method") != "S256" or not (43 <= len(params.get("code_challenge", "")) <= 128):
        raise RedirectError(redirect, state, "invalid_request", "PKCE with S256 is required.", headers)
    res = params.get("resource")
    if res and _canon(res) not in (_canon(resource_url(headers)), _canon(base_url(headers))):
        raise RedirectError(redirect, state, "invalid_target", "This server only issues tokens for its own MCP endpoint.", headers)
    scope = params.get("scope") or SCOPE
    if any(s not in (SCOPE, "openid", "profile", "email", "offline_access") for s in scope.split()):
        raise RedirectError(redirect, state, "invalid_scope", f"The only scope is {SCOPE}.", headers)
    req = {"client_id": params["client_id"], "redirect_uri": redirect, "state": state,
           "code_challenge": params["code_challenge"], "resource": resource_url(headers), "scope": SCOPE}
    return rec, req


class RedirectError(OAuthError):
    def __init__(self, redirect: str, state: str, error: str, description: str, headers: dict):
        super().__init__(error, description)
        self.location = with_query(redirect, error=error, error_description=description, state=state or None,
                                   iss=base_url(headers))


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
            if form.get("resource") and _canon(form["resource"]) not in (_canon(c["resource"]), _canon(c["resource"].rsplit("/mcp", 1)[0])):
                raise OAuthError("invalid_target", "This server only issues tokens for its own MCP endpoint.")
            if not _user_exists(c["user"]):
                raise OAuthError("invalid_grant", "That OpenSketch account no longer exists.")
            d = _load()
            gid = "osg_" + secrets.token_urlsafe(12)
            now = int(time.time())
            host = urlsplit(c["redirect_uri"]).hostname or urlsplit(c["redirect_uri"]).scheme
            d["grants"][gid] = {"user": c["user"], "client_id": cid, "name": rec["name"], "host": host,
                                "resource": c["resource"], "created": now, "last_used": now}
            out = _new_tokens(d, gid)
            _save(d)
            return out
        if grant_type == "refresh_token":
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
                raise OAuthError("invalid_grant", "That OpenSketch account no longer exists.")
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


def user_for_access(tok: str) -> tuple[bool, dict | None]:
    """(valid, person) for a Bearer token on the MCP endpoint. Person None = a server without accounts."""
    if not tok or not tok.startswith("osa_"):
        return False, None
    d = _load()
    a = d["access"].get(_h(tok))
    now = time.time()
    if not a or a["exp"] < now:
        return False, None
    g = d["grants"].get(a["grant"])
    if not g:
        return False, None
    from . import accounts
    users = accounts.list_users()
    if g["user"] in ("server", "local"):
        user = next((u for u in users if u["role"] == "owner"), None)
        if users and user is None:
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


# ----------------------------------------------------------------------------- the person's own list

def grants_for(user_id: str) -> list[dict]:
    d = _load()
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
