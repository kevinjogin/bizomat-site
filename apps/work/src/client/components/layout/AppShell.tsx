import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get, patch, post, errorMessage } from '../../lib/api';
import { canEdit, useSession, useWorkspace } from '../../lib/session';
import { applyTheme, storedTheme, useShortcut, useDebounced, type ThemePref } from '../../lib/hooks';
import { timeAgo } from '../../lib/format';
import { BrandMark, Icon, ProductLockup } from '../ui/Icon';
import { Avatar, Spinner } from '../ui/ui';
import { Dropdown, MenuItem, MenuSep, Modal, Popover, useToast } from '../ui/overlays';
import { CreateBoardDialog, CreateDashboardDialog, CreateWorkspaceDialog, useBoards, useCreateDocument } from './CreateDialogs';
import type { BoardDTO, NotificationDTO } from '../../../shared/types';
import { FolderIcon, buildTree, useFolders } from '../folders/Folders';
import { PlatformFooter } from './PlatformLinks';
import { BRAND, PLATFORM_URLS, platformLinkProps } from '../../lib/brand';

const NAV: { to: string; label: string; icon: string; key?: string }[] = [
  { to: 'home', label: 'Home', icon: 'home', key: 'g h' },
  { to: 'my-work', label: 'My Work', icon: 'checkSquare', key: 'g m' },
  { to: 'my-day', label: 'My Day', icon: 'sun', key: 'g d' },
  { to: 'inbox', label: 'Inbox', icon: 'inbox', key: 'g i' },
  { to: 'notifications', label: 'Notifications', icon: 'bell', key: 'g n' },
  { to: 'workspaces', label: 'Workspaces', icon: 'layers' },
  { to: 'boards', label: 'Boards', icon: 'grid', key: 'g b' },
  { to: 'favourites', label: 'Favourites', icon: 'star' },
  { to: 'recent', label: 'Recent', icon: 'clock' },
  { to: 'dashboards', label: 'Dashboards', icon: 'chart' },
  { to: 'docs', label: 'Documents', icon: 'doc' },
  { to: 'goals', label: 'Goals', icon: 'target' },
  { to: 'templates', label: 'Templates', icon: 'template' },
  { to: 'automations', label: 'Automations', icon: 'bolt' },
  { to: 'integrations', label: 'Integrations', icon: 'plug' },
  { to: 'settings/profile', label: 'Settings', icon: 'settings', key: 'g s' },
];

export function useNotificationsSummary(wsId: string) {
  return useQuery({
    queryKey: ['notifications', wsId, 'summary'],
    queryFn: () => get<{ notifications: NotificationDTO[]; unreadCount: number }>(`/notifications?workspaceId=${wsId}`),
    refetchInterval: 30_000,
  });
}

export function AppShell({ children }: { children: ReactNode }) {
  const ws = useWorkspace();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [create, setCreate] = useState<null | 'board' | 'dashboard' | 'workspace'>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const base = `/w/${ws.id}`;

  useEffect(() => setNavOpen(false), [location.pathname]);
  useShortcut('mod+k', () => setSearchOpen(true));
  useShortcut('/', () => setSearchOpen(true));
  useShortcut('?', () => setHelpOpen(true));
  for (const n of NAV) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useShortcut(n.key ?? `__none_${n.to}`, () => navigate(`${base}/${n.to}`), !!n.key);
  }

  return (
    <div className={`shell${navOpen ? ' nav-open' : ''}`}>
      <header className="topbar">
        <button className="btn ghost icon mobile-only" aria-label="Toggle navigation" onClick={() => setNavOpen((o) => !o)}>
          <Icon name="menu" />
        </button>
        <Link to={`${base}/home`} className="brand" aria-label={`${BRAND.full} home`}>
          <span className="mobile-only"><BrandMark size={28} /></span>
          <span className="desktop-only"><ProductLockup height={15} /></span>
        </Link>
        <WorkspaceSwitcher onCreate={() => setCreate('workspace')} />
        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search (Ctrl+K)">
          <Icon name="search" /> <span className="label">Search everything</span> <kbd>Ctrl K</kbd>
        </button>
        <div className="spacer" />
        <CreateMenu onCreate={setCreate} />
        <NotificationsBell />
        <button className="btn ghost icon desktop-only" aria-label="Help and keyboard shortcuts" onClick={() => setHelpOpen(true)}>
          <Icon name="help" />
        </button>
        <ThemeMenu />
        <ProfileMenu />
      </header>
      <Sidebar onNewBoard={() => setCreate('board')} />
      <main className="main" id="main">
        {children}
      </main>
      {searchOpen ? <SearchPalette onClose={() => setSearchOpen(false)} /> : null}
      {helpOpen ? <HelpDialog onClose={() => setHelpOpen(false)} /> : null}
      {create === 'board' ? <CreateBoardDialog wsId={ws.id} onClose={() => setCreate(null)} /> : null}
      {create === 'dashboard' ? <CreateDashboardDialog wsId={ws.id} onClose={() => setCreate(null)} /> : null}
      {create === 'workspace' ? <CreateWorkspaceDialog onClose={() => setCreate(null)} /> : null}
    </div>
  );
}

function Sidebar({ onNewBoard }: { onNewBoard: () => void }) {
  const ws = useWorkspace();
  const base = `/w/${ws.id}`;
  const boards = useBoards(ws.id);
  const notif = useNotificationsSummary(ws.id);
  const favs = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<any[]>(`/workspaces/${ws.id}/favourites`) });
  return (
    <nav className="sidebar" aria-label="Main navigation">
      {NAV.map((n) => (
        <NavLink key={n.to} to={`${base}/${n.to}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Icon name={n.icon} /> {n.label}
          {n.to === 'notifications' && (notif.data?.unreadCount ?? 0) > 0 ? <span className="count">{notif.data!.unreadCount > 99 ? '99+' : notif.data!.unreadCount}</span> : null}
        </NavLink>
      ))}
      {(favs.data ?? []).length ? (
        <>
          <div className="nav-section">Favourites</div>
          {favs.data!.slice(0, 8).map((f) => (
            <NavLink key={`${f.type}:${f.id}`} to={entityPath(base, f)} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Icon name={f.type === 'board' ? 'grid' : f.type === 'dashboard' ? 'chart' : f.type === 'document' ? 'doc' : f.type === 'goal' ? 'target' : 'checkSquare'} />
              <span className="ellipsis">{f.name}</span>
            </NavLink>
          ))}
        </>
      ) : null}
      <div className="nav-section">
        <span className="grow">Boards</span>
        {canEdit(ws.role) ? (
          <button className="btn ghost icon sm" aria-label="New board" onClick={onNewBoard}>
            <Icon name="plus" size={14} />
          </button>
        ) : null}
      </div>
      {boards.isLoading ? <div className="nav-item"><Spinner /></div> : null}
      <SidebarBoards wsId={ws.id} base={base} boards={boards.data ?? []} />
      {boards.data && boards.data.length === 0 ? <div className="muted small" style={{ padding: '4px 10px' }}>No boards yet.</div> : null}
      <PlatformFooter />
    </nav>
  );
}

function SidebarBoards({ wsId, base, boards }: { wsId: string; base: string; boards: BoardDTO[] }) {
  const folders = useFolders(wsId, 'boards');
  const [closed, setClosed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('workos:sidebar-closed-folders') ?? '[]'));
    } catch {
      return new Set();
    }
  });
  const toggle = (id: string) => {
    const n = new Set(closed);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    setClosed(n);
    try {
      localStorage.setItem('workos:sidebar-closed-folders', JSON.stringify(Array.from(n)));
    } catch {
      /* storage unavailable */
    }
  };
  const ids = new Set((folders.data ?? []).map((f) => f.id));
  const boardLink = (b: BoardDTO, depth: number) => (
    <NavLink key={b.id} to={`${base}/boards/${b.id}`} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} style={{ paddingLeft: 10 + depth * 14 }}>
      <Icon name={b.visibility === 'private' ? 'lock' : b.kind === 'personal' ? 'user' : 'grid'} />
      <span className="ellipsis">{b.name}</span>
    </NavLink>
  );
  const renderFolder = (n: ReturnType<typeof buildTree>[number]): ReactNode => {
    const inside = boards.filter((b) => b.folderId === n.folder.id);
    const open = !closed.has(n.folder.id);
    return (
      <div key={n.folder.id}>
        <button className="nav-item" style={{ paddingLeft: 10 + n.depth * 14 }} aria-expanded={open} onClick={() => toggle(n.folder.id)}>
          <FolderIcon color={n.folder.color} open={open} />
          <span className="ellipsis grow">{n.folder.name}</span>
          <Icon name={open ? 'chevronDown' : 'chevronRight'} size={12} />
        </button>
        {open ? (
          <>
            {n.children.map(renderFolder)}
            {inside.map((b) => boardLink(b, n.depth + 1))}
          </>
        ) : null}
      </div>
    );
  };
  return (
    <>
      {buildTree(folders.data ?? []).map(renderFolder)}
      {boards.filter((b) => !b.folderId || !ids.has(b.folderId)).slice(0, 40).map((b) => boardLink(b, 0))}
    </>
  );
}

export function entityPath(base: string, e: { type: string; id: string; boardId?: string }) {
  switch (e.type) {
    case 'board': return `${base}/boards/${e.id}`;
    case 'dashboard': return `${base}/dashboards/${e.id}`;
    case 'document': return `${base}/docs/${e.id}`;
    case 'goal': return `${base}/goals`;
    case 'item': return `${base}/boards/${e.boardId}?item=${e.id}`;
  }
  return base;
}

function WorkspaceSwitcher({ onCreate }: { onCreate: () => void }) {
  const ws = useWorkspace();
  const { session } = useSession();
  const navigate = useNavigate();
  return (
    <Dropdown
      label="Workspaces"
      width={260}
      trigger={(open, ref) => (
        <button ref={ref} className="btn ghost ws-switcher" onClick={open} aria-haspopup="menu" aria-label={`Workspace: ${ws.name}`}>
          <span className="icon-dot" style={{ background: ws.color }} />
          <span className="ellipsis">{ws.name}</span>
          <Icon name="chevronDown" size={14} />
        </button>
      )}
    >
      {(close) => (
        <>
          {session!.workspaces.map((w) => (
            <MenuItem key={w.id} active={w.id === ws.id} onClick={() => { close(); navigate(`/w/${w.id}/home`); }}>
              <span className="row"><span className="icon-dot" style={{ background: w.color }} /> {w.name} <span className="muted small">{w.role}</span></span>
            </MenuItem>
          ))}
          <MenuSep />
          <MenuItem icon="plus" onClick={() => { close(); onCreate(); }}>New workspace</MenuItem>
          <MenuItem icon="settings" onClick={() => { close(); navigate(`/w/${ws.id}/settings/workspace`); }}>Workspace settings</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function CreateMenu({ onCreate }: { onCreate: (k: 'board' | 'dashboard' | 'workspace') => void }) {
  const ws = useWorkspace();
  const createDoc = useCreateDocument(ws.id);
  const navigate = useNavigate();
  if (!canEdit(ws.role)) return null;
  return (
    <Dropdown
      align="end"
      label="Create new"
      trigger={(open, ref) => (
        <button ref={ref} className="btn primary" onClick={open} aria-haspopup="menu">
          <Icon name="plus" /> <span className="desktop-only">New</span>
        </button>
      )}
    >
      {(close) => (
        <>
          <MenuItem icon="grid" onClick={() => { close(); onCreate('board'); }}>Board</MenuItem>
          <MenuItem icon="doc" onClick={() => { close(); createDoc(); }}>Document</MenuItem>
          <MenuItem icon="chart" onClick={() => { close(); onCreate('dashboard'); }}>Dashboard</MenuItem>
          <MenuItem icon="target" onClick={() => { close(); navigate(`/w/${ws.id}/goals?new=1`); }}>Goal</MenuItem>
          <MenuItem icon="template" onClick={() => { close(); navigate(`/w/${ws.id}/templates`); }}>From template</MenuItem>
          <MenuSep />
          <MenuItem icon="layers" onClick={() => { close(); onCreate('workspace'); }}>Workspace</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function NotificationsBell() {
  const ws = useWorkspace();
  const q = useNotificationsSummary(ws.id);
  const qc = useQueryClient();
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = q.data?.unreadCount ?? 0;
  const openItem = async (n: NotificationDTO) => {
    setOpen(false);
    if (!n.readAt) await post(`/notifications/${n.id}/read`).catch(() => {});
    qc.invalidateQueries({ queryKey: ['notifications', ws.id] });
    if (n.link) navigate(n.link);
  };
  return (
    <>
      <button ref={ref} className="btn ghost icon" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} onClick={() => setOpen((o) => !o)} style={{ position: 'relative' }}>
        <Icon name="bell" />
        {unread ? <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: 8, background: 'var(--danger)' }} /> : null}
      </button>
      {open ? (
        <Popover anchor={ref} onClose={() => setOpen(false)} align="end" width={360}>
          <div className="row" style={{ padding: '6px 8px' }}>
            <strong className="grow">Notifications</strong>
            <button className="btn ghost sm" onClick={async () => { await post(`/notifications/read-all?workspaceId=${ws.id}`); qc.invalidateQueries({ queryKey: ['notifications', ws.id] }); }}>Mark all read</button>
          </div>
          <div className="menu-sep" />
          {(q.data?.notifications ?? []).slice(0, 8).map((n) => (
            <button key={n.id} className="menu-item" onClick={() => openItem(n)} style={{ alignItems: 'flex-start', background: n.readAt ? undefined : 'var(--accent-soft)' }}>
              <Icon name={n.type === 'mention' ? 'message' : n.type === 'assignment' ? 'user' : n.type === 'automation' ? 'bolt' : 'bell'} />
              <span className="grow" style={{ whiteSpace: 'normal' }}>
                <span style={{ display: 'block', fontWeight: n.readAt ? 400 : 600 }}>{n.title}</span>
                <span className="muted small">{timeAgo(n.createdAt)}</span>
              </span>
            </button>
          ))}
          {q.data && q.data.notifications.length === 0 ? <div className="muted small" style={{ padding: 12 }}>You're all caught up.</div> : null}
          <div className="menu-sep" />
          <MenuItem icon="bell" onClick={() => { setOpen(false); navigate(`/w/${ws.id}/notifications`); }}>View all notifications</MenuItem>
        </Popover>
      ) : null}
    </>
  );
}

function ThemeMenu() {
  const [pref, setPref] = useState<ThemePref>(storedTheme());
  const { session } = useSession();
  const qc = useQueryClient();
  const choose = async (p: ThemePref) => {
    setPref(p);
    applyTheme(p);
    if (session) {
      await patch('/me', { theme: p }).catch(() => {});
      qc.invalidateQueries({ queryKey: ['me'] });
    }
  };
  return (
    <Dropdown
      align="end"
      label="Theme"
      trigger={(open, ref) => (
        <button ref={ref} className="btn ghost icon desktop-only" aria-label="Theme" onClick={open}>
          <Icon name={document.documentElement.dataset.theme === 'dark' ? 'moon' : 'sun'} />
        </button>
      )}
    >
      {(close) => (
        <>
          {(['light', 'dark', 'system'] as ThemePref[]).map((p) => (
            <MenuItem key={p} icon={p === 'light' ? 'sun' : p === 'dark' ? 'moon' : 'settings'} active={pref === p} onClick={() => { close(); choose(p); }}>
              {p[0].toUpperCase() + p.slice(1)}
            </MenuItem>
          ))}
        </>
      )}
    </Dropdown>
  );
}

function ProfileMenu() {
  const { session } = useSession();
  const ws = useWorkspace();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const user = session!.user;
  const logout = async () => {
    try {
      await post('/auth/logout');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
    qc.clear();
    window.location.href = '/login';
  };
  return (
    <Dropdown
      align="end"
      width={240}
      trigger={(open, ref) => (
        <button ref={ref} className="btn ghost icon" aria-label="Profile menu" onClick={open}>
          <Avatar name={user.name} id={user.id} url={user.avatarUrl} />
        </button>
      )}
    >
      {(close) => (
        <>
          <div style={{ padding: '8px 10px' }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div className="muted small ellipsis">{user.email}</div>
          </div>
          <MenuSep />
          <MenuItem icon="user" onClick={() => { close(); navigate(`/w/${ws.id}/settings/profile`); }}>Profile</MenuItem>
          <MenuItem icon="bell" onClick={() => { close(); navigate(`/w/${ws.id}/settings/notifications`); }}>Notification settings</MenuItem>
          <MenuItem icon="shield" onClick={() => { close(); navigate(`/w/${ws.id}/settings/security`); }}>Security</MenuItem>
          {session?.platformRole ? (
            <>
              <MenuSep />
              <MenuItem icon="chart" onClick={() => { close(); navigate('/admin'); }}>Founder console</MenuItem>
            </>
          ) : null}
          <MenuSep />
          <MenuItem icon="logout" onClick={() => { close(); logout(); }}>Log out</MenuItem>
        </>
      )}
    </Dropdown>
  );
}

function SearchPalette({ onClose }: { onClose: () => void }) {
  const ws = useWorkspace();
  const [q, setQ] = useState('');
  const dq = useDebounced(q, 200);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const base = `/w/${ws.id}`;
  const res = useQuery({
    queryKey: ['palette', ws.id, dq],
    queryFn: () => post(`/workspaces/${ws.id}/search`, { q: dq, types: ['boards', 'items', 'documents', 'users'], limit: 8 }),
    enabled: dq.trim().length > 0,
  });
  const nav = NAV.filter((n) => !q || n.label.toLowerCase().includes(q.toLowerCase())).map((n) => ({ key: `nav:${n.to}`, icon: n.icon, label: `Go to ${n.label}`, sub: '', to: `${base}/${n.to}` }));
  const results = [
    ...((res.data?.boards ?? []) as any[]).map((b) => ({ key: `b:${b.id}`, icon: 'grid', label: b.name, sub: 'Board', to: `${base}/boards/${b.id}` })),
    ...((res.data?.items ?? []) as any[]).map((i) => ({ key: `i:${i.id}`, icon: 'checkSquare', label: i.name, sub: i.boardName, to: `${base}/boards/${i.boardId}?item=${i.id}` })),
    ...((res.data?.documents ?? []) as any[]).map((d) => ({ key: `d:${d.id}`, icon: 'doc', label: d.title, sub: 'Document', to: `${base}/docs/${d.id}` })),
    ...((res.data?.users ?? []) as any[]).map((u) => ({ key: `u:${u.id}`, icon: 'user', label: u.name, sub: u.email, to: `${base}/search?people=${u.id}` })),
  ];
  const all = [...results, ...(q ? [{ key: 'all', icon: 'search', label: `Search for "${q}"`, sub: 'Advanced search', to: `${base}/search?q=${encodeURIComponent(q)}` }] : []), ...nav.slice(0, q ? 4 : 8)];
  const go = (to: string) => {
    onClose();
    navigate(to);
  };
  return (
    <Modal title="Search" onClose={onClose} wide>
      <input
        className="palette-input"
        style={{ margin: '-18px -18px 0', width: 'calc(100% + 36px)' }}
        placeholder="Search boards, items, documents, people…"
        value={q}
        autoFocus
        aria-label="Search"
        onChange={(e) => { setQ(e.target.value); setActive(0); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(all.length - 1, a + 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
          if (e.key === 'Enter' && all[active]) go(all[active].to);
        }}
      />
      <div className="palette-results" role="listbox" style={{ margin: '0 -12px' }}>
        {res.isFetching ? <div className="row muted small" style={{ padding: 8 }}><Spinner /> Searching…</div> : null}
        {all.map((r, i) => (
          <a key={r.key} href={r.to} role="option" aria-selected={i === active} className={`palette-item${i === active ? ' active' : ''}`} onMouseEnter={() => setActive(i)} onClick={(e) => { e.preventDefault(); go(r.to); }}>
            <Icon name={r.icon} /> <span className="grow ellipsis">{r.label}</span> <span className="muted small ellipsis" style={{ maxWidth: 200 }}>{r.sub}</span>
          </a>
        ))}
        {dq && res.data && !results.length ? <div className="muted small" style={{ padding: 10 }}>No matches.</div> : null}
      </div>
    </Modal>
  );
}

export const SHORTCUTS: [string, string][] = [
  ['Ctrl/⌘ + K or /', 'Open search'],
  ['?', 'Show keyboard shortcuts'],
  ['g then h', 'Go to Home'],
  ['g then m', 'Go to My Work'],
  ['g then d', 'Go to My Day'],
  ['g then i', 'Go to Inbox'],
  ['g then n', 'Go to Notifications'],
  ['g then b', 'Go to Boards'],
  ['g then s', 'Go to Settings'],
  ['n (on a board)', 'New item in the first group'],
  ['Esc', 'Close panel or dialog'],
  ['Enter (on a cell)', 'Edit cell'],
  ['Arrow keys in menus', 'Move between options'],
];

function HelpDialog({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Help & keyboard shortcuts" onClose={onClose}>
      <table className="data-table">
        <tbody>
          {SHORTCUTS.map(([k, v]) => (
            <tr key={k}>
              <td style={{ width: 200 }}><kbd>{k}</kbd></td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <p className="muted small">
        Boards hold items in groups; every column type is configurable. Switch between Table, Kanban, Calendar, Timeline, Chart, Workload, Form, Map and Files views —
        they all use the same data. Right-click an item for more actions.
      </p>
      <p className="muted small">
        {BRAND.full} is part of the {BRAND.platform} platform. <a {...platformLinkProps(PLATFORM_URLS.productPage)}>About {BRAND.product}</a>
      </p>
    </Modal>
  );
}
