"""Sign-in for the whole site, and the secret address of the MCP endpoint.

Three modes:
- accounts: at least one account exists (accounts.py). Every page and API call needs a signed-in person
  (email + password, server-side sessions). The owner invites other people with links.
- password: OPENSKETCH_PASSWORD is set but nobody has an account yet. The sign-in page asks to create the
  owner account, with the server password as the key. The old password-only sign-in still works until then.
- open: no password and no accounts (a server only you can reach). Anyone who reaches the server can use it;
  creating the owner account (/setup) turns sign-in on.

The private MCP address is /mcp/<token> (for AI apps that cannot sign in; the others use /mcp with OAuth, mcpauth.py):
the address itself is the key. The server owner keeps the server-wide token from before accounts (derived from the
password, or from a random secret kept in the data folder when there is no password, or set directly with
OPENSKETCH_MCP_TOKEN), so connectors added then keep working. Every other person's token is keyed by the data
folder's random secret (data_secret) and a counter: never by the server password, which would let anyone holding
their own address guess the password offline. A new address (New address on the home page, or a password change) bumps
the counter; the owner's first new address leaves the server-wide token too.
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
PUBLIC_FILES = ("/favicon.svg", "/favicon.ico")
PUBLIC_DIRS = ("/fonts/", "/ui/")  # the self-hosted fonts and the design system (CSS, icons): no data, needed by every page
PUBLIC_PAGES = ("/overview", "/docs")  # the product page and the documentation: no data, for everyone (the installer download needs sign-in)


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


_secrets: dict[str, bytes] = {}  # data folder -> its secret.keys (read once: every MCP and SOLIDWORKS call needs it)


def data_secret(label: str) -> bytes:
    """A key from a random secret kept in the data folder, never from the server password (a short password
    must not be guessable offline from a signed link or cookie)."""
    from . import store
    p = store.data_dir() / "secret.keys"
    base = _secrets.get(str(p))
    if base is None or not p.exists():
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
        base = _secrets[str(p)] = p.read_text().strip().encode()
    return hmac.new(base, label.encode(), hashlib.sha256).digest()


def _eq(a, b) -> bool:
    """Constant-time comparison that never raises (non-ASCII text in a URL is just a mismatch)."""
    return hmac.compare_digest(str(a or "").encode("utf-8", "replace"), str(b or "").encode("utf-8", "replace"))


def mcp_token() -> str:
    return os.environ.get("OPENSKETCH_MCP_TOKEN") or _mac("mcp", 32)


def session_value() -> str:
    return _mac("session", 40)


def check_token(token: str) -> bool:
    return resolve_mcp(token)[0]


def _person_token(user_id: str, n: int) -> str:
    return hmac.new(data_secret("mcp-address"), f"{user_id}:{n}".encode(), hashlib.sha256).hexdigest()[:32]


def mcp_token_for(user: dict | None) -> str:
    """The private connector address key for one person, which only reaches that person's own SOLIDWORKS link. The
    server owner (and a server without accounts) keeps the server-wide address until they ask for a new one, so a
    connector added before accounts keeps working."""
    from . import accounts
    if user is None or user.get("legacy"):
        return mcp_token()
    n = accounts.mcp_counter(user["id"])
    if user.get("role") == "owner" and n == 0:
        return mcp_token()
    return _person_token(user["id"], n)


def _address_index(data: dict) -> dict:
    """sha256(private address key) -> account id, for every account that has its own key."""
    out = {}
    for u in data["users"]:
        n = int(u.get("mcp_n", 0))
        if u["role"] == "owner" and n == 0:
            continue  # the server-wide key
        out[hashlib.sha256(_person_token(u["id"], n).encode()).hexdigest()] = u["id"]
    return out


def resolve_mcp(token: str) -> tuple[bool, dict | None]:
    """(valid, person) for an MCP address key. The server-wide key acts as the server owner once accounts
    exist (until the owner makes a new address); None as the person means no accounts (everything is shared).
    A lookup by the key's hash: no work per account on a request (anyone can send one)."""
    if not token or len(token) > 200:
        return False, None
    from . import accounts
    owner = accounts.owner()
    if (owner is None or accounts.mcp_counter(owner["id"]) == 0) and _eq(token, mcp_token()):
        return True, owner
    uid = accounts.derived("mcp-addresses", _address_index).get(hashlib.sha256(token.encode()).hexdigest())
    if uid:
        user = accounts.get(uid)
        if user:
            return True, user
    return False, None


def _bare_host(value: str) -> str:
    """'Cad.Bizomat.AI:443' or 'https://cad.bizomat.ai/' -> 'cad.bizomat.ai'."""
    from urllib.parse import urlsplit
    from .canonical import _host_only
    v = (value or "").strip()
    if "://" in v:
        v = urlsplit(v).netloc
    return _host_only(v.split("/")[0])


def alias_hosts() -> list[str]:
    """OPENSKETCH_ALIAS_HOSTS: the public host names that serve this same app, comma separated, for example
    "cad.bizomat.ai,cados.kevos.com" while the app moves to a new domain and keeps the old one for existing
    connectors, add-ins and Companions."""
    out: list[str] = []
    for x in os.environ.get("OPENSKETCH_ALIAS_HOSTS", "").split(","):
        h = _bare_host(x)
        if h and h not in out:
            out.append(h)
    return out


def request_alias(headers: dict | None) -> str:
    """The alias host this request was made to, or "". Behind a trusted proxy its X-Forwarded-Host is the host (proxy.py
    put it in Host and removed X-Forwarded-Host from anyone else, so both can be read here)."""
    if not headers:
        return ""
    h = _bare_host(headers.get("x-forwarded-host") or headers.get("host") or "")
    return h if h and h in alias_hosts() else ""


def known_bases() -> list[str]:
    """This app's public addresses from its settings: https://<each alias host>, then OPENSKETCH_PUBLIC_URL."""
    out = ["https://" + h for h in alias_hosts()]
    env = os.environ.get("OPENSKETCH_PUBLIC_URL", "").strip().rstrip("/")
    if env and env not in out:
        out.append(env)
    return out


def public_url(headers: dict | None = None) -> str:
    """Address the server is reached at: https://<host> when the request was made to one of OPENSKETCH_ALIAS_HOSTS (so the
    OAuth and MCP metadata name the address the client used), else OPENSKETCH_PUBLIC_URL, else the request's own host."""
    alias = request_alias(headers)
    if alias:
        return "https://" + alias
    env = os.environ.get("OPENSKETCH_PUBLIC_URL", "").rstrip("/")
    if env:
        return env
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


def current_user(scope, m: str | None = None) -> dict | None:
    """The signed-in person, or None. In password mode the old password cookie stands for the server."""
    from . import accounts
    m = m or mode()
    if m == "accounts":
        return accounts.session_user(_cookie(scope, ACCOUNT_COOKIE))
    if m == "password":
        v = _cookie(scope, COOKIE)
        if v and _eq(v, session_value()):
            return {"id": "server", "email": "", "name": "Server password", "role": "owner", "legacy": True}
    return None


def _signed_in_quietly(scope) -> bool:
    """For the public pages' header (Sign in or Dashboard): never fails, never opens anything."""
    try:
        return mode() == "open" or current_user(scope) is not None
    except Exception:
        return False


def logged_in(scope) -> bool:
    return mode() == "open" or current_user(scope) is not None


# ---------------------------------------------------------------- pages

# Sign-in pages: the BIZOMAT design system (static/ui/bizomat-tokens.css, static/ui/cados.css): a product panel on the
# left, the form on the right, with "CAD Automation" over each form so people know which BIZOMAT product they sign in to.
def _auth_html(form: str) -> str:
    """The page around a sign-in form; a str.format template ({doctitle}, {title}, {pitch} and the form's own fields)."""
    from . import brand
    site = brand.site_url()
    aside = (f'<aside class="auth-aside">{brand.wordmark()}<div class="auth-pitch"><h2>{{pitch}}</h2>'
             '<p>Connect your AI assistant to SOLIDWORKS on your own computer.</p><ul class="auth-points">'
             '<li>Native, editable SOLIDWORKS features</li><li>Every sketch solved and every feature checked before it is built</li>'
             '<li>You approve each assistant and each computer</li></ul></div>'
             f'<div class="fine"><span>Part of the <a href="{_esc(site)}/" rel="noopener">{brand.PLATFORM}</a> platform</span>'
             '<a href="/docs">Documentation</a><a href="/privacy">Privacy</a>'
             f'<a href="{_esc(brand.site_page("terms"))}" rel="noopener">Terms</a></div></aside>')
    top = f'<div class="auth-top">{brand.wordmark()}<a class="small" href="/docs">Help</a></div>'
    head = brand.head("__TITLE__").replace("{", "{{").replace("}", "}}").replace("__TITLE__", "{doctitle}")
    return f'{head}<body><div class="auth">{aside}{top}<main class="auth-main" id="main">{form}</main></div></body></html>'


FORM = ('<form class="auth-card" method="post" action="{action}" autocomplete="on"><span class="eyebrow">CAD Automation</span>'
        '<h1>{title}</h1><p class="sub">{sub}</p>{top}<input type="hidden" name="next" value="{next}">{fields}{error}'
        '<button type="submit">{button}</button>{links}</form>')
_templates: dict[tuple, str] = {}  # (BIZOMAT_SITE_URL, OPENSKETCH_PUBLIC_URL) -> the page template


def page_template() -> str:
    """The sign-in page template, made once for each pair of the settings it shows (read when a page is made)."""
    from . import brand
    key = (brand.site_url(), os.environ.get("OPENSKETCH_PUBLIC_URL", ""))
    t = _templates.get(key)
    if t is None:
        t = _templates[key] = _auth_html(FORM)
    return t


def consent_page(app_name: str, redirect_uri: str, user: dict | None, req: str, app_host: str = "") -> bytes:
    """Allow / Cancel for an AI app that wants to use this person's CAD Automation (mcpauth.py)."""
    from urllib.parse import urlsplit
    u = urlsplit(redirect_uri)
    host = u.hostname or (u.scheme + "://")
    local = (u.hostname or "") in ("localhost", "127.0.0.1", "::1") or u.scheme not in ("http", "https")
    name = _esc(app_name)
    who = (f'<b>{_esc(user.get("name") or "")}</b> ({_esc(user.get("email") or "")})' if user and not user.get("legacy")
           else "<b>this server</b>")
    can = ('Work in SOLIDWORKS on your computers through CAD Automation', 'Create and change parts, assemblies and drawings',
           'Import, measure, preview and export your models')
    top = (f'<ul class="can">{"".join(f"<li>{c}</li>" for c in can)}</ul>'
           f'<div class="note">Signed in as {who}. Not you? <a href="/logout">Sign out</a></div>'
           f'<div class="note">You return to <b>{_esc(host)}</b> after this.'
           + (" That is an app on this computer: allow it only if you just started connecting it." if local else "")
           + '</div>')
    fields = [f'<input type="hidden" name="req" value="{_esc(req)}">']
    links = ('<button type="submit" name="action" value="deny" class="ghost">Cancel</button>'
             '<div class="note center">You can disconnect it at any time on your CAD Automation dashboard.</div>')
    sub = f"{name} wants to use BIZOMAT CAD Automation to work in SOLIDWORKS for you." + (f" Its details come from <b>{_esc(app_host)}</b>." if app_host else "")
    return _page(f"Connect {name}", sub, "/oauth/authorize", fields,
                 "Allow", "/", "", links, top)


def notice_page(title: str, sub: str, message: str = "", button: str = "Go to CAD Automation", href: str = "/") -> bytes:
    """A page with one message and a way on (no form to fill)."""
    page = _page(title, sub, "/", [], button, "/", message)
    return page.replace(b'method="post" action="/"', f'method="get" action="{_esc(href)}"'.encode()).replace(
        b'<input type="hidden" name="next" value="/">', b"")


def oauth_problem_page(message: str) -> bytes:
    page = _page("Could not connect", "Your AI assistant sent a sign-in request that CAD Automation cannot accept.", "/", [],
                 "Go to CAD Automation", "/", message)
    return page.replace(b'method="post" action="/"', b'method="get" action="/"').replace(b'<input type="hidden" name="next" value="/">', b"")


# Privacy notice: public (Google requires one before a sign-in app can be used by anyone), about this service.
PRIVACY_BODY = """<main id="main"><div class="doc-hero"><div class="container"><span class="eyebrow">Legal</span><h1>Privacy</h1>
<p>What BIZOMAT CAD Automation keeps about you, why, and who else sees it. Last updated 5 November 2026.</p></div></div>
<div class="container doc-layout"><nav class="toc" aria-label="On this page"><h4>On this page</h4><ol>
<li><a href="#summary">Summary</a></li><li><a href="#kept">What is kept</a></li><li><a href="#google">Sign in with Google</a></li>
<li><a href="#ai">AI assistants</a></li><li><a href="#who">Who can see your work</a></li><li><a href="#delete">Deleting your data</a></li>
<li><a href="#changes">Changes</a></li></ol></nav><article class="prose">
<section id="summary"><h2>Summary</h2>
<p>BIZOMAT CAD Automation (called CADOS until November 2026) connects your AI assistant (Claude, ChatGPT and others) to
SOLIDWORKS on your own computer, through its add-in and the BIZOMAT Companion. This service keeps only what it needs to sign
you in, know your computers and pass work between your assistant and SOLIDWORKS. Nothing is sold, used for advertising or
tracked across other sites. This notice covers this service only; the BIZOMAT website has its own
<a href="__PLATFORM_PRIVACY__" rel="noopener">privacy notice</a>.</p></section>
<section id="kept"><h2>What is kept</h2><ul>
<li><b>Your account:</b> your name, your email address, and either a password (stored only as a one-way hash) or the ID of
the Google account you sign in with.</li>
<li><b>Your connections:</b> the AI assistants you connected (their name and sign-in tokens, stored only as one-way hashes)
and your add-in key, so SOLIDWORKS on your computer can reach your account.</li>
<li><b>Your computers:</b> the name you gave each paired computer, its Windows computer name and version, the public half of
its key, and when it was last seen.</li>
<li><b>A record of commands:</b> for each command sent to one of your computers, which tool and assistant sent it, when,
its status and its result. The command's details are kept only as a fingerprint (a hash).</li>
<li><b>Sign-in sessions:</b> a random token in a cookie, so you stay signed in. A second, short-lived cookie protects the
Google sign-in step and is removed after it.</li>
<li><b>Work in passing:</b> while your assistant works, the commands it sends and the shapes SOLIDWORKS sends back (for
example a STEP copy of a part, to measure and check it) pass through this service. They are held in memory or for a short
time to do that work, then dropped. Files you upload for import are deleted once imported, or after 30 minutes. Your
SOLIDWORKS files are saved on your computer.</li>
<li><b>A problem log:</b> when a request fails or takes unusually long, the server's log notes when, which page (without
any key in it), the account and the address the request came from, so the problem can be found.</li></ul>
<p>These pages load nothing from other sites: the fonts and pictures come from this service, so opening them tells no one
else that you visited.</p></section>
<section id="google"><h2>Sign in with Google</h2>
<p>If you choose Continue with Google, Google tells this service your name, your email address, whether that address is
verified, your Google account ID and, for work accounts, your organisation's domain. It asks for nothing else: no access to
your Gmail, Drive, contacts or anything else in your Google account.</p>
<p>This information is used only to sign you in and to link the sign-in to your account. It is stored with your
account. It is not sold, not shared, not used for advertising and not used to train AI models. You can remove the link at any time in
your Google account settings (Security, Third-party connections).</p></section>
<section id="ai"><h2>AI assistants</h2>
<p>CAD Automation runs no AI of its own. The assistant you connect sees what its tools return to it (feature lists,
measurements, preview images of your SOLIDWORKS model), under that assistant's own privacy terms. It can only do what the
tools allow, only while you keep it connected, and only with the computers paired to your account.</p></section>
<section id="who"><h2>Who can see your work</h2>
<p>Only you and the assistants you connect. The people who run this service can technically reach the data stored on it,
as with any online service.</p></section>
<section id="delete"><h2>Deleting your data</h2>
<p>Disconnect assistants, remove computers or make a new add-in key on your dashboard. To close your account and remove
your sign-in details, ask your administrator or the person who invited you.</p></section>
<section id="changes"><h2>Changes</h2><p>If this notice changes, the date at the top changes with it.</p></section>
</article></div></main>"""


def privacy_page(signed_in: bool = False, base: str = "") -> bytes:
    from . import brand
    body = PRIVACY_BODY.replace("__PLATFORM_PRIVACY__", _esc(brand.site_page("privacy")))
    return (brand.head("Privacy", "How BIZOMAT CAD Automation handles your account, your computers and your work.",
                       path="/privacy", index=True, base=base)
            + "<body>" + brand.header("", signed_in) + body + brand.footer() + brand.MENU_SCRIPT + "</body></html>").encode()


def _field(name: str, label: str, kind: str = "text", auto: str = "", focus: bool = False, value: str = "", note: str = "",
           invalid: bool = False) -> str:
    """A labelled input; its note and (when invalid) the page's error are read out with it (aria-describedby)."""
    described = " ".join(x for x in ((f"{name}-note" if note else ""), ("err" if invalid else "")) if x)
    return (f'<label for="{name}">{label}</label><input id="{name}" name="{name}" type="{kind}" autocomplete="{auto}"'
            f' value="{_esc(value)}"{" autofocus" if focus else ""} required'
            + (f' aria-describedby="{described}"' if described else "") + (' aria-invalid="true"' if invalid else "") + '>'
            + (f'<div class="note" id="{name}-note">{note}</div>' if note else ""))


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


PITCH = "Turn engineering intent into CAD."


def _page(title, sub, action, fields, button, nxt="/", error="", links="", top="", pitch=PITCH, doctitle="") -> bytes:
    return page_template().format(doctitle=doctitle or title, title=title, sub=sub, action=action, fields="".join(fields),
                                  button=button, next=_esc(nxt), top=top, pitch=pitch,
                       error=f'<div class="err" id="err" role="alert">{_esc(error)}</div>' if error else "", links=links).encode()


def _login_page(nxt, error="", email=""):
    from . import accounts
    forgot = ('<span class="note">Forgot your password? Ask the person who invited you. '
              '<a href="/reset">Administrator?</a></span>' if password() else
              '<span class="note">Forgot your password? Ask your administrator.</span>')
    signup = '<a href="/signup">Create an account</a>' if accounts.settings()["open_signup"] else ""
    links = f'<div class="links">{forgot}{signup}</div>'
    if accounts.access_code():  # keeps `next`, so an AI app's sign-in (/oauth/authorize) carries on after the code
        q = "?" + urlencode({"next": nxt}) if nxt and nxt != "/" else ""
        links += f'<div class="links"><a href="/access{_esc(q)}">Have an early access code?</a></div>'
    return _page("Sign in to BIZOMAT", "Welcome back. Sign in to CAD Automation with your email and password.", "/login",
                 [_field("email", "Email", "email", "username", not email, email),
                  _field("password", "Password", "password", "current-password", bool(email), invalid=bool(error))],
                 "Sign in", nxt, error, links, _google_block(nxt), doctitle="Sign in")


def _access_page(nxt="/", error="", code=""):
    """Early access: type the owner's code, skip sign-up, work as an Internal tester (accounts.create_tester)."""
    return _page("Early access", "Enter your access code to try CAD Automation. No account needed.", "/access",
                 [_field("code", "Access code", "text", "off", True, code, invalid=bool(error)).replace(
                     'autocomplete="off"', 'autocomplete="off" spellcheck="false" autocapitalize="off"')], "Start", nxt, error,
                 f'<div class="links"><a href="/login{_esc("?" + urlencode({"next": nxt}) if nxt and nxt != "/" else "")}">I have an account</a></div>')


def _access_closed_page() -> bytes:
    page = _page("Early access", "Early access is closed at the moment. Ask the person who gave you the code.", "/login", [],
                 "Sign in instead", "/")
    return page.replace(b'method="post" action="/login"', b'method="get" action="/login"').replace(b'<input type="hidden" name="next" value="/">', b"")


# A new account's password: the form fills in a strong one (shown as dots, with Show), the person keeps it or types
# their own. A kept one is shown to them once more after sign-in (hold_new_password), as only its hash is stored.
_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
SHOW_SCRIPT = ("<script>document.querySelectorAll('.pw-show').forEach(function(b){b.addEventListener('click',function(){"
               "var i=document.getElementById(b.getAttribute('aria-controls'));var s=i.type==='password';i.type=s?'text':'password';"
               "b.textContent=s?'Hide':'Show';b.setAttribute('aria-pressed',String(s));});});</script>")


def suggest_password() -> str:
    raw = "".join(secrets.choice(_ALPHABET) for _ in range(16))
    return "-".join(raw[i:i + 4] for i in range(0, 16, 4))


def _new_password_field() -> str:
    pw = suggest_password()
    return ('<label for="new_password">Password</label><div class="pw-row">'
            f'<input id="new_password" name="new_password" type="password" autocomplete="new-password" value="{pw}" minlength="8"'
            ' required spellcheck="false" aria-describedby="new_password-note">'
            '<button class="pw-show" type="button" aria-controls="new_password" aria-pressed="false">Show</button></div>'
            f'<input type="hidden" name="suggested" value="{pw}">'
            '<div class="note" id="new_password-note">We filled in a strong password for you. Keep it, or type your own '
            '(at least 8 characters). If you keep it, it is shown to you once after you sign in.</div>')


def _password_by(form: dict) -> str:
    """"suggested" when the person kept the password the form filled in, else "self"."""
    given, offered = form.get("new_password", ""), form.get("suggested", "")
    return "suggested" if given and offered and hmac.compare_digest(given.encode(), offered.encode()) else "self"


_NEW_PASSWORDS: dict[str, tuple[str, float]] = {}  # session hash -> (kept suggested password, until); memory only
NEW_PASSWORD_MINUTES = 30


def hold_new_password(session: str, pw: str) -> None:
    import time
    from . import accounts
    now = time.time()
    for k in [k for k, (_, until) in _NEW_PASSWORDS.items() if until < now]:
        del _NEW_PASSWORDS[k]
    if len(_NEW_PASSWORDS) < 1000:
        _NEW_PASSWORDS[accounts._sha(session)] = (pw, now + NEW_PASSWORD_MINUTES * 60)


def new_password_for(scope, drop: bool = False) -> str | None:
    """The suggested password this browser's new account kept, for the one-time notice after sign-in."""
    import time
    from . import accounts
    tok = _cookie(scope, ACCOUNT_COOKIE)
    if not tok:
        return None
    k = accounts._sha(tok)
    pw, until = _NEW_PASSWORDS.get(k, (None, 0))
    if drop or until < time.time():
        _NEW_PASSWORDS.pop(k, None)
        return None
    return pw


def _signup_page(nxt="/", error="", form=None):
    form = form or {}
    return _page("Create an account", "Create your account for BIZOMAT CAD Automation.", "/signup",
                 [_field("name", "Your name", "text", "name", True, form.get("name", "")),
                  _field("email", "Email", "email", "username", False, form.get("email", "")),
                  _new_password_field()],
                 "Create account", nxt, error, '<div class="links"><a href="/login">I already have an account</a></div>' + SHOW_SCRIPT,
                 _google_block(nxt, label="Sign up with Google"))


def _setup_page(nxt, error="", form=None):
    form = form or {}
    f = [_field("name", "Your name", "text", "name", True, form.get("name", "")),
         _field("email", "Email", "email", "username", False, form.get("email", "")),
         _new_password_field()]
    if password():
        f.append(_field("server_password", "Server password", "password", "off",
                        note="The password set on the server when CAD Automation was installed. It proves you run this server. "
                             "Needed only this once."))
    on = form.get("open_signup", "on" if not form else "") == "on"
    f.append('<label class="check"><input type="checkbox" name="open_signup" value="on"' + (" checked" if on else "")
             + '> Anyone can create their own account. You can change this on the Admin page.</label>')
    return _page("Set up CAD Automation", "Create the administrator account. This page shows only once: after this, everyone signs in with their email and password.", "/setup", f,
                 "Create account", nxt, error,
                 '<div class="note center">Not the administrator? CAD Automation is not set up here yet. Ask the person who runs it, '
                 'then come back to create your account.</div>' + SHOW_SCRIPT)


def _join_page(token, error="", form=None):
    form = form or {}
    return _page("Join CAD Automation", "You were invited to BIZOMAT CAD Automation. Create your account.",
                 f"/join/{quote(token)}", [_field("name", "Your name", "text", "name", True, form.get("name", "")),
                                           _field("email", "Email", "email", "username", False, form.get("email", "")),
                                           _new_password_field()],
                 "Create account", "/", error, '<div class="links"><a href="/login">I already have an account</a></div>' + SHOW_SCRIPT,
                 _google_block("/", token, "Join with Google"))


def _reset_page(error="", email=""):
    return _page("Reset a password", "For administrators: the server password sets a new password for any account. Everyone else: ask the person who invited you.", "/reset",
                 [_field("email", "Email", "email", "username", True, email),
                  _field("server_password", "Server password", "password", "off"),
                  _field("new_password", "New password", "password", "new-password", note="At least 8 characters.")],
                 "Set new password", "/", error, '<div class="links"><a href="/login">Back to sign in</a></div>')


async def _send(send, status: int, body: bytes, headers: list) -> None:
    await send({"type": "http.response.start", "status": status, "headers": headers})
    await send({"type": "http.response.body", "body": body})


TOO_MANY = "Too many tries. Wait a few minutes, then try again."
TOO_MANY_NEW = "Too many new accounts from this network. Try again in an hour."
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


async def _new_account_cookie(scope, u: dict, form: dict) -> bytes:
    """Sign a new account in; when it kept the suggested password, hold it for the one-time notice."""
    from . import accounts
    token = await asyncio.to_thread(accounts.start_session, u["id"])
    if _password_by(form) == "suggested":
        hold_new_password(token, form["new_password"])
    return _set_account_cookie(scope, token)


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


# Sign-in guesses: at most LIMIT failures per WINDOW for one email, and per IP_WINDOW from one client address
# (IPv6: one /64), then a wait. New accounts (early access, open sign-up): at most NEW_PER_HOUR per address an hour.
LIMIT = 8
WINDOW = 15 * 60
IP_WINDOW = 5 * 60
NEW_PER_HOUR = 30
_fails: dict[str, list[float]] = {}
_made: dict[str, list[float]] = {}


def _net(ip: str) -> str:
    """One client for the limits: an IPv6 address counts as its /64 (one home or one server holds a whole /64)."""
    import ipaddress
    try:
        a = ipaddress.ip_address(ip.strip().strip("[]").split("%")[0])
    except ValueError:
        return ip
    if a.version == 6 and a.ipv4_mapped:
        return str(a.ipv4_mapped)
    return str(ipaddress.ip_network(f"{a}/64", strict=False)) if a.version == 6 else str(a)


def _client(scope) -> str:
    """The client, as the rate limits count it: its address as proxy.py decides it (Fly-Client-IP on Fly.io, a trusted
    proxy's X-Forwarded-For, else the connection), an IPv6 address as its /64."""
    from . import proxy
    return _net(proxy.client_ip(scope))


def _window(key: str) -> float:
    return WINDOW if key.startswith("email:") else IP_WINDOW


def _prune(table: dict, window, keep: int = 5000) -> None:
    """Forget keys whose last entry is older than their window, never the whole table (clearing it let anyone reset
    a counter by filling it); past keep * 4 keys, the quietest go."""
    import time
    if len(table) <= keep:
        return
    now = time.time()
    for k in [k for k, v in table.items() if not v or now - v[-1] >= window(k)]:
        table.pop(k, None)
    if len(table) > keep * 4:
        for k in sorted(table, key=lambda k: table[k][-1])[:len(table) - keep * 2]:
            table.pop(k, None)


def _limited(*keys: str) -> bool:
    import time
    now = time.time()
    for k in keys:
        recent = [t for t in _fails.get(k, []) if now - t < _window(k)]
        if recent:
            _fails[k] = recent
        else:
            _fails.pop(k, None)
        if len(recent) >= LIMIT:
            return True
    return False


def _failed(*keys: str) -> None:
    import time
    _prune(_fails, _window)
    for k in keys:
        _fails.setdefault(k, []).append(time.time())


def _new_account_ok(scope) -> bool:
    """Counts one new account from this address; False past NEW_PER_HOUR an hour (a script with the code)."""
    import time
    now, k = time.time(), _client(scope)
    _prune(_made, lambda _k: 3600)
    hits = [t for t in _made.get(k, []) if now - t < 3600]
    if len(hits) >= NEW_PER_HOUR:
        _made[k] = hits
        return False
    _made[k] = hits + [now]
    return True


OAUTH_PUBLIC = ("/oauth/register", "/oauth/token", "/oauth/revoke")


def _machine_path(path: str) -> bool:
    """Paths AI apps call from their own servers or tools: no cookies, their own keys, so no sign-in page and no
    same-site check (consent at /oauth/authorize is not one of them)."""
    return (path in ("/mcp", "/mcp/") or path.startswith("/mcp/") or path in OAUTH_PUBLIC
            or path in ("/solidworks/mcp", "/solidworks/mcp/") or path.startswith("/solidworks/mcp/")
            or path.startswith("/.well-known/oauth-")
            or path.startswith(("/v2/device/", "/v2/devices/")) or path == "/v2/keys")


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


def _loose(v: str) -> str:
    """A pasted or typed server password: no spaces around it, and no one pair of quotes around it (a secret set from
    Windows cmd with 'single quotes' keeps them)."""
    v = (v or "").strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "'\"":
        v = v[1:-1].strip()
    return v


def _server_password_ok(given: str) -> bool:
    if not password():
        return False
    return (hmac.compare_digest((given or "").encode(), password().encode())
            or (bool(_loose(given)) and hmac.compare_digest(_loose(given).encode(), _loose(password()).encode())))


class PasswordGate:
    """ASGI middleware: sign-in pages, the session check, sign-out. MCP paths (and the add-in's link) are
    checked by their own tokens instead. Puts the signed-in person in scope["state"]["user"]."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        path = scope.get("path", "")
        if scope.get("method") not in ("GET", "HEAD", "OPTIONS") and not _machine_path(path) and not _same_origin(scope):
            return await _send(send, 403, b'{"error":"This request did not come from a CAD Automation page."}', [(b"content-type", b"application/json")])
        if path == "/healthz" and scope.get("method") in ("GET", "HEAD"):  # the supervisor's check: no data, no sign-in
            return await self.app(scope, receive, send)
        if path == "/privacy" and scope.get("method") in ("GET", "HEAD"):
            return await _send(send, 200, privacy_page(_signed_in_quietly(scope), public_url(_headers(scope))),
                               [(b"content-type", b"text/html; charset=utf-8"), (b"cache-control", b"no-cache")])
        from . import accounts
        try:
            m = mode()
        except accounts.AccountError as e:  # damaged or missing accounts file: closed, never open
            return await _send(send, 503, json.dumps({"error": str(e)}).encode(), [(b"content-type", b"application/json")])
        if path in ("/login", "/setup", "/reset", "/logout", "/signup", "/access") or path.startswith("/join/") or path.startswith("/auth/google"):
            return await self._page(path, scope, receive, send)
        # /mcp and /mcp/<key> (and the add-in's /mcp/sw/): their tokens are the keys. OAuth metadata, registration,
        # token and revoke are for AI apps (no cookies).
        if _machine_path(path):
            return await self.app(scope, receive, send)
        # The favicon and fonts hold no data.
        if scope.get("method") in ("GET", "HEAD") and (path in PUBLIC_FILES or path.startswith(PUBLIC_DIRS)):
            return await self.app(scope, receive, send)
        user = current_user(scope, m)
        scope.setdefault("state", {})["user"] = user
        if m == "open" or user is not None:
            return await self.app(scope, receive, send)
        # The product page (/ for visitors) and the documentation are public: they hold no data.
        if scope.get("method") in ("GET", "HEAD") and (path == "/" or path in PUBLIC_PAGES):
            return await self.app(scope, receive, send)
        if scope.get("method") == "GET" and not path.startswith("/api/"):
            nxt = path + ("?" + scope["query_string"].decode() if scope.get("query_string") else "")
            return await _send(send, 303, b"", [(b"location", f"/login?next={quote(nxt)}".encode())])
        return await _send(send, 401, b'{"error":"Sign in to CAD Automation first."}', [(b"content-type", b"application/json")])

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

        if path == "/access":
            if m != "accounts":
                return await go("/login" if m == "password" else "/")
            if not accounts.access_code():
                return await _send(send, 410, _access_closed_page(), HTML)
            if not post:
                if current_user(scope) is not None:
                    return await go(nxt)  # already signed in on this browser
                return await _send(send, 200, _access_page(nxt, code=(q.get("code") or "")[:40]), HTML)
            ip = "ip:" + _client(scope)
            if _limited(ip):
                return await _send(send, 429, _access_page(nxt, TOO_MANY), HTML)
            if not accounts.check_access(form.get("code", "")):
                _failed(ip)
                await asyncio.sleep(1)  # slow down guessing
                return await _send(send, 401, _access_page(nxt, "That code is not right. Check it and try again.",
                                                           form.get("code", "")[:40]), HTML)
            if not _new_account_ok(scope):
                return await _send(send, 429, _access_page(nxt, TOO_MANY_NEW), HTML)
            try:
                u = await asyncio.to_thread(accounts.create_tester)
            except accounts.AccountError as e:
                return await _send(send, 503, _access_page(nxt, str(e)), HTML)
            return await go(nxt, _set_account_cookie(scope, await asyncio.to_thread(accounts.start_session, u["id"])))

        if path == "/signup":
            if m != "accounts" or not accounts.settings()["open_signup"]:
                return await go("/login")
            if not post:
                return await _send(send, 200, _signup_page(nxt), HTML)
            if not _new_account_ok(scope):
                return await _send(send, 429, _signup_page(nxt, TOO_MANY_NEW, form), HTML)
            try:
                u = await asyncio.to_thread(accounts.sign_up, form.get("email", ""), form.get("name", ""), form.get("new_password", ""),
                                            by=_password_by(form))
            except accounts.AccountError as e:
                return await _send(send, 400, _signup_page(nxt, str(e), form), HTML)
            return await go(nxt, await _new_account_cookie(scope, u, form))

        if path.startswith("/join/"):
            token = path[len("/join/"):]
            if not post:
                if not accounts.invite_valid(token):
                    return await _send(send, 410, _join_page(token, "This invite link has expired or was already used. Ask for a new one."), HTML)
                return await _send(send, 200, _join_page(token), HTML)
            try:
                u = await asyncio.to_thread(accounts.accept_invite, token, form.get("email", ""), form.get("name", ""), form.get("new_password", ""),
                                            by=_password_by(form))
            except accounts.AccountError as e:
                return await _send(send, 400, _join_page(token, str(e), form), HTML)
            return await go("/", await _new_account_cookie(scope, u, form))

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
                return await _send(send, 401, _setup_page(nxt, "The server password is wrong. If you lost it, set a new one on the "
                                                                "server, then try again.", form), HTML)
            try:
                u = await asyncio.to_thread(accounts.create_owner, form.get("email", ""), form.get("name", ""), form.get("new_password", ""),
                                            by=_password_by(form))
            except accounts.AccountError as e:
                return await _send(send, 400, _setup_page(nxt, str(e), form), HTML)
            if form.get("open_signup") == "on":
                await asyncio.to_thread(accounts.set_open_signup, True)
            return await go(nxt, await _new_account_cookie(scope, u, form), _clear(COOKIE))

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
                await asyncio.to_thread(accounts.set_password, u["id"], form.get("new_password", ""), None, "owner")
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
            if current_user(scope, m) is not None:
                return await go(nxt)  # already signed in on this browser: straight back to work
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
        me = current_user(scope) if q.get("keep") else None
        keep = me["id"] if me and me.get("tester") else ""
        url, cookie = oauth.start(_request_base(scope) + "/auth/google/callback", nxt, q.get("invite", "")[:200], keep)
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
    if st.get("k"):  # an early-access tester keeps their account with this Google account (accounts.keep_tester)
        me = current_user(scope)
        back = _safe_next(st.get("n") or "/")
        if not me or me["id"] != st["k"]:
            return await _send(send, 403, notice_page("Could not keep your account", "Open CAD Automation in the browser you "
                                                      "used with the access code, then try again.", "This browser is signed in "
                                                      "to a different account.", href=back), HTML + [(b"set-cookie", clear)])
        try:
            if not verified:
                raise accounts.AccountError("Your Google email is not verified.")
            await asyncio.to_thread(accounts.keep_tester, me["id"], info["email"], info.get("name") or "", None, info["sub"])
        except accounts.AccountError as e:
            return await _send(send, 409, notice_page("Could not keep your account", "You are still signed in, in this "
                                                      "browser.", str(e), "Back to CAD Automation", back), HTML + [(b"set-cookie", clear)])
        return await go(back, clear)
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
