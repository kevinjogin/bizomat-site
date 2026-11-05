KEVOS Bridge for SOLIDWORKS
===========================

AI apps (Claude, ChatGPT and other MCP apps) build native SOLIDWORKS parts, assemblies and drawings on this
computer: sketches with relations and dimensions, extrudes, revolves, fillets, patterns, components, mates,
drawings, in your own files.

Needs SOLIDWORKS 2022 or newer, 64-bit Windows 10 (1903+) or 11, .NET Framework 4.8 (built in).


The normal way: the installer
-----------------------------
Install KEVOS-Bridge-<version>-x64.msi once (it asks for administrator approval once). It installs
this add-in and the KEVOS Companion, makes SOLIDWORKS load the add-in at start-up, and starts the
Companion at every Windows sign-in. The Companion then opens its pairing window: sign in on your
KEVOS website and confirm the code it shows. From then on: open SOLIDWORKS and ask your AI app.
No command prompt, no macro, no address or key to paste. See docs/KEVOS-INSTALL.md.


Without the installer (this folder)
-----------------------------------
1. Unzip this folder somewhere of your own and keep the files together.
2. Run OpenSketchSW.exe and click "Install for me" (no admin rights).
   (If Windows SmartScreen asks: More info > Run anyway, for an unsigned test build only.)
3. Run KEVOS.Companion.exe and pair this computer (it starts with Windows from then on).
4. Restart SOLIDWORKS. If the KEVOS menu is not there, the Companion asks SOLIDWORKS to load the
   add-in by itself after 30 s; or run the macro Tools > Macro > Run > Documents\OpenSketch\OpenSketch.swb.
   The add-in's KEVOS window (Tools > KEVOS > KEVOS status) also takes the older direct link: the
   address and key from the OpenSketch home page.


Safety
------
Before deleting, undoing, Save As over a file, replacing a drawing or removing a variable, SOLIDWORKS
shows "KEVOS: confirm". Nothing happens unless you click Allow once. Tray icon > Pause KEVOS stops
all commands until you resume.


If something goes wrong
-----------------------
Logs: %LOCALAPPDATA%\KEVOS\Bridge\logs (Companion) and %LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt
(add-in). Tray icon > Copy diagnostics, and send that with the self-test report
("Run the SOLIDWORKS self test, all three stages").

KEVOS Bridge is free software under the GNU AGPL v3.0 (LICENSE.txt); source in SOURCE.txt.
