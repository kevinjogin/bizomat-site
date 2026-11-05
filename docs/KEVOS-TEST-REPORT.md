# KEVOS Bridge test report (0.11.0)

Date: 5 Nov 2026. Branch `claude/sharp-bardeen-m2yi9w`.

## Verdict

**Not production-ready yet.** Everything from the AI app to the add-in's command dispatcher is built and tested,
including the real C# Companion and add-in link against the real server. The MSI builds on Windows in CI (unsigned).
Still untested: a real SOLIDWORKS, and the installed product on Windows (installing the MSI, the tray app, the pipe's
Windows security, the CNG key, Authenticode checks). Run the checklist
in section 4 on a Windows computer with SOLIDWORKS 2022 before relying on it.

## 1. Environment

Ubuntu 24.04 container: Python 3.12 with the hash-pinned `requirements-dev.txt`, Node 22, .NET SDK 8.0.133 (Ubuntu
package; it builds the .NET Framework 4.8 add-in and Companion and runs the .NET 8 tests). No Windows, no SOLIDWORKS,
no access to the Cloudflare account. The existing suites were run first as a baseline: 205 pytest passed, 17 .NET
passed, 9 npm passed.

## 2. Automated results (after the change)

| Suite | Result |
|---|---|
| `pytest -m "not slow"` | 222 passed (205 before; 17 new in `tests/test_devicebridge.py`; the tool-list test updated to 31 tools) |
| `pytest -m slow` | 2 passed, including `tests/test_bridge_e2e.py` (C# Companion and add-in link against the real server) |
| `bash solidworks/build.sh test` | add-in, Companion and legacy installer build for .NET Framework 4.8; 29 .NET tests passed (17 before) |
| `npm test` | 9 passed |
| MSI on Windows (GitHub Actions `windows-latest`, `installer` job, run 41967247367 in jogkev-creator/CADOS) | built: `KEVOS-Bridge-0.11.0-x64-UNSIGNED.msi`, 1,171,456 bytes, SHA-256 `a1dd6752d93e009237d7cd77732d7c9d1a79a4dc19eaba2afa75f80a982c1f9d`; the 29 .NET tests also passed on Windows (real Windows named pipes) |
| Home page and pairing page in Chromium | 1280 x 900 and 390 x 844: no horizontal scroll; computers listed; pairing form usable |

## 3. The requested scenarios

| # | Scenario | Status | How |
|---|---|---|---|
| 1 | Install on a fresh Windows computer | Not tested | The MSI is built (CI artifact `KEVOS-Bridge-MSI`); installing it needs a Windows computer. |
| 2 | Sign in to Windows | Not tested | |
| 3 | Companion starts automatically | Not tested on Windows | HKLM Run from the MSI, HKCU Run for unpackaged copies; per-user opt-out logic is in place. |
| 4 | Open SOLIDWORKS | Not tested | |
| 5 | Add-in loads automatically | Not tested | HKLM add-in entry + per-user AddInsStartup; fallback LoadAddIn from the Companion after 30 s. |
| 6 | Automatic connection to the cloud | Tested (simulated) | The real C# Companion engine pairs, says hello, long-polls and reconnects against the real server (e2e test). |
| 7 | Connect an MCP client | Tested | MCP over HTTP (private address) in every device test; OAuth paths are the existing, tested ones. ChatGPT and Grok themselves: not tested. |
| 8 | Send a SOLIDWORKS command | Tested (simulated) | All 28 SOLIDWORKS tools through a registered computer (Python stand-in Companion): `test_every_sw_tool_runs_through_a_registered_computer`. The three self-test stages through one, against SimSW. Through the real C# Companion and pipe: status, topology, export, import, features, delete, preview, batch. |
| 9 | Runs without a macro | Tested (simulated) | No command path uses a macro; the macro is only a fallback starter. |
| 10 | Result returned to the MCP client | Tested | Every scenario above checks the result, including files up (chunked) and down (blobs, hash-checked). |
| 11 | Close and reopen SOLIDWORKS | Partly | SOLIDWORKS going away mid-command fails the command as `RESULT_LOST` (`SolidWorksClosingMidCommandFailsItAsLost`); reconnect of the add-in link is covered by the pipe reconnect logic. Real SOLIDWORKS: not tested. |
| 12 | Disconnect and reconnect the internet | Partly | Backoff, retry and outbox are tested through gateway restarts and session replacement; Windows network-change events are wired but not run. |
| 13 | Restart Windows | Partly | Companion restart with its saved identity reconnects without pairing (e2e test). |
| 14 | Several registered computers | Tested | Ambiguity, `device=`, default computer, the one with SOLIDWORKS open chosen by itself, offline computer, removed computer. |
| 15 | Unauthorized device access | Tested | Unknown device, removed device, another key signing for a device, Bearer tokens instead of proofs, pairing from the network on an open server, commands for another computer, forged commands. |
| 16 | Expired authentication | Tested | Old device proof (clock window), expired commands, expired pairing codes, denied codes. |
| 17 | Interrupted commands | Tested | Never acknowledged (withdrawn, cancel sent), cancelled while queued, cancelled while running (batch stops), Companion restart during a command. |
| 18 | Large operations and timeouts | Tested (simulated) | 2.5 MiB result in 1 MiB chunks; `STILL_RUNNING` with the late result kept; delivery timeouts. Large real CAD models: not tested. |
| 19 | Recovery after a crash | Partly | Unhandled exceptions on background threads no longer end the process (found and fixed by these tests); the Companion restarts itself after a crash (not run on Windows); the gateway marks unfinished commands `unknown` after a restart (tested). |
| 20 | Install on a replacement computer | Not tested on Windows | Pairing makes a new key per computer; removing the old one cuts it off (tested). |

## 4. Before production: manual checklist on Windows with SOLIDWORKS 2022

1. Install the CI-built MSI on a clean Windows 11 VM with SOLIDWORKS 2022. Confirm the Companion starts and opens
   pairing; pair; sign out and in again: the Companion starts quietly.
2. Open SOLIDWORKS: Tools > Add-Ins shows KEVOS (Active, Start Up); the KEVOS tab and menu appear; the Companion's
   status shows SOLIDWORKS with the add-in.
3. From Claude (connector to the KEVOS server): run the self test, all three stages; then a part, an assembly, a
   drawing and its PDF.
4. Ask the AI to delete a feature: the confirm window names the app; Deny, then Allow once. Leave it two minutes: it
   denies.
5. Open a dialog in SOLIDWORKS and send a command: `SW_BUSY_DIALOG`. Edit a sketch: `USER_EDITING`.
6. Pull the network for two minutes; restore: reconnects by itself. Sleep and wake the PC. Restart Windows.
7. Kill SOLIDWORKS during a long batch: the AI gets `RESULT_LOST`; reopen: works.
8. Pair a second computer; check `device=` and the default.
9. Run a non-SOLIDWORKS program that connects to `\\.\pipe\KEVOS.Bridge.<SID>`: refused and logged.
10. Upgrade to a newer MSI with SOLIDWORKS open (asked to close), repair, uninstall: settings and pairing kept, CAD
    files untouched.
11. Signed build: publish `bridge-release.json`, check the update prompt and that an altered MSI is refused.

## 5. Security tests (automated)

Forged command signature; command typed as a cancel; command for another computer; expired command; replayed command
(run once, second answered `duplicate`); replayed device request (`REPLAY_DETECTED`); altered body (hash mismatch);
proof for another path; stale clock (`TOKEN_EXPIRED`); another key signing for a device; Bearer token instead of a
proof; unknown and removed devices; pairing an already-registered key; denied pairing code; pairing from the network
on a server without sign-in; credentials in command parameters (key names, Bearer tokens, `oss_` keys, the person's
private address); unknown op; unverified pipe client turned away; local file paths never leave the computer; device
proof verifiable with the device's public key and bound to the body; update manifest signed and refused to anyone but
a registered computer.

## 6. Tool migration

All 28 existing SOLIDWORKS tools keep their names and arguments (plus an optional `device`) and run through the new
path unchanged; three tools were added (`sw_list_devices`, `sw_command_status`, `sw_cancel_command`). Not migrated:
the out-of-process "Connect to the open SOLIDWORKS" mode of `OpenSketchSW.exe` (`--attach`) uses only the direct link,
because the Companion accepts only a SOLIDWORKS process on the pipe; it stays as a legacy fallback. The macro and the
direct link stay as fallbacks and are untouched.

## 7. Defects found and fixed during testing

- Cancelling an HTTP request on shutdown raised an exception outside the threads' filters, which ended the process;
  in the add-in this would have closed SOLIDWORKS. Every background thread and callback in the Companion engine and
  the add-in link now catches, logs and (when not stopping) restarts.
- Tools replaced in tests with one-argument status functions broke when a device argument was always passed; it is now
  passed only when given.
