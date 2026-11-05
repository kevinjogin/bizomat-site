"""The signed-in CADOS app (app_pages.py): six sections behind sign-in, the KEVOS brand on each, no old product name,
a Tools list that matches exactly what the AI assistant can call, and a History backed by the real command record."""
import asyncio

import httpx
from fastapi.testclient import TestClient

from opensketch import catalog, mcp_server, server
from tests.bridge_fakes import FakeCompanion
from tests.test_devicebridge import Canned, _mcp, base, companions, data  # noqa: F401  (fixtures)

SECTIONS = {
    "/dashboard": "Engineering, made intelligent.",
    "/assistant": "Work in SOLIDWORKS by asking.",
    "/solidworks": "Your SOLIDWORKS connection.",
    "/tools": "Everything CADOS can do.",
    "/history": "What your assistant has done.",
    "/settings": "Account and access.",
}


def _owner():
    c = TestClient(server.app)
    c.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse", "next": "/"})
    return c


def test_tools_page_lists_exactly_the_registered_tools():
    registered = {t.name for t in asyncio.run(mcp_server.mcp.list_tools())}
    listed = [name for _, tools in catalog.GROUPS for name, _, _ in tools]
    assert len(listed) == len(set(listed)) and set(listed) == registered


def test_every_section_needs_sign_in_and_carries_the_brand():
    owner = _owner()
    anon = TestClient(server.app)
    for path, heading in SECTIONS.items():
        r = anon.get(path, follow_redirects=False)
        assert r.status_code == 303 and r.headers["location"] == f"/login?next={path}", path
        page = owner.get(path)
        assert page.status_code == 200 and heading in page.text, path
        t = page.text
        assert "/ui/app.js" in t and "https://kevos.com/" in t and "https://work.kevos.com/" in t, path
        assert "OpenSketch" not in t and "oss_" not in t, path  # no old name, and no key in the page source
        for href, label, _ in [(h, lbl, k) for h, lbl, k in __import__("opensketch.brand", fromlist=["APP_NAV"]).APP_NAV]:
            assert f'href="{href}"' in t and label in t, (path, label)
    assert "Automation" not in owner.get("/dashboard").text  # no section without a real feature behind it
    # the signed-in home page is the app's Home
    assert "Engineering, made intelligent." in owner.get("/").text
    # the app script and the official KEVOS marks are public files with no data
    for f in ("/ui/app.js", "/ui/kevos-wordmark.svg", "/favicon.svg", "/favicon.ico"):
        assert anon.get(f).status_code == 200, f


def test_a_missing_page_is_branded_for_browsers_and_json_for_programs():
    owner = _owner()
    r = owner.get("/no-such-page", headers={"Accept": "text/html"})
    assert r.status_code == 404 and "This page does not exist." in r.text and "CADOS" in r.text
    j = owner.get("/api/no-such-thing", headers={"Accept": "text/html"})
    assert j.status_code == 404 and j.headers["content-type"].startswith("application/json")


def test_history_shows_the_real_command_record(base, companions):
    pc = FakeCompanion(base, Canned())
    companions.append(pc)
    assert httpx.get(base + "/api/commands").json() == {"commands": []}
    res, out = _mcp(base, "sw_get_document", {"doc": "C:\\OS\\Box.SLDPRT"})
    assert not res.get("isError"), out
    res, out = _mcp(base, "sw_delete_items", {"doc": "C:\\OS\\Box.SLDPRT", "features": ["Boss-Extrude1"]})
    assert res.get("isError")  # the person at the computer declined (the stand-in says no to destructive changes)
    got = httpx.get(base + "/api/commands", params={"limit": 10}).json()["commands"]
    assert [c["title"] for c in got[:2]] == ["Delete features", "Read a document"]
    newest, older = got[0], got[1]
    assert newest["status"] == "failed" and newest["device"] == pc.name and newest["error"]["code"] == "APPROVAL_DENIED"  # shown as Declined
    assert older["status"] == "succeeded" and older["device"] == pc.name and "error" not in older
    assert all(set(c) >= {"id", "tool", "title", "status", "created_at", "device", "app"} for c in got)
    assert len(httpx.get(base + "/api/commands", params={"limit": 1}).json()["commands"]) == 1


def test_the_owner_adds_people_with_a_password_and_resets_it():
    owner = _owner()
    page = owner.get("/admin")
    assert page.status_code == 200 and "People on this CADOS server." in page.text and 'href="/admin"' in page.text
    r = owner.post("/api/account/users", json={"email": "Pat@Example.com", "name": "Pat", "password": "given-pass-1"})
    assert r.status_code == 200 and r.json()["user"]["role"] == "member" and r.json()["user"]["email"] == "pat@example.com"
    assert owner.post("/api/account/users", json={"email": "pat@example.com", "password": "given-pass-1"}).status_code == 400
    assert owner.post("/api/account/users", json={"email": "sam@example.com", "password": "short"}).status_code == 400
    pat_id = r.json()["user"]["id"]
    people = owner.get("/api/admin/people").json()["people"]
    assert {p["email"] for p in people} == {"owner@example.com", "pat@example.com"}
    assert all({"computers", "online", "apps"} <= set(p) for p in people)

    # Pat signs in with the password the owner set (as when the installer's pairing step opens the browser)
    pat = TestClient(server.app)
    assert pat.post("/login", data={"email": "pat@example.com", "password": "given-pass-1", "next": "/"}, follow_redirects=False).status_code == 303
    assert "Engineering, made intelligent." in pat.get("/dashboard").text
    assert 'href="/admin"' not in pat.get("/dashboard").text  # only the owner sees Admin
    assert pat.get("/admin", follow_redirects=False).headers["location"] == "/dashboard"
    for method, path in (("GET", "/api/admin/people"), ("POST", "/api/account/users"), ("POST", f"/api/account/users/{pat_id}/password")):
        assert pat.request(method, path, json={"email": "x@example.com", "password": "whatever-1"}).status_code == 403, path

    # the owner sets a new password: the old one stops working and Pat is signed out everywhere
    assert owner.post(f"/api/account/users/{pat_id}/password", json={"password": "new-pass-22"}).status_code == 200
    assert pat.get("/api/solidworks").status_code == 401
    again = TestClient(server.app)
    assert again.post("/login", data={"email": "pat@example.com", "password": "given-pass-1", "next": "/"}).status_code == 401
    assert again.post("/login", data={"email": "pat@example.com", "password": "new-pass-22", "next": "/"}, follow_redirects=False).status_code == 303
    # Pat changes it in Settings to one only they know
    r = again.post("/api/account", json={"current_password": "new-pass-22", "new_password": "pats-own-pass"})
    assert r.status_code == 200 and r.json()["signed_out"] is True
    # the owner cannot reset their own password here, and removes Pat
    me = next(p for p in people if p["role"] == "owner")
    assert owner.post(f"/api/account/users/{me['id']}/password", json={"password": "anything-123"}).status_code == 400
    assert owner.delete(f"/api/account/users/{pat_id}").status_code == 200
    assert {p["email"] for p in owner.get("/api/admin/people").json()["people"]} == {"owner@example.com"}


def test_a_computer_pairs_with_the_persons_own_password(base, companions):
    """The Companion's pairing window can take the CADOS email and password instead of the browser step: the same
    password the person signs in with (for example the one the owner set on the Admin page)."""
    from opensketch import accounts
    from opensketch import devicebridge as db
    accounts.create_owner("owner@example.com", "Owner", "owner-pass-1")
    pat = accounts.create_member("pat@example.com", "Pat", "given-pass-1")
    pc = FakeCompanion(base, Canned(), name="PAT-PC", approve=False)
    companions.append(pc)
    bad = pc.post("/v2/devices/pair/password", {"email": "pat@example.com", "password": "wrong-pass"})
    assert bad.status_code == 401 and bad.json()["error"]["code"] == "INVALID_CREDENTIALS"
    unsigned = httpx.post(base + "/v2/devices/pair/password", json={"email": "pat@example.com", "password": "given-pass-1"})
    assert unsigned.status_code == 401  # only the computer that started this pairing can finish it
    ok = pc.post("/v2/devices/pair/password", {"email": "Pat@Example.com", "password": "given-pass-1", "name": "PAT-DESK"})
    assert ok.status_code == 200, ok.text
    out = ok.json()
    assert out["status"] == "approved" and out["device_name"] == "PAT-DESK" and out["account"] == "Pat" and out["gateway_jwk"]
    assert [d["name"] for d in db.list_devices({"id": pat["id"]})] == ["PAT-DESK"]
    again = pc.post("/v2/devices/pair/password", {"email": "pat@example.com", "password": "given-pass-1"})
    assert again.status_code == 410  # a pairing is decided once


def test_sign_in_pages_say_cados_and_returning_people_go_straight_back(monkeypatch):
    """No internal name on the setup or sign-in pages, and a person already signed in on this browser who opens
    /login is sent on to where they were going (sessions last 90 days)."""
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    anon = TestClient(server.app)
    setup = anon.get("/login").text
    assert "Set up CADOS" in setup and "shows only once" in setup
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse",
                               "server_password": "server-secret", "next": "/"})
    login = anon.get("/login").text
    assert "Welcome back" in login and "Set up CADOS" not in login  # every later visit gets Sign in
    for page in (setup, login):
        assert "OpenSketch" not in page and "OPENSKETCH" not in page
    r = owner.get("/login?next=/history", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/history"
    owner.get("/logout")
    assert "Welcome back" in owner.get("/login").text
    r = owner.post("/login", data={"email": "owner@example.com", "password": "correct horse", "next": "/dashboard"},
                   follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/dashboard"
