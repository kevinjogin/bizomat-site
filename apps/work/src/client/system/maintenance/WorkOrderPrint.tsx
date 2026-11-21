// The printable job card of a work order, outside the ERP shell (its route is in SystemApp.tsx, above the company area):
// at /erp/c/<company>/maintenance/work-orders/<id>/print, opened in a new tab from the work order. A4-shaped on screen,
// with print styles. It prints in the browser, whose "Save as PDF" keeps it as a file with its photos: there is no PDF
// made on the server. It shows the asset and its place, the work, tasks with tick boxes, parts, inspections with answer
// boxes (or what was recorded), labour and blank rows, downtime, notes, photos (other files by name only) and the
// sign-off or blank lines for it. It never shows a cost, rate or value: the server leaves them out (routes-job.ts).
import { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { formatBytes } from '../../lib/format';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading } from '../../components/ui/ui';
import '../../styles/maintenance.css';
import { CRITICALITY_LABELS, JOB_TYPE_LABELS, PRIORITY_LABELS, WO_STATUS_LABELS, dateText, dateTimeText, minutesText, mtPage, mtPath, type WorkOrder } from './api';

interface CardItem {
  id: string;
  position: number;
  label: string;
  kind: 'pass_fail' | 'number' | 'text';
  unit: string;
  min: number | null;
  max: number | null;
  critical: boolean;
}

interface CardResult {
  itemId: string | null;
  label: string;
  kind: string;
  unit: string;
  passed: boolean | null;
  value: number | null;
  text: string;
  note: string;
}

export interface JobCard {
  company: { id: string; name: string };
  printedAt: number;
  printedBy: string;
  workOrder: WorkOrder;
  asset: { id: string; number: string; name: string; category: string; type: string; manufacturer: string; model: string; serialNumber: string; registrationNumber: string; location: string; criticality: string; status: string; department: string; siteCode: string | null; siteName: string | null };
  assetPath: { id: string; number: string; name: string }[];
  requests: { number: string; description: string; requestedByName: string | null; createdAt: number }[];
  tasks: { position: number; text: string; done: boolean; doneAt: number | null; doneByName: string | null }[];
  parts: { position: number; part: string; quantity: number; productNumber: string | null; uom: string | null }[];
  partsIssued: { number: string; name: string; uom: string; quantity: number }[];
  inspections: { id: string; templateName: string; status: string; completedAt: number | null; completedByName: string | null; items: CardItem[]; results: CardResult[] }[];
  labour: { workDate: string; userName: string | null; minutes: number; entry: 'timer' | 'manual' }[];
  totals: { actualMinutes: number; estimatedMinutes: number | null };
  downtime: { startedAt: number; endedAt: number | null; minutes: number | null; cause: string } | null;
  notes: { authorName: string | null; at: number; body: string }[];
  files: { images: { id: string; name: string; url: string }[]; documents: { id: string; name: string; mime: string; size: number }[] };
  signOff: { name: string; role: string; at: number; url: string } | null;
}

const INSPECTION_STATUS: Record<string, string> = { open: 'Not done yet', passed: 'Passed', failed: 'Failed' };

function limits(i: { min: number | null; max: number | null; unit: string }): string {
  const u = i.unit ? ` ${i.unit}` : '';
  if (i.min != null && i.max != null) return `${i.min} to ${i.max}${u}`;
  if (i.min != null) return `At least ${i.min}${u}`;
  if (i.max != null) return `At most ${i.max}${u}`;
  return '';
}

function answer(r: CardResult): string {
  const main = r.kind === 'pass_fail' ? (r.passed === true ? 'Pass' : r.passed === false ? 'Fail' : '') : r.kind === 'number' ? (r.value != null ? `${r.value}${r.unit ? ` ${r.unit}` : ''}` : '') : r.text;
  return [main, r.note ? `Note: ${r.note}` : ''].filter(Boolean).join('. ');
}

/** Label and value pairs; values that are not set are left out. */
function Facts({ items }: { items: [string, string | null | undefined][] }) {
  const shown = items.filter(([, v]) => v !== null && v !== undefined && v.trim() !== '');
  return (
    <dl className="mt-print-facts">
      {shown.map(([k, v]) => (
        <Fragment key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

const blank = (n: number) => Array.from({ length: n }, (_, i) => i);

export function WorkOrderPrintPage() {
  const { companyId = '', workOrderId = '' } = useParams();
  const q = useQuery({ queryKey: ['mt', companyId, 'job-card', workOrderId], queryFn: () => get<JobCard>(mtPath(companyId, `/work-orders/${encodeURIComponent(workOrderId)}/job-card`)), retry: false });
  usePageTitle(q.data ? `${q.data.workOrder.number} job card` : 'Job card');
  if (q.error) return <div className="mt-print-page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading label="Preparing the job card…" />;
  return <JobCardView card={q.data} companyId={companyId} />;
}

function JobCardView({ card, companyId }: { card: JobCard; companyId: string }) {
  const w = card.workOrder;
  const a = card.asset;
  const completed = w.status === 'completed' || w.status === 'closed';
  const issuedByNumber = new Map(card.partsIssued.map((p) => [p.number, p]));
  return (
    <div className="mt-print-page">
      <div className="mt-print-bar">
        <button className="btn primary" onClick={() => window.print()}>Print</button>
        <Link className="btn" to={mtPage(companyId, `/work-orders/${w.id}`)}>Back to the work order</Link>
        <span className="muted small">To keep a PDF, choose Save as PDF in the print window.</span>
      </div>
      <article className="mt-print" aria-label={`Job card ${w.number}`}>
        <header className="mt-print-head">
          <div>
            <div className="small">{card.company.name}</div>
            <h1>Job card {w.number}</h1>
            <div className="small">{[WO_STATUS_LABELS[w.status], `${PRIORITY_LABELS[w.priority]} priority`, JOB_TYPE_LABELS[w.jobType] ?? w.jobType].join(' · ')}</div>
          </div>
          <div className="small">Printed {dateTimeText(card.printedAt)} by {card.printedBy}</div>
        </header>

        <section aria-labelledby="jc-facts">
          <h2 id="jc-facts">Work order and asset</h2>
          <Facts
            items={[
              ['Asset', `${a.number} ${a.name}`],
              ['Path', card.assetPath.map((p) => p.name).join(' › ')],
              ['Site', a.siteCode ? `${a.siteCode} ${a.siteName ?? ''}`.trim() : null],
              ['Location', a.location],
              ['Make and model', [a.manufacturer, a.model].filter(Boolean).join(' ')],
              ['Serial number', a.serialNumber],
              ['Registration', a.registrationNumber],
              ['Criticality', a.criticality ? CRITICALITY_LABELS[a.criticality] ?? a.criticality : null],
              ['Department', w.departmentName ?? w.department],
              ['Technician', w.assignedToName ?? 'Not assigned'],
              ['Trade', w.trade],
              ['Contractor', w.contractor],
              ['Due start', dateText(w.dueStart)],
              ['Due finish', dateText(w.dueFinish)],
              ['Estimated', minutesText(w.estimatedMinutes)],
              ['Project reference', w.projectRef],
              ['Customer reference', w.customerRef],
              ['From requests', card.requests.map((r) => r.number).join(', ')],
              ['Made', dateTimeText(w.createdAt)],
            ]}
          />
          {w.recordedDone ? <p className="small">Recorded after the work was done.</p> : null}
        </section>

        <section aria-labelledby="jc-desc">
          <h2 id="jc-desc">Description</h2>
          <p className="mt-pre">{w.description}</p>
        </section>

        {w.safety ? (
          <section aria-labelledby="jc-safety">
            <h2 id="jc-safety">Safety requirements</h2>
            <div className="mt-safety mt-pre">{w.safety}</div>
          </section>
        ) : null}

        <section aria-labelledby="jc-ins">
          <h2 id="jc-ins">Instructions</h2>
          {w.instructions ? <p className="mt-pre">{w.instructions}</p> : <p className="small">No instructions.</p>}
        </section>

        <section aria-labelledby="jc-tasks">
          <h2 id="jc-tasks">Tasks</h2>
          {card.tasks.map((t) => (
            <div key={t.position} className="mt-print-task">
              <span className={`mt-box${t.done ? ' done' : ''}`} aria-hidden />
              <span className="sr-only">{t.done ? 'Done' : 'Not done'}</span>
              <span className="grow">
                {t.text}
                {t.done ? <span className="small"> (done by {t.doneByName ?? 'someone'}, {dateTimeText(t.doneAt)})</span> : null}
              </span>
            </div>
          ))}
          {blank(2).map((i) => (
            <div key={`t${i}`} className="mt-print-task">
              <span className="mt-box" aria-hidden />
              <span className="mt-answer grow" aria-hidden />
            </div>
          ))}
        </section>

        <section aria-labelledby="jc-parts">
          <h2 id="jc-parts">Parts</h2>
          <div className="mt-print-scroll">
            <table>
              <thead><tr><th>Part</th><th>Quantity</th><th>Used</th></tr></thead>
              <tbody>
                {card.parts.map((p) => (
                  <tr key={p.position}>
                    <td>{p.productNumber ? `${p.productNumber} ${p.part}` : p.part}</td>
                    <td>{p.quantity}{p.uom ? ` ${p.uom}` : ''}</td>
                    <td>{completed && p.productNumber && issuedByNumber.has(p.productNumber) ? `${issuedByNumber.get(p.productNumber)!.quantity} ${issuedByNumber.get(p.productNumber)!.uom}` : ''}</td>
                  </tr>
                ))}
                {blank(3).map((i) => <tr key={`p${i}`} className="mt-print-blank"><td /><td /><td /></tr>)}
              </tbody>
            </table>
          </div>
          {card.partsIssued.length ? (
            <>
              <h3>Parts issued from the stores</h3>
              <ul className="mt-print-list">
                {card.partsIssued.map((p) => <li key={p.number}>{p.number} {p.name}: {p.quantity} {p.uom}</li>)}
              </ul>
            </>
          ) : null}
        </section>

        {card.inspections.length ? (
          <section aria-labelledby="jc-insp">
            <h2 id="jc-insp">Inspections</h2>
            {card.inspections.map((i) => (
              <div key={i.id} className="mt-print-insp">
                <h3>
                  {i.templateName}: {INSPECTION_STATUS[i.status] ?? i.status}
                  {i.status !== 'open' && i.completedAt ? <span className="small"> ({i.completedByName ?? 'someone'}, {dateTimeText(i.completedAt)})</span> : null}
                </h3>
                <div className="mt-print-scroll">
                  <table>
                    <thead><tr><th>#</th><th>Item</th><th>Limits</th><th>Answer</th></tr></thead>
                    <tbody>
                      {i.items.map((it, n) => {
                        const r = i.status === 'open' ? null : i.results.find((x) => x.itemId === it.id) ?? null;
                        return (
                          <tr key={it.id ?? n}>
                            <td>{n + 1}</td>
                            <td>{it.label}{it.critical ? <strong> (Critical)</strong> : null}</td>
                            <td>{limits(it)}</td>
                            <td>
                              {r ? answer(r) : it.kind === 'pass_fail' ? (
                                <span className="mt-passfail-print"><span className="mt-box" aria-hidden /> Pass <span className="mt-box" aria-hidden /> Fail</span>
                              ) : it.kind === 'number' ? (
                                <span><span className="mt-answer" aria-hidden /> {it.unit}</span>
                              ) : (
                                <span className="mt-answer wide" aria-hidden />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        <section aria-labelledby="jc-labour">
          <h2 id="jc-labour">Labour</h2>
          {card.labour.length ? (
            <div className="mt-print-scroll">
              <table>
                <thead><tr><th>Date</th><th>Person</th><th>Time</th><th>How</th></tr></thead>
                <tbody>
                  {card.labour.map((l, n) => (
                    <tr key={n}>
                      <td>{dateText(l.workDate)}</td>
                      <td>{l.userName ?? 'Someone'}</td>
                      <td>{minutesText(l.minutes)}</td>
                      <td>{l.entry === 'timer' ? 'Timer' : 'Entered'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <p className="small">{minutesText(card.totals.actualMinutes) || '0 min'} recorded{card.totals.estimatedMinutes != null ? ` of ${minutesText(card.totals.estimatedMinutes)} estimated` : ''}.</p>
          <div className="mt-print-scroll">
            <table>
              <thead><tr><th>Date</th><th>Name</th><th>Start</th><th>Finish</th><th>Hours</th></tr></thead>
              <tbody>{blank(3).map((i) => <tr key={`l${i}`} className="mt-print-blank"><td /><td /><td /><td /><td /></tr>)}</tbody>
            </table>
          </div>
        </section>

        {card.downtime ? (
          <section aria-labelledby="jc-down">
            <h2 id="jc-down">Downtime</h2>
            <p className="small">
              Down from {dateTimeText(card.downtime.startedAt)}
              {card.downtime.endedAt ? ` to ${dateTimeText(card.downtime.endedAt)} (${minutesText(card.downtime.minutes)})` : ', not back up yet'}.
              {card.downtime.cause ? ` Cause: ${card.downtime.cause}` : ''}
            </p>
          </section>
        ) : null}

        {card.notes.length ? (
          <section aria-labelledby="jc-notes">
            <h2 id="jc-notes">Notes</h2>
            <ul className="mt-print-list">
              {card.notes.map((n, i) => (
                <li key={i}>
                  <strong>{n.authorName ?? 'Someone'}</strong>, {dateTimeText(n.at)}: <span className="mt-pre">{n.body}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="jc-done">
          {completed && w.completionNotes ? (
            <>
              <h2 id="jc-done">Completion notes</h2>
              <p className="mt-pre">{w.completionNotes}</p>
            </>
          ) : (
            <>
              <h2 id="jc-done">What was done and what was found</h2>
              <div className="mt-print-lines" aria-hidden>{blank(5).map((i) => <span key={i} />)}</div>
            </>
          )}
        </section>

        {card.files.images.length ? (
          <section aria-labelledby="jc-photos">
            <h2 id="jc-photos">Photos</h2>
            <div className="mt-print-photos">
              {card.files.images.map((f) => (
                <figure key={f.id}>
                  <img src={appUrl(f.url)} alt={f.name} />
                  <figcaption className="small">{f.name}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {card.files.documents.length ? (
          <section aria-labelledby="jc-docs">
            <h2 id="jc-docs">Other attachments</h2>
            <ul className="mt-print-list">
              {card.files.documents.map((f) => <li key={f.id}>{f.name} ({formatBytes(f.size)})</li>)}
            </ul>
            <p className="small">Kept in BIZOMAT ERP with the work order; not printed here.</p>
          </section>
        ) : null}

        <section aria-labelledby="jc-sign">
          <h2 id="jc-sign">Sign-off</h2>
          {card.signOff ? (
            <figure className="mt-signoff">
              <img src={appUrl(card.signOff.url)} alt={`Signature of ${card.signOff.name}`} />
              <figcaption className="small">
                Signed by <strong>{card.signOff.name}</strong>
                {card.signOff.role ? `, ${card.signOff.role}` : ''}, {dateTimeText(card.signOff.at)}. Not a verified electronic signature.
              </figcaption>
            </figure>
          ) : (
            <div className="mt-print-sign">
              {['Completed by (name)', 'Signature', 'Date', 'Accepted by (name)', 'Signature', 'Date'].map((l, i) => <div key={i}>{l}</div>)}
            </div>
          )}
        </section>

        <footer className="mt-print-foot">Printed from BIZOMAT ERP. The work order in the ERP is the record: enter what was written on this card there.</footer>
      </article>
    </div>
  );
}
