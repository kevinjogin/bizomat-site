// KEVOS® WORKOS interface: directory, search, workspace, results, analysis, guide and decision reports.
// Every tool is part of one KEVOS® WORKOS collection with the same features. Calculations run in the browser only.
(function () {
  const tools = window.GOCORE_TOOLS || [];
  const guides = window.WORKOS_GUIDES || {};
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const STATUS = { pass: 'PASS', warn: 'REVIEW', fail: 'FAIL', verify: 'VERIFY' };
  let activeCategory = 'All';
  let current = null; // { t, r, sens }
  let timer = 0;

  const directory = $('#tool-directory');
  const workspace = $('#tool-workspace');
  const grid = $('#tool-grid');
  const search = $('#tool-search');
  const count = $('#tool-count');
  const empty = $('#tools-empty');
  const intro = document.querySelector('.tools-intro');

  // ---------- Directory ----------
  function cardHtml(t) {
    const g = guides[t.id] || {};
    const text = [t.name, t.category, t.question, t.description, ...(t.keywords || []), ...(g.uses || []), ...(g.users || [])].join(' ').toLowerCase();
    return `<a class="tool-card" href="/tools/?tool=${encodeURIComponent(t.id)}" data-tool-id="${esc(t.id)}" data-category="${esc(t.category)}" data-search="${esc(text)}"><span class="card-top"><span class="category-label">${esc(t.category)}</span></span><h2>${esc(t.name)}</h2><p>${esc(t.question)}</p><span class="card-link">Open tool →</span></a>`;
  }
  // The page renders the cards at build time; this fallback only runs if they are missing.
  if (!grid.querySelector('[data-tool-id]')) grid.insertAdjacentHTML('afterbegin', tools.map(cardHtml).join(''));
  function renderCards() {
    const q = (search?.value || '').trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    let visible = 0;
    grid.querySelectorAll('[data-tool-id]').forEach((card) => {
      const hay = card.dataset.search || '';
      const show = (activeCategory === 'All' || card.dataset.category === activeCategory) && words.every((w) => hay.includes(w));
      card.hidden = !show;
      if (show) visible++;
    });
    count.textContent = `${visible} tool${visible === 1 ? '' : 's'}`;
    empty.hidden = visible !== 0;
  }
  search?.addEventListener('input', renderCards);
  document.querySelectorAll('[data-cat]').forEach((chip) =>
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.cat || 'All';
      document.querySelectorAll('[data-cat]').forEach((c) => {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      renderCards();
    }),
  );

  // ---------- Inputs ----------
  function sourceHint(t, f) {
    const src = guides[t.id]?.inputs?.[f.key];
    const parts = [f.hint, src ? `Source: ${src}` : ''].filter(Boolean);
    return parts.length ? `<div class="hint">${parts.map(esc).join(' ')}</div>` : '';
  }
  function fieldHtml(t, f) {
    if (f.type === 'heading') return `<h3 class="field-heading">${esc(f.label)}</h3>${f.hint ? `<p class="hint field-heading__hint">${esc(f.hint)}</p>` : ''}`;
    const id = `f-${f.key}`;
    if (f.type === 'range')
      return `<div class="field"><label for="${id}">${esc(f.label)}</label><div class="range-line"><input id="${id}" name="${esc(f.key)}" type="range" min="${f.min}" max="${f.max}" step="${f.step ?? 1}" value="${f.default}"><span class="range-value" data-range="${esc(f.key)}">${f.default}</span></div>${sourceHint(t, f)}</div>`;
    if (f.type === 'select')
      return `<div class="field"><label for="${id}">${esc(f.label)}</label><select id="${id}" name="${esc(f.key)}">${f.options.map((o) => `<option value="${esc(o[0])}"${o[0] === f.default ? ' selected' : ''}>${esc(o[1])}</option>`).join('')}</select>${sourceHint(t, f)}</div>`;
    return `<div class="field"><label for="${id}">${esc(f.label)}</label><div class="input-wrap"><input id="${id}" name="${esc(f.key)}" type="number" value="${f.default}" min="${f.min ?? ''}" max="${f.max ?? ''}" step="${f.step ?? 'any'}" inputmode="decimal">${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}</div>${sourceHint(t, f)}</div>`;
  }
  const inputFields = (t) => t.fields.filter((f) => f.type !== 'heading');
  /** Input fields grouped under the form headings that precede them ({ heading: {label: ''} } when there are none). */
  function groups(t) {
    const out = [{ heading: { label: '' }, fields: [] }];
    for (const f of t.fields) {
      if (f.type === 'heading') out.push({ heading: f, fields: [] });
      else out[out.length - 1].fields.push(f);
    }
    return out.filter((x) => x.fields.length);
  }
  function displayValue(f) {
    const el = document.querySelector(`[name="${f.key}"]`);
    if (!el) return '';
    if (f.type === 'select') return f.options.find((o) => o[0] === el.value)?.[1] ?? el.value;
    if (f.unit === '$') return `$${el.value}`;
    if (f.unit?.startsWith('$/')) return `$${el.value}/${f.unit.slice(2)}`;
    return `${el.value}${f.unit ? ` ${f.unit}` : ''}`;
  }

  // ---------- Results ----------
  const pill = (s) => `<span class="check-pill check-pill--${esc(s)}">${STATUS[s] || esc(s).toUpperCase()}</span>`;
  function renderResult(r) {
    $('#result').innerHTML = `<div class="result-kicker">WORKOS decision</div><div class="result-status ${esc(r.tone)}${r.text.length > 22 ? ' result-status--long' : ''}">${esc(r.text)}</div><div class="result-summary">${esc(r.summary)}</div><div class="metric-grid">${r.metrics.map((x) => `<div class="metric"><span>${esc(x.label)}</span><strong>${esc(x.value)}</strong></div>`).join('')}</div>${r.recommendation ? `<div class="rec"><strong>Recommendation</strong><br>${esc(r.recommendation)}</div>` : ''}${r.checks.length ? `<p class="result-checks">${['fail', 'verify', 'warn', 'pass'].map((s) => { const n = r.checks.filter((c) => c.status === s).length; return n ? `${pill(s)} ${n}` : ''; }).filter(Boolean).join(' ')} <a href="#tool-analysis">See checks</a></p>` : ''}`;
  }
  function sensRows(r, sens, limit = 8) {
    return sens.slice(0, limit).map((s) => `<tr><th scope="row">${esc(s.label)}</th><td>${esc(fmtPrimary(r.primary.fmt, s.low))}</td><td>${esc(fmtPrimary(r.primary.fmt, s.high))}</td><td>${s.flips ? `<strong class="flip">Yes</strong> (${esc(s.lowText)} / ${esc(s.highText)})` : 'No'}</td></tr>`).join('');
  }
  function analysisHtml(t, r, sens) {
    const parts = [];
    if (r.checks.length)
      parts.push(`<section class="an-block${r.checks.length > 6 ? ' an-block--wide' : ''}"><h3>Feasibility and verification checks</h3><ul class="check-list${r.checks.length > 6 ? ' check-list--cols' : ''}">${r.checks.map((c) => `<li>${pill(c.status)}<div><strong>${esc(c.label)}</strong>${c.detail ? `<span>${esc(c.detail)}</span>` : ''}</div></li>`).join('')}</ul><p class="an-note">FAIL and VERIFY items override any score or cost preference. VERIFY means the evidence needed to pass has not been supplied.</p></section>`);
    if (r.table)
      parts.push(`<section class="an-block an-block--wide"><h3>${esc(r.table.caption || 'Comparison')}</h3><div class="an-table-wrap"><table class="an-table"><thead><tr>${r.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${r.table.rows.map((row) => `<tr>${row.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div></section>`);
    if (sens.length)
      parts.push(`<section class="an-block an-block--wide"><h3>Sensitivity: each input moved ±10%</h3><p class="an-note">Effect on <strong>${esc(r.primary.label)}</strong> (currently ${esc(fmtPrimary(r.primary.fmt, r.primary.value))}). Inputs are listed from most to least influential.</p><div class="an-table-wrap"><table class="an-table"><thead><tr><th scope="col">Input</th><th scope="col">−10%</th><th scope="col">+10%</th><th scope="col">Decision changes?</th></tr></thead><tbody>${sensRows(r, sens)}</tbody></table></div></section>`);
    if (r.risks?.length)
      parts.push(`<section class="an-block an-block--wide"><h3>Risks</h3><div class="an-table-wrap"><table class="an-table"><thead><tr><th scope="col">Risk</th><th scope="col">Level</th><th scope="col">Response</th></tr></thead><tbody>${r.risks.map((x) => `<tr><th scope="row">${esc(x.risk)}</th><td>${esc(x.level)}</td><td>${esc(x.response)}</td></tr>`).join('')}</tbody></table></div></section>`);
    for (const g of r.guidance || []) parts.push(`<section class="an-block"><h3>${esc(g.title)}</h3><ul class="an-list">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`);
    if (r.actions.length) parts.push(`<section class="an-block"><h3>Next actions</h3><ol class="an-list">${r.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ol></section>`);
    const verify = [...r.verify, ...(guides[t.id]?.verify || [])];
    if (verify.length) parts.push(`<section class="an-block"><h3>Verify before relying on this result</h3><ul class="an-list">${verify.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></section>`);
    return parts.join('');
  }
  function guideHtml(t) {
    const g = guides[t.id];
    if (!g) return '';
    const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    // Rows grouped by the form's headings; a group identical to an earlier one (e.g. Candidate B and C) is listed once.
    const unitOf = (f) => f.unit || (f.type === 'range' ? `${f.min}–${f.max} score` : f.type === 'select' ? 'choice' : '');
    const seen = new Map();
    const inputs = groups(t)
      .map(({ heading, fields }) => {
        const rows = fields.map((f) => `<tr><th scope="row">${esc(f.label)}</th><td>${esc(unitOf(f))}</td><td>${esc(g.inputs?.[f.key] || '')}</td></tr>`);
        const sig = fields.map((f) => `${f.label.replace(/\b[A-C]\b/g, '')}|${unitOf(f)}|${g.inputs?.[f.key] || ''}`).join('~');
        const head = heading.label ? `<tr class="an-group"><th scope="rowgroup" colspan="3">${esc(heading.label)}${seen.has(sig) ? `: same inputs as ${esc(seen.get(sig))}` : ''}</th></tr>` : '';
        if (seen.has(sig)) return head;
        if (heading.label) seen.set(sig, heading.label);
        return head + rows.join('');
      })
      .join('');
    return `<h2 class="guide-title">How this tool works</h2><div class="guide-grid">
      <section class="guide-card"><h3>Purpose</h3><p>${esc(g.purpose)}</p></section>
      <section class="guide-card"><h3>Typical uses</h3>${list(g.uses || [])}</section>
      <section class="guide-card"><h3>Who it is for</h3>${list(g.users || [])}</section>
      <section class="guide-card guide-card--wide"><h3>Inputs, units and where to find them</h3><div class="an-table-wrap"><table class="an-table"><thead><tr><th scope="col">Input</th><th scope="col">Unit</th><th scope="col">Typical source</th></tr></thead><tbody>${inputs}</tbody></table></div></section>
      <section class="guide-card"><h3>What you get</h3>${list(g.outputs || [])}</section>
      <section class="guide-card"><h3>Method and formulas</h3><ol class="guide-method">${(g.method || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ol></section>
      <section class="guide-card"><h3>Limitations</h3>${list(g.limitations || [])}</section>
      <section class="guide-card"><h3>Interpreting the result</h3>${list(g.interpret || [])}</section>
      ${g.refs?.length ? `<section class="guide-card guide-card--wide"><h3>References</h3>${list(g.refs)}</section>` : ''}
    </div>`;
  }

  // ---------- Decision report ----------
  function reportBody(t, r, sens) {
    const g = guides[t.id] || {};
    const when = new Date();
    const stamp = when.toLocaleString('en-AU', { dateStyle: 'long', timeStyle: 'short' });
    const rows = groups(t)
      .map(({ heading, fields }) => (heading.label ? `<tr><th colspan="3" class="wr-group">${esc(heading.label)}</th></tr>` : '') + fields.map((f) => `<tr><th>${esc(f.label)}</th><td>${esc(displayValue(f))}</td><td>${esc(g.inputs?.[f.key] || '')}</td></tr>`).join(''))
      .join('');
    const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    const verify = [...r.verify, ...(g.verify || [])];
    return `<article class="wr">
<header class="wr-head"><p class="wr-brand">KEVOS® WORKOS · Decision report</p><h1>${esc(t.name)}</h1><p class="wr-meta">${esc(t.question)} · Generated ${esc(stamp)} · ${esc(shareUrl(t))}</p></header>
<section><h2>Decision</h2><p class="wr-decision wr-${esc(r.tone)}">${esc(r.text)}</p><p>${esc(r.summary)}</p>${r.recommendation ? `<p><strong>Recommendation:</strong> ${esc(r.recommendation)}</p>` : ''}</section>
${g.purpose ? `<section><h2>Purpose</h2><p>${esc(g.purpose)}</p></section>` : ''}
<section><h2>Inputs and assumptions</h2><table><thead><tr><th>Input</th><th>Value</th><th>Source to confirm</th></tr></thead><tbody>${rows}</tbody></table></section>
${g.method?.length ? `<section><h2>Method and calculations</h2><ol>${g.method.map((x) => `<li>${esc(x)}</li>`).join('')}</ol></section>` : ''}
<section><h2>Results</h2><table><tbody>${r.metrics.map((x) => `<tr><th>${esc(x.label)}</th><td>${esc(x.value)}</td></tr>`).join('')}${r.primary && Number.isFinite(r.primary.value) ? `<tr><th>${esc(r.primary.label)} (primary measure)</th><td>${esc(fmtPrimary(r.primary.fmt, r.primary.value))}</td></tr>` : ''}</tbody></table></section>
${r.checks.length ? `<section><h2>Feasibility and verification checks</h2><table><thead><tr><th>Check</th><th>Status</th><th>Detail</th></tr></thead><tbody>${r.checks.map((c) => `<tr><th>${esc(c.label)}</th><td class="wr-st wr-st-${esc(c.status)}">${STATUS[c.status] || esc(c.status)}</td><td>${esc(c.detail)}</td></tr>`).join('')}</tbody></table></section>` : ''}
${r.table ? `<section><h2>${esc(r.table.caption || 'Comparison')}</h2><table><thead><tr>${r.table.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${r.table.rows.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></section>` : ''}
${sens.length ? `<section><h2>Sensitivity (each input ±10%)</h2><p>Effect on ${esc(r.primary.label)}, currently ${esc(fmtPrimary(r.primary.fmt, r.primary.value))}.</p><table><thead><tr><th>Input</th><th>−10%</th><th>+10%</th><th>Decision changes?</th></tr></thead><tbody>${sensRows(r, sens, 12)}</tbody></table></section>` : ''}
${r.risks?.length ? `<section><h2>Risks</h2><table><thead><tr><th>Risk</th><th>Level</th><th>Response</th></tr></thead><tbody>${r.risks.map((x) => `<tr><th>${esc(x.risk)}</th><td>${esc(x.level)}</td><td>${esc(x.response)}</td></tr>`).join('')}</tbody></table></section>` : ''}
${(r.guidance || []).map((x) => `<section><h2>${esc(x.title)}</h2>${list(x.items)}</section>`).join('')}
${r.actions.length ? `<section><h2>Next actions</h2><ol>${r.actions.map((a) => `<li>${esc(a)}</li>`).join('')}</ol></section>` : ''}
${verify.length ? `<section><h2>Verification required</h2>${list(verify)}</section>` : ''}
${g.limitations?.length ? `<section><h2>Limitations</h2>${list(g.limitations)}</section>` : ''}
<footer class="wr-foot"><p>WORKOS tools are screening and decision-support utilities. Results depend entirely on the inputs and assumptions above. Verify important financial, engineering, safety, legal or operational decisions using appropriate professional standards and your organisation’s approved data.</p><p>KEVOS® | kevos.com/tools/</p></footer>
</article>`;
  }
  const REPORT_CSS = `body{margin:0;background:#f6f5f1;color:#121211;font:15px/1.55 'Segoe UI',Arial,sans-serif}.wr{max-width:880px;margin:24px auto;padding:36px 40px;background:#fff;border-top:8px solid #ff6a13}.wr h1{margin:.2em 0;font-size:28px}.wr h2{margin:28px 0 8px;font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#c2410c}.wr-brand{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#c2410c;font-weight:700}.wr-meta{color:#67645d;font-size:13px;word-break:break-all}.wr-decision{font-size:24px;font-weight:700;margin:4px 0}.wr-good{color:#1f6b45}.wr-warn{color:#c2410c}.wr-bad{color:#b3261e}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;vertical-align:top;padding:7px 8px;border-bottom:1px solid #e3e0d8}thead th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#67645d}.wr-group{padding-top:14px;color:#c2410c;font-size:12px;letter-spacing:.08em;text-transform:uppercase}.wr-st{font-weight:700}.wr-st-pass{color:#1f6b45}.wr-st-warn{color:#c2410c}.wr-st-fail{color:#b3261e}.wr-st-verify{color:#7a4b00}.wr-foot{margin-top:32px;padding-top:12px;border-top:1px solid #e3e0d8;color:#67645d;font-size:12.5px}@media print{body{background:#fff}.wr{margin:0;max-width:none;padding:0;border-top:6px solid #ff6a13}}`;

  function downloadReport() {
    if (!current) return;
    const { t, r, sens } = current;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; // local date, not UTC
    const html = `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t.name)} · KEVOS® WORKOS decision report</title><style>${REPORT_CSS}</style></head><body>${reportBody(t, r, sens)}</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `kevos-workos-${t.id}-${date}.html`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    flash('Report downloaded. Open it in a browser to read or print it.');
  }
  function printReport() {
    if (!current) return;
    const box = $('#print-report');
    if (box.parentElement !== document.body) document.body.append(box); // printed on its own; see tools.css
    box.innerHTML = reportBody(current.t, current.r, current.sens);
    box.hidden = false;
    document.body.classList.add('is-printing-report');
    const done = () => {
      document.body.classList.remove('is-printing-report');
      box.hidden = true;
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    window.print();
  }
  function shareUrl(t) {
    const u = new URL(location.href);
    u.search = '';
    u.hash = '';
    u.searchParams.set('tool', t.id);
    for (const f of inputFields(t)) {
      const el = document.querySelector(`[name="${f.key}"]`);
      if (el && String(el.value) !== String(f.default)) u.searchParams.set(f.key, el.value);
    }
    return u.href;
  }
  function summaryText(t, r) {
    return [`${t.name} (KEVOS® WORKOS)`, `Decision: ${r.text}`, r.summary, ...r.metrics.map((x) => `${x.label}: ${x.value}`), ...r.checks.filter((c) => c.status !== 'pass').map((c) => `${STATUS[c.status]}: ${c.label}${c.detail ? ` (${c.detail})` : ''}`), shareUrl(t)].join('\n');
  }
  function flash(text) {
    const el = $('#tool-flash');
    if (!el) return;
    el.textContent = text;
    clearTimeout(flash.t);
    flash.t = setTimeout(() => (el.textContent = ''), 4000);
  }

  // ---------- Workspace ----------
  function analyse(t) {
    const r = calc(t.id);
    const sens = sensitivity(t, r);
    current = { t, r, sens };
    renderResult(r);
    $('#tool-analysis').innerHTML = analysisHtml(t, r, sens);
  }
  function applyParams(t) {
    const params = new URLSearchParams(location.search);
    for (const f of inputFields(t)) {
      if (!params.has(f.key)) continue;
      const el = document.querySelector(`[name="${f.key}"]`);
      const v = params.get(f.key);
      if (!el) continue;
      if (f.type === 'select') {
        if (f.options.some((o) => o[0] === v)) el.value = v;
      } else if (v !== '' && Number.isFinite(Number(v))) {
        el.value = v;
        const out = document.querySelector(`[data-range="${f.key}"]`);
        if (out) out.textContent = v;
      }
    }
  }
  function buildTool(t) {
    $('#tool-category').textContent = `${t.category} · KEVOS® WORKOS`;
    $('#tool-name').textContent = t.name;
    $('#tool-question').textContent = t.question;
    $('#tool-description').textContent = t.description;
    const form = $('#tool-form');
    form.innerHTML = `${t.fields.map((f) => fieldHtml(t, f)).join('')}<div class="form-actions"><button class="btn" type="submit">Analyse</button><button class="btn secondary" type="button" id="reset">Reset to examples</button></div><div class="privacy-note">Your inputs stay in this browser. KEVOS® does not send these calculations to a server. The example values are illustrations, not recommendations.</div>`;
    applyParams(t);
    form.onsubmit = (e) => {
      e.preventDefault();
      analyse(t);
      // On narrow screens the result sits below the form: bring it into view after an explicit Analyse.
      const box = $('#result').getBoundingClientRect();
      if (box.top > innerHeight || box.bottom < 0) $('#result').scrollIntoView({ block: 'start' });
    };
    form.oninput = (e) => {
      if (e.target.type === 'range') {
        const o = document.querySelector(`[data-range="${e.target.name}"]`);
        if (o) o.textContent = e.target.value;
      }
      clearTimeout(timer);
      timer = setTimeout(() => analyse(t), 180);
    };
    form.onchange = () => analyse(t);
    $('#reset').onclick = () => {
      for (const f of inputFields(t)) {
        const el = document.querySelector(`[name="${f.key}"]`);
        if (!el) continue;
        el.value = f.default;
        const o = document.querySelector(`[data-range="${f.key}"]`);
        if (o) o.textContent = f.default;
      }
      analyse(t);
    };
    $('#copy-result').onclick = async () => {
      try {
        await navigator.clipboard.writeText(summaryText(t, current.r));
        flash('Summary copied.');
      } catch {
        flash('Copy is not available in this browser.');
      }
    };
    $('#download-report').onclick = downloadReport;
    $('#print-result').onclick = printReport;
    $('#share-tool').onclick = async () => {
      const url = shareUrl(t);
      try {
        if (navigator.share) await navigator.share({ title: `${t.name} (KEVOS® WORKOS)`, text: t.question, url });
        else {
          await navigator.clipboard.writeText(url);
          flash('Link with your inputs copied.');
        }
      } catch {
        /* sharing cancelled */
      }
    };
    $('#tool-guide').innerHTML = guideHtml(t);
    analyse(t);
  }
  function openTool(id, push = true) {
    const t = tools.find((x) => x.id === id);
    if (!t) return;
    if (push) {
      const u = new URL(location.href);
      u.search = '';
      u.searchParams.set('tool', id);
      history.pushState({ tool: id }, '', u);
    }
    buildTool(t);
    directory.hidden = true;
    if (intro) intro.hidden = true;
    workspace.hidden = false;
    document.title = `${t.name} | KEVOS® WORKOS`;
    workspace.scrollIntoView({ block: 'start' });
  }
  function closeTool(push = true) {
    workspace.hidden = true;
    directory.hidden = false;
    if (intro) intro.hidden = false;
    current = null;
    if (push) {
      const u = new URL(location.href);
      u.search = '';
      history.pushState({}, '', u);
    }
    document.title = 'WORKOS calculators and decision tools | KEVOS®';
    directory.scrollIntoView({ block: 'start' });
  }
  grid.addEventListener('click', (e) => {
    const c = e.target.closest('[data-tool-id]');
    if (!c || e.button > 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; // let modified clicks open a new tab
    e.preventDefault();
    openTool(c.dataset.toolId);
  });
  $('#back-tools').addEventListener('click', () => closeTool());
  window.addEventListener('popstate', () => {
    const id = new URLSearchParams(location.search).get('tool');
    id ? openTool(id, false) : closeTool(false);
  });
  // Read-only hooks for automated tests and debugging; nothing on the page depends on them.
  window.WORKOS_UI = { reportBody, shareUrl, summaryText, guideHtml, analysisHtml, state: () => current };
  const initial = new URLSearchParams(location.search).get('tool');
  if (initial) openTool(initial, false);
  renderCards();
})();
