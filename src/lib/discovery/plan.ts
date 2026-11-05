// BIZOMAT "Your Solution Path": turns a question into ordered steps, each with what to do, why, what to read, which tool
// to use, the inputs, the expected output and how to check it.
//
// Facts and suggestions are kept apart:
//   - Tools, readings, inputs, outputs and checks are catalogue facts: the tool's own fields, the outputs its guide
//     lists and the check its guide gives (/discovery-details.json), and readings joined to a tool by a reviewed
//     knowledge link (marked "verified").
//   - The objective, the order of the steps, "what to do" and "why" are recommendations, from the AI step when it
//     answers (src/server/discover/handler.ts) or from the workflow for the question type below when it does not.
//   - Assumptions and missing information come only from the AI step and are labelled as such.
// Nothing is calculated here: every number comes from a BIZOMAT tool when the visitor runs it.
import { entryById, verifiedReadings, type Engine, type Hit, type Outcome } from './search.ts';

export type QuestionType = 'calculation' | 'troubleshooting' | 'design' | 'manufacturing' | 'business' | 'learning';
export const QUESTION_TYPES: QuestionType[] = ['calculation', 'troubleshooting', 'design', 'manufacturing', 'business', 'learning'];
export const TYPE_LABEL: Record<QuestionType, string> = {
  calculation: 'Calculation', troubleshooting: 'Troubleshooting', design: 'Engineering design',
  manufacturing: 'Manufacturing', business: 'Business decision', learning: 'Learning and reference',
};

/** Per-tool facts from /discovery-details.json: input labels (i, with m more), outputs (o) and a check sentence (c). */
export interface ToolDetail { i: string[]; m: number; o: string[]; c: string }
export interface DiscoveryDetails { v: 1; tools: Record<string, ToolDetail> }

/** The AI step's plan, already restricted by the Worker to catalogue ids (see parseIntent). */
export interface AiPlan {
  type?: QuestionType;
  steps?: { do: string; why?: string; tools?: string[]; reads?: string[]; need?: string[]; check?: string }[];
  missing?: string[];
  assumptions?: string[];
  outcome?: string;
}

export interface PathLink { title: string; url: string; context?: string; kind: Hit['kind']; verified?: boolean; app?: string }
export interface PathStep {
  do: string;
  why: string;
  reads: PathLink[];
  tools: PathLink[];
  /** Inputs: the tool's own fields ("tool"), information to gather ("guide": workflow or AI suggestion). */
  inputs: string[];
  inputsMore: number;
  inputsFrom: 'tool' | 'guide' | 'none';
  output: string[];
  /** How to check: the tool guide's own words (fact) and/or a suggested check. */
  checkFact?: string;
  checkTip?: string;
  /** No catalogue resource fits this step yet. */
  gap?: string;
}
export interface SolutionPath {
  type: QuestionType;
  typeLabel: string;
  source: 'ai' | 'workflow';
  steps: PathStep[];
  missing: string[];
  assumptions: string[];
  outcome: string;
}

// ---------- Question type ----------
const RULES: [QuestionType, RegExp][] = [
  ['business', /\b(cost|costs|costing|money|price|pricing|quote|quoting|margin|markup|profit|break.?even|brake even|invest|investment|roi|npv|irr|payback|lease|leasing|budget|cash|staff|staffing|hire|business|revenue|sales|worth (it|buying)|afford)\b/],
  ['troubleshooting', /\b(why|keeps?|failing|fails?|failure|failed|broke|breaking|problem|issue|fault|wearing|worn|vibrat\w*|noisy|noise|leak\w*|overheat\w*|crack\w*|jam\w*|reject\w*|defects?|scrap|downtime|stoppages?|idle|not working|troubleshoot\w*|root cause|unreliable)\b/],
  ['learning', /\b(learn|learning|understand|explain|introduction|basics|teach me|how does .{1,40} work)\b/],
  ['manufacturing', /\b(machining|machine shop|cnc|mill|milling|turning|lathe|drill|drilling|cutter|cutting|feeds?|spindle|sheet metal|bend allowance|bending|casting|moulding|molding|stamping|laser cut\w*|production|cycle time|oee|set.?up|process capability|cpk|spc|inspection|throughput)\b/],
  ['calculation', /\b(calculate|calculation|compute|work out|how (much|many|long|fast|far|big|hot)|what (rpm|torque|speed|size|pressure|force)|convert|conversion|formula|rate)\b/],
  ['design', /\b(design|designing|size|sizing|select|selection|choose|specify|beam|shaft|bolt|bearing|spring|gear|weld|deflect\w*|stress|load|pressure vessel|cylinder|tolerance|fits?|safety factor)\b/],
  ['learning', /\b(reference|references|book|books|reading)\b/],
];
/** The question's type from its own words (used when the AI step does not say). */
export function classify(question: string): QuestionType {
  const q = question.toLowerCase();
  for (const [type, re] of RULES) if (re.test(q)) return type;
  return 'calculation';
}

// ---------- Workflows: the shape of a good answer for each type ----------
type Role = 'gather' | 'read' | 'tool' | 'check-tool' | 'check';
interface Template { role: Role; do: string; why: string; need?: string[] }
const T = (role: Role, d: string, why: string, need?: string[]): Template => ({ role, do: d, why, need });
export const WORKFLOWS: Record<QuestionType, { steps: Template[]; outcome: string }> = {
  calculation: {
    steps: [
      T('read', 'Read how the method works', 'So you know which inputs matter and what the answer means before you enter numbers.'),
      T('tool', 'Calculate with {tool}', 'The tool does the arithmetic and shows its method, so the result can be checked.'),
      T('check', 'Check the result', 'A calculated value is only as good as its inputs and the method’s limits.'),
    ],
    outcome: 'A calculated answer from {tool}, with its method shown and checked against the tool’s stated limits.',
  },
  troubleshooting: {
    steps: [
      T('gather', 'Describe the symptom and collect the facts', 'A clear record of what happens, when and how often narrows the causes.', ['What happens, when and how often', 'Operating conditions and loads', 'What changed recently (parts, material, settings, people)']),
      T('read', 'Understand the likely causes', 'Knowing the mechanisms behind the symptom tells you what to measure.'),
      T('tool', 'Quantify the problem with {tool}', 'Putting a number on the effect shows whether a fix is worth it and gives a baseline.'),
      T('check-tool', 'Confirm the fix with {tool}', 'Run the same check after the change to prove it worked.'),
    ],
    outcome: 'A measured baseline for the problem, its likely causes and a check that shows whether the fix worked.',
  },
  design: {
    steps: [
      T('gather', 'Set the requirements', 'Loads, limits and the standard you work to decide what “good enough” means.', ['Loads and operating conditions', 'Material and main dimensions', 'Required safety factor, standard or code']),
      T('read', 'Choose and understand the design method', 'The method sets which checks apply and where its limits are.'),
      T('tool', 'Size it with {tool}', 'The tool applies the method to your numbers and shows the working.'),
      T('check-tool', 'Cross-check with {tool}', 'A second tool checks a related limit, so one calculation is not the whole answer.'),
    ],
    outcome: 'A sized design from {tool}, with margins checked and the method’s limits noted for review.',
  },
  manufacturing: {
    steps: [
      T('read', 'Understand the process', 'Knowing what drives quality, time and cost in the process tells you which settings matter.'),
      T('tool', 'Set the parameters with {tool}', 'The tool turns your machine, material and tooling data into starting values.'),
      T('check-tool', 'Cross-check with {tool}', 'A related tool checks another side of the same job, such as tooling, time or quality.'),
      T('check', 'Prove it on the job', 'Starting values need a trial cut, first-off inspection or short run before production.'),
    ],
    outcome: 'Starting process settings from {tool}, checked for time, cost or capability, ready for a trial.',
  },
  business: {
    steps: [
      T('gather', 'Define the decision and the options', 'A decision is only as clear as the options and numbers being compared.', ['The options you are comparing', 'Costs, prices and volumes for each', 'The time horizon and your hurdle rate or target']),
      T('read', 'Understand the method', 'The method shows which costs count and how to treat time and risk.'),
      T('tool', 'Run the numbers with {tool}', 'The tool calculates the measures so each option is compared the same way.'),
      T('check-tool', 'Cross-check with {tool}', 'A second measure shows whether the answer holds when you look at it another way.'),
    ],
    outcome: 'A like-for-like comparison of your options from {tool}, tested for sensitivity, to support the decision.',
  },
  learning: {
    steps: [
      T('read', 'Start with the core reading', 'Builds the concept with worked numbers.'),
      T('read', 'Go deeper', 'A second reading covers the method from another angle or in more detail.'),
      T('tool', 'Try it with {tool}', 'Applying the method to your own numbers is the quickest way to understand it.'),
    ],
    outcome: 'An understanding of the topic from the readings, tried out on your own numbers with {tool}.',
  },
};

// ---------- Building the path ----------
const link = (h: Hit, verified = false): PathLink => ({ title: h.title, url: h.url, context: h.context, kind: h.kind, verified: verified || undefined, ...(h.kind === 'tool' && h.secondary ? { app: h.secondary.url } : {}) });

function toolStep(e: Engine, details: DiscoveryDetails | null, tool: Hit | undefined, base: Omit<PathStep, 'inputs' | 'inputsMore' | 'inputsFrom' | 'output'> & { need?: string[] }, relevant?: Set<string>): PathStep {
  const d = tool ? details?.tools[tool.id] : undefined;
  const step: PathStep = { ...base, inputs: [], inputsMore: 0, inputsFrom: 'none', output: [] };
  if (tool) {
    step.tools = step.tools.length ? step.tools : [link(tool)];
    if (d) { step.inputs = d.i; step.inputsMore = d.m; step.inputsFrom = 'tool'; step.output = d.o; if (d.c && !step.checkFact) step.checkFact = d.c; }
    // A reviewed reading that explains this tool and also matches the question, when the step has none.
    if (!step.reads.length && relevant) { const v = verifiedReadings(e, tool.id).find((r) => relevant.has(r.url)); if (v) step.reads = [link(v, true)]; }
  }
  if (!step.inputs.length && base.need?.length) { step.inputs = base.need; step.inputsFrom = 'guide'; }
  return step;
}

/** The path from the workflow for the question's type, filled with the best-matching catalogue entries. */
export function workflowPath(e: Engine, outcome: Outcome, details: DiscoveryDetails | null, type: QuestionType): SolutionPath {
  const wf = WORKFLOWS[type];
  const tools = [...outcome.tools];
  const matched = [...outcome.readings, ...outcome.related.filter((h) => h.kind !== 'tool' && h.kind !== 'page')];
  const relevant = new Set(matched.map((h) => h.url));
  // Readings to place: those that match the question, then reviewed readings of the leading tools.
  const seen = new Set<string>();
  const readings = [...matched, ...tools.slice(0, 2).flatMap((t) => verifiedReadings(e, t.id))].filter((h) => !seen.has(h.url) && seen.add(h.url));
  const used = new Set<string>();
  let ti = 0, ri = 0;
  const steps: PathStep[] = [];
  for (const t of wf.steps) {
    if (t.role === 'gather') { steps.push({ do: t.do, why: t.why, reads: [], tools: [], inputs: t.need ?? [], inputsMore: 0, inputsFrom: 'guide', output: [] }); continue; }
    if (t.role === 'read') {
      while (ri < readings.length && used.has(readings[ri].url)) ri++;
      const r = readings[ri++];
      if (r) used.add(r.url);
      steps.push(r ? { do: t.do, why: t.why, reads: [link(r)], tools: [], inputs: [], inputsMore: 0, inputsFrom: 'none', output: [] }
        : { do: t.do, why: t.why, reads: [], tools: [], inputs: [], inputsMore: 0, inputsFrom: 'none', output: [], gap: 'BIZOMAT does not have a reading that fits this step yet.' });
      continue;
    }
    if (t.role === 'check') {
      // The check step takes over the first tool's own check, so it is not shown twice.
      const firstTool = steps.find((s) => s.tools.length);
      const fact = firstTool?.checkFact;
      if (firstTool) firstTool.checkFact = undefined;
      steps.push({ do: t.do, why: t.why, reads: [], tools: [], inputs: [], inputsMore: 0, inputsFrom: 'none', output: [], checkFact: fact, checkTip: 'Compare the answer with a known case, a supplier figure or a measurement, and re-run it with your worst-case inputs.' });
      continue;
    }
    const tool = tools[ti++];
    if (!tool) {
      if (t.role === 'tool') steps.push({ do: t.do.replace(' with {tool}', ''), why: t.why, reads: [], tools: [], inputs: [], inputsMore: 0, inputsFrom: 'none', output: [], gap: 'BIZOMAT does not have a tool for this step yet.' });
      continue; // no second tool: skip the extra check rather than repeat the first
    }
    const step = toolStep(e, details, tool, { do: t.do.replace('{tool}', tool.title), why: t.why, reads: [], tools: [] }, relevant);
    if (step.reads[0]) { if (used.has(step.reads[0].url)) step.reads = []; else used.add(step.reads[0].url); }
    steps.push(step);
  }
  const firstTool = outcome.tools[0]?.title ?? 'the matching tool';
  return { type, typeLabel: TYPE_LABEL[type], source: 'workflow', steps: steps.slice(0, 6), missing: [], assumptions: [], outcome: wf.outcome.replace('{tool}', firstTool) };
}


/** The AI step's plan with every reference resolved to a real catalogue entry, or null when it is unusable. */
export function aiPath(e: Engine, plan: AiPlan, details: DiscoveryDetails | null, fallbackType: QuestionType): SolutionPath | null {
  const type = plan.type && QUESTION_TYPES.includes(plan.type) ? plan.type : fallbackType;
  const steps: PathStep[] = [];
  for (const s of plan.steps ?? []) {
    if (!s.do) continue;
    const tools = (s.tools ?? []).map((id) => entryById(e, id)).filter((h): h is Hit => h?.kind === 'tool').slice(0, 2);
    const reads = (s.reads ?? []).map((id) => entryById(e, id)).filter((h): h is Hit => Boolean(h) && h!.kind !== 'tool').slice(0, 2);
    const verified = new Set(tools.flatMap((t) => verifiedReadings(e, t.id).map((r) => r.url)));
    const step = toolStep(e, details, tools[0], {
      do: s.do, why: s.why ?? '', reads: reads.map((r) => link(r, verified.has(r.url))), tools: tools.map((t) => link(t)), need: s.need,
      checkTip: s.check,
    });
    if (!tools.length && s.need?.length) { step.inputs = s.need; step.inputsFrom = 'guide'; }
    steps.push(step);
  }
  if (steps.length < 2 || !steps.some((s) => s.tools.length || s.reads.length)) return null;
  return {
    type, typeLabel: TYPE_LABEL[type], source: 'ai', steps: steps.slice(0, 6),
    missing: (plan.missing ?? []).slice(0, 3), assumptions: (plan.assumptions ?? []).slice(0, 3),
    outcome: plan.outcome || WORKFLOWS[type].outcome.replace('{tool}', steps.find((s) => s.tools.length)?.tools[0].title ?? 'the matching tool'),
  };
}

/** The path to show: the AI's when it is usable, otherwise the workflow for the question type. Null when nothing fits. */
export function buildPath(e: Engine, question: string, outcome: Outcome, details: DiscoveryDetails | null, plan?: AiPlan | null): SolutionPath | null {
  if (outcome.mode === 'none' || (!outcome.tools.length && !outcome.readings.length)) return null;
  const type = plan?.type && QUESTION_TYPES.includes(plan.type) ? plan.type : classify(question);
  const fromAi = plan ? aiPath(e, plan, details, type) : null;
  return fromAi ?? workflowPath(e, outcome, details, type);
}
