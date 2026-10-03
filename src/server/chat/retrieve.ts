// Lightweight keyword retrieval over the site's knowledge chunks. No vector database needed at
// this scale; the core facts are always included so the assistant never loses the basics.

export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  text: string;
}

const STOP = new Set(
  'a an and are as at be but by can could do does for from had has have how i if in into is it its me my of on or our so than that the their them then there these they this to up us was we what when where which who why will with would you your about gocore go core'.split(' '),
);

export const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/(ing|ers|er|es|s)$/, ''))
    .filter((w) => w.length > 2 && !STOP.has(w));

export function retrieve(chunks: KnowledgeChunk[], query: string, maxChars: number, limit = 7): KnowledgeChunk[] {
  const terms = new Set(tokenize(query));
  const always = chunks.filter((c) => c.id === 'core-facts');
  const scored = chunks
    .filter((c) => c.id !== 'core-facts')
    .map((c) => {
      const title = tokenize(c.title);
      const body = tokenize(c.text);
      let score = 0;
      for (const t of terms) {
        if (title.includes(t)) score += 3;
        score += Math.min(3, body.filter((w) => w === t).length);
      }
      if (c.id.startsWith('faq-')) score *= 1.4; // curated answers first
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.c);

  // If nothing matches (e.g. "hello", "who are you?"), offer the whole FAQ so the model can still help.
  const faq = chunks.filter((c) => c.id.startsWith('faq-'));
  const candidates = scored.length ? scored : faq;
  const max = (scored.length ? limit : faq.length) + always.length;
  const out = [...always];
  let size = always.reduce((n, c) => n + c.text.length, 0);
  for (const c of candidates) {
    if (out.length >= max || size + c.text.length > maxChars) continue;
    out.push(c);
    size += c.text.length;
  }
  return out;
}
