"""Static checks that keep the add-in, the installer and the website in step (they run on Linux; the MSI itself is built
and the add-in compiled against the SOLIDWORKS 2022 interop by solidworks.yml on Windows and Linux):

- the MSI registers the add-in class SOLIDWORKS loads (same CLSID and ProgID as the code), lists it in Tools > Add-Ins
  under the add-in's own title and description, and keeps the UpgradeCode so it upgrades KEVOS Bridge in place;
- the MSI's file name, the stable download name and the server's download link agree;
- the add-in's version can upgrade (higher than the last released 0.11.0)."""
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from fastapi.testclient import TestClient

ROOT = Path(__file__).resolve().parents[1]
WXS = ROOT / "installer" / "KEVOS-Bridge.wxs"
ENTRY = (ROOT / "solidworks" / "src" / "Addin" / "Entry.cs").read_text()
NS = {"w": "http://wixtoolset.org/schemas/v4/wxs"}


def _const(name):
    return re.search(rf'public const string {name} = "([^"]*)";', ENTRY).group(1)


def test_msi_registers_the_add_in_solidworks_loads():
    tree = ET.parse(WXS).getroot()
    clsid = _const("ClassId")
    keys = {k.get("Key"): k for k in tree.iter("{%s}RegistryKey" % NS["w"])}
    addin = keys[r"SOFTWARE\SolidWorks\Addins\{" + clsid + "}"]
    vals = {v.get("Name"): v.get("Value") for v in addin.iter("{%s}RegistryValue" % NS["w"])}
    assert vals["Title"] == _const("Title") == "CADOS"
    assert vals["Description"] == _const("Description") and "KEVOS" in vals["Description"]
    assert vals[None] == "1"  # listed for every SOLIDWORKS version installed
    # the COM class SOLIDWORKS creates: CLSID -> InprocServer32 (mscoree) with the class, assembly and code base
    text = WXS.read_text()
    assert ("CLSID\\{" + clsid + "}") in text and 'Value="OpenSketch.Sw.SwAddin"' in text and _const("ProgIdName") == "OpenSketch.Sw.SwAddin"
    assert 'Name="CodeBase" Type="string" Value="file:///[#AddinDll]"' in text and "mscoree.dll" in text.lower()


def test_msi_is_cados_for_solidworks_and_upgrades_kevos_bridge():
    pkg = ET.parse(WXS).getroot().find("w:Package", NS)
    assert pkg.get("Name") == "CADOS for SOLIDWORKS" and pkg.get("Manufacturer") == "KEVOS"
    assert pkg.get("UpgradeCode") == "cef90528-e91b-42ae-9556-f70a612cb58f"  # never change: upgrades depend on it
    assert pkg.get("Scope") == "perMachine"
    assert "KEVOS Bridge" not in re.sub(r"<!--.*?-->", "", WXS.read_text(), flags=re.S)


def test_version_can_upgrade():
    v = re.search(r"<Version>([\d.]+)</Version>", (ROOT / "solidworks" / "Directory.Build.props").read_text()).group(1)
    assert tuple(map(int, v.split("."))) > (0, 11, 0)


def test_download_names_agree(tmp_path, monkeypatch):
    build = (ROOT / "installer" / "build.ps1").read_text()
    assert '"CADOS-for-SOLIDWORKS-$Version-x64"' in build and "'CADOS-for-SOLIDWORKS-x64.msi'" in build
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_INSTALLER_URL", raising=False)
    from opensketch import server
    r = TestClient(server.app).get("/download/solidworks", follow_redirects=False)
    assert r.status_code == 302 and r.headers["location"].endswith("/releases/download/bridge-latest/CADOS-for-SOLIDWORKS-x64.msi")
    # a release the operator published wins
    (tmp_path / "data").mkdir(exist_ok=True)
    (tmp_path / "data" / "bridge-release.json").write_text(
        '{"version": "0.12.0", "msi_url": "https://example.com/CADOS-for-SOLIDWORKS-0.12.0-x64.msi", "sha256": "sha256:00"}')
    assert TestClient(server.app).get("/download/solidworks", follow_redirects=False).headers["location"] == \
        "https://example.com/CADOS-for-SOLIDWORKS-0.12.0-x64.msi"


def test_the_download_needs_sign_in(tmp_path, monkeypatch):
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.setenv("OPENSKETCH_PASSWORD", "server-secret")
    from opensketch import accounts, server
    accounts.create_owner("owner@example.com", "Owner", "owner-pass-1")
    accounts.create_member("pat@example.com", "Pat", "given-pass-1")
    anon = TestClient(server.app)
    r = anon.get("/download/solidworks", follow_redirects=False)
    assert r.status_code == 303 and r.headers["location"] == "/login?next=/download/solidworks"
    assert anon.post("/login", data={"email": "pat@example.com", "password": "given-pass-1", "next": "/download/solidworks"},
                     follow_redirects=False).headers["location"] == "/download/solidworks"
    r = anon.get("/download/solidworks", follow_redirects=False)
    assert r.status_code == 302 and "CADOS-for-SOLIDWORKS" in r.headers["location"]
