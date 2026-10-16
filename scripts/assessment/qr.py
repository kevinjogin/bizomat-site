"""QR code for the KEVOS® Engineering Problem Assessment page.

Writes public/assessment/kevos-assessment-qr.svg (vector) and kevos-assessment-qr.png (2,000 px class, for print),
then decodes the PNG with OpenCV to prove it opens exactly https://kevos.com/assessment/.

Requires: segno and opencv-python (pip install segno opencv-python). Run: python scripts/assessment/qr.py
"""
import pathlib
import sys

import segno

URL = 'https://kevos.com/assessment/'
ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'public' / 'assessment'
DARK = '#121211'  # KEVOS ink on white keeps the contrast scanners need; orange is reserved for the surrounding design.


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    qr = segno.make(URL, error='q', micro=False)
    svg = OUT / 'kevos-assessment-qr.svg'
    png = OUT / 'kevos-assessment-qr.png'
    qr.save(svg, kind='svg', scale=10, border=4, dark=DARK, light='#ffffff', xmldecl=False, svgns=True,
            title='QR code: https://kevos.com/assessment/', nl=False)
    modules = qr.symbol_size(scale=1, border=4)[0]
    # Keep the intrinsic size but add a viewBox so the vector scales cleanly in <img> tags and documents.
    size = modules * 10
    markup = svg.read_text(encoding='utf-8')
    if 'viewBox' not in markup:
        markup = markup.replace(f'height="{size}"', f'height="{size}" viewBox="0 0 {size} {size}"', 1)
        svg.write_text(markup, encoding='utf-8')
    qr.save(png, kind='png', scale=max(1, 2000 // modules), border=4, dark=DARK, light='#ffffff')

    try:
        import cv2
    except ImportError:
        print('QR written; install opencv-python to verify it.', file=sys.stderr)
        return 0
    img = cv2.imread(str(png))
    text, _, _ = cv2.QRCodeDetector().detectAndDecode(img)
    small = cv2.resize(img, (240, 240), interpolation=cv2.INTER_AREA)
    text_small, _, _ = cv2.QRCodeDetector().detectAndDecode(small)
    print(f'version {qr.version}, error correction {qr.error}, {modules} modules, PNG {img.shape[1]} px')
    print(f'decoded full size: {text!r}; decoded at 240 px: {text_small!r}')
    if text != URL or text_small != URL:
        print('QR verification FAILED', file=sys.stderr)
        return 1
    print('QR verification OK')
    return 0


if __name__ == '__main__':
    sys.exit(main())
