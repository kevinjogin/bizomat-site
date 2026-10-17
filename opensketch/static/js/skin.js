// The look of the app. "figma" (default): neutral greys, Inter, flat line icons, one blue accent.
// "classic": the SOLIDWORKS 2024 light theme the layout follows. Only colours and type change;
// layout, commands and mouse behaviour are the same in both. View > Classic Look switches (a reload).

const KEY = 'opensketch.skin';
let saved = null;
try { saved = localStorage.getItem(KEY); } catch (_) { /* storage unavailable */ }
export const SKIN = saved === 'classic' ? 'classic' : 'figma';
if (typeof document !== 'undefined') document.documentElement.classList.add('skin-' + SKIN); // index.html sets it early too

export function setSkin(name) {
  try { localStorage.setItem(KEY, name); } catch (_) { /* storage unavailable */ }
  location.reload();
}

// Icon colours: classic = SOLIDWORKS-like (grey body, yellow new geometry, blue sketch, red remove);
// figma = light fills with dark strokes, the accent for new geometry, red only for removing.
export const ICON_SWAP = SKIN === 'figma' ? {
  '#8c96a0': '#ececec', '#5d6670': '#2c2c2c', '#f2c230': '#0d99ff', '#c8961e': '#007be5', '#2a6fd6': '#2c2c2c',
  '#d9372b': '#f24822', '#2f9e44': '#14ae5c', '#dfe8f5': '#f5f5f5',
} : null;

// 3D colours in the graphics area.
export const VIEW_COLORS = SKIN === 'figma' ? { body: 0xcfd3d8, edge: 0x2c2c2c, hl: 0x7cc4fa, sel: 0x0d99ff, planeEdge: 0x0d99ff, plane: 0xbfe3ff } : null;
