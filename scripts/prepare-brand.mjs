// Prepares web-ready brand assets from the original artwork in brand-source/.
//   brand-source/gocore-logo-original.png  → public/brand/gocore-logo.png (cleaned, trimmed wordmark)
//   brand-source/gocore-icon-original.jpg  → favicons, app icons and the assistant avatar
// The wordmark's background removal left speckles and fringes, so this script rebuilds a clean
// alpha mask from the saturated letter colours and drops small stray fragments.
// Run after replacing the originals:  node scripts/prepare-brand.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'brand-source');
const PUBLIC = path.join(ROOT, 'public');
fs.mkdirSync(path.join(PUBLIC, 'brand'), { recursive: true });

// ---------- Wordmark ----------
async function cleanWordmark() {
  const { data, info } = await sharp(path.join(SRC, 'gocore-logo-original.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;
  const mask = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    // Letter pixels are opaque, bright enough and strongly coloured (blue or orange).
    if (a > 150 && max > 80 && (max - min) / max > 0.42) mask[i] = 1;
  }

  // Label connected regions (4-neighbour) of a given value; returns region id per pixel and sizes.
  const label = (want) => {
    const ids = new Int32Array(N).fill(-1);
    const sizes = [];
    const stack = new Int32Array(N);
    for (let start = 0; start < N; start++) {
      if (mask[start] !== want || ids[start] !== -1) continue;
      const id = sizes.length;
      let top = 0, size = 0;
      stack[top++] = start;
      ids[start] = id;
      while (top) {
        const p = stack[--top];
        size++;
        const x = p % W, y = (p - x) / W;
        const n = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1];
        for (const q of n) if (q >= 0 && mask[q] === want && ids[q] === -1) { ids[q] = id; stack[top++] = q; }
      }
      sizes.push(size);
    }
    return { ids, sizes };
  };

  // 1. Drop small stray fragments (speckles); letters and their slanted pieces are far larger.
  const fg = label(1);
  const minPiece = Math.round(N * 0.0012);
  for (let i = 0; i < N; i++) if (mask[i] && fg.sizes[fg.ids[i]] < minPiece) mask[i] = 0;
  // 2. Fill small holes inside letters; keep real counters (the inside of "o", "e") open.
  const bg = label(0);
  const maxHole = Math.round(N * 0.0015);
  for (let i = 0; i < N; i++) if (!mask[i] && bg.sizes[bg.ids[i]] < maxHole) mask[i] = 1;

  // 3. Colour: keep original colours inside the mask and extend them a few pixels outward,
  //    so the softened edge never picks up dark fringe pixels.
  const rgb = Buffer.alloc(N * 3);
  const known = new Uint8Array(N);
  for (let i = 0; i < N; i++) if (mask[i]) { rgb[i * 3] = data[i * 4]; rgb[i * 3 + 1] = data[i * 4 + 1]; rgb[i * 3 + 2] = data[i * 4 + 2]; known[i] = 1; }
  for (let pass = 0; pass < 3; pass++) {
    const next = known.slice();
    for (let i = 0; i < N; i++) {
      if (known[i]) continue;
      const x = i % W;
      for (const q of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, i - W, i + W]) {
        if (q >= 0 && q < N && known[q]) { rgb[i * 3] = rgb[q * 3]; rgb[i * 3 + 1] = rgb[q * 3 + 1]; rgb[i * 3 + 2] = rgb[q * 3 + 2]; next[i] = 1; break; }
      }
    }
    known.set(next);
  }

  // 4. Anti-aliased alpha from the binary mask, then trim with a little padding.
  const alpha = await sharp(Buffer.from(mask.map((m) => m * 255)), { raw: { width: W, height: H, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer();
  const out = Buffer.alloc(N * 4);
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let i = 0; i < N; i++) {
    out[i * 4] = rgb[i * 3]; out[i * 4 + 1] = rgb[i * 3 + 1]; out[i * 4 + 2] = rgb[i * 3 + 2]; out[i * 4 + 3] = alpha[i];
    if (mask[i]) { const x = i % W, y = (i - x) / W; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  }
  const pad = Math.round((maxY - minY) * 0.04);
  const box = { left: Math.max(0, minX - pad), top: Math.max(0, minY - pad), width: Math.min(W, maxX + pad + 1) - Math.max(0, minX - pad), height: Math.min(H, maxY + pad + 1) - Math.max(0, minY - pad) };
  const clean = await sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract(box).png().toBuffer();

  await sharp(clean).resize({ width: 1600 }).png({ compressionLevel: 9 }).toFile(path.join(SRC, 'gocore-logo-clean.png'));
  const header = await sharp(clean).resize({ height: 120 }).png({ compressionLevel: 9, palette: false }).toFile(path.join(PUBLIC, 'brand', 'gocore-logo.png'));
  await sharp(clean).resize({ height: 120 }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(PUBLIC, 'brand', 'gocore-logo.webp'));
  return { width: header.width, height: header.height };
}

// ---------- App icon ----------
async function icons() {
  const src = path.join(SRC, 'gocore-icon-original.jpg');
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  // Measure the rounded corner: walk the diagonal from the top-left until the artwork starts.
  let d = 0;
  while (d < W / 2) {
    const i = (d * W + d) * C;
    if (Math.min(data[i], data[i + 1], data[i + 2]) < 200) break;
    d++;
  }
  const radius = Math.round((d / (1 - Math.SQRT1_2)) * 0.97);
  const inset = 2;
  const roundMask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" rx="${radius}" ry="${radius}"/></svg>`);
  const rounded = await sharp(src).ensureAlpha().composite([{ input: roundMask, blend: 'dest-in' }]).png().toBuffer();
  // Full-bleed square (no white corners) for platforms that apply their own rounding (Apple).
  const crop = Math.round(radius * 0.32);
  const square = await sharp(src).extract({ left: crop, top: crop, width: W - crop * 2, height: H - crop * 2 }).png().toBuffer();

  const write = (buf, size, name) =>
    sharp(buf).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9, palette: size >= 180, quality: 92, effort: 10 }).toFile(path.join(PUBLIC, name));
  await write(rounded, 512, 'icon-512.png');
  await write(rounded, 192, 'icon-192.png');
  await write(rounded, 512, 'brand/gocore-icon-512.png');
  await write(rounded, 96, 'brand/gocore-icon-96.png');
  await write(rounded, 32, 'favicon-32.png');
  await write(square, 180, 'apple-touch-icon.png');

  // favicon.ico with 16, 32 and 48 px PNG images inside (supported by every modern browser).
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => sharp(rounded).resize(s, s, { kernel: 'lanczos3' }).png().toBuffer()));
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(sizes[i], e); header.writeUInt8(sizes[i], e + 1); header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(png.length, e + 8); header.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), Buffer.concat([header, ...pngs]));
  return { radius };
}

const logo = await cleanWordmark();
const icon = await icons();
console.log(`Wordmark: public/brand/gocore-logo.png (${logo.width}×${logo.height}) + .webp`);
console.log(`Icons: favicon.ico, favicon-32.png, apple-touch-icon.png, icon-192/512.png, brand/gocore-icon-96/512.png (corner radius ${icon.radius}px)`);
