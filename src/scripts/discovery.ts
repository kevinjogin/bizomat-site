// KEVOS® discovery (homepage, Tools and Library headers): the question box and its results. The pipeline (catalogue shortlist → Workers AI
// terms and picks → ranking of real catalogue entries) is src/lib/discovery/client.ts. Everything shown is a catalogue
// entry; nothing is stored in the browser.
import { tokens, type Hit, type Outcome } from '../lib/discovery/search.ts';
import { createDiscovery, VisitorError, type Intent } from '../lib/discovery/client.ts';
import type { PathLink, SolutionPath } from '../lib/discovery/plan.ts';
import { localIntent, type Depth, type Intent as LearnIntent } from '../lib/learning/retrieve.ts';
import { learnIntent, VisitorError as LearnVisitorError } from '../lib/learning/client.ts';
import { DEPTH_LABEL } from '../lib/learning/course.ts';

const form = document.querySelector<HTMLFormElement>('[data-discover-form]');
const input = document.querySelector<HTMLTextAreaElement>('[data-discover-input]');
const results = document.querySelector<HTMLElement>('[data-discover-results]');
const thread = document.querySelector<HTMLElement>('[data-discover-thread]');
const statusEl = document.querySelector<HTMLElement>('[data-discover-status]');
const clearBtn = document.querySelector<HTMLButtonElement>('[data-discover-clear]');
const submitBtn = document.querySelector<HTMLButtonElement>('[data-discover-submit]');
const MAX_EXCHANGES = 5;

if (form && input && results && thread && statusEl && clearBtn && submitBtn) {
  const discovery = createDiscovery();
  let previous = '';
  let busy = false;

  const device = () => (matchMedia('(max-width: 700px)').matches ? 'mobile' : 'desktop');
  /** Anonymous, aggregate statistics (search terms, not the question). Ignored unless the site enables them. */
  const track = (event: Record<string, unknown>) => {
    try {
      fetch('/api/discover/event', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...event, device: device() }) }).catch(() => {});
    } catch { /* statistics are optional */ }
  };

  // ---------- Rendering (DOM nodes only; no HTML strings from data) ----------
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const link = (href: string, text: string, cls?: string, hit?: Hit) => {
    const a = el('a', cls, text);
    a.href = href;
    if (hit) a.addEventListener('click', () => track({ type: 'click', kind: hit.kind, id: hit.id }));
    return a;
  };

  function card(h: Hit, compact = false): HTMLElement {
    const li = el('li', `dr-card dr-card--${h.kind}${compact ? ' dr-card--compact' : ''}${h.ai ? ' dr-card--ai' : ''}`);
    li.append(el('p', 'dr-card__kind', h.kind === 'tool' ? `Tool${h.context ? ` · ${h.context}` : ''}` : h.kind === 'chapter' ? 'Library chapter' : `Library book${h.context ? ` · ${h.context}` : ''}`));
    const title = el('h4', 'dr-card__title');
    title.append(link(h.url, h.title, undefined, h));
    li.append(title);
    if (h.kind === 'chapter' && h.secondary) {
      const book = el('p', 'dr-card__book', 'In ');
      book.append(link(h.secondary.url, h.secondary.label, undefined, h));
      li.append(book);
    }
    if (!compact) li.append(el('p', 'dr-card__desc', h.description));
    li.append(el('p', 'dr-card__why', `Why: ${h.reason.replace(/^Matches /, 'matches ')}.`));
    const actions = el('p', 'dr-card__actions');
    if (h.kind === 'tool') actions.append(link(h.secondary!.url, 'Open tool →', 'dr-card__cta', h));
    else actions.append(link(h.url, 'Read now →', 'dr-card__cta', h));
    li.append(actions);
    return li;
  }
  function group(title: string, hits: Hit[], compact = false): HTMLElement | null {
    if (!hits.length) return null;
    const box = el('div', 'dr-group');
    box.append(el('h3', 'dr-group__title', title));
    const ul = el('ul', `dr-list${compact ? ' dr-list--compact' : ''}`);
    for (const h of hits) ul.append(card(h, compact));
    box.append(ul);
    return box;
  }
  function chips(options: string[], base: string): HTMLElement {
    const ul = el('ul', 'dr-options');
    for (const o of options) {
      const li = el('li');
      const b = el('button', 'dq__chip', o);
      b.type = 'button';
      b.addEventListener('click', () => ask(`${base}: ${o}`, ''));
      li.append(b);
      ul.append(li);
    }
    return ul;
  }

  // ---------- Your Solution Path ----------
  const pathLink = (l: PathLink) => {
    const a = link(l.url, l.title);
    a.addEventListener('click', () => track({ type: 'click', kind: l.kind, id: l.kind === 'tool' ? (l.app ?? '').replace('/tools/?tool=', '') : l.url }));
    return a;
  };
  function row(dl: HTMLElement, label: string, body: Node | string, source?: string) {
    dl.append(el('dt', 'sp__label', label));
    const dd = el('dd', 'sp__value');
    dd.append(body);
    if (source) dd.append(el('span', 'sp__src', source));
    dl.append(dd);
  }
  function linkList(links: PathLink[], tools = false): HTMLElement {
    const ul = el('ul', 'sp__links');
    for (const l of links) {
      const li = el('li');
      li.append(pathLink(l));
      if (l.context) li.append(el('span', 'sp__ctx', ` · ${l.context}`));
      if (l.verified) li.append(el('span', 'sp__tag', 'verified link to this tool'));
      if (tools && l.app) { const open = link(l.app, 'Open tool →', 'sp__open'); open.addEventListener('click', () => track({ type: 'click', kind: 'tool', id: (l.app ?? '').replace('/tools/?tool=', '') })); li.append(' ', open); }
      ul.append(li);
    }
    return ul;
  }
  const plainList = (items: string[]) => { const ul = el('ul', 'sp__items'); for (const t of items) ul.append(el('li', undefined, t)); return ul; };

  function pathSection(path: SolutionPath, objective: string | undefined, pending: boolean): HTMLElement {
    const sec = el('section', 'sp');
    sec.setAttribute('aria-label', 'Your Solution Path');
    const head = el('div', 'sp__head');
    head.append(el('h3', 'sp__title', 'Your Solution Path'));
    const meta = el('p', 'sp__meta');
    meta.append(el('span', 'sp__type', path.typeLabel), ' ', el('span', 'sp__by', path.source === 'ai' ? 'Steps suggested by KEVOS® AI' : 'Steps from the KEVOS® workflow for this type of question'));
    head.append(meta);
    sec.append(head);
    if (objective) { const p = el('p', 'sp__objective'); p.append(el('strong', undefined, 'Your objective: '), objective.charAt(0).toUpperCase() + objective.slice(1) + '.'); sec.append(p); }
    if (pending) sec.append(el('p', 'sp__pending', 'KEVOS® AI is tailoring these steps to your question…'));
    if (path.missing.length) {
      const box = el('div', 'sp__missing');
      box.append(el('p', 'sp__boxtitle', 'To tailor this path, it would help to know:'), plainList(path.missing));
      box.append(el('p', 'sp__hint', 'Add these details in a follow-up question.'));
      sec.append(box);
    }
    const ol = el('ol', 'sp__steps');
    path.steps.forEach((s, i) => {
      const li = el('li', 'sp__step');
      li.append(el('h4', 'sp__do', `Step ${i + 1}: ${s.do}`));
      const dl = el('dl', 'sp__grid');
      if (s.why) row(dl, 'Why it matters', s.why);
      if (s.reads.length) row(dl, 'What to read', linkList(s.reads));
      if (s.tools.length) row(dl, 'Which tool to use', linkList(s.tools, true));
      if (s.inputs.length) row(dl, s.inputsFrom === 'tool' ? 'Required inputs' : 'Information to gather', s.inputsMore ? (() => { const ul = plainList(s.inputs); ul.append(el('li', 'sp__more', `and ${s.inputsMore} more in the tool`)); return ul; })() : plainList(s.inputs), s.inputsFrom === 'tool' ? 'from the tool' : 'suggested');
      if (s.output.length) row(dl, 'Expected output', plainList(s.output), 'from the tool');
      if (s.checkFact || s.checkTip) {
        const box = el('div');
        if (s.checkFact) { const p = el('p', 'sp__check'); p.append(s.checkFact, el('span', 'sp__src', 'from the tool guide')); box.append(p); }
        if (s.checkTip) { const p = el('p', 'sp__check'); p.append(s.checkTip, el('span', 'sp__src', 'suggested')); box.append(p); }
        row(dl, 'How to check the result', box);
      }
      li.append(dl);
      if (s.gap) li.append(el('p', 'sp__gap', s.gap));
      ol.append(li);
    });
    sec.append(ol);
    if (path.assumptions.length) { const box = el('div', 'sp__assume'); box.append(el('p', 'sp__boxtitle', 'Assumptions (check these apply to you)'), plainList(path.assumptions)); sec.append(box); }
    const out = el('p', 'sp__outcome'); out.append(el('strong', undefined, 'Expected outcome: '), path.outcome); sec.append(out);
    sec.append(el('p', 'sp__legend', 'Inputs, outputs and checks marked “from the tool” come from the tools themselves; the steps and their order are recommendations. KEVOS® AI never calculates: every number comes from a tool when you run it.'));
    return sec;
  }

  function render(question: string, outcome: Outcome, intent: Intent | null, path: SolutionPath | null = null, pending = false, replace?: HTMLElement): HTMLElement {
    const block = el('article', 'dr-exchange');
    block.append(el('p', 'dr-exchange__q', question));
    const say = el('div', 'dr-exchange__a');
    const hasResults = outcome.tools.length + outcome.readings.length > 0;
    const understood = intent?.summary ? `I understand you're trying to ${intent.summary}. ` : '';
    if (intent?.outOfScope) {
      say.append(el('p', 'dr-say', 'That looks outside what KEVOS® covers. KEVOS® has engineering, manufacturing, operations, project and business tools and books, so it cannot help with this one.'));
    } else if (outcome.mode === 'none' || !hasResults) {
      say.append(el('p', 'dr-say', `${understood}KEVOS® could not find an existing tool or reading that fits this question.`));
      if (outcome.related.length) say.append(el('p', 'dr-say dr-say--sub', 'These are the closest resources we have:'));
    } else if (intent?.clarify && intent.options?.length) {
      say.append(el('p', 'dr-say', `${understood}${intent.clarify}`));
      say.append(chips(intent.options, question));
      say.append(el('p', 'dr-say dr-say--sub', 'Meanwhile, these may help:'));
    } else if (outcome.mode === 'clarify' && outcome.clarify) {
      say.append(el('p', 'dr-say', outcome.clarify.question));
      say.append(chips(outcome.clarify.options, question));
      say.append(el('p', 'dr-say dr-say--sub', 'Or start with these:'));
    } else {
      const about = outcome.concepts.length ? ` about ${outcome.concepts.slice(0, 3).join(', ')}` : '';
      say.append(el('p', 'dr-say', understood ? `${understood}I've found some resources that may help.` : `Here are the resources that best match your question${about}.`));
    }
    if (outcome.corrections.length) say.append(el('p', 'dr-say dr-say--sub', `Searched for ${outcome.corrections.map((c) => `“${c.to}” (you typed “${c.from}”)`).join(', ')}.`));
    block.append(say);
    if (path) block.append(pathSection(path, intent?.summary, pending));
    if (path) block.append(el('h3', 'dr-all', 'All matching resources'));
    const limit = outcome.mode === 'clarify' || intent?.clarify ? 3 : 5;
    for (const g of [group('Recommended tools', outcome.tools.slice(0, limit)), group('Knowledge and references', outcome.readings.slice(0, limit)), group(hasResults ? 'Related resources' : 'Closest resources', outcome.related, true)]) if (g) block.append(g);
    if (outcome.mode === 'none' || !hasResults) {
      const suggest = el('p', 'dr-say dr-say--sub', 'Is there a tool or topic we should add? ');
      suggest.append(link('/contact/', 'Suggest a new tool or topic →'));
      block.append(suggest);
    }
    if (replace?.isConnected) replace.replaceWith(block);
    else thread!.prepend(block);
    while (thread!.children.length > MAX_EXCHANGES) thread!.lastElementChild?.remove();
    return block;
  }

  // ---------- Asking ----------
  function setBusy(on: boolean, message = '') {
    busy = on;
    form!.classList.toggle('is-busy', on);
    submitBtn!.disabled = on;
    form!.setAttribute('aria-busy', String(on));
    statusEl!.textContent = message;
  }

  // ---------- Learning paths (src/scripts/learning-ui.ts, loaded on first use) ----------
  const title = document.getElementById('discover-title');
  const reveal = () => {
    results!.hidden = false;
    results!.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    title?.focus({ preventScroll: true });
  };
  const done = () => { input!.value = ''; clearBtn!.hidden = true; input!.placeholder = 'Ask a follow-up, or describe something else you want to learn...'; };

  /** One concise question when essential information is missing, with the choice to build anyway. */
  function clarifyCard(question: string, intent: LearnIntent) {
    const block = el('article', 'dr-exchange');
    block.append(el('p', 'dr-exchange__q', question));
    block.append(el('p', 'dr-say', intent.clarify!));
    const opts = el('ul', 'dr-options');
    for (const o of intent.options ?? []) { const li = el('li'); const b = el('button', 'dq__chip', o); b.type = 'button'; b.addEventListener('click', () => ask(`${question} (${o})`, '', { skipClarify: true })); li.append(b); opts.append(li); }
    const anyway = el('li'); const b = el('button', 'dq__chip', 'Build it anyway →'); b.type = 'button'; b.addEventListener('click', () => ask(question, '', { skipClarify: true })); anyway.append(b); opts.append(anyway);
    block.append(opts);
    thread!.prepend(block);
    while (thread!.children.length > MAX_EXCHANGES) thread!.lastElementChild?.remove();
  }

  async function ask(raw: string, context = previous, opts: { skipClarify?: boolean; depth?: Depth } = {}) {
    const question = raw.replace(/\s+/g, ' ').trim();
    if (busy) return;
    if (!question) { statusEl!.textContent = 'Please describe what you would like to learn or achieve, or choose an example.'; input!.focus(); return; }
    if (question.length > 1000) { statusEl!.textContent = 'Please keep it under 1,000 characters.'; return; }
    setBusy(true, 'Understanding what you want to learn or achieve…');
    let intent: LearnIntent;
    let engine;
    try {
      engine = await discovery.loadEngine();
      const local = localIntent(question, engine);
      const ai = await learnIntent(question, context);
      intent = ai ? { ...ai, source: 'ai', topics: ai.topics.length ? ai.topics : local.topics } : local;
    } catch (err) {
      setBusy(false, err instanceof LearnVisitorError ? err.message : 'Sorry, KEVOS® could not load its catalogue. Please check your connection and try again.');
      return;
    }
    if (opts.depth) intent.depth = opts.depth;
    previous = question;
    if (intent.outOfScope) {
      results!.hidden = false;
      render(question, { mode: 'none', tools: [], readings: [], related: [], concepts: [], corrections: [] }, { terms: [], outOfScope: true });
      reveal(); done();
      setBusy(false, 'That subject is outside what KEVOS® covers.');
      return;
    }
    if (intent.clarify && intent.options?.length && !opts.skipClarify) {
      results!.hidden = false;
      if (title) title.textContent = 'Your learning path';
      clarifyCard(question, intent);
      reveal(); done();
      setBusy(false, 'One question before KEVOS® builds your path.');
      return;
    }
    if (intent.depth === 'quick') { busy = false; await askQuick(question, context); return; }
    try {
      const [{ startCourse }, details] = await Promise.all([import('./learning-ui.ts'), discovery.loadDetails()]);
      if (title) title.textContent = 'Your learning path';
      const view = startCourse({
        engine, details, track,
        onQuick: (q) => { void askQuick(q, ''); },
        status: (m) => { if (!busy) statusEl!.textContent = m; },
        mount: (node) => { thread!.prepend(node); while (thread!.children.length > MAX_EXCHANGES) thread!.lastElementChild?.remove(); reveal(); },
      }, question, intent, null);
      done();
      setBusy(false, view ? `Building your ${DEPTH_LABEL[intent.depth].toLowerCase()}…` : 'KEVOS® could not find Library material for this yet.');
      if (!view) { busy = false; await askQuick(question, context); }
    } catch {
      setBusy(false, 'Sorry, the learning path could not be loaded. Please try again.');
    }
  }

  /** Quick Understanding: the solution path and matching resources (the original Ask KEVOS answer). */
  async function askQuick(raw: string, context = previous) {
    const question = raw.replace(/\s+/g, ' ').trim().slice(0, 500);
    if (busy) return;
    if (title) title.textContent = 'Your resources';
    setBusy(true, 'Finding the right tools and readings…');
    // A keyword-based path appears at once; the AI-guided path replaces it when it arrives.
    let shown: HTMLElement | null = null;
    let finished = false;
    const early = discovery.draft(question, context).then((d) => {
      if (finished || !d.path) return;
      shown = render(question, d.outcome, null, d.path, true);
      reveal();
      statusEl!.textContent = 'Showing a first path. KEVOS® AI is tailoring the steps…';
    }).catch(() => {});
    try {
      const { outcome, intent, path } = await discovery.ask(question, context);
      finished = true;
      await early;
      const first = !shown;
      render(question, outcome, intent, path, false, shown ?? undefined);
      if (first) reveal();
      previous = question;
      const n = outcome.tools.length + outcome.readings.length;
      setBusy(false, n ? `Found ${n} resource${n === 1 ? '' : 's'}.` : 'No matching resource found.');
      track({ type: outcome.mode === 'results' && n ? 'search' : outcome.mode === 'clarify' ? 'clarify' : 'none', terms: tokens(question).slice(0, 8) });
      done();
    } catch (err) {
      finished = true;
      // The first path stays on screen if the AI step is refused (rate limit) after it appeared.
      if (shown) { const p = (shown as HTMLElement).querySelector('.sp__pending'); p?.remove(); }
      const msg = err instanceof VisitorError ? err.message : 'Sorry, the resource list could not be loaded. Please check your connection and try again.';
      setBusy(false, msg);
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });
  input.addEventListener('input', () => { clearBtn.hidden = !input.value; if (statusEl.textContent && !busy) statusEl.textContent = ''; });
  input.addEventListener('focus', () => { discovery.loadEngine().catch(() => {}); }, { once: true }); // warm the catalogue while the visitor types
  clearBtn.addEventListener('click', () => { input.value = ''; clearBtn.hidden = true; input.focus(); });
  // An example fills the box (it can be edited before building the path).
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-discover-example]')) b.addEventListener('click', () => {
    input.value = b.textContent?.trim() ?? '';
    clearBtn.hidden = !input.value;
    previous = '';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    if (!busy) statusEl.textContent = 'Edit it if you like, then choose Build My Learning Path.';
    discovery.loadEngine().catch(() => {});
  });
  document.querySelector('[data-discover-again]')?.addEventListener('click', () => { input.focus(); input.scrollIntoView({ block: 'center' }); });
  // A link such as /?q=... (or the site search's fallback) runs the question straight away.
  const initial = form.hasAttribute('data-discover-autorun') ? new URLSearchParams(location.search).get('q') : null;
  if (initial) { input.value = initial.slice(0, 1000); ask(input.value, ''); }
}
