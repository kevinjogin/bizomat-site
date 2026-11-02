// The discovery catalogue: every KEVOS® tool, every published Library book and chapter, and the reviewed links
// between them, read from the same sources as the site at build time. Served as /discovery-index.json and
// searched in the browser by src/lib/discovery/search.ts. New tools and books are included by the next build.
import { loadWorkosTools, hasStandaloneGuide } from './workos-tools.ts';
import { knowledgeGraph, readCatalogue } from './knowledge.ts';
import { subcategoryLabel, topicForCategory } from './workos-topics.ts';
import type { DiscoveryIndex } from '../lib/discovery/search.ts';
import { outlineForUrl } from './learning-outlines.ts';
import type { DiscoveryDetails } from '../lib/discovery/plan.ts';

const clip = (s: string | undefined, n: number) => {
  const t = (s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : t;
};

export function buildDiscoveryIndex(): DiscoveryIndex {
  const { tools, guides } = loadWorkosTools();
  const { books } = readCatalogue();
  const index: DiscoveryIndex = { v: 1, tools: [], books: [], chapters: [], links: [] };
  for (const t of tools) {
    const g = guides[t.id] ?? {};
    index.tools.push({
      id: t.id,
      n: t.name,
      d: clip(t.description, 170),
      q: clip(t.question, 150),
      c: subcategoryLabel(t.category),
      tp: topicForCategory(t.category).name,
      // Search-only words: the tool's keywords and the jobs its guide says it is used for.
      k: clip([...(t.keywords ?? []), ...(g.uses ?? [])].join('; '), 200),
      p: hasStandaloneGuide(g) ? 1 : 0,
    });
  }
  for (const b of books.values()) {
    if (!b.published) continue;
    const bi = index.books.push({ id: b.key, n: b.title, d: clip(b.description, 200), c: b.category.charAt(0).toUpperCase() + b.category.slice(1), u: b.href, kind: b.kind }) - 1;
    for (const c of b.chapters.values()) {
      if (!c.published) continue;
      // m: reading minutes; k: the chapter's key terms and section headings, so search reaches its content.
      const o = outlineForUrl(c.href);
      index.chapters.push({ n: c.title, d: clip(c.description, 200), b: bi, u: c.href, ...(o ? { m: o.m, k: clip([...o.t, ...o.h].join('; '), 140) } : {}) });
    }
  }
  // Reviewed Library ↔ Tools connections (approved, published), for "Related resources": [tool id, chapter URL or book id].
  const { books: catalogueBooks } = readCatalogue();
  for (const l of knowledgeGraph().live) {
    const book = catalogueBooks.get(l.reados)!;
    index.links.push([l.tool, l.chapter ? book.chapters.get(l.chapter)!.href : l.reados]);
  }
  return index;
}

/** Labels that choose a mode rather than ask for a value; they are not "inputs" a visitor has to find. */
const MODE_LABELS = new Set(['Calculate', 'Solve for', 'Mode', 'Unit of the entered value', 'Find']);
const first = (v: unknown): string => (Array.isArray(v) ? String(v[0] ?? '') : typeof v === 'string' ? v.split(/(?<=[.!?])\s+/)[0] : '');

/**
 * What each tool asks for and gives back, from its own definition and guide (facts, not AI): the input labels with
 * units, the outputs it reports and one sentence on checking or reading the result. Served as /discovery-details.json
 * and loaded only when a solution path is shown.
 */
export function buildDiscoveryDetails(): DiscoveryDetails {
  const { tools, guides } = loadWorkosTools();
  const out: DiscoveryDetails = { v: 1, tools: {} };
  for (const t of tools) {
    const g = (guides[t.id] ?? {}) as { outputs?: string[]; interpret?: unknown; verify?: unknown; limitations?: unknown };
    const fields = (t.fields ?? []) as Array<{ label?: string; unit?: string; type?: string }>;
    const inputs = fields.filter((f) => f.label && !MODE_LABELS.has(f.label)).map((f) => clip(`${f.label}${f.unit ? ` (${f.unit})` : ''}`, 48));
    out.tools[t.id] = {
      i: inputs.slice(0, 6),
      m: Math.max(0, inputs.length - 6),
      o: (g.outputs ?? []).slice(0, 4).map((o) => clip(o, 70)),
      c: clip(first(g.verify) || first(g.interpret) || first(g.limitations), 220),
    };
  }
  return out;
}
