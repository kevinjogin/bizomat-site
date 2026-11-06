// The CAD Automation tools an AI assistant can call, in plain words, grouped as in the application itself.
// Copied from apps/cad/opensketch/catalog.py (the list the CAD app shows on its Tools page); tests/platform-catalog.test.ts
// fails if the names here and the tools the CAD server registers ever differ.
export const CAD_TOOL_GROUPS: readonly { group: string; tools: readonly { name: string; title: string; text: string }[] }[] = [
  { group: "Connection and documents", tools: [
    { name: "sw_status", title: "Connection status", text: "Checks that SOLIDWORKS is connected and lists the open documents." },
    { name: "sw_get_guide", title: "Working guide", text: "Gives the assistant the workflow and the feature format before it builds." },
    { name: "sw_create_document", title: "New part or assembly", text: "Creates a part or assembly from your default template and saves it." },
    { name: "sw_open_document", title: "Open a file", text: "Opens a SOLIDWORKS file, or brings it to the front." },
    { name: "sw_save", title: "Save", text: "Saves the document, or saves it under a new name." },
    { name: "sw_get_document", title: "Read a document", text: "Reads the feature tree, sketches, dimensions and rebuild errors as they are now." },
  ] },
  { group: "Building and changing parts", tools: [
    { name: "sw_add_features", title: "Add features", text: "Makes sketches and features: extrude, revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, patterns, planes. Every sketch is solved and checked first." },
    { name: "sw_batch", title: "Build in one step", text: "Runs several steps as one change; if one fails, the whole change is taken back." },
    { name: "sw_delete_items", title: "Delete features", text: "Deletes features or components. By default you confirm it in SOLIDWORKS first." },
    { name: "sw_undo", title: "Undo", text: "Undoes recent changes. By default you confirm it in SOLIDWORKS first." },
    { name: "sw_set_parameter", title: "Global variables", text: "Creates, changes or removes a global variable." },
    { name: "sw_set_equation", title: "Equations", text: "Drives a dimension with an equation of global variables." },
    { name: "sw_standard_part", title: "Standard parts", text: "Makes an ISO screw, nut, washer or ball bearing to size, ready to insert." },
  ] },
  { group: "Assemblies", tools: [
    { name: "sw_insert_component", title: "Insert a component", text: "Inserts a part or sub-assembly at a position." },
    { name: "sw_add_mate", title: "Add a mate", text: "Adds a mate between two components." },
    { name: "sw_find_mate_candidates", title: "Suggest mates", text: "Finds likely mates, such as shafts in holes and faces lying on each other." },
    { name: "sw_check_interference", title: "Interference check", text: "Lists every pair of components that overlap, with the overlap volume." },
  ] },
  { group: "Checking and measuring", tools: [
    { name: "sw_inspect_design", title: "Inspect the design", text: "Reports feature states, volume, area, centre of mass and size, to compare with what you meant." },
    { name: "sw_measure_items", title: "Measure", text: "Measures faces, edges and points, like Evaluate > Measure." },
    { name: "sw_body_topology", title: "Faces and edges", text: "Lists the body's faces and edges so the assistant can pick the right ones." },
    { name: "sw_preview", title: "Preview image", text: "Shows a picture of the model from any standard view." },
  ] },
  { group: "Drawings", tools: [
    { name: "sw_create_drawing", title: "Create a drawing", text: "Makes a native drawing with standard views, a preferred scale, model dimensions and title block fields." },
    { name: "sw_get_drawing", title: "Read a drawing", text: "Reads the sheet, every view and the title block." },
    { name: "sw_edit_drawing", title: "Edit a drawing", text: "Adds section, detail and projected views, notes and a bill of materials, and moves or rescales views." },
  ] },
  { group: "Files", tools: [
    { name: "sw_import", title: "Import a file", text: "Opens a STEP, IGES or Parasolid file and saves it as SOLIDWORKS files." },
    { name: "request_upload", title: "Send a large file", text: "Gives the assistant a one-time link to send a large file for import." },
    { name: "sw_export", title: "Export", text: "Exports STEP, STL, Parasolid, IGES, PDF, DWG or DXF and returns a download link valid for one hour." },
  ] },
  { group: "Computers and commands", tools: [
    { name: "sw_list_devices", title: "Your computers", text: "Lists your paired computers and which have SOLIDWORKS open." },
    { name: "sw_command_status", title: "Command progress", text: "Shows where a long command is and its result when done." },
    { name: "sw_cancel_command", title: "Cancel a command", text: "Cancels a command that has not finished." },
    { name: "sw_selftest", title: "Self test", text: "Checks a computer step by step: sketches, features, an assembly and a drawing." },
  ] },
];

/** Example requests (apps/cad/opensketch/catalog.py EXAMPLES). */
export const CAD_EXAMPLES: readonly { group: string; requests: readonly string[] }[] = [
  { group: "Make a part", requests: ["Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner.", "Make a flanged bushing: 30 mm outside, 16 mm bore, 25 mm long, with a 45 mm flange 5 mm thick."] },
  { group: "Change a design", requests: ["In the open part, make the plate 10 mm thick and add 2 mm fillets to the outside edges.", "Add a global variable called wall, set it to 2.5 mm and drive the shell thickness with it."] },
  { group: "Assemblies", requests: ["Insert the plate and four M5 x 12 socket head cap screws into a new assembly and mate the screws in the holes.", "Check the open assembly for interference and tell me which parts overlap."] },
  { group: "Drawings", requests: ["Create an A3 drawing of the open part with the standard views, an isometric and the model dimensions.", "Add a section view through the centre of the front view and export the drawing as PDF."] },
  { group: "Check and export", requests: ["Measure the open part: volume, mass properties and overall size.", "Export the open part as a STEP file."] },
];
