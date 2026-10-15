// Builds the assistant's knowledge base from the site's own content at build time.
// Output: /assistant-knowledge.json, read by the chat function. Only published content is included,
// so the assistant can never reveal drafts and stays in sync with every deploy.
import { SITE, NAV } from '../config/site.ts';
import { CATEGORIES } from '../config/taxonomy.ts';
import { BACKGROUND, FUTURE, PRINCIPLES } from '../data/brand.ts';
import { FAQ } from '../data/faq.ts';
import { PROJECTS } from '../data/projects.ts';
import {
  ENGAGEMENT_MODELS,
  FACTORY_FIX,
  INDUSTRIES,
  PACKAGES,
  PRICING_NOTE,
  PROCESS,
  SERVICE_AREA,
  SERVICE_GROUPS,
  SOFTWARE,
} from '../data/services.ts';
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
    title: 'About KEVOS® (core facts)',
    url: '/about/',
    text: [
      `${SITE.name} (${SITE.url.replace('https://', '')}). ${SITE.tagline}. ${SITE.statement}`,
      `Services: ${SERVICE_GROUPS.map((g) => g.title).join(', ')}, plus the ${FACTORY_FIX.name} (${FACTORY_FIX.price}).`,
      `Service area: ${SERVICE_AREA}`,
      `Indicative prices (costs, fees): ${PACKAGES.map((p) => `${p.title} ${p.price}`).join('; ')}; ${FACTORY_FIX.name} ${FACTORY_FIX.price}. ${PRICING_NOTE} Final prices are confirmed in a written quote after scoping.`,
      'Certification: not every assignment includes professional engineering certification, statutory approval or sign-off; regulated or specialist work (for example designs that legally require a registered engineer or certifier) may require appropriately qualified or registered professionals. See /disclaimer/.',
      'To request a quote or discuss a project, use the form at /contact/ (REACHOS). Visitors can also book a meeting online: the Book a meeting option on /contact/ opens the KEVOS® Proton Calendar booking page.',
      `Main pages: ${NAV.map((n) => `${n.label} ${n.href}`).join(', ')}, Factory Fix /factory-fix/, Privacy /privacy/, Terms /terms/, Disclaimer /disclaimer/.`,
      SITE.email ? `Email: ${SITE.email}.` : 'There is no public email address or phone number listed; contact is through /contact/.',
    ].join(' '),
  });

  FAQ.forEach((f, i) => chunks.push({ id: `faq-${i}`, title: f.q, url: '/contact/', text: `${f.q} ${f.a}` }));
  chunks.push({
    id: 'brand-registration',
    title: `${SITE.name} brand and Australian trade mark`,
    url: '/terms/',
    text: `${SITE.name} is Australian word trade mark ${SITE.tradeMark.number}, registered in class ${SITE.tradeMark.class} for the services listed by IP Australia. Registered from ${SITE.tradeMark.registeredFrom}; entered on the register ${SITE.tradeMark.enteredOnRegister}. This is brand registration, not an engineering licence or government endorsement. READOS is the books and guides area at /reados/. WORKOS contains calculators at /tools/. REACHOS is the enquiry and booking area at /contact/. No separate registrations are claimed for these area names.`,
  });

  // Services, pricing and process: the receptionist's most important facts, boosted in retrieval (svc- ids).
  SERVICE_GROUPS.forEach((g) =>
    chunks.push({
      id: `svc-${g.id}`,
      title: `Service: ${g.title}`,
      url: `/services/#${g.id}`,
      text: `${g.title}. ${g.summary} Includes: ${g.items.join(', ')}. Typical deliverables: ${g.deliverables.join(', ')}.`,
    }),
  );
  chunks.push({
    id: 'svc-pricing',
    title: 'Indicative pricing and packages',
    url: '/services/#pricing',
    text: `${PACKAGES.map((p) => `${p.title}: ${p.price} (${p.description})`).join(' ')} ${PRICING_NOTE} Every assignment is scoped and the final price is confirmed in a written proposal before work begins. There is no online checkout; request a quote at /contact/.`,
  });
  chunks.push({
    id: 'svc-factory-fix',
    title: `${FACTORY_FIX.name} (${FACTORY_FIX.price})`,
    url: '/factory-fix/',
    text: `${FACTORY_FIX.name}, ${FACTORY_FIX.price}. ${FACTORY_FIX.summary} Possible deliverables: ${FACTORY_FIX.deliverables.join(', ')}. Supporting documents may include: ${FACTORY_FIX.documents.join(', ')}. Good candidates: ${FACTORY_FIX.examples.join('; ')}. ${FACTORY_FIX.terms} Implementation support can be quoted separately. A Factory Fix does not include statutory engineering certification. Enquire at /contact/?service=factory-fix.`,
  });
  chunks.push({
    id: 'svc-process',
    title: 'How a KEVOS® engagement works',
    url: '/how-it-works/',
    text: `${PROCESS.map((p, i) => `Stage ${i + 1}, ${p.title}: ${p.text}`).join(' ')} Before substantial work begins, KEVOS® defines scope, deliverables, assumptions, timing and commercial terms. Ways to engage: ${ENGAGEMENT_MODELS.map((m) => `${m.title} (${m.text})`).join(' ')} Payment terms are agreed for each assignment.`,
  });
  chunks.push({
    id: 'svc-industries',
    title: 'Industries KEVOS® helps',
    url: '/industries/',
    text: `Capability is problem-based rather than limited to one industry. ${INDUSTRIES.map((i) => `${i.title}: ${i.text}`).join(' ')}`,
  });
  chunks.push({
    id: 'svc-about',
    title: 'About KEVOS® and its background',
    url: '/about/',
    text: `KEVOS® is a professional small technical-services business for defined commercial assignments. It is led by its founder, whose practical background spans ${BACKGROUND.join(', ')}. ${SOFTWARE.text} KEVOS® is not affiliated with or endorsed by its software vendors. Not every assignment includes professional engineering certification or statutory approval; regulated or specialist work may require appropriately qualified or registered professionals (see /disclaimer/). ${FUTURE.text}`,
  });
  chunks.push({
    id: 'principles',
    title: 'KEVOS® principles',
    url: '/about/#principles',
    text: PRINCIPLES.map((p) => `${p.title}: ${p.text}`).join(' '),
  });
  chunks.push({
    id: 'categories',
    title: 'Insights categories',
    url: '/insights/',
    text: Object.values(CATEGORIES).map((c) => `${c.name}: ${c.description}`).join(' '),
  });

  chunks.push({
    id: 'proof-of-work',
    title: 'KEVOS® proof of work',
    url: '/#work',
    text: `The KEVOS® homepage lists ${PROJECTS.length} projects from 2010 to 2026 that make up the engineering record behind KEVOS®. They were delivered by its founder in employed, contract and consulting roles, not as KEVOS® engagements for those organisations, and organisation names do not imply endorsement. Sectors: steel and mining, machines and automation, plant and facilities, civil and structural, defence and transport, product development and operations. Some projects ended at concept or design stage and are labelled that way.`,
  });
  for (const p of PROJECTS) {
    chunks.push({
      id: `project-${p.id}`,
      title: `Proof of work: ${p.title}`,
      url: '/#work',
      text: `${p.title}: ${p.headline} (${p.years}; ${p.client}, ${p.about} ${p.industry}${p.location ? `, ${p.location}` : ''}). Role: ${p.role}. Status: ${p.statusLabel}. ${p.brief} Approach: ${p.approach.map((a) => `${a.title}: ${a.text}`).join(' ')} Outcome: ${p.outcome} ${p.note ?? ''}`,
    });
  }

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
