"""The status report to BIZOMAT ERP (opensketch/erpstatus.py): off without the BIZOMAT client secret and on a server
without accounts; HTTP Basic with the client cad; only accounts whose email is proven; nothing secret in the body;
every text and list within the ERP's limits (checked by a stand-in for the ERP's endpoint that applies the ERP's own
rules); a withdrawn account; failures that back off and never stop the server; the work in its own thread, never on
the event loop; changes reported soon; the owner's status line."""
import asyncio
import base64
import json
import re
import secrets
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

import anyio
import httpx
import pytest
from fastapi.testclient import TestClient

from opensketch import accounts, auth, devicebridge as db, erpstatus, mcpauth, server, swbridge

SECRET = "e" * 24 + "f" * 24  # 48 characters, as `openssl rand -hex 24` gives


# ----------------------------------------------------------------------------- a stand-in for the ERP's endpoint

_ZOD_EMAIL = re.compile(r"(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}")
TIME_MAX = 4_102_444_800_000


def _u16(s: str) -> int:
    return len(s.encode("utf-16-le")) // 2


def problems(body) -> list[str]:
    """The ERP's rules (bizomat-site apps/work/src/worker/company/id-provider.ts, cadReport), plus: no key the
    contract does not have, and never the open document's name."""
    out: list[str] = []

    def text(v, n, path, required=True, nullable=False):
        if v is None and (nullable or not required):
            return
        if not isinstance(v, str) or _u16(v.strip()) > n:
            out.append(path)

    def when(v, path, nullable=True):
        if v is None and nullable:
            return
        if not isinstance(v, int) or isinstance(v, bool) or not 0 <= v <= TIME_MAX:
            out.append(path)

    def keys(o, allowed, path):
        if not isinstance(o, dict) or set(o) - set(allowed):
            out.append(path + " keys")

    keys(body, {"accounts"}, "body")
    accs = body.get("accounts") if isinstance(body, dict) else None
    if not isinstance(accs, list) or len(accs) > 500:
        return out + ["accounts"]
    for i, a in enumerate(accs):
        p = f"accounts.{i}"
        keys(a, {"email", "emailVerified", "sub", "computers", "jobs", "assistants"}, p)
        e = a.get("email")
        if not isinstance(e, str) or len(e.strip()) > 254 or not _ZOD_EMAIL.fullmatch(e.strip()):
            out.append(p + ".email")
        if not isinstance(a.get("emailVerified"), bool):
            out.append(p + ".emailVerified")
        text(a.get("sub"), 64, p + ".sub", nullable=True)
        for name, limit in (("computers", 20), ("jobs", 20), ("assistants", 20)):
            if not isinstance(a.get(name), list) or len(a[name]) > limit:
                out.append(f"{p}.{name}")
                return out
        for j, c in enumerate(a["computers"]):
            q = f"{p}.computers.{j}"
            keys(c, {"name", "online", "solidworks", "addin", "lastSeen"}, q)  # never "open"
            text(c.get("name"), 100, q + ".name")
            if not isinstance(c.get("online"), bool):
                out.append(q + ".online")
            text(c.get("solidworks"), 60, q + ".solidworks", required=False)
            text(c.get("addin"), 20, q + ".addin", required=False)
            when(c.get("lastSeen"), q + ".lastSeen")
        for j, x in enumerate(a["jobs"]):
            q = f"{p}.jobs.{j}"
            keys(x, {"id", "tool", "status", "at"}, q)
            text(x.get("id"), 64, q + ".id")
            text(x.get("tool"), 60, q + ".tool")
            text(x.get("status"), 30, q + ".status")
            when(x.get("at"), q + ".at", nullable=False)
        for j, x in enumerate(a["assistants"]):
            q = f"{p}.assistants.{j}"
            keys(x, {"app", "connectedAt", "lastUsed"}, q)
            text(x.get("app"), 60, q + ".app")
            when(x.get("connectedAt"), q + ".connectedAt")
            when(x.get("lastUsed"), q + ".lastUsed")
    return out


class FakeERP:
    """POST /company/api/id/cad-status as the ERP answers it: 401 for a wrong secret, 403 for another client, 400 for
    a body outside its rules, 200 and each account's report kept by email."""

    def __init__(self, secret: str = SECRET):
        self.secret = secret
        self.requests: list[dict] = []
        self.rows: dict[str, dict] = {}
        self.mode = "ok"            # ok, 500, 429
        self.hold: threading.Event | None = None
        erp = self

        class H(BaseHTTPRequestHandler):
            def log_message(self, *a):
                pass

            def _send(self, status, body, headers=None):
                raw = json.dumps(body).encode()
                self.send_response(status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(raw)))
                for k, v in (headers or {}).items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(raw)

            def do_POST(self):
                raw = self.rfile.read(int(self.headers.get("Content-Length") or 0))
                rec = {"path": self.path, "auth": self.headers.get("Authorization"), "raw": raw,
                       "type": self.headers.get("Content-Type")}
                erp.requests.append(rec)
                if erp.hold is not None:
                    erp.hold.wait(10)
                if self.path != "/company/api/id/cad-status":
                    return self._send(404, {"error": "Not found"})
                if erp.mode == "500":
                    return self._send(500, {"error": "Internal server error"})
                if erp.mode == "429":
                    return self._send(429, {"error": "Too many attempts."}, {"Retry-After": "600"})
                a = rec["auth"] or ""
                try:
                    cid, sec = (unquote(x) for x in base64.b64decode(a[6:]).decode().split(":"))
                except Exception:
                    return self._send(401, {"error": "invalid_client"})
                if not a.startswith("Basic ") or sec != erp.secret:
                    return self._send(401, {"error": "invalid_client"})
                if cid != "cad":
                    return self._send(403, {"error": "unauthorized_client"})
                try:
                    body = json.loads(raw)
                except ValueError:
                    return self._send(400, {"error": "Request body must be valid JSON"})
                bad = problems(body)
                rec["problems"] = bad
                if bad:
                    return self._send(400, {"error": "Invalid request", "details": [{"path": bad[0], "message": "Too big"}]})
                for acc in body["accounts"]:
                    erp.rows[acc["email"].lower()] = acc
                return self._send(200, {"ok": True, "accounts": len(body["accounts"])})

        self.srv = ThreadingHTTPServer(("127.0.0.1", 0), H)
        self.th = threading.Thread(target=self.srv.serve_forever, daemon=True)
        self.th.start()
        self.url = f"http://127.0.0.1:{self.srv.server_address[1]}/company"

    def bodies(self) -> list[dict]:
        return [json.loads(r["raw"]) for r in self.requests]

    def close(self):
        if self.hold is not None:
            self.hold.set()
        self.srv.shutdown()
        self.srv.server_close()


@pytest.fixture(autouse=True)
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "BIZOMAT_ID_CLIENT_SECRET", "BIZOMAT_ID_CLIENT_ID",
              "BIZOMAT_ID_URL", "BIZOMAT_SITE_URL", "OPENSKETCH_PUBLIC_URL"):
        monkeypatch.delenv(k, raising=False)
    swbridge.reset_for_tests()
    yield tmp_path
    erpstatus.stop()
    swbridge.reset_for_tests()


@pytest.fixture()
def erp(monkeypatch):
    f = FakeERP()
    monkeypatch.setenv("BIZOMAT_ID_URL", f.url)
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    yield f
    f.close()


def _owner(email="owner@example.com"):
    return accounts.create_owner(email, "Owner", "a-long-password-1")


def _invited(email, name, **link):
    """A member who joined from an invite, signing in with Google or BIZOMAT (both prove the email)."""
    token = accounts.create_invite("owner")
    return accounts.accept_invite(token, email, name, None, **link)


def _grant(uid: str, name: str, used: int = 0) -> dict:
    """An AI app connected to the account, with real tokens (they must never be reported)."""
    with mcpauth._lock:
        d = mcpauth._load()
        gid = "osg_" + secrets.token_urlsafe(12)
        now = int(time.time())
        d["grants"][gid] = {"user": uid, "client_id": "c" + gid, "name": name, "host": "claude.ai", "resource": "r",
                            "created": now - 3600, "last_used": now + used}
        toks = mcpauth._new_tokens(d, gid)
        mcpauth._save(d)
    return toks


def _device(uid: str, name: str, created: float | None = None, info: dict | None = None) -> str:
    did = db.ulid("dev")
    db._exec("INSERT INTO devices (id, owner, name, jwk, jkt, created, last_seen, is_default, info) VALUES (?,?,?,?,?,?,?,?,?)",
             (did, uid, name, "{}", "jkt-" + did, created or time.time(), None, 0, json.dumps(info or {})))
    return did


def _command(uid: str, did: str, tool: str, status: str, t: float) -> str:
    cid = db.ulid("cmd")
    db._exec("INSERT INTO commands (id, device_id, owner, tool, op, effect, risk, params_sha256, status, created, expires,"
             " updated, attempts, history, correlation, client) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
             (cid, did, uid, tool, "read", "read", "low", "sha256:" + "0" * 64, status, t, t + 60, t, 1, "[]", "cor", "Claude"))
    return cid


def _free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


@pytest.fixture()
def base(monkeypatch):
    import uvicorn
    port = _free_port()
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", f"http://127.0.0.1:{port}")
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=port, log_level="error", lifespan="off"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    url = f"http://127.0.0.1:{port}"
    for _ in range(100):
        try:
            httpx.get(url + "/healthz", timeout=1)
            break
        except httpx.HTTPError:
            time.sleep(0.05)
    yield url
    srv.should_exit = True
    th.join(5)


def _wait(cond, seconds=8.0):
    end = time.time() + seconds
    while time.time() < end:
        if cond():
            return True
        time.sleep(0.05)
    return False


# ----------------------------------------------------------------------------- on and off

def test_off_without_the_secret_and_without_accounts(monkeypatch):
    f = FakeERP()
    try:
        monkeypatch.setenv("BIZOMAT_ID_URL", f.url)
        _owner()
        assert not erpstatus.enabled() and erpstatus.start() is None
        assert erpstatus.status()["on"] is False
        with TestClient(server.app):  # the server's start makes no reporter
            assert not any(t.name == "erp-status" for t in threading.enumerate())
        assert erpstatus.Reporter().round() is False
        for bad in ("short", "has a space" + "x" * 40):
            monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", bad)
            assert not erpstatus.enabled() and erpstatus.Reporter().round() is False
        assert f.requests == []
    finally:
        f.close()


def test_nothing_is_sent_by_a_server_without_accounts(erp):
    assert erpstatus.enabled()
    assert erpstatus.Reporter().round() is False
    assert erp.requests == []


# ----------------------------------------------------------------------------- who is reported, and how

def test_only_proven_emails_are_reported_with_the_cad_client(erp):
    owner = _owner()
    accounts.set_open_signup(True)
    accounts.create_member("typed@example.com", "Typed Member", "a-long-password-2")       # typed by the owner
    linked = _invited("linked@example.com", "Linked Member", bizomat="bz-user-123")          # BIZOMAT sign-in
    _invited("google@example.com", "Google Member", google="g-123")                          # Google sign-in
    accounts.sign_up("signedup@example.com", "Signed Up", "a-long-password-3")              # typed at sign-up
    accounts.create_tester()                                                                 # early access
    _invited("odd@example.c", "Odd Address", google="g-456")  # proven, but the ERP would refuse the address
    rep = erpstatus.Reporter()
    assert rep.round() is True
    assert len(erp.requests) == 1
    req = erp.requests[0]
    assert req["path"] == "/company/api/id/cad-status" and req["type"] == "application/json"
    assert req["auth"] == "Basic " + base64.b64encode(f"cad:{SECRET}".encode()).decode()
    assert req["problems"] == []
    got = {a["email"]: a for a in erp.bodies()[0]["accounts"]}
    assert set(got) == {"owner@example.com", "linked@example.com", "google@example.com"}
    assert all(a["emailVerified"] is True for a in got.values())
    assert got["linked@example.com"]["sub"] == "bz-user-123" and got["owner@example.com"]["sub"] is None
    st = rep.status()
    assert st["on"] and st["accounts"] == 3 and st["left_out"] == 4 and st["last_error"] is None and st["last_ok"]
    # an account that proves its email later (a BIZOMAT sign-in links it) is reported from then on
    accounts.bizomat_user("bz-user-999", "typed@example.com", True)
    assert rep.round() is True
    assert "typed@example.com" in {a["email"] for a in erp.bodies()[-1]["accounts"]}
    assert linked["id"] and owner["id"]


def test_computers_jobs_and_assistants_as_the_erp_takes_them(erp, base):
    from tests.bridge_fakes import FakeCompanion
    from tests.test_devicebridge import Canned
    from tests.test_swbridge import FakeAddin
    owner = _owner()
    toks = _grant(owner["id"], "Claude")
    pc = FakeCompanion(base, Canned(), name="DESK-01", approve_as=owner)
    addin = FakeAddin(base, swbridge.key_for(owner))
    try:
        off = _device(owner["id"], "OLD-LAPTOP", created=time.time() - 86400,
                      info={"installations": [{"year": 2024, "revision": "32.1.0", "path": "C:\\Program Files\\SW"}]})
        body, _ = anyio.run(lambda: swbridge.call(owner, "status", {}, 10, device="DESK-01", tool="sw_status"))
        assert body["ok"]
        assert erpstatus.Reporter().round() is True
        raw = erp.requests[-1]["raw"].decode()
        assert erp.requests[-1]["problems"] == []
        acc = erp.bodies()[-1]["accounts"][0]
        pcs = {c["name"]: c for c in acc["computers"]}
        assert set(pcs) == {"DESK-01", "OLD-LAPTOP", "TESTPC (direct link)"}
        desk = pcs["DESK-01"]
        assert desk["online"] is True and desk["solidworks"] == "2022 SP5, ready" and desk["addin"] == "0.11.0"
        assert abs(desk["lastSeen"] - time.time() * 1000) < 60_000
        assert pcs["OLD-LAPTOP"] == {"name": "OLD-LAPTOP", "online": False, "solidworks": "2024 installed",
                                     "lastSeen": pcs["OLD-LAPTOP"]["lastSeen"]}
        assert pcs["TESTPC (direct link)"]["online"] is True and pcs["TESTPC (direct link)"]["addin"] == "0.10.0"
        assert [c["online"] for c in acc["computers"]] == [True, True, False]  # online first
        job = acc["jobs"][0]
        assert job["tool"] == "Connection status" and job["status"] == "succeeded" and job["id"].startswith("cmd_")
        assert acc["assistants"][0]["app"] == "Claude" and acc["assistants"][0]["lastUsed"] > acc["assistants"][0]["connectedAt"]
        # nothing secret or private: no key, token, client secret, file name, path or Windows version
        for never in (SECRET, swbridge.key_for(owner), auth.mcp_token_for(owner), toks["access_token"],
                      toks["refresh_token"], "Box.SLDPRT", "C:\\", "C:\\\\", "Program Files", "Windows 11", "jwk",
                      "a-long-password-1", off):
            assert never not in raw, never
    finally:
        addin.stop = True
        pc.close()


def test_every_text_and_list_stays_within_the_erp_limits(erp, monkeypatch):
    owner = _owner()
    long = "N\x07ame " + "\U0001F600" * 80 + " end"   # control character, then 160 UTF-16 units of emoji
    now = time.time()
    for i in range(25):
        did = _device(owner["id"], f"PC-{i:02d}", created=now - i)
        if i < 3:  # stored as it is, past the pairing page's own cleaning
            db._exec("UPDATE devices SET name=? WHERE id=?", (long + str(i), did))
        _command(owner["id"], did, "sw_add_features", "succeeded", now - i)
    for i in range(25):
        _grant(owner["id"], f"App {i} " + "x" * 100)
    _grant(owner["id"], "osa_" + "A" * 40, used=60)  # a name shaped like a token is never sent as it is
    assert erpstatus.Reporter().round() is True
    assert erp.requests[-1]["problems"] == []
    acc = erp.bodies()[-1]["accounts"][0]
    assert len(acc["computers"]) == 20 and len(acc["jobs"]) == erpstatus.JOBS and len(acc["assistants"]) == 20
    names = [c["name"] for c in acc["computers"]]
    assert all(_u16(n) <= 100 for n in names) and all("\x07" not in n for n in names)
    assert "osa_" + "A" * 40 not in erp.requests[-1]["raw"].decode() and acc["assistants"][0]["app"] == "AI app"
    # many accounts: requests of at most BATCH accounts, each one the ERP takes
    fake = [{"id": owner["id"], "email": "owner@example.com", "bizomat": None}] + [
        {"id": f"u{i}", "email": f"person{i}@example.com", "bizomat": None} for i in range(229)]
    monkeypatch.setattr(accounts, "confirmed_accounts", lambda: fake)
    erp.requests.clear()
    assert erpstatus.Reporter().round() is True
    assert [len(b["accounts"]) for b in erp.bodies()] == [100, 100, 30]
    assert all(r["problems"] == [] for r in erp.requests)
    # and a byte limit per request
    monkeypatch.setattr(erpstatus, "MAX_BYTES", 2000)
    parts = erpstatus.batches([erpstatus.withdrawal(f"p{i}@example.com") for i in range(40)])
    assert len(parts) > 1 and all(len(json.dumps({"accounts": p}, separators=(",", ":"))) <= 2000 for p in parts)
    assert sum(len(p) for p in parts) == 40


def test_text_helpers():
    assert erpstatus.fit("  a\x00b  ", 10) == "a b"
    assert erpstatus.fit("\U0001F600" * 3, 4) == "\U0001F600" * 2  # counted in UTF-16 units, as the ERP counts
    assert erpstatus.fit("Bearer " + "x" * 30, 60) == "" and erpstatus.fit("oss_" + "a" * 40, 60) == ""
    assert erpstatus.sw_release("30.5.0") == "2022 SP5" and erpstatus.sw_release("32.0.1") == "2024 SP0"
    assert erpstatus.sw_release("") == "" and erpstatus.sw_release("12.1") == ""
    assert erpstatus.email_ok("a.b+c@example.com") and not erpstatus.email_ok("a@b.c")
    assert not erpstatus.email_ok("a..b@example.com") and not erpstatus.email_ok("x" * 250 + "@example.com")
    assert erpstatus.basic("cad", "p:%+") == "Basic " + base64.b64encode(b"cad:p%3A%25%2B").decode()


def test_an_account_no_longer_reported_is_withdrawn_once(erp):
    _owner()
    gone = _invited("leaver@example.com", "Leaver", bizomat="bz-leaver")
    rep = erpstatus.Reporter()
    assert rep.round() is True
    assert "leaver@example.com" in erp.rows and erp.rows["leaver@example.com"]["sub"] == "bz-leaver"
    accounts.remove(gone["id"], by="owner")
    assert rep.round() is True
    last = {a["email"]: a for a in erp.bodies()[-1]["accounts"]}
    assert last["leaver@example.com"] == {"email": "leaver@example.com", "emailVerified": False, "sub": None,
                                          "computers": [], "jobs": [], "assistants": []}
    assert erp.rows["leaver@example.com"]["emailVerified"] is False
    assert erpstatus.Reporter().reported == {"owner@example.com"}  # kept in the data folder across a restart
    assert rep.round() is True
    assert [a["email"] for a in erp.bodies()[-1]["accounts"]] == ["owner@example.com"]


# ----------------------------------------------------------------------------- failures

def test_failures_back_off_and_say_why(erp, monkeypatch):
    _owner()
    rep = erpstatus.Reporter()
    erp.mode = "500"
    t0 = time.monotonic()
    assert rep.round() is False
    st = rep.status()
    assert st["last_error"]["message"] == "BIZOMAT ERP answered 500." and st["failures"] == 1 and st["last_ok"] is None
    assert rep._hold_until - t0 >= erpstatus.BACKOFF_FIRST - 1
    assert rep.round() is False and rep._hold_until - time.monotonic() >= 2 * erpstatus.BACKOFF_FIRST - 1
    erp.mode = "429"
    assert rep.round() is False and "429" in rep.last_error["message"] and rep._hold_until - time.monotonic() >= 590
    erp.mode = "ok"
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", "w" * 40)
    assert rep.round() is False and "401" in rep.last_error["message"] and "same secret" in rep.last_error["message"]
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_ID", "cad-test")
    assert rep.round() is False and "403" in rep.last_error["message"]
    monkeypatch.delenv("BIZOMAT_ID_CLIENT_ID")
    real = erpstatus.account_report
    monkeypatch.setattr(erpstatus, "account_report",
                        lambda a: dict(erpstatus.withdrawal(a["email"]), computers=[{"name": "x" * 101, "online": True}]))
    assert rep.round() is False
    assert rep.last_error["message"].startswith("BIZOMAT ERP refused the report (400: accounts.0.computers.0.name")
    monkeypatch.setattr(erpstatus, "account_report", real)
    assert rep.round() is True
    st = rep.status()
    assert st["failures"] == 0 and st["last_ok"] and rep._hold_until == 0.0
    # nobody listening, and an ERP that does not answer in time
    monkeypatch.setenv("BIZOMAT_ID_URL", f"http://127.0.0.1:{_free_port()}/company")
    assert rep.round() is False and rep.last_error["message"].startswith("Could not reach BIZOMAT ERP")
    monkeypatch.setenv("BIZOMAT_ID_URL", erp.url)
    monkeypatch.setattr(erpstatus, "TIMEOUT", 0.3)
    erp.hold = threading.Event()
    assert rep.round() is False and "did not answer within" in rep.last_error["message"]
    erp.hold.set()
    # an error inside the reporter is caught too
    monkeypatch.setattr(erpstatus, "build", lambda: 1 / 0)
    assert rep.round() is False and "accounts" in rep.last_error["message"]


def test_the_thread_survives_failures_and_recovers(erp, monkeypatch):
    _owner()
    for k, v in (("FIRST", 0.0), ("CHECK", 0.05), ("DEBOUNCE", 0.05), ("MIN_GAP", 0.05), ("BACKOFF_FIRST", 0.1),
                 ("INTERVAL", 0.2)):
        monkeypatch.setattr(erpstatus, k, v)
    erp.mode = "500"
    r = erpstatus.start()
    assert r is not None and r.alive()
    assert _wait(lambda: r.failures >= 3)
    assert r.alive()
    erp.mode = "ok"
    assert _wait(lambda: r.failures == 0 and r.last_ok)
    assert r.alive()
    erpstatus.stop()
    assert _wait(lambda: not r.alive(), 3)


# ----------------------------------------------------------------------------- off the event loop

def test_reports_run_in_their_own_thread_and_never_hold_up_the_server(erp, monkeypatch):
    _owner()
    monkeypatch.setattr(erpstatus, "FIRST", 0.0)
    seen = []
    real = erpstatus.post

    def spy(*a, **k):
        try:
            asyncio.get_running_loop()
            loop = True
        except RuntimeError:
            loop = False
        seen.append((threading.current_thread().name, loop))
        return real(*a, **k)

    monkeypatch.setattr(erpstatus, "post", spy)
    erp.hold = threading.Event()  # the ERP takes its time
    with TestClient(server.app) as c:
        assert _wait(lambda: erp.requests)
        t = time.monotonic()
        assert c.get("/healthz").status_code == 200
        assert time.monotonic() - t < 1.0  # the server answers while a report waits for the ERP
        erp.hold.set()
        assert _wait(lambda: erpstatus.status().get("last_ok"))
    assert seen and all(name == "erp-status" and not loop for name, loop in seen)
    assert _wait(lambda: not any(t.name == "erp-status" and t.is_alive() for t in threading.enumerate()), 3)


def test_changed_only_sets_a_flag():
    r = erpstatus.Reporter()
    erpstatus._reporter = r
    try:
        t = time.perf_counter()
        for _ in range(1000):
            erpstatus.changed()
        assert time.perf_counter() - t < 0.5 and r._dirty is not None and r._wake.is_set()
    finally:
        erpstatus._reporter = None


# ----------------------------------------------------------------------------- changes are reported soon

def test_a_computer_connecting_dropping_off_and_a_finished_job_are_reported_soon(erp, base, monkeypatch):
    from tests.bridge_fakes import FakeCompanion
    from tests.test_devicebridge import Canned
    owner = _owner()
    for k, v in (("FIRST", 600.0), ("INTERVAL", 600.0), ("CHECK", 0.1), ("DEBOUNCE", 0.1), ("MIN_GAP", 0.2)):
        monkeypatch.setattr(erpstatus, k, v)
    r = erpstatus.start()

    def last_pc():
        rows = erp.rows.get("owner@example.com") or {}
        return (rows.get("computers") or [{}])[0], rows.get("jobs") or []

    pc = FakeCompanion(base, Canned(), name="DESK-01", approve_as=owner)  # pairing and hello: a change
    try:
        assert _wait(lambda: last_pc()[0].get("online") is True)
        n = len(erp.requests)
        anyio.run(lambda: swbridge.call(owner, "status", {}, 10, tool="sw_status"))
        assert _wait(lambda: last_pc()[1] and last_pc()[1][0]["status"] == "succeeded")
        assert len(erp.requests) > n
    finally:
        pc.close()
    db._sessions[pc.device_id].last_seen -= 3600  # it stopped polling: no event, the reporter notices
    assert _wait(lambda: last_pc()[0].get("online") is False)
    assert r.alive() and r.failures == 0


# ----------------------------------------------------------------------------- the owner sees it

def test_the_admin_page_shows_the_status(erp, monkeypatch):
    c = TestClient(server.app)
    c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "a-long-password-1", "next": "/"})
    monkeypatch.delenv("BIZOMAT_ID_CLIENT_SECRET")
    assert c.get("/api/admin/people").json()["erp"]["on"] is False
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    st = c.get("/api/admin/people").json()["erp"]
    assert st["on"] is True and st["address"] == erp.url + "/api/id/cad-status" and st["last_ok"] is None
    assert erpstatus.Reporter().round() is True
    st = c.get("/api/admin/people").json()["erp"]
    assert st["last_ok"] and st["accounts"] == 1 and st["last_error"] is None and SECRET not in json.dumps(st)
    page = c.get("/admin").text
    assert "BIZOMAT ERP" in page and 'id="erp-state"' in page
    # people who are not the owner see none of it
    accounts.create_member("member@example.com", "Member", "a-long-password-2")
    m = TestClient(server.app)
    m.post("/login", data={"email": "member@example.com", "password": "a-long-password-2", "next": "/"})
    assert m.get("/api/admin/people").status_code == 403


def test_the_privacy_notice_says_what_goes_to_the_erp():
    page = TestClient(server.app).get("/privacy").text
    assert 'id="erp"' in page and "BIZOMAT ERP" in page and "confirmed" in page


# ----------------------------------------------------------------------------- end to end, with the real ERP

def _work_app() -> str | None:
    """The BIZOMAT work app (kevinjogin/bizomat-site, apps/work, built with `npm run build:node`), named by
    BIZOMAT_WORK_APP. Without it this test is skipped: it is a check to run by hand before a release."""
    import os
    import shutil
    path = os.environ.get("BIZOMAT_WORK_APP", "").strip()
    if not path or not os.path.isfile(os.path.join(path, "dist", "node", "server.mjs")) or not shutil.which("node"):
        return None
    return path


@pytest.fixture()
def work(tmp_path):
    import hashlib
    import os
    import subprocess
    path = _work_app()
    if path is None:
        pytest.skip("set BIZOMAT_WORK_APP to the BIZOMAT work app (apps/work, built) to run this test")
    port = _free_port()
    base = f"http://127.0.0.1:{port}"
    data = tmp_path / "work"
    clients = [{"id": "cad", "name": "CAD Automation", "secretSha256": hashlib.sha256(SECRET.encode()).hexdigest(),
                "redirectUris": ["http://127.0.0.1:9/auth/bizomat/callback"]}]
    env = dict(os.environ, ENVIRONMENT="development", APP_URL=base, PORT=str(port), HOST="127.0.0.1", WORK_DATA_DIR=str(data),
               WORK_STATIC_DIR=os.path.join(path, "dist", "client"), WORK_CRON="0", ALLOW_SIGNUP="true",
               BIZOMAT_ID_CLIENTS=json.dumps(clients))
    proc = subprocess.Popen(["node", os.path.join(path, "dist", "node", "server.mjs")], env=env, cwd=path,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        assert _wait(lambda: _up(base + "/company/api/health"), 30), "the work app did not start"
        yield base, data / "db.sqlite"
    finally:
        proc.terminate()
        proc.wait(10)


def _up(url: str) -> bool:
    try:
        return httpx.get(url, timeout=1).status_code == 200
    except httpx.HTTPError:
        return False


def _abn() -> str:
    import random
    weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    while True:
        n = str(random.randint(10, 98)) + str(random.randint(0, 10 ** 9 - 1)).zfill(9)
        d = [int(x) for x in n]
        d[0] -= 1
        if sum(a * b for a, b in zip(weights, d)) % 89 == 0:
            return n


@pytest.mark.slow
def test_the_real_erp_shows_each_report_to_the_right_people(work, monkeypatch):
    """CAD Automation reports to the real BIZOMAT work app (its /company/api/id/cad-status), and BIZOMAT ERP shows each
    computer to the right people: a registered company's owner and administrator see everyone's, a member their own,
    another company nothing, and an account whose email CAD Automation never proved shows nowhere."""
    import sqlite3
    base, db_file = work

    def person(name, email):
        c = httpx.Client(base_url=base, headers={"Origin": base}, timeout=20)
        r = c.post("/tasks/api/auth/signup", json={"email": email, "name": name, "password": "correct-horse-42!"})
        assert r.status_code == 201, r.text
        d = r.json()
        c.headers["X-CSRF-Token"] = d["csrfToken"]
        con = sqlite3.connect(str(db_file), timeout=10)  # confirm the email, as the link in the email would
        con.execute("UPDATE users SET email_verified_at = ? WHERE id = ?", (int(time.time() * 1000), d["user"]["id"]))
        con.commit()
        con.close()
        return c, d["user"]["id"]

    cora, _ = person("Cora Owner", "cora@example.com")
    abe, _ = person("Abe Admin", "abe@example.com")
    mia, mia_id = person("Mia Member", "mia@example.com")
    tia, _ = person("Tia Typed", "tia@example.com")
    oz, _ = person("Oz Outsider", "oz@example.com")
    r = cora.post("/company/api/company/companies", json={
        "kind": "business", "name": "Cora Engineering", "legalName": "", "abn": _abn(), "acn": "", "email": "accounts@example.com",
        "phone": "(02) 9876 5432", "addressLine1": "12 Example Street", "addressLine2": "", "suburb": "Sydney", "state": "NSW",
        "postcode": "2000", "website": ""})
    assert r.status_code == 201, r.text
    co = r.json()["company"]["id"]
    for c, email, role in ((abe, "abe@example.com", "admin"), (mia, "mia@example.com", "member"), (tia, "tia@example.com", "member")):
        inv = cora.post(f"/company/api/company/c/{co}/invitations",
                        json={"email": email, "role": role, "tasksRole": "member", "crmRole": None, "finRole": None})
        assert inv.status_code in (200, 201), inv.text
        token = unquote(inv.json()["url"].split("/join/")[1])
        assert c.post(f"/company/api/company/invitations/{token}/accept", json={}).status_code in (200, 201)

    # CAD Automation's own accounts: the owner (set up with this email), Abe and Oz with a Google sign-in, Mia linked to
    # her BIZOMAT account under another email, and Tia typed in by the owner (never proven)
    owner = _owner("cora@example.com")
    abe_cad = _invited("abe@example.com", "Abe", google="g-abe")
    mia_cad = _invited("mia.cad@example.com", "Mia", bizomat=mia_id)
    tia_cad = accounts.create_member("tia@example.com", "Tia", "a-long-password-2")
    oz_cad = _invited("oz@example.com", "Oz", google="g-oz")
    for u, pc in ((owner, "CORA-PC"), (abe_cad, "ABE-PC"), (mia_cad, "MIA-PC"), (tia_cad, "TIA-PC"), (oz_cad, "OZ-PC")):
        _device(u["id"], pc)
    monkeypatch.setenv("BIZOMAT_ID_URL", base + "/company")
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    rep = erpstatus.Reporter()
    assert rep.round() is True, rep.last_error

    def pcs(c, company):
        r = c.get(f"/erp/api/system/companies/{company}/cad")
        if r.status_code != 200:
            return r.status_code
        return sorted(m["name"] for p in r.json()["people"] for m in ((p.get("status") or {}).get("computers") or []))

    assert pcs(cora, co) == ["ABE-PC", "CORA-PC", "MIA-PC"]
    assert pcs(abe, co) == ["ABE-PC", "CORA-PC", "MIA-PC"]
    assert pcs(mia, co) == ["MIA-PC"]
    assert pcs(tia, co) == []
    assert pcs(oz, co) == 404
    own = next(c for c in oz.get("/erp/api/system/me").json()["companies"] if c["kind"] == "own")
    assert pcs(oz, own["id"]) == ["OZ-PC"]
    # a wrong secret is refused, and the reporter says so
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", "w" * 48)
    assert rep.round() is False and "401" in rep.last_error["message"]
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    # Mia's CAD account is removed: her report is withdrawn and the company no longer sees her computer
    accounts.remove(mia_cad["id"], by="owner")
    assert rep.round() is True, rep.last_error
    assert pcs(cora, co) == ["ABE-PC", "CORA-PC"] and pcs(mia, co) == []
