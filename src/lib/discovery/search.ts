// BIZOMAT AI search: ranks the platform's products and documentation, BIZOMAT tools and Library books and chapters
// for a question in plain language.
// Runs in the browser over /discovery-index.json (and in the tests), so every result is a real catalogue entry.
// Hybrid ranking: the visitor's own words (BM25 over weighted fields), curated synonyms, spelling correction against
// the catalogue's vocabulary, word pairs, and, when available, search terms from the AI intent step.
import { SYNONYMS } from './synonyms.ts';

/** A tool: p is 1 when it has its own page (/tools/<id>/); the calculator is always /tools/?tool=<id>. */
export interface DTool { id: string; n: string; d: string; q: string; c: string; tp: string; k: string; p: 0 | 1 }
export interface DBook { id: string; n: string; d: string; c: string; u: string; kind: 'publication' | 'collection' }
/** A chapter: its URL is its id; b is the index of its book in DiscoveryIndex.books. */
/** m: reading minutes; k: key terms and section headings from the chapter's text. */
export interface DChapter { n: string; d: string; b: number; u: string; m?: number; k?: string }
/** A public platform page: a product, capability, documentation or integration (src/data/platform-catalog.ts).
 *  a: area (CAD Automation, Project Management, Resources, BIZOMAT); t: kind of entry; k: search-only keywords. */
export interface DPage { id: string; n: string; d: string; u: string; a: string; t: string; k: string }
/** links: reviewed Library ↔ Tools connections as [tool id, chapter URL or book id]. pages: public platform pages. */
export interface DiscoveryIndex { v: 1; tools: DTool[]; books: DBook[]; chapters: DChapter[]; links: [string, string][]; pages?: DPage[] }
export const toolHref = (t: DTool) => (t.p ? `/tools/${t.id}/` : `/tools/?tool=${t.id}`);
export const toolAppHref = (t: DTool) => `/tools/?tool=${t.id}`;

export interface Hit {
  kind: 'tool' | 'chapter' | 'book' | 'page';
  id: string;
  title: string;
  description: string;
  url: string;
  /** For a tool: the calculator; for a chapter: the book it belongs to. */
  secondary?: { label: string; url: string };
  context?: string; // category, or the chapter's book
  reason: string;
  score: number; // 0–1, relative to the strongest result
  /** Chosen by the AI step from the shortlist of catalogue entries it was shown. */
  ai?: boolean;
}
export interface Outcome {
  mode: 'results' | 'clarify' | 'none';
  /** BIZOMAT products, capabilities, documentation and integrations (public pages only). */
  platform: Hit[];
  tools: Hit[];
  readings: Hit[];
  related: Hit[];
  /** Words the search understood, for the response line ("downtime, cost"). */
  concepts: string[];
  corrections: { from: string; to: string }[];
  clarify?: { question: string; options: string[] };
}
export interface Query {
  question: string;
  /** Extra search terms from the AI intent step (never resources). */
  terms?: string[];
  /** The previous question, used when the new one is a short follow-up. */
  context?: string;
  /** Catalogue ids the AI step chose from the shortlist, best first. Unknown ids are ignored. */
  picks?: string[];
}
/** A catalogue entry offered to the AI step to choose from (see shortlist()). */
export interface Candidate { id: string; kind: 'tool' | 'chapter' | 'book'; name: string; about: string }

// ---------- Text ----------
const STOP = new Set(('a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its just me more most my no nor not now of off on once only or other our out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours ' +
  'want need help please tell show find work know get make let like trying try use using best good way ways much many able anything something someone kevos workos reados tool tools calculator calculators book books chapter chapters ' +
  'lose losing lost sitting standing run running thing things keep keeps kept bizomat').split(' '));

/** Light stemmer shared by documents and questions, so "machines", "machine" and "machining" stay distinct enough. */
export function stem(w: string): string {
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) return `${w.slice(0, -3)}y`;
  if (w.endsWith('sses')) return w.slice(0, -2);
  if (w.endsWith('ss') || w.endsWith('us') || w.endsWith('is')) return w;
  if (w.endsWith('s')) return w.slice(0, -1);
  return w;
}
export function words(text: string): string[] {
  return (text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').match(/[a-z0-9]+(?:['’][a-z]+)?/g) ?? []).map((w) => w.replace(/['’].*$/, ''));
}
export const tokens = (text: string) => words(text).filter((w) => !STOP.has(w) && (w.length > 1 || /\d/.test(w))).map(stem);

// ---------- Index ----------
type Doc = { kind: Hit['kind']; ref: DTool | DBook | DChapter | DPage; fields: { tf: Map<string, number>; len: number; w: number }[]; bigrams: Set<string>; group: string; id: string };
export interface Engine { docs: Doc[]; df: Map<string, number>; avg: number[]; vocab: Map<string, number>; byFirst: Map<string, string[]>; index: DiscoveryIndex; books: Map<string, DBook>; chapters: Map<string, DChapter>; tools: Map<string, DTool>; postings: Map<string, number[]>; byId: Map<string, number> }

const FIELD_WEIGHTS = { name: 3, question: 1.4, description: 1.2, keywords: 1, category: 0.7, book: 0.5 };

function field(text: string, w: number) {
  const tf = new Map<string, number>();
  const t = tokens(text);
  for (const x of t) tf.set(x, (tf.get(x) ?? 0) + 1);
  return { tf, len: t.length, w };
}
const pairs = (t: string[]) => new Set(t.slice(1).map((x, i) => `${t[i]} ${x}`));

export function prepare(index: DiscoveryIndex): Engine {
  const books = new Map(index.books.map((b) => [b.id, b]));
  const docs: Doc[] = [];
  for (const t of index.tools) {
    docs.push({ kind: 'tool', ref: t, id: t.id, group: `tool:${t.c}`, bigrams: pairs(tokens(t.n)), fields: [field(t.n, FIELD_WEIGHTS.name), field(t.q, FIELD_WEIGHTS.question), field(t.d, FIELD_WEIGHTS.description), field(t.k, FIELD_WEIGHTS.keywords), field(`${t.c} ${t.tp}`, FIELD_WEIGHTS.category)] });
  }
  for (const c of index.chapters) {
    const b = index.books[c.b];
    docs.push({ kind: 'chapter', ref: c, id: c.u, group: `book:${b.id}`, bigrams: pairs(tokens(c.n)), fields: [field(c.n, FIELD_WEIGHTS.name * 0.9), field(c.d, FIELD_WEIGHTS.description), field(b.n, FIELD_WEIGHTS.book), field(c.k ?? '', FIELD_WEIGHTS.keywords * 0.8)] });
  }
  for (const b of index.books) {
    docs.push({ kind: 'book', ref: b, id: b.id, group: `book:${b.id}`, bigrams: pairs(tokens(b.n)), fields: [field(b.n, FIELD_WEIGHTS.name), field(b.d, FIELD_WEIGHTS.description), field(b.c, FIELD_WEIGHTS.category)] });
  }
  // Platform pages: few, with curated keywords, so the keywords weigh more than a tool's.
  for (const p of index.pages ?? []) {
    docs.push({ kind: 'page', ref: p, id: p.id, group: `page:${p.a}`, bigrams: pairs(tokens(p.n)), fields: [field(p.n, FIELD_WEIGHTS.name), field(p.d, FIELD_WEIGHTS.description), field(p.k, FIELD_WEIGHTS.keywords * 1.6), field(`${p.a} ${p.t}`, FIELD_WEIGHTS.category)] });
  }
  const df = new Map<string, number>();
  const postings = new Map<string, number[]>();
  const nFields = 5;
  const totals = Array(nFields).fill(0);
  const counts = Array(nFields).fill(0);
  docs.forEach((d, i) => {
    const seen = new Set<string>();
    d.fields.forEach((f, k) => { totals[k] += f.len; counts[k] += 1; for (const t of f.tf.keys()) seen.add(t); });
    for (const t of seen) { df.set(t, (df.get(t) ?? 0) + 1); let p = postings.get(t); if (!p) postings.set(t, (p = [])); p.push(i); }
  });
  const vocab = new Map([...df].filter(([t]) => t.length >= 3 && !/\d/.test(t)));
  const byFirst = new Map<string, string[]>();
  for (const t of vocab.keys()) { const k = t[0]; let l = byFirst.get(k); if (!l) byFirst.set(k, (l = [])); l.push(t); }
  return { docs, df, avg: totals.map((t, i) => t / Math.max(1, counts[i])), vocab, byFirst, index, books, chapters: new Map(index.chapters.map((c) => [c.u, c])), tools: new Map(index.tools.map((t) => [t.id, t])), postings, byId: new Map(docs.map((d, i) => [d.id, i])) };
}

// ---------- Query expansion ----------
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) cur[j] = Math.min(cur[j], prev[j - 2 + 0] + 1); // transposition
      best = Math.min(best, cur[j]);
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
/** The closest catalogue word to a misspelt one (same first letter, within 1–2 edits), preferring common words. */
function correct(e: Engine, t: string): string | null {
  // Ordinary English endings mark a real word the catalogue simply does not use (sitting, wondered), not a typo.
  if (t.length < 4 || /\d/.test(t) || e.vocab.has(t) || /(ing|ed|ly)$/.test(t)) return null;
  const max = t.length >= 8 ? 2 : 1;
  let best: string | null = null;
  let bestD = max + 1;
  let bestF = 0;
  for (const cand of e.byFirst.get(t[0]) ?? []) {
    if (Math.abs(cand.length - t.length) > max) continue;
    // A one-letter swap in a short word is more often a different real word (sitting/setting) than a typo.
    if (cand.length === t.length && t.length < 8 && max === 1) continue;
    const d = editDistance(t, cand, max);
    const f = e.vocab.get(cand)!;
    if (d < bestD || (d === bestD && f > bestF)) { best = cand; bestD = d; bestF = f; }
  }
  return bestD <= max ? best : null;
}

type Term = { t: string; w: number; from: string; phrase?: string };
function expand(e: Engine, q: Query) {
  const terms = new Map<string, Term>();
  const add = (t: string, w: number, from: string, phrase?: string) => { const prev = terms.get(t); if (!prev || prev.w < w) terms.set(t, { t, w, from, phrase }); };
  const corrections: { from: string; to: string }[] = [];
  const own = tokens(q.question);
  const fixed: string[] = [];
  for (const t of own) {
    // Word forms the catalogue spells differently (manufactured → manufacture, machining stays machining).
    const variant = e.vocab.has(t) ? null : [t.replace(/ed$/, ''), t.replace(/ed$/, 'e'), t.replace(/ing$/, ''), t.replace(/ing$/, 'e'), t.replace(/ly$/, '')].find((v) => v !== t && e.vocab.has(v));
    if (variant) { add(variant, 0.95, t); fixed.push(variant); continue; }
    const c = correct(e, t);
    if (c) { corrections.push({ from: t, to: c }); add(c, 0.9, c); fixed.push(c); } else { add(t, 1, t); fixed.push(t); }
  }
  // Synonyms: phrases matched against the corrected question text.
  const text = ` ${words(q.question).map((w) => corrections.find((c) => c.from === stem(w))?.to ?? w).join(' ')} `;
  for (const s of SYNONYMS) {
    const hit = s.when.find((p) => text.includes(` ${p} `) || text.includes(` ${p}s `));
    if (hit) for (const phrase of s.add) for (const t of tokens(phrase)) add(t, 0.55, hit, phrase);
  }
  for (const term of q.terms ?? []) for (const t of tokens(term).slice(0, 4)) add(t, 0.7, term, term);
  // A short follow-up ("and labour?") borrows the previous question's words at low weight.
  if (q.context && own.length <= 3) for (const t of tokens(q.context)) add(t, 0.4, t);
  return { terms: [...terms.values()], own: fixed, corrections, bigrams: pairs(fixed) };
}

// ---------- Scoring ----------
const K1 = 1.2;
const PAGE_BOOST = 2;
const B = 0.75;
function scoreDocs(e: Engine, terms: Term[], bigrams: Set<string>) {
  const N = e.docs.length;
  const scores = new Map<number, { s: number; matched: Set<Term> }>();
  for (const term of terms) {
    const plist = e.postings.get(term.t);
    if (!plist) continue;
    const idf = Math.log(1 + (N - plist.length + 0.5) / (plist.length + 0.5));
    for (const i of plist) {
      const d = e.docs[i];
      let s = 0;
      d.fields.forEach((f, k) => {
        const tf = f.tf.get(term.t);
        if (!tf) return;
        s += f.w * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * f.len) / (e.avg[k] || 1))));
      });
      let r = scores.get(i);
      if (!r) scores.set(i, (r = { s: 0, matched: new Set() }));
      r.s += term.w * idf * s;
      r.matched.add(term);
    }
  }
  // Word pairs from the question that appear in a title ("cutting speed", "bend allowance") are strong evidence.
  for (const [i, r] of scores) for (const bg of bigrams) if (e.docs[i].bigrams.has(bg)) r.s *= 1.35;
  // Platform pages are few and hand-curated (src/data/platform-catalog.ts): a match on one is stronger evidence than
  // the same words in one of thousands of chapters.
  for (const [i, r] of scores) if (e.docs[i].kind === 'page') r.s *= PAGE_BOOST;
  return scores;
}

// ---------- Results ----------
const MAX_TOOLS = 5;
const MAX_READINGS = 5;
const MAX_RELATED = 4;
const MAX_PLATFORM = 3;
/** Below this raw score nothing is relevant enough to recommend (calibrated in tests/discovery.test.ts). */
export const MIN_SCORE = 6;

function describe(matched: Set<Term>, own: string[]): string {
  // The visitor's own words first, then whole expansion phrases ("unit cost"), noting the everyday word they came from.
  const got = new Set([...matched].map((m) => m.t));
  const list: string[] = [...matched].filter((m) => own.includes(m.t)).map((m) => m.t);
  for (const m of matched) {
    if (own.includes(m.t) || !m.phrase) continue;
    const phrase = tokens(m.phrase).every((t) => got.has(t)) ? m.phrase.toLowerCase() : m.t;
    const from = m.from.split(' ').length <= 2 && m.from !== phrase ? ` (for “${m.from}”)` : '';
    list.push(`${phrase}${from}`);
  }
  const unique = [...new Set(list)].filter((x, i, all) => !all.some((y, j) => j !== i && y !== x && y.startsWith(`${x} `)));
  return unique.length ? `Matches ${unique.slice(0, 3).join(', ')}` : 'Related to your question';
}

function hitOf(e: Engine, d: Doc, score: number, reason: string): Hit {
  if (d.kind === 'page') {
    const p = d.ref as DPage;
    return { kind: 'page', id: p.id, title: p.n, description: p.d, url: p.u, context: `${p.a} · ${p.t}`, reason, score };
  }
  if (d.kind === 'tool') {
    const t = d.ref as DTool;
    return { kind: 'tool', id: t.id, title: t.n, description: t.q || t.d, url: toolHref(t), secondary: { label: 'Open the calculator', url: toolAppHref(t) }, context: t.c, reason, score };
  }
  if (d.kind === 'chapter') {
    const c = d.ref as DChapter;
    const b = e.index.books[c.b];
    return { kind: 'chapter', id: c.u, title: c.n, description: c.d, url: c.u, secondary: b ? { label: b.n, url: b.u } : undefined, context: b?.n, reason, score };
  }
  const b = d.ref as DBook;
  return { kind: 'book', id: b.id, title: b.n, description: b.d, url: b.u, context: `${b.c} · ${b.kind === 'publication' ? 'BIZOMAT original book' : 'Library collection'}`, reason, score };
}

export function search(e: Engine, q: Query): Outcome {
  const { terms, own, corrections, bigrams } = expand(e, q);
  const empty: Outcome = { mode: 'none', platform: [], tools: [], readings: [], related: [], concepts: [], corrections };
  if (!terms.length) return empty;
  const scores = scoreDocs(e, terms, bigrams);
  const ranked = [...scores].map(([i, r]) => ({ i, d: e.docs[i], ...r })).sort((a, b) => b.s - a.s);
  // Tools and readings are judged against the strongest tool or reading, platform pages against the strongest page,
  // so a product page that fits the question never raises the bar for the calculators and chapters beside it.
  const top = ranked.find((x) => x.d.kind !== 'page')?.s ?? ranked[0]?.s ?? 0;
  const topPage = ranked.find((x) => x.d.kind === 'page')?.s ?? 0;
  // The AI's choices (only real catalogue entries) lead; keyword matches follow.
  const picked = [...new Set(q.picks ?? [])].map((id) => e.byId.get(id)).filter((i): i is number => i !== undefined).slice(0, 8)
    .map((i) => ({ i, d: e.docs[i], s: Math.max(top, 1), matched: scores.get(i)?.matched ?? new Set<Term>() }));
  const pickedIds = new Set(picked.map((x) => x.i));
  if (!picked.length && Math.max(top, topPage) < MIN_SCORE) {
    // Nothing strong: offer up to three of the nearest resources as "related", clearly labelled.
    const near = ranked.slice(0, 3).filter((x) => x.s >= MIN_SCORE / 3).map((x) => hitOf(e, x.d, Math.min(1, x.s / Math.max(top, topPage, 1)), describe(x.matched, own)));
    return { ...empty, related: near, concepts: own.slice(0, 4) };
  }
  // Coverage: the best results must explain at least a third of the question's meaningful words (directly or through
  // a synonym of them). "weather forecast tomorrow" matches only "forecast", so it is not answered with forecasting tools.
  const meaningful = own.filter((t) => t.length > 2 && !/\d/.test(t));
  const covered = (x: (typeof ranked)[number]) => meaningful.filter((o) => [...x.matched].some((m) => m.t === o || tokens(m.from).includes(o))).length / Math.max(1, meaningful.length);
  if (!picked.length && meaningful.length >= 3 && Math.max(...ranked.slice(0, 5).map(covered)) < 0.34) {
    return { ...empty, related: ranked.slice(0, 3).map((x) => hitOf(e, x.d, Math.min(1, x.s / Math.max(top, topPage, 1)), describe(x.matched, own))), concepts: meaningful.slice(0, 4) };
  }
  const keep = ranked.filter((x) => x.s >= Math.max(MIN_SCORE, (x.d.kind === 'page' ? topPage : top) * 0.32) && !pickedIds.has(x.i));
  const tools = [...picked.filter((x) => x.d.kind === 'tool'), ...keep.filter((x) => x.d.kind === 'tool')].slice(0, MAX_TOOLS);
  // Readings: chapters first; a book appears when it matches as a whole, and a book is not repeated by its chapters' count.
  const perBook = new Map<string, number>();
  // A reading must match at least two different words, unless the question itself has only one.
  const distinct = (x: (typeof ranked)[number]) => new Set([...x.matched].map((m) => m.t)).size;
  const reading = (x: { d: Doc }) => x.d.kind === 'chapter' || x.d.kind === 'book';
  const readings = [...picked.filter(reading), ...keep.filter((x) => reading(x) && (own.length <= 1 || distinct(x) >= 2))]
    .filter((x) => { const n = perBook.get(x.d.group) ?? 0; perBook.set(x.d.group, n + 1); return n < 2; }).slice(0, MAX_READINGS);
  const toHit = (x: { i: number; d: Doc; s: number; matched: Set<Term> }): Hit => {
    if (!pickedIds.has(x.i)) return hitOf(e, x.d, Math.min(1, Math.round((x.s / Math.max(x.d.kind === 'page' ? topPage : top, 1)) * 100) / 100), describe(x.matched, own));
    const why = describe(x.matched, own);
    return { ...hitOf(e, x.d, 1, why === 'Related to your question' ? 'Best fit for your question, chosen by BIZOMAT AI' : `Best fit, chosen by BIZOMAT AI. ${why}`), ai: true };
  };
  // Platform pages (products, capabilities, documentation, integrations) are shown first, at most one per entry id.
  const platform = keep.filter((x) => x.d.kind === 'page' && (own.length <= 1 || distinct(x) >= 2)).slice(0, MAX_PLATFORM);
  const out: Outcome = { mode: 'results', platform: platform.map(toHit), tools: tools.map(toHit), readings: readings.map(toHit), related: [], concepts: [], corrections };

  // Related: reviewed Library ↔ Tools connections of the leading results that also match the question.
  const shown = new Set([...out.tools, ...out.readings].map((h) => h.id));
  const related: Hit[] = [];
  const lead = [...out.tools.slice(0, 2), ...out.readings.slice(0, 2)];
  for (const h of lead) {
    for (const [tool, reading] of e.index.links) {
      const other = h.kind === 'tool' && tool === h.id ? reading : h.kind !== 'tool' && (reading === h.id || (h.kind === 'book' && e.chapters.get(reading) && e.index.books[e.chapters.get(reading)!.b].id === h.id)) ? tool : null;
      if (!other || shown.has(other) || related.length >= MAX_RELATED) continue;
      const i = e.byId.get(other);
      const r = i === undefined ? undefined : scores.get(i);
      if (!r) continue; // connected, but nothing to do with this question
      shown.add(other);
      related.push(hitOf(e, e.docs[i!], 0, `Connected to “${h.title}”: ${describe(r.matched, own).toLowerCase()}`));
    }
  }
  out.related = related;
  // The subjects the answer is about, for the sentence above the results: the visitor's own words that matched, then
  // whole expansion phrases ("manufacturing cost"), never stray single words of a phrase ("true", "job").
  const ownSeen = new Set<string>();
  const phrases = new Set<string>();
  for (const x of keep.slice(0, 8)) {
    const got = new Set([...x.matched].map((m) => m.t));
    for (const m of x.matched) {
      if (own.includes(m.t)) ownSeen.add(m.t);
      else if (m.phrase && tokens(m.phrase).every((t) => got.has(t))) phrases.add(m.phrase.toLowerCase());
    }
  }
  out.concepts = [...ownSeen, ...[...phrases].filter((p) => !tokens(p).every((t) => ownSeen.has(t)))].slice(0, 4);

  // Ambiguity: a one- or two-word question whose best tools are close in score but do different jobs.
  // One meaningful word ("cost", "how many samples do I need"), or two in a very short query. A full sentence with two
  // ("why does my bearing keep failing") is answered, with a solution path.
  if ((own.length === 1 || (own.length === 2 && words(q.question).length <= 3)) && !q.context && !(q.terms?.length) && !picked.length && tools.length >= 3) {
    const lead3 = tools.slice(0, 3);
    const groups = new Set(lead3.map((x) => (x.d.ref as DTool).c));
    if (lead3[2].s >= top * 0.75 && (groups.size >= 2 || own.length === 1)) {
      out.mode = 'clarify';
      const options = lead3.map((x) => (x.d.ref as DTool).n);
      out.clarify = { question: `Your question could mean several things. Which is closest: ${options.slice(0, -1).join(', ')} or ${options.at(-1)}?`, options };
    }
  }
  return out;
}

/**
 * The catalogue entries most related to a question, for the AI step to choose from: up to `tools` tools and
 * `readings` chapters or books, by keyword, synonym and spelling match (no score threshold). Everything here is a real
 * catalogue entry, so whatever the AI picks from it exists.
 */
export function shortlist(e: Engine, q: Query, tools = 14, readings = 6): Candidate[] {
  const { terms, bigrams } = expand(e, q);
  if (!terms.length) return [];
  const ranked = [...scoreDocs(e, terms, bigrams)].sort((a, b) => b[1].s - a[1].s).map(([i]) => e.docs[i]);
  const cut = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
  const out: Candidate[] = [];
  let nt = 0, nr = 0;
  for (const d of ranked) {
    if (d.kind === 'page') continue; // the AI step chooses only among tools and readings
    if (d.kind === 'tool' ? nt >= tools : nr >= readings) continue;
    const h = hitOf(e, d, 0, '');
    if (d.kind === 'tool') nt++; else nr++;
    out.push({ id: h.id, kind: h.kind as Candidate['kind'], name: cut(h.title, 90), about: cut(h.kind === 'chapter' ? `in ${h.context ?? ''}: ${h.description}` : h.description, 110) });
    if (nt >= tools && nr >= readings) break;
  }
  return out;
}

/** A catalogue entry (tool id, chapter URL or book id) as a result card, or undefined when it is not in the catalogue. */
export function entryById(e: Engine, id: string): Hit | undefined {
  const i = e.byId.get(id);
  return i === undefined ? undefined : hitOf(e, e.docs[i], 0, '');
}
/** Readings joined to a tool by a reviewed knowledge link (src/data/knowledge-links.json), chapters first. */
export function verifiedReadings(e: Engine, toolId: string): Hit[] {
  const out = e.index.links.filter(([t]) => t === toolId).map(([, r]) => entryById(e, r)).filter((h): h is Hit => Boolean(h));
  return out.sort((a, b) => (a.kind === 'chapter' ? 0 : 1) - (b.kind === 'chapter' ? 0 : 1));
}
