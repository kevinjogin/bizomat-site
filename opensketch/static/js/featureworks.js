// FeatureWorks (Insert > FeatureWorks > Recognize Features, or right-click Imported1): an imported body
// becomes editable features. The server does the recognition as a background job (recognize.py: fillets,
// chamfers and holes come off first, then the base is read as extrudes and cuts or a revolve, every step
// checked against the import); this is the PropertyManager around it. OK applies the result as one undo step.

import { escapeHtml as esc } from './model-utils.js';
import { featureIcon } from './features.js';
import { message } from './ui/dialogs.js';

export const KINDS = [['extrudes', 'Extrudes'], ['revolves', 'Revolves'], ['holes', 'Holes'], ['fillets', 'Fillets'], ['chamfers', 'Chamfers']];

// Preview colours on the imported body once recognition is done (part documents): what each face becomes.
export const PREVIEW = [['base', 0x8fcf8f, 'Extrude or revolve'], ['hole', 0x5b8def, 'Hole'], ['fillet', 0xf2c230, 'Fillet'],
  ['chamfer', 0xf08a3c, 'Chamfer']];
const hex = (c) => '#' + c.toString(16).padStart(6, '0');

const hasImport = (part) => (part?.features || []).some((f) => f.type === 'import');
const num = (v) => (v == null ? '' : String(+(+v).toFixed(3)));

// One line saying what a recognised feature is, for the results list.
export function describe(f) {
  switch (f.type) {
    case 'extrude': {
      const how = f.end === 'through_all' ? 'through all' : `${num(f.depth)} mm${f.end === 'midplane' ? ', mid plane' : ''}`;
      return `${f.op === 'cut' ? 'cut' : 'boss'}, ${how}`;
    }
    case 'revolve': return `${num(f.angle ?? 360)} deg`;
    case 'hole': {
      const kind = f.style === 'counterbore' ? `, counterbore ${num(f.bore_diameter)} mm` : f.style === 'countersink' ? `, countersink ${num(f.sink_diameter)} mm` : '';
      return `${num(f.diameter)} mm${kind}, ${f.end === 'through_all' ? 'through' : `${num(f.depth)} mm deep`}`;
    }
    case 'fillet': return `radius ${num(f.radius)} mm, ${(f.edges || []).length} edge${(f.edges || []).length === 1 ? '' : 's'}`;
    case 'chamfer': return `${num(f.distance)}${f.distance2 != null ? ` x ${num(f.distance2)}` : ''} mm, ${(f.edges || []).length} edge${(f.edges || []).length === 1 ? '' : 's'}`;
    case 'linear_pattern': return `${f.count} x ${num(f.spacing)} mm`;
    case 'import': return 'not recognized, stays imported';
    case 'plane': return `offset ${num(f.offset)} mm`;
    default: return '';
  }
}

export class FeatureWorks {
  constructor(app) {
    this.app = app;
    this.kinds = new Set(KINDS.map((k) => k[0]));
    this.st = null;
  }

  // Parts of the open document that still have an imported body: [{id, name}] ('part' for a part document).
  importedParts(doc = this.app.doc) {
    if (doc?.type !== 'assembly') return hasImport(doc) ? [{ id: 'part', name: doc.name || 'Part' }] : [];
    return Object.entries(doc.parts || {}).filter(([, p]) => hasImport(p)).map(([id, p]) => ({ id, name: p.name || id }));
  }

  // After a STEP import: offer recognition without getting in the way (SOLIDWORKS asks here too).
  offer() {
    const app = this.app;
    const parts = this.importedParts();
    if (!parts.length || app.reviewMode) return;
    const what = app.isAsm ? `${parts.length} imported part${parts.length === 1 ? '' : 's'}` : 'This imported body';
    app.toast(`${what} ha${parts.length === 1 && !app.isAsm ? 's' : 've'} no feature history. Recognize features?`, 12000,
      { label: 'Recognize', run: () => this.open({ auto: true }) });
  }

  open(opts = {}) {
    const app = this.app;
    if (app.reviewMode) return;
    if (app.mode === 'sketch') return app.toast('Exit the sketch first.');
    if (app.proposal) return app.toast('Accept or reject the AI proposal first.');
    const parts = this.importedParts();
    if (!parts.length) {
      message('Recognize Features', 'There is no imported body here. Feature recognition turns a body imported from STEP (Imported1) into editable features.');
      return;
    }
    if (app.cmd) app.pmCancel();
    const selPart = app.isAsm ? (() => { const s = app.selection.find((x) => x.kind === 'component'); const c = s && app.doc.components.find((cc) => cc.id === s.id); return c?.part; })() : null;
    const partId = opts.partId || (selPart && parts.some((p) => p.id === selPart) ? selPart : null);
    const st = this.st = {
      phase: 'options', scope: app.isAsm ? (partId ? 'one' : 'all') : 'one', partId: app.isAsm ? (partId || parts[0].id) : 'part',
      job: null, progress: null, result: null, error: null, timer: null, token: null, sent: null,
    };
    const partName = () => (app.isAsm ? (app.doc.parts[st.partId]?.name || st.partId) : (app.doc.name || 'Part'));
    const spec = {
      title: 'FeatureWorks',
      icon: 'featureworks',
      okEnabled: () => st.phase === 'done' && (st.result?.changed || []).length > 0,
      message: () => this.statusText(),
      sections: [
        { title: 'Recognition Mode', rows: [
          { type: 'text', text: 'Automatic: every feature type ticked below is found, taken off, rebuilt and checked against the import. What is not recognized stays an imported body.' },
        ] },
        { title: 'Parts', visible: () => app.isAsm, rows: [
          { type: 'radio', name: 'fwscope', get: () => st.scope, set: (v) => { st.scope = v; this.reset(); },
            options: [['one', esc(`This part: ${partName()}`)], ['all', esc(`All imported parts (${this.importedParts().length})`)]] },
        ] },
        { title: 'Automatic Features', rows: [
          ...KINDS.map(([k, label]) => ({ type: 'check', label, get: () => this.kinds.has(k), set: (v) => { if (v) this.kinds.add(k); else this.kinds.delete(k); this.reset(); } })),
          { type: 'buttons', get buttons() { return [recognizeButton()]; } },
        ] },
        { title: 'Recognized Features', visible: () => st.phase === 'done' || st.phase === 'cancelled', rows: [
          { type: 'list', items: () => this.resultItems(), empty: 'Nothing recognized' },
        ] },
        { title: 'Preview', visible: () => !!st.colored, rows: [
          { type: 'custom', render: (row) => {
            row.style.flexWrap = 'wrap';
            row.style.gap = '6px 12px';
            for (const [kind, color, label] of PREVIEW) {
              if (!st.colored?.has(kind)) continue;
              const chip = document.createElement('span');
              chip.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
              const sw = document.createElement('span');
              sw.style.cssText = `width:12px;height:12px;border-radius:3px;background:${hex(color)}`;
              const tx = document.createElement('span');
              tx.textContent = label;
              chip.append(sw, tx);
              row.appendChild(chip);
            }
          } },
          { type: 'text', text: 'Faces in the body colour stay imported.' },
        ] },
      ],
    };
    const recognizeButton = () => ({
      label: st.phase === 'running' ? 'Stop' : st.phase === 'done' ? 'Recognize Again' : 'Recognize',
      primary: st.phase !== 'done',
      run: () => (st.phase === 'running' ? this.cancel() : this.run()),
    });
    app.cmd = { key: 'featureworks', onOk: () => this.apply(), onCancel: () => this.stop(), onClose: () => this.stop() };
    app.pm.open(spec);
    if (opts.auto) this.run();
  }

  statusText() {
    const st = this.st;
    if (!st) return null;
    if (st.phase === 'running') {
      const p = st.progress;
      if (st.lost) return 'Waiting for the server...';
      if (p?.waiting) return 'Waiting for another recognition on the server to finish...';
      if (!p || !p.total) return 'Recognizing features...';
      const of = p.total > 1 ? ` (${Math.min(p.done + 1, p.total)} of ${p.total})` : '';
      return `Recognizing ${esc(p.current || '')}${of}... ${p.seconds || 0} s`;
    }
    if (st.phase === 'error') return `Could not recognize features: ${esc(st.error || 'unknown error')}`;
    if (st.phase === 'cancelled') return 'Stopped. What was finished is listed below.';
    if (st.phase === 'done') {
      const r = st.result || {};
      const ids = Object.keys(r.parts || {});
      if (!this.app.isAsm || ids.length === 1) {
        const rep = r.parts?.[ids[0]];
        return esc(rep?.message || 'Done.') + ((r.changed || []).length ? ' Click OK to use the recognized features.' : '');
      }
      const exact = (r.changed || []).filter((pid) => r.parts[pid]?.exact).length;
      return `${(r.changed || []).length} of ${ids.length} parts recognized${exact ? ` (${exact} the same solid as the import)` : ''}. Click OK to use them.`;
    }
    return 'Pick the feature types, then Recognize.';
  }

  resultItems() {
    const st = this.st, r = st?.result;
    if (!r) return [];
    const out = [];
    const app = this.app;
    for (const pid of Object.keys(r.parts || {})) {
      const rep = r.parts[pid];
      const upd = r.updates?.[pid];
      if (app.isAsm) out.push({ label: `<b>${esc(rep.name || pid)}</b>: ${esc(rep.message || '')}`, icon: upd ? 'featureworks' : 'imported' });
      for (const f of upd?.features || []) {
        if (f.type === 'sketch' || f.type === 'plane') continue;
        const d = describe(f);
        out.push({ label: `${app.isAsm ? '&nbsp;&nbsp;' : ''}${esc(f.name || f.id)}${d ? ` <span style="opacity:.7">${esc(d)}</span>` : ''}`, icon: featureIcon(f) });
      }
    }
    return out;
  }

  reset() {
    const st = this.st;
    if (!st || st.phase === 'running') return;
    st.phase = 'options';
    st.result = null;
    st.error = null;
    this.uncolour();
  }

  // Colour the imported body by what each face was recognised as (part documents only; faces are matched by
  // their centre, which the server reports for every face a feature took).
  colour() {
    const app = this.app, st = this.st, v = app.viewer;
    const rep = st?.result?.parts?.part;
    if (app.isAsm || !rep || !(st.result.changed || []).includes('part') || !v?.faceObjs) return;
    const kinds = rep.faces || {};
    const pts = [];
    for (const [kind, list] of Object.entries(kinds)) for (const c of list) pts.push([kind, c]);
    const used = new Set();
    const baseKind = rep.base === 'extrude' || rep.base === 'revolve' ? 'base' : null;
    for (const f of v.faceObjs) {
      const c = f.userData.data?.center;
      let kind = baseKind;
      if (c) {
        const hit = pts.find(([, p]) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) < 1e-4);
        if (hit) kind = hit[0];
      }
      const col = PREVIEW.find((p) => p[0] === kind);
      if (col) { f.userData.baseColor = col[1]; used.add(kind); }
    }
    st.colored = used;
    v.refreshHighlights();
  }

  uncolour() {
    const app = this.app, st = this.st, v = app.viewer;
    if (!st?.colored || !v?.faceObjs) return;
    const body = app.bodyColor();
    for (const f of v.faceObjs) f.userData.baseColor = body;
    st.colored = null;
    v.refreshHighlights();
  }

  snapshot(ids) {
    const app = this.app;
    const out = {};
    for (const id of ids) out[id] = JSON.stringify(app.isAsm ? app.doc.parts[id]?.features : app.doc.features);
    return out;
  }

  async run() {
    const app = this.app, st = this.st;
    if (!st || st.phase === 'running') return;
    if (!this.kinds.size) return app.toast('Tick at least one feature type.');
    const ids = app.isAsm ? (st.scope === 'one' ? [st.partId] : this.importedParts().map((p) => p.id)) : ['part'];
    st.phase = 'running'; st.result = null; st.error = null; st.progress = null;
    st.sent = this.snapshot(ids);
    app.pm.render();
    const token = st.token = {};
    let r;
    try {
      r = await app.api('/api/recognize/start', { doc: app.cleanDoc(app.doc), part_id: app.isAsm && st.scope === 'one' ? st.partId : null, kinds: [...this.kinds] });
    } catch (err) { r = { error: err.message }; }
    if (st.token !== token) return;
    if (r.error) { st.phase = 'error'; st.error = r.error; app.pm.render(); return; }
    st.job = r.job; // r.resumed: this person's job was still running on the server; follow it again
    // A status request that fails (a dropped connection, a server busy for a moment) is tried again for about two
    // minutes before the job is given up on, so the page never loses track of a job that is still running.
    let failedSince = null;
    const tick = async () => {
      if (st.token !== token || this.st !== st) return;
      let s;
      try { s = await app.api(`/api/recognize/${st.job}`, null, 'GET'); } catch (err) {
        if (/no such job/i.test(err.message || '')) s = { state: 'error', error: 'The server restarted, so the job was lost. Click Recognize to run it again.' };
        else {
          failedSince ??= Date.now();
          if (Date.now() - failedSince < 120000) {
            st.lost = true;
            app.pm.render();
            st.timer = setTimeout(tick, Math.min(15000, 1000 + (Date.now() - failedSince) / 4));
            return;
          }
          s = { state: 'error', error: err.message };
        }
      }
      if (st.token !== token || this.st !== st) return;
      failedSince = null;
      st.lost = false;
      st.progress = s;
      if (s.state === 'running' || s.state === 'cancelling') { app.pm.render(); st.timer = setTimeout(tick, 900); return; }
      if (s.state === 'error') { st.phase = 'error'; st.error = s.error; } else { st.phase = s.state === 'cancelled' ? 'cancelled' : 'done'; st.result = s.result; }
      st.token = null;
      this.colour();
      app.pm.render();
    };
    tick();
  }

  // Stop the server's job. Also after the page lost track of it, as long as the server may still be running it.
  cancel() {
    const st = this.st;
    if (!st?.job) return;
    if (st.phase !== 'running' && !(st.phase === 'error' && ['running', 'cancelling'].includes(st.progress?.state))) return;
    this.app.api(`/api/recognize/${st.job}`, null, 'DELETE').catch(() => {});
  }

  // Leaving the PropertyManager: stop polling, and stop a job still running so the server is free again.
  stop() {
    const st = this.st;
    if (!st) return;
    this.uncolour();
    this.cancel();
    st.token = null;
    clearTimeout(st.timer);
    this.st = null;
  }

  apply() {
    const app = this.app, st = this.st, r = st?.result;
    const changed = r?.changed || [];
    if (!changed.length) return false;
    const now = this.snapshot(changed);
    if (changed.some((id) => now[id] !== st.sent[id])) {
      message('Recognize Features', 'The model changed while features were being recognized. Click Recognize again.');
      this.reset();
      app.pm.render();
      return false;
    }
    this.uncolour();
    app.commit('Recognize Features', () => {
      for (const id of changed) {
        const u = r.updates[id];
        const part = app.isAsm ? app.doc.parts[id] : app.doc;
        part.features = u.features;
        part.rollback = u.rollback ?? null;
      }
    });
    const n = changed.reduce((s, id) => s + (r.parts[id]?.recognized || 0), 0);
    app.toast(`Recognized ${n} feature${n === 1 ? '' : 's'}${app.isAsm ? ` in ${changed.length} part${changed.length === 1 ? '' : 's'}` : ''}. Edit them like any other feature.`);
    this.st = null;
    return true;
  }
}
