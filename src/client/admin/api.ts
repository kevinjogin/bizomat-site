import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { get } from '../lib/api';

export type Range = '7d' | '30d' | '90d' | 'all';
export const RANGE_LABELS: Record<Range, string> = { '7d': '7 days', '30d': '30 days', '90d': '90 days', all: 'All time' };

export function useRange(): [Range, (r: Range) => void] {
  const [params, setParams] = useSearchParams();
  const v = params.get('range');
  const range: Range = v === '7d' || v === '30d' || v === '90d' || v === 'all' ? v : '30d';
  const set = (r: Range) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        n.set('range', r);
        return n;
      },
      { replace: true },
    );
  return [range, set];
}

export function useAdmin<T>(path: string, opts: Partial<UseQueryOptions<T>> = {}) {
  return useQuery<T>({
    queryKey: ['admin', path],
    queryFn: () => get<T>(`/admin${path}`),
    staleTime: 15_000,
    ...opts,
  });
}

export interface Point {
  date: string;
  value: number;
}

export interface Overview {
  range: Range;
  generatedAt: number;
  analyticsStartedAt: number | null;
  users: { total: number; newToday: number; newThisWeek: number; newThisMonth: number; neverReturned: number };
  active: { today: number; last7Days: number; last30Days: number; now: number; nowSessions: number };
  loggedIn: { users: number; sessions: number };
  visitors: { anonymousPageViewsToday: number; anonymousPageViewsInRange: number };
  content: {
    workspaces: number;
    projects: number;
    activeProjects: number;
    tasks: number;
    tasksCompleted: number;
    tasksPending: number;
    usersWithProjects: number;
    avgProjectsPerUser: number;
  };
  series: Record<'registrations' | 'cumulativeUsers' | 'dau' | 'wau' | 'projectsCreated' | 'tasksCreated' | 'tasksCompleted' | 'anonymousPageViews', Point[]>;
  recentSignups: { id: string; name: string; email: string; registeredAt: number; lastActiveAt: number | null; logins: number; projects: number }[];
  activeNow: { id: string; name: string; email: string; lastActivityAt: number }[];
}

export type UserStatus = 'active_now' | 'active' | 'inactive' | 'never_returned' | 'disabled';

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  registeredAt: number;
  lastLoginAt: number | null;
  lastActiveAt: number | null;
  logins: number;
  projects: number;
  workspaces: number;
  tasks: number;
  status: UserStatus;
  activeNow: boolean;
  platformRole: 'founder' | 'admin' | null;
  locked: boolean;
}

export interface SessionRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  provider: string;
  loginAt: number;
  lastActivityAt: number | null;
  lastSeenAt: number | null;
  expiresAt: number;
  endedAt: number | null;
  endReason: string | null;
  status: 'active' | 'idle' | 'ended' | 'expired';
  device: string;
  browser: string;
  os: string;
}

export interface UserDetail {
  user: {
    id: string;
    name: string;
    email: string;
    timezone: string;
    locale: string;
    registeredAt: number;
    lastLoginAt: number | null;
    lastActiveAt: number | null;
    logins: number;
    status: 'active' | 'disabled' | 'locked';
    hasAvatar: boolean;
    signInMethods: string[];
    failedLoginsLast30Days: number;
    platformRole: string | null;
    activeNow: boolean;
  };
  sessions: SessionRow[];
  workspaces: { id: string; name: string; role: string; joinedAt: number; createdByUser: boolean; members: number }[];
  projects: { id: string; name: string; workspaceId: string; workspaceName: string; createdAt: number; updatedAt: number; archived: boolean; tasks: number; completed: number }[];
  tasks: { created: number; completed: number; firstCreatedAt: number | null };
  events: { id: string; type: string; at: number; workspaceName: string | null; boardName: string | null; metadata: Record<string, unknown> }[];
  dailyActivity: { date: string; heartbeats: number }[];
}

export interface ActivityEvent {
  id: string;
  type: string;
  at: number;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  workspaceId: string | null;
  workspaceName: string | null;
  boardId: string | null;
  boardName: string | null;
  entityType: string | null;
  metadata: Record<string, unknown>;
}

export const EVENT_LABELS: Record<string, string> = {
  'user.registered': 'registered an account',
  'user.login': 'signed in',
  'user.logout': 'signed out',
  'workspace.created': 'created a workspace',
  'project.created': 'created a project',
  'project.updated': 'updated a project',
  'project.archived': 'archived a project',
  'project.deleted': 'deleted a project',
  'task.created': 'created a task',
  'task.updated': 'updated a task',
  'task.completed': 'completed a task',
  'member.invited': 'invited a team member',
  'member.joined': 'joined a workspace',
  'settings.changed': 'changed account settings',
};

export const EVENT_ICON: Record<string, string> = {
  'user.registered': 'user',
  'user.login': 'key',
  'user.logout': 'logout',
  'workspace.created': 'layers',
  'project.created': 'grid',
  'project.updated': 'edit',
  'project.archived': 'archive',
  'project.deleted': 'trash',
  'task.created': 'plus',
  'task.updated': 'edit',
  'task.completed': 'check',
  'member.invited': 'users',
  'member.joined': 'users',
  'settings.changed': 'settings',
};

export function eventLabel(type: string) {
  return EVENT_LABELS[type] ?? type;
}
