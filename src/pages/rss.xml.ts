import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config/site.ts';
import { getInsights, insightUrl, insightAuthor } from '../utils/content.ts';

export async function GET(context: APIContext) {
  const posts = await getInsights();
  return rss({
    title: `${SITE.name} Insights`,
    description: SITE.description,
    site: context.site ?? SITE.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: insightUrl(post),
      categories: [post.data.category, ...post.data.tags],
      author: insightAuthor(post.data.author),
    })),
    customData: `<language>en-au</language>`,
  });
}
