import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('Insight cards and article pages show timeless editorial metadata without visible dates', () => {
  const card = read('src/components/ArticleCard.astro');
  const article = read('src/pages/insights/[slug].astro');
  assert.doesNotMatch(card, /<FormattedDate\b|Published<\/|Updated<\/);
  assert.doesNotMatch(article, /<FormattedDate\b|<dt>Published<\/dt>|<dt>Updated<\/dt>/);
  assert.match(card, /min read/);
  assert.match(article, /<dt>Author<\/dt>/);
  assert.match(article, /<dt>Reading time<\/dt>/);
});

test('publication dates remain accurate in structured metadata and RSS', () => {
  const article = read('src/pages/insights/[slug].astro');
  const feed = read('src/pages/rss.xml.ts');
  assert.match(article, /datePublished: publishDate\.toISOString\(\)/);
  assert.match(article, /dateModified: \(updatedDate \?\? publishDate\)\.toISOString\(\)/);
  assert.match(feed, /pubDate: post\.data\.publishDate/);
});

test('KEVOS byline and category metadata use the current corporate identity', () => {
  const schema = read('src/content.config.ts');
  const util = read('src/utils/content.ts');
  const article = read('src/pages/insights/[slug].astro');
  const feed = read('src/pages/rss.xml.ts');
  assert.match(schema, /author: z\.string\(\)\.default\('KEVOS'\)/);
  assert.match(util, /export const insightAuthor/);
  assert.match(article, /const displayAuthor = insightAuthor\(author\)/);
  assert.match(feed, /author: insightAuthor\(post\.data\.author\)/);
  assert.doesNotMatch(read('src/pages/insights/category/[category]/[...page].astro'), /GoCore Insights/);
  assert.doesNotMatch(read('src/pages/insights/tag/[tag]/[...page].astro'), /GoCore Insights/);
});
