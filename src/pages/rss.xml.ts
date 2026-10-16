import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site.ts';
import { getChapters, chapterAuthor } from '../utils/content.ts';
import { buildReadOSCollections, readosCollectionChapterHref } from '../utils/reados-collections.ts';

export async function GET(context: APIContext) {
  // READOS chapters, newest first, each linked at its edited-book address.
  const posts = await getChapters();
  const hrefs = new Map(buildReadOSCollections(posts).flatMap((b) => b.chapters.map((c) => [c.id, readosCollectionChapterHref(b, c)] as const)));
  return rss({
    title: `${SITE.name} READOS`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: hrefs.get(post.id) ?? '/reados/',
      categories: [post.data.category, ...post.data.tags],
      author: chapterAuthor(post.data.author),
    })),
    customData: `<language>en-au</language>`,
  });
}
