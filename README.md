# OpenSketch

OpenSketch connects your AI app (Claude, ChatGPT and others) to SOLIDWORKS on your own PC. You describe the
change ("replace this sash with a 6 mm thinner one and add drainage slots") and the AI builds it as native
SOLIDWORKS features in your own files: fully defined sketches, extrudes, cuts, revolves, holes, fillets, patterns,
components and mates.

Before anything reaches SOLIDWORKS, OpenSketch checks it with its own CAD kernel
([build123d](https://github.com/gumyr/build123d) / OpenCascade): every sketch is solved, every feature is built on
SOLIDWORKS' current body, and the add-in compares what SOLIDWORKS made with that prediction.

The browser CAD app OpenSketch used to be is archived on the branch
[`archive/opensketch-app`](https://github.com/yuanzhengyang98/opensketch/tree/archive/opensketch-app).

## How it works

```
Claude / ChatGPT  --MCP-->  OpenSketch server  <--HTTPS long poll--  add-in in SOLIDWORKS (your PC)
```

- The AI app adds one connector address, `https://opensketch-yz.fly.dev/mcp`, and signs in once.
- The add-in on the SOLIDWORKS PC connects out to the server (no open ports) and runs each command in
  SOLIDWORKS.
- SOLIDWORKS is the master copy. You can edit the same file by hand between the AI's steps; it reads the file
  again before it writes.

## Set it up

Everything is on the home page, https://opensketch-yz.fly.dev (sign in first):

1. **Install the add-in.** Download it on the SOLIDWORKS PC (SOLIDWORKS 2022 or newer), unzip it into a folder of
   your own, run `OpenSketchSW.exe` and click Install for me.
2. **Connect SOLIDWORKS.** In SOLIDWORKS: Tools > OpenSketch > Connect to Claude. Paste the address and key from
   the home page. If the menu is not there, run the macro (Tools > Macro > Run >
   `Documents\OpenSketch\OpenSketch.swb`), or click "Connect to the open SOLIDWORKS" in `OpenSketchSW.exe`.
3. **Add the connector.** In Claude or ChatGPT, add a custom connector with the address from the home page and
   sign in. Apps that cannot sign in can use the private address under "Your app cannot sign in?".
4. **Try it.** The first time, ask: "Run the SOLIDWORKS self test, all three stages." It makes test files in
   `Documents\OpenSketch\selftest` and reports every step. If anything is not ok, send the report and the log
   (`%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt`, or Copy log in the add-in's window).

The home page shows whether SOLIDWORKS is connected, and which AI apps are (with Disconnect).

## What the AI can do

`sw_status`, `sw_get_guide`, `sw_create_document`, `sw_open_document`, `sw_save`, `sw_get_document`,
`sw_add_features`, `sw_batch` (all or nothing), `sw_delete_items`, `sw_undo`, `sw_set_parameter`,
`sw_set_equation`, `sw_insert_component`, `sw_add_mate`, `sw_body_topology`, `sw_measure_items`,
`sw_inspect_design`, `sw_preview`, `sw_check_interference`, `sw_find_mate_candidates`, `sw_export`, `sw_import`
(with `request_upload` for files over about 100 KB), `sw_standard_part` (ISO screws, nuts, washers, bearings) and
`sw_selftest`.

The feature format is in [docs/DOCUMENT.md](docs/DOCUMENT.md) (the AI gets it from `sw_get_guide`).

## Accounts

Sign in with email and password, or Google. The first time you open a server that has `OPENSKETCH_PASSWORD` set,
it asks you to create the owner account, with that password as the key that proves you own the server. Each
account has its own SOLIDWORKS key and its own AI app connections. Showcase visitors can use an early access code
(`/access`) instead of signing up.

Google sign-in is on when the server has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (GitHub secrets of the
same names; the deploy workflow stages them), or a client saved earlier on the server. The redirect address to
give Google is `https://<your site>/auth/google/callback`.

## Hosting (Fly.io)

The server runs on Fly.io (`fly.toml`: Sydney, one dedicated CPU core, 2 GB, suspended when idle), deployed by
`.github/workflows/deploy.yml` on every push to main once the tests pass. Secrets in the repository's Actions
settings: `FLY_API_TOKEN`, `OPENSKETCH_PASSWORD`, optionally `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
A supervisor restarts the server if it stops answering. Your own domain: add a certificate in the Fly dashboard,
then a repository variable `PUBLIC_URL` (for example `https://cad.example.com`) and run the deploy once.

## Run it locally

```bash
pip install -r requirements-dev.txt && pip install --no-deps -e .
python -m opensketch --no-browser      # http://127.0.0.1:8000
```

Tests: `pytest -q` (needs node for the sketch solver) and `npm test` (the sketch solver alone). The add-in:
`bash solidworks/build.sh test` (.NET 8 SDK, Linux or Windows).

## Layout

- `opensketch/mcp_server.py`, `sw_tools.py`, `sw_selftest.py`: the MCP server and the SOLIDWORKS tools.
- `opensketch/swbridge.py`: the link the add-in polls.
- `opensketch/sw_page.py`: the home page. `auth.py`, `accounts.py`, `oauth.py`, `mcpauth.py`: sign-in.
- `opensketch/geometry.py`, `features/`, `assembly.py`, `naming.py`, `params.py`, `inspection.py`, `measure.py`,
  `preview.py`, `importer.py`: the kernel that checks features and reads SOLIDWORKS' geometry.
- `opensketch/solver/`: the sketch solver (JavaScript, run with node).
- `solidworks/`: the add-in (C#, .NET Framework 4.8).
