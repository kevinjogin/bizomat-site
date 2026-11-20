// Pages the design audit loads: one or more of every page template on the website (src/pages/), not all of the
// thousands of tool and Library pages. `key` pages get screenshots; `ci` pages are the ones the layout check in CI
// loads (npm run audit:layout). A new template belongs here; a page of an existing template does not. Systems and the Knowledge Centre are
// one page each (owner, 20 Nov 2026): their entries open one toggle each (#<system>-full, #<guide>) so its content is checked; the ?view= query makes each a
// page load of its own rather than a jump within the page the audit loaded before.
export const PAGES = [
  { path: '/', name: 'home', key: true, ci: true },
  { path: '/systems/', name: 'systems', key: true, ci: true },
  { path: '/systems/?view=erp-full#erp-full', name: 'system-erp', key: true, ci: true },
  { path: '/learn/', name: 'learn', key: true, ci: true },
  { path: '/learn/?view=procurement#procurement', name: 'learn-guide', key: true, ci: true },
  { path: '/learn/?view=workflow-procure-to-pay#workflow-procure-to-pay', name: 'learn-workflow', ci: true },
  { path: '/pricing/', name: 'pricing', key: true, ci: true },
  { path: '/systems/?view=crm-full#crm-full', name: 'system-crm', ci: true },
  { path: '/systems/?view=finance-full#finance-full', name: 'system-finance', ci: true },
  { path: '/systems/?view=projects-full#projects-full', name: 'system-projects', ci: true },
  { path: '/systems/?view=engineering-full#engineering-full', name: 'system-engineering', ci: true },
  { path: '/systems/?view=manufacturing-full#manufacturing-full', name: 'system-manufacturing', key: true, ci: true },
  { path: '/systems/?view=whs-full#whs-full', name: 'system-whs', key: true, ci: true },
  { path: '/resources/', name: 'resources', key: true, ci: true },
  { path: '/tools/', name: 'tools', key: true, ci: true },
  { path: '/tools/?tool=air-pipe-drop', name: 'tool-app', ci: true },
  { path: '/tools/air-pipe-drop/', name: 'tool-page', key: true, ci: true },
  { path: '/tools/rolling-resistance/', name: 'tool-page-2' },
  { path: '/tools/shearing-blade-force/', name: 'tool-page-3' },
  { path: '/reados/', name: 'library', key: true, ci: true },
  { path: '/reados/books/business-volume-09/', name: 'library-book', ci: true },
  { path: '/reados/books/business-volume-09/return-on-equity-and-leverage/', name: 'library-chapter', key: true, ci: true },
  { path: '/reados/collections/competitive-strategy-and-positioning/', name: 'library-collection' },
  { path: '/reados/collections/competitive-strategy-and-positioning/game-theory-when-others-decide-too/', name: 'library-collection-chapter' },
  { path: '/reados/publications/performance-solutions-by-the-numbers/', name: 'library-publication', ci: true },
  { path: '/reados/publications/performance-solutions-by-the-numbers/choosing-assessment-methods/', name: 'library-publication-chapter', ci: true },
  { path: '/library/', name: 'guides' },
  { path: '/library/read-the-numbers-understand-the-business/', name: 'guide-book' },
  { path: '/library/read-the-numbers-understand-the-business/measure-returns-not-just-growth/', name: 'guide-article' },
  { path: '/engine-room/', name: 'engine-room', key: true, ci: true },
  { path: '/contact/', name: 'contact', key: true, ci: true },
  { path: '/contact/sent/', name: 'contact-sent' },
  { path: '/contact/error/', name: 'contact-error' },
  { path: '/privacy/', name: 'privacy', ci: true },
  { path: '/terms/', name: 'terms' },
  { path: '/disclaimer/', name: 'disclaimer' },
  { path: '/search/', name: 'search', ci: true },
  { path: '/sign-in/', name: 'sign-in', key: true, ci: true },
  { path: '/no-such-page/', name: '404', ci: true, status: 404 },
  { path: '/industries/', name: 'industries' },
  { path: '/solutions/', name: 'solutions', ci: true },
  { path: '/services/', name: 'services', ci: true },
  { path: '/how-it-works/', name: 'how-it-works' },
  { path: '/factory-fix/', name: 'factory-fix' },
  { path: '/assessment/', name: 'assessment' },
  { path: '/assessment/received/', name: 'assessment-received' },
  { path: '/chat/', name: 'chat' },
];

export const VIEWPORTS = [1920, 1440, 1280, 1024, 768, 390, 360];
export const CI_VIEWPORTS = [1440, 390];
export const THEMES = ['light', 'dark'];

/** Paths the website hands to an application on bizomat.ai (src/worker.ts routeApps): not the website's pages. */
export const APP_PATH = /^\/(cad|tasks|crm|finance|company|system|erp|api|mcp|solidworks|downloads|\.well-known)(\/|$)/;
