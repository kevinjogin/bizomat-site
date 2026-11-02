// /learning/<book index>.json: outlines of one book's published chapters (src/utils/learning-outlines.ts), in
// /discovery-index.json book order, so a learning path loads only the books its lessons use.
import { buildDiscoveryIndex } from '../../utils/discovery-index.ts';
import { outlineForUrl, type OutlineShard } from '../../utils/learning-outlines.ts';

let shards: OutlineShard[] | null = null;
function build(): OutlineShard[] {
  if (shards) return shards;
  const index = buildDiscoveryIndex();
  shards = index.books.map((b) => ({ v: 1 as const, book: b.id, chapters: {} as OutlineShard['chapters'] }));
  for (const c of index.chapters) { const o = outlineForUrl(c.u); if (o) shards[c.b].chapters[c.u] = o; }
  return shards;
}

export function getStaticPaths() {
  return build().map((_, i) => ({ params: { book: String(i) } }));
}

export function GET({ params }: { params: { book: string } }) {
  return new Response(JSON.stringify(build()[Number(params.book)]), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
