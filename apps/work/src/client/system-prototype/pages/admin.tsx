// Administration: the company, people and roles with the role-by-module permission matrix, departments, sites and
// branches, module access switches, approval workflows, numbering and the audit trail.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, useToast } from '../../components/ui/overlays';
import { COMPANIES, DEPARTMENTS, PEOPLE } from '../data/core';
import { ACCESS_REQUESTS, ADMIN_MODULES, AUDIT, MATRIX, MATRIX_MODULES, NUMBERING, SITES } from '../data/work';
import { fmtDate, fmtDateTime, PHONE, useMedia } from '../format';
import { PIcon } from '../icons';
import { Facts, ModuleBadge, Panel, StateBadges, StatusBadge, Tabs } from '../kit';
import { RecLink } from '../links';
import { ROLES } from '../nav';
import { ApprovalSteps } from '../patterns/Approval';
import type { ModuleId, NavPage, PageState, RoleId } from '../types';
import { ModulePage } from './common';

export function CompanyPage({ page }: { page: NavPage }) {
  const co = COMPANIES[0];
  return (
    <ModulePage page={page} subtitle="The BIZOMAT company account that the System belongs to.">
      <div className="erp-two">
        <Panel title="Company">
          <Facts
            columns={2}
            items={[
              ['Name', co.name],
              ['ABN', 'Not recorded (demonstration company)'],
              ['Sites', co.sites.join(', ')],
              ['People', String(PEOPLE.length)],
              ['Departments', String(DEPARTMENTS.length)],
              ['Plan', 'Demonstration'],
            ]}
          />
        </Panel>
        <Panel title="Tools in use">
          <ul className="erp-plain-list">
            {ADMIN_MODULES.filter((m) => m.state === 'W').map((m) => (
              <li key={m.id}>
                {m.name} <StateBadges states={['W']} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </ModulePage>
  );
}

const LEVELS = ['None', 'Read', 'Edit', 'Full'];
export function PeoplePage({ page }: { page: NavPage }) {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') ?? 'people';
  const toast = useToast();
  const phone = useMedia(PHONE);
  const [matrix, setMatrix] = useState<Record<RoleId, string[]>>(MATRIX);
  const [requests, setRequests] = useState(ACCESS_REQUESTS.map((r) => ({ ...r, status: 'Pending' })));
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  return (
    <ModulePage
      page={page}
      actions={
        <button type="button" className="btn primary" onClick={() => setInvite(true)}>
          <PIcon name="plus" /> Invite a person
        </button>
      }
    >
      <Tabs
        tabs={[
          { id: 'people', label: 'People', count: PEOPLE.length },
          { id: 'roles', label: 'Roles and permissions' },
          { id: 'requests', label: 'Access requests', count: requests.filter((r) => r.status === 'Pending').length },
        ]}
        active={tab}
        onChange={(t) => setParams(t === 'people' ? {} : { tab: t }, { replace: true })}
        label="People and roles"
      />
      <div role="tabpanel" className="erp-tabpanel">
        {tab === 'people' ? (
          phone ? (
            <ul className="erp-cards">
              {PEOPLE.map((p) => (
                <li key={p.id} className="erp-card">
                  <div className="erp-card-top">
                    <strong>{p.name}</strong>
                    <StatusBadge status={p.status} />
                  </div>
                  <span className="small">
                    {p.title} · {p.dept}
                  </span>
                  <span className="muted small">
                    {p.site} · {p.email}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="card erp-table-card">
              <div className="erp-table-scroll">
                <table className="data-table erp-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Job title</th>
                      <th scope="col">Department</th>
                      <th scope="col">Site</th>
                      <th scope="col">Email</th>
                      <th scope="col">Last sign-in</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PEOPLE.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.title}</td>
                        <td>{p.dept}</td>
                        <td>{p.site}</td>
                        <td>{p.email}</td>
                        <td>{p.lastSignIn ? fmtDate(p.lastSignIn) : <span className="muted">Not yet</span>}</td>
                        <td>
                          <StatusBadge status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : tab === 'roles' ? (
          <Panel
            title="Permissions by role and module"
            actions={
              <>
                <button type="button" className="btn sm" onClick={() => setMatrix(MATRIX)}>
                  Reset
                </button>
                <button type="button" className="btn primary sm" onClick={() => toast('Permissions saved for this visit. The server checks every record anyway.')}>
                  Save permissions
                </button>
              </>
            }
          >
            <p className="muted small">Default access per role. An administrator can change it; each module still checks every record on the server.</p>
            <div className="erp-table-scroll erp-matrix-wrap">
              <table className="data-table erp-table erp-matrix">
                <caption className="sr-only">Access level for each role in each module</caption>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    {MATRIX_MODULES.map((m) => (
                      <th key={m} scope="col">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((r) => (
                    <tr key={r.id}>
                      <th scope="row">{r.label}</th>
                      {MATRIX_MODULES.map((m, i) => (
                        <td key={m}>
                          <label className="sr-only" htmlFor={`pm-${r.id}-${i}`}>
                            {r.label}, {m}
                          </label>
                          <select
                            id={`pm-${r.id}-${i}`}
                            className={`select sm erp-level l-${matrix[r.id][i].toLowerCase()}`}
                            value={matrix[r.id][i]}
                            onChange={(e) => setMatrix((mx) => ({ ...mx, [r.id]: mx[r.id].map((v, j) => (j === i ? e.target.value : v)) }))}
                          >
                            {LEVELS.map((l) => (
                              <option key={l}>{l}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        ) : (
          <Panel title="Access requests">
            <ul className="erp-plain-list">
              {requests.map((r, i) => (
                <li key={r.name} className="erp-request">
                  <span className="grow">
                    <strong>{r.name}</strong> asks for {r.wants}. <span className="muted small">“{r.reason}” · {fmtDate(r.date)}</span>
                  </span>
                  {r.status === 'Pending' ? (
                    <span className="row">
                      <button type="button" className="btn sm" onClick={() => setRequests((list) => list.map((x, j) => (j === i ? { ...x, status: 'Rejected' } : x)))}>
                        Decline
                      </button>
                      <button type="button" className="btn primary sm" onClick={() => setRequests((list) => list.map((x, j) => (j === i ? { ...x, status: 'Approved' } : x)))}>
                        Approve
                      </button>
                    </span>
                  ) : (
                    <StatusBadge status={r.status} />
                  )}
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
      {invite ? (
        <Modal
          title="Invite a person"
          onClose={() => setInvite(false)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setInvite(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  if (!/^\S+@\S+\.\S+$/.test(email)) return setInviteError('Enter an email address, for example name@example.com.');
                  setInvite(false);
                  setEmail('');
                  toast(`Invitation to ${email} drafted (prototype: nothing is sent).`);
                }}
              >
                Send invitation
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="inv-email">Email</label>
            <input id="inv-email" className={`input${inviteError ? ' invalid' : ''}`} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setInviteError(''); }} aria-invalid={!!inviteError} aria-describedby={inviteError ? 'inv-error' : 'inv-hint'} />
            {inviteError ? (
              <span id="inv-error" className="error" role="alert">
                {inviteError}
              </span>
            ) : (
              <span id="inv-hint" className="hint">
                They join the company account and get the role you choose.
              </span>
            )}
          </div>
          <div className="field">
            <label htmlFor="inv-role">Role</label>
            <select id="inv-role" className="select" defaultValue="production">
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </Modal>
      ) : null}
    </ModulePage>
  );
}

export function DepartmentsPage({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="Departments appear in every tool: Project Management, the CRM, Finance and the System.">
      <Panel title="Departments">
        <ul className="erp-dept-list">
          {DEPARTMENTS.map((d) => (
            <li key={d}>
              <strong>{d}</strong>
              <span className="muted small">{PEOPLE.filter((p) => p.dept === d).length} people</span>
            </li>
          ))}
        </ul>
      </Panel>
    </ModulePage>
  );
}

export function SitesPage({ page }: { page: NavPage }) {
  const toast = useToast();
  const [sites, setSites] = useState(SITES);
  const [name, setName] = useState('');
  const [kind, setKind] = useState('Branch');
  const [error, setError] = useState('');
  return (
    <ModulePage page={page} subtitle="Sites and branches: a new core entity. Lists, stock and reports can be filtered by site.">
      <div className="erp-two">
        <Panel title="Sites">
          <ul className="erp-plain-list">
            {sites.map((s) => (
              <li key={s.id} className="erp-site">
                <span className="grow">
                  <strong>{s.name}</strong> <span className="muted small">· {s.kind}</span>
                  <br />
                  <span className="muted small">
                    {s.address} · {s.warehouses} warehouse · {s.people} people
                  </span>
                </span>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Add a site">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return setError('Enter the name of the site.');
              setSites((list) => [...list, { id: `SITE-${list.length + 1}`, name: name.trim(), kind, address: 'Address not recorded', warehouses: 0, people: 0, status: 'Active' }]);
              toast(`Site ${name.trim()} added for this visit.`);
              setName('');
            }}
          >
            <div className="field">
              <label htmlFor="site-name">Name</label>
              <input id="site-name" className={`input${error ? ' invalid' : ''}`} value={name} onChange={(e) => { setName(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'site-error' : 'site-hint'} />
              {error ? (
                <span id="site-error" className="error" role="alert">
                  {error}
                </span>
              ) : (
                <span id="site-hint" className="hint">
                  For example the city or the branch name.
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="site-kind">Kind</label>
              <select id="site-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
                <option>Branch</option>
                <option>Factory</option>
                <option>Warehouse</option>
                <option>Office</option>
              </select>
            </div>
            <button type="submit" className="btn primary">
              Add site
            </button>
          </form>
        </Panel>
      </div>
    </ModulePage>
  );
}

export function ModulesPage({ page }: { page: NavPage }) {
  const toast = useToast();
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(ADMIN_MODULES.map((m) => [m.id, m.on])));
  return (
    <ModulePage page={page} subtitle="Turn modules on or off for the company. Turning a module off hides it for everyone; no data is deleted.">
      <Panel title="Module access">
        <ul className="erp-switches">
          {ADMIN_MODULES.map((m) => (
            <li key={m.id}>
              <span className="grow">
                <strong>{m.name}</strong> <StateBadges states={[m.state as PageState]} />
              </span>
              <label className="switch">
                <input
                  type="checkbox"
                  role="switch"
                  aria-label={`${m.name} on`}
                  checked={on[m.id]}
                  onChange={(e) => {
                    setOn((s) => ({ ...s, [m.id]: e.target.checked }));
                    toast(`${m.name} turned ${e.target.checked ? 'on' : 'off'} for this visit.`);
                  }}
                />
                <span />
              </label>
              <span className="erp-switch-state small">{on[m.id] ? 'On' : 'Off'}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </ModulePage>
  );
}

export function WorkflowsPage({ page }: { page: NavPage }) {
  const flows: { name: string; when: string; module: ModuleId; steps: { label: string; who: string }[] }[] = [
    { name: 'Purchase orders over $10,000', when: 'Total including GST is more than $10,000', module: 'System', steps: [{ label: 'Budget check', who: 'BIZOMAT (automatic)' }, { label: 'Approval', who: 'Finance manager' }, { label: 'Send to supplier', who: 'Buyer' }] },
    { name: 'Purchase requisitions', when: 'Every requisition', module: 'System', steps: [{ label: 'Approval', who: 'Procurement manager' }, { label: 'Convert to purchase order', who: 'Buyer' }] },
    { name: 'Engineering changes', when: 'Every change to a released product', module: 'System', steps: [{ label: 'Engineering check', who: 'Another engineer' }, { label: 'Quality and production review', who: 'Quality manager' }, { label: 'Release', who: 'Engineer' }] },
    { name: 'Nonconformance dispositions', when: 'Rework, scrap, use as is or return', module: 'System', steps: [{ label: 'Disposition', who: 'Quality manager' }, { label: 'Verify and close', who: 'Quality manager' }] },
    { name: 'Bills, claims and credit notes', when: 'Finance approval rules (working today)', module: 'Finance', steps: [{ label: 'Approval', who: 'Finance manager' }] },
  ];
  return (
    <ModulePage page={page} subtitle="Who approves what. System reuses Finance's approval rules for its own records.">
      <div className="erp-cardgrid">
        {flows.map((f) => (
          <Panel key={f.name} title={f.name} actions={<ModuleBadge module={f.module} />}>
            <p className="muted small">When: {f.when}</p>
            <ApprovalSteps steps={f.steps.map((s) => ({ ...s, state: 'waiting' as const }))} />
          </Panel>
        ))}
      </div>
    </ModulePage>
  );
}

export function NumberingPage({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page}>
      <Panel title="Number series">
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th scope="col">Prefix</th>
                <th scope="col">Next number</th>
                <th scope="col">Kept in</th>
              </tr>
            </thead>
            <tbody>
              {NUMBERING.map(([name, prefix, next, owner, st]) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td className="mono">{prefix}</td>
                  <td className="mono">
                    {prefix}
                    {String(next).padStart(4, '0')}
                  </td>
                  <td>
                    {owner} <StateBadges states={[st as PageState]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}

export function AuditPage({ page }: { page: NavPage }) {
  const [mod, setMod] = useState('All');
  const rows = AUDIT.filter((a) => mod === 'All' || a[2] === mod);
  return (
    <ModulePage page={page}>
      <Panel
        title="Changes across the tools"
        actions={
          <>
            <label htmlFor="audit-mod" className="sr-only">
              Module
            </label>
            <select id="audit-mod" className="select sm erp-size" value={mod} onChange={(e) => setMod(e.target.value)}>
              {['All', 'System', 'Finance', 'Company'].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </>
        }
      >
        <div className="erp-table-scroll">
          <table className="data-table erp-table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Who</th>
                <th scope="col">Tool</th>
                <th scope="col">Record</th>
                <th scope="col">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([at, who, m, rec, field, from, to], i) => (
                <tr key={i}>
                  <td>{fmtDateTime(at)}</td>
                  <td>{who}</td>
                  <td>
                    <ModuleBadge module={m as ModuleId} />
                  </td>
                  <td>
                    <RecLink id={rec} />
                  </td>
                  <td>
                    {field}: {from ? `${from} → ` : ''}
                    {to}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ModulePage>
  );
}
