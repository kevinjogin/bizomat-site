// Workspace colours: the identification colour shown as a small dot or tile next to a workspace's name (sidebar
// switcher, workspace menu, home heading, board breadcrumb, Workspaces page). Shared by the Worker (validation) and
// the app (the picker).
//
// The ten named colours are deliberately restrained (the 600 to 700 shades): each keeps white text at 4.5:1 or more
// (the initial on a workspace tile) and stays at 3:1 or more against the light page. They are not the task status
// colours (#94a3b8, #f5a524, #e5484d, #00a36c), the priority colours (#7f1d1d, #e5484d, #f5a524, #0ea5e9) or the
// bright red and amber that mark critical and near-critical work. Teal is BIZOMAT teal, the default for new
// workspaces (DEFAULT_COLOR in ./brand.ts).
//
// Any other colour can be chosen as a custom #rrggbb value. Existing workspaces keep the colour they have.

export interface WorkspaceColor {
  name: string;
  hex: string;
}

export const WORKSPACE_COLORS: readonly WorkspaceColor[] = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Green', hex: '#15803d' },
  { name: 'Orange', hex: '#c2410c' },
  { name: 'Amber', hex: '#a16207' },
  { name: 'Red', hex: '#b91c1c' },
  { name: 'Purple', hex: '#7e22ce' },
  { name: 'Pink', hex: '#be185d' },
  { name: 'Indigo', hex: '#4338ca' },
  { name: 'Grey', hex: '#4b5563' },
];

/** A colour as the API stores it: # and six hex digits. */
export const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR.test(value);
}

/**
 * Reads what someone typed as a custom colour: "#1a2b3c" or "1a2b3c", any letter case, surrounding spaces ignored.
 * Returns the lower-case #rrggbb form, or null when it is not a six-digit hex colour.
 */
export function parseHexColor(input: string): string | null {
  const s = input.trim().replace(/^#?/, '#');
  return HEX_COLOR.test(s) ? s.toLowerCase() : null;
}

/** The palette name of a colour ("Teal"), or null for a custom colour. */
export function workspaceColorName(hex: string | null | undefined): string | null {
  if (!hex) return null;
  const h = hex.toLowerCase();
  return WORKSPACE_COLORS.find((c) => c.hex === h)?.name ?? null;
}

/** Same colour, ignoring letter case. */
export function sameColor(a: string | null | undefined, b: string | null | undefined): boolean {
  return (a ?? '').toLowerCase() === (b ?? '').toLowerCase();
}

/** Workspace names compare without surrounding spaces and without letter case ("Acme" and " acme " are the same). */
export function workspaceNameKey(name: string): string {
  return name.normalize('NFC').trim().toLocaleLowerCase('en');
}
