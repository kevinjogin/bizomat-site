# CADOS for SOLIDWORKS release notes (KEVOS Bridge up to 0.11)

## 0.12.1 (CADOS for SOLIDWORKS; test build)

- The task pane, toolbar icons and links use the KEVOS colours of kevos.com (accent #c2410c, ink #1c1b19, paper
  #fbfaf7). No change to commands or the link.

## 0.12.0 (CADOS for SOLIDWORKS; test build, see the test report)

- **CADOS by KEVOS.** The add-in is listed in Tools > Add-Ins as **CADOS**; its CommandManager tab, toolbar and menu
  are **CADOS** (the old KEVOS tab is removed when found). The installer is **CADOS for SOLIDWORKS**
  (`CADOS-for-SOLIDWORKS-<version>-x64.msi`, and `CADOS-for-SOLIDWORKS-x64.msi` on the latest build); it upgrades
  KEVOS Bridge 0.11 in place (same UpgradeCode), keeping settings and pairing.
- **CADOS task pane** in SOLIDWORKS: connection state, Connect / Disconnect, prompts to copy into your AI assistant,
  the confirmation setting, live activity, and links to the dashboard, documentation, troubleshooting, the Companion
  and the log.
- The confirmation window is **CADOS: confirm**. Messages from the add-in and the Companion name CADOS.
- The Companion's pairing window suggests `https://cados.kevos.com` when no address was set.
- Website: **Download CADOS for SOLIDWORKS** (`/download/solidworks`), the installation guide, system requirements and
  supported SOLIDWORKS versions.

Kept: COM ids and ProgIDs, the per-user installer, the direct link, the launcher macro (fallback only), every tool.

Known limits: not yet run in a real SOLIDWORKS (test report section 4); the MSI is unsigned until a signing service
is connected.


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
