# OpenSketch on one Windows PC

The OpenSketch server runs on the same Windows PC as SOLIDWORKS. SOLIDWORKS connects to it at
`http://127.0.0.1:8000`. AI apps (Claude, ChatGPT) reach it through a secure tunnel.

```
AI app  --https-->  tunnel  -->  OpenSketch server (this PC, port 8000)  <--  SOLIDWORKS add-in (this PC)
```

You need SOLIDWORKS 2022 or newer, 64-bit Windows 10 or 11, and about 2 GB of free disk space.

## 1. Install the tools (once)

Open PowerShell and run:

```powershell
winget install Git.Git
winget install Python.Python.3.12
winget install OpenJS.NodeJS.LTS
```

Close PowerShell and open a new window, so it finds the new programs.

## 2. Get the code (once)

This repository is private, so Git asks you to sign in to GitHub the first time.

```powershell
cd $HOME\Documents
git clone https://github.com/jogkev-creator/CADOS.git
cd CADOS
```

## 3. Set it up (once, and after each `git pull`)

```powershell
powershell -ExecutionPolicy Bypass -File windows\setup.ps1
```

This creates `.venv` in the folder and installs the pinned Python packages.

## 4. Get the SOLIDWORKS add-in (and update it)

GitHub builds it on every change and keeps the newest one on one page:

1. Close SOLIDWORKS. In Task Manager, end any `SLDWORKS.exe` that is still running.
2. Open the repository on github.com (signed in: it is private), then **Releases > OpenSketch for SOLIDWORKS
   (latest)** (`https://github.com/jogkev-creator/CADOS/releases/tag/addin-latest`), and download
   **OpenSketch-SOLIDWORKS.zip**. The release notes show the add-in version. A running server also gives its own
   copy, signed in, at `<server>/api/sw/download`.
3. Unzip it into `Documents` so the files land in `Documents\OpenSketch-SOLIDWORKS`. Choose **Replace** for every file.
   Always use the same folder.
4. Run `OpenSketchSW.exe` from that folder and click **Install for me**. If SmartScreen warns, click **More info**, then
   **Run anyway**: the program is not signed.
5. Reopen SOLIDWORKS and connect.

Or let a script do steps 1 and 3 to 5 and prove the result: download the zip into Downloads, then run
`powershell -ExecutionPolicy Bypass -File windows\update-addin.ps1`. It closes SOLIDWORKS (after asking), checks the
zip is 0.9.0 or newer, installs it into `%LOCALAPPDATA%\OpenSketch\AddIn` (always the same folder, not on OneDrive),
registers it and prints the add-in Windows will load.

To check which add-in SOLIDWORKS loaded, ask Claude for the SOLIDWORKS status. It shows the add-in `version` and its
`path`. If it says `update_needed`, the old add-in is still the one loaded: repeat the steps above.

Run `windows\setup.ps1` again afterwards and it copies the zip from Downloads, so the home page offers it too.

## 5. Start the server

```powershell
powershell -ExecutionPolicy Bypass -File windows\start.ps1
```

It asks one thing:

- **Public https address**: press Enter for now. Fill it in after step 6.

The home page opens at `http://127.0.0.1:8000`. The first time, create the owner account (your name, email and a
password). There is no server password. Until the owner account exists, nothing answers through a tunnel except
the setup page.
The home page then shows your **SOLIDWORKS key** and the **connector address**.

Keep the window open while you work. Stop the server with Ctrl+C.

## 6. Connect SOLIDWORKS with the macro

1. Start SOLIDWORKS.
2. Go to **Tools > Macro > Run** and open `Documents\OpenSketch\OpenSketch.swb`. Step 4 put it there.
3. The OpenSketch window asks for two things:
   - **OpenSketch address**: `http://127.0.0.1:8000` (already filled in).
   - **SOLIDWORKS key**: copy it from the home page and paste it here.
4. Click **Connect**. Tick **Connect when SOLIDWORKS starts** to skip this next time.

To start it with one click, add a toolbar button: **Tools > Customize > Commands > Macro**, drag the
**New Macro Button** onto a toolbar and choose `OpenSketch.swb`.

The key is saved for your Windows user in `HKEY_CURRENT_USER\Software\OpenSketch`. Treat it like a password.
**New key** on the home page replaces it.

## 7. Connect Claude Desktop on this PC (no tunnel)

With the server running, run:

```powershell
powershell -ExecutionPolicy Bypass -File windows\connect-claude.ps1
```

It asks for the private address from the home page (under "Your app cannot sign in?"). It adds OpenSketch to
Claude Desktop's settings (`%APPDATA%\Claude\claude_desktop_config.json`, with a backup) and restarts Claude Desktop.
The private address works like a password: keep it to yourself.

## 7b. Connect claude.ai or ChatGPT (needs a public https address)

`http://127.0.0.1:8000/mcp` does not work as a connector: these apps connect from the internet, so they need an
https address that reaches your PC.

AI apps reach the server over the internet, so it needs an https address. Cloudflare Tunnel provides one without
opening any port on your PC.

- **Quick test**: the address changes each time you start it.

  ```powershell
  winget install Cloudflare.cloudflared
  cloudflared tunnel --url http://127.0.0.1:8000
  ```

  Copy the `https://....trycloudflare.com` address it prints. Restart `windows\start.ps1` and give that address as
  the public address.
- **Fixed address**: in the Cloudflare dashboard, use **Zero Trust > Networks > Tunnels** and create a tunnel to
  `http://127.0.0.1:8000` on a name of your own domain, for example `opensketch.<your-domain>`. Use that address in
  `start.ps1`.

Then add a custom connector in your AI app with the address `https://<public address>/mcp`, and sign in when asked.

## 8. First run

Ask the AI: "Run the SOLIDWORKS self test, all three stages." It builds test files in
`Documents\OpenSketch\selftest` and reports every step.

If something fails, you can find the add-in log at `%LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt`. The server
prints its log in the PowerShell window.

## Good to know

- **Accounts**: the server keeps its accounts and keys in `%USERPROFILE%\opensketch-data`. Back that folder up.
- **Anyone with the address**: when the tunnel is on, anyone who has the public address sees the sign-in page.
  Each person's own password, and the keys, protect it. Stop the tunnel when you are not using the AI app.
- **Licence**: OpenSketch is AGPL-3.0. A private copy for your own use is fine. If you offer it to other people
  over a network, the AGPL requires you to offer them its source code.
