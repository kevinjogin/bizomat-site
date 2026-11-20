// The Knowledge Centre's content, in one place (src/data/learn/types.ts describes it). Pages under /learn/, the search
// index (/learn/search.json) and tests/learn.test.ts read it from here. To add a guide or workflow: write its file in
// guides/ or workflows/, import it below and add it to the list.
import { SECTIONS, type Guide, type SectionId, type Workflow } from './types.ts';
import g_what_is_bizomat from './guides/what-is-bizomat.ts';
import g_account_and_sign_in from './guides/account-and-sign-in.ts';
import g_navigation from './guides/navigation.ts';
import g_companies from './guides/companies.ts';
import g_roles_and_permissions from './guides/roles-and-permissions.ts';
import g_dashboard from './guides/dashboard.ts';
import g_crm from './guides/crm.ts';
import g_finance from './guides/finance.ts';
import g_projects from './guides/projects.ts';
import g_products from './guides/products.ts';
import g_procurement from './guides/procurement.ts';
import g_inventory from './guides/inventory.ts';
import g_manufacturing from './guides/manufacturing.ts';
import g_quality from './guides/quality.ts';
import g_supply_chain from './guides/supply-chain.ts';
import g_maintenance from './guides/maintenance.ts';
import g_whs from './guides/whs.ts';
import g_reports from './guides/reports.ts';
import g_ai_search from './guides/ai-search.ts';
import g_automations from './guides/automations.ts';
import g_integrations from './guides/integrations.ts';
import g_cad_automation from './guides/cad-automation.ts';
import g_cad_ai_connection from './guides/cad-ai-connection.ts';
import g_company_administration from './guides/company-administration.ts';
import g_security from './guides/security.ts';
import g_data_management from './guides/data-management.ts';
import g_notifications from './guides/notifications.ts';
import g_trouble_sign_in from './guides/trouble-sign-in.ts';
import g_trouble_access from './guides/trouble-access.ts';
import g_trouble_records from './guides/trouble-records.ts';
import g_trouble_connections from './guides/trouble-connections.ts';
import w_lead_to_customer from './workflows/lead-to-customer.ts';
import w_deal_to_invoice from './workflows/deal-to-invoice.ts';
import w_deal_to_project from './workflows/deal-to-project.ts';
import w_invoice_to_payment from './workflows/invoice-to-payment.ts';
import w_project_to_completion from './workflows/project-to-completion.ts';
import w_procure_to_pay from './workflows/procure-to-pay.ts';
import w_bom_to_production from './workflows/bom-to-production.ts';
import w_engineering_change from './workflows/engineering-change.ts';
import w_make_to_order from './workflows/make-to-order.ts';
import w_sales_order_to_delivery from './workflows/sales-order-to-delivery.ts';
import w_production_to_quality from './workflows/production-to-quality.ts';
import w_maintenance_request_to_work_order from './workflows/maintenance-request-to-work-order.ts';
import w_preventive_maintenance from './workflows/preventive-maintenance.ts';
import w_incident_to_action from './workflows/incident-to-action.ts';
import w_cad_to_product from './workflows/cad-to-product.ts';

export const LEARN_HOME = '/learn/';
export const LEARN_NAME = 'Knowledge Centre';
export const LEARN_TITLE = 'BIZOMAT ERP Knowledge Centre';
export const GUIDES: readonly Guide[] = [g_what_is_bizomat, g_account_and_sign_in, g_navigation, g_companies, g_roles_and_permissions, g_dashboard, g_crm, g_finance, g_projects, g_products, g_procurement, g_inventory, g_manufacturing, g_quality, g_supply_chain, g_maintenance, g_whs, g_reports, g_ai_search, g_automations, g_integrations, g_cad_automation, g_cad_ai_connection, g_company_administration, g_security, g_data_management, g_notifications, g_trouble_sign_in, g_trouble_access, g_trouble_records, g_trouble_connections];
export const WORKFLOWS: readonly Workflow[] = [w_lead_to_customer, w_deal_to_invoice, w_deal_to_project, w_invoice_to_payment, w_project_to_completion, w_procure_to_pay, w_bom_to_production, w_engineering_change, w_make_to_order, w_sales_order_to_delivery, w_production_to_quality, w_maintenance_request_to_work_order, w_preventive_maintenance, w_incident_to_action, w_cad_to_product];

export { SECTIONS };
export const guideUrl = (id: string) => `/learn/${id}/`;
export const workflowUrl = (id: string) => `/learn/workflows/${id}/`;
export const sectionUrl = (id: SectionId) => (id === 'workflows' ? '/learn/workflows/' : `/learn/#${id}`);

export function guideById(id: string): Guide {
  const g = GUIDES.find((x) => x.id === id);
  if (!g) throw new Error(`Knowledge Centre: no guide "${id}"`);
  return g;
}

export function workflowById(id: string): Workflow {
  const w = WORKFLOWS.find((x) => x.id === id);
  if (!w) throw new Error(`Knowledge Centre: no workflow "${id}"`);
  return w;
}

export const guidesIn = (section: SectionId) => GUIDES.filter((g) => g.section === section);

/** Workflows that pass through a guide's module. */
export const workflowsThrough = (guideId: string) => WORKFLOWS.filter((w) => w.stages.some((s) => s.guide === guideId));

export interface SearchEntry {
  /** guide, tutorial, question, button, workflow */
  kind: 'guide' | 'tutorial' | 'question' | 'button' | 'workflow';
  title: string;
  /** Where it is: the guide or workflow's name. */
  in: string;
  text: string;
  url: string;
  status: Guide['status'];
}

/** Everything searchable: guides, their tutorials, questions and buttons, and the workflows. */
export function searchEntries(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const g of GUIDES) {
    const url = guideUrl(g.id);
    out.push({ kind: 'guide', title: g.title, in: SECTIONS.find((s) => s.id === g.section)!.title, text: [g.what, ...g.purpose, ...(g.keywords ?? []), ...(g.access?.path ?? [])].join(' '), url, status: g.status });
    for (const t of g.tutorials) out.push({ kind: 'tutorial', title: t.title, in: g.title, text: [t.outcome, ...t.steps.map((s) => `${s.title} ${s.where ?? ''}`)].join(' '), url: `${url}#tutorial-${t.id}`, status: g.status });
    g.faqs.forEach((f, i) => out.push({ kind: 'question', title: f.q, in: g.title, text: f.a, url: `${url}#${g.id}-q${i + 1}`, status: g.status }));
    for (const b of g.buttons ?? []) out.push({ kind: 'button', title: b.label, in: g.title, text: [b.does, b.when ?? '', b.after ?? ''].join(' '), url: `${url}#buttons`, status: g.status });
  }
  for (const w of WORKFLOWS) {
    const url = workflowUrl(w.id);
    out.push({ kind: 'workflow', title: w.title, in: 'Workflows', text: [w.summary, ...w.stages.map((s) => `${s.label} ${s.detail}`), ...(w.keywords ?? [])].join(' '), url, status: w.status });
    w.faqs.forEach((f, i) => out.push({ kind: 'question', title: f.q, in: w.title, text: f.a, url: `${url}#${w.id}-q${i + 1}`, status: w.status }));
  }
  return out;
}

/** The name of a page an answer links to: a guide's or workflow's title, else the path itself. */
export function linkLabel(href: string): string {
  const path = href.split('#')[0].split('?')[0];
  if (path === LEARN_HOME) return LEARN_NAME;
  if (path === '/learn/workflows/') return 'Workflows';
  const w = path.match(/^\/learn\/workflows\/([a-z0-9-]+)\/$/);
  if (w) return WORKFLOWS.find((x) => x.id === w[1])?.title ?? href;
  const g = path.match(/^\/learn\/([a-z0-9-]+)\/$/);
  if (g) return GUIDES.find((x) => x.id === g[1])?.title ?? href;
  return href;
}

/** An answer's text in parts: plain text, and links written as a path in brackets, e.g. (/learn/crm/) or
 *  (see /learn/crm/). */
export function answerParts(text: string): ({ text: string } | { href: string; label: string })[] {
  const link = /^\((?:see )?(\/[a-z0-9/#?=_.-]*)\)$/i;
  return text
    .split(/(\((?:see )?\/[a-z0-9/#?=_.-]*\))/i)
    .filter((p) => p !== '')
    .map((p) => {
      const m = p.match(link);
      return m ? { href: m[1], label: linkLabel(m[1]) } : { text: p };
    });
}
