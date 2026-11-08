"""FastAPI server for OpenSketch, the connector between AI apps and SOLIDWORKS: the signed-in app (app_pages.py) where a
person sets it up, sign-in (accounts, Google, OAuth for AI apps; auth.py, mcpauth.py), the MCP endpoint
(mcp_server.py, the sw_ tools), and the link the SOLIDWORKS add-in polls (swbridge.py)."""

from __future__ import annotations

import base64
import gzip
import hashlib
import json
import os
import time
import zlib
from contextlib import asynccontextmanager
from pathlib import Path

import anyio
from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.exception_handlers import http_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.datastructures import Headers

from . import artifacts, auth, brand, cadworker, canonical, mcp_server, store, uploads

STATIC = Path(__file__).parent / "static"


def _commit() -> str:
    """The git commit this server runs (OPENSKETCH_VERSION when there is no git, e.g. a Docker image)."""
    import subprocess
    try:
        return subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=Path(__file__).parent, capture_output=True,
                              text=True, timeout=5).stdout.strip() or os.environ.get("OPENSKETCH_VERSION", "dev")
    except Exception:
        return os.environ.get("OPENSKETCH_VERSION", "dev")


VERSION = _commit()


@asynccontextmanager
async def lifespan(_app):
    _warm_owner()  # CAD runs in worker processes, one per person (cadworker.py): start the owner's now
    try:
        async with mcp_server.lifespan_context():
            yield
    finally:
        cadworker.shutdown()


def _warm_owner() -> None:
    try:
        from . import accounts
        owner = next((u for u in accounts.list_users() if u.get("role") == "owner"), None)
    except Exception:
        owner = None
    cadworker.reserve_for(owner["id"] if owner else None)  # newcomers never take the owner's last worker place
    cadworker.lane_for(owner["id"] if owner else None, "agent").warm()  # the sw_ tools' CAD worker

class _BodyTooBig(HTTPException):
    def __init__(self, cap: int):
        super().__init__(413, f"This request is too big (more than {cap / 2**20:.0f} MB)." if cap >= 2**20
                         else "This request is too big.")


BODY_MAX = 68 * 2**20                 # an MCP call with a 32 MiB file as base64, or a file from the add-in
BODY_SMALL = 64 * 1024                # sign-in forms, OAuth, everything that is not /api/ or /mcp/
OWN_BODY_LIMIT = ("/mcp/uploads/", "/mcp/sw/file", "/v2/device/file")  # streamed to their own, larger caps


class BodyLimit:
    """Refuses a request body over the size its path allows before anything reads it (sign-in, JSON parsing, the
    routes): a Content-Length over it gets 413 at once, a body without one is counted as it arrives and stopped at
    the limit. Without this one anonymous POST of a gigabyte to /oauth/token filled the 2 GB machine's memory."""

    def __init__(self, app):
        self.app = app

    @staticmethod
    def cap(path: str) -> int | None:
        if path.startswith(OWN_BODY_LIMIT):
            return None
        return BODY_MAX if path.startswith(("/api/", "/mcp", "/solidworks/mcp", "/v2/device/")) else BODY_SMALL

    async def __call__(self, scope, receive, send):
        cap = self.cap(scope.get("path", "")) if scope["type"] == "http" else None
        if cap is None:
            return await self.app(scope, receive, send)
        try:
            declared = int(dict(scope.get("headers") or []).get(b"content-length", b"0") or 0)
        except ValueError:
            declared = 0
        if declared > cap:
            return await self._refuse(send, cap)
        seen, started = 0, False

        async def limited():
            nonlocal seen
            message = await receive()
            if message["type"] == "http.request":
                seen += len(message.get("body", b""))
                if seen > cap:
                    raise _BodyTooBig(cap)  # FastAPI answers 413; anything else reading the body stops here
            return message

        async def tracked(message):
            nonlocal started
            if message["type"] == "http.response.start":
                started = True
            await send(message)

        try:
            await self.app(scope, limited, tracked)
        except _BodyTooBig:
            if started:
                raise
            await self._refuse(send, cap)

    @staticmethod
    async def _refuse(send, cap):
        exc = _BodyTooBig(cap)
        body = json.dumps({"error": exc.detail, "detail": exc.detail}).encode()
        await send({"type": "http.response.start", "status": 413,
                    "headers": [(b"content-type", b"application/json"), (b"content-length", str(len(body)).encode()),
                                (b"connection", b"close")]})
        await send({"type": "http.response.body", "body": body})


class RequestLog:
    """Logs requests that failed on the server (5xx) or took long, with who asked, so a problem on the hosted
    server leaves a trace (uvicorn's access log is off: one line per request is too much on a small machine).
    Streams and long polls are left out of the slow ones; paths that carry a secret are cut to their first part."""

    SLOW = 5.0
    LONG = ("/mcp/sw/next",)

    def __init__(self, app):
        self.app = app

    @staticmethod
    def _path(path: str) -> str:
        if path.startswith(("/api/", "/healthz")) or path.count("/") < 2:
            return path
        return "/" + path.split("/")[1] + "/..."  # /mcp/<key>, /join/<invite>, /review/<token>...

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            return await self.app(scope, receive, send)
        t = time.monotonic()
        status = [0]

        async def send_and_note(msg):
            if msg["type"] == "http.response.start":
                status[0] = msg["status"]
            await send(msg)
        try:
            await self.app(scope, receive, send_and_note)
        except Exception:
            status[0] = status[0] or 500
            raise
        finally:
            took = time.monotonic() - t
            path = scope.get("path", "")
            if status[0] >= 500 or (took > self.SLOW and status[0] and not path.startswith(self.LONG)):
                user = (scope.get("state") or {}).get("user") if isinstance(scope.get("state"), dict) else None
                who = f" (person {user['id']})" if isinstance(user, dict) and user.get("id") else ""
                print(f"OpenSketch request: {scope.get('method')} {self._path(path)} -> {status[0]} in {took:.1f} s{who}",
                      flush=True)


def _inline_hash(tag: str) -> str:
    body = tag.removeprefix("<script>").removesuffix("</script>")
    return "'sha256-" + base64.b64encode(hashlib.sha256(body.encode()).digest()).decode() + "'"


# Every page runs only the scripts this server wrote: /ui/app.js and the two inline scripts, by their hashes. Under
# bizomat.ai the BIZOMAT website and Project Management share this origin, so a page here must never run a script
# from anywhere else. Style attributes need 'unsafe-inline'. Forms are not limited: the consent page's answer
# redirects to the AI app's own address.
PAGE_CSP = ("default-src 'self'; script-src 'self' " + " ".join(_inline_hash(t) for t in (brand.MENU_SCRIPT, auth.SHOW_SCRIPT))
            + "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';"
            " object-src 'none'; base-uri 'self'; frame-ancestors 'none'")


class PagePolicy:
    """ASGI middleware: every HTML answer gets PAGE_CSP unless it set its own, and every answer nosniff."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope.get("type") != "http":
            return await self.app(scope, receive, send)

        async def with_policy(message):
            if message["type"] == "http.response.start":
                headers = list(message.get("headers", []))
                names = {k.lower() for k, _ in headers}
                ctype = next((v for k, v in headers if k.lower() == b"content-type"), b"")
                if ctype.split(b";")[0].strip().lower() == b"text/html" and b"content-security-policy" not in names:
                    headers.append((b"content-security-policy", PAGE_CSP.encode()))
                if b"x-content-type-options" not in names:
                    headers.append((b"x-content-type-options", b"nosniff"))
                message = dict(message, headers=headers)
            await send(message)

        return await self.app(scope, receive, with_policy)


app = FastAPI(title="BIZOMAT CAD Automation", lifespan=lifespan, docs_url=None, redoc_url=None)  # /docs is the documentation page
app.add_middleware(auth.PasswordGate)
app.add_middleware(RequestLog)
app.add_middleware(BodyLimit)  # before the sign-in gate reads anything
app.add_middleware(PagePolicy)  # the sign-in gate's pages and the app's alike
app.add_middleware(canonical.CanonicalHost)  # outermost: an old host name is sent to the public address first


NOT_FOUND_MACHINE = ("/api/", "/mcp", "/solidworks/mcp", "/v2/", "/oauth/", "/.well-known/", "/healthz")


@app.exception_handler(StarletteHTTPException)
async def _http_error(request: Request, exc: StarletteHTTPException):
    """A browser asking for a page that does not exist gets the branded 404 page; everything else (API, MCP, the
    device and add-in links) keeps FastAPI's JSON answer."""
    if (exc.status_code == 404 and request.method in ("GET", "HEAD") and "text/html" in request.headers.get("accept", "")
            and not request.url.path.startswith(NOT_FOUND_MACHINE)):
        from . import site
        signed_in = auth.mode(request.scope) == "open" or getattr(request.state, "user", None) is not None
        return Response(site.not_found(signed_in, _base(request)), status_code=404, media_type="text/html; charset=utf-8",
                        headers={"Cache-Control": "no-store"})
    return await http_exception_handler(request, exc)


@app.exception_handler(store.StorageError)
async def _storage_full(_request: Request, exc: store.StorageError):
    """No room on the data disk: a plain message, nothing written."""
    return JSONResponse({"error": str(exc)}, status_code=exc.status)


@app.get("/healthz", include_in_schema=False)
async def healthz():
    """Asked every few seconds by the supervisor (python -m opensketch --supervise), which restarts the server when
    this stops answering. It needs the event loop and one free worker thread, like every other request."""
    await run_in_threadpool(lambda: None)
    return {"ok": True, "version": VERSION}



def _base(request: Request) -> str:
    return auth.public_url(dict(request.headers))


def _mcp_base(request: Request) -> str:
    """The connector address AI apps are given: OPENSKETCH_MCP_URL when it is an https address ending in /mcp (on
    Cloudflare, https://mcp.bizomat.ai/mcp: the MCP server's own host), else the public address followed by /mcp.
    The other addresses keep working for apps connected with them (canonical.py)."""
    v = os.environ.get("OPENSKETCH_MCP_URL", "").strip().rstrip("/")
    if v.startswith("https://") and v.endswith(mcp_server.PATHS[0]) and " " not in v:
        return v
    return _base(request) + mcp_server.PATHS[0]


def _user(request: Request) -> dict | None:
    return getattr(request.state, "user", None)


def _owner(request: Request) -> dict:
    u = _user(request)
    if not u or u.get("role") != "owner" or u.get("legacy"):
        raise HTTPException(403, "Only the owner can do this.")
    return u


@app.get("/api/account")
def api_account(request: Request):
    """Who is signed in, for the account menu."""
    from . import accounts
    u = _user(request)
    m = auth.mode(request.scope)
    from . import oauth
    out = {"mode": m, "user": u, "can_setup": m in ("open", "setup"),
           "google": oauth.enabled(), **accounts.settings()}
    if u and u.get("role") == "owner" and m == "accounts":
        out["users"] = accounts.list_users()
        out["invites"] = accounts.list_invites()
        out["pending_invites"] = len(out["invites"])
        out["access"] = dict(accounts.access_settings(), testers=len(accounts.tester_ids()),
                             link=f"{_base(request)}/access")
    return out


class AccountUpdate(BaseModel):
    name: str | None = None
    current_password: str | None = None
    new_password: str | None = None


@app.post("/api/account")
def api_account_update(req: AccountUpdate, request: Request):
    from . import accounts
    u = _user(request)
    if not u or u.get("legacy"):
        return JSONResponse({"error": "Create an account first."}, status_code=400)
    try:
        if req.new_password:
            accounts.set_password(u["id"], req.new_password, req.current_password or "")
        if req.name:
            accounts.rename(u["id"], req.name)
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return {"user": accounts.get(u["id"]), "signed_out": bool(req.new_password)}


@app.get("/api/account/new-password")
def api_new_password(request: Request):
    """The suggested password this browser's new account kept, shown once on Home after sign-up (auth.hold_new_password).
    Kept in memory for 30 minutes at most; the account itself stores only the one-way hash."""
    return {"password": auth.new_password_for(request.scope)}


@app.delete("/api/account/new-password")
def api_new_password_seen(request: Request):
    auth.new_password_for(request.scope, drop=True)
    return {"ok": True}


class KeepWork(BaseModel):
    name: str | None = None
    email: str
    password: str


@app.post("/api/account/keep")
def api_account_keep(req: KeepWork, request: Request):
    """Early access: the tester adds an email and password to their account, so they can sign in again after
    signing out. They stay a tester."""
    from . import accounts
    u = _user(request)
    if not u or not u.get("tester"):
        return JSONResponse({"error": "Only early-access accounts need this."}, status_code=400)
    try:
        return {"user": accounts.keep_tester(u["id"], req.email, req.name or "", req.password)}
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)


class AccountSettings(BaseModel):
    open_signup: bool | None = None
    access_code: str | None = None  # early access: the code people type to skip sign-up
    access_on: bool | None = None


@app.post("/api/account/settings")
def api_account_settings(req: AccountSettings, request: Request):
    """Owner: let anyone create an account (email or Google), or keep the server invite-only; the early-access code
    (testers skip sign-up)."""
    from . import accounts
    _owner(request)
    out = {}
    if req.open_signup is not None:
        out.update(accounts.set_open_signup(req.open_signup))
    if req.access_code is not None or req.access_on is not None:
        try:
            out["access"] = dict(accounts.set_access(req.access_code, req.access_on), testers=len(accounts.tester_ids()),
                                 link=f"{_base(request)}/access")
        except accounts.AccountError as e:
            return JSONResponse({"error": str(e)}, status_code=400)
    return out or accounts.settings()


@app.delete("/api/account/testers")
def api_remove_testers(request: Request):
    """Owner: remove every Internal tester account (early access). Their connected AI apps stop working too."""
    from . import accounts, mcpauth
    _owner(request)
    gone = accounts.remove_testers()
    for uid in gone:
        mcpauth.drop_user(uid)
        _forget(uid)
    return {"removed": len(gone)}


def _forget(uid: str) -> None:
    """A removed account's SOLIDWORKS link is closed."""
    from . import swbridge
    try:
        swbridge.drop(uid, "closed")
    except Exception:
        pass


def _google_redirect(request: Request) -> str:
    return auth._request_base(request.scope) + "/auth/google/callback"


@app.get("/api/account/google")
def api_google_get(request: Request):
    """Owner: Sign in with Google settings (the address to give Google; never the secret)."""
    from . import oauth
    _owner(request)
    return oauth.public(_google_redirect(request))


class GoogleSetup(BaseModel):
    client_id: str
    client_secret: str


@app.post("/api/account/google")
def api_google_set(req: GoogleSetup, request: Request):
    """Owner: turn on Sign in with Google with a Web application OAuth client from Google Cloud."""
    from . import oauth
    _owner(request)
    if (oauth.client() or ("", "", ""))[2] == "server":
        return JSONResponse({"error": "Google sign-in is set on the server (GOOGLE_CLIENT_ID). Change it there."}, status_code=400)
    try:
        oauth.save(req.client_id, req.client_secret, _google_redirect(request))
    except oauth.SetupError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return oauth.public(_google_redirect(request))


@app.delete("/api/account/google")
def api_google_off(request: Request):
    from . import oauth
    _owner(request)
    oauth.remove()
    return oauth.public(_google_redirect(request))


class InviteRequest(BaseModel):
    note: str | None = None  # who it is for ("for Alex"), shown in People on this server


@app.post("/api/account/invites")
def api_invite(request: Request, req: InviteRequest | None = None):
    from . import accounts
    u = _owner(request)
    token = accounts.create_invite(u["id"], (req.note if req else "") or "")
    return {"url": f"{_base(request)}/join/{token}", "days": accounts.INVITE_DAYS, "invites": accounts.list_invites()}


@app.get("/api/account/invites")
def api_invites(request: Request):
    """Owner: invite links not used yet (never the links themselves: only their SHA-256 is kept)."""
    from . import accounts
    _owner(request)
    return {"invites": accounts.list_invites()}


@app.delete("/api/account/invites/{invite_id}")
def api_invite_revoke(invite_id: str, request: Request):
    """Owner: an invite link stops working at once."""
    from . import accounts
    _owner(request)
    if not accounts.revoke_invite(invite_id):
        raise HTTPException(404, "No such invite. It may have been used or expired.")
    return {"invites": accounts.list_invites()}


@app.delete("/api/account/users/{user_id}")
def api_remove_user(user_id: str, request: Request):
    from . import accounts
    _owner(request)
    try:
        accounts.remove(user_id, "")
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    from . import mcpauth
    mcpauth.drop_user(user_id)  # their connected AI apps stop working too
    _forget(user_id)
    for d in devicebridge.devices_for({"id": user_id}):  # and their paired computers are cut off at once
        devicebridge.revoke_device({"id": user_id}, d["id"], "This computer's account was removed from CAD Automation.")
    return {"removed": user_id}


class NewPerson(BaseModel):
    email: str
    name: str | None = None
    password: str


@app.post("/api/account/users")
def api_add_user(req: NewPerson, request: Request):
    """Owner (Admin page): add a person with a password the owner chose."""
    from . import accounts
    _owner(request)
    try:
        return {"user": accounts.create_member(req.email, req.name or "", req.password)}
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)


class NewPassword(BaseModel):
    password: str


@app.post("/api/account/users/{user_id}/password")
def api_set_user_password(user_id: str, req: NewPassword, request: Request):
    """Owner (Admin page): set someone's password. They are signed out everywhere and their connected AI apps must
    sign in again. The owner changes their own password in Settings (it needs the current one)."""
    from . import accounts
    me = _owner(request)
    target = accounts.get_any(user_id)
    if target is None:
        raise HTTPException(404, "No such account.")
    if target["role"] == "owner" or user_id == me["id"]:
        return JSONResponse({"error": "Change your own password in Settings."}, status_code=400)
    try:
        accounts.set_password(user_id, req.password, by="owner")
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    return {"ok": True}


class Suspend(BaseModel):
    suspended: bool


@app.post("/api/account/users/{user_id}/suspend")
def api_suspend_user(user_id: str, req: Suspend, request: Request):
    """Owner (Admin page): suspend a person or let them back in. While suspended they cannot sign in, and their AI
    apps, private address, add-in key and paired computers are refused at once (accounts.get treats the account as
    gone); nothing is deleted, so resuming needs no new setup."""
    from . import accounts
    _owner(request)
    try:
        u = accounts.set_suspended(user_id, req.suspended)
    except accounts.AccountError as e:
        return JSONResponse({"error": str(e)}, status_code=400)
    if req.suspended:
        _forget(user_id)
        devicebridge.suspend_person(user_id)  # held long polls and waiting commands end now, not at the next request
    return {"user": u}


@app.get("/api/admin/people")
def api_admin_people(request: Request):
    """Owner (Admin page): everyone with an account, their computers and connected AI apps; invites and sign-up settings."""
    from . import accounts, mcpauth
    _owner(request)
    people = []
    for u in accounts.list_users():
        devs = devicebridge.list_devices({"id": u["id"]})
        people.append(dict(u, computers=len(devs), online=sum(1 for d in devs if d["online"]),
                           apps=[g["name"] for g in mcpauth.grants_for(u["id"])]))
    return {"people": people, "invites": accounts.list_invites(), "settings": accounts.settings(), "min_password": accounts.MIN_PASSWORD}



@app.get("/mcp/artifacts/{artifact_id}/{filename}")
def api_artifact(artifact_id: str, filename: str, expires: str = "", signature: str = ""):
    """Artifact-scoped signed capability: no login cookie or MCP credential in the URL."""
    try:
        path, info = artifacts.resolve(artifact_id, filename, expires, signature)
    except artifacts.ArtifactError:
        raise HTTPException(404, "No such artifact") from None
    return FileResponse(path, filename=info["filename"], media_type=info["media_type"],
                        headers={"Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
                                 "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox"})


_UPLOAD_HEADERS = {"Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff"}


def _upload_reply(body: dict, status: int = 200) -> JSONResponse:
    return JSONResponse(body, status_code=status, headers=_UPLOAD_HEADERS)


@app.api_route("/mcp/uploads/{upload_id}", methods=["PUT", "POST"])
async def api_upload(upload_id: str, request: Request, expires: str = "", signature: str = ""):
    """A file for sw_import(upload_id=...), sent to the one-time link from the request_upload MCP tool.
    The body is the file's bytes (curl -T file '<link>'); Content-Encoding: gzip (or X-OpenSketch-Gzip: 1) is
    unzipped on the way in, bounded. Same 32 MiB cap as base64 imports. No sign-in: the link is the key."""
    cap = mcp_server.MAX_IMPORT_BYTES
    try:
        uploads.check_link(upload_id, expires, signature)
    except uploads.UploadError as exc:
        return _upload_reply({"error": str(exc)}, exc.status)
    if request.headers.get("content-type", "").lower().startswith("multipart/"):
        return _upload_reply({"error": "Send the file's bytes as the request body (curl -T file '<link>'), not a form."}, 400)
    gz = (request.headers.get("content-encoding", "").strip().lower() == "gzip"
          or request.headers.get("x-opensketch-gzip") == "1")
    too_big = {"error": f"The file is bigger than {cap // 2**20} MiB, the import limit."}
    try:
        declared = int(request.headers.get("content-length", "0") or 0)
    except ValueError:
        declared = 0
    if declared > cap + 2**20:  # a gzip body of incompressible data is a little bigger than the file
        return _upload_reply(too_big, 413)
    try:
        out = uploads.begin(upload_id)
    except uploads.UploadError as exc:
        return _upload_reply({"error": str(exc)}, exc.status)
    digest, size, wire, ok = hashlib.sha256(), 0, 0, False
    unzip = zlib.decompressobj(16 + zlib.MAX_WBITS) if gz else None
    space = uploads.room()  # the upload area's share of the disk, counted as the file arrives
    full = {"error": "The upload area is full. Try again in a few minutes."}

    def keep(data: bytes) -> bool:
        nonlocal size
        size += len(data)
        if size > cap:
            return False
        digest.update(data)
        out.write(data)
        return True

    try:
        try:
            async for chunk in request.stream():
                wire += len(chunk)
                if wire > cap + 2**20:
                    return _upload_reply(too_big, 413)
                if unzip is None:
                    if not keep(chunk):
                        return _upload_reply(too_big, 413)
                    if size > space:
                        return _upload_reply(full, 507)
                    continue
                piece = unzip.decompress(chunk, cap - size + 1)  # bounded: a small gzip that unpacks to gigabytes stops here
                if not keep(piece) or unzip.unconsumed_tail:
                    return _upload_reply(too_big, 413)
                if size > space:
                    return _upload_reply(full, 507)
            if unzip is not None:
                if not keep(unzip.flush()):
                    return _upload_reply(too_big, 413)
                if not unzip.eof or unzip.unused_data:
                    return _upload_reply({"error": "The gzip body arrived damaged (or holds more than one stream). Send it again."}, 400)
        except zlib.error:
            return _upload_reply({"error": "The gzip body arrived damaged. Send it again, or send the file without gzip."}, 400)
        except Exception:  # the client went away mid-upload
            return _upload_reply({"error": "The upload did not finish. Send it again."}, 400)
        if size == 0:
            return _upload_reply({"error": "The upload is empty. Send the file's bytes as the request body."}, 400)
        out.close()
        try:
            body = uploads.finish(upload_id, size, digest.hexdigest())
        except uploads.UploadError as exc:
            return _upload_reply({"error": str(exc)}, exc.status)
        ok = True
        return _upload_reply(body, 201)
    finally:
        out.close()
        if not ok:
            uploads.abort(upload_id)


# ----------------------------------------------------------------------------- SOLIDWORKS add-in link
# See swbridge.py. The add-in on the user's PC calls these with its SOLIDWORKS key (Authorization: Bearer oss_...);
# they are outside sign-in like /mcp/ (no cookies; the key is the credential and reaches nothing else).

def _sw_person(request: Request):
    from . import swbridge
    authz = request.headers.get("authorization", "")
    tok = authz[7:].strip() if authz[:7].lower() == "bearer " else ""
    ok, user = swbridge.resolve(tok)
    if not ok:
        page = f"your CAD Automation dashboard, {auth.public_url(dict(request.headers))}"
        if swbridge.retired(tok):
            raise HTTPException(401, f"A new SOLIDWORKS key was made, so this one stopped working. Paste the new key from {page}")
        raise HTTPException(401, f"This SOLIDWORKS key is not valid. Copy the key again from {page}")
    return user


def _sw_error(exc: Exception, status: int) -> JSONResponse:
    body = {"error": str(exc)}
    if getattr(exc, "reason", None):
        body["reason"] = exc.reason
    return JSONResponse(body, status_code=status, headers={"Cache-Control": "no-store"})


@app.post("/mcp/sw/hello")
async def sw_hello(request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        info = await request.json()
    except ValueError:
        info = {}
    return JSONResponse(swbridge.hello(user, info if isinstance(info, dict) else {}), headers={"Cache-Control": "no-store"})


@app.get("/mcp/sw/next")
async def sw_next(request: Request, session: str = "", wait: float = 25):
    from . import swbridge
    user = _sw_person(request)
    try:
        cmd = await swbridge.next_command(user, session, wait)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    if cmd is None:
        return Response(status_code=204, headers={"Cache-Control": "no-store"})
    return JSONResponse(cmd, headers={"Cache-Control": "no-store"})


@app.post("/mcp/sw/result")
async def sw_result(request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        body = await request.json()
        if not isinstance(body, dict):
            raise ValueError
    except ValueError:
        return _sw_error(ValueError("The result must be a JSON object."), 400)
    try:
        swbridge.put_result(user, str(body.get("session", "")), body)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    return {"ok": True}


@app.post("/mcp/sw/file")
async def sw_file(request: Request, session: str = "", id: str = "", name: str = ""):
    """A file SOLIDWORKS made for a command (STEP, STL, PNG...): the body is its bytes, optionally gzipped
    (X-OpenSketch-Gzip: 1), unzipped bounded."""
    from . import swbridge
    user = _sw_person(request)
    cap = swbridge.MAX_FILE
    raw = bytearray()
    async for chunk in request.stream():
        raw += chunk
        if len(raw) > cap + 2**20:
            return _sw_error(ValueError("The file is too big (128 MiB at most)."), 413)
    data = bytes(raw)
    del raw
    if request.headers.get("x-opensketch-gzip") == "1" or request.headers.get("content-encoding", "").lower() == "gzip":
        def gunzip(body: bytes):  # in a thread: unzipping 100 MB on the event loop stops every request for seconds
            unzip = zlib.decompressobj(16 + zlib.MAX_WBITS)
            try:
                out = unzip.decompress(body, cap + 1)
            except zlib.error:
                return None, "damaged"
            if len(out) > cap or unzip.unconsumed_tail:
                return None, "big"
            return (out, None) if unzip.eof else (None, "damaged")
        data, why = await run_in_threadpool(gunzip, data)
        if why == "big":
            return _sw_error(ValueError("The file is too big (128 MiB at most)."), 413)
        if why:
            return _sw_error(ValueError("The gzip body arrived damaged."), 400)
    try:
        return swbridge.put_file(user, session, id, name, data)
    except swbridge.Gone as exc:
        return _sw_error(exc, 409)
    except swbridge.BridgeError as exc:
        return _sw_error(exc, 400)


@app.get("/mcp/sw/blob/{blob_id}")
def sw_blob(blob_id: str, request: Request):
    from . import swbridge
    user = _sw_person(request)
    try:
        data, filename = swbridge.blob(user, blob_id)
    except swbridge.BridgeError:
        raise HTTPException(404, "No such file") from None
    return Response(data, media_type="application/octet-stream",
                    headers={"Cache-Control": "no-store", "Content-Disposition": f'attachment; filename="{filename}"'})


SW_DOWNLOAD = Path(os.environ.get("OPENSKETCH_SW_ZIP", str(Path(__file__).parent / "static" / "downloads" / "OpenSketch-SOLIDWORKS.zip")))


@app.get("/api/sw")
def api_sw(request: Request):
    """This person's SOLIDWORKS key, the server address the add-in needs, whether SOLIDWORKS is connected now, and
    whether the add-in download is on this server."""
    from . import swbridge
    u = _user(request)
    return {"key": swbridge.key_for(u), "server": auth.public_url(dict(request.headers)),
            "status": swbridge.status(u), "download": SW_DOWNLOAD.is_file()}


@app.post("/api/sw/key")
def api_sw_key(request: Request):
    from . import swbridge
    return {"key": swbridge.new_key(_user(request))}


@app.get("/api/sw/download")
def api_sw_download():
    if not SW_DOWNLOAD.is_file():
        raise HTTPException(404, "The SOLIDWORKS add-in package is not on this server.")
    return FileResponse(SW_DOWNLOAD, filename="BIZOMAT-CAD-Automation-SOLIDWORKS-addin.zip", media_type="application/zip",
                        headers={"Cache-Control": "no-cache"})


# The Windows installer (CADOS for SOLIDWORKS, an MSI built by solidworks.yml on Windows). Public: it holds no data.
# public, on bizomat.ai (the website Worker serves /downloads/ from R2; the GitHub repositories and releases are private)
INSTALLER_DEFAULT = "https://bizomat.ai/downloads/cad/BIZOMAT-CAD-Automation-x64.msi"


def local_installer() -> Path | None:
    """An installer the operator put in this server's own data folder (<data>/downloads/BIZOMAT-CAD-Automation-x64.msi,
    on Fly the volume at /data): served by the server itself, for as long as bizomat.ai does not serve /downloads/
    (the website on Fly has no such route; the Cloudflare Worker has). Never a file the server writes."""
    p = store.data_dir() / "downloads" / brand.INSTALLER_NAME
    return p if p.is_file() else None


def installer_url() -> str:
    """Where "Download for SOLIDWORKS" goes: OPENSKETCH_INSTALLER_URL, else the release this server publishes to
    its computers (bridge-release.json, the same file the Companion's updates come from), else the newest build.
    (An installer in the data folder, local_installer, is served before the last two.)"""
    env = os.environ.get("OPENSKETCH_INSTALLER_URL", "").strip()
    if env.startswith("https://"):
        return env
    try:
        rel = devicebridge.release_manifest()
        if rel and str(rel.get("msi_url", "")).startswith("https://"):
            return rel["msi_url"]
    except Exception:
        pass
    return INSTALLER_DEFAULT


def _explicit_installer_url() -> bool:
    return os.environ.get("OPENSKETCH_INSTALLER_URL", "").strip().startswith("https://")


_SUMS: dict = {}


def _installer_sha256(p: Path) -> str:
    st = p.stat()
    key = (str(p), st.st_size, st.st_mtime_ns)
    if key not in _SUMS:
        h = hashlib.sha256()
        with open(p, "rb") as f:
            for block in iter(lambda: f.read(1 << 20), b""):
                h.update(block)
        _SUMS.clear()
        _SUMS[key] = h.hexdigest()
    return _SUMS[key]


@app.get("/download/solidworks")
def download_solidworks():
    # a plain def: FastAPI runs it in a thread, so reading the file never holds the event loop
    local = None if _explicit_installer_url() else local_installer()
    if local:
        return FileResponse(local, filename=brand.INSTALLER_NAME, media_type="application/x-msi",
                            headers={"Cache-Control": "private, no-cache", "X-Content-SHA256": _installer_sha256(local)})
    return RedirectResponse(installer_url(), status_code=302, headers={"Cache-Control": "no-store"})


@app.get("/download/solidworks.sha256")
def download_solidworks_sha256():
    """The SHA-256 of the installer "Download for SOLIDWORKS" gives, in sha256sum's format."""
    local = None if _explicit_installer_url() else local_installer()
    if local:
        return Response(f"{_installer_sha256(local)}  {brand.INSTALLER_NAME}\n", media_type="text/plain; charset=utf-8",
                        headers={"Cache-Control": "private, no-cache"})
    return RedirectResponse(brand.checksum_url(), status_code=302, headers={"Cache-Control": "no-store"})


# ----------------------------------------------------------------------------- registered computers
# devicebridge.py: pairing, the Companion's signed link (/v2/...), the person's computers (/api/devices)

from . import devicebridge  # noqa: E402

app.include_router(devicebridge.router)


# ----------------------------------------------------------------------------- the home page

@app.post("/api/connect/new_address")
def api_connect_new_address(request: Request):
    """A new private connector address (/mcp/<key>) for the signed-in person: the old one stops working at once."""
    from . import accounts
    u = _user(request)
    if not u or u.get("legacy"):
        return JSONResponse({"error": "Create an account first."}, status_code=400)
    accounts.new_mcp_address(u["id"])
    return {"mcp_url": f"{_mcp_base(request)}/{auth.mcp_token_for(u)}"}


PAGE_HEADERS = {"Cache-Control": "no-store", "X-Frame-Options": "DENY", "Referrer-Policy": "same-origin"}
PUBLIC_HEADERS = {"Cache-Control": "no-cache", "X-Frame-Options": "DENY", "Referrer-Policy": "strict-origin-when-cross-origin"}


def _is_owner(request: Request) -> bool:
    u = _user(request)
    return bool(u and u.get("role") == "owner" and not u.get("legacy"))


async def _app_page(request: Request, name: str) -> Response:
    """One section of the signed-in app (app_pages.py); the sign-in gate sends visitors to /login first. The owner
    also sees the Admin section."""
    from . import app_pages
    return await _text_page(request.scope, app_pages.PAGES[name](_base(request), _is_owner(request)), "text/html; charset=utf-8",
                            PAGE_HEADERS)


@app.get("/admin")
async def admin_page(request: Request):
    """The owner's Admin page; anyone else is sent to their Home."""
    if not _is_owner(request):
        return RedirectResponse("/dashboard", status_code=303)
    return await _app_page(request, "admin")


@app.get("/dashboard")
async def solidworks_page(request: Request):
    return await _app_page(request, "home")


@app.get("/assistant")
async def assistant_page(request: Request):
    return await _app_page(request, "assistant")


@app.get("/solidworks")  # was the dashboard's address before it became the home page; now the SOLIDWORKS section
async def solidworks_section(request: Request):
    return await _app_page(request, "solidworks")


@app.get("/tools")
async def tools_page(request: Request):
    return await _app_page(request, "tools")


@app.get("/history")
async def history_page(request: Request):
    return await _app_page(request, "history")


@app.get("/settings")
async def settings_page(request: Request):
    return await _app_page(request, "settings")


def _signed_in(request: Request) -> bool:
    return auth.mode(request.scope) == "open" or _user(request) is not None


@app.get("/overview")
async def overview_page(request: Request):
    """The product page, for everyone (the sign-in gate lets it through)."""
    from . import site
    return await _text_page(request.scope, site.landing(_signed_in(request), _base(request)), "text/html; charset=utf-8", PUBLIC_HEADERS)


@app.get("/docs")
async def docs_page(request: Request):
    """Setup, connection, verification and troubleshooting, for everyone."""
    from . import site
    return await _text_page(request.scope, site.docs(_signed_in(request), _base(request)), "text/html; charset=utf-8", PUBLIC_HEADERS)


@app.get("/api/solidworks")
def api_solidworks(request: Request):
    """Everything the home page shows: the add-in's address and key, whether SOLIDWORKS is connected, the
    connector address for AI apps (and the private one for apps that cannot sign in), the AI apps connected."""
    from . import mcpauth, swbridge
    base = _base(request)
    u = _user(request)
    mcp = _mcp_base(request)
    return {"server": base, "key": swbridge.key_for(u), "status": swbridge.status(u), "download": SW_DOWNLOAD.is_file(),
            "url": mcp, "private_url": f"{mcp}/{auth.mcp_token_for(u)}",
            "signin": auth.mode(request.scope) != "open", "apps": mcpauth.grants_for(u["id"] if u else "local"),
            "user": {"name": u.get("name"), "email": u.get("email"), "password_by": u.get("password_by")}
            if u and not u.get("legacy") else None}


OAUTH_CORS = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Authorization, Content-Type, MCP-Protocol-Version", "Cache-Control": "no-store"}


def _hdrs(request: Request) -> dict:
    return {k.lower(): v for k, v in request.headers.items()}


async def _body_form(request: Request) -> dict:
    from urllib.parse import parse_qs
    raw = await request.body()
    if len(raw) > 20000:
        return {}
    return {k: v[0] for k, v in parse_qs(raw.decode(errors="ignore")).items()}


@app.get("/.well-known/oauth-protected-resource")
@app.get("/.well-known/oauth-protected-resource/mcp")
def oauth_resource(request: Request):
    from . import mcpauth
    return JSONResponse(mcpauth.protected_resource(_hdrs(request)), headers=OAUTH_CORS)


@app.get("/.well-known/oauth-protected-resource/solidworks/mcp")
def oauth_resource_solidworks(request: Request):
    from . import mcpauth
    return JSONResponse(mcpauth.protected_resource(_hdrs(request), "/solidworks/mcp"), headers=OAUTH_CORS)


@app.get("/.well-known/oauth-authorization-server")
@app.get("/.well-known/oauth-authorization-server/mcp")
@app.get("/.well-known/oauth-authorization-server/solidworks/mcp")
def oauth_server(request: Request):
    from . import mcpauth
    return JSONResponse(mcpauth.server_metadata(_hdrs(request)), headers=OAUTH_CORS)


@app.options("/.well-known/{rest:path}")
@app.options("/oauth/{rest:path}")
def oauth_preflight(rest: str):
    return Response(status_code=204, headers=OAUTH_CORS)


@app.post("/oauth/register")
async def oauth_register(request: Request):
    from . import mcpauth
    try:
        meta = await request.json()
    except Exception:
        meta = None
    try:
        out = await run_in_threadpool(mcpauth.register, meta, auth._client(request.scope))
    except mcpauth.OAuthError as e:
        return JSONResponse(e.body(), status_code=e.status, headers=OAUTH_CORS)
    return JSONResponse(out, status_code=201, headers=OAUTH_CORS)


async def _oauth_client_call(request: Request, fn):
    """Token and revoke: limited per address; an app's metadata document (client_id = https URL) is read first in
    mcpauth's own small pool with a deadline, never on a request thread (a slow address cannot use them all up)."""
    from . import mcpauth
    if not mcpauth.token_rate_ok(auth._client(request.scope)):
        raise mcpauth.OAuthError("temporarily_unavailable", "Too many requests from this address. Try again in a minute.", 429)
    form = await _body_form(request)
    await mcpauth.ensure_client(form.get("client_id"))
    if fn is mcpauth.token:
        return await run_in_threadpool(fn, form, request.headers.get("authorization", ""), request.scope)
    return await run_in_threadpool(fn, form, request.headers.get("authorization", ""))


@app.post("/oauth/token")
async def oauth_token(request: Request):
    from . import mcpauth
    try:
        out = await _oauth_client_call(request, mcpauth.token)
    except mcpauth.OAuthError as e:
        extra = {"WWW-Authenticate": 'Basic realm="BIZOMAT CAD Automation"'} if e.status == 401 else {}
        return JSONResponse(e.body(), status_code=e.status, headers={**OAUTH_CORS, **extra})
    return JSONResponse(out, headers={**OAUTH_CORS, "Pragma": "no-cache"})


@app.post("/oauth/revoke")
async def oauth_revoke(request: Request):
    from . import mcpauth
    try:
        await _oauth_client_call(request, mcpauth.revoke)
    except mcpauth.OAuthError as e:
        return JSONResponse(e.body(), status_code=e.status, headers=OAUTH_CORS)
    return JSONResponse({}, headers=OAUTH_CORS)


def _auth_html(body: bytes, status: int = 200) -> Response:
    return Response(body, status_code=status, headers={k.decode(): v.decode() for k, v in auth.HTML})


@app.get("/oauth/authorize")
async def oauth_authorize(request: Request):
    """The consent page an AI app sends the person to (after sign-in, which the gate handles). Every problem is a
    page here, never a redirect (mcpauth.check_authorize)."""
    from . import mcpauth
    h = _hdrs(request)
    try:
        await mcpauth.ensure_client(request.query_params.get("client_id"))
        rec, req = mcpauth.check_authorize(dict(request.query_params), h)
    except mcpauth.OAuthError as e:
        return _auth_html(auth.oauth_problem_page(e.description), 400)
    u = _user(request)
    uid = u["id"] if u else "local"
    return _auth_html(auth.consent_page(rec["name"], req["redirect_uri"], u, mcpauth.sign_request(req, uid),
                                        rec.get("host", "") if rec.get("cimd") else ""))


@app.post("/oauth/authorize")
async def oauth_decide(request: Request):
    from fastapi.responses import RedirectResponse
    from . import mcpauth
    form = await _body_form(request)
    u = _user(request)
    uid = u["id"] if u else "local"
    req = mcpauth.read_request(form.get("req", ""), uid)
    if req is not None:
        try:
            await mcpauth.ensure_client(req["client_id"])
        except mcpauth.OAuthError:
            pass
    if req is None or mcpauth.client(req["client_id"], fetch=False) is None:
        return _auth_html(auth.oauth_problem_page("This page has expired. Start connecting again from your AI app."), 400)
    iss = mcpauth.issuer_for(req.get("resource", ""), _hdrs(request))
    if form.get("action") == "deny":
        return RedirectResponse(mcpauth.with_query(req["redirect_uri"], error="access_denied", state=req["state"] or None,
                                                   iss=iss), status_code=303)
    code = await run_in_threadpool(mcpauth.issue_code, req, uid)
    return RedirectResponse(mcpauth.with_query(req["redirect_uri"], code=code, state=req["state"] or None, iss=iss),
                            status_code=303)


@app.get("/api/account/apps")
def api_apps(request: Request):
    """AI apps this person connected by signing in (Account settings > Connected AI apps)."""
    from . import mcpauth
    u = _user(request)
    return {"apps": mcpauth.grants_for(u["id"] if u else "local")}


@app.delete("/api/account/apps")
def api_apps_disconnect_all(request: Request):
    """Sign every AI app out of this person's account (each has to sign in again)."""
    from . import mcpauth
    u = _user(request)
    mcpauth.drop_user(u["id"] if u else "local")
    return {"apps": []}


@app.delete("/api/account/apps/{grant_id}")
def api_app_disconnect(grant_id: str, request: Request):
    from . import mcpauth
    u = _user(request)
    if not mcpauth.drop_grant(u["id"] if u else "local", grant_id):
        raise HTTPException(404, "No such connection")
    return {"apps": mcpauth.grants_for(u["id"] if u else "local")}


# MCP (Streamable HTTP): /mcp and /solidworks/mcp take a Bearer token from the sign-in above; <path>/<key> is the
# private address (the key in the path). Routed before the static files.
app.router.routes.extend(mcp_server.endpoint().routes())


# ----------------------------------------------------------------------------- pages and static files

NO_CACHE = {"Cache-Control": "no-cache"}
GZIP_STATIC_MIN = 1024
_gz_cache: dict[str, tuple[object, bytes]] = {}  # page -> (its version, gzipped bytes)

def _accepts_gzip(scope) -> bool:
    for part in Headers(scope=scope).get("accept-encoding", "").split(","):
        name, _, params = part.partition(";")
        if name.strip().lower() in ("gzip", "*"):
            q = params.strip().replace(" ", "")
            try:
                return not q.startswith("q=") or float(q[2:]) > 0
            except ValueError:
                return False
    return False


def _gzipped(key: str, version, read) -> bytes:
    hit = _gz_cache.get(key)
    if hit and hit[0] == version:
        return hit[1]
    data = gzip.compress(read(), compresslevel=9, mtime=0)
    if len(_gz_cache) > 512:  # only guards against odd growth
        _gz_cache.clear()
    _gz_cache[key] = (version, data)
    return data


def _etag_matches(scope, etag: str) -> bool:
    tags = Headers(scope=scope).get("if-none-match", "")
    return etag in [t.strip().removeprefix("W/") for t in tags.split(",")]


async def _text_page(scope, body: bytes, media_type: str, headers: dict) -> Response:
    """A page made here: an ETag (304 when unchanged), gzipped when the client takes it."""
    etag = '"' + hashlib.sha256(body).hexdigest()[:24] + '"'
    h = {**headers, "ETag": etag, "Vary": "Accept-Encoding"}
    if _etag_matches(scope, etag):
        return Response(status_code=304, headers=h)
    if len(body) >= GZIP_STATIC_MIN and scope.get("method") == "GET" and _accepts_gzip(scope):
        body = await anyio.to_thread.run_sync(_gzipped, "page:" + etag, etag, lambda: body)
        h.update({"ETag": "W/" + etag, "Content-Encoding": "gzip"})
    return Response(body, media_type=media_type, headers=h)



@app.get("/")
async def index(request: Request):
    """The dashboard for a signed-in person (and on an open server); the product page for a visitor."""
    if _signed_in(request):
        return await solidworks_page(request)
    return await overview_page(request)


STATIC = Path(__file__).parent / "static"


class Files(StaticFiles):
    """The favicon, fonts and the add-in download: revalidated (ETag) so a deploy is picked up at once."""

    async def get_response(self, path, scope):
        res = await super().get_response(path, scope)
        if res.status_code in (200, 304):
            res.headers["Cache-Control"] = "no-cache"
        return res


app.mount("/", Files(directory=STATIC), name="static")
