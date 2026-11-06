// The site address every SEO script uses: seo/config.json "site" (the website's canonical address, the same as
// SITE.url in src/config/site.ts, which tests/seo.test.ts checks). Change it there, nowhere else.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo', 'config.json'), 'utf8'));
export const SITE = String(CONFIG.site).replace(/\/$/, '');
export const HOST = new URL(SITE).hostname;
/** SITE for a regular expression ("https://bizomat\\.ai"). */
export const SITE_RE = SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
