// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';

// Utility pages that should never appear in search results or the sitemap.
const EXCLUDE_FROM_SITEMAP = ['/contact/sent/', '/contact/error/'];

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keep every stylesheet external so the Content-Security-Policy can forbid inline styles.
    inlineStylesheets: 'never',
  },
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDE_FROM_SITEMAP.some((path) => page.endsWith(path)),
    }),
  ],
  image: {
    responsiveStyles: false,
  },
});
