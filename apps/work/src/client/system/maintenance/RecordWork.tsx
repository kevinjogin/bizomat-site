// Record work already done: a work order made and completed in one step (POST /work-orders/done), with the time it took,
// any downtime and an optional sign-off; and the Settings section for completing work orders. Supervisors and
// administrators always record work done; technicians only their own, while an administrator allows it. The server
// decides (src/worker/maintenance/routes-job.ts); this screen follows its answers.
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, patch, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Switch } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { JOB_TYPE_LABELS, PRIORITY_LABELS, localToMs, localToday, mtPage, mtPath, type MtMe, type Priority, type WorkOrder } from './api';
import { Section, options } from './common';
import { AssetPicker, DepartmentField, PersonSelect, useAssetLabel, type PickedAsset } from './pickers';
import { SignOffFields, emptySignOff, showSignOffProblem, signOffProblem, signatureBody, signatureRequired, type SignOffValue } from './SignOff';

export function RecordWorkPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Record work done');
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const preset = useAssetLabel(companyId, params.get('assetId') ?? '');
  const [asset, setAsset] = useState<PickedAsset | null>(null);
  const [form, setForm] = useState({ description: '', jobType: 'corrective', priority: 'medium' as Priority, trade: '', contractor: '', doneDate: localToday(), doneBy: '', hours: '', minutes: '', notes: '' });
  const [dept, setDept] = useState({ departmentId: '', department: '' });
  const [down, setDown] = useState({ on: false, from: '', to: '', cause: '' });
  const [sign, setSign] = useState<SignOffValue>(emptySignOff);
  const [requestKey] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (preset && preset.number !== '…' && !asset) setAsset(preset);
  }, [preset, asset]);
  if (!me.can.recordWork) {
    return (
      <p className="muted">
        {me.role === 'technician'
          ? 'Recording work already done is for supervisors and administrators. An administrator can let technicians do it in Maintenance settings.'
          : 'Report a fault instead, and a supervisor will make a work order.'}
      </p>
    );
  }
  const manager = me.can.manageWork;
  const f = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((x) => ({ ...x, [k]: e.target.value }));
  const total = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0);
  const problem = signOffProblem(sign, me.requireSignature);
  const downProblem = down.on && (!down.from || !down.to || (localToMs(down.to) ?? 0) < (localToMs(down.from) ?? 0)) ? 'Give when the asset went down and when it was back up.' : null;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!asset) return toast('Choose the asset', 'error');
    setBusy(true);
    try {
      const w = await post<WorkOrder>(mtPath(companyId, '/work-orders/done'), {
        assetId: asset.id,
        description: form.description.trim(),
        jobType: form.jobType,
        priority: form.priority,
        trade: form.trade,
        contractor: form.contractor,
        department: dept.department,
        departmentId: dept.departmentId || null,
        doneDate: form.doneDate,
        ...(manager && form.doneBy ? { doneBy: form.doneBy } : {}),
        ...(total > 0 ? { minutes: Math.round(total) } : {}),
        notes: form.notes.trim(),
        ...(down.on ? { downtime: { startedAt: localToMs(down.from), endedAt: localToMs(down.to), cause: down.cause } } : {}),
        signature: signatureBody(sign),
        requestKey,
        tzOffset: new Date().getTimezoneOffset(),
      });
      toast(`Work order ${w.number} recorded as done`);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      navigate(mtPage(companyId, `/work-orders/${w.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
      if (signatureRequired(err)) await qc.invalidateQueries({ queryKey: ['mt', companyId, 'me'] });
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="stack" onSubmit={submit}>
      <h2 className="crm-subhead">Record work already done</h2>
      <p className="muted small">For work that is already finished: the work order is made and completed in one step, and counts in the reports like any completed work order.</p>
      <section className="card card-pad stack">
        <AssetPicker companyId={companyId} id="mtd-asset" label="Asset (required)" value={asset} onChange={setAsset} allowNone={false} />
        <div className="field">
          <label htmlFor="mtd-desc">The job (required)</label>
          <textarea id="mtd-desc" className="textarea" rows={2} required maxLength={5000} value={form.description} onChange={f('description')} />
        </div>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="mtd-type">Job type</label><select id="mtd-type" className="select" value={form.jobType} onChange={f('jobType')}>{options(JOB_TYPE_LABELS)}</select></div>
          <div className="field"><label htmlFor="mtd-priority">Priority</label><select id="mtd-priority" className="select" value={form.priority} onChange={f('priority')}>{options(PRIORITY_LABELS)}</select></div>
          <div className="field"><label htmlFor="mtd-trade">Trade</label><input id="mtd-trade" className="input" maxLength={80} value={form.trade} onChange={f('trade')} placeholder="For example: Fitter, Electrician" /></div>
          <div className="field"><label htmlFor="mtd-contractor">Contractor</label><input id="mtd-contractor" className="input" maxLength={200} value={form.contractor} onChange={f('contractor')} /></div>
          <DepartmentField me={me} id="mtd-dept" departmentId={dept.departmentId} department={dept.department} onChange={setDept} />
        </div>
      </section>
      <section className="card card-pad stack" aria-labelledby="mtd-when">
        <h3 className="crm-subhead" id="mtd-when">When and who</h3>
        <div className="crm-form-grid">
          <div className="field"><label htmlFor="mtd-date">Date done (required)</label><input id="mtd-date" className="input" type="date" required max={localToday()} value={form.doneDate} onChange={f('doneDate')} /></div>
          {manager ? (
            <PersonSelect me={me} id="mtd-by" label="Done by" minRole="technician" value={form.doneBy} onChange={(v) => setForm((x) => ({ ...x, doneBy: v }))} empty="Me" />
          ) : (
            <div className="field"><span className="small">Done by: you</span></div>
          )}
          <div className="field"><label htmlFor="mtd-h">Hours</label><input id="mtd-h" className="input" type="number" inputMode="numeric" min="0" max="24" step="1" value={form.hours} onChange={f('hours')} /></div>
          <div className="field"><label htmlFor="mtd-m">Minutes</label><input id="mtd-m" className="input" type="number" inputMode="numeric" min="0" max="59" step="1" value={form.minutes} onChange={f('minutes')} /></div>
        </div>
        <p className="muted small">Parts from the maintenance stores are not issued here. If stock was used, a supervisor can reopen the work order to issue it.</p>
      </section>
      <section className="card card-pad stack" aria-labelledby="mtd-down">
        <h3 className="crm-subhead" id="mtd-down">Downtime (optional)</h3>
        <label className="checkbox"><input type="checkbox" checked={down.on} onChange={(e) => setDown((x) => ({ ...x, on: e.target.checked }))} /> The asset was down</label>
        {down.on ? (
          <div className="crm-form-grid">
            <div className="field"><label htmlFor="mtd-down-from">Down from</label><input id="mtd-down-from" className="input" type="datetime-local" value={down.from} onChange={(e) => setDown((x) => ({ ...x, from: e.target.value }))} /></div>
            <div className="field"><label htmlFor="mtd-down-to">Back up at</label><input id="mtd-down-to" className="input" type="datetime-local" value={down.to} onChange={(e) => setDown((x) => ({ ...x, to: e.target.value }))} /></div>
            <div className="field crm-span"><label htmlFor="mtd-down-cause">Cause</label><input id="mtd-down-cause" className="input" maxLength={500} value={down.cause} onChange={(e) => setDown((x) => ({ ...x, cause: e.target.value }))} /></div>
          </div>
        ) : null}
        {downProblem ? <p className="small mt-sign-problem" role="status">{downProblem}</p> : null}
      </section>
      <section className="card card-pad stack">
        <div className="field">
          <label htmlFor="mtd-notes">What was done and what was found (required)</label>
          <textarea id="mtd-notes" className="textarea" rows={4} required maxLength={10000} value={form.notes} onChange={f('notes')} />
        </div>
        <SignOffFields me={me} value={sign} onChange={setSign} idPrefix="mtd-sign" />
        {showSignOffProblem(sign, me.requireSignature) ? <p className="small mt-sign-problem" role="status">{problem}</p> : null}
      </section>
      <div className="row wrap">
        <button className="btn primary lg" disabled={busy || !asset || !form.description.trim() || !form.notes.trim() || !form.doneDate || total > 1440 || !!problem || !!downProblem}>{busy ? 'Recording…' : 'Record the work'}</button>
        <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </form>
  );
}

/** Maintenance Settings: whether completing needs a signature, and whether technicians record work already done. */
export function WorkOrderSettingsSection({ companyId, me }: { companyId: string; me: MtMe }) {
  const qc = useQueryClient();
  const toast = useToast();
  const save = async (change: { requireSignature?: boolean; techniciansRecordWork?: boolean }) => {
    try {
      await patch(mtPath(companyId, '/settings/work-orders'), change);
      toast('Saved');
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const only = me.can.roles ? '' : ' Only maintenance administrators change these.';
  return (
    <Section title="Completing work orders">
      <div className="row wrap">
        <Switch checked={me.requireSignature} disabled={!me.can.roles} onChange={(v) => void save({ requireSignature: v })} label="Completion needs a signature" />
        <span className="grow">Completion needs a signature</span>
      </div>
      <p className="muted small">{me.requireSignature ? 'Completing a work order asks for the name and signature of the person signing. Someone who cannot draw on the screen signs with the typed name instead.' : 'A signature is optional when a work order is completed.'} The signature is a picture drawn on screen, or a typed name, not a verified electronic signature.</p>
      <div className="row wrap">
        <Switch checked={me.techniciansRecordWork} disabled={!me.can.roles} onChange={(v) => void save({ techniciansRecordWork: v })} label="Technicians can record work already done" />
        <span className="grow">Technicians can record work already done</span>
      </div>
      <p className="muted small">Supervisors and administrators always can. A technician records only their own work.{only}</p>
    </Section>
  );
}
