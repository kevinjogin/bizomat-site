// Built-in AI status, and the key form (Connect AI > Built-in AI, connect.js): bring your own key (Claude, OpenAI, Gemini, OpenRouter or any
// OpenAI-compatible provider). The key goes to the server once and is stored encrypted on the account;
// the page only ever gets back the provider, model and the last four characters.


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

// The key form is the "Built-in AI" tab of Connect AI (connect.js).
export function aiKeyDialog(app) {
  return import('./connect.js').then((m) => m.connectDialog(app, 'key'));
}
