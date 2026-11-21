// Replenishment (src/worker/erp/replenish.ts): the products at or below their reorder point (available stock and what is
// on order), what each would be ordered up to its maximum level, and one draft requisition for them, approved as any
// other. The server works every number out again.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { erpPath, procurementPage, type ErpMe } from './api';

interface Need {
  productId: string;
  number: string;
  name: string;
  uom: string;
  available: number;
  onOrder: number;
  reorderPoint: number;
  maxQty: number | null;
  suggestQty: number | null;
  onRequisition: string | null;
  note: string;
}

export function ReplenishmentPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Replenishment');
  const q = useQuery({ queryKey: ['erp', companyId, 'replenishment'], queryFn: () => get<{ products: Need[]; note: string }>(erpPath(companyId, '/inventory/replenishment')), retry: false });
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const orderable = q.data.products.filter((p) => p.suggestQty !== null);
  const canRaise = me.can['requisitions.raise'];
  const make = async () => {
    setBusy(true);
    try {
      const r = await post<{ id: string; number: string; lines: number }>(erpPath(companyId, '/inventory/replenishment'), {});
      toast(`${r.number} drafted with ${r.lines} line${r.lines === 1 ? '' : 's'}`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      navigate(procurementPage(companyId, `/requisitions/${r.id}`));
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <p className="muted small">{q.data.note}</p>
      {q.data.products.length ? (
        <>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">Available</th><th className="num">On order</th><th className="num">Reorder point</th><th className="num">Maximum</th><th className="num">To order</th><th>Note</th></tr></thead>
              <tbody>{q.data.products.map((p) => <tr key={p.productId}><td data-label="Product"><span className="mt-num">{p.number}</span> {p.name}</td><td className="num" data-label="Available">{p.available}</td><td className="num" data-label="On order">{p.onOrder}</td><td className="num" data-label="Reorder point">{p.reorderPoint}</td><td className="num" data-label="Maximum">{p.maxQty ?? ''}</td><td className="num" data-label="To order">{p.suggestQty !== null ? `${p.suggestQty} ${p.uom}` : ''}</td><td data-label="Note" className="small">{p.note}</td></tr>)}</tbody>
            </table>
          </div>
          {canRaise ? <button className="btn primary" disabled={busy || !orderable.length} onClick={() => void make()}><Icon name="plus" /> Draft a requisition for {orderable.length} product{orderable.length === 1 ? '' : 's'}</button> : <p className="muted small">Your ERP roles do not raise requisitions.</p>}
        </>
      ) : <EmptyState icon="layers" title="Nothing to replenish">Every product with a reorder point is above it, counting what is on order.</EmptyState>}
    </div>
  );
}
