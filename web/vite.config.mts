/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, 'VITE_');

  // override via web/.env.local -> VITE_API_URL=http://127.0.0.1:3000
  const API_TARGET = (env['VITE_API_URL'] || 'http://127.0.0.1:3000').trim();

  console.log(`[vite] mode=${mode} proxy /api -> ${API_TARGET}`);

  return {
    root: __dirname,
    cacheDir: resolve(__dirname, '../node_modules/.vite/web'),
    plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

    server: {
      port: 4200,
      strictPort: true,

      // ✅ proxy EVERYTHING under /api to Nest
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true,
          secure: false, // ✅ must be false for http targets
          ws: false,
        },
      },
    },

    build: {
      outDir: resolve(__dirname, '../dist/web'),
      emptyOutDir: true,
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
        provider: 'v8' as const,
      },
    },
  };
});
