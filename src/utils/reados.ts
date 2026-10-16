import type { Chapter } from './content.ts';
import { CATEGORIES, CATEGORY_SLUGS, categorySlug } from '../config/taxonomy.ts';
import { readingTime } from './content.ts';

export const CHAPTERS_PER_VOLUME = 25;
export type ReadOSBook = {
  slug: string;
  title: string;
  category: string;
  description: string;
  volume: number;
  chapters: Chapter[];
  minutes: number;
};
/** Deterministic category volumes, generated from all published READOS chapters without dropping any. */
export function buildReadOSBooks(posts: Chapter[]): ReadOSBook[] {
  const books: ReadOSBook[] = [];
  for (const slug of CATEGORY_SLUGS) {
    const ordered = posts.filter((p) => categorySlug(p.data.category) === slug)
      .sort((a, b) => a.data.title.localeCompare(b.data.title, 'en-AU') || a.id.localeCompare(b.id));
    const volumes = Math.ceil(ordered.length / CHAPTERS_PER_VOLUME);
    for (let i = 0; i < volumes; i++) {
      const chapters = ordered.slice(i * CHAPTERS_PER_VOLUME, (i + 1) * CHAPTERS_PER_VOLUME);
      books.push({
        slug: `${slug}-volume-${String(i + 1).padStart(2, '0')}`,
        title: `${CATEGORIES[slug].name}: Volume ${i + 1}`,
        category: CATEGORIES[slug].name,
        description: CATEGORIES[slug].description,
        volume: i + 1,
        chapters,
        minutes: chapters.reduce((sum, p) => sum + readingTime(p.body), 0),
      });
    }
  }
  return books;
}
export const readosBookHref = (book: ReadOSBook) => `/reados/books/${book.slug}/`;
export const readosChapterHref = (book: ReadOSBook, chapter: Chapter) => `${readosBookHref(book)}${chapter.id}/`;
