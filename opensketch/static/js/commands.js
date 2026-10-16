// Command registry and CommandManager layout (tab by tab, in SOLIDWORKS order).

export function buildCommands(app) {
  const sk = () => app.sketcher;
  const inSketch = () => app.mode === 'sketch';
  const tool = (name) => ({ run: () => app.sketchTool(name), active: () => inSketch() && sk().tool?.name === name, enabled: () => true });
  const soon = (what) => () => app.toast(`${what} is not available yet in this version.`);
  const C = {
    // quick access
    new: { label: 'New', icon: 'new', tip: 'Creates a new document (Ctrl+N)', run: () => app.newDoc() },
    open: { label: 'Open', icon: 'open', tip: 'Opens an existing document (Ctrl+O)', run: () => app.openFile() },
    save: { label: 'Save', icon: 'save', tip: 'Saves the active document (Ctrl+S)', run: () => app.saveFile() },
    saveas: { label: 'Save As', icon: 'save', tip: 'Saves the document as .osk, STEP, STL or a SOLIDWORKS macro', run: () => app.saveAs() },
    sldmacro: { label: 'Export SOLIDWORKS Macro', icon: 'save', tip: 'Writes a SOLIDWORKS macro (.bas) that rebuilds the part, or the parts and the mated assembly, in SOLIDWORKS', run: () => app.exportMacro() },
    print: { label: 'Print', icon: 'print', tip: 'Prints the graphics area', run: () => window.print() },
    undo: { label: 'Undo', icon: 'undo', tip: 'Undo the last action (Ctrl+Z)', run: () => app.undo() },
    redo: { label: 'Redo', icon: 'redo', tip: 'Redo the last undone action (Ctrl+Y)', run: () => app.redo() },
    select: { label: 'Select', icon: 'select', tip: 'Selects sketch entities, edges, faces and planes', run: () => app.selectTool() },
    rebuild: { label: 'Rebuild', icon: 'rebuild', tip: 'Rebuilds the part (Ctrl+B)', run: () => app.regen(true) },
    fileprops: { label: 'File Properties', icon: 'props', tip: 'Summary and custom properties', run: () => app.openTask('custprops') },
    serveropen: { label: 'Open from Server', icon: 'open', tip: 'Opens a document stored on the OpenSketch server, such as one Claude built. Claude\'s later changes appear live.', run: () => app.server.openDialog() },
    serversave: { label: 'Save to Server', icon: 'save', tip: 'Stores this document on the OpenSketch server so Claude can work on it with you.', run: () => app.server.saveAsNew() },
    connectclaude: { label: 'Connect Claude', icon: 'ai', tip: 'Use OpenSketch from the Claude app: shows the connector address to add in Claude.', run: () => app.server.connectDialog() },
    options: { label: 'Options', icon: 'options', tip: 'System options and document properties', run: () => app.optionsDialog() },

    // features
    extrude: { label: 'Extruded Boss/Base', icon: 'extrude', tip: 'Extrudes a sketch or selected sketch contours in one or two directions to create a solid feature.', run: () => app.featureCommand('extrude') },
    revolve: { label: 'Revolved Boss/Base', icon: 'revolve', tip: 'Revolves a sketch or selected sketch contours around an axis to create a solid feature.', run: () => app.featureCommand('revolve') },
    sweep: { label: 'Swept Boss/Base', icon: 'sweep', tip: 'Sweeps a closed profile along an open or closed path.', run: soon('Swept Boss/Base'), disabled: true },
    loft: { label: 'Lofted Boss/Base', icon: 'loft', tip: 'Adds material between two or more profiles.', run: soon('Lofted Boss/Base'), disabled: true },
    boundary: { label: 'Boundary Boss/Base', icon: 'boundary', tip: 'Adds material between profiles in two directions.', run: soon('Boundary Boss/Base'), disabled: true },
    cut: { label: 'Extruded Cut', icon: 'cut', tip: 'Cuts a solid model by extruding a sketched profile in one or two directions.', run: () => app.featureCommand('cut') },
    hole: { label: 'Hole Wizard', icon: 'hole', tip: 'Inserts a hole with a pre-defined cross section.', run: soon('Hole Wizard'), disabled: true },
    revcut: { label: 'Revolved Cut', icon: 'revcut', tip: 'Cuts a solid model by revolving a sketched profile around an axis.', run: () => app.featureCommand('revcut') },
    sweepcut: { label: 'Swept Cut', icon: 'sweepcut', tip: 'Cuts a solid model by sweeping a closed profile along a path.', run: soon('Swept Cut'), disabled: true },
    loftcut: { label: 'Lofted Cut', icon: 'loftcut', tip: 'Cuts a solid model by removing material between profiles.', run: soon('Lofted Cut'), disabled: true },
    boundarycut: { label: 'Boundary Cut', icon: 'boundary', tip: 'Cuts a solid model by removing material between profiles in two directions.', run: soon('Boundary Cut'), disabled: true },
    fillet: { label: 'Fillet', icon: 'fillet', tip: 'Creates a rounded internal or external face along one or more edges.', run: () => app.featureCommand('fillet') },
    chamfer: { label: 'Chamfer', icon: 'chamfer', tip: 'Creates a bevel feature on selected edges.', run: () => app.featureCommand('chamfer') },
    linpattern: { label: 'Linear Pattern', icon: 'linpattern', tip: 'Patterns features along one or two linear paths.', run: () => app.featureCommand('linear_pattern') },
    circpattern: { label: 'Circular Pattern', icon: 'circpattern', tip: 'Patterns features around an axis.', run: () => app.featureCommand('circular_pattern') },
    mirror: { label: 'Mirror', icon: 'mirror', tip: 'Mirrors features or bodies about a face or plane.', run: () => app.featureCommand('mirror') },
    rib: { label: 'Rib', icon: 'rib', tip: 'Adds a thin-walled support to a solid body.', run: soon('Rib'), disabled: true },
    draft: { label: 'Draft', icon: 'draft', tip: 'Tapers model faces by a specified angle. Use Draft On/Off in Extrude for now.', run: soon('Draft'), disabled: true },
    shell: { label: 'Shell', icon: 'shell', tip: 'Removes material from a solid body to create a thin-walled feature.', run: () => app.featureCommand('shell') },
    wrap: { label: 'Wrap', icon: 'wrap', tip: 'Wraps a sketch onto a face.', run: soon('Wrap'), disabled: true },
    intersect: { label: 'Intersect', icon: 'intersect', tip: 'Intersects solids, surfaces or planes.', run: soon('Intersect'), disabled: true },
    refgeom: { label: 'Reference Geometry', icon: 'refgeom', tip: 'Reference geometry commands.', run: () => app.featureCommand('plane') },
    plane: { label: 'Plane', icon: 'plane', tip: 'Adds a reference plane.', run: () => app.featureCommand('plane') },
    curves: { label: 'Curves', icon: 'curves', tip: 'Curve commands.', run: soon('Curves'), disabled: true },
    instant3d: { label: 'Instant3D', icon: 'instant3d', tip: 'Enables dragging handles and dimensions to modify features.', run: soon('Instant3D'), disabled: true },

    // sketch
    sketch: { label: () => (inSketch() ? 'Exit Sketch' : 'Sketch'), icon: () => (inSketch() ? 'exitsketch' : 'sketch'), tip: 'Creates a new sketch, or edits an existing sketch.', run: () => (inSketch() ? app.exitSketch() : app.sketchCommand()), active: () => inSketch() },
    smartdim: { label: 'Smart Dimension', icon: 'smartdim', tip: 'Creates a dimension for one or more selected entities.', ...tool('smartdim'), run: () => app.sketchTool('smartdim') },
    line: { label: 'Line', icon: 'line', tip: 'Sketches a line.', ...tool('line') },
    centerline: { label: 'Centerline', icon: 'centerline', tip: 'Sketches a centerline.', ...tool('centerline') },
    rectangle: { label: 'Corner Rectangle', icon: 'rectangle', tip: 'Sketches a rectangle.', ...tool('rectangle') },
    centerrect: { label: 'Center Rectangle', icon: 'centerrect', tip: 'Sketches a center rectangle.', ...tool('centerrect') },
    slot: { label: 'Straight Slot', icon: 'slot', tip: 'Sketches a straight slot.', ...tool('slot') },
    circle: { label: 'Circle', icon: 'circle', tip: 'Sketches a circle. Select the center, then drag to set the radius.', ...tool('circle') },
    arc: { label: 'Centerpoint Arc', icon: 'arc', tip: 'Sketches a centerpoint arc.', ...tool('arc') },
    threeptarc: { label: '3 Point Arc', icon: 'threeptarc', tip: 'Sketches a 3 point arc.', ...tool('threeptarc') },
    tangentarc: { label: 'Tangent Arc', icon: 'tangentarc', tip: 'Sketches an arc tangent to a sketch entity.', ...tool('tangentarc') },
    polygon: { label: 'Polygon', icon: 'polygon', tip: 'Sketches a polygon.', ...tool('polygon') },
    spline: { label: 'Spline', icon: 'spline', tip: 'Sketches a spline.', run: soon('Spline'), disabled: true },
    ellipse: { label: 'Ellipse', icon: 'ellipse', tip: 'Sketches an ellipse.', run: soon('Ellipse'), disabled: true },
    sketchfillet: { label: 'Sketch Fillet', icon: 'sketchfillet', tip: 'Rounds the corner at the intersection of two sketch entities.', ...tool('sketchfillet') },
    text: { label: 'Text', icon: 'text', tip: 'Sketches text.', run: soon('Sketch text'), disabled: true },
    point: { label: 'Point', icon: 'point', tip: 'Sketches a point.', ...tool('point') },
    trim: { label: 'Trim Entities', icon: 'trim', tip: 'Trims a sketch entity to the closest intersection.', ...tool('trim') },
    convert: { label: 'Convert Entities', icon: 'convert', tip: 'Projects selected model edges onto the sketch plane.', run: () => app.convertEntities() },
    offset: { label: 'Offset Entities', icon: 'offset', tip: 'Offsets selected sketch entities by a distance.', run: () => app.offsetEntities() },
    sketchmirror: { label: 'Mirror Entities', icon: 'sketchmirror', tip: 'Mirrors selected entities about a centerline.', run: () => app.sketcher.active ? app.sketcher.mirrorSelection() : app.toast('Edit a sketch first.') },
    sketchpattern: { label: 'Linear Sketch Pattern', icon: 'sketchpattern', tip: 'Patterns sketch entities.', run: soon('Linear Sketch Pattern'), disabled: true },
    move: { label: 'Move Entities', icon: 'move', tip: 'Moves sketch entities.', run: soon('Move Entities'), disabled: true },
    relations: { label: 'Display/Delete Relations', icon: 'relations', tip: 'Displays and deletes geometric relations.', run: () => app.relationsPM() },
    addrelation: { label: 'Add Relation', icon: 'addrelation', tip: 'Controls the size or position of entities with relations.', run: () => app.addRelationPM() },
    repair: { label: 'Repair Sketch', icon: 'repair', tip: 'Finds and repairs sketch errors.', run: () => app.repairSketch() },
    quicksnaps: { label: 'Quick Snaps', icon: 'quicksnaps', tip: 'Snaps are always on.', run: () => app.toast('Point, center, midpoint and inference snaps are on.') },
    rapidsketch: { label: 'Rapid Sketch', icon: 'rapidsketch', tip: 'Sketches on planar faces as you hover.', run: soon('Rapid Sketch'), disabled: true },
    instant2d: { label: 'Instant2D', icon: 'instant2d', tip: 'Double-click a dimension to change it.', run: () => app.toast('Double-click a dimension to change its value.') },
    shadedsketch: { label: 'Shaded Sketch Contours', icon: 'shadedsketch', tip: 'Shades closed sketch regions.', run: soon('Shaded Sketch Contours'), disabled: true },

    // evaluate
    measure: { label: 'Measure', icon: 'measure', tip: 'Calculates distance, length, area and angle.', run: () => app.measurePM() },
    massprops: { label: 'Mass Properties', icon: 'massprops', tip: 'Displays the mass properties of the model.', run: () => app.massProperties() },
    section: { label: 'Section View', icon: 'sectionview', tip: 'Displays a cutaway of the part using a plane.', run: () => app.sectionPM(), active: () => !!app.viewer.clipPlane },
    check: { label: 'Check', icon: 'check', tip: 'Checks the model for rebuild errors.', run: () => app.checkModel() },
    stats: { label: 'Performance Evaluation', icon: 'stats', tip: 'Shows rebuild time per feature.', run: () => app.statsDialog() },

    // assembly
    insertcomp: { label: 'Insert Components', icon: 'insertcomp', tip: 'Adds an existing part to the assembly.', run: () => app.asm.insertPM() },
    newpart: { label: 'New Part', icon: 'newpart', tip: 'Creates a new part in the assembly and opens it for editing.', run: () => app.asm.newPart() },
    mate: { label: 'Mate', icon: 'mate', tip: 'Positions two components relative to each other.', run: () => app.asm.matePM() },
    movecomp: { label: 'Move Component', icon: 'movecomp', tip: 'Drag an under-defined component in the graphics area. Mates keep holding.', run: () => app.toast('Drag an under-defined component with the left mouse button. Mates keep holding.') },
    fixfloat: { label: 'Fix / Float', icon: 'fix', tip: 'Fixes the selected component in place, or lets it move again.', run: () => { const s = app.selection.find((x) => x.kind === 'component'); if (!s) return app.toast('Select a component first.'); const c = app.asm.comp(s.id); app.asm.setFixed(c.id, !c.fixed); } },
    hidecomp: { label: 'Hide/Show Components', icon: 'hideshow', tip: 'Hides or shows the selected components.', run: () => { const s = app.selection.filter((x) => x.kind === 'component'); if (!s.length) return app.toast('Select a component first.'); for (const x of s) app.asm.setHidden(x.id, !app.asm.comp(x.id).hidden); } },
    interference: { label: 'Interference Detection', icon: 'interference', tip: 'Finds overlapping volume between components.', run: () => app.asm.interferencePM() },
    playback: { label: 'Assembly Playback', icon: 'playback', tip: 'Replays the assembly order: each component flies in and settles onto its mates (Motion Study).', run: () => app.asm.playSequence() },
    openpart: { label: 'Open Part', icon: 'open', tip: 'Opens the selected component\'s part for editing. Return to the assembly when done.', run: () => { const s = app.selection.find((x) => x.kind === 'component'); if (!s) return app.toast('Select a component first.'); app.asm.openPart(s.id); } },
    toolbox: { label: 'Toolbox', icon: 'toolbox', tip: 'Standard screws, nuts, washers and bearings, made to size.', run: () => app.openTask('library') },
    asmexplain: { label: 'Explain Assembly', icon: 'ai', tip: 'Asks the AI to explain the assembly and how it moves.', run: () => app.aiQuick('Explain this assembly: the parts, how they are mated and which components can still move. Do not change it.') },
    aimates: { label: 'Add Mates', icon: 'mate', tip: 'Asks the AI to mate an imported assembly from its geometry, leaving hinges and slides free.', run: () => app.aiQuick('This assembly has components without enough mates (for example it was imported from STEP). Call find_mate_candidates, then add the mates a designer would use so every part sits where it is now. Leave hinges, slides and wheels free to move where the product moves. Do not move or change parts.') },
    airebuild: { label: 'Rebuild as Features', icon: 'imported', tip: 'Asks the AI to rebuild an imported body as an editable feature tree.', run: () => app.aiQuick('Rebuild the imported body (the import feature) as an editable feature tree: sketches with relations and dimensions, extrudes, cuts, revolves, fillets. Use propose_features mode replace without the import feature, and get the comparison with the import as close to zero as you can. Tell me what you could not match.') },
    asmfix: { label: 'Fix Mates', icon: 'mate', tip: 'Asks the AI to fix mate errors and interferences.', run: () => app.aiQuick('Fix the mate errors and any interferences in this assembly with minimal changes.') },

    // AI add-in
    ai: { label: 'OpenSketch AI', icon: 'ai', tip: 'Describe a part or a change, the AI proposes features you can accept or reject (Ctrl+L).', run: () => app.openTask('ai') },
    aiexplain: { label: 'Explain Model', icon: 'ai', tip: 'Asks the AI to explain the feature tree.', run: () => app.aiQuick('Explain this part and its design intent in a few sentences. Do not change it.') },
    aifix: { label: 'Fix Errors', icon: 'rebuild', tip: 'Asks the AI to fix rebuild errors.', run: () => app.aiQuick('Fix the rebuild errors in this part with minimal changes.') },
    aidefine: { label: 'Fully Define', icon: 'smartdim', tip: 'Asks the AI to add relations and dimensions so every sketch is fully defined.', run: () => app.aiQuick('Add relations and dimensions so every sketch is fully defined, keeping the current geometry.') },
  };
  for (const [id, c] of Object.entries(C)) c.id = id;
  return C;
}

// CommandManager tabs. big = large button, col = stacked small buttons, grid = small icon grid.
export const TABS = [
  { name: 'Features', items: [
    { big: 'extrude' }, { big: 'revolve' }, { col: ['sweep', 'loft', 'boundary'] }, '|',
    { big: 'cut' }, { big: 'hole' }, { big: 'revcut' }, { col: ['sweepcut', 'loftcut', 'boundarycut'] }, '|',
    { big: 'fillet', fly: ['fillet', 'chamfer'] }, { big: 'linpattern', fly: ['linpattern', 'circpattern', 'mirror'] },
    { col: ['rib', 'wrap'] }, { col: ['draft', 'intersect'] }, { col: ['shell', 'mirror'] }, '|',
    { big: 'refgeom', fly: ['plane'] }, { big: 'curves' }, { big: 'instant3d' },
  ] },
  { name: 'Sketch', items: [
    { big: 'sketch' }, { big: 'smartdim' }, '|',
    { grid: [['line', ['line', 'centerline']], ['rectangle', ['rectangle', 'centerrect']], ['slot', ['slot']], ['circle', ['circle']], ['arc', ['arc', 'threeptarc', 'tangentarc']], ['polygon', ['polygon']], ['spline', ['spline']], ['ellipse', ['ellipse']], ['sketchfillet', ['sketchfillet']], ['text', ['text']], ['point', ['point']], ['centerline', ['centerline']]] }, '|',
    { big: 'trim' }, { big: 'convert' }, { big: 'offset' }, { col: ['sketchmirror', 'sketchpattern', 'move'] }, '|',
    { big: 'relations', fly: ['relations', 'addrelation'] }, { big: 'repair' }, { big: 'quicksnaps' }, { big: 'rapidsketch' }, { big: 'instant2d' }, { big: 'shadedsketch' },
  ] },
  { name: 'Evaluate', items: [{ big: 'measure' }, { big: 'massprops' }, { big: 'section' }, { big: 'check' }, { big: 'stats' }] },
  { name: 'OpenSketch AI', items: [{ big: 'ai' }, { big: 'airebuild' }, { big: 'aiexplain' }, { big: 'aifix' }, { big: 'aidefine' }, '|', { big: 'connectclaude' }] },
];

// Assembly documents get the SOLIDWORKS assembly CommandManager.
export const ASM_TABS = [
  { name: 'Assembly', items: [
    { big: 'insertcomp', fly: ['insertcomp', 'newpart'] }, { big: 'mate' }, '|',
    { big: 'movecomp' }, { col: ['fixfloat', 'hidecomp', 'openpart'] }, '|',
    { big: 'interference' }, { big: 'playback' }, '|', { big: 'toolbox' },
  ] },
  { name: 'Evaluate', items: [{ big: 'interference' }, { big: 'massprops' }, { big: 'section' }, { big: 'check' }, { big: 'stats' }] },
  { name: 'OpenSketch AI', items: [{ big: 'ai' }, { big: 'aimates' }, { big: 'asmexplain' }, { big: 'asmfix' }, '|', { big: 'connectclaude' }] },
];

export const QUICK = ['new', 'open', 'save', 'print', 'undo', 'redo', 'select', 'rebuild', 'fileprops', 'options'];

export const MENUS = [
  { name: 'File', items: ['new', 'open', 'serveropen', 'save', 'saveas', 'serversave', 'sldmacro', '-', 'connectclaude', '-', 'print', '-', 'fileprops'] },
  { name: 'Edit', items: ['undo', 'redo', '-', 'rebuild', '-', { label: 'Delete', run: (app) => app.deleteSelection(), key: 'Del' }, { label: 'Suppress', run: (app) => app.suppressSelection(true) }, { label: 'Unsuppress', run: (app) => app.suppressSelection(false) }] },
  { name: 'View', items: [{ label: 'Planes', run: (app) => app.toggleView('planes') }, { label: 'Origins', run: (app) => app.toggleView('origins') }, { label: 'Sketches', run: (app) => app.toggleView('sketches') }, { label: 'Sketch Relations', run: (app) => app.toggleView('relations') }, '-', { label: 'Zoom to Fit', run: (app) => app.viewer.zoomToFit(), key: 'F' }] },
  { name: 'Insert', items: ['insertcomp', 'newpart', 'mate', '-', 'extrude', 'revolve', 'cut', 'revcut', '-', 'fillet', 'chamfer', 'shell', '-', 'linpattern', 'circpattern', 'mirror', '-', 'plane', '-', 'sketch'] },
  { name: 'Tools', items: ['line', 'centerline', 'rectangle', 'circle', 'arc', 'slot', 'polygon', 'point', '-', 'smartdim', 'addrelation', 'relations', '-', 'trim', 'convert', 'offset', 'sketchmirror', 'sketchfillet', '-', 'measure', 'massprops', '-', 'options'] },
  { name: 'Window', items: [{ label: 'Part1', run: () => {} }] },
  { name: 'Help', items: [{ label: 'Keyboard Shortcuts', run: (app) => app.shortcutsDialog() }, { label: 'About OpenSketch', run: (app) => app.aboutDialog() }] },
];
