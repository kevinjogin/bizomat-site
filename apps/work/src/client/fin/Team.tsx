// The workspace's people: members and their roles, invitations, ownership and leaving, and what each role may do.
// The server checks every change; these screens only offer what the person may do.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post, put } from '../lib/api';
import { useSession } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import {
  ACTION_LABELS,
  CONFIGURABLE_ROLES,
  FIN_ROLE_DESCRIPTIONS,
  FIN_ROLE_LABELS,
  FIN_ROLES,
  INVITABLE_ROLES,
  MODULE_LABELS,
  isScopedAction,
  type FinModule,
  type FinPerms,
  type FinRole,
  type InvitableRole,
} from '../../shared/fin/roles';
import { dateTime, fin, useCurrentOrg, useMembers, useRefresh, type FinMemberDTO } from './lib';
import { Hint } from './ui';

type Tab = 'members' | 'invitations' | 'permissions';

export function Team() {
  const org = useCurrentOrg();
  const [tab, setTab] = useState<Tab>('members');
  const tabs: { key: Tab; label: string; show: boolean }[] = [
    { key: 'members', label: 'Members', show: true },
    { key: 'invitations', label: 'Invitations', show: org.perms.members.invite },
    { key: 'permissions', label: 'Roles and permissions', show: true },
  ];
  return (
    <div className="page crm-page">
      <PageHeader title="Team" icon="users" subtitle={`The people of ${org.name}, their roles and what each role may do.`} />
      {org.kind === 'personal' ? (
        <Hint>This personal workspace is private: only you see it. If you invite someone, they see what their role allows, and you can remove them at any time.</Hint>
      ) : org.kind === 'household' ? (
        <Hint>Everyone you invite to a household workspace sees its accounts, budgets and reports. They change only their own records unless their role allows more.</Hint>
      ) : null}
      <div className="tabs" role="tablist">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button key={t.key} role="tab" aria-selected={tab === t.key} className={`tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
      </div>
      <div className="crm-pad-top">
        {tab === 'members' ? <Members /> : null}
        {tab === 'invitations' && org.perms.members.invite ? <Invitations /> : null}
        {tab === 'permissions' ? <Permissions /> : null}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ members

function Members() {
  const org = useCurrentOrg();
  const { session } = useSession();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const members = useMembers();
  const [transferring, setTransferring] = useState(false);
  const me = org.role;
  const myId = session?.user.id;
  if (members.error) return <ErrorBox error={members.error} retry={() => members.refetch()} />;
  if (!members.data) return <Loading />;
  const canChange = (m: FinMemberDTO) => org.perms.members.manage && m.userId !== myId && m.role !== 'owner' && !(m.role === 'admin' && me !== 'owner');
  const setRole = async (m: FinMemberDTO, role: InvitableRole) => {
    try {
      await patch(fin(org.id, `/members/${m.userId}`), { role });
      toast(`${m.name} is now ${FIN_ROLE_LABELS[role]}`);
      await refresh('members');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const remove = async (m: FinMemberDTO) => {
    if (!(await confirm({ title: `Remove ${m.name}?`, message: `${m.name} loses access to ${org.name} at once. The records they created stay in the books.`, confirmLabel: 'Remove', danger: true }))) return;
    try {
      await del(fin(org.id, `/members/${m.userId}`));
      toast(`${m.name} was removed`);
      await refresh('members');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const leave = async () => {
    if (!(await confirm({ title: `Leave ${org.name}?`, message: 'You lose access to this workspace at once. Someone who manages its members can invite you again.', confirmLabel: 'Leave', danger: true }))) return;
    try {
      await post(fin(org.id, '/leave'), {});
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
      navigate('/');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const roleChoices = INVITABLE_ROLES.filter((r) => r !== 'admin' || me === 'owner');
  return (
    <div className="stack">
      <div className="card">
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Role</th>
                <th>Title</th>
                <th>Joined</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {members.data.map((m) => (
                <tr key={m.userId}>
                  <td>
                    <div className="row">
                      <Avatar name={m.name} id={m.userId} url={m.avatarUrl} />
                      <div>
                        <div>
                          {m.name} {m.userId === myId ? <span className="muted small">(you)</span> : null}
                        </div>
                        <div className="muted small">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {canChange(m) ? (
                      <select className="select sm" aria-label={`Role of ${m.name}`} value={m.role} onChange={(e) => setRole(m, e.target.value as InvitableRole)}>
                        {roleChoices.map((r) => (
                          <option key={r} value={r}>{FIN_ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    ) : (
                      <span title={FIN_ROLE_DESCRIPTIONS[m.role]}>{FIN_ROLE_LABELS[m.role]}</span>
                    )}
                  </td>
                  <td>
                    <TitleCell member={m} editable={m.userId === myId || org.perms.members.manage} />
                  </td>
                  <td className="small">{dateTime(m.joinedAt)}</td>
                  <td>{canChange(m) ? <button className="btn ghost sm" onClick={() => remove(m)}>Remove</button> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Roles</h2>
        <ul className="crm-roles small">
          {FIN_ROLES.map((r) => (
            <li key={r}>
              <strong>{FIN_ROLE_LABELS[r]}</strong>: {FIN_ROLE_DESCRIPTIONS[r]}
            </li>
          ))}
        </ul>
        <p className="muted small">Owners and administrators always have every permission. The other roles can be changed in Roles and permissions.</p>
      </section>
      <div className="row wrap">
        {me === 'owner' && members.data.length > 1 ? (
          <button className="btn" onClick={() => setTransferring(true)}>
            <Icon name="key" /> Transfer ownership
          </button>
        ) : null}
        {me !== 'owner' ? (
          <button className="btn" onClick={leave}>
            <Icon name="logout" /> Leave {org.name}
          </button>
        ) : null}
      </div>
      {transferring ? <TransferDialog members={members.data} onClose={() => setTransferring(false)} /> : null}
    </div>
  );
}

/** A member's title (for example "Bookkeeper"), saved when the field loses focus. */
function TitleCell({ member, editable }: { member: FinMemberDTO; editable: boolean }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const [value, setValue] = useState(member.title);
  useEffect(() => setValue(member.title), [member.title]);
  if (!editable) return <span className="small">{member.title}</span>;
  return (
    <input
      className="input sm"
      aria-label={`Title of ${member.name}`}
      maxLength={80}
      placeholder="Title"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={async () => {
        if (value.trim() === member.title) return;
        try {
          await patch(fin(org.id, `/members/${member.userId}`), { title: value.trim() });
          await refresh('members');
        } catch (e) {
          toast(errorMessage(e), 'error');
          setValue(member.title);
        }
      }}
    />
  );
}

function TransferDialog({ members, onClose }: { members: FinMemberDTO[]; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefresh();
  const qc = useQueryClient();
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const transfer = async () => {
    setBusy(true);
    try {
      await post(fin(org.id, '/transfer'), { userId: to });
      toast('Ownership transferred: you are now an administrator');
      onClose();
      await refresh();
      await qc.invalidateQueries({ queryKey: ['fin', 'orgs'] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      title="Transfer ownership"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn danger" disabled={!to || busy} onClick={transfer}>Transfer</button>
        </>
      }
    >
      <div className="stack">
        <p>The new owner gets complete control, including deleting the workspace. You become an administrator.</p>
        <select className="select" aria-label="New owner" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Choose a member</option>
          {members
            .filter((m) => m.role !== 'owner')
            .map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name} ({FIN_ROLE_LABELS[m.role]})
              </option>
            ))}
        </select>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ invitations

interface InvitationDTO {
  id: string;
  email: string;
  role: FinRole;
  status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
  invitedBy: string | null;
  createdAt: number;
  expiresAt: number;
  message: string;
}

const STATUS_LABELS: Record<InvitationDTO['status'], string> = { pending: 'Pending', accepted: 'Accepted', declined: 'Declined', revoked: 'Withdrawn', expired: 'Expired' };

function Invitations() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['fin', org.id, 'invitations'], queryFn: () => get<InvitationDTO[]>(fin(org.id, '/invitations')) });
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InvitableRole>('contributor');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState<{ url: string; delivery: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const roles = INVITABLE_ROLES.filter((r) => r !== 'admin' || org.role === 'owner' || org.role === 'admin');
  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ inviteUrl: string; emailDelivery: string }>(fin(org.id, '/invitations'), { email: email.trim(), role, message: message.trim() || undefined });
      setLink({ url: r.inviteUrl, delivery: r.emailDelivery });
      setEmail('');
      setMessage('');
      q.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const resend = async (i: InvitationDTO) => {
    try {
      const r = await post<{ inviteUrl: string; emailDelivery: string }>(fin(org.id, `/invitations/${i.id}/resend`), {});
      setLink({ url: r.inviteUrl, delivery: r.emailDelivery });
      toast(r.emailDelivery === 'queued' ? `Sent again to ${i.email}` : 'A new link is ready to share');
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const withdraw = async (i: InvitationDTO) => {
    if (!(await confirm({ title: `Withdraw the invitation for ${i.email}?`, message: 'The link stops working at once.', confirmLabel: 'Withdraw', danger: true }))) return;
    try {
      await del(fin(org.id, `/invitations/${i.id}`));
      q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <form className="card card-pad stack" onSubmit={invite}>
        <h2 className="crm-subhead">Invite someone</h2>
        <p className="muted small">They join with their BIZOMAT account, or create one with this address. The link works for 14 days, once, and only for this address.</p>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="inv-email">Email address</label>
            <input id="inv-email" className="input" type="email" required maxLength={320} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="inv-role">Role</label>
            <select id="inv-role" className="select" value={role} onChange={(e) => setRole(e.target.value as InvitableRole)}>
              {roles.map((r) => (
                <option key={r} value={r}>{FIN_ROLE_LABELS[r]}</option>
              ))}
            </select>
            <span className="hint">{FIN_ROLE_DESCRIPTIONS[role]}</span>
          </div>
          <div className="field crm-span">
            <label htmlFor="inv-msg">Message (optional)</label>
            <input id="inv-msg" className="input" maxLength={600} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <div>
          <button className="btn primary" type="submit" disabled={busy || !email.trim()}>{busy ? 'Inviting…' : 'Send invitation'}</button>
        </div>
        {link ? (
          <div className="info-box stack" role="status">
            <span>
              {link.delivery === 'queued'
                ? 'The invitation email is on its way. You can also share this link with them yourself.'
                : org.emailConnected
                  ? 'The email could not be queued, so share this link with them yourself.'
                  : 'Email is not connected for BIZOMAT, so no email was sent: share this link with them yourself.'}
            </span>
            <div className="row">
              <input className="input" readOnly value={link.url} aria-label="Invitation link" onFocus={(e) => e.target.select()} />
              <button type="button" className="btn" onClick={() => navigator.clipboard?.writeText(link.url).then(() => toast('Link copied'), () => toast('Select the link and copy it', 'error'))}>Copy</button>
            </div>
          </div>
        ) : null}
      </form>
      <div className="card">
        {q.error ? (
          <ErrorBox error={q.error} retry={() => q.refetch()} />
        ) : !q.data ? (
          <Loading />
        ) : !q.data.length ? (
          <EmptyState icon="mail" title="No invitations yet" />
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Sent</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {q.data.map((i) => (
                  <tr key={i.id}>
                    <td>{i.email}</td>
                    <td>{FIN_ROLE_LABELS[i.role]}</td>
                    <td>
                      <span className={`badge${i.status === 'accepted' ? ' success' : i.status === 'pending' ? ' accent' : ''}`}>{STATUS_LABELS[i.status]}</span>
                    </td>
                    <td className="small">
                      {timeAgo(i.createdAt)}
                      {i.invitedBy ? ` by ${i.invitedBy}` : ''}
                    </td>
                    <td>
                      {i.status === 'pending' || i.status === 'expired' ? (
                        <div className="row">
                          <button className="btn ghost sm" onClick={() => resend(i)}>Send again</button>
                          {i.status === 'pending' ? <button className="btn ghost sm" onClick={() => withdraw(i)}>Withdraw</button> : null}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ roles and permissions

interface PermissionsDTO {
  roles: Record<string, FinPerms>;
  defaults: Record<string, FinPerms>;
  modules: { module: FinModule; actions: string[] }[];
}

type ConfigurableRole = (typeof CONFIGURABLE_ROLES)[number];
type PermValue = boolean | 'all' | 'own' | 'none';
type Draft = Record<string, Record<string, PermValue>>;

const SCOPE_LABELS = { all: 'All', own: 'Own', none: 'None' } as const;
const BUSINESS_MODULES: FinModule[] = ['sales', 'purchases', 'contacts'];

function Permissions() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['fin', org.id, 'permissions'], queryFn: () => get<PermissionsDTO>(fin(org.id, '/permissions')) });
  const [role, setRole] = useState<ConfigurableRole>('contributor');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const canEdit = org.role === 'owner' || org.role === 'admin';
  const current = q.data?.roles[role];
  useEffect(() => {
    setDraft(current ? (JSON.parse(JSON.stringify(current)) as Draft) : null);
  }, [current, role]);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data || !draft || !current) return <Loading />;
  const defaults = q.data.defaults[role] as unknown as Draft;
  const modules = q.data.modules.filter((m) => org.kind === 'business' || !BUSINESS_MODULES.includes(m.module));
  const allActions = [...new Set(modules.flatMap((m) => m.actions))];
  const dirty = JSON.stringify(draft) !== JSON.stringify(current);
  const set = (module: string, action: string, value: PermValue) => setDraft({ ...draft, [module]: { ...draft[module], [action]: value } });
  const save = async () => {
    setBusy(true);
    try {
      const body: Draft = {};
      for (const m of modules) body[m.module] = draft[m.module];
      await put(fin(org.id, `/permissions/${role}`), body);
      toast(`${FIN_ROLE_LABELS[role]} permissions saved`);
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    if (!(await confirm({ title: `Restore the default permissions of ${FIN_ROLE_LABELS[role]}?`, confirmLabel: 'Restore', danger: true }))) return;
    try {
      await put(fin(org.id, `/permissions/${role}`), {});
      toast('Back to the defaults');
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <div className="row wrap">
        <label className="row">
          Role
          <select className="select" value={role} onChange={(e) => setRole(e.target.value as ConfigurableRole)}>
            {CONFIGURABLE_ROLES.map((r) => (
              <option key={r} value={r}>{FIN_ROLE_LABELS[r]}</option>
            ))}
          </select>
        </label>
        <span className="muted small grow">{FIN_ROLE_DESCRIPTIONS[role]}</span>
        {canEdit ? (
          <>
            <button className="btn sm" onClick={restore}>Restore the defaults</button>
            <button className="btn sm primary" disabled={!dirty || busy} onClick={save}>{busy ? 'Saving…' : 'Save'}</button>
          </>
        ) : null}
      </div>
      <p className="muted small">
        Owners and administrators always have every permission. For transactions, invoices, bills, contacts and documents, "Own" means the records the person created (or claimed, for expense claims). Editing and deleting never reach beyond what the role can see. The server enforces every setting.
        {canEdit ? '' : ' Only the owner and administrators can change them.'}
      </p>
      <div className="crm-table-scroll">
        <table className="data-table fin-perm-table">
          <thead>
            <tr>
              <th>Area</th>
              {allActions.map((a) => (
                <th key={a}>{ACTION_LABELS[a] ?? a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map(({ module, actions }) => (
              <tr key={module}>
                <th scope="row">{MODULE_LABELS[module]}</th>
                {allActions.map((action) => {
                  if (!actions.includes(action)) return <td key={action} aria-hidden />;
                  const v = draft[module]?.[action];
                  const d = defaults[module]?.[action];
                  const changed = v !== d;
                  const label = `${MODULE_LABELS[module]}: ${ACTION_LABELS[action] ?? action}`;
                  const title = `Default: ${typeof d === 'boolean' ? (d ? 'on' : 'off') : SCOPE_LABELS[d as keyof typeof SCOPE_LABELS]}`;
                  return (
                    <td key={action} title={title}>
                      {isScopedAction(action, module) ? (
                        <select className="select sm" aria-label={label} disabled={!canEdit} value={String(v)} onChange={(e) => set(module, action, e.target.value as PermValue)}>
                          {(Object.keys(SCOPE_LABELS) as (keyof typeof SCOPE_LABELS)[]).map((s) => (
                            <option key={s} value={s}>{SCOPE_LABELS[s]}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="checkbox" aria-label={label} disabled={!canEdit} checked={!!v} onChange={(e) => set(module, action, e.target.checked)} />
                      )}
                      {changed ? <span className="muted small"> changed</span> : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">A setting that differs from the role's default is marked "changed"; hover over it to see the default.</p>
    </section>
  );
}
