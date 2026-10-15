// Toolbox: standard parts (ISO screws, nuts, washers, ball bearings) generated to size by the
// server (bd_warehouse). Lives in the Design Library pane, like SOLIDWORKS Toolbox.

import { icon } from './icons.js';
import { isAssembly } from './asm.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const LABEL = {
  socket_head_cap_screw: 'Socket Head Cap Screw', hex_head_screw: 'Hex Head Screw', counter_sunk_screw: 'Countersunk Screw',
  button_head_screw: 'Button Head Screw', set_screw: 'Set Screw', hex_nut: 'Hex Nut', plain_washer: 'Plain Washer', ball_bearing: 'Ball Bearing',
};

export class Toolbox {
  constructor(app) {
    this.app = app;
    this.catalog = null;
    this.pick = { kind: 'socket_head_cap_screw', size: 'M6-1', length: 20 };
  }

  async load() {
    if (!this.catalog) this.catalog = await this.app.api('/api/toolbox', null, 'GET');
    return this.catalog;
  }

  async render(body) {
    body.appendChild(h('div', null, '<b>Toolbox</b><div class="pm-note">ISO screws, nuts, washers and bearings, made to size. They go into assemblies.</div>'));
    const box = h('div', 'tbx');
    body.appendChild(box);
    let cat;
    try { cat = await this.load(); } catch (err) { box.appendChild(h('div', 'ai-msg err', 'Toolbox unavailable: ' + err.message)); return; }
    const draw = () => {
      box.innerHTML = '';
      const list = h('div', 'tbx-list');
      for (const [k, v] of Object.entries(cat)) {
        const it = h('div', 'li' + (this.pick.kind === k ? ' sel' : ''), `${icon('toolbox', 16)}<span>${LABEL[k] || k}</span>`);
        it.title = v.description;
        it.onclick = () => { this.pick.kind = k; if (!v.sizes.includes(this.pick.size)) this.pick.size = v.sizes[Math.min(4, v.sizes.length - 1)]; draw(); };
        list.appendChild(it);
      }
      box.appendChild(list);
      const v = cat[this.pick.kind];
      const row = h('div', 'pm-row');
      row.appendChild(h('label', null, 'Size'));
      const sel = h('select', 'grow');
      for (const s of v.sizes) { const o = h('option', null, s); o.value = s; sel.appendChild(o); }
      sel.value = this.pick.size; sel.onchange = () => { this.pick.size = sel.value; };
      row.appendChild(sel);
      box.appendChild(row);
      if (v.args.includes('length')) {
        const r2 = h('div', 'pm-row');
        r2.appendChild(h('label', null, 'Length'));
        const inp = h('input'); inp.type = 'number'; inp.min = 2; inp.step = 1; inp.value = this.pick.length; inp.className = 'grow';
        inp.addEventListener('keydown', (e) => e.stopPropagation());
        inp.onchange = () => { this.pick.length = Math.max(2, +inp.value || 10); };
        r2.appendChild(inp); r2.appendChild(h('span', null, 'mm'));
        box.appendChild(r2);
      }
      const b = h('button', 'btn primary', 'Insert into Assembly');
      b.onclick = () => this.insert({ ...this.pick });
      box.appendChild(b);
      if (!isAssembly(this.app.shownDoc)) box.appendChild(h('div', 'pm-note', 'Open or start an assembly to insert Toolbox parts.'));
    };
    draw();
  }

  async partDoc(p) {
    const r = await this.app.api('/api/toolbox/part', { kind: p.kind, size: p.size, length: p.length });
    if (!r.doc) throw new Error(r.detail || 'Could not make the part');
    return r.doc;
  }

  async insert(p) {
    const app = this.app;
    if (!isAssembly(app.doc) || app.proposal) { app.toast('Toolbox parts go into assemblies. Start a New Assembly or open one.'); return; }
    let doc;
    try { doc = await this.partDoc(p); } catch (err) { app.toast(String(err.message || err)); return; }
    const key = `${p.kind}_${p.size}${p.length && doc.standard.length ? '_' + p.length : ''}`.toLowerCase().replace(/[^a-z0-9_]+/g, '');
    app.commit('Insert ' + doc.name, () => {
      if (!app.doc.parts[key]) app.doc.parts[key] = doc;
      app.asm.addComponent(key);
    });
    app.status(`Inserted ${doc.name}. Mate it: Concentric to the hole, Coincident under the head.`);
  }

  // Edit Feature on a Toolbox feature (inside an opened Toolbox part): change size or length.
  async editPM(f) {
    const app = this.app;
    let cat;
    try { cat = await this.load(); } catch (err) { app.toast(err.message); return; }
    const v = cat[f.kind];
    const st = { size: f.size, length: f.length };
    app.cmd = { key: 'toolbox', onOk: () => {
      app.commit('Edit ' + f.name, () => {
        const g = app.featureById(f.id);
        g.size = st.size; if (v.args.includes('length')) g.length = st.length;
        if (app.doc.standard) Object.assign(app.doc.standard, { size: st.size, ...(v.args.includes('length') ? { length: st.length } : {}) });
      });
      return undefined;
    } };
    app.pm.open({ title: f.name, icon: 'toolbox', sections: [{ title: LABEL[f.kind] || f.kind, rows: [
      { type: 'select', label: 'Size', options: v.sizes.map((s) => [s, s]), get: () => st.size, set: (x) => { st.size = x; } },
      { type: 'number', label: 'Length', get: () => st.length || 10, set: (x) => { st.length = x; }, min: 2, visible: () => v.args.includes('length') },
    ] }], okEnabled: () => true });
  }
}
