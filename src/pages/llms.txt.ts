// /llms.txt: a plain summary of bizomat.ai for AI systems and AI search (the llmstxt.org convention: a title, a short
// summary, then sections of links). Built from the same sources as the pages (src/config/platform.ts and
// src/config/systems.ts), so it never says more than the site does: planned modules are called planned, Finance is not
// called certified, and there are no ratings, reviews or customer claims.
import type { APIContext } from 'astro';
import { PLATFORM, APP_LINKS } from '../config/platform.ts';
import { SITE } from '../config/site.ts';
import { SYSTEMS, SYSTEMS_HOME, STATUS_LABEL } from '../config/systems.ts';

export function llmsTxt(site: string): string {
  const base = site.replace(/\/$/, '');
  const abs = (path: string) => (/^https?:/.test(path) ? path : `${base}${path}`);
  const systems = SYSTEMS.map((s) => {
    const status = s.status === 'available' ? '' : ` (${STATUS_LABEL[s.status]})`;
    const note = s.statusNote ? ` ${s.statusNote}` : '';
    const guide = s.guide ? ` User guide: ${abs(s.guide)}` : '';
    return `- [${s.name}](${abs(s.url)}): ${s.kind}${status}. ${s.line}${note}${guide}`;
  });
  return `# ${PLATFORM.name}

> ${PLATFORM.description} ${PLATFORM.introduction}

${PLATFORM.name} (formerly ${PLATFORM.formerName.name}) makes business software for small and medium businesses, manufacturers, workshops and engineering teams, and keeps a free library of engineering, manufacturing and business resources. It is based in Australia. The software needs a ${PLATFORM.name} account; the resources are free and open to everyone, without signing in.

## Systems

The business software, each with a page and a user guide: ${abs(SYSTEMS_HOME)}

${systems.join('\n')}

Signed-in people use the systems inside ${PLATFORM.name} ERP: ${abs(APP_LINKS.erp.home)}

## What the software does not do

- ${PLATFORM.name} Finance does not connect to banks, make payments or lodge with the ATO, and it is not a certified tax, payroll or statutory accounting product. Its GST and BAS report is a worksheet to check before lodging.
- Modules labelled Planned on the Systems pages are designed but not built.

## Resources (free, no sign-in)

- [Resources](${abs('/resources/')}): every free resource in one place.
- [Tools](${abs('/tools/')}): engineering, manufacturing and business calculators, each with its method and a worked example.
- [Library](${abs('/reados/')}): technical books in short, practical chapters.
- [Guides](${abs('/library/')}): longer guides with worked examples.

## About

- [The Engine Room](${abs('/engine-room/')}): who builds ${PLATFORM.name}, a message from the founder, and real product screens.
- [Contact](${abs('/contact/')})
- [Privacy](${abs('/privacy/')}), [Terms](${abs('/terms/')}), [Disclaimer](${abs('/disclaimer/')})
`;
}

export function GET(context: APIContext) {
  return new Response(llmsTxt(String(context.site ?? SITE.url)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
