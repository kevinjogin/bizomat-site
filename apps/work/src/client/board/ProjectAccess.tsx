// The project's permission matrix: each person's access level and capabilities on this project, set one by one.
// The server enforces every rule (no one gives more than they have or changes their own access); this screen shows
// what the server reports.

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CAPABILITY_KEYS, CAPABILITY_LABELS, ROLE_LABELS, type CapabilityKey, type ProjectCaps } from '../../shared/permissions';
import { CURRENCIES } from '../../shared/money';
import type { BoardBundle, WorkspaceRole } from '../../shared/types';
import { errorMessage, get, patch, put } from '../lib/api';
import { useUser } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { Avatar, ErrorBox, Field, Loading } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import '../styles/platform.css';

interface Person {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  orgRole: WorkspaceRole;
  setting: 'default' | 'none' | 'view' | 'edit' | 'manage';
  level: 'none' | 'view' | 'edit' | 'manage';
  locked: boolean;
  overrides: Record<CapabilityKey, boolean | null>;
  caps: ProjectCaps | null;
  tasks: { id: string; name: string }[];
}

const LEVELS: { id: Person['setting']; label: string }[] = [
  { id: 'default', label: 'From organisation role' },
  { id: 'none', label: 'No access' },
  { id: 'view', label: 'View project' },
  { id: 'edit', label: 'Edit project' },
  { id: 'manage', label: 'Manage project' },
];

export function AccessMatrix({ bundle }: { bundle: BoardBundle }) {
  const me = useUser();
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['board-access', bundle.board.id], queryFn: () => get<{ people: Person[]; myCaps: ProjectCaps; financeVisibility: string }>(`/boards/${bundle.board.id}/access`) });
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const people = (q.data?.people ?? []).filter((p) => !filter || p.name.toLowerCase().includes(filter.toLowerCase()) || p.email.toLowerCase().includes(filter.toLowerCase()));
  const myCaps = q.data!.myCaps;
  const save = async (p: Person, setting: Person['setting'], overrides: Record<CapabilityKey, boolean | null>) => {
    setBusy(p.id);
    try {
      await put(`/boards/${bundle.board.id}/access/${p.id}`, { level: setting, overrides });
      await q.refetch();
      qc.invalidateQueries({ queryKey: ['board', bundle.board.id] });
      toast(`Access updated for ${p.name}`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(null);
    }
  };
  return (
    <div className="col" style={{ gap: 10 }}>
      <p className="muted small">
        Each person's access to this project. "From organisation role" follows their role and the project's visibility ({bundle.board.visibility === 'private' ? 'private: only people added here' : 'shared with the organisation'}). Ticks are the defaults for the level; click to switch one on or off for this person. Organisation owners and admins always have full access. Guests see only what is shared with them.
      </p>
      <input className="input" placeholder="Find a person" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Find a person" />
      <div className="table-scroll">
        <table className="access-matrix">
          <thead>
            <tr>
              <th>Person</th>
              <th>Project access</th>
              {CAPABILITY_KEYS.map((k) => <th key={k}>{CAPABILITY_LABELS[k]}</th>)}
            </tr>
          </thead>
          <tbody>
            {people.map((p) => {
              const self = p.id === me.id;
              const disabled = p.locked || busy === p.id || (self && !p.locked);
              return (
                <tr key={p.id}>
                  <td>
                    <div className="who">
                      <Avatar id={p.id} name={p.name} url={p.avatarUrl} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <div className="ellipsis"><strong>{p.name}</strong> {self ? <span className="badge accent">You</span> : null}</div>
                        <div className="muted small ellipsis">{p.email} · {ROLE_LABELS[p.orgRole]}</div>
                        {p.tasks.length ? <div className="muted small">Task access: {p.tasks.map((t) => t.name).join(', ')}</div> : null}
                      </div>
                    </div>
                  </td>
                  <td>
                    <select className="select sm" value={p.setting} disabled={disabled} aria-label={`Project access for ${p.name}`} onChange={(e) => save(p, e.target.value as Person['setting'], p.overrides)}>
                      {LEVELS.filter((l) => l.id === 'default' || l.id === 'none' || rank(l.id) <= rank(myCaps.level) || l.id === p.setting).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                    <div className="muted small">{p.level === 'none' ? 'No access' : `Effective: ${p.level}`}</div>
                  </td>
                  {CAPABILITY_KEYS.map((k) => {
                    const on = !!p.caps?.[k];
                    const overridden = p.overrides[k] !== null && p.overrides[k] !== undefined;
                    return (
                      <td key={k}>
                        <button
                          className={`btn ghost icon sm tri${overridden ? ' active' : ''}`}
                          disabled={disabled || p.level === 'none' || (!on && !myCaps[k])}
                          aria-pressed={on}
                          aria-label={`${CAPABILITY_LABELS[k]} for ${p.name}: ${on ? 'yes' : 'no'}${overridden ? ' (set for this person)' : ' (default)'}`}
                          title={overridden ? 'Set for this person: click to change' : 'Default for the level: click to change'}
                          onClick={() => save(p, p.setting === 'default' && p.level !== 'none' ? p.setting : p.setting, { ...p.overrides, [k]: !on })}
                        >
                          {on ? <Icon name="check" /> : <Icon name="x" size={12} />}
                          {overridden ? <span className="small">*</span> : null}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted small">* set for this person rather than the default for their level.</p>
    </div>
  );
}

function rank(l: string) {
  return l === 'manage' ? 3 : l === 'edit' ? 2 : l === 'view' ? 1 : 0;
}

/** The project's currency, start date and project manager (used by finance and reports). */
export function ProjectDetails({ bundle }: { bundle: BoardBundle }) {
  const b = bundle.board;
  const toast = useToast();
  const qc = useQueryClient();
  const [currency, setCurrency] = useState(b.currency ?? '');
  const [startDate, setStartDate] = useState(b.startDate ?? '');
  const [managerId, setManagerId] = useState(b.managerId ?? '');
  const canManage = b.caps?.level === 'manage';
  const canFinance = !!b.caps?.editFinance;
  const eligible = bundle.members.filter((m) => (bundle.memberAccess?.[m.id] ?? 'none') !== 'none');
  const save = async () => {
    try {
      await patch(`/boards/${b.id}/project`, {
        ...(canFinance ? { currency: currency || null } : {}),
        startDate: startDate || null,
        managerId: managerId || null,
      });
      qc.invalidateQueries({ queryKey: ['board', b.id] });
      toast('Project details saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const orgCurrency = bundle.finance?.workspaceCurrency;
  return (
    <div className="col" style={{ gap: 4 }}>
      <Field label="Project currency" hint={orgCurrency ? `Empty: the organisation's currency (${orgCurrency}). Changing it never changes amounts already entered.` : 'The organisation has no default currency yet (Settings > Finance). Changing it never changes amounts already entered.'}>
        <select className="select" value={currency} disabled={!canManage || !canFinance} onChange={(e) => setCurrency(e.target.value)}>
          <option value="">{orgCurrency ? `Organisation currency (${orgCurrency})` : 'Not set'}</option>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
        </select>
      </Field>
      <Field label="Project start date" hint="Reports from inception start here (default: the day the board was created).">
        <input className="input" type="date" value={startDate} disabled={!canManage} onChange={(e) => setStartDate(e.target.value)} />
      </Field>
      <Field label="Project manager" hint="Shown on report covers. Must have access to the project.">
        <select className="select" value={managerId} disabled={!canManage} onChange={(e) => setManagerId(e.target.value)}>
          <option value="">Not set (the project's managers)</option>
          {eligible.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Field>
      {canManage ? <div><button className="btn primary" onClick={save}>Save project details</button></div> : <p className="muted small">Only people who manage this project change these.</p>}
    </div>
  );
}
