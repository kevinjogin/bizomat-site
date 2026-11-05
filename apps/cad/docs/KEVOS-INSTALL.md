# Installing CAD Automation for SOLIDWORKS and registering a computer

BIZOMAT CAD Automation for SOLIDWORKS was called CADOS for SOLIDWORKS (0.12.0 to 0.12.2) and KEVOS Bridge (up to
0.11); this file keeps its earlier name. Install once on each Windows computer that runs SOLIDWORKS, register the
computer once, and from then on: sign in to Windows, open SOLIDWORKS, and ask your AI app. No command prompt, no
macro, no address or key to paste.

## What you need

- Windows 10 (version 1903 or later) or Windows 11, 64-bit, with .NET Framework 4.8 (built in).
- SOLIDWORKS 2022 or newer, 64-bit (see [KEVOS-VERSIONS.md](KEVOS-VERSIONS.md)).
- An account on your CAD Automation server (`https://cad.bizomat.ai` or `https://cados.kevos.com`, the same server;
  or your own). Your administrator adds you on the Admin page with a password, or sends you an invite link. You
  also need administrator rights on the computer once, for the installation.

## 1. Install

1. Download `CADOS-for-SOLIDWORKS-x64.msi` (the file keeps its earlier name) from your server ("Download for
   SOLIDWORKS") or the release page. Check its SHA-256 against the `.sha256` file next to it if you like.
2. Save your work and close SOLIDWORKS.
3. Double-click the MSI and follow it. Windows asks for administrator approval once.
   If SOLIDWORKS is still open, the installer asks you to close it.

The installer puts the add-in and the BIZOMAT Companion (`KEVOS.Companion.exe`) in `C:\Program Files\KEVOS\Bridge`
(the folder keeps its earlier name), registers the add-in for every SOLIDWORKS version on the computer, and starts
the Companion at every Windows sign-in. It does not touch your CAD files.

IT departments can install silently and set the server address for everyone:

```bash
msiexec /i CADOS-for-SOLIDWORKS-x64.msi /qn GATEWAY_URL=https://cados.kevos.com
```

## 2. Register (pair) the computer

Right after an interactive install the BIZOMAT Companion opens its pairing window. (After a silent install it shows
a notification at the next sign-in; or use Start > BIZOMAT > Pair this computer with CAD Automation.)

1. Check the server address and the computer's name. Enter your email and password (the same ones you sign in to
   CAD Automation with) and click **Pair**: the computer is added at once. Or leave them empty and continue below.
2. Your browser opens CAD Automation. Sign in with the email and password your administrator gave you.
3. Check that the site shows the same code as the Companion (for example `KQ7M-4RTD`), then click
   **Add this computer**.
4. The Companion says **Done**. The tray icon (the BIZOMAT B with a green dot) shows the computer as connected.

What pairing does: the Companion makes a key for this computer in the Windows key store (on the TPM when the
computer has one). The key cannot be exported or copied. The server records only its public half. No password or
token is stored on the computer.

## 3. Use it

1. Open SOLIDWORKS. The add-in loads by itself (Tools > Add-Ins shows **BIZOMAT CAD Automation** with Start Up
   ticked) and connects to the Companion. You see a **BIZOMAT** tab on the CommandManager, a **BIZOMAT** menu and the
   **BIZOMAT CAD Automation** task pane.
2. In your AI app (Claude, ChatGPT or another app that supports MCP connectors), add a custom connector with the
   address shown on your CAD Automation dashboard (it ends in `/mcp`) and sign in once.
3. Ask: "Run the SOLIDWORKS self test, all three stages." Then real work, for example: "In SOLIDWORKS, make a
   60 x 40 x 8 mm mounting plate with four M5 clearance holes."

When the AI asks to delete features, undo, save over a file, replace a drawing or remove a variable, SOLIDWORKS
shows a **BIZOMAT: confirm** window naming the AI app and what it wants to do. Nothing happens unless you click
**Allow once**; it denies by itself after two minutes.

## Several computers

Install and pair each computer the same way; each gets its own identity. The dashboard's SOLIDWORKS page lists them
under **Your computers**: make one the default, or remove one. When more than one is online, the AI app asks which
one (it passes `device="<name>"`); the one with SOLIDWORKS open is chosen by itself when only one has it.

## A new laptop, or Windows reinstalled

Nothing is copied from the old computer, and nothing needs to be.

1. On the dashboard's SOLIDWORKS page, **Remove** the old computer (if it is gone or will not be used). It stops
   working at once.
2. Install CAD Automation for SOLIDWORKS on the new computer and pair it (sections 1 and 2).

If the old computer is still here and you are retiring it, use Start > BIZOMAT > **Remove this computer from CAD
Automation** first: it removes it from the account and deletes its key.

## Lost or stolen computer

Remove it on the dashboard's SOLIDWORKS page. Its key is refused from that moment; AI apps cannot reach it.

## Pause, stop, start with Windows

Right-click the tray icon: **Pause CAD Automation** (commands are refused until you resume; SOLIDWORKS shows it),
**Start with Windows** (per user), **Exit**. The BIZOMAT task pane and status window have **Ask me before
destructive changes** (on by default).

## Update, repair, uninstall

- **Update:** the Companion checks for a newer signed release and asks before installing it (tray > Check for updates).
  Or run the newer MSI. Settings and the registration are kept.
- **Repair:** Settings > Apps > BIZOMAT CAD Automation for SOLIDWORKS > Modify > Repair, or
  `msiexec /fa CADOS-for-SOLIDWORKS-<version>-x64.msi`.
- **Uninstall:** Settings > Apps > BIZOMAT CAD Automation for SOLIDWORKS > Uninstall. Your settings, logs and
  registration stay in your user profile, so a reinstall picks up where you were. To also leave the account, run
  **Remove this computer from CAD Automation** first.

## Without the installer (development and the earlier route)

The earlier per-user route still works: unzip the add-in package, run `OpenSketchSW.exe` > Install for me, and use
the add-in's status window (BIZOMAT > Status: direct link with the address and key from Settings on the dashboard)
or the launcher macro `Documents\OpenSketch\OpenSketch.swb`. Running `KEVOS.Companion.exe` from the same folder adds
the Companion and pairing.
