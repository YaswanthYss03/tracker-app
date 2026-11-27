// Dev server on :5173 forwards API and WebSocket calls to the backend on :3000
// (or API_TARGET, e.g. API_TARGET=https://15-135-38-209.sslip.io npm run dev).
// Production: `npm run build` -> dist/, served by the backend itself.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = process.env.API_TARGET || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target, changeOrigin: true },
      '/socket.io': { target, ws: true, changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('leaflet')) return 'leaflet';
          if (id.includes('react-router')) return 'router';
          if (id.includes('@tanstack') || id.includes('socket.io') || id.includes('engine.io')) return 'data';
          return undefined;
        },
      },
    },
  },
});
