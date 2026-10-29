// READOS ↔ WORKOS knowledge connections: validate src/data/knowledge-links.json and learning-pathways.json and report
// counts. Exit code 1 on any problem (the build fails on the same problems).
//
//   npm run knowledge:check              report counts and problems
//   npm run knowledge:check -- --report  also write docs/knowledge-links-review.md (items needing human review)
import { readFileSync, writeFileSync } from 'node:fs';
import { buildGraph, DISCOVERY_TOPIC, readCatalogue, readLinks, readPathways, validateLinks, validatePathways } from '../../src/utils/knowledge.ts';

const catalogue = readCatalogue();
const links = readLinks();
const problems = [...validateLinks(links, catalogue), ...validatePathways(readPathways(), links, catalogue)];
const books = [...catalogue.books.values()];
const by = (k, v) => links.filter((l) => l[k] === v).length;
const suggestions = JSON.parse(readFileSync('src/data/knowledge-link-suggestions.json', 'utf8'));
console.log(`READOS books: ${books.length} (${books.filter((b) => b.published).length} published: ${books.filter((b) => b.kind === 'publication' && b.published).length} publications, ${books.filter((b) => b.kind === 'collection' && b.published).length} collections)`);
console.log(`WORKOS tools: ${catalogue.tools.size}`);
console.log(`Relationships: ${links.length} (approved ${by('status', 'approved')}, rejected ${by('status', 'rejected')}, suggested ${by('status', 'suggested')}); evidence: book-link ${by('evidence', 'book-link')}, review ${by('evidence', 'review')}`);
console.log(`Suggestions awaiting review (src/data/knowledge-link-suggestions.json, ${suggestions.generated}): ${suggestions.suggestions.length}, ${suggestions.counts.flagged} flagged`);
if (!problems.length) {
  const g = buildGraph(links, catalogue);
  const bookKeys = new Set(g.live.map((l) => l.reados));
  console.log(`Published: ${g.live.length} links; ${bookKeys.size} books and ${new Set(g.live.map((l) => l.tool)).size} tools connected; ${readPathways().length} learning pathways`);
  console.log(`Published books without connections: ${books.filter((b) => b.published && !bookKeys.has(b.key)).length}`);
}
if (!problems.length && process.argv.includes('--report')) {
  const g = buildGraph(links, catalogue);
  const connected = new Set(g.live.map((l) => l.reados));
  const tool = (id) => catalogue.tools.get(id)?.name ?? id;
  const chapter = (l) => (l.chapter ? catalogue.books.get(l.reados).chapters.get(l.chapter)?.title : '');
  const bookTitle = (k) => catalogue.books.get(k)?.title ?? k;
  const lines = [
    '# READOS ↔ WORKOS connections: items for review',
    '',
    `Generated ${new Date().toISOString().slice(0, 10)} by \`npm run knowledge:check -- --report\` from \`src/data/knowledge-links.json\` and \`src/data/knowledge-link-suggestions.json\`. Do not edit by hand.`,
    '',
    `Published: ${g.live.length} relationships (${links.filter((l) => l.status === 'approved' && l.evidence === 'book-link').length} from links authors wrote in the books, ${links.filter((l) => l.status === 'approved' && l.evidence === 'review').length} from editorial review). Rejected: ${links.filter((l) => l.status === 'rejected').length}. Suggestions awaiting review: ${suggestions.suggestions.length} (${suggestions.counts.flagged} flagged as weak or without a clear chapter).`,
    '',
    '## 1. Approved by editorial review: please confirm',
    '',
    'These were approved by reading the chapter text and the tool definition (the reason records what was checked). Change `status` to `rejected` for any you disagree with.',
    '',
    '| READOS book | Chapter | WORKOS tool | Type | What was checked |', '|---|---|---|---|---|',
    ...links.filter((l) => l.status === 'approved' && l.evidence === 'review').map((l) => `| ${bookTitle(l.reados)} | ${chapter(l)} | ${tool(l.tool)} | ${l.type} | ${l.reason} |`),
    '',
    '## 2. Rejected',
    '',
    '| READOS book | Chapter | WORKOS tool | Reason |', '|---|---|---|---|',
    ...links.filter((l) => l.status === 'rejected').map((l) => `| ${bookTitle(l.reados)} | ${chapter(l)} | ${tool(l.tool)} | ${l.reason} |`),
    '',
    '## 3. Published READOS books with no approved connection',
    '',
    'Their pages show a WORKOS topic to browse where the category maps to one, and nothing otherwise. Suggestions for them, where any were found, are in section 4.',
    '',
    '| READOS book | Kind | Category | Shown instead |', '|---|---|---|---|',
    ...[...catalogue.books.values()].filter((b) => b.published && !connected.has(b.key)).sort((a, b) => a.title.localeCompare(b.title)).map((b) => `| ${b.title} | ${b.kind} | ${b.category} | ${DISCOVERY_TOPIC[b.category.toLowerCase()]?.name ?? 'nothing'} |`),
    '',
    '## 4. Suggestions awaiting review (strongest first, top 150)',
    '',
    'Metadata matches only; none is published. To approve one, add it to `knowledge-links.json` with `status: "approved"`, `evidence: "review"`, a `note` and a `reason`; to reject, add it with `status: "rejected"`.',
    '',
    '| Score | READOS book | Best chapter | WORKOS tool | Matched terms | Flags |', '|---|---|---|---|---|---|',
    ...[...suggestions.suggestions].sort((a, b) => b.score - a.score).slice(0, 150).map((x) => `| ${x.score} | ${x.book} | ${x.chapterTitle ?? ''} | ${x.toolName} | ${x.terms.join(', ')} | ${x.flags.join(', ')} |`),
    '',
  ];
  writeFileSync('docs/knowledge-links-review.md', lines.join('\n'));
  console.log('Wrote docs/knowledge-links-review.md');
}
for (const p of problems) console.log(`  ✗ ${p}`);
process.exitCode = problems.length ? 1 : 0;
