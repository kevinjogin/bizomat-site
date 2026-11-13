// The organisation's people: members and their roles, invitations, teams, ownership and leaving.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { CRM_ROLE_DESCRIPTIONS, CRM_ROLE_LABELS, INVITABLE_ROLES, type CrmRole } from '../../shared/crm/roles';
import type { CrmInvitationDTO, CrmMemberDTO, CrmTeamDTO } from '../../shared/crm/types';
import { PersonChip, UserSelect } from './ui';
import { crm, dateTime, useCurrentOrg, useMembers, useRefreshOrg } from './lib';

export function Team() {
  const org = useCurrentOrg();
  const [tab, setTab] = useState<'members' | 'invitations' | 'teams'>('members');
  usePageTitle('Team');
  return (
    <div className="page crm-page">
      <PageHeader title="Team" icon="users" subtitle={`The people of ${org.name}, their roles and teams.`} />
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'members'} className={`tab${tab === 'members' ? ' active' : ''}`} onClick={() => setTab('members')}>Members</button>
        {org.perms.members.invite ? <button role="tab" aria-selected={tab === 'invitations'} className={`tab${tab === 'invitations' ? ' active' : ''}`} onClick={() => setTab('invitations')}>Invitations</button> : null}
        <button role="tab" aria-selected={tab === 'teams'} className={`tab${tab === 'teams' ? ' active' : ''}`} onClick={() => setTab('teams')}>Teams</button>
      </div>
      <div className="crm-pad-top">
        {tab === 'members' ? <Members /> : null}
        {tab === 'invitations' ? <Invitations /> : null}
        {tab === 'teams' ? <Teams /> : null}
      </div>
    </div>
  );
}

function Members() {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const members = useMembers();
  const [removing, setRemoving] = useState<CrmMemberDTO | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const me = org.role;
  if (!members.data) return <Loading />;
  const setRole = async (m: CrmMemberDTO, role: CrmRole) => {
    try {
      await patch(crm(org.id, `/members/${m.userId}`), { role });
      toast(`${m.name} is now ${CRM_ROLE_LABELS[role]}`);
      await refresh('members');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const canChange = (m: CrmMemberDTO) => org.perms.members.manage && m.role !== 'owner' && !(m.role === 'admin' && me !== 'owner');
  return (
    <div className="stack">
      <div className="card">
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead><tr><th>Person</th><th>Role</th><th>Title</th><th>Joined</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {members.data.map((m) => (
                <tr key={m.userId}>
                  <td><div className="row"><Avatar name={m.name} id={m.userId} url={m.avatarUrl} /><div><div>{m.name}</div><div className="muted small">{m.email}</div></div></div></td>
                  <td>
                    {canChange(m) ? (
                      <select className="select sm" aria-label={`Role of ${m.name}`} value={m.role} onChange={(e) => setRole(m, e.target.value as CrmRole)}>
                        {INVITABLE_ROLES.filter((r) => r !== 'admin' || me === 'owner').map((r) => <option key={r} value={r}>{CRM_ROLE_LABELS[r]}</option>)}
                      </select>
                    ) : (
                      <span title={CRM_ROLE_DESCRIPTIONS[m.role]}>{CRM_ROLE_LABELS[m.role]}</span>
                    )}
                  </td>
                  <td className="small">{m.title}</td>
                  <td className="small">{dateTime(m.joinedAt)}</td>
                  <td>{canChange(m) ? <button className="btn ghost sm" onClick={() => setRemoving(m)}>Remove</button> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Roles</h2>
        <ul className="crm-roles small">
          {(Object.keys(CRM_ROLE_LABELS) as CrmRole[]).map((r) => <li key={r}><strong>{CRM_ROLE_LABELS[r]}</strong>: {CRM_ROLE_DESCRIPTIONS[r]}</li>)}
        </ul>
        <p className="muted small">The owner and administrators can change what each role may do in Settings, Permissions.</p>
      </section>
      <div className="row wrap">
        {me === 'owner' ? <button className="btn" onClick={() => setTransferring(true)}><Icon name="key" /> Transfer ownership</button> : null}
        {me !== 'owner' ? <button className="btn" onClick={() => setLeaving(true)}><Icon name="logout" /> Leave {org.name}</button> : null}
      </div>
      {removing ? (
        <ReassignDialog
          title={`Remove ${removing.name}`}
          intro={`${removing.name} loses access to ${org.name} at once. Their records and open activities can go to someone else.`}
          exclude={removing.userId}
          confirmLabel="Remove"
          onClose={() => setRemoving(null)}
          onConfirm={async (to) => {
            try {
              await del(crm(org.id, `/members/${removing.userId}`), to ? { reassignTo: to } : {});
              toast(`${removing.name} was removed`);
              setRemoving(null);
              await refresh();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          }}
        />
      ) : null}
      {leaving ? (
        <ReassignDialog
          title={`Leave ${org.name}`}
          intro="You lose access to this organisation's CRM. Your records and open activities can go to someone else."
          exclude={org.role === 'owner' ? '' : ''}
          confirmLabel="Leave"
          onClose={() => setLeaving(false)}
          onConfirm={async (to) => {
            try {
              await post(crm(org.id, '/leave'), to ? { reassignTo: to } : {});
              await qc.invalidateQueries({ queryKey: ['crm', 'orgs'] });
              navigate('/');
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          }}
        />
      ) : null}
      {transferring ? <TransferDialog members={members.data} onClose={() => setTransferring(false)} /> : null}
    </div>
  );
}

function ReassignDialog({ title, intro, exclude, confirmLabel, onClose, onConfirm }: { title: string; intro: string; exclude: string; confirmLabel: string; onClose: () => void; onConfirm: (to: string | null) => void }) {
  const [to, setTo] = useState<string | null>(null);
  return (
    <Modal title={title} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn danger" onClick={() => onConfirm(to)}>{confirmLabel}</button></>}>
      <div className="stack">
        <p>{intro}</p>
        <div className="field">
          <label htmlFor="reassign">Hand records and open activities to</label>
          <UserSelect id="reassign" value={to && to !== exclude ? to : null} onChange={setTo} emptyLabel="Nobody (they stay as they are)" />
        </div>
      </div>
    </Modal>
  );
}

function TransferDialog({ members, onClose }: { members: CrmMemberDTO[]; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const [to, setTo] = useState('');
  return (
    <Modal title="Transfer ownership" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn danger" disabled={!to} onClick={async () => { try { await post(crm(org.id, '/transfer'), { userId: to }); toast('Ownership transferred: you are now an administrator'); onClose(); await refresh(); } catch (e) { toast(errorMessage(e), 'error'); } }}>Transfer</button></>}>
      <div className="stack">
        <p>The new owner gets complete control, including deleting the organisation. You become an administrator.</p>
        <select className="select" aria-label="New owner" value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Choose a member</option>
          {members.filter((m) => m.role !== 'owner').map((m) => <option key={m.userId} value={m.userId}>{m.name} ({CRM_ROLE_LABELS[m.role]})</option>)}
        </select>
      </div>
    </Modal>
  );
}

function Invitations() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['crm', org.id, 'invitations'], queryFn: () => get<CrmInvitationDTO[]>(crm(org.id, '/invitations')) });
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CrmRole>('member');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState<{ url: string; delivery: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<CrmInvitationDTO>(crm(org.id, '/invitations'), { email, role, message: message || undefined });
      setLink({ url: r.inviteUrl!, delivery: r.emailDelivery ?? '' });
      setEmail('');
      setMessage('');
      q.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const roles = INVITABLE_ROLES.filter((r) => (r === 'admin' ? org.role === 'owner' || org.role === 'admin' : r === 'manager' ? org.perms.members.manage : true));
  return (
    <div className="stack">
      <form className="card card-pad stack" onSubmit={invite}>
        <h2 className="crm-subhead">Invite someone</h2>
        <p className="muted small">They join with their BIZOMAT account (or create one with this address). The link works for 14 days and only for this address.</p>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="inv-email">Email address</label><input id="inv-email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field"><label htmlFor="inv-role">Role</label><select id="inv-role" className="select" value={role} onChange={(e) => setRole(e.target.value as CrmRole)}>{roles.map((r) => <option key={r} value={r}>{CRM_ROLE_LABELS[r]}</option>)}</select></div>
          <div className="field crm-span"><label htmlFor="inv-msg">Message (optional)</label><input id="inv-msg" className="input" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
        </div>
        <div><button className="btn primary" type="submit" disabled={busy || !email}>{busy ? 'Inviting…' : 'Send invitation'}</button></div>
        {link ? (
          <div className="info-box" role="status">
            {link.delivery === 'queued' ? 'The invitation email is on its way. ' : 'Email is not connected for BIZOMAT, so no email was sent: share this link with them yourself. '}
            <div className="row">
              <input className="input" readOnly value={link.url} aria-label="Invitation link" onFocus={(e) => e.target.select()} />
              <button type="button" className="btn" onClick={() => navigator.clipboard?.writeText(link.url).then(() => toast('Link copied'))}>Copy</button>
            </div>
          </div>
        ) : null}
      </form>
      <div className="card">
        {!q.data ? (
          <Loading />
        ) : !q.data.length ? (
          <EmptyState icon="mail" title="No invitations yet" />
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table">
              <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Sent</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {q.data.map((i) => (
                  <tr key={i.id}>
                    <td>{i.email}</td>
                    <td>{CRM_ROLE_LABELS[i.role]}</td>
                    <td><span className={`badge ${i.status === 'accepted' ? 'success' : i.status === 'pending' ? 'accent' : ''}`}>{i.status[0].toUpperCase() + i.status.slice(1)}</span></td>
                    <td className="small">{timeAgo(i.createdAt)}{i.invitedBy ? ` by ${i.invitedBy}` : ''}</td>
                    <td>
                      {i.status === 'pending' || i.status === 'expired' ? (
                        <div className="row">
                          <button className="btn ghost sm" onClick={async () => { try { const r = await post<{ inviteUrl: string; emailDelivery: string }>(crm(org.id, `/invitations/${i.id}/resend`)); setLink({ url: r.inviteUrl, delivery: r.emailDelivery }); q.refetch(); } catch (e) { toast(errorMessage(e), 'error'); } }}>Send again</button>
                          {i.status === 'pending' ? <button className="btn ghost sm" onClick={async () => { if (await confirm({ title: `Withdraw the invitation for ${i.email}?`, confirmLabel: 'Withdraw', danger: true })) { await del(crm(org.id, `/invitations/${i.id}`)).catch((e) => toast(errorMessage(e), 'error')); q.refetch(); } }}>Withdraw</button> : null}
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

function Teams() {
  const org = useCurrentOrg();
  const toast = useToast();
  const members = useMembers().data ?? [];
  const q = useQuery({ queryKey: ['crm', org.id, 'teams'], queryFn: () => get<CrmTeamDTO[]>(crm(org.id, '/teams')) });
  const [editing, setEditing] = useState<CrmTeamDTO | 'new' | null>(null);
  const can = org.perms.members.teams;
  return (
    <div className="stack">
      {can ? <div><button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" /> New team</button></div> : null}
      {!q.data ? <Loading /> : !q.data.length ? <EmptyState icon="users" title="No teams yet">Teams group people for the dashboard and reports, for example by region or product.</EmptyState> : (
        <div className="grid-cards">
          {q.data.map((t) => (
            <article key={t.id} className="card card-pad stack">
              <div className="row"><strong className="grow">{t.name}</strong>{can ? <button className="btn ghost sm" onClick={() => setEditing(t)}>Edit</button> : null}</div>
              {t.description ? <p className="muted small">{t.description}</p> : null}
              {t.leadId ? <div className="small">Lead: <PersonChip id={t.leadId} small /></div> : null}
              <div className="row wrap">{t.memberIds.map((id) => <PersonChip key={id} id={id} small />)}</div>
            </article>
          ))}
        </div>
      )}
      {editing ? (
        <TeamDialog
          team={editing === 'new' ? null : editing}
          members={members}
          onClose={() => setEditing(null)}
          onSave={async (body) => {
            try {
              if (editing === 'new') await post(crm(org.id, '/teams'), body);
              else await patch(crm(org.id, `/teams/${editing.id}`), body);
              setEditing(null);
              q.refetch();
            } catch (e) {
              toast(errorMessage(e), 'error');
            }
          }}
          onDelete={editing === 'new' ? undefined : async () => { await del(crm(org.id, `/teams/${editing.id}`)).catch((e) => toast(errorMessage(e), 'error')); setEditing(null); q.refetch(); }}
        />
      ) : null}
    </div>
  );
}

function TeamDialog({ team, members, onClose, onSave, onDelete }: { team: CrmTeamDTO | null; members: CrmMemberDTO[]; onClose: () => void; onSave: (b: { name: string; description: string; leadId: string | null; memberIds: string[] }) => void; onDelete?: () => void }) {
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [leadId, setLeadId] = useState<string | null>(team?.leadId ?? null);
  const [ids, setIds] = useState<string[]>(team?.memberIds ?? []);
  return (
    <Modal title={team ? `Edit ${team.name}` : 'New team'} onClose={onClose} footer={<>{onDelete ? <button className="btn danger" onClick={onDelete}>Delete team</button> : null}<span className="grow" /><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!name.trim()} onClick={() => onSave({ name, description, leadId, memberIds: ids })}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="team-name">Name</label><input id="team-name" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label htmlFor="team-desc">Description</label><input id="team-desc" className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="field"><label htmlFor="team-lead">Team lead</label><UserSelect id="team-lead" value={leadId} onChange={setLeadId} emptyLabel="None" /></div>
        <fieldset className="crm-fieldset">
          <legend>Members</legend>
          {members.map((m) => (
            <label key={m.userId} className="checkbox"><input type="checkbox" checked={ids.includes(m.userId)} onChange={(e) => setIds(e.target.checked ? [...ids, m.userId] : ids.filter((x) => x !== m.userId))} /> {m.name}</label>
          ))}
        </fieldset>
      </div>
    </Modal>
  );
}
