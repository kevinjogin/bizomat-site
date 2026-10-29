// Suggest READOS ↔ WORKOS relationships for human review.
//
//   node scripts/knowledge/suggest.mjs [--per-book 6] [--min 0.12]
//
// Scores every READOS book (title, subtitle, description, chapter titles and descriptions) against every WORKOS tool
// (name, question, description, keywords, category, guide purpose and uses) by TF-IDF cosine similarity, picks the
// best-matching chapter for each pair, and writes src/data/knowledge-link-suggestions.json. Suggestions are never
// published: a reviewer copies the ones that hold up into src/data/knowledge-links.json with status "approved" (and a
// note and reason), or records them there as "rejected" so they are not suggested again. Pairs already in
// knowledge-links.json, in any status, are skipped. Metadata only: the script does not read chapter text, so a
// suggestion is a lead to check, never evidence on its own.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readCatalogue, readLinks } from '../../src/utils/knowledge.ts';
import { loadWorkosTools } from '../../src/utils/workos-tools.ts';

const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? Number(process.argv[i + 1]) : dflt; };
const PER_BOOK = arg('--per-book', 6);
const MIN = arg('--min', 0.12);
const STRONG = 0.22; // below this a suggestion is flagged "weak match"

const STOP = new Set('the and for with from that this into your their what when where which while who how why are was were been being have has had not but can could should would will may might must its our out over under more most less least than then them they you use used using uses each per any all one two three first second time times also about such other some many much very only into onto upon via vs a an of to in on at by or as is be it if we he she do does did so no yes up down off book chapter chapters tool tools calculator calculators check checks guide workos reados kevos numbers number practical simple basic quick'.split(' '));
const stem = (w) => w.replace(/(ies)$/, 'y').replace(/(sses)$/, 'ss').replace(/([^s])s$/, '$1').replace(/(ing|ed)$/, '');
const tokens = (text) => (text.toLowerCase().normalize('NFKD').match(/[a-z][a-z0-9-]{2,}/g) ?? []).flatMap((w) => w.split('-')).filter((w) => w.length > 2 && !STOP.has(w)).map(stem).filter((w) => w.length > 2 && !STOP.has(w));

const { books, tools: toolCat } = readCatalogue();
const { tools, guides } = loadWorkosTools();
const pubsDir = join(process.cwd(), 'src', 'content', 'reados-publications');
const subtitle = (slug) => /^subtitle:\s*"?(.*?)"?\s*$/m.exec(readFileSync(join(pubsDir, slug, 'book.md'), 'utf8'))?.[1] ?? '';

// Documents: weight a field by repeating it.
const bookDocs = [...books.values()].filter((b) => b.published).map((b) => {
  const chapters = [...b.chapters.values()].filter((c) => c.published);
  const head = [b.title, b.title, b.title, b.description, b.description, b.kind === 'publication' ? subtitle(b.slug) : ''].join(' ');
  return { book: b, terms: tokens([head, ...chapters.map((c) => `${c.title} ${c.description}`)].join(' ')), chapters: chapters.map((c) => ({ c, terms: tokens(`${c.title} ${c.title} ${c.description}`) })) };
});
const toolDocs = tools.map((t) => {
  const g = guides[t.id] ?? {};
  return { tool: t, terms: tokens([t.name, t.name, t.name, t.question, t.description, t.description, (t.keywords ?? []).join(' '), t.category, g.purpose ?? '', (g.uses ?? []).join(' ')].join(' ')) };
});

// TF-IDF over books and tools together.
const df = new Map();
const all = [...bookDocs.map((d) => d.terms), ...toolDocs.map((d) => d.terms), ...bookDocs.flatMap((d) => d.chapters.map((c) => c.terms))];
for (const terms of all) for (const w of new Set(terms)) df.set(w, (df.get(w) ?? 0) + 1);
const N = all.length;
const vec = (terms) => {
  const tf = new Map();
  for (const w of terms) tf.set(w, (tf.get(w) ?? 0) + 1);
  const v = new Map();
  let norm = 0;
  for (const [w, n] of tf) { const x = (1 + Math.log(n)) * Math.log(N / (df.get(w) ?? 1)); v.set(w, x); norm += x * x; }
  norm = Math.sqrt(norm) || 1;
  for (const [w, x] of v) v.set(w, x / norm);
  return v;
};
const cos = (a, b) => { let s = 0; const [x, y] = a.size < b.size ? [a, b] : [b, a]; for (const [w, v] of x) { const u = y.get(w); if (u) s += u * v; } return s; };
const shared = (a, b, n = 5) => [...a].filter(([w]) => b.has(w)).map(([w, v]) => [w, v * b.get(w)]).sort((p, q) => q[1] - p[1]).slice(0, n).map(([w]) => w);

for (const d of bookDocs) { d.v = vec(d.terms); for (const c of d.chapters) c.v = vec(c.terms); }
for (const d of toolDocs) d.v = vec(d.terms);

const decided = new Set(readLinks().map((l) => `${l.reados}|${l.tool}`));
const suggestions = [];
for (const d of bookDocs) {
  // A pair scores by the whole book or by its best single chapter, whichever is higher: a collection mixes many topics,
  // so one well-matched chapter would otherwise be diluted by the rest.
  const scored = toolDocs.map((t) => {
    const best = d.chapters.map((c) => ({ c: c.c, s: cos(c.v, t.v), v: c.v })).sort((a, b) => b.s - a.s)[0];
    return { t, s: Math.max(cos(d.v, t.v), best ? best.s : 0), best };
  });
  const ranked = scored.filter((x) => x.s >= MIN && !decided.has(`${d.book.key}|${x.t.tool.id}`)).sort((a, b) => b.s - a.s).slice(0, PER_BOOK);
  for (const { t, s, best } of ranked) {
    const flags = [];
    if (s < STRONG) flags.push('weak match');
    if (!best || best.s < 0.1) flags.push('no clear chapter');
    suggestions.push({
      reados: d.book.key, book: d.book.title,
      chapter: best && best.s >= 0.1 ? best.c.slug : undefined, chapterTitle: best && best.s >= 0.1 ? best.c.title : undefined,
      tool: t.tool.id, toolName: t.tool.name, category: toolCat.get(t.tool.id).category,
      score: Math.round(s * 1000) / 1000, chapterScore: best ? Math.round(best.s * 1000) / 1000 : 0,
      terms: shared(best && best.s >= 0.1 ? best.v : d.v, t.v),
      status: 'suggested', flags,
    });
  }
}
suggestions.sort((a, b) => a.reados.localeCompare(b.reados) || b.score - a.score);
const out = {
  generated: new Date().toISOString().slice(0, 10),
  generator: 'node scripts/knowledge/suggest.mjs',
  method: `TF-IDF cosine similarity of READOS book and WORKOS tool metadata; up to ${PER_BOOK} tools per book with score ≥ ${MIN}; "weak match" below ${STRONG}. Suggestions are leads for review, not approved relationships.`,
  counts: { books: bookDocs.length, tools: toolDocs.length, suggestions: suggestions.length, flagged: suggestions.filter((s) => s.flags.length).length, booksWithSuggestions: new Set(suggestions.map((s) => s.reados)).size },
  suggestions,
};
writeFileSync(join(process.cwd(), 'src', 'data', 'knowledge-link-suggestions.json'), `${JSON.stringify(out, null, 1)}\n`);
console.log(JSON.stringify(out.counts));
