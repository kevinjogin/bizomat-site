// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';
import rehypeWrapTables from './src/utils/rehype-wrap-tables.ts';

// Utility pages that should never appear in search results or the sitemap.
const EXCLUDE_FROM_SITEMAP = ['/search/', '/chat/', '/contact/sent/', '/contact/error/'];

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keep every stylesheet external so the Content-Security-Policy can forbid inline styles.
    inlineStylesheets: 'never',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !EXCLUDE_FROM_SITEMAP.some((path) => page.endsWith(path)),
    }),
  ],
  markdown: {
    // Prism emits CSS classes rather than inline styles (CSP-friendly). Token colours live in global.css.
    syntaxHighlight: 'prism',
    rehypePlugins: [rehypeWrapTables],
  },
  image: {
    responsiveStyles: false,
  },
});
