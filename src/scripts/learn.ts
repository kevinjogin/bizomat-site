// The Knowledge Centre's two interactive parts (/learn/): the step-by-step tutorials and the search. Both enhance plain
// HTML that already works without JavaScript (every step listed; the search form leads to /learn/ with the question).
// Nothing here talks to the ERP or changes anyone's records.

interface Entry {
  kind: 'guide' | 'tutorial' | 'question' | 'button' | 'workflow';
  title: string;
  in: string;
  text: string;
  url: string;
  status: string;
}

const KIND_LABEL: Record<Entry['kind'], string> = { guide: 'Guide', tutorial: 'Tutorial', question: 'Question', button: 'Button', workflow: 'Workflow' };

// ------------------------------------------------------------------ tutorials

function stepper(root: HTMLElement): void {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const nav = root.querySelector<HTMLElement>('[data-nav]');
  const progress = root.querySelector<HTMLElement>('[data-progress]');
  const text = root.querySelector<HTMLElement>('[data-progress-text]');
  const bar = root.querySelector<HTMLElement>('[data-progress-bar]');
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const finish = root.querySelector<HTMLElement>('[data-finish]');
  const all = root.querySelector<HTMLButtonElement>('[data-all]');
  const after = root.querySelector<HTMLElement>('[data-after]');
  if (!steps.length || !nav || !progress || !prev || !next || !all) return;
  let i = 0;
  let showAll = false;
  const render = () => {
    steps.forEach((s, k) => (s.hidden = !showAll && k !== i));
    const last = i === steps.length - 1;
    prev.disabled = i === 0;
    prev.hidden = showAll;
    next.hidden = showAll || last;
    if (finish) finish.hidden = showAll || !last;
    if (after) after.hidden = !showAll && !last;
    progress.hidden = showAll;
    if (text) text.textContent = `Step ${i + 1} of ${steps.length}`;
    if (bar) bar.style.width = `${Math.round(((i + 1) / steps.length) * 100)}%`;
    all.textContent = showAll ? 'One step at a time' : 'Show all steps';
  };
  const go = (k: number) => {
    i = Math.max(0, Math.min(steps.length - 1, k));
    render();
    steps[i].querySelector('h4')?.focus?.();
  };
  steps.forEach((s) => s.querySelector('h4')?.setAttribute('tabindex', '-1'));
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  all.addEventListener('click', () => {
    showAll = !showAll;
    render();
  });
  if (finish && finish.tagName === 'BUTTON') finish.addEventListener('click', () => { showAll = true; render(); });
  nav.hidden = false;
  render();
}

// ------------------------------------------------------------------ search

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

function score(e: Entry & { n: { title: string; text: string; in: string } }, terms: string[]): number {
  let total = 0;
  for (const t of terms) {
    const inTitle = e.n.title.includes(t);
    const inText = e.n.text.includes(t) || e.n.in.includes(t);
    if (!inTitle && !inText) return 0;
    total += inTitle ? 3 : 1;
  }
  if (e.n.title.startsWith(terms[0])) total += 2;
  if (e.kind === 'guide' || e.kind === 'workflow') total += 1;
  return total;
}

function snippet(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  const at = Math.max(0, ...terms.map((t) => lower.indexOf(t)).filter((x) => x >= 0).slice(0, 1));
  const start = Math.max(0, at - 60);
  return `${start ? '…' : ''}${text.slice(start, start + 180)}${text.length > start + 180 ? '…' : ''}`;
}

async function search(root: HTMLElement): Promise<void> {
  const form = root.querySelector<HTMLFormElement>('form');
  const input = root.querySelector<HTMLInputElement>('input[type="search"]');
  const out = root.querySelector<HTMLElement>('[data-results]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const browse = document.querySelector<HTMLElement>('[data-browse]');
  if (!form || !input || !out || !count) return;
  let entries: (Entry & { n: { title: string; text: string; in: string } })[] | null = null;
  const load = async () => {
    if (entries) return entries;
    const r = await fetch('/learn/search.json');
    const list = (await r.json()) as Entry[];
    entries = list.map((e) => ({ ...e, n: { title: norm(e.title), text: norm(e.text), in: norm(e.in) } }));
    return entries;
  };
  const run = async () => {
    const q = input.value.trim();
    const terms = norm(q).split(' ').filter((t) => t.length > 1);
    const url = new URL(location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    if (!terms.length) {
      out.replaceChildren();
      count.textContent = '';
      if (browse) browse.hidden = false;
      return;
    }
    let list: Awaited<ReturnType<typeof load>>;
    try {
      list = await load();
    } catch {
      count.textContent = 'The search could not load. Browse the sections below, or use the site search.';
      return;
    }
    const hits = list
      .map((e) => ({ e, s: score(e, terms) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40);
    count.textContent = hits.length ? `${hits.length === 40 ? 'The first 40' : hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”` : `Nothing found for “${q}”. Try fewer or different words, or browse the sections below.`;
    if (browse) browse.hidden = hits.length > 0;
    out.replaceChildren(
      ...hits.map(({ e }) => {
        const li = document.createElement('li');
        li.className = 'lv-result';
        const a = document.createElement('a');
        a.href = e.url;
        a.className = 'lv-result__title';
        a.textContent = e.title;
        const meta = document.createElement('span');
        meta.className = 'lv-result__meta';
        meta.textContent = `${KIND_LABEL[e.kind]} · ${e.in}${e.status === 'planned' || e.status === 'in-development' ? ` · ${e.status === 'planned' ? 'Planned' : 'In development'}` : ''}`;
        const p = document.createElement('p');
        p.className = 'lv-result__text';
        p.textContent = snippet(e.text, terms);
        li.append(meta, a, p);
        return li;
      }),
    );
  };
  let timer: ReturnType<typeof setTimeout> | undefined;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(run, 160);
  });
  form.addEventListener('submit', (ev) => {
    if (form.dataset.local === 'true') {
      ev.preventDefault();
      void run();
    }
  });
  const q = new URL(location.href).searchParams.get('q');
  if (q) {
    input.value = q;
    await run();
  }
}

// ------------------------------------------------------------------ open a question from the address

function openFromHash(): void {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (el instanceof HTMLDetailsElement) el.open = true;
  const inside = el?.closest('details');
  if (inside) inside.open = true;
}

document.querySelectorAll<HTMLElement>('[data-tutorial]').forEach(stepper);
document.querySelectorAll<HTMLElement>('[data-learn-search]').forEach((el) => void search(el));
openFromHash();
window.addEventListener('hashchange', openFromHash);
