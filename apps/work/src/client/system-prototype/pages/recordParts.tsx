// Record content that belongs to one kind of record: order lines, the payments panel, the BOM tree with revisions
// and compare, work order operations and materials, the inspection checklist, receiving lines and more.
import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/ui/overlays';
import { itemName } from '../data/core';
import * as OP from '../data/operations';
import type { Line } from '../data/sales-finance';
import { fmtDate, money, num, PHONE, TODAY, useMedia } from '../format';
import { PIcon } from '../icons';
import { Facts, Meter, Panel, StatusBadge } from '../kit';
import { RecLink } from '../links';
import { useRows } from '../registry';
import { useErp } from '../state';
import type { Row } from '../types';
import { BarChart, ChartFrame } from '../widgets/charts';

// ------------------------------------------------------------------ lines

export function LinesTable({ lines, caption = 'Lines' }: { lines?: Line[]; caption?: string }) {
  if (!lines?.length) return null;
  const sub = lines.reduce((s, l) => s + l.qty * l.price, 0);
  return (
    <div className="erp-lines">
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <caption className="erp-caption">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Description</th>
              <th scope="col" className="num">
                Quantity
              </th>
              <th scope="col" className="num">
                Unit price
              </th>
              <th scope="col" className="num">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td>
                  <RecLink id={l.item} />
                </td>
                <td>{l.desc}</td>
                <td className="num">
                  {num(l.qty)} {l.unit}
                </td>
                <td className="num">{money(l.price, true)}</td>
                <td className="num">{money(l.qty * l.price, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="erp-totals">
        <dt>Subtotal</dt>
        <dd>{money(sub, true)}</dd>
        <dt>GST (10%)</dt>
        <dd>{money(sub * 0.1, true)}</dd>
        <dt className="total">Total</dt>
        <dd className="total">{money(sub * 1.1, true)}</dd>
      </dl>
    </div>
  );
}

export function DelayNote({ r }: { r: Row }) {
  if (!r.delayReason) return null;
  return (
    <div className="erp-alert danger" role="note" data-hl="delay-reason">
      <PIcon name="alert" />
      <div>
        <strong>{r.status === 'Late' ? `Late: promised ${fmtDate(r.promised)}` : `Delayed: due ${fmtDate(r.due)}${r.newDue ? `, now expected ${fmtDate(r.newDue)}` : ''}`}</strong>
        <p>{r.delayReason}</p>
      </div>
    </div>
  );
}

export function OrderFulfilment({ r }: { r: Row }) {
  const stages = ['Confirmed', 'In production', 'Inspected', 'Ready', 'Delivered', 'Invoiced'];
  const at = r.status === 'Late' ? 1 : Math.max(0, stages.indexOf(r.status));
  return (
    <Panel title="Fulfilment">
      <ol className="erp-flow">
        {stages.map((s, i) => (
          <li key={s} className={i < at ? 'done' : i === at ? (r.status === 'Late' ? 'late' : 'current') : ''}>
            <span className="erp-flow-dot" aria-hidden />
            <span>{s}</span>
            <span className="sr-only">{i < at ? ', done' : i === at ? ', current stage' : ', not started'}</span>
          </li>
        ))}
      </ol>
      {r.workOrder ? (
        <p className="muted small">
          Made by work order <RecLink id={r.workOrder} />. Ships from {r.site}.
        </p>
      ) : null}
    </Panel>
  );
}

// ------------------------------------------------------------------ invoices and payments

export function InvoiceSummary({ r }: { r: Row }) {
  const ex = r.total / 1.1;
  return (
    <Facts
      columns={4}
      items={[
        ['Total excluding GST', money(ex, true)],
        ['GST', money(r.total - ex, true)],
        ['Total', money(r.total, true)],
        ['Balance', <strong key="b">{money(r.balance, true)}</strong>],
      ]}
    />
  );
}

export function PaymentsPanel({ r, full }: { r: Row; full?: boolean }) {
  const { patchRecord } = useErp();
  const toast = useToast();
  const [amount, setAmount] = useState(String(r.balance ?? ''));
  const [date, setDate] = useState(TODAY);
  const [method, setMethod] = useState('Bank transfer');
  const [error, setError] = useState('');
  const payments: { date: string; method: string; reference: string; amount: number; by: string }[] = r.payments ?? (r.paid > 0 ? [{ date: r.due, method: 'Bank transfer', reference: 'Auto-matched', amount: r.paid, by: 'Bank feed' }] : []);
  const paidPct = r.total ? Math.round((r.paid / r.total) * 100) : 0;
  const record = () => {
    const a = Number(amount);
    if (!a || a <= 0) return setError('Enter an amount greater than zero.');
    if (a > r.balance + 0.001) return setError(`The balance is ${money(r.balance, true)}. Enter that amount or less.`);
    const paid = r.paid + a;
    const balance = Math.round((r.total - paid) * 100) / 100;
    const before = { paid: r.paid, balance: r.balance, status: r.status, payments: r.payments };
    patchRecord('invoice', r.id, { paid, balance, status: balance <= 0 ? 'Paid' : 'Partly paid', payments: [...payments, { date, method, reference: 'Recorded in the System', amount: a, by: 'Alex Morgan' }] });
    toast(`Payment of ${money(a, true)} recorded on ${r.id}.`, 'info', { label: 'Undo', run: () => patchRecord('invoice', r.id, before) });
    setError('');
  };
  return (
    <section className="card erp-panel erp-payments" aria-labelledby={`pay-${r.id}-${full ? 'f' : 's'}`} data-hl={full ? 'payments-tab' : 'payments-panel'}>
      <div className="erp-panel-head">
        <h2 id={`pay-${r.id}-${full ? 'f' : 's'}`}>Payments</h2>
        <StatusBadge status={r.status} />
      </div>
      <div className="erp-panel-body">
        <div className="erp-pay-figures">
          <div>
            <span className="muted small">Paid</span>
            <strong>{money(r.paid, true)}</strong>
          </div>
          <div>
            <span className="muted small">Balance</span>
            <strong>{money(r.balance, true)}</strong>
          </div>
          <div>
            <span className="muted small">Due</span>
            <strong>{fmtDate(r.due)}</strong>
          </div>
        </div>
        <Meter value={paidPct} label={`${paidPct}% paid`} tone={paidPct >= 100 ? 'success' : 'accent'} />
        <p className="muted small">{paidPct}% paid</p>
        <h3 className="erp-subhead">Payments received</h3>
        {payments.length ? (
          <ul className="erp-paylist">
            {payments.map((p, i) => (
              <li key={i}>
                <span>
                  <strong>{money(p.amount, true)}</strong> · {p.method}
                </span>
                <span className="muted small">
                  {fmtDate(p.date)} · {p.reference} · {p.by}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">No payments yet.</p>
        )}
        {r.reminders?.length ? (
          <p className="muted small">
            Last reminder {fmtDate(r.reminders[0].date)}: {r.reminders[0].note}.
          </p>
        ) : null}
        {full && r.balance > 0 ? (
          <form
            className="erp-payform"
            onSubmit={(e) => {
              e.preventDefault();
              record();
            }}
            noValidate
          >
            <h3 className="erp-subhead">Record a payment</h3>
            <div className="erp-form-grid">
              <div className="field">
                <label htmlFor="pay-amount">Amount (AUD)</label>
                <input id="pay-amount" className={`input${error ? ' invalid' : ''}`} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={!!error} aria-describedby={error ? 'pay-error' : undefined} />
                {error ? (
                  <span className="error" id="pay-error" role="alert">
                    {error}
                  </span>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="pay-date">Date received</label>
                <input id="pay-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="pay-method">Method</label>
                <select id="pay-method" className="select" value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option>Bank transfer</option>
                  <option>Card</option>
                  <option>Cheque</option>
                </select>
              </div>
            </div>
            <p className="muted small">Finance records the payment against the invoice. It never moves money or connects to a bank.</p>
            <button type="submit" className="btn primary">
              Record payment
            </button>
          </form>
        ) : !full ? (
          <Link to={`/finance/invoices/${r.id}?tab=payments`} className="btn sm">
            All payments
          </Link>
        ) : null}
      </div>
    </section>
  );
}

// ------------------------------------------------------------------ customer tabs

function MiniTable({ rows, cols, empty }: { rows: Row[]; cols: { label: string; get: (r: Row) => ReactNode; num?: boolean }[]; empty: string }) {
  const phone = useMedia(PHONE);
  if (!rows.length) return <p className="muted">{empty}</p>;
  if (phone)
    return (
      <ul className="erp-cards">
        {rows.map((r) => (
          <li key={r.id} className="erp-card" data-hl={r.id}>
            {cols.map((c, i) => (
              <div key={c.label} className={i === 0 ? 'erp-card-title' : 'erp-card-row'}>
                {i > 0 ? <span className="muted small">{c.label}</span> : null}
                <span>{c.get(r)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    );
  return (
    <div className="erp-table-scroll">
      <table className="data-table erp-table">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.label} scope="col" className={c.num ? 'num' : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} data-hl={r.id}>
              {cols.map((c) => (
                <td key={c.label} className={c.num ? 'num' : undefined}>
                  {c.get(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CustomerQuotes({ r }: { r: Row }) {
  const rows = useRows('quote').filter((q) => q.customerId === r.id);
  return (
    <Panel title={`Quotes for ${r.name}`} actions={<Link className="btn sm" to="/sales/quotes/new">New quote</Link>}>
      <MiniTable
        rows={rows}
        empty="No quotes for this customer yet."
        cols={[
          { label: 'Number', get: (q) => <RecLink id={q.id} /> },
          { label: 'Issued', get: (q) => fmtDate(q.issued) },
          { label: 'Expires', get: (q) => fmtDate(q.expires) },
          { label: 'Total', get: (q) => money(q.total), num: true },
          { label: 'Status', get: (q) => <StatusBadge status={q.status} /> },
        ]}
      />
    </Panel>
  );
}
export function CustomerOrders({ r }: { r: Row }) {
  const rows = useRows('salesOrder').filter((q) => q.customerId === r.id);
  return (
    <Panel title={`Sales orders for ${r.name}`}>
      <MiniTable
        rows={rows}
        empty="No sales orders yet."
        cols={[
          { label: 'Number', get: (q) => <RecLink id={q.id} /> },
          { label: 'Ordered', get: (q) => fmtDate(q.ordered) },
          { label: 'Promised', get: (q) => fmtDate(q.promised) },
          { label: 'Total', get: (q) => money(q.total), num: true },
          { label: 'Status', get: (q) => <StatusBadge status={q.status} /> },
        ]}
      />
    </Panel>
  );
}
export function CustomerInvoices({ r }: { r: Row }) {
  const rows = useRows('invoice')
    .filter((q) => q.customerId === r.id)
    .slice(-8)
    .reverse();
  return (
    <Panel title={`Recent invoices for ${r.name}`}>
      <MiniTable
        rows={rows}
        empty="No invoices yet."
        cols={[
          { label: 'Number', get: (q) => <RecLink id={q.id} /> },
          { label: 'Issued', get: (q) => fmtDate(q.issued) },
          { label: 'Due', get: (q) => fmtDate(q.due) },
          { label: 'Balance', get: (q) => money(q.balance), num: true },
          { label: 'Status', get: (q) => <StatusBadge status={q.status} /> },
        ]}
      />
    </Panel>
  );
}

export function ProjectTasks({ r }: { r: Row }) {
  const rows = useRows('task').filter((t) => t.project === r.id);
  return (
    <Panel title="Tasks">
      <MiniTable
        rows={rows}
        empty="No tasks."
        cols={[
          { label: 'Task', get: (t) => <RecLink id={t.id}>{t.title}</RecLink> },
          { label: 'Assignee', get: (t) => t.assignee },
          { label: 'Due', get: (t) => fmtDate(t.due) },
          { label: 'Status', get: (t) => <StatusBadge status={t.status} /> },
        ]}
      />
    </Panel>
  );
}

// ------------------------------------------------------------------ BOM

type Rev = 'A' | 'B' | 'C';
function genericTree(product: string): OP.BomNode[] {
  return [
    { item: 'RM-2001', qty: 1, uom: 'sheet' },
    { item: 'RM-2003', qty: 8, uom: 'each' },
    { item: 'RM-2004', qty: 1, uom: 'litre' },
    ...(product.startsWith('PRD-100') ? [{ item: 'RM-2006', qty: 2, uom: 'each' }] : []),
  ];
}

function flatten(nodes: OP.BomNode[], depth = 0, parent = ''): { key: string; node: OP.BomNode; depth: number; hasChildren: boolean }[] {
  return nodes.flatMap((n, i) => {
    const key = `${parent}${i}`;
    return [{ key, node: n, depth, hasChildren: !!n.children?.length }, ...(n.children ? flatten(n.children, depth + 1, `${key}.`) : [])];
  });
}

/** Compares two revisions of a BOM line by line: added, removed and changed quantities. */
export function bomDiff(a: OP.BomNode[], b: OP.BomNode[]) {
  const map = (nodes: OP.BomNode[], prefix = ''): Map<string, OP.BomNode> => {
    const m = new Map<string, OP.BomNode>();
    nodes.forEach((n) => {
      m.set(`${prefix}${n.item}`, n);
      if (n.children) map(n.children, `${prefix}${n.item} > `).forEach((v, k) => m.set(k, v));
    });
    return m;
  };
  const ma = map(a);
  const mb = map(b);
  const out: { path: string; change: 'Added' | 'Removed' | 'Quantity changed'; from?: number; to?: number }[] = [];
  mb.forEach((n, k) => {
    const o = ma.get(k);
    if (!o) out.push({ path: k, change: 'Added', to: n.qty });
    else if (o.qty !== n.qty) out.push({ path: k, change: 'Quantity changed', from: o.qty, to: n.qty });
  });
  ma.forEach((n, k) => {
    if (!mb.has(k)) out.push({ path: k, change: 'Removed', from: n.qty });
  });
  return out;
}

export function BomCompare({ product, from, to }: { product: string; from: Rev; to: Rev }) {
  if (product !== 'PRD-1001') return <p className="muted">Only one revision of this BOM exists in the demonstration data.</p>;
  const diff = bomDiff(OP.BOM_PRD1001[from].tree, OP.BOM_PRD1001[to].tree);
  return (
    <div className="erp-compare" data-hl="bom-compare">
      <h3 className="erp-subhead">
        Changes from revision {from} to revision {to}
      </h3>
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col">Change</th>
              <th scope="col" className="num">
                Revision {from}
              </th>
              <th scope="col" className="num">
                Revision {to}
              </th>
            </tr>
          </thead>
          <tbody>
            {diff.map((d) => {
              const last = d.path.split(' > ').pop() as string;
              return (
                <tr key={d.path}>
                  <td>
                    <RecLink id={last} /> {itemName(last)}
                    {d.path.includes('>') ? <span className="muted small"> (in {d.path.split(' > ')[0]})</span> : null}
                  </td>
                  <td>
                    <span className={`erp-diff ${d.change === 'Added' ? 'add' : d.change === 'Removed' ? 'del' : 'chg'}`}>{d.change}</span>
                  </td>
                  <td className="num">{d.from ?? '–'}</td>
                  <td className="num">{d.to ?? '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BomPanel({ product, revision }: { product: string; revision?: string }) {
  const [params, setParams] = useSearchParams();
  const has = product === 'PRD-1001';
  const initial = (revision ?? params.get('rev') ?? (has ? 'B' : 'A')) as Rev;
  const [rev, setRev] = useState<Rev>(has && ['A', 'B', 'C'].includes(initial) ? initial : 'A');
  const [compare, setCompare] = useState(params.get('compare') === '1');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  // A link to another revision (a guided journey step) updates the open panel.
  useEffect(() => {
    const pr = params.get('rev');
    if (!revision && has && pr && ['A', 'B', 'C'].includes(pr)) setRev(pr as Rev);
    if (params.get('compare') === '1') setCompare(true);
  }, [params]);
  const data = has ? OP.BOM_PRD1001[rev] : { status: 'Released', date: '2026-04-21', author: 'Zoe Martin', summary: 'Current revision.', tree: genericTree(product) };
  const rows = useMemo(() => flatten(data.tree), [data]);
  const visible = rows.filter((row) => !Array.from(collapsed).some((c) => row.key.startsWith(`${c}.`)));
  const prev: Rev | null = rev === 'C' ? 'B' : rev === 'B' ? 'A' : null;
  const total = data.tree.reduce((s, n) => s + n.qty * OP.products.find((p) => p.id === n.item)!.cost, 0);
  const toggle = (key: string) => setCollapsed((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key);
    else n.add(key);
    return n;
  });
  const onTreeKey = (e: ReactKeyboardEvent<HTMLElement>, key: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    if (e.key === 'ArrowLeft' && !collapsed.has(key)) {
      e.preventDefault();
      toggle(key);
    }
    if (e.key === 'ArrowRight' && collapsed.has(key)) {
      e.preventDefault();
      toggle(key);
    }
  };
  return (
    <Panel
      title={`Bill of materials, revision ${rev}`}
      hl={`bom-rev-${rev}`}
      actions={
        <>
          {has ? (
            <div className="erp-seg" role="radiogroup" aria-label="Revision">
              {(['A', 'B', 'C'] as Rev[]).map((x) => (
                <button
                  key={x}
                  type="button"
                  role="radio"
                  aria-checked={rev === x}
                  className={`btn sm${rev === x ? ' active' : ''}`}
                  data-hl={`rev-${x}`}
                  onClick={() => {
                    setRev(x);
                    const p = new URLSearchParams(params);
                    p.set('rev', x);
                    setParams(p, { replace: true });
                  }}
                >
                  Rev {x}
                </button>
              ))}
            </div>
          ) : null}
          {prev ? (
            <button type="button" className={`btn sm${compare ? ' active' : ''}`} aria-pressed={compare} onClick={() => setCompare((c) => !c)}>
              <PIcon name="compare" size={14} /> Compare with {prev}
            </button>
          ) : null}
        </>
      }
    >
      <div className="erp-bom-meta">
        <StatusBadge status={data.status} />
        <span className="muted small">
          {fmtDate(data.date)} · {data.author}
        </span>
        <span className="small">{data.summary}</span>
      </div>
      {has && rev === 'C' ? (
        <div className="erp-alert warning" role="note">
          <PIcon name="info" />
          <div>
            <strong>Revision C is in review.</strong>
            <p>
              Work orders still build to revision B until <RecLink id="ECO-0046" /> is approved.
            </p>
          </div>
        </div>
      ) : null}
      <div className="erp-table-scroll">
        <table className="data-table erp-table erp-bom" role="treegrid" aria-label={`BOM of ${itemName(product)}, revision ${rev}`}>
          <thead>
            <tr>
              <th scope="col">Component</th>
              <th scope="col" className="num">
                Quantity
              </th>
              <th scope="col">Unit</th>
              <th scope="col" className="num">
                Unit cost
              </th>
            </tr>
          </thead>
          <tbody>
            <tr aria-level={1} className="erp-bom-root">
              <td>
                <strong>{product}</strong> {itemName(product)}
              </td>
              <td className="num">1</td>
              <td>each</td>
              <td className="num">{money(total, true)}</td>
            </tr>
            {visible.map(({ key, node, depth, hasChildren }) => (
              <tr key={key} aria-level={depth + 2} aria-expanded={hasChildren ? !collapsed.has(key) : undefined}>
                <td>
                  <span className={`erp-bom-indent d${depth}`}>
                    {hasChildren ? (
                      <button type="button" className="btn ghost icon sm" aria-label={`${collapsed.has(key) ? 'Expand' : 'Collapse'} ${node.item}`} aria-expanded={!collapsed.has(key)} onClick={() => toggle(key)} onKeyDown={(e) => onTreeKey(e, key, hasChildren)}>
                        <PIcon name={collapsed.has(key) ? 'chevronRight' : 'chevronDown'} size={14} />
                      </button>
                    ) : (
                      <span className="erp-bom-leaf" aria-hidden />
                    )}
                    <RecLink id={node.item} /> <span>{itemName(node.item)}</span>
                  </span>
                </td>
                <td className="num">{node.qty}</td>
                <td>{node.uom}</td>
                <td className="num">{money(OP.products.find((p) => p.id === node.item)?.cost ?? 0, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compare && prev ? <BomCompare product={product} from={prev} to={rev} /> : null}
    </Panel>
  );
}

export function ProductVariants({ r }: { r: Row }) {
  const rows = OP.variants.filter((v) => v.product === r.id);
  return (
    <Panel title="Variants">
      <MiniTable rows={rows} empty="This product has no variants." cols={[{ label: 'Number', get: (v) => <RecLink id={v.id} /> }, { label: 'Option', get: (v) => v.option }, { label: 'Status', get: (v) => <StatusBadge status={v.status} /> }]} />
    </Panel>
  );
}
export function ProductRevisions({ r }: { r: Row }) {
  const rows = OP.revisions.filter((v) => v.product === r.id);
  return (
    <Panel title="Revisions">
      <MiniTable rows={rows} empty="No revision history." cols={[{ label: 'Revision', get: (v) => v.rev }, { label: 'Date', get: (v) => fmtDate(v.date) }, { label: 'Summary', get: (v) => v.summary }, { label: 'Author', get: (v) => v.author }, { label: 'Status', get: (v) => <StatusBadge status={v.status} /> }]} />
    </Panel>
  );
}
export function ProductDrawings({ r }: { r: Row }) {
  const rows = OP.drawings.filter((v) => v.product === r.id);
  return (
    <Panel title="Drawings and models" actions={<a className="btn sm" href="https://bizomat.ai/cad/" target="_blank" rel="noopener noreferrer">Open in CAD Automation <PIcon name="share" size={13} /><span className="sr-only">(opens in a new tab)</span></a>}>
      <p className="muted small">CAD Automation holds the files and runs the automation. System keeps the link and the revision.</p>
      <MiniTable rows={rows} empty="No drawings linked." cols={[{ label: 'Number', get: (v) => <RecLink id={v.id} /> }, { label: 'Title', get: (v) => v.title }, { label: 'Revision', get: (v) => v.rev }, { label: 'Status', get: (v) => <StatusBadge status={v.status} /> }]} />
    </Panel>
  );
}

export function RoutingOps({ product }: { product: string }) {
  const ops = product === 'PRD-1001' ? OP.OPERATIONS_1001 : OP.OPERATIONS_1001.slice(0, 4);
  return (
    <Panel title="Operations">
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Op</th>
              <th scope="col">Operation</th>
              <th scope="col">Work centre</th>
              <th scope="col" className="num">
                Set-up (h)
              </th>
              <th scope="col" className="num">
                Run (h)
              </th>
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.op}>
                <td>{o.op}</td>
                <td>{o.name}</td>
                <td>
                  <RecLink id={o.centre} /> {OP.workCentres.find((w) => w.id === o.centre)?.name}
                </td>
                <td className="num">{o.setup}</td>
                <td className="num">{o.run}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ------------------------------------------------------------------ manufacturing

export function WorkOrderOps({ r }: { r: Row }) {
  const ops = r.id === 'WO-1042' ? OP.WO1042_OPS : OP.OPERATIONS_1001.slice(0, 4).map((o, i) => ({ ...o, status: r.status === 'Completed' || i < (r.progress ?? 0) / 25 ? 'Completed' : 'Waiting', planned: o.setup + o.run, actual: 0, who: '' }));
  return (
    <Panel title="Operations" hl="wo-operations">
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Op</th>
              <th scope="col">Operation</th>
              <th scope="col">Work centre</th>
              <th scope="col">Operator</th>
              <th scope="col" className="num">
                Planned (h)
              </th>
              <th scope="col" className="num">
                Actual (h)
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {ops.map((o) => (
              <tr key={o.op}>
                <td>{o.op}</td>
                <td>{o.name}</td>
                <td>
                  <RecLink id={o.centre} />
                </td>
                <td>{o.who || <span className="muted">Not assigned</span>}</td>
                <td className="num">{o.planned}</td>
                <td className={`num${o.actual > o.planned ? ' danger-text' : ''}`}>{o.actual || '–'}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function WorkOrderMaterials({ r }: { r: Row }) {
  const rows = r.id === 'WO-1042' ? OP.WO1042_MATERIALS : [{ item: 'RM-2001', required: 2, issued: 2, available: 14, note: '' }];
  return (
    <Panel title="Materials" hl="wo-materials">
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="num">
                Required
              </th>
              <th scope="col" className="num">
                Issued
              </th>
              <th scope="col" className="num">
                Available
              </th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.item}>
                <td>
                  <RecLink id={m.item} /> {itemName(m.item)}
                </td>
                <td className="num">{m.required}</td>
                <td className="num">{m.issued}</td>
                <td className="num">{m.available}</td>
                <td>{m.note ? <span className="erp-flag danger"><PIcon name="alert" size={13} /> {m.note}</span> : <span className="muted">OK</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function WorkCentreLoad({ r }: { r: Row }) {
  const days = ['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20'];
  const cap = Number(r.capacity) / 5;
  const load = days.map((_, i) => Math.round((Number(r.load) / 5) * (0.8 + ((i * 37) % 5) / 10)));
  return (
    <Panel title="Load next week (hours)">
      <ChartFrame headers={['Day', 'Load (h)', 'Capacity (h)']} rows={days.map((d, i) => [d, load[i], cap.toFixed(1)])} legend={<span className="legend erp-legend"><span><i className="erp-key erp-s1" aria-hidden /> Load</span><span><i className="erp-key target dashed" aria-hidden /> Capacity</span></span>}>
        <BarChart label={`Load of ${r.name} next week`} labels={days} series={[{ name: 'Load', values: load }]} target={{ name: 'Capacity', values: days.map(() => cap) }} format={(n) => `${Math.round(n)} h`} />
      </ChartFrame>
    </Panel>
  );
}

// ------------------------------------------------------------------ quality

type Result = 'Pass' | 'Fail' | 'N/A' | '';
export function Checklist({ r }: { r: Row }) {
  const { patchRecord } = useErp();
  const toast = useToast();
  const base = r.id === 'INS-0533' ? OP.INS0533_CHECKS : OP.INS0533_CHECKS.slice(0, 5).map((c) => ({ ...c, measured: r.status === 'Scheduled' ? '' : c.measured.replace('1.2 mm at joint W7', '0.3 mm'), result: (r.status === 'Scheduled' ? '' : 'Pass') as Result }));
  const [checks, setChecks] = useState(() => base.map((c) => ({ ...c, result: c.result as Result })));
  const fails = checks.filter((c) => c.result === 'Fail').length;
  const done = checks.filter((c) => c.result).length;
  const set = (id: string, patch: Partial<(typeof checks)[number]>) => setChecks((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  return (
    <Panel title="Checklist" hl="checklist" actions={<span className="muted small">{done} of {checks.length} checked · {fails} failed</span>}>
      <p className="muted small">Plan {r.plan}. Record each result; a failed check needs a nonconformance.</p>
      <ol className="erp-checklist">
        {checks.map((c, i) => (
          <li key={c.id} className={`erp-check ${c.result === 'Fail' ? 'fail' : ''}`} data-hl={c.result === 'Fail' ? 'failed-check' : undefined}>
            <div className="erp-check-head">
              <span className="erp-check-num">{i + 1}</span>
              <div className="grow">
                <strong>{c.check}</strong>
                <div className="muted small">Specification: {c.spec}</div>
              </div>
            </div>
            <div className="erp-check-controls">
              <div className="erp-seg" role="radiogroup" aria-label={`Result for ${c.check}`}>
                {(['Pass', 'Fail', 'N/A'] as Result[]).map((x) => (
                  <button key={x} type="button" role="radio" aria-checked={c.result === x} className={`btn sm erp-res-${x === 'N/A' ? 'na' : x.toLowerCase()}${c.result === x ? ' active' : ''}`} onClick={() => set(c.id, { result: x })}>
                    {x}
                  </button>
                ))}
              </div>
              <label className="sr-only" htmlFor={`m-${c.id}`}>
                Measured value for {c.check}
              </label>
              <input id={`m-${c.id}`} className="input sm" placeholder="Measured value" value={c.measured} onChange={(e) => set(c.id, { measured: e.target.value })} />
            </div>
            {c.result === 'Fail' ? (
              <p className="erp-check-ncr small">
                <PIcon name="alert" size={13} /> {r.ncr ? <>Nonconformance <RecLink id={r.ncr} /> raised for this check.</> : 'A nonconformance will be raised when you save.'}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="row wrap erp-check-actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            patchRecord('inspection', r.id, { status: fails ? (r.id === 'INS-0533' ? 'Awaiting review' : 'Failed') : 'Passed' });
            toast(`Checklist saved: ${done} of ${checks.length} checked, ${fails} failed.`);
          }}
        >
          Save results
        </button>
        <button type="button" className="btn" onClick={() => toast('Photo attached (prototype: camera placeholder).')}>
          <PIcon name="camera" /> Add photo
        </button>
      </div>
    </Panel>
  );
}

export function PlanChecks() {
  return (
    <Panel title="Checks">
      <ol className="erp-plain-list">
        {OP.INS0533_CHECKS.map((c) => (
          <li key={c.id}>
            <strong>{c.check}</strong> <span className="muted small">· {c.spec}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

// ------------------------------------------------------------------ inventory and procurement

export function ReceiptLines({ r }: { r: Row }) {
  const phone = useMedia(PHONE);
  const lines: (Line & { received: number; accepted: number; bin: string; note?: string })[] = r.lines ?? [];
  if (phone)
    return (
      <ul className="erp-cards" data-hl="receipt-lines">
        {lines.map((l) => (
          <li key={l.item} className="erp-card">
            <div className="erp-card-title">
              <RecLink id={l.item} /> {l.desc}
            </div>
            <div className="erp-card-row">
              <span className="muted small">Ordered / received / accepted</span>
              <span>
                {l.qty} / {l.received} / {l.accepted}
              </span>
            </div>
            <div className="erp-card-row">
              <span className="muted small">Put away to</span>
              <span>{l.bin}</span>
            </div>
            {l.note ? <p className="erp-flag warning small">{l.note}</p> : null}
          </li>
        ))}
      </ul>
    );
  return (
    <div className="erp-table-scroll" data-hl="receipt-lines">
      <table className="data-table erp-table">
        <caption className="erp-caption">Lines received</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col" className="num">
              Ordered
            </th>
            <th scope="col" className="num">
              Received
            </th>
            <th scope="col" className="num">
              Accepted
            </th>
            <th scope="col">Put away to</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.item}>
              <td>
                <RecLink id={l.item} /> {l.desc}
              </td>
              <td className="num">{l.qty}</td>
              <td className={`num${l.received < l.qty ? ' warning-text' : ''}`}>{l.received}</td>
              <td className={`num${l.accepted < l.received ? ' warning-text' : ''}`}>{l.accepted}</td>
              <td>{l.bin}</td>
              <td>{l.note ?? <span className="muted">OK</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PoReceiving({ r }: { r: Row }) {
  const grs = OP.receipts.filter((g) => g.po === r.id);
  const lines: Line[] = r.lines ?? [];
  return (
    <Panel title="Receiving">
      <p className="muted small">Planned: the System adds lines and receiving to the Finance purchase order.</p>
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="num">
                Ordered
              </th>
              <th scope="col" className="num">
                Received
              </th>
              <th scope="col">Progress</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => {
              const rec = grs.reduce((s, g) => s + (g.lines.find((x: any) => x.item === l.item)?.received ?? 0), 0);
              return (
                <tr key={l.item}>
                  <td>
                    <RecLink id={l.item} /> {l.desc}
                  </td>
                  <td className="num">{l.qty}</td>
                  <td className="num">{rec}</td>
                  <td>
                    <Meter value={rec} max={l.qty} label={`${rec} of ${l.qty} received`} tone={rec >= l.qty ? 'success' : 'accent'} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="small">{grs.length ? <>Goods receipts: {grs.map((g, i) => <span key={g.id}>{i ? ', ' : ''}<RecLink id={g.id} /></span>)}</> : 'Nothing received yet.'}</p>
    </Panel>
  );
}

export function RfqResponses({ r }: { r: Row }) {
  const valid = (r.responses as [string, number, number][]).filter((x) => x[1] > 0);
  const best = valid.length ? Math.min(...valid.map((x) => x[1])) : 0;
  return (
    <Panel title="Responses">
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">Supplier</th>
              <th scope="col" className="num">
                Unit price
              </th>
              <th scope="col" className="num">
                Lead time (days)
              </th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {(r.responses as [string, number, number][]).map(([s, price, lead]) => (
              <tr key={s}>
                <td>{s}</td>
                <td className="num">{price ? money(price, true) : '–'}</td>
                <td className="num">{lead || '–'}</td>
                <td>{!price ? <span className="muted">No response yet</span> : price === best ? <span className="badge erp-badge-success">Lowest price</span> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function SupplierPerformance({ r }: { r: Row }) {
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const vals = months.map((_, i) => Math.max(60, Math.min(100, r.onTime + ((i * 7) % 9) - 4)));
  return (
    <Panel title="Performance">
      <Facts items={[['On time this year', `${r.onTime}%`], ['Accepted at inspection', `${r.quality}%`], ['Average lead time', `${r.leadTime} days`]]} />
      <ChartFrame headers={['Month', 'On time (%)']} rows={months.map((m, i) => [m, vals[i]])}>
        <BarChart label={`On-time delivery by month for ${r.name}`} labels={months} series={[{ name: 'On time', values: vals }]} format={(n) => `${Math.round(n)}%`} height={150} />
      </ChartFrame>
    </Panel>
  );
}
