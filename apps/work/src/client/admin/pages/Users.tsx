import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { useAdmin, type AdminUserRow } from '../api';
import { Card, Empty, PageIntro, QueryState, StatusPill, TableWrap, When, fmtDateTime, num } from '../ui';

interface UsersResp {
  total: number;
  users: AdminUserRow[];
  page: number;
  pageSize: number;
}

const STATUSES: { v: string; label: string }[] = [
  { v: '', label: 'All statuses' },
  { v: 'active_now', label: 'Active now' },
  { v: 'active', label: 'Active in last 7 days' },
  { v: 'inactive', label: 'Inactive' },
  { v: 'never_returned', label: 'Never returned' },
  { v: 'disabled', label: 'Disabled' },
];

export default function Users() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const dq = useDebounced(q.trim(), 300);
  const status = params.get('status') ?? '';
  const regFrom = params.get('regFrom') ?? '';
  const regTo = params.get('regTo') ?? '';
  const sort = params.get('sort') ?? 'registered';
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1);
  const navigate = useNavigate();
  const set = (k: string, v: string) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (v) n.set(k, v);
        else n.delete(k);
        if (k !== 'page') n.delete('page');
        return n;
      },
      { replace: true },
    );
  const qs = new URLSearchParams();
  if (dq) qs.set('q', dq);
  if (status) qs.set('status', status);
  if (regFrom) qs.set('regFrom', regFrom);
  if (regTo) qs.set('regTo', regTo);
  qs.set('sort', sort);
  qs.set('page', String(page));
  const res = useAdmin<UsersResp>(`/users?${qs}`, { placeholderData: (prev) => prev });
  return (
    <div className="ac-stack">
      <PageIntro actions={<a className="btn" href="/api/admin/export/users.csv" download><Icon name="download" /> Export CSV</a>}>
        <p className="muted">Every registered account with sign-in, activity and usage counts. Click a row for the full profile.</p>
      </PageIntro>
      <Card>
        <div className="ac-filters">
          <label className="ac-search">
            <Icon name="search" />
            <input
              className="input"
              placeholder="Search name or email"
              aria-label="Search users by name or email"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                set('q', e.target.value.trim());
              }}
            />
          </label>
          <select className="select" aria-label="Status" value={status} onChange={(e) => set('status', e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.v} value={s.v}>{s.label}</option>
            ))}
          </select>
          <label className="ac-inline-field">
            <span>Registered from</span>
            <input className="input" type="date" value={regFrom} onChange={(e) => set('regFrom', e.target.value)} />
          </label>
          <label className="ac-inline-field">
            <span>to</span>
            <input className="input" type="date" value={regTo} onChange={(e) => set('regTo', e.target.value)} />
          </label>
          <select className="select" aria-label="Sort" value={sort} onChange={(e) => set('sort', e.target.value)}>
            <option value="registered">Newest registrations</option>
            <option value="oldest">Oldest registrations</option>
            <option value="activity">Most recent activity</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
        <QueryState q={res}>
          {() => {
            const d = res.data!;
            if (!d.users.length) return <Empty>No users match these filters.</Empty>;
            const pages = Math.max(1, Math.ceil(d.total / d.pageSize));
            return (
              <>
                <div className="muted small ac-count">
                  {num(d.total)} user{d.total === 1 ? '' : 's'}
                  {res.isFetching ? ' · updating…' : ''}
                </div>
                <TableWrap label="Users">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Status</th>
                      <th>Registered</th>
                      <th>Last login</th>
                      <th>Last activity</th>
                      <th className="num">Logins</th>
                      <th className="num">Workspaces</th>
                      <th className="num">Projects</th>
                      <th className="num">Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.users.map((u) => (
                      <tr key={u.id} className="clickable" tabIndex={0} onClick={() => navigate(`/admin/users/${u.id}`)} onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/users/${u.id}`)}>
                        <td>
                          <div className="ac-user-cell">
                            <span className="ac-user-name">
                              {u.name}
                              {u.platformRole ? <span className={`ac-role ${u.platformRole}`}>{u.platformRole}</span> : null}
                            </span>
                            <span className="muted small">{u.email}</span>
                          </div>
                        </td>
                        <td>
                          <StatusPill status={u.status} />
                          {u.locked ? <StatusPill status="locked" /> : null}
                        </td>
                        <td title={fmtDateTime(u.registeredAt)}>{fmtDateTime(u.registeredAt)}</td>
                        <td><When ts={u.lastLoginAt} /></td>
                        <td><When ts={u.lastActiveAt} /></td>
                        <td className="num">{num(u.logins)}</td>
                        <td className="num">{num(u.workspaces)}</td>
                        <td className="num">{num(u.projects)}</td>
                        <td className="num">{num(u.tasks)}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
                {pages > 1 ? (
                  <div className="ac-pager">
                    <button className="btn sm" disabled={page <= 1} onClick={() => set('page', String(page - 1))}>Previous</button>
                    <span className="muted small">Page {page} of {pages}</span>
                    <button className="btn sm" disabled={page >= pages} onClick={() => set('page', String(page + 1))}>Next</button>
                  </div>
                ) : null}
              </>
            );
          }}
        </QueryState>
      </Card>
    </div>
  );
}
