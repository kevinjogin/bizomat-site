// Project reports: preview, finalise, history and downloads. A finalised report is immutable: its data snapshot and
// every exported file are written to storage when it is generated and served from there afterwards, so later changes
// to the project never alter it. Only people allowed to generate reports on the project can see them, and a report
// with financial data only by those who may see the project's finances.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, newId, notFound, now, parseJson, sha256Hex } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditEventStmt, auditStmt } from '../services/audit';
import { financePolicy, memberAccessMap, requireProject } from '../services/access';
import { buildReport } from '../services/reports/build';
import { renderReportHtml } from '../services/reports/html';
import { DEFAULT_SECTIONS, REPORT_SECTIONS, REPORT_TYPES, REPORT_TYPE_LABELS, type ExportFormat, type ReportOptions } from '../../shared/reports';
import { notify } from '../services/notify';
import { svcFromContext } from '../services/context';

export const reportRoutes = new Hono<AppEnv>();

const text = z.string().max(4000).optional();
const optionsSchema = z.object({
  type: z.enum(REPORT_TYPES),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  timezone: z.string().max(64).optional(),
  statuses: z.array(z.string().max(64)).max(50).optional(),
  owners: z.array(z.string().max(64)).max(200).optional(),
  includeFinance: z.boolean().optional(),
  includeActivity: z.boolean().optional(),
  includeRisks: z.boolean().optional(),
  includeUpcoming: z.boolean().optional(),
  sections: z.array(z.enum(REPORT_SECTIONS)).max(20).optional(),
  confidentiality: z.string().trim().max(80).optional(),
  commentary: z
    .object({
      summary: text,
      achievements: text,
      problems: text,
      decisions: text,
      nextPriorities: text,
      resources: text,
      statusAssessment: z.enum(['on_track', 'at_risk', 'off_track', 'complete']).nullable().optional(),
    })
    .optional(),
});

const FORMATS: Record<ExportFormat, { type: string; ext: string }> = {
  pdf: { type: 'application/pdf', ext: 'pdf' },
  xlsx: { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: 'xlsx' },
  html: { type: 'text/html; charset=utf-8', ext: 'html' },
  csv: { type: 'text/csv; charset=utf-8', ext: 'csv' },
};

async function prepare(c: Context<AppEnv>, boardId: string, options: ReportOptions, draft: boolean, version: number | null) {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, boardId, user.id, 'generateReports');
  const ws = await c.env.DB.prepare('SELECT name, settings_json FROM workspaces WHERE id = ?').bind(p.board.workspace_id).first<{ name: string; settings_json: string }>();
  const policy = await financePolicy(c.env.DB, p.board.workspace_id);
  const userTz = (await c.env.DB.prepare('SELECT timezone FROM users WHERE id = ?').bind(user.id).first<{ timezone: string }>())?.timezone ?? 'UTC';
  const wsSettings = parseJson<{ reportConfidentiality?: string }>(ws?.settings_json, {});
  const opts: ReportOptions = { ...options, timezone: options.timezone || userTz };
  const data = await buildReport(c.env.DB, {
    board: p.board,
    organisation: ws?.name ?? '',
    options: opts,
    generatedBy: { id: user.id, name: user.name },
    financeAllowed: p.caps.viewFinance,
    workspaceCurrency: policy.defaultCurrency,
    confidentiality: options.confidentiality ?? wsSettings.reportConfidentiality ?? null,
    version,
    draft,
  });
  return { p, data, opts };
}

reportRoutes.post('/boards/:id/reports/preview', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `report-preview:${user.id}`, 60, 10 * 60_000);
  const options = await body(c, optionsSchema);
  const { data } = await prepare(c, c.req.param('id'), options, true, null);
  return c.json({ report: data, html: renderReportHtml(data) });
});

reportRoutes.post('/boards/:id/reports', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `report-generate:${user.id}`, 20, 60 * 60_000);
  const options = await body(c, optionsSchema);
  const boardId = c.req.param('id');
  const last = await c.env.DB.prepare('SELECT MAX(version) AS v FROM reports WHERE board_id = ?').bind(boardId).first<{ v: number | null }>();
  const version = (last?.v ?? 0) + 1;
  const { p, data, opts } = await prepare(c, boardId, options, false, version);
  const id = newId();
  data.meta.draft = false;
  const [{ renderReportPdf }, { renderReportXlsx, renderTasksCsv }] = await Promise.all([import('../services/reports/pdf'), import('../services/reports/xlsx')]);
  const snapshot = JSON.stringify(data);
  const enc = new TextEncoder();
  const outputs: Record<ExportFormat, Uint8Array> = {
    html: enc.encode(renderReportHtml(data)),
    pdf: await renderReportPdf(data),
    xlsx: renderReportXlsx(data),
    csv: enc.encode(renderTasksCsv(data)),
  };
  const base = `reports/${p.board.workspace_id}/${p.board.id}/${id}`;
  const files: Record<string, { key: string; size: number; sha256: string }> = {};
  const hex = async (b: Uint8Array) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', b))).map((x) => x.toString(16).padStart(2, '0')).join('');
  for (const [fmt, bytes] of Object.entries(outputs) as [ExportFormat, Uint8Array][]) {
    const key = `${base}/report.${FORMATS[fmt].ext}`;
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: FORMATS[fmt].type }, customMetadata: { report: id } });
    files[fmt] = { key, size: bytes.byteLength, sha256: await hex(bytes) };
  }
  const snapshotKey = `${base}/snapshot.json`;
  await c.env.FILES.put(snapshotKey, snapshot, { httpMetadata: { contentType: 'application/json' }, customMetadata: { report: id } });
  const t = now();
  try {
    await c.env.DB.batch([
      c.env.DB.prepare(
        `INSERT INTO reports (id, workspace_id, board_id, board_name, report_type, title, period_start, period_end, timezone, version, sections_json, options_json, includes_finance, snapshot_key, snapshot_sha256, files_json, history_from, generated_by, generated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(
        id,
        p.board.workspace_id,
        p.board.id,
        p.board.name,
        opts.type,
        data.meta.title,
        data.meta.period.start,
        data.meta.period.end,
        data.meta.period.timezone,
        version,
        JSON.stringify(data.meta.sections),
        JSON.stringify(opts),
        data.finance && data.meta.sections.includes('finance') ? 1 : 0,
        snapshotKey,
        await sha256Hex(snapshot),
        JSON.stringify(files),
        data.history.reliableFrom,
        user.id,
        t,
      ),
      auditStmt(c.env.DB, { workspaceId: p.board.workspace_id, actorId: user.id, action: 'report.generated', targetType: 'report', targetId: id, ip: clientIp(c) }),
      auditEventStmt(c.env.DB, { workspaceId: p.board.workspace_id, boardId: p.board.id, actorId: user.id, type: 'report.generated', metadata: { reportId: id, title: data.meta.title, type: opts.type, period: [data.meta.period.start, data.meta.period.end], version } }),
    ]);
  } catch (e) {
    // Two reports finalised at the same moment: the version number is taken. Ask to try again.
    if (/UNIQUE/i.test(e instanceof Error ? e.message : '')) throw new HttpError(409, 'Another report was saved at the same time. Generate it again.');
    throw e;
  }
  // Tell the project's managers (in-app; email only if they switched it on).
  const access = await memberAccessMap(c.env.DB, p.board);
  const managers = Object.entries(access).filter(([uid, a]) => a === 'manage' && uid !== user.id).map(([uid]) => uid);
  if (managers.length) {
    const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(p.board.workspace_id).first<{ name: string }>();
    await notify(svcFromContext(c), {
      workspaceId: p.board.workspace_id,
      userIds: managers,
      type: 'report_generated',
      title: `${user.name} generated a report: ${REPORT_TYPE_LABELS[opts.type]}`,
      body: `${p.board.name}, ${data.meta.period.label}`,
      link: `/w/${p.board.workspace_id}/boards/${p.board.id}?reports=1`,
      entityType: 'board',
      entityId: p.board.id,
      email: { template: 'report_generated', organisation: ws?.name ?? '', project: p.board.name, report: REPORT_TYPE_LABELS[opts.type], period: data.meta.period.label, by: user.name, url: `/w/${p.board.workspace_id}/boards/${p.board.id}?reports=1` },
    });
  }
  return c.json({ id, version, title: data.meta.title, files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { size: v.size }])) }, 201);
});

interface ReportRow {
  id: string;
  workspace_id: string;
  board_id: string;
  board_name: string;
  report_type: string;
  title: string;
  period_start: string;
  period_end: string;
  timezone: string;
  version: number;
  sections_json: string;
  options_json: string;
  includes_finance: number;
  snapshot_key: string;
  snapshot_sha256: string;
  files_json: string;
  history_from: number | null;
  generated_by: string;
  generated_at: number;
}

function reportDTO(r: ReportRow & { generated_by_name?: string }) {
  const files = parseJson<Record<string, { size: number; sha256: string }>>(r.files_json, {});
  return {
    id: r.id,
    boardId: r.board_id,
    boardName: r.board_name,
    type: r.report_type,
    typeLabel: REPORT_TYPE_LABELS[r.report_type as keyof typeof REPORT_TYPE_LABELS] ?? r.report_type,
    title: r.title,
    periodStart: r.period_start,
    periodEnd: r.period_end,
    timezone: r.timezone,
    version: r.version,
    sections: parseJson<string[]>(r.sections_json, []),
    includesFinance: !!r.includes_finance,
    historyFrom: r.history_from,
    generatedBy: r.generated_by_name ?? null,
    generatedAt: r.generated_at,
    files: Object.fromEntries(Object.entries(files).map(([k, v]) => [k, { size: v.size, sha256: v.sha256 }])),
  };
}

reportRoutes.get('/boards/:id/reports', async (c) => {
  const user = c.get('user');
  const p = await requireProject(c.env.DB, c.req.param('id'), user.id, 'generateReports');
  const rows = await c.env.DB.prepare(
    `SELECT r.*, u.name AS generated_by_name FROM reports r LEFT JOIN users u ON u.id = r.generated_by WHERE r.board_id = ? ORDER BY r.generated_at DESC LIMIT 200`,
  )
    .bind(p.board.id)
    .all<ReportRow & { generated_by_name: string }>();
  return c.json({
    reports: rows.results.filter((r) => p.caps.viewFinance || !r.includes_finance).map(reportDTO),
    hiddenWithFinance: p.caps.viewFinance ? 0 : rows.results.filter((r) => r.includes_finance).length,
    defaults: DEFAULT_SECTIONS,
  });
});

async function loadReport(c: Context<AppEnv>) {
  const user = c.get('user');
  const r = await c.env.DB.prepare('SELECT r.*, u.name AS generated_by_name FROM reports r LEFT JOIN users u ON u.id = r.generated_by WHERE r.id = ?').bind(c.req.param('id')).first<ReportRow & { generated_by_name: string }>();
  if (!r) throw notFound('Report');
  // Same rule as listing: allowed to generate reports on the project now, and to see finances if it has any.
  const p = await requireProject(c.env.DB, r.board_id, user.id, 'generateReports').catch(() => {
    throw notFound('Report');
  });
  if (p.board.workspace_id !== r.workspace_id) throw notFound('Report');
  if (r.includes_finance && !p.caps.viewFinance) throw new HttpError(403, 'This report contains financial data you may not view');
  return { r, p };
}

reportRoutes.get('/reports/:id', async (c) => {
  const { r } = await loadReport(c);
  const files = parseJson<Record<string, { key: string }>>(r.files_json, {});
  const html = files.html ? await c.env.FILES.get(files.html.key) : null;
  return c.json({ report: reportDTO(r), html: html ? await html.text() : null });
});

reportRoutes.get('/reports/:id/download/:format', async (c) => {
  const user = c.get('user');
  const fmt = c.req.param('format') as ExportFormat;
  if (!FORMATS[fmt]) throw badRequest('Unknown format');
  const { r } = await loadReport(c);
  const files = parseJson<Record<string, { key: string; sha256: string }>>(r.files_json, {});
  const f = files[fmt];
  if (!f) throw notFound('File');
  const obj = await c.env.FILES.get(f.key);
  if (!obj) throw notFound('File');
  await auditEventStmt(c.env.DB, { workspaceId: r.workspace_id, boardId: r.board_id, actorId: user.id, type: 'report.downloaded', metadata: { reportId: r.id, format: fmt } }).run();
  const safeName = `${r.board_name}-${r.report_type}-v${r.version}`.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').slice(0, 100);
  const headers = new Headers({
    'Content-Type': FORMATS[fmt].type,
    'Content-Disposition': `${c.req.query('inline') === '1' && fmt === 'pdf' ? 'inline' : 'attachment'}; filename="${safeName}.${FORMATS[fmt].ext}"`,
    'Cache-Control': 'private, no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Report-SHA256': f.sha256,
  });
  // A downloaded HTML report must not run anything or reach anything when opened from the app's origin.
  if (fmt === 'html') headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox");
  return new Response(obj.body, { headers });
});
