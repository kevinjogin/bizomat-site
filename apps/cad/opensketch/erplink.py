"""CAD Automation inside BIZOMAT ERP: the engine's side (owner's brief and approved audit of 19 Nov 2026;
docs/ERP-MODULE.md). The screens, accounts, computers, history and exports move into the ERP; the engine (the AI
connector, the computers' gateway, the geometry checks) and SOLIDWORKS stay where they are.

Two directions, no new secret:
  - The ERP calls /api/erp/v1/* here, server to server, with `Authorization: BIZOMAT-ERP <assertion>`: an ES256 JWS
    signed by the ERP's key (its public half at <provider>/api/id/jwks), valid one minute, used once, bound to the
    request's method, path and body, naming the person (their BIZOMAT id, email, name), the company and what they may
    do there (the ERP's central permissions) and the company's fair-use limits.
  - A thread here posts this server's accounts, usage by company, finished runs and checksums to the ERP once a
    minute (<provider>/api/id/cad-sync, this server's BIZOMAT client credentials, as erpstatus.py), and keeps the
    answer in erp_link.json: each account's BIZOMAT account and the companies where it works in the ERP (with whether
    its role there may send work and download files), the company its earlier computers, commands and AI connections
    belong to, each company's limits, whether the old pages open in the ERP (flag cad_redirect) and whether password
    sign-in is retired (flag cad_password_retired). Nothing here acts for an account the ERP did not name.

Contract 2 (owner's approval of 20 Nov 2026, docs/ERP-MODULE.md "Contract 2"): the sync says `contract: 2`; the ERP
then also names companies where the person's role is read only (operate false: refused there, never by person), says
per company whether they may download (export), and takes the downloads made through an AI assistant's links.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import re
import threading
import time
from urllib.parse import urlsplit

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import FileResponse, JSONResponse

from . import store, tenancy

STATE = "erp_link.json"
SYNC_EVERY = 60.0
FIRST = 15.0
TIMEOUT = 15.0
BACKOFF_MAX = 900.0
JWKS_TTL = 600.0
JWKS_RETRY = 30.0
SKEW = 30
MAX_LIFE = 120
MAX_RUNS = 500
MAX_BODY = 64 * 1024
MAX_DOWNLOADS = 500      # downloads through AI assistants' links waiting for the next sync
CONTRACT = 2
FRESH = 15 * 60          # s an ERP answer counts: older, nobody is treated as working inside the ERP
RUN_STATUS = {"succeeded": "done", "failed": "failed", "rejected": "failed", "denied": "failed", "unknown": "failed",
              "cancelled": "cancelled", "expired": "expired"}

_lock = threading.RLock()
_state: dict | None = None
_jwks: dict = {"at": 0.0, "tried": 0.0, "keys": {}}
_jti: dict[str, float] = {}


def _log(msg: str) -> None:
    print(f"CAD Automation ERP link: {msg}", flush=True)


# ----------------------------------------------------------------------------- what the ERP said

def _file():
    return store.data_dir() / STATE


def state() -> dict:
    global _state
    with _lock:
        if _state is None:
            try:
                d = json.loads(_file().read_text())
                _state = d if isinstance(d, dict) else {}
            except (OSError, ValueError):
                _state = {}
            _state.setdefault("accounts", {})
            _state.setdefault("limits", {})
            _state.setdefault("cursor", 0.0)
        return _state


def _save() -> None:
    with _lock:
        d = state()
        tmp = _file().with_suffix(".tmp")
        tmp.write_text(json.dumps(d))
        tmp.replace(_file())


def reset_for_tests() -> None:
    global _state
    with _lock:
        _state = None
        _jwks.update(at=0.0, tried=0.0, keys={})
        _jti.clear()


def fresh() -> bool:
    return time.time() - float(state().get("at") or 0) < FRESH


def account(account_id: str | None) -> dict | None:
    if not account_id or not fresh():
        return None
    return state()["accounts"].get(account_id)


def companies_of(account_id: str | None) -> list[dict]:
    """The companies where this account is inside the ERP, read only included (empty: it works as before, by person)."""
    a = account(account_id)
    return list(a.get("companies") or []) if a else []


def working_companies(account_id: str | None) -> list[dict]:
    """The companies where this account may send work to SOLIDWORKS (its role there is not read only)."""
    return [c for c in companies_of(account_id) if c.get("operate", True)]


def in_erp(account_id: str | None) -> bool:
    return bool(companies_of(account_id))


def _entry(account_id: str | None, company: str | None) -> dict | None:
    return next((c for c in companies_of(account_id) if company and c.get("id") == company), None)


def allowed(account_id: str | None, company: str | None) -> bool:
    """The account may work with CAD Automation in this company (it is there, and its role is not read only)."""
    e = _entry(account_id, company)
    return bool(e) and bool(e.get("operate", True))


def may_export(account_id: str | None, company: str | None) -> bool:
    """The account's role in this company may download CAD files (the company's download setting, brief Part 4)."""
    e = _entry(account_id, company)
    return bool(e) and bool(e.get("export", True))


def password_retired() -> bool:
    """Password sign-in is retired (the ERP's flag cad_password_retired, which acts only once every account here is
    linked to a BIZOMAT account). A stale answer counts for nothing: the server then works as before."""
    return bool(state().get("passwordRetired")) and fresh()


def default_company(account_id: str | None) -> str | None:
    a = account(account_id)
    d = (a or {}).get("default")
    return d if d and allowed(account_id, d) else None


def limits_for(company: str | None) -> dict:
    lim = state()["limits"].get(company or "") or {}
    return dict(tenancy.DEFAULT_LIMITS, **{k: v for k, v in lim.items() if k in tenancy.DEFAULT_LIMITS})


def redirect_on() -> bool:
    return bool(state().get("redirect")) and fresh()


def company_for_connection(account_id: str | None, grant: dict | None) -> str | None:
    """The company an AI request works in (mcp_server.py): None while the account works outside the ERP (as before,
    and after a rollback); else the connection's company, or, for a connection made before (or a private address),
    the person's only company there, which the connection then keeps. ErpError when the person must reconnect."""
    if not in_erp(account_id):
        return None
    co = (grant or {}).get("company")
    if co:
        if allowed(account_id, co):
            return co
        if _entry(account_id, co):
            raise read_only_error(account_id, co)
        raise ErpError(403, "COMPANY_ACCESS", "This AI assistant works in a company where you can no longer use CAD Automation. "
                                              "Disconnect it, connect it again and choose a company.")
    working = working_companies(account_id)
    if not working:
        raise read_only_error(account_id, None)
    d = default_company(account_id) or (working[0]["id"] if len(working) == 1 else None)
    if d:
        if grant and grant.get("id"):
            from . import mcpauth
            mcpauth.set_grant_company(grant["id"], d, only_if_unset=True)
        return d
    raise ErpError(403, "COMPANY_REQUIRED", "CAD Automation now works inside BIZOMAT ERP, by company. Disconnect this AI assistant, "
                                            "connect it again and choose the company it works in.")


def read_only_error(account_id: str | None, company: str | None) -> "ErpError":
    """Refused: the person's role is read only in the company (or in every company where they are inside the ERP)."""
    names = [c.get("name") or "your company" for c in companies_of(account_id) if not company or c.get("id") == company]
    where = names[0] if len(names) == 1 else "your companies"
    return ErpError(403, "READ_ONLY", f"Your role in {where} is read only: you can see CAD Automation's work in BIZOMAT ERP, "
                                      "but not send work to SOLIDWORKS. Ask an administrator of the company for another role.")


def erp_url(path: str = "/erp") -> str:
    """An address in BIZOMAT ERP, on the sign-in provider's own site (https://bizomat.ai/company -> https://bizomat.ai)."""
    from . import bizomat_id
    u = urlsplit(bizomat_id.provider())
    return f"{u.scheme}://{u.netloc}{path}"


# ----------------------------------------------------------------------------- the ERP's assertions

class ErpError(Exception):
    def __init__(self, status: int, code: str, message: str):
        super().__init__(message)
        self.status, self.code, self.message = status, code, message


def jwks_url() -> str:
    from . import bizomat_id
    return bizomat_id.provider() + "/api/id/jwks"


def _fetch_keys() -> None:
    from . import devicebridge
    _jwks["tried"] = time.time()
    r = httpx.get(jwks_url(), timeout=TIMEOUT, headers={"Accept": "application/json"}, follow_redirects=False)
    r.raise_for_status()
    keys = {}
    for k in (r.json() or {}).get("keys") or []:
        try:
            if k.get("alg") == "ES256" and k.get("kid"):
                keys[str(k["kid"])] = devicebridge.jwk_public_key(k)
        except (ValueError, TypeError, AttributeError):
            continue
    _jwks.update(at=time.time(), keys=keys)


def _key(kid: str):
    now = time.time()
    with _lock:
        stale = now - _jwks["at"] > JWKS_TTL
        unknown = kid not in _jwks["keys"]
        if (stale or unknown) and now - _jwks["tried"] > (0 if not _jwks["at"] else JWKS_RETRY):
            try:
                _fetch_keys()
            except (httpx.HTTPError, ValueError) as e:
                _log(f"the ERP's public keys could not be read ({type(e).__name__})")
        key = _jwks["keys"].get(kid)
    if key is None:
        raise ErpError(401, "UNKNOWN_KEY", "The ERP's signature is not one this server knows.")
    return key


def verify(authz: str, method: str, path: str, body: bytes) -> dict:
    """The claims of a valid assertion for this exact request, used once; ErpError otherwise."""
    from . import devicebridge
    if not authz.startswith("BIZOMAT-ERP "):
        raise ErpError(401, "NO_ASSERTION", "BIZOMAT ERP's assertion is missing.")
    token = authz[12:].strip()
    try:
        header, _, _, _ = devicebridge.jws_parts(token)
    except (ValueError, TypeError):
        raise ErpError(401, "BAD_ASSERTION", "The assertion is malformed.") from None
    if header.get("alg") != "ES256" or header.get("typ") != "bizomat-erp+jwt":
        raise ErpError(401, "BAD_ASSERTION", "The assertion is not of the expected kind.")
    try:
        _, payload = devicebridge.jws_verify(token, _key(str(header.get("kid") or "")))
        claims = json.loads(payload)
    except ErpError:
        raise
    except (ValueError, TypeError):
        raise ErpError(401, "BAD_SIGNATURE", "The assertion's signature does not verify.") from None
    if not isinstance(claims, dict):
        raise ErpError(401, "BAD_ASSERTION", "The assertion is malformed.")
    now = time.time()
    iat, exp = claims.get("iat"), claims.get("exp")
    if claims.get("iss") != "bizomat-erp" or claims.get("aud") != "cad":
        raise ErpError(401, "WRONG_AUDIENCE", "The assertion is not for CAD Automation.")
    if not isinstance(iat, (int, float)) or not isinstance(exp, (int, float)) or iat > now + SKEW or exp < now - SKEW \
            or exp - iat > MAX_LIFE:
        raise ErpError(401, "EXPIRED", "The assertion has expired. Try again.")
    bh = base64.urlsafe_b64encode(hashlib.sha256(body).digest()).decode().rstrip("=")
    if claims.get("htm") != method.upper() or claims.get("htu") != path or claims.get("bh") != bh:
        raise ErpError(401, "WRONG_REQUEST", "The assertion was made for another request.")
    jti = str(claims.get("jti") or "")
    with _lock:
        for k in [k for k, t in _jti.items() if t < now]:
            _jti.pop(k, None)
        if not jti or jti in _jti:
            raise ErpError(401, "REPLAYED", "The assertion was already used.")
        _jti[jti] = float(exp) + SKEW
    co, perm, sub = claims.get("co"), claims.get("perm"), claims.get("sub")
    if not isinstance(co, dict) or not isinstance(co.get("id"), str) or not isinstance(perm, dict) or not isinstance(sub, str):
        raise ErpError(401, "BAD_ASSERTION", "The assertion does not name the person, company and permissions.")
    return claims


class Ctx:
    """One ERP request: the claims, this server's account for the person, the company and what they may do there."""

    def __init__(self, claims: dict, user: dict):
        self.claims = claims
        self.user = user
        self.company = claims["co"]["id"]
        self.company_name = str(claims["co"].get("name") or "")
        self.perm = claims["perm"]
        self.limits = dict(tenancy.DEFAULT_LIMITS, **{k: v for k, v in (claims.get("lim") or {}).items() if k in tenancy.DEFAULT_LIMITS})

    @property
    def operate(self):
        return self.perm.get("operate")

    def owners(self) -> set | None:
        """Whose computers, commands and exports this person sees in the company (None: everyone's)."""
        scope = self.perm.get("scope")
        if scope == "all":
            return None
        if scope == "team":
            subs = {str(s) for s in (self.perm.get("team") or [])} | {self.claims["sub"]}
            return {u["id"] for u in _accounts_raw() if u.get("bizomat") in subs} | {self.user["id"]}
        return {self.user["id"]}

    def sees(self, owner: str | None) -> bool:
        o = self.owners()
        return o is None or owner in o

    def may_operate(self, owner: str | None) -> bool:
        op = self.operate
        return op == "all" and self.sees(owner) or (op == "own" and owner == self.user["id"])


def _accounts_raw() -> list[dict]:
    from . import accounts
    return list(accounts._users()["users"])


def context(request: Request, body: bytes) -> Ctx:
    from . import accounts
    if not accounts.any_users():
        raise ErpError(503, "NOT_SET_UP", "CAD Automation is not set up yet.")
    path = request.scope.get("path", "")
    claims = verify(request.headers.get("authorization", ""), request.method, path, body)
    try:
        user = accounts.erp_user(claims["sub"], str(claims.get("email") or ""), bool(claims.get("ev")), str(claims.get("name") or ""))
    except accounts.AccountError as e:
        raise ErpError(403, "ACCOUNT", str(e)) from None
    return Ctx(claims, user)


# ----------------------------------------------------------------------------- views of one company

def _sha(s: str) -> str:
    return hashlib.sha256(s.encode()).hexdigest()


_PATH = re.compile(r"""(?:[A-Za-z]:[\\/]|\\\\)(?:[^\\/\n"<>|]*[\\/])*(?:[^\\/\n"<>|]*?\.[A-Za-z0-9]{1,8}\b|[^\\/\s"<>|:]*)""")


def _scrub(text: str) -> str:
    """An error message as others may see it: a Windows path in it (a person's folders and file names) becomes "a file"."""
    return _PATH.sub("a file", text)


def _person(owner: str | None, people: dict) -> dict | None:
    u = people.get(owner or "")
    return {"sub": u.get("bizomat"), "name": u.get("name"), "email": u.get("email")} if u else None


def _commands(ctx: Ctx, limit: int = 100, command_id: str | None = None) -> list[dict]:
    from . import catalog, devicebridge
    owners = ctx.owners()
    sql = ("SELECT c.*, d.name AS device FROM commands c LEFT JOIN devices d ON d.id = c.device_id WHERE c.company = ?"
           + (" AND c.id = ?" if command_id else "")
           + (f" AND c.owner IN ({','.join('?' * len(owners))})" if owners is not None else "")
           + " ORDER BY c.created DESC LIMIT ?")
    args = [ctx.company] + ([command_id] if command_id else []) + (sorted(owners) if owners is not None else []) + [limit]
    people = {u["id"]: u for u in _accounts_raw()}
    out = []
    for r in devicebridge._q(sql, tuple(args)):
        item = {"id": r["id"], "tool": r["tool"], "title": catalog.title(r["tool"]), "op": r["op"], "status": r["status"],
                "created": int(r["created"] * 1000), "updated": int(r["updated"] * 1000), "device": r["device"],
                "deviceId": r["device_id"], "app": r["client"], "owner": _person(r["owner"], people),
                "mine": r["owner"] == ctx.user["id"]}
        if r["error"]:
            try:
                e = json.loads(r["error"])
                msg = str(e.get("message") or "")[:400]
                item["error"] = {"code": e.get("code"), "message": msg if r["owner"] == ctx.user["id"] else _scrub(msg)}
            except (ValueError, AttributeError):
                pass
        if command_id:
            item["history"] = json.loads(r["history"] or "[]")
            if r["result"]:
                try:
                    item["result"] = json.loads(r["result"])
                except ValueError:
                    pass
            p = devicebridge._pending.get(r["id"])
            if p and p.progress:
                item["progress"] = p.progress
        out.append(item)
    return out


def state_for(ctx: Ctx, request: Request) -> dict:
    from . import artifacts, catalog, devicebridge, mcpauth
    owners = ctx.owners()
    people = {u["id"]: u for u in _accounts_raw()}
    rows = devicebridge._q("SELECT * FROM devices WHERE company = ? AND revoked IS NULL ORDER BY created", (ctx.company,))
    computers = []
    for r in rows:
        if not ctx.sees(r["owner"]):
            continue
        d = devicebridge._device_out(r)
        if r["owner"] != ctx.user["id"]:
            # someone else's computer: what it is and whether it is ready, never the file open in it or its folders
            d["solidworks"] = [{k: v for k, v in i.items() if k != "active_document"} for i in d.get("solidworks") or []]
            d["installations"] = [{k: v for k, v in i.items() if k != "path"} for i in d.get("installations") or [] if isinstance(i, dict)]
        d.update(owner=_person(r["owner"], people), mine=r["owner"] == ctx.user["id"], canOperate=ctx.may_operate(r["owner"]),
                 canRemove=ctx.may_operate(r["owner"]) or bool(ctx.perm.get("delete")))
        computers.append(d)
    grants = mcpauth.grants_where(lambda g: (g.get("company") == ctx.company and (owners is None or g["user"] in owners))
                                  or (g["user"] == ctx.user["id"] and not g.get("company")))
    assistants = [{"id": g["id"], "name": g["name"], "host": g["host"], "created": g["created"] * 1000,
                   "lastUsed": (g["last_used"] or 0) * 1000 or None, "owner": _person(g["user"], people),
                   "mine": g["user"] == ctx.user["id"], "needsCompany": not g.get("company")} for g in grants]
    exports = [{"id": i["_id"], "name": i.get("filename"), "format": i.get("format"), "size": i.get("_size"),
                "sha256": i.get("sha256"), "created": int((i.get("created") or 0) * 1000), "expires": int(i.get("expires_at", 0) * 1000),
                "owner": _person(i.get("owner"), people), "mine": i.get("owner") == ctx.user["id"]}
               for i in artifacts.items_for(ctx.company, owners)]
    busy = devicebridge._q("SELECT COUNT(*) AS n FROM commands WHERE company = ? AND status NOT IN (%s) AND expires > ?"
                           % ",".join("?" * len(devicebridge.TERMINAL)), (ctx.company, *devicebridge.TERMINAL, time.time()), one=True)
    mine_unassigned = devicebridge._q("SELECT COUNT(*) AS n FROM devices WHERE owner = ? AND company IS NULL AND revoked IS NULL",
                                      (ctx.user["id"],), one=True)
    return {
        "account": {"id": ctx.user["id"]},
        "connector": {"url": connector_url()},
        "installer": installer_info(),
        "computers": computers,
        "assistants": assistants,
        "commands": _commands(ctx),
        "exports": exports,
        "usage": {"running": int((busy or {}).get("n") or 0), "storageBytes": sum(e["size"] or 0 for e in exports)},
        "unassigned": {"computers": int((mine_unassigned or {}).get("n") or 0), "assistants": sum(1 for a in assistants if a["needsCompany"])},
        "tools": [{"group": g, "tools": [{"name": n, "title": t, "summary": s} for n, t, s in items]} for g, items in catalog.GROUPS],
        # What the CAD Assistant page offered (owner, 20 Nov 2026: every page of CAD Automation inside the ERP): requests
        # to copy, and the service address the direct link needs (the person's add-in key is asked for on its own).
        "examples": [{"group": g, "items": list(items)} for g, items in catalog.EXAMPLES],
        "service": _service_url(),
        "package": _has_package(),
    }


def _has_package() -> bool:
    """Whether this server holds the add-in package for a manual installation (the image builds it)."""
    from . import server
    return server.SW_DOWNLOAD.is_file()


def _service_url() -> str:
    from . import auth
    return auth.public_url()


def installer_info() -> dict:
    """The installer this server holds (server.local_installer), which the ERP hands out itself: nobody signs in to
    CAD Automation separately to download it. Its version only when the published release record names this file."""
    from . import server
    p = server.local_installer()
    if p is None:
        return {"available": False}
    sha = server._installer_sha256(p)
    out = {"available": True, "name": p.name, "size": p.stat().st_size, "sha256": sha}
    try:
        from . import devicebridge
        rel = devicebridge.release_manifest() or {}
        if str(rel.get("sha256", "")).lower().removeprefix("sha256:") == sha and rel.get("version"):
            out["version"] = str(rel["version"])[:20]
    except Exception:  # noqa: BLE001 - the record is optional
        pass
    return out


def connector_url() -> str:
    """The AI connector's address, as the CAD Automation pages give it (server._mcp_base without a request)."""
    import os
    from . import auth, mcp_server
    v = os.environ.get("OPENSKETCH_MCP_URL", "").strip().rstrip("/")
    if v.startswith("https://") and v.endswith(mcp_server.PATHS[0]) and " " not in v:
        return v
    return auth.public_url() + mcp_server.PATHS[0]


# ----------------------------------------------------------------------------- the API

router = APIRouter(prefix="/api/erp/v1")


def _error(e: ErpError) -> JSONResponse:
    return JSONResponse({"error": {"code": e.code, "message": e.message}}, status_code=e.status, headers={"Cache-Control": "no-store"})


async def _ctx(request: Request) -> tuple[Ctx, dict]:
    body = await request.body()
    if len(body) > MAX_BODY:
        raise ErpError(413, "TOO_LARGE", "The request is too large.")
    ctx = await asyncio.to_thread(context, request, body)
    try:
        data = json.loads(body or b"{}")
    except ValueError:
        raise ErpError(400, "BAD_JSON", "The request is not JSON.") from None
    return ctx, data if isinstance(data, dict) else {}


def _handler(fn):
    """Wraps an endpoint: checks the assertion, runs the work inside the company (tenancy.py), maps errors."""
    async def run(request: Request):
        try:
            ctx, data = await _ctx(request)
            with tenancy.use(ctx.company, ctx.limits):
                out = await fn(request, ctx, data)
            if isinstance(out, (JSONResponse, FileResponse)):
                return out
            return JSONResponse(out, headers={"Cache-Control": "no-store"})
        except ErpError as e:
            return _error(e)
    run.__name__ = fn.__name__
    return run


def _need(ok, code: str, message: str, status: int = 403) -> None:
    if not ok:
        raise ErpError(status, code, message)


def _device(ctx: Ctx, device_id) -> dict:
    from . import devicebridge
    r = devicebridge._q("SELECT * FROM devices WHERE id = ? AND company = ? AND revoked IS NULL", (str(device_id or "")[:64], ctx.company), one=True)
    _need(r and ctx.sees(r["owner"]), "NOT_FOUND", "No such computer in this company.", 404)
    return r


@router.post("/state")
@_handler
async def api_state(request: Request, ctx: Ctx, data: dict):
    return await asyncio.to_thread(state_for, ctx, request)


@router.post("/computers/default")
@_handler
async def api_default(request: Request, ctx: Ctx, data: dict):
    from . import devicebridge
    r = _device(ctx, data.get("device"))
    _need(r["owner"] == ctx.user["id"] and ctx.operate, "FORBIDDEN", "You can choose the default only among your own computers.")
    devicebridge.set_device(ctx.user, r["id"], default=True)
    return {"name": r["name"]}


@router.post("/computers/remove")
@_handler
async def api_remove(request: Request, ctx: Ctx, data: dict):
    from . import accounts, devicebridge
    r = _device(ctx, data.get("device"))
    _need(ctx.may_operate(r["owner"]) or ctx.perm.get("delete"), "FORBIDDEN", "Your role cannot remove this computer.")
    owner = accounts.get_any(r["owner"]) or {"id": r["owner"]}
    devicebridge.revoke_device(owner, r["id"], "This computer was removed from CAD Automation in BIZOMAT ERP.")
    people = {u["id"]: u for u in _accounts_raw()}
    return {"name": r["name"], "owner": (people.get(r["owner"]) or {}).get("bizomat")}


@router.post("/pair/lookup")
@_handler
async def api_pair_lookup(request: Request, ctx: Ctx, data: dict):
    from . import devicebridge
    _need(ctx.operate, "FORBIDDEN", "Your role cannot pair computers in this company.")
    r = devicebridge.pairing_by_code(str(data.get("code") or "")[:20])
    _need(r and r["status"] == "pending", "NOT_FOUND", "That code is not valid or has expired. Start pairing again in the Companion.", 404)
    info = json.loads(r.get("info") or "{}")
    return {"name": r["name"] or "Windows computer", "os": info.get("os"), "expiresIn": max(0, int(r["expires"] - time.time()))}


@router.post("/pair/approve")
@_handler
async def api_pair_approve(request: Request, ctx: Ctx, data: dict):
    from . import devicebridge
    _need(ctx.operate, "FORBIDDEN", "Your role cannot pair computers in this company.")
    try:
        out = devicebridge.approve_pairing(ctx.user, str(data.get("code") or "")[:20], company=ctx.company)
    except ValueError as e:
        raise ErpError(404, "NOT_FOUND", str(e)) from None
    return {"device": out["device_id"], "name": out["name"]}


@router.post("/assistants/remove")
@_handler
async def api_assistant_remove(request: Request, ctx: Ctx, data: dict):
    from . import mcpauth
    gid = str(data.get("grant") or "")[:80]
    g = next((x for x in mcpauth.grants_where(lambda g: True) if x["id"] == gid), None)
    _need(g is not None, "NOT_FOUND", "No such AI assistant.", 404)
    own = g["user"] == ctx.user["id"] and (g["company"] in (None, ctx.company))
    other = g["company"] == ctx.company and ctx.sees(g["user"]) and ctx.perm.get("delete")
    _need(own or other, "FORBIDDEN", "Your role cannot disconnect this AI assistant.")
    mcpauth.drop_grant_by_id(gid)
    people = {u["id"]: u for u in _accounts_raw()}
    return {"name": g["name"], "owner": (people.get(g["user"]) or {}).get("bizomat")}


@router.post("/assistants/assign")
@_handler
async def api_assistant_assign(request: Request, ctx: Ctx, data: dict):
    from . import mcpauth
    _need(ctx.operate, "FORBIDDEN", "Your role cannot use AI assistants in this company.")
    out = mcpauth.set_grant_company(str(data.get("grant") or "")[:80], ctx.company, user_id=ctx.user["id"], only_if_unset=True)
    _need(out is not None, "NOT_FOUND", "No AI assistant of yours without a company.", 404)
    return {"name": out["name"]}


@router.post("/commands/get")
@_handler
async def api_command(request: Request, ctx: Ctx, data: dict):
    rows = _commands(ctx, 1, str(data.get("id") or "")[:64])
    _need(rows, "NOT_FOUND", "No such command in this company.", 404)
    return {"command": rows[0]}


@router.post("/commands/cancel")
@_handler
async def api_cancel(request: Request, ctx: Ctx, data: dict):
    from . import accounts, devicebridge
    cid = str(data.get("id") or "")[:64]
    r = devicebridge._q("SELECT owner, tool FROM commands WHERE id = ? AND company = ?", (cid, ctx.company), one=True)
    _need(r and ctx.sees(r["owner"]), "NOT_FOUND", "No such command in this company.", 404)
    _need(ctx.may_operate(r["owner"]), "FORBIDDEN", "Your role cannot cancel this command.")
    out = devicebridge.cancel(accounts.get_any(r["owner"]) or {"id": r["owner"]}, cid)
    return dict(out, tool=r["tool"])


@router.get("/exports/{export_id}/file")
async def api_export_file(export_id: str, request: Request):
    from . import artifacts
    try:
        ctx, _ = await _ctx(request)
        _need(ctx.perm.get("export"), "FORBIDDEN", "Your role cannot download CAD files in this company.")
        hit = artifacts.path_of(export_id)
        _need(hit and hit[1].get("company") == ctx.company and ctx.sees(hit[1].get("owner")), "NOT_FOUND", "No such export, or it has expired.", 404)
        path, info = hit
        return FileResponse(path, media_type=info.get("media_type") or "application/octet-stream", filename=info.get("filename") or "export",
                            headers={"X-Sha256": str(info.get("sha256") or ""), "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})
    except ErpError as e:
        return _error(e)


@router.get("/installer/file")
async def api_installer_file(request: Request):
    """The installer, for BIZOMAT ERP to hand to a person of the company (step 1 of the setup in the ERP)."""
    from . import server
    try:
        await _ctx(request)
        p = server.local_installer()
        _need(p is not None, "NOT_FOUND", "The installer is not on this server yet. Ask BIZOMAT support.", 404)
        sha = await asyncio.to_thread(server._installer_sha256, p)
        return FileResponse(p, media_type="application/x-msi", filename=p.name,
                            headers={"X-Sha256": sha, "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})
    except ErpError as e:
        return _error(e)


# ----------------------------------------------------------------------------- the person's own keys (Settings)
# The Settings page's private connector address and add-in key, and the SOLIDWORKS page's add-in package, inside the ERP
# (owner, 20 Nov 2026). Each is the asserted person's own: nobody sees or changes another person's keys. The ERP passes
# them through to that person's browser and keeps nothing.

def _own(ctx: Ctx) -> dict:
    _need(ctx.operate, "FORBIDDEN", "Your role cannot use CAD Automation in this company.")
    _need(not ctx.user.get("legacy"), "FORBIDDEN", "This account has no keys of its own.")
    return ctx.user


def _private_url(user: dict) -> str:
    from . import auth
    return f"{connector_url()}/{auth.mcp_token_for(user)}"


@router.post("/access")
@_handler
async def api_access(request: Request, ctx: Ctx, data: dict):
    from . import swbridge
    u = _own(ctx)
    return {"privateUrl": _private_url(u), "addinKey": swbridge.key_for(u), "service": _service_url(),
            "package": _has_package()}


@router.post("/access/private/new")
@_handler
async def api_access_private_new(request: Request, ctx: Ctx, data: dict):
    """A new private connector address: the old one stops working at once (server.api_connect_new_address)."""
    from . import accounts
    u = _own(ctx)
    accounts.new_mcp_address(u["id"])
    fresh_user = accounts.get(u["id"]) or u
    return {"privateUrl": _private_url(fresh_user)}


@router.post("/access/addin-key/new")
@_handler
async def api_access_key_new(request: Request, ctx: Ctx, data: dict):
    """A new add-in key: the direct link stops until the new key is pasted into the add-in (server.api_sw_key)."""
    from . import swbridge
    return {"addinKey": swbridge.new_key(_own(ctx))}


@router.get("/addin/package")
async def api_addin_package(request: Request):
    """The add-in package for a manual installation (the SOLIDWORKS page's download), handed out by the ERP."""
    from . import server
    try:
        ctx, _ = await _ctx(request)
        _own(ctx)
        _need(server.SW_DOWNLOAD.is_file(), "NOT_FOUND", "The add-in package is not on this server.", 404)
        return FileResponse(server.SW_DOWNLOAD, filename="BIZOMAT-CAD-Automation-SOLIDWORKS-addin.zip", media_type="application/zip",
                            headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})
    except ErpError as e:
        return _error(e)


_reads: dict[str, asyncio.Task] = {}


@router.post("/assembly/read")
@_handler
async def api_assembly_read(request: Request, ctx: Ctx, data: dict):
    """Starts a read of the open assembly on one of the person's computers and answers at once with the command's id;
    the ERP follows it with /commands/get and builds its bill of materials proposal from the result."""
    from . import devicebridge, mcp_server
    from .swbridge import BridgeError
    _need(ctx.operate, "FORBIDDEN", "Your role cannot send work to computers in this company.")
    try:
        device = devicebridge.pick(ctx.user, data.get("device") or None)
    except BridgeError as e:
        raise ErpError(409, e.code or "DEVICE", str(e)) from None
    _need(device is not None, "OFFLINE", "None of your computers in this company is online. Start the Companion and SOLIDWORKS.", 409)
    cid = devicebridge.ulid("cmd")
    user, company, limits = ctx.user, ctx.company, ctx.limits

    async def run():
        token = mcp_server._mcp_grant.set({"id": "erp", "name": "BIZOMAT ERP"})
        try:
            with tenancy.use(company, limits):
                await devicebridge.call(user, device, "read", {"sketches": False}, timeout=120, tool="sw_get_document", command_id=cid)
        except BridgeError:
            pass  # recorded on the command
        except Exception as e:  # noqa: BLE001 - a background read must never take the server down
            _log(f"assembly read failed ({type(e).__name__})")
        finally:
            mcp_server._mcp_grant.reset(token)
            _reads.pop(cid, None)

    _reads[cid] = asyncio.create_task(run())
    await asyncio.sleep(0.05)
    return {"commandId": cid}


# ----------------------------------------------------------------------------- downloads through AI assistants' links

def download_refused(info: dict) -> str | None:
    """Why a company's export may not be downloaded through its link now (the owner's role there changed within the
    hour, or the company no longer names them), else None. An export outside any company: never refused here."""
    co, owner = info.get("company"), info.get("owner")
    if not co:
        return None
    if not fresh():
        return None  # the ERP's answer is stale: the server works as before
    if not may_export(owner, co):
        return "Your role in this company cannot download CAD files."
    return None


def record_download(info: dict) -> None:
    """A company's export downloaded through its link: kept for the next sync, where it goes into the company's
    history in the ERP (as a download from the ERP itself does). Never the file, a path or the link."""
    import uuid
    if not info.get("company"):
        return
    entry = {"id": uuid.uuid4().hex, "export": str(info.get("artifact_id") or "")[:64], "account": str(info.get("owner") or "")[:64],
             "company": str(info["company"])[:64], "name": _scrub(str(info.get("filename") or ""))[:200],
             "format": str(info.get("format") or "")[:16], "size": int(info.get("size_bytes") or 0),
             "sha256": str(info.get("sha256") or "")[:64], "at": int(time.time() * 1000)}
    with _lock:
        d = state()
        pending = d.setdefault("downloads", [])
        pending.append(entry)
        del pending[:-MAX_DOWNLOADS]
        _save()


# ----------------------------------------------------------------------------- the sync

def _checksum(rows, keys) -> str:
    return _sha("\n".join("|".join(str(r.get(k) or "") for k in keys) for r in sorted(rows, key=lambda r: str(r.get(keys[0])))))


def build() -> dict:
    """What this server tells the ERP once a minute: accounts, usage by company, finished runs, checksums."""
    from . import artifacts, devicebridge, mcpauth
    users = _accounts_raw()
    devices = devicebridge._q("SELECT id, owner, company FROM devices WHERE revoked IS NULL")
    commands = devicebridge._q("SELECT id, owner, company FROM commands")
    grants = mcpauth.grants_where(lambda g: True)
    by = lambda rows, key: {k: [r for r in rows if r.get(key) == k] for k in {r.get(key) for r in rows}}
    dev_by, cmd_by, gr_by = by(devices, "owner"), by(commands, "owner"), by(grants, "user")
    accounts_out = []
    for u in users:
        d, c, g = dev_by.get(u["id"], []), cmd_by.get(u["id"], []), gr_by.get(u["id"], [])
        accounts_out.append({
            "id": u["id"], "email": u["email"], "emailVerified": bool(u.get("email_verified")), "sub": u.get("bizomat"),
            "created": u.get("created"),
            "counts": {"computers": len(d), "commands": len(c), "grants": len(g)},
            "unassigned": {"computers": sum(1 for x in d if not x["company"]), "commands": sum(1 for x in c if not x["company"]),
                           "grants": sum(1 for x in g if not x["company"])},
        })
    now = time.time()
    day = now - 86400
    companies = []
    for co in sorted({r["company"] for r in devices + commands if r.get("company")}):
        stats = devicebridge._q(
            "SELECT SUM(CASE WHEN status NOT IN (%s) AND status != 'queued' AND expires > ? THEN 1 ELSE 0 END) AS busy,"
            " SUM(CASE WHEN status = 'queued' AND expires > ? THEN 1 ELSE 0 END) AS queued,"
            " SUM(CASE WHEN status IN ('failed','rejected','denied','unknown','expired') AND updated > ? THEN 1 ELSE 0 END) AS failed,"
            " SUM(CASE WHEN status = 'succeeded' AND updated > ? THEN 1 ELSE 0 END) AS done,"
            " AVG(CASE WHEN status = 'succeeded' AND updated > ? THEN updated - created END) AS avg FROM commands WHERE company = ?"
            % ",".join("?" * len(devicebridge.TERMINAL)), (*devicebridge.TERMINAL, now, now, day, day, day, co), one=True) or {}
        devs = [r for r in devices if r.get("company") == co]
        companies.append({"id": co, "computers": len(devs), "online": sum(1 for r in devs if devicebridge._online(r)),
                          "queued": int(stats.get("queued") or 0), "running": int(stats.get("busy") or 0), "failed24h": int(stats.get("failed") or 0),
                          "done24h": int(stats.get("done") or 0), "avgSeconds": round(float(stats.get("avg") or 0), 1),
                          "storageBytes": sum(i.get("_size") or 0 for i in artifacts.items_for(co))})
    cursor = float(state().get("cursor") or 0)
    since = float(state().get("since") or now)  # commands from before the link are history, never new runs
    from . import catalog
    runs = []
    for r in devicebridge._q("SELECT id, owner, company, tool, status, created, updated, error FROM commands WHERE company IS NOT NULL"
                             " AND updated > ? AND created >= ? AND status IN (%s) ORDER BY updated LIMIT ?" % ",".join("?" * len(RUN_STATUS)),
                             (cursor, since, *RUN_STATUS, MAX_RUNS)):
        err = None
        if r["error"]:
            try:
                err = _scrub(str(json.loads(r["error"]).get("message") or ""))[:300] or None
            except (ValueError, AttributeError):
                err = None
        runs.append({"id": r["id"], "account": r["owner"], "company": r["company"], "tool": catalog.title(r["tool"])[:80],
                     "status": RUN_STATUS[r["status"]], "at": int(r["updated"] * 1000), "seconds": round(max(0.0, r["updated"] - r["created"]), 1),
                     "error": err, "_updated": r["updated"]})
    worker = {"version": _version(), "computersOnline": sum(1 for r in devices if devicebridge._online(r))}
    try:
        from . import evidencescan
        st = evidencescan.status() or {}
        worker["scanner"] = "on" if st.get("running") else "off"
    except Exception:  # noqa: BLE001
        worker["scanner"] = "unknown"
    with _lock:
        downloads = [dict(x) for x in (state().get("downloads") or [])][:MAX_DOWNLOADS]
    return {
        "contract": CONTRACT,
        "accounts": accounts_out,
        "companies": companies,
        "runs": runs,
        "downloads": downloads,
        "worker": worker,
        "checksums": {"devices": _checksum(devices, ("id", "owner", "company")), "commands": _checksum(commands, ("id", "owner", "company")),
                      "grants": _checksum(grants, ("id", "user", "company"))},
    }


def _version() -> str:
    import os
    return (os.environ.get("OPENSKETCH_VERSION") or "dev")[:40]


def _company_in(c: dict) -> dict:
    """One company of an account in the ERP's answer. An ERP from before contract 2 names only the companies where the
    person may work, without these keys: they then mean what they meant (may work, may download)."""
    return {"id": str(c.get("id")), "name": str(c.get("name") or ""), "operate": c.get("operate", True) is not False,
            "export": c.get("export", True) is not False}


def apply(answer: dict, runs: list[dict], sent_downloads: list[dict] | None = None) -> dict:
    """Keeps the ERP's answer, and moves an account's computers, commands and AI connections that have no company yet
    into the company the ERP named for it (only one where it may work inside the ERP). Drops the downloads the ERP
    has now taken. Returns counts."""
    from . import devicebridge, mcpauth
    accounts_in = answer.get("accounts") if isinstance(answer.get("accounts"), dict) else {}
    moved = {"computers": 0, "commands": 0, "grants": 0}
    with _lock:
        d = state()
        d["accounts"] = {k: {"userId": v.get("userId"), "companies": [_company_in(c) for c in (v.get("companies") or [])
                                                                        if isinstance(c, dict) and c.get("id")],
                             "default": v.get("default"), "review": bool(v.get("review"))}
                         for k, v in accounts_in.items() if isinstance(v, dict)}
        d["limits"] = {k: v for k, v in (answer.get("limits") or {}).items() if isinstance(v, dict)}
        d["redirect"] = bool(answer.get("redirect"))
        d["passwordRetired"] = answer.get("passwordRetired") is True
        if sent_downloads:
            done = {x["id"] for x in sent_downloads}
            d["downloads"] = [x for x in (d.get("downloads") or []) if x.get("id") not in done]
        d["at"] = time.time()
        d.setdefault("since", d["at"])
        if runs:
            d["cursor"] = max(float(d.get("cursor") or 0), max(r["_updated"] for r in runs))
        d.pop("last_error", None)
    for acc, v in state()["accounts"].items():
        co = v.get("default")
        if not co or not any(c["id"] == co and c.get("operate", True) for c in v["companies"]):
            continue
        moved["computers"] += devicebridge._exec("UPDATE devices SET company = ? WHERE owner = ? AND company IS NULL", (co, acc))
        moved["commands"] += devicebridge._exec("UPDATE commands SET company = ? WHERE owner = ? AND company IS NULL", (co, acc))
        for g in mcpauth.grants_where(lambda g, a=acc: g["user"] == a and not g.get("company")):
            if mcpauth.set_grant_company(g["id"], co, only_if_unset=True):
                moved["grants"] += 1
    _save()
    return moved


def sync_once(http: httpx.Client | None = None) -> dict:
    from . import bizomat_id, erpstatus
    creds = bizomat_id.client()
    if not creds:
        return {"skipped": "no BIZOMAT client"}
    body = build()
    runs = body["runs"]
    payload = dict(body, runs=[{k: v for k, v in r.items() if k != "_updated"} for r in runs])
    url = bizomat_id.provider() + "/api/id/cad-sync"
    headers = {"Authorization": erpstatus.basic(*creds), "Content-Type": "application/json", "Accept": "application/json"}
    client = http or httpx.Client(timeout=TIMEOUT)
    try:
        r = client.post(url, content=json.dumps(payload).encode(), headers=headers)
    finally:
        if http is None:
            client.close()
    if r.status_code != 200:
        raise RuntimeError(f"the ERP answered {r.status_code}")
    return apply(r.json(), runs, body["downloads"])


class Syncer:
    """A daemon thread (started and stopped by server.lifespan), never the event loop."""

    def __init__(self):
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None
        self.last: dict = {}

    def start(self) -> None:
        from . import accounts, bizomat_id
        if self._thread or not bizomat_id.enabled() or not accounts.any_users():
            return
        self._stop.clear()
        self._thread = threading.Thread(target=self._run, name="erp-sync", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=5)
        self._thread = None

    def _run(self) -> None:
        wait, backoff = FIRST, SYNC_EVERY
        while not self._stop.wait(wait):
            try:
                self.last = {"at": time.time(), "ok": True, "moved": sync_once()}
                wait, backoff = SYNC_EVERY, SYNC_EVERY
            except Exception as e:  # noqa: BLE001 - the link must keep trying
                self.last = {"at": time.time(), "ok": False, "error": type(e).__name__ + (f": {e}" if isinstance(e, RuntimeError) else "")}
                with _lock:
                    state()["last_error"] = self.last["error"]
                _log(f"sync failed ({self.last['error']})")
                backoff = min(BACKOFF_MAX, backoff * 2)
                wait = backoff


syncer = Syncer()
