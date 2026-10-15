// Converts each proof-of-work featured image from the published KEVOS® project records
// (kevos.ghost.io, tag kevos-work) into two KEVOS-coloured layers per size:
//   <id>-base-<w>.webp   charcoal-to-warm-grey duotone of the image
//   <id>-lines-<w>.webp  transparent KEVOS-orange linework traced from the image
// The homepage animates the linework across the base (src/components/ProofOfWork.astro).
// Run manually when a project image changes: node scripts/build-work-visuals.mjs
// Sources are downloaded once into node_modules/.cache/work-visuals; outputs are committed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(root, 'node_modules/.cache/work-visuals');
const outDir = path.join(root, 'public/proof-of-work');
const GHOST = 'https://storage.ghost.io/c/44/71/4471838a-eccc-421f-9561-a58d1fb5a0c9/content/images/size/w1600/';

/** Project id (src/data/projects.ts) → featured image path in the Ghost record. */
const SOURCES = {
  'blow-moulding-tooling': '2026/04/how-to-mold-plastic-bottles2.webp',
  'residential-girraween': '2026/04/5-Mardi-St-Girraween-New-South-Wales.jpg',
  'plant-access-control': '2026/04/Boom-Gate-Design-Project-----Case-Study.webp',
  'stainless-maintenance-platform': '2026/04/Platform-for-the-Food-Industry-----Case-Study.webp',
  'bin-collection-system': '2026/04/BIN-COLLECTION.webp',
  'hopper-access-redesign': '2026/04/Hopper-Cover-Design-Project.webp',
  'liquip-plant-layout': '2026/04/Liquip.jpg',
  'percussive-therapy-device': '2026/04/PHYSIO-EQUIPMENT-Development.webp',
  'smithfield-carpark': '2026/04/--Smithfield-Carpark-Concept-Redesign-----Reimagining-Urban-Parking-Infrastructure.jpg',
  'residential-cdc': '2026/04/23-Forbes-Cres-2.jpg',
  'paint-line-trolley': '2026/04/Horizontal-Trolley-Design-for-Paint-Line.webp',
  'modular-painting-girder': '2026/04/Girder-Design-for-Efficient-Defence-Product-Painting.webp',
  'currency-sanitiser': '2026/04/Wink.webp',
  'cowpasture-bridge': '2026/04/MACARTHUR-COWPASTURE-BRIDGE-REPAIR-PROJECT1.jpg',
  'alexandria-bridge': '2026/04/ALEXANDRIA-NSW-BRIDGE-REPAIR-PROJECT1.jpg',
  'telescopic-buoy': '2026/04/Telescopic-Buoy-Design-Concept.webp',
  'robohelix-coiling-machine': '2026/04/Robohelix.webp',
  'train-cabin-kitchen': '2026/04/Velocity-Melbourne-Trains-Project.webp',
  'oconnell-st-mezzanine': '2026/04/6-O_Connel-St-Sydney_1.jpg',
  'oventus-mouthpieces': '2026/04/OventusDevice.jpeg',
  'mogul-line-machinery': '2026/04/Scan-2020-08-30_16-10-55-4-m.jpg',
  'orica-bulk-master': '2026/04/BM-Series.jpg',
  'whyalla-blast-furnace': '2026/04/BLAST-FURNACE-MAINTENANCE-PROJECT-FOR-ONE-STEEL-WHYALLA1.jpeg',
  'bluescope-coke-plant-5': '2026/04/BLUESCOPE-STEEL-COKE-PLANT-NO.5-DESIGN-PROJECT3.jpg',
  'nepean-bulk-handling': '2026/04/BULK-MATERIAL-HANDLING-PROJECT-FOR-NEPEAN-CONVEYORS4.jpeg',
  'bluescope-coke-plant-6': '2026/04/BLUESCOPE-STEEL-COKE-PLANT-NO.6-MAINTENANCE-PROJECT3.jpg',
};

/**
 * How each image meets the dark KEVOS ground. Line drawings on white paper are inverted so their
 * lines read light on dark; renders on a white background keep their tones and have the background
 * (the near-white area connected to the edges) knocked out. Transparent backgrounds become dark.
 */
const GROUND = {
  'alexandria-bridge': 'invert',
  'residential-cdc': 'invert',
  'oconnell-st-mezzanine': 'invert',
  'bin-collection-system': 'invert',
  'mogul-line-machinery': 'knockout',
  'whyalla-blast-furnace': 'knockout',
};

const WIDTHS = [480, 960];
const SHADOW = [15, 15, 14]; // KEVOS charcoal
const HIGHLIGHT = [156, 147, 133]; // warm grey, kept dark enough for orange linework to read
const ORANGE = [255, 106, 19]; // KEVOS orange

async function source(id, rel) {
  const file = path.join(cacheDir, `${id}${path.extname(rel)}`);
  if (!fs.existsSync(file)) {
    const res = await fetch(GHOST + rel);
    if (!res.ok) throw new Error(`${id}: download failed (${res.status})`);
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file);
}

const percentile = (values, p) => {
  const hist = new Uint32Array(256);
  for (const v of values) hist[v]++;
  let target = values.length * p, sum = 0;
  for (let i = 0; i < 256; i++) { sum += hist[i]; if (sum >= target) return i; }
  return 255;
};

/** Flattens transparency onto black and trims uniform borders, re-padding with the border colour. */
async function framed(buffer) {
  const flat = await sharp(buffer).rotate().flatten({ background: '#000000' }).png().toBuffer({ resolveWithObject: true });
  const { data: corner } = await sharp(flat.data).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const trimmed = await sharp(flat.data).trim({ threshold: 18 }).png().toBuffer({ resolveWithObject: true }).catch(() => flat);
  const cut = trimmed.info.width < flat.info.width * 0.96 || trimmed.info.height < flat.info.height * 0.96;
  if (!cut) return flat.data;
  const pad = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 0.05);
  return sharp(trimmed.data).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: corner[0], g: corner[1], b: corner[2] } }).png().toBuffer();
}

async function layers(id, buffer, width) {
  const frame = { width, height: Math.round(width * 0.625), fit: 'inside' };
  const prepared = sharp(buffer).resize(frame).greyscale();
  const { data: lum, info } = await prepared.clone().raw().toBuffer({ resolveWithObject: true });
  const { data: soft } = await prepared.clone().blur(width > 600 ? 1.1 : 0.8).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const n = w * h;

  let white = 0;
  for (let i = 0; i < n; i++) if (lum[i] > 232) white++;
  const mode = GROUND[id] ?? (white / n > 0.6 ? 'invert' : 'none');
  const ground = new Uint8Array(n);
  if (mode === 'knockout') {
    // Flood-fill the near-white background from the image edges.
    const queue = [];
    const seed = (i) => { if (!ground[i] && lum[i] > 226) { ground[i] = 1; queue.push(i); } };
    for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
    while (queue.length) {
      const i = queue.pop(), x = i % w;
      if (x > 0) seed(i - 1);
      if (x < w - 1) seed(i + 1);
      if (i >= w) seed(i - w);
      if (i < n - w) seed(i + w);
    }
  }
  const lo = percentile(lum, 0.01), hi = Math.max(lo + 1, percentile(lum, 0.99));

  const base = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) {
    let t = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)));
    if (mode === 'invert') t = 1 - t;
    if (ground[i]) t = 0;
    t = Math.pow(t, 1.15);
    for (let c = 0; c < 3; c++) base[i * 3 + c] = Math.round(SHADOW[c] + (HIGHLIGHT[c] - SHADOW[c]) * t);
  }

  // Sobel edge strength on the softened image, kept to the strongest ~11% so photos stay legible.
  const mag = new Uint8Array(n);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = (yy, xx) => soft[yy * w + xx];
    const gx = -p(y - 1, x - 1) - 2 * p(y, x - 1) - p(y + 1, x - 1) + p(y - 1, x + 1) + 2 * p(y, x + 1) + p(y + 1, x + 1);
    const gy = -p(y - 1, x - 1) - 2 * p(y - 1, x) - p(y - 1, x + 1) + p(y + 1, x - 1) + 2 * p(y + 1, x) + p(y + 1, x + 1);
    mag[y * w + x] = Math.min(255, Math.hypot(gx, gy) / 4);
  }
  const t0 = Math.max(12, percentile(mag, 0.89)), t1 = Math.max(t0 + 1, percentile(mag, 0.995));
  const lines = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const a = Math.min(1, Math.max(0, (mag[i] - t0) / (t1 - t0)));
    lines[i * 4] = ORANGE[0]; lines[i * 4 + 1] = ORANGE[1]; lines[i * 4 + 2] = ORANGE[2];
    lines[i * 4 + 3] = Math.round(255 * Math.pow(a, 0.7));
  }

  await sharp(base, { raw: { width: w, height: h, channels: 3 } }).webp({ quality: 70 }).toFile(path.join(outDir, `${id}-base-${width}.webp`));
  await sharp(lines, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 78, alphaQuality: 80 }).toFile(path.join(outDir, `${id}-lines-${width}.webp`));
  return { w, h, mode };
}

fs.mkdirSync(outDir, { recursive: true });
const report = {};
for (const [id, rel] of Object.entries(SOURCES)) {
  const buffer = await framed(await source(id, rel));
  for (const width of WIDTHS) report[id] = await layers(id, buffer, width);
  console.log(`${id}: ${report[id].w}×${report[id].h} ${report[id].mode}`);
}
fs.writeFileSync(path.join(root, 'src/data/work-visuals.json'), `${JSON.stringify(Object.fromEntries(Object.entries(report).map(([id, r]) => [id, [r.w, r.h]])), null, 2)}\n`);
