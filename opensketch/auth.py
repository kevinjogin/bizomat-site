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
import os
import secrets
import asyncio
from http.cookies import SimpleCookie
from urllib.parse import parse_qs, quote

COOKIE = "opensketch_session"
ACCOUNT_COOKIE = "opensketch_user"


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
        if v and hmac.compare_digest(v, session_value()):
            return {"id": "server", "email": "", "name": "Server password", "role": "owner", "legacy": True}
    return None


def logged_in(scope) -> bool:
    return mode() == "open" or current_user(scope) is not None


# ---------------------------------------------------------------- pages

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>{title} - OpenSketch</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{{--bg:#f5f5f5;--card:#fff;--line:#e6e6e6;--text:#1e1e1e;--muted:#757575;--accent:#0d99ff;--accent-d:#007be5;--err:#f24822}}
*{{box-sizing:border-box}}
body{{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);font:13px/1.45 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);-webkit-font-smoothing:antialiased}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:28px;width:min(360px,calc(100vw - 32px));box-shadow:0 1px 3px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06)}}
.mark{{display:flex;align-items:center;gap:8px;margin-bottom:20px;font-weight:600;font-size:13px;letter-spacing:-.01em}}
.mark i{{width:22px;height:22px;border-radius:6px;background:#1e1e1e;display:grid;place-items:center}}
.mark i:after{{content:"";width:10px;height:10px;border:2px solid #fff;border-radius:2px;transform:rotate(45deg)}}
h1{{font-size:18px;font-weight:600;margin:0 0 4px;letter-spacing:-.015em}} p.sub{{color:var(--muted);margin:0 0 20px}}
label{{display:block;font-size:11px;font-weight:500;color:var(--muted);margin:12px 0 4px}}
input{{width:100%;height:34px;padding:0 10px;border:1px solid var(--line);border-radius:6px;font:inherit;color:inherit;background:#fff;outline:none;transition:border-color .1s,box-shadow .1s}}
input:hover{{border-color:#c9c9c9}} input:focus{{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}}
button{{margin-top:20px;width:100%;height:34px;border:0;border-radius:6px;background:var(--accent);color:#fff;font:inherit;font-weight:500;cursor:pointer}}
button:hover{{background:var(--accent-d)}}
.err{{color:var(--err);background:#fff1ee;border-radius:6px;padding:8px 10px;margin-top:14px;font-size:12px}}
.note{{color:var(--muted);font-size:12px;margin-top:6px}}
.links{{margin-top:16px;display:flex;justify-content:space-between;gap:12px;font-size:12px}} a{{color:var(--accent);text-decoration:none}} a:hover{{text-decoration:underline}}
hr{{border:0;border-top:1px solid var(--line);margin:20px 0 4px}}
</style></head><body><form class="card" method="post" action="{action}" autocomplete="on">
<div class="mark"><i></i>OpenSketch</div><h1>{title}</h1><p class="sub">{sub}</p>
<input type="hidden" name="next" value="{next}">{fields}{error}<button type="submit">{button}</button>{links}</form></body></html>"""


def _field(name: str, label: str, kind: str = "text", auto: str = "", focus: bool = False, value: str = "", note: str = "") -> str:
    return (f'<label for="{name}">{label}</label><input id="{name}" name="{name}" type="{kind}" autocomplete="{auto}"'
            f' value="{_esc(value)}"{" autofocus" if focus else ""} required>' + (f'<div class="note">{note}</div>' if note else ""))


def _page(title, sub, action, fields, button, nxt="/", error="", links="") -> bytes:
    return PAGE.format(title=title, sub=sub, action=action, fields="".join(fields), button=button, next=_esc(nxt),
                       error=f'<div class="err" role="alert">{_esc(error)}</div>' if error else "", links=links).encode()


def _login_page(nxt, error="", email=""):
    links = '<div class="links">' + ('<a href="/reset">Forgot your password?</a>' if password() else
                                     '<span class="note">Forgot your password? Ask the owner for a new invite.</span>') + '</div>'
    return _page("Sign in", "Sign in to your OpenSketch account.", "/login",
                 [_field("email", "Email", "email", "username", not email, email),
                  _field("password", "Password", "password", "current-password", bool(email))], "Sign in", nxt, error, links)


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
                 "Create account", "/", error, '<div class="links"><a href="/login">I already have an account</a></div>')


def _reset_page(error="", email=""):
    return _page("Reset your password", "Use the server password (OPENSKETCH_PASSWORD) to set a new password.", "/reset",
                 [_field("email", "Email", "email", "username", True, email),
                  _field("server_password", "Server password", "password", "off"),
                  _field("new_password", "New password", "password", "new-password", note="At least 8 characters.")],
                 "Set new password", "/", error, '<div class="links"><a href="/login">Back to sign in</a></div>')


async def _send(send, status: int, body: bytes, headers: list) -> None:
    await send({"type": "http.response.start", "status": status, "headers": headers})
    await send({"type": "http.response.body", "body": body})


HTML = [(b"content-type", b"text/html; charset=utf-8"), (b"cache-control", b"no-store"),
        (b"x-frame-options", b"DENY"), (b"referrer-policy", b"same-origin")]


def _safe_next(n: str) -> str:
    return n if n.startswith("/") and not n.startswith("//") and "\\" not in n else "/"


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
        if path in ("/login", "/setup", "/reset", "/logout") or path.startswith("/join/"):
            return await self._page(path, scope, receive, send)
        if path.startswith("/mcp/") or path.startswith("/review/"):  # their tokens are the keys
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
                accounts.end_session(tok)
            return await go("/login" if m != "open" else "/", _clear(ACCOUNT_COOKIE), _clear(COOKIE))

        if path.startswith("/join/"):
            token = path[len("/join/"):]
            if not post:
                if not accounts.invite_valid(token):
                    return await _send(send, 410, _join_page(token, "This invite link has expired or was already used. Ask for a new one."), HTML)
                return await _send(send, 200, _join_page(token), HTML)
            try:
                u = accounts.accept_invite(token, form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _join_page(token, str(e), form), HTML)
            return await go("/", _set_account_cookie(scope, accounts.start_session(u["id"])))

        if path == "/setup":
            if m == "accounts":
                return await go("/login")
            if not post:
                return await _send(send, 200, _setup_page(nxt), HTML)
            if password() and not _server_password_ok(form.get("server_password", "")):
                await asyncio.sleep(1)
                return await _send(send, 401, _setup_page(nxt, "The server password is wrong.", form), HTML)
            try:
                u = accounts.create_owner(form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _setup_page(nxt, str(e), form), HTML)
            return await go(nxt, _set_account_cookie(scope, accounts.start_session(u["id"])), _clear(COOKIE))

        if path == "/reset":
            if m != "accounts" or not password():
                return await go("/login")
            if not post:
                return await _send(send, 200, _reset_page(), HTML)
            u = accounts.find_by_email(form.get("email", ""))
            if not _server_password_ok(form.get("server_password", "")) or u is None:
                await asyncio.sleep(1)
                return await _send(send, 401, _reset_page("The email or the server password is wrong.", form.get("email", "")), HTML)
            try:
                accounts.set_password(u["id"], form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _reset_page(str(e), form.get("email", "")), HTML)
            return await go("/", _set_account_cookie(scope, accounts.start_session(u["id"])))

        # /login
        if m == "open":
            return await go("/setup" if not post else "/")
        if m == "password":
            if post and "password" in form and "email" not in form:  # the old password-only sign-in
                if hmac.compare_digest(form["password"].encode(), password().encode()):
                    cookie = f"{COOKIE}={session_value()}; Path=/; Max-Age={90 * 86400}; HttpOnly; SameSite=Lax{_secure(scope)}"
                    return await go(nxt, cookie.encode())
                await asyncio.sleep(1)
                return await _send(send, 401, _setup_page(nxt, "Wrong password."), HTML)
            return await _send(send, 200, _setup_page(nxt), HTML)
        if not post:
            return await _send(send, 200, _login_page(nxt), HTML)
        u = accounts.verify(form.get("email", ""), form.get("password", ""))
        if u is None:
            await asyncio.sleep(1)  # slow down guessing
            return await _send(send, 401, _login_page(nxt, "The email or password is wrong.", form.get("email", "")), HTML)
        return await go(nxt, _set_account_cookie(scope, accounts.start_session(u["id"])))


def _esc(t: str) -> str:
    return str(t).replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")
