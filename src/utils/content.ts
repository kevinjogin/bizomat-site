import { getCollection, type CollectionEntry } from 'astro:content';
import { INSIGHTS } from '../config/site.ts';
import { CATEGORIES, CATEGORY_SLUGS, TAG_SLUGS, categorySlug, type CategorySlug, type TagSlug } from '../config/taxonomy.ts';

export type Insight = CollectionEntry<'insights'>;
export type Work = CollectionEntry<'work'>;

/** Drafts and future-dated posts are visible in `astro dev` only, never in a production build. */
const isVisible = (draft: boolean, date?: Date) =>
  import.meta.env.DEV || (!draft && (!date || date.getTime() <= Date.now()));

export async function getInsights(): Promise<Insight[]> {
  const all = await getCollection('insights', ({ data }) => isVisible(data.draft, data.publishDate));
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
  return Math.max(1, Math.round(words / INSIGHTS.wordsPerMinute));
}

export const insightUrl = (entry: Insight) => `/insights/${entry.id}/`;
export const categoryUrl = (slug: CategorySlug) => `/insights/category/${slug}/`;
export const tagUrl = (slug: string) => `/insights/tag/${slug}/`;

/** Categories that have enough published articles to deserve a page. */
export function categoriesWithPosts(posts: Insight[]) {
  return CATEGORY_SLUGS.map((slug) => ({
    slug,
    ...CATEGORIES[slug],
    posts: posts.filter((p) => categorySlug(p.data.category) === slug),
  })).filter((c) => c.posts.length >= INSIGHTS.minPostsForCategoryPage);
}

/** Tags that have enough published articles to deserve a page. */
export function tagsWithPosts(posts: Insight[]) {
  return TAG_SLUGS.map((slug) => ({ slug, posts: posts.filter((p) => p.data.tags.includes(slug)) })).filter(
    (t) => t.posts.length >= INSIGHTS.minPostsForTagPage,
  );
}

export async function linkableTags(): Promise<Set<TagSlug>> {
  return new Set(tagsWithPosts(await getInsights()).map((t) => t.slug));
}

/** Related articles: shared category and tags, newest first. */
export function relatedInsights(current: Insight, posts: Insight[], limit = 3) {
  return posts
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      p,
      score:
        (p.data.category === current.data.category ? 2 : 0) +
        p.data.tags.filter((t) => current.data.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.publishDate.getTime() - a.p.data.publishDate.getTime())
    .slice(0, limit)
    .map((x) => x.p);
}

export function paginate<T>(items: T[], page: number, size = INSIGHTS.pageSize) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  return { items: items.slice((page - 1) * size, page * size), page, pages };
}

export const formatDate = (date: Date, style: 'long' | 'short' = 'long') =>
  date.toLocaleDateString('en-AU', { day: 'numeric', month: style === 'long' ? 'long' : 'short', year: 'numeric', timeZone: 'Australia/Sydney' });
