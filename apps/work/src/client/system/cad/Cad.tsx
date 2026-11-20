// CAD Automation inside BIZOMAT ERP, at /erp/c/<company>/cad (flag cad_in_erp; docs/cad/README.md). The screens,
// accounts, computers, history and exports are here; the engine (the AI connector, the computers' gateway, the
// geometry checks) and SOLIDWORKS stay where they are, and the ERP's server reads and changes them with a signed
// request. Sections: Overview, Computers, AI assistants, History, Exports, Tools, Access, People, Setup, and the pairing
// page the Companion opens (/erp/cad/pair?code=...). Owner, 20 Nov 2026: everything CAD Automation's own pages showed
// (Home, CAD Assistant, SOLIDWORKS, Tools, History, Settings and Admin) is here, so nobody needs bizomat.ai/cad. The
// server decides who may see and do what; this screen only shows it.
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { timeAgo } from '../../lib/format';
import { toolUrl } from '../../lib/base';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import { apiHref, erpPath, productsPage, type ProductView } from '../erp/api';
import { Props, Section } from '../erp/common';
import { ProductPicker, type PickedProduct } from '../erp/Products';

export const cadPage = (companyId: string, path = '') => `/c/${encodeURIComponent(companyId)}/cad${path}`;

interface Person { sub: string | null; name: string | null; email: string | null }
interface Instance { instance_id: string; solidworks: string; sw_revision: string; addin_version: string | null; documents_open: number; active_document?: string | null; busy: boolean; ready: boolean }
interface Computer { id: string; name: string; online: boolean; default: boolean; created: string; last_seen_s: number; companion_version: string | null; os: string | null; paused?: boolean; solidworks?: Instance[]; note?: string; owner: Person | null; mine: boolean; canOperate: boolean; canRemove: boolean }
interface Assistant { id: string; name: string; host: string; created: number; lastUsed: number | null; owner: Person | null; mine: boolean; needsCompany: boolean }
interface Command { id: string; tool: string; title: string; op: string; status: string; created: number; updated: number; device: string | null; deviceId: string; app: string | null; owner: Person | null; mine: boolean; error?: { code: string | null; message: string }; history?: { status: string; at: string; hop?: string; note?: string }[]; result?: unknown; progress?: unknown }
interface Export { id: string; name: string | null; format: string | null; size: number | null; sha256: string | null; created: number; expires: number; owner: Person | null; mine: boolean }
interface ToolGroup { group: string; tools: { name: string; title: string; summary: string }[] }
interface CadState {
  account: { id: string };
  connector: { url: string };
  installer: { available: boolean; name?: string; size?: number; sha256?: string; version?: string };
  computers: Computer[];
  assistants: Assistant[];
  commands: Command[];
  exports: Export[];
  usage: { running: number; storageBytes: number };
  unassigned: { computers: number; assistants: number };
  tools: ToolGroup[];
  /** Requests to copy for the AI assistant (CAD Automation's catalog), and the address the direct link uses. */
  examples?: { group: string; items: string[] }[];
  service?: string;
  /** Whether CAD Automation holds the add-in package for a manual installation. */
  package?: boolean;
}
interface Access { privateUrl: string; addinKey: string; service: string; package: boolean }
export interface CadView {
  company: { id: string; name: string; kind: string };
  role: string;
  perms: { view: boolean; operate: 'all' | 'own' | false; export: boolean; manage: boolean; delete: boolean; scope: 'all' | 'team' | 'own' };
  limits: { concurrent: number; commandSeconds: number; uploadMb: number; storageMb: number };
  flags: { products: boolean; bom: boolean; manufacturing: boolean; quality: boolean; projects: boolean };
  erp: { documentsEdit: boolean; productsEdit: boolean };
  /** When CAD Automation last reported to the ERP: late after 5 minutes, stale (it works by person) after 15. */
  sync?: { at: number; minutes: number; late: boolean; stale: boolean } | null;
  cad: ({ connected: true } & CadState) | { connected: false; reason: string };
}

interface CadNotice {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: number;
  read: boolean;
}

const STATUS: Record<string, [string, string]> = {
  created: ['Queued', ''],
  queued: ['Queued', ''],
  delivered: ['Sent to the computer', ''],
  accepted: ['Accepted', ''],
  running: ['Running', 'info'],
  succeeded: ['Done', 'success'],
  failed: ['Failed', 'danger'],
  rejected: ['Refused', 'danger'],
  denied: ['Not approved', 'warning'],
  unknown: ['Unknown', 'warning'],
  cancelled: ['Cancelled', ''],
  expired: ['Expired', 'warning'],
};
const FINISHED = new Set(['succeeded', 'failed', 'rejected', 'denied', 'unknown', 'cancelled', 'expired']);
const StatusBadge = ({ value }: { value: string }) => {
  const [label, tone] = STATUS[value] ?? [value, ''];
  return <span className={`badge ${tone}`}>{label}</span>;
};
const bytes = (n: number | null | undefined) => (n === null || n === undefined ? '' : n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
const who = (p: Person | null, mine: boolean) => (mine ? 'You' : p?.name || p?.email || 'Someone in the company');
const ROLE_NAMES: Record<string, string> = { owner: 'owner', admin: 'administrator', manager: 'manager', employee: 'employee', read_only: 'read-only member' };

export const useCadView = (companyId: string) =>
  useQuery({ queryKey: ['cad', companyId], queryFn: () => get<CadView>(erpPath(companyId, '/cad')), retry: false, refetchInterval: 15_000, enabled: !!companyId });

/** What the person may do with CAD Automation here, without its lists (no call to CAD Automation itself). */
export const useCadFlags = (companyId: string) =>
  useQuery({ queryKey: ['cad', companyId, 'flags'], queryFn: () => get<Omit<CadView, 'cad'>>(erpPath(companyId, '/cad?part=flags')), retry: false, staleTime: 60_000, enabled: !!companyId });

/** The companies where the person can open CAD Automation in the ERP (empty while it is off everywhere for them). */
export const useCadCompanies = () =>
  useQuery({ queryKey: ['cad', 'companies'], queryFn: () => get<{ companies: { id: string; name: string; kind: string; operate: boolean }[] }>('/erp/cad/companies'), staleTime: 60_000, retry: false });

/** The CAD Automation module; `fallback` is shown while it is not switched on in the ERP for this company. */
export function CadArea({ companyId, companyName, fallback }: { companyId: string; companyName: string; fallback: ReactNode }) {
  const q = useCadView(companyId);
  usePageTitle('CAD Automation');
  if (q.error) {
    const code = (q.error instanceof ApiError ? (q.error.details as any)?.code : null) as string | null;
    if (code === 'CAD_NOT_ENABLED' || code === 'CAD_EXAMPLE') return <>{fallback}</>;
    if (q.error instanceof ApiError && q.error.status === 403) {
      return (
        <div className="page crm-page">
          <PageHeader title="CAD Automation" />
          <section className="co-prompt"><p>{q.error.message}</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  }
  if (!q.data) return <Loading label="Opening CAD Automation…" />;
  const v = q.data;
  const tabs: [string, string, string][] = [
    ['', 'Overview', 'home'],
    ['/computers', 'Computers', 'diamond'],
    ['/assistants', 'AI assistants', 'message'],
    ['/history', 'History', 'history'],
    ['/exports', 'Exports', 'download'],
    ['/tools', 'Tools', 'wrench'],
    ...(v.perms.operate ? [['/access', 'Access', 'key'] as [string, string, string]] : []),
    ...(v.perms.scope !== 'own' ? [['/people', 'People', 'users'] as [string, string, string]] : []),
    ['/setup', 'Setup', 'settings'],
  ];
  return (
    <div className="page crm-page">
      <PageHeader
        title="CAD Automation"
        subtitle={`Your AI assistant builds native SOLIDWORKS parts, assemblies and drawings on your own computers, for ${companyName}. You are ${ROLE_NAMES[v.role] ? `an ${ROLE_NAMES[v.role]}`.replace(/^an ([^aeiou])/, 'a $1') : 'a member'} here.`}
      />
      <nav className="tabs mt-tabs" aria-label="CAD Automation sections">
        {tabs.map(([to, label, icon]) => (
          <NavLink key={label} end={to === ''} to={cadPage(companyId, to)} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}>
            <Icon name={icon} size={14} /> {label}
          </NavLink>
        ))}
      </nav>
      {!v.cad.connected ? (
        <section className="co-prompt" role="status">
          <p><strong>CAD Automation is not reachable from the ERP right now.</strong> {v.cad.reason} Your computers and AI assistants keep working; their lists come back here once it answers.</p>
          <button className="btn" onClick={() => q.refetch()}><Icon name="refresh" size={14} /> Try again</button>
        </section>
      ) : null}
      {v.cad.connected && v.sync?.late ? <SyncLate sync={v.sync} /> : null}
      <Routes>
        <Route index element={<Overview v={v} />} />
        <Route path="computers" element={<Computers v={v} />} />
        <Route path="assistants" element={<Assistants v={v} />} />
        <Route path="history" element={<History v={v} />} />
        <Route path="exports" element={<Exports v={v} />} />
        <Route path="tools" element={<Tools v={v} />} />
        <Route path="access" element={<AccessKeys v={v} />} />
        <Route path="people" element={<People v={v} />} />
        <Route path="setup" element={<Setup v={v} />} />
        <Route path="pair" element={<Pair v={v} />} />
        <Route path="*" element={<Navigate to={cadPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

/** CAD Automation has not reported to the ERP for a while (G6 of the audit of 20 Nov 2026). */
function SyncLate({ sync }: { sync: NonNullable<CadView['sync']> }) {
  return (
    <section className="co-prompt" role="status">
      <p>
        <strong>CAD Automation has not reported to the ERP for {sync.minutes} minutes.</strong>{' '}
        {sync.stale
          ? 'Until it reports again, new work runs by person, as before the ERP: this company’s limits and shared views do not apply to it.'
          : 'If it stays silent for 15 minutes, new work runs by person until it reports again, and this company’s limits do not apply to it.'}{' '}
        Nothing moves between companies either way.
      </p>
    </section>
  );
}

/** The person's CAD Automation notices in this company: a failed run, a review asked of them, a revision released. */
function Notices({ v }: { v: CadView }) {
  const id = v.company.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['cad', id, 'notices'], queryFn: () => get<{ notices: CadNotice[] }>(erpPath(id, '/cad/notices')), retry: false, staleTime: 30_000 });
  const unread = (q.data?.notices ?? []).filter((n) => !n.read);
  if (!unread.length) return null;
  const read = async (ids: string[]) => {
    await post(erpPath(id, '/cad/notices/read'), { ids }).catch(() => null);
    await qc.invalidateQueries({ queryKey: ['cad', id, 'notices'] });
  };
  return (
    <Section title="For you" actions={<button className="btn ghost sm" type="button" onClick={() => read(unread.map((n) => n.id))}>Mark all as read</button>}>
      <ul className="erp-list">
        {unread.map((n) => (
          <li key={n.id}>
            {n.link ? <Link to={n.link.replace(/^\/erp(?=\/)/, '')} onClick={() => read([n.id])}><strong>{n.title}</strong></Link> : <strong>{n.title}</strong>}{' '}
            <span className="muted small">{timeAgo(n.createdAt)}</span>
            {n.body ? <div className="small muted">{n.body}</div> : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function useRefresh(companyId: string) {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['cad', companyId] });
}

function useAction(companyId: string) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  return async (fn: () => Promise<unknown>, done?: string) => {
    try {
      await fn();
      if (done) toast(done);
      await refresh();
      return true;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return false;
    }
  };
}

// ------------------------------------------------------------------ setting it up, in place (a popup per step)

type StepKey = 'install' | 'pair' | 'connect' | 'check';
type Connected = Extract<CadView['cad'], { connected: true }>;

/** Which steps are done, from what CAD Automation reports for this person in this company. */
function progressOf(c: Connected) {
  const mine = c.computers.filter((x) => x.mine);
  const paired = mine.length > 0;
  return {
    install: paired,
    pair: paired,
    connect: c.assistants.some((a) => a.mine && !a.needsCompany),
    check: mine.some((pc) => pc.online && (pc.solidworks ?? []).some((i) => i.ready)),
  } as Record<StepKey, boolean>;
}

const STEPS: { key: StepKey; title: string; what: string; button: string }[] = [
  { key: 'install', title: 'Install it on your Windows computer', what: 'One installer for the SOLIDWORKS add-in and the Companion, which keeps the computer linked.', button: 'Download' },
  { key: 'pair', title: 'Pair the computer', what: 'Type the code the Companion shows, and the computer works in this company.', button: 'Pair' },
  { key: 'connect', title: 'Connect your AI assistant', what: 'Add the connector address in Claude or another AI app that supports remote MCP connectors.', button: 'Connect' },
  { key: 'check', title: 'Check it works', what: 'Open SOLIDWORKS: it shows Ready here when the add-in is connected.', button: 'Check' },
];

/** The four steps on one card; each opens a small popup on this page, so nobody leaves the ERP to set it up. */
function SetupGuide({ v, compact }: { v: CadView; compact?: boolean }) {
  const [open, setOpen] = useState<StepKey | null>(null);
  if (!v.cad.connected) return null;
  const c = v.cad;
  const done = progressOf(c);
  const count = STEPS.filter((s) => done[s.key]).length;
  if (compact && count === STEPS.length) return null;
  const canOperate = !!v.perms.operate;
  return (
    <Section title={count === STEPS.length ? 'Set up' : `Set up CAD Automation (${count} of ${STEPS.length} done)`}>
      {!canOperate ? <p className="muted small">Your role in {v.company.name} can see CAD work but not set up computers or assistants.</p> : null}
      <ol className="cad-steps">
        {STEPS.map((s, i) => (
          <li key={s.key} className={`cad-step${done[s.key] ? ' cad-step-done' : ''}`}>
            <span className="cad-step-mark" aria-hidden>{done[s.key] ? <Icon name="check" size={14} /> : i + 1}</span>
            <div className="grow">
              <strong>{s.title}</strong>
              <div className="muted small">{s.what}</div>
            </div>
            {done[s.key] ? <span className="badge success">Done</span> : null}
            <button className={`btn sm${done[s.key] ? ' ghost' : ' primary'}`} disabled={!canOperate && s.key !== 'check'} onClick={() => setOpen(s.key)}>{done[s.key] ? 'Open' : s.button}</button>
          </li>
        ))}
      </ol>
      <p className="muted small">Your models stay on your computer; SOLIDWORKS is the master copy.</p>
      {open === 'install' ? <InstallDialog v={v} onClose={() => setOpen(null)} onNext={() => setOpen('pair')} /> : null}
      {open === 'pair' ? <PairDialog v={v} onClose={() => setOpen(null)} onNext={() => setOpen('connect')} /> : null}
      {open === 'connect' ? <ConnectDialog v={v} onClose={() => setOpen(null)} onNext={() => setOpen('check')} /> : null}
      {open === 'check' ? <CheckDialog v={v} onClose={() => setOpen(null)} /> : null}
    </Section>
  );
}

function InstallDialog({ v, onClose, onNext }: { v: CadView; onClose: () => void; onNext: () => void }) {
  const c = v.cad as Connected;
  const inst = c.installer;
  return (
    <Modal title="Install CAD Automation for SOLIDWORKS" onClose={onClose} footer={<div className="row"><button className="btn ghost" onClick={onClose}>Close</button><button className="btn primary" onClick={onNext}>Next: pair the computer</button></div>}>
      <div className="stack">
        <p>Run the installer on the Windows computer where SOLIDWORKS is installed. It adds the CAD Automation add-in to SOLIDWORKS and the Companion, which starts with Windows and keeps the computer linked.</p>
        {inst?.available ? (
          <>
            <div className="row wrap">
              <a className="btn primary" href={apiHref(v.company.id, '/cad/installer')} download><Icon name="download" size={14} /> Download the installer{inst.size ? ` (${bytes(inst.size)})` : ''}</a>
              {inst.version ? <span className="muted small">Version {inst.version}</span> : null}
            </div>
            {inst.sha256 ? <p className="muted small">SHA-256: <span className="mono">{inst.sha256}</span></p> : null}
            <p className="muted small">Windows may show a warning before it runs the installer. When it finishes, the Companion shows a pairing code: keep it open for the next step.</p>
          </>
        ) : (
          <p className="co-prompt">The installer is not available here yet. Ask BIZOMAT support.</p>
        )}
      </div>
    </Modal>
  );
}

function PairDialog({ v, onClose, onNext, initialCode = '' }: { v: CadView; onClose: () => void; onNext?: () => void; initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [found, setFound] = useState<{ name: string; os: string | null; expiresIn: number } | null>(null);
  const [paired, setPaired] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = useRefresh(v.company.id);
  const clean = code.trim().toUpperCase().slice(0, 20);
  const lookUp = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!clean) return;
    setBusy(true);
    setError('');
    try {
      setFound(await get<{ name: string; os: string | null; expiresIn: number }>(erpPath(v.company.id, `/cad/pairing/${encodeURIComponent(clean)}`)));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (initialCode) void lookUp();
  }, []);
  const approve = async () => {
    setBusy(true);
    setError('');
    try {
      const out = await post<{ name: string }>(erpPath(v.company.id, `/cad/pairing/${encodeURIComponent(clean)}`));
      setPaired(out.name);
      await refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const footer = paired ? (
    <div className="row"><button className="btn ghost" onClick={onClose}>Close</button>{onNext ? <button className="btn primary" onClick={onNext}>Next: connect your AI assistant</button> : null}</div>
  ) : found ? (
    <div className="row"><button className="btn ghost" onClick={() => { setFound(null); setCode(''); }}>Not my computer</button><button className="btn primary" disabled={busy} onClick={() => void approve()}>Add this computer</button></div>
  ) : (
    <div className="row"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" form="cad-pair-form" type="submit" disabled={busy || !clean}>Continue</button></div>
  );
  return (
    <Modal title="Pair a computer" onClose={onClose} footer={footer}>
      <div className="stack">
        {paired ? (
          <p className="co-prompt"><Icon name="check" size={14} /> <strong>{paired}</strong> is paired in {v.company.name}. It shows as online once the Companion connects, within a few seconds.</p>
        ) : found ? (
          <>
            <p>Check that this is the computer showing the code, then add it to <strong>{v.company.name}</strong>.</p>
            <Props items={[['Code', <span className="mt-num">{clean}</span>], ['Computer', found.name], ['System', found.os ?? ''], ['Code expires', `in ${Math.max(1, Math.round(found.expiresIn / 60))} minutes`]]} />
            <p className="muted small">Only you can use it for CAD work; the owner and administrators of {v.company.name} see it and can remove it.</p>
          </>
        ) : (
          <form id="cad-pair-form" className="stack" onSubmit={lookUp}>
            <p>The Companion shows a code when it is installed, or when you choose Pair in its menu (its icon is near the clock).</p>
            <div className="field">
              <label htmlFor="cad-pair-code">The code the Companion shows</label>
              <input id="cad-pair-code" className="input mono" placeholder="ABCD-EFGH" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" maxLength={20} autoFocus />
            </div>
          </form>
        )}
        {error ? <p className="warning-text">{error}</p> : null}
      </div>
    </Modal>
  );
}

function ConnectDialog({ v, onClose, onNext }: { v: CadView; onClose: () => void; onNext?: () => void }) {
  const c = v.cad as Connected;
  const toast = useToast();
  const [app, setApp] = useState<'claude' | 'other'>('claude');
  const qc = useQueryClient();
  const connectedBefore = useMemo(() => new Set(c.assistants.filter((a) => a.mine).map((a) => a.id)), []);
  // Watch for the assistant to arrive while the popup is open (CAD Automation reports it as soon as it signs in).
  useEffect(() => {
    const t = setInterval(() => void qc.invalidateQueries({ queryKey: ['cad', v.company.id] }), 4000);
    return () => clearInterval(t);
  }, [qc, v.company.id]);
  const arrived = c.assistants.find((a) => a.mine && !connectedBefore.has(a.id));
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.connector.url);
      toast('Connector address copied');
    } catch {
      toast('Select the address and copy it', 'error');
    }
  };
  return (
    <Modal title="Connect your AI assistant" onClose={onClose} wide footer={<div className="row"><button className="btn ghost" onClick={onClose}>Close</button>{onNext ? <button className="btn primary" onClick={onNext}>Next: check it works</button> : null}</div>}>
      <div className="stack">
        <div className="field">
          <label htmlFor="cad-connector">Connector address</label>
          <div className="row">
            <input id="cad-connector" className="input grow mono" readOnly value={c.connector.url} onFocus={(e) => e.currentTarget.select()} />
            <button className="btn" onClick={() => void copy()}><Icon name="copy" size={14} /> Copy</button>
          </div>
        </div>
        <nav className="tabs" aria-label="AI app">
          <button className={`tab${app === 'claude' ? ' active' : ''}`} onClick={() => setApp('claude')}>Claude</button>
          <button className={`tab${app === 'other' ? ' active' : ''}`} onClick={() => setApp('other')}>Another AI app</button>
        </nav>
        {app === 'claude' ? (
          <ol className="sys-steps">
            <li>In Claude, open <strong>Settings</strong>, then <strong>Connectors</strong>, and add a custom connector.</li>
            <li>Paste the address above and add it.</li>
            <li>Claude opens a sign-in page: continue with BIZOMAT, choose <strong>{v.company.name}</strong> and allow.</li>
          </ol>
        ) : (
          <ol className="sys-steps">
            <li>In an AI app that supports remote MCP connectors, add a connector with the address above.</li>
            <li>When it asks you to sign in, continue with BIZOMAT, choose <strong>{v.company.name}</strong> and allow.</li>
          </ol>
        )}
        {arrived ? (
          <p className="co-prompt"><Icon name="check" size={14} /> <strong>{arrived.name}</strong> is connected and works in {v.company.name}.</p>
        ) : (
          <p className="muted small"><span className="spinner" aria-hidden /> Waiting for your assistant to connect. This updates by itself.</p>
        )}
      </div>
    </Modal>
  );
}

function CheckDialog({ v, onClose }: { v: CadView; onClose: () => void }) {
  const c = v.cad as Connected;
  const qc = useQueryClient();
  useEffect(() => {
    const t = setInterval(() => void qc.invalidateQueries({ queryKey: ['cad', v.company.id] }), 4000);
    return () => clearInterval(t);
  }, [qc, v.company.id]);
  const mine = c.computers.filter((x) => x.mine);
  const ready = mine.some((pc) => pc.online && (pc.solidworks ?? []).some((i) => i.ready));
  return (
    <Modal title="Check it works" onClose={onClose} footer={<div className="row"><button className="btn primary" onClick={onClose}>Close</button></div>}>
      <div className="stack">
        {!mine.length ? <p>Pair a computer first.</p> : (
          <ul className="erp-list">
            {mine.map((pc) => {
              const sw = (pc.solidworks ?? [])[0];
              return (
                <li key={pc.id}>
                  <strong>{pc.name}</strong>{' '}
                  <span className={`badge ${pc.online ? 'success' : ''}`}>{pc.online ? 'Online' : 'Offline'}</span>{' '}
                  {pc.online ? (sw ? <span className={`badge ${sw.ready ? 'success' : 'warning'}`}>{sw.solidworks}: {sw.ready ? 'Ready' : sw.busy ? 'Busy' : 'Not ready'}</span> : <span className="badge warning">SOLIDWORKS not open</span>) : null}
                </li>
              );
            })}
          </ul>
        )}
        {ready ? (
          <p className="co-prompt"><Icon name="check" size={14} /> Everything is connected. Ask your assistant to run the CAD Automation self test: it builds a plate, some shapes and an assembly in SOLIDWORKS and reports each step.</p>
        ) : (
          <p className="muted small">Start the Companion and open SOLIDWORKS on that computer. This updates by itself.</p>
        )}
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ overview

function Overview({ v }: { v: CadView }) {
  const c = v.cad;
  const id = v.company.id;
  if (!c.connected) return <Limits v={v} />;
  const online = c.computers.filter((x) => x.online).length;
  const recent = c.commands.slice(0, 5);
  const failed = c.commands.filter((x) => ['failed', 'rejected', 'expired', 'unknown'].includes(x.status) && Date.now() - x.updated < 86_400_000).length;
  return (
    <div className="stack">
      <SetupGuide v={v} compact />
      <Notices v={v} />
      {c.unassigned.computers || c.unassigned.assistants ? (
        <section className="co-prompt">
          <p>
            {c.unassigned.computers ? `${c.unassigned.computers} of your computers ${c.unassigned.computers === 1 ? 'is' : 'are'} not in a company yet. ` : ''}
            {c.unassigned.assistants ? `${c.unassigned.assistants} of your AI assistants ${c.unassigned.assistants === 1 ? 'does' : 'do'} not work in a company yet. ` : ''}
            They move into your company once a platform administrator has placed your earlier CAD work, or you choose one for each AI assistant.
          </p>
          {c.unassigned.assistants ? <Link className="btn" to={cadPage(id, '/assistants')}>Choose for AI assistants</Link> : null}
        </section>
      ) : null}
      <div className="erp-stats">
        <Stat label="Computers online" value={`${online} of ${c.computers.length}`} to={cadPage(id, '/computers')} />
        <Stat label="AI assistants" value={String(c.assistants.filter((a) => !a.needsCompany).length)} to={cadPage(id, '/assistants')} />
        <Stat label="Running now" value={`${c.usage.running} of ${v.limits.concurrent}`} to={cadPage(id, '/history')} />
        <Stat label="Failed in the last day" value={String(failed)} to={cadPage(id, '/history?status=failed')} />
      </div>

      <div className="cad-two">
        <TaskBox v={v} />
        <Connection v={v} />
      </div>
      <Section title="Recent work" actions={<Link className="btn ghost sm" to={cadPage(id, '/history')}>All history</Link>}>
        {recent.length ? <CommandTable v={v} commands={recent} /> : <p className="muted">No work yet. Ask your AI assistant to build a part.</p>}
      </Section>
      <Limits v={v} />
    </div>
  );
}

/** Copies a text, with a toast; falls back to asking the person to copy it. */
function useCopy() {
  const toast = useToast();
  return async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${what} copied`);
      return true;
    } catch {
      toast('Select the text and copy it', 'error');
      return false;
    }
  };
}

/** A value to copy; a secret one shows dots until the person chooses Show. */
function CopyField({ id, label, value, secret, hint }: { id: string; label: string; value: string; secret?: boolean; hint?: string }) {
  const [shown, setShown] = useState(!secret);
  const copy = useCopy();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="row">
        <input id={id} className="input grow mono" readOnly type={shown ? 'text' : 'password'} value={value} onFocus={(e) => e.currentTarget.select()} />
        {secret ? <button className="btn" type="button" onClick={() => setShown(!shown)}><Icon name={shown ? 'eyeOff' : 'eye'} size={14} /> {shown ? 'Hide' : 'Show'}</button> : null}
        <button className="btn" type="button" onClick={() => void copy(value, label)}><Icon name="copy" size={14} /> Copy</button>
      </div>
      {hint ? <span className="muted small">{hint}</span> : null}
    </div>
  );
}

/** Home's "Start an engineering task": the task is copied before the AI app opens (CAD Automation runs no AI itself). */
function TaskBox({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  const [task, setTask] = useState('');
  const copy = useCopy();
  const examples = c.examples ?? [];
  const mine = c.assistants.filter((a) => a.mine && !a.needsCompany);
  const open = async (href: string) => {
    if (task.trim()) await copy(task.trim(), 'Task');
    window.open(href, '_blank', 'noopener');
  };
  return (
    <Section title="Start an engineering task">
      <p className="muted small">Describe what you need. CAD Automation works through your AI assistant: copy the task, paste it into a connected assistant, and follow the work in SOLIDWORKS.</p>
      <label className="sr-only" htmlFor="cad-task">Your task</label>
      <textarea id="cad-task" className="input" rows={4} value={task} onChange={(e) => setTask(e.target.value)} placeholder="For example: Make a 60 x 40 x 8 mm mounting plate with four M5 clearance holes, 6 mm in from each corner." />
      {examples.length ? (
        <div className="row wrap" aria-label="Examples">
          {examples.map((g) => <button key={g.group} type="button" className="btn ghost sm" title={g.items[0]} onClick={() => setTask(g.items[0] ?? '')}>{g.group}</button>)}
        </div>
      ) : null}
      <div className="row wrap">
        <button className="btn primary" type="button" disabled={!task.trim()} onClick={() => void copy(task.trim(), 'Task')}><Icon name="copy" size={14} /> Copy task</button>
        <button className="btn" type="button" onClick={() => void open('https://claude.ai/new')}>Open Claude <Icon name="share" size={14} /></button>
        <button className="btn" type="button" onClick={() => void open('https://chatgpt.com/')}>Open ChatGPT <Icon name="share" size={14} /></button>
      </div>
      <p className="muted small">Your task is copied before the assistant opens. Paste it there.</p>
      {!mine.length ? <p className="co-prompt">No AI assistant of yours works in {v.company.name} yet. <Link to={cadPage(v.company.id, '/assistants')}>Connect one first</Link>.</p> : null}
    </Section>
  );
}

/** Home's "Connection": SOLIDWORKS, computers, AI assistants and what is running, for this person. */
function Connection({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  const mine = c.computers.filter((x) => x.mine);
  const online = mine.filter((x) => x.online);
  const ready = online.some((pc) => (pc.solidworks ?? []).some((i) => i.ready));
  const open = online.some((pc) => (pc.solidworks ?? []).length > 0);
  const assistants = c.assistants.filter((a) => a.mine && !a.needsCompany);
  const running = c.commands.filter((x) => x.mine && !FINISHED.has(x.status)).length;
  return (
    <Section title="Your connection">
      <Props items={[
        ['SOLIDWORKS', ready ? <span className="badge success">Ready</span> : open ? <span className="badge warning">Open, not ready</span> : <span className="badge">{online.length ? 'Not running' : 'No computer online'}</span>],
        ['Computers', mine.length ? `${online.length} of ${mine.length} online` : <Link to={cadPage(v.company.id, '/computers')}>Pair a computer</Link>],
        ['AI assistants', assistants.length ? assistants.map((a) => a.name).join(', ') : <Link to={cadPage(v.company.id, '/assistants')}>Connect one</Link>],
        ['Activity', running ? `${running} running` : 'Idle'],
      ]} />
    </Section>
  );
}

function Stat({ label, value, to }: { label: string; value: string; to: string }) {
  return (
    <Link to={to} className="card card-pad erp-stat">
      <span className="muted small">{label}</span>
      <strong className="erp-stat-value">{value}</strong>
    </Link>
  );
}

function Limits({ v }: { v: CadView }) {
  const used = v.cad.connected ? v.cad.usage.storageBytes : null;
  return (
    <Section title="Fair use in this company">
      <p className="muted small">CAD Automation is free. To keep it fast for everyone, each company works within these limits, set by BIZOMAT. Ask a platform administrator if your work needs more.</p>
      <Props
        items={[
          ['Work at the same time', `${v.limits.concurrent} commands`],
          ['Longest command', `${Math.round(v.limits.commandSeconds / 60)} minutes`],
          ['Largest file sent to SOLIDWORKS', `${v.limits.uploadMb} MB`],
          ['Exports kept for download', `${v.limits.storageMb} MB${used !== null ? `, ${bytes(used)} in use` : ''} (each for one hour; save one to a product to keep it)`],
        ]}
      />
    </Section>
  );
}

// ------------------------------------------------------------------ computers

function Computers({ v }: { v: CadView }) {
  const c = v.cad;
  const act = useAction(v.company.id);
  const confirm = useConfirm();
  const [pairing, setPairing] = useState(false);
  if (!c.connected) return null;
  const remove = async (pc: Computer) => {
    if (!(await confirm({ title: `Remove ${pc.name}?`, message: `It stops working with CAD Automation in ${v.company.name}. ${pc.mine ? 'To use it again, pair it again from the Companion.' : 'Its owner can pair it again.'}`, confirmLabel: 'Remove', danger: true }))) return;
    await act(() => post(erpPath(v.company.id, `/cad/computers/${encodeURIComponent(pc.id)}/remove`)), `${pc.name} removed`);
  };
  return (
    <div className="stack">
      {v.perms.operate ? <InstallSection v={v} /> : null}
      <Section title={`Computers in ${v.company.name}`} actions={<div className="row wrap"><span className="muted small">{v.perms.scope === 'all' ? 'Everyone’s computers in the company.' : v.perms.scope === 'team' ? 'Your team’s computers.' : 'Your own computers.'}</span>{v.perms.operate ? <button className="btn primary sm" onClick={() => setPairing(true)}><Icon name="plus" size={14} /> Add a computer</button> : null}</div>}>
        {!c.computers.length ? (
          <EmptyState icon="diamond" title="No computers yet">Install CAD Automation for SOLIDWORKS on a Windows computer, then choose Add a computer and type the code the Companion shows.</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Computer</th><th>Person</th><th>SOLIDWORKS</th><th>Last seen</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {c.computers.map((pc) => (
                  <tr key={pc.id}>
                    <td data-label="Computer">
                      <strong>{pc.name}</strong> {pc.default ? <span className="badge">Default</span> : null}
                      <div><span className={`badge ${pc.online ? (pc.paused ? 'warning' : 'success') : ''}`}>{pc.online ? (pc.paused ? 'Paused' : 'Online') : 'Offline'}</span> <span className="muted small">{[pc.os, pc.companion_version ? `Companion ${pc.companion_version}` : null].filter(Boolean).join(' · ')}</span></div>
                      {pc.note ? <div className="muted small">{pc.note}</div> : null}
                    </td>
                    <td data-label="Person">{who(pc.owner, pc.mine)}</td>
                    <td data-label="SOLIDWORKS">
                      {pc.solidworks?.length ? pc.solidworks.map((i) => (
                        <div key={i.instance_id} className="small">
                          {i.solidworks} <span className={`badge ${i.ready ? 'success' : 'warning'}`}>{i.ready ? 'Ready' : i.busy ? 'Busy' : 'Not ready'}</span>
                          <div className="muted small">{[i.addin_version ? `add-in ${i.addin_version}` : null, `${i.documents_open} open`, i.active_document ? `active: ${i.active_document.split(/[\\/]/).pop()}` : null].filter(Boolean).join(' · ')}</div>
                        </div>
                      )) : <span className="muted small">{pc.online ? 'Not running' : '—'}</span>}
                    </td>
                    <td data-label="Last seen" className="muted small">{pc.online ? 'Now' : pc.last_seen_s ? timeAgo(Date.now() - pc.last_seen_s * 1000) : ''}</td>
                    <td className="erp-actions">
                      {pc.mine && pc.canOperate && !pc.default ? <button className="btn ghost sm" onClick={() => void act(() => post(erpPath(v.company.id, `/cad/computers/${encodeURIComponent(pc.id)}/default`)), `${pc.name} is your default computer`)}>Make default</button> : null}
                      {pc.canRemove ? <button className="btn ghost icon sm" aria-label={`Remove ${pc.name}`} onClick={() => void remove(pc)}><Icon name="trash" size={14} /></button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <HowItConnects v={v} />
      {v.perms.operate ? <DirectLink v={v} /> : null}
      {pairing ? <PairDialog v={v} onClose={() => setPairing(false)} /> : null}
    </div>
  );
}

/** CAD Automation's SOLIDWORKS page: the installer, handed out by the ERP. */
function InstallSection({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  const inst = c.installer;
  return (
    <Section title="Install CAD Automation for SOLIDWORKS">
      <p>One Windows installer adds the add-in to SOLIDWORKS and the Companion, which keeps the computer's secure link. After installing, the Companion shows a pairing code: choose <strong>Add a computer</strong> below and type it.</p>
      {inst?.available ? (
        <div className="row wrap">
          <a className="btn primary" href={apiHref(v.company.id, '/cad/installer')} download><Icon name="download" size={14} /> Download for SOLIDWORKS{inst.size ? ` (${bytes(inst.size)})` : ''}</a>
          {inst.version ? <span className="muted small">Version {inst.version}</span> : null}
          {inst.sha256 ? <span className="muted small">SHA-256 <span className="mono">{inst.sha256.slice(0, 16)}…</span></span> : null}
        </div>
      ) : <p className="co-prompt">The installer is not available here yet. Ask BIZOMAT support.</p>}
      <p className="muted small">Windows 10 or 11, 64-bit. SOLIDWORKS 2022 or later. Early access: the installer is not code-signed yet, so Windows may ask you to confirm it.</p>
    </Section>
  );
}

/** "How CAD Automation connects", as CAD Automation's SOLIDWORKS page explained it. */
function HowItConnects({ v }: { v: CadView }) {
  const rows: [string, ReactNode][] = [
    ['The add-in', 'A native SOLIDWORKS add-in, listed in Tools > Add-Ins, with its own tab, menu and task pane. It runs each command and asks you before destructive changes.'],
    ['The Companion', 'A small Windows tray app. It pairs the computer with your account and keeps an outbound, signed link to CAD Automation. Nothing connects in to your computer.'],
    ['Cloud connection (MCP)', <>Your assistant connects to CAD Automation at the connector address under <Link to={cadPage(v.company.id, '/assistants')}>AI assistants</Link>.</>],
    ['Self-hosted (local MCP)', 'Advanced: run the CAD Automation server on your own Windows computer and connect your assistant to it there.'],
    ['Direct link', 'Without the Companion: one SOLIDWORKS session linked with the service address and your add-in key (below).'],
    ['Launcher macro', 'Not an add-in. It only starts the installed add-in where SOLIDWORKS does not list add-ins installed without administrator rights.'],
  ];
  return (
    <Section title="How CAD Automation connects">
      <div className="crm-table-scroll">
        <table className="data-table responsive">
          <thead><tr><th>Part</th><th>What it is</th></tr></thead>
          <tbody>{rows.map(([k, x]) => <tr key={k}><td data-label="Part"><strong>{k}</strong></td><td data-label="What it is">{x}</td></tr>)}</tbody>
        </table>
      </div>
    </Section>
  );
}

/** "Direct link and manual installation": for development or locked-down computers. */
function DirectLink({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  return (
    <Section title="Direct link and manual installation">
      <p className="muted small">For development or locked-down computers. Most people use the installer above.</p>
      {c.service ? <CopyField id="cad-service" label="Service address" value={c.service} /> : null}
      <p className="small">Your add-in key is under <Link to={cadPage(v.company.id, '/access')}>Access</Link>. In SOLIDWORKS, open the add-in's <strong>Status</strong> window (in its menu) and paste both.</p>
      {c.package ? (
        <div className="row wrap">
          <a className="btn sm" href={apiHref(v.company.id, '/cad/addin-package')} download><Icon name="download" size={14} /> Download the add-in package (.zip)</a>
        </div>
      ) : (
        <p className="muted small">This CAD Automation server has no add-in package for a manual installation. Use the installer above.</p>
      )}
    </Section>
  );
}

// ------------------------------------------------------------------ access (CAD Automation's Settings)

/** The person's own keys: the private connector address and the add-in key, shown on request, made new on request. */
function AccessKeys({ v }: { v: CadView }) {
  const id = v.company.id;
  const confirm = useConfirm();
  const toast = useToast();
  const [keys, setKeys] = useState<Access | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (!v.perms.operate) return <section className="co-prompt"><p>Your role in {v.company.name} cannot use CAD Automation, so it has no keys.</p></section>;
  const load = async () => {
    setBusy(true);
    setError('');
    try {
      setKeys(await get<Access>(erpPath(id, '/cad/access')));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  const renew = async (which: 'private' | 'addin-key') => {
    const ok = await confirm(which === 'private'
      ? { title: 'Make a new private address?', message: 'The old private address stops working at once. AI apps that use it need the new one.', confirmLabel: 'Make a new address', danger: true }
      : { title: 'Make a new add-in key?', message: 'The direct link stops until you paste the new key into the add-in. The Companion is not affected.', confirmLabel: 'Make a new key', danger: true });
    if (!ok) return;
    try {
      const out = await post<Partial<Access>>(erpPath(id, `/cad/access/${which}/new`));
      setKeys((k) => (k ? { ...k, ...out } : k));
      toast(which === 'private' ? 'New private address made' : 'New add-in key made');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <Section title="Your account">
        <p>You use CAD Automation with your BIZOMAT account: the same sign-in as BIZOMAT ERP, and no second password. Change your name, password and two-step sign-in in your profile.</p>
        <div className="row wrap"><a className="btn" href={toolUrl('/tasks/settings/profile')}><Icon name="user" size={14} /> Profile and security</a></div>
      </Section>
      <Section title="Private keys" actions={!keys ? <button className="btn primary sm" disabled={busy} onClick={() => void load()}><Icon name="key" size={14} /> Show my keys</button> : undefined}>
        <p className="muted small">Two private keys give access to your own CAD connection. Keep both to yourself: anyone who has one can use your connection. Nobody else, not even the company owner, sees them here.</p>
        {error ? <p className="warning-text">{error}</p> : null}
        {keys ? (
          <div className="stack">
            <div className="stack">
              <h3 className="crm-subhead">Private connector address</h3>
              <p className="muted small">For AI apps that cannot sign in. It works without sign-in, and in your default company.</p>
              <CopyField id="cad-private" label="Private address" value={keys.privateUrl} secret />
              <div><button className="btn ghost sm danger-text" onClick={() => void renew('private')}>Make a new private address</button></div>
            </div>
            <div className="stack">
              <h3 className="crm-subhead">Add-in key</h3>
              <p className="muted small">Used only by the direct link (SOLIDWORKS without the Companion), with the service address <span className="mono">{keys.service}</span>.</p>
              <CopyField id="cad-addin-key" label="Add-in key" value={keys.addinKey} secret hint="Making a new key disconnects the direct link until you paste the new one." />
              <div><button className="btn ghost sm danger-text" onClick={() => void renew('addin-key')}>Make a new key</button></div>
            </div>
          </div>
        ) : null}
      </Section>
      <p className="muted small">Your AI assistants are under <Link to={cadPage(id, '/assistants')}>AI assistants</Link>, your computers under <Link to={cadPage(id, '/computers')}>Computers</Link>.</p>
    </div>
  );
}

// ------------------------------------------------------------------ people (CAD Automation's Admin, for the company)

/** Who in the company works with CAD Automation: their computers, AI assistants and latest work (owner, administrators
 *  and managers see everyone's; the server decides). People are added and removed in the company's People and roles. */
function People({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  if (!v.cad.connected) return null;
  const key = (p: Person | null, mine: boolean) => (mine ? 'me' : p?.sub ?? p?.email ?? 'unknown');
  const people = new Map<string, { person: Person | null; mine: boolean; computers: Computer[]; assistants: Assistant[]; commands: Command[] }>();
  const at = (p: Person | null, mine: boolean) => {
    const k = key(p, mine);
    if (!people.has(k)) people.set(k, { person: p, mine, computers: [], assistants: [], commands: [] });
    return people.get(k)!;
  };
  c.computers.forEach((x) => at(x.owner, x.mine).computers.push(x));
  c.assistants.forEach((x) => at(x.owner, x.mine).assistants.push(x));
  c.commands.forEach((x) => at(x.owner, x.mine).commands.push(x));
  const rows = [...people.values()].sort((a, b) => Number(b.mine) - Number(a.mine) || (a.person?.name ?? '').localeCompare(b.person?.name ?? ''));
  return (
    <div className="stack">
      <Section title={`People using CAD Automation in ${v.company.name}`} actions={<a className="btn sm" href={toolUrl(`/company/c/${encodeURIComponent(v.company.id)}/people`)}><Icon name="users" size={14} /> People and roles</a>}>
        <p className="muted small">{v.perms.scope === 'all' ? 'Everyone in the company who has paired a computer, connected an AI assistant or sent work.' : 'Your team.'} Add, remove or suspend people, and change their roles, in the company's People and roles: it applies to CAD Automation too.</p>
        {!rows.length ? <EmptyState icon="users" title="Nobody yet">Nobody in {v.company.name} has paired a computer or connected an AI assistant.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Person</th><th>Computers</th><th>AI assistants</th><th>Recent work</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={key(r.person, r.mine)}>
                    <td data-label="Person">{who(r.person, r.mine)}{r.person?.email && !r.mine ? <div className="muted small">{r.person.email}</div> : null}</td>
                    <td data-label="Computers">{r.computers.length ? r.computers.map((pc) => <div key={pc.id} className="small"><span className={`badge ${pc.online ? 'success' : ''}`}>{pc.online ? 'Online' : 'Offline'}</span> {pc.name}</div>) : <span className="muted small">None</span>}</td>
                    <td data-label="AI assistants">{r.assistants.length ? r.assistants.map((a) => <div key={a.id} className="small">{a.name} <span className="muted">{a.lastUsed ? `used ${timeAgo(a.lastUsed)}` : 'not used yet'}</span></div>) : <span className="muted small">None</span>}</td>
                    <td data-label="Recent work">{r.commands.length ? r.commands.slice(0, 3).map((x) => <div key={x.id} className="small">{x.title} <StatusBadge value={x.status} /> <span className="muted">{timeAgo(x.updated)}</span></div>) : <span className="muted small">None yet</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}

function Pair({ v }: { v: CadView }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = (params.get('code') ?? '').trim().toUpperCase().slice(0, 20);
  if (!v.perms.operate) return <section className="co-prompt"><p>Your role in {v.company.name} cannot pair computers. Ask the owner or an administrator.</p></section>;
  // The Companion opens /erp/cad/pair?code=...: the computers list with the pairing popup already filled in.
  return (
    <>
      <Computers v={v} />
      <PairDialog v={v} initialCode={code} onClose={() => navigate(cadPage(v.company.id, '/computers'), { replace: true })} />
    </>
  );
}

// ------------------------------------------------------------------ AI assistants

function Assistants({ v }: { v: CadView }) {
  const c = v.cad;
  const act = useAction(v.company.id);
  const confirm = useConfirm();
  const toast = useToast();
  const [connecting, setConnecting] = useState(false);
  if (!c.connected) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.connector.url);
      toast('Connector address copied');
    } catch {
      toast('Select the address and copy it', 'error');
    }
  };
  const disconnect = async (a: Assistant) => {
    if (!(await confirm({ title: `Disconnect ${a.name}?`, message: `It can no longer work in SOLIDWORKS through CAD Automation. ${a.mine ? 'Connect it again from the AI app to use it.' : 'Its owner can connect it again.'}`, confirmLabel: 'Disconnect', danger: true }))) return;
    await act(() => post(erpPath(v.company.id, `/cad/assistants/${encodeURIComponent(a.id)}/remove`)), `${a.name} disconnected`);
  };
  return (
    <div className="stack">
      <Section title="Connect an AI assistant" actions={v.perms.operate ? <button className="btn primary sm" onClick={() => setConnecting(true)}>Connect and wait for it</button> : undefined}>
        <p>Use Claude, ChatGPT or another AI assistant. CAD Automation gives it the SOLIDWORKS tools, checks every sketch and feature, and runs the work on your computer; it runs no AI of its own. Add this address to your assistant once, then sign in when it asks: continue with BIZOMAT and choose <strong>{v.company.name}</strong>, so the assistant works with this company’s computers only.</p>
        <div className="row wrap">
          <input className="input grow mono" readOnly value={c.connector.url} aria-label="Connector address" onFocus={(e) => e.currentTarget.select()} />
          <button className="btn" onClick={() => void copy()}><Icon name="copy" size={14} /> Copy</button>
        </div>
        <ConnectSteps companyName={v.company.name} />
        <p className="muted small">An AI app that cannot sign in can use your private connector address instead, under <Link to={cadPage(v.company.id, '/access')}>Access</Link>.</p>
      </Section>
      <Section title="Connected AI assistants">
        {!c.assistants.length ? (
          <p className="muted">No AI assistant works in {v.company.name} yet.</p>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Assistant</th><th>Person</th><th>Connected</th><th>Last used</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {c.assistants.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Assistant"><strong>{a.name}</strong> <span className="muted small">{a.host}</span>{a.needsCompany ? <div><span className="badge warning">No company yet</span></div> : null}</td>
                    <td data-label="Person">{who(a.owner, a.mine)}</td>
                    <td data-label="Connected" className="muted small">{timeAgo(a.created)}</td>
                    <td data-label="Last used" className="muted small">{a.lastUsed ? timeAgo(a.lastUsed) : 'Not yet'}</td>
                    <td className="erp-actions">
                      {a.needsCompany && a.mine && v.perms.operate ? <button className="btn sm" onClick={() => void act(() => post(erpPath(v.company.id, `/cad/assistants/${encodeURIComponent(a.id)}/assign`)), `${a.name} now works in ${v.company.name}`)}>Use in {v.company.name}</button> : null}
                      {a.mine || v.perms.delete ? <button className="btn ghost sm" onClick={() => void disconnect(a)}>Disconnect</button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <AskExamples v={v} />
      <Section title="Check it works">
        <CopyPrompt text="Check the CAD Automation connection to SOLIDWORKS." />
        <CopyPrompt text="Run the SOLIDWORKS self test, all three stages." />
        <ul className="erp-list small">
          <li>The assistant builds in small checked steps and reads your file before it changes it.</li>
          <li>Deleting, undoing and overwriting ask you in SOLIDWORKS first (on by default).</li>
          <li>Your model files stay on your computer.</li>
        </ul>
      </Section>
      {connecting ? <ConnectDialog v={v} onClose={() => setConnecting(false)} /> : null}
    </div>
  );
}

/** How to add the connector, app by app (CAD Automation's CAD Assistant page). */
function ConnectSteps({ companyName }: { companyName: string }) {
  const [app, setApp] = useState<'claude' | 'chatgpt' | 'other'>('claude');
  return (
    <div className="stack">
      <nav className="tabs" aria-label="Instructions for your AI app">
        <button type="button" className={`tab${app === 'claude' ? ' active' : ''}`} onClick={() => setApp('claude')}>Claude</button>
        <button type="button" className={`tab${app === 'chatgpt' ? ' active' : ''}`} onClick={() => setApp('chatgpt')}>ChatGPT</button>
        <button type="button" className={`tab${app === 'other' ? ' active' : ''}`} onClick={() => setApp('other')}>Other assistants</button>
      </nav>
      {app === 'claude' ? (
        <ol className="sys-steps">
          <li>In Claude, open <strong>Settings</strong>, then <strong>Connectors</strong>, and choose <strong>Add custom connector</strong>.</li>
          <li>Name it BIZOMAT CAD Automation and paste the connector address.</li>
          <li>Choose Connect. Claude opens a sign-in page: continue with BIZOMAT, choose <strong>{companyName}</strong> and allow.</li>
        </ol>
      ) : app === 'chatgpt' ? (
        <ol className="sys-steps">
          <li>Where your ChatGPT plan allows custom connectors, add a new connector.</li>
          <li>Paste the connector address.</li>
          <li>Sign in when asked: continue with BIZOMAT, choose <strong>{companyName}</strong> and allow. Your workspace administrator may need to allow custom connectors first.</li>
        </ol>
      ) : (
        <ol className="sys-steps">
          <li>Any app that supports remote MCP servers over Streamable HTTP can use the connector address.</li>
          <li>When it asks you to sign in, continue with BIZOMAT, choose <strong>{companyName}</strong> and allow.</li>
        </ol>
      )}
    </div>
  );
}

/** A request to copy for the AI assistant. */
function CopyPrompt({ text }: { text: string }) {
  const copy = useCopy();
  return (
    <div className="row cad-prompt">
      <span className="grow">{text}</span>
      <button type="button" className="btn sm" onClick={() => void copy(text, 'Request')}><Icon name="copy" size={14} /> Copy</button>
    </div>
  );
}

/** "What you can ask": plain requests, by kind of work (CAD Automation's catalog, sent with its state). */
function AskExamples({ v }: { v: CadView }) {
  const c = v.cad as Connected;
  const examples = c.examples ?? [];
  if (!examples.length) return null;
  return (
    <Section title="What you can ask">
      <p className="muted small">Plain requests work. Copy one to try it, or describe your own task on the <Link to={cadPage(v.company.id)}>Overview</Link>. Everything the assistant can do is under <Link to={cadPage(v.company.id, '/tools')}>Tools</Link>.</p>
      <div className="cad-examples">
        {examples.map((g) => (
          <div key={g.group} className="stack">
            <h3 className="crm-subhead">{g.group}</h3>
            {g.items.map((t) => <CopyPrompt key={t} text={t} />)}
          </div>
        ))}
      </div>
    </Section>
  );
}

// ------------------------------------------------------------------ history

function CommandTable({ v, commands, onOpen }: { v: CadView; commands: Command[]; onOpen?: (id: string) => void }) {
  return (
    <div className="crm-table-scroll">
      <table className="data-table responsive">
        <thead><tr><th>Work</th><th>Status</th><th>Computer</th><th>Person</th><th>When</th></tr></thead>
        <tbody>
          {commands.map((x) => (
            <tr key={x.id}>
              <td data-label="Work">
                {onOpen ? <button className="btn-link" onClick={() => onOpen(x.id)}>{x.title || x.tool}</button> : <Link to={cadPage(v.company.id, `/history?command=${encodeURIComponent(x.id)}`)}>{x.title || x.tool}</Link>}
                {x.app ? <div className="muted small">from {x.app}</div> : null}
              </td>
              <td data-label="Status"><StatusBadge value={x.status} />{x.error?.message ? <div className="muted small">{x.error.message}</div> : null}</td>
              <td data-label="Computer">{x.device ?? ''}</td>
              <td data-label="Person">{who(x.owner, x.mine)}</td>
              <td data-label="When" className="muted small">{timeAgo(x.created)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function History({ v }: { v: CadView }) {
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? '';
  const open = params.get('command');
  const c = v.cad;
  const list = useMemo(() => {
    if (!c.connected) return [];
    if (status === 'failed') return c.commands.filter((x) => ['failed', 'rejected', 'expired', 'unknown', 'denied'].includes(x.status));
    if (status === 'running') return c.commands.filter((x) => !FINISHED.has(x.status));
    if (status === 'done') return c.commands.filter((x) => x.status === 'succeeded');
    return c.commands;
  }, [c, status]);
  if (!c.connected) return null;
  const set = (k: string, val: string | null) => setParams((ps) => { const n = new URLSearchParams(ps); if (val) n.set(k, val); else n.delete(k); return n; }, { replace: true });
  return (
    <div className="stack">
      <Section
        title="History"
        actions={
          <nav className="tabs" aria-label="Filter the history">
            {[['', 'All'], ['running', 'Running'], ['done', 'Done'], ['failed', 'Failed']].map(([k, label]) => (
              <button key={k} className={`tab${status === k ? ' active' : ''}`} aria-current={status === k ? 'page' : undefined} onClick={() => set('status', k || null)}>{label}</button>
            ))}
          </nav>
        }
      >
        <p className="muted small">The last 100 commands your AI assistants and the ERP sent to computers in {v.company.name}{v.perms.scope === 'all' ? '' : ' that you can see'}. Work done over the direct link of older add-ins is not recorded.</p>
        {list.length ? <CommandTable v={v} commands={list} onOpen={(id) => set('command', id)} /> : <p className="muted">Nothing here.</p>}
      </Section>
      {open ? <CommandDialog v={v} id={open} onClose={() => set('command', null)} /> : null}
    </div>
  );
}

function CommandDialog({ v, id, onClose }: { v: CadView; id: string; onClose: () => void }) {
  const q = useQuery({ queryKey: ['cad', v.company.id, 'command', id], queryFn: () => get<{ command: Command }>(erpPath(v.company.id, `/cad/commands/${encodeURIComponent(id)}`)), retry: false, refetchInterval: (query) => (query.state.data && FINISHED.has(query.state.data.command.status) ? false : 3000) });
  const act = useAction(v.company.id);
  const x = q.data?.command;
  const canCancel = x && !FINISHED.has(x.status) && (v.perms.operate === 'all' || (v.perms.operate === 'own' && x.mine));
  return (
    <Modal title={x ? x.title || x.tool : 'Command'} onClose={onClose} wide footer={<div className="row">{canCancel ? <button className="btn danger" onClick={() => void act(() => post(erpPath(v.company.id, `/cad/commands/${encodeURIComponent(id)}/cancel`)), 'Cancel sent')}>Cancel it</button> : null}<button className="btn" onClick={onClose}>Close</button></div>}>
      {q.error ? <ErrorBox error={q.error} /> : !x ? <Loading /> : (
        <div className="stack">
          <Props items={[['Status', <StatusBadge value={x.status} />], ['Tool', x.tool], ['Computer', x.device ?? ''], ['Person', who(x.owner, x.mine)], ['From', x.app ?? ''], ['Started', new Date(x.created).toLocaleString('en-AU')], ['Last change', new Date(x.updated).toLocaleString('en-AU')]]} />
          {x.error?.message ? <p className="co-prompt">{x.error.message}</p> : null}
          {x.history?.length ? (
            <ol className="mt-history">
              {x.history.map((h, i) => <li key={i}><strong>{STATUS[h.status]?.[0] ?? h.status}</strong> <span className="muted small">{new Date(h.at).toLocaleTimeString('en-AU')}{h.hop ? ` · ${h.hop}` : ''}{h.note ? ` · ${h.note}` : ''}</span></li>)}
            </ol>
          ) : null}
        </div>
      )}
    </Modal>
  );
}

// ------------------------------------------------------------------ exports

function Exports({ v }: { v: CadView }) {
  const c = v.cad;
  const [saving, setSaving] = useState<Export | null>(null);
  if (!c.connected) return null;
  const canSave = v.flags.products && v.perms.export && v.erp.documentsEdit;
  return (
    <div className="stack">
      <Section title="Exports">
        <p className="muted small">Files your AI assistant exported from SOLIDWORKS (STEP, PDF, DXF, DWG, images). Each can be downloaded for one hour.{v.flags.products ? ' Save one to a product to keep it as an engineering document.' : ''}{!v.perms.export ? ' Your role cannot download CAD files in this company.' : ' Every download is recorded in the company’s history.'}</p>
        {!c.exports.length ? <p className="muted">No exports in the last hour.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>File</th><th>Person</th><th>Size</th><th>Expires</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {c.exports.map((x) => (
                  <tr key={x.id}>
                    <td data-label="File"><strong>{x.name}</strong> <span className="badge">{(x.format ?? '').toUpperCase()}</span></td>
                    <td data-label="Person">{who(x.owner, x.mine)}</td>
                    <td data-label="Size">{bytes(x.size)}</td>
                    <td data-label="Expires" className="muted small">{x.expires > Date.now() ? `in ${Math.max(1, Math.round((x.expires - Date.now()) / 60000))} min` : 'Expired'}</td>
                    <td className="erp-actions">
                      {v.perms.export ? <a className="btn ghost sm" href={apiHref(v.company.id, `/cad/exports/${encodeURIComponent(x.id)}/file`)}><Icon name="download" size={14} /> Download</a> : null}
                      {canSave ? <button className="btn sm" onClick={() => setSaving(x)}>Save to a product</button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      {saving ? <SaveExportDialog v={v} exp={saving} onClose={() => setSaving(null)} /> : null}
    </div>
  );
}

function kindOf(format: string | null): string {
  const f = (format ?? '').toLowerCase();
  return f === 'pdf' || f === 'dwg' ? 'drawing' : f === 'dxf' ? 'dxf' : f === 'step' || f === 'stp' ? 'step' : f === 'png' || f === 'jpg' ? 'image' : 'other';
}

function SaveExportDialog({ v, exp, onClose }: { v: CadView; exp: Export; onClose: () => void }) {
  const [product, setProduct] = useState<PickedProduct | null>(null);
  const [revisionId, setRevisionId] = useState('');
  const [title, setTitle] = useState((exp.name ?? '').replace(/\.[^.]+$/, ''));
  const [docRevision, setDocRevision] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pv = useQuery({ queryKey: ['erp', v.company.id, 'product', product?.id], queryFn: () => get<ProductView>(erpPath(v.company.id, `/products/${product!.id}`)), enabled: !!product });
  useEffect(() => {
    const open = pv.data?.revisions.find((r) => r.status === 'draft' || r.status === 'in_change') ?? pv.data?.revisions.find((r) => r.status === 'released');
    setRevisionId(open?.id ?? '');
  }, [pv.data]);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setBusy(true);
    try {
      const d = await post<{ id: string; number: string }>(erpPath(v.company.id, `/cad/exports/${encodeURIComponent(exp.id)}/save`), { productId: product.id, revisionId: revisionId || null, title: title.trim() || undefined, kind: kindOf(exp.format), docRevision: docRevision.trim() || undefined });
      toast(`Saved as ${d.number}, a draft document`);
      await qc.invalidateQueries({ queryKey: ['erp', v.company.id] });
      onClose();
      navigate(productsPage(v.company.id, `/documents/${d.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Save ${exp.name} to a product`} onClose={onClose} footer={<div className="row"><button className="btn ghost" onClick={onClose}>Cancel</button><button className="btn primary" form="cad-save" type="submit" disabled={!product || busy}>Save as a document</button></div>}>
      <form id="cad-save" className="stack" onSubmit={save}>
        <ProductPicker companyId={v.company.id} id="cad-save-p" label="Product" value={product} onChange={setProduct} />
        {pv.data ? (
          <div className="field">
            <label htmlFor="cad-save-r">Product revision</label>
            <select id="cad-save-r" className="select" value={revisionId} onChange={(e) => setRevisionId(e.target.value)}>
              <option value="">Not tied to a revision</option>
              {pv.data.revisions.map((r) => <option key={r.id} value={r.id}>Revision {r.label}: {r.status === 'in_change' ? 'in a change order' : r.status}</option>)}
            </select>
          </div>
        ) : null}
        <div className="field"><label htmlFor="cad-save-t">Title</label><input id="cad-save-t" className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} /></div>
        <div className="field"><label htmlFor="cad-save-dr">Document revision (optional)</label><input id="cad-save-dr" className="input" value={docRevision} onChange={(e) => setDocRevision(e.target.value)} maxLength={20} placeholder="A" /></div>
        <p className="muted small">It becomes a draft engineering document with this file as its first version, and the ERP records where it came from. Approve it in Documents before it is used for manufacturing or quality.</p>
      </form>
    </Modal>
  );
}

// ------------------------------------------------------------------ tools and setup

function Tools({ v }: { v: CadView }) {
  const [q, setQ] = useState('');
  const c = v.cad;
  if (!c.connected) return null;
  const s = q.trim().toLowerCase();
  const groups = c.tools.map((g) => ({ ...g, tools: g.tools.filter((t) => !s || `${t.title} ${t.summary} ${t.name}`.toLowerCase().includes(s)) })).filter((g) => g.tools.length);
  return (
    <Section title="What your AI assistant can do" actions={<input className="input" type="search" placeholder="Search the tools" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the tools" />}>
      <p className="muted small">Ask in plain words; the assistant picks the tools. Every change is a native SOLIDWORKS feature, checked before it is sent.</p>
      {groups.map((g) => (
        <div key={g.group} className="stack">
          <h3 className="crm-subhead">{g.group}</h3>
          <ul className="erp-list">
            {g.tools.map((t) => <li key={t.name}><strong>{t.title}</strong> <span className="muted small">{t.summary}</span></li>)}
          </ul>
        </div>
      ))}
      {!groups.length ? <p className="muted">No tool matches.</p> : null}
    </Section>
  );
}

function Setup({ v }: { v: CadView }) {
  const id = v.company.id;
  const settings = useQuery({ queryKey: ['cad', id, 'settings'], queryFn: () => get<{ download: { manager: boolean; employee: boolean }; canChange: boolean }>(erpPath(id, '/cad/settings')) });
  const act = useAction(id);
  return (
    <div className="stack">
      <SetupGuide v={v} />
      <Section title="Who may download CAD files">
        {settings.error ? <ErrorBox error={settings.error} /> : !settings.data ? <Loading /> : (
          <div className="stack">
            <p className="muted small">The owner and administrators always may. Downloads take files out of the ERP; each one is recorded.</p>
            {(['manager', 'employee'] as const).map((k) => (
              <label key={k} className="row">
                <input
                  type="checkbox"
                  checked={settings.data!.download[k]}
                  disabled={!settings.data!.canChange}
                  onChange={(e) => void act(async () => {
                    await put(erpPath(id, '/cad/settings'), { download: { ...settings.data!.download, [k]: e.target.checked } });
                    await settings.refetch();
                  }, 'Saved')}
                />
                {k === 'manager' ? 'Managers may download' : 'Employees may download their own exports'}
              </label>
            ))}
            {!settings.data.canChange ? <p className="muted small">Only the owner and administrators can change this.</p> : null}
          </div>
        )}
      </Section>
      <Limits v={v} />
    </div>
  );
}

// ------------------------------------------------------------------ on a product revision (bill of materials proposals)

interface ProposalLine { name: string; file: string; quantity: number; productId: string | null; productNumber: string | null }
interface Proposal { id: string; revisionId: string; commandId: string; assembly: string; lines: ProposalLine[]; status: 'proposed' | 'applied' | 'rejected'; note: string | null; createdByName: string | null; createdAt: number; decidedByName: string | null; decidedAt: number | null }

/** On a product's bill of materials: read the open assembly in SOLIDWORKS, propose lines, apply them to a draft. */
export function RevisionCadPanel({ companyId, revisionId, editable }: { companyId: string; revisionId: string; editable: boolean }) {
  const view = useCadFlags(companyId);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [reading, setReading] = useState<string | null>(null);
  const list = useQuery({ queryKey: ['cad', companyId, 'proposals', revisionId], queryFn: () => get<{ proposals: Proposal[] }>(erpPath(companyId, `/cad/bom-proposals?revisionId=${encodeURIComponent(revisionId)}`)), enabled: !!view.data?.flags.bom });
  const cmd = useQuery({
    queryKey: ['cad', companyId, 'command', reading],
    queryFn: () => get<{ command: Command }>(erpPath(companyId, `/cad/commands/${encodeURIComponent(reading!)}`)),
    enabled: !!reading,
    retry: 3,
    refetchInterval: (query) => (query.state.data && FINISHED.has(query.state.data.command.status) ? false : 2000),
  });
  const status = cmd.data?.command.status;
  useEffect(() => {
    if (!reading || !status || !FINISHED.has(status)) return;
    const id = reading;
    setReading(null);
    if (status !== 'succeeded') {
      toast(cmd.data?.command.error?.message ?? 'SOLIDWORKS could not read the assembly.', 'error');
      return;
    }
    post(erpPath(companyId, '/cad/bom-proposals'), { commandId: id, revisionId })
      .then(() => list.refetch())
      .catch((err) => toast(errorMessage(err), 'error'));
  }, [status, reading]);
  if (!view.data || !view.data.flags.bom) return null;
  const v = view.data;
  const read = async () => {
    try {
      const out = await post<{ commandId: string }>(erpPath(companyId, '/cad/assembly/read'), {});
      setReading(out.commandId);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const decide = async (p: Proposal, what: 'apply' | 'reject') => {
    if (what === 'apply' && !(await confirm({ title: 'Apply this proposal?', message: `${p.lines.filter((l) => l.productId).length} lines with a matching product are added to this revision, or their quantities set. ${p.lines.filter((l) => !l.productId).length ? 'Lines without a matching product are left out.' : ''}`, confirmLabel: 'Apply' }))) return;
    try {
      await post(erpPath(companyId, `/cad/bom-proposals/${p.id}/${what}`), {});
      toast(what === 'apply' ? 'Applied to the bill of materials' : 'Proposal rejected');
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      await list.refetch();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const canRead = editable && v.erp.productsEdit && !!v.perms.operate;
  return (
    <Section title="From SOLIDWORKS" actions={canRead ? <button className="btn sm" disabled={!!reading} onClick={() => void read()}><Icon name="refresh" size={14} /> {reading ? 'Reading the assembly…' : 'Read the open assembly'}</button> : undefined}>
      <p className="muted small">CAD Automation reads the assembly open in SOLIDWORKS on your default computer and proposes its parts as lines, matched to products by number, then by name. Nothing changes until someone applies the proposal, and only a draft revision or one in a change order can change. Materials and sub-assembly structure are not read.</p>
      {!editable ? <p className="muted small"><Icon name="lock" size={14} /> This revision is locked; proposals can be applied to a draft only.</p> : null}
      {list.data?.proposals.length ? list.data.proposals.map((p) => (
        <div key={p.id} className="card card-pad stack">
          <div className="row wrap">
            <strong className="grow">{p.assembly || 'Assembly'}</strong>
            <span className={`badge ${p.status === 'applied' ? 'success' : p.status === 'rejected' ? '' : 'warning'}`}>{p.status === 'proposed' ? 'Proposed' : p.status === 'applied' ? 'Applied' : 'Rejected'}</span>
            <span className="muted small">{p.createdByName ?? ''} · {timeAgo(p.createdAt)}</span>
          </div>
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Part in SOLIDWORKS</th><th className="num">Quantity</th><th>Product</th></tr></thead>
              <tbody>
                {p.lines.map((l) => (
                  <tr key={l.name}>
                    <td data-label="Part">{l.name}<div className="muted small">{l.file.split(/[\\/]/).pop()}</div></td>
                    <td data-label="Quantity" className="num">{l.quantity}</td>
                    <td data-label="Product">{l.productId ? <Link to={productsPage(companyId, `/${l.productId}`)}>{l.productNumber}</Link> : <span className="badge warning">No matching product</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {p.note ? <p className="muted small">{p.note}</p> : null}
          {p.status === 'proposed' && editable && v.erp.productsEdit ? (
            <div className="row wrap">
              <button className="btn primary sm" disabled={!p.lines.some((l) => l.productId)} onClick={() => void decide(p, 'apply')}>Apply to this revision</button>
              <button className="btn ghost sm" onClick={() => void decide(p, 'reject')}>Reject</button>
            </div>
          ) : null}
        </div>
      )) : <p className="muted">No proposals for this revision yet.</p>}
    </Section>
  );
}

// ------------------------------------------------------------------ where the work is done (drawings)

interface Drawing { documentId: string; number: string; title: string; kind: string; versionId: string; version: number; docRevision: string; fileName: string; size: number; approvedAt: number | null; fromCad: boolean }

/** The approved drawings of the revision a manufacturing order, NCR or inspection plan is for (flags cad_manufacturing
 * and cad_quality); nothing at all while the flag is off. */
export function RecordDrawings({ companyId, kind, id }: { companyId: string; kind: 'mos' | 'ncrs' | 'qc-plans'; id: string }) {
  const q = useQuery({ queryKey: ['cad', companyId, 'drawings', kind, id], queryFn: () => get<{ enabled: boolean; revision: { id: string; label: string; status: string; productNumber: string } | null; drawings: Drawing[] }>(erpPath(companyId, `/${kind}/${encodeURIComponent(id)}/drawings`)), retry: false, staleTime: 60_000 });
  if (!q.data?.enabled) return null;
  const d = q.data;
  return (
    <Section title="Drawings">
      {!d.revision ? <p className="muted small">No product revision to show drawings for.</p> : (
        <>
          <p className="muted small">Approved drawings of {d.revision.productNumber} revision {d.revision.label}, the revision this {kind === 'mos' ? 'order builds' : kind === 'ncrs' ? 'report is about' : 'plan inspects'}.</p>
          {!d.drawings.length ? <p className="muted">No approved drawing for this revision yet.</p> : (
            <ul className="erp-list">
              {d.drawings.map((x) => (
                <li key={x.versionId}>
                  <a href={apiHref(companyId, `/${kind}/${encodeURIComponent(id)}/drawings/${encodeURIComponent(x.versionId)}/file`)} target="_blank" rel="noopener"><span className="mt-num">{x.number}</span> {x.title}</a>{' '}
                  <span className="muted small">{x.fileName} · version {x.version}{x.docRevision ? ` (${x.docRevision})` : ''}{x.fromCad ? ' · from CAD Automation' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Section>
  );
}

// ------------------------------------------------------------------ review tasks in Projects

/** On an engineering document: ask for a review as a task on a Project Management board (flag cad_projects). */
export function ReviewTaskButton({ companyId, documentId }: { companyId: string; documentId: string }) {
  const q = useQuery({ queryKey: ['cad', companyId, 'review-boards'], queryFn: () => get<{ enabled: boolean; boards: { id: string; name: string }[] }>(erpPath(companyId, '/cad/review-boards')), retry: false, staleTime: 60_000 });
  const [open, setOpen] = useState(false);
  const [boardId, setBoardId] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [note, setNote] = useState('');
  const toast = useToast();
  const people = useQuery({
    queryKey: ['cad', companyId, 'review-boards', boardId, 'reviewers'],
    queryFn: () => get<{ reviewers: { id: string; name: string }[]; assigns: boolean }>(erpPath(companyId, `/cad/review-boards/${encodeURIComponent(boardId)}/reviewers`)),
    enabled: open && !!boardId,
    retry: false,
    staleTime: 60_000,
  });
  if (!q.data?.enabled) return null;
  const send = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const r = await post<{ assigned: boolean }>(erpPath(companyId, `/cad/documents/${encodeURIComponent(documentId)}/review`), { boardId, reviewerId: reviewerId || undefined, note: note.trim() || undefined });
      toast(reviewerId ? (r.assigned ? 'Review task added in Projects and given to the reviewer' : 'Review task added in Projects; the reviewer is told') : 'Review task added in Projects');
      setOpen(false);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <>
      <button className="btn" onClick={() => { setBoardId(q.data!.boards[0]?.id ?? ''); setOpen(true); }}><Icon name="checkSquare" /> Ask for a review</button>
      {open ? (
        <Modal title="Ask for a review in Projects" onClose={() => setOpen(false)} footer={<div className="row"><button className="btn ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn primary" form="cad-review" type="submit" disabled={!boardId}>Add the task</button></div>}>
          {!q.data.boards.length ? <p className="muted">You have no board in this company’s Project Management workspaces that you can add tasks to.</p> : (
            <form id="cad-review" className="stack" onSubmit={send}>
              <div className="field">
                <label htmlFor="cad-board">Board</label>
                <select id="cad-board" className="select" value={boardId} onChange={(e) => { setBoardId(e.target.value); setReviewerId(''); }}>
                  {q.data.boards.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="cad-reviewer">Reviewer (optional)</label>
                <select id="cad-reviewer" className="select" value={reviewerId} onChange={(e) => setReviewerId(e.target.value)} disabled={!people.data}>
                  <option value="">Nobody yet</option>
                  {(people.data?.reviewers ?? []).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <span className="muted small">
                  {people.data && !people.data.assigns
                    ? 'This board has no People column, so the task is not given to them; they are told in CAD Automation, and by email where email is set up.'
                    : 'Only people in this company who can open the board. The task is given to them, and they are told.'}
                </span>
              </div>
              <div className="field"><label htmlFor="cad-note">Note (optional)</label><textarea id="cad-note" className="input" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
              <p className="muted small">The task links back to this document. Set a date on the board.</p>
            </form>
          )}
        </Modal>
      ) : null}
    </>
  );
}
