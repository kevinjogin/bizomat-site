import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { errorMessage, patch, upload } from '../../lib/api';
import { useUser } from '../../lib/session';
import { applyTheme, type ThemePref } from '../../lib/hooks';
import { Avatar, Field } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/overlays';

const FALLBACK_ZONES = ['UTC', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Africa/Nairobi', 'Africa/Lagos', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Sao_Paulo'];

export function timeZones(): string[] {
  try {
    const list = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.('timeZone');
    if (list && list.length) return list.includes('UTC') ? list : ['UTC', ...list];
  } catch {
    /* ignore */
  }
  return FALLBACK_ZONES;
}

// Language-ready: strings are centralised per locale; English is the only bundled locale today.
const LOCALES = [
  { id: 'en', label: 'English', available: true },
  { id: 'fr', label: 'Français (coming soon)', available: false },
  { id: 'es', label: 'Español (coming soon)', available: false },
  { id: 'sw', label: 'Kiswahili (coming soon)', available: false },
];

export function ProfileSettings() {
  const user = useUser();
  const qc = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone);
  const [locale, setLocale] = useState(user.locale);
  const [theme, setTheme] = useState<ThemePref>(user.theme);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const zones = timeZones();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await patch('/me', { name: name.trim(), timezone, locale, theme });
      applyTheme(theme);
      await qc.invalidateQueries({ queryKey: ['me'] });
      toast('Profile saved');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const onAvatar = async (file?: File) => {
    if (!file) return;
    const form = new FormData();
    form.set('file', file);
    form.set('scope', 'avatar');
    try {
      await upload(form);
      await qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['members'] });
      toast('Avatar updated');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <form className="card card-pad" onSubmit={save}>
      <h2 style={{ marginBottom: 16 }}>Profile</h2>
      <div className="row" style={{ marginBottom: 20, gap: 16 }}>
        <Avatar name={user.name} id={user.id} url={user.avatarUrl} size="lg" />
        <div className="col" style={{ gap: 4 }}>
          <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={14} /> Upload photo
          </button>
          <span className="muted small">PNG, JPEG, GIF or WebP, up to 5 MB.</span>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => onAvatar(e.target.files?.[0])} aria-label="Avatar file" />
        </div>
      </div>
      <Field label="Full name" htmlFor="p-name">
        <input id="p-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
      </Field>
      <Field label="Email" htmlFor="p-email" hint="Your sign-in email cannot be changed here.">
        <input id="p-email" className="input" value={user.email} disabled />
      </Field>
      <Field label="Time zone" htmlFor="p-tz" hint="Used for due dates, My Work and My Day.">
        <select id="p-tz" className="select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {zones.includes(timezone) ? null : <option value={timezone}>{timezone}</option>}
          {zones.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
      </Field>
      <Field label="Language" htmlFor="p-locale">
        <select id="p-locale" className="select" value={locale} onChange={(e) => setLocale(e.target.value)}>
          {LOCALES.map((l) => <option key={l.id} value={l.id} disabled={!l.available}>{l.label}</option>)}
        </select>
      </Field>
      <Field label="Theme" htmlFor="p-theme">
        <select id="p-theme" className="select" value={theme} onChange={(e) => setTheme(e.target.value as ThemePref)}>
          <option value="system">Match system</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </Field>
      <button className="btn primary" disabled={busy || !name.trim()}>{busy ? 'Saving…' : 'Save changes'}</button>
    </form>
  );
}
