// Library browser for WORKOS and READOS (src/components/library/LibraryBrowser.astro).
// Topic, subcategory and search state live in the URL (?topic=, ?sub=, ?q=; WORKOS also keeps ?collection=makeos),
// so links, reloads and back/forward all work. Search runs over this page's own cards; on WORKOS, a question in plain
// words (or a search with no match) is also sent through KEVOS® discovery (src/lib/discovery/client.ts), and the tools
// the AI picks from the catalogue are moved to the top of the results.
import { highlightParts, indexDoc, queryTokens, scoreDoc, search, type IndexedDoc } from '../utils/library-search.ts';
import { createDiscovery } from '../lib/discovery/client.ts';

interface Item {
  el: HTMLElement;
  id: string;
  topic: string;
  sub: string;
  collection: string;
  preview: boolean;
  titleEl: HTMLElement | null;
  descEl: HTMLElement | null;
  titleText: string;
  descText: string;
  hitsEl: HTMLElement | null;
  index: IndexedDoc;
}
interface State { q: string; topic: string; sub: string; collection: string }

const root = document.querySelector<HTMLElement>('[data-library]');
if (root) init(root);

function init(root: HTMLElement) {
  const $ = <T extends HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
  const name = root.dataset.library ?? '';
  const noun = root.dataset.noun ?? 'item';
  const plural = (n: number) => `${n} ${noun}${n === 1 ? '' : 's'}`;
  const form = $<HTMLFormElement>('[data-lib-search-form]');
  const input = $<HTMLInputElement>('[data-lib-input]');
  const clear = $<HTMLButtonElement>('[data-lib-clear]');
  const status = $<HTMLElement>('[data-lib-status]');
  const trail = $<HTMLElement>('[data-lib-trail]', root);
  const trailCurrent = $<HTMLElement>('[data-lib-trail-current]', root);
  const topicsEl = $<HTMLElement>('[data-lib-topics]', root);
  const sectionsEl = $<HTMLElement>('[data-lib-sections]', root);
  const results = $<HTMLElement>('[data-lib-results]', root);
  const resultsGrid = $<HTMLElement>('[data-lib-results-grid]', root);
  const resultsTitle = $<HTMLElement>('[data-lib-results-title]', root);
  const searchAll = $<HTMLButtonElement>('[data-lib-search-all]', root);
  const empty = $<HTMLElement>('[data-lib-empty]', root);
  const aiNote = $<HTMLElement>('[data-lib-ai-note]', root);
  if (!input || !results || !resultsGrid || !resultsTitle || !sectionsEl || !topicsEl) return;

  const topicNames = new Map<string, string>();
  root.querySelectorAll<HTMLElement>('[data-lib-topic-name]').forEach((a) => topicNames.set(a.dataset.libTopicLink ?? '', a.dataset.libTopicName ?? ''));
  const chapterData: Record<string, [string, string][]> = (() => {
    try { return JSON.parse(document.getElementById('lib-chapters')?.textContent || '{}'); } catch { return {}; }
  })();

  const sections = [...root.querySelectorAll<HTMLElement>('[data-lib-section]')].map((el) => ({
    el,
    slug: el.dataset.libSection ?? '',
    grid: $<HTMLElement>('[data-lib-grid]', el)!,
    subs: $<HTMLElement>('[data-lib-subs]', el),
    more: $<HTMLElement>('[data-lib-more]', el),
    items: [] as Item[],
  }));
  const items: Item[] = [];
  for (const s of sections) {
    s.grid.querySelectorAll<HTMLElement>('[data-lib-item]').forEach((el) => {
      const titleEl = $<HTMLElement>('[data-lib-title]', el);
      const descEl = $<HTMLElement>('[data-lib-desc]', el);
      const titleText = titleEl?.textContent ?? '';
      const descText = descEl?.textContent ?? '';
      const item: Item = {
        el, titleEl, descEl, titleText, descText,
        id: el.dataset.libId ?? el.dataset.toolId ?? '',
        topic: el.dataset.topic ?? s.slug,
        sub: el.dataset.sub ?? '',
        collection: el.dataset.collection ?? '',
        preview: !el.hidden,
        hitsEl: $<HTMLElement>('[data-lib-chapter-hits]', el),
        index: indexDoc({ title: titleText, tags: el.dataset.libTags, body: `${descText} ${el.dataset.libBody ?? ''}`, extra: el.dataset.libExtra }),
      };
      s.items.push(item);
      items.push(item);
    });
  }
  const chapterIndex = new Map<string, IndexedDoc[]>();
  const chapterDocs = (id: string) => {
    if (!chapterIndex.has(id)) chapterIndex.set(id, (chapterData[id] ?? []).map(([title]) => indexDoc({ title })));
    return chapterIndex.get(id)!;
  };

  // ---------- State and URL ----------
  const validTopic = (t: string | null) => (t && topicNames.has(t) ? t : '');
  function readUrl(): State {
    const p = new URLSearchParams(location.search);
    const topic = validTopic(p.get('topic'));
    const sub = topic ? (p.get('sub') ?? '') : '';
    return { q: p.get('q') ?? '', topic, sub, collection: name === 'WORKOS' && p.get('collection') === 'makeos' ? 'makeos' : '' };
  }
  function writeUrl(push: boolean) {
    const u = new URL(location.href);
    for (const [k, v] of Object.entries({ q: state.q.trim(), topic: state.topic, sub: state.sub, collection: state.collection })) {
      if (v) u.searchParams.set(k, v);
      else u.searchParams.delete(k);
    }
    if (u.href === location.href) return;
    if (push) history.pushState({ library: true }, '', u);
    else history.replaceState(history.state, '', u);
  }
  let state = readUrl();

  // ---------- Rendering ----------
  const primary = (el: HTMLElement) => (el.matches('a') ? el : $<HTMLElement>('[data-lib-primary]', el));
  function setText(el: HTMLElement | null, text: string, query: string) {
    if (!el) return;
    if (!query) { el.textContent = text; return; }
    el.textContent = '';
    for (const part of highlightParts(text, query)) {
      if (part.mark) {
        const mark = document.createElement('mark');
        mark.textContent = part.text;
        el.append(mark);
      } else el.append(document.createTextNode(part.text));
    }
  }
  function resetItems() {
    for (const s of sections) s.grid.append(...s.items.map((i) => i.el));
    for (const i of items) {
      setText(i.titleEl, i.titleText, '');
      setText(i.descEl, i.descText, '');
      if (i.hitsEl) { i.hitsEl.textContent = ''; i.hitsEl.hidden = true; }
    }
  }
  function showChapterHits(item: Item, query: string) {
    const list = chapterData[item.id];
    if (!item.hitsEl || !list?.length) return;
    const docs = chapterDocs(item.id);
    const hits = list.filter((_, n) => scoreDoc(query, docs[n]) > 0);
    if (!hits.length) return;
    for (const [title, href] of hits.slice(0, 3)) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      setText(a, title, query);
      li.append(a);
      item.hitsEl.append(li);
    }
    if (hits.length > 3) {
      const li = document.createElement('li');
      li.className = 'lib-card__more-hits';
      li.textContent = `+ ${hits.length - 3} more matching chapter${hits.length - 3 === 1 ? '' : 's'}`;
      item.hitsEl.append(li);
    }
    item.hitsEl.hidden = false;
  }
  const inScope = (i: Item) => (!state.topic || i.topic === state.topic) && (!state.collection || i.collection === 'MAKEOS');
  const scopeLabel = () => (state.topic ? topicNames.get(state.topic) ?? '' : state.collection ? 'MAKEOS toolkit' : '');

  function render() {
    const { q, topic, sub } = state;
    if (input!.value !== q) input!.value = q;
    if (clear) clear.hidden = !q;
    resetItems();
    const label = scopeLabel();
    if (trail && trailCurrent) {
      trail.hidden = !label;
      trailCurrent.textContent = label;
    }
    const searching = queryTokens(q).length > 0;
    if (searching) {
      const hits = search(q, items.filter(inScope));
      sectionsEl!.hidden = true;
      results!.hidden = false;
      topicsEl!.hidden = hits.length > 0;
      for (const { item } of hits) {
        item.el.hidden = false;
        resultsGrid!.append(item.el);
        setText(item.titleEl, item.titleText, q);
        setText(item.descEl, item.descText, q);
        showChapterHits(item, q);
      }
      const where = label ? ` in ${label}` : '';
      resultsTitle!.textContent = hits.length ? `${plural(hits.length)} for “${q.trim()}”${where}` : `No ${noun}s match “${q.trim()}”${where}`;
      if (searchAll) searchAll.hidden = !label;
      if (empty) empty.hidden = hits.length > 0;
      if (status) status.textContent = hits.length ? `${hits.length} found` : 'No matches';
      assist(q, hits.length);
      return;
    }
    assist('', 0);
    results!.hidden = true;
    sectionsEl!.hidden = false;
    topicsEl!.hidden = Boolean(label);
    let visible = 0;
    for (const s of sections) {
      if (s.subs) {
        s.subs.hidden = !topic || s.slug !== topic;
        s.subs.querySelectorAll<HTMLElement>('[data-lib-sub]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.libSub ?? '') === sub)));
      }
      if (s.more) s.more.hidden = Boolean(label);
      let shown = 0;
      for (const i of s.items) {
        const show = label ? inScope(i) && (!sub || i.sub === sub) : i.preview;
        i.el.hidden = !show;
        if (show) shown++;
      }
      s.el.hidden = shown === 0;
      visible += label ? shown : 0;
    }
    if (status) status.textContent = label ? plural(visible) : plural(items.length);
  }

  // ---------- AI assistance (WORKOS only) ----------
  // A question of three or more words, or a search that matches nothing, is sent through discovery after a short pause.
  // The AI only reorders this page's real tool cards: an id that is not a card here is ignored.
  const discovery = name === 'WORKOS' && aiNote ? createDiscovery() : null;
  const byId = new Map(items.map((i) => [i.id, i]));
  const answers = new Map<string, string[]>();
  let aiTimer = 0;
  let aiAsked = '';
  const wordCount = (q: string) => q.trim().split(/\s+/).filter(Boolean).length;
  function applyAi(q: string, ids: string[]) {
    const picks = ids.map((id) => byId.get(id)).filter((i): i is Item => Boolean(i) && inScope(i!));
    if (!picks.length) {
      const none = resultsGrid!.children.length === 0;
      aiNote!.hidden = !none;
      aiNote!.textContent = none ? 'KEVOS® AI found no tool for this question either. Try other words, or browse a topic below.' : '';
      return;
    }
    for (const i of [...picks].reverse()) {
      i.el.hidden = false;
      i.el.dataset.aiPick = '';
      resultsGrid!.prepend(i.el);
    }
    const total = resultsGrid!.children.length;
    const where = scopeLabel() ? ` in ${scopeLabel()}` : '';
    resultsTitle!.textContent = `${plural(total)} for “${q.trim()}”${where}`;
    aiNote!.hidden = false;
    aiNote!.textContent = `Best ${picks.length === 1 ? 'match' : `${picks.length} matches`} for your question first, chosen by KEVOS® AI from the WORKOS catalogue.`;
    topicsEl!.hidden = true;
    if (empty) empty.hidden = true;
    if (status) status.textContent = `${total} found`;
  }
  function assist(q: string, hits: number) {
    if (!discovery) return;
    clearTimeout(aiTimer);
    for (const i of items) delete i.el.dataset.aiPick;
    const key = q.trim().toLowerCase();
    if (!key || (wordCount(key) < 3 && hits > 0)) { aiNote!.hidden = true; return; }
    const cached = answers.get(key);
    if (cached) { applyAi(q, cached); return; }
    aiNote!.hidden = false;
    aiNote!.textContent = 'Asking KEVOS® AI for the best tools for your question…';
    aiTimer = window.setTimeout(async () => {
      if (aiAsked === key) return;
      aiAsked = key;
      try {
        const { outcome } = await discovery.ask(q.trim());
        answers.set(key, outcome.tools.map((t) => t.id));
      } catch {
        answers.set(key, []);
      } finally {
        aiAsked = '';
      }
      if (state.q.trim().toLowerCase() === key) applyAi(state.q, answers.get(key) ?? []);
    }, 700);
  }

  // ---------- Navigation ----------
  function go(next: Partial<State>, push: boolean, focus?: () => HTMLElement | null | undefined) {
    state = { ...state, ...next };
    writeUrl(push);
    render();
    if (focus) {
      window.scrollTo({ top: 0 });
      focus()?.focus({ preventScroll: true });
    }
  }
  const plainClick = (e: MouseEvent) => e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const topicLink = target.closest<HTMLElement>('[data-lib-topic-link]');
    if (topicLink && plainClick(e)) {
      e.preventDefault();
      const slug = topicLink.dataset.libTopicLink ?? '';
      go({ q: '', topic: slug, sub: '', collection: '' }, true, () => $<HTMLElement>(`#topic-${slug}-title`));
      return;
    }
    if (target.closest('[data-lib-reset]') && plainClick(e)) {
      e.preventDefault();
      go({ q: '', topic: '', sub: '', collection: '' }, true, () => $<HTMLElement>('#lib-topics-title'));
      return;
    }
    const subButton = target.closest<HTMLElement>('[data-lib-sub]');
    if (subButton) {
      go({ sub: subButton.dataset.libSub ?? '' }, false);
      return;
    }
    if (target.closest('[data-lib-search-all]')) go({ topic: '', sub: '', collection: '' }, true);
    if (target.closest('[data-lib-clear-search]')) { go({ q: '' }, false); input.focus(); }
  });

  // ---------- Search input ----------
  let renderTimer = 0;
  let urlTimer = 0;
  input.addEventListener('input', () => {
    state = { ...state, q: input.value };
    if (clear) clear.hidden = !input.value;
    clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, 60);
    clearTimeout(urlTimer);
    urlTimer = window.setTimeout(() => writeUrl(false), 400);
  });
  clear?.addEventListener('click', () => {
    go({ q: '' }, false);
    input.focus();
  });
  const resultLinks = () => [...resultsGrid.children].map((el) => primary(el as HTMLElement)).filter((el): el is HTMLElement => Boolean(el));
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(renderTimer);
    state = { ...state, q: input.value };
    writeUrl(false);
    render();
    resultLinks()[0]?.focus();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && !results.hidden) {
      const first = resultLinks()[0];
      if (first) { e.preventDefault(); first.focus(); }
    } else if (e.key === 'Escape' && input.value) {
      e.preventDefault();
      go({ q: '' }, false);
    }
  });
  resultsGrid.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Escape'].includes(e.key)) return;
    const links = resultLinks();
    const n = links.indexOf(document.activeElement as HTMLElement);
    if (n < 0) return;
    e.preventDefault();
    if (e.key === 'Escape' || (e.key === 'ArrowUp' && n === 0)) input.focus();
    else links[Math.min(links.length - 1, Math.max(0, n + (e.key === 'ArrowDown' ? 1 : -1)))]?.focus();
  });

  window.addEventListener('popstate', () => {
    state = readUrl();
    render();
  });
  render();
  root.dataset.libraryReady = 'true';
}
