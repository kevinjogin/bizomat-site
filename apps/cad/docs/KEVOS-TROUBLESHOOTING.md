# KEVOS Bridge troubleshooting

Start with the tray icon (right-click > **Status...**) and **Copy diagnostics** (or Start > KEVOS > KEVOS diagnostics).
Logs: `%LOCALAPPDATA%\KEVOS\Bridge\logs` (Companion) and `%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt` (add-in).
Neither holds passwords or keys.

| What you see | Why | What to do |
|---|---|---|
| No KEVOS icon after signing in to Windows | The Companion did not start | Start > KEVOS > KEVOS Companion. Tray > Start with Windows must be ticked. |
| "Not registered: pair this computer" | Not paired yet, or paired again elsewhere | Tray > Pair this computer. |
| "Removed from your CADOS account: pair again" | The computer was removed on the home page | Pair again (it gets a new key). |
| "Offline (...); retrying" | No network to the KEVOS server, a proxy blocking it, or the server down | Check the server address opens in a browser. Behind a company proxy, allow `https://<your KEVOS server>` (the Companion uses the Windows proxy settings). It retries by itself. |
| "Signed request refused (TOKEN_EXPIRED ...)" | The computer's clock is far off | Turn on Windows' automatic time (Settings > Time). |
| "GATEWAY_KEY_CHANGED" | The server's command key changed (restored or replaced data folder) | Pair again. If you did not change the server, ask its administrator first. |
| "connected, SOLIDWORKS closed" | Normal: SOLIDWORKS is not open | Open SOLIDWORKS. AI apps get "SOLIDWORKS is not running on <computer>" meanwhile. |
| "waiting for the CADOS add-in" | SOLIDWORKS runs but the add-in did not connect | Tools > Add-Ins: tick CADOS (Active and Start Up). The Companion also asks SOLIDWORKS to load it after 30 s. Is SOLIDWORKS run as administrator? It must not be. |
| No CADOS tab, menu or task pane in SOLIDWORKS | The add-in is not loaded | As above; then the add-in log. Repair the installation if the log says the DLL was not found. |
| The add-in log says "Refused the pipe's owner" | Something other than the installed KEVOS Companion holds the pipe | Restart Windows. If it stays, check the computer for malware and reinstall KEVOS Bridge. |
| The Companion log says "REFUSED a pipe client" | A program that is not SOLIDWORKS with the installed add-in tried to connect | Usually an old add-in copy (another folder): uninstall the old OpenSketch add-in; the Companion removes old per-user registrations by itself. |
| AI app: "Several computers are connected" | More than one of your computers is online | Tell the AI which one ("on DESK"), or set a default on the home page. |
| AI app: "SOLIDWORKS has a dialog box open" | A modal dialog in SOLIDWORKS | Close it, then ask again. |
| AI app: "A sketch is open for editing" | You are editing a sketch | Exit the sketch. |
| AI app: "The person at this computer declined" | You (or the timeout) said no to a destructive change | Ask again if you meant it, and click Allow once. |
| AI app: "still working after N s" | A long operation | It finishes by itself; the AI can check with sw_command_status. |
| AI app: "CADOS is paused" | Paused from the tray | Tray > Resume CADOS. |
| An update was refused | Its hash, signature or publisher did not match | Nothing was installed. Download the MSI from the release page and check its SHA-256; tell your administrator. |
| "This KEVOS build is not signed, so it does not update itself" | A test build | Install new versions by hand. |
| Installer: "Please close SOLIDWORKS" | Files in use | Save, close SOLIDWORKS, Retry. |

## Resetting a computer completely

1. Start > KEVOS > Remove this computer from KEVOS.
2. Uninstall KEVOS Bridge.
3. Optional: delete `%LOCALAPPDATA%\KEVOS` and `HKEY_CURRENT_USER\Software\KEVOS` for this user.
4. Install and pair again.
