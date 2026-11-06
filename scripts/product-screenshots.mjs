// Converts product screenshots (PNG, captured at 1440 x 900 with deviceScaleFactor 2) in public/proof-of-work/product/
// into 1440-pixel WebP files for the website, under the names src/data/screenshots.ts lists, and removes the PNGs.
import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const dir = 'public/proof-of-work/product';
// Capture names -> published names (src/data/screenshots.ts).
const NAMES = {
  'work-sign-in': 'work-signin', 'work-board-table': 'work-table', 'work-board-kanban': 'work-kanban', 'work-timeline': 'work-timeline',
  'work-dashboard': 'work-dashboard', 'work-document': 'work-document', 'work-my-work': 'work-mywork',
  'cad-overview': 'cad-overview', 'cad-product': 'cad-overview', 'cad-signin': 'cad-signin', 'cad-sign-in': 'cad-signin', 'cad-dashboard': 'cad-dashboard',
  'cad-home': 'cad-dashboard', 'cad-assistant': 'cad-assistant', 'cad-solidworks': 'cad-solidworks', 'cad-tools': 'cad-tools',
};
let n = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
  const base = file.replace(/\.png$/, '');
  const name = NAMES[base] ?? base;
  await sharp(join(dir, file)).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(join(dir, `${name}.webp`));
  unlinkSync(join(dir, file));
  n++;
}
console.log(`Product screenshots converted: ${n}`);
