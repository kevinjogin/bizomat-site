// Registration outside Australia (Stage 1; flag international_registration, off until a platform admin switches it on).
// The country's own registration numbers and legal structures come from the server (/company/registration-options,
// src/worker/company/countries.ts); the server checks everything again. When the number is already registered, the
// person can ask that company's owner to let them join instead (flag join_requests).
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, post } from '../lib/api';
import { useToast } from '../components/ui/overlays';

export interface CountryOption {
  code: string;
  name: string;
  identifiers: { type: string; label: string; example: string; register: string | null }[];
  structures: { id: string; label: string }[];
  noNumber: string[];
  note: string;
}
export interface RegistrationOptions {
  countries: CountryOption[];
  international: boolean;
  joinRequests: boolean;
}

export const useRegistrationOptions = () => useQuery({ queryKey: ['company', 'registration-options'], queryFn: () => get<RegistrationOptions>('/company/registration-options'), staleTime: 5 * 60_000 });

/** Any other country: the server's default rule (a registration number, verified by hand with evidence). */
const OTHER = (code: string): CountryOption => ({
  code,
  name: code,
  identifiers: [{ type: 'OTHER', label: 'Registration number', example: 'As on the certificate', register: null }],
  structures: [
    { id: 'company', label: 'Company' },
    { id: 'sole_trader', label: 'Sole trader' },
    { id: 'other', label: 'Other' },
  ],
  noNumber: ['sole_trader'],
  note: 'Verified by hand with evidence.',
});

export function InternationalForm({ country, options, email }: { country: string; options: RegistrationOptions; email: string }) {
  const rule = options.countries.find((c) => c.code === country) ?? OTHER(country);
  const navigate = useNavigate();
  const toast = useToast();
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: '',
    legalName: '',
    tradingName: '',
    structure: rule.structures[0]?.id ?? 'company',
    registrationType: rule.identifiers[0]?.type ?? 'OTHER',
    registrationNumber: '',
    email,
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    region: '',
    postcode: '',
    website: '',
  });
  const [busy, setBusy] = useState(false);
  const [exists, setExists] = useState<{ canJoin: boolean } | null>(null);
  const [asked, setAsked] = useState<string | null>(null);
  const needsNumber = !rule.noNumber.includes(f.structure);
  const id = rule.identifiers.find((i) => i.type === f.registrationType) ?? rule.identifiers[0];
  const field = (key: keyof typeof f) => ({ value: f[key], onChange: (e: { target: { value: string } }) => setF({ ...f, [key]: e.target.value }) });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setExists(null);
    try {
      const r = await post<{ company: { id: string } }>('/company/companies/international', { ...f, country, registrationNumber: needsNumber || f.registrationNumber ? f.registrationNumber : '' });
      await qc.invalidateQueries({ queryKey: ['company'] });
      toast('Company registered. Add its tools under Tools.');
      navigate(`/c/${r.company.id}/tools`);
    } catch (err) {
      const d = err instanceof ApiError ? (err.details as { code?: string; requestToJoin?: boolean } | undefined) : undefined;
      if (d?.code === 'COMPANY_EXISTS') setExists({ canJoin: !!d.requestToJoin });
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const askToJoin = async () => {
    try {
      const r = await post<{ message: string }>('/company/join-requests', { country, type: f.registrationType, number: f.registrationNumber });
      setAsked(r.message);
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };

  return (
    <form className="card card-pad stack crm-start-form co-register-form" onSubmit={submit} noValidate>
      <p className="muted small">{rule.note}</p>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="in-name">Company name</label><input id="in-name" className="input" maxLength={100} required {...field('name')} /></div>
        <div className="field"><label htmlFor="in-legal">Legal name</label><input id="in-legal" className="input" maxLength={200} required {...field('legalName')} /></div>
        <div className="field"><label htmlFor="in-trading">Trading name <span className="muted small">(optional)</span></label><input id="in-trading" className="input" maxLength={100} {...field('tradingName')} /></div>
        <div className="field">
          <label htmlFor="in-structure">Legal structure</label>
          <select id="in-structure" className="select" {...field('structure')}>
            {rule.structures.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="in-type">Registration number type</label>
          <select id="in-type" className="select" {...field('registrationType')}>
            {rule.identifiers.map((i) => <option key={i.type} value={i.type}>{i.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="in-number">Registration number {needsNumber ? null : <span className="muted small">(optional for this structure)</span>}</label>
          <input id="in-number" className="input" maxLength={60} placeholder={id?.example} required={needsNumber} {...field('registrationNumber')} />
          <span className="hint">{id?.register ? 'Checked with the official register when checks are switched on.' : 'Verified by hand: you can upload a registration certificate after registering.'}</span>
        </div>
        <div className="field"><label htmlFor="in-email">Company email</label><input id="in-email" className="input" type="email" maxLength={320} required {...field('email')} /></div>
        <div className="field"><label htmlFor="in-phone">Phone (with country code)</label><input id="in-phone" className="input" maxLength={30} placeholder="+44 20 7946 0000" required {...field('phone')} /></div>
        <div className="field"><label htmlFor="in-a1">Registered address</label><input id="in-a1" className="input" maxLength={200} required {...field('addressLine1')} /></div>
        <div className="field"><label htmlFor="in-a2">Address line 2 <span className="muted small">(optional)</span></label><input id="in-a2" className="input" maxLength={200} {...field('addressLine2')} /></div>
        <div className="field"><label htmlFor="in-city">City or town</label><input id="in-city" className="input" maxLength={100} required {...field('city')} /></div>
        <div className="field"><label htmlFor="in-region">State, county or region <span className="muted small">(optional)</span></label><input id="in-region" className="input" maxLength={60} {...field('region')} /></div>
        <div className="field"><label htmlFor="in-postcode">Postcode <span className="muted small">(optional)</span></label><input id="in-postcode" className="input" maxLength={12} {...field('postcode')} /></div>
        <div className="field"><label htmlFor="in-web">Website <span className="muted small">(optional)</span></label><input id="in-web" className="input" maxLength={200} {...field('website')} /></div>
      </div>
      {exists ? (
        <div className="info-box" role="status">
          {asked ?? (exists.canJoin ? 'This company is already registered on BIZOMAT. You can ask its owner to let you join.' : 'This company is already registered on BIZOMAT. Ask its owner to invite you.')}
          {exists.canJoin && !asked ? <div><button className="btn sm" type="button" onClick={askToJoin}>Request to join</button></div> : null}
        </div>
      ) : null}
      <div className="row">
        <button className="btn primary" type="submit" disabled={busy || !f.name.trim() || !f.legalName.trim()}>{busy ? 'Registering…' : 'Register company'}</button>
        <span className="muted small">Registering is free. The registration number is sent only to the official register of {rule.name}, where one is used.</span>
      </div>
    </form>
  );
}
