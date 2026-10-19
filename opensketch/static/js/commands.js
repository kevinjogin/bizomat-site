// Command registry and CommandManager layout (tab by tab, in SOLIDWORKS order).
import { LOOK, LOOKS, setLook } from './skin.js';
// Feature commands from the server's feature registry (SPECS) are added here too: a registered
// feature replaces its 'not available yet' placeholder and joins the Insert menu.

import { SPECS } from './features.js';

export function buildCommands(app) {
  const sk = () => app.sketcher;
  const inSketch = () => app.mode === 'sketch';
  const tool = (name) => ({ run: () => app.sketchTool(name), active: () => inSketch() && sk().tool?.name === name, enabled: () => true });
  const soon = (what) => () => app.toast(`${what} is not available yet in this version.`);
  const C = {
    // quick access
    new: { label: 'New', icon: 'new', key: 'Ctrl+N', tip: 'Creates a new document (Ctrl+N)', run: () => app.newDoc() },
    open: { label: 'Open', icon: 'open', key: 'Ctrl+O', tip: 'Your Files: open, upload or start a model (Ctrl+O)', run: () => app.openFile() },
    save: { label: 'Save', icon: 'save', key: 'Ctrl+S', tip: 'Saves to your Files (Ctrl+S). Files save by themselves after the first save.', run: () => app.saveFile() },
    saveas: { label: 'Save As', icon: 'save', tip: 'Saves the document as .osk, STEP, STL or a SOLIDWORKS macro', run: () => app.saveAs() },
    sldmacro: { label: 'Export SOLIDWORKS Macro', icon: 'save', tip: 'Writes a SOLIDWORKS macro (.bas) that rebuilds the part, or the parts and the mated assembly, in SOLIDWORKS', run: () => app.exportMacro() },
    print: { label: 'Print', icon: 'print', tip: 'Prints the graphics area', run: () => window.print() },
    undo: { label: 'Undo', icon: 'undo', tip: 'Undo the last action (Ctrl+Z)', run: () => app.undo() },
    redo: { label: 'Redo', icon: 'redo', tip: 'Redo the last undone action (Ctrl+Y)', run: () => app.redo() },
    select: { label: 'Select', icon: 'select', tip: 'Selects sketch entities, edges, faces and planes', run: () => app.selectTool() },
    rebuild: { label: 'Rebuild', icon: 'rebuild', key: 'Ctrl+B', tip: 'Rebuilds the part (Ctrl+B)', run: () => app.regen(true) },
    fileprops: { label: 'File Properties', icon: 'props', tip: 'Summary and custom properties', run: () => app.openTask('custprops') },
    serveropen: { label: 'Files...', icon: 'open', tip: 'Your files on this server, with a picture of each. Your AI\'s changes appear live in the one you open.', run: () => app.files.open() },
    serversave: { label: 'Save a Copy to Files', icon: 'save', tip: 'Stores a copy of this model in your Files.', run: () => (app.server.linked ? app.server.saveAsNew(app.rootDoc().name + ' copy') : app.server.saveDraft()) },
    publishreview: { label: 'Publish Review...', icon: 'save', tip: 'Publishes a read-only link to this version, to send or open on a phone: the model in OpenSketch, its joints, what changed and the checks.', run: () => app.server.publishDialog() },
    connectclaude: { label: 'Connect AI', icon: 'ai', tip: 'Use ChatGPT, Claude, Codex, Cursor or another AI app with OpenSketch, or add your own API key for the built-in AI.', run: () => app.server.connectDialog() },
    openlocal: { label: 'Open from Computer...', icon: 'open', tip: 'Opens an OpenSketch, STEP or EAGLE file from your computer into your Files.', run: () => app.openFromComputer() },
    options: { label: 'Options', icon: 'options', tip: 'System options and document properties', run: () => app.optionsDialog() },

    // features
    extrude: { label: 'Extruded Boss/Base', icon: 'extrude', tip: 'Extrudes a sketch or selected sketch contours in one or two directions to create a solid feature.', run: () => app.featureCommand('extrude') },
    revolve: { label: 'Revolved Boss/Base', icon: 'revolve', tip: 'Revolves a sketch or selected sketch contours around an axis to create a solid feature.', run: () => app.featureCommand('revolve') },
    sweep: { label: 'Swept Boss/Base', icon: 'sweep', tip: 'Sweeps a closed profile along an open or closed path.', run: () => app.featureCommand('sweep') },
    loft: { label: 'Lofted Boss/Base', icon: 'loft', tip: 'Adds material between two or more profiles.', run: () => app.featureCommand('loft') },
    boundary: { label: 'Boundary Boss/Base', icon: 'boundary', tip: 'Adds material between profiles in two directions.', run: soon('Boundary Boss/Base'), disabled: true },
    cut: { label: 'Extruded Cut', icon: 'cut', tip: 'Cuts a solid model by extruding a sketched profile in one or two directions.', run: () => app.featureCommand('cut') },
    hole: { label: 'Hole Wizard', icon: 'hole', tip: 'Inserts a hole with a pre-defined cross section.', run: () => app.featureCommand('hole') },
    revcut: { label: 'Revolved Cut', icon: 'revcut', tip: 'Cuts a solid model by revolving a sketched profile around an axis.', run: () => app.featureCommand('revcut') },
    sweepcut: { label: 'Swept Cut', icon: 'sweepcut', tip: 'Cuts a solid model by sweeping a closed profile along a path.', run: () => app.featureCommand('sweepcut') },
    loftcut: { label: 'Lofted Cut', icon: 'loftcut', tip: 'Cuts a solid model by removing material between profiles.', run: () => app.featureCommand('loftcut') },
    boundarycut: { label: 'Boundary Cut', icon: 'boundary', tip: 'Cuts a solid model by removing material between profiles in two directions.', run: soon('Boundary Cut'), disabled: true },
    fillet: { label: 'Fillet', icon: 'fillet', tip: 'Creates a rounded internal or external face along one or more edges.', run: () => app.featureCommand('fillet') },
    chamfer: { label: 'Chamfer', icon: 'chamfer', tip: 'Creates a bevel feature on selected edges.', run: () => app.featureCommand('chamfer') },
    linpattern: { label: 'Linear Pattern', icon: 'linpattern', tip: 'Patterns features along one or two linear paths.', run: () => app.featureCommand('linear_pattern') },
    circpattern: { label: 'Circular Pattern', icon: 'circpattern', tip: 'Patterns features around an axis.', run: () => app.featureCommand('circular_pattern') },
    mirror: { label: 'Mirror', icon: 'mirror', tip: 'Mirrors features or bodies about a face or plane.', run: () => app.featureCommand('mirror') },
    rib: { label: 'Rib', icon: 'rib', tip: 'Adds a thin-walled support to a solid body.', run: soon('Rib'), disabled: true },
    shell: { label: 'Shell', icon: 'shell', tip: 'Removes material from a solid body to create a thin-walled feature.', run: () => app.featureCommand('shell') },
    wrap: { label: 'Wrap', icon: 'wrap', tip: 'Wraps a sketch onto a face.', run: soon('Wrap'), disabled: true },
    intersect: { label: 'Intersect', icon: 'intersect', tip: 'Intersects solids, surfaces or planes.', run: soon('Intersect'), disabled: true },
    refgeom: { label: 'Reference Geometry', icon: 'refgeom', tip: 'Reference geometry commands.', run: () => app.featureCommand('plane') },
    plane: { label: 'Plane', icon: 'plane', tip: 'Adds a reference plane.', run: () => app.featureCommand('plane') },
    curves: { label: 'Curves', icon: 'curves', tip: 'Curve commands.', run: soon('Curves'), disabled: true },
    instant3d: { label: 'Instant3D', icon: 'instant3d', tip: 'Enables dragging handles and dimensions to modify features.', run: soon('Instant3D'), disabled: true },

    // sketch
    sketch: { label: () => (inSketch() ? 'Exit Sketch' : 'Sketch'), icon: () => (inSketch() ? 'exitsketch' : 'sketch'), tip: 'Creates a new sketch, or edits an existing sketch.', run: () => (inSketch() ? app.exitSketch() : app.sketchCommand()), active: () => inSketch() },
    smartdim: { label: 'Smart Dimension', icon: 'smartdim', key: 'D', tip: 'Creates a dimension for one or more selected entities.', ...tool('smartdim'), run: () => app.sketchTool('smartdim') },
    line: { label: 'Line', icon: 'line', key: 'L', tip: 'Sketches a line.', ...tool('line') },
    centerline: { label: 'Centerline', icon: 'centerline', tip: 'Sketches a centerline.', ...tool('centerline') },
    rectangle: { label: 'Corner Rectangle', icon: 'rectangle', key: 'R', tip: 'Sketches a rectangle.', ...tool('rectangle') },
    centerrect: { label: 'Center Rectangle', icon: 'centerrect', tip: 'Sketches a center rectangle.', ...tool('centerrect') },
    slot: { label: 'Straight Slot', icon: 'slot', tip: 'Sketches a straight slot.', ...tool('slot') },
    circle: { label: 'Circle', icon: 'circle', key: 'C', tip: 'Sketches a circle. Select the center, then drag to set the radius.', ...tool('circle') },
    arc: { label: 'Centerpoint Arc', icon: 'arc', key: 'A', tip: 'Sketches a centerpoint arc.', ...tool('arc') },
    threeptarc: { label: '3 Point Arc', icon: 'threeptarc', tip: 'Sketches a 3 point arc.', ...tool('threeptarc') },
    tangentarc: { label: 'Tangent Arc', icon: 'tangentarc', tip: 'Sketches an arc tangent to a sketch entity.', ...tool('tangentarc') },
    polygon: { label: 'Polygon', icon: 'polygon', tip: 'Sketches a polygon.', ...tool('polygon') },
    spline: { label: 'Spline', icon: 'spline', tip: 'Sketches a spline.', run: soon('Spline'), disabled: true },
    ellipse: { label: 'Ellipse', icon: 'ellipse', tip: 'Sketches an ellipse.', run: soon('Ellipse'), disabled: true },
    sketchfillet: { label: 'Sketch Fillet', icon: 'sketchfillet', tip: 'Rounds the corner at the intersection of two sketch entities.', ...tool('sketchfillet') },
    text: { label: 'Text', icon: 'text', tip: 'Sketches text.', run: soon('Sketch text'), disabled: true },
    point: { label: 'Point', icon: 'point', key: 'P', tip: 'Sketches a point.', ...tool('point') },
    trim: { label: 'Trim Entities', icon: 'trim', key: 'T', tip: 'Trims a sketch entity to the closest intersection.', ...tool('trim') },
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
    equations: { label: 'Equations...', icon: 'options', tip: 'Manages global variables and the equations that drive dimensions.', run: () => app.equationsDialog() },
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
    motionreview: { label: 'Motion Review', icon: 'motionreview', tip: 'Drives each joint through its travel and checks for clashes, gaps and contacts that must touch.', run: () => app.review.open() },
    coupler: { label: 'Coupler', icon: 'coupler', tip: 'Mechanical mate: one part drives another by a motion law (a lever throws a tongue, a cam lifts a follower).', run: () => app.asm.couplerPM() },
    playback: { label: 'Assembly Playback', icon: 'playback', tip: 'Replays the assembly order: each component flies in and settles onto its mates (Motion Study).', run: () => app.asm.playSequence() },
    openpart: { label: 'Open Part', icon: 'open', tip: 'Opens the selected component\'s part for editing. Return to the assembly when done.', run: () => { const s = app.selection.find((x) => x.kind === 'component'); if (!s) return app.toast('Select a component first.'); app.asm.openPart(s.id); } },
    toolbox: { label: 'Toolbox', icon: 'toolbox', tip: 'Standard screws, nuts, washers and bearings, made to size.', run: () => app.openTask('library') },
    asmexplain: { label: 'Explain Assembly', icon: 'ai', tip: 'Asks the AI to explain the assembly and how it moves.', run: () => app.aiQuick('Explain this assembly: the parts, how they are mated and which components can still move. Do not change it.') },
    aimates: { label: 'Add Mates', icon: 'mate', tip: 'Asks the AI to mate an imported assembly from its geometry, leaving hinges and slides free.', run: () => app.aiQuick('This assembly has components without enough mates (for example it was imported from STEP). Call find_mate_candidates, then add the mates a designer would use so every part sits where it is now. Leave hinges, slides and wheels free to move where the product moves. Do not move or change parts.') },
    recognize: { label: 'Recognize Features', icon: 'featureworks', tip: 'FeatureWorks: turns an imported body into editable features (extrudes, cuts, revolves, holes, fillets, chamfers), each checked against the import.', run: () => app.featureworks.open() },
    airebuild: { label: 'Rebuild as Features', icon: 'imported', tip: 'Asks the AI to rebuild an imported body as an editable feature tree, starting from Recognize Features.', run: () => app.aiQuick('Rebuild the imported body as an editable feature tree. Call recognize_features first. If an imported body is left, replace it with sketches (relations and dimensions), extrudes, cuts and revolves using propose_features mode replace with the whole tree, and get the comparison with the import as close to zero as you can. Tell me what you could not match.') },
    asmfix: { label: 'Fix Mates', icon: 'mate', tip: 'Asks the AI to fix mate errors and interferences.', run: () => app.aiQuick('Fix the mate errors and any interferences in this assembly with minimal changes.') },

    // AI add-in
    ai: { label: 'OpenSketch AI', icon: 'ai', key: 'Ctrl+L', tip: 'Describe a part or a change, the AI proposes features you can accept or reject (Ctrl+L).', run: () => app.openTask('ai') },
    aiexplain: { label: 'Explain Model', icon: 'ai', tip: 'Asks the AI to explain the feature tree.', run: () => app.aiQuick('Explain this part and its design intent in a few sentences. Do not change it.') },
    aifix: { label: 'Fix Errors', icon: 'rebuild', tip: 'Asks the AI to fix rebuild errors.', run: () => app.aiQuick('Fix the rebuild errors in this part with minimal changes.') },
    aidefine: { label: 'Fully Define', icon: 'smartdim', tip: 'Asks the AI to add relations and dimensions so every sketch is fully defined.', run: () => app.aiQuick('Add relations and dimensions so every sketch is fully defined, keeping the current geometry.') },
  };
  for (const spec of Object.values(SPECS)) {
    if (spec.ui !== 'generated') continue; // hand-written commands above
    C[spec.command] = { label: spec.label, icon: spec.icon, tip: spec.summary, run: () => app.featureCommand(spec.type), doc: 'part' };
  }
  // Commands that belong to one kind of document. The Insert and Tools menus and command search offer them only
  // there, as SOLIDWORKS's menus differ between parts and assemblies.
  for (const id of PART_ONLY) if (C[id]) C[id].doc = 'part';
  for (const id of ASM_ONLY) if (C[id]) C[id].doc = 'asm';
  for (const [id, c] of Object.entries(C)) c.id = id;
  return C;
}

const PART_ONLY = ['extrude', 'revolve', 'sweep', 'loft', 'boundary', 'cut', 'hole', 'revcut', 'sweepcut', 'loftcut', 'boundarycut',
  'fillet', 'chamfer', 'linpattern', 'circpattern', 'mirror', 'rib', 'shell', 'wrap', 'intersect', 'refgeom', 'plane', 'curves', 'instant3d',
  'sketch', 'smartdim', 'line', 'centerline', 'rectangle', 'centerrect', 'slot', 'circle', 'arc', 'threeptarc', 'tangentarc', 'polygon',
  'spline', 'ellipse', 'sketchfillet', 'text', 'point', 'trim', 'convert', 'offset', 'sketchmirror', 'sketchpattern', 'move', 'relations',
  'addrelation', 'repair', 'quicksnaps', 'rapidsketch', 'instant2d', 'shadedsketch', 'equations', 'airebuild', 'aiexplain', 'aifix', 'aidefine'];
const ASM_ONLY = ['insertcomp', 'newpart', 'mate', 'coupler', 'movecomp', 'fixfloat', 'hidecomp', 'interference', 'motionreview', 'playback',
  'openpart', 'asmexplain', 'aimates', 'asmfix'];

/** The command belongs in this kind of document (no doc = both). */
export function availableIn(c, isAsm) { return !!c && (!c.doc || (c.doc === 'asm') === !!isAsm); }

// CommandManager tabs. big = large button, col = stacked small buttons, grid = small icon grid.
export const TABS = [
  { name: 'Features', items: [
    { big: 'extrude' }, { big: 'revolve' }, { col: ['sweep', 'loft', 'boundary'] }, '|',
    { big: 'cut' }, { big: 'hole' }, { big: 'revcut' }, { col: ['sweepcut', 'loftcut', 'boundarycut'] }, '|',
    { big: 'fillet', fly: ['fillet', 'chamfer'] }, { big: 'linpattern', fly: ['linpattern', 'circpattern', 'mirror'] },
    { col: ['rib', 'wrap'] }, { col: ['draft', 'intersect'] }, { col: ['shell', 'mirror'] }, '|',
    { big: 'refgeom', fly: ['plane'] }, { big: 'curves' }, { big: 'instant3d' }, '|', { big: 'recognize' },
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
    { big: 'insertcomp', fly: ['insertcomp', 'newpart'] }, { big: 'mate', fly: ['mate', 'coupler'] }, '|',
    { big: 'movecomp' }, { col: ['fixfloat', 'hidecomp', 'openpart'] }, '|',
    { big: 'interference' }, { big: 'playback' }, '|', { big: 'toolbox' }, { big: 'recognize' },
  ] },
  { name: 'Evaluate', items: [{ big: 'interference' }, { big: 'motionreview' }, { big: 'massprops' }, { big: 'section' }, { big: 'check' }, { big: 'stats' }] },
  { name: 'OpenSketch AI', items: [{ big: 'ai' }, { big: 'aimates' }, { big: 'asmexplain' }, { big: 'asmfix' }, '|', { big: 'connectclaude' }] },
];

export const QUICK = ['new', 'open', 'save', 'print', 'undo', 'redo', 'select', 'rebuild', 'fileprops', 'options'];

// items: command ids, '-', {head}, or {label, run(app), key, checked(app)}; a function (app) => items is built
// when the menu opens.
export const MENUS = [
  { name: 'File', items: ['new', 'open', 'openlocal', '-', 'save', 'saveas', 'serversave', 'sldmacro', '-', 'publishreview', 'connectclaude', '-', 'print', '-', 'fileprops'] },
  { name: 'Edit', items: ['undo', 'redo', '-', 'rebuild', '-', { label: 'Delete', run: (app) => app.menuDelete(), key: 'Del' }, { label: 'Suppress', run: (app) => app.suppressSelection(true) }, { label: 'Unsuppress', run: (app) => app.suppressSelection(false) }] },
  { name: 'View', items: [{ label: 'Planes', checked: (app) => app.view.planes, run: (app) => app.toggleView('planes') }, { label: 'Origins', checked: (app) => app.view.origins, run: (app) => app.toggleView('origins') }, { label: 'Sketches', checked: (app) => app.view.sketches, run: (app) => app.toggleView('sketches') }, { label: 'Sketch Relations', checked: (app) => app.view.relations, run: (app) => app.toggleView('relations') }, '-', { label: 'Zoom to Fit', run: (app) => app.viewer.zoomToFit(), key: 'F' }, '-', { head: 'Theme' }, ...LOOKS.map(([k, t]) => ({ label: t, role: 'menuitemradio', checked: () => LOOK === k, run: () => setLook(k) }))] },
  { name: 'Insert', items: ['insertcomp', 'newpart', 'mate', 'coupler', '-', 'extrude', 'revolve', 'sweep', 'loft', 'cut', 'revcut', 'sweepcut', 'loftcut', 'hole', '-', 'fillet', 'chamfer', 'shell', '-', 'linpattern', 'circpattern', 'mirror', '-', 'plane', '-', 'sketch', '-', { head: 'FeatureWorks' }, 'recognize'] },
  { name: 'Tools', items: ['line', 'centerline', 'rectangle', 'circle', 'arc', 'slot', 'polygon', 'point', '-', 'smartdim', 'addrelation', 'relations', '-', 'trim', 'convert', 'offset', 'sketchmirror', 'sketchfillet', '-', 'equations', '-', 'measure', 'massprops', 'motionreview', '-', 'options'] },
  // the open document (and, while a part is open from its assembly, the assembly to go back to)
  { name: 'Window', items: (app) => {
    const stack = app.docStack || [];
    const rows = stack.length
      ? [{ label: stack[stack.length - 1].doc.name || 'Assembly', role: 'menuitemradio', checked: false, run: () => app.asm.returnToAssembly() }, { label: app.doc.name || 'Part', role: 'menuitemradio', checked: true, run: () => {} }]
      : [{ label: app.doc.name || 'Untitled', role: 'menuitemradio', checked: true, run: () => {} }];
    return [...rows, '-', { label: 'Files...', run: () => app.files.open() }];
  } },
  { name: 'Help', items: [{ label: 'Keyboard Shortcuts', run: (app) => app.shortcutsDialog() }, { label: 'About OpenSketch', run: (app) => app.aboutDialog() }] },
];

// Registered features that have no place in the layout yet go next to Shell (ribbon) and after Shell
// (Insert menu).
for (const spec of Object.values(SPECS)) {
  if (spec.ui !== 'generated') continue;
  const id = spec.command;
  const placed = JSON.stringify(TABS[0].items).includes(`"${id}"`);
  if (!placed) TABS[0].items.splice(TABS[0].items.findIndex((it) => it.big === 'refgeom') - 1, 0, { big: id });
  const ins = MENUS.find((m) => m.name === 'Insert').items;
  if (!ins.includes(id)) ins.splice(ins.indexOf('shell') + 1, 0, id);
}
