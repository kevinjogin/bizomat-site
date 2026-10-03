// Builds the assistant's knowledge base from the site's own content at build time.
// Output: /assistant-knowledge.json, read by the chat function. Only published content is included,
// so the assistant can never reveal drafts and stays in sync with every deploy.
import { SITE, NAV } from '../config/site.ts';
import { CATEGORIES } from '../config/taxonomy.ts';
import { EXPLORING, PRINCIPLES } from '../data/brand.ts';
import { FAQ } from '../data/faq.ts';
import { getInsights, getWork, hasWorkDetail, insightUrl } from '../utils/content.ts';

export interface KnowledgeChunk {
  id: string;
  title: string;
  url: string;
  text: string;
}

const strip = (md = '') =>
  md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*\|?[-:| ]+\|?\s*$/gm, ' ')
    .replace(/[*_`>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Split a Markdown body into sections at each H2, so retrieval can pick the relevant part. */
function sections(body = '') {
  const parts = body.split(/^##\s+/m);
  return parts
    .map((p, i) => {
      const [first, ...rest] = p.split('\n');
      return i === 0 ? { heading: '', text: strip(p) } : { heading: first.trim(), text: strip(rest.join('\n')) };
    })
    .filter((s) => s.text.length > 40);
}

export async function GET() {
  const chunks: KnowledgeChunk[] = [];

  chunks.push({
    id: 'core-facts',
    title: 'About GoCore (core facts)',
    url: '/about/',
    text: [
      `${SITE.name} (${SITE.url.replace('https://', '')}). ${SITE.statement}`,
      'GoCore is early-stage and deliberately broad. It has not launched products or paid services yet.',
      `Main pages: ${NAV.map((n) => `${n.label} ${n.href}`).join(', ')}, Privacy /privacy/, Terms /terms/.`,
      SITE.email ? `Email: ${SITE.email}.` : 'Contact is through the form at /contact/ (no public email address is listed yet).',
    ].join(' '),
  });

  FAQ.forEach((f, i) => chunks.push({ id: `faq-${i}`, title: f.q, url: '/about/', text: `${f.q} ${f.a}` }));

  chunks.push({
    id: 'exploring',
    title: 'What GoCore is exploring',
    url: '/',
    text: EXPLORING.map((e) => `${e.title}: ${e.text}`).join(' '),
  });
  chunks.push({
    id: 'principles',
    title: 'GoCore principles',
    url: '/about/#principles',
    text: PRINCIPLES.map((p) => `${p.title}: ${p.text}`).join(' '),
  });
  chunks.push({
    id: 'categories',
    title: 'Insights categories',
    url: '/insights/',
    text: Object.values(CATEGORIES).map((c) => `${c.name}: ${c.description}`).join(' '),
  });

  for (const w of await getWork()) {
    const url = hasWorkDetail(w) ? `/work/${w.id}/` : '/work/';
    chunks.push({ id: `work-${w.id}`, title: `Work: ${w.data.title}`, url, text: `${w.data.title} (${w.data.type}, status: ${w.data.status}). ${w.data.summary}` });
    sections(w.body).forEach((s, i) => chunks.push({ id: `work-${w.id}-${i}`, title: `${w.data.title}: ${s.heading}`, url, text: s.text }));
  }

  for (const post of await getInsights()) {
    const url = insightUrl(post);
    chunks.push({ id: `insight-${post.id}`, title: `Insight: ${post.data.title}`, url, text: `${post.data.title}. ${post.data.description} Category: ${post.data.category}.` });
    sections(post.body).forEach((s, i) =>
      chunks.push({ id: `insight-${post.id}-${i}`, title: `${post.data.title}${s.heading ? `: ${s.heading}` : ''}`, url, text: s.text.slice(0, 1400) }),
    );
  }

  return new Response(JSON.stringify({ generated: new Date().toISOString(), site: SITE.url, chunks }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
