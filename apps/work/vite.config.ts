import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative addresses: the same build serves the root of a host (work.kevos.com) and a path of another site
  // (bizomat.ai/tasks). The Worker puts <base href> first in each page, and the files resolve against it.
  base: './',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8787', changeOrigin: false, ws: true },
    },
  },
});
