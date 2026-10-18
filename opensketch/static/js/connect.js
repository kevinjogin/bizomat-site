// Connect AI: the two ways to use AI with OpenSketch, in one dialog.
//
//  1. "Your AI app": ChatGPT, Claude, Codex, Cursor, VS Code... drive OpenSketch through its MCP address
//     (the subscription you already pay for; nothing to paste into OpenSketch). The address is personal:
//     it only reaches your Files.
//  2. "Built-in AI": the OpenSketch AI pane with your own API key (Claude, OpenAI, Gemini, OpenRouter or
//     any OpenAI-compatible provider). The key goes to the server once and is stored encrypted on your
//     account; the page only ever gets back the provider, model and the last four characters.
//
// Client steps checked against each vendor's documentation in October 2026.

import { dialog } from './ui/dialogs.js';
import { FI } from './files.js';
import { refreshAIStatus } from './aikeys.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const t = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

async function json(url, opts) {
  const r = await fetch(url, { cache: 'no-store', ...opts });
  let j = {};
  try { j = await r.json(); } catch (_) { /* not JSON */ }
  if (!r.ok) throw new Error(j.error || j.detail || `HTTP ${r.status}`);
  return j;
}

function copyButton(get, label = 'Copy') {
  const b = h('button', 'btn cx-copy', `${FI.copy}<span>${label}</span>`);
  b.onclick = async () => {
    const v = get();
    try { await navigator.clipboard.writeText(v); } catch (_) {
      const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select(); document.execCommand?.('copy'); ta.remove();
    }
    b.classList.add('done'); b.querySelector('span').textContent = 'Copied';
    setTimeout(() => { b.classList.remove('done'); b.querySelector('span').textContent = label; }, 1600);
  };
  return b;
}

function codeBlock(text, lang = '') {
  const w = h('div', 'cx-code');
  const pre = t('pre', null, text); pre.dataset.lang = lang;
  w.append(pre, copyButton(() => text));
  return w;
}

// ---------------------------------------------------------------- clients (MCP)
// Each: name, kind (app | code), mark (two letters on a tile), steps(url) -> [text or {code, lang} or {link}]
const CLIENTS = [
  { id: 'chatgpt', name: 'ChatGPT', kind: 'app', mark: 'GPT', color: '#10a37f', note: 'Paid plans with developer mode (Plus, Pro, Business, Enterprise or Edu). Web only.',
    steps: (u) => [
      'In ChatGPT, open Settings and turn on Developer mode (business workspaces: an admin turns it on).',
      'Go to chatgpt.com/plugins, click +, then Add custom MCP server (some accounts say Create MCP App).',
      { text: 'Name it OpenSketch. Connection: Server URL. Paste this address:', copy: u },
      'Authentication: No authentication. Tick the warning, click Create, then install it from your plugins.',
      'In a chat, type @ and pick OpenSketch, then ask for a design. Open the link it gives you to watch the model.',
    ] },
  { id: 'claude', name: 'Claude', kind: 'app', mark: 'C', color: '#d97757', note: 'Any plan (Free allows one custom connector). Web and desktop.',
    steps: (u) => [
      'In Claude, open Customize > Connectors and click Add custom connector. (Team and Enterprise: an owner adds it under Organization settings > Connectors.)',
      { text: 'Name it OpenSketch and paste this address as the server URL. Choose No sign-in:', copy: u },
      'In a chat, turn it on under + > Connectors, then ask, for example: "In OpenSketch, design a wall bracket for a 20 kg shelf with off-the-shelf screws."',
      'Open the link Claude gives you to watch the model being built.',
    ] },
  { id: 'claudecode', name: 'Claude Code', kind: 'code', mark: '>_', color: '#d97757', note: 'Terminal. One command.',
    steps: (u) => [
      'Run this once in a terminal. It adds OpenSketch for all your projects:',
      { code: `claude mcp add --transport http --scope user opensketch ${u}`, lang: 'shell' },
      'Check it with /mcp inside Claude Code, then ask it to design in OpenSketch.',
    ] },
  { id: 'codex', name: 'Codex', kind: 'code', mark: 'Cx', color: '#6b7280', note: 'Codex app, CLI and IDE extension share one setting.',
    steps: (u) => [
      'Codex app: Settings > MCP servers > Add server > Streamable HTTP, paste the address, Save, then restart Codex:',
      { copy: u },
      'Or in a terminal:',
      { code: `codex mcp add opensketch --url ${u}`, lang: 'shell' },
      'Or add this to ~/.codex/config.toml:',
      { code: `[mcp_servers.opensketch]\nurl = "${u}"`, lang: 'toml' },
    ] },
  { id: 'cursor', name: 'Cursor', kind: 'code', mark: 'Cu', color: '#111827', note: 'One click, or your global mcp.json.',
    link: (u) => ({ label: 'Add to Cursor', href: `cursor://anysphere.cursor-deeplink/mcp/install?name=opensketch&config=${encodeURIComponent(btoa(JSON.stringify({ url: u })))}` }),
    steps: (u) => [
      'Click Add to Cursor above, or put this in ~/.cursor/mcp.json (your home folder, so the address stays out of your projects):',
      { code: JSON.stringify({ mcpServers: { opensketch: { url: u } } }, null, 2), lang: 'json' },
    ] },
  { id: 'vscode', name: 'VS Code', kind: 'code', mark: 'VS', color: '#2f80ed', note: 'GitHub Copilot agent mode.',
    link: (u) => ({ label: 'Add to VS Code', href: `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: 'opensketch', type: 'http', url: u }))}` }),
    steps: (u) => [
      'Click Add to VS Code above, or run MCP: Add Server from the Command Palette, choose HTTP, paste the address and pick User:',
      { copy: u },
      'Or put this in your user mcp.json (MCP: Open User Configuration):',
      { code: JSON.stringify({ servers: { opensketch: { type: 'http', url: u } } }, null, 2), lang: 'json' },
      'In Copilot Chat, turn its tools on with Configure Tools.',
    ] },
  { id: 'gemini', name: 'Gemini CLI', kind: 'code', mark: 'G', color: '#4285f4', note: 'Terminal.',
    steps: (u) => [
      'Run this once:',
      { code: `gemini mcp add --transport http -s user opensketch ${u}`, lang: 'shell' },
      'Or add it to ~/.gemini/settings.json (httpUrl, not url):',
      { code: JSON.stringify({ mcpServers: { opensketch: { httpUrl: u } } }, null, 2), lang: 'json' },
    ] },
  { id: 'other', name: 'Other', kind: 'code', mark: '+', color: '#5e6ad2', note: 'Any app that supports remote MCP servers.',
    steps: (u) => [
      'Add a remote MCP server with this address. Transport: Streamable HTTP. Authentication: none (the address is the key).',
      { copy: u },
      'Windsurf / Devin Desktop: ~/.config/devin/mcp_config.json with {"mcpServers": {"opensketch": {"serverUrl": "<address>"}}}.',
    ] },
];

function clientPane(c, info) {
  const u = info.mcp_url;
  const box = h('div', 'cx-client');
  const head = h('div', 'cx-chead');
  const title = h('div', 'cx-ctitle');
  title.append(t('b', null, `Connect ${c.name}`), t('span', null, c.note));
  head.appendChild(title);
  if (c.link) { const l = c.link(u); const a = h('a', 'btn primary fv-pill', `<span>${l.label}</span>${FI.arrow}`); a.href = l.href; head.appendChild(a); }
  box.appendChild(head);
  const ol = h('ol', 'cx-steps');
  for (const s of c.steps(u)) {
    const li = document.createElement('li');
    if (typeof s === 'string') li.appendChild(t('span', null, s));
    else {
      if (s.text) li.appendChild(t('span', null, s.text));
      if (s.copy) { const row = h('div', 'cx-url'); const inp = h('input'); inp.readOnly = true; inp.value = s.copy; inp.onfocus = () => inp.select(); row.append(inp, copyButton(() => s.copy)); li.appendChild(row); }
      if (s.code) li.appendChild(codeBlock(s.code, s.lang));
      if (!s.text && !s.copy && !s.code) continue;
      if (!s.text) li.classList.add('bare');
    }
    ol.appendChild(li);
  }
  box.appendChild(ol);
  return box;
}

function appTab(app, info) {
  const wrap = h('div', 'cx-pane');
  const lead = h('p', 'cx-lead');
  lead.textContent = 'Use the AI you already pay for. It builds in your Files while you watch here. No API key needed.';
  wrap.appendChild(lead);
  const warn = [];
  if (!info.password_set && !info.accounts) warn.push('This server has no sign-in. Anyone with its address can use it. Set OPENSKETCH_PASSWORD where it runs, then restart it.');
  if (info.codespace) warn.push('Codespaces: make port 8000 public (Ports tab, right-click, Port Visibility > Public) or the AI cannot reach it.');
  if (/^http:\/\/(127\.|localhost)/.test(info.mcp_url)) warn.push('This address is on your own computer. ChatGPT and Claude on the web cannot reach it; desktop tools like Claude Code, Codex and Cursor can.');
  for (const w of warn) wrap.appendChild(t('div', 'cx-warn', w));
  const grid = h('div', 'cx-clients'); grid.setAttribute('role', 'tablist');
  const detail = h('div', 'cx-detail');
  let cur = null;
  const pick = (c) => {
    cur = c;
    try { localStorage.setItem('opensketch.connect.client', c.id); } catch (_) { /* */ }
    grid.querySelectorAll('.cx-chip').forEach((b) => { b.classList.toggle('on', b.dataset.id === c.id); b.setAttribute('aria-selected', b.dataset.id === c.id); });
    detail.innerHTML = '';
    detail.appendChild(clientPane(c, info));
  };
  for (const c of CLIENTS) {
    const b = h('button', 'cx-chip', `<i style="--c:${c.color}">${c.mark}</i><span>${c.name}</span>`);
    b.dataset.id = c.id; b.setAttribute('role', 'tab');
    b.onclick = () => pick(c);
    grid.appendChild(b);
  }
  wrap.append(grid, detail);
  const keyNote = h('div', 'cx-foot');
  keyNote.append(t('span', null, info.personal ? 'This address is yours: it reaches only your Files. Keep it private.' : 'The address is the key: keep it private. Changing the server password changes it.'));
  wrap.appendChild(keyNote);
  let saved = null; try { saved = localStorage.getItem('opensketch.connect.client'); } catch (_) { /* */ }
  pick(CLIENTS.find((c) => c.id === saved) || CLIENTS[0]);
  return wrap;
}

// ---------------------------------------------------------------- built-in AI (your own key)
function guessProvider(key, providers) {
  const k = (key || '').trim();
  for (const p of providers) if ((p.prefix || []).some((x) => x !== 'sk-' && k.startsWith(x))) return p.id;
  if (k.startsWith('sk-')) return 'openai';
  return null;
}

function keyTab(app, info, close) {
  const wrap = h('div', 'cx-pane');
  const cur = info.settings;
  const providers = info.providers;
  let prov = cur?.provider || 'anthropic';
  let models = [];
  let verified = false;
  let checking = 0;

  const status = h('div', 'cx-status');
  const drawStatus = () => {
    status.innerHTML = '';
    const s = app.aiInfo || {};
    let text, cls;
    if (cur) { text = `Using your ${providers.find((p) => p.id === cur.provider)?.label || cur.provider} key ending ${cur.hint}, model ${cur.model}.`; cls = 'ok'; }
    else if (info.server_key) { text = `Using this server's Claude key (${s.model || 'claude'}). Add your own to use your account or another provider.`; cls = 'ok'; }
    else { text = 'No AI key yet. Add one below, or use an AI app you already have (the other tab).'; cls = 'none'; }
    status.className = 'cx-status ' + cls;
    status.append(h('i', null, cls === 'ok' ? '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''), t('span', null, text));
    if (cur) {
      const rm = t('button', 'cx-link', 'Remove my key');
      rm.onclick = () => json('/api/ai/keys', { method: 'DELETE' }).then(() => { app.toast?.('Your key was removed.'); refreshAIStatus(app); close(); }, (e) => { err.textContent = e.message; });
      status.appendChild(rm);
    }
  };
  drawStatus();
  wrap.appendChild(status);

  const cards = h('div', 'cx-provs'); cards.setAttribute('role', 'radiogroup'); cards.setAttribute('aria-label', 'Provider');
  for (const p of providers) {
    const b = h('button', 'cx-prov');
    b.dataset.id = p.id; b.setAttribute('role', 'radio');
    b.append(t('b', null, p.label), t('span', null, p.blurb));
    if (p.web) b.appendChild(t('em', null, 'Web search'));
    b.onclick = () => { setProv(p.id); key.focus(); };
    cards.appendChild(b);
  }
  wrap.appendChild(cards);

  const form = h('div', 'cx-form');
  const step1 = h('div', 'cx-row');
  step1.innerHTML = '<span class="cx-n">1</span>';
  const getKey = h('a', 'btn', `<span>Get a key</span>${FI.open}`); getKey.target = '_blank'; getKey.rel = 'noopener noreferrer';
  const where = t('span', 'cx-where');
  step1.append(getKey, where);

  const baseRow = h('div', 'cx-row cx-base');
  baseRow.innerHTML = '<span class="cx-n">+</span>';
  const base = h('input', 'acct-i'); base.placeholder = 'https://api.example.com/v1'; base.value = cur?.base_url || ''; base.setAttribute('aria-label', 'Provider address (base URL)'); base.spellcheck = false;
  baseRow.appendChild(base);

  const step2 = h('div', 'cx-row');
  step2.innerHTML = '<span class="cx-n">2</span>';
  const keyWrap = h('div', 'cx-keywrap');
  const key = h('input', 'acct-i cx-key'); key.type = 'password'; key.autocomplete = 'off'; key.spellcheck = false; key.setAttribute('aria-label', 'API key');
  const eye = h('button', 'cx-eye', '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>');
  eye.title = 'Show or hide the key'; eye.type = 'button';
  eye.onclick = () => { key.type = key.type === 'password' ? 'text' : 'password'; eye.classList.toggle('on', key.type === 'text'); };
  const badge = h('span', 'cx-badge');
  keyWrap.append(key, eye, badge);
  step2.appendChild(keyWrap);

  const step3 = h('div', 'cx-row');
  step3.innerHTML = '<span class="cx-n">3</span>';
  const model = h('select', 'acct-i cx-model'); model.setAttribute('aria-label', 'Model');
  const modelText = h('input', 'acct-i cx-model'); modelText.placeholder = 'Model name'; modelText.spellcheck = false; modelText.setAttribute('aria-label', 'Model');
  step3.append(model, modelText);
  const web = t('div', 'cx-hint');
  const err = t('div', 'acct-err'); err.setAttribute('role', 'alert');
  form.append(step1, baseRow, step2, step3, web, err);
  wrap.appendChild(form);

  const spec = () => providers.find((p) => p.id === prov);
  const fillModels = (list, pickFirst) => {
    models = list;
    model.innerHTML = '';
    const want = (cur && cur.provider === prov && cur.model) || spec().model || '';
    const ids = [...new Set([...(want ? [want] : []), ...list])];
    for (const m of ids) { const o = t('option', null, m === spec().model && prov === 'anthropic' ? `${m}  (recommended)` : m); o.value = m; model.appendChild(o); }
    const useSelect = ids.length > 0;
    model.hidden = !useSelect; modelText.hidden = useSelect;
    if (useSelect) model.value = pickFirst && !want ? ids[0] : (want || ids[0]);
  };
  const setBadge = (state, text) => { badge.className = 'cx-badge ' + state; badge.textContent = text || ''; };
  function setProv(id, keepKey = true) {
    prov = id;
    const p = spec();
    cards.querySelectorAll('.cx-prov').forEach((b) => { b.classList.toggle('on', b.dataset.id === id); b.setAttribute('aria-checked', b.dataset.id === id); });
    baseRow.hidden = id !== 'custom';
    getKey.hidden = !p.keys_url; if (p.keys_url) getKey.href = p.keys_url;
    where.textContent = p.keys_url ? `${p.keys}. Copy the key.` : `Get a key from ${p.keys}.`;
    const same = cur && cur.provider === id;
    key.placeholder = same ? `Saved key ending ${cur.hint}. Paste a new one to replace it.` : `Paste your ${p.label} key`;
    if (!keepKey) key.value = '';
    web.textContent = p.web ? 'Claude can search the web and read pages for real part sizes while it designs.' : 'Web search works with Claude only. Other models design without it.';
    verified = !!same; err.textContent = '';
    setBadge(same ? 'ok' : '', same ? 'Saved' : '');
    if (same) fillModels([cur.model], false);
    else if (p.model) fillModels([p.model], true);
    else { model.innerHTML = ''; model.hidden = true; modelText.hidden = false; modelText.value = ''; modelText.placeholder = 'Paste the key to list the models'; }
  }

  let timer = null;
  const check = async () => {
    const k = key.value.trim();
    const p = spec();
    if (!k && !(cur && cur.provider === prov)) { setBadge('', ''); return; }
    if (prov === 'custom' && !base.value.trim()) { setBadge('', ''); err.textContent = 'Enter the provider address first.'; return; }
    const n = ++checking;
    setBadge('busy', 'Checking'); err.textContent = '';
    try {
      const r = await json('/api/ai/models', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: prov, key: k || null, base_url: base.value.trim() || null }) });
      if (n !== checking) return;
      verified = true;
      setBadge('ok', 'Key works');
      fillModels(r.models, !p.model);
    } catch (e) {
      if (n !== checking) return;
      verified = false; setBadge('bad', 'Not accepted'); err.textContent = e.message;
    }
  };
  key.addEventListener('input', () => {
    const g = guessProvider(key.value, providers);
    if (g && g !== prov && !(prov === 'custom')) setProv(g, true);
    verified = false; setBadge('', '');
    clearTimeout(timer);
    if (key.value.trim().length >= 20) timer = setTimeout(check, 450);
  });
  key.addEventListener('paste', () => setTimeout(() => { clearTimeout(timer); check(); }, 0));
  base.addEventListener('change', () => { if (key.value.trim()) check(); });
  for (const i of [key, base, modelText]) i.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') save(); });

  const save = () => {
    err.textContent = '';
    const m = (model.hidden ? modelText.value : model.value).trim();
    if (!key.value.trim() && !(cur && cur.provider === prov)) { err.textContent = 'Paste your API key first.'; key.focus(); return; }
    if (!m) { err.textContent = 'Choose a model.'; return; }
    saveBtn.disabled = true; saveBtn.textContent = 'Saving...';
    json('/api/ai/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: prov, model: m, key: key.value.trim() || null, base_url: base.value.trim() || null }) })
      .then((r) => { close(); app.toast?.(`AI set to ${spec().label}, ${r.settings.model}.`); refreshAIStatus(app); },
        (e) => { err.textContent = e.message; saveBtn.disabled = false; saveBtn.textContent = 'Save and use'; });
  };
  const foot = h('div', 'cx-actions');
  const note = t('span', 'cx-fine', 'Stored encrypted on your account and used only for your requests. OpenSketch never shows it again.');
  const saveBtn = h('button', 'btn primary fv-pill', 'Save and use');
  saveBtn.onclick = save;
  foot.append(note, saveBtn);
  wrap.appendChild(foot);
  setProv(prov);
  return { el: wrap, focus: () => key.focus() };
}

// ---------------------------------------------------------------- dialog
export async function connectDialog(app, tab = null) {
  let info, keys;
  try { [info, keys] = await Promise.all([json('/api/connect'), json('/api/ai/keys')]); } catch (e) {
    dialog({ title: 'Connect AI', body: t('div', null, String(e.message || e)), buttons: [{ label: 'OK', primary: true }] });
    return;
  }
  const body = h('div', 'cx');
  const hero = h('div', 'cx-hero');
  hero.innerHTML = '<div><h2>Connect AI</h2><p>Two ways to design with AI in OpenSketch.</p></div>';
  const tabs = h('div', 'cx-tabs'); tabs.setAttribute('role', 'tablist');
  const tA = h('button', 'cx-tab', `<b>Your AI app</b><span>ChatGPT, Claude, Codex, Cursor...</span>`);
  const tB = h('button', 'cx-tab', `<b>Built-in AI</b><span>Your own API key</span>`);
  tabs.append(tA, tB);
  const panes = h('div', 'cx-panes');
  body.append(hero, tabs, panes);
  const d = dialog({ title: 'Connect AI', body, cls: 'cx-dlg', buttons: [] });
  const A = appTab(app, info);
  const B = keyTab(app, keys, () => d.close());
  const show = (which) => {
    try { localStorage.setItem('opensketch.connect.tab', which); } catch (_) { /* */ }
    tA.classList.toggle('on', which === 'app'); tB.classList.toggle('on', which === 'key');
    tA.setAttribute('aria-selected', which === 'app'); tB.setAttribute('aria-selected', which === 'key');
    panes.innerHTML = ''; panes.appendChild(which === 'app' ? A : B.el);
    if (which === 'key') setTimeout(() => B.focus(), 30);
    // keep the dialog on screen as its height changes
    const r = d.el.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 8) d.el.style.top = Math.max(8, window.innerHeight - r.height - 8) + 'px';
  };
  tA.onclick = () => show('app'); tB.onclick = () => show('key');
  let saved = null; try { saved = localStorage.getItem('opensketch.connect.tab'); } catch (_) { /* */ }
  show(tab || saved || 'app');
  d.el.style.top = Math.max(8, (window.innerHeight - d.el.getBoundingClientRect().height) / 2.6) + 'px';
}
