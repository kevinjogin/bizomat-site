// Document templates (business workspaces): how quotes, invoices and credit notes look. Page layout, typeface, accent
// colour, titles, payment details, default terms, the signature block on quotes and the remittance slip on invoices.
// The preview beside the form is a sample drawn by the same engine as every real document, marked "SAMPLE".
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { Icon } from '../components/ui/Icon';
import { ErrorBox, Loading, Switch } from '../components/ui/ui';
import { useConfirm, useToast } from '../components/ui/overlays';
import { fin, useCurrentOrg, useRefresh } from './lib';
import { Hint } from './ui';
import { LivePreview } from './sales-ui';

interface TemplateDTO {
  id: string;
  name: string;
  title: string;
  accent: string;
  paymentInstructions: string;
  footer: string;
  isDefault: boolean;
  layout: 'portrait' | 'landscape';
  font: 'helvetica' | 'times' | 'courier';
  quoteTitle: string;
  creditNoteTitle: string;
  quoteTerms: string;
  invoiceTerms: string;
  showSignature: boolean;
  showRemittance: boolean;
}

type Form = Omit<TemplateDTO, 'id'>;

const blank: Form = { name: 'New template', title: '', accent: '#0f766e', paymentInstructions: '', footer: '', isDefault: false, layout: 'portrait', font: 'helvetica', quoteTitle: 'Quote', creditNoteTitle: 'Credit note', quoteTerms: '', invoiceTerms: '', showSignature: true, showRemittance: true };

export function DocumentTemplates() {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefresh();
  const can = org.perms.settings.manage;
  const q = useQuery({ queryKey: ['fin', org.id, 'templates'], queryFn: () => get<TemplateDTO[]>(fin(org.id, '/templates')) });
  const [selected, setSelected] = useState<string | 'new' | null>(null);
  const [form, setForm] = useState<Form>(blank);
  const [kind, setKind] = useState<'invoice' | 'quote' | 'credit_note'>('invoice');
  const [busy, setBusy] = useState(false);
  const list = q.data ?? [];
  const current = selected === 'new' ? null : (list.find((t) => t.id === selected) ?? list[0] ?? null);
  useEffect(() => {
    if (selected === 'new') return;
    if (current) {
      const { id: _id, ...rest } = current;
      setForm(rest);
    }
  }, [current?.id, selected]);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    setBusy(true);
    try {
      if (selected === 'new') {
        const r = await post<{ id: string }>(fin(org.id, '/templates'), form);
        setSelected(r.id);
      } else if (current) await patch(fin(org.id, `/templates/${current.id}`), form);
      toast('Template saved');
      refresh('templates');
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="card card-pad">
      <h2 className="crm-subhead">Document templates</h2>
      <Hint>How quotes, invoices and credit notes look, as PDFs, previews and online. The default template is used unless a document chooses another.</Hint>
      <div className="row wrap fin-toolbar">
        <select className="select" aria-label="Template" value={selected === 'new' ? 'new' : (current?.id ?? '')} onChange={(e) => setSelected(e.target.value)}>
          {list.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
              {t.isDefault ? ' (default)' : ''}
            </option>
          ))}
          {selected === 'new' ? <option value="new">New template</option> : null}
        </select>
        {can ? (
          <button
            className="btn sm"
            onClick={() => {
              setSelected('new');
              setForm(blank);
            }}
          >
            <Icon name="plus" /> New template
          </button>
        ) : null}
        {can && current && !current.isDefault && selected !== 'new' ? (
          <button
            className="btn sm danger"
            onClick={async () => {
              if (!(await confirm({ title: `Delete the template ${current.name}?`, message: 'Documents that used it use the default template from now on.', confirmLabel: 'Delete', danger: true }))) return;
              try {
                await del(fin(org.id, `/templates/${current.id}`));
                setSelected(null);
                refresh('templates');
                await q.refetch();
              } catch (e) {
                toast(errorMessage(e), 'error');
              }
            }}
          >
            <Icon name="trash" /> Delete
          </button>
        ) : null}
      </div>
      <div className="fin-editor-split">
        <fieldset className="stack" disabled={!can || busy}>
          <div className="fin-form-grid">
            <div className="field">
              <label htmlFor="tp-name">Name</label>
              <input id="tp-name" className="input" maxLength={80} value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="tp-layout">Page</label>
              <select id="tp-layout" className="select" value={form.layout} onChange={(e) => set('layout', e.target.value as Form['layout'])}>
                <option value="portrait">A4 portrait</option>
                <option value="landscape">A4 landscape</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tp-font">Typeface</label>
              <select id="tp-font" className="select" value={form.font} onChange={(e) => set('font', e.target.value as Form['font'])}>
                <option value="helvetica">Sans serif (Helvetica)</option>
                <option value="times">Serif (Times)</option>
                <option value="courier">Fixed width (Courier)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tp-accent">Accent colour</label>
              <input id="tp-accent" className="input" type="color" value={form.accent} onChange={(e) => set('accent', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="tp-title">Invoice title</label>
              <input id="tp-title" className="input" maxLength={40} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Tax invoice (GST) or Invoice" />
            </div>
            <div className="field">
              <label htmlFor="tp-qtitle">Quote title</label>
              <input id="tp-qtitle" className="input" maxLength={40} value={form.quoteTitle} onChange={(e) => set('quoteTitle', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="tp-ctitle">Credit note title</label>
              <input id="tp-ctitle" className="input" maxLength={40} value={form.creditNoteTitle} onChange={(e) => set('creditNoteTitle', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="tp-pay">How to pay (invoices)</label>
            <textarea id="tp-pay" className="input" rows={3} maxLength={1000} value={form.paymentInstructions} onChange={(e) => set('paymentInstructions', e.target.value)} placeholder="For example your bank account name, BSB and account number" />
          </div>
          <div className="crm-form-grid">
            <div className="field">
              <label htmlFor="tp-qterms">Default quote terms</label>
              <textarea id="tp-qterms" className="input" rows={3} maxLength={2000} value={form.quoteTerms} onChange={(e) => set('quoteTerms', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="tp-iterms">Default invoice terms</label>
              <textarea id="tp-iterms" className="input" rows={3} maxLength={2000} value={form.invoiceTerms} onChange={(e) => set('invoiceTerms', e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="tp-footer">Footer</label>
            <textarea id="tp-footer" className="input" rows={2} maxLength={1000} value={form.footer} onChange={(e) => set('footer', e.target.value)} />
          </div>
          {(
            [
              ['showSignature', 'Signature lines on quotes', 'Name, signature and date, for customers who accept on paper.'],
              ['showRemittance', 'Remittance slip on invoices', 'A tear-off slip at the foot of the last page.'],
              ['isDefault', 'The default template', 'Used by every document that does not choose another.'],
            ] as const
          ).map(([key, label, hint]) => (
            <div className="row" key={key}>
              <Switch checked={form[key]} onChange={(v) => set(key, v)} label={label} />
              <div className="grow">
                <div>{label}</div>
                <div className="muted small">{hint}</div>
              </div>
            </div>
          ))}
          {can ? (
            <div className="row">
              <button className="btn primary" onClick={save} disabled={busy || !form.name.trim()}>
                {busy ? 'Saving…' : 'Save template'}
              </button>
            </div>
          ) : (
            <p className="muted small">Only people who manage the workspace settings change templates.</p>
          )}
        </fieldset>
        <div className="stack">
          <div className="row">
            <label htmlFor="tp-kind" className="small">
              Preview as
            </label>
            <select id="tp-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
              <option value="invoice">Invoice</option>
              <option value="quote">Quote</option>
              <option value="credit_note">Credit note</option>
            </select>
          </div>
          <LivePreview path={fin(org.id, '/templates/preview')} body={{ ...form, kind }} label="Sample" />
        </div>
      </div>
    </section>
  );
}
