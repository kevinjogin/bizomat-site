// Structured-output validation for KEVOS® learning paths. Every AI reply passes through these before it reaches a
// visitor: plain short text only (no links, markup or code), catalogue entries only by their number in the list the
// browser sent, and no stated calculation results (the Tools calculate; "= 85 %", "comes to 1,200 rpm" are dropped).

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'mixed';
export type Depth = 'quick' | 'structured' | 'complete' | 'professional';
export type Style = 'standard' | 'simpler' | 'technical' | 'examples' | 'exercises';
export const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced', 'mixed'];
export const DEPTHS: Depth[] = ['quick', 'structured', 'complete', 'professional'];
export const STYLES: Style[] = ['standard', 'simpler', 'technical', 'examples', 'exercises'];

export interface LearnIntent {
  subject: string; objective: string; outcome: string; level: Level; depth: Depth;
  application?: string; industry?: string; constraints?: string[];
  topics: { name: string; terms: string[] }[];
  outOfScope?: boolean; clarify?: string; options?: string[];
}
export interface PlanLesson { title: string; objective: string; reads: string[]; tools: string[] }
export interface CoursePlan {
  title: string; description: string; level: Level; objectives: string[]; outcomes: string[];
  modules: { title: string; summary: string; lessons: PlanLesson[] }[];
  gaps: string[];
}
export interface KeyThings { principle: string; essential: string; why: string; misunderstandings: string[]; implications: string; remember: string[]; basis: 'source' | 'general' }
export interface LessonContent {
  explanation: string; why: string; concepts: string[]; key: KeyThings;
  example?: string; exercises: { task: string; tool?: number }[];
  checks: { q: string; options: string[]; answer: number; explain: string }[];
  verify: string[]; completion: string[];
  readingNotes: { n: number; why: string; understand: string }[];
  toolNotes: { n: number; why: string; use: string }[];
  assumptions: string[];
}
export interface AskAnswer { answer: string; basis: 'source' | 'general'; refs: number[] }

const UNSAFE = /https?:|www\.|[<>{}[\]\\`]|\/\//i;
/** A sentence that states a calculated result: "= 85", "≈ 1.2", "comes to 40", "works out at 3 kW". */
const RESULT = /[=≈≅]\s*[-−$]?\s*\d|\b(comes to|works out (at|to)|equals|is approximately|is about|is roughly)\s+[-−$]?\d/i;
export const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();

/** Plain text up to `max` characters; sentences that state a result are removed; unsafe text gives ''. */
export function text(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  let t = clean(v);
  if (!t || UNSAFE.test(t)) return '';
  if (RESULT.test(t)) t = t.split(/(?<=[.!?])\s+/).filter((s) => !RESULT.test(s)).join(' ');
  if (t.length > max) t = `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
  return t;
}
export const list = (v: unknown, n: number, max: number) => (Array.isArray(v) ? v.map((x) => text(x, max)).filter(Boolean).slice(0, n) : []);
const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => (typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : fallback);
/** Numbers 1..count, unique, at most n. */
export const nums = (v: unknown, count: number, n: number) => (Array.isArray(v) ? [...new Set(v.map(Number))].filter((x) => Number.isInteger(x) && x >= 1 && x <= count).slice(0, n) : []);

export function parseLearnIntent(o: Record<string, unknown>): LearnIntent | null {
  const subject = text(o.subject, 80);
  const topics = (Array.isArray(o.topics) ? o.topics : []).slice(0, 8).map((t) => {
    const r = (t && typeof t === 'object' ? t : {}) as Record<string, unknown>;
    return { name: text(r.name, 60), terms: list(r.terms, 6, 40).map((x) => x.toLowerCase()) };
  }).filter((t) => t.name && t.terms.length);
  const outOfScope = o.inScope === false;
  if (!outOfScope && (!subject || !topics.length)) return null;
  const options = list(o.options, 4, 60);
  const clarify = text(o.clarify, 160);
  return {
    subject, objective: text(o.objective, 200), outcome: text(o.outcome, 200),
    level: pick(o.level, LEVELS, 'mixed'), depth: pick(o.depth, DEPTHS, 'complete'),
    ...(text(o.application, 120) ? { application: text(o.application, 120) } : {}),
    ...(text(o.industry, 60) ? { industry: text(o.industry, 60) } : {}),
    ...(list(o.constraints, 3, 120).length ? { constraints: list(o.constraints, 3, 120) } : {}),
    topics,
    ...(outOfScope ? { outOfScope: true } : {}),
    ...(clarify && options.length >= 2 ? { clarify, options } : {}),
  };
}

/** Course size by depth: [max modules, max lessons per module]. */
export const SHAPE: Record<Exclude<Depth, 'quick'>, [number, number]> = { structured: [4, 3], complete: [7, 4], professional: [7, 4] };

/** The plan, with readings and tools resolved from list numbers (R1.., T1..) to the ids the browser sent. */
export function parseCoursePlan(o: Record<string, unknown>, readings: string[], tools: string[], depth: Exclude<Depth, 'quick'>): CoursePlan | null {
  const [maxModules, maxLessons] = SHAPE[depth];
  const modules: CoursePlan['modules'] = [];
  const used = new Set<string>();
  for (const raw of (Array.isArray(o.modules) ? o.modules : []).slice(0, maxModules)) {
    const m = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const title = text(m.title, 70);
    if (!title) continue;
    const lessons: PlanLesson[] = [];
    for (const rawL of (Array.isArray(m.lessons) ? m.lessons : []).slice(0, maxLessons)) {
      const l = (rawL && typeof rawL === 'object' ? rawL : {}) as Record<string, unknown>;
      const lt = text(l.title, 80);
      if (!lt) continue;
      // A reading is used once in the course; a tool may return in later lessons.
      const reads = nums(l.reads, readings.length, 3).map((n) => readings[n - 1]).filter((id) => !used.has(id));
      reads.forEach((id) => used.add(id));
      lessons.push({ title: lt, objective: text(l.objective, 160), reads, tools: nums(l.tools, tools.length, 2).map((n) => tools[n - 1]) });
    }
    if (lessons.length) modules.push({ title, summary: text(m.summary, 200), lessons });
  }
  const lessonCount = modules.reduce((n, m) => n + m.lessons.length, 0);
  if (!modules.length || lessonCount < 2 || !modules.some((m) => m.lessons.some((l) => l.reads.length))) return null;
  return {
    title: text(o.title, 90) || 'Your learning path', description: text(o.description, 280), level: pick(o.level, LEVELS, 'mixed'),
    objectives: list(o.objectives, 5, 160), outcomes: list(o.outcomes, 4, 160), modules, gaps: list(o.gaps, 4, 160),
  };
}

export function parseLesson(o: Record<string, unknown>, sources: number, tools: number): LessonContent | null {
  const k = (o.key && typeof o.key === 'object' ? o.key : {}) as Record<string, unknown>;
  const key: KeyThings = {
    principle: text(k.principle, 240), essential: text(k.essential, 240), why: text(k.why, 240),
    misunderstandings: list(k.misunderstandings, 3, 200), implications: text(k.implications, 240), remember: list(k.remember, 5, 180),
    basis: k.basis === 'source' && sources > 0 ? 'source' : 'general',
  };
  const explanation = text(o.explanation, 1600);
  if (!explanation || !key.principle || key.remember.length < 2) return null;
  const checks = (Array.isArray(o.checks) ? o.checks : []).slice(0, 4).map((raw) => {
    const c = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const options = list(c.options, 4, 140);
    const answer = Number(c.answer);
    return { q: text(c.q, 220), options, answer: Number.isInteger(answer) && answer >= 0 && answer < options.length ? answer : -1, explain: text(c.explain, 240) };
  }).filter((c) => c.q && c.options.length >= 2 && c.answer >= 0);
  const exercises = (Array.isArray(o.exercises) ? o.exercises : []).slice(0, 4).map((raw) => {
    const e = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const tool = nums([e.tool], tools, 1)[0];
    return { task: text(e.task, 300), ...(tool ? { tool } : {}) };
  }).filter((e) => e.task);
  const notes = <K extends string>(v: unknown, count: number, a: K, b: K) => (Array.isArray(v) ? v : []).map((raw) => {
    const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    return { n: nums([r.n], count, 1)[0] ?? 0, [a]: text(r[a], 180), [b]: text(r[b], 220) } as { n: number } & Record<K, string>;
  }).filter((x) => x.n && (x[a] || x[b]));
  const example = text(o.example, 600);
  return {
    explanation, why: text(o.why, 320), concepts: list(o.concepts, 6, 160), key,
    ...(example ? { example } : {}), exercises, checks,
    verify: list(o.verify, 5, 180), completion: list(o.completion, 3, 180),
    readingNotes: notes(o.readingNotes, sources, 'why', 'understand') as LessonContent['readingNotes'],
    toolNotes: notes(o.toolNotes, tools, 'why', 'use') as LessonContent['toolNotes'],
    assumptions: list(o.assumptions, 3, 180),
  };
}

export function parseAnswer(o: Record<string, unknown>, sources: number): AskAnswer | null {
  const answer = text(o.answer, 1400);
  if (!answer) return null;
  const refs = nums(o.refs, sources, 3);
  return { answer, basis: o.basis === 'source' && refs.length ? 'source' : 'general', refs };
}
