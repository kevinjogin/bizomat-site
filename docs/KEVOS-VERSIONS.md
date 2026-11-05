# Supported versions

| Component | Supported | Status |
|---|---|---|
| SOLIDWORKS 2022 (revision 30) | Yes | Built against its API (interop 30.5.1, types embedded). Not yet run in a real SOLIDWORKS by KEVOS (see below). |
| SOLIDWORKS 2023, 2024, 2025, 2026 | Expected | The same add-in binary: SOLIDWORKS keeps its COM API compatible upwards, and every call used exists in 2022. Not yet run. |
| SOLIDWORKS 2021 and older | No | The interop and several calls are 2022's. |
| SOLIDWORKS run as administrator | No | It runs at another integrity level: the Companion's pipe and the add-in cannot meet. Run SOLIDWORKS normally. |
| Several SOLIDWORKS versions on one computer | Yes | One add-in registration serves every installed version. Several running at once: each connects; a command goes to the one with its document open, else the one used last. |
| Windows 10 1903 and later, Windows 11, 64-bit | Yes | .NET Framework 4.8 is built in. |
| Windows Server | Not tested | |
| 32-bit Windows or SOLIDWORKS | No | |
| KEVOS gateway (this server) | Python 3.12 | Fly.io, Docker, or a Windows or Linux server. |
| AI apps | Any MCP client with remote (Streamable HTTP) connectors and OAuth, or with a fixed URL (private address) | Tested with the MCP Python SDK client and Claude Desktop's `mcp-remote`. ChatGPT and Grok connectors: not tested yet. |

## Real SOLIDWORKS: what is and is not verified

Everything between the AI app and the add-in's command dispatcher is tested end to end (see the test report). The
add-in's SOLIDWORKS calls themselves (features, sketches, drawings, the new document events, the CommandManager tab,
the confirmation window, the modal-dialog check) compile against the SOLIDWORKS 2022 API but have not run in a real
SOLIDWORKS in this release. KEVOS Bridge is not production-ready until the self test (all three stages) and the
manual checks in the test report pass on each SOLIDWORKS version you use.

## Adding a SOLIDWORKS version

The add-in reports its capabilities (ops, feature types, mate types, drawing actions, export formats) when it
connects, and the gateway checks them. A newer SOLIDWORKS needs nothing as long as the 2022 calls keep working. When
a call is replaced, add the new call behind a check of `ISldWorks.RevisionNumber()` in the add-in, keep the 2022 path,
and add the version's row here after its self test passes.
