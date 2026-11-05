// Real product screens for the Engine Room (/engine-room/), /cad/ and /work/. Each was captured from the running application (a
// local instance with example data, never a customer's), in Chromium at 1440 x 900. A screen whose file is not in
// public/ is skipped at build time, so a page never links a missing image.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface Screenshot { src: string; product: 'cad' | 'work'; title: string; caption: string }

const ALL: readonly Screenshot[] = [
  { src: '/proof-of-work/product/cad-dashboard.webp', product: 'cad', title: 'CAD Automation: Home', caption: 'The signed-in home: connection status, set-up steps and recent activity.' },
  { src: '/proof-of-work/product/cad-assistant.webp', product: 'cad', title: 'CAD Automation: CAD Assistant', caption: 'The connector address for AI apps, connected apps and example requests.' },
  { src: '/proof-of-work/product/cad-solidworks.webp', product: 'cad', title: 'CAD Automation: SOLIDWORKS', caption: 'The installer, paired computers and how the add-in connects.' },
  { src: '/proof-of-work/product/cad-tools.webp', product: 'cad', title: 'CAD Automation: Tools', caption: 'Every tool the assistant can call, in plain words.' },
  { src: '/proof-of-work/product/cad-overview.webp', product: 'cad', title: 'CAD Automation: product page', caption: 'The application\'s own product page.' },
  { src: '/proof-of-work/product/cad-signin.webp', product: 'cad', title: 'CAD Automation: sign in', caption: 'Sign-in for people and for AI apps.' },
  { src: '/proof-of-work/product/work-table.webp', product: 'work', title: 'Project Management: board, Table view', caption: 'Groups, items, owners, statuses and dates on one board.' },
  { src: '/proof-of-work/product/work-kanban.webp', product: 'work', title: 'Project Management: Kanban view', caption: 'The same items as cards, by status.' },
  { src: '/proof-of-work/product/work-timeline.webp', product: 'work', title: 'Project Management: Timeline', caption: 'Dates and dependencies on a Gantt timeline.' },
  { src: '/proof-of-work/product/work-dashboard.webp', product: 'work', title: 'Project Management: Dashboard', caption: 'Widgets computed from live board data.' },
  { src: '/proof-of-work/product/work-document.webp', product: 'work', title: 'Project Management: Document', caption: 'A rich-text document linked to the work.' },
  { src: '/proof-of-work/product/work-mywork.webp', product: 'work', title: 'Project Management: My Work', caption: 'Everything assigned to you, across boards.' },
  { src: '/proof-of-work/product/work-signin.webp', product: 'work', title: 'Project Management: sign in', caption: 'Sign in with an existing account.' },
];

const exists = (src: string) => existsSync(join(process.cwd(), 'public', src));
export const screenshots = (product?: Screenshot['product']) => ALL.filter((s) => (!product || s.product === product) && exists(s.src));
