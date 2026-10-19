// The look of the app. Only colours and type change; layout, commands and mouse behaviour are the same.
// "linear" (default): Linear-style warm neutral greys, Inter, small monochrome icons, indigo accent,
//   dimmed side panels, few dividers. Two themes: dark (default) and light.
// "classic": the SOLIDWORKS 2024 light theme the layout follows (app.css alone).
// Switch: avatar menu or View > Theme. It applies at once, without a reload (undo history, an open sketch or
// PropertyManager and the AI chat stay): setLook swaps the classes on <html> (the stylesheets do the rest),
// updates the exported palettes below (live bindings, so importers read the new values) and sends an
// 'opensketch:look' event: icons.js repaints every icon on the page, sketch/draw.js its colours, app.js the
// 3D view and sketches. The choice is stored in localStorage; index.html applies it before first paint.

const read = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };
const write = (k, v) => { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } };
const storedLook = () => (read('opensketch.skin') === 'classic' ? 'classic' : read('opensketch.theme') === 'light' ? 'light' : 'dark'); // an old "figma" choice becomes linear

export const LOOKS = [['dark', 'Dark'], ['light', 'Light'], ['classic', 'Classic (SOLIDWORKS colours)']];
// The browser's own bar above the page (phones, installed app): the title bar colour of each look.
export const THEME_COLOR = { dark: '#0c0d0e', light: '#f5f5f6', classic: '#fbfbfb' };

// Icon colours. Classic: grey body, yellow new geometry, blue sketch, red remove (SOLIDWORKS-like).
// Linear: monochrome line icons in the text colour, the accent only for new geometry, red for removing.
// Every fill an icon uses has a dark value here (tests/js/look.test.mjs): pale tiles must not glow in the dark theme.
export const ICONS = {
  dark: { '#8c96a0': '#2a2b2f', '#5d6670': '#c9cbd1', '#f2c230': '#8b93ff', '#c8961e': '#7a83f0', '#2a6fd6': '#c9cbd1',
    '#d9372b': '#eb5757', '#2f9e44': '#4cb782', '#dfe8f5': '#2a2b2f', '#fff': '#1c1d20', '#ffffff': '#1c1d20', '#333': '#c9cbd1',
    '#555': '#8a8f98', '#444': '#8a8f98',
    '#cfe0f5': '#262a3f', '#d7e6f7': '#262a3f', '#e3edf9': '#262a3f', '#e6f0fb': '#262a3f', '#d6dbe0': '#2a2b2f', '#e7f5e7': '#1f2a24',
    '#b0b8c0': '#3a3c42' },
  light: { '#8c96a0': '#ececee', '#5d6670': '#3c3d42', '#f2c230': '#5e6ad2', '#c8961e': '#4f5ac2', '#2a6fd6': '#3c3d42',
    '#d9372b': '#e5484d', '#2f9e44': '#30a46c', '#dfe8f5': '#f4f4f5' },
};

// 3D colours in the graphics area.
const VIEW = {
  dark: { body: 0x8d9199, edge: 0x16171a, hl: 0x9ea6ff, sel: 0x6e79ff, planeEdge: 0x8b93ff, plane: 0x5e6ad2 },
  light: { body: 0xc9ccd2, edge: 0x2a2b2f, hl: 0x9ea6ff, sel: 0x5e6ad2, planeEdge: 0x5e6ad2, plane: 0xb9bef5 },
};

// Sketch colours: the meaning stays (under = blue, fully = the ink colour, over = red); on a dark
// canvas the ink is light and the blue lighter.
const SKETCH = {
  dark: { under: 0x7c9dff, fully: 0xf2f3f5, over: 0xff6369, preview: 0x8fb0ff, construction: 0x9a9fe0, inactive: 0xb4b7be, dim: 0xf2f3f5, sel: 0x8b93ff, hl: 0xffb35c },
  light: { sel: 0x5e6ad2 },
};

// The current look and its palettes (reassigned by setLook; ES module imports see the new values).
export let SKIN, THEME, LOOK, ICON_SWAP, VIEW_COLORS, SKETCH_COLORS;
// Body colour a sketch is drawn over (dark theme only): the body is mixed toward this while sketching.
export let SKETCH_BODY_DIM;

function settle(look) {
  LOOK = look === 'classic' || look === 'light' ? look : 'dark';
  SKIN = LOOK === 'classic' ? 'classic' : 'linear';
  THEME = LOOK === 'dark' ? 'dark' : 'light';
  ICON_SWAP = SKIN === 'linear' ? ICONS[THEME] : null;
  VIEW_COLORS = SKIN === 'linear' ? VIEW[THEME] : null;
  SKETCH_COLORS = SKIN === 'linear' ? SKETCH[THEME] : null;
  SKETCH_BODY_DIM = LOOK === 'dark' ? 0x0a0b0d : null;
}

function applyToPage() {
  if (typeof document === 'undefined') return;
  const c = document.documentElement.classList;
  c.remove('skin-linear', 'skin-classic', 'theme-dark', 'theme-light');
  c.add('skin-' + SKIN, 'theme-' + THEME);
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', THEME_COLOR[LOOK]);
}

settle(storedLook());
applyToPage();

/** Switch the look now, without reloading. `store: false` applies a choice made in another tab. */
export function setLook(look, { store = true } = {}) {
  if (look === LOOK) return;
  if (store) {
    write('opensketch.skin', look === 'classic' ? 'classic' : 'linear');
    if (look !== 'classic') write('opensketch.theme', look);
  }
  settle(look);
  applyToPage();
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('opensketch:look', { detail: { look: LOOK } }));
  }
}

// Another tab changed the look: follow it.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (e) => { if (e.key === 'opensketch.skin' || e.key === 'opensketch.theme') setLook(storedLook(), { store: false }); });
}
