// Feature commands: each opens a PropertyManager laid out like the SOLIDWORKS one,
// previews live through the build123d backend, and commits a feature to the tree.

import { escapeHtml as esc } from './model-utils.js';

export const FEATURE_META = {
  extrude: { icon: 'extrude', base: 'Boss-Extrude', title: 'Boss-Extrude' },
  cut: { icon: 'cut', base: 'Cut-Extrude', title: 'Cut-Extrude' },
  revolve: { icon: 'revolve', base: 'Revolve', title: 'Revolve' },
  revcut: { icon: 'revcut', base: 'Cut-Revolve', title: 'Cut-Revolve' },
  sweep: { icon: 'sweep', base: 'Sweep', title: 'Swept Boss/Base' },
  sweepcut: { icon: 'sweepcut', base: 'Cut-Sweep', title: 'Swept Cut' },
  loft: { icon: 'loft', base: 'Loft', title: 'Lofted Boss/Base' },
  loftcut: { icon: 'loftcut', base: 'Cut-Loft', title: 'Lofted Cut' },
  hole: { icon: 'hole', base: 'Hole', title: 'Hole Wizard' },
  fillet: { icon: 'fillet', base: 'Fillet', title: 'Fillet' },
  chamfer: { icon: 'chamfer', base: 'Chamfer', title: 'Chamfer' },
  shell: { icon: 'shell', base: 'Shell', title: 'Shell' },
  mirror: { icon: 'mirror', base: 'Mirror', title: 'Mirror' },
  linear_pattern: { icon: 'linpattern', base: 'LPattern', title: 'Linear Pattern' },
  circular_pattern: { icon: 'circpattern', base: 'CirPattern', title: 'Circular Pattern' },
  plane: { icon: 'plane', base: 'Plane', title: 'Plane' },
  sketch: { icon: 'sketch_t', base: 'Sketch', title: 'Sketch' },
  import: { icon: 'imported', base: 'Imported', title: 'Imported' },
  standard: { icon: 'toolbox', base: 'Toolbox', title: 'Toolbox Part' },
};

// The feature registry from the server (opensketch/features): types without a hand-written
// PropertyManager below get a generated one, plus ribbon commands and defaults.
async function loadSpecs() {
  try { const r = await fetch('/api/features'); return r.ok ? await r.json() : {}; } catch (_) { return {}; }
}
export const SPECS = await loadSpecs();

export function metaFor(key) {
  if (FEATURE_META[key]) return FEATURE_META[key];
  const s = SPECS[key];
  return s ? { icon: s.icon, base: s.base, title: s.title } : { icon: 'props', base: key, title: key };
}

export function featureIcon(f) {
  if (f.type === 'extrude') return f.op === 'cut' ? 'cut' : 'extrude';
  if (f.type === 'revolve') return f.op === 'cut' ? 'revcut' : 'revolve';
  if (f.type === 'sweep' || f.type === 'loft') return f.type + (f.op === 'cut' ? 'cut' : '');
  if (f.type === 'sketch') return 'sketch_t';
  if (f.type === 'linear_pattern') return 'linpattern';
  if (f.type === 'circular_pattern') return 'circpattern';
  return FEATURE_META[f.type]?.icon || SPECS[f.type]?.icon || 'props';
}

export function metaKey(f) {
  if (f.type === 'extrude' && f.op === 'cut') return 'cut';
  if (f.type === 'revolve' && f.op === 'cut') return 'revcut';
  if (['sweep', 'loft'].includes(f.type) && f.op === 'cut') return f.type + 'cut';
  return f.type;
}

export function nextName(doc, base) {
  let n = 0;
  const re = new RegExp('^' + base.replace(/[-]/g, '\\-') + '(\\d+)$');
  for (const f of doc.features) { const m = re.exec(f.name || ''); if (m) n = Math.max(n, +m[1]); }
  return base + (n + 1);
}

const END_OPTS = [['blind', 'Blind'], ['through_all', 'Through All'], ['up_to_next', 'Up To Next'], ['midplane', 'Mid Plane']];
const fmt = (v) => (Math.round(v * 1000) / 1000).toString();
const v3s = (p) => `(${p.map((x) => fmt(x)).join(', ')})`;

// ---------------------------------------------------------------------------------------------
// state f is the feature JSON being edited. Each builder returns a PM spec plus onPick(pick).

function sketchName(app, id) { const s = app.featureById(id); return s ? s.name : id; }
const sketchLabel = (app, id) => esc(sketchName(app, id));

function sweepSpec(app, f) {
  return {
    sections: [{ title: 'Profile and Path', rows: [
      { type: 'selbox', id: 'profile', placeholder: 'Select a closed profile sketch', items: () => f.sketch ? [f.sketch] : [], label: (id) => sketchLabel(app, id), remove: () => { f.sketch = null; }, kinds: ['sketch'] },
      { type: 'selbox', id: 'path', placeholder: 'Select a path sketch', items: () => f.path ? [f.path] : [], label: (id) => sketchLabel(app, id), remove: () => { f.path = null; }, kinds: ['sketch'] },
      { type: 'text', text: 'One closed profile and one connected path. Select each sketch in the tree.' },
      { type: 'check', label: 'Merge result', get: () => f.merge !== false, set: (v) => { f.merge = v; }, visible: () => f.op !== 'cut' },
    ] }],
    activeSelbox: f.sketch ? 'path' : 'profile',
    okEnabled: () => !!f.sketch && !!f.path && f.sketch !== f.path,
    showSketch: () => f.sketch,
    onPick(p) {
      if (p.kind !== 'sketch') return false;
      if (app.pm.activeSelbox === 'path') f.path = p.id;
      else { f.sketch = p.id; app.pm.activeSelbox = 'path'; }
      return true;
    },
  };
}

function loftSpec(app, f) {
  return {
    sections: [{ title: 'Profiles', rows: [
      { type: 'selbox', id: 'profiles', placeholder: 'Select sketches in section order', items: () => f.profiles, label: (id, i) => `${i + 1}. ${sketchLabel(app, id)}`, remove: (i) => f.profiles.splice(i, 1), kinds: ['sketch'] },
      { type: 'text', text: 'At least two closed sections, without inner contours. Remove and reselect a section to change its order.' },
      { type: 'check', label: 'Ruled surfaces', get: () => !!f.ruled, set: (v) => { f.ruled = v; } },
      { type: 'check', label: 'Merge result', get: () => f.merge !== false, set: (v) => { f.merge = v; }, visible: () => f.op !== 'cut' },
    ] }],
    okEnabled: () => f.profiles.length >= 2,
    onPick(p) {
      if (p.kind !== 'sketch') return false;
      if (!f.profiles.includes(p.id)) f.profiles.push(p.id);
      return true;
    },
  };
}

function holeSpec(app, f) {
  const number = (key, label, min = 0.0001, visible) => ({ type: 'number', label, tip: label, min, visible, get: () => f[key], set: (v) => { f[key] = v; } });
  return {
    sections: [
      { title: 'Hole Type', rows: [
        { type: 'select', label: 'Type', options: [['simple', 'Simple hole'], ['counterbore', 'Counterbore'], ['countersink', 'Countersink']], get: () => f.style, set: (v) => { f.style = v; } },
        number('diameter', 'Diameter'),
        { type: 'select', label: 'End', options: [['blind', 'Blind'], ['through_all', 'Through All']], get: () => f.end, set: (v) => { f.end = v; } },
        number('depth', 'Depth', 0.0001, () => f.end === 'blind'),
        number('bore_diameter', 'Counterbore diameter', 0.0001, () => f.style === 'counterbore'),
        number('bore_depth', 'Counterbore depth', 0.0001, () => f.style === 'counterbore'),
        number('sink_diameter', 'Countersink diameter', 0.0001, () => f.style === 'countersink'),
        { ...number('sink_angle', 'Included angle', 0.1, () => f.style === 'countersink'), unit: 'deg', max: 179.9 },
        { type: 'text', text: 'Explicit dimensions; flat-bottom holes. Threads and fastener-standard presets are not included.' },
      ] },
      { title: 'Position', rows: [
        { type: 'selbox', id: 'plane', placeholder: 'Select a plane or planar face', items: () => f.plane ? [f.plane] : [], label: (p) => planeLabel(app, p), remove: () => { f.plane = null; }, kinds: ['plane', 'face'] },
        number('x', 'X on plane', -Infinity), number('y', 'Y on plane', -Infinity),
        { type: 'check', label: 'Reverse direction', get: () => !!f.reverse, set: (v) => { f.reverse = v; } },
        { type: 'text', text: 'X and Y use the selected plane origin. Pattern or mirror the hole to repeat it.' },
      ] },
    ],
    okEnabled: () => !!f.plane,
    onPick(p) { const plane = planeFromPick(app, p); if (!plane) return false; f.plane = plane; f.reverse = p.kind === 'face'; return true; },
  };
}

function extrudeSpec(app, f, cut) {
  f.draftOn ??= !!f.draft;
  const dir1Rows = [
    { type: 'select', options: END_OPTS, get: () => f.end || 'blind', set: (v) => { f.end = v; },
      before: [{ icon: 'reverse', title: 'Reverse Direction', get: () => !!f.reverse, toggle: () => { f.reverse = !f.reverse; } }] },
    { type: 'number', icon: 'depth', tip: 'Depth', get: () => f.depth, set: (v) => { f.depth = v; }, min: 0.0001, visible: () => (f.end || 'blind') === 'blind' || f.end === 'midplane' },
    { type: 'iconbtns', buttons: [{ icon: 'draft', title: 'Draft On/Off', get: () => !!f.draftOn, toggle: () => { f.draftOn = !f.draftOn; if (!f.draftOn) f.draft = 0; else f.draft = f.draft || 5; } }], label: 'Draft On/Off', visible: () => f.end !== 'up_to_next' },
    { type: 'number', icon: 'angle_i', unit: 'deg', get: () => f.draft || 0, set: (v) => { f.draft = v; }, min: 0, max: 89, visible: () => !!f.draftOn },
    { type: 'check', label: 'Draft outward', get: () => !!f.draft_outward, set: (v) => { f.draft_outward = v; }, visible: () => !!f.draftOn },
    { type: 'check', label: 'Flip side to cut', get: () => !!f.flip_side, set: (v) => { f.flip_side = v; }, visible: () => cut },
    { type: 'check', label: 'Merge result', get: () => f.merge !== false, set: (v) => { f.merge = v; }, visible: () => !cut },
  ];
  return {
    sections: [
      { title: 'From', rows: [
        { type: 'select', options: [['sketch', 'Sketch Plane']], get: () => 'sketch', set: () => {} },
        { type: 'selbox', id: 'sketch', placeholder: 'Select a sketch or a plane', items: () => (f.sketch ? [f.sketch] : []), label: (id) => sketchLabel(app, id), remove: () => { f.sketch = null; }, kinds: ['sketch', 'plane', 'face'] },
      ] },
      { title: 'Direction 1', rows: dir1Rows },
      { title: 'Direction 2', checkbox: { get: () => !!f.dir2, set: (v) => { f.dir2 = v ? { end: 'blind', depth: f.depth } : null; } }, visible: () => f.end !== 'midplane', rows: [
        { type: 'select', options: END_OPTS.slice(0, 2), get: () => f.dir2?.end || 'blind', set: (v) => { f.dir2.end = v; } },
        { type: 'number', icon: 'depth', get: () => f.dir2?.depth ?? 10, set: (v) => { f.dir2.depth = v; }, min: 0.0001, visible: () => f.dir2 && f.dir2.end === 'blind' },
      ] },
      { title: 'Thin Feature', checkbox: { get: () => false, set: () => app.toast('Thin Feature is not available yet.') }, rows: [] },
      { title: 'Selected Contours', collapsed: true, rows: [{ type: 'text', text: 'All closed contours of the sketch are used.' }] },
    ],
    okEnabled: () => !!f.sketch,
    onPick(p) {
      if (p.kind === 'sketch') { f.sketch = p.id; return true; }
      if (p.kind === 'plane' || (p.kind === 'face' && p.data && p.data.plane)) { app.sketchForFeature(p, cut ? 'cut' : 'extrude'); return 'handled'; }
      return false;
    },
  };
}

function revolveSpec(app, f, cut) {
  const autoAxis = () => {
    const sk = app.featureById(f.sketch);
    if (!sk || f.axis) return;
    const cls = sk.entities.filter((e) => e.type === 'line' && e.construction && !e.ref);
    if (cls.length === 1) f.axis = cls[0].id;
  };
  autoAxis();
  return {
    sections: [
      { title: 'Axis of Revolution', rows: [
        { type: 'selbox', id: 'axis', placeholder: 'Select a centerline or line', items: () => (f.axis ? [f.axis] : []), label: (id) => `Line@${sketchLabel(app, f.sketch)} (${esc(id)})`, remove: () => { f.axis = null; }, kinds: ['sketchline'] },
      ] },
      { title: 'Direction 1', rows: [
        { type: 'select', options: [['blind', 'Blind'], ['midplane', 'Mid-Plane']], get: () => f.end || 'blind', set: (v) => { f.end = v; },
          before: [{ icon: 'reverse', title: 'Reverse Direction', get: () => !!f.reverse, toggle: () => { f.reverse = !f.reverse; } }] },
        { type: 'number', icon: 'angle_i', unit: 'deg', get: () => f.angle, set: (v) => { f.angle = v; }, min: 0.001, max: 360 },
      ] },
      { title: 'Selected Contours', collapsed: true, rows: [
        { type: 'selbox', id: 'sketch', color: 2, placeholder: 'Select a sketch', items: () => (f.sketch ? [f.sketch] : []), label: (id) => sketchLabel(app, id), remove: () => { f.sketch = null; f.axis = null; }, kinds: ['sketch'] },
      ] },
    ],
    okEnabled: () => !!f.sketch && !!f.axis,
    onPick(p) {
      if (p.kind === 'sketchline' && (!f.sketch || p.sketch === f.sketch)) { f.sketch = p.sketch; f.axis = p.id; return true; }
      if (p.kind === 'sketch') { f.sketch = p.id; f.axis = null; autoAxis(); return true; }
      if (p.kind === 'plane' || (p.kind === 'face' && p.data && p.data.plane)) { app.sketchForFeature(p, cut ? 'revcut' : 'revolve'); return 'handled'; }
      return false;
    },
    showSketch: () => f.sketch,
  };
}

const edgeLabel = (e, i) => `Edge<${i + 1}>`;

function filletSpec(app, f, chamfer) {
  const rows = chamfer ? [
    { type: 'radio', name: 'chtype', options: [['angle_distance', 'Angle Distance'], ['distance_distance', 'Distance Distance']], get: () => f.mode || 'angle_distance', set: (v) => { f.mode = v; } },
  ] : [
    { type: 'radio', name: 'ftype', options: [['constant', 'Constant Size Fillet']], get: () => 'constant', set: () => {} },
  ];
  const params = chamfer ? [
    { type: 'number', icon: 'depth', tip: 'Distance', get: () => f.distance, set: (v) => { f.distance = v; }, min: 0.0001 },
    { type: 'number', icon: 'angle_i', unit: 'deg', get: () => f.angle ?? 45, set: (v) => { f.angle = v; }, min: 0.1, max: 89.9, visible: () => (f.mode || 'angle_distance') === 'angle_distance' },
    { type: 'number', icon: 'depth', tip: 'Distance 2', get: () => f.distance2 ?? f.distance, set: (v) => { f.distance2 = v; }, min: 0.0001, visible: () => f.mode === 'distance_distance' },
  ] : [
    { type: 'select', options: [['symmetric', 'Symmetric']], get: () => 'symmetric', set: () => {} },
    { type: 'number', icon: 'radius_i', tip: 'Radius', get: () => f.radius, set: (v) => { f.radius = v; }, min: 0.0001 },
  ];
  return {
    tabs: ['Manual', 'FilletXpert'],
    sections: [
      { title: chamfer ? 'Chamfer Type' : 'Fillet Type', rows },
      { title: chamfer ? 'Items To Chamfer' : 'Items To Fillet', rows: [
        { type: 'selbox', id: 'edges', placeholder: 'Select edges or faces', items: () => f.edges, label: edgeLabel, remove: (i) => f.edges.splice(i, 1), kinds: ['edge', 'face'] },
        { type: 'check', label: 'Tangent propagation', get: () => f.tangent !== false, set: (v) => { f.tangent = v; } },
        { type: 'check', label: 'Full preview', get: () => true, set: () => {} },
      ] },
      { title: chamfer ? 'Chamfer Parameters' : 'Fillet Parameters', rows: params },
    ],
    okEnabled: () => f.edges.length > 0,
    onPick(p) {
      const add = (ed) => {
        const i = f.edges.findIndex((x) => Math.hypot(...x.mid.map((c, k) => c - ed.mid[k])) < 1e-6);
        if (i >= 0) f.edges.splice(i, 1); else f.edges.push({ mid: ed.mid });
      };
      if (p.kind === 'edge') { add(p.data); return true; }
      if (p.kind === 'face') { for (const ei of p.data.edges || []) { const ed = app.edgeData(ei); if (ed) add(ed); } return true; }
      return false;
    },
    selectedKeys: () => app.edgeKeysFor(f.edges),
  };
}

function shellSpec(app, f) {
  return {
    sections: [
      { title: 'Parameters', rows: [
        { type: 'number', icon: 'thick_i', tip: 'Thickness', get: () => f.thickness, set: (v) => { f.thickness = v; }, min: 0.0001 },
        { type: 'selbox', id: 'faces', placeholder: 'Faces to Remove', items: () => f.faces, label: (x, i) => `Face<${i + 1}>`, remove: (i) => f.faces.splice(i, 1), kinds: ['face'] },
        { type: 'check', label: 'Shell outward', get: () => !!f.outward, set: (v) => { f.outward = v; } },
        { type: 'check', label: 'Show preview', get: () => true, set: () => {} },
      ] },
      { title: 'Multi-thickness Settings', collapsed: true, rows: [{ type: 'text', text: 'Not available yet.' }] },
    ],
    okEnabled: () => true,
    onPick(p) {
      if (p.kind !== 'face') return false;
      const c = p.data.center, n = p.data.normal;
      const i = f.faces.findIndex((x) => Math.hypot(...x.center.map((v, k) => v - c[k])) < 1e-6);
      if (i >= 0) f.faces.splice(i, 1); else f.faces.push({ center: c, ...(n ? { normal: n } : {}) });
      return true;
    },
    selectedKeys: () => app.faceKeysFor(f.faces),
  };
}

function planeLabel(app, spec) {
  if (!spec) return '';
  if (spec.ref) return esc(app.featureById(spec.ref)?.name || spec.ref);
  return 'Face ' + v3s(spec.origin);
}

function planeFromPick(app, p) {
  if (p.kind === 'plane') return { ref: p.id };
  if (p.kind === 'face' && p.data.plane) { const pl = p.data.plane; return { type: 'face', origin: pl.origin, normal: pl.normal, xdir: pl.xdir, ...(p.data.point ? { at: p.data.point } : {}) }; }
  return null;
}

const PATTERN_TYPES = ['extrude', 'revolve', 'sweep', 'loft', 'hole'];
function featureListRows(app, f, kinds = PATTERN_TYPES) {
  return { type: 'selbox', id: 'features', color: 2, placeholder: 'Select features in the tree', items: () => f.features, label: (id) => esc(app.featureById(id)?.name || id), remove: (i) => f.features.splice(i, 1), kinds: ['feature'], accepts: kinds };
}

function mirrorSpec(app, f) {
  return {
    sections: [
      { title: 'Mirror Face/Plane', rows: [{ type: 'selbox', id: 'plane', placeholder: 'Select a plane or planar face', items: () => (f.plane ? [f.plane] : []), label: (s) => planeLabel(app, s), remove: () => { f.plane = null; }, kinds: ['plane', 'face'] }] },
      { title: 'Features to Mirror', rows: [featureListRows(app, f), { type: 'text', text: 'Leave empty to mirror the whole body.' }] },
    ],
    okEnabled: () => !!f.plane,
    onPick(p) {
      if (p.kind === 'feature') { const ff = app.featureById(p.id); if (ff && PATTERN_TYPES.includes(ff.type) && !f.features.includes(p.id)) { f.features.push(p.id); return true; } return false; }
      const pl = planeFromPick(app, p);
      if (pl) { f.plane = pl; return true; }
      return false;
    },
  };
}

function directionLabel(d) { return typeof d === 'string' ? `${d} axis` : d.edge ? 'Edge ' + v3s(d.edge.mid) : 'Direction'; }

function linPatternSpec(app, f) {
  return {
    sections: [
      { title: 'Direction 1', rows: [
        { type: 'select', options: [['X', 'X axis'], ['Y', 'Y axis'], ['Z', 'Z axis'], ['edge', 'Edge (select)']], get: () => (typeof f.direction === 'string' ? f.direction : 'edge'), set: (v) => { if (v !== 'edge') f.direction = v; else app.pm.activeSelbox = 'dir'; },
          before: [{ icon: 'reverse', title: 'Reverse Direction', get: () => !!f.reverse, toggle: () => { f.reverse = !f.reverse; } }] },
        { type: 'selbox', id: 'dir', placeholder: 'Pattern Direction', items: () => [f.direction], label: directionLabel, remove: () => { f.direction = 'X'; }, kinds: ['edge'] },
        { type: 'number', icon: 'spacing_i', tip: 'Spacing', get: () => f.spacing, set: (v) => { f.spacing = v; }, min: 0.0001 },
        { type: 'number', icon: 'count_i', unit: '', int: true, tip: 'Number of Instances', get: () => f.count, set: (v) => { f.count = v; }, min: 1, max: 500 },
      ] },
      { title: 'Direction 2', checkbox: { get: () => !!f.direction2, set: (v) => { f.direction2 = v ? 'Z' : null; f.count2 = f.count2 || 2; f.spacing2 = f.spacing2 || f.spacing; } }, rows: [
        { type: 'select', options: [['X', 'X axis'], ['Y', 'Y axis'], ['Z', 'Z axis']], get: () => (typeof f.direction2 === 'string' ? f.direction2 : 'Z'), set: (v) => { f.direction2 = v; } },
        { type: 'number', icon: 'spacing_i', get: () => f.spacing2 ?? 10, set: (v) => { f.spacing2 = v; }, min: 0.0001 },
        { type: 'number', icon: 'count_i', unit: '', int: true, get: () => f.count2 ?? 2, set: (v) => { f.count2 = v; }, min: 1, max: 500 },
      ] },
      { title: 'Features and Faces', rows: [featureListRows(app, f)] },
    ],
    activeSelbox: 'features',
    okEnabled: () => f.features.length > 0,
    onPick(p) {
      if (p.kind === 'edge' && app.pm.activeSelbox === 'dir') { if (p.data.type === 'line') { f.direction = { edge: { mid: p.data.mid } }; app.pm.activeSelbox = 'features'; return true; } return false; }
      if (p.kind === 'feature') { const ff = app.featureById(p.id); if (ff && PATTERN_TYPES.includes(ff.type) && !f.features.includes(p.id)) { f.features.push(p.id); return true; } }
      return false;
    },
  };
}

function circPatternSpec(app, f) {
  return {
    sections: [
      { title: 'Direction 1', rows: [
        { type: 'select', options: [['X', 'X axis'], ['Y', 'Y axis'], ['Z', 'Z axis']], get: () => (typeof f.axis === 'string' ? f.axis : 'Y'), set: (v) => { f.axis = v; } },
        { type: 'radio', name: 'cpeq', options: [['eq', 'Equal spacing'], ['inst', 'Instance spacing']], get: () => (f.equal_spacing !== false ? 'eq' : 'inst'), set: (v) => { f.equal_spacing = v === 'eq'; } },
        { type: 'number', icon: 'angle_i', unit: 'deg', get: () => (f.equal_spacing !== false ? f.angle : f.step ?? 90), set: (v) => { if (f.equal_spacing !== false) f.angle = v; else f.step = v; }, min: 0.001, max: 360 },
        { type: 'number', icon: 'count_i', unit: '', int: true, get: () => f.count, set: (v) => { f.count = v; }, min: 1, max: 500 },
      ] },
      { title: 'Features and Faces', rows: [featureListRows(app, f)] },
    ],
    activeSelbox: 'features',
    okEnabled: () => f.features.length > 0,
    onPick(p) {
      if (p.kind === 'feature') { const ff = app.featureById(p.id); if (ff && PATTERN_TYPES.includes(ff.type) && !f.features.includes(p.id)) { f.features.push(p.id); return true; } }
      return false;
    },
  };
}

function planeSpec(app, f) {
  return {
    sections: [
      { title: 'First Reference', rows: [
        { type: 'selbox', id: 'base', placeholder: 'Select a plane or planar face', items: () => (f.base ? [f.base] : []), label: (s) => planeLabel(app, s), remove: () => { f.base = null; }, kinds: ['plane', 'face'] },
        { type: 'number', icon: 'depth', tip: 'Offset distance', get: () => f.offset, set: (v) => { f.offset = v; }, min: 0 },
        { type: 'check', label: 'Flip offset', get: () => !!f.flip, set: (v) => { f.flip = v; } },
      ] },
    ],
    okEnabled: () => !!f.base,
    onPick(p) { const pl = planeFromPick(app, p); if (pl) { f.base = pl; return true; } return false; },
  };
}

// ---------------------------------------------------------------------------------------------
// Generated PropertyManager for registry features (ui: "generated"): one row per parameter, grouped
// into the parameter's section, selection boxes routed by kind.

const SEL_KINDS = { plane: ['plane', 'face'], faces: ['face'], edges: ['edge', 'face'], features: ['feature'], sketch: ['sketch'] };
const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && !v.length);

function paramShown(spec, f, p) {
  if (!p.when) return true;
  return Object.entries(p.when).every(([k, want]) => {
    const q = spec.params.find((x) => x.name === k);
    const have = f[k] ?? q?.default;
    return Array.isArray(want) ? want.includes(have) : have === want;
  });
}

function toggleFace(list, d) {
  const c = d.center, n = d.normal;
  const i = list.findIndex((x) => Math.hypot(...x.center.map((v, k) => v - c[k])) < 1e-6);
  if (i >= 0) list.splice(i, 1); else list.push({ center: c, ...(n ? { normal: n } : {}) });
}

function toggleEdge(list, ed) {
  const i = list.findIndex((x) => Math.hypot(...x.mid.map((c, k) => c - ed.mid[k])) < 1e-6);
  if (i >= 0) list.splice(i, 1); else list.push({ mid: ed.mid });
}

function paramRow(app, spec, f, p) {
  const visible = () => paramShown(spec, f, p);
  const get = () => f[p.name] ?? p.omitted ?? p.default; // a left-out field shows what it builds
  const set = (v) => { f[p.name] = v; };
  const tip = p.label || p.doc || p.name;
  const list = () => (f[p.name] = f[p.name] || []);
  switch (p.kind) {
    case 'length': case 'number': case 'angle': case 'int':
      return { type: 'number', icon: p.icon || (p.kind === 'angle' ? 'angle_i' : p.kind === 'int' ? 'count_i' : 'depth'), tip,
        unit: p.kind === 'angle' ? 'deg' : p.kind === 'length' ? 'mm' : '', int: p.kind === 'int',
        get: () => get() ?? 0, set, min: p.min ?? undefined, max: p.max ?? undefined, visible };
    case 'bool':
      if (p.widget === 'toggle' && p.icon) return { type: 'iconbtns', buttons: [{ icon: p.icon, title: tip, get: () => !!get(), toggle: () => set(!get()) }], label: p.label || '', visible };
      return { type: 'check', label: tip, get: () => !!get(), set, visible };
    case 'enum':
      return p.widget === 'radio'
        ? { type: 'radio', name: `${spec.type}-${p.name}`, options: p.options, get, set, visible }
        : { type: 'select', options: p.options, get, set, visible, icon: p.icon || undefined };
    case 'axis':
      return { type: 'select', options: [['X', 'X axis'], ['Y', 'Y axis'], ['Z', 'Z axis']], get, set, visible };
    case 'plane':
      return { type: 'selbox', id: p.name, placeholder: p.label || 'Select a plane or planar face', items: () => (f[p.name] ? [f[p.name]] : []), label: (x) => planeLabel(app, x), remove: () => { f[p.name] = null; }, kinds: SEL_KINDS.plane, visible };
    case 'faces':
      return { type: 'selbox', id: p.name, placeholder: p.label || 'Select faces', items: list, label: (x, i) => `Face<${i + 1}>`, remove: (i) => list().splice(i, 1), kinds: SEL_KINDS.faces, visible };
    case 'edges':
      return { type: 'selbox', id: p.name, placeholder: p.label || 'Select edges or faces', items: list, label: edgeLabel, remove: (i) => list().splice(i, 1), kinds: SEL_KINDS.edges, visible };
    case 'features':
      return { type: 'selbox', id: p.name, color: 2, placeholder: p.label || 'Select features in the tree', items: list, label: (id) => app.featureById(id)?.name || id, remove: (i) => list().splice(i, 1), kinds: SEL_KINDS.features, visible };
    case 'sketch':
      return { type: 'selbox', id: p.name, placeholder: p.label || 'Select a sketch', items: () => (f[p.name] ? [f[p.name]] : []), label: (id) => sketchName(app, id), remove: () => { f[p.name] = null; }, kinds: SEL_KINDS.sketch, visible };
    default:
      return null; // string, direction, object, sketch_line: set by the AI or a hand-written PropertyManager
  }
}

function generatedSpec(app, spec, f) {
  const sections = [];
  const bySec = {};
  for (const p of spec.params) {
    const row = paramRow(app, spec, f, p);
    if (!row) continue;
    const t = p.section || spec.title;
    if (!bySec[t]) { bySec[t] = { title: t, rows: [] }; sections.push(bySec[t]); }
    bySec[t].rows.push(row);
  }
  const selParams = () => spec.params.filter((p) => SEL_KINDS[p.kind] && paramShown(spec, f, p));
  const accepts = (p, pick) => SEL_KINDS[p.kind].includes(pick.kind) && (p.kind !== 'plane' || pick.kind === 'plane' || !!pick.data?.plane);
  return {
    sections,
    okEnabled: () => spec.params.every((p) => !p.required || !paramShown(spec, f, p) || !isEmpty(f[p.name])),
    onPick(pick) {
      const ps = selParams().filter((p) => accepts(p, pick));
      const p = ps.find((q) => q.name === app.pm.activeSelbox) || ps.find((q) => isEmpty(f[q.name])) || ps[0];
      if (!p) return false;
      if (p.kind === 'plane') f[p.name] = planeFromPick(app, pick);
      else if (p.kind === 'sketch') f[p.name] = pick.id;
      else if (p.kind === 'features') { const l = (f[p.name] = f[p.name] || []); if (!l.includes(pick.id)) l.push(pick.id); }
      else if (p.kind === 'faces') toggleFace((f[p.name] = f[p.name] || []), pick.data);
      else if (pick.kind === 'edge') toggleEdge((f[p.name] = f[p.name] || []), pick.data);
      else for (const ei of pick.data.edges || []) { const ed = app.edgeData(ei); if (ed) toggleEdge((f[p.name] = f[p.name] || []), ed); }
      // a filled single selection hands over to the next empty box, as in SOLIDWORKS
      if (p.kind === 'plane' || p.kind === 'sketch') { const next = selParams().find((q) => q !== p && isEmpty(f[q.name])); if (next) app.pm.activeSelbox = next.name; }
      return true;
    },
    selectedKeys: () => spec.params.flatMap((p) => (p.kind === 'faces' ? app.faceKeysFor(f[p.name] || []) : p.kind === 'edges' ? app.edgeKeysFor(f[p.name] || []) : [])),
  };
}

function generatedDefaults(app, spec) {
  const sel = app.selection;
  const f = { type: spec.type, ...JSON.parse(JSON.stringify(spec.keys || {})) };
  const hasFaces = spec.params.some((p) => p.kind === 'faces');
  for (const p of spec.params) {
    if (p.default != null) f[p.name] = JSON.parse(JSON.stringify(p.default));
    if (p.kind === 'faces') f[p.name] = sel.filter((s) => s.kind === 'face').map((s) => ({ center: s.data.center, ...(s.data.normal ? { normal: s.data.normal } : {}) }));
    else if (p.kind === 'edges') f[p.name] = sel.filter((s) => s.kind === 'edge').map((s) => ({ mid: s.data.mid }));
    else if (p.kind === 'features') f[p.name] = sel.filter((s) => s.kind === 'feature').map((s) => s.id);
    else if (p.kind === 'sketch') f[p.name] = sel.find((s) => s.kind === 'sketch')?.id || app.lastSketchId();
    else if (p.kind === 'plane') { const s = sel.find((x) => x.kind === 'plane' || (!hasFaces && x.kind === 'face' && x.data.plane)); f[p.name] = s ? planeFromPick(app, s) : null; }
  }
  return f;
}

export function defaultsFor(key, app) {
  const sel = app.selection;
  const selSketch = sel.find((s) => s.kind === 'sketch')?.id || app.lastSketchId();
  switch (key) {
    case 'extrude': return { type: 'extrude', op: 'boss', sketch: selSketch, end: 'blind', depth: 10, merge: true };
    case 'cut': return { type: 'extrude', op: 'cut', sketch: selSketch, end: 'blind', depth: 10, reverse: app.featureById(selSketch)?.plane?.type === 'face' };
    case 'revolve': return { type: 'revolve', op: 'boss', sketch: selSketch, angle: 360, end: 'blind' };
    case 'revcut': return { type: 'revolve', op: 'cut', sketch: selSketch, angle: 360, end: 'blind' };
    case 'sweep': case 'sweepcut': return { type: 'sweep', op: key === 'sweepcut' ? 'cut' : 'boss', sketch: selSketch, path: null, merge: true };
    case 'loft': case 'loftcut': return { type: 'loft', op: key === 'loftcut' ? 'cut' : 'boss', profiles: [...new Set(sel.filter((s) => s.kind === 'sketch').map((s) => s.id))], ruled: false, merge: true };
    case 'hole': { const p = sel.find((s) => s.kind === 'plane' || (s.kind === 'face' && s.data?.plane)); return { type: 'hole', plane: p ? planeFromPick(app, p) : null, x: 0, y: 0, diameter: 5, depth: 10, end: 'through_all', reverse: p?.kind === 'face', style: 'simple', bore_diameter: 9, bore_depth: 3, sink_diameter: 10, sink_angle: 90 }; }
    case 'fillet': return { type: 'fillet', radius: 2, edges: sel.filter((s) => s.kind === 'edge').map((s) => ({ mid: s.data.mid })) };
    case 'chamfer': return { type: 'chamfer', distance: 1, angle: 45, mode: 'angle_distance', edges: sel.filter((s) => s.kind === 'edge').map((s) => ({ mid: s.data.mid })) };
    case 'shell': return { type: 'shell', thickness: 1, faces: sel.filter((s) => s.kind === 'face').map((s) => ({ center: s.data.center, ...(s.data.normal ? { normal: s.data.normal } : {}) })) };
    case 'mirror': return { type: 'mirror', plane: null, features: sel.filter((s) => s.kind === 'feature').map((s) => s.id) };
    case 'linear_pattern': return { type: 'linear_pattern', features: sel.filter((s) => s.kind === 'feature').map((s) => s.id), direction: 'X', count: 3, spacing: 20 };
    case 'circular_pattern': return { type: 'circular_pattern', features: sel.filter((s) => s.kind === 'feature').map((s) => s.id), axis: 'Y', count: 4, angle: 360, equal_spacing: true };
    case 'plane': return { type: 'plane', base: (() => { const p = sel.find((s) => s.kind === 'plane' || (s.kind === 'face' && s.data.plane)); return p ? planeFromPick(app, p) : null; })(), offset: 10 };
    default: return SPECS[key] ? generatedDefaults(app, SPECS[key]) : null;
  }
}

export function buildSpec(key, app, f) {
  switch (key) {
    case 'extrude': return extrudeSpec(app, f, false);
    case 'cut': return extrudeSpec(app, f, true);
    case 'revolve': return revolveSpec(app, f, false);
    case 'revcut': return revolveSpec(app, f, true);
    case 'sweep': case 'sweepcut': return sweepSpec(app, f);
    case 'loft': case 'loftcut': return loftSpec(app, f);
    case 'hole': return holeSpec(app, f);
    case 'fillet': return filletSpec(app, f, false);
    case 'chamfer': return filletSpec(app, f, true);
    case 'shell': return shellSpec(app, f);
    case 'mirror': return mirrorSpec(app, f);
    case 'linear_pattern': return linPatternSpec(app, f);
    case 'circular_pattern': return circPatternSpec(app, f);
    case 'plane': return planeSpec(app, f);
    default: return SPECS[key] ? generatedSpec(app, SPECS[key], f) : null;
  }
}

// Plain-language summary of a feature, used by the AI pane and tooltips.
export function describeFeature(f, app) {
  switch (f.type) {
    case 'sketch': return `${f.name}: ${f.entities.filter((e) => e.type !== 'point').length} entities, ${f.constraints.length} relations/dimensions`;
    case 'extrude': return `${f.name}: ${f.op === 'cut' ? 'cut' : 'extrude'} ${sketchName(app, f.sketch)} ${f.end === 'through_all' ? 'through all' : fmt(f.depth || 0) + ' mm'}`;
    case 'revolve': return `${f.name}: revolve ${sketchName(app, f.sketch)} ${fmt(f.angle)}°`;
    case 'sweep': return `${f.name}: ${f.op === 'cut' ? 'cut' : 'boss'} sweep along ${f.path}`;
    case 'loft': return `${f.name}: ${f.op === 'cut' ? 'cut' : 'boss'} loft through ${f.profiles.length} sections`;
    case 'hole': return `${f.name}: ${f.style || 'simple'} hole, diameter ${fmt(f.diameter)} mm`;
    case 'fillet': return `${f.name}: R${fmt(f.radius)} on ${f.edges.length} edge(s)`;
    case 'chamfer': return `${f.name}: ${fmt(f.distance)} mm on ${f.edges.length} edge(s)`;
    case 'shell': return `${f.name}: ${fmt(f.thickness)} mm, ${f.faces.length} face(s) removed`;
    case 'import': return `${f.name}: imported body${f.source ? ' from ' + f.source : ''}`;
    case 'standard': return `${f.name}: ${f.kind.replace(/_/g, ' ')} ${f.size}${f.length ? ' x ' + fmt(f.length) : ''}`;
    default: {
      const spec = SPECS[f.type];
      if (!spec) return f.name;
      const bits = spec.params.filter((p) => paramShown(spec, f, p) && f[p.name] != null).map((p) => {
        const v = f[p.name];
        if (p.kind === 'angle') return `${fmt(v)}°`;
        if (p.kind === 'length') return `${fmt(v)} mm`;
        if (Array.isArray(v) && v.length) return `${v.length} ${p.kind === 'features' ? 'feature' : p.kind.replace(/s$/, '')}(s)`;
        return null;
      }).filter(Boolean);
      return `${f.name}: ${spec.title.toLowerCase()}${bits.length ? ' ' + bits.join(', ') : ''}`;
    }
  }
}
