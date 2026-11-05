# CAD Automation for SOLIDWORKS troubleshooting

(Called CADOS for SOLIDWORKS in 0.12.0 to 0.12.2 and KEVOS Bridge up to 0.11; this file keeps its earlier name.)

Start with the tray icon (right-click > **Status...**) and **Copy diagnostics** (or Start > BIZOMAT > CAD Automation
diagnostics). Logs: `%LOCALAPPDATA%\KEVOS\Bridge\logs` (Companion) and `%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt`
(add-in); the folders keep their earlier names. Neither holds passwords or keys.

| What you see | Why | What to do |
|---|---|---|
| No BIZOMAT icon after signing in to Windows | The Companion did not start | Start > BIZOMAT > BIZOMAT Companion. Tray > Start with Windows must be ticked. |
| "Not registered: pair this computer" | Not paired yet, or paired again elsewhere | Tray > Pair this computer. |
| "Removed from your CAD Automation account: pair again" | The computer was removed on the dashboard | Pair again (it gets a new key). |
| "Offline (...); retrying" | No network to the server, a proxy blocking it, or the server down | Check the server address opens in a browser. Behind a company proxy, allow `https://<your CAD Automation server>` (the Companion uses the Windows proxy settings). It retries by itself. |
| "Signed request refused (TOKEN_EXPIRED ...)" | The computer's clock is far off | Turn on Windows' automatic time (Settings > Time). |
| "GATEWAY_KEY_CHANGED" | The server's command key changed (restored or replaced data folder) | Pair again. If you did not change the server, ask its administrator first. |
| "connected, SOLIDWORKS closed" | Normal: SOLIDWORKS is not open | Open SOLIDWORKS. AI apps get "SOLIDWORKS is not running on <computer>" meanwhile. |
| "waiting for the add-in" | SOLIDWORKS runs but the add-in did not connect | Tools > Add-Ins: tick BIZOMAT CAD Automation (Active and Start Up). The Companion also asks SOLIDWORKS to load it after 30 s. Is SOLIDWORKS run as administrator? It must not be. |
| No BIZOMAT tab, menu or task pane in SOLIDWORKS | The add-in is not loaded | As above; then the add-in log. Repair the installation if the log says the DLL was not found. |
| The add-in log says "Refused the pipe's owner" | Something other than the installed BIZOMAT Companion holds the pipe | Restart Windows. If it stays, check the computer for malware and reinstall CAD Automation for SOLIDWORKS. |
| The Companion log says "REFUSED a pipe client" | A program that is not SOLIDWORKS with the installed add-in tried to connect | Usually an old add-in copy (another folder): uninstall the old add-in; the Companion removes old per-user registrations by itself. |
| AI app: "Several computers are connected" | More than one of your computers is online | Tell the AI which one ("on DESK"), or set a default on the dashboard. |
| AI app: "SOLIDWORKS has a dialog box open" | A modal dialog in SOLIDWORKS | Close it, then ask again. |
| AI app: "A sketch is open for editing" | You are editing a sketch | Exit the sketch. |
| AI app: "The person at this computer declined" | You (or the timeout) said no to a destructive change | Ask again if you meant it, and click Allow once. |
| AI app: "still working after N s" | A long operation | It finishes by itself; the AI can check with sw_command_status. |
| AI app: "CAD Automation is paused" | Paused from the tray | Tray > Resume CAD Automation. |
| An update was refused | Its hash, signature or publisher did not match | Nothing was installed. Download the MSI from the release page and check its SHA-256; tell your administrator. |
| "This build is not signed, so it does not update itself" | A test build | Install new versions by hand. |
| Installer: "Please close SOLIDWORKS" | Files in use | Save, close SOLIDWORKS, Retry. |

## Resetting a computer completely

1. Start > BIZOMAT > Remove this computer from CAD Automation.
2. Uninstall BIZOMAT CAD Automation for SOLIDWORKS (Settings > Apps).
3. Optional: delete `%LOCALAPPDATA%\KEVOS` and `HKEY_CURRENT_USER\Software\KEVOS` for this user (the folder and key
   keep their earlier names).
4. Install and pair again.
