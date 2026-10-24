// Admin website. Dev server on :5174 forwards API calls to the backend on :3000.
// Production: `npm run build` -> dist/, served by the backend for ADMIN_DOMAIN only.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5174, proxy: { '/api': 'http://localhost:3000' } },
  build: { outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 900 },
});
