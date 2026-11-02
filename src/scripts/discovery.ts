// KEVOS® discovery on the homepage: the question box and its results. The pipeline (catalogue shortlist → Workers AI
// terms and picks → ranking of real catalogue entries) is src/lib/discovery/client.ts. Everything shown is a catalogue
// entry; nothing is stored in the browser.
import { tokens, type Hit, type Outcome } from '../lib/discovery/search.ts';
import { createDiscovery, VisitorError, type Intent } from '../lib/discovery/client.ts';

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

  function render(question: string, outcome: Outcome, intent: Intent | null) {
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
    const limit = outcome.mode === 'clarify' || intent?.clarify ? 3 : 5;
    for (const g of [group('Recommended tools', outcome.tools.slice(0, limit)), group('Knowledge and references', outcome.readings.slice(0, limit)), group(hasResults ? 'Related resources' : 'Closest resources', outcome.related, true)]) if (g) block.append(g);
    if (outcome.mode === 'none' || !hasResults) {
      const suggest = el('p', 'dr-say dr-say--sub', 'Is there a tool or topic we should add? ');
      suggest.append(link('/contact/', 'Suggest a new tool or topic →'));
      block.append(suggest);
    }
    thread!.prepend(block);
    while (thread!.children.length > MAX_EXCHANGES) thread!.lastElementChild?.remove();
  }

  // ---------- Asking ----------
  function setBusy(on: boolean, message = '') {
    busy = on;
    form!.classList.toggle('is-busy', on);
    submitBtn!.disabled = on;
    form!.setAttribute('aria-busy', String(on));
    statusEl!.textContent = message;
  }

  async function ask(raw: string, context = previous) {
    const question = raw.replace(/\s+/g, ' ').trim();
    if (busy) return;
    if (!question) { statusEl!.textContent = 'Please type a question or choose an example.'; input!.focus(); return; }
    if (question.length > 500) { statusEl!.textContent = 'Please keep your question under 500 characters.'; return; }
    setBusy(true, 'Finding the right tools and readings…');
    try {
      const { outcome, intent } = await discovery.ask(question, context);
      results!.hidden = false;
      render(question, outcome, intent);
      previous = question;
      const n = outcome.tools.length + outcome.readings.length;
      setBusy(false, n ? `Found ${n} resource${n === 1 ? '' : 's'}.` : 'No matching resource found.');
      track({ type: outcome.mode === 'results' && n ? 'search' : outcome.mode === 'clarify' ? 'clarify' : 'none', terms: tokens(question).slice(0, 8) });
      input!.value = '';
      clearBtn!.hidden = true;
      input!.placeholder = 'Ask a follow-up or a new question...';
      results!.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      document.getElementById('discover-title')?.focus({ preventScroll: true });
    } catch (err) {
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
  for (const b of document.querySelectorAll<HTMLButtonElement>('[data-discover-example]')) b.addEventListener('click', () => { input.value = b.textContent ?? ''; ask(input.value, ''); });
  document.querySelector('[data-discover-again]')?.addEventListener('click', () => { input.focus(); input.scrollIntoView({ block: 'center' }); });
  // A link such as /?q=... (or the site search's fallback) runs the question straight away.
  const initial = new URLSearchParams(location.search).get('q');
  if (initial) { input.value = initial.slice(0, 500); ask(input.value, ''); }
}
