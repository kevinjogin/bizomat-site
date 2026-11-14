// Builds the BIZOMAT System preview on its own (the clickable design of the whole system, called ERP until the owner
// renamed it on 14 Nov 2026): entry system-preview/index.html, output dist/system-preview, relative addresses
// (base './') so the files open from any folder or path. The app's own build (vite.config.ts) never includes it.
// Design work only: demonstration data, no server calls. Published on bizomat.ai/system-preview/ by
// infrastructure/fly/Dockerfile (stage system-preview) as static files for the website.
//   npm run dev:system-preview     http://localhost:5174/system-preview/
//   npm run build:system-preview   dist/system-preview/
//   npx vite preview --config vite.system-preview.config.ts   http://localhost:4174/system-preview/
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig(({ command, isPreview }) => {
  const dev = command === 'serve' && !isPreview;
  return {
    plugins: [react()],
    // The build starts from the prototype's folder, so its index.html lands at the top of outDir. The dev server
    // starts one level up, so it can serve the prototype's source files, and answers at /system-preview/.
    root: dev ? here('.') : here('./system-preview'),
    // Fonts and favicon come from the app's public folder; with base './' Vite writes them as relative addresses
    // (the CSS asks for ../fonts/..., next to the assets folder).
    publicDir: here('./public'),
    base: dev ? '/' : isPreview ? '/system-preview/' : './',
    build: {
      outDir: here('./dist/system-preview'),
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
