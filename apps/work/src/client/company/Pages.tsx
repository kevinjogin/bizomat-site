// The pages of a company: Overview (the control centre), Departments, People, Tools, Settings and Activity.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, patch, post, put } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { useSession } from '../lib/session';
import { formatMoney } from '../../shared/crm/money';
import { EmptyState, Loading, PageHeader } from '../components/ui/ui';
import { Icon } from '../components/ui/Icon';
import { useConfirm, useToast } from '../components/ui/overlays';
import {
  COMPANY_ROLE_LABELS,
  TOOL_APPS,
  TOOL_NAMES,
  TOOL_ROLES,
  abnLabel,
  co,
  departmentTree,
  toolHref,
  toolRoleLabel,
  useCompany,
  useDepartments,
  useMembers,
  useMine,
  type CompanyDTO,
  type DepartmentDTO,
  type MemberDTO,
  type ToolApp,
} from './lib';
import { DetailsFields, useDetailsEditor } from './Register';

const n = (v: number) => v.toLocaleString('en-AU');

interface Numbers {
  tasks: { open: number; overdue: number; dueSoon: number; completed30d: number; projects: number } | null;
  crm: { currency: string; openDeals: number; openValue: number; won30d: number; wonValue30d: number; openLeads: number; followUpsDue: number } | null;
  finance: { currency: string; from: string; to: string; income: number; expenses: number; net: number; receivable?: number; payable?: number } | null;
}
interface OverviewDTO {
  tools: Record<ToolApp, boolean>;
  seesAll: Record<ToolApp, boolean>;
  company: Numbers;
  departments: ({ id: string; name: string; parentId: string | null; headId: string | null; people: number } & Numbers)[];
}

function useView() {
  return useCompany().data!;
}

/** What the company's checks show, in plain words. */
function Verification({ c }: { c: CompanyDTO }) {
  const abn = abnLabel(c);
  return (
    <ul className="co-checks" aria-label="Checks on the company's details">
      <li><span className={`badge ${abn.tone}`}>{abn.tone === 'success' ? 'Confirmed' : abn.tone === 'danger' ? 'Problem' : abn.tone === 'warning' ? 'Format checked' : 'None'}</span> {abn.text}{c.abn ? ` (${c.abn})` : ''}</li>
      <li><span className={`badge ${c.emailConfirmed ? 'success' : 'warning'}`}>{c.emailConfirmed ? 'Confirmed' : 'Waiting'}</span> Contact email {c.email}{c.emailConfirmed ? ' confirmed by its link' : ': not confirmed yet'}</li>
      <li><span className="badge">Checked</span> Phone {c.phone}: an Australian {c.phoneKind === 'mobile' ? 'mobile' : c.phoneKind === 'landline' ? 'landline' : c.phoneKind === 'freecall' ? 'freecall' : 'local rate'} number in the numbering plan (not verified by SMS)</li>
      <li>
        <span className={`badge ${c.register && c.register.state && c.register.state !== c.address.state ? 'warning' : ''}`}>Checked</span> Postcode {c.address.postcode} is in {c.address.state}
        {c.register?.state ? (c.register.state === c.address.state ? '; the register’s main business location is in the same state' : `; the register lists ${c.register.state} ${c.register.postcode}`) : ''}
      </li>
    </ul>
  );
}

// ------------------------------------------------------------------ overview

export function Overview() {
  const view = useView();
  usePageTitle('Overview');
  const toast = useToast();
  const q = useQuery({ queryKey: ['company', view.company.id, 'overview'], queryFn: () => get<OverviewDTO>(co(view.company.id, '/overview')) });
  const members = useMembers(view.company.id);
  const nameOf = (id: string | null) => members.data?.members.find((m) => m.userId === id)?.name ?? '';
  const admin = view.me.role !== 'member';
  const c = view.company;
  const sendLink = async () => {
    try {
      const r = await post<{ result: string }>(co(c.id, '/email/send-confirmation'));
      toast(r.result === 'sent' ? `Confirmation link sent to ${c.email}` : r.result === 'not_configured' ? 'Email is not connected on this service yet, so the link cannot be sent.' : 'Too many links sent; try again later.', r.result === 'sent' ? 'info' : 'error');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page crm-page crm-dashboard">
      <PageHeader title={c.name} subtitle={`${c.kind === 'individual' ? 'In your own name' : c.legalName || 'Business'} · ${c.address.suburb} ${c.address.state} ${c.address.postcode} · You are ${view.me.roleLabel.toLowerCase()}`} />
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Company checks</h2>
        <Verification c={c} />
        {c.warnings.length ? <ul className="co-warnings">{c.warnings.map((w) => <li key={w} className="small">{w}</li>)}</ul> : null}
        {admin && !c.emailConfirmed ? <div><button className="btn sm" onClick={sendLink}>Send the confirmation link again</button></div> : null}
      </section>

      {q.error ? <p className="warning-text">{errorMessage(q.error)}</p> : !q.data ? <Loading /> : (
        <>
          <div className="co-tools-grid">
            {TOOL_APPS.map((app) => <ToolCard key={app} app={app} numbers={q.data.company[app]} linked={q.data.tools[app]} />)}
          </div>
          <section className="card card-pad">
            <div className="row"><h2 className="crm-subhead grow">Departments</h2></div>
            {q.data.departments.length ? (
              <div className="crm-table-scroll">
                <table className="data-table co-dept-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Head</th>
                      <th className="num">People</th>
                      {q.data.tools.tasks ? <th className="num">Open tasks</th> : null}
                      {q.data.tools.tasks ? <th className="num">Overdue</th> : null}
                      {q.data.tools.crm ? <th className="num">Open deals</th> : null}
                      {q.data.tools.finance ? <th className="num">Net this year</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {orderDepartments(q.data.departments).map((d) => (
                      <tr key={d.id}>
                        <td><span className="co-indent" data-depth={Math.min(d.depth, 6)}>{d.name}</span></td>
                        <td>{nameOf(d.headId) || <span className="muted">None</span>}</td>
                        <td className="num">{n(d.people)}</td>
                        {q.data.tools.tasks ? <td className="num">{d.tasks ? n(d.tasks.open) : <Hidden />}</td> : null}
                        {q.data.tools.tasks ? <td className="num">{d.tasks ? <span className={d.tasks.overdue ? 'warning-text' : ''}>{n(d.tasks.overdue)}</span> : <Hidden />}</td> : null}
                        {q.data.tools.crm ? <td className="num">{d.crm ? `${n(d.crm.openDeals)} · ${formatMoney(d.crm.openValue, d.crm.currency, { compact: true })}` : <Hidden />}</td> : null}
                        {q.data.tools.finance ? <td className="num">{d.finance ? formatMoney(d.finance.net, d.finance.currency, { compact: true }) : <Hidden />}</td> : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">No departments yet. {admin ? 'Add them under Departments: each one appears in every tool the company runs.' : ''}</p>
            )}
            <p className="muted small">Figures are totals from each tool. A dash means your role does not show them: each tool’s own permissions apply, and a department’s head sees that department’s figures.</p>
          </section>
        </>
      )}
    </div>
  );
}

const Hidden = () => <span className="muted" title="Not shown to your role">—</span>;

function orderDepartments<T extends { id: string; parentId: string | null; name: string }>(list: T[]): (T & { depth: number })[] {
  const ids = new Set(list.map((d) => d.id));
  const out: (T & { depth: number })[] = [];
  const walk = (parent: string | null, depth: number) => {
    for (const d of list.filter((x) => (x.parentId && ids.has(x.parentId) ? x.parentId : null) === parent).sort((a, b) => a.name.localeCompare(b.name))) {
      out.push({ ...d, depth });
      if (depth < 20) walk(d.id, depth + 1);
    }
  };
  walk(null, 0);
  return out;
}

function ToolCard({ app, numbers, linked }: { app: ToolApp; numbers: Numbers[ToolApp]; linked: boolean }) {
  const view = useView();
  const tool = view.tools[app];
  return (
    <section className="card card-pad co-tool-card">
      <div className="row">
        <h2 className="crm-subhead grow">{TOOL_NAMES[app]}</h2>
        {tool?.myRole ? <a className="btn sm" href={toolHref(app, tool.id)}>Open</a> : null}
      </div>
      {!linked || !tool ? (
        <p className="muted">Not part of the company yet.{view.me.role === 'owner' ? ' Add it under Tools.' : ''}</p>
      ) : (
        <>
          <p className="muted small">{tool.name} · Your role: {toolRoleLabel(app, tool.myRole)}</p>
          {!numbers ? (
            <p className="muted small">Its figures are shown to people whose role in {TOOL_NAMES[app]} shows them.</p>
          ) : app === 'tasks' ? (
            <dl className="co-figures">
              <div><dt>Open tasks</dt><dd>{n((numbers as NonNullable<Numbers['tasks']>).open)}</dd></div>
              <div><dt>Overdue</dt><dd className={(numbers as NonNullable<Numbers['tasks']>).overdue ? 'warning-text' : ''}>{n((numbers as NonNullable<Numbers['tasks']>).overdue)}</dd></div>
              <div><dt>Due in 7 days</dt><dd>{n((numbers as NonNullable<Numbers['tasks']>).dueSoon)}</dd></div>
              <div><dt>Done in 30 days</dt><dd>{n((numbers as NonNullable<Numbers['tasks']>).completed30d)}</dd></div>
            </dl>
          ) : app === 'crm' ? (
            <dl className="co-figures">
              <div><dt>Open deals</dt><dd>{n((numbers as NonNullable<Numbers['crm']>).openDeals)}</dd></div>
              <div><dt>Pipeline</dt><dd>{formatMoney((numbers as NonNullable<Numbers['crm']>).openValue, (numbers as NonNullable<Numbers['crm']>).currency, { compact: true })}</dd></div>
              <div><dt>Won in 30 days</dt><dd>{formatMoney((numbers as NonNullable<Numbers['crm']>).wonValue30d, (numbers as NonNullable<Numbers['crm']>).currency, { compact: true })}</dd></div>
              <div><dt>Follow-ups due</dt><dd>{n((numbers as NonNullable<Numbers['crm']>).followUpsDue)}</dd></div>
            </dl>
          ) : (
            <>
              <dl className="co-figures">
                <div><dt>Income</dt><dd>{formatMoney((numbers as NonNullable<Numbers['finance']>).income, (numbers as NonNullable<Numbers['finance']>).currency, { compact: true })}</dd></div>
                <div><dt>Expenses</dt><dd>{formatMoney((numbers as NonNullable<Numbers['finance']>).expenses, (numbers as NonNullable<Numbers['finance']>).currency, { compact: true })}</dd></div>
                <div><dt>Owed to you</dt><dd>{formatMoney((numbers as NonNullable<Numbers['finance']>).receivable ?? 0, (numbers as NonNullable<Numbers['finance']>).currency, { compact: true })}</dd></div>
                <div><dt>You owe</dt><dd>{formatMoney((numbers as NonNullable<Numbers['finance']>).payable ?? 0, (numbers as NonNullable<Numbers['finance']>).currency, { compact: true })}</dd></div>
              </dl>
              <p className="muted small">This financial year so far, from posted entries.</p>
            </>
          )}
        </>
      )}
    </section>
  );
}

// ------------------------------------------------------------------ people

function RoleSelect({ app, value, onChange, disabled, id }: { app: ToolApp; value: string | null; onChange: (v: string | null) => void; disabled?: boolean; id?: string }) {
  return (
    <select id={id} className="select" aria-label={`${TOOL_NAMES[app]} role`} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">No access</option>
      {value === 'owner' ? <option value="owner">Owner</option> : null}
      {TOOL_ROLES[app].map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
    </select>
  );
}

export function People() {
  const view = useView();
  usePageTitle('People');
  const id = view.company.id;
  const q = useMembers(id);
  const depts = useDepartments(id);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const admin = view.me.role !== 'member';
  const owner = view.me.role === 'owner';
  const linked = TOOL_APPS.filter((a) => view.tools[a]);
  const refresh = () => qc.invalidateQueries({ queryKey: ['company', id] });
  const act = async (fn: () => Promise<unknown>, done?: string) => {
    try {
      await fn();
      if (done) toast(done);
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const deptName = (d: string) => depts.data?.find((x) => x.id === d)?.name ?? '';
  if (q.error) return <div className="page"><p className="warning-text">{errorMessage(q.error)}</p></div>;
  if (!q.data) return <Loading />;
  const update = (m: MemberDTO, body: Record<string, unknown>) => act(() => patch(co(id, `/members/${m.userId}`), body), 'Saved. The tools are updated.');
  return (
    <div className="page crm-page">
      <PageHeader title="People" subtitle="Everyone in the company, with their role in each tool. Changing a role here changes it in that tool; No access takes the person out of it." />
      <section className="card crm-table-card">
        <div className="crm-table-scroll">
          <table className="data-table crm-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Company role</th>
                {linked.map((a) => <th key={a}>{TOOL_NAMES[a]}</th>)}
                <th>Departments</th>
                {admin ? <th aria-label="Actions" /> : null}
              </tr>
            </thead>
            <tbody>
              {q.data.members.map((m) => {
                const editable = admin && m.role !== 'owner' && (owner || m.role !== 'admin');
                return (
                  <tr key={m.userId}>
                    <td>
                      <strong>{m.name}</strong>
                      <div className="muted small">{m.email}{m.title ? ` · ${m.title}` : ''}{m.lastActiveAt ? ` · active ${timeAgo(m.lastActiveAt)}` : ''}</div>
                    </td>
                    <td>
                      {owner && m.role !== 'owner' ? (
                        <select className="select" aria-label={`Company role of ${m.name}`} value={m.role} onChange={(e) => update(m, { role: e.target.value })}>
                          <option value="admin">Administrator</option>
                          <option value="member">Member</option>
                        </select>
                      ) : COMPANY_ROLE_LABELS[m.role]}
                    </td>
                    {linked.map((a) => (
                      <td key={a}>
                        {editable ? <RoleSelect app={a} value={m.toolRoles[a]} onChange={(v) => update(m, { [a === 'tasks' ? 'tasksRole' : a === 'crm' ? 'crmRole' : 'finRole']: v })} /> : toolRoleLabel(a, m.toolRoles[a])}
                      </td>
                    ))}
                    <td className="small">{m.departmentIds.map(deptName).filter(Boolean).join(', ') || <span className="muted">None</span>}</td>
                    {admin ? (
                      <td>
                        {editable ? (
                          <button className="btn ghost sm" aria-label={`Remove ${m.name}`} onClick={async () => {
                            if (await confirm({ title: `Remove ${m.name}?`, message: 'They leave the company and every tool it runs. Their records stay.', confirmLabel: 'Remove', danger: true })) await act(() => del(co(id, `/members/${m.userId}`)), 'Removed');
                          }}><Icon name="trash" size={14} /></button>
                        ) : null}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {admin ? <Invite /> : null}
      {admin && q.data.toolOnly.length ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">In a tool, not in the company</h2>
          <p className="muted small">They joined one of the company’s tools directly. Add them to the company to manage their access here; their roles in the tools stay as they are.</p>
          {q.data.toolOnly.map((p) => (
            <div key={p.userId} className="row wrap crm-invite-row">
              <div className="grow">
                <strong>{p.name}</strong> <span className="muted small">{p.email}</span>
                <div className="muted small">{(Object.keys(p.tools) as ToolApp[]).map((a) => `${TOOL_NAMES[a]}: ${toolRoleLabel(a, p.tools[a])}`).join(' · ')}</div>
              </div>
              <button className="btn sm" onClick={() => act(() => post(co(id, '/members'), { userId: p.userId }), `${p.name} is in the company`)}>Add to company</button>
            </div>
          ))}
        </section>
      ) : null}

      <section className="card card-pad stack">
        <h2 className="crm-subhead">Your membership</h2>
        {owner ? (
          <TransferOwnership members={q.data.members} />
        ) : (
          <div>
            <button className="btn danger" onClick={async () => {
              if (await confirm({ title: `Leave ${view.company.name}?`, message: 'You leave the company and every tool it runs.', confirmLabel: 'Leave', danger: true })) {
                await act(() => post(co(id, '/leave')));
                await qc.invalidateQueries({ queryKey: ['company', 'mine'] });
                navigate('/');
              }
            }}>Leave company</button>
          </div>
        )}
      </section>
    </div>
  );
}

function TransferOwnership({ members }: { members: MemberDTO[] }) {
  const view = useView();
  const toast = useToast();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const admins = members.filter((m) => m.role === 'admin');
  const [to, setTo] = useState('');
  if (!admins.length) return <p className="muted small">You own the company and every tool it runs. To hand it over, first make someone an administrator.</p>;
  return (
    <div className="row wrap">
      <label htmlFor="co-transfer">Hand the company and its tools to</label>
      <select id="co-transfer" className="select" value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="">Choose an administrator</option>
        {admins.map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
      </select>
      <button className="btn" disabled={!to} onClick={async () => {
        const who = admins.find((m) => m.userId === to)?.name ?? '';
        if (!(await confirm({ title: `Make ${who} the owner?`, message: 'They become the owner of the company and of every tool it runs. You stay as an administrator.', confirmLabel: 'Transfer ownership', danger: true, typeToConfirm: view.company.name }))) return;
        try {
          await post(co(view.company.id, '/transfer'), { userId: to });
          toast('Ownership transferred');
          await qc.invalidateQueries({ queryKey: ['company'] });
        } catch (e) {
          toast(errorMessage(e), 'error');
        }
      }}>Transfer ownership</button>
    </div>
  );
}

function Invite() {
  const view = useView();
  const id = view.company.id;
  const depts = useDepartments(id);
  const toast = useToast();
  const qc = useQueryClient();
  const invites = useQuery({ queryKey: ['company', id, 'invitations'], queryFn: () => get<{ id: string; email: string; role: string; toolRoles: Record<ToolApp, string | null>; expired: boolean; inviter: string | null; createdAt: number }[]>(co(id, '/invitations')) });
  const blank = { email: '', role: 'member', title: '', tasksRole: view.tools.tasks ? 'member' : null, crmRole: view.tools.crm ? 'member' : null, finRole: null as string | null, departmentIds: [] as string[] };
  const [f, setF] = useState(blank);
  const [link, setLink] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const send = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ url: string; delivery: string }>(co(id, '/invitations'), f);
      // The link is shown to the person who made the invitation either way, as in Project Management.
      setLink(r.url);
      setSent(r.delivery === 'queued');
      toast(r.delivery === 'queued' ? `Invitation sent to ${f.email}` : 'Invitation made. Email is not connected: share the link below.');
      setF(blank);
      await invites.refetch();
      await qc.invalidateQueries({ queryKey: ['company', id] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">Invite someone</h2>
      <form className="stack" onSubmit={send}>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="inv-email">Email</label><input id="inv-email" className="input" type="email" required maxLength={320} value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
          <div className="field"><label htmlFor="inv-title">Job title <span className="muted small">(optional)</span></label><input id="inv-title" className="input" maxLength={100} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div className="field">
            <label htmlFor="inv-role">Company role</label>
            <select id="inv-role" className="select" value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              <option value="member">Member</option>
              {view.me.role === 'owner' ? <option value="admin">Administrator</option> : null}
            </select>
          </div>
          {TOOL_APPS.filter((a) => view.tools[a]).map((a) => (
            <div className="field" key={a}>
              <label htmlFor={`inv-${a}`}>{TOOL_NAMES[a]}</label>
              <RoleSelect id={`inv-${a}`} app={a} value={a === 'tasks' ? f.tasksRole : a === 'crm' ? f.crmRole : f.finRole} onChange={(v) => setF({ ...f, ...(a === 'tasks' ? { tasksRole: v } : a === 'crm' ? { crmRole: v } : { finRole: v }) })} />
            </div>
          ))}
        </div>
        {depts.data?.length ? (
          <fieldset className="crm-fieldset">
            <legend>Departments</legend>
            <div className="row wrap">
              {depts.data.map((d) => (
                <label key={d.id} className="row">
                  <input type="checkbox" checked={f.departmentIds.includes(d.id)} onChange={(e) => setF({ ...f, departmentIds: e.target.checked ? [...f.departmentIds, d.id] : f.departmentIds.filter((x) => x !== d.id) })} /> {d.name}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <div><button className="btn primary" disabled={busy || !f.email.trim()}>{busy ? 'Sending…' : 'Send invitation'}</button></div>
        {link ? (
          <div className="field">
            <label htmlFor="inv-link">{sent ? 'Sent by email. The same link, if you want to share it yourself:' : 'Email is not connected. Share this link with them:'}</label>
            <input id="inv-link" className="input" readOnly value={link} onFocus={(e) => e.target.select()} aria-label="Invitation link" />
            <span className="hint">It works only for the invited email address, for 14 days.</span>
          </div>
        ) : null}
      </form>
      {invites.data?.length ? (
        <div className="stack">
          <h3 className="crm-form-section">Waiting to be accepted</h3>
          {invites.data.map((i) => (
            <div key={i.id} className="row wrap crm-invite-row">
              <div className="grow">
                <strong>{i.email}</strong> as {COMPANY_ROLE_LABELS[i.role as 'admin' | 'member']}
                <div className="muted small">{TOOL_APPS.filter((a) => i.toolRoles[a]).map((a) => `${TOOL_NAMES[a]}: ${toolRoleLabel(a, i.toolRoles[a])}`).join(' · ') || 'No tools yet'}{i.expired ? ' · expired' : ''}</div>
              </div>
              <button className="btn ghost sm" onClick={async () => { await del(co(id, `/invitations/${i.id}`)).catch((e) => toast(errorMessage(e), 'error')); invites.refetch(); }}>Withdraw</button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// ------------------------------------------------------------------ departments

export function Departments() {
  const view = useView();
  usePageTitle('Departments');
  const id = view.company.id;
  const [showArchived, setShowArchived] = useState(false);
  const q = useDepartments(id, showArchived);
  const members = useMembers(id);
  const qc = useQueryClient();
  const toast = useToast();
  const admin = view.me.role !== 'member';
  const [editing, setEditing] = useState<DepartmentDTO | 'new' | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['company', id] });
  const nameOf = (u: string | null) => members.data?.members.find((m) => m.userId === u)?.name ?? '';
  if (q.error) return <div className="page"><p className="warning-text">{errorMessage(q.error)}</p></div>;
  if (!q.data) return <Loading />;
  const tree = departmentTree(q.data);
  const linkedNames = TOOL_APPS.filter((a) => view.tools[a]).map((a) => TOOL_NAMES[a]);
  return (
    <div className="page crm-page">
      <PageHeader
        title="Departments"
        subtitle={`Make a department once: it appears as a team in Project Management and the CRM, and as a department in Finance’s tracking. ${linkedNames.length ? `This company runs ${linkedNames.join(', ')}.` : ''}`}
        actions={admin ? <button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> New department</button> : null}
      />
      {editing ? <DepartmentForm dept={editing === 'new' ? null : editing} all={q.data} onDone={async () => { setEditing(null); await refresh(); }} onCancel={() => setEditing(null)} /> : null}
      {tree.length ? (
        <section className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead><tr><th>Department</th><th>Head</th><th className="num">People</th><th>In the tools</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {tree.map((d) => (
                  <tr key={d.id} className={d.archivedAt ? 'muted' : ''}>
                    <td><span className="co-indent" data-depth={Math.min(d.depth, 6)}><strong>{d.name}</strong></span>{d.description ? <div className="muted small">{d.description}</div> : null}</td>
                    <td>{nameOf(d.headId) || <span className="muted">None</span>}</td>
                    <td className="num">{d.memberIds.length}</td>
                    <td className="small">{TOOL_APPS.filter((a) => d.inTools[a]).map((a) => TOOL_NAMES[a]).join(', ') || <span className="muted">None yet</span>}</td>
                    <td className="row">
                      {d.archivedAt ? (
                        admin ? <button className="btn ghost sm" onClick={async () => { await post(co(id, `/departments/${d.id}/restore`)).catch((e) => toast(errorMessage(e), 'error')); refresh(); }}>Restore</button> : null
                      ) : (
                        <>
                          {d.canChangeMembers || d.canManage ? <button className="btn ghost sm" onClick={() => setEditing(d)}>Edit</button> : null}
                          {d.canManage ? <button className="btn ghost sm" onClick={async () => { try { await post(co(id, `/departments/${d.id}/archive`)); toast('Archived'); } catch (e) { toast(errorMessage(e), 'error'); } refresh(); }}>Archive</button> : null}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState icon="layers" title="No departments yet">{admin ? 'Add your first department: sales, operations, finance, a site or a team.' : 'An administrator adds departments.'}</EmptyState>
      )}
      <label className="row small"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} /> Show archived departments</label>
    </div>
  );
}

function DepartmentForm({ dept, all, onDone, onCancel }: { dept: DepartmentDTO | null; all: DepartmentDTO[]; onDone: () => void; onCancel: () => void }) {
  const view = useView();
  const id = view.company.id;
  const members = useMembers(id);
  const toast = useToast();
  const manage = view.me.role !== 'member';
  const [f, setF] = useState({ name: dept?.name ?? '', description: dept?.description ?? '', parentId: dept?.parentId ?? '', headId: dept?.headId ?? '', memberIds: dept?.memberIds ?? [] });
  const [busy, setBusy] = useState(false);
  const below = new Set<string>();
  if (dept) {
    const walk = (p: string) => all.filter((d) => d.parentId === p).forEach((d) => { below.add(d.id); walk(d.id); });
    below.add(dept.id);
    walk(dept.id);
  }
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (!dept) await post(co(id, '/departments'), { name: f.name, description: f.description, parentId: f.parentId || null, headId: f.headId || null, memberIds: f.memberIds });
      else {
        if (manage) await patch(co(id, `/departments/${dept.id}`), { name: f.name, description: f.description, parentId: f.parentId || null, headId: f.headId || null });
        await put(co(id, `/departments/${dept.id}/members`), { userIds: f.memberIds });
      }
      toast(dept ? 'Department saved. The tools are updated.' : 'Department made in every tool');
      onDone();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card card-pad stack" onSubmit={save}>
      <h2 className="crm-subhead">{dept ? `Edit ${dept.name}` : 'New department'}</h2>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="d-name">Name</label><input id="d-name" className="input" required maxLength={80} value={f.name} disabled={!manage} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field">
          <label htmlFor="d-parent">Part of</label>
          <select id="d-parent" className="select" value={f.parentId} disabled={!manage} onChange={(e) => setF({ ...f, parentId: e.target.value })}>
            <option value="">The company (top level)</option>
            {all.filter((d) => !d.archivedAt && !below.has(d.id)).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="field crm-span"><label htmlFor="d-desc">Description <span className="muted small">(optional)</span></label><input id="d-desc" className="input" maxLength={500} value={f.description} disabled={!manage} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
        <div className="field">
          <label htmlFor="d-head">Head</label>
          <select id="d-head" className="select" value={f.headId} disabled={!manage} onChange={(e) => setF({ ...f, headId: e.target.value, memberIds: e.target.value && !f.memberIds.includes(e.target.value) ? [...f.memberIds, e.target.value] : f.memberIds })}>
            <option value="">No head</option>
            {(members.data?.members ?? []).map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
          </select>
          <span className="hint">The head sees this department’s figures in every tool.</span>
        </div>
      </div>
      <fieldset className="crm-fieldset">
        <legend>People</legend>
        <div className="co-member-checks">
          {(members.data?.members ?? []).map((m) => (
            <label key={m.userId} className="row">
              <input type="checkbox" checked={f.memberIds.includes(m.userId)} disabled={m.userId === f.headId} onChange={(e) => setF({ ...f, memberIds: e.target.checked ? [...f.memberIds, m.userId] : f.memberIds.filter((x) => x !== m.userId) })} />
              {m.name} <span className="muted small">{m.title}</span>
            </label>
          ))}
        </div>
        <span className="hint">In each tool, the team holds the people who have that tool.</span>
      </fieldset>
      <div className="row">
        <button className="btn primary" disabled={busy || !f.name.trim()}>{busy ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ tools

export function Tools() {
  const view = useView();
  usePageTitle('Tools');
  const id = view.company.id;
  const mine = useMine();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const owner = view.me.role === 'owner';
  const [choice, setChoice] = useState<Record<string, string>>({});
  const act = async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await qc.invalidateQueries({ queryKey: ['company'] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader title="Tools" subtitle="The tools this company runs. People sign in once and move between them; their role in each is set under People." />
      <div className="co-tools-grid">
        {TOOL_APPS.map((app) => {
          const t = view.tools[app];
          const owned = mine.data?.ownedTools[app] ?? [];
          return (
            <section key={app} className="card card-pad stack co-tool-card">
              <h2 className="crm-subhead">{TOOL_NAMES[app]}</h2>
              {t ? (
                <>
                  <p>{t.name}</p>
                  <p className="muted small">Your role: {toolRoleLabel(app, t.myRole)}</p>
                  <div className="row">
                    {t.myRole ? <a className="btn sm" href={toolHref(app, t.id)}>Open</a> : null}
                    {owner ? (
                      <button className="btn ghost sm" onClick={async () => {
                        if (await confirm({ title: `Unlink ${TOOL_NAMES[app]}?`, message: `${t.name} keeps its people and records; the company stops managing who is in it.`, confirmLabel: 'Unlink', danger: true })) await act(() => del(co(id, `/tools/${app}`)), 'Unlinked');
                      }}>Unlink</button>
                    ) : null}
                  </div>
                </>
              ) : owner ? (
                <>
                  <p className="muted small">Not part of the company yet.</p>
                  <select className="select" aria-label={`${TOOL_NAMES[app]} for the company`} value={choice[app] ?? 'create'} onChange={(e) => setChoice({ ...choice, [app]: e.target.value })}>
                    <option value="create">Create a new one</option>
                    {owned.map((o) => <option key={o.id} value={o.id}>Use {o.name} (yours already)</option>)}
                  </select>
                  <div><button className="btn primary sm" onClick={() => act(() => post(co(id, '/tools'), { app, ...(choice[app] && choice[app] !== 'create' ? { link: choice[app] } : {}) }), `${TOOL_NAMES[app]} added`)}>Add to the company</button></div>
                </>
              ) : (
                <p className="muted small">Not part of the company yet. The owner can add it.</p>
              )}
            </section>
          );
        })}
        <section className="card card-pad stack co-tool-card">
          <h2 className="crm-subhead">CAD Automation</h2>
          <p className="muted small">Your AI assistant builds and checks SOLIDWORKS models on your own computer. It has its own sign-in for now.</p>
          <div><a className="btn sm" href="/cad/">Open</a></div>
        </section>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ settings

export function Settings() {
  const view = useView();
  usePageTitle('Company settings');
  const admin = view.me.role !== 'member';
  const c = view.company;
  const editor = useDetailsEditor(c);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { session } = useSession();
  const [busy, setBusy] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await patch<{ company: CompanyDTO; emailConfirmation: string | null }>(co(c.id), editor.d);
      await qc.invalidateQueries({ queryKey: ['company'] });
      toast(r.emailConfirmation === 'sent' ? `Saved. Check ${r.company.email} for the confirmation link.` : 'Saved');
    } catch (err) {
      const details = err instanceof ApiError ? (err.details as { problems?: { field: string; message: string }[]; warnings?: string[] } | undefined) : undefined;
      if (details?.problems) editor.setResult({ problems: details.problems, warnings: details.warnings ?? [], abnStatus: 'none', register: null, phone: null });
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader title="Company settings" subtitle="The company’s registered details and how they were checked." />
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Checks</h2>
        <Verification c={c} />
        {c.register ? <p className="muted small">Australian Business Register: {c.register.entityName} · {c.register.entityType}{c.register.gstFrom ? ` · GST from ${c.register.gstFrom}` : ' · not registered for GST'}{c.register.checkedAt ? ` · looked up ${timeAgo(c.register.checkedAt)}` : ''}</p> : null}
        {admin && c.abn ? (
          <div>
            <button className="btn sm" onClick={async () => {
              try {
                await post(co(c.id, '/abn/recheck'));
                await qc.invalidateQueries({ queryKey: ['company', c.id] });
                toast('Looked up on the Australian Business Register');
              } catch (e) {
                toast(errorMessage(e), 'error');
              }
            }}>Look up the ABN again</button>
            {!c.registerLookup ? <span className="muted small"> The register lookup is not set up on this service yet: until it is, only the ABN’s check digits are checked.</span> : null}
          </div>
        ) : null}
      </section>
      {admin ? (
        <form className="card card-pad stack crm-start-form" onSubmit={save} noValidate>
          <h2 className="crm-subhead">Details</h2>
          <DetailsFields d={editor.d} set={editor.set} result={editor.result} kindLocked={view.me.role !== 'owner'} />
          <div className="row">
            <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save details'}</button>
            <button type="button" className="btn ghost" onClick={editor.reset}>Undo changes</button>
          </div>
        </form>
      ) : (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Details</h2>
          <p>{c.legalName || c.name}{c.abn ? ` · ABN ${c.abn}` : ''}{c.acn ? ` · ACN ${c.acn}` : ''}</p>
          <p>{c.address.line1}{c.address.line2 ? `, ${c.address.line2}` : ''}, {c.address.suburb} {c.address.state} {c.address.postcode}</p>
          <p>{c.email} · {c.phone}{c.website ? ` · ${c.website}` : ''}</p>
        </section>
      )}
      {view.me.role === 'owner' ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Close the company account</h2>
          <p className="muted small">The tools stay as they are, with their people and records; only the company account goes.</p>
          <div>
            <button className="btn danger" onClick={async () => {
              if (!(await confirm({ title: `Close ${c.name}?`, message: 'The company account is closed. Its tools keep their people and records.', confirmLabel: 'Close the company account', danger: true, typeToConfirm: c.name }))) return;
              try {
                await del(co(c.id), { confirm: c.name });
                await qc.invalidateQueries({ queryKey: ['company'] });
                toast('Company account closed');
                navigate('/');
              } catch (e) {
                toast(errorMessage(e), 'error');
              }
            }}>Close company account</button>
          </div>
        </section>
      ) : null}
      <p className="muted small">Signed in as {session?.user.email}.</p>
    </div>
  );
}

// ------------------------------------------------------------------ activity

const ACTIONS: Record<string, string> = {
  'company.created': 'registered the company',
  'company.updated': 'changed the company’s details',
  'company.email_confirmed': 'contact email confirmed',
  'company.abn_checked': 'ABN looked up on the register',
  'company.ownership_transferred': 'handed over ownership',
  'company.deleted': 'closed the company account',
  'member.added': 'added someone to the company',
  'member.updated': 'changed someone’s roles',
  'member.removed': 'removed someone',
  'member.left': 'left the company',
  'invitation.created': 'invited someone',
  'invitation.revoked': 'withdrew an invitation',
  'invitation.accepted': 'accepted an invitation',
  'invitation.declined': 'declined an invitation',
  'department.created': 'made a department',
  'department.updated': 'changed a department',
  'department.members_set': 'changed who is in a department',
  'department.archived': 'archived a department',
  'department.restored': 'restored a department',
  'tool.created': 'added a new tool',
  'tool.linked': 'linked a tool',
  'tool.unlinked': 'unlinked a tool',
};

export function Activity() {
  const view = useView();
  usePageTitle('Activity');
  const q = useQuery({ queryKey: ['company', view.company.id, 'activity'], queryFn: () => get<{ id: string; action: string; actor: string | null; at: number }[]>(co(view.company.id, '/activity')) });
  return (
    <div className="page crm-page">
      <PageHeader title="Activity" subtitle="Who changed what in the company account, newest first. Records in the tools have their own history." />
      {q.error ? <p className="warning-text">{errorMessage(q.error)}</p> : !q.data ? <Loading /> : q.data.length ? (
        <section className="card card-pad">
          <ul className="crm-mini-list">
            {q.data.map((r) => (
              <li key={r.id}><strong>{r.actor ?? 'BIZOMAT'}</strong> {ACTIONS[r.action] ?? r.action.replace(/[._]/g, ' ')} <span className="muted small">{timeAgo(r.at)}</span></li>
            ))}
          </ul>
        </section>
      ) : <EmptyState icon="list" title="Nothing yet" />}
    </div>
  );
}

// ------------------------------------------------------------------ projects

interface ProjectRow {
  id: string;
  name: string;
  url: string;
  fromDeal: boolean;
  linked: boolean;
  finance: { currency: string; income: number; costs: number; incomeThisYear: number; costsThisYear: number; budget: number | null; remaining: number | null; overBudget: boolean } | null;
}

/** The company's projects with their income and costs from Finance, against a budget (src/worker/company/links.ts). */
export function Projects() {
  const view = useView();
  usePageTitle('Projects');
  const id = view.company.id;
  const toast = useToast();
  const q = useQuery({ queryKey: ['company', id, 'projects'], queryFn: () => get<ProjectRow[]>(co(id, '/projects')) });
  const [editing, setEditing] = useState<string | null>(null);
  const [budget, setBudget] = useState('');
  const save = async (boardId: string) => {
    const dollars = budget.trim() ? Number(budget.replace(/[,$\s]/g, '')) : null;
    if (dollars !== null && (!Number.isFinite(dollars) || dollars < 0)) {
      toast('Enter the budget as an amount, for example 25000', 'error');
      return;
    }
    try {
      await post(`/company/links/projects/${boardId}/finance`, { budget: dollars === null ? null : Math.round(dollars * 100) });
      toast('Saved. Post income and costs to this project in Finance to see them here.');
      setEditing(null);
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  if (!view.tools.tasks) return <div className="page crm-page"><PageHeader title="Projects" /><EmptyState icon="grid" title="No Project Management yet">The company’s projects show here once it runs Project Management.</EmptyState></div>;
  return (
    <div className="page crm-page">
      <PageHeader title="Projects" subtitle="The company’s shared projects in Project Management. Track a project in Finance to see its income and costs here, against its budget." />
      {q.error ? <p className="warning-text">{errorMessage(q.error)}</p> : !q.data ? <Loading /> : q.data.length ? (
        <section className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table crm-table">
              <thead><tr><th>Project</th><th className="num">Budget</th><th className="num">Costs</th><th className="num">Remaining</th><th className="num">Income</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {q.data.map((p) => (
                  <tr key={p.id}>
                    <td><a href={p.url}><strong>{p.name}</strong></a>{p.fromDeal ? <div className="muted small">Started from a CRM deal</div> : null}</td>
                    <td className="num">{p.finance?.budget != null ? formatMoney(p.finance.budget, p.finance.currency) : <span className="muted">—</span>}</td>
                    <td className="num">{p.finance ? formatMoney(p.finance.costs, p.finance.currency) : <span className="muted">—</span>}</td>
                    <td className="num">{p.finance?.remaining != null ? <span className={p.finance.overBudget ? 'warning-text' : ''}>{formatMoney(p.finance.remaining, p.finance.currency)}</span> : <span className="muted">—</span>}</td>
                    <td className="num">{p.finance ? formatMoney(p.finance.income, p.finance.currency) : <span className="muted">—</span>}</td>
                    <td>
                      {view.tools.finance ? (
                        editing === p.id ? (
                          <span className="row">
                            <input className="input" aria-label={`Budget for ${p.name}`} placeholder="Budget, e.g. 25000" inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)} />
                            <button className="btn primary sm" onClick={() => save(p.id)}>Save</button>
                            <button className="btn ghost sm" onClick={() => setEditing(null)}>Cancel</button>
                          </span>
                        ) : (
                          <button className="btn ghost sm" onClick={() => { setEditing(p.id); setBudget(p.finance?.budget != null ? String(p.finance.budget / 100) : ''); }}>{p.linked ? 'Budget' : 'Track in Finance'}</button>
                        )
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : <EmptyState icon="grid" title="No shared projects yet">Projects made in Project Management, or started from a CRM deal, show here.</EmptyState>}
      <p className="muted small">Figures come from posted entries in Finance tagged with the project. A dash means the project is not tracked in Finance, or your Finance role does not show reports. Tracking a project needs a Finance role that manages accounting.</p>
    </div>
  );
}
