// Builds seo/keyword-registry.json: seed keywords mapped to one canonical BIZOMAT page each, with a transparent
// score. Only two components are judged here (business relevance, content readiness). Search demand, existing
// impressions and competitive feasibility stay UNKNOWN until Search Console, Bing or another authorised source
// supplies them. Scores are therefore provisional, and every component is shown.
// Usage: node scripts/seo/keywords.mjs   (requires seo/url-inventory.json from scripts/seo/inventory.mjs)
import fs from 'node:fs';

export const WEIGHTS = { relevance: 0.3, demand: 0.2, opportunity: 0.2, feasibility: 0.15, readiness: 0.15 };

// [keyword, cluster, intent, target path, relevance 0–10, readiness 0–10, rationale]
const S = '/services/';
export const SEEDS = [
  ['engineering consulting Sydney', 'commercial', 'commercial-local', S, 10, 5, 'Core offer; one shared services page, no dedicated page per service'],
  ['manufacturing engineering consultant Sydney', 'commercial', 'commercial-local', S, 10, 5, 'Core offer; covered by the Manufacturing section of /services/'],
  ['jig and fixture design Australia', 'commercial', 'commercial', S, 10, 4, 'Named in services; strong supporting READOS book, but no service page of its own'],
  ['tooling design services Sydney', 'commercial', 'commercial-local', S, 9, 4, 'Covered only as part of Manufacturing Support'],
  ['mechanical design services Sydney', 'commercial', 'commercial-local', S, 9, 5, 'Engineering and CAD section'],
  ['SolidWorks drafting services Australia', 'commercial', 'commercial', S, 9, 5, 'SolidWorks named in services and organisation schema'],
  ['CAD drafting services Sydney', 'commercial', 'commercial-local', S, 9, 5, 'Engineering and CAD section'],
  ['manufacturing process improvement consultant', 'commercial', 'commercial', S, 9, 5, 'Operations Improvement section'],
  ['production efficiency improvement', 'commercial', 'commercial', '/factory-fix/', 9, 6, 'Factory Fix is a fixed-scope offer for this need'],
  ['lean manufacturing consulting Sydney', 'commercial', 'commercial-local', S, 8, 4, 'Lean content exists in READOS; service positioning is general'],
  ['engineering project support Sydney', 'commercial', 'commercial-local', S, 9, 5, 'Project Support section'],
  ['manufacturing documentation services', 'commercial', 'commercial', S, 8, 4, 'Work instructions named in organisation schema; no dedicated section page'],
  ['commissioning documentation support', 'commercial', 'commercial', S, 7, 3, 'Mentioned under project support only; no supporting guide'],
  ['production tooling design', 'commercial', 'commercial', S, 9, 4, 'As for tooling design'],
  ['design for manufacture services', 'commercial', 'commercial', S, 8, 5, 'Supporting READOS collection exists'],
  ['manufacturing problem solving', 'commercial', 'commercial', '/assessment/', 9, 7, 'The A$195 Engineering Problem Assessment is the direct offer'],
  ['engineering problem assessment', 'commercial', 'commercial', '/assessment/', 10, 8, 'Exact offer name'],
  ['engineering calculators online', 'calculators', 'calculator', '/tools/', 6, 8, 'WORKOS directory of 115 tools'],
  ['manufacturing calculators', 'calculators', 'calculator', '/tools/', 6, 8, 'WORKOS directory'],
  ['cutting speed calculator', 'calculators', 'calculator', '/tools/cutting-speed/', 7, 8, 'Dedicated tool page with method and worked example'],
  ['spindle RPM calculator', 'calculators', 'calculator', '/tools/cutting-speed/', 7, 8, 'Same tool as cutting speed; one page for both phrasings'],
  ['drilling time calculator', 'calculators', 'calculator', '/tools/drilling-time/', 6, 8, 'Dedicated tool page'],
  ['milling feed rate calculator', 'calculators', 'calculator', '/tools/milling-feed-time/', 7, 8, 'Dedicated tool page'],
  ['bolt circle calculator', 'calculators', 'calculator', '/tools/bolt-circle/', 6, 8, 'Dedicated tool page'],
  ['tolerance stack calculator', 'calculators', 'calculator', '/tools/signed-tolerance-stack/', 7, 8, 'Tool page; Fits That Work book supports it'],
  ['beam deflection calculator', 'calculators', 'calculator', '/tools/beam-deflection/', 6, 8, 'Dedicated tool page'],
  ['hydraulic cylinder force calculator', 'calculators', 'calculator', '/tools/hydraulic-cylinder/', 6, 8, 'Dedicated tool page'],
  ['pipe pressure drop calculator', 'calculators', 'calculator', '/tools/darcy-pipe-drop/', 6, 8, 'Darcy pressure-drop tool page'],
  ['pneumatic cylinder air consumption calculator', 'calculators', 'calculator', '/tools/pneumatic-consumption/', 6, 8, 'Dedicated tool page'],
  ['sheet metal bend allowance calculator', 'calculators', 'calculator', '/tools/bend-allowance/', 6, 8, 'Dedicated tool page'],
  ['gear ratio calculator', 'calculators', 'calculator', '/tools/gear-pair/', 6, 6, 'Gear pair geometry includes ratio; Gears by the Numbers book supports it'],
  ['bearing life calculator', 'calculators', 'calculator', '/tools/bearing-l10-life/', 6, 8, 'L10 life tool page'],
  ['material weight calculator', 'calculators', 'calculator', '/tools/stock-mass/', 6, 7, 'Stock volume and mass tool page'],
  ['welding heat input calculator', 'calculators', 'calculator', '/tools/welding-heat-input/', 6, 8, 'Tool page; Weld Repairs That Hold supports it'],
  ['OEE calculator', 'operations', 'calculator', '/tools/oee-downtime-pro/', 8, 7, 'Detailed OEE tool page; the quick OEE tool is app-only until its guide is extended'],
  ['takt time calculator', 'operations', 'calculator', '/tools/cycle-time/', 7, 4, 'Takt Time tool is app-only (thin guide); Cycle Time vs Takt page is the interim target'],
  ['cycle time calculator', 'operations', 'calculator', '/tools/cycle-time/', 7, 7, 'Dedicated tool page'],
  ['production capacity calculator', 'operations', 'calculator', '/tools/capacity-planner-pro/', 8, 7, 'Production Capacity Planner page'],
  ['inventory reorder point calculator', 'operations', 'calculator', '/tools/safety-stock/', 6, 4, 'Reorder Point tool is app-only (thin guide); Safety Stock page is the interim target'],
  ['safety stock calculator', 'operations', 'calculator', '/tools/safety-stock/', 6, 8, 'Dedicated tool page'],
  ['economic order quantity calculator', 'operations', 'calculator', '/tools/order-quantity/', 6, 8, 'EOQ tool page'],
  ['manufacturing cost calculator', 'operations', 'calculator', '/tools/true-cost/', 8, 7, 'True Unit Cost page; Job Cost Estimate is a related tool'],
  ['make or buy decision calculator', 'operations', 'calculator', '/tools/make-vs-buy-pro/', 8, 7, 'Two make-or-buy tools: choose the detailed one as primary to avoid splitting'],
  ['tooling ROI calculator', 'operations', 'calculator', '/tools/jig-fixture-roi/', 9, 8, 'Jig and Fixture ROI page; directly linked to the fixture service'],
  ['project risk matrix', 'operations', 'calculator', '/tools/risk-score/', 6, 7, '5 × 5 risk rating page'],
  ['project contingency calculator', 'operations', 'calculator', '/tools/contingency/', 6, 7, 'Contingency Allowance page'],
  ['process improvement ROI', 'operations', 'calculator', '/tools/improvement-value/', 8, 7, 'Improvement Value page'],
  ['machine downtime cost calculator', 'operations', 'calculator', '/tools/downtime-cost/', 8, 7, 'Downtime Cost page'],
  ['production line balancing calculator', 'operations', 'calculator', '/tools/bottleneck/', 7, 7, 'Bottleneck and Line Balance page'],
  ['how to improve manufacturing productivity', 'educational', 'informational', '/reados/collections/lean-and-continuous-improvement/measuring-productivity-and-equipment-effectiveness/', 7, 7, 'Existing READOS chapter'],
  ['how to design production jigs and fixtures', 'educational', 'informational', '/reados/publications/fixtures-that-repeat/', 9, 9, 'Ten-chapter authored book plus a collection chapter'],
  ['what is overall equipment effectiveness', 'educational', 'informational', '/reados/collections/lean-and-continuous-improvement/measuring-productivity-and-equipment-effectiveness/', 7, 7, 'Covered with productivity measures; a second chapter values OEE losses'],
  ['how to reduce production setup time', 'educational', 'informational', '/reados/publications/fixtures-that-repeat/make-correct-loading-and-changeover-repeatable/', 8, 6, 'Changeover chapter; no dedicated SMED guide'],
  ['how to calculate manufacturing cycle time', 'educational', 'informational', '/reados/publications/machining-by-the-numbers/estimating-cycle-time/', 8, 9, 'Dedicated chapter with worked example'],
  ['how to prepare an engineering RFQ', 'educational', 'informational', null, 8, 0, 'GAP: no guide exists; editorial brief only, needs review before publishing'],
  ['engineering project commissioning checklist', 'educational', 'informational', null, 7, 0, 'GAP: only an HVAC commissioning chapter exists; editorial brief only'],
  ['BIZOMAT', 'branded', 'navigational', '/', 10, 9, 'Home page'],
  ['BIZOMAT engineering', 'branded', 'navigational', '/', 10, 9, 'Home page'],
  ['BIZOMAT WORKOS', 'branded', 'navigational', '/tools/', 8, 9, 'WORKOS directory'],
  ['BIZOMAT READOS', 'branded', 'navigational', '/reados/', 8, 9, 'READOS library'],
  ['BIZOMAT MAKEOS', 'branded', 'navigational', '/tools/', 7, 7, 'MAKEOS is a collection inside WORKOS with no page of its own'],
  ['BIZOMAT engineering calculators', 'branded', 'navigational', '/tools/', 8, 8, 'WORKOS directory'],
];

/** Weighted score over the components that are known; unknown components are excluded, not counted as zero. */
export function score(components) {
  let total = 0;
  let weight = 0;
  for (const [k, w] of Object.entries(WEIGHTS)) {
    if (typeof components[k] === 'number') {
      total += components[k] * w;
      weight += w;
    }
  }
  return { score: weight ? +(total / weight).toFixed(2) : null, basedOnWeight: +weight.toFixed(2), provisional: weight < 1 };
}

if (process.argv[1]?.endsWith('keywords.mjs')) {
  const inv = JSON.parse(fs.readFileSync('seo/url-inventory.json', 'utf8'));
  const pages = new Map(inv.pages.map((p) => [p.path, p]));
  const problems = [];
  const keywords = SEEDS.map(([keyword, cluster, intent, target, relevance, readiness, rationale]) => {
    const page = target ? pages.get(target) : null;
    if (target && (!page || page.noindex || !page.selfCanonical)) problems.push(`${keyword}: target ${target} is not an indexable canonical page`);
    const components = { relevance, demand: 'UNKNOWN', opportunity: 'UNKNOWN', feasibility: 'UNKNOWN', readiness };
    return { keyword, cluster, intent, target: target ? `https://kevos.com${target}` : null, targetTitle: page?.title ?? null, components, ...score(components), rationale, status: target ? 'mapped' : 'content-gap', history: [{ date: inv.summary.generatedAt.slice(0, 10), event: 'seeded', note: 'Provisional seed; validate with Search Console data before prioritising' }] };
  });
  const targets = new Map();
  for (const k of keywords) if (k.target) (targets.get(k.target) ?? targets.set(k.target, []).get(k.target)).push(k.keyword);
  const registry = {
    version: 1,
    generatedAt: new Date().toISOString(),
    weights: WEIGHTS,
    note: 'Search demand, existing impressions and competitive feasibility are UNKNOWN until an authorised data source is connected. Scores use only known components and are provisional.',
    keywords: keywords.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    sharedTargets: Object.fromEntries([...targets].filter(([, ks]) => ks.length > 1)),
  };
  fs.writeFileSync('seo/keyword-registry.json', `${JSON.stringify(registry, null, 1)}\n`);
  console.log(`${keywords.length} keywords, ${keywords.filter((k) => k.status === 'content-gap').length} content gaps, ${Object.keys(registry.sharedTargets).length} shared targets`);
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
}
