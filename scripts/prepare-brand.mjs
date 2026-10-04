// Rasterises the GoCore brand artwork into the web assets the site serves.
//   brand-source/generated/*.svg  (from `python scripts/brand/build_brand.py`)
//     → public/brand/gocore-logo.svg/.png/.webp   the wordmark (one version for light and dark)
//     → public/brand/gocore-icon-96/512.png       the "GC" monogram tile (assistant avatar, structured data)
//     → public/favicon.svg/.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png
//     → public/og-default.png                     the default social sharing card (1200 × 630)
// Run: node scripts/prepare-brand.mjs   (or `npm run brand`)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.join(ROOT, 'brand-source', 'generated');
const PUBLIC = path.join(ROOT, 'public');
const src = (name) => path.join(GEN, name);
const out = (name) => path.join(PUBLIC, name);
fs.mkdirSync(out('brand'), { recursive: true });

// Render vector artwork at a density high enough for the target size, then downsample.
const png = (svg, width, height = width) =>
  sharp(src(svg), { density: 72 * Math.max(4, Math.ceil(width / 64)) }).resize(width, height).png({ compressionLevel: 9 });

// Wordmark
fs.copyFileSync(src('gocore-logo.svg'), out('brand/gocore-logo.svg'));
const logo = await sharp(src('gocore-logo.svg'), { density: 600 }).resize({ height: 240 }).png({ compressionLevel: 9 }).toFile(out('brand/gocore-logo.png'));
await sharp(src('gocore-logo.svg'), { density: 600 }).resize({ height: 240 }).webp({ quality: 92, alphaQuality: 100 }).toFile(out('brand/gocore-logo.webp'));

// Monogram tiles
await png('gocore-icon.svg', 512).toFile(out('brand/gocore-icon-512.png'));
await png('gocore-icon.svg', 96).toFile(out('brand/gocore-icon-96.png'));
await png('gocore-icon.svg', 512).toFile(out('icon-512.png'));
await png('gocore-icon.svg', 192).toFile(out('icon-192.png'));
await png('gocore-icon-square.svg', 180).toFile(out('apple-touch-icon.png'));
await png('gocore-icon-small.svg', 32).toFile(out('favicon-32.png'));
fs.copyFileSync(src('gocore-icon-small.svg'), out('favicon.svg'));

// favicon.ico with 16, 32 and 48 px PNG images inside (supported by every current browser).
const icoSizes = [16, 32, 48];
const images = await Promise.all(icoSizes.map((s) => png('gocore-icon-small.svg', s).toBuffer()));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
fs.writeFileSync(out('favicon.ico'), Buffer.concat([header, ...images]));

// Social card
await sharp(src('og-default.svg'), { density: 72 }).resize(1200, 630).png({ compressionLevel: 9 }).toFile(out('og-default.png'));

console.log(`Wordmark: public/brand/gocore-logo.svg/.png (${logo.width}×${logo.height}) + .webp`);
console.log('Icons: favicon.svg/.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png, brand/gocore-icon-96/512.png');
console.log('Social card: public/og-default.png');
