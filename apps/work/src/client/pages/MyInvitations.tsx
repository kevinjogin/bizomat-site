// Pending invitations addressed to my email. Accepting needs the link from the invitation email (or the one the inviter
// shared): knowing that an address was invited is not enough to join an organisation.
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ROLE_LABELS } from '../../shared/permissions';
import type { WorkspaceRole } from '../../shared/types';
import { get } from '../lib/api';
import { timeAgo } from '../lib/format';
import { useSession } from '../lib/session';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';

export default function MyInvitations() {
  const { session } = useSession();
  const q = useQuery({ queryKey: ['my-invitations'], queryFn: () => get<{ id: string; role: string; expires_at: number; created_at: number; workspace_name: string; inviter: string }[]>('/me/invitations') });
  const home = session?.workspaces[0] ? `/w/${session.workspaces[0].id}/home` : '/welcome';
  return (
    <div className="page">
      <PageHeader icon="users" title="Invitations" subtitle={`Invitations sent to ${session?.user.email ?? 'you'}`} actions={<Link className="btn" to={home}>Back</Link>} />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : !q.data?.length ? (
        <EmptyState icon="check" title="No pending invitations" />
      ) : (
        <div className="card">
          <div className="list">
            {q.data.map((i) => (
              <div key={i.id} className="list-row">
                <span className="grow">
                  <strong>{i.workspace_name}</strong> <span className="badge">{ROLE_LABELS[i.role as WorkspaceRole] ?? i.role}</span>
                  <div className="muted small">From {i.inviter}, {timeAgo(i.created_at)}; expires {new Date(i.expires_at).toLocaleDateString()}</div>
                </span>
              </div>
            ))}
          </div>
          <div className="card-pad muted small">To accept, open the link in the invitation email (or the link the person who invited you shared). It works once, for this email address only.</div>
        </div>
      )}
    </div>
  );
}
