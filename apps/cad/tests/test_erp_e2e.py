"""CAD Automation inside BIZOMAT ERP, end to end: the real BIZOMAT work app (kevinjogin/bizomat-site, apps/work, built
with `npm run build`, run on Node as production runs it, with its own SQLite database and migrations), this engine over
HTTP, and the stand-in Companion (tests/bridge_fakes.py) paired through the ERP. It replaces the staging walk (the owner
retired staging on 20 Nov 2026; the audit of that day, decision 1).

Skipped unless BIZOMAT_WORK_APP names the built work app: a check to run by hand before a release, as
tests/test_erpstatus.py's real-ERP test is. Covers the brief's Part 9 tests 1 to 3, 5 to 8, 13 and 15, and contract 2:
one sign-in, the module only for permitted people, company isolation, downloads by role (in the ERP and through an AI
assistant's link), work written to its own company, the migration of earlier work, old pages into the ERP, fair-use
limits, read-only roles refused, password sign-in retired and back, and the rollback."""
import base64
import hashlib
import json
import os
import secrets
import shutil
import socket
import sqlite3
import subprocess
import threading
import time
from urllib.parse import unquote

import httpx
import pytest

from opensketch import accounts, auth, devicebridge as db, erplink, server, swbridge
from tests.bridge_fakes import FakeCompanion
from tests.mcp_reply import rpc

SECRET = "e2e-" + "s" * 40
STEP = b"ISO-10303-21;\nHEADER;\nENDSEC;\nDATA;\nENDSEC;\nEND-ISO-10303-21;\n"


def _work_app() -> str | None:
    path = os.environ.get("BIZOMAT_WORK_APP", "").strip()
    if not path or not os.path.isfile(os.path.join(path, "dist", "node", "server.mjs")) or not shutil.which("node"):
        return None
    return path


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def _wait(cond, seconds=30.0) -> bool:
    end = time.time() + seconds
    while time.time() < end:
        try:
            if cond():
                return True
        except httpx.HTTPError:
            pass
        time.sleep(0.1)
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


@pytest.fixture()
def data(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "cad"))
    for k in ("OPENSKETCH_PASSWORD", "OPENSKETCH_MCP_TOKEN", "BIZOMAT_ID_CLIENT_ID", "OPENSKETCH_MCP_URL"):
        monkeypatch.delenv(k, raising=False)
    monkeypatch.setenv("OPENSKETCH_EVIDENCE_SCAN", "0")
    swbridge.reset_for_tests()
    erplink.reset_for_tests()
    yield tmp_path
    erplink.reset_for_tests()
    swbridge.reset_for_tests()


@pytest.fixture()
def stack(data, monkeypatch):
    """The work app on Node and this engine over HTTP, each told the other's address."""
    import uvicorn
    path = _work_app()
    if path is None:
        pytest.skip("set BIZOMAT_WORK_APP to the BIZOMAT work app (apps/work, built) to run this test")
    work_port, cad_port = _free_port(), _free_port()
    work, cad = f"http://127.0.0.1:{work_port}", f"http://127.0.0.1:{cad_port}"
    clients = [{"id": "cad", "name": "CAD Automation", "secretSha256": hashlib.sha256(SECRET.encode()).hexdigest(),
                "redirectUris": [cad + "/auth/bizomat/callback"]}]
    env = dict(os.environ, ENVIRONMENT="development", APP_URL=work, PORT=str(work_port), HOST="127.0.0.1",
               WORK_DATA_DIR=str(data / "work"), WORK_STATIC_DIR=os.path.join(path, "dist", "client"), WORK_CRON="0",
               ALLOW_SIGNUP="true", BIZOMAT_ID_CLIENTS=json.dumps(clients), CAD_URL=cad,
               SETTINGS_ENCRYPTION_KEY=base64.b64encode(secrets.token_bytes(32)).decode())
    log = open(data / "work.log", "wb")
    proc = subprocess.Popen(["node", os.path.join(path, "dist", "node", "server.mjs")], env=env, cwd=path, stdout=log, stderr=log)
    monkeypatch.setenv("OPENSKETCH_PUBLIC_URL", cad)
    monkeypatch.setenv("BIZOMAT_ID_URL", work + "/company")
    monkeypatch.setenv("BIZOMAT_ID_CLIENT_SECRET", SECRET)
    monkeypatch.setattr(erplink.syncer, "start", lambda: None)  # the test runs each sync itself
    accounts.create_owner("cora@example.com", "Cora", "a-long-password-1")  # the CAD server's owner, before the ERP
    srv = uvicorn.Server(uvicorn.Config(server.app, host="127.0.0.1", port=cad_port, log_level="error"))
    th = threading.Thread(target=srv.run, daemon=True)
    th.start()
    try:
        assert _wait(lambda: httpx.get(work + "/company/api/health", timeout=1).status_code == 200), (data / "work.log").read_text()[-2000:]
        assert _wait(lambda: httpx.get(cad + "/healthz", timeout=1).status_code == 200)
        yield work, cad, data / "work" / "db.sqlite"
    finally:
        srv.should_exit = True
        th.join(5)
        proc.terminate()
        proc.wait(10)
        log.close()


class Person:
    """A signed-in person in the work app (its session cookie and CSRF token)."""

    def __init__(self, work: str, dbfile, name: str, email: str):
        self.c = httpx.Client(base_url=work, headers={"Origin": work}, timeout=60)
        r = self.c.post("/tasks/api/auth/signup", json={"email": email, "name": name, "password": "correct-horse-42!"})
        assert r.status_code == 201, r.text
        d = r.json()
        self.c.headers["X-CSRF-Token"] = d["csrfToken"]
        self.id, self.email = d["user"]["id"], email
        _sql(dbfile, "UPDATE users SET email_verified_at = ? WHERE id = ?", (int(time.time() * 1000), self.id))

    def erp(self, method: str, path: str, **kw) -> httpx.Response:
        return self.c.request(method, "/erp/api/erp" + path, **kw)


def _sql(dbfile, q: str, args=()) -> list:
    con = sqlite3.connect(str(dbfile), timeout=20)
    try:
        rows = con.execute(q, args).fetchall()
        con.commit()
        return rows
    finally:
        con.close()


def _flag(dbfile, key: str, value: str, scope: str = "global", scope_id: str = "") -> None:
    _sql(dbfile, "INSERT OR REPLACE INTO feature_flags (key, scope, scope_id, value, reason, updated_by, updated_at) VALUES (?, ?, ?, ?, 'e2e', 'e2e', ?)",
         (key, scope, scope_id, value, int(time.time() * 1000)))


def _company(owner: Person, name: str) -> str:
    r = owner.c.post("/company/api/company/companies", json={
        "kind": "business", "name": name, "legalName": "", "abn": _abn(), "acn": "", "email": "accounts@example.com",
        "phone": "(02) 9876 5432", "addressLine1": "12 Example Street", "addressLine2": "", "suburb": "Sydney", "state": "NSW",
        "postcode": "2000", "website": ""})
    assert r.status_code == 201, r.text
    return r.json()["company"]["id"]


def _join(owner: Person, co: str, p: Person, role: str, dbfile) -> None:
    inv = owner.c.post(f"/company/api/company/c/{co}/invitations",
                       json={"email": p.email, "role": "member", "tasksRole": "member", "crmRole": None, "finRole": None})
    assert inv.status_code in (200, 201), inv.text
    token = unquote(inv.json()["url"].split("/join/")[1])
    assert p.c.post(f"/company/api/company/invitations/{token}/accept", json={}).status_code in (200, 201)
    _sql(dbfile, "UPDATE co_members SET role = ? WHERE company_id = ? AND user_id = ?", (role, co, p.id))


def _handler(op, params, files_in, out):
    """SOLIDWORKS stood in: an export writes a STEP file; anything else answers as an empty part would."""
    if op == "export":
        out["Bracket.step"] = STEP
        return {"file": "Bracket.step", "title": "Bracket", "format": "step"}
    return {"kind": "part", "title": "Bracket.SLDPRT"}


def _pair(cad: str, person: Person, co: str, name: str) -> FakeCompanion:
    """A computer paired through the ERP with the code its Companion shows, as a person does on the Computers tab."""
    comp = FakeCompanion(cad, _handler, name=name, approve=False)
    r = person.erp("POST", f"/c/{co}/cad/pairing/{comp.pair['user_code']}", json={})
    assert r.status_code == 200, r.text
    r = comp.post("/v2/devices/pair/poll", {})
    assert r.status_code == 200 and r.json()["status"] == "approved", r.text
    out = r.json()
    comp.device_id, comp.gateway_jwk = out["device_id"], out["gateway_jwk"]
    comp.kid = comp.device_id
    comp.gw = db.jwk_public_key(comp.gateway_jwk)
    comp.instances = [comp.instance(0)]
    comp.hello()
    comp.th = threading.Thread(target=comp.loop, daemon=True)
    comp.th.start()
    return comp


def _mcp(url: str, name: str, args: dict) -> tuple[int, dict]:
    r = httpx.post(url, json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": args}},
                   headers={"Accept": "application/json, text/event-stream"}, timeout=120)
    if r.status_code != 200:
        return r.status_code, r.json()
    msg = rpc(r)
    text = msg["result"]["content"][0]["text"]
    return 200, json.loads(text)


@pytest.mark.slow
def test_cad_automation_in_the_real_erp_end_to_end(stack):
    work, cad, dbfile = stack
    report: list[str] = []

    def check(label: str, ok: bool, detail: str = "") -> None:
        report.append(f"{'PASS' if ok else 'FAIL'} {label}{(': ' + detail) if detail and not ok else ''}")
        assert ok, f"{label}: {detail}"

    cora = Person(work, dbfile, "Cora Owner", "cora@example.com")
    mia = Person(work, dbfile, "Mia Employee", "mia@example.com")
    rita = Person(work, dbfile, "Rita Reader", "rita@example.com")
    oz = Person(work, dbfile, "Oz Outsider", "oz@example.com")
    co = _company(cora, "Cora Engineering")
    co_b = _company(oz, "Oz Works")
    _join(cora, co, mia, "employee", dbfile)
    _join(cora, co, rita, "read_only", dbfile)

    # Earlier work (Part 3, migration): Mia already uses CAD Automation, linked to her BIZOMAT account, with a computer
    # and no company yet.
    token = accounts.create_invite("owner")
    mia_cad = accounts.accept_invite(token, "mia@example.com", "Mia", None, bizomat=mia.id)
    old_pc = db.ulid("dev")
    db._exec("INSERT INTO devices (id, owner, name, jwk, jkt, created, last_seen, is_default, info) VALUES (?,?,?,?,?,?,?,?,?)",
             (old_pc, mia_cad["id"], "MIA-OLD-PC", "{}", "jkt-" + old_pc, time.time(), None, 0, "{}"))

    # Off: nothing changes, and the module says so.
    r = cora.erp("GET", f"/c/{co}/cad")
    check("off by default: the module is not on", r.status_code == 403 and r.json()["details"]["code"] == "CAD_NOT_ENABLED", r.text)

    _flag(dbfile, "cad_in_erp", "on", "company", co)
    _flag(dbfile, "cad_in_erp", "on", "company", co_b)
    _flag(dbfile, "cad_products", "on", "company", co)

    # 1. One sign-in: the ERP's signed assertion is all the engine needs; it links Cora's CAD account by her confirmed email.
    r = cora.erp("GET", f"/c/{co}/cad")
    check("1 one sign-in: the ERP reaches the engine for a signed-in person", r.status_code == 200 and r.json()["cad"]["connected"] is True, r.text)

    # 2. The module for permitted people only.
    names = lambda p: [c["id"] for c in p.erp("GET", "/cad/companies").json()["companies"]]
    check("2 navigation: Cora's company for its people", co in names(cora) and co in names(mia) and co in names(rita), "")
    check("2 navigation: not for someone outside it", co not in names(oz) and co_b in names(oz), str(names(oz)))
    r = oz.erp("GET", f"/c/{co}/cad")
    check("2 another company's module answers 404", r.status_code == 404, f"{r.status_code} {r.text[:200]}")

    # The sync (contract 2): accounts mapped, earlier work moved into the company.
    erplink.sync_once()
    rows = _sql(dbfile, "SELECT cad_account_id, status, company_id FROM cad_accounts")
    check("7 migration: every account linked, Mia's placed in Cora's company",
          any(a == mia_cad["id"] and s == "mapped" and c == co for a, s, c in rows), str(rows))
    moved = db._q("SELECT company FROM devices WHERE id = ?", (old_pc,), one=True)
    check("7 migration: Mia's earlier computer moved into the company, nothing deleted", moved and moved["company"] == co, str(moved))
    health = json.loads(_sql(dbfile, "SELECT value FROM system_kv WHERE key = 'cad_health'")[0][0])
    check("7 migration: counts and checksums reported, contract 2", health["contract"] == 2 and set(health["checksums"]) == {"devices", "commands", "grants"}, str(health)[:300])

    # Computers paired through the ERP.
    cora_pc = _pair(cad, cora, co, "CORA-PC")
    mia_pc = _pair(cad, mia, co, "MIA-PC")
    oz_pc = _pair(cad, oz, co_b, "OZ-PC")
    try:
        computers = lambda p, c: sorted(x["name"] for x in p.erp("GET", f"/c/{c}/cad").json()["cad"]["computers"])
        check("3 isolation: Cora's company shows its computers only", computers(cora, co) == ["CORA-PC", "MIA-OLD-PC", "MIA-PC"], str(computers(cora, co)))
        check("3 isolation: the other company shows its own only", computers(oz, co_b) == ["OZ-PC"], str(computers(oz, co_b)))
        check("3 scope: an employee sees their own computers", computers(mia, co) == ["MIA-OLD-PC", "MIA-PC"], str(computers(mia, co)))

        # 6. Work through the AI connector (each person's private address, from the ERP's Access tab) lands in its company.
        cora_url = cora.erp("GET", f"/c/{co}/cad/access").json()["privateUrl"]
        status, out = _mcp(cora_url, "sw_export", {"format": "step"})
        check("6 an AI assistant's export runs on the company's computer", status == 200 and out.get("download_url"), str(out)[:300])
        exports = cora.erp("GET", f"/c/{co}/cad").json()["cad"]["exports"]
        check("6 the export belongs to the company", any(e["id"] == out["artifact_id"] for e in exports), str(exports)[:300])
        check("3 isolation: the other company never sees it", not oz.erp("GET", f"/c/{co_b}/cad").json()["cad"]["exports"], "")
        r = oz.erp("GET", f"/c/{co_b}/cad/exports/{out['artifact_id']}/file")
        check("3 isolation: nor downloads it by id", r.status_code in (403, 404), f"{r.status_code}")

        # 5. Downloads by role: the owner through the link (recorded), the employee neither through the ERP nor a link.
        link = httpx.get(out["download_url"], timeout=30)
        check("5 the owner downloads through the AI assistant's link", link.status_code == 200 and link.content == STEP, f"{link.status_code}")
        mia_url = mia.erp("GET", f"/c/{co}/cad/access").json()["privateUrl"]
        status, mine = _mcp(mia_url, "sw_export", {"format": "step", "device": "MIA-PC"})
        check("5 contract 2: an employee's export has no link (downloads are off for employees)", status == 200 and "download_url" not in mine and "Not allowed" in mine.get("download", ""), str(mine)[:300])
        r = mia.erp("GET", f"/c/{co}/cad/exports/{mine['artifact_id']}/file")
        check("5 the employee cannot download it in the ERP either", r.status_code == 403, f"{r.status_code}")
        r = cora.erp("GET", f"/c/{co}/cad/exports/{mine['artifact_id']}/file")
        check("5 the owner can, from the ERP", r.status_code == 200 and r.content == STEP, f"{r.status_code}")
        erplink.sync_once()
        ev = _sql(dbfile, "SELECT summary FROM erp_events WHERE company_id = ? AND action = 'cad.export_downloaded'", (co,))
        check("5 every download is in the company's history, the link's included", len(ev) == 2 and any("AI assistant" in s for (s,) in ev), str(ev))

        # 5.1: the export saved to a product revision, with where it came from.
        prod = cora.erp("POST", f"/c/{co}/products", json={"type": "component", "number": "BR-100", "name": "Bracket"}).json()
        rev = cora.erp("GET", f"/c/{co}/products/{prod['id']}").json()["revisions"][0]
        r = cora.erp("POST", f"/c/{co}/cad/exports/{out['artifact_id']}/save", json={"productId": prod["id"], "revisionId": rev["id"]})
        check("9 an export saved to a product revision as a draft document", r.status_code in (200, 201) and r.json()["status"] == "draft", r.text[:300])
        src = cora.erp("GET", f"/c/{co}/cad/sources?productId={prod['id']}").json()["sources"]
        check("9 with its source and checksum", src and src[0]["sha256"] == hashlib.sha256(STEP).hexdigest(), str(src)[:300])

        # Read-only (contract 2): refused inside the company, never worked by person.
        r = rita.erp("GET", f"/c/{co}/cad")
        check("5 a read-only member sees the module", r.status_code == 200 and r.json()["perms"]["operate"] is False, r.text[:200])
        check("5 but gets no private address", rita.erp("GET", f"/c/{co}/cad/access").status_code == 403, "")
        erplink.sync_once()
        rita_cad = accounts.find_by_email("rita@example.com")  # made by the ERP's word when she opened the module
        rita_url = cad + "/mcp/" + auth.mcp_token_for(accounts.get(rita_cad["id"]))
        status, refused = _mcp(rita_url, "sw_status", {})
        check("contract 2: a read-only role is refused by the AI connector inside the company", status == 403 and refused.get("error") == "read_only", str(refused)[:300])

        # 13. Fair use: the company's own limit reaches the AI connector at the next sync.
        _sql(dbfile, "INSERT OR REPLACE INTO company_settings (company_id, key, value_json, updated_by, updated_at) VALUES (?, 'cad.limits', ?, ?, ?)",
             (co, json.dumps({"concurrent": 5, "commandSeconds": 600, "uploadMb": 1, "storageMb": 128}), cora.id, int(time.time() * 1000)))
        erplink.sync_once()
        status, up = _mcp(cora_url, "request_upload", {"filename": "big.step"})
        check("13 fair use: the company's upload limit applies", status == 200 and up.get("max_bytes") == 2 ** 20, str(up)[:300])

        # 8. Old pages open in the ERP while cad_redirect is on.
        _flag(dbfile, "cad_redirect", "on")
        erplink.sync_once()
        r = httpx.get(cad + "/dashboard", headers={"Accept": "text/html"}, follow_redirects=False)
        check("8 an old page answers 302 into the ERP", r.status_code == 302 and r.headers["location"].startswith(work + "/erp/cad"), f"{r.status_code} {r.headers.get('location')}")
        _flag(dbfile, "cad_redirect", "off")
        erplink.sync_once()
        r = httpx.get(cad + "/dashboard", headers={"Accept": "text/html"}, follow_redirects=False)
        check("8 and the old page again once it is off", r.status_code in (303, 307) and "/login" in r.headers.get("location", ""), f"{r.status_code} {r.headers.get('location')}")

        # Password sign-in retired (decision 4) while every account is linked, and back when the flag is off.
        _flag(dbfile, "cad_password_retired", "on")
        erplink.sync_once()
        r = httpx.get(cad + "/login?password=1", follow_redirects=False)
        check("password sign-in retired: the page goes to Sign in with BIZOMAT", r.status_code == 303 and r.headers["location"].startswith("/auth/bizomat"), f"{r.status_code} {r.headers.get('location')}")
        r = httpx.post(cad + "/login", data={"email": "cora@example.com", "password": "a-long-password-1", "next": "/"}, follow_redirects=False)
        check("password sign-in retired: a password is refused", r.status_code == 403, f"{r.status_code}")
        _flag(dbfile, "cad_password_retired", "off")
        erplink.sync_once()
        r = httpx.post(cad + "/login", data={"email": "cora@example.com", "password": "a-long-password-1", "next": "/"}, follow_redirects=False)
        check("password sign-in back once the flag is off", r.status_code == 303, f"{r.status_code}")

        # 15. Rollback: the module off for the company; work goes on by person, and nothing is lost.
        _flag(dbfile, "cad_in_erp", "off", "company", co)
        r = cora.erp("GET", f"/c/{co}/cad")
        check("15 rollback: the module is off for the company", r.status_code == 403 and r.json()["details"]["code"] == "CAD_NOT_ENABLED", r.text[:200])
        erplink.sync_once()
        status, st = _mcp(cora_url, "sw_status", {})
        check("15 rollback: the AI assistant works by person again", status == 200 and st.get("connected"), str(st)[:300])
        kept = db._q("SELECT name, company FROM devices WHERE owner = (SELECT owner FROM devices WHERE name = 'CORA-PC')", ())
        check("15 rollback: nothing lost, the company kept on the computer for next time", kept and all(k["company"] == co for k in kept), str(kept))
    finally:
        for comp in (cora_pc, mia_pc, oz_pc):
            comp.close()
        out_file = os.environ.get("BIZOMAT_E2E_REPORT")
        if out_file:
            with open(out_file, "w") as f:
                f.write("\n".join(report) + "\n")
