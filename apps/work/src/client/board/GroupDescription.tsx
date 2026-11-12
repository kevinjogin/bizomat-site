// Group (category) descriptions on the board: the text itself (plain text rendered as React elements, never as HTML),
// a one-line preview under the group's header, and the group's details panel (name, description, task figures) where
// people with edit access to the board write, save or clear the description.

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { GROUP_DESCRIPTION_MAX, groupDescriptionOneLine, normalizeGroupDescription, parseGroupDescription } from '../../shared/group-description';
import type { BoardBundle, GroupDTO, ItemDTO } from '../../shared/types';
import { Icon } from '../components/ui/Icon';
import { Popover, useToast } from '../components/ui/overlays';
import { todayISO } from '../lib/format';
import '../styles/workspace-groups.css';

/** Paragraphs and bullet lists. Every piece is a text node: nothing in a description is ever read as markup. */
export function DescriptionText({ text, compact }: { text: string; compact?: boolean }) {
  const blocks = useMemo(() => parseGroupDescription(text), [text]);
  return (
    <div className={`group-desc${compact ? ' group-desc-compact' : ''}`}>
      {blocks.map((b, i) =>
        b.kind === 'list' ? (
          <ul key={i}>
            {b.items.map((it, j) => <li key={j}>{it}</li>)}
          </ul>
        ) : (
          <p key={i}>
            {b.lines.map((l, j) => (
              <span key={j}>
                {j ? <br /> : null}
                {l}
              </span>
            ))}
          </p>
        ),
      )}
    </div>
  );
}

/** The description on one line under the group's header; Show more expands it in place. */
export function GroupDescriptionPreview({ text, open, onToggle, groupName }: { text: string; open: boolean; onToggle: () => void; groupName: string }) {
  const line = groupDescriptionOneLine(text);
  if (!line) return null;
  const long = line.length > 110 || parseGroupDescription(text).length > 1;
  return (
    <div className={`group-preview${open ? ' open' : ''}`}>
      <div className="group-preview-text">{open ? <DescriptionText text={text} compact /> : line}</div>
      {long || open ? (
        <button type="button" className="btn ghost sm" aria-expanded={open} aria-label={`${open ? 'Show less' : 'Show more'} of the description of ${groupName}`} onClick={onToggle}>
          {open ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </div>
  );
}

export interface GroupFigures {
  total: number;
  completed: number;
  open: number;
  /** Null when the board has no date or timeline column to be overdue against. */
  overdue: number | null;
}

/** Figures for a group's top-level tasks (every task in the group, whatever the view's filters). */
export function groupFigures(bundle: BoardBundle, allItems: ItemDTO[], groupId: string): GroupFigures {
  const tasks = allItems.filter((i) => i.groupId === groupId && !i.parentItemId && !i.id.startsWith('tmp-'));
  const s = bundle.board.settings;
  const dateCol = bundle.columns.find((c) => c.id === s.dateColumnId && c.type === 'date') ?? bundle.columns.find((c) => c.type === 'date');
  const timelineCol = bundle.columns.find((c) => c.id === s.timelineColumnId && c.type === 'timeline') ?? bundle.columns.find((c) => c.type === 'timeline');
  const today = todayISO();
  const due = (i: ItemDTO): string | null => {
    const d = dateCol ? i.values[dateCol.id] : null;
    if (typeof d === 'string' && d) return d.slice(0, 10);
    const t = timelineCol ? (i.values[timelineCol.id] as { end?: string } | null | undefined) : null;
    return t && typeof t.end === 'string' ? t.end.slice(0, 10) : null;
  };
  const completed = tasks.filter((i) => !!i.completedAt).length;
  return {
    total: tasks.length,
    completed,
    open: tasks.length - completed,
    overdue: dateCol || timelineCol ? tasks.filter((i) => !i.completedAt && (due(i) ?? '9999') < today).length : null,
  };
}

/**
 * The group's details: name, description and figures. With edit access to the board (the right that also renames a
 * group) the description can be written, saved and cleared here. Unsaved text is never dropped by a stray click.
 */
export function GroupInfoPanel({
  group,
  figures,
  anchor,
  canEdit,
  startEditing,
  onSave,
  onRename,
  onClose,
}: {
  group: GroupDTO;
  figures: GroupFigures;
  anchor: RefObject<HTMLElement | null>;
  canEdit: boolean;
  startEditing?: boolean;
  onSave: (description: string) => Promise<boolean>;
  onRename?: () => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const saved = group.description ?? '';
  const [editing, setEditing] = useState(!!startEditing && canEdit);
  const [draft, setDraft] = useState(saved);
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const clean = normalizeGroupDescription(draft);
  const dirty = editing && clean !== saved;
  const over = clean.length > GROUP_DESCRIPTION_MAX;
  const headingId = `group-info-${group.id}`;

  useEffect(() => {
    if (editing) areaRef.current?.focus();
    else boxRef.current?.focus();
  }, [editing]);

  const requestClose = () => {
    if (dirty) {
      setWarn(true);
      return;
    }
    onClose();
  };
  const save = async () => {
    if (over || busy) return;
    setBusy(true);
    const ok = await onSave(clean);
    setBusy(false);
    if (!ok) return;
    toast(clean ? 'Description saved' : 'Description cleared');
    setWarn(false);
    setEditing(false);
  };
  const clear = async () => {
    if (busy) return;
    const before = saved;
    setBusy(true);
    const ok = await onSave('');
    setBusy(false);
    if (!ok) return;
    setDraft('');
    setWarn(false);
    setEditing(false);
    toast('Description cleared', 'info', before ? { label: 'Undo', run: () => void onSave(before) } : undefined);
  };
  const cancel = () => {
    setDraft(saved);
    setWarn(false);
    setEditing(false);
  };

  return (
    <Popover anchor={anchor} onClose={requestClose} role="dialog" label={`Details of the group ${group.name}`}>
      <div className="group-panel" ref={boxRef} tabIndex={-1} aria-labelledby={headingId}>
        <div className="group-panel-head">
          <span className="group-panel-bar" style={{ background: group.color }} aria-hidden="true" />
          <h3 id={headingId} title={group.name}>{group.name}</h3>
          <button type="button" className="btn ghost icon sm" aria-label="Close" onClick={requestClose}><Icon name="x" size={14} /></button>
        </div>
        <div className="group-stats" aria-label="Task figures">
          <div className="group-stat"><strong>{figures.total}</strong><span>Tasks</span></div>
          <div className="group-stat"><strong>{figures.completed}</strong><span>Completed</span></div>
          <div className="group-stat"><strong>{figures.open}</strong><span>Open</span></div>
          {figures.overdue !== null ? <div className={`group-stat${figures.overdue ? ' late' : ''}`}><strong>{figures.overdue}</strong><span>Overdue</span></div> : null}
        </div>
        {editing ? (
          <div className="col">
            <label htmlFor={`group-desc-${group.id}`} className="label">Description</label>
            <textarea
              id={`group-desc-${group.id}`}
              ref={areaRef}
              className="textarea"
              value={draft}
              placeholder={'What belongs in this group, who looks after it, what "done" means here.\n\n- A line starting with a dash is a bullet'}
              aria-describedby={`group-desc-help-${group.id}`}
              aria-invalid={over}
              onChange={(e) => { setDraft(e.target.value); setWarn(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); void save(); }
              }}
            />
            <div className="row" id={`group-desc-help-${group.id}`}>
              <span className="muted small grow">Plain text. A blank line starts a new paragraph; start a line with "- " for a bullet.</span>
              <span className={`counter${over ? ' over' : ''}`}>{clean.length.toLocaleString('en')} / {GROUP_DESCRIPTION_MAX.toLocaleString('en')}</span>
            </div>
            {warn ? <div className="error-box" role="alert">You have unsaved changes. Save or cancel them first.</div> : null}
            <div className="group-panel-actions">
              <button type="button" className="btn primary sm" onClick={save} disabled={busy || over || !dirty}>{busy ? 'Saving…' : 'Save'}</button>
              <button type="button" className="btn sm" onClick={cancel} disabled={busy}>Cancel</button>
              {saved ? <button type="button" className="btn ghost sm danger-text" onClick={clear} disabled={busy}>Clear description</button> : null}
            </div>
          </div>
        ) : (
          <>
            <div className="group-panel-body">
              {saved ? <DescriptionText text={saved} /> : <p className="muted small">{canEdit ? 'No description yet. Add one to explain what belongs in this group.' : 'This group has no description.'}</p>}
            </div>
            {canEdit ? (
              <div className="group-panel-actions">
                <button type="button" className="btn sm" onClick={() => { setDraft(saved); setEditing(true); }}><Icon name="edit" size={14} /> {saved ? 'Edit description' : 'Add description'}</button>
                {onRename ? <button type="button" className="btn ghost sm" onClick={() => { onClose(); onRename(); }}>Rename group</button> : null}
              </div>
            ) : null}
          </>
        )}
      </div>
    </Popover>
  );
}
