# CADOS for SOLIDWORKS: the native add-in, its installer and its release

## 1. Architecture (as of 0.12.0)

```
AI assistant (Claude, ChatGPT, MCP clients)
   |  HTTPS, OAuth 2.1 (MCP Streamable HTTP)
CADOS gateway (this server, https://bizomat.ai/cad): sign-in, devices, checks, command routing
   |  outbound HTTPS from the computer, signed both ways (docs/BRIDGE-PROTOCOL.md)
KEVOS Companion (KEVOS.Companion.exe, tray, per Windows user)
   |  local named pipe, this Windows user only
CADOS add-in (OpenSketch.Sw.dll, COM, inside SOLIDWORKS) -> SOLIDWORKS API on SOLIDWORKS' UI thread
```

| Part | Source | What it is |
|---|---|---|
| CADOS add-in | `solidworks/src/Addin` (+ `src/Core`) | A COM class implementing `ISwAddin` (`OpenSketch.Sw.SwAddin`, CLSID `275256ff-...`), .NET Framework 4.8 x64, built against the SOLIDWORKS 2022 interop (30.5.1, types embedded). Listed in Tools > Add-Ins as **CADOS**. Adds the CADOS CommandManager tab and toolbar (`KevosUi`), the CADOS menu, the **CADOS task pane** (`CadosPane`), the status window (`ConnectForm`) and the **CADOS: confirm** window (`Safety`). Runs every command (sketches, features, assemblies, drawings, exports) through the SOLIDWORKS API. |
| KEVOS Companion | `solidworks/src/Companion` | Tray app: pairing, the device key (Windows key store, TPM first), the signed link to the gateway, SOLIDWORKS detection, verified updates, diagnostics. |
| Installer | `installer/KEVOS-Bridge.wxs`, `installer/build.ps1` | **CADOS for SOLIDWORKS**, a per-machine x64 MSI (WiX 5). Installs both into `C:\Program Files\KEVOS\Bridge`, registers the COM classes and the add-in for every SOLIDWORKS version (HKLM), starts the Companion at sign-in, Start menu entries, upgrade, repair, uninstall. Same UpgradeCode as KEVOS Bridge 0.11, so it upgrades it in place. |
| Manual package | `solidworks/build.sh` -> `OpenSketch-SOLIDWORKS.zip` | The same add-in DLL plus `OpenSketchSW.exe`, a per-user installer (no administrator rights; HKCU registration). For development and locked-down computers. |
| Launcher macro | written by `OpenSketchSW.exe` into `Documents\OpenSketch\OpenSketch.swb` | Only starts the installed add-in (`OpenSketch.Sw.Launcher`) where SOLIDWORKS does not list per-user add-ins. Not the add-in, never offered as a download. |
| Website | `opensketch/site.py`, `opensketch/sw_page.py` | Product page, documentation and dashboard. **Download CADOS for SOLIDWORKS** goes to `/download/solidworks`, which redirects to the published MSI. |

The AI work is done by the person's own AI assistant through the MCP tools (`opensketch/sw_tools.py`); CADOS runs no AI
of its own. The add-in's job inside SOLIDWORKS is to run the commands, ask before destructive ones, and show what is
happening (task pane, status window, log).

## 2. Gap report: macro workflow versus a native add-in

What the request assumed, and what the code shows:

| Assumed | Found in the code | Gap | Done in 0.12.0 |
|---|---|---|---|
| CADOS is delivered as a downloaded `.swp` macro | No macro is generated or downloaded by the server. The add-in has been a real COM add-in (`ISwAddin`) since the first release; the MSI (0.11, "KEVOS Bridge") registers it in Tools > Add-Ins. The only macro is the launcher `OpenSketch.swb`, written locally by the manual installer as a fallback. | Branding and presentation: the add-in was titled **KEVOS**, the site said "Install CADOS" without naming the add-in, the download linked to a release list, and the dashboard showed the launcher macro next to the add-in instructions. | Add-in, menu, tab and installer renamed **CADOS** / **CADOS for SOLIDWORKS**; primary action **Download CADOS for SOLIDWORKS** (`/download/solidworks`); the launcher macro is described only in the manual route and labelled as not being the add-in; the documentation states that CADOS offers no macro downloads. |
| Needs a toolbar and command interface | CommandManager tab, toolbar and menu existed (KEVOS). | Name. | CADOS tab, menu and toolbar; a CADOS panel button. |
| Needs a task pane | None (a separate status window only). | Missing. | `CadosPane`: a SOLIDWORKS task pane tab with the connection state, Connect / Disconnect, prompts to copy into the assistant, the confirmation setting, live activity and links (dashboard, documentation, troubleshooting, Companion, log). |
| Secure connection to the backend | Signed outbound link through the Companion (pairing, device key, signed commands); the direct link (key) as fallback. | None. | Kept as is. |
| Professional installer | WiX MSI per machine, upgrade, repair, uninstall, built on Windows in CI; unsigned until a signing service is set up. | Name, file name, a stable download link; code signing. | MSI named **CADOS for SOLIDWORKS**, file `BIZOMAT-CAD-Automation-<version>-x64.msi`, plus `BIZOMAT-CAD-Automation-x64.msi` (stable name) on the `bridge-latest` release. Signing: still open (docs/KEVOS-SIGNING.md). |
| Versions and compatibility | Built against SOLIDWORKS 2022; one registration for every installed version. Not yet run in a real SOLIDWORKS. | Verification on real installations. | Stated as such on the site (Supported SOLIDWORKS versions) and in docs/KEVOS-VERSIONS.md; automated checks below. |

Nothing that worked was removed: the COM ids, the ProgIDs, the per-user installer, the direct link, the launcher macro,
the MCP tools, the API and the device protocol are unchanged.

## 3. Automated checks

- `solidworks.yml` (every push): builds the add-in, Companion and per-user installer against the SOLIDWORKS 2022
  interop on Linux and runs the .NET tests; on Windows, builds again, runs the tests, and builds the MSI with WiX.
  Artifact `BIZOMAT-CAD-Automation-MSI` on every run.
- `tests/test_installer.py`: the MSI registers the same CLSID and ProgID as the add-in code, lists it in Tools >
  Add-Ins under the add-in's own title and description, keeps the UpgradeCode, is named CADOS for SOLIDWORKS; the
  version is higher than the last release; the MSI names in `build.ps1` and the server's download link agree.
- `tests/test_bridge_e2e.py` (slow): the real C# Companion engine and add-in pipe link against the real server.

## 4. Release process

1. Bump `<Version>` in `solidworks/Directory.Build.props` (add-in, Companion and MSI share it; an MSI upgrade needs a
   higher version). Add the release notes to `docs/KEVOS-RELEASE-NOTES.md`.
2. Merge to `main`. `solidworks.yml` replaces the `bridge-latest` pre-release with the new MSI (versioned and stable
   names, SHA-256 files, `release.json`). The repositories are private, so that release is for the owner: download the
   MSI from it (signed in to GitHub), or build it on Windows with `installer\build.ps1`. Then publish it with
   `.\cloudflare.ps1 publish installer -File <msi>`. That puts it on https://bizomat.ai/downloads/cad/ with its
   SHA-256, and writes the release record the Download button and the Companions read.
3. Run the checklist in `docs/KEVOS-TEST-REPORT.md` section 4 on a clean Windows computer with SOLIDWORKS 2022 (and
   each newer version you support): install, Tools > Add-Ins lists CADOS, the CADOS tab and task pane appear, pairing,
   the self test, a destructive change asks, uninstall leaves CAD files.
4. Tag `bridge-v<version>` and push the tag: CI publishes the versioned release.
5. The update reaches paired computers through the release record `publish installer` wrote (CAD's
   `bridge-release.json`, read at the server's next start). The Companion verifies the hash, signature and publisher
   and asks before installing. `/download/solidworks` prefers the record too; `OPENSKETCH_INSTALLER_URL` overrides both.

## 5. Not verified yet

- The add-in, its task pane and the MSI have been compiled and built, not run in a real SOLIDWORKS: section 4 of the
  test report is the gate before telling customers it is ready.
- The MSI is unsigned until a code-signing service is connected (docs/KEVOS-SIGNING.md): Windows SmartScreen warns,
  and the Companion does not update itself from unsigned builds.
- The public download exists only once `publish installer` has run for a release; until then `/download/solidworks`
  leads to a missing file.
