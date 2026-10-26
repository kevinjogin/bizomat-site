/**
 * READOS cover system. Every book, guide and volume gets a deterministic, purpose-drawn cover:
 * a subject illustration (motif), a KEVOS colourway (tone) and a seed that varies the composition,
 * so parts of one series share a visual family but no two covers are the same.
 * The data here is rendered by ReadOSAnimatedCover.astro; animation and colour live in its CSS.
 */
export type CoverTone = 'graphite' | 'ember' | 'paper' | 'carbon';
export type CoverMotif =
  | 'database' | 'neural' | 'integration' | 'interface'
  | 'drawing' | 'beam' | 'geometry'
  | 'fixture' | 'production' | 'factory'
  | 'cycle' | 'workflow' | 'gauge'
  | 'gantt' | 'network'
  | 'launch' | 'exploded'
  | 'shield' | 'ledger' | 'contour' | 'funnel' | 'team' | 'venture' | 'decision' | 'compass'
  | 'experiment' | 'orbit'
  | 'lens' | 'pathway'
  | 'holdings' | 'cashflow' | 'breakeven' | 'bubbles' | 'scales' | 'tender' | 'supply' | 'estimate' | 'gates' | 'handover'
  | 'expansion' | 'megaphone' | 'dialogue' | 'summit' | 'ladder' | 'streak' | 'leaf' | 'archive'
  | 'join' | 'locks' | 'cube' | 'solid' | 'search' | 'crane' | 'geartrain' | 'pump' | 'lathe' | 'barcode' | 'specsheet'
  | 'waterwheel' | 'pylon' | 'mind' | 'triangle' | 'code';

export type Shape =
  | { t: 'path'; d: string; c?: string; len?: boolean }
  | { t: 'circle'; cx: number; cy: number; r: number; c?: string }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; c?: string }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx?: number; c?: string }
  | { t: 'text'; x: number; y: number; s: string; c?: string; anchor?: 'start' | 'middle' | 'end'; tf?: string }
  | { t: 'g'; c?: string; tf?: string; clip?: string; kids: Shape[] }
  | { t: 'clip'; id: string; kids: Shape[] };

export type CoverSpec = { motif: CoverMotif; tone: CoverTone; seed: number; title: string; series?: string; part?: number };
type Look = { motif: CoverMotif; tone: CoverTone };

/** Tones rotate in this order through the parts of a series, so neighbouring parts never share a colourway. */
export const COVER_TONES: readonly CoverTone[] = ['graphite', 'ember', 'paper', 'carbon'];

/** One illustration per READOS subject (keys match the subject slugs in reados-collections.ts). */
export const TOPIC_COVERS: Record<string, Look> = {
  'reading-financial-statements': { motif: 'ledger', tone: 'paper' },
  'acquisitions-groups-and-investment-accounting': { motif: 'holdings', tone: 'graphite' },
  'investment-appraisal-and-business-cases': { motif: 'cashflow', tone: 'ember' },
  'valuing-time-delay-and-uncertainty': { motif: 'decision', tone: 'carbon' },
  'pricing-margins-and-profitability': { motif: 'breakeven', tone: 'paper' },
  'booms-bubbles-and-business-cycles': { motif: 'bubbles', tone: 'graphite' },
  'starting-funding-and-structuring-a-business': { motif: 'venture', tone: 'paper' },
  'commercial-law-and-contracts': { motif: 'scales', tone: 'carbon' },
  'procurement-and-tendering': { motif: 'tender', tone: 'ember' },
  'suppliers-contractors-and-government-work': { motif: 'supply', tone: 'graphite' },
  'project-estimates-schedules-and-costs': { motif: 'estimate', tone: 'paper' },
  'project-sponsors-governance-and-decisions': { motif: 'gates', tone: 'carbon' },
  'from-approval-to-benefits': { motif: 'handover', tone: 'ember' },
  'competitive-strategy-and-positioning': { motif: 'contour', tone: 'carbon' },
  'growth-business-models-and-new-markets': { motif: 'expansion', tone: 'ember' },
  'selling-and-business-development': { motif: 'funnel', tone: 'graphite' },
  'marketing-brands-and-customer-experience': { motif: 'megaphone', tone: 'paper' },
  'communication-and-professional-presence': { motif: 'dialogue', tone: 'graphite' },
  'leading-people-and-change': { motif: 'summit', tone: 'ember' },
  'teams-incentives-and-performance': { motif: 'team', tone: 'paper' },
  'careers-confidence-and-personal-effectiveness': { motif: 'ladder', tone: 'carbon' },
  'work-habits-that-stick': { motif: 'streak', tone: 'ember' },
  'risk-controls-and-assurance': { motif: 'shield', tone: 'ember' },
  'sustainability-and-environmental-management': { motif: 'leaf', tone: 'paper' },
  'business-systems-and-operating-rhythm': { motif: 'workflow', tone: 'graphite' },
  'records-business-data-and-learning': { motif: 'archive', tone: 'carbon' },
  'database-foundations-for-business': { motif: 'database', tone: 'paper' },
  'sql-queries-and-data-correctness': { motif: 'join', tone: 'graphite' },
  'database-performance-concurrency-and-change': { motif: 'locks', tone: 'carbon' },
  'reporting-history-and-analytical-data': { motif: 'cube', tone: 'ember' },
  'cad-drafting-and-drawing-standards': { motif: 'drawing', tone: 'graphite' },
  'cad-modelling-and-design-intent': { motif: 'solid', tone: 'paper' },
  'ai-in-business-practice': { motif: 'neural', tone: 'graphite' },
  'decision-making-machines': { motif: 'search', tone: 'carbon' },
  'business-systems-security-and-it-decisions': { motif: 'integration', tone: 'ember' },
  'project-planning-and-control': { motif: 'gantt', tone: 'graphite' },
  'project-delivery-procurement-and-governance': { motif: 'crane', tone: 'ember' },
  'machine-elements-and-mechanical-design': { motif: 'geartrain', tone: 'graphite' },
  'fluids-hvac-and-building-services': { motif: 'pump', tone: 'paper' },
  'engineering-design-practice': { motif: 'beam', tone: 'carbon' },
  'machining-and-metal-parts': { motif: 'lathe', tone: 'carbon' },
  'manufacturing-quality': { motif: 'production', tone: 'ember' },
  'manufacturing-operations-and-design-for-manufacture': { motif: 'fixture', tone: 'graphite' },
  'lean-and-continuous-improvement': { motif: 'cycle', tone: 'graphite' },
  'operational-data-records-and-controls': { motif: 'barcode', tone: 'paper' },
  'product-development-and-launch': { motif: 'launch', tone: 'ember' },
  'specifications-product-quality-and-sustainability': { motif: 'specsheet', tone: 'graphite' },
  'engineering-history': { motif: 'waterwheel', tone: 'ember' },
  'engineering-history-modern-era': { motif: 'pylon', tone: 'graphite' },
  'research-and-evidence-for-better-decisions': { motif: 'experiment', tone: 'paper' },
  'practical-mathematics-for-engineering': { motif: 'triangle', tone: 'ember' },
  'software-and-cloud-foundations': { motif: 'code', tone: 'graphite' },
  'judgement-markets-and-learning': { motif: 'mind', tone: 'carbon' },
};

/** Category illustrations, used by each category's Further Reading book and its archive volumes. */
export const CATEGORY_COVERS: Record<string, Look> = {
  engineering: { motif: 'geometry', tone: 'paper' },
  manufacturing: { motif: 'factory', tone: 'carbon' },
  operations: { motif: 'gauge', tone: 'ember' },
  projects: { motif: 'network', tone: 'ember' },
  technology: { motif: 'interface', tone: 'graphite' },
  business: { motif: 'compass', tone: 'graphite' },
  products: { motif: 'exploded', tone: 'graphite' },
  ideas: { motif: 'orbit', tone: 'carbon' },
};

/** Individually authored publications and guides. */
const SPECIAL_COVERS: Record<string, Look> = {
  'read-the-numbers-understand-the-business': { motif: 'lens', tone: 'graphite' },
  'win-work-you-can-deliver': { motif: 'pathway', tone: 'ember' },
  'weld-repairs-that-hold': { motif: 'beam', tone: 'ember' },
  'cad-standards-that-stick': { motif: 'specsheet', tone: 'ember' },
  'cad-data-you-can-trust': { motif: 'archive', tone: 'graphite' },
  'vehicle-mechanics-by-the-numbers': { motif: 'geartrain', tone: 'ember' },
  'gears-by-the-numbers': { motif: 'geartrain', tone: 'paper' },
  'oxy-fuel-by-the-numbers': { motif: 'gauge', tone: 'carbon' },
  'electroplating-by-the-numbers': { motif: 'experiment', tone: 'ember' },
  'weldability-by-the-numbers': { motif: 'pump', tone: 'ember' },
  'resistance-welding-by-the-numbers': { motif: 'production', tone: 'carbon' },
  'arc-welding-by-the-numbers': { motif: 'pylon', tone: 'ember' },
  'thermit-welding-by-the-numbers': { motif: 'experiment', tone: 'carbon' },
  'testing-welded-joints-by-the-numbers': { motif: 'search', tone: 'graphite' },
  'industrial-electric-heating-by-the-numbers': { motif: 'cycle', tone: 'ember' },
  'industrial-gases-by-the-numbers': { motif: 'supply', tone: 'carbon' },
  'brazing-and-soldering-by-the-numbers': { motif: 'join', tone: 'paper' },
  'welder-training-by-the-numbers': { motif: 'ladder', tone: 'ember' },
  'setting-up-a-welding-shop-by-the-numbers': { motif: 'factory', tone: 'paper' },
  'machine-part-repairs-by-the-numbers': { motif: 'lathe', tone: 'graphite' },
  'designing-welded-joints-by-the-numbers': { motif: 'beam', tone: 'graphite' },
  'welding-distortion-by-the-numbers': { motif: 'contour', tone: 'ember' },
  'hardfacing-and-surfacing-by-the-numbers': { motif: 'solid', tone: 'graphite' },
  'pipe-welding-by-the-numbers': { motif: 'network', tone: 'paper' },
  'forge-welding-by-the-numbers': { motif: 'join', tone: 'ember' },
  'welding-automation-by-the-numbers': { motif: 'integration', tone: 'carbon' },
  'cutting-and-gouging-by-the-numbers': { motif: 'geometry', tone: 'ember' },
  'welding-health-and-safety-by-the-numbers': { motif: 'shield', tone: 'paper' },
  'building-approval-for-factory-projects': { motif: 'crane', tone: 'carbon' },
  'performance-solutions-by-the-numbers': { motif: 'scales', tone: 'paper' },
  'railway-clearances-by-the-numbers': { motif: 'gates', tone: 'paper' },
  'railway-track-geometry-by-the-numbers': { motif: 'pathway', tone: 'graphite' },
  'drawings-that-make-parts': { motif: 'drawing', tone: 'ember' },
  'surfaces-that-make-parts': { motif: 'contour', tone: 'graphite' },
  'inspecting-to-the-drawing': { motif: 'gauge', tone: 'paper' },
  'printed-mechanisms-that-run': { motif: 'geartrain', tone: 'carbon' },
  'design-simulation-by-the-numbers': { motif: 'beam', tone: 'paper' },
  'plastic-parts-by-the-numbers': { motif: 'exploded', tone: 'ember' },
  'drafting-geometry-by-the-numbers': { motif: 'geometry', tone: 'carbon' },
  'layouts-that-plot-to-scale': { motif: 'drawing', tone: 'paper' },
  'electronics-packaging-by-the-numbers': { motif: 'interface', tone: 'ember' },
  'connected-products-by-the-numbers': { motif: 'network', tone: 'carbon' },
  'checking-drawings-by-the-numbers': { motif: 'specsheet', tone: 'carbon' },
  'sheet-metal-parts-by-the-numbers': { motif: 'cube', tone: 'paper' },
  'cad-automation-by-the-numbers': { motif: 'code', tone: 'ember' },
  'engineering-software-you-can-sell': { motif: 'launch', tone: 'carbon' },
  'cad-automation-that-pays': { motif: 'code', tone: 'carbon' },
  'bills-of-materials-by-the-numbers': { motif: 'exploded', tone: 'carbon' },
  'tanks-and-hoppers-by-the-numbers': { motif: 'funnel', tone: 'ember' },
  'ductwork-by-the-numbers': { motif: 'pathway', tone: 'carbon' },
  'sheet-metal-patterns-by-the-numbers': { motif: 'geometry', tone: 'graphite' },
  'marking-out-by-the-numbers': { motif: 'triangle', tone: 'carbon' },
  'plate-work-by-the-numbers': { motif: 'cube', tone: 'carbon' },
  'configure-price-quote-by-the-numbers': { motif: 'estimate', tone: 'ember' },
  'engineering-tools-people-use': { motif: 'interface', tone: 'paper' },
  'commissioning-custom-software': { motif: 'handover', tone: 'graphite' },
  'pneumatics-by-the-numbers': { motif: 'pump', tone: 'carbon' },
  'rectangular-duct-fittings-by-the-numbers': { motif: 'pump', tone: 'graphite' },
  'sheet-metal-production-runs-by-the-numbers': { motif: 'production', tone: 'paper' },
  'sheet-metal-joints-by-the-numbers': { motif: 'join', tone: 'carbon' },
  'quoting-sheet-metal-work-by-the-numbers': { motif: 'estimate', tone: 'carbon' },
  'roof-drainage-by-the-numbers': { motif: 'waterwheel', tone: 'carbon' },
  'architectural-sheet-metal-by-the-numbers': { motif: 'contour', tone: 'paper' },
  'oval-sheet-metal-work-by-the-numbers': { motif: 'orbit', tone: 'paper' },
  'deep-drawing-and-spinning-by-the-numbers': { motif: 'lathe', tone: 'ember' },
  'heat-transfer-by-the-numbers': { motif: 'gauge', tone: 'graphite' },
  'thermal-expansion-by-the-numbers': { motif: 'expansion', tone: 'carbon' },
  'stiffening-sheet-metal-by-the-numbers': { motif: 'cube', tone: 'graphite' },
  'hand-forming-sheet-metal-by-the-numbers': { motif: 'solid', tone: 'ember' },
  'blanking-and-piercing-dies-by-the-numbers': { motif: 'fixture', tone: 'ember' },
  'power-presses-by-the-numbers': { motif: 'factory', tone: 'graphite' },
  'roof-lights-by-the-numbers': { motif: 'triangle', tone: 'graphite' },
  'louvres-and-ventilators-by-the-numbers': { motif: 'gates', tone: 'ember' },
  'fine-particles-by-the-numbers': { motif: 'bubbles', tone: 'carbon' },
  'random-error-and-drift-by-the-numbers': { motif: 'streak', tone: 'paper' },
  'vibrating-machine-elements-by-the-numbers': { motif: 'cycle', tone: 'carbon' },
  'entropy-by-the-numbers': { motif: 'orbit', tone: 'graphite' },
  'water-hammer-by-the-numbers': { motif: 'waterwheel', tone: 'graphite' },
  'compressed-air-plant-by-the-numbers': { motif: 'expansion', tone: 'graphite' },
  'transitional-elbows-by-the-numbers': { motif: 'triangle', tone: 'paper' },
  'branched-fittings-by-the-numbers': { motif: 'network', tone: 'graphite' },
  'machine-noise-control-by-the-numbers': { motif: 'shield', tone: 'graphite' },
  'product-acoustics-by-the-numbers': { motif: 'megaphone', tone: 'ember' },
  'steam-systems-by-the-numbers': { motif: 'factory', tone: 'ember' },
  'heat-pumps-and-refrigeration-by-the-numbers': { motif: 'cycle', tone: 'paper' },
  'pipe-flow-by-the-numbers': { motif: 'funnel', tone: 'paper' },
  'centrifugal-pumps-by-the-numbers': { motif: 'waterwheel', tone: 'paper' },
  'heat-exchangers-by-the-numbers': { motif: 'exploded', tone: 'paper' },
  'cooling-towers-by-the-numbers': { motif: 'funnel', tone: 'carbon' },
  'rubber-parts-by-the-numbers': { motif: 'orbit', tone: 'ember' },
  'shape-memory-alloys-by-the-numbers': { motif: 'experiment', tone: 'graphite' },
};

const hash = (s: string) => [...s].reduce((a, c) => (Math.imul(a, 33) + c.charCodeAt(0)) >>> 0, 5381);
const pad = (n: number) => String(n).padStart(2, '0');
const categoryKey = (category: string) => category.toLowerCase().split(/\s+/)[0] ?? '';

export function coverSpec({ slug, title, category, motif }: { slug: string; title: string; category: string; motif?: string }): CoverSpec {
  const seed = hash(slug);
  const fallback = CATEGORY_COVERS[categoryKey(category)] ?? CATEGORY_COVERS.business;
  const part = /^(.+)-part-(\d+)$/.exec(slug);
  const volume = /^([a-z]+)-volume-(\d+)$/.exec(slug);
  let look: Look;
  let n = 1;
  let series: string | undefined;
  if (SPECIAL_COVERS[slug]) look = SPECIAL_COVERS[slug];
  else if (motif === 'opportunity-path') look = { motif: 'pathway', tone: 'ember' };
  else if (volume) {
    look = CATEGORY_COVERS[volume[1]] ?? fallback;
    n = Number(volume[2]);
    series = `VOLUME ${pad(n)}`;
  } else {
    const topic = part ? part[1] : slug;
    const practical = /^([a-z]+)-(?:further-reading|practical-perspectives)$/.exec(topic);
    look = TOPIC_COVERS[topic] ?? (practical && CATEGORY_COVERS[practical[1]]) ?? { motif: fallback.motif, tone: COVER_TONES[seed % COVER_TONES.length] };
    if (part) { n = Number(part[2]); series = `PART ${pad(n)}`; }
  }
  const tone = COVER_TONES[(COVER_TONES.indexOf(look.tone) + n - 1) % COVER_TONES.length];
  const clean = title.replace(/\s*\(Part \d+\)$/i, '').replace(/:\s*Volume \d+$/i, '');
  return { motif: look.motif, tone, seed, title: clean, series, part: n };
}

/* ---------- Title layout ---------- */

const TITLE_STEPS = [
  { size: 30, lh: 34, max: 3 },
  { size: 26, lh: 30, max: 4 },
  { size: 23, lh: 27, max: 5 },
  { size: 20, lh: 24, max: 6 },
  { size: 18, lh: 21, max: 99 },
];

export function wrapWords(text: string, limit: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (current && `${current} ${word}`.length > limit) { lines.push(current); current = word; }
    else current = current ? `${current} ${word}` : word;
  }
  if (current) lines.push(current);
  return lines;
}

/** Title is bottom-aligned above the footer; the illustration panel fills the space above it. */
export function coverLayout(title: string) {
  let step = TITLE_STEPS[0];
  let lines: string[] = [];
  for (step of TITLE_STEPS) {
    lines = wrapWords(title, Math.floor(300 / (step.size * 0.6)));
    if (lines.length <= step.max) break;
  }
  const firstBaseline = 424 - (lines.length - 1) * step.lh;
  const barY = Math.round(firstBaseline - step.size * 0.74 - 20);
  return { lines, size: step.size, lh: step.lh, firstBaseline, barY, panelH: Math.max(150, barY - 78) };
}

/* ---------- Illustration builders (304 × 204 local coordinates) ---------- */

/** `v` is the 0-based part or volume number; series motifs use it to choose a different composition per part. */
type Ctx = { r: () => number; uid: string; v: number };

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;
const pt = (p: number[]) => `${f(p[0])} ${f(p[1])}`;
const line = (pts: number[][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${pt(p)}`).join('');
const between = (r: () => number, a: number, b: number) => a + r() * (b - a);
const dl = (n: number) => `d${(n % 8) + 1}`;
const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

const path = (d: string, c?: string, len?: boolean): Shape => ({ t: 'path', d, c, len });
const circle = (cx: number, cy: number, r: number, c?: string): Shape => ({ t: 'circle', cx: f(cx), cy: f(cy), r: f(r), c });
const ellipse = (cx: number, cy: number, rx: number, ry: number, c?: string): Shape => ({ t: 'ellipse', cx: f(cx), cy: f(cy), rx: f(rx), ry: f(ry), c });
const rect = (x: number, y: number, w: number, h: number, c?: string, rx?: number): Shape => ({ t: 'rect', x: f(x), y: f(y), w: f(w), h: f(h), c, rx });
const text = (x: number, y: number, s: string, c?: string, anchor?: 'start' | 'middle' | 'end', tf?: string): Shape => ({ t: 'text', x: f(x), y: f(y), s, c, anchor, tf });
const group = (c: string | undefined, kids: Shape[], tf?: string, clip?: string): Shape => ({ t: 'g', c, kids, tf, clip });

function closedSmooth(pts: number[][]) {
  const n = pts.length;
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return `${d}Z`;
}

function gear(cx: number, cy: number, ro: number, ri: number, n: number) {
  const s = Math.PI / n;
  const at = (rad: number, a: number) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  const pts: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = i * 2 * s;
    pts.push(at(ri, a - s), at(ro, a - s * 0.45), at(ro, a + s * 0.45), at(ri, a + s));
  }
  return `${line(pts)}Z`;
}

function cubeFaces(cx: number, cy: number, s: number) {
  const w = s * 0.87;
  return {
    top: `${line([[cx, cy - s], [cx + w, cy - s / 2], [cx, cy], [cx - w, cy - s / 2]])}Z`,
    left: `${line([[cx - w, cy - s / 2], [cx, cy], [cx, cy + s], [cx - w, cy + s / 2]])}Z`,
    right: `${line([[cx, cy], [cx + w, cy - s / 2], [cx + w, cy + s / 2], [cx, cy + s]])}Z`,
    hidden: `M${pt([cx, cy - s])}V${f(cy)}M${pt([cx, cy])}L${pt([cx - w, cy + s / 2])}M${pt([cx, cy])}L${pt([cx + w, cy + s / 2])}`,
  };
}

function person(cx: number, cy: number, sz: number, c: string): Shape[] {
  return [
    path(`M${pt([cx - sz * 0.72, cy + sz * 0.6])}C${pt([cx - sz * 0.72, cy - sz * 0.05])} ${pt([cx - sz * 0.38, cy - sz * 0.2])} ${pt([cx, cy - sz * 0.2])}C${pt([cx + sz * 0.38, cy - sz * 0.2])} ${pt([cx + sz * 0.72, cy - sz * 0.05])} ${pt([cx + sz * 0.72, cy + sz * 0.6])}Z`, c),
    circle(cx, cy - sz * 0.62, sz * 0.36, c),
  ];
}

const spark = (x: number, y: number, m: number) =>
  `${line([[x, y - m], [x + m * 0.3, y - m * 0.3], [x + m, y], [x + m * 0.3, y + m * 0.3], [x, y + m], [x - m * 0.3, y + m * 0.3], [x - m, y], [x - m * 0.3, y - m * 0.3]])}Z`;

/** Databases and Data Models: storage cylinder linked to an entity table with a scanning row. */
function databaseTable({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 68, top = 38, rx = 44, ry = 12, seg = 38;
  s.push(path(`M${cx - rx} ${top}V${top + seg * 3}M${cx + rx} ${top}V${top + seg * 3}`, 'ln'));
  for (let k = 1; k <= 3; k++) {
    const y = top + seg * k;
    s.push(path(`M${cx - rx} ${y}A${rx} ${ry} 0 0 0 ${cx + rx} ${y}`, 'ln'));
    s.push(rect(cx - rx + 12, y - seg + 20, between(r, 24, 42), 3, 'fl'));
    s.push(circle(cx + rx - 12, y - seg + 21, 2.6, cls('fa an-pulse', dl(k))));
  }
  s.push(ellipse(cx, top, rx, ry, 'bx'));
  const rows = 4 + Math.floor(r() * 3), rh = 20, tw = 128, tx = 162, ty = f(between(r, 16, 36));
  const colX = tx + 30 + Math.round(r() * 12);
  s.push(rect(tx, ty, tw, 22 + rows * rh, 'bx', 3));
  s.push(path(`M${tx} ${ty + 22}V${ty + 3}q0 -3 3 -3H${tx + tw - 3}q3 0 3 3V${ty + 22}Z`, 'fa'));
  s.push(rect(tx + 10, ty + 9, 46, 4, 'fn'));
  s.push(group(`an-scan${rows}`, [rect(tx + 1.5, ty + 22, tw - 3, rh, 'fs o3')]));
  for (let i = 0; i < rows; i++) {
    const y = ty + 22 + i * rh;
    if (i) s.push(path(`M${tx} ${f(y)}H${tx + tw}`, 'lf'));
    s.push(rect(tx + 8, y + 8, colX - tx - 16, 4, i === 0 ? 'fa' : 'fl'));
    s.push(rect(colX + 8, y + 8, between(r, 26, tw - (colX - tx) - 18), 4, 'fl'));
  }
  s.push(path(`M${colX} ${f(ty + 22)}V${f(ty + 22 + rows * rh)}`, 'lf'));
  const ly = top + seg * 1.5, ty1 = f(ty + 22 + rh * 1.5), mx = f((cx + rx + tx) / 2);
  s.push(path(`M${cx + rx} ${ly}H${mx}V${ty1}H${tx - 1}`, 'la an-flow'));
  s.push(path(`M${tx - 1} ${ty1}l-9 -6M${tx - 1} ${ty1}l-9 6`, 'la'));
  return s;
}

/** AI and Machine Learning: a layered network with an activated signal path. */
function neuralNetwork({ r }: Ctx): Shape[] {
  const layers = r() > 0.45 ? 4 : 3;
  const net = Array.from({ length: layers }, (_, i) => {
    const x = 34 + (i * 236) / (layers - 1) + (i && i < layers - 1 ? between(r, -8, 8) : 0);
    const n = i === 0 || i === layers - 1 ? 2 + Math.floor(r() * 2) : 3 + Math.floor(r() * 3);
    return Array.from({ length: n }, (_, j) => [x, 102 + (j - (n - 1) / 2) * 34]);
  });
  let edges = '';
  for (let i = 0; i < layers - 1; i++) for (const a of net[i]) for (const b of net[i + 1]) edges += `M${pt(a)}L${pt(b)}`;
  const route = net.map((l) => l[Math.floor(r() * l.length)]);
  const alt = net.map((l) => l[Math.floor(r() * l.length)]);
  const s: Shape[] = [path(edges, 'lf'), path(line(alt), 'la an-flow o5'), path(line(route), 'la an-draw', true)];
  net.forEach((l, i) => l.forEach((p) => {
    const on = route[i] === p;
    s.push(circle(p[0], p[1], 8, on ? 'bxa' : 'bx'));
    if (on) s.push(circle(p[0], p[1], 3.4, cls('fa an-pulse', dl(i))));
  }));
  return s;
}

/** Digital Systems and Integration: modules wired to a central service with live traffic. */
function integrationHub({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const hub = { x: 152, y: 102, w: 72, h: 46 };
  const mods = [
    [50 + between(r, -6, 8), 36 + between(r, -4, 8)],
    [254 + between(r, -8, 6), 36 + between(r, -4, 8)],
    [50 + between(r, -6, 8), 168 + between(r, -8, 4)],
    [254 + between(r, -8, 6), 168 + between(r, -8, 4)],
  ];
  const top = r() > 0.5;
  const traces = mods.map(([x, y]) => {
    const left = x < hub.x;
    const sx = hub.x + (left ? -hub.w / 2 : hub.w / 2), sy = hub.y + (y < hub.y ? -10 : 10), ex = x + (left ? 32 : -32);
    return `M${f(sx)} ${f(sy)}H${f((sx + ex) / 2)}V${f(y)}H${f(ex)}`;
  });
  if (top) traces.push(`M152 ${hub.y - hub.h / 2}V38`);
  s.push(path(traces.join(''), 'ln'));
  const first = Math.floor(r() * traces.length);
  const second = (first + 1 + Math.floor(r() * (traces.length - 1))) % traces.length;
  s.push(path(traces[first], 'la an-flow'), path(traces[second], 'la an-flow'));
  mods.forEach(([x, y], i) => {
    s.push(rect(x - 32, y - 17, 64, 34, 'bx', 4), rect(x - 22, y - 7, between(r, 24, 40), 3, 'fl'), rect(x - 22, y + 2, between(r, 14, 30), 3, 'fl'));
    const px = x < hub.x ? x + 32 : x - 32;
    s.push(rect(px - 3, y - 3, 6, 6, cls('fa an-pulse', dl(i))));
  });
  if (top) s.push(rect(126, 8, 52, 30, 'bx', 4), rect(134, 17, 30, 3, 'fl'), rect(134, 25, 20, 3, 'fl'));
  s.push(rect(hub.x - hub.w / 2, hub.y - hub.h / 2, hub.w, hub.h, 'bxa', 6));
  s.push(path('M141 96l-9 6 9 6M163 96l9 6-9 6M156 91l-8 22', 'la an-pulse'));
  return s;
}

/** Technology (general): an application window with navigation, live chart and cursor. */
function ifaceDashboard({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(62, 12, 210, 136, 'lf', 6), rect(34, 30, 236, 162, 'bx', 6), path('M34 50H270M98 50V192', 'lf')];
  s.push(circle(46, 40, 3, 'fa'), circle(56, 40, 3, 'fl'), circle(66, 40, 3, 'fl'), rect(108, 36, 120, 8, 'ff', 4));
  s.push(rect(112 + Math.round(r() * 70), 37.5, 1.5, 5, 'fi an-blink'));
  s.push(group('an-scan5', [rect(40, 59, 52, 16, 'fs o3', 3)]));
  for (let i = 0; i < 5; i++) s.push(rect(46, 65 + i * 20, between(r, 22, 40), 4, i === 0 ? 'fa' : 'fl'));
  const pts = Array.from({ length: 7 }, (_, i) => [110 + i * 25, Math.max(72, 122 - i * 7 - r() * 22)]);
  s.push(path('M110 126H262', 'lf'), path(line(pts), 'la an-draw', true));
  const last = pts[pts.length - 1];
  s.push(circle(last[0], last[1], 3.2, 'fa'), circle(last[0], last[1], 7, 'la an-ripple'));
  const hot = Math.floor(r() * 3);
  for (let i = 0; i < 3; i++) {
    const x = 110 + i * 52;
    s.push(rect(x, 140, 44, 40, 'lf', 3), rect(x + 7, 150, 24, 3, 'fl'), rect(x + 7, 160, between(r, 14, 30), 8, i === hot ? 'fa' : 'fl', 1));
  }
  return s;
}

/** Product Design and CAD: orthographic bracket drawing with dimensions and a drafting cursor. */
function drawing({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const x0 = 30, yb = 158;
  const bw = 110 + Math.round(r() * 26), bh = 16 + Math.round(r() * 6), ut = 16 + Math.round(r() * 6), uh = 96 + Math.round(r() * 22);
  const outline = `M${x0} ${yb}H${x0 + bw}V${yb - bh}H${x0 + ut}V${yb - uh}H${x0}Z`;
  s.push(path(outline, 'ff'), path(outline, 'la an-draw', true));
  const hx = x0 + ut + (bw - ut) * 0.58;
  s.push(path(`M${f(hx - 5)} ${yb - bh}V${yb}M${f(hx + 5)} ${yb - bh}V${yb}`, 'ln dsh'));
  s.push(path(`M${f(hx)} ${yb - bh - 8}V${yb + 6}M${x0 + ut / 2} ${yb - uh - 8}V${yb + 6}`, 'cl'));
  const sx = 190, sw = 68 + Math.round(r() * 16);
  s.push(path(`M${sx} ${yb - uh}H${sx + sw}V${yb}H${sx}Z`, 'la an-draw d3', true), path(`M${sx} ${yb - bh}H${sx + sw}`, 'ln'));
  const hy = yb - uh + 28;
  for (const hcx of r() > 0.5 ? [sx + sw * 0.3, sx + sw * 0.7] : [sx + sw / 2]) {
    s.push(circle(hcx, hy, 6, 'la'), path(`M${f(hcx - 11)} ${hy}H${f(hcx + 11)}M${f(hcx)} ${hy - 11}V${hy + 11}`, 'cl'));
  }
  s.push(path(`M${x0 + ut + 4} ${yb - uh}H${sx - 6}M${x0 + bw + 4} ${yb - bh}H${sx - 6}`, 'lf dsh'));
  const dy = yb + 16;
  s.push(path(`M${x0} ${yb + 5}V${dy + 4}M${x0 + bw} ${yb + 5}V${dy + 4}M${x0} ${dy}H${x0 + bw}M${x0 + 6} ${dy - 3}L${x0} ${dy}L${x0 + 6} ${dy + 3}M${x0 + bw - 6} ${dy - 3}L${x0 + bw} ${dy}L${x0 + bw - 6} ${dy + 3}`, 'lf'));
  s.push(text(x0 + bw / 2, dy + 13, String(bw * 2), 'tx', 'middle'));
  const vx = sx + sw + 12;
  s.push(path(`M${sx + sw + 5} ${yb - uh}H${vx + 4}M${sx + sw + 5} ${yb}H${vx + 4}M${vx} ${yb - uh}V${yb}`, 'lf'));
  s.push(text(vx + 10, yb - uh / 2, String(uh * 2), 'tx', 'middle', `rotate(-90 ${vx + 10} ${f(yb - uh / 2)})`));
  const cx0 = x0 + ut + 12, cy0 = yb - uh + 10;
  s.push(group('an-drift', [path(`M${cx0 - 9} ${cy0}H${cx0 + 9}M${cx0} ${cy0 - 9}V${cy0 + 9}`, 'la'), rect(cx0 - 4, cy0 - 4, 8, 8, 'lf')]));
  s.push(rect(232, 182, 62, 18, 'lf'), path('M232 191H294M262 182V200', 'lf'));
  return s;
}

/** Practical Engineering Methods: a loaded beam on supports with its deflected shape. */
function beam({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(34, 96, 236, 14, 'bx', 2), path('M58 110l-13 22h26zM246 110l-13 22h26z', 'ln'), path('M38 136H80M224 136H268', 'ln')];
  let hatch = '';
  for (const x of [42, 52, 62, 72, 228, 238, 248, 258]) hatch += `M${x} 136l-6 8`;
  s.push(path(hatch, 'lf'));
  const n = 3 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const x = 84 + (i * 136) / (n - 1);
    s.push(group(cls('an-bob', dl(i)), [path(`M${f(x)} 34V88M${f(x - 5)} 80L${f(x)} 89L${f(x + 5)} 80`, 'la')]));
  }
  if (r() > 0.5) s.push(path('M84 34H220', 'la'));
  s.push(path(`M58 160Q152 ${f(176 + r() * 14)} 246 160`, 'la an-flow'), path('M58 160H246', 'lf dsh'));
  s.push(path('M58 196V172M53 178L58 172L63 178M246 196V172M241 178L246 172L251 178', 'ln'));
  return s;
}

/** Engineering (general): geometric construction with a sweeping radius and protractor. */
function geometry({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 104, cy = 102, R = 74;
  s.push(circle(cx, cy, R, 'lf'), circle(cx, cy, R / 2, 'lf dsh'));
  const a1 = -90 + between(r, -25, 25), a2 = a1 + between(r, 105, 135), a3 = a2 + between(r, 100, 130);
  const v = [a1, a2, a3].map((a) => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)]);
  s.push(path(`${line(v)}Z`, 'la an-draw', true));
  let bisectors = '';
  v.forEach((p, i) => { const q = v[(i + 1) % 3]; bisectors += `M${cx} ${cy}L${pt([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2])}`; });
  s.push(path(bisectors, 'cl'));
  v.forEach((p) => s.push(circle(p[0], p[1], 4, 'bxa')));
  s.push(circle(cx, cy, 2.5, 'fa'), group('an-arm', [path(`M${cx} ${cy}H${cx + R}`, 'ln'), circle(cx + R, cy, 3.2, 'fa')]));
  const px = 234, py = 150, pr = 54;
  s.push(path(`M${px - pr} ${py}A${pr} ${pr} 0 0 1 ${px + pr} ${py}Z`, 'bx'));
  let ticks = '';
  for (let k = 0; k <= 12; k++) {
    const a = (Math.PI * k) / 12, inner = k % 3 === 0 ? pr - 14 : pr - 7;
    ticks += `M${pt([px - pr * Math.cos(a), py - pr * Math.sin(a)])}L${pt([px - inner * Math.cos(a), py - inner * Math.sin(a)])}`;
  }
  s.push(path(ticks, 'ln'), group('an-swing', [path(`M${px} ${py}H${px + pr - 4}`, 'la'), circle(px + pr - 4, py, 2.6, 'fa')]), circle(px, py, 3, 'fi'));
  s.push(text(px, 172, `${Math.round(a2 - a1)}°`, 'tx', 'middle'));
  return s;
}

/** Tooling, Jigs and Fixtures: a clamped workpiece on a fixture plate under a plunging drill. */
function fixture({ r, uid }: Ctx): Shape[] {
  const s: Shape[] = [rect(16, 158, 272, 22, 'bx', 2)];
  let slots = '';
  for (let i = 0; i < 4; i++) slots += `M${44 + i * 68} 166h16v8h-16z`;
  s.push(path(slots, 'ff'));
  const ww = f(between(r, 104, 124)), wx = f(between(r, 88, 100)), wh = f(between(r, 36, 50)), wy = f(158 - wh);
  const clip = `${uid}-wp`;
  let hatch = '';
  for (let k = -2; k < 9; k++) hatch += `M${wx + k * 16} ${wy + wh}l${wh} ${-wh}`;
  s.push({ t: 'clip', id: clip, kids: [rect(wx, wy, ww, wh)] }, rect(wx, wy, ww, wh, 'bx', 2), group(undefined, [path(hatch, 'lf')], undefined, clip));
  s.push(rect(wx - 9, wy + wh - 22, 8, 22, 'fa', 2), rect(wx + ww + 1, wy + wh - 22, 8, 22, 'fa', 2));
  s.push(rect(26, wy - 14, 14, 158 - wy + 14, 'bx', 2), rect(264, wy - 14, 14, 158 - wy + 14, 'bx', 2));
  s.push(group('an-clamp', [path(`M33 ${wy - 8}H${wx + 24}`, 'ln arm'), rect(wx + 12, wy - 6, 14, 6, 'fa', 1)]));
  s.push(group('an-clamp-r', [path(`M271 ${wy - 8}H${wx + ww - 24}`, 'ln arm'), rect(wx + ww - 26, wy - 6, 14, 6, 'fa', 1)]));
  const dx = wx + ww / 2;
  s.push(path(`M${dx} 6V${wy + wh}`, 'cl'), rect(dx - 13, 4, 26, 26, 'bx', 3), path(`M${dx - 9} 30h18l-4 10h-10z`, 'bx'));
  s.push(group('an-plunge', [path(`M${dx - 4} 40h8v${wy - 62}l-4 9-4-9z`, 'la'), path(`M${dx - 4} 48l8 6M${dx - 4} 58l8 6`, 'lf')]));
  s.push(circle(dx - 12, wy - 4, 1.6, 'fl an-pulse d2'), circle(dx + 11, wy - 6, 1.4, 'fl an-pulse d5'));
  return s;
}

/** Manufacturing, Production and Quality: control chart, conveyor and inspection gate. */
function production({ r, uid }: Ctx): Shape[] {
  const s: Shape[] = [path('M18 16V90H150', 'ln'), path('M18 53H150', 'lf'), path('M18 30H150M18 76H150', 'lf dsh')];
  const pts = Array.from({ length: 9 }, (_, i) => [26 + i * 15, 53 + (r() - 0.5) * 38]);
  s.push(path(line(pts), 'la an-draw', true));
  pts.forEach((p, i) => s.push(circle(p[0], p[1], 2.2, i === 8 ? 'fa an-pulse' : 'fa')));
  s.push(rect(12, 142, 280, 24, 'bx', 12));
  for (let i = 0; i < 7; i++) {
    const x = 24 + i * 42.6;
    s.push(group('an-spin', [circle(x, 154, 8, 'ln'), path(`M${f(x - 6)} 154H${f(x + 6)}M${f(x)} 148V160`, 'lf')]));
  }
  const clip = `${uid}-belt`, off = Math.floor(r() * 3);
  const parts: Shape[] = [];
  for (let i = 0; i < 6; i++) {
    const x = -48 + i * 60, k = (i + off) % 3;
    if (k === 0) parts.push(rect(x, 118, 24, 24, 'bx', 2));
    else if (k === 1) parts.push(path(`M${x} 130l7-12h14l7 12-7 12h-14z`, 'bx'));
    else parts.push(path(`M${x} 122v16a12 4 0 0 0 24 0v-16a12 4 0 0 0 -24 0zM${x} 122a12 4 0 0 0 24 0`, 'bx'));
  }
  s.push({ t: 'clip', id: clip, kids: [rect(12, 100, 280, 42)] }, group(undefined, [group('an-convey', parts)], undefined, clip));
  s.push(rect(190, 100, 48, 42, 'fs an-glow'), path('M186 142V94H242V142', 'la'), circle(214, 94, 3, 'fa an-pulse d3'));
  s.push(circle(258, 44, 18, 'bxa'), path('M249 44l6 6 12-13', 'la an-draw', true), text(258, 78, 'QA', 'tx', 'middle'));
  return s;
}

/** Manufacturing (general): sawtooth factory, smoking stack and meshing gears. */
function factory({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const teeth = r() > 0.5 ? 4 : 3, tw = teeth === 4 ? 42 : 54, x0 = 18, base = 172, wall = f(between(r, 104, 118)), peak = f(between(r, 74, 90));
  const stack = f(x0 + Math.floor(r() * teeth) * tw + between(r, 8, tw - 24));
  s.push(rect(stack, 50, 16, 62, 'bx', 1));
  for (let k = 0; k < 4; k++) s.push(circle(stack + 8 + (k % 2 ? 4 : -3), 42, 5 + k, cls('fl an-bubble', dl(k * 2))));
  let body = `M${x0} ${base}V${wall}`;
  for (let i = 1; i <= teeth; i++) body += `L${x0 + i * tw} ${peak}V${wall}`;
  s.push(path(`${body}V${base}Z`, 'bx'));
  for (let i = 1; i <= teeth; i++) s.push(path(`M${x0 + i * tw} ${peak + 4}V${wall - 3}`, cls('la an-pulse', dl(i))));
  const xe = x0 + teeth * tw;
  let win = '';
  for (let x = x0 + 10; x < xe - 34; x += 22) win += `M${x} 126h12v16h-12z`;
  s.push(path(win, 'fl'), rect(f(between(r, x0 + 8, xe - 30)), 146, 20, 26, 'fa', 1));
  const gx = f(between(r, 256, 266)), gy = f(between(r, 128, 146)), go = f(between(r, 28, 33)), gn = 10 + Math.floor(r() * 4);
  s.push(group('an-spin', [path(gear(gx, gy, go, go - 7, gn), 'bx'), circle(gx, gy, 9, 'ln'), circle(gx, gy, 3, 'fa')]));
  s.push(group('an-spin-r', [path(gear(gx - 31, gy + 32, 17, 12, 8), 'bx'), circle(gx - 31, gy + 32, 3, 'fa')]));
  s.push(path(`M6 ${base}H298`, 'ln'));
  return s;
}

/** Lean and Continuous Improvement: the PDCA wheel held on the incline by a standard. */
function cycle({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const x1 = 8, y1 = 196, x2 = 298, y2 = 112 + r() * 22;
  const len = Math.hypot(x2 - x1, y2 - y1), dx = (x2 - x1) / len, dy = (y2 - y1) / len, nx = dy, ny = -dx;
  const R = 54, px = x1 + (x2 - x1) * 0.46, py = y1 + (y2 - y1) * 0.46, cx = px + nx * R, cy = py + ny * R;
  s.push(path(`M${x1} ${y1}L${f(x2)} ${f(y2)}V${y1}Z`, 'ff'), path(`M${x1} ${y1}L${f(x2)} ${f(y2)}`, 'ln'));
  s.push(path(`${line([[px - dx * 40, py - dy * 40], [px - dx * 2, py - dy * 2], [px - dx * 12 + nx * 18, py - dy * 12 + ny * 18]])}Z`, 'fa'));
  s.push(circle(cx, cy, R, 'bx'), path(`M${pt([cx - R, cy])}H${f(cx + R)}M${pt([cx, cy - R])}V${f(cy + R)}`, 'lf'));
  const hot = Math.floor(r() * 4);
  ([['A', -1, -1], ['P', 1, -1], ['D', 1, 1], ['C', -1, 1]] as const).forEach(([L, sx, sy], i) => s.push(text(cx + sx * 24, cy + sy * 24 + 5, L, i === hot ? 'txa' : 'txb', 'middle')));
  s.push(group('an-spin', [circle(cx, cy, R + 9, 'la dsh2'), path(`M${pt([cx - 4, cy - R - 13])}L${pt([cx + 3, cy - R - 9])}L${pt([cx - 4, cy - R - 5])}M${pt([cx + 4, cy + R + 5])}L${pt([cx - 3, cy + R + 9])}L${pt([cx + 4, cy + R + 13])}`, 'la')]));
  const q1 = [px + dx * 76 + nx * 16, py + dy * 76 + ny * 16], q2 = [px + dx * 116 + nx * 16, py + dy * 116 + ny * 16];
  s.push(path(`M${pt(q1)}L${pt(q2)}M${pt([q2[0] - dx * 8 + nx * 5, q2[1] - dy * 8 + ny * 5])}L${pt(q2)}L${pt([q2[0] - dx * 8 - nx * 5, q2[1] - dy * 8 - ny * 5])}`, 'ln'));
  return s;
}

/** Operations and Workflow Systems: a swimlane process traced from start to finish. */
function workflow({ r }: Ctx): Shape[] {
  const s: Shape[] = [path('M0 68H304M0 136H304', 'lf')];
  const laneY = [34, 102, 170];
  laneY.forEach((y, i) => s.push(rect(6, y - 10, 4, 20, i === 0 ? 'fa' : 'fl', 1)));
  const xs = [38, 92, 152, 212, 270], half = [10, 24, 18, 24, 10];
  let lane = Math.floor(r() * 3);
  const lanes = xs.map((_, i) => {
    if (i) lane = Math.min(2, Math.max(0, lane + (r() < 0.35 ? 0 : r() < 0.5 ? 1 : -1)));
    return lane;
  });
  if (lanes.every((l) => l === lanes[0])) lanes[2] = (lanes[2] + 1) % 3;
  const nodes = xs.map((x, i) => ({ x, y: laneY[lanes[i]], h: half[i] }));
  let route = `M${nodes[0].x + nodes[0].h} ${nodes[0].y}`, heads = '';
  for (let i = 0; i < 4; i++) {
    const a = nodes[i], b = nodes[i + 1], ex = b.x - b.h - 2, mx = (a.x + a.h + ex) / 2;
    route += `H${mx}V${b.y}H${ex}${i < 3 ? `H${b.x + b.h}` : ''}`;
    heads += `M${ex - 6} ${b.y - 4}L${ex} ${b.y}L${ex - 6} ${b.y + 4}`;
  }
  s.push(path(route, 'ln'), path(heads, 'ln'), path(route, 'la an-draw', true));
  nodes.forEach((n, i) => {
    if (i === 0) s.push(circle(n.x, n.y, 10, 'bxa'), circle(n.x, n.y, 4, 'fa'));
    else if (i === 4) s.push(circle(n.x, n.y, 10, 'bx'), circle(n.x, n.y, 6, 'fa an-pulse'));
    else if (i === 2) s.push(path(`M${n.x} ${n.y - 18}L${n.x + 18} ${n.y}L${n.x} ${n.y + 18}L${n.x - 18} ${n.y}Z`, 'bxa'), text(n.x, n.y + 3.5, '?', 'txs', 'middle'));
    else s.push(rect(n.x - 24, n.y - 15, 48, 30, 'bx', 4), rect(n.x - 15, n.y - 5, between(r, 18, 30), 3, 'fl'), rect(n.x - 15, n.y + 2, between(r, 10, 22), 3, cls('fl an-pulse', dl(i))));
  });
  return s;
}

/** Operations (general): performance dial, KPI bars and trend line. */
function gauge({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 152, cy = 122, R = 84;
  const at = (deg: number, rad: number) => pt([cx + rad * Math.cos((deg * Math.PI) / 180), cy - rad * Math.sin((deg * Math.PI) / 180)]);
  s.push(path(`M${at(180, R)}A${R} ${R} 0 0 1 ${at(0, R)}`, 'ln wide'));
  s.push(path(`M${at(40 + Math.round(r() * 20), R)}A${R} ${R} 0 0 1 ${at(0, R)}`, 'la wide'));
  let ticks = '';
  for (let k = 0; k <= 12; k++) ticks += `M${at(180 - k * 15, R - 8)}L${at(180 - k * 15, k % 3 === 0 ? R - 20 : R - 13)}`;
  s.push(path(ticks, 'ln'), path(`M${cx} ${cy}H${cx - R + 22}`, 'la an-needle'), circle(cx, cy, 11, 'bx'), circle(cx, cy, 5, 'fa'));
  s.push(rect(cx - 30, cy + 20, 60, 22, 'bx', 3), text(cx, cy + 36, `${72 + Math.floor(r() * 22)}%`, 'txb', 'middle'));
  for (let i = 0; i < 4; i++) {
    const h = 12 + r() * 30;
    s.push(group(cls('an-grow', dl(i)), [rect(26 + i * 16, 194 - h, 10, h, i === 3 ? 'fa' : 'fl', 1)]));
  }
  s.push(path(line(Array.from({ length: 7 }, (_, i) => [214 + i * 12, 186 - r() * 26])), 'la an-draw', true));
  return s;
}

/** Project Planning, Risk and Delivery: a Gantt schedule with progress, dependencies and a moving today line. */
function gantt({ r }: Ctx): Shape[] {
  let grid = '';
  for (let i = 0; i <= 8; i++) grid += `M${64 + i * 29} 8V198`;
  const s: Shape[] = [path(grid, 'lf')];
  const rows: { x: number; y: number; w: number }[] = [];
  let start = 66 + r() * 16;
  for (let i = 0; i < 6; i++) {
    const w = 40 + r() * 64, x = Math.min(start, 292 - w);
    rows.push({ x, y: 18 + i * 29, w });
    start = x + w * (0.45 + r() * 0.5);
  }
  let deps = '';
  rows.forEach((row, i) => {
    s.push(rect(8, row.y + 4, between(r, 24, 44), 4, 'fl'), rect(row.x, row.y, row.w, 12, 'fl', 3));
    s.push(group(cls('an-growx', dl(i)), [rect(row.x, row.y, row.w * between(r, 0.35, 1), 12, 'fa', 3)]));
    const next = rows[i + 1], ex = row.x + row.w;
    if (next && next.x > ex + 4) deps += `M${f(ex)} ${row.y + 6}H${f((ex + next.x) / 2)}V${next.y + 6}H${f(next.x - 1)}`;
  });
  if (deps) s.push(path(deps, 'ln'));
  const last = rows[rows.length - 1], mx = Math.min(last.x + last.w, 294);
  s.push(path(`M${f(mx)} ${last.y - 1}l7 7-7 7-7-7z`, 'fi'));
  s.push(group('an-today', [path('M96 6V200', 'la'), path('M91 4h10l-5 7z', 'fa')]));
  return s;
}

/** Projects (general): an activity network with its critical path highlighted. */
function network({ r }: Ctx): Shape[] {
  const j = () => between(r, -10, 10);
  const nodes = [[24, 102 + j()], [92, 50 + j()], [92, 154 + j()], [152, 70 + j()], [152, 140 + j()], [212, 46 + j()], [212, 152 + j()], [280, 102 + j()]];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5], [4, 6], [3, 6], [5, 7], [6, 7]];
  const R = 13;
  let base = '';
  for (const [a, b] of edges) {
    const A = nodes[a], B = nodes[b], len = Math.hypot(B[0] - A[0], B[1] - A[1]);
    const ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len, ex = B[0] - ux * (R + 2), ey = B[1] - uy * (R + 2);
    base += `M${pt([A[0] + ux * R, A[1] + uy * R])}L${pt([ex, ey])}M${pt([ex - ux * 6 - uy * 4, ey - uy * 6 + ux * 4])}L${pt([ex, ey])}L${pt([ex - ux * 6 + uy * 4, ey - uy * 6 - ux * 4])}`;
  }
  const chains = [[0, 1, 3, 5, 7], [0, 1, 4, 5, 7], [0, 2, 4, 6, 7], [0, 1, 3, 6, 7], [0, 2, 4, 5, 7], [0, 1, 4, 6, 7]];
  const chain = chains[Math.floor(r() * chains.length)];
  const s: Shape[] = [path(base, 'ln'), path(line(chain.map((k) => nodes[k])), 'la an-draw', true)];
  nodes.forEach((n, i) => s.push(circle(n[0], n[1], R, chain.includes(i) ? 'bxa' : 'bx'), text(n[0], n[1] + 3.5, String(i + 1), 'txs', 'middle')));
  return s;
}

/** Product Development and Launch: concept, prototype and product rising along a launch trajectory. */
function launch({ r }: Ctx): Shape[] {
  const s: Shape[] = [path(`M10 198C${f(between(r, 90, 130))} 192 200 ${f(between(r, 100, 140))} 296 12`, 'la an-flow'), path('M100 14V198M188 14V198', 'lf dsh')];
  s.push(circle(52, 154, 24, 'ln dsh'), path('M38 158q7-12 14 0t14 0', 'ln'));
  const wx = 142 + between(r, -6, 6), wy = 112 + between(r, -6, 6);
  const wire = cubeFaces(wx, wy, 26);
  s.push(path(wire.top + wire.left + wire.right, 'ln'), path(wire.hidden, 'lf dsh'));
  const solid = cubeFaces(240, 66, 30);
  s.push(group('an-bob', [path(solid.left, 'bx'), path(solid.right, 'bx'), path(solid.top, 'fa')]));
  s.push(path(spark(280, 34, 8), 'fs an-pulse'));
  [52, 142, 240].forEach((x, i) => s.push(text(x, 198, `0${i + 1}`, 'tx', 'middle')));
  return s;
}

/** Products (general): an exploded assembly with numbered balloons. */
function exploded({ r }: Ctx): Shape[] {
  const s: Shape[] = [path('M152 4V200', 'cl')];
  const hot = Math.floor(r() * 4);
  const layers = [{ rx: between(r, 40, 52), t: 14 }, { rx: between(r, 64, 78), t: 7 }, { rx: between(r, 54, 66), t: 22 }, { rx: between(r, 70, 84), t: 10 }];
  layers.forEach((L, k) => {
    const y = 34 + k * 42, ry = L.rx * 0.26;
    const kids: Shape[] = [
      path(`M${f(152 - L.rx)} ${y}V${y + L.t}A${f(L.rx)} ${f(ry)} 0 0 0 ${f(152 + L.rx)} ${y + L.t}V${y}Z`, 'bx'),
      ellipse(152, y, L.rx, ry, k === hot ? 'bxa' : 'bx'),
    ];
    if (k === hot) kids.push(ellipse(152, y, L.rx * 0.45, ry * 0.45, 'fa'));
    kids.push(path(`M${pt([152 + L.rx * 0.72, y + ry * 0.3])}L250 ${y - 6}H264`, 'lf'), circle(274, y - 6, 9, 'bx'), text(274, y - 2.5, String(k + 1), 'txs', 'middle'));
    s.push(group(cls(k < 2 ? 'an-up' : 'an-down', dl(k)), kids));
  });
  return s;
}

/** Risk, Compliance and Governance: a protective shield and a risk matrix showing mitigation. */
function shieldMatrix({ r }: Ctx): Shape[] {
  const s: Shape[] = [path('M64 18L112 36V92Q112 148 64 178Q16 148 16 92V36Z', 'bx'), path('M64 32L100 46V92Q100 136 64 160Q28 136 28 92V46Z', 'lf'), path('M44 96l14 15 26-30', 'la xbold an-draw', true)];
  const x0 = 146, y0 = 18, c = 30;
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
    const score = (i + 1) * (5 - j);
    s.push(rect(x0 + i * c + 1.5, y0 + j * c + 1.5, c - 3, c - 3, score >= 15 ? 'fa o85' : score >= 8 ? 'fl' : 'ff', 2));
  }
  s.push(path(`M${x0 - 6} ${y0}V${y0 + 156}H${x0 + 150}`, 'ln'));
  const hx = x0 + (3 + Math.floor(r() * 2)) * c + c / 2, hy = y0 + Math.floor(r() * 2) * c + c / 2;
  const lx = x0 + Math.floor(r() * 2) * c + c / 2, ly = y0 + (3 + Math.floor(r() * 2)) * c + c / 2;
  const bend = between(r, 10, 34);
  s.push(path(`M${hx} ${hy}Q${f((hx + lx) / 2 + bend)} ${f((hy + ly) / 2 + bend)} ${lx} ${ly}`, 'la an-flow'), circle(hx, hy, 8, 'bxa an-pulse'), circle(lx, ly, 6, 'fs'));
  s.push(text(x0 + 75, 194, 'IMPACT', 'tx', 'middle'), text(x0 - 14, y0 + 75, 'LIKELIHOOD', 'tx', 'middle', `rotate(-90 ${x0 - 14} ${y0 + 75})`));
  return s;
}

/** Business Finance and Financial Statements: ledger, rising results and trend. */
function ledger(ctx: Ctx): Shape[] {
  const { r } = ctx;
  let rules = '';
  for (let y = 22; y <= 190; y += 21) rules += `M8 ${y}H128`;
  const s: Shape[] = [path(rules, 'lf'), path('M44 10V196M48 10V196', 'lf')];
  for (let y = 22; y <= 190; y += 21) {
    const w = between(r, 26, 60);
    s.push(rect(12, y - 9, between(r, 16, 26), 4, 'fl'), rect(124 - w, y - 9, w, 4, y === 190 ? 'fa' : 'fl'));
  }
  s.push(...pick([ledgerBars, ledgerCandles, ledgerBalance, ledgerDonut, ledgerWaterfall], ctx.v)(r));
  return s;
}

function ledgerBars(r: () => number): Shape[] {
  const s: Shape[] = [path('M140 186H296', 'ln')];
  const pts: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const h = 28 + i * 17 + r() * 18, x = 150 + i * 29;
    s.push(group(cls('an-grow', dl(i)), [rect(x, 186 - h, 18, h, i === 4 ? 'fa' : 'fl', 2)]));
    pts.push([x + 9, 186 - h - 14]);
  }
  s.push(path(line(pts), 'la an-draw', true));
  pts.forEach((p) => s.push(circle(p[0], p[1], 3.2, 'fa')));
  s.push(circle(pts[4][0], pts[4][1], 8, 'la an-ripple'));
  return s;
}

function ledgerCandles(r: () => number): Shape[] {
  const s: Shape[] = [path('M140 186H296', 'ln')];
  const avg: number[][] = [];
  let open = between(r, 150, 168);
  for (let i = 0; i < 8; i++) {
    const x = 152 + i * 19, close = Math.min(176, Math.max(40, open - between(r, -14, 22)));
    const hi = Math.min(open, close) - between(r, 4, 12), lo = Math.max(open, close) + between(r, 4, 12);
    s.push(path(`M${f(x)} ${f(hi)}V${f(lo)}`, 'ln'), rect(x - 5, Math.min(open, close), 10, Math.max(3, Math.abs(close - open)), close < open ? 'fa' : 'bx', 1));
    avg.push([x, (open + close) / 2]);
    open = close;
  }
  const last = avg[avg.length - 1];
  s.push(path(line(avg), 'la an-draw', true), circle(last[0], last[1], 7, 'la an-ripple'));
  return s;
}

function ledgerBalance(r: () => number): Shape[] {
  const coins: Shape[] = [];
  for (let k = 0, n = 2 + Math.floor(r() * 3); k < n; k++) coins.push(ellipse(162, 116 - k * 5, 13, 3.6, 'fa'));
  return [
    rect(188, 180, 60, 7, 'bx', 2), path('M218 180V80', 'ln wide'), path('M206 180l12-14 12 14', 'ln'),
    group('an-balance', [
      path('M148 76H288', 'ln wide'), path('M162 76L144 120M162 76L180 120M274 76L256 120M274 76L292 120', 'lf'),
      path('M140 120Q162 136 184 120Z', 'bx'), path('M252 120Q274 136 296 120Z', 'bx'), ...coins,
      rect(263, 98 - Math.floor(r() * 3) * 4, 22, 18, 'bx', 2), path('M267 104h14M267 109h10', 'lf'),
    ]),
    circle(218, 76, 5, 'fa'), text(162, 156, 'ASSETS', 'tx', 'middle'), text(274, 156, 'FUNDING', 'tx', 'middle'),
  ];
}

function ledgerDonut(r: () => number): Shape[] {
  const cx = 218, cy = 98, R = 48;
  const vals = [r() + 0.6, r() + 0.3, r() + 0.2, r() + 0.15], total = vals.reduce((a, b) => a + b, 0);
  const ring: Shape[] = [circle(cx, cy, R, 'lf')];
  let a = -Math.PI / 2;
  vals.forEach((v, i) => {
    const span = (v / total) * Math.PI * 2, a0 = a + 0.05, a1 = a + span - 0.05;
    ring.push(path(`M${pt([cx + R * Math.cos(a0), cy + R * Math.sin(a0)])}A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt([cx + R * Math.cos(a1), cy + R * Math.sin(a1)])}`, cls(i === 0 ? 'la' : i % 2 ? 'ln' : 'lf', 'thick')));
    a += span;
  });
  const s: Shape[] = [group('an-spin', ring), text(cx, cy + 5, `${Math.round((vals[0] / total) * 100)}%`, 'txb', 'middle')];
  for (let i = 0; i < 4; i++) s.push(rect(150 + i * 38, 170, 8, 8, i === 0 ? 'fa' : 'fl', 1), rect(161 + i * 38, 172, 18, 4, 'fl'));
  return s;
}

function ledgerWaterfall(r: () => number): Shape[] {
  const x = (i: number) => 148 + i * 24;
  let level = 186 - between(r, 56, 80), conn = '';
  const s: Shape[] = [path('M140 186H296', 'ln'), group(cls('an-grow', dl(0)), [rect(x(0), level, 16, 186 - level, 'fl', 1)])];
  for (let i = 1; i <= 4; i++) {
    const next = Math.min(176, Math.max(34, level - between(r, 10, 30) * (r() > 0.3 ? 1 : -1)));
    conn += `M${x(i - 1) + 16} ${f(level)}H${x(i)}`;
    s.push(group(cls('an-grow', dl(i)), [rect(x(i), Math.min(level, next), 16, Math.max(3, Math.abs(next - level)), next < level ? 'fa' : 'bx', 1)]));
    level = next;
  }
  conn += `M${x(4) + 16} ${f(level)}H${x(5)}`;
  s.push(path(conn, 'lf dsh'), group(cls('an-grow', dl(5)), [rect(x(5), level, 16, 186 - level, 'bxa', 1)]));
  return s;
}

/** Strategy and Competitive Advantage: a contour map with a route to the summit. */
function contour({ r, v }: Ctx): Shape[] {
  let grid = '';
  for (let x = 38; x < 304; x += 76) for (let y = 34; y < 204; y += 68) grid += `M${x - 4} ${y}h8M${x} ${y - 4}v8`;
  const s: Shape[] = [path(grid, 'lf')];
  const main = [between(r, 120, 200), between(r, 70, 110)];
  const second = [main[0] < 160 ? between(r, 236, 266) : between(r, 40, 70), between(r, 140, 166)];
  const h = [r(), r(), r(), r() * 6.28, r() * 6.28, r() * 6.28];
  const ring = (c: number[], rad: number, k: number) => {
    const pts: number[][] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const m = 1 + 0.2 * h[0] * Math.sin(a + h[3] + k * 0.25) + 0.12 * h[1] * Math.sin(2 * a + h[4]) + 0.06 * h[2] * Math.sin(3 * a + h[5] - k * 0.2);
      pts.push([c[0] + rad * m * Math.cos(a), c[1] + rad * m * 0.82 * Math.sin(a)]);
    }
    return closedSmooth(pts);
  };
  for (let k = 1; k <= 7; k++) s.push(path(ring(main, k * 15, k), k % 3 === 0 ? 'ln' : 'lf'));
  for (let k = 1; k <= 3; k++) s.push(path(ring(second, k * 13, k + 3), k === 3 ? 'ln' : 'lf'));
  const [x, y] = main;
  const approach = `M14 194C${f(x - 70)} 190 ${f(x - 40)} ${f(y + 70)} ${pt(main)}`;
  const flag = [path(`M${pt(main)}V${f(y - 30)}`, 'ln'), group('an-wave', [path(`M${pt([x, y - 30])}h20l-6 7 6 7h-20z`, 'fa')]), circle(x, y, 3, 'fa')];
  const mode = v % 5;
  if (mode === 0) s.push(path(approach, 'la an-flow'), path('M8 196l7-11 7 11z', 'ln'), ...flag);
  else if (mode === 1) {
    for (let k = 0; k < 3; k++) {
      let cx = between(r, 20, 284), cy = between(r, 22, 184);
      if (Math.hypot(cx - x, cy - y) < 50) { cx = ((cx + 152) % 284) + 10; cy = ((cy + 90) % 170) + 16; }
      s.push(path(`M${f(cx)} ${f(cy - 7)}l6 11h-12z`, 'bx'));
    }
    s.push(circle(x, y, 22, 'ln'), circle(x, y, 12, 'la'), path(`M${f(x - 32)} ${f(y)}H${f(x - 16)}M${f(x + 16)} ${f(y)}H${f(x + 32)}M${f(x)} ${f(y - 32)}V${f(y - 16)}M${f(x)} ${f(y + 16)}V${f(y + 32)}`, 'ln'), circle(x, y, 4, 'fa an-pulse'), circle(x, y, 22, 'la an-ripple'));
  } else if (mode === 2) {
    s.push(path(`M292 196C${f(x + 80)} 186 ${f(x + 50)} ${f(y + 60)} ${f(x + 16)} ${f(y + 22)}`, 'ln dsh'), path(`M${f(x + 9)} ${f(y + 15)}l10 10M${f(x + 19)} ${f(y + 15)}l-10 10`, 'ln'));
    s.push(path(approach, 'la an-flow'), ...flag);
  } else if (mode === 3) {
    s.push(path(`M14 194C${f(x - 70)} 190 ${f(x - 60)} ${f(y + 40)} ${f(x - 36)} ${f(y + 12)}`, 'ln dsh'), circle(x, y, 26, 'ff'), group('an-spin', [circle(x, y, 34, 'la dsh2')]));
    s.push(path(`M${f(x - 11)} ${f(y + 9)}V${f(y - 5)}h5v4h4v-4h4v4h4v-4h5V${f(y + 9)}Z`, 'fa'), rect(x - 2.5, y + 2, 5, 7, 'fn', 1));
  } else {
    for (const start of [[6, y + 20], [x - 10, 200], [298, y + 34]]) {
      const len = Math.hypot(x - start[0], y - start[1]), ux = (x - start[0]) / len, uy = (y - start[1]) / len;
      const end = [x - ux * 24, y - uy * 24];
      s.push(path(`M${pt(start)}L${pt(end)}`, 'la an-flow'), path(`M${pt([end[0] - ux * 8 - uy * 5, end[1] - uy * 8 + ux * 5])}L${pt(end)}L${pt([end[0] - ux * 8 + uy * 5, end[1] - uy * 8 - ux * 5])}`, 'la'));
    }
    s.push(...flag);
  }
  return s;
}

/** Sales, Marketing and Customer Decisions: a conversion funnel delivering to a target. */
function funnelStages({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 104, hw = (y: number) => 92 - (y - 34) * 0.52;
  for (let k = 0; k < 4; k++) {
    const y1 = 34 + k * 30, y2 = y1 + 26;
    s.push(path(`M${f(cx - hw(y1))} ${y1}H${f(cx + hw(y1))}L${f(cx + hw(y2))} ${y2}H${f(cx - hw(y2))}Z`, k === 0 ? 'bxa' : 'bx'), rect(cx - 18 + k * 2, y1 + 11, 36 - k * 4, 4, 'fl'));
  }
  s.push(rect(cx - 9, 152, 18, 20, 'bx', 2));
  for (let k = 0; k < 7; k++) s.push(circle(cx - 70 + k * 23 + r() * 8, 22, 3.2, cls('fa an-fall', dl(k))));
  s.push(path(`M${cx} 174V190H252V176`, 'la an-flow'), path('M247 181l5-6 5 6', 'la'));
  s.push(circle(252, 148, 24, 'lf'), circle(252, 148, 16, 'ln'), circle(252, 148, 8, 'fa an-pulse'));
  for (let i = 0; i < 3; i++) s.push(rect(214, 20 + i * 22, between(r, 74, 82) - i * 24, 12, i === 0 ? 'fa' : 'fl', 2));
  return s;
}

/** Leadership, People and Teams: a connected team around a leader. */
function team({ r }: Ctx): Shape[] {
  const L = [152, 104], off = r() * 60;
  const others = Array.from({ length: 6 }, (_, k) => {
    const a = ((k * 60 + off + between(r, -8, 8)) * Math.PI) / 180;
    return [L[0] + 116 * Math.cos(a), L[1] + 66 * Math.sin(a)];
  });
  let links = '', ring = '';
  others.forEach((o, k) => { links += `M${pt(L)}L${pt(o)}`; ring += `M${pt(o)}L${pt(others[(k + 1) % 6])}`; });
  const s: Shape[] = [path(ring, 'lf dsh'), path(links, 'lf')];
  const first = Math.floor(r() * 6), second = (first + 2 + Math.floor(r() * 3)) % 6;
  for (const k of [first, second]) s.push(path(`M${pt(L)}L${pt(others[k])}`, 'la an-flow'));
  s.push(circle(L[0], L[1] - 4, 34, 'la an-ripple'));
  const mentor = Math.floor(r() * 6);
  others.forEach((o, k) => s.push(...person(o[0], o[1], 17, k === mentor ? 'bxa' : 'bx')));
  s.push(...person(L[0], L[1], 26, 'fa'));
  return s;
}

/** Starting and Running a Business: a growing skyline at sunrise. */
function venture({ r, uid }: Ctx): Shape[] {
  const hz = 164, sx = between(r, 228, 262), sky = `${uid}-sky`;
  let rays = '';
  for (let k = 0; k < 9; k++) {
    const a = (Math.PI * (k + 0.5)) / 9;
    rays += `M${pt([sx + 40 * Math.cos(a), hz - 40 * Math.sin(a)])}L${pt([sx + 60 * Math.cos(a), hz - 60 * Math.sin(a)])}`;
  }
  const s: Shape[] = [{ t: 'clip', id: sky, kids: [rect(0, 0, 304, hz)] }, group(undefined, [path(rays, 'lf'), group('an-sun', [circle(sx, 156, 30, 'fa')])], undefined, sky)];
  const blds: { x: number; w: number; h: number }[] = [];
  let x = 16;
  for (let k = 0; k < 5; k++) { const w = between(r, 28, 40); blds.push({ x, w, h: between(r, 44, 118) }); x += w + 6; }
  const newest = Math.floor(r() * 5);
  blds.forEach((b, k) => {
    const y = hz - b.h;
    let win = '';
    for (let wy = y + 10; wy < hz - 14; wy += 13) for (let wx = b.x + 6; wx < b.x + b.w - 8; wx += 10) win += `M${pt([wx, wy])}h5v7h-5z`;
    s.push(group(k === newest ? 'an-build' : undefined, [rect(b.x, y, b.w, b.h, k === newest ? 'bxa' : 'bx', 1), path(win, k % 2 ? 'fl' : 'ff')]));
  });
  const tallest = blds.reduce((a, b) => (b.h > a.h ? b : a)), tx = tallest.x + tallest.w / 2, ty = hz - tallest.h;
  s.push(path(`M${pt([tx, ty])}V${f(ty - 22)}`, 'ln'), group('an-wave', [path(`M${pt([tx, ty - 22])}h16l-5 6 5 6h-16z`, 'fa')]));
  s.push(path(`M0 ${hz}H304`, 'ln'), path(`M118 204L150 ${hz}M200 204L168 ${hz}`, 'lf'), path(`M159 ${hz + 6}V204`, 'lf dsh'));
  return s;
}

/** Business Processes and Better Decisions: a decision tree with the chosen path traced. */
function decision({ r }: Ctx): Shape[] {
  const root = [24, 102];
  const l1 = [[110, 54 + between(r, -6, 6)], [110, 150 + between(r, -6, 6)]];
  const leaves = [26, 78, 128, 180].map((y) => [204, y + between(r, -4, 4)]);
  const curve = (a: number[], b: number[]) => `M${pt(a)}C${pt([a[0] + 44, a[1]])} ${pt([b[0] - 44, b[1]])} ${pt(b)}`;
  const s: Shape[] = [path(l1.map((n) => curve(root, n)).join('') + leaves.map((lf, i) => curve(l1[i < 2 ? 0 : 1], lf)).join(''), 'ln')];
  const c1 = Math.floor(r() * 2), c2 = c1 * 2 + Math.floor(r() * 2);
  s.push(path(curve(root, l1[c1]) + curve(l1[c1], leaves[c2]).replace(/^M[^C]+/, ''), 'la an-draw', true));
  const p = Math.round((0.55 + r() * 0.3) * 10) / 10;
  leaves.forEach((lf, i) => {
    const a = l1[i < 2 ? 0 : 1];
    s.push(text(157, (a[1] + lf[1]) / 2 - 5, (i % 2 ? 1 - p : p).toFixed(1), 'tx', 'middle'));
    s.push(rect(222, lf[1] - 4, between(r, 24, 72), 8, i === c2 ? 'fa' : 'fl', 2));
    s.push(path(`M${f(lf[0] - 6)} ${f(lf[1])}L${f(lf[0] + 8)} ${f(lf[1] - 8)}V${f(lf[1] + 8)}Z`, i === c2 ? 'fa' : 'bx'));
  });
  s.push(rect(root[0] - 10, root[1] - 10, 20, 20, 'bxa', 2));
  l1.forEach((n, i) => s.push(circle(n[0], n[1], 10, i === c1 ? 'bxa' : 'bx')));
  s.push(circle(l1[c1][0], l1[c1][1], 4, 'fa an-pulse'));
  return s;
}

/** Business (general): a compass rose over a map grid with a set course. */
function compassRose({ r }: Ctx): Shape[] {
  let grid = '';
  for (let x = 0; x <= 304; x += 38) grid += `M${x} 0V204`;
  for (let y = 6; y <= 204; y += 38) grid += `M0 ${y}H304`;
  const cx = 152, cy = 102, R = 78;
  const s: Shape[] = [path(grid, 'lf o5'), circle(cx, cy, R, 'bx'), circle(cx, cy, R - 14, 'lf')];
  let ticks = '', rose = '';
  for (let k = 0; k < 36; k++) {
    const a = (k * 10 * Math.PI) / 180, inner = k % 3 === 0 ? R - 14 : R - 7;
    ticks += `M${pt([cx + R * Math.sin(a), cy - R * Math.cos(a)])}L${pt([cx + inner * Math.sin(a), cy - inner * Math.cos(a)])}`;
  }
  for (let k = 0; k < 8; k++) {
    const a = (k * 45 * Math.PI) / 180, rr = k % 2 ? 26 : 50, b1 = a - Math.PI / 8, b2 = a + Math.PI / 8;
    rose += `M${cx} ${cy}L${pt([cx + 9 * Math.sin(b1), cy - 9 * Math.cos(b1)])}L${pt([cx + rr * Math.sin(a), cy - rr * Math.cos(a)])}L${pt([cx + 9 * Math.sin(b2), cy - 9 * Math.cos(b2)])}Z`;
  }
  s.push(path(ticks, 'ln'), path(rose, 'rose'));
  ([['N', 0], ['E', 90], ['S', 180], ['W', 270]] as const).forEach(([L, deg]) => {
    const a = (deg * Math.PI) / 180;
    s.push(text(cx + (R + 12) * Math.sin(a), cy - (R + 12) * Math.cos(a) + 5, L, L === 'N' ? 'txa' : 'txb', 'middle'));
  });
  s.push(group(undefined, [path(`M${cx} ${cy}V${cy - R + 4}`, 'la an-flow')], `rotate(${Math.round(between(r, 20, 330))} ${cx} ${cy})`));
  s.push(group(undefined, [group('an-compass', [path(`M${cx} ${cy - 60}L${cx + 8} ${cy}L${cx - 8} ${cy}Z`, 'fa'), path(`M${cx} ${cy + 60}L${cx + 8} ${cy}L${cx - 8} ${cy}Z`, 'bx')])], `rotate(${Math.round(between(r, -40, 40))} ${cx} ${cy})`));
  s.push(circle(cx, cy, 4.5, 'fi'));
  return s;
}

/** Exploring and Testing Ideas: a flask experiment beside a hypothesis plot. */
function experiment({ r, uid }: Ctx): Shape[] {
  const body = 'M124 18V62L72 166Q66 180 82 180H190Q206 180 200 166L148 62V18';
  const clip = `${uid}-flask`, lvl = f(between(r, 102, 126));
  const wave = `M-60 ${lvl}q7.5 -5 15 0${'t15 0'.repeat(23)}V204H-60Z`;
  const bubbles = Array.from({ length: 6 }, (_, k) => circle(between(r, 96, 176), between(r, 160, 176), between(r, 2.4, 4.4), cls('fn an-bubble', dl(k))));
  const s: Shape[] = [{ t: 'clip', id: clip, kids: [path(`${body}Z`)] }, group(undefined, [group('an-slosh', [path(wave, 'fa o85')]), ...bubbles], undefined, clip)];
  s.push(path('M118 18H154', 'ln wide'), path(body, 'ln wide'), path('M110 90h10M100 110h10M90 130h10M80 150h10', 'lf'));
  s.push(path('M222 24V138H298', 'ln'));
  const slope = between(r, -0.9, -0.4), b0 = between(r, 112, 128);
  for (let k = 0; k < 9; k++) {
    const x = 230 + k * 7.5 + between(r, -3, 3);
    s.push(circle(x, b0 + (x - 230) * slope + between(r, -12, 12), 2.4, 'fl'));
  }
  s.push(path(`M226 ${f(b0 - 4 * slope)}L294 ${f(b0 + 64 * slope)}`, 'la an-draw', true), text(260, 156, 'TEST', 'tx', 'middle'));
  return s;
}

/** Ideas (general): orbits of thought around a central idea, with sparks. */
function orbit({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 152, cy = 102;
  const orbits = [{ rx: 130, ry: 34, tilt: between(r, -18, -6) }, { rx: 98, ry: 28, tilt: between(r, 18, 34) }, { rx: 64, ry: 22, tilt: between(r, 62, 84) }];
  orbits.forEach((o, k) => s.push(group(undefined, [group(cls('an-tilt', k % 2 === 1 && 'rev', dl(k * 2)), [ellipse(cx, cy, o.rx, o.ry, k === 0 ? 'ln' : 'lf'), circle(cx + o.rx, cy, k === 0 ? 5 : 4, k === 0 ? 'fa' : 'fs'), circle(cx - o.rx, cy, 2.6, 'fl')])], `rotate(${f(o.tilt)} ${cx} ${cy})`)));
  s.push(circle(cx, cy, 18, 'fa'), circle(cx, cy, 26, 'la an-ripple'));
  for (let k = 0; k < 5; k++) s.push(path(spark(between(r, 20, 284), between(r, 14, 190), between(r, 3, 6)), cls('fs an-pulse', dl(k))));
  return s;
}

/** Read the Numbers, Understand the Business: a balance sheet under a moving magnifying glass. */
function lens({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(12, 10, 280, 186, 'bx', 3), rect(24, 22, 92, 6, 'fl', 1), rect(166, 22, 92, 6, 'fl', 1), path('M152 18V188', 'lf')];
  const hotRow = Math.floor(r() * 6);
  for (const col of [0, 1]) for (let i = 0; i < 6; i++) {
    const y = 46 + i * 19, x = col ? 166 : 24, right = col ? 280 : 140, w = between(r, 18, 36);
    if (col === 0 && i === hotRow) s.push(rect(18, y - 6, 128, 14, 'fs o3', 2));
    s.push(rect(x, y, between(r, 34, 62), 4, 'fl', 1), rect(right - w, y, w, 4, 'fi o5', 1));
  }
  s.push(path('M96 168H140M96 171H140M236 168H280M236 171H280', 'ln'), rect(104, 178, 36, 5, 'fa', 1), rect(244, 178, 36, 5, 'fa', 1));
  s.push(group('an-inspect', [circle(66, 92, 30, 'fs o15'), circle(66, 92, 30, 'la wide'), path('M88 114l24 24', 'ln xwide')]));
  return s;
}

/** Win Work You Can Deliver: a qualified path from enquiry to delivery, with a declined branch. */
function pathway(_ctx: Ctx): Shape[] {
  const route = line([[16, 180], [80, 180], [80, 134], [146, 134], [146, 88], [212, 88], [212, 42], [262, 42]]);
  const s: Shape[] = [path('M80 180H186', 'lf dsh'), path('M180 172l12 14M192 172l-12 14', 'ln'), path(route, 'ln dsh'), path(route, 'la an-draw', true)];
  [[80, 134], [146, 88], [212, 42]].forEach(([x, y], i) => s.push(circle(x, y, 11, 'bxa'), path(`M${x - 5} ${y}l3.5 4 7-8`, cls('la an-pulse', dl(i * 2)))));
  const box = cubeFaces(278, 36, 13);
  s.push(circle(16, 180, 5, 'fa'), group('an-bob', [path(box.left, 'bx'), path(box.right, 'bx'), path(box.top, 'fa')]));
  s.push(text(16, 198, 'ENQUIRY', 'tx'), text(290, 74, 'DELIVERED', 'tx', 'end'));
  return s;
}

/* ---------- Series compositions: each part of a multi-part book gets its own arrangement ---------- */

const pick = <T>(list: T[], v: number) => list[v % list.length];

function openSmooth(pts: number[][]) {
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
}

function entity(x: number, y: number, w: number, rows: number, r: () => number, hot: boolean): Shape[] {
  const s: Shape[] = [rect(x, y, w, 18 + rows * 16, hot ? 'bxa' : 'bx', 3), path(`M${x} ${f(y + 18)}V${f(y + 3)}q0 -3 3 -3H${x + w - 3}q3 0 3 3V${f(y + 18)}Z`, hot ? 'fa' : 'fl'), rect(x + 8, y + 7, w * 0.42, 4, hot ? 'fn' : 'fi o5')];
  for (let i = 0; i < rows; i++) {
    const yy = y + 18 + i * 16;
    if (i) s.push(path(`M${x} ${f(yy)}H${x + w}`, 'lf'));
    s.push(rect(x + 8, yy + 6, 6, 4, i === 0 ? 'fa' : 'fl', 1), rect(x + 20, yy + 6, between(r, w * 0.3, w * 0.62), 4, 'fl'));
  }
  return s;
}

function cylinder(cx: number, top: number, rx: number, ry: number, h: number, c: string): Shape[] {
  return [
    path(`M${f(cx - rx)} ${f(top)}V${f(top + h)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(top + h)}V${f(top)}`, c),
    path(`M${f(cx - rx)} ${f(top + h / 2)}A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(top + h / 2)}`, 'lf'),
    ellipse(cx, top, rx, ry, c),
  ];
}

/** Databases and Data Models: storage and table, entity-relationship model, replicated stores. */
function database(ctx: Ctx): Shape[] {
  return pick([databaseTable, databaseEr, databaseReplica], ctx.v)(ctx);
}

function databaseEr({ r }: Ctx): Shape[] {
  const t1 = { x: 12, y: f(between(r, 16, 30)), w: 92, rows: 3 }, t2 = { x: 198, y: f(between(r, 10, 22)), w: 94, rows: 4 }, t3 = { x: 104, y: f(between(r, 112, 126)), w: 100, rows: 3 };
  const rels = [
    `M${t1.x + t1.w} ${t1.y + 26}H151V${t2.y + 42}H${t2.x}`,
    `M${t1.x + t1.w / 2} ${t1.y + 18 + t1.rows * 16}V${t3.y + 26}H${t3.x}`,
    `M${t2.x + t2.w / 2} ${t2.y + 18 + t2.rows * 16}V${t3.y + 42}H${t3.x + t3.w}`,
  ];
  const feet = `M${t2.x - 9} ${t2.y + 42}L${t2.x} ${t2.y + 36}M${t2.x - 9} ${t2.y + 42}L${t2.x} ${t2.y + 48}M${t3.x - 9} ${t3.y + 26}L${t3.x} ${t3.y + 20}M${t3.x - 9} ${t3.y + 26}L${t3.x} ${t3.y + 32}M${t3.x + t3.w + 9} ${t3.y + 42}L${t3.x + t3.w} ${t3.y + 36}M${t3.x + t3.w + 9} ${t3.y + 42}L${t3.x + t3.w} ${t3.y + 48}`;
  const hot = Math.floor(r() * 3);
  return [path(rels.join(''), 'ln'), path(rels[hot], 'la an-flow'), path(feet, 'ln'), ...[t1, t2, t3].flatMap((t, i) => entity(t.x, t.y, t.w, t.rows, r, i === hot))];
}

function databaseReplica({ r }: Ctx): Shape[] {
  const nodes = [[58, 34 + between(r, -4, 6)], [246, 34 + between(r, -4, 6)], [152, 116 + between(r, -4, 6)]];
  const links = ['M96 54C130 32 174 32 208 54', 'M246 100C246 136 214 148 190 148', 'M58 100C58 136 90 148 114 148'];
  const live = Math.floor(r() * 3);
  const s: Shape[] = [path(links.join(''), 'ln'), path(links[live], 'la an-flow'), path('M182 143l8 5-8 5M122 143l-8 5 8 5M200 50l8 4-1-9', 'ln')];
  nodes.forEach(([x, y], i) => {
    s.push(...cylinder(x, y, 32, 9, 50, i === live ? 'bxa' : 'bx'));
    s.push(rect(x - 20, y + 16, between(r, 18, 30), 3, 'fl'), circle(x + 20, y + 18, 2.6, cls('fa an-pulse', dl(i * 2))));
  });
  s.push(rect(122, 60, 60, 24, 'bxa', 4), text(146, 76, 'SQL', 'txs', 'middle'), rect(164, 66, 1.5, 12, 'fi an-blink'));
  return s;
}

/** Digital Systems and Integration: service hub, data pipeline, layered architecture. */
function integration(ctx: Ctx): Shape[] {
  return pick([integrationHub, integrationPipeline, integrationLayers], ctx.v)(ctx);
}

function integrationPipeline({ r }: Ctx): Shape[] {
  const y = 136, xs = [42, 116, 190, 264], hot = Math.floor(r() * 4);
  const s: Shape[] = [path('M118 66a14 14 0 0 1 4-27a20 20 0 0 1 37-9a16 16 0 0 1 28 12a13 13 0 0 1 3 24z', 'bxa'), path('M136 56h34M142 47h22', 'lf')];
  s.push(path('M152 66V92H116V114M152 92H190V114', 'ln dsh'), path(`M70 ${y}H236`, 'ln'), path(`M70 ${y}H236`, 'la an-flow'));
  xs.forEach((x, i) => s.push(rect(x - 28, y - 22, 56, 44, i === hot ? 'bxa' : 'bx', 5)));
  s.push(ellipse(42, y - 8, 12, 4, 'ln'), path(`M30 ${y - 8}V${y + 8}A12 4 0 0 0 54 ${y + 8}V${y - 8}`, 'ln'));
  s.push(group('an-spin', [path(gear(116, y, 12, 8.5, 8), 'ln'), circle(116, y, 3, 'fa')]));
  s.push(path(`M190 ${y - 12}V${y + 4}M184 ${y - 2}L190 ${y + 4}L196 ${y - 2}M178 ${y + 6}V${y + 12}H202V${y + 6}`, 'ln'));
  [254, 262, 270].forEach((bx, i) => {
    const h = between(r, 8, 22);
    s.push(group(cls('an-grow', dl(i)), [rect(bx - 3, y + 10 - h, 6, h, i === 2 ? 'fa' : 'fl', 1)]));
  });
  ['SOURCE', 'TRANSFORM', 'LOAD', 'REPORT'].forEach((label, i) => s.push(text(xs[i], y + 36, label, 'tx', 'middle')));
  return s;
}

function integrationLayers({ r }: Ctx): Shape[] {
  const names = ['INTERFACE', 'SERVICES', 'INTEGRATION', 'DATA'], hot = Math.floor(r() * 4), shift = Math.floor(r() * 3);
  const s: Shape[] = [rect(262, 18, 26, 166, 'bxa', 4), path('M110 52V62M110 96V106M110 140V150', 'ln')];
  names.forEach((name, i) => {
    const y = 18 + i * 44;
    s.push(path(`M232 ${y + 17}H262`, 'la an-flow'), rect(28, y, 204, 34, i === hot ? 'bxa' : 'bx', 4), text(40, y + 21, name, 'tx'));
    for (let k = 0; k < 3; k++) s.push(rect(132 + k * 32, y + 10, 24, 14, (k + i + shift) % 3 === 0 ? 'fa' : 'fl', 2));
  });
  s.push(group('an-busy', [circle(275, 30, 4, 'fn')]));
  return s;
}

/** AI and Machine Learning: layered network, attention between tokens. */
function neural(ctx: Ctx): Shape[] {
  return pick([neuralNetwork, neuralAttention], ctx.v)(ctx);
}

function neuralAttention({ r }: Ctx): Shape[] {
  const n = 7, w = 32, gap = 9, x0 = (304 - (n * w + (n - 1) * gap)) / 2;
  const xs = Array.from({ length: n }, (_, i) => x0 + i * (w + gap) + w / 2);
  const focus = Math.floor(r() * n), weights = xs.map(() => r());
  weights[focus] = 2;
  const rank = [...weights.keys()].sort((a, b) => weights[b] - weights[a]);
  const s: Shape[] = [];
  xs.forEach((x, j) => {
    const k = rank.indexOf(j);
    s.push(path(`M${pt([xs[focus], 152])}C${pt([xs[focus], 108])} ${pt([x, 96])} ${pt([x, 52])}`, k < 2 ? cls('la', k === 1 && 'an-draw') : k < 4 ? 'ln' : 'lf', k === 1));
  });
  xs.forEach((x, j) => {
    const k = rank.indexOf(j);
    s.push(rect(x - w / 2, 30, w, 22, k < 2 ? 'bxa' : 'bx', 4), rect(x - 9, 39, 18, 4, 'fl'));
    s.push(rect(x - w / 2, 152, w, 22, j === focus ? 'bxa' : 'bx', 4), rect(x - 9, 161, 18, 4, j === focus ? 'fa an-pulse' : 'fl'));
    s.push(rect(x - w / 2, 184, w, 6, weights[j] > 0.66 ? 'fa' : weights[j] > 0.33 ? 'fl' : 'ff', 1));
  });
  return s;
}

/** Technology (general): dashboard, code editor, connected devices. */
function iface(ctx: Ctx): Shape[] {
  return pick([ifaceDashboard, ifaceCode, ifaceDevices], ctx.v)(ctx);
}

function ifaceCode({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(34, 22, 236, 170, 'bx', 6), path('M34 42H270M64 42V160', 'lf'), circle(46, 32, 3, 'fa'), circle(56, 32, 3, 'fl'), circle(66, 32, 3, 'fl'), rect(78, 27, 50, 10, 'ff', 2)];
  const indent = [0, 1, 2, 2, 1, 2, 3, 2, 1, 0], caret = 2 + Math.floor(r() * 7);
  indent.forEach((d, i) => {
    const y = 51 + i * 10.6, x = 72 + d * 12, a = between(r, 12, 26), b = between(r, 20, 64);
    s.push(rect(42, y, 12, 3, 'fl'), rect(x, y, a, 4, i % 3 === 0 ? 'fa' : 'fs o5', 1), rect(x + a + 5, y, b, 4, 'fl', 1));
    if (i === caret) s.push(rect(x + a + b + 9, y - 2, 1.5, 8, 'fi an-blink'));
  });
  s.push(path('M34 160H270', 'lf'), rect(35, 161, 234, 30, 'ff'), text(44, 180, '>', 'txs'), rect(56, 175, between(r, 40, 110), 4, 'fl', 1), path('M250 174l4 4 8-8', 'la an-pulse'));
  return s;
}

function ifaceDevices({ r }: Ctx): Shape[] {
  const pts = Array.from({ length: 6 }, (_, i) => [44 + i * 24, 122 - i * 8 - r() * 18]), hot = Math.floor(r() * 3);
  const s: Shape[] = [rect(26, 46, 156, 100, 'bx', 5), rect(34, 54, 140, 84, 'ff', 2), path('M14 150H194l-12 12H26Z', 'bx'), path('M90 150h28', 'ln')];
  for (let i = 0; i < 4; i++) s.push(rect(44 + i * 30, 128 - (12 + i * 4), 10, 12 + i * 4, 'fl', 1));
  s.push(path(line(pts), 'la an-draw', true));
  s.push(rect(220, 52, 62, 116, 'bx', 10), rect(226, 64, 50, 92, 'ff', 4), rect(241, 57, 20, 4, 'fl', 2));
  for (let k = 0; k < 3; k++) s.push(rect(232, 72 + k * 26, 38, 18, k === hot ? 'fa' : 'fl', 3));
  s.push(path('M150 34C180 10 230 14 250 44', 'la an-flow'), path('M241 41l9 3 1-9', 'la'), path('M250 178C220 198 170 192 150 166', 'ln dsh'), path('M158 168l-8-2 1 9', 'ln'));
  return s;
}

/** Risk, Compliance and Governance: risk matrix, compliance checklist, secured audit trail. */
function shield(ctx: Ctx): Shape[] {
  return pick([shieldMatrix, shieldChecklist, shieldAudit], ctx.v)(ctx);
}

function shieldChecklist({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(26, 24, 124, 168, 'bx', 6), rect(64, 14, 48, 20, 'bxa', 4), circle(88, 20, 3, 'fa')];
  const done = 3 + Math.floor(r() * 2);
  for (let i = 0; i < 5; i++) {
    const y = 58 + i * 26;
    s.push(rect(40, y - 8, 14, 14, i < done ? 'bxa' : 'bx', 2), rect(64, y - 3, between(r, 40, 72), 4, 'fl'));
    if (i < done) s.push(path(`M43 ${y - 1}l3.5 4 6.5-8`, cls('la an-draw', dl(i)), true));
  }
  const sx = 226, sy = 88;
  s.push(path('M214 112L198 172L210 164L218 178L228 116Z', 'fa'), path('M238 112L254 172L242 164L234 178L224 116Z', 'fa o85'));
  s.push(group('an-spin', [circle(sx, sy, 42, 'la dsh2')]), circle(sx, sy, 34, 'bxa'), circle(sx, sy, 24, 'fa'), path(`M${sx - 10} ${sy}l7 8 14-16`, 'lnode'));
  s.push(text(sx, 196, 'VERIFIED', 'tx', 'middle'));
  return s;
}

function shieldAudit({ r }: Ctx): Shape[] {
  const s: Shape[] = [circle(60, 129, 52, 'la an-ripple'), path('M34 96V72a26 26 0 0 1 52 0V96', 'ln xbold'), rect(22, 94, 76, 70, 'bxa', 8), circle(60, 122, 8, 'fa'), rect(56.5, 126, 7, 18, 'fa', 2), path('M150 20V190', 'ln')];
  const hot = Math.floor(r() * 6);
  let minute = Math.floor(r() * 50);
  for (let i = 0; i < 6; i++) {
    const y = 30 + i * 30;
    minute += 3 + Math.floor(r() * 9);
    s.push(text(140, y + 3, `${String(9 + Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`, 'tx', 'end'));
    s.push(circle(150, y, 5, i === hot ? 'fa an-pulse' : 'bx'), rect(164, y - 6, between(r, 70, 120), 4, i === hot ? 'fa' : 'fl', 1), rect(164, y + 2, between(r, 30, 80), 3, 'ff', 1));
  }
  return s;
}

/** Sales, Marketing and Customer Decisions: conversion funnel, customer journey. */
function funnel(ctx: Ctx): Shape[] {
  return pick([funnelStages, funnelJourney], ctx.v)(ctx);
}

function funnelJourney({ r }: Ctx): Shape[] {
  const p1 = [between(r, 96, 124), between(r, 96, 124)], p2 = [between(r, 176, 204), between(r, 136, 156)];
  const route = `M14 172C60 172 ${f(p1[0] - 40)} ${f(p1[1])} ${pt(p1)}S${f(p2[0] - 40)} ${f(p2[1])} ${pt(p2)}S240 70 268 70`;
  const s: Shape[] = [path(route, 'ln dsh'), path(route, 'la an-draw', true), circle(14, 172, 6, 'fa')];
  s.push(circle(p1[0], p1[1], 14, 'bxa'), rect(p1[0] - 8, p1[1] - 6, 16, 12, 'ln'), path(`M${f(p1[0] - 8)} ${f(p1[1] - 6)}L${f(p1[0])} ${f(p1[1] + 1)}L${f(p1[0] + 8)} ${f(p1[1] - 6)}`, 'ln'));
  s.push(circle(p2[0], p2[1], 14, 'bx'), path(`M${f(p2[0] - 8)} ${f(p2[1] - 7)}h16v11h-9l-4 4v-4h-3z`, 'ln'));
  s.push(text(p1[0], p1[1] + 28, 'REACH', 'tx', 'middle'), text(p2[0], p2[1] + 28, 'ENGAGE', 'tx', 'middle'));
  s.push(circle(268, 62, 22, 'la an-ripple'), ...person(268, 66, 24, 'fa'), path(spark(290, 28, 6), 'fs an-pulse'));
  for (let i = 0; i < 4; i++) {
    const hgt = 14 + i * 9 + r() * 6;
    s.push(group(cls('an-grow', dl(i)), [rect(232 + i * 16, 196 - hgt, 10, hgt, i === 3 ? 'fa' : 'fl', 1)]));
  }
  return s;
}

/** Business (general): compass rose, charted route with waypoints. */
function compass(ctx: Ctx): Shape[] {
  return pick([compassRose, compassRoute], ctx.v)(ctx);
}

function compassRoute({ r }: Ctx): Shape[] {
  let grid = '';
  for (let x = 0; x <= 304; x += 38) grid += `M${x} 0V204`;
  for (let y = 6; y <= 204; y += 38) grid += `M0 ${y}H304`;
  const lake = [between(r, 60, 120), between(r, 30, 70)];
  const lakePts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2, m = 22 + r() * 12;
    return [lake[0] + m * 1.4 * Math.cos(a), lake[1] + m * 0.8 * Math.sin(a)];
  });
  const w = [[24, 176], [between(r, 70, 110), between(r, 120, 156)], [between(r, 150, 190), between(r, 70, 110)], [between(r, 228, 256), between(r, 30, 56)]];
  const route = openSmooth(w);
  const pin = (x: number, y: number, c: string): Shape[] => [path(`M${f(x)} ${f(y)}c-5 -7 -9 -11 -9 -17a9 9 0 0 1 18 0c0 6 -4 10 -9 17z`, c), circle(x, y - 17, 3.2, c === 'fa' ? 'fn' : 'fa')];
  const s: Shape[] = [path(grid, 'lf o5'), path(closedSmooth(lakePts), 'ff'), path(closedSmooth(lakePts), 'lf'), path(route, 'ln dsh'), path(route, 'la an-draw', true), circle(24, 176, 5, 'fa')];
  s.push(...pin(w[1][0], w[1][1], 'bx'), ...pin(w[2][0], w[2][1], 'bx'), circle(w[3][0], w[3][1] - 17, 14, 'la an-ripple'), ...pin(w[3][0], w[3][1], 'fa'));
  s.push(circle(262, 164, 24, 'bx'), path('M262 142v5M262 181v5M240 164h5M279 164h5', 'ln'), group('an-compass', [path('M262 148L267 164L257 164Z', 'fa'), path('M262 180L267 164L257 164Z', 'fl')]), text(262, 136, 'N', 'txa', 'middle'));
  return s;
}

/* ---------- Edited-book illustrations (one per READOS book subject) ---------- */

const arrowHead = (x: number, y: number, dir: 'r' | 'u' | 'd', c = 'la'): Shape =>
  path(dir === 'r' ? `M${x - 5} ${y - 5}L${x} ${y}L${x - 5} ${y + 5}` : dir === 'u' ? `M${x - 5} ${y + 5}L${x} ${y}L${x + 5} ${y + 5}` : `M${x - 5} ${y - 5}L${x} ${y}L${x + 5} ${y - 5}`, c);

function star(cx: number, cy: number, R: number) {
  const p = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? R * 0.45 : R;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  });
  return `${line(p)}Z`;
}

/** Acquisitions, Groups and Investment Accounting: a parent company, its holdings and the consolidated statement. */
function holdings({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const P = [104, 34];
  const pct = [100, 51 + Math.floor(r() * 25), 15 + Math.floor(r() * 10)];
  const kids = [[40, 122], [104, 134], [168, 122]];
  s.push(rect(P[0] - 40, P[1] - 18, 80, 36, 'bxa', 4), rect(P[0] - 26, P[1] - 6, 52, 4, 'fa'), rect(P[0] - 26, P[1] + 3, 34, 3, 'fl'));
  kids.forEach(([x, y], i) => {
    const mid = f((P[1] + 18 + y - 16) / 2);
    s.push(path(`M${P[0]} ${P[1] + 18}V${mid}H${x}V${y - 16}`, i === 0 ? 'la an-flow' : pct[i] > 50 ? 'ln' : 'ln dsh'));
    s.push(rect(x - 28, y - 16, 56, 32, 'bx', 4), rect(x - 18, y - 5, 36, 3, 'fl'), rect(x - 18, y + 3, between(r, 14, 32), 3, 'fl'));
    s.push(text(x + 5, mid + 16, `${pct[i]}%`, 'tx'));
  });
  s.push(path('M40 140V172H168V140M104 152V172', 'lf'), path('M168 172H252V160', 'la an-flow'), arrowHead(252, 156, 'u'));
  s.push(rect(222, 30, 64, 122, 'bx', 4), rect(222, 30, 64, 18, 'fa', 4));
  for (let i = 0; i < 3; i++) s.push(rect(230, 58 + i * 12, between(r, 28, 46), 3, 'fl'));
  for (let i = 0; i < 4; i++) {
    const h = 14 + r() * 26;
    s.push(group(cls('an-grow', dl(i)), [rect(230 + i * 13, 144 - h, 9, h, i === 3 ? 'fa' : 'fl', 1)]));
  }
  return s;
}

/** Investment Appraisal and Business Cases: discounted cash flows and the cumulative line crossing to payback. */
function cashflow({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const x0 = 26, axis = 104, n = 6, w = 26, gap = 14;
  s.push(path(`M${x0 - 8} ${axis}H${x0 + n * (w + gap)}`, 'ln'), path(`M${x0 - 8} 18V196`, 'lf'));
  const flows = [-(70 + r() * 16)];
  for (let i = 1; i < n; i++) flows.push(28 + r() * 22);
  let cum = 0;
  const pts: number[][] = [];
  flows.forEach((v, i) => {
    const x = x0 + i * (w + gap), disc = v > 0 ? v * Math.pow(0.86, i) : v;
    if (v < 0) s.push(rect(x, axis, w, -v, 'fl', 2));
    else s.push(rect(x, axis - v, w, v, 'ff', 2), group(cls('an-grow', dl(i)), [rect(x + 4, axis - disc, w - 8, disc, 'fa', 2)]));
    cum += disc;
    pts.push([x + w / 2, axis - cum * 0.55]);
  });
  s.push(path(line(pts), 'la an-draw', true));
  const cross = pts.findIndex((p) => p[1] <= axis);
  if (cross > 0) s.push(circle(pts[cross][0], pts[cross][1], 4, 'bxa'), circle(pts[cross][0], pts[cross][1], 9, 'la an-ripple'));
  s.push(rect(236, 18, 56, 36, 'bx', 4), text(264, 32, 'NPV', 'tx', 'middle'), text(264, 48, `+${Math.round(cum)}k`, 'txa', 'middle'));
  return s;
}

/** Pricing, Margins and Profitability: a price tag, a margin bar and the break-even crossing. */
function breakeven({ r }: Ctx): Shape[] {
  const s: Shape[] = [group('an-tilt', [path('M20 40H84L104 62L84 84H20Z', 'bxa'), circle(32, 62, 5, 'fn'), text(64, 68, '$', 'txb', 'middle')])];
  s.push(rect(20, 112, 84, 14, 'fl', 2), group('an-growx', [rect(20, 112, between(r, 34, 54), 14, 'fa', 2)]), text(20, 144, 'MARGIN', 'tx'));
  const X0 = 128, Y0 = 186, W = 162, H = 160;
  s.push(path(`M${X0} ${Y0 - H}V${Y0}H${X0 + W}`, 'ln'));
  const fixed = Y0 - 40 - r() * 10, vs = 0.45 + r() * 0.1, rs = 0.95;
  const cost = (x: number) => fixed - (x - X0) * vs, rev = (x: number) => Y0 - (x - X0) * rs;
  const bx = X0 + (Y0 - fixed) / (rs - vs);
  s.push(path(`M${X0} ${f(fixed)}H${X0 + W}`, 'lf dsh'), path(`M${X0} ${f(fixed)}L${X0 + W} ${f(cost(X0 + W))}`, 'ln'));
  s.push(path(`M${f(bx)} ${f(rev(bx))}L${X0 + W} ${f(rev(X0 + W))}L${X0 + W} ${f(cost(X0 + W))}Z`, 'fa o3'));
  s.push(path(`M${X0} ${Y0}L${X0 + W} ${f(rev(X0 + W))}`, 'la an-draw', true));
  s.push(path(`M${f(bx)} ${f(rev(bx))}V${Y0}`, 'cl'), circle(bx, rev(bx), 4.5, 'bxa'), circle(bx, rev(bx), 10, 'la an-ripple'));
  return s;
}

/** Booms, Bubbles and Business Cycles: a cycle that overshoots its trend, with bubbles rising off the peak. */
function boomBust({ r }: Ctx): Shape[] {
  const ph = r();
  const pts = Array.from({ length: 9 }, (_, i) => [16 + i * 34, 150 - Math.sin(i * 0.9 + ph) * 26 - (i === 5 ? 50 : i === 4 || i === 6 ? 18 : 0) - i * 3]);
  const s: Shape[] = [path('M16 158L288 124', 'lf dsh'), path(openSmooth(pts), 'ln'), path(openSmooth(pts), 'la an-draw', true)];
  const peak = pts[5];
  for (let k = 0; k < 6; k++) s.push(circle(peak[0] - 18 + k * 7 + r() * 6, peak[1] - 4, 3 + r() * 5, cls('ln an-bubble', dl(k))));
  s.push(path(spark(peak[0] + 4, Math.max(18, peak[1] - 52), 9), 'fa an-pulse'));
  s.push(path('M16 196H288', 'ln'));
  for (let i = 0; i < 9; i++) {
    const h = 4 + r() * 14 + (i === 5 ? 10 : 0);
    s.push(rect(20 + i * 32, 196 - h, 14, h, i === 5 ? 'fa' : 'fl', 1));
  }
  return s;
}

/** Commercial Law, Contracts and Disputes: balanced scales beside a signed and sealed contract. */
function scales({ r }: Ctx): Shape[] {
  const cx = 102;
  const pan = (x: number, load: boolean): Shape[] => [
    path(`M${x} 46L${x - 22} 104M${x} 46L${x + 22} 104`, 'lf'), path(`M${x - 28} 104Q${x} 122 ${x + 28} 104Z`, 'bx'),
    load ? rect(x - 12, 92, 24, 10, 'fa', 2) : circle(x, 98, 6, 'fl'),
  ];
  const s: Shape[] = [path(`M${cx} 30V172M${cx - 34} 182H${cx + 34}M${cx - 20} 172H${cx + 20}`, 'ln wide'), circle(cx, 26, 6, 'fa')];
  s.push(group('an-balance', [path(`M${cx - 72} 46H${cx + 72}`, 'ln xbold'), ...pan(cx - 72, true), ...pan(cx + 72, false)]));
  const dx = 212, dy = f(between(r, 26, 38));
  s.push(path(`M${dx} ${dy}H${dx + 56}L${dx + 70} ${dy + 14}V${dy + 142}H${dx}Z`, 'bx'), path(`M${dx + 56} ${dy}V${dy + 14}H${dx + 70}`, 'ln'));
  for (let i = 0; i < 6; i++) s.push(rect(dx + 10, dy + 26 + i * 14, between(r, 30, 52), 3, i === 0 ? 'fa' : 'fl'));
  s.push(path(`M${dx + 10} ${dy + 124}c8 -10 14 6 22 -4s10 6 18 -2`, 'la an-draw', true), circle(dx + 56, dy + 118, 9, 'fa'), circle(dx + 56, dy + 118, 14, 'la an-ripple'));
  return s;
}

/** Procurement and Tendering: three quotes, their evaluation scores and the selected offer. */
function tender({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const win = Math.floor(r() * 3);
  for (let i = 0; i < 3; i++) {
    const x = 18 + i * 62, y = 26 + Math.abs(1 - i) * 10;
    s.push(rect(x, y, 54, 78, i === win ? 'bxa' : 'bx', 4), rect(x + 8, y + 10, 30, 4, i === win ? 'fa' : 'fl'));
    for (let k = 0; k < 3; k++) s.push(rect(x + 8, y + 22 + k * 10, between(r, 20, 38), 3, 'fl'));
    s.push(text(x + 27, y + 68, `$${Math.round(between(r, 40, 90))}k`, 'tx', 'middle'));
  }
  s.push(path('M18 128V188H200', 'ln'));
  for (let i = 0; i < 3; i++) {
    const h = i === win ? 52 : 18 + r() * 24;
    s.push(group(cls('an-grow', dl(i)), [rect(32 + i * 62, 188 - h, 26, h, i === win ? 'fa' : 'fl', 2)]));
  }
  s.push(path(`M${18 + win * 62 + 54} 62Q206 62 218 76`, 'la an-flow'));
  s.push(circle(252, 92, 32, 'bxa'), path('M237 92l10 11 20-24', 'la xbold an-draw', true), circle(252, 92, 40, 'la an-ripple'));
  return s;
}

/** Suppliers, Contractors and Government Work: suppliers linked into a delivery chain that reaches the site. */
function supply({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  [40, 96, 152].forEach((y, i) => s.push(rect(14, y - 18, 58, 36, i === 1 ? 'bxa' : 'bx', 4), rect(24, y - 6, between(r, 28, 38), 3, 'fl'), rect(24, y + 3, between(r, 18, 32), 3, 'fl')));
  s.push(path('M72 40C100 40 100 96 122 96M72 152C100 152 100 96 122 96', 'ln'), path('M72 96H122', 'la an-flow'));
  for (let k = 0; k < 3; k++) s.push(ellipse(136 + k * 16, 96, 11, 7, k % 2 ? 'la' : 'ln'));
  s.push(path('M118 182H290', 'ln'), path('M118 192H290', 'lf dsh'));
  s.push(group('an-convey', [rect(122, 154, 34, 22, 'bx', 2), path('M156 160h12l8 9v7h-20z', 'bxa'), circle(132, 178, 5, 'fi'), circle(164, 178, 5, 'fi')]));
  s.push(path('M222 62L256 40L290 62V132H222Z', 'bx'), rect(234, 78, 14, 14, 'fl'), rect(264, 78, 14, 14, 'fl'), rect(249, 104, 16, 28, 'fa'));
  s.push(path('M186 96H216', 'la'), arrowHead(216, 96, 'r'));
  return s;
}

/** Project Estimates, Schedules and Costs: an S-curve inside its widening uncertainty band, with P10–P90 ranges. */
function estimate({ r }: Ctx): Shape[] {
  const X0 = 22, Y0 = 186, W = 192, H = 160;
  const sc = (t: number) => 1 / (1 + Math.exp(-9 * (t - 0.5)));
  const mid = Array.from({ length: 11 }, (_, i) => [X0 + (W * i) / 10, Y0 - H * 0.8 * sc(i / 10)]);
  const up = mid.map(([x, y], i) => [x, y - (i / 10) ** 1.4 * 30]), lo = mid.map(([x, y], i) => [x, Math.min(Y0, y + (i / 10) ** 1.4 * 30)]);
  const s: Shape[] = [path(`M${X0} ${Y0 - H}V${Y0}H${X0 + W + 8}`, 'ln'), path(`${line(up)}L${[...lo].reverse().map(pt).join('L')}Z`, 'ff')];
  s.push(path(line(up), 'lf dsh'), path(line(lo), 'lf dsh'), path(line(mid), 'la an-draw', true));
  const tx = X0 + W * between(r, 0.4, 0.62);
  s.push(path(`M${f(tx)} ${Y0 - H}V${Y0}`, 'cl'), circle(tx, Y0 - H * 0.8 * sc((tx - X0) / W), 4, 'fa an-pulse'));
  for (let i = 0; i < 3; i++) {
    const y = 46 + i * 46, a = 232 + r() * 6, b = a + 30 + r() * 20, m = (a + b) / 2 + between(r, -6, 6);
    s.push(path(`M${f(a)} ${y}H${f(b)}M${f(a)} ${y - 6}V${y + 6}M${f(b)} ${y - 6}V${y + 6}`, 'ln'), circle(m, y, 4.5, cls('fa an-pulse', dl(i))));
  }
  s.push(text(262, 190, 'P10–P90', 'tx', 'middle'));
  return s;
}

/** Project Sponsors, Governance and Decisions: stage gates along the route, one opening on a go decision. */
function gates({ r }: Ctx): Shape[] {
  const s: Shape[] = [path('M12 150H292', 'ln'), path('M12 150H292', 'la an-flow o5')];
  const open = 1 + Math.floor(r() * 2);
  for (let i = 0; i < 4; i++) {
    const x = 52 + i * 64;
    s.push(rect(x - 4, 96, 8, 54, 'bx', 2), text(x, 170, `G${i + 1}`, 'tx', 'middle'));
    if (i < open) s.push(path(`M${x} 100L${x + 24} 64`, 'la xbold'));
    else if (i === open) s.push(group('an-swing', [path(`M${x} 100H${x + 44}`, 'ln xbold'), rect(x + 14, 97, 8, 6, 'fa')]));
    else s.push(path(`M${x} 100H${x + 44}`, 'ln xbold'), rect(x + 14, 97, 8, 6, 'fl'));
  }
  s.push(...person(between(r, 22, 30), 128, between(r, 14, 16), 'fa'));
  s.push(path('M262 14L286 38L262 62L238 38Z', 'bxa'), text(262, 42, 'GO', 'txs', 'middle'), path('M262 62V84', 'la an-flow'));
  return s;
}

/** From Approval to Benefits: an approved case, the handover key and the benefits curve that follows. */
function handover({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(16, 22, 64, 86, 'bx', 4)];
  for (let i = 0; i < 4; i++) s.push(rect(26, 34 + i * 11, between(r, 26, 44), 3, i === 0 ? 'fa' : 'fl'));
  s.push(circle(62, 88, 13, 'bxa'), path('M55 88l5 5 9-10', 'la wide'));
  s.push(group('an-bob', [circle(116, 64, 12, 'la'), circle(116, 64, 4, 'fn'), path('M128 64H166M154 64v10M162 64v7', 'la wide')]));
  s.push(path('M196 30L241 12L286 30V108H196Z', 'bx'));
  for (let i = 0; i < 6; i++) s.push(rect(206 + (i % 3) * 26, 40 + Math.floor(i / 3) * 26, 16, 16, cls(i === 4 ? 'fa' : 'fl', 'an-pulse', dl(i))));
  s.push(path('M16 192H290', 'ln'), path('M16 130V192', 'lf'));
  const k = 6 + r() * 3;
  const pts = Array.from({ length: 9 }, (_, i) => [16 + i * 34, 188 - (i < 3 ? 2 : (i - 2) ** 1.25 * k)]);
  s.push(path(openSmooth(pts), 'la an-draw', true), path('M118 128V192', 'cl'), text(124, 140, 'HANDOVER', 'tx'));
  return s;
}

/** Growth, Business Models and New Markets: a business model canvas feeding widening market rings. */
function expansion({ r }: Ctx): Shape[] {
  const gx = 14, gy = 28, gw = 120, gh = 100;
  const s: Shape[] = [rect(gx, gy, gw, gh, 'bx', 3)];
  s.push(path(`M${gx + 24} ${gy}V${gy + 70}M${gx + 48} ${gy}V${gy + 70}M${gx + 72} ${gy}V${gy + 70}M${gx + 96} ${gy}V${gy + 70}M${gx} ${gy + 70}H${gx + gw}M${gx + 60} ${gy + 70}V${gy + gh}M${gx + 24} ${gy + 35}H${gx + 48}M${gx + 72} ${gy + 35}H${gx + 96}`, 'lf'));
  s.push(rect(gx + 49.5, gy + 1.5, 21, 67, 'fa o85', 2), text(gx, 148, 'MODEL', 'tx'), rect(gx, 158, 90, 4, 'fl'), rect(gx, 168, 64, 4, 'fl'));
  const cx = 214, cy = 112;
  for (let k = 1; k <= 3; k++) s.push(circle(cx, cy, 22 * k, k === 3 ? 'lf dsh' : 'lf'));
  s.push(circle(cx, cy, 22, 'la an-ripple'), circle(cx, cy, 10, 'fa'));
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = 28 + r() * 36;
    s.push(circle(cx + d * Math.cos(a), cy + d * Math.sin(a), 3, cls(d > 46 ? 'fl' : 'fs', 'an-pulse', dl(i))));
  }
  for (const a of [-0.6, 0.3, 1.4]) s.push(path(`M${pt([cx + 24 * Math.cos(a), cy + 24 * Math.sin(a)])}L${pt([cx + 72 * Math.cos(a), cy + 72 * Math.sin(a)])}`, 'la an-flow'));
  s.push(path('M136 78H164', 'la'), arrowHead(164, 78, 'r'));
  return s;
}

/** Marketing, Brands and Customer Experience: a megaphone reaching customers who rate the experience. */
function megaphone({ r }: Ctx): Shape[] {
  const s: Shape[] = [group('an-tilt', [path('M40 84H64L126 48V152L64 116H40Z', 'bxa'), rect(28, 86, 12, 28, 'bx', 2), path('M60 116L70 148H84L78 116', 'bx')])];
  const wo = between(r, -4, 4);
  for (let k = 0; k < 3; k++) s.push(path(`M${146 + k * 18} ${f(70 - k * 8 + wo)}Q${164 + k * 22} 100 ${146 + k * 18} ${f(130 + k * 8 - wo)}`, cls('la an-pulse', dl(k * 2))));
  const lit = 3 + Math.floor(r() * 2);
  for (let i = 0; i < 5; i++) s.push(path(star(178 + i * 26, 182, 10), i < lit ? cls('fa an-pulse', dl(i)) : 'bx'));
  s.push(rect(224, 18, 66, 42, 'bx', 8), path('M238 60l-4 12 14-12', 'bx'), path('M257 34c-6-7-16 0-8 9l8 7 8-7c8-9-2-16-8-9z', 'fa'));
  return s;
}

/** Communication and Professional Presence: two people in conversation, with the voice between them. */
function dialogue({ r }: Ctx): Shape[] {
  const s: Shape[] = [...person(54, 160, 30, 'bx'), ...person(250, 160, 30, 'bxa')];
  s.push(group('an-up', [rect(18, 26, 118, 52, 'bx', 12), path('M48 78l-6 16 22-16', 'bx'), rect(34, 42, between(r, 60, 86), 4, 'fl'), rect(34, 54, between(r, 40, 70), 4, 'fl')]));
  s.push(group('an-down', [rect(168, 44, 118, 52, 'bxa', 12), path('M252 96l8 16-22-16', 'bxa'), rect(184, 60, between(r, 60, 86), 4, 'fa'), rect(184, 72, between(r, 40, 70), 4, 'fl')]));
  for (let i = 0; i < 9; i++) {
    const h = 6 + Math.abs(Math.sin(i * 1.3 + r())) * 34;
    s.push(group(cls('an-grow', dl(i)), [rect(110 + i * 10, 150 - h / 2, 5, h, i % 3 === 1 ? 'fa' : 'fl', 2)]));
  }
  return s;
}

/** Leading People and Change: a leader setting the route up the slope, with the team following. */
function summit({ r }: Ctx): Shape[] {
  const s: Shape[] = [path('M8 196L120 92L168 128L236 42L298 196Z', 'ff'), path('M8 196L120 92L168 128L236 42L298 196', 'ln')];
  const trail = [[30, 188], [82, 166 + between(r, -5, 5)], [132, 152 + between(r, -5, 5)], [182, 122 + between(r, -5, 5)], [214, 82], [236, 46]];
  s.push(path(openSmooth(trail), 'ln dsh'), path(openSmooth(trail), 'la an-draw', true));
  s.push(path('M236 42V8', 'ln wide'), group('an-wave', [path('M236 9h30l-8 8 8 8h-30z', 'fa')]));
  const ppl = [{ x: 198, y: 106, z: 12, c: 'fa' }, { x: 160, y: 136, z: 10, c: 'bx' }, { x: 120, y: 152, z: 10, c: 'bx' }, { x: 80, y: 166, z: 10, c: between(r, 0, 1) > 0.5 ? 'bxa' : 'bx' }];
  ppl.forEach((p, i) => s.push(group(cls('an-bob', dl(i)), person(p.x, p.y, p.z, p.c))));
  return s;
}

/** Careers, Confidence and Personal Effectiveness: rising steps towards a goal. */
function ladder({ r }: Ctx): Shape[] {
  let d = 'M18 190';
  for (let i = 0; i < 5; i++) d += `H${40 + i * 48}V${190 - (i + 1) * 30}`;
  d += 'H290V190Z';
  const s: Shape[] = [path(d, 'ff'), path(d, 'ln')];
  const at = 1 + Math.floor(r() * 3);
  s.push(group('an-bob', person(64 + at * 48, 190 - (at + 1) * 30 - 9, 13, 'fa')));
  s.push(path('M40 150Q120 40 240 30', 'la an-flow o5'));
  const gx = between(r, 258, 272);
  s.push(circle(gx, 22, 15, 'bxa'), circle(gx, 22, 8, 'la'), circle(gx, 22, 3, 'fa an-pulse'), circle(gx, 22, 21, 'la an-ripple'));
  return s;
}

/** Work Habits That Stick: a month of completed days and the cue, routine and reward loop. */
function streak({ r }: Ctx): Shape[] {
  const x0 = 16, y0 = 32, c = 22;
  const s: Shape[] = [rect(x0 - 6, y0 - 22, 7 * c + 12, 4 * c + 30, 'bx', 4), rect(x0 - 6, y0 - 22, 7 * c + 12, 16, 'fa', 4)];
  const done = 14 + Math.floor(r() * 8);
  for (let k = 0; k < 28; k++) {
    const x = x0 + (k % 7) * c, y = y0 + Math.floor(k / 7) * c;
    s.push(rect(x + 2, y + 2, c - 4, c - 4, k < done ? 'fl' : 'ff', 3));
    if (k < done) s.push(path(`M${x + 6} ${y + 11}l4 4 7-8`, cls('la', k === done - 1 && 'an-pulse')));
  }
  const cx = 236, cy = 112, R = f(between(r, 40, 46));
  s.push(circle(cx, cy, R, 'lf'), path(`M${cx} ${cy - R}A${R} ${R} 0 1 1 ${cx - R} ${cy}`, 'la an-draw', true));
  ['CUE', 'ROUTINE', 'REWARD'].forEach((t, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    s.push(circle(x, y, 7, i === 2 ? 'fa' : 'bx'), text(x, y + (i === 0 ? -12 : 20), t, 'tx', 'middle'));
  });
  s.push(text(x0 - 6, 150 + 24, `${done} DAYS`, 'tx'));
  return s;
}

/** Sustainability and Environmental Management: a leaf inside a closed loop, beside a turning wind turbine. */
function leaf({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  const cx = 108, cy = 104, R = 72;
  for (let k = 0; k < 3; k++) {
    const a0 = (k * 2 * Math.PI) / 3 + 0.25, a1 = a0 + 1.55;
    const p0 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)], p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)];
    const t = [-Math.sin(a1), Math.cos(a1)], n = [Math.cos(a1), Math.sin(a1)];
    s.push(path(`M${pt(p0)}A${R} ${R} 0 0 1 ${pt(p1)}`, cls('la wide', k === 0 && 'an-flow')));
    s.push(path(`M${pt([p1[0] + 7 * n[0], p1[1] + 7 * n[1]])}L${pt([p1[0] + 10 * t[0], p1[1] + 10 * t[1]])}L${pt([p1[0] - 7 * n[0], p1[1] - 7 * n[1]])}`, 'la wide'));
  }
  const tilt = between(r, -6, 6);
  s.push(group(undefined, [path(`M${cx - 30} ${cy + 30}C${cx - 36} ${cy - 30} ${cx + 10} ${cy - 46} ${cx + 34} ${cy - 36}C${cx + 40} ${cy + 6} ${cx + 4} ${cy + 40} ${cx - 30} ${cy + 30}Z`, 'fa'), path(`M${cx - 30} ${cy + 30}Q${cx} ${cy - 2} ${cx + 30} ${cy - 32}`, 'ln')], `rotate(${f(tilt)} ${cx} ${cy})`));
  const hx = 250, hy = 78;
  s.push(path(`M${hx} ${hy}L${hx - 6} 192H${hx + 6}Z`, 'bx'), path('M214 192H288', 'ln'));
  const blades: Shape[] = [circle(hx, hy, 44, 'lf o15')];
  for (let k = 0; k < 3; k++) {
    const a = (k * 2 * Math.PI) / 3 - Math.PI / 2, tip = [hx + 42 * Math.cos(a), hy + 42 * Math.sin(a)], side = [hx + 12 * Math.cos(a + 0.5), hy + 12 * Math.sin(a + 0.5)];
    blades.push(path(`M${hx} ${hy}L${pt(side)}L${pt(tip)}Z`, 'bx'));
  }
  s.push(group('an-spin', blades), circle(hx, hy, 5, 'fi'));
  return s;
}

/** Records, Business Data and Learning from Results: an open filing drawer, a record timeline and a new insight. */
function archive({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(18, 28, 92, 158, 'bx', 4)];
  for (let i = 0; i < 3; i++) {
    const y = 38 + i * 49;
    if (i === 1) {
      s.push(rect(40, y, 80, 40, 'bxa', 3), rect(68, y + 16, 24, 6, 'fl', 3));
      for (let k = 0; k < 4; k++) s.push(rect(46 + k * 18, y - 10, 14, 12, cls(k === 2 ? 'fa' : 'fl', k === 2 && 'an-pulse'), 2));
    } else s.push(rect(26, y, 76, 40, 'ff', 3), rect(52, y + 16, 24, 6, 'fl', 3));
  }
  s.push(path('M150 28V186', 'ln'));
  for (let i = 0; i < 5; i++) {
    const y = 38 + i * 34;
    s.push(circle(150, y, 5, i === 4 ? 'fa' : 'bx'), rect(164, y - 8, i === 0 ? 72 : between(r, 70, 112), 16, i === 4 ? 'bxa' : 'bx', 3), rect(172, y - 2, between(r, 28, 52), 3, 'fl'));
  }
  s.push(circle(274, 30, 13, 'bxa'), rect(268, 45, 12, 7, 'bx', 1), path('M274 10v-5M258 18l-4-3M290 18l4-3', 'la an-pulse'));
  return s;
}

/** SQL, Queries and Data Correctness: two sets joined on a key, returning checked result rows. */
function join({ r }: Ctx): Shape[] {
  const A = [70, 82], B = [126, 82], R = 50;
  const s: Shape[] = [circle(A[0], A[1], R, 'bx'), circle(B[0], B[1], R, 'bx o85')];
  const dx = (B[0] - A[0]) / 2, h = Math.sqrt(R * R - dx * dx), mx = (A[0] + B[0]) / 2;
  s.push(path(`M${mx} ${f(A[1] - h)}A${R} ${R} 0 0 1 ${mx} ${f(A[1] + h)}A${R} ${R} 0 0 1 ${mx} ${f(A[1] - h)}Z`, 'fa o85'));
  s.push(text(A[0] - 24, A[1] + 5, 'A', 'txb', 'middle'), text(B[0] + 24, B[1] + 5, 'B', 'txb', 'middle'));
  s.push(rect(18, 152, 168, 28, 'bx', 4), text(28, 170, 'SELECT … JOIN … ON KEY', 'txs'), rect(150 + Math.round(r() * 20), 162, 1.5, 11, 'fi an-blink'));
  const tx = 206, ty = 26, rows = 5;
  s.push(rect(tx, ty, 84, 20 + rows * 22, 'bx', 3), rect(tx, ty, 84, 20, 'fa', 3));
  for (let i = 0; i < rows; i++) {
    const y = ty + 20 + i * 22;
    if (i) s.push(path(`M${tx} ${y}H${tx + 84}`, 'lf'));
    s.push(rect(tx + 10, y + 9, between(r, 26, 44), 4, 'fl'), path(`M${tx + 64} ${y + 11}l4 4 7-8`, cls('la an-pulse', dl(i))));
  }
  s.push(path('M178 82H200', 'la an-flow'), arrowHead(200, 82, 'r'));
  return s;
}

/** Database Performance, Concurrency and Safe Change: concurrent transactions, the lock they contend for, and the clock. */
function locks({ r }: Ctx): Shape[] {
  const s: Shape[] = [];
  [52, 104, 156].forEach((y, i) => {
    s.push(path(`M16 ${y}H226`, 'lf'), text(16, y - 12, `T${i + 1}`, 'tx'));
    let x = 40 + r() * 16;
    for (let k = 0; k < 3 && x < 196; k++) {
      const w = 26 + r() * 22;
      s.push(group(cls('an-growx', dl(i * 3 + k)), [rect(x, y - 9, Math.min(w, 226 - x), 18, k === 1 && i === 1 ? 'fa' : 'fl', 3)]));
      x += w + 10 + r() * 8;
    }
  });
  s.push(rect(112, 68, 30, 24, 'bxa', 4), path('M118 68v-8a9 9 0 0 1 18 0v8', 'la wide'), circle(127, 80, 3, 'fa'));
  const cx = 262, cy = 118, R = 28;
  let ticks = '';
  for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; ticks += `M${pt([cx + (R - 4) * Math.cos(a), cy + (R - 4) * Math.sin(a)])}L${pt([cx + (R - (k % 3 ? 7 : 10)) * Math.cos(a), cy + (R - (k % 3 ? 7 : 10)) * Math.sin(a)])}`; }
  s.push(circle(cx, cy, R, 'bx'), rect(cx - 6, cy - R - 8, 12, 7, 'fl', 2), path(ticks, 'ln'), group('an-arm', [path(`M${cx} ${cy}H${cx + R - 8}`, 'la wide')]), circle(cx, cy, 3.5, 'fa'));
  return s;
}

/** Reporting, History and Analytical Data: a data cube sliced by time, beside its reports. */
function cube({ r }: Ctx): Shape[] {
  const cx = 110, cy = 102, S = 64, w = S * 0.87;
  const fc = cubeFaces(cx, cy, S);
  const s: Shape[] = [path(fc.top, 'ff'), path(fc.left, 'bx'), path(fc.right, 'bx')];
  let g = '';
  for (let k = 1; k < 3; k++) {
    const t = k / 3;
    g += `M${pt([cx - w + w * t, cy - S / 2 + (S / 2) * t])}L${pt([cx - w + w * t, cy + S / 2 + (S / 2) * t])}`;
    g += `M${pt([cx + w * t, cy - (S / 2) * t])}L${pt([cx + w * t, cy + S - (S / 2) * t])}`;
    g += `M${pt([cx - w, cy - S / 2 + S * t])}L${pt([cx, cy + S * t])}L${pt([cx + w, cy - S / 2 + S * t])}`;
  }
  s.push(path(g, 'lf'));
  const t0 = Math.floor(r() * 3) / 3, t1 = t0 + 1 / 3;
  s.push(path(`M${pt([cx + w * t0, cy - (S / 2) * t0])}L${pt([cx + w * t1, cy - (S / 2) * t1])}L${pt([cx + w * t1, cy + S - (S / 2) * t1])}L${pt([cx + w * t0, cy + S - (S / 2) * t0])}Z`, 'fa o85 an-pulse'));
  s.push(text(cx - w, cy + S / 2 + 28, 'REGION', 'tx'), text(cx + w, cy + S / 2 + 20, 'TIME', 'tx', 'end'), text(cx, cy - S - 8, 'PRODUCT', 'tx', 'middle'));
  s.push(rect(214, 26, 76, 66, 'bx', 4), path(line(Array.from({ length: 6 }, (_, i) => [224 + i * 11, 80 - i * 7 - r() * 10])), 'la an-draw', true));
  s.push(rect(214, 108, 76, 72, 'bx', 4));
  for (let i = 0; i < 4; i++) {
    const h = 14 + r() * 36;
    s.push(group(cls('an-grow', dl(i)), [rect(224 + i * 16, 170 - h, 10, h, i === 2 ? 'fa' : 'fl', 1)]));
  }
  return s;
}

/** 3D CAD Modelling and Design Intent: an isometric bracket solid, its view rotation and the model axes. */
function isoSolid({ r }: Ctx): Shape[] {
  const iso = (x: number, y: number, z: number) => [150 + (x - y) * 0.87, 118 + (x + y) * 0.5 - z];
  const P = (pts: number[][]) => `${line(pts.map(([x, y, z]) => iso(x, y, z)))}Z`;
  const L = 80, W = 50, T = 14, H = 66 + r() * 8;
  const s: Shape[] = [path(P([[0, 0, T], [L, 0, T], [L, W, T], [0, W, T]]), 'ff')];
  s.push(path(P([[0, W, 0], [L, W, 0], [L, W, T], [0, W, T]]), 'bx'), path(P([[L, 0, 0], [L, W, 0], [L, W, T], [L, 0, T]]), 'bx'));
  s.push(path(P([[0, T, T], [L, T, T], [L, T, H], [0, T, H]]), 'bx'), path(P([[0, 0, H], [L, 0, H], [L, T, H], [0, T, H]]), 'ff'), path(P([[L, 0, T], [L, T, T], [L, T, H], [L, 0, H]]), 'bx'));
  const hc = iso(L / 2, T, (T + H) / 2 + 4);
  s.push(group(undefined, [ellipse(hc[0], hc[1], 9, 15, 'fn'), ellipse(hc[0], hc[1], 9, 15, 'la')], `rotate(-30 ${f(hc[0])} ${f(hc[1])})`));
  const e0 = iso(L, W, T), e1 = iso(L, W, 0);
  s.push(path(`M${pt(e0)}L${pt(e1)}`, 'la an-draw', true));
  s.push(path('M44 52A112 38 0 0 1 256 52', 'la an-flow'), path('M248 44l8 8-11 3', 'la'));
  s.push(path('M28 188l22-12M28 188V160M28 188l-20-12', 'ln'), text(54, 178, 'X', 'tx'), text(24, 154, 'Z', 'tx'), text(4, 178, 'Y', 'tx'));
  return s;
}

/** Decision-Making Machines: an agent searching a grid world for the goal, with its action values. */
function search({ r }: Ctx): Shape[] {
  const c = 24, x0 = 14, y0 = 18, n = 7;
  let grid = '';
  for (let i = 0; i <= n; i++) grid += `M${x0 + i * c} ${y0}V${y0 + n * c}M${x0} ${y0 + i * c}H${x0 + n * c}`;
  const route: number[][] = [[0, n - 1]];
  while (route.length < 40) {
    const [i, j] = route[route.length - 1];
    if (i === n - 1 && j === 0) break;
    route.push(i < n - 1 && (j === 0 || r() > 0.5) ? [i + 1, j] : [i, j - 1]);
  }
  const onRoute = new Set(route.map(([i, j]) => `${i},${j}`));
  const s: Shape[] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (onRoute.has(`${i},${j}`)) continue;
    const v = r();
    if (v < 0.16) s.push(rect(x0 + i * c + 2, y0 + j * c + 2, c - 4, c - 4, 'fl', 2));
    else if (v < 0.42) s.push(rect(x0 + i * c + 2, y0 + j * c + 2, c - 4, c - 4, 'ff', 2));
  }
  s.unshift(path(grid, 'lf'));
  const centres = route.map(([i, j]) => [x0 + i * c + c / 2, y0 + j * c + c / 2]);
  s.push(path(line(centres), 'la an-draw', true));
  const [sx, sy] = centres[0], [gx, gy] = centres[centres.length - 1];
  s.push(circle(sx, sy, 7, 'fa'), circle(sx, sy, 12, 'la an-ripple'), path(`M${gx - 4} ${gy + 8}V${gy - 9}l11 4-11 4`, 'la'));
  ['↑', '→', '↓', '←'].forEach((a, i) => {
    const h = i === 1 ? 64 : 14 + r() * 34;
    s.push(group(cls('an-grow', dl(i)), [rect(204 + i * 22, 168 - h, 14, h, i === 1 ? 'fa' : 'fl', 2)]), text(211 + i * 22, 184, a, 'tx', 'middle'));
  });
  s.push(path('M198 168H290', 'ln'), text(244, 34, 'VALUE', 'tx', 'middle'));
  return s;
}

/** Project Delivery, Procurement and Governance: a tower crane lifting into a rising building frame. */
function crane({ r }: Ctx): Shape[] {
  let lattice = '';
  for (let y = 30; y < 196; y += 16) lattice += `M58 ${y}L74 ${y + 16}M74 ${y}L58 ${y + 16}`;
  const s: Shape[] = [path('M58 196V30M74 196V30', 'ln'), path(lattice, 'lf'), path('M30 30H288M66 12L58 30M66 12L74 30M66 12L288 30M66 12L30 30', 'ln'), rect(28, 30, 22, 16, 'bx', 2), path('M40 196H92', 'ln wide')];
  const tx = f(between(r, 120, 150));
  s.push(group('an-slosh', [rect(tx - 8, 30, 16, 8, 'fa'), path(`M${tx} 38V90`, 'ln'), group('an-bob', [rect(tx - 14, 90, 28, 16, 'bxa', 2)])]));
  const floors = 3 + Math.floor(r() * 2);
  for (let i = 0; i < floors; i++) {
    const y = 196 - (i + 1) * 26;
    s.push(group(cls('an-build', dl(i)), [path(`M196 ${y + 26}V${y}H284V${y + 26}M226 ${y}V${y + 26}M254 ${y}V${y + 26}`, i === floors - 1 ? 'la' : 'ln'), path(`M196 ${y + 26}L226 ${y}`, 'lf')]));
  }
  s.push(path('M290 196H180', 'ln'), path(`M284 ${196 - floors * 26}V${180 - floors * 26}`, 'ln'), path(`M284 ${180 - floors * 26}h-16l5 4-5 4h16`, 'fa'));
  return s;
}

/** Machine Elements and Mechanical Design: meshing gears, a shaft in its bearing and a bolted joint. */
function geartrain({ r }: Ctx): Shape[] {
  const g1 = [90, 92], g2 = [90 + 84 * Math.cos(-0.35), 92 + 84 * Math.sin(-0.35)];
  const s: Shape[] = [path(gear(g1[0], g1[1], 56, 48, 18), 'bx an-spin'), circle(g1[0], g1[1], 15, 'fn'), circle(g1[0], g1[1], 15, 'ln'), circle(g1[0], g1[1], 5, 'fa')];
  s.push(path(gear(g2[0], g2[1], 36, 28, 12), 'bxa an-spin-r'), circle(g2[0], g2[1], 9, 'fn'), circle(g2[0], g2[1], 9, 'ln'), rect(g2[0] - 2, g2[1] - 12, 4, 6, 'fa'));
  const sy = f(166 + r() * 6);
  s.push(rect(186, sy - 6, 106, 12, 'bx', 2), rect(212, sy - 22, 26, 44, 'bxa', 3), path(`M216 ${sy - 14}H234M216 ${sy + 14}H234`, 'lf'));
  for (let k = 0; k < 3; k++) s.push(circle(219 + k * 6, sy - 10, 2.4, cls('fa an-pulse', dl(k))), circle(219 + k * 6, sy + 10, 2.4, cls('fa an-pulse', dl(k + 3))));
  s.push(rect(10, 170, 18, 24, 'bx', 2), rect(28, 176, 70, 12, 'bx', 1));
  let thread = '';
  for (let x = 46; x < 96; x += 6) thread += `M${x} 176l-4 12`;
  s.push(path(thread, 'lf'), path('M120 182H170', 'cl'));
  return s;
}

/** Fluids, HVAC and Building Services: a pump driving a loop through a coil, and a ventilation fan. */
function pump({ r }: Ctx): Shape[] {
  const cx = 86, cy = 120;
  const s: Shape[] = [path(`M16 ${cy}H${cx - 40}`, 'ln wide'), path(`M16 ${cy}H${cx - 40}`, 'la an-flow')];
  s.push(path(`M${cx + 18} ${cy - 38}V40H196V64`, 'ln wide'), path(`M${cx + 18} ${cy - 38}V40H196V64`, 'la an-flow'));
  s.push(circle(cx, cy, 42, 'bx'), path(`M${cx + 6} ${cy - 42}h24v18h-24z`, 'bx'));
  const vanes: Shape[] = [circle(cx, cy, 30, 'lf o15')];
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    vanes.push(path(`M${pt([cx + 8 * Math.cos(a), cy + 8 * Math.sin(a)])}Q${pt([cx + 22 * Math.cos(a + 0.2), cy + 22 * Math.sin(a + 0.2)])} ${pt([cx + 28 * Math.cos(a + 0.7), cy + 28 * Math.sin(a + 0.7)])}`, 'la'));
  }
  s.push(group('an-spin', vanes), circle(cx, cy, 6, 'fa'));
  let coil = 'M196 64';
  for (let k = 0; k < 5; k++) coil += `h${k % 2 ? -40 : 40}v18`;
  s.push(path(coil, 'ln'), path(coil, 'la an-flow o5'), path('M196 154V176H16', 'ln'), path('M196 154V176H16', 'la an-flow o5'));
  const fx = 262, fy = f(46 + r() * 6);
  const blades: Shape[] = [circle(fx, fy, 24, 'lf o15')];
  for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2; blades.push(path(`M${fx} ${fy}Q${pt([fx + 20 * Math.cos(a + 0.5), fy + 20 * Math.sin(a + 0.5)])} ${pt([fx + 22 * Math.cos(a), fy + 22 * Math.sin(a)])}Z`, 'bx')); }
  s.push(circle(fx, fy, 27, 'ln'), group('an-spin', blades), circle(fx, fy, 3, 'fi'));
  for (let k = 0; k < 3; k++) s.push(path(`M${244 + k * 14} 92q6 8 0 16t0 16`, cls('lf an-up', dl(k))));
  return s;
}

/** Machining and Metal Parts: a turned part between chuck and tailstock, with the tool cutting and chips flying. */
function lathe({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(10, 40, 44, 122, 'bx', 4), rect(54, 64, 18, 72, 'bx', 3), rect(58, 70, 10, 14, 'fa', 2), rect(58, 116, 10, 14, 'fa', 2)];
  const step = f(between(r, 130, 160));
  const prof = `M72 82H${step}V88H226V112H${step}V118H72Z`;
  s.push(path(prof, 'ff'), path(prof, 'ln'), path('M10 100H292', 'cl'));
  s.push(path('M90 74A14 30 0 0 1 90 126', 'la an-flow'), arrowHead(90, 126, 'd'));
  s.push(path('M240 76h40v48h-40z', 'bx'), path('M226 92l14 8-14 8z', 'fl'), path('M280 88h12v24h-12', 'ln'));
  const tx = f(between(r, 168, 200));
  s.push(group('an-plunge', [path(`M${tx - 6} 154l4 -34h8l4 34z`, 'fa'), rect(tx - 22, 154, 44, 22, 'bx', 2)]));
  for (let k = 0; k < 4; k++) s.push(path(`M${tx + 6 + k * 7} ${120 + k * 3}c4 -4 8 0 4 4`, cls('la an-fall', dl(k * 2))));
  s.push(path('M72 186H226M72 180V192M226 180V192', 'ln'), text(149, 200, `Ø${18 + Math.round(r() * 8)}`, 'tx', 'middle'));
  return s;
}

/** Operational Data, Records and Controls: a scanned label resolving to one master record, and a control checklist. */
function barcode({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(14, 26, 142, 92, 'bx', 4)];
  let x = 26;
  while (x < 140) { const w = 1 + Math.floor(r() * 4); s.push(rect(x, 38, w, 50, 'fi')); x += w + 1 + Math.floor(r() * 3); }
  s.push(text(26, 108, '9 312345 67890', 'txs'), rect(124, 97, 22, 15, 'fa o85', 2), text(135, 108, String(Math.floor(r() * 10)), 'txs', 'middle'));
  s.push(group('an-bob', [path('M18 62H152', 'la wide o85')]));
  s.push(path('M156 72H174', 'la an-flow'), arrowHead(176, 72, 'r'));
  s.push(rect(180, 20, 110, 104, 'bxa', 4), rect(180, 20, 110, 18, 'fa', 4));
  for (let i = 0; i < 4; i++) s.push(rect(190, 48 + i * 18, 26, 4, 'fl'), rect(222, 48 + i * 18, between(r, 30, 58), 4, i === 1 ? 'fa' : 'fl'));
  for (let i = 0; i < 3; i++) {
    const y = 138 + i * 20;
    s.push(rect(14, y, 12, 12, 'bx', 2), rect(34, y + 4, between(r, 80, 140), 4, 'fl'));
    if (i < 2) s.push(path(`M16 ${y + 6}l3 3 6-7`, cls('la', i === 1 && 'an-pulse')));
  }
  return s;
}

/** Specifications, Product Quality and Sustainability: a dimensioned specification, a test pass and a quality mark. */
function specsheet({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(14, 16, 160, 176, 'bx', 4), rect(14, 16, 160, 20, 'fa', 4)];
  const bh = f(between(r, 92, 110));
  const bottle = `M64 ${50}h20v14c14 6 18 16 18 30v${bh - 50}h-56v${-(bh - 50)}c0 -14 4 -24 18 -30z`;
  s.push(path(bottle, 'ff'), path(bottle, 'la an-draw', true));
  s.push(path(`M40 ${50}V${50 + bh + 14}M34 ${50}H44M34 ${50 + bh + 14}H44`, 'ln'), text(30, 120, 'H', 'tx', 'end'));
  s.push(path(`M46 ${f(64 + bh + 14)}H102M46 ${f(58 + bh + 14)}V${f(70 + bh + 14)}M102 ${f(58 + bh + 14)}V${f(70 + bh + 14)}`, 'ln'));
  for (let i = 0; i < 6; i++) s.push(rect(118, 50 + i * 16, between(r, 26, 46), 3, i === 2 ? 'fa' : 'fl'));
  s.push(circle(240, 66, 30, 'bxa'), circle(240, 66, 22, 'lf'), path('M226 66l9 10 18-21', 'la xbold an-draw', true));
  s.push(path('M222 92l-10 34 14-8 8 14 6-34M258 92l10 34-14-8-8 14-6-34', 'bx'));
  s.push(rect(206, 150, 76, 30, 'bx', 4), text(244, 170, 'PASS', 'txa', 'middle'), circle(244, 165, 22, 'la an-ripple'));
  return s;
}

/** How Engineering Shaped Industry: an overshot water wheel driving the mill. */
function waterwheel({ r }: Ctx): Shape[] {
  const cx = 104, cy = 112, R = 62;
  const wheel: Shape[] = [circle(cx, cy, R + 10, 'lf o15'), circle(cx, cy, R, 'ln wide'), circle(cx, cy, R - 12, 'lf')];
  let spokes = '', paddles = '';
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; spokes += `M${pt([cx + 8 * Math.cos(a), cy + 8 * Math.sin(a)])}L${pt([cx + (R - 12) * Math.cos(a), cy + (R - 12) * Math.sin(a)])}`; }
  for (let k = 0; k < 16; k++) { const a = (k * Math.PI) / 8; paddles += `M${pt([cx + R * Math.cos(a), cy + R * Math.sin(a)])}L${pt([cx + (R + 9) * Math.cos(a + 0.12), cy + (R + 9) * Math.sin(a + 0.12)])}`; }
  wheel.push(path(spokes, 'ln'), path(paddles, 'ln wide'));
  const s: Shape[] = [rect(4, 30, 108, 8, 'bx', 2), group('an-spin', wheel), circle(cx, cy, 8, 'fa')];
  for (let k = 0; k < 4; k++) s.push(circle(116 + k * 6 + r() * 4, 42 + k * 4, 2.4, cls('fs an-fall', dl(k * 2))));
  s.push(path('M4 192q12 -6 24 0t24 0t24 0t24 0t24 0t24 0', 'la an-flow'), path(`M${cx} ${cy}H200`, 'ln xbold'));
  s.push(path('M196 64L240 36L284 64V192H196Z', 'bx'), rect(208, 80, 14, 18, 'fl'), rect(258, 80, 14, 18, 'fl'), rect(232, 150, 18, 42, 'fa'));
  s.push(path(gear(240, 116, 16, 12, 10), 'bxa an-spin-r'), circle(240, 116, 4, 'fn'));
  return s;
}

/** Power, Networks and the Modern Era: a transmission tower carrying power and a mast broadcasting signals. */
function pylon({ r }: Ctx): Shape[] {
  const bx = 92;
  let lat = '';
  for (let y = 56; y < 190; y += 18) { const w0 = 10 + (y - 40) * 0.2, w1 = 10 + (y - 22) * 0.2; lat += `M${f(bx - w0)} ${y}L${f(bx + w1)} ${y + 18}M${f(bx + w0)} ${y}L${f(bx - w1)} ${y + 18}`; }
  const s: Shape[] = [path(`M${bx - 4} 20L${bx - 40} 194M${bx + 4} 20L${bx + 40} 194`, 'ln'), path(lat, 'lf'), path(`M${bx - 46} 50H${bx + 46}M${bx - 34} 80H${bx + 34}`, 'ln wide')];
  const sag = 14 + r() * 10;
  for (const [y, k] of [[50, 0], [80, 1]] as const) {
    s.push(path(`M${bx - 46} ${y}Q${bx - 80} ${y + sag} -10 ${y + 4}`, 'ln'), path(`M${bx + 46} ${y}Q${bx + 64} ${y + sag} 170 ${y + 6}`, 'ln'), path(`M${bx + 46} ${y}Q${bx + 64} ${y + sag} 170 ${y + 6}`, cls('la an-flow', dl(k * 3))));
  }
  const mx = 236;
  s.push(path(`M${mx} 64L${mx - 22} 194M${mx} 64L${mx + 22} 194M${mx - 14} 150H${mx + 14}M${mx - 8} 110H${mx + 8}`, 'ln'), circle(mx, 60, 6, 'fa'));
  for (let k = 0; k < 3; k++) {
    const rr = 16 + k * 14;
    s.push(path(`M${pt([mx - rr * 0.7, 60 - rr * 0.7])}A${rr} ${rr} 0 0 1 ${pt([mx + rr * 0.7, 60 - rr * 0.7])}`, cls('la an-pulse', dl(k * 2))));
  }
  return s;
}

/** Judgement, Markets and Learning: a mind weighing a probability distribution, with chance on the table. */
function mind({ r }: Ctx): Shape[] {
  const head = 'M70 194V156C42 146 30 118 34 88C38 44 74 20 114 22C158 24 182 56 180 90L192 116L180 122V140C180 152 168 158 154 156L142 154V194';
  const s: Shape[] = [path(head, 'ff'), path(head, 'ln')];
  const mu = 108 + between(r, -8, 8), sd = 20 + r() * 6;
  const bell = Array.from({ length: 25 }, (_, i) => { const x = 56 + i * 4.4; return [x, 120 - 54 * Math.exp(-((x - mu) ** 2) / (2 * sd * sd))]; });
  s.push(path(`M56 120H162`, 'ln'), path(line(bell), 'la an-draw', true), path(`M${f(mu)} 60V120`, 'cl'));
  for (let k = 0; k < 3; k++) s.push(path(spark(60 + k * 46, 44 + (k % 2) * 8, 4 + k), cls('fa an-pulse', dl(k * 2))));
  const die = (x: number, y: number, n: number, c: string): Shape[] => {
    const pips: Record<number, number[][]> = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
    return [rect(x - 20, y - 20, 40, 40, c, 8), ...pips[n].map(([a, b]) => circle(x + a * 10, y + b * 10, 3.6, c === 'bxa' ? 'fa' : 'fi'))];
  };
  s.push(...die(232, 160, 1 + Math.floor(r() * 6), 'bxa'), group('an-tilt', die(262, 96, 1 + Math.floor(r() * 6), 'bx')));
  return s;
}

/** Practical Mathematics for Engineering and Manufacturing: a right triangle, a rule and the relationships between them. */
function triangle({ r }: Ctx): Shape[] {
  const ax = 30, ay = 164, b = f(between(r, 120, 150)), h = f(between(r, 90, 112));
  const s: Shape[] = [path(`M${ax} ${ay}H${ax + b}V${ay - h}Z`, 'ff'), path(`M${ax} ${ay}H${ax + b}V${ay - h}Z`, 'la an-draw', true), path(`M${ax + b - 12} ${ay}V${ay - 12}H${ax + b}`, 'ln')];
  const ang = Math.atan2(h, b);
  s.push(path(`M${ax + 30} ${ay}A30 30 0 0 0 ${pt([ax + 30 * Math.cos(ang), ay - 30 * Math.sin(ang)])}`, 'ln'), text(ax + 38, ay - 8, 'θ', 'txs'));
  s.push(text(ax + b / 2, ay + 16, 'a', 'txs', 'middle'), text(ax + b + 10, ay - h / 2, 'b', 'txs'), text(ax + b / 2 - 12, ay - h / 2 - 10, 'c', 'txs', 'end'));
  let ticks = '';
  for (let k = 0; k <= 24; k++) ticks += `M${ax + k * 10} 186V${k % 5 ? 191 : 194}`;
  s.push(rect(ax - 6, 180, 252, 18, 'bx', 2), path(ticks, 'ln'), group('an-growx', [rect(ax, 182, b, 3, 'fa')]));
  s.push(rect(202, 22, 92, 30, 'bx', 4), text(248, 42, 'a² + b² = c²', 'txs', 'middle'));
  const wave = Array.from({ length: 13 }, (_, i) => [204 + i * 7, 106 - Math.sin((i * Math.PI) / 6) * 26]);
  s.push(path('M204 106H292', 'lf'), path(openSmooth(wave), 'la an-flow'), text(248, 150, 'sin θ', 'tx', 'middle'));
  return s;
}

/** Software and Cloud Foundations for Business Leaders: code in an editor, deployed to the cloud along a branch history. */
function codebase({ r }: Ctx): Shape[] {
  const s: Shape[] = [rect(14, 28, 172, 152, 'bx', 6), path('M14 48H186', 'lf'), circle(26, 38, 3, 'fa'), circle(36, 38, 3, 'fl'), circle(46, 38, 3, 'fl')];
  const ind = [0, 1, 2, 2, 1, 2, 3, 1, 0];
  ind.forEach((k, i) => s.push(rect(24, 58 + i * 13, 8, 4, 'fl'), rect(38 + k * 12, 58 + i * 13, between(r, 30, 96 - k * 12), 4, i === 4 ? 'fa' : 'fl')));
  s.push(rect(52, 107, 1.5, 10, 'fi an-blink'));
  s.push(path('M214 72a18 18 0 0 1 4 -35a24 24 0 0 1 45 4a16 16 0 0 1 9 31z', 'bxa'), path('M186 92C204 92 214 84 222 74', 'la an-flow'));
  const gy = 150;
  s.push(path(`M204 ${gy}H290M222 ${gy}C234 ${gy} 234 ${gy - 26} 246 ${gy - 26}H266C278 ${gy - 26} 278 ${gy} 290 ${gy}`, 'ln'));
  const nodes: { x: number; y: number; c: string }[] = [{ x: 204, y: gy, c: 'bx' }, { x: 222, y: gy, c: 'bx' }, { x: 246, y: gy - 26, c: 'bxa' }, { x: 266, y: gy - 26, c: 'bxa' }, { x: 290, y: gy, c: 'fa' }];
  nodes.forEach((n, i) => s.push(circle(n.x, n.y, 5, cls(n.c, i === 4 && 'an-pulse'))));
  return s;
}

const BUILDERS: Record<CoverMotif, (ctx: Ctx) => Shape[]> = {
  database, neural, integration, interface: iface, drawing, beam, geometry, fixture, production, factory,
  cycle, workflow, gauge, gantt, network, launch, exploded, shield, ledger, contour, funnel, team, venture,
  decision, compass, experiment, orbit, lens, pathway,
  holdings, cashflow, breakeven, bubbles: boomBust, scales, tender, supply, estimate, gates, handover,
  expansion, megaphone, dialogue, summit, ladder, streak, leaf, archive,
  join, locks, cube, solid: isoSolid, search, crane, geartrain, pump, lathe, barcode, specsheet,
  waterwheel, pylon, mind, triangle, code: codebase,
};

export const COVER_MOTIFS = Object.keys(BUILDERS) as CoverMotif[];

/** The illustration for a cover. `uid` prefixes clip-path ids so several covers can share a page. */
export function coverArt(spec: CoverSpec, uid: string): Shape[] {
  return BUILDERS[spec.motif]({ r: rng(spec.seed), uid, v: (spec.part ?? 1) - 1 });
}
