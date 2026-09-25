import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(appRoot, '../..');

export default defineConfig({
  root: appRoot,
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': workspaceRoot } },
  server: {
    host: '0.0.0.0',
    port: 5173,
    fs: { allow: [workspaceRoot] },
    proxy: { '/api': 'http://localhost:3000' },
  },
  build: { outDir: path.join(appRoot, 'dist'), emptyOutDir: true },
});

