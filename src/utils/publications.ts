import { getCollection } from 'astro:content';
import { assemblePublications } from './publication-model.ts';
import { readingTime } from './content.ts';
export { publicationHref, publicationChapterHref } from './publication-model.ts';

export async function getPublications() {
  const [books, chapters] = await Promise.all([getCollection('publications'), getCollection('publicationChapters')]);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());
  return assemblePublications(books, chapters, today, import.meta.env.DEV).map(publication => ({
    ...publication, minutes: publication.chapters.reduce((total, chapter) => total + readingTime(chapter.body), 0),
  })).sort((a, b) => a.book.data.title.localeCompare(b.book.data.title, 'en-AU'));
}
