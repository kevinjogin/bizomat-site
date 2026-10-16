import { getCollection, type CollectionEntry } from 'astro:content';
import { READING, SITE } from '../config/site.ts';

export type Chapter = CollectionEntry<'chapters'>;
export type Work = CollectionEntry<'work'>;

/** Today's calendar date in Sydney (YYYY-MM-DD), so a chapter dated today is live all day in Australia. */
const todayInSydney = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(new Date());

/** Drafts and future-dated entries are visible in `astro dev` only, never in a production build. */
const isVisible = (draft: boolean, date?: Date) =>
  import.meta.env.DEV || (!draft && (!date || date.toISOString().slice(0, 10) <= todayInSydney()));

/** Published READOS chapters, newest first. */
export async function getChapters(): Promise<Chapter[]> {
  const all = await getCollection('chapters', ({ data }) => isVisible(data.draft, data.publishDate));
  return all.sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());
}

export async function getWork(): Promise<Work[]> {
  const all = await getCollection('work', ({ data }) => isVisible(data.draft));
  return all.sort((a, b) => a.data.order - b.data.order || b.data.date.getTime() - a.data.date.getTime());
}

export const hasWorkDetail = (entry: Work) => entry.data.detailPage ?? Boolean(entry.body?.trim());

export function readingTime(body = ''): number {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / READING.wordsPerMinute));
}

/** Previous brand bylines are consistently attributed to the same organisation under its current name. */
export const chapterAuthor = (author: string): string => author.trim().toLowerCase() === 'gocore' ? SITE.name : author;

export const formatDate = (date: Date, style: 'long' | 'short' = 'long') =>
  date.toLocaleDateString('en-AU', { day: 'numeric', month: style === 'long' ? 'long' : 'short', year: 'numeric', timeZone: 'Australia/Sydney' });
