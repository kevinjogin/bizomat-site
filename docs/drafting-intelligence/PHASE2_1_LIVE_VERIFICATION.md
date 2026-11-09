# Phase 2.1: live SOLIDWORKS verification

Date: 9 Nov 2026. Branch `claude/vigilant-johnson-g8ecmi` (not merged, not deployed).

**Status: the live verification has not run.** The Windows computer was offline and no folder on it was shared
with the session, so no command reached SOLIDWORKS. No operation in this document is LIVE VERIFIED. What was done:
the preflight, Step 3 against the branch's server in the build session, the safety review of the installation and
the test copies, three fixes, and a harness (`apps/cad/windows/live_verify.py`) that runs Steps 4 to 9 on the
Windows computer and records SOLIDWORKS' actual answers.

Three kinds of result are kept apart below: **live** (SOLIDWORKS answered), **local server** (the branch's real MCP
server over HTTP, no SOLIDWORKS behind it), **simulated** (the stand-in add-in of the tests). Only live results can
be LIVE VERIFIED, and only after a person has inspected the evidence.

## 1. SOLIDWORKS version

SOLIDWORKS 2022, revision 30.5.0.0049 (SP5), as KEVOS's Companion registered it with the gateway (read-only,
`sw_list_devices`). Not confirmed live in this phase: SOLIDWORKS was not running.

## 2. Installed add-in version

- KEVOS: Companion 0.13.0 (the MSI "BIZOMAT CAD Automation for SOLIDWORKS" 0.13.0, machine-wide, in
  `C:\Program Files\KEVOS\Bridge`). The add-in loaded in SOLIDWORKS could not be read (no SOLIDWORKS session).
- Add-in 0.15.0: built from this branch (`bash solidworks/build.sh test`, 46 C# tests pass); **not installed** on
  any computer.

## 3. MCP branch and commit

Preflight at `8c1278e` (one docs-only commit after the expected `0068e1f`; working tree clean; the Phase 2 commits
`8b12d79`, `eb46b88`, `baa0692`, `8c35c99`, `0068e1f` present). This phase's commits follow it (section 15).

## 4. Live connection status

| Check | Result |
| --- | --- |
| KEVOS online | no (`online: false`, last seen about 90 minutes before the preflight) |
| SOLIDWORKS sessions on KEVOS | none |
| Folders on the owner's computers shared with this session (Remote Control) | none |
| Live operations run | none: stopped at the preflight, as the procedure requires |

## 5. Step 3 in the build session (local server, no SOLIDWORKS)

The branch's server (`python -m opensketch --port 8765`, empty data folder, loopback only), driven by the official
MCP client (Streamable HTTP, SDK 2.2.0). Not a SOLIDWORKS test.

| Check | Result |
| --- | --- |
| Server name, version | "BIZOMAT CAD Automation", `/healthz` version 8c1278e |
| Tool catalogue | 37 tools: the original 31 (`request_upload` among them) and the 6 drafting tools, none other |
| Schemas | new parameters present and optional: `details` (sw_get_document), `annotations` (sw_get_drawing), `reviewer_name`, `expert_score` (sw_drafting_feedback), `reopen` (sw_open_document, this phase) |
| Request validation | a tolerance without `confirmed_by`, a GD&T frame with an unknown symbol, an unknown plan answer, an expert verdict without the reviewer's name: each refused with the reason, nothing sent; a string for `details`: refused by the schema |
| Response handling | `sw_status` without SOLIDWORKS: `connected: false` with the setup steps, not an error |
| Companion connectivity, add-in version compatibility | not testable here: they need the Windows computer |

## 6. Operations

### 6.1 Live (SOLIDWORKS)

Every operation of Steps 5 to 9 is **NOT RUN**: model reads (geometry, feature tree, dimensions, configurations,
custom properties, material, density and units, volume and mass, Hole Wizard, threads, cut lists), the 18 annotation
operations, the machining workflow A to N, the fabrication smoke test. Nothing is LIVE VERIFIED.

### 6.2 Simulated (the harness against the stand-in add-in)

`tests/test_live_verify.py` runs the whole harness against `SimDrafting` through the MCP server in process. It
proves the harness's order, guards and records; it proves nothing about SOLIDWORKS.

| Result | Count |
| --- | --- |
| executed and read back as expected | 38 (preflight 4, model reads 3, annotations 22, workflow 9) |
| safety guards held | 3 (model-dimension tolerance refused; the part not changed; cut list refused on a part that is not a weldment) |
| not run | 1 (fabrication: no weldment given) |

The stand-in checks each picked point against the real geometry (within 2 mm of an edge of the right kind, as the
add-in does), so the harness's choice of edges from `sw_body_topology` is exercised on a real body.

### 6.3 Compilation

Add-in, Companion and App build against the SOLIDWORKS 2022 interop 30.5.1; 46 C# tests pass. Compilation proves
the calls exist with these signatures, not that SOLIDWORKS does what is expected.

## 7. Screenshots and test evidence

None from SOLIDWORKS. The harness writes them when it runs: a screenshot after the annotation operations (A23), of
the built drawing (W9) and of the weldment drawing (F7), the PDFs (W3, W8), every annotation read back
(`annotations-after.json`), and `results.json` / `results.md` with each operation's SOLIDWORKS message.

## 8. Drawing files created

None. When the harness runs: annotations on the Pack and Go copy of the drawing; a new drawing next to the copied
part from the machining workflow (a free name, never an overwrite); a weldment drawing if a weldment copy is given.

## 9. Annotation capabilities verified

None live. Implemented and simulated: model and reference dimensions, ordinate, diameter and radius, hole callout,
centre mark and line, tolerances, fits and limits, surface texture, datum, GD&T, weld symbol, revision and hole tables,
the cut-list table (refused on a part that is not a weldment), reading annotations, moving an annotation.

## 10. Mass and density investigation

Not settled: it needs the 0.15 details read on the copied part. What is known (Phase 2, section 2): SOLIDWORKS
computed 0.002256 kg for 0.002256 m3, a density of 1 kg/m3, with a consistent unit chain in the add-in. The harness
(R1, `mass_findings`) reads and reports each possible cause separately:

| Cause | What decides it |
| --- | --- |
| No material assigned | `material.active.assigned` false (per configuration too) |
| Document-level density | no material, and the density used equals `material.document_density` |
| Wrong material density | a material assigned with a density far from its kind |
| Mass override | `override_mass` or `user_assigned` |
| Unit conversion | native kg and m3 against the converted g and mm3 (`unit_conversion`) |
| Another property | mass / volume differs from the reported density (`consistent` false) |

No material is assigned or changed, and none is inferred from the mass.

## 11. Known API limitations (from the code, to be confirmed live)

- Weld symbol codes (`<ISOWELD-...>`, `<WELD-...>`) are unverified: the add-in reads the text back after setting it.
- `GetUserPreferenceDouble(swMaterialPropertyDensity)` is taken as kg/m3; Hole Wizard values as metres.
- Edges are picked by model point (nearest edge within 2 mm); an edge hidden in the chosen view may not select.
- Callouts and symbols work on part views only; Advanced Hole elements are not read.
- Tables use the first template found in SOLIDWORKS' file locations; none found means SOLIDWORKS' default.
- No baseline dimension sets, break lines, flat-pattern or exploded views.

## 12. Defects found in this phase

| Defect | Where | Fixed |
| --- | --- | --- |
| Step 7M impossible: no tool could close and reopen a drawing | MCP and add-in | `sw_open_document(reopen=true)`: drawings only, refused while there are unsaved changes, opens from disk; test added |
| A layout fix gave up when the shortest move landed on another annotation | drawing logic (`layout.evaluate_annotations`) | the four directions are tried shortest first; regression test fails before, passes after |
| The stand-in answered edits under `actions`; the add-in answers under `results` (and a move with the moved annotation) | tests | stand-in matches `DrawingEdits.cs` now |
| The development install conflicts with the MSI on KEVOS (section 13) | installation process | procedure below; no code change |
| A drawing copied under a new name in Explorer still shows the original part | test documents | Pack and Go; the harness refuses a copy that shows another part |

Open: everything only a live run can show.

## 13. Installation, backup and rollback

What the existing development install does (`windows/update-addin.ps1`, then `BIZOMAT-CAD.exe --install`): copies the
package to `%LOCALAPPDATA%\BIZOMAT CAD\AddIn`, registers the add-in for this Windows user (HKCU COM classes, which win
over the MSI's machine-wide ones), writes the add-in list and start-up entries for this user and the launcher macro.
It needs no administrator rights and does not touch `C:\Program Files\KEVOS\Bridge`. Run it from a normal (not an
administrator) PowerShell.

Effects on KEVOS that the procedure must allow for:
- The installed Companion removes a per-user registration of the add-in each time it starts (it takes it for an
  old install). So: stop the Companion for the test; if Windows restarts, run update-addin.ps1 again.
- The Companion only talks to the add-in from its own folder, so while 0.15 is loaded the computer is not
  connected to production. That is intended: the test uses the add-in's direct link to the local server only.
- The add-in keeps its direct-link address and key in `HKCU\Software\OpenSketch\SolidWorks`; the test points it at
  the local server, so that key is backed up first and restored after.
- Never use `BIZOMAT-CAD.exe --uninstall` on KEVOS: it also deletes the add-in's start-up entry and tries to delete
  the machine-wide SOLIDWORKS add-in entry the MSI made.
- update-addin.ps1 unblocks the package files (`Unblock-File`), as for every development package; the package is not
  code-signed. If that is not acceptable, wait for a signed build.

Backup (PowerShell, before anything else):

```powershell
$b = Join-Path $HOME ("Documents\BIZOMAT CAD\Backups\phase21-" + (Get-Date -Format yyyyMMdd-HHmm)); New-Item -ItemType Directory -Force $b | Out-Null
$id = '{275256ff-b73a-4e4f-9ea8-842b6626d471}'; $ln = '{ed25919a-7e4a-4a08-a2db-4c69ae22b1ea}'
reg export "HKCU\Software\OpenSketch" "$b\hkcu-opensketch.reg" /y
reg export "HKCU\Software\KEVOS" "$b\hkcu-kevos.reg" /y
reg export "HKCU\Software\SolidWorks\AddIns\$id" "$b\hkcu-addins.reg" /y
reg export "HKCU\Software\SolidWorks\AddInsStartup\$id" "$b\hkcu-addinsstartup.reg" /y
reg export "HKCU\Software\Classes\CLSID\$id" "$b\hkcu-clsid-addin.reg" /y
reg export "HKCU\Software\Classes\CLSID\$ln" "$b\hkcu-clsid-launcher.reg" /y
(Get-ItemProperty "HKLM:\SOFTWARE\Classes\CLSID\$id\InprocServer32").CodeBase | Out-File "$b\machine-addin-codebase.txt"
(Get-Item 'C:\Program Files\KEVOS\Bridge\OpenSketch.Sw.dll').VersionInfo.FileVersion | Out-File "$b\installed-addin-version.txt"
Get-FileHash 'C:\Program Files\KEVOS\Bridge\*' | Export-Csv "$b\installed-files.csv" -NoTypeInformation
Copy-Item "$HOME\Documents\BIZOMAT CAD\BIZOMAT CAD.swb" $b -ErrorAction SilentlyContinue
```

(`reg export` reports an error for a key that does not exist; that only means there was nothing to back up.)

Rollback (SOLIDWORKS closed):

```powershell
$b = '<the backup folder made above>'
$id = '{275256ff-b73a-4e4f-9ea8-842b6626d471}'; $ln = '{ed25919a-7e4a-4a08-a2db-4c69ae22b1ea}'
foreach ($k in "CLSID\$id", "CLSID\$ln", 'OpenSketch.Sw.SwAddin', 'OpenSketch.Sw.Launcher') { Remove-Item "HKCU:\Software\Classes\$k" -Recurse -ErrorAction SilentlyContinue }
if (-not (Test-Path "$b\hkcu-addins.reg")) { Remove-Item "HKCU:\Software\SolidWorks\AddIns\$id" -Recurse -ErrorAction SilentlyContinue }
Get-ChildItem $b -Filter 'hkcu-*.reg' | ForEach-Object { reg import $_.FullName }
Copy-Item "$b\BIZOMAT CAD.swb" "$HOME\Documents\BIZOMAT CAD\" -ErrorAction SilentlyContinue
Start-Process 'C:\Program Files\KEVOS\Bridge\KEVOS.Companion.exe'
```

Then open SOLIDWORKS and check from an AI app on the production connector that `sw_status` shows the computer
connected through the Companion with the version in `installed-addin-version.txt`. Stop the local server with
Ctrl+C. `%LOCALAPPDATA%\BIZOMAT CAD\AddIn` can stay (nothing loads it) or be deleted.

## 14. The live run, step by step (Windows computer)

1. Preflight: `git fetch` and `git checkout claude/vigilant-johnson-g8ecmi` in the repository clone, `git log -1`
   (expect this phase's last commit), `git status` clean.
2. Back up (section 13). Exit the Companion: `& 'C:\Program Files\KEVOS\Bridge\KEVOS.Companion.exe' --exit`.
3. Local server: `cd apps\cad`, `powershell -ExecutionPolicy Bypass -File windows\setup.ps1` (first time), then
   `$env:OPENSKETCH_DATA = "$HOME\Documents\BIZOMAT CAD\Projects\phase21-test\server-data"` and
   `powershell -ExecutionPolicy Bypass -File windows\start.ps1`; press Enter at the public-address question (this
   PC only). Keep it running.
4. Add-in 0.15: build the package (`bash solidworks/build.sh` with the .NET 8 SDK, or the zip handed over with this
   phase), put the zip in Downloads, close SOLIDWORKS, `powershell -ExecutionPolicy Bypass -File windows\update-addin.ps1`.
   It prints the version SOLIDWORKS will load: expect 0.15.0.
5. Test copies: in SOLIDWORKS open the original drawing, File > Pack and Go, include the drawing and the part, add
   the suffix `_P21TEST`, save to `Documents\BIZOMAT CAD\Projects\phase21-test`. Close the originals. Record their
   SHA-256 (`Get-FileHash`).
6. Connect: open the copied drawing; BIZOMAT > Status: address `http://127.0.0.1:8000`, the key from the local
   home page. Check the add-in shows 0.15.0.
7. Run the harness from `apps\cad` (one run does Steps 5 to 9):

   ```powershell
   .venv\Scripts\python windows\live_verify.py --part "<copy>.SLDPRT" --drawing "<copy>.SLDDRW" --original "<original>.SLDPRT" --original "<original>.SLDDRW" [--weldment "<weldment copy>.SLDPRT"]
   ```

   It refuses a server that is not on this computer, copies next to the originals, and a copied drawing that still
   shows the original part. It hashes the originals before and after; a change fails the run (exit code 3).
8. Inspect: open `evidence\results.md`, the screenshots and the PDFs; compare each read with SOLIDWORKS' own dialogs
   (Evaluate > Mass Properties, File Properties, the feature tree). Mark an operation LIVE VERIFIED only when its
   result is right on inspection. Claude Code on that computer can also connect to the local server
   (`http://127.0.0.1:8000/mcp`) to look further.
9. Failures: each row has SOLIDWORKS' message; fix on this branch, add a test, run that operation again
   (`--steps annotations`, for example).
10. Roll back (section 13).
11. Fill in sections 1 to 12 of this file with the live results; keep the simulated sections as they are.

## 15. Regression (Step 11, build session)

| Suite | Result |
| --- | --- |
| CAD MCP `pytest -q`, slow integration tests included (the C# Companion and add-in link end to end) | 461 passed, 2 skipped |
| Drafting and harness tests (`test_drafting_engine.py`, `test_drafting_tools.py`, `test_live_verify.py`) | included above; simulated SOLIDWORKS |
| Sketch solver `npm test` | 9 passed |
| Add-in, Companion and App build, C# tests | builds; 46 passed |
| The original 31 MCP tools | registered with their schemas; their tests pass unchanged |

## 16. Recommended next phase

Run section 14 on KEVOS (about an hour with the copies ready), fix what it finds, and only then judge whether the
machining drawing is professional enough to build on. Weldment and fabrication work waits for that result.

Commits of this phase: see `git log 8c1278e..` on the branch.
