"""What CADOS can do, in plain words: one entry per MCP tool, grouped, for the app's Tools, History and Assistant
pages. tests/test_app_pages.py checks that every registered tool is here and nothing else is, so this list cannot
drift from what the AI assistant can really call.
"""

from __future__ import annotations

# (group, [(tool name, short title, one sentence)])
GROUPS: list[tuple[str, list[tuple[str, str, str]]]] = [
    ("Connection and documents", [
        ("sw_status", "Connection status", "Checks that SOLIDWORKS is connected and lists the open documents."),
        ("sw_get_guide", "Working guide", "Gives the assistant the workflow and the feature format before it builds."),
        ("sw_create_document", "New part or assembly", "Creates a part or assembly from your default template and saves it."),
        ("sw_open_document", "Open a file", "Opens a SOLIDWORKS file, or brings it to the front."),
        ("sw_save", "Save", "Saves the document, or saves it under a new name."),
        ("sw_get_document", "Read a document", "Reads the feature tree, sketches, dimensions and rebuild errors as they are now."),
    ]),
    ("Building and changing parts", [
        ("sw_add_features", "Add features", "Makes sketches and features: extrude, revolve, sweep, loft, hole, fillet, chamfer, shell, draft, mirror, patterns, planes. Every sketch is solved and checked first."),
        ("sw_batch", "Build in one step", "Runs several steps as one change; if one fails, the whole change is taken back."),
        ("sw_delete_items", "Delete features", "Deletes features or components. By default you confirm it in SOLIDWORKS first."),
        ("sw_undo", "Undo", "Undoes recent changes. By default you confirm it in SOLIDWORKS first."),
        ("sw_set_parameter", "Global variables", "Creates, changes or removes a global variable."),
        ("sw_set_equation", "Equations", "Drives a dimension with an equation of global variables."),
        ("sw_standard_part", "Standard parts", "Makes an ISO screw, nut, washer or ball bearing to size, ready to insert."),
    ]),
    ("Assemblies", [
        ("sw_insert_component", "Insert a component", "Inserts a part or sub-assembly at a position."),
        ("sw_add_mate", "Add a mate", "Adds a mate between two components."),
        ("sw_find_mate_candidates", "Suggest mates", "Finds likely mates, such as shafts in holes and faces lying on each other."),
        ("sw_check_interference", "Interference check", "Lists every pair of components that overlap, with the overlap volume."),
    ]),
    ("Checking and measuring", [
        ("sw_inspect_design", "Inspect the design", "Reports feature states, volume, area, centre of mass and size, to compare with what you meant."),
        ("sw_measure_items", "Measure", "Measures faces, edges and points, like Evaluate > Measure."),
        ("sw_body_topology", "Faces and edges", "Lists the body's faces and edges so the assistant can pick the right ones."),
        ("sw_preview", "Preview image", "Shows a picture of the model from any standard view."),
    ]),
    ("Drawings", [
        ("sw_create_drawing", "Create a drawing", "Makes a native drawing with standard views, a preferred scale, model dimensions and title block fields."),
        ("sw_get_drawing", "Read a drawing", "Reads the sheet, every view and the title block."),
        ("sw_edit_drawing", "Edit a drawing", "Adds section, detail and projected views, notes and a bill of materials, and moves or rescales views."),
    ]),
    ("Files", [
        ("sw_import", "Import a file", "Opens a STEP, IGES or Parasolid file and saves it as SOLIDWORKS files."),
        ("request_upload", "Send a large file", "Gives the assistant a one-time link to send a large file for import."),
        ("sw_export", "Export", "Exports STEP, STL, Parasolid, IGES, PDF, DWG or DXF and returns a download link valid for one hour."),
    ]),
    ("Computers and commands", [
        ("sw_list_devices", "Your computers", "Lists your paired computers and which have SOLIDWORKS open."),
        ("sw_command_status", "Command progress", "Shows where a long command is and its result when done."),
        ("sw_cancel_command", "Cancel a command", "Cancels a command that has not finished."),
        ("sw_selftest", "Self test", "Checks a computer step by step: sketches, features, an assembly and a drawing."),
    ]),
]

TITLES: dict[str, str] = {name: title for _, tools in GROUPS for name, title, _ in tools}


def title(tool: str | None) -> str:
    return TITLES.get(tool or "", tool or "Command")


# Example requests for the Assistant page and the home task box, grouped as people think about their work.
EXAMPLES: list[tuple[str, list[str]]] = [
    ("Make a part", [
        "Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner.",
        "Make a flanged bushing: 30 mm outside, 16 mm bore, 25 mm long, with a 45 mm flange 5 mm thick.",
    ]),
    ("Change a design", [
        "In the open part, make the plate 10 mm thick and add 2 mm fillets to the outside edges.",
        "Add a global variable called wall, set it to 2.5 mm and drive the shell thickness with it.",
    ]),
    ("Assemblies", [
        "Insert the plate and four M5 x 12 socket head cap screws into a new assembly and mate the screws in the holes.",
        "Check the open assembly for interference and tell me which parts overlap.",
    ]),
    ("Drawings", [
        "Create an A3 drawing of the open part with the standard views, an isometric and the model dimensions.",
        "Add a section view through the centre of the front view and export the drawing as PDF.",
    ]),
    ("Check and export", [
        "Measure the open part: volume, mass properties and overall size.",
        "Export the open part as a STEP file.",
    ]),
]
