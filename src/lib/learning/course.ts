// The course model for KEVOS® learning paths, and the two ways a course is made:
//   - draftCourse(): from the Library and Tools alone (no AI): one module per topic, one lesson per best chapter.
//     Shown at once, and kept when the AI step is unavailable.
//   - courseFromPlan(): the AI's plan (modules and lessons over numbered candidates, validated by the Worker),
//     resolved to the real chapters and tools it names.
// Every reading and tool in a course is a real catalogue entry with its real URL.
import type { DiscoveryDetails } from '../discovery/plan.ts';
import type { Candidates, Depth, Intent, Level, ReadingCandidate, ToolCandidate } from './retrieve.ts';

export interface ReadingRef { url: string; title: string; book: string; bookUrl: string; about: string; minutes?: number; shard: number; verified: boolean }
export interface ToolRef { id: string; name: string; url: string; app: string; about: string; inputs: string[]; outputs: string[]; check?: string; linked: boolean }
export interface Lesson { id: string; title: string; objective: string; readings: ReadingRef[]; tools: ToolRef[] }
export interface Module { title: string; summary: string; lessons: Lesson[] }
export interface Course {
  id: string; question: string; subject: string; title: string; description: string; level: Level; depth: Exclude<Depth, 'quick'>;
  objectives: string[]; outcomes: string[]; modules: Module[]; gaps: string[];
  /** 'ai': planned by KEVOS® AI; 'library': arranged from the best-matching Library chapters without AI. */
  source: 'ai' | 'library';
  /** Estimated study time in minutes: reading time plus practice. */
  minutes: number;
}
export interface PlanFromWorker {
  title: string; description: string; level: Level; objectives: string[]; outcomes: string[];
  modules: { title: string; summary: string; lessons: { title: string; objective: string; reads: string[]; tools: string[] }[]; tools?: string[] }[];
  gaps: string[];
}

export const DEPTH_LABEL: Record<Depth, string> = { quick: 'Quick Understanding', structured: 'Structured Learning', complete: 'Complete Course', professional: 'Professional / Advanced' };
export const LEVEL_LABEL: Record<Level, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced', mixed: 'Beginner to advanced' };
const SHAPE: Record<Exclude<Depth, 'quick'>, [number, number]> = { structured: [3, 3], complete: [6, 3], professional: [6, 3] };

const firstSentence = (s: string) => (s.match(/^.*?[.!?](\s|$)/)?.[0] ?? s).trim();
const hash = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h.toString(36); };

function toolRef(t: ToolCandidate, details: DiscoveryDetails | null, linked: boolean): ToolRef {
  const d = details?.tools[t.id];
  return { id: t.id, name: t.name, url: t.url, app: t.app, about: t.about, inputs: d?.i ?? [], outputs: d?.o ?? [], check: d?.c, linked };
}
const readingRef = (r: ReadingCandidate, verified: boolean): ReadingRef => ({ url: r.url, title: r.title, book: r.book, bookUrl: r.bookUrl, about: r.about, minutes: r.minutes, shard: r.shard, verified });

/** Study time: reading minutes, ten minutes per tool exercise and five per lesson for review and checks. */
export function estimateMinutes(modules: Module[]): number {
  return modules.flatMap((m) => m.lessons).reduce((n, l) => n + l.readings.reduce((r, x) => r + (x.minutes ?? 8), 0) + l.tools.length * 10 + 5, 0);
}

/** A course from the Library and Tools alone: topics become modules, their best chapters become lessons. */
export function draftCourse(question: string, intent: Intent, c: Candidates, details: DiscoveryDetails | null, depth: Exclude<Depth, 'quick'>): Course | null {
  const [maxModules, maxLessons] = SHAPE[depth];
  const modules: Module[] = [];
  const topics = [...new Set(c.readings.map((r) => r.topic))];
  for (const topic of topics.slice(0, maxModules)) {
    const lessons: Lesson[] = c.readings.filter((r) => r.topic === topic).slice(0, maxLessons).map((r, i) => {
      const tools = c.tools.filter((t) => t.linkedTo.includes(r.url)).slice(0, 2).map((t) => toolRef(t, details, true));
      return { id: `${modules.length + 1}.${i + 1}`, title: r.title, objective: firstSentence(r.about), readings: [readingRef(r, tools.length > 0)], tools };
    });
    if (lessons.length) modules.push({ title: topic, summary: '', lessons });
  }
  if (!modules.length) return null;
  // Give a module without any tool the best-matching tool for its topic, if there is one.
  for (const m of modules) if (!m.lessons.some((l) => l.tools.length)) {
    const t = c.tools.find((x) => x.topic === m.title);
    if (t) m.lessons[m.lessons.length - 1].tools.push(toolRef(t, details, false));
  }
  const gaps = c.coverage.filter((x) => x.readings === 0).map((x) => `The Library has no chapter that fits “${x.topic}” yet.`);
  return {
    id: hash(`${question}|${depth}|library`), question, subject: intent.subject, depth, level: intent.level, source: 'library',
    title: `Learning path: ${intent.subject.charAt(0).toUpperCase()}${intent.subject.slice(1)}`.slice(0, 90),
    description: intent.objective || 'A path through the KEVOS® Library chapters and Tools that best match your goal, in a suggested order.',
    objectives: modules.map((m) => `Understand ${m.title.replace(/ by the Numbers$/i, '').toLowerCase()}`).slice(0, 5),
    outcomes: intent.outcome ? [intent.outcome] : [],
    modules, gaps, minutes: estimateMinutes(modules),
  };
}

/** The AI's plan resolved to real readings and tools. Lessons keep only entries that exist in the candidates. */
export function courseFromPlan(question: string, intent: Intent, plan: PlanFromWorker, c: Candidates, details: DiscoveryDetails | null, depth: Exclude<Depth, 'quick'>): Course | null {
  const readings = new Map(c.readings.map((r) => [r.url, r]));
  const tools = new Map(c.tools.map((t) => [t.id, t]));
  const modules: Module[] = plan.modules.map((m, mi) => {
    const moduleTools = (m.tools ?? []).map((id) => tools.get(id)).filter((t): t is ToolCandidate => Boolean(t));
    const placed = new Set<string>();
    const lessons = m.lessons.map((l, li) => {
      const rs = l.reads.map((id) => readings.get(id)).filter((r): r is ReadingCandidate => Boolean(r));
      // The lesson's own tools, else the module's tools (or any candidate) joined to its chapter by a reviewed link.
      let ts = l.tools.map((id) => tools.get(id)).filter((t): t is ToolCandidate => Boolean(t));
      if (!ts.length) ts = [...moduleTools, ...c.tools].filter((t, i, all) => all.indexOf(t) === i && t.linkedTo.some((u) => rs.some((r) => r.url === u))).slice(0, 2);
      ts.forEach((t) => placed.add(t.id));
      const linkedTools = new Set(ts.filter((t) => t.linkedTo.some((u) => rs.some((r) => r.url === u))).map((t) => t.id));
      return {
        id: `${mi + 1}.${li + 1}`,
        // Without an AI title or objective, the lesson takes its chapter's title and first sentence.
        title: l.title || rs[0]?.title || '', objective: l.objective || (rs[0] ? firstSentence(rs[0].about) : ''),
        readings: rs.map((r) => readingRef(r, ts.some((t) => t.linkedTo.includes(r.url)))),
        tools: ts.map((t) => toolRef(t, details, linkedTools.has(t.id))),
      };
    }).filter((l) => l.title);
    // A module tool the AI chose that no lesson took goes to the module's last lesson.
    const rest = moduleTools.filter((t) => !placed.has(t.id));
    const last = lessons[lessons.length - 1];
    if (last && rest.length && last.tools.length < 2) last.tools.push(...rest.slice(0, 2 - last.tools.length).map((t) => toolRef(t, details, false)));
    return { title: m.title, summary: m.summary, lessons };
  }).filter((m) => m.lessons.length);
  if (!modules.length) return null;
  return {
    id: hash(`${question}|${depth}|ai`), question, subject: intent.subject, depth, level: plan.level, source: 'ai',
    title: plan.title, description: plan.description, objectives: plan.objectives, outcomes: plan.outcomes,
    modules, gaps: plan.gaps, minutes: estimateMinutes(modules),
  };
}

export const lessons = (c: Course) => c.modules.flatMap((m, mi) => m.lessons.map((l) => ({ ...l, module: m.title, moduleIndex: mi })));
export const formatDuration = (min: number) => (min < 90 ? `about ${Math.max(5, Math.round(min / 5) * 5)} minutes` : `about ${Math.round(min / 30) / 2} hours`);
