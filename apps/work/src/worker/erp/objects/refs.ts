// References from the modules framework's records to shared master records: people, departments, customers (the
// company's one customer record: its CRM companies and the Finance customers they are billed as), suppliers, products,
// warehouses, maintenance assets, Projects boards, ERP orders and shipments, Finance business workspaces (a legal entity's
// books, which may be another company's: only those the person may read there), and other framework records. Nothing is
// copied: a record keeps the id and the label it was given (erp_object_refs), and every new reference is checked to belong
// to the same company, with the tool's own permissions where it has them (the CRM and Finance).

import { HttpError } from '../../lib/util';
import { companyTools } from '../../company/access';
import { assertRecord as crmAssertRecord, loadAccess as crmAccess, scopeSql as crmScopeSql } from '../../crm/access';
import { hasPerm as finHasPerm } from '../../fin/access';
import { companyPeople, type ErpAccess } from '../access';
import { crmOrgsFor } from '../sales';
import { financeOrgsFor, maybeFin } from '../suppliers';
import { likeOf } from '../util';
import { OBJECT_BY_KEY, type RefKind } from '../../../shared/erp-objects';

export interface RefOption {
  id: string;
  label: string;
  sub?: string;
}

type User = { id: string; name: string };

/** The company's Projects workspaces: a registered company's, the example's, or those its owner keeps for themselves. */
export async function projectWorkspaces(db: D1Database, a: ErpAccess): Promise<string[]> {
  if (a.kind === 'registered') {
    const ws = (await companyTools(db, a.companyId)).tasks;
    return ws ? [ws] : [];
  }
  if (a.kind === 'demo') {
    const r = await db.prepare('SELECT workspace_id FROM sys_demo WHERE company_id = ? AND user_id = ?').bind(a.companyId, a.userId).first<{ workspace_id: string | null }>();
    return r?.workspace_id ? [r.workspace_id] : [];
  }
  const rows = await db
    .prepare(
      `SELECT w.id FROM workspaces w JOIN workspace_members m ON m.workspace_id = w.id AND m.user_id = ? AND m.role = 'owner'
        WHERE w.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM co_tools t WHERE t.app = 'tasks' AND t.ref_id = w.id)
          AND NOT EXISTS (SELECT 1 FROM sys_demo d WHERE d.workspace_id = w.id) LIMIT 20`,
    )
    .bind(a.userId)
    .all<{ id: string }>();
  return rows.results.map((r) => r.id);
}

const inList = (n: number) => Array.from({ length: n }, () => '?').join(',');
const clip = (s: string | null | undefined, n = 160) => String(s ?? '').slice(0, n);

/**
 * The options a person may pick for a reference (at most 30), filtered by `q`. `visibleObject` says which framework
 * records the person may see (src/worker/erp/objects/routes.ts gives it).
 */
export async function lookup(db: D1Database, a: ErpAccess, user: User, kind: RefKind, q: string, visibleObject: (key: string) => Promise<{ all: boolean; sql: string; args: unknown[] } | null>): Promise<RefOption[]> {
  const like = likeOf(q || '');
  const limit = 30;
  switch (kind) {
    case 'user': {
      const people = await companyPeople(db, a);
      const ql = (q || '').trim().toLowerCase();
      return people.filter((p) => !ql || p.name.toLowerCase().includes(ql) || p.email.toLowerCase().includes(ql)).slice(0, limit).map((p) => ({ id: p.id, label: p.name, sub: p.email }));
    }
    case 'department': {
      const rows = await db.prepare('SELECT id, name FROM co_departments WHERE company_id = ? AND archived_at IS NULL AND lower(name) LIKE ? ORDER BY name COLLATE NOCASE LIMIT ?').bind(a.companyId, like, limit).all<{ id: string; name: string }>();
      return rows.results.map((r) => ({ id: r.id, label: r.name }));
    }
    case 'supplier': {
      const rows = await db.prepare("SELECT id, number, legal_name, trading_name, status FROM erp_suppliers WHERE company_id = ? AND archived_at IS NULL AND search LIKE ? ORDER BY number LIMIT ?").bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.trading_name || r.legal_name}`, sub: r.status }));
    }
    case 'product': {
      const rows = await db.prepare('SELECT id, number, name FROM erp_products WHERE company_id = ? AND archived_at IS NULL AND search LIKE ? ORDER BY number LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.name}` }));
    }
    case 'warehouse': {
      const rows = await db.prepare("SELECT id, code, name FROM erp_warehouses WHERE company_id = ? AND archived_at IS NULL AND lower(code || ' ' || name) LIKE ? ORDER BY code LIMIT ?").bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.code} ${r.name}` }));
    }
    case 'asset': {
      const rows = await db.prepare('SELECT id, number, name FROM mt_assets WHERE company_id = ? AND archived_at IS NULL AND search LIKE ? ORDER BY number LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.name}` }));
    }
    case 'purchase_order': {
      const rows = await db.prepare('SELECT o.id, o.number, o.status, s.legal_name FROM erp_purchase_orders o LEFT JOIN erp_suppliers s ON s.company_id = o.company_id AND s.id = o.supplier_id WHERE o.company_id = ? AND o.search LIKE ? ORDER BY o.created_at DESC LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.legal_name ?? ''}`.trim(), sub: r.status }));
    }
    case 'sales_order': {
      const rows = await db.prepare('SELECT id, number, customer_name, status FROM erp_sales_orders WHERE company_id = ? AND search LIKE ? ORDER BY created_at DESC LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.customer_name}`, sub: r.status }));
    }
    case 'mfg_order': {
      const rows = await db.prepare('SELECT m.id, m.number, m.status, p.name FROM erp_mfg_orders m LEFT JOIN erp_products p ON p.company_id = m.company_id AND p.id = m.product_id WHERE m.company_id = ? AND m.search LIKE ? ORDER BY m.created_at DESC LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.name ?? ''}`.trim(), sub: r.status }));
    }
    case 'shipment': {
      const rows = await db.prepare('SELECT id, number, status, ship_to FROM erp_shipments WHERE company_id = ? AND search LIKE ? ORDER BY created_at DESC LIMIT ?').bind(a.companyId, like, limit).all<any>();
      return rows.results.map((r) => ({ id: r.id, label: r.number, sub: `${r.status}${r.ship_to ? `, ${clip(r.ship_to, 60)}` : ''}` }));
    }
    case 'project': {
      const ws = await projectWorkspaces(db, a);
      if (!ws.length) return [];
      // only workspaces the person is a member of: board names are Projects' own
      const rows = await db
        .prepare(`SELECT b.id, b.name FROM boards b JOIN workspace_members m ON m.workspace_id = b.workspace_id AND m.user_id = ? AND m.status = 'active' WHERE b.workspace_id IN (${inList(ws.length)}) AND b.archived_at IS NULL AND b.kind = 'board' AND lower(b.name) LIKE ? ORDER BY b.name COLLATE NOCASE LIMIT ?`)
        .bind(user.id, ...ws, like, limit)
        .all<{ id: string; name: string }>();
      return rows.results.map((r) => ({ id: r.id, label: r.name }));
    }
    case 'customer': {
      const out: RefOption[] = [];
      for (const o of await crmOrgsFor(db, a)) {
        const ca = await crmAccess(db, o.id, user).catch(() => null);
        if (!ca) continue;
        const scope = crmScopeSql(ca, 'companies', 'c', 'view');
        const rows = await db.prepare(`SELECT c.id, c.name, c.city FROM crm_companies c WHERE c.org_id = ? AND c.deleted_at IS NULL AND lower(c.name) LIKE ? AND ${scope.sql} ORDER BY c.name COLLATE NOCASE LIMIT ?`).bind(o.id, like, ...scope.args, limit).all<any>();
        out.push(...rows.results.map((r) => ({ id: `crm:${r.id}`, label: r.name, sub: r.city || 'CRM' })));
      }
      for (const o of await financeOrgsFor(db, a)) {
        const fa = await maybeFin(db, o.id, user);
        if (!fa || !finHasPerm(fa, 'contacts', 'view')) continue;
        // Finance customers already reached through their CRM company are not listed twice (one customer record)
        const rows = await db
          .prepare(`SELECT f.id, f.name FROM fin_contacts f WHERE f.org_id = ? AND f.kind IN ('customer','both') AND f.archived_at IS NULL AND lower(f.name) LIKE ? AND NOT EXISTS (SELECT 1 FROM co_customer_links l WHERE l.company_id = ? AND l.fin_contact_id = f.id) ORDER BY f.name COLLATE NOCASE LIMIT ?`)
          .bind(o.id, like, a.companyId, limit)
          .all<any>();
        out.push(...rows.results.map((r) => ({ id: `fin:${r.id}`, label: r.name, sub: 'Finance' })));
      }
      return out.slice(0, limit);
    }
    case 'fin_workspace': {
      // Finance business workspaces the person is a member of and may read the books of (Finance's own roles)
      const rows = await db.prepare("SELECT o.id, o.name, o.currency FROM fin_orgs o JOIN fin_members m ON m.org_id = o.id AND m.user_id = ? WHERE o.kind = 'business' AND o.deleted_at IS NULL AND lower(o.name) LIKE ? ORDER BY o.name COLLATE NOCASE LIMIT 60").bind(user.id, like).all<{ id: string; name: string; currency: string }>();
      const out: RefOption[] = [];
      for (const r of rows.results) {
        const fa = await maybeFin(db, r.id, user);
        if (fa && finHasPerm(fa, 'accounting', 'view')) out.push({ id: r.id, label: r.name, sub: r.currency });
      }
      return out.slice(0, limit);
    }
    default: {
      if (!kind.startsWith('obj:')) return [];
      const key = kind.slice(4);
      if (!OBJECT_BY_KEY[key]) return [];
      const vis = await visibleObject(key);
      if (!vis) return [];
      const rows = await db
        .prepare(`SELECT id, number, title, status FROM erp_objects WHERE company_id = ? AND object = ? AND archived_at IS NULL AND search LIKE ?${vis.all ? '' : ` AND ${vis.sql}`} ORDER BY updated_at DESC LIMIT ?`)
        .bind(a.companyId, key, like, ...(vis.all ? [] : vis.args), limit)
        .all<any>();
      return rows.results.map((r) => ({ id: r.id, label: `${r.number} ${r.title}`.trim(), sub: r.status }));
    }
  }
}

/**
 * Checks one new reference and returns the label to keep, or throws 400. People, departments, suppliers, products,
 * warehouses, assets, orders and shipments must be the company's; customers must be reachable through the CRM or Finance
 * with the person's own permissions there; framework records must be the company's of the right kind.
 */
export async function checkRef(db: D1Database, a: ErpAccess, user: User, kind: RefKind, id: string, fieldLabel: string): Promise<string> {
  const bad = (): never => {
    throw new HttpError(400, `${fieldLabel}: choose one from this company`);
  };
  if (typeof id !== 'string' || !id || id.length > 140) bad();
  const one = async (sql: string, ...args: unknown[]) => db.prepare(sql).bind(...args).first<any>();
  switch (kind) {
    case 'user': {
      const p = (await companyPeople(db, a)).find((x) => x.id === id);
      return p ? p.name : bad();
    }
    case 'department': {
      const r = await one('SELECT name FROM co_departments WHERE company_id = ? AND id = ? AND archived_at IS NULL', a.companyId, id);
      return r ? r.name : bad();
    }
    case 'supplier': {
      const r = await one('SELECT number, legal_name, trading_name FROM erp_suppliers WHERE company_id = ? AND id = ? AND archived_at IS NULL', a.companyId, id);
      return r ? `${r.number} ${r.trading_name || r.legal_name}` : bad();
    }
    case 'product': {
      const r = await one('SELECT number, name FROM erp_products WHERE company_id = ? AND id = ? AND archived_at IS NULL', a.companyId, id);
      return r ? `${r.number} ${r.name}` : bad();
    }
    case 'warehouse': {
      const r = await one('SELECT code, name FROM erp_warehouses WHERE company_id = ? AND id = ? AND archived_at IS NULL', a.companyId, id);
      return r ? `${r.code} ${r.name}` : bad();
    }
    case 'asset': {
      const r = await one('SELECT number, name FROM mt_assets WHERE company_id = ? AND id = ? AND archived_at IS NULL', a.companyId, id);
      return r ? `${r.number} ${r.name}` : bad();
    }
    case 'purchase_order': {
      const r = await one('SELECT number FROM erp_purchase_orders WHERE company_id = ? AND id = ?', a.companyId, id);
      return r ? r.number : bad();
    }
    case 'sales_order': {
      const r = await one('SELECT number, customer_name FROM erp_sales_orders WHERE company_id = ? AND id = ?', a.companyId, id);
      return r ? `${r.number} ${r.customer_name}` : bad();
    }
    case 'mfg_order': {
      const r = await one('SELECT number FROM erp_mfg_orders WHERE company_id = ? AND id = ?', a.companyId, id);
      return r ? r.number : bad();
    }
    case 'shipment': {
      const r = await one('SELECT number FROM erp_shipments WHERE company_id = ? AND id = ?', a.companyId, id);
      return r ? r.number : bad();
    }
    case 'project': {
      const ws = await projectWorkspaces(db, a);
      if (!ws.length) bad();
      const r = await one(`SELECT name FROM boards WHERE id = ? AND workspace_id IN (${inList(ws.length)}) AND archived_at IS NULL`, id, ...ws);
      return r ? r.name : bad();
    }
    case 'customer': {
      if (id.startsWith('crm:')) {
        const orgs = await crmOrgsFor(db, a);
        if (!orgs.length) bad();
        const row = await one(`SELECT * FROM crm_companies WHERE id = ? AND org_id IN (${inList(orgs.length)}) AND deleted_at IS NULL`, id.slice(4), ...orgs.map((o) => o.id));
        if (!row) bad();
        const ca = await crmAccess(db, row.org_id, user).catch(() => null);
        if (!ca) throw new HttpError(403, 'You have no access to the company’s CRM, so you cannot choose its customers');
        crmAssertRecord(ca, 'companies', 'view', row, 'Customer');
        return row.name;
      }
      if (id.startsWith('fin:')) {
        const orgs = await financeOrgsFor(db, a);
        for (const o of orgs) {
          const row = await one("SELECT name FROM fin_contacts WHERE id = ? AND org_id = ? AND kind IN ('customer','both') AND archived_at IS NULL", id.slice(4), o.id);
          if (!row) continue;
          const fa = await maybeFin(db, o.id, user);
          if (!fa || !finHasPerm(fa, 'contacts', 'view')) throw new HttpError(403, 'You have no access to the company’s Finance customers');
          return row.name;
        }
      }
      return bad();
    }
    case 'fin_workspace': {
      const r = await one("SELECT name FROM fin_orgs WHERE id = ? AND kind = 'business' AND deleted_at IS NULL", id);
      if (!r) bad();
      const fa = await maybeFin(db, id, user);
      if (!fa || !finHasPerm(fa, 'accounting', 'view')) throw new HttpError(403, `${fieldLabel}: choose a Finance business workspace whose books you may read`);
      return r.name;
    }
    default: {
      if (!kind.startsWith('obj:')) bad();
      const r = await one('SELECT number, title FROM erp_objects WHERE company_id = ? AND object = ? AND id = ? AND archived_at IS NULL', a.companyId, kind.slice(4), id);
      return r ? `${r.number} ${r.title}`.trim() : bad();
    }
  }
}

/** The CRM company and Finance customer behind a customer reference (for invoices). */
export function customerInput(ref: string | null | undefined): { crmCompanyId?: string; finContactId?: string } {
  if (!ref) return {};
  if (ref.startsWith('crm:')) return { crmCompanyId: ref.slice(4) };
  if (ref.startsWith('fin:')) return { finContactId: ref.slice(4) };
  return {};
}
