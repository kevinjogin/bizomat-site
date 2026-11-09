# Drafting intelligence, phase 2: drawing execution and SOLIDWORKS integration

Date: 9 Nov 2026. Branch: `claude/vigilant-johnson-g8ecmi` (not merged into main, not deployed).
Add-in: BIZOMAT CAD 0.15.0 (compiled against the SOLIDWORKS 2022 interop 30.5.1, not yet run in SOLIDWORKS).

This report keeps three kinds of result apart:

- **Live SOLIDWORKS**: a command ran in SOLIDWORKS on a real computer.
- **Real data, engine run here**: data read earlier from SOLIDWORKS (read-only), analysed by the engine in this session.
- **Simulated**: a stand-in for the add-in (`tests/test_drafting_tools.py`, `SimDrafting`). It proves wiring,
  validation and flow. It proves nothing about SOLIDWORKS.

## 1. Stage 1: live SOLIDWORKS test

**Not run.** Three blockers, each outside this session's reach:

1. The owner's computer (KEVOS, SOLIDWORKS 2022 SP5 30.5.0.0049, Companion 0.13.0) was offline for the whole
   session (`sw_status`: connected false, last seen 81 minutes before the last check).
2. The six drafting tools and the 0.15 server changes are on this branch only. Production CAD MCP serves the 31
   SOLIDWORKS tools without them, and this phase must not deploy.
3. The 0.15 add-in is not installed on any computer. Its new reads and actions can only be tested after the owner
   installs it.

No live SOLIDWORKS result is claimed anywhere in this report or in the tests.

How to run the live test without deploying production (section 8 has the checklist):

1. On the Windows computer, check out this branch and start the local server: `windows/setup.ps1`, then
   `windows/start.ps1` (port 8000 on that computer only; production is not touched).
2. Install the 0.15 add-in package with `windows/update-addin.ps1`. The package is built by `bash solidworks/build.sh`
   on any computer with the .NET 8 SDK (Linux works). `cad-windows.yml` builds it too, but a run also starts its
   Windows jobs, which use the scarce Windows minutes.
3. Connect the add-in's direct link to `http://127.0.0.1:8000` and Claude Desktop with `windows/connect-claude.ps1`.
4. Work only on copies: copy the clamp plate and its drawing into a new folder (for example
   `Documents\BIZOMAT CAD\Projects\phase2-test`) in Windows Explorer and open the copies. Never Save As over an
   original: Save As in SOLIDWORKS retargets the drawing's reference.

Safe duplicate inside SOLIDWORKS without touching the original: `sw_import` of the STEP file the add-in exports, or
a rebuild with `sw_create_document` and `sw_add_features` into a test folder. Both give a part without the
original's feature tree, so the Hole Wizard and material reads need the Explorer copy.

## 2. Real data, engine run here (clamp plate, read in phase 1)

The data: the feature tree, sketches, dimensions, mass, the body as STEP and the existing drawing of a real mould
clamp plate, read on 8 Nov 2026 with the production tools (read-only, add-in 0.13.0). Kept in the session only.

| | Phase 1 engine | Phase 2 engine |
| --- | --- | --- |
| Holes | 11 in 3 groups | the same |
| Material | "material only in the title block" (major) | material from the title block only; whether the part has one assigned is **not known** (info) |
| Mass | "inconsistent with the material" (major) | SOLIDWORKS gives 2.256 g for 2255.9 cm3 (0.001 g/cm3); cause **not known** from this read (info) |
| Planned annotations | none (no add-in support) | 3 hole callouts, one per group of identical holes |
| Check of the existing drawing | 68 / 100 | 80 / 100; blockers: general tolerance, threads; major: no section through the 7 counterbored or stepped holes |

The phase 1 material finding was a mistake: add-ins up to 0.14 leave an empty material out of their read
(`Commands.cs`: `if (!string.IsNullOrEmpty(mat))`), so a missing value never meant "no material assigned". Phase 2
claims a missing material only when the 0.15 details read says `assigned: false`.

### Mass investigation

- The unit chain of the older read is consistent: one `IMassProperty`, `Volume * 1e9` gives 2,255,933.7 mm3, which
  matches the geometry (346 x 246 x 27 mm less the holes), so that object reported system units; `Mass * 1000`
  then gives grams. No factor-of-1000 slip is in the add-in's code.
- So SOLIDWORKS itself computed 0.002256 kg for 0.002256 m3: a density of 1 kg/m3. Steel (1.1730, C45U) is about
  7850 kg/m3.
- Possible causes, which this read cannot tell apart: no material assigned and a document density of 1 kg/m3
  (Document Properties > Material Properties); a mass override; a material whose density is wrong.
- The 0.15 details read reports each of these: the material per configuration with `assigned`, the document
  density, `IMassProperty.Density`, `OverrideMass`, `UserAssigned`, and whether mass / volume equals the density.
  The engine then names the cause (`understanding._material_and_mass`). No material is inferred from mass.

## 3. What was built

### Add-in 0.15 (C#)

| File | What |
| --- | --- |
| `Core/DrawingMath.cs` | SOLIDWORKS enum values by name (tolerance types, GD&T symbols, material conditions, surface texture symbols, centre mark styles), weld symbol codes, the mass chain with explicit units, annotation bounds. Unit-tested. |
| `Addin/ModelData.cs` | `read` with `details`: units, configurations, custom properties (document and configuration), material per configuration with `assigned` and the document density, mass properties, Hole Wizard data in mm, cosmetic threads, feature parameters, weldment cut list, each model dimension once with its tolerance. |
| `Addin/DrawingAnnotations.cs` | `read_drawing` with `annotations`: every annotation per view with type, name, position, box in sheet mm, text and height, dimension value and tolerance, GD&T frames, datum labels, and the tables. The new `edit_drawing` actions (below). |
| `Addin/Commands.cs`, `DrawingEdits.cs` | details in `read`; dimensions listed once; annotations in `read_drawing`; the new actions in `edit_drawing`. |

New `edit_drawing` actions: `dimension` (smart, linear, horizontal, vertical, diameter, radius, angular, picked by
model points), `ordinate`, `hole_callout`, `chamfer_dimension`, `centre_line`, `centre_mark`, `move_annotation`
(position only), `tolerance`, `surface_finish`, `datum`, `gtol`, `weld_symbol`, `revision_table`, `hole_table`,
`cut_list`. Symbols are native SOLIDWORKS annotation objects, never typed text.

### Server

- `sw_get_document(details=true)`, `sw_get_drawing(annotations=true)` and the new actions are refused before anything
  is sent when the add-in is older than 0.15, with how to update.
- Every action's keys and values are checked on the server first. Tolerance, fit, surface texture, datum, GD&T and
  weld values need `confirmed_by` (who gave them). A tolerance on a model dimension is stored in the part, so the
  add-in refuses it unless `model_change` is true; only a dimension the drawing owns is free.
- No new MCP tool: 37 registered, as before (the 31 existing tools, `request_upload` among them, and the 6 drafting
  tools). New parameters are optional, so existing calls are unchanged.

### Drafting engine

| Stage | What changed |
| --- | --- |
| 2 Model data | Material and mass claimed only from SOLIDWORKS' own report; threads from Hole Wizard tapped holes and cosmetic threads confirmed and matched to holes by tap-drill size; units other than mm reported; model tolerances counted as confirmed. |
| 3 Dimensioning | The plan adds one associative hole callout per group of identical holes, in the main view where the holes are circles. Model dimensions stay associative (InsertModelAnnotations); nothing is dimensioned twice. No tolerance is ever chosen. |
| 4 Annotations | Fits and surface texture from the designer's answers only (`answers.fits`, `answers.surface_symbols`), with `confirmed_by` naming the answers; a fit goes on the model dimension only with `apply_fits_to_model=true`. |
| 5 Machining | The build runs the planned callouts one by one after the sections and details, so one refusal does not stop the rest; each result is reported. |
| 6 Fabrication | A weldment's cut-list table is planned (SOLIDWORKS' own cut list, at the sheet's top right). Weld symbols are never planned: each joint's weld comes from the designer. |
| 7 Layout | Annotation checks from real boxes: overlaps, text off the sheet or in the title block, text under 2.5 mm, dimensions on pictorial views, tables over views or off the sheet. Corrections move views first, then annotation text only (never a value). |
| 8 Benchmarks | The 12 synthetic cases stay as they are. Expert reviews are a separate record: `submit_for_review` keeps the engine's latest check; only an expert verdict with the reviewer's name makes a drawing expert-reviewed; the summary gives corrections before the verdict and agreement with the engine. Reviewers' qualifications are not verified. |

## 4. MCP tools: what each now does with SOLIDWORKS

| Tool | Live-tested | Uses |
| --- | --- | --- |
| `sw_drafting_analyse` | real data read-only (phase 1); not with 0.15 | `read`, `read` numbers, `read` details (0.15), `geometry` |
| `sw_drafting_plan` | engine only | as analyse; stores the plan |
| `sw_drafting_build` | no | `create_drawing`, `edit_drawing` (views, sections, details, callouts, tolerances, symbols, tables), `read_drawing`, `export` |
| `sw_drafting_check` | engine on a real drawing read (phase 1) | `read_drawing` (annotations with 0.15), `edit_drawing` moves |
| `sw_drafting_knowledge` | not SOLIDWORKS | the knowledge base |
| `sw_drafting_feedback` | not SOLIDWORKS | the account's store, expert reviews |

## 5. Operations: working, pending, missing

Working in the simulated tests, not yet in SOLIDWORKS: every operation in section 3.

Implemented but unverified in SOLIDWORKS (the live checklist covers each):
- Weld symbol codes `<ISOWELD-...>` / `<WELD-...>`: the add-in reads the text back after setting it.
- `GetUserPreferenceDouble(swMaterialPropertyDensity)` is assumed to be in kg/m3 (system units).
- `IWizardHoleFeatureData2` values are assumed to be in metres; `threaded` is taken from the hole type (Tap) or a
  thread diameter and depth, never a tap-drill value alone.
- Selection by model point: `ModelToViewTransform` and the nearest edge within 2 mm; a wrong pick is refused, not
  guessed.
- `AddHoleCallout2`, `AddOrdinateDimension2`, `InsertHoleTable2`, `InsertWeldmentTable`, `InsertRevisionTable2` with
  the first template found in SOLIDWORKS' file locations.
- `IAnnotation` boxes from `IDisplayData` lines and text (text extent estimated where SOLIDWORKS gives none).

Missing (not built in this phase): baseline dimension sets, break lines, flat-pattern views, exploded views,
Advanced Hole elements, assembly-view selections (callouts and symbols work on part views for now), hole tables
planned automatically (the action exists; choosing the origin edge needs the live test first), chamfer and
centre-line actions planned automatically (the actions exist).

## 6. Example drawings

None produced in SOLIDWORKS in this phase (Stage 1 blocked). The simulated build makes a clamp-plate drawing in
the stand-in: views, section A-A, hole callouts, layout moves, a PDF; it is a test fixture, not an example
drawing, and is labelled so.

## 7. Regression results (9 Nov 2026)

| Suite | Result |
| --- | --- |
| CAD MCP `pytest -q -m "not slow"` | 450 passed, 2 skipped |
| Drafting tests (`test_drafting_engine.py`, `test_drafting_tools.py`) | 57 passed (simulated SOLIDWORKS) |
| Synthetic benchmark (12 cases) | feature recall, disciplines, main view and section decisions at their floors or above, unchanged |
| Add-in, Companion and App (`bash solidworks/build.sh test`, .NET 8 SDK on Linux) | builds; 46 C# tests pass |

## 8. Live checklist (add-in 0.15, on copies only)

Read-only first:
1. `sw_get_document(details=true)` on the copied clamp plate: units mm; material `assigned` true or false; document
   density with its unit; mass, volume and density with units; `consistent`; `override_mass`. Compare the mass with
   Evaluate > Mass Properties. This settles the mass question in section 2.
2. Hole Wizard holes and cosmetic threads: sizes in mm, `threaded` right for a tapped and a plain hole.
3. `sw_get_drawing(annotations=true)` on the copied drawing: every dimension and note listed, boxes in sheet mm that
   match a screenshot, general notes read back.
4. `sw_drafting_analyse` and `sw_drafting_check` on the copies.

Then a separate test drawing (`sw_drafting_build` with `overwrite=false`, into the test folder):
5. Views, sheet and scale as planned; section A-A through the counterbores; layout moves.
6. Hole callouts: one per group, associative, readable, next to the right holes.
7. `move_annotation` on an overlapping dimension: only its position changes.
8. A tolerance on a drawing reference dimension (allowed) and on a model dimension (refused without
   `model_change`); the part stays unchanged (`sw_status`: no unsaved changes on the part).
9. `surface_finish`, `datum`, `gtol` and one `weld_symbol` with test values marked as test values; read back each.
10. `revision_table`, `hole_table`, and on a weldment copy `cut_list`.
11. Save, close, reopen the drawing; read it again; export PDF.
12. Record each operation as passed, failed with SOLIDWORKS' message, or not available, in this file.

## 9. Next stage

1. Run section 8 on the KEVOS computer, fix from the results, and record them here.
2. Then make the machining drawing workflow reliable on real parts (shafts, blocks, plates) before extending
   fabrication.
3. Deploy only after that, by the owner, through `deploy.yml`.
