import type { Insight } from './content.ts';
import { categorySlug, CATEGORIES, CATEGORY_SLUGS } from '../config/taxonomy.ts';
import { readingTime } from './content.ts';

export type ReadOSCollection = {
  slug:string; title:string; category:string; description:string;
  chapters:Insight[]; minutes:number; topic:string; volume:number;
};
type Subject = { slug:string; title:string; description:string; category:string; pattern:RegExp; tags?:string[]; ids?:string[] };
const NONE=/$^/;
/** Curated, repeatable topic taxonomy. First matching rule is chosen; unmatched material is included in its category companion volume.
 *  Subjects with an explicit `ids` list are edited books and come first, so their chapters are chosen by hand rather than by pattern. */
const SUBJECTS:Subject[] = [
  {slug:'commercial-law-and-contracts',title:'Commercial Law, Contracts and Disputes',category:'business',description:'How Australian contracts are formed, interpreted, performed and enforced, and how commercial disputes are resolved.',pattern:NONE,ids:['how-australian-commercial-law-works','how-contracts-are-formed-and-what-they-contain','when-a-conversation-becomes-a-commitment','a-signature-is-not-the-whole-story','implied-terms-in-australian-contracts','matching-the-contract-to-the-work','adding-up-the-losses-your-contracts-make-you-keep','price-adjustment-clauses-in-long-contracts','protecting-know-how-you-hand-over','what-are-you-already-allowed-to-do','when-expert-advice-becomes-a-liability','after-the-signature','getting-paid-for-unfinished-or-uncontracted-work','how-contracts-end','repudiation-and-anticipatory-breach','when-a-contract-is-broken','equitable-remedies-specific-performance-and-rescission','thinking-clearly-about-a-contract-problem','resolving-disagreements-without-stopping-work','settling-a-commercial-dispute','what-commercial-litigation-involves']},
  {slug:'engineering-history',title:'How Engineering Shaped Industry',category:'ideas',description:'The history of power, materials, transport, communication and production, and what it teaches businesses today.',pattern:NONE,ids:['medieval-power-water-and-wind','brick-stone-and-the-arch','steam-power-and-the-business-of-improvement','interchangeable-parts-and-the-rise-of-mass-production','experience-and-calculation-how-engineering-learned-to-use-science','how-materials-changed-industry','railways-and-the-break-of-gauge','ships-from-timber-to-steel','from-telegraph-to-grid-how-electrification-was-engineered','clocks-telephones-and-radar-engineering-shared-signals','clean-water-as-an-engineered-system','building-up-and-boring-down-lifts-frames-foundations-and-tunnels','engines-after-steam-matching-technology-to-duty','the-motor-car-as-a-system','the-petroleum-value-chain','flight-fatigue-and-rockets-lessons-from-aerospace-history','biology-as-manufacturing','containerisation-and-the-critical-path-method','lasers-from-theory-to-tool','satellites-engineering-in-orbit','from-transistor-to-smartphone-engineering-the-digital-economy','learning-curves-and-zero-fuel-cost-solar-wind-and-batteries']},
  {slug:'machining-and-metal-parts',title:'Machining and Metal Parts',category:'manufacturing',description:'Cutting, finishing, tooling, casting and measuring metal parts accurately and economically.',pattern:NONE,ids:['designing-parts-that-are-economical-to-machine','cutting-tool-materials-and-coatings','workholding-and-toolholding','drilling-reaming-and-tapping-holes','milling-cutters-and-milling-strategies','broaching-knurling-and-indexing','grinding-honing-and-lapping','edm-and-micromachining','cnc-programming-and-cam-basics','choosing-a-cutting-process-for-plate-and-sheet','press-tools-and-dies','choosing-tool-steels','designing-parts-for-casting','choosing-and-using-measuring-instruments']},
  {slug:'machine-elements-and-mechanical-design',title:'Machine Elements and Mechanical Design',category:'engineering',description:'Choosing materials, joints, drives, bearings, seals and structures that carry their loads and last.',pattern:NONE,ids:['choosing-metals-for-engineered-parts','heat-treatment-and-surface-hardening-explained','protecting-metals-from-corrosion-and-wear','structural-steel-sections-and-grades','designing-against-fatigue','choosing-a-joining-method','choosing-fasteners-and-threads','bolted-joints-that-stay-tight','adhesive-bonded-joints','shafts-couplings-and-alignment','selecting-bearings-and-lubrication-for-reliable-machines','choosing-gearboxes-and-geared-motors','choosing-and-maintaining-belt-and-chain-drives','power-screws-and-linear-motion','clutches-and-brakes','specifying-springs-that-are-easy-to-make-and-assemble','o-rings-and-static-seals','hydraulic-fittings-and-hose-assemblies','selecting-electric-motors-and-drives']},
  {slug:'fluids-hvac-and-building-services',title:'Fluids, HVAC and Building Services',category:'engineering',description:'Air, water and heat in buildings and processes: psychrometrics, pipe flow, pumps, HVAC and low-energy cooling.',pattern:NONE,ids:['psychrometrics-for-hvac','hvac-for-commercial-and-industrial-buildings','passive-and-low-energy-cooling','pipe-flow-pressure-drop-and-pumps']},
  {slug:'databases-and-data-models',title:'Databases and Data Models',category:'technology',description:'Relational thinking, database structures, data integrity, queries and information architecture.',pattern:/database|relational|sql|query|data-model|data-integrity|xml|normalis|schema|entity-relationship|data-warehouse|data-migration|record-link|key-constraint/i},
  {slug:'ai-and-machine-learning',title:'AI and Machine Learning in Practice',category:'technology',description:'Understanding artificial intelligence, language models and practical automation decisions.',pattern:/artificial-intelligence|machine-learning|large-language|language-model|neural|generative|algorithm|ai-|automation|automated-decision|model-training|prompt-/i,tags:['ai']},
  {slug:'digital-systems-and-integration',title:'Digital Systems and Integration',category:'technology',description:'Software systems, integrations, infrastructure and engineering technology choices.',pattern:/software|cloud|api-|system|digital|network|internet|website|cyber|app-|computer|server|technology|platform|erp|information|programming|coding|web-|digitalisation|digitisation/i,tags:['systems']},
  {slug:'product-design-and-cad',title:'Product Design and CAD',category:'engineering',description:'Technical design, drawings, assemblies, specifications, tolerances and practical design review.',pattern:/cad|design|drawing|toleran|assembly|technical|solidworks|draft|geometry|model|prototype|fixture|engineering/i,tags:['design']},
  {slug:'engineering-practice',title:'Practical Engineering Methods',category:'engineering',description:'Engineering judgement, verification, material choices and technical communication.',pattern:/engineering|material|test|verify|stress|load|failure|bolt|steel|mechanical|calculation|standard/i},
  {slug:'tooling-and-fixtures',title:'Tooling, Jigs and Fixtures',category:'manufacturing',description:'Practical approaches to fixtures, tooling, machining and repeatable manufacture.',pattern:/jig|fixture|tooling|press-tool|die-|machin|setup|drill|cutting|toolmaker|fabricat/i},
  {slug:'production-and-quality',title:'Manufacturing, Production and Quality',category:'manufacturing',description:'Production methods, factory quality and the decisions behind reliable output.',pattern:/production|manufactur|factory|quality|inspection|process|supplier|materials|capacity|cost|lean|scrap|defect|assembly|powdercoat/i},
  {slug:'lean-and-continuous-improvement',title:'Lean and Continuous Improvement',category:'operations',description:'Eliminating waste, improving flow and using structured problem-solving methods.',pattern:/lean|six-sigma|kaizen|a3-|pdca|improv|waste|bottleneck|kanban|value-stream|oee|root-cause|standard-work|constraint/i,tags:['process-improvement']},
  {slug:'operations-and-workflow',title:'Operations and Workflow Systems',category:'operations',description:'Workflows, capacity, operational control, reporting and day-to-day execution.',pattern:/work|operation|flow|capacity|schedule|process|system|planning|control|measurement|report|shift|team|efficien/i},
  {slug:'project-planning-and-control',title:'Project Planning, Risk and Delivery',category:'projects',description:'Project scoping, estimates, delivery methods, schedules, stakeholders and closeout.',pattern:/project|scope|risk|schedule|cost|milestone|contract|change|delivery|estimate|stakeholder|gate|planning/i},
  {slug:'product-development-and-launch',title:'Product Development and Launch',category:'products',description:'From product concepts and testing to production release and commercial launch.',pattern:/product|prototype|design|validate|test|launch|customer|manufactur|market|portfolio|pricing/i},
  {slug:'risk-compliance-and-governance',title:'Risk, Compliance and Governance',category:'business',description:'Frameworks and practical methods for managing business risk, obligations and accountability.',pattern:/risk|insurance|compliance|govern|audit|legal|regulat|standard|liabilit|policy|safety|control|contract/i,tags:['quality']},
  {slug:'finance-and-financial-statements',title:'Business Finance and Financial Statements',category:'business',description:'Reading statements, understanding cash flow, profit, valuation and financial decisions.',pattern:/finance|financial|cash-flow|balance-sheet|profit|margin|tax|account|valuation|investment|capital|liquid|debt|return-on|asset|budget|earnings|equity|cost-of-capital|share-price/i,tags:['finance']},
  {slug:'strategy-and-competitive-advantage',title:'Strategy and Competitive Advantage',category:'business',description:'How businesses choose markets, build a position and make durable strategic decisions.',pattern:/strateg|competit|advantage|position|growth|market-share|business-model|moat|scal|industry|opportun|differenti|pricing-power|barrier|expan/i,tags:['strategy']},
  {slug:'sales-marketing-and-customers',title:'Sales, Marketing and Customer Decisions',category:'business',description:'Finding customers, positioning offers, pricing, selling and improving customer experience.',pattern:/sales|sell|buyer|customer|marketing|brand|advertis|content|social-media|price|promotion|retail|proposal|tender|negotiat|lead-generation|market-research/i,tags:['marketing','sales','customers']},
  {slug:'leading-people-and-teams',title:'Leadership, People and Teams',category:'business',description:'Communication, culture, capability, coaching, teamwork and management.',pattern:/lead|team|people|staff|employee|manager|workforce|communication|coaching|culture|hiring|motivation|skill|performance|training|career|conflict/i,tags:['leadership','people']},
  {slug:'starting-and-running-a-business',title:'Starting and Running a Business',category:'business',description:'Business ownership, startup choices, day-to-day systems and operating a sustainable enterprise.',pattern:/start|founder|small-business|business-owner|entrepren|setup|operat|decision|service|supplier|purchas|business-plan|execution|business-system/i,tags:['startups']},
  {slug:'business-processes-and-decisions',title:'Business Processes and Better Decisions',category:'business',description:'Process design, prioritisation, reporting and evidence-informed decisions.',pattern:/decision|process|system|workflow|report|measure|information|data|change|improvement|plan|organisation|policy|meeting/i,tags:['operations']},
  {slug:'exploring-and-testing-ideas',title:'Exploring and Testing Ideas',category:'ideas',description:'Testing assumptions, assessing opportunities and developing practical new ideas.',pattern:/idea|experiment|test|hypothes|opportun|innov|learn|research|concept|explor|future/i,tags:['experimentation']},
];
const MAX_CHAPTERS=24;
const fallback=(category:string)=>({slug:`${category}-practical-perspectives`,title:`Practical Perspectives on ${CATEGORIES[category as keyof typeof CATEGORIES].name}`,description:`Collected applied topics and case studies in ${CATEGORIES[category as keyof typeof CATEGORIES].name.toLowerCase()}.`,category,pattern:/$^/} as Subject);
const sortChapters=(a:Insight,b:Insight)=>a.data.title.localeCompare(b.data.title,'en-AU')||a.id.localeCompare(b.id);
export function buildReadOSCollections(posts:Insight[]):ReadOSCollection[] {
  const groups=new Map<string,{subject:Subject;chapters:Insight[]}>();
  for(const post of posts) {
    const category=categorySlug(post.data.category);
    const subject=SUBJECTS.find(s=>s.category===category&&(s.ids?.includes(post.id)||s.pattern.test(post.id+' '+post.data.title)||s.tags?.some(t=>post.data.tags.includes(t as never))))??fallback(category);
    let entry=groups.get(subject.slug);
    if(!entry){entry={subject,chapters:[]};groups.set(subject.slug,entry);}
    entry.chapters.push(post);
  }
  const books:ReadOSCollection[]=[];
  for(const {subject,chapters} of groups.values()){
    const ids=subject.ids;
    chapters.sort(ids?(a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id):sortChapters);
    const volumes=Math.ceil(chapters.length/MAX_CHAPTERS);
    for(let i=0;i<volumes;i++){
      const contents=chapters.slice(i*MAX_CHAPTERS,(i+1)*MAX_CHAPTERS);
      books.push({
        slug:volumes===1?subject.slug:`${subject.slug}-part-${String(i+1).padStart(2,'0')}`,
        title:volumes===1?subject.title:`${subject.title} (Part ${i+1})`,
        category:CATEGORIES[subject.category as keyof typeof CATEGORIES].name,
        description:subject.description,
        chapters:contents,minutes:contents.reduce((n,p)=>n+readingTime(p.body),0),
        topic:subject.slug,volume:i+1,
      });
    }
  }
  return books.sort((a,b)=>CATEGORY_SLUGS.indexOf(categorySlug(a.category))-CATEGORY_SLUGS.indexOf(categorySlug(b.category))||a.title.localeCompare(b.title,'en-AU'));
}
export const readosCollectionHref=(book:ReadOSCollection)=>`/reados/collections/${book.slug}/`;
export const readosCollectionChapterHref=(book:ReadOSCollection,chapter:Insight)=>`${readosCollectionHref(book)}${chapter.id}/`;
