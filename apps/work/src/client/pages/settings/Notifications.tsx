import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, put } from '../../lib/api';
import { ErrorBox, Loading, Switch } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { TYPE_META } from '../Inbox';

interface Pref {
  type: string;
  inApp: boolean;
  email: boolean;
}

const DESCRIPTIONS: Record<string, string> = {
  assignment: 'When someone assigns you to an item',
  mention: 'When someone @mentions you in an update or document',
  comment: 'Comments on items you created or are assigned to',
  reply: 'Replies to your updates and comments',
  status_change: 'Status changes on items assigned to you',
  due_soon: 'Items assigned to you that are due today or tomorrow',
  overdue: 'Items assigned to you that are past due',
  automation: 'Messages from automations and automation failures',
  invitation: 'Invitations to other workspaces',
};

export function NotificationSettings() {
  const q = useQuery({ queryKey: ['notification-prefs'], queryFn: () => get<Pref[]>('/me/notification-preferences') });
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (q.data) setPrefs(q.data);
  }, [q.data]);
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  const save = async () => {
    setBusy(true);
    try {
      await put('/me/notification-preferences', prefs);
      toast('Notification preferences saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="card">
      <div className="card-header"><h2 className="grow">Notification preferences</h2><button className="btn primary sm" onClick={save} disabled={busy}>Save</button></div>
      <div className="card-pad">
        <div className="info-box" style={{ marginBottom: 14 }}>
          In-app notifications are delivered to your Inbox and bell. Email delivery requires an email provider (not configured on this deployment), so email toggles are unavailable.
        </div>
        <table className="data-table responsive">
          <thead>
            <tr><th>Notification</th><th style={{ width: 90 }}>In-app</th><th style={{ width: 90 }}>Email</th></tr>
          </thead>
          <tbody>
            {prefs.map((p, i) => (
              <tr key={p.type}>
                <td>
                  <strong>{TYPE_META[p.type]?.label ?? p.type}</strong>
                  <div className="muted small">{DESCRIPTIONS[p.type]}</div>
                </td>
                <td><Switch label={`In-app ${p.type}`} checked={p.inApp} onChange={(v) => setPrefs(prefs.map((x, j) => (j === i ? { ...x, inApp: v } : x)))} /></td>
                <td><Switch label={`Email ${p.type} (not available)`} checked={false} disabled onChange={() => {}} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
