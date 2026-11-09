# BIZOMAT Drafting Intelligence Engine: technical specification

_Version 0.1.0, 8 Nov 2026. Code: `apps/cad/opensketch/drafting/` (engine) and `apps/cad/opensketch/sw_drafting.py`
(MCP tools). Audit that led to it: `ARCHITECTURE_AUDIT.md`._

## 1. Principle

Draw to communicate how the product is made, fabricated, assembled, inspected, installed and maintained, never
merely to represent the model. The engine thinks before it draws (analyse, plan), draws with the existing SOLIDWORKS
commands (build), and checks its own work (check). Engineering-critical content is never chosen by the engine:
tolerances, fits, threads, welds, materials and finishes come from the designer, and a drawing is never
manufacturing-ready because it saved. A person releases it.

## 2. Architecture

```
AI assistant (any MCP client: Claude, ChatGPT, ...)
   |  MCP (Streamable HTTP, /mcp, unchanged)
CAD MCP server (opensketch)
   |-- sw_drafting_* tools (sw_drafting.py)  -- reasoning only, no SOLIDWORKS API of their own
   |      |-- drafting engine (drafting/*.py): plain data in, plain data out
   |      |-- reuse: _run("read"), _geometry (STEP of the body), _run("read_drawing"),
   |      |          sw_create_drawing, sw_edit_drawing, sw_export
   |-- existing sw_* tools (unchanged)
   |  bridge (devicebridge / swbridge, unchanged)
Companion -> pipe -> BIZOMAT CAD add-in (unchanged): every SOLIDWORKS call on SOLIDWORKS' UI thread
```

OpenCascade work (facts from the solid) runs in the person's CAD worker (`engine.recognise_part`,
`engine.recognise_assembly`); everything else runs on the server in microseconds to milliseconds.

## 3. Modules

| Module | File | Input | Output |
| --- | --- | --- | --- |
| A Model understanding: geometry | `facts.py` | the solid (from SOLIDWORKS' STEP) | per body: faces (type, area, normal, axis, radius, cone angle, torus radii, concave/convex, span along axis, bbox, loops), adjacency with angles, volume, bbox, centre of mass |
| A Model understanding: features | `features.py` | facts | holes (through, blind flat or drilled, counterbore, countersink, stepped) with segments, entry, depth; patterns (pitch circle, linear, grid, pair); slots; pockets and steps; turned profile (diameters, shoulders, grooves, tapers, end chamfers); bosses; fillets and rounds; chamfers; wall thickness; sheet-metal evidence (thickness, bends); member evidence (section class, size, length, end cuts, bore); elbows; flanges; body contacts. Every item: references, sizes, `source: geometry`, confidence |
| A Engineering model | `understanding.py` | `read` (feature tree with SOLIDWORKS type names, sketches, dimensions), numbers (material, mass), features, title-block fields | the model with `confirmed`, `inferred` (with basis and confidence), `unknown` (with the question and whether it blocks) and `problems` (rebuild errors, under-defined sketches, material not assigned, mass inconsistent with the material); dimensions de-duplicated; intent from feature and sketch names (thread, clearance, counterbore, fit, bearing, weld, lifting...) |
| B Discipline classification | `disciplines.py` | engineering model, optional override | 17 labels with score and reasons, `applies` (score 0.5+), primary, overlaps, recommended drawing package; for an assembly, each part's own discipline |
| C Manufacturing reasoning | `reasoning.py` | engineering model, labels | per discipline (machining, turning, weldment, structural, sheet metal, assembly, piping, general arrangement): operations, candidate datums, critical features, information required (blocking or not), proposed notes, checks, knowledge topics, cut list and joints (weldments), bolt groups (structural), pipe items (piping) |
| D Knowledge base | `knowledge.py`, `knowledge/entries.json` | query, discipline, category, topics | ranked entries with the terms that matched, source, level, validation (section 6) |
| E Drawing strategy | `strategy.py` | model, labels, reasoning, dimension plan, answers | the plan (section 4.2) |
| F Dimensioning | `dimensioning.py` | model | model dimensions classified (size, location, depth, overall, reference geometry), coverage per feature with missing items, redundancy (repeated per-hole locations, pitch circle given as x/y offsets, closed chains), proposed ISO/AS callouts per hole group, tolerance candidates (listed, never toleranced), the dimensioning method |
| G Standards | `standards.py` | profile id | AS1100, ISO, ASME profiles: projection, required notes and title-block fields, preferred scales, references by number and title only, what the add-in can and cannot draw, a statement that compliance is not claimed |
| H Layout | `layout.py` | `read_drawing` result | findings (off sheet, title-block clash, overlap, crowding, projection position, alignment, white space, crowded sheet, pictorial dimensions, balance) and corrections that are view moves only; free-space placement for new views |
| I Quality assurance | `qa.py` | drawing, model, plan, exports, confirmed answers | 100-point index by category, release blockers separately, findings with knowledge references, `manufacturing_ready: false` always |
| J Learning | `learning.py` | plans, feedback, guidelines | SQLite per account: plans, feedback (10 kinds), approved examples (expert + retain only), company guidelines |
| J Benchmarks | `benchmarks.py`, `engine.run_benchmarks` | 12 synthetic models with expected results | recall, discipline accuracy, main-view and section decisions |

## 4. Data contracts

### 4.1 Engineering model (understanding.build)

`kind`, `title`, `units`, `overall` {size, volume_mm3, mass_g, material, body_count}, `design` {features [{name,
sw_type, category, what, suppressed, state, name_intent}], feature_categories, sketches {total, by state},
dimensions [{name, value, dim, owner}], dimension_count, equations, configurations, custom_properties},
`recognised` (features.recognise output), `confirmed[]`, `inferred[]`, `unknown[]`, `problems[]`, and for
assemblies `assembly` {components, fasteners, unique_parts}.

### 4.2 Drawing plan (strategy.make_plan), saved with its `plan_id`

`purpose`, `audience`, `disciplines` {applies, primary, overridden}, `standard` {profile, name, statement},
`package[]` {drawing, for, status}, `sheet`, `scale`, `projection`, `sheet_fill`, `views[]` {orientation, role
(main, edge, end, projection, pictorial), why, dimensions}, `omitted_views[]` (with why), `sections[]` {label,
direction, through (model point), features, why, not_covered}, `details[]` {label, through, scale, radius_mm,
features, why}, `datums[]`, `dimensioning` {scheme, coverage, missing_in_model, redundancy, callouts,
tolerance_candidates}, `notes[]` and `notes_status` {confirmed, proposed, to_be_confirmed}, `title_block` and
`title_block_missing`, `questions[]` {id, question, why, blocking, applies_to, options}, `release_blocked`,
`release_blocked_by`, `execution` {create_drawing (the exact sw_create_drawing arguments), then (the edits in
words), deferred}, `knowledge[]`, `human_release`.

### 4.3 Quality report (qa.check)

`quality_index` (0..100), `by_category` {model 10, views 20, dimensions 25, annotations 10, engineering 15,
presentation 15, document 5}, `release_blocked`, `release_blockers[]`, `counts`, `findings[]` {category, severity
(blocker, major, minor, info), check, message, view, fix, knowledge}, `layout` {fill, corrections},
`auto_correctable[]`, `manufacturing_ready: false`, `release`.

## 5. MCP tools (added; the 31 existing tools are unchanged)

| Tool | Parameters | Changes |
| --- | --- | --- |
| `sw_drafting_analyse` | doc, component, drawing, disciplines (override), detail, device | nothing (read-only) |
| `sw_drafting_plan` | doc, component, purpose, standard (AS1100, ISO, ASME), disciplines, sheet, scale, isometric, answers, device | stores the plan on the server |
| `sw_drafting_build` | plan_id, overwrite, correct_layout, export (pdf, dwg, dxf), device | makes a new drawing (create_drawing + edit_drawing); never the model |
| `sw_drafting_check` | doc, plan_id, with_model, correct_layout, rounds (1..3), answers, device | with correct_layout: view moves only |
| `sw_drafting_knowledge` | query, discipline, category, include_suggestions, limit | nothing (read-only) |
| `sw_drafting_feedback` | kind (also submit_for_review), plan_id, drawing, target, before, after, comment, reviewer, reviewer_name, expert_score, retain, guideline | stores feedback, a guideline or an expert review on the server |

`answers` keys: material, general_tolerance, threads {hole id: spec}, fits {feature: fit}, surface_finish,
surface_symbols {hole id: roughness}, edge_break, welds, finish, title_block {field: value}, notes [lines],
approve_proposed_notes, apply_fits_to_model (a fit goes on the model's own dimension, which changes the part). Unknown keys and wrong
types are refused before anything is sent. Every error result is `{"error": ...}` with `is_error`. The tools are in
`catalog.GROUPS` ("Drafting intelligence") and in the server's instructions.

Build sequence: create_drawing with the planned views, sheet, scale, the model's dimensions, notes and title block;
read the drawing; move the base views into their projection positions (layout corrections); add the planned
sections and details in free space beside the main view; insert the model's remaining dimensions (no duplicates),
centre marks, a bill of materials with balloons for assemblies, arrange dimensions; with an add-in of 0.15 or later,
the planned hole callouts, the designer's fits and surface symbols and a weldment's cut list, one action at a time
(reported as deferred with an older add-in); correct the layout again (view moves, then annotation text moves);
export if asked; check against the plan. Phase 2 (`PHASE2_EXECUTION.md`) describes the 0.15 reads and actions.

## 6. Knowledge base

- Shipped entries: `knowledge/entries.json`, 56 entries in 18 categories (01 General Engineering Drafting to 18
  Drafting Mistakes and Corrections), each with topic, disciplines, concept, explanation, practice, example, correct
  approach, common mistake, standards referenced (number only, `verified: false`), source, level, validation,
  confidence, tags. All are written for BIZOMAT from general drafting practice; no standard text is reproduced.
  Level `recommended` (53) or `example` (3, synthetic); validation `unverified`.
- Company entries: per account in SQLite, added with `sw_drafting_feedback(kind="guideline")`: level `company`
  when the reviewer is an expert, `suggestion` otherwise (left out of retrieval unless asked). `mandatory` needs
  `verified`, which only an owner's entry file can carry.
- Retrieval: BM25 over the entry text, x1.5 for the requested discipline, +3 for an exact topic or tag, x1.3 for
  company and mandatory entries; each result lists the terms that matched, so a recommendation can be explained.
- Licensed documents (standards, manuals) are not ingested by this version: they need an owner decision on
  licensing first. The entry schema already carries edition and verification fields for when they are.

## 7. Safety rules built in

- Never a tolerance, fit, thread, weld, material or finish chosen by the engine; unknowns show as TO BE CONFIRMED on
  a draft and as release blockers in the check.
- Approval fields (CheckedBy, ApprovedBy) are never filled.
- Layout corrections are view moves and annotation text moves only; scales, values, tolerances and notes are not
  changed automatically.
- The model is never changed by the drafting tools, except a fit the designer gave with apply_fits_to_model=true (a
  model dimension's tolerance lives in the part); the drawing is new unless the person asks to overwrite.
- A material is claimed missing only when SOLIDWORKS reports none assigned (add-in 0.15 details); never inferred
  from mass.
- Feedback and plans stay on the server, per account; examples are retained only when the person says so; nothing
  trains an external model.
- `manufacturing_ready` is always false in a report; release is a person's decision.

## 8. Testing (8 Nov 2026)

| Level | What | Result |
| --- | --- | --- |
| Unit | `tests/test_drafting_engine.py`: knowledge integrity and retrieval, recognition on hand-made facts, classification, override, planning, answers, understanding (names, dimensions, mass), dimensioning (PCD offsets, repetition, callouts), standards, layout, QA blockers, learning store, fresh-process import | passes |
| Benchmark | 12 synthetic models (stepped shaft, flanged shaft, bearing housing, machined block, multi-hole plate, bracket, welded frame, beam connection, sheet-metal enclosure, mechanical assembly, pipe spool, equipment assembly) | feature recall 1.00, discipline 1.00, main view 1.00, section decision 1.00 on this synthetic set; floors in the test: 0.95 / 0.9 / 0.9 / 0.9 |
| MCP integration (simulated SOLIDWORKS) | `tests/test_drafting_tools.py`: analyse, plan, build, check, feedback, knowledge through the MCP server; input validation; per-account plans; catalog and schema | passes; the drawing commands are simulated |
| Real SOLIDWORKS data, read-only | a real mould clamp plate and its existing drawing on the owner's computer (SOLIDWORKS 2022 SP5, add-in 0.13.0): feature tree and drawing read with the production tools, the body exported as STEP (SHA-256 checked), the engine run here on that data | recognition: 53 faces, 11 holes in 3 groups (counterbored clearance holes in a grid, a counterbored stepped bore, flat-bottomed blind holes at M6 tapping size on a pitch circle), thread and clearance intent inferred from sketch names at medium confidence, never confirmed; plan: A3 1:2, plan view + one edge view + section A-A through the counterbores and the bore, right view and isometric left out with reasons; check of the existing drawing: 68/100, 2 release blockers (general tolerance, threads), 3 major (no section through counterbores, material only in the title block, mass inconsistent with the material), 7 minor (redundant right view, pitch circle given as x/y offsets, per-hole repeated locations, empty DrawnBy and Date). Nothing in SOLIDWORKS was changed; the data stayed in the session. **Correction (9 Nov 2026):** "material only in the title block" was not supported by the data (the add-in leaves an empty material out of its read); the phase 2 engine reports the material and the mass as not verified and scores the drawing 80/100 (`PHASE2_EXECUTION.md`, section 2) |
| Live SOLIDWORKS drawing creation by the new tools | the new tools are not deployed, so they have not run against SOLIDWORKS | not run |

Live tests still to run (on the KEVOS computer, SOLIDWORKS 2022 SP5; for add-in 0.15 the checklist in
`PHASE2_EXECUTION.md`, section 8, which runs against a local server and needs no deployment):
1. sw_drafting_analyse on a part, an assembly, a weldment and a sheet-metal part.
2. sw_drafting_build on a plate with counterbores: section A-A placed and readable; layout moves applied; PDF export.
3. sw_drafting_build on a turned shaft: detail view of a groove at the planned scale.
4. sw_drafting_build on an assembly: BOM and balloons.
5. sw_drafting_check with correct_layout on a deliberately misaligned drawing.

## 9. Known limitations and pending capabilities

Engineering and recognition:
- Threads are never seen in STEP geometry. Add-in 0.15 reads Hole Wizard data and cosmetic threads (unverified in
  SOLIDWORKS); without it, holes at tapping-drill size are hints, not threads.
- Holes that break out through a face (partial cylinders) are not recognised as holes; slots need two half
  cylinders on parallel axes.
- Weldment members are recognised from geometry (section class and size); the SOLIDWORKS weldment profile name,
  cut-list properties and grade are not read.
- Sheet-metal thickness and bends come from geometry; K-factor, bend allowance and the flat pattern are in
  SOLIDWORKS and not read.
- Datums are candidates from geometry (largest face, outside faces); functional datums come from the designer.
- Configurations and part custom properties: read by add-in 0.15 only.
- Mass on the real part: SOLIDWORKS computed a density of 1 kg/m3; the add-in's unit chain is consistent. The cause
  (no material with that document density, an override, or a wrong material density) is read by add-in 0.15
  (`PHASE2_EXECUTION.md`, section 2).

Drawing API: add-in 0.15 adds hole callouts, dimensions between picked entities, ordinate dimensions, hole tables,
weld symbols, GD&T frames, datum symbols, surface texture symbols, revision tables, weldment cut-list tables,
annotation boxes, notes read back and dimension tolerances; all compiled, none yet run in SOLIDWORKS. Still missing:
baseline sets, flat-pattern views, exploded views, break lines, assembly-view selections.

## 10. Resources and cost

No new service, dependency or storage engine: Python standard library, the existing build123d/OpenCascade kernel and
SQLite. Analysis costs one `read` (two with numbers), one STEP export (cached by the model's update stamp) and a
recognition pass in the CAD worker (well under a second for a part of a few hundred faces); planning and checking
are milliseconds. Storage: a few kilobytes per plan and feedback record per account. No change to the Fly Machine
size.

## 11. Deployment and rollback

Deployed with CAD MCP (the `cad` role of the image). The phase 1 behaviour needs no add-in update; the phase 2
reads and actions need the add-in 0.15, and the server checks the add-in's version before sending them, so a server
with phase 2 works with older add-ins (those steps are reported as deferred). Rollback: deploy the previous image;
the six tools disappear and the 31 existing tools are unchanged; a 0.15 add-in takes the same commands as before from an older server (the new keys are optional). The
drafting SQLite files (`<data>/drafting/<account>/`) can stay; nothing else reads them.
