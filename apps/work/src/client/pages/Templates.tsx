import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get } from '../lib/api';
import { canEdit, isAdmin, useWorkspace } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { useConfirm, useToast } from '../components/ui/overlays';
import { CreateBoardDialog } from '../components/layout/CreateDialogs';
import '../styles/content.css';

interface BuiltinTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  columns: { title: string; type: string }[];
  views: string[];
  groups: string[];
}

interface WorkspaceTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: number;
  createdByName: string;
}

const VIEW_ICON: Record<string, string> = { table: 'table', kanban: 'kanban', calendar: 'calendar', timeline: 'timeline', chart: 'chart', workload: 'workload', form: 'form', map: 'map', files: 'file' };

export default function Templates() {
  const ws = useWorkspace();
  const [use, setUse] = useState<string | null>(null);
  const [category, setCategory] = useState('All');
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['templates', ws.id], queryFn: () => get<{ builtin: BuiltinTemplate[]; workspace: WorkspaceTemplate[] }>(`/workspaces/${ws.id}/templates`) });
  const categories = useMemo(() => ['All', ...Array.from(new Set((q.data?.builtin ?? []).map((t) => t.category)))], [q.data]);
  const editable = canEdit(ws.role);
  const builtin = (q.data?.builtin ?? []).filter((t) => category === 'All' || t.category === category);
  return (
    <div className="page">
      <PageHeader title="Templates" icon="template" subtitle="Start new boards from proven structures — columns, groups, views and sample items included." />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : (
        <div className="stack-lg">
          <section>
            <div className="row wrap" style={{ marginBottom: 12 }}>
              <h2 className="grow">Built-in templates</h2>
              <div className="row wrap" role="group" aria-label="Filter by category" style={{ gap: 6 }}>
                {categories.map((c) => <button key={c} className={`chip${category === c ? ' on' : ''}`} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}
              </div>
            </div>
            <div className="grid-cards">
              {builtin.map((t) => (
                <article key={t.id} className="card template-card">
                  <div className="row">
                    <div className="empty-icon" style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={t.icon} /></div>
                    <div className="grow">
                      <h3>{t.name}</h3>
                      <span className="muted small">{t.category}</span>
                    </div>
                  </div>
                  <p className="muted small" style={{ margin: 0 }}>{t.description}</p>
                  {t.columns.length ? <div className="cols">{t.columns.slice(0, 8).map((c) => <span key={c.title} className="badge" title={c.type}>{c.title}</span>)}</div> : null}
                  {t.groups.length ? <div className="muted small">Groups: {t.groups.join(' · ')}</div> : null}
                  <div className="row small muted" aria-label="Views">{t.views.map((v, i) => <Icon key={`${v}${i}`} name={VIEW_ICON[v] ?? 'grid'} size={14} title={v} />)}</div>
                  <div className="actions">
                    <button className="btn primary sm" disabled={!editable} onClick={() => setUse(t.id)}>Use template</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2 style={{ marginBottom: 12 }}>Workspace templates</h2>
            {!q.data?.workspace.length ? (
              <EmptyState icon="template" title="No custom templates yet">
                Open any board and choose <strong>Save as template</strong> from its menu to reuse its structure and automations.
              </EmptyState>
            ) : (
              <div className="grid-cards">
                {q.data.workspace.map((t) => (
                  <article key={t.id} className="card template-card">
                    <div className="row">
                      <Icon name={t.icon || 'template'} />
                      <h3 className="grow ellipsis">{t.name}</h3>
                    </div>
                    {t.description ? <p className="muted small" style={{ margin: 0 }}>{t.description}</p> : null}
                    <span className="muted small">By {t.createdByName} · {timeAgo(t.createdAt)}</span>
                    <div className="actions">
                      <button className="btn primary sm" disabled={!editable} onClick={() => setUse(t.id)}>Use template</button>
                      {isAdmin(ws.role) ? (
                        <button
                          className="btn ghost sm"
                          onClick={async () => {
                            if (!(await confirm({ title: 'Delete template?', message: 'Boards created from it are not affected.', danger: true, confirmLabel: 'Delete', typeToConfirm: t.name }))) return;
                            try {
                              await del(`/boards/${t.id}`, { confirmName: t.name });
                              qc.invalidateQueries({ queryKey: ['templates', ws.id] });
                              toast('Template deleted');
                            } catch (e) {
                              toast(errorMessage(e), 'error');
                            }
                          }}
                        >
                          <Icon name="trash" size={14} /> Delete
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      {use ? <CreateBoardDialog wsId={ws.id} templateId={use} onClose={() => setUse(null)} /> : null}
    </div>
  );
}
