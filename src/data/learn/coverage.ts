// The Knowledge Centre's coverage tracker (owner's brief of 20 Nov 2026, "documentation coverage"): for every guide and
// workflow, what it covers and when it was last checked against the application. docs/learn/COVERAGE.md is generated from
// this (node scripts/learn/coverage.ts) and tests/learn.test.ts fails when the file is out of step with the content.
import { FEATURE_STATUS } from '../../config/systems.ts';
import { GUIDES, SECTIONS, WORKFLOWS, guideUrl, workflowUrl } from './index.ts';

const yes = (b: boolean) => (b ? 'yes' : 'no');

export function coverageMarkdown(): string {
  const lines: string[] = [];
  const tutorials = GUIDES.reduce((n, g) => n + g.tutorials.length, 0) + WORKFLOWS.length;
  const steps = GUIDES.reduce((n, g) => n + g.tutorials.reduce((m, t) => m + t.steps.length, 0), 0) + WORKFLOWS.reduce((n, w) => n + w.tutorial.steps.length, 0);
  const questions = GUIDES.reduce((n, g) => n + g.faqs.length, 0) + WORKFLOWS.reduce((n, w) => n + w.faqs.length, 0);
  const buttons = GUIDES.reduce((n, g) => n + (g.buttons?.length ?? 0), 0);
  lines.push('# Knowledge Centre coverage');
  lines.push('');
  lines.push('Generated from `src/data/learn/` by `node scripts/learn/coverage.ts`; do not edit by hand (`tests/learn.test.ts`');
  lines.push('fails when this file is out of step). The Knowledge Centre is at https://bizomat.ai/learn/.');
  lines.push('');
  lines.push(`Totals: ${GUIDES.length} guides, ${WORKFLOWS.length} workflows, ${tutorials} tutorials (${steps} steps), ${questions} questions, ${buttons} buttons explained.`);
  lines.push('');
  lines.push('Columns: A what, B purpose, C who, D access path, E tutorials (steps), F buttons, G questions, H related guides,');
  lines.push('I workflows, J link into the ERP. "Not yet" counts the parts listed as planned or in development.');
  for (const s of SECTIONS) {
    if (s.id === 'workflows') continue;
    const list = GUIDES.filter((g) => g.section === s.id);
    lines.push('');
    lines.push(`## ${s.title}`);
    lines.push('');
    lines.push('| Guide | Status | D access | E tutorials (steps) | F buttons | G questions | H related | I workflows | Not yet | Checked |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const g of list) {
      const st = g.tutorials.reduce((m, t) => m + t.steps.length, 0);
      const wf = new Set([...(g.workflows ?? []), ...WORKFLOWS.filter((w) => w.stages.some((x) => x.guide === g.id)).map((w) => w.id)]).size;
      lines.push(`| [${g.title}](${guideUrl(g.id)}) | ${FEATURE_STATUS[g.status].label} | ${yes(!!g.access)} | ${g.tutorials.length} (${st}) | ${g.buttons?.length ?? 0} | ${g.faqs.length} | ${g.related.length} | ${wf} | ${g.notYet?.length ?? 0} | ${g.updated} |`);
    }
  }
  lines.push('');
  lines.push('## Workflows');
  lines.push('');
  lines.push('| Workflow | Status | Stages | Tutorial steps | Questions | Checked |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const w of WORKFLOWS) {
    lines.push(`| [${w.title}](${workflowUrl(w.id)}) | ${FEATURE_STATUS[w.status].label} | ${w.stages.map((x) => x.label).join(' > ')} | ${w.tutorial.steps.length} | ${w.faqs.length} | ${w.updated} |`);
  }
  lines.push('');
  return lines.join('\n');
}
