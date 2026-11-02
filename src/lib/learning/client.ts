// Browser side of KEVOS® learning paths: the /api/learn calls (with time limits), chapter outlines, and session
// progress. Nothing here is stored beyond the browser tab (sessionStorage), and no personal details are collected.
import type { Depth, Intent } from './retrieve.ts';
import type { Course, Lesson, PlanFromWorker } from './course.ts';

export class VisitorError extends Error {}

export interface ChapterOutline { m: number; h: string[]; t: string[]; s: string; sum?: string; mis?: string[]; q?: string[]; ex?: string; exr?: string }
export interface LessonContent {
  explanation: string; why: string; concepts: string[];
  key: { principle: string; essential: string; why: string; misunderstandings: string[]; implications: string; remember: string[]; basis: 'source' | 'general' };
  example?: string; exercises: { task: string; tool?: number }[];
  checks: { q: string; options: string[]; answer: number; explain: string }[];
  verify: string[]; completion: string[];
  readingNotes: { n: number; why: string; understand: string }[]; toolNotes: { n: number; why: string; use: string }[];
  assumptions: string[];
}
export type Style = 'standard' | 'simpler' | 'technical' | 'examples' | 'exercises';

async function post<T>(path: string, body: unknown, timeoutMs: number): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(path, { method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => null);
    if (res.status === 429 || res.status === 413 || res.status === 422) throw new VisitorError(data?.error || 'Please try again.');
    return data?.ok && data.ai ? (data as T) : null;
  } catch (err) {
    if (err instanceof VisitorError) throw err;
    return null; // AI unavailable, slow or offline: the caller keeps the Library-only version
  } finally {
    clearTimeout(timer);
  }
}

export async function learnIntent(question: string, context = ''): Promise<Omit<Intent, 'source'> | null> {
  const r = await post<{ intent: Omit<Intent, 'source'> }>('/api/learn/intent', { question, context: context || undefined }, 14000);
  return r?.intent ?? null;
}

export async function learnPlan(question: string, intent: Intent, depth: Exclude<Depth, 'quick'>, readings: { id: string; title: string; book: string; topic: string; about: string }[], tools: { id: string; name: string; about: string; linked: string[] }[]): Promise<PlanFromWorker | null> {
  const r = await post<{ course: PlanFromWorker }>('/api/learn/plan', { question, depth, intent: { subject: intent.subject, objective: intent.objective, outcome: intent.outcome, level: intent.level }, readings, tools }, 45000);
  return r?.course ?? null;
}

// ---------- Chapter outlines (/learning/<book>.json) ----------
const shards = new Map<number, Promise<Record<string, ChapterOutline>>>();
export function outlines(shard: number): Promise<Record<string, ChapterOutline>> {
  let p = shards.get(shard);
  if (!p) {
    p = fetch(`/learning/${shard}.json`).then((r) => (r.ok ? r.json() : { chapters: {} })).then((s) => s.chapters ?? {}).catch(() => { shards.delete(shard); return {}; });
    shards.set(shard, p);
  }
  return p;
}
export async function lessonSources(lesson: Lesson): Promise<{ title: string; book: string; outline: ChapterOutline | null }[]> {
  return Promise.all(lesson.readings.map(async (r) => ({ title: r.title, book: r.book, outline: (await outlines(r.shard))[r.url] ?? null })));
}

export async function learnLesson(course: Course, module: string, lesson: Lesson, style: Style): Promise<LessonContent | null> {
  const sources = await lessonSources(lesson);
  const r = await post<{ lesson: LessonContent }>('/api/learn/lesson', {
    course: { title: course.title, level: course.level, depth: course.depth }, module, style,
    lesson: { title: lesson.title, objective: lesson.objective },
    sources: sources.map((s) => ({ title: s.title, book: s.book, outline: s.outline ?? {} })),
    tools: lesson.tools.slice(0, 2).map((t) => ({ name: t.name, about: t.about, inputs: t.inputs, outputs: t.outputs })),
  }, 45000);
  return r?.lesson ?? null;
}

export async function learnAsk(course: Course, lesson: Lesson, summary: string, question: string): Promise<{ answer: string; basis: 'source' | 'general'; refs: number[] } | null> {
  const sources = await lessonSources(lesson);
  const r = await post<{ answer: { answer: string; basis: 'source' | 'general'; refs: number[] } }>('/api/learn/ask', {
    course: { title: course.title }, lesson: { title: lesson.title, objective: lesson.objective, summary },
    sources: sources.map((s) => ({ title: s.title, book: s.book, outline: s.outline ?? {} })), question,
  }, 30000);
  return r?.answer ?? null;
}

// ---------- Session progress (this browser tab only) ----------
export interface Progress { opened: string[]; done: string[]; checks: string[]; current?: string }
const KEY = (id: string) => `kevos-learn-${id}`;
export function readProgress(courseId: string): Progress {
  try { return { opened: [], done: [], checks: [], ...(JSON.parse(sessionStorage.getItem(KEY(courseId)) ?? '{}') as Partial<Progress>) }; } catch { return { opened: [], done: [], checks: [] }; }
}
export function saveProgress(courseId: string, p: Progress): void {
  try { sessionStorage.setItem(KEY(courseId), JSON.stringify(p)); } catch { /* progress is a convenience */ }
}
