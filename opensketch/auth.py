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
from urllib.parse import parse_qs, quote, urlencode

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
:root{{--bg:#0c0d0e;--card:#141517;--field:#1d1e21;--line:rgba(255,255,255,.08);--text:#e3e4e8;--muted:#8a8f98;--accent:#5e6ad2;--accent-d:#6b77de;--link:#8b93ff;--err:#eb5757}}
*{{box-sizing:border-box}}
body{{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(90% 70% at 50% 0%,#17181c,var(--bg) 70%);font:13px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);-webkit-font-smoothing:antialiased;color-scheme:dark}}
.card{{background:var(--card);border-radius:12px;padding:28px;width:min(360px,calc(100vw - 32px));box-shadow:0 0 0 1px rgba(255,255,255,.07),0 16px 40px rgba(0,0,0,.5)}}
.mark{{display:flex;align-items:center;gap:8px;margin-bottom:22px;font-weight:600;font-size:13px;letter-spacing:-.01em}}
.mark i{{width:20px;height:20px;border-radius:5px;background:linear-gradient(135deg,#8b93ff,#5e6ad2);display:grid;place-items:center}}
.mark i:after{{content:"";width:8px;height:8px;border:1.6px solid #fff;border-radius:2px;transform:rotate(45deg)}}
h1{{font-size:18px;font-weight:600;margin:0 0 4px;letter-spacing:-.015em}} p.sub{{color:var(--muted);margin:0 0 20px}}
label{{display:block;font-size:11.5px;font-weight:500;color:var(--muted);margin:12px 0 5px}}
input{{width:100%;height:34px;padding:0 10px;border:1px solid var(--line);border-radius:6px;font:inherit;color:inherit;background:var(--field);outline:none;transition:border-color .1s}}
input:hover{{border-color:rgba(255,255,255,.14)}} input:focus{{border-color:var(--accent)}}
button{{margin-top:20px;width:100%;height:34px;border:0;border-radius:6px;background:var(--accent);color:#fff;font:inherit;font-weight:500;cursor:pointer}}
button:hover{{background:var(--accent-d)}}
.err{{color:var(--err);background:rgba(235,87,87,.12);border-radius:6px;padding:8px 10px;margin-top:14px;font-size:12px}}
.note{{color:var(--muted);font-size:12px;margin-top:6px}}
.gbtn{{display:flex;align-items:center;justify-content:center;gap:10px;height:36px;border-radius:6px;background:#fff;color:#1f1f1f;font-weight:500;text-decoration:none;border:1px solid #dadce0}}
.gbtn:hover{{background:#f2f2f2;text-decoration:none}}
.or{{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:11.5px;margin:16px 0 2px}} .or:before,.or:after{{content:"";flex:1;border-top:1px solid var(--line)}}
.links{{margin-top:16px;display:flex;justify-content:space-between;gap:12px;font-size:12px}} a{{color:var(--link);text-decoration:none}} a:hover{{text-decoration:underline}}
</style></head><body><form class="card" method="post" action="{action}" autocomplete="on">
<div class="mark"><i></i>OpenSketch</div><h1>{title}</h1><p class="sub">{sub}</p>{top}
<input type="hidden" name="next" value="{next}">{fields}{error}<button type="submit">{button}</button>{links}</form></body></html>"""


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
              '<span class="note">Forgot your password? Ask the owner for a new invite.</span>')
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
        if path in ("/login", "/setup", "/reset", "/logout", "/signup") or path.startswith("/join/") or path.startswith("/auth/google"):
            return await self._page(path, scope, receive, send)
        # /mcp/ and /review/: their tokens are the keys. GET /api/features: the command list (no document
        # data), which the read-only review app loads too.
        if path.startswith("/mcp/") or path.startswith("/review/") or (path == "/api/features" and scope.get("method") == "GET"):
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
                accounts.end_session(tok)
            return await go("/login" if m != "open" else "/", _clear(ACCOUNT_COOKIE), _clear(COOKIE))

        if path == "/auth/google" or path == "/auth/google/callback":
            return await self._google(path, scope, q, go, send)

        if path == "/signup":
            if m != "accounts" or not accounts.settings()["open_signup"]:
                return await go("/login")
            if not post:
                return await _send(send, 200, _signup_page(nxt), HTML)
            try:
                u = accounts.sign_up(form.get("email", ""), form.get("name", ""), form.get("new_password", ""))
            except accounts.AccountError as e:
                return await _send(send, 400, _signup_page(nxt, str(e), form), HTML)
            return await go(nxt, _set_account_cookie(scope, accounts.start_session(u["id"])))

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
    if not st or not q.get("state") or not hmac.compare_digest(q["state"], st.get("s", "")):
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
    u = accounts.google_user(info["sub"], info["email"], verified)
    if u is None:
        if not verified:
            return await fail("Your Google email is not verified.")
        try:
            if st.get("i") and accounts.invite_valid(st["i"]):
                u = accounts.accept_invite(st["i"], info["email"], info.get("name") or "", None, google=info["sub"])
            else:
                u = accounts.sign_up(info["email"], info.get("name") or "", None, google=info["sub"])
        except accounts.AccountError as e:
            msg = str(e)
            if "invite-only" in msg:
                msg = f"There is no account for {info['email']}. This server is invite-only: ask the owner for an invite link."
            return await fail(msg, 403)
    return await go(_safe_next(st.get("n") or "/"), _set_account_cookie(scope, accounts.start_session(u["id"])), clear)


def _esc(t: str) -> str:
    return str(t).replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")
