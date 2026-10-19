// The look of the app. Only colours and type change; layout, commands and mouse behaviour are the same.
// "linear" (default): Linear-style warm neutral greys, Inter, small monochrome icons, indigo accent,
//   dimmed side panels, few dividers. Two themes: dark (default) and light.
// "classic": the SOLIDWORKS 2024 light theme the layout follows (app.css alone).
// Switch: avatar menu or View > Theme (stored in localStorage, applied on reload; index.html applies
// the classes before first paint).

const read = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
export const SKIN = read('opensketch.skin') === 'classic' ? 'classic' : 'linear'; // an old "figma" choice becomes linear
export const THEME = SKIN === 'classic' ? 'light' : read('opensketch.theme') === 'light' ? 'light' : 'dark';
export const LOOK = SKIN === 'classic' ? 'classic' : THEME; // 'dark' | 'light' | 'classic'
if (typeof document !== 'undefined') document.documentElement.classList.add('skin-' + SKIN, 'theme-' + THEME);

export function setLook(look) {
  try {
    localStorage.setItem('opensketch.skin', look === 'classic' ? 'classic' : 'linear');
    if (look !== 'classic') localStorage.setItem('opensketch.theme', look);
  } catch (_) { /* storage unavailable */ }
  location.reload();
}
export const LOOKS = [['dark', 'Dark'], ['light', 'Light'], ['classic', 'Classic (SOLIDWORKS colours)']];

// Icon colours. Classic: grey body, yellow new geometry, blue sketch, red remove (SOLIDWORKS-like).
// Linear: monochrome line icons in the text colour, the accent only for new geometry, red for removing.
const ICONS = {
  dark: { '#8c96a0': '#2a2b2f', '#5d6670': '#c9cbd1', '#f2c230': '#8b93ff', '#c8961e': '#7a83f0', '#2a6fd6': '#c9cbd1',
    '#d9372b': '#eb5757', '#2f9e44': '#4cb782', '#dfe8f5': '#2a2b2f', '#fff': '#1c1d20', '#ffffff': '#1c1d20', '#333': '#c9cbd1',
    '#555': '#8a8f98', '#444': '#8a8f98' },
  light: { '#8c96a0': '#ececee', '#5d6670': '#3c3d42', '#f2c230': '#5e6ad2', '#c8961e': '#4f5ac2', '#2a6fd6': '#3c3d42',
    '#d9372b': '#e5484d', '#2f9e44': '#30a46c', '#dfe8f5': '#f4f4f5' },
};
export const ICON_SWAP = SKIN === 'linear' ? ICONS[THEME] : null;

// 3D colours in the graphics area. Hover (what a click will pick) is orange, as in SOLIDWORKS and the sketch;
// selection is the indigo accent, so the two never look alike.
export const VIEW_COLORS = SKIN !== 'linear' ? null : THEME === 'dark'
  ? { body: 0x8d9199, edge: 0x16171a, hl: 0xffb35c, sel: 0x6e79ff, planeEdge: 0x8b93ff, plane: 0x5e6ad2 }
  : { body: 0xc9ccd2, edge: 0x2a2b2f, hl: 0xe8890c, sel: 0x5e6ad2, planeEdge: 0x5e6ad2, plane: 0xb9bef5 };

// Sketch colours: the meaning stays (under = blue, fully = the ink colour, over = red); on a dark
// canvas the ink is light and the blue lighter.
export const SKETCH_COLORS = SKIN === 'linear' && THEME === 'dark'
  ? { under: 0x7c9dff, fully: 0xf2f3f5, over: 0xff6369, preview: 0x8fb0ff, construction: 0x9a9fe0, inactive: 0xb4b7be, dim: 0xf2f3f5, sel: 0x8b93ff, hl: 0xffb35c }
  : SKIN === 'linear' ? { sel: 0x5e6ad2 } : null;

// Body colour a sketch is drawn over (dark theme only): the body is mixed toward this while sketching.
export const SKETCH_BODY_DIM = SKIN === 'linear' && THEME === 'dark' ? 0x0a0b0d : null;
