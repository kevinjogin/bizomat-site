// Build matching KEVOS orange K favicons and app/touch icons from the original
// geometric K used by the on-site assistant. Called BEFORE astro build, so
// Cloudflare receives raster assets in dist/ as well as SVG source assets.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const sourceFile = path.join(publicDir, 'brand', 'kevos-chat-k-mark.svg');
const source = fs.readFileSync(sourceFile, 'utf8');
const paths = [...source.matchAll(/<path\s+d="([^"]+)"\s*\/>/g)].map((m) => m[1]);
if (paths.length !== 2 || !source.includes('#c2410c')) {
  throw new Error('KEVOS K source has changed; review the icon before publishing.');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="KEVOS orange K">
  <rect width="64" height="64" rx="14" fill="#f6f5f1"/>
  <g transform="translate(9 13) scale(.027)" fill="#c2410c">
    ${paths.map((d) => `<path d="${d}"/>`).join('\n    ')}
  </g>
</svg>\n`;

const out = (name) => path.join(publicDir, name);
fs.writeFileSync(out('brand/kevos-favicon-k-orange.svg'), svg);
fs.writeFileSync(out('favicon.svg'), svg);
fs.writeFileSync(out('brand/kevos-icon.svg'), svg);

const iconBytes = Buffer.from(svg);
const render = (size) => sharp(iconBytes).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
for (const size of [32, 180, 192, 512]) {
  fs.writeFileSync(out(`brand/kevos-favicon-k-orange-${size}.png`), await render(size));
}

// Traditional /favicon.ico is refreshed too for browsers that request it directly.
const icoSizes = [16, 32, 48];
const images = await Promise.all(icoSizes.map(render));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((png, index) => {
  const pos = 6 + 16 * index;
  header.writeUInt8(icoSizes[index], pos);
  header.writeUInt8(icoSizes[index], pos + 1);
  header.writeUInt16LE(1, pos + 4);
  header.writeUInt16LE(32, pos + 6);
  header.writeUInt32LE(png.length, pos + 8);
  header.writeUInt32LE(offset, pos + 12);
  offset += png.length;
});
fs.writeFileSync(out('favicon.ico'), Buffer.concat([header, ...images]));
console.log('KEVOS orange K icons generated: SVG, favicon.ico, PNG 32/180/192/512.');
