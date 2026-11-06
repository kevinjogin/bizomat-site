// IndexNow: tells participating search engines (including Bing) that specific URLs changed.
// It does not guarantee crawling or indexing, and Google does not use IndexNow.
// The key is public by design: it must be served at https://<site>/<key>.txt (see public/; the site is seo/config.json).
import crypto from 'node:crypto';
import { fetchJson } from './http.mjs';

export const ENDPOINT = 'https://api.indexnow.org/indexnow';
import { HOST } from './site.mjs';

/** Hash of a built page's meaningful content: the <main> element, ignoring scripts and whitespace. */
export function contentHash(html) {
  const main = (html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? html)
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  return crypto.createHash('sha256').update(`${title}\n${desc}\n${main}`).digest('hex').slice(0, 20);
}

/** URLs whose content changed, appeared or disappeared between two manifests ({ url: hash }). */
export function changedUrls(previous, current) {
  if (!previous) return [];
  const urls = new Set();
  for (const [url, hash] of Object.entries(current)) if (previous[url] !== hash) urls.add(url);
  for (const url of Object.keys(previous)) if (!(url in current)) urls.add(url); // removed: lets engines see the 404
  return [...urls].filter((u) => new URL(u).hostname === HOST).sort();
}

/** Submit in batches of up to 10,000 URLs, as the protocol allows. Returns counts per batch. */
export async function submitIndexNow(urls, { key, fetchImpl = globalThis.fetch, dryRun = false } = {}) {
  const unique = [...new Set(urls)].filter((u) => u.startsWith(`https://${HOST}/`));
  if (!unique.length) return { submitted: 0, batches: 0, dryRun };
  if (!key) throw new Error('IndexNow key is not configured');
  let batches = 0;
  for (let i = 0; i < unique.length; i += 10_000) {
    const urlList = unique.slice(i, i + 10_000);
    if (!dryRun) {
      await fetchJson(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
        fetchImpl,
      });
    }
    batches++;
  }
  return { submitted: unique.length, batches, dryRun };
}
