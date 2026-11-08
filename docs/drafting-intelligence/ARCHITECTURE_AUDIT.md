# BIZOMAT Drafting Intelligence: architecture audit

_8 Nov 2026. Repository `jogkev-creator/bizomat`, branch `claude/vigilant-johnson-g8ecmi` (main at 536a882). Read-only
audit of CAD MCP before the drafting engine was added. Live facts were read from the owner's computer through the
production connector with read-only tools only (sw_status, sw_get_document, sw_get_drawing, sw_body_topology)._

## 1. Where CAD MCP lives

| Part | Path | Language | Role |
| --- | --- | --- | --- |
| MCP server | `apps/cad/opensketch/mcp_server.py` | Python 3.12, MCP SDK `MCPServer` | One server, name "BIZOMAT CAD Automation", Streamable HTTP at `/mcp` and `/solidworks/mcp`, OAuth (`mcpauth.py`) or private address |
| SOLIDWORKS tools | `opensketch/sw_tools.py` (31 tools with `sw_selftest.py`) | Python | Each tool checks its input, then sends one command to the computer (`swbridge.call` -> `devicebridge` -> Companion -> add-in) |
| Geometry here | `geometry.py`, `inspection.py`, `measure.py`, `importer.py`, `preview.py` | Python, build123d / OpenCascade | Reads SOLIDWORKS' STEP of the body (`sw_tools._geometry`, cached by update stamp) and analyses it in the person's CAD worker (`cadworker.lane_for(person, "agent")`) |
| Add-in | `apps/cad/solidworks/src/Addin` | C#, .NET Framework 4.8, SOLIDWORKS 2022 interop 30.5 | Runs every SOLIDWORKS API call on SOLIDWORKS' UI thread (`Host`); `Commands.cs` (read, features, geometry, export), `Drawings.cs` (create_drawing), `DrawingEdits.cs` (read_drawing, edit_drawing) |
| Companion | `solidworks/src/Companion` | C# | Signed outbound link to the gateway, local named pipe to the add-in; never calls SOLIDWORKS' API |
| Tool catalog | `opensketch/catalog.py` | Python | Plain-words list of every tool; `tests/test_app_pages.py` keeps it equal to the registered tools |
| Data folder | `store.data_dir()` (`/data/cad` in production) | files, SQLite | Accounts, OAuth, `bridge.sqlite`; per-person files by `store.owner_of` |
| Tests | `apps/cad/tests` | pytest | `SimSW` in `test_sw_selftest.py`: a stand-in add-in that builds with the kernel and answers `geometry` with a real STEP; `bridge_fakes.py`: a stand-in Companion |

There was no drafting knowledge store, no drawing planner and no drawing checker. Drafting practice existed only as
text in `SW_GUIDE` (`sw_tools.py`, read by the AI with `sw_get_guide`).

## 2. Installed SOLIDWORKS and add-in (live, read-only)

- Computer KEVOS: Windows 10 Pro (build 26300), SOLIDWORKS 2022, revision 30.5.0.0049 (2022 SP5).
- Add-in and Companion on that computer: 0.13.0 (this repository builds 0.14.0, not yet installed there).
- The add-in is compiled against the SOLIDWORKS 2022 interop (30.5.1). Every API call the drafting engine relies on
  already exists in the add-in and runs there: `read` (feature tree with `GetTypeName2`, sketch states, dimensions,
  equations, body), `geometry` (STEP of the body), `create_drawing`, `read_drawing`, `edit_drawing` (16 actions),
  `export` (PDF, DWG, DXF). The engine adds no new SOLIDWORKS API call, so it needs no add-in update.

## 3. Drawing capabilities found (kept unchanged)

| Tool | What it does in SOLIDWORKS |
| --- | --- |
| `sw_create_drawing` | Native .SLDDRW from the default template: sheet A4..A0, third or first angle, standard or named views, a preferred scale that fits, model dimensions (InsertModelAnnotations3), centre marks, general notes, title-block custom properties, overwrite |
| `sw_get_drawing` | Sheet (size, scale, projection), views (type, orientation, scale, outline in sheet mm, display, number of dimensions, model), title-block properties |
| `sw_edit_drawing` | view, projected, section, detail, move, scale, display, delete, rename, dimensions, arrange_dimensions, centre_marks, note, properties, sheet, bom (with balloons) |
| `sw_export` | PDF (all sheets), DWG and DXF (active sheet), copy of the .SLDDRW |

Dimensions on drawings are the model's own (associative, inserted from the model). There is no API in the add-in to
create a new dimension between two picked drawing entities; that is the main gap for "intelligent dimensioning".

## 4. What a real model looks like (live: a mould clamp plate)

Read on 8 Nov 2026 from the owner's open documents (values summarised, nothing stored in the repository):

- Feature tree: reference planes, SOLIDWORKS Plastics attributes, an extrusion and five cut extrudes (type `ICE`).
  No Hole Wizard features: hole purpose is only in the sketch names (of the kind "M10 Clearance", "M6 Tapping"). Thread intent must therefore be inferred from names and sizes and confirmed, never
  assumed.
- Faces: 53 (the STEP export splits every cylinder in two halves). Six through holes with counterbores, a stepped
  bore, four flat-bottomed blind holes on a pitch circle. All recognisable from faces, axes, radii and spans.
- `dimensions` lists each model dimension several times (the add-in walks every feature and sub-feature): the engine
  must de-duplicate by full name.
- `body.mass_g` is 2.256 for 2.26 litres: inconsistent with the steel named in the drawing's title block (expected
  near 17.7 kg). Either no material is assigned in the part, or the mass units are wrong (`Commands.cs` line 647,
  `mp.Mass * 1000`; check `IMassProperty.UseSystemUnits`). To confirm in SOLIDWORKS. The QA engine reports it.
- The drawing: A3, 1:2, third angle; Front, Top, Right at the sheet scale, an isometric at a smaller scale;
  title-block properties for drawing number, finish, material, project, revision and title (no DrawnBy, Date, Checked). No section view,
  although counterbores, a stepped bore and blind holes are only visible as hidden detail.

## 5. Constraints that shape the design

- One MCP server; tools are registered on `mcp` in `sw_tools.py` and its sibling modules, named `sw_*`, and listed in
  `catalog.GROUPS` (a test enforces it).
- OpenCascade work must run in the CAD worker, through functions importable as `module:qualname` (cadworker resolves
  them by name in a fresh process). Pure Python logic can run on the web server.
- `OPENSKETCH_CAD_WORKERS=0` in tests (threads instead of processes); production on Fly runs a 2 GB Machine.
- No new external service, no paid dependency, no confidential data sent anywhere: everything stays in the CAD
  server and the person's data folder.
- Contracts that must not change: MCP endpoints, OAuth, the device API, the bridge protocol, the feature format,
  every existing tool's name, parameters and results.

## 6. Gaps the drafting engine closes, and gaps it cannot close yet

| Gap | Closed by |
| --- | --- |
| No structured understanding of the model | `drafting/facts.py` (geometry facts in the worker) + `drafting/features.py` + `drafting/understanding.py` |
| No discipline reasoning | `drafting/disciplines.py`, `drafting/reasoning.py` |
| Drafting practice only as free text | `drafting/knowledge.py` + `drafting/knowledge/*.json` (structured, sourced, status) |
| No drawing plan before drawing | `drafting/strategy.py` (a plan object, inspectable, stored) |
| No dimension reasoning or checks | `drafting/dimensioning.py` |
| No drawing checker | `drafting/layout.py`, `drafting/qa.py` |
| No learning from feedback | `drafting/learning.py` (SQLite in the data folder) |

Not closable without add-in work (and a real SOLIDWORKS to test it): new associative dimensions between picked
entities, ordinate and baseline dimension sets, hole tables, weld symbols, GD&T frames, surface-texture symbols,
revision tables, annotation bounding boxes, custom properties of parts, configurations, sheet-metal flat patterns and
cut lists. These are listed as pending in `TECHNICAL_SPECIFICATION.md`, section 9.
