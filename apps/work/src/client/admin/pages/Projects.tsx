import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { useAdmin } from '../api';
import { Bar, Card, Empty, PageIntro, QueryState, TableWrap, When, fmtDate, num } from '../ui';

interface ProjectRow {
  id: string;
  name: string;
  createdAt: number;
  archived: boolean;
  visibility: string;
  workspaceId: string;
  workspaceName: string;
  ownerId: string | null;
  ownerName: string | null;
  ownerEmail: string | null;
  tasks: number;
  completed: number;
  contributors: number;
  lastActivityAt: number | null;
}

export default function Projects() {
  const [q, setQ] = useState('');
  const dq = useDebounced(q.trim(), 300);
  const [sort, setSort] = useState('activity');
  const res = useAdmin<{ projects: ProjectRow[] }>(`/projects?q=${encodeURIComponent(dq)}&sort=${sort}`, { placeholderData: (p) => p });
  return (
    <div className="ac-stack">
      <PageIntro>
        <p className="muted">All projects (boards) across every workspace, with task progress and who is contributing.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <label className="ac-search">
            <Icon name="search" />
            <input className="input" placeholder="Search project, workspace or owner email" aria-label="Search projects" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <select className="select" aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="activity">Most recent activity</option>
            <option value="created">Newest</option>
            <option value="tasks">Most tasks</option>
          </select>
        </div>
        <QueryState q={res}>
          {() => {
            const rows = res.data!.projects;
            if (!rows.length) return <Empty>{dq ? 'No projects match your search.' : 'No projects have been created yet.'}</Empty>;
            return (
              <>
                <div className="muted small ac-count">{num(rows.length)} project{rows.length === 1 ? '' : 's'}</div>
                <TableWrap label="Projects">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Owner</th>
                      <th className="num">Tasks</th>
                      <th style={{ minWidth: 150 }}>Completed</th>
                      <th className="num">Contributors</th>
                      <th>Last activity</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => {
                      const pct = p.tasks ? Math.round((p.completed / p.tasks) * 100) : 0;
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="ac-user-cell">
                              <span className="ac-user-name">
                                {p.name}
                                {p.archived ? <span className="ac-tag">archived</span> : null}
                                {p.visibility === 'private' ? <Icon name="lock" size={12} /> : null}
                              </span>
                              <span className="muted small">{p.workspaceName}</span>
                            </div>
                          </td>
                          <td>{p.ownerId ? <Link to={`/admin/users/${p.ownerId}`}>{p.ownerEmail}</Link> : <span className="muted">—</span>}</td>
                          <td className="num">{num(p.tasks)}</td>
                          <td>
                            <div className="row" style={{ gap: 8 }}>
                              <div style={{ flex: 1 }}><Bar value={p.completed} max={p.tasks} color="var(--success)" /></div>
                              <span className="small num" style={{ width: 70 }}>{num(p.completed)} · {pct}%</span>
                            </div>
                          </td>
                          <td className="num">{num(p.contributors)}</td>
                          <td><When ts={p.lastActivityAt} /></td>
                          <td>{fmtDate(p.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableWrap>
              </>
            );
          }}
        </QueryState>
      </Card>
    </div>
  );
}
