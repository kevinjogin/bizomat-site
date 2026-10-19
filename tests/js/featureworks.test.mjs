import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="modal-layer"></div><div id="pm"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
window.innerWidth = 1280; window.innerHeight = 900;
const { FeatureWorks, describe, KINDS } = await import('../../opensketch/static/js/featureworks.js');
const { PropertyManager } = await import('../../opensketch/static/js/ui/pm.js');
const { buildCommands, MENUS, TABS, ASM_TABS } = await import('../../opensketch/static/js/commands.js');
const noop = () => {};

test('recognized features are described in plain words', () => {
  assert.equal(describe({ type: 'extrude', op: 'boss', end: 'midplane', depth: 12 }), 'boss, 12 mm, mid plane');
  assert.equal(describe({ type: 'extrude', op: 'cut', end: 'blind', depth: 3.25 }), 'cut, 3.25 mm');
  assert.equal(describe({ type: 'hole', diameter: 6, style: 'counterbore', bore_diameter: 10, end: 'through_all' }), '6 mm, counterbore 10 mm, through');
  assert.equal(describe({ type: 'hole', diameter: 5, style: 'simple', end: 'blind', depth: 7 }), '5 mm, 7 mm deep');
  assert.equal(describe({ type: 'fillet', radius: 0.4, edges: [{}, {}] }), 'radius 0.4 mm, 2 edges');
  assert.equal(describe({ type: 'chamfer', distance: 0.5, edges: [{}] }), '0.5 mm, 1 edge');
  assert.equal(describe({ type: 'import' }), 'not recognized, stays imported');
});

test('Recognize Features is in the ribbon, the Insert menu and the command list', () => {
  const app = { featureworks: { open: noop }, toast: noop };
  const C = buildCommands(app);
  assert.equal(C.recognize.label, 'Recognize Features');
  assert.ok(JSON.stringify(TABS[0].items).includes('"recognize"'));
  assert.ok(JSON.stringify(ASM_TABS[0].items).includes('"recognize"'));
  const ins = MENUS.find((m) => m.name === 'Insert').items;
  assert.deepEqual(ins.slice(-2), [{ head: 'FeatureWorks' }, 'recognize']);
});

function fakeApp(doc) {
  const app = {
    doc, reviewMode: false, mode: 'part', proposal: null, cmd: null, selection: [],
    get isAsm() { return this.doc.type === 'assembly'; },
    toasts: [], toast(msg) { this.toasts.push(msg); },
    showPanel: noop, pmCancel: noop, cleanDoc: (d) => JSON.parse(JSON.stringify(d)),
    calls: [], commits: [],
    async api(url, body, method = 'POST') {
      this.calls.push([method, url, body]);
      if (url === '/api/recognize/start') return { job: 'j1' };
      return { state: 'done', result: this.result };
    },
    commit(label, fn) { this.commits.push(label); fn(); },
  };
  app.pm = new PropertyManager(document.getElementById('pm'), app);
  return app;
}

const imported = { id: 'imp1', type: 'import', name: 'Imported1', data: 'x' };

test('a part: Recognize runs the job, OK replaces the import as one undo step', async () => {
  const app = fakeApp({ name: 'Plate', features: [imported], rollback: null });
  const fw = new FeatureWorks(app);
  app.result = { changed: ['part'], parts: { part: { message: 'Recognized 1 boss extrude.', exact: true, recognized: 1 } },
    updates: { part: { features: [{ id: 's', type: 'sketch', name: 'Sketch1' }, { id: 'e', type: 'extrude', name: 'Boss-Extrude1', op: 'boss', depth: 2 }], rollback: null } } };
  fw.open();
  assert.equal(app.pm.spec.title, 'FeatureWorks');
  assert.equal(app.pm.spec.okEnabled(), false);
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.deepEqual(app.calls[0][2].kinds, KINDS.map((k) => k[0]));
  assert.equal(app.calls[0][2].part_id, null);
  assert.equal(fw.st.phase, 'done');
  assert.ok(app.pm.spec.okEnabled());
  assert.match(fw.statusText(), /Click OK/);
  assert.ok(fw.resultItems().some((i) => i.label.includes('Boss-Extrude1')));
  assert.equal(app.cmd.onOk(), true);
  assert.deepEqual(app.commits, ['Recognize Features']);
  assert.deepEqual(app.doc.features.map((f) => f.name), ['Sketch1', 'Boss-Extrude1']);
});

test('the model changing during the job is caught before OK applies anything', async () => {
  const app = fakeApp({ name: 'Plate', features: [imported] });
  const fw = new FeatureWorks(app);
  app.result = { changed: ['part'], parts: { part: { message: 'ok' } }, updates: { part: { features: [], rollback: null } } };
  fw.open();
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  app.doc.features = [imported, { id: 'f9', type: 'fillet', name: 'Fillet1' }];
  assert.equal(app.cmd.onOk(), false);
  assert.equal(app.commits.length, 0);
});

test('an assembly: one part or all imported parts, names shown as text', async () => {
  const doc = { type: 'assembly', parts: { a: { name: '<b>A</b>', features: [imported] }, b: { name: 'B', features: [imported] }, c: { name: 'C', features: [] } },
    components: [{ id: 'c1', part: 'b' }] };
  const app = fakeApp(doc);
  const fw = new FeatureWorks(app);
  assert.deepEqual(fw.importedParts().map((p) => p.id), ['a', 'b']);
  app.selection = [{ kind: 'component', id: 'c1' }];
  app.result = { changed: ['b'], parts: { b: { name: 'B', message: 'Recognized 1 hole.', recognized: 1 } }, updates: { b: { features: [{ id: 'h', type: 'hole', name: 'Hole1', diameter: 5, end: 'through_all' }], rollback: null } } };
  fw.open();
  assert.equal(fw.st.scope, 'one');
  assert.equal(fw.st.partId, 'b');
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(app.calls[0][2].part_id, 'b');
  assert.equal(app.cmd.onOk(), true);
  assert.equal(app.doc.parts.b.features[0].type, 'hole');
  assert.equal(app.doc.parts.a.features[0].type, 'import');
  // "All parts" sends no part id; names in the list are escaped.
  app.selection = [];
  app.result = { changed: [], parts: { a: { name: '<b>A</b>', message: 'No features recognized.' } }, updates: {} };
  fw.open();
  assert.equal(fw.st.scope, 'all');
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(app.calls.at(-2)[2].part_id, null);
  assert.ok(fw.resultItems()[0].label.includes('&lt;b&gt;A&lt;/b&gt;'));
  assert.equal(app.pm.spec.okEnabled(), false);
});

test('nothing imported: a plain message, no PropertyManager', () => {
  const app = fakeApp({ name: 'Part1', features: [] });
  const fw = new FeatureWorks(app);
  fw.open();
  assert.equal(app.pm.spec, null);
  assert.ok(document.getElementById('modal-layer').textContent.includes('no imported body') || document.body.textContent.includes('no imported body'));
});

test('the preview colours each face by what it was recognised as, and Cancel puts the body colour back', async () => {
  const app = fakeApp({ name: 'Plate', features: [imported] });
  const faces = [{ userData: { data: { center: [1, 2, 3] }, baseColor: 7 } }, { userData: { data: { center: [9, 9, 9] }, baseColor: 7 } }];
  app.viewer = { faceObjs: faces, refreshed: 0, refreshHighlights() { this.refreshed++; } };
  app.bodyColor = () => 7;
  const fw = new FeatureWorks(app);
  app.result = { changed: ['part'], parts: { part: { message: 'ok', base: 'extrude', faces: { hole: [[1, 2, 3.00001]] } } },
    updates: { part: { features: [], rollback: null } } };
  fw.open();
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(faces[0].userData.baseColor, 0x5b8def);
  assert.equal(faces[1].userData.baseColor, 0x8fcf8f);
  assert.deepEqual([...fw.st.colored].sort(), ['base', 'hole']);
  app.cmd.onCancel();
  assert.equal(faces[0].userData.baseColor, 7);
  assert.equal(faces[1].userData.baseColor, 7);
});

test('a status request that fails once does not lose the job; a restarted server says so', async () => {
  const app = fakeApp({ name: 'Plate', features: [imported], rollback: null });
  const fw = new FeatureWorks(app);
  app.result = { changed: [], parts: { part: { message: 'No features recognized.' } }, updates: {} };
  let fails = 1;
  const real = app.api.bind(app);
  app.api = async (url, body, method = 'POST') => {
    if (method === 'GET' && fails-- > 0) { const e = new Error('The server did not answer'); e.away = true; throw e; }
    return real(url, body, method);
  };
  fw.open();
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(fw.st.phase, 'running');
  assert.match(fw.statusText(), /Waiting for the server/);
  await new Promise((r) => setTimeout(r, 1400));
  assert.equal(fw.st.phase, 'done');

  app.api = async (url, body, method = 'POST') => {
    if (method === 'GET') throw new Error('No such job');
    return real(url, body, method);
  };
  fw.open();
  await fw.run();
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(fw.st.phase, 'error');
  assert.match(fw.statusText(), /server restarted/);
});
