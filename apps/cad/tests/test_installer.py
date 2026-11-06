"""Static checks that keep the add-in, the installer and the website in step (they run on Linux; the MSI itself is built
and the add-in compiled against the SOLIDWORKS 2022 interop by solidworks.yml on Windows and Linux):

- the MSI registers the add-in class SOLIDWORKS loads (same CLSID and ProgID as the code), lists it in Tools > Add-Ins
  under the add-in's own title and description, and keeps the UpgradeCode so it upgrades KEVOS Bridge (up to 0.11) and
  CADOS for SOLIDWORKS (0.12.0 to 0.12.2) in place;
- what people read in Windows (the product, its publisher, the Start menu) says BIZOMAT, while every id stays;
- the MSI's file name, the stable download name and the server's download link agree (they keep the earlier name);
- the add-in's version can upgrade (higher than the last released 0.12.2);
- the logo the add-in and the Companion draw is the brand's own (the paths shared/brand/build.mjs generates)."""
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
    assert vals["Title"] == _const("Title") == "BIZOMAT CAD Automation"
    assert vals["Description"] == _const("Description") and vals["Description"].startswith("BIZOMAT CAD Automation:")
    assert vals[None] == "1"  # listed for every SOLIDWORKS version installed
    # the COM class SOLIDWORKS creates: CLSID -> InprocServer32 (mscoree) with the class, assembly and code base
    text = WXS.read_text()
    assert ("CLSID\\{" + clsid + "}") in text and 'Value="OpenSketch.Sw.SwAddin"' in text and _const("ProgIdName") == "OpenSketch.Sw.SwAddin"
    assert 'Name="CodeBase" Type="string" Value="file:///[#AddinDll]"' in text and "mscoree.dll" in text.lower()


def test_msi_is_bizomat_cad_automation_and_upgrades_every_earlier_version():
    root = ET.parse(WXS).getroot()
    pkg = root.find("w:Package", NS)
    assert pkg.get("Name") == "BIZOMAT CAD Automation for SOLIDWORKS" and pkg.get("Manufacturer") == "BIZOMAT"
    assert pkg.get("UpgradeCode") == "cef90528-e91b-42ae-9556-f70a612cb58f"  # never change: upgrades depend on it
    assert pkg.get("Scope") == "perMachine"
    assert "KEVOS Bridge" not in re.sub(r"<!--.*?-->", "", WXS.read_text(), flags=re.S)
    # everything people read: the product, publisher, messages, Apps entry, Start menu folder and shortcuts
    shown = [pkg.get("Name"), pkg.get("Manufacturer")]
    for tag, attrs in (("SummaryInformation", ("Description", "Manufacturer")), ("MajorUpgrade", ("DowngradeErrorMessage",)),
                       ("Launch", ("Message",)), ("Feature", ("Title",)), ("Shortcut", ("Name", "Description"))):
        shown += [e.get(a) for e in root.iter("{%s}%s" % (NS["w"], tag)) for a in attrs if e.get(a)]
    props = {p.get("Id"): p.get("Value") for p in root.iter("{%s}Property" % NS["w"])}
    shown += [props["ARPCOMMENTS"], props["ARPURLINFOABOUT"]]
    menu = next(d for d in root.iter("{%s}Directory" % NS["w"]) if d.get("Id") == "KevosMenu")
    shown.append(menu.get("Name"))
    assert menu.get("Name") == "BIZOMAT" and props["ARPURLINFOABOUT"] == "https://bizomat.ai/"
    for text in shown:
        assert "CADOS" not in text and "KEVOS" not in text and "kevos.com" not in text, text
    names = {s.get("Id"): s.get("Name") for s in root.iter("{%s}Shortcut" % NS["w"])}
    assert names == {"StartCompanion": "BIZOMAT Companion", "PairComputer": "Pair this computer with CAD Automation",
                     "Diagnostics": "CAD Automation diagnostics", "Unpair": "Remove this computer from CAD Automation"}


def test_the_ids_existing_installs_depend_on_are_unchanged():
    """The install folder, the registry keys, the Companion's Run value and its file name: an upgrade finds them."""
    text = WXS.read_text()
    platform = (ROOT / "solidworks" / "src" / "Companion" / "Platform.cs").read_text()
    run = re.search(r'const string RunName = "([^"]+)";', platform).group(1)
    assert run == "KEVOS Companion" and f'CurrentVersion\\Run" Name="{run}"' in text
    assert '<Directory Id="KevosDir" Name="KEVOS">' in text and '<Directory Id="INSTALLFOLDER" Name="Bridge" />' in text
    assert 'Key="SOFTWARE\\KEVOS\\Bridge"' in text and 'Source="$(var.Source)/KEVOS.Companion.exe"' in text
    assert 'Source="$(var.Source)/OpenSketch.Sw.dll"' in text and "{275256ff-b73a-4e4f-9ea8-842b6626d471}" in text
    assert re.search(r'public const string PipeName\(|PipeName\(string userSid\) => "KEVOS\.Bridge\."',
                     (ROOT / "solidworks" / "src" / "Core" / "Bridge2" / "Wire.cs").read_text())


def test_version_can_upgrade():
    props = (ROOT / "solidworks" / "Directory.Build.props").read_text()
    v = re.search(r"<Version>([\d.]+)</Version>", props).group(1)
    assert tuple(map(int, v.split("."))) > (0, 12, 3)  # the last CADOS for SOLIDWORKS release (KEVOS Bridge up to 0.11)
    assert "<Company>BIZOMAT</Company>" in props and "<Product>BIZOMAT CAD Automation for SOLIDWORKS</Product>" in props
    # the server still asks only for the versions each feature needs
    from opensketch import swbridge
    assert swbridge.version_tuple(v) >= (0, 10, 0)


def test_the_add_in_draws_the_brands_own_logo():
    from opensketch import bizomat_brand as bz
    art = (ROOT / "solidworks" / "src" / "Core" / "BrandArt.cs").read_text()
    for name, want in (("WordmarkPath", bz.WORDMARK_PATH), ("BPath", bz.B_PATH), ("BarPath", bz.BAR_PATH)):
        assert re.search(rf'public const string {name} = "([^"]+)";', art).group(1) == want, name
    _, _, width, height = bz.WORDMARK_VIEWBOX.split()
    assert f"WordmarkWidth = {width}f, Height = {height}f, BWidth = {bz.B_VIEWBOX.split()[2]}f" in art
    # the B on the mark: half the tile tall, as shared/brand/build.mjs places it (scale 512 * 0.5 / 240)
    assert "CapTop = 3f, Cap = 240f, MarkBHeight = 0.5f" in art and "scale(1.06667)" in bz.MARK_TRANSFORM


def test_download_names_agree(tmp_path, monkeypatch):
    build = (ROOT / "installer" / "build.ps1").read_text()
    assert '"BIZOMAT-CAD-Automation-$Version-x64"' in build and "'BIZOMAT-CAD-Automation-x64.msi'" in build
    assert "'CADOS-for-SOLIDWORKS-x64.msi'" in build, "the 0.12 stable name stays published for links already given out"
    monkeypatch.setenv("OPENSKETCH_DATA", str(tmp_path / "data"))
    monkeypatch.delenv("OPENSKETCH_INSTALLER_URL", raising=False)
    from opensketch import server
    r = TestClient(server.app).get("/download/solidworks", follow_redirects=False)
    assert r.status_code == 302 and r.headers["location"].endswith("/releases/download/bridge-latest/BIZOMAT-CAD-Automation-x64.msi")
    # a release the operator published wins
    (tmp_path / "data").mkdir(exist_ok=True)
    (tmp_path / "data" / "bridge-release.json").write_text(
        '{"version": "0.13.0", "msi_url": "https://example.com/BIZOMAT-CAD-Automation-0.13.0-x64.msi", "sha256": "sha256:00"}')
    assert TestClient(server.app).get("/download/solidworks", follow_redirects=False).headers["location"] == \
        "https://example.com/BIZOMAT-CAD-Automation-0.13.0-x64.msi"


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
    assert r.status_code == 302 and "BIZOMAT-CAD-Automation" in r.headers["location"]


def test_the_bizomat_icons_ship():
    """The BIZOMAT mark: in the programs (Start menu, Apps list, taskbar, Explorer) and next to the add-in in Tools > Add-Ins."""
    import struct
    ico = (ROOT / "solidworks" / "src" / "Shared" / "bizomat.ico").read_bytes()
    reserved, kind, count = struct.unpack("<HHH", ico[:6])
    assert (reserved, kind) == (0, 1)
    sizes = {(ico[6 + 16 * i] or 256) for i in range(count)}
    assert {16, 24, 32, 48, 256} <= sizes, sizes
    for proj in ("Companion/KEVOS.Companion.csproj", "App/OpenSketch.Sw.App.csproj"):
        assert "<ApplicationIcon>../Shared/bizomat.ico</ApplicationIcon>" in (ROOT / "solidworks" / "src" / proj).read_text(), proj
    bmp = (ROOT / "solidworks" / "package" / "BIZOMAT.bmp").read_bytes()
    assert bmp[:2] == b"BM" and struct.unpack("<ii", bmp[18:26]) == (16, 16)
    assert "package/BIZOMAT.bmp" in (ROOT / "solidworks" / "build.sh").read_text()
    root = ET.parse(WXS).getroot()
    files = {f.get("Id"): f.get("Source") for f in root.iter("{%s}File" % NS["w"])}
    assert files["AddinIcon"] == "$(var.Source)/BIZOMAT.bmp"
    keys = {k.get("Key"): k for k in root.iter("{%s}RegistryKey" % NS["w"])}
    addin = keys[r"SOFTWARE\SolidWorks\Addins\{" + _const("ClassId") + "}"]
    vals = {v.get("Name"): v.get("Value") for v in addin.iter("{%s}RegistryValue" % NS["w"])}
    assert vals["Icon Path"] == "[#AddinIcon]"
    # the admin and per-user registrations set it too, when the bitmap is next to the add-in
    assert 'k.SetValue("Icon Path", icon)' in (ROOT / "solidworks" / "src" / "Addin" / "Entry.cs").read_text()
    assert (ROOT / "solidworks" / "src" / "App" / "Program.cs").read_text().count('k.SetValue("Icon Path", icon)') == 2
