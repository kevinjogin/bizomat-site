import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { lastWorkspace, useSession } from './lib/session';
import { Loading, ErrorBox } from './components/ui/ui';
import { AppShell } from './components/layout/AppShell';
import { LoginPage, SignupPage, InvitePage, VerifyEmailPage } from './pages/Auth';
import { ChoosePasswordPage } from './pages/ChoosePassword';
import { useHeartbeat } from './lib/heartbeat';
import { BRAND, IS_COMPANY, IS_CRM, IS_FINANCE } from './lib/brand';
import { appPath } from './lib/base';

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
const AdminApp = lazy(() => import('./admin/AdminApp'));
const Privacy = lazy(() => import('./pages/Privacy'));
const TaskPage = lazy(() => import('./pages/TaskPage'));
const MyInvitations = lazy(() => import('./pages/MyInvitations'));
// BIZOMAT CRM, when the app is served under /crm (src/client/crm): its own pages after the shared sign-in pages.
const CrmRoutes = lazy(() => import('./crm/CrmApp').then((m) => ({ default: m.CrmRoutes })));
const CrmJoin = lazy(() => import('./crm/CrmApp').then((m) => ({ default: m.Join })));
// BIZOMAT Finance, when the app is served under /finance (src/client/fin), in the same way.
const FinRoutes = lazy(() => import('./fin/FinApp').then((m) => ({ default: m.FinRoutes })));
const FinJoin = lazy(() => import('./fin/FinApp').then((m) => ({ default: m.Join })));
// The company area, when the app is served under /company (src/client/company).
const CompanyRoutes = lazy(() => import('./company/CompanyApp').then((m) => ({ default: m.CompanyRoutes })));
const CompanyJoin = lazy(() => import('./company/CompanyApp').then((m) => ({ default: m.Join })));
const CompanyConfirm = lazy(() => import('./company/CompanyApp').then((m) => ({ default: m.ConfirmEmail })));
// The super admin consoles of the CRM and Finance (platform admins only; the server answers 404 to everyone else).
const CrmAdmin = lazy(() => import('./admin/products/CrmConsole'));
const FinAdmin = lazy(() => import('./admin/products/FinConsole'));

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, error, refresh } = useSession();
  const location = useLocation();
  if (loading) return <Loading label={`Loading ${BRAND.product}…`} />;
  if (error && !session) return <div className="page"><ErrorBox error={error} retry={() => refresh()} /></div>;
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  if (session.user.passwordResetRequired) return <ChoosePasswordPage />;
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
      navigate(`/login?next=${encodeURIComponent(appPath())}`);
    };
    window.addEventListener('workos:unauthorized', onUnauthorized);
    return () => window.removeEventListener('workos:unauthorized', onUnauthorized);
  }, [navigate, qc]);

  // The theme belongs to this computer, not the account (src/client/lib/hooks.ts): main.tsx applies it.

  useHeartbeat(!!session);

  // The default tab title ("BIZOMAT Project Management") is in index.html; pages add their own with usePageTitle.
  // Setting it here would overwrite the first page's title, because a parent's effects run after its children's.

  const page = (el: ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>;

  // Under /crm the same sign-in pages, then the CRM (its own route table: Project Management's routes are not served).
  if (IS_CRM) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy" element={page(<Privacy />)} />
        <Route path="/join/:token" element={page(<CrmJoin />)} />
        <Route path="/admin/*" element={<RequireAuth>{page(<CrmAdmin />)}</RequireAuth>} />
        <Route path="/*" element={<RequireAuth>{page(<CrmRoutes />)}</RequireAuth>} />
      </Routes>
    );
  }

  // Under /finance the same sign-in pages, then Finance (its own route table too).
  if (IS_FINANCE) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy" element={page(<Privacy />)} />
        <Route path="/join/:token" element={page(<FinJoin />)} />
        <Route path="/admin/*" element={<RequireAuth>{page(<FinAdmin />)}</RequireAuth>} />
        <Route path="/*" element={<RequireAuth>{page(<FinRoutes />)}</RequireAuth>} />
      </Routes>
    );
  }

  // Under /company the same sign-in pages, then the company area (its own route table too). The invitation and the
  // contact-address confirmation work before signing in.
  if (IS_COMPANY) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy" element={page(<Privacy />)} />
        <Route path="/join/:token" element={page(<CompanyJoin />)} />
        <Route path="/confirm-email" element={page(<CompanyConfirm />)} />
        <Route path="/*" element={<RequireAuth>{page(<CompanyRoutes />)}</RequireAuth>} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/invite/:token" element={<InvitePage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/privacy" element={page(<Privacy />)} />
      <Route path="/admin/*" element={<RequireAuth>{page(<AdminApp />)}</RequireAuth>} />
      <Route path="/" element={<RequireAuth><RootRedirect /></RequireAuth>} />
      <Route path="/welcome" element={<RequireAuth>{page(<Workspaces standalone />)}</RequireAuth>} />
      <Route path="/invitations" element={<RequireAuth>{page(<MyInvitations />)}</RequireAuth>} />
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
                  <Route path="tasks/:itemId" element={page(<TaskPage />)} />
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
