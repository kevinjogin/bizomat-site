import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Switch } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import { RunsDialog, type AutomationDTO } from '../components/automations/AutomationBuilder';
import '../styles/admin.css';

const TRIGGER_TEXT: Record<string, string> = {
  item_created: 'Item created',
  status_changed: 'Status changed',
  column_changed: 'Column changed',
  item_moved_to_group: 'Item moved',
  update_posted: 'Update posted',
  date_arrived: 'Date arrives',
  recurring: 'Recurring schedule',
};

export default function Automations() {
  const ws = useWorkspace();
  const q = useQuery({ queryKey: ['automations', 'workspace', ws.id], queryFn: () => get<AutomationDTO[]>(`/workspaces/${ws.id}/automations`) });
  const qc = useQueryClient();
  const toast = useToast();
  const [filter, setFilter] = useState('');
  const [runs, setRuns] = useState<AutomationDTO | null>(null);
  const toggle = async (a: AutomationDTO, enabled: boolean) => {
    try {
      await patch(`/automations/${a.id}`, { enabled });
      qc.invalidateQueries({ queryKey: ['automations'] });
      toast(enabled ? 'Automation enabled' : 'Automation paused');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const list = (q.data ?? []).filter((a) => !filter || a.name.toLowerCase().includes(filter.toLowerCase()) || (a.boardName ?? '').toLowerCase().includes(filter.toLowerCase()));
  const byBoard = new Map<string, AutomationDTO[]>();
  for (const a of list) byBoard.set(a.boardId, [...(byBoard.get(a.boardId) ?? []), a]);
  const enabled = (q.data ?? []).filter((a) => a.enabled).length;
  return (
    <div className="page">
      <PageHeader icon="bolt" title="Automations" subtitle={q.data ? `${enabled} active of ${q.data.length} across your boards.` : 'Rules that run automatically on your boards.'} />
      <div className="filters-bar">
        <input className="input sm" style={{ maxWidth: 280 }} placeholder="Filter automations or boards…" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter automations" />
      </div>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {q.data && q.data.length === 0 ? (
        <div className="card">
          <EmptyState icon="bolt" title="No automations yet" action={<Link className="btn primary" to={`/w/${ws.id}/boards`}>Open a board</Link>}>
            Open a board and choose Automate to add rules like "when status changes to Done, set the completion date".
          </EmptyState>
        </div>
      ) : null}
      <div className="col" style={{ gap: 14 }}>
        {Array.from(byBoard.entries()).map(([boardId, autos]) => (
          <section key={boardId} className="card">
            <div className="card-header">
              <Icon name="grid" />
              <h2 className="grow">{autos[0].boardName}</h2>
              <Link className="btn sm" to={`/w/${ws.id}/boards/${boardId}?automations=1`}>Manage on board</Link>
            </div>
            {autos.map((a) => (
              <div key={a.id} className="list-row">
                <Switch label={`${a.enabled ? 'Disable' : 'Enable'} ${a.name}`} checked={a.enabled} onChange={(v) => toggle(a, v)} />
                <span className="grow" style={{ minWidth: 0 }}>
                  <strong>{a.name}</strong>
                  <div className="muted small">
                    {TRIGGER_TEXT[a.trigger?.type] ?? a.trigger?.type} · {a.actions.length} action(s) · {a.runCount} run(s){a.lastRunAt ? ` · last ${timeAgo(a.lastRunAt)}` : ''}
                  </div>
                </span>
                {!a.enabled ? <span className="badge">Paused</span> : <span className="badge success">Active</span>}
                <button className="btn ghost sm" onClick={() => setRuns(a)}><Icon name="history" size={14} /> Log</button>
              </div>
            ))}
          </section>
        ))}
      </div>
      {runs ? <RunsDialog automation={runs} onClose={() => setRuns(null)} /> : null}
    </div>
  );
}
