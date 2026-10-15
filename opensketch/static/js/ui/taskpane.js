// Task Pane (right): OpenSketch AI copilot, resources, appearances, custom properties.

import { icon } from '../icons.js';
import { describeFeature } from '../features.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

const PANES = [
  { id: 'ai', icon: 'ai', title: 'OpenSketch AI' },
  { id: 'resources', icon: 'resources', title: 'OpenSketch Resources' },
  { id: 'library', icon: 'library', title: 'Design Library' },
  { id: 'explorer', icon: 'explorer', title: 'File Explorer' },
  { id: 'palette', icon: 'palette', title: 'View Palette' },
  { id: 'appearance', icon: 'appearance', title: 'Appearances, Scenes, and Decals' },
  { id: 'custprops', icon: 'custprops', title: 'Custom Properties' },
];

const COLORS = ['#b9c0c8', '#d0d4d8', '#8a96a3', '#3c4650', '#c8a050', '#b87333', '#d9372b', '#2f7fd8', '#2f9e44', '#f2c230', '#ffffff', '#202020'];

export class TaskPane {
  constructor(app) {
    this.app = app;
    this.strip = document.getElementById('taskstrip');
    this.panel = document.getElementById('taskpanel');
    this.open = null;
    this.log = [];
    this.conversation = null;
    this.busy = false;
    for (const p of PANES) {
      const b = h('div', 'ts', icon(p.icon, 20));
      b.title = p.title; b.dataset.id = p.id;
      b.onclick = () => this.toggle(p.id);
      this.strip.appendChild(b);
    }
  }

  toggle(id) { this.show(this.open === id ? null : id); }

  show(id) {
    this.open = id;
    [...this.strip.children].forEach((b) => b.classList.toggle('active', b.dataset.id === id));
    this.panel.classList.toggle('hidden', !id);
    if (id) this.render();
    this.app.viewer.resize();
  }

  render() {
    const p = PANES.find((x) => x.id === this.open);
    if (!p) return;
    this.panel.innerHTML = '';
    const head = h('div', 'tp-head', `${icon(p.icon, 18)}<span>${p.title}</span><span class="pin" title="Close">&#x2715;</span>`);
    head.querySelector('.pin').onclick = () => this.show(null);
    this.panel.appendChild(head);
    const body = h('div', 'tp-body');
    this.panel.appendChild(body);
    if (p.id === 'ai') return this.renderAI(body);
    if (p.id === 'resources') return this.renderResources(body);
    if (p.id === 'appearance') return this.renderAppearance(body);
    if (p.id === 'custprops') return this.renderProps(body);
    body.appendChild(h('div', 'pm-note', 'Not available yet in this version.'));
  }

  // ---------------------------------------------------------------- AI
  renderAI(body) {
    const logEl = h('div', 'ai-log');
    body.appendChild(logEl);
    if (!this.log.length) {
      logEl.appendChild(h('div', 'ai-msg bot', 'Describe a part or a change. I build it as real features in the tree (sketches with relations and dimensions, extrudes, fillets) so you can edit everything afterwards. Proposals show in purple until you accept them.'));
      const ex = h('div', 'ai-examples');
      for (const t of ['A 60 x 40 x 10 mm plate with four 5 mm corner holes, 6 mm from the edges', 'A flanged bushing: 30 mm OD, 12 mm bore, 25 mm long, 45 mm flange 5 mm thick', 'Add 2 mm fillets to all vertical edges', 'Shell the part to 2 mm, open at the top']) {
        const s = h('span', null, esc(t)); s.onclick = () => { this.input.value = t; this.input.focus(); }; ex.appendChild(s);
      }
      logEl.appendChild(ex);
      if (this.app.aiAvailable === false) logEl.appendChild(h('div', 'ai-msg err', 'The AI is offline. Start the server with ANTHROPIC_API_KEY set to use it.'));
    }
    for (const m of this.log) {
      if (m.role === 'proposal') {
        const box = h('div', 'ai-proposal');
        box.innerHTML = `<b>${esc(m.summary || 'Proposed change')}</b><div class="feats">${m.features.map((f) => '&bull; ' + esc(f)).join('<br>')}</div>`;
        if (m.state === 'pending') {
          const btns = h('div', 'btns');
          const ok = h('button', 'btn primary', 'Accept'); ok.onclick = () => { this.app.acceptProposal(); m.state = 'accepted'; this.render(); };
          const no = h('button', 'btn danger', 'Reject'); no.onclick = () => { this.app.rejectProposal(); m.state = 'rejected'; this.render(); };
          btns.append(ok, no); box.appendChild(btns);
        } else box.appendChild(h('div', 'pm-note', m.state === 'accepted' ? 'Accepted' : 'Rejected'));
        logEl.appendChild(box);
      } else logEl.appendChild(h('div', 'ai-msg ' + (m.role === 'user' ? 'user' : m.role === 'error' ? 'err' : 'bot'), esc(m.text)));
    }
    if (this.busy) logEl.appendChild(h('div', 'ai-msg bot', '<span class="spinner"></span> Designing and rebuilding...'));
    const inp = h('div', 'ai-input');
    const ta = h('textarea'); ta.placeholder = 'Describe the part or the change...';
    ta.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); this.send(); } });
    this.input = ta;
    const row = h('div', 'row');
    row.appendChild(h('span', 'hint', 'Ctrl+Enter to send'));
    const reset = h('button', 'btn', 'New chat'); reset.onclick = () => { this.log = []; this.conversation = null; this.render(); };
    const send = h('button', 'btn primary', 'Send'); send.onclick = () => this.send();
    row.append(reset, send);
    inp.append(ta, row);
    this.panel.appendChild(inp);
    body.scrollTop = body.scrollHeight;
    setTimeout(() => ta.focus(), 0);
  }

  async send(text) {
    const prompt = (text ?? this.input?.value ?? '').trim();
    if (!prompt || this.busy) return;
    this.show('ai');
    this.log.push({ role: 'user', text: prompt });
    this.busy = true; this.render();
    try {
      const res = await this.app.api('/api/ai', { doc: this.app.cleanDoc(), prompt, conversation: this.conversation });
      if (res.error) throw new Error(res.error);
      this.conversation = res.conversation;
      if (res.reply) this.log.push({ role: 'bot', text: res.reply });
      if (res.proposal) {
        const before = new Set(this.app.doc.features.map((f) => JSON.stringify(f)));
        const changed = res.proposal.features.filter((f) => !before.has(JSON.stringify(f)));
        this.log.push({ role: 'proposal', summary: res.summary, features: changed.map((f) => describeFeature(f, this.app)), state: 'pending' });
        this.app.showProposal(res.proposal, changed.map((f) => f.id));
      }
    } catch (err) {
      this.log.push({ role: 'error', text: String(err.message || err) });
    } finally {
      this.busy = false; this.render();
    }
  }

  // ---------------------------------------------------------------- other panes
  renderResources(body) {
    body.innerHTML = `<b>Getting started</b>
      <p>1. Select <i>Front Plane</i> in the FeatureManager tree and click <b>Sketch</b>.</p>
      <p>2. Draw with Line, Rectangle or Circle. Add <b>Smart Dimension</b>s until the status bar says <i>Fully Defined</i>.</p>
      <p>3. Exit the sketch and click <b>Extruded Boss/Base</b>.</p>
      <p>4. Select edges and click <b>Fillet</b>.</p>
      <b>Mouse</b><p>Middle drag: rotate. Ctrl + middle drag: pan. Wheel: zoom. Alt + left drag also rotates (trackpads).</p>`;
    const b = h('button', 'btn', 'Keyboard shortcuts'); b.onclick = () => this.app.shortcutsDialog();
    body.appendChild(b);
  }

  renderAppearance(body) {
    body.appendChild(h('div', null, '<b>Part color</b>'));
    const grid = h('div'); grid.style.cssText = 'display:grid;grid-template-columns:repeat(6,36px);gap:6px;margin:8px 0';
    for (const c of COLORS) {
      const s = h('div'); s.style.cssText = `height:30px;background:${c};border:1px solid #999;cursor:pointer`;
      s.title = c;
      s.onclick = () => this.app.setAppearance(c);
      grid.appendChild(s);
    }
    body.appendChild(grid);
    const inp = h('input'); inp.type = 'color'; inp.value = this.app.doc.appearance || '#b9c0c8';
    inp.oninput = () => this.app.setAppearance(inp.value);
    body.appendChild(inp);
    body.appendChild(h('div', null, '<br><b>Scene</b>'));
    for (const [n, bg] of [['Plain White', '#ffffff'], ['Grey Gradient', 'linear-gradient(#f4f4f4,#b8b8b8)'], ['Studio (default)', '']]) {
      const b = h('button', 'btn', n); b.style.margin = '4px 4px 0 0';
      b.onclick = () => { document.getElementById('graphics').style.background = bg; };
      body.appendChild(b);
    }
  }

  renderProps(body) {
    const d = this.app.doc;
    const row = (label, value, set) => {
      const r = h('div', 'pm-row'); r.style.marginBottom = '6px';
      r.appendChild(h('label', null, label)).style.width = '90px';
      const i = h('input'); i.type = 'text'; i.value = value; i.style.cssText = 'flex:1;height:22px;border:1px solid #c8c8c8;padding:0 4px';
      i.addEventListener('keydown', (e) => e.stopPropagation());
      i.onchange = () => set(i.value);
      r.appendChild(i); body.appendChild(r);
    };
    row('Part name', d.name, (v) => this.app.commit('Rename part', () => { this.app.doc.name = v || 'Part1'; }, false));
    row('Description', d.description || '', (v) => this.app.commit('Description', () => { this.app.doc.description = v; }, false));
    row('Designer', d.designer || '', (v) => this.app.commit('Designer', () => { this.app.doc.designer = v; }, false));
    const b = h('button', 'btn', 'Edit Material...'); b.onclick = () => this.app.materialDialog();
    body.appendChild(b);
  }
}
