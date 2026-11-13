// Registering a company, and editing its details: one form, checked as you type (POST /company/check) and again by the
// server when saved. Every check says what it proves: the ABN's check digits always, the Australian Business Register
// when the lookup is set up; the email's mail servers, then a confirmation link; the phone number against the numbering
// plan (no SMS is sent); the postcode against the state.
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, post } from '../lib/api';
import { useSession } from '../lib/session';
import { usePageTitle } from '../lib/hooks';
import { PageHeader } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import { ProductLockup } from '../components/ui/Icon';
import { STATES, TOOL_APPS, TOOL_NAMES, useMine, type AbnStatus, type CompanyDTO, type ToolApp } from './lib';

export interface Details {
  kind: 'business' | 'individual';
  name: string;
  legalName: string;
  abn: string;
  acn: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  state: string;
  postcode: string;
  website: string;
}

export function detailsOf(c: CompanyDTO): Details {
  return {
    kind: c.kind,
    name: c.name,
    legalName: c.register ? '' : c.legalName,
    abn: c.abn ?? '',
    acn: c.acn ?? '',
    email: c.email,
    phone: c.phone,
    addressLine1: c.address.line1,
    addressLine2: c.address.line2,
    suburb: c.address.suburb,
    state: c.address.state,
    postcode: c.address.postcode,
    website: c.website,
  };
}

interface CheckResult {
  problems: { field: string; message: string }[];
  warnings: string[];
  abnStatus: AbnStatus;
  register: { entityName: string; entityType: string; gstFrom: string | null; state: string; postcode: string } | null;
  phone: string | null;
}

/** Checks the details as they are typed (after a pause), and returns the server's answer. */
function useLiveCheck(d: Details, exceptId?: string) {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [touched, setTouched] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (!touched) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        setResult(await post<CheckResult>(`/company/check${exceptId ? `?except=${encodeURIComponent(exceptId)}` : ''}`, d));
      } catch {
        /* the save checks again */
      }
    }, 700);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [d, touched, exceptId]);
  return { result, touch: () => setTouched(true), setResult };
}

const empty = (email: string): Details => ({ kind: 'business', name: '', legalName: '', abn: '', acn: '', email, phone: '', addressLine1: '', addressLine2: '', suburb: '', state: 'NSW', postcode: '', website: '' });

/** The details fields, with the problems and warnings of the last check. */
export function DetailsFields({ d, set, result, kindLocked }: { d: Details; set: (d: Details) => void; result: CheckResult | null; kindLocked?: boolean }) {
  const problem = (field: string) => result?.problems.find((p) => p.field === field)?.message ?? null;
  const input = (field: keyof Details, label: string, opts: { hint?: string; placeholder?: string; inputMode?: 'numeric' | 'tel' | 'email' | 'url'; required?: boolean; span?: boolean; max?: number; autoComplete?: string } = {}) => {
    const err = problem(field);
    return (
      <div className={`field${opts.span ? ' crm-span' : ''}`}>
        <label htmlFor={`co-${field}`}>
          {label}
          {opts.required ? null : <span className="muted small"> (optional)</span>}
        </label>
        <input
          id={`co-${field}`}
          className={`input${err ? ' invalid' : ''}`}
          value={d[field]}
          maxLength={opts.max ?? 120}
          required={opts.required}
          inputMode={opts.inputMode}
          type={opts.inputMode === 'email' ? 'email' : opts.inputMode === 'url' ? 'url' : 'text'}
          placeholder={opts.placeholder}
          autoComplete={opts.autoComplete}
          aria-invalid={!!err}
          aria-describedby={`co-${field}-note`}
          onChange={(e) => set({ ...d, [field]: e.target.value })}
        />
        <span id={`co-${field}-note`} className={err ? 'error' : 'hint'}>
          {err ?? opts.hint ?? ''}
        </span>
      </div>
    );
  };
  const business = d.kind === 'business';
  return (
    <>
      <fieldset className="fin-kind-choice co-kind-choice" aria-label="Who the account is for" disabled={kindLocked}>
        <label>
          <input type="radio" name="kind" checked={business} onChange={() => set({ ...d, kind: 'business' })} />
          <strong>A business</strong>
          <span className="muted small">A company, partnership, trust or sole trader, registered with its ABN.</span>
        </label>
        <label>
          <input type="radio" name="kind" checked={!business} onChange={() => set({ ...d, kind: 'individual' })} />
          <strong>Myself, in my own name</strong>
          <span className="muted small">You work as yourself. Add your ABN if you have one.</span>
        </label>
      </fieldset>
      <div className="crm-form-grid">
        {input('name', business ? 'Business name' : 'Your full name', { required: true, span: true, placeholder: business ? 'As customers know it' : 'First and last name', autoComplete: business ? 'organization' : 'name' })}
        {input('abn', 'ABN (Australian Business Number)', { required: business, inputMode: 'numeric', max: 20, placeholder: '11 digits', hint: 'As on your ABN registration. Its check digits are verified.' })}
        {business ? input('acn', 'ACN', { inputMode: 'numeric', max: 20, placeholder: '9 digits', hint: 'For a company registered with ASIC.' }) : <div />}
        {business ? input('legalName', 'Legal name', { span: true, max: 200, hint: 'Taken from the Australian Business Register when the ABN is looked up.' }) : null}
        {input('email', 'Contact email', { required: true, inputMode: 'email', max: 320, autoComplete: 'email', hint: 'Its mail servers are checked; a confirmation link is sent unless it is your own confirmed sign-in address.' })}
        {input('phone', 'Phone', { required: true, inputMode: 'tel', max: 30, autoComplete: 'tel', placeholder: '04xx xxx xxx or (0x) xxxx xxxx', hint: result?.phone ? `Checked against the Australian numbering plan: ${result.phone}` : 'An Australian mobile, landline, 13, 1300 or 1800 number.' })}
        {input('addressLine1', 'Street address', { required: true, span: true, autoComplete: 'address-line1', placeholder: 'Number and street, or PO Box', hint: 'Include the street number, or the PO Box or Locked Bag number.' })}
        {input('addressLine2', 'Address line 2', { span: true, autoComplete: 'address-line2', placeholder: 'Unit, level or building' })}
        {input('suburb', 'Suburb or town', { required: true, max: 60, autoComplete: 'address-level2' })}
        <div className="field">
          <label htmlFor="co-state">State or territory</label>
          <select id="co-state" className="select" value={d.state} autoComplete="address-level1" onChange={(e) => set({ ...d, state: e.target.value })}>
            {STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <span className={problem('state') ? 'error' : 'hint'}>{problem('state') ?? ''}</span>
        </div>
        {input('postcode', 'Postcode', { required: true, inputMode: 'numeric', max: 4, autoComplete: 'postal-code', placeholder: '4 digits', hint: 'Checked against the state.' })}
        {input('website', 'Website', { inputMode: 'url', max: 200, placeholder: 'https://' })}
      </div>
      {result?.register ? (
        <div className="co-register card card-pad">
          <strong>Australian Business Register</strong>
          <div className="small">
            {result.register.entityName} · {result.register.entityType || 'Entity'} · {result.register.state} {result.register.postcode}
            {result.register.gstFrom ? ` · registered for GST from ${result.register.gstFrom}` : ' · not registered for GST'}
          </div>
        </div>
      ) : null}
      {result?.warnings.length ? (
        <ul className="co-warnings" aria-label="Things to check">
          {result.warnings.map((w) => (
            <li key={w} className="small">
              {w}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

type ToolChoice = { create: true } | { link: string } | null;

/** /new: register a company and choose its tools. */
export function Register() {
  usePageTitle('Register your company');
  const { session } = useSession();
  const mine = useMine();
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [d, setD] = useState<Details>(() => empty(session?.user.email ?? ''));
  const { result, touch, setResult } = useLiveCheck(d);
  const [tools, setTools] = useState<Record<ToolApp, ToolChoice>>({ tasks: { create: true }, crm: { create: true }, finance: { create: true } });
  const [busy, setBusy] = useState(false);
  const set = (next: Details) => {
    setD(next);
    touch();
  };
  const owned = mine.data?.ownedTools;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await post<{ company: CompanyDTO; emailConfirmation: string | null }>('/company/companies', { ...d, tools });
      await qc.invalidateQueries({ queryKey: ['company'] });
      toast(r.emailConfirmation === 'sent' ? `Company registered. Check ${r.company.email} for the confirmation link.` : 'Company registered');
      navigate(`/c/${r.company.id}/overview`);
    } catch (err) {
      const details = err instanceof ApiError ? (err.details as { problems?: CheckResult['problems']; warnings?: string[] } | undefined) : undefined;
      if (details?.problems) setResult({ problems: details.problems, warnings: details.warnings ?? [], abnStatus: 'none', register: null, phone: null });
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="crm-start">
      <header className="row crm-start-head">
        <ProductLockup height={18} />
        <span className="grow" />
        <span className="muted small">{session?.user.email}</span>
      </header>
      <div className="page crm-page">
        <PageHeader
          title="Register your company"
          subtitle="BIZOMAT works as a company: your people, departments, projects, customers and money in one account, with one sign-in. If you work for yourself, register in your own name."
        />
        <form className="card card-pad stack crm-start-form co-register-form" onSubmit={submit} noValidate>
          <DetailsFields d={d} set={set} result={result} />
          <h2 className="crm-subhead">Tools</h2>
          <p className="muted small">Each tool gets its own space for the company. You own them all and choose who else uses each one.</p>
          <div className="co-tool-choices">
            {TOOL_APPS.map((app) => {
              const choice = tools[app];
              const mineOf = owned?.[app] ?? [];
              const value = choice === null ? 'none' : 'link' in choice ? `link:${choice.link}` : 'create';
              return (
                <div key={app} className="field">
                  <label htmlFor={`co-tool-${app}`}>{TOOL_NAMES[app]}</label>
                  <select
                    id={`co-tool-${app}`}
                    className="select"
                    value={value}
                    onChange={(e) => {
                      const v = e.target.value;
                      setTools({ ...tools, [app]: v === 'none' ? null : v === 'create' ? { create: true } : { link: v.slice(5) } });
                    }}
                  >
                    <option value="create">Create new</option>
                    {mineOf.map((t) => (
                      <option key={t.id} value={`link:${t.id}`}>
                        Use {t.name}
                      </option>
                    ))}
                    <option value="none">Not now</option>
                  </select>
                  {app === 'finance' ? <span className="hint">Only business workspaces can belong to a company. Personal and household workspaces stay private.</span> : null}
                </div>
              );
            })}
          </div>
          <div className="row">
            <button className="btn primary" type="submit" disabled={busy || !d.name.trim()}>
              {busy ? 'Registering…' : 'Register company'}
            </button>
            <span className="muted small">Nothing is sent to the Australian Business Register except the ABN.</span>
          </div>
        </form>
      </div>
    </div>
  );
}

/** The settings page's details form: the same fields and checks, saved with PATCH. */
export function useDetailsEditor(company: CompanyDTO) {
  const [d, setD] = useState<Details>(() => detailsOf(company));
  const { result, touch, setResult } = useLiveCheck(d, company.id);
  return {
    d,
    set: (next: Details) => {
      setD(next);
      touch();
    },
    result,
    setResult,
    reset: () => setD(detailsOf(company)),
  };
}
