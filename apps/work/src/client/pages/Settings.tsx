import { NavLink, Navigate, useParams } from 'react-router-dom';
import { isAdmin, useWorkspace } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { PageHeader } from '../components/ui/ui';
import { ProfileSettings } from './settings/Profile';
import { NotificationSettings } from './settings/Notifications';
import { SecuritySettings } from './settings/Security';
import { WorkspaceSettings } from './settings/Workspace';
import { MembersSettings } from './settings/Members';
import { TeamsSettings } from './settings/Teams';
import { AdminOverview, AuditLog } from './settings/Admin';
import '../styles/admin.css';

const TABS: { id: string; label: string; icon: string; section: 'Account' | 'Workspace' | 'Administration'; admin?: boolean }[] = [
  { id: 'profile', label: 'Profile', icon: 'user', section: 'Account' },
  { id: 'notifications', label: 'Notifications', icon: 'bell', section: 'Account' },
  { id: 'security', label: 'Security', icon: 'shield', section: 'Account' },
  { id: 'workspace', label: 'Workspace', icon: 'layers', section: 'Workspace' },
  { id: 'members', label: 'Members', icon: 'users', section: 'Workspace' },
  { id: 'teams', label: 'Teams', icon: 'users', section: 'Workspace' },
  { id: 'admin', label: 'Overview & export', icon: 'chart', section: 'Administration', admin: true },
  { id: 'audit', label: 'Audit log', icon: 'history', section: 'Administration', admin: true },
];

export default function Settings() {
  const { tab = 'profile' } = useParams();
  const ws = useWorkspace();
  const admin = isAdmin(ws.role);
  const visible = TABS.filter((t) => !t.admin || admin);
  const current = visible.find((t) => t.id === tab);
  if (!current) return <Navigate to={`/w/${ws.id}/settings/profile`} replace />;
  let sections: string[] = [];
  return (
    <div className="page">
      <PageHeader icon="settings" title="Settings" subtitle={`Your account and the ${ws.name} workspace.`} />
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Settings sections">
          {visible.map((t) => {
            const showSection = !sections.includes(t.section);
            sections = [...sections, t.section];
            return (
              <div key={t.id} style={{ display: 'contents' }}>
                {showSection ? <div className="nav-section desktop-only" style={{ marginTop: sections.length > 1 ? 14 : 0 }}>{t.section}</div> : null}
                <NavLink to={`/w/${ws.id}/settings/${t.id}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} style={{ width: 'auto' }}>
                  <Icon name={t.icon} /> {t.label}
                </NavLink>
              </div>
            );
          })}
        </nav>
        <div className="settings-content">
          {tab === 'profile' ? <ProfileSettings /> : null}
          {tab === 'notifications' ? <NotificationSettings /> : null}
          {tab === 'security' ? <SecuritySettings /> : null}
          {tab === 'workspace' ? <WorkspaceSettings /> : null}
          {tab === 'members' ? <MembersSettings /> : null}
          {tab === 'teams' ? <TeamsSettings /> : null}
          {tab === 'admin' ? <AdminOverview /> : null}
          {tab === 'audit' ? <AuditLog /> : null}
        </div>
      </div>
    </div>
  );
}
