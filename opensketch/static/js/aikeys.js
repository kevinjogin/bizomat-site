// Account menu > AI model and key: bring your own key (Claude, OpenAI, Gemini, OpenRouter or any
// OpenAI-compatible provider). The key goes to the server once and is stored encrypted on the account;
// the page only ever gets back the provider, model and the last four characters.

import { dialog } from './ui/dialogs.js';

const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

async function json(url, opts) {
  const r = await fetch(url, opts);
  let j = {};
  try { j = await r.json(); } catch (_) { /* not JSON */ }
  if (!r.ok) throw new Error(j.error || j.detail || `HTTP ${r.status}`);
  return j;
}

export async function refreshAIStatus(app) {
  try {
    const r = await json('/api/ai/status');
    app.aiAvailable = !!r.available; app.aiDemo = !!r.demo; app.aiInfo = r;
  } catch (_) { app.aiAvailable = false; }
  if (app.taskpane?.open === 'ai') app.taskpane.render();
}

export async function aiKeyDialog(app) {
  let info;
  try { info = await json('/api/ai/keys'); } catch (e) { dialog({ title: 'AI model and key', body: h('div', null, String(e.message || e)), buttons: [{ label: 'OK', primary: true }] }); return; }
  const cur = info.settings;
  const body = h('div', 'acct aik');
  const intro = h('p', 'acct-note');
  intro.textContent = info.server_key
    ? 'This server has its own Claude key, so the AI works without one. Add yours to use your own account or another provider.'
    : 'Add your own API key to use the AI. It is stored encrypted on your account and only used for your requests.';
  body.appendChild(intro);

  body.appendChild(h('label', 'acct-l', 'Provider'));
  const prov = h('select', 'acct-i');
  for (const p of info.providers) { const o = h('option', null, p.label); o.value = p.id; prov.appendChild(o); }
  prov.value = cur?.provider || 'anthropic';
  body.appendChild(prov);

  const baseL = h('label', 'acct-l', 'Address (base URL)');
  const base = h('input', 'acct-i'); base.placeholder = 'https://api.example.com/v1'; base.value = cur?.base_url || '';
  body.append(baseL, base);

  body.appendChild(h('label', 'acct-l', 'API key'));
  const keyRow = h('div', 'aik-row');
  const key = h('input', 'acct-i'); key.type = 'password'; key.autocomplete = 'off'; key.spellcheck = false;
  const check = h('button', 'btn', 'Check key');
  keyRow.append(key, check);
  body.appendChild(keyRow);
  const where = h('div', 'acct-note');
  body.appendChild(where);

  body.appendChild(h('label', 'acct-l', 'Model'));
  const model = h('input', 'acct-i'); model.setAttribute('list', 'aik-models'); model.spellcheck = false; model.value = cur?.model || '';
  const list = h('datalist'); list.id = 'aik-models';
  body.append(model, list);
  const web = h('div', 'acct-note');
  body.appendChild(web);
  const msg = h('div', 'acct-err'); msg.setAttribute('role', 'alert');
  const ok = h('div', 'aik-ok');
  body.append(msg, ok);
  body.querySelectorAll('input, select').forEach((i) => i.addEventListener('keydown', (e) => e.stopPropagation()));

  const spec = () => info.providers.find((p) => p.id === prov.value);
  const sync = (first) => {
    const p = spec();
    const same = cur && cur.provider === p.id;
    const custom = p.id === 'custom';
    baseL.style.display = base.style.display = custom ? '' : 'none';
    if (!custom) base.value = '';
    key.placeholder = same ? `Saved (${cur.hint}). Paste a new key to replace it.` : 'Paste your key';
    where.textContent = `Get a key: ${p.keys}.`;
    if (!first || !model.value) model.value = same ? cur.model : p.model || '';
    model.placeholder = p.model || 'Check the key to list models, or type a model name';
    web.textContent = p.web ? 'Web search and page reading work with Claude.' : 'Web search is only available with Claude. Other models build without it.';
    list.innerHTML = ''; msg.textContent = ''; ok.textContent = '';
  };
  prov.onchange = () => sync(false);
  sync(true);

  check.onclick = async () => {
    msg.textContent = ''; ok.textContent = 'Checking...'; check.disabled = true;
    try {
      const r = await json('/api/ai/models', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov.value, key: key.value.trim() || null, base_url: base.value.trim() || null }) });
      list.innerHTML = '';
      for (const m of r.models) { const o = h('option'); o.value = m; list.appendChild(o); }
      ok.textContent = r.models.length ? `Key works. ${r.models.length} models available: pick one in Model.` : 'Key works.';
      if (!model.value && r.models.length) model.value = r.models[0];
    } catch (e) { ok.textContent = ''; msg.textContent = e.message; }
    check.disabled = false;
  };

  const buttons = [];
  if (cur) buttons.push({ label: 'Remove my key', run: () => {
    json('/api/ai/keys', { method: 'DELETE' }).then(() => { d.close(); app.toast?.('Your key was removed.'); refreshAIStatus(app); }, (e) => { msg.textContent = e.message; });
    return false;
  } });
  buttons.push({ label: 'Cancel' }, { label: 'Save', primary: true, run: () => {
    msg.textContent = '';
    json('/api/ai/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: prov.value, model: model.value.trim(), key: key.value.trim() || null, base_url: base.value.trim() || null }) })
      .then((r) => { d.close(); app.toast?.(`AI set to ${spec().label}, ${r.settings.model}.`); refreshAIStatus(app); }, (e) => { msg.textContent = e.message; });
    return false;
  } });
  const d = dialog({ title: 'AI model and key', body, cls: 'acct-dlg', buttons });
}
