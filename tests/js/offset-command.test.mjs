import test from 'node:test';
import assert from 'node:assert/strict';
import { startOffset } from '../../opensketch/static/js/sketch/offset-command.js';

function fixture(selected = []) {
  const calls = { prepare: [], commits: [], renders: 0, panelRenders: 0, feedbackUpdates: 0, cancels: 0, undo: 0, changes: 0, toasts: [] };
  const entities = [
    { id: 'a', type: 'line' }, { id: 'b', type: 'line' }, { id: 'c', type: 'line' },
    { id: 'circle', type: 'circle' }, { id: 'point', type: 'point' },
  ];
  const app = {
    mode: 'sketch', cmd: null,
    toast: (message) => calls.toasts.push(message),
    showSelBox: (box) => { calls.selectionBox = box; },
    pmCancel() { calls.cancels++; this.cmd?.onClose?.(); this.cmd = null; },
    pm: {
      spec: null,
      open(spec) { this.spec = spec; this.render(); },
      render() { calls.panelRenders++; this.input = {}; this.ok = { click: () => app.cmd.onOk() }; },
      refreshFeedback() { calls.feedbackUpdates++; },
    },
    sketcher: {
      sel: new Set(selected), tool: { name: 'rectangle', stage: 1 }, drag: { id: 'a' }, box: { x0: 1 },
      ent(id) { return entities.find((e) => e.id === id); },
      setTool(tool) { this.tool = tool; calls.stoppedTool = tool === null; },
      clearModelSel() { calls.clearedModelSelection = true; },
      render() { calls.renders++; },
      prepareOffset(distance, options) {
        calls.prepare.push({ distance, options });
        if (this.failPrepare) throw new Error(this.failPrepare);
        const selectedIds = [...this.sel].filter((id) => this.ent(id)?.type !== 'point');
        if (!selectedIds.length) throw new Error('Select sketch entities to offset.');
        if (options.chain && selectedIds.includes('a')) selectedIds.push(...['b', 'c'].filter((id) => !selectedIds.includes(id)));
        return { selectedIds, distance, options };
      },
      offsetSelection(distance, options) {
        calls.commits.push({ distance, options });
        if (this.failCommit) return false;
        calls.undo++; calls.changes++;
        return true;
      },
    },
  };
  const row = (label) => app.pm.spec.sections.flatMap((s) => s.rows).find((r) => r.label === label);
  const change = (label, value) => { row(label).set(value); app.pm.spec.onChange(); };
  return { app, calls, row, change };
}

test('preselection previews expanded chains and stops pending drawing without editing', () => {
  const { app, calls, row } = fixture(['a']);
  const command = startOffset(app);
  assert.equal(app.cmd, command);
  assert.equal(command.sketchSelectionOnly, true);
  assert.equal(app.pm.spec.title, 'Offset Entities');
  assert.equal(app.pm.spec.okEnabled(), true);
  assert.equal(row('Selected curves').get(), 3);
  assert.equal(row('Select chain').get(), true);
  assert.deepEqual([...app.sketcher.sel], ['a']);
  assert.equal(app.sketcher.tool, null);
  assert.equal(app.sketcher.drag, null);
  assert.equal(app.sketcher.box, null);
  assert.equal(calls.selectionBox, null);
  assert.equal(calls.clearedModelSelection, true);
  assert.equal(calls.undo, 0);
  assert.equal(calls.changes, 0);
  assert.equal(app.sketcher.offsetPreview.distance, 5);
});

test('postselection keeps controls and transitions from invalid to valid', () => {
  const { app, calls, row, change } = fixture();
  const command = startOffset(app), spec = app.pm.spec;
  assert.equal(spec.okEnabled(), false);
  assert.match(spec.error, /Select sketch entities/);
  assert.equal(command.onOk(), false);
  assert.equal(calls.commits.length, 0);
  change('Distance', 2.5);
  app.sketcher.sel.add('circle');
  command.onSketchSelection();
  assert.equal(app.pm.spec, spec);
  assert.equal(spec.error, '');
  assert.equal(spec.okEnabled(), true);
  assert.equal(row('Distance').get(), 2.5);
  assert.equal(row('Selected curves').get(), 1);
  assert.equal(app.sketcher.offsetPreview.distance, 2.5);
});

test('committed distance, reverse and chain settings drive preview and commit together', () => {
  const { app, calls, row, change } = fixture(['a']);
  const command = startOffset(app);
  const previousRenders = calls.panelRenders;
  row('Distance').set(3);
  assert.equal(calls.panelRenders, previousRenders, 'a pending field value must not recreate the form');
  app.pm.spec.onChange();
  change('Reverse', true);
  change('Select chain', false);
  assert.equal(row('Selected curves').get(), 1);
  assert.equal(app.sketcher.offsetPreview.distance, -3);
  assert.deepEqual(app.sketcher.offsetPreview.options, { chain: false });
  assert.equal(command.onOk(), true);
  assert.deepEqual(calls.commits, [{ distance: -3, options: { chain: false } }]);
  assert.equal(calls.undo, 1);
  assert.equal(calls.changes, 1);
});

test('committing Distance on blur preserves the existing OK button for the pending click', () => {
  const { app, calls, row } = fixture(['circle']);
  startOffset(app);
  const input = app.pm.input, ok = app.pm.ok, renders = calls.panelRenders;
  // Clicking OK first blurs the input, which commits Distance and calls onChange.
  row('Distance').set(2);
  app.pm.spec.onChange();
  assert.equal(app.pm.input, input);
  assert.equal(app.pm.ok, ok);
  assert.equal(calls.panelRenders, renders);
  assert.equal(calls.feedbackUpdates, 1);
  assert.equal(app.sketcher.offsetPreview.distance, 2);
  assert.equal(ok.click(), true);
  assert.deepEqual(calls.commits, [{ distance: 2, options: { chain: true } }]);
});

test('invalid geometry and nonpositive distances clear preview and leave the command open', () => {
  const { app, calls, change } = fixture(['circle']);
  const command = startOffset(app);
  app.sketcher.failPrepare = 'The inward offset collapses the circle.';
  change('Reverse', true);
  assert.equal(app.sketcher.offsetPreview, null);
  assert.equal(app.pm.spec.okEnabled(), false);
  assert.match(app.pm.spec.error, /collapses/);
  assert.equal(command.onOk(), false);
  assert.equal(app.cmd, command);
  assert.equal(calls.commits.length, 0);
  delete app.sketcher.failPrepare;
  for (const value of [0, -1, NaN, Infinity]) {
    change('Distance', value);
    assert.equal(app.pm.spec.okEnabled(), false);
    assert.match(app.pm.spec.error, /greater than zero/);
    assert.equal(command.onOk(), false);
  }
  change('Distance', 1);
  assert.equal(app.pm.spec.okEnabled(), true);
  assert.equal(calls.undo, 0);
});

test('failed commit preserves command and reports the failure inline', () => {
  const { app, calls } = fixture(['circle']);
  const command = startOffset(app);
  app.sketcher.failCommit = true;
  assert.equal(command.onOk(), false);
  assert.equal(app.cmd, command);
  assert.match(app.pm.spec.error, /could not be created/);
  assert.equal(calls.undo, 0);
  assert.equal(calls.changes, 0);
  app.sketcher.failCommit = false;
  assert.equal(command.onOk(), true);
});

test('closing or cancelling clears preview without changing geometry or selection', () => {
  const { app, calls } = fixture(['circle']);
  const command = startOffset(app);
  app.pmCancel();
  assert.equal(app.sketcher.offsetPreview, null);
  assert.deepEqual([...app.sketcher.sel], ['circle']);
  assert.equal(calls.undo, 0);
  assert.equal(calls.changes, 0);
  const renders = calls.renders;
  command.onSketchSelection();
  assert.equal(calls.renders, renders, 'a stale callback cannot recreate a closed preview');
  assert.equal(command.onOk(), false);
  assert.equal(calls.commits.length, 0);
});

test('replacing a command preserves preselection even if old cleanup changes selection', () => {
  const { app, calls } = fixture(['circle']);
  app.cmd = { onClose: () => app.sketcher.sel.clear() };
  startOffset(app);
  assert.equal(calls.cancels, 1);
  assert.deepEqual([...app.sketcher.sel], ['circle']);
  assert.equal(app.pm.spec.okEnabled(), true);
});

test('errors are escaped for PropertyManager HTML rendering', () => {
  const { app } = fixture(['circle']);
  app.sketcher.failPrepare = 'Unsupported entity <script> & "curve"';
  startOffset(app);
  assert.equal(app.pm.spec.error, 'Unsupported entity &lt;script&gt; &amp; &quot;curve&quot;');
});

test('starting outside sketch mode is harmless', () => {
  const { app, calls } = fixture(['circle']);
  app.mode = 'part';
  assert.equal(startOffset(app), false);
  assert.equal(app.cmd, null);
  assert.equal(app.pm.spec, null);
  assert.equal(calls.prepare.length, 0);
  assert.match(calls.toasts[0], /Edit a sketch/);
});
