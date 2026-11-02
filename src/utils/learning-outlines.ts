// Library chapter outlines for KEVOS® learning paths: what each published chapter covers, taken from its own text at
// build time. Used to ground lessons (the AI is shown these excerpts, never asked to invent them), to show "From the
// Library" key points when AI is unavailable, and for reading times. Served per book as /learning/<book index>.json
// (src/pages/learning/[book].json.ts), so a lesson loads only the books it uses.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { READING } from '../config/site.ts';

const ROOT = process.cwd();
/** Same rule as readingTime() in src/utils/content.ts (which cannot be imported outside Astro): words / words-per-minute. */
const readingTime = (md: string) => Math.max(1, Math.round(plainText(md).split(/\s+/).filter(Boolean).length / READING.wordsPerMinute));
const PUBS = join(ROOT, 'src', 'content', 'reados-publications');
const CHAPTERS = join(ROOT, 'src', 'content', 'reados-chapters');

/** What a chapter teaches, in its own words (short excerpts only). */
export interface ChapterOutline {
  /** Reading time in minutes. */
  m: number;
  /** Section headings, in order (generic ones such as "Frequently asked questions" left out). */
  h: string[];
  /** Terms the author put in bold: the chapter's key concepts. */
  t: string[];
  /** The opening, before the first heading. */
  s: string;
  /** "Bringing it together" / "Summary", when the chapter has one. */
  sum?: string;
  /** "Common mistakes" / "Common misreadings": the first few. */
  mis?: string[];
  /** Questions the chapter asks or answers ("Questions to ask", "Frequently asked questions"). */
  q?: string[];
  /** The opening of "A worked example", when there is one. */
  ex?: string;
  /** An exercise the chapter sets ("Exercise: …"): its title and opening. */
  exr?: string;
}
export interface OutlineShard { v: 1; book: string; chapters: Record<string, ChapterOutline> }

const GENERIC = /^(bringing it together|summary|frequently asked questions|questions to ask|questions worth considering|questions to reflect on|signals worth watching|source basis and further reading|primary learning references|key terms|how this applies|applying (this|these))/i;

const clip = (s: string, n: number) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : t;
};
/** Markdown to plain sentences: no figures, tables, images, link targets, emphasis marks or HTML. */
export function plainText(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\|.*\|\s*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`]{1,3}([^*_`\n]+)[*_`]{1,3}/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '');
}
function paragraphs(md: string): string[] {
  return plainText(md).split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter((p) => p.length > 20 && !/^#/.test(p));
}
function items(md: string): string[] {
  const lines = md.split('\n').filter((l) => /^\s*([-*+]|\d+\.)\s+/.test(l)).map((l) => plainText(l).replace(/\s+/g, ' ').trim());
  return lines.length ? lines : paragraphs(md);
}

/** The outline of one chapter's Markdown file (front matter is skipped). */
export function outlineOf(source: string): ChapterOutline {
  const body = source.replace(/^---[\s\S]*?\n---\s*\n/, '');
  // Sections are the level-2 headings; a section's text keeps its ### sub-headings (FAQ questions, exercises).
  const parts = body.split(/^##[ \t]+(.+)$/m);
  const opening = parts[0];
  const sections: { level: number; title: string; text: string }[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    sections.push({ level: 2, title: plainText(parts[i]).trim(), text: parts[i + 1] ?? '' });
    for (const m of (parts[i + 1] ?? '').matchAll(/^###[ \t]+(.+)$\n([\s\S]*?)(?=^#{2,3}[ \t]|(?![\s\S]))/gm)) sections.push({ level: 3, title: plainText(m[1]).trim(), text: m[2] });
  }
  const find = (re: RegExp) => sections.find((s) => s.level === 2 && re.test(s.title));
  const terms = [...new Set([...body.replace(/```[\s\S]*?```/g, '').matchAll(/\*\*([^*\n]{3,48})\*\*/g)].map((m) => m[1].trim().replace(/[.:,;]$/, '')))]
    .filter((t) => !/^(note|warning|example|step \d+)$/i.test(t)).slice(0, 10);
  const out: ChapterOutline = {
    m: readingTime(body),
    h: sections.filter((s) => s.level === 2 && !GENERIC.test(s.title)).map((s) => clip(s.title, 90)).slice(0, 8),
    t: terms,
    s: clip(paragraphs(opening).slice(0, 2).join(' '), 520),
  };
  const sum = find(/^(bringing it together|summary|in summary|conclusion)/i);
  if (sum) out.sum = clip(paragraphs(sum.text).slice(0, 2).join(' '), 520);
  const mis = find(/^common (mistakes|misreadings|errors|pitfalls)/i);
  if (mis) out.mis = items(mis.text).map((x) => clip(x, 200)).slice(0, 4);
  const qa = find(/^(questions to ask|frequently asked questions|questions worth considering|questions to reflect on)/i);
  if (qa) {
    const asked = [...qa.text.matchAll(/^###\s+(.+\?)\s*$/gm)].map((m) => plainText(m[1]).trim());
    const listed = items(qa.text).filter((x) => /\?$/.test(x));
    out.q = [...asked, ...listed].map((x) => clip(x, 180)).slice(0, 4);
  }
  const ex = find(/^(a )?worked (example|illustration)/i);
  if (ex) out.ex = clip(paragraphs(ex.text)[0] ?? '', 320);
  const exr = sections.find((x) => /^exercises?\b/i.test(x.title));
  if (exr) out.exr = clip(`${exr.title}. ${paragraphs(exr.text)[0] ?? ''}`, 320);
  return out;
}

/** Source files: publication chapters by URL, collection chapters by id (their URL ends with the id). */
let files: { pubs: Map<string, string>; byId: Map<string, string> } | null = null;
function chapterFiles() {
  if (files) return files;
  const pubs = new Map<string, string>();
  for (const slug of existsSync(PUBS) ? readdirSync(PUBS) : []) {
    const dir = join(PUBS, slug, 'chapters');
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const m = readFileSync(join(dir, f), 'utf8').match(/^chapterSlug:\s*["']?([^"'\n]+)["']?\s*$/m);
      if (m) pubs.set(`/reados/publications/${slug}/${m[1].trim()}/`, join(dir, f));
    }
  }
  const byId = new Map(readdirSync(CHAPTERS).filter((n) => /\.mdx?$/.test(n)).map((n) => [n.replace(/\.mdx?$/, ''), join(CHAPTERS, n)] as [string, string]));
  return (files = { pubs, byId });
}

const outlines = new Map<string, ChapterOutline | null>();
/** The outline of the chapter at this URL, or undefined when there is no source file for it. */
export function outlineForUrl(url: string): ChapterOutline | undefined {
  if (outlines.has(url)) return outlines.get(url) ?? undefined;
  const { pubs, byId } = chapterFiles();
  const file = pubs.get(url) ?? (url.startsWith('/reados/collections/') ? byId.get(url.split('/').filter(Boolean).at(-1) ?? '') : undefined);
  const o = file ? outlineOf(readFileSync(file, 'utf8')) : null;
  outlines.set(url, o);
  return o ?? undefined;
}
