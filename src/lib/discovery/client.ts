// Browser side of KEVOS® discovery, shared by the homepage question box (src/scripts/discovery.ts) and the WORKOS
// directory search (src/scripts/library-browser.ts).
//   1. Load the catalogue (/discovery-index.json, once per page) and shortlist the entries related to the question.
//   2. Ask /api/discover (Workers AI) for search terms and for its picks from that shortlist.
//   3. Rank real catalogue entries with the question, the terms and the picks (src/lib/discovery/search.ts).
// If the AI step fails or is slow, step 3 runs on the question alone. Nothing is stored in the browser.
import { prepare, search, shortlist, type Candidate, type Engine, type Outcome } from './search.ts';

export interface Intent { summary?: string; terms: string[]; clarify?: string; options?: string[]; outOfScope?: boolean; picks?: string[] }
export interface Answer { outcome: Outcome; intent: Intent | null }
/** An error whose message is meant for the visitor (rate limit, too long, empty). */
export class VisitorError extends Error {}

const API_TIMEOUT_MS = 8000;
const NONE: Outcome = { mode: 'none', tools: [], readings: [], related: [], concepts: [], corrections: [] };

export function createDiscovery() {
  let engine: Promise<Engine> | null = null;
  const loadEngine = () =>
    (engine ??= fetch('/discovery-index.json')
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(prepare)
      .catch((err) => { engine = null; throw err; }));

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

  async function ask(question: string, context = ''): Promise<Answer> {
    const eng = await loadEngine();
    const intent = await understand(question, context, shortlist(eng, { question, context }));
    // A question the AI marks as outside KEVOS's subjects gets an honest "not covered" rather than loose word matches.
    const outcome = intent?.outOfScope ? NONE : search(eng, { question, terms: intent?.terms, context, picks: intent?.picks });
    return { outcome, intent };
  }

  return { loadEngine, ask };
}
