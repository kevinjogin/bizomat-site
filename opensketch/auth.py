"""Sign-in for the whole app, and the secret address of the MCP endpoint.

Three modes:
- accounts: at least one account exists (accounts.py). Every page and API call needs a signed-in person
  (email + password, server-side sessions). The owner invites other people with links.
- password: OPENSKETCH_PASSWORD is set but nobody has an account yet. The sign-in page asks to create the
  owner account, with the server password as the key. The old password-only sign-in still works until then.
- open: no password and no accounts (a private codespace). Anyone who reaches the app can use it; the
  account menu offers to create the owner account, which turns sign-in on.

The MCP endpoint is /mcp/<token>. Claude's connector cannot sign in, so the address itself is the key:
the token is derived from the password (or from a random secret kept in the data folder when there is no
password), or set directly with OPENSKETCH_MCP_TOKEN. Accounts do not change it.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import asyncio
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, quote, urlencode

COOKIE = "opensketch_session"
ACCOUNT_COOKIE = "opensketch_user"
PUBLIC_FILES = ("/manifest.webmanifest", "/sw.js", "/favicon.svg", "/favicon.ico")


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


def data_secret(label: str) -> bytes:
    """A key from a random secret kept in the data folder, never from the server password (a short password
    must not be guessable offline from a signed link or cookie)."""
    from . import store
    p = store.data_dir() / "secret.keys"
    if not p.exists():
        tmp = p.with_name(p.name + f".{secrets.token_hex(4)}.tmp")
        tmp.write_text(secrets.token_hex(32))
        tmp.chmod(0o600)
        try:
            os.link(tmp, p)  # first writer wins
        except FileExistsError:
            pass
        finally:
            tmp.unlink()
    return hmac.new(p.read_text().strip().encode(), label.encode(), hashlib.sha256).digest()


def _eq(a, b) -> bool:
    """Constant-time comparison that never raises (non-ASCII text in a URL is just a mismatch)."""
    return hmac.compare_digest(str(a or "").encode("utf-8", "replace"), str(b or "").encode("utf-8", "replace"))


def mcp_token() -> str:
    return os.environ.get("OPENSKETCH_MCP_TOKEN") or _mac("mcp", 32)


def session_value() -> str:
    return _mac("session", 40)


def check_token(token: str) -> bool:
    return resolve_mcp(token)[0]


def mcp_token_for(user: dict | None) -> str:
    """The connector address key for one person. The server owner (and a server without accounts) keeps the
    server-wide address, so a connector added before accounts keeps working; every other account gets its own,
    which only reaches that person's Files."""
    if user is None or user.get("legacy") or user.get("role") == "owner":
        return mcp_token()
    return _mac("mcp:" + user["id"], 32)


def resolve_mcp(token: str) -> tuple[bool, dict | None]:
    """(valid, person) for an MCP address key. The server-wide key acts as the server owner once accounts
    exist; None as the person means no accounts (everything is shared)."""
    if not token:
        return False, None
    from . import accounts
    users = accounts.list_users()
    if _eq(token, mcp_token()):
        return True, next((u for u in users if u["role"] == "owner"), None)
    for u in users:
        if u["role"] != "owner" and _eq(token, _mac("mcp:" + u["id"], 32)):
            return True, u
    return False, None


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




def mode() -> str:
    from . import accounts
    if accounts.any_users():
        return "accounts"
    return "password" if password() else "open"


def _cookie(scope, name: str) -> str:
    c = SimpleCookie()
    try:
        c.load(_headers(scope).get("cookie", ""))
    except Exception:
        return ""
    v = c.get(name)
    return v.value if v else ""


def current_user(scope) -> dict | None:
    """The signed-in person, or None. In password mode the old password cookie stands for the server."""
    from . import accounts
    m = mode()
    if m == "accounts":
        return accounts.session_user(_cookie(scope, ACCOUNT_COOKIE))
    if m == "password":
        v = _cookie(scope, COOKIE)
        if v and _eq(v, session_value()):
            return {"id": "server", "email": "", "name": "Server password", "role": "owner", "legacy": True}
    return None


def logged_in(scope) -> bool:
    return mode() == "open" or current_user(scope) is not None


# ---------------------------------------------------------------- pages

# Sign-in pages: Stripe-like (bold display type, an angled indigo band, a raised card), in OpenSketch's colours.
PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>{title} - OpenSketch</title><meta name="theme-color" content="#0c0d0e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Inter+Tight:wght@600..800&display=swap" rel="stylesheet">
<style>
:root{{--bg:#0c0d0e;--card:#141517;--field:#1b1c1f;--line:rgba(255,255,255,.08);--line2:rgba(255,255,255,.14);--text:#e3e4e8;--text2:#a3a6ad;--muted:#7a7f88;--accent:#5e6ad2;--accent-h:#6b77de;--link:#8b93ff;--err:#eb5757;
--display:"Inter Tight",Inter,system-ui,-apple-system,"Segoe UI",sans-serif;--ease:cubic-bezier(.16,1,.3,1)}}
*{{box-sizing:border-box}}
html,body{{height:100%}}
body{{margin:0;min-height:100vh;background:var(--bg);font:14px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);-webkit-font-smoothing:antialiased;color-scheme:dark;overflow-x:hidden}}
.band{{position:fixed;left:-10vw;right:-10vw;top:-38vh;height:78vh;transform:skewY(-9deg);transform-origin:0 0;overflow:hidden;z-index:0;
background:linear-gradient(100deg,#2a2f7a 0%,#4a51c2 28%,#6670e0 48%,#8b6ad8 66%,#c0569c 86%,#e0559b 100%);opacity:.92}}
.band:before,.band:after{{content:"";position:absolute;inset:-20%;background:radial-gradient(30% 50% at 20% 60%,rgba(163,170,255,.75),transparent 70%),radial-gradient(28% 45% at 70% 40%,rgba(74,81,194,.8),transparent 70%);
filter:blur(30px);animation:drift 16s ease-in-out infinite alternate;mix-blend-mode:screen}}
.band:after{{background:radial-gradient(25% 40% at 80% 70%,rgba(224,85,155,.6),transparent 70%),radial-gradient(30% 40% at 40% 30%,rgba(102,112,224,.7),transparent 70%);animation-duration:22s;animation-direction:alternate-reverse}}
.band i{{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(to bottom,transparent,var(--bg))}}
@keyframes drift{{to{{transform:translate3d(8%,-6%,0) rotate(8deg)}}}}
.wrap{{position:relative;z-index:1;min-height:100vh;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,440px);gap:56px;align-items:center;max-width:1080px;margin:0 auto;padding:40px 32px 48px}}
.brand{{position:absolute;top:26px;left:32px;color:#fff;text-decoration:none;font-family:var(--display);font-weight:800;font-size:21px;letter-spacing:-.04em;line-height:1}}
.pitch h2{{margin:0 0 16px;font-family:var(--display);font-weight:750;font-size:52px;line-height:1.02;letter-spacing:-.045em;color:#fff;text-wrap:balance}}
.pitch p{{margin:0 0 26px;color:rgba(255,255,255,.78);font-size:17px;line-height:1.55;max-width:470px;letter-spacing:-.01em}}
.pitch ul{{list-style:none;margin:0;padding:0;display:grid;gap:12px;color:var(--text2)}}
.pitch li{{display:flex;gap:10px;align-items:flex-start}}
.pitch li b{{color:var(--text);font-weight:600}}
.pitch li:before{{content:"";flex:none;width:18px;height:18px;margin-top:2px;border-radius:50%;background:rgba(94,106,210,.22) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4 8.5l2.5 2.5L12 5.5' fill='none' stroke='%238b93ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat}}
.card{{background:var(--card);border-radius:16px;padding:32px;box-shadow:0 0 0 1px rgba(255,255,255,.07),0 30px 60px -12px rgba(0,0,0,.6),0 18px 36px -18px rgba(0,0,0,.5);animation:rise .5s var(--ease)}}
@keyframes rise{{from{{opacity:0;transform:translateY(10px)}}}}
h1{{font-family:var(--display);font-size:26px;font-weight:750;margin:0 0 6px;letter-spacing:-.035em;line-height:1.15}} p.sub{{color:var(--text2);margin:0 0 22px}}
label{{display:block;font-size:12.5px;font-weight:550;color:var(--text2);margin:14px 0 6px}}
input{{width:100%;height:40px;padding:0 12px;border:1px solid var(--line2);border-radius:8px;font:inherit;color:inherit;background:var(--field);outline:none;transition:border-color .12s,box-shadow .12s}}
input:hover{{border-color:rgba(255,255,255,.2)}} input:focus{{border-color:var(--accent);box-shadow:0 0 0 3px rgba(94,106,210,.25)}}
button{{margin-top:22px;width:100%;height:42px;border:0;border-radius:21px;background:var(--accent);color:#fff;font:inherit;font-weight:650;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
box-shadow:0 1px 0 rgba(255,255,255,.15) inset,0 6px 16px -6px rgba(94,106,210,.8);transition:background .12s,transform .12s}}
button:hover{{background:var(--accent-h)}} button:active{{transform:scale(.985)}}
button:after{{content:"";width:14px;height:14px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 12h13M13 7l5 5-5 5' fill='none' stroke='%23fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat;transition:transform .2s var(--ease)}}
button:hover:after{{transform:translateX(3px)}}
.err{{color:#ffb4b4;background:rgba(235,87,87,.14);border:1px solid rgba(235,87,87,.3);border-radius:8px;padding:9px 12px;margin-top:16px;font-size:13px}}
.note{{color:var(--muted);font-size:12.5px;margin-top:6px}}
.gbtn{{display:flex;align-items:center;justify-content:center;gap:10px;height:42px;border-radius:21px;background:#fff;color:#1f1f1f;font-weight:600;text-decoration:none;border:1px solid #dadce0;transition:background .12s}}
.gbtn:hover{{background:#f2f2f2;text-decoration:none}}
.or{{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:12px;margin:18px 0 0}} .or:before,.or:after{{content:"";flex:1;border-top:1px solid var(--line)}}
.links{{margin-top:18px;display:flex;justify-content:space-between;gap:12px;font-size:13px}} a{{color:var(--link);text-decoration:none}} a:hover{{text-decoration:underline}}
.foot{{position:absolute;bottom:20px;left:32px;right:32px;display:flex;justify-content:space-between;color:var(--muted);font-size:12px}}
@media (max-width:900px){{.wrap{{grid-template-columns:1fr;gap:28px;padding:96px 20px 64px;max-width:480px}}.pitch h2{{font-size:36px}}.pitch p{{font-size:15px;margin-bottom:0}}.pitch ul{{display:none}}.brand{{left:20px;top:22px}}.card{{padding:26px 22px}}.foot{{left:20px;right:20px}}.band{{height:62vh}}}}
@media (prefers-reduced-motion:reduce){{*,*:before,*:after{{animation:none!important;transition:none!important}}}}
</style></head><body><div class="band"><i></i></div>
<div class="wrap"><a class="brand" href="/">OpenSketch</a>
<section class="pitch"><h2>CAD that builds while you watch.</h2><p>Sketch, extrude and mate parts the way you already know, or let ChatGPT, Claude or Codex model them in your Files, live.</p>
<ul><li><span><b>Real feature trees.</b> Sketches, dimensions and mates you can edit.</span></li><li><span><b>Your AI, connected.</b> Works with the AI app you already pay for.</span></li><li><span><b>Nothing to install.</b> Runs in the browser, or install it as an app.</span></li></ul></section>
<form class="card" method="post" action="{action}" autocomplete="on"><h1>{title}</h1><p class="sub">{sub}</p>{top}
<input type="hidden" name="next" value="{next}">{fields}{error}<button type="submit">{button}</button>{links}</form></div>
<div class="foot"><span>OpenSketch</span><span>Parametric CAD with AI</span></div></body></html>"""


def _field(name: str, label: str, kind: str = "text", auto: str = "", focus: bool = False, value: str = "", note: str = "") -> str:
    return (f'<label for="{name}">{label}</label><input id="{name}" name="{name}" type="{kind}" autocomplete="{auto}"'
            f' value="{_esc(value)}"{" autofocus" if focus else ""} required>' + (f'<div class="note">{note}</div>' if note else ""))


GOOGLE_G = ('<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z"/>'
            '<path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>'
            '<path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z"/>'
            '<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-10l-7.8 6C6.6 42.6 14.6 48 24 48z"/></svg>')


def _google_block(nxt: str = "/", invite: str = "", label: str = "Continue with Google") -> str:
    from . import oauth
    if not oauth.enabled():
        return ""
    q = urlencode({k: v for k, v in (("next", nxt), ("invite", invite)) if v and v != "/"})
    return (f'<a class="gbtn" href="/auth/google{"?" + q if q else ""}">{GOOGLE_G}<span>{label}</span></a>'
            '<div class="or">or with email</div>')


def _page(title, sub, action, fields, button, nxt="/", error="", links="", top="") -> bytes:
    return PAGE.format(title=title, sub=sub, action=action, fields="".join(fields), button=button, next=_esc(nxt), top=top,
                       error=f'<div class="err" role="alert">{_esc(error)}</div>' if error else "", links=links).encode()


def _login_page(nxt, error="", email=""):
    from . import accounts
    forgot = ('<a href="/reset">Forgot your password?</a>' if password() else
              '<span class="note">Forgot your password? Ask the server owner for help.</span>')
    signup = '<a href="/signup">Create an account</a>' if accounts.settings()["open_signup"] else ""
    links = f'<div class="links">{forgot}{signup}</div>'
    return _page("Sign in", "Sign in to your OpenSketch account.", "/login",
                 [_field("email", "Email", "email", "username", not email, email),
                  _field("password", "Password", "password", "current-password", bool(email))], "Sign in", nxt, error, links,
                 _google_block(nxt))


def _signup_page(nxt="/", error="", form=None):
    form = form or {}
    return _page("Create an account", "Join this OpenSketch server.", "/signup",
                 [_field("name", "Your name", "text", "name", True, form.get("name", "")),
                  _field("email", "Email", "email", "username", False, form.get("email", "")),
                  _field("new_password", "Password", "password", "new-password", note="At least 8 characters.")],
                 "Create account", nxt, error, '<div class="links"><a href="/login">I already have an account</a></div>',
                 _google_block(nxt, label="Sign up with Google"))


def _setup_page(nxt, error="", form=None):
    form = form or {}
    f = [_field("name", "Your name", "text", "name", True, form.get("name", "")),
         _field("email", "Email", "email", "username", False, form.get("email", "")),
         _field("new_password", "Password", "password", "new-password", note="At least 8 characters.")]
    if password():
        f.append(_field("server_password", "Server password", "password", "off",
                        note="The OPENSKETCH_PASSWORD this server was started with. It proves you own it."))
    return _page("Create the owner account", "OpenSketch now uses accounts. The first account owns this server "
                 "and can invite other people.", "/setup", f, "Create account", nxt, error)


def _join_page(token, error="", form=None):
    form = form or {}
    return _page("Join OpenSketch", "You were invited to this OpenSketch server. Create your account.",
                 f"/join/{quote(token)}", [_field("name", "Your name", "text", "name", True, form.get("name", "")),
                                           _field("email", "Email", "email", "username", False, form.get("email", "")),
                                           _field("new_password", "Password", "password", "new-password", note="At least 8 characters.")],
                 "Create account", "/", error, '<div class="links"><a href="/login">I already have an account</a></div>',
                 _google_block("/", token, "Join with Google"))


def _reset_page(error="", email=""):
    return _page("Reset your password", "Use the server password (OPENSKETCH_PASSWORD) to set a new password.", "/reset",
                 [_field("email", "Email", "email", "username", True, email),
                  _field("server_password", "Server password", "password", "off"),
                  _field("new_password", "New password", "password", "new-password", note="At least 8 characters.")],
                 "Set new password", "/", error, '<div class="links"><a href="/login">Back to sign in</a></div>')


async def _send(send, status: int, body: bytes, headers: list) -> None:
    await send({"type": "http.response.start", "status": status, "headers": headers})
    await send({"type": "http.response.body", "body": body})


TOO_MANY = "Too many tries. Wait a minute, then try again."
HTML = [(b"content-type", b"text/html; charset=utf-8"), (b"cache-control", b"no-store"),
        (b"x-frame-options", b"DENY"), (b"referrer-policy", b"same-origin")]


def _safe_next(n: str) -> str:
    """Only a path on this site. Browsers drop tabs and newlines from URLs, so "/\t/evil.com" would become
    "//evil.com": any control character, backslash or second slash refuses it."""
    from urllib.parse import urlsplit
    n = n or "/"
    if any(ord(c) < 0x20 or ord(c) == 0x7F for c in n) or "\\" in n or not n.startswith("/") or n.startswith("//"):
        return "/"
    parts = urlsplit(n)
    return "/" if parts.scheme or parts.netloc else n


def _secure(scope) -> str:
    return "; Secure" if _headers(scope).get("x-forwarded-proto") == "https" or scope.get("scheme") == "https" else ""


def _set_account_cookie(scope, token: str) -> bytes:
    return (f"{ACCOUNT_COOKIE}={token}; Path=/; Max-Age={90 * 86400}; HttpOnly; SameSite=Lax{_secure(scope)}").encode()


def _clear(name: str) -> bytes:
    return f"{name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax".encode()


async def _form(receive) -> dict:
    body = b""
    while True:
        m = await receive()
        body += m.get("body", b"")
        if not m.get("more_body") or len(body) > 20000:
            break
    return {k: v[0] for k, v in parse_qs(body.decode(errors="ignore")).items()}


# Sign-in guesses: at most LIMIT failures a minute per address and per email, then a short wait.
LIMIT = 8
_fails: dict[str, list[float]] = {}


def _client(scope) -> str:
    h = _headers(scope)
    ip = h.get("fly-client-ip") or (h.get("x-forwarded-for") or "").split(",")[0].strip()
    return ip or (scope.get("client") or ("?",))[0]


def _limited(*keys: str) -> bool:
    import time
    now = time.time()
    for k in keys:
        recent = [t for t in _fails.get(k, []) if now - t < 60]
        _fails[k] = recent
        if len(recent) >= LIMIT:
            return True
    return False


def _failed(*keys: str) -> None:
    import time
    if len(_fails) > 5000:
        _fails.clear()
    for k in keys:
        _fails.setdefault(k, []).append(time.time())


def _same_origin(scope) -> bool:
    """A browser request that changes something must come from this site's own pages (Origin /
    Sec-Fetch-Site). Requests without those headers (scripts, tests, MCP clients) are not browsers."""
    h = _headers(scope)
    site = h.get("sec-fetch-site")
    if site and site not in ("same-origin", "none"):
        return False
    origin = h.get("origin")
    if origin and origin != "null":
        from urllib.parse import urlsplit
        host = h.get("x-forwarded-host") or h.get("host") or ""
        return urlsplit(origin).netloc.lower() == host.lower()
    return origin != "null"


def _server_password_ok(given: str) -> bool:
    return bool(password()) and hmac.compare_digest((given or "").encode(), password().encode())


class PasswordGate:
    """ASGI middleware: sign-in pages, the session check, sign-out. MCP paths and published reviews are
    checked by their own tokens instead. Puts the signed-in person in scope["state"]["user"]."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        path = scope.get("path", "")
        if scope.get("method") not in ("GET", "HEAD", "OPTIONS") and not path.startswith("/mcp/") and not _same_origin(scope):
            return await _send(send, 403, b'{"error":"This request did not come from OpenSketch."}', [(b"content-type", b"application/json")])
        from . import accounts
        try:
            mode()
        except accounts.AccountError as e:  # damaged or missing accounts file: closed, never open
            return await _send(send, 503, json.dumps({"error": str(e)}).encode(), [(b"content-type", b"application/json")])
        if path in ("/login", "/setup", "/reset", "/logout", "/signup") or path.startswith("/join/") or path.startswith("/auth/google"):
            return await self._page(path, scope, receive, send)
        # /mcp/ and /review/: their tokens are the keys. GET /api/features: the command list (no document
        # data), which the read-only review app loads too.
        if path.startswith("/mcp/") or path.startswith("/review/") or (path == "/api/features" and scope.get("method") == "GET"):
            return await self.app(scope, receive, send)
        # The installable-app files hold no data: browsers fetch the manifest without cookies.
        if scope.get("method") in ("GET", "HEAD") and (path in PUBLIC_FILES or path.startswith("/icons/")):
            return await self.app(scope, receive, send)
        m = mode()
        user = current_user(scope)
        scope.setdefault("state", {})["user"] = user
        if m == "open" or user is not None:
            return await self.app(scope, receive, send)
        if scope.get("method") == "GET" and not path.startswith("/api/"):
            nxt = path + ("?" + scope["query_string"].decode() if scope.get("query_string") else "")
            return await _send(send, 303, b"", [(b"location", f"/login?next={quote(nxt)}".encode())])
        return await _send(send, 401, b'{"error":"Sign in to OpenSketch first."}', [(b"content-type", b"application/json")])

    async def _google(self, path, scope, q, go, send):
        return await _google_flow(path, scope, q, go, send)

    async def _page(self, path, scope, receive, send):
        from . import accounts
        q = {k: v[0] for k, v in parse_qs(scope.get("query_string", b"").decode()).items()}
        post = scope.get("method") == "POST"
        form = await _form(receive) if post else {}
        nxt = _safe_next(form.get("next") or q.get("next") or "/")
        m = mode()

        def go(location: str, *cookies: bytes):
            return _send(send, 303, b"", [(b"location", location.encode())] + [(b"set-cookie", c) for c in cookies])

        if path == "/logout":
            tok = _cookie(scope, ACCOUNT_COOKIE)
            if tok:
                await asyncio.to_thread(accounts.end_session, tok)
            return await go("/login" if m != "open" else "/", _clear(ACCOUNT_COOKIE), _clear(COOKIE))

        if path == "/auth/google" or path == "/auth/google/callback":
            return await self._google(path, scope, q, go, send)

        if path == "/signup":
            if m != "accounts" or not accounts.settings()["open_signup"]:
                return await go("/login")
            if not post:
                return await _send(send, 200, _signup_page(nxt), HTML)
            try:
                u = await asyncio.to_thread(accounts.sign_up, form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _signup_page(nxt, str(e), form), HTML)
            return await go(nxt, _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])))

        if path.startswith("/join/"):
            token = path[len("/join/"):]
            if not post:
                if not accounts.invite_valid(token):
                    return await _send(send, 410, _join_page(token, "This invite link has expired or was already used. Ask for a new one."), HTML)
                return await _send(send, 200, _join_page(token), HTML)
            try:
                u = await asyncio.to_thread(accounts.accept_invite, token, form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _join_page(token, str(e), form), HTML)
            return await go("/", _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])))

        if path == "/setup":
            if m == "accounts":
                return await go("/login")
            if not post:
                return await _send(send, 200, _setup_page(nxt), HTML)
            ip = "ip:" + _client(scope)
            if password() and _limited(ip):
                return await _send(send, 429, _setup_page(nxt, TOO_MANY, form), HTML)
            if password() and not _server_password_ok(form.get("server_password", "")):
                _failed(ip)
                await asyncio.sleep(1)
                return await _send(send, 401, _setup_page(nxt, "The server password is wrong.", form), HTML)
            try:
                u = await asyncio.to_thread(accounts.create_owner, form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _setup_page(nxt, str(e), form), HTML)
            return await go(nxt, _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])), _clear(COOKIE))

        if path == "/reset":
            if m != "accounts" or not password():
                return await go("/login")
            if not post:
                return await _send(send, 200, _reset_page(), HTML)
            keys = ("ip:" + _client(scope), "email:" + form.get("email", "").strip().lower())
            if _limited(*keys):
                return await _send(send, 429, _reset_page(TOO_MANY, form.get("email", "")), HTML)
            u = accounts.find_by_email(form.get("email", ""))
            if not _server_password_ok(form.get("server_password", "")) or u is None:
                _failed(*keys)
                await asyncio.sleep(1)
                return await _send(send, 401, _reset_page("The email or the server password is wrong.", form.get("email", "")), HTML)
            try:
                await asyncio.to_thread(accounts.set_password, u["id"], form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _reset_page(str(e), form.get("email", "")), HTML)
            return await go("/", _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])))

        # /login
        if m == "open":
            return await go("/setup" if not post else "/")
        if m == "password":
            if post and "password" in form and "email" not in form:  # the old password-only sign-in
                if _limited("ip:" + _client(scope)):
                    return await _send(send, 429, _setup_page(nxt, TOO_MANY), HTML)
                if hmac.compare_digest(form["password"].encode(), password().encode()):
                    cookie = f"{COOKIE}={session_value()}; Path=/; Max-Age={90 * 86400}; HttpOnly; SameSite=Lax{_secure(scope)}"
                    return await go(nxt, cookie.encode())
                _failed("ip:" + _client(scope))
                await asyncio.sleep(1)
                return await _send(send, 401, _setup_page(nxt, "Wrong password."), HTML)
            return await _send(send, 200, _setup_page(nxt), HTML)
        if not post:
            return await _send(send, 200, _login_page(nxt), HTML)
        keys = ("ip:" + _client(scope), "email:" + form.get("email", "").strip().lower())
        if _limited(*keys):
            return await _send(send, 429, _login_page(nxt, TOO_MANY, form.get("email", "")), HTML)
        # scrypt takes ~0.1 s: off the event loop, so a sign-in never stalls everyone else
        u = await asyncio.to_thread(accounts.verify, form.get("email", ""), form.get("password", ""))
        if u is None:
            _failed(*keys)
            await asyncio.sleep(1)  # slow down guessing
            return await _send(send, 401, _login_page(nxt, "The email or password is wrong.", form.get("email", "")), HTML)
        return await go(nxt, _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])))


def _request_base(scope) -> str:
    """This request's own address (scheme + host), so the Google redirect comes back to the same site whose
    cookies the browser holds (fly.dev or a custom domain)."""
    h = _headers(scope)
    host = h.get("x-forwarded-host") or h.get("host") or "127.0.0.1:8000"
    proto = h.get("x-forwarded-proto") or scope.get("scheme") or "http"
    return f"{proto}://{host}"


async def _google_flow(path, scope, q, go, send):
    from . import accounts, oauth
    if not oauth.enabled():
        return await go("/login")
    if path == "/auth/google":
        nxt = _safe_next(q.get("next") or "/")
        url, cookie = oauth.start(_request_base(scope) + "/auth/google/callback", nxt, q.get("invite", "")[:200])
        c = f"{oauth.STATE_COOKIE}={cookie}; Path=/auth/google; Max-Age={oauth.STATE_TTL}; HttpOnly; SameSite=Lax{_secure(scope)}"
        return await go(url, c.encode())
    clear = f"{oauth.STATE_COOKIE}=; Path=/auth/google; Max-Age=0; HttpOnly; SameSite=Lax".encode()
    st = oauth.read_state(_cookie(scope, oauth.STATE_COOKIE))

    async def fail(msg, status=400):
        return await _send(send, status, _login_page((st or {}).get("n", "/"), msg) if mode() == "accounts" else
                           _setup_page("/", msg), HTML + [(b"set-cookie", clear)])

    if q.get("error"):
        return await fail("Google sign-in was cancelled.")
    if not st or not q.get("state") or not _eq(q["state"], st.get("s", "")):
        return await fail("The Google sign-in expired. Try again.")
    try:
        info = await oauth.exchange(q.get("code", ""), st["r"])
    except ValueError as e:
        return await fail(str(e))
    except Exception:
        return await fail("Could not reach Google. Try again.")
    if not accounts.any_users():
        return await fail("Create the owner account first, then sign in with Google.")
    verified = info.get("email_verified") in (True, "true")
    domain = (info.get("email") or "").rsplit("@", 1)[-1].lower()
    managed = domain in ("gmail.com", "googlemail.com") or (info.get("hd") or "").lower() == domain
    try:
        u = await asyncio.to_thread(accounts.google_user, info["sub"], info["email"], verified, managed)
    except accounts.AccountError as e:
        return await fail(str(e), 403)
    if u is None:
        if not verified:
            return await fail("Your Google email is not verified.")
        try:
            if st.get("i") and accounts.invite_valid(st["i"]):
                u = await asyncio.to_thread(accounts.accept_invite, st["i"], info["email"], info.get("name") or "", None, google=info["sub"])
            else:
                u = await asyncio.to_thread(accounts.sign_up, info["email"], info.get("name") or "", None, google=info["sub"])
        except accounts.AccountError as e:
            msg = str(e)
            if "invite-only" in msg:
                msg = f"There is no account for {info['email']}. This server is invite-only: ask the owner for an invite link."
            return await fail(msg, 403)
    return await go(_safe_next(st.get("n") or "/"), _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])), clear)


def _esc(t: str) -> str:
    return str(t).replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")
