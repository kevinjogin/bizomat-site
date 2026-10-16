// Offset command state is separate from generic sketch-property selection.
// Preparing a preview never edits the sketch or creates an undo entry.

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function startOffset(app) {
  if (app.mode !== 'sketch') {
    app.toast('Edit a sketch and select entities to offset.');
    return false;
  }

  const sk = app.sketcher;
  const selection = new Set(sk.sel);
  if (app.cmd) app.pmCancel();
  sk.sel = selection;
  sk.clearModelSel();
  sk.drag = null;
  sk.box = null;
  app.showSelBox(null);
  sk.setTool(null);

  let distance = 5, reverse = false, chain = true;
  let plan = null, error = '', selectedCount = 0, closed = false;
  const signedDistance = () => reverse ? -distance : distance;
  const reportError = (err) => { error = err instanceof Error ? err.message : String(err); };

  const refresh = (renderPanel = true) => {
    if (closed) return false;
    plan = null;
    error = '';
    selectedCount = [...sk.sel].filter((id) => ['line', 'circle', 'arc'].includes(sk.ent(id)?.type)).length;
    try {
      if (!Number.isFinite(distance) || distance <= 0) throw new Error('Enter a distance greater than zero.');
      plan = sk.prepareOffset(signedDistance(), { chain });
      if (!plan) throw new Error('Select sketch entities to offset.');
      if (plan.selectedIds) selectedCount = Array.from(plan.selectedIds).length;
    } catch (err) { reportError(err); }
    sk.offsetPreview = plan;
    spec.error = error ? escapeHtml(error) : '';
    sk.render();
    if (renderPanel) app.pm.render();
    return !!plan && !error;
  };

  const spec = {
    title: 'Offset Entities', icon: 'offset',
    message: 'Select sketch entities. Hold Ctrl or Shift to add or remove selections.',
    okEnabled: () => !!plan && !error,
    // Keep the Distance input and OK button in place when blur commits a value;
    // otherwise clicking OK straight from the input can lose the click.
    onChange: () => { refresh(false); app.pm.refreshFeedback(); },
    sections: [{ title: 'Parameters', rows: [
      { type: 'number', label: 'Distance', icon: 'depth', unit: 'mm', min: 0.0001, get: () => distance, set: (v) => { distance = v; } },
      { type: 'check', label: 'Reverse', get: () => reverse, set: (v) => { reverse = v; } },
      { type: 'check', label: 'Select chain', get: () => chain, set: (v) => { chain = v; } },
      { type: 'value', label: 'Selected curves', get: () => selectedCount },
    ] }],
  };

  const command = {
    sketchSelectionOnly: true,
    onSketchSelection: () => refresh(),
    onOk: () => {
      if (!refresh(false)) { app.pm.render(); return false; }
      try {
        if (sk.offsetSelection(signedDistance(), { chain }) === true) return true;
        error = 'The offset could not be created. Review the selection and distance.';
      } catch (err) { reportError(err); }
      spec.error = escapeHtml(error);
      app.pm.render();
      return false;
    },
    onClose: () => {
      closed = true;
      sk.offsetPreview = null;
      sk.render();
    },
  };
  app.cmd = command;
  refresh(false);
  app.pm.open(spec);
  return command;
}
