import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, post } from '../lib/api';
import { isAdmin, useSession } from '../lib/session';
import { Icon, ProductLockup } from '../components/ui/Icon';
import { usePageTitle } from '../lib/hooks';
import { EmptyState, Field, PageHeader } from '../components/ui/ui';
import { useConfirm, useToast } from '../components/ui/overlays';
import { CreateWorkspaceDialog } from '../components/layout/CreateDialogs';
import { WorkspaceIdentityDialog } from '../components/workspace/WorkspaceIdentity';
import type { WorkspaceDTO } from '../../shared/types';
import '../styles/admin.css';
import { appUrl } from '../lib/base';

function WorkspaceRow({ w, current, onLeave, onRename }: { w: WorkspaceDTO; current: boolean; onLeave?: (w: WorkspaceDTO) => void; onRename?: (w: WorkspaceDTO) => void }) {
  return (
    <div className="card ws-card">
      <div className="ws-swatch" style={{ background: w.color }}>
        {w.logoUrl ? <img src={w.logoUrl} alt="" /> : w.name[0]?.toUpperCase()}
      </div>
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="row">
          <strong className="ellipsis">{w.name}</strong>
          {current ? <span className="badge accent">Current</span> : null}
        </div>
        <div className="muted small ellipsis">{w.description || 'No description'} · {w.role}</div>
      </div>
      {onRename && isAdmin(w.role) ? (
        <button className="btn ghost icon sm" aria-label={`Rename or change the colour of ${w.name}`} title="Rename or change colour" onClick={() => onRename(w)}>
          <Icon name="edit" size={14} />
        </button>
      ) : null}
      <Link className="btn sm" to={`/w/${w.id}/home`}>Open</Link>
      {onLeave ? (
        <button className="btn ghost icon sm" aria-label={`Leave ${w.name}`} title="Leave workspace" onClick={() => onLeave(w)}>
          <Icon name="logout" size={14} />
        </button>
      ) : null}
    </div>
  );
}

function InlineCreate() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { refresh } = useSession();
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const ws = await post<WorkspaceDTO>('/workspaces', { name: name.trim() });
      await refresh();
      navigate(`/w/${ws.id}/home`, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="card card-pad">
      <h2 style={{ marginBottom: 10 }}>Create a workspace</h2>
      <Field label="Workspace name" htmlFor="new-ws">
        <input id="new-ws" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="e.g. Acme Operations" />
      </Field>
      {error ? <div className="error-box" style={{ marginBottom: 10 }}>{error}</div> : null}
      <button className="btn primary" disabled={busy || !name.trim()}>{busy ? 'Creating…' : 'Create workspace'}</button>
    </form>
  );
}

export default function Workspaces({ standalone }: { standalone?: boolean }) {
  const { session, refresh } = useSession();
  const { wsId } = useParams();
  const [creating, setCreating] = useState(false);
  const [renaming, setRenaming] = useState<WorkspaceDTO | null>(null);
  const confirm = useConfirm();
  const toast = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const workspaces = session?.workspaces ?? [];
  usePageTitle(standalone ? 'Welcome' : null);

  const leave = async (w: WorkspaceDTO) => {
    const ok = await confirm({ title: `Leave ${w.name}?`, message: 'You will lose access to its boards and documents until someone invites you again.', danger: true, confirmLabel: 'Leave' });
    if (!ok || !session) return;
    try {
      await del(`/workspaces/${w.id}/members/${session.user.id}`);
      await refresh();
      qc.removeQueries({ queryKey: ['boards', w.id] });
      toast(`You left ${w.name}`);
      if (w.id === wsId) navigate('/', { replace: true });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  if (standalone) {
    return (
      <div className="auth-wrap">
        <div style={{ width: '100%', maxWidth: 520 }} className="col">
          <div className="auth-brand" style={{ marginBottom: 8 }}>
            <ProductLockup height={20} />
          </div>
          <h1>Welcome{session ? `, ${session.user.name.split(' ')[0]}` : ''}</h1>
          <p className="muted">
            {workspaces.length ? 'Choose a workspace or create a new one.' : "You're not a member of any workspace yet. Create one, or ask a colleague to invite you."}
          </p>
          {workspaces.map((w) => <WorkspaceRow key={w.id} w={w} current={false} />)}
          <InlineCreate />
          <button
            className="btn ghost"
            onClick={async () => {
              await post('/auth/logout').catch(() => {});
              qc.clear();
              window.location.href = appUrl('/login');
            }}
          >
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        icon="layers"
        title="Workspaces"
        subtitle="Each workspace keeps its members, boards and data completely separate."
        actions={<button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New workspace</button>}
      />
      {workspaces.length === 0 ? <EmptyState icon="layers" title="No workspaces" /> : null}
      <div className="col" style={{ gap: 10 }}>
        {workspaces.map((w) => <WorkspaceRow key={w.id} w={w} current={w.id === wsId} onLeave={leave} onRename={setRenaming} />)}
      </div>
      {creating ? <CreateWorkspaceDialog onClose={() => setCreating(false)} /> : null}
      {renaming ? <WorkspaceIdentityDialog workspace={renaming} onClose={() => setRenaming(null)} /> : null}
    </div>
  );
}
