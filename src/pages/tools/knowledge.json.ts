// READOS readings for each WORKOS tool, for the calculator at /tools/?tool=<id> (ui.js fetches this once).
// Built from src/data/knowledge-links.json: approved links between published pages only, the same data as the
// "Learn the Concepts Behind This Tool" section on the static tool pages.
import { knowledgeGraph } from '../../utils/knowledge.ts';

export function GET() {
  const graph = knowledgeGraph();
  const out: Record<string, { title: string; href: string; book: string; bookHref: string; kind: string; label: string; learn: string }[]> = {};
  for (const id of [...new Set(graph.live.map((l) => l.tool))].sort()) {
    out[id] = graph.readingsFor(id).map((r) => ({
      title: r.chapters[0]?.title ?? r.book.title, href: r.chapters[0]?.href ?? r.book.href,
      book: r.book.title, bookHref: r.book.href, kind: r.book.kind, label: r.label, learn: r.learn,
    }));
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
