// Shared library search for KEVOS® Tools and the Library. Each page builds its own index from its own cards,
// so the two libraries never mix results. Pure functions only: the browser script and the tests use the same code.

export interface SearchDoc {
  /** Title words: the strongest signal. */
  title: string;
  /** Category, subcategory, keywords and other short labels. */
  tags?: string;
  /** Purpose, summary or description. */
  body?: string;
  /** Secondary text such as chapter titles. */
  extra?: string;
}

export interface IndexedDoc { title: string; text: string; fields: { words: string[]; weight: number }[] }

/** Words removed from a query when other words remain ("how to calculate gear ratio" → "gear ratio"). */
const STOP = new Set(['a', 'an', 'and', 'the', 'of', 'for', 'to', 'in', 'on', 'my', 'how', 'what', 'is', 'do', 'i', 'with', 'by', 'from', 'calculate', 'calculator', 'calculation', 'work', 'out', 'find', 'tool', 'tools', 'book', 'books']);

/** Groups of words that mean the same thing to an engineer, a planner or a reader. Matched as whole words. */
const SYNONYM_GROUPS = [
  ['bolt', 'bolts', 'fastener', 'fasteners', 'screw', 'screws'],
  ['torque', 'moment', 'twist'],
  ['rpm', 'speed', 'revolutions'],
  ['pressure', 'psi', 'bar', 'kpa', 'mpa'],
  ['power', 'hp', 'horsepower', 'kw', 'watt', 'watts'],
  ['stress', 'strength'],
  ['weld', 'welds', 'welding', 'welded', 'fillet'],
  ['gear', 'gears', 'gearing', 'pinion', 'tooth', 'teeth'],
  ['belt', 'belts', 'pulley', 'pulleys', 'sheave', 'vbelt'],
  ['chain', 'chains', 'sprocket', 'sprockets'],
  ['pipe', 'pipes', 'piping', 'tube', 'tubing', 'hose'],
  ['flow', 'gpm', 'lpm', 'flowrate'],
  ['cylinder', 'cylinders', 'actuator', 'ram', 'piston'],
  ['air', 'pneumatic', 'pneumatics', 'compressed'],
  ['oil', 'hydraulic', 'hydraulics', 'fluid'],
  ['machining', 'turning', 'milling', 'drilling', 'cutting', 'lathe'],
  ['feed', 'feeds', 'feedrate'],
  ['cost', 'costs', 'costing', 'price', 'pricing'],
  ['profit', 'margin', 'markup'],
  ['roi', 'return', 'payback', 'npv', 'irr', 'investment'],
  ['oee', 'availability', 'downtime'],
  ['stock', 'inventory', 'eoq', 'reorder'],
  ['tolerance', 'tolerances', 'fit', 'fits', 'clearance', 'interference'],
  ['thread', 'threads', 'threaded', 'tap', 'tapped', 'tapping'],
  ['convert', 'conversion', 'converter', 'units'],
  ['beam', 'beams', 'deflection', 'bending'],
  ['bearing', 'bearings'],
  ['shaft', 'shafts', 'axle'],
  ['capability', 'cpk', 'ppk', 'spc'],
  ['reliability', 'mtbf', 'weibull', 'failure'],
  ['heat', 'thermal', 'temperature'],
  ['quote', 'quotes', 'quoting', 'estimate', 'estimating', 'tender', 'bid'],
  ['schedule', 'scheduling', 'deadline', 'planning'],
  ['vibration', 'balancing', 'imbalance'],
  ['noise', 'sound', 'decibel'],
  ['press', 'tonnage', 'punching', 'blanking'],
  ['coolant', 'lubricant', 'lubrication'],
  ['ai', 'artificial', 'intelligence', 'ml'],
  ['finance', 'financial', 'accounting', 'accounts'],
  ['cad', 'drawing', 'drawings', 'drafting', 'modelling'],
  ['lean', 'kaizen', 'waste'],
  ['quality', 'inspection', 'qa', 'qc'],
  ['project', 'projects', 'programme'],
  ['strategy', 'strategic'],
  ['leadership', 'management', 'manager', 'managers'],
  ['software', 'digital', 'database', 'databases'],
];
const SYNONYMS = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  for (const w of group) {
    const set = SYNONYMS.get(w) ?? new Set<string>();
    for (const other of group) if (other !== w) set.add(other);
    SYNONYMS.set(w, set);
  }
}

/** Lower case, accents removed, punctuation to spaces ("V-Belt Drive®" → "v belt drive"). */
export function normalize(text: string): string {
  return String(text ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export const words = (text: string) => normalize(text).split(' ').filter(Boolean);

export function queryTokens(query: string): string[] {
  const all = words(query);
  const kept = all.filter((w) => !STOP.has(w));
  return kept.length ? kept : all;
}

export function indexDoc(doc: SearchDoc): IndexedDoc {
  const uniq = (s?: string) => [...new Set(words(s ?? ''))];
  return {
    title: normalize(doc.title),
    text: ` ${normalize(`${doc.tags ?? ''} | ${doc.body ?? ''} | ${doc.extra ?? ''}`)} `,
    fields: [
      { words: uniq(doc.title), weight: 10 },
      { words: uniq(doc.tags), weight: 4 },
      { words: uniq(doc.body), weight: 3 },
      { words: uniq(doc.extra), weight: 2 },
    ],
  };
}

/** Optimal string alignment distance (adjacent transpositions count as one edit), giving up beyond `max`. */
export function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) rows.push([i]);
  for (let j = 1; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let best = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, rows[i - 2][j - 2] + 1);
      rows[i][j] = v;
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
  }
  return rows[a.length][b.length];
}

/** How well one query word matches one indexed word, from 1 (identical) to 0 (no match). */
function wordMatch(q: string, w: string): number {
  if (q === w) return 1;
  if (w.startsWith(q)) return q.length >= 2 ? 0.8 : 0.5;
  if (q.length >= 4 && w.includes(q)) return 0.5; // "load" in "preload"; shorter fragments must start a word
  if (q.length >= 4) {
    const max = q.length >= 8 ? 2 : 1;
    if (editDistance(q, w, max) <= max) return 0.45;
    // A typo inside a word still being typed: "presur" → "pressure".
    if (w.length > q.length && editDistance(q, w.slice(0, q.length), 1) <= 1) return 0.35;
  }
  return 0;
}

function tokenScore(token: string, doc: IndexedDoc): number {
  const variants: [string, number][] = [[token, 1], ...[...(SYNONYMS.get(token) ?? [])].map((s): [string, number] => [s, 0.7])];
  let best = 0;
  for (const field of doc.fields) {
    for (const w of field.words) {
      for (const [v, factor] of variants) {
        // Synonyms match whole words only, so "ram" does not light up "program".
        const m = factor === 1 ? wordMatch(v, w) : v === w ? 1 : 0;
        const s = m * factor * field.weight;
        if (s > best) best = s;
      }
    }
  }
  return best;
}

/** Score a document for a query: every query word must match somewhere, or the score is 0. */
export function scoreDoc(query: string, doc: IndexedDoc): number {
  const tokens = queryTokens(query);
  if (!tokens.length) return 0;
  let total = 0;
  for (const t of tokens) {
    const s = tokenScore(t, doc);
    if (s === 0) return 0;
    total += s;
  }
  const phrase = normalize(query);
  if (phrase && doc.title.startsWith(phrase)) total += 8;
  else if (phrase.length >= 3 && ` ${doc.title}`.includes(` ${phrase}`)) total += 5;
  // Several words found together ("cash flow") beat the same words scattered across a summary and its tags.
  else if (tokens.length > 1 && doc.text.includes(` ${tokens.join(' ')}`)) total += 4;
  return total;
}

/** Ranked matches (best first, ties keep the original order). */
export function search<T extends { index: IndexedDoc }>(query: string, items: T[]): { item: T; score: number }[] {
  const out: { item: T; score: number; i: number }[] = [];
  items.forEach((item, i) => {
    const score = scoreDoc(query, item.index);
    if (score > 0) out.push({ item, score, i });
  });
  return out.sort((a, b) => b.score - a.score || a.i - b.i).map(({ item, score }) => ({ item, score }));
}

/**
 * Split text into plain and highlighted parts for the query words (exact or prefix matches only).
 * The caller turns the parts into text nodes and <mark> elements, so no HTML is ever parsed.
 */
export function highlightParts(text: string, query: string): { text: string; mark: boolean }[] {
  const tokens = queryTokens(query).filter((t) => t.length >= 2);
  if (!tokens.length || !text) return [{ text, mark: false }];
  const parts: { text: string; mark: boolean }[] = [];
  const re = /[A-Za-z0-9À-ɏ]+/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const word = normalize(m[0]);
    const t = tokens.find((tok) => word.startsWith(tok));
    if (!t) continue;
    if (m.index > last) parts.push({ text: text.slice(last, m.index), mark: false });
    const len = Math.min(m[0].length, t.length);
    parts.push({ text: m[0].slice(0, len), mark: true });
    if (len < m[0].length) parts.push({ text: m[0].slice(len), mark: false });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), mark: false });
  return parts;
}
