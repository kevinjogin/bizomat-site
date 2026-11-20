// docs/erp/MODULES.md from the catalogue (npx tsx scripts/erp/modules-doc.ts writes it; test-node/erp-modules-doc.test.ts checks it).
import { AREAS, CATALOGUE, STATUS_LABELS } from './erp-catalogue';
import { MODULE_BY_KEY, OBJECT_BY_KEY } from './erp-objects';

const cell = (s: string | undefined) => (s ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim();

export function modulesMarkdown(): string {
  const out: string[] = [];
  const count = (s: string) => CATALOGUE.filter((e) => e.status === s).length;
  out.push('# BIZOMAT ERP: the 97-module catalogue');
  out.push('');
  out.push('Generated from `apps/work/src/shared/erp-catalogue.ts` by `npx tsx scripts/erp/modules-doc.ts`; do not edit by hand');
  out.push('(`apps/work/test-node/erp-modules-doc.test.ts` fails when this file is out of step). The same catalogue is the ERP\'s');
  out.push('All modules page (`/erp/c/<company>/modules`) and its API (`GET /api/erp/c/<company>/catalogue`).');
  out.push('');
  out.push(`Totals: ${CATALOGUE.length} modules; ${count('live')} live, ${count('improved')} live and extended, ${count('new')} new, ${count('partial')} partly built, ${count('planned')} planned.`);
  out.push('');
  out.push('Statuses: Live (built, tested and live before 20 Nov 2026), Live, extended (extended on 20 Nov 2026), New (built on');
  out.push('20 Nov 2026 on the modules framework, `apps/work/src/shared/erp-objects`), Partly built (what is missing is named),');
  out.push('Planned (not built). Implemented 20 Nov 2026 for New and extended modules; production test status is in');
  out.push('`docs/erp/STATUS.md`.');
  for (const [area, label] of Object.entries(AREAS)) {
    out.push('');
    out.push(`## ${area}. ${label}`);
    out.push('');
    out.push('| No. | Module | Status | Opens at | What exists | Not yet | Builds on | Tests |');
    out.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const e of CATALOGUE.filter((x) => x.area === area)) {
      const m = e.module ? MODULE_BY_KEY[e.module] : null;
      const objects = m ? `Records: ${m.objects.map((k) => OBJECT_BY_KEY[k].plural.toLowerCase()).join(', ')}.` : '';
      out.push(`| ${e.n} | ${cell(e.name)} | ${STATUS_LABELS[e.status]} | ${e.path ? `\`${e.path.startsWith('/c/') || e.path.startsWith('/reports') ? `/erp${e.path}` : e.path}\`` : ''} | ${cell(e.now)}${objects ? ` ${cell(objects)}` : ''} | ${cell(e.gaps)} | ${(e.depends ?? []).join(', ')} | ${cell(e.evidence)} |`);
    }
  }
  out.push('');
  return out.join('\n');
}
