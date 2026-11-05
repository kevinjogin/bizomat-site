# KEVOS Bridge release notes

## 0.11.0 (first KEVOS Bridge release; test build, see the test report)

Install once, register once, then: open SOLIDWORKS and ask your AI app. No command prompt, no macro, no address or
key to paste.

New:
- **KEVOS Companion** (`KEVOS.Companion.exe`): a tray app that starts with Windows, registers the computer (pairing
  with a short code on the KEVOS website), keeps the signed link to the KEVOS server, reconnects by itself, detects
  SOLIDWORKS and the add-in, can pause, checks for verified updates, and writes diagnostics.
- **Registered computers** on the server: several per account, each with its own key; choose with `device=`, a
  default, or automatically when only one has SOLIDWORKS open. Home page section **Your computers**.
- **Protocol 2** (`docs/BRIDGE-PROTOCOL.md`): signed commands and device requests, acknowledgments, progress,
  results with chunked files, cancellation, expiry, at-most-once execution, heartbeats.
- **Add-in 0.11.0**: KEVOS menu, toolbar and CommandManager tab; status of the Companion and computer; connects to the
  Companion by itself (starting it when needed); document events; refuses to run inside an open dialog; asks the
  person before destructive changes; long batches, feature lists and drawing edits can be cancelled between steps.
- **Tools**: `sw_list_devices`, `sw_command_status`, `sw_cancel_command`; every SOLIDWORKS tool takes `device`;
  errors carry `error_code`.
- **Installer**: one signed MSI (WiX) for all users, upgrade, repair and uninstall that keep settings and CAD files;
  CI builds it on Windows.

Kept: every existing tool, its arguments and results; the direct add-in link (address and key) and the launcher
macro as fallbacks; the add-in's COM ids, so existing registrations keep working.

Changed: the add-in's title in Tools > Add-Ins is now KEVOS; its menu is Tools > KEVOS.

Known limits: not yet run in a real SOLIDWORKS or on Windows by the build (see `docs/KEVOS-TEST-REPORT.md`);
ChatGPT and Grok connectors not yet tried; MCP progress notifications are not sent (progress is in
`sw_command_status`); SOLIDWORKS run as administrator is not supported.
