# CADOS by KEVOS

**Turn engineering intent into CAD.** CADOS connects your AI assistant (Claude, ChatGPT and other
[MCP](https://modelcontextprotocol.io) clients) to SOLIDWORKS on your own computer. Describe a part or a change, and
the assistant builds it as native SOLIDWORKS features in your own files: fully defined sketches, extrudes, cuts,
revolves, holes, fillets, patterns, components, mates and drawings.

CADOS is a product from [KEVOS](https://kevos.com/). Website: https://bizomat.ai/cad (formerly https://cados.kevos.com). Code names inside the
repository (the `opensketch` Python package, `OPENSKETCH_*` settings, the add-in's file names) are kept for
compatibility.

> **Status: early.** The server side is tested end to end against a stand-in for SOLIDWORKS; the add-in is
> compiled against the SOLIDWORKS 2022 API and its link is tested against a real server, but it has not yet been
> run against many real SOLIDWORKS installs. Run the self test (below) on a new PC first, and please report
> what you find.

## How it works

```
AI app (Claude, ChatGPT)  --MCP-->  CADOS gateway  <--outbound HTTPS--  KEVOS Companion + add-in in SOLIDWORKS (your PC)
```

- The AI app adds one connector address (`https://<server>/mcp`) and signs in once (OAuth).
- The add-in on the SOLIDWORKS PC connects out to the server, so the PC needs no open ports, and runs each
  command in SOLIDWORKS through its API.
- Before anything reaches SOLIDWORKS, the server checks it with its own CAD kernel
  ([build123d](https://github.com/gumyr/build123d) / OpenCascade): every sketch is solved, every feature is built
  on SOLIDWORKS' current body, and the add-in compares what SOLIDWORKS made with that prediction (and remakes a
  feature the other way round if SOLIDWORKS read a direction differently).
- SOLIDWORKS is the master copy. You can edit the same file by hand between the AI's steps; the AI reads the
  file again before it writes.

## KEVOS Bridge: install once per computer

For everyday use on Windows: install **KEVOS Bridge** (one MSI) on each SOLIDWORKS computer and pair it once with
your account. The KEVOS Companion starts with Windows and connects by itself; the add-in loads with SOLIDWORKS. No
command prompt, no macro, no address or key to paste. Several computers per account; destructive changes are
confirmed in SOLIDWORKS. See [docs/KEVOS-INSTALL.md](docs/KEVOS-INSTALL.md), and for the server side
[docs/KEVOS-CLOUDFLARE.md](docs/KEVOS-CLOUDFLARE.md), [docs/KEVOS-SECURITY.md](docs/KEVOS-SECURITY.md),
[docs/BRIDGE-PROTOCOL.md](docs/BRIDGE-PROTOCOL.md). Status: built and tested up to the add-in's command dispatcher;
not yet run in a real SOLIDWORKS ([test report](docs/KEVOS-TEST-REPORT.md)).

## What the AI can do

| Tool | What it does |
|---|---|
| `sw_status`, `sw_get_guide` | Is SOLIDWORKS connected, which files are open; the workflow and feature format |
| `sw_create_document`, `sw_open_document`, `sw_save`, `sw_get_document` | Make, open, save and read parts and assemblies |
| `sw_add_features`, `sw_batch` | Build features (a batch is all or nothing) |
| `sw_delete_items`, `sw_undo` | Remove features, components or mates; undo |
| `sw_set_parameter`, `sw_set_equation` | SOLIDWORKS global variables and equations |
| `sw_insert_component`, `sw_add_mate`, `sw_find_mate_candidates` | Assemblies |
| `sw_body_topology`, `sw_measure_items`, `sw_inspect_design`, `sw_preview`, `sw_check_interference` | Look, measure and check |
| `sw_create_drawing` | A SOLIDWORKS drawing of a part or assembly: standard views (third or first angle) and an isometric, a scale that fits, the model's dimensions, title block fields |
| `sw_get_drawing`, `sw_edit_drawing` | Read a drawing, and change it step by step: model, projected, section and detail views, move, scale and display style, model dimensions, centre marks, notes, title block, sheet, parts list with balloons |
| `sw_export`, `sw_import`, `request_upload` | STEP, STL, Parasolid, IGES, SOLIDWORKS files, PDF out; drawings as PDF, DWG or DXF; files in |
| `sw_standard_part` | ISO screws, nuts, washers and ball bearings, made to size |
| `sw_selftest` | Checks a new install, step by step |
| `sw_list_devices`, `sw_command_status`, `sw_cancel_command` | Registered computers (KEVOS); a long command's state and late result; cancel |

The feature format is in [docs/DOCUMENT.md](docs/DOCUMENT.md).

## Use it

1. **Sign in** at https://bizomat.ai/cad (or your own server, see below) and open the dashboard.
2. **Install BIZOMAT CAD Automation** on the SOLIDWORKS computer (SOLIDWORKS 2022 or newer, Windows 64-bit): the Windows
   installer (`BIZOMAT-CAD-Automation-x64.msi`, "Download for SOLIDWORKS" on the website) adds the add-in and the BIZOMAT Companion; see
   [docs/KEVOS-INSTALL.md](docs/KEVOS-INSTALL.md). Without the installer: download the add-in package from the
   dashboard, unzip it, run `OpenSketchSW.exe` and click Install for me (per Windows user).
3. **Pair the computer** when the KEVOS Companion asks, then open SOLIDWORKS: the CADOS tab and task pane show the link. (Direct
   link without the Companion: CADOS > Status in SOLIDWORKS, then paste the address and add-in key from the
   dashboard; or run the macro `Documents\OpenSketch\OpenSketch.swb`.)
4. **Add the connector** in your AI app: a custom connector with the address from the dashboard. Apps that cannot
   sign in can use the private address shown under "Assistant cannot sign in?".
5. **Run the self test** the first time: ask "Run the SOLIDWORKS self test, all three stages." It builds test
   files in `Documents\OpenSketch\selftest` and reports every step as ok, check or failed. The add-in's log is
   `%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt`.

Then ask for real work, for example: "In SOLIDWORKS, make a 60 x 40 x 8 mm mounting plate with four M5
clearance holes."

## Run your own server

### Locally

```bash
pip install -r requirements-dev.txt && pip install --no-deps -e .
python -m opensketch --no-browser      # http://127.0.0.1:8000
```

Needs Python 3.12 and Node.js 20 or newer (the sketch solver runs in node). There is no server password. Until the
first account exists, the server is open only to this machine itself; any other request (another address, a proxy
or a tunnel, or any request once `OPENSKETCH_PUBLIC_URL` is set) gets only the setup page, where the first person to
create an account becomes the owner. Create it right after you start a public server.
An AI app needs a public https address to reach the server, so for real use, host it.

### Docker

```bash
docker build -t opensketch .
docker run -p 8080:8080 -e OPENSKETCH_PUBLIC_URL=https://cados.example.com -v opensketch-data:/data opensketch
```

The image also builds the add-in, so the home page can offer it for download.

### Fly.io

`fly.toml` and `.github/workflows/deploy.yml` deploy it on every push to `main` once the tests pass. Set the
repository secret `FLY_API_TOKEN` (optionally `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Sign in with Google), and the repository variable `FLY_APP` to your app's name. For your
own domain, add a certificate in the Fly dashboard and set the variable `PUBLIC_URL`.

### Settings

| Variable | Meaning |
|---|---|
| `OPENSKETCH_DATA` | Data folder: accounts, connections, keys, short-lived uploads (default `~/opensketch-data`) |
| `OPENSKETCH_PUBLIC_URL` | The server's public address. Set it on any public server: until the owner account exists, only the setup page answers |
| `OPENSKETCH_REQUIRE_SIGNIN` | Any value: treat the server as public (setup page first) even without a public address |
| `OPENSKETCH_ACCESS_CODE` | Optional early access code: people who type it skip sign-up |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Sign in with Google (redirect `https://<server>/auth/google/callback`) |
| `OPENSKETCH_KEY_SECRET` | Optional key for the secrets stored on the server (else a random one in the data folder) |

## Develop

```bash
pytest -q          # Python tests (needs node)
npm test           # the sketch solver
bash solidworks/build.sh test   # the add-in (.NET 8 SDK, on Linux or Windows)
```

Layout:

- `opensketch/mcp_server.py`, `sw_tools.py`, `sw_selftest.py`: the MCP server and the SOLIDWORKS tools.
- `opensketch/swbridge.py`: the link the add-in polls.
- `opensketch/sw_page.py`: the home page. `auth.py`, `accounts.py`, `oauth.py`, `mcpauth.py`: sign-in.
- `opensketch/geometry.py`, `features/`, `assembly.py`, `naming.py`, `params.py`, `inspection.py`, `measure.py`,
  `preview.py`, `importer.py`: the kernel that checks features and reads SOLIDWORKS' geometry.
- `opensketch/solver/`: the sketch solver (JavaScript).
- `solidworks/`: the add-in (C#, .NET Framework 4.8).

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to send changes, and [SECURITY.md](SECURITY.md) for reporting a
security problem.

## License

[GNU Affero General Public License v3.0](LICENSE). You can use, change and share CADOS. If you run a changed
version as a service for others, you must offer them its source code.

SOLIDWORKS is a trademark of Dassault Systemes. CADOS and KEVOS are not affiliated with or endorsed by Dassault Systemes.
