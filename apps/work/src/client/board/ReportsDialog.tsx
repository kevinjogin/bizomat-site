// Project reports: choose the report, preview exactly what will be exported, add commentary, save it (PDF, Excel,
// HTML and CSV are generated and stored together), and download saved versions. The server decides what each person
// may see; this screen only offers what the capabilities allow.

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { labelsOf } from '../../shared/columns';
import { DEFAULT_SECTIONS, REPORT_SECTIONS, REPORT_TYPES, REPORT_TYPE_LABELS, SECTION_LABELS, type ReportOptions, type ReportSection, type ReportType } from '../../shared/reports';
import type { BoardBundle, BoardDTO } from '../../shared/types';
import { errorMessage, get, post } from '../lib/api';
import { appUrl } from '../lib/base';
import { formatBytes, timeAgo } from '../lib/format';
import { useUser, useWorkspace } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Field, Loading, Spinner } from '../components/ui/ui';
import { Modal, useToast } from '../components/ui/overlays';
import '../styles/platform.css';

interface SavedReport {
  id: string;
  boardId: string;
  type: string;
  typeLabel: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  version: number;
  includesFinance: boolean;
  generatedBy: string | null;
  generatedAt: number;
  files: Record<string, { size: number; sha256: string }>;
}

const FORMAT_LABELS: Record<string, string> = { pdf: 'PDF', xlsx: 'Excel', html: 'Print (HTML)', csv: 'CSV tasks' };

function lastMonth(): string {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function ReportsDialog({ bundle, onClose }: { bundle: BoardBundle; onClose: () => void }) {
  const ws = useWorkspace();
  const user = useUser();
  const toast = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<'create' | 'history'>('create');
  const [boardId, setBoardId] = useState(bundle.board.id);
  const boards = useQuery({ queryKey: ['boards', ws.id], queryFn: () => get<BoardDTO[]>(`/workspaces/${ws.id}/boards`) });
  const reportable = (boards.data ?? []).filter((b) => b.access && b.kind !== 'template');
  const [type, setType] = useState<ReportType>('monthly');
  const [month, setMonth] = useState(lastMonth());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [sections, setSections] = useState<ReportSection[]>(DEFAULT_SECTIONS.monthly);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [includeFinance, setIncludeFinance] = useState(true);
  const [includeActivity, setIncludeActivity] = useState(true);
  const [includeRisks, setIncludeRisks] = useState(true);
  const [includeUpcoming, setIncludeUpcoming] = useState(true);
  const [confidentiality, setConfidentiality] = useState('');
  const [commentary, setCommentary] = useState<NonNullable<ReportOptions['commentary']>>({});
  const [preview, setPreview] = useState<{ html: string; at: number } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tz = user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const caps = bundle.board.caps;
  const statusCol = bundle.columns.find((c) => c.type === 'status');
  const hasFinance = (bundle.finance?.hiddenColumns ?? 0) === 0 && bundle.columns.some((c) => c.type === 'currency' || (c.type === 'number' && c.settings?.financial));

  useEffect(() => setSections(DEFAULT_SECTIONS[type]), [type]);

  const options = useMemo<ReportOptions>(
    () => ({
      type,
      ...(type === 'monthly' ? { month } : {}),
      ...(type === 'custom' ? { start: start || undefined, end: end || undefined } : {}),
      timezone: tz,
      sections,
      statuses,
      owners,
      includeFinance,
      includeActivity,
      includeRisks,
      includeUpcoming,
      confidentiality: confidentiality.trim() || undefined,
      commentary: Object.fromEntries(Object.entries(commentary).filter(([, v]) => v != null && v !== '')),
    }),
    [type, month, start, end, tz, sections, statuses, owners, includeFinance, includeActivity, includeRisks, includeUpcoming, confidentiality, commentary],
  );

  const runPreview = async () => {
    setPreviewing(true);
    setError(null);
    try {
      const r = await post<{ html: string }>(`/boards/${boardId}/reports/preview`, options);
      setPreview({ html: r.html, at: Date.now() });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPreviewing(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const r = await post<{ id: string; version: number }>(`/boards/${boardId}/reports`, options);
      toast(`Report saved as version ${r.version}`);
      qc.invalidateQueries({ queryKey: ['reports', boardId] });
      setTab('history');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const c = (k: keyof NonNullable<ReportOptions['commentary']>) => ({
    value: (commentary[k] as string) ?? '',
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentary({ ...commentary, [k]: e.target.value }),
    maxLength: 4000,
    className: 'textarea',
    rows: 3,
  });

  if (!caps?.generateReports) {
    return (
      <Modal title="Reports" onClose={onClose}>
        <EmptyState icon="lock" title="Reports are not part of your access">Ask a project manager or an organisation admin for permission to generate reports on this project.</EmptyState>
      </Modal>
    );
  }

  return (
    <Modal title={`Reports · ${bundle.board.name}`} onClose={onClose} xl>
      <div className="col" style={{ width: '100%', minHeight: 0 }}>
        <div className="tabs" style={{ padding: '0 18px', borderBottom: '1px solid var(--border)' }} role="tablist">
          <button role="tab" aria-selected={tab === 'create'} className={`tab${tab === 'create' ? ' active' : ''}`} onClick={() => setTab('create')}><Icon name="plus" size={14} /> New report</button>
          <button role="tab" aria-selected={tab === 'history'} className={`tab${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}><Icon name="history" size={14} /> Report history</button>
        </div>
        {tab === 'history' ? (
          <History boardId={boardId} />
        ) : (
          <div className="report-layout">
            <div className="report-config">
              <h3>Report</h3>
              <Field label="Organisation"><input className="input" value={ws.name} readOnly /></Field>
              <Field label="Project" htmlFor="rp-board">
                <select id="rp-board" className="select" value={boardId} onChange={(e) => { setBoardId(e.target.value); setPreview(null); }}>
                  {(reportable.length ? reportable : [bundle.board]).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field label="Report type" htmlFor="rp-type">
                <select id="rp-type" className="select" value={type} onChange={(e) => setType(e.target.value as ReportType)}>
                  {REPORT_TYPES.map((t) => <option key={t} value={t}>{REPORT_TYPE_LABELS[t]}</option>)}
                </select>
              </Field>
              {type === 'monthly' ? <Field label="Month" htmlFor="rp-month"><input id="rp-month" className="input" type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></Field> : null}
              {type === 'custom' ? (
                <div className="row">
                  <Field label="Start date" htmlFor="rp-start"><input id="rp-start" className="input" type="date" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
                  <Field label="End date" htmlFor="rp-end"><input id="rp-end" className="input" type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} /></Field>
                </div>
              ) : null}
              <p className="muted small">Dates are in your time zone ({tz}). Monthly and previous-month reports separate work completed in the month, work still active at its end, work carried forward and new work.</p>

              <h3>Include</h3>
              <div className="check-grid">
                <label className="checkbox"><input type="checkbox" checked={includeFinance && hasFinance} disabled={!hasFinance} onChange={(e) => setIncludeFinance(e.target.checked)} /> Finances</label>
                <label className="checkbox"><input type="checkbox" checked={includeActivity} onChange={(e) => setIncludeActivity(e.target.checked)} /> Activity history</label>
                <label className="checkbox"><input type="checkbox" checked={includeRisks} onChange={(e) => setIncludeRisks(e.target.checked)} /> Risks and issues</label>
                <label className="checkbox"><input type="checkbox" checked={includeUpcoming} onChange={(e) => setIncludeUpcoming(e.target.checked)} /> Upcoming work</label>
              </div>
              {!hasFinance ? <p className="muted small">No financial data you can view on this project.</p> : null}
              <h3>Sections</h3>
              <div className="col" style={{ gap: 4 }}>
                {REPORT_SECTIONS.map((s) => (
                  <label key={s} className="checkbox small"><input type="checkbox" checked={sections.includes(s)} onChange={() => setSections(toggle(sections, s))} /> {SECTION_LABELS[s]}</label>
                ))}
              </div>

              {statusCol ? (
                <>
                  <h3>Task statuses listed</h3>
                  <div className="pill-list">
                    {labelsOf(statusCol).map((l) => <button key={l.id} type="button" className="chip" aria-pressed={statuses.includes(l.id)} onClick={() => setStatuses(toggle(statuses, l.id))}>{l.label}</button>)}
                  </div>
                  <p className="muted small">None selected: every status. Totals always count every task.</p>
                </>
              ) : null}
              <h3>Task owners listed</h3>
              <div className="pill-list">
                {bundle.members.map((m) => <button key={m.id} type="button" className="chip" aria-pressed={owners.includes(m.id)} onClick={() => setOwners(toggle(owners, m.id))}>{m.name}</button>)}
              </div>

              <h3>Commentary (kept apart from recorded data)</h3>
              <Field label="Overall status, in your judgement" htmlFor="rp-assess">
                <select id="rp-assess" className="select" value={commentary.statusAssessment ?? ''} onChange={(e) => setCommentary({ ...commentary, statusAssessment: (e.target.value || null) as any })}>
                  <option value="">Use the calculated status only</option>
                  <option value="on_track">On track</option>
                  <option value="at_risk">At risk</option>
                  <option value="off_track">Off track</option>
                  <option value="complete">Complete</option>
                </select>
              </Field>
              <Field label="Executive summary"><textarea {...c('summary')} /></Field>
              <Field label="Achievements (in addition to completed tasks)"><textarea {...c('achievements')} /></Field>
              <Field label="Problems"><textarea {...c('problems')} /></Field>
              <Field label="Decisions required from management"><textarea {...c('decisions')} /></Field>
              <Field label="Next period priorities"><textarea {...c('nextPriorities')} /></Field>
              <Field label="Resource requirements"><textarea {...c('resources')} /></Field>
              <Field label="Classification label" hint="For example: Confidential. Shown on every page." htmlFor="rp-conf"><input id="rp-conf" className="input" value={confidentiality} maxLength={80} onChange={(e) => setConfidentiality(e.target.value)} /></Field>
            </div>
            <div className="report-preview">
              <div className="report-preview-bar">
                <button className="btn" onClick={runPreview} disabled={previewing}>{previewing ? <Spinner /> : <Icon name="eye" />} {preview ? 'Refresh preview' : 'Preview report'}</button>
                <button className="btn primary" onClick={save} disabled={saving}>{saving ? <Spinner /> : <Icon name="check" />} Save report (PDF, Excel, HTML, CSV)</button>
                <span className="spacer" />
                {preview ? <span className="muted small">Preview from {timeAgo(preview.at)}; draft, not saved</span> : null}
                {preview ? <button className="btn ghost sm" onClick={() => printPreview(preview.html)}><Icon name="file" size={14} /> Print preview</button> : null}
              </div>
              {error ? <div className="error-box" role="alert" style={{ margin: 12 }}>{error}</div> : null}
              {preview ? (
                // The report page itself, in a sandbox without scripts.
                <iframe className="report-frame" title="Report preview" sandbox="allow-same-origin allow-modals" srcDoc={preview.html} />
              ) : (
                <div style={{ padding: 24 }}>
                  <EmptyState icon="file" title="Preview before you save">
                    Every figure comes from what is recorded on the project: past statuses come from the history of changes, and the report says where that history is incomplete. Saved reports never change afterwards.
                  </EmptyState>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function printPreview(html: string) {
  const w = window.open('', '_blank', 'noopener=no');
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function History({ boardId }: { boardId: string }) {
  const q = useQuery({ queryKey: ['reports', boardId], queryFn: () => get<{ reports: SavedReport[]; hiddenWithFinance: number }>(`/boards/${boardId}/reports`) });
  const [viewing, setViewing] = useState<string | null>(null);
  const view = useQuery({ queryKey: ['report', viewing], queryFn: () => get<{ html: string | null }>(`/reports/${viewing}`), enabled: !!viewing });
  if (q.isLoading) return <Loading />;
  if (q.error) return <div className="report-history"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  const list = q.data?.reports ?? [];
  if (viewing) {
    return (
      <div className="report-preview" style={{ width: '100%' }}>
        <div className="report-preview-bar">
          <button className="btn ghost sm" onClick={() => setViewing(null)}><Icon name="chevronLeft" size={14} /> All reports</button>
          <span className="muted small">Saved report: exactly as it was generated</span>
        </div>
        {view.isLoading ? <Loading /> : view.data?.html ? <iframe className="report-frame" title="Saved report" sandbox="allow-same-origin" srcDoc={view.data.html} /> : <ErrorBox error={view.error ?? new Error('Not available')} />}
      </div>
    );
  }
  return (
    <div className="report-history">
      {q.data?.hiddenWithFinance ? <div className="info-box" style={{ marginBottom: 12 }}>{q.data.hiddenWithFinance} saved report(s) with financial data are not listed because your access does not include this project's finances.</div> : null}
      {!list.length ? (
        <EmptyState icon="file" title="No saved reports yet">Create one on the New report tab. Each saved report keeps its own PDF, Excel, HTML and CSV files.</EmptyState>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Report</th><th>Period</th><th>Version</th><th>Generated</th><th>Files</th></tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td><button className="btn ghost sm" onClick={() => setViewing(r.id)}><Icon name="eye" size={14} /> {r.typeLabel}</button>{r.includesFinance ? <span className="badge" style={{ marginLeft: 6 }}>Finance</span> : null}</td>
                  <td className="small">{r.periodStart} to {r.periodEnd}</td>
                  <td>v{r.version}</td>
                  <td className="small">{new Date(r.generatedAt).toLocaleString()}<div className="muted">{r.generatedBy ?? ''}</div></td>
                  <td>
                    <div className="row wrap" style={{ gap: 4 }}>
                      {(['pdf', 'xlsx', 'html', 'csv'] as const).filter((f) => r.files[f]).map((f) => (
                        <a key={f} className="btn sm" href={appUrl(`/api/reports/${r.id}/download/${f}`)} download title={`${formatBytes(r.files[f].size)} · SHA-256 ${r.files[f].sha256.slice(0, 12)}`}>
                          <Icon name="download" size={13} /> {FORMAT_LABELS[f]}
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
