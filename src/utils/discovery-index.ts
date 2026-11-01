// The discovery catalogue: every WORKOS tool, every published READOS book and chapter, and the reviewed links
// between them, read from the same sources as the site at build time. Served as /discovery-index.json and
// searched in the browser by src/lib/discovery/search.ts. New tools and books are included by the next build.
import { loadWorkosTools, hasStandaloneGuide } from './workos-tools.ts';
import { knowledgeGraph, readCatalogue } from './knowledge.ts';
import { subcategoryLabel, topicForCategory } from './workos-topics.ts';
import type { DiscoveryIndex } from '../lib/discovery/search.ts';

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
    for (const c of b.chapters.values()) if (c.published) index.chapters.push({ n: c.title, d: clip(c.description, 200), b: bi, u: c.href });
  }
  // Reviewed READOS ↔ WORKOS connections (approved, published), for "Related resources": [tool id, chapter URL or book id].
  const { books: catalogueBooks } = readCatalogue();
  for (const l of knowledgeGraph().live) {
    const book = catalogueBooks.get(l.reados)!;
    index.links.push([l.tool, l.chapter ? book.chapters.get(l.chapter)!.href : l.reados]);
  }
  return index;
}
