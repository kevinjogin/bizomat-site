// The OpenSketch mark: an isometric cube on an indigo tile. One drawing for the title bar, Files,
// dialogs, the sign-in pages (auth.py has the same paths), the favicon and the app icons.

let n = 0;
export const MARK_PATHS = {
  top: 'M12 5.4l5.8 3.3L12 12 6.2 8.7z',
  outline: 'M12 5.4l5.8 3.3v6.6L12 18.6l-5.8-3.3V8.7z',
  inner: 'M6.2 8.7L12 12l5.8-3.3M12 12v6.6',
};

export function LOGO(size = 20) {
  const id = 'osg' + (++n);
  return `<svg class="os-logo" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">
<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a3aaff"/><stop offset=".5" stop-color="#6670e0"/><stop offset="1" stop-color="#4a51c2"/></linearGradient></defs>
<rect width="24" height="24" rx="6.6" fill="url(#${id})"/>
<path d="${MARK_PATHS.top}" fill="#fff" fill-opacity=".3"/>
<path d="${MARK_PATHS.outline}" fill="none" stroke="#fff" stroke-width="1.55" stroke-linejoin="round"/>
<path d="${MARK_PATHS.inner}" fill="none" stroke="#fff" stroke-width="1.55" stroke-linejoin="round" stroke-opacity=".88"/>
</svg>`;
}
