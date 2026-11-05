// Browser side of BIZOMAT discovery, shared by the homepage question box (src/scripts/discovery.ts) and the Tools
// directory search (src/scripts/library-browser.ts).
//   1. Load the catalogue (/discovery-index.json, once per page) and shortlist the entries related to the question.
//   2. Ask /api/discover (Workers AI) for search terms, its picks from that shortlist and an ordered solution path.
//   3. Rank real catalogue entries with the question, the terms and the picks (src/lib/discovery/search.ts), and build
//      "Your Solution Path" from the AI's steps or the workflow for the question type (src/lib/discovery/plan.ts).
// If the AI step fails or is slow, step 3 runs on the question alone. Nothing is stored in the browser.
import { prepare, search, shortlist, type Candidate, type Engine, type Outcome } from './search.ts';
import { buildPath, type AiPlan, type DiscoveryDetails, type SolutionPath } from './plan.ts';

export interface Intent { summary?: string; terms: string[]; clarify?: string; options?: string[]; outOfScope?: boolean; picks?: string[]; plan?: AiPlan }
export interface Answer { outcome: Outcome; intent: Intent | null; path: SolutionPath | null }
/** An error whose message is meant for the visitor (rate limit, too long, empty). */
export class VisitorError extends Error {}

const API_TIMEOUT_MS = 17000; // the Worker waits up to 15 s for a solution path; a keyword path is shown meanwhile
const NONE: Outcome = { mode: 'none', platform: [], tools: [], readings: [], related: [], concepts: [], corrections: [] };

export function createDiscovery() {
  let engine: Promise<Engine> | null = null;
  const loadEngine = () =>
    (engine ??= fetch('/discovery-index.json')
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(prepare)
      .catch((err) => { engine = null; throw err; }));
  let details: Promise<DiscoveryDetails | null> | null = null;
  /** Tool inputs, outputs and checks for solution paths. A path without them still shows its steps and links. */
  const loadDetails = () =>
    (details ??= fetch('/discovery-details.json').then((r) => (r.ok ? r.json() : null)).catch(() => { details = null; return null; }));

  async function understand(question: string, context: string, candidates: Candidate[]): Promise<Intent | null> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), API_TIMEOUT_MS);
    try {
      const res = await fetch('/api/discover', { method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, context: context || undefined, candidates }) });
      const data = await res.json().catch(() => null);
      if (res.status === 429 || res.status === 413 || res.status === 422) throw new VisitorError(data?.error || 'Please try again.');
      return data?.ok && data.ai && data.intent ? data.intent : null;
    } catch (err) {
      if (err instanceof VisitorError) throw err;
      return null; // AI unavailable or slow: search on the question alone
    } finally {
      clearTimeout(timer);
    }
  }

  /** Without AI: keyword, synonym and spelling matches and the workflow for the question's type. Shown at once. */
  async function draft(question: string, context = ''): Promise<Answer> {
    const [eng, det] = await Promise.all([loadEngine(), loadDetails()]);
    const outcome = search(eng, { question, context });
    return { outcome, intent: null, path: outcome.mode === 'results' ? buildPath(eng, question, outcome, det) : null };
  }

  /** With AI: search terms, picks and an ordered path, all resolved to real catalogue entries. Null intent = AI unavailable. */
  async function ask(question: string, context = '', withPath = true): Promise<Answer> {
    const eng = await loadEngine();
    const [intent, det] = await Promise.all([understand(question, context, shortlist(eng, { question, context }, 14, 8)), withPath ? loadDetails() : null]);
    // A question the AI marks as outside BIZOMAT's subjects gets an honest "not covered" rather than loose word matches.
    const outcome = intent?.outOfScope ? NONE : search(eng, { question, terms: intent?.terms, context, picks: intent?.picks });
    const showPath = withPath && outcome.mode === 'results' && !intent?.clarify;
    return { outcome, intent, path: showPath ? buildPath(eng, question, outcome, det, intent?.plan) : null };
  }

  return { loadEngine, loadDetails, draft, ask };
}
