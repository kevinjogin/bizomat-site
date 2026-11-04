import { useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor as TiptapEditor, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { errorMessage, upload } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { Modal, useToast } from '../../components/ui/overlays';
import { Field } from '../../components/ui/ui';

export type { TiptapEditor, JSONContent };

export function useDocEditor(opts: { content: JSONContent; editable: boolean; onChange: (json: JSONContent) => void }) {
  const onChange = useRef(opts.onChange);
  onChange.current = opts.onChange;
  // Baseline of the normalised initial content: updates that do not change it
  // (e.g. schema normalisation on load) must not trigger an autosave.
  const baseline = useRef<string | null>(null);
  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Start writing… Use the toolbar for headings, lists, checklists and tables.' }),
    ],
    content: opts.content,
    editable: opts.editable,
    editorProps: { attributes: { 'aria-label': 'Document content', role: 'textbox', 'aria-multiline': 'true' } },
    onCreate: ({ editor }) => {
      baseline.current = JSON.stringify(editor.getJSON());
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      const str = JSON.stringify(json);
      if (str === baseline.current) return;
      baseline.current = null;
      onChange.current(json);
    },
  });
}

export function DocEditorContent({ editor, readOnly }: { editor: TiptapEditor | null; readOnly: boolean }) {
  return (
    <div className={`editor-surface${readOnly ? ' readonly' : ''}`}>
      <EditorContent editor={editor} />
    </div>
  );
}

function TB({ label, icon, text, active, disabled, onClick }: { label: string; icon?: string; text?: string; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`btn ghost icon sm${active ? ' active' : ''}`} aria-label={label} title={label} aria-pressed={active} disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={onClick}>
      {icon ? <Icon name={icon} size={15} /> : <span style={{ fontWeight: 700, fontSize: 12 }}>{text}</span>}
    </button>
  );
}

export function EditorToolbar({ editor, documentId }: { editor: TiptapEditor; documentId: string }) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h1: e.isActive('heading', { level: 1 }),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      task: e.isActive('taskList'),
      quote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      link: e.isActive('link'),
      table: e.isActive('table'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();
  const onImage = async (f: File | undefined) => {
    if (!f) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set('file', f);
      form.set('scope', 'document');
      form.set('documentId', documentId);
      const a = await upload(form);
      c().setImage({ src: a.url, alt: a.fileName }).run();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
      <TB label="Undo" icon="undo" disabled={!s.canUndo} onClick={() => c().undo().run()} />
      <TB label="Redo" icon="redo" disabled={!s.canRedo} onClick={() => c().redo().run()} />
      <span className="sep" />
      <TB label="Heading 1" text="H1" active={s.h1} onClick={() => c().toggleHeading({ level: 1 }).run()} />
      <TB label="Heading 2" text="H2" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()} />
      <TB label="Heading 3" text="H3" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()} />
      <span className="sep" />
      <TB label="Bold" icon="bold" active={s.bold} onClick={() => c().toggleBold().run()} />
      <TB label="Italic" icon="italic" active={s.italic} onClick={() => c().toggleItalic().run()} />
      <TB label="Strikethrough" icon="strike" active={s.strike} onClick={() => c().toggleStrike().run()} />
      <TB label="Inline code" icon="code" active={s.code} onClick={() => c().toggleCode().run()} />
      <TB label={s.link ? 'Edit link' : 'Add link'} icon="link" active={s.link} onClick={() => setLinkOpen(true)} />
      <span className="sep" />
      <TB label="Bulleted list" icon="list" active={s.bullet} onClick={() => c().toggleBulletList().run()} />
      <TB label="Numbered list" icon="listOrdered" active={s.ordered} onClick={() => c().toggleOrderedList().run()} />
      <TB label="Checklist" icon="checkSquare" active={s.task} onClick={() => c().toggleTaskList().run()} />
      <TB label="Quote" icon="quote" active={s.quote} onClick={() => c().toggleBlockquote().run()} />
      <TB label="Code block" text="{ }" active={s.codeBlock} onClick={() => c().toggleCodeBlock().run()} />
      <TB label="Divider" text="—" onClick={() => c().setHorizontalRule().run()} />
      <span className="sep" />
      <TB label="Insert image" icon="image" disabled={uploading} onClick={() => fileRef.current?.click()} />
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => onImage(e.target.files?.[0])} />
      <TB label="Insert table" icon="table" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
      {s.table ? (
        <>
          <TB label="Add row below" text="+R" onClick={() => c().addRowAfter().run()} />
          <TB label="Add column right" text="+C" onClick={() => c().addColumnAfter().run()} />
          <TB label="Delete row" text="−R" onClick={() => c().deleteRow().run()} />
          <TB label="Delete column" text="−C" onClick={() => c().deleteColumn().run()} />
          <TB label="Delete table" icon="trash" onClick={() => c().deleteTable().run()} />
        </>
      ) : null}
      {uploading ? <span className="muted small" style={{ alignSelf: 'center', marginLeft: 6 }}>Uploading…</span> : null}
      {linkOpen ? <LinkDialog editor={editor} onClose={() => setLinkOpen(false)} /> : null}
    </div>
  );
}

function LinkDialog({ editor, onClose }: { editor: TiptapEditor; onClose: () => void }) {
  const [url, setUrl] = useState<string>(editor.getAttributes('link').href ?? 'https://');
  const [error, setError] = useState<string | null>(null);
  const apply = () => {
    const v = url.trim();
    if (!v || v === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      onClose();
      return;
    }
    try {
      const u = new URL(v);
      if (u.protocol !== 'http:' && u.protocol !== 'https:' && u.protocol !== 'mailto:') throw new Error();
    } catch {
      setError('Enter a valid http(s) or mailto link');
      return;
    }
    const chain = editor.chain().focus().extendMarkRange('link');
    if (editor.state.selection.empty && !editor.isActive('link')) chain.insertContent({ type: 'text', text: v, marks: [{ type: 'link', attrs: { href: v } }] }).run();
    else chain.setLink({ href: v }).run();
    onClose();
  };
  return (
    <Modal
      title="Link"
      onClose={onClose}
      footer={
        <>
          {editor.isActive('link') ? <button className="btn" onClick={() => { editor.chain().focus().extendMarkRange('link').unsetLink().run(); onClose(); }}>Remove link</button> : null}
          <span className="spacer" />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={apply}>Apply</button>
        </>
      }
    >
      <Field label="URL" htmlFor="link-url" error={error}>
        <input id="link-url" className="input" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} />
      </Field>
    </Modal>
  );
}
