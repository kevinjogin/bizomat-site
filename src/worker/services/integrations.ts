// Integration framework with provider adapters.
//
// An integration is only reported as `connected` after a real delivery
// succeeded. Providers that need OAuth credentials we do not have are listed
// as `requires_setup` and cannot be enabled — nothing is faked.

import { newId, now, parseJson } from '../lib/util';
import type { Svc } from './context';

export interface ProviderInfo {
  id: string;
  name: string;
  category: 'webhooks' | 'chat' | 'google' | 'developer';
  description: string;
  /** 'available': works now. 'requires_setup': needs platform OAuth credentials. */
  availability: 'available' | 'requires_setup';
  setupNote?: string;
  fields: { key: string; label: string; secret?: boolean; placeholder?: string }[];
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'webhook',
    name: 'Outgoing webhook',
    category: 'webhooks',
    description: 'POST signed JSON events (HMAC-SHA256) to any HTTPS endpoint.',
    availability: 'available',
    fields: [{ key: 'url', label: 'Endpoint URL', secret: true, placeholder: 'https://example.com/hooks/workos' }],
  },
  {
    id: 'slack',
    name: 'Slack (incoming webhook)',
    category: 'chat',
    description: 'Post board events to a Slack channel using a Slack incoming-webhook URL.',
    availability: 'available',
    fields: [{ key: 'url', label: 'Slack webhook URL', secret: true, placeholder: 'https://hooks.slack.com/services/…' }],
  },
  {
    id: 'teams',
    name: 'Microsoft Teams (workflow webhook)',
    category: 'chat',
    description: 'Post board events to a Teams channel via a Teams Workflows webhook URL.',
    availability: 'available',
    fields: [{ key: 'url', label: 'Teams webhook URL', secret: true, placeholder: 'https://…webhook.office.com/…' }],
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    category: 'google',
    description: 'Attach Drive files to items.',
    availability: 'requires_setup',
    setupNote: 'Requires a Google Cloud OAuth client with the Drive API enabled (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) and the drive.file scope.',
    fields: [],
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'google',
    description: 'Sync date columns to a Google Calendar.',
    availability: 'requires_setup',
    setupNote: 'Requires a Google Cloud OAuth client with the Calendar API enabled and the calendar.events scope.',
    fields: [],
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'google',
    description: 'Create items from emails and send notification emails.',
    availability: 'requires_setup',
    setupNote: 'Requires a Google Cloud OAuth client with the Gmail API enabled and verified sensitive scopes.',
    fields: [],
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    description: 'Link issues and pull requests to items.',
    availability: 'requires_setup',
    setupNote: 'Requires registering a GitHub App (App ID, private key, webhook secret) for this deployment.',
    fields: [],
  },
];

export const EVENT_TYPES = ['item.created', 'item.updated', 'item.moved', 'update.posted', 'automation.triggered', 'test'] as const;

export interface IntegrationRow {
  id: string;
  workspace_id: string;
  provider: string;
  name: string;
  board_id: string | null;
  status: 'pending' | 'connected' | 'error' | 'disabled';
  config_json: string;
  secret: string | null;
  events_json: string;
  last_status: string | null;
  last_error: string | null;
  last_delivery_at: number | null;
  created_by: string;
  created_at: number;
  updated_at: number;
}

/** Block obvious SSRF targets. Workers cannot reach private networks, but be explicit. */
export function validateWebhookUrl(raw: string, provider: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return 'Invalid URL';
  }
  if (u.protocol !== 'https:') return 'URL must use https';
  const host = u.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local')) return 'Host not allowed';
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.includes(':') || host.startsWith('[')) return 'IP-literal hosts are not allowed';
  if (provider === 'slack' && host !== 'hooks.slack.com') return 'Slack webhook URLs must be on hooks.slack.com';
  if (provider === 'teams' && !(host.endsWith('.webhook.office.com') || host.endsWith('.logic.azure.com') || host.endsWith('.environment.api.powerplatform.com'))) {
    return 'Teams webhook URLs must be a Microsoft webhook host';
  }
  return null;
}

async function hmac(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

function summarize(event: string, payload: any): string {
  const item = payload?.item?.name ? `"${payload.item.name}"` : 'an item';
  const board = payload?.board?.name ? ` on ${payload.board.name}` : '';
  switch (event) {
    case 'item.created': return `New item ${item}${board}`;
    case 'item.updated': return `${item} was updated${board}`;
    case 'item.moved': return `${item} moved${board}`;
    case 'update.posted': return `New update on ${item}${board}`;
    case 'automation.triggered': return `Automation "${payload?.automation?.name}" ran for ${item}${board}`;
    default: return `WorkOS test message${board}`;
  }
}

export async function deliver(svc: Svc, integ: IntegrationRow, event: string, payload: unknown): Promise<{ ok: boolean; status?: number; error?: string }> {
  const config = parseJson<{ url?: string; signingSecret?: string }>(integ.config_json, {});
  const url = integ.secret ?? config.url;
  if (!url) return { ok: false, error: 'Missing endpoint URL' };
  const urlErr = validateWebhookUrl(url, integ.provider);
  if (urlErr) return { ok: false, error: urlErr };
  const envelope = { id: newId(), event, workspaceId: integ.workspace_id, sentAt: new Date().toISOString(), data: payload };
  let bodyText: string;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'User-Agent': 'WorkOS-Webhooks/1.0' };
  if (integ.provider === 'slack') bodyText = JSON.stringify({ text: summarize(event, payload) });
  else if (integ.provider === 'teams') bodyText = JSON.stringify({ text: summarize(event, payload) });
  else {
    bodyText = JSON.stringify(envelope);
    if (config.signingSecret) {
      const ts = Math.floor(Date.now() / 1000).toString();
      headers['X-WorkOS-Timestamp'] = ts;
      headers['X-WorkOS-Signature'] = `sha256=${await hmac(config.signingSecret, `${ts}.${bodyText}`)}`;
    }
    headers['X-WorkOS-Event'] = event;
  }
  const started = Date.now();
  let result: { ok: boolean; status?: number; error?: string };
  try {
    const res = await fetch(url, { method: 'POST', headers, body: bodyText, redirect: 'manual', signal: AbortSignal.timeout(10_000) });
    result = res.ok ? { ok: true, status: res.status } : { ok: false, status: res.status, error: `HTTP ${res.status}` };
  } catch (e) {
    result = { ok: false, error: e instanceof Error ? e.message : 'Delivery failed' };
  }
  const t = now();
  await svc.db.batch([
    svc.db
      .prepare('INSERT INTO integration_deliveries (id, workspace_id, integration_id, event, status_code, ok, error, duration_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), integ.workspace_id, integ.id, event, result.status ?? null, result.ok ? 1 : 0, result.error ?? null, Date.now() - started, t),
    svc.db
      .prepare(
        `UPDATE integrations SET last_status = ?, last_error = ?, last_delivery_at = ?, updated_at = ?,
         status = CASE WHEN status = 'disabled' THEN status WHEN ? THEN 'connected' ELSE 'error' END WHERE id = ?`,
      )
      .bind(result.ok ? 'ok' : 'error', result.error ?? null, t, t, result.ok ? 1 : 0, integ.id),
  ]);
  return result;
}

export async function deliverToIntegration(
  svc: Svc,
  workspaceId: string,
  integrationId: string,
  event: string,
  payload: unknown,
  opts: { throwOnError?: boolean } = {},
) {
  const integ = await svc.db.prepare('SELECT * FROM integrations WHERE id = ? AND workspace_id = ?').bind(integrationId, workspaceId).first<IntegrationRow>();
  if (!integ) throw new Error('Integration not found');
  if (integ.status === 'disabled') throw new Error('Integration is disabled');
  const r = await deliver(svc, integ, event, payload);
  if (!r.ok && opts.throwOnError) throw new Error(`Webhook delivery failed: ${r.error}`);
  return r;
}

/** Fan out a board event to subscribed, connected integrations (async). */
export async function fanOut(svc: Svc, workspaceId: string, boardId: string, event: string, payload: unknown) {
  const rows = await svc.db
    .prepare("SELECT * FROM integrations WHERE workspace_id = ? AND status = 'connected' AND (board_id IS NULL OR board_id = ?)")
    .bind(workspaceId, boardId)
    .all<IntegrationRow>();
  for (const integ of rows.results) {
    const events = parseJson<string[]>(integ.events_json, []);
    if (!events.includes(event)) continue;
    await deliver(svc, integ, event, payload);
  }
}
