// Builds the BIZOMAT ERP design prototype on its own: entry erp-design-preview/index.html, output
// dist/erp-design-preview, relative addresses (base './') so the files open from any folder or path. The app's own
// build (vite.config.ts) never includes it. Design work only: demonstration data, no server calls. Published on
// bizomat.ai/erp-design-preview/ by infrastructure/fly/Dockerfile (stage erp-preview) as static files for the website.
//   npm run dev:erp-preview     http://localhost:5174/erp-design-preview/
//   npm run build:erp-preview   dist/erp-design-preview/
//   npx vite preview --config vite.erp-preview.config.ts   http://localhost:4174/erp-design-preview/
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(({ command, isPreview }) => {
  const dev = command === 'serve' && !isPreview;
  return {
    plugins: [react()],
    // The build starts from the prototype's folder, so its index.html lands at the top of outDir. The dev server
    // starts one level up, so it can serve the prototype's source files, and answers at /erp-design-preview/.
    root: dev ? here('.') : here('./erp-design-preview'),
    // Fonts and favicon come from the app's public folder; with base './' Vite writes them as relative addresses
    // (the CSS asks for ../fonts/..., next to the assets folder).
    publicDir: here('./public'),
    base: dev ? '/' : isPreview ? '/erp-design-preview/' : './',
    build: {
      outDir: here('./dist/erp-design-preview'),
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 900,
    },
    server: {
      port: 5174,
      fs: { allow: [here('.')] },
    },
    preview: {
      port: 4174,
    },
  };
});
