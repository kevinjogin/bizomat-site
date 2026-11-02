// The Library: every published book grouped by subject, in the order the /reados/ page lists them
// (authored books, featured guides, then collections). Shared by the Library page and the homepage so both
// count and show the same records.
import type { LibraryIconName } from '../components/library/icons.ts';
import { LIBRARY_GUIDES } from '../data/library.ts';
import { getChapters } from './content.ts';
import { buildReadOSCollections, readosCollectionHref, readosCollectionChapterHref } from './reados-collections.ts';
import { getPublications, publicationHref, publicationChapterHref } from './publications.ts';
import { tagLabel } from '../config/taxonomy.ts';

export interface ReadosSubject { name: string; slug: string; description: string; icon: LibraryIconName }

export const READOS_SUBJECTS: ReadosSubject[] = [
  { name: 'Engineering', slug: 'engineering', icon: 'compass', description: 'Design, CAD and practical engineering methods' },
  { name: 'Manufacturing', slug: 'manufacturing', icon: 'factory', description: 'Tooling, factory production and quality' },
  { name: 'Operations', slug: 'operations', icon: 'flow', description: 'Processes, Lean and operational improvement' },
  { name: 'Projects', slug: 'projects', icon: 'flag', description: 'Planning, control, risk and project delivery' },
  { name: 'Technology', slug: 'technology', icon: 'chip', description: 'AI, databases, software and digital systems' },
  { name: 'Business', slug: 'business', icon: 'briefcase', description: 'Finance, strategy, governance and leadership' },
  { name: 'Products', slug: 'products', icon: 'box', description: 'Product development, validation and launches' },
  { name: 'Ideas', slug: 'ideas', icon: 'bulb', description: 'Innovation, exploration and practical concepts' },
];

// Each entry carries its chapter titles and links, so search can point straight to a matching chapter.
export interface ReadosEntry {
  id: string; title: string; summary: string; href: string; startHref: string; tags: string;
  cover: { title: string; category: string; slug: string; motif?: string; publicationLabel?: string };
  chapters: [string, string][];
}

export async function buildReadosLibrary() {
  const books = buildReadOSCollections(await getChapters());
  const publications = await getPublications();
  return READOS_SUBJECTS.map((c) => {
    const entries: ReadosEntry[] = [
      ...publications.filter((p) => p.book.data.category === c.name).map(({ book, chapters }): ReadosEntry => ({
        id: `publication-${book.id}`, title: book.data.title, summary: book.data.description, href: publicationHref(book.id),
        startHref: publicationChapterHref(book.id, chapters[0].data.chapterSlug),
        tags: [c.name, 'KEVOS original book', book.data.subtitle, ...book.data.tags.map(tagLabel)].join(' '),
        cover: { title: book.data.title, category: book.data.category, slug: book.id, motif: book.data.coverVariant, publicationLabel: 'KEVOS® ORIGINAL BOOK' },
        chapters: chapters.map((ch) => [ch.data.title, publicationChapterHref(book.id, ch.data.chapterSlug)]),
      })),
      ...(c.name === 'Business' ? LIBRARY_GUIDES : []).map((guide): ReadosEntry => ({
        id: `guide-${guide.slug}`, title: guide.title, summary: guide.description, href: `/library/${guide.slug}/`,
        startHref: `/library/${guide.slug}/${guide.chapters[0].slug}/`,
        tags: [c.name, guide.category, 'Library guide', guide.subtitle].join(' '),
        cover: { title: guide.title, category: guide.category, slug: guide.slug, publicationLabel: 'LIBRARY GUIDE' },
        chapters: guide.chapters.map((ch): [string, string] => [ch.title, `/library/${guide.slug}/${ch.slug}/`]),
      })),
      ...books.filter((book) => book.category === c.name).map((book): ReadosEntry => ({
        id: `collection-${book.slug}`, title: book.title, summary: book.description, href: readosCollectionHref(book),
        startHref: readosCollectionChapterHref(book, book.chapters[0]),
        tags: [c.name, 'Library collection'].join(' '),
        cover: { title: book.title, category: book.category, slug: book.slug },
        chapters: book.chapters.map((ch): [string, string] => [ch.data.title, readosCollectionChapterHref(book, ch)]),
      })),
    ];
    return { ...c, entries };
  }).filter((s) => s.entries.length > 0);
}
