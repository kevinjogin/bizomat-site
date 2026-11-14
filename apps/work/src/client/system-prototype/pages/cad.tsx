// CAD Automation inside BIZOMAT System (owner, 14 Nov 2026). CAD Automation stays what it is: an MCP connector for AI
// assistants, the Windows installer with the SOLIDWORKS add-in and the Companion, at bizomat.ai/cad. The System shows
// it beside everything else: an overview, the four setup steps in one clear place (their buttons open the real
// installer and the real connector address), the paired computers, the AI connectors and the jobs.
// Demonstration data only (data/operations.ts); the real figures come from CAD Automation once it shares them.
import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/overlays';
import * as OP from '../data/operations';
import { fmtDate, fmtDateTime, PHONE, useMedia } from '../format';
import { PIcon } from '../icons';
import { Panel, StatusBadge, Tabs } from '../kit';
import { RecLink } from '../links';
import type { NavPage, Row, Tone } from '../types';
import { ModulePage } from './common';

const SETUP_KEY = 'bizomat-system-preview:cad-setup';
const online = OP.cadComputers.filter((c) => c.status === 'Online');
const needsUpdate = OP.cadComputers.filter((c) => c.addin !== OP.CAD_ADDIN_LATEST);
const activeJobs = OP.cadJobs.filter((j) => ['Running', 'Queued'].includes(j.status));
const failedJobs = OP.cadJobs.filter((j) => j.status === 'Failed');

function OpenCad({ path = '', label = 'Open CAD Automation', primary }: { path?: string; label?: string; primary?: boolean }) {
  return (
    <a className={`btn${primary ? ' primary' : ''}`} href={OP.CAD_APP_URL + path} target="_blank" rel="noopener">
      <PIcon name="share" /> {label}
    </a>
  );
}

function useCopy() {
  const toast = useToast();
  return (text: string, what: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast(`${what} copied`),
      () => toast(`Copy the ${what.toLowerCase()} by hand`, 'error'),
    );
  };
}

/** The connector address with a Copy button: the same address the CAD Automation app shows. */
function ConnectorAddress() {
  const copy = useCopy();
  return (
    <div className="sys-copy">
      <label className="sys-copy-label" htmlFor="cad-connector">
        Connector address
      </label>
      <div className="sys-copy-row">
        <input id="cad-connector" className="input" readOnly value={OP.CAD_CONNECTOR_URL} onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="btn" onClick={() => copy(OP.CAD_CONNECTOR_URL, 'Connector address')}>
          <PIcon name="copy" /> Copy
        </button>
      </div>
    </div>
  );
}

/** The steps for each assistant, word for word as CAD Automation's own CAD Assistant page gives them. */
function AssistantSteps() {
  const [tab, setTab] = useState('claude');
  return (
    <div className="sys-assistant">
      <Tabs
        label="Steps for your assistant"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'claude', label: 'Claude' },
          { id: 'chatgpt', label: 'ChatGPT' },
          { id: 'other', label: 'Other assistants' },
        ]}
      />
      {tab === 'claude' ? (
        <ol className="sys-ol">
          <li>
            Open Settings &gt; Connectors and choose <b>Add custom connector</b>.
          </li>
          <li>Name it BIZOMAT CAD Automation and paste the connector address.</li>
          <li>
            Choose Connect, sign in and choose <b>Allow</b>.
          </li>
        </ol>
      ) : tab === 'chatgpt' ? (
        <ol className="sys-ol">
          <li>Where your plan allows custom connectors, add a new connector.</li>
          <li>Paste the connector address.</li>
          <li>
            Sign in when asked and choose <b>Allow</b>. Your workspace administrator may need to allow custom connectors first.
          </li>
        </ol>
      ) : (
        <p className="small">
          Any app that supports remote MCP servers over Streamable HTTP can use the connector address. If it cannot sign in, use the private address in
          CAD Automation's Settings.
        </p>
      )}
    </div>
  );
}

function computerTone(c: Row): Tone {
  return c.status === 'Online' ? 'success' : 'neutral';
}

function SameAsBefore() {
  return (
    <Panel title="What stays the same" id="cad-same">
      <ul className="sys-checks">
        <li>
          <PIcon name="check" size={15} /> CAD Automation is still an MCP connector for Claude, ChatGPT and other assistants.
        </li>
        <li>
          <PIcon name="check" size={15} /> The same Windows installer: the SOLIDWORKS add-in and the Companion.
        </li>
        <li>
          <PIcon name="check" size={15} /> The same connector address and the same sign-in to allow your assistant.
        </li>
        <li>
          <PIcon name="check" size={15} /> Your model files stay on your computer.
        </li>
      </ul>
      <p className="muted small">Planned: one BIZOMAT sign-in for CAD Automation and the rest of the System.</p>
    </Panel>
  );
}

// ------------------------------------------------------------------ Overview

export function CadOverview({ page }: { page: NavPage }) {
  const done = useSetupDone();
  return (
    <ModulePage page={page} subtitle="Your AI assistant works in SOLIDWORKS on your own computer. See every computer, connector and job here." actions={<OpenCad primary />}>
      <div className="erp-kpis" role="list" aria-label="CAD Automation figures">
        <Link role="listitem" className="erp-kpi sys-kpi-link" to="/cad/computers">
          <span className="erp-kpi-label">Computers online</span>
          <span className="erp-kpi-value">
            {online.length} of {OP.cadComputers.length}
          </span>
          <span className={needsUpdate.length ? 'warning-text small' : 'muted small'}>{needsUpdate.length ? `${needsUpdate.length} add-in update available` : 'Add-ins up to date'}</span>
        </Link>
        <Link role="listitem" className="erp-kpi sys-kpi-link" to="/cad/connectors">
          <span className="erp-kpi-label">AI connectors</span>
          <span className="erp-kpi-value">{OP.cadConnectors.length}</span>
          <span className="muted small">{OP.cadConnectors.map((c) => c.app).join(' and ')}</span>
        </Link>
        <Link role="listitem" className="erp-kpi sys-kpi-link" to="/cad/jobs">
          <span className="erp-kpi-label">Jobs in progress</span>
          <span className="erp-kpi-value">{activeJobs.length}</span>
          <span className={failedJobs.length ? 'danger-text small' : 'muted small'}>{failedJobs.length ? `${failedJobs.length} failed this week` : 'None failed'}</span>
        </Link>
        <Link role="listitem" className="erp-kpi sys-kpi-link" to="/cad/setup">
          <span className="erp-kpi-label">Your setup</span>
          <span className="erp-kpi-value">{done.count} of 4</span>
          <span className={done.count === 4 ? 'success-text small' : 'muted small'}>{done.count === 4 ? 'Ready to work' : 'Steps to finish'}</span>
        </Link>
      </div>
      <div className="sys-two">
        <div className="erp-stack">
          <Panel title="Computers" id="cad-pcs" actions={<Link className="btn sm" to="/cad/computers">All computers</Link>}>
            <ul className="sys-rows">
              {OP.cadComputers.map((c) => (
                <li key={c.id}>
                  <span className={`sys-dot ${c.status === 'Online' ? 'on' : 'off'}`} aria-hidden="true" />
                  <span className="grow">
                    <strong>{c.id}</strong>
                    <span className="muted small">
                      {c.person} · {c.solidworks}
                      {c.open ? ` · open: ${c.open}` : ''}
                    </span>
                  </span>
                  <StatusBadge status={c.status} tone={computerTone(c)} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent jobs" id="cad-jobs" actions={<Link className="btn sm" to="/cad/jobs">All jobs</Link>}>
            <ul className="sys-rows">
              {OP.cadJobs.slice(0, 5).map((j) => (
                <li key={j.id}>
                  <span className="grow">
                    <RecLink id={j.id} />
                    <span className="muted small">
                      {j.title} · {fmtDateTime(j.started)}
                    </span>
                  </span>
                  <StatusBadge status={j.status} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="erp-stack">
          <Panel title="Connect a new person" id="cad-new">
            <p className="small">Four steps: install for SOLIDWORKS, pair the computer, connect the AI assistant, check it works.</p>
            <Link className="btn primary" to="/cad/setup">
              <PIcon name="checkSquare" /> Open the setup steps
            </Link>
          </Panel>
          <SameAsBefore />
        </div>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Set up

const STEPS = [
  { id: 'install', title: 'Install CAD Automation for SOLIDWORKS' },
  { id: 'pair', title: 'Pair your computer' },
  { id: 'connect', title: 'Connect your AI assistant' },
  { id: 'check', title: 'Check it works' },
] as const;

function useSetupDone() {
  const [done, setDone] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SETUP_KEY) ?? '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(SETUP_KEY, JSON.stringify(done));
    } catch {
      /* private browsing: the steps are not remembered */
    }
  }, [done]);
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  return { done, toggle, count: STEPS.filter((s) => done.includes(s.id)).length };
}

function Prompt({ text }: { text: string }) {
  const copy = useCopy();
  return (
    <div className="sys-prompt">
      <span className="grow">{text}</span>
      <button type="button" className="btn sm" onClick={() => copy(text, 'Request')}>
        <PIcon name="copy" /> Copy
      </button>
    </div>
  );
}

export function CadSetup({ page }: { page: NavPage }) {
  const { done, toggle, count } = useSetupDone();
  const body: Record<string, ReactElement> = {
    install: (
      <>
        <p>One Windows installer adds the add-in to SOLIDWORKS and the Companion, which keeps the secure link. Nothing connects in to your computer.</p>
        <div className="row wrap">
          <a className="btn primary" href={OP.CAD_INSTALLER_URL} target="_blank" rel="noopener">
            <PIcon name="download" /> Download for SOLIDWORKS
          </a>
          <OpenCad path="docs#install" label="Installation guide" />
        </div>
        <p className="muted small">Windows 10 or 11, 64-bit. SOLIDWORKS 2022 or later. Sign in to CAD Automation to download.</p>
      </>
    ),
    pair: (
      <>
        <p>After installing, the Companion opens a pairing window and your browser. Confirm the same code in the browser. Then open SOLIDWORKS.</p>
        <div className="row wrap">
          <Link className="btn" to="/cad/computers">
            <PIcon name="plug" /> See your computers
          </Link>
          <OpenCad path="solidworks#computers" label="Computers in CAD Automation" />
        </div>
      </>
    ),
    connect: (
      <>
        <p>Add this address to your assistant once, then sign in when it asks.</p>
        <ConnectorAddress />
        <AssistantSteps />
      </>
    ),
    check: (
      <>
        <p>Ask your assistant one of these. It reads your file before it changes anything, and asks you in SOLIDWORKS before it deletes or overwrites.</p>
        <Prompt text="Check the CAD Automation connection to SOLIDWORKS." />
        <Prompt text="Run the SOLIDWORKS self test, all three stages." />
      </>
    ),
  };
  return (
    <ModulePage page={page} title="Set up CAD Automation" subtitle="Four steps, about ten minutes. Each person does them once on their own computer." actions={<OpenCad />}>
      <div className="sys-progress" role="status">
        <strong>
          {count} of 4 done
        </strong>
        <span className="sys-progress-bar" aria-hidden="true">
          {STEPS.map((s) => (
            <span key={s.id} className={done.includes(s.id) ? 'on' : ''} />
          ))}
        </span>
      </div>
      <div className="sys-two">
        <ol className="sys-steps" aria-label="Setup steps">
          {STEPS.map((s, i) => {
            const isDone = done.includes(s.id);
            return (
              <li key={s.id} className={`card sys-step${isDone ? ' done' : ''}`} id={`step-${s.id}`}>
                <div className="sys-step-head">
                  <span className="sys-step-n" aria-hidden="true">
                    {isDone ? <PIcon name="check" size={15} /> : i + 1}
                  </span>
                  <h2>{s.title}</h2>
                  <button type="button" className="btn sm ghost" aria-pressed={isDone} onClick={() => toggle(s.id)}>
                    {isDone ? 'Done' : 'Mark done'}
                  </button>
                </div>
                <div className="sys-step-body">{body[s.id]}</div>
              </li>
            );
          })}
        </ol>
        <div className="erp-stack">
          <SameAsBefore />
          <Panel title="Need help?" id="cad-help">
            <ul className="sys-links">
              <li>
                <a href={`${OP.CAD_APP_URL}docs#troubleshooting`} target="_blank" rel="noopener">
                  Troubleshooting
                </a>
              </li>
              <li>
                <a href={`${OP.CAD_APP_URL}docs#requirements`} target="_blank" rel="noopener">
                  System requirements
                </a>
              </li>
              <li>
                <a href={`${OP.CAD_APP_URL}tools`} target="_blank" rel="noopener">
                  Everything CAD Automation can do
                </a>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ Computers

export function CadComputers({ page }: { page: NavPage }) {
  const phone = useMedia(PHONE);
  return (
    <ModulePage
      page={page}
      subtitle="Each Windows computer paired with CAD Automation, with SOLIDWORKS and the add-in it runs."
      actions={
        <Link className="btn primary" to="/cad/setup">
          <PIcon name="plus" /> Pair a computer
        </Link>
      }
    >
      {needsUpdate.length ? (
        <p className="sys-note warning" role="note">
          <PIcon name="info" size={15} /> Add-in {OP.CAD_ADDIN_LATEST} is available for {needsUpdate.map((c) => c.id).join(', ')}. The Companion offers it on that computer.
        </p>
      ) : null}
      {phone ? (
        <ul className="erp-cards">
          {OP.cadComputers.map((c) => (
            <li key={c.id} className="card erp-card">
              <div className="row">
                <strong className="grow">{c.id}</strong>
                <StatusBadge status={c.status} tone={computerTone(c)} />
              </div>
              <span className="muted small">
                {c.person} · {c.solidworks} · add-in {c.addin}
              </span>
              <span className="muted small">Last seen {fmtDateTime(c.lastSeen)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <Panel>
          <div className="erp-table-scroll">
            <table className="data-table erp-table">
              <thead>
                <tr>
                  <th scope="col">Computer</th>
                  <th scope="col">Person</th>
                  <th scope="col">Status</th>
                  <th scope="col">SOLIDWORKS</th>
                  <th scope="col">Add-in</th>
                  <th scope="col">Open now</th>
                  <th scope="col">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {OP.cadComputers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.id}</strong>
                      {c.isDefault ? <span className="muted small"> (default)</span> : null}
                    </td>
                    <td>{c.person}</td>
                    <td>
                      <StatusBadge status={c.status} tone={computerTone(c)} />
                    </td>
                    <td>{c.solidworks}</td>
                    <td>
                      {c.addin}
                      {c.addin !== OP.CAD_ADDIN_LATEST ? (
                        <>
                          {' '}
                          <StatusBadge status="Update available" tone="warning" />
                        </>
                      ) : null}
                    </td>
                    <td>{c.open || <span className="muted">Nothing open</span>}</td>
                    <td>{fmtDateTime(c.lastSeen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      <p className="muted small">A computer is online while its Companion keeps the link open. Remove a computer in CAD Automation's SOLIDWORKS page.</p>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ AI connectors

export function CadConnectors({ page }: { page: NavPage }) {
  return (
    <ModulePage page={page} subtitle="The AI assistants allowed to use CAD Automation, and how to add one." actions={<OpenCad path="assistant" label="CAD Assistant" />}>
      <div className="sys-two">
        <div className="erp-stack">
          <Panel title="Connected assistants" id="cad-ai">
            <ul className="sys-rows">
              {OP.cadConnectors.map((c) => (
                <li key={c.id}>
                  <span className="sys-app" aria-hidden="true">
                    {String(c.app).slice(0, 1)}
                  </span>
                  <span className="grow">
                    <strong>{c.app}</strong>
                    <span className="muted small">
                      {c.person} · connected {fmtDate(c.connected)} · last used {fmtDateTime(c.lastUsed)}
                    </span>
                  </span>
                  <StatusBadge status="Allowed" tone="success" />
                </li>
              ))}
            </ul>
            <p className="muted small">Disconnect an assistant in CAD Automation; it then asks to be allowed again.</p>
          </Panel>
        </div>
        <Panel title="Add an assistant" id="cad-add">
          <p className="small">Add this address to your assistant once, then sign in when it asks.</p>
          <ConnectorAddress />
          <AssistantSteps />
        </Panel>
      </div>
    </ModulePage>
  );
}
