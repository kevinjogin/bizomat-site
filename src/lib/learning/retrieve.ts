// Library and Tools retrieval for learning paths, over the same catalogue and ranking as Ask BIZOMAT
// (src/lib/discovery/search.ts). A course is gathered topic by topic: each topic's best chapters, then the tools joined
// to those chapters by reviewed knowledge links (preferred), then tools that match the topic itself.
import { search, type Engine, type Hit } from '../discovery/search.ts';

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type Depth = 'quick' | 'structured' | 'complete' | 'professional';
/** A course topic: a name and search terms, or (without AI) one Library book whose chapters form the topic. */
export interface Topic { name: string; terms: string[]; book?: number }
export interface Intent {
  subject: string; objective: string; outcome: string; level: Level; depth: Depth;
  application?: string; industry?: string; constraints?: string[];
  topics: Topic[]; outOfScope?: boolean; clarify?: string; options?: string[];
  /** 'ai' when Workers AI analysed the request, 'local' when it was worked out in the browser. */
  source: 'ai' | 'local';
}
export interface ReadingCandidate { url: string; title: string; book: string; bookUrl: string; about: string; minutes?: number; shard: number; topic: string; score: number }
export interface ToolCandidate { id: string; name: string; url: string; app: string; about: string; topic: string; linkedTo: string[] }
export interface Candidates { readings: ReadingCandidate[]; tools: ToolCandidate[]; coverage: { topic: string; readings: number }[] }

const LEARN = /\b(te+a?ch me|lea?rn|learning|course|from scratch|beginner|basics|fundamentals|become (better|good|an?)|get better at|master|study|understand .{3,40} (in depth|properly|fully)|career|qualif)/i;
const STRUCTURED = /\b(improve|reduce|implement|develop|build|set up|business case|plan|introduce|choose|select|evaluate|help me understand)\b/i;

/** What the request asks for, worked out without AI (used when the AI step is unavailable). */
export function localIntent(question: string, e: Engine): Intent {
  const q = question.trim();
  const level: Level = /beginner.{0,20}advanced|basics.{0,20}advanced|scratch.{0,30}advanced/i.test(q) ? 'mixed'
    : /\b(beginner|from scratch|basics|fundamentals|introduction|new to)\b/i.test(q) ? 'beginner'
    : /\b(advanced|expert|professional|in depth|senior)\b/i.test(q) ? 'advanced' : 'mixed';
  // A short question ("How can I reduce machine downtime?") gets the quick answer and solution path; a goal gets a course.
  const shortQuestion = /^(how|what|why|which|where|when|can|should|is|are|do|does)\b/i.test(q) && q.split(/\s+/).length <= 8;
  const depth: Depth = LEARN.test(q) ? (level === 'advanced' ? 'professional' : 'complete') : STRUCTURED.test(q) && !shortQuestion ? 'structured' : 'quick';
  const subject = q.replace(/^(please\s+)?(te+a?ch me( about| how to)?|explain( how to)?|lea?rn( about)?|help me (to )?(understand|learn)|i (want|would like) to (learn|understand|become better at|get better at|improve)|how (do|can) i)\s+/i, '').replace(/[?.!]+$/, '').slice(0, 80);
  // Topics: the Library books that match the subject best (each book is a coherent topic, already in learning order).
  const books = rankBooks(e, subject || q).slice(0, 6).map((b) => ({ name: e.index.books[b].n, terms: [], book: b }));
  const intent: Intent = { subject: subject || q.slice(0, 80), objective: '', outcome: '', level, depth, topics: books, source: 'local' };
  // A one-word field ("engineering", "business") is too broad for one course: ask which part, once.
  const broad = BROAD[subject.toLowerCase()];
  if (broad) return { ...intent, clarify: `Which part of ${subject.toLowerCase()} would you like to learn?`, options: broad };
  return intent;
}

const BROAD: Record<string, string[]> = {
  engineering: ['Mechanical engineering', 'Electrical engineering', 'Manufacturing engineering', 'Engineering project management'],
  business: ['Business finance and investment', 'Operations and productivity', 'Business systems and management', 'AI and automation for business'],
  manufacturing: ['Manufacturing process improvement', 'Manufacturing costs', 'Machining and fabrication', 'Maintenance and downtime'],
  technology: ['Software development', 'AI and automation', 'Electrical and control systems'],
};

/** Chapter URLs of each book, in book order. */
const bookChapters = new WeakMap<Engine, Map<number, string[]>>();
function chaptersOf(e: Engine, book: number): string[] {
  let m = bookChapters.get(e);
  if (!m) { m = new Map(); for (const c of e.index.chapters) { const l = m.get(c.b) ?? []; l.push(c.u); m.set(c.b, l); } bookChapters.set(e, m); }
  return m.get(book) ?? [];
}
/** Books ranked by how well they match: a book hit counts in full, its matching chapters add to it. */
export function rankBooks(e: Engine, question: string, terms: string[] = []): number[] {
  const r = search(e, { question, terms });
  if (r.mode === 'none') return []; // nothing in the catalogue fits (for example an unsupported subject)
  const score = new Map<number, number>();
  const bookIndex = new Map(e.index.books.map((b, i) => [b.id, i]));
  for (const h of [...r.readings, ...r.related]) {
    const b = h.kind === 'chapter' ? e.chapters.get(h.url)?.b : h.kind === 'book' ? bookIndex.get(h.id) : undefined;
    if (b !== undefined) score.set(b, (score.get(b) ?? 0) + (h.kind === 'book' ? 1.5 : 1) * Math.max(0.2, h.score));
  }
  return [...score].sort((a, b) => b[1] - a[1]).map(([b]) => b);
}

/** Readings and tools for a course: per topic, the best chapters, then tools linked to them, then matching tools. */
export function gatherCandidates(e: Engine, question: string, intent: Intent, maxReadings = 48, maxTools = 24): Candidates {
  const readings = new Map<string, ReadingCandidate>();
  const toolHits = new Map<string, { hit: Hit; topic: string }>();
  const coverage: Candidates['coverage'] = [];
  const topics = intent.topics.length ? intent.topics : [{ name: intent.subject || question, terms: [] }];
  const perTopic = Math.max(3, Math.min(8, Math.floor(maxReadings / Math.max(1, topics.length))));
  const addChapter = (url: string, topic: string, score: number) => {
    const c = e.chapters.get(url);
    if (!c || readings.has(url)) return false;
    const book = e.index.books[c.b];
    readings.set(url, { url, title: c.n, book: book.n, bookUrl: book.u, about: c.d, minutes: c.m, shard: c.b, topic, score });
    return true;
  };
  const bookIndex = new Map(e.index.books.map((b, i) => [b.id, i]));
  for (const t of topics) {
    let n = 0;
    const query = `${t.name} ${t.terms.join(' ')}`.trim();
    const r = search(e, { question: t.book === undefined ? query : question, terms: t.book === undefined ? t.terms : [] });
    // When nothing fits well the search offers "related" near misses; a course does not use them (the topic is a gap).
    if (r.mode === 'none') r.related = [];
    if (t.book !== undefined) {
      // A book topic: the chapters of that book that match the request first, then the rest in book order.
      const order = chaptersOf(e, t.book);
      const matched = [...r.readings, ...r.related].filter((h) => h.kind === 'chapter' && e.chapters.get(h.url)?.b === t.book).map((h) => h.url);
      for (const url of [...matched, ...order]) if (n < perTopic && addChapter(url, t.name, matched.includes(url) ? 1 : 0.5)) n++;
    } else {
      for (const h of [...r.readings, ...r.related]) {
        if (n >= perTopic) break;
        if (h.kind === 'chapter') { if (addChapter(h.url, t.name, h.score)) n++; continue; }
        // A whole book matched: take its first chapters that are not already in.
        const b = h.kind === 'book' ? bookIndex.get(h.id) : undefined;
        if (b !== undefined) for (const url of chaptersOf(e, b).slice(0, 3)) if (n < perTopic && addChapter(url, t.name, h.score * 0.8)) n++;
      }
    }
    coverage.push({ topic: t.name, readings: n });
    for (const h of r.tools.slice(0, 3)) if (!toolHits.has(h.id)) toolHits.set(h.id, { hit: h, topic: t.name });
  }
  // The request as a whole, for anything the topics missed.
  const whole = search(e, { question, terms: intent.topics.flatMap((t) => t.terms).slice(0, 12) });
  if (whole.mode === 'none') whole.related = [];
  for (const h of whole.readings) if (h.kind === 'chapter' && readings.size < maxReadings) addChapter(h.url, topics[0].name, h.score);
  for (const h of whole.tools.slice(0, 4)) if (!toolHits.has(h.id)) toolHits.set(h.id, { hit: h, topic: topics[0].name });
  const list = [...readings.values()].slice(0, maxReadings);
  // Tools joined to the chosen chapters by a reviewed knowledge link come first.
  const linked = new Map<string, string[]>();
  const inList = new Set(list.map((r) => r.url));
  for (const [tool, reading] of e.index.links) if (inList.has(reading)) linked.set(tool, [...(linked.get(tool) ?? []), reading]);
  const tools: ToolCandidate[] = [];
  const add = (id: string, topic: string) => {
    const t = e.tools.get(id);
    if (!t || tools.some((x) => x.id === id)) return;
    tools.push({ id, name: t.n, url: t.p ? `/tools/${t.id}/` : `/tools/?tool=${t.id}`, app: `/tools/?tool=${t.id}`, about: t.q || t.d, topic, linkedTo: linked.get(id) ?? [] });
  };
  for (const [id, urls] of [...linked].sort((a, b) => b[1].length - a[1].length)) add(id, readings.get(urls[0])?.topic ?? topics[0].name);
  for (const { hit, topic } of toolHits.values()) add(hit.id, topic);
  return { readings: list, tools: tools.slice(0, maxTools), coverage };
}
