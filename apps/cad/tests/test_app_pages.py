"""The signed-in BIZOMAT CAD Automation app (app_pages.py): six sections behind sign-in, the BIZOMAT brand on each (the
wordmark, the platform menu, the legal links), no old product name, a Tools list that matches exactly what the AI
assistant can call, and a History backed by the real command record."""
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
    "/tools": "Everything CAD Automation can do.",
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
        assert "/ui/app.js" in t and "https://bizomat.ai/" in t and "https://work.bizomat.ai/" in t, path
        assert "BIZOMAT CAD Automation" in t and 'class="product"' in t and "Project Management" in t, path
        for legal in ('href="/privacy"', "https://bizomat.ai/privacy/", "https://bizomat.ai/terms/", "https://bizomat.ai/disclaimer/"):
            assert legal in t, (path, legal)
        assert "<title>" in t and " | BIZOMAT CAD Automation</title>" in t, path
        # no old name (the repository's address and the stylesheet's file name are not names people read)
        visible = t.replace("jogkev-creator/CADOS", "").replace("cados.css", "")
        assert "OpenSketch" not in t and "oss_" not in t and "CADOS" not in visible and "KEVOS" not in visible, path
        for href, label, _ in [(h, lbl, k) for h, lbl, k in __import__("opensketch.brand", fromlist=["APP_NAV"]).APP_NAV]:
            assert f'href="{href}"' in t and label in t, (path, label)
    # no section without a real feature behind it (there are no stored automations to show)
    assert not any("Automation" in label for _, label, _ in __import__("opensketch.brand", fromlist=["APP_NAV"]).APP_NAV)
    assert 'href="/automation' not in owner.get("/dashboard").text
    # the signed-in home page is the app's Home
    assert "Engineering, made intelligent." in owner.get("/").text
    # the app script, the design tokens and the BIZOMAT marks are public files with no data; the retired KEVOS mark is gone
    for f in ("/ui/app.js", "/ui/bizomat-tokens.css", "/ui/bizomat-logo-light.svg", "/favicon.svg", "/favicon.ico"):
        assert anon.get(f).status_code == 200, f
    assert anon.get("/ui/kevos-wordmark.svg").status_code == 404


def test_a_missing_page_is_branded_for_browsers_and_json_for_programs():
    owner = _owner()
    r = owner.get("/no-such-page", headers={"Accept": "text/html"})
    assert r.status_code == 404 and "This page does not exist." in r.text and "BIZOMAT CAD Automation" in r.text
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
    assert page.status_code == 200 and "People on this CAD Automation server." in page.text and 'href="/admin"' in page.text
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
    """The Companion's pairing window can take the person's email and password instead of the browser step: the same
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


def test_sign_in_pages_say_bizomat_and_returning_people_go_straight_back(monkeypatch):
    """No internal name on the setup or sign-in pages, and a person already signed in on this browser who opens
    /login is sent on to where they were going (sessions last 90 days)."""
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    anon = TestClient(server.app)
    setup = anon.get("/login").text
    assert "Set up CAD Automation" in setup and "shows only once" in setup
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": "correct horse",
                               "server_password": "server-secret", "next": "/"})
    login = anon.get("/login").text
    assert "Welcome back" in login and "Set up CAD Automation" not in login  # every later visit gets Sign in
    assert "<h1>Sign in to BIZOMAT</h1>" in login and ">CAD Automation</span>" in login  # the product they sign in to
    assert "<title>Sign in | BIZOMAT CAD Automation</title>" in login
    for page in (setup, login):
        assert "OpenSketch" not in page and "OPENSKETCH" not in page and "CADOS" not in page and "KEVOS" not in page
    r = owner.get("/login?next=/history", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/history"
    owner.get("/logout")
    assert "Welcome back" in owner.get("/login").text
    r = owner.post("/login", data={"email": "owner@example.com", "password": "correct horse", "next": "/dashboard"},
                   follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/dashboard"


def test_a_new_account_gets_a_suggested_password_or_its_own_and_the_owner_sees_who_chose_it():
    """Sign-up forms come with a strong password filled in (dots, with Show). Keeping it shows it once more on Home after
    sign-in; typing one's own shows nothing. The Admin page says who chose each password, never the password."""
    import re
    anon = TestClient(server.app)
    page = anon.get("/setup").text
    pw = re.search(r'name="new_password" type="password" autocomplete="new-password" value="([^"]+)"', page).group(1)
    assert len(pw) >= 16 and f'name="suggested" value="{pw}"' in page and "pw-show" in page
    assert pw != re.search(r'name="suggested" value="([^"]+)"', anon.get("/setup").text).group(1)  # new one each time
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "Owner", "email": "owner@example.com", "new_password": pw, "suggested": pw, "next": "/"})
    assert owner.get("/api/account/new-password").json()["password"] == pw  # shown on Home
    assert TestClient(server.app).get("/api/account/new-password").status_code == 401  # nobody else
    assert owner.delete("/api/account/new-password").status_code == 200
    assert owner.get("/api/account/new-password").json()["password"] is None  # once only

    # the owner adds Pat with a password: "Set by you", and Pat is asked to choose their own
    r = owner.post("/api/account/users", json={"email": "pat@example.com", "name": "Pat", "password": "given-pass-1"})
    pat_id = r.json()["user"]["id"]
    pat = TestClient(server.app)
    pat.post("/login", data={"email": "pat@example.com", "password": "given-pass-1", "next": "/"})
    assert pat.get("/api/solidworks").json()["user"]["password_by"] == "owner"
    assert pat.get("/api/account/new-password").json()["password"] is None
    assert 'id="ownerpw"' in pat.get("/dashboard").text
    people = {p["email"]: p for p in owner.get("/api/admin/people").json()["people"]}
    assert people["owner@example.com"]["password_by"] == "suggested" and people["pat@example.com"]["password_by"] == "owner"
    assert people["pat@example.com"]["password_at"] > 0
    assert not any(k in p for p in people.values() for k in ("hash", "salt", "password"))
    assert "given-pass-1" not in owner.get("/api/admin/people").text

    # Pat chooses their own in Settings
    assert pat.post("/api/account", json={"current_password": "given-pass-1", "new_password": "pats-own-pass"}).status_code == 200
    people = {p["email"]: p for p in owner.get("/api/admin/people").json()["people"]}
    assert people["pat@example.com"]["password_by"] == "self"
    # an owner reset is "Set by you" again
    owner.post(f"/api/account/users/{pat_id}/password", json={"password": "reset-pass-9"})
    assert {p["email"]: p for p in owner.get("/api/admin/people").json()["people"]}["pat@example.com"]["password_by"] == "owner"

    # an invited person who types their own password gets no notice
    url = owner.post("/api/account/invites", json={"note": "Sam"}).json()["url"]
    token = url.rsplit("/join/", 1)[1]
    sam = TestClient(server.app)
    offered = re.search(r'name="suggested" value="([^"]+)"', sam.get(f"/join/{token}").text).group(1)
    sam.post(f"/join/{token}", data={"name": "Sam", "email": "sam@example.com", "new_password": "sams-own-pass", "suggested": offered})
    assert sam.get("/api/account/new-password").json()["password"] is None
    assert {p["email"]: p for p in owner.get("/api/admin/people").json()["people"]}["sam@example.com"]["password_by"] == "self"


def test_setup_forgives_spaces_and_quotes_and_can_open_sign_up_for_everyone(monkeypatch):
    """The server password is needed once, for the owner. Spaces or one pair of quotes around it (copied, or set from
    Windows cmd with 'quotes') do not fail it. The owner can let anyone create their own account right there."""
    from opensketch import accounts
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "'Server-Secret-1'")
    c = TestClient(server.app)
    page = c.get("/setup").text
    assert 'name="open_signup" value="on" checked' in page and "Needed only this once." in page
    bad = c.post("/setup", data={"name": "O", "email": "owner@example.com", "new_password": "owner-pass-1",
                                 "server_password": "wrong", "open_signup": "on"})
    assert bad.status_code == 401 and "If you lost it, set a new one" in bad.text and 'value="on" checked' in bad.text
    ok = c.post("/setup", data={"name": "O", "email": "owner@example.com", "new_password": "owner-pass-1",
                                "server_password": "  Server-Secret-1 \n", "open_signup": "on"}, follow_redirects=False)
    assert ok.status_code == 303 and accounts.settings()["open_signup"] is True
    anyone = TestClient(server.app)
    assert 'href="/signup"' in anyone.get("/login").text
    r = anyone.post("/signup", data={"name": "Ann", "email": "ann@example.com", "new_password": "anns-pass-1"},
                    follow_redirects=False)
    assert r.status_code == 303 and anyone.get("/dashboard").status_code == 200


def test_setup_can_stay_invite_only(monkeypatch):
    from opensketch import accounts
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    c = TestClient(server.app)
    c.post("/setup", data={"name": "O", "email": "owner@example.com", "new_password": "owner-pass-1", "server_password": "server-secret"})
    assert accounts.any_users() and accounts.settings()["open_signup"] is False


def test_only_the_owner_sees_the_server_password_after_sign_in(monkeypatch):
    """People never need the server password (they sign up with their own email and password); the owner finds it on
    the Admin page, fetched on request and never in a page's source."""
    from opensketch import accounts
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret-77")
    anon = TestClient(server.app)
    setup = anon.get("/setup").text
    assert "Not the administrator?" in setup and "server-secret-77" not in setup
    owner = TestClient(server.app)
    owner.post("/setup", data={"name": "O", "email": "owner@example.com", "new_password": "owner-pass-1",
                               "server_password": "server-secret-77", "open_signup": "on"})
    assert owner.get("/api/admin/server-password").json()["server_password"] == "server-secret-77"
    admin_page = owner.get("/admin").text
    assert 'id="spw"' in admin_page and "server-secret-77" not in admin_page
    assert anon.get("/api/admin/server-password").status_code == 401
    # anyone signs up without it, and cannot read it
    ann = TestClient(server.app)
    assert "Server password" not in ann.get("/signup").text and "Server password" not in ann.get("/login").text
    ann.post("/signup", data={"name": "Ann", "email": "ann@example.com", "new_password": "anns-pass-1"})
    assert accounts.find_by_email("ann@example.com") is not None
    assert ann.get("/api/admin/server-password").status_code == 403
    assert "server-secret-77" not in ann.get("/dashboard").text


def test_the_platform_links_follow_the_settings(monkeypatch):
    """The BIZOMAT website and Project Management are settings (their domains go live separately); anything that is not
    an http(s) address falls back to the default."""
    monkeypatch.setenv("BIZOMAT_SITE_URL", "https://staging.bizomat.example/")
    monkeypatch.setenv("BIZOMAT_WORK_URL", "https://work.staging.bizomat.example")
    owner = _owner()
    for page in (owner.get("/dashboard").text, TestClient(server.app).get("/overview").text):
        assert "https://staging.bizomat.example/terms/" in page and "https://staging.bizomat.example/disclaimer/" in page
        assert "https://work.staging.bizomat.example/" in page and "https://bizomat.ai/" not in page
    login = TestClient(server.app).get("/login").text
    assert 'href="https://staging.bizomat.example/"' in login and "https://staging.bizomat.example/terms/" in login
    monkeypatch.setenv("BIZOMAT_SITE_URL", "javascript:alert(1)")
    page = owner.get("/dashboard").text
    assert "javascript:" not in page and "https://bizomat.ai/terms/" in page
