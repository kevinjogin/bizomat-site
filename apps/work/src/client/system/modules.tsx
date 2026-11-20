// BIZOMAT ERP's modules and their own side menus (owner, 20 Nov 2026: "the sub components at side panel buttons are the
// same in all modules, so it needs dedicated buttons for each module"). The module rail (SuiteRail) picks the module;
// this side menu shows that module's sections only. The pages and their addresses are unchanged: Product Management is
// /c/<company>/products; Engineering groups Design (engineering changes and documents), CAD Automation, Manufacturing and
// Quality; Procurement is its own module; Warehouse groups Stock (Inventory) and Orders and dispatch (Supply Chain);
// Maintenance and Health and Safety hold only their own records. The server decides who may see what; this only links.
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { MODULE_DEFS } from '../../shared/erp-objects';
import { useMtMe } from './maintenance/api';
import { useWhsMe } from './whs/api';

export type ErpModule = 'dashboard' | 'product' | 'engineering' | 'procurement' | 'warehouse' | 'maintenance' | 'whs' | 'people' | 'catalogue';

// People and HR's modules (the modules framework, /c/<company>/m/<key>); every other /m/<key> is in All modules.
const PEOPLE = ['hr', 'recruitment', 'onboarding', 'training', 'performance', 'payroll'];
const LABELS: Record<string, string> = Object.fromEntries(MODULE_DEFS.map((m) => [m.key, m.label]));

/** The module of a page inside a company, from its path after /c/<company>/ (for example "products/changes/x"). */
export function moduleOf(rest: string): ErpModule {
  const r = rest.replace(/^\/+/, '');
  if (/^(products\/(changes|documents|cad)|cad|engineering|manufacturing|quality)(\/|$)/.test(r)) return 'engineering';
  if (/^products(\/|$)/.test(r)) return 'product';
  if (/^procurement(\/|$)/.test(r)) return 'procurement';
  if (/^(inventory|supply-chain|warehouse)(\/|$)/.test(r)) return 'warehouse';
  if (/^maintenance(\/|$)/.test(r)) return 'maintenance';
  if (/^whs(\/|$)/.test(r)) return 'whs';
  if (new RegExp(`^m/(${PEOPLE.join('|')})(/|$)`).test(r)) return 'people';
  if (/^(modules|inbox|m)(\/|$)/.test(r)) return 'catalogue';
  return 'dashboard';
}

export const MODULE_TITLES: Record<ErpModule, string> = {
  dashboard: 'Dashboard',
  product: 'Product Management',
  engineering: 'Engineering',
  procurement: 'Procurement',
  warehouse: 'Warehouse',
  maintenance: 'Maintenance',
  whs: 'Health and Safety',
  people: 'People and HR',
  catalogue: 'All modules',
};

/** Each module's guide in the Knowledge Centre. */
const GUIDES: Record<ErpModule, string> = {
  dashboard: 'dashboard',
  product: 'products',
  engineering: 'products',
  procurement: 'procurement',
  warehouse: 'inventory',
  maintenance: 'maintenance',
  whs: 'whs',
  people: 'people-hr',
  catalogue: 'all-modules',
};

interface Item {
  /** The page, under /c/<company>/. */
  to: string;
  label: string;
  icon: string;
  /** Which paths (under /c/<company>/) count as this item; default: the page and anything below it. */
  match?: RegExp;
  /** Not built yet: shown with its status, never as a link. */
  planned?: boolean;
}
interface Group {
  heading?: string;
  items: Item[];
}

const exact = (p: string) => new RegExp(`^${p.replace(/[/-]/g, (c) => `\\${c}`)}$`);

function menu(module: ErpModule, o: { cad: boolean; admin: boolean; mtReports: boolean; whsView: boolean }): Group[] {
  switch (module) {
    case 'product':
      return [
        {
          items: [
            { to: 'products', label: 'Products', icon: 'diamond', match: /^products(\/(?!changes|documents|cad|analysis)[^/]+)?$/ },
          ],
        },
        {
          heading: 'Analysis',
          items: [
            { to: 'products/analysis', label: 'Sales and margin analysis', icon: 'chart', match: exact('products/analysis') },
            { to: 'products/analysis/stock', label: 'Stock against sales', icon: 'archive', match: exact('products/analysis/stock') },
          ],
        },
      ];
    case 'engineering':
      return [
        { items: [{ to: 'engineering', label: 'Overview', icon: 'home', match: exact('engineering') }] },
        {
          heading: 'Design',
          items: [
            { to: 'products/changes', label: 'Engineering changes', icon: 'history' },
            { to: 'products/documents', label: 'Documents', icon: 'file' },
          ],
        },
        { heading: 'CAD Automation', items: [{ to: o.cad ? 'cad' : 'products/cad', label: 'CAD Automation', icon: 'bolt', match: /^(cad|products\/cad)(\/|$)/ }] },
        {
          heading: 'Manufacturing',
          items: [
            { to: 'manufacturing', label: 'Orders', icon: 'layers', match: /^manufacturing(\/orders(\/.*)?)?$/ },
            { to: 'manufacturing/shop-floor', label: 'Shop floor', icon: 'play' },
            { to: 'manufacturing/planning', label: 'Planning', icon: 'calendar' },
            { to: 'manufacturing/work-centres', label: 'Work centres', icon: 'settings' },
            { to: 'manufacturing/routings', label: 'Routings', icon: 'list' },
          ],
        },
        {
          heading: 'Quality',
          items: [
            { to: 'quality', label: 'Quality overview', icon: 'home', match: exact('quality') },
            { to: 'quality/inspections', label: 'Inspections', icon: 'checkSquare' },
            { to: 'quality/ncrs', label: 'Nonconformances', icon: 'alert' },
            { to: 'quality/capas', label: 'Corrective actions', icon: 'target' },
            { to: 'quality/plans', label: 'Inspection plans', icon: 'list' },
          ],
        },
      ];
    case 'procurement':
      return [
        {
          items: [
            { to: 'procurement', label: 'Suppliers', icon: 'building', match: /^procurement(\/suppliers(\/.*)?)?$/ },
            { to: 'procurement/requisitions', label: 'Requisitions', icon: 'doc' },
            { to: 'procurement/rfqs', label: 'Quotations', icon: 'message' },
            { to: 'procurement/purchase-orders', label: 'Purchase orders', icon: 'briefcase' },
            { to: 'procurement/receipts', label: 'Receipts', icon: 'inbox' },
          ],
        },
      ];
    case 'warehouse':
      return [
        { items: [{ to: 'warehouse', label: 'Overview', icon: 'home', match: exact('warehouse') }] },
        {
          heading: 'Stock',
          items: [
            { to: 'inventory', label: 'Stock', icon: 'layers', match: /^inventory(\/stock(\/.*)?)?$/ },
            { to: 'inventory/warehouses', label: 'Warehouses', icon: 'map' },
            { to: 'inventory/movements', label: 'Movements', icon: 'activity' },
            { to: 'inventory/adjustments', label: 'Adjustments', icon: 'edit' },
            { to: 'inventory/counts', label: 'Counts', icon: 'checkSquare' },
            { to: 'inventory/valuation', label: 'Valuation', icon: 'dollar' },
            { to: 'inventory/scan', label: 'Warehouse screen', icon: 'search' },
          ],
        },
        {
          heading: 'Orders and dispatch',
          items: [
            { to: 'supply-chain', label: 'Dispatch overview', icon: 'home', match: exact('supply-chain') },
            { to: 'supply-chain/orders', label: 'Sales orders', icon: 'briefcase' },
            { to: 'supply-chain/floor', label: 'Pick and dispatch', icon: 'check' },
            { to: 'supply-chain/shipments', label: 'Shipments', icon: 'globe' },
            { to: 'supply-chain/schedule', label: 'Delivery schedule', icon: 'calendar' },
            { to: 'supply-chain/returns', label: 'Returns', icon: 'refresh' },
            { to: 'supply-chain/carriers', label: 'Carriers', icon: 'map' },
          ],
        },
      ];
    case 'maintenance':
      return [
        {
          items: [
            { to: 'maintenance', label: 'Overview', icon: 'home', match: exact('maintenance') },
            { to: 'maintenance/requests', label: 'Requests', icon: 'inbox' },
            { to: 'maintenance/work-orders', label: 'Work orders', icon: 'wrench' },
            { to: 'maintenance/assets', label: 'Assets', icon: 'layers' },
            { to: 'maintenance/preventive', label: 'Preventive maintenance', icon: 'calendar' },
            { to: 'maintenance/checklists', label: 'Checklists', icon: 'list' },
            { to: 'maintenance/prestart', label: 'Prestart checks', icon: 'checkSquare' },
            { to: 'maintenance/scan', label: 'Scan an asset', icon: 'eye' },
            ...(o.mtReports ? [{ to: 'maintenance/reports', label: 'Reports', icon: 'chart' }] : []),
            { to: 'maintenance/settings', label: 'Settings', icon: 'settings' },
          ],
        },
      ];
    case 'whs':
      return [
        {
          items: [
            { to: 'whs', label: 'Overview', icon: 'home', match: exact('whs') },
            { to: 'whs/hazards', label: 'Hazards', icon: 'alert' },
            { to: 'whs/incidents', label: 'Incidents', icon: 'flag' },
            ...(o.whsView ? [{ to: 'whs/risk', label: 'Risk assessments', icon: 'target' }] : []),
            { to: 'whs/actions', label: 'Actions', icon: 'checkSquare' },
            ...(o.whsView ? [{ to: 'whs/jurisdictions', label: 'Jurisdictions', icon: 'globe' }, { to: 'whs/settings', label: 'Settings', icon: 'settings' }] : []),
          ],
        },
      ];
    case 'people':
      return [{ items: PEOPLE.map((k) => ({ to: `m/${k}`, label: LABELS[k] ?? k, icon: k === 'hr' ? 'users' : k === 'payroll' ? 'dollar' : k === 'training' ? 'target' : 'user' })) }];
    case 'catalogue':
      return [
        {
          items: [
            { to: 'modules', label: 'All modules', icon: 'layers', match: /^modules(\/|$)/ },
            { to: 'inbox', label: 'Waiting for me', icon: 'inbox', match: /^inbox$/ },
          ],
        },
      ];
    default:
      return [
        {
          items: [
            { to: 'home', label: 'Dashboard', icon: 'home', match: /^(home)?$/ },
            { to: 'inbox', label: 'Waiting for me', icon: 'inbox', match: /^inbox$/ },
            { to: 'settings', label: 'Company', icon: 'building' },
            ...(o.admin ? [{ to: 'company-admin', label: 'Company Admin', icon: 'users' }] : []),
          ],
        },
      ];
  }
}

/** The side menu of the module the page belongs to. */
export function ModuleMenu({ companyId, cad, admin, footer, shortcuts }: { companyId: string; cad: boolean; admin: boolean; footer: ReactNode; shortcuts?: ReactNode }) {
  const location = useLocation();
  const prefix = `/c/${companyId}/`;
  const rest = location.pathname.startsWith(prefix) ? location.pathname.slice(prefix.length).replace(/\/+$/, '') : '';
  const module = moduleOf(rest);
  const mt = useMtMe(module === 'maintenance' ? companyId : '');
  const whs = useWhsMe(module === 'whs' ? companyId : '');
  // A new module's page (/m/<key>) shows under the person's recent and favourite modules below.
  const groups = menu(module, { cad, admin, mtReports: !!mt.data?.can.reports, whsView: !!whs.data?.can.view });
  return (
    <>
      <div className="nav-section erp-module-title">{MODULE_TITLES[module]}</div>
      {groups.map((g, i) => (
        <div key={g.heading ?? i} className="erp-menu-group">
          {g.heading ? <div className="nav-section">{g.heading}</div> : null}
          {g.items.map((it) => {
            if (it.planned) {
              return (
                <span key={it.label} className="nav-item erp-menu-planned" aria-disabled="true" title="Planned: not built yet">
                  <Icon name={it.icon} /> <span className="grow">{it.label}</span> <span className="badge">Planned</span>
                </span>
              );
            }
            const active = (it.match ?? new RegExp(`^${it.to.replace(/[/-]/g, (c) => `\\${c}`)}(\\/|$)`)).test(rest);
            return (
              <Link key={it.to + it.label} to={`${prefix}${it.to}`} className={`nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
                <Icon name={it.icon} /> {it.label}
              </Link>
            );
          })}
        </div>
      ))}
      {/* The person's favourite modules, else the ones used last (All modules' stars). */}
      {(module === 'dashboard' || module === 'catalogue') && shortcuts ? <div className="erp-menu-group">{shortcuts}</div> : null}
      {module !== 'dashboard' ? (
        <>
          <div className="nav-section">BIZOMAT ERP</div>
          <Link to={`${prefix}home`} className="nav-item"><Icon name="home" /> Dashboard</Link>
        </>
      ) : null}
      {footer}
      {/* The Knowledge Centre (owner, 20 Nov 2026): this module's guide, on the website. */}
      <div className="nav-section">Help</div>
      <a className="nav-item" href={`https://bizomat.ai/learn/#${GUIDES[module]}`} rel="noopener" title={`${MODULE_TITLES[module]} in the BIZOMAT ERP Knowledge Centre`}>
        <Icon name="help" /> {module === 'dashboard' ? 'Knowledge Centre' : `${MODULE_TITLES[module]} guide`}
      </a>
    </>
  );
}
