import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { AppConfigDTO, MemberDTO, UserDTO, WorkspaceDTO } from '../../shared/types';
import { ApiError, get, setCsrfToken } from './api';

export interface Session {
  user: UserDTO;
  csrfToken: string | null;
  workspaces: WorkspaceDTO[];
}

const SessionCtx = createContext<{ session: Session | null; loading: boolean; error: unknown; refresh: () => Promise<unknown> }>({
  session: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const q = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const s = await get<Session>('/auth/me');
        setCsrfToken(s.csrfToken);
        return s;
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          setCsrfToken(null);
          return null;
        }
        throw e;
      }
    },
    staleTime: 60_000,
    retry: 1,
  });
  return <SessionCtx.Provider value={{ session: q.data ?? null, loading: q.isLoading, error: q.error, refresh: q.refetch }}>{children}</SessionCtx.Provider>;
}

export function useSession() {
  return useContext(SessionCtx);
}

export function useUser(): UserDTO {
  const { session } = useSession();
  if (!session) throw new Error('useUser outside authenticated area');
  return session.user;
}

const LAST_WS = 'workos:lastWorkspace';

export function rememberWorkspace(id: string) {
  try {
    localStorage.setItem(LAST_WS, id);
  } catch {
    /* storage unavailable */
  }
}

export function lastWorkspace(): string | null {
  try {
    return localStorage.getItem(LAST_WS);
  } catch {
    return null;
  }
}

export function useWorkspace(): WorkspaceDTO {
  const { session } = useSession();
  const { wsId } = useParams();
  const ws = session?.workspaces.find((w) => w.id === wsId);
  useEffect(() => {
    if (ws) rememberWorkspace(ws.id);
  }, [ws]);
  if (!ws) throw new Error('Workspace not found');
  return ws;
}

export function useMembers(wsId: string) {
  return useQuery({ queryKey: ['members', wsId], queryFn: () => get<MemberDTO[]>(`/workspaces/${wsId}/members`), staleTime: 60_000 });
}

export function useConfig() {
  return useQuery({ queryKey: ['config'], queryFn: () => get<AppConfigDTO>('/auth/config'), staleTime: Infinity });
}

export function useInvalidate() {
  const qc = useQueryClient();
  return (...keys: unknown[][]) => Promise.all(keys.map((k) => qc.invalidateQueries({ queryKey: k })));
}

export function canEdit(role: WorkspaceDTO['role']) {
  return role !== 'viewer';
}
export function isAdmin(role: WorkspaceDTO['role']) {
  return role === 'owner' || role === 'admin';
}
