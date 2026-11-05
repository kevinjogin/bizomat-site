import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, del, errorMessage, get, patch, post } from '../lib/api';
import { isAdmin, useWorkspace } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Field, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { useBoards } from '../components/layout/CreateDialogs';
import '../styles/admin.css';

interface Provider {
  id: string;
  name: string;
  category: string;
  description: string;
  availability: 'available' | 'requires_setup';
  setupNote?: string;
  fields: { key: string; label: string; secret?: boolean; placeholder?: string }[];
}

interface Integration {
  id: string;
  provider: string;
  name: string;
  boardId: string | null;
  status: 'pending' | 'connected' | 'error' | 'disabled';
  events: string[];
  endpointHint: string | null;
  hasSigningSecret: boolean;
  lastStatus: string | null;
  lastError: string | null;
  lastDeliveryAt: number | null;
  createdAt: number;
  signingSecret?: string;
}

const PROVIDER_ICON: Record<string, string> = { webhook: 'link', slack: 'message', teams: 'message', google_drive: 'folder', google_calendar: 'calendar', gmail: 'inbox', github: 'code' };

const EVENT_LABELS: Record<string, string> = {
  'item.created': 'Item created',
  'item.updated': 'Item updated',
  'item.moved': 'Item moved',
  'update.posted': 'Update posted',
  'automation.triggered': 'Automation action (send webhook)',
  test: 'Test deliveries',
};

function StatusBadge({ i }: { i: Integration }) {
  if (i.status === 'connected') return <span className="badge success">Connected</span>;
  if (i.status === 'disabled') return <span className="badge">Disabled</span>;
  if (i.status === 'error') return <span className="badge danger" title={i.lastError ?? ''}>Delivery failing</span>;
  return <span className="badge warning">Not verified — send a test</span>;
}

export default function Integrations() {
  const ws = useWorkspace();
  const admin = isAdmin(ws.role);
  const providers = useQuery({ queryKey: ['integration-providers'], queryFn: () => get<{ providers: Provider[]; events: string[] }>('/integrations/providers'), staleTime: Infinity });
  const list = useQuery({ queryKey: ['integrations', ws.id], queryFn: () => get<Integration[]>(`/workspaces/${ws.id}/integrations`) });
  const boards = useBoards(ws.id);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [connecting, setConnecting] = useState<Provider | null>(null);
  const [deliveries, setDeliveries] = useState<Integration | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ['integrations', ws.id] });

  const test = async (i: Integration) => {
    try {
      const r = await api<{ ok: boolean; status?: number; error?: string }>(`/integrations/${i.id}/test`, { method: 'POST', body: {}, allowStatuses: [502] });
      toast(r.ok ? `Test delivered (HTTP ${r.status})` : `Test failed: ${r.error}`, r.ok ? 'info' : 'error');
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
    refresh();
  };
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      refresh();
      toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  if (providers.isLoading || list.isLoading) return <Loading />;
  const boardName = (id: string | null) => (id ? boards.data?.find((b) => b.id === id)?.name ?? 'a board' : 'All boards');

  return (
    <div className="page">
      <PageHeader icon="plug" title="Integrations" subtitle="Connect WorkOS to the tools your team already uses. An integration is shown as connected only after a real delivery succeeds." />
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!admin ? <div className="info-box" style={{ marginBottom: 16 }}>Only workspace admins can add or change integrations.</div> : null}

      <section style={{ marginBottom: 24 }} aria-labelledby="connected-h">
        <h2 id="connected-h" style={{ marginBottom: 10 }}>Your integrations</h2>
        {list.data && list.data.length === 0 ? (
          <div className="card"><EmptyState icon="plug" title="No integrations yet">Add a webhook, Slack or Teams connection below.</EmptyState></div>
        ) : (
          <div className="card">
            {(list.data ?? []).map((i) => (
              <div key={i.id} className="list-row" style={{ flexWrap: 'wrap' }}>
                <Icon name={PROVIDER_ICON[i.provider] ?? 'plug'} />
                <span className="grow" style={{ minWidth: 200 }}>
                  <strong>{i.name}</strong> <StatusBadge i={i} />
                  <div className="muted small">
                    {providers.data?.providers.find((p) => p.id === i.provider)?.name ?? i.provider} · {i.endpointHint ?? ''} · {boardName(i.boardId)} · {i.events.map((e) => EVENT_LABELS[e] ?? e).join(', ')}
                  </div>
                  <div className="muted small">
                    {i.lastDeliveryAt ? `Last delivery ${timeAgo(i.lastDeliveryAt)}: ${i.lastStatus}${i.lastError ? ` (${i.lastError})` : ''}` : 'No deliveries yet'}
                  </div>
                </span>
                {admin ? (
                  <div className="row wrap">
                    <button className="btn sm" onClick={() => test(i)} disabled={i.status === 'disabled'}><Icon name="play" size={13} /> Send test</button>
                    <button className="btn sm" onClick={() => setDeliveries(i)}>Deliveries</button>
                    <button className="btn sm" onClick={() => act(() => patch(`/integrations/${i.id}`, { enabled: i.status === 'disabled' }), i.status === 'disabled' ? 'Integration enabled' : 'Integration disabled')}>
                      {i.status === 'disabled' ? 'Enable' : 'Disable'}
                    </button>
                    <button
                      className="btn ghost icon sm"
                      aria-label={`Delete ${i.name}`}
                      onClick={async () => {
                        if (await confirm({ title: `Delete ${i.name}?`, message: 'Automations that send to this integration will start failing.', danger: true, confirmLabel: 'Delete' })) act(() => del(`/integrations/${i.id}`), 'Integration deleted');
                      }}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="catalog-h">
        <h2 id="catalog-h" style={{ marginBottom: 10 }}>Available connections</h2>
        <div className="grid-cards">
          {(providers.data?.providers ?? []).map((p) => (
            <div key={p.id} className="card integration-card">
              <div className="row">
                <div className="empty-icon" style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={PROVIDER_ICON[p.id] ?? 'plug'} size={18} />
                </div>
                <strong className="grow">{p.name}</strong>
                {p.availability === 'requires_setup' ? <span className="badge">Requires setup</span> : null}
              </div>
              <p className="muted small" style={{ margin: 0 }}>{p.description}</p>
              {p.availability === 'requires_setup' ? <p className="small" style={{ margin: 0 }}><Icon name="lock" size={12} /> {p.setupNote}</p> : null}
              <div className="row-actions">
                {p.availability === 'available' ? (
                  <button className="btn sm primary" disabled={!admin} onClick={() => setConnecting(p)}><Icon name="plus" size={13} /> Connect</button>
                ) : (
                  <button className="btn sm" disabled title={p.setupNote}>Not available on this deployment</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {connecting ? <ConnectDialog provider={connecting} events={providers.data?.events ?? []} onClose={() => setConnecting(null)} onDone={refresh} /> : null}
      {deliveries ? <DeliveriesDialog integration={deliveries} onClose={() => setDeliveries(null)} /> : null}
    </div>
  );
}

function ConnectDialog({ provider, events, onClose, onDone }: { provider: Provider; events: string[]; onClose: () => void; onDone: () => void }) {
  const ws = useWorkspace();
  const boards = useBoards(ws.id);
  const [name, setName] = useState(provider.name);
  const [url, setUrl] = useState('');
  const [boardId, setBoardId] = useState('');
  const [selected, setSelected] = useState<string[]>(['item.created']);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<Integration | null>(null);
  const toast = useToast();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await post<Integration>(`/workspaces/${ws.id}/integrations`, { provider: provider.id, name: name.trim(), url: url.trim(), boardId: boardId || null, events: selected });
      onDone();
      setCreated(r);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  if (created) {
    return (
      <Modal title="Integration added" onClose={onClose} footer={<button className="btn primary" onClick={onClose}>Done</button>}>
        <p>
          <strong>{created.name}</strong> was saved but is <strong>not verified yet</strong>. Use <em>Send test</em> to confirm the endpoint works; it will only be marked connected after a successful delivery.
        </p>
        {created.signingSecret ? (
          <>
            <p>Signing secret — copy it now, it will not be shown again. Verify requests with HMAC-SHA256 over <code>{'${X-WorkOS-Timestamp}.${body}'}</code> compared to the <code>X-WorkOS-Signature</code> header.</p>
            <div className="token-reveal">{created.signingSecret}</div>
            <button className="btn sm" style={{ marginTop: 8 }} onClick={() => navigator.clipboard?.writeText(created.signingSecret!).then(() => toast('Copied'))}><Icon name="copy" size={14} /> Copy secret</button>
          </>
        ) : null}
      </Modal>
    );
  }
  const field = provider.fields[0];
  return (
    <Modal title={`Connect ${provider.name}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="connect-form" disabled={busy || !url.trim() || !name.trim() || !selected.length}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <form id="connect-form" onSubmit={submit}>
        <Field label="Name" htmlFor="int-name"><input id="int-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} /></Field>
        <Field label={field?.label ?? 'URL'} htmlFor="int-url" hint="Must be an https URL. It is stored securely and never shown again.">
          <input id="int-url" className="input" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={field?.placeholder} autoComplete="off" />
        </Field>
        <Field label="Boards" htmlFor="int-board">
          <select id="int-board" className="select" value={boardId} onChange={(e) => setBoardId(e.target.value)}>
            <option value="">All boards in this workspace</option>
            {(boards.data ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
        <Field label="Events">
          <div className="col" style={{ gap: 4 }}>
            {events.filter((ev) => ev !== 'test').map((ev) => (
              <label key={ev} className="checkbox">
                <input type="checkbox" checked={selected.includes(ev)} onChange={(e) => setSelected(e.target.checked ? [...selected, ev] : selected.filter((x) => x !== ev))} /> {EVENT_LABELS[ev] ?? ev}
              </label>
            ))}
          </div>
        </Field>
        {error ? <div className="error-box" role="alert">{error}</div> : null}
      </form>
    </Modal>
  );
}

function DeliveriesDialog({ integration, onClose }: { integration: Integration; onClose: () => void }) {
  const q = useQuery({ queryKey: ['deliveries', integration.id], queryFn: () => get<any[]>(`/integrations/${integration.id}/deliveries`) });
  return (
    <Modal title={`Deliveries · ${integration.name}`} onClose={onClose} wide>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} /> : null}
      {q.data && q.data.length === 0 ? <EmptyState icon="history" title="No deliveries yet" /> : null}
      {q.data?.length ? (
        <table className="data-table responsive">
          <thead><tr><th>When</th><th>Event</th><th>Result</th><th>HTTP</th><th>Duration</th></tr></thead>
          <tbody>
            {q.data.map((d) => (
              <tr key={d.id}>
                <td>{timeAgo(d.created_at)}</td>
                <td className="small">{d.event}</td>
                <td>{d.ok ? <span className="badge success">OK</span> : <span className="badge danger" title={d.error ?? ''}>{d.error ?? 'Failed'}</span>}</td>
                <td className="small">{d.status_code ?? '—'}</td>
                <td className="small">{d.duration_ms != null ? `${d.duration_ms} ms` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </Modal>
  );
}
