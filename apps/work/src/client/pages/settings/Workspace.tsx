import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, upload } from '../../lib/api';
import { isAdmin, useSession, useWorkspace } from '../../lib/session';
import { ColorSwatches, ErrorBox, Field, Loading, Switch } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { PALETTE } from '../../../shared/columns';
import { BRAND } from '../../lib/brand';

/** Workspace colours: BIZOMAT teal (the default for new workspaces) first, then the shared palette. */
const WORKSPACE_COLORS = [BRAND.defaultColor, ...PALETTE];

export function WorkspaceSettings() {
  const ws = useWorkspace();
  const admin = isAdmin(ws.role);
  const q = useQuery({ queryKey: ['workspace', ws.id], queryFn: () => get<any>(`/workspaces/${ws.id}`) });
  const [name, setName] = useState(ws.name);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(ws.color);
  const [allowInvite, setAllowInvite] = useState(false);
  const [defaultRole, setDefaultRole] = useState<'member' | 'viewer'>('member');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { refresh } = useSession();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.data) return;
    setName(q.data.name);
    setDescription(q.data.description ?? '');
    setColor(q.data.color);
    setAllowInvite(!!q.data.settings?.allowMembersToInvite);
    setDefaultRole(q.data.settings?.defaultMemberRole ?? 'member');
  }, [q.data]);

  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await patch(`/workspaces/${ws.id}`, { name: name.trim(), description, color, settings: { allowMembersToInvite: allowInvite, defaultMemberRole: defaultRole } });
      await refresh();
      qc.invalidateQueries({ queryKey: ['workspace', ws.id] });
      toast('Workspace saved');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const onLogo = async (file?: File) => {
    if (!file) return;
    const form = new FormData();
    form.set('file', file);
    form.set('scope', 'logo');
    form.set('workspaceId', ws.id);
    try {
      await upload(form);
      await refresh();
      toast('Logo updated');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };
  const remove = async () => {
    const ok = await confirm({
      title: `Delete ${ws.name}?`,
      message: 'All boards, documents, dashboards and members of this workspace will lose access. This cannot be undone from the app.',
      danger: true,
      confirmLabel: 'Delete workspace',
      typeToConfirm: ws.name,
    });
    if (!ok) return;
    try {
      await del(`/workspaces/${ws.id}`, { confirmName: ws.name });
      await refresh();
      navigate('/', { replace: true });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };

  return (
    <div className="col" style={{ gap: 16 }}>
      <form className="card card-pad" onSubmit={save}>
        <h2 style={{ marginBottom: 12 }}>Workspace</h2>
        {!admin ? <div className="info-box" style={{ marginBottom: 12 }}>Only workspace admins can change these settings.</div> : null}
        <div className="row" style={{ marginBottom: 16, gap: 14 }}>
          <div className="ws-swatch" style={{ background: color, width: 52, height: 52 }}>
            {ws.logoUrl ? <img src={ws.logoUrl} alt="" /> : ws.name[0]?.toUpperCase()}
          </div>
          {admin ? (
            <div className="col" style={{ gap: 4 }}>
              <button type="button" className="btn sm" onClick={() => fileRef.current?.click()}><Icon name="upload" size={14} /> Upload logo</button>
              <span className="muted small">Square image, up to 5 MB.</span>
              <input ref={fileRef} type="file" hidden accept="image/png,image/jpeg,image/gif,image/webp" onChange={(e) => onLogo(e.target.files?.[0])} aria-label="Logo file" />
            </div>
          ) : null}
        </div>
        <fieldset disabled={!admin} style={{ border: 0, padding: 0, margin: 0 }}>
          <Field label="Name" htmlFor="ws-name-s"><input id="ws-name-s" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required /></Field>
          <Field label="Description" htmlFor="ws-desc"><textarea id="ws-desc" className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} /></Field>
          <Field label="Colour"><ColorSwatches value={color} onChange={setColor} colors={WORKSPACE_COLORS} /></Field>
          <div className="row" style={{ marginBottom: 12 }}>
            <Switch label="Allow members to invite" checked={allowInvite} onChange={setAllowInvite} />
            <span>Allow members (not just admins) to invite people</span>
          </div>
          <Field label="Default role for new members" htmlFor="ws-default-role">
            <select id="ws-default-role" className="select" value={defaultRole} onChange={(e) => setDefaultRole(e.target.value as 'member' | 'viewer')}>
              <option value="member">Member — can create and edit</option>
              <option value="viewer">Viewer — read and comment only</option>
            </select>
          </Field>
          <button className="btn primary" disabled={busy || !name.trim()}>{busy ? 'Saving…' : 'Save workspace'}</button>
        </fieldset>
      </form>
      {ws.role === 'owner' ? (
        <section className="card card-pad" style={{ borderColor: 'var(--danger)' }}>
          <h2 className="danger-text" style={{ marginBottom: 8 }}>Danger zone</h2>
          <p className="muted">Deleting the workspace removes access for every member. Export your data first from Administration.</p>
          <button className="btn danger" onClick={remove}><Icon name="trash" /> Delete workspace</button>
        </section>
      ) : null}
    </div>
  );
}
