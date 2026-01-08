/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// ✅ ESM-safe __dirname for .mts
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Use Vite env (recommended). For dev, you can set VITE_API_URL in web/.env.local
const API_TARGET =
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export default defineConfig({
  root: __dirname,
  cacheDir: resolve(__dirname, '../node_modules/.vite/web'),
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  // ✅ Local dev server
  server: {
    port: 4200, // keep if you want Angular-like default; change if you prefer 5173
    strictPort: true,

    // ✅ Proxy API calls to Nest (same-origin in browser -> avoids CORS problems)
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true
      }
    }
  },

  // ✅ Emit build output to workspaceRoot/dist/web (Vercel outputDirectory)
  build: {
    outDir: resolve(__dirname, '../dist/web'),
    emptyOutDir: true
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: resolve(__dirname, '../coverage/web'),
      provider: 'v8' as const
    }
  }
});
