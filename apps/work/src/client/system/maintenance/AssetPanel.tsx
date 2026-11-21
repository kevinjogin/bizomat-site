// The asset on a work order or a request (the field release, stream A; MEX a functional reference only): what it is,
// where it sits in the hierarchy and its site, and the other open requests and work orders on it. The same open work is
// the duplicate warning in the request form and in Report a fault; it never stops anyone sending a request. The server
// counts only what the person may see (supervisors and administrators: the whole company).
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { SUITE } from '../../lib/base';
import { Loading } from '../../components/ui/ui';
import { dateText, mtPage, mtPath, type Priority, type RequestStatus, type WoStatus } from './api';
import { AssetStatusBadge, CriticalityBadge, Props, RequestBadge, Section, WoBadge } from './common';

export interface AssetSummary {
  asset: {
    id: string;
    number: string;
    name: string;
    category: string;
    type: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    registrationNumber: string;
    location: string;
    criticality: string;
    status: string;
    archived: boolean;
    siteId: string | null;
    siteCode: string | null;
    siteName: string | null;
    parentId: string | null;
    parentNumber: string | null;
    parentName: string | null;
  };
  path: { id: string; number: string; name: string }[];
  /** 'company': every open request and work order; 'yours': only those the person may see. */
  scope: 'company' | 'yours';
  open: {
    requests: number;
    workOrders: number;
    requestList: { id: string; number: string; description: string; status: RequestStatus; priority: Priority; requestedByName: string | null; createdAt: number; workOrderNumber: string | null }[];
    workOrderList: { id: string; number: string; description: string; status: WoStatus; priority: Priority; assignedToName: string | null; dueFinish: string | null }[];
  };
}

type LinkMode = 'router' | 'page';

export function useAssetSummary(companyId: string, assetId: string, exclude: { excludeRequestId?: string; excludeWorkOrderId?: string } = {}) {
  const qs = new URLSearchParams();
  if (exclude.excludeRequestId) qs.set('excludeRequestId', exclude.excludeRequestId);
  if (exclude.excludeWorkOrderId) qs.set('excludeWorkOrderId', exclude.excludeWorkOrderId);
  const tail = qs.toString();
  return useQuery({
    queryKey: ['mt', companyId, 'asset-summary', assetId, exclude.excludeRequestId ?? '', exclude.excludeWorkOrderId ?? ''],
    queryFn: () => get<AssetSummary>(mtPath(companyId, `/assets/${encodeURIComponent(assetId)}/summary${tail ? `?${tail}` : ''}`)),
    enabled: !!companyId && !!assetId,
    staleTime: 30_000,
  });
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** A link to a maintenance page: through the router, or as a page address (from Report a fault, which may sit in any tool). */
function PageLink({ companyId, path, mode, children }: { companyId: string; path: string; mode: LinkMode; children: ReactNode }) {
  if (mode === 'page') return <a className="mt-num mt-primary" href={`${SUITE || '/erp'}${mtPage(companyId, path)}`}>{children}</a>;
  return <Link className="mt-num mt-primary" to={mtPage(companyId, path)}>{children}</Link>;
}

/** The asset panel on a work order or a request. */
export function AssetPanel({ companyId, assetId, excludeRequestId, excludeWorkOrderId, showWorkOrders = true }: { companyId: string; assetId: string; excludeRequestId?: string; excludeWorkOrderId?: string; showWorkOrders?: boolean }) {
  const q = useAssetSummary(companyId, assetId, { excludeRequestId, excludeWorkOrderId });
  if (!assetId) return null;
  return (
    <Section title="About the asset">
      {q.error ? <p className="muted small">The asset could not be loaded.</p> : !q.data ? <Loading /> : <AssetFacts companyId={companyId} summary={q.data} showWorkOrders={showWorkOrders} />}
    </Section>
  );
}

function AssetFacts({ companyId, summary, showWorkOrders }: { companyId: string; summary: AssetSummary; showWorkOrders: boolean }) {
  const a = summary.asset;
  const above = summary.path.slice(0, -1);
  const where: [string, string | null][] = [
    ['Site', a.siteCode ? `${a.siteCode} ${a.siteName ?? ''}`.trim() : null],
    ['Location', a.location || null],
  ];
  return (
    <div className="stack">
      <div className="row wrap">
        <Link className="mt-primary grow" to={mtPage(companyId, `/assets/${a.id}`)}><span className="mt-num">{a.number}</span> {a.name}</Link>
        <div className="mt-badges">
          <AssetStatusBadge value={a.status} />
          <CriticalityBadge value={a.criticality} />
          {a.archived ? <span className="muted small">Archived</span> : null}
        </div>
      </div>
      {above.length ? (
        <p className="small">
          In:{' '}
          {above.map((p, i) => (
            <span key={p.id}>
              {i ? ' › ' : ''}
              <Link to={mtPage(companyId, `/assets/${p.id}`)}>{p.name}</Link>
            </span>
          ))}
        </p>
      ) : null}
      {where.some(([, v]) => v) ? <Props items={where} /> : null}
      <details>
        <summary className="small">More about the asset</summary>
        <Props items={[['Category', a.category], ['Make and model', [a.manufacturer, a.model].filter(Boolean).join(' ')], ['Serial number', a.serialNumber], ['Registration', a.registrationNumber]]} />
      </details>
      <OpenOnAsset companyId={companyId} summary={summary} showWorkOrders={showWorkOrders} />
    </div>
  );
}

function RequestItems({ companyId, items, mode }: { companyId: string; items: AssetSummary['open']['requestList']; mode: LinkMode }) {
  if (!items.length) return null;
  return (
    <ul className="mt-docs">
      {items.map((r) => (
        <li key={r.id} className="row wrap">
          <PageLink companyId={companyId} path={`/requests/${r.id}`} mode={mode}>{r.number}</PageLink>
          <RequestBadge status={r.status} />
          <span className="grow small">{r.description}</span>
        </li>
      ))}
    </ul>
  );
}

function WorkOrderItems({ companyId, items, mode }: { companyId: string; items: AssetSummary['open']['workOrderList']; mode: LinkMode }) {
  if (!items.length) return null;
  return (
    <ul className="mt-docs">
      {items.map((w) => (
        <li key={w.id} className="row wrap">
          <PageLink companyId={companyId} path={`/work-orders/${w.id}`} mode={mode}>{w.number}</PageLink>
          <WoBadge status={w.status} />
          <span className="grow small">
            {w.description}
            {w.assignedToName ? <span className="muted"> · {w.assignedToName}</span> : null}
            {w.dueFinish ? <span className="muted"> · due {dateText(w.dueFinish)}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The other open work on the asset. In the request form (`form`), a warning shown only when there is some, with links
 * to those requests and work orders; on a work order or a request, the two lists with their counts.
 */
export function OpenOnAsset({ companyId, summary, linkMode = 'router', showWorkOrders = true, form = false }: { companyId: string; summary: AssetSummary; linkMode?: LinkMode; showWorkOrders?: boolean; form?: boolean }) {
  const { open, scope } = summary;
  const number = summary.asset.number;
  const requests = open.requests;
  const workOrders = showWorkOrders ? open.workOrders : 0;
  const more = (n: number, shown: number) => (n > shown ? <p className="muted small">And {n - shown} more.</p> : null);
  if (form) {
    if (!requests && !workOrders) return null;
    const what = [requests ? count(requests, 'open request', 'open requests') : '', workOrders ? count(workOrders, 'open work order', 'open work orders') : ''].filter(Boolean).join(' and ');
    const text =
      scope === 'company'
        ? `${number} already has ${what}. ${workOrders ? `If it is the same fault, a supervisor can attach your request to ${workOrders === 1 ? 'that work order' : 'one of those work orders'}.` : 'If it is the same fault, you may not need to report it again.'}`
        : `You can already see ${what} on ${number}. If it is the same fault, you may not need to report it again.`;
    return (
      <div className="warn-box stack" role="status">
        <span>{text}</span>
        <RequestItems companyId={companyId} items={open.requestList} mode={linkMode} />
        {workOrders ? <WorkOrderItems companyId={companyId} items={open.workOrderList} mode={linkMode} /> : null}
      </div>
    );
  }
  if (!requests && !workOrders) {
    return <p className="muted small">{showWorkOrders ? 'No other open requests or work orders on this asset' : 'No other open requests on this asset'}{scope === 'yours' ? ' that you can see' : ''}.</p>;
  }
  return (
    <div className="stack">
      {requests ? (
        <div className="stack">
          <h3 className="small">Open requests on this asset ({requests})</h3>
          <RequestItems companyId={companyId} items={open.requestList} mode={linkMode} />
          {more(requests, open.requestList.length)}
        </div>
      ) : null}
      {workOrders ? (
        <div className="stack">
          <h3 className="small">Open work orders on this asset ({workOrders})</h3>
          <WorkOrderItems companyId={companyId} items={open.workOrderList} mode={linkMode} />
          {more(workOrders, open.workOrderList.length)}
        </div>
      ) : null}
    </div>
  );
}
