import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import { entityPath } from '../components/layout/AppShell';
import '../styles/content.css';

export interface EntityRef {
  type: 'board' | 'dashboard' | 'document' | 'item' | 'goal';
  id: string;
  name: string;
  boardId?: string;
  at: number;
}

export const ENTITY_ICON: Record<string, string> = { board: 'grid', dashboard: 'chart', document: 'doc', item: 'checkSquare', goal: 'target' };
export const ENTITY_LABEL: Record<string, string> = { board: 'Board', dashboard: 'Dashboard', document: 'Document', item: 'Item', goal: 'Goal' };

export function EntityList({ rows, base, action }: { rows: EntityRef[]; base: string; action?: (r: EntityRef) => React.ReactNode }) {
  return (
    <div className="card list">
      {rows.map((r) => (
        <div key={`${r.type}:${r.id}`} className="list-row">
          <Icon name={ENTITY_ICON[r.type] ?? 'grid'} />
          <Link to={entityPath(base, r)} className="grow ellipsis" style={{ color: 'var(--text)', fontWeight: 500 }}>{r.name}</Link>
          <span className="badge">{ENTITY_LABEL[r.type] ?? r.type}</span>
          <span className="muted small desktop-only" style={{ width: 90, textAlign: 'right' }}>{timeAgo(r.at)}</span>
          {action ? action(r) : null}
        </div>
      ))}
    </div>
  );
}

export default function Favourites() {
  const ws = useWorkspace();
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<EntityRef[]>(`/workspaces/${ws.id}/favourites`) });
  const remove = async (r: EntityRef) => {
    try {
      await del(`/workspaces/${ws.id}/favourites/${r.type}/${r.id}`);
      qc.invalidateQueries({ queryKey: ['favourites', ws.id] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page">
      <PageHeader title="Favourites" icon="star" subtitle="Boards, dashboards and documents you starred for quick access." />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data?.length ? (
        <EmptyState icon="star" title="No favourites yet">Use the star button on a board, dashboard or document to pin it here and in the sidebar.</EmptyState>
      ) : (
        <EntityList
          rows={q.data}
          base={`/w/${ws.id}`}
          action={(r) => (
            <button className="btn ghost icon sm" aria-label={`Remove ${r.name} from favourites`} title="Remove from favourites" onClick={() => remove(r)} style={{ color: 'var(--warning)' }}>
              <Icon name="star" />
            </button>
          )}
        />
      )}
    </div>
  );
}
