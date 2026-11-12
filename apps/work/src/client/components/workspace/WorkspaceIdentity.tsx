// A workspace's identity: its name and its identification colour. The colour is shown as a small dot (never as a
// page-wide colour) next to the name in the workspace switcher and its menu, the home heading, the board breadcrumb
// and the Workspaces page. Owners and admins rename and recolour a workspace here (dialog) or in Workspace settings.

import { useId, useState } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, patch } from '../../lib/api';
import { useSession, type Session } from '../../lib/session';
import { Modal, useToast } from '../ui/overlays';
import { Field } from '../ui/ui';
import { WORKSPACE_COLORS, parseHexColor, sameColor, workspaceColorName, workspaceNameKey } from '../../../shared/workspace-colors';
import type { WorkspaceDTO } from '../../../shared/types';
import '../../styles/workspace-groups.css';

/** The small colour indicator next to a workspace's name. Decorative: the name is always shown beside it. */
export function WorkspaceDot({ color, size = 'md' }: { color: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`ws-dot ${size}`} style={{ background: color }} aria-hidden="true" />;
}

/** Why a name cannot be used, or null. The same rules as the API: 1 to 100 characters, not a duplicate. */
export function workspaceNameIssue(name: string, selfId: string, all: Pick<WorkspaceDTO, 'id' | 'name'>[]): string | null {
  const t = name.trim();
  if (!t) return 'Enter a workspace name.';
  if (t.length > 100) return 'A workspace name can be up to 100 characters long.';
  const clash = all.find((w) => w.id !== selfId && workspaceNameKey(w.name) === workspaceNameKey(t));
  if (clash) return `You already belong to a workspace called "${clash.name}". Choose a different name.`;
  return null;
}

/** Show a renamed or recoloured workspace at once in everything that reads the session (switcher, home, breadcrumbs). */
export function applyWorkspaceUpdate(qc: QueryClient, id: string, next: Partial<Pick<WorkspaceDTO, 'name' | 'color' | 'description'>>) {
  qc.setQueryData<Session | null>(['me'], (s) => (s ? { ...s, workspaces: s.workspaces.map((w) => (w.id === id ? { ...w, ...next } : w)) } : s));
}

/** Saves a new name and/or colour; refreshes the session and the workspace's settings. Returns the toast message. */
export function useSaveWorkspaceIdentity() {
  const qc = useQueryClient();
  const { refresh } = useSession();
  return async (ws: WorkspaceDTO, next: { name?: string; color?: string; extra?: Record<string, unknown> }): Promise<string | null> => {
    const body: Record<string, unknown> = { ...(next.extra ?? {}) };
    const name = next.name?.trim();
    const renamed = name !== undefined && name !== ws.name;
    const recoloured = next.color !== undefined && !sameColor(next.color, ws.color);
    if (renamed) body.name = name;
    if (recoloured) body.color = next.color;
    if (!Object.keys(body).length) return null;
    const res = await patch<{ ok: true; workspace: WorkspaceDTO | null }>(`/workspaces/${ws.id}`, body);
    applyWorkspaceUpdate(qc, ws.id, res?.workspace ? { name: res.workspace.name, color: res.workspace.color, description: res.workspace.description } : { ...(renamed ? { name } : {}), ...(recoloured ? { color: next.color } : {}) });
    await Promise.all([refresh(), qc.invalidateQueries({ queryKey: ['workspace', ws.id] }), qc.invalidateQueries({ queryKey: ['audit-events', ws.id] })]);
    if (renamed && recoloured) return `Workspace renamed to "${name}" and its colour changed`;
    if (renamed) return `Workspace renamed to "${name}"`;
    if (recoloured) return 'Workspace colour changed';
    return 'Workspace saved';
  };
}

/**
 * The ten named colours, then a custom colour (colour picker or a typed #rrggbb). `onValidityChange` reports whether
 * the typed custom value is usable, so a form can hold its Save button until it is.
 */
export function WorkspaceColorPicker({ value, onChange, onValidityChange, disabled }: { value: string; onChange: (hex: string) => void; onValidityChange?: (ok: boolean) => void; disabled?: boolean }) {
  const id = useId();
  const named = workspaceColorName(value);
  const [draft, setDraft] = useState(named ? '' : value);
  const [error, setError] = useState<string | null>(null);
  const setValid = (ok: boolean, message: string | null = null) => {
    setError(ok ? null : message);
    onValidityChange?.(ok);
  };
  const typed = (text: string) => {
    setDraft(text);
    if (!text.trim()) return setValid(true);
    const hex = parseHexColor(text);
    if (hex) {
      setValid(true);
      onChange(hex);
    } else setValid(false, 'Enter # and six hex digits, for example #1a2b3c.');
  };
  return (
    <div className="ws-color-picker">
      <div className="ws-color-grid" role="radiogroup" aria-label="Workspace colour">
        {WORKSPACE_COLORS.map((c) => {
          const on = sameColor(value, c.hex);
          return (
            <button
              key={c.hex}
              type="button"
              role="radio"
              aria-checked={on}
              className={`ws-color-option${on ? ' selected' : ''}`}
              disabled={disabled}
              onClick={() => {
                setDraft('');
                setValid(true);
                onChange(c.hex);
              }}
            >
              <span className="ws-color-chip" style={{ background: c.hex }} aria-hidden="true" />
              <span className="ws-color-label">{c.name}</span>
            </button>
          );
        })}
      </div>
      <div className="ws-color-custom">
        <label htmlFor={`${id}-hex`} className="label">Custom colour</label>
        <input
          type="color"
          className="ws-color-native"
          aria-label="Choose a custom colour"
          value={parseHexColor(value) ?? '#0f766e'}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value);
            setValid(true);
            onChange(e.target.value.toLowerCase());
          }}
        />
        <input
          id={`${id}-hex`}
          className="input sm mono ws-color-hex"
          value={draft}
          placeholder="#1a2b3c"
          maxLength={9}
          spellCheck={false}
          autoComplete="off"
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={`${id}-hint`}
          onChange={(e) => typed(e.target.value)}
        />
      </div>
      <span id={`${id}-hint`} className={error ? 'error' : 'hint'} role={error ? 'alert' : undefined}>
        {error ?? (
          <>
            Selected: <WorkspaceDot color={value} size="sm" /> {named ?? `Custom ${value.toLowerCase()}`}
          </>
        )}
      </span>
    </div>
  );
}

/** Rename and recolour a workspace (owners and admins). Save, Cancel, and a confirmation when saved. */
export function WorkspaceIdentityDialog({ workspace, onClose }: { workspace: WorkspaceDTO; onClose: () => void }) {
  const { session } = useSession();
  const save = useSaveWorkspaceIdentity();
  const toast = useToast();
  const [name, setName] = useState(workspace.name);
  const [color, setColor] = useState(workspace.color);
  const [colorOk, setColorOk] = useState(true);
  const [touched, setTouched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const issue = workspaceNameIssue(name, workspace.id, session?.workspaces ?? []);
  const changed = name.trim() !== workspace.name || !sameColor(color, workspace.color);
  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (issue || !colorOk || !changed) return;
    setBusy(true);
    setServerError(null);
    try {
      const msg = await save(workspace, { name, color });
      if (msg) toast(msg);
      onClose();
    } catch (err) {
      setServerError(err instanceof ApiError && err.status === 409 ? err.message : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  const nameError = (touched || name !== workspace.name) && issue ? issue : null;
  return (
    <Modal
      title="Rename workspace"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" form="ws-identity-form" className="btn primary" disabled={busy || !!issue || !colorOk || !changed}>{busy ? 'Saving…' : 'Save'}</button>
        </>
      }
    >
      <form id="ws-identity-form" onSubmit={submit} noValidate>
        <Field label="Workspace name" htmlFor="ws-identity-name" error={nameError} hint="Up to 100 characters. Links to this workspace keep working after a rename.">
          <input id="ws-identity-name" className="input" value={name} maxLength={100} required aria-invalid={!!nameError} onChange={(e) => { setName(e.target.value); setServerError(null); }} />
        </Field>
        <Field label="Colour" hint="Shown as a small dot next to the workspace name.">
          <WorkspaceColorPicker value={color} onChange={setColor} onValidityChange={setColorOk} />
        </Field>
        <div className="ws-identity-preview" aria-label="Preview">
          <WorkspaceDot color={color} /> <strong className="ellipsis">{name.trim() || 'Workspace name'}</strong>
        </div>
        {serverError ? <div className="error-box" role="alert">{serverError}</div> : null}
      </form>
    </Modal>
  );
}
