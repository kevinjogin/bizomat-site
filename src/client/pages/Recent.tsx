import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, post } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import { EntityList, ENTITY_LABEL, type EntityRef } from './Favourites';
import '../styles/content.css';

export default function Recent() {
  const ws = useWorkspace();
  const qc = useQueryClient();
  const toast = useToast();
  const [type, setType] = useState<string>('all');
  const q = useQuery({ queryKey: ['recents', ws.id], queryFn: () => get<EntityRef[]>(`/workspaces/${ws.id}/recents`) });
  const favs = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<EntityRef[]>(`/workspaces/${ws.id}/favourites`) });
  const isFav = (r: EntityRef) => !!favs.data?.some((f) => f.type === r.type && f.id === r.id);
  const toggle = async (r: EntityRef) => {
    try {
      if (isFav(r)) await del(`/workspaces/${ws.id}/favourites/${r.type}/${r.id}`);
      else await post(`/workspaces/${ws.id}/favourites`, { type: r.type, id: r.id });
      qc.invalidateQueries({ queryKey: ['favourites', ws.id] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const types = Array.from(new Set((q.data ?? []).map((r) => r.type)));
  const rows = (q.data ?? []).filter((r) => type === 'all' || r.type === type);
  return (
    <div className="page">
      <PageHeader title="Recent" icon="clock" subtitle="Everything you opened lately in this workspace." />
      {types.length > 1 ? (
        <div className="row wrap" style={{ marginBottom: 12, gap: 6 }} role="group" aria-label="Filter by type">
          <button className={`chip${type === 'all' ? ' on' : ''}`} aria-pressed={type === 'all'} onClick={() => setType('all')}>All</button>
          {types.map((t) => <button key={t} className={`chip${type === t ? ' on' : ''}`} aria-pressed={type === t} onClick={() => setType(t)}>{ENTITY_LABEL[t] ?? t}</button>)}
        </div>
      ) : null}
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !rows.length ? (
        <EmptyState icon="clock" title="Nothing here yet">Boards, items, documents and dashboards you visit will appear here.</EmptyState>
      ) : (
        <EntityList
          rows={rows}
          base={`/w/${ws.id}`}
          action={(r) =>
            r.type === 'item' ? <span style={{ width: 26 }} /> : (
              <button className="btn ghost icon sm" aria-label={isFav(r) ? `Unfavourite ${r.name}` : `Favourite ${r.name}`} aria-pressed={isFav(r)} onClick={() => toggle(r)} style={{ color: isFav(r) ? 'var(--warning)' : undefined }}>
                <Icon name="star" />
              </button>
            )
          }
        />
      )}
    </div>
  );
}
