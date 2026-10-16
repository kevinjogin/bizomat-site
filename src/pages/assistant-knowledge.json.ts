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
import { getChapters, getWork, hasWorkDetail } from '../utils/content.ts';
import { buildReadOSCollections, readosCollectionChapterHref } from '../utils/reados-collections.ts';
import { ASSESSMENT, CONDITIONS, EXAMPLES, EXCLUSIONS, INCLUSIONS, JOURNEY } from '../config/assessment.ts';

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
      `Services: ${SERVICE_GROUPS.map((g) => g.title).join(', ')}, plus the ${ASSESSMENT.name} (${ASSESSMENT.priceLabel} fixed, ${ASSESSMENT.path}) and the ${FACTORY_FIX.name} (${FACTORY_FIX.price}).`,
      `Service area: ${SERVICE_AREA}`,
      `Indicative prices (costs, fees): ${ASSESSMENT.name} ${ASSESSMENT.priceLabel} fixed for one defined problem; ${PACKAGES.map((p) => `${p.title} ${p.price}`).join('; ')}; ${FACTORY_FIX.name} ${FACTORY_FIX.price}. ${PRICING_NOTE} Final prices are confirmed in a written quote after scoping.`,
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
    id: 'svc-assessment',
    title: `${ASSESSMENT.name} (${ASSESSMENT.priceLabel})`,
    url: ASSESSMENT.path,
    text: [
      `${ASSESSMENT.name}: ${ASSESSMENT.priceLabel}, ${ASSESSMENT.priceCaption.toLowerCase()} for one defined engineering or manufacturing problem. ${ASSESSMENT.summary}`,
      `Included: ${INCLUSIONS.map((i) => `${i.title} (${i.text}${i.points ? ` ${i.points.join(', ')}` : ''})`).join('; ')}.`,
      `Not included: ${EXCLUSIONS.join(', ')}. Further engineering services require separate scoping and a written quote.`,
      `Examples of suitable problems (examples, not guaranteed outcomes): ${EXAMPLES.map((e) => e.title).join(', ')}.`,
      `How it works: ${JOURNEY.flatMap((p) => p.steps).map((s) => `${Number(s.number)}. ${s.title}: ${s.text}`).join(' ')}`,
      `Conditions: ${CONDITIONS.map((c) => `${c.title}: ${c.text}`).join(' ')} ${ASSESSMENT.gstNote}`,
      'Payment is never taken on the website and only requested after KEVOS® confirms suitability and scope in writing. A meeting is only booked after payment is verified, and a booking is confirmed only by the calendar confirmation. The assessment is preliminary: it does not guarantee root-cause identification, savings or a solution, and it is not certification or regulated design sign-off.',
      `Request an assessment with the form at ${ASSESSMENT.path}#request. A one-page brochure and a fictional sample report can be downloaded from ${ASSESSMENT.path}.`,
    ].join(' '),
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
    title: 'READOS categories',
    url: '/reados/',
    text: Object.values(CATEGORIES).map((c) => `${c.name}: ${c.description}`).join(' '),
  });

  chunks.push({
    id: 'proof-of-work',
    title: 'KEVOS® proof of work',
    url: '/#work',
    text: `The KEVOS® homepage lists ${PROJECTS.length} projects from 2010 to 2026 that make up the engineering record behind KEVOS®. They were delivered by its founder in employed, contract and consulting roles, not as KEVOS® engagements for those organisations, and organisation names do not imply endorsement. Sectors: capital projects, window and door hardware, heavy industry and mining, machines and automation, plant and facilities, civil and structural, defence and transport, and product development. The Alchin Long Group projects (window and door hardware product development, May 2018 to October 2024, and capital projects as Operations Excellence Engineer from November 2024) are the founder's employment experience, not KEVOS® client work. Some projects ended at concept or design stage, and some product-development schedules end at customer approval; both are labelled that way. Each case study can be opened directly at /#case-<id>.`,
  });
  for (const p of PROJECTS) {
    chunks.push({
      id: `project-${p.id}`,
      title: `Proof of work: ${p.title}`,
      url: `/#case-${p.id}`,
      text: `${p.title}: ${p.headline} (${p.years}; ${p.client}${p.customer ? `, for ${p.customer}` : ''}, ${p.about} ${p.industry}${p.location ? `, ${p.location}` : ''}). ${p.employment ?? ''} Role: ${p.role}. Status: ${p.statusLabel}. ${p.brief} Approach: ${p.approach.map((a) => `${a.title}: ${a.text}`).join(' ')}${p.path ? ` Development path: ${p.path.map((s) => `${s.stage} (${s.period}): ${s.detail}`).join('; ')}.` : ''} Outcome: ${p.outcome} ${p.note ?? ''}`,
    });
  }

  for (const w of await getWork()) {
    const url = hasWorkDetail(w) ? `/work/${w.id}/` : '/work/';
    chunks.push({ id: `work-${w.id}`, title: `Work: ${w.data.title}`, url, text: `${w.data.title} (${w.data.type}, status: ${w.data.status}). ${w.data.summary}` });
    sections(w.body).forEach((s, i) => chunks.push({ id: `work-${w.id}-${i}`, title: `${w.data.title}: ${s.heading}`, url, text: s.text }));
  }

  // READOS chapters, linked at their edited-book address.
  for (const book of buildReadOSCollections(await getChapters())) {
    for (const post of book.chapters) {
      const url = readosCollectionChapterHref(book, post);
      chunks.push({ id: `chapter-${post.id}`, title: `READOS: ${post.data.title}`, url, text: `${post.data.title}. ${post.data.description} Book: ${book.title}. Category: ${post.data.category}.` });
      sections(post.body).forEach((s, i) =>
        chunks.push({ id: `chapter-${post.id}-${i}`, title: `${post.data.title}${s.heading ? `: ${s.heading}` : ''}`, url, text: s.text.slice(0, 1400) }),
      );
    }
  }

  return new Response(JSON.stringify({ generated: new Date().toISOString(), site: SITE.url, chunks }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
