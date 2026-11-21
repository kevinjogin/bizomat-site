"""CAD Automation inside BIZOMAT ERP, the engine's side (opensketch/erplink.py, tenancy.py; docs/ERP-MODULE.md).

A stand-in ERP signs assertions with its own P-256 key, serves the public half at /company/api/id/jwks and answers the
sync at /company/api/id/cad-sync. Covered: the assertion (signature, audience, time, method, path, body, once only);
the person's account made or linked from the ERP's word; each company's computers, AI connections, commands and
exports apart from every other company's; what each role may do; the sync (accounts, runs, checksums, earlier work
moved into the company the ERP named); an AI connection bound to one company; the fair-use limits; the old pages
opening in the ERP only while it says so, and working as before otherwise (the rollback)."""
import asyncio
import base64
import hashlib
import json
import secrets
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from unittest import mock

import httpx
import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi.testclient import TestClient

from opensketch import accounts, artifacts, devicebridge as db, erplink, mcpauth, mcp_server, server, swbridge, tenancy, uploads

SECRET = "e" * 24 + "f" * 24


class StandInERP:
    """The ERP's two endpoints for CAD Automation, with its signing key."""

    def __init__(self):
        self.key = ec.generate_private_key(ec.SECP256R1())
        self.kid = "k-" + secrets.token_hex(4)
        self.answer: dict = {"accounts": {}, "limits": {}, "redirect": False}
        self.syncs: list[dict] = []
        self.jwks_reads = 0
        erp = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a):
                pass

            def _send(self, status, body):
                raw = json.dumps(body).encode()
                self.send_response(status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(raw)))
                self.end_headers()
                self.wfile.write(raw)

            def do_GET(self):
                if self.path == "/company/api/id/jwks":
                    erp.jwks_reads += 1
                    jwk = dict(db.jwk_of(erp.key.public_key()), kid=erp.kid, alg="ES256", use="sig")
                    return self._send(200, {"keys": [jwk]})
                return self._send(404, {"error": "Not found"})

            def do_POST(self):
                raw = self.rfile.read(int(self.headers.get("Content-Length") or 0))
                if self.path != "/company/api/id/cad-sync":
                    return self._send(404, {"error": "Not found"})
                a = self.headers.get("Authorization") or ""
                if a != "Basic " + base64.b64encode(f"cad:{SECRET}".encode()).decode():
                    return self._send(401, {"error": "invalid_client"})
                erp.syncs.append(json.loads(raw))
                return self._send(200, erp.answer)

        self.srv = ThreadingHTTPServer(("127.0.0.1", 0), H)
        threading.Thread(target=self.srv.serve_forever, daemon=True).start()
        self.url = f"http://127.0.0.1:{self.srv.server_address[1]}/company"

    def assertion(self, method: str, path: str, body: bytes, sub: str, company: str, perm: dict | None = None,
                  email: str | None = None, lim: dict | None = None, **over) -> str:
        now = int(time.time())
        claims = {"iss": "bizomat-erp", "aud": "cad", "iat": now, "exp": now + 60, "jti": secrets.token_hex(12),
                  "htm": method, "htu": path, "bh": base64.urlsafe_b64encode(hashlib.sha256(body).digest()).decode().rstrip("="),
                  "sub": sub, "email": email or f"{sub}@example.com", "ev": True, "name": sub.title(),
                  "co": {"id": company, "name": company.upper(), "kind": "registered"},
                  "perm": perm or MANAGER, "lim": lim or {}}
        claims.update(over)
        header = {"alg": "ES256", "typ": "bizomat-erp+jwt", "kid": over.pop("kid", self.kid)}
        return "BIZOMAT-ERP " + db.jws_sign(self.key, header, json.dumps(claims).encode())

    def close(self):
        self.srv.shutdown()
        self.srv.server_close()


MANAGER = {"view": True, "operate": "all", "export": True, "manage": False, "delete": True, "scope": "all", "team": []}
EMPLOYEE = {"view": True, "operate": "own", "export": False, "manage": False, "delete": False, "scope": "own", "team": []}
READER = {"view": True, "operate": False, "export": False, "manage": False, "delete": False, "scope": "all", "team": []}


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "BIZOMAT_ID_CLIENT_SECRET", "BIZOMAT_ID_CLIENT_ID",
              "BIZOMAT_ID_URL", "OPENSKETCH_PUBLIC_URL", "OPENSKETCH_MCP_URL"):
        monkeypatch.delenv(k, raising=False)
    swbridge.reset_for_tests()
    erplink.reset_for_tests()
    yield tmp_path
    erplink.reset_for_tests()
    swbridge.reset_for_tests()


@pytest.fixture()
def erp(monkeypatch):
    f = StandInERP()
    monkeypatch.setenv("BIZOMAT_ID_URL", f.url)
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    yield f
    f.close()


@pytest.fixture()
def client(monkeypatch):
    monkeypatch.setattr(erplink.syncer, "start", lambda: None)  # the tests run the sync themselves
    monkeypatch.setenv("OPENSKETCH_EVIDENCE_SCAN", "0")
    accounts.create_owner("owner@example.com", "Owner", "a-long-password-1")
    with TestClient(server.app) as c:
        yield c


def call(c: TestClient, erp: StandInERP, op: str, body: dict, sub: str, company: str, perm=None, **kw) -> httpx.Response:
    raw = json.dumps(body).encode()
    path = "/api/erp/v1/" + op
    return c.post(path, content=raw, headers={"Authorization": erp.assertion("POST", path, raw, sub, company, perm, **kw),
                                              "Content-Type": "application/json"})


def _device(uid: str, name: str, company: str | None) -> str:
    did = db.ulid("dev")
    db._exec("INSERT INTO devices (id, owner, name, jwk, jkt, created, last_seen, is_default, info, company) VALUES (?,?,?,?,?,?,?,?,?,?)",
             (did, uid, name, "{}", "jkt-" + did, time.time(), None, 0, "{}", company))
    return did


def _command(uid: str, did: str, status: str, company: str | None, t: float | None = None) -> str:
    cid = db.ulid("cmd")
    t = t or time.time()
    db._exec("INSERT INTO commands (id, device_id, owner, tool, op, effect, risk, params_sha256, status, created, expires,"
             " updated, attempts, history, correlation, client, company) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
             (cid, did, uid, "sw_export", "export", "read", "low", "sha256:" + "0" * 64, status, t - 3, t + 60, t, 1, "[]",
              "cor", "Claude", company))
    return cid


def _grant(uid: str, name: str, company: str | None = None) -> str:
    with mcpauth._lock:
        d = mcpauth._load()
        gid = "osg_" + secrets.token_urlsafe(12)
        now = int(time.time())
        d["grants"][gid] = {"user": uid, "client_id": "c" + gid, "name": name, "host": "claude.ai", "resource": "r",
                            "created": now, "last_used": now}
        if company:
            d["grants"][gid]["company"] = company
        mcpauth._new_tokens(d, gid)
        mcpauth._save(d)
    return gid


def _link(account_id: str, companies: list[str], default: str | None = None, redirect: bool = False) -> None:
    """What the ERP's sync answer leaves in erp_link.json."""
    erplink.apply({"accounts": {account_id: {"userId": "u-" + account_id, "companies": [{"id": c, "name": c.upper()} for c in companies],
                                             "default": default, "review": False}},
                   "limits": {}, "redirect": redirect}, [])


# ----------------------------------------------------------------------------- the assertion

def test_an_assertion_works_once_for_its_own_request_only(erp, client):
    raw = b"{}"
    path = "/api/erp/v1/state"
    good = erp.assertion("POST", path, raw, "alice", "co_a")
    h = lambda a: {"Authorization": a, "Content-Type": "application/json"}
    r = client.post(path, content=raw, headers=h(good))
    assert r.status_code == 200, r.text
    assert client.post(path, content=raw, headers=h(good)).json()["error"]["code"] == "REPLAYED"
    cases = {
        "WRONG_REQUEST": erp.assertion("POST", "/api/erp/v1/commands/get", raw, "alice", "co_a"),
        "EXPIRED": erp.assertion("POST", path, raw, "alice", "co_a", iat=int(time.time()) - 600, exp=int(time.time()) - 540),
        "WRONG_AUDIENCE": erp.assertion("POST", path, raw, "alice", "co_a", aud="crm"),
    }
    for code, a in cases.items():
        r = client.post(path, content=raw, headers=h(a))
        assert r.status_code == 401 and r.json()["error"]["code"] == code, (code, r.text)
    # the body is part of what was signed
    a = erp.assertion("POST", path, b'{"x":1}', "alice", "co_a")
    assert client.post(path, content=raw, headers=h(a)).json()["error"]["code"] == "WRONG_REQUEST"
    # another key with the same kid: the signature fails
    other = ec.generate_private_key(ec.SECP256R1())
    claims = json.loads(db.jws_parts(erp.assertion("POST", path, raw, "alice", "co_a")[12:])[1])
    forged = "BIZOMAT-ERP " + db.jws_sign(other, {"alg": "ES256", "typ": "bizomat-erp+jwt", "kid": erp.kid}, json.dumps(claims).encode())
    assert client.post(path, content=raw, headers=h(forged)).json()["error"]["code"] == "BAD_SIGNATURE"
    assert client.post(path, content=raw, headers={"Content-Type": "application/json"}).status_code == 401
    # a key the ERP does not publish
    erp.kid, old = "k-unknown", erp.kid
    r = client.post(path, content=raw, headers=h(erp.assertion("POST", path, raw, "alice", "co_a")))
    assert r.json()["error"]["code"] == "UNKNOWN_KEY"
    erp.kid = old


def test_the_erp_api_needs_no_cookie_and_the_sign_in_gate_lets_it_through(erp, client):
    r = client.post("/api/erp/v1/state", content=b"{}", headers={"Content-Type": "application/json"})
    assert r.status_code == 401 and r.json()["error"]["code"] == "NO_ASSERTION"


def test_the_person_is_linked_or_made_from_the_erps_word(erp, client):
    r = call(client, erp, "state", {}, "alice", "co_a")
    assert r.status_code == 200
    alice = next(u for u in accounts._users()["users"] if u["email"] == "alice@example.com")
    assert alice["bizomat"] == "alice" and alice["role"] == "member" and not alice.get("hash")
    # the same person again: the same account
    assert call(client, erp, "state", {}, "alice", "co_a").json()["account"]["id"] == alice["id"]
    # an existing account with that email, which BIZOMAT has not confirmed: refused, never taken over
    accounts.create_member("bob@example.com", "Bob", "a-long-password-2") if hasattr(accounts, "create_member") else \
        accounts.accept_invite(accounts.create_invite("owner"), "bob@example.com", "Bob", "a-long-password-2")
    r = call(client, erp, "state", {}, "bob-sub", "co_a", email="bob@example.com", ev=False)
    assert r.status_code == 403 and r.json()["error"]["code"] == "ACCOUNT"


# ----------------------------------------------------------------------------- one company, never another

def test_each_company_sees_only_its_own_computers_connections_commands_and_exports(erp, client):
    call(client, erp, "state", {}, "alice", "co_a")
    call(client, erp, "state", {}, "carol", "co_b")
    users = {u["bizomat"]: u["id"] for u in accounts._users()["users"] if u.get("bizomat")}
    a_pc = _device(users["alice"], "ALICE-PC", "co_a")
    b_pc = _device(users["carol"], "CAROL-PC", "co_b")
    _command(users["alice"], a_pc, "succeeded", "co_a")
    b_cmd = _command(users["carol"], b_pc, "succeeded", "co_b")
    _grant(users["alice"], "Claude", "co_a")
    _grant(users["carol"], "ChatGPT", "co_b")
    with tenancy.use("co_b"):
        artifacts._publish({"id": "doc", "version": 1}, b"solid", "step", "b.step", None, users["carol"], 3600)

    a = call(client, erp, "state", {}, "alice", "co_a").json()
    assert [c["name"] for c in a["computers"]] == ["ALICE-PC"]
    assert [x["name"] for x in a["assistants"]] == ["Claude"]
    assert len(a["commands"]) == 1 and a["exports"] == []
    b = call(client, erp, "state", {}, "carol", "co_b").json()
    assert [c["name"] for c in b["computers"]] == ["CAROL-PC"] and len(b["exports"]) == 1
    # another company's records cannot be reached by id
    assert call(client, erp, "commands/get", {"id": b_cmd}, "alice", "co_a").status_code == 404
    assert call(client, erp, "computers/remove", {"device": b_pc}, "alice", "co_a").status_code == 404
    path = f"/api/erp/v1/exports/{b['exports'][0]['id']}/file"
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "alice", "co_a")})
    assert r.status_code == 404
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "carol", "co_b")})
    assert r.status_code == 200 and r.content == b"solid" and r.headers["x-sha256"] == hashlib.sha256(b"solid").hexdigest()
    # the same person in another company sees nothing of the first: not even their own computer there
    assert [c["name"] for c in call(client, erp, "state", {}, "alice", "co_b").json()["computers"]] == ["CAROL-PC"]


def test_what_each_role_may_do(erp, client):
    for s in ("alice", "eve", "rita"):
        call(client, erp, "state", {}, s, "co_a")
    users = {u["bizomat"]: u["id"] for u in accounts._users()["users"] if u.get("bizomat")}
    a_pc = _device(users["alice"], "ALICE-PC", "co_a")
    e_pc = _device(users["eve"], "EVE-PC", "co_a")
    # an employee sees and works with their own computer only
    st = call(client, erp, "state", {}, "eve", "co_a", EMPLOYEE).json()
    assert [c["name"] for c in st["computers"]] == ["EVE-PC"] and st["computers"][0]["canOperate"]
    assert call(client, erp, "computers/remove", {"device": a_pc}, "eve", "co_a", EMPLOYEE).status_code == 404
    # a read-only person sees everyone's and changes nothing
    st = call(client, erp, "state", {}, "rita", "co_a", READER).json()
    assert {c["name"] for c in st["computers"]} == {"ALICE-PC", "EVE-PC"}
    assert not any(c["canOperate"] or c["canRemove"] for c in st["computers"])
    assert call(client, erp, "computers/remove", {"device": e_pc}, "rita", "co_a", READER).status_code == 403
    assert call(client, erp, "pair/lookup", {"code": "ABCD-EFGH"}, "rita", "co_a", READER).status_code == 403
    # a manager may remove a member's computer
    r = call(client, erp, "computers/remove", {"device": e_pc}, "alice", "co_a")
    assert r.status_code == 200 and r.json()["owner"] == "eve"
    # downloads need the export permission
    with tenancy.use("co_a"):
        artifacts._publish({"id": "doc", "version": 1}, b"x", "step", "e.step", None, users["eve"], 3600)
    eid = call(client, erp, "state", {}, "eve", "co_a", EMPLOYEE).json()["exports"][0]["id"]
    path = f"/api/erp/v1/exports/{eid}/file"
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "eve", "co_a", EMPLOYEE)})
    assert r.status_code == 403


def test_pairing_from_the_erp_puts_the_computer_in_that_company(erp, client):
    import uvicorn  # noqa: F401 - the stand-in Companion pairs through the API, as the real one does
    call(client, erp, "state", {}, "alice", "co_a")
    key = ec.generate_private_key(ec.SECP256R1())
    r = client.post("/v2/devices/pair/start", json={"public_jwk": db.jwk_of(key.public_key()), "name": "SHOP-PC", "machine": "SHOP-PC",
                                                    "os": "Windows 11 Pro", "companion_version": "1.0.0"})
    code = r.json()["user_code"]
    assert call(client, erp, "pair/lookup", {"code": code}, "alice", "co_a").json()["name"] == "SHOP-PC"
    r = call(client, erp, "pair/approve", {"code": code}, "alice", "co_a")
    assert r.status_code == 200
    row = db._q("SELECT company, owner FROM devices WHERE id = ?", (r.json()["device"],), one=True)
    assert row["company"] == "co_a"
    assert [c["name"] for c in call(client, erp, "state", {}, "alice", "co_a").json()["computers"]] == ["SHOP-PC"]


# ----------------------------------------------------------------------------- the sync

def test_the_sync_reports_and_moves_earlier_work_into_the_company_the_erp_named(erp, client):
    owner = accounts._users()["users"][0]
    pc = _device(owner["id"], "OWNER-PC", None)
    _command(owner["id"], pc, "succeeded", None)
    gid = _grant(owner["id"], "Claude")
    erp.answer = {"accounts": {owner["id"]: {"userId": "u1", "companies": [{"id": "co_a", "name": "A"}], "default": "co_a", "review": False}},
                  "limits": {"co_a": {"concurrent": 2, "commandSeconds": 120, "uploadMb": 8, "storageMb": 64}}, "redirect": True}
    moved = erplink.sync_once()
    assert moved == {"computers": 1, "commands": 1, "grants": 1}
    sent = erp.syncs[-1]
    acc = next(a for a in sent["accounts"] if a["id"] == owner["id"])
    assert acc["counts"] == {"computers": 1, "commands": 1, "grants": 1} and acc["unassigned"]["computers"] == 1
    assert set(sent["checksums"]) == {"devices", "commands", "grants"}
    assert "token" not in json.dumps(sent) and "refresh" not in json.dumps(sent)
    assert db._q("SELECT company FROM devices WHERE id = ?", (pc,), one=True)["company"] == "co_a"
    assert mcpauth.grants_where(lambda g: True)[0]["company"] == "co_a"
    assert erplink.in_erp(owner["id"]) and erplink.redirect_on() and erplink.limits_for("co_a")["concurrent"] == 2
    # finished commands in a company are reported once as runs (not the earlier ones it moved: they are history)
    _command(owner["id"], pc, "failed", "co_a", time.time() + 5)
    erplink.sync_once()
    runs = erp.syncs[-1]["runs"]
    assert [r["status"] for r in runs] == ["failed"] and runs[0]["company"] == "co_a"
    erplink.sync_once()
    assert erp.syncs[-1]["runs"] == []
    # nothing moves for an account in review (no default company)
    other = _device(owner["id"], "SPARE", None)
    erp.answer["accounts"][owner["id"]]["default"] = None
    erplink.sync_once()
    assert db._q("SELECT company FROM devices WHERE id = ?", (other,), one=True)["company"] is None
    assert gid


def test_a_stale_answer_counts_for_nothing(erp, client):
    owner = accounts._users()["users"][0]
    _link(owner["id"], ["co_a"], "co_a", redirect=True)
    assert erplink.in_erp(owner["id"])
    erplink.state()["at"] = time.time() - erplink.FRESH - 1
    assert not erplink.in_erp(owner["id"]) and not erplink.redirect_on()


def test_the_sync_needs_the_bizomat_client():
    assert erplink.sync_once() == {"skipped": "no BIZOMAT client"}


# ----------------------------------------------------------------------------- AI connections and limits

def test_an_ai_connection_works_in_one_company(erp, client):
    owner = accounts._users()["users"][0]
    assert erplink.company_for_connection(owner["id"], {"id": "x"}) is None  # outside the ERP: as before
    _link(owner["id"], ["co_a", "co_b"])
    gid = _grant(owner["id"], "Claude", "co_a")
    assert erplink.company_for_connection(owner["id"], {"id": gid, "company": "co_a"}) == "co_a"
    with pytest.raises(erplink.ErpError) as e:
        erplink.company_for_connection(owner["id"], {"id": gid, "company": "co_z"})
    assert e.value.code == "COMPANY_ACCESS"
    unbound = _grant(owner["id"], "ChatGPT")
    with pytest.raises(erplink.ErpError) as e:
        erplink.company_for_connection(owner["id"], {"id": unbound})
    assert e.value.code == "COMPANY_REQUIRED"
    # with one company (or a default), an earlier connection is bound to it on its next use
    _link(owner["id"], ["co_a"])
    assert erplink.company_for_connection(owner["id"], {"id": unbound}) == "co_a"
    assert next(g for g in mcpauth.grants_where(lambda g: True) if g["id"] == unbound)["company"] == "co_a"


def test_the_consent_page_asks_for_the_company_and_keeps_it(erp, client):
    owner = accounts._users()["users"][0]
    _link(owner["id"], ["co_a", "co_b"])
    page = server.auth.consent_page("Claude", "https://claude.ai/cb", accounts.public(owner), "req", "",
                                    companies=erplink.companies_of(owner["id"])).decode()
    assert 'name="company"' in page and "CO_A" in page and "CO_B" in page
    one = server.auth.consent_page("Claude", "https://claude.ai/cb", accounts.public(owner), "req", "",
                                   companies=[{"id": "co_a", "name": "Alpha"}]).decode()
    assert 'type="hidden" name="company" value="co_a"' in one and "Alpha" in one
    # the code carries the company into the connection
    code = mcpauth.issue_code({"client_id": "cid", "redirect_uri": "https://claude.ai/cb", "state": "s", "resource": "r",
                               "code_challenge": "x", "company": "co_b"}, owner["id"])
    assert mcpauth._codes[mcpauth._h(code)]["company"] == "co_b"


def test_fair_use_limits_inside_a_company(erp, client):
    owner = accounts._users()["users"][0]
    pc = _device(owner["id"], "PC", "co_a")
    for _ in range(2):
        _command(owner["id"], pc, "delivered", "co_a")
    row = db._q("SELECT * FROM devices WHERE id = ?", (pc,), one=True)
    live = mock.Mock(paused=False)
    live.alive.return_value = True

    async def run():
        with tenancy.use("co_a", {"concurrent": 2}):
            await db.call(accounts.public(owner), row, "read", {}, timeout=5, tool="sw_get_document")

    with mock.patch.dict(db._sessions, {pc: live}), pytest.raises(swbridge.BridgeError) as e:
        asyncio.run(run())
    assert e.value.code == "LIMIT_CONCURRENT"
    # uploads: the company's limit travels with the link
    with tenancy.use("co_a", {"uploadMb": 1}):
        out = json.loads(mcp_server.request_upload("part.step"))
    assert out["max_bytes"] == 2**20
    assert uploads._read(out["upload_id"])["company"] == "co_a"
    # exports: the company's storage
    with tenancy.use("co_a", {"storageMb": 1}):
        with pytest.raises(artifacts.ArtifactError):
            artifacts._publish({"id": "d", "version": 1}, b"x" * (2 * 2**20), "step", "big.step", None, owner["id"], 3600)


# ----------------------------------------------------------------------------- the old pages

def _signed_in(c: TestClient):
    r = c.post("/login", data={"email": "owner@example.com", "password": "a-long-password-1", "next": "/"}, follow_redirects=False)
    assert r.status_code == 303


def test_the_old_pages_open_in_the_erp_only_while_it_says_so(erp, client):
    owner = accounts._users()["users"][0]
    _signed_in(client)
    assert client.get("/dashboard", follow_redirects=False).status_code == 200
    _link(owner["id"], ["co_a"], "co_a", redirect=True)
    site = erp.url.rsplit("/company", 1)[0]
    expect = {"/dashboard": "/erp/cad", "/assistant": "/erp/cad/assistants", "/solidworks": "/erp/cad/computers",
              "/tools": "/erp/cad/tools", "/history?command=cmd_1": "/erp/cad/history?command=cmd_1", "/settings": "/erp/cad/access",
              "/": "/erp/cad", "/devices/pair?code=ABCD-EFGH": "/erp/cad/pair?code=ABCD-EFGH", "/overview": "/erp/cad",
              "/docs": "/erp/cad/setup", "/admin": "/erp/admin/cad"}
    for old, new in expect.items():
        r = client.get(old, follow_redirects=False)
        assert r.status_code == 302 and r.headers["location"] == site + new, (old, r.status_code, r.headers.get("location"))
    # ?here=1 keeps a page here, for support; the privacy notice always stays (a legal page anyone can read)
    for page in ("/admin?here=1", "/tools?here=1", "/docs?here=1", "/privacy"):
        assert client.get(page, follow_redirects=False).status_code == 200, page
    # the rollback: the ERP stops saying so, and every page works here again
    _link(owner["id"], ["co_a"], "co_a", redirect=False)
    assert client.get("/dashboard", follow_redirects=False).status_code == 200


def test_a_visitor_on_the_product_page_or_the_documentation_goes_to_the_erp(erp, client):
    """Owner, 20 Nov 2026: no pages at bizomat.ai/cad. A visitor without a CAD Automation session opens the product page
    and the documentation in BIZOMAT ERP, which signs them in, and an old link to a signed-in page goes to the same
    section there, never through CAD Automation's own sign-in."""
    owner = accounts._users()["users"][0]
    site = erp.url.rsplit("/company", 1)[0]
    for page in ("/", "/overview", "/docs"):
        assert client.get(page, follow_redirects=False).status_code == 200, page  # the flag off: the pages, as before
    r = client.get("/tools", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("/login"), "the flag off: sign in here, as before"
    _link(owner["id"], ["co_a"], "co_a", redirect=True)
    moved = {"/": "/erp/cad", "/overview": "/erp/cad", "/docs": "/erp/cad/setup", "/dashboard": "/erp/cad",
             "/assistant": "/erp/cad/assistants", "/solidworks": "/erp/cad/computers", "/tools": "/erp/cad/tools",
             "/history": "/erp/cad/history", "/settings": "/erp/cad/access"}
    for page, new in moved.items():
        r = client.get(page, follow_redirects=False)
        assert r.status_code == 302 and r.headers["location"] == site + new, (page, r.headers.get("location"))
    # the server owner's Admin and the sign-in page keep their way in; ?here=1 keeps a page here, for support
    assert client.get("/admin", follow_redirects=False).headers["location"].startswith("/login")
    assert client.get("/tools?here=1", follow_redirects=False).headers["location"].startswith("/login")
    assert client.get("/login?password=1", follow_redirects=False).status_code == 200
    assert client.get("/privacy", follow_redirects=False).status_code == 200
    # programs keep their addresses: the connector, the computers' link, health
    assert client.get("/healthz").status_code == 200
    assert client.post("/mcp", json={}).status_code == 401


def test_a_person_manages_their_own_keys_from_the_erp(erp, client, monkeypatch, tmp_path):
    """The Settings page's private connector address and add-in key, and the add-in package, inside the ERP: each is the
    person's own, made new from there, and never someone else's."""
    from opensketch import server, swbridge
    a = call(client, erp, "access", {}, "alice", "co_a").json()
    assert a["privateUrl"].startswith(erplink.connector_url() + "/") and a["addinKey"].startswith("oss_") and a["service"]
    users = {u["bizomat"]: u for u in accounts._users()["users"] if u.get("bizomat")}
    assert swbridge.resolve(a["addinKey"])[1]["id"] == users["alice"]["id"]
    # someone else gets their own keys, never Alice's
    e = call(client, erp, "access", {}, "eve", "co_a", EMPLOYEE).json()
    assert e["addinKey"] != a["addinKey"] and e["privateUrl"] != a["privateUrl"]
    # a new private address and a new key replace the old ones at once
    p2 = call(client, erp, "access/private/new", {}, "alice", "co_a").json()["privateUrl"]
    assert p2 != a["privateUrl"]
    k2 = call(client, erp, "access/addin-key/new", {}, "alice", "co_a").json()["addinKey"]
    assert k2 != a["addinKey"] and swbridge.resolve(a["addinKey"]) == (False, None) and swbridge.resolve(k2)[1]["id"] == users["alice"]["id"]
    # a read-only person has no keys to use
    assert call(client, erp, "access", {}, "rita", "co_a", READER).status_code == 403
    # the add-in package, handed out by the ERP only
    path = "/api/erp/v1/addin/package"
    monkeypatch.setattr(server, "SW_DOWNLOAD", tmp_path / "missing.zip")
    assert client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "alice", "co_a")}).status_code == 404
    zip_ = tmp_path / "addin.zip"
    zip_.write_bytes(b"PK-zip-bytes")
    monkeypatch.setattr(server, "SW_DOWNLOAD", zip_)
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "alice", "co_a")})
    assert r.status_code == 200 and r.content == b"PK-zip-bytes"
    assert client.get(path).status_code == 401
    # the state carries the requests to copy and the service address
    st = call(client, erp, "state", {}, "alice", "co_a").json()
    assert st["examples"] and all(x["group"] and x["items"] for x in st["examples"]) and st["service"]
    # and whether there is an add-in package to offer
    assert st["package"] is True and call(client, erp, "access", {}, "alice", "co_a").json()["package"] is True
    monkeypatch.setattr(server, "SW_DOWNLOAD", tmp_path / "missing.zip")
    assert call(client, erp, "state", {}, "alice", "co_a").json()["package"] is False


def test_sign_in_goes_to_bizomat_while_the_pages_are_in_the_erp(erp, client):
    owner = accounts._users()["users"][0]
    assert client.get("/login", follow_redirects=False).status_code == 200
    _link(owner["id"], ["co_a"], "co_a", redirect=True)
    r = client.get("/login?next=/tools", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/auth/bizomat?next=/tools"
    assert client.get("/login?password=1", follow_redirects=False).status_code == 200  # the owner's way in stays


def test_others_never_see_a_persons_folders_or_file_names():
    for text in (r"Could not open C:\Users\Ann Lee\Parts\My Bracket.SLDPRT: missing", r"Saved to \\srv\share\a.step ok",
                 "C:/x/y z/q.sldasm done"):
        out = erplink._scrub(text)
        assert "Ann" not in out and "Bracket" not in out and "share" not in out and "q.sldasm" not in out, out
        assert "a file" in out
    assert erplink._scrub("Timed out at 10:30") == "Timed out at 10:30"


def test_the_erp_hands_out_the_installer_this_server_holds(erp, client, data):
    from opensketch import brand, store
    st = call(client, erp, "state", {}, "alice", "co_a").json()
    assert st["installer"] == {"available": False}
    path = "/api/erp/v1/installer/file"
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "alice", "co_a")})
    assert r.status_code == 404
    folder = store.data_dir() / "downloads"
    folder.mkdir(parents=True, exist_ok=True)
    msi = b"MSI-bytes-for-a-test" * 100
    (folder / brand.INSTALLER_NAME).write_bytes(msi)
    st = call(client, erp, "state", {}, "alice", "co_a").json()
    assert st["installer"]["available"] and st["installer"]["size"] == len(msi)
    assert st["installer"]["sha256"] == hashlib.sha256(msi).hexdigest()
    r = client.get(path, headers={"Authorization": erp.assertion("GET", path, b"", "alice", "co_a")})
    assert r.status_code == 200 and r.content == msi and r.headers["x-sha256"] == hashlib.sha256(msi).hexdigest()
    assert client.get(path).status_code == 401  # never without the ERP's assertion


# ----------------------------------------------------------------------------- contract 2 (owner's approval, 20 Nov 2026)

def _link2(account_id: str, companies: list[dict], default: str | None = None, retired: bool = False) -> None:
    """The answer of an ERP that speaks contract 2: each company with whether the role may work and download."""
    erplink.apply({"accounts": {account_id: {"userId": "u-" + account_id, "companies": companies, "default": default, "review": False}},
                   "limits": {}, "redirect": False, "passwordRetired": retired}, [])


def test_an_answer_from_before_contract_2_keeps_its_meaning(erp, client):
    owner = accounts._users()["users"][0]
    _link(owner["id"], ["co_a"], "co_a")
    assert erplink.allowed(owner["id"], "co_a") and erplink.may_export(owner["id"], "co_a")
    assert erplink.working_companies(owner["id"]) == erplink.companies_of(owner["id"])
    assert not erplink.password_retired()
    assert erplink.build()["contract"] == 2  # the ERP then names read-only companies too


def test_a_read_only_role_is_refused_in_the_company_never_worked_by_person(erp, client):
    owner = accounts._users()["users"][0]
    pc = _device(owner["id"], "PC", None)
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha", "operate": False, "export": False}], "co_a")
    assert erplink.in_erp(owner["id"]) and not erplink.allowed(owner["id"], "co_a")
    assert erplink.working_companies(owner["id"]) == []
    for grant in ({"id": "g1"}, {"id": "g2", "company": "co_a"}):
        with pytest.raises(erplink.ErpError) as e:
            erplink.company_for_connection(owner["id"], grant)
        assert e.value.code == "READ_ONLY" and "Alpha" in e.value.message
    # earlier computers are not moved into a company where the person may not work
    assert db._q("SELECT company FROM devices WHERE id = ?", (pc,), one=True)["company"] is None
    # read only in one company, working in another: only the working one is offered and allowed
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha", "operate": False, "export": False},
                         {"id": "co_b", "name": "Beta", "operate": True, "export": True}])
    assert [c["id"] for c in erplink.working_companies(owner["id"])] == ["co_b"]
    assert erplink.company_for_connection(owner["id"], {"id": "g3"}) == "co_b"
    with pytest.raises(erplink.ErpError) as e:
        erplink.company_for_connection(owner["id"], {"id": "g4", "company": "co_a"})
    assert e.value.code == "READ_ONLY"


def test_the_consent_page_refuses_a_read_only_role(erp, client):
    owner = accounts._users()["users"][0]
    _signed_in(client)
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha", "operate": False, "export": False}])
    with mock.patch.object(mcpauth, "ensure_client", mock.AsyncMock()), \
            mock.patch.object(mcpauth, "check_authorize", return_value=({"name": "Claude"}, {"redirect_uri": "https://claude.ai/cb"})):
        r = client.get("/oauth/authorize?client_id=x")
    assert r.status_code == 403 and "read only" in r.text and "Alpha" in r.text


def _export(owner: dict, company: str, export: bool):
    """sw_export through the connector, with SOLIDWORKS stood in by _run."""
    from opensketch import sw_tools
    _link2(owner["id"], [{"id": company, "name": "Alpha", "operate": True, "export": export}], company)

    async def run():
        user = mcp_server._mcp_user.set(accounts.public(owner))
        try:
            with tenancy.use(company, {}), \
                    mock.patch.object(sw_tools, "_run", mock.AsyncMock(return_value=({"file": "f", "title": "Bracket"}, {"f": b"ISO-10303-21;"}, None))):
                return await sw_tools.sw_export(format="step")
        finally:
            mcp_server._mcp_user.reset(user)

    return json.loads(asyncio.run(run()).content[0].text)


def test_an_export_has_no_link_where_the_role_may_not_download(erp, client):
    owner = accounts._users()["users"][0]
    out = _export(owner, "co_a", export=False)
    assert "download_url" not in out and "Not allowed" in out["download"]
    item = artifacts.path_of(out["artifact_id"])
    assert item and item[1]["company"] == "co_a"  # kept for the company, where someone who may download can save it
    allowed = _export(owner, "co_a", export=True)
    assert allowed["download_url"].startswith("http")


def test_a_link_download_is_checked_again_and_goes_into_the_companys_history(erp, client):
    owner = accounts._users()["users"][0]
    out = _export(owner, "co_a", export=True)
    path = "/mcp/artifacts/" + out["download_url"].split("/mcp/artifacts/", 1)[1]
    r = client.get(path)
    assert r.status_code == 200 and r.content == b"ISO-10303-21;"
    pending = erplink.state()["downloads"]
    assert len(pending) == 1 and pending[0]["company"] == "co_a" and pending[0]["account"] == owner["id"]
    assert pending[0]["sha256"] == hashlib.sha256(b"ISO-10303-21;").hexdigest() and "url" not in json.dumps(pending[0])
    # the role changed within the hour: the same link is refused
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha", "operate": True, "export": False}], "co_a")
    assert client.get(path).status_code == 403
    # the sync carries the download once; the ERP's answer clears it
    erp.answer = {"accounts": {}, "limits": {}, "redirect": False}
    erplink.sync_once()
    assert erp.syncs[-1]["downloads"][0]["export"] == out["artifact_id"] and erp.syncs[-1]["contract"] == 2
    assert erplink.state()["downloads"] == []
    erplink.sync_once()
    assert erp.syncs[-1]["downloads"] == []


def test_the_sync_counts_waiting_and_running_commands_apart(erp, client):
    owner = accounts._users()["users"][0]
    pc = _device(owner["id"], "PC", "co_a")
    _command(owner["id"], pc, "queued", "co_a")
    _command(owner["id"], pc, "queued", "co_a")
    _command(owner["id"], pc, "running", "co_a")
    _command(owner["id"], pc, "succeeded", "co_a")
    co = next(c for c in erplink.build()["companies"] if c["id"] == "co_a")
    assert (co["queued"], co["running"]) == (2, 1)


def test_password_sign_in_is_retired_only_while_the_erp_says_so(erp, client):
    owner = accounts._users()["users"][0]
    accounts.set_open_signup(True)
    assert client.get("/login?password=1", follow_redirects=False).status_code == 200
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha"}], "co_a", retired=True)
    assert erplink.password_retired()
    r = client.get("/login?password=1&next=/tools", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/auth/bizomat?next=/tools"
    r = client.post("/login", data={"email": "owner@example.com", "password": "a-long-password-1", "next": "/tools"}, follow_redirects=False)
    assert r.status_code == 403 and "retired" in r.text and 'action="/auth/bizomat"' in r.text and 'value="/tools"' in r.text
    assert "set-cookie" not in {k.lower() for k in r.headers}
    r = client.get("/signup", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"].startswith("/auth/bizomat")
    r = client.get("/join/abc", follow_redirects=False)
    assert r.status_code == 303 and "invite=abc" in r.headers["location"]
    # the Companion's password pairing is refused with the way to pair instead
    with mock.patch.object(db, "authenticate", return_value={"id": "p", "code": "C", "status": "pending", "expires": time.time() + 60}):
        r = client.post("/v2/devices/pair/password", json={"email": "owner@example.com", "password": "a-long-password-1"})
    assert r.status_code == 403 and r.json()["error"]["code"] == "PASSWORD_RETIRED" and "Pair a computer" in r.json()["error"]["message"]
    # a stale answer counts for nothing: password sign-in works again (the ERP cannot be reached)
    erplink.state()["at"] = time.time() - erplink.FRESH - 1
    assert not erplink.password_retired()
    assert client.get("/login?password=1", follow_redirects=False).status_code == 200
    # and the ERP switching the flag off brings it back at once
    _link2(owner["id"], [{"id": "co_a", "name": "Alpha"}], "co_a", retired=False)
    _signed_in(client)
