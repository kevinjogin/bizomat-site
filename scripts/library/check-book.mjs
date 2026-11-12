// Library book check: reading time, figures, structure, names, tool links, knowledge links and cover
// for one authored book in src/content/reados-publications/<book-slug>/. Read-only.
//
// Usage, from the repository root (works the same in bash and PowerShell):
//   node scripts/library/check-book.mjs <book-slug>              check one book; exit code 1 when anything needs fixing
//   node scripts/library/check-book.mjs --inventory              every authored book: slug, status, category, chapters, title
//   node scripts/library/check-book.mjs --free-covers            cover pairings (motif:tone) no authored book uses yet
//   node scripts/library/check-book.mjs --find-tools <words...>  tools whose name, keywords or guide match the words,
//                                                                with the data-, guides- and calc- file to read for each
//
// Reading time uses the formula of readingTime() in src/utils/content.ts: code and figure fences, HTML tags and
// the characters # > * _ ` [ ] ( ) ! - are removed, then words are counted at 220 a minute and rounded.
// This script is a lead, not the gate: npm run verify, npm run knowledge:check and npm run seo:validate decide.
import fs from 'node:fs';
import { hasStandaloneGuide, loadWorkosTools } from '../../src/utils/workos-tools.ts';
import { COVER_MOTIFS, COVER_TONES, coverSpec } from '../../src/utils/reados-covers.ts';

const BOOKS = 'src/content/reados-publications';
const MIN_MINUTES = 10;
const MAX_MINUTES = 30;
const MIN_FIGURES = 2;

const read = (path) => fs.readFileSync(path, 'utf8');
const frontmatter = (text) => /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
const field = (meta, key) => new RegExp(`^${key}: "?(.+?)"?\\s*$`, 'm').exec(meta)?.[1] ?? '';
const bookDirs = () => fs.readdirSync(BOOKS).filter((d) => fs.existsSync(`${BOOKS}/${d}/book.md`));
const specialCovers = read('src/utils/reados-covers.ts');
const coverOf = (slug) => {
  const meta = frontmatter(read(`${BOOKS}/${slug}/book.md`));
  const spec = coverSpec({ slug, title: field(meta, 'title'), category: field(meta, 'category'), motif: field(meta, 'coverVariant') || undefined });
  return { key: `${spec.motif}:${spec.tone}`, published: /^status: published$/m.test(meta), special: specialCovers.includes(`'${slug}': {`) };
};

if (process.argv[2] === '--inventory') {
  for (const slug of bookDirs()) {
    const meta = frontmatter(read(`${BOOKS}/${slug}/book.md`));
    const dir = `${BOOKS}/${slug}/chapters`;
    const chapters = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.md')).length : 0;
    console.log([slug, field(meta, 'status') || 'draft', field(meta, 'category'), `${chapters} ch`, field(meta, 'title')].join(' | '));
  }
  process.exit(0);
}

if (process.argv[2] === '--find-tools') {
  const words = process.argv.slice(3).join(' ').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  if (!words.length) { console.error('Usage: node scripts/library/check-book.mjs --find-tools <words...>'); process.exit(2); }
  const { tools, guides, fileOf } = loadWorkosTools();
  const text = (v) => (Array.isArray(v) ? v.join(' ') : typeof v === 'string' ? v : '').toLowerCase();
  const scored = tools.map((t) => {
    const g = guides[t.id] ?? {};
    const parts = [[text(t.name), 3], [text(t.keywords), 2], [`${text(t.question)} ${text(t.description)} ${text(t.category)} ${text(g.purpose)}`, 1]];
    const score = words.reduce((s, w) => s + parts.reduce((p, [hay, weight]) => p + (hay.includes(w) ? weight : 0), 0), 0);
    return { t, score, page: hasStandaloneGuide(g) };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 25);
  for (const { t, score, page } of scored) {
    console.log(`${String(score).padStart(3)}  ${t.id}  ${page ? `/tools/${t.id}/` : `/tools/?tool=${t.id} (no page)`}\n     ${t.name}\n     read: public/tools/data-${fileOf[t.id]}.js, guides-${fileOf[t.id]}.js, calc-${fileOf[t.id]}.js`);
  }
  console.log(scored.length ? '\nLeads only: open each tool\'s data, guide and calc code before linking it.' : 'No tool matches those words.');
  process.exit(0);
}

if (process.argv[2] === '--free-covers') {
  const used = new Map(bookDirs().map((slug) => [coverOf(slug).key, slug]));
  const free = COVER_MOTIFS.flatMap((m) => COVER_TONES.map((t) => `${m}:${t}`)).filter((k) => !used.has(k));
  console.log(`${free.length} cover pairings not used by any authored book (motifs and tones from src/utils/reados-covers.ts):\n`);
  for (const m of COVER_MOTIFS) {
    const tones = COVER_TONES.filter((t) => free.includes(`${m}:${t}`));
    if (tones.length) console.log(`  ${m.padEnd(12)} ${tones.join(', ')}`);
  }
  process.exit(0);
}

const slug = process.argv[2];
if (!slug || !fs.existsSync(`${BOOKS}/${slug}/book.md`)) {
  console.error(`Usage: node scripts/library/check-book.mjs <book-slug> | --free-covers\nNo book at ${BOOKS}/${slug ?? '<book-slug>'}/book.md`);
  process.exit(2);
}

const problems = [];
const notes = [];
const flag = (where, what) => problems.push(`${where}: ${what}`);
const toolLinks = (text) => [...text.matchAll(/\]\(\/tools\/(\?tool=)?([a-z0-9-]+)\/?(?:#[^)]*)?\)/g)].map((m) => ({ id: m[2], app: Boolean(m[1]) }));
const sydneyToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());
const RETIRED = /\b(READOS|WORKOS|REACHOS|KEVOS|CADOS|GoCore)\b/;
const MARKED = /BIZOMAT\s*(®|™|\(R\)|\(TM\))/;

// Book page
const bookText = read(`${BOOKS}/${slug}/book.md`);
const bookMeta = frontmatter(bookText);
const status = field(bookMeta, 'status') || 'draft';
for (const key of ['publishDate', 'referencesChecked']) {
  const value = field(bookMeta, key);
  if (!value) flag('book.md', `${key} is missing`);
  else if (value > sydneyToday) flag('book.md', `${key} ${value} is after today in Sydney (${sydneyToday})`);
}
if (RETIRED.test(bookText)) flag('book.md', `retired name "${RETIRED.exec(bookText)[1]}" (write Library, Tools, BIZOMAT)`);
if (MARKED.test(bookText)) flag('book.md', 'BIZOMAT is not a registered trade mark: no ® or ™');

// Tools, guides and knowledge links
const { tools, guides } = loadWorkosTools();
const toolById = new Map(tools.map((t) => [t.id, t]));
const links = JSON.parse(read('src/data/knowledge-links.json')).links.filter((l) => l.reados === `publication/${slug}`);
const linkByTool = new Map(links.map((l) => [l.tool, l]));
const firstChapterFor = new Map();
const checkTool = (where, { id, app }) => {
  if (!toolById.has(id)) { flag(where, `tool "${id}" does not exist in public/tools/data-*.js`); return; }
  if (!app && !hasStandaloneGuide(guides[id])) flag(where, `tool "${id}" has no page of its own: link the calculator /tools/?tool=${id} instead`);
};
const bookLinks = toolLinks(bookText.replace(/^---[\s\S]*?---/, ''));
for (const link of bookLinks) { checkTool('book.md', link); if (!firstChapterFor.has(link.id)) firstChapterFor.set(link.id, null); }

// Chapters
const dir = `${BOOKS}/${slug}/chapters/`;
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.md')).sort() : [];
if (!files.length) flag(slug, 'no chapters');
const minutes = [];
const figureCounts = [];
console.log(`${field(bookMeta, 'title')} (${slug}), status: ${status}\n`);
for (const f of files) {
  const text = read(dir + f);
  const meta = frontmatter(text);
  const body = text.replace(/^---[\s\S]*?---/, '');
  const prose = body.replace(/```[\s\S]*?```/g, ' ');
  const words = prose.replace(/<[^>]+>/g, ' ').replace(/[#>*_`[\]()!-]/g, ' ').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 220));
  const figures = [...body.matchAll(/```figure\r?\n([\s\S]*?)```/g)].map((m) => m[1]);
  const chapterSlug = field(meta, 'chapterSlug');
  const draft = /^draft:\s*true\s*$/m.test(meta);
  minutes.push(mins);
  figureCounts.push(figures.length);

  if (mins < MIN_MINUTES) flag(f, `${mins} min (${words} words): under ${MIN_MINUTES} min, add substance (about ${MIN_MINUTES * 220 - 110} counted words is the floor)`);
  if (mins > MAX_MINUTES) flag(f, `${mins} min: over ${MAX_MINUTES} min, split the chapter`);
  if (figures.length < MIN_FIGURES) flag(f, `${figures.length} figure(s), at least ${MIN_FIGURES} needed`);
  figures.forEach((fig, i) => {
    const type = /^type:\s*(\S+)/m.exec(fig)?.[1] ?? '?';
    if (!/^title:\s*\S/m.test(fig)) flag(f, `figure ${i + 1} (${type}) has no title:`);
    if (!/^caption:\s*\S/m.test(fig)) flag(f, `figure ${i + 1} (${type}) has no caption:`);
    if (type === 'svg' && !/^viewbox:\s*\S/m.test(fig)) flag(f, `figure ${i + 1} (svg) has no viewbox:`);
    if (type === 'svg' && !/^alt:\s*\S/m.test(fig)) flag(f, `figure ${i + 1} (svg) has no alt:`);
  });
  if (/style\s*=/i.test(body)) flag(f, 'style= found: the content security policy forbids inline styles');
  if (/^# /m.test(prose)) flag(f, 'H1 (# ) in the body: the layout supplies the only H1');
  if (!/^## Exercise/m.test(body)) flag(f, 'no "## Exercise: ..." section with a worked answer');
  if (!body.includes('This is an illustration.')) flag(f, 'no "This is an illustration." label on the running case');
  if (RETIRED.test(text)) flag(f, `retired name "${RETIRED.exec(text)[1]}" (write Library, Tools, BIZOMAT)`);
  if (MARKED.test(text)) flag(f, 'BIZOMAT is not a registered trade mark: no ® or ™');
  if (status === 'published' && draft) flag(f, 'draft: true in a published book');
  if (status === 'draft' && !draft) flag(f, 'draft: false while the book is a draft (keep draft: true until approval)');

  const ids = toolLinks(body);
  for (const link of ids) {
    if (!firstChapterFor.get(link.id)) firstChapterFor.set(link.id, chapterSlug);
    checkTool(f, link);
  }
  const unique = [...new Set(ids.map((x) => x.id))];
  console.log(`${String(mins).padStart(3)} min ${String(words).padStart(5)} words ${figures.length} figures  ${f}${unique.length ? `  tools: ${unique.join(', ')}` : ''}`);
}

for (const [id, chapter] of firstChapterFor) {
  const link = linkByTool.get(id);
  if (!link) { flag('knowledge-links.json', `no entry for tool "${id}" (first linked in ${chapter ? `chapter "${chapter}"` : 'book.md'})`); continue; }
  if (link.status !== 'approved' || link.evidence !== 'book-link') flag('knowledge-links.json', `"${id}" must be status "approved", evidence "book-link"`);
  if (chapter && link.chapter !== chapter) notes.push(`knowledge-links.json: "${id}" points at chapter "${link.chapter ?? '(none)'}"; it is first linked in "${chapter}" (fine if that chapter applies it)`);
  if (!link.note || link.note.length < 20 || link.note.length > 260) flag('knowledge-links.json', `"${id}" note must be 20 to 260 characters`);
}
for (const link of links) if (link.evidence === 'book-link' && !firstChapterFor.has(link.tool)) flag('knowledge-links.json', `book-link entry for "${link.tool}" but the text no longer links it`);

// Cover
const cover = coverOf(slug);
const clash = bookDirs().filter((other) => other !== slug && coverOf(other).key === cover.key);
if (!cover.special) flag('reados-covers.ts', `no SPECIAL_COVERS entry for '${slug}' (it would use the category cover)`);
if (clash.length) flag('reados-covers.ts', `cover ${cover.key} is already used by ${clash.join(', ')} (run with --free-covers)`);

console.log(`\nChapters: ${files.length}; minutes ${Math.min(...minutes)}–${Math.max(...minutes)}; figures ${Math.min(...figureCounts)}–${Math.max(...figureCounts)} per chapter`);
console.log(`Tools linked: ${firstChapterFor.size ? [...firstChapterFor.keys()].join(', ') : 'none'}; knowledge-links entries for this book: ${links.length}`);
console.log(`Cover: ${cover.key}${cover.special ? '' : ' (category default)'}`);
if (notes.length) { console.log('\nNotes:'); for (const n of notes) console.log(`  - ${n}`); }
if (problems.length) {
  console.log(`\nCHECK (${problems.length}):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
} else console.log('\nNo problems found by this script. Now run the gates: npm run verify, npm run knowledge:check, npm run seo:validate.');
