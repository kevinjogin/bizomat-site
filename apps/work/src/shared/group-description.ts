// Group (category) descriptions: plain text, shared by the Worker (validation, reports) and the app (rendering).
//
// Format: paragraphs separated by blank lines; a line that starts with "- " or "* " is a bullet. Nothing else is
// interpreted: no HTML, no links, no markup. The app renders the blocks below as React text, never as HTML.

export const GROUP_DESCRIPTION_MAX = 5000;

export type DescriptionBlock = { kind: 'paragraph'; lines: string[] } | { kind: 'list'; items: string[] };

/** Line endings to \n, control characters other than newline and tab removed, surrounding blank space trimmed. */
export function normalizeGroupDescription(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim();
}

const BULLET = /^\s*[-*]\s+(.*)$/;

/** Splits a description into paragraphs and bullet lists. */
export function parseGroupDescription(text: string): DescriptionBlock[] {
  const blocks: DescriptionBlock[] = [];
  let cur: DescriptionBlock | null = null;
  for (const raw of normalizeGroupDescription(text).split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) {
      cur = null;
      continue;
    }
    const bullet = BULLET.exec(line);
    if (bullet) {
      if (cur?.kind !== 'list') {
        cur = { kind: 'list', items: [] };
        blocks.push(cur);
      }
      cur.items.push(bullet[1].trim());
    } else {
      if (cur?.kind !== 'paragraph') {
        cur = { kind: 'paragraph', lines: [] };
        blocks.push(cur);
      }
      cur.lines.push(line.trim());
    }
  }
  return blocks;
}

/** The description on one line (bullet markers dropped, whitespace collapsed), for previews and table cells. */
export function groupDescriptionOneLine(text: string): string {
  return parseGroupDescription(text)
    .flatMap((b) => (b.kind === 'list' ? b.items : b.lines))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
