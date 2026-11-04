import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { lastWorkspace, useSession } from './lib/session';
import { Loading, ErrorBox } from './components/ui/ui';
import { AppShell } from './components/layout/AppShell';
import { LoginPage, SignupPage, InvitePage } from './pages/Auth';
import { applyTheme } from './lib/hooks';

const Home = lazy(() => import('./pages/Home'));
const MyWork = lazy(() => import('./pages/MyWork'));
const MyDay = lazy(() => import('./pages/MyDay'));
const Inbox = lazy(() => import('./pages/Inbox'));
const Boards = lazy(() => import('./pages/Boards'));
const BoardPage = lazy(() => import('./board/BoardPage'));
const Favourites = lazy(() => import('./pages/Favourites'));
const Recent = lazy(() => import('./pages/Recent'));
const Dashboards = lazy(() => import('./pages/Dashboards'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const Documents = lazy(() => import('./pages/Documents'));
const DocumentPage = lazy(() => import('./pages/DocumentPage'));
const Goals = lazy(() => import('./pages/Goals'));
const Templates = lazy(() => import('./pages/Templates'));
const Automations = lazy(() => import('./pages/Automations'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Search = lazy(() => import('./pages/Search'));
const Settings = lazy(() => import('./pages/Settings'));
const Workspaces = lazy(() => import('./pages/Workspaces'));

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, error, refresh } = useSession();
  const location = useLocation();
  if (loading) return <Loading label="Loading WorkOS…" />;
  if (error && !session) return <div className="page"><ErrorBox error={error} retry={() => refresh()} /></div>;
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  return <>{children}</>;
}

function WorkspaceGate({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const { wsId } = useParams();
  if (!session) return null;
  if (!session.workspaces.some((w) => w.id === wsId)) {
    const fallback = session.workspaces[0];
    return fallback ? <Navigate to={`/w/${fallback.id}/home`} replace /> : <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
}

function RootRedirect() {
  const { session } = useSession();
  if (!session) return null;
  const last = lastWorkspace();
  const ws = session.workspaces.find((w) => w.id === last) ?? session.workspaces[0];
  return ws ? <Navigate to={`/w/${ws.id}/home`} replace /> : <Navigate to="/welcome" replace />;
}

export function App() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { session } = useSession();

  useEffect(() => {
    const onUnauthorized = () => {
      qc.setQueryData(['me'], null);
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
    };
    window.addEventListener('workos:unauthorized', onUnauthorized);
    return () => window.removeEventListener('workos:unauthorized', onUnauthorized);
  }, [navigate, qc]);

  useEffect(() => {
    if (session?.user.theme) applyTheme(session.user.theme);
  }, [session?.user.theme]);

  useEffect(() => {
    document.title = 'KEVOS WorkOS';
  }, []);

  const page = (el: ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/invite/:token" element={<InvitePage />} />
      <Route path="/" element={<RequireAuth><RootRedirect /></RequireAuth>} />
      <Route path="/welcome" element={<RequireAuth>{page(<Workspaces standalone />)}</RequireAuth>} />
      <Route
        path="/w/:wsId/*"
        element={
          <RequireAuth>
            <WorkspaceGate>
              <AppShell>
                <Routes>
                  <Route path="home" element={page(<Home />)} />
                  <Route path="my-work" element={page(<MyWork />)} />
                  <Route path="my-day" element={page(<MyDay />)} />
                  <Route path="inbox" element={page(<Inbox mode="inbox" />)} />
                  <Route path="notifications" element={page(<Inbox mode="all" />)} />
                  <Route path="workspaces" element={page(<Workspaces />)} />
                  <Route path="boards" element={page(<Boards />)} />
                  <Route path="boards/:boardId" element={page(<BoardPage />)} />
                  <Route path="boards/:boardId/views/:viewId" element={page(<BoardPage />)} />
                  <Route path="favourites" element={page(<Favourites />)} />
                  <Route path="recent" element={page(<Recent />)} />
                  <Route path="dashboards" element={page(<Dashboards />)} />
                  <Route path="dashboards/:dashboardId" element={page(<DashboardPage />)} />
                  <Route path="docs" element={page(<Documents />)} />
                  <Route path="docs/:docId" element={page(<DocumentPage />)} />
                  <Route path="goals" element={page(<Goals />)} />
                  <Route path="templates" element={page(<Templates />)} />
                  <Route path="automations" element={page(<Automations />)} />
                  <Route path="integrations" element={page(<Integrations />)} />
                  <Route path="search" element={page(<Search />)} />
                  <Route path="settings" element={<Navigate to="profile" replace />} />
                  <Route path="settings/:tab" element={page(<Settings />)} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </AppShell>
            </WorkspaceGate>
          </RequireAuth>
        }
      />
      <Route path="/settings/*" element={<RequireAuth><RootRedirect /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
