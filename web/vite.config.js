// Dev server on :5173 forwards API and WebSocket calls to the backend on :3000
// (or API_TARGET, e.g. API_TARGET=http://localhost:3100 npm run dev).
// Production: `npm run build` -> dist/, served by the backend itself.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = process.env.API_TARGET || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': target,
      '/socket.io': { target, ws: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 900 },
});
