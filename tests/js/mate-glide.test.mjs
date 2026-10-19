// Mates glide into place (main's PR #8) merged with the audit branch: the glide flag goes only to the redraw of a mate
// that was really committed, a waiting AI change never swallows a mate, a glide or playback never leaves parts
// part-way, and Motion Review survives an undo back to a part and a change of file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML(`<html><body><div id="modal-layer"></div><div id="confirmcorner" class="confirmcorner hidden"></div>
  <div id="pm"></div></body></html>`);
globalThis.window = window;
globalThis.document = document;
globalThis.requestAnimationFrame ??= (f) => setTimeout(() => f(performance.now()), 16);
globalThis.cancelAnimationFrame ??= (id) => clearTimeout(id);
const THREE = await import('three');
const { App } = await import('../../opensketch/static/js/app.js');
const { PropertyManager } = await import('../../opensketch/static/js/ui/pm.js');
const { AssemblyMode } = await import('../../opensketch/static/js/asm.js');
const { MotionReview } = await import('../../opensketch/static/js/review.js');
const { Viewer } = await import('../../opensketch/static/js/viewer.js');
const noop = () => {};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clone = (x) => JSON.parse(JSON.stringify(x));

const ref = (component, z) => ({ component, plane: { origin: [0, 0, z], normal: [0, 0, 1] } });
function assemblyDoc() {
  return { type: 'assembly', name: 'Lock', parts: {}, components: [{ id: 'c1', name: 'Case<1>', part: 'p1', fixed: true }, { id: 'c2', name: 'Lever<1>', part: 'p2' }],
    mates: [{ id: 'm1', name: 'Coincident1', type: 'coincident', align: 'auto', refs: [ref('c1', 0), ref('c2', 5)] }] };
}

// An editor with the real App and AssemblyMode code paths for commands, commits and proposals; the rebuild is
// recorded instead of run (it reports whether the mate's glide reached it, as asm.regen does).
function editor() {
  const app = Object.create(App.prototype);
  Object.assign(app, { doc: assemblyDoc(), proposal: null, mode: 'part', selection: [], undoStack: [], redoStack: [], toasts: [], regens: [],
    taskpane: { busy: false }, viewer: { setTool: noop }, tree: { render: noop }, design: null,
    docChanged: noop, status: noop, showPanel: noop, refreshSelectionDisplay: noop, updateStartHint: noop, syncDocTabs: noop, setSelection: noop });
  app.toast = (t) => app.toasts.push(t);
  app.cleanDoc = (d) => clone(d);
  app.pushUndo = () => app.settleProposal(); // as the real one: a waiting AI change is kept before the snapshot
  app.acceptProposal = () => { app.doc = app.proposal; app.proposal = null; return true; };
  app.regen = () => { app.regens.push(!!app.asm.glideNext); app.asm.glideNext = false; };
  app.pm = new PropertyManager(document.getElementById('pm'), app);
  app.asm = new AssemblyMode(app);
  app.asm.regen = async () => { app.asm.glideNext = false; return null; }; // Cancel's redraw: nothing to draw here
  return app;
}

test('a mate OK refused because the AI is building leaves no glide behind for a later redraw', () => {
  const app = editor();
  app.asm.matePM(app.doc.mates[0]);
  app.taskpane.busy = true;
  app.cmd.onOk();
  assert.match(app.toasts.at(-1), /AI is building/);
  assert.deepEqual(app.regens, []);
  assert.ok(!app.asm.glideNext, 'the next undo or rebuild must not animate');
  app.closeCommand();
  app.taskpane.busy = false;
  app.asm.matePM(app.doc.mates[0]);
  app.cmd.onOk();
  assert.deepEqual(app.regens, [true], 'a committed mate glides, in its own rebuild');
  app.closeCommand();
});

test('an AI change that arrives while the Mate PropertyManager is open is kept, and the mate goes into it', () => {
  const app = editor();
  const before = app.doc, original = before.mates[0];
  app.asm.matePM(before.mates[0]);
  const proposal = clone(before); proposal.components.push({ id: 'c3', name: 'Tongue<1>', part: 'p3' });
  const theirs = proposal.mates[0];
  app.proposal = proposal; // the AI finished meanwhile
  app.cmd.onOk();
  assert.equal(app.doc, proposal, "the AI's change was kept");
  assert.equal(before.mates[0], original, 'nothing was written into the replaced document');
  assert.notEqual(proposal.mates[0], theirs, 'the edited mate is in the document on screen');
  assert.equal(proposal.mates[0].id, 'm1');
  assert.equal(app.doc.components.length, 3);
  assert.deepEqual(app.regens, [true]);
  app.closeCommand();
});

test('opening the Mate PropertyManager keeps a waiting AI change first, as feature commands do', () => {
  const app = editor();
  const proposal = clone(app.doc); proposal.mates = [];
  app.proposal = proposal;
  app.asm.hingePM();
  assert.equal(app.doc, proposal);
  assert.equal(app.proposal, null);
  app.closeCommand();
});

test('a mate preview still waiting when OK clears the selections does not run', async () => {
  const app = editor();
  const m = clone(app.doc.mates[0]);
  app.cmd = { key: 'mate' };
  let previews = 0;
  app.asm.regen = async () => { previews++; return null; };
  app.asm.previewMate(m, null);
  m.refs = []; // OK committed the mate and cleared the boxes for the next one
  await wait(120);
  assert.equal(previews, 0);
});

test('undo back to a part with Motion Review open closes the review instead of leaving the PropertyManager stuck', () => {
  const app = editor();
  app.review = new MotionReview(app);
  app.asm.res = { components: [{ id: 'c1', part: 'p1', matrix: new THREE.Matrix4().elements }], parts: {} };
  app.doc = { features: [], rollback: null }; // what the undo put back
  app.cmd = { key: 'motionreview', onClose: () => app.review.close() };
  assert.doesNotThrow(() => app.closeCommand());
  assert.equal(app.cmd, null);
  assert.doesNotThrow(() => app.asm.draw(app.asm.res, app.doc), 'an assembly result is never drawn over a part');
  // and a command whose close does throw still lets go of the PropertyManager
  app.cmd = { key: 'x', onClose: () => { throw new Error('gone'); } };
  const err = console.error; console.error = noop;
  try { app.closeCommand(); } finally { console.error = err; }
  assert.equal(app.cmd, null);
});

test('Motion Review waits for a pending AI change, and another file starts with no checks', async () => {
  const app = editor();
  app.review = new MotionReview(app);
  app.proposal = clone(app.doc);
  await app.review.open();
  assert.match(app.toasts.at(-1), /Accept or reject the AI change first/);
  assert.equal(app.cmd ?? null, null);
  app.proposal = null;
  app.review.checks = { checks: [{ kind: 'clash' }], names: { c9: 'Other<1>' } };
  app.review.checkedText = '{}';
  app.rejectProposal = noop;
  app.leaveDocument();
  assert.equal(app.review.checks, null, "another file's clashes are never shown");
  assert.equal(app.review.checkedText, null);
});

test('a newer draw stops a playback in progress', () => {
  const app = editor();
  app.viewer = { setTool: noop, setAssembly: noop, clearGroup: noop };
  app.asm.playing = true;
  app.asm.playCtl = new AbortController();
  app.asm.draw({ components: [], parts: {} }, app.doc);
  assert.ok(app.asm.playCtl.signal.aborted);
});

test('a glide that is cut short ends with every part at its new place, and its old frames never come back', async () => {
  const v = Object.create(Viewer.prototype);
  const g = new THREE.Group(); g.matrixAutoUpdate = false;
  g.userData = { inst: { pm: { center: new THREE.Vector3(5, 0, 0) } } };
  Object.assign(v, { compGroups: new Map([['c2', g]]), bodyGroup: new THREE.Group(), clipPlane: null, requestRender: noop, glideRun: null });
  const was = new Map([['c2', new THREE.Matrix4()]]);
  g.matrix.makeTranslation(40, 0, 25); // where the mate puts it
  v.glideFrom(was, 450);
  assert.ok(new THREE.Vector3().setFromMatrixPosition(g.matrix).x < 1, 'the glide starts from where the part was');
  v.finishGlide(); // a Files picture or a playback asks for the real poses
  const at = () => new THREE.Vector3().setFromMatrixPosition(g.matrix).toArray();
  assert.deepEqual(at(), [40, 0, 25]);
  assert.equal(v.glideRun, null);
  await wait(60);
  assert.deepEqual(at(), [40, 0, 25], 'a stopped glide writes no more frames');
});
