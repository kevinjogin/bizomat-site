// READOS ↔ WORKOS knowledge connections. Each relationship between a READOS book (a publication or an edited
// collection, optionally one chapter) and a WORKOS tool is stored once, in src/data/knowledge-links.json, and shown in
// both directions: "Apply This in Practice" on READOS pages and "Learn the Concepts Behind This Tool" on WORKOS pages.
// Only entries with status "approved" are published. The catalogues are read from the source files themselves (not
// astro:content), so the build, the tests and scripts/knowledge/*.mjs share one validator.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadWorkosTools, hasStandaloneGuide, toolAppHref, toolPageHref } from './workos-tools.ts';

export const LINK_TYPES = ['explains', 'applies', 'example', 'complements'] as const;
export type LinkType = (typeof LINK_TYPES)[number];
export const LINK_STATUSES = ['approved', 'suggested', 'rejected'] as const;
export type LinkStatus = (typeof LINK_STATUSES)[number];
/** Where the relationship comes from: a link the author wrote in the book, or an editorial review of both items. */
export const LINK_EVIDENCE = ['book-link', 'review'] as const;

export interface KnowledgeLink {
  reados: string; // "publication/<book slug>" or "collection/<book slug>"
  chapter?: string; // a publication chapterSlug, or a collection chapter's file slug
  tool: string; // WORKOS tool id
  type: LinkType;
  note: string; // why the tool is relevant, shown on READOS pages
  learn?: string; // what the reader learns, shown on WORKOS pages (defaults to the chapter's or book's description)
  status: LinkStatus;
  evidence: (typeof LINK_EVIDENCE)[number];
  reason?: string; // for review evidence and rejections: what was checked
  order?: number; // optional display order (lower first)
}

/** Labels shown with each connection, so a reader can see why a book and a tool belong together. */
export const TYPE_LABELS: Record<LinkType, { forReader: string; forTool: string }> = {
  explains: { forReader: 'Explained in this book', forTool: 'Explains the concept' },
  applies: { forReader: 'Applies this method', forTool: 'Method explained here' },
  example: { forReader: 'Worked example', forTool: 'Worked example' },
  complements: { forReader: 'Useful alongside', forTool: 'Useful alongside' },
};

const ROOT = process.cwd();
const PUBS = join(ROOT, 'src', 'content', 'reados-publications');
const CHAPTERS = join(ROOT, 'src', 'content', 'reados-chapters');
const MAX_CHAPTERS = 24; // as src/utils/reados-collections.ts: a longer book is split into parts

export interface ReadosChapter { slug: string; title: string; description: string; href: string; published: boolean }
export interface ReadosBook { key: string; kind: 'publication' | 'collection'; slug: string; title: string; description: string; category: string; href: string; published: boolean; chapters: Map<string, ReadosChapter> }

/** Top-level scalar fields of a Markdown file's frontmatter (enough for titles, slugs, dates and flags). */
function frontmatter(file: string): Record<string, string> {
  const text = readFileSync(file, 'utf8');
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? '';
  const out: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const m = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!m || m[2] === '') continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1).replace(/\\"/g, '"').replace(/''/g, "'");
    out[m[1]] = v;
  }
  return out;
}
const todayInSydney = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());
const dated = (d?: string) => !d || d.slice(0, 10) <= todayInSydney();

/** The edited collections listed in src/utils/reados-collections.ts (slug, title, category, description, chapter ids). */
export function readCollectionSubjects() {
  const src = readFileSync(join(ROOT, 'src', 'utils', 'reados-collections.ts'), 'utf8');
  const unq = (s: string) => s.slice(1, -1).replace(/\\'/g, "'");
  const subjects = [...src.matchAll(/\{slug:('(?:[^'\\]|\\.)*'),title:('(?:[^'\\]|\\.)*'),category:('(?:[^'\\]|\\.)*'),description:('(?:[^'\\]|\\.)*'),ids:\[([^\]]*)\]\}/g)].map((m) => ({
    slug: unq(m[1]), title: unq(m[2]), category: unq(m[3]), description: unq(m[4]),
    ids: [...m[5].matchAll(/'([^']+)'/g)].map((x) => x[1]),
  }));
  const declared = (src.match(/\{slug:'/g) ?? []).length;
  if (subjects.length !== declared) throw new Error(`knowledge: read ${subjects.length} of ${declared} READOS collections from reados-collections.ts`);
  return subjects;
}

let catalogueCache: { books: Map<string, ReadosBook>; tools: Map<string, { id: string; name: string; question: string; category: string; href: string; appHref: string }> } | null = null;

/** Every READOS book (published or not) and every WORKOS tool, with the routes the site builds for them. */
export function readCatalogue() {
  if (catalogueCache) return catalogueCache;
  const books = new Map<string, ReadosBook>();
  for (const slug of readdirSync(PUBS)) {
    const bookFile = join(PUBS, slug, 'book.md');
    if (!existsSync(bookFile)) continue;
    const b = frontmatter(bookFile);
    const href = `/reados/publications/${slug}/`;
    const published = b.status === 'published' && dated(b.publishDate);
    const chapters = new Map<string, ReadosChapter>();
    const dir = join(PUBS, slug, 'chapters');
    for (const f of existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.md')) : []) {
      const c = frontmatter(join(dir, f));
      chapters.set(c.chapterSlug, { slug: c.chapterSlug, title: c.title, description: c.description, href: `${href}${c.chapterSlug}/`, published: published && c.draft !== 'true' });
    }
    books.set(`publication/${slug}`, { key: `publication/${slug}`, kind: 'publication', slug, title: b.title, description: b.description, category: b.category, href, published, chapters });
  }
  // Collections: chapters join a subject only within its category and only once published, as buildReadOSCollections does.
  const chapterMeta = new Map<string, { title: string; description: string; category: string; published: boolean }>();
  for (const f of readdirSync(CHAPTERS).filter((n) => /\.mdx?$/.test(n) && !n.startsWith('_'))) {
    const c = frontmatter(join(CHAPTERS, f));
    chapterMeta.set(f.replace(/\.mdx?$/, ''), { title: c.title, description: c.description, category: (c.category ?? '').toLowerCase(), published: c.draft !== 'true' && dated(c.publishDate) });
  }
  for (const s of readCollectionSubjects()) {
    const members = s.ids.filter((id) => chapterMeta.get(id)?.published && chapterMeta.get(id)?.category === s.category);
    const parts = Math.max(1, Math.ceil(members.length / MAX_CHAPTERS));
    const bookSlug = (id: string) => (parts === 1 ? s.slug : `${s.slug}-part-${String(Math.floor(members.indexOf(id) / MAX_CHAPTERS) + 1).padStart(2, '0')}`);
    const chapters = new Map<string, ReadosChapter>();
    for (const id of s.ids) {
      const c = chapterMeta.get(id);
      if (!c) continue;
      const published = members.includes(id);
      chapters.set(id, { slug: id, title: c.title, description: c.description, href: published ? `/reados/collections/${bookSlug(id)}/${id}/` : '', published });
    }
    books.set(`collection/${s.slug}`, { key: `collection/${s.slug}`, kind: 'collection', slug: s.slug, title: s.title, description: s.description, category: s.category, href: `/reados/collections/${parts === 1 ? s.slug : `${s.slug}-part-01`}/`, published: members.length > 0, chapters });
  }
  const { tools, guides } = loadWorkosTools();
  const toolMap = new Map(tools.map((t) => [t.id, { id: t.id, name: t.name, question: t.question, category: t.category, href: hasStandaloneGuide(guides[t.id]) ? toolPageHref(t.id) : toolAppHref(t.id), appHref: toolAppHref(t.id) }]));
  catalogueCache = { books, tools: toolMap };
  return catalogueCache;
}

export function readLinks(file = join(ROOT, 'src', 'data', 'knowledge-links.json')): KnowledgeLink[] {
  return JSON.parse(readFileSync(file, 'utf8')).links;
}

/** Problems in the relationship data: unknown ids, bad fields, duplicates. An empty list means the data is valid. */
export function validateLinks(links: KnowledgeLink[], catalogue = readCatalogue()): string[] {
  const problems: string[] = [];
  const seen = new Map<string, number>();
  links.forEach((l, i) => {
    const at = `link ${i + 1} (${l.reados}${l.chapter ? `#${l.chapter}` : ''} → ${l.tool})`;
    const book = catalogue.books.get(l.reados);
    if (!/^(publication|collection)\/[a-z0-9-]+$/.test(l.reados ?? '')) problems.push(`${at}: reados must be "publication/<slug>" or "collection/<slug>"`);
    else if (!book) problems.push(`${at}: no READOS book ${l.reados}`);
    else if (l.chapter && !book.chapters.has(l.chapter)) problems.push(`${at}: ${l.reados} has no chapter ${l.chapter}`);
    if (!catalogue.tools.has(l.tool)) problems.push(`${at}: no WORKOS tool ${l.tool}`);
    if (!LINK_TYPES.includes(l.type)) problems.push(`${at}: type must be one of ${LINK_TYPES.join(', ')}`);
    if (!LINK_STATUSES.includes(l.status)) problems.push(`${at}: status must be one of ${LINK_STATUSES.join(', ')}`);
    if (!LINK_EVIDENCE.includes(l.evidence)) problems.push(`${at}: evidence must be one of ${LINK_EVIDENCE.join(', ')}`);
    if (typeof l.note !== 'string' || l.note.trim().length < 20 || l.note.length > 260) problems.push(`${at}: note must be 20–260 characters`);
    if (l.learn != null && (typeof l.learn !== 'string' || l.learn.trim().length < 20 || l.learn.length > 260)) problems.push(`${at}: learn must be 20–260 characters`);
    if (l.evidence === 'review' && l.status !== 'suggested' && (!l.reason || l.reason.length < 20)) problems.push(`${at}: a reviewed link needs a reason (what was checked)`);
    if (l.order != null && !Number.isInteger(l.order)) problems.push(`${at}: order must be a whole number`);
    for (const k of Object.keys(l)) if (!['reados', 'chapter', 'tool', 'type', 'note', 'learn', 'status', 'evidence', 'reason', 'order'].includes(k)) problems.push(`${at}: unknown field ${k}`);
    const key = `${l.reados}|${l.chapter ?? ''}|${l.tool}`;
    if (seen.has(key)) problems.push(`${at}: duplicates link ${seen.get(key)! + 1}`);
    else seen.set(key, i);
  });
  return problems;
}

export interface ToolConnection { tool: { id: string; name: string; question: string; href: string }; type: LinkType; label: string; note: string; chapters: { title: string; href: string }[]; order: number }
export interface ReadingConnection { book: { title: string; href: string; kind: string }; type: LinkType; label: string; learn: string; chapters: { title: string; href: string }[]; order: number }
const TYPE_RANK: Record<LinkType, number> = { explains: 0, applies: 1, example: 2, complements: 3 };
const byOrder = <T extends { order: number; type: LinkType }>(name: (x: T) => string) => (a: T, b: T) => a.order - b.order || TYPE_RANK[a.type] - TYPE_RANK[b.type] || name(a).localeCompare(name(b), 'en-AU');

let graphCache: ReturnType<typeof buildGraph> | null = null;

/** Published connections in both directions, merged so each tool (or book) appears once per page. Throws on invalid data. */
export function knowledgeGraph() {
  if (!graphCache) graphCache = buildGraph(readLinks());
  return graphCache;
}
export function buildGraph(links: KnowledgeLink[], catalogue = readCatalogue()) {
  const problems = validateLinks(links, catalogue);
  if (problems.length) throw new Error(`knowledge-links.json is invalid:\n  ${problems.join('\n  ')}`);
  // Only approved links between published pages are shown.
  const live = links.filter((l) => {
    const book = catalogue.books.get(l.reados)!;
    return l.status === 'approved' && book.published && (!l.chapter || book.chapters.get(l.chapter)!.published);
  });
  const chapterOf = (l: KnowledgeLink) => (l.chapter ? catalogue.books.get(l.reados)!.chapters.get(l.chapter)! : null);

  /** Tools for a READOS book (all its links) or for one chapter, one entry per tool. */
  function toolsFor(reados: string, chapter?: string): ToolConnection[] {
    const out = new Map<string, ToolConnection>();
    for (const l of live.filter((x) => x.reados === reados && (chapter === undefined || x.chapter === chapter))) {
      const t = catalogue.tools.get(l.tool)!;
      const c = chapterOf(l);
      const prev = out.get(l.tool);
      if (prev) {
        if (c && !prev.chapters.some((x) => x.href === c.href)) prev.chapters.push({ title: c.title, href: c.href });
        if (TYPE_RANK[l.type] < TYPE_RANK[prev.type]) Object.assign(prev, { type: l.type, label: TYPE_LABELS[l.type].forReader });
        prev.order = Math.min(prev.order, l.order ?? 100);
        continue;
      }
      out.set(l.tool, { tool: { id: t.id, name: t.name, question: t.question, href: t.href }, type: l.type, label: TYPE_LABELS[l.type].forReader, note: l.note, chapters: c ? [{ title: c.title, href: c.href }] : [], order: l.order ?? 100 });
    }
    return [...out.values()].sort(byOrder((x) => x.tool.name));
  }
  /** READOS books for a tool, one entry per book, with the chapters that cover it. */
  function readingsFor(toolId: string): ReadingConnection[] {
    const out = new Map<string, ReadingConnection>();
    for (const l of live.filter((x) => x.tool === toolId)) {
      const book = catalogue.books.get(l.reados)!;
      const c = chapterOf(l);
      const prev = out.get(l.reados);
      if (prev) {
        if (c && !prev.chapters.some((x) => x.href === c.href)) prev.chapters.push({ title: c.title, href: c.href });
        if (TYPE_RANK[l.type] < TYPE_RANK[prev.type]) Object.assign(prev, { type: l.type, label: TYPE_LABELS[l.type].forTool });
        prev.order = Math.min(prev.order, l.order ?? 100);
        continue;
      }
      out.set(l.reados, {
        book: { title: book.title, href: book.href, kind: book.kind === 'publication' ? 'KEVOS® original book' : 'READOS collection' },
        type: l.type, label: TYPE_LABELS[l.type].forTool,
        learn: l.learn ?? c?.description ?? book.description,
        chapters: c ? [{ title: c.title, href: c.href }] : [], order: l.order ?? 100,
      });
    }
    return [...out.values()].sort(byOrder((x) => x.book.title));
  }
  return { live, toolsFor, readingsFor, catalogue };
}

/** WORKOS topic to browse when a READOS category has no approved connections yet (null where no topic fits well). */
export const DISCOVERY_TOPIC: Record<string, { slug: string; name: string } | null> = {
  engineering: { slug: 'engineering-design', name: 'Engineering & Design' },
  manufacturing: { slug: 'manufacturing-production', name: 'Manufacturing & Production' },
  operations: { slug: 'manufacturing-production', name: 'Manufacturing & Production' },
  projects: { slug: 'projects-improvement', name: 'Projects & Improvement' },
  business: { slug: 'business-commercial', name: 'Business & Commercial' },
  products: null, technology: null, ideas: null,
};

// ---------- Learning pathways: Learn → Apply → Verify → Improve ----------
// src/data/learning-pathways.json names a chapter to learn from, a tool to apply and an optional next reading.
// Verify and Improve are built from what the tool already has: its feasibility and verification checks, its stated
// limitations and its report and share features. A pathway's learn → apply pair must be an approved link.
export interface PathwayRef { reados: string; chapter: string }
export interface PathwayData { id: string; title: string; summary: string; learn: PathwayRef; apply: { tool: string }; next?: PathwayRef }
export interface Pathway {
  id: string; title: string; summary: string;
  learn: { title: string; href: string; book: string; description: string };
  apply: { id: string; name: string; question: string; href: string };
  verify: { limitations: string[] };
  next?: { title: string; href: string; book: string };
}

export function readPathways(file = join(ROOT, 'src', 'data', 'learning-pathways.json')): PathwayData[] {
  return JSON.parse(readFileSync(file, 'utf8')).pathways;
}

export function validatePathways(pathways: PathwayData[], links: KnowledgeLink[], catalogue = readCatalogue()): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  const chapterOk = (r: PathwayRef | undefined) => !!r && !!catalogue.books.get(r.reados)?.chapters.get(r.chapter)?.published;
  for (const p of pathways) {
    const at = `pathway ${p.id}`;
    if (!/^[a-z0-9-]+$/.test(p.id ?? '')) problems.push(`${at}: id must be lowercase words and hyphens`);
    if (ids.has(p.id)) problems.push(`${at}: duplicate id`);
    ids.add(p.id);
    if (!p.title || p.title.length < 10 || !p.summary || p.summary.length < 30) problems.push(`${at}: needs a title and a summary`);
    if (!chapterOk(p.learn)) problems.push(`${at}: learn must name a published chapter (${p.learn?.reados}#${p.learn?.chapter})`);
    if (!catalogue.tools.has(p.apply?.tool)) problems.push(`${at}: no WORKOS tool ${p.apply?.tool}`);
    if (p.next && !chapterOk(p.next)) problems.push(`${at}: next must name a published chapter`);
    const approved = links.some((l) => l.status === 'approved' && l.reados === p.learn?.reados && l.chapter === p.learn?.chapter && l.tool === p.apply?.tool);
    if (!approved) problems.push(`${at}: learn → apply is not an approved relationship in knowledge-links.json`);
  }
  return problems;
}

let pathwayCache: Pathway[] | null = null;
/** Published pathways, resolved to titles and routes. Throws on invalid data. */
export function learningPathways(): Pathway[] {
  if (pathwayCache) return pathwayCache;
  const data = readPathways();
  const catalogue = readCatalogue();
  const problems = validatePathways(data, readLinks(), catalogue);
  if (problems.length) throw new Error(`learning-pathways.json is invalid:\n  ${problems.join('\n  ')}`);
  const { guides } = loadWorkosTools();
  const chapter = (r: PathwayRef) => {
    const book = catalogue.books.get(r.reados)!;
    const c = book.chapters.get(r.chapter)!;
    return { title: c.title, href: c.href, book: book.title, description: c.description };
  };
  pathwayCache = data.map((p) => {
    const t = catalogue.tools.get(p.apply.tool)!;
    return {
      id: p.id, title: p.title, summary: p.summary,
      learn: chapter(p.learn),
      apply: { id: t.id, name: t.name, question: t.question, href: t.appHref },
      verify: { limitations: guides[t.id]?.limitations ?? [] },
      next: p.next ? (({ title, href, book }) => ({ title, href, book }))(chapter(p.next)) : undefined,
    };
  });
  return pathwayCache;
}
/** Pathways that start from a READOS book, or that apply a given tool. */
export const pathwaysForBook = (reados: string) => learningPathways().filter((p) => readPathways().find((d) => d.id === p.id)!.learn.reados === reados);
export const pathwaysForTool = (toolId: string) => learningPathways().filter((p) => p.apply.id === toolId);
