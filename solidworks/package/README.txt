OpenSketch for SOLIDWORKS
=========================

Claude builds native SOLIDWORKS parts and assemblies on this PC: sketches with relations and
dimensions, extrudes, revolves, fillets, patterns, components and mates, in your own files.
It works through OpenSketch: your AI app (Claude, ChatGPT...) with the OpenSketch for
SOLIDWORKS connector sends the work to the OpenSketch server, and this add-in fetches it
from there. The PC only makes outgoing HTTPS connections, so it needs no open ports.

Needs SOLIDWORKS 2022 or newer, 64-bit Windows, .NET Framework 4.8 (part of Windows 10/11).


Install (once, no admin rights)
-------------------------------
1. Unzip this folder somewhere of your own, for example Documents\OpenSketch-SOLIDWORKS.
   Keep the files together.
2. Double-click OpenSketchSW.exe and click "Install for me".
   (If Windows SmartScreen asks, click More info > Run anyway: the program is not signed.)


Connect
-------
3. Restart SOLIDWORKS. Use whichever of these works on your PC:
   a. The OpenSketch menu > Connect to Claude (the add-in; SOLIDWORKS may not list it
      without admin rights), or
   b. Tools > Macro > Run > Documents\OpenSketch\OpenSketch.swb (the same link, started by
      a macro; give it a toolbar button with Tools > Customize > Commands > Macro), or
   c. OpenSketchSW.exe > "Connect to the open SOLIDWORKS" (drives SOLIDWORKS from outside;
      slower, keep the program open).
4. In the window that opens, paste the OpenSketch address and your SOLIDWORKS key from
   the OpenSketch home page (<OpenSketch address>), and click Connect.
   Tick "Connect when SOLIDWORKS starts" to skip this next time.
5. Add the connector to your AI app: the address is on the same page (it ends in
   /mcp). Then, first time, ask
   "Run the SOLIDWORKS self test, all three stages."
   It makes test files in Documents\OpenSketch\selftest (plate, shapes, assembly) and
   reports every step as ok, check or failed. If anything is not ok, send the report and
   the log (below).
6. Then ask for real work, for example:
   "In SOLIDWORKS, make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes."


What Claude can do
------------------
sw_status, sw_create_document, sw_open_document, sw_get_document, sw_add_features, sw_batch,
sw_body_topology, sw_measure_items, sw_inspect_design, sw_preview, sw_insert_component,
sw_add_mate, sw_find_mate_candidates, sw_check_interference, sw_set_parameter,
sw_set_equation, sw_delete_items, sw_undo, sw_save, sw_export, sw_import, sw_standard_part,
sw_create_drawing (drawings with views, scale, dimensions and title block; PDF, DWG, DXF),
sw_selftest.

Each feature is checked after SOLIDWORKS makes it: OpenSketch builds the same feature on the
same body first, and if SOLIDWORKS read a direction the other way, the feature is made again
the other way round. New files go to Documents\OpenSketch.


If something goes wrong
-----------------------
The log is %LOCALAPPDATA%\OpenSketch\SolidWorks\log.txt ("Copy log" in the window).
Send it with the self-test report when you report a problem.

Remove: OpenSketchSW.exe > Remove (your key stays saved under
HKEY_CURRENT_USER\Software\OpenSketch; delete that key to forget it).
